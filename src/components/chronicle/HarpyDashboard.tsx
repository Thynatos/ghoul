import React, { useState } from 'react';
import { BoonRecord } from '../../types/vtm';
import { Plus, Check, Trash2, Award, Clock } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface HarpyDashboardProps {
  chronicleId: string;
  boons: BoonRecord[];
  onUpdateBoons: (boons: BoonRecord[]) => void;
}

export const HarpyDashboard: React.FC<HarpyDashboardProps> = ({
  chronicleId,
  boons,
  onUpdateBoons
}) => {
  const [filterTier, setFilterTier] = useState<string>('all');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form State
  const [debtor, setDebtor] = useState('');
  const [creditor, setCreditor] = useState('');
  const [tier, setTier] = useState<BoonRecord['tier']>('minor');
  const [description, setDescription] = useState('');

  const filteredBoons = filterTier === 'all'
    ? boons
    : boons.filter(b => b.tier === filterTier);

  const handleAddBoon = (e: React.FormEvent) => {
    e.preventDefault();
    const newBoon: BoonRecord = {
      id: 'boon_' + Date.now(),
      chronicleId,
      debtor: debtor.trim(),
      creditor: creditor.trim(),
      tier,
      description: description.trim(),
      status: 'active',
      dateCreated: new Date().toISOString().split('T')[0]
    };

    soundEngine.playCritical();
    onUpdateBoons([newBoon, ...boons]);
    setAddModalOpen(false);
    setDebtor('');
    setCreditor('');
    setDescription('');
  };

  const handleToggleStatus = (id: string) => {
    const next = boons.map(b => {
      if (b.id === id) {
        const nextStatus: BoonRecord['status'] = b.status === 'active' ? 'repaid' : 'active';
        return { ...b, status: nextStatus };
      }
      return b;
    });
    soundEngine.playDiceRoll();
    onUpdateBoons(next);
  };

  const handleDelete = (id: string) => {
    onUpdateBoons(boons.filter(b => b.id !== id));
  };

  const tierBadges: Record<string, string> = {
    trivial: 'bg-neutral-800 text-neutral-300 border-neutral-700',
    minor: 'bg-blue-950 border-blue-700 text-blue-300',
    major: 'bg-amber-950 border-amber-600 text-amber-300',
    life: 'bg-rose-950 border-rose-600 text-rose-300 font-bold shadow-[0_0_8px_rgba(225,29,72,0.4)]'
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Filters */}
      <div className="bg-[#0e0e13] border border-[#222230] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 font-cinzel font-bold flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Record New Boon
          </button>

          <div className="flex items-center gap-1 border-l border-[#242435] pl-3">
            <span className="font-cinzel text-neutral-400 font-bold mr-1">Tier:</span>
            {['all', 'trivial', 'minor', 'major', 'life'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterTier(t)}
                className={`px-2 py-1 rounded capitalize font-medium transition ${
                  filterTier === t
                    ? 'bg-rose-950 border border-rose-700 text-rose-300'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="font-mono text-neutral-400 text-[11px]">
          {boons.filter(b => b.status === 'active').length} Active Boons in Ledger
        </div>
      </div>

      {/* Boons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBoons.map(boon => {
          const isRepaid = boon.status === 'repaid';
          return (
            <div
              key={boon.id}
              className={`p-4 rounded-xl border text-xs space-y-2.5 transition relative overflow-hidden ${
                isRepaid
                  ? 'bg-[#09090d]/60 border-[#1a1a24] opacity-60'
                  : 'bg-[#0e0e14] border-[#222230] hover:border-[#353549] shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between gap-2 border-b border-[#1c1c28] pb-2">
                <span className={`px-2 py-0.5 rounded border text-[10px] font-cinzel uppercase ${tierBadges[boon.tier]}`}>
                  {boon.tier} Boon
                </span>
                <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {boon.dateCreated}
                </span>
              </div>

              {/* Debtor & Creditor */}
              <div className="flex items-center justify-between font-cinzel text-sm">
                <div>
                  <span className="text-neutral-500 text-[10px] block font-sans">DEBTOR (OWES)</span>
                  <span className="font-bold text-rose-300">{boon.debtor}</span>
                </div>
                <span className="text-neutral-500 font-mono text-xs">➔</span>
                <div className="text-right">
                  <span className="text-neutral-500 text-[10px] block font-sans">CREDITOR (OWED TO)</span>
                  <span className="font-bold text-emerald-300">{boon.creditor}</span>
                </div>
              </div>

              <p className="text-neutral-300 italic text-[11px] leading-relaxed pt-1">
                "{boon.description}"
              </p>

              {/* Footer controls */}
              <div className="pt-2 border-t border-[#1a1a26] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(boon.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 border transition ${
                    isRepaid
                      ? 'bg-neutral-900 border-neutral-700 text-neutral-400'
                      : 'bg-emerald-950/70 border-emerald-700 text-emerald-300 hover:bg-emerald-900'
                  }`}
                >
                  <Check className="w-3 h-3" /> {isRepaid ? 'Mark as Active' : 'Mark Repaid'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(boon.id)}
                  className="text-neutral-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBoons.length === 0 && (
        <div className="text-center py-12 text-neutral-500 text-xs font-cinzel">
          No boons recorded for this filter.
        </div>
      )}

      {/* Add Boon Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0c0c11] border border-[#272738] rounded-xl max-w-md w-full p-6 shadow-2xl relative text-xs">
            <h3 className="font-cinzel text-base font-bold text-neutral-100 tracking-wider mb-3">
              RECORD KINDRED SOCIAL DEBT
            </h3>
            <form onSubmit={handleAddBoon} className="space-y-3">
              <div>
                <label className="block text-neutral-400 font-cinzel mb-1">Debtor (Who owes the boon) *</label>
                <input
                  type="text"
                  required
                  value={debtor}
                  onChange={e => setDebtor(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-cinzel mb-1">Creditor (Who is owed the boon) *</label>
                <input
                  type="text"
                  required
                  value={creditor}
                  onChange={e => setCreditor(e.target.value)}
                  placeholder="e.g. Prince Kevin Jackson"
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-cinzel mb-1">Boon Tier</label>
                <select
                  value={tier}
                  onChange={e => setTier(e.target.value as any)}
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                >
                  <option value="trivial">Trivial Boon (Minor courtesy, taxi, discrete tip)</option>
                  <option value="minor">Minor Boon (Discreet favor, police interference, haven access)</option>
                  <option value="major">Major Boon (Territory grant, feeding license, Masquerade coverup)</option>
                  <option value="life">Life Boon (Saving from Final Death or Blood Hunt)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-cinzel mb-1">Description & Circumstance</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What was given or promised in exchange for this debt?"
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div className="pt-3 border-t border-[#1c1c28] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#181822] text-neutral-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-900 text-white font-cinzel font-bold"
                >
                  Inscribe in Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
