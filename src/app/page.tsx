import Navbar from "@/components/layout/Navbar/Navbar";
import Hero from "@/components/sections/Hero";
import WhyTebuNai from "@/components/sections/WhyTebuNai";
import FeaturedMenu from "@/components/sections/FeaturedMenu";
import OurStory from "@/components/sections/OurStory";
import FloatingOrder from "@/components/order/FloatingOrder";
import { Analytics } from "@vercel/analytics/next";
import { siteUrl } from "@/config/site-url";

export const metadata = {
  ...(siteUrl ? { alternates: { canonical: siteUrl } } : {}),
};

export default function Home() {
  return (
    <>
      <Navbar />

      <main id="main-content" tabIndex={-1}>
        <Hero />
        <WhyTebuNai />
        <OurStory />
        <FeaturedMenu />
        <FloatingOrder />
        <Analytics />
      </main>
    </>
  );
}
