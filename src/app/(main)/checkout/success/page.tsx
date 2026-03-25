import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseUserId } from '@/lib/supabase/get-user-id';
import { getPaymentSettings } from '@/lib/payment-settings';
import type { Order, OrderItem } from '@/types/database';

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
    .select('*, product:products(name, image_url, category, size)')
    .eq('order_id', orderId);

  const orderItems =
    (items ?? []) as (OrderItem & {
      product?: { name: string; image_url: string; category: string; size: string };
    })[];

  const total = Number(order.total);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 bg-stone-50 px-4 py-5 text-center sm:px-6">
          <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">Order placed</h1>
          <p className="mt-1 text-sm text-stone-600">
            Pay with M-Pesa if you haven&apos;t already, then add your payment details on the order page.
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
            <span className="font-mono font-semibold text-stone-900">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </span>
            <span className="text-stone-500">
              {new Date(order.created_at).toLocaleDateString('en-KE', {
                dateStyle: 'medium',
              })}
            </span>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
              Payment pending
            </span>
          </div>
        </div>

        <div className="border-b border-stone-100 bg-amber-50/60 px-4 py-4 sm:px-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-700">M-Pesa (Buy goods)</h2>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-stone-800">
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
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">What you ordered</h2>
            <ul className="mt-3 space-y-3">
              {orderItems.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 border-b border-stone-100 pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                    {item.product?.image_url && (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name ?? 'Item'}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-stone-900">{item.product?.name ?? 'Product'}</p>
                    <p className="text-xs text-stone-500">
                      {item.product?.category} · {item.product?.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-stone-900">
                    KES {(Number(item.unit_price) * item.quantity).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4 text-base font-semibold text-stone-900">
              <span>Total to pay</span>
              <span>KES {total.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-3 border-t border-stone-200 bg-stone-50 px-4 py-4 sm:flex-row sm:px-6">
          <Link
            href={`/orders/${order.id}`}
            className="inline-flex w-full items-center justify-center rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 sm:w-auto"
          >
            Open order — add M-Pesa details
          </Link>
          <Link
            href="/orders"
            className="inline-flex w-full items-center justify-center rounded-full border border-stone-300 px-6 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-100 sm:w-auto"
          >
            My orders
          </Link>
          <Link
            href="/shop"
            className="inline-flex w-full items-center justify-center rounded-full border border-stone-300 px-6 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-100 sm:w-auto"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
