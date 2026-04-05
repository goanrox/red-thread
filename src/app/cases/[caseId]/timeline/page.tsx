"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { getCaseById } from "@/data";
import { cn } from "@/lib/utils";

export default function TimelinePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = use(params);
  const caseData = getCaseById(caseId);
  const gameState = useGameStore((s) => s.cases[caseId]);

  if (!caseData) return null;

  const discovered = gameState?.discoveredClueIds ?? [];
  const sorted = [...caseData.timeline].sort((a, b) => a.sortKey - b.sortKey);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-24">
      <Link
        href={`/cases/${caseId}`}
        className="flex items-center gap-1.5 label-caps text-shadow hover:text-mist transition-colors duration-200 mb-8 text-[10px]"
      >
        <ArrowLeft size={12} /> Back to Investigation
      </Link>

      <div className="mb-10">
        <p className="label-caps text-gold mb-2">Case Timeline</p>
        <h1 className="font-serif text-4xl text-parchment">The Night of November 9th</h1>
      </div>

      <div className="relative">
        {/* Connector line */}
        <div
          className="absolute left-[88px] top-0 bottom-0 w-px"
          style={{ background: "linear-gradient(to bottom, transparent, #c9a84c44, transparent)" }}
        />

        <div className="space-y-8">
          {sorted.map((event, i) => {
            const isKey = event.isKeyEvent;
            const hasClue = event.clueIds?.some((id) => discovered.includes(id));

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex gap-6"
              >
                <div className="w-20 shrink-0 pt-0.5 text-right">
                  <span className="font-serif text-gold text-sm">{event.time}</span>
                </div>

                <div
                  className={cn(
                    "absolute left-[82px] top-[52px] w-3 h-3 rounded-full border-2 z-10",
                    isKey ? "border-gold bg-gold/30" : "border-[#2a2a45] bg-void"
                  )}
                  style={{ top: `${i * 96 + 4}px` }}
                />

                <div
                  className={cn(
                    "flex-1 border rounded-xl p-4 ml-6",
                    isKey ? "border-gold/30 bg-surface" : "border-[#2a2a45] bg-surface"
                  )}
                >
                  <p className="text-parchment text-sm leading-relaxed font-serif">
                    {event.description}
                  </p>
                  {hasClue && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <FileText size={11} className="text-iris" />
                      <span className="label-caps text-iris text-[10px]">Linked to evidence</span>
                    </div>
                  )}
                  {isKey && !hasClue && (
                    <span className="label-caps text-gold text-[10px] mt-1.5 inline-block">Key event</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
