"use client";

import { useGameStore } from "@/store";
import { getCaseById } from "@/data";
import { availableQuestions, isSuspectExhausted } from "@/lib/caseEngine";

export function useSuspect(caseId: string, suspectId: string) {
  const caseData = getCaseById(caseId);
  const caseState = useGameStore((s) => s.cases[caseId]);
  const askQuestion = useGameStore((s) => s.askQuestion);

  const suspect = caseData?.suspects.find((s) => s.id === suspectId);

  const available = caseData && caseState && suspect
    ? availableQuestions(suspect.questions, caseState, suspectId)
    : [];

  const isExhausted = caseData && caseState && suspect
    ? isSuspectExhausted(suspect.questions, caseState, suspectId)
    : false;

  const askedQuestions = caseState?.askedQuestions[suspectId] ?? [];

  return { suspect, available, isExhausted, askedQuestions, askQuestion };
}
