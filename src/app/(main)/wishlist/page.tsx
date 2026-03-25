'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlist-store';
import { ProductCard } from '@/components/product/ProductCard';
import { useUser } from '@clerk/nextjs';
import { Heart, Sparkles } from 'lucide-react';
import { StorefrontHero, StorefrontPage, StorefrontPanel } from '@/components/layout/StorefrontChrome';

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
      <StorefrontPage>
        <StorefrontHero
          eyebrow="Saved"
          title="Wishlist"
          description="Sign in to save thrift pieces you love and come back to them anytime."
        />
        <StorefrontPanel className="text-center">
          <Heart className="mx-auto h-12 w-12 text-rose-200" strokeWidth={1.25} aria-hidden />
          <p className="mt-4 text-sm font-semibold text-stone-800">Sign in to use your wishlist</p>
          <Link
            href="/sign-in"
            className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-stone-900 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800"
          >
            Sign in
          </Link>
        </StorefrontPanel>
      </StorefrontPage>
    );
  }

  if (loading) {
    return (
      <StorefrontPage>
        <StorefrontHero
          eyebrow="Saved"
          title="Wishlist"
          description="Loading your saved pieces…"
        />
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 animate-pulse rounded-full bg-stone-200" aria-hidden />
        </div>
      </StorefrontPage>
    );
  }

  if (!items.length) {
    return (
      <StorefrontPage>
        <StorefrontHero
          eyebrow="Saved"
          title="Wishlist"
          description="Heart items on the shop to build a list of pieces you’re considering."
        />
        <StorefrontPanel className="text-center">
          <Heart className="mx-auto h-12 w-12 text-stone-200" strokeWidth={1.25} aria-hidden />
          <p className="mt-4 text-sm font-semibold text-stone-800">Nothing saved yet</p>
          <p className="mt-1 text-sm text-stone-500">
            Tap the heart on any product to save it here before it’s gone.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-stone-900 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800"
          >
            Browse the shop
          </Link>
        </StorefrontPanel>
      </StorefrontPage>
    );
  }

  const count = items.length;
  const estimatedTotal = items.reduce((sum, item) => sum + (item.product?.price ?? 0), 0);

  return (
    <StorefrontPage>
      <StorefrontHero
        eyebrow="Saved"
        title="Wishlist"
        description="Pieces you’re eyeing — move them to cart when you’re ready to check out."
        right={
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-stone-800 shadow-sm ring-1 ring-stone-200/80">
              {count} saved
            </span>
            {estimatedTotal > 0 && (
              <span className="inline-flex items-center rounded-full bg-stone-900 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                Est. KES {estimatedTotal.toLocaleString()}
              </span>
            )}
          </div>
        }
      />

      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 text-sm font-bold text-stone-900">
          <Sparkles className="h-4 w-4 text-amber-600" aria-hidden />
          Saved items
        </p>
        <Link
          href="/shop"
          className="text-xs font-semibold text-stone-600 hover:text-stone-900"
        >
          Keep shopping →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) =>
          item.product ? <ProductCard key={item.id} product={item.product} /> : null,
        )}
      </div>
    </StorefrontPage>
  );
}
