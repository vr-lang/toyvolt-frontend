import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderApi, getErrorMessage } from '../lib/api';
import { LoadingState } from '../components/common/LoadingState';

export const OrdersPage = ({ onOrderCancelled }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingMap, setTrackingMap] = useState({});
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError('');
    try {
      const data = await orderApi.getMyOrders({ page: 1, limit: 20 });
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

  const handleCheckTracking = async (orderId) => {
    try {
      const data = await orderApi.getOrderTracking(orderId);
      setTrackingMap((prev) => ({
        ...prev,
        [orderId]:
          data?.shipment || {
            noShipmentYet: true,
            message: data?.message || 'Shipment has not been dispatched yet.'
          }
      }));
    } catch (err) {
      setTrackingMap((prev) => ({
        ...prev,
        [orderId]: {
          noShipmentYet: true,
          message: getErrorMessage(err, 'Could not fetch tracking.')
        }
      }));
    }
  };

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
        <div className="bg-[#FFF9F0] border-2 border-on-surface shadow-[6px_6px_0px_#191919] p-8 text-center">
          <h1 className="font-headline-md text-headline-md uppercase text-on-surface mb-2">
            SIGN IN TO VIEW YOUR ORDERS
          </h1>
          <p className="font-body-md text-on-surface-variant mb-6">
            Access your live Toyvolt order history, self-service cancellations, and shipment tracking.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="bg-primary-container text-on-primary font-title text-title uppercase px-6 py-3.5 border-2 border-on-surface shadow-[4px_4px_0px_#191919]"
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
    <section className="w-full max-w-[1360px] mx-auto px-4 lg:px-8 py-10 md:py-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="font-label-sm text-label-sm uppercase text-secondary font-bold block">
            CUSTOMER PORTAL
          </span>
          <h1 className="font-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
            MY ORDERS &amp; SHIPMENT TRACKING
          </h1>
        </div>
        <button
          type="button"
          onClick={fetchOrders}
          className="px-4 py-2 bg-surface-container-lowest border-2 border-on-surface shadow-[3px_3px_0px_#191919] font-label-md text-label-md uppercase font-bold w-fit"
        >
          REFRESH ORDERS
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container border-2 border-on-surface font-bold">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-[#FFF9F0] border-2 border-on-surface shadow-[5px_5px_0px_#191919] p-8 text-center">
          <h2 className="font-headline-sm text-headline-sm uppercase mb-2">
            NO ORDERS PLACED YET
          </h2>
          <p className="font-body-md text-on-surface-variant mb-6">
            Once you order your Toyvolt Apex-1 RC Drift Car, it will appear here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-container text-on-primary font-title text-title uppercase px-6 py-3 border-2 border-on-surface shadow-[4px_4px_0px_#191919]"
          >
            EXPLORE THE APEX-1
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const finalRupees = Math.round((order.finalAmount || 0) / 100);
            const canCancel =
              order.orderStatus !== 'cancelled' &&
              order.orderStatus !== 'shipped' &&
              order.orderStatus !== 'delivered';
            const trackingInfo = trackingMap[order._id];

            return (
              <div
                key={order._id}
                className="bg-[#FFF9F0] border-2 border-on-surface shadow-[5px_5px_0px_#191919] p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b-2 border-on-surface">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase text-on-surface-variant block">
                      ORDER NUMBER
                    </span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                      {order.orderNumber}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed border border-on-surface font-label-sm text-label-sm uppercase font-bold">
                      STATUS: {order.orderStatus}
                    </span>
                    <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed border border-on-surface font-label-sm text-label-sm uppercase font-bold">
                      PAYMENT: {order.paymentStatus} ({order.paymentMethod})
                    </span>
                    <span className="font-price-lg text-price-lg text-primary font-bold ml-2">
                      ₹{finalRupees.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-surface-container-lowest border border-on-surface p-3 flex items-center justify-between gap-4"
                    >
                      <div>
                        <span className="font-title text-[16px] text-on-surface block">
                          {item.name}
                        </span>
                        <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                          SKU: {item.sku} • Qty: {item.quantity}
                        </span>
                      </div>
                      <span className="font-title text-title text-on-surface">
                        ₹{Math.round((item.total || 0) / 100).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-on-surface/20">
                  <div className="font-body-sm text-body-sm text-on-surface-variant">
                    Delivering to: <strong>{order.shippingAddress?.fullName}</strong>,{' '}
                    {order.shippingAddress?.city} ({order.shippingAddress?.postalCode})
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleCheckTracking(order._id)}
                      className="px-4 py-2 bg-surface-container-lowest border-2 border-on-surface shadow-[2px_2px_0px_#191919] font-label-sm text-label-sm uppercase font-bold hover:bg-tertiary-fixed transition-colors"
                    >
                      CHECK SHIPMENT STATUS
                    </button>

                    {canCancel && (
                      <button
                        type="button"
                        disabled={cancellingId === order._id}
                        onClick={() => handleCancelOrder(order._id)}
                        className="px-4 py-2 bg-error-container text-on-error-container border-2 border-on-surface shadow-[2px_2px_0px_#191919] font-label-sm text-label-sm uppercase font-bold disabled:opacity-50"
                      >
                        {cancellingId === order._id ? 'CANCELLING...' : 'CANCEL ORDER'}
                      </button>
                    )}
                  </div>
                </div>

                {trackingInfo && (
                  <div className="mt-4 p-3 bg-surface-container-lowest border-2 border-on-surface font-body-sm text-body-sm">
                    {trackingInfo.noShipmentYet ? (
                      <span>• {trackingInfo.message}</span>
                    ) : (
                      <div>
                        <p className="font-bold">
                          Courier: {trackingInfo.courierName || 'Assigned'} • AWB:{' '}
                          {trackingInfo.awbCode || 'Pending'} • Status: {trackingInfo.status}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default OrdersPage;
