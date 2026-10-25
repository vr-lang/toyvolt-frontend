import axios from 'axios';

const DEFAULT_API_BASE_URL = 'https://toyvolt-backend-03.onrender.com/api/v1';

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, '');

const TOKEN_STORAGE_KEY = 'toyvolt_access_token';
const REMEMBERED_EMAIL_KEY = 'toyvolt_remembered_email';

export const getStoredToken = () => {
  try {
    return (
      localStorage.getItem(TOKEN_STORAGE_KEY) ||
      sessionStorage.getItem(TOKEN_STORAGE_KEY)
    );
  } catch {
    return null;
  }
};

export const setStoredToken = (token, { rememberDevice = true } = {}) => {
  try {
    if (token) {
      if (rememberDevice) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      } else {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage quota errors
  }
};

export const getRememberedEmail = () => {
  try {
    return localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';
  } catch {
    return '';
  }
};

export const setRememberedEmail = (email) => {
  try {
    if (email) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }
  } catch {
    // Ignore storage errors
  }
};

/**
 * Shared Axios Client for all Toyvolt backend requests.
 * Supports both HTTP-only cookies (withCredentials: true) and Bearer token fallback
 * for cross-domain Render deployments.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 35000, // Accommodates Render free-tier cold start wakeup
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Extract clean user-facing error message from backend response without leaking stack traces.
 */
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error) return fallback;
  const responseData = error.response?.data;
  if (responseData) {
    if (Array.isArray(responseData.details) && responseData.details.length > 0) {
      return responseData.details.map((d) => d.message).join(' • ');
    }
    if (typeof responseData.message === 'string' && responseData.message.trim()) {
      return responseData.message;
    }
  }
  if (error.code === 'ECONNABORTED') {
    return 'The Toyvolt server is waking up from idle mode on Render. Please click Retry in a moment.';
  }
  if (error.message === 'Network Error') {
    return 'Unable to reach the Toyvolt backend server. Please check your connection or retry.';
  }
  return error.message || fallback;
};

export const VERIFIED_LOCAL_PRODUCT_IMAGES = [
  {
    url: '/images/products/spray-monster-hero.jpg',
    publicId: 'spray_monster_hero',
    isPrimary: true
  },
  {
    url: '/images/products/spray-monster-angles.jpg',
    publicId: 'spray_monster_angles',
    isPrimary: false
  },
  {
    url: '/images/products/spray-monster-features.jpg',
    publicId: 'spray_monster_features',
    isPrimary: false
  },
  {
    url: '/images/products/spray-monster-dimensions.jpg',
    publicId: 'spray_monster_dimensions',
    isPrimary: false
  },
  {
    url: '/images/products/spray-monster-box.jpg',
    publicId: 'spray_monster_box',
    isPrimary: false
  },
  {
    url: '/images/products/spray-monster-remote.jpg',
    publicId: 'spray_monster_remote',
    isPrimary: false
  }
];

/**
 * Normalize backend Product document so components have reliable accessors
 * whether price is accessed in integer paise or rupees.
 */
export const normalizeProduct = (raw) => {
  if (!raw) return null;
  const sellingPricePaise = typeof raw.sellingPrice === 'number' ? raw.sellingPrice : 0;
  const sellingPriceRupees =
    typeof raw.sellingPriceInRupees === 'number'
      ? raw.sellingPriceInRupees
      : Math.round(sellingPricePaise / 100);

  const compareAtPricePaise =
    typeof raw.compareAtPrice === 'number' && raw.compareAtPrice > sellingPricePaise
      ? raw.compareAtPrice
      : null;

  const compareAtPriceRupees =
    compareAtPricePaise !== null
      ? typeof raw.compareAtPriceInRupees === 'number'
        ? raw.compareAtPriceInRupees
        : Math.round(compareAtPricePaise / 100)
      : null;

  const discountPercentage =
    compareAtPricePaise && compareAtPricePaise > sellingPricePaise
      ? Math.round(((compareAtPricePaise - sellingPricePaise) / compareAtPricePaise) * 100)
      : 0;

  const savingsRupees =
    compareAtPriceRupees && compareAtPriceRupees > sellingPriceRupees
      ? compareAtPriceRupees - sellingPriceRupees
      : 0;

  const availableStock = typeof raw.availableStock === 'number' ? raw.availableStock : 0;
  const isInStock = typeof raw.isInStock === 'boolean' ? raw.isInStock : availableStock > 0;

  let images = Array.isArray(raw.images)
    ? raw.images.filter((img) => img && typeof img.url === 'string' && img.url.trim() !== '')
    : [];

  // If backend returns dead temporary sandbox Cloudinary URLs (404) or empty images, substitute verified local assets
  const hasDeadCloudinarySandbox = images.some((img) =>
    typeof img.url === 'string' &&
    (img.url.includes('cloudinary-tools-uploads') || img.url.includes('dtz0urit6'))
  );

  if (images.length === 0 || hasDeadCloudinarySandbox) {
    images = VERIFIED_LOCAL_PRODUCT_IMAGES;
  }

  const primaryImage =
    images.find((img) => img.isPrimary)?.url ||
    images[0]?.url ||
    VERIFIED_LOCAL_PRODUCT_IMAGES[0].url;

  const specifications =
    raw.specifications && typeof raw.specifications === 'object'
      ? raw.specifications
      : {};

  return {
    id: raw.id || raw._id,
    _id: raw._id || raw.id,
    name: raw.name || 'Toyvolt RC Car',
    slug: raw.slug || '',
    sku: raw.sku || '',
    description: raw.description || '',
    category: raw.category || 'Remote Control Cars',
    sellingPrice: sellingPricePaise,
    sellingPriceInRupees: sellingPriceRupees,
    compareAtPrice: compareAtPricePaise,
    compareAtPriceInRupees: compareAtPriceRupees,
    discountPercentage,
    savingsRupees,
    availableStock,
    reservedStock: typeof raw.reservedStock === 'number' ? raw.reservedStock : 0,
    isInStock,
    weightGrams: raw.weightGrams || null,
    dimensions: raw.dimensions || null,
    specifications,
    images,
    primaryImage,
    isActive: raw.isActive !== false
  };
};

// Deduplicated in-flight product request cache
let inflightProductsPromise = null;

export const productApi = {
  async getProducts(params = {}, { forceRefresh = false } = {}) {
    const hasQueryParams = Object.keys(params).length > 0;
    if (!hasQueryParams && !forceRefresh && inflightProductsPromise) {
      return inflightProductsPromise;
    }

    const requestPromise = api
      .get('/products', { params })
      .then((res) => {
        const rawProducts = res.data?.data?.products || [];
        return {
          products: rawProducts.map(normalizeProduct).filter(Boolean),
          pagination: res.data?.data?.pagination || null
        };
      })
      .finally(() => {
        if (!hasQueryParams) {
          inflightProductsPromise = null;
        }
      });

    if (!hasQueryParams) {
      inflightProductsPromise = requestPromise;
    }
    return requestPromise;
  },

  async getProductBySlug(slug) {
    const res = await api.get(`/products/${encodeURIComponent(slug)}`);
    return normalizeProduct(res.data?.data?.product);
  },

  async getCategories() {
    const res = await api.get('/products/categories');
    return res.data?.data?.categories || [];
  }
};

export const healthApi = {
  async getHealth() {
    const res = await api.get('/health');
    return res.data;
  }
};

export const authApi = {
  async register({ name, email, password }) {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  },

  async verifyEmail({ email, otp, rememberDevice = true }) {
    const res = await api.post('/auth/verify-email', { email, otp });
    if (res.data?.data?.accessToken) {
      setStoredToken(res.data.data.accessToken, { rememberDevice });
    }
    return res.data;
  },

  async resendOtp({ email, purpose = 'register' }) {
    const res = await api.post('/auth/resend-otp', { email, purpose });
    return res.data;
  },

  async login({ email, password, rememberDevice = true }) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.data?.accessToken) {
      setStoredToken(res.data.data.accessToken, { rememberDevice });
    }
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      setStoredToken(null);
    }
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data?.data?.user || null;
  },

  async forgotPassword({ email }) {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  async resetPassword({ email, otp, newPassword }) {
    const res = await api.post('/auth/reset-password', { email, otp, newPassword });
    return res.data;
  }
};

export const cartApi = {
  async getCart() {
    const res = await api.get('/cart');
    return res.data?.data?.cart;
  },

  async addItem({ productId, quantity = 1 }) {
    const res = await api.post('/cart/items', { productId, quantity });
    return res.data?.data?.cart;
  },

  async updateItemQuantity(productId, quantity) {
    const res = await api.patch(`/cart/items/${productId}`, { quantity });
    return res.data?.data?.cart;
  },

  async removeItem(productId) {
    const res = await api.delete(`/cart/items/${productId}`);
    return res.data?.data?.cart;
  },

  async clearCart() {
    const res = await api.delete('/cart');
    return res.data?.data?.cart;
  }
};

export const couponApi = {
  async validateCoupon({ code, subtotal }) {
    const res = await api.post('/coupons/validate', { code, subtotal });
    return res.data?.data;
  }
};

export const orderApi = {
  async createOrder({ shippingAddress, couponCode, paymentMethod = 'razorpay', directItems }) {
    const payload = {
      shippingAddress,
      paymentMethod
    };
    if (couponCode) payload.couponCode = couponCode;
    if (directItems && directItems.length > 0) payload.directItems = directItems;

    const res = await api.post('/orders', payload);
    return res.data?.data?.order;
  },

  async getMyOrders(params = { page: 1, limit: 10 }) {
    const res = await api.get('/orders/my', { params });
    return res.data?.data;
  },

  async getOrderById(orderId) {
    const res = await api.get(`/orders/${orderId}`);
    return res.data?.data?.order;
  },

  async getOrderTracking(orderId, refresh = false) {
    const res = await api.get(`/orders/${orderId}/tracking${refresh ? '?refresh=true' : ''}`);
    return res.data?.data;
  },

  async refreshOrderTracking(orderId) {
    const res = await api.post(`/orders/${orderId}/tracking/refresh`);
    return res.data?.data;
  },

  async cancelOrder(orderId, reason) {
    const res = await api.post(`/orders/${orderId}/cancel`, { reason });
    return res.data?.data?.order;
  }
};

export const paymentApi = {
  async createPaymentOrder(orderId) {
    const res = await api.post('/payments/create-order', { orderId });
    return res.data?.data;
  },

  async verifyPayment({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    const res = await api.post('/payments/verify', {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });
    return res.data?.data?.order;
  }
};

export const adminApi = {
  async getDashboard() {
    const res = await api.get('/admin/dashboard');
    return res.data?.data;
  },

  async getProducts() {
    const res = await api.get('/admin/products');
    return res.data?.data;
  },

  async createProduct(productData) {
    const res = await api.post('/admin/products', productData);
    return res.data?.data?.product;
  },

  async updateProduct(id, productData) {
    const res = await api.patch(`/admin/products/${id}`, productData);
    return res.data?.data?.product;
  },

  async deleteProduct(id) {
    const res = await api.delete(`/admin/products/${id}`);
    return res.data;
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data?.data;
  },

  async getOrders(params = {}) {
    const res = await api.get('/admin/orders', { params });
    return res.data?.data;
  },

  async updateOrderStatus(orderId, { orderStatus, cancellationReason }) {
    const res = await api.patch(`/admin/orders/${orderId}/status`, {
      orderStatus,
      cancellationReason
    });
    return res.data?.data?.order;
  },

  async getCoupons() {
    const res = await api.get('/admin/coupons');
    return res.data?.data?.coupons || [];
  }
};

export const reviewApi = {
  async getProductReviews(identifier, params = {}) {
    const res = await api.get(`/products/${identifier}/reviews`, { params });
    return res.data?.data;
  },

  async checkEligibility(identifier) {
    const res = await api.get(`/products/${identifier}/reviews/eligibility`);
    return res.data?.data;
  },

  async submitReview(identifier, formData) {
    const res = await api.post(`/products/${identifier}/reviews`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data?.data;
  }
};

export const shippingApi = {
  async getShippingSettings() {
    try {
      const res = await api.get('/shipments/settings');
      return res.data?.data?.settings || null;
    } catch {
      return null;
    }
  }
};

export default api;
