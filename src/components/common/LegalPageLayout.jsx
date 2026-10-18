import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BRAND_CONFIG } from '../../config/brandConfig';

const POLICY_LINKS = [
  { label: 'Terms & Conditions', path: '/terms-and-conditions', icon: 'gavel' },
  { label: 'Privacy Policy', path: '/privacy-policy', icon: 'shield' },
  { label: 'Shipping & Delivery', path: '/shipping-policy', icon: 'local_shipping' },
  { label: 'Cancellation & Refund', path: '/cancellation-and-refund', icon: 'currency_rupee' },
  { label: 'Return & Exchange', path: '/return-and-exchange', icon: 'published_with_changes' },
  { label: 'Contact Us', path: '/contact', icon: 'support_agent' }
];

export const LegalPageLayout = ({
  title,
  badge = 'TOYVOLT STORE POLICY',
  lastUpdated = 'October 2026',
  effectiveDate = 'October 2026',
  description,
  quickHighlights = [],
  tableOfContents = [],
  children
}) => {
  const location = useLocation();

  // Scroll to top on mount unless hash is present
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.hash]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface text-on-surface">
      {/* =========================================================================
          SECTION 1: HERO HEADER
          ========================================================================= */}
      <section className="w-full bg-[#FFF9F0] border-b-2 border-on-surface py-10 sm:py-14">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 font-label-sm text-[12px] uppercase font-bold text-on-surface-variant">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <span className="text-on-surface-variant">Legal &amp; Policies</span>
              </li>
              <li>/</li>
              <li className="text-primary truncate" aria-current="page">
                {title}
              </li>
            </ol>
          </nav>

          <div className="bg-[#FFF3DF] border-2 border-on-surface rounded-2xl shadow-[6px_6px_0px_#171717] p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed border-2 border-on-surface rounded-lg shadow-[2px_2px_0px_#171717]">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">
                  {badge}
                </span>
              </div>

              <div className="flex items-center gap-2 font-label-sm text-[11px] sm:text-[12px] font-bold text-on-surface-variant bg-surface-container-lowest px-3 py-1 border border-on-surface rounded">
                <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                <span>Last Updated: {lastUpdated}</span>
                <span className="hidden sm:inline">• Effective: {effectiveDate}</span>
              </div>
            </div>

            <h1 className="font-display text-[28px] sm:text-[40px] lg:text-[48px] uppercase text-on-surface leading-[1.1] mb-3">
              {title}
            </h1>

            {description && (
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CROSS-POLICY TABS (Direct 1-Click Access to All Policies)
          ========================================================================= */}
      <section className="w-full bg-[#F0E8DA] border-b-2 border-on-surface py-3">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="font-label-sm text-[11px] uppercase font-bold text-on-surface-variant whitespace-nowrap mr-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">policy</span>
              All Policies:
            </span>
            {POLICY_LINKS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-label-sm text-[11px] sm:text-[12px] uppercase font-bold border-2 border-on-surface rounded transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-white shadow-[2px_2px_0px_#171717] pointer-events-none'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-[#FFF3DF] shadow-[2px_2px_0px_#171717]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: QUICK HIGHLIGHTS STRIP (If provided)
          ========================================================================= */}
      {quickHighlights.length > 0 && (
        <section className="w-full bg-surface border-b-2 border-on-surface py-8">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickHighlights.map((hl, idx) => (
                <div
                  key={idx}
                  className="bg-surface-container-lowest border-2 border-on-surface rounded-xl p-4 shadow-[3px_3px_0px_#171717] flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#FFF3DF] text-primary border-2 border-on-surface flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{hl.icon || 'bolt'}</span>
                  </div>
                  <div>
                    <h2 className="font-title text-[13px] sm:text-[14px] uppercase font-bold text-on-surface">
                      {hl.title}
                    </h2>
                    <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5 leading-snug">
                      {hl.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4: MAIN CONTENT + STICKY SIDEBAR
          ========================================================================= */}
      <section className="w-full py-10 sm:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Sidebar Table of Contents (lg:col-span-4) */}
            {tableOfContents.length > 0 && (
              <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6 order-2 lg:order-1">
                <div className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-5 shadow-[5px_5px_0px_#171717]">
                  <div className="flex items-center gap-2 pb-3 mb-3 border-b-2 border-on-surface">
                    <span className="material-symbols-outlined text-[20px] text-primary">toc</span>
                    <h3 className="font-title text-[15px] uppercase font-bold text-on-surface">
                      Document Index
                    </h3>
                  </div>

                  <nav aria-label="Table of contents">
                    <ul className="space-y-1.5 font-body-sm text-body-sm">
                      {tableOfContents.map((item, idx) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            onClick={(e) => scrollToSection(e, item.id)}
                            className="group flex items-start gap-2 py-1.5 px-2 rounded hover:bg-[#F0E8DA] text-on-surface-variant hover:text-on-surface transition-colors"
                          >
                            <span className="font-mono text-[11px] text-primary font-bold mt-0.5 shrink-0">
                              {String(idx + 1).padStart(2, '0')}.
                            </span>
                            <span className="leading-snug font-medium group-hover:underline">
                              {item.title}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>

                {/* Support Quick Box */}
                <div className="bg-[#FFF3DF] border-2 border-on-surface rounded-xl p-5 shadow-[4px_4px_0px_#171717]">
                  <h4 className="font-title text-[14px] uppercase font-bold text-on-surface mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-primary">help</span>
                    Questions on this Policy?
                  </h4>
                  <p className="font-body-sm text-[13px] text-on-surface-variant mb-3 leading-relaxed">
                    Our customer care team is available to assist you with order, payment, or shipping queries.
                  </p>
                  <div className="space-y-2">
                    <a
                      href={`mailto:${BRAND_CONFIG.contact.email}`}
                      className="w-full py-2 px-3 bg-surface-container-lowest text-primary border-2 border-on-surface rounded font-label-sm text-[12px] uppercase font-bold shadow-[2px_2px_0px_#171717] flex items-center justify-center gap-1.5 hover:bg-white"
                    >
                      <span className="material-symbols-outlined text-[16px]">mail</span>
                      <span>{BRAND_CONFIG.contact.email}</span>
                    </a>
                    <Link
                      to="/contact"
                      className="w-full py-2 px-3 bg-primary text-white border-2 border-on-surface rounded font-label-sm text-[12px] uppercase font-bold shadow-[2px_2px_0px_#171717] flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      <span>Open Contact Form</span>
                    </Link>
                  </div>
                </div>
              </aside>
            )}

            {/* Document Clauses (lg:col-span-8 or full width if no TOC) */}
            <article
              className={`${
                tableOfContents.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'
              } order-1 lg:order-2 space-y-8`}
            >
              {children}
            </article>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: BOTTOM GRIEVANCE & STATUTORY REDRESSAL BANNER
          ========================================================================= */}
      <section className="w-full bg-[#FFF9F0] border-t-2 border-on-surface py-10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-container-lowest border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_#171717]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary-fixed text-on-surface border border-on-surface rounded font-label-sm text-[10px] font-bold uppercase">
                  <span>Consumer Protection Compliance</span>
                </div>
                <h3 className="font-title text-[18px] sm:text-[22px] uppercase font-bold text-on-surface">
                  Customer Support &amp; Grievance Redressal
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  In accordance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, customer inquiries and grievances regarding payments, orders, or policies may be escalated to our Nodal Grievance Redressal desk.
                </p>
                <div className="pt-2 text-on-surface font-body-sm text-[13px] space-y-1">
                  <div>
                    <strong>Storefront Identity:</strong> {BRAND_CONFIG.name} ({BRAND_CONFIG.legalEntityName})
                  </div>
                  <div>
                    <strong>Support Email:</strong>{' '}
                    <a href={`mailto:${BRAND_CONFIG.contact.email}`} className="text-primary underline font-bold">
                      {BRAND_CONFIG.contact.email}
                    </a>
                  </div>
                  <div>
                    <strong>Operational Hours:</strong> {BRAND_CONFIG.contact.hours}
                  </div>
                  <div>
                    <strong>Grievance Officer:</strong> {BRAND_CONFIG.contact.grievanceOfficer.name} ({BRAND_CONFIG.contact.grievanceOfficer.email})
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col gap-3 justify-center">
                <Link
                  to="/contact"
                  className="w-full py-3 px-4 bg-primary text-white border-2 border-on-surface rounded-lg font-label-md text-label-md uppercase font-bold shadow-[4px_4px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#171717] transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                  <span>Contact Customer Support</span>
                </Link>
                <Link
                  to="/orders"
                  className="w-full py-3 px-4 bg-surface-container-low text-on-surface border-2 border-on-surface rounded-lg font-label-md text-label-md uppercase font-bold shadow-[4px_4px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#171717] transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  <span>Track Existing Order</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalPageLayout;
