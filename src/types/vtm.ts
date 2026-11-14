export type GameEdition = 'v5' | 'v20';

export type DamageType = 'none' | 'superficial' | 'aggravated';

export interface AttributeCategory {
  physical: {
    strength: number;
    dexterity: number;
    stamina: number;
  };
  social: {
    charisma: number;
    manipulation: number;
    composure: number; // Appearance in V20
  };
  mental: {
    intelligence: number;
    wits: number;
    resolve: number; // Perception in V20
  };
}

export interface SkillCategory {
  physical: {
    athletics: number;
    brawl: number;
    craft: number;
    drive: number;
    firearms: number;
    larceny: number;
    melee: number;
    stealth: number;
    survival: number;
  };
  social: {
    animalKen: number;
    etiquette: number;
    insight: number; // Empathy in V20
    intimidation: number;
    leadership: number;
    performance: number;
    persuasion: number;
    streetwise: number;
    subterfuge: number;
  };
  mental: {
    academics: number;
    awareness: number; // Alertness in V20
    finance: number;
    investigation: number;
    medicine: number;
    occult: number;
    politics: number;
    science: number;
    technology: number; // Computer in V20
  };
}

export interface DisciplineAllocation {
  id: string;
  name: string;
  level: number;
  powers: string[];
}

export interface MeritFlaw {
  id: string;
  name: string;
  type: 'merit' | 'flaw';
  category: 'physical' | 'social' | 'mental' | 'haven' | 'background' | 'lore';
  dots: number;
  details?: string;
}

export interface TouchstoneConviction {
  id: string;
  conviction: string;
  touchstone: string;
}

export interface Character {
  id: string;
  edition: GameEdition;
  name: string;
  concept: string;
  clan: string;
  generation: number;
  predatorType?: string; // V5
  sire?: string;
  chronicleId?: string;
  portraitUrl?: string;

  // Trackers
  healthMax: number;
  healthDamage: DamageType[]; // array of length healthMax
  willpowerMax: number;
  willpowerDamage: DamageType[]; // array of length willpowerMax
  
  // V5 specific
  hunger?: number; // 0-5
  humanity: number; // 0-10
  stains?: number; // 0-10
  bloodPotency?: number; // 0-10
  ambition?: string;
  desire?: string;
  touchstones?: TouchstoneConviction[];

  // V20 specific
  bloodPoolMax?: number;
  bloodPoolCurrent?: number;
  conscience?: number;
  selfControl?: number;
  courage?: number;
  pathName?: string;
  pathRating?: number;

  // Stats
  attributes: AttributeCategory;
  skills: SkillCategory;
  specialties: Record<string, string[]>; // e.g., 'brawl': ['Grappling', 'Vampiric Fangs']
  disciplines: DisciplineAllocation[];
  rituals?: string[]; // Blood sorcery rituals / ceremonies
  advantages: MeritFlaw[];

  // Bio & Notes
  biography?: string;
  notes?: string;
  haven?: string;
  coterie?: string;
  experienceTotal: number;
  experienceSpent: number;
  createdAt: number;
  updatedAt: number;
}

// Dice Rolling
export interface DieResult {
  value: number;
  isHunger?: boolean;
  isSuccess: boolean;
  isCrit: boolean; // 10
  isBestialFail?: boolean; // 1 on hunger die
}

export interface RollRequest {
  id: string;
  label: string;
  edition: GameEdition;
  poolSize: number;
  hungerDice?: number; // V5
  difficulty?: number; // default 1 for V5, 6 for V20
  characterName?: string;
  specialty?: boolean; // V20: 10s explode
  comment?: string;
}

export interface RollResult {
  id: string;
  timestamp: number;
  label: string;
  edition: GameEdition;
  regularDice: number[];
  hungerDice: number[];
  successes: number;
  difficulty: number;
  outcome: 'critical' | 'messy_critical' | 'success' | 'failure' | 'bestial_failure' | 'botch' | 'exceptional';
  outcomeText: string;
  canWillpowerReroll?: boolean;
  rerolledIndices?: number[];
  characterName?: string;
}

// Chronicle & Campaign
export interface MapPin {
  id: string;
  chronicleId: string;
  name: string;
  type: 'haven' | 'elysium' | 'rack' | 'feeding' | 'chantry' | 'court' | 'baron' | 'lupine' | 'safehouse' | 'crime' | 'other';
  lat: number;
  lng: number;
  description: string;
  clan?: string;
  sect?: 'Camarilla' | 'Anarch' | 'Sabbat' | 'Independent' | 'Second Inquisition';
  owner?: string;
}

export interface TerritoryZone {
  id: string;
  chronicleId: string;
  name: string;
  faction: string;
  color: string;
  center: [number, number];
  radius: number; // in meters
  influencePercent: number;
  notes?: string;
}

export interface RelationshipNode {
  id: string;
  chronicleId: string;
  name: string;
  type: 'pc' | 'npc' | 'faction' | 'touchstone';
  clan?: string;
  role?: string;
  x: number;
  y: number;
  color?: string;
}

export interface RelationshipLink {
  id: string;
  chronicleId: string;
  sourceId: string;
  targetId: string;
  type: 'blood_bond_1' | 'blood_bond_2' | 'blood_bond_3' | 'rival' | 'ally' | 'sire' | 'childe' | 'mentor' | 'boon' | 'love' | 'hatred';
  label?: string;
}

export interface BoonRecord {
  id: string;
  chronicleId: string;
  debtor: string; // owes
  creditor: string; // owed to
  tier: 'trivial' | 'minor' | 'major' | 'life';
  description: string;
  status: 'active' | 'repaid' | 'defaulted';
  dateCreated: string;
}

export interface SessionNote {
  id: string;
  chronicleId: string;
  sessionNumber: number;
  title: string;
  inGameDate: string;
  realDate: string;
  xpAwarded: number;
  summary: string;
  mysteries: string[];
}

export interface Chronicle {
  id: string;
  title: string;
  edition: GameEdition;
  city: string;
  storyteller: string;
  tenets: string[];
  description: string;
  createdAt: number;
  updatedAt: number;
}

// Compendium Data Models
export interface ClanInfo {
  name: string;
  tagline: string;
  quote?: string;
  symbol: string;
  disciplines: string[];
  bane: string;
  compulsion: {
    name: string;
    description: string;
  };
  archetypes: string[];
  lore: string;
  v20Disciplines?: string[];
  v20Weakness?: string;
}

export interface DisciplinePower {
  name: string;
  level: number;
  discipline: string;
  rouseCost?: number;
  dicePool?: string;
  system: string;
  duration?: string;
  amalgam?: {
    discipline: string;
    level: number;
  };
}

export interface DisciplineInfo {
  id: string;
  name: string;
  description: string;
  masqueradeThreat: string;
  bloodResonance: string;
  powers: DisciplinePower[];
}

export interface PredatorTypeInfo {
  name: string;
  tagline: string;
  description: string;
  huntingPool: string;
  disciplines: string[];
  specialties: string[];
  meritsFlaws: string[];
  humanityImpact: number;
  bloodPotencyImpact: number;
}

// Clan Quiz
export interface QuizOption {
  text: string;
  scores: Record<string, number>; // clan: weight
}

export interface QuizQuestion {
  id: number;
  prompt: string;
  scenario: string;
  options: QuizOption[];
}
