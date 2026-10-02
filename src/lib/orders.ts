import { and, eq, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { memoryGet, sampleOrder, type StoredOrder } from "@/lib/order-store";

export type OrderLookup = { order: StoredOrder; source: "db" | "memory" | "sample" };

export async function loadOrder(id: string): Promise<OrderLookup | null> {
  if (id.toLowerCase() === "demo") {
    return { order: sampleOrder(), source: "sample" };
  }

  if (!db) {
    const local = memoryGet(id);
    if (local) return { order: local, source: "memory" };
    return null;
  }

  try {
    const byNumber = sql`lower(${orders.orderNumber}) = lower(${id})`;
    const numericId = /^\d+$/.test(id) ? Number(id) : null;

    const [head] = await db
      .select()
      .from(orders)
      .where(numericId === null ? byNumber : or(byNumber, eq(orders.id, numericId)))
      .limit(1);

    if (head) {
      const items = await db.select().from(orderItems).where(and(eq(orderItems.orderId, head.id)));
      return {
        source: "db",
        order: {
          id: head.orderNumber,
          orderNumber: head.orderNumber,
          customerName: head.customerName,
          customerEmail: head.customerEmail,
          address: head.address,
          city: head.city,
          state: head.state,
          postal: head.postal,
          paymentMethod: head.paymentMethod as StoredOrder["paymentMethod"],
          delivery: head.delivery,
          cardLast4: head.cardLast4,
          promo: head.promo,
          status: head.status,
          subtotalCents: head.subtotalCents,
          discountCents: head.discountCents,
          shippingCents: head.shippingCents,
          codFeeCents: head.codFeeCents,
          taxCents: head.taxCents,
          totalCents: head.totalCents,
          createdAt: head.createdAt.toISOString(),
          items: items.map((i) => ({
            productSlug: i.productSlug,
            name: i.name,
            brand: i.brand,
            image: i.image,
            qty: i.qty,
            unitCents: i.unitCents,
            color: "Counter pick",
          })),
        },
      };
    }
  } catch (error) {
    console.warn("[shop-cart] order lookup failed:", error);
  }

  const local = memoryGet(id);
  if (local) return { order: local, source: "memory" };
  return null;
}
