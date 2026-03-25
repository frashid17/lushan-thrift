import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseUserId } from '@/lib/supabase/get-user-id';
import { CheckoutClient } from './CheckoutClient';
import { StorefrontHero, StorefrontPage, StorefrontPanel } from '@/components/layout/StorefrontChrome';

export default async function CheckoutPage() {
  const userId = await getSupabaseUserId();
  if (!userId) {
    redirect('/sign-in');
  }

  const clerkUser = await currentUser();
  const defaultFullName = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ').trim();
  const defaultEmail = clerkUser?.emailAddresses?.[0]?.emailAddress ?? '';

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
    0
  );

  const itemCount = safeItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StorefrontPage variant="narrow">
      <StorefrontHero
        eyebrow="Checkout"
        title="Almost yours"
        description="Choose your location, confirm your details, then pay with M-Pesa (Buy goods). You’ll add your payment confirmation on the order page after sending money."
      />

      <StorefrontPanel className="mb-6">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-400">
          Order summary
        </h2>
        <div className="mt-4 space-y-3 text-sm text-stone-700">
          {safeItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b border-stone-100 pb-3 last:border-b-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-stone-900">{item.product?.name}</p>
                <p className="text-xs text-stone-500">
                  {item.product?.category} · {item.product?.size}
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="font-medium text-stone-500">×{item.quantity}</p>
                <p className="mt-1 font-mono font-bold tabular-nums text-stone-900">
                  KES {((item.product?.price ?? 0) * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-stone-200 pt-4 text-base font-bold text-stone-900">
            <span>Subtotal</span>
            <span className="font-mono tabular-nums">KES {subtotal.toLocaleString()}</span>
          </div>
        </div>
      </StorefrontPanel>

      <CheckoutClient
        subtotal={subtotal}
        itemCount={itemCount}
        defaultFullName={defaultFullName}
        defaultEmail={defaultEmail}
      />
    </StorefrontPage>
  );
}
