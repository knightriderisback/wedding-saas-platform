'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PeacockQuillCalligraphyProps {
  groomName: string;
  brideName: string;
  ampersand?: string;
  isRTL?: boolean;
}

export const PeacockQuillCalligraphy: React.FC<PeacockQuillCalligraphyProps> = ({
  groomName,
  brideName,
  ampersand = '&',
  isRTL = false,
}) => {
  const [animationStep, setAnimationStep] = useState<number>(0);

  // Detect script type for optimal royal typography
  const isDevanagari = /[\u0900-\u097F]/.test(groomName) || /[\u0900-\u097F]/.test(brideName);
  const isArabicUrdu = isRTL || /[\u0600-\u06FF]/.test(groomName);

  const nameFontFamily = isDevanagari
    ? "font-['Rozha_One','Yatra_One','Playfair_Display',serif]"
    : isArabicUrdu
    ? "font-['Noto_Nastaliq_Urdu','Playfair_Display',serif]"
    : "font-['Alex_Brush','Pinyon_Script',cursive]";

  const nameFontSize = isDevanagari
    ? 'text-4xl sm:text-5xl md:text-6xl tracking-wider leading-relaxed'
    : isArabicUrdu
    ? 'text-3xl sm:text-4xl md:text-5xl tracking-normal leading-loose'
    : 'text-5xl sm:text-6xl md:text-7xl font-normal tracking-wide';

  useEffect(() => {
    // Reset step on name or language change
    setAnimationStep(0);

    const t1 = setTimeout(() => setAnimationStep(1), 120); // Write Groom
    const t2 = setTimeout(() => setAnimationStep(2), 900); // Write Ampersand
    const t3 = setTimeout(() => setAnimationStep(3), 1350); // Write Bride
    const t4 = setTimeout(() => setAnimationStep(4), 2150); // Feather resting pose

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [groomName, brideName, isRTL]);

  // Directional multipliers for RTL vs LTR
  const dir = isRTL ? -1 : 1;

  return (
    <div className="relative flex flex-col items-center justify-center my-1 select-none w-full">
      {/* ========================================================
          PEACOCK FEATHER (MOR PANKH) VECTOR GRADIENTS
          ======================================================== */}
      <svg className="hidden">
        <defs>
          <linearGradient id="morPankhEye" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1354" />
            <stop offset="35%" stopColor="#005B96" />
            <stop offset="70%" stopColor="#00A896" />
            <stop offset="100%" stopColor="#028090" />
          </linearGradient>
          <radialGradient id="morPankhGoldRing" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="60%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#997300" />
          </radialGradient>
          <linearGradient id="morPankhShaft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4E0A5" />
            <stop offset="50%" stopColor="#C5A059" />
            <stop offset="100%" stopColor="#785B24" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Animated Peacock Feather Quill */}
      <motion.div
        className="absolute z-30 pointer-events-none drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]"
        initial={{ opacity: 0, x: -70 * dir, y: -35, rotate: -30 * dir, scale: 0.8 }}
        animate={
          animationStep === 0
            ? { opacity: 0, x: -70 * dir, y: -35, rotate: -30 * dir }
            : animationStep === 1
            ? {
                opacity: [0, 1, 1, 1],
                x: [-50 * dir, 35 * dir, 75 * dir],
                y: [-28, -30, -28],
                rotate: [-20 * dir, -14 * dir, -20 * dir],
                transition: { duration: 0.8, ease: 'easeInOut' },
              }
            : animationStep === 2
            ? {
                opacity: 1,
                x: 10 * dir,
                y: 10,
                rotate: -8 * dir,
                transition: { duration: 0.45, ease: 'easeInOut' },
              }
            : animationStep === 3
            ? {
                opacity: 1,
                x: [-50 * dir, 25 * dir, 70 * dir],
                y: [52, 50, 54],
                rotate: [-18 * dir, -15 * dir, -22 * dir],
                transition: { duration: 0.8, ease: 'easeInOut' },
              }
            : {
                opacity: 0.95,
                x: 90 * dir,
                y: -15,
                rotate: [18 * dir, 22 * dir, 18 * dir],
                scale: [0.85, 0.88, 0.85],
                transition: {
                  rotate: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
                  scale: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
                },
              }
        }
      >
        {/* Authentic Peacock Feather (Mor Pankh) Artwork */}
        <div className="relative w-16 h-24 sm:w-20 sm:h-28">
          <svg viewBox="0 0 100 140" className="w-full h-full filter drop-shadow-md">
            {/* Outer Feather Soft Radiating Vanes */}
            <path
              d="M50,140 Q45,80 30,50 Q20,30 35,15 Q50,0 65,15 Q80,30 70,50 Q55,80 50,140 Z"
              fill="none"
              stroke="#0A9396"
              strokeWidth="1.5"
              strokeDasharray="2,2"
              opacity="0.85"
            />
            {/* Emerald Green Radiating Vanes */}
            {[-25, -15, -5, 5, 15, 25].map((angle, i) => (
              <line
                key={`v-${i}`}
                x1="50"
                y1={35 + i * 8}
                x2={50 + angle * 1.3}
                y2={25 + i * 7}
                stroke="#2D6A4F"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.75"
              />
            ))}
            {/* Golden Oval Eye Halo */}
            <ellipse cx="50" cy="35" rx="22" ry="26" fill="url(#morPankhGoldRing)" opacity="0.95" />
            {/* Deep Turquoise Iridescent Ring */}
            <ellipse cx="50" cy="37" rx="16" ry="20" fill="url(#morPankhEye)" />
            {/* Dark Midnight Royal Blue Inner Core */}
            <ellipse cx="50" cy="39" rx="10" ry="13" fill="#0A1128" />
            {/* Central Bright Cyan Heart Highlight */}
            <path
              d="M50,33 C45,30 42,34 46,39 C49,43 50,45 50,45 C50,45 51,43 54,39 C58,34 55,30 50,33 Z"
              fill="#00F5D4"
              opacity="0.95"
            />
            {/* White Specular Shimmer */}
            <circle cx="48" cy="35" r="2.2" fill="#FFFFFF" opacity="0.85" />
            {/* Central Quill Shaft (Golden stem to nib) */}
            <path
              d="M50,15 Q50,70 50,138"
              stroke="url(#morPankhShaft)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Quill Nib Writing Tip */}
            <polygon points="49,138 51,138 50,142" fill="#E9D8A6" />
          </svg>

          {/* Golden Magical Sparkle Dust at Quill Tip */}
          {animationStep >= 1 && animationStep <= 3 && (
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FFE066] blur-[2px]"
              animate={{
                scale: [0.8, 1.8, 0.8],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ repeat: Infinity, duration: 0.35 }}
            />
          )}
        </div>
      </motion.div>

      {/* ========================================================
          GROOM NAME WITH CALLIGRAPHY STROKE REVEAL
          ======================================================== */}
      <div className="relative py-0.5 flex flex-col items-center">
        <motion.div
          initial={{ clipPath: isRTL ? 'inset(0 0% 0 100%)' : 'inset(0 100% 0 0)' }}
          animate={{
            clipPath:
              animationStep >= 1
                ? 'inset(0 0% 0 0)'
                : isRTL
                ? 'inset(0 0% 0 100%)'
                : 'inset(0 100% 0 0)',
          }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative inline-block"
        >
          <h1
            className={`${nameFontFamily} ${nameFontSize} text-[#1E2E1B]`}
            style={{
              textShadow:
                '0 1px 3px rgba(255,255,255,0.92), 0 2px 8px rgba(212,175,55,0.35), 0 0 1px rgba(0,0,0,0.4)',
            }}
          >
            {groomName}
          </h1>
        </motion.div>
      </div>

      {/* ========================================================
          ROYAL AMPERSAND
          ======================================================== */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: animationStep >= 2 ? 1 : 0,
          opacity: animationStep >= 2 ? 1 : 0,
        }}
        transition={{ duration: 0.45, ease: 'backOut' }}
        className="my-0.5 font-['Cormorant_Garamond',serif] italic text-2xl text-[#8C764E] font-light"
        style={{
          textShadow: '0 1px 2px rgba(255,255,255,0.85)',
        }}
      >
        {ampersand}
      </motion.div>

      {/* ========================================================
          BRIDE NAME WITH CALLIGRAPHY STROKE REVEAL
          ======================================================== */}
      <div className="relative py-0.5 flex flex-col items-center">
        <motion.div
          initial={{ clipPath: isRTL ? 'inset(0 0% 0 100%)' : 'inset(0 100% 0 0)' }}
          animate={{
            clipPath:
              animationStep >= 3
                ? 'inset(0 0% 0 0)'
                : isRTL
                ? 'inset(0 0% 0 100%)'
                : 'inset(0 100% 0 0)',
          }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative inline-block"
        >
          <h1
            className={`${nameFontFamily} ${nameFontSize} text-[#1E2E1B]`}
            style={{
              textShadow:
                '0 1px 3px rgba(255,255,255,0.92), 0 2px 8px rgba(212,175,55,0.35), 0 0 1px rgba(0,0,0,0.4)',
            }}
          >
            {brideName}
          </h1>
        </motion.div>
      </div>
    </div>
  );
};
