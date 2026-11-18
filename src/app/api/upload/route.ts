import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads directory for static serving
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Determine safe extension
    let ext = path.extname(file.name || '');
    if (!ext) {
      if (file.type?.includes('audio') || file.type?.includes('mp3') || file.type?.includes('mpeg')) {
        ext = '.mp3';
      } else if (file.type?.includes('png')) {
        ext = '.png';
      } else if (file.type?.includes('webp')) {
        ext = '.webp';
      } else {
        ext = '.jpg';
      }
    }

    const safeStem = (file.name || 'upload')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 30);
    const uniqueFileName = `${Date.now()}-${safeStem}${ext}`;
    const targetPath = path.join(uploadsDir, uniqueFileName);

    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: file.name,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error: any) {
    console.error('Server upload error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Upload processing failed' },
      { status: 500 }
    );
  }
}
