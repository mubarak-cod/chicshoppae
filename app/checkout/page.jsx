"use client";

export const dynamic = "force-dynamic";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamicImport from "next/dynamic";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";

const PaystackButton = dynamicImport(() => import("@/components/PaystackButton"), {
  ssr: false,
  loading: () => (
    <button className="pay-button" type="button" disabled>
      <span>Loading payment...</span>
    </button>
  ),
});

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
  const colorIndex = colors.findIndex(
    (color) => getColorKey(color) === getColorKey(item.selectedColor)
  );
  return images[(colorIndex < 0 ? 0 : colorIndex) % images.length] || images[0];
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString();
}

function getWhatsappNumber() {
  return String(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
}

function buildWhatsAppLink(items, form, total) {
  const whatsappNumber = getWhatsappNumber();
  if (!whatsappNumber) return "#";

  const orderLines = items.map(
    (item, i) =>
      `${i + 1}. *${item.name || "Item"}*\n   Color: ${item.color} | Size: ${item.size} | Qty: ${item.quantity}\n   Subtotal: ₦${formatCurrency(item.subtotal)}`
  );

  const messageLines = [
    "👋 Hello ChicShoppae!",
    "I'd like to confirm my order:",
    "",
    "🛍️ *Order Summary*",
    ...orderLines,
    "",
    `💰 *Total: ₦${formatCurrency(total)}*`,
    "",
    "📦 *Delivery Details*",
    form.fullName ? `Name: ${form.fullName}` : null,
    form.phone ? `Phone: ${form.phone}` : null,
    form.streetAddress || form.city || form.state
      ? `Address: ${[form.streetAddress, form.city, form.state, form.country].filter(Boolean).join(", ")}`
      : null,
    form.customerMessage ? `\n📝 Note: ${form.customerMessage}` : null,
  ].filter(Boolean);

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageLines.join("\n"))}`;
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

  const checkoutWhatsAppHref = buildWhatsAppLink(orderItems, form, total);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((curr) => ({ ...curr, [name]: value }));
  };

  const submitOrder = async (reference) => {
    const verifyResponse = await fetch("/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, amount: total }),
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

  const validateBeforePay = () => {
    if (!cartItems.length) {
      toast.error("Your cart is empty.");
      return false;
    }
    const required = ["fullName", "email", "phone", "country", "state", "city", "streetAddress"];
    const missing = required.find((f) => !form[f].trim());
    if (missing) {
      toast.error("Please fill in every delivery field before paying.");
      return false;
    }
    if (!publicKey) {
      toast.error("Paystack public key is missing.");
      return false;
    }
    setProcessing(true);
    return true;
  };

  const requiredFields = ["fullName", "email", "phone", "country", "state", "city", "streetAddress"];

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    if (!cartItems.length) {
      toast.error("Your cart is empty.");
      return;
    }
    const missing = requiredFields.find((f) => !form[f].trim());
    if (missing) {
      toast.error("Please fill in every delivery field before using WhatsApp.");
      return;
    }
    window.open(checkoutWhatsAppHref, "_blank", "noopener,noreferrer");
  };

  const paystackConfig = {
    email: form.email,
    amount: Math.round(Number(total) * 100),
    reference: `chic-${Date.now()}`,
    currency: "NGN",
    metadata: {
      customer: form.fullName,
      phone: form.phone,
      address: `${form.streetAddress}, ${form.city}, ${form.state}, ${form.country}`,
      items: orderItems,
      customerMessage: form.customerMessage,
    },
  };

  const handlePaystackSuccess = async (response) => {
    try {
      const ref = response?.reference || response?.trxref || response?.trans || "";
      const verified = await submitOrder(ref);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          LAST_ORDER_STORAGE_KEY,
          JSON.stringify({
            reference: ref || verified?.payment?.reference || `chic-${Date.now()}`,
            customer: form,
            items: orderItems,
            total,
            customerMessage: form.customerMessage,
          })
        );
      }
      toast.success("Payment verified! Order confirmed.");
      router.push(`/order-success?reference=${encodeURIComponent(ref || verified?.payment?.reference || "")}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setProcessing(false);
    }
  };

  const handlePaystackClose = () => {
    setProcessing(false);
    toast("Payment popup closed. No charge was made.", { icon: "ℹ️" });
  };

  return (
    <main className="checkout-page">
      <style>{`
        .checkout-page {
          padding: clamp(1.25rem, 3vw, 2.5rem) clamp(1rem, 4vw, 3rem) 4rem;
        }

        .checkout-shell {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 2rem;
          align-items: start;
        }

        .checkout-panel,
        .checkout-summary {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 28px;
          box-shadow: 0 18px 42px rgba(0,0,0,0.04);
          padding: 1.5rem;
        }

        .checkout-summary {
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

        .checkout-field input,
        .checkout-field textarea {
          width: 100%;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: var(--bg-primary);
          color: var(--text-primary);
          padding: 13px 14px;
          outline: none;
          font-family: inherit;
          font-size: 0.92rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .checkout-field input:focus,
        .checkout-field textarea:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(196,137,90,0.12);
        }

        .checkout-field textarea {
          resize: vertical;
          min-height: 100px;
        }

        .summary-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .summary-meta {
          color: var(--text-secondary);
          font-size: 0.88rem;
        }

        .order-list {
          display: grid;
          gap: 0;
          margin: 1rem 0;
          max-height: 340px;
          overflow-y: auto;
          padding-right: 0.1rem;
        }

        .order-item {
          padding: 0.85rem 0;
          border-top: 1px solid var(--border);
          display: grid;
          grid-template-columns: 72px 1fr auto;
          gap: 0.9rem;
          align-items: start;
        }

        .order-item:first-child {
          border-top: none;
          padding-top: 0;
        }

        .order-image-wrap {
          position: relative;
          width: 72px;
          aspect-ratio: 1 / 1.2;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: var(--bg-secondary);
          flex-shrink: 0;
        }

        .order-image { object-fit: cover; }

        .order-item-copy h4 {
          font-size: 0.95rem;
          color: var(--text-primary);
          margin-bottom: 0.2rem;
          font-weight: 500;
        }

        .order-item-copy p {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin: 0.05rem 0;
          line-height: 1.45;
        }

        .order-item-price {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          text-align: right;
        }

        .summary-total-row {
          border-top: 1px solid var(--border);
          margin-top: 0.5rem;
          padding-top: 0.9rem;
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          font-size: 1rem;
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
          font-size: 0.95rem;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }

        .pay-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #E8A0BF, #C4895A);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .pay-button:hover::before { opacity: 1; }
        .pay-button:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(196,137,90,0.28); }
        .pay-button:disabled { opacity: 0.55; cursor: not-allowed; }
        .pay-button span { position: relative; z-index: 1; }

        .checkout-note {
          margin-top: 0.8rem;
          color: var(--text-muted);
          font-size: 0.82rem;
          line-height: 1.6;
          text-align: center;
        }

        .whatsapp-section {
          margin-top: 1.2rem;
          border: 1px solid rgba(37,211,102,0.2);
          background: linear-gradient(180deg, rgba(37,211,102,0.08), rgba(37,211,102,0.03));
          border-radius: 20px;
          padding: 1rem;
          position: relative;
          overflow: hidden;
        }

        .whatsapp-kicker {
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #128C7E;
          display: block;
          margin-bottom: 0.25rem;
        }

        .whatsapp-section h3 {
          font-size: 0.9rem;
          color: var(--text-primary);
          margin-bottom: 0.3rem;
        }

        .whatsapp-section p {
          color: var(--text-secondary);
          font-size: 0.82rem;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }

        .whatsapp-button {
          width: 100%;
          border: none;
          border-radius: 999px;
          padding: 11px 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: #fff;
          font-weight: 700;
          font-size: 0.88rem;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 8px 20px rgba(18,140,126,0.2);
        }

        .whatsapp-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 28px rgba(18,140,126,0.3);
        }

        .empty-state {
          padding: 2rem 0;
          text-align: center;
          color: var(--text-secondary);
        }

        @media (max-width: 960px) {
          .checkout-shell { grid-template-columns: 1fr; }
          .checkout-summary { position: static; }
        }

        @media (max-width: 640px) {
          .checkout-grid { grid-template-columns: 1fr; }
          .order-item { grid-template-columns: 64px 1fr auto; gap: 0.65rem; }
          .order-image-wrap { width: 64px; }
        }
      `}</style>

      <div className="checkout-shell">
        {/* ── LEFT: Delivery form ── */}
        <section className="checkout-panel">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-copy">
            Complete your delivery details and pay securely with Paystack.
          </p>

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
              <div className="checkout-field full">
                <label htmlFor="customerMessage">Message (optional)</label>
                <textarea
                  id="customerMessage"
                  name="customerMessage"
                  value={form.customerMessage}
                  onChange={handleChange}
                  placeholder="Special requests, delivery instructions, preferred time..."
                />
              </div>
            </div>
          )}

          {/* WhatsApp support section */}
          {cartItems.length > 0 && (
            <div className="whatsapp-section">
              <span className="whatsapp-kicker">WhatsApp support</span>
              <h3>Send your order summary on WhatsApp</h3>
              <p>
                Tap below to open a pre-filled WhatsApp message with your order details, ready to send.
              </p>
              
                <a className="whatsapp-button"
                href={checkoutWhatsAppHref}
                onClick={handleWhatsAppClick}
                aria-label="Open WhatsApp with your order summary"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.07-1.32A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.65 0-3.18-.46-4.5-1.25l-.32-.19-3.34.87.9-3.26-.21-.34A7.94 7.94 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
                WhatsApp Preview
              </a>
            </div>
          )}
        </section>

        {/* ── RIGHT: Order summary ── */}
        <aside className="checkout-summary">
          <h2 className="summary-title">Order Summary</h2>
          <p className="summary-meta">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>

          {cartItems.length > 0 ? (
            <div className="order-list">
              {cartItems.map((item) => (
                <div
                  className="order-item"
                  key={`${item.id}-${getColorKey(item.selectedColor)}-${item.selectedSize || ""}`}
                >
                  <div className="order-image-wrap">
                    <Image
                      src={getPreviewImage(item)}
                      alt={item.name || item.title || "Product"}
                      fill
                      sizes="72px"
                      className="order-image"
                    />
                  </div>
                  <div className="order-item-copy">
                    <h4>{item.name || item.title}</h4>
                    <p>Shade: {getColorLabel(item.selectedColor)}</p>
                    <p>Size: {item.selectedSize || "N/A"}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="order-item-price">
                    ₦{(Number(item.price) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No items to display.</div>
          )}

          <p className="summary-meta">Delivery fee is paid directly to the rider on arrival.</p>

          <div className="summary-total-row">
            <span>Total</span>
            <span>₦{Number(total).toLocaleString()}</span>
          </div>

          <PaystackButton
            publicKey={publicKey}
            config={paystackConfig}
            onSuccess={handlePaystackSuccess}
            onClose={handlePaystackClose}
            disabled={processing || !cartItems.length}
            label={processing ? "Processing..." : `Pay ₦${Number(total).toLocaleString()}`}
            onBeforePay={validateBeforePay}
          />

          <p className="checkout-note">
            🔒 Payments are processed securely by Paystack and verified server-side before your order is confirmed.
          </p>
        </aside>
      </div>
    </main>
  );
}