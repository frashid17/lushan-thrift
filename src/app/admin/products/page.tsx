import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminProductsTable } from '../AdminProductsTable';

export default async function AdminProductsPage() {
  const supabase = createAdminClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Products</h1>
          <p className="mt-1 text-sm text-stone-600">
            Manage your thrift inventory, sizes, and availability.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          Add product
        </Link>
      </div>
      <AdminProductsTable products={products ?? []} />
    </div>
  );
}

