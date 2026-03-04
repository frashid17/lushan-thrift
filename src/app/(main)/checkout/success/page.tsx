import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import type { Order, OrderItem } from '@/types/database';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  const supabase = await createClient();
  let order: Order | null = null;
  let orderItems: (OrderItem & { product?: { name: string; image_url: string; category: string; size: string } })[] = [];

  if (orderId) {
    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    order = (orderData as Order | null) ?? null;

    if (order) {
      const { data: items } = await supabase
        .from('order_items')
        .select('*, product:products(name, image_url, category, size)')
        .eq('order_id', orderId);
      orderItems = (items ?? []) as typeof orderItems;
    }
  }

  const total = order ? Number(order.total) : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-stone-200 bg-stone-50 px-4 py-5 sm:px-6 text-center">
          <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
            Payment received
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Thank you for your order. Your payment has been confirmed.
          </p>
          {order && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
              <span className="font-mono font-semibold text-stone-900">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <span className="text-stone-500">
                {new Date(order.created_at).toLocaleDateString('en-KE', {
                  dateStyle: 'medium',
                })}
              </span>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                Paid
              </span>
            </div>
          )}
        </div>

        {order && orderItems.length > 0 && (
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              What you ordered
            </h2>
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
                    <p className="font-medium text-stone-900">
                      {item.product?.name ?? 'Product'}
                    </p>
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
              <span>Total paid</span>
              <span>KES {total.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="border-t border-stone-200 bg-stone-50 px-4 py-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/orders"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
          >
            View my orders
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-100"
          >
            Continue shopping
          </Link>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-stone-500">
        Payment simulated for now. Real M-Pesa integration coming soon.
      </p>
    </div>
  );
}

