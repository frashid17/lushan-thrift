'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { productPrimaryImage } from '@/lib/product-images';
import type { Product } from '@/types/database';

export function AdminProductsTable({ products }: { products: Product[] }) {
  const [list, setList] = useState(products);

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setList((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete');
    }
  }

  async function toggleAvailability(product: Product) {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: !product.availability }),
      });
      if (!res.ok) throw new Error();
      setList((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, availability: !p.availability } : p
        )
      );
      toast.success(product.availability ? 'Marked out of stock' : 'Marked in stock');
    } catch {
      toast.error('Failed to update');
    }
  }

  if (!list.length) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300/90 bg-stone-50/60 px-6 py-14 text-center">
        <p className="text-sm font-semibold text-stone-800">No products yet</p>
        <p className="mt-1 text-sm text-stone-500">Add your first listing — it will appear on the shop right away.</p>
        <Link
          href="/admin/products/new"
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800"
        >
          Add product
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile / tablet cards */}
      <div className="space-y-3 lg:hidden">
        {list.map((product) => (
          <div
            key={product.id}
            className="flex gap-3 rounded-2xl border border-stone-200/90 bg-white p-4 shadow-sm ring-1 ring-stone-100/80"
          >
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200/60">
              <Image
                src={productPrimaryImage(product)}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-stone-900 line-clamp-2">
                    {product.name}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    {product.category} · {product.size}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleAvailability(product)}
                  className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                    product.availability
                      ? 'bg-green-100 text-green-800'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {product.availability ? 'In stock' : 'Out of stock'}
                </button>
              </div>
              <p className="mt-2 text-sm font-semibold text-stone-900">
                KES {Number(product.price).toLocaleString()}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 shadow-sm transition hover:bg-stone-50"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Large screens table */}
      <div className="hidden overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm ring-1 ring-stone-100/80 lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50/90">
              <tr>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">
                  Image
                </th>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">
                  Name
                </th>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">
                  Price
                </th>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">
                  Category
                </th>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">
                  Size
                </th>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">
                  Stock
                </th>
                <th className="px-4 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {list.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-stone-100 ring-1 ring-stone-200/60">
                      <Image
                        src={productPrimaryImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-stone-900">{product.name}</td>
                  <td className="px-4 py-3 text-stone-600">
                    KES {Number(product.price).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-stone-600">{product.category}</td>
                  <td className="px-4 py-3 text-stone-600">{product.size}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleAvailability(product)}
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        product.availability
                          ? 'bg-green-100 text-green-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {product.availability ? 'In stock' : 'Out of stock'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="mr-2 inline-flex rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 shadow-sm transition hover:bg-stone-50"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="inline-flex rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
