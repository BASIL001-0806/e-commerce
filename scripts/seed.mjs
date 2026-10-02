// Seeds src/data/catalog.json into PostgreSQL (idempotent upsert).
// Usage: node scripts/seed.mjs
import "dotenv/config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const here = dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(readFileSync(join(here, "..", "src", "data", "catalog.json"), "utf8"));

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");

const client = new pg.Client({ connectionString: url });
await client.connect();

try {
  const slugs = catalog.products.map((p) => p.slug);
  await client.query("DELETE FROM products WHERE NOT (slug = ANY($1::text[]))", [slugs]);

  for (const p of catalog.products) {
    await client.query(
      `INSERT INTO products
        (slug, name, brand, tagline, description, category, warranty, price_cents,
         compare_at_cents, rating, reviews, stock, image, accent, badge, featured, colors, specs, features)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         brand = EXCLUDED.brand,
         tagline = EXCLUDED.tagline,
         description = EXCLUDED.description,
         category = EXCLUDED.category,
         warranty = EXCLUDED.warranty,
         price_cents = EXCLUDED.price_cents,
         compare_at_cents = EXCLUDED.compare_at_cents,
         rating = EXCLUDED.rating,
         reviews = EXCLUDED.reviews,
         stock = EXCLUDED.stock,
         image = EXCLUDED.image,
         accent = EXCLUDED.accent,
         badge = EXCLUDED.badge,
         featured = EXCLUDED.featured,
         colors = EXCLUDED.colors,
         specs = EXCLUDED.specs,
         features = EXCLUDED.features`,
      [
        p.slug,
        p.name,
        p.brand,
        p.tagline,
        p.description,
        p.category,
        p.warranty ?? "1 year brand warranty",
        p.priceCents,
        p.compareAtCents ?? null,
        p.rating,
        p.reviews,
        p.stock,
        p.image,
        p.accent ?? "blue",
        p.badge ?? null,
        Boolean(p.featured),
        JSON.stringify(p.colors ?? []),
        JSON.stringify(p.specs ?? []),
        JSON.stringify(p.features ?? []),
      ],
    );
  }

  const { rows } = await client.query(
    "SELECT count(*)::int AS count, min(price_cents) AS low, max(price_cents) AS high FROM products",
  );
  console.log(
    `Seeded ${rows[0].count} products (price range ₹${rows[0].low / 100} – ₹${rows[0].high / 100}).`,
  );
} finally {
  await client.end();
}
