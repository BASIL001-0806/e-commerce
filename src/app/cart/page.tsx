import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { CartView } from "@/components/CartView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your bag, arm a promo code and head to the vault.",
};

export default async function CartPage() {
  const { products } = await getProducts();
  return <CartView recommended={products} />;
}
