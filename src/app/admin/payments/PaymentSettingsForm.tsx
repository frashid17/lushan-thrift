'use client';

import { useEffect, useState } from 'react';

export function PaymentSettingsForm() {
  const [buyGoods, setBuyGoods] = useState('');
  const [tillName, setTillName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/payment-settings')
      .then((r) => r.json())
      .then((data) => {
        if (data?.mpesa_buy_goods) setBuyGoods(data.mpesa_buy_goods);
        if (data?.mpesa_till_name) setTillName(data.mpesa_till_name);
      })
      .catch(() => setError('Could not load settings'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/payment-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mpesa_buy_goods: buyGoods.trim(), mpesa_till_name: tillName.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Save failed');
        return;
      }
      setMessage('Saved. Customers will see this on checkout.');
    } catch {
      setError('Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-stone-50/60">
        <p className="text-sm text-stone-500">Loading settings…</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg space-y-5 rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm ring-1 ring-stone-100/80 sm:p-6"
    >
      <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400">M-Pesa display</h2>
      <div>
        <label className="block text-sm font-semibold text-stone-800">Buy goods / till number</label>
        <input
          value={buyGoods}
          onChange={(e) => setBuyGoods(e.target.value)}
          required
          className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm text-stone-900"
          placeholder="12345"
        />
        <p className="mt-1.5 text-xs text-stone-500">Shown on checkout and order success.</p>
      </div>
      <div>
        <label className="block text-sm font-semibold text-stone-800">M-Pesa business name</label>
        <input
          value={tillName}
          onChange={(e) => setTillName(e.target.value)}
          required
          className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm text-stone-900"
          placeholder="lushanthrift"
        />
      </div>
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800 disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save payment display'}
      </button>
    </form>
  );
}
