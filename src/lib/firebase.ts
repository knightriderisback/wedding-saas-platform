import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { getStorage, FirebaseStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { WeddingProject, SongRequest, VoiceBlessing, GuestContact } from '../types/wedding';
import { defaultWeddingProject } from './mockData';

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

/**
 * Fetch a wedding project by slug or client ID
 */
export async function getWeddingProject(slugOrId: string): Promise<WeddingProject | null> {
  const cleanKey = slugOrId.replace('/', '').trim();

  // Try Firestore if configured
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'weddings', cleanKey);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as WeddingProject;
      }
    } catch (e) {
      console.warn('Firestore fetch failed, checking local state:', e);
    }
  }

  // Fallback to local store
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + cleanKey);
    if (local) {
      return JSON.parse(local);
    }
  }

  if (cleanKey === 'rohit-weds-priya' || cleanKey === 'client-rohit-priya') {
    return defaultWeddingProject;
  }

  const all = getLocalProjects();
  const match = all.find((p) => p.slug === cleanKey || p.id === cleanKey);
  return match || null;
}

/**
 * Save or update a wedding project
 */
export async function saveWeddingProject(project: WeddingProject): Promise<void> {
  saveLocalProject(project);

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
