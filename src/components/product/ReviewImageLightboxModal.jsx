import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const ReviewImageLightboxModal = ({
  isOpen,
  onClose,
  images = [],
  currentIndex = 0,
  onSelectIndex,
  reviewerName = '',
  rating = 5
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onSelectIndex(currentIndex - 1);
      }
      if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        onSelectIndex(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onSelectIndex]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const imageUrl = typeof currentImage === 'string' ? currentImage : currentImage?.url;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-[#FFF9F0] border-3 border-on-surface shadow-[8px_8px_0px_#191919] p-4 sm:p-6 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-on-surface">
          <div>
            <span className="font-bold text-on-surface font-title text-base sm:text-lg">
              Customer Photo ({currentIndex + 1} of {images.length})
            </span>
            {reviewerName && (
              <p className="text-xs text-on-surface-variant">
                Shared by <span className="font-bold text-on-surface">{reviewerName}</span> • ★ {rating}/5
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-surface-container-lowest border-2 border-on-surface shadow-[2px_2px_0px_#191919] hover:bg-error-container hover:text-on-error-container transition-all"
            aria-label="Close photo preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Display */}
        <div className="relative flex items-center justify-center bg-[#191919] border-2 border-on-surface min-h-[300px] max-h-[65vh] overflow-hidden">
          <img
            src={imageUrl}
            alt={`Customer photo ${currentIndex + 1}`}
            className="max-h-[60vh] max-w-full object-contain mx-auto"
          />

          {/* Navigation Controls */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => onSelectIndex(currentIndex - 1)}
                className={`absolute left-2 sm:left-4 p-2 bg-[#FFF9F0] text-on-surface border-2 border-on-surface shadow-[3px_3px_0px_#191919] transition-all ${
                  currentIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-primary-fixed hover:translate-y-[-1px]'
                }`}
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                disabled={currentIndex === images.length - 1}
                onClick={() => onSelectIndex(currentIndex + 1)}
                className={`absolute right-2 sm:right-4 p-2 bg-[#FFF9F0] text-on-surface border-2 border-on-surface shadow-[3px_3px_0px_#191919] transition-all ${
                  currentIndex === images.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-primary-fixed hover:translate-y-[-1px]'
                }`}
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
            {images.map((img, idx) => {
              const thumbUrl = typeof img === 'string' ? img : img?.url;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectIndex(idx)}
                  className={`w-14 h-14 shrink-0 border-2 border-on-surface overflow-hidden transition-all ${
                    idx === currentIndex
                      ? 'shadow-[3px_3px_0px_#1769FF] ring-2 ring-primary scale-105'
                      : 'opacity-70 hover:opacity-100 shadow-[2px_2px_0px_#191919]'
                  }`}
                >
                  <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewImageLightboxModal;
