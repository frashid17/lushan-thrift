'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CheckoutLocationMap = dynamic(() => import('./CheckoutLocationMap'), { ssr: false });

const MOMBASA = { lat: -4.0435, lng: 39.6682 };

interface CheckoutClientProps {
  subtotal: number;
  itemCount: number;
  defaultFullName: string;
  defaultEmail: string;
}

type PaymentSettings = { mpesa_buy_goods: string; mpesa_till_name: string };

export function CheckoutClient({
  subtotal,
  itemCount,
  defaultFullName,
  defaultEmail,
}: CheckoutClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentSettings | null>(null);

  const [fullName, setFullName] = useState(defaultFullName);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(defaultEmail);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'shipping'>('shipping');
  const [lat, setLat] = useState(MOMBASA.lat);
  const [lng, setLng] = useState(MOMBASA.lng);
  const [addressNote, setAddressNote] = useState('');

  useEffect(() => {
    fetch('/api/payment-settings')
      .then((r) => r.json())
      .then((data) => {
        if (data?.mpesa_buy_goods && data?.mpesa_till_name) {
          setPaymentInfo({
            mpesa_buy_goods: data.mpesa_buy_goods,
            mpesa_till_name: data.mpesa_till_name,
          });
        }
      })
      .catch(() =>
        setPaymentInfo({ mpesa_buy_goods: '12345', mpesa_till_name: 'lushanthrift' })
      );
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: fullName,
          customerPhone: phone,
          customerEmail: email || null,
          deliveryType,
          deliveryLat: lat,
          deliveryLng: lng,
          deliveryAddressLabel:
            addressNote.trim() ||
            (deliveryType === 'pickup' ? 'Pick up — map location' : 'Delivery — map location'),
        }),
      });
      if (res.status === 401) {
        router.push('/sign-in');
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Could not place order.');
        return;
      }
      router.push(`/checkout/success?orderId=${data.orderId}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const mpesa = paymentInfo ?? { mpesa_buy_goods: '12345', mpesa_till_name: 'lushanthrift' };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      {error && (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      )}

      <section className="space-y-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-700">
          1. Delivery location
        </h2>
        <p className="text-xs text-stone-600 sm:text-sm">
          Pin where you want pickup or delivery. You can use your current location or tap the map.
        </p>
        <CheckoutLocationMap
          lat={lat}
          lng={lng}
          onLocationChange={(la, ln) => {
            setLat(la);
            setLng(ln);
          }}
        />
        <div className="space-y-1">
          <label className="block text-xs font-medium text-stone-700">
            Address / landmark (optional)
          </label>
          <input
            type="text"
            value={addressNote}
            onChange={(e) => setAddressNote(e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900"
            placeholder="e.g. Near City Mall, apartment name, gate code…"
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-700">
          2. Your details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-stone-800">Full name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900"
              placeholder="e.g. Aisha Mwangi"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-stone-800">Phone (M-Pesa)</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900"
              placeholder="e.g. 07xx xxx xxx"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-stone-800">Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-md rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900"
            placeholder="For payment confirmation updates"
          />
        </div>
        <div className="space-y-2">
          <span className="block text-sm font-medium text-stone-800">Delivery option</span>
          <div className="grid gap-2 text-sm text-stone-700 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2">
              <input
                type="radio"
                name="delivery"
                checked={deliveryType === 'pickup'}
                onChange={() => setDeliveryType('pickup')}
              />
              <span>
                <span className="block font-medium">Pick up in Mombasa</span>
                <span className="text-xs text-stone-500">We&apos;ll confirm pickup details after payment.</span>
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2">
              <input
                type="radio"
                name="delivery"
                checked={deliveryType === 'shipping'}
                onChange={() => setDeliveryType('shipping')}
              />
              <span>
                <span className="block font-medium">Delivery across Kenya</span>
                <span className="text-xs text-stone-500">Coordinate delivery after payment is approved.</span>
              </span>
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-stone-200 bg-amber-50/80 p-4 sm:p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-800">
          3. Pay with M-Pesa (Buy goods)
        </h2>
        <ol className="list-decimal space-y-2 pl-4 text-sm text-stone-800">
          <li>
            Open M-Pesa on your phone → <strong>Lipa na M-Pesa</strong> → <strong>Buy goods</strong>.
          </li>
          <li>
            Till / buy goods number:{' '}
            <strong className="font-mono text-base">{mpesa.mpesa_buy_goods}</strong>
          </li>
          <li>
            Business name shown: <strong>{mpesa.mpesa_till_name}</strong>
          </li>
          <li>
            Enter amount: <strong>KES {subtotal.toLocaleString()}</strong>
          </li>
          <li>Complete the payment on your phone, then place your order below.</li>
        </ol>
        <p className="text-xs text-stone-600">
          After your order is created, you&apos;ll add the M-Pesa confirmation message and the name on your
          M-Pesa account from your orders page.
        </p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-600">
          {itemCount} item{itemCount === 1 ? '' : 's'} ·{' '}
          <span className="font-semibold text-stone-900">KES {subtotal.toLocaleString()}</span>
        </p>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-stone-900 px-8 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-60"
        >
          {loading ? 'Placing order…' : 'Place order'}
        </button>
      </div>
    </form>
  );
}
