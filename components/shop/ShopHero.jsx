"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    image: "/images/one.jpg",
    title: "New Season, New Energy",
    description:
      "Discover statement pieces and elevated essentials curated for the modern Chic Shoppae woman.",
    ctaLabel: "Shop the Collection",
    ctaHref: "#products",
    badge: "Up to 40% Off",
  },
  {
    id: 2,
    image: "/images/four.jpg",
    title: "Soft Glam, Sharp Style",
    description:
      "Polished looks that move easily from day plans to evening plans without losing their edge.",
    ctaLabel: "Shop the Collection",
    ctaHref: "#products",
    badge: "Limited Drop",
  },
  {
    id: 3,
    image: "/images/five.jpg",
    title: "Designed To Be Noticed",
    description:
      "A premium edit of fashion-forward silhouettes, tailored textures, and effortless confidence.",
    ctaLabel: "Shop the Collection",
    ctaHref: "#products",
    badge: "Fresh Picks",
  },
  {
    id: 4,
    image: "/images/seven.jpg",
    title: "Luxury Looks, Everyday Ease",
    description:
      "Wear-now styles with a refined feel, made to keep your wardrobe feeling current and elevated.",
    ctaLabel: "Shop the Collection",
    ctaHref: "#products",
    badge: "New Arrivals",
  },
  {
    id: 5,
    image: "/images/eight.jpg",
    title: "The Chic Edit Is Here",
    description:
      "Browse curated fashion favorites with a polished finish and a modern, feminine edge.",
    ctaLabel: "Shop the Collection",
    ctaHref: "#products",
    badge: "Best Sellers",
  },
];

export default function ShopHero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((index) => (index + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [paused]);

  const slide = slides[current];

  const goTo = (nextIndex) => {
    setDirection(nextIndex > current ? 1 : -1);
    setCurrent((nextIndex + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (slideDirection) => ({ x: slideDirection > 0 ? 72 : -72, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (slideDirection) => ({ x: slideDirection > 0 ? -72 : 72, opacity: 0 }),
  };

  return (
    <section
      className="shop-hero"
      aria-label="Shop banner slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{`
        .shop-hero {
          width: 100%;
          height: 80vh;
          position: relative;
          overflow: hidden;
          background: var(--bg-primary);
          border-bottom: 0.5px solid var(--border);
        }

        .shop-hero-track,
        .shop-hero-slide,
        .shop-hero-image {
          width: 100%;
          height: 100%;
        }

        .shop-hero-slide {
          position: absolute;
          inset: 0;
        }

        .shop-hero-image {
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .shop-hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(18, 16, 15, 0.78) 0%, rgba(18, 16, 15, 0.42) 36%, rgba(18, 16, 15, 0.14) 65%, rgba(18, 16, 15, 0.1) 100%),
            linear-gradient(0deg, rgba(18, 16, 15, 0.16), rgba(18, 16, 15, 0.16));
        }

        .shop-hero-copy {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          padding: 0 clamp(1rem, 5vw, 4rem);
        }

        .shop-hero-copy-inner {
          max-width: 640px;
          color: var(--bg-primary);
        }

        .shop-hero-badge {
          display: inline-flex;
          padding: 7px 12px;
          margin-bottom: 1rem;
          border-radius: 999px;
          border: 0.5px solid rgba(245, 240, 232, 0.18);
          background: rgba(245, 240, 232, 0.12);
          color: var(--bg-primary);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
        }

        .shop-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 5vw, 68px);
          line-height: 0.95;
          letter-spacing: -0.03em;
          margin-bottom: 0.9rem;
          max-width: 11ch;
          text-wrap: balance;
        }

        .shop-hero-description {
          max-width: 520px;
          font-size: clamp(14px, 1.6vw, 17px);
          line-height: 1.7;
          color: rgba(245, 240, 232, 0.88);
          margin-bottom: 1.4rem;
        }

        .shop-hero-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 13px 22px;
          border-radius: 999px;
          background: var(--bg-primary);
          color: var(--text-primary);
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .shop-hero-cta:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }

        .shop-hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: 0.5px solid rgba(245, 240, 232, 0.18);
          background: rgba(245, 240, 232, 0.12);
          color: var(--bg-primary);
          backdrop-filter: blur(10px);
          display: grid;
          place-items: center;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.14);
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .shop-hero-arrow:hover {
          transform: translateY(-50%) scale(1.05);
          background: rgba(245, 240, 232, 0.18);
        }

        .shop-hero-arrow--left { left: 18px; }
        .shop-hero-arrow--right { right: 18px; }

        .shop-hero-dots {
          position: absolute;
          left: 50%;
          bottom: 20px;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 3;
        }

        .shop-hero-dot {
          width: 24px;
          height: 3px;
          border: none;
          border-radius: 999px;
          background: rgba(245, 240, 232, 0.3);
          padding: 0;
          cursor: pointer;
          overflow: hidden;
        }

        .shop-hero-dot-active {
          background: rgba(245, 240, 232, 0.58);
        }

        .shop-hero-progress {
          display: block;
          width: 100%;
          height: 100%;
          background: var(--bg-primary);
          transform-origin: left;
        }

        @media (max-width: 768px) {
          .shop-hero {
            height: 60vh;
          }

          .shop-hero-title {
            font-size: clamp(28px, 8vw, 38px);
            max-width: 9ch;
          }

          .shop-hero-description {
            max-width: 320px;
            margin-bottom: 1.1rem;
          }

          .shop-hero-arrow {
            width: 38px;
            height: 38px;
          }

          .shop-hero-arrow--left { left: 10px; }
          .shop-hero-arrow--right { right: 10px; }
          .shop-hero-dots { bottom: 12px; }
          .shop-hero-dot { width: 18px; }
        }
      `}</style>

      <div className="shop-hero-track">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={slide.id}
            className="shop-hero-slide"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={current === 0}
              loading={current === 0 ? "eager" : "lazy"}
              sizes="100vw"
              className="shop-hero-image"
            />
            <div className="shop-hero-overlay" />
          </motion.div>
        </AnimatePresence>

        <div className="shop-hero-copy">
          <motion.div
            key={slide.id}
            className="shop-hero-copy-inner"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="shop-hero-badge">{slide.badge}</span>
            <h1 className="shop-hero-title">{slide.title}</h1>
            <p className="shop-hero-description">{slide.description}</p>
            <Link href={slide.ctaHref} className="shop-hero-cta">
              {slide.ctaLabel}
            </Link>
          </motion.div>
        </div>

        <button className="shop-hero-arrow shop-hero-arrow--left" type="button" aria-label="Previous slide" onClick={() => goTo(current - 1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button className="shop-hero-arrow shop-hero-arrow--right" type="button" aria-label="Next slide" onClick={() => goTo(current + 1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div className="shop-hero-dots" aria-label="Slide position">
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`shop-hero-dot ${index === current ? "shop-hero-dot-active" : ""}`}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === current && <span className="shop-hero-progress" />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}