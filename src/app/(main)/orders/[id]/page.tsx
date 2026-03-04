import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseUserId } from '@/lib/supabase/get-user-id';
import type { Order, OrderItem, Product } from '@/types/database';
import Link from 'next/link';

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

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/orders"
        className="text-sm font-medium text-stone-600 hover:text-stone-900"
      >
        ← Back to orders
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
          Order #{orderTyped.id.slice(0, 8).toUpperCase()}
        </h1>
        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
          Paid
        </span>
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
        <div className="flex items-center justify-between">
          <p className="font-semibold text-stone-900">Order summary</p>
          <p className="text-sm font-semibold text-stone-900">
            KES {orderTotal.toLocaleString()}
          </p>
        </div>
        <div className="space-y-3">
          {orderItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b border-stone-100 pb-2 last:border-b-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-stone-900">
                  {item.product?.name ?? 'Product'}
                </p>
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
        <p className="mt-2 text-xs text-stone-500 sm:text-sm">
          Payment received. Real M-Pesa integration coming soon.
        </p>
      </section>
    </div>
  );
}

