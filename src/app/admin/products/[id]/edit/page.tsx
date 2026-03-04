import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import { EditProductForm } from '../../EditProductForm';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !product) notFound();
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Edit product</h1>
      <EditProductForm product={product} />
    </div>
  );
}
