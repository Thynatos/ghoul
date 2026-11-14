import React from 'react';
import { DamageType } from '../../types/vtm';

interface DamageTrackerProps {
  label: string;
  damage: DamageType[];
  onChange: (damage: DamageType[]) => void;
  color?: 'blood' | 'willpower';
  subtitle?: string;
}

export const DamageTracker: React.FC<DamageTrackerProps> = ({
  label,
  damage,
  onChange,
  color = 'blood',
  subtitle
}) => {
  const toggleBox = (index: number) => {
    const next = [...damage];
    const current = next[index] || 'none';
    if (current === 'none') next[index] = 'superficial';
    else if (current === 'superficial') next[index] = 'aggravated';
    else next[index] = 'none';
    onChange(next);
  };

  const addSuperficial = () => {
    const next = [...damage];
    const emptyIdx = next.findIndex(d => d === 'none');
    if (emptyIdx >= 0) {
      next[emptyIdx] = 'superficial';
      onChange(next);
    }
  };

  const addAggravated = () => {
    const next = [...damage];
    // Aggravated overwrites superficial first or empty
    const supIdx = next.findIndex(d => d === 'superficial');
    if (supIdx >= 0) {
      next[supIdx] = 'aggravated';
      onChange(next);
    } else {
      const emptyIdx = next.findIndex(d => d === 'none');
      if (emptyIdx >= 0) {
        next[emptyIdx] = 'aggravated';
        onChange(next);
      }
    }
  };

  const clearOne = () => {
    const next = [...damage];
    for (let i = next.length - 1; i >= 0; i--) {
      if (next[i] === 'superficial') {
        next[i] = 'none';
        onChange(next);
        return;
      }
    }
    for (let i = next.length - 1; i >= 0; i--) {
      if (next[i] === 'aggravated') {
        next[i] = 'none';
        onChange(next);
        return;
      }
    }
  };

  const superficialCount = damage.filter(d => d === 'superficial').length;
  const aggravatedCount = damage.filter(d => d === 'aggravated').length;
  const totalDamage = superficialCount + aggravatedCount;
  const isImpaired = totalDamage >= damage.length;

  return (
    <div className="bg-[#0e0e12] border border-[#23232c] rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="font-cinzel text-sm font-semibold tracking-wider text-neutral-200 uppercase">
            {label}
          </span>
          {subtitle && <span className="text-xs text-neutral-500 ml-2">({subtitle})</span>}
        </div>
        <div className="text-xs space-x-2">
          {aggravatedCount > 0 && (
            <span className="text-rose-500 font-mono font-medium">{aggravatedCount} Agg</span>
          )}
          {superficialCount > 0 && (
            <span className="text-amber-400 font-mono font-medium">{superficialCount} Sup</span>
          )}
          {isImpaired && (
            <span className="text-xs bg-rose-950/80 border border-rose-800 text-rose-300 px-1.5 py-0.5 rounded animate-pulse">
              IMPAIRED (-2)
            </span>
          )}
        </div>
      </div>

      {/* Boxes Grid */}
      <div className="flex flex-wrap gap-1.5 my-2">
        {damage.map((type, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggleBox(i)}
            title={`Box ${i + 1}: ${type} (Click to cycle)`}
            className={`
              w-7 h-7 rounded border font-mono font-bold text-sm flex items-center justify-center transition-all duration-100
              ${type === 'aggravated' 
                ? 'bg-rose-950 border-rose-600 text-rose-400 shadow-[0_0_8px_rgba(225,29,72,0.4)]' 
                : type === 'superficial'
                ? 'bg-amber-950/70 border-amber-500 text-amber-300'
                : 'bg-[#15151c] border-[#2c2c38] text-neutral-600 hover:border-neutral-500'}
            `}
          >
            {type === 'aggravated' ? '✕' : type === 'superficial' ? '╱' : ''}
          </button>
        ))}
      </div>

      {/* Quick Action Controls */}
      <div className="flex items-center justify-end gap-1.5 mt-2 pt-2 border-t border-[#1c1c24] text-[11px]">
        <button
          type="button"
          onClick={addSuperficial}
          className="px-2 py-0.5 rounded bg-[#181822] hover:bg-[#242433] text-amber-400 border border-[#2b2b3b] transition"
        >
          + Sup [/]
        </button>
        <button
          type="button"
          onClick={addAggravated}
          className="px-2 py-0.5 rounded bg-[#181822] hover:bg-rose-950/40 text-rose-400 border border-[#2b2b3b] transition"
        >
          + Agg [X]
        </button>
        <button
          type="button"
          onClick={clearOne}
          className="px-2 py-0.5 rounded bg-[#181822] hover:bg-[#242433] text-neutral-400 border border-[#2b2b3b] transition"
        >
          Mend [-]
        </button>
      </div>
    </div>
  );
};
