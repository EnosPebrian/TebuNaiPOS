import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import AppProvider from "@/components/providers/AppProvider";
import { Inter, Poppins } from "next/font/google";
import { OrderProvider } from "@/domain/order";
import { Analytics } from "@vercel/analytics/next";

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
  title: "Tebu Nai",
  description: "Fresh Sugarcane Juice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <AppProvider>
            <OrderProvider>{children}</OrderProvider>
          </AppProvider>
        </AppRouterCacheProvider>
        <Analytics />
      </body>
    </html>
  );
}
