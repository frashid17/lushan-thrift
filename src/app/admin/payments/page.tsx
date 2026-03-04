export default function AdminPaymentsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Payments</h1>
        <p className="mt-1 text-sm text-stone-600">
          Connect and monitor your M-Pesa Daraja payments and settlement status.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            M-Pesa status
          </p>
          <p className="mt-2 text-base font-semibold text-stone-900">
            Not connected
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Add Daraja credentials to start accepting payments.
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Today&apos;s volume
          </p>
          <p className="mt-2 text-2xl font-semibold text-stone-900">KES 0</p>
          <p className="mt-1 text-xs text-stone-500">
            Will show confirmed paid orders.
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Pending payouts
          </p>
          <p className="mt-2 text-2xl font-semibold text-stone-900">KES 0</p>
          <p className="mt-1 text-xs text-stone-500">
            Settle to your business M-Pesa wallet.
          </p>
        </div>
      </section>

      <div className="rounded-xl border border-dashed border-stone-300 bg-white/60 p-6 text-sm text-stone-600">
        <p className="font-medium text-stone-800">Next steps</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>Configure Daraja API keys and callback URL.</li>
          <li>Log payment callbacks into an `orders` table.</li>
          <li>Mark orders as paid once confirmation is received.</li>
        </ul>
      </div>
    </div>
  );
}

