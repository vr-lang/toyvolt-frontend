import React from 'react';
import { Link } from 'react-router-dom';
import { LegalPageLayout } from '../components/common/LegalPageLayout';
import { BRAND_CONFIG } from '../config/brandConfig';

export const CancellationRefundPage = () => {
  const tableOfContents = [
    { id: 'cancellation-window', title: 'Order Cancellation Guidelines' },
    { id: 'how-to-cancel', title: 'How to Cancel an Order' },
    { id: 'post-dispatch', title: 'Orders Already Dispatched in Transit' },
    { id: 'refund-eligibility', title: 'Refund Eligibility Scenarios' },
    { id: 'payment-failures', title: 'Payment Failures & Duplicate Debits' },
    { id: 'refund-timeline', title: 'Refund Processing Timelines & Modes' },
    { id: 'coupon-adjustments', title: 'Discounts, Coupons & Partial Cancellations' },
    { id: 'how-to-request-refund', title: 'How to Submit a Refund Request' }
  ];

  const quickHighlights = [
    {
      icon: 'cancel',
      title: 'Free Pre-Dispatch Cancel',
      description: 'Cancel your order at zero penalty before it leaves our warehouse.'
    },
    {
      icon: 'autorenew',
      title: 'Instant Stock Restoration',
      description: 'Cancelling immediately restores reserved inventory to available stock.'
    },
    {
      icon: 'schedule',
      title: '5–7 Days Refund Time',
      description: 'Refunds reflect in your original payment source within 5 to 7 business days.'
    },
    {
      icon: 'security',
      title: 'Original Source Refund',
      description: 'Funds are returned securely to the exact UPI, card, or bank account used.'
    }
  ];

  return (
    <LegalPageLayout
      title="Cancellation and Refund Policy"
      badge="CUSTOMER TRANSPARENCY"
      lastUpdated="October 18, 2026"
      effectiveDate="October 18, 2026"
      description="Clear, fair, and operational guidelines on how order cancellations are processed, refund eligibility conditions, and standard banking timelines for returning funds."
      quickHighlights={quickHighlights}
      tableOfContents={tableOfContents}
    >
      {/* Section 1 */}
      <section id="cancellation-window" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">01</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Order Cancellation Guidelines
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            At Toyvolt, we believe in giving our customers complete flexibility. You may cancel any order <strong>at zero penalty</strong> provided the cancellation request is made <strong>prior to the order being packed and dispatched</strong> from our warehouse.
          </p>
          <div className="p-4 bg-surface-container-lowest border-2 border-on-surface rounded-lg space-y-1">
            <div className="font-title text-[14px] uppercase font-bold text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>100% Refund on Pre-Dispatch Cancellations</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              When an order is cancelled prior to dispatch, 100% of the transaction amount—including any applicable shipping fees—is promptly initiated for refund to your original payment source.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section id="how-to-cancel" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">02</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            How to Cancel an Order
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>You can cancel your order through either of the following two verified methods:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="bg-surface-container-lowest border-2 border-on-surface rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-[22px]">touch_app</span>
                <h3 className="font-title text-[15px] uppercase font-bold text-on-surface">
                  Method 1: Self-Service Portal
                </h3>
              </div>
              <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed">
                Log into your Toyvolt account, navigate to <Link to="/orders" className="text-primary underline font-bold">My Orders</Link>, locate your pending order, and click the <strong>&quot;Cancel Order&quot;</strong> button. The system will atomically release the reserved inventory and trigger an automatic refund.
              </p>
            </div>

            <div className="bg-surface-container-lowest border-2 border-on-surface rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#FF7626] text-[22px]">mail</span>
                <h3 className="font-title text-[15px] uppercase font-bold text-on-surface">
                  Method 2: Support Email
                </h3>
              </div>
              <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed">
                Send an email from your registered email address to <a href={`mailto:${BRAND_CONFIG.contact.email}`} className="text-primary underline font-bold">{BRAND_CONFIG.contact.email}</a> with the Subject line <code>Cancellation Request - [Order Number]</code>. Our team will verify and process the cancellation within operational hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section id="post-dispatch" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">03</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Orders Already Dispatched in Transit
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            Once an order is handed over to our courier partner and an active Air Waybill (AWB) is assigned, the shipment <strong>cannot be cancelled mid-transit</strong> because the parcel is within the automated courier sorting network.
          </p>
          <p>
            <strong>What you should do:</strong> Please allow the parcel to arrive. When the delivery executive arrives, you may either:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Refuse acceptance of the parcel, in which case it will be returned to origin (RTO) and processed for refund upon receipt at our warehouse; OR</li>
            <li>Accept the package and, if it meets the criteria for return, submit a return request under our <Link to="/return-and-exchange" className="text-primary underline font-bold">Return and Exchange Policy</Link>.</li>
          </ul>
        </div>
      </section>

      {/* Section 4 */}
      <section id="refund-eligibility" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">04</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Refund Eligibility Scenarios
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>You are eligible for a full or partial refund under the following operational circumstances:</p>
          <div className="space-y-2">
            <div className="p-3 bg-surface-container-lowest border-2 border-on-surface rounded-lg">
              <strong className="text-on-surface block mb-0.5">1. Pre-Dispatch Cancellation:</strong>
              <span className="font-body-sm text-[13px] text-on-surface-variant">100% refund of the product price and shipping fees.</span>
            </div>
            <div className="p-3 bg-surface-container-lowest border-2 border-on-surface rounded-lg">
              <strong className="text-on-surface block mb-0.5">2. Unserviceable Delivery PIN Code:</strong>
              <span className="font-body-sm text-[13px] text-on-surface-variant">If our courier networks cannot service your delivery address, the order will be cancelled by our team with a 100% refund.</span>
            </div>
            <div className="p-3 bg-surface-container-lowest border-2 border-on-surface rounded-lg">
              <strong className="text-on-surface block mb-0.5">3. Stock Discrepancy or Inventory Exhaustion:</strong>
              <span className="font-body-sm text-[13px] text-on-surface-variant">In the rare event that an item is found defective prior to packing or out of stock, 100% of your payment is refunded immediately.</span>
            </div>
            <div className="p-3 bg-surface-container-lowest border-2 border-on-surface rounded-lg">
              <strong className="text-on-surface block mb-0.5">4. Approved Return for Transit Damage or Manufacturing Defect:</strong>
              <span className="font-body-sm text-[13px] text-on-surface-variant">If replacement units or components are unavailable, an approved return receives a 100% refund.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 */}
      <section id="payment-failures" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">05</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Payment Failures &amp; Duplicate Debits
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            During online checkout, bank server latency or network drops may occasionally cause your bank account to be debited while the Toyvolt checkout screen displays an error or timeout.
          </p>
          <div className="p-4 bg-surface-container-lowest border-2 border-on-surface rounded-lg space-y-1.5">
            <h3 className="font-title text-[14px] uppercase font-bold text-on-surface">
              How Razorpay &amp; Bank Reversals Work
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              When this occurs, the payment is held in escrow by the banking system. The payment gateway (Razorpay) automatically initiates a reconciliation. If the order is not confirmed within our system, the amount is automatically released back to your bank account within <strong>3 to 5 business days</strong>.
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              If your bank account was debited twice for a single order, please email <a href={`mailto:${BRAND_CONFIG.contact.email}`} className="text-primary underline font-bold">{BRAND_CONFIG.contact.email}</a> with your payment transaction IDs. We will immediately confirm the duplicate charge with Razorpay and issue a refund for the duplicate transaction.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6 */}
      <section id="refund-timeline" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">06</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Refund Processing Timelines &amp; Modes
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            Toyvolt adheres to transparent, verified operational banking schedules:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-[13px] border-2 border-on-surface bg-surface-container-lowest">
              <thead className="bg-[#FFF3DF] border-b-2 border-on-surface font-title uppercase text-[12px]">
                <tr>
                  <th className="p-3 border-r border-on-surface">Payment Method</th>
                  <th className="p-3 border-r border-on-surface">Initiation Window</th>
                  <th className="p-3">Bank Reflection Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-surface/20">
                <tr>
                  <td className="p-3 font-bold border-r border-on-surface">UPI (GPay / PhonePe / Paytm / BHIM)</td>
                  <td className="p-3 border-r border-on-surface">Within 24–48 Business Hours</td>
                  <td className="p-3 font-bold text-primary">2 – 4 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold border-r border-on-surface">Net Banking (All Indian Banks)</td>
                  <td className="p-3 border-r border-on-surface">Within 24–48 Business Hours</td>
                  <td className="p-3 font-bold text-primary">3 – 5 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold border-r border-on-surface">Debit Cards / Credit Cards</td>
                  <td className="p-3 border-r border-on-surface">Within 24–48 Business Hours</td>
                  <td className="p-3 font-bold text-primary">5 – 7 Business Days (Dependent on issuing bank)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold border-r border-on-surface">Digital Wallets (Razorpay supported)</td>
                  <td className="p-3 border-r border-on-surface">Within 24–48 Business Hours</td>
                  <td className="p-3 font-bold text-primary">2 – 3 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="font-body-sm text-[12px] text-on-surface-variant">
            <strong>Original Payment Source Only:</strong> In accordance with RBI security mandates and anti-money-laundering guidelines, refunds can only be routed back to the exact bank account, UPI ID, or card originally used to make the purchase. We do not provide cash or third-party bank refunds.
          </p>
        </div>
      </section>

      {/* Section 7 */}
      <section id="coupon-adjustments" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">07</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Discounts, Coupons &amp; Partial Cancellations
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            If a promotional coupon code was applied to your order (such as <code>WELCOME100</code>, <code>SPEED200</code>, or <code>DRIFT10</code>):
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Full Order Cancellation:</strong> The actual net monetary amount charged to your card or UPI account will be refunded in full. The coupon code’s usage count will be reinstated for your account where applicable.</li>
            <li><strong>Partial Cancellation:</strong> If one item in a multi-item order is cancelled and the remaining order subtotal drops below the minimum qualifying order threshold for that coupon, the discount is prorated accordingly.</li>
          </ul>
        </div>
      </section>

      {/* Section 8 */}
      <section id="how-to-request-refund" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">08</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            How to Submit a Refund Request
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>To request a refund or inquire about the status of an ongoing reversal:</p>
          <div className="p-4 bg-surface-container-lowest border-2 border-on-surface rounded-lg space-y-2 font-body-sm">
            <div><strong>Email Address:</strong> <a href={`mailto:${BRAND_CONFIG.contact.email}`} className="text-primary underline font-bold">{BRAND_CONFIG.contact.email}</a></div>
            <div><strong>Email Subject Format:</strong> <code>Refund Request - [Order Number]</code></div>
            <div><strong>Information to Include:</strong> Order number, registered email, date of order, and reason for refund request.</div>
            <div><strong>Desk Hours:</strong> {BRAND_CONFIG.contact.hours}</div>
          </div>
          <p className="font-body-sm text-[13px] text-on-surface-variant">
            Our support desk will acknowledge your inquiry within 24 hours and provide you with the Razorpay refund tracking identifier.
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
};

export default CancellationRefundPage;
