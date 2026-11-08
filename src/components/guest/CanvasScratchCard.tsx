'use client';

import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Sparkles, Check } from 'lucide-react';

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

    const width = (canvas.width = canvas.offsetWidth || 340);
    const height = (canvas.height = canvas.offsetHeight || 160);

    // Render 24K Gold Foil Overlay with Luxury Shimmer Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#D4AF37');
    grad.addColorStop(0.3, '#FAF4E3');
    grad.addColorStop(0.5, '#E7D17D');
    grad.addColorStop(0.8, '#AA820A');
    grad.addColorStop(1, '#D4AF37');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative inner gold foil border
    ctx.strokeStyle = '#7D5F04';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(8, 8, width - 16, height - 16);

    ctx.strokeStyle = '#FAF4E3';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Prompt Text on Foil
    ctx.fillStyle = '#332601';
    ctx.font = 'bold 12px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText('✨ SCRATCH WITH LOVE ✨', width / 2, height / 2 - 8);

    ctx.fillStyle = '#543F02';
    ctx.font = 'italic 11px "Cormorant Garamond", serif';
    ctx.fillText('Rub gently to reveal the sacred wedding date', width / 2, height / 2 + 14);
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
    ctx.arc(x, y, 22, 0, Math.PI * 2, false);
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

      if (percentage > 38 && !isRevealed) {
        setIsRevealed(true);
        confetti({
          particleCount: 75,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FAF4E3', '#9B1C2E', '#E58E26', '#FAF8F5'],
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
    <div
      ref={containerRef}
      className="relative w-full max-w-sm mx-auto aspect-[2.1/1] rounded-2xl overflow-hidden paper-deckle shadow-[0_15px_40px_rgba(180,140,70,0.18)] bg-[#FDFBF7] select-none"
    >
      {/* Hidden Content Revealed Beneath */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-0 bg-[#FDFBF7]">
        {/* Subtle decorative gold inner border */}
        <div className="absolute inset-2 border border-[#D4AF37]/30 rounded-xl pointer-events-none" />

        <span className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-[#AA820A] font-bold flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> Auspicious Muhurat Unveiled
        </span>

        <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#2C2218] my-1">
          {weddingDateStr}
        </h4>

        <p className="font-cormorant italic text-xs text-[#544230]">
          The Sacred Pheras & Sangeet Gala • {venueStr}
        </p>

        {isRevealed && (
          <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-mono text-[#7D5F04] bg-[#FAF4E3] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/50">
            <Check className="w-3 h-3 text-[#AA820A]" /> Auspicious Date Sealed With Blessings
          </span>
        )}
      </div>

      {/* Gold Foil Scratch Canvas Overlay */}
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
          className="absolute inset-0 w-full h-full scratch-canvas z-10 transition-opacity duration-700"
        />
      )}
    </div>
  );
};
