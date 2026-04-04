# Red Thread — Master Build Prompt

> Copy and paste this prompt in full into Claude Code, Cursor, or any capable coding environment to generate the complete app.

---

## PROMPT START

---

You are a senior product engineer, game designer, UX architect, and visual design lead. Your task is to build a complete, production-ready, fully functional web app called **Red Thread** — a premium cinematic murder mystery web app.

This is not a prototype. This is not a demo. This is a real product.

Read every word of this prompt before writing a single line of code. Then plan your approach, then build.

---

## PRODUCT OVERVIEW

Red Thread is an interactive mystery-solving experience that combines:
- Cinematic scene-by-scene storytelling
- Chat-based suspect interrogation
- Evidence board with visual clue collection
- Timeline analysis
- Accusation flow with multiple narrative endings
- Detective scoring and rank system
- Local save-and-resume progress

The experience should feel like a prestige TV mystery series that the player controls. Every screen should communicate: *this is an expensive, thoughtful product.*

---

## TECH STACK — REQUIRED

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode — `"strict": true` in tsconfig)
- **Styling:** Tailwind CSS with a custom design token system
- **State management:** Zustand with `persist` middleware (localStorage)
- **Fonts:** Cormorant Garamond (serif, for headings and narrative) + Inter (sans-serif, for UI chrome) — load via Google Fonts in `layout.tsx`
- **Dependencies:** Keep minimal. Only add a library if it meaningfully improves the product. `clsx` and `tailwind-merge` are acceptable. Do NOT add `framer-motion`, `three.js`, or animation libraries — handle all motion in CSS.

Do NOT use:
- A UI component library (no Shadcn, no Chakra, no MUI)
- A CSS framework other than Tailwind
- A backend or database (all data is local/static in this version)
- Any library that would fail a Vercel build

---

## DESIGN DIRECTION — NON-NEGOTIABLE

The visual identity must follow these principles exactly:

**Color System** (define as Tailwind custom colors):
```
void:      #07070e   — primary background (not pure black — has a blue undertone)
abyss:     #0c0c17   — slightly lighter background layer
surface:   #111120   — card backgrounds
surface2:  #181828   — elevated card backgrounds
surface3:  #1f1f35   — subtle highlights
border:    #2a2a45   — all borders
gold:      #c9a84c   — primary accent (use sparingly — when you see gold, it matters)
gold-light:#e8cc88   — hover/active gold
crimson:   #8b2232   — danger, wrong answers, high suspicion
crimson-light: #c13248
iris:      #6b63d4   — secondary accent (rare use)
parchment: #f0ece0   — primary text (warm white, never #ffffff)
mist:      #a8a5c0   — secondary text
shadow:    #5c5a78   — tertiary/muted text
```

**Typography rules:**
- All headings, case titles, and narrative prose: `font-family: Cormorant Garamond, serif` — elegant, literary, cinematic
- All UI chrome (buttons, labels, navigation, stats): `font-family: Inter, sans-serif` — clean, legible, functional
- Letter-spacing on uppercase labels: `tracking-widest` (0.2–0.4em)
- Narrative/suspect speech: always italic serif

**Layout rules:**
- Dark mode only. The body background is `#07070e`.
- Glassmorphism: `backdrop-filter: blur(20px)` on cards and navbars. Use it tastefully — not on everything.
- Card hover: `translateY(-2px)` lift + subtle gold border glow + box-shadow deepening. Transition: `300ms cubic-bezier(0.16, 1, 0.3, 1)`.
- No bright colors. No white backgrounds. No flat design. Everything has depth.
- Rounded corners: `rounded-2xl` (16px) for cards, `rounded-xl` (12px) for inputs/buttons, `rounded-full` for pills and avatars.
- Spacing is generous — never cramped. Breathing room is premium.

**Motion rules:**
- Page enters: `fadeUp` — `opacity: 0 → 1`, `translateY: 16px → 0`, 500ms ease-out-expo
- Modal opens: `scaleIn` — `scale: 0.96 → 1`, `opacity: 0 → 1`, 400ms ease-out-expo
- Never bounce. Never spring. Never rotate on hover. Never use `transition: all`.
- Stagger list items: 80ms delay per item
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for all entrances. Standard `ease` for micro-interactions.

**What this app must NOT look like:**
- A mobile game
- A generic web app with a dark theme applied
- A Discord-style layout
- Anything that uses bright neons, gradients of rainbow colors, or floating pixel elements
- Anything that has score popups, particle explosions, or bouncing UI

---

## FILE & FOLDER STRUCTURE

Create exactly this structure. Do not deviate.

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                         (Landing page)
│   ├── globals.css
│   ├── not-found.tsx
│   └── cases/
│       ├── page.tsx                     (Case browser)
│       └── [caseId]/
│           ├── layout.tsx               (Case shell — persistent nav)
│           ├── page.tsx                 (Investigation hub)
│           ├── interrogate/
│           │   └── [suspectId]/
│           │       └── page.tsx
│           ├── evidence/
│           │   └── page.tsx
│           ├── accuse/
│           │   └── page.tsx
│           └── result/
│               └── page.tsx
├── components/
│   ├── ui/                              (Stateless primitives)
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Avatar.tsx
│   │   ├── Progress.tsx
│   │   ├── Tabs.tsx
│   │   ├── Divider.tsx
│   │   ├── Spinner.tsx
│   │   └── EmptyState.tsx
│   ├── layout/
│   │   ├── Navigation.tsx               (Top nav, site-wide)
│   │   └── CaseNav.tsx                  (In-case nav bar with progress)
│   ├── case/
│   │   ├── CaseCard.tsx
│   │   ├── BriefingModal.tsx
│   │   ├── SceneCard.tsx
│   │   ├── SceneModal.tsx
│   │   ├── SuspectCard.tsx
│   │   └── VictimCard.tsx
│   ├── interrogation/
│   │   ├── ChatInterface.tsx
│   │   ├── ChatBubble.tsx
│   │   ├── TypingIndicator.tsx
│   │   └── QuestionPanel.tsx
│   ├── evidence/
│   │   ├── EvidenceBoard.tsx
│   │   ├── ClueCard.tsx
│   │   └── ClueModal.tsx
│   └── result/
│       ├── VerdictBanner.tsx
│       ├── NarrativeReveal.tsx
│       └── CaseReport.tsx
├── data/
│   ├── index.ts
│   ├── categories.ts
│   └── cases/
│       └── thornwood.ts                 (The flagship case — full implementation)
├── store/
│   ├── gameStore.ts
│   └── uiStore.ts
├── types/
│   ├── case.ts
│   ├── game.ts
│   └── index.ts
├── lib/
│   ├── utils.ts                         (cn(), percentage(), etc.)
│   ├── scoring.ts
│   └── caseEngine.ts
└── hooks/
    ├── useCase.ts
    └── useSuspect.ts
```

---

## PAGES — REQUIRED SCREENS

Build all of the following. Every screen must be fully functional — no placeholder content, no "coming soon" inside the main flow, no broken navigation.

### 1. Landing Page (`/`)

A full-screen cinematic hero introducing the product. Must include:

- An animated tagline cycling between 3 phrases (fade transition, not jump cut):
  `"Every clue tells a story."` → `"Every suspect has a secret."` → `"Only the truth ends it."`
- The app name in large serif type: **Red Thread**
- A short, evocative description (2 sentences)
- Two CTAs: "Begin Investigation" (→ `/cases`) and "The Thornwood Affair" (→ `/cases/thornwood-affair`)
- A floating ambient glow effect behind the headline (CSS radial gradients, animated slowly with `float` keyframe — no JavaScript, no canvas)
- A featured case section below the fold showing 3 atmospheric preview cards
- A "How It Works" section with 4 steps (choose case → interrogate → collect evidence → accuse)
- A "More Cases Coming" section showing locked category cards with greyed-out states
- A minimal footer

### 2. Case Browser (`/cases`)

- Top navigation with back link
- Section header: "Case Files"
- Category filter pills (clickable, filter the list)
- Case cards displayed in a responsive grid (1 col mobile, 2 col tablet, 2 col desktop)
- Each card shows: title, subtitle, description, setting, era, difficulty dots, time estimate, suspect avatar stack (5 mini-avatars), evidence count, progress bar (if started), CTA button that changes between "Investigate", "Continue", and "Play Again"

### 3. Investigation Hub (`/cases/[caseId]`)

The core gameplay screen. A tabbed interface with 5 tabs:

**Tab 1 — Overview:**
- Victim profile card (name, profession, cause of death, time, found by, last seen)
- List of explorable scenes (each is a clickable card that opens a modal)
- Quick suspect grid with suspicion meters linking to interrogation pages
- Case progress stats (clues found, scenes explored, score)

**Tab 2 — Suspects:**
- Full grid of suspect cards, one per suspect
- Each card: avatar, name, role, tagline in italic, motive preview, alibi, suspicion bar, "Interrogate" button
- Suspicion bar updates reactively as player asks questions

**Tab 3 — Evidence:**
- All collected clues in a visual grid
- Filter by type (Physical, Document, Testimony, Forensic)
- Clue cards show: icon, name, type badge, weight (Critical/Significant/Minor), reveal text
- "Incriminating" and "Red Herring" badges
- Gold arrow showing which suspect a clue links to
- Undiscovered clues shown as locked placeholders (count only, no names)
- "Full Evidence Board" link to `/cases/[caseId]/evidence`

**Tab 4 — Timeline:**
- Vertical timeline with gold left-line connector
- Each event: timestamp in serif gold, description, involved suspect avatars, verified/unverified badge, linked clue badge if collected
- Timeline reveals connections across multiple events

**Tab 5 — Notes:**
- A free-form textarea for the player's own notes
- Saves on every keystroke (debounced) to Zustand store
- Persistent between sessions

**On the hub:**
- Persistent case nav bar at top with: back link, case title, progress bar, score, "Accuse" button
- Once 3+ clues are found, show a bottom CTA: "The evidence is mounting. Are you ready to accuse?"
- A Briefing Modal appears on first visit (shows victim, setting, time of death, detective intro text) with a "Begin Investigation" button

### 4. Scene Modal (overlay on Investigation Hub)

Triggered when player clicks a scene card. Full overlay with:
- Scene title and mood badge
- 3–4 paragraphs of cinematic narrative prose (italic serif)
- List of discoverable clues with "Examine" buttons
- Each clue: icon, name, a teaser description until collected, then full reveal text
- Collecting a clue awards points and adds it to the evidence board
- "Mark Scene Complete" button closes the modal and awards scene points

Scenes are gated: some require a specific clue to have been found first. Locked scenes show a lock icon and the condition: *"Find [Clue Name] to unlock this scene."*

### 5. Interrogation Chat (`/cases/[caseId]/interrogate/[suspectId]`)

A full-screen chat interface. Required elements:

**Left sidebar (desktop) / collapsible panel (mobile):**
- Suspect avatar (large, gradient circle with initial)
- Suspect name, role, relationship to victim
- Suspicion meter (labeled bar, 0–100, updates as questions are asked)
- Tagline in italic
- Backstory paragraph
- Known alibi
- Suspicious behaviors list
- "Other Suspects" quick-navigation (chips/pills linking to other suspects)

**Main chat area:**
- Player messages appear right-aligned in a gold-tinted bubble
- Suspect responses appear left-aligned with the suspect's avatar, in italic serif with a tone indicator (a colored dot + label: Defensive / Nervous / Hostile / Cooperative / Evasive / Calm / Emotional)
- Each tone indicator has a distinct color (gold, crimson, green, etc.)
- An animated typing indicator (3 pulsing dots) appears while the response "loads" (simulate a 800–1200ms delay for realism)
- Auto-scroll to the latest message

**Question panel at bottom:**
- List of available questions the player can ask
- Each question shows a category dot (colored by type: alibi, motive, relationship, evidence, behavior, accusation)
- Questions that require an undiscovered clue are hidden entirely (they appear when the clue is found)
- Asked questions are removed from the list
- When all questions are exhausted: show "All questions asked" state with links to return to investigation or make accusation
- Asking a question awards points; some questions unlock new clues automatically

### 6. Evidence Board (`/cases/[caseId]/evidence`)

Full-page view of all collected evidence.

- Header with count (e.g., "7 of 12 items collected")
- Type filter bar
- "Critical Evidence" section (red accent, separate from supporting)
- "Supporting Evidence" section (gold accent)
- Each card is clickable — opens a ClueModal overlay with full analysis, location, analysis text, suspect link
- "Evidence by Suspect" section at bottom: each suspect with their linked clues listed
- Suspects with 2+ linked clues get a "High Suspicion" badge
- Undiscovered clues shown as greyed locked cards (count visible, no content)
- If 0 clues: show a full empty state with CTA to return to investigation

### 7. Accusation (`/cases/[caseId]/accuse`)

A focused, dramatic screen for the final decision.

- Atmospheric background with a deep red radial glow
- Headline: "Who Killed [Victim Name]?"
- Evidence summary showing collected clues as pills (brief confirmation of what they know)
- Full grid of suspect cards in selectable mode:
  - Clicking a card selects it (visual: 2px red border, subtle crimson background, checkmark in corner)
  - Cards show: avatar, name, role, motive summary, evidence link count (from collected clues), suspicion level
- Once selected: an accusation confirmation panel appears:
  - Shows the accused suspect prominently
  - A first-pass "I'm Certain →" button transitions to a second confirmation
  - Second confirmation: a stark warning ("This accusation is final. Are you absolutely certain?"), a "Wait..." button to go back, and a "Make Final Accusation" button
  - The final button shows a loading state for 1.4 seconds before routing to the result

### 8. Case Result (`/cases/[caseId]/result`)

The most cinematic screen in the app. A phased dramatic reveal.

**Phase 1 (0ms):** Loading spinner with "Reviewing the evidence..."

**Phase 2 (1200ms):**
- If correct: large gold badge emoji + "Case Solved" badge + huge serif text "Correct." + affirming message
- If wrong: scales in "Wrong." in crimson + "An innocent person has been accused."

**Phase 3 (3000ms):**
- Side-by-side cards: "You Accused" vs "The Real Killer"
- Correct: both show the same person with a gold checkmark
- Wrong: innocent person (with red X) vs the actual killer (with gold badge)

**Phase 4 (5500ms):**
- The ending narrative (full prose, different text for each suspect accused)
- "The Hidden Truth" card — reveals the case twist
- "The Killer's Tell" — shows what should have given them away (always shown regardless of correctness)
- Case Report grid: final score, detective rank, clues found, scenes explored, interrogations conducted
- Score breakdown bar chart
- Detective rank progression showing all 5 ranks with current one highlighted
- Two buttons: "Back to Cases" and "Play Again"

---

## THE FLAGSHIP CASE — THE THORNWOOD AFFAIR

Build one complete, fully playable mystery case. This is mandatory. The case must be rich, fair, and satisfying.

**Case ID:** `thornwood-affair`
**Title:** The Thornwood Affair
**Subtitle:** A Lord. A Legacy. A Lie.
**Setting:** Thornwood Estate, Somerset, England
**Era:** October 1923
**Difficulty:** Detective (level 2 of 4)
**Category:** Inheritance & Estate
**Estimated time:** 25–40 minutes

**The Victim:** Lord Edmund Thornwood, 74 — found poisoned in his private study. Cause of death: aconitine (wolf's-bane extract). Time of death: 11:30 PM – 1:00 AM. Found by: Eleanor Marsh at 6:30 AM.

**The Killer:** James Thornwood (the son). He poisoned the brandy using wolf's-bane harvested from the estate greenhouse. His motive: crushing debt and impending total disinheritance.

**The Twist:** Sophie Laurent (the fiancée, everyone's prime suspect) was actually trying to SAVE the Lord. She wrote him a warning letter about James's dangerous desperation. James intercepted and burned it.

**Six Suspects — build complete profiles for all:**

1. **James Thornwood** (44, the son) — charming, desperate, the killer
2. **Victoria Thornwood** (47, the daughter) — disinherited, angry, innocent (secret: was having a love affair that night)
3. **Eleanor Marsh** (63, housekeeper of 38 years) — knows all secrets, protecting James out of love, cracks under the right question
4. **Dr. Philip Crane** (57, family physician) — nervous, early arrival, innocent (was summoned by Lord to address a prior misdiagnosis)
5. **Sophie Laurent** (29, fiancée) — widely suspected, completely innocent, tried to warn the Lord
6. **Marcus Webb** (61, former business partner) — cold, calculating, came to settle a dispute, innocent

**Twelve Clues — build all of them:**

*Critical weight (80 points each):*
1. 🥃 The Poisoned Brandy Glass — aconitine confirmed in residue
2. 🔗 Monogrammed Cufflink — "J.T." found behind the drinks cabinet
3. 📜 Sophie's Undelivered Warning — fragment of burned letter in study fireplace
4. 👁️ Eleanor's Testimony — she saw James in the corridor at midnight (unlocked when questioned)

*Significant weight (40 points each):*
5. 📋 Greenhouse Access Ledger — wolf's-bane disturbed 3 days before murder
6. 🌿 James's Greenhouse Admission — confirmed via interrogation
7. 🗝️ Eleanor's Key Log Gap — greenhouse key removed from hall hook that night
8. 💷 James's Outstanding Debts — confirmed by Marcus Webb
9. 📑 The New Will Details — confirmed by Dr. Crane (James cut out entirely)
10. 🧠 James's Behavioral Profile — pattern of deflection and evasion across interrogation

*Minor weight / Red Herrings (20 points each):*
11. 🔥 Victoria's Burned Letters — love letters, not incriminating (red herring)
12. ✉️ Lord's Letter to Dr. Crane — explains his early arrival (red herring, clears Crane)

**Four Scenes:**
1. The Estate at Dawn (unlocked from start) — discovers the brandy glass
2. The Private Study (unlocked from start) — discovers the cufflink + burned letter fragment
3. The Estate Greenhouse (unlocked when brandy glass found) — discovers greenhouse log + key gap
4. The Evidence Speaks (unlocked when Eleanor is questioned and she reveals James) — behavioral analysis clue

**Eight Timeline Events:**
- 7:00 PM: Dinner (all present)
- 9:30 PM: Lord Thornwood retires to study with Sophie
- 10:15 PM: James reportedly goes to his wing (unverified)
- 10:45 PM: Sophie says goodnight to Lord
- 11:00 PM: Estimated window for poison introduction
- 11:50 PM: Eleanor sees James near study (key testimony)
- 12:00 AM: Sophie checks on Lord, finds him apparently sleeping
- 6:30 AM: Eleanor finds the body

**Six Endings — write distinct narrative prose for each accused suspect.** The correct ending (James) is the longest and most satisfying. The five wrong endings each show a specific consequence of the wrong accusation (the real killer escapes, details shift, justice fails in distinct ways).

**Questions for each suspect:** Minimum 4 per suspect. At least one per suspect must require a clue to unlock. At least one per suspect must unlock a new clue when asked. Every response should be written in period-appropriate voice (formal, 1920s English). Suspect responses should feel psychologically distinct — James deflects and over-explains, Eleanor is evasive then cracks, Sophie is resigned and resigned, Victoria is emotional, Dr. Crane is nervous but honest, Webb is cold and direct.

---

## STATE MANAGEMENT REQUIREMENTS

Use **Zustand** with the `persist` middleware.

**Game store (`gameStore.ts`) — persisted:**
- Player name
- Player career stats (cases completed, total score, accuracy rate, clues found)
- All active case states (one per case the player has touched)
- Each case state includes: started/last played timestamps, discovered clues, completed scenes, full chat history per suspect, score, notes, accusation status, final rank

**UI store (`uiStore.ts`) — NOT persisted:**
- Active modal type + data
- Active scene ID
- Active clue ID (for clue detail modal)
- Current investigation tab
- Mobile panel open/closed state

**Hydration pattern:** Every page that uses persisted Zustand state must check `mounted` state before rendering — use `const [mounted, setMounted] = useState(false)` + `useEffect(() => setMounted(true), [])` and return a loading skeleton until mounted.

**Schema versioning:** Include `version: 1` and a `migrate` function in the persist config. This future-proofs schema changes.

---

## SCORING SYSTEM

Implement a points system that tracks throughout gameplay:

- Minor clue found: 20 pts
- Significant clue found: 40 pts
- Critical clue found: 80 pts
- Question asked: 10 pts
- Scene completed: 30 pts
- Correct accusation: +200 pts
- Wrong accusation: -100 pts (min score 0)

**Five detective ranks:**
1. Rookie Constable (0+ pts)
2. Junior Detective (200+ pts)
3. Senior Detective (400+ pts)
4. Chief Inspector (600+ pts)
5. Master Detective (800+ pts)

Show the rank in the navigation during gameplay and prominently in the result screen.

---

## COMPONENT REQUIREMENTS

### Primitives (src/components/ui/)

Every primitive must:
- Accept a `className` prop for override
- Never import from the game store
- Never use `useEffect` for its core behavior
- Have explicit TypeScript interfaces (no `any`)
- Handle disabled states visually

**Button:** Variants: `gold`, `ghost`, `crimson`, `ghost-gold`. Sizes: `sm`, `md`, `lg`. Optional `loading` state (spinner). Optional `icon` with `left`/`right` position.

**Badge:** Variants: `gold`, `crimson`, `iris`, `muted`, `success`. Optional dot. Compact text display.

**Modal:** Accepts `open`, `onClose`, `size` (`sm`/`md`/`lg`/`full`), optional `title`. Uses `createPortal` to render in `document.body`. Traps focus. Responds to Escape key. Backdrop click closes (when `closeable`).

**Avatar:** Gradient circle with initial letter. Sizes: `xs`(24px), `sm`(36px), `md`(48px), `lg`(64px), `xl`(96px). Optional `glowColor` for post-accusation dramatic effect.

**Progress:** Bar variant (horizontal fill) and ring variant (circular). Animated fill on mount. Shows value label optionally.

**Tabs:** Pill variant (glass background, gold active state). Renders full-width on mobile, left-aligned on desktop.

**EmptyState:** Icon (emoji), title, description, optional CTA button. Used on evidence board when nothing collected, interrogation when no questions remain, etc.

**Spinner:** Three sizes. Color options: gold, mist, white.

### Domain Components

All domain components may read from the game store but must pass callbacks for mutations — they do not call `store.set()` directly.

---

## ANIMATION IMPLEMENTATION

Define all animations in `globals.css` as `@keyframes`. Apply via CSS classes. Never use JavaScript-driven animation for anything that CSS can handle.

Required keyframe definitions:
```css
@keyframes fadeIn   { from { opacity: 0 } to { opacity: 1 } }
@keyframes fadeUp   { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
@keyframes fadeDown { from { opacity: 0; transform: translateY(-16px) } to { opacity: 1; transform: translateY(0) } }
@keyframes scaleIn  { from { opacity: 0; transform: scale(0.96) } to { opacity: 1; transform: scale(1) } }
@keyframes slideInRight { from { opacity: 0; transform: translateX(24px) } to { opacity: 1; transform: translateX(0) } }
@keyframes slideInLeft  { from { opacity: 0; transform: translateX(-24px) } to { opacity: 1; transform: translateX(0) } }
@keyframes float    { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
@keyframes pulse    { 0%, 100% { opacity: 0.3 } 50% { opacity: 0.8 } }
```

Standard easing for all transitions: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo)

Apply stagger delays via inline style: `style={{ animationDelay: \`\${index * 80}ms\` }}`

Use an `opacity-0-init` CSS class (sets `opacity: 0`) + an animation class (which brings it back to `opacity: 1`) to prevent FOUC on staggered elements.

---

## RESPONSIVE DESIGN REQUIREMENTS

Mobile-first. Every screen must be fully usable on a 375px viewport (iPhone SE size).

**Breakpoint behavior:**

Investigation Hub:
- Mobile: stacked layout, tab bar at top, content below
- Desktop: same tab layout, wider content area

Interrogation:
- Mobile: suspect profile hidden in a collapsible "View Profile" drawer at top
- Desktop: side-by-side — profile panel (320px fixed) + chat area (flex-1)

Evidence Board:
- Mobile: 1 column grid
- Desktop: 3 column grid

Result Screen:
- Mobile: full-width cards stacked
- Desktop: 2-column grid for accusation vs. truth

Navigation:
- Mobile: compact nav, no subtitle text, icon + score only
- Desktop: full nav with all elements visible

---

## QUALITY REQUIREMENTS

These are hard requirements. The build is not complete without them.

**No broken flows.** Every button must do something. Every navigation link must go somewhere valid. The entire user journey from landing → case selection → investigation → interrogation → evidence → accusation → result must be completable without encountering a dead end or error.

**No placeholder text.** No "lorem ipsum." No "Coming soon" inside any active flow. "Coming soon" is acceptable only on locked category cards on the landing page and case browser — nowhere inside an active investigation.

**No broken TypeScript.** The build must compile cleanly (`next build` should produce zero type errors). Use strict mode. No `any` types except where absolutely unavoidable (and document why).

**No unfinished UI states.** Every screen must have:
- A loading state (for async operations)
- An empty state (for when there's no data to show yet)
- A completed/done state

**Working local persistence.** A player who refreshes the page mid-investigation must find their evidence, chat history, notes, and score exactly as they left them.

**Working case completion loop.** The player must be able to start a case, progress through all scenes, interrogate all suspects, collect clues, make an accusation, and see a satisfying result screen — all in one uninterrupted flow.

---

## CODE QUALITY REQUIREMENTS

**TypeScript:** Strict mode. All types explicitly declared. No implicit `any`. All component props have interfaces. All store slices have interfaces.

**Component size:** No single component file should exceed 400 lines. If it does, extract subcomponents.

**Naming conventions:**
- Components: PascalCase (`CaseCard.tsx`)
- Hooks: camelCase, prefixed with `use` (`useCase.ts`)
- Utils: camelCase (`calculateProgress`)
- Types: PascalCase with noun (`Suspect`, `ClueWeight`)
- Constants: SCREAMING_SNAKE_CASE (`SCORE_EVENTS`)
- CSS classes: kebab-case (`.card-premium`)

**Comments:** Add a one-line comment above every function that has non-obvious logic. Add block comments above each major section in long files.

**Imports:** Use `@/` path aliases throughout. No relative `../../..` imports. Configure in `tsconfig.json`.

**No console.logs** in production paths. Development-only logs must be wrapped in `if (process.env.NODE_ENV === 'development')`.

---

## GITHUB & VERCEL DEPLOYMENT REQUIREMENTS

**The project must build cleanly on Vercel with zero configuration.**

Requirements:
- `next.config.js` must be present and valid
- `package.json` must include `"build": "next build"` script
- `.gitignore` must exclude `node_modules`, `.next`, `.env*.local`, `.vercel`
- `.env.example` must be included showing required environment variable names (with placeholder values, not real values)
- No environment variables are required for the base app (all Phase 1 features work without any env vars)
- No hardcoded API keys or secrets anywhere in the codebase
- All image/asset references must use paths that work in both local and Vercel environments
- The `public/` folder must exist (can be empty)

**README.md must include:**
1. What the app does (2 paragraphs)
2. Tech stack table
3. Install & run locally instructions
4. Build & deploy to Vercel instructions (both CLI and GitHub integration)
5. How to add new mystery cases
6. How to add AI-powered interrogation (Phase 3 roadmap with sample code)
7. Environment variables guide
8. Project structure overview

---

## EXECUTION INSTRUCTIONS

1. Read this entire prompt before writing any code.
2. Write `package.json` and all config files first.
3. Write all TypeScript types (`src/types/`) before any components.
4. Write the case data (`src/data/cases/thornwood.ts`) next — it is the foundation everything else references.
5. Write the Zustand stores (`src/store/`) before any pages.
6. Write the shared UI primitives (`src/components/ui/`) before domain components.
7. Write pages from outermost to innermost: layout → landing → cases → hub → interrogation → evidence → accuse → result.
8. After all files are written, do a final pass checking for:
   - TypeScript errors
   - Dead links (every `Link href` must point to a real page)
   - Empty states (every data-dependent view has one)
   - Loading states (every async action has one)
   - Mobile layouts (test every page mentally at 375px width)

Do not stop until the complete, working app is built. If you hit something ambiguous, make the most premium, user-friendly choice and continue.

---

## FINAL STANDARD

When you are done, the app should meet this bar:

A person who has never seen it opens it, and their first reaction is: *"This looks expensive."*

A person who plays through the full case says: *"That was actually a really good mystery."*

A developer who reads the code says: *"This is clean, organized, and easy to extend."*

A designer who reviews the UI says: *"This is exactly the right amount of refinement."*

Build to that standard. Nothing less.

---

## PROMPT END

---

*Save this prompt. Use it in full when building with Claude Code, Cursor, or any capable AI coding environment. The more capable the model, the better the output — use the best available.*
