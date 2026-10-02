"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowIcon,
  BankIcon,
  BoltIcon,
  CheckIcon,
  IgIcon,
  ShieldIcon,
  WhatsIcon,
  XIcon,
  YtIcon,
} from "@/components/Icons";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "Audio & headphones", href: "/shop?category=Audio" },
      { label: "Smartwatches", href: "/shop?category=Wearables" },
      { label: "Mobiles", href: "/shop?category=Mobile" },
      { label: "Laptops & keyboards", href: "/shop?category=Computing" },
      { label: "Gaming", href: "/shop?category=Gaming" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track my order", href: "/orders/demo" },
      { label: "Shipping & delivery", href: "/shop#help" },
      { label: "Returns & replacement", href: "/shop#help" },
      { label: "Warranty & service", href: "/shop#help" },
      { label: "EMI & payment", href: "/checkout" },
      { label: "Saved items", href: "/saved" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Shop Cart", href: "/#story" },
      { label: "Today's deals", href: "/#deals" },
      { label: "Why buy from us", href: "/#trust" },
      { label: "Sell on Shop Cart", href: "/#newsletter" },
      { label: "Careers", href: "/#story" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 bg-[#111827] text-gray-300">
      <div className="mx-auto max-w-[1360px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,0.85fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white">
                <BoltIcon className="h-5 w-5" />
              </span>
              <span className="text-[17px] font-bold tracking-tight text-white">Shop Cart</span>
            </Link>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-gray-400">
              Shop Cart is a Bengaluru-based electronics retailer selling authentic Indian-market gear
              from boAt, Noise, Zebronics, Portronics, Redmi, Acer, Redgear and pTron. Every unit is
              serial-verified, invoice-ready and covered by brand warranty.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { icon: XIcon, label: "X" },
                { icon: IgIcon, label: "Instagram" },
                { icon: YtIcon, label: "YouTube" },
                { icon: WhatsIcon, label: "WhatsApp support" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#newsletter"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <NewsletterForm />
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-gray-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
          {[
            { title: "Ships across India", copy: "19,000+ pin codes · Delhivery, Blue Dart & Ecom Express partners." },
            { title: "GST invoice on everything", copy: "Input tax credit friendly with CIN, GSTIN and HSN on every bill." },
            { title: "Secure payments", copy: "UPI, cards, net banking, wallets and no-cost EMI from 12 Indian banks." },
          ].map((b) => (
            <div key={b.title} className="flex gap-3">
              <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <p className="text-[13.5px] font-semibold text-white">{b.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-400">{b.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#0b1220]">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <p className="text-[12px] text-gray-500">
            © {new Date().getFullYear()} Shop Cart Retail Pvt. Ltd. · GSTIN 29AABCS1429L1ZQ · All prices
            in INR and inclusive of GST
          </p>
          <div className="flex flex-wrap items-center gap-1.5 lg:ml-auto">
            <span className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-[11px] font-medium text-gray-300">
              <BankIcon className="h-3.5 w-3.5" /> Net banking
            </span>
            {["UPI", "VISA", "MasterCard", "RuPay", "EMI", "COD"].map((pm) => (
              <span
                key={pm}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10.5px] tracking-wide text-gray-300"
              >
                {pm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState("error");
      setMessage("Please check the email address and try again.");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Subscription failed");
      setState("done");
      setMessage(data?.already ? "You are already subscribed to deal alerts." : "Done — deal alerts will land in your inbox.");
      setEmail("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong on our side.");
    }
  };

  return (
    <div id="newsletter" className="mt-8">
      <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-white">Deal alerts</h3>
      <p className="mt-1.5 text-[13px] text-gray-400">
        Price drops, sale starts and restock notices. One email a week, unsubscribe anytime.
      </p>
      <form onSubmit={submit} className="mt-3 flex max-w-sm gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "idle") setState("idle");
          }}
          placeholder="you@email.in"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13.5px] text-white outline-none transition-colors placeholder:text-gray-500 focus:border-brand"
          aria-label="Email address"
        />
        <button type="submit" className="btn btn-primary !px-3" disabled={state === "sending"}>
          {state === "done" ? <CheckIcon className="h-4 w-4" /> : <ArrowIcon className="h-4 w-4" />}
        </button>
      </form>
      {message && (
        <p
          className={`mt-2 flex items-center gap-1.5 text-[12px] ${
            state === "error" ? "text-rose-300" : "text-emerald-300"
          }`}
        >
          {state !== "error" && <CheckIcon className="h-3.5 w-3.5" />}
          {message}
        </p>
      )}
    </div>
  );
}
