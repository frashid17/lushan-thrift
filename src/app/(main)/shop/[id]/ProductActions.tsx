'use client';

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { Product } from '@/types/database';
import { useWishlistStore } from '@/store/wishlist-store';
import { useCartStore } from '@/store/cart-store';

export function ProductActions({ product }: { product: Product }) {
  const { addItem: addWishlist, removeItem: removeWishlist, hasItem } = useWishlistStore();
  const { addItem: addCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const inWishlist = hasItem(product.id);
  const router = useRouter();

  async function handleWishlist() {
    setLoading(true);
    try {
      if (inWishlist) {
        removeWishlist(product.id);
        await fetch(`/api/wishlist?product_id=${product.id}`, { method: 'DELETE' });
        toast.success('Removed from wishlist');
      } else {
        addWishlist({
          id: '',
          user_id: '',
          product_id: product.id,
          created_at: '',
          product,
        });
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: product.id }),
        });
        if (res.status === 401) {
          toast.error('Sign in to add to wishlist');
        } else if (!res.ok) {
          throw new Error();
        } else {
          toast.success('Added to wishlist');
        }
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart() {
    if (!product.availability) return;
    setLoading(true);
    try {
      addCart({
        id: '',
        user_id: '',
        product_id: product.id,
        quantity: 1,
        created_at: '',
        product,
      });
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });
      if (res.status === 401) {
        toast.error('Sign in to add to cart');
      } else if (!res.ok) {
        throw new Error();
      } else {
        toast.success('Added to cart');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleBuyNow() {
    if (!product.availability) return;
    setLoading(true);
    try {
      addCart({
        id: '',
        user_id: '',
        product_id: product.id,
        quantity: 1,
        created_at: '',
        product,
      });
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });
      if (res.status === 401) {
        toast.error('Sign in to buy');
      } else if (!res.ok) {
        throw new Error();
      } else {
        router.push('/checkout');
        return;
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {product.availability && (
        <>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={loading}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-stone-900 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800 disabled:opacity-50 sm:flex-initial sm:min-w-[140px]"
          >
            Buy now
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={loading}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border-2 border-stone-200 bg-white px-8 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-300 hover:bg-stone-50 disabled:opacity-50 sm:flex-initial sm:min-w-[140px]"
          >
            Add to cart
          </button>
        </>
      )}
      <button
        type="button"
        onClick={handleWishlist}
        disabled={loading}
        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-stone-200 bg-white px-8 py-3 text-sm font-semibold text-stone-700 transition hover:border-rose-200 hover:bg-rose-50/40 disabled:opacity-50"
      >
        <Heart
          className={`h-4 w-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`}
        />
        {inWishlist ? 'In wishlist' : 'Wishlist'}
      </button>
    </div>
  );
}
