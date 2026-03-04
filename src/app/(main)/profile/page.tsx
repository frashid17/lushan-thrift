import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-stone-900">Profile</h1>
      <div className="mt-6 rounded-lg border border-stone-200 bg-white p-6">
        <p className="text-sm text-stone-500">Email</p>
        <p className="mt-1 font-medium text-stone-900">{user.emailAddresses[0]?.emailAddress}</p>
        <p className="mt-4 text-sm text-stone-500">Name</p>
        <p className="mt-1 font-medium text-stone-900">
          {user.firstName} {user.lastName}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/cart"
            className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            View cart
          </Link>
          <Link
            href="/wishlist"
            className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Wishlist
          </Link>
          <Link
            href="/orders"
            className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            My orders
          </Link>
        </div>
      </div>
    </div>
  );
}
