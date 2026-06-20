"use client";

import { motion } from "framer-motion";

const promos = [
  {
    title: "Featured Collections",
    text: "Curated edits built around occasion dressing, everyday polish, and seasonal refreshes.",
    icon: "sparkles",
    accent: "#C4895A",
  },
  {
    title: "New Arrivals",
    text: "Fresh drops with refined tailoring, rich textures, and strong wardrobe staples.",
    icon: "rocket",
    accent: "#E8A0BF",
  },
  {
    title: "Seasonal Campaign",
    text: "An elevated visual story that bridges the hero banner and the product selection.",
    icon: "camera",
    accent: "#7A6550",
  },
  {
    title: "Limited Time Offers",
    text: "Highlights chosen to surface the best value without compromising the premium feel.",
    icon: "clock",
    accent: "#F472B6",
  },
];

const icons = {
  sparkles: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  rocket: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  camera: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  clock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

export default function PromoSection() {
  return (
    <section className="promo-section">
      <style>{`
        .promo-section {
          padding: clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 4vw, 3rem) 0;
        }

        .promo-shell {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .promo-card {
          position: relative;
          padding: 1.4rem 1.3rem;
          border-radius: 22px;
          border: 0.5px solid var(--border, rgba(26,23,20,0.1));
          background: var(--bg-card, #FDFAF5);
          min-height: 168px;
          overflow: hidden;
          cursor: default;
          display: flex;
          flex-direction: column;
        }

        /* Soft decorative blob behind icon */
        .promo-blob {
          position: absolute;
          top: -30px;
          right: -30px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          opacity: 0.10;
          filter: blur(2px);
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.4s;
        }

        .promo-card:hover .promo-blob {
          transform: scale(1.5);
          opacity: 0.16;
        }

        .promo-icon {
          width: 42px;
          height: 42px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.9rem;
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }

        .promo-card:hover .promo-icon {
          transform: rotate(-6deg) scale(1.08);
        }

        .promo-kicker {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--text-muted, #9E9890);
          margin-bottom: 0.4rem;
          position: relative;
          z-index: 1;
          font-weight: 500;
        }

        .promo-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-primary, #1A1714);
          position: relative;
          z-index: 1;
          line-height: 1.2;
        }

        .promo-text {
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--text-secondary, #6B6560);
          position: relative;
          z-index: 1;
          flex: 1;
        }

        .promo-arrow {
          margin-top: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted, #9E9890);
          position: relative;
          z-index: 1;
          width: fit-content;
          transition: gap 0.25s, color 0.25s;
        }

        .promo-card:hover .promo-arrow {
          gap: 9px;
          color: var(--text-primary, #1A1714);
        }

        .promo-arrow svg { transition: transform 0.25s; }
        .promo-card:hover .promo-arrow svg { transform: translateX(2px); }

        /* Bottom accent line that draws in on hover */
        .promo-line {
          position: absolute;
          bottom: 0; left: 0;
          height: 2px;
          width: 0%;
          transition: width 0.4s cubic-bezier(0.22,1,0.36,1);
        }

        .promo-card:hover .promo-line {
          width: 100%;
        }

        @media (max-width: 1100px) {
          .promo-shell { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 640px) {
          .promo-section { padding-top: 1.25rem; }
          .promo-shell { grid-template-columns: 1fr; gap: 12px; }
          .promo-card { min-height: unset; padding: 1.2rem; }
        }
      `}</style>

      <div className="promo-shell">
        {promos.map((promo, index) => (
          <motion.article
            key={promo.title}
            className="promo-card"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -5 }}
          >
            <div
              className="promo-blob"
              style={{ background: promo.accent }}
            />
            <div
              className="promo-icon"
              style={{
                background: `${promo.accent}1A`,
                color: promo.accent,
              }}
            >
              {icons[promo.icon]}
            </div>

            <div className="promo-kicker">Collection {index + 1}</div>
            <h2 className="promo-title">{promo.title}</h2>
            <p className="promo-text">{promo.text}</p>

            <span className="promo-arrow">
              Explore
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>

            <div
              className="promo-line"
              style={{ background: `linear-gradient(90deg, ${promo.accent}, transparent)` }}
            />
          </motion.article>
        ))}
      </div>
    </section>
  );
}