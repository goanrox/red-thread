@AGENTS.md

# Red Thread — Claude Context

## What This Project Is

Red Thread is a premium cinematic murder mystery web app. Users investigate a case: they explore scenes, collect clues, interrogate suspects, build an evidence board, analyze a timeline, then accuse the killer. Every screen must feel like a prestige TV production.

The full product vision is in `RED_THREAD_PRODUCT_BLUEPRINT.md`.
The full technical plan is in `RED_THREAD_IMPLEMENTATION_PLAN.md`.
The original master build prompt is in `RED_THREAD_BUILD_PROMPT.md`.

---

## Tech Stack

- **Next.js 16** with App Router (`src/app/`)
- **TypeScript** — strict mode enforced
- **Tailwind CSS v4** — `@theme` in `globals.css`, NOT `tailwind.config.ts`
- **Zustand** — `useGameStore` (persisted), `useUIStore` (ephemeral)
- **Fonts** — Cormorant Garamond (serif, headings/narrative) + Inter (sans, UI chrome)
- **No UI libraries** — no Shadcn, Chakra, MUI, Radix
- **No animation libraries** — all motion in CSS keyframes

---

## Design System

Colors are defined in `src/app/globals.css` under `@theme inline`:

| Token | Hex | Use |
|---|---|---|
| `void` | `#07070e` | Primary background |
| `abyss` | `#0c0c17` | Secondary background |
| `surface` | `#111120` | Card backgrounds |
| `surface2` | `#181828` | Elevated cards |
| `surface3` | `#1f1f35` | Subtle highlights |
| `border` | `#2a2a45` | All borders |
| `gold` | `#c9a84c` | Primary accent — use sparingly |
| `gold-light` | `#e8cc88` | Gold hover/active |
| `crimson` | `#8b2232` | Danger, wrong answers, high suspicion |
| `crimson-light` | `#c13248` | Crimson hover |
| `iris` | `#6b63d4` | Secondary accent — rare |
| `parchment` | `#f0ece0` | Primary text (warm white) |
| `mist` | `#a8a5c0` | Secondary text |
| `shadow` | `#5c5a78` | Tertiary/muted text |

Typography rules:
- Headings, case titles, narrative prose → Cormorant Garamond serif
- UI chrome (buttons, labels, nav, stats) → Inter sans-serif
- Uppercase labels → `.label-caps` utility class
- Narrative/suspect speech → always italic serif

Animation classes defined in `globals.css`: `.animate-fade-up`, `.animate-fade-in`, `.animate-scale-in`, `.stagger-1` through `.stagger-6`.

Card hover: `.card-hover` class — `translateY(-2px)` lift + gold border glow.

Glassmorphism: `.glass` class — `backdrop-filter: blur(20px)`.

---

## Component Architecture

Three tiers — never mix:

1. **Primitives** (`src/components/ui/`) — stateless, no store access
2. **Domain components** (`src/components/case/`, `evidence/`, etc.) — may read store, never write
3. **Page containers** (`src/app/**/page.tsx`) — own logic, connect to store, compose tiers 1+2

---

## Build Phases

| Phase | Status | Scope |
|---|---|---|
| Foundation | **Complete** | Project setup, types, stores, design system |
| Phase 1 | **Next** | Full gameplay loop — Landing, Cases, Investigation, Interrogation, Evidence, Accusation, Result |
| Phase 2 | Pending | Profile, Achievements, About, polish |
| Phase 3 | Pending | AI interrogation via Anthropic API |
| Phase 4 | Pending | Dynamic case API, additional cases |

---

## Current Case

**The Thornwood Affair** (`src/data/cases/thornwood.ts`) — a country house mystery. Scaffolded with solution data. Suspects, scenes, clues, and timeline need to be authored in Phase 1.

---

## Key Files

| File | Purpose |
|---|---|
| `src/types/case.ts` | Case, Suspect, Clue, Scene, Timeline types |
| `src/types/game.ts` | ActiveCaseState, PlayerStats, GameState types |
| `src/types/ui.ts` | UIState, tab names, view modes |
| `src/store/gameStore.ts` | Main game state + localStorage persistence |
| `src/store/uiStore.ts` | Ephemeral UI state (modals, active tabs) |
| `src/lib/caseEngine.ts` | Clue unlock logic, progress calculation |
| `src/lib/scoring.ts` | Score calculation + rank logic |
| `src/lib/utils.ts` | `cn()`, `clamp()`, `percentage()`, `suspicionColor()` |
| `src/data/index.ts` | Case registry + lookup helpers |
| `src/app/globals.css` | All design tokens, keyframes, utility classes |

---

## Rules for Claude When Building This App

1. **Dark mode only.** Never add light mode styles or `bg-white`.
2. **Never use a UI component library.** Build from primitives.
3. **Never use `framer-motion` or any animation library.** CSS only.
4. **Never use `transition: all`.** Specify exact properties.
5. **Tailwind v4** — custom tokens are in `globals.css @theme`, not `tailwind.config.ts`.
6. **`"use client"` only when needed** — stores, hooks with `useEffect`/`useState`, interactive components.
7. **TypeScript strict.** No `any`. No untyped props.
8. **Spacing is generous.** Cramped = wrong. Breathing room = correct.
9. **Gold is reserved.** Use it for the most important interactive elements only.
10. **When in doubt, read the blueprint** at `RED_THREAD_PRODUCT_BLUEPRINT.md`.
