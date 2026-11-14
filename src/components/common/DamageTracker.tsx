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
    <div className="bg-[#0c0c12] border border-[#20202d] hover:border-neutral-700/60 rounded-xl p-3.5 flex flex-col justify-between transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="font-cinzel text-xs font-bold tracking-wider text-neutral-100 uppercase">
            {label}
          </span>
          {subtitle && <span className="text-[10px] text-neutral-400 font-mono">({subtitle})</span>}
        </div>
        <div className="text-[11px] flex items-center gap-1.5">
          {aggravatedCount > 0 && (
            <span className="text-rose-400 font-mono font-bold bg-rose-950/80 border border-rose-900 px-1 rounded">{aggravatedCount} Agg</span>
          )}
          {superficialCount > 0 && (
            <span className="text-amber-300 font-mono font-bold bg-amber-950/70 border border-amber-800 px-1 rounded">{superficialCount} Sup</span>
          )}
          {isImpaired && (
            <span className="text-[10px] bg-rose-950 border border-rose-700 text-rose-300 px-1.5 py-0.5 rounded font-bold animate-pulse">
              IMPAIRED (-2)
            </span>
          )}
        </div>
      </div>

      {/* Boxes Grid: Always aligns 1 to 10 boxes on a single pristine row */}
      <div className="grid grid-flow-col auto-cols-fr gap-1 sm:gap-1.5 my-2">
        {damage.map((type, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggleBox(i)}
            title={`Box ${i + 1}: ${type} (Click to cycle None -> Sup -> Agg)`}
            className={`
              h-7 min-w-[20px] max-w-[34px] rounded border font-mono font-black text-xs flex items-center justify-center cursor-pointer transition-all duration-150
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

      {/* Quick Action Controls */}
      <div className="flex items-center justify-end gap-1.5 mt-2 pt-2 border-t border-[#1a1a24] text-[10px] font-mono">
        <button
          type="button"
          onClick={addSuperficial}
          className="px-2 py-0.5 rounded bg-[#161622] hover:bg-[#222232] text-amber-300 border border-[#2b2b3d] cursor-pointer transition"
          title="Add 1 Superficial Damage"
        >
          + Sup [/]
        </button>
        <button
          type="button"
          onClick={addAggravated}
          className="px-2 py-0.5 rounded bg-[#161622] hover:bg-rose-950/60 text-rose-400 border border-[#2b2b3d] cursor-pointer transition"
          title="Add 1 Aggravated Damage"
        >
          + Agg [X]
        </button>
        <button
          type="button"
          onClick={clearOne}
          className="px-2 py-0.5 rounded bg-[#161622] hover:bg-[#222232] text-neutral-300 border border-[#2b2b3d] cursor-pointer transition"
          title="Mend 1 Damage"
        >
          Mend [-]
        </button>
      </div>
    </div>
  );
};
