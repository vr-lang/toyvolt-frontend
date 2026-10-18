import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { ScrollReveal } from '../common/ScrollReveal';

const INDIAN_PINCODE_REGEX = /^[1-9][0-9]{5}$/;

export const DeliverySection = ({ backendServices }) => {
  const { savedPincode, updateSavedPincode } = useCart();
  const [pinInput, setPinInput] = useState(savedPincode || '');
  const [pinFeedback, setPinFeedback] = useState(null);

  const isShiprocketConfigured = backendServices?.shipping === 'configured';

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const cleaned = pinInput.trim();

    if (!INDIAN_PINCODE_REGEX.test(cleaned)) {
      setPinFeedback({
        type: 'error',
        text: 'Please enter a valid 6-digit Indian PIN code (e.g., 110001).'
      });
      return;
    }

    updateSavedPincode(cleaned);
    setPinFeedback({
      type: 'info',
      text: isShiprocketConfigured
        ? `PIN code ${cleaned} saved for your checkout shipping address. Free shipping applies on orders over ₹${BRAND_CONFIG.shipping.freeShippingThresholdRupees}.`
        : `PIN code ${cleaned} saved for checkout pre-fill. Live courier ETA lookup is pending Shiprocket credential activation on the server. Shipping fee is ₹0 on orders ≥ ₹${BRAND_CONFIG.shipping.freeShippingThresholdRupees} (₹${BRAND_CONFIG.shipping.standardShippingFeeRupees} below ₹${BRAND_CONFIG.shipping.freeShippingThresholdRupees}).`
    });
  };

  return (
    <section
      id="delivery"
      className="w-full max-w-[1360px] mx-auto px-4 lg:px-8 py-6"
    >
      <ScrollReveal className="bg-surface-container-lowest border-2 border-on-surface shadow-[5px_5px_0px_#191919] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-tertiary-fixed border-2 border-on-surface shadow-[3px_3px_0px_#191919] shrink-0">
            <span className="material-symbols-outlined text-[28px] text-on-surface">
              local_shipping
            </span>
          </div>
          <div>
            <span className="font-label-sm text-label-sm uppercase font-bold text-secondary">
              SHIPPING &amp; PIN CODE PRE-FILL
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Save Your Delivery PIN Code &amp; View Shipping Rules
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Enter your 6-digit Indian PIN code to pre-fill checkout. Orders ≥ ₹
              {BRAND_CONFIG.shipping.freeShippingThresholdRupees} qualify for ₹0 shipping fee.
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col items-stretch md:items-end">
          <form
            onSubmit={handlePinSubmit}
            className="flex items-center bg-[#FFFCF7] border-2 border-on-surface shadow-[3px_3px_0px_#191919] overflow-hidden w-full md:w-auto"
          >
            <label htmlFor="delivery-pincode-input" className="sr-only">
              Enter 6-digit Indian PIN code
            </label>
            <input
              id="delivery-pincode-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit PIN (e.g. 122001)"
              required
              className="px-4 py-2.5 bg-transparent font-body-md text-on-surface focus:outline-none flex-1 md:w-64"
            />
            <button
              type="submit"
              className="bg-on-surface text-surface px-5 py-2.5 font-label-md text-label-md uppercase font-bold hover:bg-primary-container transition-colors shrink-0"
            >
              SAVE PIN
            </button>
          </form>

          {pinFeedback && (
            <div
              role="status"
              className={`mt-2.5 flex items-start gap-1.5 font-label-sm text-label-sm font-bold max-w-md ${
                pinFeedback.type === 'error' ? 'text-error' : 'text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-secondary shrink-0 mt-0.5">
                {pinFeedback.type === 'error' ? 'error' : 'info'}
              </span>
              <span>{pinFeedback.text}</span>
            </div>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
};

export default DeliverySection;
