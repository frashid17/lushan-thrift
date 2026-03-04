import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-stone-900">You&apos;re offline</h1>
      <p className="mt-2 text-stone-600">Check your connection and try again.</p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-stone-900 px-6 py-3 text-sm font-medium text-white hover:bg-stone-800"
      >
        Go home
      </Link>
    </div>
  );
}
