"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/Button";

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const otpParam = searchParams.get("otp");
    if (emailParam) setEmail(emailParam);
    if (otpParam) setOtp(otpParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          otp,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Reset password failed.");
      }

      setMessage("Password updated successfully. Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please check input values.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full p-8 rounded-xl border border-zinc-900 bg-zinc-950 flex flex-col gap-6 relative z-10">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white font-geist">Reset Password</h2>
        <p className="text-sm text-zinc-400 font-sans">
          Enter your new password to regain access to your account.
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-zinc-500 font-bold mb-2 block">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-700 focus:outline-none focus:border-[#6366f1]/50 transition-colors font-sans text-sm"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-zinc-500 font-bold mb-2 block">
            Verification Code (OTP)
          </label>
          <input
            type="text"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP"
            className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-700 focus:outline-none focus:border-[#6366f1]/50 transition-colors font-sans text-sm font-mono tracking-widest text-center"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-zinc-500 font-bold mb-2 block">
            New Password (min 8 characters)
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-700 focus:outline-none focus:border-[#6366f1]/50 transition-colors font-sans text-sm"
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
              Updating password...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>

      <div className="text-center text-xs text-zinc-400 font-sans mt-2">
        Remember your password?{" "}
        <Link href="/login" className="text-[#6366f1] hover:text-[#4f46e5] transition-colors font-semibold">
          Log in
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={
      <div className="max-w-md w-full p-8 rounded-xl border border-zinc-900 bg-zinc-950 flex flex-col items-center justify-center min-h-[300px]">
        <span className="w-8 h-8 border-2 border-white/20 border-t-[#6366f1] rounded-full animate-spin"></span>
      </div>
    }>
      <ResetPasswordFormContent />
    </Suspense>
  );
}
