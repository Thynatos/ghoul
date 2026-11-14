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
import { CombatEncounter } from '../types/combat';
import { Coterie } from '../types/coterie';
import { MysteryBoard } from '../types/investigation';
import { BloodBondRelation } from '../types/taboo';
import { ActiveScene, ThreatMatrixState } from '../types/story';

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
  EDITION: 'ghoul_edition',
  COMBAT: 'ghoul_combat_encounters',
  COTERIES: 'ghoul_coteries',
  MYSTERY_BOARDS: 'ghoul_mystery_boards',
  BLOOD_BONDS: 'ghoul_blood_bonds',
  ACTIVE_SCENE: 'ghoul_active_scene',
  THREAT_MATRIX: 'ghoul_threat_matrix'
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

  // Combat Encounters
  getCombatEncounters(chronicleId?: string): CombatEncounter[] {
    try {
      const data = localStorage.getItem(KEYS.COMBAT);
      const all: CombatEncounter[] = data ? JSON.parse(data) : getInitialCombatEncounters();
      return chronicleId ? all.filter(e => !e.chronicleId || e.chronicleId === chronicleId) : all;
    } catch (e) {
      return getInitialCombatEncounters();
    }
  },

  saveCombatEncounters(encounters: CombatEncounter[]) {
    localStorage.setItem(KEYS.COMBAT, JSON.stringify(encounters));
  },

  saveCombatEncounter(encounter: CombatEncounter) {
    const list = this.getCombatEncounters();
    const idx = list.findIndex(e => e.id === encounter.id);
    if (idx >= 0) {
      list[idx] = encounter;
    } else {
      list.unshift(encounter);
    }
    this.saveCombatEncounters(list);
  },

  deleteCombatEncounter(id: string) {
    const list = this.getCombatEncounters().filter(e => e.id !== id);
    this.saveCombatEncounters(list);
  },

  // Coteries
  getCoteries(chronicleId?: string): Coterie[] {
    try {
      const data = localStorage.getItem(KEYS.COTERIES);
      const all: Coterie[] = data ? JSON.parse(data) : getInitialCoteries();
      return chronicleId ? all.filter(c => !c.chronicleId || c.chronicleId === chronicleId) : all;
    } catch (e) {
      return getInitialCoteries();
    }
  },

  getCoterie(id: string): Coterie | undefined {
    return this.getCoteries().find(c => c.id === id);
  },

  saveCoteries(coteries: Coterie[]) {
    localStorage.setItem(KEYS.COTERIES, JSON.stringify(coteries));
  },

  saveCoterie(coterie: Coterie) {
    const list = this.getCoteries();
    const idx = list.findIndex(c => c.id === coterie.id);
    if (idx >= 0) {
      list[idx] = coterie;
    } else {
      list.unshift(coterie);
    }
    this.saveCoteries(list);
  },

  deleteCoterie(id: string) {
    const list = this.getCoteries().filter(c => c.id !== id);
    this.saveCoteries(list);
  },

  // Mystery & Clue Investigation Boards
  getMysteryBoards(chronicleId?: string): MysteryBoard[] {
    try {
      const data = localStorage.getItem(KEYS.MYSTERY_BOARDS);
      const all: MysteryBoard[] = data ? JSON.parse(data) : getInitialMysteryBoards();
      // Ensure layout collision migration
      all.forEach(b => {
        const sulfur = b.nodes.find(n => n.id === 'node_evidence_sulfur');
        if (sulfur && sulfur.y < 500) {
          sulfur.y = 510;
          sulfur.x = 390;
        }
      });
      return chronicleId ? all.filter(m => !m.chronicleId || m.chronicleId === chronicleId) : all;
    } catch (e) {
      return getInitialMysteryBoards();
    }
  },

  getMysteryBoard(id: string): MysteryBoard | undefined {
    return this.getMysteryBoards().find(m => m.id === id);
  },

  saveMysteryBoards(boards: MysteryBoard[]) {
    localStorage.setItem(KEYS.MYSTERY_BOARDS, JSON.stringify(boards));
  },

  saveMysteryBoard(board: MysteryBoard) {
    const list = this.getMysteryBoards();
    const idx = list.findIndex(m => m.id === board.id);
    if (idx >= 0) {
      list[idx] = { ...board, updatedAt: Date.now() };
    } else {
      list.unshift({ ...board, createdAt: Date.now(), updatedAt: Date.now() });
    }
    this.saveMysteryBoards(list);
  },

  deleteMysteryBoard(id: string) {
    const list = this.getMysteryBoards().filter(m => m.id !== id);
    this.saveMysteryBoards(list);
  },

  // Blood Bonds
  getBloodBonds(chronicleId?: string): BloodBondRelation[] {
    try {
      const data = localStorage.getItem(KEYS.BLOOD_BONDS);
      const all: BloodBondRelation[] = data ? JSON.parse(data) : getInitialBloodBonds();
      return chronicleId ? all.filter(b => !b.chronicleId || b.chronicleId === chronicleId) : all;
    } catch (e) {
      return getInitialBloodBonds();
    }
  },

  saveBloodBonds(bonds: BloodBondRelation[]) {
    localStorage.setItem(KEYS.BLOOD_BONDS, JSON.stringify(bonds));
  },

  saveBloodBond(bond: BloodBondRelation) {
    const list = this.getBloodBonds();
    const idx = list.findIndex(b => b.id === bond.id);
    if (idx >= 0) {
      list[idx] = bond;
    } else {
      list.unshift(bond);
    }
    this.saveBloodBonds(list);
  },

  deleteBloodBond(id: string) {
    const list = this.getBloodBonds().filter(b => b.id !== id);
    this.saveBloodBonds(list);
  },

  // Active Story Scene
  getActiveScene(): ActiveScene {
    try {
      const data = localStorage.getItem(KEYS.ACTIVE_SCENE);
      if (data) return JSON.parse(data);
    } catch (e) {}
    const initial = getInitialActiveScene();
    this.saveActiveScene(initial);
    return initial;
  },

  saveActiveScene(scene: ActiveScene) {
    localStorage.setItem(KEYS.ACTIVE_SCENE, JSON.stringify(scene));
  },

  // Threat Matrix
  getThreatMatrix(): ThreatMatrixState {
    try {
      const data = localStorage.getItem(KEYS.THREAT_MATRIX);
      if (data) return JSON.parse(data);
    } catch (e) {}
    const initial: ThreatMatrixState = {
      masqueradeExposure: 1,
      secondInquisitionAlert: 1,
      patrolDensity: 'low',
      notes: 'CPD Area 1 detectives flagging unverified security leaks in the Loop.'
    };
    this.saveThreatMatrix(initial);
    return initial;
  },

  saveThreatMatrix(matrix: ThreatMatrixState) {
    localStorage.setItem(KEYS.THREAT_MATRIX, JSON.stringify(matrix));
  },

  // Backup & Restore
  exportBackupJSON(): string {
    const bundle = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      characters: this.getCharacters(),
      chronicles: this.getChronicles(),
      pins: this.getPins(),
      territories: this.getTerritories(),
      nodes: this.getRelationshipNodes(),
      links: this.getRelationshipLinks(),
      boons: this.getBoons(),
      sessions: this.getSessions(),
      combatEncounters: this.getCombatEncounters(),
      coteries: this.getCoteries(),
      mysteryBoards: this.getMysteryBoards(),
      bloodBonds: this.getBloodBonds(),
      activeScene: this.getActiveScene(),
      threatMatrix: this.getThreatMatrix()
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
      if (Array.isArray(data.combatEncounters)) this.saveCombatEncounters(data.combatEncounters);
      if (Array.isArray(data.coteries)) this.saveCoteries(data.coteries);
      if (Array.isArray(data.mysteryBoards)) this.saveMysteryBoards(data.mysteryBoards);
      if (Array.isArray(data.bloodBonds)) this.saveBloodBonds(data.bloodBonds);
      if (data.activeScene) this.saveActiveScene(data.activeScene);
      if (data.threatMatrix) this.saveThreatMatrix(data.threatMatrix);
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

function getInitialCoteries(): Coterie[] {
  return [
    {
      id: 'coterie_southside_underground',
      chronicleId: 'chronicle_chicago_1',
      name: 'The South Side Underground',
      concept: 'Anarch Street Champions & Labor Haven Wardens',
      type: 'champions',
      tier: 2,
      leaderId: 'char_brujah_marcus',
      memberIds: ['char_brujah_marcus', 'char_toreador_helena'],
      members: [
        {
          characterId: 'char_brujah_marcus',
          name: 'Marcus "Rebel" Vance',
          clan: 'Brujah',
          role: 'Leader',
          portraitUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        },
        {
          characterId: 'char_toreador_helena',
          name: 'Helena DuMont',
          clan: 'Toreador',
          role: 'Diplomat',
          portraitUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
        }
      ],
      chasse: 2,     // Rich feeding grounds across Bridgeport & Lower West Side
      lien: 3,       // Deep ties into the longshoremen union and community organizers
      portillon: 2,  // Barricaded perimeter with security cameras and lookout scouts
      havenTraits: [
        'Armory',
        'Hidden Escape Tunnels',
        'Ghoul Security Detail',
        'Occult Library'
      ],
      sharedAdvantages: [
        {
          id: 'shared_merit_safehouse',
          name: 'Haven: Fortified Machine Shop',
          type: 'merit',
          category: 'haven',
          dots: 3,
          details: 'Heavy blast doors, soundproofed basement pit, and subterranean escape tunnel to drainage canal.'
        },
        {
          id: 'shared_merit_union',
          name: 'Allies: Longshoremen Dockworkers',
          type: 'merit',
          category: 'background',
          dots: 2,
          details: 'Mortal dock union workers who alert the coterie to strange cargo movements and police activity.'
        }
      ],
      notes: 'Formed in late 2026 following increased Second Inquisition pressure along the Chicago rail corridors. Marcus provides muscle and street defense, while Helena finances legal covers and monitors Elysium political gossip.'
    }
  ];
}

function getInitialCombatEncounters(): CombatEncounter[] {
  return [
    {
      id: 'encounter_bridgeport_ambush',
      chronicleId: 'chronicle_chicago_1',
      name: 'Ambush at Bridgeport Docks (Pier 42)',
      round: 1,
      activeCombatantIndex: 0,
      isActive: true,
      combatants: [
        {
          id: 'c_marcus',
          name: 'Marcus "Rebel" Vance',
          type: 'pc',
          characterId: 'char_brujah_marcus',
          clan: 'Brujah',
          initiativeRoll: 7.5,
          healthMax: 7,
          healthDamage: ['none', 'none', 'none', 'none', 'none', 'none', 'none'],
          willpowerMax: 6,
          willpowerDamage: ['none', 'none', 'none', 'none', 'none', 'none'],
          armor: 1,
          statusEffects: ['Cover (-2 to hit)'],
          isTurn: true,
          wits: 3,
          awareness: 2,
          celerity: 1,
          notes: 'Potence 2 active (Lethal Body, Prowess). Armed with heavy steel tire iron and .45 ACP pistol.',
          primaryPoolName: 'Brawl + Potence',
          primaryPoolValue: 6,
          secondaryPoolName: 'Firearms',
          secondaryPoolValue: 5
        },
        {
          id: 'c_si_leader',
          name: 'SAD Tactical Strike Lead (FIRSTLIGHT)',
          type: 'threat',
          initiativeRoll: 6.8,
          healthMax: 7,
          healthDamage: ['superficial', 'none', 'none', 'none', 'none', 'none', 'none'],
          willpowerMax: 6,
          willpowerDamage: ['none', 'none', 'none', 'none', 'none', 'none'],
          armor: 2,
          statusEffects: [],
          isTurn: false,
          wits: 3,
          awareness: 3,
          notes: 'Heavy tactical ceramic armor, UV spotlight beam, incendiary shotgun rounds (Aggravated to kindred).',
          primaryPoolName: 'Firearms & Breaching',
          primaryPoolValue: 8,
          secondaryPoolName: 'Athletics & Suppression',
          secondaryPoolValue: 7
        },
        {
          id: 'c_helena',
          name: 'Helena DuMont',
          type: 'pc',
          characterId: 'char_toreador_helena',
          clan: 'Toreador',
          initiativeRoll: 6.2,
          healthMax: 6,
          healthDamage: ['none', 'none', 'none', 'none', 'none', 'none'],
          willpowerMax: 7,
          willpowerDamage: ['none', 'none', 'none', 'none', 'none', 'none', 'none'],
          armor: 0,
          statusEffects: [],
          isTurn: false,
          wits: 3,
          awareness: 3,
          celerity: 1,
          notes: 'Flanking behind shipping container. Auspex Heightened Senses scanning for snipers.',
          primaryPoolName: 'Presence / Firearms',
          primaryPoolValue: 4,
          secondaryPoolName: 'Dodge (Dex + Athletics)',
          secondaryPoolValue: 4
        },
        {
          id: 'c_ghoul_guard',
          name: 'Blood-Bound Enforcer Ghoul',
          type: 'threat',
          initiativeRoll: 4.4,
          healthMax: 6,
          healthDamage: ['none', 'none', 'none', 'none', 'none', 'none'],
          willpowerMax: 5,
          willpowerDamage: ['none', 'none', 'none', 'none', 'none'],
          armor: 1,
          statusEffects: [],
          isTurn: false,
          wits: 2,
          awareness: 2,
          notes: 'Potence 1, brass knuckles, 12-gauge pump shotgun.',
          primaryPoolName: 'Brawl & Shotguns',
          primaryPoolValue: 6,
          secondaryPoolName: 'Bodyguarding',
          secondaryPoolValue: 5
        }
      ],
      log: [
        {
          id: 'log_init',
          round: 1,
          timestamp: Date.now() - 45000,
          actorName: 'Tactical Combat Engine',
          action: 'Combat Initiated',
          details: 'Initiative order calculated from Wits + Awareness + Celerity.'
        },
        {
          id: 'log_flare',
          round: 1,
          timestamp: Date.now() - 25000,
          actorName: 'SAD Tactical Strike Lead',
          action: 'Fired Magnesium Flare',
          details: 'Blinding glare across the pier. Forces difficulty 2 Rötschreck check on Kindred looking directly at the blast.'
        }
      ]
    }
  ];
}

function getInitialMysteryBoards(): MysteryBoard[] {
  return [
    {
      id: 'board_chicago_homicide',
      chronicleId: 'chronicle_chicago_1',
      title: 'The Exsanguination of Alderman Campbell',
      caseNumber: 'CPD-HOMICIDE-8821',
      briefing: 'Prominent Chicago Alderman Thomas Campbell was discovered dead inside his locked River North penthouse. All five liters of arterial blood were completely drained without a single drop on the floor. No signs of forced entry. The Camarilla Harpy has warned the coterie that a Masquerade catastrophe is looming if mortal detectives uncover kindred involvement.',
      isSolved: false,
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now(),
      nodes: [
        {
          id: 'node_crime_scene',
          type: 'crime_scene',
          title: 'River North Penthouse Study',
          description: 'The crime scene: 44th floor private study. Locked from the inside with deadbolt and biometric keypad. Balcony French door slightly ajar.',
          x: 90,
          y: 70,
          status: 'discovered',
          color: '#e11d48',
          secretNotes: 'Balcony railing shows faint scorch residue and traces of Banu Haqim Blood Sorcery glyphs.'
        },
        {
          id: 'node_victim_alderman',
          type: 'victim',
          title: 'Alderman Thomas Campbell',
          description: 'Age 54. Powerful chair of City Zoning Commission. Handled commercial permits along the Chicago River.',
          x: 390,
          y: 70,
          status: 'discovered',
          color: '#f43f5e',
          secretNotes: 'Campbell was secretly under Ventrue Dominate to approve zoning waivers for Elysium annex properties.'
        },
        {
          id: 'node_autopsy_report',
          type: 'autopsy',
          title: 'Coroner Report #ME-402',
          description: 'Cause of death: acute hypovolemic shock. Zero detectable blood volume remaining in body. Two clean puncture wounds on right carotid artery.',
          x: 390,
          y: 290,
          status: 'discovered',
          color: '#a855f7',
          secretNotes: 'Coroner detected faint supernatural salivary enzyme that prevents mortal blood clotting and suppresses bruising.'
        },
        {
          id: 'node_clue_security_tape',
          type: 'clue',
          title: 'Distorted CCTV Feed (03:14 AM)',
          description: 'Hallway camera footage outside penthouse suffered heavy magnetic static between 03:12 and 03:22 AM. A fleeting cloaked shadow is visible.',
          x: 90,
          y: 320,
          status: 'discovered',
          color: '#38bdf8',
          secretNotes: 'Pattern of electromagnetic static matches Obfuscate Level 3 (Cloak of Shadows) optical distortion.'
        },
        {
          id: 'node_suspect_inquisitor',
          type: 'suspect',
          title: 'Father Lucian (Vatican Entity)',
          description: 'A shadowy Jesuit priest seen lingering around the precinct morgue and demanding copies of Campbell\'s personal diaries.',
          x: 690,
          y: 70,
          status: 'unsolved',
          color: '#eab308',
          secretNotes: 'Second Inquisition contact. Believes Campbell was killed by Anarchs to incite Camarilla panic.'
        },
        {
          id: 'node_evidence_sulfur',
          type: 'evidence',
          title: 'Sulfur & Alchemical Ash Residue',
          description: 'Grey-white crystalline residue collected from the fireplace hearth in Campbell\'s study. Smells faintly of copper and ozone.',
          x: 390,
          y: 510,
          status: 'discovered',
          color: '#22c55e',
          secretNotes: 'Alchemical sulfur component from an illicit blood sorcery divination ritual.'
        },
        {
          id: 'node_secret_priestess',
          type: 'suspect',
          title: 'Sister Nadia (Blood Cultist)',
          description: 'Secret Conspirator: Operates a clandestine blood shrine in an abandoned subway vault beneath the Loop.',
          x: 690,
          y: 320,
          status: 'hidden',
          isSecret: true,
          color: '#ef4444',
          secretNotes: 'ST ONLY: Sister Nadia drained Campbell to awaken an ancient Methuselah torpid beneath Michigan Avenue. She left the Banu Haqim glyphs intentionally to frame the Assamites.'
        }
      ],
      links: [
        {
          id: 'link_cs_victim',
          sourceId: 'node_crime_scene',
          targetId: 'node_victim_alderman',
          label: 'Body seated at private desk',
          color: '#e11d48'
        },
        {
          id: 'link_victim_autopsy',
          sourceId: 'node_victim_alderman',
          targetId: 'node_autopsy_report',
          label: 'Total exsanguination confirmed',
          color: '#a855f7'
        },
        {
          id: 'link_cs_cctv',
          sourceId: 'node_crime_scene',
          targetId: 'node_clue_security_tape',
          label: 'Hallway camera feed timestamped',
          color: '#38bdf8'
        },
        {
          id: 'link_autopsy_evidence',
          sourceId: 'node_autopsy_report',
          targetId: 'node_evidence_sulfur',
          label: 'Sulfur traces found under victim fingernails',
          color: '#22c55e'
        },
        {
          id: 'link_cctv_inquisitor',
          sourceId: 'node_clue_security_tape',
          targetId: 'node_suspect_inquisitor',
          label: 'Vehicle outside matches Church lease',
          color: '#eab308'
        },
        {
          id: 'link_evidence_priestess',
          sourceId: 'node_evidence_sulfur',
          targetId: 'node_secret_priestess',
          label: 'Sulfur purity matches ritual vault cache',
          isSecret: true,
          color: '#dc2626',
          secretDetails: 'Connects directly to the hidden subterranean shrine.'
        }
      ]
    }
  ];
}

function getInitialBloodBonds(): BloodBondRelation[] {
  return [
    {
      id: 'bond_helena_marcus',
      chronicleId: 'chronicle_chicago_1',
      regnantId: 'char_toreador_helena',
      regnantName: 'Helena DuMont',
      thrallId: 'char_brujah_marcus',
      thrallName: 'Marcus "Rebel" Vance',
      drinkCount: 1,
      stage: 1,
      lastDrinkDate: '2026-10-21',
      notes: 'Helena fed Marcus a sip of her vitae to stabilize him after he was shot with phosphorus. Marcus experiences vivid flashes of Helena\'s face in his dreams.'
    },
    {
      id: 'bond_helena_ghoul',
      chronicleId: 'chronicle_chicago_1',
      regnantId: 'char_toreador_helena',
      regnantName: 'Helena DuMont',
      thrallId: 'npc_ghoul_enforcer',
      thrallName: 'Blood-Bound Enforcer Ghoul',
      drinkCount: 3,
      stage: 3,
      lastDrinkDate: '2026-11-01',
      notes: 'Complete Blood Bond & Vassalage. The ghoul would gladly throw himself into an incinerator if Helena commanded it.'
    }
  ];
}

function getInitialActiveScene(): ActiveScene {
  return {
    id: 'scene_chicago_elysium_1',
    chronicleId: 'chronicle_chicago_1',
    title: 'Elysium Court at the Chicago Cultural Center',
    location: 'Preston Bradley Hall, Chicago Cultural Center (78 E Washington St, Chicago)',
    sceneType: 'elysium',
    tension: 2,
    resonance: 'sanguine',
    resonanceIntensity: 'intense',
    presentCharacterIds: ['char_brujah_marcus', 'char_toreador_helena'],
    presentNpcIds: ['node_prince', 'node_sheriff'],
    beats: [
      {
        id: 'beat_chicago_1',
        title: 'Formal Petitions to Prince Jackson',
        description: 'Prince Kevin Jackson holds court under the illuminated 38-foot Tiffany glass dome. Kindred must observe strict Elysium etiquette while presenting territorial grievances.',
        isCompleted: false,
        hiddenStorytellerNotes: 'CLASSIFIED: Prince Jackson has secretly authorized Sheriff Damian to wiretap the cloakroom. Jackson wants to see if the Anarch coterie will openly provoke Primogen DuMont.',
        associatedNpcIds: ['node_prince', 'node_sheriff'],
        clueNodeIds: ['clue_alderman_note']
      },
      {
        id: 'beat_chicago_2',
        title: 'Whispers of the Alderman Exsanguination',
        description: 'Chantry acolytes and Primogen aides trade hushed speculation about Alderman Campbell\'s drained corpse found near Pier 42.',
        isCompleted: false,
        hiddenStorytellerNotes: 'Damian found traces of a Nosferatu footprint coated in Bridgeport river silt at the scene, pointing suspicion toward South Side Anarchs.',
        associatedNpcIds: ['node_sheriff']
      },
      {
        id: 'beat_chicago_3',
        title: 'Anarch Agitation & Territorial Challenge',
        description: 'Marcus Vance arrives with demands for open feeding rights in the Pilsen and Bridgeport industrial zones.',
        isCompleted: false,
        hiddenStorytellerNotes: 'Vance is unknowingly carrying a burner phone actively tracked by FBI Special Affairs Division (SAD) Unit 4.',
        associatedNpcIds: ['char_brujah_marcus', 'node_prince']
      },
      {
        id: 'beat_chicago_4',
        title: 'The Tiffany Dome Voltage Flicker',
        description: 'Sudden voltage flicker across the marble hall. Security feed flickers out for 12 seconds.',
        isCompleted: false,
        hiddenStorytellerNotes: 'Tension escalates to 4 if the blackout occurs. A Tremere gargoyle watcher was spotted perched on the exterior cornice.',
        associatedNpcIds: []
      }
    ],
    environmentalModifiers: {
      darkness: false,
      heavyRainOrFog: true,
      surveillancePresent: true,
      crowdedRoom: true,
      fireHazard: false
    },
    startedAt: new Date().toISOString()
  };
}
