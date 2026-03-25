import nodemailer from 'nodemailer';
import { formatKenyaDateTime } from '@/lib/datetime';

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
const STONE_900 = '#1c1917';
const STONE_600 = '#57534e';
const STONE_500 = '#78716c';
const STONE_200 = '#e7e5e4';
const STONE_100 = '#f5f5f4';
const WARM_WHITE = '#fafaf9';
const AMBER_BG = '#fffbeb';
const AMBER_TEXT = '#92400e';
const SKY_BG = '#f0f9ff';
const SKY_BORDER = '#bae6fd';

/** Production shop URL when env is unset (emails still get working links). Override with NEXT_PUBLIC_APP_URL. */
const DEFAULT_PUBLIC_SITE_URL = 'https://lushan-thrift.vercel.app';

/** Public site URL for links in emails (no trailing slash) */
function getPublicSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, '');
    return `https://${host}`;
  }
  return DEFAULT_PUBLIC_SITE_URL;
}

/** Admin orders list; optional orderId scrolls to that card (#order-{uuid}) */
function adminOrdersUrl(orderId?: string): string {
  const base = getPublicSiteUrl();
  const path = `${base}/admin/orders`;
  if (!orderId) return path;
  return `${path}#order-${orderId}`;
}

/** Absolute URL to storefront logo (SVG). Same as site favicon / header. */
function emailLogoUrl(): string {
  return `${getPublicSiteUrl()}/icons/icon.svg`;
}

/** Header brand row: logo image + name (admin & customer emails). */
function emailBrandHeaderHtml(): string {
  const src = escapeHtml(emailLogoUrl());
  const img = `<img src="${src}" alt="Lushan Thrift" width="40" height="40" style="display:block;width:40px;height:40px;border-radius:10px;object-fit:contain;" />`;
  return `<table cellspacing="0" cellpadding="0" border="0" role="presentation">
<tr>
<td valign="middle" style="padding-right:12px;">${img}</td>
<td valign="middle"><span style="font-family:${FONT};font-size:19px;font-weight:700;color:${WARM_WHITE};line-height:1.2;">Lushan Thrift</span></td>
</tr>
</table>`;
}

/** Bulletproof CTA + fallback link for admin emails */
function adminDashboardCta(opts: { orderId: string; mode: 'new_order' | 'verify_payment' }): string {
  const url = adminOrdersUrl(opts.orderId);
  const safeUrl = escapeHtml(url);
  const buttonLabel =
    opts.mode === 'verify_payment' ? 'Verify this order in admin' : 'Open this order in admin';
  const hint =
    opts.mode === 'verify_payment'
      ? 'Opens your orders page and jumps to this order so you can approve payment after checking M-Pesa.'
      : 'Opens your orders page and highlights this order.';

  return `<table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:28px;">
<tr>
<td align="left">
<table cellspacing="0" cellpadding="0" border="0" role="presentation">
<tr>
<td style="border-radius:12px;background-color:${STONE_900};">
<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:15px 28px;font-family:${FONT};font-size:15px;font-weight:600;color:${WARM_WHITE};text-decoration:none;border-radius:12px;">${escapeHtml(buttonLabel)}</a>
</td>
</tr>
</table>
<p style="margin:10px 0 0 0;font-size:13px;line-height:1.5;color:${STONE_600};font-family:${FONT};">${escapeHtml(hint)}</p>
<p style="margin:12px 0 0 0;font-size:12px;line-height:1.5;color:${STONE_500};font-family:${FONT};">Or paste this link:<br><a href="${safeUrl}" style="color:${STONE_900};word-break:break-all;">${safeUrl}</a></p>
</td>
</tr>
</table>`;
}

function getTransporter() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return null;

  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure =
    process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1' || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function fromAddress(): string | null {
  return process.env.EMAIL_FROM?.trim() || null;
}

async function sendMail(opts: { to: string; subject: string; html: string; text: string }) {
  const from = fromAddress();
  const transporter = getTransporter();
  if (!transporter || !from) {
    console.warn(
      '[email] Skipping send — on Vercel add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and EMAIL_FROM (see .env.example). Without these, admin order emails are not sent.'
    );
    return;
  }

  try {
    await transporter.sendMail({
      from,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
  } catch (err) {
    console.error('[email] sendMail failed', { to: opts.to, subject: opts.subject, err });
  }
}

/** Full HTML document: table layout + inline styles for major email clients */
function emailDocument(opts: {
  preheader: string;
  headline: string;
  subhead?: string;
  bodyHtml: string;
  audience?: 'admin' | 'customer';
}): string {
  const audience = opts.audience ?? 'admin';
  const footerNote =
    audience === 'customer'
      ? `You’re receiving this because you placed an order at Lushan Thrift.`
      : `Admin notification from your Lushan Thrift store.`;
  const sub = opts.subhead
    ? `<p style="margin:10px 0 0 0;font-size:15px;line-height:1.5;color:${STONE_600};font-family:${FONT};">${escapeHtml(opts.subhead)}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(opts.headline)}</title>
<style type="text/css">
@media only screen and (max-width: 620px) {
  .email-wrap { width: 100% !important; }
  .pad { padding-left: 20px !important; padding-right: 20px !important; }
}
</style>
</head>
<body style="margin:0;padding:0;background-color:${STONE_200};">
<span style="display:none !important;visibility:hidden;opacity:0;height:0;width:0;color:transparent;overflow:hidden;">${escapeHtml(opts.preheader)}</span>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${STONE_200};">
<tr>
<td align="center" style="padding:28px 12px;">
<table role="presentation" class="email-wrap" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;">
<tr>
<td style="background-color:${STONE_900};border-radius:14px 14px 0 0;padding:22px 24px;">
<table width="100%" cellspacing="0" cellpadding="0" border="0">
<tr>
<td valign="middle">
${emailBrandHeaderHtml()}
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="background-color:${WARM_WHITE};border:1px solid ${STONE_200};border-top:0;border-radius:0 0 14px 14px;">
<table width="100%" cellspacing="0" cellpadding="0" border="0">
<tr>
<td class="pad" style="padding:32px 28px 8px 28px;">
<h1 style="margin:0;font-family:${FONT};font-size:24px;font-weight:700;color:${STONE_900};line-height:1.25;letter-spacing:-0.02em;">${escapeHtml(opts.headline)}</h1>
${sub}
</td>
</tr>
<tr>
<td class="pad" style="padding:8px 28px 32px 28px;font-family:${FONT};font-size:15px;line-height:1.6;color:${STONE_600};">
${opts.bodyHtml}
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td align="center" style="padding:22px 16px;font-size:12px;line-height:1.6;color:${STONE_500};font-family:${FONT};">
Mombasa · Kenya · Thoughtful thrift fashion<br>
<span style="color:#a8a29e;">${footerNote}</span>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}

function rowLabelValue(label: string, value: string): string {
  return `<table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:14px;">
<tr>
<td style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:${STONE_500};padding-bottom:4px;font-family:${FONT};">${escapeHtml(label)}</td>
</tr>
<tr>
<td style="font-size:15px;color:${STONE_900};font-family:${FONT};line-height:1.5;">${value}</td>
</tr>
</table>`;
}

function callout(html: string, variant: 'amber' | 'sky' | 'emerald'): string {
  const styles =
    variant === 'amber'
      ? `background-color:${AMBER_BG};border:1px solid #fcd34d;color:${AMBER_TEXT};`
      : variant === 'sky'
        ? `background-color:${SKY_BG};border:1px solid ${SKY_BORDER};color:#0c4a6e;`
        : `background-color:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;`;
  return `<table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px;border-radius:10px;${styles}">
<tr>
<td style="padding:16px 18px;font-size:14px;line-height:1.55;font-family:${FONT};">${html}</td>
</tr>
</table>`;
}

export async function sendAdminNewOrderEmail(opts: {
  to: string;
  orderId: string;
  /** ISO timestamp from DB — shown in email as Kenya time (EAT). */
  placedAtIso: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  totalKes: number;
  lines: { name: string; qty: number; lineTotal: number }[];
  deliveryLabel: string;
  deliveryType: string;
}) {
  const shortId = opts.orderId.slice(0, 8).toUpperCase();
  const placedKenya = formatKenyaDateTime(opts.placedAtIso);
  const customerLine = `${escapeHtml(opts.customerName)} · ${escapeHtml(opts.customerPhone)}${
    opts.customerEmail ? ` · <a href="mailto:${escapeHtml(opts.customerEmail)}" style="color:${STONE_900};text-decoration:underline;">${escapeHtml(opts.customerEmail)}</a>` : ''
  }`;

  const itemsRows = opts.lines
    .map(
      (l) => `<tr>
<td style="padding:14px 16px;border-bottom:1px solid ${STONE_200};font-family:${FONT};font-size:15px;color:${STONE_900};">${escapeHtml(l.name)}</td>
<td style="padding:14px 16px;border-bottom:1px solid ${STONE_200};font-family:${FONT};font-size:15px;color:${STONE_600};text-align:center;width:56px;">${l.qty}</td>
<td style="padding:14px 16px;border-bottom:1px solid ${STONE_200};font-family:${FONT};font-size:15px;color:${STONE_900};text-align:right;font-weight:600;white-space:nowrap;">KES ${l.lineTotal.toLocaleString()}</td>
</tr>`
    )
    .join('');

  const itemsTable = `<table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:8px;border:1px solid ${STONE_200};border-radius:10px;overflow:hidden;border-collapse:separate;">
<tr style="background-color:${STONE_100};">
<th align="left" style="padding:12px 16px;font-family:${FONT};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${STONE_500};">Item</th>
<th style="padding:12px 16px;font-family:${FONT};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${STONE_500};text-align:center;">Qty</th>
<th align="right" style="padding:12px 16px;font-family:${FONT};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${STONE_500};">Line total</th>
</tr>
${itemsRows}
<tr>
<td colspan="2" style="padding:16px;font-family:${FONT};font-size:15px;font-weight:700;color:${STONE_900};">Order total</td>
<td style="padding:16px;font-family:${FONT};font-size:17px;font-weight:700;color:${STONE_900};text-align:right;">KES ${opts.totalKes.toLocaleString()}</td>
</tr>
</table>`;

  const bodyHtml = `
<p style="margin:0 0 18px 0;">
<span style="display:inline-block;padding:6px 12px;border-radius:999px;background-color:${STONE_100};color:${STONE_600};font-size:12px;font-weight:600;font-family:${FONT};letter-spacing:0.04em;">NEW ORDER</span>
</p>
${rowLabelValue('Order reference', `<span style="font-family:ui-monospace,monospace;font-size:15px;font-weight:700;">#${escapeHtml(shortId)}</span><br><span style="font-size:13px;color:${STONE_500};word-break:break-all;">${escapeHtml(opts.orderId)}</span>`)}
${rowLabelValue('Placed (Kenya time, EAT)', escapeHtml(placedKenya))}
${rowLabelValue('Customer', customerLine)}
${rowLabelValue('Delivery', `${escapeHtml(opts.deliveryType)} — ${escapeHtml(opts.deliveryLabel)}`)}
${itemsTable}
${callout(`<strong style="font-weight:700;">Payment pending.</strong> The customer pays via M-Pesa and submits their confirmation from their order page. When they do, you’ll get another email — then verify in M-Pesa and approve in the dashboard.`, 'amber')}
${adminDashboardCta({ orderId: opts.orderId, mode: 'new_order' })}
`;

  const linesText = opts.lines
    .map((l) => `  - ${l.name} x${l.qty}  KES ${l.lineTotal.toLocaleString()}`)
    .join('\n');
  const text = [
    `LUSHAN THRIFT — NEW ORDER`,
    ``,
    `Order #${shortId}`,
    `Full ID: ${opts.orderId}`,
    `Placed (Kenya, EAT): ${placedKenya}`,
    ``,
    `Customer: ${opts.customerName} · ${opts.customerPhone}${opts.customerEmail ? ` · ${opts.customerEmail}` : ''}`,
    `Delivery: ${opts.deliveryType} — ${opts.deliveryLabel}`,
    ``,
    `Items:`,
    linesText,
    ``,
    `TOTAL: KES ${opts.totalKes.toLocaleString()}`,
    ``,
    `Payment is pending until the customer submits M-Pesa details.`,
    `Open this order in admin: ${adminOrdersUrl(opts.orderId)}`,
    ``,
    `— Lushan Thrift · Mombasa`,
  ].join('\n');

  await sendMail({
    to: opts.to,
    subject: `New order #${shortId} — KES ${opts.totalKes.toLocaleString()}`,
    text,
    html: emailDocument({
      preheader: `New order #${shortId} for KES ${opts.totalKes.toLocaleString()} — ${opts.customerName}`,
      headline: 'You have a new order',
      subhead: `Order #${shortId} · KES ${opts.totalKes.toLocaleString()}`,
      bodyHtml,
    }),
  });
}

export async function sendAdminMpesaSubmittedEmail(opts: {
  to: string;
  orderId: string;
  mpesaMessage: string;
  mpesaSenderName: string;
  customerName: string;
}) {
  const shortId = opts.orderId.slice(0, 8).toUpperCase();
  const bodyHtml = `
<p style="margin:0 0 18px 0;">
<span style="display:inline-block;padding:6px 12px;border-radius:999px;background-color:${SKY_BG};color:#0369a1;font-size:12px;font-weight:600;font-family:${FONT};letter-spacing:0.04em;">VERIFY M-PESA</span>
</p>
${rowLabelValue('Order', `<span style="font-family:ui-monospace,monospace;font-size:15px;font-weight:700;">#${escapeHtml(shortId)}</span><br><span style="font-size:13px;color:${STONE_500};word-break:break-all;">${escapeHtml(opts.orderId)}</span>`)}
${rowLabelValue('Customer', escapeHtml(opts.customerName))}
${rowLabelValue('Name on M-Pesa', `<strong style="color:${STONE_900};">${escapeHtml(opts.mpesaSenderName)}</strong>`)}
<p style="margin:20px 0 8px 0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:${STONE_500};font-family:${FONT};">Confirmation text (from customer)</p>
<table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${STONE_100};border:1px solid ${STONE_200};border-radius:10px;">
<tr>
<td style="padding:18px 20px;font-family:ui-monospace,Consolas,monospace;font-size:14px;line-height:1.6;color:${STONE_900};white-space:pre-wrap;word-break:break-word;">${escapeHtml(opts.mpesaMessage)}</td>
</tr>
</table>
${callout(`<strong style="font-weight:700;">Your move:</strong> Check this message against your M-Pesa / till statement. If it matches, tap <strong>Approve payment</strong> for this order in the dashboard. The customer is notified automatically.`, 'sky')}
${adminDashboardCta({ orderId: opts.orderId, mode: 'verify_payment' })}
`;

  const text = [
    `LUSHAN THRIFT — M-PESA DETAILS SUBMITTED`,
    ``,
    `Order #${shortId}`,
    `Full ID: ${opts.orderId}`,
    ``,
    `Customer: ${opts.customerName}`,
    `Name on M-Pesa: ${opts.mpesaSenderName}`,
    ``,
    `Confirmation message:`,
    opts.mpesaMessage,
    ``,
    `Verify in your M-Pesa app, then approve this order in Admin.`,
    `Verify this order (opens admin): ${adminOrdersUrl(opts.orderId)}`,
    ``,
    `— Lushan Thrift · Mombasa`,
  ].join('\n');

  await sendMail({
    to: opts.to,
    subject: `Action needed: verify M-Pesa — order #${shortId}`,
    text,
    html: emailDocument({
      preheader: `${opts.customerName} sent M-Pesa confirmation for #${shortId} — verify and approve`,
      headline: 'M-Pesa confirmation received',
      subhead: `Order #${shortId} — verify payment, then approve`,
      bodyHtml,
    }),
  });
}

export async function sendCustomerPaymentApprovedEmail(opts: {
  to: string;
  orderId: string;
  /** Where we got the address (checkout field vs legacy account fallback). */
  emailSource?: 'checkout' | 'account';
}) {
  const shortId = opts.orderId.slice(0, 8).toUpperCase();
  const shopUrl = getPublicSiteUrl();
  const ordersLink = shopUrl ? `${shopUrl}/orders` : '';
  const emailSource = opts.emailSource ?? 'checkout';
  const sourceNote =
    emailSource === 'account'
      ? `We’re emailing the address on your Lushan Thrift account because this order had no checkout email on file.`
      : `This message goes to the email you entered when you placed your order.`;

  const bodyHtml = `
<p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:${STONE_600};font-family:${FONT};">Thank you for shopping with us. Your payment is confirmed and we’re getting your order ready.</p>
<p style="margin:0 0 16px 0;font-size:13px;line-height:1.5;color:${STONE_500};font-family:${FONT};">${escapeHtml(sourceNote)}</p>
${rowLabelValue('Order', `<span style="font-size:18px;font-weight:700;color:${STONE_900};font-family:${FONT};">#${escapeHtml(shortId)}</span>`)}
${callout(`We’ll prepare your items and contact you if we need anything else. If you chose delivery, we’ll coordinate drop-off; for pickup in Mombasa, we’ll share pickup details soon.`, 'emerald')}
${ordersLink ? `<table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;"><tr><td><a href="${escapeHtml(ordersLink)}" style="font-family:${FONT};font-size:14px;font-weight:600;color:${STONE_900};text-decoration:underline;">View your orders</a></td></tr></table>` : ''}
<p style="margin:24px 0 0 0;font-size:14px;color:${STONE_500};font-family:${FONT};">— Lushan Thrift · Mombasa</p>
`;

  const textNote =
    emailSource === 'account'
      ? `Email: address on your account (order had no checkout email).`
      : `Email: the address you entered at checkout.`;

  const text = [
    `LUSHAN THRIFT`,
    ``,
    `Your payment for order #${shortId} is confirmed.`,
    textNote,
    ``,
    `We’re preparing your order and will be in touch about delivery or pickup.`,
    ordersLink ? `\nView orders: ${ordersLink}` : '',
    ``,
    `— Lushan Thrift · Mombasa`,
  ].join('\n');

  await sendMail({
    to: opts.to,
    subject: `Payment confirmed — order #${shortId}`,
    text,
    html: emailDocument({
      preheader: `Your payment for order #${shortId} is confirmed. We’re preparing your thrift finds.`,
      headline: 'You’re all set',
      subhead: `Payment approved for order #${shortId}`,
      bodyHtml,
      audience: 'customer',
    }),
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
