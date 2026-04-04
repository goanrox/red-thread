import type { ScoreBreakdown, DetectiveRank } from "@/types";

const RANK_THRESHOLDS: { score: number; rank: DetectiveRank }[] = [
  { score: 0,   rank: "Rookie" },
  { score: 500, rank: "Investigator" },
  { score: 1200, rank: "Detective" },
  { score: 2500, rank: "Senior Detective" },
  { score: 4500, rank: "Chief Inspector" },
  { score: 7500, rank: "Master Detective" },
];

export function calculateScore(params: {
  isCorrect: boolean;
  cluesFound: number;
  totalClues: number;
  questionsAsked: number;
  totalQuestions: number;
  timeElapsedMs: number;
}): ScoreBreakdown {
  if (!params.isCorrect) {
    return { base: 0, clueBonus: 0, speedBonus: 0, penalty: 0, total: 0, rank: "Rookie" };
  }

  const base = 500;
  const clueBonus = Math.round((params.cluesFound / params.totalClues) * 300);
  const questionBonus = Math.round((params.questionsAsked / params.totalQuestions) * 200);

  const minutes = params.timeElapsedMs / 60000;
  const speedBonus = minutes < 15 ? 150 : minutes < 30 ? 75 : 0;

  const total = base + clueBonus + questionBonus + speedBonus;

  return {
    base,
    clueBonus: clueBonus + questionBonus,
    speedBonus,
    penalty: 0,
    total,
    rank: scoreToRank(total),
  };
}

export function scoreToRank(score: number): DetectiveRank {
  let rank: DetectiveRank = "Rookie";
  for (const threshold of RANK_THRESHOLDS) {
    if (score >= threshold.score) rank = threshold.rank;
  }
  return rank;
}

export function rankProgress(totalScore: number): number {
  const current = RANK_THRESHOLDS.findLast((t) => totalScore >= t.score);
  const next = RANK_THRESHOLDS.find((t) => totalScore < t.score);
  if (!current || !next) return 100;
  const progress = ((totalScore - current.score) / (next.score - current.score)) * 100;
  return Math.round(progress);
}
