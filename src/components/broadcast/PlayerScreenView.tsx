import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flame, 
  ShieldAlert, 
  Users, 
  Maximize2, 
  Minimize2, 
  Dices, 
  Radio, 
  Volume2, 
  VolumeX, 
  EyeOff, 
  Sun, 
  Skull, 
  AlertTriangle, 
  Sparkles, 
  Swords, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { GothicCard } from '../ui/GothicCard';
import { GothicBadge } from '../ui/GothicBadge';
import { StatPipMatrix } from '../ui/StatPipMatrix';
import { storageService } from '../../services/storage';
import { peerService } from '../../services/peerService';
import { syncEngine } from '../../services/syncEngine';
import { soundEngine } from '../../services/soundEngine';
import { ActiveScene, ThreatMatrixState } from '../../types/story';
import { CombatEncounter, Combatant } from '../../types/combat';
import { Character, RollResult } from '../../types/vtm';
import { RoomParticipant, DiceBroadcastPayload } from '../../types/network';

interface PlayerScreenViewProps {
  onExit?: () => void;
  roomCodeFromUrl?: string;
}

export const PlayerScreenView: React.FC<PlayerScreenViewProps> = ({
  onExit,
  roomCodeFromUrl
}) => {
  const [scene, setScene] = useState<ActiveScene>(storageService.getActiveScene());
  const [threat, setThreat] = useState<ThreatMatrixState>(storageService.getThreatMatrix());
  const [rollHistory, setRollHistory] = useState<RollResult[]>(storageService.getRollHistory());
  const [combatEncounters, setCombatEncounters] = useState<CombatEncounter[]>(storageService.getCombatEncounters());
  const [participants, setParticipants] = useState<RoomParticipant[]>(peerService.getParticipants());
  const [roomCode, setRoomCode] = useState<string | null>(peerService.getRoomCode());
  const [characters, setCharacters] = useState<Character[]>(storageService.getCharacters());
  
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());
  const [simulatedTime, setSimulatedTime] = useState<string>('02:45 AM');
  const [hoursUntilDawn, setHoursUntilDawn] = useState<number>(3.5);

  // Auto-connect to room if URL param provided and not already connected
  useEffect(() => {
    if (roomCodeFromUrl && !peerService.isConnected()) {
      peerService.joinRoom(roomCodeFromUrl, 'Projector Display', 'spectator');
    }
  }, [roomCodeFromUrl]);

  useEffect(() => {
    // 1. Scene updates listener
    const unsubScene = syncEngine.onSceneUpdate(newScene => {
      setScene(newScene);
    });

    // 2. Threat updates listener
    const unsubThreat = syncEngine.onThreatUpdate(newThreat => {
      setThreat(newThreat);
    });

    // 3. Public rolls listener
    const unsubRolls = syncEngine.onDiceRoll((payload: DiceBroadcastPayload) => {
      // Re-read storage history (syncEngine handles saving public rolls)
      setRollHistory(storageService.getRollHistory());
    });

    // 4. Character state changes listener
    const unsubChars = syncEngine.onCharacterUpdate(() => {
      setCharacters(storageService.getCharacters());
    });

    // 5. Peer & Room updates
    const unsubPeers = peerService.onParticipantsChange(list => {
      setParticipants(list);
    });

    const unsubConn = peerService.onConnectionChange((connected, code) => {
      setRoomCode(code);
    });

    // In-game Clock simulation ticker (advances gracefully)
    const clockInterval = setInterval(() => {
      setHoursUntilDawn(prev => Math.max(0.1, Number((prev - 0.01).toFixed(2))));
    }, 60000);

    return () => {
      unsubScene();
      unsubThreat();
      unsubRolls();
      unsubChars();
      unsubPeers();
      unsubConn();
      clearInterval(clockInterval);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const toggleAudio = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  // Find active combat encounter
  const activeEncounter = combatEncounters.find(e => e.isActive) || combatEncounters[0];
  const activeCombatant: Combatant | undefined = activeEncounter?.combatants[activeEncounter.activeCombatantIndex];

  // Zero-Spoilers Rule: Filter out any rolls marked secret
  const publicRolls = rollHistory.filter(r => !r.label.toLowerCase().includes('secret')).slice(0, 8);

  const getTensionBadge = (level: number) => {
    switch (level) {
      case 5:
        return { label: 'CRITICAL: MASQUERADE COLLAPSE', color: 'bg-red-950 text-red-200 border-red-600 animate-pulse' };
      case 4:
        return { label: 'ELEVATED: ACTIVE SI HUNT', color: 'bg-rose-950 text-rose-200 border-rose-700' };
      case 3:
        return { label: 'SUSPICION: POLICE INVOLVED', color: 'bg-amber-950 text-amber-200 border-amber-600' };
      case 2:
        return { label: 'CAUTION: SHADOWS UNSETTLED', color: 'bg-neutral-900 text-neutral-300 border-neutral-700' };
      default:
        return { label: 'TRANQUIL: NIGHT PREVAILS', color: 'bg-emerald-950/60 text-emerald-300 border-emerald-800' };
    }
  };

  const tensionBadge = getTensionBadge(scene.tension || 2);

  return (
    <div className="min-h-screen bg-[#030306] text-[#e5e7eb] flex flex-col font-sans selection:bg-rose-950 selection:text-rose-200 overflow-x-hidden">
      
      {/* Top Telemetry & Control Bar */}
      <header className="px-4 sm:px-8 py-3 bg-[#07070c]/90 border-b border-[#1b1b28] backdrop-blur-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="p-2 rounded-lg bg-[#14141e] hover:bg-[#1f1f2e] border border-[#2b2b3e] text-neutral-400 hover:text-white transition cursor-pointer"
              title="Return to Storyteller Screen"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-700 to-rose-950 border border-rose-600 flex items-center justify-center shadow-[0_0_12px_rgba(225,29,72,0.4)]">
              <Flame className="w-3.5 h-3.5 text-rose-100 fill-rose-200" />
            </div>
            <div>
              <span className="font-cinzel font-black tracking-widest text-sm text-white">
                GHOUL // SECONDARY DISPLAY
              </span>
              <span className="text-[10px] font-mono text-neutral-500 block">
                Zero-Spoilers Tabletop Broadcast
              </span>
            </div>
          </div>
        </div>

        {/* Room Nexus & Telemetry Status */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 bg-[#0e0e16] border border-[#222232] px-3 py-1.5 rounded-lg text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="text-neutral-400">CHAMBER:</span>
            <span className="font-bold text-rose-300">{roomCode || 'STANDALONE'}</span>
            <span className="text-neutral-600">|</span>
            <Users className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-300">{participants.length} Kindred</span>
          </div>

          <button
            type="button"
            onClick={toggleAudio}
            className="p-2 rounded-lg bg-[#14141e] hover:bg-[#1f1f2e] border border-[#2b2b3e] text-neutral-300 hover:text-white transition cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-[#14141e] hover:bg-[#1f1f2e] border border-[#2b2b3e] text-neutral-300 hover:text-white transition cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Broadcast Content Canvas */}
      <main className="flex-1 p-4 sm:p-8 max-w-[1800px] w-full mx-auto space-y-6">
        
        {/* ROW 1: MONUMENTAL SCENE & CHRONICLE ATMOSPHERE BANNER */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#0c0910] via-[#140e18] to-[#0c0910] border-2 border-rose-950/80 p-6 sm:p-8 shadow-2xl overflow-hidden">
          {/* Subtle Gothic Background Filigree */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-900/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            {/* Scene Narrative Information */}
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <GothicBadge
                  label={scene.sceneType.toUpperCase().replace('_', ' ')}
                  variant="gold"
                  size="md"
                />
                <span className={`text-[11px] font-cinzel font-bold px-2.5 py-1 rounded-md border tracking-wider uppercase ${tensionBadge.color}`}>
                  {tensionBadge.label}
                </span>
                {scene.resonance && scene.resonance !== 'empty' && (
                  <GothicBadge
                    label={`${scene.resonance.toUpperCase()} (${scene.resonanceIntensity})`}
                    variant="blood"
                    size="md"
                  />
                )}
              </div>

              <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-black tracking-widest text-white leading-tight">
                {scene.title}
              </h1>

              <p className="font-serif italic text-base sm:text-lg text-rose-200/80 flex items-center gap-2">
                <span>📍 {scene.location}</span>
              </p>
            </div>

            {/* In-Game Monumental Clock & Dawn Countdown */}
            <div className="flex items-center gap-4 bg-black/60 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-800 to-black border border-white/10 flex items-center justify-center text-rose-500 shadow-inner">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block">
                  IN-GAME CHRONICLE TIME
                </span>
                <span className="font-cinzel text-2xl sm:text-3xl font-black text-white tracking-widest block">
                  {simulatedTime}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300 mt-0.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>{hoursUntilDawn} Hours Until Dawn</span>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Hazards Active Notice Bar */}
          {(scene.environmentalModifiers.fireHazard || 
            scene.environmentalModifiers.surveillancePresent || 
            scene.tension >= 4) && (
            <div className="mt-6 pt-4 border-t border-rose-950/60 flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-cinzel font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Environmental Hazards:
              </span>
              {scene.environmentalModifiers.fireHazard && (
                <span className="px-2.5 py-1 rounded bg-red-950/80 border border-red-600 text-red-200 text-xs font-mono flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-red-400" /> FIRE HAZARD (Rötschreck Terror Risk)
                </span>
              )}
              {scene.environmentalModifiers.surveillancePresent && (
                <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-600 text-amber-200 text-xs font-mono flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> SURVEILLANCE & SECOND INQUISITION WIRETAPS
                </span>
              )}
              {scene.tension >= 4 && (
                <span className="px-2.5 py-1 rounded bg-rose-950/80 border border-rose-600 text-rose-200 text-xs font-mono flex items-center gap-1">
                  <Skull className="w-3.5 h-3.5 text-rose-400" /> CRITICAL MASQUERADE PROTOCOL
                </span>
              )}
            </div>
          )}
        </div>

        {/* ROW 2: ACTIVE COMBAT SPOTLIGHT & LIVE PUBLIC DICE TRAY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Active Combatant Spotlight (7 Columns) */}
          <div className="lg:col-span-7">
            <GothicCard
              variant="raised"
              ribbon="crimson"
              title={
                <div className="flex items-center gap-2">
                  <Swords className="w-5 h-5 text-rose-500" />
                  <span>TACTICAL INITIATIVE SPOTLIGHT</span>
                </div>
              }
              subtitle="Active combatant turn status, damage tolerances, and conditions"
              className="h-full"
            >
              {activeCombatant ? (
                <div className="space-y-6">
                  {/* Combatant Header & Clan */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-black/40 border border-rose-950">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-cinzel text-xl sm:text-2xl font-black text-white">
                          {activeCombatant.name}
                        </span>
                        <GothicBadge
                          label={activeCombatant.type.toUpperCase()}
                          variant={activeCombatant.type === 'pc' ? 'blood' : activeCombatant.type === 'threat' ? 'blood' : 'slate'}
                          size="sm"
                        />
                      </div>
                      <p className="text-xs font-serif italic text-rose-300 mt-0.5">
                        {activeCombatant.clan ? `Clan ${activeCombatant.clan}` : 'Antagonist'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-center px-3 py-1.5 rounded-lg bg-[#14141e] border border-[#262638]">
                        <span className="text-[10px] font-mono text-neutral-400 block uppercase">Initiative</span>
                        <span className="font-mono font-bold text-amber-300 text-lg">
                          {activeCombatant.initiativeRoll.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-center px-3 py-1.5 rounded-lg bg-[#14141e] border border-[#262638]">
                        <span className="text-[10px] font-mono text-neutral-400 block uppercase">Armor</span>
                        <span className="font-mono font-bold text-neutral-200 text-lg">
                          +{activeCombatant.armor || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Health Damage Pips */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-cinzel font-bold text-neutral-300 uppercase tracking-wider">
                        Physical Health Tracker
                      </span>
                      <span className="text-xs font-mono text-neutral-500">
                        {activeCombatant.healthDamage.filter(d => d !== 'none').length} / {activeCombatant.healthMax} Damaged
                      </span>
                    </div>
                    <div className="p-3 bg-[#0d0d14] rounded-xl border border-[#20202e]">
                      <StatPipMatrix
                        mode="damage"
                        damage={activeCombatant.healthDamage}
                        max={activeCombatant.healthMax}
                        color="blood"
                        size="lg"
                        readOnly={true}
                      />
                    </div>
                  </div>

                  {/* Willpower Pips */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-cinzel font-bold text-neutral-300 uppercase tracking-wider">
                        Willpower Reserve
                      </span>
                      <span className="text-xs font-mono text-neutral-500">
                        {activeCombatant.willpowerDamage.filter(d => d !== 'none').length} / {activeCombatant.willpowerMax} Depleted
                      </span>
                    </div>
                    <div className="p-3 bg-[#0d0d14] rounded-xl border border-[#20202e]">
                      <StatPipMatrix
                        mode="damage"
                        damage={activeCombatant.willpowerDamage}
                        max={activeCombatant.willpowerMax}
                        color="willpower"
                        size="lg"
                        readOnly={true}
                      />
                    </div>
                  </div>

                  {/* Active Status Effects */}
                  {activeCombatant.statusEffects && activeCombatant.statusEffects.length > 0 && (
                    <div>
                      <span className="text-xs font-cinzel font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                        Active Conditions & Impairments
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeCombatant.statusEffects.map((status, i) => (
                          <GothicBadge
                            key={i}
                            label={status}
                            variant="blood"
                            size="sm"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-neutral-500">
                  <ShieldAlert className="w-12 h-12 text-neutral-700 mb-3" />
                  <p className="font-cinzel text-sm text-neutral-400 tracking-wider uppercase">
                    No Active Tactical Combat Encounter
                  </p>
                  <p className="text-xs font-serif italic text-neutral-500 mt-1 max-w-sm">
                    When the Storyteller triggers initiative rounds, the active combatant spotlight will project health pips and turn order here.
                  </p>
                </div>
              )}
            </GothicCard>
          </div>

          {/* Live Public Dice Tray (5 Columns) */}
          <div className="lg:col-span-5">
            <GothicCard
              variant="raised"
              ribbon="gold"
              title={
                <div className="flex items-center gap-2">
                  <Dices className="w-5 h-5 text-amber-500" />
                  <span>LIVE PUBLIC DICE TRAY</span>
                </div>
              }
              subtitle="Synchronized party roll telemetry streamed from connected Kindred"
              className="h-full"
            >
              <div className="space-y-3">
                {publicRolls.length === 0 ? (
                  <div className="py-12 text-center text-neutral-500 font-serif italic text-xs">
                    No public dice rolls recorded yet. Rolls made by players or the Storyteller will materialize here instantaneously.
                  </div>
                ) : (
                  publicRolls.map(roll => {
                    const isCrit = roll.outcome === 'critical' || roll.outcome === 'exceptional';
                    const isMessy = roll.outcome === 'messy_critical';
                    const isBestial = roll.outcome === 'bestial_failure' || roll.outcome === 'botch';

                    return (
                      <div
                        key={roll.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isMessy
                            ? 'bg-rose-950/30 border-rose-800'
                            : isBestial
                            ? 'bg-stone-950/60 border-red-900/60'
                            : isCrit
                            ? 'bg-amber-950/30 border-amber-700/60'
                            : 'bg-[#101017] border-[#222232]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-cinzel text-xs font-bold text-neutral-200">
                            {roll.label}
                          </span>
                          <span className="font-mono text-[10px] text-neutral-500">
                            {new Date(roll.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Outcome & Successes */}
                        <div className="flex items-center justify-between text-xs mb-2">
                          <GothicBadge
                            label={
                              isMessy
                                ? 'MESSY CRITICAL'
                                : isBestial
                                ? 'BESTIAL FAILURE'
                                : isCrit
                                ? 'CRITICAL SUCCESS'
                                : roll.successes > 0
                                ? `${roll.successes} SUCCESSES`
                                : 'FAILURE'
                            }
                            variant={
                              isMessy
                                ? 'blood'
                                : isBestial
                                ? 'blood'
                                : isCrit
                                ? 'gold'
                                : 'slate'
                            }
                            size="sm"
                          />
                          <span className="font-mono text-[11px] text-neutral-400">
                            Margin: <strong className="text-white">{roll.margin >= 0 ? `+${roll.margin}` : roll.margin}</strong>
                          </span>
                        </div>

                        {/* Dice Tiles */}
                        <div className="flex flex-wrap items-center gap-1">
                          {roll.dice.map((d, i) => (
                            <span
                              key={i}
                              className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold ${
                                d === 10
                                  ? 'bg-amber-600 text-white border border-amber-300'
                                  : d >= 6
                                  ? 'bg-neutral-800 text-white border border-neutral-700'
                                  : 'bg-neutral-900 text-neutral-600 border border-neutral-800'
                              }`}
                            >
                              {d}
                            </span>
                          ))}
                          {roll.hungerDiceResults && roll.hungerDiceResults.map((d, i) => (
                            <span
                              key={`h_${i}`}
                              className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold ${
                                d === 10
                                  ? 'bg-red-600 text-white border border-red-300 shadow-[0_0_8px_rgba(225,29,72,0.6)]'
                                  : d === 1
                                  ? 'bg-red-950 text-red-300 border border-red-700'
                                  : d >= 6
                                  ? 'bg-rose-950 text-rose-200 border border-rose-800'
                                  : 'bg-black text-rose-900 border border-rose-950'
                              }`}
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </GothicCard>
          </div>
        </div>

        {/* ROW 3: MASQUERADE EXPOSURE & SECOND INQUISITION ALERT LEDGER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Masquerade Exposure Level */}
          <GothicCard
            variant="raised"
            title={
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" />
                <span>MASQUERADE EXPOSURE PROTOCOL</span>
              </div>
            }
            subtitle="Public visibility of kindred activity across mortals"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-xs font-bold text-neutral-300 uppercase">
                  Exposure Tier ({threat.masqueradeExposure} / 5)
                </span>
                <span className="font-mono text-xs text-rose-400 font-bold">
                  {threat.masqueradeExposure === 0
                    ? 'Tier 0: Immaculate Veil'
                    : threat.masqueradeExposure <= 2
                    ? 'Tier 1-2: Local Law Inquiries'
                    : 'Tier 3-5: SI Response Imminent'}
                </span>
              </div>

              {/* Exposure Pips */}
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(lvl => {
                  const isActive = lvl <= threat.masqueradeExposure;
                  return (
                    <div
                      key={lvl}
                      className={`h-4 rounded-md transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-rose-600 to-red-700 shadow-[0_0_10px_rgba(225,29,72,0.5)] border border-rose-400'
                          : 'bg-[#151520] border border-[#2b2b3e]'
                      }`}
                    />
                  );
                })}
              </div>
              <p className="text-xs font-serif italic text-neutral-400">
                Breaches require immediate cleanup by the Sheriff or Scourge before hunters triangulate haven coordinates.
              </p>
            </div>
          </GothicCard>

          {/* Second Inquisition Alert Level */}
          <GothicCard
            variant="raised"
            title={
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                <span>SECOND INQUISITION THREAT MATRIX</span>
              </div>
            }
            subtitle="FIRSTLIGHT wiretaps, drone sweeps, and hit team readiness"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-xs font-bold text-neutral-300 uppercase">
                  Alert Level ({threat.secondInquisitionAlert} / 5)
                </span>
                <span className="font-mono text-xs text-amber-400 font-bold uppercase">
                  Patrol: {threat.patrolDensity || 'Moderate'}
                </span>
              </div>

              {/* SI Alert Pips */}
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(lvl => {
                  const isActive = lvl <= threat.secondInquisitionAlert;
                  return (
                    <div
                      key={lvl}
                      className={`h-4 rounded-md transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 shadow-[0_0_10px_rgba(217,119,6,0.5)] border border-amber-400'
                          : 'bg-[#151520] border border-[#2b2b3e]'
                      }`}
                    />
                  );
                })}
              </div>
              <p className="text-xs font-serif italic text-neutral-400">
                Level 4+ alerts result in active daylight breaching raids and drone thermographic haven scans.
              </p>
            </div>
          </GothicCard>
        </div>
      </main>
    </div>
  );
};
