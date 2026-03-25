import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/ProductCardSkeleton';
import { Suspense } from 'react';
import { ShopFilters } from './ShopFilters';
import { SearchAutocomplete } from '@/components/SearchAutocomplete';
import { StorefrontHero, StorefrontPage } from '@/components/layout/StorefrontChrome';
import { Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
      <div className="col-span-full rounded-2xl border border-dashed border-stone-200 bg-stone-50/80 px-6 py-14 text-center">
        <Package className="mx-auto h-10 w-10 text-stone-300" strokeWidth={1.25} aria-hidden />
        <p className="mt-4 text-sm font-semibold text-stone-800">No matches right now</p>
        <p className="mt-1 text-sm text-stone-500">
          Try another category or search term — new pieces land often.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-600"
        >
          Clear filters
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
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
  const filterLabel = category
    ? `${category}`
    : search?.trim()
      ? `“${search.trim()}”`
      : 'All thrift';

  return (
    <StorefrontPage>
      <StorefrontHero
        eyebrow="Catalog"
        title="Shop"
        description="Browse every in-stock piece — filter by category or search by name and description."
        right={
          <SearchAutocomplete
            variant="shop"
            initialSearch={search ?? ''}
            category={category ?? null}
          />
        }
      />

      <section className="mb-6">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400">
              Filter
            </p>
            <p className="text-sm font-medium text-stone-700">
              Showing: <span className="text-stone-900">{filterLabel}</span>
            </p>
          </div>
        </div>
        <ShopFilters currentCategory={category ?? undefined} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-base font-bold tracking-tight text-stone-900">All products</h2>
          <Link
            href="/"
            className="hidden text-xs font-semibold text-stone-600 hover:text-stone-900 sm:inline"
          >
            ← Home
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
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
    </StorefrontPage>
  );
}
