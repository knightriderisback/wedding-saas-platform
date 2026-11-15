'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { validateAdminLogin, isAdminLoggedIn } from '@/lib/auth';
import { AcrylicBackgroundOrbs } from '@/components/common/AcrylicBackgroundOrbs';

export default function AdminLoginPage() {
  const router = useRouter();
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If already authenticated, redirect directly to admin panel
    if (isAdminLoggedIn()) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const isValid = validateAdminLogin(emailOrUser, password);
      if (isValid) {
        router.push('/admin');
      } else {
        setErrorMsg('Invalid Administrator Credentials. Please check your username/email and password.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-khadi-fabric relative flex flex-col justify-between items-center p-4 text-[#5C4303] font-portal selection:bg-[#D4AF37]/30 selection:text-[#5C4303]">
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
        <div className="flex items-center gap-1.5 text-xs text-[#785B24] font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Encrypted Admin Gateway</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md my-auto relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="card-pop3d-amber rounded-3xl p-6 sm:p-8 space-y-6">
          {/* Header Monogram & Title */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#AA820A] via-[#D4AF37] to-[#FAF4E3] flex items-center justify-center text-white shadow-md border border-[#AA820A]/40">
              <Crown className="w-7 h-7 text-[#2C2218]" />
            </div>
            <div>
              <span className="text-[10px] font-portal font-bold uppercase tracking-widest text-[#785B24] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#AA820A]/20">
                Super Admin Access 👑
              </span>
              <h1 className="text-xl sm:text-2xl font-cinzel font-black text-[#5C4303] mt-1.5 leading-tight">
                Royal Concierge Admin Login
              </h1>
              <p className="text-xs text-[#785B24] font-medium leading-relaxed mt-1">
                Enter your authorized credentials to access master wedding management.
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
              <label className="block text-[11px] font-bold text-[#5C4303] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#AA820A]" />
                <span>Admin Username or Email</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  placeholder="Enter administrator ID..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#AA820A]/30 bg-white/90 text-[#5C4303] placeholder-[#785B24]/50 focus:bg-white focus:outline-none focus:border-[#AA820A] transition-colors shadow-2xs text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5C4303] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#AA820A]" />
                <span>Secret Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secret password..."
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#AA820A]/30 bg-white/90 text-[#5C4303] placeholder-[#785B24]/50 focus:bg-white focus:outline-none focus:border-[#AA820A] transition-colors shadow-2xs text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#785B24] hover:text-[#5C4303] transition cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-slim-gold w-full text-xs font-bold py-2.5 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authenticate & Access Admin</span>
                    <span>👑</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="pt-2 border-t border-[#AA820A]/20 text-center">
            <Link
              href="/portal/login"
              className="text-xs text-[#785B24] hover:text-[#5C4303] font-bold hover:underline flex items-center justify-center gap-1"
            >
              <span>Switch to Couple Client Portal Login</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 z-10 text-[11px] text-[#785B24] font-medium">
        <span>Royal Vivah SaaS Platform • Protected by End-to-End Session Encryption</span>
      </footer>
    </div>
  );
}
