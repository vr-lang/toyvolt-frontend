import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { cartApi, couponApi, getErrorMessage } from '../lib/api';
import { useAuth } from './AuthContext';
import { BRAND_CONFIG } from '../config/brandConfig';

const CartContext = createContext(null);

const LOCAL_CART_STORAGE_KEY = 'toyvolt_cart_v1';
const LOCAL_COUPON_STORAGE_KEY = 'toyvolt_applied_coupon_v1';
const LOCAL_PINCODE_STORAGE_KEY = 'toyvolt_saved_pincode_v1';

const loadLocalCart = () => {
  try {
    const raw = localStorage.getItem(LOCAL_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveLocalCart = (items) => {
  try {
    localStorage.setItem(LOCAL_CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Local cart items structure: [{ product: normalizedProduct, quantity: number }]
  const [items, setItems] = useState(() => loadLocalCart());
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSyncingCart, setIsSyncingCart] = useState(false);
  const [cartFeedback, setCartFeedback] = useState(null);

  // Coupon state validated against POST /api/v1/coupons/validate
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Saved PIN code from Delivery Checker for checkout pre-fill
  const [savedPincode, setSavedPincode] = useState(() => {
    try {
      return localStorage.getItem(LOCAL_PINCODE_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const updateSavedPincode = useCallback((pin) => {
    setSavedPincode(pin);
    try {
      if (pin) {
        localStorage.setItem(LOCAL_PINCODE_STORAGE_KEY, pin);
      } else {
        localStorage.removeItem(LOCAL_PINCODE_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist local cart changes
  useEffect(() => {
    saveLocalCart(items);
  }, [items]);

  // Persist applied coupon
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(LOCAL_COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(LOCAL_COUPON_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [appliedCoupon]);

  const showToast = useCallback((message, type = 'success') => {
    setCartFeedback({ message, type, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!cartFeedback) return undefined;
    const timer = setTimeout(() => setCartFeedback(null), 3500);
    return () => clearTimeout(timer);
  }, [cartFeedback]);

  /**
   * Revalidate local cart items against fresh product data fetched from GET /products
   */
  const syncWithLatestProductCatalog = useCallback((catalogProducts) => {
    if (!Array.isArray(catalogProducts) || catalogProducts.length === 0) return;

    setItems((prevItems) => {
      if (prevItems.length === 0) return prevItems;
      let changed = false;
      const updated = prevItems
        .map((entry) => {
          const fresh = catalogProducts.find(
            (p) => p.id === entry.product?.id || p.slug === entry.product?.slug
          );
          if (!fresh) return entry;

          const clampedQty = Math.min(entry.quantity, Math.max(0, fresh.availableStock));
          if (
            clampedQty !== entry.quantity ||
            fresh.sellingPrice !== entry.product.sellingPrice ||
            fresh.availableStock !== entry.product.availableStock
          ) {
            changed = true;
          }
          if (clampedQty <= 0) return null;
          return {
            product: fresh,
            quantity: clampedQty
          };
        })
        .filter(Boolean);

      return changed ? updated : prevItems;
    });
  }, []);

  /**
   * Synchronize cart with backend /api/v1/cart when user logs in
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    const syncServerCart = async () => {
      setIsSyncingCart(true);
      try {
        // Push any local items to server cart first if server cart is empty
        const serverCart = await cartApi.getCart();
        if (isMounted && serverCart) {
          if (serverCart.items?.length === 0 && items.length > 0) {
            for (const localItem of items) {
              await cartApi
                .addItem({
                  productId: localItem.product.id,
                  quantity: localItem.quantity
                })
                .catch(() => {});
            }
            const refreshedCart = await cartApi.getCart();
            if (isMounted && refreshedCart?.items?.length > 0) {
              setItems(
                refreshedCart.items.map((i) => ({
                  product: {
                    ...i.product,
                    primaryImage: i.product.image,
                    images: i.product.image ? [{ url: i.product.image, isPrimary: true }] : []
                  },
                  quantity: i.quantity
                }))
              );
            }
          }
        }
      } catch {
        // Keep local cart operational if server cart request fails
      } finally {
        if (isMounted) setIsSyncingCart(false);
      }
    };

    syncServerCart();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const addToCart = useCallback(
    async (product, quantityToAdd = 1, openDrawer = true) => {
      if (!product || !product.id) return false;

      const maxStock = typeof product.availableStock === 'number' ? product.availableStock : 0;
      if (maxStock <= 0 || !product.isInStock) {
        showToast('This product is currently out of stock.', 'error');
        return false;
      }

      const existingItem = items.find((i) => i.product.id === product.id);
      const currentQty = existingItem ? existingItem.quantity : 0;
      const targetQty = currentQty + quantityToAdd;

      if (targetQty > maxStock) {
        showToast(`Maximum available stock (${maxStock} units) reached.`, 'error');
        return false;
      }

      // Optimistically update local cart
      setItems((prev) => {
        const index = prev.findIndex((i) => i.product.id === product.id);
        if (index > -1) {
          const next = [...prev];
          next[index] = {
            product,
            quantity: Math.min(maxStock, next[index].quantity + quantityToAdd)
          };
          return next;
        }
        return [...prev, { product, quantity: Math.min(maxStock, quantityToAdd) }];
      });

      if (openDrawer) {
        setIsCartDrawerOpen(true);
      }
      showToast(`Added ${product.name} to your cart!`, 'success');

      if (isAuthenticated) {
        try {
          await cartApi.addItem({ productId: product.id, quantity: quantityToAdd });
        } catch {
          // Local state remains intact; checkout uses directItems or server cart
        }
      }

      return true;
    },
    [items, isAuthenticated, showToast]
  );

  const updateQuantity = useCallback(
    async (productId, newQuantity) => {
      const targetItem = items.find((i) => i.product.id === productId);
      if (!targetItem) return;

      if (newQuantity <= 0) {
        setItems((prev) => prev.filter((i) => i.product.id !== productId));
        if (isAuthenticated) {
          cartApi.removeItem(productId).catch(() => {});
        }
        showToast('Item removed from cart.', 'info');
        return;
      }

      const maxStock =
        typeof targetItem.product.availableStock === 'number'
          ? targetItem.product.availableStock
          : 100;

      if (newQuantity > maxStock) {
        showToast(`Only ${maxStock} units available in stock.`, 'error');
        return;
      }

      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity: newQuantity } : i
        )
      );

      if (isAuthenticated) {
        cartApi.updateItemQuantity(productId, newQuantity).catch(() => {});
      }
    },
    [items, isAuthenticated, showToast]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      showToast('Removed item from cart.', 'info');
      if (isAuthenticated) {
        cartApi.removeItem(productId).catch(() => {});
      }
    },
    [isAuthenticated, showToast]
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    setAppliedCoupon(null);
    if (isAuthenticated) {
      cartApi.clearCart().catch(() => {});
    }
  }, [isAuthenticated]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotalPaise = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.product.sellingPrice || 0) * item.quantity,
        0
      ),
    [items]
  );

  const subtotalRupees = useMemo(() => Math.round(subtotalPaise / 100), [subtotalPaise]);

  const shippingFeePaise = useMemo(() => {
    if (subtotalPaise === 0) return 0;
    return subtotalPaise >= BRAND_CONFIG.shipping.freeShippingThresholdPaise
      ? 0
      : BRAND_CONFIG.shipping.standardShippingFeePaise;
  }, [subtotalPaise]);

  const shippingFeeRupees = useMemo(
    () => Math.round(shippingFeePaise / 100),
    [shippingFeePaise]
  );

  // Revalidate or clear coupon when subtotal changes
  useEffect(() => {
    if (!appliedCoupon) return;
    if (subtotalPaise === 0) {
      setAppliedCoupon(null);
      return;
    }

    let cancelled = false;
    couponApi
      .validateCoupon({ code: appliedCoupon.code, subtotal: subtotalPaise })
      .then((res) => {
        if (!cancelled && res?.isValid) {
          setAppliedCoupon({
            code: res.coupon.code,
            description: res.coupon.description,
            discountType: res.coupon.discountType,
            discountValue: res.coupon.discountValue,
            discountAmountPaise: res.discountAmount,
            discountAmountRupees: res.discountAmountInRupees
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAppliedCoupon(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [subtotalPaise]);

  const applyCouponCode = useCallback(
    async (codeInput, customSubtotalPaise = null) => {
      const cleanCode = (codeInput || '').trim().toUpperCase();
      if (!cleanCode) {
        setCouponError('Please enter a coupon code.');
        return false;
      }

      const targetSubtotal =
        customSubtotalPaise !== null ? customSubtotalPaise : subtotalPaise;

      if (targetSubtotal <= 0) {
        setCouponError('Add the Toyvolt RC Car to your cart before applying a coupon.');
        return false;
      }

      setIsValidatingCoupon(true);
      setCouponError('');
      try {
        const result = await couponApi.validateCoupon({
          code: cleanCode,
          subtotal: targetSubtotal
        });

        if (result?.isValid) {
          const couponData = {
            code: result.coupon.code,
            description: result.coupon.description,
            discountType: result.coupon.discountType,
            discountValue: result.coupon.discountValue,
            discountAmountPaise: result.discountAmount,
            discountAmountRupees: result.discountAmountInRupees
          };
          setAppliedCoupon(couponData);
          showToast(
            `Coupon ${couponData.code} applied! You save ₹${couponData.discountAmountRupees}.`,
            'success'
          );
          return true;
        }
        return false;
      } catch (err) {
        const msg = getErrorMessage(err, 'Invalid or expired coupon code.');
        setCouponError(msg);
        return false;
      } finally {
        setIsValidatingCoupon(false);
      }
    },
    [subtotalPaise, showToast]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponError('');
  }, []);

  const discountPaise = appliedCoupon?.discountAmountPaise || 0;
  const discountRupees = appliedCoupon?.discountAmountRupees || 0;

  const finalTotalPaise = Math.max(0, subtotalPaise - discountPaise + shippingFeePaise);
  const finalTotalRupees = Math.round(finalTotalPaise / 100);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotalPaise,
        subtotalRupees,
        shippingFeePaise,
        shippingFeeRupees,
        discountPaise,
        discountRupees,
        finalTotalPaise,
        finalTotalRupees,
        appliedCoupon,
        couponError,
        setCouponError,
        isValidatingCoupon,
        applyCouponCode,
        removeCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isSyncingCart,
        cartFeedback,
        setCartFeedback,
        savedPincode,
        updateSavedPincode,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        syncWithLatestProductCatalog
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
