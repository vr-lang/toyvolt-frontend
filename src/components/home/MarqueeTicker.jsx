import React from 'react';
import { BRAND_CONFIG } from '../../config/brandConfig';

export const MarqueeTicker = ({ product }) => {
  const topSpeed = product?.specifications?.['Top Speed'] || '35 km/h';
  const freq = product?.specifications?.['Control Frequency'] || '2.4 GHz Proportional';
  const drive = product?.specifications?.['Drive System'] || '4-Wheel Drive (4WD)';
  const battery = product?.specifications?.['Battery'] || '7.4V 1200mAh Li-Po';

  const items = [
    `★ ${product?.name || 'TOYVOLT APEX-1 1:16 SCALE RC DRIFT CAR'}`,
    `TOP SPEED: ${topSpeed}`,
    `${drive} • ${freq}`,
    `BATTERY: ${battery}`,
    `FREE EXPRESS SHIPPING ON ALL ORDERS ACROSS INDIA`,
    `USE CODE: WELCOME100 FOR ₹100 OFF`
  ];

  // Duplicate list twice for seamless 50% CSS marquee loop
  const tickerList = [...items, ...items];

  return (
    <div
      aria-label="Product highlights ticker"
      className="w-full bg-secondary-container text-on-secondary py-2 overflow-hidden border-b-2 border-on-surface"
    >
      <div className="animate-marquee gap-8 items-center font-label-md text-label-md tracking-widest uppercase">
        {tickerList.map((text, idx) => (
          <React.Fragment key={idx}>
            <span className="whitespace-nowrap">{text}</span>
            <span aria-hidden="true">•</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MarqueeTicker;
