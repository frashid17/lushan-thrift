'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlist-store';
import { ProductCard } from '@/components/product/ProductCard';
import { useUser } from '@clerk/nextjs';

export default function WishlistPage() {
  const { items, setItems } = useWishlistStore();
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
    fetch('/api/wishlist')
      .then((res) => res.json())
      .then((data) => setItems(data.items ?? []))
      .finally(() => setLoading(false));
  }, [isSignedIn, setItems]);

  if (!isSignedIn) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">Wishlist</h1>
        <p className="mt-3 text-base text-stone-600">
          Sign in to start saving pieces you love for later.
        </p>
        <Link
          href="/sign-in"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-stone-900 px-8 py-3 text-sm font-semibold text-white hover:bg-stone-800"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">Wishlist</h1>
        <p className="mt-4 text-base text-stone-500">Loading your saved items...</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">Wishlist</h1>
        <p className="mt-4 text-base text-stone-600">
          Your wishlist is empty for now. Save items you like and compare fits later.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-stone-900 px-8 py-3 text-sm font-semibold text-white hover:bg-stone-800"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  const count = items.length;
  const estimatedTotal = items.reduce(
    (sum, item) => sum + (item.product?.price ?? 0),
    0,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header / summary */}
      <section className="mb-6 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 shadow-sm sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
              Wishlist
            </h1>
            <p className="mt-2 text-sm text-stone-600 sm:text-base">
              All the pieces you&apos;re eyeing before they disappear from the racks.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 font-medium text-stone-800 shadow-sm">
                {count} saved {count === 1 ? 'item' : 'items'}
              </span>
              {estimatedTotal > 0 && (
                <span className="inline-flex items-center rounded-full bg-stone-900 px-3 py-1 font-medium text-white shadow-sm">
                  Est. value KES {estimatedTotal.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 text-xs text-stone-600 sm:text-sm sm:items-end">
            <p>
              Tip: move items from your wishlist to cart when you&apos;re ready to
              check out.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section>
        <div className="mb-3 flex items-center justify-between text-xs text-stone-600 sm:text-sm">
          <p className="font-medium uppercase tracking-wide text-stone-700">
            Saved items
          </p>
          <p>{count} showing</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item) =>
            item.product ? <ProductCard key={item.id} product={item.product} /> : null,
          )}
        </div>
      </section>
    </div>
  );
}
