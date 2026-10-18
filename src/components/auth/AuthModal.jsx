import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi, getErrorMessage } from '../../lib/api';
import { useBodyScrollLock } from '../../lib/useBodyScrollLock';

export const AuthModal = () => {
  const {
    authModalOpen,
    authModalTab,
    setAuthModalTab,
    pendingVerificationEmail,
    setPendingVerificationEmail,
    closeAuthModal,
    handleLoginSuccess
  } = useAuth();

  useBodyScrollLock(authModalOpen);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  useEffect(() => {
    if (pendingVerificationEmail) {
      setEmail(pendingVerificationEmail);
    }
  }, [pendingVerificationEmail]);

  useEffect(() => {
    setErrorMsg('');
    setInfoMsg('');
  }, [authModalTab, authModalOpen]);

  if (!authModalOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      const res = await authApi.login({ email: email.trim(), password });
      if (res?.data?.user) {
        handleLoginSuccess(res.data.user);
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Invalid email or password.');
      setErrorMsg(msg);
      if (msg.toLowerCase().includes('verify your email')) {
        setPendingVerificationEmail(email.trim());
        setAuthModalTab('verify-otp');
        setInfoMsg('Please enter the 6-digit OTP sent to your email, or click Resend OTP.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      const res = await authApi.register({
        name: name.trim(),
        email: email.trim(),
        password
      });
      setPendingVerificationEmail(email.trim());
      setInfoMsg(
        res?.message || 'Registration successful! Enter the 6-digit OTP sent to your email.'
      );
      setAuthModalTab('verify-otp');
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Registration failed. Please check your details.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      const targetEmail = (pendingVerificationEmail || email).trim();
      const res = await authApi.verifyEmail({
        email: targetEmail,
        otp: otp.trim()
      });
      if (res?.data?.user) {
        handleLoginSuccess(res.data.user);
      }
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Invalid or expired 6-digit OTP.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    const targetEmail = (pendingVerificationEmail || email).trim();
    if (!targetEmail) {
      setErrorMsg('Please enter your email address first.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await authApi.resendOtp({
        email: targetEmail,
        purpose: authModalTab === 'reset-password' ? 'password_reset' : 'register'
      });
      setInfoMsg(res?.message || 'A fresh 6-digit verification code has been sent.');
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Could not resend OTP. Please wait 60 seconds.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      const res = await authApi.forgotPassword({ email: email.trim() });
      setPendingVerificationEmail(email.trim());
      setInfoMsg(res?.message || 'If that email is registered, a 6-digit reset OTP was sent.');
      setAuthModalTab('reset-password');
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Failed to request password reset.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      const targetEmail = (pendingVerificationEmail || email).trim();
      const res = await authApi.resetPassword({
        email: targetEmail,
        otp: otp.trim(),
        newPassword
      });
      setInfoMsg(res?.message || 'Password reset! You can now sign in.');
      setPassword('');
      setOtp('');
      setAuthModalTab('login');
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Failed to reset password.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Toyvolt Account Authentication"
      className="fixed inset-0 z-50 bg-on-surface/60 overflow-y-auto overscroll-contain flex items-center justify-center p-4"
      onClick={closeAuthModal}
    >
      <div
        className="w-full max-w-md bg-[#FFF9F0] border-2 border-on-surface shadow-[6px_6px_0px_#191919] my-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-on-surface">
          <div>
            <span className="font-label-sm text-label-sm uppercase text-secondary font-bold block">
              TOYVOLT ACCOUNT ACCESS
            </span>
            <h2 className="font-headline-sm text-headline-sm uppercase text-on-surface">
              {authModalTab === 'login' && 'SIGN IN TO TOYVOLT'}
              {authModalTab === 'register' && 'CREATE YOUR ACCOUNT'}
              {authModalTab === 'verify-otp' && 'VERIFY EMAIL OTP'}
              {authModalTab === 'forgot-password' && 'FORGOT PASSWORD'}
              {authModalTab === 'reset-password' && 'SET NEW PASSWORD'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            aria-label="Close authentication modal"
            className="p-1.5 bg-surface-container-lowest border-2 border-on-surface shadow-[2px_2px_0px_#191919]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Mode Switch Tabs */}
        {(authModalTab === 'login' || authModalTab === 'register') && (
          <div className="grid grid-cols-2 gap-2 mb-5">
            <button
              type="button"
              onClick={() => setAuthModalTab('login')}
              className={`py-2 font-label-md text-label-md uppercase font-bold border-2 border-on-surface transition-all ${
                authModalTab === 'login'
                  ? 'bg-primary-container text-on-primary shadow-[2px_2px_0px_#191919]'
                  : 'bg-surface-container-lowest text-on-surface'
              }`}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => setAuthModalTab('register')}
              className={`py-2 font-label-md text-label-md uppercase font-bold border-2 border-on-surface transition-all ${
                authModalTab === 'register'
                  ? 'bg-primary-container text-on-primary shadow-[2px_2px_0px_#191919]'
                  : 'bg-surface-container-lowest text-on-surface'
              }`}
            >
              REGISTER
            </button>
          </div>
        )}

        {errorMsg && (
          <div
            role="alert"
            className="mb-4 p-3 bg-error-container text-on-error-container border-2 border-on-surface font-body-sm text-body-sm font-medium"
          >
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div
            role="status"
            className="mb-4 p-3 bg-tertiary-fixed text-on-tertiary-fixed border-2 border-on-surface font-body-sm text-body-sm font-medium"
          >
            {infoMsg}
          </div>
        )}

        {/* 1. Login Form */}
        {authModalTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="auth-login-email"
                className="block font-label-sm text-label-sm uppercase font-bold text-on-surface mb-1"
              >
                Email Address
              </label>
              <input
                id="auth-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-body-md focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="auth-login-password"
                  className="font-label-sm text-label-sm uppercase font-bold text-on-surface"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setAuthModalTab('forgot-password')}
                  className="font-label-sm text-label-sm uppercase text-primary hover:underline font-bold"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                id="auth-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-body-md focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary-container text-on-primary font-title text-title uppercase border-2 border-on-surface shadow-[4px_4px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setAuthModalTab('verify-otp')}
                className="font-label-sm text-label-sm uppercase text-on-surface-variant hover:text-on-surface underline font-bold"
              >
                Already have a 6-digit verification OTP? Verify here
              </button>
            </div>
          </form>
        )}

        {/* 2. Register Form */}
        {authModalTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label
                htmlFor="auth-reg-name"
                className="block font-label-sm text-label-sm uppercase font-bold text-on-surface mb-1"
              >
                Full Name
              </label>
              <input
                id="auth-reg-name"
                type="text"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-body-md focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="auth-reg-email"
                className="block font-label-sm text-label-sm uppercase font-bold text-on-surface mb-1"
              >
                Email Address
              </label>
              <input
                id="auth-reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-body-md focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="auth-reg-password"
                className="block font-label-sm text-label-sm uppercase font-bold text-on-surface mb-1"
              >
                Password (Min 8 characters)
              </label>
              <input
                id="auth-reg-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-body-md focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-secondary-container text-on-secondary font-title text-title uppercase border-2 border-on-surface shadow-[4px_4px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'SENDING OTP...' : 'REGISTER & SEND 6-DIGIT OTP'}
            </button>
          </form>
        )}

        {/* 3. Verify Email OTP Form */}
        {authModalTab === 'verify-otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label
                htmlFor="auth-otp-email"
                className="block font-label-sm text-label-sm uppercase font-bold text-on-surface mb-1"
              >
                Email Address
              </label>
              <input
                id="auth-otp-email"
                type="email"
                required
                value={pendingVerificationEmail || email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setPendingVerificationEmail(e.target.value);
                }}
                className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-body-md focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="auth-otp-code"
                className="block font-label-sm text-label-sm uppercase font-bold text-on-surface mb-1"
              >
                6-Digit Verification OTP
              </label>
              <input
                id="auth-otp-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
                className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-headline-sm tracking-widest text-center focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otp.length !== 6}
              className="w-full py-3 bg-primary-container text-on-primary font-title text-title uppercase border-2 border-on-surface shadow-[4px_4px_0px_#191919] disabled:opacity-50"
            >
              {isSubmitting ? 'VERIFYING...' : 'VERIFY EMAIL & SIGN IN'}
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isSubmitting}
                className="font-label-sm text-label-sm uppercase text-primary underline font-bold"
              >
                Resend OTP
              </button>
              <button
                type="button"
                onClick={() => setAuthModalTab('login')}
                className="font-label-sm text-label-sm uppercase text-on-surface-variant hover:text-on-surface font-bold"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* 4. Forgot Password Form */}
        {authModalTab === 'forgot-password' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label
                htmlFor="auth-forgot-email"
                className="block font-label-sm text-label-sm uppercase font-bold text-on-surface mb-1"
              >
                Registered Email Address
              </label>
              <input
                id="auth-forgot-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-body-md focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary-container text-on-primary font-title text-title uppercase border-2 border-on-surface shadow-[4px_4px_0px_#191919] disabled:opacity-50"
            >
              {isSubmitting ? 'SENDING RESET OTP...' : 'SEND RESET OTP'}
            </button>

            <button
              type="button"
              onClick={() => setAuthModalTab('login')}
              className="w-full font-label-sm text-label-sm uppercase text-on-surface-variant hover:text-on-surface font-bold pt-1"
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* 5. Reset Password Form */}
        {authModalTab === 'reset-password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label
                htmlFor="auth-reset-otp"
                className="block font-label-sm text-label-sm uppercase font-bold text-on-surface mb-1"
              >
                6-Digit Reset OTP
              </label>
              <input
                id="auth-reset-otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit OTP"
                className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-headline-sm text-center tracking-widest focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="auth-reset-newpass"
                className="block font-label-sm text-label-sm uppercase font-bold text-on-surface mb-1"
              >
                New Password (Min 8 characters)
              </label>
              <input
                id="auth-reset-newpass"
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-3.5 py-2.5 bg-[#FFFCF7] border-2 border-on-surface font-body-md focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otp.length !== 6}
              className="w-full py-3 bg-primary-container text-on-primary font-title text-title uppercase border-2 border-on-surface shadow-[4px_4px_0px_#191919] disabled:opacity-50"
            >
              {isSubmitting ? 'UPDATING PASSWORD...' : 'CONFIRM NEW PASSWORD'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
