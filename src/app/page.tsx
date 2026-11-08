'use client';

import React from 'react';
import Link from 'next/link';
import {
  Crown,
  Sparkles,
  Smartphone,
  Shield,
  ArrowRight,
  Music,
  Heart,
  Users,
  FileText,
  Calendar,
  Gift,
  CheckCircle2,
  Mic,
  QrCode,
  Send,
  Eye,
  Sliders,
} from 'lucide-react';

export default function RootLandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2218] flex flex-col justify-between selection:bg-[#D4AF37]/30 selection:text-[#2C2218]">
      {/* Background Soft Gold Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08)_0%,transparent_60%)] z-0" />

      {/* Top Royal Atelier Navigation */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 border-b border-[#E8DFC8]/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#AA820A] via-[#D4AF37] to-[#FAF4E3] flex items-center justify-center text-black font-cinzel font-bold text-lg shadow-[0_4px_15px_rgba(212,175,55,0.25)]">
            É
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cinzel text-lg sm:text-xl font-bold text-[#2C2218] tracking-widest">
                ÉTERNITÉ
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF4E3] text-[#7D5F04] border border-[#D4AF37]/40 font-bold uppercase tracking-wider">
                Ultra-Luxury
              </span>
            </div>
            <p className="text-[11px] font-cormorant italic text-[#7D5F04]">
              Royal Indian Wedding Invitation Platform & Client OS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/portal/client-rohit-priya"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-white border border-[#E8DFC8] text-[#544230] hover:text-[#2C2218] hover:border-[#D4AF37] text-xs font-cinzel tracking-wider uppercase items-center gap-1.5 transition-all shadow-sm"
          >
            <Crown className="w-3.5 h-3.5 text-[#AA820A]" /> Client Portal
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black hover:brightness-105 text-xs font-cinzel font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Shield className="w-3.5 h-3.5 text-black" /> Super-Admin
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-6 py-12 sm:py-16 space-y-12">
        {/* Auspicious Badge */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FAF4E3] border border-[#D4AF37]/50 text-[#7D5F04] text-xs font-cinzel tracking-widest uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#AA820A]" />
            <span>॥ श्री गणेशाय नमः ॥ • Royal Alabaster & 24K Gold Foiling</span>
            <Sparkles className="w-3.5 h-3.5 text-[#AA820A]" />
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl text-[#2C2218] font-medium tracking-tight leading-tight max-w-4xl mx-auto">
            The Haute Couture of <br />
            <span className="font-pinyon text-5xl sm:text-7xl text-[#AA820A] block my-2 font-normal">
              Interactive Wedding Invitations
            </span>
          </h2>

          <p className="font-cormorant italic text-lg sm:text-2xl text-[#544230] max-w-2xl mx-auto leading-relaxed">
            Inspired by the elegance of Udaipur palatial weddings, Bliss & Bone luxury typography, and TyingKnot seamless guest workflows.
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/rohit-weds-priya?guest=Aditya+Singhania"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs font-bold uppercase tracking-widest shadow-[0_10px_25px_rgba(212,175,55,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2.5"
            >
              <Smartphone className="w-4 h-4" /> Experience Guest Microsite
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/portal/client-rohit-priya"
              className="px-6 py-3.5 rounded-2xl bg-[#FDFBF7] border border-[#D4AF37]/60 text-[#2C2218] font-cinzel text-xs font-bold uppercase tracking-widest hover:bg-[#FAF4E3] active:scale-95 transition-all flex items-center gap-2.5 shadow-sm"
            >
              <Crown className="w-4 h-4 text-[#AA820A]" /> Client Management Portal
            </Link>
          </div>
        </div>

        {/* 3 Core Architecture Gateway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Card 1: Guest Microsite */}
          <Link
            href="/rohit-weds-priya?guest=Aditya+Singhania"
            className="group relative bg-[#FDFBF7] border border-[#E8DFC8] hover:border-[#D4AF37] rounded-3xl p-7 shadow-[0_10px_30px_rgba(44,34,24,0.04)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.18)] transition-all hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF4E3] border border-[#D4AF37]/40 text-[#7D5F04] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Smartphone className="w-6 h-6 text-[#AA820A]" />
              </div>
              <span className="font-cinzel text-[10px] uppercase tracking-widest text-[#AA820A] font-bold block mb-1">
                Module 03 • Ultra-Luxury Guest View
              </span>
              <h3 className="font-serif text-2xl font-medium text-[#2C2218] mb-3">
                Guest Microsite
              </h3>
              <p className="text-xs text-[#544230] font-sans leading-relaxed mb-6">
                3D Royal Gatefold Envelope with wax seal, live Sitar & Bansuri Flute synth audio, gold-foil canvas scratch card, trivia quiz, petal shower & VIP boarding pass.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E8DFC8]/60 flex items-center justify-between text-xs font-cinzel text-[#7D5F04] font-bold uppercase tracking-wider group-hover:text-[#2C2218]">
              <span>Launch /rohit-weds-priya</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Client Management Portal */}
          <Link
            href="/portal/client-rohit-priya"
            className="group relative bg-[#FDFBF7] border border-[#E8DFC8] hover:border-[#D4AF37] rounded-3xl p-7 shadow-[0_10px_30px_rgba(44,34,24,0.04)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.18)] transition-all hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF4E3] border border-[#D4AF37]/40 text-[#7D5F04] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Crown className="w-6 h-6 text-[#AA820A]" />
              </div>
              <span className="font-cinzel text-[10px] uppercase tracking-widest text-[#AA820A] font-bold block mb-1">
                Module 02 • Couple Atelier
              </span>
              <h3 className="font-serif text-2xl font-medium text-[#2C2218] mb-3">
                Client Portal
              </h3>
              <p className="text-xs text-[#544230] font-sans leading-relaxed mb-6">
                Mobile-first dashboard: import mobile contacts via Web Contact Picker API, 1-click WhatsApp wa.me dispatch with status tracking, live DJ manager & voice note blessings player.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E8DFC8]/60 flex items-center justify-between text-xs font-cinzel text-[#7D5F04] font-bold uppercase tracking-wider group-hover:text-[#2C2218]">
              <span>Open /portal/[clientId]</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Super-Admin Panel */}
          <Link
            href="/admin"
            className="group relative bg-[#FDFBF7] border border-[#E8DFC8] hover:border-[#D4AF37] rounded-3xl p-7 shadow-[0_10px_30px_rgba(44,34,24,0.04)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.18)] transition-all hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF4E3] border border-[#D4AF37]/40 text-[#7D5F04] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6 text-[#AA820A]" />
              </div>
              <span className="font-cinzel text-[10px] uppercase tracking-widest text-[#AA820A] font-bold block mb-1">
                Module 01 • Developer Agency
              </span>
              <h3 className="font-serif text-2xl font-medium text-[#2C2218] mb-3">
                Super-Admin Control
              </h3>
              <p className="text-xs text-[#544230] font-sans leading-relaxed mb-6">
                Developer control center: onboard new wedding clients with custom slugs (e.g. /rohit-weds-priya), generate client tokens, and impersonate any client via Shadow Access.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E8DFC8]/60 flex items-center justify-between text-xs font-cinzel text-[#7D5F04] font-bold uppercase tracking-wider group-hover:text-[#2C2218]">
              <span>Open /admin</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Feature Comparison & Innovations Section */}
        <div className="bg-[#FAF4E3]/60 border border-[#D4AF37]/30 rounded-3xl p-8 sm:p-10 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="font-cinzel text-[10px] uppercase tracking-widest text-[#AA820A] font-bold">
              Engineering Excellence
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#2C2218]">
              Why ÉTERNITÉ Surpasses Traditional Invite Platforms
            </h3>
            <p className="font-cormorant italic text-sm sm:text-base text-[#544230]">
              Combining Indian wedding cultural warmth with high-performance silicon-valley web engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="bg-white/80 p-5 rounded-2xl border border-[#E8DFC8]/70 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#FAF4E3] text-[#7D5F04] flex items-center justify-center font-bold text-xs">
                🪔
              </div>
              <h4 className="font-cinzel text-xs font-bold text-[#2C2218] uppercase">
                Procedural Sitar Flute Synth
              </h4>
              <p className="text-[11px] text-[#544230] leading-relaxed">
                No bulky 15MB MP3s; synthesizes Raga Yaman tanpura, sitar chime, and bamboo flute on the fly via Web Audio API.
              </p>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border border-[#E8DFC8]/70 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#FEF9E7] text-[#AA820A] flex items-center justify-center font-bold text-xs">
                📇
              </div>
              <h4 className="font-cinzel text-xs font-bold text-[#2C2218] uppercase">
                Web Contact Picker API
              </h4>
              <p className="text-[11px] text-[#544230] leading-relaxed">
                Pick real phonebook contacts directly from Android & iOS Chrome without typing numbers manually.
              </p>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border border-[#E8DFC8]/70 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#FDF2F4] text-[#9B1C2E] flex items-center justify-center font-bold text-xs">
                🎧
              </div>
              <h4 className="font-cinzel text-xs font-bold text-[#2C2218] uppercase">
                1-Click DJ Setlist PDF
              </h4>
              <p className="text-[11px] text-[#544230] leading-relaxed">
                Export letterpress formatted PDF of guest requested Bollywood & Punjabi sangeet tracks directly via jsPDF.
              </p>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border border-[#E8DFC8]/70 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#F1F6F3] text-[#557A65] flex items-center justify-center font-bold text-xs">
                🎙️
              </div>
              <h4 className="font-cinzel text-xs font-bold text-[#2C2218] uppercase">
                In-Browser Voice Blessing
              </h4>
              <p className="text-[11px] text-[#544230] leading-relaxed">
                Guests record sincere audio greetings from their phones, saved directly into Firebase Cloud Storage.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-8 border-t border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7D5F04]">
        <p className="font-serif">
          Crafted with Next.js 14 App Router, Tailwind CSS, Firebase, Framer Motion & jsPDF
        </p>
        <span className="font-mono text-[#AA820A] font-bold mt-2 sm:mt-0">
          Udaipur • The Oberoi Udaivilas Royal Edition • 2027
        </span>
      </footer>
    </div>
  );
}
