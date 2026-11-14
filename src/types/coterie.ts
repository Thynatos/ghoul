import { MeritFlaw } from './vtm';

export interface CoterieMember {
  characterId: string;
  name: string;
  clan?: string;
  role: 'Leader' | 'Enforcer' | 'Diplomat' | 'Scholar' | 'Infiltrator' | 'Keeper' | 'Warden' | 'Member';
  portraitUrl?: string;
}

export interface Coterie {
  id: string;
  chronicleId: string;
  name: string;
  concept: string;
  type: string;
  tier: number; // 1 to 5
  leaderId?: string;
  memberIds: string[];
  members?: CoterieMember[];
  chasse: number;     // 0 - 5 (Richness of feeding grounds)
  lien: number;       // 0 - 5 (Sympathy & ties with mortals)
  portillon: number;  // 0 - 5 (Security and defense of domain)
  havenTraits: string[];
  sharedAdvantages: MeritFlaw[];
  notes: string;
}

export interface CoterieTypeInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  favoredDisciplines: string[];
  standardAdvantages: string[];
  havenRecommendations: string[];
  domainRole: string;
}
