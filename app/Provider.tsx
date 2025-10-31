"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { Session } from "next-auth";
import { ReactNode } from "react";
interface ProviderProps {
    session: Session,
    children: ReactNode
}

export function Providers({ session, children }: ProviderProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex flex-col min-h-screen">
          <Toaster />
          <div className="flex-1" />
          {children}
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
}