import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');
  const limitParam = searchParams.get('limit');

  const supabase = await createClient();
  let query = supabase.from('products').select('*').eq('availability', true);

  if (category) query = query.eq('category', category);
  if (featured === 'true') query = query.limit(8);

  const term = search?.trim();
  if (term) {
    const like = `%${term}%`;
    query = query.or(`name.ilike.${like},description.ilike.${like}`);
  }

  const limit = limitParam ? Number(limitParam) : undefined;
  if (limit && !Number.isNaN(limit) && limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
