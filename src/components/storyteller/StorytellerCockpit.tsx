import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  Sun, 
  Dices, 
  UserPlus, 
  Sparkles, 
  AlertTriangle, 
  Flame, 
  Skull, 
  Droplet, 
  Eye, 
  Swords, 
  Trash2, 
  BookOpen, 
  Radio, 
  Activity,
  Layers,
  ChevronRight,
  Tv,
  EyeOff
} from 'lucide-react';
import { Character, GameEdition } from '../../types/vtm';
import { ActiveScene, ThreatMatrixState } from '../../types/story';
import { storageService } from '../../services/storage';
import { storyEngine } from '../../services/storyEngine';
import { combatEngine } from '../../services/combatEngine';
import { generateRandomKindred } from '../../services/npcGenerator';
import { soundEngine } from '../../services/soundEngine';
import { syncEngine } from '../../services/syncEngine';
import { peerService } from '../../services/peerService';

// UI Primitives & Components
import { GothicCard } from '../ui/GothicCard';
import { GothicButton } from '../ui/GothicButton';
import { GothicBadge } from '../ui/GothicBadge';
import { StatPipMatrix } from '../ui/StatPipMatrix';
import { ThreatMatrixBar } from './ThreatMatrixBar';
import { ScenePacingTracker } from './ScenePacingTracker';

export interface StorytellerCockpitProps {
  edition: GameEdition;
  characters: Character[];
  onOpenCombat: () => void;
  onOpenMysteryBoard: () => void;
  onOpenDiablerie: () => void;
  onOpenBloodBond: () => void;
  onShowToast?: (title: string, desc?: string, type?: 'info' | 'blood' | 'success' | 'error') => void;
  onOpenProjector?: () => void;
  onOpenLobby?: () => void;
  onOpenWhispers?: (targetPeerId?: string) => void;
}

export const StorytellerCockpit: React.FC<StorytellerCockpitProps> = ({
  edition,
  characters,
  onOpenCombat,
  onOpenMysteryBoard,
  onOpenDiablerie,
  onOpenBloodBond,
  onShowToast,
  onOpenProjector,
  onOpenLobby,
  onOpenWhispers
}) => {
  // Story Engine Active Scene & Threat Matrix state
  const [activeScene, setActiveScene] = useState<ActiveScene>(() => storyEngine.getActiveScene());
  const [threatMatrix, setThreatMatrix] = useState<ThreatMatrixState>(() => storyEngine.getThreatMatrix());

  // In-Game Night Clock & Sunrise countdown
  const [inGameTime, setInGameTime] = useState<string>('02:15 AM');
  const [hoursToSunrise, setHoursToSunrise] = useState<number>(3.5);

  // Storyteller Secret Dice Tray
  const [secretPool, setSecretPool] = useState<number>(6);
  const [secretHunger, setSecretHunger] = useState<number>(0);
  const [secretDifficulty, setSecretDifficulty] = useState<number>(3);
  const [secretRollResult, setSecretRollResult] = useState<{
    dice: number[];
    successes: number;
    passed: boolean;
    margin: number;
    isCritical: boolean;
  } | null>(null);

  // Quick Spawned SPCs / Antagonists
  const [quickNpcs, setQuickNpcs] = useState<Character[]>(() => [
    generateRandomKindred(edition, 'Nosferatu'),
    generateRandomKindred(edition, 'Ventrue')
  ]);

  // Roll behind the screen (Secret)
  const handleRollSecretDice = () => {
    soundEngine.playDiceRoll();
    const roll = combatEngine.rollPool(secretPool);
    const passed = roll.successes >= secretDifficulty;
    const margin = roll.successes - secretDifficulty;
    setSecretRollResult({
      dice: roll.dice,
      successes: roll.successes,
      passed,
      margin,
      isCritical: roll.successes >= 4
    });
  };

  // Roll publicly to all connected Kindred & Projector
  const handleRollPublicDice = () => {
    soundEngine.playDiceRoll();
    const roll = combatEngine.rollPool(secretPool);
    const passed = roll.successes >= secretDifficulty;
    const margin = roll.successes - secretDifficulty;
    const isCrit = roll.successes >= 4;
    setSecretRollResult({
      dice: roll.dice,
      successes: roll.successes,
      passed,
      margin,
      isCritical: isCrit
    });

    const rollResult = {
      id: 'st_roll_' + Date.now(),
      edition,
      label: `Storyteller Pool (${secretPool} dice vs Diff ${secretDifficulty})`,
      poolSize: secretPool,
      hungerDice: 0,
      difficulty: secretDifficulty,
      dice: roll.dice,
      successes: roll.successes,
      margin,
      outcome: passed ? (isCrit ? 'critical' : 'success') : 'failure',
      outcomeText: passed ? `Success (+${margin} Margin)` : 'Failure',
      timestamp: Date.now()
    };

    storageService.addRoll(rollResult as any);
    const localPeer = peerService.getLocalPeer();
    syncEngine.broadcastRoll(rollResult as any, localPeer.playerName || 'Storyteller', 'Storyteller', false);
    if (onShowToast) onShowToast('Public Roll Broadcasted', `Chamber alerted to ${roll.successes} successes.`, 'info');
  };

  // Generate NPC
  const handleSpawnNpc = (clan?: string) => {
    soundEngine.playDiceRoll();
    const npc = generateRandomKindred(edition, clan);
    setQuickNpcs([npc, ...quickNpcs]);
    if (onShowToast) onShowToast('Antagonist Prepared', `${npc.name} (${npc.clan}) forged.`, 'info');
  };

  // Deploy to Tactical Combat Ladder
  const handleSendNpcToCombat = (npc: Character) => {
    const encounters = storageService.getCombatEncounters();
    const activeEncounter = encounters[0];
    if (!activeEncounter) {
      if (onShowToast) onShowToast('No Active Combat', 'Create a combat encounter in the Combat Tracker first.', 'error');
      return;
    }

    const wits = npc.attributes.mental.wits || 2;
    const awareness = npc.skills.mental.awareness || 2;
    const brawl = npc.skills.physical.brawl || 2;

    const combatant = {
      id: 'c_' + npc.id + '_' + Date.now(),
      name: npc.name,
      type: 'threat' as const,
      characterId: npc.id,
      clan: npc.clan,
      initiativeRoll: combatEngine.calculateInitiative(wits, awareness, 0),
      healthMax: npc.healthMax,
      healthDamage: [...npc.healthDamage],
      willpowerMax: npc.willpowerMax,
      willpowerDamage: [...npc.willpowerDamage],
      armor: 1,
      statusEffects: [],
      isTurn: false,
      wits,
      awareness,
      notes: `${npc.concept}. Ambition: ${npc.ambition}`,
      primaryPoolName: 'Brawl & Intimidation',
      primaryPoolValue: brawl + (npc.attributes.physical.strength || 2)
    };

    activeEncounter.combatants.push(combatant);
    storageService.saveCombatEncounter(activeEncounter);
    soundEngine.playCombatHit();
    if (onShowToast) onShowToast('Deployed to Combat Ladder', `${npc.name} added to initiative queue.`, 'blood');
    onOpenCombat();
  };

  // Trigger Environmental Hazard
  const handleTriggerHazard = (hazardType: 'fire' | 'sunlight' | 'si_raid' | 'rotsckreck') => {
    if (hazardType === 'fire') {
      soundEngine.playFrenzyRoar();
      const updated = storyEngine.toggleEnvironmentalModifier('fireHazard');
      setActiveScene(updated);
      if (onShowToast) onShowToast('ROARING FIRE DEPLOYED', 'Inflicts 2 Aggravated wounds/turn. Rötschreck Test Difficulty 3!', 'error');
    } else if (hazardType === 'sunlight') {
      soundEngine.playFrenzyRoar();
      if (onShowToast) onShowToast('LETHAL SUNLIGHT BREACH', 'Daylight burns Kindred flesh! 3 Aggravated wounds/turn. Terror Frenzy Diff 4+!', 'error');
    } else if (hazardType === 'si_raid') {
      soundEngine.playStakeImpact();
      const updatedThreat = storyEngine.setSecondInquisitionAlert(Math.min(5, threatMatrix.secondInquisitionAlert + 2));
      setThreatMatrix(updatedThreat);
      if (onShowToast) onShowToast('FIRSTLIGHT TACTICAL BREACH', 'Second Inquisition strike team descending on current haven!', 'blood');
    } else if (hazardType === 'rotsckreck') {
      soundEngine.playFrenzyRoar();
      if (onShowToast) onShowToast('RÖTSCHRECK TERROR TEST', 'All witnessing Kindred must roll Willpower vs Red Fear!', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      
      {/* Cockpit Command Station Header */}
      <div className="bg-[#0c0c12] border border-[#7f1d1d]/60 rounded-2xl p-6 sm:p-8 shadow-[0_0_35px_rgba(0,0,0,0.9),0_0_20px_rgba(225,29,72,0.15)] relative overflow-hidden">
        {/* Subtle arterial blur glow in background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-950/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#211220]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 border border-rose-800 text-rose-300 uppercase tracking-widest">
                STORYTELLER COCKPIT
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                CHRONICLE MASTER CONTROL // {edition.toUpperCase()}
              </span>
            </div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-white tracking-wider mt-1">
              THE STORYTELLER WORKSPACE
            </h1>
            <p className="text-xs text-neutral-300 font-sans mt-1">
              Consolidated real-time chronicle pacing, threat escalation meters, secret rolls, and instantaneous antagonist deployment.
            </p>
          </div>

          {/* Quick-Access Subsystem Dock */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenProjector && (
              <GothicButton
                variant="gold"
                size="sm"
                icon={Tv}
                onClick={onOpenProjector}
              >
                Projector View
              </GothicButton>
            )}
            {onOpenLobby && (
              <GothicButton
                variant="slate"
                size="sm"
                icon={Radio}
                onClick={onOpenLobby}
              >
                P2P Chamber
              </GothicButton>
            )}
            {onOpenWhispers && (
              <GothicButton
                variant="slate"
                size="sm"
                icon={Eye}
                onClick={() => onOpenWhispers()}
              >
                Whispers
              </GothicButton>
            )}
            <GothicButton
              variant="blood"
              size="sm"
              icon={Swords}
              onClick={onOpenCombat}
            >
              Tactical Combat
            </GothicButton>
            <GothicButton
              variant="slate"
              size="sm"
              icon={Eye}
              onClick={onOpenMysteryBoard}
            >
              Mystery Pinboard
            </GothicButton>
            <GothicButton
              variant="slate"
              size="sm"
              icon={Droplet}
              onClick={onOpenBloodBond}
            >
              Dark Taboos
            </GothicButton>
          </div>
        </div>

        {/* Night Chronology & Atmospheric Controls */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#09080e] border border-[#1e1526] rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <label className="text-[10px] text-neutral-400 font-mono block">Time of Night</label>
                <input
                  type="text"
                  value={inGameTime}
                  onChange={e => setInGameTime(e.target.value)}
                  className="bg-transparent text-white font-mono font-bold text-sm focus:outline-none"
                />
              </div>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase">EDT (UTC-4)</span>
          </div>

          <div className="bg-[#09080e] border border-[#1e1526] rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-rose-400" />
              <div>
                <label className="text-[10px] text-neutral-400 font-mono block">Hours to Dawn</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="12"
                  value={hoursToSunrise}
                  onChange={e => setHoursToSunrise(parseFloat(e.target.value) || 0)}
                  className="bg-transparent text-rose-300 font-mono font-bold text-sm focus:outline-none w-20"
                />
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
              hoursToSunrise <= 2 ? 'bg-red-950 text-red-300 border border-red-700 animate-pulse' : 'text-neutral-400'
            }`}>
              {hoursToSunrise <= 2 ? 'DAYLIGHT IMMINENT' : 'NIGHT ACTIVE'}
            </span>
          </div>

          {/* Instant Hazard Triggers */}
          <div className="bg-[#09080e] border border-[#1e1526] rounded-xl p-3.5 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
              TRIGGER EMERGENCY HAZARD:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleTriggerHazard('fire')}
                className="px-2 py-1 rounded bg-amber-950/70 hover:bg-amber-900 border border-amber-700 text-amber-200 font-mono text-[10px] flex items-center gap-1 transition cursor-pointer"
              >
                <Flame className="w-3 h-3 text-amber-400" />
                Fire
              </button>
              <button
                type="button"
                onClick={() => handleTriggerHazard('sunlight')}
                className="px-2 py-1 rounded bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-200 font-mono text-[10px] flex items-center gap-1 transition cursor-pointer"
              >
                <Sun className="w-3 h-3 text-red-400" />
                Sunlight
              </button>
              <button
                type="button"
                onClick={() => handleTriggerHazard('si_raid')}
                className="px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-[10px] flex items-center gap-1 transition cursor-pointer"
              >
                <Radio className="w-3 h-3 text-rose-400" />
                SI Strike
              </button>
              <button
                type="button"
                onClick={() => handleTriggerHazard('rotsckreck')}
                className="px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-200 font-mono text-[10px] flex items-center gap-1 transition cursor-pointer"
              >
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                Rötschreck
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Threat Matrix Bar (Masquerade + Second Inquisition) */}
      <ThreatMatrixBar
        threatMatrix={threatMatrix}
        onUpdateThreatMatrix={mat => {
          setThreatMatrix(mat);
          storageService.saveThreatMatrix(mat);
          syncEngine.broadcastMasquerade(mat.masqueradeExposure, mat.notes, mat.secondInquisitionAlert);
        }}
        onShowToast={onShowToast}
      />

      {/* Row 2: Master Scene Pacing Tracker (Tension Dials, Beats, Environmental Modifiers) */}
      <ScenePacingTracker
        scene={activeScene}
        onUpdateScene={sc => {
          setActiveScene(sc);
          storageService.saveActiveScene(sc);
          syncEngine.broadcastScene(sc, hoursToSunrise);
        }}
        isStorytellerMode={true}
        onShowToast={onShowToast}
      />

      {/* Row 3: Secret Dice Tray & Target Difficulty Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Storyteller Secret Dice Tray */}
        <GothicCard
          variant="raised"
          ribbon="none"
          title={
            <div className="flex items-center gap-2">
              <Dices className="w-4 h-4 text-rose-400" />
              <span>STORYTELLER DICE TRAY</span>
            </div>
          }
          subtitle="Choose private roll behind screen or public broadcast to chamber"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">
                  Dice Pool ({secretPool})
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={secretPool}
                  onChange={e => setSecretPool(parseInt(e.target.value) || 4)}
                  className="w-full bg-[#140d1a] border border-[#2b1834] rounded px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">
                  Difficulty ({secretDifficulty})
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={secretDifficulty}
                  onChange={e => setSecretDifficulty(parseInt(e.target.value) || 3)}
                  className="w-full bg-[#140d1a] border border-[#2b1834] rounded px-3 py-1.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <GothicButton
                variant="slate"
                size="md"
                icon={EyeOff}
                onClick={handleRollSecretDice}
                className="flex-1"
                title="Roll behind the screen (Private - Zero Spoilers)"
              >
                Roll Behind Screen
              </GothicButton>
              <GothicButton
                variant="blood"
                size="md"
                icon={Dices}
                onClick={handleRollPublicDice}
                className="flex-1"
                title="Broadcast roll to Chamber and Projector"
              >
                Broadcast to Table
              </GothicButton>
            </div>

            {secretRollResult && (
              <div className={`p-3.5 rounded-xl border font-mono text-xs animate-fade-in ${
                secretRollResult.passed
                  ? 'bg-emerald-950/40 border-emerald-600 text-emerald-200'
                  : 'bg-red-950/40 border-red-600 text-red-200'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold flex items-center gap-1.5 font-cinzel">
                    {secretRollResult.passed ? '✓ TEST PASSED' : '✕ TEST FAILED'}
                    {secretRollResult.isCritical && (
                      <span className="text-[9px] px-1 py-0.5 rounded bg-amber-950 border border-amber-600 text-amber-300">
                        CRITICAL
                      </span>
                    )}
                  </span>
                  <span>
                    Margin: {secretRollResult.margin >= 0 ? `+${secretRollResult.margin}` : secretRollResult.margin}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-300">
                  <p>Successes: {secretRollResult.successes} / Target: {secretDifficulty}</p>
                  <p className="text-neutral-400 mt-1 truncate">
                    Dice: [{secretRollResult.dice.join(', ')}]
                  </p>
                </div>
              </div>
            )}
          </div>
        </GothicCard>

        {/* V5 Rules & Target Difficulty Cheat Sheet */}
        <div className="lg:col-span-2">
          <GothicCard
            variant="raised"
            ribbon="none"
            title={
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>V5 MASTER DIFFICULTY & RESOLUTION MATRIX</span>
              </div>
            }
            subtitle="Target successes guide & environmental resolution metrics"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-[#0e0914] border border-[#23152a] rounded-xl flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#181120] border border-neutral-700 text-neutral-300 font-cinzel font-bold text-xs flex items-center justify-center shrink-0">1</span>
                <div>
                  <span className="font-cinzel text-xs font-bold text-neutral-200 block">Routine</span>
                  <span className="text-[10px] text-neutral-400 font-sans leading-tight mt-0.5 block">Clear weather driving; casual intimidation.</span>
                </div>
              </div>
              <div className="p-2.5 bg-[#0e0914] border border-[#23152a] rounded-xl flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#181120] border border-neutral-700 text-neutral-300 font-cinzel font-bold text-xs flex items-center justify-center shrink-0">2</span>
                <div>
                  <span className="font-cinzel text-xs font-bold text-neutral-200 block">Straightforward</span>
                  <span className="text-[10px] text-neutral-400 font-sans leading-tight mt-0.5 block">Picking standard lock; seducing mortal.</span>
                </div>
              </div>
              <div className="p-2.5 bg-[#0e0914] border border-[#23152a] rounded-xl flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-950/60 border border-amber-800 text-amber-300 font-cinzel font-bold text-xs flex items-center justify-center shrink-0">3</span>
                <div>
                  <span className="font-cinzel text-xs font-bold text-amber-200 block">Moderate</span>
                  <span className="text-[10px] text-neutral-400 font-sans leading-tight mt-0.5 block">Contested test; shadowing alert detective.</span>
                </div>
              </div>
              <div className="p-2.5 bg-[#0e0914] border border-[#23152a] rounded-xl flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-950/60 border border-amber-800 text-amber-300 font-cinzel font-bold text-xs flex items-center justify-center shrink-0">4</span>
                <div>
                  <span className="font-cinzel text-xs font-bold text-amber-200 block">Challenging</span>
                  <span className="text-[10px] text-neutral-400 font-sans leading-tight mt-0.5 block">Hacking secure server; calming raging Brujah.</span>
                </div>
              </div>
              <div className="p-2.5 bg-[#0e0914] border border-[#23152a] rounded-xl flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 font-cinzel font-bold text-xs flex items-center justify-center shrink-0">5</span>
                <div>
                  <span className="font-cinzel text-xs font-bold text-rose-200 block">Hard</span>
                  <span className="text-[10px] text-neutral-400 font-sans leading-tight mt-0.5 block">Bypassing biometric vault; Elder Dominate.</span>
                </div>
              </div>
              <div className="p-2.5 bg-[#0e0914] border border-[#23152a] rounded-xl flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 font-cinzel font-bold text-xs flex items-center justify-center shrink-0">6</span>
                <div>
                  <span className="font-cinzel text-xs font-bold text-rose-200 block">Very Hard</span>
                  <span className="text-[10px] text-neutral-400 font-sans leading-tight mt-0.5 block">Outrunning Lupine; resisting Rötschreck.</span>
                </div>
              </div>
              <div className="p-2.5 bg-[#0e0914] border border-[#23152a] rounded-xl col-span-2 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-red-950 border border-red-600 text-red-200 font-cinzel font-bold text-xs flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(225,29,72,0.4)]">7+</span>
                <div>
                  <span className="font-cinzel text-xs font-bold text-red-300 block">Nearly Impossible</span>
                  <span className="text-[10px] text-neutral-400 font-sans leading-tight mt-0.5 block">Surviving midday sun; breaking 3rd drink Blood Bond.</span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#1c1424] grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-sans">
              <div className="p-2.5 bg-[#0e0a14] rounded-lg border border-[#22132a]">
                <span className="font-cinzel text-xs font-bold text-rose-300 block mb-0.5">Blood Surge Mechanics:</span>
                <p className="text-[11px] text-neutral-300 leading-relaxed font-mono">
                  1 Rouse Check adds +1 to +5 bonus dice to any single dice pool test (based on Blood Potency).
                </p>
              </div>
              <div className="p-2.5 bg-[#0e0a14] rounded-lg border border-[#22132a]">
                <span className="font-cinzel text-xs font-bold text-amber-300 block mb-0.5">Willpower Re-Rolls:</span>
                <p className="text-[11px] text-neutral-300 leading-relaxed font-mono">
                  Spend 1 Willpower point to re-roll up to 3 regular (non-Hunger) dice on any standard action.
                </p>
              </div>
            </div>
          </GothicCard>
        </div>

      </div>

      {/* Row 4: On-Demand Antagonist & SPC Spawner */}
      <GothicCard
        variant="default"
        title={
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-rose-400" />
            <span>INSTANT ANTAGONIST & THREAT SPAWNER</span>
          </div>
        }
        subtitle="Forge adversary stat blocks on demand and inject directly into tactical encounters"
        action={
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleSpawnNpc('Ventrue')}
              className="px-2.5 py-1 rounded bg-[#160f1c] hover:bg-[#261830] border border-[#2d1b38] text-xs font-mono text-neutral-300 transition cursor-pointer"
            >
              + Ventrue
            </button>
            <button
              type="button"
              onClick={() => handleSpawnNpc('Brujah')}
              className="px-2.5 py-1 rounded bg-[#160f1c] hover:bg-[#261830] border border-[#2d1b38] text-xs font-mono text-neutral-300 transition cursor-pointer"
            >
              + Brujah
            </button>
            <button
              type="button"
              onClick={() => handleSpawnNpc('Tremere')}
              className="px-2.5 py-1 rounded bg-[#160f1c] hover:bg-[#261830] border border-[#2d1b38] text-xs font-mono text-neutral-300 transition cursor-pointer"
            >
              + Tremere
            </button>
            <GothicButton
              variant="blood"
              size="sm"
              icon={UserPlus}
              onClick={() => handleSpawnNpc()}
            >
              Spawn Random
            </GothicButton>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickNpcs.map(npc => (
            <div
              key={npc.id}
              className="bg-[#0c0c12] border border-[#201828] hover:border-rose-900/60 rounded-xl p-4 flex flex-col justify-between transition-all duration-150 space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-cinzel text-sm font-bold text-white truncate max-w-[180px]">
                    {npc.name}
                  </h4>
                  <GothicBadge
                    label={npc.clan}
                    category="clan"
                    size="sm"
                  />
                </div>
                <p className="text-xs text-neutral-300 italic font-sans">{npc.concept}</p>
                <div className="mt-2 text-[11px] font-mono text-neutral-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Gen: {npc.generation}th</span>
                    <span>Health: {npc.healthMax}</span>
                    <span>Willpower: {npc.willpowerMax}</span>
                  </div>
                  <p className="text-neutral-300">
                    Str: {npc.attributes.physical.strength} | Wits: {npc.attributes.mental.wits} | Res: {npc.attributes.mental.resolve}
                  </p>
                  <p className="text-rose-400 truncate">
                    Disciplines: {npc.disciplines.map(d => `${d.name} ${d.level}`).join(', ')}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1c1222] flex items-center justify-between gap-2">
                <GothicButton
                  variant="blood"
                  size="sm"
                  icon={Swords}
                  onClick={() => handleSendNpcToCombat(npc)}
                  className="flex-1"
                >
                  To Combat Ladder
                </GothicButton>
                <button
                  type="button"
                  onClick={() => setQuickNpcs(quickNpcs.filter(n => n.id !== npc.id))}
                  className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-rose-950/30 transition cursor-pointer"
                  title="Remove NPC"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </GothicCard>

    </div>
  );
};
