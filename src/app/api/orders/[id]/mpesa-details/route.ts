import { sendAdminMpesaSubmittedEmail } from '@/lib/email';
import { getSupabaseUserId } from '@/lib/supabase/get-user-id';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSupabaseUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: orderId } = await params;
  const body = (await request.json()) as { mpesaMessage?: string; mpesaSenderName?: string };
  const mpesaMessage = body.mpesaMessage?.trim();
  const mpesaSenderName = body.mpesaSenderName?.trim();
  if (!mpesaMessage || !mpesaSenderName) {
    return NextResponse.json({ error: 'M-Pesa message and name on M-Pesa are required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: order, error: fetchErr } = await supabase
    .from('orders')
    .select('id, user_id, payment_status, customer_name')
    .eq('id', orderId)
    .eq('user_id', userId)
    .single();

  if (fetchErr || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (order.payment_status !== 'pending') {
    return NextResponse.json(
      { error: 'M-Pesa details can only be submitted while payment is pending' },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { error: updateErr } = await admin
    .from('orders')
    .update({
      mpesa_message: mpesaMessage,
      mpesa_sender_name: mpesaSenderName,
      payment_status: 'submitted',
    })
    .eq('id', orderId)
    .eq('user_id', userId);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  const adminEmail = process.env.ADMIN_ORDERS_EMAIL?.trim();
  if (adminEmail) {
    await sendAdminMpesaSubmittedEmail({
      to: adminEmail,
      orderId,
      mpesaMessage,
      mpesaSenderName,
      customerName: order.customer_name ?? 'Customer',
    });
  }

  return NextResponse.json({ ok: true });
}
