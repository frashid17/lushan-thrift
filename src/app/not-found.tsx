import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-stone-900 sm:text-5xl">404</h1>
      <p className="mt-2 text-lg text-stone-600">Page not found</p>
      <p className="mt-1 text-sm text-stone-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
      >
        Back to home
      </Link>
      <Link
        href="/shop"
        className="mt-3 inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-100"
      >
        Browse shop
      </Link>
    </div>
  );
}
