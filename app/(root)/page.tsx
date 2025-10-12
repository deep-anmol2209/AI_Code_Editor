"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight, Code2, Sparkles, TerminalSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-screen flex h-full w-full flex-col items-center justify-center overflow-hidden
      bg-gradient-to-br from-white via-violet-50 to-fuchsia-100
      dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]
      text-black dark:text-white
      transition-all duration-500
    ">
      {/* Background glowing orbs */}
      <div className="absolute w-[900px] h-[900px] rounded-full blur-3xl -top-40 -left-40 animate-pulse
        bg-fuchsia-300 dark:bg-fuchsia-600/30
      " />
      <div className="absolute w-[800px] h-[800px] rounded-full blur-3xl top-60 right-0 animate-pulse
        bg-violet-300 dark:bg-violet-600/25
      " />

      {/* Hero Section */}
      <motion.div
        className="relative z-20 flex flex-col justify-center items-center text-center px-4 mt-30"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Image
          src="/brand.svg"
          alt="Hero-Section"
          height={160}
          width={160}
          className="drop-shadow-[0_0_25px_rgba(236,72,153,0.6)]"
        />

        <h1 className="text-6xl sm:text-7xl font-extrabold mt-8 leading-tight
          bg-gradient-to-br from-fuchsia-400 via-violet-500 to-indigo-500 text-transparent bg-clip-text
          drop-shadow-[0_5px_30px_rgba(168,85,247,0.45)]
          dark:from-fuchsia-400 dark:via-violet-500 dark:to-indigo-500
        ">
          Code Smarter, Ship Faster
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
          Experience the next generation of code editing with{" "}
          <span className="font-semibold text-fuchsia-500 dark:text-fuchsia-400">
            VibeCode
          </span>.  
          Intelligent features, real-time collaboration, and an adaptive interface.
        </p>

        <Link href="/dashboard">
          <Button
            variant="brand"
            size="lg"
            className="mt-8 px-8 py-6 text-lg rounded-2xl
              bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500
              hover:scale-105 hover:shadow-[0_0_45px_rgba(139,92,246,0.7)]
              transition-all duration-300 shadow-[0_8px_20px_rgba(139,92,246,0.35)]
              dark:from-fuchsia-500 dark:via-violet-500 dark:to-indigo-500
              text-black dark:text-white
            "
          >
            Get Started
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </motion.div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-24 px-6 relative z-20">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            className="group [perspective:1200px] cursor-pointer"
            whileHover={{ scale: 1.08 }}
          >
            <div className="relative w-72 h-80 transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              {/* Front */}
              <div className="absolute inset-0 flex flex-col items-center justify-center
                bg-gradient-to-br from-white via-violet-50 to-fuchsia-50
                dark:from-[#1a1a2e] dark:via-[#232946] dark:to-[#0f172a]
                border border-black/10 dark:border-white/10 rounded-2xl p-6 backdrop-blur-md
                shadow-[0_15px_35px_rgba(0,0,0,0.1),0_5px_10px_rgba(139,92,246,0.15)]
                hover:shadow-[0_20px_45px_rgba(168,85,247,0.6)]
                transform transition-all duration-500 [backface-visibility:hidden]
              ">
                <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-500/10 via-transparent to-transparent rounded-2xl" />
                <card.icon className="w-12 h-12 mb-4 text-fuchsia-500 dark:text-fuchsia-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
                <h3 className="text-2xl font-bold mb-2 text-black dark:text-white">{card.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-center text-sm">{card.text}</p>
              </div>

              {/* Back (code snippet) */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#1e1e2e] dark:to-[#111]
                text-sm font-mono text-left p-5 rounded-2xl
                shadow-[inset_0_0_20px_rgba(236,72,153,0.1),0_5px_30px_rgba(236,72,153,0.2)]
                [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-auto
              ">
                <pre className="text-pink-600 dark:text-fuchsia-300 whitespace-pre-wrap leading-relaxed">
{card.code}
                </pre>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-20 mb-6 text-gray-700 dark:text-gray-400 text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        © {new Date().getFullYear()} VibeCode. Crafted with 💜 by Developers.
      </footer>
    </div>
  );
}

const cards = [
  {
    title: "AI-Powered Code Suggestions",
    text: "Experience intelligent autocompletions that adapt to your Node.js context, powered by deep code understanding.",
    icon: Sparkles,
    code: `// Generate smart suggestions based on your active file
const suggestion = await ai.suggest({
  language: "javascript",
  code: editor.getValue(),
  cursor: editor.getCursorPosition()
});

editor.insertSnippet(suggestion);`,
  },
  {
    title: "Live Preview with WebContainers",
    text: "Run Node.js code instantly inside your browser — no backend required. Build and preview projects in real-time.",
    icon: TerminalSquare,
    code: `// Initialize a WebContainer and start a live server
const container = await WebContainer.boot();

await container.mount(files);
const process = await container.spawn("node", ["server.js"]);

process.output.pipeTo(new WritableStream({
  write(data) { console.log(data); }
}));`,
  },
  {
    title: "Collaborative Coding",
    text: "Invite teammates and edit code together. Every keystroke syncs live through our real-time Node backend.",
    icon: Code2,
    code: `// Real-time collaboration powered by websockets
io.on("connection", (socket) => {
  socket.on("codeChange", (delta) => {
    socket.broadcast.emit("updateCode", delta);
  });
});`,
  },
];
