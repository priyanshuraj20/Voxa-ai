"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"send" | "verify">("send");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to send OTP.");
      }

      setMessage("OTP has been sent to your email.");
      setStep("verify");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await apiRequest("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid or expired OTP.");
      }

      router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel max-w-md w-full p-8 rounded-2xl border border-white/5 shadow-2xl relative z-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white font-geist">
          {step === "send" ? "Forgot password" : "Verify OTP"}
        </h2>
        <p className="text-sm text-zinc-400 font-sans">
          {step === "send"
            ? "Enter your email to receive a password reset verification code."
            : "Enter the verification code sent to your email address."}
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-950/30 border border-red-500/20 text-red-200 text-xs rounded-lg font-sans flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-red-400">error</span>
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/20 text-emerald-200 text-xs rounded-lg font-sans flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
          <span>{message}</span>
        </div>
      )}

      {step === "send" ? (
        <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#cbc3d7]/50 font-bold mb-2 block">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-[#0f0d15] border border-white/5 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors font-sans text-sm"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full mt-2 font-semibold flex items-center justify-center gap-2 h-[42px]"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Sending OTP...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#cbc3d7]/50 font-bold mb-2 block">
              Verification Code (OTP)
            </label>
            <input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 bg-[#0f0d15] border border-white/5 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors font-sans text-sm text-center tracking-[0.25em] font-mono"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full mt-2 font-semibold flex items-center justify-center gap-2 h-[42px]"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>

          <button
            type="button"
            onClick={() => setStep("send")}
            className="text-xs text-zinc-400 hover:text-white transition-colors text-center font-sans mt-2 underline"
          >
            Change Email
          </button>
        </form>
      )}

      <div className="text-center text-xs text-zinc-400 font-sans mt-2">
        Remember your password?{" "}
        <Link href="/login" className="text-[#8b5cf6] hover:text-[#7c3aed] transition-colors font-semibold">
          Log in
        </Link>
      </div>
    </div>
  );
}
