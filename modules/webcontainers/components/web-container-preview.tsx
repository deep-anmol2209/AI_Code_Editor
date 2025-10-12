"use client"

import React, {useEffect, useState, useRef} from "react";
import { transformToWebContainerFormat } from "../hooks/transformer";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { TemplateFolder } from '@/modules/playground/utils/playground-utils';
import { WebContainer } from '@webcontainer/api';
import { ur } from "zod/v4/locales";
import { WriteStream } from "node:fs";
import TerminalComponent from "./terminal";


interface WebContainerPreviewProps {
    templateData: TemplateFolder;
    serverUrl: string;
    isLoading: boolean;
    error: string | null;
    instance: WebContainer | null;
    writeFileSync: (path: string, content: string) => Promise<void>;
    forceResetup?: boolean; // Optional prop to force re-setup
}


function WebContainerPreview({
    templateData,
    serverUrl,
    isLoading,
    error,
    writeFileSync,
    instance,
    forceResetup = false }: WebContainerPreviewProps) {
    console.log("started container");
    
        const [currentStep, setCurrentStep]= useState(0);
        const totalSteps=4;
        const [previewUrl, setPreviewUrl]= useState<string | undefined>();
        const [setupError, setSetupError]= useState<string | null>(null)
        const [loadingState, setLoadingState]= useState({
            transforming: false,
            mounting: false,
            installing: false,
            starting: false,
            ready: false
        });

        const [isSetupComplete, setIsSetupComplete]= useState(false)
        const [isSetupInProgress, setIsSetupProgress]= useState(false)
        const terminalRef= useRef<any>(null)

          // Reset setup state when forceResetup changes
  useEffect(() => {
    if (forceResetup) {
      setIsSetupComplete(false);
      setIsSetupProgress(false);
      setPreviewUrl("");
      setCurrentStep(0);
      setLoadingState({
        transforming: false,
        mounting: false,
        installing: false,
        starting: false,
        ready: false,
      });
    }
  }, [forceResetup]);


        useEffect(()=>{
            async function setupContainer(){
                if(!instance || isSetupComplete || isSetupInProgress) return;

                try {
                    setIsSetupProgress(true);
                    setSetupError(null);
                    try {
                      const packageJsonExists = await instance.fs.readFile("package.json");
                      if(packageJsonExists){
                        if(terminalRef.current?.writeToTerminal){
                                        terminalRef.current.writeToTerminal("reconnecting to existing webcontainer session")
                        }
                        instance.on("server-ready", (port: number, url: string)=>{
                          if(terminalRef.current?.writeToTerminal){
                            terminalRef.current.writeToTerminal(`reconnect to server at ${ur}\r\n`)
            }

                            setPreviewUrl(url);

                            setLoadingState((prev)=>({...prev, starting:true}))
                            return;
                        })
                      }
                    } catch (error) {
                        
                    }

                    setLoadingState((prev)=>({...prev, transforming:true}))
                    setCurrentStep(1);
                    if(terminalRef.current?.writeToTerminal){
                      terminalRef.current.writeToTerminal("transforming template data...\r\n")
      }
                    //@ts-ignore
                    const files= transformToWebContainerFormat(templateData);

                    setLoadingState((prev)=>({...prev,transforming:false,mounting: true}));
                    setCurrentStep(2);

                    //mounting files

                    if(terminalRef.current?.writeToTerminal){
                      terminalRef.current.writeToTerminal("mounting file to new webcontainer...\r\n")
      }
                    await instance.mount(files);

                    if(terminalRef.current?.writeToTerminal){
                      terminalRef.current.writeToTerminal("files mounted successfully\r\n")
      }
                    setLoadingState((prev)=>({...prev, mounting:false, installing: true}))
                    setCurrentStep(3);

                    //step 3 install dependency
                    if(terminalRef.current?.writeToTerminal){
                      terminalRef.current.writeToTerminal("installing dependencies...\r\n")
      }
                    const installProcess= await instance.spawn("npm", ["install"])
                    installProcess.output.pipeTo(
                        new WritableStream({
                            write(data){
                              if(terminalRef.current?.writeToTerminal){
                                terminalRef.current.writeToTerminal(data)
                }
                            }
                        })
                    )

                    const installExitCode = await installProcess.exit;

                    if(installExitCode !==0){
                        throw new Error(`failed to install dependencies exit code ${installExitCode}`)
                    }
                    if(terminalRef.current?.writeToTerminal){
                      terminalRef.current.writeToTerminal(`dependencies installed successfully`)
      }
                    setLoadingState((prev)=>({...prev, installing: false, starting:true}))
                    setCurrentStep(4);

                    //step 4 
                    if(terminalRef.current?.writeToTerminal){
                      terminalRef.current.writeToTerminal(`startging development server...\r\n`)
      }

                    const startProcess = await instance.spawn("npm", ["run", "start"]);

                    instance.on("server-ready", (port: number, url: string)=>{

                      if(terminalRef.current?.writeToTerminal){
                        terminalRef.current.writeToTerminal(`server ready at ${url}\r\n`)
        }
                        setPreviewUrl(url)
                        setLoadingState((prev)=>({...prev, starting:false, ready: true}))
                     

                    setIsSetupComplete(true);
                    setIsSetupProgress(false);
                });

                startProcess.output.pipeTo(
                    new WritableStream({
                        write(data){
                            if(terminalRef.current?.writeToTerminal){
                                terminalRef.current.writeToTerminal(data);
                            }
                        },
                        
                    })
                )

                } catch (error) {
                    console.error("error in setting up containers: ", error);
                    const errorMessage= error instanceof Error ? error.message : String(error);
                    if(terminalRef.current?.writeToTerminal){
                      terminalRef.current.writeToTerminal(`error: ${errorMessage}`)
      }
                    setSetupError(errorMessage);
                    setIsSetupProgress(false)
           setLoadingState({transforming: false,
            mounting: false,
            installing: false,
            starting: false,
            ready: false})
                    
                }
            }
            setupContainer()
        },[instance, templateData, isSetupComplete, isSetupInProgress])

        useEffect(()=>{
            return ()=>{

            }
        },[])

        if (isLoading) {
            return (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md p-6 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                  <h3 className="text-lg font-medium">Initializing WebContainer</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Setting up the environment for your project...
                  </p>
                </div>
              </div>
            );
          }

          if (error || setupError) {
            return (
              <div className="h-full flex items-center justify-center">
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg max-w-md">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="h-5 w-5" />
                    <h3 className="font-semibold">Error</h3>
                  </div>
                  <p className="text-sm">{error || setupError}</p>
                </div>
              </div>
            );
          }

          const getStepIcon = (stepIndex: number) => {
            if (stepIndex < currentStep) {
              return <CheckCircle className="h-5 w-5 text-green-500" />;
            } else if (stepIndex === currentStep) {
              return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
            } else {
              return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
            }
          };
        
          const getStepText = (stepIndex: number, label: string) => {
            const isActive = stepIndex === currentStep;
            const isComplete = stepIndex < currentStep;
        
            return (
              <span
                className={`text-sm font-medium ${
                  isComplete
                    ? "text-green-600"
                    : isActive
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {label}
              </span>
            );
          };
    return (
        <div className="h-full w-full flex flex-col">
        {!previewUrl ? (
          <div className="h-full flex flex-col">
            <div className="w-full max-w-md p-6 m-5 rounded-lg bg-white dark:bg-zinc-800 shadow-sm mx-auto">
              <Progress
                value={(currentStep / totalSteps) * 100}
                className="h-2 mb-6"
              />
  
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  {getStepIcon(1)}
                  {getStepText(1, "Transforming template data")}
                </div>
                <div className="flex items-center gap-3">
                  {getStepIcon(2)}
                  {getStepText(2, "Mounting files")}
                </div>
                <div className="flex items-center gap-3">
                  {getStepIcon(3)}
                  {getStepText(3, "Installing dependencies")}
                </div>
                <div className="flex items-center gap-3">
                  {getStepIcon(4)}
                  {getStepText(4, "Starting development server")}
                </div>
              </div>
            </div>
  
            {/* Terminal */}
            <div className="flex-1 p-4">
              <TerminalComponent
                ref={terminalRef}
                webContainerInstance={instance}
                theme="dark"
                className="h-full"
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex-1">
              <iframe
                src={previewUrl}
                className="w-full h-full border-none"
                title="WebContainer Preview"
              />
            </div>
  
            <div className="h-64 border-t">
              <TerminalComponent
                ref={terminalRef}
                webContainerInstance={instance}
                theme="dark"
                className="h-full"
              />
            </div>
          </div>
        )}
      </div>
    )
}

export default WebContainerPreview