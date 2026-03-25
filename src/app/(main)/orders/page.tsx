import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseUserId } from '@/lib/supabase/get-user-id';
import type { Order } from '@/types/database';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { StorefrontHero, StorefrontPage } from '@/components/layout/StorefrontChrome';

export default async function OrdersPage() {
  const userId = await getSupabaseUserId();
  if (!userId) redirect('/sign-in');

  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(name))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  type OrderWithItems = Order & {
    order_items?: { id: string; quantity: number; product?: { name: string } }[];
  };
  const list = (orders as OrderWithItems[] | null) ?? [];

  if (!list.length) {
    return (
      <StorefrontPage variant="narrow">
        <StorefrontHero
          eyebrow="Account"
          title="My orders"
          description="When you place an order, it will show up here with payment status and details."
        />
        <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/80 px-6 py-14 text-center">
          <Package className="mx-auto h-12 w-12 text-stone-200" strokeWidth={1.25} aria-hidden />
          <p className="mt-4 text-sm font-semibold text-stone-800">No orders yet</p>
          <p className="mt-1 text-sm text-stone-500">Start with something you love from the shop.</p>
          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-stone-900 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800"
          >
            Start shopping
          </Link>
        </div>
      </StorefrontPage>
    );
  }

  return (
    <StorefrontPage variant="narrow">
      <StorefrontHero
        eyebrow="Account"
        title="My orders"
        description="Tap an order to see items, delivery info, and M-Pesa status."
      />

      <div className="space-y-4">
        {list.map((order) => {
          const items = order.order_items ?? [];
          const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
          const firstNames = items
            .map((i) => i.product?.name)
            .filter(Boolean)
            .slice(0, 2);
          const summary =
            firstNames.length === 0
              ? `${itemCount} item${itemCount === 1 ? '' : 's'}`
              : items.length === 1
                ? firstNames[0]
                : items.length === 2
                  ? firstNames.join(', ')
                  : `${firstNames[0]}, ${firstNames[1]} + ${items.length - 2} more`;
          const total = Number(order.total);

          return (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-2xl border border-stone-200/90 bg-white p-5 text-left shadow-sm ring-1 ring-stone-100/80 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-400">
                    Order{' '}
                    <span className="font-mono text-stone-700">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-900 line-clamp-2">{summary}</p>
                  <p className="mt-1 text-xs text-stone-500">
                    {new Date(order.created_at).toLocaleDateString('en-KE', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-sm font-bold tabular-nums text-stone-900 sm:text-base">
                    KES {total.toLocaleString()}
                  </p>
                  <p
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                      order.payment_status === 'approved'
                        ? 'bg-emerald-100 text-emerald-900'
                        : order.payment_status === 'submitted'
                          ? 'bg-sky-100 text-sky-900'
                          : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {order.payment_status === 'approved'
                      ? 'Paid'
                      : order.payment_status === 'submitted'
                        ? 'Verifying'
                        : 'Pending'}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </StorefrontPage>
  );
}
