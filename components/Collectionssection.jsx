"use client";

import Link from "next/link";
import { useState } from "react";

const collections = [
  {
    id: 1,
    name: "Top Daphnny",
    slug: "Gowns",
    description: "Elegant pieces for every occasion",
    image: "/images/one.jpg", // replace with cloudinary URL
    count: "24 styles",
    accent: "#C4895A",
    size: "large", // large card
  },
  {
    id: 2,
    name: "Flare skirt",
    slug: "Tops",
    description: "Effortless everyday staples",
    image: "/images/five.jpg",
    count: "18 styles",
    accent: "#7A6550",
    size: "small",
  }, 
  {
    id: 3,
    name: "2-Piece Sets",
    slug: "2-Piece Sets",
    description: "Matching sets that do the work for you",
    image: "/images/four.jpg",
    count: "12 styles",
    accent: "#9B5E3A",
    size: "small",
  },
  {
    id: 4,
    name: "Trousers",
    slug: "Trousers",
    description: "Tailored cuts, real comfort",
    image: "/images/seven.jpg",
    count: "15 styles",
    accent: "#6B5B4E",
    size: "large",
  },
];

export default function CollectionsSection() {
  return (
    <>
      <style>{`
        .collections-section {
          padding: 5rem 0;
          border-top: 0.5px solid var(--border);
          background: var(--bg-primary);
        }

        .collections-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ── HEADER ── */
        .collections-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          gap: 1rem;
        }

        .collections-see-all {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s, gap 0.2s;
          white-space: nowrap;
          padding-bottom: 4px;
        }
        .collections-see-all:hover { color: var(--text-primary); gap: 9px; }
        .collections-see-all svg { transition: transform 0.2s; }
        .collections-see-all:hover svg { transform: translateX(3px); }

        /* ── BENTO GRID ── */
        .collections-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.4fr;
          grid-template-rows: auto;
          gap: 1rem;
          height: 580px;
        }

        /* ── COLLECTION CARD ── */
        .col-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          text-decoration: none;
          display: block;
          background: var(--bg-secondary);
          border: 0.5px solid var(--border);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.3s cubic-bezier(0.22,1,0.36,1);
        }

        .col-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.10);
        }

        /* Image */
        .col-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .col-card:hover .col-card-img { transform: scale(1.04); }

        /* Placeholder when no image */
        .col-card-placeholder {
          width: 100%;
          height: 100%;
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }

        /* Gradient overlay */
        .col-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(16, 12, 8, 0.75) 0%,
            rgba(16, 12, 8, 0.15) 50%,
            transparent 100%
          );
          transition: opacity 0.3s;
        }
        .col-card:hover .col-card-overlay {
          background: linear-gradient(
            to top,
            rgba(16, 12, 8, 0.82) 0%,
            rgba(16, 12, 8, 0.2) 55%,
            transparent 100%
          );
        }

        /* Content inside card */
        .col-card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .col-card-count {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          font-family: 'Inter', sans-serif;
        }

        .col-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 2.5vw, 32px);
          font-weight: 600;
          color: #fff;
          line-height: 1.1;
          letter-spacing: 0.01em;
        }

        .col-card-desc {
          font-size: 12.5px;
          color: rgba(255,255,255,0.65);
          line-height: 1.5;
          font-family: 'Inter', sans-serif;
          max-width: 200px;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.3s 0.05s, transform 0.3s 0.05s;
        }
        .col-card:hover .col-card-desc {
          opacity: 1;
          transform: translateY(0);
        }

        .col-card-arrow {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.8);
          font-family: 'Inter', sans-serif;
          margin-top: 0.25rem;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.3s 0.08s, transform 0.3s 0.08s;
        }
        .col-card:hover .col-card-arrow {
          opacity: 1;
          transform: translateY(0);
        }

        /* Accent dot top-right */
        .col-card-dot {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.6);
          background: transparent;
          transition: background 0.3s;
        }
        .col-card:hover .col-card-dot {
          background: rgba(255,255,255,0.6);
        }

        /* ── RESPONSIVE ── */

        /* Tablet: 2x2 grid, equal sizes, taller cards */
        @media (max-width: 1024px) {
          .collections-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 280px 280px;
            height: auto;
            gap: 0.875rem;
          }
          .col-card-desc { opacity: 1; transform: none; }
          .col-card-arrow { opacity: 1; transform: none; }
        }

        /* Mobile: single column stack */
        @media (max-width: 640px) {
          .collections-section { padding: 3rem 0; }
          .collections-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, 220px);
            gap: 0.75rem;
          }
          .collections-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
          .col-card-name { font-size: clamp(24px, 6vw, 32px); }
          .col-card-content { padding: 1.25rem; }
        }
      `}</style>

      <section className="collections-section">
        <div className="collections-container">
          {/* Header */}
          <div className="collections-header">
            <div>
              <span className="section-eyebrow">Browse by Type</span>
              <h2 className="section-title">Shop Collections</h2>
            </div>
            <Link href="/shop" className="collections-see-all">
              View all
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="collections-grid">
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/shop?category=${encodeURIComponent(col.slug)}`}
                className="col-card"
              >
                {/* Image or placeholder */}
                {col.image ? (
                  <img
                    src={col.image}
                    alt={col.name}
                    className="col-card-img"
                    loading="lazy"
                  />
                ) : (
                  <div className="col-card-placeholder">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ opacity: 0.2 }}
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}

                <div className="col-card-overlay" />
                <span className="col-card-dot" />

                <div className="col-card-content">
                  <span className="col-card-count">{col.count}</span>
                  <h3 className="col-card-name">{col.name}</h3>
                  <p className="col-card-desc">{col.description}</p>
                  <span className="col-card-arrow">
                    Shop now
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
