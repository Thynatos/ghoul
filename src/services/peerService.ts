import { 
  NetworkEnvelope, 
  NetworkMessageType, 
  RoomParticipant, 
  PeerRole, 
  DiceBroadcastPayload, 
  WhisperMessage, 
  WhisperDiscipline,
  RoomStatePayload
} from '../types/network';

const GOTHIC_PREFIXES = ['SANG', 'VEIL', 'VOID', 'CLAN', 'KIND', 'FANG', 'TOMB', 'NOCT', 'ROSE', 'WOLF', 'DUSK', 'CRUX'];
const ALPHANUM = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';

class PeerService {
  private roomCode: string | null = null;
  private localPeerId: string;
  private playerName: string;
  private role: PeerRole = 'player';
  private characterId?: string;
  private isTableHost: boolean = false;
  private participants: Map<string, RoomParticipant> = new Map();
  private broadcastChannel: BroadcastChannel | null = null;
  private pingIntervalId: number | null = null;
  private heartbeatTimestamps: Map<string, number> = new Map();
  private currentPingMs: number = 0;

  // WebRTC Peer Connections for cross-device mesh
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private dataChannels: Map<string, RTCDataChannel> = new Map();

  // Event Listeners
  private messageListeners: Map<string, Set<(envelope: NetworkEnvelope) => void>> = new Map();
  private peerJoinListeners: Set<(peer: RoomParticipant) => void> = new Set();
  private peerLeaveListeners: Set<(peerId: string) => void> = new Set();
  private participantsChangeListeners: Set<(participants: RoomParticipant[]) => void> = new Set();
  private connectionChangeListeners: Set<(isConnected: boolean, roomCode: string | null) => void> = new Set();

  constructor() {
    this.localPeerId = this.loadOrCreatePeerId();
    this.playerName = localStorage.getItem('ghoul_player_name') || `Kindred_${this.localPeerId.slice(-4)}`;
    
    // Auto-restore previous room if in session
    const savedRoom = sessionStorage.getItem('ghoul_active_room');
    const savedRole = sessionStorage.getItem('ghoul_active_role') as PeerRole | null;
    if (savedRoom) {
      this.role = savedRole || 'player';
      this.connectToChannel(savedRoom);
    }
  }

  private loadOrCreatePeerId(): string {
    let id = localStorage.getItem('ghoul_peer_id');
    if (!id) {
      id = `peer_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
      localStorage.setItem('ghoul_peer_id', id);
    }
    return id;
  }

  public generateRoomCode(): string {
    const prefix = GOTHIC_PREFIXES[Math.floor(Math.random() * GOTHIC_PREFIXES.length)];
    const c1 = ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
    const c2 = ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
    return `${prefix}-${c1}${c2}`;
  }

  public getLocalPeer(): RoomParticipant {
    return {
      peerId: this.localPeerId,
      playerName: this.playerName,
      role: this.role,
      characterId: this.characterId,
      isReady: true,
      pingMs: this.currentPingMs,
      lastSeen: Date.now()
    };
  }

  public getParticipants(): RoomParticipant[] {
    return Array.from(this.participants.values());
  }

  public getRoomCode(): string | null {
    return this.roomCode;
  }

  public isConnected(): boolean {
    return this.roomCode !== null;
  }

  public isHost(): boolean {
    return this.isTableHost;
  }

  public getPingMs(): number {
    return this.currentPingMs;
  }

  public updateProfile(updates: { playerName?: string; characterId?: string; role?: PeerRole }) {
    if (updates.playerName) {
      this.playerName = updates.playerName;
      localStorage.setItem('ghoul_player_name', this.playerName);
    }
    if (updates.characterId !== undefined) {
      this.characterId = updates.characterId;
    }
    if (updates.role) {
      this.role = updates.role;
      sessionStorage.setItem('ghoul_active_role', this.role);
    }

    if (this.isConnected()) {
      // Broadcast updated profile to table
      this.send<RoomParticipant>('PEER_JOIN', this.getLocalPeer());
      this.notifyParticipantsChanged();
    }
  }

  // --- Room Hosting & Joining ---

  public hostRoom(
    customRoomCode?: string, 
    role: PeerRole = 'storyteller', 
    playerName?: string, 
    characterId?: string
  ): string {
    const code = (customRoomCode || this.generateRoomCode()).toUpperCase();
    this.isTableHost = true;
    this.role = role;
    if (playerName) this.playerName = playerName;
    if (characterId) this.characterId = characterId;

    this.connectToChannel(code);
    return code;
  }

  public joinRoom(
    roomCode: string, 
    playerName?: string, 
    role: PeerRole = 'player', 
    characterId?: string
  ): boolean {
    const cleanCode = roomCode.trim().toUpperCase();
    if (!cleanCode) return false;

    this.isTableHost = false;
    this.role = role;
    if (playerName) this.playerName = playerName;
    if (characterId) this.characterId = characterId;

    this.connectToChannel(cleanCode);
    return true;
  }

  private connectToChannel(roomCode: string) {
    this.leaveRoom(false);

    this.roomCode = roomCode;
    sessionStorage.setItem('ghoul_active_room', roomCode);
    sessionStorage.setItem('ghoul_active_role', this.role);

    // Self registration in participant roster
    const self = this.getLocalPeer();
    this.participants.set(this.localPeerId, self);

    // Initialize BroadcastChannel
    try {
      this.broadcastChannel = new BroadcastChannel(`ghoul_table_${roomCode}`);
      this.broadcastChannel.onmessage = (event: MessageEvent<NetworkEnvelope>) => {
        this.handleIncomingEnvelope(event.data);
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported in this environment', e);
    }

    // Broadcast announcement that we joined
    this.send<RoomParticipant>('PEER_JOIN', self);

    // Start periodic ping & participant hygiene
    this.startHeartbeat();

    this.notifyConnectionChanged(true, roomCode);
    this.notifyParticipantsChanged();
  }

  public leaveRoom(notify: boolean = true) {
    if (!this.roomCode) return;

    if (notify) {
      this.send<string>('PEER_LEAVE', this.localPeerId);
    }

    if (this.pingIntervalId) {
      window.clearInterval(this.pingIntervalId);
      this.pingIntervalId = null;
    }

    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }

    // Close WebRTC connections
    this.dataChannels.forEach(dc => dc.close());
    this.dataChannels.clear();
    this.peerConnections.forEach(pc => pc.close());
    this.peerConnections.clear();

    const previousRoom = this.roomCode;
    this.roomCode = null;
    this.isTableHost = false;
    this.participants.clear();
    this.heartbeatTimestamps.clear();
    this.currentPingMs = 0;

    sessionStorage.removeItem('ghoul_active_room');
    sessionStorage.removeItem('ghoul_active_role');

    this.notifyConnectionChanged(false, null);
    this.notifyParticipantsChanged();
  }

  // --- Network Envelope Dispatching ---

  public send<T = any>(type: NetworkMessageType, payload: T, targetPeerId?: string): NetworkEnvelope<T> {
    const envelope: NetworkEnvelope<T> = {
      id: `env_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      senderPeerId: this.localPeerId,
      senderName: this.playerName,
      targetPeerId,
      timestamp: Date.now(),
      payload
    };

    // 1. Dispatch over BroadcastChannel for local zero-latency multi-screen
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(envelope);
      } catch (e) {
        console.error('Failed to postMessage on BroadcastChannel', e);
      }
    }

    // 2. Dispatch over active WebRTC DataChannels for remote peers
    if (targetPeerId) {
      const dc = this.dataChannels.get(targetPeerId);
      if (dc && dc.readyState === 'open') {
        dc.send(JSON.stringify(envelope));
      }
    } else {
      const dataStr = JSON.stringify(envelope);
      this.dataChannels.forEach(dc => {
        if (dc.readyState === 'open') {
          dc.send(dataStr);
        }
      });
    }

    return envelope;
  }

  public broadcastDiceRoll(payload: DiceBroadcastPayload) {
    this.send<DiceBroadcastPayload>('DICE_ROLL_BROADCAST', payload);
  }

  public sendWhisper(
    recipientId: string, 
    recipientName: string, 
    text: string, 
    discipline?: WhisperDiscipline
  ): WhisperMessage {
    const whisper: WhisperMessage = {
      id: `wsp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: this.localPeerId,
      senderName: this.playerName,
      recipientId,
      recipientName,
      text,
      timestamp: Date.now(),
      discipline
    };

    this.send<WhisperMessage>('STORYTELLER_WHISPER', whisper, recipientId);
    return whisper;
  }

  // --- Incoming Envelope Handling & Routing ---

  private handleIncomingEnvelope(envelope: NetworkEnvelope) {
    if (!envelope || !envelope.type) return;

    // Ignore messages sent by self
    if (envelope.senderPeerId === this.localPeerId) return;

    // If targeted to a specific peer, verify destination
    if (envelope.targetPeerId && envelope.targetPeerId !== this.localPeerId) {
      return;
    }

    // Handle internal protocol messages
    switch (envelope.type) {
      case 'PEER_JOIN': {
        const participant = envelope.payload as RoomParticipant;
        if (participant && participant.peerId) {
          const isNew = !this.participants.has(participant.peerId);
          this.participants.set(participant.peerId, {
            ...participant,
            lastSeen: Date.now()
          });

          // Acknowledge with our own profile so newcomer gets table roster
          this.send<RoomParticipant>('ROOM_STATE', this.getLocalPeer(), participant.peerId);

          if (isNew) {
            this.peerJoinListeners.forEach(cb => cb(participant));
          }
          this.notifyParticipantsChanged();
        }
        break;
      }

      case 'ROOM_STATE': {
        const peer = envelope.payload as RoomParticipant;
        if (peer && peer.peerId) {
          this.participants.set(peer.peerId, {
            ...peer,
            lastSeen: Date.now()
          });
          this.notifyParticipantsChanged();
        }
        break;
      }

      case 'PEER_LEAVE': {
        const peerId = envelope.payload as string;
        if (peerId && this.participants.has(peerId)) {
          this.participants.delete(peerId);
          this.peerLeaveListeners.forEach(cb => cb(peerId));
          this.notifyParticipantsChanged();
        }
        break;
      }

      case 'HEARTBEAT_PING': {
        // Echo back pong immediately to sender
        this.send<{ pingTimestamp: number }>(
          'HEARTBEAT_PONG', 
          { pingTimestamp: envelope.timestamp }, 
          envelope.senderPeerId
        );
        // Refresh last seen
        const peer = this.participants.get(envelope.senderPeerId);
        if (peer) {
          peer.lastSeen = Date.now();
        }
        break;
      }

      case 'HEARTBEAT_PONG': {
        const payload = envelope.payload as { pingTimestamp: number };
        if (payload && payload.pingTimestamp) {
          const rtt = Math.max(1, Date.now() - payload.pingTimestamp);
          this.currentPingMs = rtt;
          const peer = this.participants.get(envelope.senderPeerId);
          if (peer) {
            peer.pingMs = rtt;
            peer.lastSeen = Date.now();
            this.notifyParticipantsChanged();
          }
        }
        break;
      }

      case 'KICK_PEER': {
        if (envelope.targetPeerId === this.localPeerId) {
          this.leaveRoom(false);
          alert('You have been dismissed from the tabletop session by the Storyteller.');
          return;
        }
        break;
      }
    }

    // Dispatch to registered type listeners
    const typeListeners = this.messageListeners.get(envelope.type);
    if (typeListeners) {
      typeListeners.forEach(listener => listener(envelope));
    }

    // Dispatch to wildcard listeners
    const wildcardListeners = this.messageListeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach(listener => listener(envelope));
    }
  }

  // --- Heartbeat & Latency Ping Loop ---

  private startHeartbeat() {
    if (this.pingIntervalId) {
      window.clearInterval(this.pingIntervalId);
    }

    // Ping every 3.5 seconds
    this.pingIntervalId = window.setInterval(() => {
      if (!this.isConnected()) return;

      const now = Date.now();
      this.send<number>('HEARTBEAT_PING', now);

      // Clean up stale peers who haven't pinged in 15 seconds
      let changed = false;
      this.participants.forEach((peer, id) => {
        if (id !== this.localPeerId && peer.lastSeen && now - peer.lastSeen > 15000) {
          this.participants.delete(id);
          this.peerLeaveListeners.forEach(cb => cb(id));
          changed = true;
        }
      });

      if (changed) {
        this.notifyParticipantsChanged();
      }
    }, 3500);
  }

  // --- Host Moderation Controls ---

  public kickPeer(peerId: string) {
    if (!this.isTableHost) return;
    this.send<string>('KICK_PEER', 'Dismissed by Storyteller', peerId);
    this.participants.delete(peerId);
    this.notifyParticipantsChanged();
  }

  public promotePeer(peerId: string, newRole: PeerRole) {
    if (!this.isTableHost) return;
    const peer = this.participants.get(peerId);
    if (peer) {
      peer.role = newRole;
      this.send<{ peerId: string; role: PeerRole }>('ROOM_STATE', {
        ...peer,
        role: newRole
      });
      this.notifyParticipantsChanged();
    }
  }

  public assignPeerCharacter(peerId: string, characterId: string) {
    if (!this.isTableHost) return;
    const peer = this.participants.get(peerId);
    if (peer) {
      peer.characterId = characterId;
      this.send<RoomParticipant>('ROOM_STATE', peer);
      this.notifyParticipantsChanged();
    }
  }

  // --- Event Subscriptions ---

  public onMessage(type: NetworkMessageType | '*', callback: (envelope: NetworkEnvelope) => void): () => void {
    if (!this.messageListeners.has(type)) {
      this.messageListeners.set(type, new Set());
    }
    this.messageListeners.get(type)!.add(callback);
    return () => {
      this.messageListeners.get(type)?.delete(callback);
    };
  }

  public onPeerJoin(callback: (peer: RoomParticipant) => void): () => void {
    this.peerJoinListeners.add(callback);
    return () => this.peerJoinListeners.delete(callback);
  }

  public onPeerLeave(callback: (peerId: string) => void): () => void {
    this.peerLeaveListeners.add(callback);
    return () => this.peerLeaveListeners.delete(callback);
  }

  public onParticipantsChange(callback: (participants: RoomParticipant[]) => void): () => void {
    this.participantsChangeListeners.add(callback);
    // Emit immediate current state
    callback(this.getParticipants());
    return () => this.participantsChangeListeners.delete(callback);
  }

  public onConnectionChange(callback: (isConnected: boolean, roomCode: string | null) => void): () => void {
    this.connectionChangeListeners.add(callback);
    callback(this.isConnected(), this.getRoomCode());
    return () => this.connectionChangeListeners.delete(callback);
  }

  private notifyParticipantsChanged() {
    const list = this.getParticipants();
    this.participantsChangeListeners.forEach(cb => cb(list));
  }

  private notifyConnectionChanged(isConnected: boolean, roomCode: string | null) {
    this.connectionChangeListeners.forEach(cb => cb(isConnected, roomCode));
  }
}

export const peerService = new PeerService();
