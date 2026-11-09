'use client';

import React, { useState } from 'react';
import { StoryMilestone } from '@/types/wedding';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { InvitationLanguage } from '@/lib/invitationI18n';

interface MilestoneSliderProps {
  milestones: StoryMilestone[];
  language?: InvitationLanguage;
}

export const MilestoneSlider: React.FC<MilestoneSliderProps> = ({ milestones, language = 'en' }) => {
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
    <div className="relative max-w-xl mx-auto border border-[#D4AF37]/60 bg-transparent p-6 sm:p-8">
      {/* Traditional Indian Corner Filigrees */}
      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]" />
      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]" />

      {/* Decorative Header */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3 mb-4">
        <span className="font-serif text-xs tracking-widest uppercase text-[#7A1423] font-bold flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-[#7A1423] fill-[#7A1423]" />
          {language === 'en' ? `Chapter 0${currentIndex + 1} of 0${milestones.length}` : `अध्याय ०${currentIndex + 1} / ०${milestones.length}`}
        </span>
        <span className="font-serif text-xs font-bold text-[#7D5F04]">
          {language === 'en' ? `Year ${current.year}` : `वर्ष ${current.year}`}
        </span>
      </div>

      {/* Slide Image Frame */}
      <div className="relative aspect-[16/10] overflow-hidden border border-[#D4AF37]/40 mb-4 group">
        <img
          src={current.imageUrl}
          alt={current.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
          <h4 className="font-serif text-lg sm:text-xl font-bold text-[#FAF4E3]">
            {current.title}
          </h4>
        </div>
      </div>

      {/* Slide Text Description */}
      <p className="font-cormorant italic text-base sm:text-lg text-[#3D2817] leading-relaxed min-h-[55px]">
        "{current.description}"
      </p>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#D4AF37]/30">
        <button
          onClick={handlePrev}
          className="p-2 border border-[#D4AF37]/50 text-[#7D5F04] hover:bg-[#FAF4E3] transition-colors cursor-pointer"
          aria-label="Previous chapter"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Indicators */}
        <div className="flex gap-2">
          {milestones.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 transition-all cursor-pointer ${
                i === currentIndex ? 'w-6 bg-[#7A1423]' : 'w-2 bg-[#D4AF37]/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 border border-[#D4AF37]/50 text-[#7D5F04] hover:bg-[#FAF4E3] transition-colors cursor-pointer"
          aria-label="Next chapter"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
