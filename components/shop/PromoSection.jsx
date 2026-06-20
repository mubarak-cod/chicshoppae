"use client";

import { motion } from "framer-motion";

const promos = [
  {
    title: "Featured Collections",
    text: "Curated edits built around occasion dressing, everyday polish, and seasonal refreshes.",
  },
  {
    title: "New Arrivals",
    text: "Fresh drops with refined tailoring, rich textures, and strong wardrobe staples.",
  },
  {
    title: "Seasonal Campaign",
    text: "An elevated visual story that bridges the hero banner and the product selection.",
  },
  {
    title: "Limited Time Offers",
    text: "Highlights chosen to surface the best value without compromising the premium feel.",
  },
];

export default function PromoSection() {
  return (
    <section className="promo-section">
      <style>{`
        .promo-section {
          padding: clamp(1.25rem, 3vw, 2rem) clamp(1rem, 4vw, 3rem) 0;
        }

        .promo-shell {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .promo-card {
          padding: 1.2rem;
          border-radius: 24px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
          min-height: 140px;
        }

        .promo-kicker {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          margin-bottom: 0.7rem;
        }

        .promo-title {
          font-size: 1rem;
          margin-bottom: 0.55rem;
          color: var(--text-primary);
        }

        .promo-text {
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--text-secondary);
        }

        @media (max-width: 1100px) {
          .promo-shell { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 640px) {
          .promo-section { padding-top: 1rem; }
          .promo-shell { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="promo-shell">
        {promos.map((promo, index) => (
          <motion.article
            key={promo.title}
            className="promo-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
          >
            <div className="promo-kicker">Collection {index + 1}</div>
            <h2 className="promo-title">{promo.title}</h2>
            <p className="promo-text">{promo.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}