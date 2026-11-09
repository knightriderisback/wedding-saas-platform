'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { WeddingProject, EventScheduleItem } from '@/types/wedding';
import { getWeddingProject } from '@/lib/firebase';
import { defaultWeddingProject } from '@/lib/mockData';
import { GatefoldEnvelope } from '@/components/guest/GatefoldEnvelope';
import { CanvasScratchCard } from '@/components/guest/CanvasScratchCard';
import { RosePetalShower } from '@/components/guest/RosePetalShower';
import { MilestoneSlider } from '@/components/guest/MilestoneSlider';
import { CoupleTrivia } from '@/components/guest/CoupleTrivia';
import { DjSongRequestBox } from '@/components/guest/DjSongRequestBox';
import { VoiceBlessingRecorder } from '@/components/guest/VoiceBlessingRecorder';
import { GuestRsvpForm } from '@/components/guest/GuestRsvpForm';
import { royalSitarAudio } from '@/lib/sitarSynth';
import { PRESSED_LOVE_TEMPLATES } from '@/lib/pressedLoveTemplates';
import { PressedLoveInvitation } from '@/components/pressedlove/PressedLoveInvitation';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  ExternalLink,
  Utensils,
  Share2,
  Music,
  Check,
  RotateCcw,
  Send,
  Camera,
  Navigation,
} from 'lucide-react';

function LuxuryGuestMicrositeContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.weddingSlug as string) || 'rohit-weds-priya';
  const guestQuery = searchParams.get('guest') || 'Special Guest';

  const requestedTemplate = searchParams.get('template');
  const isPressedLove = slug.startsWith('wedding-invitation-') || !!requestedTemplate;

  if (isPressedLove) {
    const templateKey = slug.startsWith('wedding-invitation-')
      ? slug.replace('wedding-invitation-', '')
      : (requestedTemplate || 'the-venue');
    const template = PRESSED_LOVE_TEMPLATES[templateKey] || PRESSED_LOVE_TEMPLATES['the-venue'];
    return (
      <PressedLoveInvitation
        initialTemplate={template}
        guestName={guestQuery}
        autoOpen={false}
        showCategorySwitcher={false}
      />
    );
  }

  const [project, setProject] = useState<WeddingProject | null>(null);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Wishing Well Local Ledger
  const [wishes, setWishes] = useState([
    {
      id: 'w-1',
      author: 'Dadi Shanti Sharma',
      relation: 'Groom’s Grandmother',
      message: 'May Lord Ganesha shower you both with boundless health, laughter, and seven lifetimes of togetherness.',
      time: 'Yesterday at Udaipur',
    },
    {
      id: 'w-2',
      author: 'Aditya & Ananya Singhania',
      relation: 'Childhood Friends',
      message: 'Still can’t believe our college squad is officially getting married! Lake Pichola won’t know what hit it when the Sangeet starts!',
      time: '2 days ago',
    },
  ]);
  const [newWishAuthor, setNewWishAuthor] = useState(guestQuery);
  const [newWishMessage, setNewWishMessage] = useState('');
  const [wishSent, setWishSent] = useState(false);

  // Dynamic Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await getWeddingProject(slug);
      setProject(data || defaultWeddingProject);
    };
    loadData();
  }, [slug]);

  useEffect(() => {
    if (!project) return;
    const target = new Date(project.weddingDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#7D5F04] flex items-center justify-center font-cinzel text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2 text-[#D4AF37]" />
        Unfolding Auspicious Palace Suite...
      </div>
    );
  }

  const handleToggleAudio = () => {
    const active = royalSitarAudio.toggle();
    setIsAudioPlaying(active);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishMessage.trim()) return;

    setWishes([
      {
        id: `w-${Date.now()}`,
        author: newWishAuthor.trim() || 'Honored Guest',
        relation: 'Wedding Guest',
        message: newWishMessage.trim(),
        time: 'Just now',
      },
      ...wishes,
    ]);

    setNewWishMessage('');
    setWishSent(true);
    setTimeout(() => setWishSent(false), 3500);
  };

  const getGoogleCalendarLink = (event: EventScheduleItem) => {
    const title = encodeURIComponent(`${project.partner1} & ${project.partner2} - ${event.title}`);
    const details = encodeURIComponent(`${event.subtitle}\n\nDress Code: ${event.dressCode}\n${event.dressCodeDetails}`);
    const location = encodeURIComponent(`${event.venue}, ${event.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  // Color themes for events
  const getEventCardStyle = (idx: number) => {
    switch (idx) {
      case 0: // Haldi
        return {
          badge: 'bg-[#FEF9E7] text-[#AA820A] border-[#F9CA24]',
          border: 'border-[#F9CA24]/40 hover:border-[#F39C12]',
          tag: 'Haldi & Phoolon Ki Holi',
        };
      case 1: // Mehendi / Sangeet
        return {
          badge: 'bg-[#F1F6F3] text-[#557A65] border-[#99B8A5]',
          border: 'border-[#99B8A5]/40 hover:border-[#739B83]',
          tag: 'Royal Mehendi & Sangeet',
        };
      case 2: // Pheras / Vows
        return {
          badge: 'bg-[#FDF2F4] text-[#9B1C2E] border-[#B8283D]',
          border: 'border-[#9B1C2E]/40 hover:border-[#7A1423]',
          tag: 'The Sacred Pheras & Vows',
        };
      case 3: // Reception
      default:
        return {
          badge: 'bg-[#FAF4E3] text-[#7D5F04] border-[#D4AF37]',
          border: 'border-[#D4AF37]/40 hover:border-[#AA820A]',
          tag: 'Imperial Gala Reception',
        };
    }
  };

  return (
    <div className="relative min-h-screen bg-wedding-card-paper text-[#2C2218] pb-28 selection:bg-[#D4AF37]/30 selection:text-[#2C2218]">
      {/* 3D Royal Boxed Envelope Unboxing Experience */}
      <GatefoldEnvelope
        guestName={guestQuery}
        partner1={project.partner1}
        partner2={project.partner2}
        venueCity={project.venue.city}
        isOpen={envelopeOpened}
        onOpened={() => {
          setEnvelopeOpened(true);
          setIsAudioPlaying(true);
        }}
      />

      {/* FULL MICROSITE BODY (Strictly locked & hidden until 3D Wax Seal is broken) */}
      <div
        className={`transition-all duration-1000 ease-out ${
          envelopeOpened
            ? 'opacity-100 translate-y-0 filter-none pointer-events-auto'
            : 'opacity-0 translate-y-8 blur-xs pointer-events-none max-h-screen overflow-hidden'
        }`}
      >
        {/* Floating Rose Petal Shower Button & Canvas */}
        <RosePetalShower />

        {/* Sticky Top Luxury Bar */}
        <nav className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8DFC8] px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#AA820A] via-[#D4AF37] to-[#FAF4E3] flex items-center justify-center text-black font-cinzel font-bold text-xs shadow-sm">
              👑
            </div>
            <div>
              <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#2C2218]">
                {project.partner1.split(' ')[0]} & {project.partner2.split(' ')[0]}
              </span>
              <span className="hidden sm:inline-block text-[10px] text-[#7D5F04] font-serif ml-2">
                • {project.venue.city}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={handleToggleAudio}
              className="p-2 rounded-full bg-[#FAF4E3] border border-[#D4AF37]/50 text-[#7D5F04] hover:bg-[#F3E5AB] transition-all text-xs flex items-center gap-1.5 shadow-sm"
              title="Toggle Sitar & Bansuri Flute Soundtrack"
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#AA820A] animate-pulse" />
                  <span className="text-[10px] font-mono hidden md:inline font-semibold">Sound: Playing</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-[10px] font-mono hidden md:inline">Play Music</span>
                </>
              )}
            </button>

            {/* Re-seal Envelope Button */}
            <button
              onClick={() => setEnvelopeOpened(false)}
              className="px-2.5 py-1.5 rounded-lg text-[#7D5F04] hover:bg-[#FAF4E3] text-[11px] font-cinzel uppercase flex items-center gap-1 transition-colors"
              title="Re-close envelope"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Envelope</span>
            </button>

            {/* Share link */}
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 bg-[#FAF4E3] text-[#7D5F04] hover:bg-[#F3E5AB] text-xs font-cinzel tracking-wider flex items-center gap-1.5 transition-all shadow-sm font-semibold"
            >
              {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION: The Royal Ivory & 24K Gold Wedding Invitation Card */}
      <section className="relative px-4 pt-10 pb-16 flex flex-col items-center justify-center text-center">
        {/* Soft Golden Watermark Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[radial-gradient(circle,rgba(212,175,55,0.18)_0%,rgba(250,248,245,0)_70%)] pointer-events-none" />

        {/* Personalized Dignitary Salutation Pill */}
        <div className="mb-6 inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#FAF4E3] border border-[#D4AF37]/60 text-[#7D5F04] text-xs font-cinzel tracking-widest uppercase shadow-sm animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#AA820A]" />
          Auspicious Welcome to {guestQuery}
          <Sparkles className="w-3.5 h-3.5 text-[#AA820A]" />
        </div>

        {/* THE ROYAL SHUBH VIVAH CARD FRAME */}
        <div className="relative max-w-xl w-full bg-[#FDFBF7] paper-deckle rounded-3xl p-8 sm:p-14 shadow-[0_25px_70px_rgba(180,140,70,0.18)] overflow-hidden foil-sheen">
          {/* Ornate Gold Filigree Corners */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-xl pointer-events-none" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#D4AF37] rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#D4AF37] rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#D4AF37] rounded-br-xl pointer-events-none" />

          {/* Inner Hairline Gold Border */}
          <div className="absolute inset-3 border border-[#D4AF37]/35 rounded-2xl pointer-events-none" />

          {/* Vedic Auspicious Shloka */}
          <p className="font-cinzel text-xs tracking-[0.35em] uppercase text-[#AA820A] font-bold mb-1">
            ॥ ॐ श्री गणेशाय नमः ॥
          </p>
          <p className="font-cormorant italic text-xs text-[#7D5F04] mb-5">
            वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ • निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा
          </p>

          <p className="font-cinzel text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#544230] font-semibold mb-3">
            Together with their families, they request the honour of your graceful presence
          </p>

          {/* Couple Names */}
          <h1 className="font-serif text-3xl sm:text-5xl text-[#2C2218] font-light tracking-wide leading-tight mb-2">
            <span className="block font-cormorant font-normal">{project.partner1}</span>
            <span className="font-pinyon text-4xl sm:text-6xl text-[#AA820A] block -my-2 sm:-my-3">
              weds
            </span>
            <span className="block font-cormorant font-normal">{project.partner2}</span>
          </h1>

          <p className="font-cormorant italic text-base sm:text-lg text-[#544230] max-w-md mx-auto mt-4 leading-relaxed">
            As two families unite and two souls begin their sacred circumambulation around the holy fire under the starlit sky of Udaipur.
          </p>

          {/* Venue & Location Plaque */}
          <div className="mt-8 pt-6 border-t border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-[#7D5F04] font-cinzel text-xs tracking-wider uppercase">
            <div className="flex items-center gap-1.5 font-bold">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>{project.venue.name}</span>
            </div>
            <span className="hidden sm:inline text-[#D4AF37]/50">•</span>
            <span>{project.venue.city}</span>
          </div>

          {/* Action links */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
            <a
              href={project.venue.googleMapsLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF4E3] border border-[#D4AF37]/50 text-xs font-cinzel uppercase text-[#7D5F04] hover:bg-[#F3E5AB] transition-colors shadow-sm font-semibold"
            >
              <Navigation className="w-3.5 h-3.5 text-[#AA820A]" /> Open Palace on Google Maps
            </a>
          </div>
        </div>

        {/* SECTION: CANVAS SCRATCH-TO-REVEAL CARD */}
        <div className="mt-12 w-full max-w-sm">
          <CanvasScratchCard
            weddingDateStr="Saturday, November 20, 2027"
            venueStr={project.venue.name}
          />
        </div>

        {/* DYNAMIC COUNTDOWN TIMER */}
        <div className="mt-12 max-w-md w-full">
          <p className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#AA820A] font-bold mb-3">
            Countdown to Auspicious Muhurat
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Minutes', val: timeLeft.minutes },
              { label: 'Seconds', val: timeLeft.seconds },
            ].map((unit, i) => (
              <div
                key={i}
                className="bg-[#FDFBF7] border border-[#E8DFC8] rounded-xl p-3 shadow-sm"
              >
                <span className="font-serif text-2xl sm:text-3xl font-light text-[#2C2218] block">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="font-cinzel text-[9px] uppercase tracking-widest text-[#7D5F04] font-semibold">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: MULTI-RASAM EVENT SCHEDULE & ITINERARY */}
      <section className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-1">
          <span className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#AA820A] font-bold flex items-center justify-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Order of Auspicious Celebrations <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-[#2C2218] font-semibold">
            Wedding Itinerary & Rasam Timelines
          </h2>
        </div>

        <div className="space-y-5">
          {project.events.map((event, idx) => {
            const style = getEventCardStyle(idx);
            return (
              <div
                key={event.id}
                className={`bg-[#FDFBF7] paper-deckle rounded-2xl p-6 sm:p-7 shadow-[0_10px_35px_rgba(180,140,70,0.1)] space-y-4 border ${style.border} paper-card-hover`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFC8] pb-3">
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-cinzel uppercase font-bold tracking-wider inline-block border mb-1 ${style.badge}`}>
                      {style.tag}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#2C2218]">
                      {event.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#7D5F04] font-mono font-bold">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {event.time}
                  </div>
                </div>

                <p className="font-cormorant italic text-sm text-[#544230] leading-relaxed">
                  {event.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[#2C2218]">
                    <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>
                      <strong className="text-[#3D2F22]">{event.venue}</strong> — {event.address}
                    </span>
                  </div>

                  {/* 1-Click Google Calendar Add Button */}
                  <a
                    href={getGoogleCalendarLink(event)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-[#FAF4E3] border border-[#D4AF37]/50 text-[#7D5F04] hover:bg-[#F3E5AB] font-cinzel text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#AA820A]" />
                    Add to Calendar
                  </a>
                </div>

                {/* Dress Code & Palette Swatches */}
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-cinzel text-[10px] uppercase tracking-widest text-[#7D5F04] font-bold block">
                      Attire: {event.dressCode}
                    </span>
                    <p className="text-[11px] text-[#544230] mt-0.5 font-sans">
                      {event.dressCodeDetails}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] font-cinzel uppercase text-neutral-400 mr-1">
                      Palette:
                    </span>
                    {event.dressCodeColors.map((hex, cIdx) => (
                      <span
                        key={cIdx}
                        className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: "HOW WE MET" MILESTONE SLIDER */}
      <section className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-1">
          <span className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#AA820A] font-bold flex items-center justify-center gap-2">
            <Heart className="w-3.5 h-3.5 text-[#9B1C2E] fill-[#9B1C2E]" /> The Journey of Love <Heart className="w-3.5 h-3.5 text-[#9B1C2E] fill-[#9B1C2E]" />
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-[#2C2218] font-semibold">
            How We Met & Chose Forever
          </h2>
        </div>

        <MilestoneSlider milestones={project.story} />
      </section>

      {/* SECTION 4: 3-QUESTION COUPLE TRIVIA QUIZ */}
      <section className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-1">
          <span className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#AA820A] font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Fun & Banter <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-[#2C2218] font-semibold">
            How Well Do You Know The Couple?
          </h2>
        </div>

        <CoupleTrivia
          questions={project.trivia}
          coupleTitle={`${project.partner1} & ${project.partner2}`}
        />
      </section>

      {/* SECTION 5: SHAHI DAWAT (ROYAL CULINARY MENU) */}
      <section className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-1">
          <span className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#AA820A] font-bold flex items-center justify-center gap-2">
            <Utensils className="w-3.5 h-3.5 text-[#D4AF37]" /> Shahi Dawat <Utensils className="w-3.5 h-3.5 text-[#D4AF37]" />
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-[#2C2218] font-semibold">
            The Royal Banquet & Culinary Menu
          </h2>
        </div>

        <div className="bg-[#FDFBF7] paper-deckle rounded-2xl p-6 sm:p-8 shadow-[0_15px_45px_rgba(180,140,70,0.14)] space-y-6">
          {project.menu.map((dish) => (
            <div
              key={dish.id}
              className="border-b border-[#E8DFC8] pb-4 last:border-b-0 last:pb-0 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-[10px] uppercase tracking-widest text-[#AA820A] font-bold">
                  {dish.course}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-[#FAF4E3] text-[#7D5F04] border border-[#D4AF37]/40 font-semibold">
                  {dish.dietaryType}
                </span>
              </div>
              <h4 className="font-serif text-lg font-medium text-[#2C2218]">
                {dish.dishName}
              </h4>
              <p className="font-cormorant italic text-xs text-[#544230]">
                {dish.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: SANGEET DJ CROWD SONG REQUESTS */}
      <section className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-1">
          <span className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#AA820A] font-bold flex items-center justify-center gap-2">
            <Music className="w-3.5 h-3.5 text-[#D4AF37]" /> Dance Floor Anthems <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-[#2C2218] font-semibold">
            Request Your Sangeet Anthem
          </h2>
        </div>

        <DjSongRequestBox
          weddingSlug={project.slug}
          defaultGuestName={guestQuery}
          existingSongs={project.djPlaylist}
        />
      </section>

      {/* SECTION 7: VOICE BLESSING RECORDER */}
      <section className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-1">
          <span className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#AA820A] font-bold flex items-center justify-center gap-2">
            <Heart className="w-3.5 h-3.5 text-[#9B1C2E] fill-[#9B1C2E]" /> Aashirwad & Vows <Heart className="w-3.5 h-3.5 text-[#9B1C2E] fill-[#9B1C2E]" />
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-[#2C2218] font-semibold">
            Record a Spoken Voice Blessing
          </h2>
        </div>

        <VoiceBlessingRecorder
          weddingSlug={project.slug}
          defaultGuestName={guestQuery}
        />
      </section>

      {/* SECTION 8: INTERACTIVE RSVP & VIP ENTRY PASS GENERATOR */}
      <section className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-1">
          <span className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#AA820A] font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Confirm Your Shubh Aagaman <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-[#2C2218] font-semibold">
            Auspicious RSVP & Digital Pass
          </h2>
        </div>

        <GuestRsvpForm
          weddingSlug={project.slug}
          defaultGuestName={guestQuery}
        />
      </section>

      {/* SECTION 9: SHUBH KAAMNAYEIN (LIVE GUESTBOOK & WISHING LEDGER) */}
      <section className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-1">
          <span className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#AA820A] font-bold flex items-center justify-center gap-2">
            <Heart className="w-3.5 h-3.5 text-[#9B1C2E] fill-[#9B1C2E]" /> Shubh Kaamnayein <Heart className="w-3.5 h-3.5 text-[#9B1C2E] fill-[#9B1C2E]" />
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-[#2C2218] font-semibold">
            The Royal Wishing Well
          </h2>
        </div>

        {/* Inscribe form */}
        <div className="bg-[#FDFBF7] paper-deckle rounded-2xl p-6 shadow-md space-y-3">
          <h4 className="font-cinzel text-xs uppercase tracking-wider text-[#7D5F04] font-bold">
            Inscribe Your Handwritten Blessing
          </h4>
          <form onSubmit={handleAddWish} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={newWishAuthor}
                onChange={(e) => setNewWishAuthor(e.target.value)}
                placeholder="Your Name & Relation"
                className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none focus:border-[#D4AF37]"
              />
              <span className="text-[11px] text-[#7D5F04] flex items-center font-cormorant italic">
                Will be inscribed permanently in the couple's wedding memorial book.
              </span>
            </div>
            <textarea
              rows={2}
              required
              value={newWishMessage}
              onChange={(e) => setNewWishMessage(e.target.value)}
              placeholder="Write your heartfelt blessings for Rohit & Priya..."
              className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none focus:border-[#D4AF37]"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-700 font-medium">
                {wishSent && '✨ Your auspicious blessing has been inscribed!'}
              </span>
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs uppercase font-bold shadow hover:brightness-110 flex items-center gap-1.5 ml-auto"
              >
                <Send className="w-3.5 h-3.5" /> Sign Ledger
              </button>
            </div>
          </form>
        </div>

        {/* Existing wishes stream */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishes.map((w) => (
            <div
              key={w.id}
              className="bg-[#FDFBF7] paper-deckle rounded-xl p-5 shadow-sm space-y-2 border border-[#E8DFC8]"
            >
              <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-1.5">
                <span className="font-cinzel text-xs font-bold text-[#2C2218]">{w.author}</span>
                <span className="text-[9px] font-mono text-[#7D5F04]">{w.time}</span>
              </div>
              <p className="font-cormorant italic text-sm text-[#544230] leading-relaxed">
                "{w.message}"
              </p>
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}

export default function LuxuryGuestMicrosite() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] text-[#7D5F04] flex items-center justify-center font-cinzel text-sm">
          <Sparkles className="w-5 h-5 animate-spin mr-2 text-[#D4AF37]" />
          Unfolding Auspicious Palace Suite...
        </div>
      }
    >
      <LuxuryGuestMicrositeContent />
    </Suspense>
  );
}
