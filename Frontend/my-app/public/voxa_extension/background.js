/**
 * Voxa Chrome Extension - Background Service Worker
 * 
 * DESIGN DECISIONS & INTERVIEW EXPLANATIONS:
 * 
 * 1. Why Manifest V3 & Service Worker?
 *    MV3 is the modern Chrome extension standard. Background pages are replaced by transient 
 *    Service Workers that start and stop dynamically on events, preventing memory overhead.
 * 
 * 2. Why Audio Capture requires Offscreen Documents?
 *    Chrome Service Workers run in isolated execution contexts that DO NOT have access to Web Audio APIs
 *    like AudioContext, MediaStream, or navigator.mediaDevices. To capture the tab audio stream 
 *    programmatically, the worker gets a tab stream ID and mounts a hidden Offscreen Document 
 *    where DOM APIs (Web Audio) are fully supported.
 * 
 * 3. Persistence of Translation:
 *    When the popup is closed, the content script overlay is hidden or removed, but the 
 *    Offscreen Document continues running. This ensures audio capture, streaming, and playback 
 *    are never interrupted.
 */

// Track global streaming status
let activeCaptureTabId = null;
let isOffscreenActive = false;
let pendingCaptureParams = null;

// 1. Listen for toolbar extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  
  // Toggle the draggable popup overlay inside the active tab
  chrome.tabs.sendMessage(tab.id, { action: "toggle-overlay" }).catch((err) => {
    // If the content script is not yet injected (e.g. loaded first time), inject it
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    }).then(() => {
      chrome.tabs.sendMessage(tab.id, { action: "toggle-overlay" });
    }).catch((e) => console.error("Content script injection failed:", e));
  });
});

// 2. Listen for coordination messages from the content script overlay and offscreen pages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const handleMessage = async () => {
    switch (message.action) {
      case "get-session-state":
        // Sync states to popup overlays when they reload
        const settings = await chrome.storage.local.get([
          "isTranslating",
          "sourceLang",
          "targetLang",
          "voiceId",
          "volume"
        ]);
        return {
          isTranslating: settings.isTranslating || false,
          sourceLang: settings.sourceLang || "en",
          targetLang: settings.targetLang || "hi-IN",
          voiceId: settings.voiceId || "EXAVITQu4vr4xnSDxMaL",
          volume: settings.volume !== undefined ? settings.volume : 0.8,
          activeCaptureTabId
        };

      case "start-translation":
        // 1. Get current settings
        const currentSettings = await chrome.storage.get ? await chrome.storage.local.get([
          "sourceLang",
          "targetLang",
          "voiceId",
          "volume"
        ]) : { sourceLang: "en", targetLang: "hi-IN", voiceId: "EXAVITQu4vr4xnSDxMaL", volume: 0.8 };
        
        const sourceLang = currentSettings.sourceLang || "en";
        const targetLang = currentSettings.targetLang || "hi-IN";
        const voiceId = currentSettings.voiceId || "EXAVITQu4vr4xnSDxMaL";
        const volume = currentSettings.volume !== undefined ? currentSettings.volume : 0.8;
        
        const targetTabId = sender.tab ? sender.tab.id : null;
        if (!targetTabId) return { success: false, error: "No active tab stream target found." };

        activeCaptureTabId = targetTabId;
        await chrome.storage.local.set({ isTranslating: true });

        // 2. Request stream ID for the tab
        chrome.tabCapture.getMediaStreamId({ targetTabId }, async (streamId) => {
          if (!streamId) {
            console.error("Failed to capture tab audio stream ID.");
            return;
          }

          pendingCaptureParams = {
            streamId,
            sourceLang,
            targetLang,
            voiceId,
            volume
          };

          // 3. Mount Offscreen Document if not already running
          if (!isOffscreenActive) {
            try {
              await chrome.offscreen.createDocument({
                url: "offscreen.html",
                reasons: ["USER_MEDIA"],
                justification: "Real-time tab audio stream capture"
              });
              isOffscreenActive = true;
            } catch (err) {
              console.error("Offscreen creation failed:", err);
            }
          } else {
            // Already active, push configurations directly
            chrome.runtime.sendMessage({
              action: "init-capture",
              ...pendingCaptureParams
            });
          }
        });
        return { success: true };

      case "offscreen-ready":
        // The Offscreen Document has successfully initialized and is pulling settings
        if (pendingCaptureParams) {
          chrome.runtime.sendMessage({
            action: "init-capture",
            ...pendingCaptureParams
          });
        }
        return { success: true };

      case "stop-translation":
        // Disconnect audio capture and close WebSockets
        await chrome.storage.local.set({ isTranslating: false });
        activeCaptureTabId = null;
        if (isOffscreenActive) {
          try {
            await chrome.offscreen.closeDocument();
            isOffscreenActive = false;
          } catch (err) {
            console.error("Error closing offscreen:", err);
          }
        }
        return { success: true };

      case "update-active-settings":
        // Sync parameters dynamically while the stream is actively running
        if (isOffscreenActive) {
          chrome.runtime.sendMessage({
            action: "sync-settings",
            sourceLang: message.sourceLang,
            targetLang: message.targetLang,
            voiceId: message.voiceId,
            volume: message.volume
          });
        }
        return { success: true };

      default:
        return null;
    }
  };

  handleMessage().then(sendResponse);
  return true; // Keep message channel open for asynchronous sendResponse
});
