---
name: waterr-api
description: Build production integrations on the WaterrAI meeting platform — AI personas, scenarios, live meetings, transcripts, recordings, and post-meeting analyses via the public REST API. Use whenever the user wants to integrate WaterrAI, build on top of Waterr, automate meeting creation, run programmatic AI interview/sales/training/onboarding sessions, ingest transcripts or analyses, build candidate-screening or customer-discovery flows, or mentions "Waterr", "meet.waterr.ai", or "build something with Waterr". Bundles a scoping sub-skill that interviews the user and produces a written scope-of-work before any code is written.
license: MIT
compatibility: claude-code, cursor, windsurf, copilot
metadata:
  version: "2.0.1"
  homepage: "https://docs.waterr.ai"
  source: "https://github.com/waterrai/skills"
---

# WaterrAI Developer Skill

## Overview

Production-ready guide for building on the [WaterrAI](https://waterr.ai) meeting platform via its public REST API — personas, scenarios, meetings, transcripts, and analyses.

- Covers the full developer surface: auth, session lifecycle, personas, scenarios, meetings, transcripts, recordings, analyses, goals, voices, users, webhooks, SDKs — every endpoint links straight to the live docs at https://docs.waterr.ai
- Bundles a `generate-understanding` sub-skill that runs a 3-round scoping interview and produces `WATERR_BUILD_SCOPE.md` before any code is written — gates implementation on explicit user sign-off
- Encodes the common pitfalls that bite first-time integrators: `membership_id` vs user ID, voice-ID enumeration, async analyses, workspace-scoped scenarios
- Compatible with Claude Code, Cursor, Windsurf, and GitHub Copilot — install with `npx skills add waterrai/skills`

## First step, every time: scope before you code

For any request beyond a one-line "show me how to call endpoint X," load and follow the bundled sub-skill at `skills/generate-understanding/SKILL.md` (relative to this file) before writing any code. It interviews the user, produces a written scope-of-work, and only then hands back to you for implementation. Skipping it produces code that doesn't match what the user actually wants.

You may skip the `generate-understanding` sub-skill only when:
- The user explicitly says "skip the scoping" / "I know what I want, just do X"
- The request is a single concrete API call lookup ("what's the curl for creating a persona?")

When in doubt, run it.

## Canonical reference — always check these before guessing

The WaterrAI public docs are the source of truth. Read the relevant page(s) before writing API calls. Do NOT invent endpoint paths, parameter names, or response shapes — fetch the doc.

**Core concepts & getting started**
- Quickstart: https://docs.waterr.ai/api-reference/quickstart
- Authentication (API secret vs JWT): https://docs.waterr.ai/api-reference/authentication
- Session lifecycle (create → join → end → analyze): https://docs.waterr.ai/api-reference/session-lifecycle
- Errors & status codes: https://docs.waterr.ai/api-reference/errors
- Rate limits: https://docs.waterr.ai/api-reference/rate-limits

**Resource APIs**
- Personas (the AI participant): https://docs.waterr.ai/api-reference/personas
- Scenarios (meeting setup): https://docs.waterr.ai/api-reference/scenarios
- Meetings (live rooms): https://docs.waterr.ai/api-reference/meetings
- Transcripts: https://docs.waterr.ai/api-reference/transcripts
- Recordings: https://docs.waterr.ai/api-reference/recordings
- Analyses (post-meeting AI scoring): https://docs.waterr.ai/api-reference/analysis
- Goals (evaluation criteria): https://docs.waterr.ai/api-reference/goals
- Voices: https://docs.waterr.ai/api-reference/voices
- Users & workspaces: https://docs.waterr.ai/api-reference/users

**Integrations & extensibility**
- Webhooks: https://docs.waterr.ai/api-reference/webhooks
- SDKs: https://docs.waterr.ai/api-reference/sdks
- Prompting guide (for persona/scenario authoring): https://docs.waterr.ai/api-reference/prompting-guide
- Worked examples: https://docs.waterr.ai/api-reference/examples

When a page is needed, fetch it with WebFetch. Cite the URL in your response so the user can verify.

## Resource model in one paragraph

A **Persona** is reusable — a named AI character with voice, demeanor, background. A **Scenario** binds personas + goals + instructions into a meeting template. A **Meeting** is one live instance of a scenario; creating it returns a join URL. After the meeting ends, a **Transcript** and optional **Recording** are produced, and an **Analysis** scores the transcript against the scenario's **Goals**. Webhooks fire at lifecycle events so external systems can react.

## Build sequence — what almost every integration looks like

1. Authenticate: get an API secret (preferred) or JWT, fetch the user's `membership_id` and `org_id` from `/users/active-workspace`.
2. Create the building blocks: persona(s), goal(s), then a scenario that references them.
3. Create a meeting from the scenario → return the join URL to the end user.
4. Subscribe to webhooks for `meeting.ended` / `analysis.completed`.
5. On `meeting.ended`, fetch the transcript; on `analysis.completed`, fetch the analysis.

Verify each step against the docs page above before writing the call.

## Common pitfalls to avoid

- Don't hand-roll auth — use the documented `Authorization: Bearer` flow.
- `membership_id` ≠ user ID. Fetch from `/users/active-workspace`.
- Voice IDs are not free-form strings — list them via `/voices` first.
- Analyses are async — don't poll tightly; use the webhook or a backoff schedule documented in the analyses page.
- Scenario IDs are tied to a workspace; cross-workspace reuse fails silently — confirm `org_id` matches.

## Output discipline

- Cite the docs URL for every endpoint you reference.
- Show real curl or SDK code, not pseudo-code.
- If the user's request needs a flow you haven't built before, load `skills/generate-understanding/SKILL.md` first, write the scope to a file, get user sign-off, then implement.
