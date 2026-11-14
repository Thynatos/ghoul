import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Link2, 
  FileText, 
  AlertCircle, 
  Lock, 
  MapPin, 
  User, 
  Skull, 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  X, 
  Check, 
  Edit3,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { MysteryBoard, MysteryLink, MysteryNode, MysteryNodeType, MysteryNodeStatus } from '../../types/investigation';
import { storageService } from '../../services/storage';

interface MysteryInvestigationBoardProps {
  onShowToast?: (title: string, desc?: string, type?: 'info' | 'blood' | 'success' | 'error') => void;
}

export const MysteryInvestigationBoard: React.FC<MysteryInvestigationBoardProps> = ({
  onShowToast
}) => {
  const [boards, setBoards] = useState<MysteryBoard[]>(storageService.getMysteryBoards());
  const [activeBoardId, setActiveBoardId] = useState<string>(boards[0]?.id || '');
  
  // Storyteller vs Player View Toggle
  const [isStorytellerMode, setIsStorytellerMode] = useState<boolean>(true);

  // Selected Node / Inspector
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Modals
  const [addNodeModalOpen, setAddNodeModalOpen] = useState(false);
  const [addLinkModalOpen, setAddLinkModalOpen] = useState(false);
  const [isEditingBoardInfo, setIsEditingBoardInfo] = useState(false);

  // Node Creation State
  const [newNodeType, setNewNodeType] = useState<MysteryNodeType>('clue');
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeDesc, setNewNodeDesc] = useState('');
  const [newNodeStatus, setNewNodeStatus] = useState<MysteryNodeStatus>('discovered');
  const [newNodeSecretNotes, setNewNodeSecretNotes] = useState('');
  const [newNodeIsSecret, setNewNodeIsSecret] = useState(false);

  // Link Creation State
  const [linkSourceId, setLinkSourceId] = useState('');
  const [linkTargetId, setLinkTargetId] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [linkIsSecret, setLinkIsSecret] = useState(false);

  // Dragging Nodes on the Pinboard
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

  const activeBoard = boards.find(b => b.id === activeBoardId) || boards[0];

  useEffect(() => {
    if (boards.length > 0 && !activeBoardId) {
      setActiveBoardId(boards[0].id);
    }
  }, [boards, activeBoardId]);

  const saveBoard = (updated: MysteryBoard) => {
    storageService.saveMysteryBoard(updated);
    const refreshed = storageService.getMysteryBoards();
    setBoards(refreshed);
  };

  const handleCreateNewBoard = () => {
    const newBoard: MysteryBoard = {
      id: 'board_' + Date.now(),
      chronicleId: storageService.getActiveChronicleId() || 'chronicle_chicago_1',
      title: `Case File #${boards.length + 101}`,
      caseNumber: `CPD-CASE-${Math.floor(Math.random() * 9000 + 1000)}`,
      briefing: 'Active homicide and Masquerade breach investigation.',
      isSolved: false,
      nodes: [
        {
          id: 'n_initial_scene',
          type: 'crime_scene',
          title: 'Initial Crime Scene',
          description: 'Alleyway or secure haven where the incident unfolded.',
          x: 120,
          y: 100,
          status: 'discovered',
          color: '#e11d48'
        }
      ],
      links: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    storageService.saveMysteryBoard(newBoard);
    const refreshed = storageService.getMysteryBoards();
    setBoards(refreshed);
    setActiveBoardId(newBoard.id);
    if (onShowToast) onShowToast('New Case Opened', 'Investigation corkboard prepared.', 'info');
  };

  // Node Drag Handlers
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return; // Only left click
    const node = activeBoard?.nodes.find(n => n.id === nodeId);
    if (!node || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    setDraggingNodeId(nodeId);
    setDragOffset({
      x: e.clientX - (boardRect.left + node.x),
      y: e.clientY - (boardRect.top + node.y)
    });
    setSelectedNodeId(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !activeBoard || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(boardRect.width - 220, e.clientX - boardRect.left - dragOffset.x));
    const newY = Math.max(20, Math.min(boardRect.height - 180, e.clientY - boardRect.top - dragOffset.y));

    const updatedNodes = activeBoard.nodes.map(n => {
      if (n.id === draggingNodeId) {
        return { ...n, x: Math.round(newX), y: Math.round(newY) };
      }
      return n;
    });

    // Directly update local state for smooth drag
    const updatedBoard = { ...activeBoard, nodes: updatedNodes };
    const list = boards.map(b => b.id === activeBoard.id ? updatedBoard : b);
    setBoards(list);
  };

  const handleMouseUp = () => {
    if (draggingNodeId && activeBoard) {
      saveBoard(activeBoard);
      setDraggingNodeId(null);
    }
  };

  // Add Node
  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBoard || !newNodeTitle.trim()) return;

    const colors: Record<MysteryNodeType, string> = {
      clue: '#38bdf8',
      suspect: '#eab308',
      victim: '#f43f5e',
      autopsy: '#a855f7',
      crime_scene: '#e11d48',
      evidence: '#22c55e'
    };

    const newNode: MysteryNode = {
      id: 'node_' + Date.now(),
      type: newNodeType,
      title: newNodeTitle.trim(),
      description: newNodeDesc.trim(),
      x: 250 + Math.floor(Math.random() * 100),
      y: 150 + Math.floor(Math.random() * 100),
      status: newNodeStatus,
      secretNotes: newNodeSecretNotes.trim(),
      isSecret: newNodeIsSecret,
      color: colors[newNodeType]
    };

    const updated = {
      ...activeBoard,
      nodes: [...activeBoard.nodes, newNode]
    };

    saveBoard(updated);
    setNewNodeTitle('');
    setNewNodeDesc('');
    setNewNodeSecretNotes('');
    setNewNodeIsSecret(false);
    setAddNodeModalOpen(false);
    setSelectedNodeId(newNode.id);
    if (onShowToast) onShowToast('Pin Pinned to Board', `${newNode.title} recorded.`, 'info');
  };

  // Delete Node
  const handleDeleteNode = (nodeId: string) => {
    if (!activeBoard) return;
    const updatedNodes = activeBoard.nodes.filter(n => n.id !== nodeId);
    const updatedLinks = activeBoard.links.filter(l => l.sourceId !== nodeId && l.targetId !== nodeId);
    saveBoard({
      ...activeBoard,
      nodes: updatedNodes,
      links: updatedLinks
    });
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  // Add Link (Red String)
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBoard || !linkSourceId || !linkTargetId || linkSourceId === linkTargetId) return;

    const newLink: MysteryLink = {
      id: 'link_' + Date.now(),
      sourceId: linkSourceId,
      targetId: linkTargetId,
      label: linkLabel.trim() || 'Connected Lead',
      isSecret: linkIsSecret,
      color: '#e11d48'
    };

    saveBoard({
      ...activeBoard,
      links: [...activeBoard.links, newLink]
    });

    setLinkLabel('');
    setLinkIsSecret(false);
    setAddLinkModalOpen(false);
    if (onShowToast) onShowToast('Red Thread Strung', 'Connection linked between pins.', 'blood');
  };

  // Delete Link
  const handleDeleteLink = (linkId: string) => {
    if (!activeBoard) return;
    saveBoard({
      ...activeBoard,
      links: activeBoard.links.filter(l => l.id !== linkId)
    });
  };

  // Filter visible nodes & links based on Player View vs Storyteller Mode
  const visibleNodes = (activeBoard?.nodes || []).filter(node => {
    if (isStorytellerMode) return true;
    return !node.isSecret; // Hide secret nodes in Player View
  });

  const visibleLinks = (activeBoard?.links || []).filter(link => {
    if (isStorytellerMode) return true;
    if (link.isSecret) return false;
    // Both endpoints must also be visible
    const hasSource = visibleNodes.some(n => n.id === link.sourceId);
    const hasTarget = visibleNodes.some(n => n.id === link.targetId);
    return hasSource && hasTarget;
  });

  const selectedNode = activeBoard?.nodes.find(n => n.id === selectedNodeId);

  const getNodeIcon = (type: MysteryNodeType) => {
    switch (type) {
      case 'crime_scene': return MapPin;
      case 'victim': return Skull;
      case 'suspect': return User;
      case 'autopsy': return Activity;
      case 'clue': return Search;
      case 'evidence': return ShieldAlert;
      default: return FileText;
    }
  };

  if (!activeBoard) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Top Bar: Case Switcher, Mode Toggle & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#09080d] border border-[#1e1a26] p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.4)]">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                CASE DOSSIER // RED STRING BOARD
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 border border-neutral-700 text-neutral-300">
                {activeBoard.caseNumber}
              </span>
            </div>
            <select
              value={activeBoard.id}
              onChange={e => setActiveBoardId(e.target.value)}
              className="bg-transparent font-cinzel text-lg font-bold text-white focus:outline-none cursor-pointer"
            >
              {boards.map(b => (
                <option key={b.id} value={b.id} className="bg-[#100c14] text-white">
                  {b.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Toggle: STORYTELLER vs PLAYER PROJECTION */}
        <div className="flex items-center gap-3">
          <div className="flex bg-[#120f18] border border-[#242030] rounded-lg p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setIsStorytellerMode(true)}
              className={`px-3 py-1.5 rounded font-bold flex items-center gap-1.5 transition ${
                isStorytellerMode
                  ? 'bg-rose-900 text-white shadow-[0_0_10px_rgba(225,29,72,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Full Storyteller Mode: reveals secret conspirators, dark motives, and hidden links"
            >
              <Eye className="w-3.5 h-3.5" />
              Storyteller Screen
            </button>
            <button
              type="button"
              onClick={() => setIsStorytellerMode(false)}
              className={`px-3 py-1.5 rounded font-bold flex items-center gap-1.5 transition ${
                !isStorytellerMode
                  ? 'bg-blue-900 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Player View: Redacts secret conspirators, spoilers, and unrevealed connections for TV/screen sharing"
            >
              <EyeOff className="w-3.5 h-3.5" />
              Player View (Redacted)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAddNodeModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-xs font-cinzel text-rose-200 hover:text-white flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Pin
            </button>
            <button
              type="button"
              onClick={() => setAddLinkModalOpen(true)}
              disabled={activeBoard.nodes.length < 2}
              className="px-3 py-1.5 rounded-lg bg-[#15121e] hover:bg-[#201c2c] border border-[#272336] disabled:opacity-40 text-xs font-cinzel text-neutral-200 hover:text-white flex items-center gap-1.5 transition"
            >
              <Link2 className="w-3.5 h-3.5 text-rose-400" />
              Connect String
            </button>
            <button
              type="button"
              onClick={handleCreateNewBoard}
              className="p-2 rounded-lg bg-[#15121e] hover:bg-[#201c2c] border border-[#272336] text-neutral-400 hover:text-white transition"
              title="Open New Case Board"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Case Briefing & Mode Banner */}
      <div className={`
        p-3.5 rounded-xl border flex items-center justify-between gap-4 text-xs font-sans
        ${isStorytellerMode 
          ? 'bg-rose-950/20 border-rose-900/50 text-rose-300' 
          : 'bg-blue-950/20 border-blue-900/50 text-blue-300'}
      `}>
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <div>
            <span className="font-bold uppercase font-mono mr-2">
              {isStorytellerMode ? 'STORYTELLER MODE (OMNISCIENT)' : 'PLAYER PROJECTION MODE (SPOILERS REDACTED)'}
            </span>
            <span className="text-neutral-300">{activeBoard.briefing}</span>
          </div>
        </div>
        <span className="text-[10px] font-mono shrink-0 hidden sm:block">
          {visibleNodes.length} Pins • {visibleLinks.length} Connections Visible
        </span>
      </div>

      {/* CORKBOARD INVESTIGATION CANVAS */}
      <div className="relative w-full rounded-2xl border-4 border-[#241a15] overflow-hidden shadow-2xl select-none">
        
        {/* Corkboard Background Texture */}
        <div 
          ref={boardRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="relative w-full h-[640px] bg-[#161210] overflow-hidden cursor-crosshair"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(30, 20, 15, 0.9), rgba(10, 8, 7, 0.95)),
              repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 24px),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 24px)
            `
          }}
        >
          {/* SVG Canvas for Red Strings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {visibleLinks.map(link => {
              const sourceNode = activeBoard.nodes.find(n => n.id === link.sourceId);
              const targetNode = activeBoard.nodes.find(n => n.id === link.targetId);
              if (!sourceNode || !targetNode) return null;

              // Node dimensions approx: 190w x 100h
              const sx = sourceNode.x + 95;
              const sy = sourceNode.y + 15; // Pin top center
              const tx = targetNode.x + 95;
              const ty = targetNode.y + 15;

              // Midpoint for label
              const mx = (sx + tx) / 2;
              const my = (sy + ty) / 2;

              return (
                <g key={link.id}>
                  {/* Subtle drop shadow for 3D string feel */}
                  <line
                    x1={sx}
                    y1={sy + 3}
                    x2={tx}
                    y2={ty + 3}
                    stroke="rgba(0,0,0,0.6)"
                    strokeWidth="3"
                  />
                  {/* Main Crimson Red Thread */}
                  <line
                    x1={sx}
                    y1={sy}
                    x2={tx}
                    y2={ty}
                    stroke={link.isSecret ? '#9333ea' : '#e11d48'}
                    strokeWidth={link.isSecret ? '2.5' : '2'}
                    strokeDasharray={link.isSecret ? '4 4' : 'none'}
                    className="transition-all"
                  />
                  {/* Small tag note on string */}
                  {link.label && (
                    <foreignObject
                      x={mx - 60}
                      y={my - 12}
                      width="120"
                      height="26"
                      className="overflow-visible"
                    >
                      <div className="bg-[#12080d]/90 border border-red-900/60 text-[9px] font-mono text-red-200 px-1.5 py-0.5 rounded text-center truncate shadow">
                        {link.label}
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Render Pins / Nodes */}
          {visibleNodes.map(node => {
            const isSelected = selectedNodeId === node.id;
            const Icon = getNodeIcon(node.type);

            return (
              <div
                key={node.id}
                onMouseDown={e => handleMouseDown(e, node.id)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`
                }}
                className={`
                  absolute z-20 w-48 rounded-xl p-3 shadow-xl cursor-grab active:cursor-grabbing border transition-all
                  ${isSelected ? 'ring-2 ring-rose-500 scale-105 z-30' : 'hover:scale-102'}
                  ${node.isSecret ? 'bg-[#180918] border-purple-800/80 shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'bg-[#141018] border-[#292232]'}
                `}
              >
                {/* Visual Red Pushpin */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-red-900 border border-white/60 shadow-[0_2px_5px_rgba(0,0,0,0.8)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                </div>

                {/* Card Content */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span 
                      className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded flex items-center gap-1"
                      style={{ backgroundColor: `${node.color}25`, color: node.color }}
                    >
                      <Icon className="w-2.5 h-2.5" />
                      {node.type.replace('_', ' ')}
                    </span>
                    {node.isSecret && (
                      <span className="text-[9px] font-mono text-purple-300 flex items-center gap-0.5" title="Storyteller secret">
                        <Lock className="w-2.5 h-2.5" />
                        SECRET
                      </span>
                    )}
                  </div>

                  <h4 className="font-cinzel text-xs font-bold text-neutral-100 truncate">
                    {node.title}
                  </h4>

                  <p className="text-[10px] text-neutral-400 font-sans mt-1 line-clamp-2 leading-tight">
                    {node.description}
                  </p>

                  {/* Secret notes preview in Storyteller mode */}
                  {isStorytellerMode && node.secretNotes && (
                    <div className="mt-2 pt-1.5 border-t border-[#261e2e] text-[9px] text-amber-300 font-mono line-clamp-1 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                      {node.secretNotes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        </div>

      </div>

      {/* SELECTED NODE INSPECTOR PANEL */}
      {selectedNode && (
        <div className="bg-[#0b080f] border border-[#241c2c] rounded-xl p-5 text-xs font-sans animate-fade-in space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${selectedNode.color}25`, color: selectedNode.color }}
              >
                {React.createElement(getNodeIcon(selectedNode.type), { className: 'w-5 h-5' })}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel text-base font-bold text-white">{selectedNode.title}</h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
                    Status: {selectedNode.status}
                  </span>
                  {selectedNode.isSecret && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Conspiratorial Secret
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-300 mt-1 font-sans">{selectedNode.description}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleDeleteNode(selectedNode.id)}
              className="px-2.5 py-1 rounded bg-[#180f1a] hover:bg-red-950 border border-[#2b1a2d] hover:border-red-800 text-neutral-400 hover:text-red-300 transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove Pin
            </button>
          </div>

          {/* Storyteller Secret Field */}
          {selectedNode.secretNotes && (
            <div className={`p-3 rounded-lg border text-xs font-mono leading-relaxed ${
              isStorytellerMode
                ? 'bg-amber-950/30 border-amber-800/80 text-amber-200'
                : 'bg-neutral-950 border-neutral-800 text-neutral-600 italic select-none'
            }`}>
              <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-300">
                <Lock className="w-3.5 h-3.5" />
                STORYTELLER CLASSIFIED INTEL:
              </div>
              {isStorytellerMode ? selectedNode.secretNotes : '[CLASSIFIED EVIDENCE REDACTED FOR PLAYERS]'}
            </div>
          )}

          {/* Connections to other nodes */}
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-2">
              CONNECTED THREADS:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeBoard.links.filter(l => l.sourceId === selectedNode.id || l.targetId === selectedNode.id).map(link => {
                const otherNodeId = link.sourceId === selectedNode.id ? link.targetId : link.sourceId;
                const otherNode = activeBoard.nodes.find(n => n.id === otherNodeId);
                return (
                  <div
                    key={link.id}
                    className="px-2.5 py-1 rounded-lg bg-[#140d1a] border border-[#24172a] text-neutral-300 text-xs flex items-center gap-2"
                  >
                    <span className="font-mono text-rose-400">{link.label}:</span>
                    <span className="font-semibold text-white">{otherNode?.title || 'Unknown'}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-neutral-500 hover:text-red-400"
                      title="Cut red thread"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD PIN / NODE */}
      {addNodeModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0e0912] border border-[#291b30] rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#211628]">
              <h3 className="font-cinzel text-base font-bold text-white">ADD EVIDENCE PIN TO BOARD</h3>
              <button
                type="button"
                onClick={() => setAddNodeModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNode} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Pin Category</label>
                <select
                  value={newNodeType}
                  onChange={e => setNewNodeType(e.target.value as MysteryNodeType)}
                  className="w-full bg-[#140d1a] border border-[#2b1a32] rounded px-3 py-2 text-neutral-100 font-mono"
                >
                  <option value="clue">Clue / Lead</option>
                  <option value="suspect">Suspect / Person of Interest</option>
                  <option value="victim">Victim / Target</option>
                  <option value="autopsy">Autopsy / Medical Examiner</option>
                  <option value="crime_scene">Crime Scene / Location</option>
                  <option value="evidence">Physical Evidence / Weapon</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Sanguine Vial with Tremere Glyph"
                  value={newNodeTitle}
                  onChange={e => setNewNodeTitle(e.target.value)}
                  className="w-full bg-[#140d1a] border border-[#2b1a32] rounded px-3 py-1.5 text-neutral-100"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Public Description (Visible to Players)</label>
                <textarea
                  rows={2}
                  placeholder="Details discovered during mortal investigation..."
                  value={newNodeDesc}
                  onChange={e => setNewNodeDesc(e.target.value)}
                  className="w-full bg-[#140d1a] border border-[#2b1a32] rounded px-3 py-1.5 text-neutral-100"
                />
              </div>

              <div>
                <label className="text-[10px] text-amber-400 font-mono block mb-1">
                  Storyteller Secret Notes (Hidden in Player View)
                </label>
                <textarea
                  rows={2}
                  placeholder="True conspirators, occult lore, framing attempts..."
                  value={newNodeSecretNotes}
                  onChange={e => setNewNodeSecretNotes(e.target.value)}
                  className="w-full bg-[#140d1a] border border-amber-900/50 rounded px-3 py-1.5 text-amber-200 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="secretCheck"
                  checked={newNodeIsSecret}
                  onChange={e => setNewNodeIsSecret(e.target.checked)}
                  className="accent-purple-600 rounded"
                />
                <label htmlFor="secretCheck" className="text-neutral-300 font-mono text-[11px]">
                  Hide this entire pin from Player View (Undiscovered Conspirator)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddNodeModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#180f1e] text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newNodeTitle.trim()}
                  className="px-4 py-1.5 rounded bg-rose-900 hover:bg-rose-800 disabled:opacity-50 text-white font-cinzel font-bold"
                >
                  Pin to Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONNECT RED THREAD / LINK */}
      {addLinkModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0e0912] border border-[#291b30] rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#211628]">
              <h3 className="font-cinzel text-base font-bold text-white">CONNECT RED STRING</h3>
              <button
                type="button"
                onClick={() => setAddLinkModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLink} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Origin Pin</label>
                <select
                  value={linkSourceId}
                  onChange={e => setLinkSourceId(e.target.value)}
                  className="w-full bg-[#140d1a] border border-[#2b1a32] rounded px-3 py-2 text-neutral-100 font-cinzel"
                >
                  <option value="">-- Choose Pin A --</option>
                  {activeBoard.nodes.map(n => (
                    <option key={n.id} value={n.id}>{n.title} ({n.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Target Pin</label>
                <select
                  value={linkTargetId}
                  onChange={e => setLinkTargetId(e.target.value)}
                  className="w-full bg-[#140d1a] border border-[#2b1a32] rounded px-3 py-2 text-neutral-100 font-cinzel"
                >
                  <option value="">-- Choose Pin B --</option>
                  {activeBoard.nodes.filter(n => n.id !== linkSourceId).map(n => (
                    <option key={n.id} value={n.id}>{n.title} ({n.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Relationship / Connection Note</label>
                <input
                  type="text"
                  placeholder="e.g. Fled crime scene in victim vehicle"
                  value={linkLabel}
                  onChange={e => setLinkLabel(e.target.value)}
                  className="w-full bg-[#140d1a] border border-[#2b1a32] rounded px-3 py-1.5 text-neutral-100"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="secretLinkCheck"
                  checked={linkIsSecret}
                  onChange={e => setLinkIsSecret(e.target.checked)}
                  className="accent-purple-600 rounded"
                />
                <label htmlFor="secretLinkCheck" className="text-neutral-300 font-mono text-[11px]">
                  Secret connection (hidden from Player View)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddLinkModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#180f1e] text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!linkSourceId || !linkTargetId}
                  className="px-4 py-1.5 rounded bg-red-900 hover:bg-red-800 disabled:opacity-50 text-white font-cinzel font-bold"
                >
                  Tie Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
