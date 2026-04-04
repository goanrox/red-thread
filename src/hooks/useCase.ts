"use client";

import { useGameStore } from "@/store";
import { getCaseById } from "@/data";
import { caseProgress } from "@/lib/caseEngine";

/** Returns combined case data + player state for a given caseId */
export function useCase(caseId: string) {
  const caseData = getCaseById(caseId);
  const caseState = useGameStore((s) => s.cases[caseId]);
  const startCase = useGameStore((s) => s.startCase);
  const discoverClue = useGameStore((s) => s.discoverClue);
  const visitScene = useGameStore((s) => s.visitScene);
  const accuse = useGameStore((s) => s.accuse);

  const progress = caseData && caseState ? caseProgress(caseData, caseState) : 0;

  return { caseData, caseState, progress, startCase, discoverClue, visitScene, accuse };
}
