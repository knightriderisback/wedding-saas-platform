'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Globe,
  Sparkles,
  MapPin,
  Clock,
  Building2,
  Mail,
  Navigation,
  CheckCircle2,
  PartyPopper,
  Shirt,
  Calendar,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RoyalRealisticEnvelope } from './RoyalRealisticEnvelope';
import { LetterStaggerText } from './LetterStaggerText';
import { ZareqiaHeartScratch } from '../zareqia/ZareqiaHeartScratch';
import { ZareqiaPhotoCarousel } from '../zareqia/ZareqiaPhotoCarousel';
import { RoyalScrollyBackground } from './RoyalScrollyBackground';
import { PeacockQuillCalligraphy } from './PeacockQuillCalligraphy';
import { royalSitarAudio } from '@/lib/sitarSynth';

export type SupportedLanguage = 'en' | 'hi' | 'hinglish' | 'ur';

interface RoyalHeritageWeddingInvitationProps {
  guestName?: string;
  autoOpen?: boolean;
}

// Translations Dictionary for all 4 languages
const TRANSLATIONS: Record<
  SupportedLanguage,
  {
    langName: string;
    weAreGettingMarried: string;
    groomName: string;
    groomParentage: string;
    groomTitle: string;
    brideName: string;
    brideParentage: string;
    brideTitle: string;
    scrollDown: string;
    countdownTitle: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    timelineTitle: string;
    events: Array<{ title: string; time: string; desc: string }>;
    venueTitle: string;
    palaceName: string;
    palaceCity: string;
    viewMap: string;
    dressCodeTitle: string;
    dressCodeValue: string;
    dressCodeDesc: string;
    rsvpTitle: string;
    rsvpIntro: string;
    rsvpSuccessTitle: string;
    rsvpSuccessDesc: string;
    labelName: string;
    placeholderName: string;
    labelEmail: string;
    labelAttend: string;
    optionSelect: string;
    optionYes: string;
    optionNo: string;
    labelGuests: string;
    guestUnit: string;
    labelMessage: string;
    placeholderMessage: string;
    submitBtn: string;
    sending: string;
    footerBlessing: string;
    useThisDesign: string;
  }
> = {
  en: {
    langName: 'English',
    weAreGettingMarried: "We're getting married",
    groomName: 'Aryan',
    groomParentage: 'Son of Mr. & Mrs. Sharma',
    groomTitle: 'Tech Entrepreneur',
    brideName: 'Eva',
    brideParentage: 'Daughter of Mr. & Mrs. Mehta',
    brideTitle: 'Fashion Designer',
    scrollDown: 'Scroll to Experience',
    countdownTitle: 'Counting Down',
    days: 'DAYS',
    hours: 'HOURS',
    minutes: 'MINUTES',
    seconds: 'SECONDS',
    timelineTitle: 'Ceremony Itinerary',
    events: [
      {
        title: 'Mehndi & Sangeet',
        time: 'Dec 11, 2026, 6:00 PM',
        desc: 'An evening of music, dance, and festive henna.',
      },
      {
        title: 'Wedding Ceremony',
        time: 'Dec 12, 2026, 10:00 AM',
        desc: 'Sacred wedding rituals and auspicious vows.',
      },
      {
        title: 'Royal Reception',
        time: 'Dec 12, 2026, 7:30 PM',
        desc: 'Grand dinner banquet and royal celebrations.',
      },
    ],
    venueTitle: 'Venue Location',
    palaceName: 'The Royal Palace & Gardens',
    palaceCity: 'Lake Pichola, Udaipur, Rajasthan',
    viewMap: 'View on Google Maps',
    dressCodeTitle: 'Dress Code',
    dressCodeValue: 'Royal Traditional / Formal Festive',
    dressCodeDesc: 'Pastel florals, emerald green, and regal navy tones.',
    rsvpTitle: 'RSVP',
    rsvpIntro:
      'Your love, blessings, and presence are the greatest gifts we could ever ask for.',
    rsvpSuccessTitle: 'RSVP Received with Joy!',
    rsvpSuccessDesc: 'We look forward to celebrating this royal celebration together.',
    labelName: 'Your Name *',
    placeholderName: 'Enter your full name',
    labelEmail: 'Email Address *',
    labelAttend: 'Will you attend? *',
    optionSelect: 'Please select...',
    optionYes: 'Joyfully Accepts with Pleasure',
    optionNo: 'Regretfully Declines',
    labelGuests: 'Number of Guests',
    guestUnit: 'Guest(s)',
    labelMessage: 'Warm Wishes / Message',
    placeholderMessage: 'Share your blessings...',
    submitBtn: 'Submit RSVP',
    sending: 'Sending...',
    footerBlessing: 'With love & blessings, Aryan & Eva',
    useThisDesign: 'Use this Design',
  },
  hi: {
    langName: 'हिंदी',
    weAreGettingMarried: 'हमारा शुभ विवाह',
    groomName: 'आर्यन',
    groomParentage: 'सुपुत्र: श्री एवं श्रीमती शर्मा',
    groomTitle: 'टेक उद्यमी',
    brideName: 'इवा',
    brideParentage: 'सुपुत्री: श्री एवं श्रीमती मेहता',
    brideTitle: 'फैशन डिजाइनर',
    scrollDown: 'अनुभव हेतु नीचे स्क्रॉल करें',
    countdownTitle: 'शुभ घड़ी का इंतजार',
    days: 'दिन',
    hours: 'घंटे',
    minutes: 'मिनट',
    seconds: 'सेकंड',
    timelineTitle: 'विवाह कार्यक्रम',
    events: [
      {
        title: 'मेहंदी एवं संगीत',
        time: '११ दिसंबर २०२६, सायं ६:०० बजे',
        desc: 'संगीत, नृत्य और उल्लास भरी मेहंदी की शाम।',
      },
      {
        title: 'शुभ विवाह संस्कार',
        time: '१२ दिसंबर २०२६, प्रातः १०:०० बजे',
        desc: 'पवित्र वैदिक फेरे और मंगल आशीर्वाद।',
      },
      {
        title: 'शाही प्रतिभोज एवं स्वागत',
        time: '१२ दिसंबर २०२६, सायं ७:३० बजे',
        desc: 'शाही रात्रिभोज एवं उत्सव।',
      },
    ],
    venueTitle: 'विवाह स्थल',
    palaceName: 'द रॉयल पैलेस एवं गार्डन्स',
    palaceCity: 'पिछोला झील, उदयपुर, राजस्थान',
    viewMap: 'गूगल मैप पर देखें',
    dressCodeTitle: 'पहनावा (Dress Code)',
    dressCodeValue: 'शाही पारंपरिक परिधान',
    dressCodeDesc: 'पेस्टल फ्लोरल, एमराल्ड ग्रीन, और रॉयल नेवी रंग।',
    rsvpTitle: 'उपस्थिति पुष्टि (RSVP)',
    rsvpIntro:
      'आपकी शुभकामनाएं और सानिध्य हमारे लिए सबसे अनमोल उपहार हैं।',
    rsvpSuccessTitle: 'उपस्थिति सप्रेम स्वीकार की गई!',
    rsvpSuccessDesc: 'हम इस पावन उत्सव में आपके स्वागत के लिए उत्सुक हैं।',
    labelName: 'आपका शुभ नाम *',
    placeholderName: 'अपना पूरा नाम दर्ज करें',
    labelEmail: 'ईमेल पता *',
    labelAttend: 'क्या आप पधारेंगे? *',
    optionSelect: 'कृपया चयन करें...',
    optionYes: 'हाँ, हम सप्रेम पधारेंगे',
    optionNo: 'असमर्थता के लिए क्षमा',
    labelGuests: 'अतिथियों की संख्या',
    guestUnit: 'अतिथि',
    labelMessage: 'शुभकामना संदेश',
    placeholderMessage: 'नवदंपति के लिए अपना आशीर्वाद लिखें...',
    submitBtn: 'उपस्थिति दर्ज करें',
    sending: 'भेजा जा रहा है...',
    footerBlessing: 'सप्रेम एवं आदर सहित: आर्यन एवं इवा',
    useThisDesign: 'यह डिज़ाइन उपयोग करें',
  },
  hinglish: {
    langName: 'Hinglish',
    weAreGettingMarried: 'Humari Shaadi Hone Ja Rahi Hai',
    groomName: 'Aryan',
    groomParentage: 'Son of Mr. & Mrs. Sharma',
    groomTitle: 'Tech Entrepreneur',
    brideName: 'Eva',
    brideParentage: 'Daughter of Mr. & Mrs. Mehta',
    brideTitle: 'Fashion Designer',
    scrollDown: 'Scroll Karein Aur Dekhein',
    countdownTitle: 'Shaadi Ka Countdown',
    days: 'DINO',
    hours: 'GHANTE',
    minutes: 'MINUTE',
    seconds: 'SECOND',
    timelineTitle: 'Ceremony Schedule',
    events: [
      {
        title: 'Mehndi & Sangeet Night',
        time: '11 Dec 2026, 6:00 PM',
        desc: 'Gaane, dance aur rang-birangi mehndi ki shaam.',
      },
      {
        title: 'Shubh Vivah Sanskar',
        time: '12 Dec 2026, 10:00 AM',
        desc: 'Saat phere aur badon ka pavitra aashirwaad.',
      },
      {
        title: 'Royal Reception Dinner',
        time: '12 Dec 2026, 7:30 PM',
        desc: 'Shahi daawat aur grand celebrations.',
      },
    ],
    venueTitle: 'Shadi Ka Venue',
    palaceName: 'The Royal Palace & Gardens',
    palaceCity: 'Pichola Lake, Udaipur, Rajasthan',
    viewMap: 'Google Maps Par Dekhein',
    dressCodeTitle: 'Dress Code',
    dressCodeValue: 'Royal Traditional / Festive Wear',
    dressCodeDesc: 'Pastel florals, emerald green, aur regal navy tones.',
    rsvpTitle: 'RSVP Confirmation',
    rsvpIntro:
      'Aapka aashirwaad aur উপস্থিতি humare liye sabse bada gift hai.',
    rsvpSuccessTitle: 'RSVP Confirmed with Joy!',
    rsvpSuccessDesc: 'Hum aapka swagat karne ke liye besabri se intezar kar rahe hain.',
    labelName: 'Aapka Naam *',
    placeholderName: 'Apna pura naam likhein',
    labelEmail: 'Email Address *',
    labelAttend: 'Kya aap aa rahe hain? *',
    optionSelect: 'Select karein...',
    optionYes: 'Haan, zarur aayenge!',
    optionNo: 'Kshama karein, nahi aa payenge',
    labelGuests: 'Kitne log aayenge?',
    guestUnit: 'Log',
    labelMessage: 'Blessings / Wishes',
    placeholderMessage: 'Apna shubhkaamna sandesh likhein...',
    submitBtn: 'RSVP Confirm Karein',
    sending: 'Bheja ja raha hai...',
    footerBlessing: 'Dher saare pyaar ke saath: Aryan & Eva',
    useThisDesign: 'Yeh Design Use Karein',
  },
  ur: {
    langName: 'اردو',
    weAreGettingMarried: 'ہماری شادی کا پرمسرت موقع',
    groomName: 'آریان',
    groomParentage: 'فرزند: مسٹر اور مسز شرما',
    groomTitle: 'ٹیک کاروباری',
    brideName: 'ایوا',
    brideParentage: 'دختر: مسٹر اور مسز مہتا',
    brideTitle: 'فیشن ڈیزائنر',
    scrollDown: 'خوبصورت مناظر دیکھنے کے لیے سکرول کریں',
    countdownTitle: 'شمارِ معکوس',
    days: 'دن',
    hours: 'گھنٹے',
    minutes: 'منٹ',
    seconds: 'سیکنڈ',
    timelineTitle: 'تقریبات کا شیڈول',
    events: [
      {
        title: 'مہندی اور سنگیت',
        time: '١١ دسمبر ٢٠٢٦، شام ٦:٠٠ بجے',
        desc: 'موسیقی، رقص اور خوشیوں بھری مہندی کی تقریب۔',
      },
      {
        title: 'رسمِ نکاح و رخصتی',
        time: '١٢ دسمبر ٢٠٢٦، صبح ١٠:٠٠ بجے',
        desc: 'مقدس رسومات اور دعاؤں کا سایہ۔',
      },
      {
        title: 'ولیمہ اور شاہی استقبالیہ',
        time: '١٢ دسمبر ٢٠٢٦، شام ٧:٣٠ بجے',
        desc: 'پرتکلف عشائیہ اور شاہی جشن۔',
      },
    ],
    venueTitle: 'مقامِ تقریب',
    palaceName: 'دی رائل پیلس اینڈ گارڈنز',
    palaceCity: 'پچولا جھیل، ادے پور، راجستھان',
    viewMap: 'گوگل میپس پر دیکھیں',
    dressCodeTitle: 'لباس کا انتخاب',
    dressCodeValue: 'شاہی روایتی لباس',
    dressCodeDesc: 'پیسٹل رنگ، زمردی سبز اور رائل نیوی شیڈز۔',
    rsvpTitle: 'شرکت کی تصدیق (RSVP)',
    rsvpIntro:
      'آپ کی تشریف آوری اور دعائیں ہمارے لیے سب سے قیمتی تحفہ ہیں۔',
    rsvpSuccessTitle: 'تصدیق موصول ہوئی، شکریہ!',
    rsvpSuccessDesc: 'ہم اس مبارک تقریب میں آپ کے استقبال کے منتظر ہیں۔',
    labelName: 'آپ کا اسم گرامی *',
    placeholderName: 'اپنا مکمل نام درج کریں',
    labelEmail: 'ای میل پتہ *',
    labelAttend: 'کیا آپ تشریف لائیں گے؟ *',
    optionSelect: 'براہ کرم منتخب کریں...',
    optionYes: 'جی ہاں، خوشی سے شرکت کریں گے',
    optionNo: 'معذرت خواہ ہیں',
    labelGuests: 'مہمانوں کی تعداد',
    guestUnit: 'افراد',
    labelMessage: 'نیک تمنائیں اور دعائیں',
    placeholderMessage: 'اپنے جذبات اور دعائیں تحریر کریں...',
    submitBtn: 'تصدیق ارسال کریں',
    sending: 'ارسال ہو رہا ہے...',
    footerBlessing: 'محبتوں اور دعاؤں کے ساتھ: آریان اور ایوا',
    useThisDesign: 'یہ ڈیزائن منتخب کریں',
  },
};

export const RoyalHeritageWeddingInvitation: React.FC<RoyalHeritageWeddingInvitationProps> = ({
  guestName = 'Special Guest',
  autoOpen = false,
}) => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(autoOpen);
  const [heroTextVisible, setHeroTextVisible] = useState(autoOpen);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const t = TRANSLATIONS[currentLang];
  const isRTL = currentLang === 'ur';

  // RSVP state
  const [rsvpName, setRsvpName] = useState(guestName !== 'Special Guest' ? guestName : '');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState('');
  const [rsvpGuests, setRsvpGuests] = useState('1');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 29,
    hours: 19,
    minutes: 9,
    seconds: 55,
  });

  // Calculate live countdown to Dec 12, 2026
  useEffect(() => {
    const targetDate = new Date('2026-12-12T10:00:00Z').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Royal Heritage Wedding Music (User-selected soundtrack)
  useEffect(() => {
    const audio = new Audio('/audio/royal-heritage-music.mp3');
    audio.loop = true;
    audio.volume = 0.65;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      royalSitarAudio.stopAmbient();
    };
  }, []);

  const toggleAudio = () => {
    if (isAudioPlaying) {
      if (audioRef.current) audioRef.current.pause();
      royalSitarAudio.stopAmbient();
      setIsAudioPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsAudioPlaying(true))
          .catch(() => {
            royalSitarAudio.startAmbient();
            setIsAudioPlaying(true);
          });
      } else {
        royalSitarAudio.startAmbient();
        setIsAudioPlaying(true);
      }
    }
  };

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpen(true);
    setHeroTextVisible(true);
    if (!isAudioPlaying) {
      toggleAudio();
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName) return;

    setRsvpLoading(true);
    setTimeout(() => {
      setRsvpLoading(false);
      setRsvpSubmitted(true);

      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#DFC07C', '#273822', '#0A9396', '#FAF8F5'],
      });
    }, 800);
  };

  return (
    <div
      className={`relative min-h-screen w-full bg-[#1A2218] flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8 overflow-hidden select-none ${
        isRTL ? 'font-serif rtl' : ''
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Ambient background glow for desktop mode */}
      <div className="fixed inset-0 pointer-events-none opacity-25">
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#869B77] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#C4A265] rounded-full blur-[140px]" />
      </div>

      {/* Main Luxury Smartphone Container */}
      <div className="relative w-full max-w-[430px] h-[100dvh] sm:h-[880px] sm:max-h-[92vh] rounded-none sm:rounded-[48px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-0 sm:border-[6px] border-[#2A3527] bg-[#FAF8F5] flex flex-col">
        {/* Smartphone Dynamic Island / Speaker Notch (Desktop Viewport) */}
        <div className="hidden sm:block absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#1A2218] rounded-full z-50 pointer-events-none shadow-inner" />

        {/* ========================================================
            FIXED PINNED 3D SCROLL-SCRUBBED VIDEO CANVAS BACKGROUND
            ======================================================== */}
        <RoyalScrollyBackground
          scrollerRef={scrollContainerRef}
          overlayOpacity={0.12}
        />

        {/* ========================================================
            STAGE 1 & 2: 3D REALISTIC PERSPECTIVE GATEFOLD ENVELOPE
            ======================================================== */}
        {!isEnvelopeOpen && (
          <RoyalRealisticEnvelope
            onCurtainsOpen={() => setHeroTextVisible(true)}
            onOpenComplete={handleEnvelopeOpen}
            isArabic={currentLang === 'ur'}
            onToggleLanguage={() =>
              setCurrentLang((prev) =>
                prev === 'en' ? 'hi' : prev === 'hi' ? 'hinglish' : prev === 'hinglish' ? 'ur' : 'en'
              )
            }
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={toggleAudio}
          />
        )}

        {/* ========================================================
            FLOATING CONTROLS HUD (Always Accessible)
            ======================================================== */}
        {/* Audio Mute/Unmute Button (Top Right) */}
        <button
          onClick={toggleAudio}
          className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-[#FAF8F5]/85 backdrop-blur-md border border-[#B59A57]/40 shadow-md flex items-center justify-center text-[#273822] hover:bg-[#FAF8F5] active:scale-95 transition-all"
          title={isAudioPlaying ? 'Mute Music' : 'Play Music'}
        >
          {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-60" />}
        </button>

        {/* 4-Language Switcher (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-50 flex flex-col items-start gap-1">
          <AnimatePresence>
            {langMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="bg-[#FAF8F5]/95 backdrop-blur-md border border-[#B59A57]/50 shadow-xl rounded-2xl p-1.5 flex flex-col gap-1 mb-1"
              >
                {(['en', 'hi', 'hinglish', 'ur'] as SupportedLanguage[]).map((lng) => (
                  <button
                    key={lng}
                    onClick={() => {
                      setCurrentLang(lng);
                      setLangMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-['Cinzel',serif] tracking-wider text-left transition-all ${
                      currentLang === lng
                        ? 'bg-[#273822] text-[#FAF8F5] font-bold shadow-sm'
                        : 'text-[#273822] hover:bg-[#DFC07C]/25'
                    }`}
                  >
                    {TRANSLATIONS[lng].langName}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md border border-[#B59A57]/45 shadow-md text-[11px] font-['Cinzel',serif] tracking-wider uppercase text-[#273822] hover:bg-[#FAF8F5] active:scale-95 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-[#B59A57]" />
            <span>{t.langName}</span>
          </button>
        </div>

        {/* Use This Design CTA (Bottom Right) */}
        <Link
          href="/customer?template=royal-heritage"
          className="absolute bottom-4 right-4 z-50 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#273822]/90 backdrop-blur-md text-[#FAF8F5] text-xs font-['Cinzel',serif] tracking-wider uppercase border border-[#B59A57]/40 hover:bg-[#1D2B19] transition-all shadow-md active:scale-95 hover:scale-105"
        >
          <Sparkles className="w-3 h-3 text-[#E6D197]" />
          <span>{t.useThisDesign}</span>
        </Link>

        {/* ========================================================
            SCROLLABLE CONTENT BODY (CARDLESS, FLOATING DIRECTLY OVER VIDEO)
            ======================================================== */}
        <div
          ref={scrollContainerRef}
          className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#C4A265]/40 pb-24 bg-transparent"
        >
          {/* ========================================================
              SECTION 1: HERO (Aryan & Eva + Peacock Feather Calligraphy)
              Intro & Outro: Floating quill calligraphy + vertical drift
              Center couple is holding hands with sparkles!
              Placement is optimized so their faces & bodies remain 100% visible!
              ======================================================== */}
          <section className="relative min-h-[92vh] flex flex-col items-center justify-between pt-6 sm:pt-8 pb-8 px-4 sm:px-6 text-center z-10">
            {/* Top Announcement */}
            <motion.div
              initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative z-10 flex flex-col items-center w-full"
            >
              <div className="text-[#273822] text-sm mb-1 opacity-90 drop-shadow">♥</div>

              <LetterStaggerText
                text={t.weAreGettingMarried}
                type="hero"
                as="h2"
                className="font-['Cormorant_Garamond',serif] italic text-base sm:text-lg text-[#1E2E1B] tracking-wider font-semibold"
                style={{
                  textShadow: '0 1px 4px rgba(255,255,255,0.95), 0 0 1px rgba(0,0,0,0.5)',
                }}
              />

              {/* Decorative Divider */}
              <div className="flex items-center justify-center gap-2 mt-1 mb-2 opacity-80">
                <div className="w-10 h-[1px] bg-[#B59A57]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                <div className="w-10 h-[1px] bg-[#B59A57]" />
              </div>

              {/* PEACOCK FEATHER CALLIGRAPHY COMPONENT */}
              <PeacockQuillCalligraphy
                groomName={t.groomName}
                brideName={t.brideName}
                isRTL={isRTL}
              />

              {/* Compact Royal Parentage Row - Sits neatly above couple's heads with dramatic letter stagger */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-1 flex flex-row items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-[#273822] font-['Cormorant_Garamond',serif] font-medium"
                style={{
                  textShadow: '0 1px 3px rgba(255,255,255,0.95)',
                }}
              >
                <div className={`flex flex-col ${isRTL ? 'text-left' : 'text-right'}`}>
                  <LetterStaggerText
                    text={t.groomParentage}
                    type="hero"
                    delay={0.12}
                    className="font-semibold leading-tight"
                  />
                  <LetterStaggerText
                    text={t.groomTitle}
                    type="hero"
                    delay={0.2}
                    className="italic text-[#785B24] text-[10px] sm:text-[11px] font-semibold"
                  />
                </div>
                <div className="w-[1px] h-6 bg-[#B59A57]/60" />
                <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                  <LetterStaggerText
                    text={t.brideParentage}
                    type="hero"
                    delay={0.12}
                    className="font-semibold leading-tight"
                  />
                  <LetterStaggerText
                    text={t.brideTitle}
                    type="hero"
                    delay={0.2}
                    className="italic text-[#785B24] text-[10px] sm:text-[11px] font-semibold"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.85 }}
              viewport={{ once: false }}
              className="relative z-10 flex flex-col items-center gap-1 animate-bounce pb-2"
            >
              <LetterStaggerText
                text={t.scrollDown}
                type="hero"
                className="text-[10px] font-['Cinzel',serif] tracking-widest text-[#273822] font-bold uppercase"
                style={{
                  textShadow: '0 1px 2px rgba(255,255,255,0.9)',
                }}
              />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
            </motion.div>
          </section>

          {/* ========================================================
              SECTION 2: SCRATCH TO REVEAL (Interactive 3D Glitter Heart)
              Intro & Outro Animation: 3D Spring Zoom & Shimmer aura
              Video Background: Couple romantic embrace & radiant starburst!
              Couple stands prominently in center - heart is positioned neatly!
              ======================================================== */}
          <section className="relative z-10 py-16 px-6 min-h-[85vh] flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.72, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center"
              style={{
                filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.18))',
              }}
            >
              <ZareqiaHeartScratch
                coupleNames={`${t.groomName} & ${t.brideName}`}
                weddingDate={
                  currentLang === 'hi'
                    ? '१२ दिसंबर २०२६'
                    : currentLang === 'ur'
                    ? '١٢ دسمبر ٢٠٢٦'
                    : 'December 12, 2026'
                }
                weddingDay={currentLang === 'hi' ? 'शनिवार' : currentLang === 'ur' ? 'ہفتہ' : 'Saturday'}
                weddingTime={currentLang === 'hi' ? 'प्रातः १०:०० बजे' : currentLang === 'ur' ? 'صبح ١٠:٠٠ بجے' : '10:00 AM'}
                language={currentLang}
              />
            </motion.div>
          </section>

          {/* ========================================================
              SECTION 3: PHOTO CAROUSEL & LIVE COUNTDOWN
              Intro & Outro Animation: 3D Perspective Flip & Slide-In from Left
              Video Background: Groom lifts bride in his arms!
              Carousel floats cleanly without card border box!
              ======================================================== */}
          <section className="relative z-10 py-16 px-6 min-h-[85vh] flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, x: -60, rotateY: 12 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="w-full max-w-[360px]"
            >
              {/* Photo Carousel floating directly */}
              <div className="rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.25)] border-2 border-white/60">
                <ZareqiaPhotoCarousel />
              </div>

              {/* Countdown Title with 3D Drop Impact letter animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-8 text-center"
              >
                <LetterStaggerText
                  text={t.countdownTitle}
                  type="countdown"
                  as="h3"
                  className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl sm:text-4xl text-[#1E2E1B] tracking-wide"
                  style={{
                    textShadow: '0 1px 3px rgba(255,255,255,0.95)',
                  }}
                />
                <div className="flex items-center justify-center gap-2 mt-1.5 opacity-80">
                  <div className="w-8 h-[1px] bg-[#B59A57]" />
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                  <div className="w-8 h-[1px] bg-[#B59A57]" />
                </div>
              </motion.div>

              {/* Countdown Blocks (Floating glass pills) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="grid grid-cols-4 gap-2.5 max-w-[340px] mx-auto mt-6"
              >
                {[
                  { label: t.days, value: timeLeft.days },
                  { label: t.hours, value: timeLeft.hours },
                  { label: t.minutes, value: timeLeft.minutes },
                  { label: t.seconds, value: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/85 backdrop-blur-[3px] border border-[#DFC07C]/50 shadow-md"
                  >
                    <span className="font-['Playfair_Display',serif] text-xl sm:text-2xl font-bold text-[#273822]">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <LetterStaggerText
                      text={item.label}
                      type="countdown"
                      as="span"
                      className="text-[9px] font-['Cinzel',serif] tracking-wider text-[#6B5A3E] font-semibold mt-0.5 uppercase"
                    />
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* ========================================================
              SECTION 4: PROGRAM TIMELINE (Ceremonies)
              Intro & Outro Animation: Cascading Stagger Bloom along Golden Scepter
              Video Background: Couple romantic twirl dance!
              ======================================================== */}
          <section className="relative z-10 py-16 px-6 min-h-[85vh] flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, y: 50, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="w-full max-w-[340px] text-center"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-[#B59A57]/60 flex items-center justify-center text-[#B59A57] bg-white/80 shadow-md">
                <Clock className="w-5 h-5" />
              </div>

              <LetterStaggerText
                text={t.timelineTitle}
                type="timeline"
                as="h3"
                className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl sm:text-4xl text-[#1E2E1B] tracking-wide"
                style={{
                  textShadow: '0 1px 3px rgba(255,255,255,0.95)',
                }}
              />
              <div className="flex items-center justify-center gap-2 mt-1.5 mb-8 opacity-80">
                <div className="w-8 h-[1px] bg-[#B59A57]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                <div className="w-8 h-[1px] bg-[#B59A57]" />
              </div>

              {/* Ceremonies Timeline */}
              <div
                className={`relative pl-6 space-y-7 text-left max-w-[320px] mx-auto border-l-2 border-[#DFC07C] ${
                  isRTL ? 'text-right border-l-0 border-r-2 pr-6 pl-0' : ''
                }`}
              >
                {t.events.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="relative"
                  >
                    <div
                      className={`absolute top-1 w-3.5 h-3.5 rounded-full bg-[#273822] border-2 border-[#DFC07C] shadow-md ${
                        isRTL ? '-right-[31px]' : '-left-[31px]'
                      }`}
                    />
                    <LetterStaggerText
                      text={item.title}
                      type="timeline"
                      as="h4"
                      className="font-['Playfair_Display',serif] text-base font-bold text-[#1E2E1B]"
                      style={{
                        textShadow: '0 1px 2px rgba(255,255,255,0.95)',
                      }}
                    />
                    <LetterStaggerText
                      text={item.time}
                      type="timeline"
                      as="p"
                      className="font-['Cinzel',serif] text-[11px] tracking-wider text-[#785B24] font-semibold mt-0.5"
                    />
                    <LetterStaggerText
                      text={item.desc}
                      type="timeline"
                      as="p"
                      className="font-['Cormorant_Garamond',serif] text-xs italic text-[#2C3827] mt-1 font-medium"
                      style={{
                        textShadow: '0 1px 2px rgba(255,255,255,0.85)',
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ========================================================
              SECTION 5: VENUE & DRESS CODE
              Intro & Outro Animation: Architectural Dome 3D Spin
              Video Background: Couple royal pose!
              ======================================================== */}
          <section className="relative z-10 py-16 px-6 min-h-[85vh] flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.82, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="w-full max-w-[340px] text-center"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-[#B59A57]/60 flex items-center justify-center text-[#B59A57] bg-white/80 shadow-md">
                <Building2 className="w-5 h-5" />
              </div>

              <LetterStaggerText
                text={t.venueTitle}
                type="venue"
                as="h3"
                className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl sm:text-4xl text-[#1E2E1B] tracking-wide"
                style={{
                  textShadow: '0 1px 3px rgba(255,255,255,0.95)',
                }}
              />
              <div className="flex items-center justify-center gap-2 mt-1.5 mb-4 opacity-80">
                <div className="w-8 h-[1px] bg-[#B59A57]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                <div className="w-8 h-[1px] bg-[#B59A57]" />
              </div>

              <LetterStaggerText
                text={t.palaceName}
                type="venue"
                as="h4"
                className="font-['Playfair_Display',serif] text-lg font-bold text-[#1E2E1B]"
                style={{
                  textShadow: '0 1px 2px rgba(255,255,255,0.95)',
                }}
              />
              <LetterStaggerText
                text={t.palaceCity}
                type="venue"
                as="p"
                className="font-['Cinzel',serif] text-xs tracking-wider text-[#6B5A3E] font-semibold mt-1 uppercase"
              />

              {/* Floating Venue Pin & Google Maps Action */}
              <div className="mt-5 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#273822]/90 backdrop-blur-md text-[#E6D197] flex items-center justify-center shadow-lg border-2 border-[#DFC07C] mb-3">
                  <MapPin className="w-6 h-6 animate-pulse" />
                </div>
                <a
                  href="https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#273822]/90 backdrop-blur-md text-[#FAF8F5] text-xs font-['Cinzel',serif] tracking-wider uppercase shadow-md hover:bg-[#1D2B19] active:scale-95 transition-all border border-[#B59A57]/40"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#E6D197]" />
                  <span>{t.viewMap}</span>
                </a>
              </div>

              {/* Dress Code Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 pt-4 border-t border-[#DFC07C]/40"
              >
                <div className="w-9 h-9 mx-auto mb-1.5 rounded-full border border-[#B59A57]/50 flex items-center justify-center text-[#B59A57] bg-white/80 shadow-sm">
                  <Shirt className="w-4 h-4" />
                </div>
                <LetterStaggerText
                  text={t.dressCodeTitle}
                  type="venue"
                  as="h4"
                  className="font-['Alex_Brush','Pinyon_Script',cursive] text-2xl text-[#1E2E1B]"
                  style={{
                    textShadow: '0 1px 2px rgba(255,255,255,0.95)',
                  }}
                />
                <LetterStaggerText
                  text={t.dressCodeValue}
                  type="venue"
                  as="p"
                  className="font-['Playfair_Display',serif] text-sm font-bold text-[#273822] mt-0.5"
                />
                <LetterStaggerText
                  text={t.dressCodeDesc}
                  type="venue"
                  as="p"
                  className="font-['Cormorant_Garamond',serif] text-xs italic text-[#3A4A33] mt-0.5 font-medium"
                />
              </motion.div>
            </motion.div>
          </section>

          {/* ========================================================
              SECTION 6: RSVP FORM
              Intro & Outro Animation: Luxury Velvet Mist Float
              Video Background: Couple royal pose + Celebration fireworks!
              ======================================================== */}
          <section className="relative z-10 py-16 px-6 min-h-[85vh] flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="w-full max-w-[340px] text-center"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-[#B59A57]/60 flex items-center justify-center text-[#B59A57] bg-white/80 shadow-md">
                <Mail className="w-5 h-5" />
              </div>

              <LetterStaggerText
                text={t.rsvpTitle}
                type="rsvp"
                as="h3"
                className="font-['Cinzel',serif] text-2xl text-[#1E2E1B] tracking-widest font-bold uppercase"
                style={{
                  textShadow: '0 1px 3px rgba(255,255,255,0.95)',
                }}
              />
              <div className="flex items-center justify-center gap-2 mt-1.5 mb-3 opacity-80">
                <div className="w-8 h-[1px] bg-[#B59A57]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                <div className="w-8 h-[1px] bg-[#B59A57]" />
              </div>

              <LetterStaggerText
                text={t.rsvpIntro}
                type="rsvp"
                as="p"
                className="font-['Cormorant_Garamond',serif] text-xs sm:text-sm italic text-[#273822] max-w-[280px] mx-auto mb-6 font-medium"
                style={{
                  textShadow: '0 1px 2px rgba(255,255,255,0.9)',
                }}
              />

              {rsvpSubmitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-8 flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#273822] text-[#E6D197] flex items-center justify-center mb-3 shadow-lg border border-[#DFC07C]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-['Playfair_Display',serif] text-lg font-bold text-[#1E2E1B]">
                    {t.rsvpSuccessTitle}
                  </h4>
                  <p className="font-['Cormorant_Garamond',serif] text-xs italic text-[#3A4A33] mt-1 max-w-[240px]">
                    {t.rsvpSuccessDesc}
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleRsvpSubmit}
                  className={`space-y-3 text-left max-w-[320px] mx-auto ${
                    isRTL ? 'text-right' : ''
                  }`}
                >
                  <div>
                    <label className="block text-[10px] font-['Cinzel',serif] tracking-wider text-[#273822] font-bold uppercase mb-1">
                      {t.labelName}
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder={t.placeholderName}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/90 border border-[#DFC07C] text-xs font-['Cormorant_Garamond',serif] text-[#1E2E1B] font-semibold placeholder-[#788874] focus:outline-none focus:ring-2 focus:ring-[#273822] shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-['Cinzel',serif] tracking-wider text-[#273822] font-bold uppercase mb-1">
                      {t.labelEmail}
                    </label>
                    <input
                      type="email"
                      required
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/90 border border-[#DFC07C] text-xs font-['Cormorant_Garamond',serif] text-[#1E2E1B] font-semibold placeholder-[#788874] focus:outline-none focus:ring-2 focus:ring-[#273822] shadow-sm"
                    />
                  </div>

                  {/* 2-Column: Attendance & Guests */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-['Cinzel',serif] tracking-wider text-[#273822] font-bold uppercase mb-1 truncate">
                        {t.labelAttend}
                      </label>
                      <select
                        required
                        value={rsvpAttending}
                        onChange={(e) => setRsvpAttending(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-white/90 border border-[#DFC07C] text-xs font-['Cormorant_Garamond',serif] text-[#1E2E1B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#273822] shadow-sm"
                      >
                        <option value="">{t.optionSelect}</option>
                        <option value="yes">{t.optionYes}</option>
                        <option value="no">{t.optionNo}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-['Cinzel',serif] tracking-wider text-[#273822] font-bold uppercase mb-1 truncate">
                        {t.labelGuests}
                      </label>
                      <select
                        value={rsvpGuests}
                        onChange={(e) => setRsvpGuests(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-white/90 border border-[#DFC07C] text-xs font-['Cormorant_Garamond',serif] text-[#1E2E1B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#273822] shadow-sm"
                      >
                        <option value="1">1 {t.guestUnit}</option>
                        <option value="2">2 {t.guestUnit}</option>
                        <option value="3">3 {t.guestUnit}</option>
                        <option value="4">4+ {t.guestUnit}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-['Cinzel',serif] tracking-wider text-[#273822] font-bold uppercase mb-1">
                      {t.labelMessage}
                    </label>
                    <textarea
                      rows={2}
                      value={rsvpMessage}
                      onChange={(e) => setRsvpMessage(e.target.value)}
                      placeholder={t.placeholderMessage}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/90 border border-[#DFC07C] text-xs font-['Cormorant_Garamond',serif] text-[#1E2E1B] font-semibold placeholder-[#788874] focus:outline-none focus:ring-2 focus:ring-[#273822] shadow-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={rsvpLoading}
                    className="w-full py-3 rounded-full bg-[#273822] text-[#FAF8F5] text-xs font-['Cinzel',serif] tracking-widest uppercase shadow-lg hover:bg-[#1D2B19] active:scale-95 transition-all border border-[#B59A57]/40 flex items-center justify-center gap-2 mt-2"
                  >
                    {rsvpLoading ? (
                      <span className="animate-pulse">{t.sending}</span>
                    ) : (
                      <>
                        <PartyPopper className="w-3.5 h-3.5 text-[#E6D197]" />
                        <span>{t.submitBtn}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </section>

          {/* Footer Blessing */}
          <div className="relative z-10 text-center py-8 px-4">
            <LetterStaggerText
              text={t.footerBlessing}
              type="rsvp"
              as="p"
              className="font-['Alex_Brush','Pinyon_Script',cursive] text-2xl sm:text-3xl text-[#1E2E1B]"
              style={{
                textShadow: '0 1px 3px rgba(255,255,255,0.95)',
              }}
            />
            <div className="flex items-center justify-center gap-1.5 mt-2 text-[#7C9172]">
              <span className="text-xs">♥</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
