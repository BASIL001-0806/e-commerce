"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { money, type Product } from "@/lib/catalog";
import { ArrowIcon, ClockIcon } from "@/components/Icons";

export function RecentlyViewed({
  products,
  exclude,
}: {
  products: Product[];
  exclude?: string;
}) {
  const { seen, hydrated } = useStore();
  const items = seen
    .filter((slug) => slug !== exclude)
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 4);

  if (!hydrated || items.length === 0) return null;

  return (
    <section className="mt-14 border-t border-line pt-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="flex items-center gap-2 text-[15px] font-bold text-ink">
          <ClockIcon className="h-4 w-4 text-slate-400" /> Recently viewed
        </h2>
        <Link href="/shop" className="ml-auto flex items-center gap-1 text-[13px] font-semibold text-brand hover:underline">
          See all products <ArrowIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`/product/${p.slug}`}
            className="card flex items-center gap-3 p-3 transition-colors hover:border-slate-300"
          >
            <span className="tile h-14 w-14 shrink-0 overflow-hidden rounded-lg">
              <Image src={p.image} alt={p.name} width={96} height={96} className="h-full w-full object-cover" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10.5px] font-bold uppercase tracking-[0.05em] text-brand">
                {p.brand}
              </span>
              <span className="block truncate text-[13px] font-semibold text-ink">{p.name}</span>
              <span className="block text-[12.5px] text-muted">{money(p.priceCents)}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
