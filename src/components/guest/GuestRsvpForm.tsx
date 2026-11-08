'use client';

import React, { useState } from 'react';
import { updateGuestRsvp } from '@/lib/firebase';
import confetti from 'canvas-confetti';
import { Check, Sparkles, HeartHandshake, ShieldCheck, Printer, Download } from 'lucide-react';

interface GuestRsvpFormProps {
  weddingSlug: string;
  defaultGuestName?: string;
  onSuccess?: () => void;
}

export const GuestRsvpForm: React.FC<GuestRsvpFormProps> = ({
  weddingSlug,
  defaultGuestName = '',
  onSuccess,
}) => {
  const [guestName, setGuestName] = useState(defaultGuestName);
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState<'attending' | 'declined'>('attending');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [dietaryChoice, setDietaryChoice] = useState('Traditional Royal Rajasthani Vegetarian');
  const [shuttleNeeded, setShuttleNeeded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSubmitting(true);
    await updateGuestRsvp(
      weddingSlug,
      guestName.trim(),
      phone.trim(),
      attendance,
      attendance === 'attending' ? guestCount : 0,
      `${dietaryChoice}${shuttleNeeded ? ' • Airport Shuttle Requested' : ''}`
    );
    setIsSubmitting(false);
    setIsSubmitted(true);

    if (attendance === 'attending') {
      confetti({
        particleCount: 75,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FAF4E3', '#9B1C2E', '#E58E26', '#FAF8F5'],
      });
    }

    if (onSuccess) onSuccess();
  };

  return (
    <div className="max-w-lg mx-auto bg-[#FDFBF7] paper-deckle rounded-2xl p-6 sm:p-8 shadow-[0_15px_45px_rgba(180,140,70,0.14)]">
      <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3 mb-4">
        <span className="font-cinzel text-[10px] tracking-widest uppercase text-[#AA820A] font-bold flex items-center gap-1.5">
          <HeartHandshake className="w-3.5 h-3.5 text-[#D4AF37]" />
          Répondez S’il Vous Plaît (RSVP)
        </span>
        <span className="text-[10px] text-[#7D5F04] font-mono">
          Udaipur Royal Desk
        </span>
      </div>

      {isSubmitted ? (
        /* INSTANT ROYAL ENTRY PASS GENERATION */
        <div className="space-y-4 animate-fade-in text-center">
          <div className="w-12 h-12 rounded-full bg-[#FAF4E3] border-2 border-[#D4AF37] mx-auto flex items-center justify-center text-[#7D5F04]">
            <ShieldCheck className="w-6 h-6 text-[#AA820A]" />
          </div>

          <div>
            <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#AA820A] font-bold block">
              Auspicious Presence Sealed
            </span>
            <h4 className="font-serif text-2xl font-bold text-[#2C2218] mt-0.5">
              {attendance === 'attending' ? 'Your Royal Entry Pass' : 'Warm Wishes Inscribed'}
            </h4>
          </div>

          {attendance === 'attending' ? (
            <div className="bg-gradient-to-b from-[#FAF4E3] to-[#F3E5AB]/40 border-2 border-[#D4AF37]/60 rounded-xl p-5 text-left space-y-3 relative overflow-hidden shadow-md">
              <div className="flex justify-between items-start border-b border-[#D4AF37]/30 pb-2">
                <div>
                  <span className="font-cinzel text-[9px] uppercase tracking-wider text-[#7D5F04] font-bold block">
                    The Oberoi Udaivilas • Royal Pass
                  </span>
                  <h5 className="font-serif text-base font-bold text-[#2C2218]">
                    Rohit Sharma & Priya Mehra
                  </h5>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-cinzel font-bold bg-[#9B1C2E] text-white">
                  VIP PASS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[9px] font-cinzel uppercase text-[#7D5F04] block">Distinguished Guest</span>
                  <span className="font-serif font-bold text-[#2C2218]">{guestName}</span>
                </div>
                <div>
                  <span className="text-[9px] font-cinzel uppercase text-[#7D5F04] block">Reserved Party Size</span>
                  <span className="font-serif font-bold text-[#2C2218]">{guestCount} Guests</span>
                </div>
                <div>
                  <span className="text-[9px] font-cinzel uppercase text-[#7D5F04] block">Auspicious Date</span>
                  <span className="font-serif font-bold text-[#2C2218]">Nov 18–21, 2027</span>
                </div>
                <div>
                  <span className="text-[9px] font-cinzel uppercase text-[#7D5F04] block">Culinary Feast</span>
                  <span className="font-serif font-bold text-[#2C2218] truncate block">{dietaryChoice.split(' ')[0]} Cuisine</span>
                </div>
              </div>

              {/* QR Code Simulation */}
              <div className="pt-2 border-t border-dashed border-[#D4AF37]/40 flex items-center justify-between">
                <div className="w-14 h-14 bg-white border border-[#D4AF37]/40 rounded p-1 flex items-center justify-center font-mono text-[8px] text-center text-[#543F02]">
                  [QR CODE: PASS-{guestName.split(' ')[0].toUpperCase()}]
                </div>
                <div className="text-right flex-1 pl-3 text-[10px] text-[#543F02] font-cormorant italic">
                  Present this digital VIP pass upon arrival at The Oberoi Udaivilas private jetty.
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full mt-2 py-2 rounded-lg bg-[#FAF8F5] border border-[#D4AF37] text-[#7D5F04] font-cinzel text-xs uppercase font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save Keepsake Pass
              </button>
            </div>
          ) : (
            <p className="font-cormorant italic text-sm text-[#544230]">
              Thank you for letting us know. Your warm blessings will accompany Rohit and Priya as they take their sacred vows.
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Attendance Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF8F5] rounded-xl border border-[#E8DFC8]">
            <button
              type="button"
              onClick={() => setAttendance('attending')}
              className={`py-2.5 rounded-lg font-cinzel text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                attendance === 'attending'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black shadow-sm font-bold'
                  : 'text-[#544230] hover:text-[#2C2218]'
              }`}
            >
              <Check className="w-3.5 h-3.5" /> Joyfully Accepts
            </button>
            <button
              type="button"
              onClick={() => setAttendance('declined')}
              className={`py-2.5 rounded-lg font-cinzel text-xs font-semibold uppercase tracking-wider transition-all ${
                attendance === 'declined'
                  ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Regretfully Declines
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
              Guest / Family Name *
            </label>
            <input
              type="text"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Aditya & Ananya Singhania"
              className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] placeholder:text-neutral-400 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
              WhatsApp Mobile Number (for boarding pass & logistics)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98200 12345"
              className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] placeholder:text-neutral-400 focus:outline-none font-mono"
            />
          </div>

          {attendance === 'attending' && (
            <>
              {/* Guest Count Selector */}
              <div>
                <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                  Total Attending In Your Party
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setGuestCount(count)}
                      className={`flex-1 py-1.5 rounded-lg font-mono text-xs transition-all ${
                        guestCount === count
                          ? 'bg-[#D4AF37] text-black font-bold shadow-sm'
                          : 'bg-[#FAF8F5] border border-[#E8DFC8] text-[#544230] hover:border-[#D4AF37]'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Culinary Choice */}
              <div>
                <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                  Royal Culinary / Dietary Choice
                </label>
                <select
                  value={dietaryChoice}
                  onChange={(e) => setDietaryChoice(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none text-xs"
                >
                  <option value="Traditional Royal Rajasthani Vegetarian">Traditional Royal Rajasthani Vegetarian (Dal Baati, Paneer)</option>
                  <option value="Jain Meal (Strictly No Root Veg)">Jain Meal (Strictly No Onion / Garlic / Root Veg)</option>
                  <option value="Vegan Delights">Vegan Delights (Plant-Based)</option>
                  <option value="Non-Vegetarian Royal Feast">Non-Vegetarian Royal Feast (Mughlai / Laal Maas)</option>
                </select>
              </div>

              {/* Airport / Lake Shuttle Request */}
              <div className="flex items-center gap-2 p-3 bg-[#FAF8F5] rounded-xl border border-[#E8DFC8]">
                <input
                  type="checkbox"
                  id="shuttleCheck"
                  checked={shuttleNeeded}
                  onChange={(e) => setShuttleNeeded(e.target.checked)}
                  className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="shuttleCheck" className="text-xs text-[#544230] cursor-pointer">
                  Request complimentary Mercedes / Speedboat pickup from Udaipur Airport (UDR)
                </label>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs uppercase font-bold shadow-md hover:brightness-110 flex items-center justify-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isSubmitting ? 'Confirming Presence...' : 'Confirm Auspicious Presence & Get Pass'}
          </button>
        </form>
      )}
    </div>
  );
};
