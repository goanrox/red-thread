import type { Case, ActiveCaseState, Question } from "@/types";
import { clamp, percentage } from "./utils";

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

/** Returns a suspicion level (0–100) for a suspect based on player progress */
export function suspicionLevel(
  suspectId: string,
  caseData: Case,
  state: ActiveCaseState
): number {
  const suspect = caseData.suspects.find((s) => s.id === suspectId);
  if (!suspect) return 0;

  // Score from questions asked
  const askedCount = (state.askedQuestions[suspectId] ?? []).length;
  const totalQuestions = Math.max(suspect.questions.length, 1);
  const questionScore = (askedCount / totalQuestions) * 40;

  // Score from linked clues discovered
  const linkedClues = caseData.clues.filter((c) => c.relatedSuspectIds?.includes(suspectId));
  const discoveredLinked = linkedClues.filter((c) =>
    state.discoveredClueIds.includes(c.id)
  );
  const clueScore = linkedClues.length > 0
    ? (discoveredLinked.length / linkedClues.length) * 60
    : 0;

  return Math.round(clamp(questionScore + clueScore, 0, 100));
}

/** Returns the total questions asked across all suspects */
export function totalQuestionsAsked(state: ActiveCaseState): number {
  return Object.values(state.askedQuestions).reduce((sum, arr) => sum + arr.length, 0);
}

/** Returns the total questions available in a case */
export function totalQuestions(caseData: Case): number {
  return caseData.suspects.reduce((sum, s) => sum + s.questions.length, 0);
}
