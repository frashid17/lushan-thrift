import { ContactSettingsForm } from './ContactSettingsForm';
import { AdminHero } from '../AdminChrome';

export default function AdminContactPage() {
  return (
    <div className="space-y-8">
      <AdminHero
        eyebrow="Storefront"
        title="Contact & social"
        description={
          <>
            Phone and WhatsApp power the floating buttons on the public shop. Instagram, Facebook, and TikTok
            URLs appear in the footer. Leave a field empty to hide that control or link.
          </>
        }
      />
      <ContactSettingsForm />
    </div>
  );
}
