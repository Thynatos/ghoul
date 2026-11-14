import React, { useState, useEffect } from 'react';
import { Character, GameEdition } from './types/vtm';
import { storageService } from './services/storage';
import { soundEngine } from './services/soundEngine';
import { peerService } from './services/peerService';
import { syncEngine } from './services/syncEngine';

// Components
import { Navigation } from './components/common/Navigation';
import { CommandPalette } from './components/common/CommandPalette';
import { AmbientSoundModal } from './components/common/AmbientSoundModal';
import { ResonanceRollerModal } from './components/resonance/ResonanceRollerModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { CharacterSheet } from './components/sheet/CharacterSheet';
import { CharacterBuilder } from './components/creator/CharacterBuilder';
import { FastBuildView } from './components/fastbuild/FastBuildView';
import { ChronicleManager } from './components/chronicle/ChronicleManager';
import { DiceRollerDrawer } from './components/dice/DiceRollerDrawer';
import { ClanQuizView } from './components/quiz/ClanQuizView';
import { CompendiumWiki } from './components/wiki/CompendiumWiki';
import { CombatTrackerDrawer } from './components/combat/CombatTrackerDrawer';
import { CoterieManagerView } from './components/coterie/CoterieManagerView';
import { DiablerieModal } from './components/taboos/DiablerieModal';
import { BloodBondMatrixModal } from './components/taboos/BloodBondMatrixModal';
import { MysteryInvestigationBoard } from './components/chronicle/MysteryInvestigationBoard';
import { StorytellerCockpit } from './components/storyteller/StorytellerCockpit';

// P2P Multiplayer & Broadcast Components (Sprint 2)
import { RoomLobbyModal } from './components/network/RoomLobbyModal';
import { SecretWhisperDrawer } from './components/network/SecretWhisperDrawer';
import { LiveDiceBanner } from './components/broadcast/LiveDiceBanner';
import { PlayerScreenView } from './components/broadcast/PlayerScreenView';

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
  const [resonanceOpen, setResonanceOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [combatDrawerOpen, setCombatDrawerOpen] = useState(false);
  const [diablerieModalOpen, setDiablerieModalOpen] = useState(false);
  const [bloodBondModalOpen, setBloodBondModalOpen] = useState(false);
  const [roomLobbyOpen, setRoomLobbyOpen] = useState(false);
  const [whisperDrawerOpen, setWhisperDrawerOpen] = useState(false);
  const [whisperRecipientId, setWhisperRecipientId] = useState<string | undefined>(undefined);
  const [unreadWhispersCount, setUnreadWhispersCount] = useState<number>(syncEngine.getUnreadWhisperCount());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Primed roll request from sheet
  const [primedRoll, setPrimedRoll] = useState<{ pool: number; label: string; hunger?: number } | null>(null);

  const activeCharacter = characters.find(c => c.id === activeCharacterId) || characters[0];

  // Auto-detect URL view/room parameters on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get('view');
    const requestedRoom = params.get('room');

    if (requestedView === 'projector') {
      setView('projector');
    }
    if (requestedRoom && !peerService.isConnected()) {
      peerService.joinRoom(requestedRoom, 'Kindred Guest', 'player');
    }
  }, []);

  // Listen for inbound sync events (whispers, character reconciliations)
  useEffect(() => {
    const unsubWhisper = syncEngine.onWhisper((whisper) => {
      setUnreadWhispersCount(syncEngine.getUnreadWhisperCount());
      showToast(
        `Telepathic Whisper [${whisper.discipline || 'Auspex'}]`,
        `${whisper.senderName}: "${whisper.text}"`,
        'blood'
      );
    });

    const unsubChar = syncEngine.onCharacterUpdate(() => {
      setCharacters(storageService.getCharacters());
    });

    return () => {
      unsubWhisper();
      unsubChar();
    };
  }, []);

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

  const handleFeedOnVessel = (slakeAmount: number, resonanceName: string) => {
    if (!activeCharacter) return;
    if (activeCharacter.edition === 'v5') {
      const cur = activeCharacter.hunger || 0;
      const nextHunger = Math.max(0, cur - slakeAmount);
      handleUpdateCharacter({ ...activeCharacter, hunger: nextHunger });
      showToast('Feeding Complete', `Slaked ${slakeAmount} Hunger (Now ${nextHunger}/5). Imbued with ${resonanceName}!`, 'blood');
    } else {
      const cur = activeCharacter.bloodPoolCurrent || 10;
      const max = activeCharacter.bloodPoolMax || 15;
      const nextBlood = Math.min(max, cur + 2);
      handleUpdateCharacter({ ...activeCharacter, bloodPoolCurrent: nextBlood });
      showToast('Feeding Complete', `Replenished Blood Pool (Now ${nextBlood}/${max}). Imbued with ${resonanceName}!`, 'blood');
    }
    setResonanceOpen(false);
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

  const handleOpenProjector = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'projector');
    const code = peerService.getRoomCode();
    if (code) url.searchParams.set('room', code);
    window.open(url.toString(), '_blank');
  };

  // Dedicated Zero-Spoilers Dual-Screen Projector Route
  if (view === 'projector') {
    return (
      <div className="min-h-screen bg-[#030306] text-[#e5e7eb] font-sans selection:bg-rose-950 selection:text-rose-200">
        <LiveDiceBanner />
        <PlayerScreenView
          onExit={() => setView('st_screen')}
          roomCodeFromUrl={new URLSearchParams(window.location.search).get('room') || undefined}
        />
        <ToastContainer
          toasts={toasts}
          onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e7eb] flex flex-col font-sans selection:bg-rose-950 selection:text-rose-200">
      {/* Cinematic Dramatic Live Dice Banner */}
      <LiveDiceBanner />

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
        onOpenResonance={() => setResonanceOpen(true)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        onOpenCombat={() => setCombatDrawerOpen(true)}
        onOpenDiablerie={() => setDiablerieModalOpen(true)}
        onOpenBloodBond={() => setBloodBondModalOpen(true)}
        onOpenLobby={() => setRoomLobbyOpen(true)}
        onOpenWhispers={() => {
          setWhisperRecipientId(undefined);
          setWhisperDrawerOpen(true);
        }}
        onOpenProjector={handleOpenProjector}
        unreadWhispersCount={unreadWhispersCount}
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

        {view === 'coterie' && (
          <CoterieManagerView
            characters={characters}
            onShowToast={showToast}
            onNavigateCharacter={handleSelectCharacter}
          />
        )}

        {view === 'chronicle' && (
          <ChronicleManager
            edition={edition}
            onLaunchRoll={(pool, label) => handleLaunchRoll(pool, label)}
          />
        )}

        {view === 'investigation' && (
          <MysteryInvestigationBoard
            onShowToast={showToast}
          />
        )}

        {view === 'st_screen' && (
          <StorytellerCockpit
            edition={edition}
            characters={characters}
            onOpenCombat={() => setCombatDrawerOpen(true)}
            onOpenMysteryBoard={() => setView('investigation')}
            onOpenDiablerie={() => setDiablerieModalOpen(true)}
            onOpenBloodBond={() => setBloodBondModalOpen(true)}
            onShowToast={showToast}
            onOpenProjector={handleOpenProjector}
            onOpenLobby={() => setRoomLobbyOpen(true)}
            onOpenWhispers={(id) => {
              setWhisperRecipientId(id);
              setWhisperDrawerOpen(true);
            }}
          />
        )}

        {view === 'diceroller' && (
          <DiceRollerDrawer
            isOpen={true}
            edition={edition}
            isFullScreen={true}
            characterName={activeCharacter?.name}
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
          characterName={activeCharacter?.name}
          onRouseCheckResult={success => {
            if (activeCharacter && activeCharacter.edition === 'v5' && !success) {
              const cur = activeCharacter.hunger || 0;
              handleUpdateCharacter({ ...activeCharacter, hunger: Math.min(5, cur + 1) });
            }
          }}
        />
      )}

      {/* P2P Table Lobby Modal */}
      <RoomLobbyModal
        isOpen={roomLobbyOpen}
        onClose={() => setRoomLobbyOpen(false)}
        characters={characters}
        activeCharacterId={activeCharacterId}
        onSelectCharacter={handleSelectCharacter}
        onOpenProjector={handleOpenProjector}
      />

      {/* Private Telepathic Whispers Drawer */}
      <SecretWhisperDrawer
        isOpen={whisperDrawerOpen}
        onClose={() => {
          setWhisperDrawerOpen(false);
          setUnreadWhispersCount(syncEngine.getUnreadWhisperCount());
        }}
        defaultRecipientPeerId={whisperRecipientId}
      />

      {combatDrawerOpen && (
        <CombatTrackerDrawer
          isOpen={combatDrawerOpen}
          onClose={() => setCombatDrawerOpen(false)}
          characters={characters}
          onShowToast={showToast}
        />
      )}

      {diablerieModalOpen && (
        <DiablerieModal
          isOpen={diablerieModalOpen}
          onClose={() => setDiablerieModalOpen(false)}
          characters={characters}
          onUpdateCharacter={handleUpdateCharacter}
          onShowToast={showToast}
        />
      )}

      {bloodBondModalOpen && (
        <BloodBondMatrixModal
          isOpen={bloodBondModalOpen}
          onClose={() => setBloodBondModalOpen(false)}
          characters={characters}
          onShowToast={showToast}
        />
      )}

      <AmbientSoundModal
        isOpen={soundboardOpen}
        onClose={() => setSoundboardOpen(false)}
      />

      <ResonanceRollerModal
        isOpen={resonanceOpen}
        onClose={() => setResonanceOpen(false)}
        activeCharacter={activeCharacter}
        onFeed={handleFeedOnVessel}
      />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        characters={characters}
        onSelectCharacter={handleSelectCharacter}
        onNavigateView={setView}
        onOpenDice={() => setDiceDrawerOpen(true)}
        onOpenSoundboard={() => setSoundboardOpen(true)}
        onOpenResonance={() => setResonanceOpen(true)}
        onToggleEdition={handleToggleEdition}
        onOpenCombat={() => setCombatDrawerOpen(true)}
        onOpenDiablerie={() => setDiablerieModalOpen(true)}
        onOpenBloodBond={() => setBloodBondModalOpen(true)}
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
