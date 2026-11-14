import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Users, 
  Wifi, 
  Copy, 
  Check, 
  ExternalLink, 
  LogOut, 
  ShieldAlert, 
  UserCheck, 
  Sparkles, 
  QrCode, 
  Radio, 
  Tv, 
  UserX,
  RefreshCw
} from 'lucide-react';
import { GothicModal } from '../ui/GothicModal';
import { GothicButton } from '../ui/GothicButton';
import { GothicCard } from '../ui/GothicCard';
import { GothicBadge } from '../ui/GothicBadge';
import { peerService } from '../../services/peerService';
import { soundEngine } from '../../services/soundEngine';
import { Character } from '../../types/vtm';
import { RoomParticipant, PeerRole } from '../../types/network';

interface RoomLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  activeCharacterId?: string;
  onSelectCharacter?: (id: string) => void;
  onOpenProjector?: () => void;
}

export const RoomLobbyModal: React.FC<RoomLobbyModalProps> = ({
  isOpen,
  onClose,
  characters,
  activeCharacterId,
  onSelectCharacter,
  onOpenProjector
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'host' | 'join'>('status');
  const [isConnected, setIsConnected] = useState<boolean>(peerService.isConnected());
  const [roomCode, setRoomCode] = useState<string | null>(peerService.getRoomCode());
  const [participants, setParticipants] = useState<RoomParticipant[]>(peerService.getParticipants());
  const [isHost, setIsHost] = useState<boolean>(peerService.isHost());

  // Host Tab Form
  const [hostCustomCode, setHostCustomCode] = useState('');
  const [hostRole, setHostRole] = useState<PeerRole>('storyteller');
  const [hostName, setHostName] = useState(
    localStorage.getItem('ghoul_player_name') || 'Storyteller'
  );
  const [hostCharId, setHostCharId] = useState(activeCharacterId || '');

  // Join Tab Form
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState(
    localStorage.getItem('ghoul_player_name') || 'Kindred Wanderer'
  );
  const [joinRole, setJoinRole] = useState<PeerRole>('player');
  const [joinCharId, setJoinCharId] = useState(activeCharacterId || characters[0]?.id || '');

  // Clipboard feedback
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const unsubConn = peerService.onConnectionChange((connected, code) => {
      setIsConnected(connected);
      setRoomCode(code);
      setIsHost(peerService.isHost());
      if (connected) {
        setActiveTab('status');
      }
    });

    const unsubParticipants = peerService.onParticipantsChange(list => {
      setParticipants(list);
    });

    if (!peerService.isConnected()) {
      setActiveTab('host');
      setHostCustomCode(peerService.generateRoomCode());
    } else {
      setActiveTab('status');
    }

    return () => {
      unsubConn();
      unsubParticipants();
    };
  }, [isOpen]);

  const handleHostRoom = () => {
    soundEngine.playDrawerSlide();
    const code = peerService.hostRoom(hostCustomCode || undefined, hostRole, hostName, hostCharId || undefined);
    setRoomCode(code);
    setIsConnected(true);
    setIsHost(true);
    setActiveTab('status');
  };

  const handleJoinRoom = () => {
    if (!joinCode.trim()) return;
    soundEngine.playDrawerSlide();
    const success = peerService.joinRoom(joinCode, joinName, joinRole, joinCharId || undefined);
    if (success) {
      if (joinCharId && onSelectCharacter) {
        onSelectCharacter(joinCharId);
      }
      setActiveTab('status');
    }
  };

  const handleLeaveRoom = () => {
    peerService.leaveRoom();
    setIsConnected(false);
    setRoomCode(null);
    setActiveTab('host');
    setHostCustomCode(peerService.generateRoomCode());
  };

  const handleCopyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyJoinLink = (projector: boolean = false) => {
    if (!roomCode) return;
    const url = new URL(window.location.href);
    url.searchParams.set('room', roomCode);
    if (projector) {
      url.searchParams.set('view', 'projector');
    } else {
      url.searchParams.delete('view');
    }
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const openProjectorWindow = () => {
    if (onOpenProjector) {
      onOpenProjector();
    } else {
      const url = new URL(window.location.href);
      if (roomCode) url.searchParams.set('room', roomCode);
      url.searchParams.set('view', 'projector');
      window.open(url.toString(), '_blank');
    }
  };

  return (
    <GothicModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
          <span>TABLETOP P2P SYNCHRONIZATION LOBBY</span>
        </div>
      }
      subtitle="Serverless real-time blood nexus for dual-screen Storytelling and connected coteries"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-neutral-600'}`} />
            <span>{isConnected ? `Linked to ${roomCode}` : 'Local Standalone Session'}</span>
          </div>
          <GothicButton variant="slate" size="sm" onClick={onClose}>
            Close Matrix
          </GothicButton>
        </div>
      }
    >
      {/* Navigation Tabs */}
      <div className="flex border-b border-[#222232] mb-6">
        {isConnected && (
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-2.5 text-xs font-cinzel font-bold tracking-wider border-b-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'status'
                ? 'border-rose-600 text-rose-200 bg-rose-950/20'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Live Table ({participants.length})
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveTab('host')}
          className={`flex-1 py-2.5 text-xs font-cinzel font-bold tracking-wider border-b-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'host'
              ? 'border-amber-600 text-amber-200 bg-amber-950/20'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          Host Chamber
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('join')}
          className={`flex-1 py-2.5 text-xs font-cinzel font-bold tracking-wider border-b-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'join'
              ? 'border-rose-600 text-rose-200 bg-rose-950/20'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Join Table
        </button>
      </div>

      {/* TAB 1: LIVE TABLE ROSTER & CONTROLS */}
      {activeTab === 'status' && isConnected && roomCode && (
        <div className="space-y-6">
          {/* Room Banner */}
          <GothicCard variant="raised" ribbon={isHost ? 'gold' : 'crimson'} className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block mb-1">
                  CHAMBER NEXUS FREQUENCY
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-cinzel text-2xl sm:text-3xl font-black tracking-widest text-white">
                    {roomCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1.5 rounded bg-black/60 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
                    title="Copy 6-character room code"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <GothicBadge
                    label={isHost ? 'STORYTELLER HOST' : 'COTERIE PEER'}
                    variant={isHost ? 'gold' : 'blood'}
                    size="sm"
                  />
                </div>
              </div>

              {/* Fast Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <GothicButton
                  variant="gold"
                  size="sm"
                  icon={Tv}
                  onClick={openProjectorWindow}
                  className="flex-1 sm:flex-none"
                >
                  Projector View
                </GothicButton>
                <GothicButton
                  variant="slate"
                  size="sm"
                  icon={copiedLink ? Check : Copy}
                  onClick={() => handleCopyJoinLink(false)}
                  className="flex-1 sm:flex-none"
                >
                  {copiedLink ? 'Link Copied!' : 'Copy Link'}
                </GothicButton>
                <button
                  type="button"
                  onClick={() => setShowQR(!showQR)}
                  className="p-2 rounded-lg bg-[#181824] hover:bg-[#222232] border border-[#2d2d42] text-neutral-300 transition cursor-pointer"
                  title="Toggle Gothic QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stylized Gothic QR Code Container */}
            {showQR && (
              <div className="mt-4 pt-4 border-t border-[#20202e] flex flex-col items-center justify-center p-4 bg-black/70 rounded-xl border border-rose-950">
                <div className="w-40 h-40 bg-neutral-900 border-2 border-rose-800 p-2 rounded-lg flex flex-col items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.3)]">
                  {/* Decorative stylized QR Matrix */}
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-black rounded">
                    {Array.from({ length: 36 }).map((_, i) => {
                      const isCorner = i === 0 || i === 5 || i === 30 || i === 35 || i === 7 || i === 10 || i === 25;
                      const isFilled = isCorner || ((i * 7 + 3) % 4 === 0);
                      return (
                        <div
                          key={i}
                          className={`rounded-sm transition-all duration-300 ${
                            isFilled ? 'bg-rose-500 shadow-[0_0_4px_rgba(244,63,94,0.5)]' : 'bg-neutral-950'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
                <p className="font-cinzel text-xs text-rose-300 font-bold mt-2 tracking-widest">
                  GHOUL TABLE MATRIX: {roomCode}
                </p>
                <p className="text-[11px] font-mono text-neutral-400">
                  Scan or join directly via code {roomCode}
                </p>
              </div>
            )}
          </GothicCard>

          {/* Participant Roster Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-rose-500" />
                Kindred At The Table ({participants.length})
              </span>
              <span className="text-[11px] font-mono text-neutral-500">
                Auto-reconciling P2P state
              </span>
            </div>

            <div className="space-y-2">
              {participants.map(peer => {
                const isLocal = peer.peerId === peerService.getLocalPeer().peerId;
                const boundChar = characters.find(c => c.id === peer.characterId);

                return (
                  <div
                    key={peer.peerId}
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                      isLocal
                        ? 'bg-rose-950/20 border-rose-900/60'
                        : 'bg-[#101017] border-[#222232]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center font-cinzel font-bold text-xs text-rose-400">
                        {peer.role === 'storyteller' ? 'ST' : peer.role === 'co_storyteller' ? 'CO' : 'PC'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-neutral-200">
                            {peer.playerName}
                          </span>
                          {isLocal && (
                            <span className="text-[9px] bg-rose-950 text-rose-300 px-1.5 py-0.2 rounded border border-rose-800">
                              YOU
                            </span>
                          )}
                          <GothicBadge
                            label={peer.role.replace('_', ' ').toUpperCase()}
                            variant={
                              peer.role === 'storyteller'
                                ? 'gold'
                                : peer.role === 'co_storyteller'
                                ? 'amber'
                                : peer.role === 'spectator'
                                ? 'slate'
                                : 'blood'
                            }
                            size="sm"
                          />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-400 font-serif italic mt-0.5">
                          {boundChar ? (
                            <span>Character: <strong className="text-rose-300 not-italic">{boundChar.name}</strong> ({boundChar.clan})</span>
                          ) : (
                            <span className="text-neutral-500">No Character Bound</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Peer Telemetry & Host Moderation Controls */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-[10px] font-mono text-neutral-400 bg-black/40 px-2 py-1 rounded border border-neutral-800">
                        {peer.pingMs > 0 ? `${peer.pingMs}ms` : '<1ms'}
                      </span>

                      {/* Host controls for other peers */}
                      {isHost && !isLocal && (
                        <div className="flex items-center gap-1.5">
                          <select
                            value={peer.role}
                            onChange={e => peerService.promotePeer(peer.peerId, e.target.value as PeerRole)}
                            aria-label={`Change role for ${peer.playerName}`}
                            className="bg-[#181824] border border-[#2d2d42] text-[11px] text-neutral-300 rounded px-2 py-1 cursor-pointer font-cinzel"
                          >
                            <option value="player">Player</option>
                            <option value="co_storyteller">Co-Storyteller</option>
                            <option value="spectator">Spectator</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => peerService.kickPeer(peer.peerId)}
                            className="p-1.5 rounded bg-red-950/40 hover:bg-red-950 border border-red-900/60 text-red-400 transition cursor-pointer"
                            title="Dismiss Kindred from Chamber"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leave Chamber Button */}
          <div className="pt-4 border-t border-[#1e1e2c] flex justify-end">
            <GothicButton
              variant="aggravated"
              size="sm"
              icon={LogOut}
              onClick={handleLeaveRoom}
            >
              Disconnect From Chamber
            </GothicButton>
          </div>
        </div>
      )}

      {/* TAB 2: HOST CHAMBER */}
      {activeTab === 'host' && (
        <div className="space-y-5">
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/50 flex items-start gap-3">
            <Crown className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-300 leading-relaxed">
              <strong className="text-amber-200 block font-cinzel mb-1">STORYTELLER CHAMBER INITIATION</strong>
              Generate a unique gothic frequency to orchestrate your chronicle. Connected players will instantly receive public dice rolls, tension alerts, and can receive telepathic whispers behind your screen.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-cinzel uppercase tracking-wider text-neutral-400 mb-1.5">
                Chamber Code
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={hostCustomCode}
                  onChange={e => setHostCustomCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#101018] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm font-mono font-bold tracking-wider text-amber-200 uppercase"
                  placeholder="SANG-4X"
                  maxLength={10}
                />
                <button
                  type="button"
                  onClick={() => setHostCustomCode(peerService.generateRoomCode())}
                  className="p-2.5 rounded-lg bg-[#181824] hover:bg-[#242436] border border-[#2d2d42] text-neutral-300 cursor-pointer"
                  title="Generate New Gothic Code"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-cinzel uppercase tracking-wider text-neutral-400 mb-1.5">
                Storyteller Name
              </label>
              <input
                type="text"
                value={hostName}
                onChange={e => setHostName(e.target.value)}
                className="w-full bg-[#101018] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-neutral-200"
                placeholder="Storyteller"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel uppercase tracking-wider text-neutral-400 mb-1.5">
                Authority Role
              </label>
              <select
                value={hostRole}
                onChange={e => setHostRole(e.target.value as PeerRole)}
                className="w-full bg-[#101018] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-neutral-200 font-cinzel"
              >
                <option value="storyteller">Primary Storyteller (GM)</option>
                <option value="co_storyteller">Co-Storyteller / Assistant</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-cinzel uppercase tracking-wider text-neutral-400 mb-1.5">
                Bound Character (Optional)
              </label>
              <select
                value={hostCharId}
                onChange={e => setHostCharId(e.target.value)}
                className="w-full bg-[#101018] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-neutral-200 font-serif"
              >
                <option value="">No Character (Storyteller Persona)</option>
                {characters.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.clan})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <GothicButton
              variant="gold"
              size="lg"
              icon={Crown}
              onClick={handleHostRoom}
              className="w-full sm:w-auto"
            >
              Initiate Chamber ({hostCustomCode || 'AUTO'})
            </GothicButton>
          </div>
        </div>
      )}

      {/* TAB 3: JOIN TABLE */}
      {activeTab === 'join' && (
        <div className="space-y-5">
          <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/50 flex items-start gap-3">
            <Users className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-300 leading-relaxed">
              <strong className="text-rose-200 block font-cinzel mb-1">JOIN COTERIE CHAMBER</strong>
              Enter the 6-character gothic room code provided by your Storyteller (e.g., <code className="text-rose-300 font-mono">SANG-4X</code>). Your character damage, hunger, and rolls will automatically synchronize with the table.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-cinzel uppercase tracking-wider text-neutral-400 mb-1.5">
                Chamber Code
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                className="w-full bg-[#101018] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm font-mono font-bold tracking-widest text-rose-300 uppercase"
                placeholder="e.g. SANG-4X"
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel uppercase tracking-wider text-neutral-400 mb-1.5">
                Player Moniker
              </label>
              <input
                type="text"
                value={joinName}
                onChange={e => setJoinName(e.target.value)}
                className="w-full bg-[#101018] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-neutral-200"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel uppercase tracking-wider text-neutral-400 mb-1.5">
                Join Role
              </label>
              <select
                value={joinRole}
                onChange={e => setJoinRole(e.target.value as PeerRole)}
                className="w-full bg-[#101018] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-neutral-200 font-cinzel"
              >
                <option value="player">Player (Active Kindred)</option>
                <option value="spectator">Spectator / Observer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-cinzel uppercase tracking-wider text-neutral-400 mb-1.5">
                Bind Character Dossier
              </label>
              <select
                value={joinCharId}
                onChange={e => setJoinCharId(e.target.value)}
                className="w-full bg-[#101018] border border-[#2a2a3e] rounded-lg px-3 py-2 text-sm text-neutral-200 font-serif"
              >
                <option value="">Guest (No Character Bound)</option>
                {characters.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.clan})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <GothicButton
              variant="blood"
              size="lg"
              icon={Wifi}
              onClick={handleJoinRoom}
              disabled={!joinCode.trim()}
              className="w-full sm:w-auto"
            >
              Connect to Table
            </GothicButton>
          </div>
        </div>
      )}
    </GothicModal>
  );
};
