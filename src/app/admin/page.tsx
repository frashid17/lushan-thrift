import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminProductsTable } from './AdminProductsTable';

export default async function AdminPage() {
  const supabase = createAdminClient();

  const [{ data: products }, { count: productCount }, { count: userCount }] =
    await Promise.all([
      supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
    ]);

  const inStock =
    products?.filter((p) => p.availability).length ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
            Overview
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Quick glance at how Lushan Thrift is performing.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          Add product
        </Link>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Products
          </p>
          <p className="mt-2 text-2xl font-semibold text-stone-900">
            {productCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            {inStock} currently in stock
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Customers
          </p>
          <p className="mt-2 text-2xl font-semibold text-stone-900">
            {userCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Based on Supabase users table
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Orders
          </p>
          <p className="mt-2 text-2xl font-semibold text-stone-900">—</p>
          <p className="mt-1 text-xs text-stone-500">
            M-Pesa Daraja integration coming soon
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Revenue (KES)
          </p>
          <p className="mt-2 text-2xl font-semibold text-stone-900">—</p>
          <p className="mt-1 text-xs text-stone-500">
            Will be calculated from paid orders
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-900">
            Recent products
          </h2>
          <Link
            href="/admin/products"
            className="text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            View all
          </Link>
        </div>
        <AdminProductsTable products={products ?? []} />
      </section>
    </div>
  );
}
