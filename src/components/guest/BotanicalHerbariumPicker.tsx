'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Flower2, Sparkles, Check, Heart } from 'lucide-react';

interface BotanicalFlower {
  id: string;
  name: string;
  latinName: string;
  symbolism: string;
  blessingMessage: string;
  colorName: string;
  confettiColors: string[];
  emoji: string;
}

const botanicalFlowers: BotanicalFlower[] = [
  {
    id: 'rose',
    name: 'English Heirloom Rose',
    latinName: 'Rosa damascena',
    symbolism: 'Sacred Devotion & Undying Grace',
    blessingMessage: 'May your union bloom with deep, enduring passion and gentle grace across all seasons.',
    colorName: 'Dusty Blush Rose',
    confettiColors: ['#E8A598', '#FAD4D0', '#FFFFFF', '#D4AF37'],
    emoji: '🌹',
  },
  {
    id: 'jasmine',
    name: 'Wild Star Jasmine',
    latinName: 'Jasminum officinale',
    symbolism: 'Sweet Devotion & Eternal Joy',
    blessingMessage: 'May your home be fragrant with laughter, gentle kindness, and unshakeable companionship.',
    colorName: 'Cream Jasmine White',
    confettiColors: ['#FAF6F2', '#F3E5AB', '#D4AF37', '#E2F0D9'],
    emoji: '🌸',
  },
  {
    id: 'marigold',
    name: 'Royal Genda / Marigold',
    latinName: 'Tagetes erecta',
    symbolism: 'Auspicious Prosperity & Warmth',
    blessingMessage: 'May the sun always shine upon your path, blessing you both with abundance and radiant health.',
    colorName: 'Haldi Ochre Gold',
    confettiColors: ['#F39C12', '#F1C40F', '#FAF4E3', '#D35400'],
    emoji: '🌼',
  },
  {
    id: 'lavender',
    name: 'English French Lavender',
    latinName: 'Lavandula angustifolia',
    symbolism: 'Serenity, Peace & Fidelity',
    blessingMessage: 'May tranquility and understanding be the tranquil foundation of your shared journey.',
    colorName: 'Lilac Amethyst',
    confettiColors: ['#C39BD3', '#D7BDE2', '#FAF4E3', '#85929E'],
    emoji: '🪻',
  },
];

export const BotanicalHerbariumPicker: React.FC = () => {
  const [selectedFlower, setSelectedFlower] = useState<BotanicalFlower | null>(null);
  const [blessingSent, setBlessingSent] = useState(false);

  const handlePickFlower = (flower: BotanicalFlower) => {
    setSelectedFlower(flower);
    setBlessingSent(true);

    // Shower screen with selected blossom's color palette!
    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.6 },
      colors: flower.confettiColors,
    });

    setTimeout(() => setBlessingSent(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#FDFBF7] rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] shadow-[0_15px_45px_rgba(45,74,54,0.08)] space-y-6">
      <div className="text-center space-y-1">
        <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#2D4A36] font-bold flex items-center justify-center gap-1.5">
          <Flower2 className="w-3.5 h-3.5 text-[#557A65]" /> Victorian Herbarium
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#2C2218]">
          Pick Your Auspicious Botanical Blessing
        </h3>
        <p className="font-cormorant italic text-xs text-[#544230]">
          Select an heirloom flower to shower upon the couple with historical Victorian botanical symbolism
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {botanicalFlowers.map((flower) => {
          const isSelected = selectedFlower?.id === flower.id;
          return (
            <button
              key={flower.id}
              onClick={() => handlePickFlower(flower)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-white border-[#2D4A36] shadow-md ring-2 ring-[#2D4A36]/20 scale-102'
                  : 'bg-white/80 border-[#E8DFC8] hover:border-[#557A65] hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl group-hover:scale-115 transition-transform">{flower.emoji}</span>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FAF6F2] border border-[#E8DFC8] text-[#557A65]">
                    {flower.colorName}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-base text-[#2C2218]">{flower.name}</h4>
                <p className="font-cormorant italic text-[11px] text-[#7D5F04] mb-2">{flower.latinName}</p>
                <p className="text-[11px] text-[#544230] leading-snug">
                  "{flower.symbolism}"
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#FAF4E3] flex items-center justify-between text-[11px] font-cinzel font-bold text-[#2D4A36]">
                <span>{isSelected ? '✓ Blessed' : 'Tap to Shower'}</span>
                <Sparkles className="w-3 h-3 text-[#AA820A]" />
              </div>
            </button>
          );
        })}
      </div>

      {selectedFlower && (
        <div className="p-4 rounded-2xl bg-white border border-[#2D4A36]/30 shadow-xs text-center space-y-1 animate-fade-in max-w-lg mx-auto">
          <span className="font-cinzel text-[9px] uppercase tracking-widest text-[#2D4A36] font-bold block">
            {selectedFlower.emoji} Inscribed in Couple's Botanical Herbarium
          </span>
          <p className="font-cormorant italic text-sm text-[#2C2218]">
            "{selectedFlower.blessingMessage}"
          </p>
        </div>
      )}
    </div>
  );
};
