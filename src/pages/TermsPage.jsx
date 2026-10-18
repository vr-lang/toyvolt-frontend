import React from 'react';
import { Link } from 'react-router-dom';
import { LegalPageLayout } from '../components/common/LegalPageLayout';
import { BRAND_CONFIG } from '../config/brandConfig';

export const TermsPage = () => {
  const tableOfContents = [
    { id: 'store-identity', title: 'Store Identity & Scope of Website' },
    { id: 'user-accounts', title: 'User Accounts, Eligibility & Security' },
    { id: 'products-pricing', title: 'Product Details, Specifications & Pricing' },
    { id: 'order-placement', title: 'Order Placement, Acceptance & Inventory' },
    { id: 'payment-processing', title: 'Payment Processing & Razorpay Terms' },
    { id: 'shipping-delivery', title: 'Shipping, Delivery & Risk of Loss' },
    { id: 'cancellation-refunds', title: 'Cancellations, Returns & Refunds' },
    { id: 'customer-responsibilities', title: 'Safety Guidelines & Customer Responsibilities' },
    { id: 'intellectual-property', title: 'Intellectual Property Rights' },
    { id: 'liability-disclaimers', title: 'Limitation of Liability & Warranty Disclaimers' },
    { id: 'governing-law', title: 'Governing Law, Jurisdiction & Dispute Resolution' },
    { id: 'grievance-contact', title: 'Grievance Officer & Contact Information' }
  ];

  const quickHighlights = [
    {
      icon: 'storefront',
      title: 'Store Identity',
      description: 'Online direct-to-consumer toy retailer operating in India under the Toyvolt brand.'
    },
    {
      icon: 'currency_rupee',
      title: 'Transparent Pricing',
      description: 'All prices in INR (₹) with applicable GST included. No surprise fees at checkout.'
    },
    {
      icon: 'lock',
      title: 'Secure Payments',
      description: 'End-to-end encrypted transactions processed directly via Razorpay Gateway.'
    },
    {
      icon: 'verified',
      title: 'Consumer Rights',
      description: 'Compliant with Consumer Protection (E-Commerce) Rules, 2020 and Indian laws.'
    }
  ];

  return (
    <LegalPageLayout
      title="Terms and Conditions of Use"
      badge="CUSTOMER AGREEMENT"
      lastUpdated="October 18, 2026"
      effectiveDate="October 18, 2026"
      description="These Terms and Conditions govern your access to and use of the Toyvolt online storefront, catalog, user accounts, and purchase of remote-control products. By using our website or placing an order, you agree to these terms."
      quickHighlights={quickHighlights}
      tableOfContents={tableOfContents}
    >
      {/* Clause 1 */}
      <section id="store-identity" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">01</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Store Identity &amp; Scope of Website
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            Welcome to <strong>{BRAND_CONFIG.name}</strong> (&quot;Toyvolt&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). Toyvolt is an online direct-to-consumer e-commerce brand operating in India, specializing in high-performance remote-control (RC) drift cars, kinetic stunt vehicles, and hobby toys.
          </p>
          <p>
            These Terms and Conditions (&quot;Terms&quot;), together with our <Link to="/privacy-policy" className="text-primary underline font-bold">Privacy Policy</Link>, <Link to="/shipping-policy" className="text-primary underline font-bold">Shipping and Delivery Policy</Link>, and <Link to="/cancellation-and-refund" className="text-primary underline font-bold">Cancellation and Refund Policy</Link>, constitute a legally binding agreement between you (&quot;Customer&quot;, &quot;User&quot;, or &quot;You&quot;) and Toyvolt.
          </p>
          <p>
            By browsing, accessing, registering an account on, or purchasing items through this website, you confirm that you have read, understood, and agreed to be bound by these Terms. If you do not agree to these Terms, please refrain from using our website or placing orders.
          </p>
        </div>
      </section>

      {/* Clause 2 */}
      <section id="user-accounts" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">02</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            User Accounts, Eligibility &amp; Security
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            <strong>Eligibility:</strong> You must be at least 18 years of age or possess legal capacity under the Indian Contract Act, 1872 to enter into a binding contract and place orders. If you are under 18, you may use the website only under the involvement and supervision of a parent or legal guardian.
          </p>
          <p>
            <strong>Account Verification &amp; Security:</strong> When registering, you agree to provide true, accurate, and current information, including your full legal name and a valid email address. We verify accounts via One-Time Password (OTP) verification. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
          </p>
          <p>
            <strong>Suspicious Activity:</strong> Toyvolt reserves the right to suspend or terminate accounts, cancel unverified orders, or refuse service if false contact details, unauthorized payment attempts, or fraudulent activities are detected.
          </p>
        </div>
      </section>

      {/* Clause 3 */}
      <section id="products-pricing" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">03</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Product Details, Specifications &amp; Pricing
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            <strong>Accurate Product Descriptions:</strong> We make every reasonable effort to accurately present the technical specifications, physical dimensions, battery capacity, remote frequency, and imagery of our products, such as the 1:16 scale 4WD RC drift car (Gooyo GY-015SS / Toyvolt Apex-1 model, selling price ₹1,799). However, slight visual variances in screen colors, packaging designs, or minor factory revisions may occur.
          </p>
          <p>
            <strong>Pricing &amp; Currency:</strong> All prices displayed on Toyvolt are denominated in <strong>Indian Rupees (INR, ₹)</strong>. Product prices are inclusive of applicable Goods and Services Tax (GST) unless explicitly indicated otherwise.
          </p>
          <p>
            <strong>Price Adjustments &amp; Errors:</strong> While we strive for absolute accuracy, inadvertent technical errors in listed prices may occasionally occur. If a product is inadvertently listed at an incorrect price due to a system glitch, Toyvolt reserves the right to cancel the order prior to dispatch and issue a 100% full refund to the customer.
          </p>
        </div>
      </section>

      {/* Clause 4 */}
      <section id="order-placement" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">04</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Order Placement, Acceptance &amp; Inventory Reservation
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            <strong>Offer to Purchase:</strong> Your placement of an order on our checkout page constitutes an offer to purchase the selected items. An order confirmation is issued electronically via email and displayed on your screen once payment is authorized.
          </p>
          <p>
            <strong>Atomic Inventory Reservation:</strong> Toyvolt utilizes atomic inventory reservation. When you proceed to checkout, available units are temporarily held. If payment is completed successfully, the inventory is definitively reserved for your order. If payment fails or is aborted, the reserved units are automatically restored to available stock.
          </p>
          <p>
            <strong>Order Acceptance:</strong> Acceptance of your order and formation of the sale contract occurs when the product is packed and dispatched from our warehouse, accompanied by a valid courier Air Waybill (AWB) tracking number. Toyvolt reserves the right to decline or cancel an order if the delivery PIN code is unserviceable by our courier partners or in case of force majeure.
          </p>
        </div>
      </section>

      {/* Clause 5 */}
      <section id="payment-processing" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">05</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Payment Processing &amp; Razorpay Terms
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            <strong>Authorized Payment Gateway:</strong> Online payments on Toyvolt are processed through <strong>Razorpay</strong>, an authorized, RBI-regulated payment aggregator compliant with PCI-DSS Level 1 standards.
          </p>
          <p>
            <strong>Supported Payment Modes:</strong> We support payments via:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Unified Payments Interface (UPI: Google Pay, PhonePe, Paytm, BHIM, Cred, and all UPI apps)</li>
            <li>Debit Cards and Credit Cards (Visa, MasterCard, RuPay, American Express)</li>
            <li>Net Banking across all major scheduled Indian commercial banks</li>
            <li>Authorized digital wallets supported by Razorpay</li>
          </ul>
          <p>
            <strong>No Storage of Sensitive Card Details:</strong> Toyvolt does not collect, access, or store your complete card numbers, CVVs, expiry dates, or banking passwords on our servers. All sensitive cardholder data is securely transmitted directly to Razorpay using 256-bit SSL encryption.
          </p>
          <p>
            <strong>Failed Transactions &amp; Bank Debits:</strong> In the event that your bank account or card is debited but the order is not confirmed on Toyvolt (due to network drops or gateway timeouts), the debited funds are held by the payment gateway or bank escrow. Such amounts are automatically refunded to your original source account within 3 to 5 banking days under standard RBI reversal guidelines.
          </p>
        </div>
      </section>

      {/* Clause 6 */}
      <section id="shipping-delivery" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">06</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Shipping, Delivery &amp; Risk of Loss
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            <strong>Delivery Coverage:</strong> Toyvolt provides pan-India shipping across serviceable postal PIN codes through integrated third-party logistics partners (Shiprocket, Delhivery, Bluedart, etc.).
          </p>
          <p>
            <strong>Shipping Fee Calculation:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Orders with a subtotal of <strong>₹{BRAND_CONFIG.shipping.freeShippingThresholdRupees} or more</strong>: <strong>FREE SHIPPING (₹0)</strong>.</li>
            <li>Orders below <strong>₹{BRAND_CONFIG.shipping.freeShippingThresholdRupees}</strong>: Flat standard shipping fee of <strong>₹{BRAND_CONFIG.shipping.standardShippingFeeRupees}</strong>.</li>
          </ul>
          <p>
            <strong>Dispatch &amp; Delivery Timelines:</strong> Verified orders are typically dispatched within <strong>{BRAND_CONFIG.shipping.dispatchTimeline}</strong>. Estimated delivery takes <strong>{BRAND_CONFIG.shipping.deliveryTimeline}</strong> depending on your destination city and regional courier logistics. Full details are set forth in our <Link to="/shipping-policy" className="text-primary underline font-bold">Shipping and Delivery Policy</Link>.
          </p>
          <p>
            <strong>Risk of Loss:</strong> Title and risk of loss pass to the customer upon delivery by the courier partner at the designated address provided by the customer during checkout.
          </p>
        </div>
      </section>

      {/* Clause 7 */}
      <section id="cancellation-refunds" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">07</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Cancellations, Returns &amp; Refunds
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            <strong>Order Cancellations:</strong> You may cancel an order at zero fee prior to dispatch and courier handover directly via your <Link to="/orders" className="text-primary underline font-bold">My Orders</Link> dashboard or by writing to <a href={`mailto:${BRAND_CONFIG.contact.email}`} className="text-primary underline font-bold">{BRAND_CONFIG.contact.email}</a>. Once handed over to the courier, orders cannot be cancelled in transit.
          </p>
          <p>
            <strong>Damaged, Defective or Incorrect Items:</strong> If your product arrives physically damaged in transit (report within 48 hours) or experiences a verifiable manufacturing defect within 7 days of delivery, Toyvolt arranges a free replacement or full refund in accordance with our <Link to="/return-and-exchange" className="text-primary underline font-bold">Return and Exchange Policy</Link>.
          </p>
          <p>
            <strong>Refund Processing Timelines:</strong> Approved refunds are credited directly back to the original payment method (bank account, UPI, or card) within <strong>{BRAND_CONFIG.cancellation.refundDays}</strong>. Review our complete <Link to="/cancellation-and-refund" className="text-primary underline font-bold">Cancellation and Refund Policy</Link> for step-by-step procedures.
          </p>
        </div>
      </section>

      {/* Clause 8 */}
      <section id="customer-responsibilities" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">08</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Safety Guidelines &amp; Customer Responsibilities
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            Remote-control toys involve high-speed kinetic moving parts and rechargeable lithium-chemistry batteries. Customers and users must observe the following safety instructions:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Age Suitability:</strong> High-speed RC drift vehicles are recommended for ages 8+ years. Adult supervision is required for young drivers.</li>
            <li><strong>Choking Hazard Warning:</strong> Products contain small modular screws, drift tires, and components. Not suitable for children under 3 years.</li>
            <li><strong>Battery Charging Safety:</strong> Charge rechargeable batteries solely using the supplied USB balanced charging cable. Do not leave charging batteries unattended or charge on flammable surfaces. Disconnect immediately upon full charge.</li>
            <li><strong>Operating Environment:</strong> Do not operate high-speed RC cars on public roadways, busy sidewalks, near pets, or submerge in water (unless explicitly designated waterproof).</li>
          </ul>
        </div>
      </section>

      {/* Clause 9 */}
      <section id="intellectual-property" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">09</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Intellectual Property Rights
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            All content published on this website—including the Toyvolt brand name, trademarks, logos, page layouts, graphic designs, product photography, icons, and software code—is the property of Toyvolt or its licensors and is protected by applicable Indian and international copyright and trademark laws.
          </p>
          <p>
            You are granted a limited, non-exclusive, non-transferable license to access the website for personal, non-commercial shopping purposes. Any unauthorized reproduction, scraping, modification, or commercial exploitation is strictly prohibited without prior written consent.
          </p>
        </div>
      </section>

      {/* Clause 10 */}
      <section id="liability-disclaimers" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">10</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Limitation of Liability &amp; Warranty Disclaimers
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            <strong>Exclusions:</strong> To the maximum extent permitted by applicable Indian law, Toyvolt shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Customer crashes, collisions, or impact damage caused during vehicle driving;</li>
            <li>Improper charging using unapproved third-party fast chargers;</li>
            <li>Unauthorized tampering, soldering, or vehicle modifications;</li>
            <li>Temporary website downtime or network failures beyond our control.</li>
          </ul>
          <p>
            <strong>Maximum Liability Cap:</strong> In all circumstances, Toyvolt’s aggregate liability to you for any claim arising out of or related to the purchase of any product shall not exceed the actual purchase price paid by you for that specific item.
          </p>
        </div>
      </section>

      {/* Clause 11 */}
      <section id="governing-law" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">11</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Governing Law, Jurisdiction &amp; Dispute Resolution
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            These Terms and any non-contractual obligations arising out of or in connection with them shall be governed by and construed in accordance with the <strong>laws of the Republic of India</strong>.
          </p>
          <p>
            Any dispute, controversy, or claim arising out of or relating to these Terms or purchases made on Toyvolt shall be subject to the exclusive jurisdiction of the competent courts of law in India.
          </p>
          <p>
            Customers are encouraged to first contact our customer support desk to resolve any disputes amicably before initiating formal legal proceedings.
          </p>
        </div>
      </section>

      {/* Clause 12 */}
      <section id="grievance-contact" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">12</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Grievance Officer &amp; Contact Information
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            In accordance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, the details of our Grievance Redressal Officer are as follows:
          </p>
          <div className="p-4 bg-surface-container-lowest border-2 border-on-surface rounded-lg space-y-1 text-on-surface font-body-sm">
            <div><strong>Designation:</strong> {BRAND_CONFIG.contact.grievanceOfficer.designation}</div>
            <div><strong>Organization:</strong> {BRAND_CONFIG.name} ({BRAND_CONFIG.legalEntityName})</div>
            <div><strong>Email:</strong> <a href={`mailto:${BRAND_CONFIG.contact.grievanceOfficer.email}`} className="text-primary underline font-bold">{BRAND_CONFIG.contact.grievanceOfficer.email}</a></div>
            <div><strong>Support Hours:</strong> {BRAND_CONFIG.contact.hours}</div>
            <div><strong>Response Time:</strong> {BRAND_CONFIG.contact.grievanceOfficer.responseTime}</div>
          </div>
          <p>
            For regular order support, please reach out via our <Link to="/contact" className="text-primary underline font-bold">Contact Us page</Link> or email <a href={`mailto:${BRAND_CONFIG.contact.email}`} className="text-primary underline font-bold">{BRAND_CONFIG.contact.email}</a>.
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
};

export default TermsPage;
