"use client";

export default function Loading() {
  return (
    <div className="loading-screen" role="status" aria-label="Loading ChicShoppae">
      <div className="loading-shell">
        <div className="loading-brand">
          <span className="loading-mark" />
          <div className="loading-text">
            <span className="loading-kicker">ChicShoppae</span>
            <span className="loading-title">Curating your next look</span>
          </div>
        </div>
        <div className="loading-track" aria-hidden="true">
          <div className="loading-bar" />
        </div>
      </div>

      <style jsx global>{`
        .loading-screen {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
          color: var(--text-primary);
          padding: 1.5rem;
          animation: loadingFadeIn 0.25s ease-out;
        }

        .loading-shell {
          width: min(100%, 360px);
          padding: 1.4rem;
          border: 1px solid var(--border);
          border-radius: 24px;
          background: rgba(255,255,255,0.32);
          backdrop-filter: blur(14px);
          box-shadow: 0 18px 50px rgba(20, 18, 16, 0.08);
        }

        .loading-brand {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1rem;
        }

        .loading-mark {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          border-right-color: var(--accent);
          animation: loadingSpin 1s linear infinite;
          flex-shrink: 0;
        }

        .loading-text {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .loading-kicker {
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .loading-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .loading-track {
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: var(--bg-secondary);
          overflow: hidden;
        }

        .loading-bar {
          width: 45%;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--accent), var(--accent-dark));
          animation: loadingPulse 1.15s ease-in-out infinite;
        }

        @keyframes loadingSpin {
          to { transform: rotate(360deg); }
        }

        @keyframes loadingPulse {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }

        @keyframes loadingFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 640px) {
          .loading-shell {
            padding: 1.2rem;
            border-radius: 20px;
          }
        }
      `}</style>
    </div>
  );
}
