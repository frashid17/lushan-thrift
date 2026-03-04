import { checkRole } from '@/lib/roles';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AdminNav } from './AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await checkRole('admin');
  if (!isAdmin) redirect('/');

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-stone-100 to-stone-50">
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white shadow-sm">
              LT
            </span>
            <div className="leading-tight">
              <p className="text-base font-semibold text-stone-900 sm:text-lg">
                Lushan Admin
              </p>
              <p className="text-[12px] text-stone-500">Mombasa • Kenya</p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-stone-200 bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-stone-800 sm:text-sm"
          >
            Back to shop
          </Link>
        </div>
        <div className="mx-auto max-w-6xl">
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="rounded-2xl border border-stone-200 bg-white/80 p-4 shadow-sm sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
