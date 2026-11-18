import { ProjectCustomization, TypographyFontFamily, TypographyFontSize, WeddingProject } from '@/types/wedding';

export const MUSIC_PRESETS = [
  {
    id: 'royal-heritage',
    name: 'Royal Heritage Shehnai & Nagada',
    url: '/audio/royal-heritage-music.mp3',
    description: 'Authentic royal palace entrance symphony',
    icon: 'Crown',
  },
  {
    id: 'sitar-ambient',
    name: 'Darbar Raag Darbari (Sitar & Tanpura)',
    url: '', // Synthesized live web audio sitar
    description: 'Meditative royal sitar with real acoustic resonance',
    icon: 'Music',
  },
  {
    id: 'shehnai-dholak',
    name: 'Udaivilas Shehnai & Festive Dholak',
    url: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
    description: 'Festive traditional celebration rhythms',
    icon: 'Sparkles',
  },
  {
    id: 'flute-lake',
    name: 'Pichola Sunset Flute & Santoor',
    url: 'https://cdn.freesound.org/previews/387/387232_1474204-lq.mp3',
    description: 'Gentle romantic lakeside instrumental',
    icon: 'Heart',
  },
];

export const FONT_FAMILY_OPTIONS: { id: TypographyFontFamily; label: string; sample: string; category: string }[] = [
  { id: 'Cinzel', label: 'Royal Cinzel (Majestic Roman)', sample: 'SHUBH VIVAH', category: 'Royal Serif' },
  { id: 'Playfair Display', label: 'Playfair Display (Luxury Editorial)', sample: 'Royal Wedding Celebration', category: 'Royal Serif' },
  { id: 'Rozha One', label: 'Rozha One (Devanagari Royal Bold)', sample: 'गौरव संग प्रिया', category: 'Devanagari' },
  { id: 'Yatra One', label: 'Yatra One (Heritage Devanagari)', sample: 'शुभ विवाह निमंत्रण', category: 'Devanagari' },
  { id: 'Alex Brush', label: 'Alex Brush (Classic Script)', sample: 'Together with their families', category: 'Calligraphy' },
  { id: 'Pinyon Script', label: 'Pinyon Script (Vintage Flourish)', sample: 'Request the honour of your presence', category: 'Calligraphy' },
  { id: 'Cormorant Garamond', label: 'Cormorant Garamond (Poetic Body)', sample: 'Beneath the starry Udaipur sky', category: 'Editorial' },
  { id: 'Noto Nastaliq Urdu', label: 'Noto Nastaliq Urdu (Royal Nastaliq)', sample: 'دعوتِ ولیمہ و نکاح', category: 'Urdu Script' },
  { id: 'System Default', label: 'System Clean Serif', sample: 'Grand Palace Banquet', category: 'Modern' },
];

export const getDefaultCustomization = (project?: Partial<WeddingProject>): ProjectCustomization => {
  const p1 = project?.partner1 || 'Gourav';
  const p2 = project?.partner2 || 'Priya';
  const venueName = project?.venue?.name || 'The Royal Palace & Gardens';
  const venueCity = project?.venue?.city || 'Palace Destination';
  const mapsLink = project?.venue?.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueName + ' ' + venueCity)}`;

  const rawDate = project?.weddingDate || '2026-12-12T12:00:00.000Z';
  let formattedDate = 'Saturday, December 12, 2026';
  try {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      formattedDate = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }
  } catch {}

  return {
    musicTrackUrl: project?.backgroundAudioUrl || '/audio/royal-heritage-music.mp3',
    musicTrackTitle: 'Royal Heritage Shehnai & Nagada',
    musicAutoPlay: true,
    sitarSynthEnabled: true,
    defaultLanguage: 'en',
    showLanguageSwitcher: true,
    showMusicButton: true,

    typography: {
      headingFont: 'Rozha One',
      subHeadingFont: 'Cinzel',
      bodyFont: 'Cormorant Garamond',
      scriptFont: 'Alex Brush',
      sizeScale: 'large',
    },

    sections: {
      envelope: {
        enabled: true,
        order: 1,
        fontFamily: 'Cinzel',
        fontSize: 'normal',
        fontStyle: 'normal',
        fontWeight: 'bold',
        sealText: `${p1.charAt(0)} & ${p2.charAt(0)}`,
        tapToOpenText: 'Tap Anywhere to Open',
        sealColor: '#B59A57',
      },

      hero: {
        enabled: true,
        order: 2,
        fontFamily: 'Rozha One',
        fontSize: 'royal-huge',
        fontStyle: 'normal',
        fontWeight: 'bold',
        announcementText: 'WE ARE GETTING MARRIED',
        showGuestBadge: true,
        groomParentage: 'S/O SMT. SUNITA & SHRI RAJESH MEHRA',
        groomTitle: 'ROYAL HEIR OF MEHRA HERITAGE',
        brideParentage: 'D/O SMT. REKHA & SHRI VIKRAM VERMA',
        brideTitle: 'DAUGHTER OF VERMA DYNASTY',
        scrollPromptText: 'SCROLL TO EXPLORE CELEBRATION',
        ampersandStyle: '&',
      },

      scratchCard: {
        enabled: true,
        order: 3,
        fontFamily: 'Playfair Display',
        fontSize: 'large',
        fontStyle: 'normal',
        fontWeight: 'bold',
        blessingIntro: 'With the blessings of our revered ancestors & beloved families',
        revealedInvitation: "You're Invited!",
        secretDateText: formattedDate,
        secretDayText: 'Auspicious Muhurat Under Stars',
        secretTimeText: '5:30 PM IST Onwards',
        saveTheDateButtonText: 'SAVE THE DATE TO CALENDAR',
      },

      countdown: {
        enabled: true,
        order: 4,
        fontFamily: 'Cinzel',
        fontSize: 'large',
        fontStyle: 'normal',
        fontWeight: 'bold',
        customTitle: 'Counting Down To The Sacred Vows',
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
      },

      photoCarousel: {
        enabled: true,
        order: 5,
        fontFamily: 'Playfair Display',
        fontSize: 'normal',
        fontStyle: 'normal',
        fontWeight: 'medium',
        customTitle: 'Moments of Love & Heritage',
        photos: [
          '/images/carousel-1.jpg',
          '/images/carousel-2.jpg',
          '/images/carousel-3.jpg',
        ],
        autoPlay: true,
      },

      timeline: {
        enabled: true,
        order: 6,
        fontFamily: 'Rozha One',
        fontSize: 'large',
        fontStyle: 'normal',
        fontWeight: 'bold',
        customTitle: 'Sacred Ceremonies & Itinerary',
        customSubtitle: 'A 4-Day Celebration of Grandeur & Rituals',
        showIcons: true,
      },

      venue: {
        enabled: true,
        order: 7,
        fontFamily: 'Rozha One',
        fontSize: 'large',
        fontStyle: 'normal',
        fontWeight: 'bold',
        venueTitle: 'The Royal Destination',
        venueName: venueName,
        venueCity: venueCity,
        googleMapsLink: mapsLink,
        showMapButton: true,
        mapButtonText: 'View on Google Maps',
        showDressCode: true,
        dressCodeTitle: 'Royal Dress Code',
        dressCodeValue: 'Strict Royal Traditional',
        dressCodeDesc: 'Ivory, Champagne & Antique Gold Silks',
      },

      djSongs: {
        enabled: true,
        order: 8,
        fontFamily: 'Cinzel',
        fontSize: 'normal',
        fontStyle: 'normal',
        fontWeight: 'bold',
        title: 'Sangeet DJ Playlist Requests',
        subtitle: 'Dedicate your favorite track to the royal couple',
        submitButtonText: 'Request Song for Sangeet',
      },

      voiceBlessings: {
        enabled: true,
        order: 9,
        fontFamily: 'Cinzel',
        fontSize: 'normal',
        fontStyle: 'normal',
        fontWeight: 'bold',
        title: 'Vedic Spoken Vows & Voice Blessings',
        subtitle: 'Record a heartfelt 30-second audio blessing directly to the couple',
        recordPromptText: 'Tap to Record Voice Blessing',
      },

      rsvp: {
        enabled: true,
        order: 10,
        fontFamily: 'Cinzel',
        fontSize: 'large',
        fontStyle: 'normal',
        fontWeight: 'bold',
        customTitle: 'Kindly Grace Our Celebrations',
        introText: 'Your gracious presence is the greatest blessing for our sacred union.',
        maxGuests: 4,
        successTitle: 'RSVP Received With Joy',
        successDesc: 'We eagerly anticipate welcoming you with royal hospitality.',
        submitButtonText: 'Confirm Your Gracious Presence',
      },

      footerBlessing: {
        enabled: true,
        order: 11,
        fontFamily: 'Alex Brush',
        fontSize: 'large',
        fontStyle: 'normal',
        fontWeight: 'bold',
        blessingText: 'With Heartfelt Gratitude & Warm Blessings',
        coupleSignature: `${p1} & ${p2}`,
      },
    },
  };
};

export const getFontFamilyClass = (fontFamily?: TypographyFontFamily): string => {
  switch (fontFamily) {
    case 'Cinzel':
      return "font-['Cinzel',serif]";
    case 'Playfair Display':
      return "font-['Playfair_Display',serif]";
    case 'Rozha One':
      return "font-['Rozha_One',serif]";
    case 'Yatra One':
      return "font-['Yatra_One',serif]";
    case 'Alex Brush':
      return "font-['Alex_Brush',cursive]";
    case 'Pinyon Script':
      return "font-['Pinyon_Script',cursive]";
    case 'Cormorant Garamond':
      return "font-['Cormorant_Garamond',serif]";
    case 'Noto Nastaliq Urdu':
      return "font-['Noto_Nastaliq_Urdu',serif]";
    case 'System Default':
    default:
      return '';
  }
};

export const getFontSizeClass = (
  size?: TypographyFontSize,
  element: 'heading' | 'subheading' | 'body' = 'heading'
): string => {
  if (element === 'heading') {
    switch (size) {
      case 'small':
        return 'text-2xl sm:text-3xl';
      case 'normal':
        return 'text-3xl sm:text-4xl';
      case 'large':
        return 'text-4xl sm:text-5xl';
      case 'extra-large':
        return 'text-5xl sm:text-6xl';
      case 'royal-huge':
        return 'text-6xl sm:text-7xl md:text-8xl';
      default:
        return 'text-4xl sm:text-5xl';
    }
  }

  if (element === 'subheading') {
    switch (size) {
      case 'small':
        return 'text-xs sm:text-sm';
      case 'normal':
        return 'text-sm sm:text-base';
      case 'large':
        return 'text-base sm:text-lg';
      case 'extra-large':
      case 'royal-huge':
        return 'text-lg sm:text-xl';
      default:
        return 'text-sm sm:text-base';
    }
  }

  // body
  switch (size) {
    case 'small':
      return 'text-xs';
    case 'normal':
      return 'text-sm';
    case 'large':
      return 'text-sm sm:text-base';
    case 'extra-large':
    case 'royal-huge':
      return 'text-base sm:text-lg';
    default:
      return 'text-sm sm:text-base';
  }
};
