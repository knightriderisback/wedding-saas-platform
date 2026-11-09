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
  Flame,
} from 'lucide-react';

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

  // Audio control - Unified silence fix
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

              {TEMPLATE_LIST.map((t) => {
                const isActive = t.id === template.id;
                const meta = SUITE_CATEGORY_METAS[t.id];
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTemplate(t)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black shadow-2xs font-bold'
                        : 'bg-[#FAF7F2] text-[#544230] hover:bg-[#FAF4E3] hover:text-[#2C2218] border border-[#E8DFC8]/60'
                    }`}
                  >
                    <span className="text-xs leading-none">{meta?.icon || '✨'}</span>
                    <span className="leading-none">{t.name}</span>
                    {meta?.badge && (
                      <span
                        className={`text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded-full font-black ${
                          isActive ? 'bg-black text-[#FAF4E3]' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {meta.badge.split(' ')[0]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* RAJHARA-STYLE SUITE CATALOGUE DRAWER MODAL */}
          {showSuiteCatalogueModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
              <div className="bg-[#FAF8F5] border border-[#E8DFC8] rounded-3xl max-w-4xl w-full p-5 sm:p-7 max-h-[90vh] overflow-y-auto shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-4 mb-5">
                  <div>
                    <span className="text-[10px] font-cinzel font-bold text-[#AA820A] uppercase tracking-widest block">
                      Rajhara Style Suite Showcase
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#2C2218] font-bold">
                      All 13 Haute Couture Wedding Suites (सभी डिज़ाइन्स)
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowSuiteCatalogueModal(false)}
                    className="p-2 rounded-full hover:bg-gray-200 text-gray-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SUITE_METAS_LIST.map((meta) => {
                    const isCurrent = meta.id === template.id;
                    return (
                      <div
                        key={meta.id}
                        className={`rounded-2xl border p-4 bg-gradient-to-br ${meta.gradientBg} ${meta.borderColor} flex flex-col justify-between transition-all hover:shadow-md`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{meta.icon}</span>
                            <span className={`text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full border ${meta.badgeColor}`}>
                              {meta.badge}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-base text-[#2C2218]">
                            {meta.name}
                          </h4>
                          <p className="text-[11px] font-cormorant italic text-[#7D5F04] mb-3">
                            {meta.hindiName}
                          </p>
                          <ul className="space-y-1 mb-4">
                            {meta.highlights.map((h, i) => (
                              <li key={i} className="text-[10px] text-[#544230] flex items-center gap-1.5">
                                <Check className="w-3 h-3 text-[#AA820A] shrink-0" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          onClick={() => {
                            const targetTemplate = PRESSED_LOVE_TEMPLATES[meta.id];
                            if (targetTemplate) {
                              handleSelectTemplate(targetTemplate);
                            }
                            setShowSuiteCatalogueModal(false);
                          }}
                          className={`w-full py-2 rounded-xl text-xs font-cinzel font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isCurrent
                              ? 'bg-[#AA820A] text-white shadow-xs'
                              : 'bg-white hover:bg-[#FAF4E3] text-[#2C2218] border border-[#E8DFC8]'
                          }`}
                        >
                          {isCurrent ? 'Active Suite' : 'Apply Suite'} <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

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

      {/* FULL MICROSITE BODY — PURE AUTHENTIC INDIAN WEDDING CARD PAPER (ZERO CHECKS, ZERO FLOATING BOXES) */}
      <div
        className={`transition-all duration-1000 ease-out ${
          isOpened
            ? 'opacity-100 translate-y-0 filter-none pointer-events-auto'
            : 'opacity-0 translate-y-8 blur-xs pointer-events-none max-h-screen overflow-hidden'
        }`}
      >
        {/* ONE CONTINUOUS BESPOKE INDIAN WEDDING INVITATION CARD SHEET */}
        <div className="max-w-4xl mx-auto px-4 sm:px-12 py-10 sm:py-20 border-x border-[#D4AF37]/35 relative bg-wedding-card-paper shadow-[0_0_80px_rgba(212,175,55,0.06)]">
          
          {/* Royal 24K Gold Foil Corner Filigree Accents */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/70 pointer-events-none" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/70 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/70 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/70 pointer-events-none" />

          {/* HERO SECTION — AUTHENTIC HANDWRITTEN ROYAL VIVAH PROSE (NO DATE HERE!) */}
          <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 text-center border-b border-[#D4AF37]/30">
            {/* Auspicious Vedic Shloka Header */}
            <div className="text-center mb-6 space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm glitter-sparkle text-[#D4AF37]">✨</span>
                <span className="h-px w-10 sm:w-20 bg-[#D4AF37]/60" />
                <h3 className="font-serif text-base sm:text-xl font-bold tracking-[0.25em] text-[#7A1423] uppercase">
                  ॥ ॐ श्री गणेशाय नमः ॥
                </h3>
                <span className="h-px w-10 sm:w-20 bg-[#D4AF37]/60" />
                <span className="text-sm glitter-sparkle-delayed text-[#D4AF37]">✨</span>
              </div>
              <p className="font-cormorant italic text-xs sm:text-sm text-[#AA820A]">
                वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
              </p>
            </div>

            {/* Handwritten Invitation Announcement */}
            <p className="font-pinyon text-2xl sm:text-3xl text-[#544230] max-w-xl mx-auto leading-relaxed mb-4">
              Together with the divine blessings of our ancestors, grandparents and parents, we cordially invite you to celebrate the holy wedding ceremonies of
            </p>

            {/* Couple Calligraphy with 24K Molten Gold Shimmer & Sparkles */}
            <div className="relative py-2 my-2">
              <span className="absolute -top-3 left-1/4 text-sm glitter-sparkle text-[#D4AF37]">✦</span>
              <span className="absolute -bottom-2 right-1/4 text-sm glitter-sparkle-delayed text-[#D4AF37]">✦</span>
              <h1 className="font-pinyon text-6xl sm:text-8xl md:text-9xl text-gold-shimmer leading-none drop-shadow-md">
                {template.couple.partner1} <br />
                <span className="text-4xl sm:text-6xl italic font-serif text-[#7A1423]">&</span>{' '}
                {template.couple.partner2}
              </h1>
            </div>

            {/* Venue Location on Paper (STRICTLY NO DATE HERE - RESERVED FOR SCRATCH CARD!) */}
            <div className="pt-3 flex items-center justify-center gap-2 text-sm sm:text-base font-cormorant italic text-[#544230]">
              <MapPin className="w-4 h-4 text-[#AA820A]" />
              <span className="font-serif font-bold text-[#3B2219]">
                {template.location.venueName}
              </span>
              <span>•</span>
              <span>{template.location.city}</span>
            </div>

            {/* Personalized Guest Inscription on Paper */}
            <div className="mt-8 pt-5 border-t border-[#D4AF37]/25 max-w-md mx-auto">
              <span className="font-cormorant italic text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold block mb-1">
                Specially Inscribed With Love For
              </span>
              <p className="font-pinyon text-3xl sm:text-4xl text-[#2C2218] font-bold">
                {guestName}
              </p>
              <p className="font-pinyon text-xl sm:text-2xl text-[#AA820A] mt-2">
                ✦ Scratch the sacred 24K gold foil below to unveil our auspicious wedding date & lagna muhurat ✦
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
                className="px-7 py-2.5 rounded-full text-white font-cinzel text-xs font-bold uppercase tracking-widest shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer bg-gradient-to-r from-[#9B1C2E] to-[#7A1423] border border-[#D4AF37]"
              >
                RSVP Response
              </button>
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full font-cinzel text-xs font-semibold uppercase tracking-wider border border-[#D4AF37]/70 hover:bg-[#FAF4E3] transition-all flex items-center gap-1.5 text-[#544230]"
              >
                <Calendar className="w-3.5 h-3.5 text-[#AA820A]" /> Add to Calendar
              </a>
            </div>
          </section>

          {/* GRAND ROYAL JHAROKHA 24K GOLD FOIL SCRATCH CARD (THE STAR OF THE SACRED REVEAL) */}
          <section className="py-12 sm:py-16 text-center border-b border-[#D4AF37]/30">
            <div className="space-y-1 mb-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm glitter-sparkle text-[#D4AF37]">✨</span>
                <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold">
                  ॥ पवित्र लग्न मुहूर्त पत्रिका ॥
                </span>
                <span className="text-sm glitter-sparkle-delayed text-[#D4AF37]">✨</span>
              </div>
              <h3 className="font-pinyon text-4xl sm:text-5xl text-[#2C2218] font-bold text-gold-shimmer">
                Rub The 24K Gold Foil To Unveil The Sacred Date
              </h3>
              <p className="font-pinyon text-xl sm:text-2xl text-[#544230] max-w-md mx-auto">
                Gently glide your finger or cursor over the gold leaf to reveal our wedding muhurat & blessings
              </p>
            </div>

            <CanvasScratchCard
              weddingDateStr={template.ceremony.displayDate}
              venueStr={template.location.venueName + ', ' + template.location.city}
            />
          </section>

          {/* LIVE COUNTDOWN SECTION (ARCHIVAL LETTERPRESS NUMERALS ON CARD PAPER) */}
          <section className="py-10 text-center border-b border-[#D4AF37]/30">
            <span className="font-pinyon text-2xl sm:text-3xl font-bold block text-[#7A1423] mb-3">
              ✦ The Auspicious Celebrations Commence In ✦
            </span>

            <div className="flex items-center justify-center gap-5 sm:gap-10 flex-wrap">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map((unit, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="font-pinyon text-4xl sm:text-6xl font-bold text-[#2C2218] tracking-tight">
                    {String(unit.value).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] font-bold text-[#AA820A]">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="font-pinyon text-lg text-[#7D5F04] pt-3">
              Every ticking second brings us closer to the sacred Saat Phere and lifelong union
            </p>
          </section>

          {/* DESTINATION SANCTUARY / VENUE (ARCHIVAL WATERCOLOR PLATE ON CARD PAPER) */}
          <section className="py-12 border-b border-[#D4AF37]/30">
            <div className="text-center space-y-1 mb-6">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold block">
                ॥ शुभ विवाह स्थल एवं मंडप ॥
              </span>
              <h2 className="font-pinyon text-4xl sm:text-6xl text-[#2C2218] font-bold text-gold-shimmer">
                {template.location.venueName}
              </h2>
              <p className="font-pinyon text-2xl text-[#7D5F04]">
                {template.location.city}, {template.location.country}
              </p>
            </div>

            {/* Watercolor Venue Plate */}
            <div className="relative border-2 border-[#D4AF37]/60 p-2 sm:p-4 bg-white/40 shadow-inner rounded-sm max-w-2xl mx-auto my-4">
              <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#AA820A]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#AA820A]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#AA820A]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#AA820A]" />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={template.assets.venueImage}
                alt={template.location.venueName}
                className="w-full h-auto max-h-[460px] object-contain rounded-xs mx-auto"
              />

              <div className="text-center pt-2">
                <span className="font-pinyon text-lg text-[#7D5F04] block">
                  Plate I — Architectural watercolor view of the estate and mandap grounds
                </span>
              </div>
            </div>

            <p className="font-cormorant italic text-base sm:text-lg text-[#544230] leading-relaxed text-center max-w-2xl mx-auto pt-2">
              {template.location.description}
            </p>

            <div className="flex items-center justify-center pt-5">
              <a
                href={template.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full text-white font-cinzel text-xs uppercase tracking-wider font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 bg-[#7A1423] border border-[#D4AF37]"
              >
                <Compass className="w-4 h-4" /> Open In Google Maps
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
                ॥ मांगलिक कार्यक्रम सारिणी ॥
              </span>
              <h2 className="font-pinyon text-4xl sm:text-6xl text-[#2C2218] font-bold text-gold-shimmer">
                Schedule of Celebrations
              </h2>
              <p className="font-pinyon text-xl sm:text-2xl text-[#7D5F04]">
                Auspicious Vedic rituals, royal feasts, and starlit Sangeet celebrations
              </p>
            </div>

            <div className="relative border-l-2 border-[#D4AF37]/50 ml-4 sm:ml-12 pl-6 sm:pl-10 space-y-8">
              {template.program.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Decorative Golden Kalash / Dot pin */}
                  <div
                    className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125 bg-[#7A1423]"
                  />

                  <div className="space-y-0.5">
                    <span className="text-xs font-cormorant italic font-bold tracking-wider text-[#AA820A] block">
                      ✦ {item.time}
                    </span>
                    <h3 className="font-pinyon text-2xl sm:text-4xl text-[#2C2218] font-bold">
                      {item.title}
                    </h3>
                    <p className="font-cormorant italic text-sm text-[#544230] leading-relaxed pt-0.5">
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
                ॥ संग संग सातों जनम ॥
              </span>
              <h3 className="font-pinyon text-4xl sm:text-5xl text-[#2C2218] font-bold text-gold-shimmer">
                How We Met & Milestones
              </h3>
              <p className="font-pinyon text-xl sm:text-2xl text-[#7D5F04]">
                Every chapter written by destiny, celebrated with your blessings
              </p>
            </div>
            <MilestoneSlider milestones={defaultStoryMilestones} />
          </section>

          {/* COUPLE TRIVIA CHALLENGE */}
          <section className="py-12 border-b border-[#D4AF37]/30 space-y-6">
            <div className="text-center space-y-1">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold block">
                ॥ हँसी-ख़ुशी के पल ॥
              </span>
              <h3 className="font-pinyon text-4xl sm:text-5xl text-[#2C2218] font-bold text-gold-shimmer">
                The Couple Trivia Challenge
              </h3>
              <p className="font-pinyon text-xl sm:text-2xl text-[#7D5F04]">
                Test how well you know {template.couple.partner1} & {template.couple.partner2} before the party!
              </p>
            </div>
            <CoupleTrivia coupleNames={`${template.couple.partner1} & ${template.couple.partner2}`} />
          </section>

          {/* SANGEET DJ DANCE FLOOR SONG REQUEST BOX */}
          <section className="py-12 border-b border-[#D4AF37]/30 space-y-6">
            <div className="text-center space-y-1">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold flex items-center justify-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-[#AA820A]" /> संगीत डांस फ्लोर फरमाइश
              </span>
              <h3 className="font-pinyon text-4xl sm:text-5xl text-[#2C2218] font-bold text-gold-shimmer">
                Pre-Wedding DJ Song Request
              </h3>
              <p className="font-pinyon text-xl sm:text-2xl text-[#7D5F04]">
                Submit your favorite Bollywood or Bhangra track — routed directly to our DJ console!
              </p>
            </div>
            <DjSongRequestBox weddingSlug={template.slug} />
          </section>

          {/* AUDIO BLESSINGS & AASHIRWAD RECORDER */}
          <section className="py-12 border-b border-[#D4AF37]/30 space-y-6">
            <div className="text-center space-y-1">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold flex items-center justify-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-[#AA820A]" /> ऑडियो शुभकामनाएँ एवं आशीर्वाद
              </span>
              <h3 className="font-pinyon text-4xl sm:text-5xl text-[#2C2218] font-bold text-gold-shimmer">
                Record a Voice Blessing
              </h3>
              <p className="font-pinyon text-xl sm:text-2xl text-[#7D5F04]">
                Inscribe your heartfelt voice blessings for the bride & groom to cherish for lifetimes
              </p>
            </div>
            <VoiceBlessingRecorder weddingSlug={template.slug} />
          </section>

          {/* ACCOMMODATIONS & GUEST HOSPITALITY (शाही मेहमान नवाज़ी) */}
          <section className="py-12 border-b border-[#D4AF37]/30 space-y-8">
            <div className="text-center space-y-1">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold block">
                ॥ शाही मेहमान नवाज़ी ॥
              </span>
              <h2 className="font-pinyon text-4xl sm:text-5xl text-[#2C2218] font-bold text-gold-shimmer">
                {template.accommodation.title}
              </h2>
              <p className="font-pinyon text-xl sm:text-2xl text-[#7D5F04]">
                {template.accommodation.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {template.accommodation.hotels.map((hotel, idx) => (
                <div
                  key={idx}
                  className="p-6 border border-[#D4AF37]/40 bg-[#FAF4E3]/40 rounded-xl flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-cormorant italic text-[#AA820A] font-bold block">
                      ✦ {hotel.distance}
                    </span>
                    <h3 className="font-pinyon text-2xl sm:text-3xl text-[#2C2218] font-bold">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-[#544230] leading-relaxed font-cormorant italic">
                      {hotel.tier}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#D4AF37]/20 mt-4 flex items-center justify-between">
                    <span className="font-serif text-xs text-[#7A1423] font-bold uppercase">
                      Reserved Quarters
                    </span>
                    {hotel.bookingUrl && (
                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 rounded-full text-xs font-cinzel font-bold text-white uppercase tracking-wider flex items-center gap-1 hover:brightness-110 transition-all cursor-pointer bg-[#7A1423]"
                      >
                        View Stay <ExternalLink className="w-3 h-3" />
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
                ॥ विवाह संबंधी आवश्यक जानकारी ॥
              </span>
              <h2 className="font-pinyon text-4xl sm:text-5xl text-[#2C2218] font-bold text-gold-shimmer">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {template.faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border-b border-[#D4AF37]/30 transition-colors"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full py-4 text-left flex items-center justify-between font-pinyon text-2xl text-[#2C2218] font-bold cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#AA820A] shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="pb-4 pt-1 text-sm text-[#544230] leading-relaxed font-cormorant italic">
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
                ॥ शुभ शगुन एवं आशीर्वाद ॥
              </span>
              <h2 className="font-pinyon text-4xl sm:text-5xl text-[#2C2218] font-bold text-gold-shimmer">
                Wedding Registry & Shagun
              </h2>
              <p className="font-pinyon text-xl sm:text-2xl text-[#544230] max-w-md mx-auto">
                {template.gifts.message}
              </p>
            </div>

            <div className="p-6 border border-[#D4AF37]/50 max-w-md mx-auto space-y-3 bg-[#FAF4E3]/40 rounded-xl">
              <span className="text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold block">
                Digital Shagun / Registry IBAN
              </span>

              <div className="bg-white/80 p-3 rounded-lg border border-[#D4AF37]/40 font-mono text-xs sm:text-sm text-[#2C2218] flex items-center justify-between">
                <span className="truncate pr-2">{template.gifts.iban}</span>
                <button
                  onClick={handleCopyIban}
                  className="p-1.5 rounded-lg bg-[#FAF4E3] border border-[#D4AF37]/40 text-[#7D5F04] hover:bg-[#F3E5AB] transition-colors shrink-0 cursor-pointer"
                  title="Copy IBAN"
                >
                  {copiedIban ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-xs text-[#7D5F04] font-cormorant italic">
                Account Holder: {template.gifts.accountHolder}
              </p>
            </div>
          </section>

          {/* INTERACTIVE RSVP SECTION (विवाह आमंत्रण स्वीकृति) */}
          <section id="rsvp-section" className="py-14 space-y-6">
            <div className="text-center space-y-1">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#7A1423] font-bold block">
                ॥ विवाह आमंत्रण स्वीकृति ॥
              </span>
              <h3 className="font-pinyon text-4xl sm:text-6xl text-[#2C2218] font-bold text-gold-shimmer">
                Reserve Your Royal Presence
              </h3>
              <p className="font-pinyon text-xl sm:text-2xl text-[#7D5F04]">
                Confirm your attendance with folded hands to receive your VIP Digital Entry Pass
              </p>
            </div>
            <GuestRsvpForm
              weddingSlug={template.slug}
              defaultGuestName={guestName !== 'Special Guest' ? guestName : ''}
            />
          </section>

          {/* FOOTER */}
          <footer className="border-t border-[#D4AF37]/30 pt-10 pb-6 text-center text-xs space-y-2">
            <p className="font-serif text-sm font-bold text-[#7A1423] tracking-widest uppercase">
              ॥ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ॥
            </p>
            <p className="font-pinyon text-3xl sm:text-4xl text-[#2C2218] font-bold">
              {template.couple.partner1} & {template.couple.partner2}
            </p>
            <p className="font-pinyon text-xl text-[#7D5F04]">
              Forever Begins Under The Sacred Stars • With Love From Sharma & Mehra Families
            </p>
          </footer>
        </div>
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
