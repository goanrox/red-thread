"use client";

import Link from "next/link";
import { ChevronLeft, Crosshair } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { getCaseById } from "@/data";
import { caseProgress } from "@/lib/caseEngine";
import { cn } from "@/lib/utils";

interface CaseNavProps {
  caseId: string;
}

export function CaseNav({ caseId }: CaseNavProps) {
  const gameState = useGameStore((s) => s.cases[caseId]);
  const caseData = getCaseById(caseId);

  if (!caseData) return null;

  const progress = gameState ? caseProgress(caseData, gameState) : 0;
  const cluesFound = gameState?.discoveredClueIds.length ?? 0;
  const canAccuse = cluesFound >= 3 && !gameState?.isComplete;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 glass border-b border-[#2a2a45]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
        {/* Left: back + title + progress */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/cases"
            className="text-shadow hover:text-mist transition-colors duration-150 shrink-0 p-0.5"
            aria-label="Back to cases"
          >
            <ChevronLeft size={16} />
          </Link>
          <span className="font-serif text-parchment text-sm truncate">
            {caseData.title}
          </span>
          <div className="hidden sm:flex items-center gap-2 shrink-0 ml-2">
            <div className="h-1 w-20 bg-[#2a2a45] rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="label-caps text-shadow">{progress}%</span>
          </div>
        </div>

        {/* Right: accuse CTA */}
        {gameState && !gameState.isComplete ? (
          <Link
            href={`/cases/${caseId}/accuse`}
            className={cn(
              "flex items-center gap-1.5 label-caps px-3 py-1.5 rounded-lg border transition-all duration-200 shrink-0 text-[10px]",
              canAccuse
                ? "border-crimson/60 text-crimson-light hover:bg-crimson hover:text-parchment hover:border-crimson hover:shadow-[0_0_12px_rgba(139,34,50,0.5)]"
                : "border-[#2a2a45] text-shadow cursor-not-allowed pointer-events-none opacity-40"
            )}
          >
            <Crosshair size={11} />
            {canAccuse ? "Accuse" : `${Math.max(0, 3 - cluesFound)} more clue${3 - cluesFound !== 1 ? "s" : ""}`}
          </Link>
        ) : gameState?.isComplete ? (
          <span className={cn(
            "label-caps px-3 py-1.5 rounded-lg border text-[10px]",
            gameState.isCorrect
              ? "border-gold/30 text-gold bg-gold/10"
              : "border-crimson/30 text-crimson-light bg-crimson/10"
          )}>
            {gameState.isCorrect ? "Case Solved" : "Wrong Accusation"}
          </span>
        ) : null}
      </div>
    </div>
  );
}
