"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getAccessToken } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isPrefOpen, setIsPrefOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isPrefOpen) return;
    const handleOutsideClick = () => setIsPrefOpen(false);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isPrefOpen]);

  // If we are on the landing page, we don't display a sidebar
  if (pathname === "/") return null;

  return (
    <aside className="hidden md:flex flex-col h-full w-72 border-r border-zinc-900 bg-[#09090b]/80 backdrop-blur-xl shrink-0 z-50">
      {/* Branding Block: click to navigate back to dashboard */}
      <Link 
        href="/" 
        className="p-stack-lg h-20 flex items-center gap-3 border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors group"
      >
        <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center select-none overflow-hidden transition-colors">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 group-hover:scale-105 transition-transform"
          >
            <path
              d="M4.5 4L12 18L19.5 4"
              stroke="url(#voxa-sidebar-v-grad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 9.5L12 13.5L15.5 9.5"
              stroke="url(#voxa-sidebar-v-inner)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />
            <defs>
              <linearGradient id="voxa-sidebar-v-grad" x1="4.5" y1="4" x2="19.5" y2="4">
                <stop stopColor="#a5b4fc" />
                <stop offset="0.5" stopColor="#6366f1" />
                <stop offset="1" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="voxa-sidebar-v-inner" x1="8.5" y1="9.5" x2="15.5" y2="9.5">
                <stop stopColor="#818cf8" />
                <stop offset="1" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-headline-md text-headline-md font-bold text-zinc-100 tracking-tight group-hover:text-white transition-colors">Voxa AI</span>
          <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase leading-none mt-0.5">VOXA AI ACTIVE</span>
        </div>
      </Link>

      {/* Main Navigation */}
      <nav className="flex-1 mt-stack-md">
        <ul className="space-y-1">
          <li>
            <Link
              href="/workspace"
              onClick={(e) => {
                if (!getAccessToken()) {
                  e.preventDefault();
                  router.push("/login?required=true");
                }
              }}
              className={`flex items-center px-stack-lg py-4 font-label-md text-label-md transition-all group ${
                pathname === "/workspace"
                  ? "sidebar-item-active font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <span
                className="material-symbols-outlined mr-4 text-[22px]"
                style={pathname === "/workspace" ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                dashboard
              </span>
              Workspace
            </Link>
          </li>

          <li>
            <Link
              href="/pdf-reader"
              onClick={(e) => {
                const token = getAccessToken();
                if (!token) {
                  e.preventDefault();
                  router.push("/login?required=true");
                }
              }}
              className={`flex items-center px-stack-lg py-4 font-label-md text-label-md transition-all group ${
                pathname === "/pdf-reader"
                  ? "sidebar-item-active font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <span
                className="material-symbols-outlined mr-4 text-[22px]"
                style={pathname === "/pdf-reader" ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                picture_as_pdf
              </span>
              PDF Assistant
            </Link>
          </li>

          <li>
            <Link
              href="/install"
              className={`flex items-center px-stack-lg py-4 font-label-md text-label-md transition-all group ${
                pathname === "/install"
                  ? "sidebar-item-active font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <span
                className="material-symbols-outlined mr-4 text-[22px]"
                style={pathname === "/install" ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                download
              </span>
              Download Extension
            </Link>
          </li>

          <li>
            <Link
              href="/technology"
              className={`flex items-center px-stack-lg py-4 font-label-md text-label-md transition-all group ${
                pathname === "/technology"
                  ? "sidebar-item-active font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <span
                className="material-symbols-outlined mr-4 text-[22px]"
                style={pathname === "/technology" ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                insights
              </span>
              Architecture
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer Navigation */}
      <div className="p-stack-lg border-t border-zinc-900 flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPrefOpen(!isPrefOpen);
              }}
              className="flex items-center text-zinc-400 hover:text-white transition-all font-label-md text-label-md w-full text-left"
            >
              <span className="material-symbols-outlined mr-4 text-[22px]">settings</span>
              Preferences
              <span className={`material-symbols-outlined text-xs ml-auto transition-transform duration-200 ${isPrefOpen ? 'rotate-180' : ''}`}>
                keyboard_arrow_up
              </span>
            </button>
            
            {isPrefOpen && (
              <div className="absolute left-0 bottom-8 w-48 bg-[#09090b] border border-zinc-800 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Link 
                  href="/profile" 
                  onClick={() => setIsPrefOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors w-full text-left font-sans"
                >
                  <span className="material-symbols-outlined text-sm">person</span>
                  Profile Settings
                </Link>
                <button 
                  onClick={async () => {
                    setIsPrefOpen(false);
                    await logout();
                    router.push("/login");
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-red-400 hover:bg-zinc-900 transition-colors w-full text-left border-t border-zinc-850 font-sans"
                >
                  <span className="material-symbols-outlined text-sm text-red-500/80">logout</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Customized Profile Card for Priyanshu Raj */}
        <div className="flex flex-col gap-3 p-3.5 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white font-bold text-xs select-none">
              PR
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-zinc-200 leading-tight">Priyanshu Raj</span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase leading-none mt-0.5">Lead Architect</span>
            </div>
          </div>

          {/* Social Platforms Links */}
          <div className="flex items-center gap-3.5 px-1 pt-1.5 text-zinc-500 border-t border-zinc-800">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#0077b5] transition-all hover:scale-110 active:scale-95 duration-200"
              title="LinkedIn Profile"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a 
              href="https://github.com/priyanshuraj20" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-all hover:scale-110 active:scale-95 duration-200"
              title="GitHub Profile"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#e1306c] transition-all hover:scale-110 active:scale-95 duration-200"
              title="Instagram Profile"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a 
              href="mailto:priyanshuraj.work@gmail.com" 
              className="hover:text-[#6366f1] transition-all hover:scale-110 active:scale-95 duration-200"
              title="Send Email"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
          </div>
        </div>

        {/* Customized Developer Signature */}
        <div className="flex flex-col items-center justify-center gap-1 py-1 select-none border-t border-zinc-900 pt-4 text-center">
          <p className="text-[10px] text-zinc-500 font-mono tracking-wider leading-relaxed">
            Voxa AI Multi-modal Gateway
          </p>
          <p className="text-[9px] text-zinc-600 font-mono tracking-widest uppercase mt-0.5">
            — Priyanshu Raj
          </p>
        </div>
      </div>
    </aside>
  );
}
