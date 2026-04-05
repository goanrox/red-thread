"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, XCircle, ArrowLeft } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { getCaseById } from "@/data";
import { cn } from "@/lib/utils";
import type { Clue, ClueType } from "@/types";

type Filter = "all" | ClueType;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "physical", label: "Physical" },
  { id: "document", label: "Document" },
  { id: "testimony", label: "Testimony" },
  { id: "forensic", label: "Forensic" },
  { id: "observation", label: "Observation" },
];

export default function EvidencePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = use(params);

  const caseData = getCaseById(caseId);
  const gameState = useGameStore((s) => s.cases[caseId]);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Clue | null>(null);

  if (!caseData) return null;

  const discovered = gameState?.discoveredClueIds ?? [];
  const collectedClues = caseData.clues.filter((c) => discovered.includes(c.id));
  const lockedClues = caseData.clues.filter((c) => !discovered.includes(c.id));

  const critical = collectedClues.filter((c) => c.severity === "critical");
  const supporting = collectedClues.filter((c) => c.severity !== "critical");

  const filtered =
    filter === "all"
      ? collectedClues
      : collectedClues.filter((c) => c.type === filter);

  // Build "Evidence by Suspect" map
  const suspectEvidence: Record<string, Clue[]> = {};
  for (const suspect of caseData.suspects) {
    const clues = collectedClues.filter((c) =>
      c.relatedSuspectIds?.includes(suspect.id)
    );
    if (clues.length > 0) suspectEvidence[suspect.id] = clues;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/cases/${caseId}`}
          className="flex items-center gap-1.5 label-caps text-shadow hover:text-mist transition-colors duration-200 mb-6 text-[10px]"
        >
          <ArrowLeft size={12} /> Back to Investigation
        </Link>
        <p className="label-caps text-gold mb-2">Evidence Board</p>
        <h1 className="font-serif text-4xl text-parchment mb-2">
          {collectedClues.length} of {caseData.clues.length} Items Collected
        </h1>
        <div className="h-1 w-full bg-[#2a2a45] rounded-full overflow-hidden max-w-xs">
          <div
            className="h-full bg-gold rounded-full transition-all duration-700"
            style={{ width: `${Math.round((collectedClues.length / caseData.clues.length) * 100)}%` }}
          />
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "label-caps px-3 py-1.5 rounded-full border text-[10px] transition-colors duration-200 capitalize",
              filter === f.id
                ? "border-gold/60 bg-gold/10 text-gold"
                : "border-[#2a2a45] text-shadow hover:border-[#5c5a78] hover:text-mist"
            )}
          >
            {f.id === "all" ? `All (${collectedClues.length})` : f.label}
          </button>
        ))}
      </div>

      {collectedClues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-serif text-3xl text-parchment mb-3">No evidence collected yet.</p>
          <p className="font-serif italic text-mist text-lg max-w-sm leading-relaxed mb-8">
            Explore the scenes and interrogate suspects to uncover the truth.
          </p>
          <Link
            href={`/cases/${caseId}`}
            className="label-caps text-gold border border-gold/40 hover:bg-gold hover:text-void px-5 py-3 rounded-xl transition-colors duration-200"
          >
            Return to Investigation
          </Link>
        </div>
      ) : (
        <>
          {/* Critical evidence */}
          {(filter === "all" ? critical : filtered.filter((c) => c.severity === "critical")).length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-crimson/40 to-transparent" />
                <p className="label-caps text-crimson-light text-[10px]">Critical Evidence</p>
                <div className="h-px flex-1 bg-gradient-to-l from-crimson/40 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(filter === "all" ? critical : filtered.filter((c) => c.severity === "critical")).map((clue, i) => (
                  <ClueCard
                    key={clue.id}
                    clue={clue}
                    index={i}
                    onClick={() => setSelected(clue)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Supporting evidence */}
          {(filter === "all" ? supporting : filtered.filter((c) => c.severity !== "critical")).length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
                <p className="label-caps text-gold text-[10px]">Supporting Evidence</p>
                <div className="h-px flex-1 bg-gradient-to-l from-gold/30 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(filter === "all" ? supporting : filtered.filter((c) => c.severity !== "critical")).map((clue, i) => (
                  <ClueCard
                    key={clue.id}
                    clue={clue}
                    index={i}
                    onClick={() => setSelected(clue)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Locked placeholders */}
          {lockedClues.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-[#2a2a45] to-transparent" />
                <p className="label-caps text-shadow text-[10px]">
                  {lockedClues.length} Undiscovered
                </p>
                <div className="h-px flex-1 bg-gradient-to-l from-[#2a2a45] to-transparent" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {lockedClues.map((clue) => (
                  <div
                    key={clue.id}
                    className="bg-[#0c0c17] border border-[#2a2a45] rounded-xl p-4 flex items-center gap-2 opacity-40"
                  >
                    <Lock size={12} className="text-shadow shrink-0" />
                    <span className="label-caps text-shadow text-[9px]">Unknown</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Evidence by suspect */}
          {Object.keys(suspectEvidence).length > 0 && (
            <section className="border-t border-[#2a2a45] pt-8">
              <p className="label-caps text-shadow mb-6">Evidence by Suspect</p>
              <div className="space-y-6">
                {caseData.suspects
                  .filter((s) => suspectEvidence[s.id])
                  .map((suspect, si) => (
                    <div key={suspect.id}>
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif text-mist"
                          style={{ backgroundColor: ["#2a2a45","#1f1f35","#181828","#111120","#2a2a45","#1f1f35"][si % 6] }}
                        >
                          {suspect.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="font-serif text-parchment">{suspect.name}</span>
                        {suspectEvidence[suspect.id].length >= 2 && (
                          <span className="label-caps text-crimson-light border border-crimson/30 bg-crimson/10 px-2 py-0.5 rounded-full text-[9px]">
                            High Suspicion
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {suspectEvidence[suspect.id].map((clue) => (
                          <button
                            key={clue.id}
                            onClick={() => setSelected(clue)}
                            className="label-caps text-[10px] text-mist border border-[#2a2a45] hover:border-gold/40 hover:text-gold px-3 py-1.5 rounded-lg transition-colors duration-200"
                          >
                            {clue.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Clue detail modal */}
      <AnimatePresence>
        {selected && (
          <ClueModal clue={selected} caseData={caseData} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ClueCard ─────────────────────────────────────────────────────────────────

function ClueCard({
  clue,
  index,
  onClick,
}: {
  clue: Clue;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      onClick={onClick}
      className="text-left w-full bg-surface border border-[#2a2a45] rounded-xl p-4 hover:border-gold/40 card-hover transition-colors duration-200"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-serif text-parchment text-sm leading-snug">{clue.title}</span>
        <span className={cn(
          "label-caps px-1.5 py-0.5 rounded text-[9px] border shrink-0",
          clue.severity === "critical"
            ? "text-crimson-light border-crimson/30 bg-crimson/10"
            : clue.severity === "high"
            ? "text-gold border-gold/30 bg-gold/10"
            : "text-shadow border-[#2a2a45]"
        )}>
          {clue.severity}
        </span>
      </div>
      <p className="label-caps text-shadow text-[9px] capitalize mb-2">{clue.type}</p>
      <p className="text-mist text-xs leading-relaxed font-serif italic line-clamp-2">
        {clue.description.slice(0, 100)}…
      </p>
    </motion.button>
  );
}

// ─── ClueModal ────────────────────────────────────────────────────────────────

function ClueModal({
  clue,
  caseData,
  onClose,
}: {
  clue: Clue;
  caseData: NonNullable<ReturnType<typeof getCaseById>>;
  onClose: () => void;
}) {
  const linkedSuspects = caseData.suspects.filter((s) =>
    clue.relatedSuspectIds?.includes(s.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-surface2 border border-[#2a2a45] rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
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
            <button onClick={onClose} className="text-shadow hover:text-parchment transition-colors">
              <XCircle size={18} />
            </button>
          </div>

          <p className="font-serif italic text-mist text-sm leading-relaxed mb-6">
            {clue.description}
          </p>

          {linkedSuspects.length > 0 && (
            <div className="border-t border-[#2a2a45] pt-4">
              <p className="label-caps text-shadow text-[10px] mb-3">Linked to</p>
              <div className="flex gap-2 flex-wrap">
                {linkedSuspects.map((s) => (
                  <span key={s.id} className="label-caps text-gold border border-gold/30 bg-gold/5 px-3 py-1 rounded-lg text-[10px]">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
