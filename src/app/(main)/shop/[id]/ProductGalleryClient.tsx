'use client';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
  images: string[];
  alt: string;
  unavailable: boolean;
};

export function ProductGalleryClient({ images, alt, unavailable }: Props) {
  const safe = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const main = safe[active] ?? safe[0];

  if (!main) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center rounded-2xl border border-stone-200 bg-stone-100 text-sm text-stone-500">
        No image
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-stone-200/90 bg-stone-100 shadow-lg ring-1 ring-stone-100/80">
        <Image
          key={main}
          src={main}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {unavailable && (
          <span className="absolute inset-0 flex items-center justify-center bg-stone-900/65 text-lg font-semibold text-white backdrop-blur-sm">
            Out of stock
          </span>
        )}
      </div>
      {safe.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1 [scrollbar-width:thin]">
          {safe.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl ring-2 transition ${
                i === active ? 'ring-stone-900 ring-offset-2' : 'ring-stone-200 hover:ring-stone-400'
              }`}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
            >
              <Image src={url} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
