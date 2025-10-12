"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import TemplateSelectionModal from "./template-seleceting-modal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createPlayground } from "../actions";

const AddNewButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  }) => {
    setSelectedTemplate(data);
    const res = await createPlayground({
      ...data,
      description: data.description || "",
    });
    toast.success("Playground created successfully 🎉");
    setIsModalOpen(false);
    router.push(`/playground/${res?.id}`);
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 
        dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-2xl hover:scale-[1.02] cursor-pointer 
        transition-all duration-500 ease-in-out flex justify-between items-center p-6 backdrop-blur-md"
      >
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-rose-500 via-fuchsia-500 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-700" />

        <div className="flex items-start gap-4 z-10">
          <Button
            variant="outline"
            size="icon"
            className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 
            text-gray-700 dark:text-gray-200 group-hover:text-[#E93F3F] group-hover:border-[#E93F3F] 
            transition-all duration-300 hover:rotate-90 hover:bg-[#fff8f8]"
          >
            <Plus size={28} />
          </Button>

          <div>
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-[#E93F3F] via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Create Playground
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
              Start a new coding environment instantly with live preview.
            </p>
          </div>
        </div>

        <Image
          src="/AddNew.svg"
          alt="Add new project"
          width={150}
          height={150}
          className="z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
        />
      </div>

      {/* Template Selection Modal */}
      <TemplateSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddNewButton;
