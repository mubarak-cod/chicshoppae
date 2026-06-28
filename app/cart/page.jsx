"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "@/context/CartContext";

function getColorKey(color) {
  if (!color) return "";
  return String(color).toLowerCase();
}

function pickPreviewImage(item) {
  const images = (item.images || []).filter(Boolean);
  return images[0] || "/images/one.jpg";
}

export default function CartPage() {
  const {
    cartItems,
    subtotal,
    discount,
    total,
    updateQuantity,
    removeFromCart,
    updateCartItemColor,
  } = useCart();

  const itemCount = useMemo(
    () => cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems]
  );

  return (
    <section className="cart-page">
      <style>{`
        .cart-page {
          padding: clamp(1.25rem, 3vw, 2.5rem) clamp(1rem, 4vw, 3rem) 4rem;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.6fr) minmax(320px, 0.9fr);
          gap: 1.5rem;
          align-items: start;
        }

        .cart-panel,
        .cart-summary {
          border: 1px solid var(--border);
          border-radius: 28px;
          background: var(--bg-card);
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.04);
        }

        .cart-panel {
          padding: 1.25rem;
        }

        .cart-summary {
          padding: 1.25rem;
          position: sticky;
          top: 1.25rem;
        }

        .cart-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3vw, 3rem);
          color: var(--text-primary);
          margin-bottom: 0.45rem;
        }

        .cart-subtitle {
          color: var(--text-secondary);
          margin-bottom: 1.1rem;
        }

        .cart-count {
          color: var(--text-muted);
          margin-bottom: 1rem;
          font-size: 0.92rem;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 108px minmax(0, 1fr) auto;
          gap: 1rem;
          padding: 1rem 0;
          border-top: 1px solid var(--border);
        }

        .cart-item:first-of-type {
          border-top: none;
          padding-top: 0;
        }

        .cart-image {
          position: relative;
          width: 108px;
          aspect-ratio: 1 / 1.15;
          border-radius: 20px;
          overflow: hidden;
          background: rgba(0,0,0,0.03);
        }

        .cart-item h3 {
          font-size: 1rem;
          margin-bottom: 0.35rem;
        }

        .cart-meta {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .cart-price {
          font-weight: 700;
          color: var(--text-primary);
        }

        .cart-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-top: 0.8rem;
          flex-wrap: wrap;
        }

        .qty-button,
        .remove-button,
        .summary-button {
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg-primary);
          color: var(--text-primary);
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }

        .qty-button {
          width: 34px;
          height: 34px;
        }

        .qty-button:hover,
        .remove-button:hover,
        .summary-button:hover {
          transform: translateY(-1px);
          border-color: var(--border-hover);
        }

        .remove-button {
          padding: 8px 12px;
        }

        .shade-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 0.65rem;
        }

        .shade-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid var(--border);
          background: var(--bg-primary);
          color: var(--text-primary);
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 0.82rem;
          cursor: pointer;
        }

        .shade-button[aria-pressed="true"] {
          border-color: var(--text-primary);
          box-shadow: 0 0 0 1px var(--text-primary) inset;
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.55rem 0;
          color: var(--text-primary);
        }

        .summary-total {
          border-top: 1px solid var(--border);
          margin-top: 0.4rem;
          padding-top: 0.85rem;
          font-weight: 700;
          font-size: 1.05rem;
        }

        .summary-button {
          display: inline-flex;
          justify-content: center;
          width: 100%;
          padding: 13px 16px;
          margin-top: 1rem;
          text-decoration: none;
          font-weight: 700;
        }

        .summary-button--primary {
          background: var(--text-primary);
          color: var(--bg-primary);
          border-color: var(--text-primary);
        }

        .cart-empty {
          padding: 3rem 1rem;
          text-align: center;
          color: var(--text-secondary);
        }

        .cart-item-total {
          text-align: right;
          white-space: nowrap;
        }

        @media (max-width: 960px) {
          .cart-layout { grid-template-columns: 1fr; }
          .cart-summary { position: static; }
        }

        @media (max-width: 640px) {
          .cart-item { grid-template-columns: 1fr; }
          .cart-image { width: 100%; max-width: 240px; }
          .cart-item-total { text-align: left; }
        }
      `}</style>

      <div className="cart-layout">
        <div className="cart-panel">
          <h1 className="cart-title">Your Cart</h1>
          <p className="cart-subtitle">Review your selections before proceeding to checkout.</p>
          <div className="cart-count">{itemCount} item{itemCount === 1 ? "" : "s"} in cart</div>

          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty right now.</p>
              <Link href="/shop" className="summary-button summary-button--primary" style={{ marginTop: "1rem" }}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            cartItems.map((item) => {
              const previewImage = pickPreviewImage(item);
              return (
                <article key={`${item.id}-${getColorKey(item.selectedColor)}-${item.selectedSize || ""}`} className="cart-item">
                  <div className="cart-image">
                    <Image
                      src={previewImage}
                      alt={item.name || item.title || "Cart item"}
                      fill
                      sizes="(max-width: 640px) 80vw, 108px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div>
                    <h3>{item.name || item.title}</h3>
                    <div className="cart-meta">Category: {item.category}</div>
                    <div className="cart-meta">Color: {item.selectedColor || "N/A"}</div>
                    <div className="cart-meta">{item.sizes?.length ? "Size" : item.styles?.length ? "Style" : "Size"}: {item.selectedSize || "N/A"}</div>
                    <div className="cart-price">₦{Number(item.price).toLocaleString()}</div>

                    {!!item.colors?.length && (
                      <div className="shade-list" aria-label={`Change color for ${item.name || item.title}`}>
                        {item.colors.map((color) => {
                          const active = getColorKey(item.selectedColor) === getColorKey(color);
                          return (
                            <button
                              key={color}
                              type="button"
                              className="shade-button"
                              aria-pressed={active}
                              onClick={() => updateCartItemColor(item.id, item.selectedSize, item.selectedColor, color)}
                            >
                              {color}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="cart-actions">
                      <button className="qty-button" type="button" onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedSize)}>-</button>
                      <span>{item.quantity}</span>
                      <button className="qty-button" type="button" onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedSize)}>+</button>
                      <button className="remove-button" type="button" onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}>Remove</button>
                    </div>
                  </div>

                  <div className="cart-item-total cart-meta">
                    ₦{(Number(item.price) * item.quantity).toLocaleString()}
                  </div>
                </article>
              );
            })
          )}
        </div>

        <aside className="cart-summary">
          <h2 className="cart-title" style={{ fontSize: "2rem" }}>Summary</h2>
          <div className="summary-line"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
          <div className="summary-line"><span>Discount</span><span>{discount > 0 ? `-₦${discount.toLocaleString()}` : "₦0"}</span></div>
          <div className="summary-line summary-total"><span>Total</span><span>₦{total.toLocaleString()}</span></div>
          <Link href="/shop" className="summary-button">
            Continue Shopping
          </Link>
          <Link href="/checkout" className="summary-button summary-button--primary">
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}