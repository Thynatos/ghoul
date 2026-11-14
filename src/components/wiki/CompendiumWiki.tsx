import React, { useState } from 'react';
import { CLANS_DATA } from '../../data/clans';
import { DISCIPLINES_DATA } from '../../data/disciplines';
import { RITUALS_CEREMONIES_DATA } from '../../data/rituals';
import { ALCHEMY_RECIPES } from '../../data/alchemy';
import { PREDATOR_TYPES_DATA } from '../../data/predatorTypes';
import { ADVANTAGES_DATABASE } from '../../data/advantages';
import { THREAT_STAT_BLOCKS } from '../../data/npcStatBlocks';
import { BookOpen, Search, Shield, Sparkles, Flame, Layers, Skull, Droplet, Crosshair } from 'lucide-react';

export const CompendiumWiki: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'clans' | 'disciplines' | 'rituals' | 'alchemy' | 'threats' | 'predators' | 'advantages' | 'rules'>('clans');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClan, setSelectedClan] = useState<string>(CLANS_DATA[0].name);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>(DISCIPLINES_DATA[0].id);

  const q = searchQuery.toLowerCase().trim();

  const filteredClans = CLANS_DATA.filter(c => 
    c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q) || c.lore.toLowerCase().includes(q)
  );

  const filteredDisciplines = DISCIPLINES_DATA.filter(d => 
    d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
  );

  const filteredRituals = RITUALS_CEREMONIES_DATA.filter(r =>
    r.name.toLowerCase().includes(q) || r.system.toLowerCase().includes(q) || r.type.toLowerCase().includes(q)
  );

  const filteredAlchemy = ALCHEMY_RECIPES.filter(a =>
    a.name.toLowerCase().includes(q) || a.effect.toLowerCase().includes(q) || a.method.toLowerCase().includes(q)
  );

  const filteredThreats = THREAT_STAT_BLOCKS.filter(t =>
    t.name.toLowerCase().includes(q) || t.tactics.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
  );

  const activeClanData = CLANS_DATA.find(c => c.name === selectedClan) || CLANS_DATA[0];
  const activeDiscData = DISCIPLINES_DATA.find(d => d.id === selectedDiscipline) || DISCIPLINES_DATA[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#20202d]">
        <div>
          <h1 className="font-cinzel text-2xl font-black text-white tracking-wider flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-rose-500" /> VTM COMPENDIUM & LORE WIKI
          </h1>
          <p className="text-xs text-neutral-400">
            Canonical encyclopedia for Clans, Disciplines, Rituals, Thin-blood Alchemy, Threats, and Rules.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search encyclopedia..."
            className="w-full bg-[#12121a] border border-[#262638] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-600"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-cinzel font-bold">
        {[
          { id: 'clans', label: 'Clans', icon: Shield },
          { id: 'disciplines', label: 'Disciplines', icon: Sparkles },
          { id: 'rituals', label: 'Rituals & Ceremonies', icon: Droplet },
          { id: 'alchemy', label: 'Thin-Blood Alchemy', icon: Flame },
          { id: 'threats', label: 'Antagonist Stat Blocks', icon: Crosshair },
          { id: 'predators', label: 'Predator Types', icon: Skull },
          { id: 'advantages', label: 'Merits & Flaws', icon: Layers },
          { id: 'rules', label: 'Rules Guide', icon: BookOpen },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition ${
                isActive
                  ? 'bg-rose-950 border border-rose-700 text-rose-200 shadow-[0_0_12px_rgba(225,29,72,0.3)]'
                  : 'bg-[#12121a] border border-[#20202c] text-neutral-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab: Clans */}
      {activeTab === 'clans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredClans.map(clan => {
              const isSelected = selectedClan === clan.name;
              return (
                <button
                  key={clan.name}
                  type="button"
                  onClick={() => setSelectedClan(clan.name)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center gap-3 ${
                    isSelected
                      ? 'bg-rose-950/80 border-rose-600 text-white shadow-md'
                      : 'bg-[#0f0f15] border-[#20202d] hover:bg-[#181822] text-neutral-300'
                  }`}
                >
                  <span className="text-2xl shrink-0">{clan.symbol}</span>
                  <div className="min-w-0">
                    <p className="font-cinzel font-bold text-sm text-neutral-100">{clan.name}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{clan.tagline}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="md:col-span-2 bg-[#0b0b10] border border-[#222230] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-4 pb-4 border-b border-[#1c1c28]">
              <span className="text-5xl">{activeClanData.symbol}</span>
              <div>
                <h2 className="font-cinzel text-3xl font-black text-white">{activeClanData.name}</h2>
                <p className="text-xs text-rose-400 font-cinzel font-semibold">{activeClanData.tagline}</p>
                {activeClanData.quote && (
                  <p className="text-xs font-serif italic text-neutral-400 mt-1">"{activeClanData.quote}"</p>
                )}
              </div>
            </div>

            <div className="text-xs text-neutral-300 leading-relaxed space-y-3 font-sans">
              <p>{activeClanData.lore}</p>
            </div>

            <div className="bg-[#12121b] border border-[#20202d] rounded-xl p-4 space-y-2 text-xs">
              <span className="font-cinzel font-bold text-neutral-400 text-xs uppercase block">
                IN-CLAN DISCIPLINES
              </span>
              <div className="flex flex-wrap gap-2">
                {activeClanData.disciplines.map(d => (
                  <span key={d} className="px-3 py-1 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 font-mono font-medium">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#12121b] border border-[#20202d] rounded-xl p-4 space-y-1.5">
                <span className="font-cinzel font-bold text-rose-400 block">CLAN BANE</span>
                <p className="text-neutral-300 leading-relaxed">{activeClanData.bane}</p>
              </div>

              <div className="bg-[#12121b] border border-[#20202d] rounded-xl p-4 space-y-1.5">
                <span className="font-cinzel font-bold text-amber-400 block">
                  COMPULSION: {activeClanData.compulsion.name}
                </span>
                <p className="text-neutral-300 leading-relaxed">{activeClanData.compulsion.description}</p>
              </div>
            </div>

            <div className="pt-2">
              <span className="font-cinzel text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">
                Common Kindred Archetypes
              </span>
              <div className="flex flex-wrap gap-2">
                {activeClanData.archetypes.map(arch => (
                  <span key={arch} className="px-2.5 py-1 rounded-md bg-[#161622] border border-[#272738] text-neutral-300 text-xs">
                    • {arch}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Disciplines */}
      {activeTab === 'disciplines' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredDisciplines.map(disc => {
              const isSelected = selectedDiscipline === disc.id;
              return (
                <button
                  key={disc.id}
                  type="button"
                  onClick={() => setSelectedDiscipline(disc.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-rose-950/80 border-rose-600 text-white shadow-md'
                      : 'bg-[#0f0f15] border-[#20202d] hover:bg-[#181822] text-neutral-300'
                  }`}
                >
                  <div>
                    <p className="font-cinzel font-bold text-sm text-neutral-100">{disc.name}</p>
                    <p className="text-[11px] text-neutral-400 line-clamp-1">{disc.description}</p>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 shrink-0 ml-2">
                    {disc.powers.length} powers
                  </span>
                </button>
              );
            })}
          </div>

          <div className="md:col-span-2 bg-[#0b0b10] border border-[#222230] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="pb-4 border-b border-[#1c1c28]">
              <h2 className="font-cinzel text-2xl font-black text-white">{activeDiscData.name}</h2>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{activeDiscData.description}</p>
              <div className="flex flex-wrap gap-3 mt-3 text-[11px] font-mono">
                <span className="text-rose-400">Resonance: {activeDiscData.bloodResonance}</span>
                <span className="text-neutral-500">• Threat: {activeDiscData.masqueradeThreat}</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="font-cinzel text-xs font-bold text-neutral-400 uppercase tracking-widest block">
                Discipline Powers (Level 1 to 5)
              </span>
              <div className="space-y-2.5">
                {activeDiscData.powers.map(power => (
                  <div
                    key={power.name}
                    className="p-3.5 rounded-xl bg-[#12121b] border border-[#222230] space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-rose-950 border border-rose-800 text-rose-300 font-mono font-bold text-[10px] flex items-center justify-center">
                          L{power.level}
                        </span>
                        <h4 className="font-cinzel font-bold text-sm text-neutral-100">{power.name}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        {power.dicePool && (
                          <span className="text-neutral-400">Pool: {power.dicePool}</span>
                        )}
                        <span className="px-1.5 py-0.5 rounded bg-[#1c1c2a] border border-[#2b2b3e] text-rose-300">
                          {power.rouseCost === 0 ? 'Free' : `Rouse ${power.rouseCost}`}
                        </span>
                      </div>
                    </div>
                    <p className="text-neutral-300 leading-relaxed font-sans">{power.system}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Rituals & Ceremonies */}
      {activeTab === 'rituals' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRituals.map(rit => (
              <div
                key={rit.id}
                className="bg-[#0b0b10] border border-[#20202d] rounded-2xl p-5 space-y-2.5 shadow-xl text-xs"
              >
                <div className="flex items-center justify-between border-b border-[#1c1c28] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800 font-mono font-bold text-[10px] text-rose-300">
                      Level {rit.level}
                    </span>
                    <h3 className="font-cinzel font-bold text-sm text-neutral-100">{rit.name}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                    rit.type === 'ritual' ? 'bg-rose-950/70 border border-rose-700 text-rose-400' : 'bg-purple-950/70 border border-purple-700 text-purple-400'
                  }`}>
                    {rit.type === 'ritual' ? 'Blood Sorcery' : 'Oblivion Ceremony'}
                  </span>
                </div>

                <p className="text-neutral-300 leading-relaxed">{rit.system}</p>

                <div className="pt-2 border-t border-[#181822] space-y-1 text-[11px] font-mono text-neutral-400">
                  <p><strong className="text-neutral-300">Ingredients:</strong> {rit.ingredients}</p>
                  <div className="flex justify-between">
                    <span>Pool: {rit.dicePool}</span>
                    <span>Casting: {rit.castingTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Thin-Blood Alchemy */}
      {activeTab === 'alchemy' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAlchemy.map(alc => (
              <div
                key={alc.id}
                className="bg-[#0b0b10] border border-[#20202d] rounded-2xl p-5 space-y-2.5 shadow-xl text-xs"
              >
                <div className="flex items-center justify-between border-b border-[#1c1c28] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 font-mono font-bold text-[10px] text-amber-300">
                      Formula {alc.level}
                    </span>
                    <h3 className="font-cinzel font-bold text-sm text-neutral-100">{alc.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 bg-[#161622] px-2 py-0.5 rounded border border-[#272738]">
                    {alc.method}
                  </span>
                </div>

                <p className="text-neutral-300 leading-relaxed">{alc.effect}</p>

                <div className="pt-2 border-t border-[#181822] space-y-1 text-[11px] font-mono text-neutral-400">
                  <p><strong className="text-neutral-300">Required Resonance:</strong> {alc.resonanceRequired}</p>
                  <div className="flex justify-between">
                    <span>Ingredients: {alc.ingredients}</span>
                    <span>Distillation: {alc.distillationPool}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Antagonist & Threat Stat Blocks */}
      {activeTab === 'threats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredThreats.map(threat => {
              const threatColors: Record<string, string> = {
                Low: 'border-emerald-700 text-emerald-300 bg-emerald-950/60',
                Medium: 'border-blue-700 text-blue-300 bg-blue-950/60',
                High: 'border-amber-700 text-amber-300 bg-amber-950/60',
                Lethal: 'border-rose-700 text-rose-300 bg-rose-950/80 font-bold animate-pulse'
              };

              return (
                <div
                  key={threat.id}
                  className="bg-[#0b0b10] border border-[#20202d] rounded-2xl p-5 space-y-3 shadow-xl text-xs"
                >
                  <div className="flex items-center justify-between border-b border-[#1c1c28] pb-2">
                    <div>
                      <h3 className="font-cinzel font-bold text-sm text-white">{threat.name}</h3>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">{threat.category}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-mono ${threatColors[threat.threatLevel]}`}>
                      {threat.threatLevel} Threat
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-neutral-300 font-mono text-[11px]">
                    <div className="bg-[#14141d] p-2 rounded border border-[#20202e]">
                      <span className="text-neutral-500 block text-[9px] font-cinzel">PRIMARY POOL</span>
                      <span>{threat.primaryPool.name}: <strong>{threat.primaryPool.pool} dice</strong></span>
                    </div>
                    <div className="bg-[#14141d] p-2 rounded border border-[#20202e]">
                      <span className="text-neutral-500 block text-[9px] font-cinzel">SECONDARY POOL</span>
                      <span>{threat.secondaryPool.name}: <strong>{threat.secondaryPool.pool} dice</strong></span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-cinzel text-[10px] text-neutral-400 font-bold block">EQUIPMENT & SUPERNATURAL TRAITS</span>
                    <ul className="space-y-0.5 text-neutral-300 text-[11px]">
                      {threat.gearOrPowers.map((g, gi) => (
                        <li key={gi} className="flex items-start gap-1.5">
                          <span className="text-rose-500">•</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-neutral-400 italic text-[11px] pt-1 border-t border-[#181822]">
                    <strong className="text-neutral-300 font-cinzel font-bold">Tactics:</strong> {threat.tactics}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Predator Types */}
      {activeTab === 'predators' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PREDATOR_TYPES_DATA.map(pt => (
            <div
              key={pt.name}
              className="bg-[#0b0b10] border border-[#20202d] rounded-2xl p-5 shadow-xl space-y-3 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-cinzel font-bold text-lg text-white">{pt.name}</h3>
                <p className="text-xs text-rose-400 font-serif italic">{pt.tagline}</p>
                <p className="text-xs text-neutral-300 mt-2 leading-relaxed">{pt.description}</p>
              </div>

              <div className="pt-3 border-t border-[#1c1c28] space-y-1 text-xs">
                <p className="text-neutral-400">
                  <strong className="text-neutral-300">Hunting Pool:</strong> <span className="font-mono text-rose-300">{pt.huntingPool}</span>
                </p>
                <p className="text-neutral-400">
                  <strong className="text-neutral-300">Disciplines:</strong> {pt.disciplines.join(', ')}
                </p>
                <div className="pt-1 text-[11px] text-neutral-500">
                  {pt.meritsFlaws.join(' • ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Advantages & Flaws */}
      {activeTab === 'advantages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ADVANTAGES_DATABASE.map(adv => (
            <div
              key={adv.id}
              className="bg-[#0b0b10] border border-[#20202d] rounded-xl p-4 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className={`font-cinzel font-bold text-sm ${adv.type === 'merit' ? 'text-neutral-100' : 'text-rose-400'}`}>
                  {adv.name}
                </span>
                <span className="font-mono text-neutral-400">{adv.dots} dots • {adv.category}</span>
              </div>
              <p className="text-neutral-300 leading-relaxed">{adv.details}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Rules Guide */}
      {activeTab === 'rules' && (
        <div className="bg-[#0b0b10] border border-[#20202d] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-xs text-neutral-300 leading-relaxed font-sans">
          <div className="border-b border-[#1c1c28] pb-4">
            <h2 className="font-cinzel text-xl font-bold text-white mb-2">
              VTM 5TH EDITION (V5) CORE RULES
            </h2>
            <div className="space-y-3">
              <p>
                <strong>Dice Pools & Successes:</strong> Roll a number of d10s equal to Attribute + Skill. Dice showing 6, 7, 8, 9, or 10 are successes. Meeting or beating the Storyteller’s Difficulty (default 1 to 5) achieves success.
              </p>
              <p>
                <strong>Critical Hits:</strong> Every pair of 10s counts as 4 successes total. If at least one 10 is on a red Hunger die, the roll is a <em>Messy Critical</em>—the Beast takes over to achieve the goal with monstrous violence or indiscretion.
              </p>
              <p>
                <strong>Bestial Failures:</strong> If a test fails completely (zero successes or below difficulty) and at least one red Hunger die shows a '1', the result is a <em>Bestial Failure</em>. The Beast lashes out with a Clan Compulsion or animal fury.
              </p>
              <p>
                <strong>Rouse Checks:</strong> Whenever a vampire powers a supernatural discipline, mends wounds, or surges their blood, they roll 1 d10. On a 1–5, the Rouse Check fails and Hunger increases by 1. On a 6–10, Hunger remains stable.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-cinzel text-xl font-bold text-white mb-2">
              VTM 20TH ANNIVERSARY (V20) CORE RULES
            </h2>
            <div className="space-y-3">
              <p>
                <strong>Difficulty & The Rule of 1s:</strong> Roll a pool of d10s equal to Trait + Ability against a Target Difficulty (default 6). Each die meeting or exceeding the Difficulty is a success. Every '1' rolled cancels out one success.
              </p>
              <p>
                <strong>Botch:</strong> If you score zero net successes and at least one '1' was rolled, you have Botched. Catastrophic failure occurs.
              </p>
              <p>
                <strong>Blood Pool:</strong> Kindred possess a pool of temporary Blood Points (typically 10 to 20 depending on Generation) that can be spent to heal damage, boost physical attributes, or ignite Disciplines.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
