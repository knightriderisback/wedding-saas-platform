'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RoyalRealisticEnvelopeProps {
  onCurtainsOpen?: () => void;
  onOpenComplete?: () => void;
  isArabic?: boolean;
  onToggleLanguage?: () => void;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
}

export const RoyalRealisticEnvelope: React.FC<RoyalRealisticEnvelopeProps> = ({
  onCurtainsOpen,
  onOpenComplete,
  isArabic = false,
  onToggleLanguage,
  isAudioPlaying = false,
  onToggleAudio,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isRendered, setIsRendered] = useState(true);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    // 1. Play Royal Soundtrack immediately on user tap gesture
    if (onToggleAudio && !isAudioPlaying) {
      onToggleAudio();
    }

    // 2. Royal Golden Sparkle Micro-Burst
    try {
      confetti({
        particleCount: 55,
        spread: 85,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#FFE066', '#D4AF37', '#B59A57', '#FAF8F5'],
        disableForReducedMotion: true,
      });
    } catch {}

    if (onCurtainsOpen) {
      setTimeout(onCurtainsOpen, 250);
    }

    // 3. Complete magical disappearance & reveal invitation
    setTimeout(() => {
      if (onOpenComplete) onOpenComplete();
      setIsRendered(false);
    }, 900);
  };

  if (!isRendered) return null;

  return (
    <div
      onClick={handleOpen}
      className={`fixed inset-0 z-50 flex items-center justify-center cursor-pointer select-none transition-all duration-700 ${
        isOpening
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        filter: isOpening ? 'blur(16px) brightness(1.25)' : 'none',
        transition: 'all 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {/* Ambient Warm Blurred Backdrop for widescreen displays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src="/templates/royal-heritage/envelope_custom.webp"
          alt=""
          fill
          className="object-cover scale-110 blur-3xl opacity-50"
        />
        <div className="absolute inset-0 bg-[#1E2E1B]/30" />
      </div>

      {/* Exact User Envelope Image from Google Drive (100% full bleed on mobile, perfectly centered on desktop) */}
      <div className="relative w-full h-full max-w-[520px] max-h-[100dvh] flex items-center justify-center">
        <Image
          src="/templates/royal-heritage/envelope_custom.webp"
          alt="Royal Wedding Envelope"
          fill
          priority
          sizes="(max-width: 640px) 100vw, 520px"
          className="object-cover sm:object-contain object-center drop-shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
        />

        {/* Ambient Subtle Shimmer Over Envelope */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15 pointer-events-none" />

        {/* Floating Tap to Open Auspicious Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        >
          <div className="px-5 py-2.5 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md border border-[#DFC07C] shadow-[0_8px_25px_rgba(0,0,0,0.35)] flex items-center gap-2 text-[#273822] animate-bounce">
            <Sparkles className="w-4 h-4 text-[#B59A57] animate-pulse" />
            <span className="font-['Cinzel',serif] text-xs uppercase tracking-widest font-black">
              {isArabic ? 'کھولنے کے لیے کہیں بھی کلک کریں' : 'Tap Anywhere to Open'}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
