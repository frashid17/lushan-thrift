'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/payments', label: 'Payments' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/analytics', label: 'Analytics' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="no-scrollbar -mx-4 overflow-x-auto border-b border-stone-200 bg-white px-4">
      <div className="flex gap-3 py-2 text-sm">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== '/admin' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 font-medium ${
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

