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
  Share2,
  Copy,
  Heart,
  QrCode,
  Music,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RoyalRealisticEnvelope } from './RoyalRealisticEnvelope';
import { Royal3DNames } from './Royal3DNames';
import { DynamicTextEffects } from './DynamicTextEffects';
import { ZareqiaHeartScratch } from '../zareqia/ZareqiaHeartScratch';
import { ZareqiaPhotoCarousel } from '../zareqia/ZareqiaPhotoCarousel';
import { RoyalScrollyBackground } from './RoyalScrollyBackground';
import { MilestoneSlider } from '@/components/guest/MilestoneSlider';
import { CoupleTrivia } from '@/components/guest/CoupleTrivia';
import { DjSongRequestBox } from '@/components/guest/DjSongRequestBox';
import { VoiceBlessingRecorder } from '@/components/guest/VoiceBlessingRecorder';
import { royalSitarAudio } from '@/lib/sitarSynth';
import { WeddingProject, StoryMilestone, TriviaQuestion } from '@/types/wedding';
import { saveWeddingProject } from '@/lib/firebase';

export type SupportedLanguage = 'en' | 'hi' | 'hinglish' | 'ur';

interface RoyalHeritageWeddingInvitationProps {
  project?: WeddingProject | null;
  guestName?: string;
  autoOpen?: boolean;
  weddingSlug?: string;
}

// Translations Dictionary for all 4 languages
const TRANSLATIONS: Record<
  SupportedLanguage,
  {
    langName: string;
    weAreGettingMarried: string;
    cordiallyInviting: string;
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
    storyTitle: string;
    triviaTitle: string;
    timelineTitle: string;
    addToCalendar: string;
    events: Array<{ title: string; time: string; desc: string }>;
    venueTitle: string;
    palaceName: string;
    palaceCity: string;
    viewMap: string;
    dressCodeTitle: string;
    dressCodeValue: string;
    dressCodeDesc: string;
    djTitle: string;
    voiceBlessingTitle: string;
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
    shareTitle: string;
    shareWhatsApp: string;
    copyLink: string;
    copied: string;
    footerBlessing: string;
  }
> = {
  en: {
    langName: 'English',
    weAreGettingMarried: "We're getting married",
    cordiallyInviting: 'Cordially Inviting',
    groomName: 'Aryan',
    groomParentage: 'Son of Mr. & Mrs. Sharma',
    groomTitle: 'Tech Entrepreneur',
    brideName: 'Eva',
    brideParentage: 'Daughter of Mr. & Mrs. Mehta',
    brideTitle: 'Fashion Designer',
    scrollDown: 'Scroll to Experience',
    countdownTitle: 'Counting Down to Muhurat',
    days: 'DAYS',
    hours: 'HOURS',
    minutes: 'MINUTES',
    seconds: 'SECONDS',
    storyTitle: 'Our Love Story',
    triviaTitle: 'How Well Do You Know Us?',
    timelineTitle: 'Ceremony Itinerary',
    addToCalendar: 'Add to Calendar',
    events: [
      {
        title: 'Haldi & Phoolon Ki Holi',
        time: 'Dec 11, 2026, 11:00 AM',
        desc: 'Sunlit turmeric blessings, marigold flower showers & dhol beats.',
      },
      {
        title: 'Mehndi & Royal Sangeet',
        time: 'Dec 11, 2026, 6:30 PM',
        desc: 'An evening of musical dance face-offs, henna artistry, and festive gala.',
      },
      {
        title: 'Shubh Vivah & Pheras',
        time: 'Dec 12, 2026, 10:00 AM',
        desc: 'Sacred Vedic mantras under the royal mandap as two souls unite.',
      },
      {
        title: 'Imperial Gala Reception',
        time: 'Dec 12, 2026, 7:30 PM',
        desc: 'Grand royal banquet, champagne toasts, and live sitar soirée.',
      },
    ],
    venueTitle: 'The Royal Venue',
    palaceName: 'The Royal Palace & Gardens',
    palaceCity: 'Lake Pichola, Udaipur, Rajasthan',
    viewMap: 'View on Google Maps',
    dressCodeTitle: 'Dress Code & Attire',
    dressCodeValue: 'Royal Traditional / Formal Festive',
    dressCodeDesc: 'Sunlit Ochre for Haldi, Emerald Velvet for Sangeet, Regal Ivory & Gold for Wedding.',
    djTitle: 'Request a Song for the DJ',
    voiceBlessingTitle: 'Leave a Voice Blessing',
    rsvpTitle: 'RSVP Confirmation',
    rsvpIntro:
      'Your auspicious presence and blessings are the most precious gift for our new journey.',
    rsvpSuccessTitle: 'RSVP Received with Joy!',
    rsvpSuccessDesc: 'We look forward to welcoming you warmly to the royal celebration.',
    labelName: 'Your Full Name *',
    placeholderName: 'Enter your full name',
    labelEmail: 'Email / WhatsApp Phone *',
    labelAttend: 'Will you attend? *',
    optionSelect: 'Please select...',
    optionYes: 'Joyfully Accepts with Pleasure ♥',
    optionNo: 'Regretfully Declines with Love',
    labelGuests: 'Number of Guests',
    guestUnit: 'Guest(s)',
    labelMessage: 'Heartfelt Blessing / Warm Wishes',
    placeholderMessage: 'Inscribe your blessings for the couple...',
    submitBtn: 'Confirm My Attendance',
    sending: 'Recording Attendance...',
    shareTitle: 'Share this Royal Invitation',
    shareWhatsApp: 'Share on WhatsApp',
    copyLink: 'Copy Invitation Link',
    copied: 'Link Copied to Clipboard!',
    footerBlessing: 'With Love & Blessings',
  },
  hi: {
    langName: 'हिंदी',
    weAreGettingMarried: 'हमारा शुभ विवाह',
    cordiallyInviting: 'सादर निमंत्रण',
    groomName: 'आर्यन',
    groomParentage: 'सुपुत्र: श्री एवं श्रीमती शर्मा',
    groomTitle: 'टेक उद्यमी',
    brideName: 'इवा',
    brideParentage: 'सुपुत्री: श्री एवं श्रीमती मेहता',
    brideTitle: 'फैशन डिजाइनर',
    scrollDown: 'अनुभव हेतु नीचे स्क्रॉल करें',
    countdownTitle: 'शुभ मुहूर्त का इंतजार',
    days: 'दिन',
    hours: 'घंटे',
    minutes: 'मिनट',
    seconds: 'सेकंड',
    storyTitle: 'हमारी प्रेम यात्रा',
    triviaTitle: 'आप हमें कितना जानते हैं?',
    timelineTitle: 'विवाह कार्यक्रम',
    addToCalendar: 'कैलेंडर में जोड़ें',
    events: [
      {
        title: 'हल्दी एवं फूलों की होली',
        time: '११ दिसंबर २०२६, प्रातः ११:०० बजे',
        desc: 'पारंपरिक हल्दी लेपन एवं गेंदे के फूलों की वर्षा।',
      },
      {
        title: 'मेहंदी एवं संगीत संध्या',
        time: '११ दिसंबर २०२६, सायं ६:३० बजे',
        desc: 'संगीत, नृत्य और उल्लास भरी मेहंदी की शाम।',
      },
      {
        title: 'शुभ विवाह संस्कार (फेरे)',
        time: '१२ दिसंबर २०२६, प्रातः १०:०० बजे',
        desc: 'पवित्र वैदिक सात फेरे और मंगल आशीर्वाद।',
      },
      {
        title: 'शाही प्रतिभोज (रिसेप्शन)',
        time: '१२ दिसंबर २०२६, सायं ७:३० बजे',
        desc: 'शाही रात्रिभोज एवं मंगल उत्सव।',
      },
    ],
    venueTitle: 'विवाह स्थल',
    palaceName: 'द रॉयल पैलेस एवं गार्डन्स',
    palaceCity: 'पिछोला झील, उदयपुर, राजस्थान',
    viewMap: 'गूगल मैप पर देखें',
    dressCodeTitle: 'पहनावा (Dress Code)',
    dressCodeValue: 'शाही पारंपरिक परिधान',
    dressCodeDesc: 'हल्दी हेतु पीला, संगीत हेतु एमराल्ड ग्रीन, विवाह हेतु आइवरी एवं गोल्ड।',
    djTitle: 'डीजे हेतु मनपसंद गीत का अनुरोध',
    voiceBlessingTitle: 'अपना स्वर आशीर्वाद रिकॉर्ड करें',
    rsvpTitle: 'उपस्थिति पुष्टि (RSVP)',
    rsvpIntro:
      'आपकी शुभकामनाएं और सानिध्य हमारे इस पावन प्रसंग का सबसे अनमोल उपहार हैं।',
    rsvpSuccessTitle: 'उपस्थिति सप्रेम स्वीकार की गई!',
    rsvpSuccessDesc: 'हम इस पावन उत्सव में आपके स्वागत के लिए सस्नेह प्रतीक्षारत हैं।',
    labelName: 'आपका शुभ नाम *',
    placeholderName: 'अपना पूरा नाम दर्ज करें',
    labelEmail: 'ईमेल / व्हाट्सएप नंबर *',
    labelAttend: 'क्या आप पधारेंगे? *',
    optionSelect: 'कृपया चयन करें...',
    optionYes: 'हाँ, हम सप्रेम पधारेंगे ♥',
    optionNo: 'असमर्थता के लिए क्षमा',
    labelGuests: 'अतिथियों की संख्या',
    guestUnit: 'अतिथि',
    labelMessage: 'शुभकामना संदेश',
    placeholderMessage: 'नवदंपति के लिए अपना आशीर्वाद लिखें...',
    submitBtn: 'उपस्थिति दर्ज करें',
    sending: 'भेजा जा रहा है...',
    shareTitle: 'यह शाही निमंत्रण साझा करें',
    shareWhatsApp: 'व्हाट्सएप पर शेयर करें',
    copyLink: 'लिंक कॉपी करें',
    copied: 'लिंक कॉपी हो गया!',
    footerBlessing: 'सप्रेम एवं आदर सहित',
  },
  hinglish: {
    langName: 'Hinglish',
    weAreGettingMarried: 'Humari Shaadi Hone Ja Rahi Hai',
    cordiallyInviting: 'Aapko Saparivaar Aamantrit Karte Hain',
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
    storyTitle: 'Humari Love Story',
    triviaTitle: 'Aap Humein Kitna Jaante Hain?',
    timelineTitle: 'Ceremony Schedule',
    addToCalendar: 'Calendar Mein Add Karein',
    events: [
      {
        title: 'Haldi & Phoolon Ki Holi',
        time: '11 Dec 2026, 11:00 AM',
        desc: 'Turmeric rasam, phoolon ki barsaat aur dhol beats.',
      },
      {
        title: 'Mehndi & Sangeet Night',
        time: '11 Dec 2026, 6:30 PM',
        desc: 'Gaane, dance aur rang-birangi mehndi ki dhamakedaar shaam.',
      },
      {
        title: 'Shubh Vivah & Saat Phere',
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
    dressCodeDesc: 'Haldi ke liye Yellow, Sangeet ke liye Emerald Green, aur Vivah ke liye Ivory & Gold.',
    djTitle: 'DJ Ke Liye Song Request Karein',
    voiceBlessingTitle: 'Apna Voice Aashirwaad Record Karein',
    rsvpTitle: 'RSVP Confirmation',
    rsvpIntro:
      'Aapka aashirwaad aur upsthiti humare liye sabse bada gift hai.',
    rsvpSuccessTitle: 'Aapka RSVP Confirm Ho Gaya!',
    rsvpSuccessDesc: 'Hum is shubh avsar par aapke swagat ke liye besabri se intezaar kar rahe hain.',
    labelName: 'Aapka Pura Naam *',
    placeholderName: 'Apna naam likhein',
    labelEmail: 'Email / WhatsApp Phone *',
    labelAttend: 'Kya Aap Padhaarenge? *',
    optionSelect: 'Select Karein...',
    optionYes: 'Haan, Hum Zaroor Aayenge ♥',
    optionNo: 'Kshama Karein, Aa Nahi Paayenge',
    labelGuests: 'Total Guests Ki Sankhya',
    guestUnit: 'Log',
    labelMessage: 'Blessings / Sandesh',
    placeholderMessage: 'Couple ke liye aashirwaad likhein...',
    submitBtn: 'Attendance Confirm Karein',
    sending: 'Save Ho Raha Hai...',
    shareTitle: 'Ye Card Share Karein',
    shareWhatsApp: 'WhatsApp Par Bhejein',
    copyLink: 'Link Copy Karein',
    copied: 'Link Copy Ho Gaya!',
    footerBlessing: 'Sneh Aur Aadar Sahit',
  },
  ur: {
    langName: 'اردو',
    weAreGettingMarried: 'ہماری شادی کا مبارک دن',
    cordiallyInviting: 'دعوت نامہ برائے تقریب نکاح',
    groomName: 'آرین',
    groomParentage: 'فرزند: جناب و بیگم شرما',
    groomTitle: 'ٹیک انٹرپرینور',
    brideName: 'ایوا',
    brideParentage: 'دختر: جناب و بیگم مہتا',
    brideTitle: 'فیشن ڈیزائنر',
    scrollDown: 'دیکھنے کے لیے اسکرول کریں',
    countdownTitle: 'مبارک گھڑی کا انتظار',
    days: 'دن',
    hours: 'گھنٹے',
    minutes: 'منٹ',
    seconds: 'سیکنڈ',
    storyTitle: 'ہماری محبت کی داستان',
    triviaTitle: 'آپ ہمیں کتنا جانتے ہیں؟',
    timelineTitle: 'تقریبات کا شیڈول',
    addToCalendar: 'کیلنڈر میں محفوظ کریں',
    events: [
      {
        title: 'ہلدی و مہندی کی تقریب',
        time: '١١ دسمبر ٢٠٢٦، صبح ١١:٠٠ بجے',
        desc: 'ہلدی، پھولوں کی برسات اور روایتی دھول کے ساتھ جشن۔',
      },
      {
        title: 'سنگیت اور محفل رقص',
        time: '١١ دسمبر ٢٠٢٦، شام ٦:٣٠ بجے',
        desc: 'خوبصورت گیتوں، رقص اور مہندی کی رنگین شام۔',
      },
      {
        title: 'نکاح و مبارک رسم (پھیرے)',
        time: '١٢ دسمبر ٢٠٢٦، صبح ١٠:٠٠ بجے',
        desc: 'مبارک ساعتوں میں ایجاب و قبول اور دعائیں اور برکات۔',
      },
      {
        title: 'ولیمہ و شاہی ضیافت',
        time: '١٢ دسمبر ٢٠٢٦، شام ٧:٣٠ بجے',
        desc: 'شاہی عشائیہ اور پرمسرت استقبالیہ تقریب۔',
      },
    ],
    venueTitle: 'مقام تقریب',
    palaceName: 'دی رائل پیلس اینڈ گارڈنز',
    palaceCity: 'پچھولا جھیل، ادے پور، راجستھان',
    viewMap: 'گوگل میپس پر دیکھیں',
    dressCodeTitle: 'لباس کی رہنمائی',
    dressCodeValue: 'شاہی روایتی لباس',
    dressCodeDesc: 'ہلدی کیلئے زرد، سنگیت کیلئے زمردی سبز، نکاح کیلئے سنہرا و عنبری روایتی لباس۔',
    djTitle: 'ڈی جے کے لیے من پسند گیت',
    voiceBlessingTitle: 'صوتی دعا و تبریک ریکارڈ کریں',
    rsvpTitle: 'تصدیقِ تشریف آوری (RSVP)',
    rsvpIntro:
      'آپ کی تشریف آوری اور دعائیں ہمارے اس مبارک سفر کا سب سے قیمتی تحفہ ہیں۔',
    rsvpSuccessTitle: 'آپ کی شرکت خلوص سے قبول ہوئی!',
    rsvpSuccessDesc: 'ہم اس پرمسرت موقع پر آپ کے استقبال کے بے حد مشتاق ہیں۔',
    labelName: 'آپ کا اسم گرامی *',
    placeholderName: 'اپنا پورا نام درج کریں',
    labelEmail: 'ای میل / فون نمبر *',
    labelAttend: 'کیا آپ تشریف لائیں گے؟ *',
    optionSelect: 'انتخاب فرمائیں...',
    optionYes: 'جی ہاں، نہایت مسرت سے شرکت کریں گے ♥',
    optionNo: 'معذرت، شرکت سے قاصر ہیں',
    labelGuests: 'مہمانوں کی تعداد',
    guestUnit: 'افراد',
    labelMessage: 'دعائیہ پیغام',
    placeholderMessage: 'نئے جوڑے کیلئے اپنے نیک تمنائیں تحریر فرمائیں...',
    submitBtn: 'شرکت کی تصدیق کریں',
    sending: 'محفوظ ہو رہا ہے...',
    shareTitle: 'یہ شاہی کارڈ شیئر کریں',
    shareWhatsApp: 'واٹس ایپ پر شیئر کریں',
    copyLink: 'لنک کاپی کریں',
    copied: 'لنک کاپی ہو گیا!',
    footerBlessing: 'خلوص و دعاؤں کے ساتھ',
  },
};

// Deep, High-Contrast Text Shadows for Maximum Legibility over Any Video Background
const deepTextShadow: React.CSSProperties = {
  textShadow: '0 2px 4px rgba(255, 255, 255, 0.95), 0 3px 14px rgba(0, 0, 0, 0.75)',
};
const goldGlowShadow: React.CSSProperties = {
  textShadow: '0 1px 2px rgba(255, 255, 255, 0.9), 0 2px 10px rgba(181, 154, 87, 0.65), 0 4px 14px rgba(0, 0, 0, 0.65)',
};

export const RoyalHeritageWeddingInvitation: React.FC<RoyalHeritageWeddingInvitationProps> = ({
  project,
  guestName = 'Special Guest',
  autoOpen = false,
  weddingSlug = 'royal-heritage',
}) => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [langMenuOpen, setLangMenuOpen] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(autoOpen);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [guestPassCode, setGuestPassCode] = useState<string>('');

  // RSVP Form States
  const [rsvpName, setRsvpName] = useState<string>(
    guestName !== 'Special Guest' ? guestName : ''
  );
  const [rsvpEmail, setRsvpEmail] = useState<string>('');
  const [rsvpAttending, setRsvpAttending] = useState<string>('');
  const [rsvpGuests, setRsvpGuests] = useState<string>('1');
  const [rsvpMessage, setRsvpMessage] = useState<string>('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState<boolean>(false);
  const [rsvpLoading, setRsvpLoading] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const t = TRANSLATIONS[currentLang];
  const isRTL = currentLang === 'ur';

  // 1. DYNAMIC CLIENT DATA BINDING
  const effectiveGroomName = project?.partner1 || t.groomName;
  const effectiveBrideName = project?.partner2 || t.brideName;
  const effectiveWeddingDate = project?.weddingDate || '2026-12-12T10:00:00Z';
  const effectiveVenueName = project?.venue?.name || t.palaceName;
  const effectiveVenueCity = project?.venue?.city || t.palaceCity;
  const effectiveMapsLink =
    project?.venue?.googleMapsLink ||
    `https://maps.google.com/?q=${encodeURIComponent(
      effectiveVenueName + ' ' + effectiveVenueCity
    )}`;
  const effectiveSlug = weddingSlug || project?.slug || 'royal-heritage';

  // Dynamic countdown target
  const [timeLeft, setTimeLeft] = useState({
    days: 29,
    hours: 19,
    minutes: 9,
    seconds: 55,
  });

  useEffect(() => {
    const targetDate = new Date(effectiveWeddingDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [effectiveWeddingDate]);

  // Audio Player (Indian Wedding Instrumental + Web Audio Sitar fallback)
  useEffect(() => {
    const audio = new Audio('/audio/indian-wedding-instrumental.mp3');
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

  const handleCurtainsOpen = () => {
    if (!isAudioPlaying) {
      toggleAudio();
    }
  };

  const handleEnvelopeComplete = () => {
    setIsEnvelopeOpen(true);
  };

  // RSVP Submission Handler with Firebase persistence & VIP Pass generation
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    setRsvpLoading(true);
    const passToken = `ROYAL-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    setGuestPassCode(passToken);

    // Save to Firebase/Local project guest list if project is present
    if (project) {
      const updatedGuests = [
        ...(project.guests || []),
        {
          id: `g-${Date.now()}`,
          name: rsvpName.trim(),
          phone: rsvpEmail.trim(),
          sentWhatsApp: false,
          rsvpStatus: (rsvpAttending === 'yes' ? 'attending' : 'declined') as 'attending' | 'declined',
          attendingCount: Number(rsvpGuests) || 1,
          dietaryChoice: rsvpMessage.trim(),
        },
      ];
      try {
        await saveWeddingProject({ ...project, guests: updatedGuests });
      } catch {
        // local ledger fallback
      }
    }

    setTimeout(() => {
      setRsvpLoading(false);
      setRsvpSubmitted(true);

      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#DFC07C', '#273822', '#D4AF37', '#FAF8F5'],
      });
    }, 600);
  };

  // Google Calendar Link Helper
  const getGoogleCalendarLink = (
    title: string,
    timeStr: string,
    venueStr: string,
    descStr: string
  ) => {
    const encTitle = encodeURIComponent(`${title} - ${effectiveGroomName} & ${effectiveBrideName}`);
    const encDetails = encodeURIComponent(descStr);
    const encLocation = encodeURIComponent(venueStr);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encTitle}&details=${encDetails}&location=${encLocation}`;
  };

  // WhatsApp & Share Links
  const handleShareWhatsApp = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const msg = encodeURIComponent(
      `👑 Royal Wedding Invitation: ${effectiveGroomName} & ${effectiveBrideName} cordially invite you to their wedding celebrations!\n\nExperience the interactive royal microsite here:\n${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Milestones & Trivia fallbacks
  const effectiveMilestones: StoryMilestone[] =
    project?.story && project.story.length > 0
      ? project.story
      : [
          {
            id: 'sm-1',
            year: '2021',
            title: 'First Glance & Destiny',
            description: `A chance meeting over filter coffee sparked a beautiful conversation between ${effectiveGroomName} and ${effectiveBrideName} that never ended.`,
            imageUrl:
              'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
          },
          {
            id: 'sm-2',
            year: '2023',
            title: 'A Promise Under the Stars',
            description: `Floating on Lake Pichola during twilight, ${effectiveGroomName} made a quiet promise to ${effectiveBrideName} under the glowing palace lights.`,
            imageUrl:
              'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
          },
          {
            id: 'sm-3',
            year: '2026',
            title: 'The Sacred Roka Ceremony',
            description: `Both families united with folded hands and heartfelt prayers, sealing forever in the auspicious presence of elders.`,
            imageUrl:
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
          },
        ];

  const effectiveTrivia: TriviaQuestion[] =
    project?.trivia && project.trivia.length > 0
      ? project.trivia
      : [
          {
            id: 'tr-1',
            question: `Who confessed their love first between ${effectiveGroomName} and ${effectiveBrideName}?`,
            options: [
              effectiveGroomName,
              effectiveBrideName,
              'Both at the exact same sunset!',
              'Still debating playfully!',
            ],
            correctIndex: 2,
            explanation: 'They spoke the words at the exact same second while watching the twilight sunset!',
          },
          {
            id: 'tr-2',
            question: 'What is their favorite weekend dish to cook together?',
            options: [
              'Slow-cooked Sunday Rajma Chawal with Desi Ghee',
              'Woodfired Truffle Pizza',
              'Street-style Pav Bhaji',
              'Belgian Waffles with Strawberries',
            ],
            correctIndex: 0,
            explanation: 'Slow-simmered Sunday Rajma Chawal with pure desi ghee is their sacred ritual!',
          },
          {
            id: 'tr-3',
            question: 'Where was their first spontaneous vacation together?',
            options: [
              'Udaipur Lake Palaces',
              'Quiet Beaches of North Goa',
              'Ladakh Mountain Expedition',
              'Manali Snow Chalets',
            ],
            correctIndex: 1,
            explanation: 'A spontaneous monsoon road trip to the serene beaches of North Goa!',
          },
        ];

  // Effective events schedule
  const effectiveEvents =
    project?.events && project.events.length > 0
      ? project.events.map((ev) => ({
          title: ev.title,
          time: `${ev.date ? ev.date + ' • ' : ''}${ev.time}`,
          desc: ev.subtitle || ev.dressCodeDetails || ev.venue,
          venue: ev.venue,
        }))
      : t.events;

  return (
    <div
      className={`relative min-h-screen w-full bg-[#FAF8F5] overflow-x-hidden selection:bg-[#D4AF37]/30 select-none ${
        isRTL ? 'font-serif rtl' : ''
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* ========================================================
          1. 3D SCROLL-SCRUBBED VIDEO CANVAS BACKGROUND (100% EDGE-TO-EDGE)
          Zero black strips, zero borders, covers entire viewport smoothly
          ======================================================== */}
      <RoyalScrollyBackground
        scrollerRef={scrollContainerRef}
        overlayOpacity={0.16}
      />

      {/* ========================================================
          2. STAGE 1 & 2: 3D REALISTIC PERSPECTIVE GATEFOLD ENVELOPE
          Wax seal cracking, gold confetti burst, audio launch
          ======================================================== */}
      {!isEnvelopeOpen && (
        <RoyalRealisticEnvelope
          onCurtainsOpen={handleCurtainsOpen}
          onOpenComplete={handleEnvelopeComplete}
          isArabic={isRTL}
          onToggleLanguage={() =>
            setCurrentLang(currentLang === 'en' ? 'hi' : 'en')
          }
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={toggleAudio}
        />
      )}

      {/* ========================================================
          3. FLOATING MINIMAL CONTROLS (Top-Left Language, Top-Right Sound)
          Zero Header Strip: Clean, floating, frosted acrylic buttons
          ======================================================== */}
      {/* Floating Sound Toggle (Top-Right) */}
      <button
        onClick={toggleAudio}
        aria-label="Toggle Sound"
        className="fixed top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md text-[#273822] text-xs font-['Cinzel',serif] tracking-wider uppercase border border-[#B59A57]/45 hover:bg-[#FAF8F5] transition-all shadow-md active:scale-95 cursor-pointer"
        style={deepTextShadow}
      >
        {isAudioPlaying ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#B59A57] animate-pulse" />
            <span className="font-bold">Sound On</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-[#6B5A3E]" />
            <span className="font-bold">Mute</span>
          </>
        )}
      </button>

      {/* Floating 4-Language Switcher (Top-Left) */}
      <div className="fixed top-4 left-4 z-50">
        <AnimatePresence>
          {langMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="bg-[#FAF8F5]/95 backdrop-blur-md border border-[#B59A57]/50 shadow-xl rounded-2xl p-1.5 flex flex-col gap-1 mb-1"
            >
              {(
                [
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिंदी' },
                  { code: 'hinglish', label: 'Hinglish' },
                  { code: 'ur', label: 'اردو' },
                ] as const
              ).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang.code);
                    setLangMenuOpen(false);
                  }}
                  className={`px-3 py-1 text-xs rounded-xl text-left transition-colors font-medium ${
                    currentLang === lang.code
                      ? 'bg-[#273822] text-[#FAF8F5] font-bold shadow-sm'
                      : 'text-[#273822] hover:bg-[#DFC07C]/25'
                  }`}
                  style={deepTextShadow}
                >
                  {lang.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setLangMenuOpen(!langMenuOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md border border-[#B59A57]/45 shadow-md text-[11px] font-['Cinzel',serif] tracking-wider uppercase text-[#273822] hover:bg-[#FAF8F5] active:scale-95 transition-all cursor-pointer"
          style={deepTextShadow}
        >
          <Globe className="w-3.5 h-3.5 text-[#B59A57]" />
          <span className="font-bold">{t.langName}</span>
        </button>
      </div>

      {/* ========================================================
          4. SCROLLABLE CONTENT BODY (CARDLESS, FLOATING OVER VIDEO)
          Edge-to-edge full width with centered responsive content
          ======================================================== */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 w-full min-h-screen overflow-y-auto overflow-x-hidden scrollbar-none pb-20"
      >
        <div className="w-full max-w-xl mx-auto px-4 sm:px-6">
          {/* ========================================================
              SECTION 1: HERO (Dynamic Couple Names 3D Pop-Out)
              ======================================================== */}
          <section className="relative min-h-[92vh] flex flex-col items-center justify-between pt-16 sm:pt-20 pb-8 text-center z-10">
            {/* Top Announcement */}
            <motion.div
              initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-center gap-2 opacity-90">
                <div className="w-10 h-[1.5px] bg-[#B59A57]" />
                <Sparkles className="w-3.5 h-3.5 text-[#B59A57] animate-pulse" />
                <div className="w-10 h-[1.5px] bg-[#B59A57]" />
              </div>

              <DynamicTextEffects
                text={t.weAreGettingMarried}
                effect="typewriter"
                speed={40}
                showCursor={true}
                className="font-['Cinzel',serif] text-xs sm:text-sm tracking-[0.25em] text-[#273822] font-black uppercase"
                style={deepTextShadow}
              />

              {guestName && guestName !== 'Special Guest' && (
                <div className="pt-1">
                  <span
                    className="inline-block px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm border border-[#B59A57]/50 font-['Cinzel',serif] text-[10px] sm:text-[11px] text-[#785B24] tracking-widest uppercase font-bold"
                    style={deepTextShadow}
                  >
                    {t.cordiallyInviting}: {guestName}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Couple Names: 3D Pop Out Effect on Every Letter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="my-auto py-4 w-full flex flex-col items-center"
            >
              <Royal3DNames
                groomName={effectiveGroomName}
                brideName={effectiveBrideName}
                ampersand="&"
                isRTL={isRTL}
              />

              {/* Parents Lineage & Titles */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="mt-3 flex items-center justify-center gap-4 text-xs font-['Cormorant_Garamond',serif] text-[#273822]"
                style={deepTextShadow}
              >
                <div className={`flex flex-col ${isRTL ? 'text-left' : 'text-right'}`}>
                  <DynamicTextEffects
                    text={t.groomParentage}
                    effect="shimmer-wave"
                    delay={120}
                    className="font-bold leading-tight"
                    style={deepTextShadow}
                  />
                  <DynamicTextEffects
                    text={t.groomTitle}
                    effect="shimmer-wave"
                    delay={200}
                    className="italic text-[#785B24] text-[10px] sm:text-[11px] font-bold"
                    style={deepTextShadow}
                  />
                </div>
                <div className="w-[1.5px] h-6 bg-[#B59A57]/80" />
                <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                  <DynamicTextEffects
                    text={t.brideParentage}
                    effect="shimmer-wave"
                    delay={120}
                    className="font-bold leading-tight"
                    style={deepTextShadow}
                  />
                  <DynamicTextEffects
                    text={t.brideTitle}
                    effect="shimmer-wave"
                    delay={200}
                    className="italic text-[#785B24] text-[10px] sm:text-[11px] font-bold"
                    style={deepTextShadow}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.95 }}
              viewport={{ once: false }}
              className="relative z-10 flex flex-col items-center gap-1 animate-bounce pb-2"
            >
              <DynamicTextEffects
                text={t.scrollDown}
                effect="typewriter"
                speed={50}
                className="text-[10px] sm:text-[11px] font-['Cinzel',serif] tracking-widest text-[#273822] font-black uppercase"
                style={deepTextShadow}
              />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
            </motion.div>
          </section>

          {/* ========================================================
              SECTION 2: SCRATCH TO REVEAL (Interactive 3D Glitter Heart)
              ======================================================== */}
          <section className="relative z-10 py-16 min-h-[85vh] flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.72, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center"
              style={{
                filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.22))',
              }}
            >
              <ZareqiaHeartScratch
                coupleNames={`${effectiveGroomName} & ${effectiveBrideName}`}
                weddingDate={
                  currentLang === 'hi'
                    ? '१२ दिसंबर २०२६'
                    : currentLang === 'ur'
                    ? '١٢ دسمبر ٢٠٢٦'
                    : 'December 12, 2026'
                }
                weddingDay={
                  currentLang === 'hi'
                    ? 'शनिवार'
                    : currentLang === 'ur'
                    ? 'ہفتہ'
                    : 'Saturday'
                }
                weddingTime={
                  currentLang === 'hi'
                    ? 'प्रातः १०:०० बजे'
                    : currentLang === 'ur'
                    ? 'صبح ١٠:٠٠ بجے'
                    : '10:00 AM'
                }
                language={currentLang}
              />
            </motion.div>
          </section>

          {/* ========================================================
              SECTION 3: PHOTO CAROUSEL & LIVE COUNTDOWN
              ======================================================== */}
          <section className="relative z-10 py-16 min-h-[85vh] flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, x: -50, rotateY: 10 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="w-full max-w-[380px]"
            >
              {/* Photo Carousel */}
              <div className="rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.3)] border-2 border-white/80">
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
                <DynamicTextEffects
                  text={t.countdownTitle}
                  effect="pop-3d"
                  as="h3"
                  className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl sm:text-4xl text-[#1E2E1B] tracking-wide"
                  style={deepTextShadow}
                />
                <div className="flex items-center justify-center gap-2 mt-1.5 opacity-90">
                  <div className="w-8 h-[1.5px] bg-[#B59A57]" />
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                  <div className="w-8 h-[1.5px] bg-[#B59A57]" />
                </div>
              </motion.div>

              {/* Countdown Blocks */}
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
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/90 backdrop-blur-[4px] border border-[#DFC07C] shadow-lg"
                  >
                    <span
                      className="font-['Playfair_Display',serif] text-xl sm:text-2xl font-black text-[#273822]"
                      style={deepTextShadow}
                    >
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <DynamicTextEffects
                      text={item.label}
                      effect="pop-3d"
                      as="span"
                      className="text-[9px] font-['Cinzel',serif] tracking-wider text-[#6B5A3E] font-bold mt-0.5 uppercase"
                      style={deepTextShadow}
                    />
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* ========================================================
              SECTION 4: OUR LOVE STORY MILESTONES
              Feature decided from beginning: Chapter-by-chapter slider
              ======================================================== */}
          <section className="relative z-10 py-16 min-h-[85vh] flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="w-full text-center"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-[#B59A57]/70 flex items-center justify-center text-[#B59A57] bg-white/90 shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>

              <DynamicTextEffects
                text={t.storyTitle}
                effect="scepter-slide"
                as="h3"
                className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl sm:text-4xl text-[#1E2E1B] tracking-wide"
                style={deepTextShadow}
              />
              <div className="flex items-center justify-center gap-2 mt-1.5 mb-6 opacity-90">
                <div className="w-8 h-[1.5px] bg-[#B59A57]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                <div className="w-8 h-[1.5px] bg-[#B59A57]" />
              </div>

              {/* Milestone Slider */}
              <div className="rounded-3xl overflow-hidden bg-white/85 backdrop-blur-md border border-[#DFC07C] shadow-xl p-4 sm:p-6">
                <MilestoneSlider
                  milestones={effectiveMilestones}
                  language={currentLang === 'hi' ? 'hi' : 'en'}
                />
              </div>
            </motion.div>
          </section>

          {/* ========================================================
              SECTION 5: INTERACTIVE COUPLE TRIVIA QUIZ
              Feature decided from beginning: Fun guest engagement
              ======================================================== */}
          <section className="relative z-10 py-16 min-h-[85vh] flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="w-full text-center"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-[#B59A57]/70 flex items-center justify-center text-[#B59A57] bg-white/90 shadow-md">
                <HelpCircle className="w-5 h-5" />
              </div>

              <DynamicTextEffects
                text={t.triviaTitle}
                effect="dome-rise"
                as="h3"
                className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl sm:text-4xl text-[#1E2E1B] tracking-wide"
                style={deepTextShadow}
              />
              <div className="flex items-center justify-center gap-2 mt-1.5 mb-6 opacity-90">
                <div className="w-8 h-[1.5px] bg-[#B59A57]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                <div className="w-8 h-[1.5px] bg-[#B59A57]" />
              </div>

              {/* Interactive Trivia */}
              <div className="rounded-3xl overflow-hidden bg-white/90 backdrop-blur-md border border-[#DFC07C] shadow-xl p-4 sm:p-6">
                <CoupleTrivia
                  questions={effectiveTrivia}
                  coupleNames={`${effectiveGroomName} & ${effectiveBrideName}`}
                  language={currentLang === 'hi' ? 'hi' : 'en'}
                />
              </div>
            </motion.div>
          </section>

          {/* ========================================================
              SECTION 6: CEREMONY ITINERARY & CALENDAR SYNC
              ======================================================== */}
          <section className="relative z-10 py-16 min-h-[85vh] flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, y: 50, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="w-full text-center"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-[#B59A57]/70 flex items-center justify-center text-[#B59A57] bg-white/90 shadow-md">
                <Clock className="w-5 h-5" />
              </div>

              <DynamicTextEffects
                text={t.timelineTitle}
                effect="scepter-slide"
                as="h3"
                className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl sm:text-4xl text-[#1E2E1B] tracking-wide"
                style={deepTextShadow}
              />
              <div className="flex items-center justify-center gap-2 mt-1.5 mb-8 opacity-90">
                <div className="w-8 h-[1.5px] bg-[#B59A57]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                <div className="w-8 h-[1.5px] bg-[#B59A57]" />
              </div>

              {/* Ceremonies Timeline */}
              <div
                className={`relative pl-6 space-y-7 text-left max-w-[340px] mx-auto border-l-2 border-[#DFC07C] ${
                  isRTL ? 'text-right border-l-0 border-r-2 pr-6 pl-0' : ''
                }`}
              >
                {effectiveEvents.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: index * 0.12 }}
                    className="relative bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-[#DFC07C]/50 shadow-md"
                  >
                    <div
                      className={`absolute top-4 w-3.5 h-3.5 rounded-full bg-[#273822] border-2 border-[#DFC07C] shadow-md ${
                        isRTL ? '-right-[31px]' : '-left-[31px]'
                      }`}
                    />
                    <DynamicTextEffects
                      text={item.title}
                      effect="scepter-slide"
                      as="h4"
                      className="font-['Playfair_Display',serif] text-base font-black text-[#1E2E1B]"
                      style={deepTextShadow}
                    />
                    <DynamicTextEffects
                      text={item.time}
                      effect="scepter-slide"
                      as="p"
                      className="font-['Cinzel',serif] text-[11px] tracking-wider text-[#785B24] font-bold mt-0.5"
                      style={deepTextShadow}
                    />
                    <DynamicTextEffects
                      text={item.desc}
                      effect="scepter-slide"
                      as="p"
                      className="font-['Cormorant_Garamond',serif] text-xs italic text-[#2C3827] mt-1 font-semibold"
                      style={deepTextShadow}
                    />

                    {/* Add to Google Calendar Action */}
                    <div className="mt-2.5 pt-2 border-t border-[#DFC07C]/40">
                      <a
                        href={getGoogleCalendarLink(
                          item.title,
                          item.time,
                          effectiveVenueName,
                          item.desc
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-['Cinzel',serif] font-bold tracking-wider uppercase text-[#785B24] hover:text-[#273822] transition-colors"
                        style={deepTextShadow}
                      >
                        <Calendar className="w-3 h-3 text-[#B59A57]" />
                        <span>{t.addToCalendar}</span>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ========================================================
              SECTION 7: VENUE & GOOGLE MAPS NAVIGATION
              ======================================================== */}
          <section className="relative z-10 py-16 min-h-[85vh] flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="w-full text-center"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-[#B59A57]/70 flex items-center justify-center text-[#B59A57] bg-white/90 shadow-md">
                <Building2 className="w-5 h-5" />
              </div>

              <DynamicTextEffects
                text={t.venueTitle}
                effect="dome-rise"
                as="h3"
                className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl sm:text-4xl text-[#1E2E1B] tracking-wide"
                style={deepTextShadow}
              />
              <div className="flex items-center justify-center gap-2 mt-1.5 mb-4 opacity-90">
                <div className="w-8 h-[1.5px] bg-[#B59A57]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                <div className="w-8 h-[1.5px] bg-[#B59A57]" />
              </div>

              <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-[#DFC07C] shadow-xl max-w-[340px] mx-auto">
                <DynamicTextEffects
                  text={effectiveVenueName}
                  effect="dome-rise"
                  as="h4"
                  className="font-['Playfair_Display',serif] text-lg font-black text-[#1E2E1B]"
                  style={deepTextShadow}
                />
                <DynamicTextEffects
                  text={effectiveVenueCity}
                  effect="dome-rise"
                  as="p"
                  className="font-['Cinzel',serif] text-xs tracking-wider text-[#6B5A3E] font-bold mt-1 uppercase"
                  style={deepTextShadow}
                />

                {/* Floating Venue Pin & Google Maps Action */}
                <div className="mt-4 flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-[#273822] text-[#E6D197] flex items-center justify-center shadow-lg border-2 border-[#DFC07C] mb-3">
                    <MapPin className="w-5 h-5 animate-pulse" />
                  </div>
                  <a
                    href={effectiveMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#273822] text-[#FAF8F5] text-xs font-['Cinzel',serif] tracking-wider uppercase shadow-md hover:bg-[#1D2B19] active:scale-95 transition-all border border-[#B59A57]/60 cursor-pointer"
                    style={deepTextShadow}
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#E6D197]" />
                    <span className="font-bold">{t.viewMap}</span>
                  </a>
                </div>
              </div>

              {/* Dress Code Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 pt-4 border-t border-[#DFC07C]/50 max-w-[340px] mx-auto"
              >
                <div className="w-9 h-9 mx-auto mb-1.5 rounded-full border border-[#B59A57]/60 flex items-center justify-center text-[#B59A57] bg-white/90 shadow-sm">
                  <Shirt className="w-4 h-4" />
                </div>
                <DynamicTextEffects
                  text={t.dressCodeTitle}
                  effect="dome-rise"
                  as="h4"
                  className="font-['Alex_Brush','Pinyon_Script',cursive] text-2xl text-[#1E2E1B]"
                  style={deepTextShadow}
                />
                <DynamicTextEffects
                  text={t.dressCodeValue}
                  effect="dome-rise"
                  as="p"
                  className="font-['Playfair_Display',serif] text-sm font-black text-[#273822] mt-0.5"
                  style={deepTextShadow}
                />
                <DynamicTextEffects
                  text={t.dressCodeDesc}
                  effect="dome-rise"
                  as="p"
                  className="font-['Cormorant_Garamond',serif] text-xs italic text-[#3A4A33] mt-0.5 font-bold"
                  style={deepTextShadow}
                />
              </motion.div>
            </motion.div>
          </section>

          {/* ========================================================
              SECTION 8: SANGEET DJ SONG REQUEST BOX
              Feature decided from beginning: Live interactive music requests
              ======================================================== */}
          <section className="relative z-10 py-16 min-h-[85vh] flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="w-full text-center"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-[#B59A57]/70 flex items-center justify-center text-[#B59A57] bg-white/90 shadow-md">
                <Music className="w-5 h-5" />
              </div>

              <DynamicTextEffects
                text={t.djTitle}
                effect="pop-3d"
                as="h3"
                className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl sm:text-4xl text-[#1E2E1B] tracking-wide"
                style={deepTextShadow}
              />
              <div className="flex items-center justify-center gap-2 mt-1.5 mb-6 opacity-90">
                <div className="w-8 h-[1.5px] bg-[#B59A57]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                <div className="w-8 h-[1.5px] bg-[#B59A57]" />
              </div>

              {/* DJ Song Request Box */}
              <div className="rounded-3xl overflow-hidden bg-white/90 backdrop-blur-md border border-[#DFC07C] shadow-xl p-4 sm:p-6 max-w-[340px] mx-auto">
                <DjSongRequestBox
                  weddingSlug={effectiveSlug}
                  defaultGuestName={guestName !== 'Special Guest' ? guestName : ''}
                  language={currentLang === 'hi' ? 'hi' : 'en'}
                />
              </div>
            </motion.div>
          </section>

          {/* ========================================================
              SECTION 9: VOICE BLESSING AUDIO RECORDER
              Feature decided from beginning: Mic voice recording for couple
              ======================================================== */}
          <section className="relative z-10 py-16 min-h-[85vh] flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="w-full text-center"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-[#B59A57]/70 flex items-center justify-center text-[#B59A57] bg-white/90 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>

              <DynamicTextEffects
                text={t.voiceBlessingTitle}
                effect="velvet-mist"
                as="h3"
                className="font-['Alex_Brush','Pinyon_Script',cursive] text-3xl sm:text-4xl text-[#1E2E1B] tracking-wide"
                style={deepTextShadow}
              />
              <div className="flex items-center justify-center gap-2 mt-1.5 mb-6 opacity-90">
                <div className="w-8 h-[1.5px] bg-[#B59A57]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                <div className="w-8 h-[1.5px] bg-[#B59A57]" />
              </div>

              {/* Voice Blessing Box */}
              <div className="rounded-3xl overflow-hidden bg-white/90 backdrop-blur-md border border-[#DFC07C] shadow-xl p-4 sm:p-6 max-w-[340px] mx-auto">
                <VoiceBlessingRecorder
                  weddingSlug={effectiveSlug}
                  defaultGuestName={guestName !== 'Special Guest' ? guestName : ''}
                  language={currentLang === 'hi' ? 'hi' : 'en'}
                />
              </div>
            </motion.div>
          </section>

          {/* ========================================================
              SECTION 10: RSVP FORM & VIP PASS GENERATION
              ======================================================== */}
          <section className="relative z-10 py-16 min-h-[85vh] flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="w-full text-center"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-[#B59A57]/70 flex items-center justify-center text-[#B59A57] bg-white/90 shadow-md">
                <Mail className="w-5 h-5" />
              </div>

              <DynamicTextEffects
                text={t.rsvpTitle}
                effect="velvet-mist"
                as="h3"
                className="font-['Cinzel',serif] text-2xl text-[#1E2E1B] tracking-widest font-black uppercase"
                style={deepTextShadow}
              />
              <div className="flex items-center justify-center gap-2 mt-1.5 mb-3 opacity-90">
                <div className="w-8 h-[1.5px] bg-[#B59A57]" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                <div className="w-8 h-[1.5px] bg-[#B59A57]" />
              </div>

              <DynamicTextEffects
                text={t.rsvpIntro}
                effect="velvet-mist"
                as="p"
                className="font-['Cormorant_Garamond',serif] text-xs sm:text-sm italic text-[#273822] max-w-[300px] mx-auto mb-6 font-bold"
                style={deepTextShadow}
              />

              {rsvpSubmitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-6 px-4 bg-white/95 rounded-3xl border-2 border-[#DFC07C] shadow-2xl max-w-[340px] mx-auto flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#273822] text-[#E6D197] flex items-center justify-center mb-3 shadow-lg border border-[#DFC07C]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4
                    className="font-['Playfair_Display',serif] text-lg font-black text-[#1E2E1B]"
                    style={deepTextShadow}
                  >
                    {t.rsvpSuccessTitle}
                  </h4>
                  <p
                    className="font-['Cormorant_Garamond',serif] text-xs italic text-[#3A4A33] mt-1 max-w-[260px] font-bold"
                    style={deepTextShadow}
                  >
                    {t.rsvpSuccessDesc}
                  </p>

                  {/* VIP Access Pass Card */}
                  <div className="w-full mt-4 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#B59A57]/60 text-left space-y-1 shadow-inner">
                    <div className="flex items-center justify-between border-b border-[#B59A57]/40 pb-1.5">
                      <span className="font-['Cinzel',serif] text-[10px] font-bold text-[#785B24] uppercase tracking-wider">
                        Royal VIP Boarding Pass
                      </span>
                      <span className="font-mono text-[10px] font-black text-[#273822]">
                        {guestPassCode}
                      </span>
                    </div>
                    <p className="font-['Playfair_Display',serif] font-bold text-sm text-[#1E2E1B] pt-1">
                      {rsvpName}
                    </p>
                    <p className="text-[11px] font-['Cinzel',serif] text-[#6B5A3E] font-semibold">
                      {effectiveGroomName} & {effectiveBrideName}
                    </p>
                    <p className="text-[10px] text-[#785B24] italic font-serif">
                      {effectiveVenueName} • {effectiveVenueCity}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleRsvpSubmit}
                  className={`space-y-3 text-left max-w-[340px] mx-auto bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-[#DFC07C] shadow-xl ${
                    isRTL ? 'text-right' : ''
                  }`}
                >
                  <div>
                    <label
                      className="block text-[10px] font-['Cinzel',serif] tracking-wider text-[#273822] font-black uppercase mb-1"
                      style={deepTextShadow}
                    >
                      {t.labelName}
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder={t.placeholderName}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/95 border border-[#DFC07C] text-xs font-['Cormorant_Garamond',serif] text-[#1E2E1B] font-bold placeholder-[#788874] focus:outline-none focus:ring-2 focus:ring-[#273822] shadow-sm"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[10px] font-['Cinzel',serif] tracking-wider text-[#273822] font-black uppercase mb-1"
                      style={deepTextShadow}
                    >
                      {t.labelEmail}
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      placeholder="phone or email"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/95 border border-[#DFC07C] text-xs font-['Cormorant_Garamond',serif] text-[#1E2E1B] font-bold placeholder-[#788874] focus:outline-none focus:ring-2 focus:ring-[#273822] shadow-sm"
                    />
                  </div>

                  {/* 2-Column: Attendance & Guests */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label
                        className="block text-[10px] font-['Cinzel',serif] tracking-wider text-[#273822] font-black uppercase mb-1 truncate"
                        style={deepTextShadow}
                      >
                        {t.labelAttend}
                      </label>
                      <select
                        required
                        value={rsvpAttending}
                        onChange={(e) => setRsvpAttending(e.target.value)}
                        className="w-full px-2.5 py-2.5 rounded-xl bg-white/95 border border-[#DFC07C] text-xs font-['Cormorant_Garamond',serif] text-[#1E2E1B] font-bold focus:outline-none focus:ring-2 focus:ring-[#273822] shadow-sm"
                      >
                        <option value="">{t.optionSelect}</option>
                        <option value="yes">{t.optionYes}</option>
                        <option value="no">{t.optionNo}</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-[10px] font-['Cinzel',serif] tracking-wider text-[#273822] font-black uppercase mb-1 truncate"
                        style={deepTextShadow}
                      >
                        {t.labelGuests}
                      </label>
                      <select
                        value={rsvpGuests}
                        onChange={(e) => setRsvpGuests(e.target.value)}
                        className="w-full px-2.5 py-2.5 rounded-xl bg-white/95 border border-[#DFC07C] text-xs font-['Cormorant_Garamond',serif] text-[#1E2E1B] font-bold focus:outline-none focus:ring-2 focus:ring-[#273822] shadow-sm"
                      >
                        <option value="1">1 {t.guestUnit}</option>
                        <option value="2">2 {t.guestUnit}</option>
                        <option value="3">3 {t.guestUnit}</option>
                        <option value="4">4+ {t.guestUnit}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-[10px] font-['Cinzel',serif] tracking-wider text-[#273822] font-black uppercase mb-1"
                      style={deepTextShadow}
                    >
                      {t.labelMessage}
                    </label>
                    <textarea
                      rows={2}
                      value={rsvpMessage}
                      onChange={(e) => setRsvpMessage(e.target.value)}
                      placeholder={t.placeholderMessage}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/95 border border-[#DFC07C] text-xs font-['Cormorant_Garamond',serif] text-[#1E2E1B] font-bold placeholder-[#788874] focus:outline-none focus:ring-2 focus:ring-[#273822] shadow-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={rsvpLoading}
                    className="w-full py-3.5 rounded-full bg-[#273822] text-[#FAF8F5] text-xs font-['Cinzel',serif] tracking-widest uppercase shadow-lg hover:bg-[#1D2B19] active:scale-95 transition-all border border-[#B59A57]/60 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                    style={deepTextShadow}
                  >
                    {rsvpLoading ? (
                      <span className="animate-pulse">{t.sending}</span>
                    ) : (
                      <>
                        <PartyPopper className="w-3.5 h-3.5 text-[#E6D197]" />
                        <span className="font-bold">{t.submitBtn}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </section>

          {/* ========================================================
              SECTION 11: WHATSAPP SHARE & COPY LINK
              Feature decided from beginning: One-tap social invite
              ======================================================== */}
          <section className="relative z-10 py-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              className="max-w-[340px] mx-auto p-4 rounded-3xl bg-white/85 backdrop-blur-md border border-[#DFC07C] shadow-lg space-y-3"
            >
              <h4
                className="font-['Cinzel',serif] text-xs font-black uppercase tracking-wider text-[#273822]"
                style={deepTextShadow}
              >
                {t.shareTitle}
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="py-2.5 px-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-['Cinzel',serif] font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  style={deepTextShadow}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="py-2.5 px-3 rounded-full bg-[#273822] hover:bg-[#1D2B19] text-[#FAF8F5] text-[11px] font-['Cinzel',serif] font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-[#B59A57]/40 cursor-pointer"
                  style={deepTextShadow}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#E6D197]" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </section>

          {/* ========================================================
              SECTION 12: ELEGANT BLESSING (ZERO BLACK STRIP)
              Clean, floating signature of the couple
              ======================================================== */}
          <div className="relative z-10 text-center py-8">
            <DynamicTextEffects
              text={`${t.footerBlessing}: ${effectiveGroomName} & ${effectiveBrideName}`}
              effect="velvet-mist"
              as="p"
              className="font-['Alex_Brush','Pinyon_Script',cursive] text-2xl sm:text-3xl text-[#1E2E1B]"
              style={deepTextShadow}
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
