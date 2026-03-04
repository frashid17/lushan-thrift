import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/ProductCardSkeleton';
import { Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { SearchAutocomplete } from '@/components/SearchAutocomplete';

async function FeaturedProducts() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('availability', true)
    .order('created_at', { ascending: false })
    .limit(8);
  if (!products?.length) {
    return (
      <p className="text-center text-stone-500 py-12">
        No products yet. Check back soon!
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default async function HomePage() {
  let isSignedIn = false;
  try {
    const user = await currentUser();
    isSignedIn = !!user;
  } catch {
    // If Clerk is misconfigured or unreachable, render as signed-out
    isSignedIn = false;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Hero */}
      <section className="mb-10 grid gap-8 rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 via-stone-100 to-stone-50 px-5 py-8 text-stone-900 shadow-sm sm:grid-cols-[3fr,2fr] sm:px-8 sm:py-10">
        <div>
          <p className="inline-flex items-center rounded-full bg-stone-900/5 px-3 py-1 text-xs font-medium uppercase tracking-wide text-stone-700">
            Mombasa · Kenya · Thrift
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Fresh thrift drops,
            <br />
            curated for the coast.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-700 sm:text-base">
            Discover quality pre-loved pieces sourced around Mombasa and across Kenya.
            Shop unique fits, save money, and keep clothes in circulation.
          </p>
          <div className="mt-4">
            <SearchAutocomplete variant="home" />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {!isSignedIn ? (
              <>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
                >
                  Sign in to start shopping
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-100"
                >
                  Create account
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
                >
                  Browse the latest drops
                </Link>
                <Link
                  href="/wishlist"
                  className="inline-flex items-center justify-center rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-100"
                >
                  View your wishlist
                </Link>
              </>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              New drops every week
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              Hand-picked coastal styles
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Mobile-first shopping experience
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white/70 p-4 shadow-sm sm:p-5">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Today at Lushan
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-stone-900 text-white p-3">
                <p className="text-[11px] text-stone-300">Fresh arrivals</p>
                <p className="mt-1 text-lg font-semibold">
                  Coastal fits
                </p>
                <p className="mt-1 text-[11px] text-stone-300">
                  Dresses, denim, tees & more
                </p>
              </div>
              <div className="rounded-xl bg-stone-100 p-3">
                <p className="text-[11px] text-stone-500">Popular sizes</p>
                <p className="mt-1 text-lg font-semibold text-stone-900">
                  S · M · L
                </p>
                <p className="mt-1 text-[11px] text-stone-500">
                  Curated for Kenya&apos;s streets
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-3 text-xs text-stone-700">
            <p className="font-medium text-stone-900">Tip for first-time shoppers</p>
            {!isSignedIn ? (
              <p className="mt-1">
                Sign in to save favourites to your wishlist and keep your cart synced
                across devices.
              </p>
            ) : (
              <p className="mt-1">
                Head straight to the shop or your wishlist to see everything waiting
                for you.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-700">
            Shop by category
          </h2>
          <Link
            href="/shop"
            className="text-xs font-medium text-stone-500 hover:text-stone-800"
          >
            View all
          </Link>
        </div>
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto pb-1 text-sm">
          {['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'].map(
            (cat) => (
              <Link
                key={cat}
                href={`/shop?category=${encodeURIComponent(cat)}`}
                className="whitespace-nowrap rounded-full bg-stone-200 px-4 py-2 text-xs font-medium text-stone-800 hover:bg-stone-300"
              >
                {cat}
              </Link>
            ),
          )}
        </div>
      </section>

      {/* Featured products */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-stone-900">
            Featured picks
          </h2>
          <Link
            href="/shop"
            className="text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            Browse all →
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <FeaturedProducts />
        </Suspense>
      </section>

      {/* Why thrift with Lushan */}
      <section className="mt-10 grid gap-4 rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-700 sm:grid-cols-3 sm:p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Sustainable
          </p>
          <p className="mt-1 font-medium text-stone-900">
            Better for your wallet & the planet.
          </p>
          <p className="mt-1 text-xs text-stone-600">
            Every thrifted piece keeps clothes out of landfills and stretches your
            budget further.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Curated for Kenya
          </p>
          <p className="mt-1 font-medium text-stone-900">
            Styles that work for coast life.
          </p>
          <p className="mt-1 text-xs text-stone-600">
            Light fabrics, bold prints, and practical fits for Mombasa heat and
            city movement.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Mobile-first
          </p>
          <p className="mt-1 font-medium text-stone-900">
            Built for phones from day one.
          </p>
          <p className="mt-1 text-xs text-stone-600">
            Fast browsing, wishlist, and cart that follows you when you switch
            devices.
          </p>
        </div>
      </section>
    </div>
  );
}
