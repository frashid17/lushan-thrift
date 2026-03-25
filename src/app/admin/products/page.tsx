import Link from 'next/link';
import { Plus, Package } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminProductsTable } from '../AdminProductsTable';
import { AdminHero } from '../AdminChrome';

export default async function AdminProductsPage() {
  const supabase = createAdminClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const list = products ?? [];
  const inStock = list.filter((p) => p.availability).length;

  return (
    <div className="space-y-8">
      <AdminHero
        eyebrow="Catalog"
        title="Products"
        description={
          <>
            Manage thrift inventory, photos, sizes, and availability. Changes go live on the shop
            immediately.
            {list.length > 0 && (
              <span className="mt-2 block text-xs text-stone-500">
                <strong className="text-stone-700">{inStock}</strong> in stock ·{' '}
                <strong className="text-stone-700">{list.length - inStock}</strong> marked unavailable
              </span>
            )}
          </>
        }
        right={
          <>
            {list.length > 0 && (
              <span className="inline-flex items-center gap-2 rounded-2xl border border-stone-200/90 bg-white/90 px-4 py-2.5 text-sm font-semibold text-stone-800 shadow-sm ring-1 ring-stone-100/80">
                <Package className="h-4 w-4 text-amber-700" aria-hidden />
                {list.length} listing{list.length === 1 ? '' : 's'}
              </span>
            )}
            <Link
              href="/admin/products/new"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              Add product
            </Link>
          </>
        }
      />

      <section>
        <div className="mb-4 flex items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-stone-400">All listings</h2>
        </div>
        <AdminProductsTable products={list} />
      </section>
    </div>
  );
}
