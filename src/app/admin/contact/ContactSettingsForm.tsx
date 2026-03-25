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
    return <p className="text-sm text-stone-500">Loading…</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl space-y-5 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div>
        <label className="block text-sm font-medium text-stone-800">Phone (call)</label>
        <input
          value={phoneTel}
          onChange={(e) => setPhoneTel(e.target.value)}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900"
          placeholder="+254708786001 or 0708786001"
          autoComplete="tel"
        />
        <p className="mt-1 text-xs text-stone-500">
          Shown as a floating call button. Uses <code className="rounded bg-stone-100 px-1">tel:</code> link.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-800">WhatsApp number</label>
        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900"
          placeholder="254708786001 (country code, no + or spaces)"
          inputMode="numeric"
        />
        <p className="mt-1 text-xs text-stone-500">
          Digits only with country code (e.g. Kenya 254…). Non-digits are stripped for the chat link.
        </p>
      </div>

      <div className="border-t border-stone-100 pt-5">
        <h2 className="text-sm font-semibold text-stone-900">Social (footer)</h2>
        <p className="mt-1 text-xs text-stone-500">
          Full profile URLs. Leave blank to hide that link.{' '}
          <code className="rounded bg-stone-100 px-1">https://</code> is added if you omit it. Only{' '}
          <code className="rounded bg-stone-100 px-1">http</code> /{' '}
          <code className="rounded bg-stone-100 px-1">https</code> links are saved.
        </p>
        <div className="mt-4 space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-stone-800">Instagram</label>
            <input
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900"
              placeholder="https://instagram.com/yourshop"
              type="url"
              autoComplete="off"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-stone-800">Facebook</label>
            <input
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900"
              placeholder="https://facebook.com/yourpage"
              type="url"
              autoComplete="off"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-stone-800">TikTok</label>
            <input
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900"
              placeholder="https://tiktok.com/@yourshop"
              type="url"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {message && <p className="text-sm text-green-800">{message}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-stone-900 px-5 py-2 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save contact & social'}
      </button>
    </form>
  );
}
