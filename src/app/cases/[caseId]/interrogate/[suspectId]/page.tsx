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
  hostile:      { label: "Hostile",      color: "#E50914" },
  nervous:      { label: "Nervous",      color: "#E50914" },
  evasive:      { label: "Evasive",      color: "#6b63d4" },
  cooperative:  { label: "Cooperative",  color: "#aaaaaa" },
  cold:         { label: "Cold",         color: "#aaaaaa" },
  "grief-stricken": { label: "Grief-stricken", color: "#aaaaaa" },
};

const TONE_CATEGORY_COLORS: Record<string, string> = {
  Alibi:         "#E50914",
  Motive:        "#E50914",
  Relationship:  "#6b63d4",
  Evidence:      "#ffffff",
  Behavior:      "#aaaaaa",
  Accusation:    "#E50914",
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
        <p className="text-aaa">Suspect not found.</p>
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
    <div className="flex h-[calc(100vh-7rem)] max-w-6xl mx-auto px-4 sm:px-6 gap-5 pb-4" style={{ backgroundColor: "#141414" }}>
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <>
        {/* Mobile backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
              className="sm:hidden fixed inset-0 z-30"
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
                "rounded-2xl flex-col gap-5 overflow-y-auto",
                "hidden sm:flex w-72 shrink-0 p-5",
                sidebarOpen && "fixed bottom-0 left-0 right-0 z-40 flex sm:relative sm:z-auto"
              )}
              style={{ backgroundColor: "#1a1a1a" }}
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
          className="sm:hidden flex items-center gap-2 mb-3 transition-colors duration-200"
          style={{ color: "#aaa" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
          onClick={() => setSidebarOpen((v) => !v)}
        >
          <User size={14} />
          <span className="text-[10px]">
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
                <div className="flex gap-1.5 rounded-2xl px-4 py-3" style={{ backgroundColor: "#222" }}>
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "#aaa" }}
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
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {allExhausted ? (
            <div className="text-center py-4">
              <p className="text-aaa mb-4">
                All questions have been asked.
              </p>
              <div className="flex justify-center gap-3">
                <Link
                  href={`/cases/${caseId}/interrogate/${prevSuspect.id}`}
                  className="text-[10px] px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1.5"
                  style={{
                    color: "#aaa",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#aaa";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <ChevronLeft size={11} />
                  {prevSuspect.name.split(" ")[0]}
                </Link>
                <Link
                  href={`/cases/${caseId}`}
                  className="text-[10px] px-3 py-2 rounded-lg transition-colors duration-200"
                  style={{
                    color: "#000",
                    backgroundColor: "#ffffff",
                    border: "1px solid #ffffff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e5e5e5";
                    e.currentTarget.style.borderColor = "#e5e5e5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.borderColor = "#ffffff";
                  }}
                >
                  Back to Hub
                </Link>
                <Link
                  href={`/cases/${caseId}/interrogate/${nextSuspect.id}`}
                  className="text-[10px] px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1.5"
                  style={{
                    color: "#aaa",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#aaa";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  {nextSuspect.name.split(" ")[0]}
                  <ChevronRight size={11} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              <p className="text-[10px] mb-3" style={{ color: "#666" }}>
                {available.length} question{available.length !== 1 ? "s" : ""} available
              </p>
              {available.map((q) => (
                <button
                  key={q.id}
                  onClick={() => !typing && handleAsk(q)}
                  disabled={typing}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-sm leading-snug transition-all duration-300"
                  )}
                  style={{
                    backgroundColor: "#222",
                    color: "#ffffff",
                    border: `1px solid ${q.isKeyQuestion ? "#E50914" : "rgba(255,255,255,0.08)"}`,
                    opacity: typing ? 0.5 : 1,
                    cursor: typing ? "not-allowed" : "pointer",
                    borderLeft: `3px solid ${TONE_CATEGORY_COLORS[q.category] || "#E50914"}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!typing) {
                      e.currentTarget.style.backgroundColor = "#333";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#222";
                    e.currentTarget.style.borderColor = q.isKeyQuestion ? "#E50914" : "rgba(255,255,255,0.08)";
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span>{q.text}</span>
                    {q.isKeyQuestion && (
                      <span className="text-[9px] shrink-0 mt-0.5" style={{ color: "#E50914" }}>Key</span>
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
        className="max-w-sm px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed"
        style={{
          background: "rgba(229,9,20,0.12)",
          border: "1px solid rgba(229,9,20,0.3)",
          boxShadow: "inset 0 1px 0 rgba(229,9,20,0.15), 0 2px 12px rgba(0,0,0,0.4)",
          color: "#ffffff",
        }}
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
            <span className="text-[9px]" style={{ color: toneConfig.color }}>
              {toneConfig.label}
            </span>
          </div>
        )}
        <div className="rounded-2xl rounded-tl-sm px-4 py-3" style={{ backgroundColor: "#222", color: "#ffffff" }}>
          <p className="text-sm leading-relaxed">{text}</p>
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
          className="w-18 h-18 rounded-full mx-auto mb-3 flex items-center justify-center text-xl"
          style={{
            width: "72px", height: "72px",
            background: `radial-gradient(circle at 30% 30%, ${getAvatarBg(suspectIndex)}cc, ${getAvatarBg(suspectIndex)})`,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 16px rgba(0,0,0,0.5)",
            color: "#aaa",
          }}
        >
          {suspect.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <h3 className="text-lg" style={{ color: "#ffffff" }}>{suspect.name}</h3>
        <p className="text-[10px] mt-0.5" style={{ color: "#666" }}>{suspect.relation}</p>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

      {/* Suspicion meter */}
      <div>
        <div className="flex justify-between mb-1.5">
          <span className="text-[10px]" style={{ color: "#666" }}>Suspicion</span>
          <span className="text-[10px]" style={{
            color: suspicion >= 60 ? "#E50914" : suspicion >= 30 ? "#E50914" : "#666"
          }}>{suspicion}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#222" }}>
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: suspicion >= 60 ? "#E50914" : suspicion >= 30 ? "#E50914" : "#aaa"
            }}
            initial={{ width: 0 }}
            animate={{ width: `${suspicion}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-[10px] mt-1.5" style={{ color: "#666" }}>{asked}/{total} questions asked</p>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

      {/* Background */}
      <div>
        <p className="text-[9px] uppercase tracking-widest mb-2" style={{ color: "#666" }}>Background</p>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          {suspect.background}
        </p>
      </div>

      {suspect.traits && suspect.traits.length > 0 && (
        <div>
          <p className="text-[9px] uppercase tracking-widest mb-2" style={{ color: "#666" }}>Traits</p>
          <div className="flex flex-wrap gap-1.5">
            {suspect.traits.map((trait) => (
              <span
                key={trait}
                className="text-[9px] px-2 py-0.5 rounded capitalize"
                style={{
                  backgroundColor: "#222",
                  color: "#aaa",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

      {/* Suspect navigation */}
      <div className="flex gap-2">
        {caseData.suspects.map((s) => {
          const isActive = s.id === suspect.id;
          const initials = s.name.split(" ").map((n) => n[0]).join("");
          return (
            <Link
              key={s.id}
              href={`/cases/${caseId}/interrogate/${s.id}`}
              className="flex-1 flex flex-col items-center gap-1 py-2 rounded transition-all duration-200"
              style={{
                backgroundColor: isActive ? "rgba(229,9,20,0.1)" : "transparent",
                border: isActive ? "1px solid rgba(229,9,20,0.3)" : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (\!isActive) e.currentTarget.style.backgroundColor = "#222";
              }}
              onMouseLeave={(e) => {
                if (\!isActive) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <span className="text-[10px]" style={{ color: isActive ? "#E50914" : "#aaa" }}>
                {initials}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

// ─── Suspect avatar ───────────────────────────────────────────────────────────

function SuspectAvatar({ index, name }: { index: number; name: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("");
  return (
    <div
      className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs"
      style={{
        background: `radial-gradient(circle at 30% 30%, ${getAvatarBg(index)}cc, ${getAvatarBg(index)})`,
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#aaa",
      }}
    >
      {initials}
    </div>
  );
}

// ─── Avatar background helper ─────────────────────────────────────────────────

function getAvatarBg(index: number): string {
  const palette = ["#2a1a1a", "#1a1a2a", "#1a2a1a", "#2a2a1a", "#1a2a2a", "#2a1a2a"];
  return palette[index % palette.length];
}
