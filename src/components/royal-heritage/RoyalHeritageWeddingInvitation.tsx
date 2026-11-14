'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RoyalRealisticEnvelope } from './RoyalRealisticEnvelope';
import { Royal3DNames } from './Royal3DNames';
import { DynamicTextEffects } from './DynamicTextEffects';
import { ZareqiaHeartScratch } from '../zareqia/ZareqiaHeartScratch';
import { ZareqiaPhotoCarousel } from '../zareqia/ZareqiaPhotoCarousel';
import { RoyalScrollyBackground } from './RoyalScrollyBackground';
import { royalSitarAudio } from '@/lib/sitarSynth';
import { WeddingProject } from '@/types/wedding';
import { saveWeddingProject } from '@/lib/firebase';
import { getDefaultCustomization } from '@/lib/customizationDefaults';

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
  }
> = {
  en: {
    langName: 'English',
    weAreGettingMarried: "We're getting married",
    cordiallyInviting: 'Cordially Inviting',
    groomName: 'Groom',
    groomParentage: 'Together With Their Families',
    groomTitle: 'Request The Honour Of Your Presence',
    brideName: 'Bride',
    brideParentage: 'To Celebrate The Sacred Union',
    brideTitle: 'And Joyful New Beginning',
    scrollDown: 'Scroll to Experience',
    countdownTitle: 'Counting Down to Muhurat',
    days: 'DAYS',
    hours: 'HOURS',
    minutes: 'MINUTES',
    seconds: 'SECONDS',
    timelineTitle: 'Ceremony Itinerary',
    events: [
      {
        title: 'Mehndi & Royal Sangeet',
        time: 'Dec 11, 2026, 6:00 PM',
        desc: 'An evening of music, dance face-offs, and festive henna.',
      },
      {
        title: 'Shubh Vivah & Pheras',
        time: 'Dec 12, 2026, 10:00 AM',
        desc: 'Sacred wedding rituals, Vedic mantras, and seven lifetimes vows.',
      },
      {
        title: 'Imperial Gala Reception',
        time: 'Dec 12, 2026, 7:30 PM',
        desc: 'Grand royal banquet, toasts, and royal celebrations.',
      },
    ],
    venueTitle: 'The Royal Venue',
    palaceName: 'The Royal Palace & Gardens',
    palaceCity: 'Lake Pichola, Udaipur, Rajasthan',
    viewMap: 'View on Google Maps',
    dressCodeTitle: 'Dress Code',
    dressCodeValue: 'Royal Traditional / Formal Festive',
    dressCodeDesc: 'Pastel florals, emerald green, and regal navy tones.',
    rsvpTitle: 'RSVP Confirmation',
    rsvpIntro:
      'Your love, blessings, and auspicious presence are the greatest gifts we could ever ask for.',
    rsvpSuccessTitle: 'RSVP Received with Joy!',
    rsvpSuccessDesc: 'We look forward to celebrating this royal celebration together.',
    labelName: 'Your Name *',
    placeholderName: 'Enter your full name',
    labelEmail: 'Email Address *',
    labelAttend: 'Will you attend? *',
    optionSelect: 'Please select...',
    optionYes: 'Joyfully Accepts with Pleasure ♥',
    optionNo: 'Regretfully Declines',
    labelGuests: 'Number of Guests',
    guestUnit: 'Guest(s)',
    labelMessage: 'Warm Wishes / Blessings',
    placeholderMessage: 'Share your heartfelt blessings for the couple...',
    submitBtn: 'Confirm RSVP',
    sending: 'Recording...',
    footerBlessing: 'With Love & Blessings',
  },
  hi: {
    langName: 'हिंदी',
    weAreGettingMarried: 'हमारा शुभ विवाह',
    cordiallyInviting: 'सादर निमंत्रण',
    groomName: 'वर',
    groomParentage: 'सादर सपरिवार निमंत्रित',
    groomTitle: 'पावन परिणय सूत्र संस्कार',
    brideName: 'वधू',
    brideParentage: 'नव युगल को शुभाशीर्वाद',
    brideTitle: 'एवं मंगलमय उपस्थिति हेतु',
    scrollDown: 'अनुभव हेतु नीचे स्क्रॉल करें',
    countdownTitle: 'शुभ मुहूर्त का इंतजार',
    days: 'दिन',
    hours: 'घंटे',
    minutes: 'मिनट',
    seconds: 'सेकंड',
    timelineTitle: 'विवाह कार्यक्रम',
    events: [
      {
        title: 'मेहंदी एवं संगीत संध्या',
        time: '११ दिसंबर २०२६, सायं ६:०० बजे',
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
    optionYes: 'हाँ, हम सप्रेम पधारेंगे ♥',
    optionNo: 'असमर्थता के लिए क्षमा',
    labelGuests: 'अतिथियों की संख्या',
    guestUnit: 'अतिथि',
    labelMessage: 'शुभकामना संदेश',
    placeholderMessage: 'नवदंपति के लिए अपना आशीर्वाद लिखें...',
    submitBtn: 'उपस्थिति दर्ज करें',
    sending: 'भेजा जा रहा है...',
    footerBlessing: 'सप्रेम एवं आदर सहित',
  },
  hinglish: {
    langName: 'Hinglish',
    weAreGettingMarried: 'Humari Shaadi Hone Ja Rahi Hai',
    cordiallyInviting: 'Aapko Saparivaar Aamantrit Karte Hain',
    groomName: 'Groom',
    groomParentage: 'Together With Their Families',
    groomTitle: 'Request The Honour Of Your Presence',
    brideName: 'Bride',
    brideParentage: 'To Celebrate The Sacred Union',
    brideTitle: 'And Joyful New Beginning',
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
    dressCodeDesc: 'Pastel florals, emerald green, aur regal navy tones.',
    rsvpTitle: 'RSVP Confirmation',
    rsvpIntro:
      'Aapka aashirwaad aur উপস্থিতি humare liye sabse bada gift hai.',
    rsvpSuccessTitle: 'Aapka RSVP Confirm Ho Gaya!',
    rsvpSuccessDesc: 'Hum is shubh avsar par aapke swagat ke liye besabri se intezaar kar rahe hain.',
    labelName: 'Aapka Pura Naam *',
    placeholderName: 'Apna pura naam likhein',
    labelEmail: 'Email Address *',
    labelAttend: 'Kya Aap Padhaarenge? *',
    optionSelect: 'Select Karein...',
    optionYes: 'Haan, Hum Zaroor Aayenge ♥',
    optionNo: 'Kshama Karein, Aa Nahi Paayenge',
    labelGuests: 'Total Guests',
    guestUnit: 'Log',
    labelMessage: 'Blessings / Sandesh',
    placeholderMessage: 'Couple ke liye aashirwaad likhein...',
    submitBtn: 'Confirm Karein',
    sending: 'Save Ho Raha Hai...',
    footerBlessing: 'Sneh Aur Aadar Sahit',
  },
  ur: {
    langName: 'اردو',
    weAreGettingMarried: 'ہماری شادی کا مبارک دن',
    cordiallyInviting: 'دعوت نامہ برائے تقریب نکاح',
    groomName: 'دولہا',
    groomParentage: 'بصد خلوص و احترام مدعو ہیں',
    groomTitle: 'اس پرمسرت نکاح کی تقریب میں',
    brideName: 'دلہن',
    brideParentage: 'نیک تمناؤں اور دعاؤں کے ساتھ',
    brideTitle: 'آپ کی تشریف آوری کے منتظر',
    scrollDown: 'دیکھنے کے لیے اسکرول کریں',
    countdownTitle: 'مبارک گھڑی کا انتظار',
    days: 'دن',
    hours: 'گھنٹے',
    minutes: 'منٹ',
    seconds: 'سیکنڈ',
    timelineTitle: 'تقریبات کا شیڈول',
    events: [
      {
        title: 'مہندی اور سنگیت کی شام',
        time: '١١ دسمبر ٢٠٢٦، شام ٦:٠٠ بجے',
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
    dressCodeDesc: 'پیسٹل پھولدار، زمردی سبز اور روایتی نیلے رنگ کا لباس۔',
    rsvpTitle: 'تصدیقِ تشریف آوری (RSVP)',
    rsvpIntro:
      'آپ کی تشریف آوری اور دعائیں ہمارے اس مبارک سفر کا سب سے قیمتی تحفہ ہیں۔',
    rsvpSuccessTitle: 'آپ کی شرکت خلوص سے قبول ہوئی!',
    rsvpSuccessDesc: 'ہم اس پرمسرت موقع پر آپ کے استقبال کے بے حد مشتاق ہیں۔',
    labelName: 'آپ کا اسم گرامی *',
    placeholderName: 'اپنا پورا نام درج کریں',
    labelEmail: 'ای میل ایڈریس *',
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
    footerBlessing: 'خلوص و دعاؤں کے ساتھ',
  },
};

// High-Contrast Deep Text Shadows for Crisp Readability over Any Video Frame
const deepTextShadow: React.CSSProperties = {
  textShadow:
    '0 2px 4px rgba(255, 255, 255, 0.95), 0 3px 12px rgba(0, 0, 0, 0.7)',
};

// Number Digit Localizer (Devanagari for Hindi, Urdu-Arabic for Urdu, Latin for English/Hinglish)
const toLocalizedDigits = (numOrStr: number | string, lang: SupportedLanguage): string => {
  const str = String(numOrStr);
  if (lang === 'hi') {
    const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return str.replace(/[0-9]/g, (d) => devanagariDigits[parseInt(d, 10)]);
  }
  if (lang === 'ur') {
    const urduDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.replace(/[0-9]/g, (d) => urduDigits[parseInt(d, 10)]);
  }
  return str;
};

// Name Localizer / Transliteration Dictionary
const NAME_MAP: Record<string, { hi: string; ur: string }> = {
  gourav: { hi: 'गौरव', ur: 'گورو' },
  gaurav: { hi: 'गौरव', ur: 'گورو' },
  gourao: { hi: 'गौरव', ur: 'گورو' },
  priya: { hi: 'प्रिया', ur: 'پریا' },
  rohit: { hi: 'रोहित', ur: 'روہت' },
  sharma: { hi: 'शर्मा', ur: 'شرما' },
  mehra: { hi: 'मेहरा', ur: 'مہرا' },
  singh: { hi: 'सिंह', ur: 'سنگھ' },
  verma: { hi: 'वर्मा', ur: 'ورما' },
  gupta: { hi: 'गुप्ता', ur: 'گپتا' },
  patel: { hi: 'पटेल', ur: 'پٹیل' },
  shah: { hi: 'शाह', ur: 'شاہ' },
  kumar: { hi: 'कुमार', ur: 'کمار' },
  kumari: { hi: 'कुमारी', ur: 'کماری' },
  kapoor: { hi: 'कपूर', ur: 'کپور' },
  khan: { hi: 'खान', ur: 'خان' },
  malik: { hi: 'मलिक', ur: 'ملک' },
  aryan: { hi: 'आर्यन', ur: 'آرین' },
  eva: { hi: 'ईवा', ur: 'ایوا' },
  charlotte: { hi: 'शार्लोट', ur: 'شارلٹ' },
  james: { hi: 'जेम्स', ur: 'جیمز' },
  zayn: { hi: 'ज़ैन', ur: 'زین' },
  nora: { hi: 'नोरा', ur: 'نورا' },
  rahul: { hi: 'राहुल', ur: 'راہول' },
  anjali: { hi: 'अंजलि', ur: 'انجلی' },
  amit: { hi: 'अमित', ur: 'امت' },
  pooja: { hi: 'पूजा', ur: 'پوجا' },
  vikram: { hi: 'विक्रम', ur: 'وکرم' },
  neha: { hi: 'नेहा', ur: 'نیہا' },
  aditya: { hi: 'आदित्य', ur: 'آدتیہ' },
  kavita: { hi: 'कविता', ur: 'کوِتا' },
  special: { hi: 'विशिष्ट', ur: 'معزز' },
  guest: { hi: 'अतिथि', ur: 'مہمان' },
};

const localizeName = (name: string, lang: SupportedLanguage): string => {
  if (!name) return '';
  if (lang === 'en' || lang === 'hinglish') return name;

  if (lang === 'hi' && /[\u0900-\u097F]/.test(name)) return name;
  if (lang === 'ur' && /[\u0600-\u06FF]/.test(name)) return name;

  const words = name.trim().split(/\s+/);
  const localizedWords = words.map((w) => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '');
    if (NAME_MAP[clean]) {
      return lang === 'hi' ? NAME_MAP[clean].hi : NAME_MAP[clean].ur;
    }
    return w;
  });

  return localizedWords.join(' ');
};

// Event Translation Dictionary
const EVENT_DICTIONARY: Record<
  string,
  {
    hi: { title: string; desc: string };
    hinglish: { title: string; desc: string };
    ur: { title: string; desc: string };
    en: { title: string; desc: string };
  }
> = {
  haldi: {
    en: {
      title: 'The Royal Haldi & Chuda',
      desc: 'Yellow hues, auspicious turmeric blessings & vibrant dhol beats.',
    },
    hi: {
      title: 'हल्दी एवं फूलों की होली',
      desc: 'हल्दी का पावन उबटन, गेंदे के फूलों की वर्षा और पारंपरिक ढोल की धुनें।',
    },
    hinglish: {
      title: 'Haldi Aur Phoolon Ki Holi',
      desc: 'Haldi ki rasam, phoolon ki barsaat aur dhol dhamaka.',
    },
    ur: {
      title: 'رسمِ ہلدی اور پھولوں کی ہولی',
      desc: 'روایتی ہلدی کی رسم، پھولوں کی برسات اور شادیانے۔',
    },
  },
  sangeet: {
    en: {
      title: 'Royal Mehendi & Sangeet Symphony',
      desc: 'Henna artistry, cocktail gala & musical dance face-off.',
    },
    hi: {
      title: 'शाही मेहंदी एवं संगीत संध्या',
      desc: 'सतरंगी मेहंदी, संगीत की महफिल और मनमोहक नृत्य समारोह।',
    },
    hinglish: {
      title: 'Royal Mehendi Aur Sangeet Night',
      desc: 'Mehendi ki raat, gaane aur dance ki grand masti.',
    },
    ur: {
      title: 'شاہی مہندی و محفلِ سنگیت',
      desc: 'رنگ برنگی مہندی، نغمات کی گونج اور پرمسرت رقص۔',
    },
  },
  phera: {
    en: {
      title: 'The Sacred Pheras & Varmala',
      desc: 'Vedic mantras under the stars as two souls unite for seven lifetimes.',
    },
    hi: {
      title: 'शुभ विवाह, वरमाला एवं पवित्र फेरे',
      desc: 'वैदिक मंत्रोच्चार, वरमाला, सात फेरे और जन्म-जन्मांतर का पवित्र बंधन।',
    },
    hinglish: {
      title: 'Shubh Vivah, Varmala Aur Saat Phere',
      desc: 'Saat phere, vedic aashirwaad aur pavitra shaadi ki rasmein.',
    },
    ur: {
      title: 'تقریبِ نکاح، ایجاب و قبول و رخصتی',
      desc: 'نکاح کے بابرکت بول، دعائیں اور زندگی بھر کا پاکیزہ ساتھ۔',
    },
  },
  reception: {
    en: {
      title: 'Imperial Gala Reception & Banquet',
      desc: 'Grand royal banquet, toasts, and royal musical celebrations.',
    },
    hi: {
      title: 'शाही प्रतिभोज (भव्य रिसेप्शन)',
      desc: 'भव्य शाही रात्रिभोज, मधुर वाद्य संगीत और आशीर्वाद उत्सव।',
    },
    hinglish: {
      title: 'Grand Royal Reception Dinner',
      desc: 'Shahi daawat, live music aur celebration.',
    },
    ur: {
      title: 'ولیمہ و شاہی استقبالیہ ضیافت',
      desc: 'شاندار شاہی عشائیہ اور پرمسرت استقبالیہ۔',
    },
  },
  cocktail: {
    en: {
      title: 'Cocktail Soirée & Sundowner',
      desc: 'Evening cocktails, soulful jazz, and joyous reunions.',
    },
    hi: {
      title: 'संध्या कॉकटेल एवं मिलन उत्सव',
      desc: 'संध्या बेला में संगीत, जलपान और आत्मीय मिलन।',
    },
    hinglish: {
      title: 'Cocktail Aur Evening Party',
      desc: 'Masti bhari shaam aur celebration.',
    },
    ur: {
      title: 'شام کی محفل و ضیافت',
      desc: 'شام کی محفل، پُرتکلف مشروبات اور خوشگوار لمحات۔',
    },
  },
};

const getLocalizedEvents = (
  rawEvents: Array<any> | undefined,
  lang: SupportedLanguage,
  defaultEvents: Array<{ title: string; time: string; desc: string }>
): Array<{ title: string; time: string; desc: string }> => {
  if (!rawEvents || rawEvents.length === 0) {
    return defaultEvents;
  }

  return rawEvents.map((ev, index) => {
    const titleLower = (ev.title || '').toLowerCase();
    let matchedKey: string | null = null;

    if (titleLower.includes('haldi') || titleLower.includes('turmeric') || titleLower.includes('chuda') || titleLower.includes('ubtan')) {
      matchedKey = 'haldi';
    } else if (titleLower.includes('sangeet') || titleLower.includes('mehendi') || titleLower.includes('mehndi') || titleLower.includes('music')) {
      matchedKey = 'sangeet';
    } else if (titleLower.includes('phera') || titleLower.includes('vivah') || titleLower.includes('wedding') || titleLower.includes('varmala') || titleLower.includes('mandap') || titleLower.includes('nikah')) {
      matchedKey = 'phera';
    } else if (titleLower.includes('reception') || titleLower.includes('valima') || titleLower.includes('walima') || titleLower.includes('gala') || titleLower.includes('banquet')) {
      matchedKey = 'reception';
    } else if (titleLower.includes('cocktail') || titleLower.includes('party') || titleLower.includes('soiree')) {
      matchedKey = 'cocktail';
    }

    let resolvedTitle = ev.title;
    let resolvedDesc = ev.subtitle || ev.desc || ev.dressCodeDetails || ev.venue || '';

    if (matchedKey && EVENT_DICTIONARY[matchedKey]) {
      resolvedTitle = EVENT_DICTIONARY[matchedKey][lang].title;
      resolvedDesc = EVENT_DICTIONARY[matchedKey][lang].desc;
    } else if (defaultEvents[index]) {
      resolvedTitle = defaultEvents[index].title;
      resolvedDesc = defaultEvents[index].desc;
    }

    let resolvedTime = ev.time || '';
    if (ev.date) {
      resolvedTime = `${ev.date} • ${ev.time}`;
    }

    if (lang === 'hi') {
      resolvedTime = resolvedTime
        .replace(/Thursday/gi, 'गुरुवार')
        .replace(/Friday/gi, 'शुक्रवार')
        .replace(/Saturday/gi, 'शनिवार')
        .replace(/Sunday/gi, 'रविवार')
        .replace(/Monday/gi, 'सोमवार')
        .replace(/Tuesday/gi, 'मंगलवार')
        .replace(/Wednesday/gi, 'बुधवार')
        .replace(/January/gi, 'जनवरी')
        .replace(/February/gi, 'फरवरी')
        .replace(/March/gi, 'मार्च')
        .replace(/April/gi, 'अप्रैल')
        .replace(/May/gi, 'मई')
        .replace(/June/gi, 'जून')
        .replace(/July/gi, 'जुलाई')
        .replace(/August/gi, 'अगस्त')
        .replace(/September/gi, 'सितंबर')
        .replace(/October/gi, 'अक्टूबर')
        .replace(/November/gi, 'नवंबर')
        .replace(/December/gi, 'दिसंबर')
        .replace(/Nov/gi, 'नवंबर')
        .replace(/Dec/gi, 'दिसंबर')
        .replace(/Jan/gi, 'जनवरी')
        .replace(/Feb/gi, 'फरवरी')
        .replace(/AM/g, 'प्रातः')
        .replace(/PM/g, 'सायं')
        .replace(/Late/gi, 'देर रात तक')
        .replace(/Midnight/gi, 'मध्यरात्रि');
      resolvedTime = toLocalizedDigits(resolvedTime, 'hi');
    } else if (lang === 'ur') {
      resolvedTime = resolvedTime
        .replace(/Thursday/gi, 'جمعرات')
        .replace(/Friday/gi, 'جمعہ')
        .replace(/Saturday/gi, 'ہفتہ')
        .replace(/Sunday/gi, 'اتوار')
        .replace(/Monday/gi, 'پیر')
        .replace(/Tuesday/gi, 'منگل')
        .replace(/Wednesday/gi, 'بدھ')
        .replace(/January/gi, 'جنوری')
        .replace(/February/gi, 'فروری')
        .replace(/March/gi, 'مارچ')
        .replace(/April/gi, 'اپریل')
        .replace(/May/gi, 'مئی')
        .replace(/June/gi, 'جون')
        .replace(/July/gi, 'جولائی')
        .replace(/August/gi, 'اگست')
        .replace(/September/gi, 'ستمبر')
        .replace(/October/gi, 'اکتوبر')
        .replace(/November/gi, 'نومبر')
        .replace(/December/gi, 'دسمبر')
        .replace(/Nov/gi, 'نومبر')
        .replace(/Dec/gi, 'دسمبر')
        .replace(/Jan/gi, 'جنوری')
        .replace(/Feb/gi, 'فروری')
        .replace(/AM/g, 'صبح')
        .replace(/PM/g, 'شام')
        .replace(/Late/gi, 'دیر تک')
        .replace(/Midnight/gi, 'نصف شب');
      resolvedTime = toLocalizedDigits(resolvedTime, 'ur');
    }

    return {
      title: resolvedTitle,
      time: resolvedTime,
      desc: resolvedDesc,
    };
  });
};

// Date helpers for Scratch Card
const getFormattedWeddingDate = (dateStr: string, lang: SupportedLanguage) => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return lang === 'hi' ? '१२ दिसंबर २०२६' : lang === 'ur' ? '۱۲ دسمبر ۲۰۲۶' : 'December 12, 2026';
    if (lang === 'hi') {
      const months = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
      const raw = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      return toLocalizedDigits(raw, 'hi');
    }
    if (lang === 'ur') {
      const months = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];
      const raw = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      return toLocalizedDigits(raw, 'ur');
    }
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return 'December 12, 2026';
  }
};

const getFormattedWeddingDay = (dateStr: string, lang: SupportedLanguage) => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return lang === 'hi' ? 'शनिवार' : lang === 'ur' ? 'ہفتہ' : 'Saturday';
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    const daysUr = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
    const dayIdx = d.getDay();
    if (lang === 'hi') return daysHi[dayIdx];
    if (lang === 'ur') return daysUr[dayIdx];
    return daysEn[dayIdx];
  } catch {
    return 'Saturday';
  }
};

const getFormattedWeddingTime = (dateStr: string, lang: SupportedLanguage) => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return lang === 'hi' ? 'प्रातः १०:०० बजे' : lang === 'ur' ? 'صبح ۱۰:۰۰ بجے' : '10:00 AM';
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    if (lang === 'hi') {
      const timeStr = `${hours}:${minutes}`;
      return `${ampm === 'AM' ? 'प्रातः' : 'सायं'} ${toLocalizedDigits(timeStr, 'hi')} बजे`;
    }
    if (lang === 'ur') {
      const timeStr = `${hours}:${minutes}`;
      return `${ampm === 'AM' ? 'صبح' : 'شام'} ${toLocalizedDigits(timeStr, 'ur')} بجے`;
    }
    return `${hours}:${minutes} ${ampm}`;
  } catch {
    return '10:00 AM';
  }
};

export const RoyalHeritageWeddingInvitation: React.FC<RoyalHeritageWeddingInvitationProps> = ({
  project,
  guestName = 'Special Guest',
  autoOpen = false,
  weddingSlug = 'royal-heritage',
}) => {
  // Merge project customization with full defaults
  const customization = useMemo(() => {
    const defaults = getDefaultCustomization(project || undefined);
    if (!project?.customization) return defaults;
    return {
      ...defaults,
      ...project.customization,
      sections: {
        ...defaults.sections,
        ...project.customization.sections,
      },
      typography: {
        ...defaults.typography,
        ...project.customization.typography,
      },
    };
  }, [project]);

  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(
    customization.defaultLanguage || 'en'
  );
  const [langMenuOpen, setLangMenuOpen] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(
    autoOpen || customization.sections.envelope.enabled === false
  );

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
  const isHindi = currentLang === 'hi';
  const isNastaliq = currentLang === 'ur';

  // 1. DYNAMIC CLIENT DATA BINDING (Always respects client couple names with authentic localization!)
  const rawGroomName = project?.partner1 || t.groomName;
  const rawBrideName = project?.partner2 || t.brideName;
  const effectiveGroomName = localizeName(rawGroomName, currentLang);
  const effectiveBrideName = localizeName(rawBrideName, currentLang);
  const localizedGuestName = localizeName(guestName, currentLang);

  const effectiveWeddingDate = project?.weddingDate || '2026-12-12T10:00:00Z';

  const effectiveVenueName =
    currentLang === 'hi'
      ? (project?.venue?.name && project.venue.name !== 'The Royal Palace & Gardens'
          ? (project.venue.name.toLowerCase().includes('oberoi') ? 'द ओबेरॉय उदयविलास पैलेस' : project.venue.name)
          : t.palaceName)
      : currentLang === 'ur'
      ? (project?.venue?.name && project.venue.name !== 'The Royal Palace & Gardens'
          ? (project.venue.name.toLowerCase().includes('oberoi') ? 'دی اوبرائے ادے ولاس پیلس' : project.venue.name)
          : t.palaceName)
      : project?.venue?.name || t.palaceName;

  const effectiveVenueCity =
    currentLang === 'hi'
      ? (project?.venue?.city && project.venue.city !== 'Lake Pichola, Udaipur, Rajasthan'
          ? (project.venue.city.toLowerCase().includes('udaipur') ? 'पिछोला झील, उदयपुर, राजस्थान' : project.venue.city)
          : t.palaceCity)
      : currentLang === 'ur'
      ? (project?.venue?.city && project.venue.city !== 'Lake Pichola, Udaipur, Rajasthan'
          ? (project.venue.city.toLowerCase().includes('udaipur') ? 'پچھولا جھیل، ادے پور، راجستھان' : project.venue.city)
          : t.palaceCity)
      : project?.venue?.city || t.palaceCity;

  const effectiveMapsLink =
    project?.venue?.googleMapsLink ||
    `https://maps.google.com/?q=${encodeURIComponent(
      effectiveVenueName + ' ' + effectiveVenueCity
    )}`;

  // Dynamic Events with full Language Localization
  const effectiveEvents = getLocalizedEvents(project?.events, currentLang, t.events);

  // Dynamic Browser Tab Title Customization
  useEffect(() => {
    const groom = effectiveGroomName || (isHindi ? 'गौरव' : isNastaliq ? 'گورو' : 'Gourav');
    const bride = effectiveBrideName || (isHindi ? 'प्रिया' : isNastaliq ? 'پریا' : 'Priya');
    if (isHindi) {
      document.title = `${groom} संग ${bride} | शुभ विवाह`;
    } else if (isNastaliq) {
      document.title = `${groom} اور ${bride} | دعوت نامہ`;
    } else {
      document.title = `${groom} Weds ${bride} | Shubh Vivah`;
    }
  }, [effectiveGroomName, effectiveBrideName, isHindi, isNastaliq]);

  // Lock window and document.body to prevent scroll chaining and persistent bottom white space
  useEffect(() => {
    const origBodyOverflow = document.body.style.overflow;
    const origBodyBg = document.body.style.backgroundColor;
    const origBodyOverscroll = document.body.style.overscrollBehavior;
    const origHtmlOverflow = document.documentElement.style.overflow;
    const origHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#1A2218';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
    window.scrollTo(0, 0);

    const preventWindowScroll = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('scroll', preventWindowScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', preventWindowScroll);
      document.body.style.overflow = origBodyOverflow;
      document.body.style.backgroundColor = origBodyBg;
      document.body.style.overscrollBehavior = origBodyOverscroll;
      document.documentElement.style.overflow = origHtmlOverflow;
      document.documentElement.style.overscrollBehavior = origHtmlOverscroll;
    };
  }, []);

  // Dynamic Typography based on active language (Pure Devanagari for Hindi, Nastaliq for Urdu)
  const fontHeading = isHindi
    ? 'font-devanagari-heading tracking-normal font-bold'
    : isNastaliq
    ? 'font-nastaliq tracking-normal'
    : "font-['Cinzel',serif] tracking-wider uppercase font-black";

  const fontSubHeading = isHindi
    ? 'font-devanagari-heading tracking-normal font-bold'
    : isNastaliq
    ? 'font-nastaliq tracking-normal'
    : "font-['Cinzel',serif] tracking-widest uppercase font-bold";

  const fontBody = isHindi
    ? 'font-devanagari tracking-normal'
    : isNastaliq
    ? 'font-nastaliq tracking-normal'
    : "font-['Cormorant_Garamond',serif]";

  const fontScriptHeading = isHindi
    ? 'font-devanagari-heading tracking-normal font-bold'
    : isNastaliq
    ? 'font-nastaliq tracking-normal'
    : "font-['Alex_Brush','Pinyon_Script',cursive] tracking-wide";

  // Dynamic countdown timer
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
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
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

  // Audio Player (User's Royal Heritage Soundtrack or Custom track)
  useEffect(() => {
    const audioSrc = customization.musicTrackUrl || project?.backgroundAudioUrl || '/audio/royal-heritage-music.mp3';
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = 0.65;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      royalSitarAudio.stopAmbient();
    };
  }, [customization.musicTrackUrl, project?.backgroundAudioUrl]);

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

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    setRsvpLoading(true);

    if (project) {
      const updatedGuests = [
        ...(project.guests || []),
        {
          id: `g-${Date.now()}`,
          name: rsvpName.trim(),
          phone: rsvpEmail.trim(),
          sentWhatsApp: false,
          rsvpStatus: (rsvpAttending === 'yes' ? 'attending' : 'declined') as
            | 'attending'
            | 'declined',
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
        particleCount: 90,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#DFC07C', '#273822', '#D4AF37', '#FAF8F5'],
      });
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 w-full h-full overflow-hidden bg-[#1A2218] select-none ${
        isHindi ? 'font-devanagari' : isRTL ? 'font-nastaliq rtl' : ''
      }`}
      style={{ touchAction: 'pan-y' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* ========================================================
          FIXED PINNED 3D SCROLL-SCRUBBED VIDEO CANVAS BACKGROUND (100% Full-Bleed Edge-to-Edge)
          ======================================================== */}
      <RoyalScrollyBackground
        scrollerRef={scrollContainerRef}
        overlayOpacity={0.16}
      />

      {/* ========================================================
          STAGE 1 & 2: REALISTIC ROYAL ENVELOPE (From User Drive)
          Magically dissolves on click anywhere + launches music
          ======================================================== */}
      {!isEnvelopeOpen && customization.sections.envelope.enabled !== false && (
        <RoyalRealisticEnvelope
          onCurtainsOpen={handleCurtainsOpen}
          onOpenComplete={handleEnvelopeComplete}
          isArabic={isRTL}
          language={currentLang}
          onToggleLanguage={() =>
            setCurrentLang(currentLang === 'en' ? 'hi' : 'en')
          }
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={toggleAudio}
        />
      )}

      {/* ========================================================
          FLOATING CONTROLS (Top-Right Sound, Bottom-Left Language)
          Clean, minimal floating pills. NO header strip, NO footer strip!
          ======================================================== */}
      {/* Audio Mute/Unmute Button (Top Right) */}
      {customization.showMusicButton !== false && (
        <button
          onClick={toggleAudio}
          className="fixed top-4 right-4 z-40 w-10 h-10 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md border border-[#B59A57]/60 shadow-[0_4px_15px_rgba(0,0,0,0.18)] flex items-center justify-center text-[#273822] hover:bg-[#FAF8F5] active:scale-95 transition-all cursor-pointer"
          title={isAudioPlaying ? 'Mute Music' : 'Play Music'}
        >
          {isAudioPlaying ? (
            <Volume2 className="w-5 h-5 text-[#B59A57] animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5 text-[#6B5A3E]" />
          )}
        </button>
      )}

      {/* 4-Language Switcher (Bottom Left) */}
      {customization.showLanguageSwitcher !== false && (
        <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-1">
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
                    className={`px-3.5 py-1.5 rounded-xl text-sm font-['Cinzel',serif] tracking-wider text-left transition-all ${
                      currentLang === lng
                        ? 'bg-[#273822] text-[#FAF8F5] font-bold shadow-sm'
                        : 'text-[#273822] hover:bg-[#DFC07C]/25'
                    }`}
                    style={deepTextShadow}
                  >
                    {TRANSLATIONS[lng].langName}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md border border-[#B59A57]/50 shadow-md text-xs sm:text-sm font-['Cinzel',serif] tracking-wider uppercase text-[#273822] hover:bg-[#FAF8F5] active:scale-95 transition-all cursor-pointer font-bold"
            style={deepTextShadow}
          >
            <Globe className="w-4 h-4 text-[#B59A57]" />
            <span>{t.langName}</span>
          </button>
        </div>
      )}

      {/* ========================================================
          SCROLLABLE CONTENT BODY (CARDLESS, FLOATING DIRECTLY OVER VIDEO)
          Placement is optimized so the couple's poses in the center
          are 100% visible throughout scrolling!
          ======================================================== */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none pb-6 bg-transparent overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="w-full max-w-lg mx-auto px-4 sm:px-6">
          {/* ========================================================
              SECTION 1: HERO (Dynamic Couple Names 3D Pop Out)
              ======================================================== */}
          {customization.sections.hero.enabled !== false && (
            <section className="relative min-h-[92vh] flex flex-col items-center justify-between pt-6 sm:pt-8 pb-8 px-4 sm:px-6 text-center z-10">
              {/* Top Announcement */}
              <motion.div
                initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="space-y-1"
              >
                <div className="flex items-center justify-center gap-2 opacity-90">
                  <div className="w-10 h-[1.5px] bg-[#B59A57]" />
                  <Sparkles className="w-3.5 h-3.5 text-[#B59A57] animate-pulse" />
                  <div className="w-10 h-[1.5px] bg-[#B59A57]" />
                </div>

                <DynamicTextEffects
                  text={
                    currentLang === 'en' && customization.sections.hero.announcementText
                      ? customization.sections.hero.announcementText
                      : t.weAreGettingMarried
                  }
                  effect="typewriter"
                  speed={40}
                  showCursor={true}
                  className={`${fontHeading} text-sm sm:text-base text-[#273822]`}
                  style={deepTextShadow}
                />

                {customization.sections.hero.showGuestBadge !== false && guestName && guestName !== 'Special Guest' && (
                  <div className="pt-1">
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#B59A57]/50 ${fontSubHeading} text-xs sm:text-sm text-[#785B24] font-bold`}
                      style={deepTextShadow}
                    >
                      {t.cordiallyInviting}: {localizedGuestName}
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
                className="my-auto py-2 w-full flex flex-col items-center"
              >
                <Royal3DNames
                  groomName={effectiveGroomName}
                  brideName={effectiveBrideName}
                  ampersand={customization.sections.hero.ampersandStyle || '&'}
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
                      text={
                        currentLang === 'en' && customization.sections.hero.groomParentage
                          ? customization.sections.hero.groomParentage
                          : t.groomParentage
                      }
                      effect="shimmer-wave"
                      delay={120}
                      className="font-bold leading-tight text-sm sm:text-base"
                      style={deepTextShadow}
                    />
                    <DynamicTextEffects
                      text={
                        currentLang === 'en' && customization.sections.hero.groomTitle
                          ? customization.sections.hero.groomTitle
                          : t.groomTitle
                      }
                      effect="shimmer-wave"
                      delay={200}
                      className="italic text-[#785B24] text-xs sm:text-sm font-bold"
                      style={deepTextShadow}
                    />
                  </div>
                  <div className="w-[1.5px] h-6 bg-[#B59A57]/70" />
                  <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                    <DynamicTextEffects
                      text={
                        currentLang === 'en' && customization.sections.hero.brideParentage
                          ? customization.sections.hero.brideParentage
                          : t.brideParentage
                      }
                      effect="shimmer-wave"
                      delay={120}
                      className="font-bold leading-tight text-sm sm:text-base"
                      style={deepTextShadow}
                    />
                    <DynamicTextEffects
                      text={
                        currentLang === 'en' && customization.sections.hero.brideTitle
                          ? customization.sections.hero.brideTitle
                          : t.brideTitle
                      }
                      effect="shimmer-wave"
                      delay={200}
                      className="italic text-[#785B24] text-xs sm:text-sm font-bold"
                      style={deepTextShadow}
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.9 }}
                viewport={{ once: false }}
                className="relative z-10 flex flex-col items-center gap-1 animate-bounce pb-2"
              >
                <DynamicTextEffects
                  text={
                    currentLang === 'en' && customization.sections.hero.scrollPromptText
                      ? customization.sections.hero.scrollPromptText
                      : t.scrollDown
                  }
                  effect="typewriter"
                  speed={50}
                  className={`${fontSubHeading} text-xs sm:text-sm text-[#273822] font-bold`}
                  style={deepTextShadow}
                />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
              </motion.div>
            </section>
          )}

          {/* ========================================================
              SECTION 2: SCRATCH TO REVEAL (Interactive 3D Glitter Heart)
              ======================================================== */}
          {customization.sections.scratchCard.enabled !== false && (
            <section className="relative z-10 py-16 px-6 min-h-[85vh] flex flex-col justify-center items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.72, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex flex-col items-center"
                style={{
                  filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.2))',
                }}
              >
                <ZareqiaHeartScratch
                  coupleNames={`${effectiveGroomName} & ${effectiveBrideName}`}
                  weddingDate={
                    currentLang === 'en' && customization.sections.scratchCard.secretDateText
                      ? customization.sections.scratchCard.secretDateText
                      : getFormattedWeddingDate(effectiveWeddingDate, currentLang)
                  }
                  weddingDay={
                    currentLang === 'en' && customization.sections.scratchCard.secretDayText
                      ? customization.sections.scratchCard.secretDayText
                      : getFormattedWeddingDay(effectiveWeddingDate, currentLang)
                  }
                  weddingTime={
                    currentLang === 'en' && customization.sections.scratchCard.secretTimeText
                      ? customization.sections.scratchCard.secretTimeText
                      : getFormattedWeddingTime(effectiveWeddingDate, currentLang)
                  }
                  language={currentLang}
                />
              </motion.div>
            </section>
          )}

          {/* ========================================================
              SECTION 3: PHOTO CAROUSEL & LIVE COUNTDOWN
              ======================================================== */}
          {(customization.sections.countdown.enabled !== false ||
            customization.sections.photoCarousel.enabled !== false) && (
            <section className="relative z-10 py-16 px-6 min-h-[85vh] flex flex-col justify-center items-center">
              <motion.div
                initial={{ opacity: 0, x: -60, rotateY: 12 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="w-full max-w-[360px]"
              >
                {/* Photo Carousel floating directly */}
                {customization.sections.photoCarousel.enabled !== false && (
                  <div className="rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.25)] border-2 border-white/70">
                    <ZareqiaPhotoCarousel />
                  </div>
                )}

                {/* Countdown Title with 3D Drop Impact */}
                {customization.sections.countdown.enabled !== false && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.3 }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      className="mt-8 text-center"
                    >
                      <DynamicTextEffects
                        text={
                          currentLang === 'en' && customization.sections.countdown.customTitle
                            ? customization.sections.countdown.customTitle
                            : t.countdownTitle
                        }
                        effect="pop-3d"
                        as="h3"
                        className={`${fontScriptHeading} text-4xl sm:text-5xl text-[#1E2E1B]`}
                        style={deepTextShadow}
                      />
                      <div className="flex items-center justify-center gap-2 mt-1.5 opacity-90">
                        <div className="w-8 h-[1.5px] bg-[#B59A57]" />
                        <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                        <div className="w-8 h-[1.5px] bg-[#B59A57]" />
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
                        { label: t.days, value: timeLeft.days, show: customization.sections.countdown.showDays !== false },
                        { label: t.hours, value: timeLeft.hours, show: customization.sections.countdown.showHours !== false },
                        { label: t.minutes, value: timeLeft.minutes, show: customization.sections.countdown.showMinutes !== false },
                        { label: t.seconds, value: timeLeft.seconds, show: customization.sections.countdown.showSeconds !== false },
                      ]
                        .filter((item) => item.show)
                        .map((item, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/90 backdrop-blur-[3px] border border-[#DFC07C] shadow-md"
                          >
                            <span
                              className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-black text-[#273822]"
                              style={deepTextShadow}
                            >
                              {toLocalizedDigits(String(item.value).padStart(2, '0'), currentLang)}
                            </span>
                            <DynamicTextEffects
                              text={item.label}
                              effect="pop-3d"
                              as="span"
                              className={`text-xs sm:text-sm ${fontSubHeading} text-[#6B5A3E] font-bold mt-0.5`}
                              style={deepTextShadow}
                            />
                          </div>
                        ))}
                    </motion.div>
                  </>
                )}
              </motion.div>
            </section>
          )}

          {/* ========================================================
              SECTION 4: CEREMONY ITINERARY (TIMELINE)
              Floating directly over video, zero card box, couple visible!
              ======================================================== */}
          {customization.sections.timeline.enabled !== false && (
            <section className="relative z-10 py-16 px-6 min-h-[85vh] flex flex-col justify-center items-center">
              <motion.div
                initial={{ opacity: 0, y: 50, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                className="w-full max-w-[340px] text-center"
              >
                <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-[#B59A57]/60 flex items-center justify-center text-[#B59A57] bg-white/90 shadow-md">
                  <Clock className="w-5 h-5" />
                </div>

                <DynamicTextEffects
                  text={
                    currentLang === 'en' && customization.sections.timeline.customTitle
                      ? customization.sections.timeline.customTitle
                      : t.timelineTitle
                  }
                  effect="scepter-slide"
                  as="h3"
                  className={`${fontScriptHeading} text-4xl sm:text-5xl text-[#1E2E1B]`}
                  style={deepTextShadow}
                />
                <div className="flex items-center justify-center gap-2 mt-1.5 mb-8 opacity-90">
                  <div className="w-8 h-[1.5px] bg-[#B59A57]" />
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                  <div className="w-8 h-[1.5px] bg-[#B59A57]" />
                </div>

                {/* Ceremonies Timeline */}
                <div
                  className={`relative pl-6 space-y-7 text-left max-w-[320px] mx-auto border-l-2 border-[#DFC07C] ${
                    isRTL ? 'text-right border-l-0 border-r-2 pr-6 pl-0' : ''
                  }`}
                >
                  {effectiveEvents.map((item, index) => (
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
                      <DynamicTextEffects
                        text={item.title}
                        effect="scepter-slide"
                        as="h4"
                        className={`${
                          isHindi
                            ? 'font-devanagari-heading'
                            : isNastaliq
                            ? 'font-nastaliq'
                            : "font-['Playfair_Display',serif]"
                        } text-lg sm:text-xl font-black text-[#1E2E1B]`}
                        style={deepTextShadow}
                      />
                      <DynamicTextEffects
                        text={item.time}
                        effect="scepter-slide"
                        as="p"
                        className={`${fontSubHeading} text-xs sm:text-sm text-[#785B24] font-bold mt-1`}
                        style={deepTextShadow}
                      />
                      <DynamicTextEffects
                        text={item.desc}
                        effect="scepter-slide"
                        as="p"
                        className={`${fontBody} text-sm sm:text-base italic text-[#2C3827] mt-1 font-bold leading-relaxed`}
                        style={deepTextShadow}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>
          )}

          {/* ========================================================
              SECTION 5: VENUE & DRESS CODE
              Floating directly over video, zero card box, couple visible!
              ======================================================== */}
          {customization.sections.venue.enabled !== false && (
            <section className="relative z-10 py-16 px-6 min-h-[85vh] flex flex-col justify-center items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                className="w-full max-w-[340px] text-center"
              >
                <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-[#B59A57]/60 flex items-center justify-center text-[#B59A57] bg-white/90 shadow-md">
                  <Building2 className="w-5 h-5" />
                </div>

                <DynamicTextEffects
                  text={
                    currentLang === 'en' && customization.sections.venue.venueTitle
                      ? customization.sections.venue.venueTitle
                      : t.venueTitle
                  }
                  effect="dome-rise"
                  as="h3"
                  className={`${fontScriptHeading} text-4xl sm:text-5xl text-[#1E2E1B]`}
                  style={deepTextShadow}
                />
                <div className="flex items-center justify-center gap-2 mt-1.5 mb-4 opacity-90">
                  <div className="w-8 h-[1.5px] bg-[#B59A57]" />
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                  <div className="w-8 h-[1.5px] bg-[#B59A57]" />
                </div>

                <DynamicTextEffects
                  text={effectiveVenueName}
                  effect="dome-rise"
                  as="h4"
                  className={`${
                    isHindi
                      ? 'font-devanagari-heading'
                      : isNastaliq
                      ? 'font-nastaliq'
                      : "font-['Playfair_Display',serif]"
                  } text-xl sm:text-2xl font-black text-[#1E2E1B]`}
                  style={deepTextShadow}
                />
                <DynamicTextEffects
                  text={effectiveVenueCity}
                  effect="dome-rise"
                  as="p"
                  className={`${fontSubHeading} text-sm sm:text-base text-[#6B5A3E] font-bold mt-1.5`}
                  style={deepTextShadow}
                />

                {/* Floating Venue Pin & Google Maps Action */}
                {customization.sections.venue.showMapButton !== false && (
                  <div className="mt-5 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#273822]/90 backdrop-blur-md text-[#E6D197] flex items-center justify-center shadow-lg border-2 border-[#DFC07C] mb-3">
                      <MapPin className="w-6 h-6 animate-pulse" />
                    </div>
                    <a
                      href={customization.sections.venue.googleMapsLink || effectiveMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#273822]/90 backdrop-blur-md text-[#FAF8F5] text-sm ${fontSubHeading} shadow-md hover:bg-[#1D2B19] active:scale-95 transition-all border border-[#B59A57]/50 cursor-pointer font-bold`}
                      style={deepTextShadow}
                    >
                      <Navigation className="w-4 h-4 text-[#E6D197]" />
                      <span>
                        {currentLang === 'en' && customization.sections.venue.mapButtonText
                          ? customization.sections.venue.mapButtonText
                          : t.viewMap}
                      </span>
                    </a>
                  </div>
                )}

                {/* Dress Code Floating Badge */}
                {customization.sections.venue.showDressCode !== false && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-6 pt-4 border-t border-[#DFC07C]/50"
                  >
                    <div className="w-9 h-9 mx-auto mb-1.5 rounded-full border border-[#B59A57]/50 flex items-center justify-center text-[#B59A57] bg-white/90 shadow-sm">
                      <Shirt className="w-4 h-4" />
                    </div>
                    <DynamicTextEffects
                      text={
                        currentLang === 'en' && customization.sections.venue.dressCodeTitle
                          ? customization.sections.venue.dressCodeTitle
                          : t.dressCodeTitle
                      }
                      effect="dome-rise"
                      as="h4"
                      className={`${fontScriptHeading} text-3xl sm:text-4xl text-[#1E2E1B]`}
                      style={deepTextShadow}
                    />
                    <DynamicTextEffects
                      text={
                        currentLang === 'en' && customization.sections.venue.dressCodeValue
                          ? customization.sections.venue.dressCodeValue
                          : t.dressCodeValue
                      }
                      effect="dome-rise"
                      as="p"
                      className={`${
                        isHindi
                          ? 'font-devanagari-heading'
                          : isNastaliq
                          ? 'font-nastaliq'
                          : "font-['Playfair_Display',serif]"
                      } text-base sm:text-lg font-black text-[#273822] mt-1`}
                      style={deepTextShadow}
                    />
                    <DynamicTextEffects
                      text={
                        currentLang === 'en' && customization.sections.venue.dressCodeDesc
                          ? customization.sections.venue.dressCodeDesc
                          : t.dressCodeDesc
                      }
                      effect="dome-rise"
                      as="p"
                      className={`${fontBody} text-sm sm:text-base italic text-[#3A4A33] mt-1 font-bold leading-relaxed`}
                      style={deepTextShadow}
                    />
                  </motion.div>
                )}
              </motion.div>
            </section>
          )}

          {/* ========================================================
              SECTION 6: RSVP FORM
              Floating cleanly over video, zero card frame, couple visible!
              ======================================================== */}
          {customization.sections.rsvp.enabled !== false && (
            <section className="relative z-10 py-16 px-6 min-h-[85vh] flex flex-col justify-center items-center">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                className="w-full max-w-[340px] text-center"
              >
                <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-[#B59A57]/60 flex items-center justify-center text-[#B59A57] bg-white/90 shadow-md">
                  <Mail className="w-5 h-5" />
                </div>

                <DynamicTextEffects
                  text={
                    currentLang === 'en' && customization.sections.rsvp.customTitle
                      ? customization.sections.rsvp.customTitle
                      : t.rsvpTitle
                  }
                  effect="velvet-mist"
                  as="h3"
                  className={`${fontHeading} text-3xl sm:text-4xl text-[#1E2E1B]`}
                  style={deepTextShadow}
                />
                <div className="flex items-center justify-center gap-2 mt-1.5 mb-3 opacity-90">
                  <div className="w-8 h-[1.5px] bg-[#B59A57]" />
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#B59A57]" />
                  <div className="w-8 h-[1.5px] bg-[#B59A57]" />
                </div>

                <DynamicTextEffects
                  text={
                    currentLang === 'en' && customization.sections.rsvp.introText
                      ? customization.sections.rsvp.introText
                      : t.rsvpIntro
                  }
                  effect="velvet-mist"
                  as="p"
                  className={`${fontBody} text-sm sm:text-base italic text-[#273822] max-w-[320px] mx-auto mb-6 font-bold leading-relaxed`}
                  style={deepTextShadow}
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
                    <h4
                      className="font-['Playfair_Display',serif] text-xl sm:text-2xl font-black text-[#1E2E1B]"
                      style={deepTextShadow}
                    >
                      {currentLang === 'en' && customization.sections.rsvp.successTitle
                        ? customization.sections.rsvp.successTitle
                        : t.rsvpSuccessTitle}
                    </h4>
                    <p
                      className="font-['Cormorant_Garamond',serif] text-sm sm:text-base italic text-[#3A4A33] mt-1 max-w-[280px] font-bold"
                      style={deepTextShadow}
                    >
                      {currentLang === 'en' && customization.sections.rsvp.successDesc
                        ? customization.sections.rsvp.successDesc
                        : t.rsvpSuccessDesc}
                    </p>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handleRsvpSubmit}
                    className={`space-y-3.5 text-left max-w-[320px] mx-auto ${
                      isRTL ? 'text-right' : ''
                    }`}
                  >
                    <div>
                      <label
                        className={`block text-xs sm:text-sm ${fontSubHeading} text-[#273822] mb-1 font-bold`}
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
                        className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-[#DFC07C] text-sm font-['Cormorant_Garamond',serif] text-[#1E2E1B] font-bold placeholder-[#788874] focus:outline-none focus:ring-2 focus:ring-[#273822] shadow-sm"
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-xs sm:text-sm ${fontSubHeading} text-[#273822] mb-1 font-bold`}
                        style={deepTextShadow}
                      >
                        {t.labelEmail}
                      </label>
                      <input
                        type="email"
                        required
                        value={rsvpEmail}
                        onChange={(e) => setRsvpEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-[#DFC07C] text-sm font-['Cormorant_Garamond',serif] text-[#1E2E1B] font-bold placeholder-[#788874] focus:outline-none focus:ring-2 focus:ring-[#273822] shadow-sm"
                      />
                    </div>

                    {/* 2-Column: Attendance & Guests */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label
                          className={`block text-xs sm:text-sm ${fontSubHeading} text-[#273822] mb-1 truncate font-bold`}
                          style={deepTextShadow}
                        >
                          {t.labelAttend}
                        </label>
                        <select
                          required
                          value={rsvpAttending}
                          onChange={(e) => setRsvpAttending(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/90 border border-[#DFC07C] text-sm font-['Cormorant_Garamond',serif] text-[#1E2E1B] font-bold focus:outline-none focus:ring-2 focus:ring-[#273822] shadow-sm"
                        >
                          <option value="">{t.optionSelect}</option>
                          <option value="yes">{t.optionYes}</option>
                          <option value="no">{t.optionNo}</option>
                        </select>
                      </div>

                      <div>
                        <label
                          className={`block text-xs sm:text-sm ${fontSubHeading} text-[#273822] mb-1 truncate font-bold`}
                          style={deepTextShadow}
                        >
                          {t.labelGuests}
                        </label>
                        <select
                          value={rsvpGuests}
                          onChange={(e) => setRsvpGuests(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/90 border border-[#DFC07C] text-sm font-['Cormorant_Garamond',serif] text-[#1E2E1B] font-bold focus:outline-none focus:ring-2 focus:ring-[#273822] shadow-sm"
                        >
                          {Array.from({ length: customization.sections.rsvp.maxGuests || 4 }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={String(num)}>
                              {toLocalizedDigits(num, currentLang)}{num === (customization.sections.rsvp.maxGuests || 4) ? '+' : ''} {t.guestUnit}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-xs sm:text-sm ${fontSubHeading} text-[#273822] mb-1 font-bold`}
                        style={deepTextShadow}
                      >
                        {t.labelMessage}
                      </label>
                      <textarea
                        rows={2}
                        value={rsvpMessage}
                        onChange={(e) => setRsvpMessage(e.target.value)}
                        placeholder={t.placeholderMessage}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-[#DFC07C] text-sm font-['Cormorant_Garamond',serif] text-[#1E2E1B] font-bold placeholder-[#788874] focus:outline-none focus:ring-2 focus:ring-[#273822] shadow-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={rsvpLoading}
                      className={`w-full py-3.5 rounded-full bg-[#273822] text-[#FAF8F5] text-sm sm:text-base ${fontSubHeading} shadow-lg hover:bg-[#1D2B19] active:scale-95 transition-all border border-[#B59A57]/50 flex items-center justify-center gap-2 mt-2 cursor-pointer font-bold`}
                      style={deepTextShadow}
                    >
                      {rsvpLoading ? (
                        <span className="animate-pulse">{t.sending}</span>
                      ) : (
                        <>
                          <PartyPopper className="w-4 h-4 text-[#E6D197]" />
                          <span className="font-bold">
                            {currentLang === 'en' && customization.sections.rsvp.submitButtonText
                              ? customization.sections.rsvp.submitButtonText
                              : t.submitBtn}
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </section>
          )}

          {/* Footer Blessing (Zero Black Strip, Pure Floating Signature) */}
          {customization.sections.footerBlessing.enabled !== false && (
            <div className="relative z-10 text-center py-6 px-4">
              <DynamicTextEffects
                text={
                  currentLang === 'en' && customization.sections.footerBlessing.blessingText
                    ? `${customization.sections.footerBlessing.blessingText}: ${
                        customization.sections.footerBlessing.coupleSignature || `${effectiveGroomName} & ${effectiveBrideName}`
                      }`
                    : `${t.footerBlessing}: ${effectiveGroomName} & ${effectiveBrideName}`
                }
                effect="velvet-mist"
                as="p"
                className={`${fontScriptHeading} text-3xl sm:text-4xl text-[#1E2E1B]`}
                style={deepTextShadow}
              />
              <div className="flex items-center justify-center gap-1.5 mt-2 text-[#7C9172]">
                <span className="text-sm">♥</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
