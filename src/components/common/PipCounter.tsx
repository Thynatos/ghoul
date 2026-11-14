import React from 'react';

interface PipCounterProps {
  value: number;
  max?: number;
  min?: number;
  onChange?: (val: number) => void;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blood' | 'gold' | 'blue' | 'emerald' | 'humanity' | 'silver';
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
    blue: 'bg-slate-400 border-slate-300 shadow-[0_0_8px_rgba(148,163,184,0.5)]', // Fortified slate/steel instead of primary blue
    emerald: 'bg-emerald-600 border-emerald-500 shadow-[0_0_8px_rgba(5,150,105,0.4)]', // Dignified sage/emerald
    humanity: 'bg-emerald-600 border-emerald-500 shadow-[0_0_8px_rgba(5,150,105,0.4)]',
    silver: 'bg-slate-300 border-slate-200 shadow-[0_0_8px_rgba(226,232,240,0.5)]'
  }[color];

  const emptyColorClasses = 'bg-[#15151e] border-[#29293a] hover:border-[#45455c]';

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
              rounded-full border transition-all duration-150 transform
              ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'}
              ${sizeClasses}
              ${isFilled ? filledColorClasses : emptyColorClasses}
            `}
          />
        );
      })}
    </div>
  );
};
