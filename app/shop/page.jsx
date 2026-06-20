import ShopHero from "@/components/shop/ShopHero";
import PromoSection from "@/components/shop/PromoSection";
import ProductGrid from "@/components/shop/ProductGrid";
import products from "@/data/products.json";

export default function ShopPage() {
  return (
    <>
      <ShopHero />
      <PromoSection />
      <ProductGrid products={products} />
    </>
  );
}
