"use client";

import { use, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, BookOpen, Trophy } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { getCaseById } from "@/data";
import { calculateScore, scoreToRank, rankProgress } from "@/lib/scoring";
import { totalQuestionsAsked, totalQuestions } from "@/lib/caseEngine";
import { cn } from "@/lib/utils";
import type { DetectiveRank } from "@/types";

const RANK_ORDER: DetectiveRank[] = [
  "Rookie", "Investigator", "Detective", "Senior Detective", "Chief Inspector", "Master Detective"
];

export default function ResultPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = use(params);
  const router = useRouter();

  const caseData = getCaseById(caseId);
  const gameState = useGameStore((s) => s.cases[caseId]);
  const playerStats = useGameStore((s) => s.stats);
  const { completeCase, resetCase } = useGameStore();

  const [phase, setPhase] = useState(0); // 0=loading, 1=verdict, 2=cards, 3=reveal
  const completedRef = useRef(false);

  const accusedId = gameState?.accusedSuspectId;
  const accused = caseData?.suspects.find((s) => s.id === accusedId);
  const killer = caseData?.suspects.find((s) => s.isGuilty);
  const isCorrect = accusedId === killer?.id;

  // Calculate score and complete case
  useEffect(() => {
    if (!caseData || !gameState || !accusedId || completedRef.current) return;
    if (gameState.isComplete) {
      completedRef.current = true;
      return;
    }

    completedRef.current = true;

    const scoreBreakdown = calculateScore({
      isCorrect,
      cluesFound: gameState.discoveredClueIds.length,
      totalClues: caseData.clues.length,
      questionsAsked: totalQuestionsAsked(gameState),
      totalQuestions: totalQuestions(caseData),
      timeElapsedMs: Date.now() - new Date(gameState.startedAt).getTime(),
    });

    completeCase(caseId, isCorrect, scoreBreakdown.total);
  }, []);

  // Phase progression
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1200),
      setTimeout(() => setPhase(2), 3000),
      setTimeout(() => setPhase(3), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  function handlePlayAgain() {
    resetCase(caseId);
    router.push(`/cases/${caseId}`);
  }

  if (!caseData || !accused || !killer) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" style={{ backgroundColor: "#141414", color: "#ffffff" }}>
        <p>No accusation on record.</p>
        <Link href={`/cases/${caseId}`} className="ml-4 uppercase" style={{ color: "#E50914" }}>
          Return to Investigation
        </Link>
      </div>
    );
  }

  const score = gameState?.score ?? 0;
  const rank = scoreToRank(score);
  const rankPct = rankProgress(score);

  const ending = caseData.solution.endings.find((e) =>
    isCorrect ? e.condition === "correct" : e.condition === "wrong"
  ) ?? caseData.solution.endings[0];

  return (
    <div
      className="min-h-[80vh] max-w-3xl mx-auto px-4 sm:px-6 pb-24 pt-6"
      style={{
        backgroundColor: "#141414",
        color: "#ffffff",
        background: isCorrect
          ? "linear-gradient(135deg, #141414 0%, rgba(76,221,138,0.03) 50%, #141414 100%)"
          : "linear-gradient(135deg, #141414 0%, rgba(229,9,20,0.03) 50%, #141414 100%)",
      }}
    >
      {/* Phase 0: Loading */}
      <AnimatePresence>
        {phase === 0 && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[50vh] gap-6"
          >
            <motion.div
              className="w-8 h-8 border-2 border-gray-700 border-t-red-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              style={{ borderTopColor: "#E50914" }}
            />
            <p className="text-xl" style={{ color: "#aaa" }}>
              Reviewing the evidence…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 1: Verdict */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            key="verdict"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12"
          >
            {isCorrect ? (
              <CheckCircle2 size={48} style={{ color: "#4cdd8a", margin: "0 auto 16px" }} />
            ) : (
              <XCircle size={48} style={{ color: "#E50914", margin: "0 auto 16px" }} />
            )}
            <h1 className="leading-none mb-4" style={{
              fontSize: "clamp(56px,10vw,96px)",
              color: isCorrect ? "#4cdd8a" : "#E50914",
            }}>
              {isCorrect ? "Correct." : "Wrong."}
            </h1>
            <p className="text-xl max-w-lg mx-auto leading-relaxed" style={{ color: "#aaa" }}>
              {isCorrect
                ? "Your deduction was sound. Justice is served."
                : "An innocent person has been accused. The real killer remains free."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2: Accused vs Killer cards */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            key="cards"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-4 mb-12"
          >
            <ResultCard
              label="You Accused"
              suspect={accused}
              index={caseData.suspects.findIndex((s) => s.id === accused.id)}
              status={isCorrect ? "correct" : "wrong"}
            />
            <ResultCard
              label={isCorrect ? "The Killer" : "The Real Killer"}
              suspect={killer}
              index={caseData.suspects.findIndex((s) => s.id === killer.id)}
              status={isCorrect ? "correct" : "escaped"}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 3: Full reveal */}
      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Ending narrative */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-[10px] uppercase mb-3" style={{ color: "#aaa" }}>{ending.title}</p>
              <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                {ending.narrative}
              </p>
            </div>

            {/* Hidden truth */}
            <div
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid rgba(76,221,138,0.2)",
                background: "linear-gradient(160deg, #0a1814 0%, #0a0f0d 55%)",
              }}
            >
              <p className="text-[10px] uppercase mb-3" style={{ color: "#4cdd8a" }}>The Hidden Truth</p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                {caseData.solution.twist ?? caseData.solution.narrativeReveal}
              </p>
            </div>

            {/* Season 2 unlock — only on correct solve */}
            {isCorrect && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="rounded-2xl p-6 text-center"
                style={{
                  backgroundColor: "rgba(76,221,138,0.08)",
                  border: "1px solid rgba(76,221,138,0.2)",
                }}
              >
                <p className="text-[10px] uppercase mb-2 tracking-[0.25em]" style={{ color: "#4cdd8a" }}>Season 2 — Unlocked</p>
                <h3 className="text-2xl text-white mb-3">
                  The archive grows.
                </h3>
                <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
                  You&apos;ve earned access to Season Two. Three new cases are being assembled for detectives of your calibre. They&apos;ll be waiting in the Case Browser when they&apos;re ready.
                </p>
              </motion.div>
            )}

            {/* The killer's tell */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-[10px] uppercase mb-3" style={{ color: "#aaa" }}>The Killer&apos;s Tell</p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
                {killer.tells.join(" ")}
              </p>
              <p className="text-sm leading-relaxed text-white">
                {caseData.solution.method}
              </p>
            </div>

            {/* Score breakdown */}
            {score > 0 && (
              <div className="rounded-2xl p-6" style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-2 mb-5">
                  <Trophy size={16} style={{ color: "#E50914" }} />
                  <p className="text-[10px] uppercase" style={{ color: "#E50914" }}>Case Report</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <ScoreStat label="Total Score" value={score.toString()} accent />
                  <ScoreStat
                    label="Clues Found"
                    value={`${gameState?.discoveredClueIds.length ?? 0}/${caseData.clues.length}`}
                  />
                  <ScoreStat
                    label="Interrogations"
                    value={`${gameState?.interrogatedSuspectIds.length ?? 0}/${caseData.suspects.length}`}
                  />
                  <ScoreStat
                    label="Verdict"
                    value={isCorrect ? "Correct" : "Wrong"}
                    accent={isCorrect}
                    danger={!isCorrect}
                  />
                </div>

                {/* Rank progression */}
                <div>
                  <p className="text-[10px] uppercase mb-3" style={{ color: "#666" }}>Detective Rank</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {RANK_ORDER.map((r) => (
                      <span
                        key={r}
                        className="px-3 py-1.5 rounded-lg border text-[9px] uppercase transition-colors"
                        style={{
                          borderColor: r === rank ? "#E50914" : "rgba(255,255,255,0.08)",
                          backgroundColor: r === rank ? "rgba(229,9,20,0.15)" : "transparent",
                          color: r === rank ? "#E50914" : RANK_ORDER.indexOf(r) < RANK_ORDER.indexOf(rank) ? "#aaa" : "#444",
                        }}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/cases"
                className="flex-1 py-3 rounded-xl uppercase text-center transition-all duration-200 flex items-center justify-center gap-2"
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
                <BookOpen size={13} />
                Back to Cases
              </Link>
              <button
                onClick={handlePlayAgain}
                className="flex-1 py-3 rounded-xl uppercase transition-all duration-200 flex items-center justify-center gap-2 text-white"
                style={{
                  border: "1px solid #E50914",
                  background: "rgba(229,9,20,0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(229,9,20,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(229,9,20,0.1)";
                }}
              >
                <RotateCcw size={13} />
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ResultCard({
  label,
  suspect,
  index,
  status,
}: {
  label: string;
  suspect: NonNullable<ReturnType<typeof getCaseById>>["suspects"][number];
  index: number;
  status: "correct" | "wrong" | "escaped";
}) {
  const bgs = ["#2a2a2a","#1f1f1f","#181818","#111111","#2a2a2a","#1f1f1f"];
  return (
    <div
      className="rounded-2xl p-5 text-center"
      style={{
        backgroundColor: "#1a1a1a",
        border: status === "correct" ? "1px solid rgba(76,221,138,0.2)" : status === "escaped" ? "1px solid rgba(229,9,20,0.2)" : "1px solid rgba(255,255,255,0.08)",
        background: status === "correct" ? "linear-gradient(160deg, #0a1814 0%, #0a0f0d 55%)" : status === "escaped" ? "linear-gradient(160deg, #1a0a0c 0%, #0d0608 55%)" : "#1a1a1a",
      }}
    >
      <p className="text-[10px] uppercase mb-3" style={{ color: "#aaa" }}>{label}</p>
      <div
        className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-base"
        style={{
          backgroundColor: bgs[index % bgs.length],
          color: "#aaa",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {suspect.name.split(" ").map((n) => n[0]).join("")}
      </div>
      <p className="text-white">{suspect.name}</p>
      <p className="text-[10px] mt-1" style={{ color: "#666" }}>{suspect.relation}</p>
      <div className="mt-3">
        {status === "correct" && (
          <span className="text-[9px] uppercase px-2 py-0.5 rounded-full" style={{ color: "#4cdd8a", border: "1px solid #4cdd8a", backgroundColor: "rgba(76,221,138,0.1)" }}>
            Guilty
          </span>
        )}
        {status === "wrong" && (
          <span className="text-[9px] uppercase px-2 py-0.5 rounded-full" style={{ color: "#aaa", border: "1px solid rgba(255,255,255,0.08)" }}>
            Innocent
          </span>
        )}
        {status === "escaped" && (
          <span className="text-[9px] uppercase px-2 py-0.5 rounded-full" style={{ color