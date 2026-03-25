'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
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
      <p className="rounded-lg border border-stone-200 bg-white p-8 text-center text-stone-500">
        No products yet. Add your first product.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile / tablet cards */}
      <div className="space-y-3 lg:hidden">
        {list.map((product) => (
          <div
            key={product.id}
            className="flex gap-3 rounded-lg border border-stone-200 bg-white p-4"
          >
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-stone-100">
              <Image
                src={product.image_url}
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
                  className="text-sm font-medium text-stone-600 hover:text-stone-900"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Large screens table */}
      <div className="hidden overflow-hidden rounded-lg border border-stone-200 bg-white lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-stone-500">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-stone-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-stone-500">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-stone-500">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-stone-500">
                  Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-stone-500">
                  Stock
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-stone-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {list.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded bg-stone-100">
                      <Image
                        src={product.image_url}
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
                      className="mr-3 text-sm font-medium text-stone-600 hover:text-stone-900"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
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
