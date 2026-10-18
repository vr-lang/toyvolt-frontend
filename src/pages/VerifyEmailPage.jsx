import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi, getErrorMessage } from '../lib/api';
import { BRAND_CONFIG } from '../config/brandConfig';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Masks an email address for display while keeping it recognizable
 * e.g. "aarav.sharma@example.com" -> "aa***a@example.com"
 */
export const maskEmailAddress = (rawEmail) => {
  if (!rawEmail || typeof rawEmail !== 'string' || !rawEmail.includes('@')) {
    return '';
  }
  const [localPart, domainPart] = rawEmail.trim().split('@');
  if (!localPart || !domainPart) return rawEmail;

  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domainPart}`;
  }
  const firstTwo = localPart.slice(0, 2);
  const lastOne = localPart.slice(-1);
  return `${firstTwo}***${lastOne}@${domainPart}`;
};

export const VerifyEmailPage = () => {
  const {
    isAuthenticated,
    pendingVerificationEmail,
    setPendingVerificationEmail,
    handleLoginSuccess
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail =
    location.state?.email || pendingVerificationEmail || '';

  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(!initialEmail);
  const [digits, setDigits] = useState(() => Array(OTP_LENGTH).fill(''));
  const [cooldown, setCooldown] = useState(() =>
    location.state?.justRegistered ? RESEND_COOLDOWN_SECONDS : 0
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState(location.state?.infoMessage || '');

  const inputRefs = useRef([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const dest = location.state?.from || '/';
      navigate(dest === '/verify-email' ? '/' : dest, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  // Focus first OTP box on mount if email is already present
  useEffect(() => {
    if (!isEditingEmail && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isEditingEmail]);

  // 60-second resend countdown timer matching backend OTP_COOLDOWN_SECONDS = 60
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const otpCode = digits.join('');
  const isOtpComplete = otpCode.length === OTP_LENGTH && /^\d{6}$/.test(otpCode);

  const handleDigitChange = (index, rawValue) => {
    if (isSubmitting) return;
    setErrorMsg('');

    // Reject non-numeric characters
    const numeric = rawValue.replace(/\D/g, '');

    if (!numeric) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }

    // If multiple digits were entered into a single input (e.g. mobile autocomplete)
    if (numeric.length > 1) {
      const chars = numeric.slice(0, OTP_LENGTH).split('');
      const next = [...digits];
      chars.forEach((ch, idx) => {
        if (index + idx < OTP_LENGTH) {
          next[index + idx] = ch;
        }
      });
      setDigits(next);
      const focusIdx = Math.min(index + chars.length, OTP_LENGTH - 1);
      inputRefs.current[focusIdx]?.focus();
      return;
    }

    const next = [...digits];
    next[index] = numeric;
    setDigits(next);

    // Auto-focus next input
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (isSubmitting) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[index]) {
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        next[index - 1] = '';
        setDigits(next);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    } else if (
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      !/\d/.test(e.key)
    ) {
      // Block non-numeric character key presses immediately
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const pastedText = e.clipboardData?.getData('text') || '';
    const numericDigits = pastedText.replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!numericDigits) return;

    setErrorMsg('');
    const next = Array(OTP_LENGTH).fill('');
    numericDigits.split('').forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);

    const targetIndex = Math.min(numericDigits.length, OTP_LENGTH) - 1;
    if (targetIndex >= 0) {
      inputRefs.current[targetIndex]?.focus();
    }
  };

  const handleSaveEmailEdit = (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setEmail(trimmed);
    setPendingVerificationEmail(trimmed);
    setIsEditingEmail(false);
    setErrorMsg('');
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const targetEmail = email.trim().toLowerCase();
    if (!targetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
      setIsEditingEmail(true);
      setErrorMsg('Please provide your registered email address first.');
      return;
    }

    if (!isOtpComplete) {
      setErrorMsg('Please enter all 6 numeric digits of your verification code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      const res = await authApi.verifyEmail({
        email: targetEmail,
        otp: otpCode
      });

      if (res?.data?.user) {
        handleLoginSuccess(res.data.user, location.state?.from);
      } else {
        setErrorMsg('Verification response did not include user data. Please sign in.');
      }
    } catch (err) {
      setErrorMsg(
        getErrorMessage(
          err,
          'Invalid or expired verification code. Please check the 6-digit OTP and try again.'
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (isResending || isSubmitting || cooldown > 0) return;

    const targetEmail = email.trim().toLowerCase();
    if (!targetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
      setIsEditingEmail(true);
      setErrorMsg('Please enter a valid email address to resend the OTP.');
      return;
    }

    setIsResending(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      const res = await authApi.resendOtp({
        email: targetEmail,
        purpose: 'register'
      });
      setPendingVerificationEmail(targetEmail);
      setDigits(Array(OTP_LENGTH).fill(''));
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setInfoMsg(
        res?.message || `A fresh 6-digit verification code was sent to ${maskEmailAddress(targetEmail)}.`
      );
      inputRefs.current[0]?.focus();
    } catch (err) {
      setErrorMsg(
        getErrorMessage(err, 'Could not resend OTP. Please wait 60 seconds and try again.')
      );
    } finally {
      setIsResending(false);
    }
  };

  const formattedCooldown = `00:${String(cooldown).padStart(2, '0')}`;

  return (
    <section className="w-full min-h-[calc(100vh-7.25rem)] py-10 sm:py-14 px-4 sm:px-6 flex items-center justify-center bg-[#F7F3EB]">
      <div className="w-full max-w-[540px] mx-auto hero-text-enter">
        {/* Compact Centered Verification Card */}
        <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[6px_6px_0px_#171717] p-6 sm:p-8 md:p-10">
          {/* Top Center Security Icon in a Blue Square & Step Badge */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-[#1769FF] text-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[28px]">verified_user</span>
            </div>

            <span className="inline-flex items-center gap-1.5 bg-[#FFF3DF] text-[#171717] px-3 py-1 border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-label-sm text-[11px] uppercase font-bold mb-3">
              <span className="material-symbols-outlined text-[14px] text-[#FF7626]">
                mark_email_read
              </span>
              <span>STEP 2 OF 2 • SECURITY VERIFICATION</span>
            </span>

            {/* Heading */}
            <h1 className="font-headline-md sm:text-headline-lg uppercase text-[#171717] leading-tight">
              VERIFY YOUR EMAIL
            </h1>

            {/* Short Explanation */}
            <p className="font-body-md text-body-md text-[#434654] mt-2 max-w-md">
              We&apos;ve sent a 6-digit verification code to your email. Enter the code below within{' '}
              <strong className="text-[#171717]">5 minutes</strong> to activate your Toyvolt
              account and unlock code <strong className="text-[#1769FF]">WELCOME100</strong>.
            </p>
          </div>

          {/* Masked Email Address & Change-Email Action */}
          <div className="mt-5">
            {!isEditingEmail && email ? (
              <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[18px] text-[#1769FF] shrink-0">
                    mail
                  </span>
                  <div className="truncate">
                    <span className="font-label-sm text-[10px] uppercase text-[#434654] block leading-none">
                      CODE SENT TO
                    </span>
                    <span
                      title={email}
                      className="font-label-md text-label-md font-bold text-[#171717]"
                    >
                      {maskEmailAddress(email)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingEmail(true)}
                  className="px-2.5 py-1 bg-[#FFF9F0] border border-[#171717] font-label-sm text-[11px] uppercase font-bold text-[#1769FF] hover:bg-[#dce1ff] transition-colors shrink-0"
                >
                  CHANGE EMAIL
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSaveEmailEdit}
                className="bg-[#FFF9F0] border-2 border-[#171717] p-3.5 space-y-2.5"
              >
                <label
                  htmlFor="verify-email-input"
                  className="block font-label-sm text-[11px] uppercase font-bold text-[#171717]"
                >
                  REGISTERED EMAIL ADDRESS
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="verify-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 px-3 py-2 bg-[#FFFCF7] border-2 border-[#171717] font-body-sm text-body-sm focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#171717] text-white font-label-sm text-label-sm uppercase font-bold border-2 border-[#171717] hover:bg-[#1769FF] transition-colors"
                  >
                    SAVE EMAIL
                  </button>
                </div>
                <p className="font-body-sm text-[12px] text-[#434654]">
                  Need to register a different email?{' '}
                  <Link
                    to="/register"
                    state={{ prefillEmail: email }}
                    className="text-[#1769FF] font-bold underline"
                  >
                    Update on Registration page
                  </Link>
                </p>
              </form>
            )}
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div
              role="alert"
              className="mt-4 p-3.5 bg-[#ffdad6] text-[#93000a] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-start gap-2.5"
            >
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">error</span>
              <span className="font-body-sm text-body-sm font-bold">{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div
              role="status"
              className="mt-4 p-3.5 bg-[#dcfce7] text-[#14532d] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-start gap-2.5"
            >
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                check_circle
              </span>
              <span className="font-body-sm text-body-sm font-bold">{infoMsg}</span>
            </div>
          )}

          {/* Six Separate Numeric OTP Inputs Form */}
          <form onSubmit={handleVerifySubmit} className="mt-6 space-y-5" noValidate>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="otp-digit-0"
                  className="font-label-sm text-label-sm uppercase font-bold text-[#171717]"
                >
                  ENTER 6-DIGIT SECURITY CODE
                </label>
                <span className="font-label-sm text-[11px] uppercase font-bold text-[#434654]">
                  {otpCode.length}/6 DIGITS
                </span>
              </div>

              <div
                role="group"
                aria-label="6-digit verification code"
                className="grid grid-cols-6 gap-2 sm:gap-3"
              >
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-digit-${index}`}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    maxLength={1}
                    disabled={isSubmitting}
                    value={digit}
                    aria-label={`Digit ${index + 1} of 6`}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onFocus={(e) => e.target.select()}
                    className={`w-full h-12 sm:h-14 text-center font-headline-sm text-[22px] sm:text-[24px] font-bold border-2 border-[#171717] transition-all focus:outline-none ${
                      digit
                        ? 'bg-[#FFF3DF] text-[#171717] shadow-[3px_3px_0px_#171717]'
                        : 'bg-[#FFFCF7] text-[#171717] shadow-[2px_2px_0px_#171717]'
                    } focus:bg-[#FFF9F0] focus:border-[#1769FF] focus:shadow-[4px_4px_0px_#1769FF] disabled:opacity-50`}
                  />
                ))}
              </div>
            </div>

            {/* Resend Countdown & Resend Action */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FFF9F0] border-2 border-[#171717] px-3.5 py-2.5">
              <div className="flex items-center gap-1.5 font-body-sm text-[13px] text-[#434654]">
                <span className="material-symbols-outlined text-[16px] text-[#171717]">
                  schedule
                </span>
                {cooldown > 0 ? (
                  <span>
                    Resend available in{' '}
                    <strong className="font-mono text-[#171717]">{formattedCooldown}</strong>
                  </span>
                ) : (
                  <span>Didn&apos;t receive the 6-digit code?</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={cooldown > 0 || isResending || isSubmitting}
                className="font-label-sm text-label-sm uppercase font-bold text-[#1769FF] hover:underline disabled:text-[#747686] disabled:no-underline disabled:cursor-not-allowed"
              >
                {isResending ? 'SENDING CODE...' : 'RESEND CODE'}
              </button>
            </div>

            {/* Blue "VERIFY EMAIL & CONTINUE" Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isOtpComplete}
              className="w-full py-4 px-6 bg-[#1769FF] text-white font-title text-title uppercase border-2 border-[#171717] shadow-[5px_5px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#171717] active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>
                {isSubmitting ? 'VERIFYING CODE...' : 'VERIFY EMAIL & CONTINUE'}
              </span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </form>

          {/* Secondary "BACK TO SIGN IN" Action */}
          <div className="mt-4">
            <Link
              to="/login"
              state={{ from: location.state?.from, email: email.trim() }}
              className="w-full py-3 px-4 bg-[#FFF3DF] text-[#171717] font-label-lg text-label-lg uppercase font-bold border-2 border-[#171717] shadow-[3px_3px_0px_#171717] hover:bg-[#ffdf90] transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>BACK TO SIGN IN</span>
            </Link>
          </div>

          {/* Support Details & Subtle Security Footer */}
          <div className="mt-6 pt-4 border-t-2 border-[#171717]/15 text-center space-y-1.5">
            <p className="font-body-sm text-[12px] text-[#434654]">
              Trouble receiving your OTP? Contact Toyvolt Support at{' '}
              <a
                href={`mailto:${BRAND_CONFIG.contact.email}`}
                className="text-[#1769FF] font-bold underline"
              >
                {BRAND_CONFIG.contact.email}
              </a>
            </p>
            <div className="inline-flex items-center justify-center gap-1.5 font-label-sm text-[10px] uppercase font-bold text-[#747686]">
              <span className="material-symbols-outlined text-[13px] text-[#15803d]">lock</span>
              <span>
                PROTECTED BY TOYVOLT EMAIL OTP • EXPIRES IN 5 MINUTES • MAX 5 ATTEMPTS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmailPage;
