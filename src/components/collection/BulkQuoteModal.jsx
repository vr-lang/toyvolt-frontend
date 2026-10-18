import React, { useState } from 'react';
import { useBodyScrollLock } from '../../lib/useBodyScrollLock';

export const BulkQuoteModal = ({ isOpen, onClose }) => {
  useBodyScrollLock(isOpen);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    units: '10-25 Units',
    eventDate: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      units: '10-25 Units',
      eventDate: '',
      notes: ''
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-quote-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[8px_8px_0px_#171717] w-full max-w-lg p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border-2 border-[#171717] bg-[#FFF9F0] hover:bg-[#FFE6E6] shadow-[2px_2px_0px_#171717] font-bold text-lg"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto bg-[#22C55E] text-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">check</span>
            </div>

            <h3 className="font-headline-sm text-xl font-black uppercase text-[#171717]">
              PARTY QUOTE REQUEST RECEIVED!
            </h3>

            <p className="font-body-md text-sm text-[#434654] max-w-md mx-auto leading-relaxed">
              Thanks <strong>{formData.name}</strong>! Our festive concierge team will review your
              request for <strong>{formData.units}</strong> and send your tailored 15% bundled
              quote with custom packaging options within 2 hours.
            </p>

            <div className="p-3 bg-[#FFF3DF] border border-[#171717] text-xs font-bold text-[#171717] uppercase">
              Confirmation logged for {formData.phone} • {formData.email}
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="mt-4 bg-[#1769FF] text-white font-title text-xs uppercase px-6 py-3 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] font-bold hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              BACK TO COLLECTION
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-block bg-[#E53E3E] text-white font-label-sm text-[10px] font-bold uppercase px-2.5 py-1 border border-[#171717] shadow-[2px_2px_0px_#171717] mb-2">
              FESTIVE BULK GIFTING &amp; RETURN GIFTS
            </div>

            <h2
              id="bulk-quote-title"
              className="font-headline-sm text-xl sm:text-2xl font-black uppercase text-[#171717] mb-2 leading-tight"
            >
              PLANNING A BIRTHDAY PARTY OR EVENT?
            </h2>

            <p className="font-body-sm text-xs sm:text-sm text-[#434654] mb-5 leading-relaxed">
              Get an extra <strong>15% bulk discount</strong> on orders of 5+ toys. Includes
              personalized theme packaging, name tags, and pre-tested battery units.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-[11px] font-bold uppercase text-[#171717] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-[#FFFCF7] border-2 border-[#171717] px-3 py-2 font-body-sm text-sm text-[#171717] focus:outline-none focus:bg-[#FFF9F0]"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-[11px] font-bold uppercase text-[#171717] mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })
                    }
                    placeholder="9876543210"
                    className="w-full bg-[#FFFCF7] border-2 border-[#171717] px-3 py-2 font-body-sm text-sm text-[#171717] focus:outline-none focus:bg-[#FFF9F0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-[11px] font-bold uppercase text-[#171717] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="priya@example.com"
                    className="w-full bg-[#FFFCF7] border-2 border-[#171717] px-3 py-2 font-body-sm text-sm text-[#171717] focus:outline-none focus:bg-[#FFF9F0]"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-[11px] font-bold uppercase text-[#171717] mb-1">
                    Estimated Quantity *
                  </label>
                  <select
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                    className="w-full bg-[#FFFCF7] border-2 border-[#171717] px-3 py-2 font-body-sm text-sm text-[#171717] focus:outline-none focus:bg-[#FFF9F0]"
                  >
                    <option value="5-10 Units">5 – 10 Units (Small Party)</option>
                    <option value="10-25 Units">10 – 25 Units (Classroom / Birthday)</option>
                    <option value="25-50 Units">25 – 50 Units (School / Festive)</option>
                    <option value="50+ Units">50+ Units (Corporate / Bulk)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-[11px] font-bold uppercase text-[#171717] mb-1">
                  Event Date / Special Instructions
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Need return gifts by next Saturday. Preference for RC cars or educational blocks..."
                  className="w-full bg-[#FFFCF7] border-2 border-[#171717] px-3 py-2 font-body-sm text-sm text-[#171717] focus:outline-none focus:bg-[#FFF9F0]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1769FF] text-white font-title text-xs uppercase py-3.5 px-6 border-2 border-[#171717] shadow-[4px_4px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2 font-bold disabled:opacity-50"
              >
                <span>{isSubmitting ? 'SENDING INQUIRY...' : 'SUBMIT BULK PARTY INQUIRY'}</span>
                <span className="material-symbols-outlined text-[18px]">magic_button</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkQuoteModal;
