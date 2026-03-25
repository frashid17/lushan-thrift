import { checkRole } from '@/lib/roles';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const isAdmin = await checkRole('admin');
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from('payment_settings').select('*').eq('id', 1).maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(
      data ?? { id: 1, mpesa_buy_goods: '12345', mpesa_till_name: 'lushanthrift' }
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
      mpesa_buy_goods?: string;
      mpesa_till_name?: string;
    };
    const mpesa_buy_goods = body.mpesa_buy_goods?.trim();
    const mpesa_till_name = body.mpesa_till_name?.trim();
    if (!mpesa_buy_goods || !mpesa_till_name) {
      return NextResponse.json({ error: 'Both M-Pesa buy goods and till name are required' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from('payment_settings')
      .upsert(
        {
          id: 1,
          mpesa_buy_goods,
          mpesa_till_name,
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
