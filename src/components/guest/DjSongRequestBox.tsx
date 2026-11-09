'use client';

import React, { useState } from 'react';
import { SongRequest } from '@/types/wedding';
import { addDjSongRequest } from '@/lib/firebase';
import confetti from 'canvas-confetti';
import { Music, Send, Check } from 'lucide-react';
import { INVITATION_TRANSLATIONS, InvitationLanguage } from '@/lib/invitationI18n';

interface DjSongRequestBoxProps {
  weddingSlug: string;
  defaultGuestName?: string;
  existingSongs?: SongRequest[];
  language?: InvitationLanguage;
}

export const DjSongRequestBox: React.FC<DjSongRequestBoxProps> = ({
  weddingSlug,
  defaultGuestName = '',
  existingSongs = [],
  language = 'en',
}) => {
  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [guestName, setGuestName] = useState(defaultGuestName);
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const t = INVITATION_TRANSLATIONS[language];

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

    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="max-w-xl mx-auto border border-[#D4AF37]/60 bg-transparent p-6 sm:p-8 relative">
      {/* Traditional Indian Corner Filigrees */}
      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]" />
      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]" />

      {/* Header Line on Paper */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3 mb-4">
        <span className="font-cinzel text-xs tracking-widest uppercase text-[#7A1423] font-bold flex items-center gap-1.5">
          <Music className="w-3.5 h-3.5 text-[#AA820A]" />
          {t.djBadge}
        </span>
        <span className="text-xs text-[#7D5F04] font-serif italic">
          {t.djDirectConsole}
        </span>
      </div>

      <p className="font-cormorant italic text-base text-[#3D2817] leading-relaxed mb-6">
        {t.djDescription}
      </p>

      {isSuccess ? (
        <div className="p-4 border border-emerald-600/40 text-center space-y-1 animate-fade-in bg-emerald-50/40">
          <Check className="w-6 h-6 text-emerald-700 mx-auto" />
          <h5 className="font-serif text-lg text-emerald-950 font-bold">
            {t.djSuccessTitle}
          </h5>
          <p className="text-xs text-emerald-900 font-cormorant italic">
            {t.djSuccessText}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold mb-1">
              {t.djSongTitleLabel} *
            </label>
            <input
              type="text"
              required
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              placeholder={t.djSongTitlePlaceholder}
              className="w-full bg-transparent border-0 border-b-2 border-[#D4AF37]/50 focus:border-[#7A1423] py-2 px-1 text-sm text-[#2C1810] font-serif placeholder:text-[#8C7A68] focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold mb-1">
                {t.djArtistLabel}
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder={t.djArtistPlaceholder}
                className="w-full bg-transparent border-0 border-b-2 border-[#D4AF37]/50 focus:border-[#7A1423] py-2 px-1 text-sm text-[#2C1810] font-serif placeholder:text-[#8C7A68] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold mb-1">
                {t.djNameLabel}
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={t.djNamePlaceholder}
                className="w-full bg-transparent border-0 border-b-2 border-[#D4AF37]/50 focus:border-[#7A1423] py-2 px-1 text-sm text-[#2C1810] font-serif placeholder:text-[#8C7A68] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold mb-1">
                {t.djPhoneLabel}
              </label>
              <input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder={t.djPhonePlaceholder}
                className="w-full bg-transparent border-0 border-b-2 border-[#D4AF37]/50 focus:border-[#7A1423] py-2 px-1 text-sm text-[#2C1810] font-serif placeholder:text-[#8C7A68] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold mb-1">
                {t.djNotesLabel}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.djNotesPlaceholder}
                className="w-full bg-transparent border-0 border-b-2 border-[#D4AF37]/50 focus:border-[#7A1423] py-2 px-1 text-sm text-[#2C1810] font-serif placeholder:text-[#8C7A68] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#9B1C2E] to-[#7A1423] text-white font-serif text-sm uppercase tracking-wider font-bold shadow-md hover:brightness-110 flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#D4AF37]"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? t.djSubmittingButton : t.djSubmitButton}
            </button>
          </div>
        </form>
      )}

      {/* Recent requests */}
      {existingSongs.length > 0 && (
        <div className="mt-6 pt-3 border-t border-[#D4AF37]/30">
          <span className="text-xs font-serif uppercase tracking-wider text-[#7D5F04] font-bold block mb-2">
            {language === 'en' ? 'Recent Sangeet Requests:' : 'अतिथियों द्वारा हाल ही में फरमाए गए गीत:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {existingSongs.slice(0, 4).map((s) => (
              <span
                key={s.id}
                className="px-3 py-1 border border-[#D4AF37]/40 text-[#4A321E] text-xs font-serif italic"
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
