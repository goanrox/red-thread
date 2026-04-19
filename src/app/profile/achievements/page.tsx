"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { cn } from "@/lib/utils";

interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  hint: string;
}

const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first-interrogation",
    title: "First Words",
    description: "Conducted your first interrogation.",
    icon: "💬",
    hint: "Interrogate any suspect.",
  },
  {
    id: "all-questions",
    title: "The Full Inquisition",
    description: "Exhausted all available questions with a single suspect.",
    icon: "📋",
    hint: "Ask every available question to one suspect.",
  },
  {
    id: "scene-collector",
    title: "Scene of the Crime",
    description: "Explored all scenes in a case.",
    icon: "🔍",
    hint: "Visit every scene in a single case.",
  },
  {
    id: "evidence-hound",
    title: "Evidence Hound",
    description: "Collected every clue in a case.",
    icon: "📁",
    hint: "Find all clues in a single case.",
  },
  {
    id: "first-case",
    title: "First Case",
    description: "Completed your first case.",
    icon: "📌",
    hint: "Reach the result screen in any case.",
  },
  {
    id: "perfect-accusation",
    title: "Perfect Accusation",
    description: "Solved a case correctly on the first attempt.",
    icon: "🎯",
    hint: "Accuse the correct suspect without a wrong attempt.",
  },
  {
    id: "wrong-turn",
    title: "Wrong Turn",
    description: "Accused an innocent person.",
    icon: "↩️",
    hint: "Make a wrong accusation.",
  },
  {
    id: "cold-blooded",
    title: "Cold-Blooded",
    description: "Accused a suspect with zero suspicion.",
    icon: "🧊",
    hint: "Accuse someone you never suspected.",
  },
  {
    id: "the-long-game",
    title: "The Long Game",
    description: "Returned to a case you started in a previous session.",
    icon: "⏳",
    hint: "Resume an in-progress case.",
  },
  {
    id: "master-detective",
    title: "Master Detective",
    description: "Reached the highest detective rank.",
    icon: "🏆",
    hint: "Achieve the rank of Master Detective.",
  },
];

export default function AchievementsPage() {
  const stats = useGameStore((s) => s.stats);
  const earned = new Set(stats.achievements);
  const earnedCount = ACHIEVEMENTS.filter((a) => earned.has(a.id)).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      {/* Back + header */}
      <Link
        href="/profile"
        className="flex items-center gap-1.5 label-caps text-shadow hover:text-mist transition-colors duration-200 mb-8 text-[10px]"
      >
        <ArrowLeft size={12} /> Back to Profile
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <p className="label-caps text-gold mb-3">Recognition</p>
        <h1 className="font-serif text-5xl text-parchment mb-2">Achievements</h1>
        <p className="font-serif italic text-mist text-xl">
          {earnedCount} of {ACHIEVEMENTS.length} earned.
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="mb-10">
        <div className="h-1.5 bg-[#2a2a45] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gold rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.round((earnedCount / ACHIEVEMENTS.length) * 100)}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ACHIEVEMENTS.map((achievement, i) => {
          const isEarned = earned.has(achievement.id);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={cn(
                "flex items-start gap-4 card rounded-xl p-5",
                !isEarned && "opacity-55 grayscale"
              )}
              style={isEarned ? { borderColor: "rgba(201,168,76,0.25)", borderRadius: "12px" } : { borderRadius: "12px" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={isEarned
                  ? { background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.22)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }
                  : { background: "#0c0c17", border: "1px solid rgba(42,42,69,0.8)" }
                }>
                {isEarned ? achievement.icon : "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-serif text-base mb-0.5",
                  isEarned ? "text-parchment" : "text-shadow"
                )}>
                  {isEarned ? achievement.title : "???"}
                </p>
                <p className="text-mist text-xs leading-relaxed font-serif italic">
                  {isEarned ? achievement.description : achievement.hint}
                </p>
                {isEarned && (
                  <span className="label-caps text-gold text-[9px] mt-1.5 inline-block">Earned</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
