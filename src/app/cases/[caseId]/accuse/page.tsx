"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronRight, Skull } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { getCaseById } from "@/data";
import { suspicionLevel } from "@/lib/caseEngine";
import { cn } from "@/lib/utils";
import type { Suspect } from "@/types";

export default function AccusePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = use(params);
  const router = useRouter();

  const caseData = getCaseById(caseId);
  const gameState = useGameStore((s) => s.cases[caseId]);
  const { accuse } = useGameStore();

  const [selected, setSelected] = useState<Suspect | null>(null);
  const [step, setStep] = useState<"select" | "confirm1" | "confirm2">("select");
  const [loading, setLoading] = useState(false);

  if (!caseData) return null;

  const discovered = gameState?.discoveredClueIds ?? [];

  function handleSelect(suspect: Suspect) {
    setSelected(suspect);
    setStep("confirm1");
  }

  function handleBack() {
    if (step === "confirm2") setStep("confirm1");
    else if (step === "confirm1") { setSelected(null); setStep("select"); }
  }

  function handleFinalAccuse() {
    if (!selected) return;
    setLoading(true);
    accuse(caseId, selected.id);
    setTimeout(() => {
      router.push(`/cases/${caseId}/result`);
    }, 1400);
  }

  return (
    <div
      className="min-h-[80vh] max-w-5xl mx-auto px-4 sm:px-6 pb-24 pt-6"
      style={{
        backgroundColor: "#141414",
        color: "#ffffff",
        background: "linear-gradient(135deg, #141414 0%, rgba(229,9,20,0.03) 50%, #141414 100%)",
      }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-red-500 mb-3 tracking-[0.3em] text-[12px] uppercase" style={{ color: "#E50914" }}>The Accusation</p>
        <h1 className="text-5xl md:text-6xl text-white leading-tight mb-4">
          Who Killed {caseData.victim.name}?
        </h1>
        <p className="text-xl max-w-xl mx-auto leading-relaxed" style={{ color: "#aaa" }}>
          This accusation is final. There is no recall. Choose with conviction.
        </p>
      </div>

      {/* Evidence summary pills */}
      {discovered.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {caseData.clues
            .filter((c) => discovered.includes(c.id))
            .slice(0, 6)
            .map((clue) => (
              <span
                key={clue.id}
                className="text-[10px] uppercase px-3 py-1 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: "#222",
                  color: "#aaa",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {clue.title}
              </span>
            ))}
          {discovered.length > 6 && (
            <span className="text-[10px] uppercase px-3 py-1 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#666" }}>
              +{discovered.length - 6} more
            </span>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* STEP: Select */}
        {step === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {caseData.suspects.map((suspect, i) => {
                const level = gameState ? suspicionLevel(suspect.id, caseData, gameState) : 0;
                const linkedClues = caseData.clues.filter(
                  (c) => discovered.includes(c.id) && c.relatedSuspectIds?.includes(suspect.id)
                ).length;

                return (
                  <motion.button
                    key={suspect.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.07 }}
                    onClick={() => handleSelect(suspect)}
                    className="text-left rounded-2xl p-5 transition-all duration-300 group"
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
                    <div className="flex items-start gap-3 mb-4">
                      <SuspectAvatar index={i} name={suspect.name} />
                      <div className="flex-1 min-w-0">
                        <p className="text-lg text-white">{suspect.name}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: "#666" }}>{suspect.relation}</p>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: "#aaa" }}>
                      {suspect.alibi}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-3">
                        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#333" }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${level}%`,
                              backgroundColor: level >= 60 ? "#E50914" : level >= 30 ? "#E50914" : "#aaa",
                            }}
                          />
                        </div>
                      </div>
                      {linkedClues > 0 && (
                        <span className="text-[9px] shrink-0" style={{ color: "#666" }}>
                          {linkedClues} clue{linkedClues !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-[9px] uppercase" style={{ color: "#E50914" }}>Accuse</span>
                      <ChevronRight size={11} style={{ color: "#E50914" }} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP: Confirm 1 */}
        {step === "confirm1" && selected && (
          <motion.div
            key="confirm1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="max-w-md mx-auto"
          >
            <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(229,9,20,0.2)" }}>
              <div className="flex items-center gap-4 mb-4">
                <SuspectAvatar index={caseData.suspects.findIndex(s => s.id === selected.id)} name={selected.name} />
                <div>
                  <p className="text-2xl text-white">{selected.name}</p>
                  <p className="text-[10px]" style={{ color: "#666" }}>{selected.relation}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#aaa" }}>
                {selected.description}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 rounded-xl transition-colors duration-200"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#aaa",
                  backgroundColor: "#222",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "#aaa";
                }}
              >
                ← Reconsider
              </button>
              <button
                onClick={() => setStep("confirm2")}
                className="flex-1 py-3 rounded-xl uppercase text-white transition-all duration-200 flex items-center justify-center gap-2"
                style={{
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
                I&apos;m Certain <ChevronRight size={13} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP: Final confirm */}
        {step === "confirm2" && selected && (
          <motion.div
            key="confirm2"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="max-w-md mx-auto text-center"
          >
            <div
              className="rounded-2xl p-8 mb-6"
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid rgba(229,9,20,0.25)",
              }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <AlertTriangle size={18} style={{ color: "#E50914" }} />
                <p className="uppercase tracking-[0.2em] text-[12px]" style={{ color: "#E50914" }}>Final Warning</p>
                <AlertTriangle size={18} style={{ color: "#E50914" }} />
              </div>
              <p className="text-3xl text-white mb-4 leading-tight">
                This accusation is final.
              </p>
              <p className="leading-relaxed" style={{ color: "#aaa" }}>
                You are about to accuse{" "}
                <span style={{ color: "#ffffff" }}>{selected.name}</span>{" "}
                of the murder of {caseData.victim.name}. There is no second chance.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleFinalAccuse}
                disabled={loading}
                className="w-full py-4 rounded-xl uppercase text-white transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: loading ? "rgba(229,9,20,0.3)" : "#E50914",
                  border: loading ? "1px solid rgba(229,9,20,0.2)" : "1px solid #E50914",
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = "#cc0811";
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = "#E50914";
                }}
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    Accusing…
                  </>
                ) : (
                  <>
                    <AlertTriangle size={15} />
                    Yes — Accuse {selected.name}
                  </>
                )}
              </button>
              <button
                onClick={() => setStep("confirm1")}
                disabled={loading}
                className="w-full py-3 rounded-xl uppercase transition-all duration-200"
                style={{
                  color: "#aaa",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "transparent",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#aaa";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                ← Go Back
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
