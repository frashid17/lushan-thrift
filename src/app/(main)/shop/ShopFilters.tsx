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
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => setCategory(cat)}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            (cat === 'All' && !currentCategory) || currentCategory === cat
              ? 'bg-stone-900 text-white'
              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
