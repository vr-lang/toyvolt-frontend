import React from 'react';
import { Link } from 'react-router-dom';
import { LegalPageLayout } from '../components/common/LegalPageLayout';
import { BRAND_CONFIG } from '../config/brandConfig';

export const PrivacyPolicyPage = () => {
  const tableOfContents = [
    { id: 'overview', title: 'Commitment & Scope' },
    { id: 'data-collected', title: 'Information We Collect' },
    { id: 'how-we-use-data', title: 'How We Use Your Information' },
    { id: 'payment-security', title: 'Payment Processing & Razorpay Security' },
    { id: 'shipping-sharing', title: 'Logistics & Third-Party Service Providers' },
    { id: 'cookies-storage', title: 'Cookies & Local Storage Technologies' },
    { id: 'data-security', title: 'Data Security & Storage Practices' },
    { id: 'retention-period', title: 'Data Retention' },
    { id: 'customer-rights', title: 'Your Rights & Data Choices' },
    { id: 'children-privacy', title: 'Children’s Privacy Protection' },
    { id: 'updates-changes', title: 'Policy Updates & Amendments' },
    { id: 'grievance-officer', title: 'Grievance Officer & Contact Details' }
  ];

  const quickHighlights = [
    {
      icon: 'verified_user',
      title: 'Zero Card Storage',
      description: 'Your CVV and card numbers are never stored on Toyvolt servers. Managed by Razorpay.'
    },
    {
      icon: 'local_shipping',
      title: 'Logistics Only Sharing',
      description: 'Shipping address and phone are shared strictly with couriers for package delivery.'
    },
    {
      icon: 'lock',
      title: 'Bcrypt Encryption',
      description: 'Customer passwords are cryptographic one-way hashes. Never visible in plaintext.'
    },
    {
      icon: 'manage_accounts',
      title: 'User Control',
      description: 'Request account review or full data deletion anytime via support@toyvolt.com.'
    }
  ];

  return (
    <LegalPageLayout
      title="Privacy Policy"
      badge="DATA PROTECTION"
      lastUpdated="October 18, 2026"
      effectiveDate="October 18, 2026"
      description="This Privacy Policy describes how Toyvolt collects, uses, protects, and handles your personal data when you visit our website, register an account, or order remote-control products."
      quickHighlights={quickHighlights}
      tableOfContents={tableOfContents}
    >
      {/* Section 1 */}
      <section id="overview" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">01</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Commitment &amp; Scope
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            <strong>{BRAND_CONFIG.name}</strong> (&quot;Toyvolt&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting the privacy, confidentiality, and security of your personal data. This policy applies to all visitors, registered customers, and buyers accessing our online storefront in India.
          </p>
          <p>
            We process personal data in compliance with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (SPDI Rules), the Consumer Protection (E-Commerce) Rules, 2020, and the Digital Personal Data Protection Act, 2023 (DPDP Act).
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section id="data-collected" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">02</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Information We Collect
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            We only collect information necessary to provide an authentic, efficient, and reliable e-commerce service:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Account &amp; Profile Details:</strong> Full name, email address, and encrypted password hash (created using salted bcrypt algorithm). We do not store plaintext passwords.
            </li>
            <li>
              <strong>Order &amp; Shipping Details:</strong> Recipient name, active 10-digit mobile contact number, complete delivery address (flat/house number, street address, landmark, city, state, and 6-digit postal PIN code).
            </li>
            <li>
              <strong>Transaction &amp; Order History:</strong> Order numbers, product SKUs purchased, quantities, pricing breakdown, applied coupon codes, order timestamps, and Razorpay transaction identifier tokens.
            </li>
            <li>
              <strong>Technical &amp; Log Data:</strong> Standard server logs including IP address, browser type and version, operating system, device identifiers, and request timestamps to monitor system performance and prevent fraud.
            </li>
            <li>
              <strong>Customer Communications:</strong> Messages, support inquiries, order feedback, and technical questions submitted via our <Link to="/contact" className="text-primary underline font-bold">Contact Form</Link> or official email.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 3 */}
      <section id="how-we-use-data" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">03</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            How We Use Your Information
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>We process your personal information for lawful business purposes, including:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Fulfillment &amp; Delivery:</strong> Processing your cart, holding atomic inventory, packing products, generating invoices, and coordinating courier handover.</li>
            <li><strong>Transactional Communications:</strong> Sending order confirmations, email verification OTPs, dispatch alerts with live AWB tracking links, and delivery receipts.</li>
            <li><strong>Customer Service:</strong> Responding to warranty inquiries, resolving product pairing questions, and processing cancellations, returns, or refunds.</li>
            <li><strong>Fraud Prevention &amp; Security:</strong> Verifying legitimate payment transactions, safeguarding against duplicate card submissions, and defending against automated bot abuse.</li>
            <li><strong>Legal &amp; Tax Compliance:</strong> Maintaining accounting and tax records in accordance with Indian GST regulations and corporate recordkeeping standards.</li>
          </ul>
          <p>
            <strong>No Unsolicited Selling:</strong> Toyvolt does not sell, rent, or trade your personal data to third-party data brokers, marketers, or telemarketers.
          </p>
        </div>
      </section>

      {/* Section 4 */}
      <section id="payment-security" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">04</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Payment Processing &amp; Razorpay Security
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            Toyvolt partners with <strong>Razorpay Software Private Limited</strong> to provide secure, seamless payment checkout for our customers.
          </p>
          <div className="p-4 bg-surface-container-lowest border-2 border-on-surface rounded-lg space-y-2">
            <div className="flex items-center gap-2 font-title text-[15px] uppercase font-bold text-on-surface">
              <span className="material-symbols-outlined text-primary text-[20px]">security</span>
              <span>PCI-DSS Level 1 Certified Infrastructure</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              When you pay using UPI, NetBanking, Credit Card, Debit Card, or Wallet, your payment credentials are transmitted directly to Razorpay over an encrypted 256-bit TLS connection.
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant font-bold">
              Toyvolt NEVER receives, sees, or stores your Credit/Debit Card CVV, 16-digit Card Number, NetBanking Passwords, or UPI PINs.
            </p>
          </div>
          <p>
            Upon transaction completion, Razorpay returns an encrypted order ID and payment token to Toyvolt solely to record payment verification. For details on Razorpay’s data practices, please consult the Razorpay Privacy Policy at{' '}
            <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary underline font-bold">
              razorpay.com/privacy
            </a>.
          </p>
        </div>
      </section>

      {/* Section 5 */}
      <section id="shipping-sharing" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">05</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Logistics &amp; Third-Party Service Providers
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            To fulfill your orders and provide essential digital storefront services, we share necessary information with trusted third-party partners under strict confidentiality agreements:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Couriers &amp; Logistics Aggregators (Shiprocket / Delhivery / Bluedart):</strong> We share your recipient name, complete postal address, and contact telephone number solely to enable parcel dispatch, transportation, delivery verification, and SMS delivery alerts.
            </li>
            <li>
              <strong>Transactional Email Services (Resend):</strong> We share your email address solely to transmit automated order receipts, account activation OTPs, and password recovery instructions.
            </li>
            <li>
              <strong>Cloud &amp; Media Hosting:</strong> Encrypted databases and product imagery are hosted on reputable cloud platforms (MongoDB Atlas, Cloudinary) with strict access controls.
            </li>
            <li>
              <strong>Legal Authorities:</strong> We may disclose information if required by court order, law enforcement investigation, or applicable Indian statute.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 6 */}
      <section id="cookies-storage" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">06</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Cookies &amp; Local Storage Technologies
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            Toyvolt uses browser Local Storage and essential session cookies to ensure the website functions correctly. We do not use third-party cross-site advertising cookies. Here is our transparent inventory of local storage keys:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-[13px] border-2 border-on-surface bg-surface-container-lowest">
              <thead className="bg-[#FFF3DF] border-b-2 border-on-surface font-title uppercase text-[12px]">
                <tr>
                  <th className="p-2.5 border-r border-on-surface">Storage Key</th>
                  <th className="p-2.5 border-r border-on-surface">Type</th>
                  <th className="p-2.5">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-surface/20">
                <tr>
                  <td className="p-2.5 font-mono font-bold text-primary border-r border-on-surface">toyvolt_access_token</td>
                  <td className="p-2.5 border-r border-on-surface">Essential Session</td>
                  <td className="p-2.5">Stores the secure JWT authorization token for registered customer logins.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono font-bold text-primary border-r border-on-surface">toyvolt_cart_v1</td>
                  <td className="p-2.5 border-r border-on-surface">Functional</td>
                  <td className="p-2.5">Preserves selected RC cars and items in your shopping cart across page refreshes.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono font-bold text-primary border-r border-on-surface">toyvolt_applied_coupon_v1</td>
                  <td className="p-2.5 border-r border-on-surface">Functional</td>
                  <td className="p-2.5">Remembers validated discount coupon codes (e.g. WELCOME100) during checkout.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono font-bold text-primary border-r border-on-surface">toyvolt_saved_pincode_v1</td>
                  <td className="p-2.5 border-r border-on-surface">Functional</td>
                  <td className="p-2.5">Saves your verified 6-digit postal PIN code for instant checkout address pre-fill.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono font-bold text-primary border-r border-on-surface">toyvolt_wishlist_ids_v1</td>
                  <td className="p-2.5 border-r border-on-surface">Functional</td>
                  <td className="p-2.5">Retains saved product bookmark identifiers in your browser.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="font-body-sm text-[12px] text-on-surface-variant">
            You can clear local storage or cookies at any time via your browser settings. Clearing storage will reset your cart items and require signing in again.
          </p>
        </div>
      </section>

      {/* Section 7 */}
      <section id="data-security" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">07</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Data Security &amp; Storage Practices
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            We deploy multiple layers of physical, electronic, and procedural safeguards:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Transport Encryption:</strong> 100% of web traffic is transmitted via HTTPS with TLS 1.3 encryption.</li>
            <li><strong>Password Protection:</strong> Passwords are protected using salted one-way hashing (bcrypt, 10 rounds).</li>
            <li><strong>Token Security:</strong> Session tokens feature short expiration windows (15 minutes) and are validated on every authenticated API request.</li>
            <li><strong>Access Control:</strong> Administrative access to order records is restricted to authorized personnel via role-based authentication.</li>
          </ul>
        </div>
      </section>

      {/* Section 8 */}
      <section id="retention-period" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">08</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Data Retention
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            We retain personal data for as long as your account remains active or as needed to provide you with order fulfillment, warranty services, and order tracking history.
          </p>
          <p>
            Transactional invoices, payment tokens, and order details are retained for statutory periods mandated under Indian Goods and Services Tax (GST) rules, Companies Act, and consumer dispute resolution guidelines.
          </p>
        </div>
      </section>

      {/* Section 9 */}
      <section id="customer-rights" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">09</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Your Rights &amp; Data Choices
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>Under applicable Indian data protection frameworks, you have the following rights:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Right to Access &amp; Review:</strong> You can review your profile information and view your full order history at any time by logging into your account.</li>
            <li><strong>Right to Rectification:</strong> If any personal details (such as your address or name) are incorrect, you may update them or email our support desk.</li>
            <li><strong>Right to Account &amp; Data Deletion:</strong> You may request permanent deletion of your account and associated personal data by emailing <a href={`mailto:${BRAND_CONFIG.contact.email}`} className="text-primary underline font-bold">{BRAND_CONFIG.contact.email}</a>. We will process your request within 30 days, subject to mandatory tax retention obligations.</li>
            <li><strong>Opt-Out of Non-Essential Communications:</strong> You may unsubscribe from promotional announcements at any time while continuing to receive essential transactional emails (e.g. order receipts).</li>
          </ul>
        </div>
      </section>

      {/* Section 10 */}
      <section id="children-privacy" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">10</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Children’s Privacy Protection
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            Although Toyvolt sells products designed for children, youth, and families, online purchases on our website may only be completed by adults aged 18 or older.
          </p>
          <p>
            We do not knowingly collect personal information directly from children under 18 years of age without parental involvement. If you believe a child has provided us with personal information without parental consent, please contact us at <a href={`mailto:${BRAND_CONFIG.contact.email}`} className="text-primary underline font-bold">{BRAND_CONFIG.contact.email}</a> so we can delete the information promptly.
          </p>
        </div>
      </section>

      {/* Section 11 */}
      <section id="updates-changes" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">11</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Policy Updates &amp; Amendments
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            We may periodically update this Privacy Policy to reflect changes in our operational procedures, payment integrations, or relevant Indian legal requirements.
          </p>
          <p>
            When changes are made, the revised policy will be posted on this page with an updated &quot;Last Updated&quot; date. We encourage you to review this page periodically. Continued use of our website following any update signifies your acceptance of the revised terms.
          </p>
        </div>
      </section>

      {/* Section 12 */}
      <section id="grievance-officer" className="bg-[#FFF9F0] border-2 border-on-surface rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
        <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-on-surface">
          <span className="font-mono text-[14px] bg-primary text-white px-2.5 py-0.5 rounded font-bold">12</span>
          <h2 className="font-title text-[20px] sm:text-[24px] uppercase font-bold text-on-surface">
            Grievance Officer &amp; Contact Details
          </h2>
        </div>
        <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          <p>
            For any questions, concerns, or grievances regarding the processing of your personal data or this Privacy Policy, please contact our designated Grievance Officer:
          </p>
          <div className="p-4 bg-surface-container-lowest border-2 border-on-surface rounded-lg space-y-1 text-on-surface font-body-sm">
            <div><strong>Designation:</strong> {BRAND_CONFIG.contact.grievanceOfficer.designation}</div>
            <div><strong>Storefront Entity:</strong> {BRAND_CONFIG.name} ({BRAND_CONFIG.legalEntityName})</div>
            <div><strong>Email:</strong> <a href={`mailto:${BRAND_CONFIG.contact.grievanceOfficer.email}`} className="text-primary underline font-bold">{BRAND_CONFIG.contact.grievanceOfficer.email}</a></div>
            <div><strong>Operating Hours:</strong> {BRAND_CONFIG.contact.hours}</div>
            <div><strong>Response Standard:</strong> {BRAND_CONFIG.contact.grievanceOfficer.responseTime}</div>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
};

export default PrivacyPolicyPage;
