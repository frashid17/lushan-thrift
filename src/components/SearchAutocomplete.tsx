'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productPrimaryImage } from '@/lib/product-images';
import type { Product } from '@/types/database';
import Image from 'next/image';

interface SearchAutocompleteProps {
  variant: 'home' | 'shop';
  initialSearch?: string;
  category?: string | null;
}

export function SearchAutocomplete({
  variant,
  initialSearch = '',
  category,
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState(initialSearch);
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          search: query,
          limit: '5',
        });
        if (category) params.set('category', category);
        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error();
        const data = (await res.json()) as Product[];
        setResults(data);
        setOpen(!!data.length);
      } catch {
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, category]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (category) params.set('category', category);
    router.push(`/shop?${params.toString()}`);
    setOpen(false);
  }

  function goToProduct(id: string) {
    setOpen(false);
    setQuery('');
    router.push(`/shop/${id}`);
  }

  const placeholder =
    variant === 'home'
      ? 'Search for denim, dresses, jackets...'
      : 'Search all products...';

  return (
    <div className={variant === 'home' ? 'relative w-full max-w-full sm:max-w-xl' : 'relative w-full max-w-md'}>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm shadow-sm"
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="h-8 flex-1 bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex h-8 items-center justify-center rounded-full bg-stone-900 px-4 text-xs font-semibold text-white hover:bg-stone-800"
        >
          {loading ? '...' : 'Search'}
        </button>
      </form>
      {open && results.length > 0 && (
        <div className="absolute z-30 mt-2 w-full rounded-2xl border border-stone-200 bg-white p-2 text-sm shadow-lg">
          <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-stone-500">
            Quick results
          </p>
          <ul className="max-h-80 space-y-1 overflow-auto">
            {results.map((product) => (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={() => goToProduct(product.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 hover:bg-stone-50"
                >
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-stone-100">
                    <Image
                      src={productPrimaryImage(product)}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-xs font-semibold text-stone-900">
                      {product.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-stone-500">
                      {product.category} · {product.size}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-stone-900">
                    KES {Number(product.price).toLocaleString()}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

