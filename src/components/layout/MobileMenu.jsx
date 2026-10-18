import React from 'react';
import { Link } from 'react-router-dom';
import { useBodyScrollLock } from '../../lib/useBodyScrollLock';

export const MobileMenu = ({
  isOpen,
  onClose,
  onNavigate,
  productSlug,
  currentPathname,
  isAuthenticated,
  user,
  isAdmin,
  onSignIn,
  onLogout
}) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const isHomeActive = currentPathname === '/';
  const isCollectionActive =
    currentPathname?.startsWith('/product') || currentPathname === '/collection';
  const isAboutActive = currentPathname === '/about';
  const isContactActive = currentPathname === '/contact';

  const getItemClasses = (isActive) =>
    `w-full text-left font-title text-title uppercase px-4 py-3 border-2 border-on-surface flex items-center justify-between transition-colors ${
      isActive
        ? 'bg-primary-container text-on-primary shadow-[3px_3px_0px_#191919]'
        : 'bg-surface-container-lowest text-on-surface shadow-[3px_3px_0px_#191919] hover:bg-[#FFF3DF]'
    }`;

  return (
    <div className="md:hidden bg-[#FFF9F0] border-b-2 border-on-surface shadow-[0px_6px_0px_#191919] px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain">
      <nav
        aria-label="Mobile navigation"
        className="flex flex-col gap-2.5 max-w-[1360px] mx-auto"
      >
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            onClose();
            onNavigate('/', null);
          }}
          aria-current={isHomeActive ? 'page' : undefined}
          className={getItemClasses(isHomeActive)}
        >
          <span>Home</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>

        <Link
          to="/collection"
          onClick={onClose}
          aria-current={isCollectionActive ? 'page' : undefined}
          className={getItemClasses(isCollectionActive)}
        >
          <span>Collection</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>

        <Link
          to="/about"
          onClick={(e) => {
            e.preventDefault();
            onClose();
            onNavigate('/about', null);
          }}
          aria-current={isAboutActive ? 'page' : undefined}
          className={getItemClasses(isAboutActive)}
        >
          <span>About</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>

        <Link
          to="/contact"
          onClick={(e) => {
            e.preventDefault();
            onClose();
            onNavigate('/contact', null);
          }}
          aria-current={isContactActive ? 'page' : undefined}
          className={getItemClasses(isContactActive)}
        >
          <span>Contact</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>

        {/* Store Policies & Legal Links */}
        <div className="pt-2 mt-1 border-t-2 border-on-surface/15">
          <p className="font-label-sm text-[11px] uppercase font-bold text-on-surface-variant px-1 mb-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-primary">policy</span>
            Policies &amp; Legal
          </p>
          <div className="grid grid-cols-2 gap-1.5 font-label-sm text-[11px] uppercase font-bold">
            <Link
              to="/terms-and-conditions"
              onClick={onClose}
              className="p-2 bg-surface-container-lowest border border-on-surface rounded text-on-surface-variant hover:text-on-surface hover:bg-[#FFF3DF]"
            >
              Terms of Use
            </Link>
            <Link
              to="/privacy-policy"
              onClick={onClose}
              className="p-2 bg-surface-container-lowest border border-on-surface rounded text-on-surface-variant hover:text-on-surface hover:bg-[#FFF3DF]"
            >
              Privacy Policy
            </Link>
            <Link
              to="/shipping-policy"
              onClick={onClose}
              className="p-2 bg-surface-container-lowest border border-on-surface rounded text-on-surface-variant hover:text-on-surface hover:bg-[#FFF3DF]"
            >
              Shipping Policy
            </Link>
            <Link
              to="/cancellation-and-refund"
              onClick={onClose}
              className="p-2 bg-surface-container-lowest border border-on-surface rounded text-on-surface-variant hover:text-on-surface hover:bg-[#FFF3DF]"
            >
              Refund Policy
            </Link>
            <Link
              to="/return-and-exchange"
              onClick={onClose}
              className="col-span-2 p-2 bg-surface-container-lowest border border-on-surface rounded text-on-surface-variant hover:text-on-surface hover:bg-[#FFF3DF] text-center"
            >
              Return &amp; Exchange Policy
            </Link>
          </div>
        </div>

        <div className="pt-2 mt-1 border-t-2 border-on-surface/15">
          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <div className="px-4 py-2.5 bg-surface-container-lowest border-2 border-on-surface shadow-[3px_3px_0px_#191919] flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[20px] text-primary">
                    person
                  </span>
                  <div className="min-w-0">
                    <p className="font-title text-[14px] text-on-surface truncate">
                      {user?.name || 'Customer'}
                    </p>
                    <p className="font-body-sm text-[11px] text-on-surface-variant truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3 py-1.5 bg-error-container text-secondary font-label-sm text-[11px] uppercase font-bold border border-on-surface"
                >
                  Sign Out
                </button>
              </div>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={onClose}
                  className={getItemClasses(currentPathname === '/admin')}
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">
                      admin_panel_settings
                    </span>
                    Admin Console
                  </span>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="w-full font-title text-title uppercase px-4 py-3 bg-primary-container text-on-primary border-2 border-on-surface shadow-[3px_3px_0px_#191919] flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">
                  person
                </span>
                Sign In
              </span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
