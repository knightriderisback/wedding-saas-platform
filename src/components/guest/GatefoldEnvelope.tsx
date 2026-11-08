'use client';

import React, { useState } from 'react';
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
}

export const GatefoldEnvelope: React.FC<GatefoldEnvelopeProps> = ({
  guestName,
  partner1,
  partner2,
  venueCity,
  onOpened,
  isOpen,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [sealBroken, setSealBroken] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);
    setSealBroken(true);

    // Play wax crack & sitar chime
    royalSitarAudio.playWaxCrack();

    // Start background sitar & bansuri flute audio
    royalSitarAudio.startAmbient();

    // Trigger golden and rose confetti shower
    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#F3E5AB', '#9B1C2E', '#FAF8F5', '#E58E26'],
    });

    setTimeout(() => {
      onOpened();
      setIsOpening(false);
    }, 1300);
  };

  if (isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden">
      {/* Background soft ambient watercolor lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18)_0%,rgba(250,248,245,0.85)_75%)] pointer-events-none" />

      {/* Decorative Traditional Shloka at Top */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center select-none pointer-events-none">
        <p className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#AA820A] font-bold">
          ॥ श्री गणेशाय नमः ॥
        </p>
        <p className="font-cormorant italic text-xs text-[#7D5F04]/80 mt-0.5">
          Shubh Vivah Nimantran Patrika
        </p>
      </div>

      {/* Main Royal Boxed Envelope */}
      <div className="relative w-full max-w-sm sm:max-w-md aspect-[1/1.28] rounded-2xl overflow-hidden paper-deckle shadow-[0_25px_70px_rgba(160,120,40,0.22)] flex flex-col justify-between p-6 sm:p-8 bg-[#FDFBF7]">
        {/* Watercolor Floral Envelope Flap Liner (Simulated Royal Floral Border) */}
        <div
          className={`absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#F5EFE6] to-[#FAF8F5] border-b border-[#E8DFC8] transition-transform duration-1000 origin-top shadow-sm ${
            isOpening ? '-rotate-x-180 opacity-20' : ''
          }`}
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 50% 88%)',
            backgroundImage: `radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.12) 0%, transparent 60%)`,
          }}
        >
          {/* Subtle gold line ornament on flap */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />
        </div>

        {/* Ornate Gold Corners */}
        <div className="absolute top-4 left-4 w-9 h-9 border-t-2 border-l-2 border-[#D4AF37]/50 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-4 right-4 w-9 h-9 border-t-2 border-r-2 border-[#D4AF37]/50 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-9 h-9 border-b-2 border-l-2 border-[#D4AF37]/50 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-9 h-9 border-b-2 border-r-2 border-[#D4AF37]/50 rounded-br-lg pointer-events-none" />

        {/* Top Header Information */}
        <div className="relative z-10 text-center pt-2">
          <span className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-[#AA820A] font-bold block">
            {venueCity} • Palace Destination
          </span>
          <span className="font-cormorant italic text-xs text-[#7D5F04]/80">
            Personal Delivery via Royal Concierge
          </span>
        </div>

        {/* Center: Recipient Addressing (The Vellum Belly Band) */}
        <div className="relative z-10 my-auto py-5 px-4 vellum-wrap rounded-xl border border-[#D4AF37]/40 shadow-sm text-center">
          <span className="font-cinzel text-[9px] uppercase tracking-[0.3em] text-[#7D5F04] font-semibold block mb-1">
            Cordially Presented To
          </span>
          <h2 className="font-pinyon text-3xl sm:text-4xl text-[#2C2218] drop-shadow-sm leading-tight">
            {guestName || 'Cherished Family & Friends'}
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-2" />
          <p className="font-cormorant italic text-xs text-[#544230] mt-1.5">
            For the matrimonial union of {partner1.split(' ')[0]} & {partner2.split(' ')[0]}
          </p>
        </div>

        {/* CENTER WAX SEAL BUTTON */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <button
            onClick={handleOpenEnvelope}
            disabled={isOpening}
            aria-label="Break Wax Seal to open invitation"
            className={`group relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#F3E5AB]/60 wax-seal-royal flex flex-col items-center justify-center transition-all duration-700 cursor-pointer ${
              sealBroken
                ? 'scale-125 opacity-0 rotate-12'
                : 'hover:scale-105 hover:rotate-3 shadow-[0_12px_30px_rgba(155,28,46,0.5)] active:scale-95'
            }`}
          >
            {/* Scalloped ornamental edge */}
            <div className="absolute inset-2 rounded-full border border-white/30" />

            {/* Couple Monogram initials */}
            <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-widest text-[#FAF4E3] drop-shadow">
              {partner1[0]} & {partner2[0]}
            </span>

            <span className="font-cinzel text-[8px] uppercase tracking-widest text-[#F3E5AB] font-bold mt-0.5">
              Break Seal
            </span>

            {/* Hover sheen */}
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Bottom Footer Details */}
        <div className="relative z-10 flex items-center justify-between text-[#AA820A] text-[10px] font-cinzel tracking-wider uppercase border-t border-[#E8DFC8] pt-3">
          <span>Autumn Shubh Vivah</span>
          <span className="flex items-center gap-1 text-[#7D5F04] font-bold">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Tap to Unfold
          </span>
        </div>
      </div>

      {/* Helper text */}
      <p className="absolute bottom-5 text-center text-xs font-cormorant italic text-[#7D5F04]/80">
        Best experienced with sound • Classical Sitar & Bansuri Flute accompaniment
      </p>
    </div>
  );
};
