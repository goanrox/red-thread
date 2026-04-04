# Red Thread

A premium cinematic murder mystery web app. Investigate. Interrogate. Accuse.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| State | Zustand + persist middleware |
| Fonts | Cormorant Garamond + Inter (Google Fonts) |
| Deploy | Vercel |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/               Next.js App Router pages and layouts
├── components/        UI, layout, and domain components
│   ├── ui/            Stateless primitives (Button, Badge, Card…)
│   ├── layout/        Page-level structure (Navigation, CaseNav…)
│   ├── landing/       Landing page sections
│   ├── case/          Case gameplay components
│   ├── interrogation/ Chat system
│   ├── evidence/      Evidence board
│   ├── timeline/      Timeline view
│   ├── accusation/    Accusation flow
│   └── result/        Result and reveal screens
├── data/              Static case data and category definitions
├── store/             Zustand stores (game state + UI state)
├── types/             TypeScript type definitions
├── lib/               Utilities, scoring, case engine
└── hooks/             Custom React hooks
```

---

## Build Phases

| Phase | Scope |
|---|---|
| **Phase 1** | Full gameplay loop — Landing, Case Browser, Investigation Hub, Interrogation, Evidence Board, Accusation, Result |
| **Phase 2** | Polish — Profile, Achievements, About, keyboard navigation, animations |
| **Phase 3** | AI interrogation — live Claude-powered suspect responses |
| **Phase 4** | Scale — dynamic case API, additional cases |

---

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in values as needed. See `.env.example` for documentation.

---

## Deployment

This project deploys to Vercel automatically on push to `main`.

```bash
# Preview deploy
vercel

# Production deploy
vercel --prod
```

No environment variables are required for Phase 1 (all data is static).
Add `ANTHROPIC_API_KEY` before enabling Phase 3 AI interrogation.
