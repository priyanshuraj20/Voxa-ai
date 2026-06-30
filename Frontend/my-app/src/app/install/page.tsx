"use client";

import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function InstallPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-300 relative font-sans">
      <Header />
      
      {/* Sidebar + Main Area wrapper */}
      <div className="flex flex-1 pt-[120px] relative z-10">
        <Sidebar />

        {/* Core Main Area */}
        <main className="flex-1 px-6 md:px-16 py-10 w-full pb-28 bg-transparent grid-bg radial-glow">
          <div className="max-w-3xl mx-auto flex flex-col gap-12">
            
            {/* Header Title */}
            <div className="text-center">
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-zinc-500 mb-3 inline-block border border-zinc-800 bg-zinc-900/40 px-2.5 py-1 rounded">
                Extension Distribution
              </span>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white font-geist mt-2 mb-4">
                Install Chrome Extension
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xl mx-auto font-light font-sans">
                Voxa translates meeting audio inside your browser in real-time. Follow the steps below to download and install our Chrome Extension.
              </p>
            </div>

            {/* Quick Download Button */}
            <div className="flex justify-center border-b border-zinc-900 pb-8">
              <a
                href="/voxa_entension.zip"
                download="voxa_entension.zip"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#8b5cf6] text-white hover:bg-[#7c3aed] transition-colors text-sm font-semibold shadow-md active:scale-98 select-none"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Download Extension package (voxa_entension.zip)
              </a>
            </div>

            {/* Steps Section */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-white font-geist">Load Unpacked Guide</h2>
              
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-start border border-zinc-900 bg-zinc-950/40 p-4 rounded-xl">
                  <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-mono font-bold text-[#d0bcff]">
                    1
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-white font-geist">Extract Package</h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed font-sans">
                      Locate the downloaded <code className="font-mono text-[10px] bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-zinc-300">voxa_entension.zip</code> file and extract its contents to a directory on your system.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start border border-zinc-900 bg-zinc-950/40 p-4 rounded-xl">
                  <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-mono font-bold text-[#d0bcff]">
                    2
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-white font-geist">Open Extensions Page</h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed font-sans">
                      Open a new browser tab and navigate to <code className="font-mono text-[10px] bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-zinc-300">chrome://extensions/</code>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start border border-zinc-900 bg-zinc-950/40 p-4 rounded-xl">
                  <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-mono font-bold text-[#d0bcff]">
                    3
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-white font-geist">Enable Developer Mode</h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed font-sans">
                      Toggle the **Developer Mode** switch in the top right corner of the extension dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start border border-zinc-900 bg-zinc-950/40 p-4 rounded-xl">
                  <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-mono font-bold text-[#d0bcff]">
                    4
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-white font-geist">Click 'Load Unpacked'</h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed font-sans">
                      Click the **Load unpacked** button in the top-left corner, navigate to the extracted folder, and choose select.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start border border-zinc-900 bg-zinc-950/40 p-4 rounded-xl">
                  <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-mono font-bold text-[#d0bcff]">
                    5
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-white font-geist">Launch Workspace Session</h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed font-sans">
                      Use the shortcut key combination <kbd className="font-mono text-[10px] bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-zinc-300">Ctrl + Shift + U</kbd> or click the Voxa icon to sync audio stream!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Explanations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* WebSocket and Offscreen */}
              <div className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-xl space-y-3">
                <h3 className="font-semibold text-sm text-white font-geist">How WebSockets Stream Audio</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans font-light">
                  To achieve sub-second translation latency, Voxa bypasses standard HTTP REST polling. The extension creates an **Offscreen Document** that downsamples the tab capture stream to 16kHz 16-bit Mono PCM. It continuously streams this binary feed directly over a persistent WebSocket connection to the backend translation engine.
                </p>
              </div>

              {/* Permissions Explanation */}
              <div className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-xl space-y-3">
                <h3 className="font-semibold text-sm text-white font-geist">Permissions Explanation</h3>
                <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4 font-sans font-light">
                  <li><strong>tabCapture:</strong> Allows capturing target browser tab internal audio stream.</li>
                  <li><strong>sidePanel:</strong> Renders chronological conversation translation blocks side-by-side.</li>
                  <li><strong>activeTab & scripting:</strong> Injects the floating subtitle overlay widget.</li>
                  <li><strong>storage:</strong> Retains target language selection state locally.</li>
                </ul>
              </div>

            </div>

            {/* Screenshot guide */}
            <div className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-xl space-y-4">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block">Onboarding On-Screen Screenshot</span>
              <div className="rounded-lg overflow-hidden border border-zinc-900 bg-black shadow-lg">
                <img
                  src="/assets/setup_guide.png"
                  alt="Voxa Extension Installation Guide"
                  className="w-full object-contain"
                />
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Mobile nav bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 flex justify-around items-center h-16 z-50">
        <a href="/workspace" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="text-[10px] font-medium font-sans">Workspace</span>
        </a>
        <a href="/install" className="flex flex-col items-center gap-1 text-[#8b5cf6] flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">download</span>
          <span className="text-[10px] font-medium font-sans">Install</span>
        </a>
        <a href="/technology" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">insights</span>
          <span className="text-[10px] font-medium font-sans">Architecture</span>
        </a>
      </div>
    </div>
  );
}
