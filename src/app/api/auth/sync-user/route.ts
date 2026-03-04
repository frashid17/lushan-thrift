import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST() {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = (sessionClaims?.email as string) ?? '';
  const role = ((sessionClaims?.metadata as { role?: string })?.role as 'admin' | 'user') ?? 'user';

  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  if (existing) {
    await supabase.from('users').update({ email, role }).eq('id', existing.id);
    return NextResponse.json({ userId: existing.id });
  }

  const { data: inserted, error } = await supabase
    .from('users')
    .insert({ clerk_id: userId, email, role })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ userId: inserted.id });
}
