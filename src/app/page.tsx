import Navbar from "@/components/layout/Navbar/Navbar";
import Hero from "@/components/sections/Hero";
import WhyTebuNai from "@/components/sections/WhyTebuNai";
import FeaturedMenu from "@/components/sections/FeaturedMenu";
import OurStory from "@/components/sections/OurStory";
import FloatingOrder from "@/components/order/FloatingOrder";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <WhyTebuNai />
        <OurStory />
        <FeaturedMenu />
        <FloatingOrder />
      </main>
    </>
  );
}
