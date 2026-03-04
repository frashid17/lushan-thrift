'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface CheckoutClientProps {
  subtotal: number;
  itemCount: number;
}

export function CheckoutClient({ subtotal, itemCount }: CheckoutClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSimulatePayment(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/orders', { method: 'POST' });
      if (res.status === 401) {
        toast.error('Sign in to complete checkout');
        router.push('/sign-in');
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.error || 'Failed to place order';
        toast.error(msg);
        return;
      }
      toast.success('Order placed!');
      router.push(`/checkout/success?orderId=${data.orderId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSimulatePayment} className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-800">
            Full name
          </label>
          <input
            type="text"
            required
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none"
            placeholder="e.g. Aisha Mwangi"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-800">
            Phone (M-Pesa)
          </label>
          <input
            type="tel"
            required
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none"
            placeholder="e.g. 07xx xxx xxx"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-stone-800">
          Delivery option
        </label>
        <div className="grid gap-2 text-sm text-stone-700 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2">
            <input type="radio" name="delivery" value="pickup" defaultChecked />
            <span>
              <span className="block font-medium">Pick up in Mombasa</span>
              <span className="text-xs text-stone-500">We&apos;ll text you pickup details.</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2">
            <input type="radio" name="delivery" value="shipping" />
            <span>
              <span className="block font-medium">Delivery across Kenya</span>
              <span className="text-xs text-stone-500">
                Shipping fee paid on delivery (simulated for now).
              </span>
            </span>
          </label>
        </div>
      </div>
      <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
        <p className="font-semibold text-stone-900">Payment status (simulated)</p>
        <p className="mt-1 text-xs text-stone-600 sm:text-sm">
          This checkout is in test mode. When we add M-Pesa Daraja, this step will open a
          real payment prompt on your phone. For now, clicking &quot;Place order&quot;
          will just simulate a successful payment and clear your cart.
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-600">
          {itemCount} item{itemCount === 1 ? '' : 's'} · Subtotal{' '}
          <span className="font-semibold text-stone-900">
            KES {subtotal.toLocaleString()}
          </span>
        </p>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-stone-900 px-8 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-60"
        >
          {loading ? 'Placing order...' : 'Place order (simulate payment)'}
        </button>
      </div>
    </form>
  );
}

