"use client";

import { useState, useMemo } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { CaseCard, SeasonLockedCard } from "@/components/case/CaseCard";
import type { CaseCardProgress } from "@/components/case/CaseCard";
import { useGameStore } from "@/store/gameStore";
import {
  getAllCases,
  CATEGORIES,
  CASE_MANIFEST,
  SEASONS,
  isCaseUnlocked,
  isSeasonAccessible,
  getArchiveClearanceLevel,
  getSeasonProgress,
} from "@/data";
import { cn } from "@/lib/utils";
import type { CaseCategory, CaseManifest, SeasonInfo } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterId = "all" | CaseCategory;

interface EnrichedCase {
  manifest: CaseManifest;
  unlocked: boolean;
  progress?: CaseCardProgress;
  unlockInfo?: string;
}

const FILTERS: Array<{ id: FilterId; label: string }> = [
  { id: "all", label: "All Cases" },
  ...CATEGORIES.map((c) => ({ id: c.id as FilterId, label: c.label })),
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CasesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const caseStates = useGameStore((s) => s.cases);
  const liveCases = getAllCases();

  const solvedCaseIds = useMemo(
    () =>
      Object.values(caseStates)
        .filter((c) => c.isComplete && c.isCorrect)
        .map((c) => c.caseId),
    [caseStates]
  );

  const clearanceLevel = getArchiveClearanceLevel(solvedCaseIds.length);

  const enriched: EnrichedCase[] = useMemo(() => {
    return CASE_MANIFEST.map((manifest) => {
      const unlocked = isCaseUnlocked(manifest.id, solvedCaseIds);
      const caseState = caseStates[manifest.id];
      const liveCase = liveCases.find((c) => c.id === manifest.id);

      let progress: CaseCardProgress | undefined;
      if (caseState) {
        const totalClues = liveCase?.clues.length ?? manifest.clueCount;
        const totalSuspects = liveCase?.suspects.length ?? manifest.suspectCount;
        const perfectDeduction =
          caseState.isCorrect === true &&
          caseState.discoveredClueIds.length >= totalClues;

        progress = {
          cluesFound: caseState.discoveredClueIds.length,
          totalClues,
          suspectsInterviewed: caseState.interrogatedSuspectIds.length,
          totalSuspects,
          isComplete: caseState.isComplete,
          isCorrect: caseState.isCorrect,
          score: caseState.score,
          perfectDeduction,
        };
      }

      let unlockInfo: string | undefined;
      if (!unlocked) {
        if (manifest.unlockRequires) {
          const prev = CASE_MANIFEST.find((m) => m.id === manifest.unlockRequires);
          if (prev) unlockInfo = `Complete "${prev.title}" to unlock`;
        } else if (manifest.unlockRequiresSeason) {
          const s = SEASONS.find((s) => s.number === manifest.unlockRequiresSeason);
          if (s) unlockInfo = `Complete ${s.subtitle} to unlock`;
        }
      }

      return { manifest, unlocked, progress, unlockInfo };
    });
  }, [caseStates, solvedCaseIds, liveCases]);

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? enriched
        : enriched.filter((e) => e.manifest.category === activeFilter),
    [enriched, activeFilter]
  );

  const seasonGroups = useMemo(
    () =>
      SEASONS.map((season) => ({
        season,
        cases: filtered.filter((e) => e.manifest.season === season.number),
        isAccessible: isSeasonAccessible(season.number as 1 | 2 | 3, solvedCaseIds),
        progress: getSeasonProgress(season.number as 1 | 2 | 3, solvedCaseIds),
      })),
    [filtered, solvedCaseIds]
  );

  const isFilteredView = activeFilter !== "all";
  const solvedPct = Math.round((solvedCaseIds.length / CASE_MANIFEST.length) * 100);

  return (
    <PageWrapper>
      {/* Top nav offset — exactly --nav-h, no guesswork */}
      <main style={{ paddingTop: "var(--nav-h)" }}>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <section
          className="border-b"
          style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 animate-fade-up">
              <div className="max-w-2xl">
                <p className="text-eyebrow mb-3">The Archive</p>
                <h1
                  className="font-serif leading-[1.05] text-[color:var(--color-text)]"
                  style={{ fontSize: "var(--fz-display)" }}
                >
                  Case Browser
                </h1>
                <p
                  className="mt-4 text-[color:var(--color-text-secondary)]"
                  style={{ fontSize: "var(--fz-body-lg)", lineHeight: 1.55 }}
                >
                  Every case is a closed world. One killer. One truth. Everything else is misdirection.
                </p>
              </div>

              {/* Clearance card */}
              <div
                className="surface p-5 w-full lg:w-[260px] shrink-0"
                aria-label="Archive clearance"
              >
                <div className="flex items-center justify-between">
                  <p className="text-eyebrow">Clearance</p>
                  <p className="text-meta">
                    {solvedCaseIds.length}/{CASE_MANIFEST.length}
                  </p>
                </div>
                <p
                  className="mt-2 font-serif leading-none"
                  style={{ fontSize: "32px", color: "var(--color-text)" }}
                >
                  Level {clearanceLevel}
                </p>
                <div
                  className="mt-4 h-1 w-full rounded-full overflow-hidden"
                  style={{ background: "var(--color-surface-3)" }}
                >
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{ width: `${solvedPct}%`, background: "var(--color-accent)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Sticky filter bar ────────────────────────────────────────── */}
        <div
          className="sticky z-30 nav-glass"
          style={{
            top: "var(--nav-h)",
            height: "var(--subnav-h)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div
            className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center gap-2 overflow-x-auto scrollbar-none"
            role="tablist"
            aria-label="Filter cases by category"
          >
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={activeFilter === f.id}
                aria-pressed={activeFilter === f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn("chip", activeFilter === f.id && "is-active")}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-16 md:space-y-20">
          {isFilteredView && <FilteredView cases={filtered} />}

          {!isFilteredView &&
            seasonGroups.map(({ season, cases, isAccessible, progress }) => (
              <SeasonSection
                key={season.number}
                season={season}
                cases={cases}
                isAccessible={isAccessible}
                progress={progress}
              />
            ))}
        </div>
      </main>
    </PageWrapper>
  );
}

// ─── Season Section ───────────────────────────────────────────────────────────

function SeasonSection({
  season,
  cases,
  isAccessible,
  progress,
}: {
  season: SeasonInfo;
  cases: EnrichedCase[];
  isAccessible: boolean;
  progress: { solved: number; total: number };
}) {
  if (cases.length === 0) return null;
  const isComplete = progress.solved === progress.total && progress.total > 0;

  return (
    <section aria-label={`${season.subtitle} — ${season.title}`}>
      <header className="mb-6 md:mb-8">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-eyebrow">{season.subtitle}</p>
              {isComplete && <span className="badge badge-success badge-dot">Complete</span>}
            </div>
            <h2
              className="font-serif leading-[1.1] text-[color:var(--color-text)]"
              style={{ fontSize: "var(--fz-title-lg)" }}
            >
              {season.title}
            </h2>
            <p
              className="mt-2 text-[color:var(--color-text-secondary)]"
              style={{ fontSize: "var(--fz-body)" }}
            >
              {season.tone}
            </p>
          </div>

          {isAccessible && (
            <div className="shrink-0 text-right">
              <p className="text-eyebrow mb-1">Progress</p>
              <p
                className="font-serif leading-none text-[color:var(--color-text)]"
                style={{ fontSize: "22px" }}
              >
                {progress.solved}
                <span className="text-[color:var(--color-text-tertiary)]"> / {progress.total}</span>
              </p>
            </div>
          )}
        </div>
        <div className="divider mt-5" />
      </header>

      {!isAccessible && season.number > 1 && (
        <SeasonLockedCard seasonNumber={season.number as 2 | 3} className="mb-6" />
      )}

      {(isAccessible || season.number === 1) && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
          {cases.map(({ manifest, unlocked, progress, unlockInfo }, i) => (
            <div
              key={manifest.id}
              className={cn("animate-fade-up", `stagger-${Math.min(i + 1, 6)}`)}
            >
              <CaseCard
                id={manifest.id}
                title={manifest.title}
                subtitle={manifest.subtitle}
                category={manifest.category}
                difficulty={manifest.difficulty}
                estimatedMinutes={manifest.estimatedMinutes}
                isNew={manifest.isNew}
                manifest={manifest}
                isLocked={!unlocked}
                progress={progress}
                unlockInfo={unlockInfo}
                className="h-full"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Filtered view ────────────────────────────────────────────────────────────

function FilteredView({ cases }: { cases: EnrichedCase[] }) {
  if (cases.length === 0) {
    return (
      <div className="surface p-10 md:p-14 text-center">
        <p
          className="font-serif mb-2 text-[color:var(--color-text)]"
          style={{ fontSize: "var(--fz-title-sm)" }}
        >
          No cases match this filter
        </p>
        <p
          className="text-[color:var(--color-text-secondary)] max-w-sm mx-auto"
          style={{ fontSize: "var(--fz-body)" }}
        >
          Additional cases in this category are in development and will appear in future seasons.
        </p>
      </div>
    );
  }

  const bySeason = SEASONS.map((season) => ({
    season,
    cases: cases.filter((e) => e.manifest.season === season.number),
  })).filter((g) => g.cases.length > 0);

  return (
    <div className="space-y-12 md:space-y-16">
      {bySeason.map(({ season, cases: seasonCases }) => (
        <div key={season.number}>
          <div className="flex items-center gap-3 mb-5">
            <p className="text-eyebrow shrink-0">
              {season.subtitle} · {season.title}
            </p>
            <div className="divider flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
            {seasonCases.map(({ manifest, unlocked, progress, unlockInfo }, i) => (
              <div
                key={manifest.id}
                className={cn("animate-fade-up", `stagger-${Math.min(i + 1, 6)}`)}
              >
                <CaseCard
                  id={manifest.id}
                  title={manifest.title}
                  subtitle={manifest.subtitle}
                  category={manifest.category}
                  difficulty={manifest.difficulty}
                  estimatedMinutes={manifest.estimatedMinutes}
                  isNew={manifest.isNew}
                  manifest={manifest}
                  isLocked={!unlocked}
                  progress={progress}
                  unlockInfo={unlockInfo}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
