'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Search,
  Menu,
  X,
  Copy,
  Check,
  Flame,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { SUITE_CATEGORY_METAS, SUITE_METAS_LIST, SuiteCategoryMeta } from '@/lib/suiteCategoryMetas';

export default function RootLandingPage() {
  const router = useRouter();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Stealth Founder Access: 5-Tap Gesture on Logo (Direct to /admin)
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoTap = (e: React.MouseEvent) => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

    if (tapCountRef.current >= 5) {
      e.preventDefault();
      tapCountRef.current = 0;
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([60, 40, 60]);
      }
      router.push('/admin');
      return;
    }

    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 2500);
  };

  // Stealth Search Trigger: typing 'admin', 'boss', '*#99#', or '*#admin#'
  const handleSearchChange = (val: string) => {
    const clean = val.trim().toLowerCase();
    const secretCodes = ['admin', '*#99#', '*#admin#', 'boss', 'founder', 'shadow'];
    if (secretCodes.includes(clean)) {
      setSearchQuery('');
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(100);
      }
      router.push('/admin');
      return;
    }
    setSearchQuery(val);
  };

  const handleCopyCoupon = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('ROYAL2027');
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2000);
    }
  };

  const handleCopySuiteLink = (route: string) => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}${route}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(route);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  // Filtered Suites
  const filteredSuites = useMemo(() => {
    return SUITE_METAS_LIST.filter((suite) => {
      const matchesCategory =
        selectedCategory === 'all' || suite.id === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        suite.name.toLowerCase().includes(q) ||
        suite.hindiName.toLowerCase().includes(q) ||
        suite.coupleDisplay.toLowerCase().includes(q) ||
        suite.cityDisplay.toLowerCase().includes(q) ||
        suite.highlights.some((h) => h.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Muhurat Countdown
  const [muhuratTime, setMuhuratTime] = useState({ days: 184, hours: 14, mins: 32, secs: 10 });
  useEffect(() => {
    const timer = setInterval(() => {
      setMuhuratTime((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return { ...prev, days: Math.max(0, prev.days - 1), hours: 23, mins: 59, secs: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2218] flex flex-col justify-between selection:bg-[#D4AF37]/30 selection:text-[#2C2218] pb-24 sm:pb-12">
      {/* Background Soft Gold Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08)_0%,transparent_60%)] z-0" />

      {/* 1. RAJHARA EXPRESS STYLE STICKY TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8DFC8]/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Left: Hamburger & Brand Monogram (5-Tap Stealth Admin Gesture) */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-1.5 sm:p-2 rounded-xl text-[#544230] hover:bg-[#FAF4E3] active:scale-95 transition cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-[#AA820A]" />
              </button>

              <div
                onClick={handleLogoTap}
                className="flex items-center gap-2 select-none group cursor-pointer"
                title="Royal Vivah • Tap 5x for Stealth Admin"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#AA820A] via-[#D4AF37] to-[#FAF4E3] flex items-center justify-center text-black font-cinzel font-bold text-base shadow-[0_3px_12px_rgba(212,175,55,0.28)] group-hover:scale-105 transition-transform">
                  R
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-cinzel text-base sm:text-lg font-bold text-[#2C2218] tracking-widest leading-none">
                      ROYAL VIVAH
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#FAF4E3] text-[#7D5F04] border border-[#D4AF37]/40 font-bold uppercase tracking-wider hidden xs:inline">
                      OS
                    </span>
                  </div>
                  <p className="text-[10px] font-cormorant italic text-[#7D5F04] leading-tight hidden sm:block">
                    Royal Wedding Invitation OS
                  </p>
                </div>
              </div>
            </div>

            {/* Center: Rajhara Style Search Input with Secret Code Detection */}
            <div className="flex-1 max-w-md mx-auto hidden md:block">
              <div className="relative">
                <Search className="w-4 h-4 text-[#AA820A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="खोजें: Pressed Meadow, The Venue, Udaipur, Lake Como, or 'admin'..."
                  className="w-full pl-9 pr-8 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8DFC8] rounded-full focus:outline-none focus:border-[#AA820A] focus:bg-white text-[#2C2218] placeholder-[#7D5F04]/60 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right: Quick Action Links */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                href="/templates"
                className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-[#FAF4E3] border border-[#D4AF37]/50 text-[#7D5F04] hover:bg-[#F3E5AB] text-[11px] font-cinzel font-bold tracking-wider uppercase items-center gap-1 transition-all shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#AA820A]" /> 13 Suites
              </Link>
              <Link
                href="/portal/client-gourav-priya"
                className="hidden md:inline-flex px-3 py-1.5 rounded-full bg-white border border-[#E8DFC8] text-[#544230] hover:text-[#2C2218] hover:border-[#D4AF37] text-[11px] font-cinzel font-bold tracking-wider uppercase items-center gap-1 transition-all shadow-2xs"
              >
                <Crown className="w-3.5 h-3.5 text-[#AA820A]" /> Client Portal
              </Link>
              <Link
                href="/admin"
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black hover:brightness-105 text-[11px] font-cinzel font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
              >
                <Shield className="w-3.5 h-3.5 text-black" /> Super-Admin
              </Link>
            </div>

          </div>

          {/* Mobile Search Bar (Below Header on Small Screens) */}
          <div className="mt-2 block md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 text-[#AA820A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="खोजें: Pressed Meadow, Floral, Palace..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8DFC8] rounded-full focus:outline-none focus:border-[#AA820A] focus:bg-white text-[#2C2218] placeholder-[#7D5F04]/60 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. RAJHARA EXPRESS STYLE FESTIVE OFFER BANNER */}
      <section className="w-full relative overflow-hidden shadow-2xs">
        <div className="bg-gradient-to-r from-[#8C1D2F] via-[#AA820A] to-[#6B4E1B] text-white px-3 sm:px-6 py-2.5 sm:py-3 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-300/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 relative z-10">
            {/* Left: Badge & Auspicious Muhurat Tagline */}
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="hidden sm:flex w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md items-center justify-center shrink-0 border border-white/30 shadow-inner">
                <Sparkles className="w-4 h-4 text-yellow-200 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-0.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.2 rounded-full bg-yellow-400 text-gray-950 shadow-xs">
                    <Flame className="w-3 h-3 fill-current text-red-600" />
                    Shubh Muhurat
                  </span>
                  <span className="text-[10px] font-bold text-yellow-100 bg-white/15 px-2 py-0.2 rounded-full border border-white/20">
                    ॥ शुभ विवाह 2026-2027 सीजन ॥
                  </span>
                </div>
                <h2 className="text-xs sm:text-sm font-bold tracking-tight drop-shadow-xs">
                  Bespoke Interactive Invitations • WhatsApp Dispatch, Real Wax Seal & Sitar Synth
                </h2>
              </div>
            </div>

            {/* Right: Coupon Code & Live Auspicious Countdown */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-yellow-200 bg-black/25 px-2.5 py-1 rounded-xl border border-white/15">
                <Clock className="w-3 h-3" />
                <span>{muhuratTime.days}d {muhuratTime.hours}h {muhuratTime.mins}m {muhuratTime.secs}s</span>
              </div>

              <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full p-0.5 border border-white/30 shadow-xs">
                <span className="text-[10px] sm:text-[11px] font-mono font-black text-yellow-300 px-2.5">
                  ROYAL2027
                </span>
                <button
                  onClick={handleCopyCoupon}
                  className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 transition cursor-pointer active:scale-95"
                >
                  {copiedCoupon ? <Check className="w-3 h-3 text-emerald-800" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCoupon ? 'Copied' : 'Claim'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RAJHARA EXPRESS STYLE CATEGORY PILLS BAR */}
      <nav aria-label="Suite Categories" className="bg-white/95 backdrop-blur-xs border-b border-[#E8DFC8] py-1.5 px-2.5 sm:px-4 sticky top-[57px] sm:top-[53px] z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black shadow-xs font-bold'
                : 'bg-[#FAF7F2] text-[#544230] hover:bg-[#FAF4E3] border border-[#E8DFC8]/60'
            }`}
          >
            <span className="text-xs leading-none">👑</span>
            <span className="leading-none">Sabhi Suites (सभी डिज़ाइन्स)</span>
            <span className="text-[9px] px-1.5 rounded-full bg-white/40 text-[#2C2218] font-mono font-bold">
              13
            </span>
          </button>

          {SUITE_METAS_LIST.map((meta) => {
            const isSelected = selectedCategory === meta.id;
            return (
              <button
                key={meta.id}
                onClick={() => setSelectedCategory(meta.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black shadow-xs font-bold'
                    : 'bg-[#FAF7F2] text-[#544230] hover:bg-[#FAF4E3] border border-[#E8DFC8]/60'
                }`}
              >
                <span className="text-xs leading-none">{meta.icon}</span>
                <span className="leading-none">{meta.name}</span>
                <span
                  className={`text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-black text-[#FAF4E3]' : meta.badgeColor
                  }`}
                >
                  {meta.badge.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. MAIN BODY CONTAINER */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-10">

        {/* Auspicious Shloka & Headline */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF4E3] border border-[#D4AF37]/50 text-[#7D5F04] text-[11px] font-cinzel tracking-widest uppercase shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#AA820A]" />
            <span>॥ श्री गणेशाय नमः ॥ • Ultra-Luxury Bespoke Wedding Suites</span>
            <Sparkles className="w-3 h-3 text-[#AA820A]" />
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#2C2218] font-medium tracking-tight leading-tight max-w-4xl mx-auto">
            Interactive Wedding Microsites <br />
            <span className="font-pinyon text-4xl sm:text-6xl text-[#AA820A] block my-1 font-normal">
              Bespoke Digital Atelier
            </span>
          </h1>

          <p className="font-cormorant italic text-sm sm:text-lg text-[#544230] max-w-2xl mx-auto">
            Select a suite below to experience real cinematic wax seal unboxing, live sitar flute synth audio, RSVP hub, and guest contact dispatching.
          </p>
        </div>

        {/* 5. RAJHARA EXPRESS STYLE CATEGORY CATALOGUE GRID */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-[#E8DFC8]/80 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌸</span>
              <h2 className="font-serif font-bold text-lg text-[#2C2218]">
                {selectedCategory === 'all' ? 'All Wedding Invitation Suites' : SUITE_CATEGORY_METAS[selectedCategory]?.name}
              </h2>
              <span className="text-xs text-[#7D5F04] font-cormorant italic">
                ({filteredSuites.length} Designs Ready)
              </span>
            </div>

            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-cinzel font-bold text-[#AA820A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Reset Filter <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {filteredSuites.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#E8DFC8]">
              <p className="font-serif text-lg text-[#7D5F04]">No wedding suites found matching &quot;{searchQuery}&quot;</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-3 px-4 py-2 bg-[#FAF4E3] border border-[#D4AF37] rounded-full text-xs font-cinzel font-bold text-[#7D5F04]"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSuites.map((suite) => (
                <div
                  key={suite.id}
                  className={`rounded-3xl border p-5 sm:p-6 bg-gradient-to-br ${suite.gradientBg} ${suite.borderColor} flex flex-col justify-between transition-all hover:shadow-[0_15px_35px_rgba(212,175,55,0.18)] hover:-translate-y-1 relative overflow-hidden group`}
                >
                  {/* Top Badge & City */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl group-hover:scale-110 transition-transform">{suite.icon}</span>
                      <span className={`text-[10px] uppercase tracking-wider font-black px-2.5 py-0.5 rounded-full border shadow-2xs ${suite.badgeColor}`}>
                        {suite.badge}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-xl text-[#2C2218] mb-0.5">
                      {suite.name}
                    </h3>
                    <p className="text-xs font-cormorant italic text-[#7D5F04] font-semibold mb-2">
                      {suite.hindiName}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#544230] font-cinzel mb-4">
                      <MapPin className="w-3.5 h-3.5 text-[#AA820A]" />
                      <span>{suite.cityDisplay}</span>
                      <span>•</span>
                      <span className="font-bold text-[#2C2218]">{suite.coupleDisplay}</span>
                    </div>

                    <p className="text-xs text-[#544230] leading-relaxed mb-4 line-clamp-2">
                      {suite.description}
                    </p>

                    {/* 4 Feature Highlights */}
                    <div className="space-y-1.5 mb-5 bg-white/60 backdrop-blur-xs p-3 rounded-2xl border border-white/80">
                      {suite.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-[#2C2218]">
                          <Check className="w-3.5 h-3.5 text-[#AA820A] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions: Open Live Suite & Copy Link */}
                  <div className="pt-3 border-t border-[#E8DFC8]/60 flex items-center gap-2">
                    <Link
                      href={suite.route}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs font-bold uppercase tracking-wider shadow-xs hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Live Demo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleCopySuiteLink(suite.route)}
                      className="p-2.5 rounded-xl bg-white hover:bg-[#FAF4E3] border border-[#E8DFC8] text-[#544230] hover:text-[#2C2218] transition-colors cursor-pointer"
                      title="Copy Shareable Link"
                    >
                      {copiedLink === suite.route ? (
                        <Check className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Copy className="w-4 h-4 text-[#AA820A]" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. THREE CORE ARCHITECTURE GATEWAYS (Admin, Client Portal, Guest Microsite) */}
        <div className="pt-6">
          <div className="text-center mb-6">
            <span className="text-[10px] font-cinzel font-bold text-[#AA820A] uppercase tracking-widest block">
              Complete Wedding Platform Ecosystem
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#2C2218]">
              3 Production Modules Ready for Deployment
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Gateway 1: Super Admin */}
            <Link
              href="/admin"
              className="bg-white rounded-3xl p-6 border border-[#E8DFC8] hover:border-[#AA820A] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-[#FAF4E3] border border-[#D4AF37]/40 flex items-center justify-center mb-4 text-[#AA820A] group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-cinzel font-bold text-[#AA820A] uppercase tracking-wider block mb-1">
                  Module 01 • Super-Admin
                </span>
                <h3 className="font-serif text-xl font-bold text-[#2C2218] mb-2">
                  Developer & Onboarding OS
                </h3>
                <p className="text-xs text-[#544230] leading-relaxed mb-4">
                  Manage onboarded wedding clients, generate custom access links, live WhatsApp dispatch testing, and Shadow Impersonation.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-cinzel font-bold text-[#AA820A] pt-3 border-t border-[#E8DFC8]">
                <span>Launch /admin</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Gateway 2: Client Portal */}
            <Link
              href="/portal/client-gourav-priya"
              className="bg-white rounded-3xl p-6 border border-[#E8DFC8] hover:border-[#AA820A] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-[#FAF4E3] border border-[#D4AF37]/40 flex items-center justify-center mb-4 text-[#AA820A] group-hover:scale-105 transition-transform">
                  <Crown className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-cinzel font-bold text-[#AA820A] uppercase tracking-wider block mb-1">
                  Module 02 • Client Portal
                </span>
                <h3 className="font-serif text-xl font-bold text-[#2C2218] mb-2">
                  Couple Dashboard
                </h3>
                <p className="text-xs text-[#544230] leading-relaxed mb-4">
                  Web Contact Picker phonebook import, 1-click WhatsApp invite dispatches, live DJ song queue export, and audio blessings listener.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-cinzel font-bold text-[#AA820A] pt-3 border-t border-[#E8DFC8]">
                <span>Launch /portal/[clientId]</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Gateway 3: Luxury Guest Microsite */}
            <Link
              href="/gourav-weds-priya?guest=Special+Guest"
              className="bg-white rounded-3xl p-6 border border-[#E8DFC8] hover:border-[#AA820A] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-[#FAF4E3] border border-[#D4AF37]/40 flex items-center justify-center mb-4 text-[#AA820A] group-hover:scale-105 transition-transform">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-cinzel font-bold text-[#AA820A] uppercase tracking-wider block mb-1">
                  Module 03 • Guest Microsite
                </span>
                <h3 className="font-serif text-xl font-bold text-[#2C2218] mb-2">
                  Guest Invitation View
                </h3>
                <p className="text-xs text-[#544230] leading-relaxed mb-4">
                  3D Gatefold Envelope with wax seal break, canvas scratch date card, live Sitar synth audio, couple trivia quiz, and petal shower.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-cinzel font-bold text-[#AA820A] pt-3 border-t border-[#E8DFC8]">
                <span>Launch /gourav-weds-priya</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* 7. RAJHARA EXPRESS STYLE BOTTOM FLOATING NAVIGATION DOCK (Mobile & Desktop) */}
      <nav aria-label="Bottom Quick Access" className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94vw] max-w-lg pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-xl border border-[#AA820A]/40 rounded-full px-3 py-2 shadow-[0_12px_40px_rgba(170,130,10,0.18)] flex items-center justify-around">
          <Link
            href="/"
            className="flex flex-col items-center text-[#AA820A] hover:text-[#2C2218] transition"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[9px] font-cinzel font-bold mt-0.5">Home</span>
          </Link>

          <Link
            href="/templates"
            className="flex flex-col items-center text-[#544230] hover:text-[#2C2218] transition"
          >
            <FileText className="w-4 h-4" />
            <span className="text-[9px] font-cinzel font-bold mt-0.5">Suites</span>
          </Link>

          <Link
            href="/wedding-invitation-pressed-meadow"
            className="flex flex-col items-center text-[#6b7f5e] hover:text-[#2C2218] transition font-bold"
          >
            <span className="text-xs leading-none">🌸</span>
            <span className="text-[9px] font-cinzel font-bold mt-0.5">Meadow</span>
          </Link>

          <Link
            href="/portal/client-gourav-priya"
            className="flex flex-col items-center text-[#544230] hover:text-[#2C2218] transition"
          >
            <Crown className="w-4 h-4" />
            <span className="text-[9px] font-cinzel font-bold mt-0.5">Portal</span>
          </Link>

          <Link
            href="/admin"
            className="flex flex-col items-center text-[#AA820A] hover:text-[#2C2218] transition font-bold"
          >
            <Shield className="w-4 h-4" />
            <span className="text-[9px] font-cinzel font-bold mt-0.5">Admin</span>
          </Link>
        </div>
      </nav>

      {/* 8. RAJHARA EXPRESS STYLE HAMBURGER MENU DRAWER */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-start">
          <div className="bg-[#FAF8F5] w-full max-w-sm h-full p-6 flex flex-col justify-between border-r border-[#E8DFC8] shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#AA820A] to-[#FAF4E3] flex items-center justify-center text-black font-cinzel font-bold text-base shadow-sm">
                    R
                  </div>
                  <div>
                    <h3 className="font-cinzel text-base font-bold text-[#2C2218] tracking-widest">
                      ROYAL VIVAH
                    </h3>
                    <p className="text-[10px] font-cormorant italic text-[#7D5F04]">
                      Royal Wedding Platform
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-200 text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8DFC8] text-xs font-cinzel font-bold text-[#2C2218] hover:bg-[#FAF4E3]"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#AA820A]" /> Home & Catalogue
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link
                  href="/gourav-weds-priya?guest=Special+Guest"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-cinzel font-bold text-amber-900 hover:bg-amber-100"
                >
                  <span className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#AA820A]" /> Gourav & Priya (Royal Heritage)
                  </span>
                  <ChevronRight className="w-4 h-4 text-amber-700" />
                </Link>

                <Link
                  href="/portal/client-gourav-priya"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8DFC8] text-xs font-cinzel font-bold text-[#2C2218] hover:bg-[#FAF4E3]"
                >
                  <span className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-[#AA820A]" /> Client Management Portal
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-xs font-cinzel font-bold text-black shadow-sm"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-black" /> Super-Admin Developer Panel
                  </span>
                  <ChevronRight className="w-4 h-4 text-black" />
                </Link>
              </div>
            </div>

            {/* Bottom Footer Note */}
            <div className="pt-4 border-t border-[#E8DFC8] text-center">
              <p className="text-[10px] font-cinzel text-[#7D5F04] font-bold">
                ROYAL VIVAH WEDDING SAAS OS
              </p>
              <p className="text-[9px] font-sans text-gray-500 mt-0.5">
                Stealth Gesture: Tap R logo 5 times for Admin access
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#E8DFC8] bg-white/70 py-6 text-center text-xs text-[#7D5F04] font-cormorant italic">
        <p>© 2026-2027 Royal Vivah. Inspired by Indian Vivah Splendor & Royal Heritage.</p>
      </footer>
    </div>
  );
}
