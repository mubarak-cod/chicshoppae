"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { cartItems } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  // Apply theme to root
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
  }, [darkMode]);

  // Navbar shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const isActiveRoute = (route) => pathname === route;
  const isShop = isActiveRoute("/shop");

  const activeLinkStyle = {
    color: "var(--text-primary)",
    borderBottomColor: "var(--text-primary)",
  };

  const getLinkStyle = (route) => (isActiveRoute(route) ? activeLinkStyle : undefined);

  const handleCollectionsClick = (event) => {
    event.preventDefault();
    setMobileOpen(false);
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => {
        document.querySelector(".collections-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return;
    }
    document.querySelector(".collections-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNewArrivalsClick = (event) => {
    event.preventDefault();
    setMobileOpen(false);
    router.push("/shop?filter=new");
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="announce-bar">
        Free delivery on orders above ₦20,000 &nbsp;✦&nbsp; New arrivals every Friday
      </div>

      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="nav-inner">

          {/* Logo */}
          <Link href="/" className="logo">
            <Image height={30} width={70} src="/images/logo.jpg" alt="Chic Shoppae" priority />
            <span className="logo-tag">Fashion &amp; Style</span>
          </Link>

          {/* Desktop Links */}
          <ul className="nav-links">
            <li><Link href="/" style={getLinkStyle("/")}>Home</Link></li>
            <li><Link href="/shop" style={getLinkStyle("/shop")}>Shop</Link></li>
            <li><Link href="/" onClick={handleCollectionsClick}>Collections</Link></li>
            <li><Link href="/shop?filter=new">New Arrivals</Link></li>
            <li><Link href="/about" style={getLinkStyle("/about")}>About</Link></li>
          </ul>

          {/* Actions */}
          <div className="nav-actions">

            {/* Search */}
            {isShop && (
              <>
                <button
                  className="icon-btn"
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Search"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>

                <div className="divider" />
              </>
            )}

            {/* Wishlist */}
            <button className="icon-btn" aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>

            {/* Cart */}
            <Link href="/cart" className="icon-btn cart-btn" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>

            <div className="divider" />

            {/* Dark Mode Toggle */}
            <button
              className={`theme-toggle ${darkMode ? "theme-toggle--dark" : ""}`}
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            >
              <span className="toggle-track">
                <span className="toggle-thumb">
                  {darkMode ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                  )}
                </span>
              </span>
            </button>

            <div className="divider" />

            {/* Shop Now CTA */}
            <Link href="/shop" className="shop-btn">
              Shop Now
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="icon-btn mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for dresses, tops, bags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button className="icon-btn" onClick={() => setSearchOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="mobile-menu">
            <Link href="/" style={getLinkStyle("/")} onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/shop" style={getLinkStyle("/shop")} onClick={() => setMobileOpen(false)}>Shop</Link>
            <Link href="/" onClick={handleCollectionsClick}>Collections</Link>
            <Link href="/shop?filter=new" onClick={handleNewArrivalsClick}>New Arrivals</Link>
            <Link href="/about" style={getLinkStyle("/about")} onClick={() => setMobileOpen(false)}>About</Link>
            <div className="mobile-bottom">
              <button
                className={`theme-toggle ${darkMode ? "theme-toggle--dark" : ""}`}
                onClick={() => setDarkMode(!darkMode)}
              >
                <span className="toggle-track">
                  <span className="toggle-thumb">
                    {darkMode ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg>
                    )}
                  </span>
                </span>
              </button>
              <span className="mobile-mode-label">{darkMode ? "Dark mode" : "Light mode"}</span>
            </div>
            <Link href="/shop" className="mobile-shop-btn" onClick={() => setMobileOpen(false)}>
              Shop Now
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}