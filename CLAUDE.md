@AGENTS.md

# Red Thread — Claude Context

## What This Project Is

Red Thread is a premium cinematic murder mystery web app. Users investigate a case: they explore scenes, collect clues, interrogate suspects, build an evidence board, analyze a timeline, then accuse the killer. Every screen must feel like a prestige TV production.

The full product vision is in `RED_THREAD_PRODUCT_BLUEPRINT.md`.
The full technical plan is in `RED_THREAD_IMPLEMENTATION_PLAN.md`.

---

## Production Status

All major pages and systems are fully implemented and production-ready:

| Area | Status |
|---|---|
| Landing page | Complete |
| Case browser | Complete |
| Investigation hub (5 tabs) | Complete |
| Interrogation chat | Complete |
| Evidence board | Complete |
| Timeline | Complete |
| Accusation chamber | Complete |
| Phased result reveal | Complete |
| Detective profile | Complete |
| Achievements | Complete |
| About page | Complete |
| Thornwood case data | Complete (6 suspects, 12 clues, 4 scenes, 8 events, all questions) |

---

## Tech Stack

- **Next.js 16** with App Router (`src/app/`) — `params` is a Promise; use `async/await` (server) or `use(params)` (client)
- **TypeScript** — strict mode enforced, no `any`
- **Tailwind CSS v4** — custom tokens in `globals.css @theme`, NOT `tailwind.config.ts`
- **Zustand** — `useGameStore` (persisted), `useUIStore` (ephemeral)
- **Framer Motion** — for page transitions, tab switches, phased reveals, interactive animations
- **lucide-react** — for all icons
- **Fonts** — Cormorant Garamond (serif, headings/narrative) + Inter (sans, UI chrome)
- **No other UI libraries** — no Shadcn, Chakra, MUI, Radix

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
- Headings, case titles, narrative prose → Cormorant Garamond (`font-serif`)
- UI chrome (buttons, labels, nav, stats) → Inter (body default)
- Uppercase labels → `.label-caps` utility class
- Narrative/suspect speech → always italic serif

Animation:
- CSS keyframes for ambient effects (float, fadeUp, scaleIn)
- Framer Motion for interactive page/component transitions
- `motion.div` with `initial/animate/exit` for entrances
- `AnimatePresence` for conditional show/hide

---

## Component Architecture

Three tiers — never mix:

1. **Primitives** (`src/components/ui/`) — stateless, no store access
2. **Domain components** (`src/components/case/`, `landing/`, etc.) — may read store, never write
3. **Page containers** (`src/app/**/page.tsx`) — own logic, connect to store, compose tiers 1+2

---

## Key Files

| File | Purpose |
|---|---|
| `src/types/case.ts` | Case, Suspect, Clue, Scene, Timeline types |
| `src/types/game.ts` | ActiveCaseState, PlayerStats, GameState types |
| `src/types/ui.ts` | UIState, tab names, view modes |
| `src/store/gameStore.ts` | Main game state + localStorage persistence |
| `src/store/uiStore.ts` | Ephemeral UI state (modals, active tabs) |
| `src/lib/caseEngine.ts` | Clue unlock logic, progress calculation, suspicion scoring |
| `src/lib/scoring.ts` | Score calculation + rank logic |
| `src/lib/utils.ts` | `cn()`, `clamp()`, `percentage()`, `suspicionColor()` |
| `src/data/index.ts` | Case registry + lookup helpers |
| `src/data/cases/thornwood.ts` | Complete Thornwood case data |
| `src/app/globals.css` | All design tokens, keyframes, utility classes |
| `src/components/layout/CaseNav.tsx` | Per-case nav bar (progress + accuse CTA) |
| `src/app/cases/[caseId]/layout.tsx` | Case shell layout (CaseNav + padding) |

---

## Rules for Claude When Building This App

1. **Dark mode only.** Never add light mode styles or `bg-white`.
2. **Never use a UI component library.** Build from primitives.
3. **Use Framer Motion** for interactive animations. Use CSS for ambient/decorative animations.
4. **Never use `transition: all`.** Specify exact properties.
5. **Tailwind v4** — custom tokens are in `globals.css @theme`, not `tailwind.config.ts`.
6. **`"use client"` only when needed** — stores, hooks with `useEffect`/`useState`, interactive components.
7. **Next.js 16 `params` is a Promise.** Use `async/await` in server components or `use(params)` in client components.
8. **TypeScript strict.** No `any`. No untyped props.
9. **Spacing is generous.** Cramped = wrong. Breathing room = correct.
10. **Gold is reserved.** Use it for the most important interactive elements only.
11. **No broken states.** Every button does something. Every empty state is designed.
12. **The app must remain GitHub-ready and Vercel-deployable at all times.** Run `npm run build` to verify before considering any feature complete.
