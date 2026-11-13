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
    const slugs: string[] = slugsJson ? JSON.parse(slugsJson) : ['rohit-weds-priya'];
    const projects: WeddingProject[] = [];

    for (const slug of slugs) {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + slug);
      if (data) {
        projects.push(JSON.parse(data));
      } else if (slug === 'rohit-weds-priya') {
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
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + project.slug, JSON.stringify(project));
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + project.id, JSON.stringify(project));

    // Update list of slugs
    const slugsJson = localStorage.getItem(ALL_PROJECTS_KEY);
    const slugs: string[] = slugsJson ? JSON.parse(slugsJson) : ['rohit-weds-priya'];
    if (!slugs.includes(project.slug)) {
      slugs.push(project.slug);
      localStorage.setItem(ALL_PROJECTS_KEY, JSON.stringify(slugs));
    }
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
 * Dynamically parse client couple names from URL slug if not found in database.
 * Guarantees that client names like "Gourao" or "gourao-weds-riya" are ALWAYS respected!
 */
export function parseProjectFromSlug(slugOrId: string): WeddingProject {
  const clean = decodeURIComponent(slugOrId || '').toLowerCase().replace('/', '').trim();
  const normalized = clean.replace(/^client-/, '');
  let partner1 = 'Groom';
  let partner2 = 'Bride';
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
  } else if (!normalized.startsWith('wedding-invitation-') && normalized !== 'rohit-weds-priya') {
    partner1 = capitalizeName(normalized);
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
  const cleanKey = slugOrId.toLowerCase().replace('/', '').trim();

  // Try Firestore if configured
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'weddings', cleanKey);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const proj = snapshot.data() as WeddingProject;
        saveLocalProject(proj);
        return proj;
      }
    } catch (e) {
      console.warn('Firestore fetch failed, checking local state:', e);
    }
  }

  // 1. Check local store
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + cleanKey);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
  }

  // 2. Fetch from Next.js Server API
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/projects?slug=${encodeURIComponent(cleanKey)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.project) {
          saveLocalProject(json.project);
          return json.project;
        }
      }
    } catch {}
  }

  if (cleanKey === 'rohit-weds-priya' || cleanKey === 'client-rohit-priya') {
    return defaultWeddingProject;
  }

  const all = getLocalProjects();
  const match = all.find((p) => p.slug?.toLowerCase() === cleanKey || p.id?.toLowerCase() === cleanKey);
  if (match) return match;

  // 3. Smart reconstruction from slug if client created custom slug (e.g. "gourao", "gourao-weds-priya")
  if (cleanKey && !cleanKey.startsWith('wedding-invitation-')) {
    const reconstructed = parseProjectFromSlug(cleanKey);
    saveLocalProject(reconstructed);
    return reconstructed;
  }

  return null;
}

/**
 * Save or update a wedding project
 */
export async function saveWeddingProject(project: WeddingProject): Promise<void> {
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
 * Upload a media file or audio note to Firebase Storage or generate object URL
 */
export async function uploadMediaFile(file: File | Blob, storagePath: string): Promise<string> {
  if (isFirebaseConfigured && storage) {
    try {
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (e) {
      console.warn('Firebase Storage upload failed, creating object URL:', e);
    }
  }

  // Offline / development blob URL
  if (typeof window !== 'undefined') {
    return URL.createObjectURL(file);
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
