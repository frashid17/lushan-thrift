import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseUserId } from '@/lib/supabase/get-user-id';
import type { Order } from '@/types/database';
import Link from 'next/link';

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
      <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
          My orders
        </h1>
        <p className="mt-3 text-base text-stone-600">
          You haven&apos;t placed any orders yet.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
        My orders
      </h1>
      <p className="mt-2 text-sm text-stone-600 sm:text-base">
        A history of your recent Lushan Thrift orders.
      </p>

      <div className="mt-6 space-y-4">
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
              className="block rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    Order{' '}
                    <span className="font-mono text-stone-800">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </p>
                  <p className="mt-1 text-sm font-medium text-stone-900 line-clamp-1">
                    {summary}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    {new Date(order.created_at).toLocaleDateString('en-KE', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right text-sm flex-shrink-0">
                  <p className="font-semibold text-stone-900">
                    KES {total.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-green-700 font-medium">
                    Paid
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

