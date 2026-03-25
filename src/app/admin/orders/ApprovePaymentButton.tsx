'use client';

import { BadgeCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ApprovePaymentButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onApprove() {
    setError(null);
    const ok = window.confirm(
      'Approve this payment? The customer will get a confirmation email if we have their address.'
    );
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/approve-payment`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Could not approve');
        return;
      }
      router.refresh();
    } catch {
      setError('Request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-2">
      <button
        type="button"
        onClick={onApprove}
        disabled={loading}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-60 sm:min-h-[44px]"
      >
        <BadgeCheck className="h-5 w-5 shrink-0" aria-hidden />
        {loading ? 'Approving…' : 'Approve payment'}
      </button>
      {error && (
        <p className="text-center text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
