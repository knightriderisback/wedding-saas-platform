'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Royal3DNamesProps {
  groomName: string;
  brideName: string;
  ampersand?: string;
  isRTL?: boolean;
}

export const Royal3DNames: React.FC<Royal3DNamesProps> = ({
  groomName,
  brideName,
  ampersand = '&',
  isRTL = false,
}) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 50);
    return () => clearTimeout(timer);
  }, [groomName, brideName]);

  // Check script type for optimal font
  const isDevanagari = /[\u0900-\u097F]/.test(groomName) || /[\u0900-\u097F]/.test(brideName);
  const isArabicUrdu = isRTL || /[\u0600-\u06FF]/.test(groomName);

  const fontClass = isDevanagari
    ? "font-['Rozha_One','Yatra_One','Playfair_Display',serif] text-5xl sm:text-6xl md:text-7xl tracking-normal font-bold"
    : isArabicUrdu
    ? "font-['Noto_Nastaliq_Urdu','Playfair_Display',serif] text-4xl sm:text-5xl md:text-6xl leading-loose font-bold"
    : "font-['Alex_Brush','Pinyon_Script',cursive] text-5xl sm:text-7xl md:text-8xl font-normal";

  // Crisp, GPU-friendly 3D Beveled Text Shadow (Zero expensive drop-shadow filters)
  const extrusion3DStyle: React.CSSProperties = {
    textShadow: `
      0 1px 0 #D4AF37,
      0 2px 0 #C4A265,
      0 3px 0 #B59A57,
      0 4px 0 #8C764E,
      0 5px 2px rgba(0, 0, 0, 0.35),
      0 8px 16px rgba(0, 0, 0, 0.5)
    `,
  };

  // Render a word with individual 3D popping letters or intact ligature word for Devanagari/Urdu
  const render3DWord = (word: string, baseDelay: number) => {
    if (isDevanagari || isArabicUrdu) {
      return (
        <span className="inline-block whitespace-nowrap" style={{ perspective: '800px' }}>
          <motion.span
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={
              isRevealed
                ? {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }
                : { opacity: 0, scale: 0.6, y: 20 }
            }
            transition={{
              duration: 0.4,
              delay: baseDelay,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              scale: 1.05,
              y: -4,
              transition: { duration: 0.15 },
            }}
            className="inline-block text-[#1E2E1B] font-bold cursor-default select-none transition-transform"
            style={{
              ...extrusion3DStyle,
              willChange: 'transform, opacity',
            }}
          >
            {word}
          </motion.span>
        </span>
      );
    }

    const chars = Array.from(word);
    return (
      <span className="inline-block whitespace-nowrap" style={{ perspective: '800px' }}>
        {chars.map((char, index) => (
          <motion.span
            key={`char-${index}`}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={
              isRevealed
                ? {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }
                : { opacity: 0, scale: 0.5, y: 20 }
            }
            transition={{
              duration: 0.35,
              delay: baseDelay + index * 0.02,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              scale: 1.15,
              y: -4,
              transition: { duration: 0.15 },
            }}
            className="inline-block text-[#1E2E1B] font-bold cursor-default select-none transition-transform"
            style={{
              ...extrusion3DStyle,
              willChange: 'transform, opacity',
            }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-1 select-none w-full">
      {/* 1. GROOM NAME 3D POP OUT */}
      <div className={`relative py-0.5 flex items-center justify-center ${fontClass}`}>
        {render3DWord(groomName, 0.1)}
      </div>

      {/* 2. ROYAL 3D AMPERSAND */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        animate={
          isRevealed
            ? { opacity: 1, scale: [0, 1.4, 1], rotate: 0 }
            : { opacity: 0, scale: 0 }
        }
        transition={{ duration: 0.6, delay: 0.45, ease: 'backOut' }}
        className="my-0.5 font-['Cormorant_Garamond',serif] italic text-3xl sm:text-4xl text-[#B59A57] font-semibold"
        style={{
          textShadow: `
            0 1px 0 #FFE066,
            0 2px 0 #D4AF37,
            0 3px 0 #785B24,
            0 6px 14px rgba(0,0,0,0.45)
          `,
        }}
      >
        {ampersand}
      </motion.div>

      {/* 3. BRIDE NAME 3D POP OUT */}
      <div className={`relative py-0.5 flex items-center justify-center ${fontClass}`}>
        {render3DWord(brideName, 0.6)}
      </div>

      {/* Subtle Diamond Underline Glow */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isRevealed ? { scaleX: 1, opacity: 0.85 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay: 0.95 }}
        className="flex items-center justify-center gap-2 mt-2"
      >
        <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#DFC07C] to-transparent shadow-sm" />
        <div className="w-2 h-2 rotate-45 bg-[#B59A57] shadow-sm" />
        <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#DFC07C] to-transparent shadow-sm" />
      </motion.div>
    </div>
  );
};
