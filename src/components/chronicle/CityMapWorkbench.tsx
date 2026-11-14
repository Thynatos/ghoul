import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, TerritoryZone } from '../../types/vtm';
import { Plus, Trash2, MapPin as MapPinIcon, Layers, Shield } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface CityMapWorkbenchProps {
  chronicleId: string;
  pins: MapPin[];
  territories: TerritoryZone[];
  onAddPin: (pin: MapPin) => void;
  onDeletePin: (pinId: string) => void;
}

export const CityMapWorkbench: React.FC<CityMapWorkbenchProps> = ({
  chronicleId,
  pins,
  territories,
  onAddPin,
  onDeletePin
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const circlesRef = useRef<L.Circle[]>([]);

  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [filterSect, setFilterSect] = useState<string>('all');
  const [isAddingMode, setIsAddingMode] = useState<boolean>(false);

  // New Pin Form Modal State
  const [newPinModalOpen, setNewPinModalOpen] = useState<boolean>(false);
  const [pendingLatLng, setPendingLatLng] = useState<[number, number] | null>(null);
  const [newPinName, setNewPinName] = useState('');
  const [newPinType, setNewPinType] = useState<MapPin['type']>('haven');
  const [newPinSect, setNewPinSect] = useState<MapPin['sect']>('Camarilla');
  const [newPinDesc, setNewPinDesc] = useState('');

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center Chicago
    const defaultCenter: [number, number] = [41.8781, -87.6298];
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 12,
      zoomControl: true
    });

    // Free OpenStreetMap tilelayer with dark noir filter (zero watermarks, zero API key)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      setPendingLatLng([e.latlng.lat, e.latlng.lng]);
      setNewPinModalOpen(true);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Territories
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Clear old territory circles
    circlesRef.current.forEach(c => c.remove());
    circlesRef.current = [];

    // Render territory zones
    territories.forEach(ter => {
      const circle = L.circle(ter.center, {
        color: ter.color,
        fillColor: ter.color,
        fillOpacity: 0.15,
        weight: 2,
        radius: ter.radius
      }).addTo(map);

      circle.bindTooltip(`<strong>${ter.name}</strong><br/>Faction: ${ter.faction} (${ter.influencePercent}% control)`, {
        className: 'bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs p-1.5'
      });
      circlesRef.current.push(circle);
    });

    // Render Pins
    const filteredPins = filterSect === 'all' 
      ? pins 
      : pins.filter(p => (p.sect || 'Independent').toLowerCase() === filterSect.toLowerCase());

    filteredPins.forEach(pin => {
      const pinColors: Record<string, string> = {
        elysium: '#a855f7', // purple
        haven: '#3b82f6',   // blue
        feeding: '#dc2626', // blood red
        chantry: '#eab308', // gold
        court: '#6366f1',
        baron: '#f97316',   // orange
        lupine: '#10b981',  // green
        safehouse: '#64748b',
        crime: '#ef4444',
        other: '#9ca3af'
      };

      const color = pinColors[pin.type] || '#dc2626';

      const customIcon = L.divIcon({
        className: 'custom-pin',
        html: `
          <div style="
            background-color: ${color};
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid #ffffff;
            box-shadow: 0 0 10px ${color};
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="transform: rotate(45deg); color: white; font-size: 11px; font-weight: bold;">
              ${pin.type === 'elysium' ? '🏛️' : pin.type === 'haven' ? '🏰' : pin.type === 'feeding' ? '🩸' : '📍'}
            </span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28]
      });

      const marker = L.marker([pin.lat, pin.lng], { icon: customIcon }).addTo(map);

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        soundEngine.playDiceRoll();
        setSelectedPin(pin);
      });

      markersRef.current.push(marker);
    });
  }, [pins, territories, filterSect]);

  const handleCreatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingLatLng) return;

    const newPin: MapPin = {
      id: 'pin_' + Date.now(),
      chronicleId,
      name: newPinName.trim() || 'New Kindred Haven',
      type: newPinType,
      sect: newPinSect,
      lat: pendingLatLng[0],
      lng: pendingLatLng[1],
      description: newPinDesc.trim() || 'Secret Kindred locale.'
    };

    onAddPin(newPin);
    setNewPinModalOpen(false);
    setPendingLatLng(null);
    setNewPinName('');
    setNewPinDesc('');
    soundEngine.playCritical();
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Legend Bar */}
      <div className="bg-[#0e0e13] border border-[#222230] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-neutral-400 font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-rose-500" /> Filter Factions:
          </span>
          {['all', 'Camarilla', 'Anarch', 'Independent'].map(sect => (
            <button
              key={sect}
              type="button"
              onClick={() => setFilterSect(sect)}
              className={`px-2.5 py-1 rounded-lg border font-medium capitalize transition ${
                filterSect.toLowerCase() === sect.toLowerCase()
                  ? 'bg-rose-950 border-rose-700 text-rose-300'
                  : 'bg-[#14141e] border-[#292938] text-neutral-400 hover:text-white'
              }`}
            >
              {sect}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-neutral-400 text-[11px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Elysium
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Haven
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> The Rack (Feeding)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Chantry
          </span>
        </div>
      </div>

      {/* Map View & Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Leaflet Container */}
        <div className="lg:col-span-3 bg-[#0a0a0f] border border-[#20202d] rounded-2xl overflow-hidden h-[540px] relative shadow-2xl dark-map-tiles">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
          <div className="absolute bottom-3 left-3 z-10 bg-black/85 backdrop-blur-md border border-neutral-800 rounded-lg px-3 py-1.5 text-[11px] font-mono text-neutral-400 pointer-events-none">
            💡 Click anywhere on the map to plant a new Kindred pin
          </div>
        </div>

        {/* Pin Details Drawer */}
        <div className="bg-[#0b0b10] border border-[#20202d] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
          {selectedPin ? (
            <div className="space-y-3 animate-fade-in text-xs">
              <div className="flex items-start justify-between gap-2 border-b border-[#1c1c28] pb-3">
                <div>
                  <span className="text-[10px] font-cinzel font-bold text-rose-400 uppercase tracking-widest block">
                    {selectedPin.type.toUpperCase()} • {selectedPin.sect || 'NEUTRAL'}
                  </span>
                  <h3 className="font-cinzel text-lg font-bold text-white mt-0.5">
                    {selectedPin.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPin(null)}
                  className="text-neutral-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-neutral-300">
                <p className="leading-relaxed">{selectedPin.description}</p>
                {selectedPin.owner && (
                  <p className="text-neutral-400">
                    <strong className="text-neutral-300">Controlled by:</strong> {selectedPin.owner}
                  </p>
                )}
                {selectedPin.clan && (
                  <p className="text-neutral-400">
                    <strong className="text-neutral-300">Clan Domain:</strong> {selectedPin.clan}
                  </p>
                )}
                <div className="text-[10px] font-mono text-neutral-500 pt-1">
                  Coords: {selectedPin.lat.toFixed(4)}, {selectedPin.lng.toFixed(4)}
                </div>
              </div>

              <div className="pt-3 border-t border-[#1c1c28] flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onDeletePin(selectedPin.id);
                    setSelectedPin(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950 border border-rose-900 text-rose-400 hover:text-rose-200 text-xs flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Pin
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500 text-xs space-y-2">
              <MapPinIcon className="w-8 h-8 mx-auto text-neutral-600" />
              <p className="font-cinzel">Select any pin on the map to inspect turf details, security, and kindred owners.</p>
            </div>
          )}

          {/* Quick List of Pins */}
          <div className="pt-3 border-t border-[#1c1c28]">
            <p className="font-cinzel text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">
              Registered Landmarks ({pins.length})
            </p>
            <div className="max-h-[160px] overflow-y-auto space-y-1 pr-1 text-xs">
              {pins.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPin(p);
                    mapInstanceRef.current?.flyTo([p.lat, p.lng], 14);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded bg-[#13131c] hover:bg-[#1a1a26] text-neutral-300 truncate block transition"
                >
                  📍 {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Pin Modal */}
      {newPinModalOpen && pendingLatLng && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0c0c11] border border-[#272738] rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="font-cinzel text-base font-bold text-neutral-100 tracking-wider mb-1">
              PLANT NEW KINDRED PIN
            </h3>
            <p className="text-xs text-neutral-400 mb-4 font-mono">
              Coordinates: {pendingLatLng[0].toFixed(4)}, {pendingLatLng[1].toFixed(4)}
            </p>

            <form onSubmit={handleCreatePin} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 font-cinzel mb-1">Pin Title *</label>
                <input
                  type="text"
                  required
                  value={newPinName}
                  onChange={e => setNewPinName(e.target.value)}
                  placeholder="e.g. The Velvet Underground Haven"
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-cinzel mb-1">Type</label>
                  <select
                    value={newPinType}
                    onChange={e => setNewPinType(e.target.value as any)}
                    className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                  >
                    <option value="haven">Haven</option>
                    <option value="elysium">Elysium</option>
                    <option value="feeding">The Rack (Feeding)</option>
                    <option value="chantry">Chantry</option>
                    <option value="baron">Anarch HQ</option>
                    <option value="lupine">Lupine Territory</option>
                    <option value="safehouse">SI Safehouse</option>
                    <option value="crime">Crime Scene</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-cinzel mb-1">Sect</label>
                  <select
                    value={newPinSect}
                    onChange={e => setNewPinSect(e.target.value as any)}
                    className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                  >
                    <option value="Camarilla">Camarilla</option>
                    <option value="Anarch">Anarch</option>
                    <option value="Sabbat">Sabbat</option>
                    <option value="Independent">Independent</option>
                    <option value="Second Inquisition">Second Inquisition</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-cinzel mb-1">Description & Secret Notes</label>
                <textarea
                  rows={3}
                  value={newPinDesc}
                  onChange={e => setNewPinDesc(e.target.value)}
                  placeholder="Notes, security measures, passwords, escape routes..."
                  className="w-full bg-[#14141e] border border-[#272738] rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div className="pt-3 border-t border-[#1c1c28] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewPinModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#181824] hover:bg-[#20202e] text-neutral-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-900 hover:bg-rose-800 text-white font-cinzel font-bold"
                >
                  Plant Pin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
