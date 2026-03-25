'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { productPrimaryImage } from '@/lib/product-images';
import type { Product } from '@/types/database';
import { useWishlistStore } from '@/store/wishlist-store';
import { useCartStore } from '@/store/cart-store';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const thumb = productPrimaryImage(product);
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
      <article className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm ring-1 ring-stone-100/80 transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="relative aspect-[3/4] bg-stone-100">
          <Image
            src={thumb}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
          {!product.availability && (
            <span className="absolute inset-0 flex items-center justify-center bg-stone-900/65 text-sm font-semibold text-white backdrop-blur-[2px]">
              Out of stock
            </span>
          )}
          <button
            type="button"
            onClick={handleWishlist}
            className="absolute right-2 top-2 rounded-full bg-white/95 p-2 shadow-md ring-1 ring-stone-200/80 transition hover:scale-105 hover:bg-white"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`h-4 w-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : 'text-stone-600'}`}
            />
          </button>
        </div>
        <div className="p-3 sm:p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
            {product.category} · {product.size}
          </p>
          <h3 className="mt-1 font-semibold text-stone-900 line-clamp-2 leading-snug">{product.name}</h3>
          <p className="mt-2 font-mono text-base font-bold tabular-nums text-stone-900 sm:text-lg">
            KES {product.price.toLocaleString()}
          </p>
          {product.availability && (
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full rounded-full bg-stone-900 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 active:scale-[0.99]"
              >
                Buy now
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full rounded-full border-2 border-stone-200 bg-white py-2.5 text-sm font-semibold text-stone-800 transition hover:border-stone-300 hover:bg-stone-50"
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
