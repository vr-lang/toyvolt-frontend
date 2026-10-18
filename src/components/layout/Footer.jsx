import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToyvoltLogo } from '../common/ToyvoltLogo';
import { ScrollReveal } from '../common/ScrollReveal';
import { BRAND_CONFIG } from '../../config/brandConfig';

export const Footer = ({ product, backendServices }) => {
  const navigate = useNavigate();
  const productSlug = product?.slug || 'toyvolt-apex-1-rc-drift-car';

  const scrollToHomeSection = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      if (sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <footer
      id="footer-contact"
      className="w-full bg-[#F0E8DA] border-t-2 border-on-surface pt-12 pb-8 text-on-surface"
    >
      <ScrollReveal className="max-w-[1360px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b-2 border-on-surface">
          {/* Column 1: Brand & Identity (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <ToyvoltLogo size="lg" showBadge={false} />
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm leading-relaxed">
              High-performance remote-control toys and kinetic engineering built for pure drift adrenaline.
              Home of the {product?.name || 'Toyvolt Apex-1 (1:16 Scale)'}.
            </p>
            <div className="inline-flex items-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1.5 border-2 border-on-surface rounded-lg shadow-[3px_3px_0px_#171717]">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
              <span className="font-label-sm text-label-sm uppercase font-bold">
                {BRAND_CONFIG.tagline}
              </span>
            </div>
            <div className="pt-2 text-on-surface-variant font-body-sm text-[12px] space-y-1">
              <div><strong>Operating Brand:</strong> {BRAND_CONFIG.name} ({BRAND_CONFIG.legalEntityName})</div>
              <div><strong>Market:</strong> {BRAND_CONFIG.contact.locationNote}</div>
            </div>
          </div>

          {/* Column 2: Flagship Storefront (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h4 className="font-title text-title uppercase mb-4 text-on-surface border-b-2 border-on-surface/15 pb-2">
              Storefront &amp; Catalog
            </h4>
            <ul className="space-y-2.5 font-body-md text-body-md">
              <li className="hover:translate-x-1 transition-transform">
                <Link
                  to="/collection"
                  className="text-on-surface-variant hover:text-on-surface font-medium flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">category</span>
                  <span>The Toy Collection</span>
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link
                  to={`/product/${productSlug}`}
                  className="text-on-surface-variant hover:text-on-surface font-medium flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">sports_score</span>
                  <span>Flagship RC Drift Car</span>
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <button
                  type="button"
                  onClick={() => scrollToHomeSection('specs')}
                  className="text-on-surface-variant hover:text-on-surface font-medium text-left flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">tune</span>
                  <span>Hardware Specifications</span>
                </button>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <button
                  type="button"
                  onClick={() => scrollToHomeSection('delivery')}
                  className="text-on-surface-variant hover:text-on-surface font-medium text-left flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">pin_drop</span>
                  <span>PIN Delivery Checker</span>
                </button>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link
                  to="/orders"
                  className="text-on-surface-variant hover:text-on-surface font-medium flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">receipt_long</span>
                  <span>Track Your Order</span>
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link
                  to="/checkout"
                  className="text-on-surface-variant hover:text-on-surface font-medium flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">shopping_bag</span>
                  <span>Checkout &amp; Coupons</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Policy & Legal Compliance (lg:col-span-3) - CRITICAL FOR RAZORPAY */}
          <div className="lg:col-span-3">
            <h4 className="font-title text-title uppercase mb-4 text-on-surface border-b-2 border-on-surface/15 pb-2">
              Policies &amp; Legal
            </h4>
            <ul className="space-y-2.5 font-body-md text-body-md">
              <li className="hover:translate-x-1 transition-transform">
                <Link
                  to="/terms-and-conditions"
                  className="text-on-surface-variant hover:text-on-surface font-medium flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">gavel</span>
                  <span>Terms and Conditions</span>
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link
                  to="/privacy-policy"
                  className="text-on-surface-variant hover:text-on-surface font-medium flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">shield</span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link
                  to="/shipping-policy"
                  className="text-on-surface-variant hover:text-on-surface font-medium flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">local_shipping</span>
                  <span>Shipping &amp; Delivery Policy</span>
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link
                  to="/cancellation-and-refund"
                  className="text-on-surface-variant hover:text-on-surface font-medium flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">currency_rupee</span>
                  <span>Cancellation &amp; Refund Policy</span>
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link
                  to="/return-and-exchange"
                  className="text-on-surface-variant hover:text-on-surface font-medium flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">published_with_changes</span>
                  <span>Return &amp; Exchange Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Support & Company (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="font-title text-title uppercase mb-4 text-on-surface border-b-2 border-on-surface/15 pb-2">
              Help &amp; Support
            </h4>
            <div className="space-y-3 font-body-md text-body-md text-on-surface-variant">
              <div>
                <Link
                  to="/about"
                  className="text-on-surface-variant hover:text-on-surface font-medium block hover:translate-x-1 transition-transform mb-2"
                >
                  About Toyvolt
                </Link>
                <Link
                  to="/contact"
                  className="text-on-surface-variant hover:text-on-surface font-medium block hover:translate-x-1 transition-transform"
                >
                  Contact Support
                </Link>
              </div>

              <div className="pt-2 border-t border-on-surface/15 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                    mail
                  </span>
                  <a
                    href={`mailto:${BRAND_CONFIG.contact.email}`}
                    className="text-primary hover:underline font-bold text-[13px] break-all"
                  >
                    {BRAND_CONFIG.contact.email}
                  </a>
                </div>

                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                    schedule
                  </span>
                  <div className="text-[12px]">
                    <span className="font-bold text-on-surface block">Hours:</span>
                    <span className="text-on-surface-variant">{BRAND_CONFIG.contact.hours}</span>
                  </div>
                </div>

                <div className="pt-1">
                  <Link
                    to="/admin"
                    className="text-on-surface-variant/80 hover:text-on-surface font-label-sm text-[11px] uppercase"
                  >
                    Staff Admin
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Policy Links Bar */}
        <div className="py-4 border-b border-on-surface/20 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-label-sm text-[12px] uppercase font-bold text-on-surface-variant">
          <Link to="/terms-and-conditions" className="hover:text-primary transition-colors">
            Terms &amp; Conditions
          </Link>
          <span className="text-on-surface/30">•</span>
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <span className="text-on-surface/30">•</span>
          <Link to="/shipping-policy" className="hover:text-primary transition-colors">
            Shipping &amp; Delivery
          </Link>
          <span className="text-on-surface/30">•</span>
          <Link to="/cancellation-and-refund" className="hover:text-primary transition-colors">
            Cancellation &amp; Refund
          </Link>
          <span className="text-on-surface/30">•</span>
          <Link to="/return-and-exchange" className="hover:text-primary transition-colors">
            Return &amp; Exchange
          </Link>
          <span className="text-on-surface/30">•</span>
          <Link to="/contact" className="hover:text-primary transition-colors">
            Contact Support
          </Link>
        </div>

        {/* Bottom Bar: Architecture Status Badges & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 font-label-sm text-label-sm font-bold uppercase">
            <span className="text-on-surface-variant mr-1">Payments &amp; Logistics:</span>
            <span className="bg-surface-container-lowest px-2.5 py-1 border border-on-surface rounded shadow-[2px_2px_0px_#171717]">
              Server-Validated Cart
            </span>
            <span className="bg-surface-container-lowest px-2.5 py-1 border border-on-surface rounded shadow-[2px_2px_0px_#171717]">
              Razorpay Secured (PCI-DSS)
            </span>
            <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 border border-on-surface rounded shadow-[2px_2px_0px_#171717]">
              Pan-India Delivery
            </span>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-right">
            © {new Date().getFullYear()} {BRAND_CONFIG.name}. All rights reserved. Power Up The Fun.
          </p>
        </div>
      </ScrollReveal>
    </footer>
  );
};

export default Footer;
