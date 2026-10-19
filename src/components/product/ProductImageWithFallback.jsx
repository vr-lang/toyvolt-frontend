import React, { useState, useEffect } from 'react';

const DEFAULT_FALLBACK_IMAGE = '/images/products/spray-monster-hero.jpg';

/**
 * Renders product images from backend or local URLs with an automatic fallback
 * to the verified local Toyvolt RC car asset if an external image fails or 404s.
 */
export const ProductImageWithFallback = ({
  src,
  alt,
  className = 'w-full h-full object-contain',
  fetchPriority,
  loading,
  width = 800,
  height = 600,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE
}) => {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);
  const [hasFatalError, setHasFatalError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setHasTriedFallback(false);
    setHasFatalError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasTriedFallback && fallbackSrc && currentSrc !== fallbackSrc) {
      setHasTriedFallback(true);
      setCurrentSrc(fallbackSrc);
    } else {
      setHasFatalError(true);
    }
  };

  if (!currentSrc || hasFatalError) {
    return (
      <div
        role="img"
        aria-label={alt || 'Toyvolt High-Speed RC Car'}
        className="w-full h-full bg-[#1769FF] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none"
      >
        <div
          className="absolute inset-0 bg-[#FF7626]"
          style={{ clipPath: 'polygon(62% 0, 100% 0, 100% 100%, 38% 100%)' }}
        />
        <div className="relative z-10 bg-[#FFF3DF] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] px-4 py-3">
          <span className="material-symbols-outlined text-[36px] text-[#1769FF] block mb-1">
            directions_car
          </span>
          <span className="font-headline-sm text-headline-sm uppercase font-bold text-[#171717] block">
            TOYVOLT RC CAR
          </span>
          <span className="font-label-sm text-label-sm uppercase text-[#434654] block">
            HIGH-SPEED 4WD
          </span>
        </div>
      </div>
    );
  }

  const imgProps = {
    src: currentSrc,
    alt: alt || 'Toyvolt RC Car',
    className,
    width,
    height,
    onError: handleError
  };

  if (fetchPriority) {
    imgProps.fetchPriority = fetchPriority;
  }
  if (loading && fetchPriority !== 'high') {
    imgProps.loading = loading;
  }

  return <img {...imgProps} />;
};

export default ProductImageWithFallback;
