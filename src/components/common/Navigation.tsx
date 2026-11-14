import React, { useState } from 'react';
import { 
  Flame, 
  User, 
  PlusCircle, 
  Zap, 
  MapPin, 
  Dices, 
  ShieldAlert, 
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
  Link2
} from 'lucide-react';
import { GameEdition } from '../../types/vtm';

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
  onOpenBloodBond
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'sheet', label: 'Sheet', icon: User },
    { id: 'creator', label: 'Builder', icon: PlusCircle },
    { id: 'fastbuild', label: 'Fast Build', icon: Zap },
    { id: 'coterie', label: 'Coterie', icon: Users },
    { id: 'chronicle', label: 'Chronicle', icon: MapPin },
    { id: 'investigation', label: 'Mystery Board', icon: Search },
    { id: 'diceroller', label: 'Dice', icon: Dices },
    { id: 'quiz', label: 'Blood Test', icon: ShieldAlert },
    { id: 'wiki', label: 'Wiki', icon: BookOpen },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#07070a]/95 border-b border-[#1c1c24] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('sheet')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-700 to-rose-950 border border-rose-600 flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.4)] group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-rose-100 fill-rose-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-cinzel font-black tracking-widest text-lg text-white group-hover:text-rose-400 transition-colors">
                  GHOUL
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300">
                  {edition.toUpperCase()}
                </span>
              </div>
              <p className="text-[10px] font-sans text-neutral-400 tracking-tight hidden sm:block">
                Vampire: The Masquerade Suite
              </p>
            </div>
          </button>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-cinzel font-semibold tracking-wider flex items-center gap-1.5 transition-all
                  ${isActive 
                    ? 'bg-rose-950/60 border border-rose-800 text-rose-300 shadow-[0_0_12px_rgba(225,29,72,0.25)]' 
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#14141c] border border-transparent'}
                `}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-neutral-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-2">
          {/* Edition Toggle */}
          <div className="flex bg-[#121218] border border-[#232330] rounded-lg p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => onToggleEdition('v5')}
              className={`px-2 py-1 rounded font-bold transition ${
                edition === 'v5' 
                  ? 'bg-rose-900 text-white shadow-sm' 
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Vampire: The Masquerade 5th Edition"
            >
              V5
            </button>
            <button
              type="button"
              onClick={() => onToggleEdition('v20')}
              className={`px-2 py-1 rounded font-bold transition ${
                edition === 'v20' 
                  ? 'bg-rose-900 text-white shadow-sm' 
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Vampire: The Masquerade 20th Anniversary Edition"
            >
              V20
            </button>
          </div>

          {/* Tactical Combat Trigger */}
          {onOpenCombat && (
            <button
              type="button"
              onClick={onOpenCombat}
              className="p-2 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-800 text-red-300 shadow-[0_0_10px_rgba(225,29,72,0.3)] transition"
              title="Tactical Combat & Initiative Tracker"
            >
              <Swords className="w-4 h-4" />
            </button>
          )}

          {/* Dark Taboos: Blood Bond & Frenzy Matrix */}
          {onOpenBloodBond && (
            <button
              type="button"
              onClick={onOpenBloodBond}
              className="p-2 rounded-lg bg-[#140b12] hover:bg-[#20101c] border border-rose-900/60 text-rose-300 hover:text-white transition"
              title="Dark Taboos: Blood Bonds, Torpor & Frenzy Simulator"
            >
              <Link2 className="w-4 h-4" />
            </button>
          )}

          {/* Diablerie (The Amaranth) Trigger */}
          {onOpenDiablerie && (
            <button
              type="button"
              onClick={onOpenDiablerie}
              className="p-2 rounded-lg bg-neutral-950 hover:bg-red-950 border border-neutral-800 hover:border-red-700 text-neutral-400 hover:text-red-300 transition"
              title="The Amaranth: Diablerie Simulator"
            >
              <Skull className="w-4 h-4" />
            </button>
          )}

          {/* Blood Resonance Hunting Trigger */}
          <button
            type="button"
            onClick={onOpenResonance}
            className="p-2 rounded-lg bg-[#121218] hover:bg-[#1c1c24] border border-[#232330] text-rose-400 hover:text-rose-300 transition"
            title="Blood Resonance & Vessel Hunting Roller"
          >
            <Droplet className="w-4 h-4 fill-rose-500/40" />
          </button>

          {/* Ambience Soundboard Trigger */}
          <button
            type="button"
            onClick={onOpenSoundboard}
            className="p-2 rounded-lg bg-[#121218] hover:bg-[#1c1c24] border border-[#232330] text-neutral-300 hover:text-rose-400 transition"
            title="Atmospheric Ambient Soundboard"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Quick Dice Trigger */}
          <button
            type="button"
            onClick={onOpenDice}
            className="p-2 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-300 shadow-[0_0_10px_rgba(225,29,72,0.3)] transition"
            title="Quick Dice Roller"
          >
            <Dices className="w-4 h-4" />
          </button>

          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#121218] hover:bg-[#1a1a24] border border-[#232330] text-xs text-neutral-400 hover:text-neutral-200 transition"
            title="Search & Command Palette"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] bg-neutral-900 px-1 py-0.5 rounded border border-neutral-700 text-neutral-400">
              Ctrl+K
            </span>
          </button>

          {/* Export / Backup */}
          <div className="hidden lg:flex items-center gap-1 border-l border-[#22222e] pl-2">
            <button
              type="button"
              onClick={onExportBackup}
              className="p-2 rounded-lg bg-[#121218] hover:bg-[#1a1a24] border border-[#232330] text-neutral-400 hover:text-white transition"
              title="Export Full Backup (JSON)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onImportBackup}
              className="p-2 rounded-lg bg-[#121218] hover:bg-[#1a1a24] border border-[#232330] text-neutral-400 hover:text-white transition"
              title="Import Backup (JSON)"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#121218] border border-[#232330] text-neutral-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0e] border-b border-[#20202c] px-4 py-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full px-3 py-2 rounded-lg text-sm font-cinzel font-semibold tracking-wider flex items-center gap-2.5 text-left transition
                  ${isActive 
                    ? 'bg-rose-950/70 border border-rose-800 text-rose-300' 
                    : 'text-neutral-400 hover:text-white hover:bg-[#14141c]'}
                `}
              >
                <Icon className="w-4 h-4 text-rose-500" />
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#1c1c24] flex flex-wrap items-center justify-between gap-1 text-xs text-neutral-400">
            {onOpenCombat && (
              <button
                type="button"
                onClick={() => { onOpenCombat(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1 py-1.5 px-2.5 rounded bg-red-950/60 border border-red-800 text-red-200"
              >
                <Swords className="w-3.5 h-3.5 text-red-400" /> Combat
              </button>
            )}
            {onOpenBloodBond && (
              <button
                type="button"
                onClick={() => { onOpenBloodBond(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1 py-1.5 px-2.5 rounded bg-[#160c14] border border-rose-900 text-rose-300"
              >
                <Link2 className="w-3.5 h-3.5" /> Bonds
              </button>
            )}
            {onOpenDiablerie && (
              <button
                type="button"
                onClick={() => { onOpenDiablerie(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1 py-1.5 px-2.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300"
              >
                <Skull className="w-3.5 h-3.5 text-neutral-400" /> Diablerie
              </button>
            )}
            <button
              type="button"
              onClick={() => { onOpenResonance(); setMobileMenuOpen(false); }}
              className="flex items-center gap-1.5 py-1.5 px-2.5 rounded bg-[#161622] text-rose-300"
            >
              <Droplet className="w-3.5 h-3.5" /> Resonance
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
