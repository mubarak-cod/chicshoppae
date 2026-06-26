"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const tabs = ["New Arrivals", "Best Sellers", "Staff Picks"];

const products = {
  "New Arrivals": [
    { id: "keila-gown", name: "Keila Gown", price: 10000, originalPrice: 6500, category: "Dresses", badge: "New", badgeColor: "#E8A0BF", description: "Elegant wrap silhouette with a flattering waist tie and fluid movement. It works from daytime occasions to evening plans.", images: ["https://res.cloudinary.com/ddlnqthao/image/upload/v1782123347/IMG-20260618-WA0165_vlmd9l.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782123348/IMG-20260618-WA0161_cqbhkd.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782123349/IMG-20260618-WA0166_ijg8ym.jpg"], colors: ["Black","Butter-yellow","Red","Baby-pink","White"], sizes: ["6","8","10","12","14"] },
    { id: "tinkle-top", name: "Tinkle Top", price: 4500, originalPrice: 2500, category: "Tops", badge: "New", badgeColor: "#E8A0BF", description: "A playful and feminine top with a unique design element. Perfect for adding a touch of whimsy to any outfit.", images: ["https://res.cloudinary.com/ddlnqthao/image/upload/v1782123333/IMG-20260618-WA0126_tmkqmo.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782123333/IMG-20260618-WA0125_edvep6.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782123332/IMG-20260618-WA0129_mgsrt1.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782123332/IMG-20260618-WA0128_ejrqaw.jpg"], colors: ["Black","light-pink","Brown","White"], sizes: ["8","10","12"] },
    { id: "maryann", name: "Maryann", price: 5500, originalPrice: 3000, category: "Tops", badge: "New", badgeColor: "#E8A0BF", description: "Minimal silky top designed to layer beautifully with denim and skirts. The fit is soft, clean, and easy to style.", images: ["https://res.cloudinary.com/ddlnqthao/image/upload/v1782191400/IMG-20260618-WA0079_1_mkgx1l.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782191398/IMG-20260618-WA0078_2_k7uyhy.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782191398/IMG-20260618-WA0081_1_ajfmk6.jpg"], colors: ["Black","pinky-white","yellow","White"], sizes: ["8","10","12","14"] },
    { id: "pearl-top", name: "Pearl Top", price: 6000, originalPrice: 3000, category: "Tops", badge: "Hot", badgeColor: "#F4A261", description: "Breathable linen top cut for comfort and clean lines. They pair easily with trousers and lightweight gowns.", images: ["https://res.cloudinary.com/ddlnqthao/image/upload/v1782244905/IMG-20260618-WA0162_lr5cgs.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782244903/IMG-20260618-WA0160_ripvgs.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782244902/IMG-20260618-WA0164_vgl5p4.jpg"], colors: ["Red","Mint-Green","light-pink","White"], sizes: ["6","8","10","12","14"] },
    { id: "top-nilda", name: "Top Nilda", price: 5000, originalPrice: 2500, category: "Tops", badge: "", badgeColor: "", description: "A compact top with a clean silhouette and polished hardware. It is sized for essentials and styled for impact.", images: ["https://res.cloudinary.com/ddlnqthao/image/upload/v1782123339/IMG-20260618-WA0168_ialuew.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782123340/IMG-20260618-WA0169_ycitkr.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782123342/IMG-20260618-WA0141_fjbo13.jpg"], colors: ["Black","pink","Brown","Nude","light-pink","lilac","light-blue","blue","White"], sizes: ["10","12","14"] },
    { id: "ivy-set", name: "Ivy Set", price: 9500, originalPrice: 4500, category: "Sets", badge: "🔥", badgeColor: "#F4A261", description: "A lightweight silk top that adds beauty outfits.", images: ["https://res.cloudinary.com/ddlnqthao/image/upload/v1782191361/IMG-20260618-WA0110_1_lozrom.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782337487/IMG-20260618-WA0112_rudqyz.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782337487/IMG-20260618-WA0109_w8eqdb.jpg"], colors: ["light-blue","brown"], sizes: ["8","10","12","14"] },
  ],
  "Best Sellers": [
    { id: "sheilia-gown", name: "Sheilia Gown", price: 9500, originalPrice: 5000, category: "Co-ords", badge: "Top Pick", badgeColor: "#C084FC", description: "Tailored two-piece set with a soft structured finish for polished everyday wear.", images: ["https://res.cloudinary.com/ddlnqthao/image/upload/v1782123347/IMG-20260618-WA0152_nmtjhf.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782123346/IMG-20260618-WA0156_mooamz.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782123345/IMG-20260618-WA0153_g8dnp2.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782123344/IMG-20260618-WA0154_uqb7p1.jpg"], colors: ["light-blue","black","Red","White"], sizes: ["6","8","10","12","14"] },
    { id: "lily-jumpsuit", name: "Lily Jumpsuit", price: 10000, originalPrice: 4500, category: "Dresses", badge: "Top Pick", badgeColor: "#C084FC", description: "High-shine satin skirt with a graceful drape and elevated finish.", images: ["https://res.cloudinary.com/ddlnqthao/image/upload/v1782191396/IMG-20260618-WA0076_1_zjnrqz.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782191395/IMG-20260618-WA0073_1_hwrhbb.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782191395/IMG-20260618-WA0075_1_y7wok3.jpg"], colors: ["Black","Brown","pink","light-pink"], sizes: ["8","10","12","14"] },
    { id: "brazil-hailer-top", name: "Brazil Halter Top", price: 5000, originalPrice: 3000, category: "Tops", badge: "Top Pick", badgeColor: "#C084FC", description: "A sculpted top that frames the body with a structured yet soft feel.", images: ["https://res.cloudinary.com/ddlnqthao/image/upload/v1782191371/IMG-20260618-WA0101_1_clhxvj.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782191371/IMG-20260618-WA0103_1_wyy0nk.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782191369/IMG-20260618-WA0102_1_gjkwbl.jpg"], colors: ["Black","Green","yellow"], sizes: ["6","8","10","12","14"] },
    { id: "stripe-pant", name: "Stripe Pant", price: 9500, originalPrice: 6000, category: "Pants", badge: "", badgeColor: "", description: "A soft knit pant. It layers well over dresses, tanks, and tops.", images: ["https://res.cloudinary.com/ddlnqthao/image/upload/v1782191389/IMG-20260618-WA0059_1_go3dj9.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782191388/IMG-20260618-WA0061_1_sfoapf.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782191387/IMG-20260618-WA0060_1_ocgvvy.jpg"], colors: ["Black","Green","Red","pink","Brown","light-blue","White"], sizes: ["10","12","14"] },
  ],
  "Staff Picks": [
    { id: "top-lucy", name: "Top Lucy", price: 5000, originalPrice: 2500, category: "Tops", badge: "Staff ♥", badgeColor: "#F472B6", description: "A nice top with a sculptural feel. It is designed to feel modern and collectible.", images: ["https://res.cloudinary.com/ddlnqthao/image/upload/v1782249989/IMG-20260618-WA0021_zsasi0.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782249990/IMG-20260618-WA0024_gd0lyt.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782249994/IMG-20260618-WA0023_yokg3b.jpg"], colors: ["Black","light-blue","pink","Red","blue","nude","lilac","Beige","White"], sizes: ["8","10","12","14","16"] },
    { id: "spiral-halter-top", name: "Spiral Halter Top", price: 5500, originalPrice: 3000, category: "Tops", badge: "Staff ♥", badgeColor: "#F472B6", description: "A delicate top with lace-inspired texture and a sleek fit.", images: ["https://res.cloudinary.com/ddlnqthao/image/upload/v1782249989/IMG-20260618-WA0025_mfjmfd.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782249989/IMG-20260618-WA0026_tysdvi.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782249989/IMG-20260618-WA0028_qk7xke.jpg"], colors: ["Black","Green","Red","cream","orange","White","wine","blue","light-blue","lilac"], sizes: ["8","10","12","14"] },
    { id: "diva-halter", name: "Dilva Halter", price: 6000, originalPrice: 3000, category: "Dresses", badge: "Staff ♥", badgeColor: "#F472B6", description: "A refined midi dress with a smooth shape and polished movement.", images: ["https://res.cloudinary.com/ddlnqthao/image/upload/v1782249988/IMG-20260618-WA0029_tndyfd.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782249988/IMG-20260618-WA0031_v6jt5h.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782249988/IMG-20260618-WA0030_cz6udm.jpg"], colors: ["Black","Green","Red","Leopard-print","lilac","White","cream","light-blue","blue","nude"], sizes: ["8","10","12"] },
    { id: "top-lianah", name: "Top Lianah", price: 4500, originalPrice: 2000, category: "Tops", badge: "Staff ♥", badgeColor: "#F472B6", description: "A relaxed top designed for effortless dressing and repeat wear.", images: ["https://res.cloudinary.com/ddlnqthao/image/upload/v1782249996/IMG-20260618-WA0145_1_nilwsn.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782249995/IMG-20260618-WA0148_1_gzoolk.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782249995/IMG-20260618-WA0144_1_v4nja0.jpg","https://res.cloudinary.com/ddlnqthao/image/upload/v1782249995/IMG-20260618-WA0150_1_ih1twk.jpg"], colors: ["Black","light-pink","pink","Brown","nude","White"], sizes: ["8","10","12","14"] },
  ],
};

/* ═══════════════════════════════
   QUICK VIEW MODAL
═══════════════════════════════ */
function QuickView({ product, onClose }) {
  const router = useRouter();
  const { addToCart, cartItems } = useCart();
  const [imgIndex, setImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [justAdded, setJustAdded] = useState(false);
  const touchStartX = useRef(null);
  const inCart = cartItems?.some((i) => i.id === product.id);

  // close on ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const prevImg = () => setImgIndex((i) => (i - 1 + product.images.length) % product.images.length);
  const nextImg = () => setImgIndex((i) => (i + 1) % product.images.length);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? nextImg() : prevImg();
    touchStartX.current = null;
  };

  const handleAdd = () => {
    addToCart({ ...product, selectedColor, selectedSize });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleButtonClick = () => {
    if (inCart) {
      onClose();
      router.push("/cart");
      return;
    }
    handleAdd();
  };

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <style>{`
        .qv-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(18,16,14,0.65);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
          animation: qvFadeIn 0.25s ease;
        }
        @keyframes qvFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .qv-modal {
          background: var(--bg-card, #FDFAF5);
          border-radius: 24px;
          width: 100%;
          max-width: 860px;
          max-height: 92vh;
          overflow-y: auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          animation: qvSlideUp 0.3s cubic-bezier(0.22,1,0.36,1);
          box-shadow: 0 32px 80px rgba(0,0,0,0.22);
        }
        @keyframes qvSlideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .qv-close {
          position: absolute; top: 14px; right: 14px; z-index: 5;
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--bg-secondary, #EDE8DE);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-primary); transition: background 0.2s, transform 0.2s;
        }
        .qv-close:hover { background: var(--border); transform: scale(1.08); }

        /* ── IMAGE SIDE ── */
        .qv-img-side {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          border-radius: 24px 0 0 24px;
          background: var(--bg-secondary, #EDE8DE);
          user-select: none;
        }

        .qv-img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          transition: opacity 0.25s;
        }

        .qv-img-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(253,250,245,0.9); backdrop-filter: blur(6px);
          border: none; cursor: pointer; z-index: 3;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-primary); transition: background 0.2s, transform 0.2s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
        .qv-img-arrow:hover { background: #fff; transform: translateY(-50%) scale(1.08); }
        .qv-img-arrow--left { left: 10px; }
        .qv-img-arrow--right { right: 10px; }

        .qv-img-dots {
          position: absolute; bottom: 12px; left: 50%;
          transform: translateX(-50%);
          display: flex; gap: 5px; z-index: 3;
        }
        .qv-img-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.5); border: none; cursor: pointer;
          padding: 0; transition: background 0.2s, transform 0.2s;
        }
        .qv-img-dot.active { background: #fff; transform: scale(1.35); }

        /* ── INFO SIDE ── */
        .qv-info {
          padding: 2rem 1.75rem;
          display: flex; flex-direction: column; gap: 1rem;
          overflow-y: auto;
        }

        .qv-cat {
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-muted, #9E9890);
        }

        .qv-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 3vw, 30px); font-weight: 600;
          color: var(--text-primary); line-height: 1.15;
        }

        .qv-price-row { display: flex; align-items: baseline; gap: 10px; }
        .qv-price { font-size: 20px; font-weight: 700; color: var(--text-primary); }
        .qv-price-og { font-size: 14px; color: var(--text-muted); text-decoration: line-through; }
        .qv-discount {
          font-size: 11px; font-weight: 600; padding: 3px 8px;
          border-radius: 5px; background: rgba(196,137,90,0.12); color: #C4895A;
        }

        .qv-desc { font-size: 13.5px; line-height: 1.7; color: var(--text-secondary); }

        .qv-divider { border: none; border-top: 0.5px solid var(--border, rgba(26,23,20,0.12)); }

        .qv-label {
          font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text-secondary); margin-bottom: 0.5rem; font-weight: 500;
        }

        /* ── COLORS ── */
        .qv-colors { display: flex; flex-wrap: wrap; gap: 6px; }

        .qv-color-btn {
          padding: 6px 13px; border-radius: 999px;
          border: 1.5px solid var(--border, rgba(26,23,20,0.15));
          background: var(--bg-primary); color: var(--text-primary);
          font-size: 11.5px; cursor: pointer;
          transition: border-color 0.2s, background 0.2s, color 0.2s, transform 0.15s;
          font-family: 'Inter', sans-serif;
          text-transform: capitalize;
        }
        .qv-color-btn:hover { border-color: var(--text-primary); transform: scale(1.03); }
        .qv-color-btn.selected {
          background: var(--text-primary); color: var(--bg-primary);
          border-color: var(--text-primary);
        }

        /* ── SIZES ── */
        .qv-sizes { display: flex; flex-wrap: wrap; gap: 6px; }

        .qv-size-btn {
          width: 44px; height: 44px; border-radius: 10px;
          border: 1.5px solid var(--border, rgba(26,23,20,0.15));
          background: var(--bg-primary); color: var(--text-primary);
          font-size: 13px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s, background 0.2s, color 0.2s, transform 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .qv-size-btn:hover { border-color: var(--text-primary); transform: scale(1.05); }
        .qv-size-btn.selected {
          background: var(--text-primary); color: var(--bg-primary);
          border-color: var(--text-primary);
        }

        /* ── CTA ── */
        .qv-add-btn {
          width: 100%; padding: 14px; border-radius: 999px;
          border: none; font-size: 13px; font-weight: 700;
          letter-spacing: 0.05em; text-transform: uppercase;
          cursor: pointer; position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.25s, box-shadow 0.25s, background 0.3s;
          font-family: 'Inter', sans-serif;
        }
        .qv-add-btn.default {
          background: var(--text-primary, #1A1714);
          color: var(--bg-primary, #FDFAF5);
        }
        .qv-add-btn.default::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, #E8A0BF, #C4895A);
          opacity: 0; transition: opacity 0.3s;
        }
        .qv-add-btn.default:hover::before { opacity: 1; }
        .qv-add-btn.default:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(196,137,90,0.3); }
        .qv-add-btn span { position: relative; z-index: 1; display: flex; align-items: center; gap: 7px; }

        .qv-add-btn.added {
          background: linear-gradient(135deg, #34D399, #0EA572);
          color: #fff;
          box-shadow: 0 10px 26px rgba(16,163,107,0.35);
        }
        .qv-add-btn.in-cart {
          background: var(--bg-secondary); color: var(--text-primary);
          border: 1.5px solid rgba(196,137,90,0.35);
        }

        .qv-full-link {
          text-align: center; font-size: 12px; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--text-muted);
          text-decoration: none; transition: color 0.2s;
        }
        .qv-full-link:hover { color: var(--text-primary); }

        /* ── RESPONSIVE ── */
        @media (max-width: 640px) {
          .qv-modal {
            grid-template-columns: 1fr;
            max-height: 96vh;
            border-radius: 20px 20px 0 0;
            margin-top: auto;
            align-self: flex-end;
          }
          .qv-img-side { border-radius: 20px 20px 0 0; aspect-ratio: 4/3; }
          .qv-info { padding: 1.25rem 1.25rem 2rem; }
        }
      `}</style>

      <div className="qv-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="qv-modal">
          <button className="qv-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Image */}
          <div
            className="qv-img-side"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img src={product.images[imgIndex]} alt={product.name} className="qv-img" />

            {product.images.length > 1 && (
              <>
                <button className="qv-img-arrow qv-img-arrow--left" onClick={prevImg} aria-label="Previous image">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <button className="qv-img-arrow qv-img-arrow--right" onClick={nextImg} aria-label="Next image">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                <div className="qv-img-dots">
                  {product.images.map((_, i) => (
                    <button key={i} className={`qv-img-dot ${i === imgIndex ? "active" : ""}`} onClick={() => setImgIndex(i)} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div className="qv-info">
            <div>
              <span className="qv-cat">{product.category}</span>
              <h2 className="qv-name">{product.name}</h2>
            </div>

            <div className="qv-price-row">
              <span className="qv-price">₦{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="qv-price-og">₦{product.originalPrice.toLocaleString()}</span>
                  <span className="qv-discount">-{discount}%</span>
                </>
              )}
            </div>

            <p className="qv-desc">{product.description}</p>

            <hr className="qv-divider" />

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="qv-label">
                  Colour — <span style={{ color: "var(--text-primary)", textTransform: "capitalize" }}>{selectedColor}</span>
                </p>
                <div className="qv-colors">
                  {product.colors.filter(Boolean).map((c) => (
                    <button
                      key={c}
                      className={`qv-color-btn ${selectedColor === c ? "selected" : ""}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="qv-label">Size {selectedSize && `— ${selectedSize}`}</p>
                <div className="qv-sizes">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`qv-size-btn ${selectedSize === s ? "selected" : ""}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              className={`qv-add-btn ${justAdded ? "added" : inCart ? "in-cart" : "default"}`}
              onClick={handleButtonClick}
              disabled={justAdded}
            >
              {justAdded ? (
                <span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Added to Cart ✓
                </span>
              ) : inCart ? (
                <span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  Go to Cart
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </span>
              ) : (
                <span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  Add to Cart
                </span>
              )}
            </button>

            <Link href={`/product/${product.id}`} className="qv-full-link" onClick={onClose}>
              View full details →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════
   INTERSECTION OBSERVER HOOK
═══════════════════════════════ */
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

/* ═══════════════════════════════
   PRODUCT CARD
═══════════════════════════════ */
function ProductCard({ product, index, onQuickView }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [wished, setWished] = useState(false);
  const [ref, inView] = useInView();
  const { cartItems } = useCart();
  const inCart = cartItems?.some((i) => i.id === product.id);

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
          background: var(--bg-card, #FDFAF5); border-radius: 16px; overflow: hidden;
          border: 0.5px solid var(--border, rgba(26,23,20,0.12));
          transition: box-shadow 0.35s cubic-bezier(0.22,1,0.36,1), transform 0.35s cubic-bezier(0.22,1,0.36,1);
          position: relative; display: flex; flex-direction: column;
        }
        .fp-card:hover { box-shadow: 0 12px 48px rgba(196,137,90,0.13), 0 2px 8px rgba(0,0,0,0.06); transform: translateY(-5px); }

        .fp-img-wrap { position: relative; aspect-ratio: 3/4; overflow: hidden; background: var(--bg-secondary, #EDE8DE); cursor: pointer; }
        .fp-img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .fp-card:hover .fp-img { transform: scale(1.06); }

        .fp-img-dots { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px; opacity: 0; transition: opacity 0.3s; z-index: 4; }
        .fp-card:hover .fp-img-dots { opacity: 1; }
        .fp-img-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.5); cursor: pointer; transition: background 0.2s, transform 0.2s; border: none; padding: 0; }
        .fp-img-dot.active { background: #fff; transform: scale(1.3); }

        .fp-badge { position: absolute; top: 10px; left: 10px; padding: 4px 10px; border-radius: 999px; font-size: 9.5px; font-weight: 500; letter-spacing: 0.08em; z-index: 3; font-family: 'Inter', sans-serif; }
        .fp-incart-tag { position: absolute; top: 10px; left: 10px; padding: 4px 10px; border-radius: 999px; font-size: 9.5px; font-weight: 600; z-index: 3; background: linear-gradient(135deg, #E8A0BF, #C4895A); color: #fff; display: flex; align-items: center; gap: 4px; }

        .fp-wish { position: absolute; top: 8px; right: 8px; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.88); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 3; transform: scale(0.8); opacity: 0; transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s, background 0.2s; backdrop-filter: blur(4px); }
        .fp-card:hover .fp-wish { transform: scale(1); opacity: 1; }
        .fp-wish.wished { background: #FFF0F5; transform: scale(1) !important; opacity: 1 !important; }

        /* Quick view overlay that appears on hover */
        .fp-qv-overlay {
          position: absolute; inset: 0; z-index: 4;
          display: flex; align-items: flex-end;
          padding: 0 0 12px;
          pointer-events: none;
        }
        .fp-qv-btn {
          width: calc(100% - 24px); margin: 0 12px;
          padding: 10px; border-radius: 8px; border: none;
          background: rgba(253,250,245,0.96); backdrop-filter: blur(8px);
          font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
          font-weight: 600; font-family: 'Inter', sans-serif;
          cursor: pointer; color: var(--text-primary, #1A1714);
          transform: translateY(8px); opacity: 0;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s;
          pointer-events: auto;
          border-top: 0.5px solid rgba(26,23,20,0.08);
        }
        .fp-card:hover .fp-qv-btn { transform: translateY(0); opacity: 1; }
        .fp-qv-btn:hover { background: #fff; }

        .fp-info { padding: 0.9rem 1rem 1rem; display: flex; flex-direction: column; gap: 3px; flex: 1; }
        .fp-cat { font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-muted, #9E9890); }
        .fp-name { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 500; color: var(--text-primary, #1A1714); line-height: 1.25; text-decoration: none; display: block; cursor: pointer; transition: color 0.2s; }
        .fp-name:hover { color: var(--accent, #C4895A); }
        .fp-price-row { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
        .fp-price { font-size: 14.5px; font-weight: 500; color: var(--text-primary, #1A1714); }
        .fp-price-og { font-size: 12px; color: var(--text-muted, #9E9890); text-decoration: line-through; }
      `}</style>

      <div className="fp-card">
        <div className="fp-img-wrap" onClick={() => onQuickView(product)}>
          {product.images?.[imgIndex] && (
            <img src={product.images[imgIndex]} alt={product.name} className="fp-img" loading="lazy" />
          )}

          {product.images?.length > 1 && (
            <div className="fp-img-dots">
              {product.images.map((_, i) => (
                <button key={i} className={`fp-img-dot ${i === imgIndex ? "active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setImgIndex(i); }} />
              ))}
            </div>
          )}

          {inCart ? (
            <span className="fp-incart-tag">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              In Cart
            </span>
          ) : product.badge ? (
            <span className="fp-badge" style={{ background: product.badgeColor || "#E8A0BF", color: "#fff" }}>{product.badge}</span>
          ) : null}

          <button className={`fp-wish ${wished ? "wished" : ""}`}
            onClick={(e) => { e.stopPropagation(); setWished(!wished); }} aria-label="Wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? "#F472B6" : "none"} stroke={wished ? "#F472B6" : "#1A1714"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          <div className="fp-qv-overlay">
            <button className="fp-qv-btn" onClick={(e) => { e.stopPropagation(); onQuickView(product); }}>
              Quick View
            </button>
          </div>
        </div>

        <div className="fp-info">
          <span className="fp-cat">{product.category}</span>
          <span className="fp-name" onClick={() => onQuickView(product)}>{product.name}</span>
          <div className="fp-price-row">
            <span className="fp-price">₦{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="fp-price-og">₦{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   FEATURED PRODUCTS SECTION
═══════════════════════════════ */
export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("New Arrivals");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [sectionRef, sectionInView] = useInView(0.1);

  return (
    <>
      <style>{`
        .fp-section { padding: 5rem 0; border-top: 0.5px solid var(--border, rgba(26,23,20,0.12)); background: var(--bg-primary, #F5F0E8); overflow: hidden; }
        .fp-container { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }
        .fp-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2.5rem; gap: 1.5rem; flex-wrap: wrap; }
        .fp-header-left { display: flex; flex-direction: column; gap: 1.2rem; }
        .fp-tabs { display: flex; background: var(--bg-secondary, #EDE8DE); border-radius: 10px; padding: 4px; border: 0.5px solid var(--border, rgba(26,23,20,0.12)); width: fit-content; }
        .fp-tab { padding: 8px 18px; border-radius: 7px; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 400; font-family: 'Inter', sans-serif; cursor: pointer; border: none; background: transparent; color: var(--text-secondary, #6B6560); transition: background 0.25s, color 0.25s, box-shadow 0.25s; white-space: nowrap; position: relative; }
        .fp-tab.active { background: var(--bg-card, #FDFAF5); color: var(--text-primary, #1A1714); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .fp-tab::after { content: ''; position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%) scaleX(0); width: 20px; height: 2px; border-radius: 2px; background: linear-gradient(90deg, #E8A0BF, #C4895A); transition: transform 0.3s cubic-bezier(0.22,1,0.36,1); }
        .fp-tab.active::after { transform: translateX(-50%) scaleX(1); }
        .fp-see-all { display: flex; align-items: center; gap: 5px; font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary, #6B6560); text-decoration: none; transition: color 0.2s, gap 0.2s; padding-top: 6px; white-space: nowrap; }
        .fp-see-all:hover { color: var(--text-primary, #1A1714); gap: 9px; }
        .fp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
        .fp-divider { display: flex; align-items: center; gap: 1rem; margin-bottom: 2.5rem; }
        .fp-divider-line { flex: 1; height: 0.5px; background: linear-gradient(90deg, transparent, #E8A0BF44, transparent); }
        .fp-divider-dot { width: 6px; height: 6px; border-radius: 50%; background: linear-gradient(135deg, #E8A0BF, #C4895A); }
        @media (max-width: 768px) {
          .fp-section { padding: 3.5rem 0; }
          .fp-grid { grid-template-columns: repeat(2, 1fr); gap: 0.875rem; }
          .fp-header { flex-direction: column; gap: 1rem; }
          .fp-tabs { width: 100%; }
          .fp-tab { flex: 1; text-align: center; padding: 8px 10px; font-size: 10.5px; }
        }
        @media (max-width: 480px) {
          .fp-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          .fp-container { padding: 0 1rem; }
          .fp-tab { font-size: 9.5px; padding: 7px 8px; }
        }
      `}</style>

      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      <section className="fp-section" ref={sectionRef}>
        <div className="fp-container">
          <div className="fp-header" style={{ opacity: sectionInView ? 1 : 0, transform: sectionInView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)" }}>
            <div className="fp-header-left">
              <div>
                <span className="section-eyebrow" style={{ background: "linear-gradient(90deg,#E8A0BF,#C4895A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Handpicked for You</span>
                <h2 className="section-title">Our Favourites</h2>
              </div>
              <div className="fp-tabs">
                {tabs.map((tab) => (
                  <button key={tab} className={`fp-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>
                ))}
              </div>
            </div>
            <Link href="/shop" className="fp-see-all">
              See all
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>

          <div className="fp-divider">
            <div className="fp-divider-line" />
            <div className="fp-divider-dot" />
            <div className="fp-divider-line" />
          </div>

          <div className="fp-grid">
            {products[activeTab].map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}