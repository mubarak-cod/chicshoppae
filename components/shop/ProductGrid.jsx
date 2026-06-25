"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/shop/ProductCard";

export default function ProductGrid({ products }) {
  return (
    <section id="products" className="product-grid-section">
      <style>{`
        .product-grid-section {
          padding: clamp(2rem, 4vw, 3rem) clamp(1rem, 4vw, 3rem) 4rem;
        }

        .product-grid-header {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .product-grid-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3.2vw, 3.5rem);
          color: var(--text-primary);
          line-height: 0.96;
        }

        .product-grid-copy {
          max-width: 38rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.2rem;
        }

        @media (max-width: 1180px) {
          .product-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }

        @media (max-width: 860px) {
          .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

       

          @media (max-width: 680px) {
  .product-grid-header {
    flex-direction: column;
    align-items: start;
  }
  .product-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
        }
      `}</style>

      <div className="product-grid-header">
        <div>
          <div className="promo-kicker">Featured products</div>
          <h2 className="product-grid-title">Luxury essentials for every wardrobe moment</h2>
        </div>
        <p className="product-grid-copy">
          Each piece is presented with price clarity, elegant color selection, and a polished purchase flow.
        </p>
      </div>

      <div className="product-grid">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}