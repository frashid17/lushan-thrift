import { checkRole } from '@/lib/roles';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkRole('admin');
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = (await request.json()) as { ids?: unknown };
    if (!Array.isArray(body.ids) || body.ids.length === 0) {
      return NextResponse.json({ error: 'ids must be a non-empty array' }, { status: 400 });
    }
    if (body.ids.length > 200) {
      return NextResponse.json({ error: 'Too many ids at once (max 200)' }, { status: 400 });
    }

    const ids = body.ids.map((x) => String(x).trim()).filter((id) => UUID_RE.test(id));
    if (ids.length === 0) {
      return NextResponse.json({ error: 'No valid order ids' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin.from('orders').delete().in('id', ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, deleted: ids.length });
  } catch (err) {
    console.error('[POST /api/admin/orders/bulk-delete]', err);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
