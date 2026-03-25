import type { Product } from '@/types/database';

export function parseGalleryUrls(raw: unknown): string[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw.map((u) => String(u).trim()).filter(Boolean);
  }
  return [];
}

/** All image URLs in display order; first is primary (used for cards, OG, etc.). */
export function productImageGallery(product: Pick<Product, 'image_url' | 'gallery_urls'>): string[] {
  const fromJson = parseGalleryUrls(product.gallery_urls);
  if (fromJson.length > 0) return fromJson;
  const primary = product.image_url?.trim();
  return primary ? [primary] : [];
}

export function productPrimaryImage(product: Pick<Product, 'image_url' | 'gallery_urls'>): string {
  return productImageGallery(product)[0] ?? '';
}

/** Normalize admin payload: non-empty array, dedupe, set primary as first. */
export function normalizeGalleryUrls(urls: unknown): string[] | null {
  if (!Array.isArray(urls)) return null;
  const cleaned = urls.map((u) => String(u).trim()).filter(Boolean);
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const u of cleaned) {
    if (seen.has(u)) continue;
    seen.add(u);
    unique.push(u);
  }
  return unique.length > 0 ? unique : null;
}
