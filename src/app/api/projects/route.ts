import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { WeddingProject } from '@/types/wedding';
import { defaultWeddingProject } from '@/lib/mockData';

const TMP_FILE = path.join('/tmp', 'wedding_platform_projects.json');

// In-memory cache for ultra-fast response
const memoryProjects: Map<string, WeddingProject> = new Map();

// Initialize with default project
memoryProjects.set(defaultWeddingProject.slug, defaultWeddingProject);
memoryProjects.set(defaultWeddingProject.id, defaultWeddingProject);

function loadFromFile() {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const data = fs.readFileSync(TMP_FILE, 'utf-8');
      const parsed: WeddingProject[] = JSON.parse(data);
      for (const p of parsed) {
        if (p.slug) memoryProjects.set(p.slug.toLowerCase(), p);
        if (p.id) memoryProjects.set(p.id.toLowerCase(), p);
      }
    }
  } catch (err) {
    console.warn('Could not read from /tmp storage:', err);
  }
}

function saveToFile() {
  try {
    const list = Array.from(new Set(Array.from(memoryProjects.values())));
    fs.writeFileSync(TMP_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to /tmp storage:', err);
  }
}

// Initial load
loadFromFile();

export async function GET(req: NextRequest) {
  loadFromFile();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const cleanSlug = slug.toLowerCase().replace('/', '').trim();
    const project = memoryProjects.get(cleanSlug);
    if (project) {
      return NextResponse.json({ success: true, project });
    }
    // Search by partial match or id
    for (const p of Array.from(memoryProjects.values())) {
      if (p.slug?.toLowerCase() === cleanSlug || p.id?.toLowerCase() === cleanSlug) {
        return NextResponse.json({ success: true, project: p });
      }
    }
    return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
  }

  // Return all projects deduplicated
  const allProjects = Array.from(new Set(Array.from(memoryProjects.values())));
  return NextResponse.json({ success: true, projects: allProjects });
}

export async function POST(req: NextRequest) {
  try {
    const body: WeddingProject = await req.json();
    if (!body || !body.slug) {
      return NextResponse.json({ success: false, error: 'Missing slug' }, { status: 400 });
    }

    const cleanSlug = body.slug.toLowerCase().trim();
    const cleanId = (body.id || `client-${cleanSlug}`).toLowerCase().trim();

    memoryProjects.set(cleanSlug, body);
    memoryProjects.set(cleanId, body);
    saveToFile();

    return NextResponse.json({ success: true, project: body });
  } catch (err) {
    console.error('Error saving project:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
