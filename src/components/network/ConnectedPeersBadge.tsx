import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Users, Radio, Activity } from 'lucide-react';
import { peerService } from '../../services/peerService';
import { RoomParticipant } from '../../types/network';

interface ConnectedPeersBadgeProps {
  onOpenLobby: () => void;
  className?: string;
}

export const ConnectedPeersBadge: React.FC<ConnectedPeersBadgeProps> = ({
  onOpenLobby,
  className = ''
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(peerService.isConnected());
  const [roomCode, setRoomCode] = useState<string | null>(peerService.getRoomCode());
  const [participants, setParticipants] = useState<RoomParticipant[]>(peerService.getParticipants());
  const [pingMs, setPingMs] = useState<number>(peerService.getPingMs());
  const [isHost, setIsHost] = useState<boolean>(peerService.isHost());

  useEffect(() => {
    const unsubConn = peerService.onConnectionChange((connected, code) => {
      setIsConnected(connected);
      setRoomCode(code);
      setIsHost(peerService.isHost());
    });

    const unsubParticipants = peerService.onParticipantsChange(list => {
      setParticipants(list);
      setPingMs(peerService.getPingMs());
    });

    // Refresh ping periodically
    const interval = setInterval(() => {
      setPingMs(peerService.getPingMs());
    }, 2000);

    return () => {
      unsubConn();
      unsubParticipants();
      clearInterval(interval);
    };
  }, []);

  const count = participants.length;

  if (!isConnected || !roomCode) {
    return (
      <button
        type="button"
        onClick={onOpenLobby}
        className={`px-2.5 py-1.5 rounded-lg bg-[#121218] hover:bg-rose-950/40 border border-[#242434] hover:border-rose-900/60 text-neutral-400 hover:text-rose-200 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer shadow-sm group ${className}`}
        title="Open P2P Tabletop Network Lobby"
      >
        <WifiOff className="w-3.5 h-3.5 text-neutral-500 group-hover:text-rose-400" />
        <span className="hidden md:inline font-cinzel text-[11px] tracking-wider">P2P Table</span>
        <span className="text-[10px] bg-neutral-900 px-1 rounded text-neutral-400 border border-neutral-800">
          Offline
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpenLobby}
      className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 transition cursor-pointer shadow-[0_0_12px_rgba(0,0,0,0.5)] ${
        isHost
          ? 'bg-amber-950/40 hover:bg-amber-950/70 border-amber-800/80 text-amber-200'
          : 'bg-emerald-950/40 hover:bg-emerald-950/70 border-emerald-800/80 text-emerald-200'
      } ${className}`}
      title={`Connected to table room ${roomCode}. Click to manage lobby.`}
    >
      {/* Pulsing connection status dot */}
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isHost ? 'bg-amber-400' : 'bg-emerald-400'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isHost ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
        />
      </span>

      {/* Room code label */}
      <div className="flex items-center gap-1">
        <Radio className="w-3 h-3 text-neutral-400" />
        <span className="font-bold tracking-wider">{roomCode}</span>
        <span className="text-[9px] uppercase tracking-wider px-1 rounded bg-black/50 border border-current opacity-80 hidden sm:inline">
          {isHost ? 'HOST' : 'PEER'}
        </span>
      </div>

      {/* Participant count */}
      <div className="flex items-center gap-1 text-[11px] text-neutral-300 pl-1 border-l border-white/10">
        <Users className="w-3 h-3 text-neutral-400" />
        <span>{count}</span>
      </div>

      {/* Ping indicator */}
      <div className="hidden lg:flex items-center gap-0.5 text-[10px] text-neutral-400 pl-1 border-l border-white/10 font-mono">
        <Activity className="w-2.5 h-2.5 text-neutral-500" />
        <span>{pingMs > 0 ? `${pingMs}ms` : '<1ms'}</span>
      </div>
    </button>
  );
};
