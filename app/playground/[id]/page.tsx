"use client";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { usePlayground } from "@/modules/playground/hooks/usePlayground";
import { useParams } from "next/navigation";
import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { TemplateFileTree } from "@/modules/playground/components/playground-explorer";
import { useFileExplorer } from "@/modules/playground/hooks/useFileExplorer";
import { AlertCircle, FileText, FolderOpen, Save, Settings, X } from "lucide-react";
import { TemplateFile, TemplateFolder } from "@/modules/playground/utils/playground-utils";
import { Tooltip } from "@/components/ui/tooltip";
import { Bot } from "lucide-react";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import PlaygroundEditor from "@/modules/playground/components/playground-editor";
import { writeFileSync } from "node:fs";
import { useWebContainer } from "@/modules/webcontainers/hooks/useWebContainer";
import WebContainerPreview from "@/modules/webcontainers/components/web-container-preview";
import LoadingStep from "@/modules/playground/components/loader";
import { findFilePath } from "@/modules/playground/lib";
import { toast } from "sonner";
import ToggleAI from "@/modules/playground/components/toggle-ai";
import { useAISuggestions } from "@/modules/playground/hooks/useAISuggestion";
import { editor } from "monaco-editor";

const MainPlaygroundPage = () => {
  const { id } = useParams<{ id: string }>();
  const { playgroundData, templateData, isLoading, error, saveTemplateData } = usePlayground(id)
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
 const aiSuggestion= useAISuggestions()
  const { setActiveFileId,
    closeAllFiles,
    closeFile,
    openFile,
    openFiles,
    setTemplateData,
    setPlaygroundId,
    activeFileId,
    setOpenFiles,
    handleAddFile,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    handleAddFolder,
    updateFileContent

  } = useFileExplorer()

  const {serverUrl, isLoading:containerLoading, error:containerError, instance, 
    //@ts-expect-error: writeFileSync is being destructured from useWebContainer, which may not match TypeScript's inferred types
    writeFileSync}= useWebContainer({templateData})
    const lastSyncedContent= useRef<Map<string, string>>(new Map());

  useEffect(() => {
    setPlaygroundId(id)
  }, [id, setPlaygroundId])

  useEffect(() => {
    if (templateData && !openFiles.length)
      setTemplateData(templateData)
  }, [templateData, setTemplateData, openFiles.length])

  // Create wrapper functions that pass saveTemplateData
  const wrappedHandleAddFile = useCallback(
    (newFile: TemplateFile, parentPath: string) => {
      return handleAddFile(
        newFile,
        parentPath,
        writeFileSync!,
        instance,
        saveTemplateData
      );
    },
    [handleAddFile, writeFileSync, instance, saveTemplateData]
  );

  const wrappedHandleAddFolder = useCallback(
    (newFolder: TemplateFolder, parentPath: string) => {
      return handleAddFolder(newFolder, parentPath, instance, saveTemplateData);
    },
    [handleAddFolder, instance, saveTemplateData]
  );

  const wrappedHandleDeleteFile = useCallback(
    (file: TemplateFile, parentPath: string) => {
      return handleDeleteFile(file, parentPath, saveTemplateData);
    },
    [handleDeleteFile, saveTemplateData]
  );

  const wrappedHandleDeleteFolder = useCallback(
    (folder: TemplateFolder, parentPath: string) => {
      return handleDeleteFolder(folder, parentPath, saveTemplateData);
    },
    [handleDeleteFolder, saveTemplateData]
  );

  const wrappedHandleRenameFile = useCallback(
    (
      file: TemplateFile,
      newFilename: string,
      newExtension: string,
      parentPath: string
    ) => {
      return handleRenameFile(
        file,
        newFilename,
        newExtension,
        parentPath,
        saveTemplateData
      );
    },
    [handleRenameFile, saveTemplateData]
  );

  const wrappedHandleRenameFolder = useCallback(
    (folder: TemplateFolder, newFolderName: string, parentPath: string) => {
      return handleRenameFolder(
        folder,
        newFolderName,
        parentPath,
        saveTemplateData
      );
    },
    [handleRenameFolder, saveTemplateData]
  );

  console.log(templateData);
  console.log(playgroundData);

  const activeFile = openFiles.find((file) => file.id === activeFileId)
  const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges)

  const handleFileSelect = (file: TemplateFile) => {
    console.log("click on file");

    openFile(file)
  }

const handleSave= useCallback(async(fileId?: string)=>
  {
    const targetedFileId= fileId || activeFileId;
    if(!targetedFileId) return;
    
    const fileToSave = openFiles.find((f)=>f.id === targetedFileId);

    const latestTemplateData= useFileExplorer.getState().templateData; 
    if(!latestTemplateData) return;
    
    try {
      const filePath = findFilePath(fileToSave!, latestTemplateData);
      console.log("file path: ", filePath);
      
  if (!filePath) {
    toast.error(
      `Could not find path for file: ${fileToSave?.filename}.${fileToSave?.fileExtension}`
    );
    return;
  }

const updatedTemplateData = JSON.parse(
    JSON.stringify(latestTemplateData)
  );


  const updateFileContent = (items: (TemplateFolder | TemplateFile)[]): (TemplateFolder | TemplateFile)[] => {
    return items.map((item) => {
      if ("folderName" in item) {
        return { ...item, items: updateFileContent(item.items) }; // recursive call
      } else if (
        item.filename === fileToSave?.filename &&
        item.fileExtension === fileToSave?.fileExtension
      ) {
        return { ...item, content: fileToSave?.content };
      }
      return item;
    });
  };
  
  updatedTemplateData.items = updateFileContent(
    updatedTemplateData.items
  );

    // Sync with WebContainer
  if (writeFileSync) {
    await writeFileSync(filePath, fileToSave!.content);
    lastSyncedContent.current.set(fileToSave!.id, fileToSave!.content);
    if (instance && instance.fs) {
      await instance.fs.writeFile(filePath, fileToSave!.content);
    }
  }

     const newTemplateData = await saveTemplateData(updatedTemplateData);
  setTemplateData(newTemplateData! || updatedTemplateData);
// Update open files
  const updatedOpenFiles = openFiles.map((f) =>
    f.id === targetedFileId
      ? {
          ...f,
          content: fileToSave!.content,
          originalContent: fileToSave!.content,
          hasUnsavedChanges: false,
        }
      : f
  );
  setOpenFiles(updatedOpenFiles);

toast.success(
    `Saved ${fileToSave!.filename}.${fileToSave!.fileExtension}`
  );
} catch (error) {
   console.error("Error saving file:", error);
  toast.error(
    `Failed to save ${fileToSave!.filename}.${fileToSave!.fileExtension}`
  );
  throw error;
}

  },[activeFileId, openFiles, writeFileSync, instance, setTemplateData, saveTemplateData, setOpenFiles])



  const handleSaveAll = async () => {
    const unsavedFiles = openFiles.filter((f) => f.hasUnsavedChanges);

    if (unsavedFiles.length === 0) {
      toast.info("No unsaved changes");
      return;
    }

    try {
      await Promise.all(unsavedFiles.map((f) => handleSave(f.id)));
      toast.success(`Saved ${unsavedFiles.length} file(s)`);
    } catch (error) {
      toast.error("Failed to save some files");
    }
  };

  useEffect(()=>{
    const handleKeydown= (e: KeyboardEvent)=>{
      console.log("key");
      
      if(e.ctrlKey &&  e.key==="s"){
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return ()=> window.removeEventListener("keydown", handleKeydown);
  },[handleSave])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="destructive">
          Try Again
        </Button>
      </div>
    );
  }

    // Loading state
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
          <div className="w-full max-w-md p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Loading Playground
            </h2>
            <div className="mb-8">
              <LoadingStep
                currentStep={1}
                step={1}
                label="Loading playground data"
              />
              <LoadingStep
                currentStep={2}
                step={2}
                label="Setting up environment"
              />
              <LoadingStep currentStep={3} step={3} label="Ready to code" />
            </div>
          </div>
        </div>
      );
    }

    if (!templateData) {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
          <FolderOpen className="h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-xl font-semibold text-amber-600 mb-2">
            No template data available
          </h2>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reload Template
          </Button>
        </div>
      );
    }

  return (
    <>
      <TooltipProvider>
        <TemplateFileTree
          data={templateData!}
          onFileSelect={handleFileSelect}
          selectedFile={activeFile}
          title="file Explorer"
          onAddFile={wrappedHandleAddFile}
          onAddFolder={wrappedHandleAddFolder}
          onDeleteFile={wrappedHandleDeleteFile}
          onDeleteFolder={wrappedHandleDeleteFolder}
          onRenameFile={wrappedHandleRenameFile}
          onRenameFolder={wrappedHandleRenameFolder}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <div className="flex flex-1 items-center gap-2">
              <div className="flex flex-col flex-1">
                <h1 className="text-sm font-medium">
                  {playgroundData?.title || "Code Playground"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {openFiles.length} File(s) Open
                  {hasUnsavedChanges && " * unsaved changes"}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild >
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={()=> handleSave()}
                      disabled={!activeFile || !activeFile.hasUnsavedChanges}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent> save (ctrl+S)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={handleSaveAll}
                      disabled={!hasUnsavedChanges}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent> save (ctrl+shift+S)</TooltipContent>
                </Tooltip>
               
               <ToggleAI
               isEnabled={aiSuggestion.isEnabled}
               onToggle={aiSuggestion.toggleEnabled}
               suggestionLoading={aiSuggestion.isLoading}
               />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                    >
                      {isPreviewVisible ? "Hide" : "Show"} Preview
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={closeAllFiles}>
                      Close All Files
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <div className="h-[calc(100vh-4rem)]">
            {
              openFiles.length > 0 ? (
                <div className="h-full flex flex-col">
                  <div className="border-b bg-muted/39">
                    <Tabs value={activeFileId || ""} onValueChange={setActiveFileId}>
                      <div className="flex items-center justify-between px-4 py-2">
                        <TabsList className="h-8 bg-transparent p-0">
                          {openFiles.map((file) => (
                            <TabsTrigger
                              key={file.id}
                              value={file.id}
                              className="relative h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm group"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-3 w-3" />
                                <span>
                                  {file.filename}.{file.fileExtension}
                                </span>
                                {file.hasUnsavedChanges && (
                                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                                )}
                                <span
                                  className="ml-2 h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    closeFile(file.id);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </span>
                              </div>
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {openFiles.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={closeAllFiles}
                            className="h-6 px-2 text-xs"
                          >
                            Close All
                          </Button>
                        )}
                      </div>

                    </Tabs>

                  </div>
                  <div className="flex-1">
                    <ResizablePanelGroup direction="horizontal" className="h-full">
                      <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
                        <PlaygroundEditor
                          activeFile={activeFile}
                          content={activeFile?.content || ""}
                          onContentChange={(value)=> activeFileId && updateFileContent(activeFileId, value)}
                          suggestion={aiSuggestion.suggestion}
                          suggestionLoading={aiSuggestion.isLoading}
                          suggestionPosition={aiSuggestion.position}
                          onAcceptSuggestion={(editor, monaco)=>{aiSuggestion.acceptSuggestion(editor, monaco)}}

                          onRejectSuggestion={(type, )=>{aiSuggestion.rejectSuggestion(type)}}
                          onTriggerSuggestion={(type, editor)=>{aiSuggestion.fetchSuggestion(type, editor)}}
                        />
                      </ResizablePanel>
                      {
                        isPreviewVisible && (
                          <>
                          <ResizableHandle/>
                          <ResizablePanel defaultSize={50}>
                            <WebContainerPreview
                            templateData={templateData}
                            instance={instance}
                            writeFileSync={writeFileSync}
                            isLoading={containerLoading}
                            error={containerError}
                            serverUrl={serverUrl!}
                            forceResetup={false}
                            />
                          </ResizablePanel>
                          </>
                        )
                      }
                    </ResizablePanelGroup>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
                  <FileText className="h-16 w-16 text-gray-300" />
                  <div className="text-center">
                    <p className="text-lg font-medium">No files open</p>
                    <p className="text-sm text-gray-500">
                      Select a file from the sidebar to start editing
                    </p>
                  </div>
                </div>
              )
            }
          </div>

        </SidebarInset>
      </TooltipProvider>
    </>
  )
}

export default MainPlaygroundPage