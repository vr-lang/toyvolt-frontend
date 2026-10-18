import React from 'react';
import { MarqueeTicker } from '../components/home/MarqueeTicker';
import { HeroSection } from '../components/home/HeroSection';
import { PerformanceStrip } from '../components/home/PerformanceStrip';
import { ProductShowcase } from '../components/home/ProductShowcase';
import { ProductFeatures } from '../components/home/ProductFeatures';
import { PromoCouponBanner } from '../components/home/PromoCouponBanner';
import { DeliverySection } from '../components/home/DeliverySection';
import { TrustSection } from '../components/home/TrustSection';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';

export const HomePage = ({
  product,
  isLoading,
  error,
  onRetry,
  backendServices
}) => {
  return (
    <div className="flex flex-col w-full">
      {/* Top Promotional Marquee Ticker */}
      <MarqueeTicker product={product} />

      {/* Handle Loading, Error, Empty, or Live Product States */}
      {isLoading ? (
        <LoadingState message="Loading Toyvolt Apex-1 Live Telemetry from Render..." />
      ) : error ? (
        <ErrorState
          title="Unable to Reach Toyvolt Backend"
          message={error}
          onRetry={onRetry}
        />
      ) : !product ? (
        <ErrorState
          isEmpty
          title="No Active Product Found in Catalog"
          message="The Toyvolt product catalog is currently empty on the server. Please seed or publish the flagship RC car via the backend."
          onRetry={onRetry}
        />
      ) : (
        <>
          {/* 1. Hero Section (Exact Stitch 12-Col Layout + Single-Product Showcase) */}
          <HeroSection product={product} />

          {/* 2. Hardware Benchmarks Strip (Adapted from Stitch 4-Card Strip) */}
          <PerformanceStrip product={product} />

          {/* 3. Single-Product Interactive Showcase & Buying Station */}
          <ProductShowcase product={product} />

          {/* 4. 6-Card Engineering & Specification Grid (Adapted from Stitch Category Grid) */}
          <ProductFeatures product={product} />

          {/* 5. Server-Verified Coupon & Promotions Banner (Adapted from Stitch Super Sale Banner) */}
          <PromoCouponBanner product={product} />

          {/* 6. PIN Code & Shipping Fee Calculator */}
          <DeliverySection backendServices={backendServices} />

          {/* 7. Honest Trust Pillars & Real Email OTP Club Registration */}
          <TrustSection />
        </>
      )}
    </div>
  );
};

export default HomePage;
