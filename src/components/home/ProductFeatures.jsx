import React from 'react';
import { ScrollReveal } from '../common/ScrollReveal';

/**
 * Preserves the exact Stitch 6-card pastel Neo-Brutalist grid ("Popular Toy Zones"),
 * transforming the fake multi-product categories into the 6 verified engineering subsystems
 * and full specification matrix of the Toyvolt Apex-1 RC Drift Car.
 */
export const ProductFeatures = ({ product }) => {
  if (!product) return null;

  const specs = product.specifications || {};
  const dims = product.dimensions;

  const featureZones = [
    {
      bg: 'bg-[#FFF2EB]',
      badgeBg: 'bg-secondary-container text-on-secondary',
      badge: specs['Top Speed'] || '35 KM/H',
      icon: 'speed',
      title: 'High-Speed Drift Drivetrain',
      description:
        'Engineered for rapid acceleration and controlled powerslides with interchangeable TPR rubber drift tires.',
      specKey: 'Drive System',
      specVal: specs['Drive System'] || '4-Wheel Drive (4WD)'
    },
    {
      bg: 'bg-[#F5F0FF]',
      badgeBg: 'bg-primary-container text-on-primary',
      badge: specs['Control Range'] || '50M RANGE',
      icon: 'settings_input_antenna',
      title: '2.4 GHz Proportional Control',
      description:
        '4-channel interference-free radio system delivering responsive, full proportional steering and throttle control.',
      specKey: 'Control Frequency',
      specVal: specs['Control Frequency'] || '2.4 GHz Proportional'
    },
    {
      bg: 'bg-[#FFFBE5]',
      badgeBg: 'bg-tertiary-container text-on-tertiary-container',
      badge: specs['Play Time'] || '25–30 MINS',
      icon: 'battery_charging_full',
      title: 'High-Output Li-Po Battery',
      description:
        'Powered by a rechargeable 7.4V 1200mAh Li-Po pack engineered for sustained voltage under high-load drifting.',
      specKey: 'Battery Pack',
      specVal: specs['Battery'] || '7.4V 1200mAh Li-Po (Rechargeable)'
    },
    {
      bg: 'bg-[#EBF7F2]',
      badgeBg: 'bg-surface-tint text-on-primary',
      badge: specs['Charging Time'] || '90 MIN USB',
      icon: 'usb',
      title: 'Fast USB Charging System',
      description:
        'Convenient USB charging architecture gets you back on the track in approximately 90 minutes.',
      specKey: 'Charging Time',
      specVal: specs['Charging Time'] || '90 minutes via USB'
    },
    {
      bg: 'bg-[#EFF5FF]',
      badgeBg: 'bg-primary text-on-primary',
      badge: specs['Scale'] ? `${specs['Scale']} SCALE` : '1:16 SCALE',
      icon: 'shield',
      title: 'Polycarbonate Armor Shell',
      description:
        'Reinforced high-impact polycarbonate body shell designed to absorb side-impacts and drift collisions.',
      specKey: 'Chassis Material',
      specVal: specs['Chassis'] || 'Reinforced High-Impact Polycarbonate'
    },
    {
      bg: 'bg-[#FFF4E0]',
      badgeBg: 'bg-secondary text-on-secondary',
      badge: product.weightGrams ? `${product.weightGrams}G WEIGHT` : 'BALANCED MASS',
      icon: 'straighten',
      title: 'Balanced 1:16 Footprint',
      description:
        'Low center-of-gravity stance tailored for both indoor smooth floors and outdoor paved drift tracks.',
      specKey: 'Dimensions (L × B × H)',
      specVal: dims
        ? `${dims.lengthCm} cm × ${dims.breadthCm} cm × ${dims.heightCm} cm`
        : '32 cm × 18 cm × 14 cm'
    }
  ];

  const allSpecEntries = Object.entries(specs);

  return (
    <section
      id="specs"
      className="w-full max-w-[1360px] mx-auto px-4 lg:px-8 py-12 md:py-16"
    >
      {/* Header matching Stitch Category Grid Header */}
      <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-on-surface text-surface px-2.5 py-1 mb-2 font-label-sm text-label-sm uppercase font-bold">
            <span>ENGINEERING DIRECTORY // {product.sku}</span>
          </div>
          <h2 className="font-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
            APEX-1 TECHNICAL ARCHITECTURE
          </h2>
        </div>
        <span className="font-label-lg text-label-lg uppercase text-primary font-bold">
          {allSpecEntries.length} VERIFIED HARDWARE SPECIFICATIONS
        </span>
      </ScrollReveal>

      {/* 6 Bold Feature Cards (Exact Stitch 6-Card Grid Aesthetic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureZones.map((zone, idx) => (
          <ScrollReveal key={zone.title} delay={idx * 80}>
            <div
              className={`${zone.bg} border-2 border-on-surface shadow-[5px_5px_0px_#191919] p-5 flex flex-col justify-between group hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_#191919] transition-all h-full`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`${zone.badgeBg} px-2.5 py-0.5 font-label-sm text-label-sm font-bold border border-on-surface uppercase`}
                  >
                    {zone.badge}
                  </span>
                  <span className="material-symbols-outlined text-[24px] text-on-surface group-hover:rotate-12 transition-transform">
                    {zone.icon}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface mb-1.5">
                  {zone.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-5">
                  {zone.description}
                </p>
              </div>

              <div className="w-full bg-surface-container-lowest border-2 border-on-surface p-3 shadow-[2px_2px_0px_#191919] flex items-center justify-between gap-2">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
                  {zone.specKey}
                </span>
                <span className="font-label-md text-label-md text-on-surface font-bold text-right">
                  {zone.specVal}
                </span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Complete Backend Specification Table */}
      {allSpecEntries.length > 0 && (
        <ScrollReveal className="mt-8 bg-[#FFF9F0] border-2 border-on-surface shadow-[5px_5px_0px_#191919] p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b-2 border-on-surface">
            <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface">
              COMPLETE SPECIFICATION SHEET ({product.name})
            </h3>
            <span className="font-label-sm text-label-sm uppercase bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 border border-on-surface font-bold w-fit">
              LIVE API SCHEMA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allSpecEntries.map(([specName, specValue]) => (
              <div
                key={specName}
                className="bg-surface-container-lowest border-2 border-on-surface p-3 flex flex-col justify-between"
              >
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
                  {specName}
                </span>
                <span className="font-title text-title text-on-surface mt-1">
                  {specValue}
                </span>
              </div>
            ))}
            {dims && (
              <div className="bg-surface-container-lowest border-2 border-on-surface p-3 flex flex-col justify-between">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
                  Dimensions &amp; Weight
                </span>
                <span className="font-title text-title text-on-surface mt-1">
                  {dims.lengthCm} × {dims.breadthCm} × {dims.heightCm} cm ({product.weightGrams}g)
                </span>
              </div>
            )}
          </div>
        </ScrollReveal>
      )}
    </section>
  );
};

export default ProductFeatures;
