import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  authApi,
  getErrorMessage,
  getRememberedEmail,
  setRememberedEmail
} from '../lib/api';
import { ProductImageWithFallback } from '../components/product/ProductImageWithFallback';
import { BRAND_CONFIG } from '../config/brandConfig';

export const SignInPage = ({ product }) => {
  const {
    isAuthenticated,
    pendingVerificationEmail,
    setPendingVerificationEmail,
    handleLoginSuccess
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(
    () => location.state?.email || pendingVerificationEmail || getRememberedEmail() || ''
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(() => Boolean(getRememberedEmail()) || true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState(location.state?.infoMessage || '');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const dest = location.state?.from || '/';
      navigate(dest === '/login' ? '/' : dest, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  // Live product data with verified backend fallback while catalog loads
  const featuredName =
    product?.name || 'Toyvolt Apex-1 High-Speed RC Drift Car (1:16 Scale)';
  const featuredSlug = product?.slug || 'toyvolt-apex-1-rc-drift-car';
  const featuredSku = product?.sku || 'TV-RC-001';
  const featuredPrice = product?.sellingPriceInRupees ?? 2499;
  const featuredComparePrice = product?.compareAtPriceInRupees ?? 3499;
  const featuredStock = product?.availableStock ?? 100;
  const featuredImage =
    product?.primaryImage ||
    product?.images?.[0]?.url ||
    '/images/products/spray-monster-hero.jpg';

  const storeBenefits = [
    {
      icon: 'confirmation_number',
      iconBg: 'bg-[#1769FF] text-white',
      title: 'Welcome Coupon (WELCOME100)',
      desc: 'Flat ₹100 OFF on verified orders ≥ ₹999 at checkout.'
    },
    {
      icon: 'local_shipping',
      iconBg: 'bg-[#FF7626] text-white',
      title: '100% Free Shipping Nationwide',
      desc: 'Enjoy ₹0 delivery charges on all Toyvolt orders across India.'
    },
    {
      icon: 'package_2',
      iconBg: 'bg-tertiary-fixed text-[#171717]',
      title: 'Live Order & Stock Control',
      desc: 'Atomic inventory reservation, order tracking & instant self-service cancellation.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      const res = await authApi.login({
        email: trimmedEmail,
        password,
        rememberDevice
      });

      if (rememberDevice) {
        setRememberedEmail(trimmedEmail);
      } else {
        setRememberedEmail('');
      }

      if (res?.data?.user) {
        handleLoginSuccess(res.data.user, location.state?.from);
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Invalid email or password.');
      setErrorMsg(msg);

      if (msg.toLowerCase().includes('verify your email')) {
        setPendingVerificationEmail(trimmedEmail);
        navigate('/verify-email', {
          state: {
            from: location.state?.from || '/',
            email: trimmedEmail,
            infoMessage:
              'Your account is registered but not yet verified. Enter your 6-digit email OTP or request a new code below.'
          }
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F3EB]">
      <div className="max-w-[1140px] mx-auto">
        {/* Top Breadcrumb / Back Link */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-label-md text-label-md uppercase font-bold text-[#171717] bg-[#FFF9F0] px-3.5 py-2 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>BACK TO STOREFRONT</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFF3DF] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-label-sm text-label-sm uppercase font-bold text-[#171717]">
            <span className="material-symbols-outlined text-[16px] text-[#1769FF]">
              encrypted
            </span>
            <span>HTTP-ONLY COOKIE &amp; JWT SESSION SECURITY</span>
          </div>
        </div>

        {/* Main Two-Column Neo-Brutalist Sign-In Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#FFF9F0] border-2 border-[#171717] shadow-[8px_8px_0px_#171717] hero-text-enter">
          {/* WELCOME PANEL: Welcome & Brand Benefits (Warm Cream #FFF3DF) - Desktop Left, Mobile Below Form */}
          <div className="order-2 lg:order-1 lg:col-span-6 bg-[#FFF3DF] lg:border-r-2 border-[#171717] p-5 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Decorative Neo-Brutalist Corner Accent */}
            <div
              aria-hidden="true"
              className="w-12 h-12 bg-[#FF7626] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center justify-center absolute top-6 right-6 rotate-6"
            >
              <span className="material-symbols-outlined text-white text-[24px]">bolt</span>
            </div>

            <div>
              {/* Playful Badge */}
              <div className="inline-flex items-center gap-2 bg-[#171717] text-[#FFF3DF] px-3 py-1 border-2 border-[#171717] shadow-[3px_3px_0px_#FF7626] font-label-sm text-label-sm uppercase font-bold mb-4">
                <span className="material-symbols-outlined text-[15px] text-[#FF7626]">
                  sports_motorsports
                </span>
                <span>TOYVOLT PLAYMAKER ACCESS</span>
              </div>

              {/* Large Heading */}
              <h1 className="font-headline-lg-mobile sm:text-headline-lg uppercase text-[#171717] leading-[1.03] tracking-tight pr-12">
                WELCOME BACK, PLAYMAKER
              </h1>

              {/* Short Welcome Message */}
              <p className="font-body-md text-body-md text-[#434654] mt-3 leading-relaxed">
                Sign in to your Toyvolt garage to manage reserved RC inventory, apply verified
                member coupons, and track your orders across India.
              </p>

              {/* Featured Product Card Using Actual Backend Product Data */}
              <div className="mt-6 bg-[#FFF9F0] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-4">
                <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b-2 border-[#171717]/15">
                  <span className="inline-flex items-center gap-1.5 font-label-sm text-[11px] uppercase font-bold text-[#1769FF]">
                    <span className="w-2 h-2 rounded-full bg-[#1769FF] inline-block" />
                    FEATURED FLAGSHIP • SKU: {featuredSku}
                  </span>
                  <span className="bg-[#dcfce7] text-[#14532d] border border-[#171717] px-2 py-0.5 font-label-sm text-[10px] uppercase font-bold">
                    {featuredStock} IN STOCK
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    to={`/product/${featuredSlug}`}
                    className="w-full sm:w-24 h-32 sm:h-24 bg-[#F0E8DA] border-2 border-[#171717] shrink-0 overflow-hidden block flex items-center justify-center p-1.5"
                  >
                    <ProductImageWithFallback
                      src={featuredImage}
                      alt={featuredName}
                      width={200}
                      height={200}
                      className="w-full h-full object-contain hover:scale-105 transition-transform"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${featuredSlug}`}
                      className="font-title text-[16px] text-[#171717] hover:text-[#1769FF] transition-colors line-clamp-2 leading-snug block"
                    >
                      {featuredName}
                    </Link>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="bg-[#FFF3DF] border border-[#171717] px-2 py-0.5 font-label-sm text-[10px] uppercase font-bold">
                        35 km/h
                      </span>
                      <span className="bg-[#FFF3DF] border border-[#171717] px-2 py-0.5 font-label-sm text-[10px] uppercase font-bold">
                        2.4 GHz 4WD
                      </span>
                      <span className="bg-[#FFF3DF] border border-[#171717] px-2 py-0.5 font-label-sm text-[10px] uppercase font-bold">
                        7.4V Li-Po
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-2 mt-2.5">
                      <div className="flex items-baseline gap-2">
                        <span className="font-title text-[20px] font-bold text-[#1769FF]">
                          ₹{featuredPrice.toLocaleString('en-IN')}
                        </span>
                        {featuredComparePrice && (
                          <span className="font-body-sm text-body-sm text-[#747686] line-through">
                            ₹{featuredComparePrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/product/${featuredSlug}`}
                        className="font-label-sm text-[11px] uppercase font-bold text-[#171717] underline hover:text-[#1769FF]"
                      >
                        VIEW SPECS →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact List of Genuine Store Benefits */}
              <div className="mt-6 space-y-3">
                <span className="font-label-sm text-label-sm uppercase font-bold text-[#171717] block">
                  VERIFIED ACCOUNT BENEFITS
                </span>
                {storeBenefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-3 flex items-start gap-3"
                  >
                    <div
                      className={`w-9 h-9 ${benefit.iconBg} border-2 border-[#171717] flex items-center justify-center shrink-0`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {benefit.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-label-md text-label-md uppercase font-bold text-[#171717] leading-tight">
                        {benefit.title}
                      </h2>
                      <p className="font-body-sm text-[13px] text-[#434654] mt-0.5 leading-snug">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Support Note */}
            <div className="mt-6 pt-4 border-t-2 border-[#171717]/15 flex items-center justify-between gap-2 font-label-sm text-[11px] uppercase text-[#434654]">
              <span>NEED HELP? {BRAND_CONFIG.contact.email}</span>
              <span className="font-bold text-[#171717]">POWER UP THE FUN ⚡</span>
            </div>
          </div>

          {/* FORM PANEL: Sign-In Form (Warm Off-White #FFF9F0) - Desktop Right, Mobile Above Welcome Panel */}
          <div className="order-1 lg:order-2 lg:col-span-6 bg-[#FFF9F0] border-b-2 lg:border-b-0 border-[#171717] p-5 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              {/* Form Header */}
              <div className="mb-6 pb-5 border-b-2 border-[#171717]">
                <div className="inline-flex items-center gap-1.5 bg-[#dce1ff] text-[#00164f] px-2.5 py-1 border border-[#171717] font-label-sm text-[11px] uppercase font-bold mb-2.5">
                  <span className="material-symbols-outlined text-[14px]">login</span>
                  <span>EXISTING CUSTOMER SIGN IN</span>
                </div>
                <h2 className="font-headline-md text-headline-md uppercase text-[#171717] leading-tight">
                  SIGN IN TO TOYVOLT
                </h2>
                <p className="font-body-md text-body-md text-[#434654] mt-1.5">
                  Enter your registered email address and password to access your account.
                </p>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div
                  role="alert"
                  className="mb-5 p-3.5 bg-[#ffdad6] text-[#93000a] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-start gap-2.5"
                >
                  <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                    error
                  </span>
                  <div className="font-body-sm text-body-sm font-bold">{errorMsg}</div>
                </div>
              )}

              {/* Info Alert */}
              {infoMsg && (
                <div
                  role="status"
                  className="mb-5 p-3.5 bg-[#ffdf90] text-[#241a00] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-start gap-2.5"
                >
                  <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                    info
                  </span>
                  <div className="font-body-sm text-body-sm font-bold">{infoMsg}</div>
                </div>
              )}

              {/* Sign-In Form */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Email Input */}
                <div>
                  <label
                    htmlFor="signin-email"
                    className="block font-label-sm text-label-sm uppercase font-bold text-[#171717] mb-1.5"
                  >
                    EMAIL ADDRESS *
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined text-[20px] text-[#434654] absolute left-3.5 pointer-events-none">
                      mail
                    </span>
                    <input
                      id="signin-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-[#FFFCF7] text-[#171717] border-2 border-[#171717] font-body-md text-body-md focus:bg-[#FFF9F0] focus:outline-none focus:shadow-[4px_4px_0px_#1769FF] transition-all"
                    />
                  </div>
                </div>

                {/* Password Input with Show/Hide Control */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label
                      htmlFor="signin-password"
                      className="font-label-sm text-label-sm uppercase font-bold text-[#171717]"
                    >
                      PASSWORD *
                    </label>
                    <Link
                      to="/forgot-password"
                      state={{ email: email.trim(), from: location.state?.from }}
                      className="font-label-sm text-label-sm uppercase font-bold text-[#1769FF] hover:underline"
                    >
                      FORGOT PASSWORD?
                    </Link>
                  </div>

                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined text-[20px] text-[#434654] absolute left-3.5 pointer-events-none">
                      lock
                    </span>
                    <input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="Enter your password"
                      className="w-full pl-11 pr-24 py-3 bg-[#FFFCF7] text-[#171717] border-2 border-[#171717] font-body-md text-body-md focus:bg-[#FFF9F0] focus:outline-none focus:shadow-[4px_4px_0px_#1769FF] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 px-2.5 py-1 bg-[#FFF3DF] border border-[#171717] font-label-sm text-[11px] uppercase font-bold text-[#171717] hover:bg-[#ffdf90] flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                      <span>{showPassword ? 'HIDE' : 'SHOW'}</span>
                    </button>
                  </div>
                </div>

                {/* Remember Device & Verify OTP Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="w-4 h-4 accent-[#1769FF] border-2 border-[#171717] cursor-pointer"
                    />
                    <span className="font-body-sm text-body-sm font-medium text-[#171717]">
                      Keep me signed in on this device
                    </span>
                  </label>

                  <Link
                    to="/verify-email"
                    state={{ email: email.trim(), from: location.state?.from }}
                    className="font-label-sm text-[11px] uppercase font-bold text-[#434654] hover:text-[#1769FF] underline"
                  >
                    Have a 6-digit OTP? Verify email
                  </Link>
                </div>

                {/* Prominent Blue Sign-In Button with Arrow */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-[#1769FF] text-white font-title text-title uppercase border-2 border-[#171717] shadow-[5px_5px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#171717] active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2.5"
                >
                  <span>{isSubmitting ? 'SIGNING IN TO TOYVOLT...' : 'SIGN IN TO TOYVOLT'}</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </form>
            </div>

            {/* Bottom Registration Callout for New Customers */}
            <div className="mt-8 pt-6 border-t-2 border-[#171717]">
              <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-label-sm text-label-sm uppercase font-bold text-[#FF7626] block">
                    NEW TO TOYVOLT?
                  </span>
                  <p className="font-body-sm text-body-sm text-[#171717] font-medium">
                    Create an account &amp; verify your email to unlock{' '}
                    <strong>WELCOME100</strong>.
                  </p>
                </div>
                <Link
                  to="/register"
                  state={{ from: location.state?.from, prefillEmail: email.trim() }}
                  className="px-4 py-2.5 bg-[#FFF9F0] text-[#171717] font-label-md text-label-md uppercase font-bold border-2 border-[#171717] shadow-[3px_3px_0px_#171717] hover:bg-[#ffdf90] transition-colors text-center shrink-0 inline-flex items-center justify-center gap-1.5"
                >
                  <span>CREATE ACCOUNT</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInPage;
