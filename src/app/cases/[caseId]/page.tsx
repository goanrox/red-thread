"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, FileText, Clock, PenLine, Users,
  Lock, CheckCircle2, XCircle, MapPin, Skull,
} from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { getCaseById } from "@/data";
import { caseProgress, suspicionLevel, availableQuestions } from "@/lib/caseEngine";
import { cn } from "@/lib/utils";
import type { Clue, Scene, Suspect, TimelineEvent } from "@/types";

// ─── Tab config ───────────────────────────────────────────────────────────────

type Tab = "overview" | "suspects" | "evidence" | "timeline" | "notes";

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", Icon: Eye },
  { id: "suspects", label: "Suspects", Icon: Users },
  { id: "evidence", label: "Evidence", Icon: FileText },
  { id: "timeline", label: "Timeline", Icon: Clock },
  { id: "notes", label: "Notes", Icon: PenLine },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InvestigationHub({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = use(params);
  const router = useRouter();

  const caseData = getCaseById(caseId);
  const gameState = useGameStore((s) => s.cases[caseId]);
  const { startCase, discoverClue, visitScene, markBriefingShown, updateNotes } =
    useGameStore();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showBriefing, setShowBriefing] = useState(false);
  const [sceneModal, setSceneModal] = useState<Scene | null>(null);

  // Start case + briefing on mount
  useEffect(() => {
    if (!caseData) return;
    startCase(caseId);
  }, [caseId, caseData, startCase]);

  useEffect(() => {
    if (!gameState) return;
    if (!gameState.briefingShown) {
      setShowBriefing(true);
    }
  }, [gameState?.briefingShown]);

  const dismissBriefing = useCallback(() => {
    setShowBriefing(false);
    markBriefingShown(caseId);
  }, [caseId, markBriefingShown]);

  if (!caseData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-mist font-serif italic">Case not found.</p>
      </div>
    );
  }

  const progress = gameState ? caseProgress(caseData, gameState) : 0;
  const discoveredClues = gameState?.discoveredClueIds ?? [];
  const visitedScenes = gameState?.visitedSceneIds ?? [];

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        {/* Desktop tab bar — sticky */}
        <DesktopTabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {activeTab === "overview" && (
              <OverviewTab
                caseData={caseData}
                caseId={caseId}
                discoveredClues={discoveredClues}
                visitedScenes={visitedScenes}
                progress={progress}
                gameState={gameState}
                onSceneClick={(scene) => {
                  if (!scene.isLocked || discoveredClues.length >= 3) {
                    setSceneModal(scene);
                  }
                }}
              />
            )}
            {activeTab === "suspects" && (
              <SuspectsTab
                caseData={caseData}
                caseId={caseId}
                gameState={gameState}
              />
            )}
            {activeTab === "evidence" && (
              <EvidenceTab
                caseData={caseData}
                caseId={caseId}
                discoveredClues={discoveredClues}
              />
            )}
            {activeTab === "timeline" && (
              <TimelineTab
                caseData={caseData}
                discoveredClues={discoveredClues}
              />
            )}
            {activeTab === "notes" && (
              <NotesTab
                caseId={caseId}
                initialNotes={gameState?.playerNotes ?? ""}
                onSave={(notes) => updateNotes(caseId, notes)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile tab bar (bottom) */}
      <MobileTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Scene modal */}
      <AnimatePresence>
        {sceneModal && (
          <SceneModal
            scene={sceneModal}
            caseId={caseId}
            discoveredClues={discoveredClues}
            onDiscover={(clueId) => discoverClue(caseId, clueId)}
            onMarkComplete={() => {
              visitScene(caseId, sceneModal.id);
              setSceneModal(null);
            }}
            onClose={() => setSceneModal(null)}
          />
        )}
      </AnimatePresence>

      {/* Briefing modal */}
      <AnimatePresence>
        {showBriefing && (
          <BriefingModal
            caseData={caseData}
            onClose={dismissBriefing}
          />
        )}
      </AnimatePresence>

      {/* Accusation CTA banner */}
      {discoveredClues.length >= 3 && !gameState?.isComplete && (
        <div className="fixed bottom-16 sm:bottom-6 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto"
          >
            <Link
              href={`/cases/${caseId}/accuse`}
              className="flex items-center gap-3 px-7 py-3.5 rounded-xl text-parchment font-sans font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #8b2232 0%, #6b1a26 100%)",
                border: "1px solid rgba(193,50,72,0.35)",
                boxShadow: "0 8px 32px rgba(139,34,50,0.45), 0 2px 8px rgba(0,0,0,0.6)",
              }}
            >
              <Skull size={15} className="shrink-0" />
              The evidence is mounting. Make your accusation.
            </Link>
          </motion.div>
        </div>
      )}
    </>
  );
}

// ─── Desktop Tab Bar ──────────────────────────────────────────────────────────

function DesktopTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
}) {
  return (
    <div className="hidden sm:block sticky top-28 z-30 glass border-b border-[#2a2a45] -mx-4 sm:-mx-6 px-4 sm:px-6 mb-2">
      <div className="max-w-6xl mx-auto flex items-center gap-0.5">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex items-center gap-1.5 label-caps px-4 py-3.5 border-b-2 whitespace-nowrap transition-colors duration-200 text-[10px]",
              activeTab === id
                ? "border-gold text-gold"
                : "border-transparent text-shadow hover:text-mist"
            )}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Mobile Tab Bar ───────────────────────────────────────────────────────────

function MobileTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
}) {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-[#2a2a45]">
      <div className="flex items-center justify-around h-14 px-2">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors duration-200",
              activeTab === id ? "text-gold" : "text-shadow"
            )}
          >
            <Icon size={17} />
            <span className="label-caps text-[9px]">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({
  caseData,
  caseId,
  discoveredClues,
  visitedScenes,
  progress,
  gameState,
  onSceneClick,
}: {
  caseData: NonNullable<ReturnType<typeof getCaseById>>;
  caseId: string;
  discoveredClues: string[];
  visitedScenes: string[];
  progress: number;
  gameState: ReturnType<typeof useGameStore.getState>["cases"][string] | undefined;
  onSceneClick: (s: Scene) => void;
}) {
  if (!caseData) return null;

  return (
    <div className="pt-8 space-y-10">
      {/* Victim card */}
      <section>
        <SectionHeader label="The Victim" />
        <div
          className="border border-[#2a2a45] rounded-2xl p-6 flex gap-6 items-start"
          style={{ background: "linear-gradient(135deg, #181828 0%, #111120 60%)" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 border border-crimson/20"
            style={{ background: "radial-gradient(circle, rgba(139,34,50,0.18) 0%, #111120 70%)" }}
          >
            <Skull size={22} className="text-crimson-light/70" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-serif text-2xl text-parchment leading-tight">{caseData.victim.name}</h2>
            <p className="label-caps text-shadow mt-1">{caseData.victim.occupation}</p>
            <p className="text-mist text-sm mt-3 leading-relaxed font-serif italic">
              {caseData.victim.description}
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section>
        <SectionHeader label="Investigation Progress" />
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            value={discoveredClues.length}
            total={caseData.clues.length}
            label="Clues Found"
            color="gold"
          />
          <StatCard
            value={visitedScenes.length}
            total={caseData.scenes.length}
            label="Scenes Explored"
            color="iris"
          />
          <StatCard
            value={gameState?.interrogatedSuspectIds.length ?? 0}
            total={caseData.suspects.length}
            label="Interrogated"
            color="crimson"
          />
        </div>
      </section>

      {/* Scenes */}
      <section>
        <SectionHeader label="Scenes" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {caseData.scenes.map((scene) => {
            const visited = visitedScenes.includes(scene.id);
            const locked = scene.isLocked && discoveredClues.length < 3;
            return (
              <button
                key={scene.id}
                onClick={() => !locked && onSceneClick(scene)}
                className={cn(
                  "text-left card rounded-xl p-5 w-full transition-all duration-300",
                  locked
                    ? "opacity-45 cursor-not-allowed"
                    : "card-hover cursor-pointer"
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className={locked ? "text-shadow" : "text-gold"} />
                    <span className="font-serif text-lg text-parchment">{scene.name}</span>
                  </div>
                  {visited ? (
                    <CheckCircle2 size={14} className="text-gold shrink-0 mt-0.5" />
                  ) : locked ? (
                    <Lock size={14} className="text-shadow shrink-0 mt-0.5" />
                  ) : null}
                </div>
                <p className="text-mist text-sm leading-relaxed line-clamp-2 font-serif italic">
                  {scene.description.split("\n")[0]}
                </p>
                {locked && (
                  <p className="label-caps text-shadow mt-2 text-[10px]">
                    Find {3 - discoveredClues.length} more clue{3 - discoveredClues.length !== 1 ? "s" : ""} to unlock
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Quick suspects grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader label="Suspects" inline />
          <Link
            href={`/cases/${caseId}/interrogate/${caseData.suspects[0]?.id}`}
            className="label-caps text-gold hover:text-gold-light transition-colors duration-200 text-[10px]"
          >
            Begin Interrogations →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {caseData.suspects.map((suspect, i) => {
            const level = gameState
              ? suspicionLevel(suspect.id, caseData, gameState)
              : 0;
            return (
              <Link
                key={suspect.id}
                href={`/cases/${caseId}/interrogate/${suspect.id}`}
                className="flex items-center gap-3 card rounded-xl p-3 card-hover"
              >
                <Avatar index={i} name={suspect.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-parchment text-sm font-serif truncate">{suspect.name}</p>
                  <div className="mt-1 h-1 bg-[#2a2a45] rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        level >= 60 ? "bg-crimson-light" : level >= 30 ? "bg-gold" : "bg-[#5c5a78]"
                      )}
                      style={{ width: `${level}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ─── Suspects Tab ─────────────────────────────────────────────────────────────

function SuspectsTab({
  caseData,
  caseId,
  gameState,
}: {
  caseData: NonNullable<ReturnType<typeof getCaseById>>;
  caseId: string;
  gameState: ReturnType<typeof useGameStore.getState>["cases"][string] | undefined;
}) {
  return (
    <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
      {caseData.suspects.map((suspect, i) => {
        const level = gameState
          ? suspicionLevel(suspect.id, caseData, gameState)
          : 0;
        const asked = gameState?.askedQuestions[suspect.id]?.length ?? 0;
        const available = gameState
          ? availableQuestions(suspect.questions, gameState, suspect.id).length
          : suspect.questions.length;

        return (
          <motion.div
            key={suspect.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="card rounded-2xl p-5 flex flex-col gap-4 card-hover"
          >
            <div className="flex items-start gap-4">
              <Avatar index={i} name={suspect.name} size="lg" />
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-xl text-parchment">{suspect.name}</h3>
                <p className="label-caps text-shadow text-[10px] mt-0.5">{suspect.relation}</p>
                <p className="font-serif italic text-mist text-sm mt-2 leading-relaxed line-clamp-2">
                  {suspect.description}
                </p>
              </div>
            </div>

            {/* Suspicion meter */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="label-caps text-shadow text-[10px]">Suspicion</span>
                <span className={cn("label-caps text-[10px]",
                  level >= 60 ? "text-crimson-light" : level >= 30 ? "text-gold" : "text-shadow"
                )}>{level}%</span>
              </div>
              <div className="h-1.5 bg-[#2a2a45] rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    level >= 60 ? "bg-crimson-light" : level >= 30 ? "bg-gold" : "bg-[#5c5a78]"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${level}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="label-caps text-shadow text-[10px]">
                {asked} asked · {available} available
              </span>
              <Link
                href={`/cases/${caseId}/interrogate/${suspect.id}`}
                className="label-caps text-gold border border-gold/55 hover:bg-gold hover:text-void px-3 py-1.5 rounded-lg text-[10px] transition-colors duration-200"
              >
                Interrogate
              </Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Evidence Tab ─────────────────────────────────────────────────────────────

type ClueFilter = "all" | "physical" | "testimony" | "document" | "observation" | "forensic";

function EvidenceTab({
  caseData,
  caseId,
  discoveredClues,
}: {
  caseData: NonNullable<ReturnType<typeof getCaseById>>;
  caseId: string;
  discoveredClues: string[];
}) {
  const [filter, setFilter] = useState<ClueFilter>("all");
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);

  const collected = caseData.clues.filter((c) => discoveredClues.includes(c.id));
  const locked = caseData.clues.filter((c) => !discoveredClues.includes(c.id));

  const filtered = filter === "all"
    ? collected
    : collected.filter((c) => c.type === filter);

  const FILTERS: ClueFilter[] = ["all", "physical", "document", "testimony", "forensic", "observation"];

  return (
    <div className="pt-8 space-y-8">
      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "label-caps px-3 py-1.5 rounded-full border text-[10px] transition-colors duration-200 capitalize",
              filter === f
                ? "border-gold/60 bg-gold/10 text-gold"
                : "border-[#2a2a45] text-shadow hover:border-[#5c5a78] hover:text-mist"
            )}
          >
            {f === "all" ? `All (${collected.length})` : f}
          </button>
        ))}
      </div>

      {/* Collected clues */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((clue, i) => (
            <motion.button
              key={clue.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              onClick={() => setSelectedClue(clue)}
              className="text-left card rounded-xl p-4 card-hover"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="font-serif text-base text-parchment">{clue.title}</span>
                <span className={cn(
                  "label-caps px-2 py-0.5 rounded-full border text-[9px] shrink-0",
                  clue.severity === "critical"
                    ? "text-crimson-light border-crimson/30 bg-crimson/10"
                    : clue.severity === "high"
                    ? "text-gold border-gold/30 bg-gold/10"
                    : "text-shadow border-[#2a2a45]"
                )}>
                  {clue.severity}
                </span>
              </div>
              <p className="label-caps text-shadow text-[10px] mb-2 capitalize">{clue.type}</p>
              <p className="text-mist text-sm leading-relaxed line-clamp-2 font-serif italic">
                {clue.description.slice(0, 120)}…
              </p>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="font-serif italic text-mist">No {filter !== "all" ? filter : ""} clues collected yet.</p>
        </div>
      )}

      {/* Locked count */}
      {locked.length > 0 && (
        <div className="border-t border-[#2a2a45] pt-6">
          <p className="label-caps text-shadow mb-4">
            {locked.length} undiscovered clue{locked.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {locked.map((clue) => (
              <div
                key={clue.id}
                className="card rounded-xl p-4 flex items-center gap-3"
                style={{ opacity: 0.45 }}
              >
                <Lock size={14} className="text-shadow shrink-0" />
                <span className="label-caps text-shadow text-[10px]">Unknown clue</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full evidence board link */}
      <div className="pt-4">
        <Link
          href={`/cases/${caseId}/evidence`}
          className="label-caps text-gold hover:text-gold-light transition-colors duration-200"
        >
          View Full Evidence Board →
        </Link>
      </div>

      {/* Clue detail modal */}
      <AnimatePresence>
        {selectedClue && (
          <ClueModal clue={selectedClue} onClose={() => setSelectedClue(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Timeline Tab ─────────────────────────────────────────────────────────────

function TimelineTab({
  caseData,
  discoveredClues,
}: {
  caseData: NonNullable<ReturnType<typeof getCaseById>>;
  discoveredClues: string[];
}) {
  const sorted = [...caseData.timeline].sort((a, b) => a.sortKey - b.sortKey);

  return (
    <div className="pt-8 max-w-2xl">
      <div className="relative">
        {/* Vertical gold line */}
        <div
          className="absolute left-[88px] top-0 bottom-0 w-px"
          style={{ background: "linear-gradient(to bottom, transparent, #c9a84c44, transparent)" }}
        />

        <div className="space-y-8">
          {sorted.map((event, i) => {
            const isKey = event.isKeyEvent;
            const hasDiscoveredClue = event.clueIds?.some((id) =>
              discoveredClues.includes(id)
            );

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex gap-6 relative"
              >
                {/* Time */}
                <div className="w-20 shrink-0 pt-0.5 text-right">
                  <span className="font-serif text-gold text-sm">{event.time}</span>
                </div>

                {/* Dot */}
                <div
                  className={cn(
                    "absolute left-[82px] top-1 w-3 h-3 rounded-full border-2 z-10",
                    isKey
                      ? "border-gold bg-gold/30"
                      : "border-[#2a2a45] bg-void"
                  )}
                />

                {/* Content */}
                <div
                  className={cn(
                    "flex-1 rounded-xl p-4 ml-6",
                    isKey ? "card-gold" : "card"
                  )}
                  style={isKey ? { borderRadius: "12px" } : { borderRadius: "12px" }}
                >
                  <p className="text-parchment text-sm leading-relaxed font-serif">
                    {event.description}
                  </p>
                  {hasDiscoveredClue && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <FileText size={11} className="text-iris" />
                      <span className="label-caps text-iris text-[10px]">Linked to evidence</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Notes Tab ────────────────────────────────────────────────────────────────

function NotesTab({
  caseId,
  initialNotes,
  onSave,
}: {
  caseId: string;
  initialNotes: string;
  onSave: (notes: string) => void;
}) {
  const [value, setValue] = useState(initialNotes);
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const next = e.target.value;
      setValue(next);
      setSaved(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSave(next);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }, 500);
    },
    [onSave]
  );

  return (
    <div className="pt-8 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <p className="font-serif italic text-mist text-lg">Your private investigation notes.</p>
        <AnimatePresence>
          {saved && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="label-caps text-gold text-[10px]"
            >
              Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Record your observations, suspicions, and theories here. Your notes are saved automatically."
        className="input-field w-full h-80 p-5 text-sm leading-relaxed resize-none font-serif placeholder:italic"
        style={{ color: "#f0ece0" }}
      />
      <p className="label-caps text-shadow text-[10px] mt-2">Notes are saved automatically as you type.</p>
    </div>
  );
}

// ─── Scene Modal ──────────────────────────────────────────────────────────────

function SceneModal({
  scene,
  caseId,
  discoveredClues,
  onDiscover,
  onMarkComplete,
  onClose,
}: {
  scene: Scene;
  caseId: string;
  discoveredClues: string[];
  onDiscover: (clueId: string) => void;
  onMarkComplete: () => void;
  onClose: () => void;
}) {
  const caseData = getCaseById(caseId);
  if (!caseData) return null;

  const sceneClues = caseData.clues.filter((c) => c.sceneId === scene.id);

  return (
    <Overlay onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="card-glass rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="label-caps text-gold mb-1">Scene</p>
              <h2 className="font-serif text-2xl text-parchment">{scene.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-shadow hover:text-parchment transition-colors p-1"
            >
              <XCircle size={20} />
            </button>
          </div>

          <div className="space-y-3 mb-8">
            {scene.description.split("\n\n").map((para, i) => (
              <p key={i} className="font-serif italic text-mist leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {sceneClues.length > 0 && (
            <div className="border-t border-[#2a2a45] pt-6">
              <p className="label-caps text-shadow mb-4">Discoverable Clues</p>
              <div className="space-y-3">
                {sceneClues.map((clue) => {
                  const found = discoveredClues.includes(clue.id);
                  return (
                    <div
                      key={clue.id}
                      className={cn(
                        "flex items-center justify-between gap-4 p-4 rounded-xl",
                        found ? "card-gold" : "card"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-parchment">{clue.title}</p>
                        {found && (
                          <p className="text-mist text-sm mt-1 leading-relaxed font-serif italic line-clamp-2">
                            {clue.description.slice(0, 100)}…
                          </p>
                        )}
                      </div>
                      {found ? (
                        <CheckCircle2 size={16} className="text-gold shrink-0" />
                      ) : (
                        <button
                          onClick={() => onDiscover(clue.id)}
                          className="label-caps text-[10px] text-gold border border-gold/40 hover:bg-gold hover:text-void px-3 py-1.5 rounded-lg transition-colors duration-200 shrink-0"
                        >
                          Examine
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button onClick={onMarkComplete} className="btn-gold">
              Mark Scene Complete
            </button>
          </div>
        </div>
      </motion.div>
    </Overlay>
  );
}

// ─── Briefing Modal ───────────────────────────────────────────────────────────

function BriefingModal({
  caseData,
  onClose,
}: {
  caseData: NonNullable<ReturnType<typeof getCaseById>>;
  onClose: () => void;
}) {
  return (
    <Overlay onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="card-glass rounded-2xl max-w-xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <p className="label-caps text-gold mb-4 tracking-[0.25em]">Case Briefing</p>
          <h2 className="font-serif text-3xl text-parchment mb-1">{caseData.title}</h2>
          <p className="font-serif italic text-mist mb-6">{caseData.setting}</p>

          <div className="divider-gold mb-6" />

          <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
            {caseData.briefing.split("\n\n").map((para, i) => (
              <p key={i} className="font-serif italic text-mist leading-relaxed text-sm">
                {para}
              </p>
            ))}
          </div>

          <div className="divider-gold mt-6 mb-6" />

          <button onClick={onClose} className="btn-gold w-full">
            Begin Investigation
          </button>
        </div>
      </motion.div>
    </Overlay>
  );
}

// ─── Clue Modal ───────────────────────────────────────────────────────────────

function ClueModal({ clue, onClose }: { clue: Clue; onClose: () => void }) {
  return (
    <Overlay onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="card-glass rounded-2xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  "label-caps px-2 py-0.5 rounded-full border text-[9px]",
                  clue.severity === "critical"
                    ? "text-crimson-light border-crimson/30 bg-crimson/10"
                    : "text-gold border-gold/30 bg-gold/10"
                )}>{clue.severity}</span>
                <span className="label-caps text-shadow text-[9px] capitalize">{clue.type}</span>
              </div>
              <h3 className="font-serif text-xl text-parchment">{clue.title}</h3>
            </div>
            <button onClick={onClose} className="text-shadow hover:text-parchment">
              <XCircle size={18} />
            </button>
          </div>
          <p className="font-serif italic text-mist text-sm leading-relaxed">{clue.description}</p>
        </div>
      </motion.div>
    </Overlay>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {children}
    </motion.div>
  );
}

function Avatar({ index, name, size }: { index: number; name: string; size: "sm" | "lg" }) {
  const colors = ["#2a2a45", "#1f1f35", "#181828", "#111120", "#2a2a45", "#1f1f35"];
  const bg = colors[index % colors.length];
  const dim = size === "lg" ? "w-12 h-12 text-sm" : "w-9 h-9 text-xs";
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <div
      className={cn("rounded-full flex items-center justify-center font-serif font-medium text-mist shrink-0", dim)}
      style={{ backgroundColor: bg }}
    >
      {initials}
    </div>
  );
}

function StatCard({
  value,
  total,
  label,
  color,
}: {
  value: number;
  total: number;
  label: string;
  color: "gold" | "iris" | "crimson";
}) {
  const colorMap = {
    gold: "text-gold",
    iris: "text-iris",
    crimson: "text-crimson-light",
  };
  return (
    <div className="card rounded-xl p-4 text-center">
      <p className={cn("font-serif text-3xl", colorMap[color])}>
        {value}<span className="text-xl" style={{ color: "rgba(92,90,120,0.7)" }}>/{total}</span>
      </p>
      <p className="label-caps text-[10px] mt-1.5" style={{ color: "rgba(92,90,120,0.75)" }}>{label}</p>
    </div>
  );
}

function SectionHeader({ label, inline }: { label: string; inline?: boolean }) {
  if (inline) return <p className="label-caps text-shadow">{label}</p>;
  return <p className="label-caps text-shadow mb-4">{label}</p>;
}
