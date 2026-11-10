'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Volume2,
  VolumeX,
  Globe,
  Sparkles,
  MapPin,
  Clock,
  Building2,
  Mail,
  Navigation,
  CheckCircle2,
  PartyPopper,
  Shirt,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ZareqiaGatefoldEnvelope } from './ZareqiaGatefoldEnvelope';
import { ZareqiaHeartScratch } from './ZareqiaHeartScratch';
import { ZareqiaPhotoCarousel } from './ZareqiaPhotoCarousel';
import { royalSitarAudio } from '@/lib/sitarSynth';

interface ZareqiaWeddingInvitationProps {
  guestName?: string;
  autoOpen?: boolean;
}

export const ZareqiaWeddingInvitation: React.FC<ZareqiaWeddingInvitationProps> = ({
  guestName = 'Special Guest',
  autoOpen = false,
}) => {
  const [isArabic, setIsArabic] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(autoOpen);
  const [heroTextVisible, setHeroTextVisible] = useState(autoOpen);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // RSVP state
  const [rsvpName, setRsvpName] = useState(guestName !== 'Special Guest' ? guestName : '');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState('');
  const [rsvpGuests, setRsvpGuests] = useState('1');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 76,
    hours: 19,
    minutes: 9,
    seconds: 55,
  });

  // Calculate live countdown to Nov 30, 2026
  useEffect(() => {
    const targetDate = new Date('2026-11-30T10:00:00Z').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Indian Wedding Instrumental Audio (Tanpura + Sitar + Bansuri)
  useEffect(() => {
    const audio = new Audio('/audio/indian-wedding-instrumental.mp3');
    audio.loop = true;
    audio.volume = 0.65;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      royalSitarAudio.stopAmbient();
    };
  }, []);

  const toggleAudio = () => {
    if (isAudioPlaying) {
      if (audioRef.current) audioRef.current.pause();
      royalSitarAudio.stopAmbient();
      setIsAudioPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsAudioPlaying(true))
          .catch(() => {
            // Fallback to Web Audio API synthesized royal sitar flute
            royalSitarAudio.startAmbient();
            setIsAudioPlaying(true);
          });
      } else {
        royalSitarAudio.startAmbient();
        setIsAudioPlaying(true);
      }
    }
  };

  const handleCurtainsOpen = () => {
    setHeroTextVisible(true);
    if (!isAudioPlaying) {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsAudioPlaying(true))
          .catch(() => {
            royalSitarAudio.startAmbient();
            setIsAudioPlaying(true);
          });
      } else {
        royalSitarAudio.startAmbient();
        setIsAudioPlaying(true);
      }
    }
  };

  const handleEnvelopeComplete = () => {
    setIsEnvelopeOpen(true);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName || !rsvpEmail || !rsvpAttending) return;

    setRsvpLoading(true);
    setTimeout(() => {
      setRsvpLoading(false);
      setRsvpSubmitted(true);
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#3A5A3F', '#D4AF37', '#FAF7F0', '#E5C07B'],
        });
      } catch {}
    }, 600);
  };

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen w-full bg-[#182016] relative flex items-center justify-center p-0 sm:py-8 sm:px-4 overflow-x-hidden selection:bg-[#C4A265]/30 font-['Cinzel',serif]"
    >
      {/* Ambient Botanical Backdrop for Desktop (Matching POV garden mood) */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#384832] via-[#1C261A] to-[#0D130B]" />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/70 z-0" />

      {/* ========================================================
          LUXURY MOBILE DEVICE PRESENTATION CONTAINER
          On Desktop: Centered luxury flagship smartphone frame with dark titanium bezel & ambient shadow.
          On Mobile: 100% full screen responsive, edge-to-edge.
          ======================================================== */}
      <div className="relative w-full sm:max-w-[430px] h-[100dvh] sm:h-[880px] sm:max-h-[92vh] sm:rounded-[48px] bg-[#F7F4EE] shadow-[0_30px_90px_rgba(0,0,0,0.7),0_0_90px_rgba(46,60,41,0.35)] overflow-hidden flex flex-col z-10 border-0 sm:border-[8px] sm:border-[#232B20]">
        
        {/* Desktop Phone Notch / Dynamic Island */}
        <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 z-50 items-center justify-center pointer-events-none">
          <div className="w-24 h-5 rounded-full bg-black/85 flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] border border-white/10" />
            <div className="w-8 h-1 rounded-full bg-[#2A2A2A]" />
          </div>
        </div>

        {/* ========================================================
            GATEFOLD ENVELOPE OVERLAY (CONTAINED TO MOBILE CONTAINER)
            ======================================================== */}
        {!isEnvelopeOpen && (
          <ZareqiaGatefoldEnvelope
            onCurtainsOpen={handleCurtainsOpen}
            onOpenComplete={handleEnvelopeComplete}
            isArabic={isArabic}
            onToggleLanguage={() => setIsArabic(!isArabic)}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={toggleAudio}
          />
        )}

        {/* ========================================================
            FLOATING CONTROLS (ALWAYS INTERACTIVE, Z-50)
            ======================================================== */}
        {/* Top-Right Sound Button */}
        <button
          onClick={toggleAudio}
          aria-label="Toggle Sound"
          className="absolute top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/95 text-xs font-['Cinzel',serif] tracking-wider uppercase border border-white/20 hover:bg-black/60 transition-all shadow-lg active:scale-95"
        >
          {isAudioPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#FFE89E] animate-pulse" />
              <span>On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-white/75" />
              <span>Mute</span>
            </>
          )}
        </button>

        {/* Bottom-Left Language Switcher */}
        <button
          onClick={() => setIsArabic(!isArabic)}
          aria-label="Toggle Language"
          className="absolute bottom-4 left-4 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-[#FAF7F0] text-xs font-['Cinzel',serif] tracking-widest uppercase border border-white/20 hover:bg-black/60 transition-all shadow-lg active:scale-95"
        >
          <Globe className="w-3.5 h-3.5 text-[#FFE89E]" />
          <span>{isArabic ? 'English' : 'Arabic'}</span>
        </button>

        {/* Bottom-Right "Use this Design" Button */}
        <Link
          href="/customer?template=zareqia-emerald"
          className="absolute bottom-4 right-4 z-50 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2E3C29]/90 backdrop-blur-md text-[#FAF8F5] text-xs font-['Cinzel',serif] tracking-wider uppercase border border-[#C4A265]/40 hover:bg-[#232F1F] transition-all shadow-xl active:scale-95 hover:scale-105"
        >
          <Sparkles className="w-3 h-3 text-[#E8D389]" />
          <span>{isArabic ? 'استخدم هذا التصميم' : 'Use this Design'}</span>
        </Link>

        {/* ========================================================
            SCROLLABLE CONTENT BODY (PHYSICAL LUXURY PAPER)
            ======================================================== */}
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#C4A265]/40 pb-20">
          
          {/* Authentic Warm Wedding Cardstock Surface (Clean luxury paper, zero dots/checks) */}
          <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#FAF8F5]" />

          {/* ========================================================
              SECTION 1: HERO (Curtains, Zayn & Nora, Courtyard Fountain)
              ======================================================== */}
          <section className="relative min-h-[92vh] flex flex-col items-center justify-between pt-12 pb-8 px-6 text-center overflow-hidden">
            {/* Background Courtyard Illustration with Curtains & Fountain */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/templates/zareqia/hero-courtyard-hd.jpg"
                alt="Romantic Classical Courtyard and Silk Curtains"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#F5EFE6]/25 via-transparent to-[#F5EFE6]/35" />
            </div>

            {/* Top Silk Valance & Heart & Text Announcement */}
            <div
              className={`relative z-10 pt-4 flex flex-col items-center transition-all duration-1000 ${
                heroTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {/* Small Romantic Heart Icon */}
              <div className="text-[#3A4A33] text-sm mb-2 opacity-90 drop-shadow">♥</div>

              {/* "We're getting married" */}
              <h2 className="font-['Cormorant_Garamond',serif] italic text-base md:text-lg text-[#3A4A33] tracking-wider">
                {isArabic ? 'يسرنا دعوتكم لحضور حفل زفافنا' : "We're getting married"}
              </h2>

              {/* Decorative Divider with Center Diamond */}
              <div className="flex items-center justify-center gap-2 mt-2 mb-4 opacity-80">
                <div className="w-12 h-[1px] bg-[#B59A57]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                <div className="w-12 h-[1px] bg-[#B59A57]" />
              </div>

              {/* GROOM: Zayn */}
              <div className="flex flex-col items-center my-1">
                <h1 className="font-['Alex_Brush','Pinyon_Script',cursive] text-5xl md:text-6xl text-[#242A20] font-normal tracking-wide drop-shadow-sm">
                  {isArabic ? 'زين' : 'Zayn'}
                </h1>
                <div className="mt-1 flex flex-col items-center text-xs md:text-sm text-[#4E5B45] font-['Cormorant_Garamond',serif] leading-tight">
                  <span>{isArabic ? 'ابن السيد والسيدة مالك' : 'Son of Mr. & Mrs. Malik'}</span>
                  <span className="tracking-widest text-[11px] uppercase opacity-90">B.E., M.S.</span>
                  <span className="italic text-[#6B5A3E] text-xs">
                    {isArabic ? 'عالم بيانات' : 'Data Scientist'}
                  </span>
                </div>
              </div>

              {/* Ampersand */}
              <div className="my-1 font-['Cormorant_Garamond',serif] italic text-2xl text-[#8C764E] font-light">
                &
              </div>

              {/* BRIDE: Nora */}
              <div className="flex flex-col items-center my-1">
                <h1 className="font-['Alex_Brush','Pinyon_Script',cursive] text-5xl md:text-6xl text-[#242A20] font-normal tracking-wide drop-shadow-sm">
                  {isArabic ? 'نورا' : 'Nora'}
                </h1>
                <div className="mt-1 flex flex-col items-center text-xs md:text-sm text-[#4E5B45] font-['Cormorant_Garamond',serif] leading-tight">
                  <span>{isArabic ? 'ابنة السيد والسيدة ناصر' : 'Daughter of Mr. & Mrs. Nasser'}</span>
                  <span className="tracking-widest text-[11px] uppercase opacity-90">MBBS, M.D.</span>
                  <span className="italic text-[#6B5A3E] text-xs">
                    {isArabic ? 'طبيبة أطفال' : 'Pediatrician'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Fountain Balustrade Spacer */}
            <div className="relative z-10 w-full h-16 pointer-events-none" />
          </section>

          {/* ========================================================
              SECTION 2: WELCOME LETTER & CARDSTOCK BLESSING
              ======================================================== */}
          <section className="relative z-10 py-10 px-6 text-center border-t border-[#E8DFC8]/60 bg-[#F7F4EE]/90">
            <div className="max-w-[340px] mx-auto relative px-4 py-6 rounded-2xl bg-[#FCFAF5] border border-[#C4A265]/35 shadow-sm">
              <div className="text-[#3A4A33] text-xs mb-3 opacity-80">♥</div>
              <p className="font-['Cormorant_Garamond',serif] italic text-base md:text-lg text-[#3E4939] leading-relaxed">
                {isArabic
                  ? 'يشرفنا ويسعدنا أن نرحب بكم في حفل زفاف زين ونورا. ومع بداية رحلتهما معاً في المودة والإيمان، نشكركم لمشاركتنا هذه المناسبة المباركة.'
                  : 'We are honored to welcome you to the Wedding ceremony of Zayn & Nora. As they begin their journey together in faith and love, we thank you for being part of this blessed occasion.'}
              </p>
              <div className="text-[#3A4A33] text-xs mt-3 opacity-80">♥</div>
            </div>
          </section>

          {/* ========================================================
              SECTION 3: SCRATCH TO REVEAL (Interactive Glitter Heart)
              ======================================================== */}
          <section className="relative z-10 py-8 px-6 border-t border-[#E8DFC8]/60 bg-[#F5F0E6]/50">
            <ZareqiaHeartScratch
              coupleNames={isArabic ? 'زين ونورا' : 'Zayn & Nora'}
              weddingDate={isArabic ? '٣٠ نوفمبر ٢٠٢٦' : 'November 30, 2026'}
              weddingDay={isArabic ? 'الاثنين' : 'Monday'}
              weddingTime={isArabic ? '١٠:٠٠ صباحاً' : '10:00 AM'}
              isArabic={isArabic}
            />
          </section>

          {/* ========================================================
              SECTION 4: PHOTO CAROUSEL (Moments & Memories)
              ======================================================== */}
          <section className="relative z-10 py-8 px-6 border-t border-[#E8DFC8]/60">
            <ZareqiaPhotoCarousel />
          </section>

          {/* ========================================================
              SECTION 5: LIVE COUNTDOWN TIMER
              ======================================================== */}
          <section className="relative z-10 py-10 px-6 text-center border-t border-[#E8DFC8]/60 bg-[#F5F0E6]/40">
            <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#3A4A33] tracking-wide mb-1">
              {isArabic ? 'العد التنازلي' : 'Counting Down'}
            </h3>
            <div className="flex items-center justify-center gap-2 mb-6 opacity-70">
              <div className="w-10 h-[1px] bg-[#B59A57]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
              <div className="w-10 h-[1px] bg-[#B59A57]" />
            </div>

            {/* 4 Gold Countdown Cards */}
            <div className="grid grid-cols-4 gap-2.5 max-w-[320px] mx-auto">
              {[
                { label: isArabic ? 'أيام' : 'DAYS', value: timeLeft.days },
                { label: isArabic ? 'ساعات' : 'HOURS', value: timeLeft.hours },
                { label: isArabic ? 'دقائق' : 'MINUTES', value: timeLeft.minutes },
                { label: isArabic ? 'ثواني' : 'SECONDS', value: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center py-3 px-1 rounded-2xl bg-[#FCFAF5] border border-[#C4A265]/40 shadow-sm"
                >
                  <span className="font-['Cinzel',serif] text-2xl font-semibold text-[#2E3C29]">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] tracking-widest text-[#7A6A52] uppercase mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================
              SECTION 6: PROGRAM TIMELINE
              ======================================================== */}
          <section className="relative z-10 py-10 px-6 text-center border-t border-[#E8DFC8]/60">
            <div className="w-10 h-10 rounded-full border border-[#B59A57]/60 flex items-center justify-center mx-auto mb-3 text-[#3A4A33] bg-[#FAF8F5]">
              <Clock className="w-4 h-4 text-[#B59A57]" />
            </div>

            <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#3A4A33] tracking-wide mb-1">
              {isArabic ? 'برنامج الحفل' : 'Program Timeline'}
            </h3>
            <div className="flex items-center justify-center gap-2 mb-6 opacity-70">
              <div className="w-10 h-[1px] bg-[#B59A57]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
              <div className="w-10 h-[1px] bg-[#B59A57]" />
            </div>

            {/* Timeline Vertical Trail */}
            <div className="max-w-[320px] mx-auto relative text-left rtl:text-right pl-6 rtl:pl-0 rtl:pr-6 space-y-6">
              {/* Connecting Vertical Trail Line */}
              <div className="absolute left-[7px] rtl:left-auto rtl:right-[7px] top-2 bottom-2 w-[1.5px] bg-gradient-to-b from-[#B59A57] via-[#D4AF37] to-[#B59A57]/40" />

              {/* Event 1: Guest Arrival */}
              <div className="relative">
                <div className="absolute -left-[23px] rtl:-left-auto rtl:-right-[23px] top-1.5 w-3 h-3 rounded-full bg-[#3B4D36] border-2 border-[#FAF8F5] shadow" />
                <h4 className="font-['Playfair_Display',serif] text-base font-medium text-[#2E3C29]">
                  {isArabic ? 'وصول الضيوف الكرام' : 'Guest Arrival'}
                </h4>
                <div className="text-xs text-[#8C764E] font-['Cinzel',serif] tracking-wider mt-0.5">
                  {isArabic ? '٣٠ نوفمبر ٢٠٢٦، ١٠:٠٠ صباحاً' : 'Nov 30, 2026, 10:00 AM'}
                </div>
                <p className="text-xs text-[#5C6A54] italic font-['Cormorant_Garamond',serif] mt-1">
                  {isArabic ? 'نرحب بحضوركم بكل سرور... ♥' : 'We welcome you... ♥'}
                </p>
              </div>

              {/* Event 2: Wedding Ceremony */}
              <div className="relative">
                <div className="absolute -left-[23px] rtl:-left-auto rtl:-right-[23px] top-1.5 w-3 h-3 rounded-full bg-[#3B4D36] border-2 border-[#FAF8F5] shadow" />
                <h4 className="font-['Playfair_Display',serif] text-base font-medium text-[#2E3C29]">
                  {isArabic ? 'مراسم عقد القران والزفاف' : 'Wedding Ceremony'}
                </h4>
                <div className="text-xs text-[#8C764E] font-['Cinzel',serif] tracking-wider mt-0.5">
                  {isArabic ? '٣٠ نوفمبر ٢٠٢٦، ١٠:٣٠ صباحاً' : 'Nov 30, 2026, 10:30 AM'}
                </div>
                <p className="text-xs text-[#5C6A54] italic font-['Cormorant_Garamond',serif] mt-1">
                  {isArabic ? 'حضوركم يكتمل به فرحنا وسعادتنا!' : 'Your presence means a lot!'}
                </p>
              </div>

              {/* Event 3: Reception */}
              <div className="relative">
                <div className="absolute -left-[23px] rtl:-left-auto rtl:-right-[23px] top-1.5 w-3 h-3 rounded-full bg-[#3B4D36] border-2 border-[#FAF8F5] shadow" />
                <h4 className="font-['Playfair_Display',serif] text-base font-medium text-[#2E3C29]">
                  {isArabic ? 'حفل الاستقبال والعشاء' : 'Reception'}
                </h4>
                <div className="text-xs text-[#8C764E] font-['Cinzel',serif] tracking-wider mt-0.5">
                  {isArabic ? '٢ ديسمبر ٢٠٢٦، ٧:٣٠ مساءً' : 'Dec 2, 2026, 7:30 PM'}
                </div>
                <p className="text-xs text-[#5C6A54] italic font-['Cormorant_Garamond',serif] mt-1">
                  {isArabic ? 'أمسية احتفالية لا تُنسى' : 'An evening of celebration and joy'}
                </p>
              </div>
            </div>
          </section>

          {/* ========================================================
              SECTION 7: VENUE & MAP
              ======================================================== */}
          <section className="relative z-10 py-10 px-6 text-center border-t border-[#E8DFC8]/60 bg-[#F5F0E6]/30">
            <div className="w-10 h-10 rounded-full border border-[#B59A57]/60 flex items-center justify-center mx-auto mb-3 text-[#3A4A33] bg-[#FAF8F5]">
              <Building2 className="w-4 h-4 text-[#B59A57]" />
            </div>

            <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#3A4A33] tracking-wide mb-1">
              {isArabic ? 'موقع الحفل' : 'Venue Location'}
            </h3>
            <div className="flex items-center justify-center gap-2 mb-4 opacity-70">
              <div className="w-10 h-[1px] bg-[#B59A57]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
              <div className="w-10 h-[1px] bg-[#B59A57]" />
            </div>

            <p className="font-['Playfair_Display',serif] text-sm text-[#2E3C29] font-medium">
              Grand Palace Hall
            </p>
            <p className="text-xs text-[#6F604D] mb-5">
              City centre, London
            </p>

            {/* Map Preview Card */}
            <div className="relative w-full max-w-[340px] mx-auto aspect-[16/9] rounded-2xl overflow-hidden border border-[#C4A265]/40 shadow-lg bg-[#E6E1D5]">
              <div
                className="absolute inset-0 opacity-85"
                style={{
                  backgroundImage:
                    'radial-gradient(#C5BCAB 1.5px, transparent 1.5px), linear-gradient(135deg, #ECE5D8 0%, #D8CFBE 100%)',
                  backgroundSize: '20px 20px, 100% 100%',
                }}
              />

              {/* Map Roads & Stylized Grid */}
              <svg
                className="absolute inset-0 w-full h-full opacity-40"
                viewBox="0 0 340 190"
                fill="none"
                stroke="#A89B85"
              >
                <line x1="0" y1="95" x2="340" y2="95" strokeWidth="6" stroke="#FAF8F5" />
                <line x1="120" y1="0" x2="120" y2="190" strokeWidth="4" stroke="#FAF8F5" />
                <line x1="240" y1="0" x2="240" y2="190" strokeWidth="3" stroke="#FAF8F5" />
                <line x1="0" y1="40" x2="340" y2="150" strokeWidth="2" stroke="#FFFFFF" />
              </svg>

              {/* Center Map Pin */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#2E3C29] text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                  <MapPin className="w-4 h-4 text-[#E8D389]" />
                </div>
                <div className="w-2.5 h-1 rounded-full bg-black/20 blur-[1px] mt-0.5" />
              </div>

              {/* Open in Maps Overlay Pill Button */}
              <a
                href="https://maps.google.com/?q=Grand+Palace+Hall+City+centre+London"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#2A3725] text-[10px] font-['Cinzel',serif] tracking-wider uppercase shadow-md border border-[#B59A57]/40 hover:bg-white transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
              >
                <Navigation className="w-2.5 h-2.5 text-[#3B4D36]" />
                <span>{isArabic ? 'فتح في الخرائط ↗' : 'Open in Maps ↗'}</span>
              </a>
            </div>

            {/* View on Google Maps Pill Button Below Map */}
            <div className="mt-4">
              <a
                href="https://maps.google.com/?q=Grand+Palace+Hall+City+centre+London"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#2E3C29] text-[#FAF8F5] text-xs font-['Cinzel',serif] tracking-widest uppercase shadow-md hover:bg-[#232F1F] active:scale-95 transition-all border border-[#B59A57]/30"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C4A265]" />
                <span>{isArabic ? 'عرض على خرائط Google' : 'View on Google Maps'}</span>
              </a>
            </div>
          </section>

          {/* ========================================================
              SECTION 8: DRESS CODE
              ======================================================== */}
          <section className="relative z-10 py-10 px-6 text-center border-t border-[#E8DFC8]/60">
            <div className="w-10 h-10 rounded-full border border-[#B59A57]/60 flex items-center justify-center mx-auto mb-3 text-[#3A4A33] bg-[#FAF8F5]">
              <Shirt className="w-4 h-4 text-[#B59A57]" />
            </div>

            <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#3A4A33] tracking-wide mb-1">
              {isArabic ? 'قواعد اللباس' : 'Dress Code'}
            </h3>
            <div className="flex items-center justify-center gap-2 mb-6 opacity-70">
              <div className="w-10 h-[1px] bg-[#B59A57]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
              <div className="w-10 h-[1px] bg-[#B59A57]" />
            </div>

            <div className="max-w-[320px] mx-auto space-y-5 text-center">
              {/* Women */}
              <div>
                <h4 className="font-['Playfair_Display',serif] text-base font-medium text-[#2E3C29]">
                  {isArabic ? 'السيدات' : 'Women'}
                </h4>
                <p className="text-xs text-[#5C6A54] italic font-['Cormorant_Garamond',serif] mt-0.5">
                  {isArabic
                    ? 'أزياء رسمية أنيقة بألوان الباستيل أو الجواهر'
                    : 'Elegant formal attire in pastel or jewel tones'}
                </p>
              </div>

              {/* Men */}
              <div>
                <h4 className="font-['Playfair_Display',serif] text-base font-medium text-[#2E3C29]">
                  {isArabic ? 'الرجال' : 'Men'}
                </h4>
                <p className="text-xs text-[#5C6A54] italic font-['Cormorant_Garamond',serif] mt-0.5">
                  {isArabic ? 'بدلة رسمية أو زي تقليدي فاخر' : 'Suit or traditional formal wear'}
                </p>
              </div>
            </div>
          </section>

          {/* ========================================================
              SECTION 9: PRE-WEDDING EVENTS (Mahendi & Haldi)
              ======================================================== */}
          <section className="relative z-10 py-10 px-6 text-center border-t border-[#E8DFC8]/60 bg-[#F5F0E6]/40">
            <div className="w-10 h-10 rounded-full border border-[#B59A57]/60 flex items-center justify-center mx-auto mb-3 text-[#3A4A33] bg-[#FAF8F5]">
              <Sparkles className="w-4 h-4 text-[#B59A57]" />
            </div>

            <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#3A4A33] tracking-wide mb-1">
              {isArabic ? 'الفعاليات السابقة للزفاف' : 'Pre-Wedding Events'}
            </h3>
            <div className="flex items-center justify-center gap-2 mb-6 opacity-70">
              <div className="w-10 h-[1px] bg-[#B59A57]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
              <div className="w-10 h-[1px] bg-[#B59A57]" />
            </div>

            <div className="max-w-[320px] mx-auto space-y-4 text-center">
              {/* Mahendi Ceremony */}
              <div className="p-4 rounded-2xl bg-[#FCFAF5] border border-[#C4A265]/40 shadow-sm">
                <h4 className="font-['Playfair_Display',serif] text-base font-medium text-[#2E3C29]">
                  {isArabic ? 'حفل الحناء (المهندي)' : 'Mahendi'}
                </h4>
                <div className="text-xs text-[#8C764E] font-['Cinzel',serif] tracking-wider mt-1">
                  {isArabic ? '٢٨ نوفمبر ٢٠٢٦، ٨:٣٠ مساءً' : 'Nov 28, 2026, 8:30 PM'}
                </div>
                <p className="text-xs text-[#5C6A54] italic font-['Cormorant_Garamond',serif] mt-1">
                  {isArabic ? 'في منزل العروس' : "At Bride's House"}
                </p>
              </div>

              {/* Haldi Ceremony */}
              <div className="p-4 rounded-2xl bg-[#FCFAF5] border border-[#C4A265]/40 shadow-sm">
                <h4 className="font-['Playfair_Display',serif] text-base font-medium text-[#2E3C29]">
                  {isArabic ? 'حفل الهالدي المبارك' : 'Haldi'}
                </h4>
                <div className="text-xs text-[#8C764E] font-['Cinzel',serif] tracking-wider mt-1">
                  {isArabic ? '٢٩ نوفمبر ٢٠٢٦، ٨:٠٠ مساءً' : 'Nov 29, 2026, 8:00 PM'}
                </div>
                <p className="text-xs text-[#5C6A54] italic font-['Cormorant_Garamond',serif] mt-1">
                  {isArabic ? 'في منزل العريس' : "At Groom's House"}
                </p>
              </div>
            </div>
          </section>

          {/* ========================================================
              SECTION 10: RSVP & WISHES
              ======================================================== */}
          <section className="relative z-10 py-10 px-6 text-center border-t border-[#E8DFC8]/60 bg-[#F5F0E6]/30">
            {/* Gift/Blessing Note */}
            <p className="font-['Cormorant_Garamond',serif] italic text-sm text-[#4E5B45] max-w-[320px] mx-auto mb-6">
              {isArabic
                ? 'محبتكم ودعواتكم وحضوركم هي أغلى وأجمل هدية نتمناها.'
                : 'Your love, blessings, and presence are the greatest gifts we could ever ask for.'}
            </p>

            <div className="w-10 h-10 rounded-full border border-[#B59A57]/60 flex items-center justify-center mx-auto mb-3 text-[#3A4A33] bg-[#FAF8F5]">
              <Mail className="w-4 h-4 text-[#B59A57]" />
            </div>

            <h3 className="font-['Playfair_Display',serif] text-2xl text-[#2E3C29] tracking-wider uppercase mb-1">
              RSVP
            </h3>
            <div className="flex items-center justify-center gap-2 mb-6 opacity-70">
              <div className="w-10 h-[1px] bg-[#B59A57]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
              <div className="w-10 h-[1px] bg-[#B59A57]" />
            </div>

            {rsvpSubmitted ? (
              <div className="max-w-[320px] mx-auto p-6 rounded-2xl bg-[#FCFAF5] border border-[#B59A57]/40 shadow-sm text-center">
                <div className="w-12 h-12 rounded-full bg-[#3B4D36]/10 text-[#3B4D36] flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-[#3B4D36]" />
                </div>
                <h4 className="font-['Playfair_Display',serif] text-lg text-[#2E3C29] font-medium mb-1">
                  {isArabic ? 'شكراً لتأكيد حضوركم!' : 'RSVP Received with Joy!'}
                </h4>
                <p className="text-xs text-[#5C6A54] font-['Cormorant_Garamond',serif] italic">
                  {isArabic
                    ? 'نتطلع بشوق لرؤيتكم والاحتفال معاً بهذه اللحظة الجميلة.'
                    : 'We look forward to celebrating this special day with you.'}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleRsvpSubmit}
                className="max-w-[320px] mx-auto space-y-4 text-left rtl:text-right"
              >
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-['Cinzel',serif] tracking-wider uppercase text-[#544634] mb-1">
                    {isArabic ? 'الاسم الكريم *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder={isArabic ? 'الاسم بالكامل' : 'Your full name'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#C4A265]/40 text-sm text-[#2A3725] placeholder:text-[#9E9484] focus:outline-none focus:border-[#3B4D36] focus:ring-1 focus:ring-[#3B4D36]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-['Cinzel',serif] tracking-wider uppercase text-[#544634] mb-1">
                    {isArabic ? 'البريد الإلكتروني *' : 'Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={rsvpEmail}
                    onChange={(e) => setRsvpEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#C4A265]/40 text-sm text-[#2A3725] placeholder:text-[#9E9484] focus:outline-none focus:border-[#3B4D36] focus:ring-1 focus:ring-[#3B4D36]"
                  />
                </div>

                {/* Attendance */}
                <div>
                  <label className="block text-[11px] font-['Cinzel',serif] tracking-wider uppercase text-[#544634] mb-1">
                    {isArabic ? 'هل ستشرفوننا بالحضور؟ *' : 'Will you be attending? *'}
                  </label>
                  <select
                    required
                    value={rsvpAttending}
                    onChange={(e) => setRsvpAttending(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#C4A265]/40 text-sm text-[#2A3725] focus:outline-none focus:border-[#3B4D36] focus:ring-1 focus:ring-[#3B4D36]"
                  >
                    <option value="">{isArabic ? 'اختر الإجابة...' : 'Select...'}</option>
                    <option value="yes">
                      {isArabic ? 'نعم، يشرفني الحضور بكل سرور ♥' : 'Joyfully Accept ♥'}
                    </option>
                    <option value="no">
                      {isArabic ? 'للأسف لن أتمكن من الحضور' : 'Regretfully Decline'}
                    </option>
                  </select>
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-[11px] font-['Cinzel',serif] tracking-wider uppercase text-[#544634] mb-1">
                    {isArabic ? 'عدد الضيوف' : 'Number of Guests'}
                  </label>
                  <select
                    value={rsvpGuests}
                    onChange={(e) => setRsvpGuests(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#C4A265]/40 text-sm text-[#2A3725] focus:outline-none focus:border-[#3B4D36] focus:ring-1 focus:ring-[#3B4D36]"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} {isArabic ? (num === 1 ? 'ضيف' : 'ضيوف') : num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message / Wishes */}
                <div>
                  <label className="block text-[11px] font-['Cinzel',serif] tracking-wider uppercase text-[#544634] mb-1">
                    {isArabic ? 'رسالة تهنئة للعروسين' : 'Your Message'}
                  </label>
                  <textarea
                    rows={3}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder={isArabic ? 'اكتب تمنياتك ومباركتك...' : 'Write your wishes...'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#C4A265]/40 text-sm text-[#2A3725] placeholder:text-[#9E9484] focus:outline-none focus:border-[#3B4D36] focus:ring-1 focus:ring-[#3B4D36] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 text-center">
                  <button
                    type="submit"
                    disabled={rsvpLoading}
                    className="w-full py-3 rounded-full bg-[#2E3C29] text-[#FAF8F5] text-xs font-['Cinzel',serif] tracking-widest uppercase shadow-md hover:bg-[#232F1F] active:scale-95 transition-all border border-[#B59A57]/30 flex items-center justify-center gap-2"
                  >
                    {rsvpLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <PartyPopper className="w-3.5 h-3.5 text-[#E8D389]" />
                        <span>{isArabic ? 'إرسال الرسالة والتأكيد' : 'Send Message'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Bottom Cardstock Watermark */}
          <div className="py-8 text-center opacity-60">
            <span className="font-['Cinzel',serif] text-[10px] tracking-[0.25em] text-[#7A6A52] uppercase">
              Zareqia Royal Atelier • Emerald Suite
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
