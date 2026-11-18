import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB ceiling

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.svg',
  '.mp3',
  '.wav',
  '.m4a',
  '.aac',
  '.ogg',
  '.webm',
  '.mp4',
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 15MB limit` },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads directory for static serving
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      await fs.promises.mkdir(uploadsDir, { recursive: true });
    }

    // Determine safe extension
    const rawExt = path.extname(file.name || '').toLowerCase();
    let ext = rawExt;
    if (!ext) {
      if (file.type?.includes('audio') || file.type?.includes('mp3') || file.type?.includes('mpeg')) {
        ext = '.mp3';
      } else if (file.type?.includes('webm')) {
        ext = '.webm';
      } else if (file.type?.includes('png')) {
        ext = '.png';
      } else if (file.type?.includes('webp')) {
        ext = '.webp';
      } else if (file.type?.includes('svg')) {
        ext = '.svg';
      } else {
        ext = '.jpg';
      }
    }

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { success: false, error: `Unsupported file type: ${ext}` },
        { status: 400 }
      );
    }

    // Prevent double-extension bug using path.basename with rawExt stripped
    const rawBaseName = path.basename(file.name || 'upload', rawExt);
    const safeStem = rawBaseName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30) || 'upload';
    const uniqueFileName = `${Date.now()}-${safeStem}${ext}`;
    const targetPath = path.join(uploadsDir, uniqueFileName);

    await fs.promises.writeFile(targetPath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: file.name,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
    });
  } catch (error: any) {
    console.error('Server upload error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Upload processing failed' },
      { status: 500 }
    );
  }
}
