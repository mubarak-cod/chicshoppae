"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const LAST_ORDER_STORAGE_KEY = "chic-shoppae-last-order";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString();
}

function getColorLabel(color) {
  if (!color) return "N/A";
  if (typeof color === "string") return color;
  return color.name || color.hex || "N/A";
}

function getWhatsappNumber() {
  return String(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
}

function buildWhatsAppMessage(order, reference) {
  const customer = order?.customer || {};
  const items = Array.isArray(order?.items) ? order.items : [];
  const total = formatCurrency(order?.total || 0);
  const messageLines = [
    "Hello ChicShoppae, I would like help with my order.",
    `Customer name: ${customer.fullName || "N/A"}`,
    `Order number: ${reference || order?.reference || "N/A"}`,
    `Total amount: ₦${total}`,
    "Ordered products:",
    ...items.map(
      (item) =>
        `- ${item.name || "Item"} | Color: ${item.color || "N/A"} | Size: ${item.size || "N/A"} | Qty: ${item.quantity || 1} | Subtotal: ₦${formatCurrency(item.subtotal ?? (Number(item.price) * Number(item.quantity || 1)))}`
    ),
  ];

  if (order?.customerMessage) {
    messageLines.push(`Customer message: ${order.customerMessage}`);
  }

  return messageLines.join("\n");
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<OrderSuccessFallback />}>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessFallback() {
  return <main className="order-success-page" />;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || "N/A";
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LAST_ORDER_STORAGE_KEY);
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    } catch {
      setOrder(null);
    }
  }, []);

  const whatsappNumber = getWhatsappNumber();
  const whatsappHref = useMemo(() => {
    if (!whatsappNumber) return "#";
    const message = buildWhatsAppMessage(order, reference);
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [order, reference, whatsappNumber]);

  const items = Array.isArray(order?.items) ? order.items : [];
  const customerName = order?.customer?.fullName || "Your order";

  return (
    <main className="order-success-page">
      <style>{`
        .order-success-page {
          padding: clamp(1.25rem, 3vw, 2.5rem) clamp(1rem, 4vw, 3rem) 4rem;
        }

        .success-shell {
          max-width: 1120px;
          margin: 0 auto;
          display: grid;
          gap: 1.25rem;
        }

        .success-hero,
        .success-panel,
        .whatsapp-panel {
          border: 1px solid var(--border);
          border-radius: 30px;
          background: var(--bg-card);
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.04);
        }

        .success-hero {
          padding: clamp(1.4rem, 3vw, 2rem);
          background:
            radial-gradient(circle at top left, rgba(196, 137, 90, 0.12), transparent 34%),
            radial-gradient(circle at bottom right, rgba(232, 160, 191, 0.12), transparent 32%),
            var(--bg-card);
          overflow: hidden;
          position: relative;
        }

        .success-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: translateX(-120%);
          animation: shimmer 8s ease-in-out infinite;
          pointer-events: none;
        }

        .eyebrow {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--text-muted);
          margin-bottom: 0.7rem;
        }

        .success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 4vw, 4.2rem);
          line-height: 0.95;
          color: var(--text-primary);
          max-width: 10ch;
        }

        .success-subtitle {
          margin-top: 0.9rem;
          color: var(--text-secondary);
          max-width: 58ch;
          line-height: 1.7;
        }

        .brand-lines {
          margin-top: 1.35rem;
          display: grid;
          gap: 0.55rem;
        }

        .brand-line {
          font-size: 0.98rem;
          color: var(--text-primary);
          letter-spacing: 0.02em;
        }

        .success-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
          gap: 1.25rem;
          align-items: start;
        }

        .success-panel,
        .whatsapp-panel {
          padding: 1.25rem;
        }

        .panel-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
        }

        .panel-meta {
          color: var(--text-secondary);
          font-size: 0.92rem;
          margin-bottom: 1rem;
        }

        .reference-box {
          margin-top: 0.9rem;
          padding: 0.95rem 1rem;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: var(--bg-primary);
          color: var(--text-secondary);
        }

        .reference-box strong {
          color: var(--text-primary);
        }

        .order-items {
          display: grid;
          gap: 0.9rem;
          margin-top: 1rem;
        }

        .order-card {
          display: grid;
          grid-template-columns: 84px minmax(0, 1fr) auto;
          gap: 0.9rem;
          align-items: start;
          border-top: 1px solid var(--border);
          padding-top: 0.9rem;
        }

        .order-card:first-child {
          border-top: 0;
          padding-top: 0;
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

        .order-card h3 {
          font-size: 1rem;
          color: var(--text-primary);
          margin-bottom: 0.2rem;
        }

        .order-card p {
          color: var(--text-secondary);
          line-height: 1.55;
          margin: 0.08rem 0;
          font-size: 0.92rem;
        }

        .subtotal-label {
          color: var(--text-muted);
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.2rem;
        }

        .summary-total {
          margin-top: 1rem;
          padding-top: 0.95rem;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          color: var(--text-primary);
          font-weight: 700;
        }

        .whatsapp-panel {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at top right, rgba(37, 211, 102, 0.12), transparent 30%),
            linear-gradient(180deg, rgba(37, 211, 102, 0.08), rgba(37, 211, 102, 0.03)),
            var(--bg-card);
        }

        .whatsapp-panel::before {
          content: '';
          position: absolute;
          right: -40px;
          top: -30px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(37, 211, 102, 0.18);
          filter: blur(10px);
          animation: whatsappPulse 4s ease-in-out infinite;
        }

        .whatsapp-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.76rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #128C7E;
          margin-bottom: 0.75rem;
          position: relative;
          z-index: 1;
        }

        .whatsapp-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: var(--text-primary);
          line-height: 1;
          position: relative;
          z-index: 1;
        }

        .whatsapp-copy {
          margin-top: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.7;
          position: relative;
          z-index: 1;
        }

        .whatsapp-button {
          margin-top: 1rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          width: 100%;
          border: 0;
          border-radius: 999px;
          padding: 13px 16px;
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: #fff;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 14px 28px rgba(18, 140, 126, 0.2);
          transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
          position: relative;
          z-index: 1;
        }

        .whatsapp-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 34px rgba(18, 140, 126, 0.26);
          filter: brightness(1.02);
        }

        .whatsapp-button:active {
          transform: translateY(0) scale(0.99);
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .action-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 12px 16px;
          border: 1px solid var(--border);
          color: var(--text-primary);
          text-decoration: none;
          font-weight: 600;
          background: var(--bg-primary);
        }

        @keyframes whatsappPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-120%); }
          42% { transform: translateX(120%); }
          100% { transform: translateX(120%); }
        }

        @media (max-width: 960px) {
          .success-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .order-card { grid-template-columns: 1fr; }
          .order-image-wrap { width: 100%; max-width: 220px; }
        }
      `}</style>

      <div className="success-shell">
        <motion.section
          className="success-hero"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">Order confirmed</p>
          <motion.h1
            className="success-title"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            Thank you for shopping with ChicShoppae.
          </motion.h1>
          <motion.p
            className="success-subtitle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            Luxury Fashion. Timeless Style. Every package is prepared with care, and we appreciate your trust.
          </motion.p>
          <div className="brand-lines">
            {[
              "Thank you for shopping with ChicShoppae.",
              "Luxury Fashion. Timeless Style.",
              "Every package is prepared with care.",
              "We appreciate your trust.",
            ].map((line, index) => (
              <motion.p
                key={line}
                className="brand-line"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 + index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.section>

        <div className="success-grid">
          <section className="success-panel">
            <h2 className="panel-title">Your Order</h2>
            <p className="panel-meta">
              {customerName} · {items.length} item{items.length === 1 ? "" : "s"}
            </p>
            <div className="reference-box">
              Reference: <strong>{reference}</strong>
            </div>

            {items.length ? (
              <div className="order-items">
                {items.map((item, index) => (
                  <motion.article
                    className="order-card"
                    key={`${item.id || index}-${item.colorKey || item.color || index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="order-image-wrap">
                      <Image
                        src={item.image || "/images/one.jpg"}
                        alt={item.name || "Ordered item"}
                        fill
                        sizes="84px"
                        className="order-image"
                      />
                    </div>
                    <div>
                      <h3>{item.name || "Item"}</h3>
                      <p>Color: {getColorLabel(item.color)}</p>
                      <p>Size: {item.size || "N/A"}</p>
                      <p>Quantity: {item.quantity || 1}</p>
                      <p>₦{formatCurrency(item.price)} each</p>
                    </div>
                    <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <p className="subtotal-label">Subtotal</p>
                      <div>₦{formatCurrency(item.subtotal ?? (Number(item.price) * Number(item.quantity || 1)))}</div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <p className="panel-meta">We could not load the stored order preview, but your payment reference is confirmed above.</p>
            )}

            <div className="summary-total">
              <span>Total</span>
              <span>₦{formatCurrency(order?.total)}</span>
            </div>

            <div className="actions">
              <Link href="/shop" className="action-link">
                Continue Shopping
              </Link>
              <Link href="/cart" className="action-link">
                View Cart
              </Link>
            </div>
          </section>

          <aside className="whatsapp-panel">
            <div className="whatsapp-badge">
              <span aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.07-1.32A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.65 0-3.18-.46-4.5-1.25l-.32-.19-3.34.87.9-3.26-.21-.34A7.94 7.94 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.4-5.8c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.42-.55-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28z"/>
                </svg>
              </span>
              WhatsApp concierge
            </div>
            <h3 className="whatsapp-title">Continue the conversation on WhatsApp.</h3>
            <p className="whatsapp-copy">
              We prefill your name, order number, items, total amount, and customer message so the store can assist quickly.
            </p>
            <a
              className="whatsapp-button"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.07-1.32A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.65 0-3.18-.46-4.5-1.25l-.32-.19-3.34.87.9-3.26-.21-.34A7.94 7.94 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.4-5.8c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.42-.55-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28z"/>
                </svg>
              </span>
              Message on WhatsApp
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}
