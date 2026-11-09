'use client';

import React, { useState } from 'react';
import { Compass, MapPin, Eye, Sparkles, Building2, Trees, Wine, Sun } from 'lucide-react';

interface Hotspot {
  id: string;
  name: string;
  time: string;
  icon: React.ElementType;
  description: string;
  architectureNote: string;
  imageUrl: string;
  x: number; // percentage
  y: number; // percentage
}

const estateHotspots: Hotspot[] = [
  {
    id: 'courtyard',
    name: 'The Ancient Olive Courtyard',
    time: '5:00 PM • Ceremony & Vows',
    icon: Trees,
    description: 'Surrounded by century-old olive trees and hand-chiseled stone archways where vows are exchanged under golden sunlight.',
    architectureNote: 'Original 18th-century Mallorcan limestone masonry with shaded pergolas.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    x: 48,
    y: 35,
  },
  {
    id: 'glasshouse',
    name: 'The Sunlit Orangery & Glasshouse',
    time: '6:30 PM • Welcome Aperitivo',
    icon: Sun,
    description: 'Wrought-iron glasshouse flooded with twilight breezes, vintage champagne flutes, and botanical installations.',
    architectureNote: 'Restored Victorian glass pavilion with floor-to-ceiling iron casement windows.',
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    x: 75,
    y: 52,
  },
  {
    id: 'terrace',
    name: 'The Tramuntana Sunset Terrace',
    time: '8:00 PM • Seated Banquet Feast',
    icon: Building2,
    description: 'Long wooden trestle tables under fairy lights overlooking rolling Mediterranean vineyards as dusk sets in.',
    architectureNote: 'Elevated stone terrace overlooking UNESCO World Heritage mountain valleys.',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    x: 25,
    y: 65,
  },
  {
    id: 'vault',
    name: 'The Bodega Wine Vault',
    time: '11:00 PM – Late • Afterparty',
    icon: Wine,
    description: 'Subterranean barrel room transformed into a private speakeasy with curated DJ beats and late-night tapas.',
    architectureNote: 'Cool arched barrel-vaulted ceiling holding heritage oak barriques.',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    x: 52,
    y: 82,
  },
];

export const EstateBlueprintExplorer: React.FC = () => {
  const [activeSpot, setActiveSpot] = useState<Hotspot>(estateHotspots[0]);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] shadow-[0_15px_45px_rgba(0,0,0,0.05)] space-y-6">
      <div className="text-center space-y-1">
        <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#7D5F04] font-bold flex items-center justify-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#AA820A]" /> Interactive Architectural Explorer
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#2C2218]">
          Explore The Estate & Ceremony Grounds
        </h3>
        <p className="font-cormorant italic text-xs text-[#544230]">
          Click on any architectural hotspot to preview ceremony spots, historical notes, and twilight views
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Architectural Map Canvas with Pulsing Hotspots */}
        <div className="lg:col-span-7 relative aspect-[4/3] rounded-2xl bg-[#FAF6EE] border border-[#E8DFC8] overflow-hidden shadow-inner p-4 flex items-center justify-center">
          {/* Architectural Blueprint Grid Pattern */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(74, 124, 142, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 124, 142, 0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Stylized Architectural Estate Outline (SVG Illustration) */}
          <svg className="w-full h-full text-[#4a7c8e]/40 pointer-events-none" viewBox="0 0 400 300" fill="none">
            <path d="M 60,80 L 180,40 L 320,60 L 340,160 L 280,240 L 100,220 Z" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" fill="rgba(74, 124, 142, 0.05)" />
            <rect x="140" y="70" width="100" height="80" rx="8" stroke="currentColor" strokeWidth="2" fill="rgba(212, 175, 55, 0.08)" />
            <circle cx="190" cy="110" r="22" stroke="currentColor" strokeWidth="1.5" />
            <path d="M 120,180 Q 190,210 260,180" stroke="currentColor" strokeWidth="2" />
          </svg>

          {/* Compass Rose */}
          <div className="absolute top-4 right-4 text-[10px] font-cinzel font-bold text-[#4a7c8e]/60 flex flex-col items-center">
            <span>N</span>
            <div className="w-0.5 h-4 bg-[#4a7c8e]/40" />
          </div>

          {/* Interactive Pulsing Hotspots */}
          {estateHotspots.map((spot) => {
            const isSelected = activeSpot.id === spot.id;
            const Icon = spot.icon;
            return (
              <button
                key={spot.id}
                onClick={() => setActiveSpot(spot)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer group ${
                  isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                }`}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              >
                {/* Ping ring */}
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-[#4a7c8e] opacity-40 animate-ping" />
                )}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
                    isSelected
                      ? 'bg-[#2C2218] text-[#FAF8F5] ring-2 ring-[#AA820A]'
                      : 'bg-white text-[#4a7c8e] border border-[#E8DFC8] group-hover:bg-[#FAF4E3]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Active Hotspot Detail Card */}
        <div className="lg:col-span-5 bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8DFC8] space-y-4">
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-sm">
            <img
              src={activeSpot.imageUrl}
              alt={activeSpot.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/60 text-white font-cinzel text-[9px] font-bold">
              {activeSpot.time}
            </span>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-serif text-xl font-bold text-[#2C2218]">
              {activeSpot.name}
            </h4>
            <p className="text-xs text-[#544230] leading-relaxed">
              {activeSpot.description}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#E8DFC8] text-[11px] text-[#7D5F04] space-y-0.5">
            <span className="font-cinzel uppercase font-bold text-[9px] block text-[#AA820A]">
              Architecture & Heritage:
            </span>
            <p className="font-cormorant italic">
              {activeSpot.architectureNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
