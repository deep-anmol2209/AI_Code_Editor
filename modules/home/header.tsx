"use client";

import Link from "next/link";
import Image from "next/image";
import UserButton from "../auth/components/userButton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";

export function Header() {
  return (
    <div className="sticky top-0 left-0 right-0 z-50">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          bg-gradient-to-r from-white/80 via-violet-50/80 to-fuchsia-50/80
          dark:bg-gradient-to-r dark:from-[#0f172a]/80 dark:via-[#1e1b4b]/80 dark:to-[#0f172a]/80
          backdrop-blur-xl
          shadow-[0_5px_30px_rgba(139,92,246,0.15),0_0_10px_rgba(236,72,153,0.08)]
          dark:shadow-[0_5px_30px_rgba(139,92,246,0.3),0_0_10px_rgba(236,72,153,0.15)]
          border-b border-black/10 dark:border-violet-600/30
          rounded-b-3xl
          w-full sm:max-w-[1200px] mx-auto mt-3 px-6 py-3
          flex items-center justify-between
          transition-all duration-500 ease-in-out
        "
      >
        {/* Left Section (Logo + Navigation) */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            <Image
              src="/logo.svg"
              alt="Logo"
              height={50}
              width={50}
              className="drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]"
            />
            <span className="hidden sm:block font-extrabold text-lg
              bg-gradient-to-r from-fuchsia-400 via-violet-500 to-indigo-400 bg-clip-text text-transparent
              drop-shadow-[0_1px_10px_rgba(139,92,246,0.4)]
            ">
              VibeCode Editor
            </span>
          </Link>

          {/* Divider */}
          <span className="text-gray-500 dark:text-gray-400 font-thin">|</span>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-5">
            <Link
              href="/docs/components/background-paths"
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-fuchsia-500 transition-colors duration-200"
            >
              Docs
            </Link>

            <Link
              href="https://codesnippetui.pro/templates?utm_source=codesnippetui.com&utm_medium=header"
              target="_blank"
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-fuchsia-500 transition-colors flex items-center gap-2"
            >
              API
              <span className="text-xs text-green-600 dark:text-green-400 border border-green-600/50 dark:border-green-400/50 rounded-lg px-1 py-0.5 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                New
              </span>
            </Link>
          </nav>
        </div>

        {/* Right Section */}
        <div className="hidden sm:flex items-center gap-4">
          <ThemeToggle />
          <UserButton />
        </div>

        {/* Mobile Navigation */}
        <div className="flex sm:hidden items-center gap-4">
          <Link
            href="/docs/components/background-paths"
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-fuchsia-500 transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-fuchsia-500 transition-colors"
          >
            API
          </Link>
          <ThemeToggle />
          <UserButton />
        </div>
      </motion.header>
    </div>
  );
}
