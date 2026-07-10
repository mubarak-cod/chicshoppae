import ShopHero from "@/components/shop/ShopHero";
import ProductGrid from "@/components/shop/ProductGrid";
import PromoSection from "@/components/shop/PromoSection";
import products  from "@/data/products.json";
import Footer from "@/components/Footer";
import Newsletterpopup from "@/components/Newsletterpopup";

export default function ShopPage({ searchParams }) {
  const searchQuery = searchParams?.search ? String(searchParams.search).toLowerCase() : "";

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          (p.name?.toLowerCase().includes(searchQuery)) ||
          (p.title?.toLowerCase().includes(searchQuery)) ||
          (p.category?.toLowerCase().includes(searchQuery)) ||
          (p.description?.toLowerCase().includes(searchQuery))
      )
    : products;

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <Newsletterpopup />
      {/* <ShopHero /> */}

      {/* <PromoSection /> */}

      <ProductGrid products={filteredProducts} />
      <Footer />
    </main>
  );
}