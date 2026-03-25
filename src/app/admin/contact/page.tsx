import { ContactSettingsForm } from './ContactSettingsForm';

export default function AdminContactPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Contact</h1>
        <p className="mt-1 text-sm text-stone-600">
          Set phone and WhatsApp for the floating buttons on the shop, and Instagram / Facebook / TikTok
          URLs for the site footer. Leave a field empty to hide that control or link.
        </p>
      </div>
      <ContactSettingsForm />
    </div>
  );
}
