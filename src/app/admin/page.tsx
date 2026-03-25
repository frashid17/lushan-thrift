import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Banknote,
  LayoutGrid,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  Users,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminProductsTable } from './AdminProductsTable';

type StatAccent = 'sky' | 'violet' | 'amber' | 'emerald';

function StatCardLink({
  href,
  label,
  value,
  hint,
  accent,
  icon,
}: {
  href: string;
  label: string;
  value: string | number;
  hint: string;
  accent: StatAccent;
  icon: ReactNode;
}) {
  const accents: Record<
    StatAccent,
    { ring: string; iconWrap: string; iconColor: string; glow: string }
  > = {
    sky: {
      ring: 'ring-sky-200/80 hover:ring-sky-300',
      iconWrap: 'bg-sky-100 text-sky-700',
      iconColor: 'text-sky-600',
      glow: 'from-sky-400/20',
    },
    violet: {
      ring: 'ring-violet-200/80 hover:ring-violet-300',
      iconWrap: 'bg-violet-100 text-violet-700',
      iconColor: 'text-violet-600',
      glow: 'from-violet-400/20',
    },
    amber: {
      ring: 'ring-amber-200/80 hover:ring-amber-300',
      iconWrap: 'bg-amber-100 text-amber-800',
      iconColor: 'text-amber-700',
      glow: 'from-amber-400/25',
    },
    emerald: {
      ring: 'ring-emerald-200/80 hover:ring-emerald-300',
      iconWrap: 'bg-emerald-100 text-emerald-800',
      iconColor: 'text-emerald-700',
      glow: 'from-emerald-400/20',
    },
  };
  const a = accents[accent];

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 ${a.ring}`}
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${a.glow} to-transparent opacity-80 transition group-hover:scale-110`}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${a.iconWrap}`}
        >
          <span className={a.iconColor}>{icon}</span>
        </div>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-stone-500"
          aria-hidden
        />
      </div>
      <p className="relative mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">
        {label}
      </p>
      <p className="relative mt-1 font-mono text-2xl font-bold tabular-nums tracking-tight text-stone-900 sm:text-[1.65rem]">
        {value}
      </p>
      <p className="relative mt-2 text-xs leading-relaxed text-stone-500">{hint}</p>
    </Link>
  );
}

export default async function AdminPage() {
  const supabase = createAdminClient();

  const [
    { data: products },
    { count: productCount },
    { count: userCount },
    { count: orderCount },
    { data: approvedOrders },
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total').eq('payment_status', 'approved'),
  ]);

  const inStock = products?.filter((p) => p.availability).length ?? 0;

  const approvedCount = approvedOrders?.length ?? 0;
  const revenueKes =
    approvedOrders?.reduce((sum, row) => sum + Number(row.total ?? 0), 0) ?? 0;
  const revenueRounded = Math.round(revenueKes * 100) / 100;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const quickLinks = [
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/payments', label: 'Payments' },
    { href: '/admin/products', label: 'Catalog' },
    { href: '/admin/contact', label: 'Contact' },
  ] as const;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-gradient-to-br from-amber-50/90 via-white to-stone-100/80 px-5 py-7 shadow-sm sm:px-8 sm:py-9">
        <div
          className="pointer-events-none absolute -left-16 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-amber-200/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-stone-300/20 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl space-y-2">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-amber-900 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" aria-hidden />
              Admin dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              {greeting}
            </h1>
            <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
              Here&apos;s how Lushan Thrift is doing today — stock, people, orders, and revenue at a
              glance.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
            <Link
              href="/admin/products/new"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800 active:scale-[0.99]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              New product
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-stone-300 bg-white/90 px-5 py-2.5 text-sm font-semibold text-stone-800 shadow-sm backdrop-blur-sm transition hover:bg-white"
            >
              View storefront
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCardLink
          href="/admin/products"
          label="Products"
          value={productCount ?? 0}
          hint={`${inStock} in stock · tap to manage catalog`}
          accent="sky"
          icon={<Package className="h-5 w-5" strokeWidth={2} />}
        />
        <StatCardLink
          href="/admin/users"
          label="Customers"
          value={userCount ?? 0}
          hint="Signed-up shoppers in your database"
          accent="violet"
          icon={<Users className="h-5 w-5" strokeWidth={2} />}
        />
        <StatCardLink
          href="/admin/orders"
          label="Orders"
          value={orderCount ?? 0}
          hint={
            (orderCount ?? 0) > approvedCount
              ? `${approvedCount} paid · ${(orderCount ?? 0) - approvedCount} awaiting payment`
              : `${approvedCount} with payment approved`
          }
          accent="amber"
          icon={<ShoppingBag className="h-5 w-5" strokeWidth={2} />}
        />
        <StatCardLink
          href="/admin/orders"
          label="Revenue (KES)"
          value={revenueRounded.toLocaleString()}
          hint={
            approvedCount > 0
              ? `From ${approvedCount} approved order${approvedCount === 1 ? '' : 's'}`
              : 'Approve M-Pesa in Orders to grow this'
          }
          accent="emerald"
          icon={<Banknote className="h-5 w-5" strokeWidth={2} />}
        />
      </section>

      <section>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
          Shortcuts
        </p>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
            >
              <LayoutGrid className="h-3.5 w-3.5 text-stone-400" aria-hidden />
              {q.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-stone-100 bg-gradient-to-r from-stone-50/80 to-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="text-base font-semibold text-stone-900">Recent products</h2>
            <p className="mt-0.5 text-xs text-stone-500">Latest five in your catalog</p>
          </div>
          <Link
            href="/admin/products"
            className="inline-flex items-center justify-center gap-1 self-start rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-stone-800 sm:self-auto"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        <div className="p-3 sm:p-4">
          <AdminProductsTable products={products ?? []} />
        </div>
      </section>
    </div>
  );
}
