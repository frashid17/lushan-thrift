/** Normalize and allow only http(s) URLs for social links. */
export function sanitizeSocialUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return '';
  const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  try {
    const u = new URL(withProto);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    return u.href;
  } catch {
    return '';
  }
}
