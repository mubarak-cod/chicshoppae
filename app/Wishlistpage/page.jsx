"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";

const WISHLIST_STORAGE_KEY = "chic-shoppae-wishlist";
const WISHLIST_EVENT = "chic-wishlist-updated";

function readWishlist() {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(window.localStorage.getItem(WISHLIST_STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function writeWishlist(list) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(WISHLIST_EVENT));
}

export default function WishlistPage() {
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readWishlist());
    setHydrated(true);

    const sync = () => setItems(readWishlist());
    window.addEventListener(WISHLIST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WISHLIST_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const handleRemove = (product) => {
    const next = items.filter((entry) => entry.id !== product.id);
    setItems(next);
    writeWishlist(next);
    toast(`Removed ${product.name || product.title} from wishlist`, { duration: 1400 });
  };

  const handleAddToCart = (product) => {
    addToCart(product, {
      selectedColor: product.colors?.[0] || null,
      selectedSize: product.sizes?.[0] || product.styles?.[0] || null,
    });
    toast.success(`${product.name || product.title} added to cart`, {
      style: {
        background: "var(--bg-card)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
        borderRadius: "18px",
      },
      iconTheme: { primary: "var(--accent, #C4895A)", secondary: "#fff" },
    });
  };

  const handleClearAll = () => {
    setItems([]);
    writeWishlist([]);
    toast("Wishlist cleared", { duration: 1300 });
  };

  return (
    <section className="wl-page">
      <style>{`
        .wl-page {
          padding: clamp(1.25rem, 3vw, 2.5rem) clamp(1rem, 4vw, 3rem) 4rem;
          min-height: 60vh;
        }

        .wl-shell {
          max-width: 1180px;
          margin: 0 auto;
        }

        .wl-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 0.5rem;
        }

        .wl-title-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .wl-kicker {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 600;
          color: #C4895A;
        }

        .wl-kicker svg {
          color: #F472B6;
        }

        .wl-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          color: var(--text-primary);
          line-height: 1.1;
        }

        .wl-subtitle {
          color: var(--text-secondary);
          font-size: 0.92rem;
        }

        .wl-clear {
          border: 1px solid var(--border);
          background: var(--bg-primary);
          color: var(--text-secondary);
          border-radius: 999px;
          padding: 9px 16px;
          font-size: 0.82rem;
          cursor: pointer;
          white-space: nowrap;
          transition: border-color 0.2s, color 0.2s, transform 0.2s;
        }

        .wl-clear:hover {
          border-color: var(--text-primary);
          color: var(--text-primary);
          transform: translateY(-1px);
        }

        .wl-divider {
          margin: 1.4rem 0 1.8rem;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
        }

        .wl-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.1rem;
        }

        @media (max-width: 1080px) {
          .wl-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 760px) {
          .wl-grid { grid-template-columns: repeat(2, 1fr); gap: 0.85rem; }
        }
        @media (max-width: 460px) {
          .wl-grid { grid-template-columns: 1fr 1fr; gap: 0.7rem; }
        }

        .wl-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 22px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: translateY(14px);
          animation: wlCardIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .wl-card:hover {
          box-shadow: 0 18px 40px rgba(196,137,90,0.14);
          transform: translateY(-3px);
        }

        @keyframes wlCardIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .wl-card-media {
          position: relative;
          aspect-ratio: 1 / 1.2;
          overflow: hidden;
          background: var(--bg-secondary, rgba(0,0,0,0.04));
        }

        .wl-card-image {
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .wl-card:hover .wl-card-image {
          transform: scale(1.05);
        }

        .wl-remove {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(6px);
          color: #F472B6;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
          box-shadow: 0 6px 16px rgba(0,0,0,0.12);
          transition: transform 0.2s, background 0.2s;
        }

        .wl-remove:hover {
          transform: scale(1.1);
          background: #fff;
        }

        .wl-card-body {
          padding: 0.95rem 1rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          flex: 1;
        }

        .wl-card-cat {
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .wl-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.08rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.25;
        }

        .wl-card-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }

        .wl-card-price {
          font-weight: 700;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .wl-card-og {
          font-size: 0.78rem;
          color: var(--text-muted);
          text-decoration: line-through;
        }

        .wl-card-add {
          margin-top: auto;
          border: none;
          border-radius: 999px;
          padding: 10px 14px;
          background: var(--text-primary);
          color: var(--bg-primary);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, background 0.25s;
        }

        .wl-card-add:hover {
          background: linear-gradient(135deg, #E8A0BF, #C4895A);
          transform: translateY(-1px);
          box-shadow: 0 10px 22px rgba(196,137,90,0.28);
        }

        .wl-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.8rem;
          padding: 4rem 1rem;
          color: var(--text-secondary);
        }

        .wl-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(244,114,182,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F472B6;
          margin-bottom: 0.4rem;
          animation: wlEmptyPulse 2.6s ease-in-out infinite;
        }

        @keyframes wlEmptyPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        .wl-empty h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          color: var(--text-primary);
        }

        .wl-empty-cta {
          margin-top: 0.6rem;
          display: inline-flex;
          padding: 12px 24px;
          border-radius: 999px;
          background: var(--text-primary);
          color: var(--bg-primary);
          text-decoration: none;
          font-weight: 700;
          font-size: 0.85rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .wl-empty-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 26px rgba(196,137,90,0.28);
        }
      `}</style>

      <div className="wl-shell">
        <div className="wl-header">
          <div className="wl-title-group">
            <span className="wl-kicker">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Saved for later
            </span>
            <h1 className="wl-title">Your Wishlist</h1>
            <p className="wl-subtitle">
              {hydrated
                ? `${items.length} item${items.length === 1 ? "" : "s"} saved`
                : "Loading your saved items..."}
            </p>
          </div>

          {items.length > 0 && (
            <button type="button" className="wl-clear" onClick={handleClearAll}>
              Clear all
            </button>
          )}
        </div>

        <div className="wl-divider" />

        {!hydrated ? null : items.length === 0 ? (
          <div className="wl-empty">
            <div className="wl-empty-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2>Nothing saved yet</h2>
            <p style={{ maxWidth: 320 }}>
              Tap the heart icon on any piece you love and it'll show up here, ready whenever you are.
            </p>
            <Link href="/shop" className="wl-empty-cta">
              Browse the Shop
            </Link>
          </div>
        ) : (
          <div className="wl-grid">
            {items.map((product, index) => {
              const image = (product.images || []).filter(Boolean)[0] || "/images/one.jpg";
              const hasDiscount = Number(product.originalPrice) > Number(product.price);
              return (
                <article
                  key={product.id}
                  className="wl-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="wl-card-media">
                    <Image
                      src={image}
                      alt={product.name || product.title || "Wishlist item"}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="wl-card-image"
                    />
                    <button
                      type="button"
                      className="wl-remove"
                      aria-label={`Remove ${product.name || product.title} from wishlist`}
                      onClick={() => handleRemove(product)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>

                  <div className="wl-card-body">
                    <span className="wl-card-cat">{product.category}</span>
                    <Link
                      href={`/product/${product.id}`}
                      className="wl-card-name"
                      style={{ textDecoration: "none" }}
                    >
                      {product.name || product.title}
                    </Link>
                    <div className="wl-card-price-row">
                      <span className="wl-card-price">₦{Number(product.price).toLocaleString()}</span>
                      {hasDiscount && (
                        <span className="wl-card-og">₦{Number(product.originalPrice).toLocaleString()}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="wl-card-add"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}