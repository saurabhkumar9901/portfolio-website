---
version: 1
slug: "route"
primary_target: "route:/"
related_targets: []
---

# Surface: / (+ /me /projects /skills /fun /contact /ask) — AI developer portfolio

Scope: Next.js multi-route site. `/` is the aurora hero (avatar, ask entry, card nav). Dedicated routes: `/me` (bio + build log), `/projects` (4 systems incl. live pipeline), `/skills` (spec shelf), `/fun` (placeholder human page), `/contact` (contact grid), `/ask` (glassmorphism chat page; hero ask submits here with ?q=, auto-asks once). Quick chips appear only after the first sent message, never on pristine views; popup dialog dropped per user demand. Shared Aurora field + CardNav + footer on every route. Mode: Experience.

Audience: hiring managers + freelance clients. Job: feel the craft in 10s, verify full-slice AI capability, then contact. Action: ask a question or contact. Proof: live pipeline + systems on /projects, keyword ask answers on /. Constraints: placeholders obviously replaceable; no fabricated claims; original work inspired by a reference, not a copy; parallel session's /chat + /api/chat files are out of scope and untouched.

Direction: Aurora Field (user-pinned replacement world, 2026-10-03; replaces Pipeline Blueprint). Cursor fix 2026-10-04: removed rAF-vs-transition fight, per-layer parallax depths + cursor glow; verified via synthetic pointer events. Water trails + click blooms 2026-10-04 (user demand, supersedes dye): slow hue-cycling bead streams (hue advances with distance) with hue-matched ripple rings on move, colorful bloom + rings + droplets on click; smoke rework 2026-10-05 (user recording): bead circles replaced by vivid smoke sprites with saturated cores for the filament feel; lifetimes are wall-clock (beads 5-9s, drops ~2-3s, rings/blooms 1.6s) so trails always clear within 5-10s; mounted on / + all routes incl. /ask. glassmorphism tabs (translucent white + blur/saturate + white border + inset highlight, ink text); chat restyle 2026-10-04 (user screenshot): glass message bubbles, 5-exchange message limit with gray limit state; chat page 2026-10-04 (user demand, popup dropped): conversation moves to glassmorphism /ask route (hero ask submits with ?q=, auto-asks once), quick chips + Hide toggle appear only after the first sent message, never on pristine views or focus; verified via ask-page + probe evidence. Memorable moment: slow rainbow streams under the cursor, color blooms where you tap, then the visitor opens /ask and chats away.

Unresolved: real name, memoji image (drop at public/avatar.png), projects, links, email, resume, deploy domain.

## Direction contract

THESIS: An AI engineer who feels alive before proving depth. Centered aurora hero as front door; one route per job instead of one long scroll.

OWN-WORLD: Airy paper #fafaf7 with a five-hue aurora field (mint, cyan, lavender, peach, pink) in parallax layers behind everything; white glass pills and cards at 14-24px radii; one action blue #2f7bff. Archivo display, Inter body, JetBrains Mono data. Card nav marks the current route with an accent ring.

STORY: Visitor feels the fluid follow their cursor, meets the human, picks a card, verifies range on the matching route, contacts. Delight → belief → contact.

FIRST VIEWPORT (/): Top-left builder pill; centered eyebrow, greeting, AI Engineer title, sub copy, 168px avatar; ask pill with blue send; five glass nav cards. Subpages repeat the pattern: back-home pill, eyebrow, title, card nav, then the route's content.

FORM: User-pinned aurora-field hero, no concept roll (pinned direction beats the roll). Multi-route extension inside the same world; no new identity exercise.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
