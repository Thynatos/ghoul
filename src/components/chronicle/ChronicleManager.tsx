import React, { useState } from 'react';
import { 
  Chronicle, 
  MapPin, 
  TerritoryZone, 
  RelationshipNode, 
  RelationshipLink, 
  BoonRecord, 
  SessionNote,
  GameEdition 
} from '../../types/vtm';
import { storageService } from '../../services/storage';
import { CityMapWorkbench } from './CityMapWorkbench';
import { RelationshipWeb } from './RelationshipWeb';
import { HarpyDashboard } from './HarpyDashboard';
import { NpcRoster } from './NpcRoster';
import { SessionJournal } from './SessionJournal';
import { MysteryInvestigationBoard } from './MysteryInvestigationBoard';
import { MapPin as MapPinIcon, Network, Scroll, Users, BookOpen, ShieldCheck, Plus, Search } from 'lucide-react';

interface ChronicleManagerProps {
  edition: GameEdition;
  onLaunchRoll: (pool: number, label: string) => void;
}

export const ChronicleManager: React.FC<ChronicleManagerProps> = ({
  edition,
  onLaunchRoll
}) => {
  const [chronicles, setChronicles] = useState<Chronicle[]>(storageService.getChronicles());
  const [activeChronicleId, setActiveChronicleId] = useState<string>(
    storageService.getActiveChronicleId() || chronicles[0]?.id || 'chronicle_1'
  );

  const [activeTab, setActiveTab] = useState<'map' | 'web' | 'boons' | 'npcs' | 'sessions' | 'investigation'>('map');

  // Child Data
  const [pins, setPins] = useState<MapPin[]>(storageService.getPins(activeChronicleId));
  const [territories, setTerritories] = useState<TerritoryZone[]>(storageService.getTerritories(activeChronicleId));
  const [nodes, setNodes] = useState<RelationshipNode[]>(storageService.getRelationshipNodes(activeChronicleId));
  const [links, setLinks] = useState<RelationshipLink[]>(storageService.getRelationshipLinks(activeChronicleId));
  const [boons, setBoons] = useState<BoonRecord[]>(storageService.getBoons(activeChronicleId));
  const [sessions, setSessions] = useState<SessionNote[]>(storageService.getSessions(activeChronicleId));

  const activeChronicle = chronicles.find(c => c.id === activeChronicleId) || chronicles[0];

  const handleUpdatePins = (newPin: MapPin) => {
    storageService.addPin(newPin);
    setPins(storageService.getPins(activeChronicleId));
  };

  const handleDeletePin = (pinId: string) => {
    storageService.deletePin(pinId);
    setPins(storageService.getPins(activeChronicleId));
  };

  const handleUpdateNodes = (newNodes: RelationshipNode[]) => {
    setNodes(newNodes);
    storageService.saveRelationshipNodes(newNodes);
  };

  const handleUpdateLinks = (newLinks: RelationshipLink[]) => {
    setLinks(newLinks);
    storageService.saveRelationshipLinks(newLinks);
  };

  const handleUpdateBoons = (newBoons: BoonRecord[]) => {
    setBoons(newBoons);
    storageService.saveBoons(newBoons);
  };

  const handleUpdateSessions = (newSessions: SessionNote[]) => {
    setSessions(newSessions);
    storageService.saveSessions(newSessions);
  };

  const tabs = [
    { id: 'map', label: 'City Map & Turf', icon: MapPinIcon },
    { id: 'web', label: 'Relationship Web', icon: Network },
    { id: 'investigation', label: 'Mystery Pinboard', icon: Search },
    { id: 'boons', label: 'Harpy Boons Ledger', icon: Scroll },
    { id: 'npcs', label: 'NPC Dossiers', icon: Users },
    { id: 'sessions', label: 'Session Journal', icon: BookOpen },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Chronicle Header Banner */}
      <div className="bg-[#0b0b10] border border-[#20202d] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1c1c28]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300">
                ACTIVE CAMPAIGN
              </span>
              <span className="text-xs text-neutral-500 font-mono">{activeChronicle.city}</span>
            </div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-white tracking-wide mt-1">
              {activeChronicle.title}
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              {activeChronicle.description}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-neutral-500 text-[10px] font-cinzel block">STORYTELLER</span>
            <span className="font-cinzel font-bold text-neutral-200 text-sm">{activeChronicle.storyteller}</span>
          </div>
        </div>

        {/* Chronicle Tenets Bar */}
        {activeChronicle.tenets && activeChronicle.tenets.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-cinzel text-neutral-500 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> Chronicle Tenets:
            </span>
            {activeChronicle.tenets.map((tenet, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-[#14141e] border border-[#232333] text-neutral-300 font-serif italic"
              >
                "{tenet}"
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs Switcher Navigation */}
      <div className="flex items-center gap-1 bg-[#0c0c11] border border-[#20202c] p-1.5 rounded-xl overflow-x-auto no-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                px-4 py-2 rounded-lg text-xs font-cinzel font-bold tracking-wider flex items-center gap-2 whitespace-nowrap transition-all
                ${isActive
                  ? 'bg-rose-950 border border-rose-700 text-rose-200 shadow-[0_0_12px_rgba(225,29,72,0.3)]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#14141e] border border-transparent'}
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab View Body */}
      <div>
        {activeTab === 'map' && (
          <CityMapWorkbench
            chronicleId={activeChronicle.id}
            pins={pins}
            territories={territories}
            onAddPin={handleUpdatePins}
            onDeletePin={handleDeletePin}
          />
        )}

        {activeTab === 'web' && (
          <RelationshipWeb
            chronicleId={activeChronicle.id}
            nodes={nodes}
            links={links}
            onUpdateNodes={handleUpdateNodes}
            onUpdateLinks={handleUpdateLinks}
          />
        )}

        {activeTab === 'boons' && (
          <HarpyDashboard
            chronicleId={activeChronicle.id}
            boons={boons}
            onUpdateBoons={handleUpdateBoons}
          />
        )}

        {activeTab === 'npcs' && (
          <NpcRoster
            chronicleId={activeChronicle.id}
            edition={edition}
            onLaunchRoll={onLaunchRoll}
          />
        )}

        {activeTab === 'sessions' && (
          <SessionJournal
            chronicleId={activeChronicle.id}
            sessions={sessions}
            onUpdateSessions={handleUpdateSessions}
          />
        )}

        {activeTab === 'investigation' && (
          <MysteryInvestigationBoard />
        )}
      </div>
    </div>
  );
};
