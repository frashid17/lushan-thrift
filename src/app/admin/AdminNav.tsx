'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/payments', label: 'Payments' },
  { href: '/admin/contact', label: 'Contact' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/analytics', label: 'Analytics' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      className="border-b border-stone-200 bg-white py-2"
      aria-label="Admin sections"
    >
      <div className="flex flex-wrap gap-2 sm:gap-2.5">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== '/admin' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex min-h-[40px] min-w-0 items-center justify-center rounded-full px-3.5 py-2 text-[13px] font-medium sm:min-h-0 sm:py-1.5 sm:text-sm ${
                isActive
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

