import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import AppProvider from "@/components/providers/AppProvider";
import { Inter, Poppins } from "next/font/google";
import { OrderProvider } from "@/domain/order";
import { siteUrl } from "@/config/site-url";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: { default: "Tebu Nai | Fresh Sugarcane Juice & Food", template: "%s | Tebu Nai" },
  description: "Explore fresh sugarcane juice, choose your bottle and toppings, and order meals and snacks from Tebu Nai through WhatsApp.",
  openGraph: {
    type: "website",
    siteName: "Tebu Nai",
    title: "Tebu Nai | Fresh Sugarcane Juice & Food",
    description: "Freshly pressed sugarcane juice, meals, and snacks. Configure your bottle and prepare your WhatsApp order.",
    ...(siteUrl ? { url: siteUrl, images: [{ url: "/images/hero-bottle-v2.png", alt: "Tebu Nai sugarcane juice" }] } : {}),
  },
  twitter: { card: "summary", title: "Tebu Nai | Fresh Sugarcane Juice & Food" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <AppRouterCacheProvider>
          <AppProvider>
            <OrderProvider>{children}</OrderProvider>
          </AppProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
