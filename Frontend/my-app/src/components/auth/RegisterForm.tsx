"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export default function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed.");
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel max-w-md w-full p-8 rounded-2xl border border-white/5 shadow-2xl relative z-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white font-geist">Create your account</h2>
        <p className="text-sm text-zinc-400 font-sans">
          Register to begin streaming and translating browser audio.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-950/30 border border-red-500/20 text-red-200 text-xs rounded-lg font-sans flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-red-400">error</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#cbc3d7]/50 font-bold mb-2 block">
            Full Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-[#0f0d15] border border-white/5 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors font-sans text-sm"
          />
        </div>

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

        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#cbc3d7]/50 font-bold mb-2 block">
            Password (min 8 characters)
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
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
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="text-center text-xs text-zinc-400 font-sans mt-2">
        Already have an account?{" "}
        <Link href="/login" className="text-[#8b5cf6] hover:text-[#7c3aed] transition-colors font-semibold">
          Log in
        </Link>
      </div>
    </div>
  );
}
