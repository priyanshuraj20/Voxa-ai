"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ShaderBackground from "@/components/ui/ShaderBackground";
import { Button } from "@/components/ui/Button";
import { LANGUAGES } from "@/constants/languages";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [preferredSourceLanguage, setPreferredSourceLanguage] = useState("en-US");
  const [preferredTargetLanguage, setPreferredTargetLanguage] = useState("hi-IN");
  
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [prefError, setPrefError] = useState("");
  const [prefMessage, setPrefMessage] = useState("");
  const [isPrefLoading, setIsPrefLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      if (user.preferred_source_language) {
        setPreferredSourceLanguage(user.preferred_source_language);
      }
      if (user.preferred_target_language) {
        setPreferredTargetLanguage(user.preferred_target_language);
      }
    }
  }, [user]);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrefError("");
    setPrefMessage("");
    setIsPrefLoading(true);

    try {
      const response = await apiRequest("/auth/preferences", {
        method: "PUT",
        body: JSON.stringify({
          preferred_source_language: preferredSourceLanguage,
          preferred_target_language: preferredTargetLanguage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update preferences.");
      }

      setPrefMessage("Language preferences saved successfully.");
      await refreshUser();
    } catch (err: any) {
      setPrefError(err.message || "Failed to save preferences.");
    } finally {
      setIsPrefLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to change password.");
      }

      setMessage("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to change password. Make sure old password is correct.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-white/20 border-t-[#6366f1] rounded-full animate-spin"></span>
      </div>
    );
  }

  // Get initials for profile placeholder
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-[#e7e0ed] relative font-sans">
      <Header />
      <div className="flex flex-1 pt-[120px] overflow-hidden relative z-10 min-h-0">
        <Sidebar />
        <main className="flex-1 flex flex-col relative overflow-y-auto bg-transparent px-6 pb-12">
          <ShaderBackground />

          <div className="w-full max-w-2xl mx-auto mt-8 relative z-10 flex flex-col gap-8">
          {/* Page Heading */}
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-bold tracking-tight text-white font-geist">User Profile</h1>
            <p className="text-zinc-400 text-sm">
              Manage your language preferences and account security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT COLUMN: Account Details */}
            <div className="flex flex-col gap-6">
              {/* Account Card with Avatar */}
              <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950 flex flex-col gap-6 items-center text-center">
                {/* Profile Avatar Placeholder */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold text-3xl select-none border border-zinc-800">
                    {getInitials(user.full_name)}
                  </div>
                </div>

                <div className="flex flex-col gap-4 w-full text-left">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold block border-b border-zinc-900 pb-2">
                    Account Details
                  </span>
                  
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-zinc-500 font-mono">FULL NAME</span>
                    <span className="text-[15px] font-semibold text-white">{user.full_name}</span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-zinc-500 font-mono">EMAIL ADDRESS</span>
                    <span className="text-[15px] font-semibold text-white">{user.email}</span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-zinc-500 font-mono">ACCOUNT ID</span>
                    <span className="text-xs font-mono text-zinc-400 break-all">{user.id}</span>
                  </div>
                </div>
              </div>

              {/* Preferences Card */}
              <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950 flex flex-col gap-4">
                <span className="font-mono text-[10px] text-[#6366f1] uppercase tracking-[0.2em] font-bold block">
                  Language Preferences
                </span>

                {prefError && (
                  <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-200 text-xs rounded-lg font-sans flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-red-400">error</span>
                    <span className="break-all text-xs">{prefError}</span>
                  </div>
                )}

                {prefMessage && (
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-200 text-xs rounded-lg font-sans flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
                    <span>{prefMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSavePreferences} className="flex flex-col gap-3.5">
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.15em] font-mono text-zinc-500 font-bold mb-1.5 block">
                      Default Source Language
                    </label>
                    <select
                      value={preferredSourceLanguage}
                      onChange={(e) => setPreferredSourceLanguage(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white outline-none focus:border-[#6366f1]/50 transition-colors font-sans text-xs cursor-pointer"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code} className="bg-black text-[#e7e0ed]">
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-[0.15em] font-mono text-zinc-500 font-bold mb-1.5 block">
                      Default Target Language
                    </label>
                    <select
                      value={preferredTargetLanguage}
                      onChange={(e) => setPreferredTargetLanguage(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white outline-none focus:border-[#6366f1]/50 transition-colors font-sans text-xs cursor-pointer"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code} className="bg-black text-[#e7e0ed]">
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isPrefLoading}
                    className="w-full mt-2 font-semibold flex items-center justify-center gap-1.5 h-[34px]"
                  >
                    {isPrefLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        Saving...
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: Change Password */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950 flex flex-col gap-4 h-fit">
              <span className="font-mono text-[10px] text-[#38bdf8] uppercase tracking-[0.2em] font-bold block">
                Update Password
              </span>

              {error && (
                <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-200 text-xs rounded-lg font-sans flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-red-400">error</span>
                  <span className="break-all text-xs">{error}</span>
                </div>
              )}

              {message && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-200 text-xs rounded-lg font-sans flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
                  <span>{message}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="flex flex-col gap-3.5">
                <div>
                  <label className="text-[9px] uppercase tracking-[0.15em] font-mono text-zinc-500 font-bold mb-1.5 block">
                    Old Password
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-700 focus:outline-none focus:border-[#6366f1]/50 transition-colors font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-[0.15em] font-mono text-zinc-500 font-bold mb-1.5 block">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="•••••••• (min 8 chars)"
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-700 focus:outline-none focus:border-[#6366f1]/50 transition-colors font-sans text-xs"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isLoading}
                  className="w-full mt-2 font-semibold flex items-center justify-center gap-1.5 h-[34px]"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                      Updating...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
