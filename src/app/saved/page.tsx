import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { SavedView } from "@/components/SavedView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Saved gear",
  description: "Your watchlist — saved machines, price cuts and restock alerts.",
};

export default async function SavedPage() {
  const { products } = await getProducts();
  return <SavedView products={products} />;
}
