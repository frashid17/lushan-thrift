import { auth } from '@clerk/nextjs/server';
import { checkRole } from '@/lib/roles';
import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const isAdmin = await checkRole('admin');
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await auth();

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
  }

  const timestamp = Math.round(Date.now() / 1000).toString();
  const params = `folder=lushan-thrift&timestamp=${timestamp}`;
  const signature = createHash('sha1').update(params + apiSecret).digest('hex');

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const body = new FormData();
  body.append('file', new Blob([buffer], { type: file.type }), file.name);
  body.append('api_key', apiKey);
  body.append('timestamp', timestamp);
  body.append('signature', signature);
  body.append('folder', 'lushan-thrift');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[upload] Cloudinary error', res.status, err.slice(0, 500));
    return NextResponse.json({ error: 'Upload failed' }, { status: 502 });
  }
  const data = (await res.json()) as { secure_url: string };
  return NextResponse.json({ url: data.secure_url });
}
