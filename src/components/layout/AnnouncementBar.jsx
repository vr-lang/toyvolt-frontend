import React from 'react';
import { BRAND_CONFIG } from '../../config/brandConfig';

export const AnnouncementBar = ({ onSelectCoupon }) => {
  return (
    <div className="bg-tertiary-container text-on-tertiary-container border-b-2 border-on-surface py-1.5 px-4 overflow-hidden">
      <div className="flex items-center justify-between max-w-[1360px] mx-auto gap-4">
        <div className="flex items-center gap-2.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px] text-on-tertiary-container shrink-0">
            local_shipping
          </span>
          <span className="font-label-sm text-label-sm tracking-wider uppercase font-bold truncate">
            Free Express Shipping Across India • Welcome Code:{' '}
            <button
              type="button"
              onClick={() => onSelectCoupon?.('WELCOME100')}
              className="underline decoration-2 underline-offset-2 hover:text-primary transition-colors font-bold"
              title="Click to apply or copy WELCOME100"
            >
              WELCOME100
            </button>{' '}
            (₹100 OFF)
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-on-tertiary-container shrink-0">
          <span className="font-label-sm text-label-sm uppercase font-bold tracking-widest">
            ⚡ 1:16 Scale 4WD Proportional Drift
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
