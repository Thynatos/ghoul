import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Flame, 
  Home, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  BookOpen, 
  Crown, 
  UserCheck, 
  Lock, 
  Eye, 
  Sparkles,
  Info,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { Coterie, CoterieMember, CoterieTypeInfo } from '../../types/coterie';
import { Character, MeritFlaw } from '../../types/vtm';
import { COTERIE_TYPES, HAVEN_TRAIT_OPTIONS } from '../../data/coterieTypes';
import { storageService } from '../../services/storage';
import { PipCounter } from '../common/PipCounter';

interface CoterieManagerViewProps {
  characters?: Character[];
  onShowToast?: (title: string, desc?: string, type?: 'info' | 'blood' | 'success' | 'error') => void;
  onNavigateCharacter?: (charId: string) => void;
}

export const CoterieManagerView: React.FC<CoterieManagerViewProps> = ({
  characters = [],
  onShowToast,
  onNavigateCharacter
}) => {
  const [coteries, setCoteries] = useState<Coterie[]>(storageService.getCoteries());
  const [activeCoterieId, setActiveCoterieId] = useState<string>(
    coteries[0]?.id || ''
  );
  
  // Modals / Editors
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [addAdvantageModalOpen, setAddAdvantageModalOpen] = useState(false);
  const [customTraitInput, setCustomTraitInput] = useState('');

  // Active Coterie
  const activeCoterie = coteries.find(c => c.id === activeCoterieId) || coteries[0];

  // Selected Type Metadata
  const currentTypeInfo = COTERIE_TYPES.find(
    t => t.id === activeCoterie?.type || t.name.toLowerCase() === activeCoterie?.type?.toLowerCase()
  ) || COTERIE_TYPES[0];

  // Form states for Header Edit
  const [editName, setEditName] = useState('');
  const [editConcept, setEditConcept] = useState('');
  const [editType, setEditType] = useState('champions');
  const [editTier, setEditTier] = useState(2);
  const [editNotes, setEditNotes] = useState('');

  // Member assignment state
  const [selectedCharId, setSelectedCharId] = useState('');
  const [selectedRole, setSelectedRole] = useState<CoterieMember['role']>('Member');

  // Shared Advantage state
  const [advName, setAdvName] = useState('');
  const [advType, setAdvType] = useState<'merit' | 'flaw'>('merit');
  const [advDots, setAdvDots] = useState(2);
  const [advDetails, setAdvDetails] = useState('');

  useEffect(() => {
    if (coteries.length > 0 && !activeCoterieId) {
      setActiveCoterieId(coteries[0].id);
    }
  }, [coteries, activeCoterieId]);

  const saveCoterie = (updated: Coterie) => {
    storageService.saveCoterie(updated);
    const refreshed = storageService.getCoteries();
    setCoteries(refreshed);
  };

  const handleStartEditHeader = () => {
    if (!activeCoterie) return;
    setEditName(activeCoterie.name);
    setEditConcept(activeCoterie.concept);
    setEditType(activeCoterie.type);
    setEditTier(activeCoterie.tier);
    setEditNotes(activeCoterie.notes);
    setIsEditingHeader(true);
  };

  const handleSaveHeader = () => {
    if (!activeCoterie) return;
    const updated: Coterie = {
      ...activeCoterie,
      name: editName.trim() || activeCoterie.name,
      concept: editConcept.trim() || activeCoterie.concept,
      type: editType,
      tier: editTier,
      notes: editNotes
    };
    saveCoterie(updated);
    setIsEditingHeader(false);
    if (onShowToast) onShowToast('Coterie Updated', `${updated.name} records saved.`, 'success');
  };

  const handleCreateNewCoterie = () => {
    const newCot: Coterie = {
      id: 'coterie_' + Date.now(),
      chronicleId: storageService.getActiveChronicleId() || 'chronicle_chicago_1',
      name: `Coterie ${coteries.length + 1}`,
      concept: 'Newly Formed Kindred Alliance',
      type: 'champions',
      tier: 1,
      memberIds: characters[0] ? [characters[0].id] : [],
      members: characters[0] ? [
        {
          characterId: characters[0].id,
          name: characters[0].name,
          clan: characters[0].clan,
          role: 'Leader',
          portraitUrl: characters[0].portraitUrl
        }
      ] : [],
      chasse: 1,
      lien: 1,
      portillon: 1,
      havenTraits: ['Armory', 'Hidden Escape Tunnels'],
      sharedAdvantages: [],
      notes: 'Formed under blood oath for mutual protection.'
    };
    storageService.saveCoterie(newCot);
    const refreshed = storageService.getCoteries();
    setCoteries(refreshed);
    setActiveCoterieId(newCot.id);
    if (onShowToast) onShowToast('New Coterie Established', 'Domain ledger open.', 'blood');
  };

  const handleDeleteCoterie = (id: string) => {
    if (coteries.length <= 1) {
      if (onShowToast) onShowToast('Cannot Delete', 'At least one coterie must remain.', 'error');
      return;
    }
    storageService.deleteCoterie(id);
    const refreshed = storageService.getCoteries();
    setCoteries(refreshed);
    setActiveCoterieId(refreshed[0]?.id || '');
    if (onShowToast) onShowToast('Coterie Disbanded', 'Alliance dissolved.', 'info');
  };

  // Domain Pips Change
  const handleUpdateDomainRating = (field: 'chasse' | 'lien' | 'portillon', val: number) => {
    if (!activeCoterie) return;
    const updated: Coterie = {
      ...activeCoterie,
      [field]: val
    };
    saveCoterie(updated);
  };

  // Toggle Haven Feature
  const handleToggleHavenTrait = (traitName: string) => {
    if (!activeCoterie) return;
    const hasTrait = activeCoterie.havenTraits.includes(traitName);
    const updatedTraits = hasTrait
      ? activeCoterie.havenTraits.filter(t => t !== traitName)
      : [...activeCoterie.havenTraits, traitName];

    saveCoterie({
      ...activeCoterie,
      havenTraits: updatedTraits
    });
  };

  // Add Custom Haven Feature
  const handleAddCustomTrait = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCoterie || !customTraitInput.trim()) return;
    if (activeCoterie.havenTraits.includes(customTraitInput.trim())) return;

    saveCoterie({
      ...activeCoterie,
      havenTraits: [...activeCoterie.havenTraits, customTraitInput.trim()]
    });
    setCustomTraitInput('');
  };

  // Add Member to Coterie
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCoterie || !selectedCharId) return;

    const char = characters.find(c => c.id === selectedCharId);
    if (!char) return;

    // Check if already in member list
    const currentMembers = activeCoterie.members || [];
    if (currentMembers.some(m => m.characterId === char.id)) {
      if (onShowToast) onShowToast('Already Member', `${char.name} is already sworn to this coterie.`, 'error');
      return;
    }

    const newMember: CoterieMember = {
      characterId: char.id,
      name: char.name,
      clan: char.clan,
      role: selectedRole,
      portraitUrl: char.portraitUrl
    };

    const updatedMembers = [...currentMembers, newMember];
    const updatedMemberIds = Array.from(new Set([...activeCoterie.memberIds, char.id]));

    saveCoterie({
      ...activeCoterie,
      memberIds: updatedMemberIds,
      members: updatedMembers
    });

    setAddMemberModalOpen(false);
    setSelectedCharId('');
    if (onShowToast) onShowToast('Member Sworn In', `${char.name} joined as ${selectedRole}.`, 'success');
  };

  const handleRemoveMember = (charId: string) => {
    if (!activeCoterie) return;
    const updatedMembers = (activeCoterie.members || []).filter(m => m.characterId !== charId);
    const updatedMemberIds = activeCoterie.memberIds.filter(id => id !== charId);

    saveCoterie({
      ...activeCoterie,
      memberIds: updatedMemberIds,
      members: updatedMembers
    });
  };

  // Add Shared Advantage
  const handleAddSharedAdvantage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCoterie || !advName.trim()) return;

    const newAdv: MeritFlaw = {
      id: 'shared_adv_' + Date.now(),
      name: advName.trim(),
      type: advType,
      category: 'haven',
      dots: advDots,
      details: advDetails.trim()
    };

    saveCoterie({
      ...activeCoterie,
      sharedAdvantages: [...(activeCoterie.sharedAdvantages || []), newAdv]
    });

    setAdvName('');
    setAdvDetails('');
    setAddAdvantageModalOpen(false);
    if (onShowToast) onShowToast('Shared Advantage Added', `${newAdv.name} recorded.`, 'info');
  };

  const handleDeleteSharedAdvantage = (advId: string) => {
    if (!activeCoterie) return;
    saveCoterie({
      ...activeCoterie,
      sharedAdvantages: (activeCoterie.sharedAdvantages || []).filter(a => a.id !== advId)
    });
  };

  if (!activeCoterie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Users className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="font-cinzel text-xl text-white font-bold">No Coterie Records Found</h2>
        <button
          type="button"
          onClick={handleCreateNewCoterie}
          className="mt-4 px-4 py-2 rounded-lg bg-rose-900 hover:bg-rose-800 text-white font-cinzel text-xs tracking-wider"
        >
          Form New Coterie
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Bar: Selector & Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0a0a0f] border border-[#1d1d2b] p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.4)]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              COMMUNAL DOMAIN & HAVEN ARCHIVE
            </span>
            <div className="flex items-center gap-2">
              <select
                value={activeCoterie.id}
                onChange={e => setActiveCoterieId(e.target.value)}
                className="bg-transparent font-cinzel text-lg font-bold text-white focus:outline-none cursor-pointer"
              >
                {coteries.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#101018] text-white">
                    {c.name} (Tier {c.tier})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCreateNewCoterie}
            className="px-3.5 py-1.5 rounded-lg bg-[#14141e] hover:bg-[#20202e] border border-[#2b2b3d] text-xs font-cinzel text-neutral-200 hover:text-white flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5 text-rose-400" />
            Form New Coterie
          </button>
          <button
            type="button"
            onClick={() => handleDeleteCoterie(activeCoterie.id)}
            className="p-2 rounded-lg bg-[#14141e] hover:bg-red-950/40 border border-[#2b2b3d] hover:border-red-800 text-neutral-400 hover:text-red-300 transition"
            title="Disband Coterie"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Coterie Dossier Card */}
      <div className="bg-[#0b0b12] border border-[#1e1e2c] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-950/10 rounded-full blur-3xl pointer-events-none" />

        {/* Coterie Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-[#1b1b26] gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-950/80 border border-rose-800 text-rose-300 uppercase">
                {currentTypeInfo.name}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-[#161622] border border-[#28283a] text-neutral-300">
                DOMAIN TIER {activeCoterie.tier}
              </span>
              <span className="text-xs text-neutral-400 font-sans">
                • {activeCoterie.members?.length || 0} Sworn Kindred
              </span>
            </div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-white tracking-wide">
              {activeCoterie.name}
            </h1>
            <p className="text-sm text-neutral-300 italic mt-1 font-sans">
              "{activeCoterie.concept}"
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartEditHeader}
            className="px-3.5 py-2 rounded-lg bg-[#14141e] hover:bg-[#20202e] border border-[#2b2b3d] text-xs font-cinzel text-neutral-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-rose-400" />
            Edit Coterie & Domain
          </button>
        </div>

        {/* DOMAIN RATINGS: CHASSE, LIEN, PORTILLON */}
        <div className="py-6 border-b border-[#1b1b26]">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-rose-500" />
            <h3 className="font-cinzel text-sm font-bold text-neutral-100 tracking-wider">
              DOMAIN ATTRIBUTES (THE THREE PILLARS)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Chasse */}
            <div className="bg-[#0f0f18] border border-[#222232] rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-cinzel font-bold text-rose-300 text-sm">CHASSE</span>
                  <span className="text-xs font-mono font-bold text-rose-400">{activeCoterie.chasse} / 5</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                  Richness and quality of feeding grounds. Reduces hunting difficulty and slakes hunger with fewer Masquerade complications.
                </p>
              </div>
              <div className="pt-2 border-t border-[#1a1a26]">
                <PipCounter
                  value={activeCoterie.chasse}
                  max={5}
                  min={0}
                  color="blood"
                  size="md"
                  onChange={val => handleUpdateDomainRating('chasse', val)}
                />
              </div>
            </div>

            {/* Lien */}
            <div className="bg-[#0f0f18] border border-[#222232] rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-cinzel font-bold text-amber-300 text-sm">LIEN</span>
                  <span className="text-xs font-mono font-bold text-amber-400">{activeCoterie.lien} / 5</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                  Sympathy, integration, and informal sway over mortal residents, street organizers, and neighborhood networks.
                </p>
              </div>
              <div className="pt-2 border-t border-[#1a1a26]">
                <PipCounter
                  value={activeCoterie.lien}
                  max={5}
                  min={0}
                  color="gold"
                  size="md"
                  onChange={val => handleUpdateDomainRating('lien', val)}
                />
              </div>
            </div>

            {/* Portillon */}
            <div className="bg-[#0f0f18] border border-[#222232] rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-cinzel font-bold text-slate-300 text-sm">PORTILLON</span>
                  <span className="text-xs font-mono font-bold text-slate-300">{activeCoterie.portillon} / 5</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                  Physical security, fortifications, electronic alarms, blast doors, and difficulty for intruders to breach the haven undetected.
                </p>
              </div>
              <div className="pt-2 border-t border-[#1a1a26]">
                <PipCounter
                  value={activeCoterie.portillon}
                  max={5}
                  min={0}
                  color="silver"
                  size="md"
                  onChange={val => handleUpdateDomainRating('portillon', val)}
                />
              </div>
            </div>

          </div>
        </div>

        {/* COMMUNAL HAVEN FEATURES */}
        <div className="py-6 border-b border-[#1b1b26]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-rose-500" />
              <h3 className="font-cinzel text-sm font-bold text-neutral-100 tracking-wider">
                COMMUNAL HAVEN FEATURES & DEFENSES
              </h3>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              {activeCoterie.havenTraits.length} Active Traits
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {HAVEN_TRAIT_OPTIONS.map(trait => {
              const isSelected = activeCoterie.havenTraits.includes(trait.name);
              return (
                <button
                  key={trait.id}
                  type="button"
                  onClick={() => handleToggleHavenTrait(trait.name)}
                  className={`
                    p-3 rounded-xl border text-left transition flex flex-col justify-between min-h-[96px] cursor-pointer
                    ${isSelected 
                      ? 'bg-rose-950/50 border-rose-600 shadow-[0_0_12px_rgba(225,29,72,0.2)] text-white' 
                      : 'bg-[#0e0e16] border-[#222232] text-neutral-400 hover:border-neutral-600'}
                  `}
                  title={trait.description}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-cinzel text-xs font-bold">{trait.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-rose-400" />}
                  </div>
                  <p className="text-[10px] text-neutral-300 font-sans leading-tight line-clamp-3">
                    {trait.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Custom Trait Input */}
          <form onSubmit={handleAddCustomTrait} className="mt-4 flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Add custom haven trait (e.g. Helipad, Cold-Sleep Pods)..."
              value={customTraitInput}
              onChange={e => setCustomTraitInput(e.target.value)}
              className="flex-1 bg-[#12121c] border border-[#2a2a3e] rounded-lg px-3 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-rose-600"
            />
            <button
              type="submit"
              disabled={!customTraitInput.trim()}
              className="px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 disabled:opacity-50 text-white font-cinzel text-xs transition"
            >
              Add Trait
            </button>
          </form>
        </div>

        {/* SWORN MEMBER ROSTER */}
        <div className="py-6 border-b border-[#1b1b26]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-rose-500" />
              <h3 className="font-cinzel text-sm font-bold text-neutral-100 tracking-wider">
                SWORN COTERIE ROSTER
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setAddMemberModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-[#14141e] hover:bg-[#20202e] border border-[#2b2b3d] text-xs font-cinzel text-neutral-200 hover:text-white flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5 text-rose-400" />
              Swear In Member
            </button>
          </div>

          {(!activeCoterie.members || activeCoterie.members.length === 0) ? (
            <div className="p-6 text-center bg-[#0e0e16] border border-[#222232] rounded-xl text-neutral-400 text-xs font-cinzel">
              No kindred currently assigned to this coterie.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeCoterie.members.map(member => (
                <div
                  key={member.characterId}
                  className="bg-[#0f0f18] border border-[#222232] hover:border-neutral-600 rounded-xl p-3.5 flex items-center justify-between gap-3 transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.portraitUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={member.name}
                      className="w-11 h-11 rounded-lg object-cover border border-rose-900/50"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onNavigateCharacter && onNavigateCharacter(member.characterId)}
                          className="font-cinzel text-xs font-bold text-white hover:text-rose-400 transition text-left"
                        >
                          {member.name}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 font-bold">
                          {member.role}
                        </span>
                        {member.clan && (
                          <span className="text-[10px] text-neutral-400 font-sans">
                            {member.clan}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.characterId)}
                    className="p-1 rounded text-neutral-500 hover:text-red-400 transition"
                    title="Remove member from coterie"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SHARED ADVANTAGES & MERITS */}
        <div className="py-6 border-b border-[#1b1b26]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <h3 className="font-cinzel text-sm font-bold text-neutral-100 tracking-wider">
                COMMUNAL BACKGROUNDS & SHARED MERITS
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setAddAdvantageModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-[#14141e] hover:bg-[#20202e] border border-[#2b2b3d] text-xs font-cinzel text-neutral-200 hover:text-white flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5 text-rose-400" />
              Add Advantage
            </button>
          </div>

          {(!activeCoterie.sharedAdvantages || activeCoterie.sharedAdvantages.length === 0) ? (
            <p className="text-xs text-neutral-400 italic font-sans">No shared communal advantages recorded.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeCoterie.sharedAdvantages.map(adv => (
                <div
                  key={adv.id}
                  className="bg-[#0f0f18] border border-[#222232] rounded-xl p-3 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel text-xs font-bold text-neutral-100">{adv.name}</span>
                      <span className="text-[10px] font-mono text-rose-400">{'●'.repeat(adv.dots)}</span>
                    </div>
                    {adv.details && (
                      <p className="text-[11px] text-neutral-400 mt-1 font-sans">{adv.details}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSharedAdvantage(adv.id)}
                    className="p-1 rounded text-neutral-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COTERIE ARCHETYPE COMPENDIUM REFERENCE */}
        <div className="py-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-neutral-400" />
            <h3 className="font-cinzel text-sm font-bold text-neutral-200 tracking-wider">
              CANONICAL COTERIE ARCHETYPE: {currentTypeInfo.name.toUpperCase()}
            </h3>
          </div>
          
          <div className="bg-[#0c0c14] border border-[#1d1d2b] rounded-xl p-4 space-y-3 text-xs">
            <p className="text-neutral-300 leading-relaxed font-sans">
              {currentTypeInfo.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#1a1a26]">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Domain Focus:</span>
                <p className="text-neutral-200 font-sans">{currentTypeInfo.domainRole}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Favored Disciplines:</span>
                <p className="text-rose-200 font-cinzel font-semibold tracking-wide text-xs">{currentTypeInfo.favoredDisciplines.join(', ')}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Standard Advantages:</span>
                <p className="text-neutral-200 font-sans">{currentTypeInfo.standardAdvantages.join('; ')}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL: EDIT COTERIE HEADER */}
      {isEditingHeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e0e16] border border-[#2b2b3d] rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#212130]">
              <h3 className="font-cinzel text-base font-bold text-white">EDIT COTERIE DOSSIER</h3>
              <button
                type="button"
                onClick={() => setIsEditingHeader(false)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs font-sans">
              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Coterie Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-1.5 text-neutral-100"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Concept</label>
                <input
                  type="text"
                  value={editConcept}
                  onChange={e => setEditConcept(e.target.value)}
                  className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-1.5 text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-400 font-mono block mb-1">Archetype / Type</label>
                  <select
                    value={editType}
                    onChange={e => setEditType(e.target.value)}
                    className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-1.5 text-neutral-100 font-mono"
                  >
                    {COTERIE_TYPES.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 font-mono block mb-1">Domain Tier ({editTier})</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={editTier}
                    onChange={e => setEditTier(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-1.5 text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Notes & History</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-1.5 text-neutral-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingHeader(false)}
                  className="px-3 py-1.5 rounded bg-[#181824] text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveHeader}
                  className="px-4 py-1.5 rounded bg-rose-900 hover:bg-rose-800 text-white font-cinzel font-bold tracking-wider"
                >
                  Save Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD MEMBER */}
      {addMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e0e16] border border-[#2b2b3d] rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#212130]">
              <h3 className="font-cinzel text-base font-bold text-white">SWEAR IN PLAYER CHARACTER</h3>
              <button
                type="button"
                onClick={() => setAddMemberModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Select Character</label>
                <select
                  value={selectedCharId}
                  onChange={e => setSelectedCharId(e.target.value)}
                  className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-2 text-neutral-100 font-cinzel"
                >
                  <option value="">-- Choose Character --</option>
                  {characters.map(char => (
                    <option key={char.id} value={char.id}>
                      {char.name} ({char.clan})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Coterie Role</label>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value as any)}
                  className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-2 text-neutral-100 font-mono"
                >
                  <option value="Leader">Leader</option>
                  <option value="Enforcer">Enforcer</option>
                  <option value="Diplomat">Diplomat</option>
                  <option value="Scholar">Scholar</option>
                  <option value="Infiltrator">Infiltrator</option>
                  <option value="Keeper">Keeper</option>
                  <option value="Warden">Warden</option>
                  <option value="Member">Member</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddMemberModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#181824] text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedCharId}
                  className="px-4 py-1.5 rounded bg-rose-900 hover:bg-rose-800 disabled:opacity-50 text-white font-cinzel font-bold"
                >
                  Confirm Oath
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SHARED ADVANTAGE */}
      {addAdvantageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e0e16] border border-[#2b2b3d] rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#212130]">
              <h3 className="font-cinzel text-base font-bold text-white">ADD SHARED MERIT / ADVANTAGE</h3>
              <button
                type="button"
                onClick={() => setAddAdvantageModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSharedAdvantage} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Advantage Name</label>
                <input
                  type="text"
                  placeholder="e.g. Haven: Armored Vault"
                  value={advName}
                  onChange={e => setAdvName(e.target.value)}
                  className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-1.5 text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-400 font-mono block mb-1">Rating ({advDots} Dots)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={advDots}
                    onChange={e => setAdvDots(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-1.5 text-neutral-100 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 font-mono block mb-1">Type</label>
                  <select
                    value={advType}
                    onChange={e => setAdvType(e.target.value as any)}
                    className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-1.5 text-neutral-100 font-mono"
                  >
                    <option value="merit">Merit</option>
                    <option value="flaw">Flaw</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Description / Benefit</label>
                <textarea
                  rows={2}
                  placeholder="Details of the shared communal resource..."
                  value={advDetails}
                  onChange={e => setAdvDetails(e.target.value)}
                  className="w-full bg-[#12121c] border border-[#2a2a3e] rounded px-3 py-1.5 text-neutral-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddAdvantageModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#181824] text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!advName.trim()}
                  className="px-4 py-1.5 rounded bg-rose-900 hover:bg-rose-800 disabled:opacity-50 text-white font-cinzel font-bold"
                >
                  Record Advantage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
