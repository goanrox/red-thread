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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24" style={{ backgroundColor: "#141414", color: "#ffffff" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12"
      >
        <p className="text-[12px] uppercase mb-3" style={{ color: "#E50914" }}>Your Record</p>
        <h1 className="text-5xl text-white mb-2">Detective Profile</h1>
        <p className="text-xl" style={{ color: "#aaa" }}>
          Every case tells a story. This one is yours.
        </p>
      </motion.div>

      {/* Rank card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl p-6 mb-6"
        style={{
          backgroundColor: "#1a1a1a",
          border: "1px solid rgba(229,9,20,0.2)",
          background: "linear-gradient(160deg, #0d0a0a 0%, #0a0707 55%)",
        }}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] uppercase mb-1" style={{ color: "#666" }}>Current Rank</p>
            <h2 className="text-3xl" style={{ color: "#E50914" }}>{stats.currentRank}</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase mb-1" style={{ color: "#666" }}>Total Score</p>
            <p className="text-3xl text-white">{stats.totalScore.toLocaleString()}</p>
          </div>
        </div>

        {nextRank && (
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-[10px] uppercase" style={{ color: "#666" }}>{stats.currentRank}</span>
              <span className="text-[10px] uppercase" style={{ color: "#666" }}>{nextRank}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#333" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "#E50914" }}
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
            </div>
            <p className="text-[10px] uppercase mt-1.5 text-right" style={{ color: "#666" }}>
              {nextThreshold - stats.totalScore > 0
                ? `${nextThreshold - stats.totalScore} points to ${nextRank}`
                : "Rank achieved"}
            </p>
          </div>
        )}

        {/* All ranks */}
        <div className="flex flex-wrap gap-2 mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {RANK_ORDER.map((r, i) => (
            <span
              key={r}
              className="px-3 py-1 rounded-lg border text-[9px] uppercase"
              style={{
                borderColor: r === stats.currentRank ? "#E50914" : "rgba(255,255,255,0.08)",
                backgroundColor: r === stats.currentRank ? "rgba(229,9,20,0.15)" : "transparent",
                color: r === stats.currentRank ? "#E50914" : i < rankIndex ? "#aaa" : "#444",
              }}
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
          className="rounded-2xl p-6 mb-6"
          style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-[10px] uppercase mb-4" style={{ color: "#666" }}>Case History</p>
          <div className="space-y-4">
            {completedCases.map((c) => {
              const state = caseStates[c.id];
              if (!state) return null;
              return (
                <div key={c.id} className="flex items-center gap-4">
                  <div>
                    {state.isCorrect ? (
                      <CheckCircle2 size={16} style={{ color: "#4cdd8a" }} />
                    ) : (
                      <XCircle size={16} style={{ color: "#E50914" }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate">{c.title}</p>
                    <p className="text-[10px] uppercase mt-0.5" style={{ color: "#666" }}>
                      {state.isCorrect ? "Solved" : "Unsolved"} · {state.score ?? 0} pts
                    </p>
                  </div>
                  <Link
                    href={`/cases/${c.id}/result`}
                    className="text-[10px] uppercase transition-colors shrink-0"
                    style={{ color: "#aaa" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
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
          className="flex items-center justify-between w-full rounded-2xl p-5 transition-all duration-300"
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
          <div className="flex items-center gap-3">
            <Trophy size={18} style={{ color: "#E50914" }} />
            <div>
              <p className="text-white">Achievements</p>
              <p className="text-[10px] uppercase mt-0.5" style={{ color: "#666" }}>
                {stats.achievements.length} earned
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase" style={{ color: "#aaa" }}>
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
          <p className="text-lg mb-6" style={{ color: "#aaa" }}>
            No cases on record. Your story starts now.
          </p>
          <Link
            href="/cases"
            className="inline-block px-6 py-3 rounded-xl uppercase tracking-[0.1em] transition-all duration-200 text-white"
            style={{
              backgroundColor: "#E50914",
              border: "1px solid #E50914",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#cc0811";
              e.currentTarget.style.borderColor = "#cc0811";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#E50914";
              e.currentTarget.style.borderColor = "#E50914";
            }}
          >
            Browse Cases
          </Link>
        </motion.div>
      )}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

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
    <div
      className="rounded-2xl p-5 text-center"
      style={{
        backgroundColor: "#1a1a1a",
        border: accent
          ? "1px solid rgba(229,9,20,0.2)"
          : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p
        className="text-3xl font-semibold mb-1"
        style={{ color: accent ? "#E50914" : "#ffffff" }}
      >
        {value}
      </p>
      <p className="text-[9px] uppercase tracking-widest" style={{ color: "#666" }}>
        {label}
      </p>
    </div>
  );
}
