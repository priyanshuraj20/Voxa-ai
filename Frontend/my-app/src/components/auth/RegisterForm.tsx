"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { LANGUAGES } from "@/constants/languages";

export default function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferredSourceLanguage, setPreferredSourceLanguage] = useState("en-US");
  const [preferredTargetLanguage, setPreferredTargetLanguage] = useState("hi-IN");
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
          preferred_source_language: preferredSourceLanguage,
          preferred_target_language: preferredTargetLanguage,
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
    <div className="max-w-md w-full p-8 rounded-xl border border-zinc-900 bg-zinc-950 flex flex-col gap-6 relative z-10">
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
          <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-zinc-500 font-bold mb-2 block">
            Full Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-700 focus:outline-none focus:border-[#6366f1]/50 transition-colors font-sans text-sm"
          />
        </div>

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
            Password (min 8 characters)
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-700 focus:outline-none focus:border-[#6366f1]/50 transition-colors font-sans text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-zinc-500 font-bold mb-2 block">
              Default Source
            </label>
            <select
              value={preferredSourceLanguage}
              onChange={(e) => setPreferredSourceLanguage(e.target.value)}
              className="w-full px-3 py-2.5 bg-black border border-zinc-800 rounded-lg text-white outline-none focus:border-[#6366f1]/50 transition-colors font-sans text-sm cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-black text-[#e7e0ed]">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-zinc-500 font-bold mb-2 block">
              Default Target
            </label>
            <select
              value={preferredTargetLanguage}
              onChange={(e) => setPreferredTargetLanguage(e.target.value)}
              className="w-full px-3 py-2.5 bg-black border border-zinc-800 rounded-lg text-white outline-none focus:border-[#6366f1]/50 transition-colors font-sans text-sm cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-black text-[#e7e0ed]">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
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
        <Link href="/login" className="text-[#6366f1] hover:text-[#4f46e5] transition-colors font-semibold">
          Log in
        </Link>
      </div>
    </div>
  );
}

