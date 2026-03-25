/** East Africa Time (UTC+3) — Kenya / Mombasa storefront and admin. */
export const KENYA_TIMEZONE = 'Africa/Nairobi';

const dateTimeOpts: Intl.DateTimeFormatOptions = {
  timeZone: KENYA_TIMEZONE,
  dateStyle: 'medium',
  timeStyle: 'short',
};

const dateOpts: Intl.DateTimeFormatOptions = {
  timeZone: KENYA_TIMEZONE,
  dateStyle: 'medium',
};

export function formatKenyaDateTime(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-KE', dateTimeOpts);
}

export function formatKenyaDate(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-KE', dateOpts);
}
