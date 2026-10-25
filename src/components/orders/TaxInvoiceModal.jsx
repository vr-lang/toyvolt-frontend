import React from 'react';

export const TaxInvoiceModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const finalRupees = Math.round((order.finalAmount || 0) / 100);
  const subtotalRupees = Math.round((order.subtotal || 0) / 100);
  const discountRupees = Math.round((order.discountAmount || 0) / 100);
  const shippingRupees = Math.round((order.shippingFee || 0) / 100);
  const taxRupees = Math.round((order.taxAmount || Math.round(subtotalRupees * 0.18)) || 0);

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-white border-4 border-[#171717] shadow-[8px_8px_0px_#171717] p-6 sm:p-8 text-[#171717] my-8 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-6 border-b-2 border-[#171717] print:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-[#1769FF]">
              receipt_long
            </span>
            <span className="font-title text-[16px] uppercase font-bold">
              TAX INVOICE PREVIEW (GST)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1769FF] text-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-label-sm text-[11px] uppercase font-bold hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>PRINT / DOWNLOAD PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close invoice"
              className="p-1.5 hover:bg-[#F0E8DA] border-2 border-transparent hover:border-[#171717] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-tax-invoice" className="text-[13px] leading-relaxed">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-[#171717]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img
                  src="/toyvolt-logo.png"
                  alt="Toyvolt Logo"
                  className="h-9 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="font-display text-[22px] font-bold text-[#171717]">
                  TOYVOLT
                </span>
              </div>
              <p className="font-bold text-[13px]">Toyvolt Retail India Pvt. Ltd.</p>
              <p className="text-[#434654] text-[12px]">
                DLF Cyber City, Building 10, Gurugram, Haryana - 122002
              </p>
              <p className="text-[#434654] text-[12px]">
                Fulfillment Hub: Koramangala 4th Block, Bengaluru, Karnataka - 560034
              </p>
              <p className="font-bold text-[12px] text-[#171717] mt-1">
                GSTIN: 29AABCU9603R1ZM • State Code: 29 (Karnataka)
              </p>
            </div>

            <div className="sm:text-right shrink-0 bg-[#FFF9F0] border-2 border-[#171717] p-3 shadow-[2px_2px_0px_#171717]">
              <span className="inline-block bg-[#1769FF] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider mb-1">
                TAX INVOICE
              </span>
              <p className="font-bold text-[14px]">INV-{order.orderNumber}</p>
              <p className="text-[12px] text-[#434654]">Date: {formattedDate}</p>
              <p className="text-[12px] text-[#434654]">Order Ref: #{order.orderNumber}</p>
              <p className="text-[12px] font-bold text-[#14532d] mt-1 uppercase">
                Payment: {order.paymentStatus} ({order.paymentMethod})
              </p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 border-b-2 border-[#171717]">
            <div>
              <span className="font-label-sm text-[10px] uppercase font-bold text-[#747686] block mb-1">
                BILLED &amp; SHIPPED TO:
              </span>
              <p className="font-bold text-[14px] text-[#171717]">
                {order.shippingAddress?.fullName}
              </p>
              <p className="text-[#434654] text-[12px]">
                {order.shippingAddress?.addressLine1}
                {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
              </p>
              <p className="text-[#434654] text-[12px]">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
              </p>
              <p className="text-[#434654] text-[12px]">
                Phone: {order.shippingAddress?.phone} • Country: {order.shippingAddress?.country || 'India'}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="font-label-sm text-[10px] uppercase font-bold text-[#747686] block mb-1">
                DISPATCH DETAILS:
              </span>
              <p className="text-[12px]">
                Courier: <strong>{order.shipmentId?.courierName || 'Blue Dart Express Logistics'}</strong>
              </p>
              <p className="text-[12px]">
                AWB Code: <strong>{order.shipmentId?.awbCode || 'Pending Dispatch'}</strong>
              </p>
              <p className="text-[12px]">
                Place of Supply: <strong>{order.shippingAddress?.state || 'Karnataka'}</strong>
              </p>
              <p className="text-[12px]">Reverse Charge Applicable: <strong>NO</strong></p>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-4 border-b-2 border-[#171717] overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#FFF9F0] border-2 border-[#171717] font-bold text-[#171717]">
                  <th className="p-2 border-r border-[#171717] w-10 text-center">#</th>
                  <th className="p-2 border-r border-[#171717]">ITEM DESCRIPTION</th>
                  <th className="p-2 border-r border-[#171717] text-center">HSN</th>
                  <th className="p-2 border-r border-[#171717] text-center">QTY</th>
                  <th className="p-2 border-r border-[#171717] text-right">UNIT PRICE</th>
                  <th className="p-2 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, idx) => {
                  const itemUnit = Math.round((item.unitPrice || 0) / 100);
                  const itemTotal = Math.round((item.total || 0) / 100);
                  return (
                    <tr key={idx} className="border-b border-[#171717]">
                      <td className="p-2 border-r border-[#171717] text-center font-bold">{idx + 1}</td>
                      <td className="p-2 border-r border-[#171717]">
                        <span className="font-bold text-[#171717] block">{item.name}</span>
                        <span className="text-[10px] text-[#747686] uppercase font-bold">SKU: {item.sku}</span>
                      </td>
                      <td className="p-2 border-r border-[#171717] text-center font-mono">95030090</td>
                      <td className="p-2 border-r border-[#171717] text-center font-bold">{item.quantity}</td>
                      <td className="p-2 border-r border-[#171717] text-right font-mono">₹{itemUnit.toLocaleString('en-IN')}</td>
                      <td className="p-2 text-right font-mono font-bold">₹{itemTotal.toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b-2 border-[#171717]">
            <div className="text-[11px] text-[#434654]">
              <p className="font-bold text-[#171717] mb-1">Terms &amp; Declarations:</p>
              <p>• Goods once sold are covered under Toyvolt 7-Day Unbox Replacement Guarantee.</p>
              <p>• All electronic components are 100% QC tested prior to dispatch.</p>
              <p>• This is a computer-generated invoice and requires no physical signature.</p>
            </div>

            <div className="space-y-1.5 text-[12px] sm:text-right">
              <div className="flex justify-between sm:justify-end gap-6 text-[#434654]">
                <span>Items Subtotal:</span>
                <span className="font-mono font-bold text-[#171717]">₹{subtotalRupees.toLocaleString('en-IN')}.00</span>
              </div>
              {discountRupees > 0 && (
                <div className="flex justify-between sm:justify-end gap-6 text-[#b52700]">
                  <span>Coupon Discount ({order.couponCode || 'PROMO'}):</span>
                  <span className="font-mono font-bold">-₹{discountRupees.toLocaleString('en-IN')}.00</span>
                </div>
              )}
              <div className="flex justify-between sm:justify-end gap-6 text-[#434654]">
                <span>Express Shipping:</span>
                <span className="font-mono font-bold text-[#171717]">{shippingRupees === 0 ? 'FREE' : `₹${shippingRupees}.00`}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-6 text-[#434654]">
                <span>Integrated GST (18% Included):</span>
                <span className="font-mono font-bold text-[#171717]">₹{taxRupees.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="pt-2 border-t-2 border-[#171717] flex justify-between sm:justify-end gap-6 font-bold text-[15px] text-[#171717]">
                <span>TOTAL PAID:</span>
                <span className="font-mono text-[#1769FF]">₹{finalRupees.toLocaleString('en-IN')}.00</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 text-center text-[11px] text-[#747686]">
            Thank you for choosing Toyvolt — Power Up The Fun! • Need assistance? support@toyvolt.in
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxInvoiceModal;
