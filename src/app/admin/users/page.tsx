import { clerkClient } from '@clerk/nextjs/server';
import { makeAdmin, removeAdmin } from './actions';
import { AdminCallout, AdminHero, AdminStatBadge } from '../AdminChrome';

export default async function AdminUsersPage() {
  const client = await clerkClient();
  const result = await client.users.getUserList({ limit: 100, orderBy: '-created_at' });
  const users = result.data;

  const adminUsers = users.filter(
    (u) => (u.publicMetadata as { role?: string } | null)?.role === 'admin',
  );

  return (
    <div className="space-y-8">
      <AdminHero
        eyebrow="Access"
        title="Users"
        description="Everyone who has signed in with Clerk. Promote trusted people to admin or remove admin access from a row."
        right={
          <>
            <AdminStatBadge label="Customers" value={users.length} sub="Clerk accounts" />
            <AdminStatBadge label="Admins" value={adminUsers.length} sub="Dashboard access" />
          </>
        }
      />

      {!users.length ? (
        <div className="rounded-2xl border border-dashed border-stone-300/90 bg-stone-50/60 px-6 py-14 text-center text-sm text-stone-500">
          No users yet. When customers sign in they will appear here.
        </div>
      ) : (
        <>
          <AdminCallout variant="muted" title="Admin roles">
            <p className="text-xs sm:text-sm">
              Admins can manage products, orders, payments, and contact settings. Only promote people you
              trust.
            </p>
          </AdminCallout>

          <section className="space-y-3">
            <div className="space-y-3 sm:hidden">
              {users.map((user) => {
                const primaryEmail =
                  user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
                    ?.emailAddress ?? '';
                const isAdminUser =
                  (user.publicMetadata as { role?: string } | null)?.role === 'admin';

                return (
                  <div
                    key={user.id}
                    className="rounded-2xl border border-stone-200/90 bg-white p-4 shadow-sm ring-1 ring-stone-100/80"
                  >
                    <p className="text-sm font-semibold text-stone-900">
                      {user.firstName || user.lastName
                        ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
                        : primaryEmail}
                    </p>
                    {user.username && (
                      <p className="mt-0.5 text-xs text-stone-500">@{user.username}</p>
                    )}
                    <p className="mt-1 text-xs text-stone-500 break-all">{primaryEmail}</p>
                    <p className="mt-1 text-xs text-stone-500">
                      Joined{' '}
                      {new Date(user.createdAt).toLocaleDateString('en-KE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-stone-100 pt-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                          isAdminUser
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {isAdminUser ? 'Admin' : 'Customer'}
                      </span>
                      <form action={isAdminUser ? removeAdmin : makeAdmin} className="inline">
                        <input type="hidden" name="id" value={user.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-800 shadow-sm transition hover:bg-stone-50"
                        >
                          {isAdminUser ? 'Remove admin' : 'Make admin'}
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm ring-1 ring-stone-100/80 sm:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200 text-sm">
                  <thead className="bg-stone-50/90">
                    <tr>
                      <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">
                        Name
                      </th>
                      <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">
                        Username
                      </th>
                      <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">
                        Email
                      </th>
                      <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">
                        Role
                      </th>
                      <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">
                        Joined
                      </th>
                      <th className="px-4 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {users.map((user) => {
                      const primaryEmail =
                        user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
                          ?.emailAddress ?? '';
                      const isAdminUser =
                        (user.publicMetadata as { role?: string } | null)?.role === 'admin';
                      const fullName =
                        user.firstName || user.lastName
                          ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
                          : '';

                      return (
                        <tr key={user.id} className="transition hover:bg-stone-50/80">
                          <td className="px-4 py-3.5 font-medium text-stone-900">{fullName || '—'}</td>
                          <td className="px-4 py-3.5 text-stone-600">
                            {user.username ? `@${user.username}` : '—'}
                          </td>
                          <td className="max-w-[200px] truncate px-4 py-3.5 text-stone-600">
                            {primaryEmail}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                                isAdminUser
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              {isAdminUser ? 'Admin' : 'Customer'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-stone-600">
                            {new Date(user.createdAt).toLocaleDateString('en-KE', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <form action={isAdminUser ? removeAdmin : makeAdmin} className="inline">
                              <input type="hidden" name="id" value={user.id} />
                              <button
                                type="submit"
                                className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 shadow-sm transition hover:bg-stone-50"
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
