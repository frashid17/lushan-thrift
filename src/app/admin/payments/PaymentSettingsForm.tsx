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
    return <p className="text-sm text-stone-500">Loading…</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div>
        <label className="block text-sm font-medium text-stone-800">Buy goods / till number</label>
        <input
          value={buyGoods}
          onChange={(e) => setBuyGoods(e.target.value)}
          required
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900"
          placeholder="12345"
        />
        <p className="mt-1 text-xs text-stone-500">Shown on checkout and success page.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-800">M-Pesa business name</label>
        <input
          value={tillName}
          onChange={(e) => setTillName(e.target.value)}
          required
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900"
          placeholder="lushanthrift"
        />
      </div>
      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {message && <p className="text-sm text-green-800">{message}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-stone-900 px-5 py-2 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save payment display'}
      </button>
    </form>
  );
}
