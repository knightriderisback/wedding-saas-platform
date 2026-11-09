'use client';

import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Check } from 'lucide-react';
import { royalSitarAudio } from '@/lib/sitarSynth';
import { INVITATION_TRANSLATIONS, InvitationLanguage } from '@/lib/invitationI18n';

interface CanvasScratchCardProps {
  weddingDateStr: string;
  venueStr: string;
  language?: InvitationLanguage;
}

export const CanvasScratchCard: React.FC<CanvasScratchCardProps> = ({
  weddingDateStr,
  venueStr,
  language = 'en',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  const t = INVITATION_TRANSLATIONS[language];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth || 400);
    const height = (canvas.height = canvas.offsetHeight || 220);

    // 1. Rich 24K Molten Gold Foil Base (Directly pressed on paper)
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#B8860B');
    grad.addColorStop(0.2, '#D4AF37');
    grad.addColorStop(0.4, '#FAF0BE');
    grad.addColorStop(0.6, '#D4AF37');
    grad.addColorStop(0.85, '#AA820A');
    grad.addColorStop(1, '#7D5F04');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Ornate Royal Indian Jharokha Arch Border
    ctx.strokeStyle = '#543F02';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, width - 16, height - 16);

    ctx.strokeStyle = '#FFF8DC';
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // 3. Indian Paisley / Mandala Corner Accents
    const drawCornerKalka = (cx: number, cy: number) => {
      ctx.save();
      ctx.strokeStyle = 'rgba(84, 63, 2, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };
    drawCornerKalka(22, 22);
    drawCornerKalka(width - 22, 22);
    drawCornerKalka(22, height - 22);
    drawCornerKalka(width - 22, height - 22);

    // 4. Auspicious Shloka Header
    ctx.fillStyle = '#401018';
    ctx.font = 'bold 15px "Cormorant Garamond", serif';
    ctx.textAlign = 'center';
    ctx.fillText('॥ ॐ श्री गणेशाय नमः ॥', width / 2, 36);

    // 5. Grand Indian Vivah Lagna Prompt
    ctx.fillStyle = '#2A1802';
    ctx.font = 'bold 18px "Cinzel", serif';
    ctx.fillText(t.scratchGoldFoilPrompt, width / 2, height / 2 - 12);

    ctx.fillStyle = '#5A3D06';
    ctx.font = 'italic 15px "Cormorant Garamond", serif';
    ctx.fillText(t.scratchGoldFoilSubtitle, width / 2, height / 2 + 16);

    ctx.fillStyle = '#401018';
    ctx.font = 'bold 11px "Montserrat", sans-serif';
    ctx.fillText(language === 'en' ? '✦ SCRATCH TO UNVEIL THE SACRED DATE ✦' : '✦ स्पर्श कर शुभ मुहूर्त उद्घाटित करें ✦', width / 2, height / 2 + 42);
  }, [language, t]);

  const scratch = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2, false);
    ctx.fill();

    checkRevealedPercentage(ctx, canvas.width, canvas.height);
  };

  const checkRevealedPercentage = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    try {
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      let transparentCount = 0;

      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) {
          transparentCount++;
        }
      }

      const totalSampled = pixels.length / 16;
      const percentage = (transparentCount / totalSampled) * 100;

      if (percentage > 35 && !isRevealed) {
        setIsRevealed(true);
        royalSitarAudio.playWaxCrack();

        confetti({
          particleCount: 110,
          spread: 95,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FAF4E3', '#9B1C2E', '#F9CA24', '#7A1423', '#FFFDF9'],
        });
      }
    } catch {
      // ignore
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => setIsScratching(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsScratching(true);
    if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isScratching) return;
    if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  return (
    <div className="relative max-w-lg mx-auto my-6 select-none">
      {/* Golden Glitter Sparkles */}
      <span className="absolute -top-3 -left-3 text-lg glitter-sparkle pointer-events-none">✨</span>
      <span className="absolute -top-3 -right-3 text-lg glitter-sparkle-delayed pointer-events-none">✨</span>
      <span className="absolute -bottom-3 -left-3 text-lg glitter-sparkle-delayed pointer-events-none">✨</span>
      <span className="absolute -bottom-3 -right-3 text-lg glitter-sparkle pointer-events-none">✨</span>

      {/* Royal Inscription Plate (Flat on Paper - Zero Drop Shadow) */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[1.75/1] rounded-sm overflow-hidden border-2 border-[#D4AF37] select-none"
      >
        {/* REVEALED CONTENT BENEATH (ROYAL KUMKUM VELVET & GOLD FOIL PATRIKA) */}
        <div className="absolute inset-0 flex flex-col items-center justify-between p-5 text-center z-0 bg-gradient-to-br from-[#7A1423] via-[#9B1C2E] to-[#520B16] text-[#FAF4E3] overflow-hidden">
          {/* Subtle Golden Mandala Watermark */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.25)_0%,transparent_70%)] pointer-events-none" />

          {/* Top Auspicious Inscription */}
          <div className="relative z-10 space-y-0.5">
            <span className="font-serif text-[11px] sm:text-xs tracking-[0.25em] text-[#F3E5AB] uppercase block font-semibold">
              ॥ ॐ श्री गणेशाय नमः ॥
            </span>
            <span className="font-cormorant italic text-sm sm:text-base text-[#FDFBF7] block">
              {t.scratchRevealHeading}
            </span>
          </div>

          {/* Main Hand-Calligraphed Sacred Wedding Date (Clear, High Contrast & Readable) */}
          <div className="relative z-10 py-1">
            <h4 className="font-serif text-2xl sm:text-4xl font-bold text-[#FAF4E3] leading-tight tracking-wide drop-shadow-sm">
              {weddingDateStr}
            </h4>
            <span className="font-cormorant italic text-xs sm:text-sm text-[#F3E5AB] block mt-1">
              {t.scratchRevealRitual}
            </span>
          </div>

          {/* Venue & Blessings Bottom Note */}
          <div className="relative z-10 border-t border-[#D4AF37]/40 pt-2 w-full flex items-center justify-between text-xs font-cormorant italic text-[#FDFBF7] px-2">
            <span className="truncate max-w-[65%] font-medium">
              📍 {venueStr}
            </span>
            <span className="text-[#F3E5AB] font-serif font-bold text-[10px] tracking-wider uppercase">
              {t.scratchRevealBlessing}
            </span>
          </div>
        </div>

        {/* 24K GOLD FOIL SCRATCH CANVAS OVERLAY */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="absolute inset-0 w-full h-full scratch-canvas z-10 transition-opacity duration-700 cursor-grab active:cursor-grabbing"
          />
        )}
      </div>

      {isRevealed && (
        <div className="text-center mt-3 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-cormorant italic text-[#7A1423] bg-[#FAF5E8] border border-[#D4AF37] font-bold">
            <Check className="w-3.5 h-3.5 text-[#AA820A]" />
            {language === 'en' ? 'Auspicious Lagna Muhurat Sealed in the Stars!' : 'शुभ लग्न मुहूर्त सप्रेम उद्घाटित!'}
          </span>
        </div>
      )}
    </div>
  );
};
