import React, { useState } from 'react';
import { SessionNote } from '../../types/vtm';
import { Plus, Calendar, Award, BookOpen, Trash2 } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface SessionJournalProps {
  chronicleId: string;
  sessions: SessionNote[];
  onUpdateSessions: (sessions: SessionNote[]) => void;
}

export const SessionJournal: React.FC<SessionJournalProps> = ({
  chronicleId,
  sessions,
  onUpdateSessions
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [inGameDate, setInGameDate] = useState('');
  const [xp, setXp] = useState(2);
  const [summary, setSummary] = useState('');
  const [mysteries, setMysteries] = useState('');

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    const mysteryList = mysteries.split('\n').map(m => m.trim()).filter(m => m.length > 0);
    const newSession: SessionNote = {
      id: 'sess_' + Date.now(),
      chronicleId,
      sessionNumber: sessions.length + 1,
      title: title.trim() || `Session ${sessions.length + 1}`,
      inGameDate: inGameDate.trim() || 'Autumn 2026',
      realDate: new Date().toISOString().split('T')[0],
      xpAwarded: xp,
      summary: summary.trim(),
      mysteries: mysteryList
    };

    soundEngine.playCritical();
    onUpdateSessions([newSession, ...sessions]);
    setModalOpen(false);
    setTitle('');
    setInGameDate('');
    setSummary('');
    setMysteries('');
  };

  const handleDelete = (id: string) => {
    onUpdateSessions(sessions.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-[#0e0e13] border border-[#222230] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <h2 className="font-cinzel text-base font-bold text-neutral-100 tracking-wider">
            CHRONICLE TIMELINE & SESSION LOGS
          </h2>
          <p className="text-[11px] text-neutral-400">
            Record in-game calendar dates, Storyteller recaps, experience awards, and active plot threads.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 font-cinzel font-bold flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Log New Session
        </button>
      </div>

      {/* Sessions Timeline Cards */}
      <div className="space-y-4">
        {sessions.map(sess => (
          <div
            key={sess.id}
            className="bg-[#0b0b10] border border-[#20202d] rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c1c28] pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 font-cinzel font-bold flex items-center justify-center text-xs shrink-0">
                  #{sess.sessionNumber}
                </span>
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white">{sess.title}</h3>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
                    <span className="flex items-center gap-1 text-rose-400">
                      <Calendar className="w-3 h-3" /> In-Game: {sess.inGameDate}
                    </span>
                    <span>Played: {sess.realDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#161622] border border-[#272738] font-mono text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> +{sess.xpAwarded} XP
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(sess.id)}
                  className="text-neutral-500 hover:text-rose-400 p-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Summary */}
            <p className="text-xs text-neutral-300 leading-relaxed font-sans whitespace-pre-wrap">
              {sess.summary}
            </p>

            {/* Mysteries & Clues */}
            {sess.mysteries && sess.mysteries.length > 0 && (
              <div className="bg-[#12121b] border border-[#20202d] rounded-xl p-3.5 space-y-1.5 text-xs">
                <span className="font-cinzel text-neutral-400 font-bold text-[11px] block">
                  ACTIVE PLOT THREADS & CLUES:
                </span>
                <ul className="space-y-1 text-neutral-300">
                  {sess.mysteries.map((myst, mi) => (
                    <li key={mi} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{myst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="text-center py-12 text-neutral-500 text-xs font-cinzel">
            No session notes recorded yet. Log your first session to track the chronicle timeline.
          </div>
        )}
      </div>

      {/* Log Session Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0c0c11] border border-[#272738] rounded-xl max-w-lg w-full p-6 shadow-2xl relative text-xs">
            <h3 className="font-cinzel text-base font-bold text-neutral-100 tracking-wider mb-3">
              LOG CHRONICLE SESSION
            </h3>
            <form onSubmit={handleAddSession} className="space-y-3">
              <div>
                <label className="block text-neutral-400 font-cinzel mb-1">Session Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Shadows on the Waterfront"
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-cinzel mb-1">In-Game Date</label>
                  <input
                    type="text"
                    value={inGameDate}
                    onChange={e => setInGameDate(e.target.value)}
                    placeholder="e.g. October 31, 2026"
                    className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-cinzel mb-1">XP Awarded</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={xp}
                    onChange={e => setXp(parseInt(e.target.value) || 2)}
                    className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-cinzel mb-1">Session Narrative Recap</label>
                <textarea
                  rows={4}
                  required
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  placeholder="What transpired? Major combats, negotiations, Masquerade breaches..."
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-cinzel mb-1">Active Plot Threads (One per line)</label>
                <textarea
                  rows={2}
                  value={mysteries}
                  onChange={e => setMysteries(e.target.value)}
                  placeholder="Who sent the blood courier?&#10;Where is the sheriff hiding?"
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div className="pt-3 border-t border-[#1c1c28] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#181822] text-neutral-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-900 text-white font-cinzel font-bold"
                >
                  Record Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
