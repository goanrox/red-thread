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
  setting?: string;
  suspectCount?: number;
  clueCount?: number;
  className?: string;
  manifest?: CaseManifest;
  isLocked?: boolean;
  isSeasonLocked?: boolean;
  progress?: CaseCardProgress;
  unlockInfo?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

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

// Tag color semantics — each maps to one of our token-based status colors
const TAG_VARIANT: Record<VisualTag, "default" | "danger" | "accent" | "info" | "muted"> = {
  Classified:            "danger",
  "Season Locked":       "muted",
  "Requires Clearance":  "danger",
  "High Profile":        "accent",
  "Cold Case":           "info",
  Restricted:            "danger",
  "Under Review":        "muted",
  "Active Investigation":"accent",
  "Case Closed":         "muted",
};

// ─── Shared sub-components ────────────────────────────────────────────────────

function VisualTagBadge({ tag }: { tag: VisualTag }) {
  const v = TAG_VARIANT[tag] ?? "default";
  return (
    <span
      className={cn(
        "badge",
        v === "accent" && "badge-accent",
        v === "danger" && "badge-danger",
        v === "info"   && "badge-muted",
        v === "muted"  && "badge-muted",
      )}
    >
      {tag}
    </span>
  );
}

function DifficultyDots({ level }: { level: Difficulty }) {
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`Difficulty: ${DIFFICULTY_LABELS[level]}`}
      title={DIFFICULTY_LABELS[level]}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: i < level
              ? "var(--color-accent)"
              : "var(--color-surface-3)",
          }}
        />
      ))}
      <span
        className="ml-1 text-eyebrow"
        style={{ fontSize: "12px", textTransform: "none", letterSpacing: 0 }}
      >
        {DIFFICULTY_LABELS[level]}
      </span>
    </div>
  );
}

function RedactedBar({ width = "70%" }: { width?: string }) {
  return (
    <span
      aria-hidden
      className="inline-block rounded-sm align-middle"
      style={{
        width,
        height: "10px",
        background: "var(--color-surface-3)",
        display: "inline-block",
        verticalAlign: "middle",
      }}
    />
  );
}

function TeaserSuspectRow({ suspect }: { suspect: TeaserSuspect }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <span
        className="text-meta shrink-0 w-6"
        style={{ color: "var(--color-text-tertiary)", fontVariantNumeric: "tabular-nums" }}
      >
        {suspect.isRedacted ? "??" : suspect.initials}
      </span>
      <span
        className="w-px h-3 shrink-0"
        style={{ background: "var(--color-border)" }}
      />
      {suspect.isRedacted ? (
        <span className="flex items-center gap-2">
          <RedactedBar width="56px" />
          <span className="text-meta" style={{ color: "var(--color-text-quaternary)" }}>
            {suspect.role}
          </span>
        </span>
      ) : (
        <span className="text-meta" style={{ color: "var(--color-text-secondary)" }}>
          {suspect.role}
        </span>
      )}
    </div>
  );
}

function TeaserEvidenceRow({ evidence }: { evidence: TeaserEvidence }) {
  const dotColor: Record<string, string> = {
    physical:    "var(--color-accent)",
    document:    "var(--color-iris)",
    forensic:    "var(--color-danger)",
    testimony:   "var(--color-text-tertiary)",
    observation: "var(--color-text-quaternary)",
  };
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: dotColor[evidence.type] ?? "var(--color-border)" }}
      />
      {evidence.isRedacted ? (
        <span className="flex items-center gap-2">
          <RedactedBar width="72px" />
          <span className="text-meta" style={{ color: "var(--color-text-quaternary)" }}>
            {evidence.label}
          </span>
        </span>
      ) : (
        <span className="text-meta" style={{ color: "var(--color-text-secondary)" }}>
          {evidence.label}
        </span>
      )}
    </div>
  );
}

function ProgressBar({
  value,
  max,
  label,
  current,
  color = "var(--color-accent)",
}: {
  value: number;
  max: number;
  label: string;
  current: string;
  color?: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-meta" style={{ color: "var(--color-text-tertiary)" }}>
          {label}
        </span>
        <span className="text-meta" style={{ color: "var(--color-text-secondary)" }}>
          {current}
        </span>
      </div>
      <div
        className="h-[3px] w-full rounded-full overflow-hidden"
        style={{ background: "var(--color-surface-3)" }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ─── Card: Active investigation ───────────────────────────────────────────────

function ActiveCard({
  manifest,
  progress,
  className,
}: {
  manifest: CaseManifest;
  progress?: CaseCardProgress;
  className?: string;
}) {
  return (
    <div
      className={cn("surface flex flex-col overflow-hidden", className)}
      style={{ borderColor: "var(--color-accent-ring)" }}
    >
      {/* Accent top rule */}
      <div
        aria-hidden
        className="h-[2px] w-full shrink-0"
        style={{ background: "var(--color-accent)" }}
      />

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Status row */}
        <div className="flex items-center justify-between">
          <span className="badge badge-accent badge-dot">Active</span>
          <span className="text-eyebrow">{CATEGORY_LABELS[manifest.category]}</span>
        </div>

        {/* Title */}
        <div>
          <h3
            className="font-serif leading-tight text-[color:var(--color-text)] mb-1"
            style={{ fontSize: "var(--fz-title-sm)" }}
          >
            {manifest.title}
          </h3>
          <p className="text-meta" style={{ color: "var(--color-text-secondary)" }}>
            {manifest.subtitle}
          </p>
        </div>

        <p className="text-eyebrow">{manifest.location}</p>

        <div className="flex-1" />
        <div className="divider" />

        {/* Progress */}
        {progress && (
          <div className="flex flex-col gap-3">
            <ProgressBar
              label="Evidence"
              value={progress.cluesFound}
              max={progress.totalClues}
              current={`${progress.cluesFound} / ${progress.totalClues}`}
            />
            {(progress.totalSuspects ?? 0) > 0 && (
              <ProgressBar
                label="Suspects"
                value={progress.suspectsInterviewed ?? 0}
                max={progress.totalSuspects!}
                current={`${progress.suspectsInterviewed ?? 0} / ${progress.totalSuspects}`}
                color="var(--color-iris)"
              />
            )}
          </div>
        )}

        <Link href={`/cases/${manifest.id}`} className="btn btn-primary w-full justify-center">
          Continue Investigation
        </Link>
      </div>
    </div>
  );
}

// ─── Card: Solved ─────────────────────────────────────────────────────────────

function SolvedCard({
  manifest,
  progress,
  className,
}: {
  manifest: CaseManifest;
  progress?: CaseCardProgress;
  className?: string;
}) {
  const isCorrect = progress?.isCorrect;
  const isPerfect = progress?.perfectDeduction;

  return (
    <div
      className={cn("surface flex flex-col overflow-hidden", className)}
      style={{ opacity: 0.75 }}
    >
      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Status row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span
            className={cn("badge", isCorrect ? "badge-muted" : "badge-danger")}
          >
            {isCorrect ? "Closed" : "Unsolved"}
          </span>
          <div className="flex items-center gap-2">
            {isPerfect && <span className="badge badge-accent">Perfect Deduction</span>}
            <span className="text-eyebrow">{CATEGORY_LABELS[manifest.category]}</span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h3
            className="font-serif leading-tight text-[color:var(--color-text)] mb-1"
            style={{ fontSize: "var(--fz-title-sm)" }}
          >
            {manifest.title}
          </h3>
          <p className="text-meta" style={{ color: "var(--color-text-tertiary)" }}>
            {manifest.subtitle}
          </p>
        </div>

        <p className="text-eyebrow">{manifest.location}</p>
        <div className="flex-1" />
        <div className="divider" />

        {/* Score */}
        {progress?.score !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-meta" style={{ color: "var(--color-text-tertiary)" }}>
              Archive Score
            </span>
            <span
              className="text-meta font-medium"
              style={{ color: isCorrect ? "var(--color-accent)" : "var(--color-danger)" }}
            >
              {progress.score} pts
            </span>
          </div>
        )}

        <Link
          href={`/cases/${manifest.id}`}
          className="btn btn-secondary w-full justify-center"
        >
          Review Case File
        </Link>
      </div>
    </div>
  );
}

// ─── Card: Locked (previous case required) ────────────────────────────────────

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
      className={cn("surface flex flex-col overflow-hidden", className)}
      aria-label={`${manifest.title} — locked`}
    >
      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Tags */}
        {manifest.visualTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {manifest.visualTags.slice(0, 2).map((tag) => (
              <VisualTagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Title */}
        <div>
          <h3
            className="font-serif leading-tight text-[color:var(--color-text)] mb-1"
            style={{ fontSize: "var(--fz-title-sm)" }}
          >
            {manifest.title}
          </h3>
          <p className="text-meta" style={{ color: "var(--color-text-secondary)" }}>
            {manifest.subtitle}
          </p>
        </div>

        <p className="text-eyebrow">{manifest.location}</p>

        {/* Teaser description */}
        <p
          className="text-meta leading-relaxed border-l-2 pl-3"
          style={{
            color: "var(--color-text-secondary)",
            borderColor: "var(--color-border)",
          }}
        >
          {manifest.teaserDescription}
        </p>

        {/* Suspects teaser */}
        <div>
          <p className="text-eyebrow mb-2" style={{ marginBottom: "6px" }}>
            Persons of Interest
          </p>
          <div
            className="rounded-[var(--radius)] px-3 py-1"
            style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
          >
            {manifest.teaserSuspects.slice(0, 4).map((s, i) => (
              <TeaserSuspectRow key={i} suspect={s} />
            ))}
            {manifest.teaserSuspects.length > 4 && (
              <p
                className="text-meta py-1"
                style={{ color: "var(--color-text-quaternary)" }}
              >
                +{manifest.teaserSuspects.length - 4} additional subjects — access restricted
              </p>
            )}
          </div>
        </div>

        {/* Evidence teaser */}
        <div>
          <p className="text-eyebrow" style={{ marginBottom: "6px" }}>
            Evidence Log
          </p>
          <div
            className="rounded-[var(--radius)] px-3 py-1"
            style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
          >
            {manifest.teaserEvidence.slice(0, 3).map((e, i) => (
              <TeaserEvidenceRow key={i} evidence={e} />
            ))}
          </div>
        </div>

        <div className="flex-1" />
        <div className="divider" />

        {/* Meta row */}
        <div className="flex items-center justify-between">
          <DifficultyDots level={manifest.difficulty} />
          <span className="text-meta" style={{ color: "var(--color-text-tertiary)" }}>
            {manifest.estimatedMinutes} min
          </span>
        </div>

        {/* Unlock info */}
        {unlockInfo && (
          <div
            className="flex items-center gap-2 rounded-[var(--radius)] px-3 py-2.5"
            style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
          >
            <LockIcon />
            <span className="text-meta" style={{ color: "var(--color-text-secondary)" }}>
              {unlockInfo}
            </span>
          </div>
        )}

        <div
          className="btn btn-disabled w-full justify-center"
          aria-disabled="true"
          role="button"
        >
          <LockIcon />
          Access Restricted
        </div>
      </div>
    </div>
  );
}

// ─── Card: Season locked ──────────────────────────────────────────────────────

export function SeasonLockedCard({
  seasonNumber,
  className,
}: {
  seasonNumber: 2 | 3;
  className?: string;
}) {
  const season = SEASONS.find((s) => s.number === seasonNumber);
  const prevSeason = SEASONS.find((s) => s.number === (seasonNumber - 1));
  if (!season) return null;

  return (
    <div
      className={cn("surface overflow-hidden", className)}
      aria-label={`${season.subtitle} — locked`}
    >
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-eyebrow">{season.subtitle}</p>
            <span className="badge badge-muted">Season Locked</span>
          </div>
          <h2
            className="font-serif leading-tight text-[color:var(--color-text-tertiary)] mb-2"
            style={{ fontSize: "clamp(24px, 3.5vw, 36px)" }}
          >
            {season.title}
          </h2>
          <p
            className="font-serif italic"
            style={{ color: "var(--color-text-quaternary)", fontSize: "var(--fz-body)" }}
          >
            &ldquo;{season.crypticHint}&rdquo;
          </p>
        </div>

        {/* Unlock requirement */}
        <div
          className="rounded-[var(--radius-lg)] px-5 py-4 text-center"
          style={{
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            minWidth: "200px",
          }}
        >
          <LockIcon style={{ margin: "0 auto 10px" }} />
          <p className="text-meta" style={{ color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            Complete{" "}
            <strong style={{ color: "var(--color-text)", fontWeight: 500 }}>
              {prevSeason ? prevSeason.subtitle : "all previous cases"}
            </strong>
            {" "}to access this archive
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main CaseCard ─────────────────────────────────────────────────────────────

export function CaseCard({
  id,
  title,
  subtitle,
  category,
  difficulty,
  estimatedMinutes,
  setting,
  isNew,
  suspectCount = 0,
  clueCount = 0,
  manifest,
  isLocked = false,
  progress,
  unlockInfo,
  className,
}: CaseCardProps) {
  // Rich manifest-based rendering (archive page)
  if (manifest) {
    const inProgress = !!progress && progress.cluesFound > 0 && !progress.isComplete;
    const isComplete = !!progress?.isComplete;

    if (isComplete) return <SolvedCard manifest={manifest} progress={progress} className={className} />;
    if (inProgress) return <ActiveCard manifest={manifest} progress={progress} className={className} />;
    if (isLocked)   return <LockedCard manifest={manifest} unlockInfo={unlockInfo} className={className} />;

    // Unlocked, not started
    return (
      <Link
        href={`/cases/${manifest.id}`}
        className={cn(
          "surface flex flex-col overflow-hidden transition-[background,border-color] duration-150",
          "hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-surface-2)]",
          className
        )}
      >
        <div className="flex flex-col flex-1 p-5 gap-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <span className="text-eyebrow">{CATEGORY_LABELS[manifest.category]}</span>
            <div className="flex flex-wrap gap-1.5 justify-end">
              {manifest.isNew && <span className="badge badge-accent">New</span>}
              {manifest.visualTags
                .filter((t) => t !== "Season Locked")
                .slice(0, 1)
                .map((t) => <VisualTagBadge key={t} tag={t} />)}
            </div>
          </div>

          {/* Title */}
          <div>
            <h3
              className="font-serif leading-tight text-[color:var(--color-text)] mb-1"
              style={{ fontSize: "var(--fz-title-sm)" }}
            >
              {manifest.title}
            </h3>
            <p className="text-meta" style={{ color: "var(--color-text-secondary)" }}>
              {manifest.subtitle}
            </p>
          </div>

          <p className="text-eyebrow">{manifest.location}</p>

          <p
            className="text-meta leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {manifest.teaserDescription}
          </p>

          <div className="flex-1" />
          <div className="divider" />

          {/* Footer */}
          <div className="flex items-center justify-between">
            <DifficultyDots level={manifest.difficulty} />
            <div className="flex items-center gap-3">
              <span className="text-meta" style={{ color: "var(--color-text-tertiary)" }}>
                {manifest.clueCount} clues
              </span>
              <span
                className="w-px h-3"
                style={{ background: "var(--color-border)" }}
              />
              <span className="text-meta" style={{ color: "var(--color-text-tertiary)" }}>
                {manifest.estimatedMinutes} min
              </span>
            </div>
          </div>

          <span className="btn btn-primary w-full justify-center">
            Begin Investigation
          </span>
        </div>
      </Link>
    );
  }

  // ── Legacy flat-props rendering ───────────────────────────────────────────
  const inProgress = !!progress && progress.cluesFound > 0 && !progress.isComplete;
  const isComplete = !!progress?.isComplete;
  const pct = progress && progress.totalClues > 0
    ? Math.round((progress.cluesFound / progress.totalClues) * 100)
    : 0;
  const ctaLabel = isLocked
    ? "Restricted"
    : isComplete ? "Review Case File"
    : inProgress ? "Continue Investigation"
    : "Begin Investigation";

  return (
    <div
      className={cn(
        "surface relative flex flex-col overflow-hidden",
        !isLocked && "transition-[background,border-color] duration-150 hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-surface-2)]",
        isLocked && "opacity-50",
        className
      )}
    >
      {isLocked && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-[var(--radius-lg)]"
          style={{ background: "rgba(10,10,12,0.6)" }}
        >
          <div className="text-center px-4">
            <LockIcon style={{ margin: "0 auto 8px" }} />
            <p className="text-meta" style={{ color: "var(--color-text-secondary)" }}>
              Restricted Archive
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-eyebrow">{CATEGORY_LABELS[category]}</span>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {isNew && !isComplete && <span className="badge badge-accent">New</span>}
            {isComplete && (
              <span className={cn("badge", progress?.isCorrect ? "badge-muted" : "badge-danger")}>
                {progress?.isCorrect ? "Closed" : "Unsolved"}
              </span>
            )}
          </div>
        </div>

        <div>
          <h3
            className="font-serif leading-tight text-[color:var(--color-text)] mb-1"
            style={{ fontSize: "var(--fz-title-sm)" }}
          >
            {title}
          </h3>
          <p className="text-meta" style={{ color: "var(--color-text-secondary)" }}>
            {subtitle}
          </p>
        </div>

        {setting && <p className="text-eyebrow">{setting}</p>}

        <div className="flex-1" />
        <div className="divider" />

        <div className="flex items-center justify-between">
          <DifficultyDots level={difficulty} />
          {clueCount > 0 && (
            <span className="text-meta" style={{ color: "var(--color-text-tertiary)" }}>
              {clueCount} clues
            </span>
          )}
        </div>

        {inProgress && (
          <ProgressBar
            label="Investigation"
            value={pct}
            max={100}
            current={`${pct}%`}
          />
        )}

        {isLocked ? (
          <div
            className="btn btn-disabled w-full justify-center"
            aria-disabled="true"
            role="button"
          >
            <LockIcon />
            Restricted
          </div>
        ) : (
          <Link
            href={`/cases/${id}`}
            className={cn(
              "btn w-full justify-center",
              isComplete ? "btn-secondary" : "btn-primary"
            )}
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
      <rect
        x="3" y="7" width="10" height="7" rx="1.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M5 7V5a3 3 0 0 1 6 0v2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
