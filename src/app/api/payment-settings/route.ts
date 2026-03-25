import { getPaymentSettings } from '@/lib/payment-settings';
import { NextResponse } from 'next/server';

export async function GET() {
  const settings = await getPaymentSettings();
  return NextResponse.json(settings);
}
