import React, { useState, useEffect } from 'react';
import { 
  Swords, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Plus, 
  Shield, 
  Heart, 
  Flame, 
  Zap, 
  Crosshair, 
  Skull, 
  Trash2, 
  Activity, 
  UserPlus, 
  ShieldAlert, 
  Volume2, 
  AlertTriangle,
  Play,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';
import { 
  Combatant, 
  CombatEncounter, 
  CombatLogEntry, 
  DamageType, 
  AttackType, 
  CalledShotOption 
} from '../../types/combat';
import { Character } from '../../types/vtm';
import { storageService } from '../../services/storage';
import { combatEngine, CALLED_SHOT_OPTIONS } from '../../services/combatEngine';
import { THREAT_STAT_BLOCKS, ThreatStatBlock } from '../../data/npcStatBlocks';
import { soundEngine } from '../../services/soundEngine';

interface CombatTrackerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  characters?: Character[];
  onShowToast?: (title: string, desc?: string, type?: 'info' | 'blood' | 'success' | 'error') => void;
}

export const CombatTrackerDrawer: React.FC<CombatTrackerDrawerProps> = ({
  isOpen,
  onClose,
  characters = [],
  onShowToast
}) => {
  const [encounters, setEncounters] = useState<CombatEncounter[]>(storageService.getCombatEncounters());
  const [activeEncounterId, setActiveEncounterId] = useState<string>(
    encounters[0]?.id || ''
  );
  
  // Modals inside Combat Drawer
  const [addCombatantOpen, setAddCombatantOpen] = useState(false);
  const [attackResolverOpen, setAttackResolverOpen] = useState(false);
  const [addStatusModalFor, setAddStatusModalFor] = useState<string | null>(null);

  // Attack Resolver State
  const [selectedAttackerId, setSelectedAttackerId] = useState<string>('');
  const [selectedDefenderId, setSelectedDefenderId] = useState<string>('');
  const [selectedAttackType, setSelectedAttackType] = useState<AttackType>('slashing');
  const [selectedCalledShot, setSelectedCalledShot] = useState<CalledShotOption | null>(null);
  const [weaponBonus, setWeaponBonus] = useState<number>(0);
  const [attackResultOutput, setAttackResultOutput] = useState<string | null>(null);

  // Custom Quick Antagonist State
  const [customName, setCustomName] = useState('');
  const [customType, setCustomType] = useState<'pc' | 'npc' | 'threat'>('threat');
  const [customHealth, setCustomHealth] = useState(6);
  const [customArmor, setCustomArmor] = useState(0);
  const [customWits, setCustomWits] = useState(3);
  const [customAwareness, setCustomAwareness] = useState(2);
  const [customCelerity, setCustomCelerity] = useState(0);
  const [customPrimaryPoolName, setCustomPrimaryPoolName] = useState('Brawl / Firearms');
  const [customPrimaryPoolValue, setCustomPrimaryPoolValue] = useState(6);

  const activeEncounter = encounters.find(e => e.id === activeEncounterId) || encounters[0];

  useEffect(() => {
    if (encounters.length > 0 && !activeEncounterId) {
      setActiveEncounterId(encounters[0].id);
    }
  }, [encounters, activeEncounterId]);

  if (!isOpen) return null;

  const saveActiveEncounter = (updated: CombatEncounter) => {
    storageService.saveCombatEncounter(updated);
    const refreshed = storageService.getCombatEncounters();
    setEncounters(refreshed);
  };

  const handleCreateNewEncounter = () => {
    const newEnc: CombatEncounter = {
      id: 'encounter_' + Date.now(),
      name: `Skirmish ${encounters.length + 1}`,
      round: 1,
      activeCombatantIndex: 0,
      isActive: true,
      combatants: [],
      log: [
        {
          id: 'log_' + Date.now(),
          round: 1,
          timestamp: Date.now(),
          actorName: 'System',
          action: 'Combat Initiated',
          details: 'Tactical skirmish board opened.'
        }
      ]
    };
    storageService.saveCombatEncounter(newEnc);
    const refreshed = storageService.getCombatEncounters();
    setEncounters(refreshed);
    setActiveEncounterId(newEnc.id);
    if (onShowToast) onShowToast('New Combat Encounter', 'Tactical initiative grid ready.', 'blood');
  };

  const handleNextTurn = () => {
    if (!activeEncounter || activeEncounter.combatants.length === 0) return;
    soundEngine.playDiceRoll();

    const currentIdx = activeEncounter.activeCombatantIndex;
    let nextIdx = currentIdx + 1;
    let nextRound = activeEncounter.round;

    if (nextIdx >= activeEncounter.combatants.length) {
      nextIdx = 0;
      nextRound += 1;
    }

    const updatedCombatants = activeEncounter.combatants.map((c, i) => ({
      ...c,
      isTurn: i === nextIdx
    }));

    const nextActor = updatedCombatants[nextIdx];
    const logEntry: CombatLogEntry = {
      id: 'log_' + Date.now(),
      round: nextRound,
      timestamp: Date.now(),
      actorName: nextActor?.name || 'Unknown',
      action: 'Turn Started',
      details: `Round ${nextRound} turn passed to ${nextActor?.name}.`
    };

    const updated: CombatEncounter = {
      ...activeEncounter,
      round: nextRound,
      activeCombatantIndex: nextIdx,
      combatants: updatedCombatants,
      log: [logEntry, ...activeEncounter.log]
    };

    saveActiveEncounter(updated);
  };

  const handlePrevTurn = () => {
    if (!activeEncounter || activeEncounter.combatants.length === 0) return;
    const currentIdx = activeEncounter.activeCombatantIndex;
    let prevIdx = currentIdx - 1;
    let round = activeEncounter.round;

    if (prevIdx < 0) {
      prevIdx = Math.max(0, activeEncounter.combatants.length - 1);
      round = Math.max(1, round - 1);
    }

    const updatedCombatants = activeEncounter.combatants.map((c, i) => ({
      ...c,
      isTurn: i === prevIdx
    }));

    saveActiveEncounter({
      ...activeEncounter,
      round,
      activeCombatantIndex: prevIdx,
      combatants: updatedCombatants
    });
  };

  const handleRerollInitiative = () => {
    if (!activeEncounter || activeEncounter.combatants.length === 0) return;
    soundEngine.playDiceRoll();

    const rolled = activeEncounter.combatants.map(c => {
      const init = combatEngine.calculateInitiative(c.wits, c.awareness, c.celerity || 0);
      return {
        ...c,
        initiativeRoll: init
      };
    });

    // Sort descending
    rolled.sort((a, b) => b.initiativeRoll - a.initiativeRoll);
    rolled.forEach((c, idx) => {
      c.isTurn = idx === 0;
    });

    const updated: CombatEncounter = {
      ...activeEncounter,
      activeCombatantIndex: 0,
      combatants: rolled,
      log: [
        {
          id: 'log_' + Date.now(),
          round: activeEncounter.round,
          timestamp: Date.now(),
          actorName: 'Initiative Ladder',
          action: 'Initiative Rerolled',
          details: 'Combatants resorted by new Wits + Awareness + Celerity.'
        },
        ...activeEncounter.log
      ]
    };

    saveActiveEncounter(updated);
    if (onShowToast) onShowToast('Initiative Rolled', 'Turn ladder sorted from highest to lowest.', 'info');
  };

  const handleApplyDamage = (combatantId: string, type: 'superficial' | 'aggravated', amount: number = 1) => {
    if (!activeEncounter) return;
    const combatant = activeEncounter.combatants.find(c => c.id === combatantId);
    if (!combatant) return;

    soundEngine.playCombatHit();

    const result = combatEngine.applyDamage(combatant.healthDamage, amount, type);
    const updatedStatuses = [...combatant.statusEffects];
    if (result.isTorpid && !updatedStatuses.includes('Torpid / Incapacitated')) {
      updatedStatuses.push('Torpid / Incapacitated');
      soundEngine.playBestialFail();
      if (onShowToast) onShowToast('Torpor Triggered', `${combatant.name} has succumbed to critical damage!`, 'error');
    }

    const updatedCombatants = activeEncounter.combatants.map(c => {
      if (c.id === combatantId) {
        return {
          ...c,
          healthDamage: result.updatedTrack,
          statusEffects: updatedStatuses
        };
      }
      return c;
    });

    const logEntry: CombatLogEntry = {
      id: 'log_' + Date.now(),
      round: activeEncounter.round,
      timestamp: Date.now(),
      actorName: combatant.name,
      action: `Took ${amount} ${type.toUpperCase()} Damage`,
      details: result.isTorpid ? `${combatant.name} fell into Torpid collapse.` : `Health track sustained ${amount} ${type} wound boxes.`,
      damageDealt: amount,
      damageType: type
    };

    saveActiveEncounter({
      ...activeEncounter,
      combatants: updatedCombatants,
      log: [logEntry, ...activeEncounter.log]
    });
  };

  const handleHealDamage = (combatantId: string, amount: number = 1) => {
    if (!activeEncounter) return;
    const combatant = activeEncounter.combatants.find(c => c.id === combatantId);
    if (!combatant) return;

    const healed = combatEngine.healDamage(combatant.healthDamage, amount);
    const updatedCombatants = activeEncounter.combatants.map(c => {
      if (c.id === combatantId) {
        return {
          ...c,
          healthDamage: healed,
          statusEffects: c.statusEffects.filter(s => s !== 'Torpid / Incapacitated')
        };
      }
      return c;
    });

    saveActiveEncounter({
      ...activeEncounter,
      combatants: updatedCombatants,
      log: [
        {
          id: 'log_' + Date.now(),
          round: activeEncounter.round,
          timestamp: Date.now(),
          actorName: combatant.name,
          action: `Mended ${amount} Damage Box`,
          details: 'Vitae revitalized cellular tissue.'
        },
        ...activeEncounter.log
      ]
    });
  };

  const handleToggleStatus = (combatantId: string, status: string) => {
    if (!activeEncounter) return;
    const combatant = activeEncounter.combatants.find(c => c.id === combatantId);
    if (!combatant) return;

    if (status === 'Staked') {
      soundEngine.playStakeImpact();
    }

    const hasStatus = combatant.statusEffects.includes(status);
    const updatedStatuses = hasStatus
      ? combatant.statusEffects.filter(s => s !== status)
      : [...combatant.statusEffects, status];

    const updatedCombatants = activeEncounter.combatants.map(c => {
      if (c.id === combatantId) {
        return { ...c, statusEffects: updatedStatuses };
      }
      return c;
    });

    saveActiveEncounter({
      ...activeEncounter,
      combatants: updatedCombatants,
      log: [
        {
          id: 'log_' + Date.now(),
          round: activeEncounter.round,
          timestamp: Date.now(),
          actorName: combatant.name,
          action: hasStatus ? `Removed Status: ${status}` : `Afflicted with: ${status}`,
          details: hasStatus ? `Status penalty ceased.` : `Now suffering ${status} condition effects.`
        },
        ...activeEncounter.log
      ]
    });
  };

  const handleDeleteCombatant = (combatantId: string) => {
    if (!activeEncounter) return;
    const updated = activeEncounter.combatants.filter(c => c.id !== combatantId);
    const newIdx = Math.min(activeEncounter.activeCombatantIndex, Math.max(0, updated.length - 1));
    saveActiveEncounter({
      ...activeEncounter,
      activeCombatantIndex: newIdx,
      combatants: updated.map((c, i) => ({ ...c, isTurn: i === newIdx }))
    });
  };

  // Add PC to Encounter
  const handleAddCharacterToCombat = (char: Character) => {
    if (!activeEncounter) return;
    const wits = char.attributes.mental.wits || 2;
    const awareness = char.skills.mental.awareness || 1;
    const celerity = char.disciplines.find(d => d.name.toLowerCase().includes('celerity'))?.level || 0;
    const brawl = char.skills.physical.brawl || 2;
    const potence = char.disciplines.find(d => d.name.toLowerCase().includes('potence'))?.level || 0;

    const newCombatant: Combatant = {
      id: 'c_' + char.id + '_' + Date.now(),
      name: char.name,
      type: 'pc',
      characterId: char.id,
      clan: char.clan,
      initiativeRoll: combatEngine.calculateInitiative(wits, awareness, celerity),
      healthMax: char.healthMax || 7,
      healthDamage: char.healthDamage || Array(char.healthMax || 7).fill('none'),
      willpowerMax: char.willpowerMax || 6,
      willpowerDamage: char.willpowerDamage || Array(char.willpowerMax || 6).fill('none'),
      armor: 1,
      statusEffects: [],
      isTurn: activeEncounter.combatants.length === 0,
      wits,
      awareness,
      celerity,
      notes: `Clan ${char.clan}. Potence ${potence}, Celerity ${celerity}.`,
      primaryPoolName: 'Brawl + Potence',
      primaryPoolValue: brawl + potence + (char.attributes.physical.strength || 2)
    };

    const updated = [...activeEncounter.combatants, newCombatant];
    updated.sort((a, b) => b.initiativeRoll - a.initiativeRoll);
    saveActiveEncounter({
      ...activeEncounter,
      combatants: updated.map((c, i) => ({ ...c, isTurn: i === 0 }))
    });
    setAddCombatantOpen(false);
    if (onShowToast) onShowToast('PC Added', `${char.name} entered the tactical ladder.`, 'success');
  };

  // Add Threat from Stat Blocks
  const handleAddThreatToCombat = (threat: ThreatStatBlock) => {
    if (!activeEncounter) return;
    const newCombatant: Combatant = {
      id: 'c_threat_' + Date.now(),
      name: threat.name,
      type: 'threat',
      initiativeRoll: combatEngine.calculateInitiative(3, 3, 0),
      healthMax: threat.health,
      healthDamage: Array(threat.health).fill('none'),
      willpowerMax: threat.willpower,
      willpowerDamage: Array(threat.willpower).fill('none'),
      armor: threat.gearOrPowers.some(g => g.toLowerCase().includes('armor')) ? 2 : 0,
      statusEffects: [],
      isTurn: activeEncounter.combatants.length === 0,
      wits: 3,
      awareness: 3,
      notes: threat.tactics,
      primaryPoolName: threat.primaryPool.name,
      primaryPoolValue: threat.primaryPool.pool,
      secondaryPoolName: threat.secondaryPool.name,
      secondaryPoolValue: threat.secondaryPool.pool
    };

    const updated = [...activeEncounter.combatants, newCombatant];
    updated.sort((a, b) => b.initiativeRoll - a.initiativeRoll);
    saveActiveEncounter({
      ...activeEncounter,
      combatants: updated.map((c, i) => ({ ...c, isTurn: i === 0 }))
    });
    setAddCombatantOpen(false);
    if (onShowToast) onShowToast('Antagonist Deployed', `${threat.name} joined combat.`, 'blood');
  };

  // Add Custom Antagonist
  const handleAddCustomAntagonist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEncounter || !customName.trim()) return;

    const newCombatant: Combatant = {
      id: 'c_custom_' + Date.now(),
      name: customName.trim(),
      type: customType,
      initiativeRoll: combatEngine.calculateInitiative(customWits, customAwareness, customCelerity),
      healthMax: customHealth,
      healthDamage: Array(customHealth).fill('none'),
      willpowerMax: 6,
      willpowerDamage: Array(6).fill('none'),
      armor: customArmor,
      statusEffects: [],
      isTurn: activeEncounter.combatants.length === 0,
      wits: customWits,
      awareness: customAwareness,
      celerity: customCelerity,
      primaryPoolName: customPrimaryPoolName,
      primaryPoolValue: customPrimaryPoolValue
    };

    const updated = [...activeEncounter.combatants, newCombatant];
    updated.sort((a, b) => b.initiativeRoll - a.initiativeRoll);
    saveActiveEncounter({
      ...activeEncounter,
      combatants: updated.map((c, i) => ({ ...c, isTurn: i === 0 }))
    });

    setCustomName('');
    setAddCombatantOpen(false);
    if (onShowToast) onShowToast('Combatant Created', `${newCombatant.name} added to initiative ladder.`, 'info');
  };

  // Execute Attack Contest
  const handleExecuteAttack = () => {
    if (!activeEncounter) return;
    const attacker = activeEncounter.combatants.find(c => c.id === selectedAttackerId);
    const defender = activeEncounter.combatants.find(c => c.id === selectedDefenderId);

    if (!attacker || !defender) {
      if (onShowToast) onShowToast('Selection Missing', 'Select both an attacker and a target.', 'error');
      return;
    }

    const attackerPool = attacker.primaryPoolValue || 6;
    const defenderPool = defender.secondaryPoolValue || 4;

    const result = combatEngine.resolveAttack({
      attackerName: attacker.name,
      defenderName: defender.name,
      attackerPool,
      defenderPool,
      attackType: selectedAttackType,
      weaponBonusDamage: weaponBonus,
      isDefenderVampire: defender.type === 'pc' || defender.name.toLowerCase().includes('vampire') || !!defender.clan,
      calledShot: selectedCalledShot,
      targetArmor: defender.armor
    });

    setAttackResultOutput(result.summary);

    if (result.hit && result.effectiveDamage > 0) {
      handleApplyDamage(defender.id, result.damageType, result.effectiveDamage);
      if (result.calledShotSucceeded && selectedCalledShot?.id === 'stake_heart') {
        handleToggleStatus(defender.id, 'Staked');
      } else if (result.calledShotSucceeded && selectedCalledShot?.id === 'cripple_limb') {
        handleToggleStatus(defender.id, 'Stunned');
      } else if (result.calledShotSucceeded && selectedCalledShot?.id === 'throat_bite') {
        handleToggleStatus(defender.id, 'Grappled');
      }
    } else {
      soundEngine.playDiceRoll();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl bg-[#09090d] border-l border-[#242434] h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0d0d14] border-b border-[#212130] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.4)]">
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">
                  TACTICAL COMBAT & INITIATIVE
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-900/60 border border-rose-700 text-rose-200">
                  ROUND {activeEncounter?.round || 1}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {activeEncounter?.name || 'Vampire: The Masquerade Skirmish Engine'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreateNewEncounter}
              className="px-3 py-1.5 rounded-lg bg-[#14141c] hover:bg-[#1f1f2c] border border-[#2a2a3a] text-xs font-cinzel text-neutral-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-rose-400" />
              New Combat
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-[#14141c] hover:bg-[#1f1f2c] border border-[#2a2a3a] text-neutral-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Round Controller */}
        <div className="px-6 py-3 bg-[#0a0a0f] border-b border-[#1b1b26] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Turn Navigation */}
            <button
              type="button"
              onClick={handlePrevTurn}
              className="px-3 py-1.5 rounded-lg bg-[#14141c] hover:bg-[#1f1f2c] border border-[#262636] text-xs text-neutral-300 transition flex items-center gap-1"
              title="Previous Turn"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              onClick={handleNextTurn}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-600 hover:to-rose-800 text-white font-cinzel font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(225,29,72,0.4)] transition flex items-center gap-1.5"
            >
              Next Turn
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRerollInitiative}
              className="px-3 py-1.5 rounded-lg bg-[#14141c] hover:bg-[#1f1f2c] border border-[#262636] text-xs text-neutral-300 hover:text-rose-300 transition flex items-center gap-1.5"
              title="Re-calculate initiative from Wits + Awareness"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reroll Initiative
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (activeEncounter && activeEncounter.combatants.length >= 2) {
                  setSelectedAttackerId(activeEncounter.combatants[0].id);
                  setSelectedDefenderId(activeEncounter.combatants[1].id);
                }
                setAttackResultOutput(null);
                setAttackResolverOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-red-300 text-xs font-cinzel font-semibold tracking-wider flex items-center gap-1.5 transition"
            >
              <Crosshair className="w-3.5 h-3.5 text-red-400" />
              Attack Resolver
            </button>
            <button
              type="button"
              onClick={() => setAddCombatantOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#171722] hover:bg-[#232332] border border-[#2b2b3d] text-xs font-cinzel text-neutral-200 hover:text-white flex items-center gap-1.5 transition"
            >
              <UserPlus className="w-3.5 h-3.5 text-rose-400" />
              Add Combatant
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Initiative Ladder */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-rose-400" />
                <h3 className="font-cinzel text-sm font-bold text-neutral-200 tracking-wider">
                  INITIATIVE LADDER ({activeEncounter?.combatants?.length || 0})
                </h3>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                Sorted by Wits + Awareness + Celerity
              </span>
            </div>

            {(!activeEncounter?.combatants || activeEncounter.combatants.length === 0) ? (
              <div className="p-8 text-center bg-[#0d0d14] border border-[#1e1e2c] rounded-xl">
                <ShieldAlert className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                <p className="text-sm font-cinzel text-neutral-400">No combatants on the initiative ladder.</p>
                <p className="text-xs text-neutral-400 mt-1">Import player characters or deploy antagonists to begin combat.</p>
                <button
                  type="button"
                  onClick={() => setAddCombatantOpen(true)}
                  className="mt-4 px-4 py-2 rounded-lg bg-rose-900 hover:bg-rose-800 text-white font-cinzel text-xs tracking-wider transition"
                >
                  Deploy Combatants
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeEncounter.combatants.map((combatant, index) => {
                  const isCurrent = combatant.isTurn;
                  const isTorpid = combatant.statusEffects.includes('Torpid / Incapacitated');
                  const isStaked = combatant.statusEffects.includes('Staked');

                  return (
                    <div
                      key={combatant.id}
                      className={`
                        relative rounded-xl border p-4 transition-all
                        ${isCurrent 
                          ? 'bg-[#150d12] border-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.25)] ring-1 ring-rose-500/50' 
                          : 'bg-[#0e0e15] border-[#1d1d2b] hover:border-[#2d2d40]'}
                        ${isTorpid ? 'opacity-60 bg-red-950/20' : ''}
                      `}
                    >
                      {/* Active Indicator Flag */}
                      {isCurrent && (
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-10 bg-rose-500 rounded-r-md shadow-[0_0_8px_#f43f5e]" />
                      )}

                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        
                        {/* Combatant Info */}
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-10 h-10 rounded-lg flex flex-col items-center justify-center font-mono font-bold
                            ${isCurrent ? 'bg-rose-900 border border-rose-500 text-white' : 'bg-[#151520] border border-[#252536] text-neutral-400'}
                          `}>
                            <span className="text-[10px] text-neutral-400">INIT</span>
                            <span className="text-xs">{combatant.initiativeRoll.toFixed(1)}</span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-cinzel font-bold text-neutral-100 text-sm">
                                {combatant.name}
                              </h4>
                              <span className={`
                                text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-bold
                                ${combatant.type === 'pc' ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300' : ''}
                                ${combatant.type === 'threat' ? 'bg-rose-950/80 border border-rose-800 text-rose-300' : ''}
                                ${combatant.type === 'npc' ? 'bg-amber-950/80 border border-amber-800 text-amber-300' : ''}
                              `}>
                                {combatant.type}
                              </span>
                              {combatant.clan && (
                                <span className="text-[10px] text-neutral-400 font-sans">
                                  ({combatant.clan})
                                </span>
                              )}
                              {combatant.armor > 0 && (
                                <span className="flex items-center gap-0.5 text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800">
                                  <Shield className="w-3 h-3" />
                                  ARMOR {combatant.armor}
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                              Pool: {combatant.primaryPoolName || 'Attack'} ({combatant.primaryPoolValue || 5} dice) | Wits: {combatant.wits} | Awareness: {combatant.awareness} {combatant.celerity ? `| Celerity: +${combatant.celerity}` : ''}
                            </p>
                          </div>
                        </div>

                        {/* Health Damage Track */}
                        <div className="flex flex-col items-end gap-1.5 w-full md:w-auto">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Health:</span>
                            <div className="flex items-center gap-1">
                              {combatant.healthDamage.map((dmg, idx) => (
                                <div
                                  key={idx}
                                  className={`
                                    w-5 h-5 rounded border flex items-center justify-center font-mono font-bold text-xs select-none
                                    ${dmg === 'none' ? 'border-[#333348] bg-[#14141e] text-neutral-600' : ''}
                                    ${dmg === 'superficial' ? 'border-amber-700 bg-amber-950/60 text-amber-300' : ''}
                                    ${dmg === 'aggravated' ? 'border-rose-700 bg-rose-950/80 text-rose-200 shadow-[0_0_8px_rgba(225,29,72,0.5)]' : ''}
                                  `}
                                  title={`Box ${idx + 1}: ${dmg.toUpperCase()}`}
                                >
                                  {dmg === 'superficial' ? '/' : dmg === 'aggravated' ? 'X' : ''}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Quick Damage Controls */}
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleApplyDamage(combatant.id, 'superficial', 1)}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/50 hover:bg-amber-900 border border-amber-800 text-amber-300 transition"
                              title="Inflict 1 Superficial Damage"
                            >
                              +1 Superficial (/)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApplyDamage(combatant.id, 'aggravated', 1)}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-200 transition"
                              title="Inflict 1 Aggravated Damage"
                            >
                              +1 Aggravated (X)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleHealDamage(combatant.id, 1)}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/50 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 transition"
                              title="Mend 1 Damage Box"
                            >
                              Heal Box
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Status Badges & Quick Action Bar */}
                      <div className="mt-3 pt-3 border-t border-[#1b1b26] flex flex-wrap items-center justify-between gap-2">
                        {/* Status Pills */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {combatant.statusEffects.length === 0 ? (
                            <span className="text-[11px] text-neutral-400 font-sans italic">No conditions</span>
                          ) : (
                            combatant.statusEffects.map((status, sIdx) => (
                              <button
                                key={sIdx}
                                type="button"
                                onClick={() => handleToggleStatus(combatant.id, status)}
                                className={`
                                  px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1 border transition
                                  ${status === 'Staked' ? 'bg-amber-950/80 border-amber-600 text-amber-200' : ''}
                                  ${status.includes('Torpid') ? 'bg-red-950 border-red-700 text-red-200' : ''}
                                  ${status === 'Stunned' ? 'bg-yellow-950/80 border-yellow-700 text-yellow-200' : ''}
                                  ${status === 'Grappled' ? 'bg-purple-950/80 border-purple-700 text-purple-200' : ''}
                                  ${!['Staked', 'Stunned', 'Grappled'].includes(status) && !status.includes('Torpid')
                                    ? 'bg-[#1b1b29] border-[#2c2c40] text-neutral-300' : ''}
                                `}
                                title="Click to remove status"
                              >
                                {status}
                                <X className="w-2.5 h-2.5 text-neutral-400 hover:text-white" />
                              </button>
                            ))
                          )}

                          {/* Quick Add Status Dropdown trigger */}
                          <button
                            type="button"
                            onClick={() => setAddStatusModalFor(addStatusModalFor === combatant.id ? null : combatant.id)}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161622] hover:bg-[#202030] border border-[#272738] text-neutral-300 transition"
                          >
                            + Status
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAttackerId(combatant.id);
                              const opponent = activeEncounter.combatants.find(c => c.id !== combatant.id);
                              if (opponent) setSelectedDefenderId(opponent.id);
                              setAttackResolverOpen(true);
                            }}
                            className="text-xs text-rose-400 hover:text-rose-300 font-cinzel flex items-center gap-1"
                          >
                            <Crosshair className="w-3.5 h-3.5" />
                            Attack
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCombatant(combatant.id)}
                            className="p-1 rounded text-neutral-400 hover:text-red-400 transition"
                            title="Remove from combat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Status Picker Menu */}
                      {addStatusModalFor === combatant.id && (
                        <div className="mt-2 p-2.5 bg-[#0b0b12] border border-[#232335] rounded-lg flex flex-wrap gap-1.5 animate-fade-in">
                          {['Stunned', 'Grappled', 'Staked', 'Torpid / Incapacitated', 'Cover (-2 to hit)', 'Blood Surging (+2)', 'Blind / Obfuscated', 'Frenzying'].map(statusName => (
                            <button
                              key={statusName}
                              type="button"
                              onClick={() => {
                                handleToggleStatus(combatant.id, statusName);
                                setAddStatusModalFor(null);
                              }}
                              className={`
                                text-[10px] font-mono px-2 py-1 rounded border transition
                                ${combatant.statusEffects.includes(statusName)
                                  ? 'bg-rose-950 border-rose-700 text-rose-300'
                                  : 'bg-[#14141e] border-[#252538] text-neutral-300 hover:border-neutral-500'}
                              `}
                            >
                              {statusName}
                            </button>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Combat Log */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-neutral-400" />
                <h3 className="font-cinzel text-sm font-bold text-neutral-300 tracking-wider">
                  TACTICAL COMBAT LOG
                </h3>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {activeEncounter?.log?.length || 0} Events Logged
              </span>
            </div>

            <div className="bg-[#0b0b12] border border-[#1b1b26] rounded-xl p-3 max-h-48 overflow-y-auto font-mono text-xs space-y-2 custom-scrollbar">
              {(!activeEncounter?.log || activeEncounter.log.length === 0) ? (
                <p className="text-neutral-600 text-center py-4">No events logged yet.</p>
              ) : (
                activeEncounter.log.map(entry => (
                  <div key={entry.id} className="flex items-start gap-2 border-b border-[#161622] pb-1.5 last:border-none">
                    <span className="text-rose-400 font-bold shrink-0">R{entry.round}:</span>
                    <span className="text-neutral-300 font-semibold shrink-0">[{entry.actorName}]</span>
                    <span className="text-neutral-400">{entry.action} —</span>
                    <span className="text-neutral-200">{entry.details}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* MODAL 1: ADD COMBATANT (PC / NPC THREAT / CUSTOM) */}
      {addCombatantOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0d0d14] border border-[#2b2b3a] rounded-xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-[#212130]">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-rose-400" />
                <h3 className="font-cinzel text-lg font-bold text-white tracking-wide">
                  DEPLOY COMBATANTS TO LADDER
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAddCombatantOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-6">
              
              {/* Import from Player Characters */}
              <div>
                <h4 className="font-cinzel text-xs font-bold text-neutral-300 tracking-wider mb-2">
                  IMPORT PLAYER CHARACTERS
                </h4>
                {characters.length === 0 ? (
                  <p className="text-xs text-neutral-400">No player characters created.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {characters.map(char => (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => handleAddCharacterToCombat(char)}
                        className="p-2.5 rounded-lg bg-[#14141e] hover:bg-rose-950/40 border border-[#242436] hover:border-rose-700 text-left transition flex items-center justify-between"
                      >
                        <div>
                          <p className="font-cinzel text-xs font-bold text-neutral-200">{char.name}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">Clan {char.clan} | Gen {char.generation}</p>
                        </div>
                        <Plus className="w-4 h-4 text-rose-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Import Threat / Antagonist Presets */}
              <div>
                <h4 className="font-cinzel text-xs font-bold text-neutral-300 tracking-wider mb-2">
                  DEPLOY ANTAGONIST PRESETS (SECOND INQUISITION / LUPINES / GHOULS)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {THREAT_STAT_BLOCKS.map(threat => (
                    <button
                      key={threat.id}
                      type="button"
                      onClick={() => handleAddThreatToCombat(threat)}
                      className="p-2.5 rounded-lg bg-[#14141e] hover:bg-rose-950/40 border border-[#242436] hover:border-rose-700 text-left transition flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-cinzel text-xs font-bold text-neutral-200">{threat.name}</p>
                          <span className={`text-[9px] font-mono px-1 rounded uppercase ${threat.threatLevel === 'Lethal' ? 'bg-red-950 text-red-300' : 'bg-neutral-800 text-neutral-300'}`}>
                            {threat.threatLevel}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-mono">{threat.primaryPool.name} ({threat.primaryPool.pool} dice)</p>
                      </div>
                      <Plus className="w-4 h-4 text-rose-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Custom Combatant Builder */}
              <div className="pt-4 border-t border-[#212130]">
                <h4 className="font-cinzel text-xs font-bold text-neutral-300 tracking-wider mb-3">
                  QUICK STAT BLOCK CREATOR
                </h4>
                <form onSubmit={handleAddCustomAntagonist} className="grid grid-cols-2 gap-3 text-xs">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[10px] text-neutral-400 font-mono block mb-1">Combatant Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sabbat Pack Infiltrator"
                      value={customName}
                      onChange={e => setCustomName(e.target.value)}
                      className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-1.5 text-neutral-100 font-sans focus:outline-none focus:border-rose-600"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[10px] text-neutral-400 font-mono block mb-1">Role / Type</label>
                    <select
                      value={customType}
                      onChange={e => setCustomType(e.target.value as any)}
                      className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-1.5 text-neutral-100 font-mono focus:outline-none"
                    >
                      <option value="threat">Threat / Antagonist</option>
                      <option value="npc">Neutral / Ally NPC</option>
                      <option value="pc">Player Character</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 font-mono block mb-1">Health Boxes ({customHealth})</label>
                    <input
                      type="number"
                      min={3}
                      max={15}
                      value={customHealth}
                      onChange={e => setCustomHealth(parseInt(e.target.value) || 6)}
                      className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-1.5 text-neutral-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 font-mono block mb-1">Armor Rating ({customArmor})</label>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      value={customArmor}
                      onChange={e => setCustomArmor(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-1.5 text-neutral-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 font-mono block mb-1">Primary Attack Pool Name</label>
                    <input
                      type="text"
                      value={customPrimaryPoolName}
                      onChange={e => setCustomPrimaryPoolName(e.target.value)}
                      className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-1.5 text-neutral-100"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 font-mono block mb-1">Attack Dice Pool ({customPrimaryPoolValue})</label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={customPrimaryPoolValue}
                      onChange={e => setCustomPrimaryPoolValue(parseInt(e.target.value) || 6)}
                      className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-1.5 text-neutral-100 font-mono"
                    />
                  </div>

                  <div className="col-span-2 pt-2">
                    <button
                      type="submit"
                      disabled={!customName.trim()}
                      className="w-full py-2 rounded-lg bg-rose-900 hover:bg-rose-800 disabled:opacity-50 text-white font-cinzel font-bold text-xs tracking-wider transition"
                    >
                      Create & Deploy Custom Combatant
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ATTACK RESOLUTION & CALLED SHOT CALCULATOR */}
      {attackResolverOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0e0e16] border border-[#2e2e42] rounded-xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#212132]">
              <div className="flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-rose-500" />
                <h3 className="font-cinzel text-lg font-bold text-white tracking-wide">
                  ATTACK & CALLED SHOT RESOLVER
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAttackResolverOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs font-sans">
              
              {/* Attacker vs Defender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-400 font-mono block mb-1">Attacker</label>
                  <select
                    value={selectedAttackerId}
                    onChange={e => setSelectedAttackerId(e.target.value)}
                    className="w-full bg-[#141420] border border-[#2b2b40] rounded px-3 py-2 text-neutral-100 font-cinzel"
                  >
                    {activeEncounter?.combatants?.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.primaryPoolValue || 5} dice)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 font-mono block mb-1">Target Defender</label>
                  <select
                    value={selectedDefenderId}
                    onChange={e => setSelectedDefenderId(e.target.value)}
                    className="w-full bg-[#141420] border border-[#2b2b40] rounded px-3 py-2 text-neutral-100 font-cinzel"
                  >
                    {activeEncounter?.combatants?.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} (Armor {c.armor})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Attack Type & Weapon Modifiers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-400 font-mono block mb-1">Attack Type / Weapon</label>
                  <select
                    value={selectedAttackType}
                    onChange={e => setSelectedAttackType(e.target.value as AttackType)}
                    className="w-full bg-[#141420] border border-[#2b2b40] rounded px-3 py-2 text-neutral-100 font-mono"
                  >
                    <option value="unarmed">Unarmed / Fists (Superficial)</option>
                    <option value="slashing">Slashing Blades / Knives (Superficial / Agg to mortals)</option>
                    <option value="melee">Blunt Melee / Clubs</option>
                    <option value="firearms">Firearms / Gunfire (Superficial to kindred / Agg to mortals)</option>
                    <option value="bite">Fanged Bite (Aggravated damage to kindred)</option>
                    <option value="fire">Fire / Incendiary (Aggravated damage)</option>
                    <option value="sunlight">Sunlight / UV Floodlight (Aggravated damage)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 font-mono block mb-1">Weapon Bonus Damage (+{weaponBonus})</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={weaponBonus}
                    onChange={e => setWeaponBonus(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#141420] border border-[#2b2b40] rounded px-3 py-2 text-neutral-100 font-mono"
                  />
                </div>
              </div>

              {/* Called Shot Options */}
              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">
                  Called Shot (Optional Tactical Aim)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCalledShot(null)}
                    className={`
                      p-2 rounded text-left border text-[11px] transition
                      ${selectedCalledShot === null ? 'bg-rose-950 border-rose-600 text-rose-200' : 'bg-[#141420] border-[#29293e] text-neutral-400'}
                    `}
                  >
                    Standard Attack (No penalty)
                  </button>
                  {CALLED_SHOT_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedCalledShot(opt)}
                      className={`
                        p-2 rounded text-left border text-[11px] transition
                        ${selectedCalledShot?.id === opt.id ? 'bg-rose-950 border-rose-600 text-rose-200' : 'bg-[#141420] border-[#29293e] text-neutral-400'}
                      `}
                    >
                      <div className="font-semibold text-neutral-200">{opt.name}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        -{opt.penalty} Dice | Req Margin: {opt.requiredMargin}+
                      </div>
                    </button>
                  ))}
                </div>
                {selectedCalledShot && (
                  <p className="text-[11px] text-amber-300 font-mono mt-1.5 p-2 bg-amber-950/30 border border-amber-900 rounded">
                    Effect: {selectedCalledShot.effect}
                  </p>
                )}
              </div>

              {/* Execution Result Box */}
              {attackResultOutput && (
                <div className="p-3 bg-[#120a0f] border border-rose-800 rounded-lg text-rose-200 font-mono text-xs leading-relaxed animate-fade-in">
                  <p className="font-bold text-white mb-1">RESOLUTION RESULT:</p>
                  <p>{attackResultOutput}</p>
                </div>
              )}

              {/* Execute Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleExecuteAttack}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-700 to-rose-900 hover:from-red-600 hover:to-rose-800 text-white font-cinzel font-bold text-xs tracking-widest shadow-[0_0_15px_rgba(225,29,72,0.4)] transition"
                >
                  ROLL & EXECUTE ATTACK
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
