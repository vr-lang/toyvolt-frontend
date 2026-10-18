/**
 * High-Performance Shared IntersectionObserver Singleton
 * - Exactly one IntersectionObserver instance for the entire page (zero per-element overhead).
 * - Direct DOM class manipulation (zero React re-renders during scrolling).
 * - Automatically unobserves elements once revealed (reveal-once).
 * - Cleans up transition delays and transforms after entrance so hover effects are instantaneous.
 * - Respects prefers-reduced-motion with instant fallback.
 */

let sharedObserver = null;
const observedElements = new Map();

function getSharedObserver() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const config = observedElements.get(el);

            if (config) {
              const delay = config.delay || 0;
              if (delay > 0) {
                el.style.transitionDelay = `${delay}ms`;
              }

              // Trigger hardware-accelerated CSS transition
              el.classList.add('reveal-visible');
              el.classList.remove('reveal-hidden');

              // Once animation completes, clean up transition-delay and release transform
              // so nested hover effects (translate-x, translate-y) have zero CSS conflicts
              const cleanupTimer = setTimeout(() => {
                if (el) {
                  el.style.transitionDelay = '';
                  el.classList.add('reveal-done');
                }
              }, delay + 550);

              observedElements.delete(el);
              sharedObserver?.unobserve(el);
            }
          }
        });
      },
      {
        threshold: 0.05,
        // Positive bottom margin begins smooth entrance just as element approaches viewport
        rootMargin: '0px 0px 50px 0px'
      }
    );
  }

  return sharedObserver;
}

export function registerRevealElement(element, delay = 0) {
  if (!element) return () => {};

  // Instant display if reduced motion is requested or observer is unavailable
  if (
    typeof window === 'undefined' ||
    !('IntersectionObserver' in window) ||
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ) {
    element.classList.add('reveal-visible');
    element.classList.remove('reveal-hidden');
    return () => {};
  }

  const observer = getSharedObserver();
  if (!observer) {
    element.classList.add('reveal-visible');
    element.classList.remove('reveal-hidden');
    return () => {};
  }

  observedElements.set(element, { delay });
  observer.observe(element);

  return () => {
    observedElements.delete(element);
    observer.unobserve(element);
  };
}
