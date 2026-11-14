import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  Send, 
  Sparkles, 
  Brain, 
  Trash2, 
  Crown, 
  Volume2, 
  ShieldAlert,
  Flame,
  Radio
} from 'lucide-react';
import { GothicDrawer } from '../ui/GothicDrawer';
import { GothicButton } from '../ui/GothicButton';
import { GothicBadge } from '../ui/GothicBadge';
import { peerService } from '../../services/peerService';
import { syncEngine } from '../../services/syncEngine';
import { soundEngine } from '../../services/soundEngine';
import { WhisperMessage, WhisperDiscipline, RoomParticipant } from '../../types/network';

interface SecretWhisperDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRecipientPeerId?: string;
}

export const SecretWhisperDrawer: React.FC<SecretWhisperDrawerProps> = ({
  isOpen,
  onClose,
  defaultRecipientPeerId
}) => {
  const [whispers, setWhispers] = useState<WhisperMessage[]>(syncEngine.getWhispers());
  const [participants, setParticipants] = useState<RoomParticipant[]>(peerService.getParticipants());
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(defaultRecipientPeerId || '');
  const [discipline, setDiscipline] = useState<WhisperDiscipline>('Auspex');
  const [messageText, setMessageText] = useState<string>('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const localPeer = peerService.getLocalPeer();
  const otherParticipants = participants.filter(p => p.peerId !== localPeer.peerId);

  useEffect(() => {
    // When drawer opens, mark all whispers as read
    if (isOpen) {
      syncEngine.markWhispersAsRead();
    }

    const unsubWhispers = syncEngine.onWhisper(() => {
      setWhispers(syncEngine.getWhispers());
      if (isOpen) {
        syncEngine.markWhispersAsRead();
      }
      scrollToBottom();
    });

    const unsubParticipants = peerService.onParticipantsChange(list => {
      setParticipants(list);
    });

    return () => {
      unsubWhispers();
      unsubParticipants();
    };
  }, [isOpen]);

  useEffect(() => {
    if (defaultRecipientPeerId) {
      setSelectedRecipientId(defaultRecipientPeerId);
    } else if (otherParticipants.length > 0 && !selectedRecipientId) {
      setSelectedRecipientId(otherParticipants[0].peerId);
    }
  }, [defaultRecipientPeerId, otherParticipants]);

  useEffect(() => {
    scrollToBottom();
  }, [whispers, isOpen]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendWhisper = () => {
    if (!messageText.trim() || !selectedRecipientId) return;

    const recipient = participants.find(p => p.peerId === selectedRecipientId);
    const recipientName = recipient?.playerName || 'Kindred';

    syncEngine.sendWhisper(selectedRecipientId, recipientName, messageText.trim(), discipline);
    setMessageText('');
    setWhispers(syncEngine.getWhispers());

    // Play tactile heartbeat sound
    try {
      soundEngine.playHeartbeat();
    } catch (e) {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendWhisper();
    }
  };

  const getDisciplineDetails = (disc?: WhisperDiscipline) => {
    switch (disc) {
      case 'Auspex':
        return {
          icon: Eye,
          color: 'text-purple-400',
          badgeVariant: 'violet' as const,
          border: 'border-purple-900/60 bg-purple-950/20',
          label: 'Auspex Telepathy'
        };
      case 'Dominate':
        return {
          icon: Brain,
          color: 'text-rose-400',
          badgeVariant: 'blood' as const,
          border: 'border-rose-900/60 bg-rose-950/20',
          label: 'Dominate Compulsion'
        };
      case 'Presence':
        return {
          icon: Crown,
          color: 'text-amber-400',
          badgeVariant: 'gold' as const,
          border: 'border-amber-900/60 bg-amber-950/20',
          label: 'Presence Allure'
        };
      default:
        return {
          icon: Sparkles,
          color: 'text-neutral-400',
          badgeVariant: 'slate' as const,
          border: 'border-neutral-800 bg-neutral-900/40',
          label: 'Secret Whisper'
        };
    }
  };

  return (
    <GothicDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple-400 animate-pulse" />
          <span>TELEPATHIC WHISPERS</span>
        </div>
      }
      subtitle="Encrypted mental communication between Storyteller and Kindred"
      width="max-w-xl"
      action={
        whispers.length > 0 && (
          <button
            type="button"
            onClick={() => {
              syncEngine.clearWhispers();
              setWhispers([]);
            }}
            className="p-1.5 text-neutral-500 hover:text-rose-400 transition cursor-pointer"
            title="Purge Telepathic Logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )
      }
    >
      <div className="flex flex-col h-[calc(100vh-180px)]">
        {/* Recipient and Discipline Selector Bar */}
        <div className="p-3 bg-[#0d0d14] border border-[#20202e] rounded-xl mb-4 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="flex-1">
              <label className="block text-[10px] font-cinzel uppercase tracking-wider text-neutral-400 mb-1">
                Mental Conduit Recipient
              </label>
              {otherParticipants.length === 0 ? (
                <div className="text-xs font-mono text-amber-300 bg-amber-950/30 border border-amber-900/40 rounded p-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>No other Kindred currently connected to this chamber.</span>
                </div>
              ) : (
                <select
                  value={selectedRecipientId}
                  onChange={e => setSelectedRecipientId(e.target.value)}
                  className="w-full bg-[#14141e] border border-[#2b2b3d] text-xs text-neutral-200 rounded px-2.5 py-1.5 font-cinzel cursor-pointer"
                >
                  {otherParticipants.map(p => (
                    <option key={p.peerId} value={p.peerId}>
                      {p.playerName} ({p.role.toUpperCase()})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Discipline Selection */}
            <div>
              <label className="block text-[10px] font-cinzel uppercase tracking-wider text-neutral-400 mb-1">
                Discipline Attunement
              </label>
              <div className="flex items-center gap-1 bg-[#14141e] border border-[#2b2b3d] rounded p-1">
                {(['Auspex', 'Dominate', 'Presence'] as WhisperDiscipline[]).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiscipline(d)}
                    className={`px-2 py-1 text-[11px] font-cinzel font-bold rounded transition cursor-pointer ${
                      discipline === d
                        ? d === 'Auspex'
                          ? 'bg-purple-900 text-purple-100 shadow-sm'
                          : d === 'Dominate'
                          ? 'bg-rose-900 text-rose-100 shadow-sm'
                          : 'bg-amber-900 text-amber-100 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Telepathic Transmission Stream */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
          {whispers.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-500">
              <Eye className="w-12 h-12 text-neutral-700 mb-3 animate-pulse" />
              <p className="font-cinzel text-sm text-neutral-400 tracking-wider">The astral ether is silent</p>
              <p className="text-xs font-serif italic text-neutral-500 mt-1 max-w-sm">
                Whispers transmitted through Auspex or Dominate are strictly private between you and the chosen recipient.
              </p>
            </div>
          ) : (
            whispers.map(w => {
              const isFromMe = w.senderId === localPeer.peerId;
              const details = getDisciplineDetails(w.discipline);
              const Icon = details.icon;

              return (
                <div
                  key={w.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isFromMe
                      ? 'ml-8 bg-[#12121b] border-neutral-800'
                      : `mr-8 ${details.border} shadow-lg`
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${details.color}`} />
                      <span className="font-cinzel text-xs font-bold text-neutral-200">
                        {isFromMe ? `To: ${w.recipientName}` : `From: ${w.senderName}`}
                      </span>
                      {w.discipline && (
                        <GothicBadge
                          label={details.label}
                          variant={details.badgeVariant}
                          size="sm"
                        />
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-neutral-500">
                      {new Date(w.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-serif italic text-neutral-200 leading-relaxed pl-5 border-l-2 border-current whitespace-pre-wrap">
                    "{w.text}"
                  </p>
                </div>
              );
            })
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Message Composition Input */}
        <div className="pt-3 border-t border-[#20202e] shrink-0">
          <div className="flex items-center gap-2">
            <textarea
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={otherParticipants.length === 0}
              placeholder={
                otherParticipants.length === 0
                  ? 'Connect other Kindred to enable mental conduit...'
                  : `Transmit telepathic thought via ${discipline}... (Enter to send)`
              }
              rows={2}
              className="flex-1 bg-[#101018] border border-[#2a2a3e] focus:border-purple-600 rounded-xl px-3 py-2 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none resize-none"
            />
            <GothicButton
              variant={discipline === 'Auspex' ? 'slate' : discipline === 'Dominate' ? 'blood' : 'gold'}
              size="md"
              icon={Send}
              onClick={handleSendWhisper}
              disabled={!messageText.trim() || !selectedRecipientId}
            >
              Send
            </GothicButton>
          </div>
          <p className="text-[10px] font-mono text-neutral-500 mt-1 flex items-center justify-between">
            <span>Press Enter to send, Shift+Enter for newline</span>
            <span>Zero-Logs Ephemeral P2P</span>
          </p>
        </div>
      </div>
    </GothicDrawer>
  );
};
