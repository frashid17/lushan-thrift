import { getSupabaseUserId } from '@/lib/supabase/get-user-id';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const userId = await getSupabaseUserId();
  if (!userId) return NextResponse.json({ items: [] });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('wishlist')
    .select('*, product:products(*)')
    .eq('user_id', userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: NextRequest) {
  const userId = await getSupabaseUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { product_id } = await request.json();
  if (!product_id) return NextResponse.json({ error: 'product_id required' }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('wishlist')
    .upsert({ user_id: userId, product_id }, { onConflict: 'user_id,product_id' })
    .select('*, product:products(*)')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const userId = await getSupabaseUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product_id');
  if (!productId) return NextResponse.json({ error: 'product_id required' }, { status: 400 });

  const supabase = await createClient();
  await supabase.from('wishlist').delete().eq('user_id', userId).eq('product_id', productId);
  return NextResponse.json({ success: true });
}
