import React, { useState } from 'react';
import { Character, GameEdition } from '../../types/vtm';
import { CLANS_DATA } from '../../data/clans';
import { PREDATOR_TYPES_DATA } from '../../data/predatorTypes';
import { X, Save } from 'lucide-react';

interface SheetEditorModalProps {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
  onSave: (char: Character) => void;
}

export const SheetEditorModal: React.FC<SheetEditorModalProps> = ({
  character,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Character>({ ...character });

  if (!isOpen) return null;

  const handleChange = (field: keyof Character, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleAttrChange = (cat: 'physical' | 'social' | 'mental', attr: string, val: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [cat]: {
          ...prev.attributes[cat],
          [attr]: val
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update max health and willpower based on stamina + 3 / composure + resolve
    const stamina = formData.attributes.physical.stamina || 2;
    const resolve = formData.attributes.mental.resolve || 2;
    const composure = formData.attributes.social.composure || 2;

    const healthMax = stamina + 3;
    const willpowerMax = resolve + composure;

    // Adjust damage array length if max changed
    const newHealthDamage = new Array(healthMax).fill('none');
    for (let i = 0; i < Math.min(healthMax, formData.healthDamage.length); i++) {
      newHealthDamage[i] = formData.healthDamage[i];
    }

    const newWillpowerDamage = new Array(willpowerMax).fill('none');
    for (let i = 0; i < Math.min(willpowerMax, formData.willpowerDamage.length); i++) {
      newWillpowerDamage[i] = formData.willpowerDamage[i];
    }

    onSave({
      ...formData,
      healthMax,
      healthDamage: newHealthDamage,
      willpowerMax,
      willpowerDamage: newWillpowerDamage,
      updatedAt: Date.now()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0c0c11] border border-[#262635] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#1f1f2d]">
          <h2 className="font-cinzel text-lg font-bold text-neutral-100 tracking-wider">
            EDIT CHARACTER DOSSIER
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          {/* Identity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-400 font-cinzel mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                required
                className="w-full bg-[#14141e] border border-[#272738] rounded px-3 py-1.5 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-cinzel mb-1">Concept</label>
              <input
                type="text"
                value={formData.concept}
                onChange={e => handleChange('concept', e.target.value)}
                className="w-full bg-[#14141e] border border-[#272738] rounded px-3 py-1.5 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-cinzel mb-1">Clan</label>
              <select
                value={formData.clan}
                onChange={e => handleChange('clan', e.target.value)}
                className="w-full bg-[#14141e] border border-[#272738] rounded px-3 py-1.5 text-white"
              >
                {CLANS_DATA.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 font-cinzel mb-1">Generation</label>
              <input
                type="number"
                min="4"
                max="16"
                value={formData.generation}
                onChange={e => handleChange('generation', parseInt(e.target.value) || 12)}
                className="w-full bg-[#14141e] border border-[#272738] rounded px-3 py-1.5 text-white"
              />
            </div>

            {formData.edition === 'v5' && (
              <div>
                <label className="block text-neutral-400 font-cinzel mb-1">Predator Type</label>
                <select
                  value={formData.predatorType || 'Alleycat'}
                  onChange={e => handleChange('predatorType', e.target.value)}
                  className="w-full bg-[#14141e] border border-[#272738] rounded px-3 py-1.5 text-white"
                >
                  {PREDATOR_TYPES_DATA.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-neutral-400 font-cinzel mb-1">Sire</label>
              <input
                type="text"
                value={formData.sire || ''}
                onChange={e => handleChange('sire', e.target.value)}
                className="w-full bg-[#14141e] border border-[#272738] rounded px-3 py-1.5 text-white"
              />
            </div>
          </div>

          {/* V5 Ambition & Desire */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-neutral-400 font-cinzel mb-1">Ambition (Long-term Goal)</label>
              <input
                type="text"
                value={formData.ambition || ''}
                onChange={e => handleChange('ambition', e.target.value)}
                className="w-full bg-[#14141e] border border-[#272738] rounded px-3 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-400 font-cinzel mb-1">Desire (Nightly Goal)</label>
              <input
                type="text"
                value={formData.desire || ''}
                onChange={e => handleChange('desire', e.target.value)}
                className="w-full bg-[#14141e] border border-[#272738] rounded px-3 py-1.5 text-white"
              />
            </div>
          </div>

          {/* Haven & Coterie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-400 font-cinzel mb-1">Haven</label>
              <input
                type="text"
                value={formData.haven || ''}
                onChange={e => handleChange('haven', e.target.value)}
                className="w-full bg-[#14141e] border border-[#272738] rounded px-3 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-400 font-cinzel mb-1">Coterie</label>
              <input
                type="text"
                value={formData.coterie || ''}
                onChange={e => handleChange('coterie', e.target.value)}
                className="w-full bg-[#14141e] border border-[#272738] rounded px-3 py-1.5 text-white"
              />
            </div>
          </div>

          {/* Biography */}
          <div>
            <label className="block text-neutral-400 font-cinzel mb-1">Biography & Secrets</label>
            <textarea
              rows={3}
              value={formData.biography || ''}
              onChange={e => handleChange('biography', e.target.value)}
              className="w-full bg-[#14141e] border border-[#272738] rounded px-3 py-1.5 text-white"
            />
          </div>

          {/* Experience Track */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-400 font-cinzel mb-1">Total Experience (XP)</label>
              <input
                type="number"
                min="0"
                value={formData.experienceTotal}
                onChange={e => handleChange('experienceTotal', parseInt(e.target.value) || 0)}
                className="w-full bg-[#14141e] border border-[#272738] rounded px-3 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-400 font-cinzel mb-1">Spent Experience (XP)</label>
              <input
                type="number"
                min="0"
                value={formData.experienceSpent}
                onChange={e => handleChange('experienceSpent', parseInt(e.target.value) || 0)}
                className="w-full bg-[#14141e] border border-[#272738] rounded px-3 py-1.5 text-white"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-[#1f1f2d] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-[#181824] hover:bg-[#222232] text-neutral-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-rose-900 hover:bg-rose-800 text-white font-cinzel font-bold flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Dossier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
