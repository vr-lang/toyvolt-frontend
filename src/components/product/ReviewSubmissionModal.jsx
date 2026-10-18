import React, { useState, useRef } from 'react';
import { Star, X, UploadCloud, AlertCircle, CheckCircle2, Loader2, ImagePlus } from 'lucide-react';
import { reviewApi, getErrorMessage } from '../../lib/api';

const RATING_LABELS = {
  1: 'Poor — Did not meet expectations',
  2: 'Fair — Acceptable but has flaws',
  3: 'Good — Fun toy, solid performance',
  4: 'Very Good — High quality & durable',
  5: 'Outstanding! — Exceeded expectations'
};

export const ReviewSubmissionModal = ({
  isOpen,
  onClose,
  product,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleRatingClick = (star) => {
    setRating(star);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setError('');
    const currentCount = selectedFiles.length;
    if (currentCount + files.length > 5) {
      setError(`You can upload a maximum of 5 images. You already have ${currentCount}.`);
      return;
    }

    const validNewFiles = [];
    const validNewPreviews = [];

    for (const file of files) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError(`File "${file.name}" exceeds the 5MB size limit.`);
        return;
      }

      // Validate MIME type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type.toLowerCase())) {
        setError(`File "${file.name}" is not a valid format. Only JPEG, PNG, and WebP are supported.`);
        return;
      }

      validNewFiles.push(file);
      validNewPreviews.push(URL.createObjectURL(file));
    }

    setSelectedFiles((prev) => [...prev, ...validNewFiles]);
    setPreviews((prev) => [...prev, ...validNewPreviews]);

    // Reset input value so user can re-select same file if deleted
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    // Revoke object url to prevent memory leak
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
    }
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating < 1 || rating > 5) {
      setError('Please select a star rating from 1 to 5.');
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      setError('Please write at least 5 characters in your review comment.');
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('rating', rating);
      if (title.trim()) {
        formData.append('title', title.trim());
      }
      formData.append('comment', comment.trim());

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const identifier = product?.slug || product?._id;
      const res = await reviewApi.submitReview(identifier, formData);

      setSuccess(true);
      if (onReviewSubmitted) {
        onReviewSubmitted(res?.review || res);
      }

      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to submit review. Please check your connection and try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const activeStarCount = hoverRating || rating;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 sm:p-6 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-[#FFF9F0] border-3 border-on-surface shadow-[8px_8px_0px_#191919] p-6 sm:p-8 my-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b-2 border-on-surface">
          <div>
            <span className="inline-block bg-[#1769FF] text-white font-label-sm text-xs font-bold uppercase px-2.5 py-0.5 border border-on-surface mb-2 shadow-[2px_2px_0px_#191919]">
              VERIFIED BUYER REVIEW
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
              Review {product?.name || 'Your Toy'}
            </h2>
            <p className="font-body text-sm text-on-surface-variant mt-1">
              Your honest feedback helps other parents and hobbyists make the right choice.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-surface-container-lowest border-2 border-on-surface shadow-[2px_2px_0px_#191919] hover:bg-error-container hover:text-on-error-container transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#dcfce7] border-2 border-on-surface shadow-[4px_4px_0px_#191919] flex items-center justify-center text-[#15803d]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-headline text-2xl font-bold text-on-surface">
              Review Published!
            </h3>
            <p className="font-body text-on-surface-variant max-w-md">
              Thank you for sharing your experience with the Toyvolt community. Your review and photos are now live!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {error && (
              <div className="p-3.5 bg-error-container text-on-error-container border-2 border-on-surface shadow-[3px_3px_0px_#191919] flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-body-sm text-sm font-semibold">{error}</span>
              </div>
            )}

            {/* Star Rating Selection */}
            <div className="space-y-2">
              <label className="block font-label text-sm uppercase font-bold text-on-surface">
                YOUR OVERALL RATING <span className="text-error">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= activeStarCount
                          ? 'fill-[#FF7626] text-[#FF7626]'
                          : 'text-on-surface-variant/40'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-3 font-title text-sm font-bold text-on-surface">
                  {activeStarCount} / 5
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium">
                {RATING_LABELS[activeStarCount] || ''}
              </p>
            </div>

            {/* Review Title */}
            <div className="space-y-1.5">
              <label htmlFor="review-title" className="block font-label text-sm uppercase font-bold text-on-surface">
                REVIEW HEADLINE (OPTIONAL)
              </label>
              <input
                id="review-title"
                type="text"
                maxLength={120}
                placeholder="e.g. Unbelievable battery life and fast drifting!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-surface-container-lowest border-2 border-on-surface p-3 font-body text-sm text-on-surface shadow-[2px_2px_0px_#191919] focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Review Text */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="review-comment" className="block font-label text-sm uppercase font-bold text-on-surface">
                  WRITTEN REVIEW <span className="text-error">*</span>
                </label>
                <span className="text-xs text-on-surface-variant">
                  {comment.length} / 2000
                </span>
              </div>
              <textarea
                id="review-comment"
                rows={4}
                required
                minLength={5}
                maxLength={2000}
                placeholder="Tell us what you liked most, how it handles, durability, or how much fun it brought to your play sessions..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-surface-container-lowest border-2 border-on-surface p-3 font-body text-sm text-on-surface shadow-[2px_2px_0px_#191919] focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              />
            </div>

            {/* Customer Photo Upload Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-label text-sm uppercase font-bold text-on-surface">
                  ADD PHOTOS ({selectedFiles.length}/5)
                </label>
                <span className="text-xs text-on-surface-variant">
                  JPEG, PNG, WebP up to 5MB each
                </span>
              </div>

              {/* Upload Trigger / Dropzone */}
              {selectedFiles.length < 5 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-on-surface/50 bg-[#F0E8DA] p-4 text-center cursor-pointer hover:border-primary hover:bg-surface-container-lowest transition-all"
                >
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <UploadCloud className="w-8 h-8 text-primary" />
                    <span className="font-label text-sm font-bold text-on-surface">
                      Click to browse or drop customer photos
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      Show real-world action shots, unboxing, or flips!
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              )}

              {/* Previews with Delete Button */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                  {previews.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square border-2 border-on-surface shadow-[2px_2px_0px_#191919] overflow-hidden group bg-black/10"
                    >
                      <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full border border-black shadow-[1px_1px_0px_#000] hover:bg-red-700 transition-all"
                        aria-label="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t-2 border-on-surface flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-2.5 bg-surface-container-lowest text-on-surface font-title text-sm uppercase border-2 border-on-surface shadow-[3px_3px_0px_#191919] hover:bg-surface-container transition-all"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={submitting || comment.trim().length < 5}
                className="px-6 py-2.5 bg-[#1769FF] text-white font-title text-sm uppercase border-2 border-on-surface shadow-[3px_3px_0px_#191919] hover:bg-[#1255d4] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#191919] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SUBMITTING...</span>
                  </>
                ) : (
                  <span>POST VERIFIED REVIEW</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewSubmissionModal;
