'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = [
  'All',
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Shoes',
  'Accessories',
];

export function ShopFilters({ currentCategory }: { currentCategory?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setCategory(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'All') params.delete('category');
    else params.set('category', cat);
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const active = (cat === 'All' && !currentCategory) || currentCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm transition active:scale-[0.98] ${
              active
                ? 'bg-stone-900 text-white ring-2 ring-stone-900 ring-offset-2'
                : 'border border-stone-200/90 bg-white text-stone-700 ring-1 ring-stone-100 hover:border-stone-300 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
