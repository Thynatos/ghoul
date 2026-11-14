import React from 'react';

interface PipCounterProps {
  value: number;
  max?: number;
  min?: number;
  onChange?: (val: number) => void;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blood' | 'gold' | 'blue' | 'emerald';
  readOnly?: boolean;
}

export const PipCounter: React.FC<PipCounterProps> = ({
  value,
  max = 5,
  min = 0,
  onChange,
  size = 'md',
  color = 'blood',
  readOnly = false
}) => {
  const sizeClasses = {
    sm: 'w-2.5 h-2.5 m-0.5',
    md: 'w-3.5 h-3.5 m-0.5',
    lg: 'w-5 h-5 m-1'
  }[size];

  const filledColorClasses = {
    blood: 'bg-rose-600 border-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.6)]',
    gold: 'bg-amber-500 border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
    blue: 'bg-blue-500 border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]',
    emerald: 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
  }[color];

  const emptyColorClasses = 'bg-[#18181f] border-[#2c2c38] hover:border-[#424254]';

  const handleClick = (index: number) => {
    if (readOnly || !onChange) return;
    const clickedVal = index + 1;
    // If clicking current value, reduce by 1 down to min
    if (clickedVal === value) {
      onChange(Math.max(min, value - 1));
    } else {
      onChange(Math.max(min, Math.min(max, clickedVal)));
    }
  };

  return (
    <div className="flex items-center select-none" role="group">
      {Array.from({ length: max }).map((_, i) => {
        const isFilled = i < value;
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onClick={() => handleClick(i)}
            title={`${i + 1} of ${max}`}
            aria-label={`${i + 1} of ${max}`}
            className={`
              ${sizeClasses}
              rounded-full border transition-all duration-150
              ${isFilled ? filledColorClasses : emptyColorClasses}
              ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-125'}
            `}
          />
        );
      })}
    </div>
  );
};
