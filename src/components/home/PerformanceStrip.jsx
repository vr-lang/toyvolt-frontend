import React from 'react';
import { ScrollReveal } from '../common/ScrollReveal';

/**
 * Preserves the exact Stitch "Shop by Age Strip" 4-card Neo-Brutalist section,
 * adapted to showcase the 4 verified hardware benchmarks of the Toyvolt Apex-1 RC Drift Car.
 */
export const PerformanceStrip = ({ product }) => {
  if (!product) return null;

  const specs = product.specifications || {};
  const dims = product.dimensions;

  const benchmarks = [
    {
      metric: specs['Top Speed'] || '35 KM/H',
      title: 'High-Speed Drift',
      subtitle: specs['Drive System'] || '4-Wheel Drive (4WD)',
      hoverBg: 'hover:bg-tertiary-fixed',
      targetId: 'specs'
    },
    {
      metric: '2.4 GHZ',
      title: 'Proportional Radio',
      subtitle: `${specs['Control Range'] || '50 meters'} control range`,
      hoverBg: 'hover:bg-secondary-fixed',
      targetId: 'specs'
    },
    {
      metric: specs['Play Time'] || '25–30M',
      title: '7.4V Li-Po Power',
      subtitle: `Charges in ${specs['Charging Time'] || '90 mins via USB'}`,
      hoverBg: 'hover:bg-primary-fixed',
      targetId: 'specs'
    },
    {
      metric: specs['Scale'] ? `${specs['Scale']} SCALE` : '1:16 SCALE',
      title: 'Reinforced Chassis',
      subtitle: dims
        ? `${dims.lengthCm} × ${dims.breadthCm} × ${dims.heightCm} cm • ${product.weightGrams || 850}g`
        : specs['Chassis'] || 'High-Impact Polycarbonate',
      hoverBg: 'hover:bg-tertiary-fixed-dim',
      targetId: 'product-showcase'
    }
  ];

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-surface-container border-y-2 border-on-surface py-6">
      <div className="max-w-[1360px] mx-auto px-4 lg:px-8">
        <ScrollReveal className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider font-bold">
              VERIFIED HARDWARE BENCHMARKS
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">
              ENGINEERED FOR PRECISION DRIFTING
            </h2>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Live specifications loaded directly from Toyvolt product telemetry (SKU: {product.sku})
          </span>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {benchmarks.map((item, idx) => (
            <ScrollReveal key={item.title} delay={idx * 70}>
              <button
                type="button"
                onClick={() => handleScroll(item.targetId)}
                className={`w-full text-left bg-surface-container-lowest border-2 border-on-surface p-3 shadow-[3px_3px_0px_#191919] ${item.hoverBg} hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex flex-col justify-between group h-full`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold uppercase">
                    {item.metric}
                  </span>
                  <span className="material-symbols-outlined text-[20px] group-hover:rotate-45 transition-transform">
                    north_east
                  </span>
                </div>
                <span className="font-label-md text-label-md uppercase font-bold text-on-surface">
                  {item.title}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {item.subtitle}
                </span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerformanceStrip;
