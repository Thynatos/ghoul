import React, { useState } from 'react';
import { 
  Heart, 
  Link2, 
  X, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Moon, 
  Flame, 
  Clock, 
  AlertTriangle, 
  Sparkles,
  Droplet,
  User,
  Zap,
  HelpCircle
} from 'lucide-react';
import { Character } from '../../types/vtm';
import { BloodBondRelation, FrenzyCheckResult, FrenzyScenario } from '../../types/taboo';
import { storageService } from '../../services/storage';
import { tabooEngine, BLOOD_BOND_STAGES, FRENZY_SCENARIOS } from '../../services/tabooEngine';
import { soundEngine } from '../../services/soundEngine';

interface BloodBondMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  onShowToast?: (title: string, desc?: string, type?: 'info' | 'blood' | 'success' | 'error') => void;
}

export const BloodBondMatrixModal: React.FC<BloodBondMatrixModalProps> = ({
  isOpen,
  onClose,
  characters,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'bonds' | 'torpor' | 'frenzy'>('bonds');
  
  // Blood Bonds State
  const [bloodBonds, setBloodBonds] = useState<BloodBondRelation[]>(storageService.getBloodBonds());
  const [addBondOpen, setAddBondOpen] = useState(false);
  const [newRegnantName, setNewRegnantName] = useState(characters[0]?.name || 'Helena DuMont');
  const [newThrallName, setNewThrallName] = useState(characters[1]?.name || 'Marcus Vance');
  const [newDrinkCount, setNewDrinkCount] = useState<number>(1);
  const [newBondNotes, setNewBondNotes] = useState('');

  // Torpor Calculator State
  const [torporHumanity, setTorporHumanity] = useState<number>(7);

  // Frenzy Simulator State
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(FRENZY_SCENARIOS[0].id);
  const [frenzyPool, setFrenzyPool] = useState<number>(6); // Resolve + Composure
  const [frenzyActorName, setFrenzyActorName] = useState<string>(characters[0]?.name || 'Marcus Vance');
  const [frenzyResult, setFrenzyResult] = useState<FrenzyCheckResult | null>(null);

  if (!isOpen) return null;

  const saveBonds = (updated: BloodBondRelation[]) => {
    storageService.saveBloodBonds(updated);
    setBloodBonds(storageService.getBloodBonds());
  };

  const handleDrinkVitae = (bondId: string) => {
    const bond = bloodBonds.find(b => b.id === bondId);
    if (!bond) return;

    soundEngine.playHeartbeat();
    const nextDrink = Math.min(3, bond.drinkCount + 1);
    const updatedStage = nextDrink as 1 | 2 | 3;

    const updated = bloodBonds.map(b => {
      if (b.id === bondId) {
        return {
          ...b,
          drinkCount: nextDrink,
          stage: updatedStage,
          lastDrinkDate: new Date().toISOString().split('T')[0]
        };
      }
      return b;
    });

    saveBonds(updated);
    if (onShowToast) {
      onShowToast(
        'Blood Bond Deepened',
        `${bond.thrallName} consumed vitae from ${bond.regnantName} (Now Stage ${updatedStage}).`,
        'blood'
      );
    }
  };

  const handleBreakBond = (bondId: string) => {
    const updated = bloodBonds.filter(b => b.id !== bondId);
    saveBonds(updated);
    if (onShowToast) onShowToast('Bond Severed', 'Relationship record removed.', 'info');
  };

  const handleCreateBond = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegnantName.trim() || !newThrallName.trim()) return;

    const newRecord: BloodBondRelation = {
      id: 'bond_' + Date.now(),
      chronicleId: storageService.getActiveChronicleId() || 'chronicle_chicago_1',
      regnantId: 'char_' + Date.now(),
      regnantName: newRegnantName.trim(),
      thrallId: 'char_thrall_' + Date.now(),
      thrallName: newThrallName.trim(),
      drinkCount: newDrinkCount,
      stage: (newDrinkCount >= 3 ? 3 : newDrinkCount === 2 ? 2 : 1) as 1 | 2 | 3,
      lastDrinkDate: new Date().toISOString().split('T')[0],
      notes: newBondNotes.trim()
    };

    const updated = [newRecord, ...bloodBonds];
    saveBonds(updated);
    setAddBondOpen(false);
    setNewBondNotes('');
    if (onShowToast) onShowToast('Blood Bond Enacted', `${newRecord.thrallName} bound to ${newRecord.regnantName}`, 'blood');
  };

  const handleRunFrenzyCheck = () => {
    const scenario = FRENZY_SCENARIOS.find(s => s.id === selectedScenarioId) || FRENZY_SCENARIOS[0];
    const res = tabooEngine.resolveFrenzyCheck(frenzyActorName, scenario, frenzyPool);
    setFrenzyResult(res);

    if (res.passed) {
      soundEngine.playRouseSuccess();
      if (onShowToast) onShowToast('The Beast Quelled', `${frenzyActorName} maintained control!`, 'success');
    } else {
      soundEngine.playFrenzyRoar();
      if (onShowToast) onShowToast('Frenzy Triggered!', `${frenzyActorName} succumbed to the Beast!`, 'error');
    }
  };

  const torporDetails = tabooEngine.calculateTorporDuration(torporHumanity);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0b080c] border border-rose-900/50 rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#21141c]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.4)]">
              <Link2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">
                DARK TABOOS: BLOOD BONDS & FRENZY MATRIX
              </h2>
              <p className="text-xs text-neutral-400 font-sans">
                Vassalage tracking, Torpor duration calculator, and Beast test engine
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#140b12] hover:bg-[#20101c] border border-[#261521] text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-[#1b1017]">
          <button
            type="button"
            onClick={() => setActiveTab('bonds')}
            className={`
              px-4 py-2 rounded-lg font-cinzel text-xs font-bold tracking-wider flex items-center gap-2 transition
              ${activeTab === 'bonds' 
                ? 'bg-rose-950 border border-rose-700 text-rose-200 shadow-[0_0_12px_rgba(225,29,72,0.3)]' 
                : 'text-neutral-400 hover:text-white bg-[#10080e] border border-transparent'}
            `}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            Blood Bond Matrix ({bloodBonds.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('torpor')}
            className={`
              px-4 py-2 rounded-lg font-cinzel text-xs font-bold tracking-wider flex items-center gap-2 transition
              ${activeTab === 'torpor' 
                ? 'bg-rose-950 border border-rose-700 text-rose-200 shadow-[0_0_12px_rgba(225,29,72,0.3)]' 
                : 'text-neutral-400 hover:text-white bg-[#10080e] border border-transparent'}
            `}
          >
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            Torpor Slumber Duration
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('frenzy')}
            className={`
              px-4 py-2 rounded-lg font-cinzel text-xs font-bold tracking-wider flex items-center gap-2 transition
              ${activeTab === 'frenzy' 
                ? 'bg-rose-950 border border-rose-700 text-rose-200 shadow-[0_0_12px_rgba(225,29,72,0.3)]' 
                : 'text-neutral-400 hover:text-white bg-[#10080e] border border-transparent'}
            `}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            Beast & Frenzy Simulator
          </button>
        </div>

        {/* Tab 1: Blood Bond Matrix */}
        {activeTab === 'bonds' && (
          <div className="flex-1 overflow-y-auto pt-4 space-y-4 custom-scrollbar">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-400 font-sans">
                Each drink of a vampire’s vitae forms an unnatural supernatural chain of infatuation and subservience.
              </p>
              <button
                type="button"
                onClick={() => setAddBondOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#160c14] hover:bg-[#22121e] border border-rose-900/60 text-xs font-cinzel text-rose-300 hover:text-white flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5 text-rose-400" />
                Enact New Bond
              </button>
            </div>

            {bloodBonds.length === 0 ? (
              <div className="p-8 text-center bg-[#0e070c] border border-[#1f101a] rounded-xl text-neutral-500 font-cinzel text-xs">
                No active blood bonds recorded.
              </div>
            ) : (
              <div className="space-y-3">
                {bloodBonds.map(bond => {
                  const stageInfo = BLOOD_BOND_STAGES[bond.stage];
                  return (
                    <div
                      key={bond.id}
                      className="bg-[#0e070c] border border-[#20101c] hover:border-rose-900/60 rounded-xl p-4 transition"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#1b0d17]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-cinzel text-sm font-bold text-white">
                              {bond.regnantName}
                            </span>
                            <span className="text-xs text-rose-400 font-mono">→ Regnant of →</span>
                            <span className="font-cinzel text-sm font-bold text-rose-200">
                              {bond.thrallName}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                            Last fed: {bond.lastDrinkDate}
                          </p>
                        </div>

                        {/* Stage Badges & Drink Controls */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-[#150a12] border border-rose-950 px-2.5 py-1 rounded-lg">
                            <span className="text-[10px] font-mono text-neutral-400 mr-1">DRINKS:</span>
                            {[1, 2, 3].map(d => (
                              <div
                                key={d}
                                className={`
                                  w-4 h-4 rounded-full border flex items-center justify-center font-mono text-[9px] font-bold
                                  ${d <= bond.drinkCount
                                    ? 'bg-rose-600 border-rose-400 text-white shadow-[0_0_8px_rgba(225,29,72,0.6)]'
                                    : 'border-[#2d1424] bg-[#120810] text-neutral-600'}
                                `}
                              >
                                {d}
                              </div>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDrinkVitae(bond.id)}
                            disabled={bond.drinkCount >= 3}
                            className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 disabled:opacity-40 text-rose-200 text-xs font-mono transition"
                            title="Drink Vitae (+1 Bond Stage)"
                          >
                            + Drink
                          </button>

                          <button
                            type="button"
                            onClick={() => handleBreakBond(bond.id)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 transition"
                            title="Sever Bond"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Mechanical & Emotional Stage Breakdown */}
                      <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-[#120810] p-2.5 rounded-lg border border-[#1a0a16]">
                          <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block mb-1">
                            {stageInfo.name}
                          </span>
                          <p className="text-neutral-300 font-sans leading-relaxed">
                            {stageInfo.emotionalState}
                          </p>
                        </div>

                        <div className="bg-[#120810] p-2.5 rounded-lg border border-[#1a0a16]">
                          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                            Rules & Defiance System:
                          </span>
                          <p className="text-neutral-300 font-sans leading-relaxed">
                            {stageInfo.mechanicalEffect}
                          </p>
                        </div>
                      </div>

                      {bond.notes && (
                        <p className="text-[11px] text-neutral-400 italic mt-2.5 pt-2 border-t border-[#180a14]">
                          Notes: {bond.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Torpor Calculator */}
        {activeTab === 'torpor' && (
          <div className="flex-1 overflow-y-auto pt-4 space-y-6 custom-scrollbar text-xs">
            <div className="p-4 bg-[#120810] border border-rose-900/60 rounded-xl">
              <h3 className="font-cinzel text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                V5 CANONICAL TORPOR SLUMBER CALCULATOR
              </h3>
              <p className="text-neutral-300 font-sans leading-relaxed">
                When a vampire’s Health track is completely filled with Aggravated damage, they collapse into the deathly slumber of Torpor. The duration of this sleep is dictated solely by their Humanity rating at the moment of fall.
              </p>
            </div>

            {/* Slider */}
            <div className="bg-[#0e070c] border border-[#21121d] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-cinzel text-sm font-bold text-neutral-200">
                  KINDRED HUMANITY AT TORPOR COLLAPSE:
                </label>
                <span className="font-mono text-2xl font-black text-rose-400">
                  {torporHumanity} / 10
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={10}
                value={torporHumanity}
                onChange={e => setTorporHumanity(parseInt(e.target.value) || 0)}
                className="w-full accent-rose-600 bg-neutral-900 cursor-pointer h-2 rounded-lg"
              />

              <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/60 to-black border border-rose-800 text-center space-y-1">
                <span className="text-[11px] font-mono uppercase text-neutral-400">Exact Slumber Duration:</span>
                <p className="font-cinzel text-2xl font-black text-white tracking-wider">
                  {torporDetails.duration}
                </p>
                <p className="text-xs text-rose-300 font-sans italic pt-1">
                  {torporDetails.description}
                </p>
              </div>
            </div>

            {/* Canonical Reference Table */}
            <div className="bg-[#0e070c] border border-[#21121d] rounded-xl p-4">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-3">
                VAMPIRE: THE MASQUERADE 5TH EDITION TORPOR TABLE (P. 223)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                <div className="p-2 bg-[#120810] rounded border border-[#1e0e1a]">Humanity 9: 3 Days</div>
                <div className="p-2 bg-[#120810] rounded border border-[#1e0e1a]">Humanity 8: 1 Week</div>
                <div className="p-2 bg-[#120810] rounded border border-[#1e0e1a]">Humanity 7: 2 Weeks</div>
                <div className="p-2 bg-[#120810] rounded border border-[#1e0e1a]">Humanity 6: 1 Month</div>
                <div className="p-2 bg-[#120810] rounded border border-[#1e0e1a] text-rose-300 font-bold">Humanity 5: 1 Year</div>
                <div className="p-2 bg-[#120810] rounded border border-[#1e0e1a]">Humanity 4: 10 Years</div>
                <div className="p-2 bg-[#120810] rounded border border-[#1e0e1a]">Humanity 3: 50 Years</div>
                <div className="p-2 bg-[#120810] rounded border border-[#1e0e1a]">Humanity 2: 100 Years</div>
                <div className="p-2 bg-[#120810] rounded border border-[#1e0e1a] text-rose-400 font-bold">Humanity 1: 500 Years</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Beast & Frenzy Simulator */}
        {activeTab === 'frenzy' && (
          <div className="flex-1 overflow-y-auto pt-4 space-y-5 custom-scrollbar text-xs">
            <div className="p-4 bg-[#120810] border border-rose-900/60 rounded-xl">
              <h3 className="font-cinzel text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" />
                FRENZY & RÖTSCHRECK SIMULATOR
              </h3>
              <p className="text-neutral-300 font-sans leading-relaxed">
                When faced with physical insult, starvation, fire, or sunlight, the kindred’s composure is tested against the Beast. Roll Willpower (Resolve + Composure) against the stimulus difficulty.
              </p>
            </div>

            {/* Scenario Picker */}
            <div>
              <label className="text-[10px] font-mono text-neutral-400 block mb-1">
                SELECT FRENZY PROVOCATION / STIMULUS:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FRENZY_SCENARIOS.map(scen => (
                  <button
                    key={scen.id}
                    type="button"
                    onClick={() => setSelectedScenarioId(scen.id)}
                    className={`
                      p-3 rounded-xl border text-left transition
                      ${selectedScenarioId === scen.id
                        ? 'bg-rose-950/60 border-rose-600 shadow-[0_0_12px_rgba(225,29,72,0.3)] text-white'
                        : 'bg-[#0e070c] border-[#22101e] text-neutral-400 hover:border-neutral-600'}
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-cinzel font-bold text-xs">{scen.title}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-neutral-900 border border-neutral-700 text-rose-300">
                        Diff {scen.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-sans line-clamp-2">
                      {scen.stimulus}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Actor & Pool Setup */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-[#0e070c] border border-[#21121d] rounded-xl">
              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-1">Testing Character</label>
                <select
                  value={frenzyActorName}
                  onChange={e => setFrenzyActorName(e.target.value)}
                  className="w-full bg-[#140a12] border border-[#2b1424] rounded px-3 py-1.5 text-neutral-100 font-cinzel"
                >
                  {characters.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="Torpid Kindred">Torpid Kindred</option>
                  <option value="Fledgling">Fledgling</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-1">
                  Willpower Pool (Resolve + Composure) ({frenzyPool} dice)
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={frenzyPool}
                  onChange={e => setFrenzyPool(parseInt(e.target.value) || 5)}
                  className="w-full bg-[#140a12] border border-[#2b1424] rounded px-3 py-1.5 text-neutral-100 font-mono"
                />
              </div>

              <div className="col-span-2 pt-2">
                <button
                  type="button"
                  onClick={handleRunFrenzyCheck}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-700 to-rose-900 hover:from-red-600 hover:to-rose-800 text-white font-cinzel font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(225,29,72,0.4)] transition"
                >
                  TEST WILLPOWER AGAINST THE BEAST
                </button>
              </div>
            </div>

            {/* Frenzy Result Box */}
            {frenzyResult && (
              <div className={`
                p-4 rounded-xl border animate-fade-in
                ${frenzyResult.passed 
                  ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200' 
                  : 'bg-red-950/50 border-red-700 text-red-200'}
              `}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-cinzel text-sm font-bold">
                    {frenzyResult.passed ? 'COMPOSURE RETAINED (PASS)' : 'FRENZY TRIGGERED (FAILURE)'}
                  </span>
                  <span className="font-mono text-xs">
                    Successes: {frenzyResult.successes} / Diff: {frenzyResult.difficulty}
                  </span>
                </div>
                <p className="font-mono text-xs mt-1">
                  Dice: [{frenzyResult.diceRolled.join(', ')}]
                </p>
                <p className="mt-2 font-sans leading-relaxed">
                  {frenzyResult.outcomeText}
                </p>
                <div className="mt-3 p-2.5 rounded bg-black/40 border border-neutral-800 text-[11px] font-sans">
                  <span className="font-bold text-white block mb-0.5">BEAST BEHAVIOR & COMPULSION:</span>
                  {frenzyResult.compulsion}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* MODAL: ADD BLOOD BOND */}
      {addBondOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0f090e] border border-rose-900/60 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#21121d]">
              <h3 className="font-cinzel text-base font-bold text-white">ENACT NEW BLOOD BOND</h3>
              <button
                type="button"
                onClick={() => setAddBondOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBond} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Regnant (Provider of Vitae)</label>
                <input
                  type="text"
                  value={newRegnantName}
                  onChange={e => setNewRegnantName(e.target.value)}
                  className="w-full bg-[#150a12] border border-[#2b1424] rounded px-3 py-1.5 text-neutral-100"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Thrall (Consumer / Vassal)</label>
                <input
                  type="text"
                  value={newThrallName}
                  onChange={e => setNewThrallName(e.target.value)}
                  className="w-full bg-[#150a12] border border-[#2b1424] rounded px-3 py-1.5 text-neutral-100"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Initial Drink Count ({newDrinkCount})</label>
                <select
                  value={newDrinkCount}
                  onChange={e => setNewDrinkCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#150a12] border border-[#2b1424] rounded px-3 py-1.5 text-neutral-100 font-mono"
                >
                  <option value={1}>1 Drink - Stage 1 (Infatuation)</option>
                  <option value={2}>2 Drinks - Stage 2 (Loyalty)</option>
                  <option value={3}>3 Drinks - Stage 3 (Complete Vassalage)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Circumstances / Notes</label>
                <textarea
                  rows={2}
                  value={newBondNotes}
                  onChange={e => setNewBondNotes(e.target.value)}
                  placeholder="e.g. Fed vitae during pact negotiation..."
                  className="w-full bg-[#150a12] border border-[#2b1424] rounded px-3 py-1.5 text-neutral-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddBondOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#180d15] text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-rose-900 hover:bg-rose-800 text-white font-cinzel font-bold"
                >
                  Enact Bond
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
