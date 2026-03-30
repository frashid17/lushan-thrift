import { createAdminClient } from '@/lib/supabase/admin';
import { AdminCallout, AdminHero } from '../AdminChrome';
import { CategoriesManager } from './CategoriesManager';
import type { ProductCategoryRow } from '@/types/database';

export default async function AdminCategoriesPage() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('product_categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    return (
      <div className="space-y-6">
        <AdminHero eyebrow="Catalog" title="Categories" description="Manage shop categories for filters and product listings." />
        <AdminCallout variant="danger" title="Could not load categories">
          {error.message}
        </AdminCallout>
      </div>
    );
  }

  const rows = (data ?? []) as ProductCategoryRow[];

  return (
    <div className="space-y-8">
      <AdminHero
        eyebrow="Catalog"
        title="Categories"
        description={
          <>
            Add or remove categories. These drive the shop filters and product dropdowns. You cannot delete a category
            while any product still uses it — edit those products first.
          </>
        }
      />
      <CategoriesManager initial={rows} />
    </div>
  );
}
