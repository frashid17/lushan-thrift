import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseUserId } from '@/lib/supabase/get-user-id';
import { getPaymentSettings } from '@/lib/payment-settings';
import { productPrimaryImage } from '@/lib/product-images';
import type { Order, OrderItem } from '@/types/database';
import { CheckCircle2 } from 'lucide-react';
import { StorefrontPage } from '@/components/layout/StorefrontChrome';
import { formatKenyaDate } from '@/lib/datetime';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const userId = await getSupabaseUserId();
  if (!userId) redirect('/sign-in');

  const { orderId } = await searchParams;
  if (!orderId) {
    redirect('/orders');
  }

  const paymentSettings = await getPaymentSettings();
  const supabase = await createClient();

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', userId)
    .single();

  if (orderError || !orderData) {
    redirect('/orders');
  }

  const order = orderData as Order;
  const { data: items } = await supabase
    .from('order_items')
    .select('*, product:products(name, image_url, gallery_urls, category, size)')
    .eq('order_id', orderId);

  const orderItems =
    (items ?? []) as (OrderItem & {
      product?: {
        name: string;
        image_url: string;
        gallery_urls?: string[] | null;
        category: string;
        size: string;
      };
    })[];

  const total = Number(order.total);

  return (
    <StorefrontPage variant="narrow">
      <div className="overflow-hidden rounded-[1.75rem] border border-stone-200/90 bg-white shadow-lg ring-1 ring-stone-100/80 sm:rounded-[2rem]">
        <div className="relative border-b border-stone-100 bg-gradient-to-br from-amber-50/90 via-white to-stone-50 px-5 py-8 text-center sm:px-8">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-20%,rgba(251,191,36,0.2),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto flex max-w-lg flex-col items-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-sm ring-4 ring-white">
              <CheckCircle2 className="h-8 w-8" strokeWidth={2} aria-hidden />
            </span>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Order placed
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
              Pay with M-Pesa if you haven&apos;t already, then add your payment details on the order
              page.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="rounded-full bg-white/90 px-3 py-1 font-mono font-bold text-stone-900 shadow-sm ring-1 ring-stone-200/80">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <span className="text-stone-500">
                {formatKenyaDate(order.created_at)} <span className="text-stone-400">(EAT)</span>
              </span>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-amber-900">
                Payment pending
              </span>
            </div>
          </div>
        </div>

        <div className="border-b border-amber-100/80 bg-gradient-to-r from-amber-50/80 to-amber-100/30 px-5 py-5 sm:px-8">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-900/70">
            M-Pesa (Buy goods)
          </h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-amber-950/90">
            <li>
              Till / buy goods:{' '}
              <strong className="font-mono">{paymentSettings.mpesa_buy_goods}</strong>
            </li>
            <li>
              Name: <strong>{paymentSettings.mpesa_till_name}</strong>
            </li>
            <li>
              Amount: <strong>KES {total.toLocaleString()}</strong>
            </li>
          </ul>
        </div>

        {orderItems.length > 0 && (
          <div className="px-5 py-6 sm:px-8">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400">
              What you ordered
            </h2>
            <ul className="mt-4 space-y-4">
              {orderItems.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 border-b border-stone-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200/80">
                    {item.product && productPrimaryImage(item.product) && (
                      <Image
                        src={productPrimaryImage(item.product)}
                        alt={item.product.name ?? 'Item'}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stone-900">{item.product?.name ?? 'Product'}</p>
                    <p className="text-xs text-stone-500">
                      {item.product?.category} · {item.product?.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-mono text-sm font-bold tabular-nums text-stone-900">
                    KES {(Number(item.unit_price) * item.quantity).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-5 text-base font-bold text-stone-900">
              <span>Total to pay</span>
              <span className="font-mono tabular-nums">KES {total.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-stone-100 bg-stone-50/80 px-5 py-5 sm:flex-row sm:flex-wrap sm:justify-center sm:px-8">
          <Link
            href={`/orders/${order.id}`}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800 sm:w-auto"
          >
            Open order — add M-Pesa details
          </Link>
          <Link
            href="/orders"
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border-2 border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-white sm:w-auto"
          >
            My orders
          </Link>
          <Link
            href="/shop"
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border-2 border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-white sm:w-auto"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </StorefrontPage>
  );
}
