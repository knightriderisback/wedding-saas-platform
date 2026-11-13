'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RoyalRealisticEnvelopeProps {
  onCurtainsOpen?: () => void;
  onOpenComplete?: () => void;
  isArabic?: boolean;
  onToggleLanguage?: () => void;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
  videoSrc?: string; // Optional user video for CGI envelope
}

export const RoyalRealisticEnvelope: React.FC<RoyalRealisticEnvelopeProps> = ({
  onCurtainsOpen,
  onOpenComplete,
  isArabic = false,
  onToggleLanguage,
  isAudioPlaying = false,
  onToggleAudio,
  videoSrc,
}) => {
  const [openStage, setOpenStage] = useState<'closed' | 'seal-cracking' | 'doors-swinging' | 'curtains-parting' | 'done'>('closed');
  const [isRendered, setIsRendered] = useState(true);

  const handleOpen = () => {
    if (openStage !== 'closed') return;

    // Stage 1: Seal cracking with sparkle burst & audio start
    setOpenStage('seal-cracking');

    // Trigger audio immediately on user tap gesture
    if (onToggleAudio && !isAudioPlaying) {
      onToggleAudio();
    }

    // Gold sparkle micro-burst
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#FFE066', '#D4AF37', '#997300', '#FAF8F5'],
        disableForReducedMotion: true,
      });
    } catch {
      // ignore
    }

    // Stage 2: 3D Gatefold doors swing open on their outer hinges (300ms)
    setTimeout(() => {
      setOpenStage('doors-swinging');
    }, 300);

    // Stage 3: Silk curtains part open (1100ms)
    setTimeout(() => {
      setOpenStage('curtains-parting');
      if (onCurtainsOpen) onCurtainsOpen();
    }, 1100);

    // Stage 4: Envelope lifecycle complete (2400ms)
    setTimeout(() => {
      setOpenStage('done');
      if (onOpenComplete) onOpenComplete();
      setIsRendered(false);
    }, 2400);
  };

  if (!isRendered) return null;

  // If user provided a custom CGI envelope video, render the video player
  if (videoSrc) {
    return (
      <div className="absolute inset-0 z-40 bg-black flex items-center justify-center">
        <video
          src={videoSrc}
          autoPlay
          playsInline
          muted={!isAudioPlaying}
          onEnded={() => {
            if (onOpenComplete) onOpenComplete();
            setIsRendered(false);
          }}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const isDoorsSwinging = openStage === 'doors-swinging' || openStage === 'curtains-parting' || openStage === 'done';
  const isCurtainsParting = openStage === 'curtains-parting' || openStage === 'done';

  return (
    <div
      className={`absolute inset-0 z-30 flex items-center justify-center select-none transition-opacity duration-700 ${
        openStage === 'done' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        perspective: '1600px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* ========================================================
          STAGE 2: PLEATED SILK CURTAINS (Underneath the 3D doors)
          ======================================================== */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-700 ${
          openStage === 'done' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Left Curtain Panel */}
        <div
          className="absolute top-0 left-0 w-1/2 h-full overflow-hidden transition-all duration-[1250ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: isCurtainsParting
              ? 'translateX(-100%) scaleX(0.2) translateY(-3%)'
              : 'translateX(0) scaleX(1) translateY(0)',
            transformOrigin: 'top left',
            borderBottomRightRadius: isCurtainsParting ? '80px' : '0px',
            boxShadow: '20px 0 45px rgba(0,0,0,0.45)',
          }}
        >
          <div className="relative w-full h-full bg-[#EAE2D3]">
            <Image
              src="/templates/zareqia/curtains-closed-hd.jpg"
              alt="Silk Curtains Left"
              fill
              className="object-cover object-left"
              priority
            />
            {/* Fabric Crease Shadow */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/35 pointer-events-none" />

            {/* Vertical Golden Beaded Edge on Inner Seam */}
            <div className="absolute top-0 right-0 w-[12px] h-full pointer-events-none flex flex-col items-center justify-between py-1 z-10">
              <div className="absolute right-[5px] top-0 bottom-0 w-[1.5px] bg-[#C4A265]" />
              {Array.from({ length: 65 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#FFE89E] via-[#D4AF37] to-[#8C6D23] shadow-sm my-[2px] relative z-10"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Curtain Panel */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full overflow-hidden transition-all duration-[1250ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: isCurtainsParting
              ? 'translateX(100%) scaleX(0.2) translateY(-3%)'
              : 'translateX(0) scaleX(1) translateY(0)',
            transformOrigin: 'top right',
            borderBottomLeftRadius: isCurtainsParting ? '80px' : '0px',
            boxShadow: '-20px 0 45px rgba(0,0,0,0.45)',
          }}
        >
          <div className="relative w-full h-full bg-[#EAE2D3]">
            <Image
              src="/templates/zareqia/curtains-closed-hd.jpg"
              alt="Silk Curtains Right"
              fill
              className="object-cover object-right"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/25 via-transparent to-black/35 pointer-events-none" />

            {/* Vertical Golden Beaded Edge on Inner Seam */}
            <div className="absolute top-0 left-0 w-[12px] h-full pointer-events-none flex flex-col items-center justify-between py-1 z-10">
              <div className="absolute left-[5px] top-0 bottom-0 w-[1.5px] bg-[#C4A265]" />
              {Array.from({ length: 65 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#FFE89E] via-[#D4AF37] to-[#8C6D23] shadow-sm my-[2px] relative z-10"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          STAGE 1: 3D REALISTIC PERSPECTIVE SWINGING DOORS
          Double-sided 3D flaps: exterior sage green + interior gold foil
          ======================================================== */}

      {/* LEFT SWINGING DOOR */}
      <div
        onClick={handleOpen}
        className="absolute top-0 left-0 w-1/2 h-full z-30 cursor-pointer overflow-visible transition-transform duration-[1250ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{
          transformOrigin: 'left center',
          transform: isDoorsSwinging
            ? 'rotateY(-112deg)'
            : 'rotateY(0deg)',
          transformStyle: 'preserve-3d',
          boxShadow: isDoorsSwinging
            ? '25px 0 50px rgba(0,0,0,0.6)'
            : '12px 0 25px rgba(0,0,0,0.3)',
        }}
      >
        {/* Exterior Sage Green Flap with botanical texture (Front Face) */}
        <div
          className="absolute inset-0 bg-[#869B77] overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Image
            src="/templates/zareqia/embossed-botanical-doors.svg"
            alt="Sage Leaf Gatefold Left"
            fill
            unoptimized
            className="object-cover object-left"
            priority
          />
          {/* Paper Sheen & Dynamic Lighting */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/30 pointer-events-none transition-opacity duration-700 ${
              isDoorsSwinging ? 'opacity-80' : 'opacity-40'
            }`}
          />
          {/* Gold Hairline Seam Cord */}
          <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-[#DFC07C] via-[#F3E5AB] to-[#997938] z-10 shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
        </div>

        {/* Interior Gold Foil Damask Liner (Back Face - Visible when swung open!) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#8C6D23] via-[#D4AF37] to-[#634812] overflow-hidden border-r border-[#DFC07C]"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#FAF8F5_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* ========================================================
            LEFT HALF OF SPLIT BAROQUE WAX CARTOUCHE
            ======================================================== */}
        <div
          className={`absolute right-0 top-1/2 -translate-y-1/2 w-[90px] h-[240px] overflow-hidden z-20 transition-transform duration-500 ${
            openStage === 'seal-cracking' ? 'scale-105' : 'scale-100'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="relative w-[180px] h-[240px] left-0 drop-shadow-[0_14px_28px_rgba(0,0,0,0.5)]">
            <Image
              src="/templates/zareqia/seal-cartouche-ultra.svg"
              alt="Seal Left Half"
              fill
              unoptimized
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* RIGHT SWINGING DOOR */}
      <div
        onClick={handleOpen}
        className="absolute top-0 right-0 w-1/2 h-full z-30 cursor-pointer overflow-visible transition-transform duration-[1250ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{
          transformOrigin: 'right center',
          transform: isDoorsSwinging
            ? 'rotateY(112deg)'
            : 'rotateY(0deg)',
          transformStyle: 'preserve-3d',
          boxShadow: isDoorsSwinging
            ? '-25px 0 50px rgba(0,0,0,0.6)'
            : '-12px 0 25px rgba(0,0,0,0.3)',
        }}
      >
        {/* Exterior Sage Green Flap (Front Face) */}
        <div
          className="absolute inset-0 bg-[#869B77] overflow-hidden scale-x-[-1]"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Image
            src="/templates/zareqia/embossed-botanical-doors.svg"
            alt="Sage Leaf Gatefold Right"
            fill
            unoptimized
            className="object-cover object-left"
            priority
          />
          <div
            className={`absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-black/30 pointer-events-none transition-opacity duration-700 ${
              isDoorsSwinging ? 'opacity-80' : 'opacity-40'
            }`}
          />
          <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[#DFC07C] via-[#F3E5AB] to-[#997938] z-10 shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
        </div>

        {/* Interior Gold Foil Damask Liner (Back Face - Visible when swung open!) */}
        <div
          className="absolute inset-0 bg-gradient-to-bl from-[#8C6D23] via-[#D4AF37] to-[#634812] overflow-hidden border-l border-[#DFC07C]"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#FAF8F5_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* ========================================================
            RIGHT HALF OF SPLIT BAROQUE WAX CARTOUCHE
            ======================================================== */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-[90px] h-[240px] overflow-hidden z-20 transition-transform duration-500 ${
            openStage === 'seal-cracking' ? 'scale-105' : 'scale-100'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="relative w-[180px] h-[240px] -left-[90px] drop-shadow-[0_14px_28px_rgba(0,0,0,0.5)]">
            <Image
              src="/templates/zareqia/seal-cartouche-ultra.svg"
              alt="Seal Right Half"
              fill
              unoptimized
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Floating Center Tap Prompt Badge */}
      <AnimatePresence>
        {openStage === 'closed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleOpen}
            className="absolute bottom-16 z-40 cursor-pointer pointer-events-auto"
          >
            <div className="px-5 py-2 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md border border-[#B59A57]/60 shadow-[0_8px_20px_rgba(0,0,0,0.3)] flex items-center gap-2 text-[#273822] text-xs font-['Cinzel',serif] tracking-widest font-bold uppercase hover:bg-white active:scale-95 transition-all">
              <Sparkles className="w-3.5 h-3.5 text-[#B59A57] animate-pulse" />
              <span>TAP TO UNVEIL</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
