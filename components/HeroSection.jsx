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
    image: "/images/one.jpg",
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
   image: "/images/eight.jpg",
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
   image: "/images/three.jpg",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("next");
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  const DURATION = 5000;

  // Detect mobile/tablet — disable complex animation below 1024px
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setContentReady(false);
    const frame = requestAnimationFrame(() => setContentReady(true));
    return () => cancelAnimationFrame(frame);
  }, [current, isMobile]);

  const goTo = useCallback(
    (index, dir = "next") => {
      if (animating || index === current) return;
      setDirection(dir);
      setAnimating(true);
      setCurrent(index);
      setProgress(0);
      setTimeout(() => setAnimating(false), isMobile ? 300 : 650);
    },
    [animating, current, isMobile]
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
        if (p >= 100) { next(); return 0; }
        return p + 100 / (DURATION / 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <>
      <style>{`
        /* ── DESKTOP: two-column absolute positioned slides ── */
        .hero {
          position: relative;
          width: 100%;
          height: 92vh;
          min-height: 580px;
          max-height: 900px;
          overflow: hidden;
          background: var(--bg-primary);
        }

        .hero-slide {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 0 5vw;
          gap: 2rem;
          will-change: transform, opacity;
        }

        .hero-slide--enter-next { animation: slideInRight 0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
        .hero-slide--enter-prev { animation: slideInLeft 0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
        .hero-slide--exit-next  { animation: slideOutLeft 0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
        .hero-slide--exit-prev  { animation: slideOutRight 0.65s cubic-bezier(0.22,1,0.36,1) forwards; }

        @keyframes slideInRight  { from { transform: translateX(5%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInLeft   { from { transform: translateX(-5%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutLeft  { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-4%); opacity: 0; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(4%); opacity: 0; } }

        /* ── TEXT ── */
        .hero-text {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
          max-width: 520px;
          z-index: 2;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
          will-change: opacity, transform;
        }

        .hero-image-side {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.82s cubic-bezier(0.22,1,0.36,1), transform 0.82s cubic-bezier(0.22,1,0.36,1);
          transition-delay: 80ms;
          will-change: opacity, transform;
        }

        .hero-slide--content-initial .hero-text,
        .hero-slide--content-initial .hero-image-side,
        .hero-slide--enter-next .hero-text,
        .hero-slide--enter-prev .hero-text,
        .hero-slide--enter-next .hero-image-side,
        .hero-slide--enter-prev .hero-image-side {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .hero-eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--slide-accent);
          display: inline-block;
          animation: pulse 2s infinite;
        }

        .hero-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(44px, 6vw, 88px);
          font-weight: 600;
          line-height: 1.0;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }
        .hero-headline span { display: block; }

        .hero-sub {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-secondary);
          max-width: 380px;
        }

        .hero-ctas {
          display: flex;
          align-items: center;
          gap: 1rem;
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

        /* ── IMAGE (desktop) ── */
        .hero-image-side {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          position: relative;
        }

        .hero-image-frame {
          width: min(400px, 42vw);
          height: min(520px, 70vh);
          border-radius: 200px 200px 160px 160px;
          overflow: hidden;
        }

        .hero-img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }

        /* ── FLOATING BADGES ── */
        .hero-badge {
          position: absolute;
          bottom: 28px; left: -20px;
          background: var(--bg-card, #FDFAF5);
          border: 0.5px solid var(--border);
          border-radius: 12px;
          padding: 10px 16px;
          display: flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          z-index: 3;
        }

        .hero-badge-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--slide-accent);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(0.8); }
        }

        .hero-badge-text {
          font-size: 12px; font-weight: 500;
          color: var(--text-primary);
          letter-spacing: 0.04em;
        }

        .hero-stat {
          position: absolute;
          top: 40px; right: -16px;
          background: var(--bg-card, #FDFAF5);
          border: 0.5px solid var(--border);
          border-radius: 12px;
          padding: 12px 18px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          text-align: center; z-index: 3;
        }

        .hero-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 600;
          color: var(--text-primary); line-height: 1;
        }

        .hero-stat-label {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        /* ── ARROWS & DOTS ── */
        .hero-arrow {
          position: absolute;
          bottom: 2rem; z-index: 10;
          background: var(--bg-card, #FDFAF5);
          border: 0.5px solid var(--border);
          width: 44px; height: 44px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          color: var(--text-primary);
        }
        .hero-arrow:hover { background: var(--bg-secondary); transform: scale(1.05); }
        .hero-arrow--left  { left: 5vw; }
        .hero-arrow--right { left: calc(5vw + 56px); }

        .hero-dots {
          position: absolute;
          bottom: 2.4rem; left: 50%;
          transform: translateX(-50%);
          display: flex; align-items: center; gap: 8px;
          z-index: 10;
        }

        .hero-dot {
          height: 2px; border-radius: 2px;
          background: var(--border-hover, rgba(26,23,20,0.25));
          cursor: pointer;
          transition: width 0.3s, background 0.3s;
          width: 24px;
          position: relative; overflow: hidden;
          border: none; padding: 0;
        }
        .hero-dot--active { background: var(--text-primary); width: 48px; }

        .hero-dot-fill {
          position: absolute; inset: 0;
          background: var(--slide-accent);
          transform-origin: left;
        }

        /* ════════════════════════════════════════
           TABLET + MOBILE — completely different layout
           No absolute positioning, no complex animation
           Text on top, image below, full width
        ════════════════════════════════════════ */
        @media (max-width: 1023px) {
          .hero {
            height: auto;
            min-height: unset;
            max-height: unset;
            overflow: visible;
          }

          /* Hide the desktop absolute slide wrapper */
          .hero-slide {
            position: static !important;
            display: block;
            padding: 0;
            animation: none !important;
          }

          /* Only show the current slide, hide exit slide */
          .hero-slide--exit-next,
          .hero-slide--exit-prev {
            display: none !important;
          }

          /* Simple fade for enter */
          .hero-slide--enter-next,
          .hero-slide--enter-prev {
            animation: mobileFade 0.3s ease forwards !important;
          }

          @keyframes mobileFade {
            from { opacity: 0; }
            to   { opacity: 1; }
          }

          /* ── TEXT: full width, top ── */
          .hero-text {
            max-width: 100%;
            width: 100%;
            padding: 2.5rem 1.5rem 1.5rem;
            gap: 1.1rem;
            text-align: center;
            align-items: center;
            opacity: 1;
            transform: none;
          }

          .hero-headline {
            font-size: clamp(38px, 9vw, 58px);
          }

          .hero-sub {
            max-width: 480px;
            font-size: 14.5px;
          }

          .hero-ctas {
            justify-content: center;
          }

          /* ── IMAGE: full width, below text ── */
          .hero-image-side {
            width: 100%;
            height: auto;
            padding: 1rem 1.5rem 1.5rem;
            justify-content: center;
            align-items: center;
            opacity: 1;
            transform: none;
          }

          .hero-image-frame {
            width: min(320px, 70vw);
            height: min(400px, 60vw);
            border-radius: 160px 160px 120px 120px;
          }

          .hero-badge {
            bottom: 16px;
            left: max(calc(50% - 260px), 8px);
          }

          .hero-stat {
            top: 16px;
            right: max(calc(50% - 260px), 8px);
          }

          /* Arrows sit below image */
          .hero-arrow {
            position: static;
            margin: 0;
          }

          .hero-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            padding: 1rem 0 2rem;
          }

          .hero-dots {
            position: static;
            transform: none;
          }
        }

        @media (max-width: 480px) {
          .hero-image-frame {
            width: 78vw;
            height: 62vw;
            border-radius: 130px 130px 90px 90px;
          }
          .hero-stat { display: none; }
          .hero-text { padding: 2rem 1.25rem 1rem; }
          .hero-headline { font-size: clamp(34px, 9vw, 48px); }
          .hero-image-side { padding: 0.5rem 1.25rem 1rem; }
        }
      `}</style>

      <section
        className="hero"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{ "--slide-accent": slide.accent }}
      >
        {/* Desktop: exit slide (absolute, animating out) */}
        {!isMobile && (
          <>
            {/* rendered via desktop-only logic below */}
          </>
        )}

        {isMobile ? (
          /* ── MOBILE/TABLET LAYOUT ── */
          <div
            className={`hero-slide ${animating ? `hero-slide--enter-${direction}` : ""} ${contentReady ? "" : "hero-slide--content-initial"}`}
            style={{ "--slide-accent": slide.accent }}
          >
            <HeroContent slide={slide} />
            <div className="hero-image-side">
              <div className="hero-image-frame">
                <img src={slide.image} alt={slide.headline[0]} className="hero-img" loading="eager" />
              </div>
              
              <div className="hero-stat">
                <div className="hero-stat-num">100+</div>
                <div className="hero-stat-label">Styles</div>
              </div>
            </div>

            {/* Controls below image on mobile */}
            <div className="hero-controls">
              <button className="hero-arrow" onClick={prev_slide} aria-label="Previous slide">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div className="hero-dots">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    className={`hero-dot ${i === current ? "hero-dot--active" : ""}`}
                    onClick={() => goTo(i, i > current ? "next" : "prev")}
                    aria-label={`Go to slide ${i + 1}`}
                  >
                    {i === current && (
                      <span className="hero-dot-fill" style={{ transform: `scaleX(${progress / 100})` }} />
                    )}
                  </button>
                ))}
              </div>
              <button className="hero-arrow" onClick={next} aria-label="Next slide">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* ── DESKTOP LAYOUT ── */
          <>
            {/* We need prev for desktop exit animation — track it */}
            <DesktopSlider
              slides={slides}
              current={current}
              direction={direction}
              animating={animating}
              contentReady={contentReady}
              progress={progress}
              goTo={goTo}
              next={next}
              prev_slide={prev_slide}
            />
          </>
        )}
      </section>
    </>
  );
}

/* Desktop keeps the old exit/enter dual-slide animation */
function DesktopSlider({ slides, current, direction, animating, contentReady, progress, goTo, next, prev_slide }) {
  const [prevIndex, setPrevIndex] = useState(null);

  useEffect(() => {
    if (animating) {
      // prevIndex is set before current changes — capture it
    } else {
      setPrevIndex(null);
    }
  }, [animating]);

  // Track previous on direction change
  const prevSlide = prevIndex !== null ? slides[prevIndex] : null;
  const slide = slides[current];

  return (
    <>
      {prevSlide && (
        <div
          className={`hero-slide hero-slide--exit-${direction}`}
          style={{ "--slide-accent": prevSlide.accent }}
        >
          <HeroContent slide={prevSlide} />
          <HeroImageDesktop slide={prevSlide} />
        </div>
      )}

      <div
        className={`hero-slide ${animating ? `hero-slide--enter-${direction}` : ""} ${contentReady ? "" : "hero-slide--content-initial"}`}
        style={{ "--slide-accent": slide.accent }}
      >
        <HeroContent slide={slide} />
        <HeroImageDesktop slide={slide} progress={progress} />
      </div>

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

      <div className="hero-dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`hero-dot ${i === current ? "hero-dot--active" : ""}`}
            onClick={() => goTo(i, i > current ? "next" : "prev")}
            aria-label={`Go to slide ${i + 1}`}
          >
            {i === current && (
              <span className="hero-dot-fill" style={{ transform: `scaleX(${progress / 100})` }} />
            )}
          </button>
        ))}
      </div>
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
        <Link href={slide.ctaLink} className="hero-cta-primary">{slide.cta}</Link>
        <Link href={slide.secondaryLink} className="hero-cta-secondary">
          {slide.secondaryCta}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function HeroImageDesktop({ slide }) {
  return (
    <div className="hero-image-side">
      <div className="hero-image-frame">
        <img src={slide.image} alt={slide.headline[0]} className="hero-img" loading="eager" />
      </div>
      <div className="hero-badge">
        {/* <span className="hero-badge-dot" /> */}
        {/* <span className="hero-badge-text">{slide.badge}</span> */}
      </div>
      <div className="hero-stat">
        <div className="hero-stat-num">100+</div>
        <div className="hero-stat-label">Styles</div>
      </div>
    </div>
  );
}