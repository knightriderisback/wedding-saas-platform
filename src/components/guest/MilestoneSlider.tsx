'use client';

import React, { useState } from 'react';
import { StoryMilestone } from '@/types/wedding';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

interface MilestoneSliderProps {
  milestones: StoryMilestone[];
}

export const MilestoneSlider: React.FC<MilestoneSliderProps> = ({ milestones }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!milestones || milestones.length === 0) return null;

  const current = milestones[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % milestones.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + milestones.length) % milestones.length);
  };

  return (
    <div className="relative max-w-lg mx-auto bg-[#FDFBF7] paper-deckle rounded-2xl p-6 sm:p-8 shadow-[0_15px_45px_rgba(180,140,70,0.14)] overflow-hidden">
      {/* Decorative Header */}
      <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3 mb-4">
        <span className="font-cinzel text-[10px] tracking-widest uppercase text-[#AA820A] font-bold flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-[#9B1C2E] fill-[#9B1C2E]" />
          Chapter 0{currentIndex + 1} of 0{milestones.length}
        </span>
        <span className="font-cinzel text-xs font-bold text-[#7D5F04]">
          Year {current.year}
        </span>
      </div>

      {/* Slide Image Frame */}
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[#D4AF37]/30 shadow-md mb-4 group">
        <img
          src={current.imageUrl}
          alt={current.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
          <h4 className="font-serif text-lg font-semibold text-[#FAF4E3]">
            {current.title}
          </h4>
        </div>
      </div>

      {/* Slide Text Description */}
      <p className="font-cormorant italic text-base text-[#544230] leading-relaxed min-h-[55px]">
        "{current.description}"
      </p>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#E8DFC8]">
        <button
          onClick={handlePrev}
          className="p-2 rounded-lg bg-[#FAF4E3] border border-[#D4AF37]/30 text-[#7D5F04] hover:bg-[#F3E5AB] transition-colors"
          aria-label="Previous chapter"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Indicators */}
        <div className="flex gap-1.5">
          {milestones.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-[#E8DFC8]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 rounded-lg bg-[#FAF4E3] border border-[#D4AF37]/30 text-[#7D5F04] hover:bg-[#F3E5AB] transition-colors"
          aria-label="Next chapter"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
