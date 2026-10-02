import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer, Toasts } from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: {
    default: "Shop Cart — Buy Electronics Online in India",
    template: "%s · Shop Cart",
  },
  description:
    "Shop Cart is an online electronics store for India: boAt, Noise, Zebronics, Portronics, Redmi, Acer and more — best prices, no-cost EMI, COD and 7-day replacement.",
  keywords: [
    "electronics online India",
    "boAt headphones",
    "Noise smartwatch",
    "Zebronics keyboard",
    "Portronics speaker",
    "Redmi mobile",
    "Shop Cart",
  ],
  applicationName: "Shop Cart",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-canvas font-body text-ink">
        <StoreProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <Toasts />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
