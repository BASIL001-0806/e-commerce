import { NextResponse } from "next/server";
import { loadOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

/** GET /api/orders/:id — accepts an order number (SC-XXXXXX) or "demo". */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = await loadOrder(id);

  if (!found) {
    return NextResponse.json(
      { error: "Order not found", hint: "Try the order code from your confirmation email, or /api/orders/demo" },
      { status: 404 },
    );
  }

  return NextResponse.json({ source: found.source, order: found.order });
}
