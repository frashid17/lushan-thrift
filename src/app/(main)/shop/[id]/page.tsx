import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { productImageGallery } from '@/lib/product-images';
import { ProductActions } from './ProductActions';
import { ProductGalleryClient } from './ProductGalleryClient';
import { StorefrontBackLink, StorefrontPage, StorefrontPanel } from '@/components/layout/StorefrontChrome';
import { ChevronRight } from 'lucide-react';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product, error } = await supabase.from('products').select('*').eq('id', id).single();

  if (error || !product) notFound();

  return (
    <StorefrontPage>
      <nav className="mb-2 flex flex-wrap items-center gap-1 text-xs font-medium text-stone-500 sm:text-sm">
        <Link href="/" className="hover:text-stone-800">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
        <Link href="/shop" className="hover:text-stone-800">
          Shop
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
        <span className="line-clamp-1 text-stone-800">{product.name}</span>
      </nav>

      <StorefrontBackLink href="/shop">Back to shop</StorefrontBackLink>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
        <ProductGalleryClient
          images={productImageGallery(product)}
          alt={product.name}
          unavailable={!product.availability}
        />

        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 ring-1 ring-stone-200/80">
              {product.category}
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200/80">
              Size {product.size}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 font-mono text-3xl font-bold tabular-nums text-stone-900 sm:text-4xl">
            KES {Number(product.price).toLocaleString()}
          </p>

          <StorefrontPanel className="mt-6" padding="p-5 sm:p-6">
            {product.description ? (
              <p className="text-sm leading-relaxed text-stone-600 sm:text-base">{product.description}</p>
            ) : (
              <p className="text-sm italic text-stone-400">No description for this piece yet.</p>
            )}
          </StorefrontPanel>

          <ProductActions product={product} />

          <p className="mt-8 text-xs text-stone-500">
            Questions? Use the contact options in the site footer after you sign in.
          </p>
        </div>
      </div>
    </StorefrontPage>
  );
}
