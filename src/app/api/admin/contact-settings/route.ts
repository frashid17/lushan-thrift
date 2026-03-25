import { checkRole } from '@/lib/roles';
import { sanitizeSocialUrl } from '@/lib/social-url';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const isAdmin = await checkRole('admin');
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from('contact_settings').select('*').eq('id', 1).maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(
      data ?? {
        id: 1,
        phone_tel: '',
        whatsapp_number: '',
        instagram_url: '',
        facebook_url: '',
        tiktok_url: '',
      }
    );
  } catch {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const isAdmin = await checkRole('admin');
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = (await request.json()) as {
      phone_tel?: string;
      whatsapp_number?: string;
      instagram_url?: string;
      facebook_url?: string;
      tiktok_url?: string;
    };
    const phone_tel = (body.phone_tel ?? '').trim();
    const whatsapp_number = (body.whatsapp_number ?? '').trim();
    const instagram_url = sanitizeSocialUrl(body.instagram_url ?? '');
    const facebook_url = sanitizeSocialUrl(body.facebook_url ?? '');
    const tiktok_url = sanitizeSocialUrl(body.tiktok_url ?? '');

    const admin = createAdminClient();
    const { data, error } = await admin
      .from('contact_settings')
      .upsert(
        {
          id: 1,
          phone_tel,
          whatsapp_number,
          instagram_url,
          facebook_url,
          tiktok_url,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
