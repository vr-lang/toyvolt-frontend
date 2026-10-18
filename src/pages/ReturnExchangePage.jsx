import React from 'react';
import { Link } from 'react-router-dom';
import { LegalPageLayout } from '../components/common/LegalPageLayout';
import { BRAND_CONFIG } from '../config/brandConfig';

export const ReturnExchangePage = () => {
  const tableOfContents = [
    { id: 'policy-overview', title: 'Scope & Commitment to Quality' },
    { id: 'eligible-scenarios', title: 'Eligibility for Returns & Exchanges' },
    { id: 'reporting-windows', title: 'Time Windows for Raising a Complaint' },
    { id: 'evidence-required', title: 'Required Proof & Documentation' },
    { id: 'return-process', title: 'Step-by-Step Return & Replacement Process' },
    { id: 'shipping-costs', title: 'Return Shipping & Courier Arrangements' },
    { id: 'inspection-resolution', title: 'Technical Inspection & Resolution Options' },
    { id: 'ineligible-conditions', title: 'Non-Returnable & Ineligible Scenarios' },
    { id: 'statutory-rights', title: 'Consumer Protection Statutory Rights' },
    { id: 'contact-returns', title: 'Returns Support Desk Contact' }
  ];

  const quickHighlights = [
    {
      icon: 'verified',
      title: '7-Day Defect Window',
      description: 'Report manufacturing or electronic faults within 7 days of package delivery.'
    },
    {
      icon: 'local_shipping',
      title: 'Free Reverse Pickup',
      description: 'Toyvolt covers 100% of return courier costs for approved defects or damage.'
    },
    {
      icon: 'published_with_changes',
      title: 'Fast Replacement',
      description: 'Brand-new replacement unit or parts dispatched promptly upon verification.'
    },
    {
      icon: 'policy',
      title: 'Fair Consumer Terms',
      description: 'Transparent rules aligned with Consumer Protection (E-Commerce) Rules, 2020.'
    }
  ];

  return (
    <LegalPageLayout
      title="Return and Exchange Policy"
      badge="CUSTOMER SATISFACTION"
      lastUpdated="October 18, 2026"
      effectiveDate="October 18, 2026"
      description="Our straightforward return and exchange process for damaged, defective, or incorrect remote-control products. We stand behind every vehicle we ship."
      quickHighlights={quickHighlights}
      tableOfContents={tableOfContents}
    >
      {/* Section 1 */}
      <section id="policy-overview" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">01</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Scope &amp; Commitment to Quality
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            At <strong>{BRAND_CONFIG.name}</strong>, customer satisfaction and trust are foundational. We inspect and test our remote-control vehicles prior to packaging. However, given the mechanical and electronic complexity of high-performance RC vehicles, components can occasionally experience manufacturing anomalies or transit stress.
          </p>
          <p>
            We do not believe in arbitrary &quot;all sales are final&quot; barriers. If you receive a product that is damaged in transit, defective out of the box, missing parts, or incorrect, we provide a fair, prompt replacement or refund process.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section id="eligible-scenarios" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">02</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Eligibility for Returns &amp; Exchanges
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>You are eligible for a free replacement, component exchange, or full refund under the following verified conditions:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Transit Damage:</strong> The external shipping box or product itself arrived physically damaged, cracked, or crushed during courier transportation.
            </li>
            <li>
              <strong>Manufacturing / Functional Defect:</strong> The vehicle fails to operate correctly out of the box due to factory defects (e.g. drive motor failure, remote controller transmitter failing to bind, steering servo malfunction, or non-functional USB charging unit).
            </li>
            <li>
              <strong>Incorrect Item Delivered:</strong> The model, color, or specification delivered does not match your order confirmation.
            </li>
            <li>
              <strong>Missing Components:</strong> Essential components (such as the remote controller, rechargeable battery pack, USB charger, or modular drift wheels) were missing from the sealed box.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 3 */}
      <section id="reporting-windows" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">03</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Time Windows for Raising a Complaint
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>To enable timely courier investigation and technical review, claims must be submitted within the following operational windows:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 bg-surface-container-lowest border-2 border-on-surface rounded-lg">
              <span className="font-label-sm text-[11px] font-bold uppercase text-secondary block">Transit Damage &amp; Missing Items</span>
              <span className="font-title text-[22px] font-bold text-on-surface block mt-1">Within 48 Hours</span>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1.5 leading-relaxed">
                Must be reported within 48 hours of parcel delivery confirmation so we can lodge a formal investigation with the logistics carrier.
              </p>
            </div>

            <div className="p-4 bg-surface-container-lowest border-2 border-on-surface rounded-lg">
              <span className="font-label-sm text-[11px] font-bold uppercase text-primary block">Manufacturing &amp; Electronic Defects</span>
              <span className="font-title text-[22px] font-bold text-on-surface block mt-1">Within 7 Days</span>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1.5 leading-relaxed">
                Must be reported within 7 days of delivery confirmation to allow our technical desk to diagnose and resolve component faults.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <section id="evidence-required" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">04</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Required Proof &amp; Documentation
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            To prevent fraudulent warranty claims and verify authentic defects swiftly, please provide:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Your Order Number:</strong> Found in your confirmation email or <Link to="/orders" className="text-primary underline font-bold">My Orders</Link> dashboard (e.g. <code>TV-20261018-1024</code>).</li>
            <li><strong>Photographs of the Outer Box:</strong> Showing the courier shipping label with readable AWB number and any visible transit damage.</li>
            <li><strong>Clear Photo / Video of the Defect:</strong> A brief (10–30 second) video demonstrating the operational fault (such as wheels not responding to remote steering commands, battery failing to charge, or spray mist nozzle defect).</li>
          </ul>
        </div>
      </section>

      {/* Section 5 */}
      <section id="return-process" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">05</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Step-by-Step Return &amp; Replacement Process
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-surface-container-lowest border-2 border-on-surface rounded-lg">
              <span className="w-7 h-7 rounded-full bg-primary text-white font-bold text-[13px] flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="text-on-surface block text-[14px]">Submit Notification:</strong>
                <span className="font-body-sm text-[13px] text-on-surface-variant">Email <a href={`mailto:${BRAND_CONFIG.contact.email}`} className="text-primary underline font-bold">{BRAND_CONFIG.contact.email}</a> with your Order ID, explanation, and video proof.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-surface-container-lowest border-2 border-on-surface rounded-lg">
              <span className="w-7 h-7 rounded-full bg-primary text-white font-bold text-[13px] flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="text-on-surface block text-[14px]">Technical Review (Within 24 Hours):</strong>
                <span className="font-body-sm text-[13px] text-on-surface-variant">Our technical support team reviews the submission. If simple troubleshooting (such as remote re-binding or battery calibration) does not resolve the issue, a return/replacement is approved.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-surface-container-lowest border-2 border-on-surface rounded-lg">
              <span className="w-7 h-7 rounded-full bg-primary text-white font-bold text-[13px] flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="text-on-surface block text-[14px]">Reverse Pickup:</strong>
                <span className="font-body-sm text-[13px] text-on-surface-variant">We schedule a complimentary reverse pickup from your original delivery address via Shiprocket/Delhivery.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-surface-container-lowest border-2 border-on-surface rounded-lg">
              <span className="w-7 h-7 rounded-full bg-primary text-white font-bold text-[13px] flex items-center justify-center shrink-0">4</span>
              <div>
                <strong className="text-on-surface block text-[14px]">Resolution Dispatch:</strong>
                <span className="font-body-sm text-[13px] text-on-surface-variant">Upon receiving and verifying the returned unit, a brand-new replacement unit is dispatched immediately, or a 100% refund is initiated if stock is exhausted.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6 */}
      <section id="shipping-costs" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">06</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Return Shipping &amp; Courier Arrangements
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            <strong>Who Bears Return Shipping?</strong> For all verified manufacturing defects, transit damages, or wrong item shipments, <strong>Toyvolt bears 100% of the return shipping costs</strong>. The customer pays nothing.
          </p>
          <p>
            In the rare event that reverse pickup is not serviced by couriers in your remote PIN code, our team will request you to dispatch the parcel via India Post Speed Post or a reputable local courier, and Toyvolt will reimburse the shipping cost upon presentation of the courier postal receipt.
          </p>
        </div>
      </section>

      {/* Section 7 */}
      <section id="inspection-resolution" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">07</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Technical Inspection &amp; Resolution Options
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>Once the item reaches our fulfillment facility, technical inspection is completed within 2 business days. Customers may choose between:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Free Replacement (Recommended):</strong> We dispatch a brand-new, factory-sealed replacement vehicle with a fresh AWB tracking number at zero additional cost.</li>
            <li><strong>Full Refund:</strong> If replacement stock is exhausted or if the customer prefers a refund, 100% of the order total will be returned to the original payment source within 5 to 7 business days as detailed in our <Link to="/cancellation-and-refund" className="text-primary underline font-bold">Cancellation and Refund Policy</Link>.</li>
          </ul>
        </div>
      </section>

      {/* Section 8 */}
      <section id="ineligible-conditions" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">08</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Non-Returnable &amp; Ineligible Scenarios
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>Returns or warranty exchanges cannot be accepted under the following conditions:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Crash &amp; Collision Damage:</strong> Physical cracks, broken chassis, or shattered suspension resulting from high-speed crashes into walls, rocks, stairs, or curbs during driving.</li>
            <li><strong>Water Ingress &amp; Corrosion:</strong> Operating the car in water pools, mud, or rain causing short-circuited circuit boards (unless the specific vehicle is explicitly designated fully waterproof).</li>
            <li><strong>Improper Charging:</strong> Damage caused by using unapproved, high-wattage fast smartphone chargers instead of the included USB balanced charging cable.</li>
            <li><strong>Modifications:</strong> Vehicle disassembled, wires soldered, or third-party motors/batteries installed by the customer.</li>
            <li><strong>Normal Wear and Tear:</strong> Expected cosmetic wear such as scratched body decals or worn rubber tire treads resulting from regular driving.</li>
            <li><strong>Expired Window:</strong> Requests initiated after the 7-day reporting period.</li>
          </ul>
        </div>
      </section>

      {/* Section 9 */}
      <section id="statutory-rights" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">09</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Consumer Protection Statutory Rights
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            Nothing in this Return and Exchange Policy is intended to limit, exclude, or modify your statutory consumer rights under the <strong>Consumer Protection Act, 2019</strong> and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>.
          </p>
          <p>
            Toyvolt is committed to fair, transparent dealing and honest customer resolution.
          </p>
        </div>
      </section>

      {/* Section 10 */}
      <section id="contact-returns" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">10</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Returns Support Desk Contact
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>To initiate a return or speak with our technical team:</p>
          <div className="p-4 bg-surface-container-lowest border-2 border-on-surface rounded-lg space-y-1 font-body-sm">
            <div><strong>Department:</strong> Toyvolt Returns &amp; Warranty Team</div>
            <div><strong>Email:</strong> <a href={`mailto:${BRAND_CONFIG.contact.email}`} className="text-primary underline font-bold">{BRAND_CONFIG.contact.email}</a></div>
            <div><strong>Operational Hours:</strong> {BRAND_CONFIG.contact.hours}</div>
            <div><strong>Turnaround Commitment:</strong> Initial response and ticket acknowledgment within 24 business hours</div>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
};

export default ReturnExchangePage;
