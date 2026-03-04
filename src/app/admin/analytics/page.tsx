import { createAdminClient } from '@/lib/supabase/admin';

export default async function AdminAnalyticsPage() {
  const supabase = createAdminClient();

  const [{ count: productCount }, { count: userCount }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Analytics</h1>
        <p className="mt-1 text-sm text-stone-600">
          High-level view of your catalogue and customers. Revenue and order funnels
          will appear here after payments are connected.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Total products
          </p>
          <p className="mt-2 text-2xl font-semibold text-stone-900">
            {productCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Every active item in your Supabase `products` table.
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Registered users
          </p>
          <p className="mt-2 text-2xl font-semibold text-stone-900">
            {userCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Users synced from Clerk into Supabase.
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Orders & revenue
          </p>
          <p className="mt-2 text-2xl font-semibold text-stone-900">—</p>
          <p className="mt-1 text-xs text-stone-500">
            Will be calculated from your future `orders` table.
          </p>
        </div>
      </section>

      <div className="rounded-xl border border-dashed border-stone-300 bg-white/60 p-6 text-sm text-stone-600">
        <p className="font-medium text-stone-800">What we can add next</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>Orders by day/week in Kenya time.</li>
          <li>Most viewed and most wishlisted items.</li>
          <li>Conversion from wishlist → cart → paid.</li>
        </ul>
      </div>
    </div>
  );
}

