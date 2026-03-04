'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';
import { ShoppingBag, Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';

export function Header() {
  const { isSignedIn, user } = useUser();
  const isAdmin = (user?.publicMetadata as { role?: string } | null)?.role === 'admin';
  const pathname = usePathname();

  const onShop = pathname.startsWith('/shop');
  const onCart = pathname.startsWith('/cart');
  const onWishlist = pathname.startsWith('/wishlist');
  const onOrders = pathname.startsWith('/orders');
  const onProfile = pathname.startsWith('/profile');
  const onAdmin = pathname.startsWith('/admin');

  const cartItems = useCartStore((s) => s.items);
  const setCartItems = useCartStore((s) => s.setItems);
  const totalCartItems = useCartStore((s) => s.totalItems);

  const wishlistItems = useWishlistStore((s) => s.items);
  const setWishlistItems = useWishlistStore((s) => s.setItems);

  useEffect(() => {
    if (!isSignedIn) return;
    // Hydrate cart from API if empty
    if (!cartItems.length) {
      fetch('/api/cart')
        .then((res) => res.json())
        .then((data) => setCartItems(data.items ?? []))
        .catch(() => {});
    }
    // Hydrate wishlist from API if empty
    if (!wishlistItems.length) {
      fetch('/api/wishlist')
        .then((res) => res.json())
        .then((data) => setWishlistItems(data.items ?? []))
        .catch(() => {});
    }
  }, [isSignedIn, cartItems.length, wishlistItems.length, setCartItems, setWishlistItems]);

  const cartCount = totalCartItems();
  const wishlistCount = wishlistItems.length;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-stone-900 shadow-sm">
            <Image
              src="/logo1.png"
              alt="Lushan Thrift logo"
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <div className="leading-tight">
            <p className="text-base font-semibold tracking-tight text-stone-900 sm:text-lg">
              Lushan Thrift
            </p>
            <p className="hidden text-[12px] text-stone-500 sm:block">
              Mombasa · Kenya
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-sm font-medium text-stone-600 sm:flex">
            <Link
              href={onShop ? '/' : '/shop'}
              className={`rounded-full px-3 py-1 ${
                onShop
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {onShop ? 'Back home' : 'Shop'}
            </Link>
          </div>

          {isSignedIn && (
            <>
              <Link
                href="/cart"
                className={`relative flex items-center gap-1 rounded-full px-2 py-1 text-stone-600 hover:bg-stone-100 hover:text-stone-900 ${
                  onCart ? 'bg-stone-100 text-stone-900' : ''
                }`}
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-stone-900 px-1 text-[10px] font-semibold text-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
              <Link
                href="/wishlist"
                className={`relative flex items-center gap-1 rounded-full px-2 py-1 text-stone-600 hover:bg-stone-100 hover:text-stone-900 ${
                  onWishlist ? 'bg-stone-100 text-stone-900' : ''
                }`}
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-stone-900 px-1 text-[10px] font-semibold text-white">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                href="/orders"
                className={`hidden rounded-full px-3.5 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 sm:inline-flex ${
                  onOrders ? 'bg-stone-100 text-stone-900' : ''
                }`}
              >
                My orders
              </Link>
              <Link
                href="/profile"
                className={`hidden rounded-full px-3.5 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 sm:inline-flex ${
                  onProfile ? 'bg-stone-100 text-stone-900' : ''
                }`}
              >
                Profile
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`hidden rounded-full px-3.5 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-50 hover:text-amber-800 sm:inline-flex ${
                    onAdmin ? 'bg-amber-50' : ''
                  }`}
                >
                  Admin
                </Link>
              )}
            </>
          )}
          {!isSignedIn && (
            <SignInButton mode="modal">
              <button className="rounded-full bg-stone-900 px-4 py-2 text-xs font-medium text-white hover:bg-stone-800">
                Sign in
              </button>
            </SignInButton>
          )}
          {isSignedIn && (
            <div className="ml-1">
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
