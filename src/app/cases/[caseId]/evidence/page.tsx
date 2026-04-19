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

  const suspectEvidence: Record<string, Clue[]> = {};
  for (const suspect of caseData.suspects) {
    const clues = collectedClues.filter((c) =>
      c.relatedSuspectIds?.includes(suspect.id)
    );
    if (clues.length > 0) suspectEvidence[suspect.id] = clues;
  }

  const progressPct = caseData.clues.length > 0
    ? Math.round((collectedClues.length / caseData.clues.length) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-6" style={{ backgroundColor: "#141414", color: "#ffffff" }}>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mb-10">
        <Link
          href={`/cases/${caseId}`}
          className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.35em] mb-8 transition-colors duration-200"
          style={{ color: "#aaa" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}
        >
          <ArrowLeft size={11} /> Back to Investigation
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className="h-[0.5px] w-8" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
          <span className="text-[9px] uppercase tracking-[0.6em]" style={{ color: "#aaa" }}>Evidence Board</span>
        </div>
        <h1 className="text-white mb-4" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
          {collectedClues.length} of {caseData.clues.length} Items Collected
        </h1>
        <div className="h-[1px] overflow-hidden max-w-xs" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${progressPct}%`, background: "#E50914", boxShadow: "0 0 8px rgba(229,9,20,0.4)" }}
          />
        </div>
      </div>

      {/* ── Filter Tags ──────────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap mb-10">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="px-3 py-1.5 rounded text-[12px] uppercase tracking-[0.1em] transition-all duration-200"
            style={{
              backgroundColor: filter === f.id ? "#ffffff" : "transparent",
              color: filter === f.id ? "#000000" : "#aaa",
              border: filter === f.id ? "none" : "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={(e) => {
              if (filter !== f.id) {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                e.currentTarget.style.color = "#e5e5e5";
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== f.id) {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "#aaa";
              }
            }}
          >
            {f.id === "all" ? `All (${collectedClues.length})` : f.label}
          </button>
        ))}
      </div>

      {collectedClues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-[0.5px] h-10" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} style={{ margin: "0 auto 32px" }} />
          <p className="text-2xl mb-3">No evidence collected yet.</p>
          <p className="text-sm leading-relaxed mb-10" style={{ color: "#aaa", maxWidth: "320px" }}>
            Explore the scenes and interrogate suspects to uncover the truth.
          </p>
          <Link
            href={`/cases/${caseId}`}
            className="px-4 py-2 rounded text-[12px] uppercase tracking-[0.1em] transition-all duration-200"
            style={{
              color: "#ffffff",
              backgroundColor: "#E50914",
              border: "1px solid #E50914",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#cc0811";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#E50914";
            }}
          >
            Return to Investigation
          </Link>
          <div className="w-[0.5px] h-10" style={{ backgroundColor: "rgba(255,255,255,0.08)", margin: "32px auto 0" }} />
        </div>
      ) : (
        <>
          {/* Critical evidence */}
          {(filter === "all" ? critical : filtered.filter((c) => c.severity === "critical")).length > 0 && (
            <section className="mb-10">
              <EvidenceDivider label="Critical Evidence" color="red" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(filter === "all" ? critical : filtered.filter((c) => c.severity === "critical")).map((clue, i) => (
                  <ClueCard key={clue.id} clue={clue} index={i} onClick={() => setSelected(clue)} />
                ))}
              </div>
            </section>
          )}

          {/* Supporting evidence */}
          {(filter === "all" ? supporting : filtered.filter((c) => c.severity !== "critical")).length > 0 && (
            <section className="mb-10">
              <EvidenceDivider label="Supporting Evidence" color="white" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(filter === "all" ? supporting : filtered.filter((c) => c.severity !== "critical")).map((clue, i) => (
                  <ClueCard key={clue.id} clue={clue} index={i} onClick={() => setSelected(clue)} />
                ))}
              </div>
            </section>
          )}

          {/* Locked / Undiscovered */}
          {lockedClues.length > 0 && (
            <section className="mb-10">
              <EvidenceDivider label={`${lockedClues.length} Undiscovered`} color="gray" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {lockedClues.map((clue) => (
                  <div
                    key={clue.id}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded"
                    style={{
                      backgroundColor: "#1a1a1a",
                      border: "1px dashed rgba(255,255,255,0.15)",
                      opacity: 0.6,
                    }}
                  >
                    <Lock size={10} style={{ color: "rgba(255,255,255,0.2)" }} />
                    <span className="text-[8px] uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.2)" }}>Redacted</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Evidence by suspect */}
          {Object.keys(suspectEvidence).length > 0 && (
            <section className="pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[0.5px] w-5" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
                <span className="text-[9px] uppercase tracking-[0.5em]" style={{ color: "#aaa" }}>Evidence by Suspect</span>
                <div className="h-[0.5px] flex-1" style={{ background: "linear-gradient(to right, rgba(255,255,255,0.1), transparent)" }} />
              </div>
              <div className="space-y-6">
                {caseData.suspects
                  .filter((s) => suspectEvidence[s.id])
                  .map((suspect, si) => {
                    const initials = suspect.name.split(" ").map((n) => n[0]).join("");
                    return (
                      <div key={suspect.id}>
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                            style={{
                              backgroundColor: "#222",
                              color: "#aaa",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            {initials}
                          </div>
                          <span style={{ color: "rgba(255,255,255,0.75)" }}>{suspect.name}</span>
                          {suspectEvidence[suspect.id].length >= 2 && (
                            <span
                              className="text-[7px] uppercase tracking-widest px-2 py-0.5"
                              style={{
                                borderRadius: "2px",
                                border: "1px solid #E50914",
                                color: "#E50914",
                                backgroundColor: "rgba(229,9,20,0.1)",
                              }}
                            >
                              High Suspicion
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {suspectEvidence[suspect.id].map((clue) => (
                            <button
                              key={clue.id}
                              onClick={() => setSelected(clue)}
                              className="text-[8px] uppercase tracking-[0.25em] px-3 py-1.5 rounded transition-all duration-300"
                              style={{
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.5)",
                                backgroundColor: "#222",
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                                e.currentTarget.style.color = "#ffffff";
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                              }}
                            >
                              {clue.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
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

// ─── EvidenceDivider ──────────────────────────────────────────────────────────

function EvidenceDivider({ label, color }: { label: string; color: "red" | "white" | "gray" }) {
  const colorMap = {
    red: { line: "rgba(229,9,20,0.3)", text: "#E50914" },
    white: { line: "rgba(255,255,255,0.15)", text: "#ffffff" },
    gray: { line: "rgba(255,255,255,0.08)", text: "#aaa" },
  };

  const c = colorMap[color];

  return (
    <div className="flex items-center gap-4 mb-5">
      <div className="h-[0.5px] flex-1" style={{ background: `linear-gradient(to right, ${c.line}, transparent)` }} />
      <span className="text-[8px] uppercase tracking-[0.5em] shrink-0" style={{ color: c.text }}>{label}</span>
      <div className="h-[0.5px] flex-1" style={{ background: `linear-gradient(to left, ${c.line}, transparent)` }} />
    </div>
  );
}

// ─── ClueCard ─────────────────────────────────────────────────────────────────

function ClueCard({ clue, index, onClick }: { clue: Clue; index: number; onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      onClick={onClick}
      className="flex flex-col p-4 rounded transition-all duration-300 text-left"
      style={{
        backgroundColor: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#222";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#1a1a1a";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-sm leading-snug" style={{ color: "#f5f5f5" }}>{clue.title}</span>
        <span
          className="text-[7px] uppercase tracking-widest px-1.5 py-0.5 shrink-0 rounded"
          style={{
            ...(clue.severity === "critical"
              ? { color: "#E50914", border: "1px solid #E50914", backgroundColor: "rgba(229,9,20,0.1)" }
              : clue.severity === "high"
              ? { color: "#E50914", border: "1px solid #E50914", backgroundColor: "rgba(229,9,20,0.05)" }
              : { color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "transparent" })
          }}
        >
          {clue.severity}
        </span>
      </div>
      <p className="text-[8px] uppercase tracking-[0.3em] mb-2 capitalize" style={{ color: "#aaa" }}>{clue.type}</p>
      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "rgba(255,255,255,0.45)" }}>
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-lg w-full max-h-[80vh] overflow-y-auto relative rounded"
        style={{
          backgroundColor: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
          color: "#ffffff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)" }} />

        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
     