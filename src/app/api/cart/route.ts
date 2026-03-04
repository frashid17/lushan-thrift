import { getSupabaseUserId } from '@/lib/supabase/get-user-id';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const userId = await getSupabaseUserId();
  if (!userId) return NextResponse.json({ items: [] });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, product:products(*)')
    .eq('user_id', userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: NextRequest) {
  const userId = await getSupabaseUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { product_id, quantity = 1 } = await request.json();
  if (!product_id) return NextResponse.json({ error: 'product_id required' }, { status: 400 });

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('product_id', product_id)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select('*, product:products(*)')
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  const { data, error } = await supabase
    .from('cart_items')
    .insert({ user_id: userId, product_id, quantity })
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
  await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  const userId = await getSupabaseUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { product_id, quantity } = await request.json();
  if (!product_id || quantity == null)
    return NextResponse.json({ error: 'product_id and quantity required' }, { status: 400 });

  const supabase = await createClient();
  if (quantity < 1) {
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', product_id);
    return NextResponse.json({ success: true });
  }

  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('user_id', userId)
    .eq('product_id', product_id)
    .select('*, product:products(*)')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
