import { sendAdminNewOrderEmail } from '@/lib/email';
import { getSupabaseUserId } from '@/lib/supabase/get-user-id';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

type CheckoutBody = {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  deliveryType?: 'pickup' | 'shipping';
  deliveryLat?: number;
  deliveryLng?: number;
  deliveryAddressLabel?: string;
};

export async function POST(request: NextRequest) {
  const userId = await getSupabaseUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const customerName = body.customerName?.trim();
  const customerPhone = body.customerPhone?.trim();
  const customerEmail = body.customerEmail?.trim() || null;
  const deliveryType = body.deliveryType === 'pickup' ? 'pickup' : 'shipping';
  const deliveryLat = Number(body.deliveryLat);
  const deliveryLng = Number(body.deliveryLng);
  const deliveryAddressLabel = body.deliveryAddressLabel?.trim() || 'Location on map';

  if (!customerName || !customerPhone) {
    return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
  }
  if (!Number.isFinite(deliveryLat) || !Number.isFinite(deliveryLng)) {
    return NextResponse.json({ error: 'Please choose a location on the map' }, { status: 400 });
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
      status: 'placed',
      payment_status: 'pending',
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      delivery_type: deliveryType,
      delivery_lat: deliveryLat,
      delivery_lng: deliveryLng,
      delivery_address_label: deliveryAddressLabel,
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

  const orderId = order.id as string;

  const orderItemsPayload = safeItems.map((item) => ({
    order_id: orderId,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: Number(item.product?.price ?? 0),
  }));

  const { error: orderItemsError } = await admin.from('order_items').insert(orderItemsPayload);

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

  const adminEmail = process.env.ADMIN_ORDERS_EMAIL?.trim();
  if (adminEmail) {
    const lines = safeItems.map((item) => ({
      name: String(item.product?.name ?? 'Item'),
      qty: item.quantity,
      lineTotal: Math.round(Number(item.product?.price ?? 0) * item.quantity * 100) / 100,
    }));
    await sendAdminNewOrderEmail({
      to: adminEmail,
      orderId,
      customerName,
      customerPhone,
      customerEmail,
      totalKes: Math.round(subtotal * 100) / 100,
      lines,
      deliveryLabel: deliveryAddressLabel,
      deliveryType,
    });
  }

  return NextResponse.json({ orderId });
}
