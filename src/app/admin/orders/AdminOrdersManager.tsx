'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AdminOrderCard, type AdminOrderCardData } from './AdminOrderCard';
import { DeleteOrderButton } from './DeleteOrderButton';

type Props = { orders: AdminOrderCardData[] };

export function AdminOrdersManager({ orders }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const allIds = useMemo(() => orders.map((o) => o.id), [orders]);
  const allSelected = orders.length > 0 && selected.size === orders.length;
  const someSelected = selected.size > 0;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  }

  async function bulkDelete() {
    const ids = [...selected];
    if (ids.length === 0) return;
    const ok = window.confirm(
      `Permanently delete ${ids.length} order${ids.length === 1 ? '' : 's'}? Revenue totals in your analytics will no longer include them. This cannot be undone.`
    );
    if (!ok) return;
    setBulkLoading(true);
    try {
      const res = await fetch('/api/admin/orders/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        window.alert(typeof data?.error === 'string' ? data.error : 'Bulk delete failed');
        return;
      }
      setSelected(new Set());
      router.refresh();
    } catch {
      window.alert('Request failed');
    } finally {
      setBulkLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200/90 bg-stone-50/80 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-stone-800">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="h-4 w-4 rounded border-stone-300"
            aria-label="Select all orders"
          />
          Select all ({orders.length})
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!someSelected || bulkLoading}
            onClick={bulkDelete}
            className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-40"
          >
            {bulkLoading ? 'Deleting…' : `Delete selected (${selected.size})`}
          </button>
        </div>
      </div>

      <ul className="grid list-none gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {orders.map((o) => (
          <li key={o.id} className="flex gap-3">
            <div className="flex shrink-0 items-start pt-5">
              <input
                type="checkbox"
                checked={selected.has(o.id)}
                onChange={() => toggle(o.id)}
                className="h-4 w-4 rounded border-stone-300"
                aria-label={`Select order ${o.id.slice(0, 8)}`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <AdminOrderCard
                o={o}
                footerExtra={<DeleteOrderButton orderId={o.id} shortLabel={`#${o.id.slice(0, 8).toUpperCase()}`} />}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
