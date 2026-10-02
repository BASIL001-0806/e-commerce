import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadOrder } from "@/lib/orders";
import { money } from "@/lib/catalog";
import { CopyCode } from "@/components/CopyCode";
import {
  ArrowIcon,
  CheckIcon,
  ClockIcon,
  ReturnIcon,
  ShieldIcon,
  SupportIcon,
  TruckIcon,
} from "@/components/Icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Order details" };

const STEPS = [
  { label: "Order placed", note: "payment authorised" },
  { label: "Packed", note: "serial & invoice printed" },
  { label: "Out for delivery", note: "courier scan" },
  { label: "Delivered", note: "signature / OTP" },
];

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const found = await loadOrder(id);
  if (!found) notFound();

  const { order } = found;
  const justPlaced = query.placed === "1";
  const created = new Date(order.createdAt);
  const eta = new Date(created.getTime() + 1000 * 60 * 60 * 48);
  const activeStep = justPlaced ? 0 : order.status === "in transit" ? 2 : 1;
  const units = order.items.reduce((s, i) => s + i.qty, 0);
  const saved = order.discountCents + (order.shippingCents === 0 ? 9900 : 0);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-start gap-5 border-b border-line bg-emerald-50/60 px-6 py-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-good text-white">
            <CheckIcon className="h-6 w-6" strokeWidth={2.4} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-good">
              {justPlaced ? "Order placed successfully" : "Order tracker"}
            </p>
            <h1 className="mt-1.5 text-[clamp(1.5rem,3.4vw,2rem)] font-extrabold leading-tight text-ink">
              Thank you, {order.customerName.split(" ")[0]} — we have your order
            </h1>
            <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">
              {units} {units === 1 ? "item" : "items"} reserved for you. A confirmation email and GST
              invoice are on the way to{" "}
              <span className="font-semibold text-ink">{order.customerEmail}</span>. Records source:{" "}
              <span className="font-semibold text-brand">{found.source}</span>.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <CopyCode code={order.orderNumber} />
              <span className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[12.5px] font-medium text-slate-600">
                <ClockIcon className="h-4 w-4 text-brand" />
                Expected by {eta.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        {/* timeline */}
        <div className="grid gap-4 px-6 py-6 sm:grid-cols-4">
          {STEPS.map((s, i) => {
            const done = i <= activeStep;
            return (
              <div key={s.label}>
                <div className="flex items-center gap-2">
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                      done ? "bg-brand text-white" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {done ? <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.6} /> : i + 1}
                  </span>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <p className={`mt-2 text-[13.5px] font-semibold ${done ? "text-ink" : "text-slate-400"}`}>
                  {s.label}
                </p>
                <p className="text-[12px] text-muted">{s.note}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="card">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-[15px] font-bold text-ink">Items in this order</h2>
          </div>
          <ul className="divide-y divide-line px-5">
            {order.items.map((item) => (
              <li key={`${item.productSlug}-${item.color}`} className="flex items-center gap-4 py-4">
                <Link
                  href={`/product/${item.productSlug}`}
                  className="tile h-16 w-16 shrink-0 overflow-hidden rounded-lg"
                >
                  <Image src={item.image} alt={item.name} width={160} height={160} className="h-full w-full object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.05em] text-brand">
                    {item.brand}
                  </p>
                  <p className="truncate text-[14px] font-semibold text-ink">
                    <Link href={`/product/${item.productSlug}`} className="hover:text-brand">
                      {item.name}
                    </Link>
                  </p>
                  <p className="text-[12px] text-muted">
                    {item.color} · {money(item.unitCents)} each
                  </p>
                  <p className="mt-1 text-[12px] font-medium text-good">
                    <ShieldIcon className="mr-1 inline h-3.5 w-3.5" />1 year brand warranty · 7-day replacement
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-bold text-ink">{money(item.unitCents * item.qty)}</p>
                  <p className="font-mono text-[12px] text-muted">×{item.qty}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-line px-5 py-4 text-[13.5px]">
            <Row label="Item total" value={money(order.subtotalCents)} />
            {order.discountCents > 0 && (
              <Row label={`Coupon ${order.promo ?? ""}`} value={`− ${money(order.discountCents)}`} tone="text-good" />
            )}
            <Row label="Delivery" value={order.shippingCents === 0 ? "FREE" : money(order.shippingCents)} tone={order.shippingCents === 0 ? "text-good" : undefined} />
            {order.codFeeCents > 0 && <Row label="COD handling" value={money(order.codFeeCents)} />}
            <Row label="GST" value="Included in item prices" muted />
            <div className="flex items-baseline justify-between border-t border-dashed border-line pt-3">
              <span className="text-[14px] font-bold text-ink">Total paid</span>
              <span className="text-[24px] font-extrabold tracking-tight text-ink">{money(order.totalCents)}</span>
            </div>
            {saved > 0 && (
              <p className="text-right text-[12.5px] font-semibold text-good">
                You saved {money(saved)} on this order
              </p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="flex items-center gap-2 text-[14px] font-bold text-ink">
              <TruckIcon className="h-4 w-4 text-brand" /> Shipping address
            </h2>
            <address className="mt-2.5 not-italic text-[13.5px] leading-relaxed text-slate-600">
              {order.customerName}
              <br />
              {order.address}
              <br />
              {order.city}, {order.state} — {order.postal}
            </address>
            <p className="mt-3 border-t border-line pt-3 text-[12.5px] text-muted">
              Payment: <span className="font-semibold text-ink">{order.cardLast4}</span>
              <br />
              Delivery mode: <span className="font-semibold text-ink">{order.delivery}</span>
            </p>
          </div>

          <div className="card p-5">
            <h2 className="text-[14px] font-bold text-ink">Need anything else?</h2>
            <ul className="mt-3 space-y-2.5 text-[13px] leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <SupportIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                Call or WhatsApp the counter on 080-4718-2200, 9 am to 11 pm.
              </li>
              <li className="flex gap-2">
                <ReturnIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                Want a replacement? Raise it within 7 days of delivery and we schedule a doorstep pickup.
              </li>
            </ul>
            <div className="mt-4 grid gap-2">
              <Link href="/shop" className="btn btn-primary w-full">
                Continue shopping <ArrowIcon className="h-4 w-4" />
              </Link>
              <Link href="/cart" className="btn btn-ghost w-full">
                View my cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, tone, muted }: { label: string; value: string; tone?: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={muted ? "text-muted" : "text-slate-600"}>{label}</span>
      <span className={`font-medium ${tone ?? (muted ? "text-muted" : "text-ink")}`}>{value}</span>
    </div>
  );
}
