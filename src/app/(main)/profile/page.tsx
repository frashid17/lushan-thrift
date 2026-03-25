import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Heart, ShoppingBag, Package } from 'lucide-react';
import { StorefrontHero, StorefrontPage, StorefrontPanel } from '@/components/layout/StorefrontChrome';

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const links = [
    { href: '/cart', label: 'Your cart', icon: ShoppingBag },
    { href: '/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/orders', label: 'My orders', icon: Package },
  ] as const;

  return (
    <StorefrontPage variant="slim">
      <StorefrontHero
        eyebrow="Account"
        title="Profile"
        description="Your Lushan Thrift account — jump to cart, saved pieces, or order history."
      />

      <StorefrontPanel>
        <div className="border-b border-stone-100 pb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400">Email</p>
          <p className="mt-1 text-base font-semibold text-stone-900">
            {user.emailAddresses[0]?.emailAddress}
          </p>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400">Name</p>
          <p className="mt-1 text-base font-semibold text-stone-900">
            {[user.firstName, user.lastName].filter(Boolean).join(' ') || '—'}
          </p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-2xl border border-stone-200/90 bg-stone-50/50 px-4 py-4 text-sm font-semibold text-stone-800 ring-1 ring-stone-100/80 transition hover:border-stone-300 hover:bg-white hover:shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-stone-700 shadow-sm ring-1 ring-stone-200/80">
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
              </span>
              {label}
            </Link>
          ))}
        </div>
      </StorefrontPanel>
    </StorefrontPage>
  );
}
