
export interface StoryPhase {
  id: number;
  title: string;
  description: string;
  imagePrompt: string;
}

// Add specific types used in LOTR_CHARACTERS to CharacterType
export type CharacterType = 'FAMILY' | 'EXTERNAL' | 'LOTR' | '迈雅/巫师' | '精灵' | '人类' | '霍比特人' | '黑暗势力' | '矮人' | '维拉/神明';

export interface Character {
  id: string;
  name: string;
  nameEn?: string;
  relation: string;
  relationEn?: string;
  description: string;
  descriptionEn?: string;
  imagePrompt: string;
  generation: number; // 0 for external, 1-7 for family, -1 for LOTR
  type: CharacterType;
  typeEn?: string;
  symbol: string;
  faction?: string; // Specific for LOTR
  factionEn?: string;
  deeds?: string; // Core deeds for LOTR
  deedsEn?: string;
  // Optional fields for relationship tracking in FamilyTree
  partner?: string;
  parents?: string[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverColor: string;
  accentColor: string;
  locked: boolean;
}

export enum ViewState {
  LIBRARY = 'LIBRARY',
  INTRO = 'INTRO',
  TIMELINE = 'TIMELINE',
  FAMILY_TREE = 'FAMILY_TREE',
  // Red and Black Views
  JULIEN_JOURNEY = 'JULIEN_JOURNEY',
  JULIEN_NETWORK = 'JULIEN_NETWORK',
  // LOTR Views
  LOTR_HUB = 'LOTR_HUB',
  LOTR_CHARACTERS = 'LOTR_CHARACTERS',
  LOTR_STORY_1 = 'LOTR_STORY_1',
  LOTR_STORY_2 = 'LOTR_STORY_2',
  LOTR_STORY_3 = 'LOTR_STORY_3',
  LOTR_QUIZ = 'LOTR_QUIZ'
}

export interface JourneyNode {
  id: number;
  title: string;
  context: string;
  redAspect: string;
  blackAspect: string;
  dominantColor: 'red' | 'black' | 'mixed';
  imagePrompt: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  role: string;
  traits: string;
  description: string;
  alignment: 'red' | 'black' | 'white' | 'mixed';
  color?: string;
  imagePrompt: string;
  x: number;
  y: number;
  socialX?: number;
  socialY?: number;
  size: 'lg' | 'md' | 'sm';
  viewMode?: 'ALL' | 'NETWORK_ONLY' | 'SOCIAL_ONLY';
}

export interface NetworkLink {
  from: string;
  to: string;
  label?: string;
  type: 'solid' | 'dashed' | 'dotted';
  color?: string;
  viewMode?: 'ALL' | 'NETWORK_ONLY' | 'SOCIAL_ONLY';
}

export interface LotRStoryPage {
  id: number;
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  imagePrompt: string;
}
