export type SceneType = 'elysium' | 'investigation' | 'social_intrigue' | 'hunting' | 'combat' | 'haven_downtime';
export type TensionLevel = 1 | 2 | 3 | 4 | 5; // 1 = Shadows quiet, 5 = Full Masquerade collapse

export interface SceneBeat {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  hiddenStorytellerNotes: string;
  associatedNpcIds: string[];
  clueNodeIds?: string[];
}

export interface EnvironmentalModifiers {
  darkness: boolean;
  heavyRainOrFog: boolean;
  surveillancePresent: boolean;
  crowdedRoom: boolean;
  fireHazard: boolean;
  daylightExposure?: boolean;
}

export interface ActiveScene {
  id: string;
  chronicleId: string;
  title: string;
  location: string;
  sceneType: SceneType;
  tension: TensionLevel;
  resonance: 'choleric' | 'melancholic' | 'phlegmatic' | 'sanguine' | 'empty';
  resonanceIntensity: 'fleeting' | 'intense' | 'dyscrasia';
  presentCharacterIds: string[];
  presentNpcIds: string[];
  beats: SceneBeat[];
  environmentalModifiers: EnvironmentalModifiers;
  startedAt: string;
}

export interface ThreatMatrixState {
  masqueradeExposure: number; // 0 to 5
  secondInquisitionAlert: number; // 0 to 5
  patrolDensity: 'none' | 'low' | 'moderate' | 'elevated' | 'critical';
  notes?: string;
}

export interface EnvironmentalPenaltySummary {
  perceptionPenalty: number;
  stealthModifier: number;
  frenzyDifficultyModifier: number;
  masqueradeRiskModifier: number;
  damagePerTurn: number;
  damageType?: 'superficial' | 'aggravated';
  descriptions: string[];
}
