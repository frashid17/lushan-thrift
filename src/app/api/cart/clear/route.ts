import { getSupabaseUserId } from '@/lib/supabase/get-user-id';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const userId = await getSupabaseUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = await createClient();
  await supabase.from('cart_items').delete().eq('user_id', userId);
  return NextResponse.json({ success: true });
}
