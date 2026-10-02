import type { Metadata } from "next";
import { CheckoutView } from "@/components/CheckoutView";
import { ReturnIcon, ShieldIcon, BankIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Checkout on Shop Cart — UPI, cards, no-cost EMI and cash on delivery with a GST invoice on every order.",
};

export default function CheckoutPage() {
  return (
    <>
      <CheckoutView />
      <section className="mx-auto max-w-[1360px] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="card grid gap-px overflow-hidden bg-line sm:grid-cols-3">
          {[
            {
              icon: ShieldIcon,
              title: "Vaulted, never stored",
              copy: "Card and UPI details are validated in your browser. Only the last four digits are kept on the order record.",
            },
            {
              icon: ReturnIcon,
              title: "20-minute cancellation",
              copy: "Changed your mind? Cancel with one click before the parcel is picked, no reason needed.",
            },
            {
              icon: BankIcon,
              title: "GST invoice included",
              copy: "Add your GSTIN at checkout and get a tax invoice with HSN codes for input credit.",
            },
          ].map((b) => (
            <div key={b.title} className="bg-white p-5">
              <b.icon className="h-5 w-5 text-brand" />
              <h3 className="mt-2.5 text-[14px] font-bold text-ink">{b.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{b.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
