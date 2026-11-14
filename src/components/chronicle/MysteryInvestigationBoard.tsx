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
  Unlock,
  MapPin, 
  User, 
  Skull, 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  X, 
  Check, 
  Edit3, 
  FolderOpen,
  Filter,
  Layers,
  HelpCircle,
  Tag
} from 'lucide-react';
import { MysteryBoard, MysteryLink, MysteryNode, MysteryNodeType, MysteryNodeStatus } from '../../types/investigation';
import { storageService } from '../../services/storage';
import { soundEngine } from '../../services/soundEngine';

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

  // Search & Filters
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [addNodeModalOpen, setAddNodeModalOpen] = useState(false);
  const [addLinkModalOpen, setAddLinkModalOpen] = useState(false);
  const [isEditingNode, setIsEditingNode] = useState(false);

  // Node Creation State
  const [newNodeType, setNewNodeType] = useState<MysteryNodeType>('clue');
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeDesc, setNewNodeDesc] = useState('');
  const [newNodeStatus, setNewNodeStatus] = useState<MysteryNodeStatus>('discovered');
  const [newNodeSecretNotes, setNewNodeSecretNotes] = useState('');
  const [newNodeIsSecret, setNewNodeIsSecret] = useState(false);

  // Node Edit State
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editSecretNotes, setEditSecretNotes] = useState('');
  const [editStatus, setEditStatus] = useState<MysteryNodeStatus>('discovered');

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
      briefing: 'New homicide and Masquerade breach investigation opened by the Sheriff.',
      isSolved: false,
      nodes: [
        {
          id: 'n_initial_scene_' + Date.now(),
          type: 'crime_scene',
          title: 'Initial Crime Scene',
          description: 'Secure haven or abandoned warehouse where the breach took place.',
          x: 140,
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
    if (e.button !== 0) return;
    const node = activeBoard?.nodes.find(n => n.id === nodeId);
    if (!node || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    setDraggingNodeId(nodeId);
    setDragOffset({
      x: e.clientX - (boardRect.left + node.x),
      y: e.clientY - (boardRect.top + node.y)
    });
    setSelectedNodeId(nodeId);
    setIsEditingNode(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !activeBoard || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(boardRect.width - 240, e.clientX - boardRect.left - dragOffset.x));
    const newY = Math.max(20, Math.min(boardRect.height - 200, e.clientY - boardRect.top - dragOffset.y));

    const updatedNodes = activeBoard.nodes.map(n => {
      if (n.id === draggingNodeId) {
        return { ...n, x: Math.round(newX), y: Math.round(newY) };
      }
      return n;
    });

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
      x: 200 + Math.floor(Math.random() * 200),
      y: 120 + Math.floor(Math.random() * 150),
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
    if (onShowToast) onShowToast('Pin Added', `${newNode.title} mounted to board.`, 'info');
  };

  // Toggle Secret / Reveal to Players
  const handleToggleSecretNode = (nodeId: string) => {
    if (!activeBoard) return;
    const node = activeBoard.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const willBeSecret = !node.isSecret;
    const updatedNodes = activeBoard.nodes.map(n => {
      if (n.id === nodeId) {
        return { ...n, isSecret: willBeSecret };
      }
      return n;
    });

    saveBoard({ ...activeBoard, nodes: updatedNodes });
    if (onShowToast) {
      onShowToast(
        willBeSecret ? 'Concealed from Players' : 'Revealed to Players',
        `${node.title} is now ${willBeSecret ? 'hidden on player screens' : 'visible on player screens'}.`,
        'blood'
      );
    }
  };

  // Edit Node
  const handleStartEditNode = (node: MysteryNode) => {
    setEditTitle(node.title);
    setEditDesc(node.description);
    setEditSecretNotes(node.secretNotes || '');
    setEditStatus(node.status);
    setIsEditingNode(true);
  };

  const handleSaveEditNode = () => {
    if (!activeBoard || !selectedNodeId) return;
    const updatedNodes = activeBoard.nodes.map(n => {
      if (n.id === selectedNodeId) {
        return {
          ...n,
          title: editTitle.trim() || n.title,
          description: editDesc.trim() || n.description,
          secretNotes: editSecretNotes.trim(),
          status: editStatus
        };
      }
      return n;
    });

    saveBoard({ ...activeBoard, nodes: updatedNodes });
    setIsEditingNode(false);
    if (onShowToast) onShowToast('Evidence Updated', 'Details saved.', 'success');
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

    soundEngine.playHeartbeat();
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
    if (onShowToast) onShowToast('Red Thread Strung', 'Connection linked between evidence.', 'blood');
  };

  // Delete Link
  const handleDeleteLink = (linkId: string) => {
    if (!activeBoard) return;
    saveBoard({
      ...activeBoard,
      links: activeBoard.links.filter(l => l.id !== linkId)
    });
  };

  // Filter visible nodes based on Player View vs Storyteller Mode + category filters
  const visibleNodes = (activeBoard?.nodes || []).filter(node => {
    if (!isStorytellerMode && node.isSecret) return false;
    if (filterType !== 'all' && node.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = node.title.toLowerCase().includes(q);
      const matchDesc = node.description.toLowerCase().includes(q);
      const matchSecret = isStorytellerMode && (node.secretNotes || '').toLowerCase().includes(q);
      return matchTitle || matchDesc || matchSecret;
    }
    return true;
  });

  const visibleLinks = (activeBoard?.links || []).filter(link => {
    if (!isStorytellerMode && link.isSecret) return false;
    const hasSource = visibleNodes.some(n => n.id === link.sourceId);
    const hasTarget = visibleNodes.some(n => n.id === link.targetId);
    return hasSource && hasTarget;
  });

  const hiddenCount = (activeBoard?.nodes || []).filter(n => n.isSecret).length;
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
      
      {/* Top Header Card: Case File, View Mode, Controls */}
      <div className="bg-[#0b080e] border border-[#221424] p-5 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-rose-950 to-red-950 border border-rose-800 text-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.4)]">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                ACTIVE CASE FILE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 border border-neutral-700 text-rose-300 font-bold">
                {activeBoard.caseNumber}
              </span>
            </div>
            <select
              value={activeBoard.id}
              onChange={e => setActiveBoardId(e.target.value)}
              className="bg-transparent font-cinzel text-xl font-black text-white focus:outline-none cursor-pointer mt-0.5"
            >
              {boards.map(b => (
                <option key={b.id} value={b.id} className="bg-[#100c14] text-white">
                  {b.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Selector */}
          <div className="flex bg-[#120e18] border border-[#26162c] rounded-xl p-1 text-xs font-mono">
            <button
              type="button"
              onClick={() => setIsStorytellerMode(true)}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                isStorytellerMode
                  ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white shadow-[0_0_12px_rgba(225,29,72,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Storyteller Screen (Full access to secret conspirators and occult evidence)"
            >
              <Eye className="w-3.5 h-3.5" />
              Storyteller Screen
            </button>
            <button
              type="button"
              onClick={() => setIsStorytellerMode(false)}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                !isStorytellerMode
                  ? 'bg-blue-900 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Player View (Spoilers and secret conspirators safely redacted for screen projection)"
            >
              <EyeOff className="w-3.5 h-3.5" />
              Player View (Redacted)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAddNodeModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-xs font-cinzel text-rose-200 hover:text-white flex items-center gap-1.5 transition shadow-[0_0_10px_rgba(225,29,72,0.3)]"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Pin
            </button>
            <button
              type="button"
              onClick={() => setAddLinkModalOpen(true)}
              disabled={activeBoard.nodes.length < 2}
              className="px-3.5 py-2 rounded-xl bg-[#160f1c] hover:bg-[#23172c] border border-[#2b1836] disabled:opacity-40 text-xs font-cinzel text-neutral-200 hover:text-white flex items-center gap-1.5 transition"
            >
              <Link2 className="w-3.5 h-3.5 text-rose-400" />
              Tie Thread
            </button>
            <button
              type="button"
              onClick={handleCreateNewBoard}
              className="p-2 rounded-xl bg-[#160f1c] hover:bg-[#23172c] border border-[#2b1836] text-neutral-400 hover:text-white transition"
              title="New Case Dossier"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d0912] border border-[#1f1224] p-3 rounded-xl text-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono text-neutral-400 uppercase mr-1">Filter:</span>
          {[
            { id: 'all', label: 'All Evidence' },
            { id: 'crime_scene', label: 'Crime Scenes' },
            { id: 'victim', label: 'Victims' },
            { id: 'suspect', label: 'Suspects' },
            { id: 'autopsy', label: 'Autopsies' },
            { id: 'clue', label: 'Clues' },
            { id: 'evidence', label: 'Physical Evidence' },
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterType(f.id)}
              className={`
                px-2.5 py-1 rounded-lg font-mono text-[11px] transition
                ${filterType === f.id
                  ? 'bg-rose-950 border border-rose-700 text-rose-200'
                  : 'bg-[#140c18] border border-[#24132b] text-neutral-400 hover:text-neutral-200'}
              `}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads, suspects, runes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-[#140c18] border border-[#24132b] rounded-lg pl-8 pr-3 py-1 text-[11px] text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-rose-600 w-56"
          />
        </div>
      </div>

      {/* Storyteller classified watermark indicator */}
      {!isStorytellerMode && (
        <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800 text-blue-200 text-xs font-mono flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-blue-400 shrink-0" />
            <span>PLAYER PROJECTION ACTIVE — {hiddenCount} SECRET CONSPIRATOR(S) & CLASSIFIED MOTIVES REDACTED.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsStorytellerMode(true)}
            className="underline text-blue-300 hover:text-white"
          >
            Switch to Storyteller Screen
          </button>
        </div>
      )}

      {/* THE CORKBOARD CANVAS */}
      <div className="relative w-full rounded-2xl border-4 border-[#241610] shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden select-none">
        
        {/* Corkboard Texture Canvas */}
        <div 
          ref={boardRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="relative w-full h-[680px] bg-[#140f0c] overflow-hidden cursor-crosshair"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(35, 22, 16, 0.95), rgba(12, 8, 6, 0.98)),
              repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 28px),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 28px)
            `
          }}
        >
          {/* Subtle woodgrain and shadow */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

          {/* SVG Canvas for Crimson Red Thread Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {visibleLinks.map(link => {
              const sourceNode = activeBoard.nodes.find(n => n.id === link.sourceId);
              const targetNode = activeBoard.nodes.find(n => n.id === link.targetId);
              if (!sourceNode || !targetNode) return null;

              const sx = sourceNode.x + 115;
              const sy = sourceNode.y + 14;
              const tx = targetNode.x + 115;
              const ty = targetNode.y + 14;
              const mx = (sx + tx) / 2;
              const my = (sy + ty) / 2;

              return (
                <g key={link.id}>
                  {/* Cast shadow */}
                  <line
                    x1={sx}
                    y1={sy + 3}
                    x2={tx}
                    y2={ty + 3}
                    stroke="rgba(0,0,0,0.7)"
                    strokeWidth="3.5"
                  />
                  {/* Crimson Thread */}
                  <line
                    x1={sx}
                    y1={sy}
                    x2={tx}
                    y2={ty}
                    stroke={link.isSecret ? '#9333ea' : '#dc2626'}
                    strokeWidth={link.isSecret ? '2.5' : '2'}
                    strokeDasharray={link.isSecret ? '4 4' : 'none'}
                  />
                  {/* Taped label on red thread */}
                  {link.label && (
                    <foreignObject
                      x={mx - 80}
                      y={my - 14}
                      width="160"
                      height="32"
                      className="overflow-visible"
                    >
                      <div className="bg-[#14060c]/95 border border-red-700 text-[10px] font-cinzel font-semibold text-rose-200 px-2 py-0.5 rounded shadow-[0_4px_12px_rgba(0,0,0,0.8)] text-center truncate">
                        {link.label}
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Render Pushpin Cards */}
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
                  absolute z-20 w-56 sm:w-60 rounded-xl p-3.5 shadow-2xl cursor-grab active:cursor-grabbing border transition-all
                  ${isSelected ? 'ring-2 ring-rose-500 scale-105 z-30 shadow-[0_0_25px_rgba(225,29,72,0.4)]' : 'hover:scale-102'}
                  ${node.isSecret 
                    ? 'bg-[#180918] border-purple-800 shadow-[0_0_15px_rgba(147,51,234,0.3)]' 
                    : 'bg-[#151016] border-[#291e2c]'}
                `}
              >
                {/* Vintage Brass Pushpin Header */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-red-600 via-rose-800 to-black border border-white/70 shadow-[0_3px_8px_rgba(0,0,0,0.9)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/90" />
                </div>

                {/* Evidence Card Content */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span 
                      className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 border"
                      style={{ 
                        backgroundColor: `${node.color}25`, 
                        color: node.color,
                        borderColor: `${node.color}50` 
                      }}
                    >
                      <Icon className="w-2.5 h-2.5" />
                      {node.type.replace('_', ' ')}
                    </span>
                    {node.isSecret && (
                      <span className="text-[9px] font-mono text-purple-300 font-bold flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" />
                        SECRET
                      </span>
                    )}
                  </div>

                  <h4 className="font-cinzel text-xs font-bold text-neutral-100 leading-snug line-clamp-2">
                    {node.title}
                  </h4>

                  <p className="text-[10px] text-neutral-300 font-sans mt-1 line-clamp-2 leading-relaxed">
                    {node.description}
                  </p>

                  {/* Storyteller Secret Intel Strip */}
                  {isStorytellerMode && node.secretNotes && (
                    <div className="mt-2.5 pt-2 border-t border-rose-950/60 bg-red-950/20 -mx-3.5 -mb-3.5 p-2 rounded-b-xl text-[10px] text-rose-300 font-serif italic flex items-start gap-1.5">
                      <FileText className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-tight">{node.secretNotes}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        </div>

      </div>

      {/* INSPECTOR & EVIDENCE DETAILS PANEL */}
      {selectedNode && (
        <div className="bg-[#0b080e] border border-[#221424] rounded-2xl p-6 text-xs font-sans animate-fade-in space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#1b101c]">
            <div className="flex items-center gap-3">
              <div 
                className="p-3 rounded-xl border"
                style={{ 
                  backgroundColor: `${selectedNode.color}25`, 
                  color: selectedNode.color,
                  borderColor: `${selectedNode.color}60`
                }}
              >
                {React.createElement(getNodeIcon(selectedNode.type), { className: 'w-6 h-6' })}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-cinzel text-lg font-bold text-white">{selectedNode.title}</h3>
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

            {/* Storyteller Action Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleSecretNode(selectedNode.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition ${
                  selectedNode.isSecret
                    ? 'bg-purple-950 hover:bg-purple-900 border-purple-700 text-purple-200'
                    : 'bg-[#150f1c] hover:bg-[#20152a] border-[#291836] text-neutral-300'
                }`}
                title="Toggle Player Visibility"
              >
                {selectedNode.isSecret ? <Eye className="w-3.5 h-3.5 text-purple-400" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-400" />}
                {selectedNode.isSecret ? 'Reveal to Players' : 'Hide from Players'}
              </button>
              
              <button
                type="button"
                onClick={() => handleStartEditNode(selectedNode)}
                className="px-3 py-1.5 rounded-lg bg-[#150f1c] hover:bg-[#20152a] border border-[#291836] text-neutral-300 hover:text-white flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDeleteNode(selectedNode.id)}
                className="p-2 rounded-lg bg-[#150f1c] hover:bg-red-950 border border-[#291836] hover:border-red-800 text-neutral-400 hover:text-red-300 transition"
                title="Remove pin"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Edit Form if active */}
          {isEditingNode ? (
            <div className="p-4 bg-[#140c18] border border-[#25152a] rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-400 font-mono block mb-1">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full bg-[#0d0710] border border-[#221226] rounded px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 font-mono block mb-1">Investigation Status</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as any)}
                    className="w-full bg-[#0d0710] border border-[#221226] rounded px-3 py-1.5 text-white font-mono"
                  >
                    <option value="discovered">Discovered</option>
                    <option value="unsolved">Unsolved</option>
                    <option value="cleared">Cleared / Alibi Confirmed</option>
                    <option value="hidden">Hidden / Concealed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Public Description</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  className="w-full bg-[#0d0710] border border-[#221226] rounded px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-amber-400 font-mono block mb-1">Storyteller Secret Intel (Hidden from Players)</label>
                <textarea
                  rows={2}
                  value={editSecretNotes}
                  onChange={e => setEditSecretNotes(e.target.value)}
                  className="w-full bg-[#0d0710] border border-amber-900/60 rounded px-3 py-1.5 text-amber-200 font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingNode(false)}
                  className="px-3 py-1 rounded bg-[#180f1c] text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditNode}
                  className="px-4 py-1 rounded bg-rose-900 hover:bg-rose-800 text-white font-cinzel font-bold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Classified intel strip */}
              {selectedNode.secretNotes && (
                <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed ${
                  isStorytellerMode
                    ? 'bg-amber-950/30 border-amber-800/80 text-amber-200'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-600 italic select-none'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-300">
                    <Lock className="w-3.5 h-3.5" />
                    STORYTELLER CLASSIFIED MOTIVES & OCCULT INTEL:
                  </div>
                  {isStorytellerMode ? selectedNode.secretNotes : '[RESTRICTED EVIDENCE REDACTED FOR PLAYERS]'}
                </div>
              )}

              {/* Connected Threads */}
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-2">
                  CONNECTED LEADS & RED STRINGS:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeBoard.links.filter(l => l.sourceId === selectedNode.id || l.targetId === selectedNode.id).map(link => {
                    const otherNodeId = link.sourceId === selectedNode.id ? link.targetId : link.sourceId;
                    const otherNode = activeBoard.nodes.find(n => n.id === otherNodeId);
                    return (
                      <div
                        key={link.id}
                        className="px-3 py-1.5 rounded-lg bg-[#140c18] border border-[#24132b] text-neutral-300 text-xs flex items-center gap-2"
                      >
                        <span className="font-mono text-red-400 font-bold">{link.label}:</span>
                        <span className="font-semibold text-white">{otherNode?.title || 'Unknown Pin'}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteLink(link.id)}
                          className="text-neutral-500 hover:text-red-400 ml-1"
                          title="Cut thread"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

        </div>
      )}

      {/* MODAL 1: ADD PIN */}
      {addNodeModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0e0812] border border-[#2a1730] rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#211228]">
              <h3 className="font-cinzel text-base font-bold text-white">ADD EVIDENCE PIN TO CORKBOARD</h3>
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
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Pin Type</label>
                <select
                  value={newNodeType}
                  onChange={e => setNewNodeType(e.target.value as MysteryNodeType)}
                  className="w-full bg-[#140c1a] border border-[#2b1836] rounded px-3 py-2 text-white font-mono"
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
                  className="w-full bg-[#140c1a] border border-[#2b1836] rounded px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Public Description (Visible to Players)</label>
                <textarea
                  rows={2}
                  placeholder="Details discovered during mortal investigation..."
                  value={newNodeDesc}
                  onChange={e => setNewNodeDesc(e.target.value)}
                  className="w-full bg-[#140c1a] border border-[#2b1836] rounded px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-amber-400 font-mono block mb-1">Storyteller Secret Intel (Hidden from Players)</label>
                <textarea
                  rows={2}
                  placeholder="True conspirators, occult lore, framing attempts..."
                  value={newNodeSecretNotes}
                  onChange={e => setNewNodeSecretNotes(e.target.value)}
                  className="w-full bg-[#140c1a] border border-amber-900/60 rounded px-3 py-1.5 text-amber-200 font-mono text-xs"
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
                  Hide entire pin from Player View (Undiscovered Conspirator)
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

      {/* MODAL 2: TIE RED THREAD */}
      {addLinkModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0e0812] border border-[#2a1730] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#211228]">
              <h3 className="font-cinzel text-base font-bold text-white">TIE RED STRING LEAD</h3>
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
                  className="w-full bg-[#140c1a] border border-[#2b1836] rounded px-3 py-2 text-white font-cinzel"
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
                  className="w-full bg-[#140c1a] border border-[#2b1836] rounded px-3 py-2 text-white font-cinzel"
                >
                  <option value="">-- Choose Pin B --</option>
                  {activeBoard.nodes.filter(n => n.id !== linkSourceId).map(n => (
                    <option key={n.id} value={n.id}>{n.title} ({n.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono block mb-1">Lead Note</label>
                <input
                  type="text"
                  placeholder="e.g. Fled crime scene in victim vehicle"
                  value={linkLabel}
                  onChange={e => setLinkLabel(e.target.value)}
                  className="w-full bg-[#140c1a] border border-[#2b1836] rounded px-3 py-1.5 text-white"
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
                  Secret thread (hidden from Player View)
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
