'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { ProductCategoryRow } from '@/types/database';

export function CategoriesManager({ initial }: { initial: ProductCategoryRow[] }) {
  const router = useRouter();
  const [list, setList] = useState(initial);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/product-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Could not add category');
        return;
      }
      setName('');
      setList((prev) =>
        [...prev, data as ProductCategoryRow].sort((a, b) =>
          a.sort_order !== b.sort_order ? a.sort_order - b.sort_order : a.name.localeCompare(b.name)
        )
      );
      router.refresh();
    } catch {
      setError('Request failed');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string, label: string) {
    if (!window.confirm(`Delete category “${label}”? Products using it must be reassigned first.`)) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/product-categories/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Could not delete');
        return;
      }
      setList((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    } catch {
      setError('Request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={add} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="new-cat" className="block text-sm font-medium text-stone-700">
            New category name
          </label>
          <input
            id="new-cat"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Swimwear"
            className="mt-1 w-full max-w-md rounded-lg border border-stone-300 px-3 py-2 text-stone-900"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
        >
          Add category
        </button>
      </form>

      {list.length === 0 ? (
        <p className="text-sm text-stone-600">No categories yet. Add one above — it will appear in product forms and the shop filters.</p>
      ) : (
        <ul className="divide-y divide-stone-100 rounded-xl border border-stone-200 bg-stone-50/50">
          {list.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-3 px-4 py-3 text-sm first:rounded-t-xl last:rounded-b-xl"
            >
              <span className="font-medium text-stone-900">{c.name}</span>
              <button
                type="button"
                disabled={loading}
                onClick={() => remove(c.id, c.name)}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
