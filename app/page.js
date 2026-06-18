import Image from "next/image";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CollectionSection from "@/components/Collectionssection";
import FeaturedProducts from "@/components/Featuredproducts";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CollectionSection />
      <FeaturedProducts />
    </div>
  );
} 
