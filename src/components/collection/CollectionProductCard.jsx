import React from 'react';
import { Link } from 'react-router-dom';
import { ProductImageWithFallback } from '../product/ProductImageWithFallback';

/**
 * Category styling based on product category.
 */
const getCategoryStyle = (category = '') => {
  const cat = category.toLowerCase();
  if (cat.includes('rc') || cat.includes('car') || cat.includes('remote') || cat.includes('racer')) {
    return {
      bg: 'bg-[#1769FF]',
      text: 'text-white',
      label: 'RC RACING'
    };
  }
  if (cat.includes('doll') || cat.includes('house') || cat.includes('set') || cat.includes('play')) {
    return {
      bg: 'bg-[#FF5533]',
      text: 'text-white',
      label: 'PLAYSETS'
    };
  }
  if (cat.includes('atm') || cat.includes('safe') || cat.includes('piggy') || cat.includes('bank')) {
    return {
      bg: 'bg-[#FFB800]',
      text: 'text-[#171717]',
      label: 'SAVINGS TOYS'
    };
  }
  if (cat.includes('stem') || cat.includes('block') || cat.includes('build')) {
    return {
      bg: 'bg-[#4F46E5]',
      text: 'text-white',
      label: 'STEM BLOCKS'
    };
  }
  if (cat.includes('edu') || cat.includes('sensor') || cat.includes('montessori')) {
    return {
      bg: 'bg-[#D97706]',
      text: 'text-white',
      label: 'MONTESSORI'
    };
  }
  return {
    bg: 'bg-[#1769FF]',
    text: 'text-white',
    label: category.toUpperCase() || 'TOYVOLT'
  };
};

/**
 * Extract feature chips from real product specifications or tags.
 */
const getFeatureChips = (product) => {
  const specs = product.specifications || {};
  const chips = [];

  if (specs['Drive System']) chips.push(specs['Drive System']);
  if (specs['Play Time']) chips.push(specs['Play Time']);
  if (specs['Control Frequency']) chips.push(specs['Control Frequency']);
  if (specs['Scale']) chips.push(`${specs['Scale']} Scale`);
  if (specs['Chassis']) chips.push(specs['Chassis'].split(' ')[0] || 'Armor');

  if (chips.length === 0 && specs['Tags']) {
    const rawTags = specs['Tags'].split(',').map((t) => t.trim()).filter(Boolean);
    chips.push(...rawTags.slice(0, 2));
  }

  // Fallback defaults from product attributes
  if (chips.length === 0 && product.weightGrams) {
    chips.push(`${product.weightGrams}g Weight`);
  }

  return chips.slice(0, 2);
};

/**
 * Extract bottom-right tag on the product image from real specs.
 */
const getImageSpecTag = (product) => {
  const specs = product.specifications || {};
  if (specs['Control Frequency'] && specs['Control Frequency'].includes('2.4')) {
    return '2.4GHZ ALL-TERRAIN';
  }
  if (specs['Drive System']) {
    return specs['Drive System'].toUpperCase();
  }
  if (specs['Scale']) {
    return `${specs['Scale']} SCALE SPEED`;
  }
  if (specs['Tags'] && specs['Tags'].includes('4WD')) {
    return '4WD ALL-TERRAIN';
  }
  return 'VERIFIED HARDWARE';
};

/**
 * Extract age badge for overlay on image from real specs.
 */
const getAgeBadge = (product) => {
  const specs = product.specifications || {};
  if (specs['Age Group']) {
    const match = specs['Age Group'].match(/\d+\+?/);
    if (match) return `AGES ${match[0]}`;
  }
  if (product.availableStock > 0 && product.availableStock <= 5) {
    return `ONLY ${product.availableStock} LEFT`;
  }
  return null;
};

export const CollectionProductCard = ({
  product,
  viewMode = 'grid',
  isWishlisted = false,
  onToggleWishlist,
  onAddToCart,
  isAdding = false
}) => {
  if (!product) return null;

  const categoryStyle = getCategoryStyle(product.category);
  const featureChips = getFeatureChips(product);
  const imageSpecTag = getImageSpecTag(product);
  const ageBadge = getAgeBadge(product);
  const specs = product.specifications || {};

  // Real discount calculation only if valid compareAtPrice exists
  const hasValidComparePrice =
    typeof product.compareAtPriceInRupees === 'number' &&
    product.compareAtPriceInRupees > product.sellingPriceInRupees;

  const discount = hasValidComparePrice
    ? Math.round(
        ((product.compareAtPriceInRupees - product.sellingPriceInRupees) /
          product.compareAtPriceInRupees) *
          100
      )
    : 0;

  // Real stock status from backend inventory
  const isOutOfStock = !product.isInStock || product.availableStock <= 0;
  const isLowStock = product.availableStock > 0 && product.availableStock <= 5;

  const statusBadge = isOutOfStock
    ? { label: 'OUT OF STOCK', bg: 'bg-[#71717A] text-white' }
    : isLowStock
    ? { label: `ONLY ${product.availableStock} LEFT`, bg: 'bg-[#E53E3E] text-white' }
    : { label: `IN STOCK (${product.availableStock} UNITS)`, bg: 'bg-[#1769FF] text-white' };

  // Real rating: only display if real rating exists, otherwise display BIS/safety badge
  const realRating = product.rating || specs['Rating'] || null;
  const realReviewsCount = product.reviewCount || specs['ReviewCount'] || null;
  const bisStatus = specs['BIS Status'] === 'VERIFIED' || specs['BIS Standard'];

  // Suffix number for category badge (e.g. #01)
  const idNumber = (product.sku || product.id || '01')
    .replace(/\D/g, '')
    .slice(-2)
    .padStart(2, '0') || '01';

  /* ------------------------------------------------------------- */
  /* LIST VIEW MODE                                                */
  /* ------------------------------------------------------------- */
  if (viewMode === 'list') {
    return (
      <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-4 sm:p-5 flex flex-col md:flex-row items-stretch gap-5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#171717] transition-all group">
        {/* Left: Image Container */}
        <div className="w-full md:w-64 h-56 md:h-auto shrink-0 relative bg-[#F7F3EB] border-2 border-[#171717] overflow-hidden">
          <Link to={`/product/${product.slug}`} className="block w-full h-full">
            <ProductImageWithFallback
              src={product.primaryImage || product.images?.[0]?.url}
              alt={product.name}
              width={400}
              height={300}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Real Discount Overlay (Only if compare-at price exists) */}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-[#E53E3E] text-white font-label-sm text-[10px] font-bold px-2 py-0.5 border border-[#171717] uppercase shadow-[1px_1px_0px_#171717]">
              SAVE {discount}%
            </span>
          )}

          {/* Real Age/Tag Overlay (Only if age spec exists) */}
          {ageBadge && (
            <span
              className={`absolute ${
                discount > 0 ? 'top-8' : 'top-2'
              } left-2 bg-[#FFF9F0] text-[#171717] font-label-sm text-[9px] font-bold px-1.5 py-0.5 border border-[#171717] uppercase shadow-[1px_1px_0px_#171717]`}
            >
              {ageBadge}
            </span>
          )}

          {/* Spec Badge */}
          <span className="absolute bottom-2 right-2 bg-[#FFF9F0] text-[#171717] font-label-sm text-[9px] font-bold px-2 py-0.5 border border-[#171717] uppercase shadow-[1px_1px_0px_#171717]">
            {imageSpecTag}
          </span>
        </div>

        {/* Center: Details */}
        <div className="flex-1 flex flex-col justify-between gap-3">
          <div>
            {/* Category and Wishlist Row */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className={`${categoryStyle.bg} ${categoryStyle.text} font-label-sm text-[10px] font-bold uppercase px-2 py-0.5 border border-[#171717] shadow-[1px_1px_0px_#171717]`}
              >
                {categoryStyle.label} // #{idNumber}
              </span>

              <button
                type="button"
                onClick={() => onToggleWishlist?.(product.id || product._id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className="w-8 h-8 flex items-center justify-center border-2 border-[#171717] rounded bg-[#FFF9F0] hover:bg-[#FFE6E6] shadow-[2px_2px_0px_#171717] transition-all"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    isWishlisted ? 'text-[#E53E3E]' : 'text-[#171717]'
                  }`}
                  style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              </button>
            </div>

            {/* Quality / Verification & Stock Row */}
            <div className="flex items-center justify-between gap-2 mb-2">
              {realRating ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#171717]">
                  <span className="text-[#F59E0B]">★</span>
                  <span>{realRating}</span>
                  {realReviewsCount && (
                    <span className="text-gray-500 font-normal">({realReviewsCount} reviews)</span>
                  )}
                </div>
              ) : bisStatus ? (
                <div className="flex items-center gap-1 font-label-sm text-[11px] font-bold text-[#15803D] uppercase">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  <span>BIS SAFETY VERIFIED</span>
                </div>
              ) : (
                <span className="font-label-sm text-[10px] text-[#747686] uppercase font-bold">
                  SKU: {product.sku}
                </span>
              )}

              <span
                className={`${statusBadge.bg} font-label-sm text-[10px] font-bold uppercase px-2 py-0.5 border border-[#171717]`}
              >
                {statusBadge.label}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-title text-[17px] font-bold text-[#171717] leading-snug hover:text-primary transition-colors">
              <Link to={`/product/${product.slug}`}>{product.name}</Link>
            </h3>

            {/* Description */}
            <p className="font-body-sm text-body-sm text-[#434654] mt-1.5 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Feature Chips */}
            {featureChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {featureChips.map((chip, idx) => (
                  <span
                    key={idx}
                    className="bg-[#FFF9F0] border border-[#171717] px-2 py-0.5 font-label-sm text-[10px] font-bold uppercase text-[#171717] shadow-[1px_1px_0px_#171717]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bottom: Price & Add to Cart Station */}
          <div className="pt-3 border-t-2 border-[#171717]/15 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-price-lg text-2xl font-black text-[#171717]">
                  ₹{product.sellingPriceInRupees?.toLocaleString('en-IN')}
                </span>
                {hasValidComparePrice && (
                  <span className="font-body-sm text-sm text-[#747686] line-through">
                    ₹{product.compareAtPriceInRupees?.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="font-label-sm text-[10px] uppercase text-[#747686] block">
                Inclusive of GST • Direct Dispatch
              </span>
            </div>

            <button
              type="button"
              disabled={isOutOfStock || isAdding}
              onClick={() => onAddToCart?.(product)}
              className="bg-[#1769FF] text-white font-title text-xs uppercase px-5 py-3 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50 flex items-center gap-2 font-bold"
            >
              <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
              <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------- */
  /* GRID VIEW MODE (Matches reference 3-column screenshot card)   */
  /* ------------------------------------------------------------- */
  return (
    <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-3.5 sm:p-4 flex flex-col justify-between h-full hover:-translate-y-1 hover:shadow-[6px_6px_0px_#171717] transition-all group">
      <div>
        {/* Top Header Row: Category Badge (left) & Wishlist Heart (right) */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className={`${categoryStyle.bg} ${categoryStyle.text} font-label-sm text-[10px] font-bold uppercase px-2 py-0.5 border border-[#171717] shadow-[1px_1px_0px_#171717] truncate max-w-[80%]`}
          >
            {categoryStyle.label} // #{idNumber}
          </span>

          <button
            type="button"
            onClick={() => onToggleWishlist?.(product.id || product._id)}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="w-7 h-7 flex items-center justify-center border-2 border-[#171717] rounded bg-[#FFF9F0] hover:bg-[#FFE6E6] shadow-[2px_2px_0px_#171717] transition-all shrink-0"
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                isWishlisted ? 'text-[#E53E3E]' : 'text-[#171717]'
              }`}
              style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Product Image Container */}
        <div className="w-full aspect-[4/3] bg-[#F7F3EB] border-2 border-[#171717] relative overflow-hidden mb-3">
          <Link
            to={`/product/${product.slug}`}
            className="block w-full h-full focus:outline-none"
          >
            <ProductImageWithFallback
              src={product.primaryImage || product.images?.[0]?.url}
              alt={product.name}
              width={400}
              height={300}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Real Discount Overlay (Top Left) */}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-[#E53E3E] text-white font-label-sm text-[10px] font-bold px-1.5 py-0.5 border border-[#171717] uppercase shadow-[1px_1px_0px_#171717]">
              SAVE {discount}%
            </span>
          )}

          {/* Real Age Badge (Below Discount) */}
          {ageBadge && (
            <span
              className={`absolute ${
                discount > 0 ? 'top-7' : 'top-2'
              } left-2 bg-[#FFF9F0] text-[#171717] font-label-sm text-[9px] font-bold px-1.5 py-0.5 border border-[#171717] uppercase shadow-[1px_1px_0px_#171717]`}
            >
              {ageBadge}
            </span>
          )}

          {/* Spec Badge (Bottom Right) */}
          <span className="absolute bottom-2 right-2 bg-[#FFF9F0] text-[#171717] font-label-sm text-[9px] font-bold px-2 py-0.5 border border-[#171717] uppercase shadow-[1px_1px_0px_#171717]">
            {imageSpecTag}
          </span>
        </div>

        {/* Rating/Certification and Real Stock Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {realRating ? (
            <div className="flex items-center gap-1 text-xs font-bold text-[#171717]">
              <span className="text-[#F59E0B]">★</span>
              <span>{realRating}</span>
              {realReviewsCount && (
                <span className="text-gray-500 font-normal text-[11px]">({realReviewsCount})</span>
              )}
            </div>
          ) : bisStatus ? (
            <div className="flex items-center gap-1 font-label-sm text-[10px] font-bold text-[#15803D] uppercase">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>BIS VERIFIED</span>
            </div>
          ) : (
            <span className="font-label-sm text-[10px] text-[#747686] uppercase font-bold">
              SKU: {product.sku}
            </span>
          )}

          <span
            className={`${statusBadge.bg} font-label-sm text-[9px] font-bold uppercase px-2 py-0.5 border border-[#171717] shrink-0`}
          >
            {statusBadge.label}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="font-title text-[15px] font-bold text-[#171717] leading-snug line-clamp-2 mb-2 hover:text-primary transition-colors min-h-[42px]">
          <Link to={`/product/${product.slug}`} title={product.name}>
            {product.name}
          </Link>
        </h3>

        {/* Feature Tags Row from real specs */}
        {featureChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {featureChips.map((chip, idx) => (
              <span
                key={idx}
                className="bg-[#FFF9F0] border border-[#171717] px-2 py-0.5 font-label-sm text-[10px] font-bold uppercase text-[#171717] shadow-[1px_1px_0px_#171717]"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Price & Action Row (Anchored to card bottom) */}
      <div className="pt-2.5 border-t-2 border-[#171717]/15 flex items-center justify-between gap-2 mt-auto">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-price-lg text-xl sm:text-[22px] font-black text-[#171717]">
              ₹{product.sellingPriceInRupees?.toLocaleString('en-IN')}
            </span>
            {hasValidComparePrice && (
              <span className="font-body-sm text-xs text-[#747686] line-through">
                ₹{product.compareAtPriceInRupees?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <span className="font-label-sm text-[9px] uppercase text-[#747686] block truncate">
            Inclusive of GST
          </span>
        </div>

        <button
          type="button"
          disabled={isOutOfStock || isAdding}
          onClick={() => onAddToCart?.(product)}
          className="bg-[#1769FF] text-white font-title text-[11px] sm:text-xs uppercase px-3 py-2 border-2 border-[#171717] shadow-[2px_2px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50 flex items-center gap-1 font-bold shrink-0"
        >
          <span>{isOutOfStock ? 'OUT' : 'ADD'}</span>
          <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
        </button>
      </div>
    </div>
  );
};

export default CollectionProductCard;
