import { asc, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { products as productsTable } from "@/db/schema";
import catalogData from "@/data/catalog.json";
import type { Product } from "@/lib/catalog";

export const fallbackProducts = catalogData.products as unknown as Product[];
export const testimonials = catalogData.reviews;
export const comingSoon = catalogData.comingSoon;

type Row = typeof productsTable.$inferSelect;

function toProduct(row: Row): Product {
  return {
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    tagline: row.tagline,
    description: row.description,
    warranty: row.warranty,
    category: row.category,
    priceCents: row.priceCents,
    compareAtCents: row.compareAtCents,
    rating: Number(row.rating),
    reviews: row.reviews,
    stock: row.stock,
    image: row.image,
    accent: row.accent as Product["accent"],
    badge: row.badge,
    featured: row.featured,
    colors: row.colors ?? [],
    specs: row.specs ?? [],
    features: row.features ?? [],
  };
}

/**
 * Products are served from PostgreSQL. If the database is unreachable or empty
 * (fresh sandbox, cold boot) we gracefully fall back to the bundled catalog so
 * the storefront never renders a broken state.
 */
export async function getProducts(): Promise<{ products: Product[]; source: "db" | "catalog" }> {
  if (!db) {
    return { products: fallbackProducts, source: "catalog" };
  }
  try {
    const rows = await db.select().from(productsTable).orderBy(asc(productsTable.id));
    if (rows.length > 0) {
      return { products: rows.map(toProduct), source: "db" };
    }
  } catch (error) {
    console.warn("[shop-cart] product query failed, using bundled catalog:", error);
  }

  return { products: fallbackProducts, source: "catalog" };
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (!db) {
    const { products } = await getProducts();
    return products.find((p) => p.slug === slug) ?? null;
  }
  try {
    const [row] = await db.select().from(productsTable).where(eq(productsTable.slug, slug)).limit(1);
    if (row) return toProduct(row);
  } catch (error) {
    console.warn("[shop-cart] single product query failed:", error);
  }
  const { products } = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function countProducts(): Promise<number> {
  if (!db) {
    return fallbackProducts.length;
  }
  try {
    const [row] = await db.select({ value: count() }).from(productsTable);
    return Number(row?.value ?? 0);
  } catch {
    return fallbackProducts.length;
  }
}
