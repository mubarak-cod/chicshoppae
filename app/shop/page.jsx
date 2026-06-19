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
    ctaLabel: "Shop Now",
    ctaHref: "/shop?filter=new",
    badge: "Up to 40% Off",
  },
  {
    id: 2,
    image: "/images/four.jpg",
    title: "Soft Glam, Sharp Style",
    description:
      "Polished looks that move easily from day plans to evening plans without losing their edge.",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
    badge: "Limited Drop",
  },
  {
    id: 3,
    image: "/images/five.jpg",
    title: "Designed To Be Noticed",
    description:
      "A premium edit of fashion-forward silhouettes, tailored textures, and effortless confidence.",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
    badge: "Fresh Picks",
  },
  {
    id: 4,
    image: "/images/seven.jpg",
    title: "Luxury Looks, Everyday Ease",
    description:
      "Wear-now styles with a refined feel, made to keep your wardrobe feeling current and elevated.",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
    badge: "New Arrivals",
  },
  {
    id: 5,
    image: "/images/eight.jpg",
    title: "The Chic Edit Is Here",
    description:
      "Browse curated fashion favorites with a polished finish and a modern, feminine edge.",
    ctaLabel: "Shop Now",
    ctaHref: "/shop",
    badge: "Best Sellers",
  },
];

function BannerContent({ slide }) {
  return (
    <motion.div
      className="shop-hero-copy"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="shop-hero-badge">{slide.badge}</span>
      <h1 className="shop-hero-title">{slide.title}</h1>
      <p className="shop-hero-description">{slide.description}</p>
      <Link href={slide.ctaHref} className="shop-hero-cta">
        {slide.ctaLabel}
      </Link>
    </motion.div>
  );
}

export default function ShopPage() {
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

  const goTo = (nextIndex) => {
    setDirection(nextIndex > current ? 1 : -1);
    setCurrent((nextIndex + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (slideDirection) => ({
      x: slideDirection > 0 ? 64 : -64,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (slideDirection) => ({
      x: slideDirection > 0 ? -64 : 64,
      opacity: 0,
    }),
  };

  const currentSlide = slides[current];

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
          height: clamp(240px, 42vw, 580px);
          position: relative;
          overflow: hidden;
          background: var(--bg-primary);
          border-bottom: 0.5px solid var(--border);
        }

        .shop-hero-track {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .shop-hero-slide {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .shop-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
        }

        .shop-hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(26, 23, 20, 0.78) 0%, rgba(26, 23, 20, 0.4) 38%, rgba(26, 23, 20, 0.12) 68%, rgba(26, 23, 20, 0.16) 100%),
            linear-gradient(0deg, rgba(26, 23, 20, 0.18), rgba(26, 23, 20, 0.18));
        }

        [data-theme="dark"] .shop-hero-overlay {
          background:
            linear-gradient(90deg, rgba(17, 16, 16, 0.8) 0%, rgba(17, 16, 16, 0.42) 38%, rgba(17, 16, 16, 0.14) 68%, rgba(17, 16, 16, 0.18) 100%),
            linear-gradient(0deg, rgba(17, 16, 16, 0.2), rgba(17, 16, 16, 0.2));
        }

        .shop-hero-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          margin-left: 20px;
        }

        .shop-hero-copy {
          max-width: 620px;
          padding: 0 clamp(1rem, 4vw, 3.5rem);
          color: var(--bg-primary);
        }

        .shop-hero-badge {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          margin-bottom: 1rem;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(245, 240, 232, 0.12);
          border: 0.5px solid rgba(245, 240, 232, 0.18);
          color: var(--bg-primary);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
        }

        .shop-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(30px, 4vw, 58px);
          line-height: 0.95;
          margin-bottom: 0.85rem;
          letter-spacing: -0.02em;
          text-wrap: balance;
        }

        .shop-hero-description {
          max-width: 520px;
          font-size: clamp(13px, 1.6vw, 17px);
          line-height: 1.7;
          color: rgba(245, 240, 232, 0.88);
          margin-bottom: 1.25rem;
        }

        .shop-hero-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          color: var(--text-primary);
          border: none;
          border-radius: 999px;
          padding: 12px 20px;
          text-decoration: none;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
          transition: transform 0.2s ease, opacity 0.2s ease, background 0.2s ease;
        }

        .shop-hero-cta:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }

        .shop-hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 42px;
          height: 42px;
          border-radius: 999px;
          border: 0.5px solid rgba(245, 240, 232, 0.2);
          background: rgba(245, 240, 232, 0.12);
          color: var(--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.14);
          backdrop-filter: blur(10px);
          transition: transform 0.2s ease, opacity 0.2s ease, background 0.2s ease;
        }

        .shop-hero-arrow:hover {
          transform: translateY(-50%) scale(1.05);
          background: rgba(245, 240, 232, 0.18);
        }

        .shop-hero-arrow--left {
          left: 16px;
        }

        .shop-hero-arrow--right {
          right: 16px;
        }

        .shop-hero-dots {
          position: absolute;
          left: 50%;
          bottom: 18px;
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
          background: rgba(245, 240, 232, 0.32);
          padding: 0;
          overflow: hidden;
          cursor: pointer;
        }

        .shop-hero-dot-active {
          background: rgba(245, 240, 232, 0.55);
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
            height: clamp(210px, 38vw, 320px);
          }

          .shop-hero-copy {
            padding: 0 1rem;
          }

          .shop-hero-title {
            font-size: clamp(24px, 7vw, 34px);
          }

          .shop-hero-description {
            max-width: 320px;
            font-size: 12px;
            margin-bottom: 1rem;
          }

          .shop-hero-arrow {
            width: 36px;
            height: 36px;
          }

          .shop-hero-arrow--left {
            left: 10px;
          }

          .shop-hero-arrow--right {
            right: 10px;
          }

          .shop-hero-dots {
            bottom: 12px;
            gap: 6px;
          }

          .shop-hero-dot {
            width: 18px;
            height: 3px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .shop-hero-arrow,
          .shop-hero-cta {
            transition: none;
          }
        }
      `}</style>

      <div className="shop-hero-track">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide.id}
            className="shop-hero-slide"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={currentSlide.image}
              alt={`Shop banner slide ${currentSlide.id}`}
              fill
              priority={current === 0}
              loading={current === 0 ? "eager" : "lazy"}
              sizes="100vw"
              className="shop-hero-image"
            />
            <div className="shop-hero-overlay" />
          </motion.div>
        </AnimatePresence>

        <div className="shop-hero-content">
          <BannerContent slide={currentSlide} />
        </div>

        <button
          className="shop-hero-arrow shop-hero-arrow--left"
          onClick={() => goTo(current - 1)}
          aria-label="Previous slide"
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          className="shop-hero-arrow shop-hero-arrow--right"
          onClick={() => goTo(current + 1)}
          aria-label="Next slide"
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div className="shop-hero-dots" aria-label="Slide position">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`shop-hero-dot ${index === current ? "shop-hero-dot-active" : ""}`}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            >
              {index === current && <span className="shop-hero-progress" />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
