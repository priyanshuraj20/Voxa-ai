"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function TechnologyPage() {
  const [activeTab, setActiveTab] = useState<"overall" | "speech" | "pdf" | "auth" | "extension" | "limits" | "structure">("overall");

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
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#6366f1] mb-3 inline-block border border-[#6366f1]/20 bg-[#6366f1]/5 px-2.5 py-1 rounded">
                System Engineering & Architecture
              </span>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white font-geist mt-2 mb-4">
                The Neural Engine
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed font-light font-sans">
                Explore the technical pipelines powering Voxa AI. Learn how we stream, parse, authenticate, translate, and synthesize multi-modal data in real-time.
              </p>
            </section>

            {/* Interactive Navigation Tabs */}
            <div className="flex flex-wrap border-b border-zinc-900 gap-6 select-none font-geist font-medium">
              <button
                onClick={() => setActiveTab("overall")}
                className={`pb-4 text-sm relative transition-all ${
                  activeTab === "overall" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Overall Architecture
                {activeTab === "overall" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6366f1]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("speech")}
                className={`pb-4 text-sm relative transition-all ${
                  activeTab === "speech" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Speech Pipeline
                {activeTab === "speech" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6366f1]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("pdf")}
                className={`pb-4 text-sm relative transition-all ${
                  activeTab === "pdf" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                PDF Assistant
                {activeTab === "pdf" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6366f1]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("auth")}
                className={`pb-4 text-sm relative transition-all ${
                  activeTab === "auth" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Authentication
                {activeTab === "auth" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6366f1]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("extension")}
                className={`pb-4 text-sm relative transition-all ${
                  activeTab === "extension" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Chrome Extension
                {activeTab === "extension" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6366f1]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("limits")}
                className={`pb-4 text-sm relative transition-all ${
                  activeTab === "limits" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                API Limits
                {activeTab === "limits" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6366f1]" />
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
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6366f1]" />
                )}
              </button>
            </div>

            {/* TAB CONTENT 1: Overall Architecture */}
            {activeTab === "overall" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="relative border border-zinc-900 bg-zinc-950/40 p-8 rounded-xl flex flex-col items-center gap-5 overflow-hidden">
                  
                  {/* User Node */}
                  <div className="w-52 p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 flex flex-col items-center shadow-lg shadow-zinc-950/50">
                    <span className="material-symbols-outlined text-[#6366f1] text-2xl mb-1">person</span>
                    <span className="text-white font-bold text-xs font-mono">USER</span>
                    <span className="text-[9px] text-zinc-500 font-sans mt-0.5 text-center">Initiates record or uploads PDF</span>
                  </div>

                  <span className="text-[#6366f1] text-lg font-bold select-none">↓</span>

                  {/* Next.js Frontend Node */}
                  <div className="w-56 p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 flex flex-col items-center shadow-lg shadow-zinc-950/50">
                    <span className="material-symbols-outlined text-[#38bdf8] text-2xl mb-1">web</span>
                    <span className="text-white font-bold text-xs font-mono">Next.js Frontend</span>
                    <span className="text-[9px] text-zinc-500 font-sans mt-0.5 text-center">React view layer, state context</span>
                  </div>

                  <span className="text-[#6366f1] text-lg font-bold select-none">↓</span>

                  {/* JWT Authentication Layer Node */}
                  <div className="w-60 p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 flex flex-col items-center shadow-lg shadow-zinc-950/50">
                    <span className="material-symbols-outlined text-[#ffb869] text-2xl mb-1">verified_user</span>
                    <span className="text-white font-bold text-xs font-mono">JWT Auth Layer</span>
                    <span className="text-[9px] text-zinc-500 font-sans mt-0.5 text-center">Credential validation, route guarding</span>
                  </div>

                  <span className="text-[#6366f1] text-lg font-bold select-none">↓</span>

                  {/* FastAPI Backend Node */}
                  <div className="w-64 p-4 rounded-xl border border-[#10b981]/30 bg-zinc-900/60 flex flex-col items-center shadow-lg shadow-zinc-950/50">
                    <span className="material-symbols-outlined text-[#10b981] text-2xl mb-1">bolt</span>
                    <span className="text-white font-bold text-xs font-mono">FastAPI Backend</span>
                    <span className="text-[9px] text-zinc-500 font-sans mt-0.5 text-center">API routing, pipeline control middleware</span>
                  </div>

                  <span className="text-zinc-700 text-lg font-bold select-none">↓</span>

                  {/* Pipelines Branches side-by-side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-2">
                    
                    {/* Left Pipeline Box: Speech */}
                    <div className="border border-zinc-900 bg-zinc-950/80 p-5 rounded-xl flex flex-col gap-3 relative">
                      <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                        <span className="material-symbols-outlined text-[#6366f1] text-sm">interpreter_mode</span>
                        <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">Speech Pipeline</h4>
                      </div>
                      <div className="flex flex-col gap-2 font-mono text-[10px] text-zinc-400">
                        <div className="bg-zinc-900/30 p-2.5 rounded border border-zinc-800/80 flex justify-between items-center">
                          <span>ASR Transcription</span>
                          <span className="text-white font-bold">Groq Whisper v3</span>
                        </div>
                        <div className="bg-zinc-900/30 p-2.5 rounded border border-zinc-800/80 flex justify-between items-center">
                          <span>LLM Refinement</span>
                          <span className="text-[#6366f1] font-bold">Claude 3.5 Sonnet</span>
                        </div>
                        <div className="bg-zinc-900/30 p-2.5 rounded border border-zinc-800/80 flex justify-between items-center">
                          <span>Neural Translation</span>
                          <span className="text-[#38bdf8] font-bold">Azure Translator</span>
                        </div>
                        <div className="bg-zinc-900/30 p-2.5 rounded border border-zinc-800/80 flex justify-between items-center">
                          <span>Audio Synthesis</span>
                          <span className="text-[#10b981] font-bold">ElevenLabs TTS</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Pipeline Box: PDF */}
                    <div className="border border-zinc-900 bg-zinc-950/80 p-5 rounded-xl flex flex-col gap-3 relative">
                      <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                        <span className="material-symbols-outlined text-[#ffb869] text-sm">picture_as_pdf</span>
                        <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">PDF Pipeline</h4>
                      </div>
                      <div className="flex flex-col gap-2 font-mono text-[10px] text-zinc-400">
                        <div className="bg-zinc-900/30 p-2.5 rounded border border-zinc-800/80 flex justify-between items-center">
                          <span>Plaintext Extraction</span>
                          <span className="text-white font-bold">PyPDF Package</span>
                        </div>
                        <div className="bg-zinc-900/30 p-2.5 rounded border border-zinc-800/80 flex justify-between items-center">
                          <span>Segment Translation</span>
                          <span className="text-[#38bdf8] font-bold">Azure Translator</span>
                        </div>
                        <div className="bg-zinc-900/30 p-2.5 rounded border border-zinc-800/80 flex justify-between items-center">
                          <span>MP3 Voice Synthesis</span>
                          <span className="text-[#10b981] font-bold">ElevenLabs TTS</span>
                        </div>
                        <div className="bg-zinc-900/30 p-2.5 rounded border border-zinc-800/80 flex justify-between items-center">
                          <span>Sequential Merge</span>
                          <span className="text-zinc-500">Byte-Stream Concat</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: Speech Pipeline Flow */}
            {activeTab === "speech" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="relative pl-8 border-l border-zinc-800 space-y-8">
                  
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#6366f1] border border-black shadow-[0_0_10px_#6366f1]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#6366f1] font-bold">Step 1 — Client Capture</span>
                      <h4 className="text-white font-semibold font-geist text-sm">User presses Record</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        The frontend UI triggers capture. The browser downsamples audio to 16,000Hz mono 16-bit PCM chunks to minimize network bandwidth.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#6366f1] border border-black shadow-[0_0_10px_#6366f1]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#6366f1] font-bold">Step 2 — Network Uplink</span>
                      <h4 className="text-white font-semibold font-geist text-sm">Uplink to FastAPI Server</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        Audio arrays are streamed to the backend using either REST endpoints or high-speed binary WebSocket packets.
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">POST /api/speech/translate-and-speak</span>
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">ws://localhost:8000/ws</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#6366f1] border border-black shadow-[0_0_10px_#6366f1]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#6366f1] font-bold">Step 3 — Speech Recognition</span>
                      <h4 className="text-white font-semibold font-geist text-sm">ASR via Groq Whisper API</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        FastAPI converts incoming audio payloads into temporary WAV containers and calls the Groq Whisper model to generate text transcripts.
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Model: whisper-large-v3</span>
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Endpoint: /v1/audio/transcriptions</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#6366f1] border border-black shadow-[0_0_10px_#6366f1]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#6366f1] font-bold">Step 4 — Transcript Improvement</span>
                      <h4 className="text-white font-semibold font-geist text-sm">Claude LLM Contextual Post-Refinement</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        An LLM service improves grammar, punctuates boundaries, and fixes spelling errors on the raw transcription text to improve translation accuracy.
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">API: OpenRouter completions</span>
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Model: Claude 3.5 Sonnet</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#6366f1] border border-black shadow-[0_0_10px_#6366f1]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#6366f1] font-bold">Step 5 — Translation Engine</span>
                      <h4 className="text-white font-semibold font-geist text-sm">Azure Neural Translation</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        The refined transcription text is translated into the user's preferred target language using neural machine translation.
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">API: Azure Translator API v3.0</span>
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Endpoint: /translate</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 6 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#6366f1] border border-black shadow-[0_0_10px_#6366f1]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#6366f1] font-bold">Step 6 — Voice Synthesis</span>
                      <h4 className="text-white font-semibold font-geist text-sm">ElevenLabs TTS Engine</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        Converts the translated text into expressive, natural human speech. Returns a high-fidelity MP3 voice file stream to the client.
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">API: ElevenLabs Voice Synthesis</span>
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Model: eleven_multilingual_v2</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 7 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#6366f1] border border-black shadow-[0_0_10px_#6366f1]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#6366f1] font-bold">Step 7 — Output Delivery</span>
                      <h4 className="text-white font-semibold font-geist text-sm">Frontend Presentation & Playback</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        The web app receives the final payload, updates transcription panels, shows translated texts, and triggers the audio context nodes to play speech.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB CONTENT 3: PDF Translation Flow */}
            {activeTab === "pdf" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="relative pl-8 border-l border-zinc-800 space-y-8">
                  
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#ffb869] border border-black shadow-[0_0_10px_#ffb869]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#ffb869] font-bold">Step 1 — Document Intake</span>
                      <h4 className="text-white font-semibold font-geist text-sm">Upload PDF</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        The user uploads a PDF file (up to 100 pages and 10 MB limit) inside the PDF Assistant interface.
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Endpoint: POST /api/pdf/translate</span>
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Format: Multipart Form-Data</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#ffb869] border border-black shadow-[0_0_10px_#ffb869]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#ffb869] font-bold">Step 2 — File Parsing</span>
                      <h4 className="text-white font-semibold font-geist text-sm">Text Extraction via PyPDF</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        Backend maps the uploaded binary stream, checks encryption blocks, and parses text page-by-page. Returns progressive progress status to the client.
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Library: PyPDF.PdfReader</span>
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Status Response: Server-Sent Events (SSE)</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#ffb869] border border-black shadow-[0_0_10px_#ffb869]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#ffb869] font-bold">Step 3 — Translation Segmenting</span>
                      <h4 className="text-white font-semibold font-geist text-sm">Azure Translator Execution</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        Extracted text content is split into 3,000 to 5,000 character boundaries, preserving complete paragraphs, and translated using the Azure Translation Engine.
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Azure API Version: 3.0</span>
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Chunk Limit: Max 5000 characters</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#ffb869] border border-black shadow-[0_0_10px_#ffb869]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#ffb869] font-bold">Step 4 — Voice Synthesis</span>
                      <h4 className="text-white font-semibold font-geist text-sm">ElevenLabs Voice synthesis Chunks</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        The backend invokes ElevenLabs voice synthesis APIs for each translated text block in parallel streams, writing raw voice buffers to discrete chunk MP3 containers.
                      </p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#ffb869] border border-black shadow-[0_0_10px_#ffb869]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#ffb869] font-bold">Step 5 — Audio Merging</span>
                      <h4 className="text-white font-semibold font-geist text-sm">Sequential MP3 Concatenation</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        Backend combines the generated MP3 chunk files into a single master MP3 container, ready to be served to the frontend.
                      </p>
                    </div>
                  </div>

                  {/* Step 6 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#ffb869] border border-black shadow-[0_0_10px_#ffb869]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#ffb869] font-bold">Step 6 — Stream Output</span>
                      <h4 className="text-white font-semibold font-geist text-sm">Stream & Play</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        Sends final payload of extracted text, translated text, and voice audio URL. The frontend plays the synthesized voice audio dynamically.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB CONTENT 4: Authentication Flow */}
            {activeTab === "auth" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="relative pl-8 border-l border-zinc-800 space-y-8">
                  
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#10b981] border border-black shadow-[0_0_10px_#10b981]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#10b981] font-bold">Step 1 — Registration</span>
                      <h4 className="text-white font-semibold font-geist text-sm">Register account</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        The user inputs name, email, and password. The client makes a secure registration request.
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Endpoint: POST /api/auth/register</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#10b981] border border-black shadow-[0_0_10px_#10b981]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#10b981] font-bold">Step 2 — Encryption</span>
                      <h4 className="text-white font-semibold font-geist text-sm">Password Hash (bcrypt)</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        For maximum data security, passwords are encrypted on the backend using bcrypt salt-rounds before database persistence.
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Algorithm: bcrypt</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#10b981] border border-black shadow-[0_0_10px_#10b981]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#10b981] font-bold">Step 3 — Persistence</span>
                      <h4 className="text-white font-semibold font-geist text-sm">MongoDB Storage</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        Saves verified profile attributes (hashed credentials, full name, preferred languages) into the MongoDB documents database.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#10b981] border border-black shadow-[0_0_10px_#10b981]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#10b981] font-bold">Step 4 — Verification</span>
                      <h4 className="text-white font-semibold font-geist text-sm">Login</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        Validates the user's email, compares the password hash dynamically, and starts a session payload.
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Endpoint: POST /api/auth/login</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#10b981] border border-black shadow-[0_0_10px_#10b981]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#10b981] font-bold">Step 5 — Security Token</span>
                      <h4 className="text-white font-semibold font-geist text-sm">JWT Token Issuance</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        Generates a cryptographically signed JSON Web Token (JWT) on success, which the client persists in cookie/session memory.
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Signing: HS256 algorithm</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 6 */}
                  <div className="relative">
                    <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#10b981] border border-black shadow-[0_0_10px_#10b981]" />
                    <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#10b981] font-bold">Step 6 — Authorization Guard</span>
                      <h4 className="text-white font-semibold font-geist text-sm">Protected Routes & Workspace Access</h4>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed">
                        Axios interceptors append the JWT token to requests. Backend verify routes guard access based on user session status.
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Middleware: Depends(get_current_user)</span>
                        <span className="font-mono text-[8px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 font-bold">Authorization: Bearer &lt;Token&gt;</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB CONTENT 5: Chrome Extension Flow & Architecture */}
            {activeTab === "extension" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Visual Architecture Flow UI */}
                <div className="border border-zinc-900 bg-zinc-950/40 p-6 md:p-8 rounded-xl flex flex-col items-center gap-4 overflow-hidden relative shadow-lg">
                  <div className="w-full text-left border-b border-zinc-900 pb-3 mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#38bdf8] text-lg">extension</span>
                      <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">Chrome Extension Pipeline</h4>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500">Real-Time Voice Translation Loop</span>
                  </div>

                  {/* Flow Nodes Diagram */}
                  <div className="flex flex-col items-center gap-4 w-full text-left max-w-lg font-sans">
                    {/* Node 1: Remote Speaker */}
                    <div className="w-full p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 flex items-center gap-4 hover:border-zinc-700 transition-all select-none">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[#6366f1] shrink-0">
                        <span className="material-symbols-outlined text-xl">record_voice_over</span>
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-[#6366f1] font-bold">1. Input Audio Source</span>
                        <h5 className="text-white font-semibold font-geist text-[13px] mt-0.5">Speaker Talks in Meeting</h5>
                        <p className="text-zinc-500 font-light mt-1">Other participants (Google Meet / Zoom) speak. Audio is sent as standard tab outputs to their speakers.</p>
                      </div>
                    </div>

                    <div className="text-[#6366f1] text-xs font-bold text-center select-none">↓</div>

                    {/* Node 2: Chrome Tab Capture API */}
                    <div className="w-full p-4 rounded-xl border border-[#38bdf8]/30 bg-zinc-900/40 flex items-center gap-4 hover:border-[#38bdf8]/50 transition-all select-none">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[#38bdf8] shrink-0">
                        <span className="material-symbols-outlined text-xl">settings_ethernet</span>
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-[#38bdf8] font-bold">2. Capture & Resample</span>
                        <h5 className="text-white font-semibold font-geist text-[13px] mt-0.5">Offscreen Document Intercept</h5>
                        <p className="text-zinc-500 font-light mt-1">Chrome Tab Capture API captures tab audio streams. Offscreen resampler downsamples it to 16kHz mono 16-bit signed integer PCM arrays.</p>
                      </div>
                    </div>

                    <div className="text-[#38bdf8] text-xs font-bold text-center select-none">↓</div>

                    {/* Node 3: WebSocket Streaming */}
                    <div className="w-full p-4 rounded-xl border border-amber-500/20 bg-zinc-900/40 flex items-center gap-4 hover:border-amber-500/40 transition-all select-none">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-amber-500 shrink-0">
                        <span className="material-symbols-outlined text-xl">sensors</span>
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-amber-500 font-bold">3. Network Streaming</span>
                        <h5 className="text-white font-semibold font-geist text-[13px] mt-0.5">WebSocket Binary Uplink</h5>
                        <p className="text-zinc-500 font-light mt-1">Continuous binary arrays are streamed over persistent WebSockets directly to the FastAPI server at <span className="font-mono text-[10px] text-zinc-400">ws://localhost:8000/ws</span>.</p>
                      </div>
                    </div>

                    <div className="text-amber-500 text-xs font-bold text-center select-none">↓</div>

                    {/* Node 4: FastAPI VAD & Buffering */}
                    <div className="w-full p-4 rounded-xl border border-emerald-500/20 bg-zinc-900/40 flex items-center gap-4 hover:border-emerald-500/40 transition-all select-none">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-500 shrink-0">
                        <span className="material-symbols-outlined text-xl">dns</span>
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-emerald-500 font-bold">4. Server Orchestration</span>
                        <h5 className="text-white font-semibold font-geist text-[13px] mt-0.5">VAD Filter & In-Memory Packaging</h5>
                        <p className="text-zinc-500 font-light mt-1">Calculates RMS amplitude to filter silences. Appends 44-byte WAV header completely in-memory to format bytes for transcription.</p>
                      </div>
                    </div>

                    <div className="text-emerald-500 text-xs font-bold text-center select-none">↓</div>

                    {/* Node 5: AI Pipeline */}
                    <div className="w-full p-4 rounded-xl border border-fuchsia-500/20 bg-zinc-900/40 flex items-center gap-4 hover:border-fuchsia-500/40 transition-all select-none">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-fuchsia-500 shrink-0">
                        <span className="material-symbols-outlined text-xl">psychology</span>
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-fuchsia-500 font-bold">5. AI Translation Pipeline</span>
                        <h5 className="text-white font-semibold font-geist text-[13px] mt-0.5">ASR + Refinement + Translation</h5>
                        <p className="text-zinc-500 font-light mt-1">Whisper Large v3 transcribes audio ➔ Claude LLM corrects punctuation & grammar ➔ Azure NMT translates into target language locales.</p>
                      </div>
                    </div>

                    <div className="text-fuchsia-500 text-xs font-bold text-center select-none">↓</div>

                    {/* Node 6: Voice Synthesis */}
                    <div className="w-full p-4 rounded-xl border border-teal-500/20 bg-zinc-900/40 flex items-center gap-4 hover:border-teal-500/40 transition-all select-none">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-teal-500 shrink-0">
                        <span className="material-symbols-outlined text-xl">volume_up</span>
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-teal-500 font-bold">6. Voice Output Synthesis</span>
                        <h5 className="text-white font-semibold font-geist text-[13px] mt-0.5">ElevenLabs TTS Engine</h5>
                        <p className="text-zinc-500 font-light mt-1">Converts translated text string into high-fidelity expressive voice output using multilingual models, saving it dynamically as output.mp3.</p>
                      </div>
                    </div>

                    <div className="text-teal-500 text-xs font-bold text-center select-none">↓</div>

                    {/* Node 7: Subtitle Overlay */}
                    <div className="w-full p-4 rounded-xl border border-rose-500/30 bg-zinc-900/40 flex items-center gap-4 hover:border-rose-500/50 transition-all select-none">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-rose-500 shrink-0">
                        <span className="material-symbols-outlined text-xl">closed_caption</span>
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-rose-500 font-bold">7. Client Presenter</span>
                        <h5 className="text-white font-semibold font-geist text-[13px] mt-0.5">Captions Overlay & Voice Playback</h5>
                        <p className="text-zinc-500 font-light mt-1">Sends JSON response back to WebSocket client. Chrome extension injects overlay text subtitles in-tab and plays the translated spoken voice directly.</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Step-by-Step Technical Details */}
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 md:p-8 space-y-6">
                  <h3 className="text-lg font-semibold font-geist text-white">How the Extension Voice Translation Loop Works</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-sans font-light leading-relaxed">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-semibold font-geist text-sm mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]"></span>
                          1. Tab Capture & Resampling
                        </h4>
                        <p className="text-zinc-400 text-xs font-sans">
                          When users join a Google Meet or Zoom call, their browser executes standard audio streaming in the tab. The Chrome Extension uses the Tab Capture API to grab the raw audio output stream. Because extensions cannot process heavy media logic in background service workers directly, it spawns an ephemeral <strong>Offscreen Document</strong>. The offscreen wrapper uses the Web Audio API to resample the audio from standard 44.1kHz stereo down to a highly optimized 16kHz mono 16-bit signed integer PCM feed, dramatically reducing transmission overhead.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold font-geist text-sm mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          2. Continuous WebSocket Uplink
                        </h4>
                        <p className="text-zinc-400 text-xs font-sans">
                          Rather than uploading bulky audio files, the extension streams binary PCM chunks continuously every 100ms over a persistent WebSocket connection to the FastAPI server. If the meeting is silent, the extension automatically injects tiny heartbeat silence packets to maintain the state of the socket, preventing proxy servers or load balancers from cutting the connection.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-semibold font-geist text-sm mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          3. Real-Time VAD & In-Memory WAV
                        </h4>
                        <p className="text-zinc-400 text-xs font-sans">
                          On the backend, the server maintains a sliding audio buffer. A Voice Activity Detection (VAD) algorithm calculates the Root Mean Square (RMS) amplitude of incoming bytes. If the volume stays below 50.0, the server skips model computation to prevent expensive API calls. Once active voice is detected, the server dynamically prepends a standard 44-byte WAV header in-memory to the PCM bytes, allowing the API to read it as a standard audio file without incurring disk write latencies.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold font-geist text-sm mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          4. AI Translation & Subtitle Return
                        </h4>
                        <p className="text-zinc-400 text-xs font-sans">
                          The structured WAV payload is sent to Groq Whisper v3 for sub-second speech recognition. The raw transcript text is corrected by Claude 3.5 Sonnet to restore correct grammar and punctuation, translated by Azure Translator, and finally converted back to speech by ElevenLabs. The resulting transcript, translation, and synthetic audio file URL are returned over the active WebSocket, letting the extension inject subtitles and trigger audio playback.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 6: API Limits & Token Consumption */}
            {activeTab === "limits" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Visual Token Flowchart UI */}
                <div className="border border-zinc-900 bg-zinc-950/40 p-6 md:p-8 rounded-xl flex flex-col items-center gap-4 overflow-hidden relative shadow-lg">
                  <div className="w-full text-left border-b border-zinc-900 pb-3 mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-lg">monetization_on</span>
                      <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">Token & Quota Consumption Loop</h4>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500">Per-Request Resource Allocation</span>
                  </div>

                  {/* Flow Nodes Diagram */}
                  <div className="flex flex-col items-center gap-4 w-full text-left max-w-lg font-sans">
                    {/* Node 1: Request Trigger */}
                    <div className="w-full p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 flex items-center gap-4 hover:border-zinc-700 transition-all select-none">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-white shrink-0">
                        <span className="material-symbols-outlined text-xl">upload_file</span>
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-500 font-bold">1. Entry Point</span>
                        <h5 className="text-white font-semibold font-geist text-[13px] mt-0.5">User Action (Speech/PDF)</h5>
                        <p className="text-zinc-500 font-light mt-1">E.g., 10-second mic recording is uploaded, containing ~30 spoken words.</p>
                      </div>
                    </div>

                    <div className="text-zinc-700 text-xs font-bold text-center select-none">↓</div>

                    {/* Node 2: Groq Whisper */}
                    <div className="w-full p-4 rounded-xl border border-indigo-500/20 bg-zinc-900/40 flex items-center gap-4 hover:border-indigo-500/40 transition-all select-none">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-indigo-400 shrink-0">
                        <span className="material-symbols-outlined text-xl">mic</span>
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-indigo-400 font-bold">2. ASR - Groq Whisper v3</span>
                        <h5 className="text-white font-semibold font-geist text-[13px] mt-0.5">Deduction: Requests Per Day (RPD)</h5>
                        <p className="text-zinc-500 font-light mt-1">Deducts **1 request** from Groq daily rate limit (14,400 RPD base limit). Audio duration is calculated but does not subtract dollars.</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-[#a5b4fc] font-bold bg-[#a5b4fc]/5 border border-[#a5b4fc]/20 px-2 py-0.5 rounded">1 Req</span>
                      </div>
                    </div>

                    <div className="text-indigo-500 text-xs font-bold text-center select-none">↓</div>

                    {/* Node 3: OpenRouter Claude */}
                    <div className="w-full p-4 rounded-xl border border-fuchsia-500/20 bg-zinc-900/40 flex items-center gap-4 hover:border-fuchsia-500/40 transition-all select-none">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-fuchsia-400 shrink-0">
                        <span className="material-symbols-outlined text-xl">psychology</span>
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-fuchsia-400 font-bold">3. LLM Refinement - Claude 3.5 Sonnet</span>
                        <h5 className="text-white font-semibold font-geist text-[13px] mt-0.5">Deduction: Input/Output Token Count</h5>
                        <p className="text-zinc-500 font-light mt-1">Prompt instructions (~180 tokens) + raw transcript (~35 tokens) ➔ outputs clean transcript (~35 tokens). Consumed via OpenRouter API credits.</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-fuchsia-400 font-bold bg-fuchsia-400/5 border border-fuchsia-400/20 px-2 py-0.5 rounded">~250 Tok</span>
                      </div>
                    </div>

                    <div className="text-fuchsia-500 text-xs font-bold text-center select-none">↓</div>

                    {/* Node 4: Azure Translation */}
                    <div className="w-full p-4 rounded-xl border border-sky-500/20 bg-zinc-900/40 flex items-center gap-4 hover:border-sky-500/40 transition-all select-none">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-sky-400 shrink-0">
                        <span className="material-symbols-outlined text-xl">translate</span>
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-sky-400 font-bold">4. NMT - Azure Translator</span>
                        <h5 className="text-white font-semibold font-geist text-[13px] mt-0.5">Deduction: Raw Character Count</h5>
                        <p className="text-zinc-500 font-light mt-1">Deducts the exact UTF-8 character length (e.g., 185 characters) from the Azure Translator monthly free quota (2 Million character limit).</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-sky-400 font-bold bg-sky-400/5 border border-sky-400/20 px-2 py-0.5 rounded">185 Chars</span>
                      </div>
                    </div>

                    <div className="text-sky-500 text-xs font-bold text-center select-none">↓</div>

                    {/* Node 5: ElevenLabs TTS */}
                    <div className="w-full p-4 rounded-xl border border-emerald-500/20 bg-zinc-900/40 flex items-center gap-4 hover:border-emerald-500/40 transition-all select-none">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                        <span className="material-symbols-outlined text-xl">volume_up</span>
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-emerald-400 font-bold">5. TTS - ElevenLabs Multilingual</span>
                        <h5 className="text-white font-semibold font-geist text-[13px] mt-0.5">Deduction: Plan Character Quota</h5>
                        <p className="text-zinc-500 font-light mt-1">Deducts the length of the translated text string (e.g., 210 characters) from your ElevenLabs billing plan quota (starts at 10,000 free chars/month).</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-400/5 border border-emerald-400/20 px-2 py-0.5 rounded">210 Chars</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Technical Allocation Guide */}
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 md:p-8 space-y-6">
                  <h3 className="text-lg font-semibold font-geist text-white">How API Quotas & Limits Are Deducted</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-sans font-light leading-relaxed">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-semibold font-geist text-sm mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                          ASR & Rate Limits (Groq)
                        </h4>
                        <p className="text-zinc-400 text-xs font-sans">
                          Groq's Whisper v3 implementation uses a rate-limiting model instead of a credit ledger. Every audio clip submitted counts as a single request. If multiple requests are sent concurrently, the server blocks with a `429 Too Many Requests` response. To optimize this, the Extension streams audio over WebSockets and accumulates data in a sliding 3-second buffer, preventing sub-second request overload.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold font-geist text-sm mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500"></span>
                          LLM Token Counting (OpenRouter)
                        </h4>
                        <p className="text-zinc-400 text-xs font-sans">
                          OpenRouter tracks balance in USD ($). When calling Claude 3.5 Sonnet, the prompt (instruction template + inputs) is tokenized into integer IDs. Every 100 words consumes roughly 130 tokens. Punctuation correction and diarization outputs are billed at a higher rate per token. If you run out of credits, OpenRouter blocks transcription improvement, and the server automatically bypasses the LLM layer, passing the raw Whisper transcript directly to the translation engine.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-semibold font-geist text-sm mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                          Azure Character Allocations
                        </h4>
                        <p className="text-zinc-400 text-xs font-sans">
                          Azure Translator bills strictly by character count, regardless of token metrics or language complexity. Spaces, emojis, and punctuation are counted. Our system optimizes consumption by only translating refined transcripts (after Claude's post-processing), preventing double-billing on garbled or accidental background noise captured by the microphone.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold font-geist text-sm mb-1.5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          ElevenLabs TTS Synthesis Credits
                        </h4>
                        <p className="text-zinc-400 text-xs font-sans">
                          ElevenLabs is the most resource-intensive API. Character credits are deducted based on the length of the *translated* output text string (not the source language). To avoid accidental over-drafting, our PDF Assistant segments documents and lets users select specific sections to translate and play, rather than auto-synthesizing the entire document at once.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 7: Project Structure */}
            {activeTab === "structure" && (
              <div className="space-y-8 max-w-3xl animate-in fade-in duration-300">
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-white text-xs font-geist uppercase tracking-widest font-mono text-zinc-500">File Directory Map</h3>
                  <pre className="p-6 bg-zinc-900/60 rounded-lg text-xs font-mono border border-zinc-800 text-zinc-300 leading-relaxed overflow-x-auto">
{`Voxa-ai/
├── Backend/                 # Python FastAPI Server & AI Services
│   └── app/
│       ├── api/             # API Router Gateways
│       │   ├── health.py    # Health Check
│       │   ├── speech.py    # REST Translation & Synthesis
│       │   ├── pdf.py       # PDF Parsing & Translation
│       │   └── websocket_api.py # WebSocket Stream Gateway
│       ├── core/            # Config & database setups
│       └── services/        # Logic handlers
│           ├── speech_service.py # Groq Whisper
│           ├── translation_service.py # Azure translator
│           └── tts_service.py # ElevenLabs synthesizer
│
├── Frontend/my-app/         # Next.js 16 Web Dashboard & Showcases
│   ├── public/              # Static assets
│   └── src/
│       ├── app/             # App routes (workspace, technology, profile)
│       └── components/      # UI components & shared navigation
│
└── Extension/               # Chrome Extension Manifest V3
    ├── background/          # Service Worker audio capture listeners
    ├── content/             # Visual subtitle overlays
    ├── offscreen/           # Audio downsampling offscreen pages
    └── sidepanel/           # Sidebar configuration settings`}
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
        <a href="/technology" className="flex flex-col items-center gap-1 text-[#6366f1] flex-1 py-1">
          <span className="material-symbols-outlined text-[22px]">insights</span>
          <span className="text-[10px] font-medium font-sans">Architecture</span>
        </a>
      </div>
    </div>
  );
}
