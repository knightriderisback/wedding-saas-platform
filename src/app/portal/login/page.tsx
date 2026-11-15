'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, Heart, KeyRound, Lock, Eye, EyeOff, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { validateClientLogin, getLoggedInClient } from '@/lib/auth';
import { AcrylicBackgroundOrbs } from '@/components/common/AcrylicBackgroundOrbs';

export default function ClientLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If client is already logged in, redirect to their studio
    const existingClient = getLoggedInClient();
    if (existingClient) {
      router.push(`/portal/${existingClient}`);
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = validateClientLogin(identifier, passcode);
      if (result.success && result.clientId) {
        router.push(`/portal/${result.clientId}`);
      } else {
        setErrorMsg('Invalid Client Identifier or Passcode. Please check your credentials.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-khadi-fabric relative flex flex-col justify-between items-center p-4 text-[#193822] font-portal selection:bg-[#D4AF37]/30 selection:text-[#193822]">
      <AcrylicBackgroundOrbs variant="multi" />

      {/* Top Header Navigation */}
      <header className="w-full max-w-5xl flex items-center justify-between py-3 z-10">
        <Link
          href="/"
          className="btn-slim-outline text-xs font-bold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Showcase</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-[#234E30] font-bold">
          <Heart className="w-4 h-4 text-rose-600 fill-current" />
          <span>Couple & Family VIP Portal</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md my-auto relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="card-pop3d-emerald rounded-3xl p-6 sm:p-8 space-y-6">
          {/* Header Monogram & Title */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#2D4A36] via-[#D4AF37] to-[#FAF4E3] flex items-center justify-center text-white shadow-md border border-[#739B83]/40">
              <Heart className="w-7 h-7 text-white fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-portal font-bold uppercase tracking-widest text-[#234E30] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#739B83]/30">
                Couple & Host Studio 💌
              </span>
              <h1 className="text-xl sm:text-2xl font-cinzel font-black text-[#193822] mt-1.5 leading-tight">
                Client Wedding Studio Login
              </h1>
              <p className="text-xs text-[#234E30] font-medium leading-relaxed mt-1">
                Enter your wedding access token or client ID and secret passcode to manage your celebration.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="card-pop3d-rose p-3 rounded-xl text-xs font-bold text-[#6E121E] flex items-center gap-2 animate-in fade-in">
              <span className="text-base">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#193822] uppercase tracking-wider mb-1 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-[#234E30]" />
                <span>Client Access Token or ID</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. CLT-XXXXX or couple slug..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#739B83]/40 bg-white/90 text-[#193822] placeholder-[#234E30]/50 focus:bg-white focus:outline-none focus:border-[#2D4A36] transition-colors shadow-2xs text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#193822] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#234E30]" />
                <span>Secret Passcode</span>
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter secret passcode..."
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#739B83]/40 bg-white/90 text-[#193822] placeholder-[#234E30]/50 focus:bg-white focus:outline-none focus:border-[#2D4A36] transition-colors shadow-2xs text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#234E30] hover:text-[#193822] transition cursor-pointer"
                  title={showPasscode ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-slim-emerald w-full text-xs font-bold py-2.5 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Verifying Access...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-current" />
                    <span>Unlock Wedding Studio</span>
                    <span>✨</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="pt-2 border-t border-[#739B83]/20 text-center">
            <Link
              href="/admin/login"
              className="text-xs text-[#234E30] hover:text-[#193822] font-bold hover:underline flex items-center justify-center gap-1"
            >
              <span>Admin / Concierge Manager Login</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 z-10 text-[11px] text-[#234E30] font-medium">
        <span>Royal Vivah Client Portal • Private Couple & Guest RSVP Dashboard</span>
      </footer>
    </div>
  );
}
