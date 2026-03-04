import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseUserId } from '@/lib/supabase/get-user-id';
import { CheckoutClient } from './CheckoutClient';

export default async function CheckoutPage() {
  const userId = await getSupabaseUserId();
  if (!userId) {
    redirect('/sign-in');
  }

  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from('cart_items')
    .select('*, product:products(*)')
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  const safeItems = items ?? [];
  if (!safeItems.length) {
    redirect('/cart');
  }

  const subtotal = safeItems.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0,
  );

  const itemCount = safeItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
        Checkout
      </h1>
      <p className="mt-2 text-sm text-stone-600 sm:text-base">
        Review your order and enter your details. Payment is simulated for now; we&apos;ll
        plug in M-Pesa Daraja here later.
      </p>

      <section className="mt-6 space-y-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-700">
          Order summary
        </h2>
        <div className="space-y-3 text-sm text-stone-700">
          {safeItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b border-stone-100 pb-2 last:border-b-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-stone-900">
                  {item.product?.name}
                </p>
                <p className="text-xs text-stone-500">
                  {item.product?.category} · {item.product?.size}
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="text-stone-500">x{item.quantity}</p>
                <p className="mt-1 font-semibold text-stone-900">
                  KES{' '}
                  {(
                    (item.product?.price ?? 0) * item.quantity
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-stone-200 pt-3 text-sm font-semibold text-stone-900">
            <span>Subtotal</span>
            <span>KES {subtotal.toLocaleString()}</span>
          </div>
          <p className="text-xs text-stone-500">
            Shipping is simulated and will be finalised when M-Pesa is integrated.
          </p>
        </div>
      </section>

      <CheckoutClient subtotal={subtotal} itemCount={itemCount} />
    </div>
  );
}

