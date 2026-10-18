import React from 'react';

export const LoadingState = ({ message = 'Connecting to Toyvolt Live Garage...' }) => {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="w-full max-w-[1360px] mx-auto px-4 lg:px-8 py-10 md:py-16"
    >
      <div className="bg-[#FFF9F0] border-2 border-on-surface shadow-[6px_6px_0px_#191919] p-6 lg:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b-2 border-on-surface/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container text-on-primary border-2 border-on-surface shadow-[3px_3px_0px_#191919] flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-[22px]">bolt</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm uppercase text-secondary font-bold block">
                LIVE TELEMETRY SYNC
              </span>
              <h2 className="font-headline-sm text-headline-sm uppercase text-on-surface">
                {message}
              </h2>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm uppercase px-3 py-1.5 border border-on-surface shadow-[2px_2px_0px_#191919] w-fit">
            Fetching Live Inventory &amp; Pricing
          </span>
        </div>

        {/* Neo-Brutalist Skeleton Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex gap-2">
              <div className="h-7 w-32 bg-surface-container-high border-2 border-on-surface animate-pulse" />
              <div className="h-7 w-28 bg-tertiary-fixed/60 border-2 border-on-surface animate-pulse" />
            </div>
            <div className="h-16 w-4/5 bg-surface-container-high border-2 border-on-surface animate-pulse" />
            <div className="h-16 w-3/4 bg-primary-fixed border-2 border-on-surface animate-pulse" />
            <div className="h-24 w-full bg-surface-container border-2 border-on-surface animate-pulse" />
            <div className="flex gap-4 pt-2">
              <div className="h-14 w-48 bg-primary-container/40 border-2 border-on-surface animate-pulse" />
              <div className="h-14 w-44 bg-surface-container-lowest border-2 border-on-surface animate-pulse" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-surface-container-lowest border-2 border-on-surface shadow-[5px_5px_0px_#191919] p-4 space-y-4">
              <div className="w-full h-64 bg-surface-container-high border border-on-surface animate-pulse" />
              <div className="h-6 w-2/3 bg-surface-container-high border border-on-surface animate-pulse" />
              <div className="h-10 w-1/3 bg-primary-fixed border border-on-surface animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoadingState;
