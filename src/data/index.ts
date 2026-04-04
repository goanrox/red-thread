import type { Case, CaseSummary, CaseCategory } from "@/types";
import { thornwoodCase } from "./cases/thornwood";

// ─── Case Registry ────────────────────────────────────────────────────────────

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
