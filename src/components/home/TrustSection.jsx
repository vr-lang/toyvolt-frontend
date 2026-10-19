import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { ScrollReveal } from '../common/ScrollReveal';

export const TrustSection = () => {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const [clubEmail, setClubEmail] = useState('');

  const trustPillars = [
    {
      icon: 'local_shipping',
      iconBg: 'bg-primary-fixed text-on-primary-fixed',
      title: '100% Free Shipping Across India',
      description: 'Enjoy ₹0 delivery charges on all Toyvolt orders nationwide.'
    },
    {
      icon: 'inventory',
      iconBg: 'bg-tertiary-fixed text-on-tertiary-fixed',
      title: 'Atomic Stock Reservation',
      description:
        'Live inventory checks reserve your Toyvolt RC unit atomically when your order is placed.'
    },
    {
      icon: 'verified_user',
      iconBg: 'bg-secondary-fixed text-on-secondary-fixed',
      title: 'Verified Email OTP Security',
      description:
        '6-digit email OTP verification via Resend protects your Toyvolt account and orders.'
    },
    {
      icon: 'payments',
      iconBg: 'bg-surface-container-high text-on-surface',
      title: 'Server-Validated Pricing',
      description:
        'All prices, discounts, and integer-paise totals are verified directly by the Toyvolt backend.'
    }
  ];

  const handleClubJoin = (e) => {
    e.preventDefault();
    const trimmed = clubEmail.trim();
    if (!trimmed) return;
    // Open the real registration modal pre-filled with the customer's email
    openAuthModal('register', trimmed);
  };

  return (
    <>
      {/* Trust & Architecture Strip */}
      <section className="w-full bg-[#F0E8DA] border-y-2 border-on-surface py-10 my-8">
        <div className="max-w-[1360px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPillars.map((pillar, idx) => (
              <ScrollReveal key={pillar.title} delay={idx * 80}>
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 ${pillar.iconBg} border-2 border-on-surface shadow-[3px_3px_0px_#191919] shrink-0`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {pillar.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-title text-title text-on-surface leading-tight">
                      {pillar.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Toyvolt Club / Real Account Registration Callout (Matches Stitch VIP Membership Card) */}
      <section className="w-full max-w-[1360px] mx-auto px-4 lg:px-8 py-8 md:py-14">
        <ScrollReveal className="bg-primary-container text-on-primary border-2 border-on-surface shadow-[8px_8px_0px_#191919] p-6 sm:p-8 lg:p-14 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary-fixed-dim/20 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7">
              <span className="inline-block bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-3 py-1 border border-on-surface uppercase font-bold shadow-[2px_2px_0px_#191919] mb-3">
                VERIFIED ACCOUNT BENEFIT
              </span>
              <h2 className="font-headline-lg-mobile md:text-headline-lg uppercase text-on-primary leading-tight">
                JOIN THE TOYVOLT CLUB &amp; GET ₹100 OFF (WELCOME100)
              </h2>
              <p className="font-body-lg text-body-lg text-on-primary-container mt-2 max-w-xl">
                Register and verify your email with a 6-digit OTP to unlock your{' '}
                <strong className="text-tertiary-fixed font-bold">WELCOME100</strong> welcome
                coupon (Flat ₹100 OFF on orders ≥ ₹999) and track your Toyvolt orders online.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3">
              {isAuthenticated ? (
                <div className="bg-surface-container-lowest text-on-surface border-2 border-on-surface shadow-[4px_4px_0px_#191919] p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      verified
                    </span>
                    <span className="font-title text-title uppercase">
                      YOU&apos;RE IN THE CLUB, {user?.name?.split(' ')[0]}!
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Use code{' '}
                    <span className="font-bold text-secondary select-all">WELCOME100</span> in
                    your cart or checkout for ₹100 OFF your first order.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleClubJoin}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <label htmlFor="club-email-input" className="sr-only">
                    Enter your email address to register
                  </label>
                  <input
                    id="club-email-input"
                    type="email"
                    required
                    value={clubEmail}
                    onChange={(e) => setClubEmail(e.target.value)}
                    placeholder="Enter your email to register..."
                    className="flex-1 bg-[#FFFCF7] text-on-surface px-4 py-3.5 border-2 border-on-surface font-body-md focus:outline-none focus:bg-[#FFF9F0] shadow-[4px_4px_0px_#191919]"
                  />
                  <button
                    type="submit"
                    className="bg-tertiary-fixed text-on-tertiary-fixed font-title text-title uppercase px-6 py-3.5 border-2 border-on-surface shadow-[4px_4px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 transition-all shrink-0"
                  >
                    REGISTER NOW
                  </button>
                </form>
              )}

              <div className="flex items-center gap-2 text-on-primary-container text-body-sm font-body-sm">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>
                  Powered by real Email OTP verification (`POST /api/v1/auth/register`).
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
};

export default TrustSection;
