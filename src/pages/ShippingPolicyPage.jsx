import React from 'react';
import { Link } from 'react-router-dom';
import { LegalPageLayout } from '../components/common/LegalPageLayout';
import { BRAND_CONFIG } from '../config/brandConfig';

export const ShippingPolicyPage = () => {
  const tableOfContents = [
    { id: 'serviceable-areas', title: 'Serviceable Locations & Coverage' },
    { id: 'processing-timelines', title: 'Order Processing & Dispatch Timelines' },
    { id: 'shipping-rates', title: 'Shipping Charges & Calculation' },
    { id: 'estimated-delivery', title: 'Estimated Delivery Timelines' },
    { id: 'tracking-orders', title: 'Order Tracking & Shipment Notifications' },
    { id: 'delivery-attempts', title: 'Courier Delivery Attempts & Undelivered Parcels' },
    { id: 'address-changes', title: 'Incorrect Addresses & Address Changes' },
    { id: 'transit-damage', title: 'Damaged or Tampered Parcels upon Delivery' },
    { id: 'shipping-support', title: 'Shipping Support & Inquiries' }
  ];

  const quickHighlights = [
    {
      icon: 'local_shipping',
      title: 'Free Delivery Threshold',
      description: `Free shipping across India on orders of ₹${BRAND_CONFIG.shipping.freeShippingThresholdRupees} or more.`
    },
    {
      icon: 'schedule',
      title: 'Dispatch Window',
      description: `Orders are packed and dispatched within ${BRAND_CONFIG.shipping.dispatchTimeline} (Mon–Sat).`
    },
    {
      icon: 'pin_drop',
      title: 'Pan-India Coverage',
      description: 'Delivering to serviceable postal PIN codes across metro and regional India.'
    },
    {
      icon: 'receipt_long',
      title: 'Live AWB Tracking',
      description: 'Track your package with real-time courier milestones on My Orders.'
    }
  ];

  return (
    <LegalPageLayout
      title="Shipping and Delivery Policy"
      badge="LOGISTICS & DISPATCH"
      lastUpdated="October 18, 2026"
      effectiveDate="October 18, 2026"
      description="Learn about Toyvolt's shipping coverage across India, automated shipping rate calculations, dispatch schedules, and parcel tracking procedures."
      quickHighlights={quickHighlights}
      tableOfContents={tableOfContents}
    >
      {/* Section 1 */}
      <section id="serviceable-areas" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">01</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Serviceable Locations &amp; Coverage
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            Toyvolt ships remote-control cars and hobby products across <strong>India</strong>, serving thousands of postal PIN codes spanning metro cities, tier-2, tier-3 towns, and regional hubs.
          </p>
          <p>
            We partner with premier logistics aggregators and courier networks (including <strong>Shiprocket, Delhivery, Bluedart, and Xpressbees</strong>) to ensure safe, dependable parcel transit.
          </p>
          <div className="p-4 bg-surface-container-lowest border-2 border-on-surface rounded-lg">
            <h3 className="font-title text-[14px] uppercase font-bold text-on-surface mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              <span>PIN Code Verification Tool</span>
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              You can verify serviceability and pre-fill your delivery postal PIN code anytime using the interactive Delivery Checker on our <Link to="/" className="text-primary underline font-bold">homepage</Link> or during <Link to="/checkout" className="text-primary underline font-bold">checkout</Link>.
            </p>
          </div>
          <p className="text-[13px] text-on-surface-variant">
            <em>Note on International Delivery:</em> Currently, Toyvolt only accepts orders for delivery within India. We do not support cross-border or international shipments at this time.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section id="processing-timelines" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">02</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Order Processing &amp; Dispatch Timelines
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            <strong>Processing Schedule:</strong> Orders placed and confirmed on Toyvolt are processed and dispatched within <strong>{BRAND_CONFIG.shipping.dispatchTimeline}</strong> (Monday through Saturday, excluding public holidays and Sundays).
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Orders placed Monday – Friday before 2:00 PM IST:</strong> Usually processed for dispatch within 24 hours.</li>
            <li><strong>Orders placed after 2:00 PM IST or on weekends:</strong> Processed on the next immediate business day.</li>
          </ul>
          <p>
            During peak festival shopping seasons (e.g., Diwali, New Year) or major flash sales, dispatch processing may experience an additional 24-hour buffer due to high logistics volume. We keep customers proactively updated via email.
          </p>
        </div>
      </section>

      {/* Section 3 */}
      <section id="shipping-rates" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">03</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Shipping Charges &amp; Calculation
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            Shipping fees are automatically and transparently calculated by our backend pricing engine based on your cart subtotal:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-[13px] border-2 border-on-surface bg-surface-container-lowest">
              <thead className="bg-[#FFF3DF] border-b-2 border-on-surface font-title uppercase text-[12px]">
                <tr>
                  <th className="p-3 border-r border-on-surface">Cart Subtotal</th>
                  <th className="p-3 border-r border-on-surface">Shipping Rate</th>
                  <th className="p-3">Eligibility &amp; Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-surface/20">
                <tr className="bg-[#eef3ff]">
                  <td className="p-3 font-bold border-r border-on-surface">All Orders (Pan-India)</td>
                  <td className="p-3 font-mono font-bold text-primary border-r border-on-surface">FREE (₹0)</td>
                  <td className="p-3">
                    <strong>100% Free Shipping</strong> applied automatically at checkout across all PIN codes in India.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="font-body-sm text-[12px] text-on-surface-variant">
            <em>No Hidden Surcharges:</em> The shipping fee displayed in your cart and order review before payment is final. We do not charge fuel surcharges or delivery surcharges at the door.
          </p>
        </div>
      </section>

      {/* Section 4 */}
      <section id="estimated-delivery" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">04</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Estimated Delivery Timelines
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            Once your order is picked up by our logistics courier, estimated transit times across India are as follows:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-container-lowest border-2 border-on-surface rounded-lg p-4">
              <span className="font-label-sm text-[11px] font-bold uppercase text-primary block">Metro Cities</span>
              <span className="font-title text-[20px] font-bold text-on-surface block mt-1">3 – 4 Days</span>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">
                Delhi NCR, Mumbai, Bengaluru, Chennai, Hyderabad, Kolkata, Pune, Ahmedabad.
              </p>
            </div>

            <div className="bg-surface-container-lowest border-2 border-on-surface rounded-lg p-4">
              <span className="font-label-sm text-[11px] font-bold uppercase text-secondary block">Tier-2 &amp; Tier-3 Cities</span>
              <span className="font-title text-[20px] font-bold text-on-surface block mt-1">4 – 6 Days</span>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">
                State capitals, major industrial cities, and district headquarters across India.
              </p>
            </div>

            <div className="bg-surface-container-lowest border-2 border-on-surface rounded-lg p-4">
              <span className="font-label-sm text-[11px] font-bold uppercase text-tertiary block">Remote &amp; North East</span>
              <span className="font-title text-[20px] font-bold text-on-surface block mt-1">6 – 8 Days</span>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">
                Jammu &amp; Kashmir, Ladakh, North Eastern states, and island territories.
              </p>
            </div>
          </div>
          <p className="font-body-sm text-[12px] text-on-surface-variant mt-2">
            <em>Disclaimer:</em> Delivery timelines are estimates provided by surface and express courier providers. Unforeseen weather disruptions, state border inspections, or natural disruptions may occasionally cause transit delays.
          </p>
        </div>
      </section>

      {/* Section 5 */}
      <section id="tracking-orders" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">05</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Order Tracking &amp; Shipment Notifications
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            We provide full shipment visibility from warehouse packing to doorstep delivery:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              <strong>Air Waybill (AWB) Generation:</strong> When your order is packed, an official courier tracking number (AWB) is assigned.
            </li>
            <li>
              <strong>Live Tracking on Toyvolt:</strong> You can track your shipment status at any time by visiting your <Link to="/orders" className="text-primary underline font-bold">My Orders</Link> dashboard.
            </li>
            <li>
              <strong>SMS / Email Milestones:</strong> You will receive notifications when your package is dispatched, when it arrives at your local delivery hub, and on the morning of final delivery.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 6 */}
      <section id="delivery-attempts" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">06</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Courier Delivery Attempts &amp; Undelivered Parcels
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            Our courier partners will attempt delivery up to <strong>three (3) consecutive times</strong>. If you are unavailable at the address during the initial attempt, the delivery agent will call your registered phone number or reschedule delivery for the following business day.
          </p>
          <p>
            If all three attempts fail or the recipient is unreachable, the parcel will be placed on hold at the local delivery hub for 48 hours before being marked as Return to Origin (RTO).
          </p>
        </div>
      </section>

      {/* Section 7 */}
      <section id="address-changes" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">07</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Incorrect Addresses &amp; Address Changes
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            <strong>Before Dispatch:</strong> If you notice an error in your shipping address, please notify us immediately at <a href={`mailto:${BRAND_CONFIG.contact.email}`} className="text-primary underline font-bold">{BRAND_CONFIG.contact.email}</a> within 2 hours of placing the order. We can update address details prior to courier handover.
          </p>
          <p>
            <strong>After Dispatch:</strong> Once an order is in transit with an AWB, rerouting to a different city or postal PIN code is not supported by courier networks. In such cases, the parcel must be returned to origin before reshipment can be scheduled.
          </p>
        </div>
      </section>

      {/* Section 8 */}
      <section id="transit-damage" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">08</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Damaged or Tampered Parcels upon Delivery
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            Every Toyvolt RC vehicle is inspected and safely packaged in shock-resistant bubble and corrugated protective materials prior to leaving our warehouse.
          </p>
          <div className="p-4 bg-surface-container-lowest border-2 border-on-surface rounded-lg space-y-2">
            <h3 className="font-title text-[14px] uppercase font-bold text-[#ba1a1a] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span>Important Action at Delivery</span>
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              If the outer parcel box appears crushed, torn, wet, or visibly tampered with upon courier delivery:
            </p>
            <ol className="list-decimal pl-6 font-body-sm space-y-1 text-on-surface-variant">
              <li>Refuse delivery and note &quot;Damaged parcel&quot; on the courier signature sheet, OR</li>
              <li>Accept the parcel, take clear photos/video of the unopened damaged package, and record a continuous unboxing video.</li>
              <li>Notify Toyvolt within <strong>48 hours</strong> at <a href={`mailto:${BRAND_CONFIG.contact.email}`} className="text-primary underline font-bold">{BRAND_CONFIG.contact.email}</a> with your Order ID.</li>
            </ol>
          </div>
          <p>
            Upon receipt of your notice, our support team will initiate an expedited replacement or full refund under our <Link to="/return-and-exchange" className="text-primary underline font-bold">Return and Exchange Policy</Link>.
          </p>
        </div>
      </section>

      {/* Section 9 */}
      <section id="shipping-support" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">09</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Shipping Support &amp; Inquiries
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            If your package is delayed, showing unexpected tracking milestones, or if you need assistance coordinating with the courier delivery driver:
          </p>
          <div className="p-4 bg-surface-container-lowest border-2 border-on-surface rounded-lg space-y-1 font-body-sm">
            <div><strong>Logistics Desk:</strong> Toyvolt Fulfillment Operations</div>
            <div><strong>Email:</strong> <a href={`mailto:${BRAND_CONFIG.contact.email}`} className="text-primary underline font-bold">{BRAND_CONFIG.contact.email}</a></div>
            <div><strong>Operational Hours:</strong> {BRAND_CONFIG.contact.hours}</div>
            <div><strong>Self-Service Tracking:</strong> <Link to="/orders" className="text-primary underline font-bold">toyvolt.com/orders</Link></div>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
};

export default ShippingPolicyPage;
