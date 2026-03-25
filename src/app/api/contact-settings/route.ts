import { getContactSettings } from '@/lib/contact-settings';
import { NextResponse } from 'next/server';

export async function GET() {
  const settings = await getContactSettings();
  return NextResponse.json(settings);
}
