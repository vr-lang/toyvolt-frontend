import React, { useEffect, useRef } from 'react';
import { registerRevealElement } from '../../lib/revealObserver';

/**
 * ScrollReveal wraps elements in a lightweight, GPU-composited fade-up reveal.
 * - Zero React re-renders on scroll (managed via shared IntersectionObserver singleton).
 * - Reveals once when approaching the viewport.
 * - Hardware accelerated (transform + opacity only).
 * - Full reduced-motion respect with instant display fallback.
 */
export const ScrollReveal = ({
  children,
  className = '',
  style = {},
  delay = 0,
  as: Component = 'div',
  ...rest
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    return registerRevealElement(node, delay);
  }, [delay]);

  return (
    <Component
      ref={ref}
      className={`reveal-hidden ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default ScrollReveal;
