# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) — user-confirmed. Deploy target: undecided (default to Vercel-ready).

## Users

Primary: hiring managers / recruiters evaluating an AI developer for full-time roles, and potential clients / collaborators evaluating for freelance AI builds.
Situation: scanning portfolio in 30-60s, then deep-diving 1-2 proof items.
Job: verify capability across LLM engineering, ML, and full-stack AI, then contact.

## Product Purpose

Personal portfolio site that proves AI builder range and converts visits into contact (email / call / GitHub / LinkedIn).
Success: visitor understands specialties in first viewport, sees 3-6 credible projects, and contacts.

## Positioning

One developer covering the full AI product slice: LLM apps (RAG, agents, evals) + ML fundamentals (training, fine-tuning, datasets) + full-stack delivery (Next.js + Python APIs). A neighboring frontend-only or ML-only portfolio could not truthfully copy this breadth.

## Operating Context

Single-page / few-route portfolio. Sections expected: hero, selected work, capabilities/services, about/background, contact. External proof lives on GitHub and LinkedIn. Contact via email link.

## Capabilities and Constraints

Confirmed:
- Next.js website, portfolio mode (Persuade + Experience).
- Audience: both hiring and freelance.
- Range: LLM Engineering + ML/Research + Full-stack AI.
- Content strategy: single chatbot surface; bot answers from PROFILE.md + live GitHub tool, scripted fallback when no key.

Undecided:
- Exact 3-6 projects, metrics, case-study depth.
- Skills list granularity, blog/writing.
- Call scheduling link, form vs. mailto.
- Deploy target, domain, analytics.

Constraints:
- Do not fabricate real employers, testimonials, metrics, or press. Placeholders must be obviously replaceable.

## Brand Commitments

Name Saurabh Kumar, title AI Developer, based Noida. Current: Founding AI Engineer at ENXT AI. Bio line, GitHub (@saurabhkumar9901), LinkedIn (/in/saurabh-kumar-11june), email, and resume link are user-supplied real facts — preserve verbatim, never embellish. Visual world remains delegated to Impeccable.

## Evidence on Hand

Real: identity, bio, two roles with ships (ENXT AI call-agency assistant + Play Store Meeting Minutes app; Briqlabs RAG apps, -60% doc analysis time), contact links, memoji avatar, resume/LinkedIn text, 4 projects with links, publication, skills, GitHub profile. Live: ADK chatbot (gemini-3.5-flash-lite) grounded in PROFILE.md + github_repos tool; key in gitignored .env.local. Still illustrative: scripted fallback answers (tagged demo). The bot must say it doesn't know rather than invent.

## Product Principles

1. Proof over claims — every specialty pairs with a project or artifact.
2. Scan fast, dive deep — 30s overview, optional depth per project.
3. Builder signal — show shipped systems, evals, and production concerns, not just demos.
4. One clear next step — contact is always one click away.
5. Replaceable by design — placeholders structured so real content drops in without redesign.
