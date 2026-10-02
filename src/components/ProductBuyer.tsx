"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  countLabel,
  discountPct,
  emiCents,
  money,
  type Product,
} from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { BANK_OFFERS } from "@/lib/pricing";
import { Stars } from "@/components/Stars";
import {
  ArrowIcon,
  BankIcon,
  CheckIcon,
  HeartIcon,
  LockIcon,
  MinusIcon,
  PlusIcon,
  ReturnIcon,
  ShieldIcon,
  TruckIcon,
  UpiIcon,
} from "@/components/Icons";

const VIEWS = [
  { id: "front", label: "Front", transform: "scale(1)", filter: "saturate(0.62) contrast(1.03)" },
  {
    id: "detail",
    label: "Detail",
    transform: "scale(1.8) translate(-5%, -6%)",
    filter: "saturate(0.7) contrast(1.06)",
  },
  { id: "soft", label: "Studio", transform: "scale(1.08)", filter: "saturate(0.5) brightness(1.07)" },
  { id: "back", label: "Angle", transform: "scale(1.05) scaleX(-1)", filter: "saturate(0.62)" },
];

const TABS = ["Overview", "Specifications", "Ratings & reviews"] as const;

export function ProductBuyer({ product }: { product: Product }) {
  const { add, wishlist, toggleWish, hydrated, markSeen } = useStore();
  const router = useRouter();
  const [color, setColor] = useState(product.colors[0]?.name ?? "Standard");
  const [qty, setQty] = useState(1);
  const [view, setView] = useState(0);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [added, setAdded] = useState(false);
  const [pin, setPin] = useState("");
  const [pinResult, setPinResult] = useState<{ ok: boolean; text: string; cod: boolean } | null>(null);

  useEffect(() => {
    markSeen(product.slug);
  }, [product.slug, markSeen]);

  const saved = hydrated && wishlist.includes(product.slug);
  const off = discountPct(product.priceCents, product.compareAtCents);
  const youSave = product.compareAtCents ? product.compareAtCents - product.priceCents : 0;

  const checkPin = () => {
    if (!/^\d{6}$/.test(pin)) {
      setPinResult({ ok: false, text: "Enter a valid 6-digit PIN code", cod: false });
      return;
    }
    const n = Number(pin[0]);
    const days = 2 + (n % 3);
    const metros = ["560", "110", "400", "700", "600", "380", "302"].some((p) => pin.startsWith(p));
    const eta = new Date(Date.now() + days * 86400000);
    setPinResult({
      ok: true,
      text: `${metros ? "Tomorrow" : `${days} days`} · delivery by ${eta.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })}`,
      cod: n % 2 === 0,
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
      {/* ------------------------------------------------ gallery */}
      <div className="lg:sticky lg:top-[86px] lg:self-start">
        <div className="card relative overflow-hidden">
          <div className="tile relative aspect-square">
            <Image
              src={product.image}
              alt={`${product.name} — ${VIEWS[view].label}`}
              width={1024}
              height={1024}
              priority
              className="h-full w-full object-cover transition-all duration-500 ease-out"
              style={{ transform: VIEWS[view].transform, filter: VIEWS[view].filter }}
            />
            {off > 0 && (
              <span className="absolute left-3 top-3 rounded-md bg-sale px-2 py-1 text-[12px] font-bold text-white shadow">
                {off}% off
              </span>
            )}
            <button
              onClick={() => toggleWish(product.slug)}
              className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full border bg-white/95 px-3 py-1.5 text-[12px] font-semibold shadow-sm transition-colors ${
                saved ? "border-sale/40 text-sale" : "border-line text-slate-600 hover:text-sale"
              }`}
            >
              <HeartIcon className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        <div className="mt-3 flex gap-2.5">
          {VIEWS.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setView(i)}
              aria-label={`${v.label} view`}
              className={`tile relative h-[74px] flex-1 overflow-hidden rounded-lg border transition-all duration-200 ${
                view === i ? "!border-brand ring-2 ring-blue-100" : "border-line hover:border-slate-300"
              }`}
            >
              <Image
                src={product.image}
                alt={`${product.name} — ${v.label} view`}
                width={200}
                height={200}
                className="h-full w-full object-cover"
                style={{ transform: v.transform, filter: v.filter }}
              />
              <span className="absolute inset-x-0 bottom-0 bg-white/85 text-center text-[10px] font-semibold text-slate-600">
                {v.label}
              </span>
            </button>
          ))}
        </div>

        <div className="card mt-4 p-5">
          <div className="flex gap-2 border-b border-line pb-4">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                  tab === t ? "bg-blue-50 text-brand-dark" : "text-slate-500 hover:text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div key={tab} className="rise-in pt-4">
            {tab === "Overview" && (
              <div className="space-y-4">
                <p className="text-[13.5px] leading-relaxed text-slate-600">{product.description}</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-slate-700">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-good" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="rounded-lg bg-slate-50 p-3.5">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500">In the box</p>
                  <p className="mt-1 text-[13px] text-slate-600">
                    {product.specs.find((s) => s.label.toLowerCase().includes("box"))?.value ??
                      `${product.name}, warranty card`}
                  </p>
                </div>
              </div>
            )}

            {tab === "Specifications" && (
              <div className="overflow-hidden rounded-lg border border-line">
                <table className="w-full text-left text-[13px]">
                  <tbody>
                    {product.specs.map((s, i) => (
                      <tr key={s.label} className={i % 2 ? "bg-white" : "bg-slate-50/70"}>
                        <th className="w-[38%] px-3.5 py-2.5 text-[12px] font-semibold text-slate-500">
                          {s.label}
                        </th>
                        <td className="px-3.5 py-2.5 text-slate-700">{s.value}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50/70">
                      <th className="px-3.5 py-2.5 text-[12px] font-semibold text-slate-500">Warranty</th>
                      <td className="px-3.5 py-2.5 text-slate-700">{product.warranty}</td>
                    </tr>
                    <tr className="bg-white">
                      <th className="px-3.5 py-2.5 text-[12px] font-semibold text-slate-500">Country of origin</th>
                      <td className="px-3.5 py-2.5 text-slate-700">India · assembled at Bengaluru plant</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {tab === "Ratings & reviews" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-6 rounded-lg bg-slate-50 p-4">
                  <div>
                    <p className="text-[30px] font-extrabold leading-none text-ink">
                      {product.rating.toFixed(1)}
                    </p>
                    <Stars rating={product.rating} size={13} className="mt-1.5" />
                    <p className="mt-1 text-[11.5px] text-muted">
                      {countLabel(product.reviews)} verified ratings
                    </p>
                  </div>
                  <div className="min-w-[180px] flex-1 space-y-1.5">
                    {[
                      [5, 68],
                      [4, 19],
                      [3, 7],
                      [2, 3],
                      [1, 3],
                    ].map(([star, pct]) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-5 text-[11.5px] font-medium text-slate-500">{star}★</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                          <span
                            className="block h-full rounded-full bg-star"
                            style={{ width: `${pct}%` }}
                          />
                        </span>
                        <span className="w-8 text-right font-mono text-[11px] text-slate-500">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                {[
                  {
                    who: "Vikram S.",
                    city: "Nagpur",
                    when: "Verified buyer · 2 weeks ago",
                    text: `Exactly as described. ${product.name} arrived sealed, invoice with GSTIN in the box, and the build feels a class above the price.`,
                  },
                  {
                    who: "Anitha Raj",
                    city: "Thrissur",
                    when: "Verified buyer · 1 month ago",
                    text: "Delivery took three days to a tier-2 pin code. Support answered on WhatsApp in two minutes when I asked about warranty registration.",
                  },
                ].map((r) => (
                  <figure key={r.who} className="rounded-lg border border-line p-4">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-[12px] font-bold text-brand">
                        {r.who.slice(0, 1)}
                      </span>
                      <div>
                        <p className="text-[13px] font-semibold text-ink">
                          {r.who} <span className="font-normal text-muted">· {r.city}</span>
                        </p>
                        <p className="text-[11.5px] text-muted">{r.when}</p>
                      </div>
                      <Stars rating={4.5} className="ml-auto" />
                    </div>
                    <blockquote className="mt-2.5 text-[13.5px] leading-relaxed text-slate-700">
                      “{r.text}”
                    </blockquote>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ buy box */}
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-brand">{product.brand}</p>
        <h1 className="mt-1.5 text-[clamp(1.5rem,3.6vw,2.1rem)] font-extrabold leading-tight text-ink">
          {product.name}
        </h1>
        <p className="mt-1.5 text-[14px] text-slate-600">{product.tagline}</p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1 text-[12.5px] font-bold text-good">
            {product.rating.toFixed(1)} ★
          </span>
          <span className="text-[12.5px] text-muted">
            {countLabel(product.reviews)} ratings &{" "}
            {countLabel(Math.round(product.reviews / 7))} reviews
          </span>
          <span className="flex items-center gap-1 text-[12.5px] font-semibold text-brand">
            <ShieldIcon className="h-4 w-4" /> Assured
          </span>
        </div>

        <div className="card mt-5 p-5">
          <div className="flex flex-wrap items-end gap-3">
            <span className="text-[32px] font-extrabold leading-none tracking-tight text-ink">
              {money(product.priceCents)}
            </span>
            {product.compareAtCents && (
              <span className="pb-1 text-[15px] text-slate-400 line-through">
                {money(product.compareAtCents)}
              </span>
            )}
            {off > 0 && (
              <span className="pb-1 text-[15px] font-bold text-sale">
                {off}% off
              </span>
            )}
          </div>
          <p className="mt-1 text-[12.5px] text-muted">Inclusive of all taxes · EMI from {money(emiCents(product.priceCents))}/month</p>
          {youSave > 0 && (
            <p className="mt-1 text-[12.5px] font-semibold text-good">You save {money(youSave)}</p>
          )}

          {/* offers */}
          <div className="mt-4 space-y-2 rounded-lg bg-slate-50 p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Available offers</p>
            {BANK_OFFERS.slice(0, 3).map((o) => (
              <p key={o} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-slate-700">
                <BankIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {o}
              </p>
            ))}
          </div>

          {/* variants */}
          {product.colors.length > 0 && (
            <div className="mt-5">
              <p className="text-[12px] font-semibold text-slate-500">
                Colour: <span className="text-ink">{color}</span>
              </p>
              <div className="mt-2 flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    title={c.name}
                    aria-label={c.name}
                    className={`h-9 w-9 rounded-lg border-2 transition-all duration-200 ${
                      color === c.name
                        ? "border-brand shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                        : "border-line hover:border-slate-300"
                    }`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* qty + stock */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-[12.5px] font-semibold text-slate-500">Quantity</span>
            <div className="flex items-center gap-1 rounded-lg border border-line p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid h-7 w-7 place-items-center rounded text-slate-500 hover:bg-slate-50 hover:text-ink"
              >
                <MinusIcon className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center font-mono text-[13px] font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                disabled={qty >= product.stock}
                aria-label="Increase quantity"
                className="grid h-7 w-7 place-items-center rounded text-slate-500 hover:bg-slate-50 hover:text-ink disabled:opacity-40"
              >
                <PlusIcon className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className={`text-[12.5px] font-semibold ${product.stock <= 50 ? "text-sale" : "text-good"}`}>
              {product.stock === 0 ? "Out of stock" : `Only ${product.stock} left`}
            </span>
          </div>

          {/* deliver to */}
          <div className="mt-5 rounded-lg border border-line p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Deliver to</p>
            <div className="mt-2 flex gap-2">
              <input
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setPinResult(null);
                }}
                inputMode="numeric"
                placeholder="Enter 6-digit PIN code"
                aria-label="PIN code"
                className="field !py-2 font-mono !text-[13px]"
              />
              <button onClick={checkPin} className="btn btn-ghost !py-2 !text-[12.5px]">
                Check
              </button>
            </div>
            {pinResult && (
              <p
                className={`mt-2 flex flex-wrap items-center gap-2 text-[12.5px] font-medium ${
                  pinResult.ok ? "text-good" : "text-sale"
                }`}
              >
                {pinResult.ok ? <TruckIcon className="h-4 w-4" /> : null}
                {pinResult.text}
                {pinResult.ok && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                      pinResult.cod ? "bg-emerald-50 text-good" : "bg-rose-50 text-sale"
                    }`}
                  >
                    {pinResult.cod ? "COD available" : "Prepaid only"}
                  </span>
                )}
              </p>
            )}
          </div>

          {/* actions */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => {
                add(product, qty, color);
                setAdded(true);
                window.setTimeout(() => setAdded(false), 1400);
              }}
              disabled={product.stock === 0}
              className="btn btn-ghost flex-1 !py-2.5 !text-[13.5px]"
            >
              {added ? (
                <>
                  <CheckIcon className="h-4 w-4 text-good" /> Added to cart
                </>
              ) : (
                "Add to cart"
              )}
            </button>
            <button
              onClick={() => {
                add(product, qty, color);
                router.push("/checkout");
              }}
              disabled={product.stock === 0}
              className="btn btn-accent flex-1 !py-2.5 !text-[13.5px]"
            >
              Buy now <ArrowIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid gap-2 border-t border-line pt-4 text-[12.5px] text-slate-600">
            <p className="flex items-center gap-2">
              <TruckIcon className="h-4 w-4 text-brand" /> Free delivery on this item · dispatched today if
              ordered before 4 pm
            </p>
            <p className="flex items-center gap-2">
              <ReturnIcon className="h-4 w-4 text-brand" /> 7-day replacement · {product.warranty}
            </p>
            <p className="flex items-center gap-2">
              <UpiIcon className="h-4 w-4 text-brand" /> UPI, cards, net banking, COD · no-cost EMI available
            </p>
            <p className="flex items-center gap-2 text-muted">
              <LockIcon className="h-4 w-4" /> Secure payments · Buyer protection on every order
            </p>
          </div>
        </div>

        <div className="card mt-4 flex items-center gap-4 p-4">
          <span className="text-[13px] font-semibold text-ink">Sold and fulfilled by</span>
          <span className="ml-auto flex items-center gap-2 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[12.5px] font-bold text-brand-dark">
            <BoltBadge /> Shop Cart Retail Pvt. Ltd.
          </span>
        </div>

        <p className="mt-3 text-center text-[12px] text-muted">
          Need a bulk quote for 10+ units?{" "}
          <Link href="#newsletter" className="font-semibold text-brand hover:underline">
            Talk to our B2B desk
          </Link>
        </p>

        <div className="mt-4 lg:hidden">
          <Link href="/shop" className="btn btn-ghost w-full">
            Back to catalogue
          </Link>
        </div>

        <div className="mt-4 hidden lg:block">
          <Link href="/shop" className="text-[13px] font-semibold text-brand hover:underline">
            ← Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

function BoltBadge() {
  return <BoltDot />;
}

function BoltDot() {
  return <span className="grid h-5 w-5 place-items-center rounded bg-brand text-white"><CheckIcon className="h-3 w-3" /></span>;
}
