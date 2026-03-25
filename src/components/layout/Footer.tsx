import Link from 'next/link';
import { ArrowRight, Heart, MapPin, ShoppingBag, User } from 'lucide-react';
import { getContactSettings } from '@/lib/contact-settings';
import { FooterSocialLinks } from './FooterSocialLinks';

function digitsOnly(s: string) {
  return s.replace(/\D/g, '');
}

export async function Footer() {
  const contact = await getContactSettings();
  const waDigits = digitsOnly(contact.whatsapp_number);
  const hasTel = Boolean(contact.phone_tel.trim());

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-amber-200/35 bg-gradient-to-b from-stone-50 via-white to-amber-50/25">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400/45 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-48 w-48 rounded-full bg-amber-100/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-8 h-40 w-40 rounded-full bg-sky-100/35 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-stone-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-black text-white shadow-sm">
                LT
              </span>
              Lushan Thrift
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-600">
              Curated pre-loved pieces from the coast — one-of-a-kind finds, kinder on the wallet and the planet.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50/80 px-3 py-1.5 text-xs font-semibold text-amber-950">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-700" aria-hidden />
              Mombasa · serving Kenya
            </div>
            <FooterSocialLinks
              instagramUrl={contact.instagram_url}
              facebookUrl={contact.facebook_url}
              tiktokUrl={contact.tiktok_url}
            />
            {(hasTel || waDigits) && (
              <ul className="mt-6 space-y-2 text-sm text-stone-600">
                {hasTel && (
                  <li>
                    <a href={`tel:${digitsOnly(contact.phone_tel)}`} className="font-medium hover:text-stone-900">
                      {contact.phone_tel}
                    </a>
                    <span className="ml-2 text-xs text-stone-400">Call</span>
                  </li>
                )}
                {waDigits && (
                  <li>
                    <a
                      href={`https://wa.me/${waDigits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-800 hover:text-emerald-950"
                    >
                      WhatsApp us
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">Shop</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/shop"
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-stone-700 transition hover:text-stone-900"
                  >
                    All products
                    <ArrowRight className="h-4 w-4 text-amber-600 transition group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">Your account</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/profile"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-stone-700 transition hover:text-stone-900"
                  >
                    <User className="h-4 w-4 text-stone-400" aria-hidden />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-stone-700 transition hover:text-stone-900"
                  >
                    <ShoppingBag className="h-4 w-4 text-stone-400" aria-hidden />
                    Cart
                  </Link>
                </li>
              </ul>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">Why thrift</h3>
              <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-stone-600">
                <Heart className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" aria-hidden />
                Less waste, more character — every piece has a story.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-stone-200/80 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} Lushan Thrift. Crafted with care in Mombasa.
          </p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-stone-400">Pre-loved · Coastal · Conscious</p>
        </div>
      </div>
    </footer>
  );
}
