import React from 'react';
import logoImg from '../../assets/toyvolt-logo.png';

/**
 * Official Toyvolt Brand Logo
 * Displays the authentic Toyvolt emblem, 3D wordmark, and "POWER UP THE FUN." tagline.
 */
export const ToyvoltLogo = ({ size = 'md', showBadge = false, className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-12',
    lg: 'h-16 sm:h-20',
    xl: 'h-24 sm:h-28'
  };

  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`inline-flex items-center gap-3 shrink-0 select-none ${className}`}>
      <img
        src={logoImg}
        alt="TOYVOLT — Power Up The Fun."
        className={`${selectedSizeClass} w-auto object-contain block hover:scale-[1.03] transition-transform duration-150`}
        loading="eager"
        fetchPriority="high"
      />
      {showBadge && (
        <span className="hidden sm:inline-flex items-center bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm uppercase px-2 py-0.5 border border-on-surface shadow-[2px_2px_0px_#191919]">
          Power Up
        </span>
      )}
    </div>
  );
};

export default ToyvoltLogo;
