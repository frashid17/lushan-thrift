'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cart-store';
import { Trash2, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

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
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-stone-500">Loading cart...</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-stone-900">Your cart</h1>
        <p className="mt-4 text-stone-600">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-md bg-stone-900 px-6 py-3 text-sm font-medium text-white hover:bg-stone-800"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const total = subtotal();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-stone-900">Your cart</h1>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-lg border border-stone-200 bg-white p-4"
          >
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded bg-stone-100">
              <Image
                src={item.product?.image_url ?? ''}
                alt={item.product?.name ?? ''}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-stone-900">{item.product?.name}</p>
              <p className="text-sm text-stone-500">
                {item.product?.category} · {item.product?.size}
              </p>
              <p className="mt-1 font-semibold text-stone-900">
                KES {(item.product?.price ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuantity(item.product_id, item.quantity - 1)}
                disabled={syncing[item.product_id]}
                className="rounded p-1 hover:bg-stone-100 disabled:opacity-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantity(item.product_id, item.quantity + 1)}
                disabled={syncing[item.product_id]}
                className="rounded p-1 hover:bg-stone-100 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(item.product_id)}
              disabled={syncing[item.product_id]}
              className="rounded p-2 text-stone-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t border-stone-200 pt-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>KES {total.toLocaleString()}</span>
        </div>
        <p className="mt-1 text-sm text-stone-500">Shipping calculated at checkout.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/checkout"
            className="rounded-md bg-stone-900 px-6 py-2 text-center text-sm font-medium text-white hover:bg-stone-800"
          >
            Proceed to checkout
          </Link>
          <button
            type="button"
            onClick={handleClearCart}
            className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Clear cart
          </button>
          <Link
            href="/shop"
            className="rounded-md px-4 py-2 text-center text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
