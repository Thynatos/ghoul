import React, { useState, useEffect } from 'react';
import { Character, GameEdition } from './types/vtm';
import { storageService } from './services/storage';
import { soundEngine } from './services/soundEngine';

// Components
import { Navigation } from './components/common/Navigation';
import { CommandPalette } from './components/common/CommandPalette';
import { AmbientSoundModal } from './components/common/AmbientSoundModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { CharacterSheet } from './components/sheet/CharacterSheet';
import { CharacterBuilder } from './components/creator/CharacterBuilder';
import { FastBuildView } from './components/fastbuild/FastBuildView';
import { ChronicleManager } from './components/chronicle/ChronicleManager';
import { DiceRollerDrawer } from './components/dice/DiceRollerDrawer';
import { ClanQuizView } from './components/quiz/ClanQuizView';
import { CompendiumWiki } from './components/wiki/CompendiumWiki';

export const App: React.FC = () => {
  const [edition, setEdition] = useState<GameEdition>(storageService.getEdition());
  const [view, setView] = useState<string>('sheet');
  const [characters, setCharacters] = useState<Character[]>(storageService.getCharacters());
  const [activeCharacterId, setActiveCharacterId] = useState<string>(
    storageService.getActiveCharacterId() || characters[0]?.id || ''
  );

  // Modals & Drawers
  const [diceDrawerOpen, setDiceDrawerOpen] = useState(false);
  const [soundboardOpen, setSoundboardOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Primed roll request from sheet
  const [primedRoll, setPrimedRoll] = useState<{ pool: number; label: string; hunger?: number } | null>(null);

  // Ensure active character matches edition or fallback
  const activeCharacter = characters.find(c => c.id === activeCharacterId) || characters[0];

  const showToast = (title: string, description?: string, type: ToastMessage['type'] = 'info') => {
    const newToast: ToastMessage = {
      id: 'toast_' + Date.now() + Math.random(),
      title,
      description,
      type
    };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4000);
  };

  const handleSelectCharacter = (id: string) => {
    setActiveCharacterId(id);
    storageService.setActiveCharacterId(id);
    const char = characters.find(c => c.id === id);
    if (char && char.edition !== edition) {
      setEdition(char.edition);
      storageService.setEdition(char.edition);
    }
  };

  const handleToggleEdition = (newEdition: GameEdition) => {
    setEdition(newEdition);
    storageService.setEdition(newEdition);
    showToast(`Switched to ${newEdition.toUpperCase()} rules`, `Probability engine updated to Vampire: The Masquerade ${newEdition.toUpperCase()}`, 'blood');
  };

  const handleUpdateCharacter = (updated: Character) => {
    storageService.saveCharacter(updated);
    setCharacters(storageService.getCharacters());
    showToast('Character Updated', `${updated.name}'s dossier was saved.`, 'success');
  };

  const handleDeleteCharacter = (id: string) => {
    storageService.deleteCharacter(id);
    const updated = storageService.getCharacters();
    setCharacters(updated);
    if (activeCharacterId === id && updated.length > 0) {
      setActiveCharacterId(updated[0].id);
      storageService.setActiveCharacterId(updated[0].id);
    }
    showToast('Character Deleted', 'Dossier permanently purged.', 'error');
  };

  const handleDuplicateCharacter = (char: Character) => {
    const clone: Character = {
      ...char,
      id: 'char_' + Date.now(),
      name: `${char.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    storageService.saveCharacter(clone);
    setCharacters(storageService.getCharacters());
    setActiveCharacterId(clone.id);
    showToast('Character Cloned', `Duplicate created as ${clone.name}`, 'info');
  };

  const handleLaunchRoll = (pool: number, label: string, hunger?: number) => {
    setPrimedRoll({ pool, label, hunger });
    setDiceDrawerOpen(true);
  };

  const handleRouseCheck = () => {
    // If active character has hunger, test rouse
    if (activeCharacter && activeCharacter.edition === 'v5') {
      const die = Math.floor(Math.random() * 10) + 1;
      const success = die >= 6;
      if (success) {
        soundEngine.playRouseSuccess();
        showToast('Rouse Check Succeeded!', `Rolled a ${die}. Hunger remains at ${activeCharacter.hunger}.`, 'blood');
      } else {
        soundEngine.playRouseFail();
        const currentHunger = activeCharacter.hunger || 0;
        const nextHunger = Math.min(5, currentHunger + 1);
        handleUpdateCharacter({ ...activeCharacter, hunger: nextHunger });
        showToast('Rouse Check Failed!', `Rolled a ${die}. Hunger increased to ${nextHunger}!`, 'error');
      }
    }
  };

  const handleExportBackup = () => {
    const jsonStr = storageService.exportBackupJSON();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonStr);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `GHOUL_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Data Export Complete', 'All chronicles, characters, pins, and logs backed up.', 'success');
  };

  const handleImportBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (re: any) => {
        const success = storageService.importBackupJSON(re.target.result);
        if (success) {
          setCharacters(storageService.getCharacters());
          showToast('Data Restored Successfully', 'Backup imported cleanly.', 'success');
        } else {
          showToast('Import Failed', 'Invalid JSON backup format.', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e7eb] flex flex-col font-sans selection:bg-rose-950 selection:text-rose-200">
      {/* Top Global Navigation */}
      <Navigation
        currentView={view}
        onNavigate={v => setView(v)}
        edition={edition}
        onToggleEdition={handleToggleEdition}
        onOpenSoundboard={() => setSoundboardOpen(true)}
        onOpenDice={() => {
          setPrimedRoll(null);
          setDiceDrawerOpen(true);
        }}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {view === 'sheet' && activeCharacter && (
          <CharacterSheet
            character={activeCharacter}
            allCharacters={characters}
            onSelectCharacter={handleSelectCharacter}
            onUpdateCharacter={handleUpdateCharacter}
            onDeleteCharacter={handleDeleteCharacter}
            onDuplicateCharacter={handleDuplicateCharacter}
            onLaunchRoll={handleLaunchRoll}
            onRouseCheck={handleRouseCheck}
          />
        )}

        {view === 'creator' && (
          <CharacterBuilder
            edition={edition}
            onSaveCharacter={newChar => {
              storageService.saveCharacter(newChar);
              setCharacters(storageService.getCharacters());
              setActiveCharacterId(newChar.id);
              setView('sheet');
              showToast('Kindred Created', `${newChar.name} has been forged in the blood.`, 'success');
            }}
            onCancel={() => setView('sheet')}
          />
        )}

        {view === 'fastbuild' && (
          <FastBuildView
            edition={edition}
            onSelectCharacter={newChar => {
              storageService.saveCharacter(newChar);
              setCharacters(storageService.getCharacters());
              setActiveCharacterId(newChar.id);
            }}
            onNavigateView={setView}
          />
        )}

        {view === 'chronicle' && (
          <ChronicleManager
            edition={edition}
            onLaunchRoll={(pool, label) => handleLaunchRoll(pool, label)}
          />
        )}

        {view === 'diceroller' && (
          <DiceRollerDrawer
            isOpen={true}
            edition={edition}
            isFullScreen={true}
            onRouseCheckResult={success => {
              if (activeCharacter && activeCharacter.edition === 'v5' && !success) {
                const cur = activeCharacter.hunger || 0;
                handleUpdateCharacter({ ...activeCharacter, hunger: Math.min(5, cur + 1) });
              }
            }}
          />
        )}

        {view === 'quiz' && (
          <ClanQuizView
            onSpawnCharacterWithClan={clanName => {
              setView('fastbuild');
              showToast('Blood Affinity Locked', `Initiating archetype for Clan ${clanName}`, 'blood');
            }}
          />
        )}

        {view === 'wiki' && (
          <CompendiumWiki />
        )}
      </main>

      {/* Global Drawers & Modals */}
      {diceDrawerOpen && (
        <DiceRollerDrawer
          isOpen={diceDrawerOpen}
          onClose={() => setDiceDrawerOpen(false)}
          edition={edition}
          initialPool={primedRoll?.pool || 4}
          initialHunger={primedRoll?.hunger || (activeCharacter?.hunger || 0)}
          initialLabel={primedRoll?.label || 'Custom Roll'}
          isFullScreen={false}
          onRouseCheckResult={success => {
            if (activeCharacter && activeCharacter.edition === 'v5' && !success) {
              const cur = activeCharacter.hunger || 0;
              handleUpdateCharacter({ ...activeCharacter, hunger: Math.min(5, cur + 1) });
            }
          }}
        />
      )}

      <AmbientSoundModal
        isOpen={soundboardOpen}
        onClose={() => setSoundboardOpen(false)}
      />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        characters={characters}
        onSelectCharacter={handleSelectCharacter}
        onNavigateView={setView}
        onOpenDice={() => setDiceDrawerOpen(true)}
        onOpenSoundboard={() => setSoundboardOpen(true)}
        onToggleEdition={handleToggleEdition}
      />

      <ToastContainer
        toasts={toasts}
        onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))}
      />

      {/* Footer */}
      <footer className="border-t border-[#181822] py-6 px-4 text-center text-xs text-neutral-400 no-print">
        <p className="font-cinzel text-neutral-300">
          GHOUL // Vampire: The Masquerade Digital Suite
        </p>
        <p className="text-[11px] text-neutral-400 mt-1">
          Designed for personal tabletop chronicle management, dice rolling, and character creation.
        </p>
      </footer>
    </div>
  );
};
