export interface StoryPhase {
  id: number;
  title: string;
  description: string;
  imagePrompt: string;
}

export type CharacterType = 'FAMILY' | 'EXTERNAL';

export interface Character {
  id: string;
  name: string;
  relation: string;
  description: string;
  imagePrompt: string;
  generation: number; // 0 for external, 1-7 for family
  type: CharacterType;
  symbol: string; // Key for the Lucide icon
  children?: string[];
  partner?: string;
  parents?: string[];
}

export enum ViewState {
  INTRO = 'INTRO',
  TIMELINE = 'TIMELINE',
  FAMILY_TREE = 'FAMILY_TREE'
}
