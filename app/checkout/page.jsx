"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePaystackPayment } from "react-paystack";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  state: "",
  city: "",
  streetAddress: "",
  customerMessage: "",
};

const LAST_ORDER_STORAGE_KEY = "chic-shoppae-last-order";

function getColorKey(color) {
  if (!color) return "";
  if (typeof color === "string") return color.toLowerCase();
  return String(color.name || color.hex || "").toLowerCase();
}

function getColorLabel(color) {
  if (!color) return "N/A";
  if (typeof color === "string") return color;
  return color.name || color.hex || "N/A";
}

function getPreviewImage(item) {
  const images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  if (!images.length) return "/images/one.jpg";

  const colors = Array.isArray(item.colors) ? item.colors : [];
  const colorIndex = colors.findIndex((color) => getColorKey(color) === getColorKey(item.selectedColor));
  return images[(colorIndex < 0 ? 0 : colorIndex) % images.length] || images[0];
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString();
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, total } = useCart();
  const [form, setForm] = useState(initialForm);
  const [processing, setProcessing] = useState(false);

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  const orderItems = useMemo(
    () =>
      cartItems.map((item) => ({
        id: item.id,
        name: item.name || item.title,
        price: Number(item.price),
        subtotal: Number(item.price) * Number(item.quantity),
        quantity: item.quantity,
        color: getColorLabel(item.selectedColor),
        colorKey: getColorKey(item.selectedColor),
        size: item.selectedSize || "N/A",
        image: getPreviewImage(item),
      })),
    [cartItems]
  );

  const paystackConfig = {
    publicKey: publicKey || "",
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitOrder = async (reference) => {
    const verifyResponse = await fetch("/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        amount: total,
      }),
    });

    if (!verifyResponse.ok) {
      const error = await verifyResponse.json().catch(() => ({}));
      throw new Error(error?.error || "Payment verification failed.");
    }

    const verifyData = await verifyResponse.json();

    const emailResponse = await fetch("/api/send-order-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        customer: form,
        items: orderItems,
        total,
        customerMessage: form.customerMessage,
        payment: verifyData.payment,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.json().catch(() => ({}));
      throw new Error(error?.error || "Order email could not be sent.");
    }

    return verifyData;
  };

  const handlePay = () => {
    if (!cartItems.length) {
      toast.error("Your cart is empty.");
      return;
    }

    const requiredFields = ["fullName", "email", "phone", "country", "state", "city", "streetAddress"];
    const missingField = requiredFields.find((field) => !form[field].trim());

    if (missingField) {
      toast.error("Please fill in every delivery field before paying.");
      return;
    }

    if (!publicKey) {
      toast.error("Paystack public key is missing.");
      return;
    }

    const reference = `chic-${Date.now()}`;
    setProcessing(true);
    initializePayment({
      config: {
        email: form.email,
        amount: Math.round(Number(total) * 100),
        reference,
        currency: "NGN",
        metadata: {
          customer: form.fullName,
          phone: form.phone,
          address: `${form.streetAddress}, ${form.city}, ${form.state}, ${form.country}`,
          items: orderItems,
          customerMessage: form.customerMessage,
        },
      },
      onSuccess: async (response) => {
        try {
          const reference = response?.reference || response?.trxref || response?.trans || "";
          if (typeof window !== "undefined") {
            window.localStorage.setItem(
              LAST_ORDER_STORAGE_KEY,
              JSON.stringify({
                reference: reference || `chic-${Date.now()}`,
                customer: form,
                items: orderItems,
                total,
                customerMessage: form.customerMessage,
              })
            );
          }
          const verified = await submitOrder(reference);
          toast.success("Payment verified and order email sent.");
          router.push(`/order-success?reference=${encodeURIComponent(reference || verified?.payment?.reference || "")}`);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Checkout failed.");
        } finally {
          setProcessing(false);
        }
      },
      onClose: () => {
        setProcessing(false);
        toast.error("Payment popup closed before completion.");
      },
    });
  };

  return (
    <main className="checkout-page">
      <style>{`
        .checkout-page {
          padding: clamp(1.25rem, 3vw, 2.5rem) clamp(1rem, 4vw, 3rem) 4rem;
        }
                  <div className="order-image-wrap">
                    <Image
                      src={getPreviewImage(item)}
                      alt={item.name || item.title || "Product image"}
                      fill
                      sizes="96px"
                      className="order-image"
                    />
                  </div>
                  <div className="order-item-copy">
                    <h4>{item.name || item.title}</h4>
                    <p>Color: {getColorLabel(item.selectedColor)}</p>
                    <p>Size: {item.selectedSize || "N/A"}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>₦{formatCurrency(item.price)} each</p>
          gap: 1.5rem;
                  <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <p className="order-item-subtotal-label">Subtotal</p>
                    <div>₦{formatCurrency(Number(item.price) * item.quantity)}</div>

        .checkout-panel,
        .checkout-summary {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 28px;
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.04);

          <div className="checkout-field full" style={{ marginTop: "1rem" }}>
            <label htmlFor="customerMessage">Customer message</label>
            <textarea
              id="customerMessage"
              name="customerMessage"
              value={form.customerMessage}
              onChange={handleChange}
              placeholder="Tell us anything about your order (special requests, delivery instructions, preferred delivery time, etc.)"
              rows={5}
              style={{
                width: "100%",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                padding: "13px 14px",
                outline: "none",
                resize: "vertical",
                minHeight: "120px",
              }}
            />
          </div>

          <div className="whatsapp-section">
            <div className="whatsapp-copy">
              <span className="whatsapp-kicker">WhatsApp support</span>
              <h3>Send order details on WhatsApp after checkout.</h3>
              <p>We use your saved message and order summary to prepare a clean handoff for the store team.</p>
            </div>
            <button
              type="button"
              className="whatsapp-button"
              onClick={() => toast("Complete payment first, then continue on the confirmation page.")}
            >
              <span className="whatsapp-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.07-1.32A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.65 0-3.18-.46-4.5-1.25l-.32-.19-3.34.87.9-3.26-.21-.34A7.94 7.94 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.4-5.8c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.42-.55-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28z"/>
                </svg>
              </span>
              WhatsApp preview
            </button>
          </div>
        }

        .checkout-panel {
          padding: 1.3rem;
        }

        .checkout-summary {
          padding: 1.3rem;
          position: sticky;
          top: 1.25rem;
        }

        .checkout-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3vw, 3rem);
          color: var(--text-primary);
          margin-bottom: 0.45rem;
        }

        .checkout-copy {
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
        }

        .checkout-grid {
          display: grid;
          gap: 0.95rem;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .checkout-field {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .checkout-field.full {
          grid-column: 1 / -1;
        }

        .checkout-field label {
          font-size: 0.82rem;
          letter-spacing: 0.02em;
          color: var(--text-muted);
        }

        .checkout-field input {
          width: 100%;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: var(--bg-primary);
          color: var(--text-primary);
          padding: 13px 14px;
          outline: none;
        }

        .checkout-field input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(196, 137, 90, 0.12);
        }

        .summary-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }

        .order-list {
          display: grid;
          gap: 0.9rem;
          margin: 1rem 0;
          max-height: 360px;
          overflow: auto;
          padding-right: 0.15rem;
        }

        .order-item {
          padding: 0.85rem 0;
          border-top: 1px solid var(--border);
          display: grid;
          grid-template-columns: 84px minmax(0, 1fr) auto;
          gap: 0.9rem;
          align-items: start;
        }

        .order-item:first-child {
          border-top: none;
          padding-top: 0;
        }

        .order-item h4 {
          margin-bottom: 0.2rem;
          font-size: 0.98rem;
        }

        .order-image-wrap {
          position: relative;
          width: 84px;
          aspect-ratio: 1 / 1.2;
          border-radius: 18px;
          overflow: hidden;
          background: rgba(0,0,0,0.03);
          border: 1px solid var(--border);
        }

        .order-image {
          object-fit: cover;
        }

        .order-item-copy p {
          margin: 0.08rem 0;
        }

        .order-item-subtotal-label {
          color: var(--text-muted);
          font-size: 0.76rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.2rem;
        }

        .order-item p,
        .summary-meta {
          color: var(--text-secondary);
          line-height: 1.5;
          font-size: 0.92rem;
        }

        .summary-total-row {
          border-top: 1px solid var(--border);
          margin-top: 0.5rem;
          padding-top: 0.9rem;
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          color: var(--text-primary);
        }

        .pay-button {
          width: 100%;
          margin-top: 1rem;
          border: none;
          border-radius: 999px;
          padding: 14px 16px;
          background: var(--text-primary);
          color: var(--bg-primary);
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .pay-button:hover {
          transform: translateY(-1px);
        }

        .pay-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .checkout-note {
          margin-top: 0.8rem;
          color: var(--text-muted);
          font-size: 0.88rem;
          line-height: 1.6;
        }

        .whatsapp-section {
          margin-top: 1rem;
          border: 1px solid rgba(37, 211, 102, 0.18);
          background: linear-gradient(180deg, rgba(37, 211, 102, 0.08), rgba(37, 211, 102, 0.03));
          border-radius: 24px;
          padding: 1rem;
          position: relative;
          overflow: hidden;
        }

        .whatsapp-section::before {
          content: '';
          position: absolute;
          inset: -40% auto auto -10%;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: rgba(37, 211, 102, 0.12);
          filter: blur(8px);
          animation: whatsappGlow 4s ease-in-out infinite;
        }

        .whatsapp-copy {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 0.35rem;
          margin-bottom: 0.85rem;
        }

        .whatsapp-kicker {
          font-size: 0.76rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #128C7E;
        }

        .whatsapp-copy h3 {
          font-size: 1rem;
          color: var(--text-primary);
        }

        .whatsapp-copy p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .whatsapp-button {
          width: 100%;
          border: none;
          border-radius: 999px;
          padding: 12px 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: #fff;
          font-weight: 700;
          box-shadow: 0 14px 28px rgba(18, 140, 126, 0.18);
          position: relative;
          z-index: 1;
          transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
        }

        .whatsapp-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 34px rgba(18, 140, 126, 0.24);
          filter: brightness(1.02);
        }

        .whatsapp-button:active {
          transform: translateY(0) scale(0.99);
        }

        @keyframes whatsappGlow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        .empty-state {
          padding: 2.2rem 0;
          text-align: center;
          color: var(--text-secondary);
        }

        @media (max-width: 960px) {
          .checkout-shell { grid-template-columns: 1fr; }
          .checkout-summary { position: static; }
        }

        @media (max-width: 640px) {
          .checkout-grid { grid-template-columns: 1fr; }
          .order-item { grid-template-columns: 1fr; }
          .order-image-wrap { width: 100%; max-width: 220px; }
        }
      `}</style>

      <div className="checkout-shell">
        <section className="checkout-panel">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-copy">Complete your delivery details and pay securely with Paystack.</p>

          {cartItems.length === 0 ? (
            <div className="empty-state">
              <p>Your cart is empty. Add items before checking out.</p>
            </div>
          ) : (
            <div className="checkout-grid">
              <div className="checkout-field full">
                <label htmlFor="fullName">Full name</label>
                <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Amina Bello" />
              </div>
              <div className="checkout-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="amina@example.com" />
              </div>
              <div className="checkout-field">
                <label htmlFor="phone">Phone number</label>
                <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="08012345678" />
              </div>
              <div className="checkout-field">
                <label htmlFor="country">Country</label>
                <input id="country" name="country" value={form.country} onChange={handleChange} placeholder="Nigeria" />
              </div>
              <div className="checkout-field">
                <label htmlFor="state">State</label>
                <input id="state" name="state" value={form.state} onChange={handleChange} placeholder="Lagos" />
              </div>
              <div className="checkout-field">
                <label htmlFor="city">City</label>
                <input id="city" name="city" value={form.city} onChange={handleChange} placeholder="Ikeja" />
              </div>
              <div className="checkout-field full">
                <label htmlFor="streetAddress">Street address</label>
                <input id="streetAddress" name="streetAddress" value={form.streetAddress} onChange={handleChange} placeholder="12 Adeola Odeku Street" />
              </div>
            </div>
          )}
        </section>

        <aside className="checkout-summary">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-meta">{cartItems.length} item{cartItems.length === 1 ? "" : "s"}</div>

          {cartItems.length ? (
            <div className="order-list">
              {cartItems.map((item) => (
                <div className="order-item" key={`${item.id}-${getColorKey(item.selectedColor)}-${item.selectedSize || ""}`}>
                  <div>
                    <h4>{item.name || item.title}</h4>
                    <p>Shade: {getColorLabel(item.selectedColor)}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    ₦{(Number(item.price) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No items to display.</div>
          )}

          <div className="summary-meta">Shipping calculated at cart level.</div>
          <div className="summary-total-row">
            <span>Total</span>
            <span>₦{Number(total).toLocaleString()}</span>
          </div>

          <button className="pay-button" type="button" onClick={handlePay} disabled={processing || !cartItems.length}>
            {processing ? "Processing..." : "Pay Now"}
          </button>

          <p className="checkout-note">
            Payments are verified server-side before we send the order email and redirect to your confirmation page.
          </p>
        </aside>
      </div>
    </main>
  );
}