import { createAdminClient } from '@/lib/supabase/admin';
import { AdminCallout, AdminHero } from '../AdminChrome';
import { Banknote, Package, ShoppingBag, Users } from 'lucide-react';

export default async function AdminAnalyticsPage() {
  const supabase = createAdminClient();

  const [{ count: productCount }, { count: userCount }, { count: orderCount }, { data: approvedOrders }] =
    await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total').eq('payment_status', 'approved'),
    ]);

  const revenueKes =
    approvedOrders?.reduce((sum, row) => sum + Number(row.total ?? 0), 0) ?? 0;
  const revenueRounded = Math.round(revenueKes * 100) / 100;
  const approvedN = approvedOrders?.length ?? 0;

  const tiles = [
    {
      label: 'Products',
      value: productCount ?? 0,
      hint: 'Rows in Supabase `products`',
      icon: Package,
      tint: 'bg-sky-100 text-sky-700',
    },
    {
      label: 'Synced users',
      value: userCount ?? 0,
      hint: 'From Clerk → Supabase',
      icon: Users,
      tint: 'bg-violet-100 text-violet-700',
    },
    {
      label: 'Orders',
      value: orderCount ?? 0,
      hint: 'All payment states',
      icon: ShoppingBag,
      tint: 'bg-amber-100 text-amber-800',
    },
    {
      label: 'Revenue (KES)',
      value: revenueRounded.toLocaleString(),
      hint:
        approvedN > 0
          ? `${approvedN} approved payment${approvedN === 1 ? '' : 's'}`
          : 'Approves count toward revenue',
      icon: Banknote,
      tint: 'bg-emerald-100 text-emerald-800',
    },
  ] as const;

  return (
    <div className="space-y-8">
      <AdminHero
        eyebrow="Insights"
        title="Analytics"
        description="Snapshot of catalogue, customers, orders, and approved M-Pesa revenue. Use Overview for quick links; this page is for numbers."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(({ label, value, hint, icon: Icon, tint }) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm ring-1 ring-stone-100/80"
          >
            <div
              className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${tint}`}
            >
              <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-400">{label}</p>
            <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-stone-900">{value}</p>
            <p className="mt-2 text-xs leading-relaxed text-stone-500">{hint}</p>
          </div>
        ))}
      </section>

      <AdminCallout variant="muted" title="What we can add next">
        <ul className="list-disc space-y-1.5 pl-4 text-xs sm:text-sm">
          <li>Orders by day / week (Kenya timezone).</li>
          <li>Most wishlisted and best-selling SKUs.</li>
          <li>Funnel: wishlist → cart → paid.</li>
        </ul>
      </AdminCallout>
    </div>
  );
}
