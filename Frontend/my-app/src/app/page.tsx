"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { motion } from "framer-motion";


const features = [
  {
    icon: "sync_alt",
    title: "Real-Time WebSockets",
    desc: "Streams tab captured audio segments continuously from the Chrome Extension to a FastAPI server with sub-second response times.",
    accent: "group-hover:border-[#8b5cf6]/20",
    iconColor: "text-[#8b5cf6]",
  },
  {
    icon: "interpreter_mode",
    title: "Local Speaker Diarization",
    desc: "Lightweight CPU-based audio pitch extraction (F0) to cluster dialogue by speaker (e.g. Speaker A, Speaker B) dynamically.",
    accent: "group-hover:border-[#adc6ff]/20",
    iconColor: "text-[#adc6ff]",
  },
  {
    icon: "speech_to_text",
    title: "Whisper ASR + Claude Sonnet 4",
    desc: "Decodes speech via Groq Whisper large-v3 and automatically refines spelling, proper nouns, and boundaries via Claude Sonnet 4.",
    accent: "group-hover:border-[#ffb869]/20",
    iconColor: "text-[#ffb869]",
  },
  {
    icon: "translate",
    title: "Azure Neural Translation",
    desc: "Translates transcription dynamically using contextual neural machine translation supporting dozens of target locales.",
    accent: "group-hover:border-[#d0bcff]/20",
    iconColor: "text-[#d0bcff]",
  },
  {
    icon: "settings_voice",
    title: "Expressive Speech Synthesis",
    desc: "Synthesizes final translations back into speech using ElevenLabs multilingual voice model for realistic audio output.",
    accent: "group-hover:border-[#3b82f6]/20",
    iconColor: "text-[#3b82f6]",
  },
  {
    icon: "extension",
    title: "Chrome Extension Integration",
    desc: "Manifest V3 tab capture captures Google Meet calls and injects interactive subtitle overlay widgets on top of tabs.",
    accent: "group-hover:border-[#8b5cf6]/20",
    iconColor: "text-[#8b5cf6]",
  },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Header />

      <main className="bg-black text-[#e7e0ed] min-h-screen relative z-10 font-sans overflow-hidden pb-12 grid-bg radial-glow">

        {/* Hero Section */}
        <section className="pt-40 pb-24 px-6 max-w-[1200px] mx-auto text-center relative z-10">
          
          {/* Release Chip */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-[11px] font-mono tracking-widest text-[#d0bcff] mb-8 select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-pulse"></span>
            VOXA MULTILINGUAL TRANSLATION GATEWAY
          </motion.div>

          {/* Main Title with Elegant White-to-Purple Gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] mb-6 max-w-4xl mx-auto font-geist text-white pb-2"
          >
            Real-time multilingual <br className="hidden sm:inline" />
            audio translation.
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light font-sans"
          >
            Real-time AI-powered speech translation for Google Meet, calls, and live browser audio. Capture, transcribe, refine transcript, and translate inside your browser.
          </motion.p>

          {/* Action CTAs with Micro-Scales */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-24"
          >
            <Link
              href="/workspace"
              className="bg-[#8b5cf6] text-white px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-[#7c3aed] transition-all flex items-center gap-2 active:scale-98 select-none shadow-sm"
            >
              Launch Workspace
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            <Link
              href="/technology"
              className="border border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:text-white px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-zinc-900/80 hover:border-zinc-700 transition-all active:scale-98 select-none"
            >
              System Architecture
            </Link>
          </motion.div>

          {/* Terminal Mockup Wrapper (adds a clean flat border) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-4xl mx-auto rounded-xl p-[1px] bg-zinc-800/80 shadow-2xl"
          >
            {/* Terminal Inner Frame */}
            <div className="relative rounded-xl bg-zinc-950/80 backdrop-blur-xl overflow-hidden">
              <div className="h-10 border-b border-zinc-900 flex items-center px-4 gap-1.5 bg-zinc-950/50 select-none">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                <div className="ml-4 text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-mono font-medium">
                  VOXA REAL-TIME TRANSCRIPTION TESTBED
                </div>
              </div>
              
              <div className="p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="flex flex-col gap-5 text-left w-full md:w-1/2">
                  <div className="space-y-1.5">
                    <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest font-bold">INPUT_STREAM [EN-US]</div>
                    <div className="text-white text-base font-light font-sans leading-relaxed">
                      "Voxa streams tab audio over WebSockets."
                    </div>
                  </div>
                  <div className="h-px bg-zinc-900 w-full"></div>
                  <div className="space-y-1.5">
                    <div className="text-[9px] text-[#d0bcff] font-mono uppercase tracking-widest font-bold">
                      OUTPUT_STREAM [JA-JP]
                    </div>
                    <div className="text-[#d0bcff] text-base font-light font-sans leading-relaxed">
                      "VoxaはWebSockets経由でタブオーディオをストリーミングします。"
                    </div>
                  </div>
                </div>

                {/* Live Waveform Simulator */}
                <div className="w-full md:w-auto border border-zinc-900 rounded-xl p-6 bg-zinc-900/20 flex flex-col items-center gap-4 shrink-0">
                  <div className="flex items-end gap-1.5 h-12 select-none">
                    <div
                      className="w-1.5 bg-[#8b5cf6]/80 rounded-full animate-waveform-jump"
                      style={{ animationDelay: "0s", height: "40%" }}
                    ></div>
                    <div
                      className="w-1.5 bg-[#8b5cf6]/80 rounded-full animate-waveform-jump"
                      style={{ animationDelay: "0.2s", height: "60%" }}
                    ></div>
                    <div
                      className="w-1.5 bg-zinc-700 rounded-full animate-waveform-jump"
                      style={{ animationDelay: "0.1s", height: "80%" }}
                    ></div>
                    <div
                      className="w-1.5 bg-[#8b5cf6]/80 rounded-full animate-waveform-jump"
                      style={{ animationDelay: "0.4s", height: "30%" }}
                    ></div>
                    <div
                      className="w-1.5 bg-[#8b5cf6]/80 rounded-full animate-waveform-jump"
                      style={{ animationDelay: "0.3s", height: "70%" }}
                    ></div>
                  </div>
                  <div className="text-[9px] font-mono text-zinc-600 tracking-widest">PROCESSING LATENCY: &lt; 1.0S</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Premium Grid */}
        <section className="max-w-[1200px] mx-auto px-6 py-24 border-t border-zinc-900 relative z-10">
          <div className="mb-12 text-center md:text-left">
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-zinc-500 border-l-2 border-[#8b5cf6] pl-4">Capabilities</span>
            <h2 className="text-3xl font-semibold font-geist text-white mt-3 tracking-tight">Full stack speech translation pipeline.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={`p-8 flex flex-col gap-6 group border border-zinc-900 bg-zinc-950/40 rounded-xl transition-all duration-300`}
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-center select-none">
                  <span className={`material-symbols-outlined text-xl ${feat.iconColor}`}>{feat.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-2 text-white font-geist transition-colors">{feat.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans font-light">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats / Trust Section */}
        <section className="max-w-[1200px] mx-auto px-6 py-24 border-t border-zinc-900 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-zinc-500 border-l-2 border-[#8b5cf6] pl-4">Core Pipeline Metrics</span>
              <h2 className="text-3xl font-bold tracking-tight text-white font-geist mt-3 mb-6">Optimized for fast processing.</h2>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed font-light font-sans">
                Voxa processes streaming audio chunks in 500ms intervals, running speech recognition, LLM post-processing correction, and translation concurrently to keep latency under 1 second.
              </p>
              <div className="flex flex-wrap gap-x-12 gap-y-8 select-none">
                <div>
                  <div className="text-3xl font-bold text-[#d0bcff] font-geist">&lt; 1.0s</div>
                  <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono mt-1">Processing Latency</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#adc6ff] font-geist">500ms</div>
                  <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono mt-1">Streaming Chunk Size</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#ffb869] font-geist">45+</div>
                  <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono mt-1">Supported Languages</div>
                </div>
              </div>
            </div>

            {/* Spec grid cells */}
            <div className="md:w-1/2 w-full grid grid-cols-2 gap-4">
              <div className="p-8 flex flex-col items-center justify-center text-center border border-zinc-900 bg-zinc-950/40 rounded-xl select-none">
                <span className="material-symbols-outlined text-zinc-400 text-2xl mb-4">dns</span>
                <div className="text-xs font-mono tracking-wider text-zinc-300">FastAPI Backend</div>
              </div>
              <div className="p-8 flex flex-col items-center justify-center text-center border border-zinc-900 bg-zinc-950/40 rounded-xl select-none">
                <span className="material-symbols-outlined text-zinc-400 text-2xl mb-4">settings_ethernet</span>
                <div className="text-xs font-mono tracking-wider text-zinc-300">WebSockets Core</div>
              </div>
              <div className="p-8 flex flex-col items-center justify-center text-center border border-zinc-900 bg-zinc-950/40 rounded-xl select-none">
                <span className="material-symbols-outlined text-zinc-400 text-2xl mb-4">psychology</span>
                <div className="text-xs font-mono tracking-wider text-zinc-300">Claude Postprocess</div>
              </div>
              <div className="p-8 flex flex-col items-center justify-center text-center border border-zinc-900 bg-zinc-950/40 rounded-xl select-none">
                <span className="material-symbols-outlined text-zinc-400 text-2xl mb-4">extension</span>
                <div className="text-xs font-mono tracking-wider text-zinc-300">Extension Widget</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA wrapped inside a clean flat container */}
        <section className="max-w-[1200px] mx-auto px-6 py-12 relative z-10">
          <div className="relative rounded-2xl border border-zinc-900 bg-zinc-950/80 overflow-hidden shadow-xl">
            <div className="relative z-10 px-8 py-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-white font-geist">Synthesize translations instantly.</h2>
              <p className="text-zinc-400 mb-10 max-w-xl mx-auto font-light font-sans text-sm">
                Experience natural human voice playback, customized speaker diarization, and contextual ASR transcript correction.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/workspace"
                  className="bg-[#8b5cf6] text-white px-10 py-3.5 rounded-lg font-bold hover:bg-[#7c3aed] transition-colors text-sm shadow-md active:scale-98"
                >
                  Open Workspace
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-[#cbc3d7] relative z-10 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 py-16 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-lg font-bold text-white group">
              <div className="w-8 h-8 rounded bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                >
                  <path
                    d="M4.5 4L12 18L19.5 4"
                    stroke="url(#voxa-landing-v-grad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.5 9.5L12 13.5L15.5 9.5"
                    stroke="url(#voxa-landing-v-inner)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.8"
                  />
                  <defs>
                    <linearGradient id="voxa-landing-v-grad" x1="4.5" y1="4" x2="19.5" y2="4">
                      <stop stopColor="#d0bcff" />
                      <stop offset="0.5" stopColor="#8b5cf6" />
                      <stop offset="1" stopColor="#3b82f6" />
                    </linearGradient>
                    <linearGradient id="voxa-landing-v-inner" x1="8.5" y1="9.5" x2="15.5" y2="9.5">
                      <stop stopColor="#ffb869" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="font-bold text-white font-headline-md">Voxa</span>
            </div>
            <p className="text-sm text-zinc-400 max-w-xs leading-relaxed font-light font-sans">
              Building the future of neural translation and global communication infrastructure.
            </p>
            {/* Customized Developer Signature */}
            <div className="flex flex-col items-start gap-1 py-1 select-none pt-4">
              <p className="text-xs text-zinc-500 font-mono tracking-wider leading-relaxed">
                Fueled by <span className="text-[#ffb869] font-semibold">Diet Coke</span> 🥤 &amp; <span className="text-[#8b5cf6] font-semibold">iterating minds</span> 🧠
              </p>
              <p className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase mt-0.5">
                — Priyanshu Raj
              </p>
            </div>
            {/* Social Platform Links */}
            <div className="flex items-center gap-4.5 text-zinc-500 mt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077b5] transition-all hover:scale-110 duration-200" title="LinkedIn Profile">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://github.com/priyanshuraj20" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all hover:scale-110 duration-200" title="GitHub Profile">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#e1306c] transition-all hover:scale-110 duration-200" title="Instagram Profile">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="mailto:priyanshuraj.work@gmail.com" className="hover:text-[#8b5cf6] transition-all hover:scale-110 duration-200" title="Send Email">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16 font-sans">
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#cbc3d7]/30">Product</h4>
              <Link href="/workspace" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Translation API
              </Link>
              <Link href="/workspace" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Vocal Engine
              </Link>
              <Link href="/workspace" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Real-time Suite
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#cbc3d7]/30">Resources</h4>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                API Reference
              </Link>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                System Status
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#cbc3d7]/30">Company</h4>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Security Policy
              </Link>
              <Link href="/technology" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <div>© 2026 Voxa AI. All rights reserved.</div>
          <div className="flex gap-6 font-mono text-[10px]">
            <Link href="#" className="hover:text-[#d0bcff] transition-colors">PRIVACY_POLICY</Link>
            <Link href="#" className="hover:text-[#d0bcff] transition-colors">TERMS_OF_SERVICE</Link>
            <Link href="#" className="hover:text-[#d0bcff] transition-colors">GDPR_COMPLIANCE</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
