import React from 'react';

export const ErrorState = ({
  title = 'Unable to Load Live Product Telemetry',
  message = 'We could not reach the Toyvolt backend server. If the Render server was idle, it may take a few seconds to wake up.',
  onRetry,
  isEmpty = false
}) => {
  return (
    <section
      role="alert"
      className="w-full max-w-[1360px] mx-auto px-4 lg:px-8 py-12 md:py-16"
    >
      <div className="bg-[#FFF9F0] border-2 border-on-surface shadow-[6px_6px_0px_#191919] p-6 md:p-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary px-3 py-1 font-label-sm text-label-sm uppercase font-bold border border-on-surface shadow-[2px_2px_0px_#191919] mb-4">
          <span className="material-symbols-outlined text-[16px]">
            {isEmpty ? 'inventory_2' : 'warning'}
          </span>
          <span>{isEmpty ? 'CATALOG EMPTY' : 'CONNECTION INTERRUPTED'}</span>
        </div>

        <h2 className="font-headline-md text-headline-md uppercase text-on-surface mb-2">
          {title}
        </h2>

        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          {message}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-primary-container text-on-primary font-title text-title uppercase px-6 py-3.5 border-2 border-on-surface shadow-[4px_4px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#191919] active:translate-x-1 active:translate-y-1 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            <span>RETRY LIVE CONNECTION</span>
          </button>
        )}
      </div>
    </section>
  );
};

export default ErrorState;
