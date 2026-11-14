import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Dices, 
  Flame, 
  Sparkles, 
  AlertTriangle, 
  Skull, 
  X, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import { syncEngine } from '../../services/syncEngine';
import { soundEngine } from '../../services/soundEngine';
import { DiceBroadcastPayload } from '../../types/network';

interface LiveDiceBannerProps {
  onDismiss?: () => void;
}

export const LiveDiceBanner: React.FC<LiveDiceBannerProps> = ({ onDismiss }) => {
  const [activeRoll, setActiveRoll] = useState<DiceBroadcastPayload | null>(null);
  const [progress, setProgress] = useState<number>(100);
  const timerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const unsub = syncEngine.onDiceRoll((payload: DiceBroadcastPayload) => {
      // Zero-Spoilers Rule: Secret rolls must never trigger on public banner
      if (payload.isSecretRoll) return;

      displayRoll(payload);
    });

    return () => {
      unsub();
      clearTimers();
    };
  }, []);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const displayRoll = (payload: DiceBroadcastPayload) => {
    clearTimers();
    setActiveRoll(payload);
    setProgress(100);

    // Audio SFX & Cinematic visual feedback
    if (payload.isMessyCritical) {
      soundEngine.playCritical();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.3 },
        colors: ['#e11d48', '#991b1b', '#450a0a']
      });
    } else if (payload.isBestialFailure) {
      soundEngine.playBestialFail();
    } else if (payload.successes >= 4 || payload.margin >= 3) {
      soundEngine.playCritical();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.3 },
        colors: ['#d97706', '#f59e0b', '#ffffff']
      });
    } else {
      soundEngine.playDiceRoll();
    }

    // Auto-dismiss after 4.5 seconds with smooth progress bar
    const startTime = Date.now();
    const duration = 4500;

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
    }, 50);

    timerRef.current = window.setTimeout(() => {
      dismiss();
    }, duration);
  };

  const dismiss = () => {
    clearTimers();
    setActiveRoll(null);
    if (onDismiss) onDismiss();
  };

  if (!activeRoll) return null;

  const getOutcomeBanner = () => {
    if (activeRoll.isMessyCritical) {
      return {
        title: 'MESSY CRITICAL',
        subtitle: 'The Beast surfaces! Compulsion triggered through bloodlust.',
        bg: 'from-rose-950 via-red-950 to-neutral-950 border-rose-600',
        textColor: 'text-rose-100',
        badgeBg: 'bg-rose-900 text-rose-100 border-rose-500',
        icon: Flame
      };
    }
    if (activeRoll.isBestialFailure) {
      return {
        title: 'BESTIAL FAILURE',
        subtitle: 'The test failed and Hunger manifested uncontrolled feral hunger.',
        bg: 'from-neutral-950 via-stone-950 to-black border-red-800',
        textColor: 'text-red-400',
        badgeBg: 'bg-red-950 text-red-200 border-red-700',
        icon: Skull
      };
    }
    if (activeRoll.successes >= 1) {
      return {
        title: activeRoll.margin >= 3 ? 'EXCEPTIONAL SUCCESS' : 'TEST SUCCEEDED',
        subtitle: `${activeRoll.successes} Total Successes (Margin: ${activeRoll.margin >= 0 ? '+' : ''}${activeRoll.margin})`,
        bg: 'from-[#12121e] via-[#181524] to-[#0d0d14] border-amber-600/70',
        textColor: 'text-amber-200',
        badgeBg: 'bg-amber-950 text-amber-200 border-amber-500',
        icon: Sparkles
      };
    }
    return {
      title: 'TEST FAILED',
      subtitle: `0 Successes achieved against difficulty.`,
      bg: 'from-[#121016] via-[#16121a] to-black border-neutral-700',
      textColor: 'text-neutral-300',
      badgeBg: 'bg-neutral-900 text-neutral-300 border-neutral-700',
      icon: AlertTriangle
    };
  };

  const banner = getOutcomeBanner();
  const Icon = banner.icon;

  return (
    <div 
      className="fixed top-4 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[600px] z-50 pointer-events-auto animate-bounce-in shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
      onClick={dismiss}
      role="alert"
    >
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${banner.bg} border-2 p-4 sm:p-5 backdrop-blur-xl cursor-pointer select-none transition-transform hover:scale-[1.01]`}>
        
        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
          className="absolute top-3 right-3 p-1 rounded-full bg-black/40 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header: Roller Moniker & Action Pool */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md bg-black/60 border border-white/10 flex items-center justify-center">
            <Dices className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-cinzel text-xs font-bold text-white tracking-wider">
              {activeRoll.rollerName}
            </span>
            {activeRoll.characterName && (
              <span className="text-xs font-serif italic text-rose-300">
                ({activeRoll.characterName})
              </span>
            )}
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 border border-white/10 text-neutral-300">
              {activeRoll.poolLabel}
            </span>
          </div>
        </div>

        {/* Center: Outcome Banner */}
        <div className="flex items-center justify-between gap-3 my-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${banner.badgeBg} border shadow-inner`}>
              <Icon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className={`font-cinzel text-base sm:text-lg font-black tracking-widest ${banner.textColor}`}>
                {banner.title}
              </h4>
              <p className="text-xs font-serif italic text-neutral-300">
                {banner.subtitle}
              </p>
            </div>
          </div>

          {/* Successes counter medallion */}
          <div className="text-center px-3 py-1 rounded-xl bg-black/60 border border-white/10">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block">SUCCESSES</span>
            <span className="font-cinzel text-xl sm:text-2xl font-black text-white">
              {activeRoll.successes}
            </span>
          </div>
        </div>

        {/* 3D Result Dice Row */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
          {/* Regular Dice */}
          {activeRoll.results.map((val, idx) => {
            const isTen = val === 10;
            const isSuccess = val >= 6;
            return (
              <div
                key={`reg_${idx}`}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shadow-md transition-all ${
                  isTen
                    ? 'bg-gradient-to-br from-amber-600 to-amber-900 border-2 border-amber-300 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)] scale-105'
                    : isSuccess
                    ? 'bg-[#1e1e2c] border border-neutral-600 text-white'
                    : 'bg-[#101016] border border-neutral-800 text-neutral-500'
                }`}
                title={`Regular Die: ${val}`}
              >
                {val}
              </div>
            );
          })}

          {/* Hunger Dice */}
          {activeRoll.hungerResults.map((val, idx) => {
            const isTen = val === 10;
            const isOne = val === 1;
            const isSuccess = val >= 6;
            return (
              <div
                key={`hng_${idx}`}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shadow-md transition-all ${
                  isTen
                    ? 'bg-gradient-to-br from-red-600 via-rose-700 to-red-950 border-2 border-red-400 text-white shadow-[0_0_14px_rgba(225,29,72,0.7)] animate-pulse scale-105'
                    : isOne
                    ? 'bg-red-950 border-2 border-red-700 text-red-300 shadow-[0_0_8px_rgba(185,28,28,0.5)]'
                    : isSuccess
                    ? 'bg-rose-950/80 border border-rose-600 text-rose-200'
                    : 'bg-[#1a0a0e] border border-rose-900/40 text-rose-500/60'
                }`}
                title={`Hunger Die: ${val}`}
              >
                {val}
              </div>
            );
          })}
        </div>

        {/* Auto-Dismiss Progress Bar */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-black/40">
          <div 
            className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
