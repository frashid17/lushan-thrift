'use client';

import Image from 'next/image';
import { ChevronDown, ChevronUp, Star, Trash2 } from 'lucide-react';

type Props = {
  images: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  onPickFiles: (files: FileList | null) => void;
};

export function AdminProductImagesField({ images, onChange, disabled, onPickFiles }: Props) {
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  function setPrimary(i: number) {
    if (i <= 0) return;
    const next = [images[i], ...images.filter((_, k) => k !== i)];
    onChange(next);
  }

  function removeAt(i: number) {
    onChange(images.filter((_, k) => k !== i));
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-stone-700">Product images</label>
      <p className="text-xs text-stone-500">
        First image is the <strong>primary</strong> (shop grid &amp; social previews). Add more, then reorder or
        star one to make it primary.
      </p>
      <input
        type="file"
        accept="image/*"
        multiple
        disabled={disabled}
        onChange={(e) => {
          onPickFiles(e.target.files);
          e.target.value = '';
        }}
        className="block w-full text-sm text-stone-600 file:mr-4 file:rounded file:border-0 file:bg-stone-100 file:px-4 file:py-2 file:text-stone-700"
      />
      {images.length > 0 && (
        <ul className="space-y-2">
          {images.map((url, i) => (
            <li
              key={`${url}-${i}`}
              className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50/80 p-2"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-stone-200">
                <Image src={url} alt="" fill className="object-cover" sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-stone-600">{url}</p>
                {i === 0 && (
                  <span className="mt-1 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                    Primary
                  </span>
                )}
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  disabled={disabled || i === 0}
                  onClick={() => setPrimary(i)}
                  className="rounded p-1 text-amber-700 hover:bg-amber-100 disabled:opacity-30"
                  title="Set as primary"
                  aria-label="Set as primary image"
                >
                  <Star className="h-4 w-4" fill={i === 0 ? 'currentColor' : 'none'} />
                </button>
                <button
                  type="button"
                  disabled={disabled || i === 0}
                  onClick={() => move(i, -1)}
                  className="rounded p-1 text-stone-600 hover:bg-stone-200 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={disabled || i === images.length - 1}
                  onClick={() => move(i, 1)}
                  className="rounded p-1 text-stone-600 hover:bg-stone-200 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeAt(i)}
                  className="rounded p-1 text-red-600 hover:bg-red-50"
                  aria-label="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
