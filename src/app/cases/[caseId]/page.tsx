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
        <p className="text-white/60 font-normal">Case not found.</p>
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
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto"
          >
            <Link
              href={`/cases/${caseId}/accuse`}
              className="flex items-center gap-4 px-8 py-4 transition-all duration-300 hover:scale-[1.02] rounded-[4px]"
              style={{
                background: "#E50914",
                boxShadow: "0 12px 40px rgba(229, 9, 20, 0.5), 0 2px 12px rgba(0,0,0,0.7)",
              }}
            >
              <Skull size={14} style={{ color: "#fff", flexShrink: 0 }} />
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white">
                The evidence is mounting. Make your accusation.
              </span>
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
    <div
      className="hidden sm:block sticky top-28 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 mb-2 backdrop-blur-2xl"
      style={{
        background: "rgba(20,20,20,0.96)",
        borderBottom: "0.5px solid rgba(255,255,255,0.1)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex items-center gap-2 px-5 py-4 border-b-2 whitespace-nowrap transition-all duration-400",
              "text-[8.5px] font-bold uppercase tracking-[0.4em]",
              activeTab === id
                ? "border-[#E50914] text-white"
                : "border-transparent text-white/40 hover:text-white/70"
            )}
          >
            <Icon size={10} />
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
    <div
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl"
      style={{ background: "rgba(20,20,20,0.96)", borderTop: "0.5px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center justify-around h-14 px-2">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex flex-col items-center gap-1 px-3 py-1 transition-all duration-300"
            style={{ color: activeTab === id ? "#E50914" : "rgba(255,255,255,0.3)" }}
          >
            <Icon size={16} />
            <span className="text-[8px] font-bold uppercase tracking-[0.3em]">{label}</span>
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
    <div className="pt-10 space-y-12">

      {/* Victim card */}
      <section>
        <SectionHeader label="The Victim" />
        <div
          className="rounded-[4px] overflow-hidden relative bg-[#1a1a1a] border border-white/10"
        >
          {/* Cinematic image strip at top */}
          <div className="relative h-36 overflow-hidden" style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(https://picsum.photos/seed/${caseId}victim/700/300?grayscale)` }}
            />
            <div className="absolute inset-0" style={{ background: "rgba(10, 10, 10, 0.65)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(20,20,20,0.95) 100%)" }} />
            <div className="absolute top-4 left-5">
              <span className="text-[8px] font-bold uppercase tracking-[0.45em] text-white/60">
                Deceased
              </span>
            </div>
          </div>

          <div className="flex gap-5 items-start p-6 relative z-10">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 bg-[#E50914]/10 border border-[#E50914]/20"
            >
              <Skull size={18} style={{ color: "#E50914", opacity: 0.65 }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-[0.4em] mb-1 text-white/60">Victim</p>
              <h2 className="font-bold text-2xl mb-1 text-white">{caseData.victim.name}</h2>
              <p className="text-[8px] font-bold uppercase tracking-[0.3em] mb-3 text-white/30">{caseData.victim.occupation}</p>
              <div className="h-[0.5px] mb-3 bg-white/10" />
              <p className="font-normal text-sm leading-relaxed text-white/50">
                {caseData.victim.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section>
        <SectionHeader label="Investigation Status" />
        <div className="grid grid-cols-3 gap-3">
          <StatCard value={discoveredClues.length} total={caseData.clues.length} label="Clues Found" color="red" />
          <StatCard value={visitedScenes.length} total={caseData.scenes.length} label="Scenes Explored" color="white" />
          <StatCard value={gameState?.interrogatedSuspectIds.length ?? 0} total={caseData.suspects.length} label="Interrogated" color="red" />
        </div>
      </section>

      {/* Scenes */}
      <section>
        <SectionHeader label="Locations" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {caseData.scenes.map((scene) => {
            const visited = visitedScenes.includes(scene.id);
            const locked = scene.isLocked && discoveredClues.length < 3;
            const sceneSeed = scene.id.replace(/-/g, "");
            return (
              <button
                key={scene.id}
                onClick={() => !locked && onSceneClick(scene)}
                className={cn(
                  "text-left w-full transition-all duration-500 relative overflow-hidden group rounded-[4px]",
                  locked ? "cursor-not-allowed opacity-55" : "cursor-pointer"
                )}
                style={{
                  background: "#1a1a1a",
                  border: `0.5px solid ${visited ? "rgba(229,9,20,0.3)" : locked ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.1)"}`,
                }}
                onMouseEnter={e => {
                  if (!locked) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={e => {
                  if (!locked) (e.currentTarget as HTMLElement).style.borderColor = visited ? "rgba(229,9,20,0.3)" : "rgba(255,255,255,0.1)";
                }}
              >
                {/* Scene image panel */}
                <div className="h-36 w-full" style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-600 group-hover:scale-[1.04]"
                    style={{ backgroundImage: `url(https://picsum.photos/seed/${sceneSeed}/500/240?grayscale)` }}
                  />
                  <div className="absolute inset-0" style={{ background: "rgba(5,5,12,0.5)" }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0) 20%, rgba(20,20,20,0.95) 100%)" }} />
                  {/* Status indicators on image */}
                  <div className="absolute top-3 right-3 z-10">
                    {visited ? (
                      <CheckCircle2 size={14} style={{ color: "#E50914" }} />
                    ) : locked ? (
                      <Lock size={13} style={{ color: "rgba(255,255,255,0.3)" }} />
                    ) : null}
                  </div>
                  <div className="absolute bottom-3 left-4 z-10 flex items-center gap-2">
                    <MapPin size={11} style={{ color: locked ? "rgba(255,255,255,0.25)" : "#E50914" }} />
                    <span className="font-bold text-base text-white">{scene.name}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="relative z-10 px-5 py-4">
                  <p className="font-normal text-sm leading-relaxed line-clamp-2 text-white/45">
                    {scene.description.split("\n")[0]}
                  </p>
                  {locked && (
                    <p className="text-[7.5px] font-bold uppercase tracking-[0.4em] mt-2.5 text-white/30">
                      {3 - discoveredClues.length} more clue{3 - discoveredClues.length !== 1 ? "s" : ""} required
                    </p>
                  )}
                  {!locked && !visited && (
                    <p className="text-[7.5px] font-bold uppercase tracking-[0.4em] mt-2.5 text-white/40">
                      Enter Scene →
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Quick suspects grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <SectionHeader label="Persons of Interest" inline />
          <Link
            href={`/cases/${caseId}/interrogate/${caseData.suspects[0]?.id}`}
            className="text-[9px] font-bold uppercase tracking-[0.35em] transition-colors duration-300 text-white/40 hover:text-white"
          >
            Begin Interrogations →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {caseData.suspects.map((suspect, i) => {
            const level = gameState ? suspicionLevel(suspect.id, caseData, gameState) : 0;
            const suspectSeed = suspect.id.replace(/-/g, "");
            return (
              <Link
                key={suspect.id}
                href={`/cases/${caseId}/interrogate/${suspect.id}`}
                className="rounded-[4px] overflow-hidden transition-all duration-500 group"
                style={{
                  background: "#1a1a1a",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.7), 0 0 20px rgba(229,9,20,0.05)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                {/* Portrait image */}
                <div className="h-24 w-full relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-600 group-hover:scale-[1.06]"
                    style={{ backgroundImage: `url(https://picsum.photos/seed/${suspectSeed}portrait/300/200?grayscale)` }}
                  />
                  <div className="absolute inset-0" style={{ background: "rgba(5,5,12,0.55)" }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0) 30%, rgba(20,20,20,0.98) 100%)" }} />
                </div>
                {/* Info */}
                <div className="px-3 py-3">
                  <p className="font-bold text-sm truncate text-white">{suspect.name}</p>
                  <div className="mt-2 h-[1px] overflow-hidden bg-white/10">
                    <div
                      className="h-full transition-all duration-700"
                      style={{
                        width: `${level}%`,
                        background: level >= 60 ? "#E50914" : level >= 30 ? "#E50914" : "rgba(255,255,255,0.18)",
                      }}
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
    <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
      {caseData.suspects.map((suspect, i) => {
        const level = gameState ? suspicionLevel(suspect.id, caseData, gameState) : 0;
        const asked = gameState?.askedQuestions[suspect.id]?.length ?? 0;
        const available = gameState
          ? availableQuestions(suspect.questions, gameState, suspect.id).length
          : suspect.questions.length;
        const suspectSeed = suspect.id.replace(/-/g, "");

        return (
          <motion.div
            key={suspect.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className="relative rounded-[4px] overflow-hidden flex flex-col bg-[#1a1a1a] border border-white/10"
          >
            {/* Portrait image panel */}
            <div className="relative h-48 w-full" style={{ borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
              <div
                className="absolute inset-0 bg-cover bg-top"
                style={{ backgroundImage: `url(https://picsum.photos/seed/${suspectSeed}full/500/350?grayscale)` }}
              />
              <div className="absolute inset-0" style={{ background: "rgba(5,5,12,0.48)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0) 30%, rgba(20,20,20,0.96) 100%)" }} />
              {/* Risk badge on image */}
              <div className="absolute top-3 right-3 z-10">
                <div
                  className="text-[7px] font-bold uppercase tracking-widest px-2 py-0.5 border rounded-[4px]"
                  style={{
                    backdropFilter: "blur(8px)",
                    ...(level >= 60
                      ? { borderColor: "rgba(229,9,20,0.5)", color: "#E50914", background: "rgba(10,5,10,0.7)" }
                      : level >= 30
                      ? { borderColor: "rgba(229,9,20,0.3)", color: "rgba(229,9,20,0.7)", background: "rgba(10,8,5,0.7)" }
                      : { borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.4)", background: "rgba(10,10,20,0.7)" })
                  }}
                >
                  {level >= 60 ? "High" : level >= 30 ? "Medium" : "Low"} risk
                </div>
              </div>
              {/* Name overlay at bottom of image */}
              <div className="absolute bottom-4 left-5 z-10">
                <p className="text-[8px] font-bold uppercase tracking-[0.4em] mb-1 text-white/60">{suspect.relation}</p>
                <h3 className="font-bold text-xl text-white">{suspect.name}</h3>
              </div>
            </div>

            {/* Card body */}
            <div className="flex flex-col gap-4 p-5">
              <p className="font-normal text-sm leading-relaxed line-clamp-2 text-white/45">
                {suspect.description}
              </p>

              {/* Suspicion meter */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[7.5px] font-bold uppercase tracking-[0.4em] text-white/45">Suspicion Index</span>
                  <span className="text-[8px] font-mono" style={{ color: level >= 60 ? "#E50914" : level >= 30 ? "#E50914" : "rgba(255,255,255,0.25)" }}>{level}%</span>
                </div>
                <div className="h-[1px] overflow-hidden bg-white/10">
                  <motion.div
                    className="h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${level}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                      background: level >= 60 ? "#E50914" : level >= 30 ? "#E50914" : "rgba(255,255,255,0.2)",
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between" style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", paddingTop: "14px" }}>
                <span className="text-[7.5px] font-mono text-white/25">
                  {asked} asked · {available} available
                </span>
                <Link
                  href={`/cases/${caseId}/interrogate/${suspect.id}`}
                  className="text-[7.5px] font-bold uppercase tracking-[0.35em] px-4 py-1.5 transition-all duration-400 rounded-[3px]"
                  style={{ border: "0.5px solid rgba(229,9,20,0.4)", color: "#E50914", background: "transparent" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(229,9,20,0.1)"; el.style.borderColor = "rgba(229,9,20,0.7)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = "rgba(229,9,20,0.4)"; }}
                >
                  Interrogate
                </Link>
              </div>
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
      {/* Filter tags */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.4em] transition-all duration-300",
              filter === f
                ? "bg-white text-black"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            )}
          >
            {f === "all" ? `All (${collected.length})` : f}
          </button>
        ))}
      </div>

      {/* Collected clues */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((clue, i) => (
            <motion.button
              key={clue.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              onClick={() => setSelectedClue(clue)}
              className="text-left p-4 rounded-[4px] bg-[#1a1a1a] border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="font-bold text-sm text-white">{clue.title}</span>
                <span
                  className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border rounded-[3px] shrink-0"
                  style={{
                    ...(clue.severity === "critical"
                      ? { color: "#E50914", borderColor: "rgba(229,9,20,0.3)", background: "rgba(229,9,20,0.06)" }
                      : clue.severity === "high"
                      ? { color: "#E50914", borderColor: "rgba(229,9,20,0.3)", background: "rgba(229,9,20,0.06)" }
                      : { color: "rgba(255,255,255,0.3)", borderColor: "rgba(255,255,255,0.08)", background: "transparent" })
                  }}
                >
                  {clue.severity}
                </span>
              </div>
              <p className="text-[8px] font-bold uppercase tracking-[0.3em] mb-2 capitalize text-white/40">{clue.type}</p>
              <p className="font-normal text-xs leading-relaxed line-clamp-2 text-white/45">
                {clue.description.slice(0, 120)}…
              </p>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="font-normal text-white/40">No {filter !== "all" ? filter : ""} clues collected yet.</p>
        </div>
      )}

      {/* Locked count */}
      {locked.length > 0 && (
        <div className="pt-6" style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)" }}>
          <p className="text-[8px] font-bold uppercase tracking-[0.4em] mb-4 text-white/40">
            {locked.length} undiscovered
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {locked.map((clue) => (
              <div key={clue.id} className="p-4 rounded-[4px] bg-[#0f0f0f] border border-white/5 flex items-center justify-center gap-2">
                <Lock size={11} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/20">Redacted</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full evidence board link */}
      <div className="pt-4">
        <Link
          href={`/cases/${caseId}/evidence`}
          className="text-[9px] font-bold uppercase tracking-[0.4em] transition-colors duration-300 text-white/40 hover:text-white"
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
    <div className="pt-10 max-w-2xl">
      <div className="relative">
        {/* Vertical connector */}
        <div
          className="absolute left-[88px] top-0 bottom-0 w-[0.5px]"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)" }}
        />

        <div className="space-y-6">
          {sorted.map((event, i) => {
            const isKey = event.isKeyEvent;
            const hasDiscoveredClue = event.clueIds?.some((id) => discoveredClues.includes(id));

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex gap-6 relative"
              >
                {/* Time */}
                <div className="w-20 shrink-0 pt-1 text-right">
                  <span className="text-sm font-mono font-bold" style={{ color: isKey ? "#E50914" : "rgba(255,255,255,0.4)" }}>{event.time}</span>
                </div>

                {/* Dot */}
                <div
                  className="absolute top-2 z-10"
                  style={{
                    left: "82px",
                    width: "12px", height: "12px",
                    borderRadius: "50%",
                    border: `1.5px solid ${isKey ? "#E50914" : "rgba(255,255,255,0.2)"}`,
                    background: isKey ? "rgba(229,9,20,0.2)" : "#141414",
                  }}
                />

                {/* Content card */}
                <div
                  className="flex-1 ml-6 p-4 relative overflow-hidden rounded-[3px]"
                  style={{
                    background: isKey ? "#1a1a1a" : "#0f0f0f",
                    border: `0.5px solid ${isKey ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <p className="font-normal text-sm leading-relaxed" style={{ color: isKey ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.6)" }}>
                    {event.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2.5">
                    {hasDiscoveredClue && (
                      <div className="flex items-center gap-1.5">
                        <FileText size={10} style={{ color: "#E50914" }} />
                        <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#E50914]">Evidence linked</span>
                      </div>
                    )}
                    {isKey && (
                      <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/40">Key event</span>
                    )}
                  </div>
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
    <div className="pt-10 max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <p className="font-normal text-white/45">Private investigation notes.</p>
        <AnimatePresence>
          {saved && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/60"
            >
              Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="Record your observations, suspicions, and theories here. Your notes are saved automatically."
          className="w-full h-80 p-6 text-sm leading-relaxed resize-none font-normal placeholder:font-normal outline-none rounded-[4px]"
          style={{
            background: "#1a1a1a",
            border: "0.5px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.75)",
            caretColor: "#E50914",
          }}
        />
      </div>
      <p className="text-[8px] font-mono mt-2 text-white/30">Auto-saved</p>
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
        className="rounded-[8px] max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-[#1a1a1a] border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.5em] mb-1 text-white/55">Location</p>
              <h2 className="font-bold text-2xl text-white">{scene.name}</h2>
            </div>
            <button onClick={onClose} className="transition-colors p-1 text-white/30 hover:text-white/70"
            >
              <XCircle size={18} />
            </button>
          </div>

          <div className="space-y-3 mb-8">
            {scene.description.split("\n\n").map((para, i) => (
              <p key={i} className="font-normal text-sm leading-relaxed text-white/55">
                {para}
              </p>
            ))}
          </div>

          {sceneClues.length > 0 && (
            <div className="pt-6 space-y-3" style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)" }}>
              <p className="text-[8px] font-bold uppercase tracking-[0.5em] mb-4 text-white/45">Discoverable Evidence</p>
              {sceneClues.map((clue) => {
                const found = discoveredClues.includes(clue.id);
                return (
                  <div
                    key={clue.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-[4px]"
                    style={{
                      background: found ? "#0a0a0a" : "#141414",
                      border: `0.5px solid ${found ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white">{clue.title}</p>
                      {found && (
                        <p className="font-normal text-sm mt-1 leading-relaxed line-clamp-2 text-white/50">
                          {clue.description.slice(0, 100)}…
                        </p>
                      )}
                    </div>
                    {found ? (
                      <CheckCircle2 size={14} style={{ color: "#E50914", flexShrink: 0 }} />
                    ) : (
                      <button
                        onClick={() => onDiscover(clue.id)}
                        className="text-[8px] font-bold uppercase tracking-[0.35em] px-3 py-1.5 transition-all duration-300 shrink-0 rounded-[2px]"
                        style={{ border: "0.5px solid rgba(229,9,20,0.3)", color: "#E50914" }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(229,9,20,0.08)"; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; }}
                      >
                        Examine
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button onClick={onMarkComplete} className="px-6 py-2 rounded-[4px] bg-white text-black font-bold text-[9px] uppercase tracking-[0.4em] hover:bg-white/90 transition-colors">
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
        className="rounded-[8px] max-w-xl w-full bg-[#1a1a1a] border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8 relative">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[0.5px] w-8 bg-white/30" />
              <span className="text-[9px] font-bold uppercase tracking-[0.6em] text-white/60">Case Briefing</span>
              <div className="h-[0.5px] flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <h2 className="font-bold text-3xl mb-1 text-white">{caseData.title}</h2>
            <p className="font-normal text-sm mb-6 text-white/40">{caseData.setting}</p>

            <div className="h-[0.5px] mb-6 bg-white/10" />

            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {caseData.briefing.split("\n\n").map((para, i) => (
                <p key={i} className="font-normal text-sm leading-relaxed text-white/55">
                  {para}
                </p>
              ))}
            </div>

            <div className="h-[0.5px] mt-6 mb-6 bg-white/10" />

            <button onClick={onClose} className="w-full py-2 rounded-[4px] bg-white text-black font-bold text-[9px] uppercase tracking-[0.4em] hover:bg-white/90 transition-colors">
              Begin Investigation
            </button>
          </div>
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
        className="rounded-[8px] max-w-lg w-full bg-[#1a1a1a] border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  "px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase",
                  clue.severity === "critical"
                    ? "text-[#E50914] border-[#E50914]/30 bg-[#E50914]/10"
                    : "text-white/60 border-white/30 bg-white/10"
                )}>{clue.severity}</span>
                <span className="text-white/60 text-[9px] font-bold uppercase capitalize">{clue.type}</span>
              </div>
              <h3 className="font-bold text-xl text-white">{clue.title}</h3>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <XCircle size={18} />
            </button>
          </div>
          <p className="font-normal text-white/60 text-sm leading-relaxed">{clue.description}</p>
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {children}
    </motion.div>
  );
}

function Avatar({ index, name, size }: { index: number; name: string; size: "sm" | "lg" }) {
  const dim = size === "lg" ? "w-12 h-12 text-sm" : "w-9 h-9 text-xs";
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <div className={cn("rounded-full bg-[#E50914]/20 border border-[#E50914]/30 font-bold text-white flex items-center justify-center shrink-0", dim)}>
      {initials}
    </div>
  );
}

function StatCard({ value, total, label, color }: { value: number; total: number; label: string; color: "red" | "white" }) {
  const colorMap = { red: "#E50914", white: "#fff" };
  const glowMap = { red: "rgba(229,9,20,0.15)", white: "rgba(255,255,255,0.15)" };
  return (
    <div className="p-4 rounded-[4px] bg-[#1a1a1a] border border-white/10">
      <p
        className="font-bold text-3xl"
        style={{ color: colorMap[color], filter: `drop-shadow(0 0 12px ${glowMap[color]})` }}
      >
        {value}<span className="text-base text-white/18" style={{ color: "rgba(255,255,255,0.18)" }}>/{total}</span>
      </p>
      <p className="text-[7.5px] font-bold uppercase tracking-[0.4em] mt-2 text-white/40">{label}</p>
    </div>
  );
}

function SectionHeader({ label, inline }: { label: string; inline?: boolean }) {
  if (inline) return (
    <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/55">{label}</span>
  );
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="h-[0.5px] w-5 shrink-0 bg-white/30" />
      <span className="text-[9px] font-bold uppercase tracking-[0.5em] shrink-0 text-white/55">{label}</span>
      <div className="h-[0.5px] flex-1 bg-gradient-to-r from-white/20 to-transparent" />
    </div>
  );
}
