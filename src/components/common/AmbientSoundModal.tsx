import React, { useState } from 'react';
import { Volume2, VolumeX, CloudRain, Church, Disc, Heart, Wind, Flame, Sparkles } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface AmbientSoundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRACKS = [
  { id: 'rain', name: 'Rain & Storm', icon: CloudRain, desc: 'Distant rolling thunder & rain slicked streets' },
  { id: 'chantry', name: 'Cathedral / Chantry Drone', icon: Church, desc: 'Occult resonant choir & organ vibrations' },
  { id: 'nightclub', name: 'Underground Nightclub', icon: Disc, desc: 'Heavy muffled sub-bass & 120BPM pulse' },
  { id: 'heartbeat', name: 'Kindred Heartbeat', icon: Heart, desc: 'Tense rhythmic mortal pulse' },
  { id: 'whispers', name: 'Whispering Shadows', icon: Wind, desc: 'Spectral ethereal sweeps of the Abyss' },
  { id: 'fireplace', name: 'Haven Fireplace', icon: Flame, desc: 'Warm crackling hearth & embers' }
];

export const AmbientSoundModal: React.FC<AmbientSoundModalProps> = ({ isOpen, onClose }) => {
  const [volumes, setVolumes] = useState<Record<string, number>>({
    rain: 0,
    chantry: 0,
    nightclub: 0,
    heartbeat: 0,
    whispers: 0,
    fireplace: 0
  });
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());

  if (!isOpen) return null;

  const handleVolumeChange = (trackId: string, val: number) => {
    setVolumes(prev => ({ ...prev, [trackId]: val }));
    soundEngine.setAmbienceVolume(trackId, val);
  };

  const applyPreset = (preset: Record<string, number>) => {
    const next = { ...volumes, ...preset };
    setVolumes(next);
    Object.entries(preset).forEach(([track, vol]) => {
      soundEngine.setAmbienceVolume(track, vol);
    });
  };

  const stopAll = () => {
    const zeroes: Record<string, number> = {};
    TRACKS.forEach(t => zeroes[t.id] = 0);
    setVolumes(zeroes);
    soundEngine.stopAllAmbience();
  };

  const toggleMute = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
    if (nextMuted) {
      const zeroes: Record<string, number> = {};
      TRACKS.forEach(t => zeroes[t.id] = 0);
      setVolumes(zeroes);
    }
  };

  const activeCount = Object.values(volumes).filter(v => v > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0c0c10] border border-[#272733] rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#1c1c24]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-950/60 border border-rose-800 flex items-center justify-center text-rose-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-neutral-100 tracking-wider">
                ATMOSPHERE & SOUNDBOARD
              </h2>
              <p className="text-xs text-neutral-400">
                Procedural Web Audio ambient soundscapes for immersive play
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-md text-sm"
          >
            ✕
          </button>
        </div>

        {/* Master Controls & Presets */}
        <div className="py-4 border-b border-[#1c1c24] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition ${
                isMuted 
                  ? 'bg-rose-950/60 border-rose-700 text-rose-300' 
                  : 'bg-[#161620] border-[#2c2c3c] text-neutral-300 hover:text-white'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isMuted ? 'Unmute All' : 'Mute Audio'}
            </button>
            <button
              type="button"
              onClick={stopAll}
              disabled={activeCount === 0}
              className="px-3 py-1.5 rounded-lg border border-[#2c2c3c] bg-[#161620] hover:bg-[#20202e] text-xs text-neutral-300 disabled:opacity-40 transition"
            >
              Silence Ambience
            </button>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {activeCount} active sound{activeCount === 1 ? '' : 's'}
          </span>
        </div>

        {/* Quick Presets */}
        <div className="my-3 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => applyPreset({ rain: 0.6, fireplace: 0.4, chantry: 0, nightclub: 0, heartbeat: 0, whispers: 0 })}
            className="px-2.5 py-1 rounded bg-[#14141d] hover:bg-[#1f1f2c] border border-[#262635] text-[11px] text-neutral-300 transition"
          >
            🌧️ Rain on Haven
          </button>
          <button
            type="button"
            onClick={() => applyPreset({ chantry: 0.7, whispers: 0.3, rain: 0, fireplace: 0, nightclub: 0, heartbeat: 0 })}
            className="px-2.5 py-1 rounded bg-[#14141d] hover:bg-[#1f1f2c] border border-[#262635] text-[11px] text-neutral-300 transition"
          >
            🔮 Chantry Ritual
          </button>
          <button
            type="button"
            onClick={() => applyPreset({ nightclub: 0.8, heartbeat: 0.3, rain: 0, fireplace: 0, chantry: 0, whispers: 0 })}
            className="px-2.5 py-1 rounded bg-[#14141d] hover:bg-[#1f1f2c] border border-[#262635] text-[11px] text-neutral-300 transition"
          >
            🍸 Succubus Club VIP
          </button>
          <button
            type="button"
            onClick={() => applyPreset({ heartbeat: 0.6, whispers: 0.4, rain: 0.3, chantry: 0, fireplace: 0, nightclub: 0 })}
            className="px-2.5 py-1 rounded bg-[#14141d] hover:bg-[#1f1f2c] border border-[#262635] text-[11px] text-neutral-300 transition"
          >
            🩸 Stalking Prey
          </button>
        </div>

        {/* Tracks List */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {TRACKS.map(track => {
            const Icon = track.icon;
            const currentVol = volumes[track.id] || 0;
            return (
              <div
                key={track.id}
                className="bg-[#121217] border border-[#20202a] rounded-lg p-3 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg border ${
                    currentVol > 0 
                      ? 'bg-rose-950/70 border-rose-700 text-rose-300' 
                      : 'bg-[#181822] border-[#292938] text-neutral-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-200 truncate">{track.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{track.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-40 shrink-0">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={currentVol}
                    onChange={e => handleVolumeChange(track.id, parseFloat(e.target.value))}
                    className="w-full accent-rose-600 bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono text-xs w-8 text-right text-neutral-400">
                    {Math.round(currentVol * 100)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-[#1c1c24] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-xs font-cinzel font-bold text-rose-200 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
