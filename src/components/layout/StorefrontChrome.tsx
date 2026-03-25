'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

/** Shared page width + vertical rhythm (matches home). */
export function StorefrontPage({
  children,
  variant = 'default',
  className = '',
}: {
  children: ReactNode;
  variant?: 'default' | 'narrow' | 'slim';
  className?: string;
}) {
  const max =
    variant === 'slim' ? 'max-w-2xl' : variant === 'narrow' ? 'max-w-3xl' : 'max-w-6xl';
  return (
    <div className={`mx-auto px-4 py-6 sm:px-6 sm:py-10 ${max} ${className}`}>{children}</div>
  );
}

/** Gradient hero band for inner pages (aligned with home). */
export function StorefrontHero({
  eyebrow,
  title,
  description,
  right,
  className = '',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative mb-8 overflow-hidden rounded-[1.75rem] border border-stone-200/90 bg-gradient-to-br from-amber-50/90 via-white to-stone-100/80 px-5 py-7 shadow-sm sm:rounded-[2rem] sm:px-8 sm:py-9 ${className}`}
    >
      <div
        className="pointer-events-none absolute -left-12 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-amber-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sky-200/20 blur-2xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 max-w-2xl">
          {eyebrow && (
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone-400">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">{title}</h1>
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">{description}</p>
          )}
        </div>
        {right ? (
          <div className="flex w-full shrink-0 flex-col gap-3 lg:w-auto lg:max-w-md lg:items-end">
            {right}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function StorefrontBackLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group mb-5 inline-flex items-center gap-0.5 text-sm font-semibold text-stone-600 transition hover:text-stone-900"
    >
      <ChevronLeft
        className="h-4 w-4 shrink-0 transition group-hover:-translate-x-0.5"
        aria-hidden
      />
      {children}
    </Link>
  );
}

/** White panel with consistent rounding (cards / sections). */
export function StorefrontPanel({
  children,
  className = '',
  padding = 'p-4 sm:p-6',
}: {
  children: ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-stone-200/90 bg-white shadow-sm ring-1 ring-stone-100/80 ${padding} ${className}`}
    >
      {children}
    </div>
  );
}
