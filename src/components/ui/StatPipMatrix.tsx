import React from 'react';
import { DamageType } from '../../types/vtm';

export type PipMode = 'normal' | 'hunger' | 'humanity' | 'damage';

export interface StatPipMatrixProps {
  mode?: PipMode;
  value?: number; // For normal, hunger, humanity
  max?: number;
  min?: number;
  damage?: DamageType[]; // For damage mode
  onChangeValue?: (val: number) => void;
  onChangeDamage?: (damage: DamageType[]) => void;
  color?: 'blood' | 'gold' | 'emerald' | 'humanity' | 'willpower' | 'silver';
  shape?: 'circle' | 'diamond' | 'box';
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  className?: string;
}

export const StatPipMatrix: React.FC<StatPipMatrixProps> = ({
  mode = 'normal',
  value = 0,
  max = 5,
  min = 0,
  damage,
  onChangeValue,
  onChangeDamage,
  color = 'blood',
  shape = 'circle',
  size = 'md',
  readOnly = false,
  className = ''
}) => {
  // Damage boxes handling
  if (mode === 'damage' && damage) {
    const toggleDamageBox = (index: number) => {
      if (readOnly || !onChangeDamage) return;
      const next = [...damage];
      const current = next[index] || 'none';
      if (current === 'none') next[index] = 'superficial';
      else if (current === 'superficial') next[index] = 'aggravated';
      else next[index] = 'none';
      onChangeDamage(next);
    };

    return (
      <div className={`grid grid-flow-col auto-cols-fr gap-1 sm:gap-1.5 w-full items-center select-none ${className}`}>
        {damage.map((type, i) => (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onClick={() => toggleDamageBox(i)}
            title={`Box ${i + 1}: ${type} (Click to toggle)`}
            aria-label={`Damage box ${i + 1} of ${damage.length}: ${type}`}
            className={`
              h-7 min-w-[18px] max-w-[34px] rounded border font-mono font-black text-xs flex items-center justify-center transition-all duration-150
              ${readOnly ? 'cursor-default' : 'cursor-pointer active:scale-95'}
              ${type === 'aggravated'
                ? 'bg-rose-950 border-rose-600 text-rose-300 shadow-[0_0_8px_rgba(225,29,72,0.4)]'
                : type === 'superficial'
                ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-[0_0_6px_rgba(245,158,11,0.3)]'
                : 'bg-[#14141c] border-[#282838] text-neutral-600 hover:border-neutral-500 hover:bg-[#1a1a24]'}
            `}
          >
            {type === 'aggravated' ? '✕' : type === 'superficial' ? '╱' : ''}
          </button>
        ))}
      </div>
    );
  }

  // Normal / Hunger / Humanity Pip rendering
  const effectiveMax = mode === 'hunger' ? 5 : mode === 'humanity' ? 10 : max;

  const handleClickPip = (index: number) => {
    if (readOnly || !onChangeValue) return;
    const clickedVal = index + 1;
    if (clickedVal === value) {
      onChangeValue(Math.max(min, value - 1));
    } else {
      onChangeValue(Math.max(min, Math.min(effectiveMax, clickedVal)));
    }
  };

  const sizeClasses = {
    sm: shape === 'box' ? 'w-3 h-3 m-0.5' : 'w-2.5 h-2.5 m-0.5',
    md: shape === 'box' ? 'w-4 h-4 m-0.5' : 'w-3.5 h-3.5 m-0.5',
    lg: shape === 'box' ? 'w-5 h-5 m-1' : 'w-4.5 h-4.5 m-1'
  }[size];

  const getFilledClasses = () => {
    if (mode === 'hunger') {
      return 'bg-gradient-to-br from-red-600 to-rose-900 border-red-500 text-white shadow-[0_0_8px_rgba(225,29,72,0.6)]';
    }
    if (mode === 'humanity' || color === 'humanity' || color === 'emerald') {
      return 'bg-gradient-to-br from-emerald-500 to-emerald-800 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    }
    if (color === 'gold') {
      return 'bg-gradient-to-br from-amber-400 to-amber-700 border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
    }
    if (color === 'willpower') {
      return 'bg-gradient-to-br from-sky-500 to-sky-800 border-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]';
    }
    if (color === 'silver') {
      return 'bg-gradient-to-br from-slate-200 to-slate-400 border-slate-200 shadow-[0_0_8px_rgba(203,213,225,0.4)]';
    }
    return 'bg-gradient-to-br from-rose-600 to-rose-900 border-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.6)]';
  };

  const emptyClasses = 'bg-[#12121a] border-[#2a2a3c] hover:border-[#4c4c66]';

  const shapeClass =
    shape === 'diamond'
      ? 'rotate-45 rounded-sm'
      : shape === 'box'
      ? 'rounded'
      : 'rounded-full';

  return (
    <div
      className={`inline-flex items-center flex-nowrap select-none overflow-x-visible ${className}`}
      role="group"
      aria-label={`Pip counter, ${value} of ${effectiveMax}`}
    >
      {Array.from({ length: effectiveMax }).map((_, i) => {
        const isFilled = i < value;
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onClick={() => handleClickPip(i)}
            title={`${i + 1} of ${effectiveMax}`}
            aria-label={`${i + 1} of ${effectiveMax}`}
            className={`
              border transition-all duration-150 transform shrink-0
              ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-115 active:scale-95'}
              ${sizeClasses}
              ${shapeClass}
              ${isFilled ? getFilledClasses() : emptyClasses}
            `}
          />
        );
      })}
    </div>
  );
};
