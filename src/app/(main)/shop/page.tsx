import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/ProductCardSkeleton';
import { Suspense } from 'react';
import { ShopFilters } from './ShopFilters';
import { SearchAutocomplete } from '@/components/SearchAutocomplete';

async function ProductsGrid({
  category,
  search,
}: {
  category?: string | null;
  search?: string | null;
}) {
  const supabase = await createClient();
  let query = supabase
    .from('products')
    .select('*')
    .eq('availability', true)
    .order('created_at', { ascending: false });
  if (category) query = query.eq('category', category);

  const term = search?.trim();
  if (term) {
    const like = `%${term}%`;
    query = query.or(`name.ilike.${like},description.ilike.${like}`);
  }
  const { data: products } = await query;
  if (!products?.length) {
    return (
      <p className="col-span-full text-center text-stone-500 py-12">
        No products found.
      </p>
    );
  }
  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Shop header */}
      <section className="mb-6 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 shadow-sm sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Shop</h1>
            <p className="mt-1 text-sm text-stone-600">
              Browse all thrift finds available across Mombasa and Kenya.
            </p>
          </div>
          <SearchAutocomplete
            variant="shop"
            initialSearch={search ?? ''}
            category={category ?? null}
          />
        </div>
      </section>

      {/* Filters */}
      <section className="mb-6">
        <ShopFilters currentCategory={category ?? undefined} />
      </section>

      {/* Products grid */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-700">
            All products
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <Suspense
            fallback={
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </>
            }
          >
            <ProductsGrid category={category ?? null} search={search ?? null} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
