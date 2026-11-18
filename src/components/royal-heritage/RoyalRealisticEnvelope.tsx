'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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

/**
 * RoyalRealisticEnvelope
 * Pristine, full-screen edge-to-edge stretched royal envelope image.
 * Absolutely NO extra buttons, overlays, chains or artificial wax seals.
 * Pure screen-filling envelope that dissolves smoothly upon touching anywhere.
 */
export const RoyalRealisticEnvelope: React.FC<RoyalRealisticEnvelopeProps> = ({
  onCurtainsOpen,
  onOpenComplete,
  isAudioPlaying = false,
  onToggleAudio,
}) => {
  const [isDissolving, setIsDissolving] = useState(false);
  const [isRendered, setIsRendered] = useState(true);

  const handleOpen = () => {
    if (isDissolving) return;
    setIsDissolving(true);

    // 1. Play Royal Indian Wedding Soundtrack immediately on user touch
    if (onCurtainsOpen) {
      onCurtainsOpen();
    }
    if (onToggleAudio && !isAudioPlaying) {
      onToggleAudio();
    }

    // 2. Royal Golden Sparkle Micro-Burst
    try {
      confetti({
        particleCount: 45,
        spread: 80,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#FFE066', '#D4AF37', '#DFC07C', '#FFFFFF', '#C41E3A'],
        disableForReducedMotion: true,
      });
    } catch {}

    // 3. Complete envelope dissolve lifecycle and notify parent
    setTimeout(() => {
      if (onOpenComplete) {
        onOpenComplete();
      }
      setTimeout(() => {
        setIsRendered(false);
      }, 300);
    }, 750);
  };

  if (!isRendered) return null;

  return (
    <AnimatePresence>
      {!isDissolving ? (
        <motion.div
          key="envelope-full"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(6px)' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleOpen}
          className="fixed inset-0 z-50 w-screen h-screen overflow-hidden cursor-pointer select-none bg-black flex items-center justify-center"
          title="Touch anywhere to open royal invitation"
        >
          {/* Stretched Edge-to-Edge Custom Envelope Image */}
          <div className="relative w-full h-full">
            <Image
              src="/templates/royal-heritage/envelope_custom.webp"
              alt="Royal Vivah Auspicious Envelope"
              fill
              priority
              quality={95}
              sizes="100vw"
              className="w-full h-full object-cover object-center pointer-events-none"
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="envelope-dissolving"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 w-screen h-screen overflow-hidden pointer-events-none bg-black flex items-center justify-center"
        >
          <div className="relative w-full h-full">
            <Image
              src="/templates/royal-heritage/envelope_custom.webp"
              alt="Royal Vivah Auspicious Envelope"
              fill
              priority
              quality={95}
              sizes="100vw"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
