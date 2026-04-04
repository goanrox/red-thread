// ─── Case & Content Types ─────────────────────────────────────────────────────

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type CaseCategory =
  | "country-house"
  | "noir"
  | "cold-case"
  | "psychological"
  | "locked-room"
  | "conspiracy";

export interface CaseSummary {
  id: string;
  title: string;
  subtitle: string;
  category: CaseCategory;
  difficulty: Difficulty;
  estimatedMinutes: number;
  coverImage?: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface Case extends CaseSummary {
  victim: Victim;
  setting: string;
  settingDescription: string;
  briefing: string; // Narrative prose for the opening briefing
  suspects: Suspect[];
  scenes: Scene[];
  clues: Clue[];
  timeline: TimelineEvent[];
  solution: Solution;
}

// ─── Victim ───────────────────────────────────────────────────────────────────

export interface Victim {
  name: string;
  age: number;
  occupation: string;
  description: string;
  relationships: Record<string, string>; // suspectId → relationship description
}

// ─── Suspects ─────────────────────────────────────────────────────────────────

export type SuspectTone = "hostile" | "nervous" | "evasive" | "cooperative" | "cold" | "grief-stricken";

export interface Suspect {
  id: string;
  name: string;
  age: number;
  occupation: string;
  relation: string; // Relation to victim
  description: string;
  physicalDescription: string;
  initialTone: SuspectTone;
  questions: Question[];
  alibi: string;
  tells: string[]; // Behavioral tells — shown only in the result reveal
  isGuilty: boolean;
}

export interface Question {
  id: string;
  text: string;
  response: string;
  tone: SuspectTone;
  requiresClueId?: string; // Only unlocked after collecting this clue
  requiresQuestionId?: string; // Only unlocked after asking another question
  isKeyQuestion?: boolean; // Flags questions that reveal important information
}

// ─── Scenes ───────────────────────────────────────────────────────────────────

export interface Scene {
  id: string;
  name: string;
  description: string; // Narrative prose
  clueIds: string[]; // Clues discoverable in this scene
  isLocked?: boolean; // Gated scenes (Phase 2)
}

// ─── Clues ────────────────────────────────────────────────────────────────────

export type ClueType = "physical" | "testimony" | "document" | "observation" | "forensic";
export type ClueSeverity = "low" | "medium" | "high" | "critical";

export interface Clue {
  id: string;
  title: string;
  description: string; // Full analysis text shown in ClueModal
  type: ClueType;
  severity: ClueSeverity;
  sceneId: string;
  relatedSuspectIds?: string[];
  relatedClueIds?: string[]; // Cross-references
  discoveredAt?: string; // ISO timestamp — set when player finds it
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

export interface TimelineEvent {
  id: string;
  time: string; // Human-readable, e.g. "9:45 PM"
  sortKey: number; // Unix-style numeric for sorting
  description: string;
  suspectIds?: string[];
  clueIds?: string[];
  isKeyEvent?: boolean;
}

// ─── Solution ────────────────────────────────────────────────────────────────

export interface Solution {
  killerId: string;
  motive: string;
  method: string;
  narrativeReveal: string; // Full prose reveal
  twist?: string; // Optional hidden truth panel
  endings: Ending[];
}

export interface Ending {
  condition: "correct" | "wrong" | "incomplete";
  title: string;
  narrative: string;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface Category {
  id: CaseCategory;
  label: string;
  description: string;
  icon: string; // Unicode or SVG path
}
