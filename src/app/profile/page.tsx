"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Star, CheckCircle2, XCircle, BookOpen } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { getAllCases } from "@/data";
import { cn } from "@/lib/utils";
import type { DetectiveRank } from "@/types";

const RANK_ORDER: DetectiveRank[] = [
  "Rookie", "Investigator", "Detective", "Senior Detective", "Chief Inspector", "Master Detective"
];

const RANK_THRESHOLDS = [0, 500, 1200, 2500, 4500, 7500];

export default function ProfilePage() {
  const stats = useGameStore((s) => s.stats);
  const caseStates = useGameStore((s) => s.cases);
  const allCases = getAllCases();

  const completedCases = allCases.filter((c) => caseStates[c.id]?.isComplete);
  const accuracyRate =
    stats.totalCasesCompleted > 0
      ? Math.round((stats.totalCasesSolved / stats.totalCasesCompleted) * 100)
      : 0;

  const rankIndex = RANK_ORDER.indexOf(stats.currentRank);
  const nextRank = RANK_ORDER[rankIndex + 1] ?? null;
  const currentThreshold = RANK_THRESHOLDS[rankIndex] ?? 0;
  const nextThreshold = RANK_THRESHOLDS[rankIndex + 1] ?? currentThreshold;
  const progressToNext = nextRank
    ? Math.round(((stats.totalScore - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
    : 100;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12"
      >
        <p className="label-caps text-gold mb-3">Your Record</p>
        <h1 className="font-serif text-5xl text-parchment mb-2">Detective Profile</h1>
        <p className="font-serif italic text-mist text-xl">
          Every case tells a story. This one is yours.
        </p>
      </motion.div>

      {/* Rank card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-surface border border-gold/20 rounded-2xl p-6 mb-6"
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="label-caps text-shadow mb-1">Current Rank</p>
            <h2 className="font-serif text-3xl text-gold">{stats.currentRank}</h2>
          </div>
          <div className="text-right">
            <p className="label-caps text-shadow mb-1">Total Score</p>
            <p className="font-serif text-3xl text-parchment">{stats.totalScore.toLocaleString()}</p>
          </div>
        </div>

        {nextRank && (
          <div>
            <div className="flex justify-between mb-2">
              <span className="label-caps text-shadow text-[10px]">{stats.currentRank}</span>
              <span className="label-caps text-shadow text-[10px]">{nextRank}</span>
            </div>
            <div className="h-1.5 bg-[#2a2a45] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gold rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
            </div>
            <p className="label-caps text-shadow text-[10px] mt-1.5 text-right">
              {nextThreshold - stats.totalScore > 0
                ? `${nextThreshold - stats.totalScore} points to ${nextRank}`
                : "Rank achieved"}
            </p>
          </div>
        )}

        {/* All ranks */}
        <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-[#2a2a45]">
          {RANK_ORDER.map((r, i) => (
            <span
              key={r}
              className={cn(
                "label-caps px-3 py-1 rounded-lg border text-[9px]",
                r === stats.currentRank
                  ? "border-gold bg-gold/15 text-gold"
                  : i < rankIndex
                  ? "border-[#2a2a45] text-shadow"
                  : "border-[#2a2a45] text-[#2a2a45]"
              )}
            >
              {r}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Career stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
      >
        <StatCard label="Cases Started" value={stats.totalCasesStarted} />
        <StatCard label="Cases Solved" value={stats.totalCasesSolved} accent />
        <StatCard label="Cases Completed" value={stats.totalCasesCompleted} />
        <StatCard label="Accuracy Rate" value={`${accuracyRate}%`} accent={accuracyRate === 100} />
      </motion.div>

      {/* Case history */}
      {completedCases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-surface border border-[#2a2a45] rounded-2xl p-6 mb-6"
        >
          <p className="label-caps text-shadow mb-4">Case History</p>
          <div className="space-y-4">
            {completedCases.map((c) => {
              const state = caseStates[c.id];
              if (!state) return null;
              return (
                <div key={c.id} className="flex items-center gap-4">
                  <div>
                    {state.isCorrect ? (
                      <CheckCircle2 size={16} className="text-gold" />
                    ) : (
                      <XCircle size={16} className="text-crimson-light" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-parchment truncate">{c.title}</p>
                    <p className="label-caps text-shadow text-[10px] mt-0.5">
                      {state.isCorrect ? "Solved" : "Unsolved"} · {state.score ?? 0} pts
                    </p>
                  </div>
                  <Link
                    href={`/cases/${c.id}/result`}
                    className="label-caps text-shadow text-[10px] hover:text-mist transition-colors shrink-0"
                  >
                    Review →
                  </Link>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Achievements link */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <Link
          href="/profile/achievements"
          className="flex items-center justify-between w-full bg-surface border border-[#2a2a45] rounded-2xl p-5 hover:border-gold/40 transition-colors duration-200 group"
        >
          <div className="flex items-center gap-3">
            <Trophy size={18} className="text-gold" />
            <div>
              <p className="font-serif text-parchment">Achievements</p>
              <p className="label-caps text-shadow text-[10px] mt-0.5">
                {stats.achievements.length} earned
              </p>
            </div>
          </div>
          <span className="label-caps text-shadow group-hover:text-gold transition-colors duration-200 text-[10px]">
            View All →
          </span>
        </Link>
      </motion.div>

      {stats.totalCasesStarted === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="font-serif italic text-mist text-lg mb-6">
            No cases on record yet. Your career begins with the first case.
          </p>
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 label-caps text-gold border border-gold/40 hover:bg-gold hover:text-void px-5 py-3 rounded-xl transition-colors duration-200"
          >
            <BookOpen size={14} />
            Browse Cases
          </Link>
        </motion.div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="bg-surface border border-[#2a2a45] rounded-xl p-4 text-center">
      <p className={cn("font-serif text-3xl", accent ? "text-gold" : "text-parchment")}>
        {value}
      </p>
      <p className="label-caps text-shadow text-[10px] mt-1">{label}</p>
    </div>
  );
}
