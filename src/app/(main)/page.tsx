import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Footprints,
  Gem,
  Heart,
  Layers,
  Leaf,
  MapPin,
  Package,
  Shirt,
  Smartphone,
  Sparkles,
  Truck,
  Wind,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/ProductCardSkeleton';
import { Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { SearchAutocomplete } from '@/components/SearchAutocomplete';

async function FeaturedProducts() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('availability', true)
    .order('created_at', { ascending: false })
    .limit(8);
  if (!products?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/80 px-6 py-16 text-center">
        <Package className="mx-auto h-10 w-10 text-stone-300" strokeWidth={1.25} aria-hidden />
        <p className="mt-4 text-sm font-medium text-stone-700">New pieces are on the way</p>
        <p className="mt-1 text-sm text-stone-500">Check back soon for fresh thrift drops.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-600"
        >
          Browse the shop anyway
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

const CATEGORIES: { label: string; icon: typeof Shirt }[] = [
  { label: 'Tops', icon: Shirt },
  { label: 'Bottoms', icon: Layers },
  { label: 'Dresses', icon: Sparkles },
  { label: 'Outerwear', icon: Wind },
  { label: 'Shoes', icon: Footprints },
  { label: 'Accessories', icon: Gem },
];

export default async function HomePage() {
  let isSignedIn = false;
  try {
    const user = await currentUser();
    isSignedIn = !!user;
  } catch {
    isSignedIn = false;
  }

  const supabase = await createClient();
  const { count: liveCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('availability', true);

  const piecesLive = liveCount ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Hero */}
      <section className="relative mb-12 overflow-hidden rounded-[1.75rem] border border-stone-200/90 bg-gradient-to-br from-amber-50/95 via-white to-stone-100/90 shadow-sm sm:rounded-[2rem]">
        <div
          className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-amber-200/35 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-sky-200/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,191,36,0.12),transparent)]"
          aria-hidden
        />

        <div className="relative grid gap-10 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-14">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/90 bg-white/90 px-3 py-1 text-xs font-semibold text-amber-950 shadow-sm backdrop-blur-sm">
                <MapPin className="h-3.5 w-3.5 text-amber-700" aria-hidden />
                Mombasa · Kenya
              </span>
              {piecesLive > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-900 ring-1 ring-emerald-600/20">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {piecesLive} piece{piecesLive === 1 ? '' : 's'} live now
                </span>
              )}
            </div>

            <div className="mt-6 flex items-start gap-4">
              <div className="hidden shrink-0 rounded-2xl bg-white p-2.5 shadow-md ring-1 ring-stone-200/80 sm:block">
                <Image
                  src="/icons/icon.svg"
                  alt=""
                  width={56}
                  height={56}
                  className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-[1.75rem] font-bold leading-[1.1] tracking-tight text-stone-900 sm:text-4xl lg:text-[2.65rem] lg:leading-[1.08]">
                  Thrift fashion
                  <span className="text-stone-400">,</span>{' '}
                  <span className="bg-gradient-to-r from-amber-700 via-stone-800 to-stone-900 bg-clip-text text-transparent">
                    made for the coast.
                  </span>
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base sm:leading-relaxed">
              Curated pre-loved clothes from Mombasa and across Kenya. Unique finds, fair prices, and
              less waste — shop looks that feel good on you and the planet.
            </p>

            <div className="mt-6 rounded-2xl border border-stone-200/80 bg-white/85 p-1 shadow-sm backdrop-blur-sm ring-1 ring-white/60">
              <SearchAutocomplete variant="home" />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {!isSignedIn ? (
                <>
                  <Link
                    href="/sign-in"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800 active:scale-[0.99]"
                  >
                    Sign in to shop
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link
                    href="/sign-up"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-300 hover:bg-stone-50"
                  >
                    Create account
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/shop"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800 active:scale-[0.99]"
                  >
                    Shop latest drops
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link
                    href="/wishlist"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:border-rose-200 hover:bg-rose-50/50"
                  >
                    <Heart className="h-4 w-4 text-rose-500" aria-hidden />
                    Your wishlist
                  </Link>
                </>
              )}
              <Link
                href="/shop"
                className="inline-flex min-h-[48px] items-center justify-center text-sm font-semibold text-stone-600 underline decoration-stone-300 underline-offset-[6px] transition hover:text-stone-900 hover:decoration-stone-500 sm:px-2"
              >
                Skip to all products
              </Link>
            </div>

            <ul className="mt-8 flex flex-col gap-2.5 text-xs text-stone-600 sm:flex-row sm:flex-wrap sm:gap-x-6">
              <li className="flex items-center gap-2">
                <Leaf className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                Curated sustainable thrift
              </li>
              <li className="flex items-center gap-2">
                <Truck className="h-4 w-4 shrink-0 text-sky-600" aria-hidden />
                Delivery &amp; pickup options
              </li>
              <li className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                Fast on mobile
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm lg:mx-0 lg:max-w-none">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-amber-200/40 via-transparent to-sky-200/30 blur-sm" aria-hidden />
              <div className="relative space-y-3 rounded-3xl border border-stone-200/90 bg-white/90 p-4 shadow-lg backdrop-blur-sm sm:p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Why shoppers stay
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 p-4 text-white shadow-md">
                    <Sparkles className="h-5 w-5 text-amber-300" aria-hidden />
                    <p className="mt-3 text-sm font-semibold">Weekly fresh picks</p>
                    <p className="mt-1 text-xs leading-relaxed text-stone-300">
                      New thrift drops added regularly — denim, dresses, streetwear &amp; more.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-stone-100 bg-stone-50/90 p-4 shadow-inner">
                    <Shirt className="h-5 w-5 text-stone-600" aria-hidden />
                    <p className="mt-3 text-sm font-semibold text-stone-900">Sized for real life</p>
                    <p className="mt-1 text-xs leading-relaxed text-stone-600">
                      S–XL and beyond, chosen for Kenya&apos;s heat and city days.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-dashed border-amber-200/80 bg-amber-50/50 p-4">
                  <p className="text-xs font-semibold text-amber-950">First time here?</p>
                  <p className="mt-1 text-xs leading-relaxed text-amber-900/80">
                    {!isSignedIn
                      ? 'Sign in to sync your cart and save pieces you love to your wishlist.'
                      : 'Your cart and wishlist follow you — jump into the shop whenever you’re ready.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-14">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone-400">
              Browse
            </p>
            <h2 className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
              Shop by category
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-semibold text-stone-700 hover:text-stone-900"
          >
            View everything
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {CATEGORIES.map(({ label, icon: Icon }) => (
            <Link
              key={label}
              href={`/shop?category=${encodeURIComponent(label)}`}
              className="group flex items-center gap-2.5 rounded-2xl border border-stone-200/90 bg-white px-3 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md active:scale-[0.99]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600 transition group-hover:bg-stone-900 group-hover:text-white">
                <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
              </span>
              <span className="min-w-0 text-sm font-semibold text-stone-900">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mb-14">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700/90">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Just dropped
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
              Featured picks
            </h2>
            <p className="mt-1 max-w-md text-sm text-stone-600">
              In-stock favourites — tap a card to see details, sizes, and add to cart.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-1.5 self-start rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:bg-stone-50 sm:self-auto"
          >
            Browse all
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <FeaturedProducts />
        </Suspense>
      </section>

      {/* Values */}
      <section className="mb-14 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Leaf,
            tint: 'text-emerald-700',
            bg: 'bg-emerald-50 ring-emerald-100',
            title: 'Sustainable',
            line: 'Better for your wallet & the planet.',
            body: 'Every thrifted piece keeps clothes in use longer and out of landfills.',
          },
          {
            icon: MapPin,
            tint: 'text-sky-700',
            bg: 'bg-sky-50 ring-sky-100',
            title: 'Curated for Kenya',
            line: 'Styles that work for coast life.',
            body: 'Breathable fabrics and practical fits for Mombasa heat and city days.',
          },
          {
            icon: Smartphone,
            tint: 'text-amber-700',
            bg: 'bg-amber-50 ring-amber-100',
            title: 'Mobile-first',
            line: 'Built for phones from day one.',
            body: 'Fast browsing with cart and wishlist that sync when you sign in.',
          },
        ].map((item) => {
          const ValueIcon = item.icon;
          return (
          <div
            key={item.title}
            className={`rounded-2xl border border-stone-100 ${item.bg} p-5 ring-1 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6`}
          >
            <div
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 ${item.tint} shadow-sm ring-1 ring-stone-100`}
            >
              <ValueIcon className="h-5 w-5" strokeWidth={2} aria-hidden />
            </div>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
              {item.title}
            </p>
            <p className="mt-1 font-semibold text-stone-900">{item.line}</p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.body}</p>
          </div>
          );
        })}
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden rounded-[1.75rem] border border-stone-200/90 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 px-6 py-12 text-center shadow-lg sm:rounded-[2rem] sm:px-10 sm:py-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(251,191,36,0.15), transparent 45%), radial-gradient(circle at 80% 80%, rgba(56,189,248,0.12), transparent 40%)',
          }}
          aria-hidden
        />
        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Ready to find your next favourite piece?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-stone-300 sm:text-base">
            Scroll the shop, heart what you love, and check out with M-Pesa when you&apos;re set.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-stone-100 sm:w-auto"
            >
              Start shopping
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            {!isSignedIn && (
              <Link
                href="/sign-up"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-stone-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              >
                Join Lushan Thrift
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
