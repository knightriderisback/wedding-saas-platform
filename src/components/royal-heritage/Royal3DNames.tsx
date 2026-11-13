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
    const timer = setTimeout(() => setIsRevealed(true), 150);
    return () => clearTimeout(timer);
  }, [groomName, brideName]);

  // Check script type for optimal font
  const isDevanagari = /[\u0900-\u097F]/.test(groomName) || /[\u0900-\u097F]/.test(brideName);
  const isArabicUrdu = isRTL || /[\u0600-\u06FF]/.test(groomName);

  const fontClass = isDevanagari
    ? "font-['Rozha_One','Yatra_One','Playfair_Display',serif] text-5xl sm:text-6xl tracking-wider"
    : isArabicUrdu
    ? "font-['Noto_Nastaliq_Urdu','Playfair_Display',serif] text-4xl sm:text-5xl leading-loose"
    : "font-['Alex_Brush','Pinyon_Script',cursive] text-6xl sm:text-7xl font-normal";

  // Deep 3D Extrusion Multi-layer Shadow (Creates real 3D Pop Out effect)
  const extrusion3DStyle: React.CSSProperties = {
    textShadow: `
      0 1px 0 #D4AF37,
      0 2px 0 #C4A265,
      0 3px 0 #B59A57,
      0 4px 0 #8C764E,
      0 5px 0 #634812,
      0 6px 1px rgba(0, 0, 0, 0.25),
      0 0 12px rgba(255, 235, 160, 0.5),
      0 10px 22px rgba(0, 0, 0, 0.6)
    `,
    filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.45))',
  };

  // Render a word with individual 3D popping letters
  const render3DWord = (word: string, baseDelay: number) => {
    const chars = Array.from(word);
    return (
      <span className="inline-block whitespace-nowrap" style={{ perspective: '800px' }}>
        {chars.map((char, index) => (
          <motion.span
            key={`char-${index}`}
            initial={{ opacity: 0, scale: 0.2, y: 35, rotateX: 60, z: -80 }}
            animate={
              isRevealed
                ? {
                    opacity: 1,
                    scale: [0.2, 1.25, 1],
                    y: [35, -8, 0],
                    rotateX: [60, -10, 0],
                    z: 0,
                  }
                : { opacity: 0, scale: 0.2, y: 35 }
            }
            transition={{
              duration: 0.7,
              delay: baseDelay + index * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              scale: 1.2,
              y: -8,
              transition: { duration: 0.2 },
            }}
            className="inline-block text-[#1E2E1B] font-bold cursor-default select-none transition-transform"
            style={{
              ...extrusion3DStyle,
              transformStyle: 'preserve-3d',
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
