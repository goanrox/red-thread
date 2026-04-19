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

// ─── Filter config ────────────────────────────────────────────────────────────

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

        {/* ── Archive Header ────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{ background: "#141414", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}
        >
          <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
            <div className="flex items-start gap-8">
              {/* Left accent line */}
              <div className="hidden md:flex flex-col items-center gap-3 pt-3 shrink-0">
                <div className="w-[0.5px] h-14 bg-gradient-to-b from-transparent to-white/20" />
                <span className="text-[7px] font-mono text-white/25 rotate-90 tracking-[0.35em] uppercase mt-8">Archive</span>
              </div>

              <div>
                <div className="text-[9px] font-bold tracking-[0.6em] uppercase text-white/50 mb-7">Case Registry</div>
                <h1
                  className="font-bold text-white leading-tight mb-5"
                  style={{
                    fontSize: "clamp(2.8rem, 7vw, 5rem)",
                  }}
                >
                  Case Files
                </h1>
                <p className="font-normal text-xl leading-relaxed text-white/45 max-w-480">
                  Each case is a closed world. One killer. One truth. Everything else is misdirection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Classification Filters ────────────────────────────────── */}
        <div style={{ background: "rgba(20,20,20,0.95)", borderBottom: "0.5px solid rgba(255,255,255,0.07)" }} className="sticky top-16 z-40 backdrop-blur-2xl">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.4em] transition-all duration-300 whitespace-nowrap",
                    activeFilter === f.id
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Case Grid ────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          {filtered.length === 0 ? (
            <EmptyState category={activeFilter} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((c, i) => (
                <div
                  key={c.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <CaseCard {...c} className="h-full" />
                </div>
              ))}
            </div>
          )}

          {/* Season 2 Teaser */}
          <div className="mt-20">
            <div
              className="rounded-[4px] p-10 text-center relative overflow-hidden"
              style={season2Unlocked ? {
                background: "#1a1a1a",
                border: "0.5px solid rgba(255,255,255,0.15)",
              } : {
                background: "#0f0f0f",
                border: "0.5px dashed rgba(255,255,255,0.1)",
              }}
            >
              {season2Unlocked ? (
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="h-[0.5px] w-12 bg-white/30" />
                    <span className="text-[9px] font-bold tracking-[0.6em] uppercase text-white/60">Clearance Granted</span>
                    <div className="h-[0.5px] w-12 bg-white/30" />
                  </div>
                  <p className="font-bold text-white text-2xl mb-3">Season Two is unlocked.</p>
                  <p className="font-normal leading-relaxed text-white/40 max-w-440 mx-auto">
                    Assembled for detectives of your calibre. The cases above will be the first to drop.
                  </p>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="w-[0.5px] h-6 bg-white/20 mx-auto mb-5" />
                  <span className="text-[9px] font-bold tracking-[0.6em] uppercase text-white/30 block mb-4">In Production</span>
                  <p className="font-normal leading-relaxed text-white/30 max-w-400 mx-auto">
                    Season Two is being assembled. More cases. More categories. More truth to uncover.
                  </p>
                  <div className="w-[0.5px] h-6 bg-white/20 mx-auto mt-5" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EmptyState({ category }: { category: FilterId }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="w-[0.5px] h-10 bg-white/20 mx-auto mb-8" />
      <p className="font-bold text-white/70 text-2xl mb-3">
        No cases in this classification yet.
      </p>
      <p className="font-normal leading-relaxed text-white/30 max-w-320 mx-auto">
        The{" "}
        {category !== "all"
          ? CATEGORIES.find((c) => c.id === category)?.label ?? category
          : ""}{" "}
        archive is still being assembled. Check back in Season Two.
      </p>
      <div className="w-[0.5px] h-10 bg-white/20 mx-auto mt-8" />
    </div>
  );
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             