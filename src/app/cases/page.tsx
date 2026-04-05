"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { CaseCard } from "@/components/case/CaseCard";
import { useGameStore } from "@/store/gameStore";
import { getAllCases, CATEGORIES } from "@/data";
import { cn } from "@/lib/utils";
import type { CaseCategory } from "@/types";

// ─── Locked placeholder cases ─────────────────────────────────────────────────

const LOCKED_CASES = [
  {
    id: "bellamy-gala",
    title: "The Bellamy Gala",
    subtitle: "Champagne, poison, and a room full of perfect alibis.",
    setting: "Paris, 1928",
    category: "noir" as CaseCategory,
    difficulty: 3 as const,
    estimatedMinutes: 50,
    suspectCount: 6,
    clueCount: 10,
  },
  {
    id: "coldwater-file",
    title: "The Coldwater File",
    subtitle: "A case from 1978. Someone remembers. Someone wishes they didn't.",
    setting: "Yorkshire Moors, 1978",
    category: "cold-case" as CaseCategory,
    difficulty: 4 as const,
    estimatedMinutes: 60,
    suspectCount: 5,
    clueCount: 14,
  },
  {
    id: "ashford-merger",
    title: "The Ashford Merger",
    subtitle: "A CFO found dead. The deal closes in 48 hours.",
    setting: "London, Present Day",
    category: "conspiracy" as CaseCategory,
    difficulty: 4 as const,
    estimatedMinutes: 55,
    suspectCount: 7,
    clueCount: 12,
  },
];

// ─── Filter pills ─────────────────────────────────────────────────────────────

type FilterId = "all" | CaseCategory;

const FILTERS: Array<{ id: FilterId; label: string }> = [
  { id: "all", label: "All Cases" },
  ...CATEGORIES.map((c) => ({ id: c.id as FilterId, label: c.label })),
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CasesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const gameState = useGameStore((s) => s.cases);
  const stats = useGameStore((s) => s.stats);

  const season2Unlocked = stats.totalCasesSolved >= 1;
  const liveCases = getAllCases();

  // Build all cards (live + locked)
  const allCards = [
    ...liveCases.map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: c.subtitle,
      category: c.category,
      difficulty: c.difficulty,
      estimatedMinutes: c.estimatedMinutes,
      setting: c.setting,
      isNew: c.isNew,
      suspectCount: c.suspects.length,
      clueCount: c.clues.length,
      isLocked: false,
      progress: gameState[c.id]
        ? {
            cluesFound: gameState[c.id].discoveredClueIds.length,
            totalClues: c.clues.length,
            isComplete: gameState[c.id].isComplete,
            isCorrect: gameState[c.id].isCorrect,
          }
        : undefined,
    })),
    ...LOCKED_CASES.map((c) => ({ ...c, isLocked: true, season2Unlocked, isNew: false, progress: undefined })),
  ];

  const filtered =
    activeFilter === "all"
      ? allCards
      : allCards.filter((c) => c.category === activeFilter);

  return (
    <PageWrapper>
      <div className="min-h-screen pt-16">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div
          className="border-b border-[#2a2a45] py-16"
          style={{ backgroundColor: "#0c0c17" }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="animate-fade-up">
              <p className="label-caps text-gold mb-3">The Archive</p>
              <h1 className="font-serif text-5xl md:text-6xl text-parchment leading-tight mb-4">
                Case Browser
              </h1>
              <p className="font-serif italic text-mist text-xl max-w-xl leading-relaxed">
                Each case is a closed world. One killer. One truth. Everything
                else is misdirection.
              </p>
            </div>
          </div>
        </div>

        {/* ── Filters ────────────────────────────────────────────────── */}
        <div className="border-b border-[#2a2a45] sticky top-16 z-40 glass">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
              {FILTERS.map((f) => (
                <FilterPill
                  key={f.id}
                  label={f.label}
                  active={activeFilter === f.id}
                  onClick={() => setActiveFilter(f.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Grid ───────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          {filtered.length === 0 ? (
            <EmptyState category={activeFilter} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((c, i) => (
                <div
                  key={c.id}
                  className={cn(
                    "animate-fade-up",
                    `stagger-${Math.min(i + 1, 6)}`
                  )}
                >
                  <CaseCard {...c} className="h-full" />
                </div>
              ))}
            </div>
          )}

          {/* Season 2 teaser */}
          <div
            className={cn("mt-16 rounded-2xl p-8 text-center", season2Unlocked ? "card-gold" : "card")}
            style={season2Unlocked ? {} : { opacity: 0.7 }}
          >
            {season2Unlocked ? (
              <>
                <p className="label-caps text-gold mb-3 tracking-[0.25em]">Season 2 — Unlocked</p>
                <p className="font-serif text-2xl text-parchment mb-3">You&apos;ve proven yourself.</p>
                <p className="font-serif italic text-mist leading-relaxed max-w-lg mx-auto">
                  Season Two is being assembled for detectives of your calibre. The cases above will be the first to drop.
                </p>
              </>
            ) : (
              <>
                <p className="label-caps text-shadow mb-3">More Coming</p>
                <p className="font-serif italic text-mist text-xl">
                  Season Two is in production. More cases. More categories. More
                  truth.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "label-caps px-4 py-2 rounded-full border whitespace-nowrap transition-colors duration-200 shrink-0",
        active
          ? "border-gold/60 bg-gold/10 text-gold"
          : "border-[#2a2a45] text-shadow hover:border-[#5c5a78] hover:text-mist"
      )}
    >
      {label}
    </button>
  );
}

function EmptyState({ category }: { category: FilterId }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="font-serif text-3xl text-parchment mb-3">
        No cases in this category yet.
      </p>
      <p className="font-serif italic text-mist text-lg max-w-sm leading-relaxed">
        The{" "}
        {category !== "all"
          ? CATEGORIES.find((c) => c.id === category)?.label ?? category
          : ""}{" "}
        archive is still being assembled. Check back in Season Two.
      </p>
    </div>
  );
}
