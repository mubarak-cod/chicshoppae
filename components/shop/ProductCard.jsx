"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

function IconButton({ label, children, onClick, type = "button" }) {
  return (
    <button className="product-icon-button" type={type} aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);

  const hasDiscount = Number(product.discount) > 0;
  const gallery = useMemo(() => product.images || [], [product.images]);

  const handleAddToCart = () => {
    addToCart(product, { selectedColor, selectedSize });
  };

  const previousImage = () => setActiveImage((index) => (index - 1 + gallery.length) % gallery.length);
  const nextImage = () => setActiveImage((index) => (index + 1) % gallery.length);

  return (
    <motion.article
      className="product-card"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
    >
      <style>{`
        .product-card {
          border: 1px solid var(--border);
          border-radius: 28px;
          background: var(--bg-card);
          overflow: hidden;
          box-shadow: 0 18px 42px rgba(12, 10, 8, 0.05);
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }

        .product-card-media {
          position: relative;
          aspect-ratio: 1 / 1.18;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.08));
        }

        .product-card-image {
          object-fit: cover;
        }

        .product-card-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 14px;
          pointer-events: none;
        }

        .product-badge {
          display: inline-flex;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(20, 18, 16, 0.72);
          color: #fff;
          pointer-events: auto;
        }

        .product-actions {
          display: flex;
          gap: 8px;
          pointer-events: auto;
        }

        .product-icon-button {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.86);
          color: var(--text-primary);
          display: grid;
          place-items: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          cursor: pointer;
        }

        .product-card-nav {
          position: absolute;
          inset: auto 12px 12px 12px;
          display: flex;
          justify-content: space-between;
          pointer-events: none;
        }

        .product-card-nav button {
          pointer-events: auto;
          width: 34px;
          height: 34px;
          border-radius: 999px;
          border: 0.5px solid rgba(255,255,255,0.22);
          background: rgba(20, 18, 16, 0.42);
          color: #fff;
          display: grid;
          place-items: center;
          backdrop-filter: blur(10px);
        }

        .product-card-body {
          padding: 1rem 1rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }

        .product-title {
          font-size: 1rem;
          line-height: 1.35;
          color: var(--text-primary);
        }

        .product-description {
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .product-price-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .product-price {
          font-size: 1.06rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .product-original-price {
          color: var(--text-muted);
          text-decoration: line-through;
          font-size: 0.92rem;
        }

        .product-colors,
        .product-sizes {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .product-meta-label {
          font-size: 0.82rem;
          color: var(--text-muted);
          width: 100%;
        }

        .product-color-dot,
        .product-size-pill {
          border: 1px solid var(--border);
          background: var(--bg-primary);
          border-radius: 999px;
          cursor: pointer;
        }

        .product-color-dot {
          width: 18px;
          height: 18px;
          padding: 0;
        }

        .product-color-dot[aria-pressed="true"] {
          outline: 2px solid var(--text-primary);
          outline-offset: 2px;
        }

        .product-size-pill {
          padding: 7px 12px;
          font-size: 0.8rem;
          color: var(--text-primary);
        }

        .product-size-pill[aria-pressed="true"] {
          background: var(--text-primary);
          color: var(--bg-primary);
        }

        .product-card-footer {
          display: flex;
          gap: 10px;
          margin-top: auto;
        }

        .add-to-cart {
          flex: 1;
          border: none;
          border-radius: 999px;
          background: var(--text-primary);
          color: var(--bg-primary);
          padding: 12px 16px;
          font-size: 0.86rem;
          font-weight: 700;
          cursor: pointer;
        }

        .quick-view {
          width: 44px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .gallery-dots {
          display: flex;
          gap: 6px;
          position: absolute;
          left: 50%;
          bottom: 16px;
          transform: translateX(-50%);
        }

        .gallery-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.45);
        }

        .gallery-dot--active {
          background: #fff;
        }

        .product-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, rgba(255,255,255,0.18) 8%, rgba(255,255,255,0.42) 18%, rgba(255,255,255,0.18) 33%);
          background-size: 200% 100%;
          animation: shimmer 1.4s linear infinite;
        }

        @keyframes shimmer {
          to { background-position-x: -200%; }
        }
      `}</style>

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
        <div className="product-card-overlay">
          {hasDiscount ? <span className="product-badge">-{product.discount}%</span> : <span />}
          <div className="product-actions">
            <IconButton label="Add to wishlist" onClick={() => {}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </IconButton>
            <IconButton label="Quick view" onClick={() => {}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button type="button" aria-label="Next product image" onClick={nextImage}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
          <span className="product-original-price">₦{product.originalPrice.toLocaleString()}</span>
        </div>

        <div className="product-colors">
          <span className="product-meta-label">Available in </span>
          {product.colors?.map((color) => (
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
          <button type="button" className="add-to-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button type="button" className="quick-view" aria-label="Open quick view">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 21l-4.35-4.35" />
              <circle cx="11" cy="11" r="7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.article>
  );
}