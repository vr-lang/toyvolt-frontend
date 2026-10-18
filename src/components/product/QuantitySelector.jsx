import React from 'react';

export const QuantitySelector = ({
  quantity,
  maxStock = 100,
  onIncrease,
  onDecrease,
  disabled = false,
  size = 'md'
}) => {
  const btnPadding = size === 'sm' ? 'px-2.5 py-1' : 'px-3.5 py-2';
  const textClass =
    size === 'sm' ? 'font-label-md text-label-md px-3' : 'font-title text-title px-4';

  return (
    <div
      className="inline-flex items-center bg-surface-container-lowest border-2 border-on-surface shadow-[3px_3px_0px_#191919]"
      role="group"
      aria-label="Product quantity selector"
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabled || quantity <= 1}
        aria-label="Decrease quantity"
        className={`${btnPadding} text-on-surface hover:bg-tertiary-fixed disabled:opacity-40 disabled:hover:bg-transparent transition-colors border-r-2 border-on-surface font-bold`}
      >
        −
      </button>
      <span className={`${textClass} font-bold text-on-surface select-none min-w-[2.5rem] text-center`}>
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={disabled || quantity >= maxStock}
        aria-label="Increase quantity"
        className={`${btnPadding} text-on-surface hover:bg-tertiary-fixed disabled:opacity-40 disabled:hover:bg-transparent transition-colors border-l-2 border-on-surface font-bold`}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
