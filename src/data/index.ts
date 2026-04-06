import type { Case, CaseSummary, CaseCategory } from "@/types";
import { thornwoodCase } from "./cases/thornwood";
import { CASE_MANIFEST, SEASONS } from "./caseManifest";

export { CASE_MANIFEST, SEASONS };

// ─── Case Registry (playable cases with full investigation data) ───────────────

const ALL_CASES: Case[] = [thornwoodCase];

export function getAllCases(): Case[] {
  return ALL_CASES;
}

export function getCaseById(id: string): Case | undefined {
  return ALL_CASES.find((c) => c.id === id);
}

export function getCasesByCategory(category: CaseCategory): Case[] {
  return ALL_CASES.filter((c) => c.category === category);
}

export function getFeaturedCases(): Case[] {
  return ALL_CASES.filter((c) => c.isFeatured);
}

export function getCaseSummaries(): CaseSummary[] {
  return ALL_CASES.map(({ suspects, scenes, clues, timeline, solution, ...summary }) => summary);
}

export { CATEGORIES } from "./categories";

// ─── Progression Logic ────────────────────────────────────────────────────────

/**
 * Returns true if the given case is accessible based on which cases have been solved.
 */
export function isCaseUnlocked(caseId: string, solvedCaseIds: string[]): boolean {
  const manifest = CASE_MANIFEST.find((c) => c.id === caseId);
  if (!manifest) return false;

  // No requirements: always unlocked (Case 1 — Thornwood)
  if (!manifest.unlockRequires && !manifest.unlockRequiresSeason) return true;

  // Requires an entire previous season to be complete
  if (manifest.unlockRequiresSeason) {
    const season = SEASONS.find((s) => s.number === manifest.unlockRequiresSeason);
    if (!season) return false;
    return season.caseIds.every((id) => solvedCaseIds.includes(id));
  }

  // Requires a specific previous case to be solved
  if (manifest.unlockRequires) {
    return solvedCaseIds.includes(manifest.unlockRequires);
  }

  return false;
}

/**
 * Returns true if a player has access to a season at all (at least the first case unlocked).
 */
export function isSeasonAccessible(season: 1 | 2 | 3, solvedCaseIds: string[]): boolean {
  if (season === 1) return true;
  const prevSeason = SEASONS.find((s) => s.number === season - 1);
  if (!prevSeason) return false;
  return prevSeason.caseIds.every((id) => solvedCaseIds.includes(id));
}

/**
 * Returns the player's archive clearance level based on number of cases solved.
 */
export function getArchiveClearanceLevel(solvedCount: number): "I" | "II" | "III" {
  if (solvedCount >= 8) return "III";
  if (solvedCount >= 4) return "II";
  return "I";
}

/**
 * Returns how many cases in a season have been solved.
 */
export function getSeasonProgress(
  seasonNumber: 1 | 2 | 3,
  solvedCaseIds: string[]
): { solved: number; total: number } {
  const season = SEASONS.find((s) => s.number === seasonNumber);
  if (!season) return { solved: 0, total: 0 };
  const solved = season.caseIds.filter((id) => solvedCaseIds.includes(id)).length;
  return { solved, total: season.caseIds.length };
}
