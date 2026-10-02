"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CloseIcon, SearchIcon } from "@/components/Icons";

const SORTS = [
  { value: "featured", label: "Popularity" },
  { value: "price-asc", label: "Price — low to high" },
  { value: "price-desc", label: "Price — high to low" },
  { value: "rating", label: "Customer rating" },
  { value: "discount", label: "Discount" },
  { value: "stock", label: "Delivery time" },
];

export const SHOP_CATEGORIES = [
  "All",
  "Audio",
  "Wearables",
  "Mobile",
  "Computing",
  "Gaming",
  "Photography",
];

export function ShopControls({
  total,
  shown,
  maxBound,
}: {
  total: number;
  shown: number;
  maxBound: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("category") ?? "All";
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "featured";
  const max = Number(params.get("max") ?? maxBound);
  const stockOnly = params.get("stock") === "1";

  const [term, setTerm] = useState(q);
  const debounce = useRef<number | null>(null);

  const push = useCallback(
    (next: Record<string, string | number | null>) => {
      const sp = new URLSearchParams(params.toString());
      Object.entries(next).forEach(([key, value]) => {
        if (value === null || value === "" || value === "All" || value === 0) sp.delete(key);
        else sp.set(key, String(value));
      });
      router.push(`/shop?${sp.toString()}`, { scroll: false });
    },
    [params, router],
  );

  useEffect(() => {
    if (term === q) return;
    if (debounce.current) window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => push({ q: term || null }), 300);
    return () => {
      if (debounce.current) window.clearTimeout(debounce.current);
    };
  }, [term, q, push]);

  const active = !!(q || category !== "All" || stockOnly || max < maxBound || sort !== "featured");

  return (
    <div className="sticky top-[57px] z-30 mb-6 rounded-xl border border-line bg-white/95 p-3 shadow-sm backdrop-blur sm:top-[70px]">
      <div className="flex flex-wrap items-center gap-2.5">
        <label className="group relative flex min-w-[200px] flex-1 items-center sm:max-w-[300px]">
          <SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search in grid…"
            aria-label="Search products"
            className="field !py-2 pl-9 pr-8 !text-[13px]"
          />
          {term && (
            <button
              onClick={() => setTerm("")}
              aria-label="Clear search"
              className="absolute right-2 text-slate-400 hover:text-sale"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </label>

        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          {SHOP_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => push({ category: c })}
              className="chip"
              data-active={category === c ? "true" : "false"}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-[12px] text-muted">
            Under
            <input
              type="range"
              min={100000}
              max={maxBound}
              step={50000}
              value={Math.min(max, maxBound)}
              onChange={(e) =>
                push({ max: Number(e.target.value) >= maxBound ? null : Number(e.target.value) })
              }
              className="w-24 cursor-pointer"
              aria-label="Maximum price"
            />
            <span className="w-20 font-semibold text-ink tabular-nums">
              ₹{(Math.min(max, maxBound) / 100).toLocaleString("en-IN")}
            </span>
          </label>

          <button onClick={() => push({ stock: stockOnly ? null : "1" })} className="chip" data-active={stockOnly ? "true" : "false"}>
            In stock only
          </button>

          <select
            value={sort}
            onChange={(e) => push({ sort: e.target.value })}
            aria-label="Sort products"
            className="field !w-auto !py-2 !text-[12.5px] font-medium"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-3 border-t border-line pt-2.5 text-[12px] text-muted">
        <span>
          Showing <span className="font-semibold text-ink">{shown}</span> of {total} products
        </span>
        {active && (
          <button
            onClick={() => router.push("/shop", { scroll: false })}
            className="flex items-center gap-1 font-semibold text-brand transition-colors hover:text-brand-dark"
          >
            <CloseIcon className="h-3 w-3" /> Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
