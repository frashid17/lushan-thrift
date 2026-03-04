import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

export async function getSupabaseUserId(): Promise<string | null> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const supabase = await createClient();
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', clerkId)
    .single();

  return user?.id ?? null;
}
