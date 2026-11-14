import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  CloudRain, 
  Sun, 
  Dices, 
  UserPlus, 
  Sparkles, 
  AlertTriangle, 
  Flame, 
  Skull, 
  Scroll, 
  Droplet, 
  Eye, 
  EyeOff, 
  Plus, 
  Swords, 
  Trash2, 
  BookOpen, 
  Zap,
  Radio,
  Crosshair,
  Volume2
} from 'lucide-react';
import { Character, GameEdition } from '../../types/vtm';
import { storageService } from '../../services/storage';
import { combatEngine } from '../../services/combatEngine';
import { tabooEngine, FRENZY_SCENARIOS } from '../../services/tabooEngine';
import { generateRandomKindred } from '../../services/npcGenerator';
import { THREAT_STAT_BLOCKS, ThreatStatBlock } from '../../data/npcStatBlocks';
import { soundEngine } from '../../services/soundEngine';

interface StorytellerScreenProps {
  edition: GameEdition;
  characters: Character[];
  onOpenCombat: () => void;
  onOpenMysteryBoard: () => void;
  onOpenDiablerie: () => void;
  onOpenBloodBond: () => void;
  onShowToast?: (title: string, desc?: string, type?: 'info' | 'blood' | 'success' | 'error') => void;
}

export const StorytellerScreen: React.FC<StorytellerScreenProps> = ({
  edition,
  characters,
  onOpenCombat,
  onOpenMysteryBoard,
  onOpenDiablerie,
  onOpenBloodBond,
  onShowToast
}) => {
  // Masquerade & Second Inquisition Threat
  const [masqueradeLevel, setMasqueradeLevel] = useState<number>(1); // 0 (Clean) to 5 (Full Breach/FIRSTLIGHT Raid)
  
  // Scene Pacing & In-Game Clock
  const [inGameTime, setInGameTime] = useState<string>('02:15 AM');
  const [hoursToSunrise, setHoursToSunrise] = useState<number>(3.5);
  const [activeWeather, setActiveWeather] = useState<string>('Freezing Rain & Heavy Mist (-1 Perception)');
  const [activeLocation, setActiveLocation] = useState<string>('Succubus Club VIP Elysium Balcony');

  // Storyteller Secret Dice Tray
  const [secretPool, setSecretPool] = useState<number>(6);
  const [secretDifficulty, setSecretDifficulty] = useState<number>(3);
  const [secretRollResult, setSecretRollResult] = useState<{ dice: number[]; successes: number; passed: boolean } | null>(null);

  // Quick Spawned NPCs
  const [quickNpcs, setQuickNpcs] = useState<Character[]>(() => [
    generateRandomKindred(edition, 'Nosferatu'),
    generateRandomKindred(edition, 'Ventrue')
  ]);

  // Handle ST Secret Dice Roll
  const handleRollSecretDice = () => {
    soundEngine.playDiceRoll();
    const roll = combatEngine.rollPool(secretPool);
    const passed = roll.successes >= secretDifficulty;
    setSecretRollResult({
      dice: roll.dice,
      successes: roll.successes,
      passed
    });
  };

  // Generate NPC
  const handleSpawnNpc = (clan?: string) => {
    soundEngine.playDiceRoll();
    const npc = generateRandomKindred(edition, clan);
    setQuickNpcs([npc, ...quickNpcs]);
    if (onShowToast) onShowToast('NPC Generated', `${npc.name} (${npc.clan}) prepared.`, 'info');
  };

  // Send NPC to Combat Ladder
  const handleSendNpcToCombat = (npc: Character) => {
    const encounters = storageService.getCombatEncounters();
    const activeEncounter = encounters[0];
    if (!activeEncounter) {
      if (onShowToast) onShowToast('No Active Combat', 'Open Tactical Combat to create an encounter first.', 'error');
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
    if (onShowToast) onShowToast('Deployed to Combat', `${npc.name} placed onto the initiative ladder.`, 'blood');
    onOpenCombat();
  };

  // Trigger Environmental Hazard
  const handleTriggerHazard = (hazardType: 'fire' | 'sunlight' | 'si_raid' | 'rotsckreck') => {
    if (hazardType === 'fire') {
      soundEngine.playFrenzyRoar();
      if (onShowToast) onShowToast('FIRE HAZARD DEPLOYED', 'Roaring flames inflict 2 Aggravated wounds/turn. Difficulty 2 Rötschreck!', 'error');
    } else if (hazardType === 'sunlight') {
      soundEngine.playFrenzyRoar();
      if (onShowToast) onShowToast('SUNLIGHT EXPOSURE', 'Lethal daylight! Inflicts 3 Aggravated wounds/turn. Blind panic Rötschreck Diff 4!', 'error');
    } else if (hazardType === 'si_raid') {
      soundEngine.playStakeImpact();
      setMasqueradeLevel(Math.min(5, masqueradeLevel + 2));
      if (onShowToast) onShowToast('SECOND INQUISITION STRIKE', 'FIRSTLIGHT tactical breaching units deployed to the scene!', 'blood');
    } else if (hazardType === 'rotsckreck') {
      soundEngine.playFrenzyRoar();
      if (onShowToast) onShowToast('RÖTSCHRECK TEST REQUIRED', 'All witnessing Kindred must roll Willpower against Red Fear!', 'error');
    }
  };

  const masqueradeDescriptions = [
    { level: 0, title: 'Absolute Shadow', effect: 'No mortal suspicion. Surveillance feeds clean. Zero SI tracking.' },
    { level: 1, title: 'Faint Whispers', effect: 'Local police rumors. Occasional Reddit video dismissed as a hoax.' },
    { level: 2, title: 'Active Inquiries', effect: 'Homicide detectives reviewing security cameras. +1 Difficulty to street feeding.' },
    { level: 3, title: 'Federal Surveillance', effect: 'FBI SAD tapped cellular towers. Unmarked vans patrolling Elysium perimeter.' },
    { level: 4, title: 'Entity Infiltration', effect: 'Vatican Inquisitors and SAD kill-teams stationed nearby. Electronic communications intercepted.' },
    { level: 5, title: 'FIRSTLIGHT Drone Purge', effect: 'Active martial cordon. Incendiary airstrikes authorized. Total Masquerade catastrophe!' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner: Master Storyteller Console */}
      <div className="bg-[#0b080e] border border-rose-950/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-950/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#211220]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 border border-rose-800 text-rose-300 uppercase tracking-widest">
                STORYTELLER OMNISCIENT SCREEN
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                CAMPAIGN MASTER CONTROL
              </span>
            </div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-white tracking-wide mt-1">
              THE STORYTELLER SCREEN
            </h1>
            <p className="text-xs text-neutral-300 font-sans mt-1">
              Real-time chronicle pacing, secret rolls, masquerade tracking, hazard generators, and instantaneous NPC deployment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenCombat}
              className="px-3.5 py-2 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 font-cinzel text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(225,29,72,0.3)] transition"
            >
              <Swords className="w-3.5 h-3.5" />
              Combat Tracker
            </button>
            <button
              type="button"
              onClick={onOpenMysteryBoard}
              className="px-3.5 py-2 rounded-lg bg-[#15101a] hover:bg-[#22172a] border border-[#2d1e38] text-neutral-200 hover:text-white font-cinzel text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Eye className="w-3.5 h-3.5 text-rose-400" />
              Mystery Pinboard
            </button>
            <button
              type="button"
              onClick={onOpenBloodBond}
              className="px-3.5 py-2 rounded-lg bg-[#15101a] hover:bg-[#22172a] border border-[#2d1e38] text-rose-300 hover:text-white font-cinzel text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Droplet className="w-3.5 h-3.5 text-rose-400" />
              Dark Taboos
            </button>
          </div>
        </div>

        {/* Panel 1: Masquerade Exposure & Second Inquisition Threat */}
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-[#0f0b14] border border-[#221424] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <h3 className="font-cinzel text-sm font-bold text-white tracking-wider">
                  MASQUERADE INTEGRITY & SI THREAT LEVEL
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                masqueradeLevel >= 4 ? 'bg-red-950 text-red-300 border border-red-700 shadow-[0_0_10px_rgba(225,29,72,0.3)]' :
                masqueradeLevel >= 2 ? 'bg-amber-950 text-amber-300 border border-amber-700 shadow-[0_0_10px_rgba(245,158,11,0.2)]' :
                'bg-[#161622] text-slate-300 border border-slate-700'
              }`}>
                LEVEL {masqueradeLevel} / 5
              </span>
            </div>

            {/* Visual Threat Meter Blocks */}
            <div className="grid grid-cols-6 gap-1.5">
              {[0, 1, 2, 3, 4, 5].map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setMasqueradeLevel(lvl)}
                  className={`
                    py-2 rounded font-mono font-bold text-xs transition cursor-pointer border
                    ${lvl <= masqueradeLevel 
                      ? lvl >= 4 ? 'bg-gradient-to-t from-red-950 to-red-800 border-red-500 text-white shadow-[0_0_12px_rgba(225,29,72,0.4)]' 
                        : lvl >= 2 ? 'bg-gradient-to-t from-amber-950 to-amber-800 border-amber-500 text-amber-100 shadow-[0_0_10px_rgba(245,158,11,0.3)]' 
                        : 'bg-gradient-to-t from-[#14141e] to-slate-800 border-slate-500 text-slate-200'
                      : 'bg-[#100d14] border-[#221728] text-neutral-600 hover:border-neutral-500'}
                  `}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="p-3 bg-[#140c1a] border border-[#22132b] rounded-lg">
              <p className="font-cinzel text-xs font-bold text-white mb-0.5">
                {masqueradeDescriptions[masqueradeLevel].title}
              </p>
              <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                {masqueradeDescriptions[masqueradeLevel].effect}
              </p>
            </div>
          </div>

          {/* Panel 2: In-Game Clock & Atmosphere */}
          <div className="bg-[#0f0b14] border border-[#221424] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <h3 className="font-cinzel text-sm font-bold text-white tracking-wider">
                  NIGHT CHRONOLOGY & WEATHER
                </h3>
              </div>
              <span className="text-xs font-mono text-rose-400 font-bold">
                {hoursToSunrise} Hours until Dawn
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Time of Night</label>
                <input
                  type="text"
                  value={inGameTime}
                  onChange={e => setInGameTime(e.target.value)}
                  className="w-full bg-[#140d1c] border border-[#291836] rounded px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Hours to Dawn ({hoursToSunrise}h)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  value={hoursToSunrise}
                  onChange={e => setHoursToSunrise(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#140d1c] border border-[#291836] rounded px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Active Atmosphere & Scene Modifiers</label>
                <input
                  type="text"
                  value={activeWeather}
                  onChange={e => setActiveWeather(e.target.value)}
                  className="w-full bg-[#140d1c] border border-[#291836] rounded px-3 py-1.5 text-neutral-200"
                />
              </div>
            </div>

            {/* Quick Environmental Hazards Buttons */}
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                INSTANT ENVIRONMENTAL HAZARDS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTriggerHazard('fire')}
                  className="px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-900 border border-amber-700 text-amber-200 font-mono text-[10px] flex items-center gap-1 transition"
                >
                  <Flame className="w-3 h-3 text-amber-400" />
                  Roaring Fire
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerHazard('sunlight')}
                  className="px-2.5 py-1 rounded bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-200 font-mono text-[10px] flex items-center gap-1 transition"
                >
                  <Sun className="w-3 h-3 text-red-400" />
                  Sunlight Crack
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerHazard('si_raid')}
                  className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-[10px] flex items-center gap-1 transition"
                >
                  <Radio className="w-3 h-3 text-rose-400" />
                  SI Tactical Raid
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerHazard('rotsckreck')}
                  className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-200 font-mono text-[10px] flex items-center gap-1 transition"
                >
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  Rötschreck Wave
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Row 2: Storyteller Secret Dice Tray & Target Difficulty Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Storyteller Secret Dice Tray */}
        <div className="bg-[#0b080e] border border-[#221424] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1b101c]">
            <div className="flex items-center gap-2">
              <Dices className="w-5 h-5 text-rose-400" />
              <h3 className="font-cinzel text-sm font-bold text-white tracking-wider">
                SECRET STORYTELLER DICE TRAY
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              Hidden from Players
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] text-neutral-400 font-mono block mb-1">Dice Pool ({secretPool})</label>
              <input
                type="number"
                min={1}
                max={15}
                value={secretPool}
                onChange={e => setSecretPool(parseInt(e.target.value) || 5)}
                className="w-full bg-[#140d1a] border border-[#2b1834] rounded px-3 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 font-mono block mb-1">Difficulty ({secretDifficulty})</label>
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

          <button
            type="button"
            onClick={handleRollSecretDice}
            className="w-full py-2.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 font-cinzel font-bold text-xs tracking-wider transition shadow-[0_0_12px_rgba(225,29,72,0.3)]"
          >
            ROLL BEHIND THE SCREEN
          </button>

          {secretRollResult && (
            <div className={`p-3 rounded-lg border font-mono text-xs ${
              secretRollResult.passed ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200' : 'bg-red-950/40 border-red-700 text-red-200'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">{secretRollResult.passed ? 'PASSED TEST' : 'FAILED TEST'}</span>
                <span>Successes: {secretRollResult.successes} / Diff: {secretDifficulty}</span>
              </div>
              <p className="text-[11px] text-neutral-400 truncate">
                Dice: [{secretRollResult.dice.join(', ')}]
              </p>
            </div>
          )}
        </div>

        {/* V5 Rules & Target Difficulty Cheat Sheet */}
        <div className="lg:col-span-2 bg-[#0b080e] border border-[#221424] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1b101c]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h3 className="font-cinzel text-sm font-bold text-white tracking-wider">
                V5 MASTER DIFFICULTY & SYSTEM CHEAT SHEET
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">Quick Reference</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 bg-[#130d18] border border-[#26172e] rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1e1524] border border-neutral-700 text-neutral-300 font-cinzel font-bold text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <span className="font-cinzel text-xs font-bold text-neutral-200 block">Routine</span>
                <span className="text-[10px] text-neutral-400 font-sans leading-tight mt-0.5 block">Driving in clear weather; casual intimidation.</span>
              </div>
            </div>
            <div className="p-3 bg-[#130d18] border border-[#26172e] rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1e1524] border border-neutral-700 text-neutral-300 font-cinzel font-bold text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <span className="font-cinzel text-xs font-bold text-neutral-200 block">Straightforward</span>
                <span className="text-[10px] text-neutral-400 font-sans leading-tight mt-0.5 block">Picking standard lock; seducing eager mortal.</span>
              </div>
            </div>
            <div className="p-3 bg-[#130d18] border border-[#26172e] rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-950/60 border border-amber-800 text-amber-300 font-cinzel font-bold text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <span className="font-cinzel text-xs font-bold text-amber-200 block">Moderate</span>
                <span className="text-[10px] text-neutral-400 font-sans leading-tight mt-0.5 block">Standard contested test; shadowing wary cop.</span>
              </div>
            </div>
            <div className="p-3 bg-[#130d18] border border-[#26172e] rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-950/60 border border-amber-800 text-amber-300 font-cinzel font-bold text-xs flex items-center justify-center shrink-0">4</span>
              <div>
                <span className="font-cinzel text-xs font-bold text-amber-200 block">Challenging</span>
                <span className="text-[10px] text-neutral-400 font-sans leading-tight mt-0.5 block">Hacking secure server; calming enraged Brujah.</span>
              </div>
            </div>
            <div className="p-3 bg-[#130d18] border border-[#26172e] rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 font-cinzel font-bold text-xs flex items-center justify-center shrink-0">5</span>
              <div>
                <span className="font-cinzel text-xs font-bold text-rose-200 block">Hard</span>
                <span className="text-[10px] text-neutral-400 font-sans leading-tight mt-0.5 block">Bypassing biometric vault; resisting Elder Dominate.</span>
              </div>
            </div>
            <div className="p-3 bg-[#130d18] border border-[#26172e] rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 font-cinzel font-bold text-xs flex items-center justify-center shrink-0">6</span>
              <div>
                <span className="font-cinzel text-xs font-bold text-rose-200 block">Very Hard</span>
                <span className="text-[10px] text-neutral-400 font-sans leading-tight mt-0.5 block">Outrunning Lupine in woods; resisting Rötschreck.</span>
              </div>
            </div>
            <div className="p-3 bg-[#130d18] border border-[#26172e] rounded-xl col-span-2 flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-red-950 border border-red-600 text-red-200 font-cinzel font-bold text-xs flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(225,29,72,0.4)]">7+</span>
              <div>
                <span className="font-cinzel text-xs font-bold text-red-300 block">Nearly Impossible</span>
                <span className="text-[10px] text-neutral-400 font-sans leading-tight mt-0.5 block">Surviving high-noon daylight; breaking 3rd drink Blood Bond without Willpower.</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1b101c] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
            <div className="p-2.5 bg-[#120a16] rounded-lg border border-[#22122a]">
              <span className="font-cinzel text-xs font-bold text-rose-300 block mb-1">Blood Surge Bonus:</span>
              <p className="text-[11px] text-neutral-300 leading-relaxed font-mono">
                Rouse Check adds dice equal to Blood Potency bonus (+1 to +5 dice to any physical/single pool).
              </p>
            </div>
            <div className="p-2.5 bg-[#120a16] rounded-lg border border-[#22122a]">
              <span className="font-cinzel text-xs font-bold text-amber-300 block mb-1">Mending Superficial Wounds:</span>
              <p className="text-[11px] text-neutral-300 leading-relaxed font-mono">
                1 Rouse Check mends 1 Superficial damage per turn (or more at high Blood Potency).
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Instant Antagonist & Threat Deployer */}
      <div className="bg-[#0b080e] border border-[#221424] rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1b101c]">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-rose-400" />
            <h3 className="font-cinzel text-sm font-bold text-white tracking-wider">
              ON-DEMAND ANTAGONIST & NPC SPAWNER
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSpawnNpc('Ventrue')}
              className="px-2.5 py-1 rounded bg-[#170f1e] hover:bg-[#251830] border border-[#2c1838] text-xs font-mono text-neutral-300"
            >
              + Ventrue
            </button>
            <button
              type="button"
              onClick={() => handleSpawnNpc('Brujah')}
              className="px-2.5 py-1 rounded bg-[#170f1e] hover:bg-[#251830] border border-[#2c1838] text-xs font-mono text-neutral-300"
            >
              + Brujah
            </button>
            <button
              type="button"
              onClick={() => handleSpawnNpc('Tremere')}
              className="px-2.5 py-1 rounded bg-[#170f1e] hover:bg-[#251830] border border-[#2c1838] text-xs font-mono text-neutral-300"
            >
              + Tremere
            </button>
            <button
              type="button"
              onClick={() => handleSpawnNpc()}
              className="px-3 py-1 rounded bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-cinzel font-bold"
            >
              Spawn Random Kindred
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickNpcs.map(npc => (
            <div
              key={npc.id}
              className="bg-[#0f0b14] border border-[#221424] hover:border-rose-900/60 rounded-xl p-4 flex flex-col justify-between transition space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-cinzel text-sm font-bold text-white">{npc.name}</h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300">
                    Clan {npc.clan}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 italic font-sans">{npc.concept}</p>
                <div className="mt-2 text-[11px] font-mono text-neutral-400 space-y-0.5">
                  <p>Gen: {npc.generation}th | Health: {npc.healthMax} | Willpower: {npc.willpowerMax}</p>
                  <p>Strength: {npc.attributes.physical.strength} | Wits: {npc.attributes.mental.wits} | Resolve: {npc.attributes.mental.resolve}</p>
                  <p className="text-rose-400 truncate">
                    Disciplines: {npc.disciplines.map(d => `${d.name} ${d.level}`).join(', ')}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1b0f1c] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleSendNpcToCombat(npc)}
                  className="px-3 py-1.5 rounded bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 font-cinzel text-xs font-bold flex items-center gap-1 transition"
                >
                  <Swords className="w-3 h-3 text-red-400" />
                  Send to Combat Ladder
                </button>
                <button
                  type="button"
                  onClick={() => setQuickNpcs(quickNpcs.filter(n => n.id !== npc.id))}
                  className="p-1.5 rounded text-neutral-500 hover:text-red-400"
                  title="Remove NPC"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
