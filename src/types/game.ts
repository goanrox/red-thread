// ─── Game State Types ─────────────────────────────────────────────────────────

export type DetectiveRank =
  | "Rookie"
  | "Investigator"
  | "Detective"
  | "Senior Detective"
  | "Chief Inspector"
  | "Master Detective";

// ─── Per-case State ───────────────────────────────────────────────────────────

export interface ActiveCaseState {
  caseId: string;
  startedAt: string; // ISO timestamp
  completedAt?: string;

  // Discovery progress
  discoveredClueIds: string[];
  visitedSceneIds: string[];

  // Interrogation progress
  askedQuestions: Record<string, string[]>; // suspectId → questionId[]
  interrogatedSuspectIds: string[];

  // Accusation
  accusedSuspectId?: string;
  isComplete: boolean;
  isCorrect?: boolean;

  // Scoring
  score?: number;
  rank?: DetectiveRank;

  // Notes (Phase 2)
  playerNotes?: string;
}

// ─── Player Profile ───────────────────────────────────────────────────────────

export interface PlayerStats {
  totalCasesStarted: number;
  totalCasesCompleted: number;
  totalCasesSolved: number;
  totalScore: number;
  currentRank: DetectiveRank;
  rankProgress: number; // 0–100 percentage to next rank
  achievements: string[]; // Achievement IDs
}

// ─── Root Game State ──────────────────────────────────────────────────────────

export interface GameState {
  // Active case
  activeCaseId: string | null;
  cases: Record<string, ActiveCaseState>; // caseId → state

  // Player
  stats: PlayerStats;

  // Actions
  startCase: (caseId: string) => void;
  discoverClue: (caseId: string, clueId: string) => void;
  visitScene: (caseId: string, sceneId: string) => void;
  askQuestion: (caseId: string, suspectId: string, questionId: string) => void;
  accuse: (caseId: string, suspectId: string) => void;
  completeCase: (caseId: string, isCorrect: boolean, score: number) => void;
  resetCase: (caseId: string) => void;
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

export interface ScoreBreakdown {
  base: number;
  clueBonus: number;
  speedBonus: number;
  penalty: number;
  total: number;
  rank: DetectiveRank;
}

// ─── Achievements ────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}
