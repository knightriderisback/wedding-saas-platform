'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Globe } from 'lucide-react';

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
  audioSrc = '/audio/zareqia-saathiyaa.mp3',
  isAudioPlaying = false,
  onToggleAudio,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Play music
    if (onToggleAudio && !isAudioPlaying) {
      onToggleAudio();
    }

    // Call onOpenComplete callback after doors slide fully open
    setTimeout(() => {
      if (onOpenComplete) onOpenComplete();
    }, 1200);

    // Completely unmount envelope overlay after animation ends
    setTimeout(() => {
      setIsRendered(false);
    }, 1800);
  };

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden flex items-center justify-center select-none transition-opacity duration-700 ${
        isOpen ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      style={{ perspective: '1200px' }}
    >
      {/* LEFT GATEFOLD DOOR */}
      <div
        onClick={handleOpen}
        className="absolute top-0 left-0 w-1/2 h-full z-30 cursor-pointer overflow-hidden transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: isOpen ? 'translateX(-100%)' : 'translateX(0)',
          boxShadow: '10px 0 30px rgba(0,0,0,0.4)',
        }}
      >
        {/* Door Background Texture */}
        <div className="absolute inset-0 bg-[#607358]">
          <Image
            src="/templates/zareqia/gatefold-left-exact.jpg"
            alt="Sage Leaf Gatefold Left"
            fill
            className="object-cover object-right"
            priority
          />
        </div>

        {/* Embossed Paper lighting & shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/35 pointer-events-none" />

        {/* Golden Beaded Trim on Right Edge */}
        <div className="absolute top-0 right-0 w-[12px] h-full pointer-events-none flex flex-col items-center justify-between py-1 z-10">
          <div className="absolute right-[5px] top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-[#C4A265] via-[#E8D389] to-[#997938]" />
          {Array.from({ length: 70 }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#FFE89E] via-[#D4AF37] to-[#8C6D23] shadow-[0_1px_2px_rgba(0,0,0,0.5)] my-[2px] relative z-10"
              style={{
                boxShadow: '0 0.5px 1px rgba(0,0,0,0.4), inset 0 0.5px 0.5px rgba(255,255,255,0.7)',
              }}
            />
          ))}
        </div>

        {/* LEFT HALF OF SCALLOPED CARTUCHE SEAL */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
          style={{ width: '90px', height: '240px', overflow: 'hidden' }}
        >
          <div
            className="relative"
            style={{
              width: '180px',
              height: '240px',
              transform: 'translateX(0)',
            }}
          >
            <Image
              src="/templates/zareqia/seal-cartouche-full.png"
              alt="Seal Left Half"
              width={180}
              height={240}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* RIGHT GATEFOLD DOOR */}
      <div
        onClick={handleOpen}
        className="absolute top-0 right-0 w-1/2 h-full z-30 cursor-pointer overflow-hidden transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: isOpen ? 'translateX(100%)' : 'translateX(0)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.4)',
        }}
      >
        {/* Door Background Texture */}
        <div className="absolute inset-0 bg-[#607358]">
          <Image
            src="/templates/zareqia/gatefold-right-exact.jpg"
            alt="Sage Leaf Gatefold Right"
            fill
            className="object-cover object-left"
            priority
          />
        </div>

        {/* Embossed Paper lighting & shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/25 via-transparent to-black/35 pointer-events-none" />

        {/* Golden Beaded Trim on Left Edge */}
        <div className="absolute top-0 left-0 w-[12px] h-full pointer-events-none flex flex-col items-center justify-between py-1 z-10">
          <div className="absolute left-[5px] top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-[#C4A265] via-[#E8D389] to-[#997938]" />
          {Array.from({ length: 70 }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#FFE89E] via-[#D4AF37] to-[#8C6D23] shadow-[0_1px_2px_rgba(0,0,0,0.5)] my-[2px] relative z-10"
              style={{
                boxShadow: '0 0.5px 1px rgba(0,0,0,0.4), inset 0 0.5px 0.5px rgba(255,255,255,0.7)',
              }}
            />
          ))}
        </div>

        {/* RIGHT HALF OF SCALLOPED CARTUCHE SEAL */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
          style={{ width: '90px', height: '240px', overflow: 'hidden' }}
        >
          <div
            className="relative"
            style={{
              width: '180px',
              height: '240px',
              transform: 'translateX(-90px)',
            }}
          >
            <Image
              src="/templates/zareqia/seal-cartouche-full.png"
              alt="Seal Right Half"
              width={180}
              height={240}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* CURTAIN REVEAL LAYER (Behind Doors, In Front of Courtyard) */}
      <div
        className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-1000 ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Left Curtain Drape */}
        <div
          className="absolute top-0 left-0 w-1/2 h-full transition-transform duration-[1400ms] ease-out"
          style={{
            transform: isOpen ? 'translateX(-80%) scaleX(0.4)' : 'translateX(0) scaleX(1)',
            transformOrigin: 'left center',
            background: 'linear-gradient(90deg, #E8DFCE 0%, #D8CBB6 40%, #EFE8DC 70%, #C9BAA3 100%)',
            boxShadow: 'inset -20px 0 40px rgba(0,0,0,0.15)',
          }}
        />
        {/* Right Curtain Drape */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full transition-transform duration-[1400ms] ease-out"
          style={{
            transform: isOpen ? 'translateX(80%) scaleX(0.4)' : 'translateX(0) scaleX(1)',
            transformOrigin: 'right center',
            background: 'linear-gradient(270deg, #E8DFCE 0%, #D8CBB6 40%, #EFE8DC 70%, #C9BAA3 100%)',
            boxShadow: 'inset 20px 0 40px rgba(0,0,0,0.15)',
          }}
        />
      </div>

      {/* FLOATING CONTROLS (VISIBLE ON CLOSED ENVELOPE) */}
      {!isOpen && (
        <>
          {/* Sound / Mute Pill (Bottom Left or Top Right like video) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleAudio) onToggleAudio();
            }}
            aria-label="Toggle Sound"
            className="absolute top-5 right-5 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md text-white/90 text-xs font-['Cinzel',serif] tracking-wider uppercase border border-white/20 hover:bg-black/35 transition-all shadow-lg active:scale-95"
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#E8D389] animate-pulse" />
                <span>Music On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-white/70" />
                <span>Mute</span>
              </>
            )}
          </button>

          {/* Language Switcher (Bottom Left) */}
          {onToggleLanguage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLanguage();
              }}
              aria-label="Toggle Language"
              className="absolute bottom-6 left-6 z-40 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[#FAF7F0] text-xs font-['Cinzel',serif] tracking-widest uppercase border border-white/30 hover:bg-white/30 transition-all shadow-lg active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-[#E8D389]" />
              <span>{isArabic ? 'English' : 'العربية'}</span>
            </button>
          )}

          {/* Tap Prompt Hint */}
          <div
            onClick={handleOpen}
            className="absolute bottom-16 z-40 text-center cursor-pointer pointer-events-auto"
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
