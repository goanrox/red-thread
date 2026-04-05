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
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-mist font-serif italic">No accusation on record.</p>
        <Link href={`/cases/${caseId}`} className="ml-4 label-caps text-gold">
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
        background: isCorrect
          ? "radial-gradient(ellipse at center top, rgba(201,168,76,0.06) 0%, transparent 55%)"
          : "radial-gradient(ellipse at center top, rgba(139,34,50,0.08) 0%, transparent 55%)",
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
              className="w-8 h-8 border-2 border-[#2a2a45] border-t-gold rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
            <p className="font-serif italic text-mist text-xl">
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
              <CheckCircle2 size={48} className="text-gold mx-auto mb-4" />
            ) : (
              <XCircle size={48} className="text-crimson-light mx-auto mb-4" />
            )}
            <h1 className={cn(
              "font-serif leading-none mb-4",
              "text-[clamp(56px,10vw,96px)]",
              isCorrect ? "text-gold" : "text-crimson-light"
            )}>
              {isCorrect ? "Correct." : "Wrong."}
            </h1>
            <p className="font-serif italic text-mist text-xl max-w-lg mx-auto leading-relaxed">
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
            <div className="bg-surface border border-[#2a2a45] rounded-2xl p-6">
              <p className="label-caps text-shadow mb-3">{ending.title}</p>
              <p className="font-serif italic text-mist text-base leading-relaxed">
                {ending.narrative}
              </p>
            </div>

            {/* Hidden truth */}
            <div className="bg-surface border border-gold/20 rounded-2xl p-6">
              <p className="label-caps text-gold mb-3">The Hidden Truth</p>
              <p className="font-serif italic text-mist text-sm leading-relaxed">
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
                  background: "radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)",
                  border: "1px solid rgba(201,168,76,0.3)",
                }}
              >
                <p className="label-caps text-gold mb-2 tracking-[0.25em]">Season 2 — Unlocked</p>
                <h3 className="font-serif text-2xl text-parchment mb-3">
                  The archive grows.
                </h3>
                <p className="font-serif italic text-mist text-sm leading-relaxed max-w-md mx-auto">
                  You&apos;ve earned access to Season Two. Three new cases are being assembled for detectives of your calibre. They&apos;ll be waiting in the Case Browser when they&apos;re ready.
                </p>
              </motion.div>
            )}

            {/* The killer's tell */}
            <div className="bg-surface border border-[#2a2a45] rounded-2xl p-6">
              <p className="label-caps text-shadow mb-3">The Killer&apos;s Tell</p>
              <p className="font-serif italic text-mist text-sm leading-relaxed mb-4">
                {killer.tells.join(" ")}
              </p>
              <p className="font-serif text-parchment text-sm leading-relaxed">
                {caseData.solution.method}
              </p>
            </div>

            {/* Score breakdown */}
            {score > 0 && (
              <div className="bg-surface border border-[#2a2a45] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Trophy size={16} className="text-gold" />
                  <p className="label-caps text-gold">Case Report</p>
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
                  <p className="label-caps text-shadow mb-3 text-[10px]">Detective Rank</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {RANK_ORDER.map((r) => (
                      <span
                        key={r}
                        className={cn(
                          "label-caps px-3 py-1.5 rounded-lg border text-[9px] transition-colors",
                          r === rank
                            ? "border-gold bg-gold/15 text-gold"
                            : RANK_ORDER.indexOf(r) < RANK_ORDER.indexOf(rank)
                            ? "border-[#2a2a45] text-shadow"
                            : "border-[#2a2a45] text-[#2a2a45]"
                        )}
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
                className="flex-1 py-3 rounded-xl border border-[#2a2a45] text-mist label-caps text-center hover:border-gold/40 hover:text-parchment transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <BookOpen size={13} />
                Back to Cases
              </Link>
              <button
                onClick={handlePlayAgain}
                className="flex-1 py-3 rounded-xl border border-gold/40 text-gold label-caps hover:bg-gold hover:text-void hover:border-gold transition-colors duration-200 flex items-center justify-center gap-2"
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
  const bgs = ["#2a2a45","#1f1f35","#181828","#111120","#2a2a45","#1f1f35"];
  return (
    <div className={cn(
      "bg-surface border rounded-2xl p-5 text-center",
      status === "correct" ? "border-gold/30" : status === "escaped" ? "border-crimson/30" : "border-[#2a2a45]"
    )}>
      <p className="label-caps text-shadow text-[10px] mb-3">{label}</p>
      <div
        className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center font-serif text-base text-mist"
        style={{ backgroundColor: bgs[index % bgs.length] }}
      >
        {suspect.name.split(" ").map((n) => n[0]).join("")}
      </div>
      <p className="font-serif text-parchment">{suspect.name}</p>
      <p className="label-caps text-shadow text-[10px] mt-1">{suspect.relation}</p>
      <div className="mt-3">
        {status === "correct" && (
          <span className="label-caps text-gold border border-gold/30 bg-gold/10 px-2 py-0.5 rounded-full text-[9px]">
            Guilty
          </span>
        )}
        {status === "wrong" && (
          <span className="label-caps text-shadow border border-[#2a2a45] px-2 py-0.5 rounded-full text-[9px]">
            Innocent
          </span>
        )}
        {status === "escaped" && (
          <span className="label-caps text-crimson-light border border-crimson/30 bg-crimson/10 px-2 py-0.5 rounded-full text-[9px]">
            Escaped Justice
          </span>
        )}
      </div>
    </div>
  );
}

function ScoreStat({
  label,
  value,
  accent,
  danger,
}: {
  label: string;
  value: string;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="text-center">
      <p className={cn(
        "font-serif text-2xl",
        accent ? "text-gold" : danger ? "text-crimson-light" : "text-parchment"
      )}>
        {value}
      </p>
      <p className="label-caps text-shadow text-[10px] mt-1">{label}</p>
    </div>
  );
}
