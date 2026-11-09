'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { royalSitarAudio } from '@/lib/sitarSynth';

interface GatefoldEnvelopeProps {
  guestName: string;
  partner1: string;
  partner2: string;
  venueCity: string;
  onOpened: () => void;
  isOpen: boolean;
  themeStyle?: string;
  waxColor?: string;
  waxMonogram?: string;
  introVideo?: string;
  introVideoPoster?: string;
}

interface TemplateEnvelopeConfig {
  envelopeBg: string;
  envelopeBorder: string;
  flapBg: string;
  linerBg: string;
  linerPattern: string;
  waxBg: string;
  waxBorder: string;
  waxTextColor: string;
  motifType: 'daisy' | 'chateau' | 'rose' | 'boat' | 'gold-seal' | 'candle' | 'ganesha';
  paperBg: string;
  paperBorder: string;
  paperText: string;
  accentColor: string;
  shlokaOrTag: string;
  confettiColors: string[];
}

const TEMPLATE_ENVELOPE_CONFIGS: Record<string, TemplateEnvelopeConfig> = {
  'pressed-meadow': {
    envelopeBg: '#F4EFE6', // Raw French cotton paper
    envelopeBorder: '#D8CEBD',
    flapBg: '#EFE7DA',
    linerBg: '#FAF6F0',
    linerPattern: `radial-gradient(circle at 50% 35%, rgba(107, 127, 94, 0.22) 0%, transparent 65%),
      linear-gradient(135deg, rgba(217, 167, 134, 0.12) 0%, transparent 50%),
      repeating-linear-gradient(45deg, rgba(107, 127, 94, 0.04) 0, rgba(107, 127, 94, 0.04) 1px, transparent 0, transparent 8px)`,
    waxBg: '#F7F2E7', // Ivory white wax seal
    waxBorder: '#D6C8B2',
    waxTextColor: '#4A3E31',
    motifType: 'daisy',
    paperBg: '#F8F5EE',
    paperBorder: '#D8CEBD',
    paperText: '#3C352D',
    accentColor: '#6B7F5E',
    shlokaOrTag: 'PRESSED MEADOW • BESPOKE WILDFLOWER SUITE',
    confettiColors: ['#F7F2E7', '#6B7F5E', '#D9A786', '#D4AF37', '#FFFDF9'],
  },
  'the-venue': {
    envelopeBg: '#EFE8DC',
    envelopeBorder: '#D2C3AE',
    flapBg: '#E8DFD0',
    linerBg: '#F7F2E9',
    linerPattern: `linear-gradient(to right, rgba(74, 124, 142, 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(74, 124, 142, 0.08) 1px, transparent 1px),
      radial-gradient(circle at 50% 30%, rgba(74, 124, 142, 0.18) 0%, transparent 70%)`,
    waxBg: '#A45D43',
    waxBorder: '#DDB3A3',
    waxTextColor: '#FAF4E3',
    motifType: 'chateau',
    paperBg: '#FAF7F2',
    paperBorder: '#E8DFC8',
    paperText: '#403030',
    accentColor: '#4A7C8E',
    shlokaOrTag: 'THE VENUE • CHÂTEAU ARCHITECTURAL SUITE',
    confettiColors: ['#A45D43', '#4A7C8E', '#FAF4E3', '#AA820A'],
  },
  'floral': {
    envelopeBg: '#FAF0E6',
    envelopeBorder: '#E2CEBF',
    flapBg: '#F5E6D8',
    linerBg: '#FDF7F2',
    linerPattern: `radial-gradient(circle at 50% 30%, rgba(232, 165, 152, 0.25) 0%, transparent 65%),
      linear-gradient(135deg, rgba(139, 157, 131, 0.12) 0%, transparent 50%),
      repeating-linear-gradient(-45deg, rgba(232, 165, 152, 0.04) 0, rgba(232, 165, 152, 0.04) 1px, transparent 0, transparent 8px)`,
    waxBg: '#8B9D83',
    waxBorder: '#B9CCB2',
    waxTextColor: '#FAF8F5',
    motifType: 'rose',
    paperBg: '#FAF4EE',
    paperBorder: '#E8D4C8',
    paperText: '#38302E',
    accentColor: '#B86860',
    shlokaOrTag: 'BOTANICAL HERBARIUM • ENGLISH GARDEN SUITE',
    confettiColors: ['#E8A598', '#8B9D83', '#FAF4EE', '#D4AF37'],
  },
  'como': {
    envelopeBg: '#E8EEF5',
    envelopeBorder: '#BED0E2',
    flapBg: '#DEE7F0',
    linerBg: '#F2F7FB',
    linerPattern: `radial-gradient(circle at 50% 35%, rgba(26, 82, 118, 0.22) 0%, transparent 70%),
      repeating-linear-gradient(0deg, rgba(26, 82, 118, 0.04) 0, rgba(26, 82, 118, 0.04) 1px, transparent 0, transparent 10px)`,
    waxBg: '#1A5276',
    waxBorder: '#5DADE2',
    waxTextColor: '#F3E5AB',
    motifType: 'boat',
    paperBg: '#EEF4F8',
    paperBorder: '#C8D9E8',
    paperText: '#1E2D3D',
    accentColor: '#1A5276',
    shlokaOrTag: 'LAKE COMO • VILLA DEL BALBIANELLO RIVA SUITE',
    confettiColors: ['#1A5276', '#5DADE2', '#FAF8F5', '#D4AF37'],
  },
  'heirloom-press': {
    envelopeBg: '#F2E9D9',
    envelopeBorder: '#CEBD9F',
    flapBg: '#E9DEC9',
    linerBg: '#FAF5EB',
    linerPattern: `radial-gradient(circle at 50% 30%, rgba(197, 160, 89, 0.28) 0%, transparent 60%),
      linear-gradient(45deg, rgba(110, 38, 48, 0.06) 25%, transparent 25%),
      linear-gradient(-45deg, rgba(110, 38, 48, 0.06) 25%, transparent 25%)`,
    waxBg: '#C5A059',
    waxBorder: '#F3E5AB',
    waxTextColor: '#2A1F18',
    motifType: 'gold-seal',
    paperBg: '#F7F5EE',
    paperBorder: '#D4C4AB',
    paperText: '#2A1F18',
    accentColor: '#AA820A',
    shlokaOrTag: 'HEIRLOOM PRESS • 24K GOLD LETTERPRESS SUITE',
    confettiColors: ['#C5A059', '#6E2630', '#FAF5EB', '#D4AF37'],
  },
  'afterglow': {
    envelopeBg: '#1F1C21',
    envelopeBorder: '#3D3742',
    flapBg: '#19161B',
    linerBg: '#151317',
    linerPattern: `radial-gradient(circle at 50% 30%, rgba(199, 164, 106, 0.25) 0%, transparent 65%),
      radial-gradient(2px 2px at 20% 30%, #FAF4E3, rgba(0,0,0,0)),
      radial-gradient(2px 2px at 80% 40%, #D4AF37, rgba(0,0,0,0))`,
    waxBg: '#8C6338',
    waxBorder: '#D4AF37',
    waxTextColor: '#FAF4E3',
    motifType: 'candle',
    paperBg: '#171717',
    paperBorder: '#332E38',
    paperText: '#FAF8F5',
    accentColor: '#C7A46A',
    shlokaOrTag: 'AFTERGLOW • CANDLELIT NOCTURNE SUITE',
    confettiColors: ['#C7A46A', '#8C6338', '#FAF8F5', '#3D3742'],
  },
  'the-palace': {
    envelopeBg: '#FAF5E8',
    envelopeBorder: '#D4AF37',
    flapBg: '#F3EBD6',
    linerBg: '#FFFDF9',
    linerPattern: `radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.32) 0%, transparent 65%),
      linear-gradient(135deg, rgba(155, 28, 46, 0.08) 25%, transparent 25%),
      linear-gradient(225deg, rgba(155, 28, 46, 0.08) 25%, transparent 25%)`,
    waxBg: '#9B1C2E',
    waxBorder: '#F3E5AB',
    waxTextColor: '#FAF4E3',
    motifType: 'ganesha',
    paperBg: '#FAF5E8',
    paperBorder: '#D4AF37',
    paperText: '#2C2218',
    accentColor: '#AA820A',
    shlokaOrTag: '॥ श्री गणेशाय नमः ॥ • ROYAL UDAIPUR VIVAH SUITE',
    confettiColors: ['#D4AF37', '#9B1C2E', '#FAF4E3', '#E58E26'],
  },
};

export const GatefoldEnvelope: React.FC<GatefoldEnvelopeProps> = ({
  guestName,
  partner1,
  partner2,
  venueCity,
  onOpened,
  isOpen,
  themeStyle = 'the-palace',
  waxColor,
  waxMonogram,
  introVideo,
  introVideoPoster,
}) => {
  // Video unboxing states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoState, setVideoState] = useState<'idle' | 'playing' | 'ended'>('idle');

  // Physical 3D envelope states (for non-video or fallback)
  const [animStage, setAnimStage] = useState<'idle' | 'cracking' | 'flap-open' | 'card-sliding' | 'finished'>('idle');

  // Resolve template specific styling config
  const config =
    TEMPLATE_ENVELOPE_CONFIGS[themeStyle] ||
    TEMPLATE_ENVELOPE_CONFIGS['the-palace'];

  const sealColor = waxColor || config.waxBg;
  const monogram = waxMonogram || `${partner1[0]} & ${partner2[0]}`;

  useEffect(() => {
    if (!isOpen) {
      setVideoState('idle');
      setAnimStage('idle');
    }
  }, [isOpen]);

  // Handle Video Unboxing Trigger (PressedLove Motion Engine)
  const handleOpenVideoEnvelope = async () => {
    if (isOpen || videoState !== 'idle') return;

    // 1. Play authentic tactile wax fracture sound snap
    royalSitarAudio.playWaxCrack();

    // 2. Sprinkle celebration confetti in theme colors
    confetti({
      particleCount: 80,
      spread: 85,
      origin: { y: 0.6 },
      colors: config.confettiColors,
    });

    setVideoState('playing');

    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        await videoRef.current.play();
      } catch {
        // Fallback if browser blocks video autoplay
        handleVideoFinished();
      }
    } else {
      setTimeout(handleVideoFinished, 2600);
    }
  };

  const handleVideoFinished = () => {
    setVideoState('ended');
    setTimeout(() => {
      onOpened();
    }, 400);
  };

  // Handle Physical 3D Envelope Unboxing (when video is not available)
  const handleBreakPhysicalSeal = () => {
    if (isOpen || animStage !== 'idle') return;

    // STEP 1: Realistic Wax Fracture (0ms)
    setAnimStage('cracking');
    royalSitarAudio.playWaxCrack();

    // STEP 2: Flap Unfolds 180° in 3D (after 550ms)
    setTimeout(() => {
      setAnimStage('flap-open');
    }, 550);

    // STEP 3: Cotton Letter glides up out of pocket (after 1500ms)
    setTimeout(() => {
      setAnimStage('card-sliding');

      if (themeStyle === 'the-palace' || themeStyle === 'palace') {
        royalSitarAudio.startAmbient();
      }

      confetti({
        particleCount: 85,
        spread: 90,
        origin: { y: 0.6 },
        colors: config.confettiColors,
      });
    }, 1500);

    // STEP 4: Dissolve into microsite (after 3600ms)
    setTimeout(() => {
      setAnimStage('finished');
      onOpened();
    }, 3600);
  };

  if (isOpen && (videoState === 'ended' || animStage === 'finished')) {
    return null;
  }

  // =========================================================================
  // MODE A: HIGH-DEFINITION PHOTOREALISTIC VIDEO UNBOXING (PRESSED LOVE DNA)
  // =========================================================================
  if (introVideo && introVideoPoster) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Wedding Invitation Envelope"
        className={`fixed inset-0 z-50 w-screen h-screen flex items-center justify-center overflow-hidden select-none transition-opacity duration-700 ${
          videoState === 'ended' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ backgroundColor: config.envelopeBg }}
      >
        {/* Full-Bleed Motion Stage */}
        <div className="motion-stage w-full h-full relative flex items-center justify-center">
          {/* Envelope Poster Image (Shown during idle) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={introVideoPoster}
            alt="Wedding Invitation Envelope"
            className={`motion-media ${videoState === 'playing' ? 'motion-video-hidden' : ''}`}
            style={{ objectFit: 'cover' }}
          />

          {/* Unboxing High-Definition Video */}
          <video
            ref={videoRef}
            src={introVideo}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            onEnded={handleVideoFinished}
            onError={handleVideoFinished}
            className={`motion-media ${videoState === 'playing' ? '' : 'motion-video-hidden'}`}
            style={{ objectFit: 'cover' }}
          />

          {/* Guest Personalization Inscription on Outer Envelope Front */}
          {videoState === 'idle' && (
            <div className="absolute top-[32%] sm:top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center pointer-events-none max-w-sm px-4">
              <span className="font-cinzel text-[8px] sm:text-[9px] uppercase tracking-[0.3em] font-semibold text-[#544230]/75 block mb-1">
                Hand-Delivered With Love To
              </span>
              <h3 className="font-pinyon text-3xl sm:text-4xl text-[#2C2218] leading-tight drop-shadow-xs">
                {guestName}
              </h3>
            </div>
          )}

          {/* TACTILE CENTER WAX SEAL TRIGGER BUTTON (Idle State) */}
          {videoState === 'idle' && (
            <div className="absolute top-[52%] sm:top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <button
                type="button"
                onClick={handleOpenVideoEnvelope}
                aria-label="Break Wax Seal to Open Invitation"
                className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-full cursor-pointer focus:outline-none transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                {/* 3D Wax Seal Disc */}
                <div
                  className="w-full h-full rounded-full flex flex-col items-center justify-center transition-transform shadow-[0_15px_40px_rgba(0,0,0,0.38),inset_0_2px_6px_rgba(255,255,255,0.45),inset_0_-4px_8px_rgba(0,0,0,0.4)] border-2"
                  style={{
                    backgroundColor: sealColor,
                    borderColor: config.waxBorder,
                  }}
                >
                  {/* Monogram Initials */}
                  <span
                    className="font-cinzel text-lg sm:text-xl font-bold tracking-widest drop-shadow-md select-none"
                    style={{ color: config.waxTextColor }}
                  >
                    {monogram}
                  </span>

                  {/* Tactile Action Prompt */}
                  <span
                    className="font-cinzel text-[7px] sm:text-[8px] uppercase tracking-widest font-bold mt-1 opacity-90 drop-shadow-xs"
                    style={{ color: config.waxTextColor }}
                  >
                    Break Seal
                  </span>

                  {/* Shimmer on Hover */}
                  <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </button>
            </div>
          )}

          {/* Skip Button for Instant Access */}
          <button
            type="button"
            onClick={handleVideoFinished}
            className="motion-skip"
            title="Open Directly"
          >
            Skip Intro
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MODE B: FULL-VIEWPORT 3D PHYSICAL ENVELOPE (ROYAL VIVAH / THE PALACE)
  // =========================================================================
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Invitation Envelope"
      className={`fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-3 sm:p-8 overflow-hidden select-none transition-opacity duration-1000 ${
        animStage === 'finished' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backgroundColor: config.envelopeBg }}
    >
      {/* Background Soft Ambient Light Gradient & Shadow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.18)_100%)] pointer-events-none" />

      {/* IMMERSIVE PHYSICAL ENVELOPE (Pure Viewport - ZERO STRAY TEXT OUTSIDE) */}
      <div className="relative w-full max-w-[420px] sm:max-w-[560px] md:max-w-[660px] aspect-[1/1.24] sm:aspect-[1/1.18] perspective-envelope select-none">
        
        {/* Envelope Outer Pocket Box with Authentic Physical Depth & Beveled Shadow */}
        <div
          className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.25)] border"
          style={{
            backgroundColor: config.envelopeBg,
            borderColor: config.envelopeBorder,
          }}
        >
          {/* INSIDE ENVELOPE LINER (Revealed when flap unfolds) */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundColor: config.linerBg,
              backgroundImage: config.linerPattern,
              backgroundSize: '100% 100%, 16px 16px, 16px 16px',
            }}
          >
            {/* Inner Pocket Deep Shadow for realistic physical volume */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15 pointer-events-none" />
          </div>

          {/* 
            THE PHYSICAL GILDED INVITATION CARD / LETTER
            Glides upwards out of pocket in Slow Motion!
          */}
          <div
            className={`absolute left-3 right-3 sm:left-6 sm:right-6 z-10 rounded-xl sm:rounded-2xl p-6 sm:p-10 flex flex-col justify-between border shadow-[0_15px_45px_rgba(0,0,0,0.14)] transition-all duration-[1900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              animStage === 'card-sliding' || animStage === 'finished'
                ? '-translate-y-[84%] sm:-translate-y-[88%] scale-[1.03] shadow-[0_35px_80px_rgba(0,0,0,0.35)]'
                : 'top-6 bottom-6'
            }`}
            style={{
              backgroundColor: config.paperBg,
              borderColor: config.paperBorder,
              color: config.paperText,
            }}
          >
            {/* Elegant Corner Filigree Accents on Letter */}
            <div
              className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 rounded-tl-sm pointer-events-none opacity-60"
              style={{ borderColor: config.accentColor }}
            />
            <div
              className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 rounded-tr-sm pointer-events-none opacity-60"
              style={{ borderColor: config.accentColor }}
            />
            <div
              className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 rounded-bl-sm pointer-events-none opacity-60"
              style={{ borderColor: config.accentColor }}
            />
            <div
              className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br-sm pointer-events-none opacity-60"
              style={{ borderColor: config.accentColor }}
            />

            {/* City & Suave Header */}
            <div className="text-center pt-2">
              <span
                className="font-cinzel text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold block"
                style={{ color: config.accentColor }}
              >
                {venueCity}
              </span>
              <span className="font-cormorant italic text-xs sm:text-sm opacity-80 mt-0.5 block">
                Together With Their Families
              </span>
            </div>

            {/* Couple Calligraphy on Letter */}
            <div className="text-center my-auto py-3">
              <span className="font-cinzel text-[8px] sm:text-[9px] uppercase tracking-[0.3em] font-semibold block mb-1 opacity-70">
                Request The Pleasure Of Your Company
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
                {partner1} <br />
                <span className="font-pinyon text-4xl sm:text-6xl italic" style={{ color: config.accentColor }}>
                  &
                </span>{' '}
                {partner2}
              </h2>
            </div>

            {/* Personalized Guest Inscription on Letter */}
            <div
              className="text-center border-t pt-3"
              style={{ borderColor: `${config.accentColor}33` }}
            >
              <span
                className="font-cinzel text-[9px] uppercase tracking-wider font-bold block"
                style={{ color: config.accentColor }}
              >
                Special Invitation For
              </span>
              <span className="font-serif font-bold text-sm sm:text-base">
                {guestName}
              </span>
            </div>
          </div>

          {/* LEFT & RIGHT FOLDED TRIANGULAR FLAPS */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)',
              backgroundColor: config.envelopeBg,
              backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.06) 100%)',
              filter: 'drop-shadow(3px 0 6px rgba(0,0,0,0.08))',
            }}
          />
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)',
              backgroundColor: config.envelopeBg,
              backgroundImage: 'linear-gradient(225deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.06) 100%)',
              filter: 'drop-shadow(-3px 0 6px rgba(0,0,0,0.08))',
            }}
          />

          {/* BOTTOM FOLDED FLAP */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              clipPath: 'polygon(0% 100%, 50% 48%, 100% 100%)',
              backgroundColor: config.envelopeBg,
              backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.08) 0%, rgba(255,255,255,0.4) 100%)',
              filter: 'drop-shadow(0 -4px 10px rgba(0,0,0,0.12))',
            }}
          />

          {/* Guest Calligraphy Inscription on Front Pocket */}
          {animStage === 'idle' && (
            <div className="absolute left-6 right-6 top-[38%] -translate-y-1/2 z-25 text-center pointer-events-none">
              <span className="font-cinzel text-[8px] sm:text-[9px] uppercase tracking-[0.3em] font-semibold opacity-60 block mb-0.5">
                Hand-Delivered With Love To
              </span>
              <h3 className="font-pinyon text-3xl sm:text-4xl leading-tight drop-shadow-xs">
                {guestName}
              </h3>
            </div>
          )}

          {/* 
            TOP FOLDING TRIANGULAR FLAP (REALISTIC 3D PERSPECTIVE SLOW-MOTION ROTATION) 
            Smoothly swings 180 degrees backward in 3D slow motion!
          */}
          <div
            className={`absolute top-0 left-0 right-0 h-[62%] z-30 origin-top transition-transform duration-[1700ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
              animStage === 'idle'
                ? 'rotate-x-0'
                : animStage === 'cracking'
                ? 'rotate-x-12'
                : '-rotate-x-180'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              backgroundColor: config.flapBg,
              backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0.08) 100%)',
              filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.22))',
            }}
          >
            {/* Subtle Gold Foil Trim Line on Flap Edge */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 w-40 h-[1.5px] opacity-70"
              style={{ backgroundColor: config.accentColor }}
            />
          </div>

          {/* 
            REALISTIC PHYSICAL WAX SEAL (MOUNTED ON FLAP WITH 2-HALF FRACTURE)
          */}
          <div
            className={`absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-1000 ${
              animStage === 'finished' ? 'opacity-0 scale-125 pointer-events-none' : 'opacity-100'
            }`}
          >
            <button
              onClick={handleBreakPhysicalSeal}
              disabled={animStage !== 'idle'}
              aria-label="Break Wax Seal to Open Invitation"
              className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-full cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95"
            >
              {/* LEFT HALF OF WAX SEAL */}
              <div
                className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-[800ms] ease-out ${
                  animStage !== 'idle'
                    ? '-translate-x-3.5 -translate-y-1 -rotate-6 brightness-110 shadow-lg'
                    : 'translate-x-0 rotate-0'
                }`}
                style={{
                  clipPath: 'polygon(0% 0%, 54% 0%, 46% 100%, 0% 100%)',
                  backgroundColor: sealColor,
                  border: `2px solid ${config.waxBorder}`,
                  boxShadow: '0 12px 35px rgba(0,0,0,0.35), inset 0 2px 6px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.4)',
                }}
              >
                <span
                  className="font-cinzel text-lg sm:text-xl font-bold tracking-widest -ml-4 drop-shadow-md select-none"
                  style={{ color: config.waxTextColor }}
                >
                  {monogram.split('&')[0]?.trim()}
                </span>
              </div>

              {/* RIGHT HALF OF WAX SEAL */}
              <div
                className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-[800ms] ease-out ${
                  animStage !== 'idle'
                    ? 'translate-x-3.5 translate-y-1 rotate-6 brightness-110 shadow-lg'
                    : 'translate-x-0 rotate-0'
                }`}
                style={{
                  clipPath: 'polygon(54% 0%, 100% 0%, 100% 100%, 46% 100%)',
                  backgroundColor: sealColor,
                  border: `2px solid ${config.waxBorder}`,
                  boxShadow: '0 12px 35px rgba(0,0,0,0.35), inset 0 2px 6px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.4)',
                }}
              >
                <span
                  className="font-cinzel text-lg sm:text-xl font-bold tracking-widest ml-4 drop-shadow-md select-none"
                  style={{ color: config.waxTextColor }}
                >
                  {monogram.split('&')[1]?.trim() || monogram}
                </span>
              </div>

              {/* CENTER WAX SEAL EMBLEM & PROMPT */}
              <div
                className={`absolute inset-0 rounded-full flex flex-col items-center justify-center pointer-events-none transition-opacity duration-300 ${
                  animStage !== 'idle' ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <span
                  className="font-pinyon text-2xl sm:text-3xl leading-none -mt-1 drop-shadow-xs"
                  style={{ color: config.waxTextColor }}
                >
                  &
                </span>

                <span
                  className="font-cinzel text-[7px] sm:text-[8px] uppercase tracking-widest font-bold mt-0.5 opacity-90 drop-shadow-xs"
                  style={{ color: config.waxTextColor }}
                >
                  Break Seal
                </span>

                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
