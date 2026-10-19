import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useBodyScrollLock } from '../../lib/useBodyScrollLock';
import { QuantitySelector } from '../product/QuantitySelector';
import { ProductImageWithFallback } from '../product/ProductImageWithFallback';
import { BRAND_CONFIG } from '../../config/brandConfig';

export const CartDrawer = () => {
  const {
    items,
    itemCount,
    subtotalRupees,
    shippingFeeRupees,
    discountRupees,
    finalTotalRupees,
    appliedCoupon,
    couponError,
    setCouponError,
    isValidatingCoupon,
    applyCouponCode,
    removeCoupon,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  useBodyScrollLock(isCartDrawerOpen);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartDrawerOpen) {
        setIsCartDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartDrawerOpen, setIsCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    const ok = await applyCouponCode(couponInput);
    if (ok) {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      className="fixed inset-0 z-50 flex justify-end bg-on-surface/60"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div
        className="w-full max-w-md bg-[#FFF9F0] border-l-2 border-on-surface h-full flex flex-col justify-between shadow-[-6px_0px_0px_#191919] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-[#F0E8DA] border-b-2 border-on-surface px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-primary-container text-on-primary border border-on-surface shadow-[2px_2px_0px_#191919]">
              <span className="material-symbols-outlined text-[20px] block">
                shopping_bag
              </span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm uppercase text-on-surface leading-none">
                YOUR TOYVOLT CART
              </h2>
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
                {itemCount} {itemCount === 1 ? 'UNIT' : 'UNITS'} SELECTED
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(false)}
            aria-label="Close shopping cart"
            className="p-2 bg-surface-container-lowest border-2 border-on-surface shadow-[2px_2px_0px_#191919] hover:bg-secondary-fixed transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 space-y-4">
          {items.length === 0 ? (
            <div className="bg-surface-container-lowest border-2 border-on-surface shadow-[4px_4px_0px_#191919] p-6 text-center my-8">
              <div className="w-12 h-12 mx-auto mb-3 bg-tertiary-fixed border-2 border-on-surface shadow-[2px_2px_0px_#191919] flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px] text-on-surface">
                  directions_car
                </span>
              </div>
              <h3 className="font-title text-title uppercase text-on-surface mb-1">
                YOUR GARAGE IS EMPTY
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                Add the flagship Toyvolt Apex-1 RC Drift Car to begin your order.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  document
                    .getElementById('product-showcase')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-primary-container text-on-primary font-label-lg text-label-lg uppercase px-5 py-2.5 border-2 border-on-surface shadow-[3px_3px_0px_#191919] font-bold"
              >
                EXPLORE APEX-1
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-surface-container-lowest border-2 border-on-surface shadow-[4px_4px_0px_#191919] p-4 flex gap-3.5"
                >
                  <div className="w-20 h-20 border border-on-surface bg-surface-container-low shrink-0 overflow-hidden flex items-center justify-center p-1.5">
                    <ProductImageWithFallback
                      src={product.primaryImage || product.images?.[0]?.url}
                      alt={product.name}
                      width={160}
                      height={160}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-title text-[15px] leading-snug text-on-surface line-clamp-2">
                        {product.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        aria-label={`Remove ${product.name} from cart`}
                        className="text-on-surface-variant hover:text-error p-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    </div>

                    <p className="font-label-sm text-label-sm uppercase text-on-surface-variant mt-0.5">
                      ₹{product.sellingPriceInRupees.toLocaleString('en-IN')} / unit • Max Stock:{' '}
                      {product.availableStock}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-3">
                      <QuantitySelector
                        size="sm"
                        quantity={quantity}
                        maxStock={product.availableStock}
                        onDecrease={() => updateQuantity(product.id, quantity - 1)}
                        onIncrease={() => updateQuantity(product.id, quantity + 1)}
                      />

                      <span className="font-title text-title text-primary font-bold">
                        ₹{(product.sellingPriceInRupees * quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Server-Validated Coupon Box */}
              <div className="bg-surface-container-lowest border-2 border-on-surface shadow-[3px_3px_0px_#191919] p-4">
                <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface block mb-2">
                  HAVE A PROMO CODE? (VALIDATED BY SERVER)
                </span>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-tertiary-fixed px-3 py-2 border-2 border-on-surface">
                    <div>
                      <span className="font-label-md text-label-md font-bold text-on-surface block">
                        ✓ {appliedCoupon.code} APPLIED
                      </span>
                      <span className="font-body-sm text-[12px] text-on-surface-variant">
                        Saving ₹{appliedCoupon.discountAmountRupees}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="font-label-sm text-label-sm uppercase font-bold text-error underline"
                    >
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleCouponSubmit} className="flex gap-2">
                      <label htmlFor="cart-coupon-input" className="sr-only">
                        Coupon code
                      </label>
                      <input
                        id="cart-coupon-input"
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          if (couponError) setCouponError('');
                        }}
                        placeholder="e.g. WELCOME100"
                        className="flex-1 px-3 py-2 bg-[#FFFCF7] border-2 border-on-surface font-label-md uppercase focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={isValidatingCoupon}
                        className="px-4 py-2 bg-on-surface text-surface font-label-md text-label-md uppercase font-bold border-2 border-on-surface hover:bg-primary-container transition-colors disabled:opacity-50"
                      >
                        {isValidatingCoupon ? '...' : 'APPLY'}
                      </button>
                    </form>

                    {couponError && (
                      <p className="font-label-sm text-label-sm text-error mt-1.5">
                        {couponError}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {BRAND_CONFIG.verifiedCoupons.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => applyCouponCode(c.code)}
                          className="text-[10px] font-label-sm uppercase px-2 py-0.5 bg-surface-container border border-on-surface hover:bg-tertiary-fixed font-bold transition-colors"
                        >
                          + {c.code} ({c.label})
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="bg-[#F0E8DA] border-t-2 border-on-surface p-5 space-y-3">
            <div className="space-y-1.5 font-body-sm text-body-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-bold text-on-surface">
                  ₹{subtotalRupees.toLocaleString('en-IN')}
                </span>
              </div>

              {discountRupees > 0 && (
                <div className="flex justify-between text-[#15803d] font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>− ₹{discountRupees.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-on-surface-variant">
                <span>Shipping Fee</span>
                <span className="font-bold text-on-surface">
                  {shippingFeeRupees === 0 ? 'FREE (₹0)' : `₹${shippingFeeRupees}`}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t-2 border-on-surface">
                <span className="font-title text-title uppercase text-on-surface">
                  Estimated Total
                </span>
                <span className="font-price-lg text-price-lg text-primary font-bold">
                  ₹{finalTotalRupees.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-6 bg-primary-container text-on-primary font-title text-title uppercase border-2 border-on-surface shadow-[4px_4px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#191919] transition-all flex items-center justify-center gap-2"
            >
              <span>PROCEED TO CHECKOUT</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
