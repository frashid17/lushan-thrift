import { auth } from '@clerk/nextjs/server';
import { checkRole } from '@/lib/roles';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';
import type { ProductInsert } from '@/types/database';

export async function GET() {
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
}

export async function POST(request: NextRequest) {
  const isAdmin = await checkRole('admin');
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = (await request.json()) as ProductInsert;
  const { name, description, price, image_url, category, size, availability } = body;
  if (!name || price == null || !image_url || !category || !size) {
    return NextResponse.json(
      { error: 'Missing required fields: name, price, image_url, category, size' },
      { status: 400 }
    );
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      description: description ?? '',
      price: Number(price),
      image_url,
      category,
      size,
      availability: availability ?? true,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
