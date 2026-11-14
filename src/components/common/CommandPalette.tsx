import React, { useState, useEffect } from 'react';
import { Search, User, Shield, Dices, BookOpen, Sparkles, MapPin, Plus, FileText, ArrowRight, Droplet, Skull } from 'lucide-react';
import { Character, GameEdition } from '../../types/vtm';
import { CLANS_DATA } from '../../data/clans';
import { DISCIPLINES_DATA } from '../../data/disciplines';
import { RITUALS_CEREMONIES_DATA } from '../../data/rituals';
import { ALCHEMY_RECIPES } from '../../data/alchemy';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  onSelectCharacter: (charId: string) => void;
  onNavigateView: (view: string) => void;
  onOpenDice: () => void;
  onOpenSoundboard: () => void;
  onOpenResonance: () => void;
  onToggleEdition: (edition: GameEdition) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  characters,
  onSelectCharacter,
  onNavigateView,
  onOpenDice,
  onOpenSoundboard,
  onOpenResonance,
  onToggleEdition
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedCharacters = characters.filter(c => 
    c.name.toLowerCase().includes(q) || c.clan.toLowerCase().includes(q) || c.concept.toLowerCase().includes(q)
  );

  const matchedClans = CLANS_DATA.filter(c => 
    c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q)
  );

  const matchedDisciplines = DISCIPLINES_DATA.filter(d => 
    d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
  );

  const matchedRituals = RITUALS_CEREMONIES_DATA.filter(r =>
    r.name.toLowerCase().includes(q) || r.system.toLowerCase().includes(q)
  );

  const matchedAlchemy = ALCHEMY_RECIPES.filter(a =>
    a.name.toLowerCase().includes(q) || a.effect.toLowerCase().includes(q)
  );

  const actions = [
    { label: 'Character Sheet', icon: User, action: () => { onNavigateView('sheet'); onClose(); } },
    { label: 'Character Builder (Creator)', icon: Plus, action: () => { onNavigateView('creator'); onClose(); } },
    { label: 'Fast Build (Quick Character)', icon: Sparkles, action: () => { onNavigateView('fastbuild'); onClose(); } },
    { label: 'Chronicle Manager & Map', icon: MapPin, action: () => { onNavigateView('chronicle'); onClose(); } },
    { label: 'Interactive Dice Roller', icon: Dices, action: () => { onOpenDice(); onClose(); } },
    { label: 'Blood Resonance & Hunting Roller', icon: Droplet, action: () => { onOpenResonance(); onClose(); } },
    { label: 'Blood Test (Clan Quiz)', icon: Shield, action: () => { onNavigateView('quiz'); onClose(); } },
    { label: 'Compendium & Lore Wiki', icon: BookOpen, action: () => { onNavigateView('wiki'); onClose(); } },
    { label: 'Open Atmosphere Soundboard', icon: Sparkles, action: () => { onOpenSoundboard(); onClose(); } },
    { label: 'Switch to V5 Rules', icon: FileText, action: () => { onToggleEdition('v5'); onClose(); } },
    { label: 'Switch to V20 Rules', icon: FileText, action: () => { onToggleEdition('v20'); onClose(); } },
  ].filter(a => a.label.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0e0e13] border border-[#2b2b3a] rounded-xl max-w-xl w-full shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#1f1f2a] gap-3">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search characters, clans, disciplines, rituals, alchemy or tools... (Esc to close)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none font-sans"
          />
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-neutral-700 text-neutral-400">
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-4">
          {/* Quick Actions */}
          {actions.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-cinzel font-bold text-neutral-500 uppercase tracking-widest mb-1">
                Navigation & Actions
              </p>
              <div className="space-y-0.5">
                {actions.map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={act.action}
                      className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-[#181822] text-neutral-300 hover:text-white transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-rose-500 group-hover:text-rose-400" />
                        <span className="text-sm">{act.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Characters */}
          {matchedCharacters.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-cinzel font-bold text-neutral-500 uppercase tracking-widest mb-1">
                Characters ({matchedCharacters.length})
              </p>
              <div className="space-y-0.5">
                {matchedCharacters.map(char => (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => {
                      onSelectCharacter(char.id);
                      onNavigateView('sheet');
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-[#181822] text-neutral-300 hover:text-white transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-rose-950 border border-rose-800 flex items-center justify-center text-[10px] font-bold text-rose-300">
                        {char.clan.slice(0, 2)}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-neutral-200">{char.name}</span>
                        <span className="text-xs text-neutral-500 ml-2">({char.clan} - {char.concept})</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-rose-400 uppercase">{char.edition}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clans */}
          {matchedClans.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-cinzel font-bold text-neutral-500 uppercase tracking-widest mb-1">
                Clans in Lore Wiki ({matchedClans.length})
              </p>
              <div className="space-y-0.5">
                {matchedClans.slice(0, 5).map(clan => (
                  <button
                    key={clan.name}
                    type="button"
                    onClick={() => {
                      onNavigateView('wiki');
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-[#181822] text-neutral-300 hover:text-white transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{clan.symbol}</span>
                      <span className="text-sm font-cinzel font-bold text-neutral-200">{clan.name}</span>
                      <span className="text-xs text-neutral-500 truncate max-w-[280px]">— {clan.tagline}</span>
                    </div>
                    <span className="text-xs text-neutral-600">View Lore →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Disciplines */}
          {matchedDisciplines.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-cinzel font-bold text-neutral-500 uppercase tracking-widest mb-1">
                Disciplines ({matchedDisciplines.length})
              </p>
              <div className="space-y-0.5">
                {matchedDisciplines.slice(0, 5).map(disc => (
                  <button
                    key={disc.id}
                    type="button"
                    onClick={() => {
                      onNavigateView('wiki');
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-[#181822] text-neutral-300 hover:text-white transition"
                  >
                    <span className="text-sm font-cinzel font-semibold text-rose-400">{disc.name}</span>
                    <span className="text-xs text-neutral-500 truncate max-w-[300px]">{disc.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rituals & Ceremonies */}
          {matchedRituals.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-cinzel font-bold text-neutral-500 uppercase tracking-widest mb-1">
                Rituals & Ceremonies ({matchedRituals.length})
              </p>
              <div className="space-y-0.5">
                {matchedRituals.slice(0, 4).map(rit => (
                  <button
                    key={rit.id}
                    type="button"
                    onClick={() => {
                      onNavigateView('wiki');
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-[#181822] text-neutral-300 hover:text-white transition"
                  >
                    <span className="text-sm font-cinzel text-neutral-200">{rit.name}</span>
                    <span className="text-xs font-mono text-rose-400">Level {rit.level}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
