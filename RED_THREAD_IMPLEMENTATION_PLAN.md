# Red Thread — Full Implementation Plan
### Next.js · TypeScript · Tailwind CSS · GitHub + Vercel

> A practical, deployment-ready technical blueprint for building a premium cinematic mystery-solving web app.

---

## Table of Contents

1. [Full Sitemap](#1-full-sitemap)
2. [Folder Structure](#2-folder-structure)
3. [Component Architecture](#3-component-architecture)
4. [App State Structure](#4-app-state-structure)
5. [Mystery Data Model](#5-mystery-data-model)
6. [Reusable UI Component List](#6-reusable-ui-component-list)
7. [Animation & Interaction System](#7-animation--interaction-system)
8. [Local Storage & Save Progress Plan](#8-local-storage--save-progress-plan)
9. [Future AI Integration Plan](#9-future-ai-integration-plan)
10. [Phased Build Roadmap](#10-phased-build-roadmap)

---

## 1. Full Sitemap

```
/                                    Landing page (hero, featured case, category grid)
│
├── /cases                           Case selection browser
│   ├── ?category=[id]               Filtered by category
│   └── /[caseId]                    Investigation hub (tabbed main gameplay)
│       ├── /interrogate             Suspect roster overview
│       │   └── /[suspectId]         Individual interrogation chat
│       ├── /evidence                Full evidence board view
│       ├── /timeline                Case timeline analysis
│       ├── /accuse                  Final accusation selector
│       └── /result                  Case reveal + score + rank
│
├── /profile                         Detective profile + career stats
│   └── /achievements                Badges and milestones earned
│
├── /about                           Product story, how-to-play
│
└── /api                             (Server routes, no UI)
    ├── /api/interrogate             AI suspect response endpoint (Phase 3)
    └── /api/cases                   Dynamic case fetching endpoint (Phase 4)
```

**Notes:**
- All `/cases/[caseId]/*` routes share a persistent layout wrapper with the case nav bar.
- `/profile` requires localStorage state; no auth in MVP.
- `/api/*` routes are Next.js Route Handlers (`route.ts`), added in Phase 3+.
- No 404 page needed in MVP — Next.js handles it. Add a custom `not-found.tsx` in Phase 2.

---

## 2. Folder Structure

```
red-thread/
│
├── public/
│   └── fonts/                       (Optional: self-hosted fonts if moving off Google)
│
├── src/
│   │
│   ├── app/                         Next.js 14 App Router
│   │   ├── layout.tsx               Root layout — fonts, metadata, body wrapper
│   │   ├── page.tsx                 Landing page
│   │   ├── globals.css              Tailwind directives + global CSS vars
│   │   ├── not-found.tsx            Global 404 page
│   │   │
│   │   ├── cases/
│   │   │   ├── layout.tsx           Shared cases layout (none needed yet)
│   │   │   ├── page.tsx             Case browser
│   │   │   └── [caseId]/
│   │   │       ├── layout.tsx       Case shell layout — persistent nav bar
│   │   │       ├── page.tsx         Investigation hub (tabs: Overview, Suspects,
│   │   │       │                    Evidence, Timeline, Notes)
│   │   │       ├── interrogate/
│   │   │       │   ├── page.tsx     Suspect list (redirects to hub)
│   │   │       │   └── [suspectId]/
│   │   │       │       └── page.tsx Chat interrogation screen
│   │   │       ├── evidence/
│   │   │       │   └── page.tsx     Full-page evidence board
│   │   │       ├── timeline/
│   │   │       │   └── page.tsx     Full-page timeline view
│   │   │       ├── accuse/
│   │   │       │   └── page.tsx     Accusation selection screen
│   │   │       └── result/
│   │   │           └── page.tsx     Reveal, narrative, score, rank
│   │   │
│   │   ├── profile/
│   │   │   ├── page.tsx             Detective profile + stats
│   │   │   └── achievements/
│   │   │       └── page.tsx         Achievement gallery
│   │   │
│   │   ├── about/
│   │   │   └── page.tsx             How-to-play + product story
│   │   │
│   │   └── api/                     Phase 3+ server routes
│   │       ├── interrogate/
│   │       │   └── route.ts         AI interrogation endpoint
│   │       └── cases/
│   │           └── route.ts         Dynamic case API (Phase 4)
│   │
│   ├── components/
│   │   │
│   │   ├── ui/                      Primitive, stateless UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Drawer.tsx           Mobile side panel
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Progress.tsx         Progress bar + ring variants
│   │   │   ├── Tabs.tsx             Tab bar component
│   │   │   ├── Divider.tsx          Gold divider line
│   │   │   ├── Spinner.tsx          Loading spinner
│   │   │   ├── EmptyState.tsx       Reusable empty state
│   │   │   └── Avatar.tsx           Gradient initial avatar
│   │   │
│   │   ├── layout/                  Page-level structural components
│   │   │   ├── Navigation.tsx       Top nav bar
│   │   │   ├── CaseNav.tsx          In-case persistent navigation
│   │   │   ├── Footer.tsx           Site footer
│   │   │   └── PageWrapper.tsx      Atmospheric bg + noise overlay
│   │   │
│   │   ├── landing/                 Landing page sections
│   │   │   ├── Hero.tsx             Full-screen hero + animated tagline
│   │   │   ├── FeaturedCase.tsx     Featured case highlight cards
│   │   │   ├── CategoryGrid.tsx     Mystery category cards
│   │   │   └── HowItWorks.tsx       4-step explainer section
│   │   │
│   │   ├── case/                    Case gameplay components
│   │   │   ├── CaseCard.tsx         Case browser card (with progress)
│   │   │   ├── CaseBriefingModal.tsx  Intro briefing overlay
│   │   │   ├── SceneCard.tsx        Clickable scene entry point
│   │   │   ├── SceneModal.tsx       Full narrative scene view
│   │   │   ├── SuspectCard.tsx      Suspect profile card
│   │   │   ├── SuspectMini.tsx      Compact suspect entry (roster)
│   │   │   ├── VictimCard.tsx       Victim profile display
│   │   │   ├── ProgressStats.tsx    Case progress summary widget
│   │   │   └── DifficultyBadge.tsx  Dot-based difficulty display
│   │   │
│   │   ├── interrogation/           Chat system components
│   │   │   ├── ChatInterface.tsx    Full interrogation chat layout
│   │   │   ├── ChatBubble.tsx       Individual message bubble
│   │   │   ├── TypingIndicator.tsx  Animated "..." waiting state
│   │   │   ├── QuestionPanel.tsx    Available question list
│   │   │   ├── QuestionItem.tsx     Single question button
│   │   │   └── ToneIndicator.tsx    Colored tone label (Hostile, Nervous…)
│   │   │
│   │   ├── evidence/                Evidence board components
│   │   │   ├── EvidenceBoard.tsx    Full board layout with filters
│   │   │   ├── ClueCard.tsx         Evidence item card
│   │   │   ├── ClueModal.tsx        Full clue analysis overlay
│   │   │   ├── ClueFilter.tsx       Type filter bar
│   │   │   ├── SuspectEvidenceMap.tsx  Evidence-by-suspect view
│   │   │   └── LockedClue.tsx       Placeholder for undiscovered items
│   │   │
│   │   ├── timeline/                Timeline components
│   │   │   ├── TimelineView.tsx     Vertical timeline layout
│   │   │   └── TimelineEvent.tsx    Single event with suspects + clue links
│   │   │
│   │   ├── accusation/              Accusation flow components
│   │   │   ├── SuspectSelector.tsx  Clickable selection grid
│   │   │   ├── AccusationConfirm.tsx  Confirmation + warning panel
│   │   │   └── SuspectAccuseCard.tsx  Accusation card variant
│   │   │
│   │   └── result/                  Result screen components
│   │       ├── VerdictBanner.tsx    Correct/Incorrect reveal
│   │       ├── AccusationVsTruth.tsx  Side-by-side comparison
│   │       ├── NarrativeReveal.tsx  Prose ending display
│   │       ├── TwistReveal.tsx      Hidden truth panel
│   │       ├── KillerTell.tsx       "What gave them away" section
│   │       ├── CaseReport.tsx       Stat breakdown cards
│   │       ├── ScoreBreakdown.tsx   Score bar chart
│   │       └── RankDisplay.tsx      Detective rank progression
│   │
│   ├── data/
│   │   ├── index.ts                 Case registry + lookup helpers
│   │   ├── categories.ts            Category definitions
│   │   └── cases/
│   │       ├── thornwood.ts         The Thornwood Affair (Phase 1)
│   │       ├── noir-city.ts         Noir Detective case (Phase 2)
│   │       └── cold-case.ts         Cold Case Revival (Phase 2)
│   │
│   ├── store/
│   │   ├── gameStore.ts             Main Zustand store (game state + persistence)
│   │   ├── uiStore.ts               UI state (modals, active panels — NOT persisted)
│   │   └── index.ts                 Barrel export
│   │
│   ├── types/
│   │   ├── case.ts                  Case, Suspect, Clue, Scene, Timeline types
│   │   ├── game.ts                  ActiveCaseState, PlayerStats, GameState types
│   │   ├── ui.ts                    UI-specific types (view modes, tab names)
│   │   └── index.ts                 Barrel re-export
│   │
│   ├── lib/
│   │   ├── utils.ts                 cn(), clamp(), percentage(), suspicionColor()
│   │   ├── scoring.ts               Score calculation + rank logic
│   │   ├── caseEngine.ts            Clue unlock logic, scene gating, progress calc
│   │   └── aiClient.ts              AI API wrapper (Phase 3) — stubbed in Phase 1
│   │
│   └── hooks/
│       ├── useCase.ts               Combines store + case data into one interface
│       ├── useSuspect.ts            Per-suspect state + available questions
│       ├── useProgress.ts           Case completion percentage helpers
│       └── useKeyboard.ts           Keyboard navigation for desktop (Phase 2)
│
├── .env.local                       Never committed — AI keys live here
├── .env.example                     Committed — shows required var names (no values)
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
└── README.md
```

---

## 3. Component Architecture

### Design Principles

**1. Three tiers of components:**

```
Tier 1 — Primitives (src/components/ui/)
  Stateless. Accept only props. Never touch the store.
  Examples: Button, Badge, Card, Modal, Spinner

Tier 2 — Domain Components (src/components/case/, evidence/, etc.)
  Contain game-domain logic. May read from store.
  Never call store.set() — pass callbacks from parent.

Tier 3 — Page-Level Containers (src/app/**/page.tsx)
  Own the interaction logic. Connect to store.
  Compose Tier 1 + Tier 2 components. Handle routing.
```

**2. Server vs. Client components:**

```typescript
// Server component (default) — static, data-fetching, SEO
// src/app/cases/page.tsx
export default function CasesPage() { ... }

// Client component — interactive, uses hooks, store access
// Mark explicitly at the top of the file
"use client";
export default function InterrogationPage() { ... }
```

**Rule:** Everything in `src/components/` that uses `useState`, `useEffect`, Zustand, or event handlers must have `"use client"` at the top. Everything else should be a server component by default.

**3. Custom hooks encapsulate store reads:**

```typescript
// src/hooks/useCase.ts
// Wraps store + caseData into a single clean interface
export function useCase(caseId: string) {
  const store = useGameStore();
  const caseData = getCaseById(caseId);
  const state = store.activeCases[caseId];

  return {
    caseData,
    state,
    discoveredClues: state?.discoveredClues ?? [],
    score: state?.score ?? 0,
    progress: calculateProgress(state, caseData),
    discoverClue: (id: string) => store.discoverClue(caseId, id),
    // ...etc
  };
}
```

This pattern keeps pages clean and makes testing significantly easier.

### Component Dependency Graph

```
page.tsx (Container)
  └── CaseNav (layout)
  └── [Tab content]
        ├── SuspectCard (domain)
        │     ├── Avatar (ui)
        │     ├── Badge (ui)
        │     └── Progress (ui)
        ├── ClueCard (domain)
        │     ├── Badge (ui)
        │     └── Modal → ClueModal (domain)
        └── SceneModal (domain)
              ├── Button (ui)
              └── ClueCard (domain)
```

---

## 4. App State Structure

### State Separation

Two Zustand stores: one for game state (persisted), one for UI state (ephemeral).

```typescript
// ── GAME STORE (persisted to localStorage) ────────────────────────────────

interface GameStore {
  // Identity
  playerName: string;

  // Stats
  playerStats: {
    casesCompleted: number;
    casesAttempted: number;
    totalScore: number;
    correctAccusations: number;
    cluesFound: number;
    suspectorsInterrogated: number;
  };

  // Active case data (one entry per case played)
  activeCases: Record<string, ActiveCaseState>;
  currentCaseId?: string;

  // Actions
  startCase(caseId: string): void;
  discoverClue(caseId: string, clueId: string): void;
  completeScene(caseId: string, sceneId: string): void;
  sendMessage(caseId: string, suspectId: string, ...): void;
  makeAccusation(caseId: string, suspectId: string): void;
  updateNotes(caseId: string, notes: string): void;
  resetCase(caseId: string): void;
}

interface ActiveCaseState {
  caseId: string;
  startedAt: number;             // Unix timestamp
  lastPlayedAt: number;
  discoveredClues: string[];     // Clue IDs found
  completedScenes: string[];     // Scene IDs explored
  score: number;
  notes: string;                 // Player's freeform notes
  interrogations: Record<string, SuspectInterrogation>;
  accusationMade: boolean;
  accusedSuspectId?: string;
  isComplete: boolean;
  finalRank?: string;
}

interface SuspectInterrogation {
  suspectId: string;
  askedQuestions: string[];      // Question IDs
  messages: Message[];           // Full chat log
  suspicionLevel: number;        // 0–100, derived from questions asked
}
```

```typescript
// ── UI STORE (NOT persisted — resets on reload) ───────────────────────────

interface UIStore {
  // Active modals / overlays
  activeModal: 'briefing' | 'scene' | 'clue' | 'profile' | null;
  activeModalData?: unknown;     // Typed per modal type in practice

  // Scene view
  activeSceneId?: string;

  // Active clue detail
  activeClueId?: string;

  // Investigation tab
  activeTab: InvestigationTab;

  // Mobile panel state
  isProfilePanelOpen: boolean;

  // Actions
  openModal(modal: UIStore['activeModal'], data?: unknown): void;
  closeModal(): void;
  setActiveTab(tab: InvestigationTab): void;
  toggleProfilePanel(): void;
}
```

### Why Two Stores?

Mixing ephemeral UI state into persisted game state creates subtle bugs — e.g., a modal being "open" when the page reloads because it was accidentally persisted. Keeping them separate prevents the entire class of stale-UI-state bugs.

### Zustand Persist Configuration

```typescript
// src/store/gameStore.ts

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({ /* ... */ }),
    {
      name: "red-thread-v1",          // localStorage key
      version: 1,                     // increment on breaking schema changes
      migrate: (persistedState, version) => {
        // Handle schema migrations here
        // e.g., v0 → v1: rename a field
        return persistedState as GameStore;
      },
      partialize: (state) => ({
        // Only persist game-relevant state
        playerName: state.playerName,
        playerStats: state.playerStats,
        activeCases: state.activeCases,
        currentCaseId: state.currentCaseId,
      }),
    }
  )
);
```

**Key:** The `version` + `migrate` pattern is critical. When you update the data model (add a field, rename something), incrementing `version` lets you write a migration function so returning players don't get a blank save file.

---

## 5. Mystery Data Model

### Complete TypeScript Type System

```typescript
// src/types/case.ts

// ── Identifiers ──────────────────────────────────────────────────────────────
type CaseId = string;
type SuspectId = string;
type ClueId = string;
type SceneId = string;

// ── Enumerations ─────────────────────────────────────────────────────────────
type Difficulty = "novice" | "detective" | "inspector" | "master";
type ClueType = "physical" | "document" | "testimony" | "forensic" | "digital";
type ClueWeight = "minor" | "significant" | "critical";
type SceneMood = "tense" | "somber" | "unsettling" | "revelatory" | "climactic";
type QuestionCategory = "alibi" | "relationship" | "motive" | "behavior"
                      | "accusation" | "evidence";
type SuspectTone = "defensive" | "nervous" | "cooperative" | "evasive"
                 | "hostile" | "calm" | "emotional";

// ── Suspects ─────────────────────────────────────────────────────────────────
interface Question {
  id: string;
  text: string;                     // What the player asks
  category: QuestionCategory;
  requiredClue?: ClueId;            // Gate: only visible when this clue is found
  unlocksClue?: ClueId;             // Unlocked when this question is asked
  response: string;                 // Scripted response (Phase 1–2)
  followUp?: string;                // Secondary response (e.g., after interruption)
  suspicionDelta?: number;          // ±N applied to suspicion meter
  tone?: SuspectTone;
  // Phase 3+: AI override
  aiPersonaKey?: string;            // References a system-prompt template
}

interface SuspectRelationship {
  suspectId: SuspectId;
  description: string;              // "Grew up together; now rivals"
}

interface Suspect {
  id: SuspectId;
  name: string;
  age: number;
  role: string;                     // "The Son", "The Housekeeper"
  relationship: string;             // Their connection to the victim
  tagline: string;                  // One-line character essence
  backstory: string;                // 2–3 sentence background
  motive: string;                   // Why they might have done it
  suspiciousBehaviors: string[];    // 3–4 red flags
  alibi: string;                    // Their claim for the night
  questions: Question[];
  avatarGradient: [string, string]; // CSS gradient stops for avatar
  initialSuspicion: number;         // 0–100 starting level
  isKiller: boolean;
  relationships: SuspectRelationship[];
  tell: string;                     // What reveals them (shown in result)
}

// ── Clues ─────────────────────────────────────────────────────────────────────
interface Clue {
  id: ClueId;
  name: string;
  description: string;
  type: ClueType;
  weight: ClueWeight;
  location: string;                 // Where/how it's found
  icon: string;                     // Emoji for evidence board
  isIncriminating: boolean;         // Points toward real killer
  isRedHerring: boolean;            // Intentionally misleading
  points: number;                   // Score reward on discovery
  linksSuspect?: SuspectId;         // Visual connection on board
  revealText: string;               // What the player reads on discovery
  analysisText?: string;            // Deeper analysis (expandable)
}

// ── Scenes ────────────────────────────────────────────────────────────────────
interface Scene {
  id: SceneId;
  title: string;
  description: string;              // One-line preview
  narrative: string[];              // Prose paragraphs (cinematic mode)
  clues: ClueId[];                  // Collectible in this scene
  order: number;                    // Display sequence
  mood: SceneMood;
  unlockedFromStart: boolean;
  requiredClue?: ClueId;            // Gating condition
  backdrop: string;                 // Key for visual theming
}

// ── Timeline ──────────────────────────────────────────────────────────────────
interface TimelineEvent {
  id: string;
  time: string;                     // "11:45 PM"
  description: string;
  suspects: SuspectId[];            // Who was involved
  relatedClue?: ClueId;             // Evidence linked to event
  verified: boolean;                // Confirmed vs. disputed
  note?: string;                    // Detective annotation
}

// ── Case Endings ──────────────────────────────────────────────────────────────
interface CaseEnding {
  accusedSuspect: SuspectId;
  isCorrect: boolean;
  title: string;
  narrative: string;                // Full prose outcome
  scoreModifier: number;            // 1.0 for correct, 0.1 for wrong
}

// ── Victim ────────────────────────────────────────────────────────────────────
interface VictimProfile {
  name: string;
  age: number;
  profession: string;
  description: string;
  causeOfDeath: string;
  timeOfDeath: string;
  foundBy: string;
  lastSeenAlive: string;
}

// ── Top-Level Case ────────────────────────────────────────────────────────────
interface Case {
  id: CaseId;
  title: string;
  subtitle: string;                 // Tagline under the title
  description: string;
  setting: string;                  // "Thornwood Estate"
  settingDetail: string;            // "A neoclassical manor in Somerset"
  era: string;                      // "October 1923"
  categoryId: string;
  difficulty: Difficulty;
  estimatedTime: string;            // "25–40 min"
  atmosphericQuote: string;
  isFeatured: boolean;
  accentColor: string;              // CSS hex — case-specific accent
  maxScore: number;
  killerId: SuspectId;
  twist: string;                    // The narrative surprise (shown post-accusation)
  briefing: string;                 // Detective intro text
  victim: VictimProfile;
  suspects: Suspect[];
  clues: Clue[];
  scenes: Scene[];
  timeline: TimelineEvent[];
  endings: CaseEnding[];           // One per suspect (N suspects = N endings)
}
```

### Case Authoring Guide

When writing a new case, follow this structure:

```
1. Establish the kill method and work backward
   — "The poison came from the greenhouse" → who has greenhouse access?

2. Write the killer first (full backstory + motive + tell)

3. Write 2 red herring suspects with plausible but wrong motives

4. Write 2–3 supporting suspects who provide clues but didn't do it

5. Design 3 tiers of clues:
   Tier A (Critical, 3 max): Directly incriminate the killer
   Tier B (Significant, 4–5): Fill in the picture, build context
   Tier C (Minor, 3–4): Red herrings, atmosphere, misdirection

6. Write scenes that gate discovery:
   Scene 1: Always unlocked — establishes the crime
   Scene 2: Unlocked — deepens mystery
   Scene 3+: Gated behind clue discovery

7. Write interrogation questions:
   3–4 per suspect
   At least 1 requires a clue to unlock
   At least 1 unlocks a new clue when asked

8. Write all 6 endings (one per suspect accused)
   Only 1 is correct. The other 5 show consequences of being wrong.

9. Write the twist (the hidden truth that explains apparent contradictions)

10. Define the killer's "tell" — the one detail that should have given them away
```

---

## 6. Reusable UI Component List

All components live in `src/components/ui/`. They accept className overrides, support dark mode inherently (the app is dark-mode only), and have no dependencies on the game store.

### Button

```typescript
interface ButtonProps {
  variant: "gold" | "ghost" | "crimson" | "ghost-gold";
  size: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Variants:**
- `gold` — primary CTA, gold gradient, dark text
- `ghost` — transparent with border, subtle hover
- `crimson` — danger/accusation actions only
- `ghost-gold` — transparent with gold border, gold text on hover

### Badge

```typescript
interface BadgeProps {
  variant: "gold" | "crimson" | "iris" | "muted" | "success";
  size?: "sm" | "md";
  dot?: boolean;   // Show colored dot before text
  children: React.ReactNode;
}
```

### Card

```typescript
interface CardProps {
  variant: "premium" | "glass" | "glass-gold" | "flat";
  hover?: boolean;       // Enable hover lift + border glow
  accentColor?: string;  // Per-card custom accent on hover
  padding?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}
```

### Modal

```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "full";
  title?: string;
  closeable?: boolean;   // Show X button
  backdropBlur?: boolean;
  children: React.ReactNode;
}
```

**Implementation note:** Use a `createPortal` render to `document.body` to avoid stacking context issues. Add `Escape` key listener.

### Avatar

```typescript
interface AvatarProps {
  name: string;
  gradient: [string, string];
  size: "xs" | "sm" | "md" | "lg" | "xl";
  glowColor?: string;     // Optional glow effect
  border?: boolean;
}
```

### Progress

```typescript
interface ProgressProps {
  value: number;           // 0–100
  variant: "bar" | "ring";
  color?: string;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;      // Transition on mount
}
```

### Tabs

```typescript
interface TabsProps {
  tabs: { id: string; label: string; icon?: string; badge?: string }[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "pill" | "underline" | "ghost";
}
```

### EmptyState

```typescript
interface EmptyStateProps {
  icon: string;           // Emoji
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### Spinner

```typescript
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "gold" | "mist" | "white";
}
```

### Divider

```typescript
interface DividerProps {
  variant?: "gold" | "subtle";
  className?: string;
}
// Renders a 1px gradient line — center bright, edges fade to transparent
```

### Tooltip

```typescript
interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  children: React.ReactNode;
}
```

---

## 7. Animation & Interaction System

### Core Philosophy

> **Premium restraint.** Motion communicates — it doesn't perform. Every animation has a functional reason. Nothing bounces. Nothing spins for decoration. Transitions feel like a $300 watch, not a carnival ride.

### Easing Curves (Define Once, Use Everywhere)

```css
/* globals.css */
:root {
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-expo:  cubic-bezier(0.7, 0, 0.84, 0);
  --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1); /* used sparingly */
  --ease-standard: cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

```typescript
// lib/motion.ts — use these values consistently
export const EASING = {
  outExpo: [0.16, 1, 0.3, 1],
  inExpo:  [0.7, 0, 0.84, 0],
  spring:  [0.34, 1.56, 0.64, 1],
} as const;

export const DURATION = {
  fast:    150,   // Hover states, micro-interactions
  normal:  300,   // Panel transitions, reveals
  slow:    500,   // Page enters, modal open
  dramatic: 800,  // Scene/reveal moments
} as const;
```

### Animation Patterns by Use Case

**Page enter (every page):**
```css
.page-enter {
  animation: fadeUp var(--ease-out-expo) 500ms both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Staggered list items:**
```typescript
// Apply via inline style on each item
style={{ animationDelay: `${index * 80}ms` }}
// Use opacity-0-init class on the element to prevent flash
```

**Modal open:**
```css
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}
/* Timing: 400ms ease-out-expo */
```

**Card hover:**
```css
.card-premium {
  transition: transform 300ms var(--ease-out-expo),
              border-color 300ms ease,
              box-shadow 300ms ease;
}
.card-premium:hover {
  transform: translateY(-3px);
  /* Border + shadow via JS inline style for dynamic accent colors */
}
```

**Chat bubble appear:**
```css
/* Each new message slides in from its relevant side */
.chat-player { animation: slideFromRight 300ms var(--ease-out-expo) both; }
.chat-suspect { animation: slideFromLeft 300ms var(--ease-out-expo) both; }
```

**Suspicion bar fill:**
```css
.suspicion-fill {
  transition: width 800ms var(--ease-out-expo);
}
/* Trigger on mount: start at 0, animate to value */
```

**Result reveal — phased sequence:**
```
0ms    → Loader spinner
1200ms → Verdict banner scales in (CORRECT / WRONG)
3000ms → Accusation vs. truth cards fade up
5500ms → Full stats + score breakdown
```

**Typing indicator:**
```css
/* 3 dots, each with offset pulse */
.dot-1 { animation: pulse 1.2s 0.0s ease-in-out infinite; }
.dot-2 { animation: pulse 1.2s 0.2s ease-in-out infinite; }
.dot-3 { animation: pulse 1.2s 0.4s ease-in-out infinite; }
```

### Interaction States (Every Interactive Element)

Every button, card, and link must have distinct states:

| State | Behavior |
|---|---|
| Default | Base styles |
| Hover | Color shift + subtle lift (translateY -2–3px) |
| Active/Pressed | Returns to baseline (translateY 0) |
| Focus-visible | 2px gold outline, offset 2px |
| Disabled | opacity: 0.4, cursor: not-allowed, no hover effects |
| Loading | Spinner replaces or accompanies text |

### What NOT to Do

- No `transition: all` — always specify the properties
- No bounce easing on UI cards (spring only for specific celebratory moments)
- No rotate animations on hover
- No color cycling or shimmer on static content
- No slide-left/right page transitions (fade-up only)
- No overlapping animations that compound to feel chaotic

---

## 8. Local Storage & Save Progress Plan

### Architecture

All save data lives in `localStorage` via Zustand's `persist` middleware. No backend required through Phase 2.

```
Key: "red-thread-v1"
Format: JSON
Location: window.localStorage
Max size: ~5MB (more than enough for text-only game state)
```

### What Gets Persisted

```typescript
// The partialize function controls exactly what's saved
partialize: (state) => ({
  playerName: state.playerName,
  playerStats: state.playerStats,
  activeCases: state.activeCases,     // All in-progress + completed cases
  currentCaseId: state.currentCaseId,
})
```

**Not persisted:** UI state (which tab is open, which modal is showing, scroll position). These reset on reload intentionally.

### Hydration Handling (Important for Next.js SSR)

```typescript
// Problem: Zustand's persist reads localStorage on the client,
// but Next.js renders on the server where localStorage doesn't exist.
// This causes a hydration mismatch.

// Solution: Use a mounted flag
function CasePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <LoadingSkeleton />;   // SSR-safe placeholder
  return <ActualContent />;                  // Client-only render
}

// Alternative: Wrap the store provider in a "HydrationGuard"
// component that only renders children after first client paint.
```

### Schema Version Management

```typescript
const useGameStore = create(
  persist(
    (set, get) => ({ /* store */ }),
    {
      name: "red-thread-v1",
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        // v0 → v1 migration example:
        if (version === 0) {
          const old = persistedState as OldSchema;
          return {
            ...old,
            playerStats: {
              ...old.playerStats,
              suspectorsInterrogated: 0,   // New field added in v1
            }
          };
        }
        return persistedState as GameStore;
      },
    }
  )
);
```

**Rule:** Every time you change the shape of persisted state, increment `version` and write a migration. This ensures returning players keep their progress and don't see errors.

### Save State UI

Show save status in the case nav bar:

```typescript
// Saved automatically — show a brief "Saved" flash
// after any store mutation that affects case state.
function SaveIndicator() {
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    const unsub = useGameStore.subscribe(() => {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1500);
    });
    return unsub;
  }, []);

  return justSaved ? <span className="text-gold/60 text-xs">Saved</span> : null;
}
```

### Export / Import (Phase 2)

Allow players to back up and restore their save:

```typescript
// Export
function exportSave() {
  const state = useGameStore.getState();
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  // Trigger download
}

// Import
function importSave(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = JSON.parse(e.target?.result as string);
    useGameStore.setState(data);
  };
  reader.readAsText(file);
}
```

---

## 9. Future AI Integration Plan

### Design Principle

The interrogation system is designed AI-first even in Phase 1. The scripted responses are a clean fallback, not an afterthought. Swapping to AI responses requires changing exactly **one function call** per question.

### Phase 1 — Scripted (Current)

```typescript
// In InterrogationPage:
const handleAskQuestion = async (question: Question) => {
  const response = question.response;   // Static string
  store.sendMessage(caseId, suspectId, question.id,
    question.text, response, question.tone);
};
```

### Phase 3 — AI-Powered

**Step 1: Create the API route**

```typescript
// src/app/api/interrogate/route.ts
import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { suspectId, questionText, caseContext, conversationHistory } = await req.json();

  const suspect = caseContext.suspects.find((s: Suspect) => s.id === suspectId);
  if (!suspect) return Response.json({ error: "Suspect not found" }, { status: 404 });

  const systemPrompt = buildSuspectSystemPrompt(suspect, caseContext);

  const stream = client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 300,
    system: systemPrompt,
    messages: [
      // Prior conversation history
      ...conversationHistory.map((m: Message) => ({
        role: m.sender === "player" ? "user" : "assistant",
        content: m.text,
      })),
      { role: "user", content: questionText },
    ],
  });

  // Return as a streaming response
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta") {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function buildSuspectSystemPrompt(suspect: Suspect, caseData: Case): string {
  return `You are ${suspect.name}, ${suspect.age} years old. ${suspect.role}.

CONTEXT: ${caseData.title}. ${caseData.setting}, ${caseData.era}.
The victim is ${caseData.victim.name}, found dead from ${caseData.victim.causeOfDeath}.

YOUR BACKGROUND: ${suspect.backstory}

YOUR TRUE MOTIVE: ${suspect.motive}
${suspect.isKiller ? "YOU ARE THE KILLER. You committed this crime. You know the full truth." : "You are innocent. You did not commit this crime."}

YOUR ALIBI: ${suspect.alibi}

YOUR RELATIONSHIPS:
${suspect.relationships.map((r) => `- ${r.suspectId}: ${r.description}`).join("\n")}

PERSONALITY & TONE:
You are naturally ${suspect.tell.split(".")[0].toLowerCase()}.
${suspect.isKiller ? "You are hiding your guilt with careful, controlled responses. You occasionally deflect toward other suspects." : "You are genuinely innocent but may be hiding unrelated secrets."}

RESPONSE RULES:
- Stay fully in character. Never break the fourth wall.
- Keep responses to 2–4 sentences. This is an interrogation, not a monologue.
- React authentically to accusations, evidence mentions, or confrontations.
- Your emotional state: ${suspect.suspiciousBehaviors[0]}.
- Never directly confess unless cornered with overwhelming evidence.
- Speak in the register of ${caseData.era} — slightly formal, period-appropriate.`;
}
```

**Step 2: Update the client-side handler**

```typescript
// In InterrogationPage (Phase 3 version):
const handleAskQuestion = async (question: Question) => {
  setIsTyping(true);

  // Build conversation history for context window
  const history = store.getMessages(caseId, suspectId)
    .filter((m) => m.text.trim() !== "");

  const response = await fetch("/api/interrogate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      suspectId,
      questionText: question.text,
      caseContext: caseData,
      conversationHistory: history,
    }),
  });

  // Stream the response into the chat
  const reader = response.body?.getReader();
  let fullText = "";

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += new TextDecoder().decode(value);
      // Update UI with streaming text as it arrives
      setStreamingText(fullText);
    }
  }

  store.sendMessage(caseId, suspectId, question.id,
    question.text, fullText, undefined,
    question.unlocksClue, question.suspicionDelta);

  setIsTyping(false);
  setStreamingText("");
};
```

**Step 3: Feature flag for rollout**

```typescript
// .env.local
NEXT_PUBLIC_AI_INTERROGATION_ENABLED=true
ANTHROPIC_API_KEY=sk-ant-...

// In component:
const AI_ENABLED = process.env.NEXT_PUBLIC_AI_INTERROGATION_ENABLED === "true";

const handleAskQuestion = AI_ENABLED
  ? handleAIQuestion
  : handleScriptedQuestion;
```

### AI System Prompt Design Principles

1. **Give the AI a motive, not a script.** The prompt tells the suspect *why* they're behaving, not *what* to say.
2. **Keep responses short.** `max_tokens: 300` enforces conciseness — interrogations are tense, not theatrical.
3. **Build in tell-markers.** If the suspect is the killer, their prompt subtly includes deflection patterns. A clever player will notice.
4. **Pass full conversation history.** The AI should remember what was already said in this interrogation session.
5. **Period-appropriate language.** Set the era in the prompt — a 1923 English aristocrat does not say "totally" or "honestly."

### Rate Limiting (Production)

```typescript
// src/app/api/interrogate/route.ts
// Add before the AI call:
import { Ratelimit } from "@upstash/ratelimit";   // or your preferred solution
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 m"),    // 20 requests per minute per IP
});

const ip = req.ip ?? "anonymous";
const { success } = await ratelimit.limit(ip);
if (!success) return Response.json({ error: "Rate limited" }, { status: 429 });
```

---

## 10. Phased Build Roadmap

### Phase 1 — MVP (Complete ✓)

**Goal:** One fully playable case, everything works end-to-end. Deployable.

| Feature | Status |
|---|---|
| Next.js 14 project setup | ✓ |
| Tailwind + typography system | ✓ |
| Landing page | ✓ |
| Case selection browser | ✓ |
| Investigation hub (5 tabs) | ✓ |
| Scripted interrogation chat | ✓ |
| Evidence board | ✓ |
| Timeline view | ✓ |
| Accusation flow | ✓ |
| Dramatic result reveal | ✓ |
| Score + rank system | ✓ |
| localStorage save/resume | ✓ |
| The Thornwood Affair (full case) | ✓ |
| README + Vercel deploy guide | ✓ |

**Launch criteria:** App loads, case can be played start to finish, accusation works, result screen shows, save persists.

---

### Phase 2 — Quality + Content (4–6 weeks)

**Goal:** Two more cases, mobile polish, full UX hardening.

**New cases:**
- *The Velvet Curtain* — 1940s noir detective mystery
- *White Tide* — Cold case revival, modern setting

**Product work:**
- [ ] Custom `not-found.tsx` 404 page
- [ ] Loading skeleton states for all data-dependent views
- [ ] Mobile bottom navigation bar (replaces tab header on small screens)
- [ ] Keyboard navigation for desktop (`Tab`, `Enter`, `Escape`)
- [ ] Accessibility audit (aria-labels, focus management, contrast ratios)
- [ ] Detective Profile page (`/profile`) — career stats, completed cases
- [ ] Achievement system — 12 badges, shown on profile
- [ ] Case difficulty selector on case card
- [ ] "You missed N clues" post-game insight
- [ ] Export/import save file
- [ ] PWA manifest (installable on mobile)
- [ ] `og:image` for social sharing (each case has a preview card)

**Technical work:**
- [ ] Split `gameStore.ts` into smaller, focused stores
- [ ] Add `uiStore.ts` for ephemeral state
- [ ] Create all custom hooks (`useCase`, `useSuspect`, `useProgress`)
- [ ] Add Storybook or a simple component demo page for UI primitives
- [ ] Migrate to `src/hooks/useKeyboard.ts` for global keyboard handling
- [ ] Add `CASE_REGISTRY` type-safe case lookup
- [ ] Write unit tests for `caseEngine.ts` and scoring logic

---

### Phase 3 — AI Integration (6–8 weeks)

**Goal:** Dynamic suspect conversations powered by Claude. The interrogation becomes a genuinely open-ended dialogue.

- [ ] Create `/api/interrogate` route handler
- [ ] Build `lib/aiClient.ts` wrapper with error handling + fallback to scripted
- [ ] Write system prompt templates for each suspect archetype
- [ ] Add streaming text display in chat interface
- [ ] Add feature flag (`NEXT_PUBLIC_AI_INTERROGATION_ENABLED`)
- [ ] Rate limiting on the API endpoint
- [ ] Fallback to scripted responses on API failure
- [ ] AI-powered "clue unlock" — AI decides when to reveal information naturally
- [ ] Tone detection from AI responses (update the tone indicator dynamically)
- [ ] Test + refine prompts across all existing suspects

**Environment variables needed:**
```
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_AI_INTERROGATION_ENABLED=true
UPSTASH_REDIS_REST_URL=...     (for rate limiting)
UPSTASH_REDIS_REST_TOKEN=...
```

---

### Phase 4 — Platform Scale (3+ months)

**Goal:** Red Thread becomes a platform, not a single app.

**Content:**
- [ ] 6–8 total cases across all categories
- [ ] Case "seasons" (thematic groupings of 3–4 cases)
- [ ] Community spotlight: featured player-submitted mysteries

**User accounts:**
- [ ] Optional sign-in with email or Google (Clerk or NextAuth.js)
- [ ] Cloud save (sync across devices)
- [ ] Leaderboards per case
- [ ] Share your result card (image generation via Satori or html2canvas)

**Monetization:**
- [ ] Stripe integration for case pack purchases
- [ ] Season Pass subscription flow
- [ ] Freemium gating logic (free tier = 1 case)
- [ ] Receipt/purchase history page

**Case CMS:**
- [ ] Admin interface for writing + publishing cases
- [ ] Case data in database (Supabase or PlanetScale) rather than static files
- [ ] Case preview / staging environment
- [ ] Scheduled case releases

**Technical infrastructure:**
- [ ] Move to Supabase or Neon for case + user data
- [ ] Image optimization for character art (when actual assets are added)
- [ ] Edge functions for low-latency AI responses
- [ ] Analytics integration (PostHog or similar) for case completion tracking
- [ ] Error monitoring (Sentry)
- [ ] CDN + caching strategy for static case data

---

## Quick Reference: Deployment Checklist

Before every Vercel deployment, verify:

```bash
# 1. Types are clean
npm run build        # Next.js build catches type errors

# 2. No env vars hardcoded in client code
grep -r "sk-ant" src/     # Should return nothing

# 3. .gitignore excludes sensitive files
cat .gitignore | grep env  # Should show .env*.local

# 4. Dependencies are locked
cat package-lock.json | head -3   # Confirm lockfile exists

# 5. No console.log left in production paths
grep -r "console.log" src/app/ --include="*.tsx"
```

**Vercel deploy:**
```bash
# Via CLI
vercel --prod

# Via GitHub auto-deploy (recommended)
# Push to main branch → Vercel auto-deploys
# Push to any branch → Preview deployment created automatically
```

---

*This document reflects the architecture of the Midnight Cases v1 codebase and the forward roadmap for Red Thread as a full product.*
