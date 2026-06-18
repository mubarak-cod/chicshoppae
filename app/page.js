import Image from "next/image";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CollectionSection from "@/components/Collectionssection";
import FeaturedProducts from "@/components/Featuredproducts";
import Marqueestrip from "@/components/Marqueestrip ";
import MidBanner from "@/components/Midbanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CollectionSection />
      <FeaturedProducts />
      <Marqueestrip />
      <MidBanner />
      <Footer />
    </div>
  );
};