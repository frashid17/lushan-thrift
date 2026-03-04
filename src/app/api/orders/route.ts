import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseUserId } from '@/lib/supabase/get-user-id';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(_req: NextRequest) {
  const userId = await getSupabaseUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: items, error: itemsError } = await supabase
    .from('cart_items')
    .select('*, product:products(*)')
    .eq('user_id', userId);

  if (itemsError) {
    return NextResponse.json(
      { error: 'Failed to load cart: ' + itemsError.message },
      { status: 500 }
    );
  }

  const safeItems = items ?? [];
  if (!safeItems.length) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const subtotal = safeItems.reduce(
    (sum, item) => sum + Number(item.product?.price ?? 0) * item.quantity,
    0
  );

  const admin = createAdminClient();

  const { data: order, error: orderError } = await admin
    .from('orders')
    .insert({
      user_id: userId,
      total: Math.round(subtotal * 100) / 100,
      status: 'paid_simulated',
    })
    .select('id')
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      {
        error: orderError?.message ?? 'Failed to create order',
        code: orderError?.code,
      },
      { status: 500 }
    );
  }

  const orderItemsPayload = safeItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: Number(item.product?.price ?? 0),
  }));

  const { error: orderItemsError } = await admin
    .from('order_items')
    .insert(orderItemsPayload);

  if (orderItemsError) {
    return NextResponse.json(
      {
        error: 'Failed to save order items: ' + orderItemsError.message,
        code: orderItemsError?.code,
      },
      { status: 500 }
    );
  }

  await admin.from('cart_items').delete().eq('user_id', userId);

  return NextResponse.json({ orderId: order.id });
}

