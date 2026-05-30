# WaterrAI — Codex Agent Instructions

You are working in a project that integrates with the **WaterrAI** platform. WaterrAI is an AI meeting platform — personas (the AI participants), scenarios (the meeting setup), meetings (live rooms), transcripts, and post-meeting analyses are the primary resources.

## Rule 1 — scope before you code

For any non-trivial build, run the scoping interview in `prompts/generate-understanding.md` **before writing code**. It produces a `WATERR_BUILD_SCOPE.md` the user signs off on. Skipping it produces code that doesn't match the user's actual intent.

Skip it only when the user says "skip scoping" or asks a single concrete endpoint question.

## Rule 2 — read the docs, don't guess

The WaterrAI public docs are the source of truth. Fetch the relevant page before writing API calls. Do not invent endpoint paths, parameter names, or response shapes.

**Core**
- Quickstart: https://docs.waterr.ai/api-reference/quickstart
- Authentication: https://docs.waterr.ai/api-reference/authentication
- Session lifecycle: https://docs.waterr.ai/api-reference/session-lifecycle
- Errors: https://docs.waterr.ai/api-reference/errors
- Rate limits: https://docs.waterr.ai/api-reference/rate-limits

**Resources**
- Personas: https://docs.waterr.ai/api-reference/personas
- Scenarios: https://docs.waterr.ai/api-reference/scenarios
- Meetings: https://docs.waterr.ai/api-reference/meetings
- Transcripts: https://docs.waterr.ai/api-reference/transcripts
- Recordings: https://docs.waterr.ai/api-reference/recordings
- Analyses: https://docs.waterr.ai/api-reference/analysis
- Goals: https://docs.waterr.ai/api-reference/goals
- Voices: https://docs.waterr.ai/api-reference/voices
- Users & workspaces: https://docs.waterr.ai/api-reference/users

**Extensibility**
- Webhooks: https://docs.waterr.ai/api-reference/webhooks
- SDKs: https://docs.waterr.ai/api-reference/sdks
- Prompting guide: https://docs.waterr.ai/api-reference/prompting-guide
- Examples: https://docs.waterr.ai/api-reference/examples

Cite the docs URL for any endpoint you use.

## Resource model (one paragraph)

A **Persona** is reusable — a named AI character with voice, demeanor, background. A **Scenario** binds personas + goals + instructions into a meeting template. A **Meeting** is one live instance of a scenario; creating it returns a join URL. After the meeting ends, a **Transcript** and optional **Recording** are produced, and an **Analysis** scores the transcript against the scenario's **Goals**. Webhooks fire at lifecycle events.

## Standard build sequence

1. Authenticate — API secret preferred. Fetch `membership_id` + `org_id` from `/users/active-workspace`.
2. Create persona(s), goal(s), then a scenario referencing them.
3. Create a meeting from the scenario → return the join URL.
4. Subscribe to webhooks for `meeting.ended` and `analysis.completed`.
5. On those events, fetch transcript / analysis.

## Common pitfalls

- `membership_id` ≠ user ID — always fetch from `/users/active-workspace`.
- Voice IDs are not free-form — list them via `/voices` first.
- Analyses are async — use the webhook, don't tight-poll.
- Scenario IDs are workspace-scoped — confirm `org_id` matches before reusing across orgs.
- Use the documented `Authorization: Bearer` flow; don't hand-roll auth.

## Output discipline

- Cite the relevant docs URL beside every endpoint call.
- Real code, not pseudo-code.
- For new flows: run `prompts/generate-understanding.md`, write the scope, get sign-off, *then* implement.
