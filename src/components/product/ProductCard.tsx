'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import type { Product } from '@/types/database';
import { useWishlistStore } from '@/store/wishlist-store';
import { useCartStore } from '@/store/cart-store';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem: addWishlist, removeItem: removeWishlist, hasItem } = useWishlistStore();
  const { addItem: addCart } = useCartStore();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const inWishlist = hasItem(product.id);

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error('Sign in to add to wishlist');
      return;
    }
    if (inWishlist) {
      removeWishlist(product.id);
      try {
        await fetch(`/api/wishlist?product_id=${product.id}`, { method: 'DELETE' });
      } catch {
        toast.error('Failed to update wishlist');
      }
      toast.success('Removed from wishlist');
      return;
    }
    addWishlist({ id: '', user_id: '', product_id: product.id, created_at: '', product });
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id }),
      });
      toast.success('Added to wishlist');
    } catch {
      toast.error('Failed to add to wishlist');
    }
  }

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error('Sign in to add to cart');
      return;
    }
    addCart({
      id: '',
      user_id: '',
      product_id: product.id,
      quantity: 1,
      created_at: '',
      product,
    });
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  }

  async function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error('Sign in to buy');
      return;
    }
    if (!product.availability) return;

    // Ensure item exists in cart, then go to checkout
    addCart({
      id: '',
      user_id: '',
      product_id: product.id,
      quantity: 1,
      created_at: '',
      product,
    });
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });
      router.push('/checkout');
    } catch {
      toast.error('Failed to start checkout');
    }
  }

  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <article className="rounded-lg border border-stone-200 bg-white overflow-hidden shadow-sm transition hover:shadow-md">
        <div className="relative aspect-[3/4] bg-stone-100">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
          {!product.availability && (
            <span className="absolute inset-0 flex items-center justify-center bg-stone-900/60 text-sm font-medium text-white">
              Out of stock
            </span>
          )}
          <button
            type="button"
            onClick={handleWishlist}
            className="absolute top-2 right-2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`h-4 w-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : 'text-stone-600'}`}
            />
          </button>
        </div>
        <div className="p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            {product.category} · {product.size}
          </p>
          <h3 className="mt-0.5 font-semibold text-stone-900 line-clamp-1">{product.name}</h3>
          <p className="mt-1 text-lg font-semibold text-stone-900">
            KES {product.price.toLocaleString()}
          </p>
          {product.availability && (
            <div className="mt-2 space-y-2">
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full rounded-md bg-stone-900 py-2 text-sm font-semibold text-white hover:bg-stone-800"
              >
                Buy now
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full rounded-md border border-stone-300 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                Add to cart
              </button>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
