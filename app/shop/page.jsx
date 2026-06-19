"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const heroImages = [
	"/images/one.jpg",
	"/images/four.jpg",
	"/images/five.jpg",
	"/images/seven.jpg",
	"/images/eight.jpg",
];

const shopProducts = [
	{ id: 1, name: "Rosette Mini Dress", price: 18500, category: "Gowns", images: ["/images/chan1.jpg"] },
	{ id: 2, name: "Linen Co-ord Set", price: 22000, category: "2-Piece Sets", images: ["/images/chan2.jpg"] },
	{ id: 3, name: "Satin Slip Dress", price: 15500, category: "Gowns", images: ["/images/chan3.jpg"] },
	{ id: 4, name: "Puff Sleeve Blouse", price: 9800, category: "Tops", images: ["/images/chan4.jpg"] },
	{ id: 5, name: "Wide Leg Trousers", price: 13500, category: "Trousers", images: ["/images/chan5.jpg"] },
	{ id: 6, name: "Ruched Bodycon", price: 17000, category: "Gowns", images: ["/images/chan6.jpg"] },
	{ id: 7, name: "Blazer Dress", price: 25000, category: "Gowns", images: ["/images/one.jpg"] },
	{ id: 8, name: "Crochet Top", price: 7500, category: "Tops", images: ["/images/five.jpg"] },
	{ id: 9, name: "Pleated Midi Dress", price: 21000, category: "Gowns", images: ["/images/four.jpg"] },
	{ id: 10, name: "Ribbed Knit Set", price: 16500, category: "2-Piece Sets", images: ["/images/seven.jpg"] },
	{ id: 11, name: "Floral Wrap Dress", price: 19000, category: "Gowns", images: ["/images/eight.jpg"] },
	{ id: 12, name: "Silk Palazzo", price: 23500, category: "Trousers", images: ["/images/three.jpg"] },
];

const categoryMap = {
	Gowns: "Gowns",
	Tops: "Tops",
	"2-Piece Sets": "2-Piece Sets",
	Trousers: "Trousers",
};

function ShopHero() {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setIndex((current) => (current + 1) % heroImages.length);
		}, 4500);
		return () => clearInterval(timer);
	}, []);

	const go = (nextIndex) => {
		setIndex((nextIndex + heroImages.length) % heroImages.length);
	};

	return (
		<section className="shop-hero">
			<style>{`
				.shop-hero {
					height: 90vh;
					min-height: 620px;
					position: relative;
					overflow: hidden;
					background: var(--bg-primary);
					border-bottom: 0.5px solid var(--border);
				}

				.shop-hero-inner {
					height: 100%;
					max-width: 1280px;
					margin: 0 auto;
					padding: 0 1.5rem;
					display: grid;
					grid-template-columns: 1fr 1fr;
					align-items: center;
					gap: 2rem;
				}

				.shop-hero-copy {
					position: relative;
					z-index: 2;
					max-width: 520px;
				}

				.shop-hero-eyebrow {
					font-size: 11px;
					letter-spacing: 0.22em;
					text-transform: uppercase;
					color: var(--text-secondary);
					margin-bottom: 1rem;
				}

				.shop-hero-title {
					font-family: 'Cormorant Garamond', serif;
					font-size: clamp(48px, 6vw, 90px);
					line-height: 0.95;
					color: var(--text-primary);
					margin-bottom: 1rem;
				}

				.shop-hero-text {
					color: var(--text-secondary);
					line-height: 1.7;
					max-width: 440px;
				}

				.shop-hero-carousel {
					position: relative;
					width: 100%;
					height: min(70vh, 640px);
					border-radius: 24px;
					overflow: hidden;
					background: var(--bg-card);
					box-shadow: 0 20px 60px rgba(0,0,0,0.12);
				}

				.shop-hero-slide {
					position: absolute;
					inset: 0;
				}

				.shop-hero-image {
					width: 100%;
					height: 100%;
					object-fit: cover;
					object-position: center top;
					display: block;
				}

				.shop-hero-arrow {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					width: 44px;
					height: 44px;
					border-radius: 999px;
					border: 0.5px solid var(--border);
					background: rgba(245,240,232,0.75);
					color: var(--text-primary);
					display: flex;
					align-items: center;
					justify-content: center;
					z-index: 3;
					cursor: pointer;
				}

				[data-theme="dark"] .shop-hero-arrow {
					background: rgba(17,16,16,0.72);
				}

				.shop-hero-arrow--left { left: 16px; }
				.shop-hero-arrow--right { right: 16px; }

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
					height: 2px;
					border: none;
					border-radius: 999px;
					background: rgba(26,23,20,0.25);
					overflow: hidden;
				}

				[data-theme="dark"] .shop-hero-dot {
					background: rgba(240,235,227,0.2);
				}

				.shop-hero-dot-active {
					background: var(--text-primary);
				}

				.shop-hero-progress {
					height: 100%;
					background: var(--accent);
					transform-origin: left;
				}

				.shop-hero-card-grid {
					display: grid;
					grid-template-columns: repeat(3, minmax(0, 1fr));
					gap: 1rem;
				}

				.shop-card {
					background: var(--bg-card);
					border: 0.5px solid var(--border);
					border-radius: 18px;
					overflow: hidden;
					text-decoration: none;
					color: inherit;
					box-shadow: 0 10px 30px rgba(0,0,0,0.05);
				}

				.shop-card-img {
					position: relative;
					aspect-ratio: 3 / 4;
					background: var(--bg-secondary);
				}

				.shop-card-body {
					padding: 1rem;
					display: flex;
					flex-direction: column;
					gap: 0.35rem;
				}

				.shop-card-cat {
					font-size: 10px;
					letter-spacing: 0.16em;
					text-transform: uppercase;
					color: var(--text-muted);
				}

				.shop-card-name {
					font-family: 'Cormorant Garamond', serif;
					font-size: 20px;
					line-height: 1.1;
					color: var(--text-primary);
				}

				.shop-card-price {
					font-size: 14px;
					color: var(--text-secondary);
				}

				.shop-card-cta {
					margin-top: 0.25rem;
					font-size: 10px;
					letter-spacing: 0.1em;
					text-transform: uppercase;
					color: var(--text-primary);
				}

				@media (max-width: 1023px) {
					.shop-hero { height: auto; min-height: unset; }
					.shop-hero-inner { grid-template-columns: 1fr; padding: 2.5rem 1.5rem 1.5rem; }
					.shop-hero-carousel { height: 60vh; min-height: 420px; }
					.shop-hero-card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
				}

				@media (max-width: 640px) {
					.shop-hero-inner { padding: 2rem 1rem 1rem; }
					.shop-hero-carousel { height: 54vh; min-height: 360px; border-radius: 18px; }
					.shop-hero-arrow { width: 40px; height: 40px; }
					.shop-hero-card-grid { grid-template-columns: 1fr; }
				}
			`}</style>

			<div className="shop-hero-inner">
				<div className="shop-hero-copy">
					<div className="shop-hero-eyebrow">Shop the drop</div>
					<h1 className="shop-hero-title">New pieces, styled to move with you.</h1>
					<p className="shop-hero-text">
						Explore the latest arrivals, seasonal edits, and statement looks from Chic Shoppae.
						Replace these carousel images with final product photography when ready.
					</p>
				</div>

				<div className="shop-hero-carousel">
					<AnimatePresence mode="wait">
						<motion.div
							key={index}
							className="shop-hero-slide"
							initial={{ opacity: 0, scale: 1.03 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 1.03 }}
							transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
						>
							<Image
								src={heroImages[index]}
								alt="Replaceable shop hero image"
								fill
								priority={index === 0}
								placeholder="empty"
								className="shop-hero-image"
								sizes="(max-width: 1023px) 100vw, 50vw"
							/>
						</motion.div>
					</AnimatePresence>

					<button className="shop-hero-arrow shop-hero-arrow--left" onClick={() => go(index - 1)} aria-label="Previous image">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="15 18 9 12 15 6" />
						</svg>
					</button>
					<button className="shop-hero-arrow shop-hero-arrow--right" onClick={() => go(index + 1)} aria-label="Next image">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="9 18 15 12 9 6" />
						</svg>
					</button>

					<div className="shop-hero-dots">
						{heroImages.map((_, dotIndex) => (
							<button
								key={dotIndex}
								className={`shop-hero-dot ${dotIndex === index ? "shop-hero-dot-active" : ""}`}
								onClick={() => setIndex(dotIndex)}
								aria-label={`Go to image ${dotIndex + 1}`}
							>
								{dotIndex === index && <span className="shop-hero-progress" style={{ width: "100%" }} />}
							</button>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

function ShopGrid({ category }) {
			const filtered = useMemo(() => {
				if (!category) return shopProducts;
				const normalizedCategory = categoryMap[category] || category;
				return shopProducts.filter((product) => product.category === normalizedCategory);
			}, [category]);

	return (
				<section className="fp-section">
					<div className="fp-container">
						<div className="fp-header">
							<div className="fp-header-left">
								<div>
									<span className="section-eyebrow">Browse the shop</span>
									<h2 className="section-title">{category ? category : "All products"}</h2>
								</div>
							</div>
							<Link href="/shop" className="fp-see-all">View all</Link>
						</div>

						<div className="shop-hero-card-grid">
							{filtered.map((product, index) => (
								<motion.div
									key={product.id}
									initial={{ opacity: 0, y: 16 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.2 }}
									transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
								>
									<Link href={`/product/${product.id}`} className="shop-card">
										<div className="shop-card-img">
											<Image
												src={product.images[0]}
												alt={product.name}
												fill
												loading="lazy"
												className="shop-hero-image"
												sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
											/>
										</div>
										<div className="shop-card-body">
											<div className="shop-card-cat">{product.category}</div>
											<div className="shop-card-name">{product.name}</div>
											<div className="shop-card-price">₦{product.price.toLocaleString()}</div>
											<div className="shop-card-cta">Shop Now</div>
										</div>
									</Link>
								</motion.div>
							))}
						</div>
					</div>
				</section>
	);
}

export default function ShopPage() {
	const searchParams = useSearchParams();
	const category = searchParams.get("category");

	return (
		<div>
			<ShopHero />
			<ShopGrid category={category} />
		</div>
	);
}
