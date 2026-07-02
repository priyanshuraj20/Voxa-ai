"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const isLanding = pathname === "/";
  const [showBanner, setShowBanner] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [credits, setCredits] = useState<{
    elevenlabs: { limit: number; count: number; left: number; source: string };
    openrouter: { is_free_tier: boolean; limit_usd: number | null; usage_usd: number; source: string };
    azure: { limit: number; count: number; left: number; source: string };
    groq: { status: string; limit_rpd: number; used_rpd: number; left_rpd: number; source: string };
  } | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isSettingsOpen) return;
    const handleOutsideClick = () => setIsSettingsOpen(false);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isSettingsOpen]);

  // Fetch ElevenLabs character limits/usage
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

  if (isLanding) {
    return (
      <header className="fixed top-0 w-full z-50 border-b border-zinc-900 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-[1200px] mx-auto h-20 flex items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight hover:text-white transition-colors group">
              <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                >
                  <path
                    d="M4.5 4L12 18L19.5 4"
                    stroke="url(#voxa-header-v-grad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.5 9.5L12 13.5L15.5 9.5"
                    stroke="url(#voxa-header-v-inner)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.8"
                  />
                  <defs>
                    <linearGradient id="voxa-header-v-grad" x1="4.5" y1="4" x2="19.5" y2="4">
                      <stop stopColor="#a5b4fc" />
                      <stop offset="0.5" stopColor="#6366f1" />
                      <stop offset="1" stopColor="#38bdf8" />
                    </linearGradient>
                    <linearGradient id="voxa-header-v-inner" x1="8.5" y1="9.5" x2="15.5" y2="9.5">
                      <stop stopColor="#818cf8" />
                      <stop offset="1" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="font-bold text-white font-headline-md">Voxa AI</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 font-sans">
              <Link href="/install" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Install Extension
              </Link>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Architecture
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link href="/login" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors px-3 py-2">
                  Login
                </Link>
                <Link href="/register" className="bg-[#6366f1] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#4f46e5] transition-colors">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link href="/workspace" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors px-3 py-2">
                  Workspace
                </Link>
                <Link href="/profile" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors px-3 py-2">
                  Profile
                </Link>
                <button 
                  onClick={async () => {
                    await logout();
                    router.push("/login");
                  }}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors active:scale-98"
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

  // Dashboard Header (Workspace, History, Tech, Design System)
  return (
    <div className="fixed top-0 left-0 w-full z-50 flex flex-col">
      {/* Top Banner Alert from Stitch */}
      {showBanner && (
        <div className="bg-[#121214] border-b border-zinc-800 px-6 py-2.5 flex items-center justify-between z-20 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
              <span className="material-symbols-outlined text-base">download_for_offline</span>
            </div>
            <p className="text-[12px] md:text-sm font-medium text-zinc-300">
              Sync <span className="font-bold text-white">Voxa AI</span> Chrome extension to enable cross-tab translation in your browser.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/install" className="text-[12px] md:text-sm text-[#6366f1] hover:underline font-bold flex items-center gap-1">
              Download &amp; Sync Extension
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </Link>
            <button 
              onClick={() => setShowBanner(false)}
              className="text-zinc-400 hover:text-white transition-colors flex items-center justify-center p-0.5"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}


      {/* Top Header Menu */}
      <header className="h-20 flex justify-between items-center px-6 border-b border-zinc-900 z-10 bg-[#09090b]/80 backdrop-blur-xl">
        {/* Left Side Pill */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-zinc-900 rounded-lg px-4 py-1.5 border border-zinc-800 backdrop-blur-sm select-none">
            <span className="font-label-md text-[11px] text-zinc-400 uppercase tracking-wider">Browser Source</span>
            <span className="material-symbols-outlined mx-2 text-zinc-600 text-sm select-none">east</span>
            <span className="font-label-md text-[11px] text-[#6366f1] font-bold uppercase tracking-wider">Active Layer</span>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="flex items-center gap-8 font-mono text-xs">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Sync Status</span>
            <span className="text-[#6366f1] font-bold text-sm">Connected</span>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Extension Version</span>
            <span className="text-[#38bdf8] font-bold text-sm">v2.4.0</span>
          </div>
          {user ? (
            <>
              <Link href="/" className="font-sans text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                Home
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="font-sans text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/register" className="bg-[#6366f1] text-white px-4 py-2 rounded-lg font-sans text-xs font-semibold hover:bg-[#4f46e5] transition-colors">
                Register
              </Link>
            </>
          )}
          {user && (
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSettingsOpen(!isSettingsOpen);
                }}
                className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-label-md text-xs px-5 py-2.5 rounded-lg transition-all active:scale-95 font-bold flex items-center gap-1.5"
              >
                Settings
                <span className={`material-symbols-outlined text-xs transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`}>
                  keyboard_arrow_down
                </span>
              </button>
              
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Detailed Limits Breakdown */}
                  <div className="px-4 py-3 border-b border-zinc-900 text-[10px] font-mono text-zinc-400 space-y-2.5">
                    <div className="uppercase text-[8px] text-zinc-500 font-bold tracking-wider border-b border-zinc-900 pb-1">
                      API Limits Overview
                    </div>
                    {/* ElevenLabs */}
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">TTS (ElevenLabs):</span>
                      <span className="text-white font-bold">
                        {credits ? credits.elevenlabs.left.toLocaleString() : "5,750"} / {credits ? (credits.elevenlabs.limit / 1000).toFixed(0) : "10"}K
                      </span>
                    </div>
                    {/* Azure Translation */}
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">NMT (Azure):</span>
                      <span className="text-[#38bdf8] font-bold">
                        {credits ? (credits.azure.left / 1000).toFixed(0) : "1,857"}K / {credits ? (credits.azure.limit / 1000000).toFixed(0) : "2"}M
                      </span>
                    </div>
                    {/* Groq */}
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">ASR (Groq):</span>
                      <span className="text-[#a5b4fc] font-bold">
                        {credits ? credits.groq.left_rpd.toLocaleString() : "14,152"} RPD
                      </span>
                    </div>
                    {/* OpenRouter Claude */}
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">LLM (Claude):</span>
                      <span className="text-emerald-400 font-bold">
                        {credits && credits.openrouter.is_free_tier ? "Free Tier" : "$7.25 Left"}
                      </span>
                    </div>
                  </div>
                  <Link 
                    href="/profile" 
                    onClick={() => setIsSettingsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors w-full text-left font-sans"
                  >
                    <span className="material-symbols-outlined text-sm">person</span>
                    Profile
                  </Link>
                  <button 
                    onClick={async () => {
                      setIsSettingsOpen(false);
                      await logout();
                      router.push("/login");
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-red-400 hover:bg-zinc-900 transition-colors w-full text-left border-t border-zinc-900 font-sans"
                  >
                    <span className="material-symbols-outlined text-sm text-red-500/80">logout</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

