import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminApi, getErrorMessage } from '../lib/api';

export const AdminPage = ({ onCatalogUpdated }) => {
  const { isAuthenticated, isAdmin, openAuthModal } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // Quick stock/price editor state
  const [editingProductId, setEditingProductId] = useState(null);
  const [editPriceRupees, setEditPriceRupees] = useState('');
  const [editStock, setEditStock] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadAdminData = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return;
    setLoading(true);
    setError('');
    try {
      const [dashData, prodData, ordData] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getProducts(),
        adminApi.getOrders({ limit: 20 })
      ]);
      setDashboard(dashData);
      setProducts(prodData?.products || []);
      setOrders(ordData?.orders || []);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load admin dashboard data.'));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadAdminData();
  }, [loadAdminData]);

  const handleStartEdit = (prod) => {
    setEditingProductId(prod._id || prod.id);
    setEditPriceRupees(String(Math.round((prod.sellingPrice || 0) / 100)));
    setEditStock(String(prod.availableStock ?? 0));
  };

  const handleSaveProductUpdate = async (e) => {
    e.preventDefault();
    if (!editingProductId) return;
    setStatusMsg('');
    setError('');
    try {
      const sellingPricePaise = Math.round(Number(editPriceRupees) * 100);
      const availableStock = parseInt(editStock, 10);
      await adminApi.updateProduct(editingProductId, {
        sellingPrice: sellingPricePaise,
        availableStock
      });
      setStatusMsg('Product stock and price updated on backend.');
      setEditingProductId(null);
      await loadAdminData();
      onCatalogUpdated?.();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update product.'));
    }
  };

  const handleImageUpload = async (prod, file) => {
    if (!file) return;
    setUploadingImage(true);
    setError('');
    setStatusMsg('');
    try {
      const uploaded = await adminApi.uploadImage(file);
      if (uploaded?.url) {
        const nextImages = [
          ...(prod.images || []),
          { url: uploaded.url, publicId: uploaded.publicId, isPrimary: false }
        ];
        await adminApi.updateProduct(prod._id || prod.id, { images: nextImages });
        setStatusMsg('Image uploaded to Cloudinary and attached to product.');
        await loadAdminData();
        onCatalogUpdated?.();
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Image upload failed.'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOrderStatusChange = async (orderId, orderStatus) => {
    setError('');
    setStatusMsg('');
    try {
      await adminApi.updateOrderStatus(orderId, { orderStatus });
      setStatusMsg(`Order status updated to "${orderStatus}".`);
      await loadAdminData();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update order status.'));
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <section className="w-full max-w-[960px] mx-auto px-4 lg:px-8 py-14">
        <div className="bg-[#FFF9F0] border-2 border-on-surface shadow-[6px_6px_0px_#191919] p-8">
          <span className="inline-block bg-secondary-container text-on-secondary font-label-sm text-label-sm uppercase px-2.5 py-1 border border-on-surface mb-3 font-bold">
            PROTECTED NAMESPACE (`/api/v1/admin`)
          </span>
          <h1 className="font-headline-md text-headline-md uppercase text-on-surface mb-2">
            ADMINISTRATOR AUTHORIZATION REQUIRED
          </h1>
          <p className="font-body-md text-on-surface-variant mb-6">
            The Toyvolt Admin Backoffice is strictly protected by server-side{' '}
            <code>protect</code> and <code>requireAdmin</code> middleware. Sign in with an
            administrator account created via <code>npm run seed:admin</code> to manage catalog
            inventory, Cloudinary uploads, and orders.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="bg-primary-container text-on-primary font-title text-title uppercase px-6 py-3.5 border-2 border-on-surface shadow-[4px_4px_0px_#191919]"
          >
            SIGN IN AS ADMIN
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[1360px] mx-auto px-4 lg:px-8 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-label-sm text-label-sm uppercase text-secondary font-bold block">
            TOYVOLT BACKOFFICE
          </span>
          <h1 className="font-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
            ADMIN DASHBOARD &amp; INVENTORY CONTROL
          </h1>
        </div>
        <button
          type="button"
          onClick={loadAdminData}
          disabled={loading}
          className="px-4 py-2.5 bg-surface-container-lowest border-2 border-on-surface shadow-[3px_3px_0px_#191919] font-label-md text-label-md uppercase font-bold"
        >
          {loading ? 'REFRESHING...' : 'SYNC DASHBOARD'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container border-2 border-on-surface font-bold">
          {error}
        </div>
      )}
      {statusMsg && (
        <div className="p-4 bg-tertiary-fixed text-on-tertiary-fixed border-2 border-on-surface font-bold">
          ✓ {statusMsg}
        </div>
      )}

      {/* Metrics Strip */}
      {dashboard?.metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FFF9F0] border-2 border-on-surface shadow-[4px_4px_0px_#191919] p-4">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant block">
              Total Orders
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">
              {dashboard.metrics.totalOrders}
            </span>
          </div>
          <div className="bg-[#FFF9F0] border-2 border-on-surface shadow-[4px_4px_0px_#191919] p-4">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant block">
              Paid Revenue
            </span>
            <span className="font-headline-md text-headline-md text-primary">
              ₹{(dashboard.metrics.paidRevenueInRupees || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-[#FFF9F0] border-2 border-on-surface shadow-[4px_4px_0px_#191919] p-4">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant block">
              Pending Orders
            </span>
            <span className="font-headline-md text-headline-md text-secondary">
              {dashboard.metrics.pendingOrders}
            </span>
          </div>
          <div className="bg-[#FFF9F0] border-2 border-on-surface shadow-[4px_4px_0px_#191919] p-4">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant block">
              Delivered Orders
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">
              {dashboard.metrics.deliveredOrders}
            </span>
          </div>
        </div>
      )}

      {/* Product Stock & Cloudinary Image Management */}
      <div className="bg-[#FFF9F0] border-2 border-on-surface shadow-[5px_5px_0px_#191919] p-6">
        <h2 className="font-headline-sm text-headline-sm uppercase mb-4 pb-2 border-b-2 border-on-surface">
          PRODUCT CATALOG &amp; STOCK MANAGEMENT
        </h2>
        <div className="space-y-4">
          {products.map((prod) => {
            const pid = prod._id || prod.id;
            const isEditing = editingProductId === pid;
            return (
              <div
                key={pid}
                className="bg-surface-container-lowest border-2 border-on-surface p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div>
                  <span className="font-label-sm text-label-sm uppercase text-secondary font-bold">
                    SKU: {prod.sku}
                  </span>
                  <h3 className="font-title text-title text-on-surface">{prod.name}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Price: ₹{Math.round((prod.sellingPrice || 0) / 100).toLocaleString('en-IN')} •
                    Available Stock: <strong>{prod.availableStock}</strong>
                  </p>
                </div>

                {isEditing ? (
                  <form
                    onSubmit={handleSaveProductUpdate}
                    className="flex flex-wrap items-center gap-2"
                  >
                    <input
                      type="number"
                      min="1"
                      value={editPriceRupees}
                      onChange={(e) => setEditPriceRupees(e.target.value)}
                      placeholder="Price (₹)"
                      className="w-28 px-3 py-1.5 border-2 border-on-surface font-body-sm"
                    />
                    <input
                      type="number"
                      min="0"
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      placeholder="Stock"
                      className="w-24 px-3 py-1.5 border-2 border-on-surface font-body-sm"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-primary-container text-on-primary font-label-sm text-label-sm uppercase font-bold border-2 border-on-surface"
                    >
                      SAVE
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProductId(null)}
                      className="px-3 py-1.5 bg-surface border-2 border-on-surface font-label-sm text-label-sm uppercase font-bold"
                    >
                      CANCEL
                    </button>
                  </form>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(prod)}
                      className="px-3.5 py-2 bg-tertiary-fixed border-2 border-on-surface font-label-sm text-label-sm uppercase font-bold shadow-[2px_2px_0px_#191919]"
                    >
                      EDIT PRICE / STOCK
                    </button>

                    <label className="cursor-pointer px-3.5 py-2 bg-surface border-2 border-on-surface font-label-sm text-label-sm uppercase font-bold shadow-[2px_2px_0px_#191919]">
                      <span>{uploadingImage ? 'UPLOADING...' : '+ UPLOAD IMAGE'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={(e) => handleImageUpload(prod, e.target.files?.[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Status Management */}
      <div className="bg-[#FFF9F0] border-2 border-on-surface shadow-[5px_5px_0px_#191919] p-6">
        <h2 className="font-headline-sm text-headline-sm uppercase mb-4 pb-2 border-b-2 border-on-surface">
          RECENT ORDERS ({orders.length})
        </h2>
        <div className="space-y-3">
          {orders.map((ord) => (
            <div
              key={ord._id}
              className="bg-surface-container-lowest border-2 border-on-surface p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <span className="font-title text-title text-on-surface block">
                  {ord.orderNumber} — ₹{Math.round((ord.finalAmount || 0) / 100).toLocaleString('en-IN')}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Customer: {ord.shippingAddress?.fullName} • Payment: {ord.paymentStatus}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor={`status-${ord._id}`} className="sr-only">
                  Order Status
                </label>
                <select
                  id={`status-${ord._id}`}
                  value={ord.orderStatus}
                  onChange={(e) => handleOrderStatusChange(ord._id, e.target.value)}
                  className="px-3 py-2 bg-surface border-2 border-on-surface font-label-sm text-label-sm uppercase font-bold"
                >
                  {['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(
                    (st) => (
                      <option key={st} value={st}>
                        {st.toUpperCase()}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
