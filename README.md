# Red Thread

**A premium cinematic murder mystery platform.**

Red Thread is a prestige interactive mystery experience. You investigate a case, interrogate suspects, collect evidence, and make a final irreversible accusation. Every clue is fair. Every suspect is lying about something.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript — strict mode |
| Styling | Tailwind CSS v4 |
| State | Zustand with persist middleware |
| Animation | Framer Motion |
| Icons | lucide-react |
| Fonts | Cormorant Garamond + Inter (Google Fonts) |
| Persistence | localStorage via Zustand persist |

---

## Installation

```bash
git clone https://github.com/your-username/red-thread.git
cd red-thread
npm install
```

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment to Vercel

Zero-configuration deployment. Connect your GitHub repository in the [Vercel Dashboard](https://vercel.com) or use the CLI:

```bash
npm i -g vercel
vercel
```

**No environment variables required.** All state is local (Zustand persist → localStorage).

---

## Folder Structure

```
src/
├── app/                         # Next.js App Router
│   ├── page.tsx                 # Landing page (/)
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Design tokens + keyframes
│   ├── about/page.tsx           # About / How to Play
│   ├── cases/
│   │   ├── page.tsx             # Case browser
│   │   └── [caseId]/
│   │       ├── layout.tsx       # Case shell (CaseNav)
│   │       ├── page.tsx         # Investigation hub (5 tabs)
│   │       ├── evidence/        # Full evidence board
│   │       ├── timeline/        # Full timeline view
│   │       ├── accuse/          # Accusation chamber
│   │       ├── result/          # Phased result reveal
│   │       └── interrogate/[suspectId]/  # Interrogation chat
│   └── profile/
│       ├── page.tsx             # Detective profile
│       └── achievements/        # Achievements gallery
├── components/
│   ├── layout/                  # Navigation, CaseNav, PageWrapper
│   ├── case/                    # CaseCard
│   ├── landing/                 # TaglineCycler
│   └── ui/                      # Button, Card, Badge, etc.
├── data/
│   ├── index.ts                 # Case registry
│   ├── categories.ts
│   └── cases/thornwood.ts       # The Thornwood Affair
├── store/
│   ├── gameStore.ts             # Main game state (persisted)
│   └── uiStore.ts               # Ephemeral UI state
├── lib/
│   ├── utils.ts                 # cn(), clamp(), etc.
│   ├── caseEngine.ts            # Progress + suspicion logic
│   └── scoring.ts               # Score + rank calculation
├── types/                       # case.ts, game.ts, ui.ts
└── hooks/                       # useCase, useKeyboard, etc.
```

---

## Adding More Cases

1. Create `src/data/cases/your-case.ts` and export a `Case` object
2. Register in `src/data/index.ts`:
   ```ts
   const ALL_CASES: Case[] = [thornwoodCase, yourCase];
   ```

A full case requires: victim, suspects (5–7) with questions, clues (10–15), scenes (3–5), timeline (6–10 events), and a solution with endings.

---

## Future AI Integration (Phase 3)

The integration point is `src/lib/aiClient.ts`. Replace `question.response` strings with Anthropic Claude API calls. Pass suspect profile + discovered clues as context. Stream into the existing chat UI. No other changes needed — the interrogation UI and state are fully decoupled from response delivery.

---

*Red Thread v1.0 — Production-ready. GitHub-ready. Vercel-ready.*
