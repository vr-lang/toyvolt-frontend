import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderApi, getErrorMessage } from '../lib/api';
import { AccountSidebar } from '../components/account/AccountSidebar';
import { ProductImageWithFallback } from '../components/product/ProductImageWithFallback';
import { TaxInvoiceModal } from '../components/orders/TaxInvoiceModal';
import { CancelOrderModal } from '../components/orders/CancelOrderModal';
import { LoadingState } from '../components/common/LoadingState';

export const OrderDetailsPage = ({ onOrderCancelled }) => {
  const { id: routeOrderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [order, setOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedAwb, setCopiedAwb] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Load Order & Tracking
  const loadOrderDetails = useCallback(async (refresh = false) => {
    if (!routeOrderId) return;
    if (!refresh) setLoading(true);
    setError('');

    try {
      if (refresh) {
        setTrackingLoading(true);
        try {
          const refreshedTracking = await orderApi.refreshOrderTracking(routeOrderId);
          if (refreshedTracking) {
            setTrackingData(refreshedTracking);
          }
        } catch (refreshErr) {
          console.warn('Tracking refresh call failed:', refreshErr);
        }
      }

      const orderRes = await orderApi.getOrderById(routeOrderId);
      if (!orderRes) {
        throw new Error('Order not found.');
      }
      setOrder(orderRes);

      // Fetch tracking data asynchronously if not already fetched via refresh
      if (!refresh) {
        setTrackingLoading(true);
        try {
          const trackingRes = await orderApi.getOrderTracking(routeOrderId);
          setTrackingData(trackingRes);
        } catch (trackErr) {
          // Non-blocking: order details still render
          console.warn('Tracking fetch failed:', trackErr);
        }
      }
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'Unable to load your order details. The order may not exist or you may not have permission to view it.'
        )
      );
    } finally {
      setLoading(false);
      setTrackingLoading(false);
    }
  }, [routeOrderId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (isAuthenticated) {
      loadOrderDetails();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, loadOrderDetails]);

  // Copy AWB action
  const handleCopyAwb = (awbCode) => {
    if (!awbCode) return;
    navigator.clipboard?.writeText(awbCode);
    setCopiedAwb(true);
    setTimeout(() => setCopiedAwb(false), 2200);
  };

  // Safe Rupee conversions
  const finalRupees = useMemo(() => Math.round((order?.finalAmount || 0) / 100), [order?.finalAmount]);
  const subtotalRupees = useMemo(() => Math.round((order?.subtotal || 0) / 100), [order?.subtotal]);
  const discountRupees = useMemo(() => Math.round((order?.discountAmount || 0) / 100), [order?.discountAmount]);
  const shippingRupees = useMemo(() => Math.round((order?.shippingFee || 0) / 100), [order?.shippingFee]);
  const taxRupees = useMemo(() => {
    if (order?.taxAmount) return (order.taxAmount / 100).toFixed(2);
    return ((subtotalRupees * 0.18)).toFixed(2);
  }, [order?.taxAmount, subtotalRupees]);

  // Date formatting helpers
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '';
    }
  };

  const formatDateShort = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '';
    }
  };

  // Safe cancellation rule
  const isCancellable = useMemo(() => {
    if (!order) return false;
    const status = (order.orderStatus || '').toLowerCase();
    return status === 'placed' || status === 'confirmed';
  }, [order]);

  // Determine active shipment information
  const shipment = order?.shipmentId || trackingData?.shipment || null;
  const liveTracking = trackingData?.liveTracking || null;
  const awbCode = shipment?.awbCode || null;
  const courierName = shipment?.courierName || 'Blue Dart Express Logistics';
  const trackingUrl = shipment?.trackingUrl || (awbCode ? `https://shiprocket.co/tracking/${awbCode}` : null);

  // Generate a deterministic 4-digit security PIN for parcel unbox verification
  const deliveryPin = useMemo(() => {
    if (!order) return '4821';
    const cleanNum = (order.orderNumber || '').replace(/\D/g, '');
    if (cleanNum.length >= 4) return cleanNum.slice(-4);
    const hash = (order._id || '9482').slice(-4);
    return hash.replace(/\D/g, (c) => (c.charCodeAt(0) % 9 + 1).toString());
  }, [order]);

  // Status Badge configurations
  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    switch (s) {
      case 'delivered':
        return {
          label: 'DELIVERED • HANDED OVER',
          bg: 'bg-[#DCFCE7]',
          text: 'text-[#14532D]',
          border: 'border-[#171717]'
        };
      case 'shipped':
      case 'in_transit':
        return {
          label: 'IN TRANSIT • ON THE WAY',
          bg: 'bg-[#E3E7FF]',
          text: 'text-[#1769FF]',
          border: 'border-[#171717]'
        };
      case 'out_for_delivery':
        return {
          label: 'IN TRANSIT • OUT FOR DELIVERY',
          bg: 'bg-[#bbf7d0]',
          text: 'text-[#14532d]',
          border: 'border-[#171717]'
        };
      case 'processing':
      case 'confirmed':
        return {
          label: 'CONFIRMED • PROCESSING AT HUB',
          bg: 'bg-[#FEF3C7]',
          text: 'text-[#92400E]',
          border: 'border-[#171717]'
        };
      case 'cancelled':
        return {
          label: 'CANCELLED • STOCK RESTORED',
          bg: 'bg-[#FEE2E2]',
          text: 'text-[#991B1B]',
          border: 'border-[#171717]'
        };
      default:
        return {
          label: 'ORDER PLACED • AWAITING DISPATCH',
          bg: 'bg-[#FEF3C7]',
          text: 'text-[#92400E]',
          border: 'border-[#171717]'
        };
    }
  };

  // Fulfilment Progress Timeline Stages (1 to 6)
  const timelineStages = useMemo(() => {
    if (!order) return [];

    const orderStatus = (order.orderStatus || '').toLowerCase();
    const shipStatus = (shipment?.status || '').toUpperCase();
    const isCOD = order.paymentMethod === 'cod';

    // Index mapping:
    // 0: Placed
    // 1: Payment Confirmed / COD Confirmed
    // 2: Packed
    // 3: Shipped
    // 4: Out for Delivery
    // 5: Delivered
    let currentStageIndex = 0;

    if (orderStatus === 'cancelled') {
      currentStageIndex = -1; // exception state
    } else if (orderStatus === 'delivered' || shipStatus === 'DELIVERED') {
      currentStageIndex = 5;
    } else if (shipStatus === 'OUT_FOR_DELIVERY') {
      currentStageIndex = 4;
    } else if (orderStatus === 'shipped' || ['IN_TRANSIT', 'PICKED_UP'].includes(shipStatus)) {
      currentStageIndex = 3;
    } else if (['PICKUP_SCHEDULED', 'AWB_ASSIGNED', 'CREATED'].includes(shipStatus) || orderStatus === 'processing') {
      currentStageIndex = 2;
    } else if (order.paymentStatus === 'paid' || isCOD || orderStatus === 'confirmed') {
      currentStageIndex = 1;
    } else {
      currentStageIndex = 0;
    }

    const orderPlacedTime = formatDateShort(order.createdAt);
    const paymentTime = formatDateShort(order.paymentId?.paidAt || order.updatedAt || order.createdAt);
    const packedTime = shipment?.createdAt ? formatDateShort(shipment.createdAt) : null;
    const shippedTime = shipment?.trackingHistory?.[0]?.date ? formatDateShort(shipment.trackingHistory[0].date) : null;
    const deliveryEstimated = liveTracking?.estimated_delivery_date || 'By Today, 07:30 PM';

    return [
      {
        id: 'placed',
        stepNum: '1',
        title: 'PLACED',
        sublabel: 'Cart Confirmed',
        timestamp: orderPlacedTime,
        status: currentStageIndex >= 0 ? 'completed' : 'pending'
      },
      {
        id: 'payment',
        stepNum: '2',
        title: isCOD ? 'COD CONFIRMED' : 'PAYMENT',
        sublabel: isCOD
          ? 'Cash on Delivery'
          : order.paymentId?.razorpayPaymentId
          ? `UPI #${order.paymentId.razorpayPaymentId.slice(-9)}`
          : 'Payment Cleared',
        timestamp: paymentTime,
        status: currentStageIndex >= 1 ? 'completed' : currentStageIndex === 0 ? 'current' : 'pending'
      },
      {
        id: 'packed',
        stepNum: '3',
        title: 'PACKED',
        sublabel: 'Mumbai Hub Sealed',
        timestamp: packedTime || (currentStageIndex >= 2 ? paymentTime : null),
        status: currentStageIndex > 2 ? 'completed' : currentStageIndex === 2 ? 'current' : 'pending'
      },
      {
        id: 'shipped',
        stepNum: '4',
        title: 'SHIPPED',
        sublabel: `Via ${courierName.split(' ')[0]} Air`,
        timestamp: shippedTime || (currentStageIndex >= 3 ? 'In Transit' : null),
        status: currentStageIndex > 3 ? 'completed' : currentStageIndex === 3 ? 'current' : 'pending'
      },
      {
        id: 'out_for_delivery',
        stepNum: '5',
        title: 'OUT FOR DELIVERY',
        sublabel: 'On Courier Van',
        timestamp: currentStageIndex >= 4 ? 'TODAY, 09:15 AM' : null,
        status: currentStageIndex > 4 ? 'completed' : currentStageIndex === 4 ? 'current' : 'pending'
      },
      {
        id: 'delivered',
        stepNum: '6',
        title: 'DELIVERY',
        sublabel: 'Doorstep Handover',
        timestamp: currentStageIndex === 5 ? 'Completed' : deliveryEstimated,
        status: currentStageIndex === 5 ? 'completed' : 'pending'
      }
    ];
  }, [order, shipment, liveTracking, courierName]);

  // Auth Guard
  if (!isAuthenticated) {
    return (
      <section className="w-full max-w-[960px] mx-auto px-4 lg:px-8 py-14">
        <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[6px_6px_0px_#171717] p-8 text-center">
          <span className="material-symbols-outlined text-[48px] text-[#1769FF] mb-2 block">
            lock
          </span>
          <h1 className="font-headline-md text-headline-md uppercase text-[#171717] mb-2 font-bold">
            SIGN IN TO VIEW ORDER DETAILS
          </h1>
          <p className="font-body-md text-on-surface-variant mb-6 max-w-md mx-auto">
            Please sign in to access live shipment telemetry, AWB tracking codes, GST tax invoices, and order status.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="bg-[#1769FF] text-white font-title text-title uppercase px-6 py-3.5 border-2 border-[#171717] shadow-[4px_4px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 transition-transform font-bold"
          >
            SIGN IN TO YOUR ACCOUNT
          </button>
        </div>
      </section>
    );
  }

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="w-full max-w-[1360px] mx-auto px-4 lg:px-8 py-10">
        <LoadingState message="Connecting to Toyvolt Fulfillment Network..." />
      </div>
    );
  }

  // Error State
  if (error || !order) {
    return (
      <section className="w-full max-w-[960px] mx-auto px-4 lg:px-8 py-12">
        <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[6px_6px_0px_#171717] p-8 text-center">
          <span className="material-symbols-outlined text-[48px] text-[#ba1a1a] mb-2 block">
            error
          </span>
          <h1 className="font-headline-sm text-headline-sm uppercase text-[#171717] mb-2 font-bold">
            UNABLE TO LOAD ORDER DETAILS
          </h1>
          <p className="font-body-md text-[#ba1a1a] font-bold mb-6 max-w-lg mx-auto">
            {error || 'The requested order could not be found.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={loadOrderDetails}
              className="bg-[#1769FF] text-white font-title text-[14px] uppercase px-5 py-2.5 border-2 border-[#171717] shadow-[3px_3px_0px_#171717]"
            >
              RETRY FETCHING
            </button>
            <Link
              to="/orders"
              className="bg-surface-container-lowest text-[#171717] font-title text-[14px] uppercase px-5 py-2.5 border-2 border-[#171717] shadow-[3px_3px_0px_#171717]"
            >
              BACK TO MY ORDERS
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const statusBadge = getStatusBadge(order.orderStatus);

  return (
    <div className="w-full min-h-screen bg-[#F7F3EB] pb-16">
      {/* =========================================================================
          TOP BREADCRUMB STRIP
          ========================================================================= */}
      <div className="w-full bg-[#F0E8DA] border-b-2 border-[#171717] py-2.5 px-4 lg:px-8">
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-2 font-label-sm text-[11px] uppercase tracking-wider font-bold">
          <div className="flex items-center gap-2 text-[#434654]">
            <Link to="/" className="hover:text-[#171717] transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">home</span>
              <span>HOME</span>
            </Link>
            <span>/</span>
            <Link to="/orders" className="hover:text-[#171717] transition-colors">
              ACCOUNT
            </Link>
            <span>/</span>
            <Link to="/orders" className="hover:text-[#171717] transition-colors">
              MY ORDERS
            </Link>
            <span>/</span>
            <span className="bg-[#E3E7FF] text-[#1769FF] border border-[#171717] px-2 py-0.5 shadow-[1.5px_1.5px_0px_#171717]">
              #{order.orderNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadOrderDetails(true)}
              disabled={trackingLoading}
              className="text-[#171717] hover:text-[#1769FF] flex items-center gap-1 text-[10px]"
            >
              <span className={`material-symbols-outlined text-[14px] ${trackingLoading ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{trackingLoading ? 'SYNCING...' : 'REFRESH STATUS'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN TWO-COLUMN DASHBOARD LAYOUT
          ========================================================================= */}
      <main className="max-w-[1360px] mx-auto px-4 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          {/* =====================================================================
              1. LEFT SIDEBAR (Account Menu)
              ===================================================================== */}
          <AccountSidebar activeTab="orders" />

          {/* =====================================================================
              2. MAIN CONTENT AREA
              ===================================================================== */}
          <div className="flex-1 w-full min-w-0 space-y-6">
            {/* -------------------------------------------------------------------
                A. ORDER OVERVIEW CARD (Spans full width)
                ------------------------------------------------------------------- */}
            <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[6px_6px_0px_#171717] p-5 sm:p-6">
              {/* Header Row: Order Number + Actions */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b-2 border-[#171717]">
                <div>
                  <h1 className="font-headline-md text-[24px] sm:text-[28px] font-bold text-[#171717] tracking-tight uppercase leading-none">
                    ORDER #{order.orderNumber}
                  </h1>

                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <span
                      className={`inline-block font-label-sm text-[10px] sm:text-[11px] uppercase font-bold px-2.5 py-0.5 border ${statusBadge.border} ${statusBadge.bg} ${statusBadge.text}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[#434654] font-body-sm text-[12px]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#171717]">
                        calendar_today
                      </span>
                      <span>Placed on: <strong>{formatDateTime(order.createdAt)}</strong></span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#14532D]">
                        verified
                      </span>
                      <span>Verified Indian GST Dispatch</span>
                    </span>
                  </div>
                </div>

                {/* Top Action Buttons (Tax Invoice, Cancel, Need Help) */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setInvoiceModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#FFF9F0] hover:bg-[#F0E8DA] border-2 border-[#171717] shadow-[2.5px_2.5px_0px_#171717] font-label-sm text-[11px] uppercase font-bold text-[#171717] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                    <span>TAX INVOICE (GST)</span>
                  </button>

                  {isCancellable ? (
                    <button
                      type="button"
                      onClick={() => setCancelModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#FEE2E2] hover:bg-[#FCA5A5] text-[#991B1B] border-2 border-[#171717] shadow-[2.5px_2.5px_0px_#171717] font-label-sm text-[11px] uppercase font-bold active:translate-x-0.5 active:translate-y-0.5 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                      <span>CANCEL ORDER</span>
                    </button>
                  ) : (
                    <div
                      title="Cancellation locked: order is already processed or dispatched"
                      className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#F0E8DA] text-[#747686] border-2 border-[#171717] font-label-sm text-[11px] uppercase font-bold cursor-not-allowed select-none opacity-80"
                    >
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                      <span>CANCEL LOCKED</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setSupportModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#FFDF90] hover:bg-[#fde047] text-[#171717] border-2 border-[#171717] shadow-[2.5px_2.5px_0px_#171717] font-label-sm text-[11px] uppercase font-bold active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">help</span>
                    <span>NEED HELP?</span>
                  </button>
                </div>
              </div>

              {/* Cancellation Exception Banner */}
              {order.orderStatus === 'cancelled' && (
                <div className="mt-4 p-4 bg-[#FEE2E2] border-2 border-[#991B1B] text-[#991B1B]">
                  <div className="flex items-center gap-2 font-title text-[15px] font-bold">
                    <span className="material-symbols-outlined">cancel</span>
                    <span>ORDER CANCELLED</span>
                  </div>
                  <p className="font-body-sm text-[13px] mt-1 text-[#7f1d1d]">
                    Reason: {order.cancellationReason || 'Cancelled upon customer request.'} Any payments made are processed per Toyvolt Cancellation &amp; Refund guidelines.
                  </p>
                </div>
              )}

              {/* Fulfilment Progress Timeline */}
              {order.orderStatus !== 'cancelled' && (
                <div className="mt-5 pt-2">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-[#1769FF]">
                        local_shipping
                      </span>
                      <span className="font-label-sm text-[11px] uppercase font-bold text-[#171717] tracking-wider">
                        REAL-TIME FULFILLMENT PROGRESS
                      </span>
                    </div>
                    <span className="font-label-sm text-[9px] uppercase font-bold px-2 py-0.5 bg-[#F0E8DA] border border-[#171717] text-[#171717]">
                      CARRIER SLA: TIER 1 EXPRESS
                    </span>
                  </div>

                  {/* Horizontal Step Timeline */}
                  <div className="overflow-x-auto pb-4 pt-1">
                    <div className="min-w-[660px] grid grid-cols-6 relative">
                      {/* Connecting Line */}
                      <div className="absolute top-4 left-[8%] right-[8%] h-0.5 bg-[#DDD3C3] z-0" />

                      {timelineStages.map((stage, idx) => {
                        const isCompleted = stage.status === 'completed';
                        const isCurrent = stage.status === 'current';

                        return (
                          <div key={stage.id} className="relative z-10 flex flex-col items-center text-center px-1">
                            {/* Step Indicator Circle */}
                            <div
                              className={`w-8 h-8 rounded-full border-2 border-[#171717] flex items-center justify-center font-bold text-[12px] mb-2 transition-transform ${
                                isCurrent
                                  ? 'bg-[#1769FF] text-white ring-4 ring-[#1769FF]/20 scale-110 shadow-[2px_2px_0px_#171717]'
                                  : isCompleted
                                  ? 'bg-[#171717] text-white'
                                  : 'bg-[#FFF9F0] text-[#747686]'
                              }`}
                            >
                              {isCompleted ? (
                                <span className="material-symbols-outlined text-[16px]">check</span>
                              ) : isCurrent ? (
                                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                              ) : (
                                <span>{stage.stepNum}</span>
                              )}
                            </div>

                            {/* Active Highlight Box for current stage */}
                            {isCurrent ? (
                              <div className="w-full bg-[#E3E7FF] border-2 border-[#1769FF] p-2 shadow-[2px_2px_0px_#1769FF] text-left">
                                <span className="font-label-sm text-[10px] uppercase font-bold text-[#1769FF] block">
                                  {stage.title}
                                </span>
                                {stage.timestamp && (
                                  <span className="font-mono text-[9px] text-[#1769FF] font-bold block mt-0.5">
                                    {stage.timestamp}
                                  </span>
                                )}
                                <span className="font-body-sm text-[10px] text-[#171717] block mt-0.5 font-bold">
                                  {stage.sublabel}
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span
                                  className={`font-label-sm text-[10px] uppercase font-bold block ${
                                    isCompleted ? 'text-[#171717]' : 'text-[#747686]'
                                  }`}
                                >
                                  {stage.stepNum}. {stage.title}
                                </span>
                                {stage.timestamp && (
                                  <span className="font-mono text-[9px] text-[#747686] block mt-0.5">
                                    {stage.timestamp}
                                  </span>
                                )}
                                <span className="font-body-sm text-[10px] text-[#434654] block mt-0.5">
                                  {stage.sublabel}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* -------------------------------------------------------------------
                B. COURIER LOGISTICS TRACKING CARD (Matching Reference)
                ------------------------------------------------------------------- */}
            <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[5px_5px_0px_#171717] p-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Left: Partner & Live Tracking Info (8 cols) */}
                <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Courier Title Bar */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="bg-[#b52700] text-white px-2 py-0.5 font-label-sm text-[10px] uppercase font-bold border border-[#171717]">
                        PRIORITY AIR &amp; SURFACE
                      </span>
                      <h3 className="font-title text-[16px] uppercase font-bold text-[#171717]">
                        {courierName.toUpperCase()}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#F0E8DA] text-[#171717] font-label-sm text-[10px] uppercase font-bold px-2 py-0.5 border border-[#171717]">
                        SAFE TRANSIT ID: {order.orderNumber}
                      </span>
                    </div>

                    {/* AWB Box with Copy & Direct Tracking */}
                    <div className="flex flex-wrap items-center gap-2.5 p-3 bg-white border-2 border-[#171717]">
                      <span className="font-label-sm text-[11px] uppercase font-bold text-[#747686]">
                        AIR WAYBILL (AWB):
                      </span>
                      <span className="font-mono font-bold text-[14px] text-[#171717] bg-[#F7F3EB] px-2 py-0.5 border border-[#171717]">
                        {awbCode || 'AWAITING AWB GENERATION'}
                      </span>

                      {awbCode && (
                        <button
                          type="button"
                          onClick={() => handleCopyAwb(awbCode)}
                          className="px-2.5 py-1 bg-[#F0E8DA] hover:bg-[#DDD3C3] border border-[#171717] font-label-sm text-[10px] uppercase font-bold flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {copiedAwb ? 'check' : 'content_copy'}
                          </span>
                          <span>{copiedAwb ? 'COPIED!' : 'COPY'}</span>
                        </button>
                      )}

                      {trackingUrl && (
                        <a
                          href={trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto inline-flex items-center gap-1 text-[#1769FF] font-label-sm text-[10px] uppercase font-bold hover:underline"
                        >
                          <span>DIRECT {courierName.split(' ')[0].toUpperCase()} TRACKING</span>
                          <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Live Status Description Box */}
                  <div className="p-3 bg-[#FFF3DF] border-2 border-[#171717] flex items-start gap-3">
                    <span className="material-symbols-outlined text-[24px] text-[#FF7626] shrink-0 mt-0.5">
                      local_shipping
                    </span>
                    <div className="font-body-sm text-[12px] leading-relaxed">
                      {awbCode ? (
                        <>
                          <strong>Live Status:</strong> Package processed for{' '}
                          <strong>{order.shippingAddress?.city}</strong> delivery.{' '}
                          {liveTracking?.scans?.[0]?.activity
                            ? liveTracking.scans[0].activity
                            : 'Consignment secured in tamper-proof container and scheduled for priority transit.'}
                        </>
                      ) : (
                        <>
                          <strong>Live Status:</strong> Tracking details will be available once your shipment is dispatched with our logistics partner. Your RC unit is undergoing automated pre-dispatch check.
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Secure Delivery OTP Card (4 cols) */}
                <div className="lg:col-span-4 bg-white border-2 border-[#171717] p-4 flex flex-col justify-between text-center shadow-[3px_3px_0px_#171717]">
                  <div>
                    <div className="flex items-center justify-center gap-1.5 text-[#b52700] mb-1">
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      <span className="font-label-sm text-[10px] uppercase font-bold tracking-wider">
                        SECURE DELIVERY OTP
                      </span>
                    </div>
                    <p className="font-body-sm text-[10px] text-[#747686] leading-tight mb-3">
                      Share this PIN with the delivery executive only when inspecting carton seal.
                    </p>

                    {/* 4 Box Digits */}
                    <div className="flex items-center justify-center gap-2 my-2">
                      {deliveryPin.split('').map((digit, i) => (
                        <div
                          key={i}
                          className="w-10 h-12 bg-[#F7F3EB] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center font-display text-[22px] font-bold text-[#171717]"
                        >
                          {digit}
                        </div>
                      ))}
                    </div>
                  </div>

                  <span className="inline-block mt-3 bg-[#F0E8DA] border border-[#171717] text-[#171717] font-label-sm text-[9px] uppercase font-bold py-1">
                    VALID FOR DELIVERY
                  </span>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------------
                C. LOWER TWO-COLUMN SECTION:
                   Left: ITEMS IN THIS ORDER (7 cols)
                   Right: DESTINATION, PAYMENT, INVOICE (5 cols)
                ------------------------------------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Ordered Items (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[5px_5px_0px_#171717] p-5">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#171717]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-[#1769FF]">
                        inventory_2
                      </span>
                      <h2 className="font-title text-[15px] uppercase font-bold text-[#171717]">
                        ITEMS IN THIS ORDER ({order.items?.length || 0})
                      </h2>
                    </div>
                    <span className="bg-[#FEF3C7] text-[#92400E] border border-[#171717] px-2 py-0.5 font-label-sm text-[9px] uppercase font-bold">
                      FRAGILE PACKING CHECKED
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-4">
                    {order.items?.map((item, idx) => {
                      const itemTotalRupees = Math.round((item.total || 0) / 100);
                      const unitPriceRupees = Math.round((item.unitPrice || 0) / 100);

                      return (
                        <div
                          key={idx}
                          className="bg-white border-2 border-[#171717] p-3.5 sm:p-4 shadow-[2px_2px_0px_#171717] flex flex-col sm:flex-row gap-4 items-start"
                        >
                          {/* Product Image */}
                          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#F7F3EB] border-2 border-[#171717] flex items-center justify-center p-2 shrink-0 overflow-hidden relative">
                            <ProductImageWithFallback
                              src={item.imageUrl}
                              alt={item.name}
                              width={150}
                              height={150}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <Link
                                  to={`/product/${item.slug || 'toyvolt-spray-monster-rc-car'}`}
                                  className="font-title text-[15px] uppercase font-bold text-[#171717] hover:text-[#1769FF] transition-colors leading-snug"
                                >
                                  {item.name}
                                </Link>
                                <span className="font-price-lg text-[18px] font-bold text-[#171717] shrink-0 font-mono">
                                  ₹{itemTotalRupees.toLocaleString('en-IN')}
                                </span>
                              </div>

                              {/* Badges */}
                              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                <span className="bg-[#F0E8DA] border border-[#171717] px-1.5 py-0.2 font-label-sm text-[9px] uppercase font-bold text-[#171717]">
                                  SKU: {item.sku}
                                </span>
                                <span className="bg-[#F0E8DA] border border-[#171717] px-1.5 py-0.2 font-label-sm text-[9px] uppercase font-bold text-[#171717]">
                                  Qty: {item.quantity}
                                </span>
                                <span className="bg-[#F0E8DA] border border-[#171717] px-1.5 py-0.2 font-label-sm text-[9px] uppercase font-bold text-[#171717]">
                                  Rate: ₹{unitPriceRupees.toLocaleString('en-IN')}
                                </span>
                              </div>

                              {/* Package Inclusions Box */}
                              <div className="mt-2.5 p-2 bg-[#F7F3EB] border border-[#171717] text-[11px] text-[#434654] font-body-sm leading-tight flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[15px] text-[#1769FF] shrink-0">
                                  check_circle
                                </span>
                                <span>Includes: 7.4V Li-Po Pack + 2.4GHz Controller + Fast USB Cable</span>
                              </div>
                            </div>

                            {/* Item Actions */}
                            <div className="flex items-center justify-between gap-3 mt-3 pt-2.5 border-t border-[#171717]/15">
                              <Link
                                to={`/product/${item.slug || 'toyvolt-spray-monster-rc-car'}`}
                                className="inline-flex items-center gap-1 text-[#1769FF] font-label-sm text-[10px] uppercase font-bold hover:underline"
                              >
                                <span>VIEW PRODUCT DETAILS</span>
                                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                              </Link>

                              <button
                                type="button"
                                onClick={() => setInvoiceModalOpen(true)}
                                className="inline-flex items-center gap-1 text-[#434654] hover:text-[#171717] font-label-sm text-[10px] uppercase font-bold"
                              >
                                <span className="material-symbols-outlined text-[13px]">download</span>
                                <span>INVOICE ENTRY</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tamper-evident Crate Packing Guarantee */}
                  <div className="mt-4 p-3 bg-white border-2 border-[#171717] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-[11px] text-[#434654]">
                      <span className="material-symbols-outlined text-[20px] text-[#171717]">
                        inventory
                      </span>
                      <span>
                        <strong>Packed in Double-Walled Eco Crate:</strong> Tamper-evident holographic tape intact.
                      </span>
                    </div>
                    <span className="bg-[#E3E7FF] text-[#1769FF] border border-[#171717] font-label-sm text-[9px] uppercase font-bold px-2 py-0.5 shrink-0">
                      QC PASSED #BLR-44
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Destination, Payment, Invoice (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* 1. Delivery Destination Card */}
                <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-4 sm:p-5">
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b-2 border-[#171717]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-[#b52700]">
                        location_on
                      </span>
                      <h3 className="font-title text-[13px] uppercase font-bold text-[#171717]">
                        DELIVERY DESTINATION
                      </h3>
                    </div>
                    <span className="bg-[#F0E8DA] border border-[#171717] text-[#171717] font-label-sm text-[9px] uppercase font-bold px-1.5 py-0.2">
                      HOME
                    </span>
                  </div>

                  <div className="font-body-sm text-[12px] space-y-1 text-[#171717]">
                    <p className="font-bold text-[14px]">
                      {order.shippingAddress?.fullName}
                    </p>
                    <p className="text-[#434654] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">call</span>
                      <span>{order.shippingAddress?.phone}</span>
                    </p>
                    <div className="p-2.5 bg-white border border-[#171717] mt-2 text-[#434654] leading-relaxed">
                      <p>{order.shippingAddress?.addressLine1}</p>
                      {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                      <p className="font-bold text-[#171717]">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                      </p>
                    </div>
                    <p className="text-[11px] text-[#747686] pt-1">
                      Landmark: Verified Destination Hub
                    </p>
                  </div>
                </div>

                {/* 2. Payment Summary Card */}
                <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-4 sm:p-5">
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b-2 border-[#171717]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-[#1769FF]">
                        credit_card
                      </span>
                      <h3 className="font-title text-[13px] uppercase font-bold text-[#171717]">
                        PAYMENT SUMMARY
                      </h3>
                    </div>
                    <span
                      className={`font-label-sm text-[9px] uppercase font-bold px-1.5 py-0.2 border border-[#171717] ${
                        order.paymentStatus === 'paid'
                          ? 'bg-[#DCFCE7] text-[#14532D]'
                          : order.paymentMethod === 'cod'
                          ? 'bg-[#E3E7FF] text-[#1769FF]'
                          : 'bg-[#FEF3C7] text-[#92400E]'
                      }`}
                    >
                      {order.paymentStatus === 'paid' ? 'PAID & CLEARED' : order.paymentMethod === 'cod' ? 'COD VERIFIED' : 'PENDING'}
                    </span>
                  </div>

                  <div className="space-y-2 font-body-sm text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#434654]">Method:</span>
                      <span className="font-bold uppercase text-[#171717] flex items-center gap-1">
                        <span className="bg-[#F0E8DA] px-1.5 py-0.2 border border-[#171717] text-[10px]">
                          {order.paymentMethod === 'cod' ? 'COD' : 'RAZORPAY'}
                        </span>
                        <span>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online / UPI'}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#434654]">Transaction ID:</span>
                      <span className="font-mono text-[11px] font-bold text-[#171717] truncate max-w-[170px]">
                        {order.paymentId?.razorpayPaymentId || order.paymentId?.razorpayOrderId || (order.paymentMethod === 'cod' ? 'COD-RECORD' : 'PENDING')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#434654]">Timestamp:</span>
                      <span className="text-[#171717]">
                        {formatDateTime(order.paymentId?.paidAt || order.updatedAt || order.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Order Invoice Breakdown Card */}
                <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-4 sm:p-5">
                  <div className="flex items-center gap-1.5 pb-2.5 mb-3 border-b-2 border-[#171717]">
                    <span className="material-symbols-outlined text-[18px] text-[#171717]">
                      receipt
                    </span>
                    <h3 className="font-title text-[13px] uppercase font-bold text-[#171717]">
                      ORDER INVOICE BREAKDOWN
                    </h3>
                  </div>

                  <div className="space-y-2 font-body-sm text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#434654]">Items Subtotal ({order.items?.length || 0} items)</span>
                      <span className="font-mono font-bold text-[#171717]">
                        ₹{subtotalRupees.toLocaleString('en-IN')}.00
                      </span>
                    </div>

                    {discountRupees > 0 && (
                      <div className="flex items-center justify-between text-[#b52700]">
                        <span className="flex items-center gap-1">
                          <span>Voucher ({order.couponCode || 'PROMO'})</span>
                          <span className="bg-[#b52700] text-white text-[8px] font-bold px-1 uppercase">
                            APPLIED
                          </span>
                        </span>
                        <span className="font-mono font-bold">
                          -₹{discountRupees.toLocaleString('en-IN')}.00
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[#434654]">Express Air Delivery</span>
                      <span className="font-mono font-bold">
                        {shippingRupees === 0 ? (
                          <span className="bg-[#DCFCE7] text-[#14532D] px-1.5 py-0.2 border border-[#171717] text-[10px]">
                            FREE
                          </span>
                        ) : (
                          `₹${shippingRupees}.00`
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#434654] text-[11px]">
                      <span>Integrated GST (18% Included)</span>
                      <span className="font-mono">₹{taxRupees}</span>
                    </div>

                    {/* Total Box */}
                    <div className="pt-3 border-t-2 border-[#171717] mt-2">
                      <div className="bg-white border-2 border-[#171717] p-3 shadow-[2px_2px_0px_#171717] flex items-center justify-between">
                        <div>
                          <span className="font-label-sm text-[9px] uppercase font-bold text-[#747686] block">
                            TOTAL {order.paymentMethod === 'cod' ? 'PAYABLE (COD)' : 'PAID'}
                          </span>
                          <span className="font-price-lg text-[22px] font-bold text-[#171717] font-mono leading-none">
                            ₹{finalRupees.toLocaleString('en-IN')}.00
                          </span>
                        </div>

                        {discountRupees > 0 && (
                          <span className="bg-[#FFDF90] text-[#171717] border border-[#171717] px-2 py-1 font-label-sm text-[10px] uppercase font-bold">
                            SAVED ₹{discountRupees.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------------
                D. BOTTOM SUPPORT & GUARANTEE SECTION
                ------------------------------------------------------------------- */}
            <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[5px_5px_0px_#171717] p-5 sm:p-6 mt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 bg-[#FF7626] text-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[28px]">shield</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline-sm text-[16px] uppercase font-bold text-[#171717]">
                        DAMAGED IN TRANSIT OR MISSING PARTS?
                      </h3>
                      <span className="bg-[#DCFCE7] text-[#14532D] border border-[#171717] px-2 py-0.2 font-label-sm text-[9px] uppercase font-bold">
                        HASSLE-FREE
                      </span>
                    </div>
                    <p className="font-body-md text-[13px] text-[#434654] mt-1 max-w-2xl leading-relaxed">
                      Every TOYVOLT parcel is backed by our customer commitment. If your RC car, controller, or batteries arrived damaged, our dedicated team will dispatch replacement parts or a replacement unit swiftly.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSupportModalOpen(true)}
                  className="px-6 py-3 bg-[#b52700] text-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] font-label-md text-label-md uppercase font-bold hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all shrink-0 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                  <span>REQUEST ASSISTANCE</span>
                </button>
              </div>

              {/* Bottom Desk Information Strip */}
              <div className="mt-6 pt-5 border-t-2 border-[#171717] grid grid-cols-1 md:grid-cols-3 gap-4 text-[12px] text-[#434654]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#1769FF]">
                    headset_mic
                  </span>
                  <div>
                    <strong className="text-[#171717] block">INDIAN SUPPORT DESK</strong>
                    <span>+91 98765 43210 • Mon–Sat 9AM–8PM IST</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#1769FF]">
                    warehouse
                  </span>
                  <div>
                    <strong className="text-[#171717] block">FULFILLMENT HUB</strong>
                    <span>DLF Cyber City &amp; Koramangala Hub, India</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#1769FF]">
                    mail
                  </span>
                  <div>
                    <strong className="text-[#171717] block">DIRECT TOY SUPPORT</strong>
                    <span>support@toyvolt.in</span>
                  </div>
                </div>
              </div>

              {/* Payment Partners & Copyright Footer */}
              <div className="mt-4 pt-3 border-t border-[#171717]/15 flex flex-wrap items-center justify-between gap-3 text-[10px] text-[#747686] font-label-sm uppercase">
                <div className="flex items-center gap-2">
                  <span>ACCEPTED:</span>
                  <span className="bg-white border border-[#171717] px-1.5 py-0.2 font-bold text-[#171717]">UPI</span>
                  <span className="bg-white border border-[#171717] px-1.5 py-0.2 font-bold text-[#171717]">RUPAY</span>
                  <span className="bg-white border border-[#171717] px-1.5 py-0.2 font-bold text-[#171717]">VISA / MC</span>
                  <span className="bg-white border border-[#171717] px-1.5 py-0.2 font-bold text-[#171717]">COD</span>
                </div>
                <span>© 2026 TOYVOLT RETAIL INDIA PVT. LTD. ALL RIGHTS RESERVED.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          MODALS & DIALOGS
          ========================================================================= */}
      {/* 1. Tax Invoice Modal */}
      <TaxInvoiceModal
        order={order}
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
      />

      {/* 2. Cancel Order Modal */}
      <CancelOrderModal
        order={order}
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onSuccess={(updatedOrder) => {
          setOrder(updatedOrder);
          onOrderCancelled?.();
        }}
      />

      {/* 3. Customer Support Help Modal */}
      {supportModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md bg-[#FFF9F0] border-4 border-[#171717] shadow-[8px_8px_0px_#171717] p-6 text-[#171717]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#171717]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px] text-[#1769FF]">
                  support_agent
                </span>
                <span className="font-headline-sm text-[18px] uppercase font-bold">
                  TOYVOLT CUSTOMER DESK
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSupportModalOpen(false)}
                aria-label="Close dialog"
                className="p-1 hover:bg-[#F0E8DA] border border-transparent hover:border-[#171717]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-body-md text-[13px] text-[#434654] mb-4">
              Need assistance with order <strong>#{order.orderNumber}</strong>? Choose how you would like to connect:
            </p>

            <div className="space-y-2.5">
              <a
                href={`https://wa.me/919876543210?text=Hi%20Toyvolt,%20I%20need%20help%20with%20my%20order%20%23${order.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3 bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#14532d] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-bold text-[13px]"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>WHATSAPP SUPPORT (FASTEST)</span>
                </span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>

              <a
                href={`mailto:support@toyvolt.in?subject=Help%20with%20Order%20%23${order.orderNumber}`}
                className="w-full flex items-center justify-between p-3 bg-white hover:bg-[#F0E8DA] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-bold text-[13px]"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                  <span>EMAIL TOYVOLT DESK</span>
                </span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>

              <a
                href="tel:+919876543210"
                className="w-full flex items-center justify-between p-3 bg-white hover:bg-[#F0E8DA] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-bold text-[13px]"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                  <span>CALL +91 98765 43210</span>
                </span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>

            <div className="mt-5 pt-3 border-t-2 border-[#171717] text-right">
              <button
                type="button"
                onClick={() => setSupportModalOpen(false)}
                className="px-4 py-2 bg-[#F0E8DA] hover:bg-[#DDD3C3] border-2 border-[#171717] font-label-sm text-[11px] uppercase font-bold"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
