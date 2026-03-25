'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function OrderMpesaForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/mpesa-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mpesaMessage: message, mpesaSenderName: senderName }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Could not save details.');
        return;
      }
      router.refresh();
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 to-white p-4 ring-1 ring-amber-100/60 sm:p-5"
    >
      <div>
        <h3 className="text-sm font-bold text-stone-900">After paying on your phone</h3>
        <p className="mt-1 text-xs leading-relaxed text-stone-600">
          Paste the M-Pesa SMS confirmation (or the transaction message) and the name exactly as shown
          on M-Pesa.
        </p>
      </div>
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800" role="alert">
          {error}
        </p>
      )}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-stone-700">M-Pesa message / confirmation</label>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm text-stone-900"
          placeholder="e.g. QEI123ABC Confirmed. Ksh1,000.00 sent to…"
        />
      </div>
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-stone-700">Your name on M-Pesa</label>
        <input
          type="text"
          required
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm text-stone-900"
          placeholder="As shown on the M-Pesa receipt"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 disabled:opacity-60"
      >
        {loading ? 'Submitting…' : 'Submit payment details'}
      </button>
    </form>
  );
}
