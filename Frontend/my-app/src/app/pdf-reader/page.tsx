"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import Header from "@/components/Header";

const LANGUAGES = [
  { code: "en-US", name: "English (US)" },
  { code: "es-ES", name: "Spanish" },
  { code: "fr-FR", name: "French" },
  { code: "de-DE", name: "German" },
  { code: "it-IT", name: "Italian" },
  { code: "pt-PT", name: "Portuguese" },
  { code: "ru-RU", name: "Russian" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "ja-JP", name: "Japanese" },
  { code: "ko-KR", name: "Korean" },
  { code: "hi-IN", name: "Hindi" },
  { code: "ar-SA", name: "Arabic" },
];

export default function PdfReaderPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Route protection
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login?required=true");
    } else if (!loading && !user) {
      router.push("/login?required=true");
    }
  }, [user, loading, router]);

  // PDF Assistant states
  const [pdfSourceLang, setPdfSourceLang] = useState("en-US");
  const [pdfTargetLang, setPdfTargetLang] = useState("hi-IN");
  const [pdfFileObj, setPdfFileObj] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfExtractedText, setPdfExtractedText] = useState("");
  const [pdfTranslatedText, setPdfTranslatedText] = useState("");
  const [pdfAudioUrl, setPdfAudioUrl] = useState<string | null>(null);
  const [isPdfProcessing, setIsPdfProcessing] = useState(false);
  const [pdfProgress, setPdfProgress] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [isPlayingPdfAudio, setIsPlayingPdfAudio] = useState(false);
  const [pdfProcessingStep, setPdfProcessingStep] = useState(0);
  const playingAudioRef = useRef<HTMLAudioElement | null>(null);

  // Restore states from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSource = sessionStorage.getItem("pdf_source_lang");
      const storedTarget = sessionStorage.getItem("pdf_target_lang");
      const storedName = sessionStorage.getItem("pdf_file_name");
      const storedExtracted = sessionStorage.getItem("pdf_extracted_text");
      const storedTranslated = sessionStorage.getItem("pdf_translated_text");
      const storedAudio = sessionStorage.getItem("pdf_audio_url");

      if (storedSource) setPdfSourceLang(storedSource);
      if (storedTarget) setPdfTargetLang(storedTarget);
      if (storedName) setPdfFileName(storedName);
      if (storedExtracted) setPdfExtractedText(storedExtracted);
      if (storedTranslated) setPdfTranslatedText(storedTranslated);
      if (storedAudio) setPdfAudioUrl(storedAudio);
    }
  }, []);

  // Sync preferences from user
  useEffect(() => {
    if (user) {
      const storedSource = sessionStorage.getItem("pdf_source_lang");
      const storedTarget = sessionStorage.getItem("pdf_target_lang");
      if (!storedSource && user.preferred_source_language) {
        setPdfSourceLang(user.preferred_source_language);
      }
      if (!storedTarget && user.preferred_target_language) {
        setPdfTargetLang(user.preferred_target_language);
      }
    }
  }, [user]);

  const savePdfState = (key: string, value: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, value);
    }
  };

  const handlePdfUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFileObj) {
      setPdfError("Please select a PDF file first.");
      return;
    }

    setPdfError("");
    setIsPdfProcessing(true);
    setPdfProcessingStep(1);
    setPdfProgress("Reading page 1...");

    try {
      const formData = new FormData();
      formData.append("file", pdfFileObj);
      formData.append("source_lang", pdfSourceLang);
      formData.append("target_lang", pdfTargetLang);

      const token = getAccessToken();
      const response = await fetch(
        `${(import.meta.env as any).VITE_BACKEND_URL || "http://127.0.0.1:8000"}/pdf/translate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.status === 401) {
        setPdfError("Session expired. Please login again.");
        setTimeout(() => {
          router.push("/login?expired=true");
        }, 1500);
        return;
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.detail || `Server returned error status: ${response.status}`
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to initialize stream reader.");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          try {
            const data = JSON.parse(trimmed);
            if (data.status === "processing") {
              setPdfProgress(data.message);
              const msg = data.message.toLowerCase();
              if (msg.includes("reading page") || msg.includes("parsing")) {
                setPdfProcessingStep(1);
              } else if (msg.includes("translating")) {
                setPdfProcessingStep(2);
              } else if (msg.includes("generating audio") || msg.includes("audio part")) {
                setPdfProcessingStep(3);
              } else if (msg.includes("merging") || msg.includes("concatenating") || msg.includes("saving")) {
                setPdfProcessingStep(4);
              }
            } else if (data.status === "completed") {
              setPdfExtractedText(data.extracted_text);
              setPdfTranslatedText(data.translated_text);
              setPdfAudioUrl(data.audio_url);
              setPdfFileName(pdfFileObj.name);

              savePdfState("pdf_extracted_text", data.extracted_text);
              savePdfState("pdf_translated_text", data.translated_text);
              savePdfState("pdf_audio_url", data.audio_url);
              savePdfState("pdf_file_name", pdfFileObj.name);
            } else if (data.status === "warning") {
              setPdfExtractedText(data.extracted_text);
              setPdfTranslatedText(data.translated_text);
              setPdfAudioUrl(null);
              setPdfFileName(pdfFileObj.name);
              setPdfError(data.warning);

              savePdfState("pdf_extracted_text", data.extracted_text);
              savePdfState("pdf_translated_text", data.translated_text);
              savePdfState("pdf_file_name", pdfFileObj.name);
              if (typeof window !== "undefined") {
                sessionStorage.removeItem("pdf_audio_url");
              }
            } else if (data.status === "error") {
              throw new Error(data.message);
            }
          } catch (jsonErr: any) {
            console.error("JSON parsing error inside stream:", jsonErr);
          }
        }
      }
    } catch (err: any) {
      setPdfProcessingStep(0);
      setPdfError(err.message || "Something went wrong.");
      console.error(err);
    } finally {
      setIsPdfProcessing(false);
    }
  };

  const playPdfAudio = () => {
    if (!pdfAudioUrl) return;

    try {
      if (playingAudioRef.current) {
        playingAudioRef.current.pause();
        playingAudioRef.current.src = "";
        playingAudioRef.current = null;
        setIsPlayingPdfAudio(false);
        return;
      }

      const audio = new Audio(`${pdfAudioUrl}?t=${Date.now()}`);
      playingAudioRef.current = audio;
      setIsPlayingPdfAudio(true);

      audio.onended = () => {
        setIsPlayingPdfAudio(false);
        playingAudioRef.current = null;
      };

      audio.onerror = () => {
        setPdfError("Failed to stream synthetic audio speech.");
        setIsPlayingPdfAudio(false);
        playingAudioRef.current = null;
      };

      audio.play().catch((err) => {
        setPdfError(`Audio playback failed: ${err.message}`);
        setIsPlayingPdfAudio(false);
        playingAudioRef.current = null;
      });
    } catch (err) {
      console.error("Playback error:", err);
      setIsPlayingPdfAudio(false);
      playingAudioRef.current = null;
    }
  };

  const clearPdfData = () => {
    if (playingAudioRef.current) {
      playingAudioRef.current.pause();
      playingAudioRef.current.src = "";
      playingAudioRef.current = null;
    }
    setPdfFileObj(null);
    setPdfFileName("");
    setPdfExtractedText("");
    setPdfTranslatedText("");
    setPdfAudioUrl(null);
    setPdfProgress("");
    setPdfError("");
    setPdfProcessingStep(0);
    setIsPlayingPdfAudio(false);

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("pdf_extracted_text");
      sessionStorage.removeItem("pdf_translated_text");
      sessionStorage.removeItem("pdf_audio_url");
      sessionStorage.removeItem("pdf_file_name");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#030305] flex flex-col items-center justify-center gap-4 text-center select-none font-sans">
        <span className="w-8 h-8 border-2 border-white/20 border-t-[#00f5ff] rounded-full animate-spin"></span>
        <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">Syncing Assistant...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#030305] text-white min-h-screen relative overflow-hidden font-sans flex flex-col justify-between">
      {/* Ambient background blur */}
      <div className="absolute top-[10%] right-[10%] w-[450px] h-[450px] bg-[#8b5cf6]/5 rounded-full blur-[140px] animate-float-slow-1 pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[450px] h-[450px] bg-[#00f5ff]/5 rounded-full blur-[140px] animate-float-slow-2 pointer-events-none"></div>

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-16 z-10 relative max-w-[1000px] w-full mx-auto">
        
        {/* Error Notification */}
        {pdfError && (
          <div className="w-full mb-6 bg-red-950/30 border border-red-500/20 text-red-200 text-xs px-4 py-3 rounded-xl flex items-center justify-between backdrop-blur-md">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {pdfError}
            </span>
            <button onClick={() => setPdfError("")} className="text-red-200 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* Dynamic State Layout */}
        {!pdfExtractedText ? (
          /* UPLOAD CONSOLE */
          <div className="w-full max-w-[600px] glass-card p-8 border border-white/5 flex flex-col items-center gap-8 text-center relative">
            
            {/* Header controls: Language pickers */}
            <div className="w-full flex items-center justify-center border-b border-white/5 pb-4 select-none">
              <div className="flex items-center gap-3">
                <select
                  value={pdfSourceLang}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPdfSourceLang(val);
                    savePdfState("pdf_source_lang", val);
                  }}
                  className="bg-white/5 border border-white/10 text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg outline-none cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-zinc-950 text-white">
                      {l.name}
                    </option>
                  ))}
                </select>

                <span className="material-symbols-outlined text-zinc-600 text-sm">east</span>

                <select
                  value={pdfTargetLang}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPdfTargetLang(val);
                    savePdfState("pdf_target_lang", val);
                  }}
                  className="bg-white/5 border border-white/10 text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg outline-none cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-zinc-950 text-white">
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Glass Drop Zone Container */}
            <form onSubmit={handlePdfUpload} className="w-full flex flex-col items-center gap-6">
              
              {!isPdfProcessing ? (
                <label className="w-full min-h-[220px] rounded-2xl border-2 border-dashed border-white/10 hover:border-[#8b5cf6]/50 bg-white/2 hover:bg-white/3 flex flex-col items-center justify-center p-6 cursor-pointer transition-all duration-300 group">
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setPdfFileObj(file);
                        setPdfFileName(file.name);
                      }
                    }}
                  />
                  <span className="material-symbols-outlined text-4xl text-zinc-500 group-hover:text-[#00f5ff] transition-colors mb-4">
                    upload_file
                  </span>
                  {pdfFileName ? (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white max-w-sm overflow-hidden text-ellipsis whitespace-nowrap">
                        {pdfFileName}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono uppercase">
                        {(pdfFileObj!.size / (1024 * 1024)).toFixed(2)} MB | Ready
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-white">Select PDF Document</p>
                      <p className="text-[10px] text-zinc-500 mt-1 uppercase font-mono tracking-wider">
                        Drag and drop or browse files
                      </p>
                    </div>
                  )}
                </label>
              ) : (
                /* Glowing Circular Processing Indicator */
                <div className="w-full min-h-[220px] flex flex-col items-center justify-center gap-5">
                  <div className="relative flex items-center justify-center">
                    <span className="w-16 h-16 border-4 border-[#8b5cf6]/20 border-t-[#00f5ff] rounded-full animate-spin"></span>
                    <span className="absolute w-10 h-10 bg-[#8b5cf6]/10 rounded-full animate-ping"></span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-mono text-[#00f5ff] tracking-wider uppercase animate-pulse">
                      {pdfProgress || "Reading PDF pages..."}
                    </p>
                    <p className="text-[9px] text-zinc-500 uppercase font-mono tracking-widest">
                      Processing Pipeline step {pdfProcessingStep}/4
                    </p>
                  </div>
                </div>
              )}

              {/* Translate Submit button */}
              {pdfFileObj && !isPdfProcessing && (
                <button
                  type="submit"
                  className="bg-white text-black text-xs font-bold uppercase tracking-wider px-8 py-3 rounded-lg hover:bg-zinc-200 transition-colors shadow-lg active:scale-95"
                >
                  Translate Document
                </button>
              )}
            </form>

          </div>
        ) : (
          /* CINEMATIC BOOK-LIKE DUAL READER */
          <div className="w-full flex flex-col gap-6 relative">
            
            {/* Header toolbar */}
            <div className="w-full glass-card px-6 py-4 flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#00f5ff]">picture_as_pdf</span>
                <span className="text-xs font-mono font-bold uppercase tracking-wide max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                  {pdfFileName}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {pdfAudioUrl && (
                  <button
                    onClick={playPdfAudio}
                    className={`flex items-center gap-1.5 px-4.5 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-colors active:scale-95 ${
                      isPlayingPdfAudio
                        ? "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]"
                        : "bg-white text-black hover:bg-zinc-200"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">
                      {isPlayingPdfAudio ? "pause" : "volume_up"}
                    </span>
                    {isPlayingPdfAudio ? "Playing" : "Listen Speech"}
                  </button>
                )}

                <button
                  onClick={clearPdfData}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-mono uppercase tracking-wider px-4.5 py-2 rounded-lg transition-colors active:scale-95"
                >
                  Clear Document
                </button>
              </div>
            </div>

            {/* Book Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-280px)] min-h-[400px]">
              
              {/* Left Column: Extracted */}
              <div className="glass-card p-6 border border-white/5 flex flex-col gap-4 overflow-hidden">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 select-none">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
                    ORIGINAL EXTRACTED TEXT ({pdfSourceLang.split("-")[0].toUpperCase()})
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-zinc-400 text-sm font-light leading-relaxed whitespace-pre-wrap select-text">
                  {pdfExtractedText}
                </div>
              </div>

              {/* Right Column: Translated */}
              <div className="glass-card p-6 border border-white/5 flex flex-col gap-4 overflow-hidden">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 select-none">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-[#00f5ff] uppercase">
                    TRANSLATION ({pdfTargetLang.split("-")[0].toUpperCase()})
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-white text-sm font-light leading-relaxed whitespace-pre-wrap select-text">
                  {pdfTranslatedText}
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Zen Footer */}
      <footer className="py-8 text-center text-[10px] font-mono text-zinc-700 border-t border-white/2 max-w-[1000px] w-[90%] mx-auto z-10 relative">
        VOXA DOCUMENT CONSOLE | ENCRYPTED EPHEMERAL BUFFER
      </footer>
    </div>
  );
}
