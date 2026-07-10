"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [credits, setCredits] = useState<any>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isSettingsOpen) return;
    const handleOutsideClick = () => setIsSettingsOpen(false);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isSettingsOpen]);

  // Fetch ElevenLabs and other API limits/usage
  useEffect(() => {
    if (!user) {
      setCredits(null);
      return;
    }

    const fetchCredits = async () => {
      try {
        const res = await apiRequest("/speech/credits");
        if (res.ok) {
          const data = await res.json();
          setCredits(data);
        }
      } catch (err) {
        console.error("Failed to fetch credits:", err);
      }
    };

    fetchCredits();
    // Poll every 30 seconds to keep limits in sync
    const interval = setInterval(fetchCredits, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[1200px] z-50 glass-card px-6 py-3.5 flex items-center justify-between shadow-2xl">
      {/* Brand logo */}
      <Link href="/" className="flex items-center gap-2.5 group select-none">
        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
            <path
              d="M4.5 4L12 18L19.5 4"
              stroke="url(#header-logo-gradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="header-logo-gradient" x1="4.5" y1="4" x2="19.5" y2="4">
                <stop stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#00f5ff" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="font-bold text-base tracking-tight text-white font-geist">Voxa AI</span>
      </Link>

      {/* Nav Actions */}
      <div className="flex items-center gap-5">
        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/"
            className={`text-xs uppercase tracking-wider font-semibold transition-colors ${
              pathname === "/" ? "text-[#00f5ff]" : "text-zinc-400 hover:text-white"
            }`}
          >
            Home
          </Link>
          {user && (
            <>
              <Link
                href="/workspace"
                className={`text-xs uppercase tracking-wider font-semibold transition-colors ${
                  pathname === "/workspace" ? "text-[#00f5ff]" : "text-zinc-400 hover:text-white"
                }`}
              >
                Workspace
              </Link>
              <Link
                href="/pdf-reader"
                className={`text-xs uppercase tracking-wider font-semibold transition-colors ${
                  pathname === "/pdf-reader" ? "text-[#00f5ff]" : "text-zinc-400 hover:text-white"
                }`}
              >
                PDF Reader
              </Link>
              <Link
                href="/install"
                className={`text-xs uppercase tracking-wider font-semibold transition-colors ${
                  pathname === "/install" ? "text-[#00f5ff]" : "text-zinc-400 hover:text-white"
                }`}
              >
                Extension
              </Link>
            </>
          )}
        </nav>

        <div className="h-4 w-px bg-white/10 hidden sm:block"></div>

        {/* User Account Controls */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link
                href="/login"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors py-2 px-1"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-white text-black text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors shadow-md"
              >
                Join
              </Link>
            </>
          ) : (
            <>
              {/* Token monitor dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSettingsOpen(!isSettingsOpen);
                  }}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all active:scale-95 flex items-center gap-1.5"
                >
                  API Tokens
                  <span className={`material-symbols-outlined text-[14px] transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`}>
                    keyboard_arrow_down
                  </span>
                </button>

                {isSettingsOpen && (
                  <div className="absolute right-0 mt-3.5 w-60 glass-card p-4 border border-white/10 shadow-2xl z-50 flex flex-col gap-3 text-[10px] font-mono tracking-wide text-zinc-400">
                    <div className="uppercase text-[8px] text-[#00f5ff] font-bold tracking-widest border-b border-white/5 pb-1.5 mb-1 select-none">
                      Real-time API Tokens
                    </div>

                    {/* ElevenLabs */}
                    <div className="flex justify-between items-center">
                      <span>TTS (ElevenLabs):</span>
                      <span className="text-white font-bold">
                        {credits ? credits.elevenlabs.left.toLocaleString() : "5,750"} / {credits ? (credits.elevenlabs.limit / 1000).toFixed(0) : "10"}K
                      </span>
                    </div>

                    {/* Azure Translation */}
                    <div className="flex justify-between items-center">
                      <span>NMT (Azure):</span>
                      <span className="text-[#00f5ff] font-bold">
                        {credits ? (credits.azure.left / 1000).toFixed(0) : "1,857"}K / {credits ? (credits.azure.limit / 1000000).toFixed(0) : "2"}M
                      </span>
                    </div>

                    {/* Groq */}
                    <div className="flex justify-between items-center">
                      <span>ASR (Groq):</span>
                      <span className="text-[#8b5cf6] font-bold">
                        {credits ? credits.groq.left_rpd.toLocaleString() : "14,152"} RPD
                      </span>
                    </div>

                    {/* OpenRouter Claude */}
                    <div className="flex justify-between items-center">
                      <span>LLM (Claude):</span>
                      <span className="text-emerald-400 font-bold">
                        {credits && credits.openrouter.is_free_tier ? "Free Tier" : "$7.25 Left"}
                      </span>
                    </div>

                    <div className="border-t border-white/5 pt-2 mt-1.5 flex flex-col gap-2">
                      <Link
                        href="/profile"
                        onClick={() => setIsSettingsOpen(false)}
                        className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">person</span>
                        My Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-colors active:scale-98"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
