import React, { useState } from 'react';
import { Character, GameEdition, DisciplineAllocation } from '../../types/vtm';
import { CLANS_DATA } from '../../data/clans';
import { PREDATOR_TYPES_DATA } from '../../data/predatorTypes';
import { DISCIPLINES_DATA } from '../../data/disciplines';
import { ADVANTAGES_DATABASE } from '../../data/advantages';
import { PipCounter } from '../common/PipCounter';
import { ArrowLeft, ArrowRight, Check, Sparkles, User, Shield, Flame, BookOpen } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface CharacterBuilderProps {
  edition: GameEdition;
  onSaveCharacter: (char: Character) => void;
  onCancel: () => void;
}

const STEPS = [
  'Concept',
  'Clan',
  'Predator',
  'Attributes',
  'Skills',
  'Disciplines',
  'Advantages & Touchstones',
  'Review'
];

export const CharacterBuilder: React.FC<CharacterBuilderProps> = ({
  edition,
  onSaveCharacter,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Form State
  const [name, setName] = useState('');
  const [concept, setConcept] = useState('');
  const [selectedClan, setSelectedClan] = useState('Brujah');
  const [generation, setGeneration] = useState(12);
  const [sire, setSire] = useState('');
  const [selectedPredator, setSelectedPredator] = useState('Alleycat');
  const [ambition, setAmbition] = useState('');
  const [desire, setDesire] = useState('');
  const [touchstoneName, setTouchstoneName] = useState('');
  const [convictionText, setConvictionText] = useState('');

  // Attributes
  const [attributes, setAttributes] = useState({
    physical: { strength: 1, dexterity: 1, stamina: 1 },
    social: { charisma: 1, manipulation: 1, composure: 1 },
    mental: { intelligence: 1, wits: 1, resolve: 1 }
  });

  // Skills
  const [skills, setSkills] = useState({
    physical: { athletics: 0, brawl: 0, craft: 0, drive: 0, firearms: 0, larceny: 0, melee: 0, stealth: 0, survival: 0 },
    social: { animalKen: 0, etiquette: 0, insight: 0, intimidation: 0, leadership: 0, performance: 0, persuasion: 0, streetwise: 0, subterfuge: 0 },
    mental: { academics: 0, awareness: 0, finance: 0, investigation: 0, medicine: 0, occult: 0, politics: 0, science: 0, technology: 0 }
  });

  // Disciplines
  const [chosenDisciplines, setChosenDisciplines] = useState<DisciplineAllocation[]>([
    { id: 'celerity', name: 'Celerity', level: 2, powers: ['Rapid Reflexes', 'Cat\'s Grace'] },
    { id: 'potence', name: 'Potence', level: 1, powers: ['Lethal Body'] }
  ]);

  // Advantages
  const [selectedAdvantages, setSelectedAdvantages] = useState<string[]>(['allies_1', 'haven_1']);

  const clanInfo = CLANS_DATA.find(c => c.name === selectedClan) || CLANS_DATA[0];

  const handleNext = () => {
    soundEngine.playDiceRoll();
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    const stamina = attributes.physical.stamina;
    const composure = attributes.social.composure;
    const resolve = attributes.mental.resolve;

    const healthMax = stamina + 3;
    const willpowerMax = composure + resolve;

    const advantagesList = ADVANTAGES_DATABASE.filter(a => selectedAdvantages.includes(a.id));

    const newChar: Character = {
      id: 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      edition,
      name: name.trim() || 'Unnamed Kindred',
      concept: concept.trim() || 'Neonatal Wanderer',
      clan: selectedClan,
      generation,
      predatorType: edition === 'v5' ? selectedPredator : undefined,
      sire: sire.trim() || undefined,
      healthMax,
      healthDamage: new Array(healthMax).fill('none'),
      willpowerMax,
      willpowerDamage: new Array(willpowerMax).fill('none'),
      hunger: 1,
      humanity: 7,
      stains: 0,
      bloodPotency: generation <= 9 ? 2 : 1,
      ambition: ambition.trim() || undefined,
      desire: desire.trim() || undefined,
      touchstones: touchstoneName ? [
        { id: 't_init', touchstone: touchstoneName, conviction: convictionText || 'Never break an oath of blood.' }
      ] : [],
      attributes,
      skills,
      specialties: {},
      disciplines: chosenDisciplines,
      advantages: advantagesList,
      biography: `Forged in the shadows of the city as a ${selectedClan}. Concept: ${concept}.`,
      experienceTotal: 0,
      experienceSpent: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    soundEngine.playCritical();
    onSaveCharacter(newChar);
  };

  // Helper calculations
  const totalAttrDots = Object.values(attributes).reduce((acc, cat) => 
    acc + Object.values(cat).reduce((a, b) => a + b, 0), 0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Stepper Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#20202c]">
          <div>
            <h1 className="font-cinzel text-xl sm:text-2xl font-black text-white tracking-wider">
              KINDRED CHARACTER CREATOR
            </h1>
            <p className="text-xs text-neutral-400">
              Guided creation for {edition.toUpperCase()} rule set • Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs px-3 py-1.5 rounded bg-[#181824] hover:bg-[#252535] text-neutral-400 hover:text-white transition"
          >
            Cancel
          </button>
        </div>

        {/* Stepper indicator pills */}
        <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-2">
          {STEPS.map((s, idx) => (
            <button
              key={s}
              type="button"
              onClick={() => setCurrentStep(idx)}
              className={`px-3 py-1 rounded-full text-xs font-cinzel font-semibold whitespace-nowrap transition ${
                currentStep === idx
                  ? 'bg-rose-900 border border-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.4)]'
                  : currentStep > idx
                  ? 'bg-[#181822] text-rose-400 border border-[#2b2b3b]'
                  : 'bg-[#101016] text-neutral-600 border border-transparent'
              }`}
            >
              {idx + 1}. {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Step Body */}
      <div className="bg-[#0b0b10] border border-[#20202e] rounded-2xl p-6 sm:p-8 shadow-xl min-h-[420px] flex flex-col justify-between">
        
        {/* Step 0: Concept */}
        {currentStep === 0 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-cinzel text-lg font-bold text-neutral-100">
              Step 1: Concept & Lineage
            </h2>
            <p className="text-xs text-neutral-400">
              Who were you before the Embrace? What drove you, and who ripped the breath from your mortal chest?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div>
                <label className="block text-xs font-cinzel font-semibold text-neutral-300 mb-1">
                  Character Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Gabriel Vance"
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel font-semibold text-neutral-300 mb-1">
                  Core Concept *
                </label>
                <input
                  type="text"
                  value={concept}
                  onChange={e => setConcept(e.target.value)}
                  placeholder="e.g. Disgraced investigative journalist"
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel font-semibold text-neutral-300 mb-1">
                  Generation
                </label>
                <select
                  value={generation}
                  onChange={e => setGeneration(parseInt(e.target.value))}
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-600"
                >
                  <option value={13}>13th Generation (Neonate)</option>
                  <option value={12}>12th Generation (Neonate)</option>
                  <option value={11}>11th Generation (Neonate)</option>
                  <option value={10}>10th Generation (Ancilla)</option>
                  <option value={9}>9th Generation (Ancilla)</option>
                  <option value={8}>8th Generation (Elder)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-cinzel font-semibold text-neutral-300 mb-1">
                  Sire Name
                </label>
                <input
                  type="text"
                  value={sire}
                  onChange={e => setSire(e.target.value)}
                  placeholder="e.g. Baron Thomas"
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-cinzel font-semibold text-neutral-300 mb-1">
                  Ambition (Long-term Goal)
                </label>
                <input
                  type="text"
                  value={ambition}
                  onChange={e => setAmbition(e.target.value)}
                  placeholder="e.g. Become the undisputed Baron of the East End"
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-cinzel font-semibold text-neutral-300 mb-1">
                  Desire (Nightly Goal)
                </label>
                <input
                  type="text"
                  value={desire}
                  onChange={e => setDesire(e.target.value)}
                  placeholder="e.g. Find where the Sheriff's hound sleeps"
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Clan */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-cinzel text-lg font-bold text-neutral-100">
              Step 2: Choose Your Bloodline
            </h2>
            <p className="text-xs text-neutral-400">
              The blood determines your supernatural disciplines, your clan curse, and the nature of your Beast.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[320px] overflow-y-auto pr-1 pt-2">
              {CLANS_DATA.map(clan => {
                const isSelected = selectedClan === clan.name;
                return (
                  <button
                    key={clan.name}
                    type="button"
                    onClick={() => {
                      setSelectedClan(clan.name);
                      // Update default disciplines
                      const discNames = clan.disciplines.slice(0, 2);
                      setChosenDisciplines(discNames.map((d, i) => ({
                        id: d.toLowerCase().replace(/\s+/g, '_'),
                        name: d,
                        level: i === 0 ? 2 : 1,
                        powers: []
                      })));
                    }}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-rose-950/80 border-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                        : 'bg-[#12121a] border-[#222230] hover:border-[#38384d]'
                    }`}
                  >
                    <div className="text-2xl mb-1">{clan.symbol}</div>
                    <p className="font-cinzel font-bold text-sm text-neutral-100">{clan.name}</p>
                    <p className="text-[10px] text-neutral-400 line-clamp-2 mt-1">{clan.tagline}</p>
                  </button>
                );
              })}
            </div>

            {/* Clan details spotlight */}
            <div className="bg-[#12121a] border border-[#242435] rounded-xl p-4 mt-3 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-cinzel font-bold text-rose-400 text-sm">{clanInfo.name}</span>
                <span className="text-neutral-500 font-mono">Disciplines: {clanInfo.disciplines.join(', ')}</span>
              </div>
              <p className="text-neutral-300 italic">{clanInfo.lore}</p>
              <div className="pt-1.5 border-t border-[#1c1c28] text-[11px]">
                <strong className="text-rose-400">Bane: </strong>
                <span className="text-neutral-400">{clanInfo.bane}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Predator Type (V5) */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-cinzel text-lg font-bold text-neutral-100">
              Step 3: Predator Type
            </h2>
            <p className="text-xs text-neutral-400">
              How do you hunt in the night? Each feeding technique confers discipline dots, specialties, and advantages.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1 pt-2">
              {PREDATOR_TYPES_DATA.map(pt => {
                const isSelected = selectedPredator === pt.name;
                return (
                  <button
                    key={pt.name}
                    type="button"
                    onClick={() => setSelectedPredator(pt.name)}
                    className={`p-3 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-rose-950/80 border-rose-600 shadow-[0_0_12px_rgba(225,29,72,0.4)]'
                        : 'bg-[#12121a] border-[#222230] hover:border-[#38384d]'
                    }`}
                  >
                    <p className="font-cinzel font-bold text-sm text-neutral-100">{pt.name}</p>
                    <p className="text-[11px] text-neutral-400 mt-1">{pt.tagline}</p>
                    <div className="mt-2 text-[10px] font-mono text-rose-400">
                      Hunting: {pt.huntingPool}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Attributes */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-cinzel text-lg font-bold text-neutral-100">
                  Step 4: Attributes
                </h2>
                <p className="text-xs text-neutral-400">
                  Distribute attribute dots (Base 1 in each attribute). V5 standard array: one at 4, three at 3, four at 2, one at 1.
                </p>
              </div>
              <span className="font-mono text-xs text-rose-400 bg-rose-950 px-2 py-1 rounded border border-rose-800">
                Total Dots: {totalAttrDots}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Physical */}
              <div className="bg-[#12121a] border border-[#222230] rounded-xl p-3.5 space-y-3">
                <span className="font-cinzel text-xs font-bold text-neutral-300 uppercase block border-b border-[#1c1c28] pb-1">
                  Physical
                </span>
                {(['strength', 'dexterity', 'stamina'] as const).map(attr => (
                  <div key={attr} className="flex items-center justify-between text-xs capitalize">
                    <span className="text-neutral-300 font-medium">{attr}</span>
                    <PipCounter
                      value={attributes.physical[attr]}
                      max={5}
                      min={1}
                      onChange={v => setAttributes(prev => ({
                        ...prev,
                        physical: { ...prev.physical, [attr]: v }
                      }))}
                    />
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="bg-[#12121a] border border-[#222230] rounded-xl p-3.5 space-y-3">
                <span className="font-cinzel text-xs font-bold text-neutral-300 uppercase block border-b border-[#1c1c28] pb-1">
                  Social
                </span>
                {(['charisma', 'manipulation', 'composure'] as const).map(attr => (
                  <div key={attr} className="flex items-center justify-between text-xs capitalize">
                    <span className="text-neutral-300 font-medium">{attr}</span>
                    <PipCounter
                      value={attributes.social[attr]}
                      max={5}
                      min={1}
                      onChange={v => setAttributes(prev => ({
                        ...prev,
                        social: { ...prev.social, [attr]: v }
                      }))}
                    />
                  </div>
                ))}
              </div>

              {/* Mental */}
              <div className="bg-[#12121a] border border-[#222230] rounded-xl p-3.5 space-y-3">
                <span className="font-cinzel text-xs font-bold text-neutral-300 uppercase block border-b border-[#1c1c28] pb-1">
                  Mental
                </span>
                {(['intelligence', 'wits', 'resolve'] as const).map(attr => (
                  <div key={attr} className="flex items-center justify-between text-xs capitalize">
                    <span className="text-neutral-300 font-medium">{attr}</span>
                    <PipCounter
                      value={attributes.mental[attr]}
                      max={5}
                      min={1}
                      onChange={v => setAttributes(prev => ({
                        ...prev,
                        mental: { ...prev.mental, [attr]: v }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Skills */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-cinzel text-lg font-bold text-neutral-100">
              Step 5: Skills & Talents
            </h2>
            <p className="text-xs text-neutral-400">
              Assign dots to your physical, social, and mental skills (0 to 5 dots).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-h-[320px] overflow-y-auto pr-1 pt-2">
              {/* Physical */}
              <div className="bg-[#12121a] border border-[#222230] rounded-xl p-3 space-y-2">
                <span className="font-cinzel text-xs font-bold text-neutral-300 uppercase block border-b border-[#1c1c28] pb-1">
                  Physical
                </span>
                {Object.entries(skills.physical).map(([sk, val]) => (
                  <div key={sk} className="flex items-center justify-between text-xs capitalize">
                    <span className="text-neutral-300">{sk}</span>
                    <PipCounter
                      value={val}
                      max={5}
                      size="sm"
                      onChange={v => setSkills(prev => ({
                        ...prev,
                        physical: { ...prev.physical, [sk]: v }
                      }))}
                    />
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="bg-[#12121a] border border-[#222230] rounded-xl p-3 space-y-2">
                <span className="font-cinzel text-xs font-bold text-neutral-300 uppercase block border-b border-[#1c1c28] pb-1">
                  Social
                </span>
                {Object.entries(skills.social).map(([sk, val]) => (
                  <div key={sk} className="flex items-center justify-between text-xs capitalize">
                    <span className="text-neutral-300">{sk}</span>
                    <PipCounter
                      value={val}
                      max={5}
                      size="sm"
                      onChange={v => setSkills(prev => ({
                        ...prev,
                        social: { ...prev.social, [sk]: v }
                      }))}
                    />
                  </div>
                ))}
              </div>

              {/* Mental */}
              <div className="bg-[#12121a] border border-[#222230] rounded-xl p-3 space-y-2">
                <span className="font-cinzel text-xs font-bold text-neutral-300 uppercase block border-b border-[#1c1c28] pb-1">
                  Mental
                </span>
                {Object.entries(skills.mental).map(([sk, val]) => (
                  <div key={sk} className="flex items-center justify-between text-xs capitalize">
                    <span className="text-neutral-300">{sk}</span>
                    <PipCounter
                      value={val}
                      max={5}
                      size="sm"
                      onChange={v => setSkills(prev => ({
                        ...prev,
                        mental: { ...prev.mental, [sk]: v }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Disciplines */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-cinzel text-lg font-bold text-neutral-100">
              Step 6: Disciplines & Starting Powers
            </h2>
            <p className="text-xs text-neutral-400">
              Starting characters allocate 2 dots in one clan discipline and 1 dot in another.
            </p>

            <div className="space-y-3 pt-2">
              {chosenDisciplines.map((disc, idx) => {
                const discDef = DISCIPLINES_DATA.find(d => d.name.toLowerCase() === disc.name.toLowerCase());
                return (
                  <div key={disc.id} className="bg-[#12121a] border border-[#222230] rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-cinzel font-bold text-rose-300 text-sm">{disc.name}</span>
                      <PipCounter
                        value={disc.level}
                        max={5}
                        onChange={v => {
                          const next = [...chosenDisciplines];
                          next[idx].level = v;
                          setChosenDisciplines(next);
                        }}
                      />
                    </div>
                    {discDef && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1c1c28]">
                        {discDef.powers.filter(p => p.level <= disc.level).map(power => {
                          const hasPower = disc.powers.includes(power.name);
                          return (
                            <button
                              key={power.name}
                              type="button"
                              onClick={() => {
                                const next = [...chosenDisciplines];
                                if (hasPower) {
                                  next[idx].powers = next[idx].powers.filter(p => p !== power.name);
                                } else {
                                  next[idx].powers.push(power.name);
                                }
                                setChosenDisciplines(next);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                                hasPower
                                  ? 'bg-rose-950 border-rose-600 text-rose-200'
                                  : 'bg-[#161622] border-[#292938] text-neutral-400 hover:text-white'
                              }`}
                            >
                              Level {power.level}: {power.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6: Advantages & Touchstones */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-cinzel text-lg font-bold text-neutral-100">
              Step 7: Advantages & Touchstones
            </h2>
            <p className="text-xs text-neutral-400">
              Define your mortal ties and your assets (Havens, Allies, Resources).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#12121a] border border-[#222230] rounded-xl p-4 space-y-3">
                <span className="font-cinzel text-xs font-bold text-neutral-300 uppercase block border-b border-[#1c1c28] pb-1">
                  Mortal Touchstone & Conviction
                </span>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Touchstone Name</label>
                  <input
                    type="text"
                    value={touchstoneName}
                    onChange={e => setTouchstoneName(e.target.value)}
                    placeholder="e.g. Dr. Maya Patel (Beloved sister)"
                    className="w-full bg-[#161622] border border-[#272738] rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Human Conviction</label>
                  <input
                    type="text"
                    value={convictionText}
                    onChange={e => setConvictionText(e.target.value)}
                    placeholder="e.g. Never shed the blood of family"
                    className="w-full bg-[#161622] border border-[#272738] rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="bg-[#12121a] border border-[#222230] rounded-xl p-4 space-y-2">
                <span className="font-cinzel text-xs font-bold text-neutral-300 uppercase block border-b border-[#1c1c28] pb-1">
                  Select Advantages & Flaws
                </span>
                <div className="max-h-[180px] overflow-y-auto space-y-1.5 pr-1">
                  {ADVANTAGES_DATABASE.slice(0, 8).map(adv => {
                    const isSelected = selectedAdvantages.includes(adv.id);
                    return (
                      <button
                        key={adv.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedAdvantages(selectedAdvantages.filter(id => id !== adv.id));
                          } else {
                            setSelectedAdvantages([...selectedAdvantages, adv.id]);
                          }
                        }}
                        className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-rose-950/70 border-rose-700 text-rose-200'
                            : 'bg-[#161622] border-[#292938] text-neutral-400'
                        }`}
                      >
                        <span>{adv.name} ({adv.dots} dots)</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Review & Save */}
        {currentStep === 7 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-cinzel text-lg font-bold text-neutral-100">
              Final Review: Ready to Embrace the Night
            </h2>
            <div className="bg-[#12121a] border border-[#262638] rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#1f1f2d]">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-white">{name || 'Unnamed'}</h3>
                  <p className="text-neutral-400 italic">"{concept || 'Vampire'}"</p>
                </div>
                <div className="text-right">
                  <span className="text-rose-400 font-cinzel font-bold text-sm block">Clan {selectedClan}</span>
                  <span className="text-neutral-500 font-mono text-[11px]">{generation}th Gen • {selectedPredator}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-neutral-300">
                <div>
                  <p className="font-cinzel text-[10px] text-neutral-500">ATTRIBUTES SUMMARY</p>
                  <p>Str {attributes.physical.strength}, Dex {attributes.physical.dexterity}, Sta {attributes.physical.stamina}</p>
                  <p>Cha {attributes.social.charisma}, Man {attributes.social.manipulation}, Com {attributes.social.composure}</p>
                  <p>Int {attributes.mental.intelligence}, Wit {attributes.mental.wits}, Res {attributes.mental.resolve}</p>
                </div>
                <div>
                  <p className="font-cinzel text-[10px] text-neutral-500">HEALTH & WILLPOWER</p>
                  <p>Health: {attributes.physical.stamina + 3} boxes</p>
                  <p>Willpower: {attributes.social.composure + attributes.mental.resolve} boxes</p>
                  <p>Humanity: 7</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Navigation Footer */}
        <div className="pt-6 border-t border-[#1c1c28] flex items-center justify-between mt-6">
          <button
            type="button"
            disabled={currentStep === 0}
            onClick={handleBack}
            className="px-4 py-2 rounded-lg bg-[#14141e] hover:bg-[#1f1f2c] border border-[#272738] text-xs font-semibold text-neutral-300 disabled:opacity-30 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 rounded-lg bg-rose-900 hover:bg-rose-800 text-white font-cinzel font-bold text-xs tracking-wider transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(225,29,72,0.3)]"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-rose-800 to-rose-700 hover:from-rose-700 hover:to-rose-600 text-white font-cinzel font-black text-xs tracking-widest transition flex items-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.5)]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> SPAWN CHARACTER SHEET
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
