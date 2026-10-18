import React, { useState, useEffect, useCallback } from 'react';
import { 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  MessageSquare, 
  Camera, 
  Filter, 
  ChevronDown, 
  AlertCircle,
  ThumbsUp,
  CornerDownRight,
  Sparkles
} from 'lucide-react';
import { reviewApi, getErrorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { ReviewSubmissionModal } from './ReviewSubmissionModal';
import { ReviewImageLightboxModal } from './ReviewImageLightboxModal';

export const ProductReviewsSection = ({ product }) => {
  const { user, openAuthModal } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    percentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Sorting
  const [selectedRating, setSelectedRating] = useState('ALL');
  const [photosOnly, setPhotosOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Eligibility & Modals
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [eligibilityNotice, setEligibilityNotice] = useState(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Lightbox
  const [lightboxData, setLightboxData] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
    reviewerName: '',
    rating: 5
  });

  const productId = product?._id || product?.slug;

  const fetchReviews = useCallback(async (pageNum = 1, append = false) => {
    if (!productId) return;
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const params = {
        page: pageNum,
        limit: 8,
        sort: sortBy
      };

      if (selectedRating !== 'ALL') {
        params.rating = selectedRating;
      }
      if (photosOnly) {
        params.hasImages = true;
      }

      const res = await reviewApi.getProductReviews(productId, params);

      if (append) {
        setReviews((prev) => [...prev, ...(res?.reviews || [])]);
      } else {
        setReviews(res?.reviews || []);
      }

      if (res?.summary) {
        setSummary(res.summary);
      }
      if (res?.pagination) {
        setTotalPages(res.pagination.pages || 1);
        setPage(res.pagination.page || 1);
      }
    } catch (err) {
      console.error('Failed to load product reviews:', err);
      setError(getErrorMessage(err, 'Failed to load reviews.'));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [productId, selectedRating, photosOnly, sortBy]);

  useEffect(() => {
    fetchReviews(1, false);
  }, [fetchReviews]);

  const handleWriteReviewClick = async () => {
    setEligibilityNotice(null);

    // 1. If not logged in, prompt user to log in
    if (!user) {
      openAuthModal('login');
      return;
    }

    // 2. Check eligibility with backend
    try {
      setIsCheckingEligibility(true);
      const res = await reviewApi.checkEligibility(productId);

      if (res?.eligible) {
        setIsWriteModalOpen(true);
      } else {
        setEligibilityNotice({
          type: res?.reason === 'ALREADY_REVIEWED' ? 'info' : 'warning',
          message: res?.message || 'Only verified buyers who have received this product can submit a review.'
        });
      }
    } catch (err) {
      setEligibilityNotice({
        type: 'warning',
        message: getErrorMessage(err, 'Could not verify purchase eligibility. Please try again.')
      });
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  const handleReviewSubmitted = (newReview) => {
    // Refresh reviews and reset eligibility notice
    setEligibilityNotice({
      type: 'success',
      message: 'Your review has been published successfully!'
    });
    fetchReviews(1, false);
  };

  const handleOpenLightbox = (review, imgIndex = 0) => {
    setLightboxData({
      isOpen: true,
      images: review.images || review.photos || [],
      currentIndex: imgIndex,
      reviewerName: review.reviewerName,
      rating: review.rating
    });
  };

  const renderStars = (ratingCount) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= ratingCount
                ? 'fill-[#FF7626] text-[#FF7626]'
                : 'text-on-surface-variant/30'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="w-full max-w-[1360px] mx-auto px-4 lg:px-8 py-10 sm:py-16">
      <div className="bg-[#FFF9F0] border-2 border-on-surface shadow-[6px_6px_0px_#191919] p-6 sm:p-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b-2 border-on-surface">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#1769FF] text-white font-label text-xs uppercase font-bold px-2.5 py-0.5 border border-on-surface shadow-[2px_2px_0px_#191919]">
                VERIFIED COMMUNITY
              </span>
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                100% AUTHENTIC BUYERS
              </span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface">
              Customer Reviews & Photos
            </h2>
            <p className="font-body text-sm sm:text-base text-on-surface-variant mt-1">
              Real feedback and unboxing moments from verified Toyvolt parents and racers.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={handleWriteReviewClick}
              disabled={isCheckingEligibility}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#FF7626] text-white font-title text-sm uppercase font-bold border-2 border-on-surface shadow-[4px_4px_0px_#191919] hover:bg-[#e86315] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#191919] transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isCheckingEligibility ? 'CHECKING ELIGIBILITY...' : 'WRITE A VERIFIED REVIEW'}</span>
            </button>
          </div>
        </div>

        {/* Eligibility Notice Banner */}
        {eligibilityNotice && (
          <div
            className={`mt-6 p-4 border-2 border-on-surface shadow-[3px_3px_0px_#191919] flex items-start justify-between gap-3 ${
              eligibilityNotice.type === 'success'
                ? 'bg-[#dcfce7] text-[#14532d]'
                : eligibilityNotice.type === 'info'
                ? 'bg-[#dbeafe] text-[#1e40af]'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-body text-sm font-semibold">
                {eligibilityNotice.message}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEligibilityNotice(null)}
              className="font-bold text-xs underline uppercase"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Overall Rating & Breakdown Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 pb-8 border-b-2 border-on-surface/30">
          
          {/* Average Score Box */}
          <div className="lg:col-span-4 bg-surface-container-lowest border-2 border-on-surface p-6 shadow-[4px_4px_0px_#191919] flex flex-col justify-center items-center text-center">
            {summary.totalReviews > 0 ? (
              <>
                <span className="font-headline text-5xl sm:text-6xl font-bold text-primary">
                  {summary.averageRating.toFixed(1)}
                </span>
                <div className="flex items-center gap-1.5 my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(summary.averageRating)
                          ? 'fill-[#FF7626] text-[#FF7626]'
                          : 'text-on-surface-variant/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-title text-sm font-bold text-on-surface">
                  Based on {summary.totalReviews} verified {summary.totalReviews === 1 ? 'review' : 'reviews'}
                </span>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#15803d] font-bold bg-[#dcfce7] px-2.5 py-1 border border-on-surface">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Delivered Orders Only</span>
                </div>
              </>
            ) : (
              <div className="py-4 space-y-2">
                <Sparkles className="w-10 h-10 text-primary mx-auto" />
                <h3 className="font-title text-lg font-bold text-on-surface">
                  Be The First Reviewer
                </h3>
                <p className="text-xs text-on-surface-variant max-w-xs">
                  This product has not received verified customer reviews yet. Test yours and share your feedback!
                </p>
              </div>
            )}
          </div>

          {/* Star Distribution Progress Bars */}
          <div className="lg:col-span-8 space-y-3 flex flex-col justify-center">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = summary.distribution[star] || 0;
              const percentage = summary.percentages[star] || 0;
              const isSelected = selectedRating === String(star);

              return (
                <div
                  key={star}
                  onClick={() => setSelectedRating(isSelected ? 'ALL' : String(star))}
                  className={`flex items-center gap-3 cursor-pointer p-1.5 rounded transition-colors ${
                    isSelected ? 'bg-primary-fixed/40 ring-1 ring-primary' : 'hover:bg-[#F0E8DA]'
                  }`}
                >
                  <div className="flex items-center gap-1 w-16 shrink-0">
                    <span className="font-title text-sm font-bold">{star}</span>
                    <Star className="w-3.5 h-3.5 fill-[#FF7626] text-[#FF7626]" />
                  </div>

                  <div className="flex-1 h-3.5 bg-surface-container-lowest border border-on-surface overflow-hidden relative shadow-[1px_1px_0px_#191919]">
                    <div
                      className="h-full bg-[#FF7626] transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="w-20 text-right shrink-0 flex items-center justify-end gap-1 font-body text-xs text-on-surface font-semibold">
                    <span>{count}</span>
                    <span className="text-on-surface-variant font-normal">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Toolbar: Filters & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#F0E8DA] border-2 border-on-surface p-4 shadow-[3px_3px_0px_#191919]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label text-xs uppercase font-bold text-on-surface mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>

            {['ALL', '5', '4', '3', '2', '1'].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setSelectedRating(val)}
                className={`px-3 py-1 font-title text-xs font-bold uppercase border-2 border-on-surface transition-all ${
                  selectedRating === val
                    ? 'bg-[#1769FF] text-white shadow-[2px_2px_0px_#191919]'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-[1px_1px_0px_#191919]'
                }`}
              >
                {val === 'ALL' ? 'All Stars' : `${val} Stars`}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPhotosOnly(!photosOnly)}
              className={`px-3 py-1 font-title text-xs font-bold uppercase border-2 border-on-surface flex items-center gap-1.5 transition-all ${
                photosOnly
                  ? 'bg-[#FF7626] text-white shadow-[2px_2px_0px_#191919]'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-[1px_1px_0px_#191919]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>With Photos</span>
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="font-label text-xs uppercase font-bold text-on-surface">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-container-lowest border-2 border-on-surface p-1.5 font-body text-xs font-bold text-on-surface shadow-[2px_2px_0px_#191919] focus:outline-none"
            >
              <option value="newest">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews Content List */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block animate-spin w-8 h-8 border-3 border-[#1769FF] border-t-transparent rounded-full mb-3" />
            <p className="font-title text-sm uppercase font-bold text-on-surface">
              Loading Verified Customer Reviews...
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-16 px-4 bg-surface-container-lowest border-2 border-dashed border-on-surface/40 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F0E8DA] border-2 border-on-surface flex items-center justify-center mx-auto text-on-surface-variant">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface">
              {selectedRating !== 'ALL' || photosOnly
                ? 'No reviews match your selected filter'
                : 'No customer reviews yet'}
            </h3>
            <p className="font-body text-sm text-on-surface-variant max-w-md mx-auto">
              {selectedRating !== 'ALL' || photosOnly
                ? 'Try resetting the filters above to view all verified buyer feedback.'
                : 'Be the first verified customer to share an unboxing video, drift stunt, or review!'}
            </p>
            {selectedRating !== 'ALL' || photosOnly ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedRating('ALL');
                  setPhotosOnly(false);
                }}
                className="mt-2 px-4 py-2 bg-surface-container text-on-surface font-title text-xs uppercase font-bold border-2 border-on-surface shadow-[2px_2px_0px_#191919]"
              >
                Reset Filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-surface-container-lowest border-2 border-on-surface shadow-[4px_4px_0px_#191919] p-5 sm:p-7 space-y-4"
              >
                {/* Review Header: User & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1769FF] text-white border-2 border-on-surface font-headline font-bold flex items-center justify-center text-sm shadow-[2px_2px_0px_#191919]">
                      {rev.reviewerName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-title text-base font-bold text-on-surface">
                          {rev.reviewerName}
                        </span>
                        {rev.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#14532d] text-xs font-bold px-2 py-0.5 border border-on-surface shadow-[1px_1px_0px_#191919]">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </div>
                      <span className="font-body text-xs text-on-surface-variant">
                        Reviewed on {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Star Rating Display */}
                  <div>
                    {renderStars(rev.rating)}
                  </div>
                </div>

                {/* Review Title */}
                {rev.title && (
                  <h4 className="font-headline text-lg sm:text-xl font-bold text-on-surface">
                    {rev.title}
                  </h4>
                )}

                {/* Review Comment */}
                <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed whitespace-pre-line">
                  {rev.comment}
                </p>

                {/* Customer Photo Gallery */}
                {rev.images && rev.images.length > 0 && (
                  <div className="pt-2">
                    <span className="font-label text-xs uppercase font-bold text-on-surface block mb-2">
                      Customer Photos:
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {rev.images.map((img, imgIdx) => (
                        <button
                          key={imgIdx}
                          type="button"
                          onClick={() => handleOpenLightbox(rev, imgIdx)}
                          className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-on-surface shadow-[3px_3px_0px_#191919] overflow-hidden hover:scale-105 transition-transform bg-black/10"
                        >
                          <img
                            src={img.url}
                            alt={`Review thumbnail ${imgIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Official Store Reply */}
                {rev.storeReply?.text && (
                  <div className="mt-4 p-4 bg-[#F0E8DA] border-2 border-on-surface shadow-[3px_3px_0px_#191919] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-primary">
                      <CornerDownRight className="w-4 h-4" />
                      <span>Toyvolt Play Experience Team</span>
                      {rev.storeReply.repliedAt && (
                        <span className="text-on-surface-variant font-normal">
                          • {new Date(rev.storeReply.repliedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                    <p className="font-body text-sm text-on-surface whitespace-pre-line">
                      {rev.storeReply.text}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Pagination / Load More */}
            {page < totalPages && (
              <div className="pt-6 text-center">
                <button
                  type="button"
                  disabled={loadingMore}
                  onClick={() => fetchReviews(page + 1, true)}
                  className="px-8 py-3 bg-surface-container-lowest text-on-surface font-title text-sm uppercase font-bold border-2 border-on-surface shadow-[4px_4px_0px_#191919] hover:bg-surface-container transition-all"
                >
                  {loadingMore ? 'LOADING MORE REVIEWS...' : 'LOAD MORE REVIEWS'}
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Review Submission Modal */}
      <ReviewSubmissionModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        product={product}
        onReviewSubmitted={handleReviewSubmitted}
      />

      {/* Photo Lightbox Modal */}
      <ReviewImageLightboxModal
        isOpen={lightboxData.isOpen}
        onClose={() => setLightboxData((prev) => ({ ...prev, isOpen: false }))}
        images={lightboxData.images}
        currentIndex={lightboxData.currentIndex}
        onSelectIndex={(idx) => setLightboxData((prev) => ({ ...prev, currentIndex: idx }))}
        reviewerName={lightboxData.reviewerName}
        rating={lightboxData.rating}
      />
    </section>
  );
};

export default ProductReviewsSection;
