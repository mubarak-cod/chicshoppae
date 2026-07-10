"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/shop/ProductCard";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PRODUCTS_PER_PAGE = 10;

function normalizePage(value, totalPages) {
  const page = Number(value);
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.min(page, totalPages);
}

function buildPaginationRange(totalPages, currentPage) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

export default function ProductGrid({ products }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionRef = useRef(null);
  const [compactPagination, setCompactPagination] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const update = () => setCompactPagination(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));
  const currentPage = useMemo(
    () => normalizePage(searchParams?.get("page"), totalPages),
    [searchParams, totalPages],
  );

  useEffect(() => {
    if (!sectionRef.current) return;
    sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage]);

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(start, start + PRODUCTS_PER_PAGE);
  }, [products, currentPage]);

  const pageItems = useMemo(
    () => buildPaginationRange(totalPages, currentPage),
    [totalPages, currentPage],
  );

  const navigateToPage = (page) => {
    const normalized = normalizePage(page, totalPages);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", String(normalized));
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

  const paginationItems = useMemo(() => {
    if (compactPagination) return [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
  }, [compactPagination, currentPage, totalPages]);

  return (
    <section id="products" className="product-grid-section" ref={sectionRef}>
      <style>{`
        .product-grid-section {
          padding: clamp(2rem, 4vw, 3rem) clamp(1rem, 4vw, 3rem) 4rem;
        }

        .product-grid-header {
          display: flex;
          align-items: flex-end;
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
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.8rem;
        }

        .pagination-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }

        .pagination-button,
        .pagination-page {
          min-width: 38px;
          height: 38px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 0.95rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
        }

        .pagination-button:hover,
        .pagination-page:hover {
          transform: translateY(-1px);
          border-color: var(--text-primary);
        }

        .pagination-page.active {
          background: var(--text-primary);
          color: var(--bg-primary);
          border-color: var(--text-primary);
        }

        .pagination-page.disabled,
        .pagination-button.disabled {
          pointer-events: none;
          opacity: 0.38;
        }

        .pagination-ellipsis {
          min-width: 32px;
          color: var(--text-secondary);
          font-size: 0.95rem;
          text-align: center;
        }

        @media (min-width: 641px) {
          .product-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.9rem; }
        }

        @media (min-width: 1024px) {
          .product-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
        }

        @media (max-width: 680px) {
          .product-grid-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .product-grid-section {
            padding-inline: 0.85rem;
          }
          .product-grid {
            gap: 0.65rem;
          }
          .pagination-row {
            gap: 0.4rem;
          }
          .pagination-button,
          .pagination-page {
            min-width: 34px;
            height: 34px;
            font-size: 0.82rem;
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
        {currentProducts.map((product, index) => (
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

      <div className="pagination-row" role="navigation" aria-label="Product page navigation">
        <button
          type="button"
          className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => navigateToPage(currentPage - 1)}
          aria-label="Previous page"
          aria-disabled={currentPage === 1}
        >
          ‹
        </button>

        {compactPagination ? (
          <>
            <span className="pagination-page" aria-current="page" style={{ pointerEvents: "none", background: "transparent", color: "var(--text-primary)" }}>
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              className={`pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
              onClick={() => navigateToPage(currentPage + 1)}
              aria-label="Next page"
              aria-disabled={currentPage === totalPages}
            >
              ›
            </button>
          </>
        ) : (
          paginationItems.map((item, index) =>
            item === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">…</span>
            ) : (
              <button
                key={item}
                type="button"
                className={`pagination-page ${item === currentPage ? "active" : ""}`}
                onClick={() => navigateToPage(item)}
                aria-current={item === currentPage ? "page" : undefined}
              >
                {item}
              </button>
            )
          )
        )}

        <button
          type="button"
          className={`pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
          onClick={() => navigateToPage(currentPage + 1)}
          aria-label="Next page"
          aria-disabled={currentPage === totalPages}
        >
          ›
        </button>
      </div>
    </section>
  );
}
