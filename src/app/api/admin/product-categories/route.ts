import { checkRole } from '@/lib/roles';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkRole('admin');
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = (await request.json()) as { name?: string };
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const admin = createAdminClient();
    const { data: maxRows } = await admin
      .from('product_categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1);
    const maxRow = maxRows?.[0] as { sort_order?: number } | undefined;
    const nextOrder = maxRow?.sort_order ?? 0;

    const { data, error } = await admin
      .from('product_categories')
      .insert({ name, sort_order: nextOrder + 10 })
      .select('id,name,sort_order')
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A category with that name already exists' }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('[POST /api/admin/product-categories]', err);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
