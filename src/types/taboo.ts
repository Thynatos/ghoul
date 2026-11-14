export interface DiablerieStepRecord {
  step: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  resultText: string;
  passed: boolean;
}

export interface DiablerieResult {
  success: boolean;
  diableristId: string;
  diableristName: string;
  victimId: string;
  victimName: string;
  victimGeneration: number;
  diableristOldGeneration: number;
  diableristNewGeneration: number;
  generationLowered: boolean;
  contestWillSuccessesDiablerist: number;
  contestWillSuccessesVictim: number;
  margin: number;
  humanityLoss: number;
  stainsGained: number;
  blackVeinsDurationMonths: number;
  absorbedDisciplinePowers: string[];
  stealsExpAmount: number;
  soulConsumed: boolean;
  wightCheckRequired: boolean;
  log: string[];
}

export interface BloodBondStageInfo {
  stage: 1 | 2 | 3;
  name: string;
  title: string;
  emotionalState: string;
  mechanicalEffect: string;
  breakRequirement: string;
}

export interface BloodBondRelation {
  id: string;
  chronicleId?: string;
  regnantId: string;
  regnantName: string;
  thrallId: string;
  thrallName: string;
  drinkCount: number;
  stage: 1 | 2 | 3;
  lastDrinkDate: string;
  notes?: string;
}

export type FrenzyTriggerType = 'fury' | 'hunger' | 'terror';

export interface FrenzyScenario {
  id: string;
  type: FrenzyTriggerType;
  title: string;
  stimulus: string;
  difficulty: number;
  poolDescription: string;
  beastCompulsion: string;
}

export interface FrenzyCheckResult {
  id: string;
  timestamp: number;
  characterName: string;
  type: FrenzyTriggerType;
  difficulty: number;
  poolSize: number;
  diceRolled: number[];
  successes: number;
  passed: boolean;
  margin: number;
  outcomeText: string;
  compulsion: string;
}
