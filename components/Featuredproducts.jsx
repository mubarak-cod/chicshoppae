"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const tabs = ["New Arrivals", "Best Sellers", "Staff Picks"];

const products = {
  "New Arrivals": [
    { id: 1, name: "Rosette Mini Dress", price: 18500, category: "Gowns", badge: "New", badgeColor: "#E8A0BF", images: ["/images/chan1.jpg"], sizes: ["S","M","L","XL"] },
    { id: 2, name: "Top Nilda", price: 5000, category: "2-Piece Sets", badge: "New", badgeColor: "#E8A0BF", images: ["/images/chan2.jpg"], sizes: ["S","M","L"] },
    { id: 3, name: "Top Nilda", price: 5000, category: "Tops", badge: "", badgeColor: "", images: ["/images/chan3.jpg"], sizes: ["S","M","L","XL"] },
    { id: 4, name: "Chantily top", price: 5000, category: "Tops", badge: "Hot", badgeColor: "#F4A261", images: ["/images/chan4.jpg"], sizes: ["S","M","L"] },
    { id: 5, name: "Top Nilda", price: 5000, category: "Top", badge: "", badgeColor: "", images: ["/images/chan5.jpg"], sizes: ["M","L","XL"] },
    { id: 6, name: "Top Mirah", price: 5000, category: "Tops", badge: "🔥", badgeColor: "#F4A261", images: ["/images/chan6.jpg"], sizes: ["S","M","L"] },
  ],
  "Best Sellers": [
    { id: 7, name: "Blazer Dress", price: 25000, category: "Gowns", badge: "Top Pick", badgeColor: "#C084FC", images: [""], sizes: ["S","M","L","XL"] },
    { id: 8, name: "Crochet Top", price: 7500, category: "Tops", badge: "Sold Out", badgeColor: "#94A3B8", images: [""], sizes: [] },
    { id: 9, name: "Pleated Midi Dress", price: 21000, category: "Gowns", badge: "Top Pick", badgeColor: "#C084FC", images: [""], sizes: ["S","M","L"] },
    { id: 10, name: "Ribbed Knit Set", price: 16500, category: "2-Piece Sets", badge: "", badgeColor: "", images: [""], sizes: ["S","M","L","XL"] },
    { id: 11, name: "Floral Wrap Dress", price: 19000, category: "Gowns", badge: "Top Pick", badgeColor: "#C084FC", images: [""], sizes: ["S","M"] },
    { id: 12, name: "Silk Palazzo", price: 23500, category: "Trousers", badge: "", badgeColor: "", images: [""], sizes: ["M","L","XL"] },
  ],
  "Staff Picks": [
    { id: 13, name: "Leather Tote Bag", price: 19500, category: "Bags", badge: "Staff ♥", badgeColor: "#F472B6", images: [""], sizes: ["One Size"] },
    { id: 14, name: "Corset Crop Top", price: 12000, category: "Tops", badge: "Staff ♥", badgeColor: "#F472B6", images: [""], sizes: ["S","M","L"] },
    { id: 15, name: "Wrap Midi Skirt", price: 14000, category: "Trousers", badge: "", badgeColor: "", images: [""], sizes: ["S","M","L","XL"] },
    { id: 16, name: "Sequin Mini Dress", price: 28000, category: "Gowns", badge: "Staff ♥", badgeColor: "#F472B6", images: [""], sizes: ["S","M"] },
    { id: 17, name: "Lace Trim Blouse", price: 11500, category: "Tops", badge: "", badgeColor: "", images: [""], sizes: ["S","M","L"] },
    { id: 18, name: "Wide Brim Hat", price: 8500, category: "Accessories", badge: "Staff ♥", badgeColor: "#F472B6", images: [""], sizes: ["One Size"] },
  ],
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function ProductCard({ product, index }) {
  const [wished, setWished] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [imgIndex, setImgIndex] = useState(0);
  const [ref, inView] = useInView();
  const { addToCart, cartItems } = useCart();
  const router = useRouter();
  const isSoldOut = product.badge === "Sold Out";

  // True once this product is actually sitting in the cart — persists
  // across renders/navigation, not just a few seconds after clicking.
  const inCart = cartItems?.some((item) => item.id === product.id);

  const handleAdd = (e) => {
    e.preventDefault();
    if (isSoldOut) return;

    if (inCart) {
      // Already in cart — button now acts as "Go to Cart"
      router.push("/cart");
      return;
    }

    addToCart({ ...product, selectedSize });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200); // only drives the brief "Added ✓" pulse
  };

  // Decide label/state: brief "Added" flash → settles into permanent "Go to Cart"
  const buttonState = isSoldOut
    ? "soldout"
    : justAdded
    ? "justAdded"
    : inCart
    ? "inCart"
    : "default";

  return (
    <div
      ref={ref}
      className="fp-card-wrap"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 0.08}s`,
      }}
    >
      <style>{`
        .fp-card-wrap { will-change: transform, opacity; }

        .fp-card {
          background: var(--bg-card, #FDFAF5);
          border-radius: 16px;
          overflow: hidden;
          border: 0.5px solid var(--border, rgba(26,23,20,0.12));
          transition: box-shadow 0.35s cubic-bezier(0.22,1,0.36,1),
                      transform 0.35s cubic-bezier(0.22,1,0.36,1);
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .fp-card:hover {
          box-shadow: 0 12px 48px rgba(196,137,90,0.13), 0 2px 8px rgba(0,0,0,0.06);
          transform: translateY(-5px);
        }

        /* ── IMAGE ── */
        .fp-img-wrap {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: var(--bg-secondary, #EDE8DE);
        }

        .fp-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .fp-card:hover .fp-img { transform: scale(1.06); }

        .fp-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 8px;
          color: var(--text-muted, #9E9890);
          transition: background 0.3s;
        }
        .fp-card:hover .fp-placeholder { background: #E8DDD4; }

        /* ── IMAGE DOTS ── */
        .fp-img-dots {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 4;
        }
        .fp-card:hover .fp-img-dots { opacity: 1; }
        .fp-img-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          border: none; padding: 0;
        }
        .fp-img-dot.active { background: #fff; transform: scale(1.3); }

        /* ── BADGE ── */
        .fp-badge {
          position: absolute;
          top: 10px; left: 10px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 0.08em;
          z-index: 3;
          font-family: 'Inter', sans-serif;
        }

        /* In-cart indicator pill on the image itself */
        .fp-incart-tag {
          position: absolute;
          top: 10px; left: 10px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.06em;
          z-index: 3;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #E8A0BF, #C4895A);
          color: #fff;
          display: flex;
          align-items: center;
          gap: 4px;
          animation: tagPop 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }

        @keyframes tagPop {
          from { transform: scale(0.7); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        /* ── WISHLIST ── */
        .fp-wish {
          position: absolute;
          top: 8px; right: 8px;
          width: 34px; height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.88);
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          z-index: 3;
          transform: scale(0.8);
          opacity: 0;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1),
                      opacity 0.3s,
                      background 0.2s;
          backdrop-filter: blur(4px);
        }
        .fp-card:hover .fp-wish { transform: scale(1); opacity: 1; }
        .fp-wish.wished {
          background: #FFF0F5;
          transform: scale(1) !important;
          opacity: 1 !important;
        }
        .fp-wish:hover { background: #FFF0F5; transform: scale(1.1) !important; }

        /* ── QUICK ADD PANEL ── */
        .fp-quick-add {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(8px);
          padding: 12px;
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
          z-index: 4;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 0.5px solid rgba(26,23,20,0.08);
        }
        .fp-card:hover .fp-quick-add { transform: translateY(0); }

        .fp-sizes {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }

        .fp-size-btn {
          padding: 4px 9px;
          border: 0.5px solid rgba(26,23,20,0.2);
          border-radius: 6px;
          font-size: 10.5px;
          font-weight: 400;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          background: transparent;
          color: #1A1714;
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
        }
        .fp-size-btn:hover { background: #F5F0E8; transform: scale(1.05); }
        .fp-size-btn.selected {
          background: #1A1714;
          color: #F5F0E8;
          border-color: #1A1714;
        }

        /* ── ADD BUTTON — 4 visual states ── */
        .fp-add-btn {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          border: none;
          position: relative;
          overflow: hidden;
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s, background 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .fp-add-btn span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          animation: btnTextIn 0.3s cubic-bezier(0.22,1,0.36,1);
        }

        @keyframes btnTextIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Default — not yet added */
        .fp-add-btn.available {
          background: #1A1714;
          color: #F5F0E8;
        }
        .fp-add-btn.available:hover {
          background: #2D2925;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.18);
        }

        /* Brief "Added ✓" flash right after clicking */
        .fp-add-btn.just-added {
          background: linear-gradient(135deg, #E8A0BF, #C4895A);
          color: #fff;
          box-shadow: 0 8px 22px rgba(196,137,90,0.35);
        }

        /* Permanent state once item is confirmed in cart — "Go to Cart" */
        .fp-add-btn.in-cart {
          background: var(--bg-secondary, #EDE8DE);
          color: var(--text-primary, #1A1714);
          border: 1px solid rgba(196,137,90,0.4);
        }
        .fp-add-btn.in-cart:hover {
          background: var(--bg-card, #FDFAF5);
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(196,137,90,0.18);
        }
        .fp-add-btn.in-cart svg {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .fp-add-btn.in-cart:hover svg {
          transform: translateX(3px);
        }

        .fp-add-btn.soldout {
          background: #EDE8DE;
          color: #9E9890;
          cursor: not-allowed;
        }

        /* ── INFO ── */
        .fp-info {
          padding: 0.9rem 1rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
        }

        .fp-cat {
          font-size: 9.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-muted, #9E9890);
        }

        .fp-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 500;
          color: var(--text-primary, #1A1714);
          line-height: 1.25;
          text-decoration: none;
          display: block;
          transition: color 0.2s;
        }
        .fp-name:hover { color: var(--accent, #C4895A); }

        .fp-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
        }

        .fp-price {
          font-size: 14.5px;
          font-weight: 500;
          color: var(--text-primary, #1A1714);
        }

        .fp-view-link {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted, #9E9890);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 3px;
          transition: color 0.2s, gap 0.2s;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .fp-card:hover .fp-view-link { opacity: 1; }
        .fp-view-link:hover { color: var(--accent, #C4895A); }
      `}</style>

      <div className="fp-card">
        {/* Image */}
        <div className="fp-img-wrap">
          {product.images?.[imgIndex] ? (
            <img src={product.images[imgIndex]} alt={product.name} className="fp-img" loading="lazy" />
          ) : (
            <div className="fp-placeholder">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.25 }}>
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span style={{ fontSize: "9px", letterSpacing: ".15em", textTransform: "uppercase", opacity: 0.4 }}>
                Add image
              </span>
            </div>
          )}

          {/* Multi-image dots */}
          {product.images?.length > 1 && (
            <div className="fp-img-dots">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  className={`fp-img-dot ${i === imgIndex ? "active" : ""}`}
                  onClick={(e) => { e.preventDefault(); setImgIndex(i); }}
                />
              ))}
            </div>
          )}

          {/* Badge — replaced by "In Cart" tag once confirmed in cart */}
          {buttonState === "inCart" || buttonState === "justAdded" ? (
            <span className="fp-incart-tag">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              In Cart
            </span>
          ) : product.badge ? (
            <span
              className="fp-badge"
              style={{ background: product.badgeColor || "#E8A0BF", color: "#fff" }}
            >
              {product.badge}
            </span>
          ) : null}

          {/* Wishlist */}
          <button
            className={`fp-wish ${wished ? "wished" : ""}`}
            onClick={(e) => { e.preventDefault(); setWished(!wished); }}
            aria-label="Wishlist"
          >
            <svg width="16" height="16" viewBox="0 0 24 24"
              fill={wished ? "#F472B6" : "none"}
              stroke={wished ? "#F472B6" : "#1A1714"}
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          {/* Quick Add / Go to Cart Panel */}
          {!isSoldOut && (
            <div className="fp-quick-add">
              {buttonState === "default" && product.sizes?.length > 0 && (
                <div className="fp-sizes">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`fp-size-btn ${selectedSize === s ? "selected" : ""}`}
                      onClick={(e) => { e.preventDefault(); setSelectedSize(s); }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <button
                className={`fp-add-btn ${
                  buttonState === "justAdded" ? "just-added" :
                  buttonState === "inCart" ? "in-cart" :
                  "available"
                }`}
                onClick={handleAdd}
              >
                {buttonState === "justAdded" ? (
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Added ✓
                  </span>
                ) : buttonState === "inCart" ? (
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Go to Cart
                  </span>
                ) : (
                  <span>Quick Add</span>
                )}
              </button>
            </div>
          )}

          {isSoldOut && (
            <div className="fp-quick-add">
              <button className="fp-add-btn soldout" disabled>Sold Out</button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="fp-info">
          <span className="fp-cat">{product.category}</span>
          <Link href={`/product/${product.id}`} className="fp-name">{product.name}</Link>
          <div className="fp-price-row">
            <span className="fp-price">₦{product.price.toLocaleString()}</span>
            <Link href={`/product/${product.id}`} className="fp-view-link">
              View
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("New Arrivals");
  const [prevTab, setPrevTab] = useState(null);
  const [sectionRef, sectionInView] = useInView(0.1);

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    setPrevTab(activeTab);
    setActiveTab(tab);
  };

  return (
    <>
      <style>{`
        .fp-section {
          padding: 5rem 0;
          border-top: 0.5px solid var(--border, rgba(26,23,20,0.12));
          background: var(--bg-primary, #F5F0E8);
          overflow: hidden;
        }

        .fp-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ── HEADER ── */
        .fp-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .fp-header-left { display: flex; flex-direction: column; gap: 1.2rem; }

        /* ── TABS ── */
        .fp-tabs {
          display: flex;
          gap: 0;
          background: var(--bg-secondary, #EDE8DE);
          border-radius: 10px;
          padding: 4px;
          border: 0.5px solid var(--border, rgba(26,23,20,0.12));
          width: fit-content;
        }

        .fp-tab {
          padding: 8px 18px;
          border-radius: 7px;
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 400;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          border: none;
          background: transparent;
          color: var(--text-secondary, #6B6560);
          transition: background 0.25s, color 0.25s, box-shadow 0.25s;
          white-space: nowrap;
          position: relative;
        }

        .fp-tab.active {
          background: var(--bg-card, #FDFAF5);
          color: var(--text-primary, #1A1714);
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        .fp-tab::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 20px; height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #E8A0BF, #C4895A);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .fp-tab.active::after { transform: translateX(-50%) scaleX(1); }

        .fp-see-all {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary, #6B6560);
          text-decoration: none;
          transition: color 0.2s, gap 0.2s;
          padding-top: 6px;
          white-space: nowrap;
        }
        .fp-see-all:hover { color: var(--text-primary, #1A1714); gap: 9px; }
        .fp-see-all svg { transition: transform 0.2s; }
        .fp-see-all:hover svg { transform: translateX(3px); }

        /* ── GRID ── */
        .fp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        /* ── PINK ACCENT DIVIDER ── */
        .fp-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .fp-divider-line {
          flex: 1;
          height: 0.5px;
          background: linear-gradient(90deg, transparent, #E8A0BF44, transparent);
        }
        .fp-divider-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E8A0BF, #C4895A);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .fp-grid { grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        }

        @media (max-width: 768px) {
          .fp-section { padding: 3.5rem 0; }
          .fp-grid { grid-template-columns: repeat(2, 1fr); gap: 0.875rem; }
          .fp-header { flex-direction: column; gap: 1rem; }
          .fp-tabs { width: 100%; }
          .fp-tab { flex: 1; text-align: center; padding: 8px 10px; font-size: 10.5px; }
          .fp-see-all { align-self: flex-end; }
        }

        @media (max-width: 480px) {
          .fp-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          .fp-container { padding: 0 1rem; }
          .fp-tab { font-size: 9.5px; padding: 7px 8px; }
        }
      `}</style>

      <section className="fp-section" ref={sectionRef}>
        <div className="fp-container">

          {/* Header */}
          <div
            className="fp-header"
            style={{
              opacity: sectionInView ? 1 : 0,
              transform: sectionInView ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div className="fp-header-left">
              <div>
                <span className="section-eyebrow" style={{ background: "linear-gradient(90deg,#E8A0BF,#C4895A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Handpicked for You
                </span>
                <h2 className="section-title">Our Favourites</h2>
              </div>
              <div className="fp-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`fp-tab ${activeTab === tab ? "active" : ""}`}
                    onClick={() => switchTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href={`/shop?filter=${activeTab.toLowerCase().replace(" ", "-")}`}
              className="fp-see-all"
            >
              See all
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>

          {/* Pink accent divider */}
          <div className="fp-divider">
            <div className="fp-divider-line" />
            <div className="fp-divider-dot" />
            <div className="fp-divider-line" />
          </div>

          {/* Grid */}
          <div className="fp-grid">
            {products[activeTab].map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}