import React, { useState } from 'react';
import { Character, GameEdition } from '../../types/vtm';
import { generateRandomKindred } from '../../services/npcGenerator';
import { Plus, Sparkles, Trash2, Dices, ChevronRight, User } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface NpcRosterProps {
  chronicleId: string;
  edition: GameEdition;
  onLaunchRoll: (pool: number, label: string) => void;
}

export const NpcRoster: React.FC<NpcRosterProps> = ({
  chronicleId,
  edition,
  onLaunchRoll
}) => {
  const [npcs, setNpcs] = useState<Character[]>(() => [
    generateRandomKindred(edition, 'Ventrue'),
    generateRandomKindred(edition, 'Nosferatu'),
    generateRandomKindred(edition, 'Tremere')
  ]);

  const [selectedNpc, setSelectedNpc] = useState<Character | null>(null);

  const handleGenerateNpc = () => {
    soundEngine.playDiceRoll();
    const newNpc = generateRandomKindred(edition);
    setNpcs([newNpc, ...npcs]);
  };

  const handleDeleteNpc = (id: string) => {
    setNpcs(npcs.filter(n => n.id !== id));
    if (selectedNpc?.id === id) setSelectedNpc(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#0e0e13] border border-[#222230] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <h2 className="font-cinzel text-base font-bold text-neutral-100 tracking-wider">
            STORYTELLER NPC ROSTER
          </h2>
          <p className="text-[11px] text-neutral-400">
            Dossiers of Princes, Barons, Hounds, Primogen, and street informants for this chronicle.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateNpc}
          className="px-4 py-2 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 font-cinzel font-bold flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(225,29,72,0.3)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Spawn Random Kindred NPC
        </button>
      </div>

      {/* Grid of NPCs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {npcs.map(npc => (
          <div
            key={npc.id}
            className="bg-[#0b0b10] border border-[#20202d] hover:border-[#353549] rounded-2xl p-5 shadow-xl space-y-3 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-[#1c1c28] pb-2.5">
                <div>
                  <h3 className="font-cinzel font-bold text-base text-white">{npc.name}</h3>
                  <p className="text-xs font-serif italic text-neutral-300">"{npc.concept}"</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-[10px] font-cinzel font-bold text-rose-300 shrink-0">
                  {npc.clan}
                </span>
              </div>

              <div className="pt-2 text-xs text-neutral-400 space-y-1">
                <p>Generation: <strong className="text-neutral-200">{npc.generation}th</strong> • {npc.predatorType || 'Kindred'}</p>
                <p>Haven: <strong className="text-neutral-300 truncate block">{npc.haven}</strong></p>
                <p className="text-[11px] text-neutral-400 italic">Ambition: {npc.ambition}</p>
              </div>

              {/* Disciplines Chips */}
              <div className="flex flex-wrap gap-1 pt-2">
                {npc.disciplines.map(d => (
                  <span key={d.id} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161622] border border-[#262638] text-rose-300">
                    {d.name} {d.level}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-[#1c1c28] flex items-center justify-between">
              <button
                type="button"
                onClick={() => onLaunchRoll(6, `${npc.name}: General Action`)}
                className="px-2.5 py-1 rounded bg-[#151520] hover:bg-[#20202e] border border-[#2b2b3c] text-xs text-neutral-300 flex items-center gap-1 transition"
              >
                <Dices className="w-3 h-3 text-rose-400" /> Quick Roll
              </button>

              <button
                type="button"
                onClick={() => handleDeleteNpc(npc.id)}
                className="text-neutral-500 hover:text-rose-400 p-1"
                title="Remove NPC"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
