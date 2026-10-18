import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi, getErrorMessage } from '../lib/api';
import { BRAND_CONFIG } from '../config/brandConfig';

const evaluatePasswordStrength = (password) => {
  const hasMinLength = password.length >= 8;
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (hasMinLength) score += 1;
  if (hasMixedCase) score += 1;
  if (hasNumber) score += 1;
  if (hasSymbol) score += 1;

  let label = 'Enter min. 8 characters';
  let colorClass = 'bg-[#e5e2e1]';
  let textClass = 'text-[#434654]';

  if (password.length > 0 && !hasMinLength) {
    label = 'Too Short (Min 8 chars)';
    colorClass = 'bg-[#ba1a1a]';
    textClass = 'text-[#ba1a1a]';
  } else if (score === 1) {
    label = 'Weak — Add numbers or symbols';
    colorClass = 'bg-[#FF7626]';
    textClass = 'text-[#b52700]';
  } else if (score === 2) {
    label = 'Fair — Good start';
    colorClass = 'bg-[#eec13f]';
    textClass = 'text-[#755b00]';
  } else if (score === 3) {
    label = 'Good — Strong password';
    colorClass = 'bg-[#1769FF]';
    textClass = 'text-[#1769FF]';
  } else if (score === 4) {
    label = 'Strong — Playmaker Ready';
    colorClass = 'bg-[#15803d]';
    textClass = 'text-[#15803d]';
  }

  return {
    score,
    hasMinLength,
    hasMixedCase,
    hasNumber,
    hasSymbol,
    label,
    colorClass,
    textClass
  };
};

export const RegisterPage = () => {
  const { isAuthenticated, setPendingVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState(() => location.state?.prefillEmail || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false); // Unchecked by default

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const dest = location.state?.from || '/';
      navigate(dest === '/register' ? '/' : dest, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const strength = useMemo(() => evaluatePasswordStrength(password), [password]);
  const passwordsMatch =
    confirmPassword.length > 0 && password.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const benefitCards = [
    {
      icon: 'confirmation_number',
      iconBg: 'bg-[#1769FF] text-white',
      badge: 'WELCOME COUPON',
      title: 'Unlock Code WELCOME100 (₹100 OFF)',
      description:
        'Verify your email with a 6-digit OTP to receive your welcome coupon code for ₹100 OFF on orders ≥ ₹999.'
    },
    {
      icon: 'bolt',
      iconBg: 'bg-[#FF7626] text-white',
      badge: 'INVENTORY ENGINE',
      title: 'Atomic RC Stock Reservation',
      description:
        'Your Toyvolt account links directly to our concurrency-safe inventory system when placing orders.'
    },
    {
      icon: 'package_2',
      iconBg: 'bg-[#ffdf90] text-[#171717]',
      badge: 'ORDER PORTAL',
      title: 'Real-Time Order & Shipment Control',
      description:
        'View your complete order breakdown, check Shiprocket AWB status, or cancel unshipped orders anytime.'
    }
  ];

  const verifiedTrustIndicators = [
    { icon: 'mark_email_read', label: '6-Digit Email OTP Security' },
    {
      icon: 'local_shipping',
      label: `₹0 Shipping Over ₹${BRAND_CONFIG.shipping.freeShippingThresholdRupees}`
    },
    { icon: 'verified_user', label: 'Server-Validated Billing' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMsg('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Your password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please confirm your password.');
      return;
    }

    if (!acceptedTerms) {
      setErrorMsg(
        'Please accept the Toyvolt Terms of Use and Privacy Policy to create your account.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authApi.register({
        name: trimmedName,
        email: trimmedEmail,
        password
      });

      setPendingVerificationEmail(trimmedEmail);

      navigate('/verify-email', {
        state: {
          from: location.state?.from || '/',
          email: trimmedEmail,
          justRegistered: true,
          infoMessage:
            res?.message ||
            `A 6-digit verification code has been sent to ${trimmedEmail}.`
        }
      });
    } catch (err) {
      setErrorMsg(
        getErrorMessage(err, 'Registration failed. Please verify your details and try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F3EB]">
      <div className="max-w-[1160px] mx-auto">
        {/* Top Navigation Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-label-md text-label-md uppercase font-bold text-[#171717] bg-[#FFF9F0] px-3.5 py-2 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>BACK TO STOREFRONT</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFF3DF] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-label-sm text-label-sm uppercase font-bold text-[#171717]">
            <span className="material-symbols-outlined text-[16px] text-[#FF7626]">bolt</span>
            <span>STEP 1 OF 2 • ACCOUNT REGISTRATION</span>
          </div>
        </div>

        {/* Main Two-Column Neo-Brutalist Registration Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#FFF9F0] border-2 border-[#171717] shadow-[8px_8px_0px_#171717] hero-text-enter">
          {/* WELCOME PANEL: Intro Badge, Heading, Stacked Benefit Cards, Trust Indicators - Desktop Left, Mobile Below Form */}
          <div className="order-2 lg:order-1 lg:col-span-5 bg-[#FFF3DF] lg:border-r-2 border-[#171717] p-5 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
            <div>
              {/* Introductory Badge */}
              <div className="inline-flex items-center gap-2 bg-[#FF7626] text-white px-3 py-1 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] font-label-sm text-label-sm uppercase font-bold mb-4">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>JOIN THE TOYVOLT CLUB</span>
              </div>

              {/* Heading */}
              <h1 className="font-headline-lg-mobile sm:text-headline-lg uppercase text-[#171717] leading-[1.03] tracking-tight">
                START YOUR PLAY ADVENTURE
              </h1>

              {/* Short Registration Introduction */}
              <p className="font-body-md text-body-md text-[#434654] mt-3 leading-relaxed">
                Create your official Toyvolt account in seconds. We verify every Playmaker with a
                secure 6-digit email OTP to protect your orders and inventory reservations.
              </p>

              {/* Stacked Benefit Cards with Icons */}
              <div className="mt-6 space-y-4">
                {benefitCards.map((card) => (
                  <div
                    key={card.title}
                    className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-4 flex items-start gap-3.5"
                  >
                    <div
                      className={`w-11 h-11 ${card.iconBg} border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center shrink-0`}
                    >
                      <span className="material-symbols-outlined text-[22px]">
                        {card.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block font-label-sm text-[10px] uppercase font-bold text-[#1769FF] tracking-wider">
                        {card.badge}
                      </span>
                      <h2 className="font-title text-[16px] text-[#171717] leading-snug mt-0.5">
                        {card.title}
                      </h2>
                      <p className="font-body-sm text-[13px] text-[#434654] mt-1 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compact Trust Indicators Based on Verified Information */}
            <div className="mt-8 pt-5 border-t-2 border-[#171717]">
              <span className="font-label-sm text-[11px] uppercase font-bold text-[#171717] block mb-2.5">
                VERIFIED STORE STANDARDS
              </span>
              <div className="flex flex-wrap gap-2">
                {verifiedTrustIndicators.map((item) => (
                  <div
                    key={item.label}
                    className="inline-flex items-center gap-1.5 bg-[#FFF9F0] px-2.5 py-1.5 border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-label-sm text-[11px] uppercase font-bold text-[#171717]"
                  >
                    <span className="material-symbols-outlined text-[15px] text-[#1769FF]">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FORM PANEL: Create Account Form - Desktop Right, Mobile Above Welcome Panel */}
          <div className="order-1 lg:order-2 lg:col-span-7 bg-[#FFF9F0] border-b-2 lg:border-b-0 border-[#171717] p-5 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              {/* Form Header */}
              <div className="mb-6 pb-4 border-b-2 border-[#171717]">
                <div className="inline-flex items-center gap-1.5 bg-[#ffdf90] text-[#171717] px-2.5 py-1 border border-[#171717] font-label-sm text-[11px] uppercase font-bold mb-2">
                  <span className="material-symbols-outlined text-[14px]">person_add</span>
                  <span>NEW CUSTOMER ACCOUNT</span>
                </div>
                <h2 className="font-headline-md text-headline-md uppercase text-[#171717] leading-tight">
                  CREATE YOUR TOYVOLT ACCOUNT
                </h2>
                <p className="font-body-md text-body-md text-[#434654] mt-1">
                  Complete the fields below. We&apos;ll send a 6-digit verification code to your
                  email.
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

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Full Name & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="register-name"
                      className="block font-label-sm text-label-sm uppercase font-bold text-[#171717] mb-1.5"
                    >
                      FULL NAME *
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined text-[20px] text-[#434654] absolute left-3.5 pointer-events-none">
                        person
                      </span>
                      <input
                        id="register-name"
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        minLength={2}
                        maxLength={80}
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        placeholder="Aarav Sharma"
                        className="w-full pl-11 pr-4 py-3 bg-[#FFFCF7] text-[#171717] border-2 border-[#171717] font-body-md text-body-md focus:bg-[#FFF9F0] focus:outline-none focus:shadow-[4px_4px_0px_#1769FF] transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="register-email"
                      className="block font-label-sm text-label-sm uppercase font-bold text-[#171717] mb-1.5"
                    >
                      EMAIL ADDRESS *
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined text-[20px] text-[#434654] absolute left-3.5 pointer-events-none">
                        mail
                      </span>
                      <input
                        id="register-email"
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
                </div>

                {/* Password Field with Show/Hide Control */}
                <div>
                  <label
                    htmlFor="register-password"
                    className="block font-label-sm text-label-sm uppercase font-bold text-[#171717] mb-1.5"
                  >
                    CREATE PASSWORD (MIN. 8 CHARACTERS) *
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined text-[20px] text-[#434654] absolute left-3.5 pointer-events-none">
                      lock
                    </span>
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="Create a strong password"
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

                  {/* Password-Strength Indicator */}
                  <div className="mt-2.5 p-3 bg-[#FFF9F0] border-2 border-[#171717]">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-label-sm text-[11px] uppercase font-bold text-[#171717]">
                        PASSWORD STRENGTH
                      </span>
                      <span
                        className={`font-label-sm text-[11px] uppercase font-bold ${strength.textClass}`}
                      >
                        {strength.label}
                      </span>
                    </div>

                    {/* 4-Segment Strength Bar */}
                    <div className="grid grid-cols-4 gap-1.5 mb-2">
                      {[1, 2, 3, 4].map((segment) => (
                        <div
                          key={segment}
                          className={`h-2 border border-[#171717] transition-colors ${
                            password.length > 0 && strength.score >= segment
                              ? strength.colorClass
                              : 'bg-[#F0E8DA]'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Strength Criteria Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { met: strength.hasMinLength, text: '8+ Chars' },
                        { met: strength.hasMixedCase, text: 'Upper & Lower' },
                        { met: strength.hasNumber, text: 'Number' },
                        { met: strength.hasSymbol, text: 'Symbol' }
                      ].map((req) => (
                        <span
                          key={req.text}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 border border-[#171717] font-label-sm text-[10px] uppercase font-bold ${
                            req.met
                              ? 'bg-[#dcfce7] text-[#14532d]'
                              : 'bg-[#FFF9F0] text-[#747686]'
                          }`}
                        >
                          <span>{req.met ? '✓' : '•'}</span>
                          <span>{req.text}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Confirm-Password Field with Matching Validation */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label
                      htmlFor="register-confirm-password"
                      className="font-label-sm text-label-sm uppercase font-bold text-[#171717]"
                    >
                      CONFIRM PASSWORD *
                    </label>
                    {passwordsMatch && (
                      <span className="font-label-sm text-[11px] uppercase font-bold text-[#15803d]">
                        ✓ PASSWORDS MATCH
                      </span>
                    )}
                    {passwordsMismatch && (
                      <span className="font-label-sm text-[11px] uppercase font-bold text-[#ba1a1a]">
                        ✕ PASSWORDS DO NOT MATCH
                      </span>
                    )}
                  </div>

                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined text-[20px] text-[#434654] absolute left-3.5 pointer-events-none">
                      verified_user
                    </span>
                    <input
                      id="register-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="Re-enter your password"
                      className={`w-full pl-11 pr-24 py-3 bg-[#FFFCF7] text-[#171717] border-2 font-body-md text-body-md focus:bg-[#FFF9F0] focus:outline-none transition-all ${
                        passwordsMismatch
                          ? 'border-[#ba1a1a] focus:shadow-[4px_4px_0px_#ba1a1a]'
                          : passwordsMatch
                          ? 'border-[#15803d] focus:shadow-[4px_4px_0px_#15803d]'
                          : 'border-[#171717] focus:shadow-[4px_4px_0px_#1769FF]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={
                        showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                      }
                      className="absolute right-2.5 px-2.5 py-1 bg-[#FFF3DF] border border-[#171717] font-label-sm text-[11px] uppercase font-bold text-[#171717] hover:bg-[#ffdf90] flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                      <span>{showConfirmPassword ? 'HIDE' : 'SHOW'}</span>
                    </button>
                  </div>
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-2.5 pt-1">
                  {/* Required Terms & Privacy Consent */}
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={acceptedTerms}
                      onChange={(e) => {
                        setAcceptedTerms(e.target.checked);
                        if (errorMsg) setErrorMsg('');
                      }}
                      className="mt-1 w-4 h-4 accent-[#1769FF] border-2 border-[#171717] cursor-pointer shrink-0"
                    />
                    <span className="font-body-sm text-[13px] text-[#171717] leading-snug">
                      I agree to Toyvolt&apos;s{' '}
                      <strong className="underline">Terms of Use</strong>,{' '}
                      <strong className="underline">Shipping Policy</strong>, and{' '}
                      <strong className="underline">Privacy Policy</strong>. *
                    </span>
                  </label>

                  {/* Optional Marketing Consent (Unchecked by default) */}
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#1769FF] border-2 border-[#171717] cursor-pointer shrink-0"
                    />
                    <span className="font-body-sm text-[13px] text-[#434654] leading-snug">
                      Send me Toyvolt RC launch notifications and verified promo codes via email
                      (Optional).
                    </span>
                  </label>
                </div>

                {/* Prominent Blue Registration Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-[#1769FF] text-white font-title text-title uppercase border-2 border-[#171717] shadow-[5px_5px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#171717] active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2.5"
                >
                  <span>
                    {isSubmitting
                      ? 'CREATING ACCOUNT & SENDING OTP...'
                      : 'CREATE ACCOUNT & SEND OTP'}
                  </span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </form>
            </div>

            {/* Sign-In Link for Existing Users */}
            <div className="mt-6 pt-5 border-t-2 border-[#171717] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="font-body-sm text-body-sm text-[#434654] font-medium">
                Already have a Toyvolt account?
              </span>
              <Link
                to="/login"
                state={{ from: location.state?.from, email: email.trim() }}
                className="px-4 py-2 bg-[#FFF3DF] text-[#171717] font-label-md text-label-md uppercase font-bold border-2 border-[#171717] shadow-[3px_3px_0px_#171717] hover:bg-[#ffdf90] transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <span>SIGN IN TO ACCOUNT</span>
                <span className="material-symbols-outlined text-[16px]">login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
