import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminProductsTable } from './AdminProductsTable';

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

  const inStock =
    products?.filter((p) => p.availability).length ?? 0;

  const approvedCount = approvedOrders?.length ?? 0;
  const revenueKes =
    approvedOrders?.reduce((sum, row) => sum + Number(row.total ?? 0), 0) ?? 0;
  const revenueRounded = Math.round(revenueKes * 100) / 100;

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
        <Link
          href="/admin/products"
          className="group rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-stone-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Products
            </p>
            <span className="text-xs font-medium text-stone-400 transition group-hover:text-stone-600">
              Open →
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-stone-900">
            {productCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            {inStock} currently in stock
          </p>
        </Link>
        <Link
          href="/admin/users"
          className="group rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-stone-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Customers
            </p>
            <span className="text-xs font-medium text-stone-400 transition group-hover:text-stone-600">
              Open →
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-stone-900">
            {userCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Based on Supabase users table
          </p>
        </Link>
        <Link
          href="/admin/orders"
          className="group rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-stone-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Orders
            </p>
            <span className="text-xs font-medium text-stone-400 transition group-hover:text-stone-600">
              Open →
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-stone-900">
            {orderCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            {approvedCount} with payment approved
            {(orderCount ?? 0) > approvedCount && (
              <> · {(orderCount ?? 0) - approvedCount} not fully paid yet</>
            )}
          </p>
        </Link>
        <Link
          href="/admin/orders"
          className="group rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-stone-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Revenue (KES)
            </p>
            <span className="text-xs font-medium text-stone-400 transition group-hover:text-stone-600">
              Open →
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-stone-900">
            {revenueRounded.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            {approvedCount > 0
              ? `Sum of ${approvedCount} approved order${approvedCount === 1 ? '' : 's'}`
              : 'Approve in Orders when M-Pesa is verified'}
          </p>
        </Link>
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
