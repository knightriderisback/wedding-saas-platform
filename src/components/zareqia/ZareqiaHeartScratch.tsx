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
  weddingTime = '10:00 AM',
  isArabic = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [calendarSaved, setCalendarSaved] = useState(false);

  // Initialize glitter canvas with specular 3D gloss dome and emerald metallic foil
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, width, height);

    ctx.save();

    // Use identical SVG Heart Path so canvas matches revealed container 100% pixel-perfect
    const heartPath = new Path2D(
      'M140,240 C40,160 0,110 0,60 C0,25 25,0 65,0 C95,0 125,25 140,48 C155,25 185,0 215,0 C255,0 280,25 280,60 C280,110 240,160 140,240 Z'
    );
    ctx.clip(heartPath);

    // Soft luminous Sage Green radial gradient matching video f_0025.jpg
    const grad = ctx.createRadialGradient(
      width * 0.46,
      height * 0.38,
      12,
      width / 2,
      height / 2,
      width * 0.52
    );
    grad.addColorStop(0, '#B2C6AA');
    grad.addColorStop(0.28, '#91A888');
    grad.addColorStop(0.68, '#6B8362');
    grad.addColorStop(1, '#4A6142');

    ctx.fillStyle = grad;
    ctx.fill(heartPath);

    // Thousands of glistening metallic & champagne gold glitter flecks
    const rng = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    let seed = 77;
    for (let i = 0; i < 3600; i++) {
      const gx = rng(seed++) * width;
      const gy = rng(seed++) * height;
      const gSize = rng(seed++) * 2.0 + 0.3;
      const alpha = rng(seed++) * 0.85 + 0.15;
      const isGold = rng(seed++) > 0.45;

      ctx.fillStyle = isGold
        ? `rgba(255, 235, 175, ${alpha})`
        : `rgba(225, 245, 230, ${alpha})`;
      ctx.beginPath();
      ctx.arc(gx, gy, gSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // Top-Center Specular Soft Dome Highlight (Exact match to video f_0025.jpg)
    const specGrad = ctx.createRadialGradient(
      width * 0.46,
      height * 0.36,
      8,
      width * 0.46,
      height * 0.36,
      width * 0.35
    );
    specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
    specGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.32)');
    specGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = specGrad;
    ctx.fill(heartPath);

    // Soft bevel contour stroke on heart edge
    ctx.strokeStyle = 'rgba(220, 205, 155, 0.55)';
    ctx.lineWidth = 1.8;
    ctx.stroke(heartPath);

    ctx.restore();
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Scratch action handler with continuous line interpolation
  const handleScratch = useCallback(
    (clientX: number, clientY: number, isStarting = false) => {
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

      if (isStarting || !lastPointRef.current) {
        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Continuous thick stroke between previous point and current point
        ctx.beginPath();
        ctx.lineWidth = 48;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      lastPointRef.current = { x, y };

      if (Math.random() > 0.5) {
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

    // Confetti flakes shower drifting from top
    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#D4AF37', '#5E8F6C', '#FFFDF9', '#E5C07B', '#8C6D23'],
        ticks: 240,
        gravity: 0.85,
      });
    } catch {}
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    handleScratch(e.clientX, e.clientY, true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    handleScratch(e.clientX, e.clientY, false);
  };

  const onMouseUp = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
    checkProgress();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setIsDrawing(true);
    const touch = e.touches[0];
    handleScratch(touch.clientX, touch.clientY, true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDrawing) return;
    const touch = e.touches[0];
    handleScratch(touch.clientX, touch.clientY, false);
  };

  const onTouchEnd = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
    checkProgress();
  };

  // Save the Date / Calendar integration
  const handleSaveTheDate = () => {
    setCalendarSaved(true);
    setTimeout(() => setCalendarSaved(false), 3000);

    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      'Zayn & Nora Wedding Ceremony'
    )}&dates=20261130T100000Z/20261130T150000Z&details=${encodeURIComponent(
      'You are cordially invited to celebrate the wedding ceremony of Zayn & Nora at Grand Palace Hall, London.'
    )}&location=${encodeURIComponent('Grand Palace Hall, City centre, London')}`;

    window.open(gCalUrl, '_blank');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Zareqia Luxury Wedding//EN
BEGIN:VEVENT
SUMMARY:Wedding of Zayn & Nora
DESCRIPTION:We warmly invite you to celebrate our wedding ceremony.
LOCATION:Grand Palace Hall, City centre, London
DTSTART:20261130T100000Z
DTEND:20261130T150000Z
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
      {/* Welcome Blessing Intro Text (Matching Video f_0025.jpg) */}
      <div className="max-w-[320px] mx-auto px-2 mb-4 text-center">
        <p className="font-['Cormorant_Garamond',serif] italic text-[15px] sm:text-[16px] leading-relaxed text-[#4B5845]">
          {isArabic
            ? 'يشرفنا أن نرحب بكم في حفل زفاف زين ونورا. ومع بداية رحلتهما معاً في الإيمان والمحبة، نشكركم لكونكم جزءاً من هذه المناسبة المباركة.'
            : 'We are honored to welcome you to the Wedding ceremony of Zayn & Nora. As they begin their journey together in faith and love, we thank you for being part of this blessed occasion.'}
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-2 text-[#7C9172]">
          <span className="text-xs">♥</span>
        </div>
      </div>

      {/* Section Title */}
      <div className="mb-4 transition-all duration-700">
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
        <div className="flex items-center justify-center gap-2 mt-1.5 opacity-70">
          <div className="w-8 h-[1px] bg-[#B59A57]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
          <div className="w-8 h-[1px] bg-[#B59A57]" />
        </div>
      </div>

      {/* 3D Emerad Heart Scratch Container (Directly on Luxury Paper, No Circle Frame Matching f_0025.jpg) */}
      <div className="relative w-[280px] h-[260px] flex items-center justify-center my-2">
        {/* Revealed Content (Underneath) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ${
            isRevealed ? 'opacity-100' : 'opacity-95'
          }`}
          style={{
            clipPath:
              'path("M140,240 C40,160 0,110 0,60 C0,25 25,0 65,0 C95,0 125,25 140,48 C155,25 185,0 215,0 C255,0 280,25 280,60 C280,110 240,160 140,240 Z")',
            background: 'radial-gradient(circle, #FCFAF6 0%, #F5F1E8 100%)',
          }}
        >
          {/* Delicate Thin Heart Contour Border Matching Video f_0035.jpg */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 280 260"
            fill="none"
          >
            <path
              d="M140,234 C43,156 5,108 5,60 C5,27 28,5 65,5 C93,5 122,28 140,48 C158,28 187,5 215,5 C252,5 275,27 275,60 C275,108 237,156 140,234 Z"
              stroke="#B3985A"
              strokeWidth="1.2"
              fill="none"
              opacity="0.8"
            />
          </svg>

          {/* Text Content Inside Heart (Matching exact video lines in f_0035.jpg) */}
          <div className="relative z-10 flex flex-col items-center px-4 pt-4">
            <span className="font-['Alex_Brush','Pinyon_Script',cursive] text-lg text-[#5A4C32] mb-0.5">
              {isArabic ? 'يسعدنا حضوركم!' : "You're Invited!"}
            </span>
            <span className="font-['Playfair_Display',serif] text-xl md:text-2xl font-bold text-[#242A20] tracking-tight">
              {isArabic ? '٣٠ نوفمبر ٢٠٢٦' : weddingDate}
            </span>
            <span className="font-['Cormorant_Garamond',serif] text-sm text-[#4E5C46] font-medium mt-0.5">
              {isArabic ? 'الاثنين' : weddingDay}
            </span>
            <span className="font-['Cinzel',serif] text-[11px] tracking-wider text-[#685A42] font-semibold mt-0.5">
              {isArabic ? '١٠:٠٠ صباحاً' : weddingTime}
            </span>
          </div>
        </div>

        {/* Scratch Canvas (Top Layer: 3D Domed Emerald Metallic Glitter Heart) */}
        <canvas
          ref={canvasRef}
          width={280}
          height={260}
          className={`absolute inset-0 z-20 cursor-grab active:cursor-grabbing touch-none transition-opacity duration-700 ${
            isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{
            filter: 'drop-shadow(0 10px 20px rgba(40,65,45,0.35)) drop-shadow(0 2px 5px rgba(0,0,0,0.2))',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
      </div>

      {/* Save The Date Pill Button (Matching exact video f_0035.jpg) */}
      <div className="mt-4 transition-all duration-700">
        <button
          onClick={handleSaveTheDate}
          className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#273822] text-[#FAF8F5] text-xs font-['Cinzel',serif] tracking-widest uppercase shadow-md hover:bg-[#1D2B19] active:scale-95 transition-all border border-[#B59A57]/30"
        >
          {calendarSaved ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isArabic ? 'تم الحفظ في التقويم' : 'SAVED TO CALENDAR'}</span>
            </>
          ) : (
            <>
              <Calendar className="w-3.5 h-3.5 text-[#E6D197] group-hover:scale-110 transition-transform" />
              <span>{isArabic ? 'احفظ التاريخ في التقويم' : 'SAVE THE DATE'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
