import type { ReactNode } from 'react';
import { formatKenyaDateTime } from '@/lib/datetime';
import { ApprovePaymentButton } from './ApprovePaymentButton';

export type AdminOrderCardData = {
  id: string;
  created_at: string;
  total: number;
  payment_status: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  mpesa_message: string | null;
  mpesa_sender_name: string | null;
  accountEmail: string | null;
};

function PaymentStatusBadge({ status }: { status: string }) {
  if (status === 'approved') {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">
        Approved
      </span>
    );
  }
  if (status === 'submitted') {
    return (
      <span className="inline-flex items-center rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-900">
        Awaiting verification
      </span>
    );
  }
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
        Payment pending
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-medium text-stone-800">
      {status}
    </span>
  );
}

export function AdminOrderCard({
  o,
  footerExtra,
}: {
  o: AdminOrderCardData;
  footerExtra?: ReactNode;
}) {
  const emailLine = o.customer_email ?? o.accountEmail ?? null;

  return (
    <article
      id={`order-${o.id}`}
      className="scroll-mt-28 flex flex-col rounded-2xl border border-stone-200/90 bg-white p-4 shadow-sm ring-1 ring-stone-100/80 transition hover:shadow-md sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-stone-100 pb-3">
        <div>
          <p className="font-mono text-sm font-semibold text-stone-900">
            #{o.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="mt-0.5 text-xs text-stone-500">{formatKenyaDateTime(o.created_at)} EAT</p>
        </div>
        <PaymentStatusBadge status={o.payment_status} />
      </div>

      <div className="mt-3 space-y-2 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Customer</p>
        <p className="font-medium text-stone-900">{o.customer_name}</p>
        <p className="text-stone-700">{o.customer_phone}</p>
        {emailLine && <p className="break-all text-stone-600">{emailLine}</p>}
      </div>

      <p className="mt-4 text-lg font-bold text-stone-900">KES {Number(o.total).toLocaleString()}</p>

      <div className="mt-4 rounded-xl bg-stone-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">M-Pesa details</p>
        {o.mpesa_message ? (
          <p className="mt-2 whitespace-pre-wrap break-words text-sm text-stone-800">{o.mpesa_message}</p>
        ) : (
          <p className="mt-2 text-sm text-stone-400">Not submitted yet</p>
        )}
        {o.mpesa_sender_name && (
          <p className="mt-2 text-sm font-medium text-stone-800">From: {o.mpesa_sender_name}</p>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-stone-100 pt-4">
        {o.payment_status === 'submitted' ? (
          <ApprovePaymentButton orderId={o.id} />
        ) : o.payment_status === 'approved' ? (
          <p className="flex items-center gap-2 text-sm font-medium text-emerald-800">
            <span className="text-lg leading-none" aria-hidden>
              ✓
            </span>
            Payment confirmed — no action needed
          </p>
        ) : (
          <p className="text-sm text-stone-500">Waiting for customer to pay and submit M-Pesa details.</p>
        )}
        {footerExtra && <div className="pt-2">{footerExtra}</div>}
      </div>
    </article>
  );
}
