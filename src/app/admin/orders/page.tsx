import { checkRole } from '@/lib/roles';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { type AdminOrderCardData } from './AdminOrderCard';
import { AdminOrdersManager } from './AdminOrdersManager';
import { AdminCallout, AdminEmptyState, AdminHero } from '../AdminChrome';
import { ClipboardList } from 'lucide-react';

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
    .select(
      'id, created_at, total, payment_status, customer_name, customer_phone, customer_email, mpesa_message, mpesa_sender_name, users(email)'
    )
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="space-y-6">
        <AdminHero eyebrow="Sales" title="Orders" description="Review and approve M-Pesa payments." />
        <AdminCallout variant="danger" title="Could not load orders">
          {error.message}
        </AdminCallout>
      </div>
    );
  }

  const list = (orders as unknown as AdminOrder[] | null) ?? [];
  const pendingVerify = list.filter((o) => o.payment_status === 'submitted').length;

  return (
    <div className="space-y-8">
      <AdminHero
        eyebrow="Sales"
        title="Orders"
        description={
          <>
            New orders and M-Pesa submissions can email you when{' '}
            <span className="font-medium text-stone-800">SMTP</span> and{' '}
            <code className="rounded-md bg-white/80 px-1.5 py-0.5 text-xs ring-1 ring-stone-200/80">
              ADMIN_ORDERS_EMAIL
            </code>{' '}
            are set. Use <strong>Approve payment</strong> after you verify M-Pesa — no swiping.
            {pendingVerify > 0 && (
              <span className="mt-2 block text-sm font-medium text-sky-800">
                {pendingVerify} order{pendingVerify === 1 ? '' : 's'} awaiting verification
              </span>
            )}
          </>
        }
      />

      {list.length === 0 ? (
        <AdminEmptyState
          title="No orders yet"
          hint="When customers check out, their orders and M-Pesa details will appear here."
        />
      ) : (
        <AdminOrdersManager
          orders={list.map(
            (o): AdminOrderCardData => ({
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
            })
          )}
        />
      )}

      <AdminCallout variant="muted" title="Tip">
        <p className="flex items-start gap-2 text-xs sm:text-sm">
          <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" aria-hidden />
          Admin emails include a deep link to this page with <code className="rounded bg-white px-1">#order-…</code>{' '}
          so you can jump straight to the right card.
        </p>
      </AdminCallout>
    </div>
  );
}
