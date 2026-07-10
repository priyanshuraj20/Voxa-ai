"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWorkspaceClick = (e: React.MouseEvent) => {
    const token = getAccessToken();
    if (!token) {
      e.preventDefault();
      router.push("/login?required=true");
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-[#030305] text-white min-h-screen relative overflow-hidden font-sans flex flex-col justify-between">
      {/* Background ambient orbs */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-[#8b5cf6]/10 rounded-full blur-[120px] animate-float-slow-1 pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-[#00f5ff]/5 rounded-full blur-[150px] animate-float-slow-2 pointer-events-none"></div>

      <Header />

      {/* Main Hero Zen */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-16 max-w-[1200px] mx-auto z-10 relative">
        {/* Release Chip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/2 text-[10px] font-mono tracking-widest text-[#00f5ff] mb-8 select-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse"></span>
          REAL-TIME SPEECH TRANSLATION GATEWAY
        </motion.div>

        {/* Big clean title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6 max-w-4xl mx-auto font-geist text-white"
        >
          Speak. Translate. Listen. <br />
          Instant multilingual speech translation.
        </motion.h1>

        {/* Minimal subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed font-light"
        >
          An elegant neural translation console. Streams browser audio, parses meetings, and processes documents in sub-second latencies with human-like vocal outputs.
        </motion.p>

        {/* Prominent minimalist CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20 w-full sm:w-auto"
        >
          <Link
            href="/workspace"
            onClick={handleWorkspaceClick}
            className="w-full sm:w-auto text-center bg-white text-black px-7 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors shadow-lg active:scale-98"
          >
            Open Console
          </Link>
          <Link
            href="/pdf-reader"
            onClick={handleWorkspaceClick}
            className="w-full sm:w-auto text-center border border-white/10 bg-white/5 text-white px-7 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors active:scale-98"
          >
            Translate Document
          </Link>
        </motion.div>

        {/* Minimalist interactive simulator mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-full max-w-2xl glass-card p-6 border border-white/5 select-none"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/15"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-white/15"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-white/15"></span>
            </div>
            <div className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">
              Voxa Real-Time Acoustic Flow
            </div>
            <div className="w-4"></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
            <div className="flex flex-col gap-4 text-left w-full sm:w-2/3">
              <div>
                <span className="text-[8px] text-[#00f5ff] font-mono tracking-wider font-bold block mb-1">
                  ENGLISH INPUT
                </span>
                <p className="text-zinc-300 text-sm font-light">
                  "Hello, practice speaking and translating instantly."
                </p>
              </div>
              <div className="h-px bg-white/5 w-full"></div>
              <div>
                <span className="text-[8px] text-[#8b5cf6] font-mono tracking-wider font-bold block mb-1">
                  HINDI TRANSLATION
                </span>
                <p className="text-white text-base font-medium">
                  "नमस्ते, तुरंत बोलने और अनुवाद करने का अभ्यास करें।"
                </p>
              </div>
            </div>

            {/* Glowing audio visualizer block */}
            <div className="w-full sm:w-auto p-4 border border-white/5 bg-white/2 rounded-xl flex flex-col items-center justify-center shrink-0">
              <div className="flex items-end gap-1 h-8 mb-2">
                <span className="w-1 bg-[#8b5cf6] rounded-full h-3 animate-pulse"></span>
                <span className="w-1 bg-[#00f5ff] rounded-full h-6 animate-pulse"></span>
                <span className="w-1 bg-white/10 rounded-full h-2"></span>
                <span className="w-1 bg-[#8b5cf6] rounded-full h-5 animate-pulse"></span>
                <span className="w-1 bg-[#00f5ff] rounded-full h-4 animate-pulse"></span>
              </div>
              <span className="text-[8px] font-mono text-zinc-500 tracking-wider">
                DELAY &lt; 1.0S
              </span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Zen clean footer */}
      <footer className="py-8 text-center text-[10px] font-mono text-zinc-600 border-t border-white/2 max-w-[1200px] w-[90%] mx-auto z-10 relative">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 VOXA AI. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-4">
            <span>ENGINEERED BY PRIYANSHU RAJ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
