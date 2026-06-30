"use client";

import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ShaderBackground from "@/components/ui/ShaderBackground";

export default function InstallPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-[#e7e0ed] relative font-sans">
      {/* WebGL interactive background */}
      <ShaderBackground />

      <Header />
      
      {/* Sidebar + Main Area wrapper */}
      <div className="flex flex-1 pt-[120px] overflow-hidden relative z-10">
        <Sidebar />

        {/* Core Main Area */}
        <main className="flex-1 overflow-y-auto px-6 md:px-12 py-8 max-w-[1200px] mx-auto w-full pb-20 md:pb-12 bg-transparent custom-scrollbar">
          
          {/* Header */}
          <div className="mb-12 max-w-2xl select-none">
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#cbc3d7]/50 mb-4 border-l-2 border-[#8b5cf6] pl-4">
              Extension Distribution
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white font-geist mb-6">
              Install Chrome Extension
            </h1>
            <p className="text-base text-[#cbc3d7]/70 leading-relaxed font-light">
              Voxa translates meeting audio inside your browser in real-time. Follow the steps below to download and install our Chrome Extension.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
            
            {/* Steps Column */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              
              <div className="premium-card p-6 bg-black/40 backdrop-blur-xl border border-white/5 flex flex-col gap-6">
                <h3 className="font-semibold text-lg text-white font-geist select-none">Onboarding Steps</h3>
                
                <div className="flex flex-col gap-5">
                  <div className="flex gap-4 items-start">
                    <span className="w-8 h-8 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 flex items-center justify-center text-sm font-bold text-[#d0bcff] font-mono shrink-0 select-none">
                      1
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm text-white font-geist">Download the Package</h4>
                      <p className="text-xs text-[#cbc3d7]/70 font-light leading-relaxed">
                        Click the download button to grab the packaged Chrome Extension (`Voxa.zip`) file directly to your desktop.
                      </p>
                      <div className="pt-2">
                        <a
                          href="/Voxa.zip"
                          download="Voxa.zip"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#8b5cf6] text-white hover:bg-[#7c3aed] transition-colors text-xs font-bold shadow-lg shadow-[#8b5cf6]/15 select-none"
                        >
                          <span className="material-symbols-outlined text-sm">download</span>
                          Download Voxa.zip
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="w-8 h-8 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 flex items-center justify-center text-sm font-bold text-[#d0bcff] font-mono shrink-0 select-none">
                      2
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm text-white font-geist">Unzip File</h4>
                      <p className="text-xs text-[#cbc3d7]/70 font-light leading-relaxed">
                        Extract/unzip the contents of `Voxa.zip` to a stable folder on your local file system.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="w-8 h-8 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 flex items-center justify-center text-sm font-bold text-[#d0bcff] font-mono shrink-0 select-none">
                      3
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm text-white font-geist">Open Chrome Extensions</h4>
                      <p className="text-xs text-[#cbc3d7]/70 font-light leading-relaxed">
                        Navigate to <code className="font-mono text-[11px] bg-white/5 border border-white/10 px-1 py-0.5 rounded text-white">chrome://extensions/</code> in your browser window.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="w-8 h-8 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 flex items-center justify-center text-sm font-bold text-[#d0bcff] font-mono shrink-0 select-none">
                      4
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm text-white font-geist">Enable Developer Mode</h4>
                      <p className="text-xs text-[#cbc3d7]/70 font-light leading-relaxed">
                        Toggle the **"Developer mode"** switch in the top right corner of the extension management page.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="w-8 h-8 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 flex items-center justify-center text-sm font-bold text-[#d0bcff] font-mono shrink-0 select-none">
                      5
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm text-white font-geist">Load Unpacked</h4>
                      <p className="text-xs text-[#cbc3d7]/70 font-light leading-relaxed">
                        Click the **"Load unpacked"** button in the top left and select the unzipped `Voxa` folder.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="w-8 h-8 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 flex items-center justify-center text-sm font-bold text-[#d0bcff] font-mono shrink-0 select-none">
                      6
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm text-white font-geist">Launch Workspace</h4>
                      <p className="text-xs text-[#cbc3d7]/70 font-light leading-relaxed">
                        Open your Google Meet tab and click the Voxa icon in your browser toolbar (or press <code className="font-mono text-[11px] bg-white/5 border border-white/10 px-1 py-0.5 rounded text-white">Ctrl + Shift + U</code>) to activate audio translation!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphic Column */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="premium-card p-6 bg-black/40 backdrop-blur-xl border border-white/5 flex flex-col gap-4">
                <span className="font-mono text-[10px] text-[#cbc3d7]/50 uppercase tracking-widest select-none">Onboarding Guide Screenshot</span>
                <div className="rounded-lg overflow-hidden border border-white/5 bg-black/60 shadow-2xl">
                  <img
                    src="/assets/setup_guide.png"
                    alt="Voxa Extension Installation Guide"
                    className="w-full object-contain"
                  />
                </div>
              </div>
            </div>
            
          </div>
        </main>
      </div>

      {/* Mobile nav bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center h-16 z-50">
        <a href="/workspace" className="flex flex-col items-center gap-1 text-[#cbc3d7]/60 hover:text-white flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="text-[10px] font-medium font-sans">Workspace</span>
        </a>
        <a href="/install" className="flex flex-col items-center gap-1 text-[#8b5cf6] flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">download</span>
          <span className="text-[10px] font-medium font-sans">Install</span>
        </a>
        <a href="/technology" className="flex flex-col items-center gap-1 text-[#cbc3d7]/60 hover:text-white flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">insights</span>
          <span className="text-[10px] font-medium font-sans">Pipeline</span>
        </a>
      </div>
    </div>
  );
}
