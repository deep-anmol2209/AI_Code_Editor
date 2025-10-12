"use client";

import React, { ReactNode } from "react";
import { Header } from "@/modules/home/header";
import { Footer } from "@/modules/home/footer";
import { cn } from "@/lib/utils";

function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "relative min-h-screen flex flex-col bg-gradient-to-b",
        "from-white via-violet-50 to-fuchsia-50",
        "dark:from-black dark:via-zinc-900 dark:to-zinc-950"
      )}
    >
      {/* Floating Header */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Header />
      </div>

      {/* Fullscreen Main */}
      <main className="flex-1 relative w-full h-full flex flex-col pt-[var(--header-height)]">
        {/* Soft overlay covering full main */}
        <div
          className="absolute inset-0 w-full pointer-events-none bg-gradient-to-b 
            from-transparent via-white/40 to-violet-100/30 
            dark:via-zinc-900/60 dark:to-fuchsia-900/30 backdrop-blur-[1px]"
        />

        {/* Content container */}
        <div className="relative z-10 flex-1 w-full h-full flex flex-col items-center justify-start ">
          {children}
        </div>
      </main>

      {/* Footer pinned at bottom */}
      <Footer />
    </div>
  );
}

export default HomeLayout;
