import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import { EditProductForm } from '../../EditProductForm';
import { AdminHero } from '../../../AdminChrome';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: product, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error || !product) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="group inline-flex items-center gap-0.5 text-sm font-semibold text-stone-600 transition hover:text-stone-900"
      >
        <ChevronLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" aria-hidden />
        Back to products
      </Link>
      <AdminHero
        eyebrow="Catalog"
        title="Edit product"
        description={
          <>
            Update <span className="font-medium text-stone-800">{product.name}</span>. Shoppers see changes
            immediately.
          </>
        }
      />
      <EditProductForm product={product} />
    </div>
  );
}
