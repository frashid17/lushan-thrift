'use client';

import { useEffect, useState } from 'react';

export function ContactSettingsForm() {
  const [phoneTel, setPhoneTel] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/contact-settings')
      .then((r) => r.json())
      .then((data) => {
        if (data?.phone_tel != null) setPhoneTel(data.phone_tel);
        if (data?.whatsapp_number != null) setWhatsapp(data.whatsapp_number);
        if (data?.instagram_url != null) setInstagramUrl(data.instagram_url);
        if (data?.facebook_url != null) setFacebookUrl(data.facebook_url);
        if (data?.tiktok_url != null) setTiktokUrl(data.tiktok_url);
      })
      .catch(() => setError('Could not load settings'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/contact-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_tel: phoneTel.trim(),
          whatsapp_number: whatsapp.trim(),
          instagram_url: instagramUrl.trim(),
          facebook_url: facebookUrl.trim(),
          tiktok_url: tiktokUrl.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Save failed');
        return;
      }
      setMessage('Saved. Floating buttons and footer social links update for visitors.');
    } catch {
      setError('Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-stone-50/60">
        <p className="text-sm text-stone-500">Loading contact settings…</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl space-y-6 rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm ring-1 ring-stone-100/80 sm:p-6"
    >
      <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400">Floating buttons</h2>
      <div>
        <label className="block text-sm font-semibold text-stone-800">Phone (call)</label>
        <input
          value={phoneTel}
          onChange={(e) => setPhoneTel(e.target.value)}
          className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm text-stone-900"
          placeholder="+254708786001 or 0708786001"
          autoComplete="tel"
        />
        <p className="mt-1 text-xs text-stone-500">
          Shown as a floating call button. Uses <code className="rounded bg-stone-100 px-1">tel:</code> link.
        </p>
      </div>
      <div>
        <label className="block text-sm font-semibold text-stone-800">WhatsApp number</label>
        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm text-stone-900"
          placeholder="254708786001 (country code, no + or spaces)"
          inputMode="numeric"
        />
        <p className="mt-1 text-xs text-stone-500">
          Digits only with country code (e.g. Kenya 254…). Non-digits are stripped for the chat link.
        </p>
      </div>

      <div className="border-t border-stone-100 pt-6">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-400">Footer social</h2>
        <p className="mt-1 text-sm font-semibold text-stone-900">Profile URLs</p>
        <p className="mt-1 text-xs text-stone-500">
          Full profile URLs. Leave blank to hide that link.{' '}
          <code className="rounded bg-stone-100 px-1">https://</code> is added if you omit it. Only{' '}
          <code className="rounded bg-stone-100 px-1">http</code> /{' '}
          <code className="rounded bg-stone-100 px-1">https</code> links are saved.
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-800">Instagram</label>
            <input
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm text-stone-900"
              placeholder="https://instagram.com/yourshop"
              type="url"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-800">Facebook</label>
            <input
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm text-stone-900"
              placeholder="https://facebook.com/yourpage"
              type="url"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-800">TikTok</label>
            <input
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm text-stone-900"
              placeholder="https://tiktok.com/@yourshop"
              type="url"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800 disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save contact & social'}
      </button>
    </form>
  );
}
