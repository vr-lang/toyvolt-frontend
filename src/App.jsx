import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { productApi, healthApi, getErrorMessage } from './lib/api';
import { resetAllBodyScrollLocks } from './lib/useBodyScrollLock';
import { useCart } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductPage } from './pages/ProductPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { AdminPage } from './pages/AdminPage';
import { SignInPage } from './pages/SignInPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { ShippingPolicyPage } from './pages/ShippingPolicyPage';
import { CancellationRefundPage } from './pages/CancellationRefundPage';
import { ReturnExchangePage } from './pages/ReturnExchangePage';

export const App = () => {
  const { syncWithLatestProductCatalog, cartFeedback, setCartFeedback } = useCart();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productError, setProductError] = useState('');
  const [backendServices, setBackendServices] = useState(null);

  // Guarantee body scroll is unlocked whenever the route changes
  useEffect(() => {
    resetAllBodyScrollLocks();
  }, [location.pathname, isLoadingProducts]);

  const fetchStorefrontData = useCallback(
    async ({ forceRefresh = false } = {}) => {
      setIsLoadingProducts(true);
      setProductError('');
      try {
        const { products: fetchedProducts } = await productApi.getProducts(
          {},
          { forceRefresh }
        );
        setProducts(fetchedProducts);
        syncWithLatestProductCatalog(fetchedProducts);
      } catch (err) {
        setProductError(
          getErrorMessage(
            err,
            'Could not load the Toyvolt product catalog from the backend.'
          )
        );
      } finally {
        setIsLoadingProducts(false);
      }
    },
    [syncWithLatestProductCatalog]
  );

  useEffect(() => {
    fetchStorefrontData();

    // Inspect live backend service availability (/api/v1/health)
    healthApi
      .getHealth()
      .then((data) => {
        if (data?.services) {
          setBackendServices(data.services);
        }
      })
      .catch(() => {
        // Non-blocking
      });
  }, [fetchStorefrontData]);

  // Flagship product is the primary active product from the backend
  const flagshipProduct = products[0] || null;

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-clip bg-surface text-on-surface font-body-md">
      <Navbar product={flagshipProduct} />

      {/* Toast Feedback Banner */}
      {cartFeedback && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#FFF9F0] border-2 border-on-surface shadow-[5px_5px_0px_#191919] px-4 py-3 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-[20px] ${
                cartFeedback.type === 'error' ? 'text-error' : 'text-primary'
              }`}
            >
              {cartFeedback.type === 'error' ? 'error' : 'check_circle'}
            </span>
            <span className="font-label-md text-label-md font-bold text-on-surface">
              {cartFeedback.message}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCartFeedback(null)}
            aria-label="Dismiss notification"
            className="text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Main Content Area (pt-16 sm:pt-20 matches compact fixed navbar height) */}
      <main className="w-full pt-16 sm:pt-20 bg-surface flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                product={flagshipProduct}
                isLoading={isLoadingProducts}
                error={productError}
                onRetry={() => fetchStorefrontData({ forceRefresh: true })}
                backendServices={backendServices}
              />
            }
          />
          <Route
            path="/about"
            element={
              <AboutPage
                product={flagshipProduct}
                isLoading={isLoadingProducts}
              />
            }
          />
          <Route
            path="/contact"
            element={
              <ContactPage
                product={flagshipProduct}
                backendServices={backendServices}
              />
            }
          />
          <Route
            path="/collection"
            element={
              <CollectionPage
                backendServices={backendServices}
              />
            }
          />
          <Route
            path="/shop"
            element={<Navigate to="/collection" replace />}
          />
          <Route
            path="/product/:slug"
            element={
              <ProductPage
                initialProduct={flagshipProduct}
                isCatalogLoading={isLoadingProducts}
                backendServices={backendServices}
              />
            }
          />
          <Route
            path="/login"
            element={<SignInPage product={flagshipProduct} />}
          />
          <Route
            path="/signin"
            element={<Navigate to="/login" replace />}
          />
          <Route
            path="/register"
            element={<RegisterPage />}
          />
          <Route
            path="/signup"
            element={<Navigate to="/register" replace />}
          />
          <Route
            path="/verify-email"
            element={<VerifyEmailPage />}
          />
          <Route
            path="/verify-otp"
            element={<Navigate to="/verify-email" replace />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                backendServices={backendServices}
                onOrderPlaced={() => fetchStorefrontData({ forceRefresh: true })}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <OrdersPage
                onOrderCancelled={() => fetchStorefrontData({ forceRefresh: true })}
              />
            }
          />
          <Route
            path="/orders/:id"
            element={
              <OrderDetailsPage
                onOrderCancelled={() => fetchStorefrontData({ forceRefresh: true })}
              />
            }
          />
          <Route
            path="/order/:id"
            element={
              <OrderDetailsPage
                onOrderCancelled={() => fetchStorefrontData({ forceRefresh: true })}
              />
            }
          />
          <Route
            path="/admin"
            element={
              <AdminPage
                onCatalogUpdated={() => fetchStorefrontData({ forceRefresh: true })}
              />
            }
          />

          {/* Policy & Legal Compliance Routes (Razorpay Verification) */}
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />

          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />

          <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
          <Route path="/shipping" element={<Navigate to="/shipping-policy" replace />} />
          <Route path="/shipping-and-delivery" element={<Navigate to="/shipping-policy" replace />} />

          <Route path="/cancellation-and-refund" element={<CancellationRefundPage />} />
          <Route path="/cancellation-policy" element={<Navigate to="/cancellation-and-refund" replace />} />
          <Route path="/refund-policy" element={<Navigate to="/cancellation-and-refund" replace />} />

          <Route path="/return-and-exchange" element={<ReturnExchangePage />} />
          <Route path="/return-and-exchange-policy" element={<Navigate to="/return-and-exchange" replace />} />
          <Route path="/returns" element={<Navigate to="/return-and-exchange" replace />} />
          <Route path="/return-policy" element={<Navigate to="/return-and-exchange" replace />} />

          {/* Fallback Catch-All Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer product={flagshipProduct} backendServices={backendServices} />

      {/* Slide-Over Cart Drawer */}
      <CartDrawer />
    </div>
  );
};

export default App;
