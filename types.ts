export enum MemoryCategory {
  IDENTITY = 'Identity',
  FEAR = 'Fear & Insecurity',
  DREAM = 'Dream & Vision',
  RELATIONSHIP = 'Relationship',
  STRESS = 'Stress Response',
  CAREER = 'Career',
  HEALTH = 'Health',
  OTHER = 'Other'
}

export interface Memory {
  id: string;
  content: string;
  category: MemoryCategory;
  createdAt: number;
  importance: number; // 1-10
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: 'Great' | 'Good' | 'Neutral' | 'Stressed' | 'Bad';
  tags: string[];
}

export interface UserProfile {
  name: string;
  communicationStyle: string; // e.g., "Direct, analytical"
  currentFocus: string;
  traits: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isThinking?: boolean;
}

export interface AppState {
  isLocked: boolean;
  activeTab: 'chat' | 'memories' | 'dashboard' | 'journal';
}
