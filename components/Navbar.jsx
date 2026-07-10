"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import products from "@/data/products.json";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const debounceTimerRef = useRef(null);

  // Apply theme to root
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
  }, [darkMode]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chic-shoppae-recent-searches");
      setRecentSearches(stored ? JSON.parse(stored) : []);
    }
  }, []);

  // Save search to recent searches
  const saveSearchToRecent = useCallback((term) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...filtered].slice(0, 5);
      if (typeof window !== "undefined") {
        localStorage.setItem("chic-shoppae-recent-searches", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Clear individual recent search
  const clearRecentSearch = useCallback((term) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== term);
      if (typeof window !== "undefined") {
        localStorage.setItem("chic-shoppae-recent-searches", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Clear all recent searches
  const clearAllRecentSearches = useCallback(() => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("chic-shoppae-recent-searches");
    }
  }, []);

  // Search products with debounce
  const performSearch = useCallback((query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = products
      .filter(
        (p) =>
          (p.name?.toLowerCase().includes(q)) ||
          (p.title?.toLowerCase().includes(q)) ||
          (p.category?.toLowerCase().includes(q)) ||
          (p.description?.toLowerCase().includes(q))
      )
      .slice(0, 6);

    setSearchResults(filtered);
  }, []);

  // Debounced search
  const handleSearchChange = useCallback(
    (e) => {
      const query = e.target.value;
      setSearchQuery(query);

      clearTimeout(debounceTimerRef.current);

      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        setShowRecentSearches(true);
        return;
      }

      setIsSearching(true);
      setShowRecentSearches(false);

      debounceTimerRef.current = setTimeout(() => {
        performSearch(query);
        setIsSearching(false);
      }, 300);
    },
    [performSearch]
  );

  // Handle search submission
  const handleSearchSubmit = useCallback(
    (query) => {
      if (!query.trim()) return;
      saveSearchToRecent(query);
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
      setShowRecentSearches(false);
      router.push(`/shop?search=${encodeURIComponent(query)}`);
    },
    [router, saveSearchToRecent]
  );

  // Handle Enter key
  const handleSearchKeydown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSearchSubmit(searchQuery);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        setShowRecentSearches(false);
      }
    },
    [searchQuery, handleSearchSubmit]
  );

  // Handle search input focus
  const handleSearchFocus = useCallback(() => {
    if (!searchQuery.trim()) {
      setShowRecentSearches(true);
    }
  }, [searchQuery]);

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

  const isActiveRoute = (route) => pathname === route;
  const isShop = pathname === "/" || pathname === "/shop";

  const activeLinkStyle = {
    color: "var(--text-primary)",
    borderBottomColor: "var(--text-primary)",
  };

  const getLinkStyle = (route) =>
    isActiveRoute(route) ? activeLinkStyle : undefined;

  const handleCollectionsClick = (event) => {
    event.preventDefault();
    setMobileOpen(false);
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => {
        document
          .querySelector(".collections-section")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return;
    }
    document
      .querySelector(".collections-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        Free delivery on orders above ₦20,000 &nbsp;✦&nbsp; New arrivals every
        Friday
      </div>

      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="nav-inner">
          {/* Logo */}
          <Link
            href="/shop"
            className="group flex items-center gap-2.5 no-underline shrink-0"
          >
            <Image
              className="w-9 h-9 rounded-[10px] object-cover border border-neutral-900/10 dark:border-neutral-50/10 shadow-sm transition-transform duration-300 ease-out group-hover:scale-105"
              height={36}
              width={36}
              src="/images/logo.jpg"
              alt="Chic Shoppae"
              priority
            />
            <span className="text-[10.5px] tracking-[0.18em] uppercase text-neutral-500 dark:text-neutral-400 font-normal transition-colors duration-200 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
              Fashion &amp; Style
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="nav-links">
            <li>
              <Link href="/" style={getLinkStyle("/")}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" style={isShop ? activeLinkStyle : undefined}>
                Shop
              </Link>
            </li>
            <li>
              <Link href="/" onClick={handleCollectionsClick}>
                Collections
              </Link>
            </li>
            <li>
              <Link href="/shop?filter=new">New Arrivals</Link>
            </li>
            <li>
              <Link href="/about" style={getLinkStyle("/about")}>
                About
              </Link>
            </li>
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
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>

                <div className="divider" />
              </>
            )}

            {/* Wishlist */}
            <Link
              href="/Wishlistpage"
              className={`icon-btn ${pathname === "/Wishlistpage" ? "active" : ""}`}
              aria-label="Wishlist"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="icon-btn cart-btn" aria-label="Cart">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
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
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  ) : (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
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
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
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
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeydown}
              onFocus={handleSearchFocus}
              autoFocus
            />

            {/* Search Results Dropdown */}
            {(isSearching || searchResults.length > 0 || showRecentSearches) && (
              <div className="search-dropdown">
                {isSearching ? (
                  <div className="search-loading">
                    <div className="search-spinner" />
                    <span>Searching...</span>
                  </div>
                ) : showRecentSearches && recentSearches.length > 0 ? (
                  <div className="recent-searches">
                    <div className="recent-header">
                      <span className="recent-label">Recent Searches</span>
                      <button
                        type="button"
                        className="clear-all-btn"
                        onClick={clearAllRecentSearches}
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="recent-chips">
                      {recentSearches.map((term) => (
                        <div key={term} className="recent-chip">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                          <button
                            type="button"
                            className="recent-term"
                            onClick={() => {
                              setSearchQuery(term);
                              performSearch(term);
                              setShowRecentSearches(false);
                            }}
                          >
                            {term}
                          </button>
                          <button
                            type="button"
                            className="recent-remove"
                            onClick={() => clearRecentSearch(term)}
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : searchQuery.trim() && searchResults.length === 0 && !isSearching ? (
                  <div className="no-results">
                    <span>No results for "{searchQuery}"</span>
                  </div>
                ) : (
                  searchResults.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className="search-result"
                      onClick={() => {
                        handleSearchSubmit(searchQuery);
                      }}
                    >
                      <div className="result-image">
                        <img
                          src={product.images?.[0] || "/images/one.jpg"}
                          alt={product.name || product.title}
                          onError={(e) => {
                            e.target.src = "/images/one.jpg";
                          }}
                        />
                      </div>
                      <div className="result-info">
                        <div className="result-name">
                          {product.name || product.title}
                        </div>
                        <div className="result-meta">
                          <span className="result-category">{product.category}</span>
                          <span className="result-price">
                            ₦{Number(product.price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            <button className="icon-btn" onClick={() => setSearchOpen(false)}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="mobile-menu">
            <Link
              href="/"
              style={getLinkStyle("/")}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              style={getLinkStyle("/shop")}
              onClick={() => setMobileOpen(false)}
            >
              Shop
            </Link>
            <Link href="/" onClick={handleCollectionsClick}>
              Collections
            </Link>
            <Link href="/shop?filter=new" onClick={handleNewArrivalsClick}>
              New Arrivals
            </Link>
            <Link
              href="/about"
              style={getLinkStyle("/about")}
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <div className="mobile-bottom">
              <button
                className={`theme-toggle ${darkMode ? "theme-toggle--dark" : ""}`}
                onClick={() => setDarkMode(!darkMode)}
              >
                <span className="toggle-track">
                  <span className="toggle-thumb">
                    {darkMode ? (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </svg>
                    ) : (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                      </svg>
                    )}
                  </span>
                </span>
              </button>
              <span className="mobile-mode-label">
                {darkMode ? "Dark mode" : "Light mode"}
              </span>
            </div>
            <Link
              href="/shop"
              className="mobile-shop-btn"
              onClick={() => setMobileOpen(false)}
            >
              Shop Now
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
