"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useStore, FREE_SHIPPING_AT, SHIPPING_FLAT } from "@/lib/store";
import { countLabel, money, type Product } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import {
  ArrowIcon,
  CartIcon,
  CheckIcon,
  CloseIcon,
  MinusIcon,
  PlusIcon,
  ReturnIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/Icons";

export function CartView({ recommended }: { recommended: Product[] }) {
  const {
    lines,
    setQty,
    remove,
    clearCart,
    subtotal,
    discount,
    shipping,
    total,
    promo,
    applyPromo,
    clearPromo,
    promoError,
    count,
  } = useStore();
  const [code, setCode] = useState("");

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="card flex flex-col items-center gap-4 px-6 py-16 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-slate-50 text-slate-300">
            <CartIcon className="h-9 w-9" />
          </span>
          <h1 className="text-[24px] font-extrabold text-ink">Your cart is empty</h1>
          <p className="max-w-md text-[14px] leading-relaxed text-muted">
            Nothing here yet. Our bestsellers are moving fast this week — the Airdopes and the Noise
            ColorFit are both under ₹2,500 right now.
          </p>
          <div className="mt-1 flex flex-wrap justify-center gap-2">
            <Link href="/shop" className="btn btn-primary">
              Start shopping <ArrowIcon className="h-4 w-4" />
            </Link>
            <Link href="/saved" className="btn btn-ghost">
              View saved items
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-[17px] font-bold text-ink">Popular right now</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.slice(0, 4).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const remaining = Math.max(FREE_SHIPPING_AT - (subtotal - discount), 0);

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-2 text-[12.5px] text-muted">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-ink">My cart</span>
      </nav>
      <div className="mt-3 flex flex-wrap items-end gap-4 border-b border-line pb-5">
        <h1 className="text-[clamp(1.6rem,3.4vw,2.2rem)] font-extrabold text-ink">
          My cart <span className="text-brand">({count})</span>
        </h1>
        <button
          onClick={clearCart}
          className="ml-auto flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-500 transition-colors hover:text-sale"
        >
          <CloseIcon className="h-3.5 w-3.5" /> Empty cart
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="space-y-3">
          {lines.map((line) => (
            <div key={`${line.slug}-${line.color}`} className="card rise-in p-4">
              <div className="flex gap-4">
                <Link
                  href={`/product/${line.slug}`}
                  className="tile h-24 w-24 shrink-0 overflow-hidden rounded-lg"
                >
                  <Image src={line.image} alt={line.name} width={240} height={240} className="h-full w-full object-cover" />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-brand">
                        {line.brand}
                      </p>
                      <Link
                        href={`/product/${line.slug}`}
                        className="text-[14.5px] font-semibold leading-snug text-ink hover:text-brand"
                      >
                        {line.name}
                      </Link>
                      <p className="mt-0.5 text-[12.5px] text-muted">
                        {line.color} · {money(line.priceCents)} each
                      </p>
                    </div>
                    <button
                      onClick={() => remove(line.slug, line.color)}
                      aria-label={`Remove ${line.name}`}
                      className="ml-auto grid h-7 w-7 place-items-center rounded-lg border border-line text-slate-400 transition-colors hover:border-sale/40 hover:text-sale"
                    >
                      <CloseIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 rounded-lg border border-line p-1">
                      <button
                        onClick={() => setQty(line.slug, line.color, line.qty - 1)}
                        aria-label="Decrease quantity"
                        className="grid h-7 w-7 place-items-center rounded text-slate-500 hover:bg-slate-50 hover:text-ink"
                      >
                        <MinusIcon className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center font-mono text-[13px] font-semibold">{line.qty}</span>
                      <button
                        onClick={() => setQty(line.slug, line.color, line.qty + 1)}
                        disabled={line.qty >= line.stock}
                        aria-label="Increase quantity"
                        className="grid h-7 w-7 place-items-center rounded text-slate-500 hover:bg-slate-50 hover:text-ink disabled:opacity-40"
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-[12px] text-muted">
                      Max {line.stock} per order
                    </span>
                    <span className="ml-auto text-right text-[17px] font-bold text-ink">
                      {money(line.priceCents * line.qty)}
                    </span>
                  </div>

                  <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-good">
                    <TruckIcon className="h-4 w-4" /> Free delivery · 7-day replacement ·{" "}
                    {countLabel(line.stock)} in warehouse
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="card flex flex-wrap items-center gap-3 bg-emerald-50/60 !border-emerald-200 p-4">
            <TruckIcon className="h-5 w-5 text-good" />
            {remaining > 0 ? (
              <p className="text-[13px] text-slate-700">
                Add <span className="font-bold text-ink">{money(remaining)}</span> more to unlock free
                delivery — otherwise a flat {money(SHIPPING_FLAT)} applies.
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-[13px] font-semibold text-good">
                <CheckIcon className="h-4 w-4" /> Your order qualifies for FREE delivery
              </p>
            )}
            <Link href="/shop" className="ml-auto text-[12.5px] font-semibold text-brand hover:underline">
              Keep shopping
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: ReturnIcon, t: "7-day replacement", c: "Doorstep pickup for defects" },
              { icon: ShieldIcon, t: "Brand warranty", c: "Claims filed by us, not you" },
              { icon: TruckIcon, t: "Dispatch today", c: "Orders before 4 pm IST" },
            ].map((b) => (
              <div key={b.t} className="card flex items-center gap-3 p-3.5">
                <b.icon className="h-5 w-5 shrink-0 text-brand" />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-ink">{b.t}</p>
                  <p className="truncate text-[12px] text-muted">{b.c}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* price details */}
        <aside className="card lg:sticky lg:top-[86px]">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-500">
              Price details
            </h2>
          </div>
          <div className="space-y-2.5 px-5 py-4 text-[13.5px]">
            <Row label={`Total price (${count} items)`} value={money(subtotal)} />
            <Row
              label="Coupon discount"
              value={discount ? `− ${money(discount)}` : "None applied"}
              tone={discount ? "text-good" : "text-muted"}
            />
            <Row label="Delivery" value={shipping === 0 ? "FREE" : money(shipping)} tone={shipping === 0 ? "text-good" : undefined} />
            <Row label="Taxes" value="Inclusive of GST" muted />
          </div>

          <div className="flex items-baseline justify-between border-t border-dashed border-line px-5 py-4">
            <span className="text-[14px] font-bold text-ink">Total payable</span>
            <span className="text-[24px] font-extrabold tracking-tight text-ink">{money(total)}</span>
          </div>
          <p className="px-5 pb-3 text-[12px] font-medium text-good">
            You save {money(Math.max(discount, 0))} on this order
          </p>

          <div className="border-t border-line px-5 py-4">
            {promo ? (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                <CheckIcon className="h-4 w-4 text-good" />
                <span className="text-[12.5px] font-semibold text-slate-700">
                  {promo.code} applied — {promo.note}
                </span>
                <button onClick={clearPromo} aria-label="Remove coupon" className="ml-auto text-slate-400 hover:text-sale">
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  applyPromo(code);
                }}
                className="flex gap-2"
              >
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  aria-label="Coupon code"
                  className="field flex-1 !py-2 font-mono !text-[12.5px] uppercase"
                />
                <button type="submit" className="btn btn-ghost !px-3 !py-2 !text-[12.5px]">
                  Apply
                </button>
              </form>
            )}
            {promoError && <p className="mt-2 text-[12px] font-medium text-sale">{promoError}</p>}
            {!promo && !promoError && (
              <p className="mt-2 text-[11.5px] text-muted">
                Try <span className="font-mono font-semibold text-brand">FIRST10</span>,{" "}
                <span className="font-mono font-semibold text-brand">BILLION25</span> or{" "}
                <span className="font-mono font-semibold text-brand">SHIPFREE</span>
              </p>
            )}
          </div>

          <div className="px-5 pb-5">
            <Link href="/checkout" className="btn btn-accent w-full">
              Proceed to checkout <ArrowIcon className="h-4 w-4" />
            </Link>
            <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11.5px] text-muted">
              <ShieldIcon className="h-3.5 w-3.5 text-good" /> Secure checkout · UPI, cards, EMI, COD
            </p>
          </div>
        </aside>
      </div>

      <section className="mt-14">
        <div className="flex flex-wrap items-end gap-3 border-t border-line pt-10">
          <h2 className="text-[17px] font-bold text-ink">Customers also bought</h2>
          <Link href="/shop" className="ml-auto text-[13px] font-semibold text-brand hover:underline">
            See all products
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommended
            .filter((p) => !lines.some((l) => l.slug === p.slug))
            .slice(0, 4)
            .map((p, i) => (
              <Reveal key={p.slug} delay={i * 55}>
                <ProductCard product={p} index={i} />
              </Reveal>
            ))}
        </div>
      </section>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
  muted,
}: {
  label: string;
  value: string;
  tone?: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={muted ? "text-muted" : "text-slate-600"}>{label}</span>
      <span className={`font-medium ${tone ?? "text-ink"}`}>{value}</span>
    </div>
  );
}

function Reveal({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <div className="rise-in" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
