'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ZareqiaGatefoldEnvelopeProps {
  onCurtainsOpen?: () => void;
  onOpenComplete?: () => void;
  isArabic?: boolean;
  onToggleLanguage?: () => void;
  audioSrc?: string;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
}

export const ZareqiaGatefoldEnvelope: React.FC<ZareqiaGatefoldEnvelopeProps> = ({
  onCurtainsOpen,
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

    // Start Stage 2: Curtains part open after doors slide outward (850ms)
    setTimeout(() => {
      setOpenStage('curtains-opening');
      if (onCurtainsOpen) onCurtainsOpen();
    }, 850);

    // Stage 3: After curtains fully parted (2400ms), envelope completes its lifecycle
    setTimeout(() => {
      setOpenStage('done');
      if (onOpenComplete) onOpenComplete();
      setIsRendered(false);
    }, 2400);
  };

  if (!isRendered) return null;

  const doorsOpen = openStage !== 'closed';
  const curtainsOpen = openStage === 'curtains-opening' || openStage === 'done';

  return (
    <div
      className={`absolute inset-0 z-30 overflow-hidden flex items-center justify-center select-none transition-opacity duration-700 ${
        openStage === 'done' ? 'opacity-0 pointer-events-none' : 'opacity-100'
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
        <div className="absolute inset-0 bg-[#596A4F] overflow-hidden">
          <Image
            src="/templates/zareqia/embossed-botanical-doors.svg"
            alt="Sage Leaf Gatefold Left"
            fill
            unoptimized
            className="object-cover object-right"
            priority
          />
        </div>

        {/* Ambient lighting gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/45 pointer-events-none" />

        {/* Vertical Gold Ribbon / Cord Running Down Center Seam */}
        <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-[#DFC07C] via-[#F3E5AB] to-[#997938] z-10 shadow-sm pointer-events-none" />

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

      {/* RIGHT SAGE DOOR (overflow-visible allows centered seal to extend across seam) */}
      <div
        onClick={handleOpen}
        className="absolute top-0 right-0 w-1/2 h-full z-30 cursor-pointer overflow-visible transition-transform duration-[1150ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: doorsOpen ? 'translateX(100%)' : 'translateX(0)',
          boxShadow: '-16px 0 40px rgba(0,0,0,0.55)',
        }}
      >
        {/* Sage Green Base with Embossed Botanical Branches (Mirrored) */}
        <div className="absolute inset-0 bg-[#596A4F] overflow-hidden scale-x-[-1]">
          <Image
            src="/templates/zareqia/embossed-botanical-doors.svg"
            alt="Sage Leaf Gatefold Right"
            fill
            unoptimized
            className="object-cover object-right"
            priority
          />
        </div>

        {/* Ambient lighting gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/25 via-transparent to-black/45 pointer-events-none" />

        {/* Vertical Gold Ribbon / Cord Running Down Center Seam */}
        <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[#DFC07C] via-[#F3E5AB] to-[#997938] z-10 shadow-sm pointer-events-none" />

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
          onClick={handleOpen}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-40 pointer-events-auto cursor-pointer"
          style={{ width: '180px', height: '240px' }}
        >
          <div className="relative w-full h-full transform hover:scale-105 active:scale-95 transition-transform duration-300">
            <Image
              src="/templates/zareqia/seal-cartouche-ultra.svg"
              alt="Baroque Cartouche Seal - Tap To Open"
              fill
              unoptimized
              className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};
