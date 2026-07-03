"use client";

import { useEffect } from "react";

export default function DevToolsProtection() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Disable Right Click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);

    // 2. Disable standard DevTools hotkeys
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && ["I", "J", "C", "i", "j", "c"].includes(e.key)) {
        e.preventDefault();
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && ["U", "u"].includes(e.key)) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // 3. Prevent Console Inspection by clearing console continuously
    const clearConsoleInterval = setInterval(() => {
      console.clear();
    }, 1000);

    // 4. Anti-Debugger Loop: Triggers a debugger halt if DevTools are opened
    const debuggerInterval = setInterval(() => {
      const startTime = performance.now();
      debugger;
      const endTime = performance.now();
      
      // If the execution took long (because developer paused on debugger), we clear/redirect
      if (endTime - startTime > 100) {
        console.clear();
      }
    }, 500);

    // 5. Hide console logs completely
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};

    // Cleanup on unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(clearConsoleInterval);
      clearInterval(debuggerInterval);
      
      // Restore original console methods
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      console.info = originalInfo;
    };
  }, []);

  return null;
}
