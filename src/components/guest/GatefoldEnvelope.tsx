'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { royalSitarAudio } from '@/lib/sitarSynth';
import { Sparkles, Heart } from 'lucide-react';

interface GatefoldEnvelopeProps {
  guestName: string;
  partner1: string;
  partner2: string;
  venueCity: string;
  onOpened: () => void;
  isOpen: boolean;
  themeStyle?: 'palace' | 'venue' | 'floral' | 'como';
  waxColor?: string;
}

export const GatefoldEnvelope: React.FC<GatefoldEnvelopeProps> = ({
  guestName,
  partner1,
  partner2,
  venueCity,
  onOpened,
  isOpen,
  themeStyle = 'palace',
  waxColor = '#9B1C2E',
}) => {
  // Animation state stages: 'idle' -> 'cracking' -> 'flap-open' -> 'card-sliding' -> 'finished'
  const [animStage, setAnimStage] = useState<'idle' | 'cracking' | 'flap-open' | 'card-sliding' | 'finished'>('idle');
  const [sealCracked, setSealCracked] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAnimStage('idle');
      setSealCracked(false);
    }
  }, [isOpen]);

  const handleBreakSeal = () => {
    if (isOpen || animStage !== 'idle') return;

    // Stage 1: Crack Wax Seal & Play Sound
    setAnimStage('cracking');
    setSealCracked(true);
    royalSitarAudio.playWaxCrack();

    // Stage 2: Flap Flips Open in 3D (after 350ms)
    setTimeout(() => {
      setAnimStage('flap-open');
    }, 400);

    // Stage 3: Card Slides UP out of Pocket (after 900ms)
    setTimeout(() => {
      setAnimStage('card-sliding');
      royalSitarAudio.startAmbient();

      // Launch golden and rose confetti
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#D4AF37', '#FAF4E3', '#9B1C2E', '#E58E26', '#FAF8F5'],
      });
    }, 1000);

    // Stage 4: Reveal Full Microsite (after 2000ms)
    setTimeout(() => {
      setAnimStage('finished');
      onOpened();
    }, 2100);
  };

  if (isOpen && animStage === 'finished') return null;

  // Background styling for the envelope based on theme
  const getLinerPattern = () => {
    switch (themeStyle) {
      case 'floral':
        return 'radial-gradient(circle at 50% 30%, rgba(232, 165, 152, 0.25) 0%, rgba(250, 246, 242, 0.95) 70%)';
      case 'venue':
        return 'radial-gradient(circle at 50% 30%, rgba(74, 124, 142, 0.25) 0%, rgba(250, 247, 242, 0.95) 70%)';
      case 'como':
        return 'radial-gradient(circle at 50% 30%, rgba(26, 54, 93, 0.25) 0%, rgba(240, 248, 255, 0.95) 70%)';
      case 'palace':
      default:
        return 'radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.28) 0%, rgba(253, 251, 247, 0.95) 70%)';
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden transition-opacity duration-700 ${
        animStage === 'finished' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background soft ambient watercolor lighting & floating orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18)_0%,rgba(250,247,242,0.88)_75%)] pointer-events-none" />

      {/* Decorative Traditional Shloka / Subtitle at Top */}
      <div className="absolute top-5 sm:top-7 left-1/2 -translate-x-1/2 text-center select-none pointer-events-none z-10 w-full px-4">
        <p className="font-cinzel text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#AA820A] font-bold">
          ॥ श्री गणेशाय नमः ॥
        </p>
        <p className="font-cormorant italic text-xs text-[#7D5F04]/80 mt-0.5">
          Shubh Vivah Nimantran Patrika • Royal Bespoke Delivery
        </p>
      </div>

      {/* MAIN 3D ENVELOPE WRAPPER */}
      <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-[1/1.26] perspective-envelope select-none">
        {/* Envelope Outer Pocket Box with Authentic Physical Depth */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden envelope-pocket-shadow bg-[#F9F6EE] border border-[#E8DFC8]">
          {/* INSIDE ENVELOPE LINER (Revealed when flap opens) */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: getLinerPattern(),
              backgroundImage: `radial-gradient(circle at 50% 25%, rgba(212, 175, 55, 0.2) 0%, transparent 60%), linear-gradient(135deg, rgba(212,175,55,0.06) 25%, transparent 25%), linear-gradient(225deg, rgba(212,175,55,0.06) 25%, transparent 25%)`,
              backgroundSize: '100% 100%, 20px 20px, 20px 20px',
            }}
          >
            {/* Deep Inner Pocket Shadow for realistic depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
          </div>

          {/* THE PHYSICAL GILDED INVITATION CARD (SLIDES OUT IN 3D) */}
          <div
            className={`absolute left-3 right-3 sm:left-4 sm:right-4 z-10 rounded-xl bg-[#FDFBF7] paper-deckle p-5 sm:p-6 flex flex-col justify-between border border-[#D4AF37]/50 shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-1000 ease-out ${
              animStage === 'card-sliding' || animStage === 'finished'
                ? '-translate-y-36 sm:-translate-y-48 scale-105 shadow-[0_30px_70px_rgba(180,140,50,0.3)]'
                : 'top-6 bottom-6'
            }`}
          >
            {/* Ornate Gold Filigree Corners on the Letter */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]/60 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]/60 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]/60 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]/60 rounded-br-sm pointer-events-none" />

            <div className="text-center pt-1">
              <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#AA820A] font-bold block">
                {venueCity} • Palace Destination
              </span>
              <span className="font-cormorant italic text-[11px] text-[#7D5F04]/80">
                Together With Their Families
              </span>
            </div>

            {/* Couple Calligraphy on Card */}
            <div className="text-center my-auto py-2">
              <span className="font-cinzel text-[8px] uppercase tracking-[0.25em] text-[#7D5F04] font-semibold block mb-0.5">
                Request The Honour Of Your Presence
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2C2218] font-bold leading-tight">
                {partner1} <br />
                <span className="font-pinyon text-3xl sm:text-4xl text-[#AA820A] font-normal">&</span> {partner2}
              </h2>
            </div>

            <div className="text-center border-t border-[#E8DFC8] pt-2">
              <span className="font-cinzel text-[9px] uppercase tracking-wider text-[#AA820A] font-bold block">
                Personalized Royal Invite
              </span>
              <span className="font-serif font-bold text-xs text-[#2C2218]">
                {guestName}
              </span>
            </div>
          </div>

          {/* LEFT & RIGHT FOLDED TRIANGULAR FLAPS (Enveloping the card) */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)',
              backgroundColor: '#F5F0E4',
              backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(235,225,205,0.85) 100%)',
              filter: 'drop-shadow(2px 0 5px rgba(0,0,0,0.06))',
            }}
          />
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)',
              backgroundColor: '#F3EEDB',
              backgroundImage: 'linear-gradient(225deg, rgba(255,255,255,0.7) 0%, rgba(230,220,200,0.85) 100%)',
              filter: 'drop-shadow(-2px 0 5px rgba(0,0,0,0.06))',
            }}
          />

          {/* BOTTOM FOLDED FLAP (Folded upwards from bottom) */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              clipPath: 'polygon(0% 100%, 50% 48%, 100% 100%)',
              backgroundColor: '#FDFBF7',
              backgroundImage: 'linear-gradient(to top, rgba(240,230,210,0.9) 0%, rgba(253,251,247,0.95) 100%)',
              filter: 'drop-shadow(0 -3px 8px rgba(0,0,0,0.08))',
            }}
          />

          {/* VELLUM BELLY BAND ACROSS FRONT POCKET */}
          {animStage === 'idle' && (
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-25 py-3.5 px-4 vellum-wrap border-y border-[#D4AF37]/50 shadow-md text-center">
              <span className="font-cinzel text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[#7D5F04] font-bold block mb-0.5">
                Presented With Royal Regard
              </span>
              <h3 className="font-pinyon text-2xl sm:text-3xl text-[#2C2218] leading-tight">
                {guestName}
              </h3>
            </div>
          )}

          {/* TOP FOLDING TRIANGULAR FLAP (REALISTIC 3D PERSPECTIVE FOLD) */}
          <div
            className={`absolute top-0 left-0 right-0 h-[64%] z-30 origin-top transition-transform duration-1000 ease-in-out ${
              animStage === 'idle' || animStage === 'cracking'
                ? 'rotate-x-0'
                : '-rotate-x-180'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              backgroundColor: '#F7F3E8',
              backgroundImage: 'linear-gradient(to bottom, #FBF8F0 0%, #EFE8D6 100%)',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.18))',
            }}
          >
            {/* Ornate Gold Trim on Flap Edge */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />
          </div>

          {/* 3D WAX SEAL BUTTON (CENTER OF ENVELOPE) */}
          <div
            className={`absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-700 ${
              animStage === 'card-sliding' || animStage === 'finished'
                ? 'opacity-0 scale-125'
                : 'opacity-100'
            }`}
          >
            <button
              onClick={handleBreakSeal}
              disabled={animStage !== 'idle'}
              aria-label="Break Wax Seal to Open Invitation"
              className={`group relative w-22 h-22 sm:w-26 sm:h-26 rounded-full border-2 border-[#F3E5AB]/70 wax-seal-3d-royal flex flex-col items-center justify-center cursor-pointer transition-transform ${
                sealCracked
                  ? 'rotate-12 scale-110 brightness-125'
                  : 'hover:scale-105 active:scale-95'
              }`}
            >
              {/* Irregular Melted Wax Pool Rim */}
              <div className="absolute -inset-1 rounded-full border border-white/40 pointer-events-none" />

              {/* Debossed Stamped Monogram */}
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-widest text-[#FAF4E3] drop-shadow-md">
                {partner1[0]} & {partner2[0]}
              </span>

              <span className="font-cinzel text-[7px] sm:text-[8px] uppercase tracking-widest text-[#F3E5AB] font-bold mt-0.5">
                {sealCracked ? 'Seal Broken' : 'Break Seal'}
              </span>

              {/* Shimmer Sheen */}
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
          </div>

          {/* Bottom Footer Info on Envelope */}
          <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between text-[#AA820A] text-[9px] font-cinzel tracking-wider uppercase border-t border-[#E8DFC8]/60 pt-2">
            <span>Auspicious Shubh Vivah</span>
            <span className="flex items-center gap-1 text-[#7D5F04] font-bold animate-pulse">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Tap Seal to Unfold
            </span>
          </div>
        </div>
      </div>

      {/* Audio Accompaniment Prompt */}
      <p className="absolute bottom-4 text-center text-xs font-cormorant italic text-[#7D5F04]/80">
        Best experienced with sound • Royal Sitar & Bansuri Flute Accompaniment
      </p>
    </div>
  );
};
