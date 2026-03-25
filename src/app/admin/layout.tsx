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
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white shadow-sm sm:h-8 sm:w-8">
              LT
            </span>
            <div className="min-w-0 leading-tight">
              <p className="text-base font-semibold text-stone-900 sm:text-lg">Lushan Admin</p>
              <p className="text-[11px] text-stone-500 sm:text-[12px]">Mombasa • Kenya</p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-stone-200 bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 sm:w-auto sm:py-2"
          >
            Back to shop
          </Link>
        </div>
        <div className="mx-auto max-w-6xl px-1 sm:px-6">
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-8">
        <div className="rounded-2xl border border-stone-200 bg-white/80 p-3 shadow-sm sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
