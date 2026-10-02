import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products as productsTable } from "@/db/schema";
import { countProducts, getProducts } from "@/lib/products";
import { DELIVERY, PROMOS, quote, type DeliveryId, type PaymentId } from "@/lib/pricing";
import { memoryRecent, memorySave, newOrderNumber, type StoredOrder } from "@/lib/order-store";

export const dynamic = "force-dynamic";

type Payload = {
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postal?: string;
  };
  payment?: { method?: PaymentId; number?: string; upiId?: string };
  delivery?: DeliveryId;
  promo?: string | null;
  items?: { slug?: string; qty?: number; color?: string }[];
};

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** GET /api/orders — the last handful of orders for the counter board. */
export async function GET() {
  if (!db) {
    return NextResponse.json({
      source: "memory",
      orders: memoryRecent(6).map((o) => ({
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        city: o.city,
        totalCents: o.totalCents,
        createdAt: o.createdAt,
        status: o.status,
      })),
    });
  }
  try {
    const rows = await db
      .select({
        orderNumber: orders.orderNumber,
        customerName: orders.customerName,
        city: orders.city,
        totalCents: orders.totalCents,
        createdAt: orders.createdAt,
        status: orders.status,
      })
      .from(orders)
      .orderBy(desc(orders.id))
      .limit(6);
    if (rows.length > 0) return NextResponse.json({ source: "db", orders: rows });
  } catch (error) {
    console.warn("[shop-cart] order list query failed:", error);
  }
  return NextResponse.json({
    source: "memory",
    orders: memoryRecent(6).map((o) => ({
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      city: o.city,
      totalCents: o.totalCents,
      createdAt: o.createdAt,
      status: o.status,
    })),
  });
}

/** POST /api/orders — validate, price server-side, persist, decrement stock. */
export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return bad("Send a JSON body.");
  }

  const c = body.customer ?? {};
  const name = String(c.name ?? "").trim();
  const email = String(c.email ?? "").trim().toLowerCase();
  const phone = String(c.phone ?? "").replace(/\D/g, "");
  const address = String(c.address ?? "").trim();
  const city = String(c.city ?? "").trim();
  const state = String(c.state ?? "").trim();
  const postal = String(c.postal ?? "").trim();
  const delivery: DeliveryId = body.delivery && body.delivery in DELIVERY ? body.delivery : "standard";
  const method: PaymentId =
    body.payment?.method === "upi" || body.payment?.method === "cod" ? body.payment.method : "card";
  const promoRaw = String(body.promo ?? "")
    .trim()
    .toUpperCase();
  const promo = promoRaw && promoRaw in PROMOS ? promoRaw : null;
  const cardDigits = String(body.payment?.number ?? "").replace(/\D/g, "");
  const upiId = String(body.payment?.upiId ?? "").trim();

  if (name.length < 2) return bad("Please enter the full name for delivery.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return bad("That email address is not valid.");
  if (phone.length !== 10) return bad("Enter a valid 10-digit Indian mobile number.");
  if (address.length < 6) return bad("Enter the flat, street and landmark.");
  if (city.length < 2) return bad("City is required.");
  if (state.length < 2) return bad("State is required.");
  if (!/^\d{5,6}$/.test(postal.replace(/\s/g, ""))) return bad("Enter a valid 6-digit PIN code.");
  if (method === "card" && cardDigits.length < 15) return bad("Card number must be at least 15 digits.");
  if (method === "upi" && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId)) {
    return bad("Enter a valid UPI ID, like name@okhdfcbank.");
  }
  if (!Array.isArray(body.items) || body.items.length === 0) return bad("Your cart is empty.");
  if (body.items.length > 30) return bad("That is too many line items for one order.");

  const { products } = await getProducts();

  const items = body.items
    .map((line) => {
      const product = products.find((p) => p.slug === String(line.slug));
      const qty = Math.floor(Number(line.qty ?? 1));
      if (!product) return null;
      if (!Number.isFinite(qty) || qty < 1 || qty > 12) return null;
      if (product.stock <= 0) return null;
      return {
        product,
        qty: Math.min(qty, product.stock),
        color: String(line.color ?? product.colors[0]?.name ?? "Standard"),
      };
    })
    .filter((v): v is { product: (typeof products)[number]; qty: number; color: string } => Boolean(v));

  if (items.length === 0) return bad("None of those items are available right now.");

  const subtotalCents = items.reduce((sum, i) => sum + i.product.priceCents * i.qty, 0);
  const { discount, shipping, codFee, tax, total } = quote({
    subtotal: subtotalCents,
    promoCode: promo,
    delivery,
    payment: method,
  });
  const orderNumber = newOrderNumber();
  const reference =
    method === "card"
      ? `CARD····${cardDigits.slice(-4)}`
      : method === "upi"
        ? `UPI·${upiId}`
        : "CASH ON DELIVERY";

  const record: StoredOrder = {
    id: orderNumber,
    orderNumber,
    customerName: name,
    customerEmail: email,
    phone,
    address,
    city,
    state,
    postal,
    paymentMethod: method,
    cardLast4: reference,
    promo,
    delivery,
    status: "confirmed",
    subtotalCents,
    discountCents: discount,
    shippingCents: shipping,
    codFeeCents: codFee,
    taxCents: tax,
    totalCents: total,
    createdAt: new Date().toISOString(),
    items: items.map((i) => ({
      productSlug: i.product.slug,
      name: i.product.name,
      brand: i.product.brand,
      image: i.product.image,
      qty: i.qty,
      unitCents: i.product.priceCents,
      color: i.color,
    })),
  };

  if (!db) {
    memorySave(record);
    return NextResponse.json({
      ok: true,
      storage: "memory",
      id: record.id,
      orderNumber,
      totals: { subtotalCents, discount, shipping, codFee, tax, total },
      eta: etaFor(delivery),
    });
  }

  try {
    await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(orders)
        .values({
          orderNumber,
          customerName: name,
          customerEmail: email,
          address: `${address}, ${city}, ${state} - ${postal}`,
          city,
          state,
          postal,
          paymentMethod: method,
          cardLast4: reference,
          promo,
          delivery,
          status: "confirmed",
          subtotalCents,
          discountCents: discount,
          shippingCents: shipping,
          codFeeCents: codFee,
          taxCents: tax,
          totalCents: total,
        })
        .returning({ id: orders.id });

      const orderId = inserted[0]?.id;
      if (orderId === undefined) throw new Error("Order insert returned no id");

      for (const item of items) {
        await tx.insert(orderItems).values({
          orderId,
          productSlug: item.product.slug,
          name: item.product.name,
          brand: item.product.brand,
          image: item.product.image,
          qty: item.qty,
          unitCents: item.product.priceCents,
        });
        await tx.execute(
          sql`UPDATE products SET stock = GREATEST(stock - ${item.qty}, 0) WHERE slug = ${item.product.slug}`,
        );
      }
    });
  } catch (error) {
    console.warn("[shop-cart] persisting order to Postgres failed, using in-memory queue:", error);
    memorySave(record);
    return NextResponse.json({
      ok: true,
      storage: "memory",
      id: record.id,
      orderNumber,
      totals: { subtotalCents, discount, shipping, codFee, tax, total },
      eta: etaFor(delivery),
    });
  }

  // Mirror in memory so /api/orders/:id behaves identically on cold boot.
  memorySave(record);

  return NextResponse.json({
    ok: true,
    storage: "postgres",
    id: orderNumber,
    orderNumber,
    totals: { subtotalCents, discount, shipping, codFee, tax, total },
    eta: etaFor(delivery),
  });
}

function etaFor(delivery: DeliveryId) {
  const days = delivery === "express" ? 1 : delivery === "pickup" ? 0 : 4;
  return new Date(Date.now() + days * 86400000 + 6 * 3600000).toISOString();
}

/** Smoke test: reports how many SKUs the warehouse table holds. */
export async function HEAD() {
  const products = await countProducts();
  return NextResponse.json({ products, ok: products > 0 }, { status: products > 0 ? 200 : 503 });
}


