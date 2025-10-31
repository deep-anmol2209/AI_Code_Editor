"use client";
import JSZip from "jszip"
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { zipToTree } from "@/modules/playground/lib/zip-to-tree";
import { createPlayground } from "../actions";
import { useFileExplorer } from "@/modules/playground/hooks/useFileExplorer";
import { log } from "util";
import { error } from "console";

interface ImportRepoModalProps {
  githubToken: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GithubRepoModal({
  githubToken,
  open,
  onOpenChange,
}: ImportRepoModalProps) {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!open || !githubToken) return;

    const fetchRepos = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://api.github.com/user/repos", {
          headers: {
            Authorization: `Bearer ${githubToken}`,
          },
        });
        const data = await res.json();
        setRepos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [githubToken, open]);

 

  const handleImport = async (repo) => {
    setDownloading(true);
    console.log("repo: ", repo);
    
    try {
      // 1️⃣ Fetch ZIP
     
  
      // 3️⃣ Create playground record
      const playground = await createPlayground({
        title: repo.name,
        description: repo.description ?? "",
        template: "GITHUB",
        repoUrl: repo.archive_url.replace("{archive_format}{/ref}", "zipball/main")
      });
      if(!playground){
        console.log("error in creating playground");
        
        return 
      }
  
      // 4️⃣ Set repo tree in the existing Zustand store
      const { setTemplateData, setPlaygroundId } = useFileExplorer.getState();
      setPlaygroundId(playground.id);
      setTemplateData(repoTree);
  
      // 5️⃣ Navigate to editor
      // window.location.href = `/playground/${playground.id}`;
    } catch (error) {
      console.error("Error importing repo:", error);
    } finally {
      setDownloading(false);
    }
  };
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2
                     rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl focus:outline-none"
        >
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold">
              Select a GitHub Repository
            </Dialog.Title>

            <button
              className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => onOpenChange(false)} // ✅ works
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Fetching repositories...</p>
          ) : repos.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto">
              {repos.map((repo) => (
                <li
                  key={repo.id}
                  className="border p-2 rounded mb-2 hover:bg-gray-100 items-center flex gap-5 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <span className="font-medium">{repo.full_name}</span>
                  <button
                  disabled= {downloading}
                  onClick={()=>{handleImport(repo)}}
                  className="border-1 py-2 px-4"
                  >
                    {downloading ? "Importing...": "Import"}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No repositories found.</p>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
