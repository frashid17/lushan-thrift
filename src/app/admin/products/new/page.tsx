import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { AddProductForm } from '../AddProductForm';
import { AdminHero } from '../../AdminChrome';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="group inline-flex items-center gap-0.5 text-sm font-semibold text-stone-600 transition hover:text-stone-900"
      >
        <ChevronLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" aria-hidden />
        Back to products
      </Link>
      <AdminHero
        eyebrow="Catalog"
        title="Add product"
        description="Upload a photo, set price, category, and size. New listings show on the shop as soon as they’re saved."
      />
      <AddProductForm />
    </div>
  );
}
