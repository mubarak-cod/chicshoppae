import { Skeleton } from "@/components/Skeleton";

export default function CheckoutLoading() {
  return (
    <main className="checkout-page">
      <style>{`
        .checkout-page { padding: clamp(1.25rem, 3vw, 2.5rem) clamp(1rem, 4vw, 3rem) 4rem; }
        .checkout-shell {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 420px; gap: 2rem; align-items: start;
        }
        .skel-panel, .skel-summary {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 28px; padding: 1.5rem;
        }
        .skel-grid { display: grid; gap: 0.95rem; grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: 1rem; }
        .skel-item { display: grid; grid-template-columns: 72px 1fr auto; gap: 0.9rem; padding: 0.85rem 0; border-top: 1px solid var(--border); }
        .skel-item:first-child { border-top: none; padding-top: 0; }
        @media (max-width: 960px) { .checkout-shell { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .skel-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div className="checkout-shell">
        <section className="skel-panel">
          <Skeleton style={{ width: "180px", height: "2.5rem", marginBottom: "0.6rem" }} />
          <Skeleton style={{ width: "70%", height: "1rem", marginBottom: "1.4rem" }} />
          <div className="skel-grid">
            <Skeleton style={{ height: "46px", gridColumn: "1 / -1" }} />
            <Skeleton style={{ height: "46px" }} />
            <Skeleton style={{ height: "46px" }} />
            <Skeleton style={{ height: "46px" }} />
            <Skeleton style={{ height: "46px" }} />
            <Skeleton style={{ height: "46px" }} />
            <Skeleton style={{ height: "100px", gridColumn: "1 / -1" }} />
          </div>
          <Skeleton style={{ height: "90px", marginTop: "1.2rem", borderRadius: "20px" }} />
        </section>

        <aside className="skel-summary">
          <Skeleton style={{ width: "160px", height: "2rem", marginBottom: "0.5rem" }} />
          <Skeleton style={{ width: "80px", height: "0.9rem", marginBottom: "1rem" }} />
          {[1, 2].map((i) => (
            <div className="skel-item" key={i}>
              <Skeleton style={{ width: "72px", height: "86px" }} />
              <div>
                <Skeleton style={{ width: "80%", height: "0.9rem", marginBottom: "0.4rem" }} />
                <Skeleton style={{ width: "60%", height: "0.75rem", marginBottom: "0.3rem" }} />
                <Skeleton style={{ width: "40%", height: "0.75rem" }} />
              </div>
              <Skeleton style={{ width: "50px", height: "0.9rem" }} />
            </div>
          ))}
          <Skeleton style={{ height: "20px", marginTop: "1rem" }} />
          <Skeleton style={{ height: "48px", marginTop: "1rem", borderRadius: "999px" }} />
        </aside>
      </div>
    </main>
  );
}