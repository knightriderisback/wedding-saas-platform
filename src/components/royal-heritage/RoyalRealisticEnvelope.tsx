'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RoyalRealisticEnvelopeProps {
  onCurtainsOpen?: () => void;
  onOpenComplete?: () => void;
  language?: string;
  isArabic?: boolean;
  onToggleLanguage?: () => void;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
  partner1?: string;
  partner2?: string;
  guestName?: string;
  weddingDate?: string;
}

export const RoyalRealisticEnvelope: React.FC<RoyalRealisticEnvelopeProps> = ({
  onCurtainsOpen,
  onOpenComplete,
  language = 'en',
  isArabic = false,
  onToggleLanguage,
  isAudioPlaying = false,
  onToggleAudio,
  partner1 = 'Gourav',
  partner2 = 'Priya',
  guestName = 'Special Guest',
  weddingDate = '12 December 2026',
}) => {
  const [animStage, setAnimStage] = useState<'idle' | 'opening' | 'finished'>('idle');
  const [isRendered, setIsRendered] = useState(true);

  const handleOpen = () => {
    if (animStage !== 'idle') return;
    setAnimStage('opening');

    // 1. Play Royal Indian Wedding Soundtrack immediately on user tap
    if (onToggleAudio && !isAudioPlaying) {
      onToggleAudio();
    }

    // 2. Royal Golden Sparkle Micro-Burst directly from the exact flap seam (Y: 72.4%)
    try {
      confetti({
        particleCount: 65,
        spread: 90,
        origin: { y: 0.72, x: 0.5 },
        colors: ['#FFE066', '#D4AF37', '#B59A57', '#FAF8F5', '#E63946'],
        disableForReducedMotion: true,
      });
    } catch {}

    // 3. Trigger backdrop / curtain opening
    if (onCurtainsOpen) {
      setTimeout(onCurtainsOpen, 400);
    }

    // 4. Complete envelope lifecycle and reveal microsite smoothly
    setTimeout(() => {
      setAnimStage('finished');
      if (onOpenComplete) onOpenComplete();
      setTimeout(() => {
        setIsRendered(false);
      }, 350);
    }, 1250);
  };

  if (!isRendered) return null;

  return (
    <div
      onClick={handleOpen}
      className={`fixed inset-0 z-50 flex items-center justify-center cursor-pointer select-none overflow-hidden transition-all duration-700 ${
        animStage === 'finished'
          ? 'opacity-0 pointer-events-none'
          : 'opacity-100'
      }`}
      style={{
        background:
          'radial-gradient(circle at 50% 45%, #6E0B0B 0%, #4D0505 55%, #2B0202 100%)',
      }}
    >
      {/* Ambient Velvet Gradient & Floating Golden Sparkles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,224,102,0.1)_0%,transparent_75%)] pointer-events-none" />

      {/* TOP CHAIN EXTENSIONS (Ensure lanterns seamlessly hang from the very top edge of any mobile/tall screen) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[min(100vw,calc(100dvh*1240/1748))] h-full pointer-events-none z-10">
        {/* Left Chain Extension */}
        <div
          className="absolute top-0 w-[2px] bg-gradient-to-b from-[#DFC07C] via-[#B59A57] to-[#DFC07C] opacity-75 shadow-[0_0_6px_rgba(223,192,124,0.4)]"
          style={{
            left: 'calc(168 / 1240 * 100%)',
            height: 'calc((100dvh - min(100dvh, 100vw * 1748 / 1240)) / 2 + 10px)',
          }}
        />
        {/* Right Chain Extension */}
        <div
          className="absolute top-0 w-[2px] bg-gradient-to-b from-[#DFC07C] via-[#B59A57] to-[#DFC07C] opacity-75 shadow-[0_0_6px_rgba(223,192,124,0.4)]"
          style={{
            left: 'calc(1090 / 1240 * 100%)',
            height: 'calc((100dvh - min(100dvh, 100vw * 1748 / 1240)) / 2 + 10px)',
          }}
        />
      </div>

      {/* MAIN ENVELOPE CARD STAGE (100% Edge-to-Edge on Mobile, Perfectly Centered on Desktop) */}
      <div
        className="relative w-full max-w-[min(100vw,calc(100dvh*1240/1748))] aspect-[1240/1748] my-auto select-none shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
        style={{
          perspective: '1400px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 
          1. INNER GILDED ROYAL WEDDING INVITATION CARD / LETTER 
          Glides smoothly UPWARDS out of the pocket when envelope opens!
        */}
        <div
          className={`absolute left-3 right-3 sm:left-6 sm:right-6 z-15 rounded-2xl p-5 sm:p-8 flex flex-col justify-between border-2 border-[#DFC07C] shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            animStage === 'opening'
              ? '-translate-y-[62%] scale-[1.02] opacity-100 shadow-[0_35px_90px_rgba(0,0,0,0.55)]'
              : 'top-[35%] bottom-[12%] opacity-0 scale-95 pointer-events-none'
          }`}
          style={{
            background: 'radial-gradient(circle at 50% 30%, #FCFAF6 0%, #F5EFE0 100%)',
            color: '#273822',
          }}
        >
          {/* Filigree Golden Corner Accents */}
          <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-[#B59A57] rounded-tl-sm pointer-events-none opacity-80" />
          <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t-2 border-r-2 border-[#B59A57] rounded-tr-sm pointer-events-none opacity-80" />
          <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b-2 border-l-2 border-[#B59A57] rounded-bl-sm pointer-events-none opacity-80" />
          <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-[#B59A57] rounded-br-sm pointer-events-none opacity-80" />

          {/* Letter Header: Auspicious Ganesha Inscription */}
          <div className="text-center pt-1">
            <span className="text-[#8B1E2B] font-bold text-xs sm:text-sm font-devanagari tracking-wide block">
              ॥ श्री गणेशाय नमः ॥
            </span>
            <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#7A6129] font-bold block mt-0.5">
              Royal Wedding Invitation
            </span>
            <span className="font-cormorant italic text-[11px] sm:text-xs text-[#524124] block mt-0.5">
              Together with their families
            </span>
          </div>

          {/* Couple Calligraphy */}
          <div className="text-center my-auto py-2">
            <h2 className="font-serif text-2xl sm:text-4xl font-black text-[#1E2E1B] leading-tight">
              {partner1}{' '}
              <span className="font-pinyon text-3xl sm:text-5xl italic text-[#B59A57]">
                &
              </span>{' '}
              {partner2}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <div className="w-8 h-[1px] bg-[#B59A57]/60" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
              <div className="w-8 h-[1px] bg-[#B59A57]/60" />
            </div>
          </div>

          {/* Guest Inscription & Auspicious Date */}
          <div className="text-center border-t border-[#DFC07C]/40 pt-2.5">
            <span className="font-cinzel text-[8px] sm:text-[9px] uppercase tracking-wider text-[#7A6129] font-bold block">
              Special Invitation For
            </span>
            <span className="font-serif font-black text-xs sm:text-sm text-[#1E2E1B] block mt-0.5">
              {guestName}
            </span>
            <span className="text-[10px] sm:text-xs text-[#8B1E2B] font-bold font-mono block mt-1">
              🗓️ {weddingDate}
            </span>
          </div>
        </div>

        {/* 
          2. TOP ENVELOPE FLAP (Rows 0 to 1265: Exactly 72.368% of Total Height)
          Features: Hanging Lanterns, Lord Ganesha, "Om Shree Ganeshay Namah", and Ornate Border.
          Opens by lifting UPWARDS along the exact seam line!
        */}
        <div
          className={`absolute top-0 left-0 right-0 h-[72.368%] z-30 overflow-hidden origin-top transition-all duration-[1100ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
            animStage === 'opening'
              ? '-translate-y-[115%] rotate-x-12 opacity-0'
              : 'translate-y-0 rotate-x-0 opacity-100'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.55))',
          }}
        >
          <Image
            src="/templates/royal-heritage/envelope_top_flap.webp"
            alt="Royal Wedding Envelope Flap"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 640px"
            className="object-cover object-bottom select-none"
          />

          {/* Ambient Subtle Shimmer Over Flap */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
        </div>

        {/* 
          3. BOTTOM ENVELOPE POCKET (Rows 1265 to 1748: Exactly 27.632% of Total Height)
          Features: Golden Mandala and Lower Flap Shadow.
          Opens by sliding DOWNWARDS along the exact seam line!
        */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-[27.632%] z-20 overflow-hidden origin-bottom transition-all duration-[1100ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
            animStage === 'opening'
              ? 'translate-y-[115%] -rotate-x-12 opacity-0'
              : 'translate-y-0 rotate-x-0 opacity-100'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 -8px 20px rgba(0,0,0,0.4))',
          }}
        >
          <Image
            src="/templates/royal-heritage/envelope_bottom_pocket.webp"
            alt="Royal Wedding Envelope Pocket"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 640px"
            className="object-cover object-top select-none"
          />

          {/* Ambient Shadow Over Pocket */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/15 pointer-events-none" />
        </div>

        {/* 
          4. 3D EMBOSSED AUSPICIOUS ROYAL SEAL (Positioned precisely at the 72.368% Seam Line)
          Mounted right at the seam where the top flap and bottom pocket meet!
        */}
        <div
          className={`absolute left-1/2 top-[72.368%] -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-[800ms] ease-out ${
            animStage === 'opening'
              ? 'opacity-0 scale-140 brightness-150 pointer-events-none'
              : 'opacity-100 scale-100'
          }`}
        >
          {/* Auspicious Round Royal Seal / Wax Stamp */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-[0_10px_35px_rgba(0,0,0,0.6)] cursor-pointer group hover:scale-105 active:scale-95 transition-transform">
            {/* Glowing Golden Ring Accent */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FFE066] via-[#B59A57] to-[#DFC07C] opacity-75 blur-xs animate-pulse" />

            {/* Seal Body in Royal Crimson & Gold Leaf */}
            <div
              className="relative w-full h-full rounded-full flex flex-col items-center justify-center border-2 border-[#DFC07C] shadow-[inset_0_2px_8px_rgba(255,255,255,0.4),inset_0_-4px_10px_rgba(0,0,0,0.6)]"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, #9E1A1A 0%, #6E0B0B 50%, #3F0303 100%)',
              }}
            >
              {/* Embossed Crown & Auspicious Text */}
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFE066] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
              <span className="text-[8px] sm:text-[9px] font-black font-cinzel tracking-wider text-[#FAF8F5] drop-shadow-md uppercase mt-0.5">
                {language === 'hi' ? 'खोलें' : 'OPEN'}
              </span>
            </div>
          </div>
        </div>

        {/* 
          5. FLOATING TAP TO OPEN PROMPT
          Guides guest to tap anywhere to experience the royal unboxing!
        */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: animStage === 'idle' ? 1 : 0,
            y: animStage === 'idle' ? 0 : 20,
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none w-max max-w-[92%]"
        >
          <div className="px-5 py-2.5 rounded-full bg-[#FAF8F5]/92 backdrop-blur-md border border-[#DFC07C] shadow-[0_8px_25px_rgba(0,0,0,0.45)] flex items-center gap-2 text-[#273822] animate-bounce">
            <Sparkles className="w-4 h-4 text-[#B59A57] animate-pulse shrink-0" />
            <span
              className={`text-xs sm:text-sm font-black tracking-wider whitespace-nowrap ${
                language === 'hi'
                  ? 'font-devanagari-heading tracking-normal font-bold'
                  : isArabic || language === 'ur'
                  ? 'font-nastaliq tracking-normal'
                  : "font-['Cinzel',serif] uppercase tracking-widest"
              }`}
            >
              {language === 'hi'
                ? 'शुभ विवाह आमंत्रण खोलने के लिए कहीं भी टैप करें'
                : language === 'ur' || isArabic
                ? 'شادی کا دعوت نامہ کھولنے کے لیے کلک کریں'
                : language === 'hinglish'
                ? 'Wedding Invitation Kholne Ke Liye Tap Karein'
                : 'Tap Anywhere to Open Royal Invitation'}
            </span>
            <span className="text-xs">✨</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
