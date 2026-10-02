"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { discountPct, emiCents, money, type Product } from "@/lib/catalog";
import { ArrowIcon, CartIcon, CheckIcon, CloseIcon, HeartIcon, ShieldIcon } from "@/components/Icons";
import { Stars } from "@/components/Stars";

export function SavedView({ products }: { products: Product[] }) {
  const { wishlist, toggleWish, add, hydrated } = useStore();
  const saved = wishlist
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-2 text-[12.5px] text-muted">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-ink">Saved items</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-end gap-4 border-b border-line pb-5">
        <div>
          <h1 className="text-[clamp(1.6rem,3.6vw,2.2rem)] font-extrabold text-ink">
            Saved items <span className="text-brand">({hydrated ? saved.length : 0})</span>
          </h1>
          <p className="mt-1 text-[13.5px] text-muted">
            We watch the price and stock for everything you save. Nothing here is reserved — add it to
            the cart to lock it in.
          </p>
        </div>
        {saved.length > 0 && (
          <button
            onClick={() => saved.forEach((p) => p.stock > 0 && add(p))}
            className="btn btn-accent ml-auto"
          >
            <CartIcon className="h-4 w-4" /> Add all to cart
          </button>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="card mt-6 flex flex-col items-center gap-4 px-6 py-20 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-rose-50 text-rose-300">
            <HeartIcon className="h-9 w-9" />
          </span>
          <h2 className="text-[20px] font-bold text-ink">No saved items yet</h2>
          <p className="max-w-md text-[14px] leading-relaxed text-muted">
            Tap the heart icon on any product to keep it here. Saved items show price drops first, and
            you will get an email the moment stock is refreshed.
          </p>
          <Link href="/shop" className="btn btn-primary mt-1">
            Browse the catalogue <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((p) => {
            const off = discountPct(p.priceCents, p.compareAtCents);
            return (
              <div key={p.slug} className="card rise-in flex gap-4 p-4 transition-colors hover:border-slate-300">
                <Link href={`/product/${p.slug}`} className="tile h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                  <Image src={p.image} alt={p.name} width={240} height={240} className="h-full w-full object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0">
                      <p className="text-[10.5px] font-bold uppercase tracking-[0.05em] text-brand">{p.brand}</p>
                      <Link href={`/product/${p.slug}`} className="text-[14px] font-semibold text-ink hover:text-brand">
                        {p.name}
                      </Link>
                      <div className="mt-1 flex items-center gap-1.5">
                        <Stars rating={p.rating} />
                        <span className="text-[11.5px] text-muted">{p.reviews.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleWish(p.slug)}
                      aria-label={`Remove ${p.name} from saved`}
                      className="ml-auto grid h-7 w-7 place-items-center rounded-lg border border-line text-slate-400 transition-colors hover:border-sale/40 hover:text-sale"
                    >
                      <CloseIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="mt-2 flex items-baseline gap-2">
                    <span className="text-[17px] font-bold text-ink">{money(p.priceCents)}</span>
                    {off > 0 && <span className="text-[12px] font-semibold text-sale">{off}% off</span>}
                  </p>
                  <p className="text-[11.5px] text-muted">
                    EMI {money(emiCents(p.priceCents))}/mo ·{" "}
                    <span className={p.stock <= 50 ? "font-semibold text-sale" : "font-semibold text-good"}>
                      {p.stock === 0 ? "Out of stock" : `${p.stock} in stock`}
                    </span>
                  </p>

                  <button
                    onClick={() => add(p)}
                    disabled={p.stock === 0}
                    className="btn btn-ghost mt-2.5 w-full !py-2 !text-[12.5px]"
                  >
                    {p.stock === 0 ? (
                      "Currently unavailable"
                    ) : (
                      <>
                        <CheckIcon className="h-3.5 w-3.5 text-good" /> Add to cart
                      </>
                    )}
                  </button>
                  <p className="mt-2 flex items-center gap-1 text-[11.5px] text-muted">
                    <ShieldIcon className="h-3.5 w-3.5 text-brand" /> {p.warranty}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
