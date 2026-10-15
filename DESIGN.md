---
name: "AI Engineer Portfolio — Aurora Field"
description: "Airy paper portfolio with a pointer-following aurora field, glass pills, and a live pipeline sheet."
colors:
  paper: "#fafaf7"
  panel: "#ffffff"
  panel-soft: "#f4f4f1"
  ink: "#141417"
  ink-soft: "#55565c"
  ink-faint: "#61626a"
  line: "#e8e6e0"
  accent: "#2f7bff"
  accent-ink: "#1a56c4"
  accent-wash: "#e5efff"
  mint: "#b9f2d5"
  cyan: "#a8e9f7"
  lavender: "#d8d1fc"
  peach: "#ffdfc0"
  pink: "#ffd4e6"
  green: "#0e7a3d"
  amber: "#9a6200"
  red: "#b3261e"
typography:
  display:
    fontFamily: "'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif"
    fontSize: "clamp(3rem, 8vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.5vw, 3.2rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif"
    fontSize: "27px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.1em"
rounded:
  pill: "999px"
  sheet: "20px"
  cardnav: "18px"
  bubble: "18px"
  node: "12px"
  contact: "24px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  section: "60px"
components:
  button-send:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0"
    width: "46px"
    height: "46px"
  button-send-hover:
    backgroundColor: "{colors.accent-ink}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  button-ghost:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  bubble-user:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    rounded: "{rounded.bubble}"
    padding: "12px 18px"
  bubble-answer:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.bubble}"
    padding: "12px 18px"
  card-glass:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.cardnav}"
    padding: "18px 8px 16px"
  sheet-light:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "22px"
---

# Design System: AI Engineer Portfolio — Aurora Field

## Overview

**Creative North Star: "The Aurora Field"**

An airy daylight portfolio where a five-hue fluid field drifts behind everything and leans toward the visitor's cursor. One centered hero front door — greeting, giant title, round memoji avatar, ask pill, five glass nav cards — and one destination: the `/ask` chat page, where an ADK agent (Gemini) answers from profile facts plus a live GitHub tool. The five cards deep-link into the chat with preset questions. Density is calm and centered: a 1080px wrap, generous whitespace, glass pills and cards, one action blue reserved for send controls and links. No footer — pages end on their content.

The memorable moment is conversational: smoke stirs under the cursor, the visitor asks a question, and a real agent answers from Saurabh's profile, repos, and links — demo fallback answers stay tagged.

**Key Characteristics:**
- Airy paper ground with drifting five-hue aurora, never dark mode.
- One action blue committed to send + links; field hues never carry text.
- Proxima Nova display + body, JetBrains Mono for all data labels.
- Glass pills (999px), glass nav cards (18px), glass input (999px).
- Placeholders always marked (`*`, demo tags); real facts ship unlabeled, never embellished.

## Colors

Full-palette daylight system: paper ground, white glass lifts, ink text, one action blue, five aurora hues, traffic-light status.

### Primary
- **Action Blue** (#2F7BFF): send button fill, live pipeline edges, mini-DAG bar gradient start (#2F7BFF → #7AB8FF), contact-link hover glow. Reserved for send + links + live flow.
- **Action Ink** (#1A56C4): send hover, answer-bubble tag, placeholder-note text, link hover, active pipeline node ring.
- **Action Wash** (#E5EFFF): placeholder-note ground, active-node halo (`0 0 0 3px` ring).

### Secondary
- **Mint Drift** (#B9F2D5): aurora blob 1, avatar gradient stop 1.
- **Cyan Drift** (#A8E9F7): aurora blob 3, avatar gradient stop 2.
- **Lavender Drift** (#D8D1FC): aurora blob 2, avatar gradient stop 3.
- **Peach Drift** (#FFDFC0): aurora blob 4.
- **Petal Drift** (#FFD4E6): aurora blob 5.

### Tertiary
- **Status Green** (#0E7A3D): hero eyebrow pulse dot (with 15% halo ring), eval pass text; lamp fill variant #22A35C.
- **Status Amber** (#9A6200): eval caution text; lamp fill variant #E0A100.
- **Status Red** (#B3261E): eval fail text; lamp fill variant #D43D35.

### Neutral
- **Paper** (#FAFAF7): page ground, scrollbar track, selection text.
- **Panel** (#FFFFFF): glass pills, cards, sheets, nav — one step up from ground.
- **Panel Soft** (#F4F4F1): reserved tonal step below panel.
- **Ink** (#141417): text, user bubbles, primary buttons, node borders (`--line-dark`), selection ground, scrollbar-thumb hover.
- **Ink Soft** (#55565C): body-muted copy, card-nav text, ask placeholder, trace dim.
- **Ink Faint** (#61626A): mono labels, sheet footers, counts, node headers, typing dots.
- **Hairline** (#E8E6E0): glass borders, dividers, node edges at rest (#C9C7C0 stroke variant on diagram paths).

### Named Rules
**The One Blue Rule.** Action blue (#2F7BFF) marks send + links + live flow only. Field hues (mint, cyan, lavender, peach, pink) are atmosphere — they never carry text, borders, or interactive states.
**The Daylight Rule.** The world is always lit: paper ground (#FAFAF7), white glass lifts, ink lines. No dark-mode inversion, no neon glow, no schematic grid.
**Use scene.** Read this page like a sunlit meadow with a paper sheet on top — pastel fluid drifting underfoot, ink crisp on the sheet, and a single blue pen circling the one live control.

## Typography

**Display Font:** Proxima Nova (commercial — licensed files or Adobe Fonts kit required; falls back to Helvetica/system until activated)
**Body Font:** Proxima Nova (same license path as display)
**Label/Mono Font:** JetBrains Mono (with ui-monospace fallback, via next/font, weights 400/500/700)

**Character:** Confident tight-tracked geometric display against calm geometric body; the chat speaks in Proxima Nova where licensed (Apple system faces as fallback, JetBrains Mono for data labels); every piece of furniture — eyebrows, counts, node headers, metrics, trace, footer — speaks in tracked-out mono with tabular numerals.

### Hierarchy
- **Display** (400, clamp(3rem, 8vw, 5.5rem), 1.0, tracking -0.03em): hero title ("AI Engineer") only; balance-wrapped.
- **Headline** (700, clamp(2rem, 4.5vw, 3.2rem), 1.1, tracking -0.02em): hero `h1` greeting line, with a 0.62em 500-weight soft sub-line; balance-wrapped.
- **Title** (650–750, 21–30px, 1.1, tracking -0.02em): system titles (27px), spec rows (21px), contact panel (30px), section heads (clamp(1.8rem, 3.4vw, 2.6rem), 750); balance-wrapped.
- **Body** (400, 17px, 1.65): Proxima Nova prose; hero sub capped at 56ch, section intros at 60ch, system blurbs at 56ch, bubbles at 15px/1.6.
- **Label** (400–700, 10.5–13px, 0.06–0.12em tracking, uppercase): eyebrows, counts, tags, node headers, metrics, trace, contact lines, footer — all JetBrains Mono. Metrics, tickers, node values, and log dates render tabular numerals (`font-variant-numeric: tabular-nums`).

### Named Rules
**The Mono Furniture Rule.** If it is metadata — eyebrow, count, tag, metric, node header, trace line, footer — it is JetBrains Mono, uppercase (body exceptions: trace lines, ticker), tracked 0.06–0.12em. Body copy never wears mono.
**The Balance Rule.** Display, headline, section heads, system titles, and contact heads always balance-wrap (`text-wrap: balance`).

## Layout

Centered single column on a 1080px wrap (24px side gutters, content `z-index: 1` above the fixed aurora at `z-index: 0`). `/` is the hero front door (top pill → greeting → title → sub → 168px memoji avatar, then the ask pill (680px max) + five-card nav (760px max) docked to the viewport bottom via a min-height flex column with safe-area padding; short viewports scroll instead of clipping). `/ask` centers a 680px open column: memoji avatar, greeting, floating thread, bottom dock with quick chips (after first send) + follow-up input.

Responsive: everything collapses at 900px — system cards, spec rows, and contact grid stack to one column (dividers rotate from left-border to top-border); the pipeline DAG stacks to one column with edges rotated 90° (26px tall); card nav keeps five columns but compresses (12px labels, 14px radius, 8px gap); log rows stack to one column.

## Elevation & Depth

Flat-by-default paper system with glass lifts. Depth comes from tonal layering (paper → white glass), backdrop blur (10–14px on pills, cards, sheets), and soft ambient shadows — never hard offsets.

### Shadow Vocabulary
- **Glass pill** (`box-shadow: 0 8px 24px rgba(20,20,23,0.06)`): top pill and card-nav cards at rest; hover deepens to `0 14px 30px` / `0 18px 38px rgba(20,20,23,0.1–0.12)`.
- **Ask focus** (`box-shadow: 0 16px 44px rgba(20,20,23,0.1)`): the ask bar's permanent float above paper.
- **Sheet rest** (`box-shadow: 0 14px 40px rgba(20,20,23,0.07)`): system cards, pipeline sheet, spec shelf, build log.
- **Avatar float** (`box-shadow: 0 20px 50px rgba(20,20,23,0.16)`): the one playful depth cue, floating the 168px round avatar off the sheet.
- **Contact rest** (`box-shadow: 0 18px 50px rgba(20,20,23,0.09)`): contact grid sits highest; link hover adds a blue glow (`0 12px 26px rgba(47,123,255,0.18)`).

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadow appears only as ambient lift under glass (pills, cards, sheets) and grows on hover — never as an offset or outline.

## Shapes

Soft daylight geometry over paper. Pills go full-round (999px: top pill, eyebrow, ask bar, tags, counts, buttons); glass nav cards round at 18px; sheets and system cards round at the 20px token; chat bubbles round at 18px with one pinched corner (6px bottom-right user, 6px bottom-left answer); pipeline nodes round at 12px with ink (`#141417`) borders; the avatar is a 168px circle with a 4px white ring. Borders are 1px hairline (#E8E6E0) on glass, 1px ink on pipeline nodes, 1px dashed action on synthetic notes.

## Components

### Aurora Field
The signature atmosphere. Five blurred blobs (60px blur, 0.8 opacity, 34–52vmax) on parallax layers inside a fixed full-bleed field (`inset: -10vmax`, pointer-events none). Each layer follows the pointer at its own depth (0.35/0.6/0.9/1.25/1.7 × 9vmax, 0.06 lerp, no CSS transition — rAF owns the motion) over 22–32s drift alternates; a 340px cursor glow (blur 50px, 0.5 opacity) tracks the pointer directly. Static on touch (`pointer: coarse`) and reduced motion (glow hidden too).

### Fluid Smoke
The cursor smoke from the user's recording, rebuilt as original canvas-2D physics. Pointer movement lays dense smoke sprites (24 pre-rendered 128px radial hues, vivid saturated cores falling to transparent halos, 44–96px growing slowly at 0.4/frame) with hue advancing at 0.07/px, gentle curl (0.22) and 0.968 drag for a slow drift; every click/tap lands a lingering radial color bloom plus 3 staggered expanding rings (blue/magenta/orange) and 26 gravity-tugged multicolor droplets. Lifetimes are wall-clock age (smoke 6–9s, drops ~2–3s, rings/blooms 1.6s), so all trails clear within 5–10s at any frame rate. Injection happens synchronously in the pointer AND touch handlers (frame-rate independent; touch is passive so scrolling still works); update/draw in rAF. 900/260/60/8 caps, DPR capped at 1.5, rAF paused when the tab hides, fully skipped under reduced motion. Fixed canvas below content (`z-index: 0`, pointer-events none) — smoke never carries text or controls. Mounted on `/`, all SubPage routes, and `/ask`.
- **Shape:** full-bleed fixed field; blobs are 50% circles with radial-gradient fades (70%/68% stops).
- **Color:** mint → lavender → cyan → peach → pink layering on paper.
- **States:** pointer-follow on fine pointers; frozen frame otherwise.

### Top Pill
Single left-aligned builder link opening the page.
- **Shape:** full pill (999px), 10px 18px padding, 14px 600 text.
- **Primary:** white glass (50% + 16px blur + 150% saturate), white border, ink text, 22px ink `B` mark, rest shadow.
- **Hover / Focus:** lifts 2px with expo ease; accent focus ring (see Browser-Surface Theming).

### Hero
Centered greeting → title → sub → memoji avatar → ask → nav. Title is the regular-weight Proxima Nova giant; sub is soft 56ch prose.
- **Avatar:** 168px circle; renders the user-supplied memoji at `public/avatar.png` directly (no probe round-trip) over a neutral pulsing disc, fading in on load via a complete-check ref + onLoad; authored male SVG face remains as error-only fallback. No background, no ring — memoji floats directly on the field with a soft drop shadow.

### Ask Page (Open Chat)
Top bar (full-bleed: back-home pill flush left, info button flush right, shared top offset) → 88px memoji avatar → greeting paragraph (only when empty) → floating thread → bottom dock. Bot answers render as plain centered paragraphs with no model label; demo fallback answers keep a small suffixed demo tag. user messages stay dark pills; thinking dots hug left. Dock pins the Hide toggle + quick chips (visible only after the first sent message) + glass input with up-arrow send. Thread scrolls internally; page is viewport-fixed. Entrance: avatar/greeting drift down, dock drifts up; all killed under reduced motion.
Answers stream token-by-token over SSE from one ADK agent (Gemini 3.5 Flash-Lite, `StreamingMode.SSE`) grounded in `PROFILE.md` plus a live GitHub repos tool (hourly cache, static fallback); generated text renders in the theme voice with a markdown-lite pass (escaped HTML first, then linkified URLs and [text](url) opening in new tabs, bold, lists, breaks). Streamed lines fade up one by one as they arrive (killed under reduced motion). Same 5-exchange limit with gray limit state applies. Live answers carry a bare `Gemini` tag; scripted fallback answers carry a suffixed demo tag; network failures name the email recovery.
- **Shape:** pill bar and input (999px); open thread with plain centered bot paragraphs; chips 999px pills.
- **Primary:** transparent input (16px, accent caret), blue send; send hover shifts to action-ink and scales 1.06; chip hover lifts 2px; all state motion eases expo-out.
- **Typing:** three 7px faint dots blinking on a 1s loop while the agent thinks.
- **Secrets:** `GEMINI_API_KEY` lives in gitignored `.env.local`, server-only; the browser never sees it.

### Card Nav
Five glass link cards (Me, Projects, Skills, Fun, Contact) in a 5-column grid. Each deep-links into `/ask` with a preset question (`/ask?q=…`); there are no content routes behind them.
- **Style:** true glass — `rgba(255,255,255,0.45)` + 18px blur + 150% saturate, `rgba(255,255,255,0.7)` border, inset top highlight, 18px radius, 24px 10px 22px padding, 15px 600 ink text (deepened for contrast over translucency), authored 24px stroke SVG icon each (no icon font).
- **State:** hover raises opacity to 0.65 and lifts 4px with deepened shadow; the current route carries `aria-current="page"` plus an accent border + wash ring (`.is-here`).

### Agent Chat (retired surfaces removed)

The deleted content routes (Me/Projects/Skills/Fun/Contact pages, system cards, pipeline demo, spec shelf, build log, contact grid) live on only as bot knowledge: `PROFILE.md` (identity, roles, projects with links, publication, education, skills) plus the `github_repos` FunctionTool. The bot answers from these facts and says it doesn't know anything outside them.

### Pill Buttons
Mono uppercase pills (12px, 0.1em tracking, 999px, 14px 26px, 10px 18px small).
- **Primary:** ink fill, white text; hover shifts to action-ink border+fill.
- **Ghost:** white fill, ink text, ink border; hover inverts to ink fill/white text.
- **Disabled:** 0.55–0.65 opacity, dashed border, wait/not-allowed cursor (limit state, thinking state).

### Motion
One field + one smoke + one entrance, all expo-eased. Aurora blobs drift 22–32s ease-in-out alternates; pointer follow lerps at 0.06 across per-layer depths (0.35–1.7 × 9vmax) with a direct-tracking cursor glow; smoke beads stream under movement and click blooms dissipate within 5–10s. Home hero enters once per load: greeting/title/sub fade down staggered (0–0.16s), ask + cards fade up (0.32/0.44s), all 0.9s expo; killed under reduced motion. The /ask page enters the same way on every arrival (avatar/title/sub fade down, chat card fades up at 0.2s). Typing dots blink at 1s. All hovers ease exponential (`cubic-bezier(.19,1,.22,1)`, 0.5s transform / 0.2–0.3s color). `prefers-reduced-motion` kills blob drift, glow, dye, edge flow, typing blink, smooth scroll, and all transitions; touch devices skip pointer-follow entirely.

### Browser-Surface Theming
Light-only chrome bound to the paper world: text selection is ink ground with paper text; keyboard focus is always a 2px action outline offset 3px with 6px radius; the 12px scrollbar rides a paper track with a `#C9C7C0` thumb ringed by paper (8px radius, inks on hover); links inherit ink with a 4px underline offset (1px thickness) and ink-blue on hover; inputs use an action-blue caret; metrics always set tabular numerals.

### Placeholder / Synthetic Labeling Convention
Synthetic content is never styled as finished: asterisked names and metrics (`Your Name*`, `0.94*`, `run ai-2026-084*`), mono `TAG · placeholder` flags on answers, dashed action notes (`1px dashed accent` on wash ground: `Placeholder — replace with real architecture`), dashed disabled link buttons (`Case study*` / `Code*` / `Live demo*`), `#contact` hrefs for unwired links, mono sheet footers (`synthetic demo data`), mono answer tags, and `* Placeholder links` / `* Placeholder content` disclaimers.

## Do's and Don'ts

### Do:
- **Do** keep the field atmospheric: five hues drift on parallax layers and follow at 0.06 lerp with a cursor glow; text and controls always sit on paper/glass above it.
- **Do** reserve action blue (#2F7BFF) for send + links + live flow; status hues for lamps and pulse only.
- **Do** set all furniture in JetBrains Mono with 0.06–0.12em tracking and tabular numerals for metrics.
- **Do** collapse to one column at 900px (rotating pipeline edges 90°) and freeze the field on touch and reduced motion.
- **Do** mark every placeholder synthetic — asterisk, `placeholder` tag, dashed note, or disabled dashed button — never as plain finished copy.
- **Do** honor reduced motion: no drift, no edge flow, no typing blink, no transitions.

### Don't:
- **Don't** introduce dark surfaces, neon glows, schematic grids, or a second accent hue.
- **Don't** set body copy in mono or metadata in Proxima Nova's place — furniture is mono, prose and display are Proxima Nova.
- **Don't** put text directly on aurora hues or use field hues for borders and states.
- **Don't** sharpen the geometry; pills stay 999px, nav cards 18px, sheets 20px, contact 24px.
- **Don't** invent employers, testimonials, metrics, or press; placeholders stay obviously replaceable.
