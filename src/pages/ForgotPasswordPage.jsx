import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi, getErrorMessage } from '../lib/api';
import { maskEmailAddress } from './VerifyEmailPage';
import { BRAND_CONFIG } from '../config/brandConfig';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState('request'); // 'request' | 'reset'
  const [email, setEmail] = useState(() => location.state?.email || '');
  const [digits, setDigits] = useState(() => Array(OTP_LENGTH).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const inputRefs = useRef([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const otpCode = digits.join('');

  const handleDigitChange = (index, rawValue) => {
    if (isSubmitting) return;
    setErrorMsg('');
    const numeric = rawValue.replace(/\D/g, '');
    if (!numeric) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }
    if (numeric.length > 1) {
      const chars = numeric.slice(0, OTP_LENGTH).split('');
      const next = [...digits];
      chars.forEach((ch, idx) => {
        if (index + idx < OTP_LENGTH) next[index + idx] = ch;
      });
      setDigits(next);
      inputRefs.current[Math.min(index + chars.length, OTP_LENGTH - 1)]?.focus();
      return;
    }
    const next = [...digits];
    next[index] = numeric;
    setDigits(next);
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
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const numericDigits = (e.clipboardData?.getData('text') || '')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH);
    if (!numericDigits) return;
    setErrorMsg('');
    const next = Array(OTP_LENGTH).fill('');
    numericDigits.split('').forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    const targetIdx = Math.min(numericDigits.length, OTP_LENGTH) - 1;
    if (targetIdx >= 0) inputRefs.current[targetIdx]?.focus();
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      const res = await authApi.forgotPassword({ email: trimmedEmail });
      setEmail(trimmedEmail);
      setStep('reset');
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setInfoMsg(
        res?.message ||
          `If ${maskEmailAddress(trimmedEmail)} is registered, a 6-digit password reset code has been sent.`
      );
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 50);
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Failed to request password reset OTP.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendResetOtp = async () => {
    if (isSubmitting || cooldown > 0) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await authApi.resendOtp({
        email: email.trim().toLowerCase(),
        purpose: 'password_reset'
      });
      setDigits(Array(OTP_LENGTH).fill(''));
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setInfoMsg(res?.message || 'A fresh 6-digit password reset code has been sent.');
      inputRefs.current[0]?.focus();
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Could not resend OTP. Please wait 60 seconds.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (otpCode.length !== OTP_LENGTH) {
      setErrorMsg('Please enter all 6 digits of your password reset code.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg('Your new password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      const res = await authApi.resetPassword({
        email: email.trim().toLowerCase(),
        otp: otpCode,
        newPassword
      });

      navigate('/login', {
        state: {
          from: location.state?.from || '/',
          email: email.trim().toLowerCase(),
          infoMessage:
            res?.message ||
            'Your password has been reset! Please sign in with your new password.'
        }
      });
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Invalid or expired reset OTP.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full min-h-[calc(100vh-7.25rem)] py-10 sm:py-14 px-4 sm:px-6 flex items-center justify-center bg-[#F7F3EB]">
      <div className="w-full max-w-[540px] mx-auto hero-text-enter">
        <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[6px_6px_0px_#171717] p-6 sm:p-8 md:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-[#1769FF] text-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[28px]">lock_reset</span>
            </div>

            <span className="inline-flex items-center gap-1.5 bg-[#FFF3DF] text-[#171717] px-3 py-1 border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-label-sm text-[11px] uppercase font-bold mb-3">
              <span className="material-symbols-outlined text-[14px] text-[#FF7626]">key</span>
              <span>ACCOUNT PASSWORD RECOVERY</span>
            </span>

            <h1 className="font-headline-md sm:text-headline-lg uppercase text-[#171717] leading-tight">
              {step === 'request' ? 'RESET YOUR PASSWORD' : 'ENTER RESET OTP'}
            </h1>

            <p className="font-body-md text-body-md text-[#434654] mt-2 max-w-md">
              {step === 'request'
                ? 'Enter your registered email address and we will send a 6-digit password reset code.'
                : `Enter the 6-digit code sent to ${maskEmailAddress(email)} and choose a new password.`}
            </p>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="mt-5 p-3.5 bg-[#ffdad6] text-[#93000a] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-start gap-2.5"
            >
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">error</span>
              <span className="font-body-sm text-body-sm font-bold">{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div
              role="status"
              className="mt-5 p-3.5 bg-[#dcfce7] text-[#14532d] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-start gap-2.5"
            >
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                check_circle
              </span>
              <span className="font-body-sm text-body-sm font-bold">{infoMsg}</span>
            </div>
          )}

          {step === 'request' ? (
            <form onSubmit={handleRequestOtp} className="mt-6 space-y-5" noValidate>
              <div>
                <label
                  htmlFor="forgot-email"
                  className="block font-label-sm text-label-sm uppercase font-bold text-[#171717] mb-1.5"
                >
                  REGISTERED EMAIL ADDRESS *
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-[20px] text-[#434654] absolute left-3.5 pointer-events-none">
                    mail
                  </span>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-[#FFFCF7] text-[#171717] border-2 border-[#171717] font-body-md text-body-md focus:bg-[#FFF9F0] focus:outline-none focus:shadow-[4px_4px_0px_#1769FF]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#1769FF] text-white font-title text-title uppercase border-2 border-[#171717] shadow-[5px_5px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'SENDING RESET OTP...' : 'SEND 6-DIGIT RESET CODE'}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="mt-6 space-y-4" noValidate>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="reset-otp-0"
                    className="font-label-sm text-label-sm uppercase font-bold text-[#171717]"
                  >
                    6-DIGIT RESET OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('request')}
                    className="font-label-sm text-[11px] uppercase font-bold text-[#1769FF] underline"
                  >
                    CHANGE EMAIL
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2 sm:gap-3">
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      id={`reset-otp-${index}`}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      disabled={isSubmitting}
                      value={digit}
                      aria-label={`Reset OTP digit ${index + 1} of 6`}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      onFocus={(e) => e.target.select()}
                      className={`w-full h-12 sm:h-14 text-center font-headline-sm text-[22px] font-bold border-2 border-[#171717] focus:outline-none ${
                        digit ? 'bg-[#FFF3DF]' : 'bg-[#FFFCF7]'
                      } focus:bg-[#FFF9F0] focus:border-[#1769FF] focus:shadow-[4px_4px_0px_#1769FF]`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#FFF9F0] border-2 border-[#171717] px-3.5 py-2 font-body-sm text-[13px]">
                <span>
                  {cooldown > 0
                    ? `Resend in 00:${String(cooldown).padStart(2, '0')}`
                    : 'Need a fresh code?'}
                </span>
                <button
                  type="button"
                  disabled={cooldown > 0 || isSubmitting}
                  onClick={handleResendResetOtp}
                  className="font-label-sm text-label-sm uppercase font-bold text-[#1769FF] disabled:text-[#747686]"
                >
                  RESEND CODE
                </button>
              </div>

              <div>
                <label
                  htmlFor="reset-new-password"
                  className="block font-label-sm text-label-sm uppercase font-bold text-[#171717] mb-1.5"
                >
                  NEW PASSWORD (MIN. 8 CHARACTERS) *
                </label>
                <div className="relative flex items-center">
                  <input
                    id="reset-new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-3.5 pr-24 py-3 bg-[#FFFCF7] border-2 border-[#171717] font-body-md focus:bg-[#FFF9F0] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 px-2.5 py-1 bg-[#FFF3DF] border border-[#171717] font-label-sm text-[11px] uppercase font-bold"
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="reset-confirm-password"
                  className="block font-label-sm text-label-sm uppercase font-bold text-[#171717] mb-1.5"
                >
                  CONFIRM NEW PASSWORD *
                </label>
                <input
                  id="reset-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3.5 py-3 bg-[#FFFCF7] border-2 border-[#171717] font-body-md focus:bg-[#FFF9F0] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otpCode.length !== OTP_LENGTH}
                className="w-full py-4 px-6 bg-[#1769FF] text-white font-title text-title uppercase border-2 border-[#171717] shadow-[5px_5px_0px_#171717] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'UPDATING PASSWORD...' : 'CONFIRM NEW PASSWORD'}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>
          )}

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

          <div className="mt-6 pt-4 border-t-2 border-[#171717]/15 text-center">
            <p className="font-body-sm text-[12px] text-[#434654]">
              Support:{' '}
              <a
                href={`mailto:${BRAND_CONFIG.contact.email}`}
                className="text-[#1769FF] font-bold underline"
              >
                {BRAND_CONFIG.contact.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
