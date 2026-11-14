import React from 'react';
import { Skull, Sparkles } from 'lucide-react';

interface DiceTray3DProps {
  regularDice: number[];
  hungerDice: number[];
  isRolling?: boolean;
  selectedIndices?: number[];
  onToggleDieSelect?: (idx: number) => void;
  canSelect?: boolean;
}

export const DiceTray3D: React.FC<DiceTray3DProps> = ({
  regularDice,
  hungerDice,
  isRolling = false,
  selectedIndices = [],
  onToggleDieSelect,
  canSelect = false
}) => {
  return (
    <div className="bg-[#09090d] border border-[#1f1f2b] rounded-xl p-4 min-h-[140px] flex flex-col justify-center shadow-inner relative overflow-hidden">
      {/* Background felt texture feel */}
      <div className="absolute inset-0 bg-[radial-gradient(#1c1c28_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      {regularDice.length === 0 && hungerDice.length === 0 && !isRolling && (
        <div className="text-center text-neutral-600 text-xs font-cinzel italic py-6">
          The dice tray is empty. Compose a roll or click any attribute on your sheet to roll.
        </div>
      )}

      {isRolling && (
        <div className="flex items-center justify-center py-8">
          <div className="flex gap-2 animate-bounce">
            <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-700 animate-spin" />
            <div className="w-8 h-8 rounded bg-rose-900 border border-rose-600 animate-spin" />
            <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-700 animate-spin" />
          </div>
        </div>
      )}

      {!isRolling && (regularDice.length > 0 || hungerDice.length > 0) && (
        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
          {/* Regular Dice */}
          {regularDice.map((val, idx) => {
            const isSuccess = val >= 6;
            const isCrit = val === 10;
            const isSelected = selectedIndices.includes(idx);

            return (
              <button
                key={`reg_${idx}`}
                type="button"
                disabled={!canSelect || isCrit}
                onClick={() => onToggleDieSelect && onToggleDieSelect(idx)}
                title={`Regular Die: ${val}${isCrit ? ' (Critical)' : isSuccess ? ' (Success)' : ''}${canSelect && !isCrit ? ' - Click to reroll with Willpower' : ''}`}
                className={`
                  w-11 h-11 rounded-lg border-2 font-mono font-bold text-lg flex flex-col items-center justify-center transition-all transform shadow-md
                  ${isSelected ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'}
                  ${isCrit 
                    ? 'bg-gradient-to-br from-amber-950 via-neutral-900 to-amber-900 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]' 
                    : isSuccess
                    ? 'bg-[#181822] border-neutral-400 text-white'
                    : 'bg-[#111116] border-[#2b2b3a] text-neutral-500'}
                  ${canSelect && !isCrit ? 'cursor-pointer hover:border-blue-400' : ''}
                `}
              >
                <span>{val}</span>
                {isCrit && <Sparkles className="w-2.5 h-2.5 text-amber-400 -mt-1" />}
              </button>
            );
          })}

          {/* Hunger Dice (V5 Red Dice) */}
          {hungerDice.map((val, idx) => {
            const isSuccess = val >= 6;
            const isCrit = val === 10;
            const isBestial = val === 1;

            return (
              <div
                key={`hng_${idx}`}
                title={`Hunger Die: ${val}${isCrit ? ' (Messy Crit Potential)' : isBestial ? ' (Bestial Failure Potential)' : ''}`}
                className={`
                  w-11 h-11 rounded-lg border-2 font-mono font-black text-lg flex flex-col items-center justify-center transition-transform shadow-md
                  ${isCrit 
                    ? 'bg-gradient-to-br from-rose-900 via-rose-950 to-amber-950 border-rose-400 text-rose-200 shadow-[0_0_15px_rgba(225,29,72,0.7)] animate-pulse' 
                    : isBestial
                    ? 'bg-gradient-to-br from-rose-950 to-black border-red-600 text-red-500 shadow-[0_0_12px_rgba(220,38,38,0.6)]'
                    : isSuccess
                    ? 'bg-rose-950 border-rose-600 text-rose-200'
                    : 'bg-[#200a0d] border-rose-950 text-rose-800'}
                `}
              >
                <span>{val}</span>
                {isBestial && <Skull className="w-2.5 h-2.5 text-red-400 -mt-1" />}
                {isCrit && <Sparkles className="w-2.5 h-2.5 text-rose-300 -mt-1" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
