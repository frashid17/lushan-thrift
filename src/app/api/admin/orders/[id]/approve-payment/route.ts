import { sendCustomerPaymentApprovedEmail } from '@/lib/email';
import { checkRole } from '@/lib/roles';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await checkRole('admin');
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id: orderId } = await params;
  const admin = createAdminClient();

  const { data: order, error: fetchErr } = await admin.from('orders').select('*').eq('id', orderId).single();

  if (fetchErr || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const paymentStatus = (order as { payment_status: string }).payment_status;
  if (paymentStatus !== 'submitted') {
    return NextResponse.json(
      { error: 'Only orders awaiting verification can be approved' },
      { status: 400 }
    );
  }

  const { error: updateErr } = await admin
    .from('orders')
    .update({ payment_status: 'approved' })
    .eq('id', orderId);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  const o = order as {
    customer_email: string | null;
    user_id: string;
  };

  /** Checkout email first (what the customer typed); fallback for legacy orders without it. */
  let accountEmail: string | null = null;
  const checkoutEmail = o.customer_email?.trim() || null;
  if (!checkoutEmail) {
    const { data: userRow } = await admin.from('users').select('email').eq('id', o.user_id).single();
    if (userRow?.email) accountEmail = userRow.email.trim();
  }
  const notifyTo = checkoutEmail || accountEmail;

  if (notifyTo) {
    try {
      await sendCustomerPaymentApprovedEmail({
        to: notifyTo,
        orderId,
        emailSource: checkoutEmail ? 'checkout' : 'account',
      });
    } catch (err) {
      console.error('[approve-payment] Customer confirmation email failed:', err);
    }
  } else {
    console.warn('[approve-payment] No customer_email or user email; skipped payment-approved email', {
      orderId,
    });
  }

  return NextResponse.json({ ok: true });
}
