import { PaymentSettingsForm } from './PaymentSettingsForm';
import { AdminCallout, AdminHero } from '../AdminChrome';

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-8">
      <AdminHero
        eyebrow="Money"
        title="Payments"
        description={
          <>
            Set the M-Pesa <strong>Buy goods</strong> number and the business name shoppers see. Updates apply
            on checkout and order success pages right away.
          </>
        }
      />

      <PaymentSettingsForm />

      <AdminCallout title="Email notifications (SMTP + app password)">
        <p className="text-xs text-stone-600 sm:text-sm">
          Use your provider&apos;s SMTP settings and an app password (e.g. Gmail: Google Account → Security →
          2-Step Verification → App passwords).
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs sm:text-sm">
          <li>
            <code className="rounded-md bg-stone-100 px-1.5 py-0.5">SMTP_HOST</code> — e.g.{' '}
            <code className="rounded-md bg-stone-100 px-1.5 py-0.5">smtp.gmail.com</code>
          </li>
          <li>
            <code className="rounded-md bg-stone-100 px-1.5 py-0.5">SMTP_PORT</code> — usually{' '}
            <code className="rounded-md bg-stone-100 px-1.5 py-0.5">587</code> (
            <code className="rounded-md bg-stone-100 px-1.5 py-0.5">SMTP_SECURE=false</code>) or{' '}
            <code className="rounded-md bg-stone-100 px-1.5 py-0.5">465</code> with{' '}
            <code className="rounded-md bg-stone-100 px-1.5 py-0.5">SMTP_SECURE=true</code>
          </li>
          <li>
            <code className="rounded-md bg-stone-100 px-1.5 py-0.5">SMTP_USER</code> — full email address
          </li>
          <li>
            <code className="rounded-md bg-stone-100 px-1.5 py-0.5">SMTP_PASS</code> — app password
          </li>
          <li>
            <code className="rounded-md bg-stone-100 px-1.5 py-0.5">EMAIL_FROM</code> — e.g.{' '}
            <code className="rounded-md bg-stone-100 px-1.5 py-0.5">Lushan Thrift &lt;you@gmail.com&gt;</code>
          </li>
          <li>
            <code className="rounded-md bg-stone-100 px-1.5 py-0.5">ADMIN_ORDERS_EMAIL</code> — inbox for new
            orders &amp; M-Pesa alerts
          </li>
          <li>
            <code className="rounded-md bg-stone-100 px-1.5 py-0.5">NEXT_PUBLIC_APP_URL</code> — live shop URL
            (no trailing slash) for email buttons
          </li>
        </ul>
      </AdminCallout>
    </div>
  );
}
