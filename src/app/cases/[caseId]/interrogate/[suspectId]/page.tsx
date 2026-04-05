"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { getCaseById } from "@/data";
import { availableQuestions, suspicionLevel } from "@/lib/caseEngine";
import { cn } from "@/lib/utils";
import type { Question, SuspectTone } from "@/types";

// ─── Tone indicators ──────────────────────────────────────────────────────────

const TONE_CONFIG: Record<SuspectTone, { label: string; color: string }> = {
  hostile:      { label: "Hostile",      color: "#8b2232" },
  nervous:      { label: "Nervous",      color: "#c9a84c" },
  evasive:      { label: "Evasive",      color: "#6b63d4" },
  cooperative:  { label: "Cooperative",  color: "#5c5a78" },
  cold:         { label: "Cold",         color: "#a8a5c0" },
  "grief-stricken": { label: "Grief-stricken", color: "#5c5a78" },
};

const TONE_CATEGORY_COLORS: Record<string, string> = {
  Alibi:         "#c9a84c",
  Motive:        "#8b2232",
  Relationship:  "#6b63d4",
  Evidence:      "#f0ece0",
  Behavior:      "#a8a5c0",
  Accusation:    "#c13248",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  type: "player" | "suspect";
  text: string;
  tone?: SuspectTone;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InterrogationPage({
  params,
}: {
  params: Promise<{ caseId: string; suspectId: string }>;
}) {
  const { caseId, suspectId } = use(params);

  const caseData = getCaseById(caseId);
  const gameState = useGameStore((s) => s.cases[caseId]);
  const { startCase, askQuestion } = useGameStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suspect = caseData?.suspects.find((s) => s.id === suspectId);

  useEffect(() => {
    if (caseData && !gameState) startCase(caseId);
  }, [caseId, caseData, gameState, startCase]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Initialise with suspect greeting
  useEffect(() => {
    if (!suspect) return;
    setMessages([
      {
        id: "intro",
        type: "suspect",
        text: `${suspect.description}`,
        tone: suspect.initialTone,
      },
    ]);
  }, [suspect?.id]);

  if (!caseData || !suspect) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-mist font-serif italic">Suspect not found.</p>
      </div>
    );
  }

  const available = gameState
    ? availableQuestions(suspect.questions, gameState, suspect.id)
    : suspect.questions.filter((q) => !q.requiresClueId && !q.requiresQuestionId);

  const asked = gameState?.askedQuestions[suspect.id] ?? [];
  const allExhausted = available.length === 0;
  const suspicion = gameState ? suspicionLevel(suspectId, caseData, gameState) : 0;

  function handleAsk(question: Question) {
    setMessages((prev) => [
      ...prev,
      { id: `q-${question.id}`, type: "player", text: question.text },
    ]);

    askQuestion(caseId, suspect!.id, question.id);

    setTyping(true);
    const delay = 900 + Math.random() * 500;
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${question.id}`,
          type: "suspect",
          text: question.response,
          tone: question.tone,
        },
      ]);
    }, delay);
  }

  const suspectIndex = caseData.suspects.findIndex((s) => s.id === suspectId);
  const nextSuspect = caseData.suspects[(suspectIndex + 1) % caseData.suspects.length];
  const prevSuspect =
    caseData.suspects[(suspectIndex - 1 + caseData.suspects.length) % caseData.suspects.length];

  return (
    <div className="flex h-[calc(100vh-7rem)] max-w-6xl mx-auto px-4 sm:px-6 gap-5 pb-4">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <>
        {/* Mobile backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sm:hidden fixed inset-0 z-30 bg-void/80"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar panel */}
        <AnimatePresence>
          {(sidebarOpen || true) && (
            <motion.aside
              initial={false}
              className={cn(
                "bg-surface border border-[#2a2a45] rounded-2xl flex-col gap-5 overflow-y-auto",
                "hidden sm:flex w-72 shrink-0 p-5",
                // Mobile: absolute overlay
                sidebarOpen && "fixed bottom-0 left-0 right-0 z-40 flex sm:relative sm:z-auto"
              )}
            >
              <SidebarContent
                suspect={suspect}
                suspicion={suspicion}
                suspectIndex={suspectIndex}
                caseData={caseData}
                caseId={caseId}
                asked={asked.length}
                total={suspect.questions.length}
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </>

      {/* ── Chat area ───────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile profile toggle */}
        <button
          className="sm:hidden flex items-center gap-2 mb-3 text-mist hover:text-parchment transition-colors duration-200"
          onClick={() => setSidebarOpen((v) => !v)}
        >
          <User size={14} />
          <span className="label-caps text-[10px]">
            {suspect.name} · View Profile
          </span>
        </button>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i === messages.length - 1 ? 0 : 0 }}
            >
              {msg.type === "player" ? (
                <PlayerBubble text={msg.text} />
              ) : (
                <SuspectBubble
                  text={msg.text}
                  tone={msg.tone}
                  name={suspect.name}
                  index={suspectIndex}
                />
              )}
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {typing && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <SuspectAvatar index={suspectIndex} name={suspect.name} />
                <div className="flex gap-1.5 bg-surface border border-[#2a2a45] rounded-2xl px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 bg-mist rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={chatEndRef} />
        </div>

        {/* ── Question panel ──────────────────────────────────────── */}
        <div className="mt-4 border-t border-[#2a2a45] pt-4">
          {allExhausted ? (
            <div className="text-center py-4">
              <p className="font-serif italic text-mist mb-4">
                All questions have been asked.
              </p>
              <div className="flex justify-center gap-3">
                <Link
                  href={`/cases/${caseId}/interrogate/${prevSuspect.id}`}
                  className="label-caps text-[10px] text-shadow hover:text-mist border border-[#2a2a45] px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1.5"
                >
                  <ChevronLeft size={11} />
                  {prevSuspect.name.split(" ")[0]}
                </Link>
                <Link
                  href={`/cases/${caseId}`}
                  className="label-caps text-[10px] text-gold border border-gold/40 px-3 py-2 rounded-lg hover:bg-gold hover:text-void transition-colors duration-200"
                >
                  Back to Hub
                </Link>
                <Link
                  href={`/cases/${caseId}/interrogate/${nextSuspect.id}`}
                  className="label-caps text-[10px] text-shadow hover:text-mist border border-[#2a2a45] px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1.5"
                >
                  {nextSuspect.name.split(" ")[0]}
                  <ChevronRight size={11} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              <p className="label-caps text-shadow text-[10px] mb-3">
                {available.length} question{available.length !== 1 ? "s" : ""} available
              </p>
              {available.map((q) => (
                <button
                  key={q.id}
                  onClick={() => !typing && handleAsk(q)}
                  disabled={typing}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border border-[#2a2a45] bg-surface",
                    "font-serif text-parchment text-sm leading-snug",
                    "transition-colors duration-200",
                    q.isKeyQuestion && "border-gold/20",
                    typing
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:border-gold/40 hover:bg-surface2 cursor-pointer"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span>{q.text}</span>
                    {q.isKeyQuestion && (
                      <span className="label-caps text-gold text-[9px] shrink-0 mt-0.5">Key</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Chat bubbles ─────────────────────────────────────────────────────────────

function PlayerBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-sm px-4 py-3 rounded-2xl rounded-tr-sm text-parchment text-sm leading-relaxed font-serif"
        style={{ backgroundColor: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)" }}
      >
        {text}
      </div>
    </div>
  );
}

function SuspectBubble({
  text,
  tone,
  name,
  index,
}: {
  text: string;
  tone?: SuspectTone;
  name: string;
  index: number;
}) {
  const toneConfig = tone ? TONE_CONFIG[tone] : null;

  return (
    <div className="flex items-start gap-3 max-w-[85%]">
      <SuspectAvatar index={index} name={name} />
      <div className="flex flex-col gap-1">
        {toneConfig && (
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: toneConfig.color }}
            />
            <span className="label-caps text-[9px]" style={{ color: toneConfig.color }}>
              {toneConfig.label}
            </span>
          </div>
        )}
        <div className="bg-surface border border-[#2a2a45] rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="font-serif italic text-parchment text-sm leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar content ──────────────────────────────────────────────────────────

function SidebarContent({
  suspect,
  suspicion,
  suspectIndex,
  caseData,
  caseId,
  asked,
  total,
}: {
  suspect: NonNullable<ReturnType<typeof getCaseById>>["suspects"][number];
  suspicion: number;
  suspectIndex: number;
  caseData: NonNullable<ReturnType<typeof getCaseById>>;
  caseId: string;
  asked: number;
  total: number;
}) {
  return (
    <>
      {/* Avatar + name */}
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center font-serif text-xl text-mist"
          style={{ backgroundColor: getAvatarBg(suspectIndex) }}
        >
          {suspect.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <h3 className="font-serif text-lg text-parchment">{suspect.name}</h3>
        <p className="label-caps text-shadow text-[10px] mt-0.5">{suspect.relation}</p>
      </div>

      <div className="divider-gold" />

      {/* Suspicion meter */}
      <div>
        <div className="flex justify-between mb-1.5">
          <span className="label-caps text-shadow text-[10px]">Suspicion</span>
          <span className={cn("label-caps text-[10px]",
            suspicion >= 60 ? "text-crimson-light" : suspicion >= 30 ? "text-gold" : "text-shadow"
          )}>{suspicion}%</span>
        </div>
        <div className="h-1.5 bg-[#2a2a45] rounded-full overflow-hidden">
          <motion.div
            className={cn(
              "h-full rounded-full",
              suspicion >= 60 ? "bg-crimson-light" : suspicion >= 30 ? "bg-gold" : "bg-[#5c5a78]"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${suspicion}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="label-caps text-shadow text-[10px] mt-1.5">{asked}/{total} questions asked</p>
      </div>

      <div className="divider-gold" />

      {/* Alibi */}
      <div>
        <p className="label-caps text-shadow text-[10px] mb-2">Known Alibi</p>
        <p className="font-serif italic text-mist text-xs leading-relaxed">{suspect.alibi}</p>
      </div>

      {/* Other suspects */}
      <div>
        <p className="label-caps text-shadow text-[10px] mb-2">Other Suspects</p>
        <div className="flex flex-col gap-1">
          {caseData.suspects
            .filter((s) => s.id !== suspect.id)
            .map((s, i) => (
              <Link
                key={s.id}
                href={`/cases/${caseId}/interrogate/${s.id}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface2 transition-colors duration-150"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-serif text-mist"
                  style={{ backgroundColor: getAvatarBg(i >= suspectIndex ? i + 1 : i) }}
                >
                  {s.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <span className="text-mist text-xs font-serif truncate">{s.name}</span>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_BG = ["#2a2a45", "#1f1f35", "#181828", "#111120", "#2a2a45", "#1f1f35"];

function getAvatarBg(index: number) {
  return AVATAR_BG[index % AVATAR_BG.length];
}

function SuspectAvatar({ index, name }: { index: number; name: string }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-serif text-mist shrink-0"
      style={{ backgroundColor: getAvatarBg(index) }}
    >
      {initials}
    </div>
  );
}
