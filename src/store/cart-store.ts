'use client';

import { create } from 'zustand';
import type { CartItem, Product } from '@/types/database';

interface CartStore {
  items: (CartItem & { product?: Product })[];
  setItems: (items: (CartItem & { product?: Product })[]) => void;
  addItem: (item: CartItem & { product?: Product }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.product_id === item.product_id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product_id === item.product_id
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
    });
  },
  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.product_id !== productId) })),
  updateQuantity: (productId, quantity) => {
    if (quantity < 1) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.product_id === productId ? { ...i, quantity } : i
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  subtotal: () =>
    get().items.reduce(
      (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
      0
    ),
  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
