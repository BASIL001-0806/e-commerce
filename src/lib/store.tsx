"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Product } from "@/lib/catalog";

const LINES_KEY = "shopcart.lines.v2";
const WISH_KEY = "shopcart.wishlist.v2";
const SEEN_KEY = "shopcart.seen.v2";

import { PROMOS, quote, FREE_SHIPPING_AT, SHIPPING_FLAT, TAX_RATE } from "@/lib/pricing";

export { FREE_SHIPPING_AT, SHIPPING_FLAT, TAX_RATE };

type Toast = { id: number; title: string; body: string; accent: string };

type StoreValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  promo: { code: string; pct: number; note: string } | null;
  promoError: string;
  applyPromo: (code: string) => void;
  clearPromo: () => void;
  add: (product: Product, qty?: number, color?: string) => void;
  setQty: (slug: string, color: string, qty: number) => void;
  remove: (slug: string, color: string) => void;
  clearCart: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  seen: string[];
  markSeen: (slug: string) => void;
  toasts: Toast[];
  dismissToast: (id: number) => void;
  pushToast: (title: string, body: string, accent?: string) => void;
  hydrated: boolean;
};

const StoreContext = createContext<StoreValue | null>(null);

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [seen, setSeen] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [promo, setPromo] = useState<StoreValue["promo"]>(null);
  const [promoError, setPromoError] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const toastId = useRef(0);

  /* ---------- hydration from localStorage ---------- */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLines(readLocal<CartLine[]>(LINES_KEY, []));
      setWishlist(readLocal<string[]>(WISH_KEY, []));
      setSeen(readLocal<string[]>(SEEN_KEY, []));
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  /* ---------- persistence ---------- */
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(LINES_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  }, [seen, hydrated]);

  /* ---------- drawer scroll lock ---------- */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const pushToast = useCallback((title: string, body: string, accent = "#2563eb") => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev.slice(-2), { id, title, body, accent }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback(
    (product: Product, qty = 1, color?: string) => {
      const chosen = color ?? product.colors[0]?.name ?? "Standard";
      setLines((prev) => {
        const idx = prev.findIndex((l) => l.slug === product.slug && l.color === chosen);
        if (idx === -1) {
          return [
            ...prev,
            {
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              image: product.image,
              priceCents: product.priceCents,
              accent: product.accent,
              color: chosen,
              qty: Math.min(qty, Math.max(product.stock, 1)),
              stock: product.stock,
            },
          ];
        }
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          qty: Math.min(next[idx].qty + qty, Math.max(product.stock, 1)),
        };
        return next;
      });
      pushToast("Added to cart", `${product.brand} ${product.name} · ${chosen}`, "#059669");
      setDrawerOpen(true);
    },
    [pushToast],
  );

  const setQty = useCallback((slug: string, color: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => !(l.slug === slug && l.color === color))
        : prev.map((l) =>
            l.slug === slug && l.color === color
              ? { ...l, qty: Math.min(qty, Math.max(l.stock, 1)) }
              : l,
          ),
    );
  }, []);

  const remove = useCallback(
    (slug: string, color: string) => {
      const name = lines.find((l) => l.slug === slug && l.color === color)?.name ?? "Item";
      setLines((prev) => prev.filter((l) => !(l.slug === slug && l.color === color)));
      pushToast("Removed from cart", `${name} was removed from your cart`, "#e11d48");
    },
    [pushToast, lines],
  );

  const clearCart = useCallback(() => {
    setLines([]);
    setPromo(null);
  }, []);

  const toggleWish = useCallback(
    (slug: string) => {
      setWishlist((prev) => {
        const has = prev.includes(slug);
        pushToast(
          has ? "Removed from saved" : "Saved for later",
          has ? "You can add it back anytime from the product page" : "We will alert you if the price drops",
          has ? "#e11d48" : "#059669",
        );
        return has ? prev.filter((s) => s !== slug) : [...prev, slug];
      });
    },
    [pushToast],
  );

  const markSeen = useCallback((slug: string) => {
    setSeen((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 6));
  }, []);

  const applyPromo = useCallback(
    (code: string) => {
      const key = code.trim().toUpperCase();
      const found = PROMOS[key];
      if (!found) {
        setPromoError(`"${key || "—"}" is not an active coupon. Try FIRST10.`);
        setPromo(null);
        return;
      }
      setPromoError("");
      setPromo({ code: key, pct: found.pct, note: found.note });
      pushToast("Coupon applied", found.note, "#059669");
    },
    [pushToast],
  );

  const clearPromo = useCallback(() => {
    setPromo(null);
    setPromoError("");
  }, []);

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.priceCents * l.qty, 0),
    [lines],
  );
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);
  const { discount, shipping, tax, total } = useMemo(
    () => quote({ subtotal, promoCode: promo?.code ?? null }),
    [subtotal, promo],
  );

  const value: StoreValue = {
    lines,
    count,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    promo,
    promoError,
    applyPromo,
    clearPromo,
    add,
    setQty,
    remove,
    clearCart,
    drawerOpen,
    setDrawerOpen,
    wishlist,
    toggleWish,
    seen,
    markSeen,
    toasts,
    dismissToast,
    pushToast,
    hydrated,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
