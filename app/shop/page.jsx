import ProductGrid from "@/components/shop/ProductGrid";
import Footer from "@/components/Footer";
import Newsletterpopup from "@/components/Newsletterpopup";
import { supabase } from "@/lib/supabase";

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const searchQuery = (params.search || "").toLowerCase();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch products:", error);
  }

  const allProducts = products || [];

  const filteredProducts = searchQuery
    ? allProducts.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery) ||
          p.title?.toLowerCase().includes(searchQuery) ||
          p.category?.toLowerCase().includes(searchQuery) ||
          p.description?.toLowerCase().includes(searchQuery)
      )
    : allProducts;

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <Newsletterpopup />
      <ProductGrid products={filteredProducts} />
      <Footer />
    </main>
  );
}