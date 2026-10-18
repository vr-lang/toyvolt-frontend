import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productApi, getErrorMessage } from '../lib/api';
import { useCart } from '../context/CartContext';
import { QuantitySelector } from '../components/product/QuantitySelector';
import { ProductImageWithFallback } from '../components/product/ProductImageWithFallback';
import { DeliverySection } from '../components/home/DeliverySection';
import { ProductFeatures } from '../components/home/ProductFeatures';
import { ProductReviewsSection } from '../components/product/ProductReviewsSection';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { BRAND_CONFIG } from '../config/brandConfig';
import { Star } from 'lucide-react';

export const ProductPage = ({
  initialProduct,
  isCatalogLoading,
  backendServices
}) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState('');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    if (initialProduct && (!slug || initialProduct.slug === slug)) {
      setProduct(initialProduct);
      setLoading(false);
      return;
    }

    if (!slug) return;
    let isMounted = true;
    setLoading(true);
    setError('');

    productApi
      .getProductBySlug(slug)
      .then((fetched) => {
        if (isMounted) {
          setProduct(fetched);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(getErrorMessage(err, 'Failed to load product details.'));
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug, initialProduct]);

  if (loading || isCatalogLoading) {
    return <LoadingState message="Loading Flagship RC Car Specifications..." />;
  }

  if (error || !product) {
    return (
      <ErrorState
        title="Product Not Found"
        message={error || 'Could not locate this Toyvolt product.'}
        onRetry={() => navigate('/')}
      />
    );
  }

  const images = product.images?.length > 0 ? product.images : [];
  const activeImage = images[selectedImageIdx]?.url || product.primaryImage;
  const specs = product.specifications || {};

  const handleAdd = async () => {
    await addToCart(product, quantity, true);
  };

  const handleBuyNow = async () => {
    const ok = await addToCart(product, quantity, false);
    if (ok) navigate('/checkout');
  };

  return (
    <div className="w-full pb-12">
      {/* Breadcrumb Bar */}
      <div className="bg-surface-container border-b-2 border-on-surface py-3 px-4 lg:px-8">
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-2 font-label-sm text-label-sm uppercase">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-on-surface-variant hover:text-on-surface font-bold">
              HOME
            </Link>
            <span>/</span>
            <span className="text-on-surface-variant">{product.category}</span>
            <span>/</span>
            <span className="text-primary font-bold truncate max-w-[240px] sm:max-w-none">
              {product.name}
            </span>
          </div>
          <span className="font-bold text-on-surface">SKU: {product.sku}</span>
        </div>
      </div>

      {/* Main Product Details Container */}
      <section className="w-full max-w-[1360px] mx-auto px-4 lg:px-8 py-8 md:py-12">
        <div className="bg-[#FFF9F0] border-2 border-on-surface shadow-[6px_6px_0px_#191919] p-5 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Gallery Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="w-full aspect-[4/3] bg-surface-container-lowest border-2 border-on-surface shadow-[4px_4px_0px_#191919] overflow-hidden relative">
                {product.discountPercentage > 0 && (
                  <span className="absolute top-3 left-3 bg-secondary-container text-on-secondary px-3 py-1 font-label-sm text-label-sm font-bold border border-on-surface z-10 shadow-[2px_2px_0px_#191919]">
                    -{product.discountPercentage}% OFF
                  </span>
                )}
                <ProductImageWithFallback
                  src={activeImage}
                  alt={product.name}
                  fetchPriority="high"
                  width={900}
                  height={675}
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={img.publicId || idx}
                      type="button"
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`h-24 border-2 border-on-surface overflow-hidden transition-all ${
                        selectedImageIdx === idx
                          ? 'shadow-[4px_4px_0px_#1769FF] ring-2 ring-primary'
                          : 'shadow-[2px_2px_0px_#191919] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <ProductImageWithFallback
                        src={img.url}
                        alt={`${product.name} angle ${idx + 1}`}
                        width={240}
                        height={180}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Purchase Info Column */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase px-3 py-1 border border-on-surface shadow-[2px_2px_0px_#191919] font-bold">
                  {product.category}
                </span>
                <span
                  className={`font-label-sm text-label-sm uppercase px-3 py-1 border border-on-surface shadow-[2px_2px_0px_#191919] font-bold ${
                    product.isInStock
                      ? 'bg-[#dcfce7] text-[#14532d]'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  {product.isInStock
                    ? `In Stock (${product.availableStock} Available)`
                    : 'Out of Stock'}
                </span>
              </div>

              <h1 className="font-headline-lg-mobile sm:text-headline-lg text-on-surface leading-tight">
                {product.name}
              </h1>

              {/* Star Rating Snapshot */}
              <div className="flex items-center gap-2">
                {product.totalReviews > 0 ? (
                  <a
                    href="#product-reviews"
                    className="inline-flex items-center gap-1.5 font-label text-xs sm:text-sm font-bold text-on-surface hover:text-primary transition-colors"
                  >
                    <div className="flex items-center text-[#FF7626]">
                      <Star className="w-4 h-4 fill-[#FF7626]" />
                    </div>
                    <span>{product.averageRating?.toFixed(1) || '0.0'}</span>
                    <span className="text-on-surface-variant font-normal">
                      ({product.totalReviews} {product.totalReviews === 1 ? 'verified review' : 'verified reviews'})
                    </span>
                  </a>
                ) : (
                  <a
                    href="#product-reviews"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <Star className="w-3.5 h-3.5 text-on-surface-variant/40" />
                    <span>No customer reviews yet • Be the first to review</span>
                  </a>
                )}
              </div>

              <div className="bg-surface-container-lowest border-2 border-on-surface shadow-[4px_4px_0px_#191919] p-4 flex flex-wrap items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-display-mobile text-display-mobile text-primary font-bold">
                    ₹{product.sellingPriceInRupees.toLocaleString('en-IN')}
                  </span>
                  {product.compareAtPriceInRupees && (
                    <span className="font-title text-title text-on-surface-variant line-through">
                      ₹{product.compareAtPriceInRupees.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                {product.savingsRupees > 0 && (
                  <span className="bg-secondary-container text-on-secondary font-label-sm text-label-sm uppercase px-2.5 py-1 border border-on-surface font-bold">
                    YOU SAVE ₹{product.savingsRupees.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                {product.description}
              </p>

              {/* Verified Coupon Highlight */}
              <div className="bg-tertiary-fixed/70 border-2 border-on-surface p-3.5 shadow-[3px_3px_0px_#191919]">
                <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface block mb-1">
                  AVAILABLE LAUNCH COUPONS (APPLY AT CART / CHECKOUT):
                </span>
                <div className="flex flex-wrap gap-2">
                  {BRAND_CONFIG.verifiedCoupons.map((c) => (
                    <span
                      key={c.code}
                      className="bg-surface-container-lowest px-2.5 py-1 border border-on-surface font-label-sm text-label-sm font-bold"
                    >
                      {c.code}: {c.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="pt-4 border-t-2 border-on-surface/20 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-label-md text-label-md uppercase font-bold">
                      QUANTITY:
                    </span>
                    <QuantitySelector
                      quantity={quantity}
                      maxStock={product.availableStock}
                      disabled={!product.isInStock}
                      onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                      onIncrease={() =>
                        setQuantity((q) => Math.min(product.availableStock, q + 1))
                      }
                    />
                  </div>
                  <span className="font-title text-title text-on-surface font-bold">
                    Total: ₹{(product.sellingPriceInRupees * quantity).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!product.isInStock}
                    className="py-4 px-6 bg-primary-container text-on-primary font-title text-title uppercase border-2 border-on-surface shadow-[4px_4px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#191919] transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      add_shopping_cart
                    </span>
                    <span>ADD TO CART</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={!product.isInStock}
                    className="py-4 px-6 bg-secondary-container text-on-secondary font-title text-title uppercase border-2 border-on-surface shadow-[4px_4px_0px_#191919] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#191919] transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">bolt</span>
                    <span>BUY NOW</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PIN Code & Shipping Rules Section */}
      <DeliverySection backendServices={backendServices} />

      {/* Full Specifications Grid */}
      <ProductFeatures product={product} />

      {/* Verified Customer Reviews & Community Gallery */}
      <div id="product-reviews">
        <ProductReviewsSection product={product} />
      </div>
    </div>
  );
};

export default ProductPage;
