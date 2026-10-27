import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { ordersConfigured } from "@/lib/server/database";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your Tebu Nai cart and prepare an order request through WhatsApp.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <main id="main-content" tabIndex={-1}><CheckoutForm saveOrders={ordersConfigured()} /></main>;
}
