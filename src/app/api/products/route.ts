import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

/** GET /api/products?category=Audio&q=laptop&sort=price-asc */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const q = (url.searchParams.get("q") ?? "").toLowerCase().trim();
  const sort = url.searchParams.get("sort") ?? "featured";

  const { products, source } = await getProducts();

  let list = products;
  if (category && category !== "All") {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (q) {
    list = list.filter((p) =>
      [p.name, p.tagline, p.description, p.category].join(" ").toLowerCase().includes(q),
    );
  }
  if (sort === "price-asc") list = [...list].sort((a, b) => a.priceCents - b.priceCents);
  if (sort === "price-desc") list = [...list].sort((a, b) => b.priceCents - a.priceCents);
  if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

  return NextResponse.json({ source, count: list.length, products: list });
}
