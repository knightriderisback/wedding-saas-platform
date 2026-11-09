'use client';

import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Sparkles, Check, Heart } from 'lucide-react';
import { royalSitarAudio } from '@/lib/sitarSynth';

interface CanvasScratchCardProps {
  weddingDateStr: string;
  venueStr: string;
}

export const CanvasScratchCard: React.FC<CanvasScratchCardProps> = ({
  weddingDateStr,
  venueStr,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth || 400);
    const height = (canvas.height = canvas.offsetHeight || 220);

    // 1. Rich 24K Molten Gold Foil Base
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
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.strokeStyle = '#FFF8DC';
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, width - 28, height - 28);

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
    drawCornerKalka(24, 24);
    drawCornerKalka(width - 24, 24);
    drawCornerKalka(24, height - 24);
    drawCornerKalka(width - 24, height - 24);

    // 4. Auspicious Shloka & Kalash Header
    ctx.fillStyle = '#401018';
    ctx.font = 'bold 15px "Cormorant Garamond", serif';
    ctx.textAlign = 'center';
    ctx.fillText('॥ ॐ श्री गणेशाय नमः ॥', width / 2, 38);

    // 5. Grand Indian Vivah Lagna Prompt in Calligraphy
    ctx.fillStyle = '#2A1802';
    ctx.font = 'bold 18px "Cinzel", serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('✦ शुभ विवाह लग्न मुहूर्त ✦', width / 2, height / 2 - 12);

    ctx.fillStyle = '#5A3D06';
    ctx.font = 'italic 15px "Pinyon Script", cursive';
    ctx.fillText('Gently rub the 24K gold foil with your finger to reveal our wedding date', width / 2, height / 2 + 18);

    ctx.fillStyle = '#401018';
    ctx.font = '11px "Montserrat", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('✦ SCRATCH TO UNVEIL THE SACRED DATE ✦', width / 2, height / 2 + 42);
  }, []);

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

        // Celebration Confetti with Royal Indian Vivah Colors
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
    <div className="relative max-w-md mx-auto my-4 select-none">
      {/* Golden Glitter Sparkles Floating around Card */}
      <span className="absolute -top-3 -left-3 text-lg glitter-sparkle pointer-events-none">✨</span>
      <span className="absolute -top-3 -right-3 text-lg glitter-sparkle-delayed pointer-events-none">✨</span>
      <span className="absolute -bottom-3 -left-3 text-lg glitter-sparkle-delayed pointer-events-none">✨</span>
      <span className="absolute -bottom-3 -right-3 text-lg glitter-sparkle pointer-events-none">✨</span>

      {/* Royal Card Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[1.75/1] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(155,28,46,0.22),0_4px_16px_rgba(212,175,55,0.25)] border-2 border-[#D4AF37] select-none"
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
            <span className="font-pinyon text-lg sm:text-xl text-[#FDFBF7] italic block">
              Sacred Lagna Muhurat Revealed With Love
            </span>
          </div>

          {/* Main Hand-Calligraphed Sacred Wedding Date */}
          <div className="relative z-10 py-1">
            <h4 className="font-pinyon text-3xl sm:text-5xl font-bold text-gold-shimmer leading-tight tracking-wide drop-shadow-md">
              {weddingDateStr}
            </h4>
            <span className="font-cormorant italic text-xs sm:text-sm text-[#F3E5AB]/90 block mt-0.5">
              शुभ लग्न: गोधूलि वेला • सात फेरे एवं पाणीग्रहण संस्कार
            </span>
          </div>

          {/* Venue & Blessings Bottom Note */}
          <div className="relative z-10 border-t border-[#D4AF37]/40 pt-2 w-full flex items-center justify-between text-[11px] font-cormorant italic text-[#FDFBF7]/90 px-2">
            <span className="truncate max-w-[70%]">
              📍 {venueStr}
            </span>
            <span className="text-[#F3E5AB] font-serif font-bold text-[10px] tracking-wider uppercase">
              ✦ सदा सौभाग्यवती भव ✦
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
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-cormorant italic text-[#7A1423] bg-[#FAF4E3] border border-[#D4AF37] shadow-sm font-bold">
            <Check className="w-3.5 h-3.5 text-[#AA820A]" /> Auspicious Lagna Muhurat Sealed in the Stars!
          </span>
        </div>
      )}
    </div>
  );
};
