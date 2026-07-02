"use client";

import React from "react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import ShaderBackground from "@/components/ui/ShaderBackground";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col justify-center items-center px-6 overflow-hidden">
      {/* Interactive Flowing Neon Shader Background */}
      <ShaderBackground />

      {/* Top Logo */}
      <div className="relative z-10 mb-8 flex flex-col items-center gap-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight hover:text-white transition-colors group">
          <div className="w-9 h-9 rounded bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
              <path
                d="M4.5 4L12 18L19.5 4"
                stroke="url(#forgot-logo-grad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 9.5L12 13.5L15.5 9.5"
                stroke="url(#forgot-logo-inner)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />
              <defs>
                <linearGradient id="forgot-logo-grad" x1="4.5" y1="4" x2="19.5" y2="4">
                  <stop stopColor="#d0bcff" />
                  <stop offset="0.5" stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="forgot-logo-inner" x1="8.5" y1="9.5" x2="15.5" y2="9.5">
                  <stop stopColor="#ffb869" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-bold text-white text-xl tracking-tight">Voxa AI</span>
        </Link>
      </div>

      <ForgotPasswordForm />
    </div>
  );
}
