import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/products";
import { money } from "@/lib/catalog";
import { ProductBuyer } from "@/components/ProductBuyer";
import { ProductCard } from "@/components/ProductCard";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { Reveal } from "@/components/Reveal";
import { ArrowIcon, ChevronIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — ${money(product.priceCents)}`,
    description: `${product.tagline}. Best price in India with no-cost EMI, free delivery and brand warranty on Shop Cart.`,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const { products } = await getProducts();
  const related = [
    ...products.filter((p) => p.category === product.category && p.slug !== product.slug),
    ...products.filter((p) => p.category !== product.category && p.slug !== product.slug),
  ].slice(0, 4);

  return (
    <div className="mx-auto max-w-[1360px] px-4 pb-16 pt-5 sm:px-6 lg:px-8">
      <nav className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-muted">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <ChevronIcon className="h-3.5 w-3.5 -rotate-90 text-slate-300" />
        <Link href="/shop" className="hover:text-brand">
          All products
        </Link>
        <ChevronIcon className="h-3.5 w-3.5 -rotate-90 text-slate-300" />
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-brand">
          {product.category}
        </Link>
        <ChevronIcon className="h-3.5 w-3.5 -rotate-90 text-slate-300" />
        <span className="font-medium text-ink">{product.name}</span>
      </nav>

      <div className="mt-5">
        <ProductBuyer product={product} />
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <div className="flex flex-wrap items-end gap-4 border-t border-line pt-10">
            <div>
              <h2 className="text-[clamp(1.3rem,2.6vw,1.8rem)] font-extrabold text-ink">
                Similar products from {product.category}
              </h2>
              <p className="mt-1.5 text-[13.5px] text-muted">
                Frequently bought together with {product.name} this month.
              </p>
            </div>
            <Link href="/shop" className="btn btn-ghost ml-auto">
              View all <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <ProductCard product={p} index={i} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed products={products} exclude={product.slug} />
    </div>
  );
}
