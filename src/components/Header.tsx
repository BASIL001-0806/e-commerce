"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/catalog";
import { CartIcon, HeartIcon, SearchIcon, TruckIcon, BoltIcon, MenuIcon, CloseIcon } from "@/components/Icons";

const ANNOUNCEMENTS = [
  "Free delivery on orders above ₹4,999",
  "No-cost EMI from ₹583/month",
  "7-day replacement, no questions asked",
  "Exchange offer up to ₹6,000 off",
  "GST invoice available on every order",
];

export function Header() {
  const { count, setDrawerOpen, wishlist, hydrated } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setTimeout(() => setMenuOpen(false), 0);
  }, [pathname]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
  };

  return (
    <header className="sticky top-0 z-50">
      {/* announcement bar */}
      <div className="overflow-hidden bg-[#111827] py-1.5 text-white">
        <div className="marquee-track line-mask gap-10 px-4 text-[11.5px]">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-10" aria-hidden={dup === 1}>
              {ANNOUNCEMENTS.map((a) => (
                <span key={a} className="flex items-center gap-2 whitespace-nowrap text-gray-200">
                  <BoltIcon className="h-3.5 w-3.5 text-amber-400" />
                  {a}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* main bar */}
      <div
        className={`border-b border-line bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-[0_8px_24px_-18px_rgba(15,23,42,0.45)]" : ""
        }`}
      >
        <div className="mx-auto flex max-w-[1360px] items-center gap-3 px-4 py-3 sm:px-6 lg:gap-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white">
              <BoltIcon className="h-5 w-5" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-[17px] font-bold leading-none tracking-tight text-ink">
                Shop Cart
              </span>
              <span className="mt-0.5 block text-[10px] font-medium leading-none text-muted">
                Electronics · India
              </span>
            </span>
          </Link>

          <form onSubmit={submit} className="group relative flex min-w-0 flex-1 items-center">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for headphones, smartwatches, keyboards…"
              aria-label="Search products"
              className="field !py-2.5 pr-24 !text-[13.5px]"
            />
            <button
              type="submit"
              className="absolute right-1 flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              <SearchIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/saved"
              className="relative hidden h-9 items-center gap-2 rounded-lg px-2.5 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-ink sm:flex"
            >
              <HeartIcon className="h-[18px] w-[18px]" />
              Saved
              {hydrated && wishlist.length > 0 && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-sale px-1 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-[13px] font-semibold text-ink transition-colors hover:bg-slate-50"
            >
              <span className="relative">
                <CartIcon className="h-[19px] w-[19px]" />
                <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                  {hydrated ? count : 0}
                </span>
              </span>
              <span className="hidden md:inline">Cart</span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="grid h-9 w-9 place-items-center rounded-lg border border-line text-slate-600 lg:hidden"
            >
              {menuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* category strip */}
        <nav className="mx-auto hidden max-w-[1360px] items-center gap-6 px-4 pb-2 sm:px-6 lg:flex lg:px-8">
          <Link
            href="/shop"
            className={`pb-1.5 text-[13px] font-semibold transition-colors ${
              pathname === "/shop" ? "text-brand" : "text-slate-600 hover:text-ink"
            }`}
          >
            All products
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/shop?category=${encodeURIComponent(cat)}`}
              className="underline-grow pb-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:text-ink"
            >
              {cat}
            </Link>
          ))}
          <span className="ml-auto flex items-center gap-1.5 pb-1.5 text-[12px] text-muted">
            <TruckIcon className="h-4 w-4 text-good" />
            Delivering to India · 19,000+ pin codes serviceable
          </span>
        </nav>

        {menuOpen && (
          <div className="fade-in border-t border-line bg-white px-4 pb-4 pt-3 lg:hidden">
            <div className="grid grid-cols-2 gap-1.5">
              <Link href="/shop" className="chip justify-start !py-2">
                All products
              </Link>
              {CATEGORIES.map((cat) => (
                <Link key={cat} href={`/shop?category=${encodeURIComponent(cat)}`} className="chip justify-start !py-2">
                  {cat}
                </Link>
              ))}
              <Link href="/saved" className="chip justify-start !py-2">
                Saved · {hydrated ? wishlist.length : 0}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
