"use client"
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

import Image from "next/image";
import { useState } from "react";
import ImportRepoModal from "./github-repo-modal";
import GithubRepoModal from "./github-repo-modal";

const AddRepo = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleImportClick = () => {
    console.log(session);

    if (session?.user.provider !== "github") {
      alert("connect with github first");
      return

    }
    setIsModalOpen(true)
  }

  return (
    <>
    <div
      onClick={handleImportClick}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 
      dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-2xl hover:scale-[1.02] cursor-pointer 
      transition-all duration-500 ease-in-out flex justify-between items-center p-6 backdrop-blur-md"
    >
      {/* Gradient Border Hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#E93F3F] via-orange-500 to-yellow-400 opacity-0 group-hover:opacity-20 transition-opacity duration-700" />

      <div className="flex items-start gap-4 z-10">
        <Button
          variant="outline"
          size="icon"
          className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 
          text-gray-700 dark:text-gray-200 group-hover:text-[#E93F3F] group-hover:border-[#E93F3F] 
          transition-all duration-300 hover:translate-y-1"
        >
          <ArrowDown size={28} />
        </Button>

        <div>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-[#E93F3F] via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Import from GitHub
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
            Connect your GitHub repository and start coding instantly.
          </p>
        </div>
        

      </div>
      
      <Image
        src="/addGithub.svg"
        alt="Open GitHub repository"
        width={150}
        height={150}
        className="z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
      />
    </div>
    <GithubRepoModal
    open={isModalOpen}
    onOpenChange={setIsModalOpen}
    githubToken={session?.user.githubAccessToken || ""}
  />
  </>
  );
};

export default AddRepo;
