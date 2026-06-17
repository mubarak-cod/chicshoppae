"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    eyebrow: "New Collection",
    headline: ["Dress Like", "You Mean It"],
    sub: "Curated pieces for the woman who moves with intention.",
    cta: "Shop Collection",
    ctaLink: "/shop?filter=new",
    secondaryCta: "View Lookbook",
    secondaryLink: "/shop?filter=collections",
    accent: "#C4895A",
    badge: "New Arrivals",
    image: "https://res.cloudinary.com/dmtfdnuap/image/upload/v1771478494/4eb78e23-ba0a-44ef-8a11-30b8fc0b8fe8.png",
  },
  {
    id: 2,
    eyebrow: "Staff Picks",
    headline: ["Effortless", "Every Day"],
    sub: "Timeless styles made for real life.",
    cta: "Shop Now",
    ctaLink: "/shop",
    secondaryCta: "See All Picks",
    secondaryLink: "/shop?filter=collections",
    accent: "#7A6550",
    badge: "Staff Picks",
    image: "https://res.cloudinary.com/dmtfdnuap/image/upload/v1771478273/63ae7494-33fc-4490-bed5-89676ab3c782.png",
  },
  {
    id: 3,
    eyebrow: "Limited Pieces",
    headline: ["Bold Looks,", "Real Prices"],
    sub: "Premium fashion without the premium price tag.",
    cta: "Shop Deals",
    ctaLink: "/shop?filter=deals",
    secondaryCta: "All Products",
    secondaryLink: "/shop",
    accent: "#9B5E3A",
    badge: "Limited",
    image: "https://res.cloudinary.com/dmtfdnuap/image/upload/v1771478494/4eb78e23-ba0a-44ef-8a11-30b8fc0b8fe8.png",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [direction, setDirection] = useState("next");
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const DURATION = 5000;

  const goTo = useCallback(
    (index, dir = "next") => {
      if (animating || index === current) return;
      setDirection(dir);
      setPrev(current);
      setAnimating(true);
      setCurrent(index);
      setProgress(0);
      setTimeout(() => {
        setPrev(null);
        setAnimating(false);
      }, 650);
    },
    [animating, current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, "next");
  }, [current, goTo]);

  const prev_slide = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, "prev");
  }, [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + 100 / (DURATION / 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [paused, next]);

  const slide = slides[current];
  const prevSlide = prev !== null ? slides[prev] : null;

  return (
    <>
      <style>{`
        .hero {
          position: relative;
          width: 100%;
          min-height: 92vh;
          overflow: hidden;
          background: var(--bg-primary);
        }

        .hero-slide {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 3rem 5vw;
          gap: 2rem;
          will-change: transform, opacity;
        }

        .hero-slide--enter-next { animation: slideInRight 0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
        .hero-slide--enter-prev { animation: slideInLeft 0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
        .hero-slide--exit-next  { animation: slideOutLeft 0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
        .hero-slide--exit-prev  { animation: slideOutRight 0.65s cubic-bezier(0.22,1,0.36,1) forwards; }

        @keyframes slideInRight  { from { transform: translateX(6%) scale(0.99); opacity: 0; } to { transform: translateX(0) scale(1); opacity: 1; } }
        @keyframes slideInLeft   { from { transform: translateX(-6%) scale(0.99); opacity: 0; } to { transform: translateX(0) scale(1); opacity: 1; } }
        @keyframes slideOutLeft  { from { transform: translateX(0) scale(1); opacity: 1; } to { transform: translateX(-5%) scale(0.99); opacity: 0; } }
        @keyframes slideOutRight { from { transform: translateX(0) scale(1); opacity: 1; } to { transform: translateX(5%) scale(0.99); opacity: 0; } }

        /* ── TEXT SIDE ── */
        .hero-text {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
          max-width: 520px;
          z-index: 2;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--text-secondary);
          animation: fadeUp 0.7s 0.1s both;
        }

        .hero-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--slide-accent);
          display: inline-block;
        }

        .hero-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 6vw, 88px);
          font-weight: 600;
          line-height: 1.0;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .hero-headline span { display: block; animation: fadeUp 0.7s both; }
        .hero-headline span:nth-child(1) { animation-delay: 0.15s; }
        .hero-headline span:nth-child(2) { animation-delay: 0.25s; }

        .hero-sub {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-secondary);
          max-width: 380px;
          animation: fadeUp 0.7s 0.3s both;
        }

        .hero-ctas {
          display: flex;
          align-items: center;
          gap: 1rem;
          animation: fadeUp 0.7s 0.4s both;
          flex-wrap: wrap;
        }

        .hero-cta-primary {
          background: var(--text-primary);
          color: var(--bg-primary);
          padding: 14px 28px;
          border-radius: 8px;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 500;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .hero-cta-primary:hover { opacity: 0.85; transform: translateY(-1px); }

        .hero-cta-secondary {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-secondary);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s, gap 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .hero-cta-secondary:hover { color: var(--text-primary); gap: 10px; }
        .hero-cta-secondary svg { transition: transform 0.2s; }
        .hero-cta-secondary:hover svg { transform: translateX(3px); }

        /* ── IMAGE SIDE ── */
        .hero-image-side {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          position: relative;
          padding: 2rem 0;
        }

        .hero-image-frame {
          position: relative;
          width: min(400px, 42vw);
          height: min(520px, 68vh);
          border-radius: 200px 200px 160px 160px;
          overflow: hidden;
          animation: scaleIn 0.8s 0.05s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes scaleIn {
          from { transform: scale(0.94); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }

        /* ── FLOATING BADGES ── */
        .hero-badge {
          position: absolute;
          bottom: 28px;
          left: -20px;
          background: var(--bg-card, #FDFAF5);
          border: 0.5px solid var(--border);
          border-radius: 12px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: fadeUp 0.7s 0.5s both;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          z-index: 3;
        }

        .hero-badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--slide-accent);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .hero-badge-text {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-primary);
          letter-spacing: 0.04em;
        }

        .hero-stat {
          position: absolute;
          top: 40px;
          right: -16px;
          background: var(--bg-card, #FDFAF5);
          border: 0.5px solid var(--border);
          border-radius: 12px;
          padding: 12px 18px;
          animation: fadeUp 0.7s 0.55s both;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          text-align: center;
          z-index: 3;
        }

        .hero-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1;
        }

        .hero-stat-label {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        /* ── ARROWS ── */
        .hero-arrow {
          position: absolute;
          bottom: 2rem;
          z-index: 10;
          background: var(--bg-card, #FDFAF5);
          border: 0.5px solid var(--border);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          color: var(--text-primary);
        }

        .hero-arrow:hover { background: var(--bg-secondary); transform: scale(1.05); }
        .hero-arrow--left  { left: 5vw; }
        .hero-arrow--right { left: calc(5vw + 56px); }

        /* ── DOTS ── */
        .hero-dots {
          position: absolute;
          bottom: 2.4rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 10;
        }

        .hero-dot {
          height: 2px;
          border-radius: 2px;
          background: var(--border-hover, rgba(26,23,20,0.25));
          cursor: pointer;
          transition: width 0.3s, background 0.3s;
          width: 24px;
          position: relative;
          overflow: hidden;
          border: none;
          padding: 0;
        }

        .hero-dot--active { background: var(--text-primary); width: 48px; }

        .hero-dot-fill {
          position: absolute;
          inset: 0;
          background: var(--slide-accent);
          transform-origin: left;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── TABLET (max 1024px) ── */
        @media (max-width: 1024px) {
          .hero-slide {
            grid-template-columns: 1fr 1fr;
            padding: 2rem 3vw;
            gap: 1.5rem;
          }
          .hero-image-frame {
            width: min(320px, 44vw);
            height: min(420px, 60vh);
          }
          .hero-badge { left: -8px; }
          .hero-stat  { right: -8px; }
        }

        /* ── MOBILE (max 768px) ── */
        @media (max-width: 768px) {
          .hero {
            min-height: unset;
            height: auto;
            padding-bottom: 5.5rem;
          }

          .hero-slide {
            position: relative;
            grid-template-columns: 1fr;
            padding: 1.5rem 1.25rem 1rem;
            gap: 1.5rem;
          }

          .hero-slide--enter-next,
          .hero-slide--enter-prev,
          .hero-slide--exit-next,
          .hero-slide--exit-prev {
            position: absolute;
            inset: 0;
          }

          .hero-image-side { order: -1; }

          .hero-image-frame {
            width: min(260px, 72vw);
            height: min(320px, 52vw);
            border-radius: 130px 130px 90px 90px;
            margin: 0 auto;
          }

          .hero-headline { font-size: clamp(36px, 10vw, 52px); }
          .hero-sub { font-size: 14px; }

          .hero-badge {
            bottom: 12px;
            left: 0;
          }
          .hero-stat {
            top: 12px;
            right: 0;
          }

          .hero-arrow--left  { left: 1.25rem; bottom: 1.5rem; }
          .hero-arrow--right { left: calc(1.25rem + 56px); bottom: 1.5rem; }
          .hero-dots { bottom: 1.8rem; }
        }

        /* ── SMALL MOBILE (max 480px) ── */
        @media (max-width: 480px) {
          .hero-image-frame {
            width: 75vw;
            height: 55vw;
            border-radius: 110px 110px 80px 80px;
          }
          .hero-headline { font-size: clamp(32px, 9vw, 46px); }
          .hero-ctas { gap: 0.75rem; }
          .hero-cta-primary { padding: 12px 20px; font-size: 11px; }
          .hero-stat { display: none; }
        }
      `}</style>

      <section
        className="hero"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{ "--slide-accent": slide.accent }}
      >
        {/* EXIT slide */}
        {prevSlide && (
          <div
            className={`hero-slide hero-slide--exit-${direction}`}
            style={{ "--slide-accent": prevSlide.accent }}
          >
            <HeroContent slide={prevSlide} />
            <HeroImage slide={prevSlide} />
          </div>
        )}

        {/* ENTER slide */}
        <div
          className={`hero-slide ${animating ? `hero-slide--enter-${direction}` : ""}`}
          style={{ "--slide-accent": slide.accent }}
        >
          <HeroContent slide={slide} />
          <HeroImage slide={slide} progress={progress} />
        </div>

        {/* ARROWS */}
        <button className="hero-arrow hero-arrow--left" onClick={prev_slide} aria-label="Previous slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className="hero-arrow hero-arrow--right" onClick={next} aria-label="Next slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* DOTS */}
        <div className="hero-dots">
          {slides.map((s, i) => (
            <button
              key={s.id}
              className={`hero-dot ${i === current ? "hero-dot--active" : ""}`}
              onClick={() => goTo(i, i > current ? "next" : "prev")}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === current && (
                <span
                  className="hero-dot-fill"
                  style={{ transform: `scaleX(${progress / 100})` }}
                />
              )}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function HeroContent({ slide }) {
  return (
    <div className="hero-text">
      <span className="hero-eyebrow">
        <span className="hero-eyebrow-dot" />
        {slide.eyebrow}
      </span>
      <h1 className="hero-headline">
        {slide.headline.map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </h1>
      <p className="hero-sub">{slide.sub}</p>
      <div className="hero-ctas">
        <Link href={slide.ctaLink} className="hero-cta-primary">
          {slide.cta}
        </Link>
        <Link href={slide.secondaryLink} className="hero-cta-secondary">
          {slide.secondaryCta}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function HeroImage({ slide }) {
  return (
    <div className="hero-image-side">
      <div className="hero-image-frame">
        <img
          src={slide.image}
          alt={slide.headline[0]}
          className="hero-img"
          loading="eager"
        />
      </div>

      <div className="hero-badge">
        <span className="hero-badge-dot" />
        <span className="hero-badge-text">{slide.badge}</span>
      </div>

      <div className="hero-stat">
        <div className="hero-stat-num">100+</div>
        <div className="hero-stat-label">Styles</div>
      </div>
    </div>
  );
}