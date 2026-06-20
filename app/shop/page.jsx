import ShopHero from "@/components/shop/ShopHero";
import ProductGrid from "@/components/shop/ProductGrid";
import PromoSection from "@/components/shop/PromoSection";
import products  from "@/data/products.json";
export default function ShopPage() {
  return (
    <main className="min-h-screen bg-white">
      <ShopHero />

      <PromoSection />

      <ProductGrid products={products} />
    </main>
  );
}