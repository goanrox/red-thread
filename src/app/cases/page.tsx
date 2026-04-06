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

// ─── Filter pills ─────────────────────────────────────────────────────────────

const FILTERS: Array<{ id: FilterId; label: string }> = [
  { id: "all", label: "All Cases" },
  ...CATEGORIES.map((c) => ({ id: c.id as FilterId, label: c.label })),
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CasesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const caseStates = useGameStore((s) => s.cases);

  const liveCases = getAllCases();

  // Derive solved case IDs
  const solvedCaseIds = useMemo(
    () =>
      Object.values(caseStates)
        .filter((c) => c.isComplete && c.isCorrect)
        .map((c) => c.caseId),
    [caseStates]
  );

  const clearanceLevel = getArchiveClearanceLevel(solvedCaseIds.length);

  // Enrich all 12 manifests with live state
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

  // Apply category filter
  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? enriched
        : enriched.filter((e) => e.manifest.category === activeFilter),
    [enriched, activeFilter]
  );

  // Group by season
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

  return (
    <PageWrapper>
      <div className="min-h-screen pt-16">

        {/* ── Archive Header ──────────────────────────────────────────── */}
        <div
          className="border-b border-[#2a2a45] py-16"
          style={{ backgroundColor: "#0c0c17" }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 animate-fade-up">
              <div>
                <p className="label-caps text-gold mb-3 tracking-[0.3em]">The Archive</p>
                <h1 className="font-serif text-5xl md:text-6xl text-parchment leading-tight mb-4">
                  Case Browser
                </h1>
                <p className="font-serif italic text-mist text-xl max-w-xl leading-relaxed">
                  Each case is a closed world. One killer. One truth. Everything else is misdirection.
                </p>
              </div>

              {/* Clearance badge */}
              <div
                className="shrink-0 rounded-xl p-5"
                style={{
                  background: "rgba(7,7,14,0.6)",
                  border: "1px solid rgba(42,42,69,0.6)",
                }}
              >
                <p
                  className="label-caps mb-1"
                  style={{ color: "rgba(92,90,120,0.6)", fontSize: "9px", letterSpacing: "0.25em" }}
                >
                  Archive Clearance
                </p>
                <p
                  className="font-serif"
                  style={{ fontSize: "36px", color: "rgba(201,168,76,0.9)", lineHeight: 1, marginBottom: "4px" }}
                >
                  Level {clearanceLevel}
                </p>
                <p
                  className="label-caps"
                  style={{ color: "rgba(92,90,120,0.5)", fontSize: "9px" }}
                >
                  {solvedCaseIds.length} / {CASE_MANIFEST.length} solved
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Filter Bar ─────────────────────────────────────────────── */}
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

        {/* ── Content ────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">

          {/* Filtered: flat view grouped by season */}
          {isFilteredView && <FilteredView cases={filtered} />}

          {/* Default: full season-separated archive */}
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
      </div>
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
    <div>
      {/* Season header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <p
                className="label-caps"
                style={{ color: "rgba(201,168,76,0.65)", fontSize: "9px", letterSpacing: "0.3em" }}
              >
                {season.subtitle}
              </p>
              {isComplete && (
                <span
                  className="label-caps px-2 py-0.5 rounded-full text-[9px]"
                  style={{
                    color: "rgba(201,168,76,0.8)",
                    border: "1px solid rgba(201,168,76,0.25)",
                    background: "rgba(201,168,76,0.05)",
                  }}
                >
                  Season Complete
                </span>
              )}
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-parchment leading-tight">
              {season.title}
            </h2>
            <p
              className="font-serif italic mt-2"
              style={{ color: "rgba(168,165,192,0.45)", fontSize: "14px" }}
            >
              {season.tone}
            </p>
          </div>

          {isAccessible && (
            <div className="text-right shrink-0">
              <p
                className="label-caps mb-1"
                style={{ color: "rgba(92,90,120,0.5)", fontSize: "9px" }}
              >
                Season Progress
              </p>
              <p className="font-serif" style={{ color: "rgba(201,168,76,0.75)", fontSize: "24px" }}>
                {progress.solved}
                <span style={{ color: "rgba(92,90,120,0.5)", fontSize: "14px" }}>
                  {" "}/ {progress.total}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Accent line */}
        <div
          className="h-px"
          style={{
            background: "linear-gradient(to right, rgba(201,168,76,0.25), rgba(201,168,76,0.08), transparent)",
          }}
        />
      </div>

      {/* Locked season banner */}
      {!isAccessible && season.number > 1 && (
        <SeasonLockedCard seasonNumber={season.number as 2 | 3} className="mb-6" />
      )}

      {/* Case cards — show for season 1 always, and for accessible seasons */}
      {(isAccessible || season.number === 1) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
}

// ─── Filtered view ────────────────────────────────────────────────────────────

function FilteredView({ cases }: { cases: EnrichedCase[] }) {
  if (cases.length === 0) {
    return (
      <div
        className="rounded-2xl p-14 text-center"
        style={{ border: "1px solid rgba(42,42,69,0.35)", background: "rgba(7,7,14,0.25)" }}
      >
        <p className="font-serif text-2xl text-parchment mb-3">No cases match this filter.</p>
        <p className="font-serif italic text-mist max-w-sm mx-auto leading-relaxed">
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
    <div className="space-y-16">
      {bySeason.map(({ season, cases: seasonCases }) => (
        <div key={season.number}>
          <div className="flex items-center gap-3 mb-6">
            <p
              className="label-caps shrink-0"
              style={{ color: "rgba(201,168,76,0.55)", fontSize: "9px", letterSpacing: "0.25em" }}
            >
              {season.subtitle} — {season.title}
            </p>
            <div
              className="h-px flex-1"
              style={{ background: "rgba(42,42,69,0.4)" }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

// ─── Filter Pill ──────────────────────────────────────────────────────────────

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
