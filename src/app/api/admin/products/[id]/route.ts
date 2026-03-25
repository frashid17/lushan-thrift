import { checkRole } from '@/lib/roles';
import { normalizeGalleryUrls } from '@/lib/product-images';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';
import type { ProductUpdate } from '@/types/database';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await checkRole('admin');
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await params;
    const raw = (await request.json()) as ProductUpdate & { gallery_urls?: unknown };
    const { gallery_urls: _g, ...rest } = raw;
    const updates: Record<string, unknown> = { ...rest };
    const hasGalleryKey = Object.prototype.hasOwnProperty.call(raw, 'gallery_urls');
    const gallery = hasGalleryKey ? normalizeGalleryUrls(raw.gallery_urls) : null;
    if (hasGalleryKey) {
      if (!gallery) {
        return NextResponse.json({ error: 'gallery_urls must be a non-empty array of URLs' }, { status: 400 });
      }
      updates.image_url = gallery[0];
      updates.gallery_urls = gallery;
    } else if (typeof raw.image_url === 'string' && raw.image_url.trim()) {
      const u = raw.image_url.trim();
      updates.image_url = u;
      updates.gallery_urls = [u];
    }
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[PATCH /api/admin/products/:id]', err);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await checkRole('admin');
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await params;
    const supabase = createAdminClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/admin/products/:id]', err);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
