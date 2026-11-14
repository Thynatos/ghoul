import { peerService } from './peerService';
import { storageService } from './storage';
import { soundEngine } from './soundEngine';
import { 
  NetworkEnvelope, 
  DiceBroadcastPayload, 
  WhisperMessage, 
  SyncCharacterStatePayload,
  CombatInitiativePayload,
  MasqueradeLevelPayload,
  MysteryNodePayload,
  SceneStatePayload
} from '../types/network';
import { Character, RollResult } from '../types/vtm';
import { ActiveScene, ThreatMatrixState } from '../types/story';

const WHISPERS_STORAGE_KEY = 'ghoul_table_whispers';

class SyncEngine {
  private characterUpdateListeners: Set<(character: Character) => void> = new Set();
  private diceRollListeners: Set<(payload: DiceBroadcastPayload) => void> = new Set();
  private whisperListeners: Set<(whisper: WhisperMessage) => void> = new Set();
  private sceneListeners: Set<(scene: ActiveScene) => void> = new Set();
  private threatListeners: Set<(threat: ThreatMatrixState) => void> = new Set();
  private combatListeners: Set<(payload: CombatInitiativePayload) => void> = new Set();

  private whispers: WhisperMessage[] = [];
  private unreadWhisperIds: Set<string> = new Set();

  constructor() {
    this.loadPersistedWhispers();
    this.registerPeerListeners();
  }

  private loadPersistedWhispers() {
    try {
      const data = localStorage.getItem(WHISPERS_STORAGE_KEY);
      if (data) {
        this.whispers = JSON.parse(data);
      }
    } catch (e) {
      this.whispers = [];
    }
  }

  private saveWhispers() {
    try {
      localStorage.setItem(WHISPERS_STORAGE_KEY, JSON.stringify(this.whispers.slice(0, 100)));
    } catch (e) {}
  }

  private registerPeerListeners() {
    // 1. Character State Sync
    peerService.onMessage('SYNC_CHARACTER_STATE', (envelope: NetworkEnvelope<SyncCharacterStatePayload>) => {
      this.reconcileCharacterState(envelope.payload);
    });

    // 2. Public Dice Roll Broadcast
    peerService.onMessage('DICE_ROLL_BROADCAST', (envelope: NetworkEnvelope<DiceBroadcastPayload>) => {
      this.handleIncomingDiceRoll(envelope.payload);
    });

    // 3. Storyteller Telepathic Whisper
    peerService.onMessage('STORYTELLER_WHISPER', (envelope: NetworkEnvelope<WhisperMessage>) => {
      this.handleIncomingWhisper(envelope.payload);
    });

    // 4. Masquerade Breach & SI Threat
    peerService.onMessage('MASQUERADE_LEVEL_CHANGED', (envelope: NetworkEnvelope<MasqueradeLevelPayload>) => {
      this.handleIncomingMasqueradeUpdate(envelope.payload);
    });

    // 5. Mystery Node Revealed
    peerService.onMessage('MYSTERY_NODE_REVEALED', (envelope: NetworkEnvelope<MysteryNodePayload>) => {
      this.handleIncomingMysteryNode(envelope.payload);
    });

    // 6. Scene State Update
    peerService.onMessage('SCENE_STATE_UPDATE', (envelope: NetworkEnvelope<SceneStatePayload>) => {
      this.handleIncomingSceneState(envelope.payload);
    });

    // 7. Combat Initiative
    peerService.onMessage('COMBAT_INITIATIVE_UPDATE', (envelope: NetworkEnvelope<CombatInitiativePayload>) => {
      this.combatListeners.forEach(cb => cb(envelope.payload));
    });
  }

  // --- Inbound Reconciliation Logic ---

  private reconcileCharacterState(payload: SyncCharacterStatePayload) {
    if (!payload || !payload.characterId) return;

    const char = storageService.getCharacter(payload.characterId);
    if (!char) return;

    // Optimistically merge incoming fields (Health, Willpower, Hunger, Blood)
    const updated: Character = {
      ...char,
      ...payload.updates,
      updatedAt: Date.now()
    };

    storageService.saveCharacter(updated);
    this.characterUpdateListeners.forEach(cb => cb(updated));
  }

  private handleIncomingDiceRoll(payload: DiceBroadcastPayload) {
    if (!payload) return;

    // Zero-Spoilers Rule: If payload is flagged secret, do not record in public tray
    if (payload.isSecretRoll) return;

    // Convert to RollResult format and save to history
    const isWin = payload.successes >= 1;
    let outcome: RollResult['outcome'] = isWin ? 'success' : 'failure';
    if (payload.isMessyCritical) outcome = 'messy_critical';
    else if (payload.isBestialFailure) outcome = 'bestial_failure';
    else if (isWin && payload.margin >= 3) outcome = 'exceptional';

    const rollRecord: RollResult = {
      id: `net_roll_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      edition: payload.hungerDice > 0 ? 'v5' : 'v20',
      label: `${payload.rollerName} (${payload.characterName || 'Kindred'}): ${payload.poolLabel}`,
      poolSize: payload.poolSize,
      hungerDice: payload.hungerDice,
      difficulty: 1,
      dice: payload.results,
      hungerDiceResults: payload.hungerResults,
      successes: payload.successes,
      margin: payload.margin,
      outcome,
      outcomeText: `${payload.poolLabel}: ${payload.successes} Successes (Margin: ${payload.margin >= 0 ? '+' : ''}${payload.margin})`,
      timestamp: Date.now()
    };

    storageService.addRoll(rollRecord);
    this.diceRollListeners.forEach(cb => cb(payload));
  }

  private handleIncomingWhisper(whisper: WhisperMessage) {
    if (!whisper) return;

    this.whispers.unshift(whisper);
    this.unreadWhisperIds.add(whisper.id);
    this.saveWhispers();

    // Thematic auditory feedback: Auspex / Dominate heartbeat pulse
    try {
      soundEngine.playHeartbeat();
    } catch (e) {}

    this.whisperListeners.forEach(cb => cb(whisper));
  }

  private handleIncomingMasqueradeUpdate(payload: MasqueradeLevelPayload) {
    if (!payload) return;
    const current = storageService.getThreatMatrix();
    const updated: ThreatMatrixState = {
      ...current,
      masqueradeBreaches: payload.level,
      secondInquisitionAlert: payload.secondInquisitionLevel ?? current.secondInquisitionAlert,
      lastUpdated: new Date().toISOString()
    };
    storageService.saveThreatMatrix(updated);
    this.threatListeners.forEach(cb => cb(updated));
  }

  private handleIncomingMysteryNode(payload: MysteryNodePayload) {
    if (!payload || !payload.nodeId) return;
    const boards = storageService.getMysteryBoards();
    let updated = false;

    boards.forEach(board => {
      const node = board.nodes.find(n => n.id === payload.nodeId);
      if (node) {
        node.isRevealed = payload.isRevealed;
        if (payload.clueSnippet && !node.clues.includes(payload.clueSnippet)) {
          node.clues.push(payload.clueSnippet);
        }
        updated = true;
      }
    });

    if (updated) {
      storageService.saveMysteryBoards(boards);
    }
  }

  private handleIncomingSceneState(payload: SceneStatePayload) {
    if (!payload) return;
    const current = storageService.getActiveScene();
    const updated: ActiveScene = {
      ...current,
      id: payload.sceneId || current.id,
      title: payload.title || current.title,
      location: payload.location || current.location,
      tension: (payload.tension as any) || current.tension,
      environmentalModifiers: {
        ...current.environmentalModifiers,
        fireHazard: payload.environmentalHazards?.fire ?? current.environmentalModifiers.fireHazard,
        surveillancePresent: payload.environmentalHazards?.surveillance ?? current.environmentalModifiers.surveillancePresent
      }
    };
    storageService.saveActiveScene(updated);
    this.sceneListeners.forEach(cb => cb(updated));
  }

  // --- Outbound Broadcast Methods ---

  public syncCharacter(characterId: string, updates: Partial<Character>) {
    const char = storageService.getCharacter(characterId);
    if (!char) return;

    const payload: SyncCharacterStatePayload = {
      characterId,
      characterName: char.name,
      updates,
      version: Date.now()
    };

    peerService.send<SyncCharacterStatePayload>('SYNC_CHARACTER_STATE', payload);
  }

  public broadcastRoll(
    roll: RollResult, 
    rollerName: string, 
    characterName: string, 
    isSecretRoll: boolean = false
  ) {
    const isMessy = roll.outcome === 'messy_critical';
    const isBestial = roll.outcome === 'bestial_failure' || roll.outcome === 'botch';

    const payload: DiceBroadcastPayload = {
      rollerName,
      characterName,
      poolLabel: roll.label,
      poolSize: roll.poolSize,
      hungerDice: roll.hungerDice || 0,
      results: roll.dice,
      hungerResults: roll.hungerDiceResults || [],
      successes: roll.successes,
      margin: roll.margin,
      isMessyCritical: isMessy,
      isBestialFailure: isBestial,
      isSecretRoll
    };

    // If it's a secret roll, we do NOT send to other peers!
    if (!isSecretRoll) {
      peerService.broadcastDiceRoll(payload);
    }

    // Always trigger local listeners for immediate feedback on the roller's screen
    this.diceRollListeners.forEach(cb => cb(payload));
  }

  public sendWhisper(
    recipientPeerId: string, 
    recipientName: string, 
    text: string, 
    discipline?: 'Auspex' | 'Dominate' | 'Presence'
  ): WhisperMessage {
    const whisper = peerService.sendWhisper(recipientPeerId, recipientName, text, discipline);
    this.whispers.unshift(whisper);
    this.saveWhispers();
    return whisper;
  }

  public broadcastScene(scene: ActiveScene, hoursUntilDawn: number = 4) {
    const payload: SceneStatePayload = {
      sceneId: scene.id,
      title: scene.title,
      location: scene.location,
      tension: scene.tension,
      hoursUntilDawn,
      environmentalHazards: {
        daylight: false,
        fire: scene.environmentalModifiers.fireHazard,
        secondInquisitionRaid: scene.tension >= 4,
        surveillance: scene.environmentalModifiers.surveillancePresent
      }
    };
    peerService.send<SceneStatePayload>('SCENE_STATE_UPDATE', payload);
  }

  public broadcastMasquerade(level: number, notes?: string, secondInquisitionLevel?: number) {
    const payload: MasqueradeLevelPayload = {
      level,
      threatDescription: notes,
      secondInquisitionLevel
    };
    peerService.send<MasqueradeLevelPayload>('MASQUERADE_LEVEL_CHANGED', payload);
  }

  public broadcastMysteryNode(nodeId: string, title: string, isRevealed: boolean, clueSnippet?: string) {
    const payload: MysteryNodePayload = {
      nodeId,
      title,
      isRevealed,
      clueSnippet
    };
    peerService.send<MysteryNodePayload>('MYSTERY_NODE_REVEALED', payload);
  }

  // --- Whisper Management ---

  public getWhispers(): WhisperMessage[] {
    return [...this.whispers];
  }

  public getUnreadWhisperCount(): number {
    return this.unreadWhisperIds.size;
  }

  public markWhispersAsRead() {
    this.unreadWhisperIds.clear();
  }

  public clearWhispers() {
    this.whispers = [];
    this.unreadWhisperIds.clear();
    this.saveWhispers();
  }

  // --- Subscriptions ---

  public onCharacterUpdate(callback: (character: Character) => void): () => void {
    this.characterUpdateListeners.add(callback);
    return () => this.characterUpdateListeners.delete(callback);
  }

  public onDiceRoll(callback: (payload: DiceBroadcastPayload) => void): () => void {
    this.diceRollListeners.add(callback);
    return () => this.diceRollListeners.delete(callback);
  }

  public onWhisper(callback: (whisper: WhisperMessage) => void): () => void {
    this.whisperListeners.add(callback);
    return () => this.whisperListeners.delete(callback);
  }

  public onSceneUpdate(callback: (scene: ActiveScene) => void): () => void {
    this.sceneListeners.add(callback);
    return () => this.sceneListeners.delete(callback);
  }

  public onThreatUpdate(callback: (threat: ThreatMatrixState) => void): () => void {
    this.threatListeners.add(callback);
    return () => this.threatListeners.delete(callback);
  }

  public onCombatUpdate(callback: (payload: CombatInitiativePayload) => void): () => void {
    this.combatListeners.add(callback);
    return () => this.combatListeners.delete(callback);
  }
}

export const syncEngine = new SyncEngine();
