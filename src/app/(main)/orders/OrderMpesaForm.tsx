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
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-xl border border-stone-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-stone-900">After paying on your phone</h3>
      <p className="text-xs text-stone-600">
        Paste the M-Pesa SMS confirmation (or the transaction message) and the name exactly as shown on M-Pesa.
      </p>
      {error && (
        <p className="rounded-md bg-red-50 px-2 py-1.5 text-xs text-red-800" role="alert">
          {error}
        </p>
      )}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-stone-700">M-Pesa message / confirmation</label>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900"
          placeholder="e.g. QEI123ABC Confirmed. Ksh1,000.00 sent to…"
        />
      </div>
      <div className="space-y-1">
        <label className="block text-xs font-medium text-stone-700">Your name on M-Pesa</label>
        <input
          type="text"
          required
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900"
          placeholder="As shown on the M-Pesa receipt"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-stone-900 px-5 py-2 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-60"
      >
        {loading ? 'Submitting…' : 'Submit payment details'}
      </button>
    </form>
  );
}
