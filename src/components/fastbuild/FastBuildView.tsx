import React, { useState } from 'react';
import { GameEdition, Character } from '../../types/vtm';
import { CLANS_DATA } from '../../data/clans';
import { generateRandomKindred } from '../../services/npcGenerator';
import { Zap, Sparkles, RefreshCw, Check, ArrowRight } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface FastBuildViewProps {
  edition: GameEdition;
  onSelectCharacter: (char: Character) => void;
  onNavigateView: (view: string) => void;
}

export const FastBuildView: React.FC<FastBuildViewProps> = ({
  edition,
  onSelectCharacter,
  onNavigateView
}) => {
  const [selectedClan, setSelectedClan] = useState<string>('random');
  const [previewChar, setPreviewChar] = useState<Character>(() => generateRandomKindred(edition));

  const handleGenerate = () => {
    soundEngine.playDiceRoll();
    const char = generateRandomKindred(edition, selectedClan === 'random' ? undefined : selectedClan);
    setPreviewChar(char);
  };

  const handleAccept = () => {
    soundEngine.playCritical();
    onSelectCharacter(previewChar);
    onNavigateView('sheet');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#20202d]">
        <div>
          <h1 className="font-cinzel text-2xl font-black text-white tracking-wider flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-amber-400" /> FAST BUILD // INSTANT ARCHETYPE
          </h1>
          <p className="text-xs text-neutral-400">
            Generate complete, ready-to-play Kindred characters and NPCs with balanced stats, disciplines, and lore in seconds.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-900 to-rose-800 hover:from-rose-800 hover:to-rose-700 text-white font-cinzel font-bold text-xs tracking-wider flex items-center gap-2 shadow-lg transition"
        >
          <RefreshCw className="w-4 h-4" /> Re-roll Kindred
        </button>
      </div>

      {/* Configuration bar */}
      <div className="bg-[#0e0e13] border border-[#222230] rounded-xl p-4 flex flex-wrap items-center gap-4 text-xs">
        <div>
          <label className="text-neutral-400 font-cinzel block mb-1">Target Clan:</label>
          <select
            value={selectedClan}
            onChange={e => setSelectedClan(e.target.value)}
            className="bg-[#151520] border border-[#2b2b3c] rounded-lg px-3 py-1.5 text-white"
          >
            <option value="random">🎲 Random Clan</option>
            {CLANS_DATA.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 flex justify-end">
          <button
            type="button"
            onClick={handleAccept}
            className="px-6 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 font-cinzel font-bold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition"
          >
            <Check className="w-4 h-4" /> PLAY THIS CHARACTER →
          </button>
        </div>
      </div>

      {/* Generated Character Preview Card */}
      <div className="bg-[#0a0a0f] border border-[#20202d] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#1c1c28]">
          <div>
            <h2 className="font-cinzel text-2xl font-black text-white">{previewChar.name}</h2>
            <p className="text-sm font-serif italic text-neutral-300">"{previewChar.concept}"</p>
            <p className="text-xs text-neutral-500 mt-1">Ambition: {previewChar.ambition}</p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded-full bg-rose-950 border border-rose-700 text-xs font-cinzel font-bold text-rose-300">
              Clan {previewChar.clan}
            </span>
            <p className="text-xs font-mono text-neutral-400 mt-1">
              {previewChar.generation}th Gen • {previewChar.predatorType || 'Vampire'}
            </p>
          </div>
        </div>

        {/* Core Attributes */}
        <div>
          <h3 className="font-cinzel text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
            Attributes Summary
          </h3>
          <div className="grid grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-[#12121a] border border-[#20202d] rounded-lg p-3 space-y-1">
              <p className="font-cinzel text-neutral-500 font-bold">PHYSICAL</p>
              <p>Strength: <strong className="text-rose-400">{previewChar.attributes.physical.strength}</strong></p>
              <p>Dexterity: <strong className="text-rose-400">{previewChar.attributes.physical.dexterity}</strong></p>
              <p>Stamina: <strong className="text-rose-400">{previewChar.attributes.physical.stamina}</strong></p>
            </div>
            <div className="bg-[#12121a] border border-[#20202d] rounded-lg p-3 space-y-1">
              <p className="font-cinzel text-neutral-500 font-bold">SOCIAL</p>
              <p>Charisma: <strong className="text-rose-400">{previewChar.attributes.social.charisma}</strong></p>
              <p>Manipulation: <strong className="text-rose-400">{previewChar.attributes.social.manipulation}</strong></p>
              <p>Composure: <strong className="text-rose-400">{previewChar.attributes.social.composure}</strong></p>
            </div>
            <div className="bg-[#12121a] border border-[#20202d] rounded-lg p-3 space-y-1">
              <p className="font-cinzel text-neutral-500 font-bold">MENTAL</p>
              <p>Intelligence: <strong className="text-rose-400">{previewChar.attributes.mental.intelligence}</strong></p>
              <p>Wits: <strong className="text-rose-400">{previewChar.attributes.mental.wits}</strong></p>
              <p>Resolve: <strong className="text-rose-400">{previewChar.attributes.mental.resolve}</strong></p>
            </div>
          </div>
        </div>

        {/* Disciplines & Advantages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#12121a] border border-[#20202d] rounded-lg p-4 space-y-2">
            <p className="font-cinzel text-neutral-400 font-bold">DISCIPLINES</p>
            {previewChar.disciplines.map(d => (
              <div key={d.id} className="flex justify-between items-center text-neutral-200">
                <span>{d.name} ({d.powers.join(', ') || 'Basics'})</span>
                <span className="font-mono text-rose-400 font-bold">{d.level} dots</span>
              </div>
            ))}
          </div>

          <div className="bg-[#12121a] border border-[#20202d] rounded-lg p-4 space-y-2">
            <p className="font-cinzel text-neutral-400 font-bold">TOUCHSTONES & HAVEN</p>
            {previewChar.touchstones?.map(t => (
              <p key={t.id} className="text-neutral-300">
                <strong>{t.touchstone}:</strong> "{t.conviction}"
              </p>
            ))}
            <p className="text-neutral-400 text-[11px] pt-1">
              Haven: {previewChar.haven}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#1c1c28] flex justify-end">
          <button
            type="button"
            onClick={handleAccept}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-900 to-rose-700 hover:from-rose-800 hover:to-rose-600 text-white font-cinzel font-black text-xs tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.4)] transition"
          >
            ADOPT DOSSIER INTO SHEETS <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
