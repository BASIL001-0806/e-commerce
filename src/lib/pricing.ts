export const SHIPPING_FLAT = 9900; // ₹99 standard courier
export const SHIPPING_EXPRESS = 19900; // ₹199 next-day metro express
export const FREE_SHIPPING_AT = 499900; // free above ₹4,999
export const COD_FEE = 4900; // ₹49 cash-handling fee
/** Listed prices are MRP-adjusted and inclusive of GST — no tax line at checkout. */
export const TAX_RATE = 0;

export type DeliveryId = "standard" | "express" | "pickup";
export type PaymentId = "card" | "upi" | "cod";

export const PROMOS: Record<string, { pct: number; capCents: number; note: string }> = {
  FIRST10: { pct: 10, capCents: 150000, note: "10% off first order (up to ₹1,500)" },
  BILLION25: { pct: 25, capCents: 250000, note: "25% off during sale (up to ₹2,500)" },
  SHIPFREE: { pct: 0, capCents: 0, note: "Free delivery unlocked" },
};

export const DELIVERY: Record<DeliveryId, { label: string; eta: string; cents: number }> = {
  standard: { label: "Standard delivery", eta: "3–5 days · all India", cents: SHIPPING_FLAT },
  express: { label: "Express next-day", eta: "Tomorrow in 40+ metros", cents: SHIPPING_EXPRESS },
  pickup: { label: "Store self-pickup", eta: "Today · 6 city hubs", cents: 0 },
};

export const BANK_OFFERS = [
  "10% instant discount up to ₹1,500 on ICICI Bank credit cards",
  "Flat ₹500 cashback on UPI payments above ₹5,000",
  "No-cost EMI from ₹583/month on orders above ₹3,000",
  "Exchange offer: up to ₹6,000 off on your old device",
];

/** The single pricing truth shared by the cart UI and the orders API. */
export function quote(input: {
  subtotal: number;
  promoCode?: string | null;
  delivery?: DeliveryId;
  payment?: PaymentId;
}) {
  const code = input.promoCode?.trim().toUpperCase() ?? "";
  const promo = code ? PROMOS[code] : undefined;
  const pct = promo?.pct ?? 0;
  const rawDiscount = Math.round((input.subtotal * pct) / 100);
  const discount = promo ? Math.min(rawDiscount, promo.capCents) : 0;
  const net = Math.max(input.subtotal - discount, 0);

  const method = input.delivery ?? "standard";
  const freeShipCode = code === "SHIPFREE";
  const waive = net >= FREE_SHIPPING_AT || freeShipCode;
  const shipping =
    input.subtotal === 0 ? 0 : method === "standard" && waive ? 0 : DELIVERY[method].cents;

  const codFee = input.payment === "cod" && input.subtotal > 0 ? COD_FEE : 0;
  const tax = Math.round(net * TAX_RATE);
  const total = Math.max(net + shipping + codFee + tax, 0);

  return { discount, shipping, codFee, tax, total, net, pct };
}
