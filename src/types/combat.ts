import { DamageType } from './vtm';

export type CombatantType = 'pc' | 'npc' | 'threat';

export interface Combatant {
  id: string;
  name: string;
  type: CombatantType;
  characterId?: string;
  clan?: string;
  initiativeRoll: number;
  healthMax: number;
  healthDamage: DamageType[];
  willpowerMax: number;
  willpowerDamage: DamageType[];
  armor: number;
  statusEffects: string[];
  isTurn: boolean;
  wits: number;
  awareness: number;
  celerity?: number;
  notes?: string;
  primaryPoolName?: string;
  primaryPoolValue?: number;
  secondaryPoolName?: string;
  secondaryPoolValue?: number;
}

export interface CombatLogEntry {
  id: string;
  round: number;
  timestamp: number;
  actorName: string;
  action: string;
  details: string;
  damageDealt?: number;
  damageType?: 'superficial' | 'aggravated';
}

export interface CombatEncounter {
  id: string;
  chronicleId?: string;
  name: string;
  round: number;
  activeCombatantIndex: number;
  combatants: Combatant[];
  log: CombatLogEntry[];
  isActive?: boolean;
}

export type AttackType = 'unarmed' | 'brawl' | 'slashing' | 'melee' | 'firearms' | 'fire' | 'sunlight' | 'bite';

export interface CalledShotOption {
  id: string;
  name: string;
  penalty: number;
  requiredMargin: number;
  description: string;
  effect: string;
}

export interface AttackResolutionParams {
  attackerName: string;
  defenderName: string;
  attackerPool: number;
  defenderPool: number;
  attackType: AttackType;
  weaponBonusDamage?: number;
  isDefenderVampire?: boolean;
  isAttackerPotence?: boolean;
  potenceBonus?: number;
  calledShot?: CalledShotOption | null;
  targetArmor?: number;
  forceRolls?: {
    attackerSuccesses?: number;
    defenderSuccesses?: number;
  };
}

export interface AttackResolutionResult {
  attackerRoll: number[];
  defenderRoll: number[];
  attackerSuccesses: number;
  defenderSuccesses: number;
  margin: number;
  hit: boolean;
  rawDamage: number;
  effectiveDamage: number;
  damageType: 'superficial' | 'aggravated';
  calledShotSucceeded: boolean;
  calledShotEffect?: string;
  summary: string;
}
