"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { countLabel, discountPct, emiCents, money, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { Stars } from "@/components/Stars";
import { CheckIcon, ShieldIcon, TruckIcon, WalletIcon } from "@/components/Icons";

export function HeroShowcase({ product }: { product: Product }) {
  const { add } = useStore();
  const [added, setAdded] = useState(false);
  const off = discountPct(product.priceCents, product.compareAtCents);

  return (
    <div className="card overflow-hidden">
      <div className="grid gap-0 sm:grid-cols-[1.05fr_1fr]">
        <Link href={`/product/${product.slug}`} className="tile relative block aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width:1024px) 92vw, 460px"
            className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
          />
          {off > 0 && (
            <span className="absolute left-3 top-3 rounded-md bg-sale px-2 py-1 text-[11.5px] font-bold text-white shadow">
              {off}% OFF
            </span>
          )}
        </Link>

        <div className="flex flex-col p-5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-brand">
              {product.brand}
            </span>
            <span className="flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-good">
              <ShieldIcon className="h-3 w-3" /> Assured
            </span>
          </div>

          <h2 className="mt-1.5 text-[20px] font-bold leading-tight text-ink">
            <Link href={`/product/${product.slug}`} className="hover:text-brand">
              {product.name}
            </Link>
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{product.tagline}</p>

          <div className="mt-3 flex items-center gap-2">
            <Stars rating={product.rating} size={13} />
            <span className="text-[12px] font-medium text-slate-500">
              {product.rating.toFixed(1)} · {countLabel(product.reviews)} ratings
            </span>
          </div>

          <div className="mt-4 flex items-end gap-2.5">
            <span className="text-[28px] font-bold leading-none tracking-tight text-ink">
              {money(product.priceCents)}
            </span>
            {product.compareAtCents && (
              <>
                <span className="pb-0.5 text-[13.5px] text-slate-400 line-through">
                  {money(product.compareAtCents)}
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-[12px] font-medium text-good">
            Free delivery · No-cost EMI {money(emiCents(product.priceCents))}/mo
          </p>

          <ul className="mt-4 space-y-1.5">
            {product.features.slice(0, 3).map((f) => (
              <li key={f} className="flex items-start gap-2 text-[12.5px] text-slate-600">
                <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => {
                add(product);
                setAdded(true);
                window.setTimeout(() => setAdded(false), 1400);
              }}
              className="btn btn-ghost !text-[13px]"
            >
              {added ? (
                <>
                  <CheckIcon className="h-4 w-4 text-good" /> Added to cart
                </>
              ) : (
                "Add to cart"
              )}
            </button>
            <Link href={`/product/${product.slug}`} className="btn btn-accent !text-[13px]">
              Buy now
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-3 text-[11.5px] text-muted">
            <span className="flex items-center gap-1.5">
              <TruckIcon className="h-4 w-4 text-brand" /> Arrives in 2–4 days
            </span>
            <span className="flex items-center gap-1.5">
              <WalletIcon className="h-4 w-4 text-brand" /> UPI, cards, COD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
