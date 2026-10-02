export type Spec = { label: string; value: string };
export type ColorOption = { name: string; hex: string };

export type Accent = "blue" | "emerald" | "amber" | "rose" | "violet";

export type Product = {
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  category: string;
  priceCents: number;
  compareAtCents: number | null;
  rating: number;
  reviews: number;
  stock: number;
  image: string;
  accent: Accent;
  badge: string | null;
  featured: boolean;
  warranty: string;
  colors: ColorOption[];
  specs: Spec[];
  features: string[];
};

export type CartLine = {
  slug: string;
  name: string;
  brand: string;
  image: string;
  priceCents: number;
  accent: Accent;
  color: string;
  qty: number;
  stock: number;
};

export const ACCENTS: Record<Accent, { hex: string; soft: string; name: string }> = {
  blue: { hex: "#2563eb", soft: "#eff6ff", name: "Blue" },
  emerald: { hex: "#059669", soft: "#ecfdf5", name: "Emerald" },
  amber: { hex: "#d97706", soft: "#fffbeb", name: "Amber" },
  rose: { hex: "#e11d48", soft: "#fff1f3", name: "Rose" },
  violet: { hex: "#7c3aed", soft: "#f5f3ff", name: "Violet" },
};

export function accentOf(accent: string | null | undefined) {
  return ACCENTS[(accent as Accent) ?? "blue"] ?? ACCENTS.blue;
}

/** Indian Rupee formatting — lakh grouping, no paise. */
export function money(cents: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/** 1,12,540 → "1.1 lakh" — how Indian marketplaces show review counts. */
export function countLabel(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(1)} lakh`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function discountPct(price: number, compareAt: number | null): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

/** No-cost EMI instalment. */
export function emiCents(priceCents: number, months = 3): number {
  return Math.ceil(priceCents / months);
}

export const BRANDS = [
  "boAt",
  "Noise",
  "Zebronics",
  "Portronics",
  "Redmi",
  "realme",
  "Fire-Boltt",
  "pTron",
  "Ambrane",
  "Redgear",
  "Boult",
  "Acer",
];

export const CATEGORIES = [
  "Audio",
  "Wearables",
  "Mobile",
  "Computing",
  "Gaming",
  "Photography",
] as const;
