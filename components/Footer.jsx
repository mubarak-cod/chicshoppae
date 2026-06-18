"use client";

import { useState } from "react";
import Link from "next/link";

const shopLinks = [
  { label: "All Products", href: "/shop" },
  { label: "New Arrivals", href: "/shop?filter=new" },
  { label: "Gowns", href: "/shop?category=Gowns" },
  { label: "Tops", href: "/shop?category=Tops" },
  { label: "2-Piece Sets", href: "/shop?category=2-Piece+Sets" },
  { label: "Trousers", href: "/shop?category=Trousers" },
];

const helpLinks = [
  { label: "Track My Order", href: "/track-order" },
  { label: "Delivery Info", href: "/delivery" },
  { label: "Returns & Exchange", href: "/returns" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "FAQs", href: "/faqs" },
];

const aboutLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const socials = [
  {
    name: "Instagram",
    href: "https://instagram.com/chicshoppae",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@chicshoppae",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z"/>
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/2348000000000",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.07-1.32A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.65 0-3.18-.46-4.5-1.25l-.32-.19-3.34.87.9-3.26-.21-.34A7.94 7.94 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.4-5.8c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.42-.55-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28z"/>
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com/chicshoppae",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <>
      <style>{`
        .footer {
          background: var(--text-primary, #1A1714);
          color: var(--bg-primary, #F5F0E8);
          position: relative;
          overflow: hidden;
        }

        /* ── TOP GRADIENT LINE ── */
        .footer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #E8A0BF, #C4895A, transparent);
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 4rem 1.5rem 2rem;
        }

        /* ── TOP SECTION: Brand + Newsletter ── */
        .footer-top {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 3rem;
          padding-bottom: 3rem;
          border-bottom: 0.5px solid rgba(245,240,232,0.12);
        }

        .footer-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--bg-primary, #F5F0E8);
          margin-bottom: 0.5rem;
        }

        .footer-brand-desc {
          font-size: 13.5px;
          line-height: 1.75;
          color: rgba(245,240,232,0.55);
          max-width: 340px;
          margin-bottom: 1.5rem;
        }

        .footer-socials {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .footer-social-btn {
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 0.5px solid rgba(245,240,232,0.18);
          display: flex; align-items: center; justify-content: center;
          color: rgba(245,240,232,0.75);
          text-decoration: none;
          transition: background 0.25s, transform 0.25s, color 0.25s, border-color 0.25s;
        }

        .footer-social-btn:hover {
          background: linear-gradient(135deg, #E8A0BF, #C4895A);
          color: #1A1714;
          transform: translateY(-3px) scale(1.05);
          border-color: transparent;
        }

        /* ── NEWSLETTER ── */
        .footer-newsletter-title {
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--bg-primary, #F5F0E8);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .footer-newsletter-desc {
          font-size: 13px;
          color: rgba(245,240,232,0.5);
          margin-bottom: 1.1rem;
          line-height: 1.6;
        }

        .footer-newsletter-form {
          display: flex;
          gap: 0.5rem;
        }

        .footer-input {
          flex: 1;
          padding: 12px 16px;
          border: 0.5px solid rgba(245,240,232,0.2);
          border-radius: 8px;
          background: rgba(245,240,232,0.05);
          color: var(--bg-primary, #F5F0E8);
          font-size: 13.5px;
          outline: none;
          font-family: 'Inter', sans-serif;
          transition: border 0.2s, background 0.2s;
        }

        .footer-input::placeholder { color: rgba(245,240,232,0.35); }
        .footer-input:focus { border-color: #C4895A; background: rgba(245,240,232,0.08); }

        .footer-sub-btn {
          background: linear-gradient(135deg, #E8A0BF, #C4895A);
          color: #1A1714;
          border: none;
          padding: 12px 22px;
          border-radius: 8px;
          font-size: 11.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
          transition: opacity 0.2s, transform 0.2s;
        }
        .footer-sub-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        .footer-sub-success {
          font-size: 12.5px;
          color: #E8A0BF;
          margin-top: 0.6rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* ── LINK COLUMNS ── */
        .footer-links-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          padding: 3rem 0;
          border-bottom: 0.5px solid rgba(245,240,232,0.12);
        }

        .footer-col-title {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--bg-primary, #F5F0E8);
          margin-bottom: 1.1rem;
          font-weight: 500;
        }

        .footer-link-list {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .footer-link {
          font-size: 13.5px;
          color: rgba(245,240,232,0.55);
          text-decoration: none;
          transition: color 0.2s, padding-left 0.2s;
          width: fit-content;
        }

        .footer-link:hover {
          color: #E8A0BF;
          padding-left: 4px;
        }

        /* ── CONTACT INFO ── */
        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: rgba(245,240,232,0.55);
          margin-bottom: 0.7rem;
          line-height: 1.5;
        }

        .footer-contact-item svg { flex-shrink: 0; margin-top: 2px; color: #C4895A; }

        /* ── BOTTOM BAR ── */
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.75rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-copyright {
          font-size: 12.5px;
          color: rgba(245,240,232,0.4);
        }

        .footer-payment-icons {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .footer-payment-badge {
          padding: 5px 10px;
          border: 0.5px solid rgba(245,240,232,0.15);
          border-radius: 6px;
          font-size: 10.5px;
          color: rgba(245,240,232,0.5);
          letter-spacing: 0.03em;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .footer-top { grid-template-columns: 1fr; gap: 2.5rem; }
          .footer-links-row { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        }

        @media (max-width: 640px) {
          .footer-container { padding: 3rem 1.25rem 1.5rem; }
          .footer-links-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem 1.5rem;
          }
          .footer-newsletter-form { flex-direction: column; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
          .footer-brand-desc { max-width: 100%; }
        }

        @media (max-width: 420px) {
          .footer-links-row { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-container">

          {/* ── TOP: Brand + Newsletter ── */}
          <div className="footer-top">
            <div>
              <h3 className="footer-brand-name">Chic Shoppae</h3>
              <p className="footer-brand-desc">
                Curated fashion for the woman who knows what she wants.
                New styles every week, delivered straight to your door across Nigeria.
              </p>
              <div className="footer-socials">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn"
                    aria-label={s.name}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="footer-newsletter-title">Join the inner circle</p>
              <p className="footer-newsletter-desc">
                Get early access to new drops, exclusive discounts and style tips.
              </p>
              <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="footer-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="footer-sub-btn">
                  Subscribe
                </button>
              </form>
              {subscribed && (
                <p className="footer-sub-success">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  You're in! Watch your inbox 💌
                </p>
              )}
            </div>
          </div>

          {/* ── LINKS ── */}
          <div className="footer-links-row">
            <div>
              <h4 className="footer-col-title">Shop</h4>
              <div className="footer-link-list">
                {shopLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="footer-col-title">Help</h4>
              <div className="footer-link-list">
                {helpLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="footer-col-title">Get In Touch</h4>
              <div className="footer-contact-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Lagos, Nigeria — Delivers Nationwide</span>
              </div>
              <div className="footer-contact-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>+234 800 000 0000</span>
              </div>
              <div className="footer-contact-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>hello@chicshoppae.com</span>
              </div>
            </div>
          </div>

          {/* ── BOTTOM ── */}
          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} Chic Shoppae. All rights reserved.
            </p>
            <div className="footer-payment-icons">
              <span className="footer-payment-badge">Paystack</span>
              <span className="footer-payment-badge">Visa</span>
              <span className="footer-payment-badge">Mastercard</span>
              <span className="footer-payment-badge">Bank Transfer</span>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}