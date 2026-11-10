'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Check, Sparkles } from 'lucide-react';

interface ZareqiaHeartScratchProps {
  coupleNames?: string;
  weddingDate?: string;
  weddingDay?: string;
  weddingTime?: string;
  isArabic?: boolean;
}

export const ZareqiaHeartScratch: React.FC<ZareqiaHeartScratchProps> = ({
  coupleNames = 'Zayn & Nora',
  weddingDate = 'November 30, 2026',
  weddingDay = 'Monday',
  weddingTime = '6:00 PM',
  isArabic = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [calendarSaved, setCalendarSaved] = useState(false);

  // Initialize glitter canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, width, height);

    // Save state for clipping
    ctx.save();

    // Heart Path
    ctx.beginPath();
    const topCurveHeight = height * 0.3;
    ctx.moveTo(width / 2, height * 0.85);
    // Left curve
    ctx.bezierCurveTo(
      width * 0.1,
      height * 0.55,
      width * 0.02,
      topCurveHeight,
      width * 0.25,
      topCurveHeight * 0.6
    );
    ctx.bezierCurveTo(
      width * 0.38,
      topCurveHeight * 0.3,
      width * 0.48,
      topCurveHeight * 0.7,
      width / 2,
      topCurveHeight
    );
    // Right curve
    ctx.bezierCurveTo(
      width * 0.52,
      topCurveHeight * 0.7,
      width * 0.62,
      topCurveHeight * 0.3,
      width * 0.75,
      topCurveHeight * 0.6
    );
    ctx.bezierCurveTo(
      width * 0.98,
      topCurveHeight,
      width * 0.9,
      height * 0.55,
      width / 2,
      height * 0.85
    );
    ctx.closePath();

    ctx.clip();

    // Base Emerald Green gradient
    const grad = ctx.createRadialGradient(
      width * 0.4,
      height * 0.4,
      10,
      width / 2,
      height / 2,
      width * 0.55
    );
    grad.addColorStop(0, '#538260');
    grad.addColorStop(0.3, '#3A6847');
    grad.addColorStop(0.7, '#244B30');
    grad.addColorStop(1, '#183622');

    ctx.fillStyle = grad;
    ctx.fill();

    // Add thousands of glistening metallic & gold glitter flecks
    const rng = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    let seed = 42;
    for (let i = 0; i < 2400; i++) {
      const gx = rng(seed++) * width;
      const gy = rng(seed++) * height;
      const gSize = rng(seed++) * 2.2 + 0.5;
      const alpha = rng(seed++) * 0.85 + 0.15;
      const isGold = rng(seed++) > 0.45;

      ctx.fillStyle = isGold
        ? `rgba(255, 228, 140, ${alpha})`
        : `rgba(148, 230, 170, ${alpha})`;
      ctx.beginPath();
      ctx.arc(gx, gy, gSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add bright specular glints
    for (let i = 0; i < 60; i++) {
      const gx = rng(seed++) * width;
      const gy = rng(seed++) * height;
      ctx.fillStyle = `rgba(255, 255, 255, ${rng(seed++) * 0.9 + 0.1})`;
      ctx.beginPath();
      ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer subtle gold bevel ring
    ctx.strokeStyle = 'rgba(218, 185, 110, 0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Scratch action handler
  const handleScratch = useCallback(
    (clientX: number, clientY: number) => {
      if (isRevealed) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fill();

      // Check progress every few scratches
      if (Math.random() > 0.6) {
        checkProgress();
      }
    },
    [isRevealed]
  );

  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(w * 0.2, h * 0.25, w * 0.6, h * 0.5);
    const data = imgData.data;
    let transparentCount = 0;
    const totalPixels = data.length / 4;

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 30) transparentCount++;
    }

    const progress = transparentCount / totalPixels;
    setScratchProgress(progress);

    if (progress > 0.32) {
      triggerFullReveal();
    }
  };

  const triggerFullReveal = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    setScratchProgress(1);

    // Confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#2E5B3D', '#E8D389', '#4E885B', '#FFFFFF'],
      });
    } catch {
      // ignore
    }
  };

  // Touch & Mouse handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    handleScratch(e.clientX, e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    handleScratch(e.clientX, e.clientY);
  };

  const onMouseUp = () => setIsDrawing(false);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsDrawing(true);
      handleScratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleScratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchEnd = () => {
    setIsDrawing(false);
    checkProgress();
  };

  // Save the Date / Calendar integration
  const handleSaveTheDate = () => {
    setCalendarSaved(true);
    setTimeout(() => setCalendarSaved(false), 3000);

    // Google Calendar URL
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      'Zayn & Nora Wedding Ceremony'
    )}&dates=20261130T180000Z/20261130T230000Z&details=${encodeURIComponent(
      'You are cordially invited to celebrate the wedding of Zayn & Nora at Grand Palace Hall, London.'
    )}&location=${encodeURIComponent('Grand Palace Hall, City centre, London')}`;

    window.open(gCalUrl, '_blank');

    // Also download .ics
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Zareqia Luxury Wedding//EN
BEGIN:VEVENT
SUMMARY:Wedding of Zayn & Nora
DESCRIPTION:We warmly invite you to celebrate our wedding.
LOCATION:Grand Palace Hall, City centre, London
DTSTART:20261130T180000Z
DTEND:20261130T230000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Zayn-Nora-Wedding-2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center py-6 px-4 text-center select-none"
    >
      {/* Section Title */}
      <div className="mb-3 transition-all duration-700">
        <h3 className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl md:text-4xl text-[#3A4A33] tracking-wide">
          {isRevealed
            ? isArabic
              ? 'بداية حكايتنا إلى الأبد'
              : 'Our forever begins'
            : isArabic
            ? 'انقر أو امسح للكشف'
            : 'Scratch to Reveal'}
        </h3>
        {/* Subtle Diamond Divider */}
        <div className="flex items-center justify-center gap-2 mt-1 opacity-70">
          <div className="w-8 h-[1px] bg-[#B59A57]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
          <div className="w-8 h-[1px] bg-[#B59A57]" />
        </div>
      </div>

      {/* Heart Container */}
      <div className="relative w-[280px] h-[260px] md:w-[320px] md:h-[290px] flex items-center justify-center">
        {/* Revealed Content (Underneath) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
            isRevealed ? 'opacity-100 scale-100' : 'opacity-90 scale-95'
          }`}
          style={{
            clipPath:
              'path("M140,240 C40,160 0,110 0,60 C0,25 25,0 65,0 C95,0 125,25 140,48 C155,25 185,0 215,0 C255,0 280,25 280,60 C280,110 240,160 140,240 Z")',
            background: 'radial-gradient(circle, #FAF7F0 0%, #F3ECE1 100%)',
            boxShadow: 'inset 0 0 20px rgba(181, 154, 87, 0.25)',
          }}
        >
          {/* Heart Inner Border */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 280 260"
            fill="none"
          >
            <path
              d="M140,234 C43,156 5,108 5,60 C5,27 28,5 65,5 C93,5 122,28 140,48 C158,28 187,5 215,5 C252,5 275,27 275,60 C275,108 237,156 140,234 Z"
              stroke="#C4A265"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              fill="none"
            />
          </svg>

          {/* Text Content Inside Heart */}
          <div className="relative z-10 flex flex-col items-center px-4 pt-4">
            <span className="font-['Cormorant_Garamond',serif] text-xs uppercase tracking-[0.25em] text-[#786A4C] font-semibold mb-1">
              {isArabic ? 'يسعدنا حضوركم!' : "You're Invited!"}
            </span>
            <span className="font-['Playfair_Display',serif] text-xl md:text-2xl font-bold text-[#242A20] tracking-tight">
              {isArabic ? '٣٠ نوفمبر ٢٠٢٦' : weddingDate}
            </span>
            <span className="font-['Cormorant_Garamond',serif] text-sm text-[#4E5C46] font-medium mt-0.5">
              {isArabic ? 'الاثنين' : weddingDay} • {isArabic ? '٦:٠٠ مساءً' : weddingTime}
            </span>
            <div className="mt-1 text-[#B59A57] text-xs">✦ ✦ ✦</div>
          </div>
        </div>

        {/* Scratch Canvas (Top Layer) */}
        <canvas
          ref={canvasRef}
          width={280}
          height={260}
          className={`absolute inset-0 z-20 cursor-grab active:cursor-grabbing touch-none transition-opacity duration-700 ${
            isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />

        {/* Scratch Hint Pill (over heart when untouched) */}
        {!isRevealed && scratchProgress < 0.1 && (
          <button
            onClick={triggerFullReveal}
            className="absolute bottom-6 z-30 px-3.5 py-1 rounded-full bg-[#1F3E28]/90 text-[#E7E2D5] text-[11px] font-['Cinzel',serif] tracking-widest uppercase shadow-md border border-[#C4A265]/40 hover:bg-[#1A3321] transition-all animate-pulse"
          >
            {isArabic ? 'انقر للكشف' : 'DATE • TAP TO REVEAL'}
          </button>
        )}
      </div>

      {/* Save The Date Pill Button */}
      <div className="mt-4 transition-all duration-700">
        <button
          onClick={handleSaveTheDate}
          className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#2E3C29] text-[#FAF8F5] text-xs md:text-sm font-['Cinzel',serif] tracking-widest uppercase shadow-lg shadow-[#2E3C29]/25 hover:bg-[#232F1F] active:scale-95 transition-all border border-[#B59A57]/30"
        >
          {calendarSaved ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{isArabic ? 'تم الحفظ في التقويم' : 'SAVED TO CALENDAR'}</span>
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4 text-[#C4A265] group-hover:scale-110 transition-transform" />
              <span>{isArabic ? 'احفظ التاريخ في التقويم' : 'SAVE THE DATE'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
