import React from 'react';
import { RotateCcw, Trash2, Clock } from 'lucide-react';
import { RollResult } from '../../types/vtm';

interface RollHistoryProps {
  rolls: RollResult[];
  onRerollWithWillpower?: (roll: RollResult) => void;
  onClearHistory: () => void;
}

export const RollHistory: React.FC<RollHistoryProps> = ({
  rolls,
  onRerollWithWillpower,
  onClearHistory
}) => {
  if (rolls.length === 0) {
    return (
      <div className="text-center py-6 text-neutral-600 text-xs font-mono">
        No rolls logged yet.
      </div>
    );
  }

  const getBadgeStyle = (outcome: RollResult['outcome']) => {
    switch (outcome) {
      case 'critical':
        return 'bg-amber-950/80 border-amber-500 text-amber-300';
      case 'messy_critical':
        return 'bg-gradient-to-r from-rose-950 to-amber-950 border-rose-500 text-rose-200';
      case 'bestial_failure':
        return 'bg-rose-950 border-red-600 text-red-300 animate-pulse';
      case 'botch':
        return 'bg-red-950 border-red-700 text-red-400 font-bold';
      case 'exceptional':
        return 'bg-blue-950 border-blue-500 text-blue-300';
      case 'success':
        return 'bg-emerald-950/80 border-emerald-600 text-emerald-300';
      case 'failure':
      default:
        return 'bg-[#181822] border-[#2d2d3d] text-neutral-400';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between pb-1.5 border-b border-[#1c1c24] text-xs">
        <span className="font-cinzel text-neutral-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Recent Rolls ({rolls.length})
        </span>
        <button
          type="button"
          onClick={onClearHistory}
          className="text-neutral-500 hover:text-rose-400 text-[11px] flex items-center gap-1 transition"
        >
          <Trash2 className="w-3 h-3" /> Clear
        </button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {rolls.map(roll => {
          const timeStr = new Date(roll.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          return (
            <div
              key={roll.id}
              className="bg-[#0f0f15] border border-[#20202c] rounded-lg p-2.5 text-xs space-y-1.5 hover:border-[#2f2f40] transition"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-cinzel font-bold text-neutral-200 truncate">
                  {roll.label}
                </span>
                <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                  {timeStr}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded border text-[11px] font-mono ${getBadgeStyle(roll.outcome)}`}>
                  {roll.outcomeText}
                </span>

                {roll.canWillpowerReroll && onRerollWithWillpower && (
                  <button
                    type="button"
                    onClick={() => onRerollWithWillpower(roll)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/70 hover:bg-blue-900 border border-blue-700 text-blue-300 text-[10px] font-medium transition"
                  >
                    <RotateCcw className="w-3 h-3" /> Reroll Willpower
                  </button>
                )}
              </div>

              {/* Dice values mini list */}
              <div className="flex flex-wrap gap-1 text-[11px] font-mono pt-1 border-t border-[#181822]">
                <span className="text-neutral-500 text-[10px] mr-1">Reg:</span>
                {roll.regularDice.map((d, i) => (
                  <span
                    key={i}
                    className={`px-1 rounded ${d >= 6 ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-600'}`}
                  >
                    {d}
                  </span>
                ))}
                {roll.hungerDice.length > 0 && (
                  <>
                    <span className="text-rose-500 text-[10px] ml-2 mr-1">Hunger:</span>
                    {roll.hungerDice.map((d, i) => (
                      <span
                        key={i}
                        className={`px-1 rounded ${
                          d === 10 ? 'bg-rose-900 text-amber-300 font-bold' : d === 1 ? 'bg-red-950 text-red-400 font-bold' : d >= 6 ? 'bg-rose-950 text-rose-200' : 'text-rose-900'
                        }`}
                      >
                        {d}
                      </span>
                    ))}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
