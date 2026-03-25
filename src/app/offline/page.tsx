import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-stone-50 px-4 text-center">
      <div className="max-w-sm rounded-[1.75rem] border border-stone-200/90 bg-white px-8 py-10 shadow-sm ring-1 ring-stone-100/80">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">You&apos;re offline</h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Check your connection — we&apos;ll be here when you&apos;re back online.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
