"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useCountUp(target, inView, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return count;
}

const stats = [
  { id: 1, value: 100, suffix: "+", label: "Unique Styles" },
  { id: 2, value: 500, suffix: "+", label: "Happy Customers" },
  { id: 3, value: 36, suffix: "", label: "States Delivered To" },
  { id: 4, value: 5, suffix: "★", label: "Average Rating" },
];

export default function MidBanner() {
  const [bannerRef, bannerInView] = useInView(0.15);
  const [statsRef, statsInView] = useInView(0.2);

  return (
    <>
      <style>{`
        .mb-section {
          padding: 5rem 0;
          background: var(--bg-secondary, #EDE8DE);
          border-top: 0.5px solid var(--border, rgba(26,23,20,0.12));
          border-bottom: 0.5px solid var(--border, rgba(26,23,20,0.12));
          overflow: hidden;
        }

        .mb-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ── EDITORIAL BANNER ── */
        .mb-banner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          margin-bottom: 4.5rem;
        }

        .mb-text {
          display: flex;
          flex-direction: column;
          gap: 1.3rem;
        }

        .mb-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          width: fit-content;
        }

        .mb-eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E8A0BF, #C4895A);
        }

        .mb-eyebrow-text {
          background: linear-gradient(90deg, #E8A0BF, #C4895A);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .mb-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(34px, 4.5vw, 56px);
          font-weight: 600;
          line-height: 1.08;
          color: var(--text-primary, #1A1714);
        }

        .mb-sub {
          font-size: 15px;
          line-height: 1.75;
          color: var(--text-secondary, #6B6560);
          max-width: 420px;
        }

        .mb-ctas {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }

        .mb-cta-primary {
          background: var(--text-primary, #1A1714);
          color: var(--bg-primary, #F5F0E8);
          padding: 14px 30px;
          border-radius: 9px;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 500;
          text-decoration: none;
          transition: opacity 0.25s, transform 0.25s, box-shadow 0.25s;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .mb-cta-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #E8A0BF, #C4895A);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .mb-cta-primary span { position: relative; z-index: 1; }
        .mb-cta-primary:hover::before { opacity: 1; }
        .mb-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(196,137,90,0.28); }

        .mb-cta-secondary {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-secondary, #6B6560);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s, gap 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .mb-cta-secondary:hover { color: var(--text-primary, #1A1714); gap: 10px; }

        /* ── IMAGE SIDE ── */
        .mb-image-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mb-image-frame {
          width: 100%;
          max-width: 440px;
          aspect-ratio: 4/5;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 20px 60px rgba(26,23,20,0.12);
        }

        .mb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }

        .mb-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: var(--bg-card, #FDFAF5);
          color: var(--text-muted, #9E9890);
        }

        .mb-floating-card {
          position: absolute;
          bottom: -20px;
          left: -24px;
          background: var(--bg-card, #FDFAF5);
          border: 0.5px solid var(--border, rgba(26,23,20,0.12));
          border-radius: 14px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 12px 36px rgba(0,0,0,0.1);
        }

        .mb-floating-avatar-stack {
          display: flex;
        }
        .mb-floating-avatar {
          width: 26px; height: 26px;
          border-radius: 50%;
          border: 2px solid var(--bg-card, #FDFAF5);
          margin-left: -8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 500;
          color: #fff;
        }
        .mb-floating-avatar:first-child { margin-left: 0; }

        .mb-floating-text {
          font-size: 11.5px;
          color: var(--text-primary, #1A1714);
          font-weight: 500;
        }

        .mb-floating-subtext {
          font-size: 10px;
          color: var(--text-muted, #9E9890);
        }

        /* ── STATS ROW ── */
        .mb-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          padding-top: 3.5rem;
          border-top: 0.5px solid var(--border, rgba(26,23,20,0.12));
        }

        .mb-stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 4px;
          padding: 1rem;
          border-radius: 14px;
          transition: background 0.3s, transform 0.3s;
        }
        .mb-stat-card:hover {
          background: var(--bg-card, #FDFAF5);
          transform: translateY(-3px);
        }

        .mb-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 44px);
          font-weight: 600;
          line-height: 1;
          background: linear-gradient(135deg, var(--text-primary, #1A1714), #C4895A);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .mb-stat-label {
          font-size: 11.5px;
          letter-spacing: 0.04em;
          color: var(--text-secondary, #6B6560);
          margin-top: 2px;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .mb-banner { gap: 2rem; }
          .mb-floating-card { left: -10px; bottom: -16px; }
        }

        @media (max-width: 768px) {
          .mb-section { padding: 3.5rem 0; }
          .mb-banner {
            grid-template-columns: 1fr;
            gap: 2.5rem;
            margin-bottom: 3rem;
          }
          .mb-image-wrap { order: -1; }
          .mb-image-frame { max-width: 320px; margin: 0 auto; }
          .mb-text { text-align: center; align-items: center; }
          .mb-sub { max-width: 100%; }
          .mb-ctas { justify-content: center; }
          .mb-floating-card { left: 8px; bottom: -16px; }
          .mb-stats { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        }

        @media (max-width: 480px) {
          .mb-stats { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          .mb-stat-num { font-size: 28px; }
          .mb-floating-card { display: none; }
        }
      `}</style>

      <section className="mb-section" ref={bannerRef}>
        <div className="mb-container">

          {/* Editorial Banner */}
          <div
            className="mb-banner"
            style={{
              opacity: bannerInView ? 1 : 0,
              transform: bannerInView ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div className="mb-text">
              <span className="mb-eyebrow">
                <span className="mb-eyebrow-dot" />
                <span className="mb-eyebrow-text">Limited Time Offer</span>
              </span>
              <h2 className="mb-title">
                Style That Speaks<br />Without Saying a Word
              </h2>
              <p className="mb-sub">
                Every piece at Chic Shoppae is chosen to make you feel as good as you look. 
                New drops every Friday — be the first to shop them.
              </p>
              <div className="mb-ctas">
                <Link href="/shop?filter=new" className="mb-cta-primary">
                  <span>Shop New Arrivals</span>
                </Link>
                <Link href="/shop" className="mb-cta-secondary">
                  Browse All
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>
            </div>

            <div className="mb-image-wrap">
              <div className="mb-image-frame">
                <div className="mb-img-placeholder">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.25 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span style={{ fontSize: "10px", letterSpacing: ".15em", textTransform: "uppercase", opacity: 0.5 }}>
                    Add lifestyle photo
                  </span>
                </div>
                {/* Replace with: <img src="cloudinary-url" className="mb-img" alt="" /> */}
              </div>

              <div className="mb-floating-card">
                <div className="mb-floating-avatar-stack">
                  <div className="mb-floating-avatar" style={{ background: "#E8A0BF" }}>A</div>
                  <div className="mb-floating-avatar" style={{ background: "#C4895A" }}>B</div>
                  <div className="mb-floating-avatar" style={{ background: "#F472B6" }}>T</div>
                </div>
                <div>
                  <div className="mb-floating-text">500+ happy customers</div>
                  <div className="mb-floating-subtext">Shopping with confidence</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mb-stats" ref={statsRef}>
            {stats.map((stat, i) => (
              <StatCard key={stat.id} stat={stat} inView={statsInView} delay={i * 0.1} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

function StatCard({ stat, inView, delay }) {
  const count = useCountUp(stat.value, inView);
  return (
    <div
      className="mb-stat-card"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      <span className="mb-stat-num">{count}{stat.suffix}</span>
      <span className="mb-stat-label">{stat.label}</span>
    </div>
  );
}