'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CAROUSEL_IMAGES = [
  {
    src: '/templates/zareqia/carousel-1.jpg',
    alt: 'Romantic Candlelit Floral Tablescape with White Roses and Olive Leaves',
    caption: 'Garden Elegance & Candlelight',
  },
  {
    src: '/templates/zareqia/carousel-2.jpg',
    alt: 'Silk Draped Grand Reception Hall with Golden Candlesticks',
    caption: 'Champagne Silk & Warm Ambiance',
  },
  {
    src: '/templates/zareqia/carousel-3.jpg',
    alt: 'Couple Hand in Hand in Sunlit Classical Garden Courtyard',
    caption: 'Under the Olive Trees',
  },
  {
    src: '/templates/zareqia/carousel-4.jpg',
    alt: 'Crystal Chandelier and Bespoke Wedding Decor',
    caption: 'A Night to Remember',
  },
];

interface ZareqiaPhotoCarouselProps {
  photos?: string[];
}

export const ZareqiaPhotoCarousel: React.FC<ZareqiaPhotoCarouselProps> = ({ photos }) => {
  const effectiveImages = photos && photos.length > 0
    ? photos.map((url, i) => ({
        src: url,
        alt: `Royal Wedding Celebration Photo ${i + 1}`,
        caption: `Royal Memory #${i + 1}`,
      }))
    : CAROUSEL_IMAGES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % effectiveImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, effectiveImages.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % effectiveImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + effectiveImages.length) % effectiveImages.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full max-w-[340px] md:max-w-[420px] mx-auto my-6 px-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Photo Frame Container with rounded corners and drop shadow (frameless like video) */}
      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-lg bg-[#EDE7DB]">
        {effectiveImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
            }`}
            style={{ transition: 'opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s ease-out' }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 340px, 420px"
              priority={idx === 0}
            />
            {/* Subtle bottom vignette gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
          </div>
        ))}

        {/* Left Arrow (Tactile 3D Slim Glass) */}
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="btn-microsite-3d-glass !p-1.5 !w-8 !h-8 absolute left-2.5 top-1/2 -translate-y-1/2 z-20 rounded-full flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-[#273822]" />
        </button>

        {/* Right Arrow (Tactile 3D Slim Glass) */}
        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="btn-microsite-3d-glass !p-1.5 !w-8 !h-8 absolute right-2.5 top-1/2 -translate-y-1/2 z-20 rounded-full flex items-center justify-center cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 text-[#273822]" />
        </button>

        {/* PAGINATION DOTS */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
          {effectiveImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? 'w-4 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
