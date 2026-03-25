import { createAdminClient } from '@/lib/supabase/admin';

export type PaymentSettings = {
  mpesa_buy_goods: string;
  mpesa_till_name: string;
};

const defaults: PaymentSettings = {
  mpesa_buy_goods: '12345',
  mpesa_till_name: 'lushanthrift',
};

export async function getPaymentSettings(): Promise<PaymentSettings> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from('payment_settings').select('*').eq('id', 1).maybeSingle();
    if (error || !data) return defaults;
    return {
      mpesa_buy_goods: String(data.mpesa_buy_goods ?? defaults.mpesa_buy_goods),
      mpesa_till_name: String(data.mpesa_till_name ?? defaults.mpesa_till_name),
    };
  } catch {
    return defaults;
  }
}
