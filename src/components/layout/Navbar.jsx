import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ToyvoltLogo } from '../common/ToyvoltLogo';
import { ProductImageWithFallback } from '../product/ProductImageWithFallback';
import { MobileMenu } from './MobileMenu';

export const Navbar = ({ product, onQuickJump }) => {
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { user, isAuthenticated, isAdmin, openAuthModal, handleLogout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const accountMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const productSlug = product?.slug || 'toyvolt-apex-1-rc-drift-car';

  // Close menus and popovers on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setAccountMenuOpen(false);
  }, [location.pathname]);

  // Close search popover and account dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setSearchOpen(false);
      }
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(e.target)
      ) {
        setAccountMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setAccountMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 20);
    }
  }, [searchOpen]);

  const handleNavClick = (targetPath, sectionId = null) => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setAccountMenuOpen(false);

    if (location.pathname !== targetPath) {
      navigate(targetPath);
      if (sectionId) {
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    onQuickJump?.(sectionId);
  };

  // Match search query against live backend product data & specifications
  const searchResults = useMemo(() => {
    if (!product) return { matchesProduct: false, matchingSpecs: [] };
    const q = searchQuery.trim().toLowerCase();
    const specs = Object.entries(product.specifications || {});

    if (!q) {
      return {
        matchesProduct: true,
        matchingSpecs: specs.slice(0, 4)
      };
    }

    const haystack = [
      product.name,
      product.description,
      product.category,
      product.sku,
      ...specs.map(([k, v]) => `${k} ${v}`)
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchingSpecs = specs.filter(
      ([k, v]) =>
        k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q)
    );

    return {
      matchesProduct: haystack.includes(q) || matchingSpecs.length > 0,
      matchingSpecs: matchingSpecs.length > 0 ? matchingSpecs : specs.slice(0, 3)
    };
  }, [product, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    setSearchOpen(false);

    if (!q) {
      navigate('/collection');
      return;
    }

    if (q.includes('about')) {
      handleNavClick('/about', null);
    } else if (q.includes('contact') || q.includes('support') || q.includes('help')) {
      handleNavClick('/contact', null);
    } else if (q.includes('pin') || q.includes('ship') || q.includes('deliver')) {
      handleNavClick('/', 'delivery');
    } else {
      navigate(`/collection?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isHomeActive = location.pathname === '/';
  const isCollectionActive =
    location.pathname.startsWith('/product') || location.pathname === '/collection';
  const isAboutActive = location.pathname === '/about';
  const isContactActive = location.pathname === '/contact';

  const getNavLinkClasses = (isActive) =>
    `font-label-lg text-label-lg uppercase tracking-wide px-3 py-1.5 transition-all duration-150 ${
      isActive
        ? 'text-on-surface font-bold underline decoration-2 underline-offset-8 decoration-primary'
        : 'text-on-surface-variant font-medium hover:text-on-surface hover:-translate-y-0.5'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F0E8DA] border-b-2 border-on-surface">
      <div
        ref={searchContainerRef}
        className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* LEFT: Toyvolt Logo (clean, without the yellow Power Up button) */}
          <Link
            to="/"
            onClick={() => handleNavClick('/', null)}
            aria-label="TOYVOLT Home"
            className="focus:outline-none shrink-0"
          >
            <ToyvoltLogo size="md" showBadge={false} />
          </Link>

          {/* CENTER: Desktop Navigation Links (1. Home, 2. Collection, 3. About, 4. Contact) */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-4 lg:gap-8"
          >
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/', null);
              }}
              aria-current={isHomeActive ? 'page' : undefined}
              className={getNavLinkClasses(isHomeActive)}
            >
              Home
            </Link>

            <Link
              to="/collection"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(false);
              }}
              aria-current={isCollectionActive ? 'page' : undefined}
              className={getNavLinkClasses(isCollectionActive)}
            >
              Collection
            </Link>

            <Link
              to="/about"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/about', null);
              }}
              aria-current={isAboutActive ? 'page' : undefined}
              className={getNavLinkClasses(isAboutActive)}
            >
              About
            </Link>

            <Link
              to="/contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/contact', null);
              }}
              aria-current={isContactActive ? 'page' : undefined}
              className={getNavLinkClasses(isContactActive)}
            >
              Contact
            </Link>
          </nav>

          {/* RIGHT: 1. Search Icon, 2. Sign In Option, 3. Cart Option (+ Mobile Menu Toggle) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* 1. Search Icon */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setAccountMenuOpen(false);
                setSearchOpen((prev) => !prev);
              }}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
              className={`w-10 h-10 flex items-center justify-center border-2 border-on-surface rounded-lg transition-all ${
                searchOpen
                  ? 'bg-primary-container text-on-primary shadow-[2px_2px_0px_#191919]'
                  : 'bg-surface-container-lowest text-on-surface shadow-[2px_2px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {searchOpen ? 'close' : 'search'}
              </span>
            </button>

            {/* 2. Sign In Option with User Icon (Desktop visible; preserves account behavior when logged in) */}
            {isAuthenticated ? (
              <div className="relative hidden md:block" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setAccountMenuOpen((prev) => !prev);
                  }}
                  aria-expanded={accountMenuOpen}
                  aria-haspopup="menu"
                  className="h-10 px-3.5 bg-surface-container-lowest text-on-surface border-2 border-on-surface rounded-lg shadow-[2px_2px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 font-label-md text-label-md uppercase font-bold"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">
                    person
                  </span>
                  <span className="max-w-[110px] truncate">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                </button>

                {accountMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 bg-[#FFF9F0] border-2 border-on-surface shadow-[4px_4px_0px_#191919] p-2 z-50"
                  >
                    <div className="px-3 py-2 border-b-2 border-on-surface/15 mb-1">
                      <p className="font-title text-[14px] text-on-surface truncate">
                        {user?.name}
                      </p>
                      <p className="font-body-sm text-[11px] text-on-surface-variant truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/orders"
                      onClick={() => setAccountMenuOpen(false)}
                      className="w-full text-left px-3 py-2 font-label-md text-label-md uppercase flex items-center gap-2 hover:bg-primary-fixed transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        receipt_long
                      </span>
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setAccountMenuOpen(false)}
                        className="w-full text-left px-3 py-2 font-label-md text-label-md uppercase flex items-center gap-2 text-primary font-bold hover:bg-primary-fixed transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          admin_panel_settings
                        </span>
                        Admin Console
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-3 py-2 font-label-md text-label-md uppercase flex items-center gap-2 text-secondary font-bold hover:bg-error-container transition-colors mt-1 border-t border-on-surface/15 pt-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        logout
                      </span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  openAuthModal('login');
                }}
                className="hidden md:flex h-10 px-3.5 bg-surface-container-lowest text-on-surface border-2 border-on-surface rounded-lg shadow-[2px_2px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 transition-all items-center gap-1.5 font-label-md text-label-md uppercase font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">
                  person
                </span>
                <span>Sign In</span>
              </button>
            )}

            {/* 3. Cart Option with Shopping-Bag Icon and Dynamic Item-Count Badge */}
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setMobileMenuOpen(false);
                setIsCartDrawerOpen(true);
              }}
              aria-label={`Cart (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`}
              className="relative h-10 px-3 bg-surface-container-lowest text-on-surface border-2 border-on-surface rounded-lg shadow-[2px_2px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 font-label-md text-label-md uppercase font-bold"
            >
              <span className="material-symbols-outlined text-[20px]">
                shopping_bag
              </span>
              <span className="hidden lg:inline">Cart</span>
              <span
                aria-live="polite"
                className="min-w-[20px] h-5 px-1.5 bg-primary-container text-on-primary border border-on-surface rounded-full font-label-sm text-[11px] font-bold flex items-center justify-center leading-none"
              >
                {itemCount}
              </span>
            </button>

            {/* Mobile Hamburger Button (Visible only below md) */}
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setAccountMenuOpen(false);
                setMobileMenuOpen((prev) => !prev);
              }}
              aria-label={
                mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={mobileMenuOpen}
              className="md:hidden w-10 h-10 bg-surface-container-lowest border-2 border-on-surface rounded-lg shadow-[2px_2px_0px_#191919] flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[22px] text-on-surface">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Functional Search Interface Dropdown Connected to Live Product Data */}
        {searchOpen && (
          <div
            role="region"
            aria-label="Product Search"
            className="absolute right-4 left-4 sm:left-auto sm:w-[420px] top-full mt-2 bg-[#FFF9F0] border-2 border-on-surface shadow-[5px_5px_0px_#191919] p-4 z-50"
          >
            <form onSubmit={handleSearchSubmit} role="search" className="flex gap-2">
              <label htmlFor="navbar-search-input" className="sr-only">
                Search Toyvolt collection and specifications
              </label>
              <div className="relative flex-1 flex items-center">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3 pointer-events-none">
                  search
                </span>
                <input
                  id="navbar-search-input"
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search RC car, 35 km/h, 4WD, battery..."
                  className="w-full pl-9 pr-3 py-2 bg-[#FFFCF7] text-on-surface font-body-sm text-body-sm border-2 border-on-surface focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-container text-on-primary font-label-md text-label-md uppercase font-bold border-2 border-on-surface shadow-[2px_2px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
              >
                GO
              </button>
            </form>

            {/* Live Product Match Result */}
            {product && (
              <div className="mt-3 pt-3 border-t-2 border-on-surface/15">
                {searchResults.matchesProduct ? (
                  <Link
                    to={`/product/${productSlug}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 p-2.5 bg-surface-container-lowest border-2 border-on-surface shadow-[3px_3px_0px_#191919] hover:bg-primary-fixed/40 transition-colors"
                  >
                    <div className="w-14 h-14 border border-on-surface bg-surface-container-low shrink-0 overflow-hidden">
                      <ProductImageWithFallback
                        src={product.primaryImage || product.images?.[0]?.url}
                        alt={product.name}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-title text-[14px] text-on-surface truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-label-md text-label-md font-bold text-primary">
                          ₹{product.sellingPriceInRupees.toLocaleString('en-IN')}
                        </span>
                        <span className="font-label-sm text-[10px] uppercase text-on-surface-variant">
                          • {product.category}
                        </span>
                      </div>
                      {searchResults.matchingSpecs.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {searchResults.matchingSpecs.slice(0, 2).map(([key, val]) => (
                            <span
                              key={key}
                              className="px-1.5 py-0.5 bg-[#FFF3DF] border border-on-surface font-label-sm text-[10px] font-bold"
                            >
                              {key}: {val}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-on-surface">
                      arrow_forward
                    </span>
                  </Link>
                ) : (
                  <p className="font-body-sm text-body-sm text-on-surface-variant py-2">
                    No matching items for &ldquo;{searchQuery}&rdquo;. Try searching{' '}
                    <button
                      type="button"
                      onClick={() => setSearchQuery('Apex-1')}
                      className="text-primary font-bold underline"
                    >
                      Apex-1
                    </button>{' '}
                    or{' '}
                    <button
                      type="button"
                      onClick={() => setSearchQuery('35 km/h')}
                      className="text-primary font-bold underline"
                    >
                      35 km/h
                    </button>
                    .
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer (Home, Collection, About, Contact + Sign In) */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={handleNavClick}
        productSlug={productSlug}
        currentPathname={location.pathname}
        isAuthenticated={isAuthenticated}
        user={user}
        isAdmin={isAdmin}
        onSignIn={() => {
          setMobileMenuOpen(false);
          openAuthModal('login');
        }}
        onLogout={() => {
          setMobileMenuOpen(false);
          handleLogout();
        }}
      />
    </header>
  );
};

export default Navbar;
