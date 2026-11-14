import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Dices, Flame, Sparkles, X, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { GameEdition, RollRequest, RollResult } from '../../types/vtm';
import { executeV5Roll, executeV20Roll, executeRouseCheck, rerollRegularDice } from '../../services/diceEngine';
import { soundEngine } from '../../services/soundEngine';
import { storageService } from '../../services/storage';
import { DiceTray3D } from './DiceTray3D';
import { RollHistory } from './RollHistory';

interface DiceRollerDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  edition: GameEdition;
  initialPool?: number;
  initialHunger?: number;
  initialLabel?: string;
  isFullScreen?: boolean;
  onRouseCheckResult?: (success: boolean) => void;
}

export const DiceRollerDrawer: React.FC<DiceRollerDrawerProps> = ({
  isOpen = true,
  onClose,
  edition,
  initialPool = 4,
  initialHunger = 1,
  initialLabel = 'Custom Roll',
  isFullScreen = false,
  onRouseCheckResult
}) => {
  const [label, setLabel] = useState(initialLabel);
  const [poolSize, setPoolSize] = useState(initialPool);
  const [hungerDice, setHungerDice] = useState(initialHunger);
  const [difficulty, setDifficulty] = useState(edition === 'v5' ? 1 : 6);
  const [specialty, setSpecialty] = useState(false);
  const [currentEdition, setCurrentEdition] = useState<GameEdition>(edition);

  const [activeRoll, setActiveRoll] = useState<RollResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<RollResult[]>(storageService.getRollHistory());
  const [selectedRerollIndices, setSelectedRerollIndices] = useState<number[]>([]);

  if (!isOpen) return null;

  const handleRoll = () => {
    setIsRolling(true);
    soundEngine.playDiceRoll();

    setTimeout(() => {
      let result: RollResult;
      const request: RollRequest = {
        id: 'req_' + Date.now(),
        label: label || 'Dice Roll',
        edition: currentEdition,
        poolSize,
        hungerDice: currentEdition === 'v5' ? hungerDice : 0,
        difficulty,
        specialty
      };

      if (currentEdition === 'v5') {
        result = executeV5Roll(request);
      } else {
        result = executeV20Roll(request);
      }

      setActiveRoll(result);
      storageService.addRoll(result);
      setHistory(storageService.getRollHistory());
      setIsRolling(false);
      setSelectedRerollIndices([]);

      // SFX & Celebrations
      if (result.outcome === 'critical' || result.outcome === 'exceptional') {
        soundEngine.playCritical();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#e11d48', '#f59e0b', '#ffffff']
        });
      } else if (result.outcome === 'messy_critical') {
        soundEngine.playCritical();
        confetti({
          particleCount: 35,
          spread: 45,
          colors: ['#dc2626', '#881337']
        });
      } else if (result.outcome === 'bestial_failure' || result.outcome === 'botch') {
        soundEngine.playBestialFail();
      }
    }, 280);
  };

  const handleRouseCheck = () => {
    const res = executeRouseCheck();
    if (res.success) {
      soundEngine.playRouseSuccess();
    } else {
      soundEngine.playRouseFail();
    }
    if (onRouseCheckResult) {
      onRouseCheckResult(res.success);
    }

    const pseudoRoll: RollResult = {
      id: 'rouse_' + Date.now(),
      timestamp: Date.now(),
      label: 'Rouse Check',
      edition: 'v5',
      regularDice: [],
      hungerDice: [res.die],
      successes: res.success ? 1 : 0,
      difficulty: 1,
      outcome: res.success ? 'success' : 'failure',
      outcomeText: res.message
    };
    setActiveRoll(pseudoRoll);
    storageService.addRoll(pseudoRoll);
    setHistory(storageService.getRollHistory());
  };

  const handleToggleDieSelect = (idx: number) => {
    if (selectedRerollIndices.includes(idx)) {
      setSelectedRerollIndices(selectedRerollIndices.filter(i => i !== idx));
    } else {
      if (selectedRerollIndices.length < 3) {
        setSelectedRerollIndices([...selectedRerollIndices, idx]);
      }
    }
  };

  const executeWillpowerReroll = () => {
    if (!activeRoll || selectedRerollIndices.length === 0) return;
    soundEngine.playDiceRoll();
    const updated = rerollRegularDice(activeRoll, selectedRerollIndices);
    setActiveRoll(updated);
    storageService.addRoll(updated);
    setHistory(storageService.getRollHistory());
    setSelectedRerollIndices([]);

    if (updated.outcome === 'critical') soundEngine.playCritical();
  };

  const containerClasses = isFullScreen
    ? 'w-full max-w-4xl mx-auto py-6 px-4'
    : 'fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#09090d] border-l border-[#242433] shadow-2xl p-6 overflow-y-auto animate-slide-left';

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1c1c28]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-300">
            <Dices className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-cinzel text-base font-bold text-neutral-100 tracking-wider">
              DICE ROLLER
            </h2>
            <p className="text-[11px] text-neutral-400">
              VTM {currentEdition.toUpperCase()} Probability & Rules Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Edition Toggle */}
          <div className="flex bg-[#14141e] border border-[#272738] rounded-md p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setCurrentEdition('v5')}
              className={`px-2 py-0.5 rounded font-bold ${currentEdition === 'v5' ? 'bg-rose-900 text-white' : 'text-neutral-500'}`}
            >
              V5
            </button>
            <button
              type="button"
              onClick={() => setCurrentEdition('v20')}
              className={`px-2 py-0.5 rounded font-bold ${currentEdition === 'v20' ? 'bg-rose-900 text-white' : 'text-neutral-500'}`}
            >
              V20
            </button>
          </div>

          {onClose && !isFullScreen && (
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded-md text-sm"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Action Presets Bar */}
      <div className="my-4 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={handleRouseCheck}
          className="px-2.5 py-1.5 rounded-lg bg-[#14141e] hover:bg-rose-950/60 border border-[#29293a] hover:border-rose-700 text-xs text-rose-300 flex items-center gap-1.5 transition"
        >
          <Flame className="w-3.5 h-3.5 text-rose-500" /> Rouse Check
        </button>
        <button
          type="button"
          onClick={() => {
            setLabel('Frenzy Test');
            setPoolSize(5);
            setDifficulty(3);
          }}
          className="px-2.5 py-1.5 rounded-lg bg-[#14141e] hover:bg-[#1f1f2e] border border-[#29293a] text-xs text-neutral-300 flex items-center gap-1.5 transition"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Frenzy Test
        </button>
        <button
          type="button"
          onClick={() => {
            setLabel('Remorse Test');
            setPoolSize(3);
            setDifficulty(1);
          }}
          className="px-2.5 py-1.5 rounded-lg bg-[#14141e] hover:bg-[#1f1f2e] border border-[#29293a] text-xs text-neutral-300 flex items-center gap-1.5 transition"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Remorse Test
        </button>
      </div>

      {/* Controls Form */}
      <div className="bg-[#0f0f15] border border-[#1f1f2d] rounded-xl p-4 space-y-4 mb-4">
        {/* Label */}
        <div>
          <label className="block text-[11px] font-cinzel font-semibold text-neutral-400 mb-1">
            Roll Purpose / Name
          </label>
          <input
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            className="w-full bg-[#161622] border border-[#272738] rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-600"
            placeholder="e.g. Strength + Brawl (Feral Claws)"
          />
        </div>

        {/* Pool Size Slider */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-cinzel text-neutral-300 font-semibold">
              Dice Pool: <span className="font-mono text-rose-400 font-bold">{poolSize} d10</span>
            </span>
            <div className="flex gap-1">
              {[2, 4, 6, 8, 10].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPoolSize(val)}
                  className="px-1.5 py-0.5 rounded text-[10px] bg-[#1a1a26] text-neutral-400 hover:text-white"
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="18"
            value={poolSize}
            onChange={e => setPoolSize(parseInt(e.target.value))}
            className="w-full accent-rose-600 bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* V5 Hunger Dice */}
        {currentEdition === 'v5' && (
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-cinzel text-neutral-300 font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                Hunger Dice: <span className="font-mono text-red-400 font-bold">{hungerDice}</span>
              </span>
              <span className="text-[10px] text-neutral-500">Substituted into pool</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              value={hungerDice}
              onChange={e => setHungerDice(parseInt(e.target.value))}
              className="w-full accent-red-700 bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        )}

        {/* Difficulty */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-cinzel text-neutral-300 font-semibold">
              {currentEdition === 'v5' ? 'Difficulty (Successes Required):' : 'Target Difficulty (Target Number):'}{' '}
              <span className="font-mono text-amber-400 font-bold">{difficulty}</span>
            </span>
          </div>
          <input
            type="range"
            min={currentEdition === 'v5' ? 1 : 2}
            max={currentEdition === 'v5' ? 8 : 10}
            value={difficulty}
            onChange={e => setDifficulty(parseInt(e.target.value))}
            className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* V20 Specialty Checkbox */}
        {currentEdition === 'v20' && (
          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={specialty}
              onChange={e => setSpecialty(e.target.checked)}
              className="accent-rose-600 rounded"
            />
            <span>Specialty Roll (Exploding 10s add extra dice)</span>
          </label>
        )}

        {/* Big Roll Button */}
        <button
          type="button"
          onClick={handleRoll}
          disabled={isRolling}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-rose-800 via-rose-700 to-rose-900 hover:from-rose-700 hover:to-rose-800 text-white font-cinzel font-bold text-sm tracking-wider shadow-[0_0_20px_rgba(225,29,72,0.4)] transition transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <Dices className="w-5 h-5" /> ROLL {poolSize} DICE
        </button>
      </div>

      {/* 3D Dice Stage Tray */}
      <div className="mb-4 space-y-2">
        <DiceTray3D
          regularDice={activeRoll?.regularDice || []}
          hungerDice={activeRoll?.hungerDice || []}
          isRolling={isRolling}
          canSelect={activeRoll?.canWillpowerReroll}
          selectedIndices={selectedRerollIndices}
          onToggleDieSelect={handleToggleDieSelect}
        />

        {/* Active Outcome Text */}
        {activeRoll && !isRolling && (
          <div className="bg-[#12121a] border border-[#222233] rounded-lg p-3 text-center space-y-1">
            <p className="font-cinzel text-xs text-neutral-400">{activeRoll.label}</p>
            <p className="font-mono text-base font-bold text-neutral-100">
              {activeRoll.outcomeText}
            </p>

            {/* Willpower Reroll CTA */}
            {activeRoll.canWillpowerReroll && (
              <div className="pt-2 border-t border-[#1e1e2d] mt-2">
                <p className="text-[11px] text-neutral-400 mb-2">
                  Select up to 3 non-10 regular dice above to reroll with Willpower:
                </p>
                <button
                  type="button"
                  disabled={selectedRerollIndices.length === 0}
                  onClick={executeWillpowerReroll}
                  className="px-3 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 text-xs font-semibold disabled:opacity-40 transition flex items-center justify-center gap-1.5 mx-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reroll {selectedRerollIndices.length} Dice (Spend 1 Willpower)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Log */}
      <div className="pt-2 border-t border-[#1c1c28]">
        <RollHistory
          rolls={history}
          onRerollWithWillpower={roll => {
            setActiveRoll(roll);
            setSelectedRerollIndices([]);
          }}
          onClearHistory={() => {
            storageService.clearRollHistory();
            setHistory([]);
          }}
        />
      </div>
    </div>
  );
};
