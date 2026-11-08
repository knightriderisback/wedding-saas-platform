'use client';

import React, { useState } from 'react';
import { SongRequest } from '@/types/wedding';
import { addDjSongRequest } from '@/lib/firebase';
import confetti from 'canvas-confetti';
import { Music, Send, Check } from 'lucide-react';

interface DjSongRequestBoxProps {
  weddingSlug: string;
  defaultGuestName?: string;
  existingSongs?: SongRequest[];
}

export const DjSongRequestBox: React.FC<DjSongRequestBoxProps> = ({
  weddingSlug,
  defaultGuestName = '',
  existingSongs = [],
}) => {
  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [guestName, setGuestName] = useState(defaultGuestName);
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle.trim()) return;

    setIsSubmitting(true);
    const newSong: SongRequest = {
      id: `song-${Date.now()}`,
      songTitle: songTitle.trim(),
      artist: artist.trim() || 'Bollywood Sangeet Favorite',
      requestedByGuest: guestName.trim() || 'Honored Guest',
      guestPhone: guestPhone.trim(),
      timestamp: 'Just now',
      notes: notes.trim(),
    };

    await addDjSongRequest(weddingSlug, newSong);
    setIsSubmitting(false);
    setIsSuccess(true);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#FAF4E3', '#F39C12', '#9B1C2E'],
    });

    setSongTitle('');
    setArtist('');
    setNotes('');

    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div className="max-w-lg mx-auto bg-[#FDFBF7] paper-deckle rounded-2xl p-6 sm:p-8 shadow-[0_15px_45px_rgba(180,140,70,0.14)]">
      <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3 mb-4">
        <span className="font-cinzel text-[10px] tracking-widest uppercase text-[#AA820A] font-bold flex items-center gap-1.5">
          <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
          Sangeet Crowd Song Request
        </span>
        <span className="text-[10px] text-[#7D5F04] font-mono">
          Direct to DJ Console
        </span>
      </div>

      <p className="font-cormorant italic text-sm text-[#544230] mb-4">
        What track will get you racing to the dance floor? Tell our official DJ in advance so your anthem is queued!
      </p>

      {isSuccess ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-400 text-center space-y-1 animate-fade-in">
          <Check className="w-6 h-6 text-emerald-600 mx-auto" />
          <h5 className="font-serif text-base text-emerald-950 font-semibold">
            Track Submitted to DJ Setlist!
          </h5>
          <p className="text-xs text-emerald-800">
            Keep your dancing shoes ready for the Sangeet night at Udaivilas.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
              Song Title *
            </label>
            <input
              type="text"
              required
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              placeholder="e.g. London Thumakda / Kesariya / Kala Chashma"
              className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] placeholder:text-neutral-400 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                Artist / Movie
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="e.g. Arijit Singh"
                className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] placeholder:text-neutral-400 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] placeholder:text-neutral-400 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                Mobile (for dedications)
              </label>
              <input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+91 98200 12345"
                className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] placeholder:text-neutral-400 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                Timing / Squad Note
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. For Bride's entry"
                className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] placeholder:text-neutral-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs uppercase font-bold shadow-md hover:brightness-110 flex items-center justify-center gap-1.5 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? 'Sending to DJ...' : 'Submit Track to Official DJ'}
          </button>
        </form>
      )}

      {/* Recent requests snippet */}
      {existingSongs.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#E8DFC8]">
          <span className="text-[10px] font-cinzel uppercase text-[#7D5F04] font-semibold block mb-2">
            Recently Requested by Guests:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {existingSongs.slice(0, 4).map((s) => (
              <span
                key={s.id}
                className="px-2.5 py-1 rounded-full bg-[#FAF4E3] border border-[#D4AF37]/30 text-[#543F02] text-[10px] font-sans"
              >
                🎵 {s.songTitle}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
