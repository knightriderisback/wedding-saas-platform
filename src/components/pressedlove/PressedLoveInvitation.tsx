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
} from 'lucide-react';

interface PressedLoveInvitationProps {
  initialTemplate: PressedLoveTemplate;
  guestName?: string;
  autoOpen?: boolean;
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
    title: 'The Florence Proposal',
    description:
      'Under the golden Tuscan sunset on the banks of River Arno, Rohit bent the knee and Priya whispered the easiest "Yes" of her life.',
    imageUrl:
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sm-3',
    year: '2025',
    title: 'Roka & Family Blessings',
    description:
      'Surrounded by grandparents and cousins, two families became one over traditional sweets, dhol beats, and lifelong promises.',
    imageUrl:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sm-4',
    year: '2027',
    title: 'The Royal Vivah at Udaipur',
    description:
      'The beginning of forever amidst Lake Pichola, glowing oil lamps, and Vedic vows under the desert stars.',
    imageUrl:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
  },
];

export const PressedLoveInvitation: React.FC<PressedLoveInvitationProps> = ({
  initialTemplate,
  guestName = 'Special Guest',
  autoOpen = false,
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

  // RSVP Form State for Modal fallback
  const [rsvpAttendance, setRsvpAttendance] = useState<'attending' | 'declining'>('attending');
  const [rsvpName, setRsvpName] = useState(guestName !== 'Special Guest' ? guestName : '');
  const [rsvpDietary, setRsvpDietary] = useState('none');
  const [rsvpGuestsCount, setRsvpGuestsCount] = useState(1);
  const [rsvpHotelChoice, setRsvpHotelChoice] = useState('');
  const [rsvpSongRequest, setRsvpSongRequest] = useState('');

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

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
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
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
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  // Switch Template
  const handleSelectTemplate = (newTmpl: PressedLoveTemplate) => {
    setTemplate(newTmpl);
    if (audioRef.current) {
      audioRef.current.src = newTmpl.assets.backgroundMusic;
      if (isPlayingMusic) {
        audioRef.current.play().catch(() => {});
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
      className="min-h-screen text-[#403030] transition-colors duration-700 relative selection:bg-[#d4a574]/30"
      style={{
        backgroundColor: template.theme.colors.background,
        color: template.theme.colors.text,
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
        themeStyle={template.id as any}
        waxColor={template.envelope?.waxColor || '#9B1C2E'}
        onOpened={() => {
          setIsOpened(true);
          if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
          }
        }}
      />

      {/* Floating Design / Template Switcher Bar & Controls (Always Available) */}
      <aside aria-label="Template Designs" className="fixed top-4 left-1/2 -translate-x-1/2 z-40 max-w-full px-2 w-auto pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md border border-[#E8DFC8] rounded-full p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-1.5 overflow-x-auto max-w-[96vw] sm:max-w-2xl">
          <button
            onClick={() => setIsOpened(false)}
            className="px-2.5 py-1 rounded-full text-[11px] font-cinzel font-bold tracking-wider text-[#7D5F04] bg-[#FAF4E3] hover:bg-[#F3E5AB] border border-[#D4AF37]/40 flex items-center gap-1 shrink-0 transition-colors"
            title="Replay 3D Wax Seal Unboxing"
          >
            <RotateCcw className="w-3 h-3 text-[#AA820A]" /> Replay Seal
          </button>

          <span className="text-[10px] font-cinzel uppercase font-bold tracking-wider px-2 text-[#7D5F04] flex items-center gap-1 shrink-0 border-l border-[#E8DFC8]">
            <Sparkles className="w-3 h-3 text-[#AA820A]" /> Suites:
          </span>

          {TEMPLATE_LIST.map((t) => {
            const isActive = t.id === template.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTemplate(t)}
                className={`px-3 py-1 rounded-full text-xs transition-all shrink-0 font-medium ${
                  isActive
                    ? 'bg-[#2C2218] text-[#FAF8F5] shadow-sm font-semibold'
                    : 'text-[#544230] hover:bg-[#FAF4E3] hover:text-[#2C2218]'
                }`}
              >
                {t.name}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Floating Audio Toggle Pill */}
      <aside aria-label="Audio Controls" className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleMusic}
          className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-[#E8DFC8] shadow-lg flex items-center justify-center text-[#403030] hover:scale-105 active:scale-95 transition-transform"
          title={isPlayingMusic ? 'Mute Music' : 'Play Classical Music'}
        >
          {isPlayingMusic ? (
            <Volume2 className="w-5 h-5 text-[#AA820A] animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5 text-neutral-400" />
          )}
        </button>
      </aside>

      {/* FULL MICROSITE BODY (Strictly locked & hidden until 3D Wax Seal is broken) */}
      <div
        className={`transition-all duration-1000 ease-out ${
          isOpened
            ? 'opacity-100 translate-y-0 filter-none pointer-events-auto'
            : 'opacity-0 translate-y-8 blur-xs pointer-events-none max-h-screen overflow-hidden'
        }`}
      >
        {/* HERO SECTION */}
        <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center text-center px-6 py-20 overflow-hidden">
          {/* Hero Video or Hero Image */}
          {template.assets.heroVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={template.assets.heroVideoPoster || template.assets.heroImage}
              className="absolute inset-0 w-full h-full object-cover brightness-[0.72] scale-105 filter"
            >
              <source src={template.assets.heroVideo} type="video/mp4" />
              <source src={template.assets.heroVideo} type="video/webm" />
            </video>
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center brightness-[0.75]"
              style={{ backgroundImage: `url(${template.assets.heroImage || template.assets.venueImage})` }}
            />
          )}

          {/* Frosted / Dark Gradient Vignette for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-3xl mx-auto space-y-6 text-white px-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-cinzel uppercase tracking-[0.2em]">
              Save The Date
            </span>

            <h1 className={`${template.theme.fonts.script} text-6xl sm:text-8xl md:text-9xl text-[#FAF8F5] leading-none drop-shadow-lg`}>
              {template.couple.partner1} <br />
              <span className="text-4xl sm:text-6xl italic font-serif">&</span> {template.couple.partner2}
            </h1>

            <p className="font-cormorant italic text-lg sm:text-2xl text-white/90 max-w-xl mx-auto leading-relaxed drop-shadow">
              Together with their families, invite you to celebrate their wedding
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs sm:text-sm font-cinzel uppercase tracking-wider text-white/95">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#F3E5AB]" />
                {template.ceremony.displayDate}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#F3E5AB]" />
                {template.ceremony.displayTime}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#F3E5AB]" />
                {template.location.venueName}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <button
                onClick={() => {
                  const el = document.getElementById('rsvp-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setShowRsvpModal(true);
                }}
                className="px-8 py-3.5 rounded-full text-black font-cinzel text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all bg-[#FAF8F5] hover:bg-white"
              >
                RSVP Now
              </button>

              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full text-white font-cinzel text-xs font-semibold uppercase tracking-wider border border-white/50 backdrop-blur-md hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5" /> Add to Calendar
              </a>
            </div>
          </div>
        </section>

        {/* AUSPICIOUS MUHURAT GOLD-FOIL SCRATCH CARD */}
        <section className="max-w-2xl mx-auto px-6 py-12 text-center space-y-4">
          <div className="space-y-1">
            <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#AA820A]" /> Auspicious Muhurat Scratch Card
            </span>
            <h3 className={`${template.theme.fonts.display} text-2xl sm:text-3xl text-[#2C2218]`}>
              Scratch to Reveal the Sacred Date
            </h3>
            <p className="font-cormorant italic text-xs text-[#544230]">
              Rub the 24K gold foil gently with your finger or cursor to unveil the wedding lagna muhurat & celebratory confetti!
            </p>
          </div>
          <CanvasScratchCard
            weddingDateStr={template.ceremony.displayDate + ' • ' + template.ceremony.displayTime}
            venueStr={template.location.venueName + ', ' + template.location.city}
          />
        </section>

        {/* LIVE COUNTDOWN SECTION */}
        <section className="max-w-4xl mx-auto px-6 py-10 text-center space-y-6">
          <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold block">
            The Celebration Begins In
          </span>

          <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="bg-white/80 rounded-2xl p-4 sm:p-5 border shadow-sm flex flex-col items-center justify-center"
                style={{ borderColor: template.theme.colors.border }}
              >
                <span className="font-serif text-3xl sm:text-5xl font-light text-[#2C2218]">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-cinzel uppercase tracking-wider text-[#7D5F04] mt-1 font-bold">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* THE PLACE / VENUE SECTION (ARCHITECTURAL WATERCOLOR PAINTING) */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div
            className="bg-white rounded-3xl p-8 sm:p-12 border shadow-[0_15px_50px_rgba(0,0,0,0.04)] space-y-8"
            style={{ borderColor: template.theme.colors.border }}
          >
            <div className="text-center space-y-2">
              <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold block">
                The Destination
              </span>
              <h2 className={`${template.theme.fonts.display} text-3xl sm:text-5xl text-[#2C2218] font-medium`}>
                {template.location.venueName}
              </h2>
              <p className="font-cormorant italic text-base text-[#7D5F04]">
                {template.location.city}, {template.location.country}
              </p>
            </div>

            {/* Hand-drawn / Watercolor Venue Painting */}
            <div className="relative rounded-2xl overflow-hidden border border-[#E8DFC8] bg-[#FAF8F5] p-3 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={template.assets.venueImage}
                alt={template.location.venueName}
                className="w-full h-auto max-h-[460px] object-contain rounded-xl mx-auto transition-transform duration-700 hover:scale-102"
              />
            </div>

            <p className="font-cormorant italic text-base sm:text-lg text-[#544230] leading-relaxed text-center max-w-2xl mx-auto">
              {template.location.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href={template.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full text-white font-cinzel text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                style={{ backgroundColor: template.theme.colors.primary }}
              >
                <Compass className="w-4 h-4" /> Open in Google Maps
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>
        </section>

        {/* TEMPLATE-SPECIFIC EXCLUSIVE INTERACTION 1: ARCHITECTURAL BLUEPRINT (FOR THE VENUE) */}
        {template.id === 'the-venue' && (
          <section className="max-w-4xl mx-auto px-6 py-6">
            <EstateBlueprintExplorer />
          </section>
        )}

        {/* SCHEDULE OF THE DAY (ITINERARY TIMELINE) */}
        <section className="max-w-3xl mx-auto px-6 py-12 space-y-8">
          <div className="text-center space-y-2">
            <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold block">
              Day Programme
            </span>
            <h2 className={`${template.theme.fonts.display} text-3xl sm:text-4xl text-[#2C2218] font-medium`}>
              Schedule of Celebrations
            </h2>
          </div>

          <div className="relative border-l-2 border-[#E8DFC8] ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8">
            {template.program.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Dot / Pin on timeline */}
                <div
                  className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125"
                  style={{ backgroundColor: template.theme.colors.primary }}
                />

                <div className="space-y-1">
                  <span className="text-xs font-cinzel font-bold tracking-wider text-[#AA820A] block">
                    {item.time}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#2C2218] font-medium">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#544230] leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TEMPLATE-SPECIFIC EXCLUSIVE INTERACTION 2: BOTANICAL HERBARIUM PICKER (FOR FLORAL) */}
        {template.id === 'floral' && (
          <section className="max-w-4xl mx-auto px-6 py-6">
            <BotanicalHerbariumPicker />
          </section>
        )}

        {/* ROMANTIC MILESTONES SLIDER ("HOW WE MET") */}
        <section className="max-w-4xl mx-auto px-6 py-14 space-y-6">
          <div className="text-center space-y-1">
            <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold block">
              Our Journey
            </span>
            <h3 className={`${template.theme.fonts.display} text-3xl sm:text-4xl text-[#2C2218]`}>
              How We Met & Milestones
            </h3>
            <p className="font-cormorant italic text-sm text-[#7D5F04]">
              Every chapter written by destiny, celebrated with you
            </p>
          </div>
          <MilestoneSlider milestones={defaultStoryMilestones} />
        </section>

        {/* COUPLE TRIVIA QUIZ */}
        <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">
          <div className="text-center space-y-1">
            <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold block">
              Interactive Fun
            </span>
            <h3 className={`${template.theme.fonts.display} text-3xl sm:text-4xl text-[#2C2218]`}>
              The Couple Trivia Challenge
            </h3>
            <p className="font-cormorant italic text-sm text-[#7D5F04]">
              Test how well you know {template.couple.partner1} & {template.couple.partner2} before the party!
            </p>
          </div>
          <CoupleTrivia coupleNames={`${template.couple.partner1} & ${template.couple.partner2}`} />
        </section>

        {/* PRE-WEDDING DJ SONG REQUEST BOX */}
        <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">
          <div className="text-center space-y-1">
            <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold flex items-center justify-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-[#AA820A]" /> Sangeet Dance Floor Anthem
            </span>
            <h3 className={`${template.theme.fonts.display} text-3xl sm:text-4xl text-[#2C2218]`}>
              Pre-Wedding DJ Song Request
            </h3>
            <p className="font-cormorant italic text-sm text-[#7D5F04]">
              Submit your favorite dance track — directly routed to our DJ’s console and setlist!
            </p>
          </div>
          <DjSongRequestBox weddingSlug={template.slug} />
        </section>

        {/* VOICE BLESSING AUDIO RECORDER */}
        <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">
          <div className="text-center space-y-1">
            <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold flex items-center justify-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-[#AA820A]" /> Audio Wishing Well
            </span>
            <h3 className={`${template.theme.fonts.display} text-3xl sm:text-4xl text-[#2C2218]`}>
              Record a Voice Blessing
            </h3>
            <p className="font-cormorant italic text-sm text-[#7D5F04]">
              Speak your heartfelt blessings with your phone or PC microphone for the bride and groom
            </p>
          </div>
          <VoiceBlessingRecorder weddingSlug={template.slug} />
        </section>

        {/* ACCOMMODATIONS & TRAVEL RECOMMENDATIONS */}
        <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          <div className="text-center space-y-2">
            <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold block">
              Guest Accommodations
            </span>
            <h2 className={`${template.theme.fonts.display} text-3xl sm:text-4xl text-[#2C2218] font-medium`}>
              {template.accommodation.title}
            </h2>
            <p className="font-cormorant italic text-sm text-[#7D5F04]">
              {template.accommodation.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {template.accommodation.hotels.map((hotel, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between"
                style={{ borderColor: template.theme.colors.border }}
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-cinzel uppercase tracking-wider text-[#AA820A] font-bold block">
                    {hotel.distance}
                  </span>
                  <h3 className="font-serif text-2xl text-[#2C2218] font-semibold">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-[#544230] leading-relaxed">
                    {hotel.tier}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#FAF4E3] mt-4 flex items-center justify-between">
                  <span className="font-cinzel text-xs text-[#7D5F04] font-bold uppercase">
                    Partner Hotel
                  </span>
                  {hotel.bookingUrl && (
                    <a
                      href={hotel.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full text-xs font-cinzel font-bold text-white uppercase tracking-wider flex items-center gap-1 hover:brightness-110 transition-all"
                      style={{ backgroundColor: template.theme.colors.primary }}
                    >
                      View Map & Stay <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TEMPLATE-SPECIFIC EXCLUSIVE INTERACTION 3: RIVA SPEEDBOAT LAKE TRANSFERS (FOR COMO) */}
        {template.id === 'como' && (
          <section className="max-w-4xl mx-auto px-6 py-6">
            <RivaBoatSchedule />
          </section>
        )}

        {/* FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
        <section className="max-w-3xl mx-auto px-6 py-12 space-y-8">
          <div className="text-center space-y-2">
            <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold block">
              Guest Information
            </span>
            <h2 className={`${template.theme.fonts.display} text-3xl sm:text-4xl text-[#2C2218] font-medium`}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {template.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border transition-all overflow-hidden"
                  style={{ borderColor: template.theme.colors.border }}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between font-serif text-base text-[#2C2218] font-medium"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#7D5F04] transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs text-[#544230] leading-relaxed border-t border-[#FAF8F5]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* DIGITAL WISHING WELL & GIFTS */}
        <section className="max-w-2xl mx-auto px-6 py-12 text-center space-y-6">
          <div className="space-y-2">
            <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold block">
              With Gratitude
            </span>
            <h2 className={`${template.theme.fonts.display} text-3xl sm:text-4xl text-[#2C2218] font-medium`}>
              Wedding Registry & Well Wishes
            </h2>
            <p className="font-cormorant italic text-sm text-[#544230] max-w-md mx-auto">
              {template.gifts.message}
            </p>
          </div>

          <div
            className="bg-white rounded-3xl p-6 sm:p-8 border shadow-sm max-w-md mx-auto space-y-4"
            style={{ borderColor: template.theme.colors.border }}
          >
            <span className="text-[10px] font-cinzel uppercase tracking-wider text-[#7D5F04] font-bold block">
              Digital Shagun / Registry IBAN
            </span>

            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8DFC8] font-mono text-xs sm:text-sm text-[#2C2218] flex items-center justify-between">
              <span className="truncate pr-2">{template.gifts.iban}</span>
              <button
                onClick={handleCopyIban}
                className="p-1.5 rounded-lg bg-white border border-[#E8DFC8] text-[#7D5F04] hover:bg-[#FAF4E3] transition-colors shrink-0"
                title="Copy IBAN"
              >
                {copiedIban ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-neutral-400 font-sans">
              Account Holder: {template.gifts.accountHolder}
            </p>
          </div>
        </section>

        {/* INTERACTIVE RSVP SECTION WITH VIP QR ENTRY PASS */}
        <section id="rsvp-section" className="max-w-4xl mx-auto px-6 py-16 space-y-6">
          <div className="text-center space-y-1">
            <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold block">
              Kindly Respond
            </span>
            <h3 className={`${template.theme.fonts.display} text-3xl sm:text-4xl text-[#2C2218]`}>
              Reserve Your Royal Presence
            </h3>
            <p className="font-cormorant italic text-sm text-[#7D5F04]">
              Confirm your attendance to receive your Instant VIP Digital Entry Pass & QR Code
            </p>
          </div>
          <GuestRsvpForm
            weddingSlug={template.slug}
            defaultGuestName={guestName !== 'Special Guest' ? guestName : ''}
          />
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#E8DFC8] py-12 text-center text-xs space-y-3 bg-white/40">
          <p className="font-cinzel text-[11px] tracking-widest uppercase text-[#AA820A] font-bold">
            {template.couple.partner1} & {template.couple.partner2}
          </p>
          <p className="font-cormorant italic text-sm text-[#7D5F04]">
            Forever Begins Under the Stars • {template.ceremony.displayDate}
          </p>
          <p className="text-[10px] text-neutral-400 font-sans">
            Crafted with Ultra-Luxury Precision • PressedLove Couture Suite
          </p>
        </footer>
      </div>

      {/* RSVP MODAL POPUP (SECONDARY ACCESS) */}
      {showRsvpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative border border-[#E8DFC8] shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowRsvpModal(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-black font-bold text-lg"
            >
              ✕
            </button>

            {!rsvpSubmitted ? (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="font-cinzel text-[10px] uppercase tracking-widest text-[#7D5F04] font-bold block">
                    RSVP Confirmation
                  </span>
                  <h3 className="font-serif text-2xl text-[#2C2218]">Will You Join Us?</h3>
                  <p className="text-xs text-[#544230] font-sans">
                    Kindly respond before November 01, 2027
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-bold mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="e.g. Aditya Singhania"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFC8] text-sm focus:outline-none focus:border-[#AA820A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-bold mb-1">
                      Attendance Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRsvpAttendance('attending')}
                        className={`py-2.5 rounded-xl text-xs font-cinzel font-bold uppercase transition-all ${
                          rsvpAttendance === 'attending'
                            ? 'bg-[#2C2218] text-white shadow-sm'
                            : 'bg-[#FAF8F5] text-[#544230] border border-[#E8DFC8]'
                        }`}
                      >
                        Accept with Joy
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpAttendance('declining')}
                        className={`py-2.5 rounded-xl text-xs font-cinzel font-bold uppercase transition-all ${
                          rsvpAttendance === 'declining'
                            ? 'bg-[#2C2218] text-white shadow-sm'
                            : 'bg-[#FAF8F5] text-[#544230] border border-[#E8DFC8]'
                        }`}
                      >
                        Decline with Regret
                      </button>
                    </div>
                  </div>

                  {rsvpAttendance === 'attending' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-bold mb-1">
                            Total Guests
                          </label>
                          <select
                            value={rsvpGuestsCount}
                            onChange={(e) => setRsvpGuestsCount(Number(e.target.value))}
                            className="w-full px-3 py-2.5 rounded-xl border border-[#E8DFC8] text-sm focus:outline-none"
                          >
                            <option value={1}>1 Guest</option>
                            <option value={2}>2 Guests</option>
                            <option value={3}>3 Guests</option>
                            <option value={4}>4 Guests</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-bold mb-1">
                            Dietary Preference
                          </label>
                          <select
                            value={rsvpDietary}
                            onChange={(e) => setRsvpDietary(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-[#E8DFC8] text-sm focus:outline-none"
                          >
                            <option value="none">No Restrictions</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="vegan">Vegan</option>
                            <option value="gluten-free">Gluten Free</option>
                            <option value="jain">Jain / No Root</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-bold mb-1">
                          Song Request for Sangeet / DJ
                        </label>
                        <input
                          type="text"
                          value={rsvpSongRequest}
                          onChange={(e) => setRsvpSongRequest(e.target.value)}
                          placeholder="e.g. Gallan Goodiyaan, Kesariya"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFC8] text-sm focus:outline-none focus:border-[#AA820A]"
                        />
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl text-white font-cinzel text-xs uppercase tracking-widest font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all mt-4"
                  style={{ backgroundColor: template.theme.colors.primary }}
                >
                  Confirm & Generate Digital Pass
                </button>
              </form>
            ) : (
              <div className="text-center space-y-5 py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold text-xl">
                  ✓
                </div>
                <h3 className="font-serif text-2xl text-[#2C2218]">RSVP Confirmed</h3>
                <p className="text-xs text-[#544230] leading-relaxed font-sans">
                  Thank you, <span className="font-bold">{rsvpName}</span>! Your response has been recorded directly. Here is your VIP Digital Entry Pass:
                </p>

                {/* VIP Boarding Pass Card */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8DFC8] space-y-3 text-left">
                  <div className="flex justify-between items-center border-b border-[#E8DFC8] pb-2">
                    <span className="font-cinzel text-xs font-bold text-[#AA820A]">VIP ACCESS PASS</span>
                    <span className="font-mono text-xs text-neutral-400">{guestPassQr}</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-serif font-bold text-base text-[#2C2218]">{rsvpName}</p>
                    <p className="text-neutral-500 font-sans">{template.couple.formalTitle}</p>
                    <p className="text-neutral-500 font-sans">{template.location.venueName} • {template.ceremony.displayDate}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowRsvpModal(false)}
                  className="px-6 py-2.5 rounded-full bg-[#2C2218] text-white font-cinzel text-xs uppercase tracking-wider font-bold"
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
