git 
"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

function IconButton({ label, children, onClick, active }) {
  return (
    <button
      className={`product-icon-button ${active ? "active" : ""}`}
      type="button"
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [wished, setWished] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const hasDiscount = Number(product.discount) > 0;
  const gallery = useMemo(() => product.images || [], [product.images]);
  const inCart = cartItems?.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, { selectedColor, selectedSize });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const previousImage = () => setActiveImage((index) => (index - 1 + gallery.length) % gallery.length);
  const nextImage = () => setActiveImage((index) => (index + 1) % gallery.length);

  return (
    <motion.article
      className="product-card"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <style>{`
        /* ── CARD SHELL WITH ANIMATED GRADIENT BORDER ── */
        .product-card {
          position: relative;
          border-radius: 28px;
          background: var(--bg-card);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 100%;
          isolation: isolate;
          box-shadow: 0 14px 36px rgba(12, 10, 8, 0.06);
          transition: box-shadow 0.35s ease;
        }

        .product-card::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 1.5px;
          border-radius: 28px;
          background: linear-gradient(
            135deg,
            rgba(196,137,90,0.0) 0%,
            rgba(196,137,90,0.0) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          z-index: 2;
          pointer-events: none;
          transition: background 0.5s ease;
        }

        .product-card:hover::before {
          background: linear-gradient(
            135deg,
            #E8A0BF 0%,
            #C4895A 45%,
            #F4D9A0 70%,
            #E8A0BF 100%
          );
          background-size: 250% 250%;
          animation: borderFlow 3s linear infinite;
        }

        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .product-card:hover {
          box-shadow: 0 28px 60px rgba(196,137,90,0.18), 0 8px 20px rgba(0,0,0,0.08);
        }

        /* Soft ambient glow that blooms on hover */
        .product-card-glow {
          position: absolute;
          inset: -40%;
          background: radial-gradient(circle at 30% 20%, rgba(232,160,191,0.16), transparent 55%);
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: 0;
          pointer-events: none;
        }

        .product-card:hover .product-card-glow {
          opacity: 1;
        }

        /* ── MEDIA ── */
        .product-card-media {
          position: relative;
          aspect-ratio: 1 / 1.18;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.08));
          z-index: 1;
        }

        .product-card-image {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }

        .product-card:hover .product-card-image {
          transform: scale(1.045);
        }

        /* Subtle vignette for depth */
        .media-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.06) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.18) 100%);
          pointer-events: none;
          z-index: 1;
        }

        .product-card-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 14px;
          pointer-events: none;
          z-index: 2;
        }

        .product-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 11px;
          border-radius: 999px;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #E8A0BF, #C4895A);
          color: #fff;
          pointer-events: auto;
          box-shadow: 0 6px 18px rgba(196,137,90,0.35);
        }

        .product-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          pointer-events: auto;
        }

        .product-icon-button {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          color: var(--text-primary);
          display: grid;
          place-items: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          cursor: pointer;
          transform: scale(0.85);
          opacity: 0;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s, background 0.2s;
        }

        .product-card:hover .product-icon-button {
          opacity: 1;
          transform: scale(1);
        }

        .product-icon-button:hover {
          transform: scale(1.12) !important;
        }

        .product-icon-button.active {
          background: #FFF0F5;
          color: #F472B6;
          opacity: 1;
          transform: scale(1);
        }

        .product-card-nav {
          position: absolute;
          inset: auto 12px 44px 12px;
          display: flex;
          justify-content: space-between;
          pointer-events: none;
          z-index: 2;
        }

        .product-card-nav button {
          pointer-events: auto;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          border: 0.5px solid rgba(255,255,255,0.25);
          background: rgba(20, 18, 16, 0.45);
          color: #fff;
          display: grid;
          place-items: center;
          backdrop-filter: blur(10px);
          opacity: 0;
          transition: opacity 0.3s, transform 0.2s, background 0.2s;
        }

        .product-card:hover .product-card-nav button {
          opacity: 1;
        }

        .product-card-nav button:hover {
          background: rgba(20, 18, 16, 0.65);
          transform: scale(1.08);
        }

        /* ── BODY ── */
        .product-card-body {
          padding: 1.1rem 1.1rem 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .product-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-weight: 600;
          line-height: 1.3;
          color: var(--text-primary);
          transition: color 0.25s;
        }

        .product-card:hover .product-title {
          color: #C4895A;
        }

        .product-description {
          font-size: 0.84rem;
          line-height: 1.55;
          color: var(--text-secondary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-price-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
        }

        .product-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .product-original-price {
          color: var(--text-muted);
          text-decoration: line-through;
          font-size: 0.85rem;
        }

        .product-discount-tag {
          font-size: 0.7rem;
          font-weight: 600;
          color: #C4895A;
          background: rgba(196,137,90,0.1);
          padding: 2px 7px;
          border-radius: 5px;
        }

        .product-colors,
        .product-sizes {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          align-items: center;
        }

        .product-meta-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          width: 100%;
          letter-spacing: 0.02em;
        }

        .product-color-dot {
          width: 20px;
          height: 20px;
          padding: 0;
          border: 2px solid var(--bg-card);
          box-shadow: 0 0 0 1px var(--border);
          border-radius: 999px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .product-color-dot:hover {
          transform: scale(1.15);
        }

        .product-color-dot[aria-pressed="true"] {
          box-shadow: 0 0 0 2px var(--text-primary);
          transform: scale(1.1);
        }

        .product-size-pill {
          border: 1px solid var(--border);
          background: var(--bg-primary);
          border-radius: 999px;
          cursor: pointer;
          padding: 6px 12px;
          font-size: 0.76rem;
          color: var(--text-primary);
          transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s;
        }

        .product-size-pill:hover {
          transform: scale(1.05);
          border-color: #C4895A;
        }

        .product-size-pill[aria-pressed="true"] {
          background: var(--text-primary);
          color: var(--bg-primary);
          border-color: var(--text-primary);
        }

        /* ── FOOTER / CTA ── */
        .product-card-footer {
          display: flex;
          gap: 10px;
          margin-top: auto;
          padding-top: 0.3rem;
        }

        .add-to-cart {
          flex: 1;
          border: none;
          border-radius: 999px;
          background: var(--text-primary);
          color: var(--bg-primary);
          padding: 12px 16px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: transform 0.25s, box-shadow 0.25s;
        }

        .add-to-cart::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #E8A0BF, #C4895A);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .add-to-cart:hover::before {
          opacity: 1;
        }

        .add-to-cart:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 26px rgba(196,137,90,0.32);
        }

        .add-to-cart span {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .add-to-cart.added {
          background: linear-gradient(135deg, #E8A0BF, #C4895A);
        }

        .add-to-cart.added::before { display: none; }

        /* ── GALLERY DOTS ── */
        .gallery-dots {
          display: flex;
          gap: 5px;
          position: absolute;
          left: 50%;
          bottom: 14px;
          transform: translateX(-50%);
          z-index: 2;
        }

        .gallery-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: background 0.2s, transform 0.2s, width 0.25s;
          padding: 0;
        }

        .gallery-dot--active {
          background: #fff;
          width: 16px;
          border-radius: 4px;
        }

        @media (max-width: 640px) {
          .product-icon-button {
            opacity: 1;
            transform: scale(0.92);
          }
          .product-card-nav button {
            opacity: 1;
          }
        }
      `}</style>

      <div className="product-card-glow" />

      <div className="product-card-media">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={gallery[activeImage]}
            style={{ position: "absolute", inset: 0 }}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            drag={gallery.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -40 && gallery.length > 1) nextImage();
              if (info.offset.x > 40 && gallery.length > 1) previousImage();
            }}
          >
            <Image
              src={gallery[activeImage]}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="product-card-image"
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>

        <div className="media-vignette" />

        <div className="product-card-overlay">
          {hasDiscount ? (
            <span className="product-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2H22l-6 4.4 2.3 7.2L12 16.4 5.7 20.8 8 13.6 2 9.2h7.6z"/></svg>
              -{product.discount}%
            </span>
          ) : <span />}

          <div className="product-actions">
            <IconButton label="Add to wishlist" active={wished} onClick={() => setWished(!wished)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </IconButton>
            <IconButton label="Quick view" onClick={() => {}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </IconButton>
          </div>
        </div>

        {gallery.length > 1 && (
          <>
            <div className="product-card-nav">
              <button type="button" aria-label="Previous product image" onClick={previousImage}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button type="button" aria-label="Next product image" onClick={nextImage}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            <div className="gallery-dots" aria-label="Product image gallery">
              {gallery.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`gallery-dot ${index === activeImage ? "gallery-dot--active" : ""}`}
                  aria-label={`Show product image ${index + 1}`}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="product-card-body">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-price-row">
          <span className="product-price">₦{product.price.toLocaleString()}</span>
          {hasDiscount && (
            <>
              <span className="product-original-price">₦{product.originalPrice.toLocaleString()}</span>
              <span className="product-discount-tag">Save {product.discount}%</span>
            </>
          )}
        </div>

        {product.colors?.length > 0 && (
          <div className="product-colors">
            <span className="product-meta-label">Available in</span>
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                className="product-color-dot"
                aria-label={color}
                aria-pressed={selectedColor === color}
                title={color}
                onClick={() => setSelectedColor(color)}
                style={{ background: color.toLowerCase() }}
              />
            ))}
          </div>
        )}

        {product.sizes?.length > 0 && (
          <div className="product-sizes">
            <span className="product-meta-label">Sizes</span>
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                className="product-size-pill"
                aria-pressed={selectedSize === size}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <div className="product-card-footer">
          <button
            type="button"
            className={`add-to-cart ${justAdded ? "added" : ""}`}
            onClick={handleAddToCart}
          >
            <span>
              {justAdded ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Added
                </>
              ) : inCart ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add More
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Add to Cart
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
