export interface PressedLoveTemplate {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  tagline: string;
  badge: string;
  couple: {
    partner1: string;
    partner2: string;
    formalTitle: string;
    initials: string;
  };
  ceremony: {
    date: string;
    time: string;
    displayDate: string;
    displayTime: string;
    timeZone: string;
  };
  theme: {
    name: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
      surface: string;
      border: string;
    };
    fonts: {
      display: string;
      script: string;
      body: string;
    };
  };
  location: {
    venueName: string;
    address: string;
    city: string;
    country: string;
    googleMapsUrl: string;
    description: string;
  };
  assets: {
    introVideo: string;
    introVideoPoster: string;
    backgroundMusic: string;
    heroVideo?: string;
    heroVideoPoster?: string;
    heroImage?: string;
    venueImage: string;
    rsvpConfirmation: string;
  };
  program: Array<{
    time: string;
    title: string;
    description: string;
    iconType: 'church' | 'wine' | 'utensils' | 'party' | 'sparkles' | 'ring' | 'camera';
  }>;
  accommodation: {
    title: string;
    description: string;
    hotels: Array<{
      name: string;
      tier: string;
      distance: string;
      bookingUrl?: string;
    }>;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  gifts: {
    message: string;
    bankName: string;
    accountHolder: string;
    iban: string;
    bicSwift: string;
  };
  envelope: {
    waxColor: string;
    waxMonogram: string;
    bgColor: string;
  };
}

export const PRESSED_LOVE_TEMPLATES: Record<string, PressedLoveTemplate> = {
  'the-venue': {
    id: 'the-venue',
    slug: 'wedding-invitation-the-venue',
    name: 'The Venue',
    subtitle: 'Castle & Vineyard Architecture Suite',
    tagline: 'Showcasing the place that holds the day with architectural hand-drawn artistry.',
    badge: 'Castle / Vineyard Venues',
    couple: {
      partner1: 'Charlotte',
      partner2: 'James',
      formalTitle: 'The Wedding Celebration of Charlotte & James',
      initials: 'C & J',
    },
    ceremony: {
      date: '2026-09-12',
      time: '17:00',
      displayDate: 'Saturday, September 12, 2026',
      displayTime: '5:00 PM CEST',
      timeZone: 'Europe/Madrid',
    },
    theme: {
      name: 'theme-mediterranean',
      colors: {
        primary: '#4a7c8e', // Mediterranean Sea Slate
        secondary: '#f5f0e8',
        accent: '#d4a574', // Terracotta Gold
        text: '#403030', // Warm Espresso
        background: '#FAF7F2',
        surface: '#FFFFFF',
        border: '#E8DFC8',
      },
      fonts: {
        display: 'font-cormorant',
        script: 'font-alex',
        body: 'font-lora',
      },
    },
    location: {
      venueName: 'Finca Biniagual',
      address: 'Camí de Biniagual, s/n, 07350 Binissalem',
      city: 'Binissalem, Mallorca',
      country: 'Spain',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Finca+Biniagual+Mallorca',
      description:
        'A historic 13th-century Mallorcan hamlet surrounded by ancient vineyards, citrus groves, and picturesque stone pathways overlooking the Tramuntana mountains.',
    },
    assets: {
      introVideo: 'https://pressedlove.com/demo-media/opening-2026-09/pressed-love-envelope-d2263e22.mp4',
      introVideoPoster: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-poster-ec17521e.webp',
      backgroundMusic: 'https://pressedlove.com/demo-media/shared/intro-music-S2szIoUv.mp3',
      heroVideo: 'https://pressedlove.com/demo-media/boda-mar-jaume/intro-video-BSNlV4m4.webm',
      heroVideoPoster: 'https://pressedlove.com/demo-media/opening-2026-09/the-venue-hero-poster-e5899d5d.webp',
      heroImage: 'https://pressedlove.com/demo-media/shared/finca-biniagual-tpK1hn9e.webp',
      venueImage: 'https://pressedlove.com/template-assets/the-venue/venue.webp',
      rsvpConfirmation: 'https://pressedlove.com/demo-media/shared/rsvp-confirmation-DYbKwzwP.webm',
    },
    program: [
      {
        time: '17:00',
        title: 'The Ceremony',
        description: 'Exchange of vows in the ancient olive courtyard',
        iconType: 'church',
      },
      {
        time: '18:00',
        title: 'Cocktail & Aperitivo',
        description: 'Mallorcan tapas, chilled cava, and live acoustic Spanish guitar',
        iconType: 'wine',
      },
      {
        time: '20:00',
        title: 'The Wedding Banquet',
        description: 'Mediterranean seated dinner under the starlit pergolas',
        iconType: 'utensils',
      },
      {
        time: '22:00',
        title: 'Party & Celebration',
        description: 'First dance and dancing until early morning',
        iconType: 'party',
      },
    ],
    accommodation: {
      title: 'Curated Island Stays',
      description: 'We have reserved preferred room blocks with shuttle pickups to Finca Biniagual:',
      hotels: [
        {
          name: 'Hotel Can Xim',
          tier: 'Historic Boutique Inn',
          distance: '7 mins from venue',
          bookingUrl: 'https://maps.google.com/?q=Hotel+Can+Xim+Mallorca',
        },
        {
          name: 'Hotel Son Brull Sanctuary & Spa',
          tier: 'Luxury 5-Star Relais & Châteaux',
          distance: '18 mins from venue',
          bookingUrl: 'https://maps.google.com/?q=Son+Brull+Hotel',
        },
        {
          name: 'Boutique Hotel Sant Francesc',
          tier: 'Palma Old Town Manor',
          distance: '25 mins (Shuttle Departure Point)',
          bookingUrl: 'https://maps.google.com/?q=Hotel+Sant+Francesc+Palma',
        },
        {
          name: 'Hotel Nivia Born',
          tier: 'Paseo del Born City Stay',
          distance: '25 mins from venue',
          bookingUrl: 'https://maps.google.com/?q=Nivia+Born+Boutique+Hotel',
        },
      ],
    },
    faqs: [
      {
        question: 'Can I bring a plus one?',
        answer:
          'Your invitation is personalized for the guests named on your card. If you have any questions about additional family members, please contact us directly.',
      },
      {
        question: 'What is the dress code?',
        answer:
          'Formal Summer Elegance. Gentlemen in tailored suits (linen welcomed) and ladies in elevated cocktail or full-length evening dresses. Stilettos are discouraged due to cobblestones.',
      },
      {
        question: 'Is there shuttle transportation?',
        answer:
          'Yes. Private air-conditioned coaches will depart from Central Palma (Plaça d’Espanya) at 16:00 and return guests back throughout the night at 00:00, 02:00, and 04:00.',
      },
      {
        question: 'What about dietary restrictions?',
        answer:
          'Our caterer specializes in gluten-free, vegan, vegetarian, and allergy-safe menus. Please specify in your RSVP below so individual arrangements are made.',
      },
    ],
    gifts: {
      message:
        'Your presence at our Mallorcan celebration is the greatest gift of all. For those who have asked about a registry, we have set up a honeymoon fund for our voyage across Japan.',
      bankName: 'Santander Private Banking Spain',
      accountHolder: 'Charlotte Evans & James Montgomery',
      iban: 'ES91 2100 0418 4502 0005 1332',
      bicSwift: 'BSCHESMMXXX',
    },
    envelope: {
      waxColor: '#4a7c8e',
      waxMonogram: 'C&J',
      bgColor: '#f5f0e8',
    },
  },

  'floral': {
    id: 'floral',
    slug: 'wedding-invitation-floral',
    name: 'Floral',
    subtitle: 'English Botanical Garden Suite',
    tagline: 'Delicate pressed wildflowers, archival typography, and romantic garden celebrations.',
    badge: 'Botanical & Garden Ceremonies',
    couple: {
      partner1: 'Sophie',
      partner2: 'Antoine',
      formalTitle: 'The Wedding Celebration of Sophie & Antoine',
      initials: 'S & A',
    },
    ceremony: {
      date: '2026-07-18',
      time: '18:00',
      displayDate: 'Saturday, July 18, 2026',
      displayTime: '6:00 PM BST',
      timeZone: 'Europe/London',
    },
    theme: {
      name: 'theme-floral',
      colors: {
        primary: '#d4a574', // Soft Ochre Gold
        secondary: '#f8f4f0',
        accent: '#8b9d83', // Botanical Sage
        text: '#4a3c2c', // Deep Chestnut
        background: '#FAF6F2',
        surface: '#FFFFFF',
        border: '#EADFD2',
      },
      fonts: {
        display: 'font-playfair',
        script: 'font-greatvibes',
        body: 'font-lato',
      },
    },
    location: {
      venueName: 'Chelsea Physic Garden',
      address: '66 Royal Hospital Rd, Chelsea',
      city: 'London, England',
      country: 'United Kingdom',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chelsea+Physic+Garden+London',
      description:
        "London's oldest botanical garden founded in 1673, featuring secret glasshouses, fragrant apothecary borders, and secluded lawns beside the Thames.",
    },
    assets: {
      introVideo: 'https://pressedlove.com/demo-media/opening-2026-09/pressed-love-envelope-d2263e22.mp4',
      introVideoPoster: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-poster-ec17521e.webp',
      backgroundMusic: 'https://pressedlove.com/demo-media/boda-maria-carlos/background-music-BF61jgoc.mp3',
      heroVideo: 'https://pressedlove.com/demo-media/opening-2026-09/floral-hero-b4da1221.mp4',
      heroVideoPoster: 'https://pressedlove.com/demo-media/opening-2026-09/floral-hero-poster-bc710e36.webp',
      heroImage: 'https://pressedlove.com/demo-media/boda-maria-carlos/intro-poster-DMgkemLz.jpg',
      venueImage: 'https://pressedlove.com/template-assets/floral/venue.webp',
      rsvpConfirmation: 'https://pressedlove.com/demo-media/shared/rsvp-confirmation-DYbKwzwP.webm',
    },
    program: [
      {
        time: '18:00',
        title: 'Botanical Ceremony',
        description: 'Exchange of vows amidst blooming garden borders',
        iconType: 'church',
      },
      {
        time: '19:00',
        title: 'Champagne & Hors d’Oeuvres',
        description: 'Pimm’s cup, sparkling Laurent-Perrier, and canapés on the lawn',
        iconType: 'wine',
      },
      {
        time: '20:30',
        title: 'Celebration Feast',
        description: 'Seasonal British summer banquet served under the glass marquee',
        iconType: 'utensils',
      },
      {
        time: '22:30',
        title: 'Music & Dancing',
        description: 'Live jazz sextet followed by DJ set',
        iconType: 'party',
      },
      {
        time: '01:00',
        title: 'Sweet Farewell',
        description: 'Sparkler send-off under London night skies',
        iconType: 'sparkles',
      },
    ],
    accommodation: {
      title: 'Chelsea Accommodations',
      description: 'Charming London hotels within walking distance of the Physic Garden:',
      hotels: [
        {
          name: 'The Cadogan, A Belmond Hotel',
          tier: '5-Star Luxury Heritage',
          distance: '10 mins walk',
          bookingUrl: 'https://maps.google.com/?q=The+Cadogan+London',
        },
        {
          name: 'Blakes Hotel South Kensington',
          tier: 'World First Luxury Boutique Hotel',
          distance: '12 mins walk',
          bookingUrl: 'https://maps.google.com/?q=Blakes+Hotel+London',
        },
        {
          name: 'The Sloane Square Hotel',
          tier: 'Classic Chelsea Landmark',
          distance: '8 mins walk',
          bookingUrl: 'https://maps.google.com/?q=Sloane+Square+Hotel+London',
        },
        {
          name: 'Artist Residence London',
          tier: 'Design-forward Pimlico Stay',
          distance: '15 mins walk',
          bookingUrl: 'https://maps.google.com/?q=Artist+Residence+London',
        },
      ],
    },
    faqs: [
      {
        question: 'What is the dress code?',
        answer:
          'Garden Party Black Tie or Colorful Formal. Florals, pastels, light linens, and whimsical hats/fascinators are warmly celebrated.',
      },
      {
        question: 'What happens if it rains?',
        answer:
          'The Physic Garden has an exquisite glasshouse and a fully covered heated clear-span pavilion, guaranteeing a magical evening rain or shine.',
      },
      {
        question: 'Is parking available?',
        answer:
          'Due to Central London resident parking permits, we strongly recommend arriving via black cab, Uber, or the nearby Sloane Square Underground Station.',
      },
    ],
    gifts: {
      message:
        'Having you travel to London to celebrate with us is the greatest honor. If you wish to gift us something, please consider contributing to our cottage garden restoration fund.',
      bankName: 'Barclays Private UK',
      accountHolder: 'Sophie Laurent & Antoine Dubois',
      iban: 'GB29 BUKB 2020 1555 9234 11',
      bicSwift: 'BUKBGB22XXX',
    },
    envelope: {
      waxColor: '#8b9d83',
      waxMonogram: 'S&A',
      bgColor: '#f8f4f0',
    },
  },

  'como': {
    id: 'como',
    slug: 'wedding-invitation-como',
    name: 'Como',
    subtitle: 'Villa del Balbianello Lakeside Suite',
    tagline: 'Terraced cypress gardens, vintage wooden Riva boats, and shimmering lake reflections.',
    badge: 'Lake & Waterfront Villas',
    couple: {
      partner1: 'Valentina',
      partner2: 'Marco',
      formalTitle: 'The Wedding Celebration of Valentina & Marco',
      initials: 'V & M',
    },
    ceremony: {
      date: '2026-09-12',
      time: '16:00',
      displayDate: 'Saturday, September 12, 2026',
      displayTime: '4:00 PM CEST',
      timeZone: 'Europe/Rome',
    },
    theme: {
      name: 'theme-como',
      colors: {
        primary: '#1a5276', // Deep Como Azure
        secondary: '#f0f6fa',
        accent: '#c4a35a', // Venetian Gold
        text: '#0c2340', // Deep Navy Charcoal
        background: '#F8FBFD',
        surface: '#FFFFFF',
        border: '#D2E3EE',
      },
      fonts: {
        display: 'font-cinzel',
        script: 'font-greatvibes',
        body: 'font-sans',
      },
    },
    location: {
      venueName: 'Villa del Balbianello',
      address: 'Via Guido Monzino, 1',
      city: 'Lenno, Lake Como',
      country: 'Italy',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Villa+del+Balbianello+Lake+Como+Italy',
      description:
        'An iconic 18th-century promontory villa famous for its arched loggia, umbrella pines, and private water boat arrivals.',
    },
    assets: {
      introVideo: 'https://pressedlove.com/demo-media/opening-2026-09/pressed-love-envelope-d2263e22.mp4',
      introVideoPoster: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-poster-ec17521e.webp',
      backgroundMusic: 'https://pressedlove.com/demo-media/shared/intro-music-S2szIoUv.mp3',
      heroVideo: 'https://pressedlove.com/demo-media/opening-2026-09/como-hero-87146e8e.mp4',
      heroVideoPoster: 'https://pressedlove.com/demo-media/opening-2026-09/the-venue-hero-poster-e5899d5d.webp',
      venueImage: 'https://pressedlove.com/template-assets/como/venue.webp',
      rsvpConfirmation: 'https://pressedlove.com/demo-media/shared/rsvp-confirmation-DYbKwzwP.webm',
    },
    program: [
      {
        time: '15:30',
        title: 'Private Riva Boat Transfer',
        description: 'Scenic boat departure from Lenno pier to the Villa promontory',
        iconType: 'wine',
      },
      {
        time: '16:00',
        title: 'The Ceremony at Loggia Durini',
        description: 'Vows overlooking the crystal waters of Lake Como',
        iconType: 'church',
      },
      {
        time: '17:30',
        title: 'Aperitivo Italiano',
        description: 'Bellinis, Franciacorta, and lake-view finger foods',
        iconType: 'wine',
      },
      {
        time: '19:30',
        title: 'Lakeside Gala Dinner',
        description: 'Four-course Italian gastronomic experience with wine pairing',
        iconType: 'utensils',
      },
      {
        time: '22:00',
        title: 'Open Bar & Fireworks',
        description: 'Midnight fireworks over Lake Como and dancing in the courtyard',
        iconType: 'sparkles',
      },
    ],
    accommodation: {
      title: 'Lake Como Accommodations',
      description: 'Exclusive lakeside retreats with dedicated boat docking:',
      hotels: [
        {
          name: 'Grand Hotel Tremezzo',
          tier: '5-Star Art Nouveau Palace',
          distance: '10 mins by boat',
          bookingUrl: 'https://maps.google.com/?q=Grand+Hotel+Tremezzo',
        },
        {
          name: 'Villa d’Este Cernobbio',
          tier: 'World-renowned Renaissance Palace',
          distance: '25 mins by boat',
          bookingUrl: 'https://maps.google.com/?q=Villa+d+Este+Cernobbio',
        },
        {
          name: 'Hotel Lenno',
          tier: 'Charming Waterfront Hotel',
          distance: '5 mins from embarkation',
          bookingUrl: 'https://maps.google.com/?q=Hotel+Lenno',
        },
      ],
    },
    faqs: [
      {
        question: 'How do we reach the Villa?',
        answer:
          'Villa del Balbianello is accessible only by private water taxi boat. Boats depart every 15 minutes from the Lenno Main Pier.',
      },
      {
        question: 'What is the dress code?',
        answer:
          'Italian Riviera Black Tie. Smoking jackets or midnight blue tuxedos for gentlemen, and glamorous gowns for ladies.',
      },
    ],
    gifts: {
      message:
        'Celebrating on Lake Como with our closest friends and family is the dream of our lives. If you wish to gift us, we would appreciate a contribution to our Italian Villa restoration fund.',
      bankName: 'Intesa Sanpaolo Milan',
      accountHolder: 'Valentina Rossi & Marco Bellini',
      iban: 'IT60 X054 2811 1010 0000 0123 456',
      bicSwift: 'BCITITMMXXX',
    },
    envelope: {
      waxColor: '#1a5276',
      waxMonogram: 'V&M',
      bgColor: '#f0f6fa',
    },
  },

  'heirloom-press': {
    id: 'heirloom-press',
    slug: 'wedding-invitation-heirloom-press',
    name: 'Heirloom Press',
    subtitle: 'English Heritage Letterpress Suite',
    tagline: 'Archival deckle-edge cotton papers, deep crimson blind deboss, and timeless country estates.',
    badge: 'Historic Manor & Castle',
    couple: {
      partner1: 'Eleanor',
      partner2: 'James',
      formalTitle: 'The Marriage of Eleanor & James',
      initials: 'E & J',
    },
    ceremony: {
      date: '2027-06-12',
      time: '14:30',
      displayDate: 'Saturday, June 12, 2027',
      displayTime: '2:30 PM BST',
      timeZone: 'Europe/London',
    },
    theme: {
      name: 'theme-heirloom-press',
      colors: {
        primary: '#6E2630', // Deep English Burgundy
        secondary: '#E6D8C1',
        accent: '#A4834D', // Aged Antique Brass
        text: '#24211E', // Letterpress Carbon Black
        background: '#F2E9D9',
        surface: '#FFFFFF',
        border: '#DFD1BD',
      },
      fonts: {
        display: 'font-cinzel',
        script: 'font-pinyon',
        body: 'font-cormorant',
      },
    },
    location: {
      venueName: 'Ashcombe Manor',
      address: 'Ashcombe Estate, Bathampton',
      city: 'Bath, Somerset',
      country: 'United Kingdom',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ashcombe+Estate+Bath',
      description:
        'A grand Georgian limestone manor surrounded by 1,200 acres of ancient oak parkland, secret walled gardens, and historic deer parks.',
    },
    assets: {
      introVideo: 'https://pressedlove.com/demo-media/opening-2026-09/pressed-love-envelope-d2263e22.mp4',
      introVideoPoster: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-poster-ec17521e.webp',
      backgroundMusic: 'https://pressedlove.com/demo-media/shared/intro-music-S2szIoUv.mp3',
      heroImage: 'https://pressedlove.com/template-assets/heirloom-press/cotton-paper.webp',
      venueImage: 'https://pressedlove.com/template-assets/heirloom-press/venue.webp',
      rsvpConfirmation: 'https://pressedlove.com/demo-media/shared/rsvp-confirmation-DYbKwzwP.webm',
    },
    program: [
      {
        time: '14:30',
        title: 'The Chapel Ceremony',
        description: 'Service with choral choir in the 14th-century estate chapel',
        iconType: 'church',
      },
      {
        time: '16:00',
        title: 'Croquet & Garden Reception',
        description: 'Champagne flutes, cucumber sandwiches, and lawn games',
        iconType: 'wine',
      },
      {
        time: '18:30',
        title: 'Candlelit Manor Dinner',
        description: 'Somerset farm-to-table banquet served in the Great Hall',
        iconType: 'utensils',
      },
      {
        time: '21:30',
        title: 'Ceilidh & Ball',
        description: 'Traditional country reels and live 9-piece orchestra',
        iconType: 'party',
      },
    ],
    accommodation: {
      title: 'Bath & Cotswold Hotels',
      description: 'Historical boutique stays in Somerset:',
      hotels: [
        {
          name: 'The Royal Crescent Hotel & Spa',
          tier: 'Georgian Icon in Central Bath',
          distance: '15 mins drive',
          bookingUrl: 'https://maps.google.com/?q=The+Royal+Crescent+Hotel',
        },
        {
          name: 'The Pig near Bath',
          tier: 'Cotswold Country House Retreat',
          distance: '12 mins drive',
          bookingUrl: 'https://maps.google.com/?q=The+Pig+near+Bath',
        },
      ],
    },
    faqs: [
      {
        question: 'What is the dress code?',
        answer: 'Black Tie or Traditional Highland Dress.',
      },
      {
        question: 'Are children invited?',
        answer: 'We adore your little ones, but our evening reception will be adults only.',
      },
    ],
    gifts: {
      message:
        'Your long journeys to celebrate with us in Somerset mean everything. If you wish to gift us, we have registered an antique art fund.',
      bankName: 'Coutts & Co London',
      accountHolder: 'Eleanor Vance & James Thornton',
      iban: 'GB82 COUT 1800 0012 3456 78',
      bicSwift: 'COUTGB22XXX',
    },
    envelope: {
      waxColor: '#6E2630',
      waxMonogram: 'E&J',
      bgColor: '#F2E9D9',
    },
  },

  'afterglow': {
    id: 'afterglow',
    slug: 'wedding-invitation-afterglow',
    name: 'Afterglow',
    subtitle: 'Modern Architectural Black-Tie Editorial',
    tagline: 'Minimalist editorial typography, stark contrasts, and moody candlelight soirées.',
    badge: 'Modern Editorial & Glasshouses',
    couple: {
      partner1: 'Maya',
      partner2: 'Adrian',
      formalTitle: 'Maya & Adrian are getting married',
      initials: 'M & A',
    },
    ceremony: {
      date: '2027-10-18',
      time: '18:00',
      displayDate: 'Monday, October 18, 2027',
      displayTime: '6:00 PM CET',
      timeZone: 'Europe/Berlin',
    },
    theme: {
      name: 'theme-afterglow',
      colors: {
        primary: '#C7A46A', // Radiant Champagne Gold
        secondary: '#171717',
        accent: '#6D2632',
        text: '#F3E9DB', // Alabaster White Text
        background: '#0D0E11', // Deep Midnight Editorial
        surface: '#15171C',
        border: '#2C2B2A',
      },
      fonts: {
        display: 'font-playfair',
        script: 'font-alex',
        body: 'font-sans',
      },
    },
    location: {
      venueName: 'The Glasshouse',
      address: 'Spreeufer 12',
      city: 'Berlin',
      country: 'Germany',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Glasshouse+Berlin',
      description:
        'An industrial architectural greenhouse on the banks of the River Spree, transformed with thousands of pillar candles and brutalist floral installations.',
    },
    assets: {
      introVideo: 'https://pressedlove.com/demo-media/opening-2026-09/pressed-love-envelope-d2263e22.mp4',
      introVideoPoster: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-poster-ec17521e.webp',
      backgroundMusic: 'https://pressedlove.com/demo-media/shared/intro-music-S2szIoUv.mp3',
      heroImage: 'https://pressedlove.com/template-assets/afterglow/hero.webp',
      venueImage: 'https://pressedlove.com/template-assets/afterglow/venue.webp',
      rsvpConfirmation: 'https://pressedlove.com/demo-media/shared/rsvp-confirmation-DYbKwzwP.webm',
    },
    program: [
      {
        time: '18:00',
        title: 'Sunset Ceremony',
        description: 'Vows in the candlelit atrium at dusk',
        iconType: 'church',
      },
      {
        time: '19:30',
        title: 'Negroni & Raw Bar',
        description: 'Artisanal cocktails and Berlin electro-lounge beats',
        iconType: 'wine',
      },
      {
        time: '21:00',
        title: 'Midnight Banquet',
        description: 'Modernist culinary tasting menu with natural wines',
        iconType: 'utensils',
      },
      {
        time: '23:30',
        title: 'Afterhours Club Set',
        description: 'DJs spinning until sunrise',
        iconType: 'party',
      },
    ],
    accommodation: {
      title: 'Design Stays in Berlin',
      description: 'Handpicked boutique hotels near the River Spree:',
      hotels: [
        {
          name: 'Soho House Berlin',
          tier: 'Mitte Creative Hub',
          distance: '10 mins drive',
          bookingUrl: 'https://maps.google.com/?q=Soho+House+Berlin',
        },
        {
          name: 'Hotel Telegraphenamt',
          tier: 'Luxury Historic Landmark',
          distance: '12 mins drive',
          bookingUrl: 'https://maps.google.com/?q=Telegraphenamt+Berlin',
        },
      ],
    },
    faqs: [
      {
        question: 'What is the dress code?',
        answer: 'Black Tie Avant-Garde. Strictly black, charcoal, or dark metallic accents.',
      },
    ],
    gifts: {
      message:
        'Your presence at our Berlin celebration is all we desire. If you wish to make a gesture, contributions to our architectural studio fund are cherished.',
      bankName: 'Deutsche Bank Berlin',
      accountHolder: 'Maya Bergmann & Adrian Wolf',
      iban: 'DE89 3704 0044 0532 0130 00',
      bicSwift: 'DEUTDEDDXXX',
    },
    envelope: {
      waxColor: '#C7A46A',
      waxMonogram: 'M&A',
      bgColor: '#171717',
    },
  },

  'pressed-meadow': {
    id: 'pressed-meadow',
    slug: 'wedding-invitation-pressed-meadow',
    name: 'Pressed Meadow',
    subtitle: 'Torn-Edge Cotton Paper & Wildflower Herbarium',
    tagline: 'A small ivory seal with pastel daisies opens onto torn-edge cotton paper and pressed wildflowers that sway softly.',
    badge: 'Pressed Flower & Meadow',
    couple: {
      partner1: 'Clara',
      partner2: 'Julian',
      formalTitle: 'The Wedding Celebration of Clara & Julian',
      initials: 'C & J',
    },
    ceremony: {
      date: '2027-06-19',
      time: '16:30',
      displayDate: 'Saturday, June 19, 2027',
      displayTime: '4:30 PM CEST',
      timeZone: 'Europe/Paris',
    },
    theme: {
      name: 'theme-meadow',
      colors: {
        primary: '#6b7f5e', // French Meadow Herbarium Green
        secondary: '#f7f4ed',
        accent: '#d9a786', // Soft Terracotta Ochre
        text: '#3c352d', // Walnut Bark
        background: '#F8F5EE', // Raw Cotton Paper
        surface: '#FFFFFF',
        border: '#E6DECE',
      },
      fonts: {
        display: 'font-cormorant',
        script: 'font-alex',
        body: 'font-lora',
      },
    },
    location: {
      venueName: 'Domaine de Primard',
      address: 'Route de Breuilpont, 28260 Guainville',
      city: 'Normandy / Île-de-France',
      country: 'France',
      googleMapsUrl: 'https://maps.google.com/?q=Domaine+de+Primard+Guainville',
      description:
        'A romantic 18th-century directoire château surrounded by centuries-old rose gardens, weeping willows, and winding waterways along the Eure river.',
    },
    assets: {
      introVideo: 'https://pressedlove.com/demo-media/motion-2026-10/pressed-meadow/opening.mp4',
      introVideoPoster: 'https://pressedlove.com/demo-media/motion-2026-10/pressed-meadow/poster.webp',
      backgroundMusic: 'https://pressedlove.com/demo-media/shared/intro-music-S2szIoUv.mp3',
      heroVideo: 'https://pressedlove.com/demo-media/motion-2026-10/pressed-meadow/showcase.mp4',
      heroVideoPoster: 'https://pressedlove.com/demo-media/motion-2026-10/pressed-meadow/hero.webp',
      heroImage: 'https://pressedlove.com/demo-media/motion-2026-10/pressed-meadow/hero.webp',
      venueImage: 'https://pressedlove.com/template-assets/heirloom-press/cotton-paper.webp',
      rsvpConfirmation: 'https://pressedlove.com/demo-media/shared/rsvp-confirmation-DYbKwzwP.webm',
    },
    program: [
      {
        time: '16:30',
        title: 'Garden Ceremony',
        description: 'Vows beside the water meadow under the weeping willows',
        iconType: 'church',
      },
      {
        time: '17:45',
        title: 'Cocktail Champêtre',
        description: 'Wildflower champagne flutes, Normandy cider & artisan canapés',
        iconType: 'wine',
      },
      {
        time: '19:45',
        title: 'The Farmhouse Banquet',
        description: 'Organic seasonal farm-to-table dinner under the glass greenhouse marquee',
        iconType: 'utensils',
      },
      {
        time: '22:30',
        title: 'Starlight Dance & Soirée',
        description: 'Acoustic jazz quartet transitioning into midnight DJ anthems',
        iconType: 'party',
      },
    ],
    accommodation: {
      title: 'Château Accommodations & Country Stays',
      description: 'Charming country manor rooms and boutique lodges reserved for wedding guests:',
      hotels: [
        {
          name: 'Domaine de Primard Relais & Châteaux',
          tier: '5-Star Historic Estate',
          distance: 'On site grounds',
          bookingUrl: 'https://maps.google.com/?q=Domaine+de+Primard',
        },
        {
          name: 'Château de Tilly',
          tier: '16th Century Norman Manor',
          distance: '12 mins drive (Shuttle service provided)',
          bookingUrl: 'https://maps.google.com/?q=Chateau+de+Tilly',
        },
      ],
    },
    faqs: [
      {
        question: 'What is the dress code?',
        answer: 'Pastel Garden Chic / Summer Elegant. Soft floral prints, linen suits, and comfortable footwear suitable for garden lawns.',
      },
      {
        question: 'Is transportation provided?',
        answer: 'Yes, private shuttles will connect Paris Charles de Gaulle & Gare de Lyon directly to Domaine de Primard.',
      },
    ],
    gifts: {
      message: 'Your love and presence on our wedding day in the French countryside is all we wish for.',
      bankName: 'BNP Paribas Private Banking Paris',
      accountHolder: 'Clara Delacroix & Julian Vance',
      iban: 'FR76 3000 4001 2345 6789 0123 456',
      bicSwift: 'BNPAFRPPXXX',
    },
    envelope: {
      waxColor: '#F7F2E7',
      waxMonogram: 'C&J',
      bgColor: '#F4EFE6',
    },
  },

  'the-palace': {
    id: 'the-palace',
    slug: 'wedding-invitation-the-palace',
    name: 'The Royal Palace (Udaipur)',
    subtitle: 'The Oberoi Udaivilas 24K Gold Suite',
    tagline: 'Imperial Mewar domes, 24K gold foiling, live sitar flute music, and sunset phoolon ki barsaat.',
    badge: 'Royal Indian Palatial Destination',
    couple: {
      partner1: 'Rohit',
      partner2: 'Priya',
      formalTitle: 'The Royal Wedding Celebrations of Rohit & Priya',
      initials: 'R & P',
    },
    ceremony: {
      date: '2027-11-20',
      time: '18:00',
      displayDate: 'Saturday, November 20, 2027',
      displayTime: '6:00 PM IST',
      timeZone: 'Asia/Kolkata',
    },
    theme: {
      name: 'theme-palace',
      colors: {
        primary: '#AA820A', // 24K Palatial Gold
        secondary: '#FAF4E3',
        accent: '#9B1C2E', // Sindoor Crimson
        text: '#2C2218', // Deep Charcoal Walnut
        background: '#FAF8F5',
        surface: '#FFFFFF',
        border: '#E8DFC8',
      },
      fonts: {
        display: 'font-cinzel',
        script: 'font-pinyon',
        body: 'font-cormorant',
      },
    },
    location: {
      venueName: 'The Oberoi Udaivilas',
      address: 'Badi-Gorela-Mulla Talai Rd, Haridas Ji Ki Magri',
      city: 'Udaipur, Rajasthan',
      country: 'India',
      googleMapsUrl: 'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
      description:
        'Sprawled over 50 acres on the banks of Lake Pichola, featuring grand Mewar domes, ornate fountains, marble courtyards, and peacocks strolling through landscaped gardens.',
    },
    assets: {
      introVideo: 'https://pressedlove.com/demo-media/opening-2026-09/pressed-love-envelope-d2263e22.mp4',
      introVideoPoster: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-poster-ec17521e.webp',
      backgroundMusic: 'https://pressedlove.com/demo-media/shared/intro-music-S2szIoUv.mp3',
      heroImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1920&q=80',
      venueImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      rsvpConfirmation: 'https://pressedlove.com/demo-media/shared/rsvp-confirmation-DYbKwzwP.webm',
    },
    program: [
      {
        time: '11:00',
        title: 'Shubh Haldi & Phoolon Ki Holi',
        description: 'Organic marigold petal shower, dhol beats, and traditional rasam',
        iconType: 'sparkles',
      },
      {
        time: '17:00',
        title: 'The Royal Baraat & Pheras',
        description: 'Sacred wedding vows overlooking Lake Pichola at sunset',
        iconType: 'ring',
      },
      {
        time: '20:30',
        title: 'Imperial Gala Banquet',
        description: 'Authentic Rajasthani and global gourmet banquet with live Sufi ensemble',
        iconType: 'utensils',
      },
      {
        time: '23:00',
        title: 'Sangeet After-Party',
        description: 'Celebratory Bollywood DJ set on the lakeside promenade',
        iconType: 'party',
      },
    ],
    accommodation: {
      title: 'Palace Accommodations',
      description: 'All guests are hosted on the palace grounds of Lake Pichola:',
      hotels: [
        {
          name: 'The Oberoi Udaivilas',
          tier: 'Luxury Resort & Spa',
          distance: 'On site',
          bookingUrl: 'https://maps.google.com/?q=The+Oberoi+Udaivilas',
        },
        {
          name: 'Taj Lake Palace',
          tier: 'Floating Island Palace',
          distance: '5 mins by private boat',
          bookingUrl: 'https://maps.google.com/?q=Taj+Lake+Palace',
        },
      ],
    },
    faqs: [
      {
        question: 'What is the dress code for each ceremony?',
        answer:
          'Haldi: Festive Yellow or Mustard. Sangeet: Shimmering Indo-Western or Royal Lehengas/Sherwanis. Pheras & Reception: Regal Traditional Indian Attire or Black Tie.',
      },
      {
        question: 'Are airport transfers provided?',
        answer:
          'Yes. Private royal chauffeurs will receive all guests at Maharana Pratap Airport (UDR) and transfer directly to the hotel suites.',
      },
    ],
    gifts: {
      message:
        'Your presence and blessings as we embark on this sacred journey together is the only gift we seek (No boxed gifts requested).',
      bankName: 'HDFC Private Banking Mumbai',
      accountHolder: 'Rohit Sharma & Priya Kapoor',
      iban: 'IN55 HDFC 0001 2345 6789 01',
      bicSwift: 'HDFCINBBXXX',
    },
    envelope: {
      waxColor: '#AA820A',
      waxMonogram: 'R&P',
      bgColor: '#FAF8F5',
    },
  },

  'zareqia-emerald': {
    id: 'zareqia-emerald',
    slug: 'wedding-invitation-zareqia-emerald',
    name: 'Zareqia Sage Emerald',
    subtitle: 'Luxury Gatefold & Classical Courtyard Suite',
    tagline: 'Embossed sage leaf gatefold, scalloped Tap-To-Open seal, silk drapes reveal, and interactive emerald heart scratch card.',
    badge: 'Viral Luxury Instagram Suite',
    couple: {
      partner1: 'Zayn',
      partner2: 'Nora',
      formalTitle: "We're getting married: Zayn & Nora",
      initials: 'Z & N',
    },
    ceremony: {
      date: '2026-11-30',
      time: '18:00',
      displayDate: 'Monday, November 30, 2026',
      displayTime: '6:00 PM',
      timeZone: 'Europe/London',
    },
    theme: {
      name: 'theme-zareqia-emerald',
      colors: {
        primary: '#364531',
        secondary: '#5C7153',
        accent: '#C4A265',
        text: '#24201D',
        background: '#FAF7F2',
        surface: '#FFFFFF',
        border: '#D9D0C3',
      },
      fonts: {
        display: 'font-cinzel',
        script: 'font-pinyon',
        body: 'font-cormorant',
      },
    },
    location: {
      venueName: 'Grand Palace Hall',
      address: 'City centre',
      city: 'London',
      country: 'United Kingdom',
      googleMapsUrl: 'https://maps.google.com/?q=Grand+Palace+Hall+City+centre+London',
      description: 'Classical architecture, majestic chandeliers, and manicured terrace courtyard in central London.',
    },
    assets: {
      introVideo: '',
      introVideoPoster: '/templates/zareqia/hero-courtyard.jpg',
      backgroundMusic: '/audio/indian-wedding-instrumental.mp3',
      heroImage: '/templates/zareqia/hero-courtyard.jpg',
      venueImage: '/templates/zareqia/carousel-1.jpg',
      rsvpConfirmation: '',
    },
    program: [
      {
        time: '10:00 AM',
        title: 'Guest Arrival',
        description: 'We welcome you with open arms and joyful hearts.',
        iconType: 'wine',
      },
      {
        time: '10:30 AM',
        title: 'Wedding Ceremony',
        description: 'Exchange of vows under the grand floral pavilion.',
        iconType: 'ring',
      },
      {
        time: '7:30 PM',
        title: 'Reception',
        description: 'Dinner, toasts, live orchestra and dancing.',
        iconType: 'party',
      },
    ],
    accommodation: {
      title: 'Accommodation',
      description: 'Special rates at The Grand Palace Hotel (5 min from venue). Use code WEDDING2026 when booking.',
      hotels: [
        {
          name: 'The Grand Palace Hotel',
          tier: '5-Star Luxury',
          distance: '5 mins from venue',
          bookingUrl: 'https://maps.google.com/?q=Grand+Palace+Hotel+London',
        },
      ],
    },
    faqs: [
      {
        question: 'Is transportation provided to the venue?',
        answer: 'Yes, shuttle service will be available from central station at 3:30 PM.',
      },
    ],
    gifts: {
      message: 'Your love, blessings and presence are the greatest gifts we could ever ask for.',
      bankName: 'Barclays Private Banking',
      accountHolder: 'Zayn Malik & Nora Nasser',
      iban: 'GB29 BUKB 6016 1331 9268 19',
      bicSwift: 'BUKBGB22',
    },
    envelope: {
      waxColor: '#364531',
      waxMonogram: 'Z&N',
      bgColor: '#5C7153',
    },
  },

  'royal-heritage': {
    id: 'royal-heritage',
    slug: 'wedding-invitation-royal-heritage',
    name: 'Royal Heritage 3D Scrolly Suite',
    subtitle: 'Cinematic Royal Couple & 3D Video Scroller',
    tagline: 'Interactive scroll-scrubbed Indian royal couple animation, gatefold unboxing, 3D glitter scratch heart, and royal palace itinerary.',
    badge: 'New 3D Cinematic Motion',
    couple: {
      partner1: 'Aryan',
      partner2: 'Eva',
      formalTitle: "We're getting married: Aryan & Eva",
      initials: 'A & E',
    },
    ceremony: {
      date: '2026-12-12',
      time: '10:00',
      displayDate: 'Saturday, December 12, 2026',
      displayTime: '10:00 AM',
      timeZone: 'Asia/Kolkata',
    },
    theme: {
      name: 'theme-royal-heritage',
      colors: {
        primary: '#1A2218',
        secondary: '#273822',
        accent: '#DFC07C',
        text: '#242A20',
        background: '#FAF8F5',
        surface: '#FFFFFF',
        border: '#DFC07C',
      },
      fonts: {
        display: 'font-cinzel',
        script: 'font-pinyon',
        body: 'font-cormorant',
      },
    },
    location: {
      venueName: 'The Royal Palace & Gardens',
      address: 'Lake Pichola',
      city: 'Udaipur, Rajasthan',
      country: 'India',
      googleMapsUrl: 'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
      description: 'Regal lakeside palace heritage, intricate jharokha arches, and fairytale courtyard gardens.',
    },
    assets: {
      introVideo: '',
      introVideoPoster: '/templates/royal-heritage/frames/frame_0001.webp',
      backgroundMusic: '/audio/royal-heritage-music.mp3',
      heroImage: '/templates/royal-heritage/frames/frame_0001.webp',
      venueImage: '/templates/royal-heritage/frames/frame_0001.webp',
      rsvpConfirmation: '',
    },
    program: [
      {
        time: '6:00 PM',
        title: 'Mehndi & Sangeet',
        description: 'An evening of music, dance, and festive henna.',
        iconType: 'wine',
      },
      {
        time: '10:00 AM',
        title: 'Wedding Ceremony',
        description: 'Sacred wedding rituals and auspicious vows.',
        iconType: 'ring',
      },
      {
        time: '7:30 PM',
        title: 'Royal Reception',
        description: 'Grand dinner banquet and royal celebrations.',
        iconType: 'party',
      },
    ],
    accommodation: {
      title: 'Accommodation',
      description: 'Luxury suites reserved at The Royal Palace Resort for our esteemed guests.',
      hotels: [
        {
          name: 'The Royal Palace Heritage Resort',
          tier: '5-Star Luxury Heritage',
          distance: 'At venue',
          bookingUrl: 'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
        },
      ],
    },
    faqs: [
      {
        question: 'What is the recommended dress code?',
        answer: 'Pastel florals, emerald green, and regal navy Indian traditional formal wear.',
      },
    ],
    gifts: {
      message: 'Your love, blessings, and presence are the greatest gifts we could ever ask for.',
      bankName: 'HDFC Private Banking',
      accountHolder: 'Aryan Sharma & Eva Mehta',
      iban: 'HDFC0001234',
      bicSwift: 'HDFCINBB',
    },
    envelope: {
      waxColor: '#273822',
      waxMonogram: 'A&E',
      bgColor: '#1A2218',
    },
  },
};

export const TEMPLATE_LIST = Object.values(PRESSED_LOVE_TEMPLATES);
