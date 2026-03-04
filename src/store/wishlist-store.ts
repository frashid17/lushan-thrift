'use client';

import { create } from 'zustand';
import type { WishlistItem, Product } from '@/types/database';

interface WishlistStore {
  items: (WishlistItem & { product?: Product })[];
  setItems: (items: (WishlistItem & { product?: Product })[]) => void;
  addItem: (item: WishlistItem & { product?: Product }) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) => {
    if (get().hasItem(item.product_id)) return;
    set((state) => ({ items: [...state.items, item] }));
  },
  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.product_id !== productId) })),
  hasItem: (productId) => get().items.some((i) => i.product_id === productId),
}));
