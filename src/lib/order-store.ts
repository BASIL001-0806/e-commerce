import { randomBytes } from "node:crypto";

export type StoredOrderItem = {
  productSlug: string;
  name: string;
  brand: string;
  image: string;
  qty: number;
  unitCents: number;
  color: string;
};

export type StoredOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  postal: string;
  paymentMethod: "card" | "upi" | "cod";
  delivery: string;
  cardLast4: string;
  promo: string | null;
  status: string;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  codFeeCents: number;
  taxCents: number;
  totalCents: number;
  createdAt: string;
  items: StoredOrderItem[];
};

/**
 * Orders are written to PostgreSQL. If the database is unavailable the order
 * lands in a per-process memory map so the storefront flow still completes.
 */
const globalForOrders = globalThis as typeof globalThis & {
  __shopCartOrders?: Map<string, StoredOrder>;
};

const memory = (globalForOrders.__shopCartOrders ??= new Map<string, StoredOrder>());

export function memorySave(order: StoredOrder) {
  memory.set(order.id, order);
  if (memory.size > 200) {
    const oldest = memory.keys().next().value;
    if (oldest) memory.delete(oldest);
  }
}

export function memoryGet(idOrNumber: string) {
  const direct = memory.get(idOrNumber);
  if (direct) return direct;
  for (const order of memory.values()) {
    if (order.orderNumber.toLowerCase() === idOrNumber.toLowerCase()) return order;
  }
  return null;
}

export function memoryRecent(limit = 5) {
  return [...memory.values()].reverse().slice(0, limit);
}

export function newOrderNumber() {
  return `SC-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export function sampleOrder(): StoredOrder {
  return {
    id: "demo",
    orderNumber: "SC-DEMO01",
    customerName: "Rhea Mendonça",
    customerEmail: "rhea@midnight.mail",
    phone: "9812345670",
    address: "402 Palm Grove Residency, 14 Cathedra Lane",
    city: "Bengaluru",
    state: "Karnataka",
    postal: "560034",
    paymentMethod: "upi",
    delivery: "express",
    cardLast4: "UPI·rhea@okicici",
    promo: "FIRST10",
    status: "in transit",
    subtotalCents: 449800,
    discountCents: 44980,
    shippingCents: 0,
    codFeeCents: 0,
    taxCents: 0,
    totalCents: 404820,
    createdAt: new Date(Date.now() - 1000 * 60 * 92).toISOString(),
    items: [
      {
        productSlug: "boat-rockerz-550-anc",
        name: "boAt Rockerz 550 ANC",
        brand: "boAt",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
        qty: 1,
        unitCents: 199900,
        color: "Ocean Blue",
      },
      {
        productSlug: "portronics-roar-4-plus",
        name: "Portronics Roar 4 Plus",
        brand: "Portronics",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop",
        qty: 1,
        unitCents: 239900,
        color: "Graphite",
      },
    ],
  };
}
