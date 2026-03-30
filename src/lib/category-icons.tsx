import type { LucideIcon } from 'lucide-react';
import {
  Bed,
  Layers,
  Moon,
  Package,
  Shirt,
  Sparkles,
  Tag,
  Umbrella,
  Wind,
} from 'lucide-react';

/** Icon for home “Shop by category” — works for DB-driven names. */
export function categoryIconForLabel(label: string): LucideIcon {
  const k = label.trim().toLowerCase();
  if (k.includes('top')) return Shirt;
  if (k.includes('dress')) return Sparkles;
  if (k.includes('bed')) return Bed;
  if (k.includes('jacket')) return Wind;
  if (k.includes('poncho')) return Umbrella;
  if (k.includes('pajama')) return Moon;
  if (k.includes('shoe')) return Layers;
  if (k.includes('accessor')) return Tag;
  return Package;
}
