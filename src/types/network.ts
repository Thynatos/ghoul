/**
 * GHOUL P2P Tabletop Networking & State Synchronization Contracts
 * Live multi-peer protocol supporting zero-latency local BroadcastChannel
 * and WebRTC mesh topologies for Storyteller dual-screen and player tables.
 */

export type PeerRole = 'storyteller' | 'co_storyteller' | 'player' | 'spectator';

export interface RoomParticipant {
  peerId: string;
  characterId?: string;
  playerName: string;
  role: PeerRole;
  isReady: boolean;
  pingMs: number;
  lastSeen?: number;
}

export type NetworkMessageType =
  | 'SYNC_CHARACTER_STATE'
  | 'DICE_ROLL_BROADCAST'
  | 'COMBAT_INITIATIVE_UPDATE'
  | 'STORYTELLER_WHISPER'
  | 'MASQUERADE_LEVEL_CHANGED'
  | 'MYSTERY_NODE_REVEALED'
  | 'HEARTBEAT_PING'
  | 'HEARTBEAT_PONG'
  | 'PEER_JOIN'
  | 'PEER_LEAVE'
  | 'ROOM_STATE'
  | 'KICK_PEER'
  | 'SCENE_STATE_UPDATE';

export interface NetworkEnvelope<T = any> {
  id: string;
  type: NetworkMessageType;
  senderPeerId: string;
  senderName: string;
  targetPeerId?: string; // Broadcasts to entire room if undefined
  timestamp: number;
  payload: T;
}

export interface DiceBroadcastPayload {
  rollerName: string;
  characterName: string;
  poolLabel: string;
  poolSize: number;
  hungerDice: number;
  results: number[];
  hungerResults: number[];
  successes: number;
  margin: number;
  isMessyCritical: boolean;
  isBestialFailure: boolean;
  isSecretRoll: boolean;
}

export type WhisperDiscipline = 'Auspex' | 'Dominate' | 'Presence';

export interface WhisperMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  text: string;
  timestamp: number;
  discipline?: WhisperDiscipline;
}

export interface SyncCharacterStatePayload {
  characterId: string;
  characterName: string;
  updates: Record<string, any>;
  version: number;
}

export interface CombatInitiativePayload {
  combatantId: string;
  combatantName: string;
  initiative: number;
  currentTurnId?: string;
  round?: number;
}

export interface MasqueradeLevelPayload {
  level: number;
  threatDescription?: string;
  secondInquisitionLevel?: number;
}

export interface MysteryNodePayload {
  nodeId: string;
  title: string;
  isRevealed: boolean;
  clueSnippet?: string;
}

export interface SceneStatePayload {
  sceneId: string;
  title: string;
  location: string;
  tension: number;
  hoursUntilDawn: number;
  environmentalHazards: {
    daylight: boolean;
    fire: boolean;
    secondInquisitionRaid: boolean;
    surveillance: boolean;
  };
}

export interface RoomStatePayload {
  roomCode: string;
  hostPeerId: string;
  participants: RoomParticipant[];
  activeScene?: SceneStatePayload;
}
