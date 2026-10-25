import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderApi, getErrorMessage } from '../lib/api';
import { AccountSidebar } from '../components/account/AccountSidebar';
import { LoadingState } from '../components/common/LoadingState';

export const OrdersPage = ({ onOrderCancelled }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError('');
    try {
      const data = await orderApi.getMyOrders({ page: 1, limit: 30 });
      setOrders(data?.orders || []);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load your orders.'));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async (orderId) => {
    setCancellingId(orderId);
    try {
      await orderApi.cancelOrder(orderId, 'Cancelled by customer from My Orders page');
      await fetchOrders();
      onOrderCancelled?.();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to cancel order.'));
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="w-full max-w-[960px] mx-auto px-4 lg:px-8 py-14">
        <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[6px_6px_0px_#171717] p-8 text-center">
          <span className="material-symbols-outlined text-[48px] text-[#1769FF] mb-2 block">
            lock
          </span>
          <h1 className="font-headline-md text-headline-md uppercase text-[#171717] mb-2 font-bold">
            SIGN IN TO VIEW YOUR ORDERS
          </h1>
          <p className="font-body-md text-on-surface-variant mb-6 max-w-md mx-auto">
            Access your live Toyvolt order history, real-time dispatch telemetry, and self-service tracking.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="bg-[#1769FF] text-white font-title text-title uppercase px-6 py-3.5 border-2 border-[#171717] shadow-[4px_4px_0px_#171717] font-bold"
          >
            SIGN IN / REGISTER
          </button>
        </div>
      </section>
    );
  }

  if (loading) {
    return <LoadingState message="Fetching Your Toyvolt Order History..." />;
  }

  return (
    <div className="w-full min-h-screen bg-[#F7F3EB] pb-16">
      {/* Top Breadcrumb Strip */}
      <div className="w-full bg-[#F0E8DA] border-b-2 border-[#171717] py-2.5 px-4 lg:px-8">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-2 font-label-sm text-[11px] uppercase tracking-wider font-bold">
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
            <span className="text-[#1769FF]">MY ORDERS</span>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            className="text-[#171717] hover:text-[#1769FF] flex items-center gap-1 text-[10px]"
          >
            <span className="material-symbols-outlined text-[14px]">sync</span>
            <span>REFRESH</span>
          </button>
        </div>
      </div>

      <main className="max-w-[1360px] mx-auto px-4 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          {/* Left Sidebar */}
          <AccountSidebar activeTab="orders" />

          {/* Main Orders List */}
          <div className="flex-1 w-full min-w-0 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b-2 border-[#171717]">
              <div>
                <span className="font-label-sm text-[10px] uppercase text-[#FF7626] font-bold block">
                  CUSTOMER DASHBOARD
                </span>
                <h1 className="font-headline-md text-[22px] sm:text-[26px] uppercase font-bold text-[#171717]">
                  MY ORDERS &amp; TRACKING
                </h1>
              </div>
              <span className="font-label-sm text-[11px] uppercase font-bold bg-[#F0E8DA] px-2.5 py-1 border border-[#171717]">
                TOTAL: {orders.length} ORDER{orders.length === 1 ? '' : 'S'}
              </span>
            </div>

            {error && (
              <div className="p-4 bg-error-container text-on-error-container border-2 border-[#171717] font-bold">
                {error}
              </div>
            )}

            {orders.length === 0 ? (
              <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[5px_5px_0px_#171717] p-8 text-center">
                <span className="material-symbols-outlined text-[48px] text-[#747686] mb-2 block">
                  shopping_cart
                </span>
                <h2 className="font-headline-sm text-headline-sm uppercase mb-2 font-bold">
                  NO ORDERS PLACED YET
                </h2>
                <p className="font-body-md text-on-surface-variant mb-6 max-w-md mx-auto">
                  Once you order your Toyvolt RC car, it will appear here with live tracking telemetry.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-[#1769FF] text-white font-title text-title uppercase px-6 py-3 border-2 border-[#171717] shadow-[4px_4px_0px_#171717] font-bold"
                >
                  EXPLORE TOYVOLT CATALOG
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => {
                  const finalRupees = Math.round((order.finalAmount || 0) / 100);
                  const canCancel =
                    order.orderStatus !== 'cancelled' &&
                    order.orderStatus !== 'shipped' &&
                    order.orderStatus !== 'delivered';

                  return (
                    <div
                      key={order._id}
                      className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[5px_5px_0px_#171717] p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_#171717]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b-2 border-[#171717]">
                        <div>
                          <span className="font-label-sm text-[10px] uppercase text-[#747686] font-bold block">
                            ORDER NUMBER
                          </span>
                          <Link
                            to={`/orders/${order._id}`}
                            className="font-headline-sm text-[20px] font-bold text-[#171717] hover:text-[#1769FF] transition-colors"
                          >
                            #{order.orderNumber}
                          </Link>
                          <span className="text-[11px] text-[#747686] block mt-0.5">
                            Placed on:{' '}
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 bg-[#E3E7FF] text-[#1769FF] border border-[#171717] font-label-sm text-[10px] uppercase font-bold">
                            STATUS: {order.orderStatus}
                          </span>
                          <span className="px-2.5 py-1 bg-[#FEF3C7] text-[#92400E] border border-[#171717] font-label-sm text-[10px] uppercase font-bold">
                            {order.paymentStatus === 'paid' ? 'PAID' : 'PENDING'} ({order.paymentMethod?.toUpperCase()})
                          </span>
                          <span className="font-price-lg text-[20px] text-[#171717] font-bold ml-2 font-mono">
                            ₹{finalRupees.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-2 mb-4">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-[#171717] p-3 flex items-center justify-between gap-4"
                          >
                            <div>
                              <span className="font-title text-[14px] text-[#171717] block font-bold">
                                {item.name}
                              </span>
                              <span className="font-label-sm text-[10px] uppercase text-[#747686]">
                                SKU: {item.sku} • Qty: {item.quantity}
                              </span>
                            </div>
                            <span className="font-title text-[14px] text-[#171717] font-mono font-bold">
                              ₹{Math.round((item.total || 0) / 100).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#171717]/15">
                        <div className="font-body-sm text-[12px] text-[#434654]">
                          Delivering to: <strong>{order.shippingAddress?.fullName}</strong>,{' '}
                          {order.shippingAddress?.city} ({order.shippingAddress?.postalCode})
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                          <Link
                            to={`/orders/${order._id}`}
                            className="px-4 py-2 bg-[#1769FF] text-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-label-sm text-[11px] uppercase font-bold hover:translate-x-0.5 hover:translate-y-0.5 transition-transform flex items-center gap-1.5"
                          >
                            <span>VIEW ORDER DETAILS &amp; TRACKING</span>
                            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                          </Link>

                          {canCancel && (
                            <button
                              type="button"
                              disabled={cancellingId === order._id}
                              onClick={() => handleCancelOrder(order._id)}
                              className="px-3 py-2 bg-[#FEE2E2] text-[#991B1B] border-2 border-[#171717] font-label-sm text-[10px] uppercase font-bold disabled:opacity-50"
                            >
                              {cancellingId === order._id ? 'CANCELLING...' : 'CANCEL'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
