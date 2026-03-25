import { createAdminClient } from '@/lib/supabase/admin';
import { sanitizeSocialUrl } from '@/lib/social-url';

export type ContactSettings = {
  phone_tel: string;
  whatsapp_number: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
};

const empty: ContactSettings = {
  phone_tel: '',
  whatsapp_number: '',
  instagram_url: '',
  facebook_url: '',
  tiktok_url: '',
};

export async function getContactSettings(): Promise<ContactSettings> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from('contact_settings').select('*').eq('id', 1).maybeSingle();
    if (error || !data) return empty;
    return {
      phone_tel: String(data.phone_tel ?? '').trim(),
      whatsapp_number: String(data.whatsapp_number ?? '').trim(),
      instagram_url: sanitizeSocialUrl(String(data.instagram_url ?? '')),
      facebook_url: sanitizeSocialUrl(String(data.facebook_url ?? '')),
      tiktok_url: sanitizeSocialUrl(String(data.tiktok_url ?? '')),
    };
  } catch {
    return empty;
  }
}
