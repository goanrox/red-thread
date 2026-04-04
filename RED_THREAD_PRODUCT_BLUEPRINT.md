# Red Thread — Product Blueprint
### The Definitive Founding Document

*Version 1.0 — April 2026*

---

## 1. Product Vision

Red Thread is the first premium narrative mystery platform built for people who don't play games — but love a great story.

It occupies a space no product has claimed: the intersection of prestige crime television, literary mystery craft, and interactive deduction. The experience is not gamified in the shallow sense — no energy bars, no randomized rewards, no push notifications begging you to return. Instead, it borrows from the best of what makes a great mystery novel or limited series: a genuinely solvable case, psychologically distinct characters, a slow revelation of truth, and a final moment of judgment that means something.

The product thesis is simple: **mystery-solving is a fundamentally human pleasure that the web has never treated seriously.** Red Thread treats it seriously.

The emotional promise: you open Red Thread and feel like a detective in a prestige TV show. You close it feeling like you either earned justice or failed it. That feeling — of consequence, of craft, of something that respected your intelligence — is what drives return visits and word of mouth.

---

## 2. Target Audience

### Primary: The Prestige TV Fan (25–45, any gender)
The person who binged *True Detective*, *Sharp Objects*, *Broadchurch*, *The Sinner*, and *Poker Face*. They love the genre but are passive — they watch, they don't play. Red Thread converts them by meeting them where they are: no gaming background required, no tutorials, no leveling system to learn. Just a case, some suspects, and their instincts.

**Psychographic:** Curious, educated, aesthetically literate. They notice when something looks cheap. They trust brands that feel intentional. They pay for Spotify, pay for The Atlantic, pay for a good wine app. They will pay for this.

### Secondary: The Escape Room Enthusiast
They've done every local escape room. They love collaborative deduction but want a solo, on-demand version they can do at 11pm on a Tuesday. Red Thread fills that gap — it's an escape room you carry everywhere, with higher production value than any physical room.

### Tertiary: The Mystery Reader
Agatha Christie fans, Tana French readers, people who buy locked-room puzzle books. They're used to engaging their mind with a mystery. Red Thread gives them interactivity without sacrificing the literary quality they expect.

### Who Red Thread is NOT for
Hardcore video gamers seeking mechanical challenge. Casual mobile players looking for a distraction. Children. People who want AI-generated content they have to prompt themselves.

### Market Sizing Context
The global mystery/thriller genre commands the largest fiction readership in the world. Escape room revenues in the US alone exceed $700M/year. Crime TV dominates streaming. The demand is proven — the quality execution is missing.

---

## 3. Unique Differentiators

These are the six things Red Thread does that no other mystery product does. Protect all six.

**1. Cases are crafted, not generated.**
Every clue is fair. Every suspect has a coherent psychology. The killer is solvable. Red Thread cases are written with the discipline of a published mystery novelist — foreshadowing, misdirection, and a satisfying revelation are built in from the structure up, not bolted on. This is the product's deepest moat: quality writing cannot be rushed or commoditized.

**2. The UI is the experience.**
Most "mystery games" look like apps. Red Thread looks like a product. The typography, the color palette, the motion design, the spacing — every decision signals craft. When someone takes a screenshot and posts it, the screenshot itself conveys premium. The UI is not a container for content; it *is* the content.

**3. Suspects feel psychologically real.**
James Thornwood doesn't just lie — he *over-explains*, the way a guilty person does. Eleanor Marsh doesn't just evade — she deflects with loyalty, which is why cracking her feels earned. Each suspect's response patterns are a character fingerprint. This is not a feature most users will consciously notice, but they will feel it. They'll say "something about him seemed off." That reaction is the goal.

**4. The evidence board rewards actual deduction.**
Players don't just collect clues — they're forced to cross-reference them. A clue found in the greenhouse only becomes meaningful when connected to a timeline event and a suspect's alibi. The design of the evidence system rewards systematic thinking, not random clicking.

**5. No dead ends. No broken states.**
The internet is full of mystery "games" that fall apart in the middle — dead-end dialogue trees, missing pages, broken states. Red Thread is built with the discipline of a production engineer: every flow completes, every button does something, every empty state is designed. The product respects the user's time in a way competitors consistently fail to.

**6. Season-based release cadence creates appointment culture.**
Red Thread releases cases in curated Seasons — 4–6 cases per season, released monthly. Each season has a thematic arc. This creates the same anticipatory culture as a prestige TV season — subscribers who look forward to what's next, not users who bounce after one case.

---

## 4. The Core Gameplay Loop

The loop is built on five beats, each with a distinct emotional state:

```
ENTER → ORIENT → INVESTIGATE → CONVERGE → JUDGE → REVEAL
```

**ENTER — The Briefing (emotional state: curiosity)**
The player receives the case file. Victim, setting, time, circumstances. Just enough to feel oriented. The briefing is cinematic — told in prose, not bullet points. The player feels like they've just been handed a dossier.

**ORIENT — The Scene (emotional state: absorption)**
The player explores scene cards — physical locations rendered in narrative prose. They collect the first clues. They meet the suspects. Nothing is obvious yet. This phase should feel like the opening act of a novel: establishing, intriguing, slightly unsettling.

**INVESTIGATE — Interrogation (emotional state: suspicion + tension)**
The player interrogates suspects one by one. Each interrogation chat has its own psychological texture. Questions are ordered strategically — easier questions first, clue-gated questions surfacing as evidence accumulates. The player builds a mental model of who is lying and why. This is the longest and most replayable phase.

**CONVERGE — The Evidence Board (emotional state: urgency)**
With clues collected and suspects interrogated, the player reviews the evidence board and timeline. Connections become visible. The theory firms up. This phase has a "closing in" feeling — the net is tightening. A well-designed case makes most players feel about 80% certain of the killer before they accuse. That 20% uncertainty is intentional — it keeps the accusation meaningful.

**JUDGE — The Accusation (emotional state: commitment + dread)**
The accusation screen is deliberately weighty. Two-step confirmation, a dramatic pause, a final warning. This is not the same as pressing a "submit" button. The player must *commit*. This moment is the emotional peak of the loop.

**REVEAL — The Result (emotional state: catharsis)**
A phased cinematic reveal. The player finds out if they were right. Regardless of the outcome, they receive the full narrative of what actually happened — who, why, how. The "Killer's Tell" section gives them the specific clue or behavioral signal that should have led them there. This is the scene they'll replay in their head and discuss with friends.

### The Replayability Mechanic
A correctly solved case ends one way. Wrongly accusing each of the five innocent suspects triggers its own unique ending — the killer escapes, justice fails in a distinct way specific to that suspect. This makes replaying a solved case genuinely different, not just a grind. Players come back to "see what happens if I accuse Victoria." This is a retention mechanic disguised as narrative depth.

---

## 5. UI Structure

Red Thread uses a **hub-and-spoke** navigation model with the Investigation Hub at the center.

### Information Architecture

```
Landing (/)
│
├── Case Browser (/cases)
│   └── [Case] Investigation Hub (/cases/[id])  ← THE HUB
│       ├── Spoke A: Interrogation rooms (/interrogate/[suspectId])
│       ├── Spoke B: Evidence Board (/evidence)
│       ├── Spoke C: Full Timeline (/timeline)
│       ├── Spoke D: Accusation Chamber (/accuse)
│       └── Spoke E: Result + Reveal (/result)
│
├── Detective Profile (/profile)
│   └── Achievements (/profile/achievements)
│
└── About (/about)
```

### Structural Principles

**The Hub is always the anchor.** Every spoke returns to the hub. Players never feel lost because the hub is always one tap away. The case nav bar with its progress indicator is always visible, reinforcing position and momentum.

**Progressive disclosure.** New capabilities surface as the player earns them. Scene 3 unlocks when a specific clue is found. A question unlocks when a related piece of evidence is collected. The interface grows with the investigation, which means early-game screens feel uncluttered and late-game screens feel rich.

**Mobile-first, keyboard-friendly.** The interrogation chat must work perfectly on a phone at 375px. The evidence board collapses gracefully to a single column. The accusation screen works via tap or click with equal satisfaction.

**Minimal global navigation.** The site-wide nav has three items: Logo (home), Cases, Profile. Nothing else. Inside a case, the case nav bar takes over. This keeps the chrome lightweight and the content dominant.

### The 5-Tab Investigation Hub

The hub is the product's most important screen — players spend 70% of their time here. The tab structure keeps five information types accessible without page transitions:

- **Overview** — Victim, scenes, quick suspect grid, progress stats
- **Suspects** — Full profiles with suspicion meters; the grid is the visual centrepiece
- **Evidence** — Collected clues, filtered by type; locked placeholders for undiscovered items
- **Timeline** — Vertical event chain with verified/unverified states
- **Notes** — Free-text, auto-saved, private to the player

The tab bar uses pill-style indicators with a gold active state. On mobile, tabs collapse to a scrollable strip. Tab switching never causes a page load — all content is client-side reactive.

---

## 6. Mystery Categories for Launch

### The Tier System

Categories are not just genres — they're promises about setting, tone, and difficulty archetype. Each category has a distinct visual identity (different secondary accent, different era typography treatment) while sharing the same core design language.

### Launch Categories (2 active, 4 locked)

**ACTIVE AT LAUNCH:**

**Inheritance & Estate** *(flagship)*
The aristocratic murder — wills, wealth, family secrets, grand houses. 1900s–1950s England. Difficulty: Intermediate. The most iconic mystery genre; the Agatha Christie sweet spot. Players feel like Poirot without the camp. *The Thornwood Affair* lives here.
Visual accent: Deep gold, candlelit warmth, serif-heavy.

**High Society**
Glamour, poison, alibi games at parties and galas. 1920s Paris, 1940s New York. Difficulty: Intermediate–Hard. The setting does emotional work — every suspect has something to protect. Clues are social, not physical.
Visual accent: Champagne and midnight blue.

**LOCKED AT LAUNCH (tease only):**

**Corporate Thriller**
Modern. A CFO dead in a boardroom. Insider trading, silenced whistleblowers, hostile acquisitions. Contemporary. Difficulty: Hard. Appeals to the MBA-adjacent player who knows how power actually works.
Visual accent: Cold blue-gray, fluorescent-corporate-turned-sinister.

**Cold Case Revival**
A case from 1978 that was never solved. You play as a modern detective reviewing original evidence plus new leads. Dual-timeline format — evidence from both eras. Difficulty: Expert. The nostalgia and procedural realism make this category unique.
Visual accent: Faded sepia transitioning to present-day cool tone.

**Small Town Secrets**
Contemporary. A tight community where everyone knows everyone and no one says so. A death that the town wants to call an accident. Difficulty: Beginner–Intermediate. The emotional accessibility makes this the best entry point for new players.
Visual accent: Warm rust and fog.

**The Unseen Hand** *(future premium tier)*
Espionage and conspiracy. International. Multi-case narrative arcs where evidence from one case unlocks context in another. Difficulty: Expert. For the player who has mastered every other category.
Visual accent: Pure black and mercury silver.

### Category Unlock Strategy
Lock 4 categories at launch. Display them on the case browser and landing page in a deliberately tantalizing greyed-out state — label, icon, tagline, and a "Coming in Season 2" badge. This turns unavailable content into a retention hook: players subscribe because they want to see these categories open.

---

## 7. MVP Feature Set

The MVP must do one thing perfectly: deliver a single, complete, satisfying mystery experience that makes a player tell someone else about it.

### MVP Scope (Phase 1)

**One complete playable case — The Thornwood Affair**
Full implementation: 6 suspects, 12 clues, 4 scenes, 8 timeline events, 6 unique endings. Every word of dialogue written. Every clue connected. Every ending narrative complete.

**Full interrogation system (pre-written responses)**
No AI in Phase 1. Responses are authored. This guarantees quality, consistency, and zero hallucinations. Players don't know the difference — they experience a suspect who sounds human.

**Evidence board with clue type filtering**
Physical, Document, Testimony, Forensic. Critical vs. Supporting sections. Locked placeholders for undiscovered items. Full clue detail modal with suspect linkage.

**Visual timeline**
8 events, chronological, with verified/unverified states and linked clues. Gold connector line. Suspect avatars per event.

**Scene exploration**
4 scenes, 2 unlocked from start, 2 gated by clue discovery. Each with narrative prose, discoverable clue list, and a scene-complete action.

**Accusation flow with two-step confirmation**
Full suspect grid in selectable mode. Confirmation panels. 1.4-second loading state before result.

**Phased result reveal**
Four timed phases. Verdict banner, accuser-vs-truth cards, full narrative prose per accused suspect, case report, score breakdown, rank progression.

**Scoring and 5-tier detective rank system**
Points for clues, questions, scenes, and correct accusation. Rank shown in navigation and result screen.

**Local save/resume with Zustand persist**
Full game state survives page refresh. Chat history, collected clues, notes, score — all persisted. Hydration-safe rendering.

**Detective notes**
Free-text per case, auto-saved on keystroke with debounce.

**Landing page**
Animated hero, rotating taglines, featured case preview cards, "How It Works" section, locked category grid, footer.

**Case browser**
Category filter pills, case cards with progress indicators, dynamic CTA state (Investigate / Continue / Play Again).

**Detective profile page**
Career stats, completed cases, total score, accuracy rate, rank display.

**Responsive design**
Every screen fully usable at 375px. Interrogation sidebar collapses to drawer on mobile.

### What Is Deliberately Not in MVP

- AI-powered interrogation (Phase 3)
- User authentication / accounts (Phase 2)
- Multiplayer / collaborative solving (future)
- Audio design / sound effects (Phase 2)
- New cases beyond Thornwood (Season 1 cases begin Phase 2)
- Backend / database (Phase 2 with Supabase)
- Push notifications / email (Phase 2)
- Native mobile app (future)

---

## 8. Monetization Model

### Philosophy
Red Thread is a **premium experience, not a free-to-play game.** No ads. No energy systems. No random loot. The monetization model is built on a single principle: people pay for things they love and tell others about.

The Thornwood Affair is permanently free. Not as a hook to bait and switch — as a genuine invitation. If it's good enough, people pay. If they need to be tricked into paying, the product failed.

### Revenue Tiers

**Tier 0 — Free Forever**
- The Thornwood Affair (1 complete case, forever)
- Detective profile with stats
- Full feature access within the free case

Rationale: Lowers the barrier to entry to zero. A player who completes Thornwood and wants more is the highest-intent customer on the internet. Convert them cleanly.

**Tier 1 — Single Case Purchase**
- $4.99 per case
- Permanent ownership, no subscription required
- Available for all released cases outside Thornwood

Rationale: For the player who wants one more after Thornwood. Low friction, high satisfaction. Impulse-purchasable.

**Tier 2 — Detective Subscription**
- $3.99/month (billed monthly) or $29.99/year (~$2.50/month)
- Access to all released cases
- Early access to new Season cases (1 week before single-purchase availability)
- Subscriber-only "cold files" — shorter bonus cases, 15–20 min, between Seasons

Rationale: The clearest path to sustainable revenue. Targets the player who finishes Thornwood and immediately wants the whole library. Annual billing dramatically improves LTV.

**Tier 3 — Season Pass**
- $12.99 per Season (4–6 cases)
- One-time purchase, permanent access to that Season
- Includes a Season digital booklet (case art, character sketches, the writer's commentary)

Rationale: For the player who doesn't want a recurring subscription but wants to commit to a curated arc. The booklet is a perceived-value add that costs nothing to produce.

**Tier 4 — Collector's Edition (future)**
- $24.99 once
- Lifetime access to all cases, all Seasons
- Exclusive "Founder" rank badge and case browser border treatment
- Access to a private Discord with the writing team
- Limited to 1,000 purchasers (scarcity is real — once closed, it's closed)

Rationale: Captures the superfan who would have spent hundreds anyway and converts them early at a high price. The limit creates urgency without being manipulative.

### Revenue Model Summary

| Tier | Price | Target User | Goal |
|------|-------|-------------|------|
| Free | $0 | New users | Acquisition |
| Single case | $4.99 | Casual returners | Low-friction conversion |
| Monthly sub | $3.99/mo | Regular players | Recurring revenue |
| Annual sub | $29.99/yr | Committed fans | LTV maximization |
| Season Pass | $12.99 | Arc followers | Mid-tier revenue |
| Lifetime | $24.99 (limited) | Superfans | High-intent capture |

### What Will Never Be Sold
- Hints (pay-to-win destroys the experience)
- Ad placements of any kind
- Player data
- Skip-the-waiting mechanics

---

## 9. Visual Design Direction

The visual language of Red Thread has a name internally: **"The Archive."**

The metaphor: you are looking at a private collection assembled by a brilliant, meticulous detective who has spent decades in dimly lit rooms with expensive bourbon and an eye for the significant detail. Everything is curated. Nothing is accidental. The space feels like money — old money, not new money.

### The Color System: What Each Color Means

Colors in Red Thread are not decorative. They carry meaning. Use them consistently or dilute them.

| Token | Hex | Meaning | When to Use |
|-------|-----|---------|-------------|
| `void` | #07070e | The absolute background | Body, behind everything |
| `abyss` | #0c0c17 | Depth layers | Page sections, contrast areas |
| `surface` | #111120 | Cards | All cards and panels |
| `surface2` | #181828 | Elevated cards | Modals, overlays |
| `surface3` | #1f1f35 | Hover states | Interactive hover layers |
| `border` | #2a2a45 | Structure | All borders, dividers |
| `gold` | #c9a84c | Significance | CTAs, active states, important clues, score |
| `gold-light` | #e8cc88 | Interaction | Gold hover, active gold links |
| `crimson` | #8b2232 | Danger | Wrong answers, red herrings, high suspicion, warnings |
| `crimson-light` | #c13248 | Interaction | Crimson hover, accusation hover states |
| `iris` | #6b63d4 | Insight | Locked clue reveals, "aha" moments, timeline connections |
| `parchment` | #f0ece0 | Primary text | All readable body copy |
| `mist` | #a8a5c0 | Secondary text | Labels, metadata, supporting copy |
| `shadow` | #5c5a78 | Tertiary text | Disabled states, timestamps |

**Gold is a reward.** Use it sparingly. When the player sees gold, they should feel like something important just happened. If gold is everywhere, it means nothing.

### Typography: The Two-Voice System

Red Thread has two typographic voices — and they must never cross.

**Voice 1: The Narrative Voice — Cormorant Garamond, Serif**
Used for: case titles, victim names, scene prose, suspect speech, endings, taglines, era markers, any content that came from *inside the world of the case.*
The feeling: literary, period-specific, weighty, elegant.

**Voice 2: The Interface Voice — Inter, Sans-serif**
Used for: navigation, buttons, labels, tabs, score displays, badges, stats, anything that lives in the *player's world* outside the case.
The feeling: clean, precise, modern, functional.

This two-voice system creates a clear visual grammar: when you're reading narrative, you know you're in the story. When you're reading interface, you know you're the detective. The boundary between them is the product's most important design decision.

**Type scale highlights:**
- Case titles: Cormorant Garamond, 48–72px, light weight, tracking -0.02em
- Suspect dialogue: Cormorant Garamond, 16–18px, italic, 1.7 line height
- Navigation: Inter, 12–13px, medium weight, tracking 0.15em uppercase
- Score/stats: Inter, 28–36px, semibold, tabular nums
- Body prose: Cormorant Garamond, 16–17px, regular, 1.8 line height

### Spatial Design

**Generous margins.** Minimum 24px on mobile, 48–80px on desktop. Content never fights for space.

**Glassmorphism: disciplined, not decorative.** `backdrop-filter: blur(20px)` on the case nav bar and modals only. Not on cards. Not on everything. Used where the UI layer needs to float visually above content without hard edges.

**Depth through shadows, not gradients.** Cards create depth with `box-shadow`, not gradient fills. The background is the deepest layer. Cards sit above it. Modals sit above cards.

**Card hover: the signature micro-interaction.**
```css
transform: translateY(-2px);
border-color: rgba(201, 168, 76, 0.3);
box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.15);
transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
```
This subtle lift + gold border glow is the tactile signature of the product. Players feel the responsiveness without thinking about it.

### Motion Grammar

All motion in Red Thread obeys three rules:

1. **Entrance animations, never exit animations.** Content fades in; it does not animate out. Exit animations feel like friction.
2. **Ease-out-expo for all entrances.** `cubic-bezier(0.16, 1, 0.3, 1)` — fast start, gentle landing. This reads as confident, not sluggish.
3. **Never spin, never bounce, never rotate.** These read as toy-like. Red Thread motion is a breath, not a gesture.

**Required keyframes:**
- `fadeUp` — 500ms, for page content
- `scaleIn` — 400ms, for modals
- `float` — 6s infinite, for ambient landing page glows
- `pulse` — 1.5s infinite, for typing indicators and locked state items
- `slideInRight` — 350ms, for sidebar panels on mobile

**Stagger:** List items enter at 80ms intervals. This makes a grid of 6 suspects feel deliberate, not simultaneous.

### What Red Thread Must Never Look Like

- A mobile game (no particle effects, no score popups, no bouncing UI)
- A Discord server (no sidebar channel lists, no avatar-heavy horizontal chrome)
- A dark-mode toggle applied to a standard web app (no inverted whites, no blue links)
- A generic SaaS dashboard (no card-grid dashboards with colorful percentage stats)
- Anything with a rainbow gradient, bright neon, or floating geometric shapes

The reference mood board: first-edition Agatha Christie cover design, *Tinker Tailor Soldier Spy* film palette, the Linear.app dashboard, *The New York Times* at midnight, the interior of a well-appointed private library.

---

## 10. Pages and Screens

The full map of every screen Red Thread ships with at launch.

---

### Screen 1 — Landing Page (`/`)

**Purpose:** Acquire. Convert. Establish the brand in 8 seconds.

**Above the fold:**
- Full-viewport dark hero, `#07070e` background
- Animated radial glow (CSS, no JS) — slow float, 6s cycle, gold-crimson
- Cycling tagline (fade crossfade, 3s each): *"Every clue tells a story." → "Every suspect has a secret." → "Only the truth ends it."*
- "Red Thread" wordmark in large Cormorant Garamond
- Subtitle: 2-sentence brand statement
- Two CTAs: `Begin Investigation` (→ `/cases`) and `The Thornwood Affair` (→ `/cases/thornwood-affair`)

**Below the fold:**
- Featured cases section: 3 atmospheric cards (one active, two teased)
- "How It Works" section: 4 steps in an icon + prose grid, no bullets
- "More Cases Coming" section: locked category cards, greyed with "Coming in Season 2"
- Minimal footer: logo, nav links, copyright

**State variants:** None. This page has no logged-in state.

---

### Screen 2 — Case Browser (`/cases`)

**Purpose:** Inspire confidence that there's more. Reduce friction to starting.

**Layout:** Category filter pills at top. Responsive grid below (1 col mobile, 2 col tablet/desktop).

**Case card contents:**
- Title + subtitle (serif)
- Setting + era (small caps, mist color)
- Short description (2 sentences max)
- Difficulty meter (4 dots, filled)
- Time estimate badge
- Suspect avatar stack (5 mini-circles overlapping)
- Evidence count
- Progress bar (if case started)
- CTA button: "Investigate" / "Continue" / "Play Again" based on state

**Locked cases:** Full card visible but overlaid with a subtle lock treatment and "Coming in Season 2." Not hidden — displayed to create desire.

**Empty state:** Not applicable (always has at least Thornwood).

---

### Screen 3 — Investigation Hub (`/cases/[caseId]`)

**Purpose:** The player's home base. Must convey: "I have everything I need here."

**Persistent elements:**
- Case nav bar at top: back link, case title, progress bar, current score + rank, "Accuse" button (disabled until 3+ clues collected)
- 5-tab bar: Overview, Suspects, Evidence, Timeline, Notes

**Tab 1 — Overview:**
- Victim profile card (name, cause of death, time, found by, last seen, photo/avatar)
- Scene cards grid (locked/unlocked state, click → SceneModal overlay)
- Quick suspect grid (avatar + name + suspicion bar, click → interrogation)
- Stats bar: clues found, scenes explored, current score

**Tab 2 — Suspects:**
- Full grid of suspect cards
- Each: avatar, name, role, italic tagline, motive preview, alibi, suspicion bar, "Interrogate" button
- Suspicion bars update reactively as questions are asked

**Tab 3 — Evidence:**
- Filter pills: All, Physical, Document, Testimony, Forensic
- Critical Evidence section (crimson accent)
- Supporting Evidence section (gold accent)
- Undiscovered: grey locked cards showing count only
- "View Full Evidence Board →" link

**Tab 4 — Timeline:**
- Vertical timeline, gold left-line connector
- Events: timestamp (gold serif), prose, suspect avatars, verified badge, linked clue badge
- Unverified events shown with dashed border

**Tab 5 — Notes:**
- Full-width textarea, dark surface
- Auto-save on keystroke (300ms debounce)
- "Your notes are saved automatically" micro-label
- Persists between sessions

**First visit:** Briefing Modal appears automatically. Shows victim photo, setting, time of death, detective intro prose. Closes with "Begin Investigation." Never shows again for this case.

**Accusation CTA Banner:** Appears below the tab content when 3+ clues are collected. "The evidence is mounting. Are you ready to accuse?" with CTA → `/accuse`.

---

### Screen 4 — Scene Modal (overlay on Hub)

**Purpose:** Immersive scene exploration. Where the first clues are found.

**Triggered by:** Clicking a scene card on the Overview tab.

**Contents:**
- Scene title + mood badge (e.g., "Unsettling", "Revelatory")
- 3–4 paragraphs of italic serif narrative prose
- Discoverable clues list with "Examine" buttons
  - Pre-discovery: teaser text only
  - Post-discovery: full reveal text, clue added to evidence
- "Mark Scene Complete" button (awards scene points, closes modal)
- Locked scenes: overlay with lock icon + unlock condition ("Find [Clue Name] first")

**Motion:** `scaleIn` entrance, 400ms. Backdrop blur behind. Escape or backdrop click closes.

---

### Screen 5 — Interrogation Chat (`/cases/[caseId]/interrogate/[suspectId]`)

**Purpose:** The most time-intensive screen. Build suspicion. Collect testimony-type clues.

**Desktop layout:** Fixed 320px sidebar left + flex-1 chat area right.
**Mobile layout:** Collapsible "View Profile" drawer at top. Chat fills the screen.

**Sidebar contents:**
- Suspect avatar (large)
- Name, role, relationship to victim
- Suspicion meter: labeled bar 0–100, animated update
- Italic tagline
- Backstory paragraph
- Known alibi
- Suspicious behaviors list
- Other suspects: pill navigation

**Chat area:**
- Player messages: right-aligned, gold-tinted bubble
- Suspect responses: left-aligned, avatar + italic serif + tone indicator dot (Defensive / Nervous / Hostile / Cooperative / Evasive / Calm / Emotional — each with a distinct color)
- Typing indicator: 3 pulsing dots, 800–1200ms simulated delay before response appears
- Auto-scroll to latest message
- Chat history persists between sessions

**Question panel (bottom):**
- Available questions listed with category color dot (Alibi, Motive, Relationship, Evidence, Behavior, Accusation)
- Clue-gated questions hidden until clue is found
- Asked questions removed from list
- Exhausted state: "All questions asked" with links back to hub or to accusation

---

### Screen 6 — Evidence Board (`/cases/[caseId]/evidence`)

**Purpose:** Full investigation view of all collected evidence.

**Header:** "X of 12 Items Collected" with discovery percentage progress bar.

**Sections:**
- Critical Evidence (crimson-accent header, grid)
- Supporting Evidence (gold-accent header, grid)
- Undiscovered (locked grey cards — count visible, content hidden)

**Each clue card:** Icon, name, type badge, weight badge (Critical / Significant / Minor), reveal text preview. Click → ClueModal.

**ClueModal:** Full clue name, full analysis text, location found, forensic/testimony detail, suspect linkage with gold arrow.

**Evidence by Suspect section (bottom):**
- Each suspect as a row header
- Their linked clues listed below
- 2+ linked clues triggers "High Suspicion" badge on that suspect

**Empty state:** Full-page illustrated state with "No evidence collected yet" and CTA → investigation hub.

---

### Screen 7 — Accusation Chamber (`/cases/[caseId]/accuse`)

**Purpose:** The moment of commitment. Dramatic, consequential, final.

**Background:** Deep crimson radial glow. Atmospheric, not garish.

**Headline:** "Who Killed [Victim Name]?" in large Cormorant Garamond.

**Evidence summary:** Collected clues as pills — a quick reminder of what the player knows.

**Suspect grid — selectable mode:**
- Click to select: 2px crimson border, subtle crimson background, checkmark in corner
- Shows: avatar, name, role, motive summary, evidence link count, suspicion level
- Only one selection possible at a time

**Confirmation flow (2-step):**
- Step 1 panel: Shows accused suspect card + "I'm Certain →" button
- Step 2 panel: "This accusation is final. Are you absolutely certain?" + "Wait..." (back) + "Make Final Accusation" (gold → crimson button)
- Final button triggers 1.4s loading state → route to `/result`

---

### Screen 8 — Case Result (`/cases/[caseId]/result`)

**Purpose:** The emotional payoff. The scene players remember and share.

**Phase 1 (0ms):** Full-screen loading spinner. "Reviewing the evidence..." in italic serif.

**Phase 2 (1200ms):**
- CORRECT: Gold badge + "Case Solved" + massive "Correct." in Cormorant Garamond + affirming message
- WRONG: Crimson + "Wrong." + "An innocent person has been accused."

**Phase 3 (3000ms):**
- Two cards side by side: "You Accused" and "The Real Killer"
- CORRECT: Both show the same person, gold checkmark
- WRONG: Innocent (red X) vs actual killer (gold badge + "Escaped justice")

**Phase 4 (5500ms) — Full narrative reveal:**
- Unique prose ending based on accused suspect (6 total, one per suspect)
- "The Hidden Truth" card — the case twist revealed (e.g., Sophie's warning letter)
- "The Killer's Tell" — what should have given them away
- Case Report: final score, rank, clues found %, scenes explored, interrogations conducted
- Score breakdown bar (clues / scenes / interrogations / accusation)
- Detective Rank progression: 5 ranks displayed, current highlighted with gold
- Action buttons: "Back to Cases" and "Play Again" (resets case state)

---

### Screen 9 — Detective Profile (`/profile`)

**Purpose:** Reward persistence. Give the player a record of their detective career.

**Contents:**
- Detective name (set on first visit, stored in Zustand)
- Current rank and rank badge
- Career stats: Cases Completed, Total Score, Accuracy Rate, Clues Found
- Case history: each completed case with verdict, score, rank earned, date
- Rank progression bar showing distance to next rank

---

### Screen 10 — Achievements (`/profile/achievements`)

**Purpose:** Discovery reward layer. Not gamification — recognition.

**Grid of achievement badges:**
- Earned: full color, gold border, unlock description
- Unearned: greyscale silhouette, mystery name ("???" until earned)

**MVP achievements (10):**
- First Interrogation, All Questions Asked, Scene Collector, Evidence Hound, Perfect Accusation, First Case Solved, Wrong Turn (accusation wrong), Cold-Blooded (accused someone with 0 suspicion), The Long Game (played a case over 3+ sessions), Master Detective (reached top rank)

---

### Screen 11 — About / How to Play (`/about`)

**Purpose:** Establish trust. Explain the product for skeptical first-time visitors.

**Sections:**
- "What is Red Thread?" — product story in 2 paragraphs
- "How It Works" — 4-step illustrated guide
- "The Cases" — brief description of the mystery craft philosophy
- "The Detective Rank System" — all 5 ranks listed with point thresholds
- "A Note on Fairness" — every case is designed to be solvable. No tricks. No luck.

---

### Screen 12 — Not Found (`/not-found`)

**Purpose:** Graceful failure. Never leave the player at a dead end.

**Design:** Full cinematic treatment — not a bland error page.
- Text: "This corridor leads nowhere." in italic serif
- Subtext: "The clue you're looking for doesn't exist — or perhaps it was never real."
- Single CTA: "Return to the Investigation" → `/cases`

---

## Closing Notes for the Build Team

This blueprint is the source of truth. Every product decision should be evaluable against it. If a feature doesn't serve the emotional promise — if it doesn't make the player feel smarter, more immersed, or more certain that this product respects them — it doesn't ship.

The bar is not "does it work." The bar is: "Would a person who opened this say *this looks expensive*?"

Build to that bar. Nothing less.

---

*Red Thread Product Blueprint v1.0 — Confidential*
