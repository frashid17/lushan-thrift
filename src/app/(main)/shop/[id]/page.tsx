import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ProductActions } from './ProductActions';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-stone-100">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {!product.availability && (
            <span className="absolute inset-0 flex items-center justify-center bg-stone-900/60 text-lg font-medium text-white">
              Out of stock
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-stone-500">
            {product.category} · {product.size}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-stone-900 sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-4 text-lg font-semibold text-stone-900">
            KES {Number(product.price).toLocaleString()}
          </p>
          {product.description && (
            <p className="mt-4 text-stone-600">{product.description}</p>
          )}
          <ProductActions product={product} />
          <Link
            href="/shop"
            className="mt-6 inline-block text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            ← Back to shop
          </Link>
        </div>
      </div>
    </div>
  );
}
