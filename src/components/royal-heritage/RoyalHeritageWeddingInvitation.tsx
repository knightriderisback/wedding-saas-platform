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
import { ZareqiaGatefoldEnvelope } from '../zareqia/ZareqiaGatefoldEnvelope';
import { ZareqiaHeartScratch } from '../zareqia/ZareqiaHeartScratch';
import { ZareqiaPhotoCarousel } from '../zareqia/ZareqiaPhotoCarousel';
import { RoyalScrollyBackground } from './RoyalScrollyBackground';
import { royalSitarAudio } from '@/lib/sitarSynth';

interface RoyalHeritageWeddingInvitationProps {
  guestName?: string;
  autoOpen?: boolean;
}

export const RoyalHeritageWeddingInvitation: React.FC<RoyalHeritageWeddingInvitationProps> = ({
  guestName = 'Special Guest',
  autoOpen = false,
}) => {
  const [isArabic, setIsArabic] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(autoOpen);
  const [heroTextVisible, setHeroTextVisible] = useState(autoOpen);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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

  // Calculate live countdown to Dec 12, 2026
  useEffect(() => {
    const targetDate = new Date('2026-12-12T10:00:00Z').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Indian Wedding Instrumental Audio
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
            royalSitarAudio.startAmbient();
            setIsAudioPlaying(true);
          });
      } else {
        royalSitarAudio.startAmbient();
        setIsAudioPlaying(true);
      }
    }
  };

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpen(true);
    setHeroTextVisible(true);
    if (!isAudioPlaying) {
      toggleAudio();
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName) return;

    setRsvpLoading(true);
    setTimeout(() => {
      setRsvpLoading(false);
      setRsvpSubmitted(true);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#DFC07C', '#273822', '#C4A265', '#FAF8F5'],
      });
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#1A2218] flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8 overflow-hidden select-none">
      {/* Ambient background glow for desktop mode */}
      <div className="fixed inset-0 pointer-events-none opacity-25">
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#869B77] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#C4A265] rounded-full blur-[140px]" />
      </div>

      {/* Main Luxury Smartphone Container */}
      <div className="relative w-full max-w-[430px] h-[100dvh] sm:h-[880px] sm:max-h-[92vh] rounded-none sm:rounded-[48px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-0 sm:border-[6px] border-[#2A3527] bg-[#FAF8F5] flex flex-col">
        {/* Smartphone Dynamic Island / Speaker Notch (Desktop Viewport) */}
        <div className="hidden sm:block absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#1A2218] rounded-full z-50 pointer-events-none shadow-inner" />

        {/* ========================================================
            FIXED PINNED 3D SCROLL-SCRUBBED VIDEO CANVAS BACKGROUND
            Pinned to the phone screen, scrubbed by scrollContainerRef!
            ======================================================== */}
        <RoyalScrollyBackground
          scrollerRef={scrollContainerRef}
          overlayOpacity={0.18}
        />

        {/* ========================================================
            STAGE 1 & 2: GATEFOLD ENVELOPE & SILK CURTAINS OVERLAY
            ======================================================== */}
        {!isEnvelopeOpen && (
          <ZareqiaGatefoldEnvelope
            onCurtainsOpen={() => setHeroTextVisible(true)}
            onOpenComplete={handleEnvelopeOpen}
            isArabic={isArabic}
            onToggleLanguage={() => setIsArabic(!isArabic)}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={toggleAudio}
          />
        )}

        {/* ========================================================
            FLOATING CONTROLS HUD (Always Accessible)
            ======================================================== */}
        {/* Audio Mute/Unmute Button (Top Right) */}
        <button
          onClick={toggleAudio}
          className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-[#FAF8F5]/80 backdrop-blur-md border border-[#B59A57]/40 shadow-md flex items-center justify-center text-[#273822] hover:bg-[#FAF8F5] active:scale-95 transition-all"
          title={isAudioPlaying ? 'Mute Music' : 'Play Music'}
        >
          {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-60" />}
        </button>

        {/* Language Switcher Pill (Bottom Left) */}
        <button
          onClick={() => setIsArabic(!isArabic)}
          className="absolute bottom-4 left-4 z-50 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5]/85 backdrop-blur-md border border-[#B59A57]/40 shadow-md text-[11px] font-['Cinzel',serif] tracking-wider uppercase text-[#273822] hover:bg-[#FAF8F5] active:scale-95 transition-all"
        >
          <Globe className="w-3 h-3 text-[#B59A57]" />
          <span>{isArabic ? 'English' : 'العربية'}</span>
        </button>

        {/* Use This Design CTA (Bottom Right) */}
        <Link
          href="/customer?template=royal-heritage"
          className="absolute bottom-4 right-4 z-50 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#273822]/90 backdrop-blur-md text-[#FAF8F5] text-xs font-['Cinzel',serif] tracking-wider uppercase border border-[#B59A57]/40 hover:bg-[#1D2B19] transition-all shadow-md active:scale-95 hover:scale-105"
        >
          <Sparkles className="w-3 h-3 text-[#E6D197]" />
          <span>{isArabic ? 'استخدم هذا التصميم' : 'Use this Design'}</span>
        </Link>

        {/* ========================================================
            SCROLLABLE CONTENT BODY (TRANSPARENT, SCROLLS OVER PINNED CANVAS)
            ======================================================== */}
        <div
          ref={scrollContainerRef}
          className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#C4A265]/40 pb-20 bg-transparent"
        >
          {/* ========================================================
              SECTION 1: HERO INVITATION (Couple Names & Royal Announcement)
              Video Background: Frames 1 - 25 (Holding hands with gold sparkler dust)
              ======================================================== */}
          <section className="relative min-h-[92vh] flex flex-col items-center justify-between pt-12 pb-8 px-6 text-center z-10">
            {/* Top Announcement */}
            <div
              className={`relative z-10 pt-4 flex flex-col items-center transition-all duration-1000 ${
                heroTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="text-[#3A4A33] text-sm mb-2 opacity-90 drop-shadow">♥</div>

              <h2 className="font-['Cormorant_Garamond',serif] italic text-base md:text-lg text-[#3A4A33] tracking-wider drop-shadow-sm">
                {isArabic ? 'يسرنا دعوتكم لحضور حفل زفافنا' : "We're getting married"}
              </h2>

              {/* Decorative Divider */}
              <div className="flex items-center justify-center gap-2 mt-2 mb-4 opacity-80">
                <div className="w-12 h-[1px] bg-[#B59A57]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                <div className="w-12 h-[1px] bg-[#B59A57]" />
              </div>

              {/* GROOM: Aryan */}
              <div className="flex flex-col items-center my-1 bg-[#FAF8F5]/65 backdrop-blur-[3px] px-6 py-2.5 rounded-2xl border border-white/50 shadow-sm">
                <h1 className="font-['Alex_Brush','Pinyon_Script',cursive] text-5xl md:text-6xl text-[#242A20] font-normal tracking-wide drop-shadow-sm">
                  {isArabic ? 'آريان' : 'Aryan'}
                </h1>
                <div className="mt-1 flex flex-col items-center text-xs md:text-sm text-[#4E5B45] font-['Cormorant_Garamond',serif] leading-tight">
                  <span>{isArabic ? 'ابن السيد والسيدة شارما' : 'Son of Mr. & Mrs. Sharma'}</span>
                  <span className="tracking-widest text-[11px] uppercase opacity-90">B.Tech, MBA</span>
                  <span className="italic text-[#6B5A3E] text-xs">
                    {isArabic ? 'رائد أعمال' : 'Tech Entrepreneur'}
                  </span>
                </div>
              </div>

              {/* Ampersand */}
              <div className="my-1 font-['Cormorant_Garamond',serif] italic text-2xl text-[#8C764E] font-light">
                &
              </div>

              {/* BRIDE: Eva */}
              <div className="flex flex-col items-center my-1 bg-[#FAF8F5]/65 backdrop-blur-[3px] px-6 py-2.5 rounded-2xl border border-white/50 shadow-sm">
                <h1 className="font-['Alex_Brush','Pinyon_Script',cursive] text-5xl md:text-6xl text-[#242A20] font-normal tracking-wide drop-shadow-sm">
                  {isArabic ? 'إيفا' : 'Eva'}
                </h1>
                <div className="mt-1 flex flex-col items-center text-xs md:text-sm text-[#4E5B45] font-['Cormorant_Garamond',serif] leading-tight">
                  <span>{isArabic ? 'ابنة السيد والسيدة ميهتا' : 'Daughter of Mr. & Mrs. Mehta'}</span>
                  <span className="tracking-widest text-[11px] uppercase opacity-90">B.Des, M.A.</span>
                  <span className="italic text-[#6B5A3E] text-xs">
                    {isArabic ? 'مصممة أزياء' : 'Fashion Designer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="relative z-10 flex flex-col items-center gap-1 opacity-75 animate-bounce pb-2">
              <span className="text-[10px] font-['Cinzel',serif] tracking-widest text-[#5A4C32] uppercase">
                {isArabic ? 'مرر للأسفل' : 'Scroll Down'}
              </span>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
            </div>
          </section>

          {/* ========================================================
              SECTION 2: SCRATCH TO REVEAL (Interactive 3D Glitter Heart)
              Video Background: Frames 26 - 55 (Couple romantic embrace & starburst)
              ======================================================== */}
          <section className="relative z-10 py-10 px-6">
            <div className="bg-[#FAF8F5]/70 backdrop-blur-[6px] rounded-3xl p-4 border border-[#B59A57]/30 shadow-md">
              <ZareqiaHeartScratch
                coupleNames={isArabic ? 'آريان وإيفا' : 'Aryan & Eva'}
                weddingDate={isArabic ? '١٢ ديسمبر ٢٠٢٦' : 'December 12, 2026'}
                weddingDay={isArabic ? 'السبت' : 'Saturday'}
                weddingTime={isArabic ? '١٠:٠٠ صباحاً' : '10:00 AM'}
                isArabic={isArabic}
              />
            </div>
          </section>

          {/* ========================================================
              SECTION 3: PHOTO CAROUSEL & LIVE COUNTDOWN
              Video Background: Frames 56 - 75 (Groom lifts bride in his arms)
              ======================================================== */}
          <section className="relative z-10 py-10 px-6">
            <div className="bg-[#FAF8F5]/70 backdrop-blur-[6px] rounded-3xl p-5 border border-[#B59A57]/30 shadow-md">
              <ZareqiaPhotoCarousel />

              {/* Countdown Title */}
              <div className="mt-8 text-center">
                <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#3A4A33] tracking-wide">
                  {isArabic ? 'العد التنازلي لليوم المنتظر' : 'Counting Down'}
                </h3>
                <div className="flex items-center justify-center gap-2 mt-1.5 opacity-70">
                  <div className="w-8 h-[1px] bg-[#B59A57]" />
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                  <div className="w-8 h-[1px] bg-[#B59A57]" />
                </div>
              </div>

              {/* Countdown Blocks */}
              <div className="grid grid-cols-4 gap-2.5 max-w-[340px] mx-auto mt-6">
                {[
                  { label: isArabic ? 'أيام' : 'DAYS', value: timeLeft.days },
                  { label: isArabic ? 'ساعات' : 'HOURS', value: timeLeft.hours },
                  { label: isArabic ? 'دقائق' : 'MINUTES', value: timeLeft.minutes },
                  { label: isArabic ? 'ثواني' : 'SECONDS', value: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/90 border border-[#DFC07C]/40 shadow-sm"
                  >
                    <span className="font-['Playfair_Display',serif] text-xl sm:text-2xl font-bold text-[#273822]">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] font-['Cinzel',serif] tracking-wider text-[#6B5A3E] font-medium mt-0.5 uppercase">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========================================================
              SECTION 4: PROGRAM TIMELINE (Traditional Indian Ceremonies)
              Video Background: Frames 76 - 95 (Couple romantic twirl dance)
              ======================================================== */}
          <section className="relative z-10 py-10 px-6">
            <div className="bg-[#FAF8F5]/70 backdrop-blur-[6px] rounded-3xl p-6 border border-[#B59A57]/30 shadow-md text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-[#B59A57]/40 flex items-center justify-center text-[#B59A57] bg-white/60">
                <Clock className="w-5 h-5" />
              </div>

              <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#3A4A33] tracking-wide">
                {isArabic ? 'جدول الفعاليات' : 'Ceremony Timeline'}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-1.5 mb-8 opacity-70">
                <div className="w-8 h-[1px] bg-[#B59A57]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                <div className="w-8 h-[1px] bg-[#B59A57]" />
              </div>

              {/* Ceremonies Timeline */}
              <div className="relative pl-6 space-y-7 text-left max-w-[320px] mx-auto border-l-2 border-[#DFC07C]/60">
                {[
                  {
                    title: isArabic ? 'مراسم الحناء' : 'Mehndi & Sangeet',
                    time: isArabic ? '١١ ديسمبر ٢٠٢٦، ٦:٠٠ مساءً' : 'Dec 11, 2026, 6:00 PM',
                    desc: isArabic ? 'أمسية موسيقية واحتفال الحناء' : 'An evening of music, dance, and festive henna.',
                  },
                  {
                    title: isArabic ? 'مراسم الزواج الملكية' : 'Wedding Ceremony',
                    time: isArabic ? '١٢ ديسمبر ٢٠٢٦، ١٠:٠٠ صباحاً' : 'Dec 12, 2026, 10:00 AM',
                    desc: isArabic ? 'مراسم عقد القران والبركات' : 'Sacred wedding rituals and auspicious vows.',
                  },
                  {
                    title: isArabic ? 'حفل الاستقبال والعشاء' : 'Royal Reception',
                    time: isArabic ? '١٢ ديسمبر ٢٠٢٦، ٧:٣٠ مساءً' : 'Dec 12, 2026, 7:30 PM',
                    desc: isArabic ? 'عشاء فاخر واحتفال بالعرسان' : 'Grand dinner banquet and royal celebrations.',
                  },
                ].map((item, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#273822] border-2 border-[#DFC07C] shadow-sm" />
                    <h4 className="font-['Playfair_Display',serif] text-base font-bold text-[#273822]">
                      {item.title}
                    </h4>
                    <p className="font-['Cinzel',serif] text-[11px] tracking-wider text-[#8C764E] mt-0.5">
                      {item.time}
                    </p>
                    <p className="font-['Cormorant_Garamond',serif] text-xs italic text-[#55664F] mt-1">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========================================================
              SECTION 5: VENUE & DRESS CODE
              Video Background: Frames 96 - 110 (Couple royal pose)
              ======================================================== */}
          <section className="relative z-10 py-10 px-6">
            <div className="bg-[#FAF8F5]/70 backdrop-blur-[6px] rounded-3xl p-6 border border-[#B59A57]/30 shadow-md text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-[#B59A57]/40 flex items-center justify-center text-[#B59A57] bg-white/60">
                <Building2 className="w-5 h-5" />
              </div>

              <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#3A4A33] tracking-wide">
                {isArabic ? 'موقع الحفل' : 'Venue Location'}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-1.5 mb-4 opacity-70">
                <div className="w-8 h-[1px] bg-[#B59A57]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                <div className="w-8 h-[1px] bg-[#B59A57]" />
              </div>

              <h4 className="font-['Playfair_Display',serif] text-lg font-bold text-[#273822]">
                {isArabic ? 'قصر أودايفلاس الملكي' : 'The Royal Palace & Gardens'}
              </h4>
              <p className="font-['Cinzel',serif] text-xs tracking-wider text-[#6B5A3E] mt-1 uppercase">
                {isArabic ? 'أودايبور، راجستان، الهند' : 'Lake Pichola, Udaipur, India'}
              </p>

              {/* Map Canvas Card */}
              <div className="relative mt-6 rounded-2xl overflow-hidden border border-[#DFC07C]/40 shadow-sm h-48 bg-[#ECE5D8] flex items-center justify-center">
                {/* Stylized Architectural Palace Blueprint background */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      'radial-gradient(#869B77 1px, transparent 1px), radial-gradient(#869B77 1px, #ECE5D8 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#273822] text-[#E6D197] flex items-center justify-center shadow-lg border-2 border-[#DFC07C] animate-pulse">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="font-['Playfair_Display',serif] text-xs font-bold text-[#273822] mt-2 bg-white/80 px-3 py-1 rounded-full shadow-sm">
                    {isArabic ? 'قصر أودايفلاس' : 'Royal Palace Heritage'}
                  </span>
                </div>
              </div>

              {/* View on Google Maps Button */}
              <div className="mt-4">
                <a
                  href="https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#273822] text-[#FAF8F5] text-xs font-['Cinzel',serif] tracking-wider uppercase shadow-md hover:bg-[#1D2B19] active:scale-95 transition-all border border-[#B59A57]/30"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#E6D197]" />
                  <span>{isArabic ? 'فتح في خرائط جوجل' : 'View on Google Maps'}</span>
                </a>
              </div>

              {/* Dress Code */}
              <div className="mt-8 pt-6 border-t border-[#DFC07C]/30">
                <div className="w-9 h-9 mx-auto mb-2 rounded-full border border-[#B59A57]/40 flex items-center justify-center text-[#B59A57] bg-white/60">
                  <Shirt className="w-4 h-4" />
                </div>
                <h4 className="font-['Alex_Brush','Pinyon_Script',cursive] text-2xl text-[#3A4A33]">
                  {isArabic ? 'الزي الموصى به' : 'Dress Code'}
                </h4>
                <p className="font-['Playfair_Display',serif] text-sm font-semibold text-[#273822] mt-1">
                  {isArabic ? 'الملابس التقليدية الملكية' : 'Royal Traditional / Formal Festive'}
                </p>
                <p className="font-['Cormorant_Garamond',serif] text-xs italic text-[#55664F] mt-0.5">
                  {isArabic
                    ? 'ألوان الباستيل، الزمرد، والذهبي'
                    : 'Pastel Florals, Emerald Greens, and Regal Navy tones.'}
                </p>
              </div>
            </div>
          </section>

          {/* ========================================================
              SECTION 6: RSVP FORM
              Video Background: Frames 111 - 120 (Celebration fireworks exploding!)
              ======================================================== */}
          <section className="relative z-10 py-10 px-6">
            <div className="bg-[#FAF8F5]/70 backdrop-blur-[6px] rounded-3xl p-6 border border-[#B59A57]/30 shadow-md text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-[#B59A57]/40 flex items-center justify-center text-[#B59A57] bg-white/60">
                <Mail className="w-5 h-5" />
              </div>

              <h3 className="font-['Cinzel',serif] text-2xl text-[#273822] tracking-widest font-semibold uppercase">
                {isArabic ? 'تأكيد الحضور' : 'RSVP'}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-1.5 mb-3 opacity-70">
                <div className="w-8 h-[1px] bg-[#B59A57]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                <div className="w-8 h-[1px] bg-[#B59A57]" />
              </div>

              <p className="font-['Cormorant_Garamond',serif] text-xs sm:text-sm italic text-[#4E5C46] max-w-[280px] mx-auto mb-6">
                {isArabic
                  ? 'حضوركم ودعواتكم هي أجمل هدية يمكن أن نتلقاها في هذا اليوم المبارك.'
                  : 'Your love, blessings, and presence are the greatest gifts we could ever ask for.'}
              </p>

              {rsvpSubmitted ? (
                <div className="py-8 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#273822] text-[#E6D197] flex items-center justify-center mb-3 shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-['Playfair_Display',serif] text-lg font-bold text-[#273822]">
                    {isArabic ? 'شكراً لتأكيد حضوركم!' : 'RSVP Received with Joy!'}
                  </h4>
                  <p className="font-['Cormorant_Garamond',serif] text-xs italic text-[#55664F] mt-1 max-w-[240px]">
                    {isArabic
                      ? 'نتطلع للاحتفال معكم في هذا اليوم الاستثنائي.'
                      : 'We look forward to celebrating this royal celebration together.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left max-w-[320px] mx-auto">
                  <div>
                    <label className="block text-[10px] font-['Cinzel',serif] tracking-wider text-[#5A4C32] uppercase mb-1">
                      {isArabic ? 'الاسم الكامل *' : 'Your Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder={isArabic ? 'أدخل اسمك الكريم' : 'Enter your full name'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-[#DFC07C]/50 text-xs font-['Cormorant_Garamond',serif] text-[#242A20] placeholder-[#8A9B82] focus:outline-none focus:border-[#273822] shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-['Cinzel',serif] tracking-wider text-[#5A4C32] uppercase mb-1">
                      {isArabic ? 'البريد الإلكتروني *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-[#DFC07C]/50 text-xs font-['Cormorant_Garamond',serif] text-[#242A20] placeholder-[#8A9B82] focus:outline-none focus:border-[#273822] shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-['Cinzel',serif] tracking-wider text-[#5A4C32] uppercase mb-1">
                      {isArabic ? 'هل ستحضر؟ *' : 'Will you attend? *'}
                    </label>
                    <select
                      required
                      value={rsvpAttending}
                      onChange={(e) => setRsvpAttending(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-[#DFC07C]/50 text-xs font-['Cormorant_Garamond',serif] text-[#242A20] focus:outline-none focus:border-[#273822] shadow-sm"
                    >
                      <option value="">{isArabic ? 'اختر الإجابة...' : 'Please select...'}</option>
                      <option value="yes">
                        {isArabic ? 'نعم، بكل سرور سأحضر' : 'Joyfully Accepts with Pleasure'}
                      </option>
                      <option value="no">
                        {isArabic ? 'للأسف لن أتمكن من الحضور' : 'Regretfully Declines'}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-['Cinzel',serif] tracking-wider text-[#5A4C32] uppercase mb-1">
                      {isArabic ? 'عدد الضيوف' : 'Number of Guests'}
                    </label>
                    <select
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-[#DFC07C]/50 text-xs font-['Cormorant_Garamond',serif] text-[#242A20] focus:outline-none focus:border-[#273822] shadow-sm"
                    >
                      <option value="1">1 {isArabic ? 'ضيف' : 'Guest'}</option>
                      <option value="2">2 {isArabic ? 'ضيوف' : 'Guests'}</option>
                      <option value="3">3 {isArabic ? 'ضيوف' : 'Guests'}</option>
                      <option value="4">4+ {isArabic ? 'ضيوف' : 'Guests'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-['Cinzel',serif] tracking-wider text-[#5A4C32] uppercase mb-1">
                      {isArabic ? 'رسالة تهنئة للعروسين' : 'Warm Wishes / Message'}
                    </label>
                    <textarea
                      rows={3}
                      value={rsvpMessage}
                      onChange={(e) => setRsvpMessage(e.target.value)}
                      placeholder={isArabic ? 'اكتب تمنياتك الطيبة...' : 'Share your blessings...'}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/90 border border-[#DFC07C]/50 text-xs font-['Cormorant_Garamond',serif] text-[#242A20] placeholder-[#8A9B82] focus:outline-none focus:border-[#273822] shadow-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={rsvpLoading}
                    className="w-full py-3 rounded-full bg-[#273822] text-[#FAF8F5] text-xs font-['Cinzel',serif] tracking-widest uppercase shadow-md hover:bg-[#1D2B19] active:scale-95 transition-all border border-[#B59A57]/30 flex items-center justify-center gap-2 mt-2"
                  >
                    {rsvpLoading ? (
                      <span className="animate-pulse">{isArabic ? 'جاري الإرسال...' : 'Sending...'}</span>
                    ) : (
                      <>
                        <PartyPopper className="w-3.5 h-3.5 text-[#E6D197]" />
                        <span>{isArabic ? 'إرسال تأكيد الحضور' : 'Submit RSVP'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* Footer Blessing */}
          <div className="relative z-10 text-center py-6 px-4">
            <p className="font-['Alex_Brush','Pinyon_Script',cursive] text-2xl text-[#3A4A33]">
              {isArabic ? 'مع خالص الحب، آريان وإيفا' : 'With love & blessings, Aryan & Eva'}
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-2 text-[#7C9172]">
              <span className="text-xs">♥</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
