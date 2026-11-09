export type InvitationLanguage = 'en' | 'hi';

export interface CeremonyProgramItem {
  time: string;
  title: string;
  description: string;
}

export interface AccommodationHotelItem {
  name: string;
  distance: string;
  tier: string;
  bookingUrl?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface InvitationTranslations {
  shlokaHeader: string;
  shlokaMantra: string;
  announcementProse: string;
  guestInscribedLabel: string;
  scratchPrompt: string;
  rsvpButton: string;
  calendarButton: string;
  
  // Scratch Card
  scratchSectionSubtitle: string;
  scratchSectionTitle: string;
  scratchSectionDescription: string;
  scratchGoldFoilPrompt: string;
  scratchGoldFoilSubtitle: string;
  scratchRevealHeading: string;
  scratchRevealRitual: string;
  scratchRevealBlessing: string;

  // Countdown
  countdownTitle: string;
  countdownDescription: string;
  daysLabel: string;
  hoursLabel: string;
  minutesLabel: string;
  secondsLabel: string;

  // Venue
  venueSubtitle: string;
  venuePlateLabel: string;
  venueMapsButton: string;

  // Program
  programSubtitle: string;
  programTitle: string;
  programDescription: string;
  programItems: CeremonyProgramItem[];

  // DJ
  djSubtitle: string;
  djTitle: string;
  djDescription: string;
  djBadge: string;
  djDirectConsole: string;
  djSongTitleLabel: string;
  djSongTitlePlaceholder: string;
  djArtistLabel: string;
  djArtistPlaceholder: string;
  djNameLabel: string;
  djNamePlaceholder: string;
  djPhoneLabel: string;
  djPhonePlaceholder: string;
  djNotesLabel: string;
  djNotesPlaceholder: string;
  djSubmitButton: string;
  djSubmittingButton: string;
  djSuccessTitle: string;
  djSuccessText: string;

  // Voice Blessing
  voiceSubtitle: string;
  voiceTitle: string;
  voiceDescription: string;
  voiceBadge: string;
  voiceInstructions: string;
  voiceStartRecord: string;
  voiceStopRecord: string;
  voicePlaying: string;
  voicePlayPreview: string;
  voiceReRecord: string;
  voiceNamePlaceholder: string;
  voiceSubmitButton: string;
  voiceSubmittingButton: string;
  voiceSuccessTitle: string;
  voiceSuccessText: string;

  // Accommodations
  accommodationSubtitle: string;
  accommodationTitle: string;
  accommodationDescription: string;
  accommodationReservedLabel: string;
  accommodationViewStayButton: string;
  hotels: AccommodationHotelItem[];

  // FAQ
  faqSubtitle: string;
  faqTitle: string;
  faqs: FaqItem[];

  // Shagun
  shagunSubtitle: string;
  shagunTitle: string;
  shagunDescription: string;
  shagunIbanLabel: string;
  shagunAccountHolderLabel: string;
  shagunCopyButton: string;
  shagunCopiedButton: string;

  // RSVP
  rsvpSubtitle: string;
  rsvpTitle: string;
  rsvpDescription: string;
  rsvpNameLabel: string;
  rsvpNamePlaceholder: string;
  rsvpPhoneLabel: string;
  rsvpPhonePlaceholder: string;
  rsvpAttendingOption: string;
  rsvpDecliningOption: string;
  rsvpGuestCountLabel: string;
  rsvpDietaryLabel: string;
  rsvpDietaryPlaceholder: string;
  rsvpSubmitButton: string;
  rsvpSubmittingButton: string;
  rsvpSuccessTitle: string;
  rsvpSuccessSubtitle: string;
  rsvpVipPassTitle: string;

  // Footer
  footerShloka: string;
  footerFamilies: string;
}

export const INVITATION_TRANSLATIONS: Record<InvitationLanguage, InvitationTranslations> = {
  en: {
    shlokaHeader: '॥ ॐ श्री गणेशाय नमः ॥',
    shlokaMantra: 'Vakratunda Mahakaya Suryakoti Samaprabha • Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada',
    announcementProse: 'Together with their families, with the divine blessings of our elders and Almighty, we cordially invite you to celebrate the holy wedding ceremonies of',
    guestInscribedLabel: 'Specially Inscribed With Love For',
    scratchPrompt: '✦ Scratch the sacred 24K gold foil below to unveil our wedding date & lagna muhurat ✦',
    rsvpButton: 'RSVP Response',
    calendarButton: 'Add to Calendar',

    // Scratch Card
    scratchSectionSubtitle: '॥ SACRED LAGNA MUHURAT PATRIKA ॥',
    scratchSectionTitle: 'Rub The 24K Gold Foil To Unveil The Sacred Date',
    scratchSectionDescription: 'Gently glide your finger or cursor over the gold leaf to reveal our auspicious wedding date & muhurat',
    scratchGoldFoilPrompt: '✦ SACRED VIVAH LAGNA MUHURAT ✦',
    scratchGoldFoilSubtitle: 'Gently rub the 24K gold foil with your finger to reveal our wedding date',
    scratchRevealHeading: 'Sacred Lagna Muhurat Revealed With Love',
    scratchRevealRitual: 'Auspicious Muhurat: Godhuli Vela • Saat Phere & Panigrahana Sanskar',
    scratchRevealBlessing: '✦ SADA SAUBHAGYAVATI BHAVA ✦',

    // Countdown
    countdownTitle: '✦ The Auspicious Celebrations Commence In ✦',
    countdownDescription: 'Every ticking second brings us closer to the sacred Saat Phere and lifelong union',
    daysLabel: 'DAYS',
    hoursLabel: 'HOURS',
    minutesLabel: 'MINUTES',
    secondsLabel: 'SECONDS',

    // Venue
    venueSubtitle: '॥ SACRED WEDDING SANCTUARY & MANDAP ॥',
    venuePlateLabel: 'Plate I — Architectural watercolor view of the royal mandap and palatial estate',
    venueMapsButton: 'Open In Google Maps',

    // Program
    programSubtitle: '॥ AUSPICIOUS CEREMONIES & ITINERARY ॥',
    programTitle: 'Schedule of Celebrations',
    programDescription: 'Sacred Vedic rituals, joyous music, starlit Sangeet, and the royal wedding banquet',
    programItems: [
      {
        time: 'Day 1 • 10:30 AM',
        title: 'Shubh Haldi & Turmeric Rasam',
        description: 'Traditional turmeric ceremony with fragrant rose petals, auspicious yellow attire, marigold decor, and folk dholak geet.',
      },
      {
        time: 'Day 1 • 06:30 PM',
        title: 'Mehendi & Royal Sangeet Night',
        description: 'Intricate henna art, energetic Bollywood & Bhangra dance performances, live dhol, and lavish culinary spreads under starlight.',
      },
      {
        time: 'Day 2 • 04:30 PM',
        title: 'Baraat Procession & Milni',
        description: 'Joyous arrival of the groom with royal band baja, majestic procession, followed by the sacred Vedic Milni of both families.',
      },
      {
        time: 'Day 2 • 06:15 PM',
        title: 'The Sacred Saat Phere & Varmala',
        description: 'Varmala exchange followed by solemn Vedic circumambulation of the holy agni, kanyadaan, and eternal blessings.',
      },
      {
        time: 'Day 2 • 08:30 PM',
        title: 'The Imperial Vivah Reception & Gala',
        description: 'A grand royal feast celebrating the newlyweds with live classical fusion symphony, toast to eternal love, and gourmet dining.',
      },
    ],

    // DJ
    djSubtitle: 'SANGEET DANCE FLOOR FARMAISH',
    djTitle: 'Pre-Wedding DJ Song Request',
    djDescription: 'Submit your favorite Bollywood or Bhangra track — routed directly to our Sangeet DJ console!',
    djBadge: 'SANGEET DANCE FLOOR',
    djDirectConsole: 'Direct To DJ Console',
    djSongTitleLabel: 'Song Title & Track Name',
    djSongTitlePlaceholder: 'e.g. Gallan Goodiyaan / London Thumakda / Sauda Khara Khara',
    djArtistLabel: 'Artist or Movie Name',
    djArtistPlaceholder: 'e.g. Dil Dhadakne Do / Arijit Singh / Sukhbir',
    djNameLabel: 'Your Good Name',
    djNamePlaceholder: 'e.g. Aditya Singhania & Family',
    djPhoneLabel: 'WhatsApp / Phone (Optional)',
    djPhonePlaceholder: '+91 98765 43210',
    djNotesLabel: 'Special Shoutout or Dedication (Optional)',
    djNotesPlaceholder: 'e.g. For Rohit & Priya’s epic group dance battle!',
    djSubmitButton: 'Send Song Request To DJ',
    djSubmittingButton: 'Transmitting To Console...',
    djSuccessTitle: 'Song Request Recorded!',
    djSuccessText: 'Your song request has been queued on the official Sangeet console.',

    // Voice Blessing
    voiceSubtitle: 'VOICE BLESSINGS & ELDER AASHIRWAD',
    voiceTitle: 'Record a Voice Blessing',
    voiceDescription: 'Record your heartfelt spoken wishes, Sanskrit mantras, or elder aashirwad for the couple to cherish forever.',
    voiceBadge: 'AUDIO BLESSING',
    voiceInstructions: 'Press the microphone button below to record your voice message for the couple.',
    voiceStartRecord: 'Tap To Start Recording',
    voiceStopRecord: 'Stop Recording',
    voicePlaying: 'Playing Blessing...',
    voicePlayPreview: 'Listen To Recording',
    voiceReRecord: 'Record Again',
    voiceNamePlaceholder: 'Your Name (e.g. Sharma Uncle & Family)',
    voiceSubmitButton: 'Save Voice Blessing For Couple',
    voiceSubmittingButton: 'Inscribing Audio Blessing...',
    voiceSuccessTitle: 'Voice Blessing Preserved!',
    voiceSuccessText: 'Your voice blessings have been permanently sealed into the couple’s sacred wedding audio album.',

    // Accommodations
    accommodationSubtitle: '॥ ROYAL GUEST HOSPITALITY & STAY ॥',
    accommodationTitle: 'Guest Accommodations & Stay',
    accommodationDescription: 'Comfortable luxury quarters have been graciously reserved for all our traveling guests and families.',
    accommodationReservedLabel: 'Reserved Quarters',
    accommodationViewStayButton: 'View Property',
    hotels: [
      {
        name: 'The Imperial Heritage Palace',
        distance: 'Within Ceremony Grounds • Onsite',
        tier: 'Presidential Suites & Royal Heritage Haveli Rooms',
        bookingUrl: 'https://maps.google.com',
      },
      {
        name: 'The Lakefront Courtyard & Villas',
        distance: '4 Minutes Away • Private Chauffeur Shuttles Provided',
        tier: 'Lakefront Deluxe Suites with Private Balconies',
        bookingUrl: 'https://maps.google.com',
      },
    ],

    // FAQ
    faqSubtitle: '॥ ESSENTIAL GUEST INFORMATION ॥',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      {
        question: 'What is the recommended dress code for each ceremony?',
        answer: 'For Haldi: Sunshine yellows and marigold hues. For Mehendi & Sangeet: Festive Indo-Western, vibrant lehengas, and embroidered kurtas. For Saat Phere & Reception: Royal traditional Indian attire (Sherwanis, Bandhgalas, Silk Sarees, and Royal Lehengas).',
      },
      {
        question: 'Is valet parking and transport assistance available?',
        answer: 'Yes, full royal valet parking is available at the main palace gates. Dedicated chauffeur shuttles will run round-the-clock between partner hotels and the venue.',
      },
      {
        question: 'Can I bring children and extended family?',
        answer: 'We warmly welcome our little ones! A dedicated supervised kids play arena and child-friendly dining will be available throughout the celebrations.',
      },
      {
        question: 'What should I do if I have specific dietary preferences?',
        answer: 'All celebrations feature multi-cuisine pure vegetarian culinary feasts, with dedicated Jain food counters and vegan options clearly labeled.',
      },
    ],

    // Shagun
    shagunSubtitle: '॥ WEDDING REGISTRY & DIGITAL SHAGUN ॥',
    shagunTitle: 'Wedding Registry & Shagun',
    shagunDescription: 'Your presence and hearty blessings are the greatest gifts we could ever ask for. For friends and family who insist on presenting Shagun:',
    shagunIbanLabel: 'DIGITAL SHAGUN / REGISTRY UPI & IBAN',
    shagunAccountHolderLabel: 'Account Beneficiary',
    shagunCopyButton: 'Copy IBAN / UPI',
    shagunCopiedButton: 'Copied With Thanks!',

    // RSVP
    rsvpSubtitle: '॥ RÉPONDEZ S’IL VOUS PLAÎT (RSVP) ॥',
    rsvpTitle: 'Reserve Your Royal Presence',
    rsvpDescription: 'Please confirm your gracious attendance with folded hands to receive your VIP Digital Entry Pass.',
    rsvpNameLabel: 'Full Guest Name',
    rsvpNamePlaceholder: 'e.g. Mr. & Mrs. Aditya Singhania',
    rsvpPhoneLabel: 'WhatsApp Contact Number',
    rsvpPhonePlaceholder: '+91 98765 43210',
    rsvpAttendingOption: 'Joyfully Accepts With Gratitude',
    rsvpDecliningOption: 'Regretfully Declines With Blessings',
    rsvpGuestCountLabel: 'Total Number of Family Members Attending',
    rsvpDietaryLabel: 'Special Dietary or Travel Requests (Optional)',
    rsvpDietaryPlaceholder: 'e.g. Jain food requested / airport transfer needed',
    rsvpSubmitButton: 'Confirm Attendance & Generate VIP Pass',
    rsvpSubmittingButton: 'Sealing Royal Attendance...',
    rsvpSuccessTitle: 'Auspicious Presence Sealed!',
    rsvpSuccessSubtitle: 'Your VIP Digital Entry Pass has been generated. We look forward to welcoming you!',
    rsvpVipPassTitle: 'Official Royal Entry Pass',

    // Footer
    footerShloka: '॥ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥',
    footerFamilies: 'Forever Begins Under The Sacred Stars • With Warm Love From Sharma & Mehra Families',
  },

  hi: {
    shlokaHeader: '॥ ॐ श्री गणेशाय नमः ॥',
    shlokaMantra: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
    announcementProse: 'परमपिता परमेश्वर एवं कुलदेवता के असीम आशीर्वाद से, हमारे पूज्य दादा-दादी, नाना-नानी एवं माता-पिता के सान्निध्य में, हम आपको इस पावन वैवाहिक उत्सव में सादर आमंत्रित करते हैं',
    guestInscribedLabel: 'सस्नेह सादर निमंत्रण पत्र',
    scratchPrompt: '✦ शुभ लग्न मुहूर्त एवं तिथि जानने हेतु नीचे 24K स्वर्ण पटल को स्पर्श करें ✦',
    rsvpButton: 'उपस्थिति स्वीकृति (RSVP)',
    calendarButton: 'कैलेंडर में जोड़ें',

    // Scratch Card
    scratchSectionSubtitle: '॥ पवित्र लग्न मुहूर्त पत्रिका ॥',
    scratchSectionTitle: 'शुभ विवाह लग्न मुहूर्त पत्रिका',
    scratchSectionDescription: 'अपनी उंगली या कर्सर से स्वर्ण पटल को धीरे से रगड़ें और शुभ विवाह मुहूर्त एवं तिथि देखें',
    scratchGoldFoilPrompt: '✦ शुभ विवाह लग्न मुहूर्त ✦',
    scratchGoldFoilSubtitle: 'विवाह तिथि व मुहूर्त जानने हेतु स्वर्ण पटल को धीरे से रगड़ें',
    scratchRevealHeading: 'शुभ विवाह लग्न मुहूर्त सप्रेम उद्घाटित',
    scratchRevealRitual: 'शुभ लग्न: गोधूलि वेला • पावन सात फेरे एवं पाणीग्रहण संस्कार',
    scratchRevealBlessing: '✦ सदा सौभाग्यवती भव ✦',

    // Countdown
    countdownTitle: '✦ मांगलिक वैवाहिक उत्सव प्रारंभ होने में शेष ✦',
    countdownDescription: 'प्रतीक्षा के ये शुभ पल हमें पावन सात फेरों एवं जन्म-जन्मांतर के अटूट बंधन के समीप ला रहे हैं',
    daysLabel: 'दिन',
    hoursLabel: 'घंटे',
    minutesLabel: 'मिनट',
    secondsLabel: 'सेकंड',

    // Venue
    venueSubtitle: '॥ शुभ विवाह स्थल एवं मंडप ॥',
    venuePlateLabel: 'चित्रपट १ — विवाह स्थल एवं पवित्र मंडप का विहंगम दृश्य',
    venueMapsButton: 'गूगल मैप्स पर मार्ग देखें',

    // Program
    programSubtitle: '॥ मांगलिक कार्यक्रम सारिणी ॥',
    programTitle: 'मांगलिक उत्सव कार्यक्रम',
    programDescription: 'वैदिक अनुष्ठान, पारंपरिक रस्में, उल्लासपूर्ण संगीत संध्या एवं भव्य प्रीतिभोज',
    programItems: [
      {
        time: 'प्रथम दिवस • प्रातः १०:३० बजे',
        title: 'शुभ हल्दी एवं उबटन रस्म',
        description: 'पीत वर्ण वस्त्रों में सुसज्जित, सुगंधित पुष्पों व हल्दी लेप के साथ मांगलिक ढोलक गीतों का उल्लास।',
      },
      {
        time: 'प्रथम दिवस • सायं ०६:३० बजे',
        title: 'मेहंदी एवं शाही संगीत संध्या',
        description: 'पारंपरिक मेहंदी, सगे-संबंधियों के नृत्य, लाइव ढोल की थाप एवं तारों की छांव में स्वादिष्ट व्यंजनों का आनंद।',
      },
      {
        time: 'द्वितीय दिवस • सायं ०४:३० बजे',
        title: 'शाही बारात आगमन एवं मिलनी',
        description: 'बैंड-बाजों के साथ वर पक्ष का भव्य स्वागत एवं दोनों परिवारों की परस्पर वैदिक मिलनी रस्म।',
      },
      {
        time: 'द्वितीय दिवस • सायं ०६:१५ बजे',
        title: 'वरमाला एवं पावन सात फेरे',
        description: 'वरमाला आदान-प्रदान, पवित्र अग्नि के सम्मुख सात फेरे, कन्यादान एवं बड़ों का मंगल आशीर्वाद।',
      },
      {
        time: 'द्वितीय दिवस • रात्रि ०८:३० बजे',
        title: 'शाही प्रीतिभोज एवं स्वागत समारोह',
        description: 'नव-दंपति के सम्मान में आयोजित भव्य शाही प्रीतिभोज, सुमधुर संगीत एवं सस्नेह शुभकामनाएँ।',
      },
    ],

    // DJ
    djSubtitle: 'संगीत डांस फ्लोर फरमाइश',
    djTitle: 'संगीत संध्या हेतु अपनी पसंदीदा धुन',
    djDescription: 'अपनी मनपसंद बॉलीवुड या भांगड़ा धुन की फरमाइश करें — जो सीधे हमारे संगीत डीजे तक पहुँचेगी!',
    djBadge: 'संगीत संध्या फरमाइश',
    djDirectConsole: 'सीधे डीजे कंसोल पर',
    djSongTitleLabel: 'गीत या धुन का नाम',
    djSongTitlePlaceholder: 'जैसे: गल्लां गूड़ियां / लंदन ठुमकदा / सौदा खरा खरा',
    djArtistLabel: 'गायक या फिल्म का नाम',
    djArtistPlaceholder: 'जैसे: दिल धड़कने दो / अरिजीत सिंह / सुखबीर',
    djNameLabel: 'आपका शुभ नाम',
    djNamePlaceholder: 'जैसे: आदित्य सिंघानिया एवं परिवार',
    djPhoneLabel: 'व्हाट्सएप / फोन नंबर (ऐच्छिक)',
    djPhonePlaceholder: '+91 98765 43210',
    djNotesLabel: 'विशेष समर्पण या संदेश (ऐच्छिक)',
    djNotesPlaceholder: 'जैसे: रोहित और प्रिया के डांस कॉम्पिटिशन के लिए!',
    djSubmitButton: 'डीजे को अपनी फरमाइश भेजें',
    djSubmittingButton: 'फरमाइश भेजी जा रही है...',
    djSuccessTitle: 'आपकी फरमाइश दर्ज हो गई!',
    djSuccessText: 'आपका पसंदीदा गीत संगीत संध्या की आधिकारिक प्लेलिस्ट में जोड़ दिया गया है।',

    // Voice Blessing
    voiceSubtitle: 'ऑडियो शुभकामनाएँ एवं आशीर्वाद',
    voiceTitle: 'अपने मुख से मंगल आशीर्वाद रिकॉर्ड करें',
    voiceDescription: 'वर-वधू के सुखद वैवाहिक जीवन हेतु अपनी वाणी में मंगल आशीर्वाद एवं शुभकामनाएँ रिकॉर्ड करें।',
    voiceBadge: 'वाणी आशीर्वाद',
    voiceInstructions: 'वर-वधू के लिए अपनी आवाज़ में संदेश रिकॉर्ड करने हेतु नीचे दिए गए माइक बटन को दबाएँ।',
    voiceStartRecord: 'रिकॉर्डिंग प्रारंभ करें',
    voiceStopRecord: 'रिकॉर्डिंग समाप्त करें',
    voicePlaying: 'आशीर्वाद बज रहा है...',
    voicePlayPreview: 'रिकॉर्डिंग सुनें',
    voiceReRecord: 'पुनः रिकॉर्ड करें',
    voiceNamePlaceholder: 'आपका नाम (जैसे: शर्मा अंकल एवं परिवार)',
    voiceSubmitButton: 'आशीर्वाद सुरक्षित करें',
    voiceSubmittingButton: 'सुरक्षित किया जा रहा है...',
    voiceSuccessTitle: 'मंगल आशीर्वाद सहेज लिया गया!',
    voiceSuccessText: 'आपकी वाणी का मंगल आशीर्वाद वर-वधू के विवाह संग्रह में सदैव के लिए सुरक्षित हो गया है।',

    // Accommodations
    accommodationSubtitle: '॥ शाही मेहमान नवाज़ी ॥',
    accommodationTitle: 'अतिथि आवास एवं मेहमान नवाज़ी',
    accommodationDescription: 'हमारे सभी सम्मानित अतिथियों एवं परिजनों के लिए गरिमामयी आवास की समुचित व्यवस्था की गई है।',
    accommodationReservedLabel: 'आरक्षित कक्ष',
    accommodationViewStayButton: 'आवास विवरण देखें',
    hotels: [
      {
        name: 'द इंपीरियल हेरिटेज पैलेस',
        distance: 'विवाह स्थल परिसर के भीतर ही स्थित',
        tier: 'प्रेसिडेंशियल सूट्स एवं रॉयल हेरिटेज कक्ष',
        bookingUrl: 'https://maps.google.com',
      },
      {
        name: 'द लेकफ्रंट कोर्टयार्ड विला',
        distance: 'विवाह स्थल से ४ मिनट की दूरी • चौबीसों घंटे वाहन सुविधा',
        tier: 'झील के सामने बालकनी युक्त डीलक्स सूट्स',
        bookingUrl: 'https://maps.google.com',
      },
    ],

    // FAQ
    faqSubtitle: '॥ विवाह संबंधी आवश्यक जानकारी ॥',
    faqTitle: 'महत्वपूर्ण प्रश्नोत्तरी',
    faqs: [
      {
        question: 'प्रत्येक उत्सव के लिए पोशाक (ड्रेस कोड) क्या है?',
        answer: 'हल्दी रस्म: पीले रंग के पारंपरिक वस्त्र। मेहंदी एवं संगीत: रंग-बिरंगे इंडो-वेस्टर्न, लहंगे व कुर्ते। सात फेरे एवं प्रीतिभोज: राजसी पारंपरिक परिधान (शेरवानी, बंदगला, रेशमी साड़ियाँ व लहंगे)।',
      },
      {
        question: 'क्या वाहन पार्किंग एवं आवागमन की व्यवस्था है?',
        answer: 'हाँ, मुख्य द्वार पर वैले पार्किंग उपलब्ध है तथा होटल एवं विवाह स्थल के मध्य चौबीसों घंटे वाहन सुविधा उपलब्ध रहेगी।',
      },
      {
        question: 'क्या बच्चों के लिए पृथक व्यवस्था है?',
        answer: 'बच्चों के लिए विशेष खेल क्षेत्र एवं रुचिकर भोजन का विशेष प्रबंध किया गया है।',
      },
      {
        question: 'खान-पान संबंधी विशेष व्यवस्था क्या है?',
        answer: 'सभी आयोजनों में शुद्ध शाकाहारी बहु-व्यंजन परोसे जाएँगे। जैन भोजन का पृथक काउंटर भी उपलब्ध रहेगा।',
      },
    ],

    // Shagun
    shagunSubtitle: '॥ शुभ शगुन एवं आशीर्वाद ॥',
    shagunTitle: 'शुभ शगुन एवं मंगल उपहार',
    shagunDescription: 'आपकी मंगलमय उपस्थिति और आशीर्वाद ही हमारे लिए सबसे अमूल्य उपहार है। जो परिजन व मित्र सस्नेह शगुन भेंट करना चाहते हैं:',
    shagunIbanLabel: 'डिजिटल शगुन / यूपीआई (UPI) एवं खाता विवरण',
    shagunAccountHolderLabel: 'खाताधारक',
    shagunCopyButton: 'खाता विवरण कॉपी करें',
    shagunCopiedButton: 'सस्नेह धन्यवाद सहित कॉपी हुआ!',

    // RSVP
    rsvpSubtitle: '॥ विवाह आमंत्रण स्वीकृति ॥',
    rsvpTitle: 'अपनी गरिमामयी उपस्थिति सुनिश्चित करें',
    rsvpDescription: 'सस्नेह करबद्ध निवेदन है कि अपनी उपस्थिति की पुष्टि करें ताकि हम आपकी मेहमान नवाज़ी का समुचित प्रबंध कर सकें।',
    rsvpNameLabel: 'अतिथि का पूरा नाम',
    rsvpNamePlaceholder: 'जैसे: श्री एवं श्रीमती आदित्य सिंघानिया',
    rsvpPhoneLabel: 'व्हाट्सएप संपर्क नंबर',
    rsvpPhonePlaceholder: '+91 98765 43210',
    rsvpAttendingOption: 'सप्रेम सहर्ष उपस्थित होंगे',
    rsvpDecliningOption: 'अपरिहार्य कारणवश सस्नेह शुभकामनाएँ प्रेषित',
    rsvpGuestCountLabel: 'उपस्थित होने वाले पारिवारिक सदस्यों की संख्या',
    rsvpDietaryLabel: 'विशेष आहार या आवागमन संबंधी आवश्यकता (ऐच्छिक)',
    rsvpDietaryPlaceholder: 'जैसे: जैन भोजन की आवश्यकता / एयरपोर्ट पिकअप',
    rsvpSubmitButton: 'उपस्थिति पुष्टि करें एवं वीआईपी पास प्राप्त करें',
    rsvpSubmittingButton: 'पुष्टि दर्ज की जा रही है...',
    rsvpSuccessTitle: 'उपस्थिति सप्रेम दर्ज हुई!',
    rsvpSuccessSubtitle: 'आपका डिजिटल प्रवेश पत्र तैयार हो गया है। हम आपके स्वागत हेतु प्रतीक्षारत हैं!',
    rsvpVipPassTitle: 'आधिकारिक शाही प्रवेश पत्र',

    // Footer
    footerShloka: '॥ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥',
    footerFamilies: 'ईश्वर की कृपा और आपके शुभाशीष से • शर्मा एवं मेहरा परिवार',
  },
};
