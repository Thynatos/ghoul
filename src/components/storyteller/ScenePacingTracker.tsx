import React, { useState } from 'react';
import { 
  Flame, 
  Sun, 
  Video, 
  Moon, 
  CloudRain, 
  Users, 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  MapPin, 
  Sparkles, 
  AlertCircle,
  Eye,
  EyeOff,
  Activity,
  Layers
} from 'lucide-react';
import { 
  ActiveScene, 
  SceneBeat, 
  SceneType, 
  TensionLevel, 
  EnvironmentalModifiers 
} from '../../types/story';
import { storyEngine } from '../../services/storyEngine';
import { GothicCard } from '../ui/GothicCard';
import { GothicButton } from '../ui/GothicButton';
import { GothicBadge } from '../ui/GothicBadge';
import { RedactedText } from '../ui/RedactedText';
import { soundEngine } from '../../services/soundEngine';

export interface ScenePacingTrackerProps {
  scene: ActiveScene;
  onUpdateScene: (scene: ActiveScene) => void;
  isStorytellerMode?: boolean;
  onShowToast?: (title: string, desc?: string, type?: 'info' | 'blood' | 'success' | 'error') => void;
}

export const ScenePacingTracker: React.FC<ScenePacingTrackerProps> = ({
  scene,
  onUpdateScene,
  isStorytellerMode = true,
  onShowToast
}) => {
  const [newBeatTitle, setNewBeatTitle] = useState('');
  const [newBeatDesc, setNewBeatDesc] = useState('');
  const [newBeatSecret, setNewBeatSecret] = useState('');
  const [showAddBeatModal, setShowAddBeatModal] = useState(false);
  const [revealAllSecrets, setRevealAllSecrets] = useState(isStorytellerMode);

  // Environmental summary calculation
  const envSummary = storyEngine.calculateEnvironmentalModifiers(scene.environmentalModifiers);

  const sceneTypes: { id: SceneType; label: string; icon: string; desc: string }[] = [
    { id: 'elysium', label: 'Elysium Court', icon: '🏛️', desc: 'No violence, high diplomacy, court boons' },
    { id: 'investigation', label: 'Investigation', icon: '🔍', desc: 'Clues, forensics, witness interrogation' },
    { id: 'social_intrigue', label: 'Social Intrigue', icon: '🍷', desc: 'Subterfuge, feeding, rumor trading' },
    { id: 'hunting', label: 'The Hunt', icon: '🩸', desc: 'Prey stalking, slaking hunger, blood resonance' },
    { id: 'combat', label: 'Deadly Combat', icon: '⚔️', desc: 'Initiative ladder, lethal frenzy, damage' },
    { id: 'haven_downtime', label: 'Haven Downtime', icon: '⚰️', desc: 'Day sleep, crafting, research, touchstones' }
  ];

  const tensionDialLabels: Record<TensionLevel, { title: string; color: string; desc: string }> = {
    1: { title: 'Shadows Quiet', color: 'from-slate-800 to-slate-900 border-slate-600', desc: 'Zero immediate danger. The masquerade is preserved.' },
    2: { title: 'Tension Brewing', color: 'from-sky-950 to-slate-800 border-sky-600', desc: 'Rival eyes watching. Heightened wariness.' },
    3: { title: 'Open Conflict', color: 'from-amber-950 to-amber-900 border-amber-500', desc: 'Supernatural manifestations. Moderate breach risk.' },
    4: { title: 'Imminent Danger', color: 'from-rose-950 to-red-900 border-rose-500', desc: 'Frenzy tests triggered! Weapons drawn, active pursuit.' },
    5: { title: 'Masquerade Collapse', color: 'from-red-950 to-rose-700 border-red-500 shadow-[0_0_15px_rgba(225,29,72,0.6)] animate-pulse', desc: 'Sirens wailing, hunters converging, total catastrophe!' }
  };

  const handleSelectSceneType = (type: SceneType) => {
    soundEngine.playDiceRoll();
    const updated = storyEngine.setSceneType(type);
    onUpdateScene(updated);
    if (onShowToast) onShowToast('Scene Type Updated', `Shifted focus to ${type.replace('_', ' ').toUpperCase()}`, 'blood');
  };

  const handleSetTension = (lvl: TensionLevel) => {
    if (lvl > scene.tension) {
      soundEngine.playHeartbeat();
    } else {
      soundEngine.playDiceRoll();
    }
    const updated = storyEngine.setTension(lvl);
    onUpdateScene(updated);
    if (onShowToast) onShowToast(`Tension Level ${lvl}`, tensionDialLabels[lvl].title, lvl >= 4 ? 'error' : 'blood');
  };

  const handleToggleBeat = (beatId: string) => {
    soundEngine.playDiceRoll();
    const updated = storyEngine.toggleSceneBeat(beatId);
    onUpdateScene(updated);
  };

  const handleToggleEnv = (key: keyof EnvironmentalModifiers) => {
    soundEngine.playDiceRoll();
    const updated = storyEngine.toggleEnvironmentalModifier(key);
    onUpdateScene(updated);
  };

  const handleCreateBeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBeatTitle.trim()) return;

    const updated = storyEngine.addSceneBeat({
      title: newBeatTitle.trim(),
      description: newBeatDesc.trim() || 'Crucial scene objective or narrative revelation.',
      isCompleted: false,
      hiddenStorytellerNotes: newBeatSecret.trim() || 'Classified Storyteller agenda notes.',
      associatedNpcIds: []
    });

    onUpdateScene(updated);
    setNewBeatTitle('');
    setNewBeatDesc('');
    setNewBeatSecret('');
    setShowAddBeatModal(false);
    if (onShowToast) onShowToast('Scene Beat Added', newBeatTitle, 'info');
  };

  const handleDeleteBeat = (beatId: string) => {
    const updated = storyEngine.removeSceneBeat(beatId);
    onUpdateScene(updated);
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Tension Clock & Scene Header */}
      <GothicCard
        variant="raised"
        ribbon={scene.tension >= 4 ? 'blood' : 'none'}
        className="space-y-4"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#211828]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 border border-rose-800 text-rose-300 uppercase tracking-widest">
                ACTIVE SCENE
              </span>
              <GothicBadge
                label={`Resonance: ${scene.resonance.toUpperCase()}`}
                category="resonance"
                size="sm"
              />
              <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-[#14141e] border border-[#232332]">
                Intensity: {scene.resonanceIntensity}
              </span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-black text-white tracking-wide">
              {scene.title}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1 font-sans">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{scene.location}</span>
            </div>
          </div>

          {/* Quick Scene Tension Dial */}
          <div className="bg-[#0b080f] border border-[#23172b] p-3 rounded-xl flex flex-col items-center gap-1.5 w-full md:w-auto">
            <div className="flex items-center justify-between w-full gap-4">
              <span className="font-cinzel text-xs font-bold text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-400" />
                TENSION CLOCK
              </span>
              <span className={`text-xs font-mono font-black ${
                scene.tension >= 4 ? 'text-red-400 animate-pulse' : 'text-amber-300'
              }`}>
                LEVEL {scene.tension} / 5
              </span>
            </div>

            {/* 5 Gothic Tension Dials */}
            <div className="grid grid-cols-5 gap-1.5 w-full">
              {([1, 2, 3, 4, 5] as TensionLevel[]).map(lvl => {
                const isSelected = lvl <= scene.tension;
                const dial = tensionDialLabels[lvl];
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleSetTension(lvl)}
                    title={`Tension ${lvl}: ${dial.title}`}
                    className={`
                      w-9 sm:w-11 h-9 rounded-lg font-mono font-bold text-xs flex flex-col items-center justify-center border transition-all duration-150 cursor-pointer
                      ${isSelected
                        ? `bg-gradient-to-t ${dial.color} text-white shadow-md scale-105 z-10`
                        : 'bg-[#121018] border-[#221c2c] text-neutral-600 hover:border-neutral-500 hover:text-neutral-300'}
                    `}
                  >
                    <span>{lvl}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-neutral-400 font-sans text-center mt-0.5">
              {tensionDialLabels[scene.tension].title} &bull; {tensionDialLabels[scene.tension].desc}
            </p>
          </div>
        </div>

        {/* Scene Type Selector Pill Ribbon */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-cinzel text-xs font-bold tracking-wider text-neutral-300 uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-rose-400" />
              SCENE CADENCE & ARCHETYPE:
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              Select to adapt dice constraints
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {sceneTypes.map(st => {
              const isActive = scene.sceneType === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleSelectSceneType(st.id)}
                  title={st.desc}
                  className={`
                    p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between
                    ${isActive
                      ? 'bg-rose-950/70 border-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.3)] scale-[1.02]'
                      : 'bg-[#0f0c16] hover:bg-[#171322] border-[#231a2c] text-neutral-300 hover:border-neutral-600'}
                  `}
                >
                  <div className="flex items-center justify-between text-base mb-1">
                    <span>{st.icon}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />}
                  </div>
                  <span className="font-cinzel text-xs font-bold leading-tight block">
                    {st.label}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-sans line-clamp-1 mt-0.5">
                    {st.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </GothicCard>

      {/* Section 2: Interactive Scene Beats & Objectives */}
      <GothicCard
        variant="default"
        title={
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-rose-400" />
            <span>SCENE BEATS & CLIMACTIC PACING</span>
          </div>
        }
        subtitle={`${scene.beats.filter(b => b.isCompleted).length} of ${scene.beats.length} beats concluded`}
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRevealAllSecrets(!revealAllSecrets)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                revealAllSecrets 
                  ? 'bg-rose-950/80 border-rose-700 text-rose-200' 
                  : 'bg-[#15121e] border-[#261f30] text-neutral-400 hover:text-white'
              }`}
              title="Toggle Reveal on Classified Storyteller Notes"
            >
              {revealAllSecrets ? <Eye className="w-3 h-3 text-rose-400" /> : <EyeOff className="w-3 h-3" />}
              <span>{revealAllSecrets ? 'Secrets Shown' : 'Secrets Masked'}</span>
            </button>

            <GothicButton
              variant="blood"
              size="sm"
              icon={Plus}
              onClick={() => setShowAddBeatModal(true)}
            >
              Add Beat
            </GothicButton>
          </div>
        }
      >
        <div className="space-y-3">
          {scene.beats.length === 0 ? (
            <p className="text-xs text-neutral-500 italic text-center py-6 font-sans">
              No beats plotted for this scene yet. Click "Add Beat" to outline narrative beats.
            </p>
          ) : (
            scene.beats.map((beat, idx) => {
              return (
                <div
                  key={beat.id}
                  className={`
                    p-3.5 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row items-start justify-between gap-3
                    ${beat.isCompleted
                      ? 'bg-[#09080d]/80 border-[#1c1824] opacity-80'
                      : 'bg-[#110d18] border-[#251a2d] hover:border-rose-900/60 shadow-md'}
                  `}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => handleToggleBeat(beat.id)}
                      className="mt-0.5 p-1 rounded hover:bg-rose-950/60 text-rose-400 transition cursor-pointer shrink-0"
                      title={beat.isCompleted ? 'Mark incomplete' : 'Mark beat completed'}
                    >
                      {beat.isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-rose-500" />
                      ) : (
                        <Square className="w-5 h-5 text-neutral-500 hover:text-neutral-300" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-neutral-500 font-bold">
                          #{idx + 1}
                        </span>
                        <h4 className={`font-cinzel text-sm font-bold tracking-wide ${
                          beat.isCompleted ? 'line-through text-neutral-500 decoration-rose-700/80 decoration-2' : 'text-white'
                        }`}>
                          {beat.title}
                        </h4>
                      </div>

                      <p className={`text-xs font-sans leading-relaxed ${
                        beat.isCompleted ? 'text-neutral-500' : 'text-neutral-300'
                      }`}>
                        {beat.description}
                      </p>

                      {/* Storyteller Hidden Notes */}
                      {beat.hiddenStorytellerNotes && (
                        <div className="pt-1.5 flex items-start gap-1.5 text-xs font-mono">
                          <span className="text-rose-400 font-bold shrink-0 text-[10px]">
                            [ST NOTE]:
                          </span>
                          <RedactedText forceRevealed={revealAllSecrets}>
                            {beat.hiddenStorytellerNotes}
                          </RedactedText>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteBeat(beat.id)}
                      className="p-1.5 rounded text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
                      title="Delete Beat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </GothicCard>

      {/* Section 3: Environmental Hazards & Real-Time Dice Penalties */}
      <GothicCard
        variant="default"
        title={
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>ENVIRONMENTAL HAZARDS & TACTICAL FIELD TRAITS</span>
          </div>
        }
        subtitle="Toggle environmental conditions to calculate live dice pool modifiers"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* Darkness */}
          <button
            type="button"
            onClick={() => handleToggleEnv('darkness')}
            className={`
              p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all duration-150 cursor-pointer
              ${scene.environmentalModifiers.darkness
                ? 'bg-slate-900 border-slate-500 text-slate-100 shadow-[0_0_10px_rgba(100,116,139,0.3)]'
                : 'bg-[#100d16] border-[#22182a] text-neutral-400 hover:border-neutral-600'}
            `}
          >
            <Moon className="w-5 h-5 text-slate-300" />
            <span className="font-cinzel text-xs font-bold">Pitch Black</span>
            <span className="text-[10px] font-mono text-neutral-400">-2 Visual / +1 Stealth</span>
          </button>

          {/* Heavy Rain / Fog */}
          <button
            type="button"
            onClick={() => handleToggleEnv('heavyRainOrFog')}
            className={`
              p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all duration-150 cursor-pointer
              ${scene.environmentalModifiers.heavyRainOrFog
                ? 'bg-sky-950/80 border-sky-500 text-sky-100 shadow-[0_0_10px_rgba(14,165,233,0.3)]'
                : 'bg-[#100d16] border-[#22182a] text-neutral-400 hover:border-neutral-600'}
            `}
          >
            <CloudRain className="w-5 h-5 text-sky-400" />
            <span className="font-cinzel text-xs font-bold">Rain & Fog</span>
            <span className="text-[10px] font-mono text-neutral-400">-1 Range / Audio Blur</span>
          </button>

          {/* Surveillance */}
          <button
            type="button"
            onClick={() => handleToggleEnv('surveillancePresent')}
            className={`
              p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all duration-150 cursor-pointer
              ${scene.environmentalModifiers.surveillancePresent
                ? 'bg-red-950 border-red-500 text-red-100 shadow-[0_0_10px_rgba(225,29,72,0.4)]'
                : 'bg-[#100d16] border-[#22182a] text-neutral-400 hover:border-neutral-600'}
            `}
          >
            <Video className="w-5 h-5 text-red-400" />
            <span className="font-cinzel text-xs font-bold">Surveillance</span>
            <span className="text-[10px] font-mono text-neutral-400">+2 Masquerade Risk</span>
          </button>

          {/* Crowded Room */}
          <button
            type="button"
            onClick={() => handleToggleEnv('crowdedRoom')}
            className={`
              p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all duration-150 cursor-pointer
              ${scene.environmentalModifiers.crowdedRoom
                ? 'bg-amber-950/80 border-amber-500 text-amber-100 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-[#100d16] border-[#22182a] text-neutral-400 hover:border-neutral-600'}
            `}
          >
            <Users className="w-5 h-5 text-amber-400" />
            <span className="font-cinzel text-xs font-bold">Mortal Crowd</span>
            <span className="text-[10px] font-mono text-neutral-400">+1 Social / High Alert</span>
          </button>

          {/* Fire Hazard */}
          <button
            type="button"
            onClick={() => handleToggleEnv('fireHazard')}
            className={`
              p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all duration-150 cursor-pointer
              ${scene.environmentalModifiers.fireHazard
                ? 'bg-gradient-to-t from-red-950 to-amber-950 border-amber-500 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse'
                : 'bg-[#100d16] border-[#22182a] text-neutral-400 hover:border-neutral-600'}
            `}
          >
            <Flame className="w-5 h-5 text-amber-400" />
            <span className="font-cinzel text-xs font-bold">Roaring Fire</span>
            <span className="text-[10px] font-mono text-neutral-400">2 Agg/turn & Rötschreck</span>
          </button>
        </div>

        {/* Environmental Penalty Summary Callout */}
        {envSummary.descriptions.length > 0 && (
          <div className="mt-4 p-3.5 bg-[#0e0914] border border-[#26152a] rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-rose-300 font-cinzel text-xs font-bold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>ACTIVE DICE MODIFIERS & RULE PENALTIES:</span>
            </div>
            <ul className="text-xs text-neutral-300 font-mono space-y-1 list-disc pl-5">
              {envSummary.descriptions.map((desc, i) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
          </div>
        )}
      </GothicCard>

      {/* Add Beat Modal / Dialog */}
      {showAddBeatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0c0c12] border border-rose-900/80 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="font-cinzel text-base font-bold text-white tracking-wider">
              CREATE NARRATIVE SCENE BEAT
            </h3>

            <form onSubmit={handleCreateBeat} className="space-y-3">
              <div>
                <label className="text-xs font-mono text-neutral-300 block mb-1">Beat Objective / Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Infiltrate the Chantry Archive"
                  value={newBeatTitle}
                  onChange={e => setNewBeatTitle(e.target.value)}
                  className="w-full bg-[#140e1a] border border-[#2a1a34] rounded-lg px-3 py-2 text-white font-sans text-xs focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-300 block mb-1">Public Narrative Description</label>
                <textarea
                  rows={2}
                  placeholder="What the players observe and experience..."
                  value={newBeatDesc}
                  onChange={e => setNewBeatDesc(e.target.value)}
                  className="w-full bg-[#140e1a] border border-[#2a1a34] rounded-lg px-3 py-2 text-white font-sans text-xs focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-rose-300 block mb-1">Classified Storyteller Notes (Masked by Default)</label>
                <textarea
                  rows={2}
                  placeholder="Secret triggers, NPC hidden motives, DC thresholds..."
                  value={newBeatSecret}
                  onChange={e => setNewBeatSecret(e.target.value)}
                  className="w-full bg-[#140e1a] border border-[#2a1a34] rounded-lg px-3 py-2 text-white font-sans text-xs focus:border-rose-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e1426]">
                <GothicButton
                  type="button"
                  variant="slate"
                  size="sm"
                  onClick={() => setShowAddBeatModal(false)}
                >
                  Cancel
                </GothicButton>
                <GothicButton
                  type="submit"
                  variant="blood"
                  size="sm"
                >
                  Commit Beat
                </GothicButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
