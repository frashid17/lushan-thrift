import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100 mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <Link href="/" className="text-lg font-semibold text-stone-900">
              Lushan Thrift
            </Link>
            <p className="mt-2 text-sm text-stone-600">
              Pre-loved fashion in Mombasa & Kenya. Sustainable. Unique.
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Shop</h3>
              <ul className="mt-2 space-y-1 text-sm text-stone-600">
                <li><Link href="/shop" className="hover:text-stone-900">All products</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Account</h3>
              <ul className="mt-2 space-y-1 text-sm text-stone-600">
                <li><Link href="/profile" className="hover:text-stone-900">Profile</Link></li>
                <li><Link href="/cart" className="hover:text-stone-900">Cart</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} Lushan Thrift. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
