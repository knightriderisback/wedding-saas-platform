'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  PressedLoveTemplate,
  PRESSED_LOVE_TEMPLATES,
  TEMPLATE_LIST,
} from '@/lib/pressedLoveTemplates';
import { royalSitarAudio } from '@/lib/sitarSynth';
import { SUITE_CATEGORY_METAS, SUITE_METAS_LIST } from '@/lib/suiteCategoryMetas';
import { GatefoldEnvelope } from '@/components/guest/GatefoldEnvelope';
import { CanvasScratchCard } from '@/components/guest/CanvasScratchCard';
import { RosePetalShower } from '@/components/guest/RosePetalShower';
import { MilestoneSlider } from '@/components/guest/MilestoneSlider';
import { CoupleTrivia } from '@/components/guest/CoupleTrivia';
import { DjSongRequestBox } from '@/components/guest/DjSongRequestBox';
import { VoiceBlessingRecorder } from '@/components/guest/VoiceBlessingRecorder';
import { GuestRsvpForm } from '@/components/guest/GuestRsvpForm';
import { EstateBlueprintExplorer } from '@/components/guest/EstateBlueprintExplorer';
import { BotanicalHerbariumPicker } from '@/components/guest/BotanicalHerbariumPicker';
import { RivaBoatSchedule } from '@/components/guest/RivaBoatSchedule';
import { StoryMilestone } from '@/types/wedding';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ChevronDown,
  ExternalLink,
  Heart,
  Send,
  Hotel,
  Music,
  Share2,
  Compass,
  ArrowRight,
  ShieldCheck,
  QrCode,
  RotateCcw,
  Mic,
  LayoutGrid,
  X,
  Languages,
} from 'lucide-react';
import { INVITATION_TRANSLATIONS, InvitationLanguage } from '@/lib/invitationI18n';

interface PressedLoveInvitationProps {
  initialTemplate: PressedLoveTemplate;
  guestName?: string;
  autoOpen?: boolean;
  showCategorySwitcher?: boolean;
}

const defaultStoryMilestones: StoryMilestone[] = [
  {
    id: 'sm-1',
    year: '2021',
    title: 'First Glance at Marine Drive',
    description:
      'A chance collision over spilled filter coffee on a rainy Mumbai monsoon afternoon sparked a conversation that never ended.',
    imageUrl:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sm-2',
    year: '2023',
    title: 'A Spontaneous Trip to Udaipur',
    description:
      'Floating on Lake Pichola during twilight, Rohit made a quiet promise under the glowing City Palace lights.',
    imageUrl:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sm-3',
    year: '2026',
    title: 'The Sacred Roka Ceremony',
    description:
      'With both families uniting their hands and hearts with folded prayers, forever was sealed in presence of elders.',
    imageUrl:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
  },
];

export const PressedLoveInvitation: React.FC<PressedLoveInvitationProps> = ({
  initialTemplate,
  guestName = 'Special Guest',
  autoOpen = false,
  showCategorySwitcher = false,
}) => {
  const router = useRouter();
  const [template, setTemplate] = useState<PressedLoveTemplate>(initialTemplate);
  const [isOpened, setIsOpened] = useState(autoOpen);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [guestPassQr, setGuestPassQr] = useState<string | null>(null);
  const [showSuiteCatalogueModal, setShowSuiteCatalogueModal] = useState(false);
  const [language, setLanguage] = useState<InvitationLanguage>('en');

  const t = INVITATION_TRANSLATIONS[language];

  // RSVP Form State for Modal fallback
  const [rsvpAttendance, setRsvpAttendance] = useState<'attending' | 'declining'>('attending');
  const [rsvpName, setRsvpName] = useState(guestName !== 'Special Guest' ? guestName : '');
  const [rsvpDietary, setRsvpDietary] = useState('none');
  const [rsvpGuestsCount, setRsvpGuestsCount] = useState(1);
  const [rsvpSongRequest, setRsvpSongRequest] = useState('');

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Register HTML audio with royalSitarAudio and listen for global mute
  useEffect(() => {
    if (audioRef.current) {
      royalSitarAudio.registerHtmlAudio(audioRef.current);
    }
    const onMuteAll = () => {
      setIsPlayingMusic(false);
    };
    window.addEventListener('wedding-audio-mute-all', onMuteAll);
    return () => {
      window.removeEventListener('wedding-audio-mute-all', onMuteAll);
      royalSitarAudio.stopAll();
    };
  }, []);

  // Update countdown
  useEffect(() => {
    const target = new Date(template.ceremony.date + 'T' + template.ceremony.time + ':00Z').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [template]);

  // Audio control
  const toggleMusic = () => {
    if (isPlayingMusic) {
      royalSitarAudio.stopAll();
      setIsPlayingMusic(false);
    } else {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
      } else {
        royalSitarAudio.startAmbient();
        setIsPlayingMusic(true);
      }
    }
  };

  // Switch Template with clean audio cutoff
  const handleSelectTemplate = (newTmpl: PressedLoveTemplate) => {
    const wasPlaying = isPlayingMusic;
    royalSitarAudio.stopAll();
    setTemplate(newTmpl);
    if (audioRef.current) {
      audioRef.current.src = newTmpl.assets.backgroundMusic;
      if (wasPlaying) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
          }
        }, 150);
      }
    }
  };

  // Copy IBAN
  const handleCopyIban = () => {
    navigator.clipboard.writeText(template.gifts.iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2500);
  };

  // Submit RSVP in modal
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
    const passCode = `VIP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setGuestPassQr(passCode);

    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.6 },
      colors: [template.theme.colors.primary, template.theme.colors.accent, '#FAF8F5'],
    });
  };

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    template.couple.formalTitle
  )}&dates=${template.ceremony.date.replace(/-/g, '')}T${template.ceremony.time.replace(':', '')}00Z/${template.ceremony.date.replace(
    /-/g,
    ''
  )}T235900Z&details=${encodeURIComponent(
    `Wedding celebration of ${template.couple.partner1} & ${template.couple.partner2} at ${template.location.venueName}.`
  )}&location=${encodeURIComponent(template.location.venueName + ', ' + template.location.address)}`;

  return (
    <div
      className="min-h-screen transition-colors duration-700 relative selection:bg-[#d4a574]/30 bg-wedding-card-paper text-[#2C2218]"
      style={{
        backgroundColor: '#FAF5E8',
      }}
    >
      {/* Background Audio Tag */}
      <audio ref={audioRef} src={template.assets.backgroundMusic} loop preload="auto" />

      {/* Floating Rose Petals Shower Particle Canvas (Interactive) */}
      <RosePetalShower />

      {/* 3D ROYAL GATEFOLD BOXED ENVELOPE WITH WAX SEAL */}
      <GatefoldEnvelope
        guestName={guestName}
        partner1={template.couple.partner1}
        partner2={template.couple.partner2}
        venueCity={template.location.city + ', ' + template.location.country}
        isOpen={isOpened}
        themeStyle={template.id}
        waxColor={template.envelope?.waxColor || '#9B1C2E'}
        waxMonogram={template.envelope?.waxMonogram || template.couple.initials}
        introVideo={template.assets.introVideo}
        introVideoPoster={template.assets.introVideoPoster}
        onOpened={() => {
          setIsOpened(true);
          if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
          }
        }}
      />

      {/* ROYAL DUAL LANGUAGE SWITCHER (EN | हिन्दी) */}
      {isOpened && (
        <aside aria-label="Language Selector" className="fixed top-4 right-4 z-40">
          <div className="bg-[#FAF5E8]/95 backdrop-blur-md border border-[#D4AF37] rounded-full p-1 shadow-md flex items-center gap-1">
            <span className="pl-2 pr-1 text-[#7A1423] text-xs">
              <Languages className="w-3.5 h-3.5 inline" />
            </span>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#7A1423] text-white shadow-xs'
                  : 'text-[#544230] hover:text-[#7A1423]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                language === 'hi'
                  ? 'bg-[#7A1423] text-white shadow-xs'
                  : 'text-[#544230] hover:text-[#7A1423]'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </aside>
      )}

      {/* OPTIONAL CATEGORY SWITCHER (ONLY FOR ADMIN / DESIGN PREVIEW - STRICTLY HIDDEN FOR GUESTS) */}
      {showCategorySwitcher && (
        <>
          <aside aria-label="Template Designs" className="fixed top-3 left-1/2 -translate-x-1/2 z-40 max-w-full px-2 w-auto pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-md border border-[#E8DFC8] rounded-full p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-1.5 overflow-x-auto max-w-[96vw] sm:max-w-4xl no-scrollbar">
              <button
                onClick={() => setIsOpened(false)}
                className="px-2.5 py-1 rounded-full text-[11px] font-cinzel font-bold tracking-wider text-[#7D5F04] bg-[#FAF4E3] hover:bg-[#F3E5AB] border border-[#D4AF37]/40 flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                title="Replay 3D Wax Seal Unboxing"
              >
                <RotateCcw className="w-3 h-3 text-[#AA820A]" /> Replay Seal
              </button>

              <button
                onClick={() => setShowSuiteCatalogueModal(true)}
                className="px-2.5 py-1 rounded-full text-[11px] font-cinzel font-bold tracking-wider text-[#2C2218] bg-white hover:bg-[#FAF4E3] border border-[#E8DFC8] flex items-center gap-1 shrink-0 transition-colors shadow-2xs cursor-pointer"
                title="Open All 13 Suites Catalogue"
              >
                <LayoutGrid className="w-3 h-3 text-[#AA820A]" /> Catalogue (13)
              </button>

              <div className="h-4 w-px bg-[#E8DFC8] shrink-0 mx-0.5" />

              {TEMPLATE_LIST.map((tItem) => {
                const isActive = tItem.id === template.id;
                const meta = SUITE_CATEGORY_METAS[tItem.id];
                return (
                  <button
                    key={tItem.id}
                    onClick={() => handleSelectTemplate(tItem)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#AA820A] text-white shadow-xs'
                        : 'bg-[#FAF8F5] text-[#544230] hover:bg-[#FAF4E3] border border-[#E8DFC8]'
                    }`}
                  >
                    <span>{meta?.icon || '📜'}</span>
                    <span>{tItem.name}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        </>
      )}

      {/* Floating Audio Toggle Pill */}
      <aside aria-label="Audio Controls" className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleMusic}
          className="w-12 h-12 rounded-full bg-[#FAF5E8]/95 backdrop-blur-md border border-[#D4AF37] shadow-lg flex items-center justify-center text-[#403030] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          title={isPlayingMusic ? 'Mute Music' : 'Play Classical Music'}
        >
          {isPlayingMusic ? (
            <Volume2 className="w-5 h-5 text-[#AA820A] animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5 text-neutral-400" />
          )}
        </button>
      </aside>

      {/* FULL MICROSITE BODY — PURE AUTHENTIC INDIAN WEDDING CARD PAPER (ZERO CHECKS, ZERO FLOATING BOXES) */}
      <div
        className={`transition-all duration-1000 ease-out ${
          isOpened
            ? 'opacity-100 translate-y-0 filter-none pointer-events-auto'
            : 'opacity-0 translate-y-8 blur-xs pointer-events-none max-h-screen overflow-hidden'
        }`}
      >
        {/* ONE CONTINUOUS BESPOKE INDIAN WEDDING INVITATION CARD SHEET (FLAT ON PAPER, NO VERTICAL STRIP SHADOW) */}
        <div className="max-w-4xl mx-auto px-4 sm:px-12 py-10 sm:py-20 relative bg-wedding-card-paper">
          
          {/* Royal 24K Gold Foil Corner Filigree Accents */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/70 pointer-events-none" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/70 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/70 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/70 pointer-events-none" />

          {/* HERO SECTION — AUTHENTIC ROYAL VIVAH PROSE (CLEAR, HIGH CONTRAST & READABLE) */}
          <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 text-center border-b border-[#D4AF37]/30">
            {/* Auspicious Vedic Shloka Header */}
            <div className="text-center mb-6 space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm glitter-sparkle text-[#D4AF37]">✨</span>
                <span className="h-px w-10 sm:w-20 bg-[#D4AF37]/60" />
                <h3 className="font-serif text-base sm:text-xl font-bold tracking-[0.25em] text-[#7A1423] uppercase">
                  {t.shlokaHeader}
                </h3>
                <span className="h-px w-10 sm:w-20 bg-[#D4AF37]/60" />
                <span className="text-sm glitter-sparkle-delayed text-[#D4AF37]">✨</span>
              </div>
              <p className="font-serif italic text-xs sm:text-sm text-[#AA820A] font-medium">
                {t.shlokaMantra}
              </p>
            </div>

            {/* Clear, High-Contrast Invitation Announcement */}
            <p className="font-serif text-base sm:text-2xl text-[#3D2817] max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
              {t.announcementProse}
            </p>

            {/* Couple Calligraphy with 24K Molten Gold Shimmer & Sparkles */}
            <div className="relative py-2 my-2">
              <span className="absolute -top-3 left-1/4 text-sm glitter-sparkle text-[#D4AF37]">✦</span>
              <span className="absolute -bottom-2 right-1/4 text-sm glitter-sparkle-delayed text-[#D4AF37]">✦</span>
              <h1 className="font-pinyon text-6xl sm:text-8xl md:text-9xl text-gold-shimmer leading-none drop-shadow-sm">
                {template.couple.partner1} <br />
                <span className="text-4xl sm:text-6xl italic font-serif text-[#7A1423]">&</span>{' '}
                {template.couple.partner2}
              </h1>
            </div>

            {/* Venue Location on Paper (STRICTLY NO DATE HERE - RESERVED FOR SCRATCH CARD!) */}
            <div className="pt-3 flex items-center justify-center gap-2 text-base sm:text-lg font-serif text-[#544230]">
              <MapPin className="w-4 h-4 text-[#AA820A]" />
              <span className="font-serif font-bold text-[#3B2219]">
                {template.location.venueName}
              </span>
              <span>•</span>
              <span className="font-serif">{template.location.city}</span>
            </div>

            {/* Personalized Guest Inscription on Paper */}
            <div className="mt-8 pt-5 border-t border-[#D4AF37]/30 max-w-lg mx-auto">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold block mb-1">
                {t.guestInscribedLabel}
              </span>
              <p className="font-serif text-3xl sm:text-4xl text-[#2C1810] font-bold">
                {guestName}
              </p>
              <p className="font-serif italic text-base sm:text-lg text-[#8B6914] font-medium mt-2">
                {t.scratchPrompt}
              </p>
            </div>

            {/* Quick Action Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
              <button
                onClick={() => {
                  const el = document.getElementById('rsvp-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setShowRsvpModal(true);
                }}
                className="px-7 py-2.5 rounded-full text-white font-serif text-xs font-bold uppercase tracking-widest shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer bg-gradient-to-r from-[#9B1C2E] to-[#7A1423] border border-[#D4AF37]"
              >
                {t.rsvpButton}
              </button>
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full font-serif text-xs font-semibold uppercase tracking-wider border border-[#D4AF37]/70 hover:bg-[#FAF4E3] transition-all flex items-center gap-1.5 text-[#544230]"
              >
                <Calendar className="w-3.5 h-3.5 text-[#AA820A]" /> {t.calendarButton}
              </a>
            </div>
          </section>

          {/* GRAND ROYAL JHAROKHA 24K GOLD FOIL SCRATCH CARD (THE STAR OF THE SACRED REVEAL) */}
          <section className="py-12 sm:py-16 text-center border-b border-[#D4AF37]/30">
            <div className="space-y-1 mb-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm glitter-sparkle text-[#D4AF37]">✨</span>
                <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold">
                  {t.scratchSectionSubtitle}
                </span>
                <span className="text-sm glitter-sparkle-delayed text-[#D4AF37]">✨</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl text-[#2C2218] font-bold">
                {t.scratchSectionTitle}
              </h3>
              <p className="font-cormorant italic text-base sm:text-lg text-[#544230] max-w-md mx-auto">
                {t.scratchSectionDescription}
              </p>
            </div>

            <CanvasScratchCard
              weddingDateStr={template.ceremony.displayDate}
              venueStr={template.location.venueName + ', ' + template.location.city}
              language={language}
            />
          </section>

          {/* LIVE COUNTDOWN SECTION (ARCHIVAL LETTERPRESS NUMERALS ON CARD PAPER) */}
          <section className="py-10 text-center border-b border-[#D4AF37]/30">
            <span className="font-serif text-lg sm:text-2xl font-bold block text-[#7A1423] mb-3">
              {t.countdownTitle}
            </span>

            <div className="flex items-center justify-center gap-6 sm:gap-12 flex-wrap">
              {[
                { label: t.daysLabel, value: timeLeft.days },
                { label: t.hoursLabel, value: timeLeft.hours },
                { label: t.minutesLabel, value: timeLeft.minutes },
                { label: t.secondsLabel, value: timeLeft.seconds },
              ].map((unit, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="font-serif text-4xl sm:text-6xl font-bold text-[#2C2218] tracking-tight">
                    {String(unit.value).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-serif uppercase tracking-[0.2em] font-bold text-[#AA820A]">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="font-cormorant italic text-base sm:text-lg text-[#7D5F04] pt-3">
              {t.countdownDescription}
            </p>
          </section>

          {/* DESTINATION SANCTUARY / VENUE (ARCHIVAL WATERCOLOR PLATE ON CARD PAPER) */}
          <section className="py-12 border-b border-[#D4AF37]/30">
            <div className="text-center space-y-1 mb-6">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold block">
                {t.venueSubtitle}
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2218] font-bold">
                {template.location.venueName}
              </h2>
              <p className="font-cormorant italic text-lg sm:text-xl text-[#7D5F04]">
                {template.location.city}, {template.location.country}
              </p>
            </div>

            {/* Watercolor Venue Plate (Flat on Paper - Zero Shadows, Zero White Card Box) */}
            <div className="relative border-2 border-[#D4AF37]/60 p-2 sm:p-4 bg-transparent max-w-2xl mx-auto my-4">
              <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#AA820A]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#AA820A]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#AA820A]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#AA820A]" />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={template.assets.venueImage}
                alt={template.location.venueName}
                className="w-full h-auto max-h-[460px] object-contain mx-auto"
              />

              <div className="text-center pt-2">
                <span className="font-cormorant italic text-sm sm:text-base text-[#7D5F04] block">
                  {t.venuePlateLabel}
                </span>
              </div>
            </div>

            <p className="font-serif text-base sm:text-lg text-[#3D2817] leading-relaxed text-center max-w-2xl mx-auto pt-2">
              {template.location.description}
            </p>

            <div className="flex items-center justify-center pt-5">
              <a
                href={template.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full text-white font-serif text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 bg-[#7A1423] border border-[#D4AF37]"
              >
                <Compass className="w-4 h-4" /> {t.venueMapsButton}
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </section>

          {/* TEMPLATE-SPECIFIC EXCLUSIVE INTERACTION: BLUEPRINT (FOR THE VENUE) */}
          {template.id === 'the-venue' && (
            <section className="py-8 border-b border-[#D4AF37]/30">
              <EstateBlueprintExplorer />
            </section>
          )}

          {/* SHUBH VIVAH KARYAKRAM / SCHEDULE OF CELEBRATIONS */}
          <section className="py-12 border-b border-[#D4AF37]/30 space-y-8">
            <div className="text-center space-y-1">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold block">
                {t.programSubtitle}
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2218] font-bold">
                {t.programTitle}
              </h2>
              <p className="font-cormorant italic text-base sm:text-xl text-[#7D5F04]">
                {t.programDescription}
              </p>
            </div>

            {/* Timeline Spine on Paper */}
            <div className="relative border-l-2 border-[#D4AF37]/50 ml-4 sm:ml-12 pl-6 sm:pl-10 space-y-8">
              {t.programItems.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Decorative Golden Kalash / Dot pin */}
                  <div
                    className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full border-2 border-[#FAF5E8] shadow-sm transition-transform group-hover:scale-125 bg-[#7A1423]"
                  />

                  <div className="space-y-1">
                    <span className="text-xs font-serif uppercase tracking-wider font-bold text-[#AA820A] block">
                      ✦ {item.time}
                    </span>
                    <h3 className="font-serif text-xl sm:text-3xl text-[#2C2218] font-bold">
                      {item.title}
                    </h3>
                    <p className="font-serif text-base text-[#3D2817] leading-relaxed pt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TEMPLATE-SPECIFIC EXCLUSIVE INTERACTION: BOTANICAL HERBARIUM (FOR FLORAL) */}
          {template.id === 'floral' && (
            <section className="py-8 border-b border-[#D4AF37]/30">
              <BotanicalHerbariumPicker />
            </section>
          )}

          {/* ROMANTIC MILESTONES SLIDER ("HOW WE MET") */}
          <section className="py-12 border-b border-[#D4AF37]/30 space-y-6">
            <div className="text-center space-y-1">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold block">
                {language === 'en' ? '॥ HOW WE MET & MILESTONES ॥' : '॥ संग संग सातों जनम ॥'}
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl text-[#2C2218] font-bold">
                {language === 'en' ? 'How We Met & Milestones' : 'प्रेम के पावन पड़ाव'}
              </h3>
              <p className="font-cormorant italic text-base sm:text-lg text-[#7D5F04]">
                {language === 'en'
                  ? 'Every chapter written by destiny, celebrated with your blessings'
                  : 'भाग्य द्वारा रचित प्रत्येक सुंदर अध्याय, आपके शुभाशीष से परिपूर्ण'}
              </p>
            </div>
            <MilestoneSlider milestones={defaultStoryMilestones} language={language} />
          </section>

          {/* COUPLE TRIVIA CHALLENGE */}
          <section className="py-12 border-b border-[#D4AF37]/30 space-y-6">
            <div className="text-center space-y-1">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold block">
                {language === 'en' ? '॥ COUPLE TRIVIA & BANTER ॥' : '॥ हँसी-ख़ुशी के पल ॥'}
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl text-[#2C2218] font-bold">
                {language === 'en' ? 'The Couple Trivia Challenge' : 'हँसी-खुशी प्रश्नोत्तरी'}
              </h3>
              <p className="font-cormorant italic text-base sm:text-lg text-[#7D5F04]">
                {language === 'en'
                  ? `Test how well you know ${template.couple.partner1} & ${template.couple.partner2} before the party!`
                  : `विवाह से पूर्व देखें आप ${template.couple.partner1} और ${template.couple.partner2} को कितना जानते हैं!`}
              </p>
            </div>
            <CoupleTrivia coupleNames={`${template.couple.partner1} & ${template.couple.partner2}`} language={language} />
          </section>

          {/* SANGEET DJ DANCE FLOOR SONG REQUEST BOX */}
          <section className="py-12 border-b border-[#D4AF37]/30 space-y-6">
            <div className="text-center space-y-1">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold flex items-center justify-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-[#AA820A]" /> {t.djSubtitle}
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl text-[#2C2218] font-bold">
                {t.djTitle}
              </h3>
              <p className="font-cormorant italic text-base sm:text-lg text-[#7D5F04]">
                {t.djDescription}
              </p>
            </div>
            <DjSongRequestBox weddingSlug={template.slug} language={language} />
          </section>

          {/* AUDIO BLESSINGS & AASHIRWAD RECORDER */}
          <section className="py-12 border-b border-[#D4AF37]/30 space-y-6">
            <div className="text-center space-y-1">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold flex items-center justify-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-[#AA820A]" /> {t.voiceSubtitle}
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl text-[#2C2218] font-bold">
                {t.voiceTitle}
              </h3>
              <p className="font-cormorant italic text-base sm:text-lg text-[#7D5F04]">
                {t.voiceDescription}
              </p>
            </div>
            <VoiceBlessingRecorder weddingSlug={template.slug} language={language} />
          </section>

          {/* ACCOMMODATIONS & GUEST HOSPITALITY (शाही मेहमान नवाज़ी) */}
          <section className="py-12 border-b border-[#D4AF37]/30 space-y-8">
            <div className="text-center space-y-1">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold block">
                {t.accommodationSubtitle}
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2218] font-bold">
                {t.accommodationTitle}
              </h2>
              <p className="font-cormorant italic text-base sm:text-lg text-[#7D5F04]">
                {t.accommodationDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.hotels.map((hotel, idx) => (
                <div
                  key={idx}
                  className="p-6 border border-[#D4AF37]/50 bg-transparent flex flex-col justify-between relative"
                >
                  {/* Traditional Corner Accents */}
                  <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-[#D4AF37]" />
                  <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-[#D4AF37]" />
                  <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-[#D4AF37]" />
                  <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-[#D4AF37]" />

                  <div className="space-y-1">
                    <span className="text-xs font-serif uppercase tracking-wider text-[#AA820A] font-bold block">
                      ✦ {hotel.distance}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#2C2218] font-bold">
                      {hotel.name}
                    </h3>
                    <p className="text-sm text-[#4A321E] font-serif leading-relaxed">
                      {hotel.tier}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#D4AF37]/25 mt-4 flex items-center justify-between">
                    <span className="font-serif text-xs text-[#7A1423] font-bold uppercase">
                      {t.accommodationReservedLabel}
                    </span>
                    {hotel.bookingUrl && (
                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 rounded-full text-xs font-serif font-bold text-white uppercase tracking-wider flex items-center gap-1 hover:brightness-110 transition-all cursor-pointer bg-[#7A1423] border border-[#D4AF37]"
                      >
                        {t.accommodationViewStayButton} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TEMPLATE-SPECIFIC EXCLUSIVE INTERACTION: RIVA SPEEDBOAT (FOR COMO) */}
          {template.id === 'como' && (
            <section className="py-8 border-b border-[#D4AF37]/30">
              <RivaBoatSchedule />
            </section>
          )}

          {/* FREQUENTLY ASKED QUESTIONS */}
          <section className="py-12 border-b border-[#D4AF37]/30 space-y-6">
            <div className="text-center space-y-1">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold block">
                {t.faqSubtitle}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2218] font-bold">
                {t.faqTitle}
              </h2>
            </div>

            <div className="space-y-3">
              {t.faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border-b border-[#D4AF37]/30 transition-colors"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full py-4 text-left flex items-center justify-between font-serif text-lg sm:text-xl text-[#2C2218] font-bold cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#AA820A] shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="pb-4 pt-1 text-base text-[#4A321E] leading-relaxed font-serif">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* DIGITAL SHAGUN & WELL WISHES */}
          <section className="py-12 border-b border-[#D4AF37]/30 text-center space-y-4">
            <div className="space-y-1">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold block">
                {t.shagunSubtitle}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2218] font-bold">
                {t.shagunTitle}
              </h2>
              <p className="font-cormorant italic text-base sm:text-lg text-[#544230] max-w-lg mx-auto">
                {t.shagunDescription}
              </p>
            </div>

            <div className="p-6 sm:p-8 border border-[#D4AF37]/60 max-w-lg mx-auto space-y-4 bg-transparent relative">
              {/* Corner Filigrees */}
              <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]" />
              <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]" />
              <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]" />
              <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]" />

              <span className="text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold block">
                {t.shagunIbanLabel}
              </span>

              <div className="border border-[#D4AF37]/50 p-3 font-mono text-sm text-[#2C2218] flex items-center justify-between bg-transparent">
                <span className="truncate pr-2 font-bold">{template.gifts.iban}</span>
                <button
                  onClick={handleCopyIban}
                  className="px-3 py-1 border border-[#D4AF37] text-xs font-serif uppercase font-bold text-[#7A1423] hover:bg-[#FAF4E3] transition-colors shrink-0 cursor-pointer"
                  title="Copy IBAN / UPI"
                >
                  {copiedIban ? t.shagunCopiedButton : t.shagunCopyButton}
                </button>
              </div>

              <p className="text-xs text-[#7D5F04] font-serif italic">
                {t.shagunAccountHolderLabel}: {template.gifts.accountHolder}
              </p>
            </div>
          </section>

          {/* INTERACTIVE RSVP SECTION (विवाह आमंत्रण स्वीकृति) */}
          <section id="rsvp-section" className="py-14 space-y-6">
            <div className="text-center space-y-1">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold block">
                {t.rsvpSubtitle}
              </span>
              <h3 className="font-serif text-3xl sm:text-5xl text-[#2C2218] font-bold">
                {t.rsvpTitle}
              </h3>
              <p className="font-cormorant italic text-base sm:text-lg text-[#7D5F04]">
                {t.rsvpDescription}
              </p>
            </div>
            <GuestRsvpForm
              weddingSlug={template.slug}
              defaultGuestName={guestName !== 'Special Guest' ? guestName : ''}
              language={language}
            />
          </section>

          {/* FOOTER */}
          <footer className="border-t border-[#D4AF37]/30 pt-10 pb-6 text-center text-xs space-y-2">
            <p className="font-serif text-sm font-bold text-[#7A1423] tracking-widest uppercase">
              {t.footerShloka}
            </p>
            <p className="font-pinyon text-3xl sm:text-5xl text-[#2C2218] font-bold">
              {template.couple.partner1} & {template.couple.partner2}
            </p>
            <p className="font-serif text-sm text-[#7D5F04]">
              {t.footerFamilies}
            </p>
          </footer>
        </div>
      </div>

      {/* RSVP MODAL POPUP (SECONDARY ACCESS) */}
      {showRsvpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF5E8] max-w-md w-full p-6 sm:p-8 space-y-6 relative border-2 border-[#D4AF37] animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowRsvpModal(false)}
              className="absolute top-5 right-5 text-neutral-500 hover:text-black font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            {!rsvpSubmitted ? (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="font-serif text-xs uppercase tracking-widest text-[#7A1423] font-bold block">
                    {t.rsvpSubtitle}
                  </span>
                  <h3 className="font-serif text-2xl text-[#2C2218] font-bold">{t.rsvpTitle}</h3>
                  <p className="text-xs text-[#544230] font-serif">
                    {t.rsvpDescription}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold mb-1">
                      {t.rsvpNameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder={t.rsvpNamePlaceholder}
                      className="w-full bg-transparent border-0 border-b-2 border-[#D4AF37]/60 py-2 px-1 text-sm font-serif text-[#2C1810] focus:outline-none focus:border-[#7A1423]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold mb-1">
                      {language === 'en' ? 'Attendance' : 'उपस्थिति स्थिति'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRsvpAttendance('attending')}
                        className={`py-2 text-xs font-serif font-bold uppercase transition-all border cursor-pointer ${
                          rsvpAttendance === 'attending'
                            ? 'bg-[#7A1423] text-white border-[#7A1423]'
                            : 'bg-transparent text-[#544230] border-[#D4AF37]/50'
                        }`}
                      >
                        {t.rsvpAttendingOption}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpAttendance('declining')}
                        className={`py-2 text-xs font-serif font-bold uppercase transition-all border cursor-pointer ${
                          rsvpAttendance === 'declining'
                            ? 'bg-[#7A1423] text-white border-[#7A1423]'
                            : 'bg-transparent text-[#544230] border-[#D4AF37]/50'
                        }`}
                      >
                        {t.rsvpDecliningOption}
                      </button>
                    </div>
                  </div>

                  {rsvpAttendance === 'attending' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold mb-1">
                            {t.rsvpGuestCountLabel}
                          </label>
                          <select
                            value={rsvpGuestsCount}
                            onChange={(e) => setRsvpGuestsCount(Number(e.target.value))}
                            className="w-full bg-transparent border-0 border-b-2 border-[#D4AF37]/60 py-2 px-1 text-sm font-serif text-[#2C1810] focus:outline-none"
                          >
                            <option value={1}>1 Guest</option>
                            <option value={2}>2 Guests</option>
                            <option value={3}>3 Guests</option>
                            <option value={4}>4 Guests</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold mb-1">
                            {language === 'en' ? 'Dietary Choice' : 'खान-पान'}
                          </label>
                          <select
                            value={rsvpDietary}
                            onChange={(e) => setRsvpDietary(e.target.value)}
                            className="w-full bg-transparent border-0 border-b-2 border-[#D4AF37]/60 py-2 px-1 text-sm font-serif text-[#2C1810] focus:outline-none"
                          >
                            <option value="none">Pure Vegetarian</option>
                            <option value="jain">Jain / No Root</option>
                            <option value="vegan">Vegan</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold mb-1">
                          {t.djSongTitleLabel}
                        </label>
                        <input
                          type="text"
                          value={rsvpSongRequest}
                          onChange={(e) => setRsvpSongRequest(e.target.value)}
                          placeholder={t.djSongTitlePlaceholder}
                          className="w-full bg-transparent border-0 border-b-2 border-[#D4AF37]/60 py-2 px-1 text-sm font-serif text-[#2C1810] focus:outline-none focus:border-[#7A1423]"
                        />
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full text-white font-serif text-xs uppercase tracking-widest font-bold shadow-md hover:brightness-110 active:scale-95 transition-all mt-4 cursor-pointer bg-gradient-to-r from-[#9B1C2E] to-[#7A1423] border border-[#D4AF37]"
                >
                  {t.rsvpSubmitButton}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] text-[#7A1423] mx-auto flex items-center justify-center font-bold text-xl">
                  ✓
                </div>
                <h3 className="font-serif text-2xl text-[#2C2218] font-bold">{t.rsvpSuccessTitle}</h3>
                <p className="text-sm text-[#544230] leading-relaxed font-serif">
                  {t.rsvpSuccessSubtitle}
                </p>

                {/* VIP Boarding Pass Card */}
                <div className="p-4 border border-[#D4AF37] space-y-2 text-left bg-[#FAF5E8]">
                  <div className="flex justify-between items-center border-b border-[#D4AF37]/40 pb-2">
                    <span className="font-serif text-xs font-bold text-[#7A1423]">VIP ACCESS PASS</span>
                    <span className="font-mono text-xs text-[#7D5F04]">{guestPassQr}</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-serif font-bold text-base text-[#2C2218]">{rsvpName}</p>
                    <p className="text-[#544230] font-serif">{template.couple.formalTitle}</p>
                    <p className="text-[#544230] font-serif">{template.location.venueName} • {template.ceremony.displayDate}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowRsvpModal(false)}
                  className="px-6 py-2 rounded-full bg-[#7A1423] text-white font-serif text-xs uppercase tracking-wider font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
