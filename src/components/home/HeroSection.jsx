import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ProductImageWithFallback } from '../product/ProductImageWithFallback';

export const HeroSection = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedHeroImgIdx, setSelectedHeroImgIdx] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : [];
  const activeImageUrl =
    images[selectedHeroImgIdx]?.url || product.primaryImage || null;
  const secondaryImageUrl = images[1]?.url || images[0]?.url || null;

  const handleQuickAdd = async () => {
    setIsAdding(true);
    try {
      await addToCart(product, 1, true);
    } finally {
      setIsAdding(false);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const specs = product.specifications || {};

  return (
    <section className="w-full max-w-[1360px] mx-auto px-4 lg:px-8 py-6 md:py-10 lg:py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Content Column (Desktop: 7 cols; Mobile: 1 col with Car Image first) */}
        <div className="md:col-span-7 flex flex-col gap-5 sm:gap-6">
          {/* =========================================================================
              1. MOBILE HERO: REMOTE-CONTROL CAR IMAGE (Appears FIRST on mobile < md)
              ========================================================================= */}
          <div className="md:hidden w-full bg-[#FFF9F0] border-2 border-on-surface shadow-[5px_5px_0px_#191919] p-3.5 sm:p-4 rounded-lg hero-enter-car">
            {/* Top Badge Strip */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="bg-secondary-container text-on-secondary px-2.5 py-0.5 font-label-sm text-[10px] sm:text-[11px] border border-on-surface shadow-[2px_2px_0px_#191919] uppercase font-bold">
                {product.discountPercentage > 0
                  ? `FLAGSHIP LAUNCH • -${product.discountPercentage}% OFF`
                  : 'FLAGSHIP LAUNCH ⚡'}
              </span>
              <span className="font-label-sm text-[10px] uppercase font-bold text-on-surface-variant bg-surface-container-lowest px-2 py-0.5 border border-on-surface">
                {specs['Scale'] ? `${specs['Scale']} SCALE` : '1:16'} 4WD
              </span>
            </div>

            {/* Mobile Car Image Container */}
            <div className="w-full aspect-[16/10] bg-surface-container-low border-2 border-on-surface overflow-hidden relative flex items-center justify-center p-3 sm:p-4 rounded">
              <ProductImageWithFallback
                src={activeImageUrl}
                alt={product.name}
                fetchPriority="high"
                width={720}
                height={450}
                className="w-full h-full object-contain hover:scale-[1.02] transition-transform duration-200"
              />

              {/* Photo Switcher Pills on Mobile */}
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-10">
                  {images.map((img, idx) => (
                    <button
                      key={img.publicId || idx}
                      type="button"
                      onClick={() => setSelectedHeroImgIdx(idx)}
                      aria-label={`Show product photo ${idx + 1}`}
                      className={`px-2 py-0.5 font-label-sm text-[9px] uppercase border border-on-surface shadow-[1.5px_1.5px_0px_#191919] transition-colors ${
                        selectedHeroImgIdx === idx
                          ? 'bg-primary-container text-on-primary font-bold'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-tertiary-fixed'
                      }`}
                    >
                      VIEW 0{idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* =========================================================================
              DESKTOP BADGES ROW (Visible at top on >= md)
              ========================================================================= */}
          <div className="hidden md:flex flex-wrap items-center gap-2 hero-enter-details">
            <span className="bg-surface-container-lowest text-on-surface font-label-sm text-label-sm px-3 py-1 border-2 border-on-surface shadow-[2px_2px_0px_#191919] uppercase font-bold">
              EDITION // 001
            </span>
            <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-3 py-1 border-2 border-on-surface shadow-[2px_2px_0px_#191919] uppercase font-bold">
              SKU: {product.sku || 'TV-RC-001'}
            </span>
            <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-3 py-1 border-2 border-on-surface shadow-[2px_2px_0px_#191919] uppercase font-bold">
              {specs['Scale'] ? `${specs['Scale']} SCALE` : '1:16 SCALE'} •{' '}
              {specs['Drive System'] || '4WD DRIFT'}
            </span>
          </div>

          {/* =========================================================================
              2. MAIN HERO HEADLINE (Directly below car image on mobile)
              ========================================================================= */}
          <div className="relative hero-enter-heading">
            <h1 className="font-display text-display-mobile sm:text-display uppercase leading-tight tracking-tight text-on-surface text-left">
              SMALL CAR.{' '}
              <span className="inline-block mt-1 sm:mt-2 bg-primary-container text-on-primary px-3 sm:px-4 py-1 sm:py-1.5 border-2 border-on-surface shadow-[4px_4px_0px_#191919] sm:shadow-[5px_5px_0px_#191919] transform -rotate-1">
                BIG ADVENTURES.
              </span>
            </h1>
          </div>

          {/* =========================================================================
              3. SUPPORTING DESCRIPTION
              ========================================================================= */}
          <p className="font-editorial-highlight text-[18px] sm:text-editorial-highlight text-on-surface-variant max-w-xl hero-enter-desc text-left leading-relaxed">
            {product.description}
          </p>

          {/* =========================================================================
              4 & 5. CTA BUTTONS & SLANTED PRICE BADGE
              ========================================================================= */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 hero-enter-cta">
            <button
              type="button"
              onClick={() => scrollToSection('product-showcase')}
              className="inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary font-title text-title uppercase px-6 sm:px-8 py-3.5 sm:py-4 border-2 border-on-surface shadow-[5px_5px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#191919] active:translate-x-1 active:translate-y-1 transition-all duration-150 group"
            >
              <span>EXPLORE APEX-1</span>
              <span className="material-symbols-outlined text-[20px] sm:text-[22px] group-hover:translate-x-1 transition-transform duration-150">
                arrow_forward
              </span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('specs')}
              className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest text-on-surface font-title text-title uppercase px-5 sm:px-6 py-3.5 sm:py-4 border-2 border-on-surface shadow-[4px_4px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#191919] active:translate-x-1 active:translate-y-1 transition-all duration-150"
            >
              <span>VIEW TECH SPECS</span>
            </button>

            {/* Slanted Price Sticker */}
            <div className="inline-flex items-center gap-1.5 bg-tertiary-container text-on-tertiary-container px-3.5 sm:px-4 py-1.5 sm:py-2 border-2 border-on-surface shadow-[3px_3px_0px_#191919] transform rotate-2 sm:rotate-3">
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">bolt</span>
              <span className="font-label-md sm:font-label-lg text-label-md sm:text-label-lg font-bold uppercase tracking-wider">
                NOW ₹{product.sellingPriceInRupees.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* =========================================================================
              6. MOBILE BADGES ROW (On mobile appears after CTAs)
              ========================================================================= */}
          <div className="md:hidden flex flex-wrap items-center gap-2 hero-enter-details">
            <span className="bg-surface-container-lowest text-on-surface font-label-sm text-[10px] px-2.5 py-0.5 border border-on-surface shadow-[2px_2px_0px_#191919] uppercase font-bold">
              EDITION // 001
            </span>
            <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[10px] px-2.5 py-0.5 border border-on-surface shadow-[2px_2px_0px_#191919] uppercase font-bold">
              SKU: {product.sku || 'TV-RC-001'}
            </span>
            <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px] px-2.5 py-0.5 border border-on-surface shadow-[2px_2px_0px_#191919] uppercase font-bold">
              {specs['Scale'] ? `${specs['Scale']} SCALE` : '1:16 SCALE'} •{' '}
              {specs['Drive System'] || '4WD DRIFT'}
            </span>
          </div>

          {/* =========================================================================
              LIVE INVENTORY & SPEC TELEMETRY STRIP
              ========================================================================= */}
          <div className="pt-3 sm:pt-4 flex flex-wrap items-center gap-4 sm:gap-6 border-t-2 border-on-surface/20 hero-enter-details">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full border border-on-surface ${
                  product.isInStock ? 'bg-[#16a34a] animate-pulse' : 'bg-error'
                }`}
              />
              <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface">
                {product.isInStock
                  ? `In Stock (${product.availableStock} Units Ready)`
                  : 'Currently Out of Stock'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-primary">
                speed
              </span>
              <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface">
                {specs['Top Speed'] || '35 km/h'} Top Speed •{' '}
                {specs['Control Range'] || '50m'} Control Range
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            Right Visual Grid Showcase (Desktop: 5 cols; Mobile: Supporting cards below)
            ========================================================================= */}
        <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hero Card 1: Desktop Flagship Showcase (Hidden on mobile < md since mobile has car image first) */}
          <div className="hidden md:flex sm:col-span-2 bg-[#FFF9F0] border-2 border-on-surface shadow-[5px_5px_0px_#191919] p-4 flex-col justify-between hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_#191919] transition-all duration-150 relative group hero-enter-car">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="bg-secondary-container text-on-secondary px-2.5 py-0.5 font-label-sm text-label-sm border border-on-surface shadow-[2px_2px_0px_#191919] uppercase font-bold">
                {product.discountPercentage > 0
                  ? `FLAGSHIP LAUNCH • -${product.discountPercentage}% OFF`
                  : 'FLAGSHIP LAUNCH ⚡'}
              </div>
              <Link
                to={`/product/${product.slug}`}
                aria-label={`View full details for ${product.name}`}
                className="px-2.5 py-1 bg-surface-container-lowest border border-on-surface shadow-[2px_2px_0px_#191919] hover:bg-primary-fixed transition-colors font-label-sm text-label-sm uppercase font-bold flex items-center gap-1"
              >
                <span>DETAILS</span>
                <span className="material-symbols-outlined text-[14px]">north_east</span>
              </Link>
            </div>

            <div className="w-full aspect-[16/10] min-h-[220px] max-h-[300px] bg-surface-container-low border-2 border-on-surface mb-3 overflow-hidden relative flex items-center justify-center p-3 sm:p-4">
              <ProductImageWithFallback
                src={activeImageUrl}
                alt={product.name}
                fetchPriority="high"
                width={800}
                height={500}
                className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-200"
              />
              {images.length > 1 && (
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 z-10">
                  {images.map((img, idx) => (
                    <button
                      key={img.publicId || idx}
                      type="button"
                      onClick={() => setSelectedHeroImgIdx(idx)}
                      aria-label={`Show product photo ${idx + 1}`}
                      className={`px-2 py-0.5 font-label-sm text-[10px] uppercase border border-on-surface shadow-[2px_2px_0px_#191919] transition-colors ${
                        selectedHeroImgIdx === idx
                          ? 'bg-primary-container text-on-primary font-bold'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-tertiary-fixed'
                      }`}
                    >
                      VIEW 0{idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
                  {product.category}
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight">
                  {product.name}
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {specs['Drive System'] || '4WD'} • {specs['Control Frequency'] || '2.4 GHz'} •{' '}
                  {specs['Top Speed'] || '35 km/h'}
                </p>
              </div>
              <div className="flex sm:flex-col items-baseline sm:items-end justify-between gap-2 shrink-0">
                <span className="font-price-lg text-price-lg text-primary font-bold">
                  ₹{product.sellingPriceInRupees.toLocaleString('en-IN')}
                </span>
                {product.compareAtPriceInRupees && (
                  <span className="line-through font-label-sm text-label-sm text-on-surface-variant">
                    ₹{product.compareAtPriceInRupees.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Add to Cart & Details CTA inside the Hero Showcase Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pt-3 border-t-2 border-on-surface/15">
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={!product.isInStock || isAdding}
                className="w-full py-2.5 px-4 bg-primary-container text-on-primary font-label-lg text-label-lg uppercase border-2 border-on-surface shadow-[3px_3px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#191919] disabled:opacity-50 transition-all duration-150 flex items-center justify-center gap-1.5 font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">
                  add_shopping_cart
                </span>
                <span>{product.isInStock ? 'ADD TO CART' : 'OUT OF STOCK'}</span>
              </button>

              <Link
                to={`/product/${product.slug}`}
                className="w-full py-2.5 px-4 bg-surface-container-lowest text-on-surface font-label-lg text-label-lg uppercase border-2 border-on-surface shadow-[3px_3px_0px_#191919] hover:bg-tertiary-fixed hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#191919] transition-all duration-150 flex items-center justify-center gap-1.5 font-bold"
              >
                <span>FULL PRODUCT PAGE</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Hero Card 2: Action Gallery Angle & Drift Telemetry */}
          <button
            type="button"
            onClick={() => {
              if (images.length > 1) setSelectedHeroImgIdx(1);
              scrollToSection('product-showcase');
            }}
            className="text-left bg-[#FFF9F0] border-2 border-on-surface shadow-[4px_4px_0px_#191919] p-3 flex flex-col justify-between hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#191919] transition-all duration-150 group hero-enter-details"
          >
            <div className="w-full h-32 bg-surface-container-low border border-on-surface mb-2 overflow-hidden flex items-center justify-center p-2">
              <ProductImageWithFallback
                src={secondaryImageUrl}
                alt={`${product.name} — Action Drift View`}
                width={400}
                height={260}
                className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-200"
              />
            </div>
            <span className="font-label-sm text-label-sm uppercase bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-0.5 border border-on-surface w-fit mb-1 font-bold">
              PROPORTIONAL 4WD
            </span>
            <h3 className="font-title text-title text-on-surface line-clamp-1">
              Interchangeable Drift Tires
            </h3>
            <span className="font-label-md text-label-md text-primary font-bold uppercase mt-0.5">
              {specs['Top Speed'] || '35 km/h'} • {specs['Control Range'] || '50m Range'}
            </span>
          </button>

          {/* Hero Card 3: Rechargeable Power & Chassis Spec Card */}
          <button
            type="button"
            onClick={() => scrollToSection('specs')}
            className="text-left bg-[#FFF9F0] border-2 border-on-surface shadow-[4px_4px_0px_#191919] p-3 flex flex-col justify-between hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#191919] transition-all duration-150 group hero-enter-details"
          >
            <div className="w-full h-32 bg-[#1769FF] border border-on-surface mb-2 overflow-hidden relative flex flex-col justify-between p-3 text-on-primary">
              <div
                className="absolute inset-0 bg-[#FF7626]"
                style={{ clipPath: 'polygon(68% 0, 100% 0, 100% 100%, 42% 100%)' }}
              />
              <div className="relative z-10 flex items-center justify-between">
                <span className="bg-surface-container-lowest text-on-surface font-label-sm text-[10px] px-1.5 py-0.5 border border-on-surface font-bold uppercase">
                  LI-PO POWER
                </span>
                <span className="material-symbols-outlined text-[24px] text-[#FFF3DF] group-hover:rotate-12 transition-transform duration-200">
                  battery_charging_full
                </span>
              </div>
              <div className="relative z-10">
                <span className="font-headline-sm text-headline-sm font-bold text-[#FFF3DF] block leading-none">
                  {specs['Play Time'] || '25–30 MINS'}
                </span>
                <span className="font-label-sm text-[10px] uppercase text-[#FFF3DF]/90 font-bold">
                  Continuous Drift Action
                </span>
              </div>
            </div>
            <span className="font-label-sm text-label-sm uppercase bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 border border-on-surface w-fit mb-1 font-bold">
              USB RECHARGEABLE
            </span>
            <h3 className="font-title text-title text-on-surface line-clamp-1">
              {specs['Battery'] || '7.4V 1200mAh Li-Po'}
            </h3>
            <span className="font-label-md text-label-md text-on-surface font-bold uppercase mt-0.5">
              Charges in {specs['Charging Time'] || '90 mins via USB'}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
