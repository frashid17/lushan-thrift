'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/database';

const CATEGORIES = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];

async function parseJsonResponse(res: Response): Promise<Record<string, unknown> | null> {
  const ct = res.headers.get('content-type') ?? '';
  if (!ct.includes('application/json')) return null;
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function apiErrorMessage(body: Record<string, unknown> | null, fallback: string): string {
  const err = body?.error;
  if (typeof err !== 'string' || err.length > 200 || /[<>]/.test(err)) return fallback;
  return err;
}

export function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(product.image_url);
  const [form, setForm] = useState({
    name: product.name,
    description: product.description ?? '',
    price: String(product.price),
    category: product.category,
    sizes: product.size
      ? product.size.split(',').map((s) => s.trim()).filter(Boolean)
      : ([] as string[]),
    availability: product.availability,
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setFormError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const body = await parseJsonResponse(res);
      if (!res.ok) {
        setFormError(apiErrorMessage(body, 'Image upload failed.'));
        return;
      }
      const url = body?.url;
      if (typeof url !== 'string' || !url) {
        setFormError('Image upload failed.');
        return;
      }
      setImageUrl(url);
    } catch {
      setFormError('Image upload failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!form.sizes.length) {
      setFormError('Select at least one size.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price) || 0,
          size: form.sizes.join(', '),
          image_url: imageUrl,
        }),
      });
      const body = await parseJsonResponse(res);
      if (!res.ok) {
        setFormError(apiErrorMessage(body, 'Could not update product.'));
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setFormError('Could not update product.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-lg border border-stone-200 bg-white p-6">
      {formError && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {formError}
        </p>
      )}
      <div>
        <label className="block text-sm font-medium text-stone-700">Image</label>
        <div className="mt-1 flex items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded bg-stone-100">
            <Image src={imageUrl} alt={product.name} fill className="object-cover" />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loading}
            className="text-sm text-stone-600 file:rounded file:border-0 file:bg-stone-100 file:px-3 file:py-2"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700">Name</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={3}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700">Price (KES)</label>
        <input
          type="number"
          required
          min={0}
          step={0.01}
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Sizes available
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            {SIZES.map((s) => {
              const checked = form.sizes.includes(s);
              return (
                <label key={s} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        sizes: e.target.checked
                          ? [...f.sizes, s]
                          : f.sizes.filter((size) => size !== s),
                      }))
                    }
                    className="h-4 w-4 rounded border-stone-300"
                  />
                  <span>{s}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="availability"
          checked={form.availability}
          onChange={(e) => setForm((f) => ({ ...f, availability: e.target.checked }))}
          className="h-4 w-4 rounded border-stone-300"
        />
        <label htmlFor="availability" className="text-sm text-stone-700">
          Available
        </label>
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Update product'}
        </button>
        <Link
          href="/admin"
          className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
