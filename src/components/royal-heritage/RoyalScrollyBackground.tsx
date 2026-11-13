'use client';

import React, { useEffect, useRef, useState } from 'react';

interface RoyalScrollyBackgroundProps {
  scrollerRef: React.RefObject<HTMLElement>;
  className?: string;
  overlayOpacity?: number; // Soft wash over video for text readability
}

const TOTAL_FRAMES = 120;

export const RoyalScrollyBackground: React.FC<RoyalScrollyBackgroundProps> = ({
  scrollerRef,
  className = '',
  overlayOpacity = 0.42,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const rafIdRef = useRef<number | null>(null);
  const [loadedCount, setLoadedCount] = useState<number>(0);

  // Pad frame number: 1 -> "0001"
  const getFrameUrl = (index: number) => {
    const pad = String(index).padStart(4, '0');
    return `/templates/royal-heritage/frames/frame_${pad}.webp`;
  };

  // Draw a frame using cover fit (crops edges cleanly to maintain aspect ratio)
  const drawFrame = (frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const idx = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(frameNum))) - 1;
    const img = imagesRef.current[idx];

    if (img && img.complete && img.naturalWidth > 0) {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Cover Fit calculations
      const scale = Math.max(cw / iw, ch / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      const cx = (cw - nw) / 2;
      const cy = (ch - nh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, cx, cy, nw, nh);
    }
  };

  // Initialize and preload all 120 frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);

      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (i === 1) {
          // Immediately draw frame 1 to guarantee 0ms black screen
          drawFrame(1);
        }
      };

      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      imagesRef.current = [];
    };
  }, []);

  // Update canvas dimensions to match container
  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    drawFrame(currentFrameRef.current);
  };

  // Resize listener
  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  // Smooth lerp loop with requestAnimationFrame
  useEffect(() => {
    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;

      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.05) {
        // Smooth lerp interpolation (0.18 gives snappy yet butter-smooth response)
        currentFrameRef.current += diff * 0.18;
        drawFrame(currentFrameRef.current);
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Scroll listener on the scrollable container
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      const maxScroll = scroller.scrollHeight - scroller.clientHeight;
      if (maxScroll <= 0) return;

      const progress = Math.min(1, Math.max(0, scroller.scrollTop / maxScroll));
      // Map progress [0, 1] to frame [1, TOTAL_FRAMES]
      targetFrameRef.current = 1 + progress * (TOTAL_FRAMES - 1);
    };

    scroller.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial calculation
    handleScroll();

    return () => {
      scroller.removeEventListener('scroll', handleScroll);
    };
  }, [scrollerRef]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      {/* 3D Scrolly Video Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{
          width: '100%',
          height: '100%',
        }}
      />

      {/* Luxury Parchment Ambient Wash for Text Contrast */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          backgroundColor: `rgba(250, 248, 245, ${overlayOpacity})`,
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.2) 0%, rgba(238,230,215,0.45) 100%)',
        }}
      />

      {/* Top & Bottom Soft Vignette for Floating Controls */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#FAF8F5]/80 via-[#FAF8F5]/30 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FAF8F5]/85 via-[#FAF8F5]/35 to-transparent pointer-events-none" />
    </div>
  );
};
