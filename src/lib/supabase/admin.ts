import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function createAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.example to .env.local and set both values from the Supabase dashboard (Settings → API).'
    );
  }

  try {
    const parsed = new URL(supabaseUrl);
    if (!parsed.protocol.startsWith('http')) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL must start with http:// or https://');
    }
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        'NEXT_PUBLIC_SUPABASE_URL is not a valid URL. It should look like https://<project-ref>.supabase.co'
      );
    }
    throw e;
  }

  return createClient(supabaseUrl, serviceRoleKey);
}
