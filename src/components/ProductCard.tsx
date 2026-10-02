"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  countLabel,
  discountPct,
  emiCents,
  money,
  type Product,
} from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { Stars } from "@/components/Stars";
import { CartIcon, CheckIcon, HeartIcon, ShieldIcon, TruckIcon } from "@/components/Icons";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add, wishlist, toggleWish, hydrated } = useStore();
  const [added, setAdded] = useState(false);
  const saved = hydrated && wishlist.includes(product.slug);
  const off = discountPct(product.priceCents, product.compareAtCents);
  const lowStock = product.stock > 0 && product.stock <= 50;

  return (
    <article
      className="card card-hover group relative flex h-full flex-col overflow-hidden"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <Link href={`/product/${product.slug}`} className="relative block">
        <div className="tile relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width:640px) 46vw, (max-width:1024px) 30vw, 22vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
            {product.badge && (
              <span className="tag bg-white/95 text-brand-dark shadow-sm">{product.badge}</span>
            )}
            {off > 0 && (
              <span className="tag bg-sale text-white shadow-sm">{off}% off</span>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        aria-label={saved ? "Remove from saved" : "Save for later"}
        onClick={() => toggleWish(product.slug)}
        className={`absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full border bg-white/95 backdrop-blur transition-all duration-200 ${
          saved
            ? "border-sale/40 text-sale"
            : "border-line text-slate-400 hover:border-slate-300 hover:text-sale"
        }`}
      >
        <HeartIcon className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
      </button>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-brand">
            {product.brand}
          </span>
          <span className="flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-good">
            <ShieldIcon className="h-3 w-3" /> Assured
          </span>
        </div>

        <h3 className="mt-1.5 line-clamp-1 text-[14.5px] font-semibold leading-snug text-ink">
          <Link href={`/product/${product.slug}`} className="hover:text-brand">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-muted">{product.tagline}</p>

        <div className="mt-2 flex items-center gap-1.5">
          <Stars rating={product.rating} />
          <span className="text-[11.5px] font-medium text-slate-500">
            {product.rating.toFixed(1)} · {countLabel(product.reviews)} reviews
          </span>
        </div>

        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-[19px] font-bold tracking-tight text-ink">
            {money(product.priceCents)}
          </span>
          {product.compareAtCents && (
            <span className="text-[12.5px] text-slate-400 line-through">
              {money(product.compareAtCents)}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[11.5px] text-muted">
          No-cost EMI {money(emiCents(product.priceCents))}/mo
          {lowStock ? (
            <span className="ml-1.5 font-semibold text-sale">Only {product.stock} left</span>
          ) : (
            <span className="ml-1.5 font-semibold text-good">In stock</span>
          )}
        </p>

        <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted">
            <TruckIcon className="h-3.5 w-3.5 text-good" /> Free delivery
          </span>
          <button
            type="button"
            disabled={product.stock === 0}
            onClick={() => {
              add(product);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1200);
            }}
            className={`btn ml-auto !py-1.5 !text-[12px] ${
              added ? "btn-primary" : "btn-ghost"
            }`}
          >
            {added ? (
              <>
                <CheckIcon className="h-3.5 w-3.5" /> Added
              </>
            ) : (
              <>
                <CartIcon className="h-3.5 w-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
