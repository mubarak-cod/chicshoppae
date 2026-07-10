"use client";

import { useEffect, useMemo, useState } from "react";

function HangerFallback({ label = "Photo coming soon" }) {
  return (
    <div className="image-fallback" aria-hidden="true">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 9V7.5a2.5 2.5 0 1 0-5 0c0 .9.48 1.56 1.23 2.02L12 12l3.77-2.48C16.52 9.06 17 8.4 17 7.5a2.5 2.5 0 1 0-5 0V9" />
        <path d="M4 20h16l-4.2-8.25c-.22-.43-.74-.62-1.18-.42L12 13l-2.62-1.67c-.44-.2-.96-.01-1.18.42L4 20Z" />
      </svg>
      <span>{label}</span>
    </div>
  );
}

export default function ImageFrame({
  src,
  alt,
  className = "",
  imgClassName = "",
  objectPosition = "top center",
  loading = "lazy",
  onClick,
  onLoad,
  onError,
  sizes,
  fill = true,
  style,
  priority,
}) {
  const normalizedSrc = typeof src === "string" ? src.trim() : src;
  const hasSource = Boolean(normalizedSrc);
  const [isLoading, setIsLoading] = useState(hasSource);
  const [failed, setFailed] = useState(!hasSource);
  const resolvedLoading = priority ? "eager" : loading;

  useEffect(() => {
    setIsLoading(Boolean(hasSource));
    setFailed(!hasSource);
  }, [hasSource, normalizedSrc]);

  const imageStyle = useMemo(
    () => ({
      objectFit: "cover",
      objectPosition,
      opacity: isLoading || failed ? 0 : 1,
      transition: "opacity 0.3s ease",
      ...style,
    }),
    [failed, isLoading, objectPosition, style],
  );

  return (
    <div className={`image-frame ${className} ${failed ? "is-fallback" : ""}`} onClick={onClick}>
      <style>{`
        .image-frame {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: var(--bg-secondary);
        }

        .image-frame > span,
        .image-frame img {
          width: 100% !important;
          height: 100% !important;
        }

        .image-fallback,
        .image-skeleton {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 0.55rem;
          color: var(--text-muted);
          background: var(--bg-secondary);
        }

        .image-fallback svg {
          opacity: 0.55;
        }

        .image-fallback span {
          font-size: 0.8rem;
          line-height: 1.2;
          color: var(--text-muted);
        }

        .image-skeleton {
          background: linear-gradient(90deg, var(--bg-secondary) 0%, rgba(255,255,255,0.18) 50%, var(--bg-secondary) 100%);
          background-size: 200% 100%;
          animation: imageShimmer 1.15s linear infinite;
        }

        @keyframes imageShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {isLoading && !failed && <div className="image-skeleton" aria-hidden="true" />}

      {failed && <HangerFallback />}

      {hasSource && !failed && (
        <img
          src={normalizedSrc}
          alt={alt}
          loading={resolvedLoading}
          onLoad={(event) => {
            setIsLoading(false);
            onLoad?.(event);
          }}
          onError={(event) => {
            setIsLoading(false);
            setFailed(true);
            onError?.(event);
          }}
          style={imageStyle}
          className={imgClassName}
          sizes={sizes}
          {...(fill ? {} : { width: undefined, height: undefined })}
        />
      )}
    </div>
  );
}