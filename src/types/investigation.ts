export type MysteryNodeType = 'clue' | 'suspect' | 'victim' | 'autopsy' | 'crime_scene' | 'evidence';
export type MysteryNodeStatus = 'discovered' | 'unsolved' | 'cleared' | 'hidden';

export interface MysteryNode {
  id: string;
  type: MysteryNodeType;
  title: string;
  description: string;
  x: number; // Board coordinate X
  y: number; // Board coordinate Y
  status: MysteryNodeStatus;
  secretNotes?: string; // Storyteller eyes only
  isSecret?: boolean;   // Undiscovered conspirator or hidden lead - hidden in Player View
  color?: string;
  timestamp?: string;
  assignedInvestigator?: string;
}

export interface MysteryLink {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  secretDetails?: string;
  isSecret?: boolean; // Hidden line in Player View
  color?: string; // e.g. crimson red thread
  threadStyle?: 'solid' | 'dashed' | 'dotted';
}

export interface MysteryBoard {
  id: string;
  chronicleId: string;
  title: string;
  caseNumber: string;
  briefing: string;
  nodes: MysteryNode[];
  links: MysteryLink[];
  isSolved: boolean;
  createdAt: number;
  updatedAt: number;
}
