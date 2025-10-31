
"use client";

import React, { useEffect, useState, useRef } from "react";
import { transformToWebContainerFormat } from "../hooks/transformer";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { TemplateFolder } from "@/modules/playground/utils/playground-utils";
import { WebContainer } from "@webcontainer/api";
import TerminalComponent from "./terminal";

/* ------------------------------------------------------------------
   ✅ Interface Definitions
------------------------------------------------------------------ */
interface WebContainerPreviewProps {
  templateData: TemplateFolder;
  serverUrl: string;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  forceResetup?: boolean; // Optional prop to force re-setup
}

/* ------------------------------------------------------------------
   ⚡ Component
------------------------------------------------------------------ */
function WebContainerPreview({
  templateData,
  serverUrl,
  isLoading,
  error,
  writeFileSync,
  instance,
  forceResetup = false,
}: WebContainerPreviewProps) {
  console.log("🚀 Starting container setup...");

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [setupError, setSetupError] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState({
    transforming: false,
    mounting: false,
    installing: false,
    starting: false,
    ready: false,
  });

  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isSetupInProgress, setIsSetupProgress] = useState(false);
  const terminalRef = useRef<any>(null);

  /* ------------------------------------------------------------
     🔄 Reset setup state when forceResetup changes
  ------------------------------------------------------------ */
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

  /* ------------------------------------------------------------
     ⚙️ Setup WebContainer instance
  ------------------------------------------------------------ */
useEffect(() => {
  async function setupContainer() {
    if (!instance || isSetupComplete || isSetupInProgress || setupError) return;

    console.log("🚀 Starting container setup...");
    setIsSetupProgress(true);
    setSetupError(null);

    try {
      // STEP 1: Transforming
      setLoadingState(prev => ({ ...prev, transforming: true }));
      setCurrentStep(1);
      terminalRef.current?.writeToTerminal("🔧 Transforming template data...\r\n");

      const files = transformToWebContainerFormat(templateData);

      // STEP 2: Mounting
      setLoadingState(prev => ({ ...prev, transforming: false, mounting: true }));
      setCurrentStep(2);
      terminalRef.current?.writeToTerminal("📦 Mounting files to WebContainer...\r\n");
      await instance.mount(files);

      // STEP 3: Installing dependencies
      setLoadingState(prev => ({ ...prev, mounting: false, installing: true }));
      setCurrentStep(3);
      terminalRef.current?.writeToTerminal("📦 Installing dependencies...\r\n");

      const installProcess = await instance.spawn("npm", ["install"]);
      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminalRef.current?.writeToTerminal(data);
          },
        })
      );

      const code = await installProcess.exit;
      if (code !== 0) {
        throw new Error(`Failed to install dependencies (exit code ${code})`);
      }

      // STEP 4: Starting server
      setLoadingState(prev => ({ ...prev, installing: false, starting: true }));
      setCurrentStep(4);
      terminalRef.current?.writeToTerminal("🚀 Starting development server...\r\n");

      const startProcess = await instance.spawn("npm", ["run", "start"]);

      instance.on("server-ready", (port: number, url: string) => {
        terminalRef.current?.writeToTerminal(`✅ Server ready at ${url}\r\n`);
        setPreviewUrl(url);
        setLoadingState(prev => ({ ...prev, starting: false, ready: true }));
        setIsSetupComplete(true);
        setIsSetupProgress(false);
      });

      startProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminalRef.current?.writeToTerminal(data);
          },
        })
      );

    } catch (err) {
      console.error("💥 Error setting up WebContainer:", err);
      const message = err instanceof Error ? err.message : String(err);
      terminalRef.current?.writeToTerminal(`❌ ${message}\r\n`);
      setSetupError(message);
      setIsSetupProgress(false);
      setIsSetupComplete(false);

      // ❗️ Stop re-running automatically — add a manual retry button
    }
  }

  setupContainer();
}, [instance, templateData, isSetupComplete, isSetupInProgress, setupError]);

  /* ------------------------------------------------------------
     🧹 Cleanup (optional)
  ------------------------------------------------------------ */
  useEffect(() => {
    return () => {
      // future teardown logic if needed
    };
  }, []);

  /* ------------------------------------------------------------
     🧱 UI States
  ------------------------------------------------------------ */
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-6 rounded-lg bg-gray-50 dark:bg-gray-900">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <h3 className="text-lg font-medium">Initializing WebContainer...</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Setting up your project environment...
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
    if (stepIndex < currentStep) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (stepIndex === currentStep) return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
  };

  const getStepText = (stepIndex: number, label: string) => {
    const isActive = stepIndex === currentStep;
    const isComplete = stepIndex < currentStep;

    return (
      <span
        className={`text-sm font-medium ${
          isComplete ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    );
  };

  /* ------------------------------------------------------------
     🧭 Render
  ------------------------------------------------------------ */
  return (
    <div className="h-full w-full flex flex-col">
      {!previewUrl ? (
        <div className="h-full flex flex-col">
          {/* Progress Section */}
          <div className="w-full max-w-md p-6 m-5 rounded-lg bg-white dark:bg-zinc-800 shadow-sm mx-auto">
            <Progress value={(currentStep / totalSteps) * 100} className="h-2 mb-6" />

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
            <TerminalComponent ref={terminalRef} webContainerInstance={instance} theme="dark" className="h-full" />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* Preview */}
          <div className="flex-1">
            <iframe
              src={previewUrl}
              className="w-full h-full border-none"
              title="WebContainer Preview"
            />
          </div>

          {/* Terminal */}
          <div className="h-64 border-t">
            <TerminalComponent ref={terminalRef} webContainerInstance={instance} theme="dark" className="h-full" />
          </div>
        </div>
      )}
    </div>
  );
}

export default WebContainerPreview;
