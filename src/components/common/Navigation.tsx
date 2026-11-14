import React, { useState, useRef, useEffect } from 'react';
import { 
  Flame, 
  User, 
  MapPin, 
  Dices, 
  BookOpen, 
  Volume2, 
  Search, 
  Download, 
  Upload, 
  Droplet, 
  Menu, 
  X, 
  Swords, 
  Users, 
  Skull, 
  Link2,
  Crown,
  Sparkles,
  Settings,
  ChevronDown,
  Radio,
  Tv,
  Eye
} from 'lucide-react';
import { GameEdition } from '../../types/vtm';
import { ConnectedPeersBadge } from '../network/ConnectedPeersBadge';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  edition: GameEdition;
  onToggleEdition: (ed: GameEdition) => void;
  onOpenSoundboard: () => void;
  onOpenDice: () => void;
  onOpenResonance: () => void;
  onOpenCommandPalette: () => void;
  onExportBackup: () => void;
  onImportBackup: () => void;
  onOpenCombat?: () => void;
  onOpenDiablerie?: () => void;
  onOpenBloodBond?: () => void;
  onOpenLobby?: () => void;
  onOpenWhispers?: () => void;
  onOpenProjector?: () => void;
  unreadWhispersCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  edition,
  onToggleEdition,
  onOpenSoundboard,
  onOpenDice,
  onOpenResonance,
  onOpenCommandPalette,
  onExportBackup,
  onImportBackup,
  onOpenCombat,
  onOpenDiablerie,
  onOpenBloodBond,
  onOpenLobby,
  onOpenWhispers,
  onOpenProjector,
  unreadWhispersCount = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [arsenalOpen, setArsenalOpen] = useState(false);
  const [systemOpen, setSystemOpen] = useState(false);

  const arsenalRef = useRef<HTMLDivElement>(null);
  const systemRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (arsenalRef.current && !arsenalRef.current.contains(e.target as Node)) {
        setArsenalOpen(false);
      }
      if (systemRef.current && !systemRef.current.contains(e.target as Node)) {
        setSystemOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Focused primary navigation tabs
  const primaryNavItems = [
    { id: 'sheet', label: 'Dossier', icon: User },
    { id: 'coterie', label: 'Coterie', icon: Users },
    { id: 'chronicle', label: 'Chronicle', icon: MapPin },
    { id: 'investigation', label: 'Mystery Board', icon: Search },
    { id: 'st_screen', label: 'Storyteller Cockpit', icon: Crown, isSpecial: true },
    { id: 'wiki', label: 'Compendium', icon: BookOpen },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#060609]/95 border-b border-[#1b1b26] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('sheet')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-700 to-rose-950 border border-rose-600 flex items-center justify-center shadow-[0_0_12px_rgba(225,29,72,0.4)] group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 text-rose-100 fill-rose-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-cinzel font-black tracking-widest text-base sm:text-lg text-white group-hover:text-rose-400 transition-colors">
                  GHOUL
                </span>
                <span className="text-[9px] font-mono font-bold px-1 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300">
                  {edition.toUpperCase()}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Desktop Primary Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {primaryNavItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-cinzel font-semibold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer
                  ${isActive 
                    ? item.isSpecial 
                      ? 'bg-amber-950/70 border border-amber-600 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'bg-rose-950/70 border border-rose-800 text-rose-200 shadow-[0_0_10px_rgba(225,29,72,0.25)]'
                    : item.isSpecial
                      ? 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-950/30 border border-amber-900/40'
                      : 'text-neutral-400 hover:text-neutral-100 hover:bg-[#14141e] border border-transparent'}
                `}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? (item.isSpecial ? 'text-amber-300' : 'text-rose-400') : (item.isSpecial ? 'text-amber-400/70' : 'text-neutral-500')}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right-Side Storyteller & Utility Dock */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Connected P2P Peers Dock Badge */}
          {onOpenLobby && (
            <ConnectedPeersBadge onOpenLobby={onOpenLobby} />
          )}

          {/* Telepathic Whispers Drawer Trigger */}
          {onOpenWhispers && (
            <button
              type="button"
              onClick={onOpenWhispers}
              className="relative p-2 rounded-lg bg-[#14141e] hover:bg-purple-950/50 border border-[#262638] hover:border-purple-800 text-purple-300 transition cursor-pointer shadow-sm"
              title="Telepathic Whispers (Auspex/Dominate)"
            >
              <Eye className="w-4 h-4" />
              {unreadWhispersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-ping-glow shadow-[0_0_8px_rgba(225,29,72,0.8)]">
                  {unreadWhispersCount}
                </span>
              )}
            </button>
          )}

          {/* Dual-Screen / Projector View Trigger */}
          {onOpenProjector && (
            <button
              type="button"
              onClick={onOpenProjector}
              className="p-2 rounded-lg bg-[#14141e] hover:bg-amber-950/50 border border-[#262638] hover:border-amber-700 text-amber-300 transition cursor-pointer shadow-sm hidden sm:flex items-center"
              title="Open Projector / Player Clean Screen"
            >
              <Tv className="w-4 h-4" />
            </button>
          )}

          {/* Tactical Combat Trigger */}
          {onOpenCombat && (
            <button
              type="button"
              onClick={onOpenCombat}
              className="px-2.5 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 font-cinzel text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(225,29,72,0.3)] transition cursor-pointer"
              title="Tactical Combat & Initiative Tracker"
            >
              <Swords className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Combat</span>
            </button>
          )}

          {/* Quick Dice Roller */}
          <button
            type="button"
            onClick={onOpenDice}
            className="p-2 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-300 shadow-[0_0_8px_rgba(225,29,72,0.3)] transition cursor-pointer"
            title="Quick Dice Roller"
          >
            <Dices className="w-4 h-4" />
          </button>

          {/* Storyteller Arsenal Dropdown (Dark Taboos, Resonance, Soundboard, Command Palette) */}
          <div className="relative" ref={arsenalRef}>
            <button
              type="button"
              onClick={() => { setArsenalOpen(!arsenalOpen); setSystemOpen(false); }}
              className={`p-2 rounded-lg border flex items-center gap-1 transition cursor-pointer ${
                arsenalOpen 
                  ? 'bg-rose-950/60 border-rose-700 text-rose-200' 
                  : 'bg-[#121218] hover:bg-[#1a1a24] border-[#242434] text-neutral-300 hover:text-white'
              }`}
              title="Storyteller Arsenal & Auxiliary Tools"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <ChevronDown className="w-3 h-3 text-neutral-400 hidden sm:block" />
            </button>

            {arsenalOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-[#0e0a12] border border-rose-900/60 rounded-xl p-1.5 shadow-2xl z-50 animate-fade-in font-cinzel text-xs"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono text-neutral-500 uppercase border-b border-[#201524] mb-1">
                  STORYTELLER ARSENAL
                </div>

                {onOpenWhispers && (
                  <button
                    type="button"
                    onClick={() => { onOpenWhispers(); setArsenalOpen(false); }}
                    className="w-full px-3 py-2 rounded-lg text-left text-purple-300 hover:text-white hover:bg-purple-950/60 flex items-center gap-2 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    Telepathic Whispers
                  </button>
                )}

                {onOpenProjector && (
                  <button
                    type="button"
                    onClick={() => { onOpenProjector(); setArsenalOpen(false); }}
                    className="w-full px-3 py-2 rounded-lg text-left text-amber-300 hover:text-white hover:bg-amber-950/60 flex items-center gap-2 transition cursor-pointer"
                  >
                    <Tv className="w-3.5 h-3.5 text-amber-400" />
                    Projector / Player Screen
                  </button>
                )}

                {onOpenLobby && (
                  <button
                    type="button"
                    onClick={() => { onOpenLobby(); setArsenalOpen(false); }}
                    className="w-full px-3 py-2 rounded-lg text-left text-neutral-200 hover:text-white hover:bg-[#1c1424] flex items-center gap-2 transition cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5 text-rose-400" />
                    P2P Tabletop Lobby
                  </button>
                )}

                <div className="pt-1 mt-1 border-t border-[#201524]">
                  <button
                    type="button"
                    onClick={() => { if (onOpenBloodBond) onOpenBloodBond(); setArsenalOpen(false); }}
                    className="w-full px-3 py-2 rounded-lg text-left text-neutral-200 hover:text-white hover:bg-rose-950/60 flex items-center gap-2 transition cursor-pointer"
                  >
                    <Link2 className="w-3.5 h-3.5 text-rose-400" />
                    Blood Bonds & Torpor
                  </button>

                  <button
                    type="button"
                    onClick={() => { if (onOpenDiablerie) onOpenDiablerie(); setArsenalOpen(false); }}
                    className="w-full px-3 py-2 rounded-lg text-left text-red-300 hover:text-white hover:bg-red-950/80 flex items-center gap-2 transition cursor-pointer"
                  >
                    <Skull className="w-3.5 h-3.5 text-red-400" />
                    The Amaranth (Diablerie)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => { onOpenResonance(); setArsenalOpen(false); }}
                  className="w-full px-3 py-2 rounded-lg text-left text-neutral-200 hover:text-white hover:bg-[#1c1424] flex items-center gap-2 transition cursor-pointer"
                >
                  <Droplet className="w-3.5 h-3.5 text-rose-400" />
                  Blood Resonance & Hunting
                </button>

                <button
                  type="button"
                  onClick={() => { onOpenSoundboard(); setArsenalOpen(false); }}
                  className="w-full px-3 py-2 rounded-lg text-left text-neutral-200 hover:text-white hover:bg-[#1c1424] flex items-center gap-2 transition cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-neutral-400" />
                  Atmosphere Soundboard
                </button>

                <div className="pt-1 mt-1 border-t border-[#201524]">
                  <button
                    type="button"
                    onClick={() => { onOpenCommandPalette(); setArsenalOpen(false); }}
                    className="w-full px-3 py-2 rounded-lg text-left text-neutral-400 hover:text-white hover:bg-[#1c1424] flex items-center justify-between transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Search className="w-3.5 h-3.5" />
                      Command Palette
                    </span>
                    <span className="font-mono text-[9px] bg-black/60 px-1 py-0.5 rounded border border-neutral-700">Ctrl+K</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* System & Settings Menu */}
          <div className="relative" ref={systemRef}>
            <button
              type="button"
              onClick={() => { setSystemOpen(!systemOpen); setArsenalOpen(false); }}
              className={`p-2 rounded-lg border transition cursor-pointer ${
                systemOpen 
                  ? 'bg-neutral-800 border-neutral-600 text-white' 
                  : 'bg-[#121218] hover:bg-[#1a1a24] border-[#242434] text-neutral-400 hover:text-white'
              }`}
              title="System Settings, Rules & Backups"
            >
              <Settings className="w-4 h-4" />
            </button>

            {systemOpen && (
              <div 
                className="absolute right-0 mt-2 w-52 bg-[#0d0d14] border border-[#26263a] rounded-xl p-2 shadow-2xl z-50 animate-fade-in font-sans text-xs"
              >
                <div className="px-2 py-1 text-[10px] font-mono text-neutral-400 uppercase border-b border-[#1c1c28] mb-2 font-bold">
                  RULES EDITION & CAMPAIGN
                </div>

                {/* Edition Switcher */}
                <div className="flex bg-[#14141e] border border-[#272738] rounded-lg p-1 text-xs font-mono mb-2">
                  <button
                    type="button"
                    onClick={() => onToggleEdition('v5')}
                    className={`flex-1 py-1 text-center rounded font-bold cursor-pointer transition ${
                      edition === 'v5' 
                        ? 'bg-rose-900 text-white shadow-sm' 
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    V5 (5th Ed)
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleEdition('v20')}
                    className={`flex-1 py-1 text-center rounded font-bold cursor-pointer transition ${
                      edition === 'v20' 
                        ? 'bg-rose-900 text-white shadow-sm' 
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    V20 (20th)
                  </button>
                </div>

                {/* Backup & Restore */}
                <button
                  type="button"
                  onClick={() => { onExportBackup(); setSystemOpen(false); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-neutral-300 hover:text-white hover:bg-[#1b1b28] flex items-center gap-2 transition cursor-pointer mb-1"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-400" />
                  Export Campaign Backup
                </button>
                <button
                  type="button"
                  onClick={() => { onImportBackup(); setSystemOpen(false); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-neutral-300 hover:text-white hover:bg-[#1b1b28] flex items-center gap-2 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-neutral-400" />
                  Restore from JSON
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#121218] border border-[#242434] text-neutral-300 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0f] border-b border-[#20202c] px-4 py-3 space-y-1.5 animate-fade-in shadow-2xl">
          {primaryNavItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full px-3 py-2.5 rounded-lg text-xs font-cinzel font-semibold tracking-wider flex items-center gap-2.5 text-left transition cursor-pointer
                  ${isActive 
                    ? item.isSpecial 
                      ? 'bg-amber-950/70 border border-amber-600 text-amber-200' 
                      : 'bg-rose-950/70 border border-rose-800 text-rose-200'
                    : 'text-neutral-400 hover:text-white hover:bg-[#14141c]'}
                `}
              >
                <Icon className={`w-4 h-4 ${item.isSpecial ? 'text-amber-400' : 'text-rose-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-[#1c1c24] flex flex-wrap items-center justify-between gap-1 text-xs text-neutral-400">
            {onOpenLobby && (
              <button
                type="button"
                onClick={() => { onOpenLobby(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-200 cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5 text-rose-400" /> P2P Chamber
              </button>
            )}
            {onOpenWhispers && (
              <button
                type="button"
                onClick={() => { onOpenWhispers(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-purple-950/40 border border-purple-900/60 text-purple-200 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-purple-400" /> Whispers
              </button>
            )}
            {onOpenProjector && (
              <button
                type="button"
                onClick={() => { onOpenProjector(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-950/40 border border-amber-900/60 text-amber-200 cursor-pointer"
              >
                <Tv className="w-3.5 h-3.5 text-amber-400" /> Projector
              </button>
            )}
            {onOpenCombat && (
              <button
                type="button"
                onClick={() => { onOpenCombat(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-red-950/70 border border-red-800 text-red-200 cursor-pointer"
              >
                <Swords className="w-3.5 h-3.5 text-red-400" /> Combat
              </button>
            )}
            <button
              type="button"
              onClick={() => { onExportBackup(); setMobileMenuOpen(false); }}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#161622] text-neutral-300 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Backup
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
