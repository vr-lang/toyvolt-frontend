import React from 'react';
import { Link } from 'react-router-dom';
import { ProductImageWithFallback } from '../components/product/ProductImageWithFallback';

export const AboutPage = ({ product }) => {
  const productSlug = product?.slug || 'toyvolt-apex-1-rc-drift-car';

  return (
    <div className="w-full flex flex-col bg-surface text-on-surface">
      {/* =========================================================================
          SECTION A: EDITORIAL HERO SECTION
          ========================================================================= */}
      <section className="w-full bg-[#FFF9F0] border-b-2 border-on-surface py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Mission & Superpowers */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6">
              {/* Yellow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-tertiary-fixed text-on-tertiary-fixed border-2 border-on-surface rounded-lg shadow-[3px_3px_0px_#171717]">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span className="font-label-md text-label-md uppercase font-bold tracking-wider">
                  OUR STORY
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-[32px] sm:text-[44px] lg:text-[54px] leading-[1.08] uppercase tracking-tight text-on-surface">
                WE DON'T JUST SELL TOYS. WE SPARK{' '}
                <span className="inline-block bg-[#FF7626] text-white px-3 py-0.5 mx-1 border-2 border-on-surface shadow-[4px_4px_0px_#171717] transform -rotate-1">
                  CHILDHOOD
                </span>{' '}
                SUPERPOWERS.
              </h1>

              {/* Editorial Intro */}
              <p className="font-body-lg text-body-lg text-on-surface font-medium leading-relaxed max-w-2xl">
                Toyvolt was created with a clear, uncompromising belief: playtime should be intensely
                exhilarating, deeply engaging, and accessible to everyone who loves hands-on excitement.
              </p>

              {/* Supporting Copy */}
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed max-w-2xl">
                We concentrate on high-impact, kinetic toys—starting with precision remote-control drift
                cars engineered for real speed and responsive steering, and expanding as our toy
                collection grows into new realms of active, imaginative play.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <a
                  href="#manifesto"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-surface-container-lowest text-on-surface border-2 border-on-surface rounded-lg font-label-lg text-label-lg uppercase font-bold shadow-[4px_4px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#171717] transition-all inline-flex items-center gap-2"
                >
                  <span>OUR MISSION</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                </a>

                <Link
                  to={`/product/${productSlug}`}
                  className="px-6 py-3.5 bg-primary text-white border-2 border-on-surface rounded-lg font-label-lg text-label-lg uppercase font-bold shadow-[4px_4px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#171717] transition-all inline-flex items-center gap-2"
                >
                  <span>EXPLORE COLLECTION</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Toy-Themed Composition */}
            <div className="lg:col-span-5">
              <div className="relative bg-[#FFF3DF] border-2 border-on-surface rounded-xl shadow-[8px_8px_0px_#171717] p-5 sm:p-6 overflow-hidden">
                {/* Header Strip */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b-2 border-on-surface">
                  <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block border border-on-surface" />
                    TOYVOLT SPEED LAB
                  </span>
                  <span className="font-label-sm text-label-sm font-bold bg-[#FF7626] text-white px-2 py-0.5 border border-on-surface">
                    1:16 SCALE 4WD
                  </span>
                </div>

                {/* Primary Visual */}
                <div className="relative aspect-[4/3] bg-surface-container-low border-2 border-on-surface rounded-lg overflow-hidden mb-4 flex items-center justify-center p-3 sm:p-4">
                  <ProductImageWithFallback
                    src={product?.primaryImage || product?.images?.[0]?.url}
                    alt={product?.name || 'Toyvolt Flagship RC Car'}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-3 left-3 bg-[#FFF3DF] text-on-surface border border-on-surface px-2.5 py-1 font-label-sm text-[11px] font-bold shadow-[2px_2px_0px_#171717]">
                    ENGINEERED FOR FUN • 100% PURE PLAY
                  </div>
                </div>

                {/* Supporting Card */}
                <div className="p-3.5 bg-surface-container-lowest border-2 border-on-surface rounded-lg shadow-[3px_3px_0px_#171717]">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[24px] text-primary shrink-0 mt-0.5">
                      electric_bolt
                    </span>
                    <div>
                      <h4 className="font-title text-[15px] uppercase font-bold text-on-surface">
                        HIGH-TORQUE THRILLS
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        Tuned for responsive handling, real kinetic acceleration, and lightning-fast drifts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: OUR MISSION — THE TOYVOLT MANIFESTO
          ========================================================================= */}
      <section
        id="manifesto"
        className="w-full bg-[#FFF3DF] border-b-2 border-on-surface py-14 sm:py-20"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-lowest border-2 border-on-surface rounded-lg shadow-[2px_2px_0px_#171717] mb-3">
              <span className="font-label-sm text-label-sm uppercase font-bold text-primary">
                CORE PILLARS
              </span>
            </div>
            <h2 className="font-display text-[30px] sm:text-[42px] uppercase text-on-surface leading-tight">
              THE TOYVOLT MANIFESTO
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-3 max-w-xl mx-auto">
              Four fundamental values that guide how we design, curate, and deliver playtime experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Play Beyond Screens */}
            <div className="bg-surface-container-lowest border-2 border-on-surface rounded-xl p-6 shadow-[4px_4px_0px_#171717] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#171717] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-[28px] font-bold text-primary leading-none">
                    01
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed border-2 border-on-surface flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined text-[20px]">sports_esports</span>
                  </div>
                </div>
                <h3 className="font-title text-[18px] uppercase font-bold text-on-surface mb-2.5">
                  Play Beyond Screens
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Real kinetic excitement. We champion hands-on, high-speed toys that get players active,
                  testing reflexes, and engaging directly with the physical world.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-on-surface/15 flex items-center gap-1.5 text-primary font-label-sm text-[11px] font-bold uppercase">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Active Physical Play
              </div>
            </div>

            {/* Card 2: Fun Meets Curiosity */}
            <div className="bg-surface-container-lowest border-2 border-on-surface rounded-xl p-6 shadow-[4px_4px_0px_#171717] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#171717] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-[28px] font-bold text-[#FF7626] leading-none">
                    02
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-secondary-fixed border-2 border-on-surface flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                  </div>
                </div>
                <h3 className="font-title text-[18px] uppercase font-bold text-on-surface mb-2.5">
                  Fun Meets Curiosity
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Toys that trigger wonder. Unlocking how 4WD mechanical drivetrains, differentials, and
                  speed controllers work through natural, intuitive play.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-on-surface/15 flex items-center gap-1.5 text-[#FF7626] font-label-sm text-[11px] font-bold uppercase">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Mechanical Wonder
              </div>
            </div>

            {/* Card 3: Playful Design */}
            <div className="bg-surface-container-lowest border-2 border-on-surface rounded-xl p-6 shadow-[4px_4px_0px_#171717] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#171717] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-[28px] font-bold text-[#755b00] leading-none">
                    03
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-tertiary-fixed border-2 border-on-surface flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined text-[20px]">palette</span>
                  </div>
                </div>
                <h3 className="font-title text-[18px] uppercase font-bold text-on-surface mb-2.5">
                  Playful Design
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Vibrant, high-contrast, and built tough. Our neo-brutalist aesthetic pairs with
                  reinforced chassis materials made to withstand intense indoor and outdoor action.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-on-surface/15 flex items-center gap-1.5 text-[#755b00] font-label-sm text-[11px] font-bold uppercase">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Durable Aesthetics
              </div>
            </div>

            {/* Card 4: Customer-First Experience */}
            <div className="bg-surface-container-lowest border-2 border-on-surface rounded-xl p-6 shadow-[4px_4px_0px_#171717] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#171717] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-[28px] font-bold text-primary leading-none">
                    04
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-surface-container border-2 border-on-surface flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  </div>
                </div>
                <h3 className="font-title text-[18px] uppercase font-bold text-on-surface mb-2.5">
                  Customer-First Experience
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  A direct and honest buying journey. Live catalog inventory, verified technical specs,
                  transparent shipping policies, and straightforward order tracking.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-on-surface/15 flex items-center gap-1.5 text-primary font-label-sm text-[11px] font-bold uppercase">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Transparent Shopping
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION C: PRODUCT & BRAND SHOWCASE
          ========================================================================= */}
      <section className="w-full bg-surface py-14 sm:py-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-container-lowest border-2 border-on-surface rounded-2xl shadow-[8px_8px_0px_#171717] p-6 sm:p-10 lg:p-12 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Product Info */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF3DF] border border-on-surface rounded font-label-sm text-[11px] font-bold uppercase text-on-surface">
                  <span className="w-2 h-2 rounded-full bg-[#FF7626]" />
                  CURRENT FLAGSHIP
                </div>

                <h2 className="font-display text-[28px] sm:text-[38px] uppercase text-on-surface leading-tight">
                  {product?.name || 'TOYVOLT APEX-1 RC DRIFT CAR'}
                </h2>

                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {product?.description ||
                    'Engineered with a high-torque motor, 4WD shaft-driven chassis, modular drift tires, and 2.4GHz remote system for seamless, non-interfering racing.'}
                </p>

                {/* Real Spec Highlights from Backend */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-[#F0E8DA] border-2 border-on-surface rounded-lg">
                    <span className="font-label-sm text-[10px] uppercase font-bold text-on-surface-variant block">
                      Scale
                    </span>
                    <span className="font-title text-[16px] uppercase font-bold text-on-surface block mt-0.5">
                      1:16 Scale
                    </span>
                  </div>

                  <div className="p-3 bg-[#F0E8DA] border-2 border-on-surface rounded-lg">
                    <span className="font-label-sm text-[10px] uppercase font-bold text-on-surface-variant block">
                      Drivetrain
                    </span>
                    <span className="font-title text-[16px] uppercase font-bold text-on-surface block mt-0.5">
                      4WD Shaft Drive
                    </span>
                  </div>

                  <div className="p-3 bg-[#F0E8DA] border-2 border-on-surface rounded-lg">
                    <span className="font-label-sm text-[10px] uppercase font-bold text-on-surface-variant block">
                      Top Speed
                    </span>
                    <span className="font-title text-[16px] uppercase font-bold text-primary block mt-0.5">
                      35 km/h
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/product/${productSlug}`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-white border-2 border-on-surface rounded-lg font-label-lg text-label-lg uppercase font-bold shadow-[4px_4px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#171717] transition-all"
                  >
                    <span>VIEW FULL DETAILS &amp; GALLERY</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Product Visual */}
              <div className="lg:col-span-6">
                <div className="relative aspect-[4/3] bg-[#FFF3DF] border-2 border-on-surface rounded-xl overflow-hidden shadow-[6px_6px_0px_#171717] flex items-center justify-center p-3 sm:p-5">
                  <ProductImageWithFallback
                    src={product?.primaryImage || product?.images?.[0]?.url}
                    alt={product?.name || 'Toyvolt Apex-1 Remote Control Car'}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-3 right-3 bg-surface-container-lowest text-on-surface border border-on-surface px-3 py-1.5 font-label-sm text-[11px] font-bold shadow-[2px_2px_0px_#171717]">
                    ₹{product ? product.sellingPriceInRupees.toLocaleString('en-IN') : '1,799'} • IN STOCK
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: CLOSING CTA
          ========================================================================= */}
      <section className="w-full bg-[#1769FF] text-white border-t-2 border-on-surface py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF7626] text-white border-2 border-on-surface rounded-lg shadow-[3px_3px_0px_#171717] mb-4">
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span className="font-label-sm text-label-sm uppercase font-bold">
              POWER UP THE FUN
            </span>
          </div>

          <h2 className="font-display text-[32px] sm:text-[46px] lg:text-[54px] uppercase text-white leading-tight max-w-4xl mx-auto">
            READY TO POWER UP PLAYTIME?
          </h2>

          <p className="font-body-lg text-body-lg text-[#e3e7ff] max-w-xl mx-auto mt-4 mb-8">
            Experience high-performance RC drifting engineered for intense thrills, durable play, and pure excitement.
          </p>

          <Link
            to={`/product/${productSlug}`}
            className="px-8 py-4 bg-[#FF7626] text-white border-2 border-on-surface rounded-lg font-label-lg text-label-lg uppercase font-bold shadow-[4px_4px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#171717] transition-all inline-flex items-center gap-2 text-[16px]"
          >
            <span>DISCOVER THE COLLECTION</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
