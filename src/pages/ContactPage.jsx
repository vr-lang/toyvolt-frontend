import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_CONFIG } from '../config/brandConfig';
import { api, getErrorMessage } from '../lib/api';

export const ContactPage = ({ product }) => {
  const productSlug = product?.slug || 'toyvolt-apex-1-rc-drift-car';

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Product & Technical Specifications',
    orderId: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'success' | 'backend_missing' | 'error'
  const [statusMessage, setStatusMessage] = useState('');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const MAX_MESSAGE_LENGTH = 1000;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your full name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address (e.g. name@example.com).';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message or inquiry.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a little more detail (at least 10 characters).';
    } else if (formData.message.length > MAX_MESSAGE_LENGTH) {
      newErrors.message = `Message must not exceed ${MAX_MESSAGE_LENGTH} characters.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear inline error on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage('');

    try {
      // Attempt backend submission to /contact
      // Notice: As per Toyvolt backend architecture, a dedicated contact endpoint is not yet implemented on Render.
      const response = await api.post('/contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        category: formData.category,
        orderId: formData.orderId.trim() || undefined,
        message: formData.message.trim()
      });

      if (response.status === 200 || response.status === 201) {
        setSubmitStatus('success');
        setStatusMessage('Your message has been sent successfully. Our team will review it shortly.');
        setFormData({
          name: '',
          email: '',
          category: 'Product & Technical Specifications',
          orderId: '',
          message: ''
        });
      } else {
        throw new Error('Unexpected server response');
      }
    } catch (err) {
      // If 404 or backend route missing, report honest integration status instead of simulating fake success
      if (err.response?.status === 404 || err.code === 'ERR_BAD_RESPONSE' || err.response?.status === 501) {
        setSubmitStatus('backend_missing');
        setStatusMessage(
          'Notice: Toyvolt’s backend server currently does not have an active /api/v1/contact endpoint deployed. Your message has been prepared for one-click transmission via email below.'
        );
      } else {
        setSubmitStatus('backend_missing');
        setStatusMessage(
          getErrorMessage(
            err,
            'Toyvolt’s backend contact endpoint is currently not deployed on Render. You can dispatch your inquiry directly via your email client below.'
          )
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-formatted mailto URL so customer's typed message is never lost
  const mailtoSubject = encodeURIComponent(
    `[Toyvolt Inquiry] ${formData.category}${formData.orderId ? ` (Order #${formData.orderId})` : ''}`
  );
  const mailtoBody = encodeURIComponent(
    `Hello Toyvolt Support Team,\n\nName: ${formData.name || 'Customer'}\nEmail: ${
      formData.email || 'N/A'
    }\nCategory: ${formData.category}\nOrder ID: ${
      formData.orderId || 'N/A'
    }\n\nMessage:\n${formData.message || 'Please assist with my inquiry.'}\n`
  );
  const fallbackMailtoHref = `mailto:${BRAND_CONFIG.contact.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

  const faqs = [
    {
      question: 'How can I track my order?',
      answer:
        'Once your order has been placed and confirmed, you can track its progress directly on your My Orders page. When an order is dispatched via courier (Shiprocket / Delhivery), your live AWB tracking number will be displayed alongside delivery milestones.'
    },
    {
      question: 'How can I contact Toyvolt about a product or technical question?',
      answer:
        `You can email our customer support team directly at ${BRAND_CONFIG.contact.email} or use the contact form on this page by selecting "Product & Technical Specifications". We can answer questions regarding battery care, spare parts, remote pairing, and scale dimensions.`
    },
    {
      question: 'What should I do if my order arrives damaged?',
      answer:
        `If your order arrives with physical shipping damage or a missing part, please photograph the package and product upon delivery and notify our team at ${BRAND_CONFIG.contact.email} within 48 hours. Please include your Order ID so our team can resolve the issue swiftly.`
    },
    {
      question: 'How can I check delivery availability and shipping fees for my area?',
      answer:
        `Toyvolt provides instant shipping calculations across India. Orders of ₹${BRAND_CONFIG.shipping.freeShippingThresholdRupees} and above qualify for free standard shipping. Orders below ₹${BRAND_CONFIG.shipping.freeShippingThresholdRupees} have a flat ₹${BRAND_CONFIG.shipping.standardShippingFeeRupees} shipping fee. You can also test your 6-digit delivery PIN code directly on our homepage.`
    }
  ];

  return (
    <div className="w-full flex flex-col bg-surface text-on-surface">
      {/* =========================================================================
          SECTION A: CONTACT HERO
          ========================================================================= */}
      <section className="w-full bg-[#FFF9F0] border-b-2 border-on-surface py-12 sm:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FFF3DF] border-2 border-on-surface rounded-2xl shadow-[8px_8px_0px_#171717] p-6 sm:p-10 lg:p-12 relative overflow-hidden">
            {/* Top Badge & Stamp */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-tertiary-fixed text-on-tertiary-fixed border-2 border-on-surface rounded-lg shadow-[3px_3px_0px_#171717]">
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span className="font-label-md text-label-md uppercase font-bold tracking-wider">
                  LET'S TALK
                </span>
              </div>

              {/* Decorative Stamp */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-lowest border-2 border-on-surface rounded-xl shadow-[3px_3px_0px_#171717] transform rotate-1 sm:rotate-2">
                <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface">
                  {BRAND_CONFIG.contact.hours}
                </span>
              </div>
            </div>

            {/* Hero Heading */}
            <h1 className="font-display text-[32px] sm:text-[46px] lg:text-[54px] uppercase text-on-surface leading-[1.08] max-w-4xl">
              WE'RE HERE TO HELP YOU{' '}
              <span className="inline-block bg-[#1769FF] text-white px-3 py-0.5 mx-1 border-2 border-on-surface shadow-[4px_4px_0px_#171717] transform -rotate-1">
                PLAY MORE.
              </span>
            </h1>

            {/* Intro Copy */}
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4 leading-relaxed">
              Have a question about the Apex-1 RC Drift Car, need help with an existing order, or
              want to know more about Toyvolt? Reach out to our customer support team below.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: CONTACT METHOD CARDS
          ========================================================================= */}
      <section className="w-full py-12 sm:py-16 bg-surface">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Email Support */}
            <div className="bg-surface-container-lowest border-2 border-on-surface rounded-xl p-6 shadow-[5px_5px_0px_#171717] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-primary text-white border-2 border-on-surface flex items-center justify-center mb-4 shadow-[2px_2px_0px_#171717]">
                  <span className="material-symbols-outlined text-[24px]">mail</span>
                </div>
                <h3 className="font-title text-[18px] uppercase font-bold text-on-surface mb-2">
                  EMAIL US
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-4">
                  Drop our support team a direct note for order inquiries, technical assistance, or warranty claims.
                </p>
              </div>
              <a
                href={`mailto:${BRAND_CONFIG.contact.email}`}
                className="w-full py-2.5 bg-[#FFF3DF] text-primary font-label-sm text-[12px] uppercase font-bold border-2 border-on-surface rounded-lg shadow-[2px_2px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
              >
                <span className="truncate">{BRAND_CONFIG.contact.email}</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>

            {/* Card 2: Operating Hours & Direct Message */}
            <div className="bg-surface-container-lowest border-2 border-on-surface rounded-xl p-6 shadow-[5px_5px_0px_#171717] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#FF7626] text-white border-2 border-on-surface flex items-center justify-center mb-4 shadow-[2px_2px_0px_#171717]">
                  <span className="material-symbols-outlined text-[24px]">schedule</span>
                </div>
                <h3 className="font-title text-[18px] uppercase font-bold text-on-surface mb-2">
                  TIMINGS
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-4">
                  {BRAND_CONFIG.contact.hours}. Dedicated assistance across all Indian business days.
                </p>
              </div>
              <a
                href="#contact-form"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 bg-surface-container-low text-on-surface font-label-sm text-[12px] uppercase font-bold border-2 border-on-surface rounded-lg shadow-[2px_2px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
              >
                <span>OPEN CONTACT FORM</span>
                <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
              </a>
            </div>

            {/* Card 3: Order Assistance */}
            <div className="bg-surface-container-lowest border-2 border-on-surface rounded-xl p-6 shadow-[5px_5px_0px_#171717] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed border-2 border-on-surface flex items-center justify-center mb-4 shadow-[2px_2px_0px_#171717]">
                  <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                </div>
                <h3 className="font-title text-[18px] uppercase font-bold text-on-surface mb-2">
                  ORDER SUPPORT
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-4">
                  Review live courier tracking, view itemized receipts, or request self-service cancellations.
                </p>
              </div>
              <Link
                to="/orders"
                className="w-full py-2.5 bg-primary text-white font-label-sm text-[12px] uppercase font-bold border-2 border-on-surface rounded-lg shadow-[2px_2px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
              >
                <span>VIEW MY ORDERS</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>

            {/* Card 4: Grievance Redressal Desk */}
            <div className="bg-surface-container-lowest border-2 border-on-surface rounded-xl p-6 shadow-[5px_5px_0px_#171717] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-surface-container border-2 border-on-surface flex items-center justify-center mb-4 shadow-[2px_2px_0px_#171717]">
                  <span className="material-symbols-outlined text-[24px] text-primary">policy</span>
                </div>
                <h3 className="font-title text-[18px] uppercase font-bold text-on-surface mb-2">
                  GRIEVANCE DESK
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-4">
                  Formal escalations under Consumer Protection (E-Commerce) Rules, 2020.
                </p>
              </div>
              <a
                href={`mailto:${BRAND_CONFIG.contact.grievanceOfficer.email}`}
                className="w-full py-2.5 bg-[#FFF3DF] text-primary font-label-sm text-[12px] uppercase font-bold border-2 border-on-surface rounded-lg shadow-[2px_2px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
              >
                <span>{BRAND_CONFIG.contact.grievanceOfficer.name}</span>
                <span className="material-symbols-outlined text-[14px]">mail</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION C: CONTACT FORM
          ========================================================================= */}
      <section
        id="contact-form"
        className="w-full bg-[#FFF3DF] border-y-2 border-on-surface py-14 sm:py-20"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Context Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-lowest border-2 border-on-surface rounded-lg shadow-[2px_2px_0px_#171717]">
                <span className="font-label-sm text-label-sm uppercase font-bold text-primary">
                  DIRECT ASSISTANCE
                </span>
              </div>

              <h2 className="font-display text-[30px] sm:text-[40px] uppercase text-on-surface leading-tight">
                SEND US A MESSAGE
              </h2>

              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Fill in the details regarding your request. Our support desk operates during regular
                business hours to answer product, shipping, and order inquiries.
              </p>

              {/* Verified Hours Card */}
              <div className="p-4 bg-surface-container-lowest border-2 border-on-surface rounded-xl shadow-[4px_4px_0px_#171717] space-y-2">
                <div className="flex items-center gap-2 text-on-surface font-title text-[15px] uppercase font-bold">
                  <span className="material-symbols-outlined text-[20px] text-primary">schedule</span>
                  Support Operating Hours
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {BRAND_CONFIG.contact.hours}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant border-t border-on-surface/15 pt-2">
                  Operating Model: {BRAND_CONFIG.contact.locationNote}
                </p>
              </div>

              {/* Grievance & Statutory Compliance Card */}
              <div className="p-4 bg-surface-container-lowest border-2 border-on-surface rounded-xl shadow-[4px_4px_0px_#171717] space-y-1.5 font-body-sm text-body-sm">
                <div className="flex items-center gap-2 text-on-surface font-title text-[15px] uppercase font-bold">
                  <span className="material-symbols-outlined text-[20px] text-primary">policy</span>
                  Grievance Redressal
                </div>
                <p className="text-on-surface-variant text-[13px]">
                  <strong>Storefront:</strong> {BRAND_CONFIG.name} ({BRAND_CONFIG.legalEntityName})
                </p>
                <p className="text-on-surface-variant text-[13px]">
                  <strong>Officer:</strong> {BRAND_CONFIG.contact.grievanceOfficer.name} ({BRAND_CONFIG.contact.grievanceOfficer.designation})
                </p>
                <p className="text-on-surface-variant text-[13px]">
                  <strong>Email:</strong> <a href={`mailto:${BRAND_CONFIG.contact.grievanceOfficer.email}`} className="text-primary underline font-bold">{BRAND_CONFIG.contact.grievanceOfficer.email}</a>
                </p>
                <p className="text-on-surface-variant text-[12px] border-t border-on-surface/15 pt-1.5">
                  Formal escalations acknowledged within 48 hours under Consumer Protection Rules.
                </p>
              </div>

              {/* Integration Disclaimer Note */}
              <div className="p-4 bg-[#F0E8DA] border-2 border-on-surface rounded-xl shadow-[4px_4px_0px_#171717] space-y-2">
                <div className="flex items-center gap-2 text-on-surface font-title text-[14px] uppercase font-bold">
                  <span className="material-symbols-outlined text-[18px] text-[#FF7626]">info</span>
                  Transparent Message Dispatch
                </div>
                <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                  We don't silently discard customer messages. In addition to our direct email address,
                  this form prepares your inquiry so it can be dispatched with a single click.
                </p>
              </div>
            </div>

            {/* Right Form Column (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-surface-container-lowest border-2 border-on-surface rounded-2xl shadow-[8px_8px_0px_#171717] p-6 sm:p-8">
                {/* Status Banners */}
                {submitStatus === 'success' && (
                  <div
                    role="status"
                    className="mb-6 p-4 bg-[#dce1ff] text-on-surface border-2 border-on-surface rounded-xl shadow-[3px_3px_0px_#171717] flex items-start gap-3"
                  >
                    <span className="material-symbols-outlined text-[24px] text-primary shrink-0">
                      check_circle
                    </span>
                    <div>
                      <h4 className="font-title text-[15px] uppercase font-bold">
                        Message Sent Successfully
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {statusMessage}
                      </p>
                    </div>
                  </div>
                )}

                {submitStatus === 'backend_missing' && (
                  <div
                    role="alert"
                    className="mb-6 p-4 bg-[#FFF3DF] text-on-surface border-2 border-on-surface rounded-xl shadow-[3px_3px_0px_#171717] space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[24px] text-[#FF7626] shrink-0 mt-0.5">
                        mail
                      </span>
                      <div>
                        <h4 className="font-title text-[15px] uppercase font-bold text-on-surface">
                          Dispatch via Verified Support Email
                        </h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          {statusMessage}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <a
                        href={fallbackMailtoHref}
                        className="w-full py-3 bg-primary text-white font-label-md text-label-md uppercase font-bold border-2 border-on-surface rounded-lg shadow-[3px_3px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#171717] transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">send</span>
                        <span>SEND VIA YOUR EMAIL CLIENT (Pre-filled)</span>
                      </a>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block font-label-md text-label-md uppercase font-bold text-on-surface mb-1.5"
                    >
                      Full Name <span className="text-[#FF7626]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Alex Morgan"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      className={`w-full px-4 py-3 bg-[#FFFCF7] text-on-surface border-2 rounded-lg font-body-md text-body-md focus:outline-none focus:bg-[#FFF9F0] transition-colors ${
                        errors.name ? 'border-[#ba1a1a]' : 'border-on-surface'
                      }`}
                    />
                    {errors.name && (
                      <p
                        id="contact-name-error"
                        role="alert"
                        className="text-[#ba1a1a] font-label-sm text-[12px] font-bold mt-1.5 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block font-label-md text-label-md uppercase font-bold text-on-surface mb-1.5"
                    >
                      Email Address <span className="text-[#FF7626]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. alex@example.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      className={`w-full px-4 py-3 bg-[#FFFCF7] text-on-surface border-2 rounded-lg font-body-md text-body-md focus:outline-none focus:bg-[#FFF9F0] transition-colors ${
                        errors.email ? 'border-[#ba1a1a]' : 'border-on-surface'
                      }`}
                    />
                    {errors.email && (
                      <p
                        id="contact-email-error"
                        role="alert"
                        className="text-[#ba1a1a] font-label-sm text-[12px] font-bold mt-1.5 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Inquiry Category & Optional Order ID Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-category"
                        className="block font-label-md text-label-md uppercase font-bold text-on-surface mb-1.5"
                      >
                        Inquiry Category
                      </label>
                      <select
                        id="contact-category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 bg-[#FFFCF7] text-on-surface border-2 border-on-surface rounded-lg font-body-md text-body-md focus:outline-none focus:bg-[#FFF9F0] transition-colors"
                      >
                        <option value="Product & Technical Specifications">
                           Product &amp; Technical Specs
                        </option>
                        <option value="Order Tracking & Delivery">Order Tracking &amp; Delivery</option>
                        <option value="Returns & Cancellations">Returns &amp; Cancellations</option>
                        <option value="Wholesale & Business Inquiries">
                          Wholesale &amp; Business Inquiries
                        </option>
                        <option value="General Question">General Question</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-order-id"
                        className="block font-label-md text-label-md uppercase font-bold text-on-surface mb-1.5"
                      >
                        Order ID <span className="text-on-surface-variant font-normal">(Optional)</span>
                      </label>
                      <input
                        id="contact-order-id"
                        type="text"
                        name="orderId"
                        value={formData.orderId}
                        onChange={handleInputChange}
                        placeholder="e.g. ORD-1024"
                        className="w-full px-4 py-3 bg-[#FFFCF7] text-on-surface border-2 border-on-surface rounded-lg font-body-md text-body-md focus:outline-none focus:bg-[#FFF9F0] transition-colors"
                      >
                      </input>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="contact-message"
                        className="block font-label-md text-label-md uppercase font-bold text-on-surface"
                      >
                        Message <span className="text-[#FF7626]">*</span>
                      </label>
                      <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">
                        {formData.message.length}/{MAX_MESSAGE_LENGTH}
                      </span>
                    </div>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      maxLength={MAX_MESSAGE_LENGTH}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Describe your question or how our team can help you..."
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      className={`w-full px-4 py-3 bg-[#FFFCF7] text-on-surface border-2 rounded-lg font-body-md text-body-md focus:outline-none focus:bg-[#FFF9F0] transition-colors resize-y ${
                        errors.message ? 'border-[#ba1a1a]' : 'border-on-surface'
                      }`}
                    />
                    {errors.message && (
                      <p
                        id="contact-message-error"
                        role="alert"
                        className="text-[#ba1a1a] font-label-sm text-[12px] font-bold mt-1.5 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-primary text-white border-2 border-on-surface rounded-lg font-label-lg text-label-lg uppercase font-bold shadow-[4px_4px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#171717] disabled:opacity-60 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>SENDING INQUIRY...</span>
                        </>
                      ) : (
                        <>
                          <span>SEND MESSAGE</span>
                          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: FAQ ACCORDION SECTION
          ========================================================================= */}
      <section className="w-full py-14 sm:py-20 bg-surface">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF3DF] border-2 border-on-surface rounded-lg shadow-[2px_2px_0px_#171717] mb-3">
              <span className="font-label-sm text-label-sm uppercase font-bold text-primary">
                FREQUENTLY ASKED
              </span>
            </div>
            <h2 className="font-display text-[28px] sm:text-[38px] uppercase text-on-surface leading-tight">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Common questions answered directly based on verified Toyvolt storefront operations.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.question}
                  className="bg-surface-container-lowest border-2 border-on-surface rounded-xl shadow-[4px_4px_0px_#171717] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-title text-[16px] sm:text-[18px] uppercase font-bold text-on-surface hover:bg-[#F0E8DA] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="material-symbols-outlined text-[24px] text-primary shrink-0">
                      {isOpen ? 'remove' : 'add'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-on-surface-variant font-body-md text-body-md leading-relaxed border-t border-on-surface/10">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D2: STORE POLICIES DIRECTORY
          ========================================================================= */}
      <section className="w-full py-12 sm:py-16 bg-[#F0E8DA] border-t-2 border-on-surface">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="font-label-sm text-label-sm uppercase font-bold text-primary block mb-1">
              TRANSPARENCY &amp; COMPLIANCE
            </span>
            <h2 className="font-display text-[26px] sm:text-[34px] uppercase text-on-surface leading-tight">
              TOYVOLT STORE POLICIES
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
              Review our complete legal agreements, shipping rules, and consumer protection policies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link
              to="/terms-and-conditions"
              className="bg-surface-container-lowest border-2 border-on-surface rounded-xl p-4 shadow-[3px_3px_0px_#171717] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#171717] transition-all flex flex-col justify-between"
            >
              <div>
                <span className="material-symbols-outlined text-primary text-[24px] mb-2">gavel</span>
                <h3 className="font-title text-[15px] uppercase font-bold text-on-surface mb-1">
                  Terms &amp; Conditions
                </h3>
                <p className="font-body-sm text-[12px] text-on-surface-variant leading-snug">
                  Website usage, user accounts, product pricing, and Razorpay terms.
                </p>
              </div>
              <span className="text-primary font-label-sm text-[11px] font-bold uppercase mt-3 flex items-center gap-1">
                Read Policy <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </Link>

            <Link
              to="/privacy-policy"
              className="bg-surface-container-lowest border-2 border-on-surface rounded-xl p-4 shadow-[3px_3px_0px_#171717] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#171717] transition-all flex flex-col justify-between"
            >
              <div>
                <span className="material-symbols-outlined text-primary text-[24px] mb-2">shield</span>
                <h3 className="font-title text-[15px] uppercase font-bold text-on-surface mb-1">
                  Privacy Policy
                </h3>
                <p className="font-body-sm text-[12px] text-on-surface-variant leading-snug">
                  Data protection, zero card storage, DPDP Act and local storage details.
                </p>
              </div>
              <span className="text-primary font-label-sm text-[11px] font-bold uppercase mt-3 flex items-center gap-1">
                Read Policy <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </Link>

            <Link
              to="/shipping-policy"
              className="bg-surface-container-lowest border-2 border-on-surface rounded-xl p-4 shadow-[3px_3px_0px_#171717] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#171717] transition-all flex flex-col justify-between"
            >
              <div>
                <span className="material-symbols-outlined text-primary text-[24px] mb-2">local_shipping</span>
                <h3 className="font-title text-[15px] uppercase font-bold text-on-surface mb-1">
                  Shipping &amp; Delivery
                </h3>
                <p className="font-body-sm text-[12px] text-on-surface-variant leading-snug">
                  Pan-India coverage, free delivery threshold, and 3–7 day timelines.
                </p>
              </div>
              <span className="text-primary font-label-sm text-[11px] font-bold uppercase mt-3 flex items-center gap-1">
                Read Policy <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </Link>

            <Link
              to="/cancellation-and-refund"
              className="bg-surface-container-lowest border-2 border-on-surface rounded-xl p-4 shadow-[3px_3px_0px_#171717] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#171717] transition-all flex flex-col justify-between"
            >
              <div>
                <span className="material-symbols-outlined text-primary text-[24px] mb-2">currency_rupee</span>
                <h3 className="font-title text-[15px] uppercase font-bold text-on-surface mb-1">
                  Cancellation &amp; Refund
                </h3>
                <p className="font-body-sm text-[12px] text-on-surface-variant leading-snug">
                  Pre-dispatch zero-penalty cancellation and 5–7 day bank refund cycles.
                </p>
              </div>
              <span className="text-primary font-label-sm text-[11px] font-bold uppercase mt-3 flex items-center gap-1">
                Read Policy <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </Link>

            <Link
              to="/return-and-exchange"
              className="bg-surface-container-lowest border-2 border-on-surface rounded-xl p-4 shadow-[3px_3px_0px_#171717] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#171717] transition-all flex flex-col justify-between"
            >
              <div>
                <span className="material-symbols-outlined text-primary text-[24px] mb-2">published_with_changes</span>
                <h3 className="font-title text-[15px] uppercase font-bold text-on-surface mb-1">
                  Return &amp; Exchange
                </h3>
                <p className="font-body-sm text-[12px] text-on-surface-variant leading-snug">
                  48h transit damage, 7-day defect window, and free reverse pickup.
                </p>
              </div>
              <span className="text-primary font-label-sm text-[11px] font-bold uppercase mt-3 flex items-center gap-1">
                Read Policy <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION E: CLOSING PLAYFUL BANNER
          ========================================================================= */}
      <section className="w-full bg-[#FF7626] text-white border-t-2 border-on-surface py-12 sm:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-[28px] sm:text-[40px] uppercase text-white leading-tight">
            STILL CURIOUS? READY TO HIT THE TRACK?
          </h2>
          <p className="font-body-md text-body-md text-white/90 max-w-xl mx-auto mt-3 mb-6">
            Explore our collection or check out full engineering telemetry on our flagship RC model.
          </p>
          <Link
            to={`/product/${productSlug}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-surface-container-lowest text-on-surface border-2 border-on-surface rounded-lg font-label-lg text-label-lg uppercase font-bold shadow-[4px_4px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#171717] transition-all"
          >
            <span>EXPLORE TOYVOLT COLLECTION</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
