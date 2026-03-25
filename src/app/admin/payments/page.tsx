import { PaymentSettingsForm } from './PaymentSettingsForm';

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Payments</h1>
        <p className="mt-1 text-sm text-stone-600">
          Set the M-Pesa <strong>Buy goods</strong> number and the name customers see. Changes apply on checkout
          and order confirmation pages immediately.
        </p>
      </div>

      <PaymentSettingsForm />

      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
        <p className="font-medium text-stone-900">Email notifications (SMTP + app password)</p>
        <p className="mt-1 text-xs text-stone-600 sm:text-sm">
          Use your email provider&apos;s SMTP settings and an app password (e.g. Gmail: Google Account →
          Security → 2-Step Verification → App passwords).
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs sm:text-sm">
          <li>
            <code className="rounded bg-white px-1">SMTP_HOST</code> — e.g. <code className="rounded bg-white px-1">smtp.gmail.com</code>
          </li>
          <li>
            <code className="rounded bg-white px-1">SMTP_PORT</code> — usually <code className="rounded bg-white px-1">587</code> (set{' '}
            <code className="rounded bg-white px-1">SMTP_SECURE=false</code>) or <code className="rounded bg-white px-1">465</code> with{' '}
            <code className="rounded bg-white px-1">SMTP_SECURE=true</code>
          </li>
          <li>
            <code className="rounded bg-white px-1">SMTP_USER</code> — your full email address
          </li>
          <li>
            <code className="rounded bg-white px-1">SMTP_PASS</code> — app password (not your normal login)
          </li>
          <li>
            <code className="rounded bg-white px-1">EMAIL_FROM</code> — same mailbox, e.g.{' '}
            <code className="rounded bg-white px-1">Lushan Thrift &lt;you@gmail.com&gt;</code>
          </li>
          <li>
            <code className="rounded bg-white px-1">ADMIN_ORDERS_EMAIL</code> — inbox for new orders &amp; M-Pesa
            alerts (can match <code className="rounded bg-white px-1">SMTP_USER</code>)
          </li>
          <li>
            <code className="rounded bg-white px-1">NEXT_PUBLIC_APP_URL</code> — your shop URL (e.g.{' '}
            <code className="rounded bg-white px-1">https://yoursite.com</code>) so admin emails include a button to{' '}
            <strong>Orders</strong>
          </li>
        </ul>
      </div>
    </div>
  );
}
