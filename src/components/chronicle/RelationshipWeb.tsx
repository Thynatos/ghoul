import React, { useRef, useEffect, useState } from 'react';
import { RelationshipNode, RelationshipLink } from '../../types/vtm';
import { Plus, Trash2, Link as LinkIcon, Sparkles } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface RelationshipWebProps {
  chronicleId: string;
  nodes: RelationshipNode[];
  links: RelationshipLink[];
  onUpdateNodes: (nodes: RelationshipNode[]) => void;
  onUpdateLinks: (links: RelationshipLink[]) => void;
}

export const RelationshipWeb: React.FC<RelationshipWebProps> = ({
  chronicleId,
  nodes,
  links,
  onUpdateNodes,
  onUpdateLinks
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Add Node Modal
  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeType, setNewNodeType] = useState<RelationshipNode['type']>('npc');
  const [newNodeRole, setNewNodeRole] = useState('');

  // Add Link Modal
  const [addLinkOpen, setAddLinkOpen] = useState(false);
  const [sourceId, setSourceId] = useState(nodes[0]?.id || '');
  const [targetId, setTargetId] = useState(nodes[1]?.id || '');
  const [linkType, setLinkType] = useState<RelationshipLink['type']>('ally');
  const [linkLabel, setLinkLabel] = useState('');

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const width = canvas.parentElement?.clientWidth || 800;
    const height = 500;
    canvas.width = width;
    canvas.height = height;

    // Clear
    ctx.fillStyle = '#08080c';
    ctx.fillRect(0, 0, width, height);

    // Draw grid points
    ctx.fillStyle = '#181822';
    for (let x = 20; x < width; x += 40) {
      for (let y = 20; y < height; y += 40) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    // Draw Links
    links.forEach(link => {
      const source = nodes.find(n => n.id === link.sourceId);
      const target = nodes.find(n => n.id === link.targetId);
      if (!source || !target) return;

      const linkColors: Record<string, string> = {
        blood_bond_1: '#dc2626',
        blood_bond_2: '#991b1b',
        blood_bond_3: '#450a0a',
        rival: '#ef4444',
        ally: '#10b981',
        sire: '#eab308',
        childe: '#f59e0b',
        mentor: '#3b82f6',
        boon: '#8b5cf6',
        love: '#ec4899',
        hatred: '#dc2626'
      };

      const color = linkColors[link.type] || '#6b7280';

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = link.type.startsWith('blood_bond') ? 3 : 1.5;
      if (link.type === 'rival' || link.type === 'hatred') {
        ctx.setLineDash([4, 4]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw label midpoint
      if (link.label) {
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(midX - 35, midY - 9, 70, 18);
        ctx.strokeStyle = '#232330';
        ctx.strokeRect(midX - 35, midY - 9, 70, 18);

        ctx.fillStyle = '#d1d5db';
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(link.label, midX, midY);
      }
    });

    // Draw Nodes
    nodes.forEach(node => {
      const isSelected = selectedNodeId === node.id;
      const radius = node.type === 'pc' ? 24 : node.type === 'faction' ? 26 : 20;

      // Glow
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(225, 29, 72, 0.3)';
        ctx.fill();
      }

      // Circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color || (node.type === 'pc' ? '#be123c' : node.type === 'touchstone' ? '#0891b2' : '#272733');
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#ffffff' : '#474759';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Initial icon/letter
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const initial = node.name.slice(0, 2).toUpperCase();
      ctx.fillText(initial, node.x, node.y);

      // Name text under node
      ctx.fillStyle = '#f3f4f6';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillText(node.name, node.x, node.y + radius + 14);

      if (node.role) {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '9px Inter, sans-serif';
        ctx.fillText(node.role, node.x, node.y + radius + 26);
      }
    });
  }, [nodes, links, selectedNodeId]);

  // Mouse handlers for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked node
    const found = nodes.find(n => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= 28;
    });

    if (found) {
      setDraggedNodeId(found.id);
      setSelectedNodeId(found.id);
      setDragOffset({ x: found.x - x, y: found.y - y });
      soundEngine.playDiceRoll();
    } else {
      setSelectedNodeId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedNodeId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const nextNodes = nodes.map(n => {
      if (n.id === draggedNodeId) {
        return {
          ...n,
          x: Math.max(30, Math.min(canvas.width - 30, x + dragOffset.x)),
          y: Math.max(30, Math.min(canvas.height - 30, y + dragOffset.y))
        };
      }
      return n;
    });
    onUpdateNodes(nextNodes);
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    const newNode: RelationshipNode = {
      id: 'node_' + Date.now(),
      chronicleId,
      name: newNodeName.trim() || 'Kindred Associate',
      type: newNodeType,
      role: newNodeRole.trim() || undefined,
      x: 200 + Math.random() * 200,
      y: 150 + Math.random() * 150
    };
    onUpdateNodes([...nodes, newNode]);
    setAddNodeOpen(false);
    setNewNodeName('');
    setNewNodeRole('');
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) return;

    const newLink: RelationshipLink = {
      id: 'link_' + Date.now(),
      chronicleId,
      sourceId,
      targetId,
      type: linkType,
      label: linkLabel.trim() || linkType.replace(/_/g, ' ')
    };
    onUpdateLinks([...links, newLink]);
    setAddLinkOpen(false);
    setLinkLabel('');
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="bg-[#0e0e13] border border-[#222230] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAddNodeOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 font-cinzel font-bold flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Figure / Node
          </button>
          <button
            type="button"
            onClick={() => setAddLinkOpen(true)}
            disabled={nodes.length < 2}
            className="px-3 py-1.5 rounded-lg bg-[#14141e] hover:bg-[#1f1f2c] border border-[#282838] text-neutral-300 disabled:opacity-40 font-cinzel font-semibold flex items-center gap-1.5 transition"
          >
            <LinkIcon className="w-3.5 h-3.5" /> Connect Bond / Link
          </button>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Ally
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Blood Bond / Rival
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Sire / Childe
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Boon Owed
          </span>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="bg-[#07070a] border border-[#20202d] rounded-2xl overflow-hidden relative shadow-2xl">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-[500px] cursor-grab active:cursor-grabbing block"
        />
        <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md border border-neutral-800 rounded-lg px-3 py-1 text-[11px] font-mono text-neutral-400 pointer-events-none">
          💡 Drag nodes to rearrange the Kindred web • Click node to select
        </div>

        {/* Selected Node Details Bar */}
        {selectedNode && (
          <div className="absolute top-3 right-3 bg-[#0d0d12]/95 border border-[#272738] rounded-xl p-3.5 text-xs space-y-2 backdrop-blur-md max-w-xs shadow-xl animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-cinzel font-bold text-white text-sm">{selectedNode.name}</span>
              <button
                type="button"
                onClick={() => setSelectedNodeId(null)}
                className="text-neutral-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-neutral-400">Type: <span className="text-neutral-200 capitalize">{selectedNode.type}</span></p>
            {selectedNode.role && <p className="text-neutral-400">Role: <span className="text-neutral-200">{selectedNode.role}</span></p>}
            <button
              type="button"
              onClick={() => {
                onUpdateNodes(nodes.filter(n => n.id !== selectedNode.id));
                onUpdateLinks(links.filter(l => l.sourceId !== selectedNode.id && l.targetId !== selectedNode.id));
                setSelectedNodeId(null);
              }}
              className="w-full py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[11px] flex items-center justify-center gap-1 transition"
            >
              <Trash2 className="w-3 h-3" /> Remove Figure
            </button>
          </div>
        )}
      </div>

      {/* Add Node Modal */}
      {addNodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0c0c11] border border-[#272738] rounded-xl max-w-sm w-full p-5 shadow-2xl relative text-xs">
            <h3 className="font-cinzel text-sm font-bold text-neutral-100 tracking-wider mb-3">
              ADD KINDRED FIGURE TO WEB
            </h3>
            <form onSubmit={handleAddNode} className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={newNodeName}
                  onChange={e => setNewNodeName(e.target.value)}
                  placeholder="e.g. Sheriff Damian"
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Type</label>
                <select
                  value={newNodeType}
                  onChange={e => setNewNodeType(e.target.value as any)}
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                >
                  <option value="npc">NPC Kindred</option>
                  <option value="pc">Player Character</option>
                  <option value="touchstone">Mortal Touchstone</option>
                  <option value="faction">Faction / Syndicate</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Role / Epithet</label>
                <input
                  type="text"
                  value={newNodeRole}
                  onChange={e => setNewNodeRole(e.target.value)}
                  placeholder="e.g. Primogen Whip"
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddNodeOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#181822] text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-rose-900 text-white font-cinzel font-bold"
                >
                  Add Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Link Modal */}
      {addLinkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0c0c11] border border-[#272738] rounded-xl max-w-sm w-full p-5 shadow-2xl relative text-xs">
            <h3 className="font-cinzel text-sm font-bold text-neutral-100 tracking-wider mb-3">
              CONNECT RELATIONSHIP BOND
            </h3>
            <form onSubmit={handleAddLink} className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">Source Figure</label>
                <select
                  value={sourceId}
                  onChange={e => setSourceId(e.target.value)}
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                >
                  {nodes.map(n => (
                    <option key={n.id} value={n.id}>{n.name} ({n.type})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Target Figure</label>
                <select
                  value={targetId}
                  onChange={e => setTargetId(e.target.value)}
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                >
                  {nodes.map(n => (
                    <option key={n.id} value={n.id}>{n.name} ({n.type})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Bond Type</label>
                <select
                  value={linkType}
                  onChange={e => setLinkType(e.target.value as any)}
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                >
                  <option value="blood_bond_1">Blood Bond (Stage 1)</option>
                  <option value="blood_bond_2">Blood Bond (Stage 2)</option>
                  <option value="blood_bond_3">Blood Bond (Full Stage 3)</option>
                  <option value="sire">Sire</option>
                  <option value="childe">Childe</option>
                  <option value="ally">Ally</option>
                  <option value="rival">Rival / Blood Feud</option>
                  <option value="mentor">Mentor</option>
                  <option value="boon">Major Boon Owed</option>
                  <option value="love">Passionate Devotion</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Link Description / Label</label>
                <input
                  type="text"
                  value={linkLabel}
                  onChange={e => setLinkLabel(e.target.value)}
                  placeholder="e.g. Sworn blood pact"
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddLinkOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#181822] text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-rose-900 text-white font-cinzel font-bold"
                >
                  Connect Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
