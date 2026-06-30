"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

interface ComponentCardProps {
  icon: string;
  title: string;
  tech: string;
  desc: string;
}

function ComponentCard({ icon, title, tech, desc }: ComponentCardProps) {
  return (
    <div className="relative border border-zinc-900 bg-zinc-950/40 p-6 flex flex-col gap-4 rounded-xl group transition-all duration-300">
      <div className="w-10 h-10 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-[#8b5cf6] select-none">
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
    <div className="flex flex-col min-h-screen bg-black text-zinc-300 relative font-sans">
      <Header />
      
      {/* Sidebar + Main Content Container */}
      <div className="flex flex-1 pt-[120px] relative z-10">
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 px-6 md:px-16 py-10 w-full pb-28 bg-transparent grid-bg radial-glow">
          <div className="max-w-3xl mx-auto flex flex-col gap-10">
            
            {/* Page Title */}
            <section className="select-none">
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-zinc-500 mb-3 inline-block border border-zinc-800 bg-zinc-900/40 px-2.5 py-1 rounded">
                System Engineering & Architecture
              </span>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white font-geist mt-2 mb-4">
                The Neural Engine
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed font-light font-sans">
                Explore the engineering of Voxa AI's translation pipeline. We stream, transcribe, correct, translate, and synthesize audio with sub-second latencies using optimized AI orchestration.
              </p>
            </section>

            {/* Interactive Navigation Tabs */}
            <div className="flex border-b border-zinc-900 gap-6 select-none font-geist font-medium">
              <button
                onClick={() => setActiveTab("pipeline")}
                className={`pb-4 text-sm relative transition-all ${
                  activeTab === "pipeline" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Pipeline Architecture
                {activeTab === "pipeline" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8b5cf6]" />
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
              <div className="space-y-10">
                
                {/* Architecture Timeline Visualizer */}
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 flex flex-col gap-6 select-none relative overflow-hidden">
                  <h3 className="font-semibold text-white text-xs font-geist uppercase tracking-widest font-mono text-zinc-500">Stream Processing Pipeline</h3>
                  
                  {/* Visual Flow Blocks */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-zinc-600 py-2">
                    <div className="flex flex-col items-center bg-zinc-900/60 border border-zinc-800 rounded-lg px-3 py-2.5 text-center shrink-0 w-28">
                      <span className="material-symbols-outlined text-[#8b5cf6] text-lg mb-1">web</span>
                      <span className="text-white font-bold text-[9px]">Browser Tab</span>
                      <span className="text-[8px] text-zinc-500">Capture Feed</span>
                    </div>

                    <span className="material-symbols-outlined text-zinc-700 hidden md:block">east</span>
                    <span className="material-symbols-outlined text-zinc-700 md:hidden">south</span>

                    <div className="flex flex-col items-center bg-zinc-900/60 border border-zinc-800 rounded-lg px-3 py-2.5 text-center shrink-0 w-28">
                      <span className="material-symbols-outlined text-[#ffb869] text-lg mb-1">extension</span>
                      <span className="text-white font-bold text-[9px]">Chrome Ext</span>
                      <span className="text-[8px] text-zinc-500">16kHz Int16</span>
                    </div>

                    <span className="material-symbols-outlined text-zinc-700 hidden md:block">east</span>
                    <span className="material-symbols-outlined text-zinc-700 md:hidden">south</span>

                    <div className="flex flex-col items-center bg-zinc-900/60 border border-zinc-800 rounded-lg px-3 py-2.5 text-center shrink-0 w-32">
                      <span className="material-symbols-outlined text-[#d0bcff] text-lg mb-1">sync_alt</span>
                      <span className="text-white font-bold text-[9px]">WebSocket API</span>
                      <span className="text-[8px] text-zinc-500">FastAPI Gateway</span>
                    </div>

                    <span className="material-symbols-outlined text-zinc-700 hidden md:block">east</span>
                    <span className="material-symbols-outlined text-zinc-700 md:hidden">south</span>

                    <div className="flex flex-col items-center bg-zinc-900/60 border border-zinc-800 rounded-lg px-3 py-2.5 text-center shrink-0 w-28">
                      <span className="material-symbols-outlined text-[#adc6ff] text-lg mb-1">psychology</span>
                      <span className="text-white font-bold text-[9px]">Groq Whisper</span>
                      <span className="text-[8px] text-zinc-500">Speech-To-Text</span>
                    </div>

                    <span className="material-symbols-outlined text-zinc-700 hidden md:block">east</span>
                    <span className="material-symbols-outlined text-zinc-700 md:hidden">south</span>

                    <div className="flex flex-col items-center bg-zinc-900/60 border border-zinc-800 rounded-lg px-3 py-2.5 text-center shrink-0 w-28">
                      <span className="material-symbols-outlined text-[#ffb869] text-lg mb-1">translate</span>
                      <span className="text-white font-bold text-[9px]">Azure Neural</span>
                      <span className="text-[8px] text-zinc-500">Translation</span>
                    </div>
                  </div>

                  <div className="bg-zinc-900/60 rounded-lg p-4 border border-zinc-800 text-xs text-zinc-400 leading-relaxed font-sans font-light">
                    <span className="text-[#d0bcff] font-bold font-mono uppercase tracking-wider text-[9px] mr-2 inline-block px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">Pipeline Summary</span>
                    The Chrome Extension captures internal audio, resamples it to 16kHz, and streams 16-bit Mono Int16 PCM chunks via WebSockets to FastAPI. The backend runs the audio through Groq Whisper for speech-to-text, refines and punctuates using Claude Sonnet 4, translates via Azure Translator, and synthesizes speech via ElevenLabs TTS.
                  </div>
                </div>

                {/* Component Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ComponentCard
                    icon="audio_file"
                    title="Tab Audio Worklet"
                    tech="Chrome TabCapture API"
                    desc="Captures live tab sound in a Service Worker context, utilizing an Offscreen Document to downsample the stream into compact 16kHz mono PCM chunks."
                  />
                  <ComponentCard
                    icon="bolt"
                    title="Groq Whisper ASR"
                    tech="Speech-to-Text Decoder"
                    desc="Streams audio file containers to the Groq Cloud endpoint. Whisper-large-v3 converts spoken words into raw text strings in sub-second inference steps."
                  />
                  <ComponentCard
                    icon="auto_awesome"
                    title="Claude Sonnet 4"
                    tech="Transcript Refinement"
                    desc="Corrects typical speech-to-text spelling errors, homophones, boundary punctuation, and proper nouns in real-time, matching local context patterns."
                  />
                  <ComponentCard
                    icon="translate"
                    title="Azure Translator"
                    tech="Contextual Translation"
                    desc="Translates corrected transcript text into target locales using Azure Neural Machine Translation models, respecting localized grammar structures."
                  />
                  <ComponentCard
                    icon="settings_voice"
                    title="ElevenLabs Vocoder"
                    tech="Voice Synthesis"
                    desc="Converts translations back to speech using the eleven_multilingual_v2 model to generate high-fidelity, expressive, human-like voice streams."
                  />
                  <ComponentCard
                    icon="extension"
                    title="Floating Subtitle Overlay"
                    tech="Extension Content Script"
                    desc="Injects customized HTML side panels and tab overlay widgets directly inside Google Meet pages to sync visual subtitles and audio feeds."
                  />
                </div>
              </div>
            )}

            {/* Tab Content 2: Data Flow */}
            {activeTab === "data" && (
              <div className="space-y-8 max-w-3xl">
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 space-y-6">
                  <h3 className="font-semibold text-white text-xs font-geist uppercase tracking-widest font-mono text-zinc-500">WebSocket Protocol Specs</h3>
                  
                  <div className="space-y-4 font-sans font-light">
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-[#ffb869] tracking-wider font-bold">1. Audio Input (Binary Packets)</span>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        The client pushes raw Int16 mono PCM packets representing sound waves sampled at 16,000Hz.
                      </p>
                      <pre className="p-4 bg-zinc-900/60 rounded-lg text-xs font-mono border border-zinc-800 text-zinc-300">
                        [Binary ArrayBuffer: size 8192 bytes (4096 samples)]
                      </pre>
                    </div>

                    <div className="h-px bg-zinc-900 my-4" />

                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-[#adc6ff] tracking-wider font-bold">2. Translation Updates (JSON Response)</span>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        The server responds with transcripts and translated texts upon decoding audio buffer frames.
                      </p>
                      <pre className="p-4 bg-zinc-900/60 rounded-lg text-xs font-mono border border-zinc-800 text-zinc-300">
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
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-white text-xs font-geist uppercase tracking-widest font-mono text-zinc-500">File Directory Map</h3>
                  <pre className="p-6 bg-zinc-900/60 rounded-lg text-xs font-mono border border-zinc-800 text-zinc-300 leading-relaxed overflow-x-auto">
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
│   ├── public/              # Static assets & Packed extension voxa_entension.zip
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

          </div>
        </main>
      </div>

      {/* Mobile nav bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 flex justify-around items-center h-16 z-50">
        <a href="/workspace" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="text-[10px] font-medium font-sans">Workspace</span>
        </a>
        <a href="/install" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">download</span>
          <span className="text-[10px] font-medium font-sans">Install</span>
        </a>
        <a href="/technology" className="flex flex-col items-center gap-1 text-[#8b5cf6] flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">insights</span>
          <span className="text-[10px] font-medium font-sans">Architecture</span>
        </a>
      </div>
    </div>
  );
}
