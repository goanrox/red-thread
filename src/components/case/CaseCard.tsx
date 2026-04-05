import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CaseSummary, CaseCategory, Difficulty } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CaseCardProgress {
  cluesFound: number;
  totalClues: number;
  isComplete: boolean;
  isCorrect?: boolean;
}

export interface CaseCardProps extends CaseSummary {
  setting?: string;
  suspectCount?: number;
  clueCount?: number;
  progress?: CaseCardProgress;
  isLocked?: boolean;
  season2Unlocked?: boolean;
  className?: string;
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

function DifficultyDots({ level }: { level: Difficulty }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Difficulty: ${level} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "w-1.5 h-1.5 rounded-full transition-colors duration-200",
            i < level ? "bg-gold" : "bg-[#2a2a45]"
          )}
        />
      ))}
    </div>
  );
}

// Avatar colors cycle through surface tones, giving subtle visual variety
const AVATAR_STYLES = [
  { bg: "#1f1f35", text: "#a8a5c0" },
  { bg: "#181828", text: "#5c5a78" },
  { bg: "#2a2a45", text: "#a8a5c0" },
  { bg: "#111120", text: "#5c5a78" },
  { bg: "#1f1f35", text: "#a8a5c0" },
  { bg: "#2a2a45", text: "#5c5a78" },
];

function SuspectAvatarStack({ count }: { count: number }) {
  const visible = Math.min(count, 6);
  return (
    <div className="flex items-center">
      {Array.from({ length: visible }, (_, i) => {
        const style = AVATAR_STYLES[i % AVATAR_STYLES.length];
        return (
          <div
            key={i}
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center",
              "border-2 text-[10px] font-semibold font-sans",
              i > 0 && "-ml-2"
            )}
            style={{
              backgroundColor: style.bg,
              borderColor: "#0c0c17",
              color: style.text,
              zIndex: visible - i,
            }}
          >
            {i + 1}
          </div>
        );
      })}
      {count > 6 && (
        <span className="label-caps text-shadow ml-2">+{count - 6}</span>
      )}
    </div>
  );
}

// ─── CaseCard ─────────────────────────────────────────────────────────────────

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
  progress,
  isLocked = false,
  season2Unlocked = false,
  className,
}: CaseCardProps) {
  const inProgress = !!progress && progress.cluesFound > 0 && !progress.isComplete;
  const isComplete = !!progress?.isComplete;
  // A locked case that's been unlocked: show preview card but no playable link
  const unlockedPreview = isLocked && season2Unlocked;

  const ctaLabel = isLocked && !unlockedPreview
    ? "Coming Season 2"
    : unlockedPreview
    ? "Coming Soon — Stay Tuned"
    : isComplete
    ? "Play Again"
    : inProgress
    ? "Continue Investigation"
    : "Begin Investigation";

  const progressPercent =
    progress && progress.totalClues > 0
      ? Math.round((progress.cluesFound / progress.totalClues) * 100)
      : 0;

  return (
    <div
      className={cn(
        "relative flex flex-col bg-surface rounded-2xl overflow-hidden border",
        !isLocked && "card-hover cursor-pointer border-[#2a2a45]",
        isLocked && !unlockedPreview && "opacity-70 border-[#2a2a45]",
        unlockedPreview && "border-gold/20",
        className
      )}
    >
      {/* Lock overlay — only when locked AND not unlocked yet */}
      {isLocked && !unlockedPreview && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-void/50 backdrop-blur-[2px] rounded-2xl">
          <div className="text-center">
            <div
              className="w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center border border-[#2a2a45]"
              style={{ backgroundColor: "#111120" }}
            >
              <LockIcon />
            </div>
            <p className="label-caps text-mist">Coming in Season 2</p>
          </div>
        </div>
      )}

      {/* Card content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Top row: category + status badges */}
        <div className="flex items-center justify-between">
          <span className="label-caps text-shadow">{CATEGORY_LABELS[category]}</span>
          <div className="flex items-center gap-2">
            {unlockedPreview && (
              <span className="label-caps text-gold border border-gold/30 bg-gold/10 px-2 py-0.5 rounded-full text-[10px]">
                Season 2
              </span>
            )}
            {isNew && !isComplete && !unlockedPreview && (
              <span className="label-caps text-gold border border-gold/30 bg-gold/10 px-2 py-0.5 rounded-full text-[10px]">
                New
              </span>
            )}
            {isComplete && (
              <span
                className={cn(
                  "label-caps px-2 py-0.5 rounded-full border text-[10px]",
                  progress?.isCorrect
                    ? "text-gold border-gold/30 bg-gold/10"
                    : "text-crimson-light border-crimson/30 bg-crimson/10"
                )}
              >
                {progress?.isCorrect ? "Solved" : "Unsolved"}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-serif text-[1.625rem] leading-tight text-parchment mb-1">
            {title}
          </h3>
          <p className="font-serif italic text-mist text-base leading-snug">
            {subtitle}
          </p>
        </div>

        {/* Setting */}
        {setting && (
          <p className="label-caps text-shadow -mt-1">{setting}</p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Divider */}
        <div className="divider-gold" />

        {/* Metadata row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DifficultyDots level={difficulty} />
            <span className="label-caps text-shadow">{estimatedMinutes} min</span>
          </div>
          {clueCount > 0 && (
            <span className="label-caps text-shadow">{clueCount} clues</span>
          )}
        </div>

        {/* Suspect stack */}
        {suspectCount > 0 && (
          <div className="flex items-center justify-between">
            <SuspectAvatarStack count={suspectCount} />
            <span className="label-caps text-shadow">{suspectCount} suspects</span>
          </div>
        )}

        {/* Progress bar */}
        {inProgress && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="label-caps text-shadow">Investigation</span>
              <span className="label-caps text-mist">{progressPercent}%</span>
            </div>
            <div className="h-px bg-[#2a2a45] rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        {isLocked && !unlockedPreview ? (
          <div className="w-full py-3 rounded-xl label-caps text-center text-shadow border border-[#2a2a45] select-none">
            Coming Season 2
          </div>
        ) : unlockedPreview ? (
          <div className="w-full py-3 rounded-xl label-caps text-center text-gold/70 border border-gold/20 select-none">
            Coming Soon — Stay Tuned
          </div>
        ) : (
          <Link
            href={`/cases/${id}`}
            className={cn(
              "w-full py-3 rounded-xl label-caps text-center block transition-colors duration-200",
              isComplete
                ? "border border-[#2a2a45] text-mist hover:border-gold/50 hover:text-gold"
                : "border border-gold/40 text-gold hover:bg-gold hover:text-void hover:border-gold"
            )}
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Lock Icon (inline SVG, no library) ──────────────────────────────────────

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="7"
        width="10"
        height="7"
        rx="1.5"
        stroke="#5c5a78"
        strokeWidth="1.25"
      />
      <path
        d="M5 7V5a3 3 0 0 1 6 0v2"
        stroke="#5c5a78"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
