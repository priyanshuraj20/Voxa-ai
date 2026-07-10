/**
 * Voxa Chrome Extension - Content Script (Draggable Glassmorphic UI Overlay)
 * 
 * DESIGN DECISIONS & INTERVIEW EXPLANATIONS:
 * 
 * 1. Why Shadow DOM?
 *    By wrapping the floating UI inside a Shadow DOM, we isolate the extension's HTML and CSS 
 *    from the host webpage's styles (e.g. Udemy, YouTube, Meet). This prevents host website CSS resets 
 *    or frameworks (like Bootstrap/Tailwind) from breaking the extension's rendering.
 * 
 * 2. Draggable Logic:
 *    Uses simple pointer offsets during mousedown/mousemove/mouseup to update the top/left styles 
 *    of the absolute positioned container.
 * 
 * 3. Minimalist UX constraints:
 *    The UI is limited strictly to control parameters (Toggle, languages, voice, volume, and connection status)
 *    to prevent visual clutter on top of course players or conference interfaces.
 */

(function () {
  // Prevent duplicate injections
  if (document.getElementById("voxa-translator-root")) {
    return;
  }

  const rootDiv = document.createElement("div");
  rootDiv.id = "voxa-translator-root";
  document.body.appendChild(rootDiv);

  // Mount isolated Shadow Root
  const shadowRoot = rootDiv.attachShadow({ mode: "open" });

  // CSS Stylesheet for Shadow DOM
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;700&family=Inter:wght@400;600;700&display=swap');

    .voxa-container {
      position: fixed;
      top: 100px;
      right: 50px;
      width: 280px;
      background: rgba(10, 10, 15, 0.7);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      color: #f3f4f6;
      font-family: 'Inter', sans-serif;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      z-index: 999999;
      user-select: none;
      display: flex;
      flex-direction: column;
      padding: 16px;
      overflow: hidden;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.97) translateY(-10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Drag Handle Header */
    .voxa-header {
      cursor: move;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-b: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 12px;
      margin-bottom: 14px;
    }

    .voxa-logo {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .voxa-logo-text {
      font-weight: 700;
      font-size: 14px;
      letter-spacing: -0.5px;
      color: #fff;
    }

    .voxa-status-indicator {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4b5563; /* Gray = Idle */
      transition: background 0.3s ease;
    }

    .voxa-status-indicator.active {
      background: #00f5ff; /* Cyan = Active Capture */
      box-shadow: 0 0 10px #00f5ff;
      animation: status-pulse 1.5s infinite;
    }

    @keyframes status-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .voxa-close-btn {
      background: transparent;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      font-size: 14px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .voxa-close-btn:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }

    /* Form Fields */
    .voxa-field {
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .voxa-label {
      font-size: 9px;
      font-family: 'Geist Mono', monospace;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .voxa-select {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      color: #fff;
      padding: 6px 10px;
      font-size: 11px;
      outline: none;
      cursor: pointer;
      width: 100%;
      transition: border 0.2s;
    }

    .voxa-select:hover, .voxa-select:focus {
      border: 1px solid rgba(139, 92, 246, 0.5);
    }

    .voxa-select option {
      background: #0d0d14;
      color: #fff;
    }

    /* Toggle Switch */
    .voxa-toggle-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 10px;
      padding: 10px;
      margin-bottom: 14px;
    }

    .voxa-toggle-label {
      font-size: 11px;
      font-weight: 600;
      color: #e5e7eb;
    }

    .voxa-switch {
      position: relative;
      display: inline-block;
      width: 38px;
      height: 20px;
    }

    .voxa-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .voxa-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.1);
      transition: .3s;
      border-radius: 34px;
    }

    .voxa-slider:before {
      position: absolute;
      content: "";
      height: 14px;
      width: 14px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
    }

    input:checked + .voxa-slider {
      background-color: #8b5cf6;
      box-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
    }

    input:checked + .voxa-slider:before {
      transform: translateX(18px);
    }

    /* Audio Volume Slider */
    .voxa-slider-input {
      -webkit-appearance: none;
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      outline: none;
      margin: 6px 0;
    }

    .voxa-slider-input::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #8b5cf6;
      cursor: pointer;
      box-shadow: 0 0 6px rgba(139, 92, 246, 0.5);
      transition: scale 0.1s;
    }

    .voxa-slider-input::-webkit-slider-thumb:hover {
      scale: 1.2;
    }
  `;

  // HTML Structure inside Shadow DOM
  const container = document.createElement("div");
  container.className = "voxa-container";
  container.style.display = "none"; // Hidden initially, toggled via action click

  container.innerHTML = `
    <style>${styles}</style>
    
    <!-- Drag Handle Header -->
    <div class="voxa-header" id="voxa-drag-handle">
      <div class="voxa-logo">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:16px; height:16px;">
          <path d="M4.5 4L12 18L19.5 4" stroke="#8b5cf6" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="voxa-logo-text">Voxa Translate</span>
        <span class="voxa-status-indicator" id="voxa-status-dot"></span>
      </div>
      <button class="voxa-close-btn" id="voxa-close-overlay" title="Close Panel">✕</button>
    </div>

    <!-- Active State Toggle Switch -->
    <div class="voxa-toggle-container">
      <span class="voxa-toggle-label">Translate Audio</span>
      <label class="voxa-switch">
        <input type="checkbox" id="voxa-toggle-switch">
        <span class="voxa-slider"></span>
      </label>
    </div>

    <!-- Source Language Selection -->
    <div class="voxa-field">
      <label class="voxa-label">Input Language</label>
      <select class="voxa-select" id="voxa-source-lang">
        <option value="auto">Auto Detect</option>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="hi">Hindi</option>
        <option value="zh">Chinese</option>
        <option value="ja">Japanese</option>
      </select>
    </div>

    <!-- Target Language Selection -->
    <div class="voxa-field">
      <label class="voxa-label">Target Translation</label>
      <select class="voxa-select" id="voxa-target-lang">
        <option value="hi-IN">Hindi</option>
        <option value="en-US">English</option>
        <option value="es-ES">Spanish</option>
        <option value="fr-FR">French</option>
        <option value="de-DE">German</option>
        <option value="zh-CN">Chinese</option>
      </select>
    </div>

    <!-- Voice Selection -->
    <div class="voxa-field">
      <label class="voxa-label">Synthesizer Voice</label>
      <select class="voxa-select" id="voxa-voice-select">
        <option value="EXAVITQu4vr4xnSDxMaL">Rachel (Female)</option>
        <option value="21m00Tcm4TlvDq8ikWAM">Clyde (Male)</option>
        <option value="AZnzlk1XvdvUeBnXmlld">Domi (Female)</option>
        <option value="GBv7mTt0atIp3Y8iVbEC">Daniel (Male)</option>
      </select>
    </div>

    <!-- Volume Control -->
    <div class="voxa-field">
      <label class="voxa-label">Volume Level</label>
      <input type="range" class="voxa-slider-input" id="voxa-volume-level" min="0" max="1" step="0.05" value="0.8">
    </div>
  `;

  shadowRoot.appendChild(container);

  // Grab element bindings
  const toggleSwitch = shadowRoot.getElementById("voxa-toggle-switch");
  const sourceSelect = shadowRoot.getElementById("voxa-source-lang");
  const targetSelect = shadowRoot.getElementById("voxa-target-lang");
  const voiceSelect = shadowRoot.getElementById("voxa-voice-select");
  const volumeSlider = shadowRoot.getElementById("voxa-volume-level");
  const statusDot = shadowRoot.getElementById("voxa-status-dot");
  const closeBtn = shadowRoot.getElementById("voxa-close-overlay");
  const dragHandle = shadowRoot.getElementById("voxa-drag-handle");

  // Sync state from background on load
  const syncState = () => {
    chrome.runtime.sendMessage({ action: "get-session-state" }, (response) => {
      if (!response) return;
      toggleSwitch.checked = response.isTranslating;
      sourceSelect.value = response.sourceLang;
      targetSelect.value = response.targetLang;
      voiceSelect.value = response.voiceId;
      volumeSlider.value = response.volume;

      // Update status dot visual indicator
      if (response.isTranslating) {
        statusDot.classList.add("active");
      } else {
        statusDot.classList.remove("active");
      }
    });
  };

  syncState();

  // Toggle translation session start/stop
  toggleSwitch.addEventListener("change", (e) => {
    const start = e.target.checked;
    if (start) {
      statusDot.classList.add("active");
      chrome.runtime.sendMessage({ action: "start-translation" }, (res) => {
        if (res && !res.success) {
          alert(res.error || "Failed to start audio streaming.");
          toggleSwitch.checked = false;
          statusDot.classList.remove("active");
        }
      });
    } else {
      statusDot.classList.remove("active");
      chrome.runtime.sendMessage({ action: "stop-translation" });
    }
  });

  // Sync controls updates dynamically to background
  const handleSettingsChange = async () => {
    const sourceLang = sourceSelect.value;
    const targetLang = targetSelect.value;
    const voiceId = voiceSelect.value;
    const volume = parseFloat(volumeSlider.value);

    // Save parameters inside local storage
    await chrome.storage.local.set({ sourceLang, targetLang, voiceId, volume });

    // Inform background coordinator
    chrome.runtime.sendMessage({
      action: "update-active-settings",
      sourceLang,
      targetLang,
      voiceId,
      volume
    });
  };

  sourceSelect.addEventListener("change", handleSettingsChange);
  targetSelect.addEventListener("change", handleSettingsChange);
  voiceSelect.addEventListener("change", handleSettingsChange);
  volumeSlider.addEventListener("input", handleSettingsChange);

  // Close toggle
  closeBtn.addEventListener("click", () => {
    container.style.display = "none";
  });

  // Listener to open panel from toolbar click
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggle-overlay") {
      container.style.display = container.style.display === "none" ? "flex" : "none";
      if (container.style.display === "flex") {
        syncState();
      }
    } else if (message.action === "show-error") {
      alert(`Voxa Translate: ${message.error}`);
      syncState();
    }
  });

  // ==========================================
  // DRAGGABLE ENGINE IMPLEMENTATION
  // ==========================================
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  dragHandle.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - container.getBoundingClientRect().left;
    offsetY = e.clientY - container.getBoundingClientRect().top;
    
    // Set active styles
    container.style.transition = "none";
    dragHandle.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    
    const left = e.clientX - offsetX;
    const top = e.clientY - offsetY;

    // Bounds checks to lock draggable panel inside active tab limits
    const maxLeft = window.innerWidth - container.offsetWidth;
    const maxTop = window.innerHeight - container.offsetHeight;

    container.style.left = `${Math.max(0, Math.min(left, maxLeft))}px`;
    container.style.top = `${Math.max(0, Math.min(top, maxTop))}px`;
    container.style.right = "auto";
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    dragHandle.style.cursor = "move";
  });

})();
