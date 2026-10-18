import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { QuantitySelector } from '../product/QuantitySelector';
import { ProductImageWithFallback } from '../product/ProductImageWithFallback';
import { ScrollReveal } from '../common/ScrollReveal';
import { BRAND_CONFIG } from '../../config/brandConfig';

export const ProductShowcase = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : [];
  const activeImage = images[selectedImageIdx]?.url || product.primaryImage;
  const specs = product.specifications || {};
  const specEntries = Object.entries(specs);

  const handleAddToCart = async () => {
    setIsSubmitting(true);
    try {
      await addToCart(product, quantity, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyNow = async () => {
    setIsSubmitting(true);
    try {
      const added = await addToCart(product, quantity, false);
      if (added) {
        navigate('/checkout');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="product-showcase"
      className="w-full max-w-[1360px] mx-auto px-4 lg:px-8 py-12 md:py-16"
    >
      {/* Section Header */}
      <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">
              bolt
            </span>
            <span className="font-label-md text-label-md uppercase font-bold text-secondary">
              FLAGSHIP SINGLE-PRODUCT RELEASE
            </span>
          </div>
          <h2 className="font-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
            THE TOYVOLT APEX-1 // LIVE SHOWCASE
          </h2>
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="font-label-lg text-label-lg uppercase underline decoration-2 underline-offset-4 text-primary font-bold hover:text-on-surface transition-colors"
        >
          OPEN DEDICATED PRODUCT PAGE →
        </Link>
      </ScrollReveal>

      {/* Main Neo-Brutalist Single-Product Card */}
      <div className="bg-[#FFF9F0] border-2 border-on-surface shadow-[6px_6px_0px_#191919] p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Product Image Gallery (lg:col-span-6) */}
          <ScrollReveal delay={80} className="lg:col-span-6 flex flex-col gap-4">
            <div className="w-full aspect-[4/3] bg-surface-container-lowest border-2 border-on-surface shadow-[4px_4px_0px_#191919] overflow-hidden relative group">
              {product.discountPercentage > 0 && (
                <span className="absolute top-3 left-3 bg-secondary-container text-on-secondary px-3 py-1 font-label-sm text-label-sm font-bold border border-on-surface z-10 shadow-[2px_2px_0px_#191919] uppercase">
                  SAVE ₹{product.savingsRupees.toLocaleString('en-IN')} (-{product.discountPercentage}%)
                </span>
              )}

              <span className="absolute top-3 right-3 bg-surface-container-lowest text-on-surface px-2.5 py-1 font-label-sm text-label-sm font-bold border border-on-surface z-10 shadow-[2px_2px_0px_#191919] uppercase">
                SKU: {product.sku}
              </span>

              <ProductImageWithFallback
                src={activeImage}
                alt={`${product.name} — View ${selectedImageIdx + 1}`}
                loading="lazy"
                width={900}
                height={675}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Thumbnail Strip if multiple images exist */}
            {images.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={img.publicId || idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    aria-label={`Select product image ${idx + 1}`}
                    className={`h-20 sm:h-24 border-2 border-on-surface overflow-hidden transition-all relative ${
                      selectedImageIdx === idx
                        ? 'shadow-[4px_4px_0px_#1769FF] ring-2 ring-primary -translate-y-0.5'
                        : 'shadow-[2px_2px_0px_#191919] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <ProductImageWithFallback
                      src={img.url}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      loading="lazy"
                      width={240}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 bg-on-surface text-surface font-label-sm text-[9px] px-1.5 py-0.2 uppercase">
                      {idx === 0 ? 'PRIMARY' : `ANGLE 0${idx + 1}`}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </ScrollReveal>

          {/* Right: Live Product Details & Add-to-Cart Station (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-5">
            <div>
              {/* Category, Stock & Title */}
              <ScrollReveal delay={160}>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase px-2.5 py-1 border border-on-surface shadow-[2px_2px_0px_#191919] font-bold">
                    {product.category}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 font-label-sm text-label-sm uppercase px-2.5 py-1 border border-on-surface shadow-[2px_2px_0px_#191919] font-bold ${
                      product.isInStock
                        ? 'bg-[#dcfce7] text-[#14532d]'
                        : 'bg-error-container text-on-error-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {product.isInStock ? 'check_circle' : 'error'}
                    </span>
                    <span>
                      {product.isInStock
                        ? `In Stock • ${product.availableStock} Units Available`
                        : 'Out of Stock'}
                    </span>
                  </span>
                </div>

                <h3 className="font-headline-md text-headline-md text-on-surface leading-tight mb-3">
                  {product.name}
                </h3>
              </ScrollReveal>

              {/* Pricing Box & Description */}
              <ScrollReveal delay={240}>
                <div className="bg-surface-container-lowest border-2 border-on-surface shadow-[3px_3px_0px_#191919] p-4 mb-4 flex flex-wrap items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display-mobile text-display-mobile text-primary font-bold">
                      ₹{product.sellingPriceInRupees.toLocaleString('en-IN')}
                    </span>
                    {product.compareAtPriceInRupees && (
                      <span className="font-title text-title text-on-surface-variant line-through">
                        ₹{product.compareAtPriceInRupees.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <span className="font-label-sm text-label-sm uppercase bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 border border-on-surface font-bold">
                    {product.sellingPriceInRupees >= BRAND_CONFIG.shipping.freeShippingThresholdRupees
                      ? 'QUALIFIES FOR FREE SHIPPING'
                      : `STANDARD SHIPPING ₹${BRAND_CONFIG.shipping.standardShippingFeeRupees}`}
                  </span>
                </div>

                <p className="font-body-md text-body-md text-on-surface-variant mb-5 leading-relaxed">
                  {product.description}
                </p>
              </ScrollReveal>

              {/* Key Backend Specifications Snapshot */}
              {specEntries.length > 0 && (
                <ScrollReveal delay={320}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
                    {specEntries.slice(0, 6).map(([key, val]) => (
                      <div
                        key={key}
                        className="bg-surface-container-lowest border border-on-surface p-2.5 shadow-[2px_2px_0px_#191919]"
                      >
                        <span className="font-label-sm text-[10px] uppercase text-on-surface-variant block">
                          {key}
                        </span>
                        <span className="font-label-md text-label-md text-on-surface font-bold block truncate">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Quantity & Action Buttons */}
            <ScrollReveal delay={400} className="pt-4 border-t-2 border-on-surface/20 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-label-md text-label-md uppercase font-bold text-on-surface">
                    QUANTITY:
                  </span>
                  <QuantitySelector
                    quantity={quantity}
                    maxStock={product.availableStock}
                    disabled={!product.isInStock}
                    onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                    onIncrease={() =>
                      setQuantity((q) => Math.min(product.availableStock, q + 1))
                    }
                  />
                </div>

                <span className="font-label-md text-label-md uppercase text-on-surface font-bold">
                  Subtotal: ₹{(product.sellingPriceInRupees * quantity).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.isInStock || isSubmitting}
                  className="w-full py-3.5 px-6 bg-primary-container text-on-primary font-title text-title uppercase border-2 border-on-surface shadow-[4px_4px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#191919] active:translate-x-1 active:translate-y-1 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    add_shopping_cart
                  </span>
                  <span>{product.isInStock ? 'ADD TO CART' : 'OUT OF STOCK'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!product.isInStock || isSubmitting}
                  className="w-full py-3.5 px-6 bg-secondary-container text-on-secondary font-title text-title uppercase border-2 border-on-surface shadow-[4px_4px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#191919] active:translate-x-1 active:translate-y-1 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                  <span>PROCEED TO CHECKOUT</span>
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
