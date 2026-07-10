// app/workspace/page.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAccessToken } from "@/lib/auth";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import CustomAudioPlayer from "@/components/ui/CustomAudioPlayer";
import { LANGUAGES } from "@/constants/languages";

const waveformBars = [
  { delay: "0.1s", height: "30%" },
  { delay: "0.3s", height: "60%" },
  { delay: "0.2s", height: "45%" },
  { delay: "0.5s", height: "80%" },
  { delay: "0.4s", height: "40%" },
  { delay: "0.6s", height: "95%" },
  { delay: "0.3s", height: "50%" },
  { delay: "0.7s", height: "35%" },
  { delay: "0.2s", height: "75%" },
  { delay: "0.4s", height: "20%" },
  { delay: "0.1s", height: "55%" },
];

export default function WorkspacePage() {
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

  // Operational Mode State
  const [mode, setMode] = useState<"batch" | "realtime">("batch");

  // States
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [processingStep, setProcessingStep] = useState<number>(0);

  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi-IN");
  const [transcript, setTranscript] = useState("");
  const [outputText, setOutputText] = useState(
    "Welcome to the applied technology conference. Today we will explore the future of neural translation."
  );
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);

  // Refs for Batch Mode
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const playingAudioRef = useRef<HTMLAudioElement | null>(null);

  // Refs for Real-Time Streaming Mode
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up WebGL, WS, and Audio contexts on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.close();
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Synchronize language shifts dynamically over active WebSocket without reconnects
  useEffect(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("🔄 Syncing updated languages to WebSocket:", sourceLang, targetLang);
      socketRef.current.send(JSON.stringify({
        action: "switch_languages",
        source_lang: sourceLang,
        target_lang: targetLang
      }));
    }
  }, [sourceLang, targetLang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  const validateLanguages = () => {
    if (sourceLang === targetLang) {
      setError("Source and Target language cannot be the same.");
      return false;
    }
    return true;
  };

  // ==========================================
  // REAL-TIME WEBSOCKET STREAMING MODE
  // ==========================================

  const startRealtimeStreaming = async () => {
    setError("");
    setTranscript("");
    setOutputText("Listening to stream... Speak now.");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const backendUrl = (import.meta.env as any).VITE_BACKEND_URL || "http://127.0.0.1:8000";
      const wsUrl = backendUrl.replace("http://", "ws://").replace("https://", "wss://") + `/ws?source_lang=${sourceLang}&target_lang=${targetLang}`;
      
      console.log("🔌 Connecting to real-time WebSocket:", wsUrl);
      const socket = new WebSocket(wsUrl);
      socket.binaryType = "arraybuffer";
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("✅ Real-time WebSocket connection opened.");
        
        // Start Audio Context downsampling to 16kHz PCM mono
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass({ sampleRate: 16000 });
        audioContextRef.current = audioContext;

        const sourceNode = audioContext.createMediaStreamSource(stream);
        sourceNodeRef.current = sourceNode;

        const processorNode = audioContext.createScriptProcessor(4096, 1, 1);
        processorNodeRef.current = processorNode;

        processorNode.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const int16Buffer = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]));
            int16Buffer[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }

          if (socket.readyState === WebSocket.OPEN) {
            socket.send(int16Buffer.buffer);
          }
        };

        sourceNode.connect(processorNode);
        processorNode.connect(audioContext.destination);
        
        setIsRecording(true);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📨 Real-time transcript chunk:", data);
          if (data.transcript) {
            setTranscript((prev) => prev ? prev + " " + data.transcript : data.transcript);
          }
          if (data.translation) {
            setOutputText((prev) => {
              const defaultText = "Welcome to the applied technology conference. Today we will explore the future of neural translation.";
              const isDefault = prev === defaultText || prev === "Listening to stream... Speak now." || prev.startsWith("Your translation");
              return isDefault ? data.translation : prev + " " + data.translation;
            });
          }
          
          if (data.audio) {
            const audioSrc = `data:audio/mp3;base64,${data.audio}`;
            const audio = new Audio(audioSrc);
            audio.play().catch((e) => console.log("Audio playback blocked by gesture security:", e));
          }
        } catch (jsonErr) {
          console.error("JSON parse error on WebSocket message:", jsonErr);
        }
      };

      socket.onclose = () => {
        console.log("🔌 Real-time WebSocket connection closed.");
        stopRealtimeStreaming();
      };

      socket.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
        setError("WebSocket connection failed.");
        stopRealtimeStreaming();
      };

    } catch (err) {
      setError("Microphone access denied or connection failed.");
      console.error(err);
      stopRealtimeStreaming();
    }
  };

  const stopRealtimeStreaming = () => {
    setIsRecording(false);

    if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING) {
        socketRef.current.close();
      }
      socketRef.current = null;
    }

    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }

    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current.onaudioprocess = null;
      processorNodeRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // ==========================================
  // BATCH UPLOAD (SSE STREAMING) MODE
  // ==========================================

  const startRecording = async () => {
    setError("");
    setTranscript("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        await uploadAudio(blob);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Microphone access denied. Please inspect settings.");
      console.error("Recording start error:", err);
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    recorder.stop();
    recorder.stream.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  const uploadAudio = async (blob: Blob) => {
    if (!validateLanguages()) return;

    setIsProcessing(true);
    setProcessingStep(1);
    setError("");

    const backendUrl = (import.meta.env as any).VITE_BACKEND_URL || "http://127.0.0.1:8000";

    try {
      const formData = new FormData();
      formData.append("file", blob, "recording.webm");
      formData.append("source_lang", sourceLang);
      formData.append("target_lang", targetLang);

      const token = getAccessToken();
      const response = await fetch(
        `${backendUrl}/speech/translate-and-speak`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => {
          router.push("/login?expired=true");
        }, 1500);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP network error! Status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is not readable.");
      }

      const reader = response.body.getReader();
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
            if (data.step !== undefined) {
              setProcessingStep(data.step);
            }

            if (data.step === 6) {
              if (data.success) {
                setTranscript(data.transcript || "");
                setOutputText(data.translated_text || "");
                let url = data.output_audio_url;
                if (url && url.startsWith("/")) {
                  url = `${backendUrl}${url}`;
                }
                const freshUrl = url ? `${url}?cb=${Date.now()}` : null;
                setTtsAudioUrl(freshUrl);
                
                if (freshUrl) {
                  playTTSAudio(freshUrl);
                }
              } else {
                setError(data.error || "Speech translation server failed.");
              }
            } else if (data.step === 0) {
              setError(data.error || "Speech translation server failed.");
            }
          } catch (jsonErr) {
            console.error("JSON parse error on stream chunk:", jsonErr, trimmed);
          }
        }
      }
    } catch (err) {
      setProcessingStep(0);
      console.error(err);
      setError(
        `Translation service error: ${
          err instanceof Error ? err.message : "Internal Server Error"
        }`
      );
      setOutputText("Error: Could not retrieve translation.");
    } finally {
      setIsProcessing(false);
    }
  };

  const playTTSAudio = (urlToPlay?: string) => {
    const targetUrl = urlToPlay || ttsAudioUrl;
    if (!targetUrl) {
      setError("No target audio found. Record speech first.");
      return;
    }

    try {
      if (playingAudioRef.current) {
        playingAudioRef.current.pause();
        playingAudioRef.current.src = "";
        playingAudioRef.current = null;
      }

      const separator = targetUrl.includes("?") ? "&" : "?";
      const audio = new Audio(`${targetUrl}${separator}t=${Date.now()}`);
      playingAudioRef.current = audio;
      setIsPlayingTTS(true);

      audio.onended = () => {
        setIsPlayingTTS(false);
        playingAudioRef.current = null;
      };
      audio.onerror = () => {
        setError("Failed to stream TTS output file.");
        setIsPlayingTTS(false);
        playingAudioRef.current = null;
      };

      audio.play().catch((e) => {
        setError(`Audio play failed: ${e.message}`);
        setIsPlayingTTS(false);
        playingAudioRef.current = null;
      });
    } catch (err) {
      setError("Playback system initialization failed.");
      setIsPlayingTTS(false);
      playingAudioRef.current = null;
    }
  };

  const handleMicClick = () => {
    if (mode === "realtime") {
      if (isRecording) {
        stopRealtimeStreaming();
      } else {
        startRealtimeStreaming();
      }
    } else {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#030305] flex flex-col items-center justify-center gap-4 text-center select-none font-sans">
        <span className="w-8 h-8 border-2 border-white/20 border-t-[#00f5ff] rounded-full animate-spin"></span>
        <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">Syncing Console...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#030305] text-[#e7e0ed] relative font-sans overflow-x-hidden">
      {/* Background ambient orbs */}
      <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-[#8b5cf6]/5 rounded-full blur-[120px] animate-float-slow-1 pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-[#00f5ff]/5 rounded-full blur-[120px] animate-float-slow-2 pointer-events-none"></div>

      <Header />

      <div className="flex flex-1 pt-32 pb-12 overflow-hidden relative z-10 w-[95%] max-w-[1200px] mx-auto flex-col gap-6">
        <Sidebar />

        {error && (
          <div className="bg-red-950/30 border border-red-500/20 text-red-200 text-xs px-4 py-3 rounded-xl flex items-center justify-between backdrop-blur-md">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </span>
            <button onClick={() => setError("")} className="text-red-200 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* Operational Mode Toggle Bar */}
        <div className="flex justify-center select-none mb-2">
          <div className="glass-card p-1 border border-white/5 flex gap-1 rounded-xl">
            <button
              onClick={() => {
                if (isRecording) {
                  mode === "realtime" ? stopRealtimeStreaming() : stopRecording();
                }
                setMode("batch");
                setTranscript("");
                setOutputText("Your translation will appear here after speech capture.");
                setTtsAudioUrl(null);
                setAudioUrl(null);
              }}
              className={`px-4.5 py-2.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all border ${
                mode === "batch"
                  ? "bg-[#8b5cf6] text-white border-[#8b5cf6]/30 shadow-md"
                  : "text-zinc-400 hover:text-white border-transparent"
              }`}
            >
              Batch Upload (SSE)
            </button>
            <button
              onClick={() => {
                if (isRecording) {
                  mode === "realtime" ? stopRealtimeStreaming() : stopRecording();
                }
                setMode("realtime");
                setTranscript("");
                setOutputText("Press the mic button and speak continuously.");
                setTtsAudioUrl(null);
                setAudioUrl(null);
              }}
              className={`px-4.5 py-2.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all border ${
                mode === "realtime"
                  ? "bg-[#00f5ff] text-black border-[#00f5ff]/30 shadow-md"
                  : "text-zinc-400 hover:text-white border-transparent"
              }`}
            >
              Real-Time Stream (WS)
            </button>
          </div>
        </div>

        {/* Split View Columns */}
        <div className="grid grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: Input Stream Context (ASR) */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 h-full">
            <div className="flex-1 flex flex-col glass-card overflow-hidden p-6 border border-white/5">
              
              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 select-none">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                    [01] Input_Stream ({mode === "realtime" ? "WebSocket" : "ASR"})
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isRecording
                        ? mode === "realtime"
                          ? "bg-[#00f5ff] animate-pulse"
                          : "bg-[#8b5cf6] animate-pulse"
                        : isProcessing
                          ? "bg-[#00f5ff] animate-pulse"
                          : "bg-white/10"
                    }`}
                  ></span>
                </div>
                <div className="font-mono text-[8px] text-[#00f5ff] uppercase tracking-widest font-bold">
                  {isRecording ? "Recording" : isProcessing ? "Processing" : "Standby"}
                </div>
              </div>

              {/* Speech transcript */}
              <div className="flex-1 min-h-[160px] max-h-[250px] overflow-y-auto pr-2 custom-scrollbar text-left mb-6">
                {isProcessing && !transcript ? (
                  <div className="border-l border-[#8b5cf6]/20 pl-4 py-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-ping" />
                      <p className="font-mono text-[8px] text-[#8b5cf6] uppercase tracking-widest font-bold">
                        [VOXA CORE] Parsing speech tokens...
                      </p>
                    </div>
                    <div className="font-mono text-[10px] text-zinc-500 space-y-1 pl-1 leading-relaxed">
                      <div>&gt; Initializing Whisper large-v3 decoder...</div>
                      <div>&gt; Slicing acoustic spectrogram blocks...</div>
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-2 bg-[#8b5cf6] animate-pulse" />
                        <span>Computing weights...</span>
                      </div>
                    </div>
                    <SkeletonLoader lines={2} />
                  </div>
                ) : transcript ? (
                  <div className="border-l border-[#8b5cf6]/30 pl-4 py-1">
                    <p className="font-mono text-[8px] text-[#8b5cf6] uppercase tracking-wider font-bold mb-1.5">
                      Transcribed Text ({sourceLang.toUpperCase()})
                    </p>
                    <p className="text-base text-zinc-300 font-light leading-relaxed">
                      {transcript}
                      <span className="inline-block w-1 h-4 bg-[#8b5cf6]/80 ml-1.5 align-middle animate-streaming-cursor" />
                    </p>
                  </div>
                ) : (
                  <div className="border-l border-white/5 pl-4 py-1 text-zinc-600 text-sm italic font-light">
                    {isRecording
                      ? mode === "realtime"
                        ? "🎤 Streaming raw PCM blocks... speak continuously."
                        : "🎤 Capturing speech... speak clearly."
                      : mode === "realtime"
                        ? "Ready for live translation. Press the orb to start streaming."
                        : "Ready to translate. Select languages and start capture."}
                    {isRecording && (
                      <span className="inline-block w-1 h-4 bg-white/40 ml-1.5 align-middle animate-streaming-cursor" />
                    )}
                  </div>
                )}
              </div>

              {/* Wave Visualizer and Recording Controls */}
              <div className="border-t border-white/5 pt-4 flex flex-col gap-4 mt-auto">
                <div className="flex items-end gap-1.5 h-10 justify-center select-none">
                  {waveformBars.map((bar, i) => (
                    <div
                      key={i}
                      style={{
                        height: isRecording ? bar.height : "3px",
                        animationDelay: bar.delay,
                      }}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isRecording
                          ? mode === "realtime"
                            ? "bg-[#00f5ff] animate-waveform-jump"
                            : "bg-[#8b5cf6] animate-waveform-jump"
                          : "bg-white/5"
                      }`}
                    ></div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  {/* Glowing Mic Orb */}
                  <div className="relative shrink-0 select-none">
                    {isRecording && (
                      <>
                        <span className={`absolute inset-0 rounded-full animate-ping scale-125 ${mode === "realtime" ? "bg-[#00f5ff]/20" : "bg-[#8b5cf6]/20"}`} />
                        <span className={`absolute -inset-1 rounded-full border animate-pulse ${mode === "realtime" ? "border-[#00f5ff]/25" : "border-[#8b5cf6]/25"}`} />
                      </>
                    )}
                    <button
                      onClick={handleMicClick}
                      disabled={isProcessing}
                      className={`group w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-300 relative z-10 ${
                        isRecording
                          ? mode === "realtime"
                            ? "border-[#00f5ff]/35 bg-[#00f5ff]/20 text-[#00f5ff] hover:bg-[#00f5ff]/30 hover:scale-105 active:scale-95"
                            : "border-[#8b5cf6]/30 bg-[#8b5cf6]/20 text-[#8b5cf6] hover:bg-[#8b5cf6]/30 hover:scale-105 active:scale-95"
                          : "border-white/10 bg-white/3 text-white hover:border-[#8b5cf6]/30 hover:scale-105 active:scale-95 disabled:opacity-50"
                      }`}
                      title={isRecording ? "Stop capture" : "Start capture"}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {isRecording ? "stop" : "mic"}
                      </span>
                    </button>
                  </div>

                  {audioUrl && mode === "batch" && (
                    <CustomAudioPlayer src={audioUrl} label="Local Audio" />
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Output Stream Context (NMT) */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 h-full">
            <div className="flex-1 flex flex-col glass-card overflow-hidden p-6 border border-white/5">
              
              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 select-none">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                    [02] Output_Buffer ({mode === "realtime" ? "WebSocket NMT" : "AZURE"})
                  </span>
                </div>
                <div className="flex gap-2.5">
                  <button
                    onClick={handleCopy}
                    className="p-1 text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-[9px] font-mono"
                    title="Copy output"
                  >
                    <span className="material-symbols-outlined text-sm">{copied ? "check" : "content_copy"}</span>
                    {copied && "Copied"}
                  </button>
                </div>
              </div>

              {/* Translation display or SSE progress steps */}
              <div className="flex-1 min-h-[160px] max-h-[250px] overflow-y-auto pr-2 custom-scrollbar text-left mb-6">
                {isProcessing && mode === "batch" ? (
                  <div className="space-y-3 font-sans">
                    <span className="text-[8px] font-mono font-bold tracking-widest text-[#00f5ff] uppercase block mb-2">
                      Live Translation Program:
                    </span>
                    <div className="space-y-2">
                      {[
                        { stepNum: 1, text: "Uploading audio payload" },
                        { stepNum: 2, text: "ASR speech recognition" },
                        { stepNum: 3, text: "Claude context correction" },
                        { stepNum: 4, text: "Azure neural translation" },
                        { stepNum: 5, text: "ElevenLabs speech synthesis" },
                      ].map((step, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          <span
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border text-[8px] font-mono font-bold ${
                              processingStep > step.stepNum
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                : processingStep === step.stepNum
                                  ? "border-[#00f5ff] bg-[#00f5ff]/10 text-[#00f5ff] animate-pulse"
                                  : "border-white/5 text-zinc-700"
                            }`}
                          >
                            {processingStep > step.stepNum ? "✓" : step.stepNum}
                          </span>
                          <span
                            className={
                              processingStep === step.stepNum
                                ? "text-white font-medium"
                                : processingStep > step.stepNum
                                  ? "text-zinc-400"
                                  : "text-zinc-650"
                            }
                          >
                            {step.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/2 border border-white/5 p-4.5 rounded-xl">
                    <p className="text-base text-white font-light leading-relaxed">
                      {outputText}
                    </p>
                  </div>
                )}
              </div>

              {/* TTS audio output + Confidence gauge + Actions */}
              <div className="border-t border-white/5 pt-4 flex flex-col gap-4 mt-auto">
                <div className="flex items-center justify-between">
                  {ttsAudioUrl && mode === "batch" && (
                    <CustomAudioPlayer src={ttsAudioUrl} label="Translated TTS" />
                  )}
                  
                  {/* Confidence gauge bar */}
                  <div className="flex-1 max-w-[200px] flex flex-col gap-1 ml-auto select-none">
                    <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                      <span>Confidence</span>
                      <span className="text-[#8b5cf6] font-bold">95.00%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#00f5ff] w-[95%]" />
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between select-none">
                  {/* Language selectors */}
                  <div className="flex items-center gap-2">
                    <select
                      value={sourceLang}
                      onChange={(e) => {
                        const newSource = e.target.value;
                        setSourceLang(newSource);
                        if (newSource === targetLang) {
                          const fallback = LANGUAGES.find((lang) => lang.code !== newSource);
                          if (fallback) setTargetLang(fallback.code);
                        }
                      }}
                      className="bg-white/3 border border-white/10 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg outline-none cursor-pointer"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code} className="bg-zinc-950 text-white">
                          {l.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={swapLanguages}
                      className="w-7 h-7 rounded-lg bg-white/3 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
                    >
                      <span className="material-symbols-outlined text-xs">swap_horiz</span>
                    </button>

                    <select
                      value={targetLang}
                      onChange={(e) => {
                        const newTarget = e.target.value;
                        setTargetLang(newTarget);
                        if (newTarget === sourceLang) {
                          const fallback = LANGUAGES.find((lang) => lang.code !== newTarget);
                          if (fallback) setSourceLang(fallback.code);
                        }
                      }}
                      className="bg-white/3 border border-white/10 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg outline-none cursor-pointer"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code} className="bg-zinc-950 text-white">
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (playingAudioRef.current) {
                          playingAudioRef.current.pause();
                          playingAudioRef.current.src = "";
                          playingAudioRef.current = null;
                        }
                        setOutputText(mode === "realtime" ? "Press the mic button and speak continuously." : "Your translation will appear here after speech capture.");
                        setTranscript("");
                        setTtsAudioUrl(null);
                        setAudioUrl(null);
                        setAudioBlob(null);
                        setIsPlayingTTS(false);
                        setProcessingStep(0);
                        setError("");
                      }}
                      disabled={isProcessing}
                      className="font-mono text-[9px] uppercase tracking-wider px-3.5 py-2 border border-white/10 bg-white/3 text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Clear
                    </button>
                    {mode === "batch" && (
                      <button
                        onClick={() => playTTSAudio()}
                        disabled={!ttsAudioUrl || isPlayingTTS}
                        className={`font-mono text-[9px] uppercase tracking-wider px-4.5 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                          !ttsAudioUrl || isPlayingTTS
                            ? "border border-white/5 bg-white/2 text-zinc-600 cursor-not-allowed"
                            : "bg-white text-black hover:bg-zinc-200"
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">volume_up</span>
                        Play TTS
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Use Cases Section */}
        <div className="p-6 border border-white/5 bg-white/1 rounded-2xl space-y-6 mt-6 select-none">
          <div className="text-left">
            <span className="font-mono text-[8px] tracking-[0.25em] uppercase text-[#00f5ff] border-l-2 border-[#8b5cf6] pl-3">
              Application Contexts
            </span>
            <h2 className="text-lg font-semibold font-geist text-white mt-1.5 tracking-tight">
              Interactive Use Cases
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Google Meet */}
            <div className="border border-white/5 bg-white/1 p-5 rounded-xl flex flex-col gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6]">
                <span className="material-symbols-outlined text-sm">groups</span>
              </div>
              <div>
                <h3 className="font-semibold text-xs mb-1 text-white font-geist">Live Meetings (Google Meet)</h3>
                <p className="text-zinc-500 text-[10px] leading-relaxed">
                  Injects real-time captions directly into meeting tabs for seamless collaboration.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden border border-white/5 bg-black mt-1">
                <img 
                  src="/assets/google_meet.png" 
                  alt="Google Meet Integration" 
                  className="w-full object-contain opacity-75 group-hover:scale-102 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Speaking Practice */}
            <div className="border border-white/5 bg-white/1 p-5 rounded-xl flex flex-col gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-[#00f5ff]/10 border border-[#00f5ff]/20 flex items-center justify-center text-[#00f5ff]">
                <span className="material-symbols-outlined text-sm">record_voice_over</span>
              </div>
              <div>
                <h3 className="font-semibold text-xs mb-1 text-white font-geist">Speaking Practice</h3>
                <p className="text-zinc-500 text-[10px] leading-relaxed">
                  Practise speech delivery. Compare transcripts side-by-side with translated references.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden border border-white/5 bg-black mt-1">
                <img 
                  src="/assets/workspace.png" 
                  alt="Speaking Practice" 
                  className="w-full object-contain opacity-75 group-hover:scale-102 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Language Learning */}
            <div className="border border-white/5 bg-white/1 p-5 rounded-xl flex flex-col gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6]">
                <span className="material-symbols-outlined text-sm">school</span>
              </div>
              <div>
                <h3 className="font-semibold text-xs mb-1 text-white font-geist">Language Learning</h3>
                <p className="text-zinc-500 text-[10px] leading-relaxed">
                  Listen to native pitch and translation voice syntheses to accelerate acquisition.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden border border-white/5 bg-black mt-1">
                <img 
                  src="/assets/setup_guide.png" 
                  alt="Language Learning Guide" 
                  className="w-full object-contain opacity-75 group-hover:scale-102 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Zen Footer */}
      <footer className="py-6 text-center text-[8px] font-mono text-zinc-700 border-t border-white/2 w-[95%] max-w-[1200px] mx-auto z-10 relative">
        VOXA REAL-TIME TRANSLATION CONSOLE | STATUS: SECURE & OPERATIONAL
      </footer>
    </div>
  );
}
