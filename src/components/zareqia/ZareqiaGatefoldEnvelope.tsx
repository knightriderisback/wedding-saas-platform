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
          STAGE 1 LAYER: 3D EMBOSSED LIGHT SAGE GATEFOLD DOORS
          ======================================================== */}
      {/* LEFT SAGE DOOR */}
      <div
        onClick={handleOpen}
        className="absolute top-0 left-0 w-1/2 h-full z-30 cursor-pointer overflow-hidden transition-transform duration-[1150ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: doorsOpen ? 'translateX(-100%)' : 'translateX(0)',
          boxShadow: '16px 0 40px rgba(0,0,0,0.45)',
        }}
      >
        {/* Soft Sage Green Base with Embossed Botanical Foliage */}
        <div className="absolute inset-0 bg-[#869B77] overflow-hidden">
          <Image
            src="/templates/zareqia/embossed-botanical-doors.svg"
            alt="Sage Leaf Gatefold Left"
            fill
            unoptimized
            className="object-cover object-left"
            priority
          />
        </div>

        {/* Ambient lighting gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/25 pointer-events-none" />

        {/* Ultra-Fine Gold Hairline Cord on Center Seam (Matching Video f_0004.jpg) */}
        <div className="absolute top-0 right-0 w-[1.5px] h-full bg-gradient-to-b from-[#DFC07C] via-[#F3E5AB] to-[#997938] z-10 shadow-[0_0_1px_rgba(0,0,0,0.4)] pointer-events-none" />

        {/* ========================================================
            LEFT HALF OF SPLIT BAROQUE CARTOUCHE SEAL
            Glides smoothly to the left when doors open!
            (Matching exact video physics in f_0008.jpg)
            ======================================================== */}
        <div
          onClick={handleOpen}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[90px] h-[240px] overflow-hidden z-20 cursor-pointer pointer-events-auto"
        >
          <div className="relative w-[180px] h-[240px] left-0 drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
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

      {/* RIGHT SAGE DOOR */}
      <div
        onClick={handleOpen}
        className="absolute top-0 right-0 w-1/2 h-full z-30 cursor-pointer overflow-hidden transition-transform duration-[1150ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: doorsOpen ? 'translateX(100%)' : 'translateX(0)',
          boxShadow: '-16px 0 40px rgba(0,0,0,0.45)',
        }}
      >
        {/* Soft Sage Green Base with Embossed Botanical Foliage (Mirrored) */}
        <div className="absolute inset-0 bg-[#869B77] overflow-hidden scale-x-[-1]">
          <Image
            src="/templates/zareqia/embossed-botanical-doors.svg"
            alt="Sage Leaf Gatefold Right"
            fill
            unoptimized
            className="object-cover object-left"
            priority
          />
        </div>

        {/* Ambient lighting gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/15 via-transparent to-black/25 pointer-events-none" />

        {/* Ultra-Fine Gold Hairline Cord on Center Seam (Matching Video f_0004.jpg) */}
        <div className="absolute top-0 left-0 w-[1.5px] h-full bg-gradient-to-b from-[#DFC07C] via-[#F3E5AB] to-[#997938] z-10 shadow-[0_0_1px_rgba(0,0,0,0.4)] pointer-events-none" />

        {/* ========================================================
            RIGHT HALF OF SPLIT BAROQUE CARTOUCHE SEAL
            Glides smoothly to the right when doors open!
            (Matching exact video physics in f_0008.jpg)
            ======================================================== */}
        <div
          onClick={handleOpen}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[90px] h-[240px] overflow-hidden z-20 cursor-pointer pointer-events-auto"
        >
          <div className="relative w-[180px] h-[240px] -left-[90px] drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
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
    </div>
  );
};
