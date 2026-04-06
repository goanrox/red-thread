import Link from "next/link";
import { cn } from "@/lib/utils";
import { SEASONS } from "@/data/caseManifest";
import type {
  CaseSummary,
  CaseCategory,
  Difficulty,
  CaseManifest,
  VisualTag,
  TeaserSuspect,
  TeaserEvidence,
} from "@/types";

// ─── Progress Types ───────────────────────────────────────────────────────────

export interface CaseCardProgress {
  cluesFound: number;
  totalClues: number;
  suspectsInterviewed?: number;
  totalSuspects?: number;
  isComplete: boolean;
  isCorrect?: boolean;
  score?: number;
  perfectDeduction?: boolean;
}

// ─── CaseCard Props ───────────────────────────────────────────────────────────

export interface CaseCardProps extends CaseSummary {
  // Legacy flat props (used by landing page)
  setting?: string;
  suspectCount?: number;
  clueCount?: number;
  className?: string;

  // Rich manifest-based props (used by archive)
  manifest?: CaseManifest;
  isLocked?: boolean;
  isSeasonLocked?: boolean;
  progress?: CaseCardProgress;
  unlockInfo?: string; // "Complete The Thornwood Affair to unlock"
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<CaseCategory, string> = {
  "country-house": "Country House",
  noir: "Noir",
  "cold-case": "Cold Case",
  psychological: "Psychological",
  "locked-room": "Locked Room",
  conspiracy: "Conspiracy",
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: "Introductory",
  2: "Moderate",
  3: "Challenging",
  4: "Demanding",
  5: "Extreme",
};

const TAG_STYLES: Record<VisualTag, { text: string; border: string; bg: string }> = {
  Classified: {
    text: "rgba(139,34,50,0.9)",
    border: "rgba(139,34,50,0.4)",
    bg: "rgba(139,34,50,0.08)",
  },
  "Season Locked": {
    text: "rgba(92,90,120,0.8)",
    border: "rgba(42,42,69,0.8)",
    bg: "rgba(7,7,14,0.4)",
  },
  "Requires Clearance": {
    text: "rgba(139,34,50,0.8)",
    border: "rgba(139,34,50,0.35)",
    bg: "rgba(139,34,50,0.06)",
  },
  "High Profile": {
    text: "rgba(201,168,76,0.9)",
    border: "rgba(201,168,76,0.3)",
    bg: "rgba(201,168,76,0.06)",
  },
  "Cold Case": {
    text: "rgba(107,99,212,0.9)",
    border: "rgba(107,99,212,0.3)",
    bg: "rgba(107,99,212,0.06)",
  },
  Restricted: {
    text: "rgba(139,34,50,0.8)",
    border: "rgba(139,34,50,0.35)",
    bg: "rgba(139,34,50,0.06)",
  },
  "Under Review": {
    text: "rgba(92,90,120,0.8)",
    border: "rgba(42,42,69,0.7)",
    bg: "rgba(42,42,69,0.08)",
  },
  "Active Investigation": {
    text: "rgba(201,168,76,1)",
    border: "rgba(201,168,76,0.45)",
    bg: "rgba(201,168,76,0.08)",
  },
  "Case Closed": {
    text: "rgba(168,165,192,0.7)",
    border: "rgba(42,42,69,0.6)",
    bg: "rgba(7,7,14,0.3)",
  },
};

function VisualTagBadge({ tag }: { tag: VisualTag }) {
  const s = TAG_STYLES[tag];
  return (
    <span
      className="label-caps px-2 py-0.5 rounded-full text-[9px] shrink-0"
      style={{ color: s.text, border: `1px solid ${s.border}`, background: s.bg }}
    >
      {tag}
    </span>
  );
}

function DifficultyDots({ level }: { level: Difficulty }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Difficulty: ${DIFFICULTY_LABELS[level]}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
          style={{ background: i < level ? "rgba(201,168,76,0.8)" : "rgba(42,42,69,0.7)" }}
        />
      ))}
      <span className="label-caps ml-1" style={{ color: "rgba(92,90,120,0.7)", fontSize: "9px" }}>
        {DIFFICULTY_LABELS[level]}
      </span>
    </div>
  );
}

function RedactedBar({ width = "70%" }: { width?: string }) {
  return (
    <span
      className="inline-block rounded-sm align-middle"
      style={{
        width,
        height: "10px",
        background: "rgba(42,42,69,0.7)",
        verticalAlign: "middle",
        display: "inline-block",
      }}
    />
  );
}

function TeaserSuspectRow({ suspect }: { suspect: TeaserSuspect }) {
  return (
    <div className="flex items-center gap-2.5 py-1">
      <span
        className="label-caps shrink-0"
        style={{ color: "rgba(92,90,120,0.7)", fontSize: "9px", width: "22px" }}
      >
        {suspect.isRedacted ? "??." : suspect.initials}
      </span>
      <span
        className="w-px h-3 shrink-0"
        style={{ background: "rgba(42,42,69,0.6)" }}
      />
      {suspect.isRedacted ? (
        <div className="flex items-center gap-1.5">
          <RedactedBar width="60px" />
          <span className="label-caps" style={{ color: "rgba(92,90,120,0.45)", fontSize: "8px" }}>
            {suspect.role}
          </span>
        </div>
      ) : (
        <span className="label-caps" style={{ color: "rgba(168,165,192,0.65)", fontSize: "9px" }}>
          {suspect.role}
        </span>
      )}
    </div>
  );
}

function TeaserEvidenceRow({ evidence }: { evidence: TeaserEvidence }) {
  const typeColors: Record<string, string> = {
    physical: "rgba(201,168,76,0.5)",
    document: "rgba(107,99,212,0.5)",
    forensic: "rgba(139,34,50,0.5)",
    testimony: "rgba(168,165,192,0.4)",
    observation: "rgba(92,90,120,0.5)",
  };
  return (
    <div className="flex items-center gap-2.5 py-1">
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: typeColors[evidence.type] || "rgba(42,42,69,0.7)" }}
      />
      {evidence.isRedacted ? (
        <div className="flex items-center gap-2">
          <RedactedBar width="80px" />
          <span className="label-caps" style={{ color: "rgba(92,90,120,0.4)", fontSize: "8px" }}>
            {evidence.label}
          </span>
        </div>
      ) : (
        <span
          className="label-caps"
          style={{ color: "rgba(168,165,192,0.6)", fontSize: "9px" }}
        >
          {evidence.label}
        </span>
      )}
    </div>
  );
}

// ─── Sub-card: Active Investigation ──────────────────────────────────────────

function ActiveCard({
  manifest,
  progress,
  className,
}: {
  manifest: CaseManifest;
  progress?: CaseCardProgress;
  className?: string;
}) {
  const cluePercent =
    progress && progress.totalClues > 0
      ? Math.round((progress.cluesFound / progress.totalClues) * 100)
      : 0;
  const suspectPercent =
    progress && progress.totalSuspects && progress.totalSuspects > 0
      ? Math.round(((progress.suspectsInterviewed ?? 0) / progress.totalSuspects) * 100)
      : 0;

  return (
    <div
      className={cn("relative flex flex-col overflow-hidden cursor-pointer", className)}
      style={{
        background: "linear-gradient(160deg, #181828 0%, #111120 55%)",
        border: "1px solid rgba(201,168,76,0.35)",
        borderRadius: "16px",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.055), 0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(201,168,76,0.08)",
      }}
    >
      {/* Active pulse accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(201,168,76,0.6), transparent)",
        }}
      />

      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Status row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse-gold"
              style={{ background: "rgba(201,168,76,0.9)" }}
            />
            <span
              className="label-caps"
              style={{ color: "rgba(201,168,76,0.9)", fontSize: "9px", letterSpacing: "0.25em" }}
            >
              Investigation Active
            </span>
          </div>
          <span className="label-caps" style={{ color: "rgba(92,90,120,0.65)", fontSize: "9px" }}>
            {CATEGORY_LABELS[manifest.category]}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-serif text-[1.65rem] leading-tight text-parchment mb-2">
            {manifest.title}
          </h3>
          <p
            className="font-serif italic text-sm leading-snug"
            style={{ color: "rgba(168,165,192,0.75)" }}
          >
            {manifest.subtitle}
          </p>
        </div>

        {/* Location */}
        <p className="label-caps -mt-1" style={{ color: "rgba(92,90,120,0.6)", fontSize: "9px" }}>
          {manifest.location}
        </p>

        <div className="flex-1" />
        <div className="divider-gold" />

        {/* Progress metrics */}
        {progress && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="label-caps" style={{ color: "rgba(92,90,120,0.8)", fontSize: "9px" }}>
                Evidence Recovered
              </span>
              <span
                className="label-caps"
                style={{ color: "rgba(201,168,76,0.85)", fontSize: "9px" }}
              >
                {progress.cluesFound} / {progress.totalClues}
              </span>
            </div>
            <div
              className="h-px rounded-full overflow-hidden"
              style={{ background: "rgba(42,42,69,0.6)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${cluePercent}%`,
                  background: "linear-gradient(to right, rgba(201,168,76,0.5), rgba(201,168,76,0.9))",
                  boxShadow: "0 0 6px rgba(201,168,76,0.3)",
                }}
              />
            </div>

            {progress.totalSuspects && progress.totalSuspects > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <span
                    className="label-caps"
                    style={{ color: "rgba(92,90,120,0.8)", fontSize: "9px" }}
                  >
                    Suspects Interviewed
                  </span>
                  <span
                    className="label-caps"
                    style={{ color: "rgba(168,165,192,0.7)", fontSize: "9px" }}
                  >
                    {progress.suspectsInterviewed ?? 0} / {progress.totalSuspects}
                  </span>
                </div>
                <div
                  className="h-px rounded-full overflow-hidden"
                  style={{ background: "rgba(42,42,69,0.6)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${suspectPercent}%`,
                      background:
                        "linear-gradient(to right, rgba(107,99,212,0.4), rgba(107,99,212,0.7))",
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/cases/${manifest.id}`}
          className="btn-gold w-full text-center block"
          style={{ padding: "12px 24px" }}
        >
          Continue Investigation
        </Link>
      </div>
    </div>
  );
}

// ─── Sub-card: Solved ─────────────────────────────────────────────────────────

function SolvedCard({
  manifest,
  progress,
  className,
}: {
  manifest: CaseManifest;
  progress?: CaseCardProgress;
  className?: string;
}) {
  const isPerfect = progress?.perfectDeduction;
  const isCorrect = progress?.isCorrect;

  return (
    <div
      className={cn("relative flex flex-col overflow-hidden", className)}
      style={{
        background: "linear-gradient(160deg, #141420 0%, #0f0f1c 55%)",
        border: isCorrect
          ? "1px solid rgba(42,42,69,0.7)"
          : "1px solid rgba(139,34,50,0.3)",
        borderRadius: "16px",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 20px rgba(0,0,0,0.55)",
      }}
    >
      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Status row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span
              className="label-caps"
              style={{
                color: isCorrect ? "rgba(168,165,192,0.6)" : "rgba(139,34,50,0.7)",
                fontSize: "9px",
                letterSpacing: "0.25em",
              }}
            >
              {isCorrect ? "Case Closed" : "Unsolved"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isPerfect && (
              <span
                className="label-caps px-2 py-0.5 rounded-full text-[9px]"
                style={{
                  color: "rgba(201,168,76,0.9)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  background: "rgba(201,168,76,0.05)",
                }}
              >
                Perfect Deduction
              </span>
            )}
            <span className="label-caps" style={{ color: "rgba(92,90,120,0.55)", fontSize: "9px" }}>
              {CATEGORY_LABELS[manifest.category]}
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h3
            className="font-serif text-[1.65rem] leading-tight mb-2"
            style={{ color: "rgba(240,236,224,0.65)" }}
          >
            {manifest.title}
          </h3>
          <p
            className="font-serif italic text-sm leading-snug"
            style={{ color: "rgba(168,165,192,0.45)" }}
          >
            {manifest.subtitle}
          </p>
        </div>

        <p
          className="label-caps -mt-1"
          style={{ color: "rgba(92,90,120,0.5)", fontSize: "9px" }}
        >
          {manifest.location}
        </p>

        <div className="flex-1" />
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(42,42,69,0.6), transparent)",
          }}
        />

        {/* Score / rating */}
        {progress?.score !== undefined && (
          <div className="flex items-center justify-between">
            <span
              className="label-caps"
              style={{ color: "rgba(92,90,120,0.6)", fontSize: "9px" }}
            >
              Archive Score
            </span>
            <span
              className="label-caps"
              style={{
                color: isCorrect ? "rgba(201,168,76,0.7)" : "rgba(139,34,50,0.6)",
                fontSize: "9px",
              }}
            >
              {progress.score} pts
            </span>
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/cases/${manifest.id}`}
          className="w-full py-3 rounded-xl label-caps text-center block transition-all duration-300 hover:text-mist"
          style={{
            border: "1px solid rgba(42,42,69,0.6)",
            color: "rgba(92,90,120,0.7)",
            background: "rgba(7,7,14,0.2)",
            fontSize: "9px",
            letterSpacing: "0.2em",
          }}
        >
          Review Case File
        </Link>
      </div>
    </div>
  );
}

// ─── Sub-card: Locked (previous case required) ────────────────────────────────

function LockedCard({
  manifest,
  unlockInfo,
  className,
}: {
  manifest: CaseManifest;
  unlockInfo?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("relative flex flex-col overflow-hidden", className)}
      style={{
        background: "linear-gradient(160deg, #0f0f1c 0%, #0a0a14 55%)",
        border: "1px solid rgba(42,42,69,0.5)",
        borderRadius: "16px",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02), 0 4px 20px rgba(0,0,0,0.6)",
      }}
    >
      {/* Subtle shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, transparent 40%, rgba(42,42,69,0.06) 50%, transparent 60%)",
        }}
      />

      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Visual tags */}
        {manifest.visualTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {manifest.visualTags.slice(0, 3).map((tag) => (
              <VisualTagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Title */}
        <div>
          <h3 className="font-serif text-[1.65rem] leading-tight text-parchment mb-2">
            {manifest.title}
          </h3>
          <p
            className="font-serif italic text-sm leading-snug"
            style={{ color: "rgba(168,165,192,0.6)" }}
          >
            {manifest.subtitle}
          </p>
        </div>

        {/* Location */}
        <p className="label-caps -mt-1" style={{ color: "rgba(92,90,120,0.5)", fontSize: "9px" }}>
          {manifest.location}
        </p>

        {/* Teaser description */}
        <p
          className="font-serif italic text-sm leading-relaxed"
          style={{ color: "rgba(168,165,192,0.45)", borderLeft: "2px solid rgba(42,42,69,0.5)", paddingLeft: "12px" }}
        >
          {manifest.teaserDescription}
        </p>

        {/* Redacted suspects */}
        <div>
          <p
            className="label-caps mb-2"
            style={{ color: "rgba(92,90,120,0.4)", fontSize: "8px", letterSpacing: "0.2em" }}
          >
            File — Persons of Interest
          </p>
          <div
            className="rounded-lg px-3 py-1"
            style={{ background: "rgba(7,7,14,0.4)", border: "1px solid rgba(42,42,69,0.3)" }}
          >
            {manifest.teaserSuspects.slice(0, 4).map((s, i) => (
              <TeaserSuspectRow key={i} suspect={s} />
            ))}
            {manifest.teaserSuspects.length > 4 && (
              <p
                className="label-caps py-1"
                style={{ color: "rgba(92,90,120,0.35)", fontSize: "8px" }}
              >
                +{manifest.teaserSuspects.length - 4} additional subjects — access restricted
              </p>
            )}
          </div>
        </div>

        {/* Redacted evidence */}
        <div>
          <p
            className="label-caps mb-2"
            style={{ color: "rgba(92,90,120,0.4)", fontSize: "8px", letterSpacing: "0.2em" }}
          >
            File — Evidence Log
          </p>
          <div
            className="rounded-lg px-3 py-1"
            style={{ background: "rgba(7,7,14,0.4)", border: "1px solid rgba(42,42,69,0.3)" }}
          >
            {manifest.teaserEvidence.slice(0, 3).map((e, i) => (
              <TeaserEvidenceRow key={i} evidence={e} />
            ))}
          </div>
        </div>

        <div className="flex-1" />
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(42,42,69,0.5), transparent)",
          }}
        />

        {/* Metadata row */}
        <div className="flex items-center justify-between">
          <DifficultyDots level={manifest.difficulty} />
          <span className="label-caps" style={{ color: "rgba(92,90,120,0.45)", fontSize: "9px" }}>
            {manifest.estimatedMinutes} min
          </span>
        </div>

        {/* Unlock requirement */}
        {unlockInfo && (
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{
              background: "rgba(42,42,69,0.12)",
              border: "1px solid rgba(42,42,69,0.3)",
            }}
          >
            <LockIcon />
            <span
              className="label-caps"
              style={{ color: "rgba(92,90,120,0.65)", fontSize: "9px" }}
            >
              {unlockInfo}
            </span>
          </div>
        )}

        {/* CTA */}
        <div
          className="w-full py-3 rounded-xl label-caps text-center select-none"
          style={{
            border: "1px solid rgba(42,42,69,0.4)",
            color: "rgba(42,42,69,0.8)",
            background: "rgba(7,7,14,0.2)",
            fontSize: "9px",
            letterSpacing: "0.2em",
          }}
        >
          Restricted — Access Not Granted
        </div>
      </div>
    </div>
  );
}

// ─── Sub-card: Season Locked (cinematic banner) ───────────────────────────────

export function SeasonLockedCard({
  seasonNumber,
  className,
}: {
  seasonNumber: 2 | 3;
  className?: string;
}) {
  const season = SEASONS.find((s) => s.number === seasonNumber);
  const prevSeasonNumber = (seasonNumber - 1) as 1 | 2;
  const prevSeason = SEASONS.find((s) => s.number === prevSeasonNumber);
  if (!season) return null;

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: "linear-gradient(160deg, #0d0d1a 0%, #090912 100%)",
        border: "1px solid rgba(42,42,69,0.4)",
        borderRadius: "16px",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025), 0 4px 24px rgba(0,0,0,0.7)",
        minHeight: "200px",
      }}
    >
      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(42,42,69,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(42,42,69,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: Season info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="label-caps"
                style={{ color: "rgba(42,42,69,0.9)", fontSize: "9px", letterSpacing: "0.3em" }}
              >
                {season.subtitle}
              </span>
              <span
                className="h-px flex-1 max-w-[40px]"
                style={{ background: "rgba(42,42,69,0.5)" }}
              />
              <span
                className="label-caps px-2 py-0.5 rounded-full text-[9px]"
                style={{
                  color: "rgba(42,42,69,0.9)",
                  border: "1px solid rgba(42,42,69,0.5)",
                  background: "rgba(7,7,14,0.4)",
                }}
              >
                Season Locked
              </span>
            </div>

            <h2
              className="font-serif leading-none mb-3"
              style={{ fontSize: "clamp(28px, 4vw, 42px)", color: "rgba(240,236,224,0.25)" }}
            >
              {season.title}
            </h2>

            <p
              className="font-serif italic mb-4"
              style={{ color: "rgba(168,165,192,0.3)", fontSize: "14px" }}
            >
              &ldquo;{season.crypticHint}&rdquo;
            </p>

            <p
              className="label-caps"
              style={{ color: "rgba(92,90,120,0.5)", fontSize: "9px", lineHeight: 1.8 }}
            >
              {season.tone}
            </p>
          </div>

          {/* Right: Lock info */}
          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex items-center gap-2">
              <span
                className="label-caps"
                style={{ color: "rgba(42,42,69,0.7)", fontSize: "9px" }}
              >
                {season.caseIds.length} cases
              </span>
              <span className="w-px h-3" style={{ background: "rgba(42,42,69,0.5)" }} />
              <span
                className="label-caps"
                style={{ color: "rgba(42,42,69,0.7)", fontSize: "9px" }}
              >
                Locked
              </span>
            </div>

            <div
              className="rounded-xl px-4 py-3 text-center"
              style={{
                border: "1px solid rgba(42,42,69,0.35)",
                background: "rgba(7,7,14,0.35)",
                minWidth: "200px",
              }}
            >
              <LockIcon style={{ margin: "0 auto 8px", display: "block" }} />
              <p
                className="label-caps"
                style={{ color: "rgba(42,42,69,0.8)", fontSize: "9px", lineHeight: 1.7 }}
              >
                Complete {prevSeason ? prevSeason.subtitle : "all previous cases"}
              </p>
              <p
                className="label-caps"
                style={{ color: "rgba(42,42,69,0.6)", fontSize: "9px" }}
              >
                to access this archive
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main CaseCard (legacy-compatible + manifest-aware) ───────────────────────

export function CaseCard({
  id,
  title,
  subtitle,
  category,
  difficulty,
  estimatedMinutes,
  setting,
  isNew,
  isFeatured,
  suspectCount = 0,
  clueCount = 0,
  manifest,
  isLocked = false,
  isSeasonLocked = false,
  progress,
  unlockInfo,
  className,
}: CaseCardProps) {
  // If full manifest provided, use rich state rendering
  if (manifest) {
    const inProgress = !!progress && progress.cluesFound > 0 && !progress.isComplete;
    const isComplete = !!progress?.isComplete;

    if (isComplete) {
      return <SolvedCard manifest={manifest} progress={progress} className={className} />;
    }

    if (inProgress) {
      return <ActiveCard manifest={manifest} progress={progress} className={className} />;
    }

    if (isLocked) {
      return (
        <LockedCard manifest={manifest} unlockInfo={unlockInfo} className={className} />
      );
    }

    // Unlocked, not started — show as interactive card
    return (
      <div
        className={cn("card card-hover relative flex flex-col overflow-hidden cursor-pointer", className)}
      >
        <div className="flex flex-col flex-1 p-6 gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span
              className="label-caps"
              style={{ color: "rgba(92,90,120,0.7)", fontSize: "9px" }}
            >
              {CATEGORY_LABELS[manifest.category]}
            </span>
            <div className="flex items-center gap-2">
              {manifest.isNew && (
                <VisualTagBadge tag="High Profile" />
              )}
              {manifest.visualTags
                .filter((t) => t !== "Season Locked")
                .slice(0, 1)
                .map((t) => (
                  <VisualTagBadge key={t} tag={t} />
                ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-[1.65rem] leading-tight text-parchment mb-2">
              {manifest.title}
            </h3>
            <p
              className="font-serif italic text-sm leading-snug"
              style={{ color: "rgba(168,165,192,0.75)" }}
            >
              {manifest.subtitle}
            </p>
          </div>

          <p
            className="label-caps -mt-1"
            style={{ color: "rgba(92,90,120,0.6)", fontSize: "9px" }}
          >
            {manifest.location}
          </p>

          <p
            className="font-serif italic text-sm leading-relaxed"
            style={{ color: "rgba(168,165,192,0.5)" }}
          >
            {manifest.teaserDescription}
          </p>

          <div className="flex-1" />
          <div className="divider-gold" />

          <div className="flex items-center justify-between">
            <DifficultyDots level={manifest.difficulty} />
            <div className="flex items-center gap-3">
              <span
                className="label-caps"
                style={{ color: "rgba(92,90,120,0.6)", fontSize: "9px" }}
              >
                {manifest.clueCount} clues
              </span>
              <span
                className="label-caps"
                style={{ color: "rgba(92,90,120,0.6)", fontSize: "9px" }}
              >
                {manifest.estimatedMinutes} min
              </span>
            </div>
          </div>

          <Link
            href={`/cases/${manifest.id}`}
            className="btn-gold w-full text-center block"
            style={{ padding: "12px 24px" }}
          >
            Begin Investigation
          </Link>
        </div>
      </div>
    );
  }

  // ── Legacy flat-props rendering (landing page, etc.) ──────────────────────
  const inProgress = !!progress && progress.cluesFound > 0 && !progress.isComplete;
  const isComplete = !!progress?.isComplete;
  const progressPercent =
    progress && progress.totalClues > 0
      ? Math.round((progress.cluesFound / progress.totalClues) * 100)
      : 0;

  const ctaLabel = isLocked
    ? "Restricted"
    : isComplete
    ? "Review Case File"
    : inProgress
    ? "Continue Investigation"
    : "Begin Investigation";

  return (
    <div
      className={cn(
        "card relative flex flex-col overflow-hidden",
        !isLocked && "card-hover cursor-pointer",
        isLocked && "opacity-55",
        className
      )}
    >
      {isLocked && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl"
          style={{ background: "rgba(7,7,14,0.45)" }}
        >
          <div className="text-center">
            <div
              className="w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(160deg,#181828,#111120)",
                border: "1px solid rgba(42,42,69,0.8)",
              }}
            >
              <LockIcon />
            </div>
            <p className="label-caps text-shadow">Restricted Archive</p>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 p-6 gap-4">
        <div className="flex items-center justify-between">
          <span
            className="label-caps"
            style={{ color: "rgba(92,90,120,0.75)", fontSize: "9px" }}
          >
            {CATEGORY_LABELS[category]}
          </span>
          <div className="flex items-center gap-2">
            {isNew && !isComplete && (
              <span
                className="label-caps px-2 py-0.5 rounded-full border text-[9px]"
                style={{
                  color: "rgba(201,168,76,0.9)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  background: "rgba(201,168,76,0.06)",
                }}
              >
                Now Available
              </span>
            )}
            {isComplete && (
              <span
                className={cn(
                  "label-caps px-2 py-0.5 rounded-full border text-[9px]"
                )}
                style={
                  progress?.isCorrect
                    ? {
                        color: "rgba(201,168,76,0.9)",
                        border: "1px solid rgba(201,168,76,0.3)",
                        background: "rgba(201,168,76,0.06)",
                      }
                    : {
                        color: "rgba(139,34,50,0.9)",
                        border: "1px solid rgba(139,34,50,0.3)",
                        background: "rgba(139,34,50,0.06)",
                      }
                }
              >
                {progress?.isCorrect ? "Case Closed" : "Unsolved"}
              </span>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-serif text-[1.7rem] leading-tight text-parchment mb-2">
            {title}
          </h3>
          <p
            className="font-serif italic text-base leading-snug"
            style={{ color: "rgba(168,165,192,0.8)" }}
          >
            {subtitle}
          </p>
        </div>

        {setting && (
          <p
            className="label-caps -mt-1"
            style={{ color: "rgba(92,90,120,0.7)", fontSize: "9px" }}
          >
            {setting}
          </p>
        )}

        <div className="flex-1" />
        <div className="divider-gold" />

        <div className="flex items-center justify-between">
          <DifficultyDots level={difficulty} />
          {clueCount > 0 && (
            <span
              className="label-caps"
              style={{ color: "rgba(92,90,120,0.6)", fontSize: "9px" }}
            >
              {clueCount} clues
            </span>
          )}
        </div>

        {inProgress && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span
                className="label-caps"
                style={{ color: "rgba(92,90,120,0.7)", fontSize: "9px" }}
              >
                Investigation
              </span>
              <span
                className="label-caps"
                style={{ color: "rgba(168,165,192,0.7)", fontSize: "9px" }}
              >
                {progressPercent}%
              </span>
            </div>
            <div
              className="h-px rounded-full overflow-hidden"
              style={{ background: "rgba(42,42,69,0.6)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progressPercent}%`,
                  background: "rgba(201,168,76,0.7)",
                  boxShadow: "0 0 6px rgba(201,168,76,0.3)",
                }}
              />
            </div>
          </div>
        )}

        {isLocked ? (
          <div
            className="w-full py-3 rounded-xl label-caps text-center select-none"
            style={{
              border: "1px solid rgba(42,42,69,0.6)",
              color: "rgba(42,42,69,0.7)",
              background: "rgba(7,7,14,0.3)",
              fontSize: "9px",
              letterSpacing: "0.2em",
            }}
          >
            Restricted
          </div>
        ) : (
          <Link
            href={`/cases/${id}`}
            className={cn(
              "w-full py-3 rounded-xl label-caps text-center block transition-all duration-300",
              isComplete ? "hover:text-mist" : "btn-gold"
            )}
            style={
              isComplete
                ? {
                    border: "1px solid rgba(42,42,69,0.8)",
                    color: "rgba(92,90,120,0.7)",
                    background: "rgba(7,7,14,0.3)",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    padding: "12px 24px",
                    display: "block",
                    textAlign: "center",
                    borderRadius: "12px",
                  }
                : { padding: "12px 24px" }
            }
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Lock Icon ────────────────────────────────────────────────────────────────

function LockIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={style}
    >
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="#5c5a78" strokeWidth="1.25" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="#5c5a78" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}
