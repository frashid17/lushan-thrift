export default function AdminOrdersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Orders</h1>
        <p className="mt-1 text-sm text-stone-600">
          View and manage customer orders. M-Pesa Daraja payment flow will plug in here.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-stone-300 bg-white/60 p-6 text-center text-sm text-stone-500">
        <p className="font-medium text-stone-700">
          Orders dashboard coming soon
        </p>
        <p className="mt-1">
          Once payments are integrated with M-Pesa Daraja, confirmed orders will appear in this view.
        </p>
      </div>
    </div>
  );
}

