import Navbar from "@/components/layout/Navbar/Navbar";
import Hero from "@/components/sections/Hero";
import WhyTebuNai from "@/components/sections/WhyTebuNai";
import SignatureCollection from "@/components/sections/SignatureCollection";
import OurStory from "@/components/sections/OurStory";
import FloatingOrderButton from "@/components/order/FloatingOrderButton/FloatingOrderButton";
import FloatingOrder from "@/components/order/FloatingOrder";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <WhyTebuNai />
        <OurStory />
        <SignatureCollection />
        <FloatingOrderButton />
        <FloatingOrder />
      </main>
    </>
  );
}
