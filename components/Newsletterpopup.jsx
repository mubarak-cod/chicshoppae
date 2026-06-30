"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "chic-shoppae-newsletter-seen";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xrewqzyw";

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const seen = window.localStorage.getItem(STORAGE_KEY);
      if (seen) return;
    } catch {
      // ignore storage errors, still show the popup
    }

    const timer = window.setTimeout(() => setOpen(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      try {
        window.localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore storage errors
      }
    }, 280);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((curr) => ({ ...curr, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim()) return;

    setStatus("submitting");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          source: "shop-page-popup",
        }),
      });

      if (!res.ok) throw new Error("Subscribe failed");

      setStatus("success");
      try {
        window.localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore storage errors
      }
      window.setTimeout(handleClose, 2200);
    } catch {
      setStatus("error");
    }
  };

  if (!open) return null;

  return (
    <>
      <style>{`
        .nlp-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1100;
          background: rgba(18, 16, 14, 0.55);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 1rem;
          animation: nlpBackdropIn 0.35s ease;
        }

        .nlp-backdrop.closing {
          animation: nlpBackdropOut 0.28s ease forwards;
        }

        @keyframes nlpBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes nlpBackdropOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @media (min-width: 720px) {
          .nlp-backdrop {
            align-items: center;
          }
        }

        .nlp-card {
          position: relative;
          width: 100%;
          max-width: 460px;
          background: var(--bg-card, #FDFAF5);
          border-radius: 26px 26px 0 0;
          overflow: hidden;
          box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.25);
          animation: nlpSlideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .nlp-backdrop.closing .nlp-card {
          animation: nlpSlideDown 0.28s ease forwards;
        }

        @keyframes nlpSlideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes nlpSlideDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(40px); opacity: 0; }
        }

        @media (min-width: 720px) {
          .nlp-card { border-radius: 26px; }
        }

        .nlp-accent-bar {
          height: 4px;
          background: linear-gradient(90deg, #E8A0BF, #C4895A);
        }

        .nlp-glow {
          position: absolute;
          top: -60px;
          right: -60px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,160,191,0.22), transparent 70%);
          pointer-events: none;
          animation: nlpGlowPulse 5s ease-in-out infinite;
        }

        @keyframes nlpGlowPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.15); }
        }

        .nlp-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: rgba(26, 23, 20, 0.06);
          color: var(--text-primary, #1A1714);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
          transition: background 0.2s, transform 0.2s;
        }

        .nlp-close:hover {
          background: rgba(26, 23, 20, 0.12);
          transform: scale(1.06);
        }

        .nlp-body {
          padding: 2rem 1.75rem 1.85rem;
          position: relative;
          z-index: 1;
        }

        .nlp-kicker {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 600;
          color: #C4895A;
          margin-bottom: 0.65rem;
        }

        .nlp-kicker svg {
          animation: nlpSparkle 2.4s ease-in-out infinite;
        }

        @keyframes nlpSparkle {
          0%, 100% { opacity: 0.5; transform: scale(0.9) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.1) rotate(12deg); }
        }

        .nlp-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(26px, 4vw, 32px);
          font-weight: 600;
          line-height: 1.2;
          color: var(--text-primary, #1A1714);
          margin-bottom: 0.5rem;
        }

        .nlp-desc {
          font-size: 13.5px;
          line-height: 1.65;
          color: var(--text-secondary, #6B6560);
          margin-bottom: 1.5rem;
          max-width: 360px;
        }

        .nlp-form {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .nlp-input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem;
        }

        .nlp-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid var(--border, rgba(26,23,20,0.14));
          background: var(--bg-primary, #F5F0E8);
          color: var(--text-primary, #1A1714);
          font-size: 13.5px;
          outline: none;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .nlp-input::placeholder { color: rgba(26,23,20,0.4); }

        .nlp-input:focus {
          border-color: #C4895A;
          box-shadow: 0 0 0 3px rgba(196,137,90,0.14);
        }

        .nlp-submit {
          margin-top: 0.4rem;
          width: 100%;
          padding: 13px 16px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #E8A0BF, #C4895A);
          color: #1A1714;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }

        .nlp-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(196,137,90,0.32);
        }

        .nlp-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .nlp-skip {
          text-align: center;
          margin-top: 0.85rem;
          font-size: 11.5px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted, #9E9890);
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.2s;
        }

        .nlp-skip:hover { color: var(--text-primary, #1A1714); }

        .nlp-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0 0.75rem;
          text-align: center;
        }

        .nlp-success-icon {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: linear-gradient(135deg, #34D399, #0EA572);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          animation: nlpSuccessPop 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }

        @keyframes nlpSuccessPop {
          from { transform: scale(0.6); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .nlp-success p {
          font-size: 13.5px;
          color: var(--text-secondary, #6B6560);
        }

        @media (max-width: 420px) {
          .nlp-input-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        className={`nlp-backdrop ${closing ? "closing" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div className="nlp-card">
          <div className="nlp-accent-bar" />
          <div className="nlp-glow" />

          <button className="nlp-close" onClick={handleClose} aria-label="Close newsletter popup">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="nlp-body">
            {status === "success" ? (
              <div className="nlp-success">
                <div className="nlp-success-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p>You're in — welcome to the inner circle 💌</p>
              </div>
            ) : (
              <>
                <span className="nlp-kicker">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5z"/></svg>
                  Join the inner circle
                </span>
                <h2 className="nlp-title">Get first access to new arrivals</h2>
                <p className="nlp-desc">
                  Subscribe for early drops, members-only discounts, and styling tips before anyone else sees them.
                </p>

                <form className="nlp-form" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    className="nlp-input"
                    value={form.name}
                    onChange={handleChange}
                  />
                  <div className="nlp-input-row">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className="nlp-input"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone (optional)"
                      className="nlp-input"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="nlp-submit" disabled={status === "submitting"}>
                    {status === "submitting" ? "Subscribing..." : "Subscribe & Save"}
                  </button>
                  {status === "error" && (
                    <p style={{ fontSize: "12px", color: "#C4895A", textAlign: "center", marginTop: "0.4rem" }}>
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>

                <button className="nlp-skip" onClick={handleClose} type="button">
                  Maybe later
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}