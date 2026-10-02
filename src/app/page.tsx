import Image from "next/image";
import Link from "next/link";
import { getProducts, testimonials, comingSoon } from "@/lib/products";
import {
  BRANDS,
  CATEGORIES,
  countLabel,
  discountPct,
  emiCents,
  money,
} from "@/lib/catalog";
import { BANK_OFFERS, FREE_SHIPPING_AT } from "@/lib/pricing";
import { ProductCard } from "@/components/ProductCard";
import { HeroShowcase } from "@/components/HeroShowcase";
import { DealCountdown } from "@/components/DealCountdown";
import { CountUp, Reveal } from "@/components/Reveal";
import { Stars } from "@/components/Stars";
import {
  ArrowIcon,
  BankIcon,
  BatteryIcon,
  BoltIcon,
  CameraIcon,
  ClockIcon,
  GamepadIcon,
  HeadphonesIcon,
  LaptopIcon,
  PhoneIcon,
  ReturnIcon,
  ShieldIcon,
  SupportIcon,
  TruckIcon,
  UpiIcon,
  WatchIcon,
  WaveIcon,
} from "@/components/Icons";

export const dynamic = "force-dynamic";

const CATEGORY_ICONS = {
  Audio: HeadphonesIcon,
  Wearables: WatchIcon,
  Mobile: PhoneIcon,
  Computing: LaptopIcon,
  Gaming: GamepadIcon,
  Photography: CameraIcon,
} as const;

const TRUST = [
  {
    icon: TruckIcon,
    title: "Free & fast delivery",
    copy: `Zero delivery fee above ${money(FREE_SHIPPING_AT)} across 19,000+ pin codes, with express next-day in 40 metros.`,
  },
  {
    icon: ReturnIcon,
    title: "7-day replacement",
    copy: "Damaged or wrong item? We replace it — no repair roulette, no restocking charge.",
  },
  {
    icon: BankIcon,
    title: "No-cost EMI & UPI",
    copy: "Split any order over 3–12 months with 12 banks, or pay by UPI, cards, net banking and COD.",
  },
  {
    icon: SupportIcon,
    title: "India-wide service",
    copy: "Brand warranty plus 1,100+ service centres. Invoice with GSTIN for input credit, every time.",
  },
];

export default async function HomePage() {
  const { products, source } = await getProducts();
  const hero = products.find((p) => p.slug === "boat-rockerz-550-anc") ?? products[0];
  const deals = [...products]
    .sort((a, b) => discountPct(b.priceCents, b.compareAtCents) - discountPct(a.priceCents, a.compareAtCents))
    .slice(0, 4);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const picks = products.slice(0, 8);
  const savings = products.reduce(
    (sum, p) => sum + Math.max((p.compareAtCents ?? 0) - p.priceCents, 0),
    0,
  );
  const units = products.reduce((s, p) => s + p.stock, 0);
  const deal = deals[0];

  return (
    <div>
      {/* ------------------------------------------------------------ HERO */}
      <section className="border-b border-line bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="mx-auto grid max-w-[1360px] items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.02fr_1.15fr] lg:gap-12 lg:py-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-[12px] font-semibold text-brand-dark">
              <span className="relative flex h-1.5 w-1.5">
                <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-good" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-good" />
              </span>
              {source === "db" ? `${countLabel(units)} units in stock` : "Live catalogue"} · ships today
            </span>

            <h1 className="mt-5 text-[clamp(2.1rem,5.2vw,3.5rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
              Big-brand electronics at{" "}
              <span className="text-brand">honest Indian prices</span>
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-600">
              boAt, Noise, Zebronics, Portronics, Redmi, Acer, Redgear and pTron — stocked in our
              Bengaluru warehouse, serial-verified, GST invoice ready. No inflated MRPs, no fake
              countdowns, no cost EMI from {money(emiCents(hero.priceCents))} a month.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/shop" className="btn btn-primary !px-5 !py-2.5">
                Shop all products
                <ArrowIcon className="h-4 w-4" />
              </Link>
              <Link href="/#deals" className="btn btn-accent !px-5 !py-2.5">
                <ClockIcon className="h-4 w-4" />
                Today&apos;s deals
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: TruckIcon, label: "Free delivery", value: `above ${money(FREE_SHIPPING_AT)}` },
                { icon: UpiIcon, label: "UPI & COD", value: "all India" },
                { icon: ShieldIcon, label: "1 yr warranty", value: "brand sealed" },
                { icon: ReturnIcon, label: "7-day", value: "replacement" },
              ].map((s) => (
                <div key={s.label} className="card !rounded-xl p-3">
                  <s.icon className="h-5 w-5 text-brand" />
                  <p className="mt-2 text-[13px] font-semibold text-ink">{s.label}</p>
                  <p className="text-[11.5px] text-muted">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          <HeroShowcase product={hero} />
        </div>
      </section>

      {/* ------------------------------------------------------------ BRANDS */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-3 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <p className="shrink-0 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Brands we stock
          </p>
          <div className="line-mask relative overflow-hidden">
            <div className="marquee-track gap-3">
              {[...BRANDS, ...BRANDS].map((b, i) => (
                <Link
                  key={`${b}-${i}`}
                  href={`/shop?q=${encodeURIComponent(b)}`}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line bg-slate-50 px-3.5 py-1.5 text-[13px] font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-brand-dark"
                >
                  <BoltIcon className="h-3 w-3 text-brand" />
                  {b}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ DEALS */}
      <section id="deals" className="mx-auto max-w-[1360px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center gap-4 border-b border-line bg-slate-50 px-5 py-4">
            <div className="flex items-center gap-2">
              <BoltIcon className="h-5 w-5 text-amber-500" />
              <h2 className="text-[17px] font-bold text-ink">Deals of the day</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-muted">Ends in</span>
              <DealCountdown />
            </div>
            <Link
              href="/shop?sort=discount"
              className="ml-auto flex items-center gap-1 text-[13px] font-semibold text-brand hover:text-brand-dark"
            >
              View all deals <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 p-5 lg:grid-cols-[1.25fr_2fr] lg:items-center lg:p-6">
            <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
              <Link href={`/product/${deal.slug}`} className="tile block h-40 w-40 overflow-hidden rounded-xl">
                <Image
                  src={deal.image}
                  alt={deal.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </Link>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-brand">{deal.brand}</p>
                <h3 className="mt-1 text-[18px] font-bold leading-tight text-ink">{deal.name}</h3>
                <p className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-[22px] font-bold text-sale">{money(deal.priceCents)}</span>
                  {deal.compareAtCents && (
                    <span className="text-[13px] text-slate-400 line-through">
                      {money(deal.compareAtCents)}
                    </span>
                  )}
                </p>
                <p className="text-[12.5px] font-semibold text-good">
                  {discountPct(deal.priceCents, deal.compareAtCents)}% off · you save{" "}
                  {money((deal.compareAtCents ?? 0) - deal.priceCents)}
                </p>
                <Link href={`/product/${deal.slug}`} className="btn btn-primary mt-3 !py-2 !text-[12.5px]">
                  Grab this deal
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {deals.slice(1, 4).map((p, i) => (
                <Reveal key={p.slug} delay={i * 70}>
                  <ProductCard product={p} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ CATEGORIES */}
      <section id="categories" className="mx-auto max-w-[1360px] px-4 pb-4 sm:px-6 lg:px-8">
        <SectionHead
          title="Shop by category"
          copy="Six counters, one cart. Tap a tile for a pre-filtered view of the catalogue."
          action={{ href: "/shop", label: "View all products" }}
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {CATEGORIES.map((cat, i) => {
            const Icon = CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS];
            const items = products.filter((p) => p.category === cat);
            const sample = items[0];
            return (
              <Reveal key={cat} delay={i * 55}>
                <Link
                  href={`/shop?category=${encodeURIComponent(cat)}`}
                  className="card card-hover group flex h-full flex-col p-4"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-3 text-[15px] font-bold text-ink">{cat}</h3>
                  <p className="text-[12.5px] text-muted">
                    {items.length} {items.length === 1 ? "product" : "products"}
                    {items.length > 0 ? ` · from ${money(Math.min(...items.map((p) => p.priceCents)))}` : ""}
                  </p>
                  {sample && (
                    <span className="tile mt-3 block aspect-[16/9] overflow-hidden rounded-lg">
                      <Image
                        src={sample.image}
                        alt={sample.name}
                        width={320}
                        height={180}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </span>
                  )}
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------ TOP PICKS */}
      <section className="mx-auto max-w-[1360px] px-4 py-12 sm:px-6 lg:px-8">
        <SectionHead
          title="Bestsellers this week"
          copy={`Ranked on real orders from the last 7 days. ${money(savings)} of savings are live right now.`}
          action={{ href: "/shop", label: "Open full catalogue" }}
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <ProductCard product={p} index={i} />
            </Reveal>
          ))}
        </div>

        <div className="card mt-6 grid gap-px overflow-hidden bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Under ₹2,000", q: "max=200000", icon: WaveIcon, note: "audio & accessories" },
            { k: "Wearables", q: "category=Wearables", icon: WatchIcon, note: "AMOLED smartwatches" },
            { k: "5G phones", q: "category=Mobile", icon: PhoneIcon, note: "Snapdragon & Dimensity" },
            { k: "Gaming", q: "category=Gaming", icon: GamepadIcon, note: "pads, keyboards, VR" },
          ].map((b) => (
            <Link
              key={b.k}
              href={`/shop?${b.q}`}
              className="group flex items-center gap-3 bg-white p-4 transition-colors hover:bg-slate-50"
            >
              <b.icon className="h-5 w-5 text-brand" />
              <span>
                <span className="block text-[14px] font-semibold text-ink group-hover:text-brand">
                  {b.k}
                </span>
                <span className="block text-[12px] text-muted">{b.note}</span>
              </span>
              <ArrowIcon className="ml-auto h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ TRUST */}
      <section id="trust" className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-[1360px] gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {TRUST.map((t, i) => (
            <Reveal key={t.title} delay={i * 70}>
              <div className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-good">
                  <t.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[14.5px] font-bold text-ink">{t.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">{t.copy}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ OFFERS + STATS */}
      <section className="mx-auto max-w-[1360px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <div className="card overflow-hidden">
            <div className="border-b border-line px-5 py-4">
              <h2 className="text-[16px] font-bold text-ink">Bank, UPI & EMI offers</h2>
              <p className="mt-0.5 text-[12.5px] text-muted">Applicable on cart total before delivery fee</p>
            </div>
            <ul className="divide-y divide-line">
              {BANK_OFFERS.map((o, i) => (
                <li key={o} className="flex items-start gap-3 px-5 py-3.5">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded bg-blue-50 font-mono text-[11px] font-bold text-brand">
                    {i + 1}
                  </span>
                  <span className="text-[13.5px] leading-relaxed text-slate-700">{o}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-2 bg-slate-50 px-5 py-4">
              <span className="text-[12.5px] font-semibold text-ink">Coupon codes for this week:</span>
              {["FIRST10", "BILLION25", "SHIPFREE"].map((c) => (
                <span key={c} className="rounded border border-dashed border-blue-300 bg-white px-2 py-0.5 font-mono text-[11.5px] font-bold text-brand-dark">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="card grid grid-cols-2 gap-4 p-5">
              {[
                { to: 412000, suffix: "+", label: "Orders delivered" },
                { to: 19400, suffix: "+", label: "Pin codes serviceable" },
                { to: 4.3, decimals: 1, label: "Average product rating" },
                { to: 96, suffix: "%", label: "Orders shipped same day" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[24px] font-extrabold tracking-tight text-ink">
                    <CountUp to={s.to} suffix={s.suffix ?? ""} decimals={s.decimals ?? 0} />
                  </p>
                  <p className="text-[12px] leading-snug text-muted">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="card flex items-center gap-4 bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white">
              <BatteryIcon className="h-8 w-8 shrink-0 text-blue-100" />
              <div>
                <p className="text-[15px] font-bold">Exchange your old device</p>
                <p className="mt-1 text-[13px] leading-relaxed text-blue-100">
                  Get up to {money(600000)} off when you hand over a working old phone, watch or
                  speaker. Pickup and valuation happen at your door.
                </p>
              </div>
              <Link
                href="/shop"
                className="btn ml-auto shrink-0 bg-white !text-[12.5px] !text-brand-dark hover:bg-blue-50"
              >
                Check value
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ ALL PRODUCTS */}
      <section className="mx-auto max-w-[1360px] px-4 pb-12 sm:px-6 lg:px-8">
        <SectionHead title="Everything on Shop Cart" copy="Complete catalogue — prices include GST and are capped at MRP." />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i, 7) * 50}>
              <ProductCard product={p} index={i} />
            </Reveal>
          ))}
        </div>
        {products.length > picks.length && (
          <div className="mt-6 flex justify-center">
            <Link href="/shop" className="btn btn-ghost">
              Show all {products.length} products <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------ STORY */}
      <section id="story" className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">Why Shop Cart</p>
            <h2 className="mt-3 text-[clamp(1.7rem,3.6vw,2.4rem)] font-extrabold leading-tight text-ink">
              A local electronics shop that learned to ship
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-slate-600">
              We started as a SP Road counter in Bengaluru selling keyboards and speakers to students.
              Same team, same counters, now with a warehouse — which means the person packing your
              boAt parcel has probably sold one across the counter before.
            </p>
            <ul className="mt-6 space-y-4">
              {[
                {
                  t: "We check what boxes skip",
                  c: "Every SKU is unboxed, serial-scanned and battery-tested before it enters stock. Failed units go back, not to you.",
                },
                {
                  t: "One price, all week",
                  c: "No balloon-then-discount theatre. Our MRP strikethroughs are the real listed prices from brand price lists.",
                },
                {
                  t: "Service you can walk into",
                  c: "Warranty claims are filed by us on your behalf, with loaner devices for orders above ₹15,000.",
                },
              ].map((s) => (
                <li key={s.t} className="flex gap-3 border-l-2 border-line pl-4">
                  <div>
                    <h3 className="text-[14.5px] font-bold text-ink">{s.t}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">{s.c}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Reveal>
            <div className="card overflow-hidden">
              <div className="grid grid-cols-[1.3fr_1fr_1fr] border-b border-line bg-slate-50 text-[12.5px]">
                <div className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Compare
                </div>
                <div className="px-4 py-3 text-center text-[12.5px] font-bold text-brand">Shop Cart</div>
                <div className="px-4 py-3 text-center text-[12.5px] font-semibold text-slate-500">
                  Marketplace
                </div>
              </div>
              {[
                ["Price above MRP first", "Never", "Common practice"],
                ["GST invoice with HSN", "Always", "Optional"],
                ["Warranty handled by us", "Yes", "You call the brand"],
                ["Return window", "7 days, doorstep", "Varies by seller"],
                ["Minimum order for free delivery", "None above ₹4,999", "Seller dependent"],
                ["Support", "Phone + WhatsApp, 9 am–11 pm", "Ticket queue"],
              ].map((row, i) => (
                <div key={row[0]} className={`grid grid-cols-[1.3fr_1fr_1fr] text-[12.5px] ${i % 2 ? "bg-white" : "bg-slate-50/60"}`}>
                  <div className="px-4 py-3 text-slate-600">{row[0]}</div>
                  <div className="px-4 py-3 text-center font-semibold text-ink">{row[1]}</div>
                  <div className="px-4 py-3 text-center text-slate-400">{row[2]}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ REVIEWS */}
      <section className="mx-auto max-w-[1360px] px-4 py-14 sm:px-6 lg:px-8">
        <SectionHead
          title="Verified reviews from Indian buyers"
          copy="Collected automatically 10 days after delivery. Only verified orders can post."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((r, i) => (
            <Reveal key={r.handle} delay={i * 60}>
              <figure className="card h-full p-5">
                <div className="flex items-center gap-2">
                  <Stars rating={4.6} />
                  <span className="ml-auto flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-good">
                    <ShieldIcon className="h-3 w-3" /> Verified
                  </span>
                </div>
                <blockquote className="mt-3 text-[13.5px] leading-relaxed text-slate-700">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-[12px] font-bold text-brand">
                    {r.name.slice(0, 1)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-ink">
                      {r.name} · {r.city}
                    </span>
                    <span className="block truncate text-[11.5px] text-muted">{r.product}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ COMING SOON */}
      <section className="mx-auto max-w-[1360px] px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.1fr]">
          {comingSoon.map((c, i) => (
            <Reveal key={c.name} delay={i * 70}>
              <div className="card flex h-full flex-col border-dashed p-5">
                <span className="tag self-start bg-slate-100 text-slate-500">Coming {c.eta.toLowerCase()}</span>
                <h3 className="mt-3 text-[16px] font-bold text-ink">{c.name}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{c.note}</p>
                <Link href="#newsletter" className="btn btn-ghost mt-4 self-start !py-2 !text-[12.5px]">
                  Notify me
                </Link>
              </div>
            </Reveal>
          ))}
          <Reveal delay={140}>
            <div className="card flex h-full flex-col justify-between bg-[#111827] p-5 text-white">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  Need help choosing?
                </p>
                <h3 className="mt-2 text-[18px] font-bold leading-snug">
                  Talk to a product expert on WhatsApp
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-300">
                  Send your budget and use-case — our team replies with three options, in stock, at
                  real prices. 9 am to 11 pm, every day.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/checkout" className="btn btn-accent !py-2 !text-[12.5px]">
                  Start checkout
                </Link>
                <Link
                  href="/cart"
                  className="btn !border-white/20 !bg-white/10 !py-2 !text-[12.5px] !text-white hover:!bg-white/20"
                >
                  Review cart
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function SectionHead({
  title,
  copy,
  action,
}: {
  title: string;
  copy?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="max-w-2xl">
        <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-extrabold leading-tight text-ink">{title}</h2>
        {copy && <p className="mt-2 text-[14px] leading-relaxed text-muted">{copy}</p>}
      </div>
      {action && (
        <Link href={action.href} className="btn btn-ghost ml-auto">
          {action.label}
          <ArrowIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
