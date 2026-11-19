'use client';

import React, { useEffect, useRef } from 'react';

interface RoyalScrollyBackgroundProps {
  scrollerRef: React.RefObject<HTMLElement>;
  className?: string;
  overlayOpacity?: number; // Soft wash over video for text readability
  customBackgroundImage?: string;
}

export const RoyalScrollyBackground: React.FC<RoyalScrollyBackgroundProps> = ({
  scrollerRef,
  className = '',
  overlayOpacity = 0.16,
  customBackgroundImage,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Ensure seamless autoplay and wake-up on first user interaction/scroll
  useEffect(() => {
    if (customBackgroundImage) return;

    const vid = videoRef.current;
    if (!vid) return;

    // Trigger video playback
    const attemptPlay = () => {
      if (vid && vid.paused) {
        vid.play().catch(() => {
          // Handled on subsequent user gesture
        });
      }
    };

    attemptPlay();

    // Browser interaction wake-up handlers (mobile iOS/Android low-power policy)
    const handleWakeup = () => {
      attemptPlay();
    };

    window.addEventListener('touchstart', handleWakeup, { passive: true, once: true });
    window.addEventListener('click', handleWakeup, { passive: true, once: true });
    window.addEventListener('scroll', handleWakeup, { passive: true, once: true });

    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.addEventListener('scroll', handleWakeup, { passive: true, once: true });
    }

    return () => {
      window.removeEventListener('touchstart', handleWakeup);
      window.removeEventListener('click', handleWakeup);
      window.removeEventListener('scroll', handleWakeup);
      if (scroller) {
        scroller.removeEventListener('scroll', handleWakeup);
      }
    };
  }, [customBackgroundImage, scrollerRef]);

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
        /* Royal Couple Cinematic Motion Video Background */
        <video
          ref={videoRef}
          src="/templates/royal-heritage/royal_couple_video.mp4"
          poster="/templates/royal-heritage/frames/frame_0001.webp"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover block absolute inset-0 z-0"
          style={{
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
