import { checkRole } from '@/lib/roles';
import { normalizeGalleryUrls } from '@/lib/product-images';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';
import type { ProductInsert } from '@/types/database';

export async function GET() {
  try {
    const isAdmin = await checkRole('admin');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[GET /api/admin/products]', err);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkRole('admin');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = (await request.json()) as ProductInsert & { gallery_urls?: unknown };
    const { name, description, price, category, size, availability } = body;
    const gallery = normalizeGalleryUrls(body.gallery_urls);
    const legacyPrimary =
      typeof body.image_url === 'string' && body.image_url.trim() ? body.image_url.trim() : '';
    const urls = gallery ?? (legacyPrimary ? [legacyPrimary] : null);
    if (!name || price == null || !category || !size || !urls?.length) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: name, price, category, size, and at least one product image (gallery_urls or image_url)',
        },
        { status: 400 }
      );
    }
    const primary = urls[0];
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        description: description ?? '',
        price: Number(price),
        image_url: primary,
        gallery_urls: urls,
        category,
        size,
        availability: availability ?? true,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[POST /api/admin/products]', err);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
