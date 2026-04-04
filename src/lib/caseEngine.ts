import type { Case, ActiveCaseState, Question } from "@/types";
import { percentage } from "./utils";

/** Returns the clues the player has not yet discovered */
export function undiscoveredClues(caseData: Case, state: ActiveCaseState) {
  return caseData.clues.filter((c) => !state.discoveredClueIds.includes(c.id));
}

/** Returns questions available to ask a suspect given current state */
export function availableQuestions(
  questions: Question[],
  state: ActiveCaseState,
  suspectId: string
): Question[] {
  const asked = state.askedQuestions[suspectId] ?? [];
  return questions.filter((q) => {
    if (asked.includes(q.id)) return false;
    if (q.requiresClueId && !state.discoveredClueIds.includes(q.requiresClueId)) return false;
    if (q.requiresQuestionId && !asked.includes(q.requiresQuestionId)) return false;
    return true;
  });
}

/** Returns whether a suspect has been fully interrogated */
export function isSuspectExhausted(
  questions: Question[],
  state: ActiveCaseState,
  suspectId: string
): boolean {
  return availableQuestions(questions, state, suspectId).length === 0;
}

/** Returns overall case completion percentage (0–100) */
export function caseProgress(caseData: Case, state: ActiveCaseState): number {
  const clueScore = percentage(state.discoveredClueIds.length, caseData.clues.length);
  const sceneScore = percentage(state.visitedSceneIds.length, caseData.scenes.length);
  const suspectScore = percentage(state.interrogatedSuspectIds.length, caseData.suspects.length);
  return Math.round((clueScore + sceneScore + suspectScore) / 3);
}
