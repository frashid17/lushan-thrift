'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteOrderButton({
  orderId,
  shortLabel,
  variant = 'card',
}: {
  orderId: string;
  shortLabel: string;
  variant?: 'card' | 'toolbar';
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    const ok = window.confirm(
      `Permanently delete order ${shortLabel}? This removes the order and its line items. It cannot be undone.`
    );
    if (!ok) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        window.alert(typeof data?.error === 'string' ? data.error : 'Could not delete order');
        return;
      }
      router.refresh();
    } catch {
      window.alert('Request failed');
    } finally {
      setLoading(false);
    }
  }

  const base =
    variant === 'toolbar'
      ? 'inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50'
      : 'inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50';

  return (
    <button type="button" onClick={onDelete} disabled={loading} className={base}>
      <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
      {loading ? 'Deleting…' : 'Delete order'}
    </button>
  );
}
