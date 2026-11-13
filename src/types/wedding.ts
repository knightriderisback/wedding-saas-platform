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
  };
  coverImageUrl: string;
  backgroundAudioUrl: string;
  status: 'active' | 'draft' | 'archived';
  clientAccessToken: string;
  createdAt: string;
  suite?: string;
  template?: string;

  // Modules
  events: EventScheduleItem[];
  menu: MenuItem[];
  story: StoryMilestone[];
  trivia: TriviaQuestion[];
  guests: GuestContact[];
  djPlaylist: SongRequest[];
  blessings: VoiceBlessing[];
}
