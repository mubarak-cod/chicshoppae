import ShopHero from "@/components/shop/ShopHero";
import ProductGrid from "@/components/shop/ProductGrid";
import PromoSection from "@/components/shop/PromoSection";
import products  from "@/data/products.json";
import Footer from "@/components/Footer";
import Newsletterpopup from "@/components/Newsletterpopup";

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <Newsletterpopup />
      {/* <ShopHero /> */}

      {/* <PromoSection /> */}

      <ProductGrid products={products} />
      <Footer />
    </main>
  );
}