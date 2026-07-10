import ProductGrid from "@/components/shop/ProductGrid";
import products from "@/data/products.json";
import Footer from "@/components/Footer";
import Newsletterpopup from "@/components/Newsletterpopup";

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;

  const searchQuery = (params.search || "").toLowerCase();

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery) ||
          p.title?.toLowerCase().includes(searchQuery) ||
          p.category?.toLowerCase().includes(searchQuery) ||
          p.description?.toLowerCase().includes(searchQuery)
      )
    : products;

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <Newsletterpopup />
      <ProductGrid products={filteredProducts} />
      <Footer />
    </main>
  );
}