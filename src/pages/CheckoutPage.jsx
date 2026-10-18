import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi, paymentApi, getErrorMessage } from '../lib/api';
import { ProductImageWithFallback } from '../components/product/ProductImageWithFallback';
import { BRAND_CONFIG } from '../config/brandConfig';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const CheckoutPage = ({ backendServices, onOrderPlaced }) => {
  const {
    items,
    subtotalRupees,
    shippingFeeRupees,
    discountRupees,
    finalTotalRupees,
    appliedCoupon,
    couponError,
    setCouponError,
    isValidatingCoupon,
    applyCouponCode,
    removeCoupon,
    savedPincode,
    clearCart
  } = useCart();

  const { user, isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: savedPincode || '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [couponInput, setCouponInput] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');
  const [createdOrderResult, setCreatedOrderResult] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (user?.name && !shippingAddress.fullName) {
      setShippingAddress((prev) => ({ ...prev, fullName: user.name }));
    }
  }, [user]);

  useEffect(() => {
    if (savedPincode && !shippingAddress.postalCode) {
      setShippingAddress((prev) => ({ ...prev, postalCode: savedPincode }));
    }
  }, [savedPincode]);

  const isRazorpayConfiguredOnServer = backendServices?.payments === 'configured';

  const handleFieldChange = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setCheckoutError('');
    setPendingOrder(null);
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    const ok = await applyCouponCode(couponInput);
    if (ok) setCouponInput('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setCheckoutError('');

    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (items.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    if (isPlacingOrder || isVerifyingPayment) {
      return;
    }

    setIsPlacingOrder(true);
    try {
      // 1. Check if an order was already created in this checkout session to prevent duplicate submissions
      let order = pendingOrder;
      if (!order) {
        const directItems = items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity
        }));

        order = await orderApi.createOrder({
          shippingAddress,
          couponCode: appliedCoupon?.code || null,
          paymentMethod,
          directItems
        });

        setPendingOrder(order);
        onOrderPlaced?.();
      }

      // 2. If Razorpay selected, initiate Razorpay payment order on backend
      if (paymentMethod === 'razorpay') {
        const paymentOrderData = await paymentApi.createPaymentOrder(order._id);
        const keyId = paymentOrderData?.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
        const isRealKey =
          keyId &&
          (keyId.startsWith('rzp_test_') || keyId.startsWith('rzp_live_')) &&
          keyId !== 'rzp_test_placeholder';

        if (!isRealKey) {
          // If keys are unconfigured on server, show transparent pending order result
          await clearCart();
          setCreatedOrderResult({
            order,
            paymentState: 'pending_gateway_configuration',
            message:
              'Your order has been created and stock is atomically reserved on the Toyvolt server. Online payment capture is currently in pending state because Razorpay API credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are not yet configured on the deployed server.'
          });
          return;
        }

        const sdkLoaded = await loadRazorpayScript();
        if (!sdkLoaded) {
          setCheckoutError(
            'Order created and inventory reserved, but Razorpay Checkout SDK could not be loaded. Please check your internet connection and retry.'
          );
          setIsPlacingOrder(false);
          return;
        }

        const rzpOptions = {
          key: paymentOrderData.keyId,
          amount: paymentOrderData.amount, // in integer paise
          currency: paymentOrderData.currency || 'INR',
          name: 'TOYVOLT',
          description: `Order #${order.orderNumber}`,
          order_id: paymentOrderData.razorpayOrderId,
          prefill: {
            name: shippingAddress.fullName,
            email: user?.email || '',
            contact: shippingAddress.phone
          },
          theme: {
            color: '#1769FF'
          },
          modal: {
            ondismiss: () => {
              setIsPlacingOrder(false);
              setIsVerifyingPayment(false);
              setCheckoutError(
                'Checkout closed or payment cancelled. Your order is safely preserved. You can retry paying now.'
              );
            }
          },
          handler: async (response) => {
            setIsVerifyingPayment(true);
            try {
              const verifiedOrder = await paymentApi.verifyPayment({
                orderId: order._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });
              await clearCart();
              setCreatedOrderResult({
                order: verifiedOrder || order,
                paymentState: 'paid',
                message:
                  'Payment signature cryptographically verified by the Toyvolt backend! Your order is confirmed.'
              });
            } catch (verifyErr) {
              setCheckoutError(
                getErrorMessage(verifyErr, 'Payment verification failed on server.')
              );
            } finally {
              setIsVerifyingPayment(false);
              setIsPlacingOrder(false);
            }
          }
        };

        const rzp = new window.Razorpay(rzpOptions);

        rzp.on('payment.failed', function (resp) {
          setIsPlacingOrder(false);
          setIsVerifyingPayment(false);
          setCheckoutError(
            resp.error?.description ||
            resp.error?.reason ||
            'Payment failed or was declined by bank. Please retry with a valid payment method.'
          );
        });

        rzp.open();
      } else {
        // Cash on Delivery
        await clearCart();
        setCreatedOrderResult({
          order,
          paymentState: 'cod_placed',
          message:
            'Your order has been placed on the Toyvolt backend and inventory has been atomically reserved.'
        });
      }
    } catch (err) {
      setCheckoutError(getErrorMessage(err, 'Could not place order. Please check your inputs.'));
      setIsPlacingOrder(false);
    }
  };

  // Order Result Screen (No fake payment confirmation!)
  if (createdOrderResult) {
    const { order, paymentState, message } = createdOrderResult;
    const finalRupees = Math.round((order.finalAmount || 0) / 100);

    return (
      <section className="w-full max-w-[960px] mx-auto px-4 lg:px-8 py-12">
        <div className="bg-[#FFF9F0] border-2 border-on-surface shadow-[6px_6px_0px_#191919] p-6 sm:p-10">
          <div className="inline-flex items-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 font-label-sm text-label-sm uppercase font-bold border border-on-surface shadow-[2px_2px_0px_#191919] mb-4">
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>
              {paymentState === 'paid'
                ? 'PAYMENT VERIFIED & ORDER CONFIRMED'
                : 'ORDER CREATED & STOCK RESERVED'}
            </span>
          </div>

          <h1 className="font-headline-lg-mobile sm:text-headline-lg uppercase text-on-surface mb-2">
            ORDER #{order.orderNumber}
          </h1>

          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            {message}
          </p>

          <div className="bg-surface-container-lowest border-2 border-on-surface shadow-[4px_4px_0px_#191919] p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant block">
                Order Status
              </span>
              <span className="font-title text-title uppercase text-on-surface">
                {order.orderStatus}
              </span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant block">
                Payment Status
              </span>
              <span className="font-title text-title uppercase text-secondary">
                {order.paymentStatus} ({order.paymentMethod?.toUpperCase()})
              </span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant block">
                Server-Validated Total
              </span>
              <span className="font-title text-title text-primary">
                ₹{finalRupees.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/orders"
              className="bg-primary-container text-on-primary font-title text-title uppercase px-6 py-3.5 border-2 border-on-surface shadow-[4px_4px_0px_#191919]"
            >
              VIEW MY ORDERS &amp; STATUS
            </Link>
            <Link
              to="/"
              className="bg-surface-container-lowest text-on-surface font-title text-title uppercase px-6 py-3.5 border-2 border-on-surface shadow-[4px_4px_0px_#191919]"
            >
              RETURN TO STOREFRONT
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[1360px] mx-auto px-4 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <span className="font-label-sm text-label-sm uppercase font-bold text-secondary block">
          SERVER-VALIDATED CHECKOUT
        </span>
        <h1 className="font-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
          COMPLETE YOUR TOYVOLT ORDER
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="bg-[#FFF9F0] border-2 border-on-surface shadow-[5px_5px_0px_#191919] p-8 text-center">
          <h2 className="font-headline-sm text-headline-sm uppercase mb-2">
            YOUR CART IS EMPTY
          </h2>
          <p className="font-body-md text-on-surface-variant mb-6">
            Add the Toyvolt Apex-1 RC Drift Car to your cart before checking out.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-container text-on-primary font-title text-title uppercase px-6 py-3.5 border-2 border-on-surface shadow-[4px_4px_0px_#191919]"
          >
            <span>BACK TO STOREFRONT</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Shipping Address & Payment Method Form (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Auth Prompt if Guest */}
            {!isAuthenticated && (
              <div className="bg-tertiary-fixed border-2 border-on-surface shadow-[4px_4px_0px_#191919] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface block">
                    AUTHENTICATION REQUIRED FOR ORDER PLACEMENT
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Sign in or verify your email with a 6-digit OTP to place your order and unlock code{' '}
                    <strong>WELCOME100</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="bg-on-surface text-surface font-label-lg text-label-lg uppercase px-5 py-3 border-2 border-on-surface font-bold shrink-0"
                >
                  SIGN IN / REGISTER
                </button>
              </div>
            )}

            <form
              id="checkout-form"
              onSubmit={handlePlaceOrder}
              className="bg-[#FFF9F0] border-2 border-on-surface shadow-[5px_5px_0px_#191919] p-6 space-y-5"
            >
              <h2 className="font-headline-sm text-headline-sm uppercase text-on-surface pb-3 border-b-2 border-on-surface">
                1. SHIPPING ADDRESS (INDIA)
              </h2>

              {checkoutError && (
                <div
                  role="alert"
                  className="p-4 bg-[#FFF0F0] text-[#B00020] border-2 border-on-surface shadow-[4px_4px_0px_#191919] space-y-1.5"
                >
                  <div className="flex items-center gap-2 font-bold font-title text-[15px] uppercase">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>Checkout Notice</span>
                  </div>
                  <p className="font-body-sm text-body-sm leading-snug">
                    {checkoutError}
                  </p>
                  {(checkoutError.toLowerCase().includes('payment') ||
                    checkoutError.toLowerCase().includes('gateway') ||
                    checkoutError.toLowerCase().includes('razorpay')) && (
                    <div className="mt-2 pt-2 border-t border-[#F2B8B8] text-[12px] text-[#8A0019]">
                      💡 <strong>Alternative Option:</strong> You can select <strong>Pay on Delivery</strong> below to reserve your order without online payment.
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="chk-fullname"
                    className="block font-label-sm text-label-sm uppercase font-bold mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    id="chk-fullname"
                    type="text"
                    required
                    minLength={2}
                    value={shippingAddress.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    placeholder="Aarav Sharma"
                    className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-body-md focus:outline-none focus:bg-[#FFF9F0]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="chk-phone"
                    className="block font-label-sm text-label-sm uppercase font-bold mb-1"
                  >
                    10-Digit Mobile Number *
                  </label>
                  <input
                    id="chk-phone"
                    type="tel"
                    required
                    minLength={10}
                    maxLength={15}
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      handleFieldChange('phone', e.target.value.replace(/[^\d+]/g, ''))
                    }
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-body-md focus:outline-none focus:bg-[#FFF9F0]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="chk-addr1"
                  className="block font-label-sm text-label-sm uppercase font-bold mb-1"
                >
                  Address Line 1 (House No, Building, Street) *
                </label>
                <input
                  id="chk-addr1"
                  type="text"
                  required
                  minLength={3}
                  value={shippingAddress.addressLine1}
                  onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
                  placeholder="Flat 402, Skyline Towers"
                  className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-body-md focus:outline-none focus:bg-[#FFF9F0]"
                />
              </div>

              <div>
                <label
                  htmlFor="chk-addr2"
                  className="block font-label-sm text-label-sm uppercase font-bold mb-1"
                >
                  Address Line 2 (Area, Landmark — Optional)
                </label>
                <input
                  id="chk-addr2"
                  type="text"
                  value={shippingAddress.addressLine2}
                  onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
                  placeholder="Sector 14"
                  className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-body-md focus:outline-none focus:bg-[#FFF9F0]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="chk-city"
                    className="block font-label-sm text-label-sm uppercase font-bold mb-1"
                  >
                    City *
                  </label>
                  <input
                    id="chk-city"
                    type="text"
                    required
                    minLength={2}
                    value={shippingAddress.city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    placeholder="Gurugram"
                    className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-body-md focus:outline-none focus:bg-[#FFF9F0]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="chk-state"
                    className="block font-label-sm text-label-sm uppercase font-bold mb-1"
                  >
                    State *
                  </label>
                  <input
                    id="chk-state"
                    type="text"
                    required
                    minLength={2}
                    value={shippingAddress.state}
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    placeholder="Haryana"
                    className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-body-md focus:outline-none focus:bg-[#FFF9F0]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="chk-pincode"
                    className="block font-label-sm text-label-sm uppercase font-bold mb-1"
                  >
                    PIN Code *
                  </label>
                  <input
                    id="chk-pincode"
                    type="text"
                    inputMode="numeric"
                    required
                    minLength={6}
                    maxLength={6}
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      handleFieldChange('postalCode', e.target.value.replace(/\D/g, ''))
                    }
                    placeholder="122001"
                    className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-body-md focus:outline-none focus:bg-[#FFF9F0]"
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="pt-4 border-t-2 border-on-surface">
                <h2 className="font-headline-sm text-headline-sm uppercase text-on-surface mb-3">
                  2. PAYMENT METHOD
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`cursor-pointer border-2 border-on-surface p-4 flex items-start gap-3 transition-all ${
                      paymentMethod === 'razorpay'
                        ? 'bg-primary-fixed shadow-[3px_3px_0px_#191919]'
                        : 'bg-surface-container-lowest'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => handlePaymentMethodChange('razorpay')}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-title text-[16px] uppercase block text-on-surface flex items-center gap-2">
                        <span>Razorpay Online Checkout</span>
                        <span className="bg-[#1769FF] text-white text-[10px] font-bold px-1.5 py-0.5 border border-[#171717]">
                          TEST MODE
                        </span>
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
                        UPI, Cards, NetBanking via Razorpay Test Environment
                      </span>
                      <span className="inline-block mt-1 font-label-sm text-[11px] font-bold text-[#1769FF] bg-[#EBF2FF] px-2 py-0.5 border border-[#1769FF]">
                        ⚡ TEST MODE: Use Razorpay test cards (no real charges will occur)
                      </span>
                    </div>
                  </label>

                  <label
                    className={`cursor-pointer border-2 border-on-surface p-4 flex items-start gap-3 transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-tertiary-fixed shadow-[3px_3px_0px_#191919]'
                        : 'bg-surface-container-lowest'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => handlePaymentMethodChange('cod')}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-title text-[16px] uppercase block text-on-surface">
                        Pay on Delivery (Order Reservation)
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
                        Atomic inventory reservation without immediate online payment
                      </span>
                    </div>
                  </label>
                </div>

                {!isRazorpayConfiguredOnServer && (
                  <p className="mt-3 p-3 bg-surface-container-lowest border border-on-surface font-body-sm text-body-sm text-on-surface-variant">
                    <strong>Integration Status Notice:</strong> Live `/api/v1/health` reports{' '}
                    <code>payments: unconfigured</code>. Placing an order will execute real
                    server-side stock reservation and price validation (`POST /api/v1/orders`),
                    without simulating a fake payment capture.
                  </p>
                )}
              </div>

              {isVerifyingPayment && (
                <div className="p-3.5 bg-primary-fixed text-on-primary border-2 border-on-surface font-title text-sm flex items-center gap-2 animate-pulse shadow-[3px_3px_0px_#191919]">
                  <span className="material-symbols-outlined text-[20px]">sync</span>
                  <span>VERIFYING PAYMENT SIGNATURE WITH SERVER... PLEASE DO NOT CLOSE THIS WINDOW</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isPlacingOrder || isVerifyingPayment}
                className="w-full py-4 px-6 bg-primary-container text-on-primary font-title text-title uppercase border-2 border-on-surface shadow-[5px_5px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#191919] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isVerifyingPayment ? 'verified_user' : 'lock'}
                </span>
                <span>
                  {isVerifyingPayment
                    ? 'VERIFYING PAYMENT SIGNATURE...'
                    : isPlacingOrder
                    ? 'OPENING SECURE CHECKOUT...'
                    : pendingOrder
                    ? `RETRY PAYMENT • ₹${finalTotalRupees.toLocaleString('en-IN')}`
                    : isAuthenticated
                    ? `PLACE ORDER • ₹${finalTotalRupees.toLocaleString('en-IN')}`
                    : 'SIGN IN TO PLACE ORDER'}
                </span>
              </button>

              {/* Razorpay & Storefront Compliance Notice */}
              <div className="pt-2 text-center text-on-surface-variant font-body-sm text-[12px] leading-relaxed">
                By completing this order, you agree to Toyvolt&apos;s{' '}
                <Link to="/terms-and-conditions" target="_blank" className="text-primary underline font-bold">
                  Terms &amp; Conditions
                </Link>
                ,{' '}
                <Link to="/privacy-policy" target="_blank" className="text-primary underline font-bold">
                  Privacy Policy
                </Link>
                ,{' '}
                <Link to="/shipping-policy" target="_blank" className="text-primary underline font-bold">
                  Shipping Policy
                </Link>
                , and{' '}
                <Link to="/cancellation-and-refund" target="_blank" className="text-primary underline font-bold">
                  Cancellation &amp; Refund Policy
                </Link>
                .
              </div>
            </form>
          </div>

          {/* Right: Order Summary & Server-Validated Coupon (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-[#FFF9F0] border-2 border-on-surface shadow-[5px_5px_0px_#191919] p-6 space-y-5">
            <h2 className="font-headline-sm text-headline-sm uppercase text-on-surface pb-3 border-b-2 border-on-surface">
              ORDER SUMMARY
            </h2>

            <div className="space-y-3">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-surface-container-lowest border-2 border-on-surface p-3 flex items-center gap-3"
                >
                  <div className="w-16 h-16 border border-on-surface shrink-0 overflow-hidden">
                    <ProductImageWithFallback
                      src={product.primaryImage || product.images?.[0]?.url}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-title text-[15px] text-on-surface truncate">
                      {product.name}
                    </h3>
                    <p className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                      Qty: {quantity} × ₹{product.sellingPriceInRupees.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className="font-title text-title text-on-surface font-bold">
                    ₹{(product.sellingPriceInRupees * quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Box */}
            <div className="bg-surface-container-lowest border-2 border-on-surface p-4">
              <span className="font-label-sm text-label-sm uppercase font-bold block mb-2">
                PROMO CODE (`POST /api/v1/coupons/validate`)
              </span>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-tertiary-fixed px-3 py-2 border border-on-surface">
                  <span className="font-label-md text-label-md font-bold">
                    ✓ {appliedCoupon.code} (−₹{appliedCoupon.discountAmountRupees})
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="font-label-sm text-label-sm uppercase text-error underline font-bold"
                  >
                    REMOVE
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        if (couponError) setCouponError('');
                      }}
                      placeholder="WELCOME100"
                      className="flex-1 px-3 py-2 bg-[#FFFCF7] border-2 border-on-surface font-label-md uppercase focus:outline-none focus:bg-[#FFF9F0]"
                    />
                    <button
                      type="submit"
                      disabled={isValidatingCoupon}
                      className="px-4 py-2 bg-on-surface text-surface font-label-md text-label-md uppercase font-bold"
                    >
                      APPLY
                    </button>
                  </form>
                  {couponError && (
                    <p className="font-label-sm text-label-sm text-error mt-1.5">
                      {couponError}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 pt-3 border-t-2 border-on-surface font-body-md text-body-md">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="font-bold">₹{subtotalRupees.toLocaleString('en-IN')}</span>
              </div>
              {discountRupees > 0 && (
                <div className="flex justify-between text-[#15803d] font-bold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>− ₹{discountRupees.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Shipping Fee</span>
                <span className="font-bold">
                  {shippingFeeRupees === 0 ? 'FREE (₹0)' : `₹${shippingFeeRupees}`}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t-2 border-on-surface">
                <span className="font-headline-sm text-headline-sm uppercase">
                  Final Payable
                </span>
                <span className="font-display-mobile text-display-mobile text-primary font-bold">
                  ₹{finalTotalRupees.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CheckoutPage;
