"use client";

const marqueeItems = [
  "100+ Styles",
  "Fast Delivery",
  "New Arrivals Every Friday",
  "Secure Payment",
  "Made With Love",
  "Shop The Drop",
];

export default function MarqueeStrip() {
  // Duplicate items for seamless infinite loop
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <>
      <style>{`
        .marquee-section {
          background: var(--text-primary, #1A1714);
          padding: 0.9rem 0;
          overflow: hidden;
          position: relative;
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 28s linear infinite;
        }

        .marquee-section:hover .marquee-track {
          animation-play-state: paused;
        }

        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .marquee-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 0 1.5rem;
          white-space: nowrap;
        }

        .marquee-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 19px;
          font-weight: 500;
          color: var(--bg-primary, #F5F0E8);
          letter-spacing: 0.01em;
        }

        .marquee-divider {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E8A0BF, #C4895A);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .marquee-text { font-size: 15px; }
          .marquee-item { gap: 1rem; padding: 0 1rem; }
          .marquee-track { animation-duration: 20s; }
        }
      `}</style>

      <div className="marquee-section">
        <div className="marquee-track">
          {items.map((item, i) => (
            <div className="marquee-item" key={i}>
              <span className="marquee-text">{item}</span>
              <span className="marquee-divider" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}