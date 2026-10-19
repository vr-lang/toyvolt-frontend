import React, { useState } from 'react';

/**
 * Renders product images from backend URLs with an intentional Toyvolt RC car SVG fallback
 * if an external image fails to load or is missing.
 */
export const ProductImageWithFallback = ({
  src,
  alt,
  className = 'w-full h-full object-contain',
  fetchPriority,
  loading,
  width = 800,
  height = 600
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt || 'Toyvolt Apex-1 High-Speed RC Drift Car'}
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
            TOYVOLT APEX-1
          </span>
          <span className="font-label-sm text-label-sm uppercase text-[#434654] block">
            1:16 SCALE 4WD RC DRIFT CAR
          </span>
        </div>
      </div>
    );
  }

  const imgProps = {
    src,
    alt: alt || 'Toyvolt Apex-1 RC Drift Car',
    className,
    width,
    height,
    onError: () => setHasError(true)
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
