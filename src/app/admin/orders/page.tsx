import { checkRole } from '@/lib/roles';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { AdminOrderCard, type AdminOrderCardData } from './AdminOrderCard';

type AdminOrder = {
  id: string;
  created_at: string;
  total: number;
  payment_status: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  mpesa_message: string | null;
  mpesa_sender_name: string | null;
  users: { email: string } | { email: string }[] | null;
};

function accountEmail(users: AdminOrder['users']): string | null {
  if (!users) return null;
  return Array.isArray(users) ? users[0]?.email ?? null : users.email;
}

export default async function AdminOrdersPage() {
  const isAdmin = await checkRole('admin');
  if (!isAdmin) redirect('/');

  const admin = createAdminClient();
  const { data: orders, error } = await admin
    .from('orders')
    .select('id, created_at, total, payment_status, customer_name, customer_phone, customer_email, mpesa_message, mpesa_sender_name, users(email)')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        Could not load orders: {error.message}
      </div>
    );
  }

  const list = (orders as unknown as AdminOrder[] | null) ?? [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">Orders</h1>
        <p className="mt-1 text-sm text-stone-600">
          New orders and M-Pesa submissions can email you when{' '}
          <span className="font-medium text-stone-800">SMTP</span> and{' '}
          <code className="rounded bg-stone-100 px-1 py-0.5 text-xs">ADMIN_ORDERS_EMAIL</code> are set in
          your environment. Tap <strong>Approve payment</strong> after you verify M-Pesa in your phone or
          bank app — no swiping required.
        </p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white/60 p-8 text-center text-sm text-stone-500">
          No orders yet.
        </div>
      ) : (
        <ul className="grid list-none gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
          {list.map((o) => {
            const card: AdminOrderCardData = {
              id: o.id,
              created_at: o.created_at,
              total: o.total,
              payment_status: o.payment_status,
              customer_name: o.customer_name,
              customer_phone: o.customer_phone,
              customer_email: o.customer_email,
              mpesa_message: o.mpesa_message,
              mpesa_sender_name: o.mpesa_sender_name,
              accountEmail: accountEmail(o.users),
            };
            return (
              <li key={o.id}>
                <AdminOrderCard o={card} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
