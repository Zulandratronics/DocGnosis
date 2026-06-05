/**
 * Types for the AI Document Organizer and Sorter
 */

export interface ActionItem {
  id: string;
  action: string;
  timeEstimate: string;
  offloadable: boolean;
  offloadStatus: 'idle' | 'running' | 'completed' | 'failed';
  offloadLog: string[];
  offloadResult?: string;
}

export interface BrainstormItem {
  id: string;
  title: string;
  concept: string;
  actions: ActionItem[];
}

export interface SkillItem {
  name: string;
  category: string;
  proficiencyGained: number; // 0 to 100 percentage
  description: string;
}

export interface RoadmapMilestone {
  milestone: string;
  title: string;
  description: string;
  duration: string;
  resources: string[];
  checked: boolean;
}

export interface DocumentAnalysis {
  category: string;
  summary: string;
  readTime: number; // minutes
  tags: string[];
  sentiment: string;
  keyThemes: string[];
  brainstorm: BrainstormItem[];
  skills: SkillItem[];
  roadmap: RoadmapMilestone[];
}

export interface AnalyzedDocument {
  id: string;
  name: string;
  content: string;
  size: string;
  lastUpdated: string;
  analysis?: DocumentAnalysis;
  ideasArchive?: {
    refreshedAt: string;
    outOfTheBox: boolean;
    brainstorm: BrainstormItem[];
  }[];
}
