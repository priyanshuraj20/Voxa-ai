/**
 * Voxa Chrome Extension - Offscreen Audio streaming & playback client
 * 
 * DESIGN DECISIONS & INTERVIEW EXPLANATIONS:
 * 
 * 1. Downsampling to 16kHz PCM:
 *    Whisper ASR is trained on 16kHz mono audio. Raw browser audio captures at 44.1kHz or 48kHz stereo.
 *    We use Web Audio APIs to capture, extract channel 0, downsample, and pack float values into 
 *    signed 16-bit integers (2 bytes per sample). This cuts network traffic by 6x and matches Whisper perfectly.
 * 
 * 2. Reconnection on Language/Voice change:
 *    If the user changes languages or voices on the overlay, we close the active WebSocket and 
 *    open a new one with updated query parameters. This keeps the streaming context instantly in sync.
 * 
 * 3. Base64 Audio Playback in background:
 *    As base64 audio chunks arrive from the server, they are played via HTML5 Audio objects in the offscreen tab,
 *    synced directly to the slider's volume setting.
 */

import CONFIG from './config.js';

let mediaStream = null;
let audioContext = null;
let sourceNode = null;
let processorNode = null;
let socket = null;

// Dynamic parameters synced from overlay controls
let currentSourceLang = "en";
let currentTargetLang = "hi-IN";
let currentVoiceId = "EXAVITQu4vr4xnSDxMaL";
let currentVolume = 0.8;

// Keep track of active stream ID
let currentStreamId = null;

// 1. Listen for initialization commands from background service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "init-capture") {
    currentSourceLang = message.sourceLang;
    currentTargetLang = message.targetLang;
    currentVoiceId = message.voiceId;
    currentVolume = message.volume;
    currentStreamId = message.streamId;

    startCapture(message.streamId);
    sendResponse({ success: true });
  } else if (message.action === "sync-settings") {
    // Dynamic settings adjustment
    currentVolume = message.volume;
    
    // If languages or voices changed, reconnect the WebSocket to update the backend parameters
    if (
      currentSourceLang !== message.sourceLang ||
      currentTargetLang !== message.targetLang ||
      currentVoiceId !== message.voiceId
    ) {
      currentSourceLang = message.sourceLang;
      currentTargetLang = message.targetLang;
      currentVoiceId = message.voiceId;

      console.log("🔄 Sending switch_languages command over active WebSocket...");
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          action: "switch_languages",
          source_lang: currentSourceLang,
          target_lang: currentTargetLang,
          voice_id: currentVoiceId
        }));
      } else {
        connectWebSocket();
      }
    }
    sendResponse({ success: true });
  }
  return true;
});

// 2. Capture and process tab audio stream
async function startCapture(streamId) {
  cleanup();

  try {
    // Capture the tab's stream using the tabCapture stream ID
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: streamId
        }
      },
      video: false
    });

    // Initialize AudioContext at 16000Hz (Whisper native sample rate)
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass({ sampleRate: 16000 });
    
    sourceNode = audioContext.createMediaStreamSource(mediaStream);
    processorNode = audioContext.createScriptProcessor(4096, 1, 1);

    // Convert Float32 samples to Int16 PCM and stream via WebSockets
    processorNode.onaudioprocess = (e) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) return;

      const inputData = e.inputBuffer.getChannelData(0);
      const int16Buffer = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        const sample = Math.max(-1, Math.min(1, inputData[i]));
        int16Buffer[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      }

      socket.send(int16Buffer.buffer);
    };

    sourceNode.connect(processorNode);
    processorNode.connect(audioContext.destination);
    sourceNode.connect(audioContext.destination); // Play original captured audio back to user's speakers

    // Connect real-time translation channel
    connectWebSocket();

  } catch (err) {
    console.error("Audio capture failed in offscreen:", err);
  }
}

// 3. Establish persistent WebSocket stream
function connectWebSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }

  // Fetch API server configurations (Fallback to localhost if missing)
  const backendUrl = CONFIG.BACKEND_URL || "http://localhost:8000";
  const baseWsUrl = backendUrl.replace(/^http:/, "ws:").replace(/^https:/, "wss:");
  const wsUrl = `${baseWsUrl}/ws?source_lang=${currentSourceLang}&target_lang=${currentTargetLang}&voice_id=${currentVoiceId}`;

  console.log("🔌 Offscreen connecting to WebSocket:", wsUrl);
  socket = new WebSocket(wsUrl);
  socket.binaryType = "arraybuffer";

  socket.onopen = () => {
    console.log("✅ WebSocket connected inside offscreen pipeline.");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.audio) {
        console.log("📨 Audio packet received, playing...");
        // Construct and play Data URI
        const audioSrc = `data:audio/mp3;base64,${data.audio}`;
        const audio = new Audio(audioSrc);
        audio.volume = currentVolume;
        audio.play().catch((playErr) => {
          console.warn("Playback blocked or failed in offscreen:", playErr);
        });
      }
    } catch (err) {
      console.error("Error parsing WebSocket JSON package:", err);
    }
  };

  socket.onerror = (err) => {
    console.error("❌ WebSocket error inside offscreen:", err);
    chrome.runtime.sendMessage({
      action: "translation-error",
      error: "WebSocket connection error. Please make sure the backend server is running and config.js is configured correctly."
    }).catch(e => console.error("Failed to send translation-error message:", e));
  };

  socket.onclose = (event) => {
    console.log("🔌 WebSocket closed inside offscreen.");
    if (!event.wasClean) {
      chrome.runtime.sendMessage({
        action: "translation-error",
        error: `WebSocket disconnected unexpectedly (code: ${event.code}).`
      }).catch(e => console.error("Failed to send translation-error message:", e));
    }
  };
}

// 4. Release all resources on stop or reset
function cleanup() {
  if (socket) {
    socket.close();
    socket = null;
  }
  if (sourceNode) {
    sourceNode.disconnect();
    sourceNode = null;
  }
  if (processorNode) {
    processorNode.disconnect();
    processorNode.onaudioprocess = null;
    processorNode = null;
  }
  if (audioContext && audioContext.state !== "closed") {
    audioContext.close();
    audioContext = null;
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
}

// Ensure cleanup is executed on window unload
window.addEventListener("unload", cleanup);

// Signal readiness to background worker on load
chrome.runtime.sendMessage({ action: "offscreen-ready" });
