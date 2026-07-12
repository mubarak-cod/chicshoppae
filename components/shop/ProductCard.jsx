"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import ImageFrame from "@/components/ImageFrame";

const WISHLIST_STORAGE_KEY = "chic-shoppae-wishlist";
const WISHLIST_EVENT = "chic-wishlist-updated";

function getColorKey(color) {
  if (!color) return "";
  return String(color).toLowerCase();
}

function getSizeKey(size) {
  if (!size) return "";
  return String(size).toLowerCase();
}

function IconButton({ label, children, onClick, active }) {
  return (
    <motion.button
      className={`product-icon-button ${active ? "active" : ""}`}
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
    >
      {children}
    </motion.button>
  );
}

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart, cartItems } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const hasSizes = !!product.sizes?.length;
  const hasStyles = !!product.styles?.length;
  const sizeOptions = hasSizes ? product.sizes : hasStyles ? product.styles : [];
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [wished, setWished] = useState(false);
  const [buttonState, setButtonState] = useState("idle");
  const flashTimerRef = useRef(null);

  const productName = product.name || product.title || "Untitled product";
  const gallery = useMemo(() => (product.images || []).filter(Boolean), [product.images]);
  const hasDiscount = Number(product.originalPrice) > Number(product.price);
  const inCart = Boolean(
    cartItems?.some(
      (item) =>
        item.id === product.id &&
        getColorKey(item.selectedColor) === getColorKey(selectedColor) &&
        getSizeKey(item.selectedSize) === getSizeKey(selectedSize)
    )
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = JSON.parse(window.localStorage.getItem(WISHLIST_STORAGE_KEY) || "[]");
      setWished(Array.isArray(stored) && stored.some((entry) => entry?.id === product.id));
    } catch {
      setWished(false);
    }
  }, [product.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncFromStorage = () => {
      try {
        const stored = JSON.parse(window.localStorage.getItem(WISHLIST_STORAGE_KEY) || "[]");
        setWished(Array.isArray(stored) && stored.some((entry) => entry?.id === product.id));
      } catch {
        setWished(false);
      }
    };
    window.addEventListener(WISHLIST_EVENT, syncFromStorage);
    window.addEventListener("storage", syncFromStorage);
    return () => {
      window.removeEventListener(WISHLIST_EVENT, syncFromStorage);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, [product.id]);

  useEffect(() => {
    if (inCart) {
      setButtonState("in-cart");
      return;
    }
    if (buttonState !== "flash") {
      setButtonState("idle");
    }
  }, [buttonState, inCart]);

  useEffect(() => () => window.clearTimeout(flashTimerRef.current), []);

  const handleWishlistToggle = () => {
    const next = !wished;
    setWished(next);

    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(window.localStorage.getItem(WISHLIST_STORAGE_KEY) || "[]");
        const list = Array.isArray(stored) ? stored : [];
        const nextList = next
          ? [...list.filter((entry) => entry?.id !== product.id), { ...product, savedAt: Date.now() }]
          : list.filter((entry) => entry?.id !== product.id);
        window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(nextList));
        window.dispatchEvent(new Event(WISHLIST_EVENT));
      } catch {
        window.localStorage.setItem(
          WISHLIST_STORAGE_KEY,
          JSON.stringify(next ? [{ ...product, savedAt: Date.now() }] : [])
        );
        window.dispatchEvent(new Event(WISHLIST_EVENT));
      }
    }

    toast(next ? `💗 Added ${productName} to wishlist` : `Removed ${productName} from wishlist`, {
      duration: 1400,
    });
  };

  const handleAddToCart = () => {
    if (inCart) {
      router.push("/cart");
      return;
    }

    addToCart(product, { selectedColor, selectedSize, selectedStyle });
    toast.success(`${productName} added to cart`, {
      style: {
        background: "var(--bg-card)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
        borderRadius: "18px",
        boxShadow: "0 18px 40px rgba(0, 0, 0, 0.12)",
      },
      iconTheme: {
        primary: "var(--accent)",
        secondary: "var(--bg-primary)",
      },
    });

    setButtonState("flash");
    window.clearTimeout(flashTimerRef.current);
    flashTimerRef.current = window.setTimeout(() => {
      setButtonState("in-cart");
    }, 900);
  };

  const activeImageSrc = gallery[activeImage] || gallery[0] || "/images/one.jpg";
  const colorOptions = useMemo(() => (product.colors || []).filter(Boolean), [product.colors]);
  const sizeOptionsList = useMemo(() => (sizeOptions || []).filter(Boolean), [sizeOptions]);

  const cycleImage = (direction = 1) => {
    if (gallery.length < 2) return;
    setActiveImage((current) => (current + direction + gallery.length) % gallery.length);
  };

  const isInCart = inCart || buttonState === "in-cart";
  const isFlash = buttonState === "flash";

  return (
    <motion.article
      className="product-card"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <style>{`
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
          transition: box-shadow 0.35s ease, transform 0.35s ease;
          border: 1px solid var(--border);
        }

        .product-card:hover {
          box-shadow: 0 28px 60px rgba(196, 137, 90, 0.15), 0 10px 24px rgba(0, 0, 0, 0.08);
        }

        .product-card-glow {
          position: absolute;
          inset: -40%;
          background: radial-gradient(circle at 30% 20%, rgba(232, 160, 191, 0.16), transparent 55%);
          opacity: 0.22;
          animation: ambientGlowPulse 6s ease-in-out infinite;
          transition: opacity 0.5s ease;
          z-index: 0;
          pointer-events: none;
        }

        @keyframes ambientGlowPulse {
          0%, 100% { opacity: 0.16; }
          50% { opacity: 0.32; }
        }

        .product-card:hover .product-card-glow {
          opacity: 1;
          animation-play-state: paused;
        }

        .product-card-media {
          position: relative;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: var(--bg-secondary);
          z-index: 1;
        }

        .product-card-image {
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .product-card:hover .product-card-image {
          transform: scale(1.055);
        }

        .media-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 26%, transparent 72%, rgba(0,0,0,0.18) 100%);
          pointer-events: none;
          z-index: 1;
        }

        .product-shimmer {
          position: absolute;
          top: 0;
          left: -60%;
          width: 35%;
          height: 100%;
          background: linear-gradient(115deg, transparent, rgba(255,255,255,0.32), transparent);
          transform: skewX(-18deg);
          animation: shimmerSweep 5.5s ease-in-out infinite;
          z-index: 1;
          pointer-events: none;
          mix-blend-mode: overlay;
        }

        @keyframes shimmerSweep {
          0% { left: -60%; }
          45% { left: 130%; }
          100% { left: 130%; }
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
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
          color: #fff;
          pointer-events: auto;
          box-shadow: 0 6px 18px rgba(196, 137, 90, 0.35);
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
          transform: scale(0.88);
          opacity: 0;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s, background 0.2s;
        }

        .product-card:hover .product-icon-button {
          opacity: 1;
          transform: scale(1);
        }

        .product-icon-button:hover {
          transform: scale(1.1) !important;
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
          background: rgba(20, 18, 16, 0.42);
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
          background: rgba(255,255,255,0.42);
          cursor: pointer;
          transition: background 0.2s, transform 0.2s, width 0.25s;
          padding: 0;
        }

        .gallery-dot.active {
          background: #fff;
          width: 16px;
          border-radius: 999px;
          transform: scale(1.02);
        }

        .product-card-body {
          padding: 1.1rem 1.1rem 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .product-kicker {
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .product-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.22rem;
          font-weight: 600;
          line-height: 1.3;
          color: var(--text-primary);
          transition: color 0.25s;
        }

        .product-card:hover .product-title {
          color: var(--accent);
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
          font-size: 1.08rem;
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
          font-weight: 700;
          color: var(--accent-dark);
          background: rgba(196, 137, 90, 0.1);
          padding: 2px 7px;
          border-radius: 5px;
          display: inline-block;
          animation: discountPulse 2.6s ease-in-out infinite;
        }

        @keyframes discountPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }

        .product-option-row {
          display: grid;
          gap: 0.6rem;
        }

        .product-select-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .product-meta-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          width: auto;
          flex: 0 0 auto;
          letter-spacing: 0.02em;
          margin-right: 2px;
          white-space: nowrap;
        }

        .product-select {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--bg-primary);
          color: var(--text-primary);
          padding: 0.62rem 0.9rem;
          font-size: 0.8rem;
          font-weight: 600;
          line-height: 1.2;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          background-image: linear-gradient(45deg, transparent 50%, var(--text-secondary) 50%), linear-gradient(135deg, var(--text-secondary) 50%, transparent 50%);
          background-position: calc(100% - 16px) calc(50% - 2px), calc(100% - 10px) calc(50% - 2px);
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
        }

        .product-select:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(196, 137, 90, 0.15);
        }

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
          transition: transform 0.25s, box-shadow 0.25s, background 0.35s;
        }

        .add-to-cart::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
          opacity: 0;
          transition: opacity 0.3s;
        }

        .add-to-cart:hover::before {
          opacity: 1;
        }

        .add-to-cart:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 26px rgba(196, 137, 90, 0.28);
        }

        .add-to-cart span {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .add-to-cart.state-flash {
          background: linear-gradient(135deg, #34D399, #0EA572);
          box-shadow: 0 8px 22px rgba(16,163,107,0.3);
        }

        .add-to-cart.state-flash::before { display: none; }

        .add-to-cart.state-in-cart {
          background: linear-gradient(135deg, #E8A0BF, #C4895A);
          box-shadow: 0 8px 22px rgba(196,137,90,0.28);
        }

        .add-to-cart.state-in-cart::before { display: none; }

        .add-to-cart.state-in-cart:hover {
          box-shadow: 0 14px 30px rgba(196,137,90,0.38);
        }

        @media (max-width: 640px) {
          .product-card-body {
            padding: 1rem;
          }
        }
      `}</style>

      <div className="product-card-glow" />

      <div className="product-card-media">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeImageSrc}
            style={{ position: "absolute", inset: 0 }}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <ImageFrame
              src={activeImageSrc}
              alt={productName}
              sizes="(max-width: 768px) 100vw, (max-width: 1180px) 33vw, 25vw"
              imgClassName="product-card-image"
              loading="lazy"
              priority={false}
            />
          </motion.div>
        </AnimatePresence>

        <div className="media-vignette" />
        <div className="product-shimmer" />

        <div className="product-card-overlay">
          <span className="product-badge">{product.category}</span>

          <div className="product-actions">
            <IconButton
              label={wished ? "Remove from wishlist" : "Add to wishlist"}
              active={wished}
              onClick={handleWishlistToggle}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </IconButton>
          </div>
        </div>

        {gallery.length > 1 && (
          <div className="product-card-nav">
            <button type="button" onClick={() => cycleImage(-1)} aria-label="Previous image">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button type="button" onClick={() => cycleImage(1)} aria-label="Next image">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}

        {gallery.length > 1 && (
          <div className="gallery-dots" aria-label="Product image selector">
            {gallery.map((image, index) => (
              <button
                key={image || index}
                type="button"
                className={`gallery-dot ${activeImage === index ? "active" : ""}`}
                onMouseEnter={() => setActiveImage(index)}
                onClick={() => setActiveImage(index)}
                aria-label={`View image ${index + 1}`}
                aria-pressed={activeImage === index}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-card-body">
        <div className="product-kicker">{product.category}</div>
        <h3 className="product-title">{productName}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-price-row" aria-label="Price">
          <span className="product-price">₦{Number(product.price).toLocaleString()}</span>
          {hasDiscount && (
            <>
              <span className="product-original-price">₦{Number(product.originalPrice).toLocaleString()}</span>
              <span className="product-discount-tag">Save ₦{(Number(product.originalPrice) - Number(product.price)).toLocaleString()}</span>
            </>
          )}
        </div>

        <div className="product-option-row">
          {!!colorOptions.length && (
            <div className="product-select-group" aria-label="Choose color">
              <label className="product-meta-label" htmlFor={`color-${product.id}`}>Color</label>
              <select
                id={`color-${product.id}`}
                className="product-select"
                value={selectedColor ?? ""}
                onChange={(event) => setSelectedColor(event.target.value || null)}
              >
                <option value="">Select Color</option>
                {colorOptions.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(hasSizes || hasStyles) && (
            <div className="product-select-group" aria-label="Choose size or style">
              <label className="product-meta-label" htmlFor={`size-${product.id}`}>
                {hasSizes ? "Size" : "Style"}
              </label>
              <select
                id={`size-${product.id}`}
                className="product-select"
                value={hasSizes ? (selectedSize ?? "") : (selectedStyle ?? "")}
                onChange={(event) => {
                  if (hasSizes) {
                    setSelectedSize(event.target.value || null);
                  } else {
                    setSelectedStyle(event.target.value || null);
                  }
                }}
              >
                <option value="">{hasSizes ? "Select Size" : "Select Style"}</option>
                {sizeOptionsList.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="product-card-footer">
          <motion.button
            type="button"
            className={`add-to-cart ${isFlash ? "state-flash" : isInCart ? "state-in-cart" : ""}`}
            onClick={handleAddToCart}
            whileTap={{ scale: 0.98 }}
          >
            <span>
              {isFlash ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Added ✓
                </>
              ) : isInCart ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Go to Cart
                </>
              ) : (
                "Add to Cart"
              )}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}