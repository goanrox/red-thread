"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameState, ActiveCaseState, PlayerStats } from "@/types";
import { scoreToRank, rankProgress } from "@/lib/scoring";

const initialStats: PlayerStats = {
  totalCasesStarted: 0,
  totalCasesCompleted: 0,
  totalCasesSolved: 0,
  totalScore: 0,
  currentRank: "Rookie",
  rankProgress: 0,
  achievements: [],
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      activeCaseId: null,
      cases: {},
      stats: initialStats,

      startCase: (caseId) => {
        const existing = get().cases[caseId];
        if (existing && !existing.isComplete) return; // Resume in progress case

        const newCase: ActiveCaseState = {
          caseId,
          startedAt: new Date().toISOString(),
          discoveredClueIds: [],
          visitedSceneIds: [],
          askedQuestions: {},
          interrogatedSuspectIds: [],
          isComplete: false,
        };

        set((state) => ({
          activeCaseId: caseId,
          cases: { ...state.cases, [caseId]: newCase },
          stats: {
            ...state.stats,
            totalCasesStarted: state.stats.totalCasesStarted + (existing ? 0 : 1),
          },
        }));
      },

      discoverClue: (caseId, clueId) => {
        set((state) => {
          const caseState = state.cases[caseId];
          if (!caseState || caseState.discoveredClueIds.includes(clueId)) return state;
          return {
            cases: {
              ...state.cases,
              [caseId]: {
                ...caseState,
                discoveredClueIds: [...caseState.discoveredClueIds, clueId],
              },
            },
          };
        });
      },

      visitScene: (caseId, sceneId) => {
        set((state) => {
          const caseState = state.cases[caseId];
          if (!caseState || caseState.visitedSceneIds.includes(sceneId)) return state;
          return {
            cases: {
              ...state.cases,
              [caseId]: {
                ...caseState,
                visitedSceneIds: [...caseState.visitedSceneIds, sceneId],
              },
            },
          };
        });
      },

      askQuestion: (caseId, suspectId, questionId) => {
        set((state) => {
          const caseState = state.cases[caseId];
          if (!caseState) return state;
          const asked = caseState.askedQuestions[suspectId] ?? [];
          if (asked.includes(questionId)) return state;
          const updatedAsked = { ...caseState.askedQuestions, [suspectId]: [...asked, questionId] };
          const interrogated = caseState.interrogatedSuspectIds.includes(suspectId)
            ? caseState.interrogatedSuspectIds
            : [...caseState.interrogatedSuspectIds, suspectId];
          return {
            cases: {
              ...state.cases,
              [caseId]: {
                ...caseState,
                askedQuestions: updatedAsked,
                interrogatedSuspectIds: interrogated,
              },
            },
          };
        });
      },

      accuse: (caseId, suspectId) => {
        set((state) => {
          const caseState = state.cases[caseId];
          if (!caseState) return state;
          return {
            cases: {
              ...state.cases,
              [caseId]: { ...caseState, accusedSuspectId: suspectId },
            },
          };
        });
      },

      completeCase: (caseId, isCorrect, score) => {
        set((state) => {
          const caseState = state.cases[caseId];
          if (!caseState) return state;
          const newTotalScore = state.stats.totalScore + score;
          return {
            cases: {
              ...state.cases,
              [caseId]: {
                ...caseState,
                isComplete: true,
                isCorrect,
                completedAt: new Date().toISOString(),
                score,
              },
            },
            stats: {
              ...state.stats,
              totalCasesCompleted: state.stats.totalCasesCompleted + 1,
              totalCasesSolved: state.stats.totalCasesSolved + (isCorrect ? 1 : 0),
              totalScore: newTotalScore,
              currentRank: scoreToRank(newTotalScore),
              rankProgress: rankProgress(newTotalScore),
            },
          };
        });
      },

      resetCase: (caseId) => {
        set((state) => {
          const { [caseId]: _removed, ...rest } = state.cases;
          return { cases: rest, activeCaseId: state.activeCaseId === caseId ? null : state.activeCaseId };
        });
      },

      updateNotes: (caseId, notes) => {
        set((state) => {
          const caseState = state.cases[caseId];
          if (!caseState) return state;
          return {
            cases: { ...state.cases, [caseId]: { ...caseState, playerNotes: notes } },
          };
        });
      },

      markBriefingShown: (caseId) => {
        set((state) => {
          const caseState = state.cases[caseId];
          if (!caseState) return state;
          return {
            cases: { ...state.cases, [caseId]: { ...caseState, briefingShown: true } },
          };
        });
      },
    }),
    {
      name: "red-thread-game",
      partialize: (state) => ({ cases: state.cases, stats: state.stats }),
    }
  )
);
