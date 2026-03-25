'use client';

import type { ReactNode } from 'react';

/** Gradient header band — matches admin overview hero. */
export function AdminHero({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <section className="relative mb-8 overflow-hidden rounded-2xl border border-stone-200/90 bg-gradient-to-br from-amber-50/85 via-white to-stone-100/75 px-5 py-6 shadow-sm sm:px-7 sm:py-8">
      <div
        className="pointer-events-none absolute -left-12 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-amber-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-stone-300/20 blur-2xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-3xl">
          {eyebrow && (
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone-400">{eyebrow}</p>
          )}
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">{title}</h1>
          {description != null && (
            <div className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">{description}</div>
          )}
        </div>
        {right && <div className="flex shrink-0 flex-wrap items-stretch gap-2 sm:gap-3">{right}</div>}
      </div>
    </section>
  );
}

export function AdminStatBadge({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="min-w-[7.5rem] rounded-2xl border border-stone-200/90 bg-white/95 px-4 py-3 shadow-sm ring-1 ring-stone-100/80 backdrop-blur-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">{label}</p>
      <p className="mt-1 font-mono text-xl font-bold tabular-nums text-stone-900">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-stone-500">{sub}</p>}
    </div>
  );
}

export function AdminCallout({
  title,
  children,
  variant = 'default',
}: {
  title?: string;
  children: ReactNode;
  variant?: 'default' | 'muted' | 'danger';
}) {
  const styles =
    variant === 'danger'
      ? 'rounded-2xl border border-red-200 bg-red-50/90 px-5 py-4 text-sm text-red-900 ring-1 ring-red-100/80'
      : variant === 'muted'
        ? 'rounded-2xl border border-dashed border-stone-300/90 bg-stone-50/70 px-5 py-4 text-sm text-stone-600'
        : 'rounded-2xl border border-stone-200/90 bg-white px-5 py-4 text-sm text-stone-700 shadow-sm ring-1 ring-stone-100/80';
  return (
    <div className={styles}>
      {title && (
        <p
          className={
            variant === 'danger' ? 'font-semibold text-red-950' : 'font-semibold text-stone-900'
          }
        >
          {title}
        </p>
      )}
      <div className={title ? 'mt-2 space-y-2 leading-relaxed' : 'space-y-2 leading-relaxed'}>{children}</div>
    </div>
  );
}

export function AdminEmptyState({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300/90 bg-stone-50/60 px-6 py-14 text-center">
      <p className="text-sm font-semibold text-stone-800">{title}</p>
      {hint && <p className="mt-2 text-sm text-stone-500">{hint}</p>}
      {children}
    </div>
  );
}
