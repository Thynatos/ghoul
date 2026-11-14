import React, { useState } from 'react';
import { 
  Skull, 
  Flame, 
  X, 
  AlertTriangle, 
  Zap, 
  Volume2, 
  HeartCrack, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Character } from '../../types/vtm';
import { DiablerieResult } from '../../types/taboo';
import { tabooEngine } from '../../services/tabooEngine';
import { soundEngine } from '../../services/soundEngine';

interface DiablerieModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  onUpdateCharacter: (char: Character) => void;
  onShowToast?: (title: string, desc?: string, type?: 'info' | 'blood' | 'success' | 'error') => void;
}

export const DiablerieModal: React.FC<DiablerieModalProps> = ({
  isOpen,
  onClose,
  characters,
  onUpdateCharacter,
  onShowToast
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [diableristId, setDiableristId] = useState<string>(characters[0]?.id || '');
  const [victimId, setVictimId] = useState<string>(characters[1]?.id || '');
  
  // Custom Victim Stat Mode (if victim is not in player characters list)
  const [isCustomVictim, setIsCustomVictim] = useState<boolean>(false);
  const [customVictimName, setCustomVictimName] = useState<string>('Elder Cassian');
  const [customVictimClan, setCustomVictimClan] = useState<string>('Tremere');
  const [customVictimGen, setCustomVictimGen] = useState<number>(8);
  const [customVictimStamina, setCustomVictimStamina] = useState<number>(4);
  const [customVictimResolve, setCustomVictimResolve] = useState<number>(4);

  const [isRunningContest, setIsRunningContest] = useState(false);
  const [diablerieResult, setDiablerieResult] = useState<DiablerieResult | null>(null);

  if (!isOpen) return null;

  const diablerist = characters.find(c => c.id === diableristId) || characters[0];
  
  // Construct Victim Character object
  let victim: Character | undefined = characters.find(c => c.id === victimId);
  if (isCustomVictim || !victim) {
    victim = {
      id: 'custom_victim_' + Date.now(),
      name: customVictimName,
      clan: customVictimClan,
      generation: customVictimGen,
      edition: diablerist?.edition || 'v5',
      concept: 'Torpid Elder',
      healthMax: 8,
      healthDamage: Array(8).fill('aggravated'),
      willpowerMax: 8,
      willpowerDamage: Array(8).fill('none'),
      humanity: 4,
      experienceTotal: 50,
      experienceSpent: 40,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      attributes: {
        physical: { strength: 3, dexterity: 3, stamina: customVictimStamina },
        social: { charisma: 3, manipulation: 3, composure: 3 },
        mental: { intelligence: 4, wits: 3, resolve: customVictimResolve }
      },
      skills: {
        physical: { athletics: 2, brawl: 2, craft: 0, drive: 0, firearms: 1, larceny: 0, melee: 2, stealth: 2, survival: 2 },
        social: { animalKen: 1, etiquette: 3, insight: 3, intimidation: 3, leadership: 3, performance: 0, persuasion: 3, streetwise: 1, subterfuge: 3 },
        mental: { academics: 3, awareness: 3, finance: 2, investigation: 3, medicine: 1, occult: 4, politics: 3, science: 1, technology: 1 }
      },
      specialties: {},
      disciplines: [
        { id: 'blood_sorcery', name: 'Blood Sorcery', level: 3, powers: ['Corrosive Vitae', 'Extinguish Vitae', 'Blood of Potency'] },
        { id: 'auspex', name: 'Auspex', level: 2, powers: ['Heightened Senses', 'Sense the Unseen'] },
        { id: 'dominate', name: 'Dominate', level: 2, powers: ['Compel', 'Mesmerize'] }
      ],
      advantages: []
    };
  }

  const handleStartDiablerie = () => {
    if (!diablerist || !victim) return;
    setIsRunningContest(true);
    soundEngine.playHeartbeat();

    setTimeout(() => {
      soundEngine.playDiablerieGasp();
      const res = tabooEngine.resolveDiablerie(diablerist, victim);
      setDiablerieResult(res);
      setIsRunningContest(false);
      setStep(3); // Result step
    }, 1200);
  };

  const handleCommitDiablerie = () => {
    if (!diablerieResult || !diablerist) return;

    // Apply generation drop, humanity loss, and stains to Diablerist
    const updatedHumanity = Math.max(0, (diablerist.humanity || 7) - diablerieResult.humanityLoss);
    const updatedStains = Math.min(10, (diablerist.stains || 0) + diablerieResult.stainsGained);
    const updatedGen = diablerieResult.generationLowered ? diablerieResult.diableristNewGeneration : diablerist.generation;
    
    // Add Black Veins to advantages / notes
    const blackVeinsNote = `[DARK TABOO: DIABLERIE] Devoured the soul of ${diablerieResult.victimName} (${diablerieResult.victimGeneration}th Gen). Black veins pulse in aura for ${diablerieResult.blackVeinsDurationMonths} months.`;
    const updatedNotes = diablerist.notes ? `${diablerist.notes}\n\n${blackVeinsNote}` : blackVeinsNote;

    const updatedChar: Character = {
      ...diablerist,
      generation: updatedGen,
      humanity: updatedHumanity,
      stains: updatedStains,
      experienceTotal: diablerist.experienceTotal + diablerieResult.stealsExpAmount,
      notes: updatedNotes
    };

    onUpdateCharacter(updatedChar);
    soundEngine.playBestialFail();
    if (onShowToast) {
      onShowToast(
        'The Amaranth Committed',
        `${diablerist.name} consumed ${diablerieResult.victimName}. Humanity dropped to ${updatedHumanity}.`,
        'blood'
      );
    }
    setStep(4); // Summary completion step
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0b0709] border border-rose-900/60 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-[0_0_50px_rgba(225,29,72,0.3)] relative overflow-hidden text-neutral-200">
        
        {/* Sinister glow background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-rose-600/15 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-950 to-black border border-rose-700 flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.4)]">
              <Skull className="w-6 h-6 text-rose-300" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl font-black text-rose-100 tracking-widest">
                THE AMARANTH // DIABLERIE ENGINE
              </h2>
              <p className="text-[11px] font-mono text-rose-400">
                The Consumption of the Immortal Soul
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#140b0e] hover:bg-[#201015] border border-rose-900/50 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1 & 2: SELECTION & THE CONTEST PREPARATION */}
        {step === 1 && (
          <div className="mt-6 space-y-5 text-xs font-sans">
            <div className="p-3.5 bg-rose-950/30 border border-rose-900/60 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-rose-200 leading-relaxed">
                Diablerie is the ultimate crime among Kindred. Devouring another vampire’s heartblood and soul grants potential generation drops and stolen knowledge, but permanently stains the aura with pitch-black veins and risks total surrender to the Beast.
              </p>
            </div>

            {/* Predator Selection */}
            <div>
              <label className="text-[11px] font-mono text-neutral-400 block mb-1">
                1. SELECT DIABLERIST (THE PREDATOR)
              </label>
              <select
                value={diableristId}
                onChange={e => setDiableristId(e.target.value)}
                className="w-full bg-[#12090d] border border-rose-900/50 rounded-lg px-3 py-2 text-white font-cinzel font-semibold focus:outline-none focus:border-rose-500"
              >
                {characters.map(char => (
                  <option key={char.id} value={char.id}>
                    {char.name} ({char.clan} • {char.generation}th Gen • Humanity {char.humanity})
                  </option>
                ))}
              </select>
              {diablerist && (
                <p className="text-[10px] font-mono text-neutral-400 mt-1">
                  Contest Pool: Strength ({diablerist.attributes.physical.strength}) + Resolve ({diablerist.attributes.mental.resolve}) = {diablerist.attributes.physical.strength + diablerist.attributes.mental.resolve} dice
                </p>
              )}
            </div>

            {/* Victim Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono text-neutral-400">
                  2. SELECT VICTIM (PREY IN TORPOR)
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomVictim(!isCustomVictim)}
                  className="text-[10px] text-rose-400 hover:text-rose-300 font-mono underline"
                >
                  {isCustomVictim ? 'Choose Existing PC' : 'Create Custom Elder Victim'}
                </button>
              </div>

              {!isCustomVictim ? (
                <select
                  value={victimId}
                  onChange={e => setVictimId(e.target.value)}
                  className="w-full bg-[#12090d] border border-rose-900/50 rounded-lg px-3 py-2 text-white font-cinzel font-semibold focus:outline-none"
                >
                  {characters.filter(c => c.id !== diableristId).map(char => (
                    <option key={char.id} value={char.id}>
                      {char.name} ({char.clan} • {char.generation}th Gen • Humanity {char.humanity})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 bg-[#130a0e] border border-rose-950 rounded-lg">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[9px] font-mono text-neutral-400 block mb-0.5">Victim Name</label>
                    <input
                      type="text"
                      value={customVictimName}
                      onChange={e => setCustomVictimName(e.target.value)}
                      className="w-full bg-[#0d0608] border border-rose-900/50 rounded px-2 py-1 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400 block mb-0.5">Clan</label>
                    <input
                      type="text"
                      value={customVictimClan}
                      onChange={e => setCustomVictimClan(e.target.value)}
                      className="w-full bg-[#0d0608] border border-rose-900/50 rounded px-2 py-1 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400 block mb-0.5">Generation ({customVictimGen}th)</label>
                    <input
                      type="number"
                      min={4}
                      max={15}
                      value={customVictimGen}
                      onChange={e => setCustomVictimGen(parseInt(e.target.value) || 8)}
                      className="w-full bg-[#0d0608] border border-rose-900/50 rounded px-2 py-1 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400 block mb-0.5">Stamina ({customVictimStamina})</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={customVictimStamina}
                      onChange={e => setCustomVictimStamina(parseInt(e.target.value) || 4)}
                      className="w-full bg-[#0d0608] border border-rose-900/50 rounded px-2 py-1 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-400 block mb-0.5">Resolve ({customVictimResolve})</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={customVictimResolve}
                      onChange={e => setCustomVictimResolve(parseInt(e.target.value) || 4)}
                      className="w-full bg-[#0d0608] border border-rose-900/50 rounded px-2 py-1 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {victim && (
                <p className="text-[10px] font-mono text-neutral-400 mt-1">
                  Victim Soul Resistance Pool: Stamina ({victim.attributes.physical.stamina}) + Resolve ({victim.attributes.mental.resolve}) = {victim.attributes.physical.stamina + victim.attributes.mental.resolve} dice
                </p>
              )}
            </div>

            {/* Comparison banner */}
            {diablerist && victim && (
              <div className="p-3 bg-[#150a0f] border border-rose-900/60 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">Generation Difference</span>
                  <p className="font-cinzel text-sm font-bold text-white">
                    {diablerist.generation}th Gen vs {victim.generation}th Gen
                  </p>
                </div>
                <div>
                  {victim.generation < diablerist.generation ? (
                    <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono text-xs font-bold">
                      Potential Drop: to {victim.generation}th Gen
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-400 font-mono text-xs">
                      No Generation Drop (Equal/Higher)
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleStartDiablerie}
                disabled={isRunningContest || !diablerist || !victim}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-800 via-rose-900 to-red-950 hover:from-red-700 hover:to-rose-800 text-white font-cinzel font-bold text-sm tracking-widest shadow-[0_0_20px_rgba(225,29,72,0.5)] transition flex items-center justify-center gap-2"
              >
                {isRunningContest ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-rose-300" />
                    CONTESTING WILL OF THE SOUL...
                  </>
                ) : (
                  <>
                    <HeartCrack className="w-4 h-4 text-rose-300" />
                    COMMENCE THE CONTEST OF WILL
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RESULT & LOG BREAKDOWN */}
        {step === 3 && diablerieResult && (
          <div className="mt-6 space-y-5 text-xs font-sans animate-fade-in">
            {diablerieResult.success ? (
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/80 rounded-xl text-emerald-200">
                <div className="flex items-center gap-2 font-cinzel font-bold text-sm text-white mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  THE SOUL HAS BEEN DEVOURED
                </div>
                <p className="leading-relaxed">
                  {diablerieResult.diableristName} successfully overpowered {diablerieResult.victimName}’s soul in the contest of will (Margin: +{diablerieResult.margin}).
                </p>
              </div>
            ) : (
              <div className="p-4 bg-red-950/40 border border-red-800 rounded-xl text-red-200">
                <div className="flex items-center gap-2 font-cinzel font-bold text-sm text-white mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  THE SOUL RESISTED DEVOURMENT
                </div>
                <p className="leading-relaxed">
                  The victim’s will broke the predator’s hold. The soul fled into the abyss.
                </p>
              </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#140a0e] border border-rose-950 p-3 rounded-lg text-center">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Generation</span>
                <span className="font-cinzel text-base font-bold text-white">
                  {diablerieResult.diableristOldGeneration}th → {diablerieResult.diableristNewGeneration}th
                </span>
              </div>
              <div className="bg-[#140a0e] border border-rose-950 p-3 rounded-lg text-center">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Humanity Cost</span>
                <span className="font-cinzel text-base font-bold text-rose-400">
                  -{diablerieResult.humanityLoss} Dot
                </span>
              </div>
              <div className="bg-[#140a0e] border border-rose-950 p-3 rounded-lg text-center">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Stains Accrued</span>
                <span className="font-cinzel text-base font-bold text-amber-400">
                  +{diablerieResult.stainsGained} Stains
                </span>
              </div>
              <div className="bg-[#140a0e] border border-rose-950 p-3 rounded-lg text-center">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Aura Veins</span>
                <span className="font-cinzel text-base font-bold text-purple-400">
                  {diablerieResult.blackVeinsDurationMonths} Months
                </span>
              </div>
            </div>

            {/* Harvested Disciplines */}
            {diablerieResult.absorbedDisciplinePowers.length > 0 && (
              <div className="p-3 bg-[#130b10] border border-rose-900/40 rounded-xl">
                <div className="flex items-center gap-1.5 font-cinzel text-xs font-bold text-neutral-200 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  DISCIPLINES HARVESTED FROM PSYCHIC MEMORY:
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {diablerieResult.absorbedDisciplinePowers.map((p, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-200 font-mono text-[11px]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contest Audit Log */}
            <div className="bg-[#0e070a] border border-[#231218] rounded-xl p-3 max-h-36 overflow-y-auto font-mono text-[11px] space-y-1.5 custom-scrollbar">
              {diablerieResult.log.map((line, idx) => (
                <p key={idx} className="text-neutral-300">
                  {line}
                </p>
              ))}
            </div>

            {/* Confirmation Controls */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg bg-[#180d12] hover:bg-[#25151c] text-neutral-400 hover:text-white"
              >
                Cancel & Re-roll
              </button>
              <button
                type="button"
                onClick={handleCommitDiablerie}
                className="px-5 py-2 rounded-lg bg-red-900 hover:bg-red-800 text-white font-cinzel font-bold tracking-wider shadow-[0_0_15px_rgba(225,29,72,0.4)]"
              >
                CONFIRM & PERMANENTLY UPDATE CHARACTER
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: COMMITTED & COMPLETED */}
        {step === 4 && (
          <div className="mt-6 text-center space-y-4 py-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-red-950/80 border-2 border-red-600 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(225,29,72,0.6)]">
              <Eye className="w-8 h-8 text-red-200" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-white tracking-widest">
              THE TABOO IS COMPLETE
            </h3>
            <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
              The soul has dissolved into your vitae. Your generation has been updated on your character dossier, along with the black veins mark in your aura. Walk carefully in Elysium.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 font-cinzel font-bold text-xs tracking-wider"
              >
                Close Engine
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
