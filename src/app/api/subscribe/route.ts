import { NextResponse } from "next/server";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

const memory = new Set<string>();

/** POST /api/subscribe { email } — newsletter opt-in. */
export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: string };
    email = String(body?.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Send a JSON body with an email." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "That email address is not valid." }, { status: 422 });
  }

  if (!db) {
    const already = memory.has(email);
    memory.add(email);
    return NextResponse.json({ ok: true, email, already });
  }

  try {
    await db
      .insert(subscribers)
      .values({ email })
      .onConflictDoNothing();
    return NextResponse.json({ ok: true, email, already: memory.has(email) });
  } catch (error) {
    console.warn("[shop-cart] subscribe falling back to memory:", error);
    const already = memory.has(email);
    memory.add(email);
    return NextResponse.json({ ok: true, email, already });
  }
}

/** GET /api/subscribe — count of opt-ins, for the counter board. */
export async function GET() {
  if (!db) {
    return NextResponse.json({ count: memory.size, source: "memory" });
  }
  try {
    const [row] = await db.select({ value: count() }).from(subscribers);
    return NextResponse.json({ count: Number(row?.value ?? 0), source: "db" });
  } catch {
    return NextResponse.json({ count: memory.size, source: "memory" });
  }
}
