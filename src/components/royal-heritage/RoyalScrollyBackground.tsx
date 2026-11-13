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
  overlayOpacity = 0.12,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const lastDrawnIndexRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);
  const isLoopRunningRef = useRef<boolean>(false);
  const canvasSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  // Frame URL format: frame_0001.webp to frame_0120.webp
  const getFrameUrl = (index: number) => {
    const pad = String(index).padStart(4, '0');
    return `/templates/royal-heritage/frames/frame_${pad}.webp`;
  };

  // Draw a frame using dynamic cover fit (zero distortion, GPU accelerated)
  const drawFrame = (frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const idx = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(frameNum))) - 1;

    // Skip redundant draws if the same integer frame is already on screen
    if (idx === lastDrawnIndexRef.current) return;

    const img = imagesRef.current[idx];
    if (img && img.complete && img.naturalWidth > 0) {
      const cw = canvasSizeRef.current.width || canvas.width;
      const ch = canvasSizeRef.current.height || canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Cover Fit math
      const scale = Math.max(cw / iw, ch / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      const cx = (cw - nw) / 2;
      const cy = (ch - nh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, cx, cy, nw, nh);
      lastDrawnIndexRef.current = idx;
    }
  };

  // Smooth lerp loop - only runs when actively moving!
  const startAnimationLoop = () => {
    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;

    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;

      if (Math.abs(diff) > 0.01) {
        // Snappy, butter-smooth lerp interpolation
        currentFrameRef.current += diff * 0.22;
        drawFrame(currentFrameRef.current);
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        // Snap to exact target frame and sleep the loop to save 100% CPU/GPU
        currentFrameRef.current = targetFrameRef.current;
        drawFrame(currentFrameRef.current);
        isLoopRunningRef.current = false;
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);
  };

  // Initialize and load frames without triggering React re-renders!
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    imagesRef.current = images;

    // Load Frame 1 immediately with high priority
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

    // Priority Tier 1: Keyframes (every 5th frame) for instant responsive scrubbing
    for (let i = 5; i <= TOTAL_FRAMES; i += 5) {
      const img = new Image();
      img.src = getFrameUrl(i);
      const idx = i - 1;
      img.onload = () => {
        images[idx] = img;
      };
    }

    // Priority Tier 2: Remaining frames loaded progressively in idle time
    const loadRemaining = () => {
      for (let i = 2; i <= TOTAL_FRAMES; i++) {
        if (images[i - 1]) continue;
        const img = new Image();
        img.src = getFrameUrl(i);
        const idx = i - 1;
        img.onload = () => {
          images[idx] = img;
        };
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(loadRemaining);
    } else {
      setTimeout(loadRemaining, 100);
    }

    return () => {
      imagesRef.current = [];
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      isLoopRunningRef.current = false;
    };
  }, []);

  // Update canvas dimensions to match container with DPR scaling
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

    // Force redraw on resize
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
      // Map progress [0, 1] to frame [1, TOTAL_FRAMES]
      targetFrameRef.current = 1 + progress * (TOTAL_FRAMES - 1);

      // Start animation loop if not running
      startAnimationLoop();
    };

    scroller.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial calculation
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

      {/* Luxury Parchment Ambient Wash for Text Contrast */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          backgroundColor: `rgba(250, 248, 245, ${overlayOpacity})`,
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.25) 0%, rgba(238,230,215,0.35) 100%)',
        }}
      />

      {/* Top & Bottom Soft Vignette for Floating Controls */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#FAF8F5]/80 via-[#FAF8F5]/25 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FAF8F5]/85 via-[#FAF8F5]/25 to-transparent pointer-events-none" />
    </div>
  );
};
