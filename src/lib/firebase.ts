import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { getStorage, FirebaseStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { WeddingProject, SongRequest, VoiceBlessing, GuestContact } from '../types/wedding';
import { defaultWeddingProject } from './mockData';
import { PRESSED_LOVE_TEMPLATES } from './pressedLoveTemplates';

// Firebase Client Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'wedding-saas.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'wedding-saas-platform',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'wedding-saas-platform.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1234567890:web:abcdef',
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (e) {
  console.warn('Firebase initialized in fallback mode', e);
}

export { app, db, storage };

// In-Memory & Local Storage Fallback Cache
const LOCAL_STORAGE_KEY_PREFIX = 'wedding_platform_project_';
const ALL_PROJECTS_KEY = 'wedding_platform_all_slugs';

function getLocalProjects(): WeddingProject[] {
  if (typeof window === 'undefined') return [defaultWeddingProject];
  try {
    const slugsJson = localStorage.getItem(ALL_PROJECTS_KEY);
    const slugs: string[] = slugsJson ? JSON.parse(slugsJson) : ['gourav-weds-priya'];
    const projects: WeddingProject[] = [];

    for (const slug of slugs) {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + slug);
      if (data) {
        projects.push(JSON.parse(data));
      } else if (slug === 'gourav-weds-priya') {
        projects.push(defaultWeddingProject);
        localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + slug, JSON.stringify(defaultWeddingProject));
      }
    }
    return projects.length > 0 ? projects : [defaultWeddingProject];
  } catch {
    return [defaultWeddingProject];
  }
}

function saveLocalProject(project: WeddingProject) {
  if (typeof window === 'undefined') return;
  try {
    const slugKey = project.slug ? project.slug.toLowerCase().trim() : '';
    const idKey = project.id ? project.id.toLowerCase().trim() : '';

    if (slugKey) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + slugKey, JSON.stringify(project));
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'client-' + slugKey, JSON.stringify(project));
    }
    if (idKey) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + idKey, JSON.stringify(project));
      const bareId = idKey.replace(/^client-/, '');
      if (bareId) {
        localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + bareId, JSON.stringify(project));
      }
    }
    // Also save under primary gourav and royal suite keys
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'gourav-weds-priya', JSON.stringify(project));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'client-gourav-priya', JSON.stringify(project));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'royal-heritage', JSON.stringify(project));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'wedding-invitation-royal-heritage', JSON.stringify(project));

    // Update list of slugs
    const slugsJson = localStorage.getItem(ALL_PROJECTS_KEY);
    const slugs: string[] = slugsJson ? JSON.parse(slugsJson) : ['gourav-weds-priya'];
    if (slugKey && !slugs.includes(slugKey)) {
      slugs.push(slugKey);
      localStorage.setItem(ALL_PROJECTS_KEY, JSON.stringify(slugs));
    }

    // Dispatch update notification across all listening tabs/components
    window.dispatchEvent(new CustomEvent('wedding_project_updated', { detail: project }));
  } catch (err) {
    console.error('Failed to save to local storage', err);
  }
}

function capitalizeName(str: string): string {
  if (!str) return '';
  return str
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Flexible wedding date parser that handles any user input:
 * "12 december", "12-12-2026", "2026-12-12", "12/12/2026", "12 Dec", "December 12, 2026"
 */
export function parseFlexibleWeddingDate(str?: string): string {
  if (!str) return '2026-12-12T12:00:00.000Z';
  const trimmed = str.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const parts = trimmed.split('T')[0].split('-');
    const y = parseInt(parts[0], 10);
    const m = parts[1].padStart(2, '0');
    const d = parts[2].padStart(2, '0');
    return `${y}-${m}-${d}T12:00:00.000Z`;
  }

  const dmyMatch = trimmed.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}T12:00:00.000Z`;
  }

  const monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
  ];
  const cleanStr = trimmed.toLowerCase().replace(/(st|nd|rd|th),?/g, '').replace(/,/g, ' ');
  const parts = cleanStr.split(/\s+/).filter(Boolean);
  let day = 12, month = 12, year = 2026;

  for (const part of parts) {
    const mIdx = monthNames.findIndex((m) => m === part || m.startsWith(part));
    if (mIdx >= 0) {
      month = mIdx + 1;
      continue;
    }
    const num = parseInt(part, 10);
    if (!isNaN(num)) {
      if (num > 1000) year = num;
      else if (num >= 1 && num <= 31) day = num;
    }
  }
  const sDay = String(day).padStart(2, '0');
  const sMonth = String(month).padStart(2, '0');
  return `${year}-${sMonth}-${sDay}T12:00:00.000Z`;
}

export function formatWeddingDateString(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    if (!isNaN(d.getTime())) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }
  } catch {}
  return 'Saturday, December 12, 2026';
}

/**
 * Dynamically parse client couple names from URL slug if not found in database.
 * Guarantees that client names like "Gourav" or "gourav-weds-priya" or "gourao" are ALWAYS respected!
 */
export function parseProjectFromSlug(slugOrId: string): WeddingProject {
  const clean = decodeURIComponent(slugOrId || '').toLowerCase().replace('/', '').trim();
  const normalized = clean.replace(/^client-/, '');
  let partner1 = 'Gourav';
  let partner2 = 'Priya';
  let suite = 'royal-heritage';

  if (normalized.startsWith('wedding-invitation-')) {
    const tmpl = normalized.replace('wedding-invitation-', '');
    if (tmpl === 'royal-heritage' || tmpl === 'zareqia-emerald' || PRESSED_LOVE_TEMPLATES[tmpl]) {
      suite = tmpl;
    }
  }

  if (normalized.includes('-weds-')) {
    const parts = normalized.split('-weds-');
    if (parts[0]) partner1 = capitalizeName(parts[0]);
    if (parts[1]) partner2 = capitalizeName(parts[1]);
  } else if (normalized.includes('_weds_')) {
    const parts = normalized.split('_weds_');
    if (parts[0]) partner1 = capitalizeName(parts[0]);
    if (parts[1]) partner2 = capitalizeName(parts[1]);
  } else if (normalized.includes('-and-')) {
    const parts = normalized.split('-and-');
    if (parts[0]) partner1 = capitalizeName(parts[0]);
    if (parts[1]) partner2 = capitalizeName(parts[1]);
  } else if (normalized.includes('_and_')) {
    const parts = normalized.split('_and_');
    if (parts[0]) partner1 = capitalizeName(parts[0]);
    if (parts[1]) partner2 = capitalizeName(parts[1]);
  } else if (normalized.includes('-ki-shaadi') || normalized.includes('_ki_shaadi')) {
    const groomPart = normalized.replace(/-ki-shaadi|_ki_shaadi/, '');
    if (groomPart) partner1 = capitalizeName(groomPart);
  } else if (!normalized.startsWith('wedding-invitation-') && normalized !== 'gourav-weds-priya' && normalized !== 'rohit-weds-priya') {
    partner1 = capitalizeName(normalized);
  } else if (normalized === 'rohit-weds-priya' || normalized === 'rohit') {
    partner1 = 'Rohit Sharma';
    partner2 = 'Priya Mehra';
  }

  return {
    ...defaultWeddingProject,
    id: `client-${clean}`,
    slug: clean,
    partner1,
    partner2,
    formalTitle: `The Royal Wedding Celebrations of ${partner1} & ${partner2}`,
    suite,
    template: suite,
    story: [
      {
        id: 'st-1',
        year: '2023',
        title: 'The First Magical Encounter',
        description: `What began as a chance conversation turned into hours of laughter and dreams of the future between ${partner1} and ${partner2}.`,
        imageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'st-2',
        year: '2024',
        title: 'The Starlight Journey',
        description: `Travelling under a canopy of stars, ${partner1} and ${partner2} realized their favorite destination in the world was simply wherever they were together.`,
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'st-3',
        year: '2025',
        title: 'The Auspicious Proposal',
        description: `Surrounded by floating diyas and gentle waters, ${partner1} asked ${partner2} for a lifetime of love and togetherness.`,
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      },
    ],
    trivia: [
      {
        id: 'tr-1',
        question: 'Who took the initiative to say "I love you" first?',
        options: [`${partner1} with a smile`, `${partner2} with joy`, 'Both blurted it out together!', 'Their friends set them up'],
        correctIndex: 2,
        explanation: 'They spoke the words at the exact same moment under the evening sky!',
      },
      {
        id: 'tr-2',
        question: `What is ${partner1}’s all-time favorite meal that ${partner2} makes?`,
        options: ['Traditional Biryani', 'Homestyle Comfort Dal', 'Special Chai & Samosas', 'Sweet Kheer'],
        correctIndex: 1,
        explanation: `Homestyle food cooked with love is always ${partner1}'s favorite!`,
      },
      {
        id: 'tr-3',
        question: 'Where was their first spontaneous vacation together?',
        options: ['The Royal Hills', 'Scenic Coastal Beaches', 'Heritage Fort Palace', 'Misty Mountain Retreat'],
        correctIndex: 1,
        explanation: 'A spontaneous weekend getaway created unforgettable memories!',
      },
    ],
  };
}

/**
 * Fetch a wedding project by slug or client ID
 */
export async function getWeddingProject(slugOrId: string): Promise<WeddingProject | null> {
  const cleanKey = decodeURIComponent(slugOrId || '').toLowerCase().replace('/', '').trim();
  const bareSlug = cleanKey.replace(/^client-/, '');
  const lookupKeys = Array.from(new Set([cleanKey, bareSlug, `client-${bareSlug}`]));

  // Try Firestore if configured
  if (isFirebaseConfigured && db) {
    for (const key of lookupKeys) {
      try {
        const docRef = doc(db, 'weddings', key);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const proj = snapshot.data() as WeddingProject;
          saveLocalProject(proj);
          return proj;
        }
      } catch (e) {
        console.warn('Firestore fetch failed:', e);
      }
    }
  }

  // 1. Check local store across all lookup keys
  if (typeof window !== 'undefined') {
    for (const key of lookupKeys) {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (parsed && (parsed.partner1 || parsed.venue)) {
            if (parsed.weddingDate && parsed.weddingDate.includes('2027-11-20')) {
              parsed.weddingDate = '2026-12-12T12:00:00.000Z';
            }
            if (!parsed.backgroundAudioUrl) {
              parsed.backgroundAudioUrl = '/audio/royal-heritage-music.mp3';
            }
            return parsed;
          }
        } catch {}
      }
    }
  }

  // 2. Fetch from Next.js Server API across lookup keys
  if (typeof window !== 'undefined') {
    for (const key of [cleanKey, bareSlug]) {
      try {
        const res = await fetch(`/api/projects?slug=${encodeURIComponent(key)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.project) {
            if (json.project.weddingDate && json.project.weddingDate.includes('2027-11-20')) {
              json.project.weddingDate = '2026-12-12T12:00:00.000Z';
            }
            if (!json.project.backgroundAudioUrl) {
              json.project.backgroundAudioUrl = '/audio/royal-heritage-music.mp3';
            }
            saveLocalProject(json.project);
            return json.project;
          }
        }
      } catch {}
    }
  }

  // 3. Check in getLocalProjects() list
  const all = getLocalProjects();
  const match = all.find((p) => {
    const pSlug = p.slug?.toLowerCase().trim();
    const pId = p.id?.toLowerCase().trim();
    return lookupKeys.includes(pSlug) || lookupKeys.includes(pId);
  });
  if (match) {
    if (match.weddingDate && match.weddingDate.includes('2027-11-20')) {
      match.weddingDate = '2026-12-12T12:00:00.000Z';
    }
    if (!match.backgroundAudioUrl) {
      match.backgroundAudioUrl = '/audio/royal-heritage-music.mp3';
    }
    return match;
  }

  // 4. Default project fallback if Gourav or primary couple
  if (cleanKey === 'gourav-weds-priya' || cleanKey === 'client-gourav-priya' || cleanKey === 'gourav') {
    return defaultWeddingProject;
  }

  // 5. Smart reconstruction from slug (e.g. "gourav", "gourao", "gourav-weds-priya")
  const reconstructed = parseProjectFromSlug(cleanKey);
  saveLocalProject(reconstructed);
  return reconstructed;
}

/**
 * Save or update a wedding project
 */
export async function saveWeddingProject(project: WeddingProject): Promise<void> {
  // Normalize wedding date
  const normalizedDate = parseFlexibleWeddingDate(project.weddingDate);
  project.weddingDate = normalizedDate;
  const formattedDateStr = formatWeddingDateString(normalizedDate);

  // Audio track synchronization
  if (!project.backgroundAudioUrl && project.customization?.musicTrackUrl) {
    project.backgroundAudioUrl = project.customization.musicTrackUrl;
  } else if (!project.backgroundAudioUrl) {
    project.backgroundAudioUrl = '/audio/royal-heritage-music.mp3';
  }

  // Ensure venue object has complete fields and is synchronized with customization
  if (project.venue) {
    if (project.venue.coordinates && project.venue.coordinates.lat && project.venue.coordinates.lng) {
      project.venue.googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${project.venue.coordinates.lat.toFixed(6)},${project.venue.coordinates.lng.toFixed(6)}`;
    } else if (!project.venue.googleMapsLink || project.venue.googleMapsLink.includes('The+Oberoi+Udaivilas')) {
      project.venue.googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        (project.venue.name || 'Royal Venue') + ' ' + (project.venue.fullAddress || project.venue.city || '')
      )}`;
    }
    if (project.customization?.sections?.venue) {
      project.customization.sections.venue.venueName = project.venue.name;
      project.customization.sections.venue.venueCity = project.venue.city;
      project.customization.sections.venue.venueAddress = project.venue.fullAddress;
      project.customization.sections.venue.googleMapsLink = project.venue.googleMapsLink;
      project.customization.sections.venue.coordinates = project.venue.coordinates;
    }
  }

  // Ensure scratch card reflects the normalized wedding date
  if (project.customization?.sections?.scratchCard) {
    project.customization.sections.scratchCard.secretDateText = formattedDateStr;
  }

  // Ensure musicTrackUrl matches
  if (project.customization) {
    project.customization.musicTrackUrl = project.backgroundAudioUrl;
  }

  // Synchronize events relative to the wedding date & venue
  if (Array.isArray(project.events) && project.events.length > 0) {
    const d = new Date(normalizedDate);
    const dayMs = 24 * 60 * 60 * 1000;
    project.events = project.events.map((ev, idx) => {
      let offsetDays = 0;
      const titleLower = (ev.title || '').toLowerCase();
      if (titleLower.includes('haldi')) offsetDays = -2;
      else if (titleLower.includes('sangeet') || titleLower.includes('mehendi')) offsetDays = -1;
      else if (titleLower.includes('phera') || titleLower.includes('wedding')) offsetDays = 0;
      else if (titleLower.includes('reception') || titleLower.includes('gala')) offsetDays = 1;
      else offsetDays = idx === 0 ? -2 : idx === 1 ? -1 : idx === 2 ? 0 : 1;

      const evDate = new Date(d.getTime() + offsetDays * dayMs);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const computedDate = `${days[evDate.getDay()]}, ${months[evDate.getMonth()]} ${evDate.getDate()}, ${evDate.getFullYear()}`;

      let evAddress = ev.address;
      if (!evAddress || evAddress.includes('Oberoi Udaivilas') || evAddress.includes('Lake Pichola Terrace')) {
        evAddress = project.venue?.fullAddress || project.venue?.name || ev.address;
      }

      return {
        ...ev,
        date: computedDate,
        address: evAddress,
        googleMapsLink: project.venue?.googleMapsLink || ev.googleMapsLink || '',
      };
    });
  }

  saveLocalProject(project);

  // Sync to Server API
  if (typeof window !== 'undefined') {
    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
    } catch (e) {
      console.warn('Server API save failed, saved locally:', e);
    }
  }

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'weddings', project.slug), project, { merge: true });
      await setDoc(doc(db, 'weddings', project.id), project, { merge: true });
    } catch (e) {
      console.warn('Firestore save failed, saved locally:', e);
    }
  }
}

/**
 * Delete a wedding project
 */
export async function deleteWeddingProject(slug: string): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + slug);
      const slugsJson = localStorage.getItem(ALL_PROJECTS_KEY);
      if (slugsJson) {
        const slugs: string[] = JSON.parse(slugsJson);
        const filtered = slugs.filter((s) => s !== slug);
        localStorage.setItem(ALL_PROJECTS_KEY, JSON.stringify(filtered));
      }
    } catch (e) {
      console.error('Failed to remove local project', e);
    }
  }
}

/**
 * Fetch all wedding projects for Super Admin Panel
 */
export async function getAllProjects(): Promise<WeddingProject[]> {
  // 1. Try Server API first
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.projects) && json.projects.length > 0) {
          const localList = getLocalProjects();
          const combined = [...json.projects];
          for (const lp of localList) {
            if (!combined.some((cp) => cp.slug === lp.slug)) {
              combined.push(lp);
            }
          }
          return combined;
        }
      }
    } catch {}
  }

  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'weddings');
      const snap = await getDocs(colRef);
      const list: WeddingProject[] = [];
      snap.forEach((d) => {
        const item = d.data() as WeddingProject;
        if (!list.some((p) => p.id === item.id)) {
          list.push(item);
        }
      });
      if (list.length > 0) return list;
    } catch (e) {
      console.warn('Firestore query failed, using local list:', e);
    }
  }

  return getLocalProjects();
}

/**
 * Upload a media file or audio note to Next.js /api/upload, Firebase Storage, or fallback base64
 */
export async function uploadMediaFile(file: File | Blob, storagePath?: string): Promise<string> {
  // 1. Primary: Next.js API /api/upload (Permanent static URL served from /uploads/...)
  if (typeof window !== 'undefined') {
    try {
      const formData = new FormData();
      const fileName = (file as File).name || `media-${Date.now()}.${file.type.includes('audio') ? 'mp3' : 'jpg'}`;
      formData.append('file', file, fileName);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.url) {
          return result.url;
        }
      }
    } catch (e) {
      console.warn('API /api/upload failed, trying fallback:', e);
    }
  }

  // 2. Firebase Storage if configured
  if (isFirebaseConfigured && storage && storagePath) {
    try {
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (e) {
      console.warn('Firebase Storage upload failed:', e);
    }
  }

  // 3. Fallback: Base64 Data URL (persists in storage, unlike temporary revoked blob URLs)
  if (typeof window !== 'undefined' && typeof FileReader !== 'undefined') {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  return '';
}

/**
 * Guest adds a DJ song request
 */
export async function addDjSongRequest(slugOrId: string, song: SongRequest): Promise<void> {
  const project = await getWeddingProject(slugOrId);
  if (!project) return;

  const updatedPlaylist = [song, ...project.djPlaylist];
  const updatedProject = { ...project, djPlaylist: updatedPlaylist };
  await saveWeddingProject(updatedProject);
}

/**
 * Guest records and submits a voice blessing
 */
export async function addVoiceBlessing(slugOrId: string, blessing: VoiceBlessing): Promise<void> {
  const project = await getWeddingProject(slugOrId);
  if (!project) return;

  const updatedBlessings = [blessing, ...project.blessings];
  const updatedProject = { ...project, blessings: updatedBlessings };
  await saveWeddingProject(updatedProject);
}

/**
 * Update guest RSVP from microsite
 */
export async function updateGuestRsvp(
  slugOrId: string,
  guestName: string,
  phone: string,
  status: 'attending' | 'declined',
  count: number,
  dietaryChoice: string
): Promise<void> {
  const project = await getWeddingProject(slugOrId);
  if (!project) return;

  const existingGuestIndex = project.guests.findIndex(
    (g) => g.name.toLowerCase() === guestName.toLowerCase() || (phone && g.phone === phone)
  );

  let updatedGuests = [...project.guests];
  if (existingGuestIndex >= 0) {
    updatedGuests[existingGuestIndex] = {
      ...updatedGuests[existingGuestIndex],
      rsvpStatus: status,
      attendingCount: count,
      dietaryChoice: dietaryChoice,
    };
  } else {
    updatedGuests.push({
      id: `g-${Date.now()}`,
      name: guestName,
      phone: phone || '',
      sentWhatsApp: false,
      rsvpStatus: status,
      attendingCount: count,
      dietaryChoice: dietaryChoice,
    });
  }

  const updatedProject = { ...project, guests: updatedGuests };
  await saveWeddingProject(updatedProject);
}

/**
 * Mark WhatsApp invite as sent
 */
export async function markWhatsAppSent(slugOrId: string, guestId: string): Promise<void> {
  const project = await getWeddingProject(slugOrId);
  if (!project) return;

  const updatedGuests = project.guests.map((g) => {
    if (g.id === guestId) {
      return {
        ...g,
        sentWhatsApp: true,
        sentAt: new Date().toISOString().split('T')[0],
      };
    }
    return g;
  });

  const updatedProject = { ...project, guests: updatedGuests };
  await saveWeddingProject(updatedProject);
}
