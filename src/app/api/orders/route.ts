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
  if (!customerEmail) {
    return NextResponse.json({ error: 'Email is required for order updates and payment confirmation' }, { status: 400 });
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail);
  if (!emailOk) {
    return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
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
    .select('id, created_at')
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
  const orderCreatedAt = String((order as { created_at?: string }).created_at ?? '');

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

  // Admin email is best-effort. SMTP failures on Vercel must not fail checkout after the
  // order exists — previously we cleared the cart before email, so a thrown send left the
  // user with an empty cart and a generic error.
  const adminEmail = process.env.ADMIN_ORDERS_EMAIL?.trim();
  if (!adminEmail) {
    console.warn(
      '[POST /api/orders] ADMIN_ORDERS_EMAIL is not set — no admin new-order email will be sent. Add it in Vercel → Settings → Environment Variables.'
    );
  } else {
    const lines = safeItems.map((item) => ({
      name: String(item.product?.name ?? 'Item'),
      qty: item.quantity,
      lineTotal: Math.round(Number(item.product?.price ?? 0) * item.quantity * 100) / 100,
    }));
    try {
      await sendAdminNewOrderEmail({
        to: adminEmail,
        orderId,
        placedAtIso: orderCreatedAt || new Date().toISOString(),
        customerName,
        customerPhone,
        customerEmail,
        totalKes: Math.round(subtotal * 100) / 100,
        lines,
        deliveryLabel: deliveryAddressLabel,
        deliveryType,
      });
    } catch (err) {
      console.error('[POST /api/orders] Admin new-order email failed', err);
    }
  }

  const { error: cartClearError } = await admin.from('cart_items').delete().eq('user_id', userId);
  if (cartClearError) {
    console.error('[POST /api/orders] Failed to clear cart after order', cartClearError);
  }

  return NextResponse.json({ orderId });
}
