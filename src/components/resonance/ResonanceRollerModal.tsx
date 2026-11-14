import React, { useState } from 'react';
import { Vessel, generateRandomVessel, RESONANCES } from '../../data/resonance';
import { Character } from '../../types/vtm';
import { Flame, Droplet, Sparkles, RefreshCw, X, Heart, Shield } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface ResonanceRollerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCharacter?: Character;
  onFeed?: (slakeAmount: number, resonanceName: string) => void;
}

export const ResonanceRollerModal: React.FC<ResonanceRollerModalProps> = ({
  isOpen,
  onClose,
  activeCharacter,
  onFeed
}) => {
  const [currentVessel, setCurrentVessel] = useState<Vessel>(() => generateRandomVessel());
  const [vesselLog, setVesselLog] = useState<Vessel[]>([currentVessel]);

  if (!isOpen) return null;

  const handleScoutVessel = () => {
    soundEngine.playDiceRoll();
    const newVessel = generateRandomVessel();
    setCurrentVessel(newVessel);
    setVesselLog([newVessel, ...vesselLog.slice(0, 5)]);

    if (newVessel.temperament === 'acute') {
      soundEngine.playCritical();
    }
  };

  const handleFeed = () => {
    soundEngine.playRouseSuccess();
    if (onFeed) {
      onFeed(2, `${currentVessel.resonance.name} (${currentVessel.temperament})`);
    }
  };

  const resonanceColors: Record<string, string> = {
    choleric: 'text-rose-400 border-rose-800 bg-rose-950/70',
    melancholic: 'text-amber-300 border-amber-800 bg-amber-950/70',
    phlegmatic: 'text-blue-300 border-blue-800 bg-blue-950/70',
    sanguine: 'text-emerald-300 border-emerald-800 bg-emerald-950/70',
    empty: 'text-purple-300 border-purple-800 bg-purple-950/70'
  };

  const resColor = resonanceColors[currentVessel.resonance.id] || resonanceColors.choleric;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b0b10] border border-[#262638] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1c1c28]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400">
              <Droplet className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h2 className="font-cinzel text-base font-bold text-white tracking-wider">
                BLOOD RESONANCE & HUNTING ROLLER
              </h2>
              <p className="text-[11px] text-neutral-400">
                Identify vessel emotional temperaments, discipline bonuses, and rare acute Dyscrasias.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Scout Action Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleScoutVessel}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-900 to-rose-700 hover:from-rose-800 hover:to-rose-600 text-white font-cinzel font-bold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(225,29,72,0.3)] transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Scout New Mortal Vessel
          </button>

          {activeCharacter && (
            <span className="text-xs font-mono text-neutral-400">
              Hunter: <strong className="text-rose-300">{activeCharacter.name}</strong> (Hunger: {activeCharacter.hunger || 0}/5)
            </span>
          )}
        </div>

        {/* Current Vessel Spotlight Card */}
        <div className="bg-[#12121b] border border-[#222230] rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
                LOCATION: {currentVessel.location}
              </span>
              <h3 className="font-serif text-lg font-medium text-white italic mt-0.5">
                "{currentVessel.archetype}"
              </h3>
            </div>
            <span className={`px-2.5 py-1 rounded-full border text-xs font-cinzel font-bold uppercase ${resColor}`}>
              {currentVessel.resonance.name} ({currentVessel.resonance.element})
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-[#1a1a26]">
            <div>
              <span className="text-neutral-500 text-[10px] font-cinzel block">EMOTIONAL CHARGE</span>
              <p className="text-neutral-300 text-[11px] leading-relaxed">{currentVessel.resonance.emotions}</p>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] font-cinzel block">MATCHING DISCIPLINES</span>
              <p className="text-rose-400 font-mono font-medium">{currentVessel.resonance.disciplines.join(' • ')}</p>
            </div>
          </div>

          {/* Temperament & Bonus Box */}
          <div className="p-3 rounded-lg bg-[#161622] border border-[#272738] text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-cinzel font-bold text-neutral-200">
                Temperament: <span className="uppercase text-amber-400">{currentVessel.temperament}</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-500">
                {currentVessel.temperament === 'negligible' ? 'No discipline boost' : currentVessel.temperament === 'fleeting' ? '+1 Die to Matching Disciplines' : currentVessel.temperament === 'intense' ? '+1 Die & +1 Temp Dot' : '🔥 ACUTE DYSCRASIA GRANTED!'}
              </span>
            </div>

            {currentVessel.dyscrasia && (
              <div className="pt-2 border-t border-[#232333] mt-1 space-y-1">
                <span className="text-xs font-cinzel font-bold text-rose-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Dyscrasia: {currentVessel.dyscrasia.name}
                </span>
                <p className="text-[11px] text-neutral-300 italic">{currentVessel.dyscrasia.description}</p>
                <p className="text-[11px] text-emerald-400 font-medium">{currentVessel.dyscrasia.bonus}</p>
              </div>
            )}
          </div>

          {/* Action: Feed on Vessel */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleFeed}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 hover:from-rose-900 hover:to-rose-800 border border-rose-700 text-rose-100 font-cinzel font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(225,29,72,0.3)] transition"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" /> FEED ON VESSEL (Slake 2 Hunger & Absorb Resonance)
            </button>
          </div>
        </div>

        {/* Resonance Cheat Sheet */}
        <div className="border-t border-[#1c1c28] pt-3 text-[11px] text-neutral-400">
          <span className="font-cinzel text-neutral-300 font-bold block mb-1">RESONANCE REFERENCE GUIDE:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
            <div><strong>Choleric:</strong> Celerity / Potence</div>
            <div><strong>Melancholic:</strong> Fortitude / Obfuscate</div>
            <div><strong>Phlegmatic:</strong> Auspex / Dominate</div>
            <div><strong>Sanguine:</strong> Sorcery / Presence</div>
          </div>
        </div>
      </div>
    </div>
  );
};
