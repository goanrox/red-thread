# Red Thread — Design System

## Overview

**Red Thread** is a cinematic mystery-solving web app. Players take the role of a detective, exploring case files, interrogating suspects, collecting evidence, and making a final accusation. The visual identity is a deliberate homage to Netflix's UI language — dark backgrounds, near-square corners, Inter typography, and a red accent palette — applied to a tense, investigative product.

**Live product:** https://red-thread-mu.vercel.app/  
**Repository:** https://github.com/goanrox/red-thread (branch: `master`)  
**Stack:** Next.js 14 + TypeScript + Tailwind CSS v4 + Framer Motion + Zustand + Lucide Icons

---

## Products / Surfaces

| Surface | Entry point | Notes |
|---|---|---|
| **Homepage** | `/` | Hero + horizontal case rows, Netflix browse layout |
| **Cases Library** | `/cases` | Filtered grid of CaseCards, sticky filter bar |
| **Investigation Hub** | `/cases/[caseId]` | 5-tab layout: Overview, Suspects, Evidence, Timeline, Notes |
| **Interrogation** | `/cases/[caseId]/interrogate/[suspectId]` | Two-panel chat interface |
| **Evidence Board** | `/cases/[caseId]/evidence` | Filtered grid of clue cards |
| **Timeline** | `/cases/[caseId]/timeline` | Vertical event chronicle |
| **Accusation** | `/cases/[caseId]/accuse` | 3-step dramatic reveal flow |
| **Result** | `/cases/[caseId]/result` | Phased verdict + score breakdown |
| **Profile** | `/profile` | Rank card + career stats + case history |

---

## Content Fundamentals

**Tone:** Terse, literary, and cinematic. Sentences are short and declarative. There is no fluff, no encouragement, no emoji. The product talks like a cold case file, not a SaaS dashboard.

**Voice:** Third person for game world, second person for the player. "The evidence is mounting." "You are about to accuse…" "This accusation is final. There is no recall."

**Casing:** 
- UI labels and tab names: ALL CAPS with wide letter-spacing (0.3–0.6em), 8–10px. This is the dominant micro-copy pattern.
- Section headers: Title Case, but inlined with a short red rule.
- Body copy: Sentence case, never shouted.
- CTAs: Short imperative verbs — "Investigate", "Continue", "Interrogate", "Accuse".

**Emoji:** Never used anywhere. Unicode chars used sparingly — "✓", "✗", "→" in specific contexts only.

**Numbers:** Always shown with context — "4/12 clues", "3 suspects", "97% Match". Percentages used as confidence signals.

**Copy examples (verbatim from codebase):**
- "Each case is a closed world. One killer. One truth. Everything else is misdirection."
- "This accusation is final. There is no recall. Choose with conviction."
- "The evidence is mounting. Make your accusation."
- "No cases on record. Your story starts now."
- "Assembled for detectives of your calibre."
- "Record your observations, suspicions, and theories here."

---

## Visual Foundations

### Color
- **Background hierarchy:** `#141414` (page) → `#1a1a1a` (card) → `#222222` (elevated/hover) → `#2a2a2a` (deep hover)
- **Red accent:** `#E50914` (primary), `#F40612` (hover state). Used for: CTAs, active tabs, key events, suspicion bars, eyebrows, brand name.
- **Text hierarchy:** `#ffffff` (titles) → `#e5e5e5` (primary body) → `#aaaaaa` (secondary) → `#666666` (meta/captions)
- **Green success:** `#4cdd8a` — used only for correct/solved states
- **Borders:** `rgba(255,255,255,0.06)` (subtle) / `rgba(255,255,255,0.12)` (normal). Never opaque.
- No gradients on backgrounds — solid darks only. Gradients used only as overlays (image protection, glow bleeds).

### Typography
- **Font:** Inter exclusively. No serifs, no monospace except in code/numbers (font-mono).
- **Hero:** Inter 800, -0.04em tracking, `clamp(2.5rem, 6vw, 5rem)`
- **Section title:** Inter 700, -0.03em, `clamp(1.75rem, 4vw, 2.5rem)`
- **Card title:** Inter 700, -0.02em, 15–18px
- **Body:** Inter 400, 13–15px, #aaaaaa, line-height 1.65–1.7
- **Micro-labels:** Inter 700, 7.5–10px, uppercase, 0.3–0.6em letter-spacing. This is the dominant UI pattern — almost everything small is uppercase + tracked.
- **No font size below 7px** — readability is respected.

### Shape & Spacing
- **Border radius:** `4px` on ALL interactive elements — cards, buttons, badges, modals, inputs. NOT `rounded-xl` or `rounded-full` (exception: avatar circles and progress bars).
- **Content gutter:** `px-[4%]` horizontally. Inner card padding: `16–24px`.
- **Nav height:** `68px` fixed.
- **Card gaps:** `gap-3` (6px) in rows, `gap-4` (16px) in grids.

### Backgrounds & Textures
- No images, illustrations, or textures on page backgrounds. Pure `#141414`.
- Category gradient backgrounds on card image panels (rich darks: `#1a0e06`, `#060814`, etc.)
- Grayscale Picsum images used as overlays with `mix-blend-overlay opacity-40`
- Glow bleeds: `radial-gradient(ellipse, rgba(229,9,20,0.04))` as ambient atmosphere — very subtle
- Scan lines and textures are declared but set to `display:none` — intentionally stripped

### Animation
- **Page entry:** `opacity: 0→1, translateY(16px→0)`, 500ms, `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out)
- **Card hover:** `scale(1.04) translateY(-2px)`, 250ms ease. `.card-cinema:hover`
- **Stagger delays:** 80ms increments (`.stagger-1` through `.stagger-6`)
- **Modal entry:** `scale(0.96→1) + opacity`, 300ms ease
- **Tab switch:** 200ms opacity crossfade via Framer Motion `AnimatePresence`
- **Suspicion bar:** width animates from 0 on mount, 1s ease-out
- No bounce, no spring exaggeration — all easing is expo-out or simple ease

### Hover States
- Cards: `border-color rgba(255,255,255,0.15)`, slight `translateY(-2px)`, deeper shadow
- Buttons: `opacity 0.85` or `bg-opacity 0.9`, `scale(1.02)` 
- Nav links: `color → #ffffff`
- Suspicious suspects: `border-color` shift to red-tinted
- No fill color changes on hover for cards — only border + shadow

### Glassmorphism
- Used for: navigation bar (scrolled), tab bars, mobile menu overlays
- Pattern: `backdrop-blur-2xl`, `rgba(20,20,20,0.96)` bg, `border-bottom: 0.5px solid rgba(255,255,255,0.06)`
- Never on cards themselves

### Iconography
See `ICONOGRAPHY` section below.

### Cards
- **Standard card (`.card`):** `bg #1a1a1a`, `border rgba(255,255,255,0.07)`, `radius 4px`, `shadow 0 4px 20px rgba(0,0,0,0.5)`
- **Cinema card (`.card-cinema`):** Same bg + border, adds `overflow:hidden`, hover scale
- **Dossier card (`.dossier-card`):** Suspect profile card, same treatment, hover bg → `#222`
- **Evidence card:** Same base, cursor pointer, full-width
- **Glass card (`.card-glass`):** For overlays — `rgba(20,20,20,0.92)`, `backdrop-blur-32`, `border rgba(255,255,255,0.08)`
- **Stat compartment:** `p-20px`, centered text, value large + colored, label micro-caps below

### Selection & Scrollbar
- Text selection: `rgba(229,9,20,0.25)` bg — red-tinted
- Scrollbar: `6px` width, `#333` thumb, `#141414` track

---

## Iconography

**Icon library:** [Lucide React](https://lucide.dev) — loaded as React components. Stroke-weight icons, consistent 1.5px stroke. No filled icons.

**Common icons used:**
| Icon | Usage |
|---|---|
| `Eye` | Overview tab |
| `FileText` | Evidence tab |
| `Clock` | Timeline tab |
| `PenLine` | Notes tab |
| `Users` | Suspects tab |
| `Lock` | Locked scenes/clues |
| `CheckCircle2` | Solved/visited |
| `XCircle` | Failed/close modal |
| `MapPin` | Scene location |
| `Skull` | Victim / accusation CTA |
| `AlertTriangle` | Final warning (accusation) |
| `ChevronLeft/Right` | Navigation |
| `Trophy`, `Star` | Profile achievements |
| `BookOpen` | Profile |

**No custom SVGs, no icon fonts, no PNG icons.** All icons are Lucide components. CDN: `https://unpkg.com/lucide@latest`

**Emoji:** Not used anywhere in the product UI (a single 🔒 emoji appears in the CaseCard locked overlay but is considered legacy).

---

## Files in This Design System

```
README.md                    ← This file
SKILL.md                     ← Agent skill manifest
colors_and_type.css          ← All CSS variables (colors, type, spacing, animation)
assets/
  favicon.ico                ← App favicon (from repo)
preview/
  01-colors-bg.html          ← Background color swatches
  02-colors-accent.html      ← Red/green/text color swatches
  03-colors-borders.html     ← Border + overlay tokens
  04-type-scale.html         ← Typography scale specimen
  05-type-labels.html        ← Micro-label patterns
  06-buttons.html            ← All button variants + states
  07-cards.html              ← Card variants
  08-badges.html             ← Badge + pill variants
  09-tabs.html               ← Tab bar pattern
  10-inputs.html             ← Input + textarea
  11-spacing.html            ← Spacing + radius tokens
  12-motion.html             ← Animation reference
  13-nav.html                ← Navigation component
  14-case-card.html          ← CaseCard full specimen
ui_kits/
  red-thread/
    index.html               ← Interactive prototype (all screens)
    CaseCard.jsx             ← Case card component
    Navigation.jsx           ← Nav component
    Screens.jsx              ← All screen components
```
