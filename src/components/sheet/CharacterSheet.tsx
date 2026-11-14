import React, { useState } from 'react';
import { 
  Character, 
  GameEdition, 
  DamageType 
} from '../../types/vtm';
import { CLANS_DATA } from '../../data/clans';
import { DISCIPLINES_DATA } from '../../data/disciplines';
import { PipCounter } from '../common/PipCounter';
import { DamageTracker } from '../common/DamageTracker';
import { SheetEditorModal } from './SheetEditorModal';
import { 
  Flame, 
  Zap, 
  Shield, 
  Sparkles, 
  Dices, 
  Printer, 
  Edit3, 
  Copy, 
  Download, 
  Trash2, 
  Heart,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface CharacterSheetProps {
  character: Character;
  allCharacters: Character[];
  onSelectCharacter: (id: string) => void;
  onUpdateCharacter: (char: Character) => void;
  onDeleteCharacter: (id: string) => void;
  onDuplicateCharacter: (char: Character) => void;
  onLaunchRoll: (pool: number, label: string, hunger?: number) => void;
  onRouseCheck: () => void;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({
  character,
  allCharacters,
  onSelectCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
  onDuplicateCharacter,
  onLaunchRoll,
  onRouseCheck
}) => {
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<{ name: string; value: number } | null>(null);

  const clanInfo = CLANS_DATA.find(c => c.name.toLowerCase() === character.clan.toLowerCase()) || CLANS_DATA[0];

  // Attribute roll initiator
  const handleAttributeClick = (attrName: string, val: number) => {
    soundEngine.playDiceRoll();
    if (selectedAttribute?.name === attrName) {
      setSelectedAttribute(null);
    } else {
      setSelectedAttribute({ name: attrName, value: val });
    }
  };

  // Skill click initiator: pairs with selected attribute or rolls skill alone
  const handleSkillClick = (skillName: string, skillVal: number) => {
    soundEngine.playDiceRoll();
    if (selectedAttribute) {
      const totalPool = selectedAttribute.value + skillVal;
      const label = `${selectedAttribute.name} + ${skillName}`;
      onLaunchRoll(totalPool, label, character.hunger || 0);
      setSelectedAttribute(null);
    } else {
      onLaunchRoll(skillVal, `${skillName} Roll`, character.hunger || 0);
    }
  };

  const handleDisciplineRoll = (powerName: string, formula?: string) => {
    soundEngine.playDiceRoll();
    onLaunchRoll(5, `${character.name}: ${powerName}`, character.hunger || 0);
  };

  const handleBloodSurge = () => {
    soundEngine.playDiceRoll();
    onRouseCheck();
    // Prime roll with +2 dice
    onLaunchRoll(2, `${character.name}: Blood Surge (+2 Dice Bonus)`, character.hunger || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(character, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${character.name.replace(/\s+/g, '_')}_sheet.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Bar: Selector & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d0d12] border border-[#222230] rounded-xl p-3 no-print">
        {/* Character Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-cinzel text-neutral-400">Dossier:</label>
          <div className="relative">
            <select
              value={character.id}
              onChange={e => onSelectCharacter(e.target.value)}
              className="bg-[#15151f] border border-[#2d2d3e] rounded-lg px-3 py-1.5 text-xs text-white appearance-none pr-8 cursor-pointer font-medium hover:border-rose-700 transition"
            >
              {allCharacters.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.clan} - {c.edition.toUpperCase()})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-2.5 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {selectedAttribute && (
            <div className="text-xs bg-rose-950 border border-rose-700 text-rose-300 px-3 py-1 rounded-lg flex items-center gap-1.5 animate-pulse mr-2">
              <span>Primed: <strong>{selectedAttribute.name} ({selectedAttribute.value})</strong></span>
              <button
                type="button"
                onClick={() => setSelectedAttribute(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setEditorOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-[#151520] hover:bg-[#20202e] border border-[#2b2b3c] text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 transition"
            title="Edit Character Stats"
          >
            <Edit3 className="w-3.5 h-3.5 text-rose-400" /> Edit Dossier
          </button>

          <button
            type="button"
            onClick={() => onDuplicateCharacter(character)}
            className="px-3 py-1.5 rounded-lg bg-[#151520] hover:bg-[#20202e] border border-[#2b2b3c] text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 transition"
            title="Duplicate Character"
          >
            <Copy className="w-3.5 h-3.5 text-neutral-400" /> Clone
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-lg bg-[#151520] hover:bg-[#20202e] border border-[#2b2b3c] text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 transition"
            title="Export Sheet (JSON)"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" /> Export JSON
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-[#151520] hover:bg-[#20202e] border border-[#2b2b3c] text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 transition"
            title="Print Character Sheet"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-400" /> Print / PDF
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${character.name}?`)) {
                onDeleteCharacter(character.id);
              }
            }}
            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950 border border-rose-900 text-rose-400 hover:text-rose-200 transition"
            title="Delete Character"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Sheet Card Container */}
      <div className="bg-[#0a0a0f] border border-[#20202d] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative watermark */}
        <div className="absolute right-6 top-6 text-9xl opacity-5 select-none pointer-events-none font-cinzel">
          {clanInfo.symbol}
        </div>

        {/* Header Block: Portrait & Identification */}
        <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-[#1c1c28] relative z-10">
          {/* Portrait */}
          <div className="shrink-0 flex sm:flex-col items-center gap-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gradient-to-br from-neutral-900 to-[#181824] border-2 border-[#2f2f42] overflow-hidden flex items-center justify-center shadow-lg relative group">
              {character.portraitUrl ? (
                <img
                  src={character.portraitUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">{clanInfo.symbol}</span>
              )}
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300">
              {character.generation}th Gen
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="font-cinzel text-2xl sm:text-3xl font-black tracking-wide text-white">
                {character.name}
              </h1>
              <span className="px-3 py-1 rounded-full bg-rose-950 border border-rose-700 text-xs font-cinzel font-bold text-rose-200 shadow-[0_0_12px_rgba(225,29,72,0.3)]">
                Clan {character.clan}
              </span>
            </div>

            <p className="text-sm font-serif italic text-neutral-300">
              "{character.concept}"
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
              <div>
                <span className="text-neutral-500 block font-cinzel text-[10px]">PREDATOR TYPE</span>
                <span className="text-neutral-200 font-medium">{character.predatorType || 'N/A'}</span>
              </div>
              <div>
                <span className="text-neutral-500 block font-cinzel text-[10px]">SIRE</span>
                <span className="text-neutral-200 font-medium">{character.sire || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-neutral-500 block font-cinzel text-[10px]">HAVEN</span>
                <span className="text-neutral-200 font-medium break-words leading-tight">{character.haven || 'None'}</span>
              </div>
              <div>
                <span className="text-neutral-500 block font-cinzel text-[10px]">COTERIE</span>
                <span className="text-neutral-200 font-medium break-words leading-tight">{character.coterie || 'Solitary'}</span>
              </div>
            </div>

            {/* V5 Ambition & Desire */}
            {character.edition === 'v5' && (character.ambition || character.desire) && (
              <div className="flex flex-wrap gap-4 pt-2 text-xs border-t border-[#181822] mt-2">
                {character.ambition && (
                  <div>
                    <span className="text-neutral-500 font-cinzel text-[10px] mr-1.5">AMBITION:</span>
                    <span className="text-neutral-300">{character.ambition}</span>
                  </div>
                )}
                {character.desire && (
                  <div>
                    <span className="text-neutral-500 font-cinzel text-[10px] mr-1.5">DESIRE:</span>
                    <span className="text-neutral-300">{character.desire}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Trackers & Health Bar */}
        <div className="py-6 border-b border-[#1c1c28] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Health */}
          <DamageTracker
            label="Health"
            subtitle={`${character.healthMax} boxes`}
            damage={character.healthDamage}
            onChange={dmg => onUpdateCharacter({ ...character, healthDamage: dmg })}
            color="blood"
          />

          {/* Willpower */}
          <DamageTracker
            label="Willpower"
            subtitle={`${character.willpowerMax} boxes`}
            damage={character.willpowerDamage}
            onChange={dmg => onUpdateCharacter({ ...character, willpowerDamage: dmg })}
            color="willpower"
          />

          {/* Humanity & Stains */}
          <div className="bg-[#0e0e12] border border-[#23232c] rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-cinzel text-sm font-semibold tracking-wider text-neutral-200 uppercase">
                Humanity
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400">
                {character.humanity} / 10
              </span>
            </div>
            <PipCounter
              value={character.humanity}
              max={10}
              color="emerald"
              onChange={val => onUpdateCharacter({ ...character, humanity: val })}
            />

            {character.edition === 'v5' && (
              <div className="pt-2 border-t border-[#1c1c24] flex items-center justify-between text-xs">
                <span className="text-neutral-400">Stains (Degeneration Risk):</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => onUpdateCharacter({ 
                        ...character, 
                        stains: (character.stains || 0) === st ? st - 1 : st 
                      })}
                      className={`w-4 h-4 rounded border text-[10px] flex items-center justify-center font-bold ${
                        (character.stains || 0) >= st 
                          ? 'bg-red-950 border-red-600 text-red-400' 
                          : 'border-neutral-700 bg-neutral-900'
                      }`}
                    >
                      {(character.stains || 0) >= st ? '•' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Blood & Hunger / Blood Pool */}
          <div className="bg-[#0e0e12] border border-[#23232c] rounded-lg p-3 space-y-2">
            {character.edition === 'v5' ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-cinzel text-sm font-semibold tracking-wider text-rose-400 uppercase flex items-center gap-1">
                    <Flame className="w-4 h-4 text-rose-500 fill-rose-500" /> Hunger
                  </span>
                  <span className="font-mono text-xs font-bold text-rose-400">
                    {character.hunger || 0} / 5
                  </span>
                </div>
                <PipCounter
                  value={character.hunger || 0}
                  max={5}
                  color="blood"
                  onChange={val => onUpdateCharacter({ ...character, hunger: val })}
                />
                <div className="pt-2 border-t border-[#1c1c24] flex items-center justify-between gap-1 text-xs">
                  <button
                    type="button"
                    onClick={onRouseCheck}
                    className="px-2 py-1 rounded bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[11px] font-semibold transition"
                  >
                    Rouse Check
                  </button>
                  <button
                    type="button"
                    onClick={handleBloodSurge}
                    className="px-2 py-1 rounded bg-[#181822] hover:bg-[#252535] border border-[#2d2d3e] text-amber-300 text-[11px] font-semibold transition"
                    title="Spend blood to add +2 dice to next test"
                  >
                    Surge (+2)
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-cinzel text-sm font-semibold tracking-wider text-rose-400 uppercase">
                    Blood Pool
                  </span>
                  <span className="font-mono text-xs font-bold text-rose-400">
                    {character.bloodPoolCurrent || 10} / {character.bloodPoolMax || 15}
                  </span>
                </div>
                <PipCounter
                  value={character.bloodPoolCurrent || 10}
                  max={15}
                  color="blood"
                  onChange={val => onUpdateCharacter({ ...character, bloodPoolCurrent: val })}
                />
                <div className="pt-2 border-t border-[#1c1c24] flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const cur = character.bloodPoolCurrent || 10;
                      if (cur > 0) {
                        soundEngine.playRouseSuccess();
                        onUpdateCharacter({ ...character, bloodPoolCurrent: cur - 1 });
                      }
                    }}
                    className="px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-semibold"
                  >
                    Spend 1 Blood
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section: ATTRIBUTES (Click to prime roll) */}
        <div className="py-6 border-b border-[#1c1c28]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-cinzel text-base font-bold text-neutral-100 tracking-wider">
              ATTRIBUTES
            </h3>
            <span className="text-[11px] text-neutral-500 italic">
              Click an attribute to prime for rolling
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Physical */}
            <div className="bg-[#0e0e14] border border-[#20202d] rounded-xl p-4 space-y-3">
              <span className="font-cinzel text-xs font-bold text-neutral-400 uppercase tracking-widest block border-b border-[#1b1b26] pb-1.5">
                Physical
              </span>
              {(['strength', 'dexterity', 'stamina'] as const).map(attr => {
                const val = character.attributes.physical[attr];
                const isSelected = selectedAttribute?.name.toLowerCase() === attr;
                return (
                  <div key={attr} className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleAttributeClick(attr.toUpperCase(), val)}
                      className={`text-xs font-medium capitalize text-left hover:text-rose-400 transition ${
                        isSelected ? 'text-rose-400 font-bold underline' : 'text-neutral-300'
                      }`}
                    >
                      {attr}
                    </button>
                    <PipCounter
                      value={val}
                      max={5}
                      color="blood"
                      onChange={v => {
                        const next = { ...character };
                        next.attributes.physical[attr] = v;
                        onUpdateCharacter(next);
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Social */}
            <div className="bg-[#0e0e14] border border-[#20202d] rounded-xl p-4 space-y-3">
              <span className="font-cinzel text-xs font-bold text-neutral-400 uppercase tracking-widest block border-b border-[#1b1b26] pb-1.5">
                Social
              </span>
              {(['charisma', 'manipulation', 'composure'] as const).map(attr => {
                const val = character.attributes.social[attr];
                const isSelected = selectedAttribute?.name.toLowerCase() === attr;
                return (
                  <div key={attr} className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleAttributeClick(attr.toUpperCase(), val)}
                      className={`text-xs font-medium capitalize text-left hover:text-rose-400 transition ${
                        isSelected ? 'text-rose-400 font-bold underline' : 'text-neutral-300'
                      }`}
                    >
                      {character.edition === 'v20' && attr === 'composure' ? 'appearance' : attr}
                    </button>
                    <PipCounter
                      value={val}
                      max={5}
                      color="blood"
                      onChange={v => {
                        const next = { ...character };
                        next.attributes.social[attr] = v;
                        onUpdateCharacter(next);
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Mental */}
            <div className="bg-[#0e0e14] border border-[#20202d] rounded-xl p-4 space-y-3">
              <span className="font-cinzel text-xs font-bold text-neutral-400 uppercase tracking-widest block border-b border-[#1b1b26] pb-1.5">
                Mental
              </span>
              {(['intelligence', 'wits', 'resolve'] as const).map(attr => {
                const val = character.attributes.mental[attr];
                const isSelected = selectedAttribute?.name.toLowerCase() === attr;
                return (
                  <div key={attr} className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleAttributeClick(attr.toUpperCase(), val)}
                      className={`text-xs font-medium capitalize text-left hover:text-rose-400 transition ${
                        isSelected ? 'text-rose-400 font-bold underline' : 'text-neutral-300'
                      }`}
                    >
                      {character.edition === 'v20' && attr === 'resolve' ? 'perception' : attr}
                    </button>
                    <PipCounter
                      value={val}
                      max={5}
                      color="blood"
                      onChange={v => {
                        const next = { ...character };
                        next.attributes.mental[attr] = v;
                        onUpdateCharacter(next);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section: SKILLS (Click to roll with primed attribute) */}
        <div className="py-6 border-b border-[#1c1c28]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-cinzel text-base font-bold text-neutral-100 tracking-wider">
              SKILLS & ABILITIES
            </h3>
            <span className="text-[11px] text-neutral-500 italic">
              Click any skill to roll (paired with primed attribute or solo)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Physical Skills */}
            <div className="bg-[#0e0e14] border border-[#20202d] rounded-xl p-4 space-y-2.5">
              <span className="font-cinzel text-xs font-bold text-neutral-400 uppercase tracking-widest block border-b border-[#1b1b26] pb-1.5">
                Physical Skills
              </span>
              {Object.entries(character.skills.physical).map(([skill, val]) => (
                <div key={skill} className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleSkillClick(skill.toUpperCase(), val)}
                      className="text-xs capitalize text-left text-neutral-300 hover:text-rose-400 transition font-medium"
                    >
                      {skill}
                    </button>
                    <PipCounter
                      value={val}
                      max={5}
                      color="blood"
                      onChange={v => {
                        const next = { ...character };
                        (next.skills.physical as any)[skill] = v;
                        onUpdateCharacter(next);
                      }}
                    />
                  </div>
                  {character.specialties[skill]?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {character.specialties[skill].map((spec, si) => (
                        <span key={si} className="text-[10px] text-neutral-500 font-mono italic">
                          • {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Social Skills */}
            <div className="bg-[#0e0e14] border border-[#20202d] rounded-xl p-4 space-y-2.5">
              <span className="font-cinzel text-xs font-bold text-neutral-400 uppercase tracking-widest block border-b border-[#1b1b26] pb-1.5">
                Social Skills
              </span>
              {Object.entries(character.skills.social).map(([skill, val]) => (
                <div key={skill} className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleSkillClick(skill.toUpperCase(), val)}
                      className="text-xs capitalize text-left text-neutral-300 hover:text-rose-400 transition font-medium"
                    >
                      {skill}
                    </button>
                    <PipCounter
                      value={val}
                      max={5}
                      color="blood"
                      onChange={v => {
                        const next = { ...character };
                        (next.skills.social as any)[skill] = v;
                        onUpdateCharacter(next);
                      }}
                    />
                  </div>
                  {character.specialties[skill]?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {character.specialties[skill].map((spec, si) => (
                        <span key={si} className="text-[10px] text-neutral-500 font-mono italic">
                          • {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mental Skills */}
            <div className="bg-[#0e0e14] border border-[#20202d] rounded-xl p-4 space-y-2.5">
              <span className="font-cinzel text-xs font-bold text-neutral-400 uppercase tracking-widest block border-b border-[#1b1b26] pb-1.5">
                Mental Skills
              </span>
              {Object.entries(character.skills.mental).map(([skill, val]) => (
                <div key={skill} className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleSkillClick(skill.toUpperCase(), val)}
                      className="text-xs capitalize text-left text-neutral-300 hover:text-rose-400 transition font-medium"
                    >
                      {skill}
                    </button>
                    <PipCounter
                      value={val}
                      max={5}
                      color="blood"
                      onChange={v => {
                        const next = { ...character };
                        (next.skills.mental as any)[skill] = v;
                        onUpdateCharacter(next);
                      }}
                    />
                  </div>
                  {character.specialties[skill]?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {character.specialties[skill].map((spec, si) => (
                        <span key={si} className="text-[10px] text-neutral-500 font-mono italic">
                          • {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section: DISCIPLINES & POWERS */}
        <div className="py-6 border-b border-[#1c1c28]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-cinzel text-base font-bold text-neutral-100 tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" /> DISCIPLINES & BLOOD POWERS
            </h3>
            <span className="text-[11px] text-neutral-500">
              Click power to launch roll into dice tray
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {character.disciplines.map(disc => {
              const discDef = DISCIPLINES_DATA.find(d => d.name.toLowerCase() === disc.name.toLowerCase());
              return (
                <div
                  key={disc.id}
                  className="bg-[#0e0e14] border border-[#20202d] rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#1c1c28] pb-2">
                    <span className="font-cinzel font-bold text-rose-300 text-sm">
                      {disc.name}
                    </span>
                    <PipCounter
                      value={disc.level}
                      max={5}
                      color="blood"
                      onChange={v => {
                        const next = { ...character };
                        const found = next.disciplines.find(d => d.id === disc.id);
                        if (found) found.level = v;
                        onUpdateCharacter(next);
                      }}
                    />
                  </div>

                  {/* Powers List */}
                  <div className="space-y-1.5">
                    {disc.powers.map((powerName, pi) => {
                      const powerDef = discDef?.powers.find(p => p.name.toLowerCase() === powerName.toLowerCase());
                      return (
                        <button
                          key={pi}
                          type="button"
                          onClick={() => handleDisciplineRoll(powerName, powerDef?.dicePool)}
                          className="w-full text-left p-2 rounded-lg bg-[#14141e] hover:bg-[#1c1c2a] border border-[#242433] hover:border-rose-800 transition flex items-center justify-between group"
                        >
                          <div>
                            <span className="text-xs font-medium text-neutral-200 group-hover:text-rose-300 block">
                              {powerName}
                            </span>
                            {powerDef?.dicePool && (
                              <span className="text-[10px] font-mono text-neutral-500">
                                {powerDef.dicePool}
                              </span>
                            )}
                          </div>
                          {powerDef?.rouseCost !== undefined && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/70 border border-rose-800 text-rose-400">
                              {powerDef.rouseCost === 0 ? 'Free' : `Rouse ${powerDef.rouseCost}`}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: ADVANTAGES, MERITS & TOUCHSTONES */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Merits & Flaws */}
          <div className="bg-[#0e0e14] border border-[#20202d] rounded-xl p-4 space-y-3">
            <span className="font-cinzel text-xs font-bold text-neutral-300 uppercase tracking-widest block border-b border-[#1b1b26] pb-1.5">
              Advantages, Backgrounds & Flaws
            </span>
            <div className="space-y-2">
              {character.advantages.map(adv => (
                <div
                  key={adv.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#14141d] border border-[#20202d]"
                >
                  <div>
                    <span className={`text-xs font-medium ${adv.type === 'merit' ? 'text-neutral-200' : 'text-rose-400'}`}>
                      {adv.name}
                    </span>
                    {adv.details && (
                      <p className="text-[10px] text-neutral-500">{adv.details}</p>
                    )}
                  </div>
                  <PipCounter
                    value={adv.dots}
                    max={5}
                    color={adv.type === 'merit' ? 'gold' : 'blood'}
                    readOnly
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Touchstones & Convictions */}
          <div className="bg-[#0e0e14] border border-[#20202d] rounded-xl p-4 space-y-3">
            <span className="font-cinzel text-xs font-bold text-neutral-300 uppercase tracking-widest block border-b border-[#1b1b26] pb-1.5 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" /> Touchstones & Convictions
            </span>
            {character.touchstones && character.touchstones.length > 0 ? (
              <div className="space-y-2">
                {character.touchstones.map(t => (
                  <div
                    key={t.id}
                    className="p-3 rounded-lg bg-[#14141d] border border-[#20202d] space-y-1"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-rose-300 font-semibold font-cinzel">
                      <UserCheck className="w-3.5 h-3.5" /> {t.touchstone}
                    </div>
                    <p className="text-xs text-neutral-300 italic">
                      "{t.conviction}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic py-3 text-center">
                No touchstones registered yet. Edit sheet to add mortal anchors.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      <SheetEditorModal
        character={character}
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={updated => onUpdateCharacter(updated)}
      />
    </div>
  );
};
