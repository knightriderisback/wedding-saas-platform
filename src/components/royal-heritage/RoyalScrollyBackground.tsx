'use client';

import React, { useEffect, useRef } from 'react';

interface RoyalScrollyBackgroundProps {
  scrollerRef: React.RefObject<HTMLElement>;
  className?: string;
  overlayOpacity?: number; // Soft wash over video for text readability
}

const TOTAL_FRAMES = 120;

export const RoyalScrollyBackground: React.FC<RoyalScrollyBackgroundProps> = ({
  scrollerRef,
  className = '',
  overlayOpacity = 0.22,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const lastDrawnIndexRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);
  const isLoopRunningRef = useRef<boolean>(false);
  const canvasSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  // Frame URL
  const getFrameUrl = (index: number) => {
    const pad = String(index).padStart(4, '0');
    return `/templates/royal-heritage/frames/frame_${pad}.webp`;
  };

  // Draw a frame using dynamic cover fit
  const drawFrame = (frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const idx = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(frameNum))) - 1;

    // Skip redundant draws if the same integer frame is already on screen
    if (idx === lastDrawnIndexRef.current) return;

    // Get image or nearest available loaded neighbor
    let img = imagesRef.current[idx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < 25; offset++) {
        const prev = imagesRef.current[idx - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[idx + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (img && img.complete && img.naturalWidth > 0) {
      const cw = canvasSizeRef.current.width || canvas.width;
      const ch = canvasSizeRef.current.height || canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Cover Fit calculations
      const scale = Math.max(cw / iw, ch / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      const cx = (cw - nw) / 2;
      const cy = (ch - nh) / 2;

      ctx.drawImage(img, cx, cy, nw, nh);
      lastDrawnIndexRef.current = idx;
    }
  };

  // Ultra-snappy responsive animation loop (0.55 lerp gives instant 1:1 finger tracking)
  const startAnimationLoop = () => {
    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;

    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;

      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.55;
        drawFrame(currentFrameRef.current);
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        currentFrameRef.current = targetFrameRef.current;
        drawFrame(currentFrameRef.current);
        isLoopRunningRef.current = false;
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);
  };

  // Eager preloader - loads all 120 frames in fast parallel batches
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    imagesRef.current = images;

    // Load Frame 1 immediately
    const frame1 = new Image();
    frame1.src = getFrameUrl(1);
    frame1.onload = () => {
      images[0] = frame1;
      drawFrame(1);
    };
    if (frame1.complete && frame1.naturalWidth > 0) {
      images[0] = frame1;
      drawFrame(1);
    }

    // Load all frames eagerly
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      const idx = i - 1;
      img.onload = () => {
        images[idx] = img;
      };
    }

    return () => {
      imagesRef.current = [];
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      isLoopRunningRef.current = false;
    };
  }, []);

  // Canvas size and DPR handling
  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    canvas.width = w;
    canvas.height = h;
    canvasSizeRef.current = { width: w, height: h };

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
    }

    lastDrawnIndexRef.current = -1;
    drawFrame(currentFrameRef.current);
  };

  // Resize listener
  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize, { passive: true });
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
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
      targetFrameRef.current = 1 + progress * (TOTAL_FRAMES - 1);

      // Start animation loop
      startAnimationLoop();
    };

    scroller.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      scroller.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      isLoopRunningRef.current = false;
    };
  }, [scrollerRef]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0, willChange: 'transform' }}
    >
      {/* 3D Scrolly Video Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block"
        style={{
          width: '100%',
          height: '100%',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      />

      {/* Luxury Parchment Ambient Wash for High Contrast Text Legibility */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          backgroundColor: `rgba(250, 248, 245, ${overlayOpacity})`,
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.35) 0%, rgba(238,230,215,0.45) 100%)',
        }}
      />
    </div>
  );
};
