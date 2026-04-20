---
name: red-thread-design
description: Use this skill to generate well-branded interfaces and assets for Red Thread, a cinematic mystery-solving web app with a Netflix-inspired dark design system. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick-start cheat sheet

### Colors (CSS vars in colors_and_type.css)
- Background: `#141414` → `#1a1a1a` → `#222` → `#2a2a2a`
- Red: `#E50914` (primary), `#F40612` (hover)
- Text: `#fff` → `#e5e5e5` → `#aaaaaa` → `#666666`
- Green (correct): `#4cdd8a`
- Borders: `rgba(255,255,255,0.06/0.10/0.12/0.18)`

### Typography
- Font: **Inter only** — weights 400/500/600/700/800/900
- Hero: 800, -0.04em, clamp(2.5rem,6vw,5rem)
- Micro-labels: 700, 9px, 0.4em tracking, ALL CAPS — dominant UI pattern
- Eyebrows: 700, 10px, 0.2em tracking, ALL CAPS, color `#E50914`

### Shape
- Border radius: **4px on everything** (no rounded-xl, no rounded-2xl)
- Exception: avatar circles and progress bar fills use `border-radius: 9999px`

### Buttons (4 variants)
- Primary: `bg #fff, color #000, font-weight 700`
- Secondary: `bg rgba(109,109,110,0.7), backdrop-blur, color #fff`
- Danger: `bg rgba(229,9,20,0.12), border rgba(229,9,20,0.3), color #E50914`
- Ghost: `border rgba(255,255,255,0.15), color #aaaaaa`

### Motion
- Entry: `opacity 0→1, translateY(16px→0)`, 500ms, `cubic-bezier(0.16,1,0.3,1)`
- Card hover: `scale(1.04) translateY(-2px)`, 250ms ease
- Modal: `scale(0.96→1) + opacity`, 300ms

### Icons
Lucide React — stroke style, 1.5px weight. CDN: `https://unpkg.com/lucide@latest`

### Copy style
- Terse, declarative, noir tone
- Small UI text: ALL CAPS with wide tracking
- CTAs: short imperative verbs ("Investigate", "Accuse", "Continue")
- No emoji in production UI

## Files
- `README.md` — Full brand guidelines
- `colors_and_type.css` — All CSS variables and utility classes
- `preview/` — 14 design system cards (register in review pane)
- `ui_kits/red-thread/index.html` — Interactive prototype (all screens)
- `ui_kits/red-thread/CaseCard.jsx` — Case card component
- `ui_kits/red-thread/Navigation.jsx` — Nav component
- `ui_kits/red-thread/Screens.jsx` — All screen components
