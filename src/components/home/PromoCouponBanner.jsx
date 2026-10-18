import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { ScrollReveal } from '../common/ScrollReveal';

export const PromoCouponBanner = ({ product }) => {
  const {
    items,
    addToCart,
    applyCouponCode,
    appliedCoupon,
    isValidatingCoupon,
    couponError
  } = useCart();
  const [selectedCode, setSelectedCode] = useState('WELCOME100');
  const [statusMessage, setStatusMessage] = useState('');

  const handleApplyPromo = async (codeToApply) => {
    setSelectedCode(codeToApply);
    setStatusMessage('');

    try {
      await navigator.clipboard?.writeText(codeToApply);
    } catch {
      // ignore clipboard errors
    }

    // If cart is empty and product is in stock, add 1 unit first so coupon can be server-validated
    let customSubtotal = null;
    if (items.length === 0 && product?.isInStock) {
      await addToCart(product, 1, false);
      customSubtotal = product.sellingPrice;
    }

    const ok = await applyCouponCode(codeToApply, customSubtotal);
    if (ok) {
      setStatusMessage(
        `Code ${codeToApply} verified with Toyvolt server & applied to your cart!`
      );
    }
  };

  return (
    <section className="w-full max-w-[1360px] mx-auto px-4 lg:px-8 my-6">
      <ScrollReveal className="w-full bg-gradient-to-r from-tertiary-container via-tertiary-fixed to-secondary-container border-2 border-on-surface shadow-[6px_6px_0px_#191919] p-6 lg:p-10 relative overflow-hidden">
        {/* Diagonal Decorative Stripes SVG Background from Stitch */}
        <svg
          className="absolute -right-10 -bottom-10 w-96 h-96 opacity-20 pointer-events-none"
          fill="currentColor"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path d="M0 0 L20 0 L100 80 L100 100 Z" />
          <path d="M25 0 L45 0 L100 55 L100 75 Z" />
          <path d="M50 0 L70 0 L100 30 L100 50 Z" />
          <path d="M0 25 L0 45 L55 100 L75 100 Z" />
        </svg>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-on-surface text-surface px-3 py-1 font-label-sm text-label-sm uppercase font-bold mb-3 border border-on-surface">
              <span>SERVER-VERIFIED PROMO CODES</span>
            </div>
            <h2 className="font-headline-lg-mobile md:text-headline-lg uppercase text-on-surface leading-tight">
              UNLOCK YOUR TOYVOLT LAUNCH SAVINGS
            </h2>
            <p className="font-title text-title text-on-surface-variant mt-1.5">
              Select a verified coupon code below to validate directly against the Toyvolt backend:{' '}
              <span className="inline-block bg-surface-container-lowest text-secondary px-2.5 py-0.5 border-2 border-on-surface font-title shadow-[2px_2px_0px_#191919] select-all">
                {appliedCoupon?.code || selectedCode}
              </span>
            </p>
            {statusMessage && (
              <p className="mt-2 font-label-md text-label-md uppercase font-bold text-on-surface bg-surface-container-lowest/90 inline-block px-3 py-1 border border-on-surface">
                ✓ {statusMessage}
              </p>
            )}
            {couponError && (
              <p className="mt-2 font-label-md text-label-md uppercase font-bold text-error bg-surface-container-lowest inline-block px-3 py-1 border border-on-surface">
                ! {couponError}
              </p>
            )}
          </div>

          {/* Interactive Verified Coupon Selector & Action (Replaces fake countdown timer) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 w-full lg:w-auto">
            <div className="grid grid-cols-3 gap-2 bg-surface-container-lowest border-2 border-on-surface p-2 shadow-[4px_4px_0px_#191919]">
              {BRAND_CONFIG.verifiedCoupons.map((c) => {
                const isSelected =
                  (appliedCoupon?.code || selectedCode) === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setSelectedCode(c.code)}
                    className={`text-center px-2.5 py-1.5 border transition-colors ${
                      isSelected
                        ? 'bg-primary-fixed border-on-surface'
                        : 'border-transparent hover:bg-surface-container'
                    }`}
                  >
                    <span className="font-label-md text-label-md text-on-surface block font-bold">
                      {c.code}
                    </span>
                    <span className="font-label-sm text-[10px] uppercase text-secondary font-bold block">
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={isValidatingCoupon}
              onClick={() => handleApplyPromo(selectedCode)}
              className="inline-flex items-center justify-center gap-2 bg-on-surface text-surface font-title text-title uppercase px-6 py-4 border-2 border-on-surface shadow-[4px_4px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 transition-transform disabled:opacity-60"
            >
              <span>
                {isValidatingCoupon
                  ? 'VERIFYING...'
                  : appliedCoupon?.code === selectedCode
                  ? `APPLIED (${selectedCode})`
                  : `APPLY ${selectedCode}`}
              </span>
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default PromoCouponBanner;
