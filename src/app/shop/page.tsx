import { Suspense } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { discountPct, money } from "@/lib/catalog";
import { BANK_OFFERS } from "@/lib/pricing";
import { ProductCard } from "@/components/ProductCard";
import { ShopControls } from "@/components/ShopControls";
import { Reveal } from "@/components/Reveal";
import { ArrowIcon, ReturnIcon, ShieldIcon, TruckIcon, BankIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const { products } = await getProducts();

  const q = String(sp.q ?? "").toLowerCase().trim();
  const category = String(sp.category ?? "All");
  const sort = String(sp.sort ?? "featured");
  const stockOnly = String(sp.stock ?? "") === "1";
  const maxBound = Math.max(...products.map((p) => p.priceCents));
  const maxParam = Number(sp.max ?? maxBound);
  const max = Number.isFinite(maxParam) && maxParam > 0 ? maxParam : maxBound;

  let list = products.filter((p) => {
    const inCat = category === "All" || p.category === category;
    const inPrice = p.priceCents <= max;
    const inStock = !stockOnly || p.stock > 0;
    const inQuery =
      !q ||
      [p.name, p.brand, p.tagline, p.category, p.description, ...p.features]
        .join(" ")
        .toLowerCase()
        .includes(q);
    return inCat && inPrice && inStock && inQuery;
  });

  list = [...list].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.priceCents - b.priceCents;
      case "price-desc":
        return b.priceCents - a.priceCents;
      case "rating":
        return b.rating - a.rating;
      case "discount":
        return discountPct(b.priceCents, b.compareAtCents) - discountPct(a.priceCents, a.compareAtCents);
      case "stock":
        return a.stock - b.stock;
      default:
        return Number(b.featured) - Number(a.featured) || b.reviews - a.reviews;
    }
  });

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-6 pb-20 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[12.5px] text-muted">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-ink">{category === "All" ? "All products" : category}</span>
          </nav>
          <h1 className="mt-2 text-[clamp(1.7rem,4vw,2.4rem)] font-extrabold leading-tight text-ink">
            {category === "All" ? "All electronics" : category}
            {q && <span className="text-brand"> for “{q}”</span>}
          </h1>
          <p className="mt-1.5 max-w-2xl text-[14px] text-muted">
            {list.length} {list.length === 1 ? "product" : "products"} · prices in INR inclusive of GST ·
            up to {money(Math.max(...products.map((p) => (p.compareAtCents ?? 0) - p.priceCents), 0))} off
            this week
          </p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[12px] font-medium text-slate-600">
            <TruckIcon className="h-4 w-4 text-good" /> Free delivery above ₹4,999
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[12px] font-medium text-slate-600">
            <ShieldIcon className="h-4 w-4 text-brand" /> Assured quality check
          </span>
        </div>
      </div>

      <Suspense fallback={<div className="h-[92px] rounded-xl border border-line bg-white" />}>
        <ShopControls total={products.length} shown={list.length} maxBound={maxBound} />
      </Suspense>

      {list.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 px-6 py-20 text-center">
          <p className="text-[44px] font-extrabold leading-none text-slate-300">0 results</p>
          <h2 className="text-[20px] font-bold text-ink">Nothing matches those filters</h2>
          <p className="max-w-md text-[14px] leading-relaxed text-muted">
            Try a wider price range or clear the search. If we do not stock it, our sourcing desk can
            usually find it within a week.
          </p>
          <div className="mt-1 flex flex-wrap justify-center gap-2">
            <Link href="/shop" className="btn btn-primary">
              Clear all filters
            </Link>
            <Link href="#help" className="btn btn-ghost">
              Ask the sourcing desk
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i, 7) * 45}>
              <ProductCard product={p} index={i} />
            </Reveal>
          ))}
        </div>
      )}

      {/* help / info */}
      <section id="help" className="mt-14 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="card overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-[16px] font-bold text-ink">Delivery, returns and payments</h2>
          </div>
          <div className="grid gap-px bg-line sm:grid-cols-3">
            {[
              {
                icon: TruckIcon,
                title: "Shipping",
                body: "Orders confirmed before 4 pm leave the same day. Delivery is 1–2 days in metros, 3–5 days elsewhere. Self-pickup available in Bengaluru, Hyderabad and Pune.",
              },
              {
                icon: ReturnIcon,
                title: "Returns",
                body: "7-day replacement on damaged, defective or wrong items. Pickup is scheduled from your address and the refund lands in 3–5 working days.",
              },
              {
                icon: BankIcon,
                title: "Payments",
                body: "UPI, all major cards, net banking, wallets, cash on delivery and no-cost EMI on orders above ₹3,000. GST invoice with your company details at checkout.",
              },
            ].map((b) => (
              <div key={b.title} className="bg-white p-5">
                <b.icon className="h-5 w-5 text-brand" />
                <h3 className="mt-2.5 text-[14px] font-bold text-ink">{b.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{b.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-[15px] font-bold text-ink">Offers you can stack</h2>
          <ul className="mt-3 space-y-2.5">
            {BANK_OFFERS.map((o) => (
              <li key={o} className="flex items-start gap-2 text-[13px] leading-relaxed text-slate-600">
                <ArrowIcon className="mt-0.5 h-4 w-4 shrink-0 text-good" />
                {o}
              </li>
            ))}
          </ul>
          <Link href="/checkout" className="btn btn-primary mt-4 w-full">
            Go to checkout
          </Link>
        </div>
      </section>
    </div>
  );
}
