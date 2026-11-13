'use client';

import React, { useState } from 'react';
import { updateGuestRsvp } from '@/lib/firebase';
import confetti from 'canvas-confetti';
import { Check, Sparkles, HeartHandshake, ShieldCheck, Printer } from 'lucide-react';
import { INVITATION_TRANSLATIONS, InvitationLanguage } from '@/lib/invitationI18n';

interface GuestRsvpFormProps {
  weddingSlug: string;
  defaultGuestName?: string;
  coupleNames?: string;
  venueName?: string;
  onSuccess?: () => void;
  language?: InvitationLanguage;
}

export const GuestRsvpForm: React.FC<GuestRsvpFormProps> = ({
  weddingSlug,
  defaultGuestName = '',
  coupleNames = 'The Royal Wedding Celebrations',
  venueName = 'The Royal Palace',
  onSuccess,
  language = 'en',
}) => {
  const [guestName, setGuestName] = useState(defaultGuestName);
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState<'attending' | 'declined'>('attending');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [dietaryChoice, setDietaryChoice] = useState('Traditional Royal Rajasthani Vegetarian');
  const [shuttleNeeded, setShuttleNeeded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const t = INVITATION_TRANSLATIONS[language];

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
    <div className="max-w-xl mx-auto border border-[#D4AF37]/60 bg-transparent p-6 sm:p-8 relative">
      {/* Traditional Indian Corner Filigrees */}
      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]" />
      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]" />

      {/* Header Line on Paper */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3 mb-4">
        <span className="font-cinzel text-xs tracking-widest uppercase text-[#7A1423] font-bold flex items-center gap-1.5">
          <HeartHandshake className="w-3.5 h-3.5 text-[#AA820A]" />
          {t.rsvpSubtitle}
        </span>
        <span className="text-xs text-[#7D5F04] font-serif italic">
          {language === 'en' ? 'Royal Guest Desk' : 'शाही अतिथि प्रकोष्ठ'}
        </span>
      </div>

      <p className="font-cormorant italic text-base text-[#3D2817] leading-relaxed mb-6">
        {t.rsvpDescription}
      </p>

      {isSubmitted ? (
        /* INSTANT ROYAL ENTRY PASS GENERATION */
        <div className="space-y-4 animate-fade-in text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] mx-auto flex items-center justify-center text-[#7A1423]">
            <ShieldCheck className="w-6 h-6 text-[#AA820A]" />
          </div>

          <div>
            <span className="font-serif text-xs tracking-[0.25em] uppercase text-[#7A1423] font-bold block">
              {t.rsvpSuccessTitle}
            </span>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#2C2218] mt-1">
              {attendance === 'attending' ? t.rsvpVipPassTitle : (language === 'en' ? 'Warm Wishes Received' : 'सप्रेम शुभकामनाएँ प्राप्त हुईं')}
            </h4>
          </div>

          {attendance === 'attending' ? (
            <div className="border-2 border-[#D4AF37] p-5 text-left space-y-3 relative overflow-hidden bg-[#FAF5E8]">
              <div className="flex justify-between items-start border-b border-[#D4AF37]/40 pb-2">
                <div>
                  <span className="font-serif text-xs uppercase tracking-wider text-[#7D5F04] font-bold block">
                    {venueName} • {language === 'en' ? 'Royal Pass' : 'शाही प्रवेश पत्र'}
                  </span>
                  <h5 className="font-serif text-base font-bold text-[#2C2218]">
                    {coupleNames}
                  </h5>
                </div>
                <span className="px-2.5 py-0.5 text-xs font-serif font-bold bg-[#7A1423] text-white">
                  VIP PASS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-serif uppercase tracking-wider text-[#7D5F04] block">{language === 'en' ? 'Distinguished Guest' : 'सम्मानित अतिथि'}</span>
                  <span className="font-serif font-bold text-[#2C1810] text-sm">{guestName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-serif uppercase tracking-wider text-[#7D5F04] block">{language === 'en' ? 'Reserved Party' : 'कुल सदस्य'}</span>
                  <span className="font-serif font-bold text-[#2C1810] text-sm">{guestCount} {language === 'en' ? 'Guests' : 'अतिथि'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-serif uppercase tracking-wider text-[#7D5F04] block">{language === 'en' ? 'Auspicious Date' : 'शुभ तिथि'}</span>
                  <span className="font-serif font-bold text-[#2C1810] text-sm">Nov 20, 2027</span>
                </div>
                <div>
                  <span className="text-[10px] font-serif uppercase tracking-wider text-[#7D5F04] block">{language === 'en' ? 'Dietary Choice' : 'खान-पान'}</span>
                  <span className="font-serif font-bold text-[#2C1810] text-sm truncate block">{dietaryChoice.split(' ')[0]}</span>
                </div>
              </div>

              {/* QR Code Simulation */}
              <div className="pt-2 border-t border-dashed border-[#D4AF37]/40 flex items-center justify-between">
                <div className="w-14 h-14 border border-[#D4AF37] p-1 flex items-center justify-center font-mono text-[9px] text-center text-[#543F02] bg-[#FFFDF9]">
                  [QR PASS]
                </div>
                <div className="text-right flex-1 pl-3 text-xs text-[#543F02] font-cormorant italic">
                  {language === 'en'
                    ? 'Present this VIP pass upon arrival at the palace gates.'
                    : 'महल के मुख्य द्वार पर आगमन के समय यह डिजिटल पास दिखाएँ।'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full mt-2 py-2 rounded-full border border-[#D4AF37] text-[#7A1423] font-serif text-xs uppercase font-bold flex items-center justify-center gap-1.5 hover:bg-[#FAF4E3] transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> {language === 'en' ? 'Print / Save Keepsake Pass' : 'प्रवेश पत्र प्रिंट / सहेजें'}
              </button>
            </div>
          ) : (
            <p className="font-cormorant italic text-base text-[#544230] leading-relaxed">
              {language === 'en'
                ? `Thank you for letting us know. Your warm blessings will accompany ${coupleNames} as they take their sacred vows.`
                : 'आपकी शुभकामनाएँ सप्रेम स्वीकार की गईं। वर-वधू के मंगल भविष्य हेतु आपके शुभाशीष के लिए हार्दिक धन्यवाद।'}
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Attendance Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAttendance('attending')}
              className={`py-2.5 px-3 font-serif text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                attendance === 'attending'
                  ? 'border-[#7A1423] bg-[#7A1423] text-white font-bold'
                  : 'border-[#D4AF37]/50 text-[#544230] hover:border-[#7A1423]'
              }`}
            >
              <Check className="w-3.5 h-3.5" /> {t.rsvpAttendingOption}
            </button>
            <button
              type="button"
              onClick={() => setAttendance('declined')}
              className={`py-2.5 px-3 font-serif text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                attendance === 'declined'
                  ? 'border-[#7A1423] bg-rose-900/10 text-[#7A1423] font-bold'
                  : 'border-[#D4AF37]/50 text-neutral-500 hover:border-[#7A1423]'
              }`}
            >
              {t.rsvpDecliningOption}
            </button>
          </div>

          <div>
            <label className="block text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold mb-1">
              {t.rsvpNameLabel} *
            </label>
            <input
              type="text"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder={t.rsvpNamePlaceholder}
              className="w-full bg-transparent border-0 border-b-2 border-[#D4AF37]/50 focus:border-[#7A1423] py-2 px-1 text-sm text-[#2C1810] font-serif placeholder:text-[#8C7A68] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold mb-1">
              {t.rsvpPhoneLabel}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.rsvpPhonePlaceholder}
              className="w-full bg-transparent border-0 border-b-2 border-[#D4AF37]/50 focus:border-[#7A1423] py-2 px-1 text-sm text-[#2C1810] font-serif placeholder:text-[#8C7A68] focus:outline-none transition-colors"
            />
          </div>

          {attendance === 'attending' && (
            <>
              {/* Guest Count Selector */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold mb-2">
                  {t.rsvpGuestCountLabel}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setGuestCount(count)}
                      className={`flex-1 py-1.5 border font-serif text-sm transition-all cursor-pointer ${
                        guestCount === count
                          ? 'border-[#7A1423] bg-[#7A1423] text-white font-bold'
                          : 'border-[#D4AF37]/50 text-[#544230] hover:border-[#7A1423]'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Culinary Choice */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold mb-1">
                  {language === 'en' ? 'Royal Culinary / Dietary Preference' : 'खान-पान संबंधी प्राथमिकता'}
                </label>
                <select
                  value={dietaryChoice}
                  onChange={(e) => setDietaryChoice(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-2 border-[#D4AF37]/50 focus:border-[#7A1423] py-2 px-1 text-sm text-[#2C1810] font-serif focus:outline-none transition-colors"
                >
                  <option value="Traditional Royal Rajasthani Vegetarian">
                    {language === 'en' ? 'Traditional Pure Rajasthani Vegetarian (Dal Baati, Paneer)' : 'पारंपरिक शुद्ध शाकाहारी राजस्थानी (दाल बाटी, पनीर)'}
                  </option>
                  <option value="Jain Meal (Strictly No Root Veg)">
                    {language === 'en' ? 'Jain Meal (Strictly No Onion / Garlic / Root Veg)' : 'शुद्ध जैन भोजन (कंदमूल, प्याज, लहसुन रहित)'}
                  </option>
                  <option value="Vegan Delights">
                    {language === 'en' ? 'Vegan Delights (Plant-Based)' : 'वीगन भोजन'}
                  </option>
                </select>
              </div>

              {/* Airport / Lake Shuttle Request */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="shuttleCheck"
                  checked={shuttleNeeded}
                  onChange={(e) => setShuttleNeeded(e.target.checked)}
                  className="accent-[#7A1423] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="shuttleCheck" className="text-xs font-serif text-[#544230] cursor-pointer">
                  {language === 'en'
                    ? 'Request complimentary palace chauffeur shuttle from Udaipur Airport (UDR)'
                    : 'उदयपुर एयरपोर्ट अथवा रेलवे स्टेशन से पैलेस वाहन सुविधा का अनुरोध करें'}
                </label>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#9B1C2E] to-[#7A1423] text-white font-serif text-sm uppercase tracking-wider font-bold shadow-md hover:brightness-110 flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#D4AF37]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isSubmitting ? t.rsvpSubmittingButton : t.rsvpSubmitButton}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
