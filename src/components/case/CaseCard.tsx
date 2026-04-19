import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CaseSummary, CaseCategory, Difficulty } from "@/types";

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

const CATEGORY_LABELS: Record<CaseCategory, string> = {
  "country-house": "Country House",
  noir: "Noir",
  "cold-case": "Cold Case",
  psychological: "Psychological",
  "locked-room": "Locked Room",
  conspiracy: "Conspiracy",
};

const CATEGORY_BG: Record<CaseCategory, string> = {
  "country-house": "linear-gradient(135deg, #1a0e06 0%, #2e1a08 40%, #150c04 100%)",
  "noir":          "linear-gradient(135deg, #060814 0%, #0d1a2e 40%, #040810 100%)",
  "cold-case":     "linear-gradient(135deg, #060c12 0%, #0d1e2e 40%, #040a10 100%)",
  "psychological": "linear-gradient(135deg, #120612 0%, #2e0e2e 40%, #0d040d 100%)",
  "locked-room":   "linear-gradient(135deg, #080808 0%, #181818 40%, #0a0a0a 100%)",
  "conspiracy":    "linear-gradient(135deg, #061206 0%, #0e2e0e 40%, #040d04 100%)",
};

function DifficultyDots({ level }: { level: Difficulty }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Difficulty: ${level} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
          style={{ backgroundColor: i < level ? "#E50914" : "rgba(255,255,255,0.15)" }}
        />
      ))}
    </div>
  );
}

export function CaseCard({
  id, title, subtitle, category, difficulty, estimatedMinutes,
  setting, isNew, suspectCount = 0, clueCount = 0,
  progress, isLocked = false, season2Unlocked = false, className,
}: CaseCardProps) {
  const inProgress = !!progress && progress.cluesFound > 0 && !progress.isComplete;
  const isComplete = !!progress?.isComplete;
  const unlockedPreview = isLocked && season2Unlocked;

  const ctaLabel = isLocked && !unlockedPreview
    ? "Restricted"
    : unlockedPreview ? "Coming Soon"
    : isComplete ? "Reopen Case"
    : inProgress ? "Continue"
    : "Investigate";

  const progressPercent = progress && progress.totalClues > 0
    ? Math.round((progress.cluesFound / progress.totalClues) * 100) : 0;

  const imageSeed = id.replace(/-/g, "");
  const imageUrl = `https://picsum.photos/seed/${imageSeed}/700/420?grayscale`;
  const bgGradient = CATEGORY_BG[category];

  return (
    <div
      className={cn(
        "card-cinema group relative flex flex-col",
        isLocked && !unlockedPreview && "opacity-75",
        className
      )}
    >
      {/* ── Image panel — 16:9 ── */}
      <div className="relative overflow-hidden shrink-0" style={{ aspectRatio: "16/9" }}>
        <div
          className="absolute inset-0"
          style={{ background: bgGradient }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.06] mix-blend-overlay opacity-40"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        {/* Bottom gradient */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,26,26,1) 0%, rgba(26,26,26,0.3) 40%, transparent 70%)" }} />

        {/* Top badges */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="text-[0.62rem] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-[2px]"
            style={{ background: "rgba(229,9,20,0.85)", color: "#ffffff" }}
          >
            {CATEGORY_LABELS[category]}
          </span>
        </div>
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          {isNew && !isComplete && !unlockedPreview && (
            <span className="text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-[2px]" style={{ background: "rgba(20,20,20,0.85)", color: "#e5e5e5", border: "1px solid rgba(255,255,255,0.2)" }}>NEW</span>
          )}
          {unlockedPreview && (
            <span className="text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-[2px]" style={{ background: "rgba(20,20,20,0.85)", color: "#aaaaaa", border: "1px solid rgba(255,255,255,0.15)" }}>S2</span>
          )}
          {isComplete && (
            <span className="text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-[2px]" style={progress?.isCorrect ? { background: "rgba(30,180,60,0.2)", color: "#4cdd8a", border: "1px solid rgba(76,221,138,0.3)" } : { background: "rgba(229,9,20,0.15)", color: "#E50914", border: "1px solid rgba(229,9,20,0.3)" }}>
              {progress?.isCorrect ? "✓ SOLVED" : "✗ FAILED"}
            </span>
          )}
        </div>

        {/* Locked overlay */}
        {isLocked && !unlockedPreview && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>
            <div className="text-2xl mb-2 opacity-40">🔒</div>
            <p className="text-[0.65rem] font-bold tracking-[0.15em] uppercase" style={{ color: "#666" }}>CLASSIFIED</p>
            <p className="text-[0.6rem] font-medium tracking-[0.1em] uppercase mt-1" style={{ color: "#444" }}>Season 2</p>
          </div>
        )}

        {/* Progress bar on image bottom */}
        {inProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div className="h-full transition-all duration-700" style={{ width: `${progressPercent}%`, background: "#E50914" }} />
          </div>
        )}
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 px-4 pt-3 pb-4 gap-3">
        {/* Title + subtitle */}
        <div>
          <h3 className="font-bold text-white leading-tight mb-1 transition-colors duration-200 group-hover:text-[#e5e5e5]" style={{ fontSize: "clamp(1rem, 2.5vw, 1.1rem)" }}>
            {title}
          </h3>
          <p className="text-sm leading-snug" style={{ color: "#aaaaaa" }}>{subtitle}</p>
        </div>

        {setting && (
          <p className="text-[0.68rem] font-medium tracking-[0.08em] uppercase" style={{ color: "#666" }}>{setting}</p>
        )}

        <div className="flex-1" />

        {/* Meta row */}
        <div className="flex items-center justify-between">
          <DifficultyDots level={difficulty} />
          <div className="flex items-center gap-2">
            <span className="text-[0.7rem]" style={{ color: "#666" }}>{estimatedMinutes}m</span>
            {clueCount > 0 && <>
              <span className="w-px h-3 inline-block" style={{ background: "rgba(255,255,255,0.1)" }} />
              <span className="text-[0.7rem]" style={{ color: "#666" }}>{clueCount} clues</span>
            </>}
            {suspectCount > 0 && <>
              <span className="w-px h-3 inline-block" style={{ background: "rgba(255,255,255,0.1)" }} />
              <span className="text-[0.7rem]" style={{ color: "#666" }}>{suspectCount} suspects</span>
            </>}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* CTA */}
        {isLocked && !unlockedPreview ? (
          <div className="w-full py-2.5 text-center select-none rounded" style={{ border: "1px dashed rgba(255,255,255,0.08)", color: "#444" }}>
            <span className="text-[0.72rem] font-semibold tracking-[0.08em] uppercase">Restricted Access</span>
          </div>
        ) : unlockedPreview ? (
          <div className="w-full py-2.5 text-center select-none rounded" style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#666" }}>
            <span className="text-[0.72rem] font-semibold tracking-[0.08em] uppercase">Coming Soon</span>
          </div>
        ) : (
          <Link
            href={`/cases/${id}`}
            className="w-full py-3 text-center block rounded font-bold text-sm transition-all duration-150"
            style={
              isComplete
                ? { border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#aaaaaa" }
                : inProgress
                ? { background: "rgba(229,9,20,0.15)", color: "#E50914", border: "1px solid rgba(229,9,20,0.25)" }
                : { background: "#ffffff", color: "#000000" }
            }
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              if (!isComplete && !inProgress) el.style.background = "rgba(255,255,255,0.88)";
              else if (inProgress) el.style.background = "rgba(229,9,20,0.25)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              if (!isComplete && !inProgress) el.style.background = "#ffffff";
              else if (inProgress) el.style.background = "rgba(229,9,20,0.15)";
            }}
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    