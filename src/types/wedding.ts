export interface EventScheduleItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  dressCode: string;
  dressCodeDetails: string;
  dressCodeColors: string[];
  googleMapsLink: string;
}

export interface MenuItem {
  id: string;
  course: 'Welcome Elixirs & Canapés' | 'Appetizers' | 'Grand Royal Feast' | 'Dessert Haven' | 'Midnight Bites';
  dishName: string;
  description: string;
  dietaryType: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Jain';
  isChefSpecial?: boolean;
}

export interface StoryMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GuestContact {
  id: string;
  name: string;
  phone: string;
  sentWhatsApp: boolean;
  sentAt?: string;
  rsvpStatus: 'pending' | 'attending' | 'declined';
  attendingCount: number;
  dietaryChoice?: string;
}

export interface SongRequest {
  id: string;
  songTitle: string;
  artist: string;
  requestedByGuest: string;
  guestPhone: string;
  timestamp: string;
  notes?: string;
}

export interface VoiceBlessing {
  id: string;
  guestName: string;
  audioBlobUrl: string; // or Firebase Storage URL
  durationSec: number;
  timestamp: string;
}

export type TypographyFontFamily =
  | 'Cinzel'
  | 'Playfair Display'
  | 'Cormorant Garamond'
  | 'Alex Brush'
  | 'Pinyon Script'
  | 'Rozha One'
  | 'Yatra One'
  | 'Noto Nastaliq Urdu'
  | 'System Default';

export type TypographyFontSize = 'small' | 'normal' | 'large' | 'extra-large' | 'royal-huge';
export type TypographyFontStyle = 'normal' | 'italic';
export type TypographyFontWeight = 'normal' | 'medium' | 'bold' | 'black';

export interface SectionStyleConfig {
  enabled: boolean;
  order: number;
  fontFamily?: TypographyFontFamily;
  fontSize?: TypographyFontSize;
  fontStyle?: TypographyFontStyle;
  fontWeight?: TypographyFontWeight;
  customTitle?: string;
  customSubtitle?: string;
}

export interface EnvelopeSectionConfig extends SectionStyleConfig {
  sealText?: string;
  tapToOpenText?: string;
  sealColor?: string;
}

export interface HeroSectionConfig extends SectionStyleConfig {
  announcementText?: string;
  showGuestBadge?: boolean;
  groomParentage?: string;
  groomTitle?: string;
  brideParentage?: string;
  brideTitle?: string;
  scrollPromptText?: string;
  ampersandStyle?: '&' | 'Weds' | 'Sang' | 'Aur';
}

export interface ScratchCardSectionConfig extends SectionStyleConfig {
  blessingIntro?: string;
  revealedInvitation?: string;
  secretDateText?: string;
  secretDayText?: string;
  secretTimeText?: string;
  saveTheDateButtonText?: string;
}

export interface CountdownSectionConfig extends SectionStyleConfig {
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
}

export interface PhotoCarouselSectionConfig extends SectionStyleConfig {
  photos?: string[];
  autoPlay?: boolean;
}

export interface TimelineSectionConfig extends SectionStyleConfig {
  showIcons?: boolean;
}

export interface VenueSectionConfig extends SectionStyleConfig {
  venueTitle?: string;
  venueName?: string;
  venueCity?: string;
  venueAddress?: string;
  googleMapsLink?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  showMapButton?: boolean;
  mapButtonText?: string;
  showDressCode?: boolean;
  dressCodeTitle?: string;
  dressCodeValue?: string;
  dressCodeDesc?: string;
}

export interface DjSongSectionConfig extends SectionStyleConfig {
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
}

export interface VoiceBlessingSectionConfig extends SectionStyleConfig {
  title?: string;
  subtitle?: string;
  recordPromptText?: string;
}

export interface RsvpSectionConfig extends SectionStyleConfig {
  introText?: string;
  maxGuests?: number;
  successTitle?: string;
  successDesc?: string;
  submitButtonText?: string;
}

export interface FooterBlessingSectionConfig extends SectionStyleConfig {
  blessingText?: string;
  coupleSignature?: string;
}

export interface ProjectCustomization {
  // Global music settings
  musicTrackUrl?: string;
  musicTrackTitle?: string;
  musicAutoPlay?: boolean;
  sitarSynthEnabled?: boolean;

  // Global language settings
  defaultLanguage?: 'en' | 'hi' | 'ur' | 'hinglish';
  showLanguageSwitcher?: boolean;
  showMusicButton?: boolean;

  // Global Typography Defaults
  typography?: {
    headingFont?: TypographyFontFamily;
    subHeadingFont?: TypographyFontFamily;
    bodyFont?: TypographyFontFamily;
    scriptFont?: TypographyFontFamily;
    sizeScale?: TypographyFontSize;
  };

  // Sections
  sections: {
    envelope: EnvelopeSectionConfig;
    hero: HeroSectionConfig;
    scratchCard: ScratchCardSectionConfig;
    countdown: CountdownSectionConfig;
    photoCarousel: PhotoCarouselSectionConfig;
    timeline: TimelineSectionConfig;
    venue: VenueSectionConfig;
    djSongs?: DjSongSectionConfig;
    voiceBlessings?: VoiceBlessingSectionConfig;
    rsvp: RsvpSectionConfig;
    footerBlessing: FooterBlessingSectionConfig;
  };
}

export interface WeddingProject {
  id: string;
  slug: string;
  partner1: string;
  partner2: string;
  formalTitle: string;
  weddingDate: string; // ISO string e.g. 2027-11-20T18:00:00Z
  venue: {
    name: string;
    city: string;
    fullAddress: string;
    googleMapsLink: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  coverImageUrl: string;
  backgroundAudioUrl: string;
  media?: {
    coverPhoto?: string;
    backgroundMusic?: string;
    photos?: string[];
  };
  status: 'active' | 'draft' | 'archived';
  clientAccessToken: string;
  createdAt: string;
  suite?: string;
  template?: string;

  // Customization Hub (Custom texts, typography, section toggles, reordering, music)
  customization?: ProjectCustomization;

  // Modules
  events: EventScheduleItem[];
  menu: MenuItem[];
  story: StoryMilestone[];
  trivia: TriviaQuestion[];
  guests: GuestContact[];
  djPlaylist: SongRequest[];
  blessings: VoiceBlessing[];
}
