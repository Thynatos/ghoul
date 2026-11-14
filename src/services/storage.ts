import { 
  Character, 
  Chronicle, 
  MapPin, 
  TerritoryZone, 
  RelationshipNode, 
  RelationshipLink, 
  BoonRecord, 
  SessionNote, 
  RollResult,
  GameEdition 
} from '../types/vtm';

const KEYS = {
  CHARACTERS: 'ghoul_characters',
  CHRONICLES: 'ghoul_chronicles',
  ACTIVE_CHAR: 'ghoul_active_character_id',
  ACTIVE_CHRONICLE: 'ghoul_active_chronicle_id',
  PINS: 'ghoul_map_pins',
  TERRITORIES: 'ghoul_territory_zones',
  REL_NODES: 'ghoul_relationship_nodes',
  REL_LINKS: 'ghoul_relationship_links',
  BOONS: 'ghoul_boons',
  SESSIONS: 'ghoul_sessions',
  ROLLS: 'ghoul_roll_history',
  EDITION: 'ghoul_edition'
};

export const storageService = {
  // Characters
  getCharacters(): Character[] {
    try {
      const data = localStorage.getItem(KEYS.CHARACTERS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    const initial = getInitialCharacters();
    this.saveCharacters(initial);
    return initial;
  },

  saveCharacters(chars: Character[]) {
    localStorage.setItem(KEYS.CHARACTERS, JSON.stringify(chars));
  },

  getCharacter(id: string): Character | undefined {
    return this.getCharacters().find(c => c.id === id);
  },

  saveCharacter(char: Character) {
    const list = this.getCharacters();
    const idx = list.findIndex(c => c.id === char.id);
    if (idx >= 0) {
      list[idx] = { ...char, updatedAt: Date.now() };
    } else {
      list.unshift({ ...char, createdAt: Date.now(), updatedAt: Date.now() });
    }
    this.saveCharacters(list);
  },

  deleteCharacter(id: string) {
    const list = this.getCharacters().filter(c => c.id !== id);
    this.saveCharacters(list);
  },

  getActiveCharacterId(): string | null {
    return localStorage.getItem(KEYS.ACTIVE_CHAR);
  },

  setActiveCharacterId(id: string) {
    localStorage.setItem(KEYS.ACTIVE_CHAR, id);
  },

  // Chronicles
  getChronicles(): Chronicle[] {
    try {
      const data = localStorage.getItem(KEYS.CHRONICLES);
      if (data) return JSON.parse(data);
    } catch (e) {}
    const initial = getInitialChronicles();
    this.saveChronicles(initial);
    return initial;
  },

  saveChronicles(chronicles: Chronicle[]) {
    localStorage.setItem(KEYS.CHRONICLES, JSON.stringify(chronicles));
  },

  getActiveChronicleId(): string | null {
    const id = localStorage.getItem(KEYS.ACTIVE_CHRONICLE);
    if (id) return id;
    const chronicles = this.getChronicles();
    if (chronicles.length > 0) {
      this.setActiveChronicleId(chronicles[0].id);
      return chronicles[0].id;
    }
    return null;
  },

  setActiveChronicleId(id: string) {
    localStorage.setItem(KEYS.ACTIVE_CHRONICLE, id);
  },

  // Map Pins
  getPins(chronicleId?: string): MapPin[] {
    try {
      const data = localStorage.getItem(KEYS.PINS);
      const all: MapPin[] = data ? JSON.parse(data) : getInitialPins();
      return chronicleId ? all.filter(p => p.chronicleId === chronicleId) : all;
    } catch (e) {
      return getInitialPins();
    }
  },

  savePins(pins: MapPin[]) {
    localStorage.setItem(KEYS.PINS, JSON.stringify(pins));
  },

  addPin(pin: MapPin) {
    const pins = this.getPins();
    pins.push(pin);
    this.savePins(pins);
  },

  deletePin(pinId: string) {
    const pins = this.getPins().filter(p => p.id !== pinId);
    this.savePins(pins);
  },

  // Territory Zones
  getTerritories(chronicleId?: string): TerritoryZone[] {
    try {
      const data = localStorage.getItem(KEYS.TERRITORIES);
      const all: TerritoryZone[] = data ? JSON.parse(data) : getInitialTerritories();
      return chronicleId ? all.filter(t => t.chronicleId === chronicleId) : all;
    } catch (e) {
      return getInitialTerritories();
    }
  },

  saveTerritories(territories: TerritoryZone[]) {
    localStorage.setItem(KEYS.TERRITORIES, JSON.stringify(territories));
  },

  // Relationship Web
  getRelationshipNodes(chronicleId?: string): RelationshipNode[] {
    try {
      const data = localStorage.getItem(KEYS.REL_NODES);
      const all: RelationshipNode[] = data ? JSON.parse(data) : getInitialRelationshipNodes();
      return chronicleId ? all.filter(n => n.chronicleId === chronicleId) : all;
    } catch (e) {
      return getInitialRelationshipNodes();
    }
  },

  saveRelationshipNodes(nodes: RelationshipNode[]) {
    localStorage.setItem(KEYS.REL_NODES, JSON.stringify(nodes));
  },

  getRelationshipLinks(chronicleId?: string): RelationshipLink[] {
    try {
      const data = localStorage.getItem(KEYS.REL_LINKS);
      const all: RelationshipLink[] = data ? JSON.parse(data) : getInitialRelationshipLinks();
      return chronicleId ? all.filter(l => l.chronicleId === chronicleId) : all;
    } catch (e) {
      return getInitialRelationshipLinks();
    }
  },

  saveRelationshipLinks(links: RelationshipLink[]) {
    localStorage.setItem(KEYS.REL_LINKS, JSON.stringify(links));
  },

  // Harpy Boons
  getBoons(chronicleId?: string): BoonRecord[] {
    try {
      const data = localStorage.getItem(KEYS.BOONS);
      const all: BoonRecord[] = data ? JSON.parse(data) : getInitialBoons();
      return chronicleId ? all.filter(b => b.chronicleId === chronicleId) : all;
    } catch (e) {
      return getInitialBoons();
    }
  },

  saveBoons(boons: BoonRecord[]) {
    localStorage.setItem(KEYS.BOONS, JSON.stringify(boons));
  },

  // Session Logs
  getSessions(chronicleId?: string): SessionNote[] {
    try {
      const data = localStorage.getItem(KEYS.SESSIONS);
      const all: SessionNote[] = data ? JSON.parse(data) : getInitialSessions();
      return chronicleId ? all.filter(s => s.chronicleId === chronicleId) : all;
    } catch (e) {
      return getInitialSessions();
    }
  },

  saveSessions(sessions: SessionNote[]) {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  },

  // Rolls History
  getRollHistory(): RollResult[] {
    try {
      const data = localStorage.getItem(KEYS.ROLLS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addRoll(roll: RollResult) {
    const list = this.getRollHistory();
    list.unshift(roll);
    if (list.length > 50) list.pop();
    localStorage.setItem(KEYS.ROLLS, JSON.stringify(list));
  },

  clearRollHistory() {
    localStorage.removeItem(KEYS.ROLLS);
  },

  // Preferred Edition
  getEdition(): GameEdition {
    return (localStorage.getItem(KEYS.EDITION) as GameEdition) || 'v5';
  },

  setEdition(edition: GameEdition) {
    localStorage.setItem(KEYS.EDITION, edition);
  },

  // Backup & Restore
  exportBackupJSON(): string {
    const bundle = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      characters: this.getCharacters(),
      chronicles: this.getChronicles(),
      pins: this.getPins(),
      territories: this.getTerritories(),
      nodes: this.getRelationshipNodes(),
      links: this.getRelationshipLinks(),
      boons: this.getBoons(),
      sessions: this.getSessions()
    };
    return JSON.stringify(bundle, null, 2);
  },

  importBackupJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.characters)) this.saveCharacters(data.characters);
      if (Array.isArray(data.chronicles)) this.saveChronicles(data.chronicles);
      if (Array.isArray(data.pins)) this.savePins(data.pins);
      if (Array.isArray(data.territories)) this.saveTerritories(data.territories);
      if (Array.isArray(data.nodes)) this.saveRelationshipNodes(data.nodes);
      if (Array.isArray(data.links)) this.saveRelationshipLinks(data.links);
      if (Array.isArray(data.boons)) this.saveBoons(data.boons);
      if (Array.isArray(data.sessions)) this.saveSessions(data.sessions);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
};

// Seed Data
function getInitialChronicles(): Chronicle[] {
  return [
    {
      id: 'chronicle_chicago_1',
      title: 'Chicago by Night: Blood & Asphodel',
      edition: 'v5',
      city: 'Chicago, IL',
      storyteller: 'The Prince',
      tenets: [
        'Never harm an innocent child.',
        'Honor sworn boons or perish in shame.',
        'The Masquerade is absolute law.'
      ],
      description: 'The Windy City stands upon a powder keg. Anarchs push from Gary, while the Prince maintains an uneasy peace with the Primogen Council under the gaze of the Second Inquisition.',
      createdAt: Date.now() - 86400000 * 10,
      updatedAt: Date.now()
    }
  ];
}

function getInitialCharacters(): Character[] {
  return [
    {
      id: 'char_brujah_marcus',
      edition: 'v5',
      name: 'Marcus "Rebel" Vance',
      concept: 'Anarch Agitator & Former Union Organizer',
      clan: 'Brujah',
      generation: 11,
      predatorType: 'Alleycat',
      sire: 'Tyler King',
      chronicleId: 'chronicle_chicago_1',
      portraitUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      healthMax: 7,
      healthDamage: ['none', 'none', 'none', 'none', 'none', 'none', 'none'],
      willpowerMax: 6,
      willpowerDamage: ['none', 'none', 'none', 'none', 'none', 'none'],
      hunger: 1,
      humanity: 7,
      stains: 0,
      bloodPotency: 1,
      ambition: 'Liberate the South Side docks from Ventrue corporate control.',
      desire: 'Corner the Sheriff’s hound and beat the truth out of him.',
      touchstones: [
        { id: 't1', conviction: 'Always defend the working mortal from exploitation.', touchstone: 'Elena Diaz (Community Organizer)' }
      ],
      attributes: {
        physical: { strength: 4, dexterity: 3, stamina: 3 },
        social: { charisma: 3, manipulation: 2, composure: 3 },
        mental: { intelligence: 2, wits: 3, resolve: 3 }
      },
      skills: {
        physical: { athletics: 3, brawl: 4, craft: 0, drive: 2, firearms: 2, larceny: 2, melee: 3, stealth: 2, survival: 1 },
        social: { animalKen: 0, etiquette: 1, insight: 2, intimidation: 3, leadership: 3, performance: 0, persuasion: 2, streetwise: 3, subterfuge: 1 },
        mental: { academics: 1, awareness: 2, finance: 1, investigation: 2, medicine: 0, occult: 1, politics: 2, science: 0, technology: 1 }
      },
      specialties: {
        brawl: ['Street Fighting', 'Disarms'],
        intimidation: ['Physical Menace'],
        politics: ['Labor Movements']
      },
      disciplines: [
        { id: 'potence', name: 'Potence', level: 2, powers: ['Lethal Body', 'Prowess'] },
        { id: 'celerity', name: 'Celerity', level: 1, powers: ['Rapid Reflexes'] },
        { id: 'presence', name: 'Presence', level: 1, powers: ['Daunt'] }
      ],
      advantages: [
        { id: 'contacts_dock', name: 'Contacts: Longshoremen Union', type: 'merit', category: 'background', dots: 2 },
        { id: 'allies_bikers', name: 'Allies: Street Biker Gang', type: 'merit', category: 'background', dots: 2 },
        { id: 'flaw_enemy', name: 'Enemy: Sheriff Enforcer', type: 'flaw', category: 'social', dots: 2 }
      ],
      biography: 'Embraced during the steel mill strikes of 1978, Marcus was forged in protest and rage. He refuses to bow to the Primogen and serves as a pillar for young Kindred in Chicago.',
      haven: 'Abandoned auto-body workshop in Bridgeport.',
      coterie: 'The South Side Underground',
      experienceTotal: 15,
      experienceSpent: 9,
      createdAt: Date.now() - 86400000 * 5,
      updatedAt: Date.now()
    },
    {
      id: 'char_toreador_helena',
      edition: 'v5',
      name: 'Helena DuMont',
      concept: 'High-Society Gallerist & Seductress',
      clan: 'Toreador',
      generation: 10,
      predatorType: 'Siren',
      sire: 'Francois Villon',
      chronicleId: 'chronicle_chicago_1',
      portraitUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      healthMax: 6,
      healthDamage: ['none', 'none', 'none', 'none', 'none', 'none'],
      willpowerMax: 7,
      willpowerDamage: ['none', 'none', 'none', 'none', 'none', 'none', 'none'],
      hunger: 2,
      humanity: 7,
      stains: 0,
      bloodPotency: 2,
      ambition: 'Host the Grand Elysium art salon and outmaneuver the Ventrue Seneschal.',
      desire: 'Acquire the lost Caravaggio painting held in private Swiss storage.',
      touchstones: [
        { id: 't2', conviction: 'Art is the only sacred bridge to humanity.', touchstone: 'Julian Rivera (Prodigy Sculptor)' }
      ],
      attributes: {
        physical: { strength: 2, dexterity: 3, stamina: 2 },
        social: { charisma: 4, manipulation: 4, composure: 4 },
        mental: { intelligence: 3, wits: 3, resolve: 3 }
      },
      skills: {
        physical: { athletics: 1, brawl: 1, craft: 3, drive: 1, firearms: 0, larceny: 1, melee: 0, stealth: 2, survival: 0 },
        social: { animalKen: 0, etiquette: 4, insight: 4, intimidation: 1, leadership: 2, performance: 3, persuasion: 4, streetwise: 2, subterfuge: 3 },
        mental: { academics: 3, awareness: 3, finance: 3, investigation: 2, medicine: 0, occult: 2, politics: 3, science: 0, technology: 1 }
      },
      specialties: {
        persuasion: ['Seduction', 'High Stakes Negotiation'],
        etiquette: ['Elysium Protocol'],
        craft: ['Fine Painting Appraisal']
      },
      disciplines: [
        { id: 'presence', name: 'Presence', level: 2, powers: ['Awe', 'Lingering Kiss'] },
        { id: 'auspex', name: 'Auspex', level: 2, powers: ['Heightened Senses', 'Premonition'] },
        { id: 'celerity', name: 'Celerity', level: 1, powers: ['Cat\'s Grace'] }
      ],
      advantages: [
        { id: 'resources_3', name: 'Resources: Art Gallery Fortune', type: 'merit', category: 'background', dots: 3 },
        { id: 'haven_penthouse', name: 'Haven: Gold Coast Penthouse', type: 'merit', category: 'haven', dots: 3 },
        { id: 'merit_beautiful', name: 'Stunning Beauty', type: 'merit', category: 'social', dots: 4 }
      ],
      biography: 'A connoisseur of immortal aesthetics, Helena curates Chicago’s premier contemporary gallery while secretly manipulating mortal tastemakers and feeding off elite socialites.',
      haven: 'The Obsidian Gallery & Penthouse, Gold Coast.',
      coterie: 'The Velvet Parlor',
      experienceTotal: 25,
      experienceSpent: 20,
      createdAt: Date.now() - 86400000 * 7,
      updatedAt: Date.now()
    }
  ];
}

function getInitialPins(): MapPin[] {
  return [
    {
      id: 'pin_elysium_1',
      chronicleId: 'chronicle_chicago_1',
      name: 'The Succubus Club (Elysium)',
      type: 'elysium',
      lat: 41.8895,
      lng: -87.6285,
      description: 'Chicago’s premier gothic nightclub and neutral Elysium ground. Weapons forbidden; peace strictly enforced by the Sheriff.',
      sect: 'Camarilla'
    },
    {
      id: 'pin_haven_marcus',
      chronicleId: 'chronicle_chicago_1',
      name: 'Marcus’ Haven (South Side Garage)',
      type: 'haven',
      lat: 41.8375,
      lng: -87.6465,
      description: 'Fortified auto-shop with reinforced steel shutters, soundproof basement pit, and escape tunnel.',
      clan: 'Brujah',
      owner: 'Marcus Vance'
    },
    {
      id: 'pin_chantry',
      chronicleId: 'chronicle_chicago_1',
      name: 'Tremere Chantry of the White Oak',
      type: 'chantry',
      lat: 41.7897,
      lng: -87.5997,
      description: 'Historic gothic brick estate near Hyde Park. Warded with alchemical perimeter runes and occult libraries.',
      clan: 'Tremere',
      sect: 'Camarilla'
    },
    {
      id: 'pin_feeding_rack',
      chronicleId: 'chronicle_chicago_1',
      name: 'Wrigleyville Nightlife Strip (The Rack)',
      type: 'feeding',
      lat: 41.9484,
      lng: -87.6553,
      description: 'Dense concentration of late-night bars and intoxicated revellers. Plentiful hunting with minimal suspicion.',
      sect: 'Camarilla'
    },
    {
      id: 'pin_anarch_hq',
      chronicleId: 'chronicle_chicago_1',
      name: 'Anarch Bar: The Iron Rust',
      type: 'baron',
      lat: 41.8550,
      lng: -87.6650,
      description: 'Pilsen dive bar serving as informal assembly ground for Anarch coteries and unaligned Caitiff.',
      sect: 'Anarch'
    }
  ];
}

function getInitialTerritories(): TerritoryZone[] {
  return [
    {
      id: 'ter_camarilla_loop',
      chronicleId: 'chronicle_chicago_1',
      name: 'The Loop & Gold Coast Domain',
      faction: 'Camarilla (Prince & Ventrue)',
      color: '#3b82f6',
      center: [41.8818, -87.6231],
      radius: 2200,
      influencePercent: 85,
      notes: 'Strict curfew; Masquerade monitoring via private city camera surveillance.'
    },
    {
      id: 'ter_anarch_pilsen',
      chronicleId: 'chronicle_chicago_1',
      name: 'Pilsen & Bridgeport Free State',
      faction: 'Anarch Movement (Brujah & Gangrel)',
      color: '#f97316',
      center: [41.8480, -87.6600],
      radius: 2600,
      influencePercent: 70,
      notes: 'Camarilla enforcers entered at their own peril. High solidarity among mortal residents.'
    }
  ];
}

function getInitialRelationshipNodes(): RelationshipNode[] {
  return [
    { id: 'node_marcus', chronicleId: 'chronicle_chicago_1', name: 'Marcus Vance', type: 'pc', clan: 'Brujah', role: 'Anarch Agitator', x: 220, y: 180, color: '#e11d48' },
    { id: 'node_helena', chronicleId: 'chronicle_chicago_1', name: 'Helena DuMont', type: 'pc', clan: 'Toreador', role: 'Elysium Gallerist', x: 480, y: 150, color: '#ec4899' },
    { id: 'node_prince', chronicleId: 'chronicle_chicago_1', name: 'Prince Kevin Jackson', type: 'npc', clan: 'Ventrue', role: 'Prince of Chicago', x: 420, y: 350, color: '#eab308' },
    { id: 'node_sheriff', chronicleId: 'chronicle_chicago_1', name: 'Damian', type: 'npc', clan: 'Nosferatu', role: 'The Sheriff', x: 180, y: 340, color: '#84cc16' },
    { id: 'node_elena', chronicleId: 'chronicle_chicago_1', name: 'Elena Diaz', type: 'touchstone', role: 'Marcus’ Mortal Anchor', x: 100, y: 120, color: '#06b6d4' }
  ];
}

function getInitialRelationshipLinks(): RelationshipLink[] {
  return [
    { id: 'link_1', chronicleId: 'chronicle_chicago_1', sourceId: 'node_marcus', targetId: 'node_elena', type: 'love', label: 'Protective Touchstone' },
    { id: 'link_2', chronicleId: 'chronicle_chicago_1', sourceId: 'node_marcus', targetId: 'node_sheriff', type: 'rival', label: 'Blood Feud' },
    { id: 'link_3', chronicleId: 'chronicle_chicago_1', sourceId: 'node_helena', targetId: 'node_prince', type: 'boon', label: 'Major Boon Owed' },
    { id: 'link_4', chronicleId: 'chronicle_chicago_1', sourceId: 'node_marcus', targetId: 'node_helena', type: 'ally', label: 'Uneasy Truce' }
  ];
}

function getInitialBoons(): BoonRecord[] {
  return [
    {
      id: 'boon_1',
      chronicleId: 'chronicle_chicago_1',
      debtor: 'Prince Kevin Jackson',
      creditor: 'Helena DuMont',
      tier: 'major',
      description: 'Helena concealed an explosive Masquerade breach involving the Prince’s childe at the Drake Hotel.',
      status: 'active',
      dateCreated: '2026-10-12'
    },
    {
      id: 'boon_2',
      chronicleId: 'chronicle_chicago_1',
      debtor: 'Marcus Vance',
      creditor: 'Damian (Sheriff)',
      tier: 'minor',
      description: 'Damian looked the other way during a dockside raid in exchange for future intel on Anarch hotheads.',
      status: 'active',
      dateCreated: '2026-11-01'
    }
  ];
}

function getInitialSessions(): SessionNote[] {
  return [
    {
      id: 'sess_1',
      chronicleId: 'chronicle_chicago_1',
      sessionNumber: 1,
      title: 'Midnight on Michigan Avenue',
      inGameDate: 'October 14, 2026',
      realDate: '2026-10-15',
      xpAwarded: 2,
      summary: 'The coterie gathered at the Succubus Club under truce. A package stolen from the Tremere Chantry was tracked to a refrigerated truck near the docks.',
      mysteries: [
        'Who hired the mortal mercenaries with cold-iron rounds?',
        'Why does the Tremere Chantry refuse to speak with the Sheriff?'
      ]
    },
    {
      id: 'sess_2',
      chronicleId: 'chronicle_chicago_1',
      sessionNumber: 2,
      title: 'Smoke over Bridgeport',
      inGameDate: 'October 21, 2026',
      realDate: '2026-10-22',
      xpAwarded: 3,
      summary: 'Marcus and Helena intercepted the shipment. Inside was an ancient stone sarcophagus marked with Banu Haqim glyphs.',
      mysteries: [
        'Is an ancient elder waking beneath Chicago?',
        'Has the Second Inquisition tapped into the city traffic grid?'
      ]
    }
  ];
}
