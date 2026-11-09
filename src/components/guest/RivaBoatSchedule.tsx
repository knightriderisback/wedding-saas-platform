'use client';

import React, { useState } from 'react';
import { Compass, Clock, MapPin, Anchor, CheckCircle2 } from 'lucide-react';

interface BoatDeparture {
  dockName: string;
  town: string;
  departTime: string;
  boatName: string;
  transitMinutes: number;
  capacity: string;
}

const departures: BoatDeparture[] = [
  {
    dockName: 'Molo San Giovanni Private Pier',
    town: 'Bellagio',
    departTime: '4:15 PM',
    boatName: 'Riva Aquarama "Serenissima"',
    transitMinutes: 12,
    capacity: '14 VIP Guests',
  },
  {
    dockName: 'Grand Hotel Tremezzo Pier',
    town: 'Tremezzina',
    departTime: '4:30 PM',
    boatName: 'Venetian Water Taxi "Amore"',
    transitMinutes: 8,
    capacity: '20 VIP Guests',
  },
  {
    dockName: 'Varenna Marina Floating Dock',
    town: 'Varenna',
    departTime: '4:10 PM',
    boatName: 'Mahogany Cruiser "Lario"',
    transitMinutes: 18,
    capacity: '16 VIP Guests',
  },
];

export const RivaBoatSchedule: React.FC = () => {
  const [selectedDock, setSelectedDock] = useState<number>(0);
  const activeBoat = departures[selectedDock];

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#FAF7F2] to-[#EEF5FA] rounded-3xl p-6 sm:p-8 border border-[#B8D5E8] shadow-[0_15px_45px_rgba(26,54,93,0.08)] space-y-6">
      <div className="text-center space-y-1">
        <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#1A365D] font-bold flex items-center justify-center gap-1.5">
          <Anchor className="w-3.5 h-3.5 text-[#1A365D]" /> Private Nautical Concierge
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#1A365D]">
          Lake Como Riva Wooden Boat Transfers
        </h3>
        <p className="font-cormorant italic text-xs text-[#544230]">
          Private mahogany speedboats connecting Bellagio, Tremezzo & Varenna directly to the Villa dock
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {departures.map((d, idx) => {
          const isSelected = selectedDock === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedDock(idx)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#1A365D] shadow-md ring-2 ring-[#1A365D]/20 scale-102'
                  : 'bg-white/80 border-[#C5DCED] hover:bg-white'
              }`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#1A365D] bg-[#EEF5FA] px-2 py-0.5 rounded-md">
                  Dock {idx + 1} • {d.town}
                </span>
                <h4 className="font-serif font-bold text-base text-[#1A365D] mt-1">{d.dockName}</h4>
                <p className="text-[11px] text-neutral-500 font-sans">{d.boatName}</p>
              </div>

              <div className="pt-3 border-t border-[#EEF5FA] mt-3 flex items-center justify-between text-xs font-bold text-[#1A365D]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#AA820A]" /> {d.departTime}
                </span>
                <span className="text-[10px] text-neutral-400 font-normal">{d.transitMinutes} mins lake cruise</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Boat Boarding Pass */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#B8D5E8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-cinzel text-[9px] uppercase tracking-wider text-[#1A365D] font-bold block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Confirmed Private Lake Transfer
          </span>
          <h5 className="font-serif text-lg font-bold text-[#1A365D]">
            Departing {activeBoat.dockName} at {activeBoat.departTime}
          </h5>
          <p className="text-xs text-neutral-500 font-sans">
            Vessel: {activeBoat.boatName} • Capacity: {activeBoat.capacity}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-[#EEF5FA] border border-[#B8D5E8] text-center sm:text-right shrink-0">
          <span className="text-[10px] font-cinzel uppercase text-neutral-500 font-bold block">
            Dress Code Recommendation:
          </span>
          <span className="text-xs font-serif font-bold text-[#1A365D]">
            Silk Scarves & Classic Sunglasses for Lake Breeze
          </span>
        </div>
      </div>
    </div>
  );
};
