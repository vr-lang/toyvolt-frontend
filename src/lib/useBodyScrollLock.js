import { useEffect, useId } from 'react';

const activeScrollLocks = new Set();

const syncBodyOverflow = () => {
  if (typeof document === 'undefined') return;
  if (activeScrollLocks.size > 0) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
};

/**
 * Safely locks document.body scrolling while `isLocked` is true
 * and guarantees cleanup on close or component unmount.
 */
export const useBodyScrollLock = (isLocked) => {
  const lockId = useId();

  useEffect(() => {
    if (isLocked) {
      activeScrollLocks.add(lockId);
    } else {
      activeScrollLocks.delete(lockId);
    }
    syncBodyOverflow();

    return () => {
      activeScrollLocks.delete(lockId);
      syncBodyOverflow();
    };
  }, [isLocked, lockId]);
};

/**
 * Unconditionally clears any residual scroll locks (e.g. on route changes).
 */
export const resetAllBodyScrollLocks = () => {
  activeScrollLocks.clear();
  syncBodyOverflow();
};
