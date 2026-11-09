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
} from 'lucide-react';

interface PressedLoveInvitationProps {
  initialTemplate: PressedLoveTemplate;
  guestName?: string;
  autoOpen?: boolean;
}

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

  // RSVP Form State
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

  // Listen for hashchange (#live)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#live') {
        setIsOpened(true);
      }
      const handleHashChange = () => {
        if (window.location.hash === '#live') {
          setIsOpened(true);
        }
      };
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
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

  // Open Envelope
  const handleOpenEnvelope = () => {
    setIsOpened(true);
    if (typeof window !== 'undefined' && window.location.hash !== '#live') {
      window.history.pushState(null, '', '#live');
    }

    // Try starting music
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }

    // Confetti
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: [template.theme.colors.primary, template.theme.colors.accent, '#FAF8F5'],
    });
  };

  // Copy IBAN
  const handleCopyIban = () => {
    navigator.clipboard.writeText(template.gifts.iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2500);
  };

  // Submit RSVP
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
    const passCode = `VIP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setGuestPassQr(passCode);

    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.5 },
      colors: [template.theme.colors.primary, template.theme.colors.accent, '#FFFFFF'],
    });
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
    // Update browser URL smoothly without hard refresh
    window.history.replaceState(null, '', `/${newTmpl.slug}#live`);
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

      {/* Floating Design / Template Switcher Bar (Always Available) */}
      <aside aria-label="Template Designs" className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-full px-2 w-auto pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-md border border-[#E8DFC8] rounded-full p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-1 overflow-x-auto max-w-[94vw] sm:max-w-xl">
          <span className="text-[10px] font-cinzel uppercase font-bold tracking-wider px-3 text-[#7D5F04] flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-[#AA820A]" /> Designs:
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

      {/* ENVELOPE UNBOXING INTRO OVERLAY */}
      {!isOpened && (
        <div className="fixed inset-0 z-50 bg-[#FAF7F2] flex items-center justify-center p-4">
          <div className="max-w-sm sm:max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-[#E8DFC8] text-center space-y-6 relative overflow-hidden animate-fade-in">
            {/* Soft decorative background glow */}
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: template.theme.colors.primary }}
            />

            <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold block">
              {template.badge}
            </span>

            {/* Simulated Wax Seal on Envelope */}
            <div className="relative mx-auto my-6 w-24 h-24 rounded-full flex items-center justify-center shadow-xl border-4 border-white cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              style={{ backgroundColor: template.envelope.waxColor }}
              onClick={handleOpenEnvelope}
            >
              <div className="w-18 h-18 rounded-full border border-white/40 flex items-center justify-center text-white font-cinzel text-xl font-bold tracking-widest shadow-inner">
                {template.envelope.waxMonogram}
              </div>
            </div>

            <div className="space-y-2">
              <h1 className={`${template.theme.fonts.script} text-4xl sm:text-5xl text-[#2C2218]`}>
                {template.couple.partner1} & {template.couple.partner2}
              </h1>
              <p className="font-cormorant italic text-sm text-[#7D5F04]">
                A bespoke digital invitation for <span className="font-bold underline decoration-[#AA820A]">{guestName}</span>
              </p>
            </div>

            <p className="text-xs text-[#544230] font-sans leading-relaxed">
              {template.tagline}
            </p>

            <button
              onClick={handleOpenEnvelope}
              className="w-full py-3.5 rounded-2xl text-white font-cinzel text-xs uppercase tracking-widest font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: template.theme.colors.primary }}
            >
              <Sparkles className="w-4 h-4" /> Open Invitation (Live Fullscreen)
            </button>
          </div>
        </div>
      )}

      {/* FULL MICROSITE BODY */}
      <div className={`transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-0'}`}>
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
                onClick={() => setShowRsvpModal(true)}
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

        {/* LIVE COUNTDOWN SECTION */}
        <section className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
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
                  className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px]"
                  style={{ backgroundColor: template.theme.colors.primary }}
                />

                <div className="bg-white/80 p-5 rounded-2xl border border-[#E8DFC8] shadow-sm hover:border-[#AA820A] transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-[#AA820A]">{item.time}</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#2C2218] mb-1">{item.title}</h3>
                  <p className="font-sans text-xs text-[#544230] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CURATED ACCOMMODATIONS */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div
            className="bg-white rounded-3xl p-8 sm:p-12 border shadow-sm space-y-6"
            style={{ borderColor: template.theme.colors.border }}
          >
            <div className="text-center space-y-2">
              <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold block">
                Stay & Travel
              </span>
              <h2 className={`${template.theme.fonts.display} text-3xl sm:text-4xl text-[#2C2218] font-medium`}>
                {template.accommodation.title}
              </h2>
              <p className="font-sans text-xs text-[#544230] max-w-lg mx-auto">
                {template.accommodation.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {template.accommodation.hotels.map((hotel, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-[#E8DFC8] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <span className="text-[10px] font-cinzel uppercase text-[#AA820A] font-bold block mb-1">
                      {hotel.distance}
                    </span>
                    <h3 className="font-serif text-base font-medium text-[#2C2218]">{hotel.name}</h3>
                    <p className="text-xs text-[#544230] font-sans mt-0.5">{hotel.tier}</p>
                  </div>

                  {hotel.bookingUrl && (
                    <a
                      href={hotel.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-cinzel uppercase tracking-wider text-[#7D5F04] font-bold hover:text-[#2C2218] flex items-center gap-1 pt-2 border-t border-[#E8DFC8]/60"
                    >
                      View Property <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GIFTS & HONEYMOON REGISTRY */}
        <section className="max-w-2xl mx-auto px-6 py-12 text-center space-y-6">
          <div
            className="bg-white rounded-3xl p-8 border shadow-sm space-y-4"
            style={{ borderColor: template.theme.colors.border }}
          >
            <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold block">
              Honeymoon Wishing Well
            </span>
            <h2 className={`${template.theme.fonts.display} text-3xl text-[#2C2218] font-medium`}>
              Registry & Blessings
            </h2>
            <p className="font-cormorant italic text-base text-[#544230] leading-relaxed">
              {template.gifts.message}
            </p>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFC8] text-left space-y-2 mt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#7D5F04] font-sans">Bank:</span>
                <span className="font-medium text-[#2C2218]">{template.gifts.bankName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#7D5F04] font-sans">Account:</span>
                <span className="font-medium text-[#2C2218]">{template.gifts.accountHolder}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-[#E8DFC8]/60">
                <span className="text-[#7D5F04] font-sans">IBAN:</span>
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#2C2218]">
                  <span>{template.gifts.iban}</span>
                  <button
                    onClick={handleCopyIban}
                    className="p-1 rounded hover:bg-[#FAF4E3] text-[#AA820A]"
                    title="Copy IBAN"
                  >
                    {copiedIban ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQS ACCORDION */}
        <section className="max-w-3xl mx-auto px-6 py-12 space-y-6">
          <div className="text-center space-y-2">
            <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold block">
              Questions & Details
            </span>
            <h2 className={`${template.theme.fonts.display} text-3xl text-[#2C2218] font-medium`}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {template.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-serif font-medium text-[#2C2218]"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#AA820A] transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs text-[#544230] leading-relaxed font-sans border-t border-[#FAF8F5]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM RSVP CALLOUT */}
        <section className="max-w-2xl mx-auto px-6 py-16 text-center space-y-6">
          <h2 className={`${template.theme.fonts.script} text-5xl sm:text-6xl text-[#2C2218]`}>
            Will you join us?
          </h2>
          <p className="font-cormorant italic text-lg text-[#7D5F04]">
            Kindly respond by July 1st, 2026 to ensure your seat at the celebration
          </p>
          <button
            onClick={() => setShowRsvpModal(true)}
            className="px-10 py-4 rounded-full text-white font-cinzel text-xs font-bold uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all"
            style={{ backgroundColor: template.theme.colors.primary }}
          >
            Submit Your RSVP
          </button>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#E8DFC8] py-8 text-center text-xs font-serif text-[#7D5F04] space-y-2">
          <p>
            {template.couple.partner1} & {template.couple.partner2} • {template.ceremony.displayDate}
          </p>
          <p className="text-[10px] text-neutral-400">
            Powered by ÉTERNITÉ Bespoke Wedding Invitation Engine
          </p>
        </footer>
      </div>

      {/* INTERACTIVE RSVP MODAL */}
      {showRsvpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E8DFC8] shadow-2xl relative animate-fade-in my-8">
            <button
              onClick={() => setShowRsvpModal(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-black font-sans text-xl"
            >
              ✕
            </button>

            {!rsvpSubmitted ? (
              <form onSubmit={handleRsvpSubmit} className="space-y-5">
                <div className="text-center space-y-1">
                  <span className="font-cinzel text-[10px] uppercase tracking-widest text-[#AA820A] font-bold">
                    RSVP Response
                  </span>
                  <h3 className="font-serif text-2xl text-[#2C2218]">
                    {template.couple.partner1} & {template.couple.partner2}
                  </h3>
                </div>

                {/* Attendance Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRsvpAttendance('attending')}
                    className={`p-3 rounded-2xl text-xs font-cinzel uppercase font-bold tracking-wider transition-all border ${
                      rsvpAttendance === 'attending'
                        ? 'bg-[#FAF4E3] border-[#AA820A] text-[#7D5F04] shadow-sm'
                        : 'bg-white border-[#E8DFC8] text-neutral-500 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    Joyfully Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpAttendance('declining')}
                    className={`p-3 rounded-2xl text-xs font-cinzel uppercase font-bold tracking-wider transition-all border ${
                      rsvpAttendance === 'declining'
                        ? 'bg-[#FDF2F4] border-[#B8283D] text-[#9B1C2E] shadow-sm'
                        : 'bg-white border-[#E8DFC8] text-neutral-500 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    Regretfully Decline
                  </button>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-bold mb-1">
                      Full Name
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
