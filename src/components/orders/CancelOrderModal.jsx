import React, { useState } from 'react';
import { orderApi, getErrorMessage } from '../../lib/api';

export const CancelOrderModal = ({ order, isOpen, onClose, onSuccess }) => {
  const [reason, setReason] = useState('Order created by mistake');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !order) return null;

  const REASONS = [
    'Order created by mistake',
    'Changed my mind / No longer required',
    'Want to change shipping address or phone',
    'Want to change payment method',
    'Delivery timeframe longer than expected',
    'Other reason'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const finalReason = reason === 'Other reason' && customReason.trim()
      ? customReason.trim()
      : reason;

    try {
      const updatedOrder = await orderApi.cancelOrder(order._id, finalReason);
      onSuccess?.(updatedOrder);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not cancel this order.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md bg-[#FFF9F0] border-4 border-[#171717] shadow-[8px_8px_0px_#171717] p-6 text-[#171717]">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b-2 border-[#171717]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-[#b52700]">
              cancel
            </span>
            <span className="font-headline-sm text-[18px] uppercase font-bold">
              CANCEL ORDER
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 hover:bg-[#F0E8DA] border border-transparent hover:border-[#171717]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="font-body-md text-[14px] text-on-surface-variant mb-4">
          Are you sure you want to cancel order <strong>#{order.orderNumber}</strong>?
          Once cancelled, reserved warehouse stock will be released immediately.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-error-container text-on-error-container border-2 border-[#171717] font-bold text-[12px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-label-sm text-[11px] uppercase font-bold text-[#171717] block mb-1.5">
              REASON FOR CANCELLATION
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-white border-2 border-[#171717] font-body-md text-[13px] text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#1769FF]"
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {reason === 'Other reason' && (
            <div>
              <label className="font-label-sm text-[11px] uppercase font-bold text-[#171717] block mb-1">
                PLEASE SPECIFY
              </label>
              <textarea
                rows={3}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Briefly describe why you are cancelling..."
                className="w-full p-2 bg-white border-2 border-[#171717] font-body-md text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1769FF]"
                required
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-[#171717]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-surface-container-lowest border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-label-sm text-[11px] uppercase font-bold hover:bg-[#F0E8DA]"
            >
              KEEP ORDER
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#b52700] text-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-label-sm text-[11px] uppercase font-bold hover:bg-[#92000a] disabled:opacity-50"
            >
              {isSubmitting ? 'CANCELLING...' : 'CONFIRM CANCELLATION'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelOrderModal;
