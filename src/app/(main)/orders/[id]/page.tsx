import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseUserId } from '@/lib/supabase/get-user-id';
import { productPrimaryImage } from '@/lib/product-images';
import type { Order, OrderItem, Product } from '@/types/database';
import { OrderMpesaForm } from '../OrderMpesaForm';
import {
  StorefrontBackLink,
  StorefrontPage,
  StorefrontPanel,
} from '@/components/layout/StorefrontChrome';
import { formatKenyaDateTime } from '@/lib/datetime';
import { MapPin, Package, Sparkles } from 'lucide-react';

function paymentBadge(paymentStatus: string | undefined) {
  switch (paymentStatus) {
    case 'approved':
      return (
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-900">
          Payment approved
        </span>
      );
    case 'submitted':
      return (
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-900">
          Awaiting verification
        </span>
      );
    default:
      return (
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-900">
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

  const shortId = orderTyped.id.slice(0, 8).toUpperCase();

  return (
    <StorefrontPage variant="narrow">
      <StorefrontBackLink href="/orders">All orders</StorefrontBackLink>

      <div className="relative mb-8 overflow-hidden rounded-[1.75rem] border border-stone-200/90 bg-gradient-to-br from-amber-50/95 via-white to-stone-100/90 p-6 shadow-md ring-1 ring-stone-100/80 sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500">Your order</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              #{shortId}
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Placed {formatKenyaDateTime(orderTyped.created_at)} <span className="text-stone-400">(EAT)</span>
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            {paymentBadge(paymentStatus)}
            <p className="font-mono text-2xl font-bold tabular-nums text-stone-900 sm:text-3xl">
              KES {orderTotal.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <StorefrontPanel className="mb-6" padding="p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400">
          <MapPin className="h-3.5 w-3.5 text-amber-600" aria-hidden />
          Delivery &amp; contact
        </h2>
        <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-stone-50/80 p-4 ring-1 ring-stone-100">
            <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">Name</dt>
            <dd className="mt-1 font-medium text-stone-900">{orderTyped.customer_name ?? '—'}</dd>
          </div>
          <div className="rounded-xl bg-stone-50/80 p-4 ring-1 ring-stone-100">
            <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">Phone</dt>
            <dd className="mt-1 font-medium text-stone-900">{orderTyped.customer_phone ?? '—'}</dd>
          </div>
          {orderTyped.customer_email && (
            <div className="rounded-xl bg-stone-50/80 p-4 ring-1 ring-stone-100 sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">Email</dt>
              <dd className="mt-1 font-medium text-stone-900">{orderTyped.customer_email}</dd>
            </div>
          )}
          <div className="rounded-xl bg-stone-50/80 p-4 ring-1 ring-stone-100">
            <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">Option</dt>
            <dd className="mt-1 capitalize font-medium text-stone-900">{orderTyped.delivery_type ?? '—'}</dd>
          </div>
          <div className="rounded-xl bg-stone-50/80 p-4 ring-1 ring-stone-100 sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">Location</dt>
            <dd className="mt-1 font-medium text-stone-900">
              {orderTyped.delivery_address_label ?? '—'}
              {mapsHref && (
                <>
                  {' '}
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-amber-800 underline decoration-amber-300 underline-offset-2 hover:text-amber-950"
                  >
                    Open in Maps
                  </a>
                </>
              )}
            </dd>
          </div>
        </dl>
      </StorefrontPanel>

      <StorefrontPanel padding="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-stone-900">
            <Package className="h-5 w-5 text-stone-500" aria-hidden />
            Items
          </h2>
          <p className="font-mono text-sm font-bold tabular-nums text-stone-600">
            {orderItems.length} line{orderItems.length === 1 ? '' : 's'}
          </p>
        </div>
        <ul className="mt-5 space-y-4">
          {orderItems.map((item) => {
            const img = item.product ? productPrimaryImage(item.product) : '';
            return (
              <li
                key={item.id}
                className="flex gap-4 rounded-2xl border border-stone-100 bg-stone-50/40 p-3 ring-1 ring-stone-100/60 sm:p-4"
              >
                <Link
                  href={item.product?.id ? `/shop/${item.product.id}` : '/shop'}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200/80 sm:h-24 sm:w-24"
                >
                  {img ? (
                    <Image src={img} alt={item.product?.name ?? 'Product'} fill className="object-cover" sizes="96px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-stone-400">No image</div>
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={item.product?.id ? `/shop/${item.product.id}` : '/shop'}
                    className="font-semibold text-stone-900 hover:underline"
                  >
                    {item.product?.name ?? 'Product'}
                  </Link>
                  <p className="mt-1 text-xs text-stone-500">
                    {item.product?.category} · {item.product?.size}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-stone-600 ring-1 ring-stone-200">
                      Qty {item.quantity}
                    </span>
                    <p className="font-mono text-sm font-bold tabular-nums text-stone-900">
                      KES {(Number(item.unit_price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-5">
          <span className="text-sm font-semibold text-stone-600">Order total</span>
          <p className="font-mono text-xl font-bold tabular-nums text-stone-900">
            KES {orderTotal.toLocaleString()}
          </p>
        </div>

        {paymentStatus === 'pending' && (
          <div className="mt-8 border-t border-stone-100 pt-8">
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-stone-800">
              <Sparkles className="h-4 w-4 text-amber-600" aria-hidden />
              Complete payment
            </p>
            <OrderMpesaForm orderId={orderTyped.id} />
          </div>
        )}

        {paymentStatus === 'submitted' && (
          <div className="mt-8 rounded-2xl border border-sky-200 bg-sky-50/80 px-5 py-4 text-sm text-sky-950">
            <p className="font-semibold">Payment details received</p>
            <p className="mt-2 text-xs leading-relaxed text-sky-900/90">
              We&apos;re verifying your M-Pesa payment. You submitted details from{' '}
              <strong>{orderTyped.mpesa_sender_name ?? '—'}</strong>. We&apos;ll email you when it&apos;s
              confirmed.
            </p>
          </div>
        )}

        {paymentStatus === 'approved' && (
          <p className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-4 text-sm text-emerald-950">
            <span className="font-semibold">Payment confirmed.</span> We&apos;ll prepare your order for{' '}
            {orderTyped.delivery_type === 'pickup' ? 'pickup' : 'delivery'}.
          </p>
        )}
      </StorefrontPanel>

      <div className="mt-10 text-center">
        <Link
          href="/shop"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-stone-900 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800"
        >
          Continue shopping
        </Link>
      </div>
    </StorefrontPage>
  );
}
