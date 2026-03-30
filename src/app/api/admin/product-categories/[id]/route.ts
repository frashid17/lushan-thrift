import { checkRole } from '@/lib/roles';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await checkRole('admin');
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const admin = createAdminClient();

    const { data: row, error: fetchErr } = await admin
      .from('product_categories')
      .select('name')
      .eq('id', id)
      .maybeSingle();

    if (fetchErr || !row) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const categoryName = String(row.name);

    const { count, error: countErr } = await admin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category', categoryName);

    if (countErr) return NextResponse.json({ error: countErr.message }, { status: 500 });
    if ((count ?? 0) > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete this category while products use it. Reassign or remove those products first.',
        },
        { status: 400 }
      );
    }

    const { error: delErr } = await admin.from('product_categories').delete().eq('id', id);
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/admin/product-categories/:id]', err);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
