import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "next/link": path.resolve(__dirname, "./src/lib/next-link-compat.tsx"),
      "next/navigation": path.resolve(__dirname, "./src/lib/next-navigation-compat.tsx"),
    },
  },
  define: {
    "process.env": {},
  },
  server: {
    port: 3000,
    open: true,
  },
});
