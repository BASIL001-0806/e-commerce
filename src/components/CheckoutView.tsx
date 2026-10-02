"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { quote, DELIVERY, COD_FEE, type DeliveryId, type PaymentId } from "@/lib/pricing";
import { countLabel, money } from "@/lib/catalog";
import {
  ArrowIcon,
  BankIcon,
  CartIcon,
  CheckIcon,
  LockIcon,
  ReturnIcon,
  ShieldIcon,
  TruckIcon,
  UpiIcon,
  WalletIcon,
} from "@/components/Icons";

type Errors = Record<string, string>;

const STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export function CheckoutView() {
  const { lines, subtotal, promo, hydrated, pushToast, clearCart } = useStore();
  const router = useRouter();
  const [delivery, setDelivery] = useState<DeliveryId>("standard");
  const [payment, setPayment] = useState<PaymentId>("upi");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Karnataka",
    postal: "",
    cardName: "",
    cardNumber: "",
    exp: "",
    cvc: "",
    upiId: "",
    gstin: "",
  });

  const pricing = useMemo(
    () => quote({ subtotal, promoCode: promo?.code ?? null, delivery, payment }),
    [subtotal, promo, delivery, payment],
  );

  const set = (key: keyof typeof form) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const validate = () => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = "Enter the full name for delivery";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = "We send the invoice and tracking here";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ""))) e.phone = "Enter a valid 10-digit mobile number";
    if (form.address.trim().length < 8) e.address = "Add house / flat number and street";
    if (form.city.trim().length < 2) e.city = "City is required";
    if (!/^\d{6}$/.test(form.postal.trim())) e.postal = "PIN code must be 6 digits";
    if (form.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{3}$/.test(form.gstin.toUpperCase()))
      e.gstin = "GSTIN looks incorrect (15 characters)";

    if (payment === "card") {
      if (form.cardName.trim().length < 3) e.cardName = "Name as printed on the card";
      const digits = form.cardNumber.replace(/\D/g, "");
      if (digits.length < 15) e.cardNumber = "Card number looks short";
      if (!/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(form.exp)) e.exp = "Use MM / YY";
      else {
        const [mm, yy] = form.exp.split("/").map((s) => Number(s.trim()));
        if (new Date(2000 + yy, mm, 0, 23, 59).getTime() < Date.now()) e.exp = "This card has expired";
      }
      if (!/^\d{3,4}$/.test(form.cvc)) e.cvc = "3 or 4 digits";
    }
    if (payment === "upi" && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(form.upiId.trim())) {
      e.upiId = "Format: name@okhdfcbank";
    }
    return e;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      pushToast("Check the highlighted fields", `${Object.keys(found).length} field(s) need attention`, "#f59e0b");
      document.querySelector<HTMLElement>("[data-invalid='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (lines.length === 0) {
      setServerError("Your cart is empty — nothing to order.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            state: form.state,
            postal: form.postal,
          },
          payment: {
            method: payment,
            number: form.cardNumber,
            upiId: form.upiId,
          },
          delivery,
          promo: promo?.code ?? null,
          items: lines.map((l) => ({ slug: l.slug, qty: l.qty, color: l.color })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "We could not place the order. Please try again.");
      clearCart();
      router.push(`/orders/${data.id}?placed=1`);
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Unexpected error, please retry.");
    }
  };

  if (hydrated && lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="card flex flex-col items-center gap-4 px-6 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-slate-50 text-slate-300">
            <CartIcon className="h-8 w-8" />
          </span>
          <h1 className="text-[24px] font-extrabold text-ink">Nothing to check out yet</h1>
          <p className="max-w-sm text-[14px] leading-relaxed text-muted">
            Add a product to the cart and the checkout will open up with EMI, UPI and COD options.
          </p>
          <Link href="/shop" className="btn btn-primary mt-1">
            Browse products <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-2 text-[12.5px] text-muted">
        <Link href="/cart" className="hover:text-brand">
          Cart
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-ink">Checkout</span>
      </nav>

      {/* steps */}
      <ol className="mt-3 flex flex-wrap items-center gap-2 border-b border-line pb-4 text-[13px]">
        {[
          { n: 1, label: "Cart", done: true },
          { n: 2, label: "Address & payment", done: false },
          { n: 3, label: "Order summary", done: false },
        ].map((s, i) => (
          <li key={s.n} className="flex items-center gap-2">
            <span
              className={`grid h-6 w-6 place-items-center rounded-full text-[11.5px] font-bold ${
                s.n === 2 ? "bg-brand text-white" : s.done ? "bg-emerald-50 text-good" : "bg-slate-100 text-slate-400"
              }`}
            >
              {s.done && s.n !== 2 ? <CheckIcon className="h-3.5 w-3.5" /> : s.n}
            </span>
            <span className={s.n === 2 ? "font-semibold text-ink" : "text-muted"}>{s.label}</span>
            {i < 2 && <span className="hidden h-px w-10 bg-line sm:block" />}
          </li>
        ))}
        <span className="ml-auto flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-good">
          <LockIcon className="h-3.5 w-3.5" /> Demo store — no real payment is taken
        </span>
      </ol>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="space-y-5">
          {/* contact + address */}
          <section className="card p-5">
            <h2 className="text-[15px] font-bold text-ink">Contact & delivery address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={form.name} onChange={set("name")} error={errors.name} placeholder="Rhea Mendonça" autoComplete="name" />
              <Field label="Mobile number" value={form.phone} onChange={(v) => set("phone")(v.replace(/\D/g, "").slice(0, 10))} error={errors.phone} placeholder="98123 45670" inputMode="numeric" autoComplete="tel" hint="Used for delivery calls and OTP" />
              <Field label="Email address" value={form.email} onChange={set("email")} error={errors.email} placeholder="you@email.in" type="email" className="sm:col-span-2" autoComplete="email" hint="Invoice and tracking will be sent here" />
              <Field label="Flat, house no., street" value={form.address} onChange={set("address")} error={errors.address} placeholder="402 Palm Grove Residency, 14 Cathedra Lane" className="sm:col-span-2" autoComplete="street-address" />
              <Field label="City / district" value={form.city} onChange={set("city")} error={errors.city} placeholder="Bengaluru" autoComplete="address-level2" />
              <Field label="PIN code" value={form.postal} onChange={(v) => set("postal")(v.replace(/\D/g, "").slice(0, 6))} error={errors.postal} placeholder="560034" inputMode="numeric" autoComplete="postal-code" />
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[12px] font-semibold text-slate-500">State</span>
                <select
                  value={form.state}
                  onChange={(e) => set("state")(e.target.value)}
                  className="field !text-[13.5px]"
                  aria-label="State"
                >
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="GSTIN for business invoice (optional)"
                value={form.gstin}
                onChange={(v) => set("gstin")(v.toUpperCase().slice(0, 15))}
                error={errors.gstin}
                placeholder="29AABCS1429L1ZQ"
                className="sm:col-span-2"
                hint="We add your company details, HSN and tax breakup to the invoice"
              />
            </div>
          </section>

          {/* delivery */}
          <section className="card p-5">
            <h2 className="text-[15px] font-bold text-ink">Delivery preference</h2>
            <div className="mt-3 grid gap-2.5">
              {(Object.keys(DELIVERY) as DeliveryId[]).map((id) => {
                const opt = DELIVERY[id];
                const active = delivery === id;
                const waived = id === "standard" && pricing.shipping === 0;
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setDelivery(id)}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                      active ? "border-brand bg-blue-50/60" : "border-line bg-white hover:border-slate-300"
                    }`}
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                        active ? "border-brand bg-brand text-white" : "border-slate-300 text-transparent"
                      }`}
                    >
                      <CheckIcon className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-semibold text-ink">{opt.label}</span>
                      <span className="block text-[12px] text-muted">{opt.eta}</span>
                    </span>
                    <span className={`text-[13px] font-bold ${waived || opt.cents === 0 ? "text-good" : "text-ink"}`}>
                      {waived || opt.cents === 0 ? "FREE" : money(opt.cents)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* payment */}
          <section className="card p-5">
            <h2 className="text-[15px] font-bold text-ink">Payment method</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { id: "upi" as const, label: "UPI", icon: UpiIcon },
                { id: "card" as const, label: "Card / EMI", icon: BankIcon },
                { id: "cod" as const, label: "Cash on delivery", icon: WalletIcon },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPayment(m.id)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-semibold transition-colors ${
                    payment === m.id
                      ? "border-brand bg-blue-50 text-brand-dark"
                      : "border-line bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <m.icon className="h-4 w-4" />
                  {m.label}
                </button>
              ))}
            </div>

            {payment === "upi" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  label="UPI ID"
                  value={form.upiId}
                  onChange={set("upiId")}
                  error={errors.upiId}
                  placeholder="rhea@okicici"
                  className="sm:col-span-2"
                  hint="A collect request is sent to this ID — approve it in your UPI app"
                />
                <div className="sm:col-span-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {["Google Pay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => set("upiId")(`yourname@${app === "Paytm" ? "paytm" : app === "PhonePe" ? "okaxis" : "okhdfcbank"}`)}
                      className="rounded-lg border border-line bg-slate-50 px-2 py-2 text-[12px] font-medium text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-brand-dark"
                    >
                      Pay with {app}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {payment === "card" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Name on card" value={form.cardName} onChange={set("cardName")} error={errors.cardName} placeholder="RHEA MENDONCA" className="sm:col-span-2" />
                <Field
                  label="Card number"
                  value={form.cardNumber}
                  onChange={(v) => set("cardNumber")(v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())}
                  error={errors.cardNumber}
                  placeholder="4111 1111 1111 1111"
                  className="sm:col-span-2"
                  inputMode="numeric"
                  hint="Demo mode — any 16-digit number is accepted and only the last 4 digits are stored"
                />
                <Field label="Expiry (MM / YY)" value={form.exp} onChange={(v) => {
                    const d = v.replace(/\D/g, "").slice(0, 4);
                    set("exp")(d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d);
                  }} error={errors.exp} placeholder="09 / 28" inputMode="numeric" />
                <Field label="CVV" value={form.cvc} onChange={(v) => set("cvc")(v.replace(/\D/g, "").slice(0, 4))} error={errors.cvc} placeholder="123" inputMode="numeric" />
                <div className="sm:col-span-2 flex flex-wrap gap-2">
                  {[
                    { id: "3", label: "No-cost EMI · 3 months" },
                    { id: "6", label: "No-cost EMI · 6 months" },
                    { id: "12", label: "No-cost EMI · 12 months" },
                    { id: "full", label: "Pay full amount" },
                  ].map((t) => (
                    <span key={t.id} className="chip !cursor-default">
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {payment === "cod" && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-[13.5px] font-semibold text-amber-900">Cash on delivery available</p>
                <p className="mt-1 text-[13px] leading-relaxed text-amber-800">
                  Pay the delivery partner in cash or by UPI at your door. A handling fee of{" "}
                  {money(COD_FEE)} applies and the OTP for your order is sent to {form.phone || "your mobile"}.
                </p>
              </div>
            )}
          </section>

          {serverError && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-medium text-sale">
              {serverError}
            </p>
          )}
        </div>

        {/* order summary */}
        <aside className="space-y-4 lg:sticky lg:top-[86px]">
          <div className="card">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-500">
                Order summary
              </h2>
              <span className="text-[12.5px] font-medium text-muted">
                {lines.length} {lines.length === 1 ? "item" : "items"}
              </span>
            </div>
            <ul className="max-h-[280px] divide-y divide-line overflow-y-auto px-5">
              {lines.map((l) => (
                <li key={`${l.slug}-${l.color}`} className="flex items-center gap-3 py-3">
                  <span className="tile relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                    <Image src={l.image} alt={l.name} width={120} height={120} className="h-full w-full object-cover" />
                    <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 font-mono text-[9.5px] font-bold text-white">
                      {l.qty}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10.5px] font-bold uppercase text-brand">{l.brand}</span>
                    <span className="block truncate text-[13px] font-semibold text-ink">{l.name}</span>
                    <span className="block truncate text-[11.5px] text-muted">{l.color}</span>
                  </span>
                  <span className="text-[13px] font-semibold text-ink">{money(l.priceCents * l.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2.5 border-t border-line px-5 py-4 text-[13.5px]">
              <Row label="Price" value={money(subtotal)} />
              {pricing.discount > 0 && <Row label={`Coupon (${promo?.code})`} value={`− ${money(pricing.discount)}`} tone="text-good" />}
              <Row
                label={`Delivery · ${DELIVERY[delivery].label}`}
                value={pricing.shipping === 0 ? "FREE" : money(pricing.shipping)}
                tone={pricing.shipping === 0 ? "text-good" : undefined}
              />
              {pricing.codFee > 0 && <Row label="COD handling" value={money(pricing.codFee)} />}
              <Row label="GST" value="Included in price" muted />
            </div>

            <div className="flex items-baseline justify-between border-t border-dashed border-line px-5 py-4">
              <span className="text-[14px] font-bold text-ink">Total payable</span>
              <span className="text-[24px] font-extrabold tracking-tight text-ink">{money(pricing.total)}</span>
            </div>
            {payment === "card" && pricing.total > 300000 && (
              <p className="px-5 pb-4 text-[12px] font-medium text-good">
                No-cost EMI available — {money(Math.ceil(pricing.total / 12))}/month for 12 months
              </p>
            )}

            <div className="px-5 pb-5">
              <button type="submit" disabled={status === "sending"} className="btn btn-accent w-full">
                {status === "sending" ? (
                  <>
                    <span className="spin inline-block h-3.5 w-3.5 rounded-full border-2 border-white/60 border-t-white" />
                    Placing order…
                  </>
                ) : payment === "cod" ? (
                  <>Place order · {money(pricing.total)} on delivery</>
                ) : (
                  <>Pay {money(pricing.total)}</>
                )}
              </button>
              <Link href="/cart" className="btn btn-ghost mt-2 w-full">
                Back to cart
              </Link>
            </div>
          </div>

          <div className="card space-y-2.5 p-4 text-[12.5px] text-slate-600">
            <p className="flex items-center gap-2">
              <ShieldIcon className="h-4 w-4 text-good" /> Buyer protection on every order ·{" "}
              {countLabel(412000)} orders delivered
            </p>
            <p className="flex items-center gap-2">
              <ReturnIcon className="h-4 w-4 text-good" /> 7-day replacement, pickup from your address
            </p>
            <p className="flex items-center gap-2">
              <TruckIcon className="h-4 w-4 text-good" /> Dispatch same day for orders before 4 pm
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  className = "",
  inputMode,
  autoComplete,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  inputMode?: "numeric" | "text" | "tel" | "email";
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <label className={`block ${className}`} data-invalid={error ? "true" : "false"}>
      <span className="mb-1.5 block text-[12px] font-semibold text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`field !text-[13.5px] ${error ? "!border-sale !ring-2 !ring-rose-100" : ""}`}
      />
      {error ? (
        <span className="mt-1.5 block text-[12px] font-medium text-sale">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-[11.5px] text-muted">{hint}</span>
      ) : null}
    </label>
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
