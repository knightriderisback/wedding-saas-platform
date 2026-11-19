'use client';

import React, { useEffect, useRef } from 'react';

interface RoyalScrollyBackgroundProps {
  scrollerRef: React.RefObject<HTMLElement>;
  className?: string;
  overlayOpacity?: number; // Soft wash over video for text readability
  customBackgroundImage?: string;
}

const TOTAL_FRAMES = 120;

export const RoyalScrollyBackground: React.FC<RoyalScrollyBackgroundProps> = ({
  scrollerRef,
  className = '',
  overlayOpacity = 0.16,
  customBackgroundImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const lastDrawnIndexRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);
  const isLoopRunningRef = useRef<boolean>(false);
  const canvasSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  const getFrameUrl = (index: number) => {
    const pad = String(index).padStart(4, '0');
    return `/templates/royal-heritage/frames/frame_${pad}.webp`;
  };

  // Ultra-fast GPU-accelerated canvas draw with dynamic cover fit
  const drawFrame = (frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameNum) - 1));
    if (idx === lastDrawnIndexRef.current) return;

    // Locate requested frame or closest available neighbor
    let img = imagesRef.current[idx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let i = idx - 1; i >= 0; i--) {
        const candidate = imagesRef.current[i];
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          img = candidate;
          break;
        }
      }
      if (!img || !img.complete || img.naturalWidth === 0) {
        img = imagesRef.current[0];
      }
    }

    if (img && img.complete && img.naturalWidth > 0) {
      const cw = canvasSizeRef.current.width || canvas.width;
      const ch = canvasSizeRef.current.height || canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const scale = Math.max(cw / iw, ch / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      const cx = (cw - nw) * 0.5;
      const cy = (ch - nh) * 0.5;

      ctx.drawImage(img, cx, cy, nw, nh);
      lastDrawnIndexRef.current = idx;
    }
  };

  // Ultra-snappy smooth animation loop driven STRICTLY by scroll position
  const startAnimationLoop = () => {
    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;

    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;

      if (Math.abs(diff) > 0.02) {
        // High responsive lerp (0.4 gives 1:1 finger track with zero rubber-band lag)
        currentFrameRef.current += diff * 0.4;
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

  // Canvas size and DPR handling
  const updateCanvasSize = () => {
    if (customBackgroundImage) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      canvasSizeRef.current = { width: w, height: h };
    }

    lastDrawnIndexRef.current = -1;
    drawFrame(currentFrameRef.current);
  };

  // Stage 1: Load Frame 1 immediately, then staged preloading (never floods network or RAM)
  useEffect(() => {
    if (customBackgroundImage) return;

    let isMounted = true;
    const images = imagesRef.current;

    // Load Frame 1 immediately for 0ms initial paint
    const f1 = new Image();
    f1.src = getFrameUrl(1);
    f1.onload = () => {
      if (!isMounted) return;
      images[0] = f1;
      updateCanvasSize();
      drawFrame(1);
    };
    if (f1.complete && f1.naturalWidth > 0) {
      images[0] = f1;
      updateCanvasSize();
      drawFrame(1);
    }

    // Staged priority loading: First load keyframes every 4th frame for coarse navigation
    const loadQueue: number[] = [];
    for (let i = 5; i <= TOTAL_FRAMES; i += 4) {
      loadQueue.push(i);
    }
    // Then fill remaining in-between frames
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      if (!loadQueue.includes(i) && i !== 1) {
        loadQueue.push(i);
      }
    }

    // Load in smooth batches of 4 to prevent network throttling and garbage collection spikes
    let queueIdx = 0;
    const BATCH_SIZE = 4;

    const loadNextBatch = () => {
      if (!isMounted || queueIdx >= loadQueue.length) return;

      const batch = loadQueue.slice(queueIdx, queueIdx + BATCH_SIZE);
      queueIdx += BATCH_SIZE;

      let batchLoaded = 0;
      batch.forEach((frameIdx) => {
        const img = new Image();
        img.src = getFrameUrl(frameIdx);
        img.onload = () => {
          if (!isMounted) return;
          images[frameIdx - 1] = img;
          batchLoaded++;
          if (batchLoaded === batch.length) {
            // Use idle callback or short timeout for next batch
            if ('requestIdleCallback' in window) {
              (window as any).requestIdleCallback(loadNextBatch, { timeout: 100 });
            } else {
              setTimeout(loadNextBatch, 16);
            }
          }
        };
        img.onerror = () => {
          batchLoaded++;
          if (batchLoaded === batch.length) {
            setTimeout(loadNextBatch, 16);
          }
        };
      });
    };

    // Begin background queue after initial mount
    const timer = setTimeout(loadNextBatch, 50);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      isLoopRunningRef.current = false;
    };
  }, [customBackgroundImage]);

  // Handle Resize and Orientation
  useEffect(() => {
    if (customBackgroundImage) return;
    updateCanvasSize();

    window.addEventListener('resize', updateCanvasSize, { passive: true });
    window.addEventListener('orientationchange', updateCanvasSize, { passive: true });

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('orientationchange', updateCanvasSize);
    };
  }, [customBackgroundImage]);

  // Pure Scroll Scrubbing: advances strictly when scrolled, pauses when idle, reverses when scrolled up
  useEffect(() => {
    if (customBackgroundImage) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      const maxScroll = scroller.scrollHeight - scroller.clientHeight;
      if (maxScroll <= 0) return;

      const progress = Math.min(1, Math.max(0, scroller.scrollTop / maxScroll));
      targetFrameRef.current = 1 + progress * (TOTAL_FRAMES - 1);

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
  }, [scrollerRef, customBackgroundImage]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0, willChange: 'transform', backgroundColor: '#1A2218' }}
    >
      {/* Custom Uploaded Royal Wallpaper Background */}
      {customBackgroundImage ? (
        <img
          src={customBackgroundImage}
          alt="Royal Background Backdrop"
          className="w-full h-full object-cover block absolute inset-0 z-0"
        />
      ) : (
        /* 3D Scroll-Scrubbed Canvas Video Engine (Direct 1:1 Scroll Finger Tracking) */
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
      )}

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
