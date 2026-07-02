"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import Header from "@/components/Header";
import ShaderBackground from "@/components/ui/ShaderBackground";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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
        <span className="w-8 h-8 border-2 border-white/20 border-t-[#8b5cf6] rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-black text-[#e7e0ed] min-h-screen relative z-10 font-sans overflow-hidden pt-32 pb-12 flex flex-col items-center justify-start px-6">
        <ShaderBackground />

        <div className="w-full max-w-2xl relative z-10 flex flex-col gap-8">
          {/* Page Heading */}
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-bold tracking-tight text-white font-geist">User Profile</h1>
            <p className="text-zinc-400 text-sm">
              Manage your personal credentials and security settings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Details Card */}
            <div className="glass-panel p-6 rounded-xl border border-white/5 bg-[#0f0d15]/50 flex flex-col gap-5 justify-between">
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[10px] text-[#adc6ff] uppercase tracking-[0.2em] font-bold block">
                  Account Details
                </span>
                
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-500 font-mono">FULL NAME</span>
                  <span className="text-[15px] font-semibold text-white">{user.full_name}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-500 font-mono">EMAIL ADDRESS</span>
                  <span className="text-[15px] font-semibold text-white">{user.email}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-zinc-500 font-mono">ACCOUNT ID</span>
                  <span className="text-xs font-mono text-zinc-400 break-all">{user.id}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="w-2 h-2 rounded-full bg-[#8b5cf6]"></span>
                  <span>Session authenticated via JWT</span>
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="glass-panel p-6 rounded-xl border border-white/5 bg-[#0f0d15]/50 flex flex-col gap-4">
              <span className="font-mono text-[10px] text-[#ffb869] uppercase tracking-[0.2em] font-bold block">
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
                  <label className="text-[9px] uppercase tracking-[0.15em] font-mono text-[#cbc3d7]/50 font-bold mb-1.5 block">
                    Old Password
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-black border border-white/5 rounded-lg text-white placeholder-zinc-700 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-[0.15em] font-mono text-[#cbc3d7]/50 font-bold mb-1.5 block">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="•••••••• (min 8 chars)"
                    className="w-full px-3 py-2 bg-black border border-white/5 rounded-lg text-white placeholder-zinc-700 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors font-sans text-xs"
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
    </>
  );
}
