import { clerkClient } from '@clerk/nextjs/server';
import { makeAdmin, removeAdmin } from './actions';

export default async function AdminUsersPage() {
  const client = await clerkClient();
  const result = await client.users.getUserList({ limit: 100, orderBy: '-created_at' });
  const users = result.data;

  const adminUsers = users.filter(
    (u) => (u.publicMetadata as { role?: string } | null)?.role === 'admin',
  );

  return (
    <div className="space-y-6">
      {/* Customers overview */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">Users</h1>
          <p className="mt-1 text-sm text-stone-600 sm:text-base">
            See who&apos;s shopping with Lushan Thrift and manage who has admin access.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm sm:text-base">
          <div className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-left shadow-sm">
            <p className="text-[11px] font-medium uppercase tracking-wide text-stone-500">
              Customers
            </p>
            <p className="mt-1 text-lg font-semibold text-stone-900">
              {users.length}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-left shadow-sm">
            <p className="text-[11px] font-medium uppercase tracking-wide text-stone-500">
              Admins
            </p>
            <p className="mt-1 text-lg font-semibold text-stone-900">
              {adminUsers.length}
            </p>
          </div>
        </div>
      </section>

      {!users.length ? (
        <p className="rounded-xl border border-stone-200 bg-white p-6 text-center text-sm text-stone-500">
          No users yet. Once customers sign in with Clerk they will appear here.
        </p>
      ) : (
        <>
          {/* Settings helper */}
          <section className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-4 text-xs text-stone-600 sm:text-sm">
            <p className="font-medium text-stone-800">Admin settings</p>
            <p className="mt-1">
              Use the actions on each row to promote a customer to admin or remove admin
              access. Admins can access the full dashboard, products, orders, and
              settings.
            </p>
          </section>

          <section className="space-y-3">
            {/* Mobile cards */}
            <div className="space-y-3 sm:hidden">
              {users.map((user) => {
                const primaryEmail =
                  user.emailAddresses.find(
                    (email) => email.id === user.primaryEmailAddressId,
                  )?.emailAddress ?? '';
                const isAdminUser =
                  (user.publicMetadata as { role?: string } | null)?.role === 'admin';

                return (
                  <div
                    key={user.id}
                    className="rounded-lg border border-stone-200 bg-white p-4"
                  >
                    <p className="text-sm font-semibold text-stone-900">
                      {user.firstName || user.lastName
                        ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
                        : primaryEmail}
                    </p>
                    {user.username && (
                      <p className="mt-0.5 text-xs text-stone-500">
                        @{user.username}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-stone-500">{primaryEmail}</p>
                    <p className="mt-1 text-xs text-stone-500">
                      Joined{' '}
                      {new Date(user.createdAt).toLocaleDateString('en-KE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${
                          isAdminUser
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {isAdminUser ? 'Admin' : 'Customer'}
                      </span>
                      <form
                        action={isAdminUser ? removeAdmin : makeAdmin}
                        className="inline"
                      >
                        <input type="hidden" name="id" value={user.id} />
                        <button
                          type="submit"
                          className="text-xs font-medium text-stone-900 underline-offset-2 hover:underline"
                        >
                          {isAdminUser ? 'Remove admin' : 'Make admin'}
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-xl border border-stone-200 bg-white sm:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200 text-sm">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-stone-500">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-stone-500">
                        Username
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-stone-500">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-stone-500">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-stone-500">
                        Joined
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-stone-500">
                        Settings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {users.map((user) => {
                      const primaryEmail =
                        user.emailAddresses.find(
                          (email) => email.id === user.primaryEmailAddressId,
                        )?.emailAddress ?? '';
                      const isAdminUser =
                        (user.publicMetadata as { role?: string } | null)?.role ===
                        'admin';
                      const fullName =
                        user.firstName || user.lastName
                          ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
                          : '';

                      return (
                        <tr key={user.id}>
                          <td className="px-4 py-3 text-stone-900">
                            {fullName || '—'}
                          </td>
                          <td className="px-4 py-3 text-stone-700">
                            {user.username ? `@${user.username}` : '—'}
                          </td>
                          <td className="px-4 py-3 text-stone-700">{primaryEmail}</td>
                          <td className="px-4 py-3 text-stone-700">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium uppercase ${
                                isAdminUser
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              {isAdminUser ? 'Admin' : 'Customer'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-stone-600">
                            {new Date(user.createdAt).toLocaleDateString('en-KE', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="px-4 py-3 text-right text-xs">
                            <form
                              action={isAdminUser ? removeAdmin : makeAdmin}
                              className="inline"
                            >
                              <input type="hidden" name="id" value={user.id} />
                              <button
                                type="submit"
                                className="rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-stone-800 hover:bg-stone-50"
                              >
                                {isAdminUser ? 'Remove admin' : 'Make admin'}
                              </button>
                            </form>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

