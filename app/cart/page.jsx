"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, subtotal, shipping, discount, total, updateQuantity, removeFromCart } = useCart();

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
          margin-bottom: 1.25rem;
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

        .cart-item p,
        .cart-meta {
          color: var(--text-secondary);
          line-height: 1.6;
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
        }

        .qty-button {
          width: 34px;
          height: 34px;
        }

        .remove-button {
          padding: 8px 12px;
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

        @media (max-width: 960px) {
          .cart-layout { grid-template-columns: 1fr; }
          .cart-summary { position: static; }
        }

        @media (max-width: 640px) {
          .cart-item { grid-template-columns: 1fr; }
          .cart-image { width: 100%; max-width: 220px; }
        }
      `}</style>

      <div className="cart-layout">
        <div className="cart-panel">
          <h1 className="cart-title">Your Cart</h1>
          <p className="cart-subtitle">Review your selections before proceeding to checkout.</p>

          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty right now.</p>
              <Link href="/shop" className="summary-button summary-button--primary" style={{ marginTop: "1rem" }}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <article key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="cart-item">
                <div className="cart-image">
                  <img src={item.images?.[0]} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <div className="cart-meta">Color: {item.selectedColor || "N/A"}</div>
                  <div className="cart-meta">Size: {item.selectedSize || "One size"}</div>
                  <div className="cart-meta">₦{item.price.toLocaleString()}</div>
                  <div className="cart-actions">
                    <button className="qty-button" type="button" onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedSize)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="qty-button" type="button" onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedSize)}>+</button>
                    <button className="remove-button" type="button" onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}>Remove</button>
                  </div>
                </div>
                <div className="cart-meta" style={{ textAlign: "right" }}>
                  ₦{(item.price * item.quantity).toLocaleString()}
                </div>
              </article>
            ))
          )}
        </div>

        <aside className="cart-summary">
          <h2 className="cart-title" style={{ fontSize: "2rem" }}>Summary</h2>
          <div className="summary-line"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
          <div className="summary-line"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₦${shipping.toLocaleString()}`}</span></div>
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