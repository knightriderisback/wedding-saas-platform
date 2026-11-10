'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Globe, Sparkles } from 'lucide-react';

interface ZareqiaGatefoldEnvelopeProps {
  onOpenComplete?: () => void;
  isArabic?: boolean;
  onToggleLanguage?: () => void;
  audioSrc?: string;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
}

export const ZareqiaGatefoldEnvelope: React.FC<ZareqiaGatefoldEnvelopeProps> = ({
  onOpenComplete,
  isArabic = false,
  onToggleLanguage,
  audioSrc = '/audio/indian-wedding-instrumental.mp3',
  isAudioPlaying = false,
  onToggleAudio,
}) => {
  const [openStage, setOpenStage] = useState<'closed' | 'doors-opening' | 'curtains-opening' | 'done'>('closed');
  const [isRendered, setIsRendered] = useState(true);

  const handleOpen = () => {
    if (openStage !== 'closed') return;

    // Start Stage 1: Sage green doors slide open smoothly
    setOpenStage('doors-opening');

    // Trigger Indian wedding instrumental audio on first user gesture
    if (onToggleAudio && !isAudioPlaying) {
      onToggleAudio();
    }

    // Start Stage 2: Curtains part open after doors slide outward (750ms)
    setTimeout(() => {
      setOpenStage('curtains-opening');
    }, 750);

    // Call onOpenComplete so hero typography fades in gracefully
    setTimeout(() => {
      if (onOpenComplete) onOpenComplete();
    }, 1800);

    // Unmount envelope overlay after animation ends
    setTimeout(() => {
      setOpenStage('done');
      setIsRendered(false);
    }, 2500);
  };

  if (!isRendered) return null;

  const doorsOpen = openStage !== 'closed';
  const curtainsOpen = openStage === 'curtains-opening' || openStage === 'done';

  return (
    <div
      className={`absolute inset-0 z-50 overflow-hidden flex items-center justify-center select-none transition-opacity duration-700 ${
        curtainsOpen ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      style={{ perspective: '1400px' }}
    >
      {/* ========================================================
          STAGE 2 LAYER: PLEATED SILK CURTAINS (Behind green doors)
          ======================================================== */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-1000 ${
          openStage === 'done' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Left Curtain Panel */}
        <div
          className="absolute top-0 left-0 w-1/2 h-full overflow-hidden transition-all duration-[1400ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: curtainsOpen ? 'translateX(-100%) scaleX(0.25) translateY(-4%)' : 'translateX(0) scaleX(1) translateY(0)',
            transformOrigin: 'top left',
            borderBottomRightRadius: curtainsOpen ? '80px' : '0px',
            boxShadow: '18px 0 40px rgba(0,0,0,0.4)',
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
            {/* Silk Fold Gradient & Shadow */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/35 pointer-events-none" />

            {/* Vertical Golden Beaded Edge on Inner Seam */}
            <div className="absolute top-0 right-0 w-[12px] h-full pointer-events-none flex flex-col items-center justify-between py-1 z-10">
              <div className="absolute right-[5px] top-0 bottom-0 w-[1.5px] bg-[#C4A265]" />
              {Array.from({ length: 75 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-to-br from-[#FFE89E] via-[#D4AF37] to-[#8C6D23] shadow-sm my-[1.5px] relative z-10"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Curtain Panel */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full overflow-hidden transition-all duration-[1400ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: curtainsOpen ? 'translateX(100%) scaleX(0.25) translateY(-4%)' : 'translateX(0) scaleX(1) translateY(0)',
            transformOrigin: 'top right',
            borderBottomLeftRadius: curtainsOpen ? '80px' : '0px',
            boxShadow: '-18px 0 40px rgba(0,0,0,0.4)',
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
              {Array.from({ length: 75 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-to-br from-[#FFE89E] via-[#D4AF37] to-[#8C6D23] shadow-sm my-[1.5px] relative z-10"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          STAGE 1 LAYER: 3D EMBOSSED SAGE GREEN GATEFOLD DOORS
          ======================================================== */}
      {/* LEFT SAGE DOOR */}
      <div
        onClick={handleOpen}
        className="absolute top-0 left-0 w-1/2 h-full z-30 cursor-pointer overflow-hidden transition-transform duration-[1150ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: doorsOpen ? 'translateX(-100%)' : 'translateX(0)',
          boxShadow: '16px 0 40px rgba(0,0,0,0.55)',
        }}
      >
        {/* Sage Green Base with Embossed Botanical Branches */}
        <div className="absolute inset-0 bg-[#596A4F]">
          <Image
            src="/templates/zareqia/embossed-botanical-doors.svg"
            alt="Sage Leaf Gatefold Left"
            fill
            className="object-cover object-right"
            priority
          />
        </div>

        {/* Ambient lighting gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/45 pointer-events-none" />

        {/* Vertical Gold Ribbon / Cord Running Down Center Seam */}
        <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-[#DFC07C] via-[#F3E5AB] to-[#997938] z-10 shadow-sm" />

        {/* Golden Beaded Trim on Right Edge */}
        <div className="absolute top-0 right-0 w-[12px] h-full pointer-events-none flex flex-col items-center justify-between py-1 z-10">
          <div className="absolute right-[5px] top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-[#C4A265] via-[#E8D389] to-[#997938]" />
          {Array.from({ length: 75 }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#FFE89E] via-[#D4AF37] to-[#8C6D23] shadow-[0_1px_2px_rgba(0,0,0,0.5)] my-[1.5px] relative z-10"
              style={{
                boxShadow: '0 0.5px 1px rgba(0,0,0,0.4), inset 0 0.5px 0.5px rgba(255,255,255,0.7)',
              }}
            />
          ))}
        </div>
      </div>

      {/* RIGHT SAGE DOOR */}
      <div
        onClick={handleOpen}
        className="absolute top-0 right-0 w-1/2 h-full z-30 cursor-pointer overflow-hidden transition-transform duration-[1150ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: doorsOpen ? 'translateX(100%)' : 'translateX(0)',
          boxShadow: '-16px 0 40px rgba(0,0,0,0.55)',
        }}
      >
        {/* Sage Green Base with Embossed Botanical Branches (Mirrored) */}
        <div className="absolute inset-0 bg-[#596A4F] scale-x-[-1]">
          <Image
            src="/templates/zareqia/embossed-botanical-doors.svg"
            alt="Sage Leaf Gatefold Right"
            fill
            className="object-cover object-right"
            priority
          />
        </div>

        {/* Ambient lighting gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/25 via-transparent to-black/45 pointer-events-none" />

        {/* Vertical Gold Ribbon / Cord Running Down Center Seam */}
        <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[#DFC07C] via-[#F3E5AB] to-[#997938] z-10 shadow-sm" />

        {/* Golden Beaded Trim on Left Edge */}
        <div className="absolute top-0 left-0 w-[12px] h-full pointer-events-none flex flex-col items-center justify-between py-1 z-10">
          <div className="absolute left-[5px] top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-[#C4A265] via-[#E8D389] to-[#997938]" />
          {Array.from({ length: 75 }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#FFE89E] via-[#D4AF37] to-[#8C6D23] shadow-[0_1px_2px_rgba(0,0,0,0.5)] my-[1.5px] relative z-10"
              style={{
                boxShadow: '0 0.5px 1px rgba(0,0,0,0.4), inset 0 0.5px 0.5px rgba(255,255,255,0.7)',
              }}
            />
          ))}
        </div>

        {/* ========================================================
            BAROQUE CARTOUCHE SEAL (Affixed to Right Door)
            When right door slides open, the seal smoothly glides with it!
            (Matching exact video behavior in f_0006.jpg & f_0007.jpg)
            ======================================================== */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-40 pointer-events-none cursor-pointer"
          style={{ width: '180px', height: '240px' }}
        >
          <div className="relative w-full h-full transform hover:scale-105 transition-transform duration-300">
            <Image
              src="/templates/zareqia/seal-cartouche-ultra.svg"
              alt="Baroque Cartouche Seal - Tap To Open"
              fill
              className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]"
              priority
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          FLOATING CONTROLS (ON CLOSED ENVELOPE)
          ======================================================== */}
      {!doorsOpen && (
        <>
          {/* Sound / Mute Toggle (Top-Right Frosted Glass Pill) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleAudio) onToggleAudio();
            }}
            aria-label="Toggle Sound"
            className="absolute top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-md text-white/95 text-xs font-['Cinzel',serif] tracking-wider uppercase border border-white/20 hover:bg-black/50 transition-all shadow-lg active:scale-95"
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#FFE89E] animate-pulse" />
                <span>On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-white/75" />
                <span>Mute</span>
              </>
            )}
          </button>

          {/* Language Switcher (Bottom-Left Frosted Glass Pill) */}
          {onToggleLanguage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLanguage();
              }}
              aria-label="Toggle Language"
              className="absolute bottom-5 left-5 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/35 backdrop-blur-md text-[#FAF7F0] text-xs font-['Cinzel',serif] tracking-widest uppercase border border-white/25 hover:bg-black/50 transition-all shadow-lg active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-[#FFE89E]" />
              <span>{isArabic ? 'English' : 'Arabic'}</span>
            </button>
          )}

          {/* "Use this Design" (Bottom-Center Frosted Glass Pill) */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <span className="px-3.5 py-1.5 rounded-full bg-black/35 backdrop-blur-md text-white/90 text-[11px] font-['Cinzel',serif] tracking-widest uppercase border border-white/20 shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#E8D389]" />
              <span>Use this Design</span>
            </span>
          </div>

          {/* Tap Prompt Hint */}
          <div
            onClick={handleOpen}
            className="absolute bottom-16 z-50 text-center cursor-pointer pointer-events-auto"
          >
            <span className="font-['Cinzel',serif] text-[11px] uppercase tracking-[0.3em] text-[#F3EEDB]/90 drop-shadow animate-pulse">
              {isArabic ? 'اضغط لفتح بطاقة الدعوة' : 'TAP TO OPEN INVITATION'}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
