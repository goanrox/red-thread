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
        background: "radial-gradient(ellipse at center, rgba(139,34,50,0.06) 0%, transparent 60%)",
      }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <p className="label-caps text-crimson-light mb-3 tracking-[0.3em]">The Accusation</p>
        <h1 className="font-serif text-5xl md:text-6xl text-parchment leading-tight mb-4">
          Who Killed {caseData.victim.name}?
        </h1>
        <p className="font-serif italic text-mist text-xl max-w-xl mx-auto leading-relaxed">
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
                className="label-caps text-[10px] text-mist border border-[#2a2a45] px-3 py-1 rounded-full bg-surface"
              >
                {clue.title}
              </span>
            ))}
          {discovered.length > 6 && (
            <span className="label-caps text-[10px] text-shadow border border-[#2a2a45] px-3 py-1 rounded-full">
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
                    className="text-left bg-surface border border-[#2a2a45] rounded-2xl p-5 hover:border-crimson/40 hover:bg-crimson/5 transition-colors duration-200 card-hover group"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <SuspectAvatar index={i} name={suspect.name} />
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-lg text-parchment">{suspect.name}</p>
                        <p className="label-caps text-shadow text-[10px] mt-0.5">{suspect.relation}</p>
                      </div>
                    </div>
                    <p className="font-serif italic text-mist text-xs leading-relaxed mb-4 line-clamp-2">
                      {suspect.alibi}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-3">
                        <div className="h-1 bg-[#2a2a45] rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              level >= 60 ? "bg-crimson-light" : level >= 30 ? "bg-gold" : "bg-[#5c5a78]"
                            )}
                            style={{ width: `${level}%` }}
                          />
                        </div>
                      </div>
                      {linkedClues > 0 && (
                        <span className="label-caps text-shadow text-[9px] shrink-0">
                          {linkedClues} clue{linkedClues !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="label-caps text-crimson-light text-[9px]">Accuse</span>
                      <ChevronRight size={11} className="text-crimson-light" />
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
            <div className="bg-surface border border-crimson/30 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <SuspectAvatar index={caseData.suspects.findIndex(s => s.id === selected.id)} name={selected.name} />
                <div>
                  <p className="font-serif text-2xl text-parchment">{selected.name}</p>
                  <p className="label-caps text-shadow text-[10px]">{selected.relation}</p>
                </div>
              </div>
              <p className="font-serif italic text-mist text-sm leading-relaxed">
                {selected.description}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 rounded-xl border border-[#2a2a45] text-mist label-caps hover:border-gold/40 hover:text-parchment transition-colors duration-200"
              >
                ← Reconsider
              </button>
              <button
                onClick={() => setStep("confirm2")}
                className="flex-1 py-3 rounded-xl bg-crimson border border-crimson text-parchment label-caps hover:bg-crimson-light hover:border-crimson-light transition-colors duration-200 flex items-center justify-center gap-2"
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
            <div className="mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <AlertTriangle size={20} className="text-crimson-light" />
                <p className="label-caps text-crimson-light">Final Warning</p>
                <AlertTriangle size={20} className="text-crimson-light" />
              </div>
              <p className="font-serif text-3xl text-parchment mb-4">
                This accusation is final.
              </p>
              <p className="font-serif italic text-mist text-lg leading-relaxed">
                You are about to accuse <span className="text-parchment not-italic">{selected.name}</span> of the murder of {caseData.victim.name}. There is no second chance.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleFinalAccuse}
                disabled={loading}
                className={cn(
                  "w-full py-4 rounded-xl border font-sans font-semibold text-sm tracking-widest uppercase transition-colors duration-200 flex items-center justify-center gap-2",
                  loading
                    ? "bg-crimson/50 border-crimson/50 text-parchment/50 cursor-not-allowed"
                    : "bg-crimson border-crimson text-parchment hover:bg-crimson-light hover:border-crimson-light"
                )}
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-parchment/30 border-t-parchment rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    Reviewing the evidence…
                  </>
                ) : (
                  <>
                    <Skull size={16} />
                    Make Final Accusation
                  </>
                )}
              </button>
              <button
                onClick={handleBack}
                className="w-full py-3 rounded-xl border border-[#2a2a45] text-mist label-caps hover:border-gold/40 hover:text-parchment transition-colors duration-200"
              >
                Wait — I need more time
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SuspectAvatar({ index, name }: { index: number; name: string }) {
  const bgs = ["#2a2a45","#1f1f35","#181828","#111120","#2a2a45","#1f1f35"];
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center font-serif text-base text-mist shrink-0"
      style={{ backgroundColor: bgs[index % bgs.length] }}
    >
      {name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
    </div>
  );
}
