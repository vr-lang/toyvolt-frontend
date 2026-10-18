import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productApi, getErrorMessage } from '../lib/api';
import { useCart } from '../context/CartContext';
import { CollectionProductCard } from '../components/collection/CollectionProductCard';
import { BulkQuoteModal } from '../components/collection/BulkQuoteModal';
import { BRAND_CONFIG } from '../config/brandConfig';
import { useBodyScrollLock } from '../lib/useBodyScrollLock';

const WISHLIST_STORAGE_KEY = 'toyvolt_wishlist_ids_v1';

/**
 * 6 Intended Storefront Categories from Design Specifications.
 * Matchers inspect actual product data returned by backend to verify real published products.
 */
const INTENDED_CATEGORIES = [
  {
    id: 'rc-cars',
    label: 'RC Cars & Racers',
    matcher: (cat = '') => {
      const c = cat.toLowerCase();
      return c.includes('rc') || c.includes('car') || c.includes('remote') || c.includes('racer');
    }
  },
  {
    id: 'dollhouses',
    label: 'Dollhouses & Sets',
    matcher: (cat = '') => {
      const c = cat.toLowerCase();
      return c.includes('doll') || c.includes('house') || c.includes('playset');
    }
  },
  {
    id: 'mini-atms',
    label: 'Mini ATMs & Safes',
    matcher: (cat = '') => {
      const c = cat.toLowerCase();
      return c.includes('atm') || c.includes('safe') || c.includes('piggy') || c.includes('bank');
    }
  },
  {
    id: 'educational',
    label: 'Educational & Sensory',
    matcher: (cat = '') => {
      const c = cat.toLowerCase();
      return (
        c.includes('education') ||
        c.includes('sensor') ||
        c.includes('montessori') ||
        c.includes('learning')
      );
    }
  },
  {
    id: 'stem-blocks',
    label: 'STEM Building Blocks',
    matcher: (cat = '') => {
      const c = cat.toLowerCase();
      return c.includes('stem') || c.includes('block') || c.includes('build') || c.includes('brick');
    }
  },
  {
    id: 'festive-bundles',
    label: 'Festive Gift Bundles',
    matcher: (cat = '') => {
      const c = cat.toLowerCase();
      return c.includes('bundle') || c.includes('festive') || c.includes('gift');
    }
  }
];

const AGE_GROUPS = [
  { id: '3-5', label: '3 - 5 YEARS' },
  { id: '6-8', label: '6 - 8 YEARS' },
  { id: '9-12', label: '9 - 12 YEARS' },
  { id: '12+', label: '12+ YEARS' }
];

const DISCOUNT_OPTIONS = [
  { value: 50, label: '50% or more (Clearing Out)' },
  { value: 30, label: '30% or more' },
  { value: 20, label: '20% or more (Featured)' },
  { value: 0, label: 'All Discounts' }
];

export const CollectionPage = ({ backendServices }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, savedPincode, updateSavedPincode } = useCart();

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  }, []);

  // Products and loading state from backend
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter States initialized from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const cat = searchParams.get('category');
    return cat ? [cat] : [];
  });
  const [selectedAgeGroups, setSelectedAgeGroups] = useState([]);
  const [minDiscount, setMinDiscount] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 299, max: 7999 });

  // Sorting and Layout
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Delivery Checker PIN State
  const [pinInput, setPinInput] = useState(savedPincode || '');
  const [pinStatus, setPinStatus] = useState(null);

  // Modals & Mobile Drawer
  const [isBulkQuoteOpen, setIsBulkQuoteOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);

  // Lock body scroll when mobile filter drawer is open
  useBodyScrollLock(isMobileFilterOpen);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch live published products from backend API
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // Excludes draft, unpublished, or archived products according to backend visibility rules
      const { products } = await productApi.getProducts({ limit: 100 }, { forceRefresh: true });
      // Keep only customer-visible products
      const customerVisible = (products || []).filter(
        (p) => !p.isArchived && p.isActive !== false
      );
      setAllProducts(customerVisible);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not fetch catalog from Toyvolt backend.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Combine intended categories with any additional categories returned by backend
  const allCategoryDefinitions = useMemo(() => {
    const extraCategories = [];
    allProducts.forEach((p) => {
      if (p.category) {
        const matchesAnyIntended = INTENDED_CATEGORIES.some((ic) => ic.matcher(p.category));
        if (
          !matchesAnyIntended &&
          !extraCategories.some((ec) => ec.id.toLowerCase() === p.category.toLowerCase())
        ) {
          extraCategories.push({
            id: p.category.toLowerCase().replace(/\s+/g, '-'),
            label: p.category,
            matcher: (cat = '') => cat.toLowerCase() === p.category.toLowerCase()
          });
        }
      }
    });
    return [...INTENDED_CATEGORIES, ...extraCategories];
  }, [allProducts]);

  // Derive verified categories and accurate product counts from real published catalogue
  const categoryStats = useMemo(() => {
    return allCategoryDefinitions.map((cat) => {
      // Products strictly belonging to this category
      const matchingProducts = allProducts.filter((p) => cat.matcher(p.category || ''));
      const totalCount = matchingProducts.length;

      // Real in-stock count
      const inStockCount = matchingProducts.filter(
        (p) => p.isInStock && p.availableStock > 0
      ).length;

      return {
        ...cat,
        totalCount,
        inStockCount,
        hasPublishedProducts: totalCount > 0,
        isAllOutOfStock: totalCount > 0 && inStockCount === 0
      };
    });
  }, [allCategoryDefinitions, allProducts]);

  // Compute actual catalogue price boundaries from published products
  const catalogPriceBounds = useMemo(() => {
    if (allProducts.length === 0) return { min: 299, max: 7999 };
    const prices = allProducts.map((p) => p.sellingPriceInRupees || 1799);
    return {
      min: Math.min(...prices, 299),
      max: Math.max(...prices, 7999)
    };
  }, [allProducts]);

  // Handle PIN verification
  const handlePinCheck = (e) => {
    e.preventDefault();
    const cleaned = pinInput.trim();
    if (!/^[1-9][0-9]{5}$/.test(cleaned)) {
      setPinStatus({
        success: false,
        message: 'Please enter a valid 6-digit Indian PIN code.'
      });
      return;
    }
    updateSavedPincode(cleaned);
    setPinStatus({
      success: true,
      message: `PIN ${cleaned} pre-cleared for express logistics! Free shipping on orders ≥ ₹${BRAND_CONFIG.shipping.freeShippingThresholdRupees}.`
    });
  };

  // Add to cart handler
  const handleAddToCart = async (product) => {
    setAddingProductId(product.id || product._id);
    try {
      await addToCart(product, 1, true);
    } finally {
      setAddingProductId(null);
    }
  };

  // Filter products strictly based on customer selection and real inventory
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // 1. In-Stock Filter: exclude products that cannot currently be purchased
      if (inStockOnly && (!product.isInStock || product.availableStock <= 0)) {
        return false;
      }

      // 2. Search Query: matches name, description, sku, category
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name?.toLowerCase().includes(q);
        const matchesDesc = product.description?.toLowerCase().includes(q);
        const matchesSku = product.sku?.toLowerCase().includes(q);
        const matchesCat = product.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesSku && !matchesCat) {
          return false;
        }
      }

      // 3. Category Filter: selecting an available category returns only matching products
      if (selectedCategories.length > 0) {
        const matchesCategory = selectedCategories.some((catId) => {
          const cat = categoryStats.find((c) => c.id === catId);
          return cat ? cat.matcher(product.category || '') : false;
        });
        if (!matchesCategory) return false;
      }

      // 4. Price Filter
      const price = product.sellingPriceInRupees || 0;
      if (price < priceRange.min || price > priceRange.max) {
        return false;
      }

      // 5. Discount Filter: only apply if product actually has compareAtPrice
      if (minDiscount > 0) {
        const discount =
          product.compareAtPriceInRupees && product.compareAtPriceInRupees > product.sellingPriceInRupees
            ? Math.round(
                ((product.compareAtPriceInRupees - product.sellingPriceInRupees) /
                  product.compareAtPriceInRupees) *
                  100
              )
            : 0;
        if (discount < minDiscount) {
          return false;
        }
      }

      // 6. Age Group Filter from real product specifications
      if (selectedAgeGroups.length > 0) {
        const specs = product.specifications || {};
        const ageSpec = specs['Age Group'] || specs['Age'] || '';
        const hasAgeMatch = selectedAgeGroups.some((ag) => {
          if (ag === '3-5') return ageSpec.includes('3') || ageSpec.includes('4') || ageSpec.includes('5');
          if (ag === '6-8') return ageSpec.includes('6') || ageSpec.includes('7') || ageSpec.includes('8');
          if (ag === '9-12') return ageSpec.includes('9') || ageSpec.includes('10') || ageSpec.includes('12');
          if (ag === '12+') return ageSpec.includes('12+') || ageSpec.includes('14') || ageSpec.includes('Speed');
          return false;
        });
        if (ageSpec && !hasAgeMatch) {
          return false;
        }
      }

      return true;
    });
  }, [allProducts, inStockOnly, searchQuery, selectedCategories, categoryStats, priceRange, minDiscount, selectedAgeGroups]);

  // Sorting Logic on actual published products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price_asc') {
      return list.sort((a, b) => a.sellingPriceInRupees - b.sellingPriceInRupees);
    }
    if (sortBy === 'price_desc') {
      return list.sort((a, b) => b.sellingPriceInRupees - a.sellingPriceInRupees);
    }
    if (sortBy === 'name_asc') {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === 'newest') {
      return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }
    // Default: 'featured' (in-stock first, then highest discount)
    return list.sort((a, b) => {
      const aInStock = a.isInStock && a.availableStock > 0 ? 1 : 0;
      const bInStock = b.isInStock && b.availableStock > 0 ? 1 : 0;
      if (bInStock !== aInStock) return bInStock - aInStock;
      return (b.discountPercentage || 0) - (a.discountPercentage || 0);
    });
  }, [filteredProducts, sortBy]);

  // Paginated display
  const totalItems = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  const remainingItems = Math.max(0, totalItems - currentPage * itemsPerPage);

  // Toggle Category selection (only for categories with published products)
  const handleCategoryToggle = (categoryId) => {
    const cat = categoryStats.find((c) => c.id === categoryId);
    if (!cat || !cat.hasPublishedProducts) return;

    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
    setCurrentPage(1);
  };

  // Clear ONLY category filter (All Categories button)
  const handleClearCategoriesOnly = () => {
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  // Reset ALL filters
  const handleResetAll = () => {
    setSearchQuery('');
    setInStockOnly(false);
    setSelectedCategories([]);
    setSelectedAgeGroups([]);
    setMinDiscount(0);
    setPriceRange({ min: catalogPriceBounds.min, max: catalogPriceBounds.max });
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Active filter chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (inStockOnly) {
      chips.push({ id: 'inStock', label: 'In-Stock Only', onRemove: () => setInStockOnly(false) });
    }
    selectedCategories.forEach((catId) => {
      const match = categoryStats.find((c) => c.id === catId);
      chips.push({
        id: `cat-${catId}`,
        label: match ? match.label : catId,
        onRemove: () => setSelectedCategories((prev) => prev.filter((c) => c !== catId))
      });
    });
    if (priceRange.min > catalogPriceBounds.min || priceRange.max < catalogPriceBounds.max) {
      chips.push({
        id: 'price',
        label: `₹${priceRange.min} - ₹${priceRange.max}`,
        onRemove: () => setPriceRange({ min: catalogPriceBounds.min, max: catalogPriceBounds.max })
      });
    }
    selectedAgeGroups.forEach((ag) => {
      const match = AGE_GROUPS.find((a) => a.id === ag);
      chips.push({
        id: `age-${ag}`,
        label: match ? `Ages ${match.label}` : ag,
        onRemove: () => setSelectedAgeGroups((prev) => prev.filter((a) => a !== ag))
      });
    });
    if (minDiscount > 0) {
      chips.push({
        id: 'discount',
        label: `Discount ${minDiscount}%+`,
        onRemove: () => setMinDiscount(0)
      });
    }
    if (searchQuery.trim()) {
      chips.push({
        id: 'search',
        label: `Search: "${searchQuery}"`,
        onRemove: () => setSearchQuery('')
      });
    }
    return chips;
  }, [inStockOnly, selectedCategories, categoryStats, priceRange, catalogPriceBounds, selectedAgeGroups, minDiscount, searchQuery]);

  /* ------------------------------------------------------------- */
  /* FILTER SIDEBAR COMPONENT                                      */
  /* ------------------------------------------------------------- */
  const renderFilterSidebar = () => (
    <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[5px_5px_0px_#171717] p-5 space-y-6">
      {/* 1. Sidebar Header with Filter Icon & RESET ALL */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#171717]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#171717]">tune</span>
          <h2 className="font-title text-base uppercase font-bold text-[#171717] tracking-wider">
            FILTERS
          </h2>
        </div>
        <button
          type="button"
          onClick={handleResetAll}
          className="font-label-sm text-xs font-bold uppercase text-[#FF7626] hover:underline cursor-pointer"
        >
          RESET ALL
        </button>
      </div>

      {/* 2. IN-STOCK ONLY Filter (Matches reference screenshot) */}
      <label className="flex items-center justify-between p-3.5 bg-[#FFFDF9] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] cursor-pointer hover:bg-[#FFF3DF] transition-colors">
        <div>
          <span className="block font-title text-xs uppercase font-bold text-[#171717]">
            IN-STOCK ONLY
          </span>
          <span className="block font-body-sm text-[11px] text-[#747686]">
            Hide out of stock items
          </span>
        </div>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => {
            setInStockOnly(e.target.checked);
            setCurrentPage(1);
          }}
          className="w-5 h-5 accent-[#1769FF] rounded-none border-2 border-[#171717] cursor-pointer"
        />
      </label>

      {/* 3. CATEGORY Section Header with ALL CATEGORIES button */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-title text-xs uppercase font-bold text-[#171717]">
            CATEGORY
          </span>
          <button
            type="button"
            onClick={handleClearCategoriesOnly}
            title="Clear category filter to view all categories"
            className={`font-label-sm text-[10px] font-bold uppercase px-2 py-0.5 border border-[#171717] transition-all cursor-pointer ${
              selectedCategories.length === 0
                ? 'bg-[#171717] text-white shadow-[1px_1px_0px_#171717]'
                : 'bg-[#FFF3DF] text-[#171717] hover:bg-[#ffdf90] shadow-[1px_1px_0px_#171717]'
            }`}
          >
            ALL CATEGORIES
          </button>
        </div>

        {/* Category Rows with real published counts or COMING SOON */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="space-y-2 py-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-5 bg-gray-200 animate-pulse rounded" />
              ))}
            </div>
          ) : (
            categoryStats.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              const hasProducts = cat.hasPublishedProducts;

              return (
                <label
                  key={cat.id}
                  className={`flex items-center justify-between text-xs font-body-md transition-colors py-1 ${
                    hasProducts
                      ? 'cursor-pointer hover:text-primary text-[#171717]'
                      : 'cursor-not-allowed opacity-50 select-none text-[#747686]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={!hasProducts}
                      onChange={() => handleCategoryToggle(cat.id)}
                      className="w-4 h-4 accent-[#1769FF] rounded-none border-2 border-[#171717] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    />
                    <span
                      className={
                        isSelected
                          ? 'font-bold text-[#171717]'
                          : hasProducts
                          ? 'text-[#171717]'
                          : 'text-[#747686]'
                      }
                    >
                      {cat.label}
                    </span>
                  </div>

                  {/* Real count for published categories, COMING SOON for zero-product categories */}
                  {hasProducts ? (
                    <span
                      className={`font-label-sm text-[10px] font-bold px-2 py-0.5 border border-[#171717] ${
                        cat.isAllOutOfStock
                          ? 'bg-[#FEE2E2] text-[#991B1B]'
                          : 'bg-[#FFFDF9] text-[#171717]'
                      } shadow-[1px_1px_0px_#171717]`}
                      title={
                        cat.isAllOutOfStock
                          ? `${cat.totalCount} products (currently out of stock)`
                          : `${cat.totalCount} published products`
                      }
                    >
                      {cat.totalCount}
                    </span>
                  ) : (
                    <span className="font-label-sm text-[9px] font-bold uppercase px-1.5 py-0.5 border border-[#DDD3C3] bg-[#F0E8DA] text-[#747686] tracking-wider select-none">
                      COMING SOON
                    </span>
                  )}
                </label>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Price Range (₹) */}
      <div className="pt-4 border-t-2 border-[#171717]/15">
        <div className="flex items-center justify-between mb-2">
          <span className="font-title text-xs uppercase font-bold text-[#171717]">
            PRICE RANGE (₹)
          </span>
          <span className="font-label-sm text-xs font-bold text-[#1769FF]">
            ₹{priceRange.min.toLocaleString('en-IN')} - ₹{priceRange.max.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Dual Input Boxes */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <span className="font-label-sm text-[10px] uppercase text-[#747686] block mb-1">
              MIN PRICE
            </span>
            <div className="flex items-center bg-[#FFFCF7] border-2 border-[#171717] px-2 py-1 shadow-[2px_2px_0px_#171717]">
              <span className="text-xs font-bold text-[#171717] mr-1">₹</span>
              <input
                type="number"
                min={catalogPriceBounds.min}
                max={priceRange.max}
                value={priceRange.min}
                onChange={(e) => {
                  const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                  setPriceRange((prev) => ({ ...prev, min: val }));
                  setCurrentPage(1);
                }}
                className="w-full bg-transparent font-title text-xs font-bold text-[#171717] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <span className="font-label-sm text-[10px] uppercase text-[#747686] block mb-1">
              MAX PRICE
            </span>
            <div className="flex items-center bg-[#FFFCF7] border-2 border-[#171717] px-2 py-1 shadow-[2px_2px_0px_#171717]">
              <span className="text-xs font-bold text-[#171717] mr-1">₹</span>
              <input
                type="number"
                min={priceRange.min}
                max={catalogPriceBounds.max * 2}
                value={priceRange.max}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 7999;
                  setPriceRange((prev) => ({ ...prev, max: val }));
                  setCurrentPage(1);
                }}
                className="w-full bg-transparent font-title text-xs font-bold text-[#171717] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Target Age Group */}
      <div className="pt-4 border-t-2 border-[#171717]/15">
        <span className="font-title text-xs uppercase font-bold text-[#171717] block mb-2.5">
          TARGET AGE GROUP
        </span>

        <div className="grid grid-cols-2 gap-2">
          {AGE_GROUPS.map((ag) => {
            const isSelected = selectedAgeGroups.includes(ag.id);
            return (
              <button
                key={ag.id}
                type="button"
                onClick={() => {
                  setSelectedAgeGroups((prev) =>
                    prev.includes(ag.id) ? prev.filter((id) => id !== ag.id) : [...prev, ag.id]
                  );
                  setCurrentPage(1);
                }}
                className={`py-2 px-1 text-center font-title text-[11px] font-bold uppercase border-2 border-[#171717] transition-all shadow-[2px_2px_0px_#171717] cursor-pointer ${
                  isSelected
                    ? 'bg-[#171717] text-white shadow-none translate-x-0.5 translate-y-0.5'
                    : 'bg-[#FFF9F0] text-[#171717] hover:bg-[#FFF3DF]'
                }`}
              >
                {ag.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Savings & Discounts */}
      <div className="pt-4 border-t-2 border-[#171717]/15">
        <span className="font-title text-xs uppercase font-bold text-[#171717] block mb-2.5">
          SAVINGS &amp; DISCOUNTS
        </span>

        <div className="space-y-2">
          {DISCOUNT_OPTIONS.map((opt) => {
            const isSelected = minDiscount === opt.value;
            return (
              <label
                key={opt.value}
                className="flex items-center gap-2.5 text-xs text-[#171717] cursor-pointer hover:text-primary transition-colors"
              >
                <input
                  type="radio"
                  name="discountFilter"
                  checked={isSelected}
                  onChange={() => {
                    setMinDiscount(opt.value);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 accent-[#E53E3E] cursor-pointer"
                />
                <span className={isSelected ? 'font-bold text-[#171717]' : 'text-[#434654]'}>
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 7. Check Dispatch Time Card */}
      <div className="pt-4 border-t-2 border-[#171717]/15">
        <div className="bg-[#FFF3DF] border-2 border-[#171717] p-3 shadow-[3px_3px_0px_#171717]">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="material-symbols-outlined text-[18px] text-[#171717]">
              local_shipping
            </span>
            <span className="font-title text-[11px] uppercase font-bold text-[#171717]">
              CHECK DISPATCH TIME
            </span>
          </div>

          <form onSubmit={handlePinCheck} className="flex gap-1.5 mb-2">
            <input
              type="text"
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter PIN (e.g. 110001)"
              className="w-full bg-[#FFFCF7] border-2 border-[#171717] px-2.5 py-1.5 font-body-sm text-xs text-[#171717] focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#1769FF] text-white font-title text-xs uppercase px-3 py-1.5 border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-bold hover:translate-x-0.5 hover:translate-y-0.5 transition-all shrink-0 cursor-pointer"
            >
              GO
            </button>
          </form>

          {pinStatus ? (
            <p
              className={`text-[10px] font-bold leading-tight ${
                pinStatus.success ? 'text-[#15803D]' : 'text-[#DC2626]'
              }`}
            >
              {pinStatus.message}
            </p>
          ) : (
            <p className="font-body-sm text-[10px] text-[#747686] leading-tight">
              Pre-cleared for express logistics across 19,000+ Indian PIN codes.
            </p>
          )}
        </div>
      </div>

      {/* Bottom Apply All Criteria Button */}
      <button
        type="button"
        onClick={() => setIsMobileFilterOpen(false)}
        className="w-full bg-[#FFF9F0] hover:bg-[#F0E8DA] text-[#171717] font-title text-xs uppercase py-3 px-4 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all text-center font-bold block cursor-pointer"
      >
        APPLY ALL CRITERIA
      </button>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#F7F3EB] text-[#171717]">
      {/* 1. SLIM YELLOW ANNOUNCEMENT BAR */}
      <div className="w-full bg-[#FCE154] border-b-2 border-[#171717] py-1.5 px-4 overflow-hidden">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#171717]">
              local_shipping
            </span>
            <span className="font-title text-[11px] uppercase font-bold text-[#171717] tracking-wider">
              FREE EXPRESS SHIPPING ACROSS INDIA ON ORDERS OVER ₹{BRAND_CONFIG.shipping.freeShippingThresholdRupees} • CODE: WELCOME100
            </span>
          </div>

          <span className="hidden md:inline-block font-title text-[11px] uppercase font-bold text-[#171717] tracking-wider">
            • FESTIVE DISPATCH GUARANTEED
          </span>
        </div>
      </div>

      {/* 2. THIN PROMOTIONAL TICKER UNDERNEATH */}
      <div className="w-full bg-[#FFF275] border-b-2 border-[#171717] py-1.5 px-4 overflow-hidden">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-title text-[10px] sm:text-[11px] font-bold text-[#171717] uppercase tracking-wide">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#FF7626]">bolt</span>
            <span>
              FESTIVE RUSH: 1,420 ORDERS DISPATCHED IN THE LAST 24 HOURS ACROSS DELHI, MUMBAI &amp; BENGALURU
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[#434654]">
            <span>BIS CERTIFIED CM/L-8400192834</span>
            <span>•</span>
            <span>SAME-DAY METRO DISPATCH</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN COLLECTION CONTENT */}
      <div className="max-w-[1360px] mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-title text-xs uppercase font-bold text-[#747686]">
          <Link to="/" className="hover:text-[#171717] transition-colors">
            HOME
          </Link>
          <span>/</span>
          <Link to="/collection" className="hover:text-[#171717] transition-colors">
            SHOP
          </Link>
          <span>/</span>
          <span className="px-2 py-0.5 border border-[#171717] bg-[#FFF9F0] text-[#171717] shadow-[1px_1px_0px_#171717]">
            ALL TOYS
          </span>
        </nav>

        {/* Collection Heading Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-[#171717]/15">
          <div className="space-y-2">
            {/* Badges */}
            <div className="flex items-center gap-2">
              <span className="bg-[#1769FF] text-white font-title text-[11px] font-bold uppercase px-2.5 py-0.5 border border-[#171717] shadow-[2px_2px_0px_#171717]">
                AUTUMN &apos;24 CURATION
              </span>
              <span className="text-[#FF7626] border border-[#FF7626] font-title text-[11px] font-bold uppercase px-2.5 py-0.5 bg-[#FFF9F0]">
                VERIFIED NON-TOXIC
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-headline-lg-mobile md:text-5xl font-black uppercase text-[#171717] tracking-tight">
              THE TOY COLLECTION.
            </h1>

            {/* Dynamic Real Counter from Actual Published Products */}
            <p className="font-body-md text-sm text-[#434654] max-w-2xl leading-relaxed">
              Engineered for wild imagination, spatial problem-solving, and unbreakable weekend thrill.
              Showing <strong className="text-[#171717] font-bold">{filteredProducts.length}</strong> of{' '}
              <strong className="text-[#171717] font-bold">{allProducts.length}</strong> rigorously safety-tested toys.
            </p>
          </div>

          {/* Quick Filter Input & View Toggles */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 lg:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#747686]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Quick filter by toy name or keyword..."
                className="w-full bg-[#FFFCF7] text-[#171717] pl-9 pr-3 py-2.5 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] font-body-sm text-xs focus:outline-none focus:bg-[#FFF9F0]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 hover:text-black cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={`w-10 h-10 flex items-center justify-center border-2 border-[#171717] rounded shadow-[2px_2px_0px_#171717] transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#171717] text-white'
                    : 'bg-[#FFF9F0] text-[#171717] hover:bg-[#F0E8DA]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">grid_view</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`w-10 h-10 flex items-center justify-center border-2 border-[#171717] rounded shadow-[2px_2px_0px_#171717] transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#171717] text-white'
                    : 'bg-[#FFF9F0] text-[#171717] hover:bg-[#F0E8DA]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">view_list</span>
              </button>
            </div>

            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden h-10 px-3.5 bg-[#FFF3DF] text-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-title text-xs font-bold uppercase flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>FILTERS</span>
              {activeChips.length > 0 && (
                <span className="bg-[#1769FF] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                  {activeChips.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 4. TWO-COLUMN CATALOGUE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24">
            {renderFilterSidebar()}
          </aside>

          {/* RIGHT: Product Catalogue */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Active Chips & Sorting Bar */}
            <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-3 flex flex-wrap items-center justify-between gap-3">
              {/* Active Chips List */}
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <span className="font-title text-[11px] font-bold uppercase text-[#747686]">
                  ACTIVE CHIPS:
                </span>

                {activeChips.length === 0 ? (
                  <span className="font-body-sm text-xs text-[#747686] italic">
                    Showing full collection
                  </span>
                ) : (
                  activeChips.map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={chip.onRemove}
                      className="bg-white border border-[#171717] px-2 py-0.5 font-label-sm text-[11px] font-bold text-[#171717] uppercase flex items-center gap-1 shadow-[1px_1px_0px_#171717] hover:bg-[#FFE6E6] transition-colors cursor-pointer"
                      title="Click to remove filter"
                    >
                      <span>{chip.label}</span>
                      <span className="text-[12px] font-black text-[#FF7626]">✕</span>
                    </button>
                  ))
                )}

                {activeChips.length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="font-label-sm text-[11px] font-bold uppercase text-[#FF7626] hover:underline ml-2 cursor-pointer"
                  >
                    CLEAR ALL
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <label htmlFor="sort-select" className="font-title text-[11px] font-bold uppercase text-[#747686]">
                  SORT BY:
                </label>
                <div className="relative">
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-[#FFFCF7] text-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] px-3 py-1.5 font-title text-xs font-bold uppercase cursor-pointer focus:outline-none"
                  >
                    <option value="featured">FEATURED SELECTION</option>
                    <option value="newest">NEWEST ARRIVALS</option>
                    <option value="price_asc">PRICE: LOW TO HIGH</option>
                    <option value="price_desc">PRICE: HIGH TO LOW</option>
                    <option value="name_asc">NAME: A TO Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid / Loading State / Error State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-4 h-96 animate-pulse flex flex-col justify-between"
                  >
                    <div className="w-24 h-4 bg-gray-300 mb-2" />
                    <div className="w-full aspect-[4/3] bg-gray-200 border-2 border-[#171717] mb-3" />
                    <div className="w-3/4 h-5 bg-gray-300 mb-2" />
                    <div className="w-1/2 h-4 bg-gray-200 mb-4" />
                    <div className="w-full h-10 bg-gray-300" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[5px_5px_0px_#171717] p-8 text-center space-y-4">
                <span className="material-symbols-outlined text-4xl text-[#E53E3E]">
                  error
                </span>
                <h3 className="font-headline-sm text-lg font-bold uppercase text-[#171717]">
                  UNABLE TO LOAD CATALOGUE
                </h3>
                <p className="font-body-md text-sm text-[#434654] max-w-md mx-auto">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={loadProducts}
                  className="bg-[#1769FF] text-white font-title text-xs uppercase px-5 py-2.5 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] font-bold cursor-pointer"
                >
                  RETRY CONNECTION
                </button>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[5px_5px_0px_#171717] p-10 text-center space-y-4">
                <span className="material-symbols-outlined text-5xl text-[#747686]">
                  search_off
                </span>
                <h3 className="font-headline-sm text-xl font-bold uppercase text-[#171717]">
                  NO TOYS MATCH YOUR ACTIVE FILTERS
                </h3>
                <p className="font-body-md text-sm text-[#434654] max-w-md mx-auto">
                  Try widening your price range, clearing active category chips, or resetting all criteria.
                </p>
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="bg-[#1769FF] text-white font-title text-xs uppercase px-6 py-3 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] font-bold hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                >
                  RESET ALL CRITERIA
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                    : 'flex flex-col gap-4'
                }
              >
                {paginatedProducts.map((prod) => (
                  <CollectionProductCard
                    key={prod.id || prod._id}
                    product={prod}
                    viewMode={viewMode}
                    isWishlisted={wishlist.includes(prod.id || prod._id)}
                    onToggleWishlist={toggleWishlist}
                    onAddToCart={handleAddToCart}
                    isAdding={addingProductId === (prod.id || prod._id)}
                  />
                ))}
              </div>
            )}

            {/* 5. PROMOTIONAL BULK GIFTING BANNER */}
            <div className="bg-[#FFF3DF] border-2 border-[#171717] shadow-[6px_6px_0px_#171717] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 max-w-xl">
                <span className="inline-block bg-[#E53E3E] text-white font-title text-[10px] font-bold uppercase px-2.5 py-0.5 border border-[#171717] shadow-[2px_2px_0px_#171717]">
                  FESTIVE BULK GIFTING
                </span>

                <h3 className="font-headline-sm text-xl sm:text-2xl font-black uppercase text-[#171717] leading-tight">
                  PLANNING A BIRTHDAY PARTY OR RETURN GIFTS?
                </h3>

                <p className="font-body-sm text-xs sm:text-sm text-[#434654] leading-relaxed">
                  Get an extra 15% off when bundling 5+ units of any educational toy or mini ATM.
                  Custom theme gift packaging &amp; personal name tags included.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsBulkQuoteOpen(true)}
                className="bg-white hover:bg-gray-50 text-[#171717] font-title text-xs font-bold uppercase px-5 py-3.5 border-2 border-[#171717] shadow-[4px_4px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>GET PARTY QUOTE</span>
                <span className="material-symbols-outlined text-[18px]">magic_button</span>
              </button>
            </div>

            {/* 6. PAGINATION CONTROLS */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Numbered Page Navigation */}
              <div className="flex items-center gap-1.5 font-title text-xs font-bold uppercase">
                <span className="text-[#747686] mr-1">PAGES:</span>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className={`min-w-[34px] h-[34px] px-2 flex items-center justify-center border-2 border-[#171717] shadow-[2px_2px_0px_#171717] transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#171717] text-white shadow-none translate-x-0.5 translate-y-0.5'
                        : 'bg-[#FFF9F0] text-[#171717] hover:bg-[#FFF3DF]'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {currentPage < totalPages && (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((p) => p + 1);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="h-[34px] px-3 bg-[#FFF9F0] text-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#FFF3DF] flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <span>NEXT</span>
                    <span>→</span>
                  </button>
                )}
              </div>

              {/* Load More Toys Button */}
              {remainingItems > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="bg-[#1769FF] text-white font-title text-xs uppercase px-6 py-3 border-2 border-[#171717] shadow-[4px_4px_0px_#171717] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all flex items-center gap-2 font-bold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                  <span>LOAD MORE TOYS ({remainingItems} MORE)</span>
                </button>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* 7. MOBILE FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMobileFilterOpen(false);
          }}
        >
          <div className="w-full max-w-xs sm:max-w-sm h-full bg-[#FFF9F0] border-l-2 border-[#171717] shadow-[-6px_0px_0px_#171717] overflow-y-auto p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#171717]">
                <h3 className="font-title text-sm uppercase font-bold text-[#171717]">
                  FILTER CATALOGUE
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 flex items-center justify-center border-2 border-[#171717] bg-[#FFF9F0] font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {renderFilterSidebar()}
            </div>

            <div className="pt-4 mt-4 border-t-2 border-[#171717]">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-[#1769FF] text-white font-title text-xs uppercase py-3.5 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] font-bold cursor-pointer"
              >
                VIEW {filteredProducts.length} MATCHING TOYS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. BULK QUOTE MODAL */}
      <BulkQuoteModal
        isOpen={isBulkQuoteOpen}
        onClose={() => setIsBulkQuoteOpen(false)}
      />
    </div>
  );
};

export default CollectionPage;
