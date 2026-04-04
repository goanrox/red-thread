"use client";

import { useGameStore } from "@/store";
import { getCaseById } from "@/data";
import { caseProgress, undiscoveredClues } from "@/lib/caseEngine";
import { percentage } from "@/lib/utils";

export function useProgress(caseId: string) {
  const caseData = getCaseById(caseId);
  const caseState = useGameStore((s) => s.cases[caseId]);

  if (!caseData || !caseState) {
    return { overall: 0, clues: 0, scenes: 0, suspects: 0, remaining: [] };
  }

  return {
    overall: caseProgress(caseData, caseState),
    clues: percentage(caseState.discoveredClueIds.length, caseData.clues.length),
    scenes: percentage(caseState.visitedSceneIds.length, caseData.scenes.length),
    suspects: percentage(caseState.interrogatedSuspectIds.length, caseData.suspects.length),
    remaining: undiscoveredClues(caseData, caseState),
  };
}
