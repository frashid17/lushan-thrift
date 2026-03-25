'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cart-store';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { StorefrontHero, StorefrontPage, StorefrontPanel } from '@/components/layout/StorefrontChrome';
import { productPrimaryImage } from '@/lib/product-images';

export default function CartPage() {
  const { items, setItems, removeItem, updateQuantity, subtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/cart')
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items ?? []);
      })
      .catch(() => toast.error('Failed to load cart'))
      .finally(() => setLoading(false));
  }, [setItems]);

  async function handleRemove(productId: string) {
    removeItem(productId);
    setSyncing((s) => ({ ...s, [productId]: true }));
    try {
      await fetch(`/api/cart?product_id=${productId}`, { method: 'DELETE' });
    } catch {
      toast.error('Failed to update cart');
    } finally {
      setSyncing((s) => ({ ...s, [productId]: false }));
    }
  }

  async function handleQuantity(productId: string, quantity: number) {
    if (quantity < 1) {
      handleRemove(productId);
      return;
    }
    updateQuantity(productId, quantity);
    setSyncing((s) => ({ ...s, [productId]: true }));
    try {
      await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity }),
      });
    } catch {
      toast.error('Failed to update cart');
    } finally {
      setSyncing((s) => ({ ...s, [productId]: false }));
    }
  }

  async function handleClearCart() {
    clearCart();
    try {
      await fetch('/api/cart/clear', { method: 'POST' });
      toast.success('Cart cleared');
    } catch {
      toast.error('Failed to clear cart');
    }
  }

  if (loading) {
    return (
      <StorefrontPage variant="narrow">
        <StorefrontHero
          eyebrow="Bag"
          title="Your cart"
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
      <StorefrontPage variant="narrow">
        <StorefrontHero
          eyebrow="Bag"
          title="Your cart"
          description="Nothing here yet — add thrift finds from the shop and they’ll show up ready for checkout."
        />
        <StorefrontPanel className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-stone-200" strokeWidth={1.25} aria-hidden />
          <p className="mt-4 text-sm font-semibold text-stone-800">Your cart is empty</p>
          <p className="mt-1 text-sm text-stone-500">Discover pieces on the shop and tap “Add to cart”.</p>
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

  const total = subtotal();

  return (
    <StorefrontPage variant="narrow">
      <StorefrontHero
        eyebrow="Bag"
        title="Your cart"
        description="Review items before checkout. Quantities sync to your account."
      />

      <div className="space-y-4">
        {items.map((item) => (
          <StorefrontPanel key={item.id} padding="p-4 sm:p-5" className="transition hover:shadow-md">
            <div className="flex gap-4">
              <Link
                href={item.product?.id ? `/shop/${item.product.id}` : '/shop'}
                className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200/80 sm:h-32 sm:w-28"
              >
                <Image
                  src={item.product ? productPrimaryImage(item.product) : ''}
                  alt={item.product?.name ?? ''}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={item.product?.id ? `/shop/${item.product.id}` : '/shop'}
                  className="font-semibold text-stone-900 hover:underline"
                >
                  {item.product?.name}
                </Link>
                <p className="mt-0.5 text-xs text-stone-500">
                  {item.product?.category} · {item.product?.size}
                </p>
                <p className="mt-2 font-mono text-sm font-bold tabular-nums text-stone-900">
                  KES {(item.product?.price ?? 0).toLocaleString()} each
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 p-1">
                    <button
                      type="button"
                      onClick={() => handleQuantity(item.product_id, item.quantity - 1)}
                      disabled={syncing[item.product_id]}
                      className="rounded-full p-2 text-stone-600 hover:bg-white disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantity(item.product_id, item.quantity + 1)}
                      disabled={syncing[item.product_id]}
                      className="rounded-full p-2 text-stone-600 hover:bg-white disabled:opacity-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.product_id)}
                    disabled={syncing[item.product_id]}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-stone-500 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </StorefrontPanel>
        ))}
      </div>

      <StorefrontPanel className="mt-8 bg-gradient-to-br from-stone-50/80 to-white">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-stone-600">Subtotal</span>
          <span className="font-mono text-xl font-bold tabular-nums text-stone-900 sm:text-2xl">
            KES {total.toLocaleString()}
          </span>
        </div>
        <p className="mt-2 text-xs text-stone-500">Delivery or pickup is set at checkout.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/checkout"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:bg-stone-800 sm:flex-initial"
          >
            Proceed to checkout
          </Link>
          <button
            type="button"
            onClick={handleClearCart}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            Clear cart
          </button>
          <Link
            href="/shop"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-stone-600 underline decoration-stone-300 underline-offset-4 hover:text-stone-900"
          >
            Continue shopping
          </Link>
        </div>
      </StorefrontPanel>
    </StorefrontPage>
  );
}
