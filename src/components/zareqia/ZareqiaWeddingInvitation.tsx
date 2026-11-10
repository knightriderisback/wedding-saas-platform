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
  Gift,
  Mail,
  ChevronDown,
  Navigation,
  CheckCircle2,
  PartyPopper,
  Shirt,
  UserCheck,
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

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpen(true);
    // Reveal hero text right after curtains finish opening
    setTimeout(() => {
      setHeroTextVisible(true);
    }, 400);

    // Start Indian wedding instrumental audio
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
      className="min-h-screen bg-[#F7F4EE] text-[#24201D] font-['Cormorant_Garamond',serif] antialiased overflow-x-hidden selection:bg-[#B59A57]/30"
    >
      {/* 1. GATEFOLD 3D DOORS ENVELOPE (TOP-LEVEL OVERLAY WITH TWO-STAGE CURTAIN REVEAL) */}
      {!isEnvelopeOpen && (
        <ZareqiaGatefoldEnvelope
          onOpenComplete={handleEnvelopeOpen}
          isArabic={isArabic}
          onToggleLanguage={() => setIsArabic(!isArabic)}
          audioSrc="/audio/indian-wedding-instrumental.mp3"
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={toggleAudio}
        />
      )}

      {/* 2. FLOATING FIXED CONTROLS */}
      {/* Sound Toggle (Top-Right Frosted Glass Button) */}
      <button
        onClick={toggleAudio}
        aria-label="Toggle Audio"
        className="fixed top-4 right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/75 backdrop-blur-md text-[#2A3825] text-xs font-['Cinzel',serif] tracking-wider uppercase border border-[#B59A57]/40 hover:bg-white transition-all shadow-md active:scale-95"
      >
        {isAudioPlaying ? (
          <>
            <div className="flex items-end gap-[2px] h-3">
              <span className="w-0.5 bg-[#3A5A3F] h-full animate-[pulse_0.6s_ease-in-out_infinite]" />
              <span className="w-0.5 bg-[#3A5A3F] h-2/3 animate-[pulse_0.8s_ease-in-out_infinite_0.2s]" />
              <span className="w-0.5 bg-[#3A5A3F] h-4/5 animate-[pulse_0.7s_ease-in-out_infinite_0.4s]" />
            </div>
            <Volume2 className="w-3.5 h-3.5 text-[#3A5A3F]" />
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-[#736A5B]" />
            <span>Mute</span>
          </>
        )}
      </button>

      {/* Language Switcher (Bottom-Left Frosted Glass Button) */}
      <button
        onClick={() => setIsArabic(!isArabic)}
        aria-label="Toggle Language"
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-[#2A3825] text-xs font-['Cinzel',serif] tracking-widest uppercase border border-[#B59A57]/40 hover:bg-white transition-all shadow-lg active:scale-95"
      >
        <Globe className="w-3.5 h-3.5 text-[#B59A57]" />
        <span>{isArabic ? 'English' : 'Arabic'}</span>
      </button>

      {/* "Use this Design" Floating Pill Button (Bottom Right) */}
      <Link
        href="/customer?template=zareqia-emerald"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2E3C29]/90 backdrop-blur-md text-[#FAF8F5] text-xs font-['Cinzel',serif] tracking-wider uppercase border border-[#C4A265]/40 hover:bg-[#232F1F] transition-all shadow-xl active:scale-95 hover:scale-105"
      >
        <Sparkles className="w-3 h-3 text-[#E8D389]" />
        <span>{isArabic ? 'استخدم هذا التصميم' : 'Use this Design'}</span>
      </Link>

      {/* 3. MAIN MOBILE CONTAINER (9:16 Canvas matching exact video screen) */}
      <main className="max-w-[480px] mx-auto min-h-screen bg-[#F7F4EE] shadow-2xl relative overflow-hidden pb-24">
        {/* Paper Texture Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(#D6CDBC 0.75px, transparent 0.75px), radial-gradient(#D6CDBC 0.75px, #F7F4EE 0.75px)',
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 15px 15px',
          }}
        />

        {/* ========================================================
            SECTION 1: HERO (Curtains, Zayn & Nora, Courtyard Fountain)
            ======================================================== */}
        <section className="relative min-h-[92vh] flex flex-col items-center justify-between pt-10 pb-6 px-6 text-center overflow-hidden">
          {/* Background Courtyard Illustration with Curtains & Fountain */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/templates/zareqia/hero-courtyard.jpg"
              alt="Romantic Classical Courtyard and Silk Curtains"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#F5EFE6]/30 via-[#F5EFE6]/10 to-[#F5EFE6]/40" />
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
            <div className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#B59A57] my-1">
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

          {/* Bottom Courtyard Space & Scroll Down Chevron Indicator */}
          <div className="relative z-10 flex flex-col items-center pt-24 pb-2">
            <span className="text-[11px] font-['Cinzel',serif] tracking-[0.25em] text-[#607358] uppercase mb-1 opacity-90">
              {isArabic ? 'انتقل للأسفل' : 'Scroll'}
            </span>
            <ChevronDown className="w-4 h-4 text-[#607358] animate-bounce" />
          </div>
        </section>

        {/* ========================================================
            SECTION 2: SCRATCH TO REVEAL (3D Recessed Emerald Glitter Heart)
            ======================================================== */}
        <section className="relative z-10 py-8 bg-[#F7F4EE]/90 backdrop-blur-sm border-t border-[#E8DFC8]/60">
          <ZareqiaHeartScratch
            coupleNames={isArabic ? 'زين & نورا' : 'Zayn & Nora'}
            weddingDate={isArabic ? '٣٠ نوفمبر ٢٠٢٦' : 'November 30, 2026'}
            weddingDay={isArabic ? 'الاثنين' : 'Monday'}
            weddingTime={isArabic ? '١٠:٠٠ صباحاً' : '10:00 AM'}
            isArabic={isArabic}
          />
        </section>

        {/* ========================================================
            SECTION 3: PHOTO CAROUSEL (Frameless with Floating Dots Inside)
            ======================================================== */}
        <section className="relative z-10 py-6 border-t border-[#E8DFC8]/60">
          <div className="flex items-center justify-center gap-2 mb-2 opacity-70">
            <div className="w-12 h-[1px] bg-[#B59A57]" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
            <div className="w-12 h-[1px] bg-[#B59A57]" />
          </div>
          <ZareqiaPhotoCarousel />
        </section>

        {/* ========================================================
            SECTION 4: COUNTDOWN ("Counting Down to Forever")
            ======================================================== */}
        <section className="relative z-10 py-8 px-6 text-center border-t border-[#E8DFC8]/60">
          <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#3A4A33] tracking-wide mb-1">
            {isArabic ? 'نعد التنازلي إلى الأبد' : 'Counting Down to Forever'}
          </h3>
          <div className="flex items-center justify-center gap-2 mb-6 opacity-70">
            <div className="w-10 h-[1px] bg-[#B59A57]" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
            <div className="w-10 h-[1px] bg-[#B59A57]" />
          </div>

          {/* 4 Soft Warm Beige-Grey Stat Boxes */}
          <div className="grid grid-cols-4 gap-2.5 max-w-[340px] mx-auto">
            {[
              { val: timeLeft.days, label: isArabic ? 'يوم' : 'DAYS' },
              { val: timeLeft.hours, label: isArabic ? 'ساعة' : 'HOURS' },
              { val: timeLeft.minutes, label: isArabic ? 'دقيقة' : 'MINUTES' },
              { val: timeLeft.seconds, label: isArabic ? 'ثانية' : 'SECONDS' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center py-3.5 px-1 rounded-xl bg-[#EFECE6] border border-[#D8CEBC]/60 shadow-sm"
              >
                <span className="font-['Playfair_Display',serif] text-2xl md:text-3xl font-bold text-[#2A3725]">
                  {String(item.val).padStart(2, '0')}
                </span>
                <span className="font-['Cinzel',serif] text-[9px] tracking-widest text-[#7C6E5A] mt-1 uppercase">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            SECTION 5: PROGRAM TIMELINE
            ======================================================== */}
        <section className="relative z-10 py-10 px-6 text-center border-t border-[#E8DFC8]/60">
          <div className="w-10 h-10 rounded-full border border-[#B59A57]/60 flex items-center justify-center mx-auto mb-3 text-[#3A4A33] bg-[#FAF8F5]">
            <Clock className="w-4 h-4 text-[#B59A57]" />
          </div>

          <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#3A4A33] tracking-wide mb-1">
            {isArabic ? 'جدول فعاليات الحفل' : 'Program Timeline'}
          </h3>
          <div className="flex items-center justify-center gap-2 mb-8 opacity-70">
            <div className="w-10 h-[1px] bg-[#B59A57]" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
            <div className="w-10 h-[1px] bg-[#B59A57]" />
          </div>

          <div className="max-w-[320px] mx-auto space-y-7 text-center">
            {/* 1. Guest Arrival */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-[#2E3C29] font-['Playfair_Display',serif] text-lg font-medium">
                <span className="w-2 h-2 rounded-full bg-[#3B4D36]" />
                <h4>{isArabic ? 'استقبال الضيوف' : 'Guest Arrival'}</h4>
              </div>
              <p className="text-xs text-[#6B5A3E] font-['Cinzel',serif] tracking-wider mt-0.5">
                {isArabic ? '٣٠ نوفمبر ٢٠٢٦، ١٠:٠٠ صباحاً' : 'Nov 30, 2026, 10:00 AM'}
              </p>
              <p className="italic text-xs text-[#52634B] mt-0.5">
                {isArabic ? 'أهلاً وسهلاً بكم ♥' : 'We welcome you ♥'}
              </p>
            </div>

            {/* 2. Wedding Ceremony */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-[#2E3C29] font-['Playfair_Display',serif] text-lg font-medium">
                <span className="w-2 h-2 rounded-full bg-[#3B4D36]" />
                <h4>{isArabic ? 'عقد القران ومراسم الزفاف' : 'Wedding Ceremony'}</h4>
              </div>
              <p className="text-xs text-[#6B5A3E] font-['Cinzel',serif] tracking-wider mt-0.5">
                {isArabic ? '٣٠ نوفمبر ٢٠٢٦، ١٠:٣٠ صباحاً' : 'Nov 30, 2026, 10:30 AM'}
              </p>
              <p className="italic text-xs text-[#52634B] mt-0.5">
                {isArabic ? 'حضوركم يكتمل به فرحنا!' : 'Your presence means a lot!'}
              </p>
            </div>

            {/* 3. Reception */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-[#2E3C29] font-['Playfair_Display',serif] text-lg font-medium">
                <span className="w-2 h-2 rounded-full bg-[#3B4D36]" />
                <h4>{isArabic ? 'حفل الاستقبال والعشاء' : 'Reception'}</h4>
              </div>
              <p className="text-xs text-[#6B5A3E] font-['Cinzel',serif] tracking-wider mt-0.5">
                {isArabic ? '٢ ديسمبر ٢٠٢٦، ٧:٣٠ مساءً' : 'Dec 2, 2026, 7:30 PM'}
              </p>
              <p className="italic text-xs text-[#52634B] mt-0.5">
                {isArabic ? 'عشاء واحتفال ببهجة لا تُنسى' : 'Dinner, dancing & celebration'}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 6: VENUE & MAP
            ======================================================== */}
        <section className="relative z-10 py-10 px-6 text-center border-t border-[#E8DFC8]/60">
          <div className="w-10 h-10 rounded-full border border-[#B59A57]/60 flex items-center justify-center mx-auto mb-3 text-[#3A4A33] bg-[#FAF8F5]">
            <MapPin className="w-4 h-4 text-[#B59A57]" />
          </div>

          <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#3A4A33] tracking-wide mb-1">
            {isArabic ? 'موقع الحفل' : 'Venue'}
          </h3>
          <div className="flex items-center justify-center gap-2 mb-4 opacity-70">
            <div className="w-10 h-[1px] bg-[#B59A57]" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
            <div className="w-10 h-[1px] bg-[#B59A57]" />
          </div>

          <div className="mb-5">
            <h4 className="font-['Playfair_Display',serif] text-xl font-bold text-[#2A3725]">
              {isArabic ? 'قاعة القصر الكبير' : 'Grand Palace Hall'}
            </h4>
            <p className="text-xs text-[#6B5A3E] font-['Cormorant_Garamond',serif] mt-0.5">
              {isArabic ? 'وسط المدينة، لندن، المملكة المتحدة' : 'City centre, London'}
            </p>
          </div>

          {/* Interactive Map Card (North London with top-left Open in Maps button) */}
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

            {/* Open in Maps Overlay Pill Button (TOP-LEFT CORNER like video f_0042.jpg) */}
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
        </section>

        {/* ========================================================
            SECTION 7: DRESS CODE (Exact match from video f_0046.jpg)
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
              <p className="text-xs text-[#52634B] font-['Cormorant_Garamond',serif] mt-0.5">
                {isArabic
                  ? 'أزياء رسمية أنيقة بألوان هادئة أو درجات الأحجار الكريمة'
                  : 'Elegant formal attire in pastel or jewel tones'}
              </p>
            </div>

            {/* Men */}
            <div>
              <h4 className="font-['Playfair_Display',serif] text-base font-medium text-[#2E3C29]">
                {isArabic ? 'الرجال' : 'Men'}
              </h4>
              <p className="text-xs text-[#52634B] font-['Cormorant_Garamond',serif] mt-0.5">
                {isArabic
                  ? 'بدلة رسمية أو زي تقليدي أنيق'
                  : 'Suit or traditional formal wear'}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 8: PRE-WEDDING EVENTS (Exact match from video f_0048.jpg)
            ======================================================== */}
        <section className="relative z-10 py-10 px-6 text-center border-t border-[#E8DFC8]/60">
          <div className="w-10 h-10 rounded-full border border-[#B59A57]/60 flex items-center justify-center mx-auto mb-3 text-[#3A4A33] bg-[#FAF8F5]">
            <PartyPopper className="w-4 h-4 text-[#B59A57]" />
          </div>

          <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#3A4A33] tracking-wide mb-1">
            {isArabic ? 'الفعاليات التي تسبق الزفاف' : 'Pre-Wedding Events'}
          </h3>
          <div className="flex items-center justify-center gap-2 mb-6 opacity-70">
            <div className="w-10 h-[1px] bg-[#B59A57]" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
            <div className="w-10 h-[1px] bg-[#B59A57]" />
          </div>

          <div className="max-w-[320px] mx-auto space-y-6 text-center">
            {/* Mahendi */}
            <div>
              <h4 className="font-['Playfair_Display',serif] text-lg font-medium text-[#2E3C29]">
                {isArabic ? 'ليلة الحناء (ميهندي)' : 'Mahendi'}
              </h4>
              <p className="text-xs text-[#6B5A3E] font-['Cinzel',serif] tracking-wider mt-0.5">
                {isArabic ? '٢٨ نوفمبر ٢٠٢٦، ٨:٣٠ مساءً' : 'Nov 28, 2026, 8:30 PM'}
              </p>
              <p className="italic text-xs text-[#52634B] mt-0.5">
                {isArabic ? 'في منزل العروس' : "At Bride's House"}
              </p>
            </div>

            {/* Haldi */}
            <div>
              <h4 className="font-['Playfair_Display',serif] text-lg font-medium text-[#2E3C29]">
                {isArabic ? 'مراسم الهالدي' : 'Haldi'}
              </h4>
              <p className="text-xs text-[#6B5A3E] font-['Cinzel',serif] tracking-wider mt-0.5">
                {isArabic ? '٢٩ نوفمبر ٢٠٢٦، ٨:٠٠ مساءً' : 'Nov 29, 2026, 8:00 PM'}
              </p>
              <p className="italic text-xs text-[#52634B] mt-0.5">
                {isArabic ? 'في منزل العريس' : "At Groom's House"}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 9: INFORMATION CARDS (Transportation, Accommodation, Gifts)
            ======================================================== */}
        <section className="relative z-10 py-10 px-6 border-t border-[#E8DFC8]/60 text-center space-y-10">
          {/* 1. Transportation */}
          <div className="max-w-[340px] mx-auto">
            <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#3A4A33] tracking-wide mb-1">
              {isArabic ? 'المواصلات والنقل' : 'Transportation'}
            </h3>
            <div className="flex items-center justify-center gap-2 mb-3 opacity-70">
              <div className="w-8 h-[1px] bg-[#B59A57]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
              <div className="w-8 h-[1px] bg-[#B59A57]" />
            </div>
            <p className="text-xs md:text-sm text-[#52634B] leading-relaxed">
              {isArabic
                ? 'ستتوفر خدمة حافلات النقل الخاصة من وسط المدينة إلى مكان الحفل. نقطة التجمع: المحطة المركزية الساعة ٣:٣٠ عصراً.'
                : 'Shuttle service will be available from the city center to the venue. Pickup point: Central Station at 3:30 PM.'}
            </p>
          </div>

          {/* 2. Accommodation */}
          <div className="max-w-[340px] mx-auto">
            <div className="w-9 h-9 rounded-full border border-[#B59A57]/60 flex items-center justify-center mx-auto mb-2 text-[#3A4A33] bg-[#FAF8F5]">
              <Building2 className="w-4 h-4 text-[#B59A57]" />
            </div>
            <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#3A4A33] tracking-wide mb-1">
              {isArabic ? 'الإقامة الفندقية' : 'Accommodation'}
            </h3>
            <div className="flex items-center justify-center gap-2 mb-3 opacity-70">
              <div className="w-8 h-[1px] bg-[#B59A57]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
              <div className="w-8 h-[1px] bg-[#B59A57]" />
            </div>
            <p className="text-xs md:text-sm text-[#52634B] leading-relaxed">
              {isArabic
                ? 'أسعار خاصة لضيوفنا في فندق جراند بالاس (على بعد ٥ دقائق من الحفل). يرجى استخدام الرمز WEDDING2026 عند الحجز.'
                : 'Special rates at The Grand Palace Hotel (5 min from venue). Use code WEDDING2026 when booking.'}
            </p>
          </div>

          {/* 3. Gifts */}
          <div className="max-w-[340px] mx-auto">
            <div className="w-9 h-9 rounded-full border border-[#B59A57]/60 flex items-center justify-center mx-auto mb-2 text-[#3A4A33] bg-[#FAF8F5]">
              <Gift className="w-4 h-4 text-[#B59A57]" />
            </div>
            <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#3A4A33] tracking-wide mb-1">
              {isArabic ? 'الهدايا وجميل محبتكم' : 'Gifts'}
            </h3>
            <div className="flex items-center justify-center gap-2 mb-3 opacity-70">
              <div className="w-8 h-[1px] bg-[#B59A57]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
              <div className="w-8 h-[1px] bg-[#B59A57]" />
            </div>
            <p className="text-xs md:text-sm text-[#52634B] leading-relaxed">
              {isArabic
                ? 'محبتكم، دعواتكم الصادقة وحضوركم لمشاركتنا فرحتنا هي أثمن وأجمل هدية نتمناها.'
                : 'Your love, blessings and presence are the greatest gifts we could ever ask for.'}
            </p>
          </div>
        </section>

        {/* ========================================================
            SECTION 10: RSVP FORM (Exact fields from video f_0052.jpg)
            ======================================================== */}
        <section className="relative z-10 py-12 px-6 border-t border-[#E8DFC8]/60 text-center">
          <div className="w-10 h-10 rounded-full border border-[#B59A57]/60 flex items-center justify-center mx-auto mb-3 text-[#3A4A33] bg-[#FAF8F5]">
            <Mail className="w-4 h-4 text-[#B59A57]" />
          </div>

          <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-4xl md:text-5xl text-[#3A4A33] tracking-wide mb-1">
            {isArabic ? 'تأكيد الحضور (RSVP)' : 'RSVP'}
          </h3>
          <p className="text-xs text-[#7C6E5A] font-['Cinzel',serif] tracking-widest uppercase mb-1">
            {isArabic ? 'يرجى التكرم بالرد قبل ١٥ نوفمبر ٢٠٢٦' : 'Kindly reply by November 15, 2026'}
          </p>
          <div className="flex items-center justify-center gap-2 mb-6 opacity-70">
            <div className="w-10 h-[1px] bg-[#B59A57]" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
            <div className="w-10 h-[1px] bg-[#B59A57]" />
          </div>

          {rsvpSubmitted ? (
            <div className="max-w-[340px] mx-auto p-6 rounded-2xl bg-[#FAF8F5] border border-[#B59A57]/40 shadow-md">
              <CheckCircle2 className="w-10 h-10 text-[#3B4D36] mx-auto mb-2" />
              <h4 className="font-['Playfair_Display',serif] text-lg font-bold text-[#2A3725]">
                {isArabic ? 'شكراً جزيلاً لكم!' : 'Thank you!'}
              </h4>
              <p className="text-xs text-[#52634B] mt-1">
                {isArabic
                  ? 'تم استلام تأكيد حضوركم بكل سرور. نتطلع للاحتفال معكم!'
                  : 'Your RSVP has been joyfully received. We look forward to celebrating together!'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="max-w-[340px] mx-auto text-left space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[11px] font-['Cinzel',serif] tracking-wider uppercase text-[#544634] mb-1">
                  {isArabic ? 'الاسم الكريم *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder={isArabic ? 'الاسم الكامل' : 'Your full name'}
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
                  <option value="1">1 {isArabic ? 'ضيف' : 'Guest'}</option>
                  <option value="2">2 {isArabic ? 'ضيوف' : 'Guests'}</option>
                  <option value="3">3 {isArabic ? 'ضيوف' : 'Guests'}</option>
                  <option value="4">4 {isArabic ? 'ضيوف' : 'Guests'}</option>
                  <option value="5">5+ {isArabic ? 'ضيوف' : 'Guests'}</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-['Cinzel',serif] tracking-wider uppercase text-[#544634] mb-1">
                  {isArabic ? 'رسالتكم وتهنئتكم' : 'Your Message'}
                </label>
                <textarea
                  rows={3}
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder={isArabic ? 'أطيب الأمنيات والتبريكات...' : 'Write your wishes...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#C4A265]/40 text-sm text-[#2A3725] placeholder:text-[#9E9484] focus:outline-none focus:border-[#3B4D36] focus:ring-1 focus:ring-[#3B4D36] resize-none"
                />
              </div>

              {/* Submit Pill Button */}
              <button
                type="submit"
                disabled={rsvpLoading}
                className="w-full mt-2 py-3 px-6 rounded-full bg-[#2E3C29] text-[#FAF8F5] text-xs font-['Cinzel',serif] tracking-widest uppercase shadow-lg shadow-[#2E3C29]/25 hover:bg-[#232F1F] active:scale-95 transition-all flex items-center justify-center gap-2 border border-[#B59A57]/30 disabled:opacity-70"
              >
                {rsvpLoading ? (
                  <span>{isArabic ? 'جاري الإرسال...' : 'Sending...'}</span>
                ) : (
                  <span>{isArabic ? 'إرسال الرسالة' : 'Send Message'}</span>
                )}
              </button>
            </form>
          )}
        </section>

        {/* Footer Brand */}
        <footer className="text-center py-6 text-[10px] font-['Cinzel',serif] tracking-[0.2em] text-[#8C7E6A] uppercase opacity-75">
          © {new Date().getFullYear()} Zayn & Nora • Zareqia Haute Couture Wedding Suite
        </footer>
      </main>
    </div>
  );
};
