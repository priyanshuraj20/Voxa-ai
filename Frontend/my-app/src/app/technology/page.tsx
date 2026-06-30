"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ShaderBackground from "@/components/ui/ShaderBackground";

interface ComponentCardProps {
  icon: string;
  title: string;
  tech: string;
  desc: string;
  glowColor: string;
}

function ComponentCard({ icon, title, tech, desc, glowColor }: ComponentCardProps) {
  return (
    <div className={`relative premium-card p-6 flex flex-col gap-4 group transition-all duration-300 hover:-translate-y-1 hover:border-[#8b5cf6]/30 overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${glowColor} opacity-5 blur-2xl group-hover:opacity-15 transition-opacity pointer-events-none`} />
      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[#8b5cf6] select-none">
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <div>
        <h4 className="font-semibold text-white font-geist text-sm mb-1">{title}</h4>
        <span className="font-mono text-[9px] text-[#ffb869] tracking-wider uppercase font-bold">{tech}</span>
        <p className="text-zinc-400 text-xs leading-relaxed mt-2.5 font-sans font-light">{desc}</p>
      </div>
    </div>
  );
}

export default function TechnologyPage() {
  const [activeTab, setActiveTab] = useState<"pipeline" | "data" | "structure">("pipeline");

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-[#e7e0ed] relative font-sans">
      {/* WebGL interactive background */}
      <ShaderBackground />

      <Header />
      
      {/* Sidebar + Main Content Container */}
      <div className="flex flex-1 pt-[120px] overflow-hidden relative z-10">
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-6 md:px-12 py-8 max-w-[1200px] mx-auto w-full pb-20 md:pb-12 bg-transparent custom-scrollbar">
          
          {/* Page Title */}
          <section className="mb-12 max-w-2xl select-none">
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#cbc3d7]/50 mb-4 border-l-2 border-[#8b5cf6] pl-4">
              System Engineering & Architecture
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white font-geist mb-6">
              The Neural Engine
            </h1>
            <p className="text-base text-[#cbc3d7]/70 leading-relaxed font-light">
              Explore the engineering of Voxa AI's translation pipeline. We stream, transcribe, translate, and synthesize audio with sub-second latencies using optimized AI orchestration.
            </p>
          </section>

          {/* Interactive Navigation Tabs */}
          <div className="flex border-b border-white/5 gap-6 mb-8 select-none font-geist font-medium">
            <button
              onClick={() => setActiveTab("pipeline")}
              className={`pb-4 text-sm relative transition-all ${
                activeTab === "pipeline" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Pipeline Architecture
              {activeTab === "pipeline" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8b5cf6] shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("data")}
              className={`pb-4 text-sm relative transition-all ${
                activeTab === "data" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              System Data Flow
              {activeTab === "data" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8b5cf6]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("structure")}
              className={`pb-4 text-sm relative transition-all ${
                activeTab === "structure" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Project Structure
              {activeTab === "structure" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8b5cf6]" />
              )}
            </button>
          </div>

          {/* Tab Content 1: Pipeline Flow */}
          {activeTab === "pipeline" && (
            <div className="space-y-12">
              
              {/* Architecture Timeline Visualizer */}
              <div className="bg-[#0f0d15]/50 border border-white/5 rounded-xl p-8 flex flex-col items-stretch gap-6 select-none relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient(circle_at_bottom,rgba(139,92,246,0.02),transparent_60%) pointer-events-none" />
                <h3 className="font-semibold text-white text-sm font-geist mb-2 uppercase tracking-widest font-mono text-zinc-400">Stream Processing Pipeline</h3>
                
                {/* Visual SVG Diagram Flow */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-zinc-500 py-4">
                  <div className="flex flex-col items-center bg-white/3 border border-white/5 rounded-lg px-4 py-3 text-center shrink-0 w-32">
                    <span className="material-symbols-outlined text-[#8b5cf6] text-lg mb-1">web</span>
                    <span className="text-white font-bold">Browser Tab</span>
                    <span className="text-[8px] text-zinc-500">Google Meet</span>
                  </div>

                  <span className="material-symbols-outlined text-zinc-700 hidden md:block">east</span>
                  <span className="material-symbols-outlined text-zinc-700 md:hidden">south</span>

                  <div className="flex flex-col items-center bg-white/3 border border-white/5 rounded-lg px-4 py-3 text-center shrink-0 w-32">
                    <span className="material-symbols-outlined text-[#ffb869] text-lg mb-1">extension</span>
                    <span className="text-white font-bold">Chrome Extension</span>
                    <span className="text-[8px] text-zinc-500">16kHz PCM mono</span>
                  </div>

                  <span className="material-symbols-outlined text-zinc-700 hidden md:block">east</span>
                  <span className="material-symbols-outlined text-zinc-700 md:hidden">south</span>

                  <div className="flex flex-col items-center bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 rounded-lg px-4 py-3 text-center shrink-0 w-36 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                    <span className="material-symbols-outlined text-[#d0bcff] text-lg mb-1">sync_alt</span>
                    <span className="text-white font-bold">WebSocket Gateway</span>
                    <span className="text-[8px] text-[#d0bcff]/70">FastAPI Server</span>
                  </div>

                  <span className="material-symbols-outlined text-zinc-700 hidden md:block">east</span>
                  <span className="material-symbols-outlined text-zinc-700 md:hidden">south</span>

                  <div className="flex flex-col items-center bg-white/3 border border-white/5 rounded-lg px-4 py-3 text-center shrink-0 w-32">
                    <span className="material-symbols-outlined text-[#adc6ff] text-lg mb-1">psychology</span>
                    <span className="text-white font-bold">Groq Whisper ASR</span>
                    <span className="text-[8px] text-zinc-500">Speech-to-Text</span>
                  </div>

                  <span className="material-symbols-outlined text-zinc-700 hidden md:block">east</span>
                  <span className="material-symbols-outlined text-zinc-700 md:hidden">south</span>

                  <div className="flex flex-col items-center bg-white/3 border border-white/5 rounded-lg px-4 py-3 text-center shrink-0 w-32">
                    <span className="material-symbols-outlined text-[#ffb869] text-lg mb-1">translate</span>
                    <span className="text-white font-bold">Azure Translator</span>
                    <span className="text-[8px] text-zinc-500">Contextual NMT</span>
                  </div>

                  <span className="material-symbols-outlined text-zinc-700 hidden md:block">east</span>
                  <span className="material-symbols-outlined text-zinc-700 md:hidden">south</span>

                  <div className="flex flex-col items-center bg-white/3 border border-white/5 rounded-lg px-4 py-3 text-center shrink-0 w-32">
                    <span className="material-symbols-outlined text-[#8b5cf6] text-lg mb-1">volume_up</span>
                    <span className="text-white font-bold">ElevenLabs TTS</span>
                    <span className="text-[8px] text-zinc-500">Multilingual audio</span>
                  </div>
                </div>

                <div className="bg-black/50 rounded-lg p-4 border border-white/5 text-xs text-zinc-400 leading-relaxed font-sans font-light">
                  <span className="text-[#d0bcff] font-bold font-mono uppercase tracking-wider text-[9px] mr-2 inline-block px-1.5 py-0.5 rounded bg-[#8b5cf6]/10 border border-[#8b5cf6]/20">Orchestration summary</span>
                  When audio streams, the Chrome Extension converts captured meeting audio into mono 16-bit PCM blocks, streaming them continuously via WebSockets to FastAPI. Whisper large-v3 transcribes the audio, Azure Translator translates it contextually, and ElevenLabs synthesizes the voice output to update the client buffer in under 1 second.
                </div>
              </div>

              {/* Component Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ComponentCard
                  icon="audio_file"
                  title="16-Bit Mono Sampler"
                  tech="Browser Audio Worklet"
                  desc="Downsamples the high-fidelity tab media stream into a 16kHz PCM 16-bit Mono stream inside the client thread, minimizing payload size to support low-bandwidth edge connectivity."
                  glowColor="from-[#8b5cf6]"
                />
                <ComponentCard
                  icon="bolt"
                  title="Groq Whisper API"
                  tech="Speech-To-Text"
                  desc="Whisper-large-v3 model hosted on Groq Cloud processes audio file container frames directly. Whisper outputs raw text tokens with high resilience to ambient call noise."
                  glowColor="from-[#adc6ff]"
                />
                <ComponentCard
                  icon="g_translate"
                  title="Azure Translator"
                  tech="Multilingual Translation"
                  desc="Translates text tokens dynamically to the requested target language using Microsoft Cognitive Services, managing contextual idiomatic expressions safely."
                  glowColor="from-[#ffb869]"
                />
                <ComponentCard
                  icon="speech_to_text"
                  title="ElevenLabs TTS"
                  tech="Text-To-Speech Synthesis"
                  desc="Eleven Multilingual v2 voice model recreates natural human inflection, pitch, and prosody, rendering translated texts into highly expressive audio streams."
                  glowColor="from-[#adc6ff]"
                />
                <ComponentCard
                  icon="sync_alt"
                  title="WebSocket Server Gateway"
                  tech="FastAPI Python Server"
                  desc="Asynchronous connection gateway. Manages persistent client connections, buffers PCM chunks, and controls parallel pipeline execution with zero thread locking."
                  glowColor="from-[#8b5cf6]"
                />
                <ComponentCard
                  icon="cast"
                  title="Injected Audio Widget"
                  tech="Chrome Extension Content Page"
                  desc="Injects translation widgets directly inside active meeting frames. The widget captures text messages from the side panel and runs automated speech playbacks."
                  glowColor="from-[#ffb869]"
                />
              </div>
            </div>
          )}

          {/* Tab Content 2: Data Schemas */}
          {activeTab === "data" && (
            <div className="space-y-8 max-w-3xl">
              <div className="bg-[#0f0d15]/50 border border-white/5 rounded-xl p-8 space-y-6">
                <h3 className="font-semibold text-white text-sm font-geist uppercase tracking-widest font-mono text-zinc-400">WebSocket JSON Protocol</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-mono text-[#ffb869] tracking-wider font-bold">1. Audio PCM Payload (Binary Message)</span>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans font-light">
                      The Chrome Extension streams raw binary chunks representing 16-bit Mono Int16 samples at 16,000Hz.
                    </p>
                    <pre className="p-4 bg-black/60 rounded-lg text-xs font-mono border border-white/5 text-zinc-300">
                      [Binary ArrayBuffer: size 8192 bytes representing 4096 samples]
                    </pre>
                  </div>

                  <div className="h-px bg-white/5 my-4" />

                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-mono text-[#adc6ff] tracking-wider font-bold">2. Translation Transcript Payload (JSON Response)</span>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans font-light">
                      The server pushes text updates back to the extension client side panel logs and floating overlays once audio files are decoded.
                    </p>
                    <pre className="p-4 bg-black/60 rounded-lg text-xs font-mono border border-white/5 text-zinc-300">
{`{
  "transcript": "Hello, welcome to our workspace session today.",
  "translation": "नमस्ते, आज हमारे कार्यक्षेत्र सत्र में आपका स्वागत है।"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 3: Structure */}
          {activeTab === "structure" && (
            <div className="space-y-8 max-w-3xl">
              <div className="bg-[#0f0d15]/50 border border-white/5 rounded-xl p-8 space-y-4">
                <h3 className="font-semibold text-white text-sm font-geist uppercase tracking-widest font-mono text-zinc-400">File Directory Map</h3>
                <pre className="p-6 bg-black/60 rounded-lg text-xs font-mono border border-white/5 text-zinc-300 leading-relaxed overflow-x-auto">
{`Voxa-ai/
├── Backend/                 # Python FastAPI Server & AI Services
│   └── app/
│       ├── api/             # API Router Gateways
│       │   ├── health.py    # Health Check
│       │   ├── speech.py    # REST Translation
│       │   └── websocket_api.py # WebSocket Stream Gateway
│       ├── core/            # Environment settings
│       └── services/        # Logic handlers
│           ├── speech_service.py # Groq Whisper
│           ├── translation_service.py # Azure translator
│           └── tts_service.py # ElevenLabs synthesizer
│
├── Frontend/my-app/         # Next.js 16 Web Dashboard & Showcases
│   ├── public/              # Static assets & Packed extension Voxa.zip
│   └── src/
│       ├── app/             # Landing, workspace, and technology routes
│       └── components/      # Responsive design systems
│
└── Extension/               # Chrome Extension Manifest V3
    ├── background/          # Background worker capturing meeting frames
    ├── content/             # Injected overlays
    ├── offscreen/           # Audio worklet capture tab contexts
    └── sidepanel/           # Sidebar configuration logs`}
                </pre>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Mobile nav bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center h-16 z-50">
        <a href="/workspace" className="flex flex-col items-center gap-1 text-[#cbc3d7]/60 hover:text-white flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="text-[10px] font-medium font-sans">Workspace</span>
        </a>
        <a href="/install" className="flex flex-col items-center gap-1 text-[#cbc3d7]/60 hover:text-white flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">download</span>
          <span className="text-[10px] font-medium font-sans">Install</span>
        </a>
        <a href="/technology" className="flex flex-col items-center gap-1 text-[#8b5cf6] flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">insights</span>
          <span className="text-[10px] font-medium font-sans">Pipeline</span>
        </a>
      </div>
    </div>
  );
}
