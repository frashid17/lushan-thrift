import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseUserId } from '@/lib/supabase/get-user-id';
import type { Order, OrderItem, Product } from '@/types/database';
import Link from 'next/link';
import { OrderMpesaForm } from '../OrderMpesaForm';

function paymentBadge(paymentStatus: string | undefined) {
  switch (paymentStatus) {
    case 'approved':
      return (
        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
          Payment approved
        </span>
      );
    case 'submitted':
      return (
        <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-900">
          Awaiting verification
        </span>
      );
    default:
      return (
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
          Payment pending
        </span>
      );
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await getSupabaseUserId();
  if (!userId) redirect('/sign-in');

  const { id } = await params;
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (orderError || !order) {
    notFound();
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*, product:products(*)')
    .eq('order_id', id);

  if (itemsError) {
    throw itemsError;
  }

  const orderTyped = order as Order;
  const orderItems = (items as (OrderItem & { product?: Product })[] | null) ?? [];
  const orderTotal = Number(orderTyped.total);
  const paymentStatus = orderTyped.payment_status ?? 'pending';
  const mapsHref =
    orderTyped.delivery_lat != null && orderTyped.delivery_lng != null
      ? `https://www.google.com/maps?q=${orderTyped.delivery_lat},${orderTyped.delivery_lng}`
      : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/orders" className="text-sm font-medium text-stone-600 hover:text-stone-900">
        ← Back to orders
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
          Order #{orderTyped.id.slice(0, 8).toUpperCase()}
        </h1>
        {paymentBadge(paymentStatus)}
      </div>
      <p className="mt-1 text-sm text-stone-600 sm:text-base">
        Placed on{' '}
        {new Date(orderTyped.created_at).toLocaleDateString('en-KE', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </p>

      <section className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-700 shadow-sm sm:p-6">
        <h2 className="font-semibold text-stone-900">Delivery &amp; contact</h2>
        <dl className="grid gap-2 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">Name</dt>
            <dd>{orderTyped.customer_name ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">Phone</dt>
            <dd>{orderTyped.customer_phone ?? '—'}</dd>
          </div>
          {orderTyped.customer_email && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">Email</dt>
              <dd>{orderTyped.customer_email}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">Option</dt>
            <dd className="capitalize">{orderTyped.delivery_type ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">Location</dt>
            <dd>
              {orderTyped.delivery_address_label ?? '—'}
              {mapsHref && (
                <>
                  {' '}
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-stone-900 underline"
                  >
                    Open in Maps
                  </a>
                </>
              )}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-stone-900">Order summary</p>
          <p className="text-sm font-semibold text-stone-900">KES {orderTotal.toLocaleString()}</p>
        </div>
        <div className="space-y-3">
          {orderItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b border-stone-100 pb-2 last:border-b-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-stone-900">{item.product?.name ?? 'Product'}</p>
                <p className="text-xs text-stone-500">
                  {item.product?.category} · {item.product?.size}
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="text-stone-500">x{item.quantity}</p>
                <p className="mt-1 font-semibold text-stone-900">
                  KES {(Number(item.unit_price) * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {paymentStatus === 'pending' && <OrderMpesaForm orderId={orderTyped.id} />}

        {paymentStatus === 'submitted' && (
          <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-950">
            <p className="font-medium">Payment details received</p>
            <p className="mt-1 text-xs">
              We&apos;re verifying your M-Pesa payment. You submitted details from{' '}
              <strong>{orderTyped.mpesa_sender_name ?? '—'}</strong>.
            </p>
          </div>
        )}

        {paymentStatus === 'approved' && (
          <p className="mt-4 text-sm text-stone-600">
            Payment confirmed. We&apos;ll prepare your order for{' '}
            {orderTyped.delivery_type === 'pickup' ? 'pickup' : 'delivery'}.
          </p>
        )}
      </section>
    </div>
  );
}
