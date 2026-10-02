"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore, FREE_SHIPPING_AT } from "@/lib/store";
import { money } from "@/lib/catalog";
import {
  CartIcon,
  CheckIcon,
  CloseIcon,
  MinusIcon,
  PlusIcon,
  TruckIcon,
} from "@/components/Icons";

export function CartDrawer() {
  const { lines, drawerOpen, setDrawerOpen, setQty, remove, subtotal, discount, count } = useStore();

  const net = subtotal - discount;
  const remaining = Math.max(FREE_SHIPPING_AT - net, 0);
  const progress = Math.min((net / FREE_SHIPPING_AT) * 100, 100);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        aria-label="Close cart"
        onClick={() => setDrawerOpen(false)}
        className="fade-in absolute inset-0 bg-slate-900/40"
      />
      <aside className="drawer-in absolute right-0 top-0 flex h-full w-full max-w-[400px] flex-col border-l border-line bg-white shadow-2xl">
        <div className="flex items-center gap-2.5 border-b border-line px-5 py-4">
          <CartIcon className="h-5 w-5 text-brand" />
          <h2 className="text-[15px] font-bold text-ink">My cart</h2>
          <span className="text-[12px] text-muted">
            {count} {count === 1 ? "item" : "items"}
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close cart"
            className="ml-auto grid h-8 w-8 place-items-center rounded-lg border border-line text-slate-500 transition-colors hover:bg-slate-50 hover:text-ink"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-line px-5 py-3">
          <div className="flex items-center gap-2 text-[12px] text-muted">
            <TruckIcon className="h-4 w-4 text-good" />
            {remaining > 0 ? (
              <span>
                Add <span className="font-semibold text-ink">{money(remaining)}</span> more for FREE
                delivery
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold text-good">
                <CheckIcon className="h-3.5 w-3.5" /> Your order qualifies for free delivery
              </span>
            )}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-good transition-[width] duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="relative grid h-20 w-20 place-items-center rounded-full bg-slate-50 text-slate-300">
              <CartIcon className="h-8 w-8" />
            </span>
            <p className="text-[16px] font-semibold text-ink">Your cart is empty</p>
            <p className="text-[13px] text-muted">
              Add headphones, a smartwatch or something loud and it will show up here.
            </p>
            <Link href="/shop" onClick={() => setDrawerOpen(false)} className="btn btn-primary mt-1">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {lines.map((line) => (
              <div
                key={`${line.slug}-${line.color}`}
                className="rise-in flex gap-3 rounded-xl border border-line p-3 transition-colors hover:border-slate-300"
              >
                <Link
                  href={`/product/${line.slug}`}
                  onClick={() => setDrawerOpen(false)}
                  className="tile h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg"
                >
                  <Image
                    src={line.image}
                    alt={line.name}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0">
                      <p className="text-[10.5px] font-bold uppercase tracking-[0.04em] text-brand">
                        {line.brand}
                      </p>
                      <p className="truncate text-[13.5px] font-semibold text-ink">{line.name}</p>
                    </div>
                    <button
                      onClick={() => remove(line.slug, line.color)}
                      aria-label={`Remove ${line.name}`}
                      className="ml-auto text-slate-400 transition-colors hover:text-sale"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-muted">
                    {line.color} · {money(line.priceCents)} each
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 rounded-lg border border-line p-0.5">
                      <button
                        onClick={() => setQty(line.slug, line.color, line.qty - 1)}
                        aria-label="Decrease quantity"
                        className="grid h-6 w-6 place-items-center rounded text-slate-500 hover:bg-slate-50 hover:text-ink"
                      >
                        <MinusIcon className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center font-mono text-[12px] font-semibold">{line.qty}</span>
                      <button
                        onClick={() => setQty(line.slug, line.color, line.qty + 1)}
                        disabled={line.qty >= line.stock}
                        aria-label="Increase quantity"
                        className="grid h-6 w-6 place-items-center rounded text-slate-500 hover:bg-slate-50 hover:text-ink disabled:opacity-40"
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-[14px] font-bold text-ink">
                      {money(line.priceCents * line.qty)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-line bg-slate-50 px-5 py-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-medium text-muted">Total</span>
            <span className="text-[20px] font-bold text-ink">{money(subtotal)}</span>
          </div>
          <p className="mt-0.5 text-[11.5px] text-muted">
            {discount > 0 ? `Promo saving of ${money(discount)} applied · ` : ""}
            Delivery calculated at checkout
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href="/cart" onClick={() => setDrawerOpen(false)} className="btn btn-ghost">
              View cart
            </Link>
            <Link
              href="/checkout"
              onClick={() => setDrawerOpen(false)}
              className={`btn btn-accent ${lines.length === 0 ? "pointer-events-none opacity-50" : ""}`}
            >
              Proceed to buy
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function Toasts() {
  const { toasts, dismissToast } = useStore();
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex w-[300px] flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismissToast(t.id)}
          className="toast-in pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-white p-3 text-left shadow-lg"
        >
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-50 text-good">
            <CheckIcon className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold text-ink">{t.title}</span>
            <span className="block truncate text-[12px] text-muted">{t.body}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
