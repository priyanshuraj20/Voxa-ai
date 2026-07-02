"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

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

  // Sync preferences from user configuration
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
    setPdfProgress("Reading page 1...");

    try {
      const formData = new FormData();
      formData.append("file", pdfFileObj);
      formData.append("source_lang", pdfSourceLang);
      formData.append("target_lang", pdfTargetLang);

      const token = getAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"}/pdf/translate`,
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
            console.error("JSON parsing error:", jsonErr);
          }
        }
      }
    } catch (err: any) {
      setPdfError(err.message || "Failed to process PDF.");
    } finally {
      setIsPdfProcessing(false);
      setPdfProgress("");
    }
  };

  const handleClearPdf = () => {
    setPdfFileObj(null);
    setPdfFileName("");
    setPdfExtractedText("");
    setPdfTranslatedText("");
    setPdfAudioUrl(null);
    setPdfError("");

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("pdf_file_name");
      sessionStorage.removeItem("pdf_extracted_text");
      sessionStorage.removeItem("pdf_translated_text");
      sessionStorage.removeItem("pdf_audio_url");
    }
  };

  const playPdfSpeech = () => {
    if (!pdfAudioUrl) return;

    try {
      const audio = new Audio(`${pdfAudioUrl}?t=${Date.now()}`);
      setIsPlayingPdfAudio(true);

      audio.onended = () => setIsPlayingPdfAudio(false);
      audio.onerror = () => {
        setPdfError("Failed to play synthesized speech audio.");
        setIsPlayingPdfAudio(false);
      };

      audio.play().catch((e) => {
        setPdfError(`Audio play failed: ${e.message}`);
        setIsPlayingPdfAudio(false);
      });
    } catch (err) {
      setPdfError("Audio synthesis playback failed.");
      setIsPlayingPdfAudio(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-center select-none font-sans">
        <span className="w-8 h-8 border-2 border-white/20 border-t-[#6366f1] rounded-full animate-spin"></span>
        <p className="text-sm text-zinc-500 font-mono tracking-widest uppercase">
          Authorizing Session...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-[#e7e0ed] relative font-sans grid-bg radial-glow">
      <Header />

      <div className="flex flex-1 pt-[120px] overflow-hidden relative z-10 min-h-0">
        <Sidebar />

        {/* Core PDF Layout scroll-container */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-transparent">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            
            {/* PDF Reading Assistant Card */}
            <div className="border border-zinc-900 bg-zinc-950/20 p-8 rounded-xl flex flex-col gap-6 relative select-none">
              
              {/* Header Info Block */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#6366f1] text-xl">
                      picture_as_pdf
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold font-geist text-white tracking-tight">
                      PDF Reading Assistant
                    </h2>
                    <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase mt-0.5">
                      Document Translation &amp; Speech
                    </span>
                  </div>
                </div>

                {/* PDF Language Selectors */}
                <div className="flex items-center gap-4">
                  {/* PDF Source Language Selector */}
                  <div className="flex items-center gap-2 px-2.5 py-1 border border-white/10 rounded-lg bg-white/5">
                    <span className="font-mono text-[9px] text-[#cbc3d7]/50 uppercase tracking-widest">
                      PDF Source
                    </span>
                    <select
                      value={pdfSourceLang}
                      onChange={(e) => {
                        const newSource = e.target.value;
                        setPdfSourceLang(newSource);
                        savePdfState("pdf_source_lang", newSource);
                        if (newSource === pdfTargetLang) {
                          const fallback = LANGUAGES.find((lang) => lang.code !== newSource);
                          if (fallback) {
                            setPdfTargetLang(fallback.code);
                            savePdfState("pdf_target_lang", fallback.code);
                          }
                        }
                      }}
                      className="bg-transparent text-white font-mono text-[10px] font-bold outline-none border-none cursor-pointer"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code} className="bg-black text-[#e7e0ed]">
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PDF Target Language Selector */}
                  <div className="flex items-center gap-2 px-2.5 py-1 border border-white/10 rounded-lg bg-white/5">
                    <span className="font-mono text-[9px] text-[#cbc3d7]/50 uppercase tracking-widest">
                      PDF Target
                    </span>
                    <select
                      value={pdfTargetLang}
                      onChange={(e) => {
                        const newTarget = e.target.value;
                        setPdfTargetLang(newTarget);
                        savePdfState("pdf_target_lang", newTarget);
                        if (newTarget === pdfSourceLang) {
                          const fallback = LANGUAGES.find((lang) => lang.code !== newTarget);
                          if (fallback) {
                            setPdfSourceLang(fallback.code);
                            savePdfState("pdf_source_lang", fallback.code);
                          }
                        }
                      }}
                      className="bg-transparent text-[#6366f1] font-mono text-[10px] font-bold outline-none border-none cursor-pointer"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code} className="bg-black text-[#e7e0ed]">
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Error block */}
              {pdfError && (
                <div className="bg-[#93000a]/20 border border-[#ffb4ab]/40 text-[#ffdad6] px-4 py-2.5 rounded-lg flex items-center justify-between text-xs font-sans">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {pdfError}
                  </span>
                  <button onClick={() => setPdfError("")} className="text-[#ffdad6] hover:text-white">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              )}

              {/* Display Panels */}
              <div className="grid grid-cols-12 gap-6 min-h-[300px]">
                
                {/* PDF Extraction Panel (Left) */}
                <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
                  <div className="flex-1 border border-white/5 bg-black/40 rounded-xl flex flex-col overflow-hidden min-h-[250px]">
                    <div className="flex justify-between items-center p-3.5 border-b border-white/5 bg-black/20 select-none">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#cbc3d7]/60">
                        [01] PDF_Source_Content
                      </span>
                      {pdfFileName && (
                        <span className="text-[10px] text-[#adc6ff] font-mono max-w-[200px] truncate">
                          File: {pdfFileName}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-start">
                      {!pdfExtractedText ? (
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-lg p-6 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/20 transition-all duration-200 cursor-pointer relative">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setPdfFileObj(e.target.files[0]);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <span className="material-symbols-outlined text-3xl text-zinc-600 mb-3 animate-pulse">
                            upload_file
                          </span>
                          <p className="text-xs text-zinc-400 font-semibold text-center mb-1">
                            {pdfFileObj ? pdfFileObj.name : "Drag & drop PDF here, or click to browse"}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-mono text-center">
                            PDF files only
                          </p>
                        </div>
                      ) : (
                        <textarea
                          readOnly
                          value={pdfExtractedText}
                          className="w-full h-48 bg-transparent text-sm text-[#cbc3d7] font-sans leading-relaxed focus:outline-none resize-none custom-scrollbar"
                        />
                      )}
                    </div>
                  </div>

                  {/* PDF Upload Buttons */}
                  {!pdfExtractedText ? (
                    <button
                      onClick={handlePdfUpload}
                      disabled={isPdfProcessing || !pdfFileObj}
                      className={`w-full h-[40px] flex items-center justify-center gap-2 rounded-lg font-bold tracking-wider font-mono text-[11px] uppercase transition-all active:scale-98 ${
                        isPdfProcessing || !pdfFileObj
                          ? "bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed"
                          : "bg-[#6366f1] text-white hover:bg-[#4f46e5]"
                      }`}
                    >
                      {isPdfProcessing ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                          {pdfProgress || "Extracting & Translating..."}
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">translate</span>
                          Upload &amp; Translate PDF
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleClearPdf}
                      className="w-full h-[40px] flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-bold tracking-wider font-mono text-[11px] uppercase transition-all active:scale-98"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Clear PDF Assistant
                    </button>
                  )}
                </div>

                {/* PDF Translation Panel (Right) */}
                <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
                  <div className="flex-1 border border-white/5 bg-black/40 rounded-xl flex flex-col overflow-hidden min-h-[250px]">
                    <div className="p-3.5 border-b border-white/5 bg-black/20 select-none">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#cbc3d7]/60">
                        [02] Translated_Output
                      </span>
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-start">
                      {!pdfTranslatedText ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-zinc-900/50 border-dashed rounded-lg bg-black/20">
                          <span className="material-symbols-outlined text-3xl text-zinc-700 mb-3">
                            translate
                          </span>
                          <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                            Awaiting document upload...
                          </p>
                        </div>
                      ) : (
                        <textarea
                          readOnly
                          value={pdfTranslatedText}
                          className="w-full h-48 bg-transparent text-sm text-[#cbc3d7] font-sans leading-relaxed focus:outline-none resize-none custom-scrollbar"
                        />
                      )}
                    </div>
                  </div>

                  {/* Speech playback trigger button */}
                  <button
                    onClick={playPdfSpeech}
                    disabled={!pdfAudioUrl || isPlayingPdfAudio}
                    className={`w-full h-[40px] flex items-center justify-center gap-2 rounded-lg font-bold tracking-wider font-mono text-[11px] uppercase transition-all active:scale-98 ${
                      !pdfAudioUrl || isPlayingPdfAudio
                        ? "bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed"
                        : "bg-[#6366f1] text-white hover:bg-[#4f46e5]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      volume_up
                    </span>
                    Play PDF Speech
                  </button>
                </div>
              </div>
            </div>

            {/* Flat Description Info Section */}
            <div className="mt-8 border border-zinc-900 bg-zinc-950/20 p-8 rounded-xl space-y-4 font-sans select-none">
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#cbc3d7]/30 block">
                Technical Architecture
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                Document Synthesis Operations
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-light">
                Our parsing gateway processes PDF structures directly in memory, bypassing storage constraints to protect client confidentiality. Extracted blocks are parsed using context boundaries to feed Azure translation engines, outputting clean transcripts ready for local playback.
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
