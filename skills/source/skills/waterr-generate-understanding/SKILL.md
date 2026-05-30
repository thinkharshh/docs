---
name: waterr-generate-understanding
description: Interview the user to produce a written scope-of-work for a WaterrAI build before any code is written. Use at the start of any non-trivial WaterrAI integration — companion to the `waterr` skill. Outputs a markdown spec the user signs off on, then hands off to implementation. Saves rework — most failed Waterr integrations are scoped wrong, not coded wrong.
license: MIT
compatibility: claude-code, cursor, windsurf, copilot
metadata:
  version: "1.0.0"
  homepage: "https://docs.waterr.ai"
  source: "https://github.com/waterrai/skills"
  pairs-with: "waterr"
---

# waterr-generate-understanding

Your job is to turn a vague "I want to build X on Waterr" into a concrete, written scope-of-work the user signs off on, *before* any code is written. Stop after producing the document — do not start implementing.

## How to run

Run this as a structured interview. Ask **no more than three questions per turn** and only ask what you actually need to write the spec — don't run a checklist. Adapt based on prior answers.

### Round 1 — what & why

Establish the use case at the level of "what does success look like for the end user."

Ask:
1. **What is the user-facing outcome?** (e.g. "candidates take an AI screening interview and I get a score in my ATS")
2. **Who triggers it and from where?** (your web app form? a cron job? a CRM webhook?)
3. **Where do the results need to land?** (your DB? an email? Slack? another API?)

### Round 2 — the meeting itself

Now scope what happens *inside* the Waterr meeting.

Ask only the ones you don't already know:
- Is the persona **one-shot custom per session** (e.g. a hiring manager tailored to the candidate's resume) or **a reusable template** (e.g. one fixed "sales discovery agent")?
- Is the scenario static, or does the script change per participant?
- What does "good" look like — what should the post-meeting analysis score? (this becomes the Goals)
- Audio-only or video? Recording needed? Multi-language?

### Round 3 — integration shape

Now decide the technical shape.

- Synchronous (user waits for a join URL) or async (you create meetings in batch)?
- Webhook receiver available, or polling only?
- Storage of transcripts/recordings — Waterr-hosted (default) or fetched + stored in your DB?
- Auth model — server-to-server (API secret) or end-user JWT?

## When to stop asking

Stop and write the spec as soon as you can fill in every section below with a concrete answer. Don't ask follow-ups for nice-to-haves. Three rounds is the cap — if the user is being vague, write the spec with explicit `TBD — assumed: X` markers and let them correct.

## Output — write to `WATERR_BUILD_SCOPE.md` in the project root

Produce a markdown file with exactly these sections:

```markdown
# WaterrAI Build Scope

## 1. Use case (one paragraph)
What the end user experiences. Why this is being built.

## 2. Trigger & flow
- Trigger: <where the meeting is created from>
- Flow: <step-by-step, from trigger to result>
- Sync vs async: <which>

## 3. Waterr resources needed
- Personas: <static reusable | dynamic per session> — <description>
- Scenarios: <static | templated per request>
- Goals (analysis criteria): <list the dimensions to score on>
- Voices / language / recording: <choices>

## 4. Auth & deployment
- Auth: <API secret | per-user JWT> — why
- Hosting: <where the integration code runs>
- Webhook receiver URL (if any): <or "polling fallback">

## 5. Endpoints this build will call
List the exact Waterr endpoints, with the docs URL next to each:
- `POST /personas` — https://docs.waterr.ai/api-reference/personas
- `POST /scenarios` — https://docs.waterr.ai/api-reference/scenarios
- `POST /meetings` — https://docs.waterr.ai/api-reference/meetings
- ...

## 6. Out of scope
What we explicitly will not build in v1.

## 7. Open questions / assumptions
Anything the user did not answer — list as `ASSUMED: X` so they can correct before code is written.

## 8. Definition of done
A short checklist: when these are true, v1 is shipped.
```

## Handoff

After writing the file:
1. Show the user the path: `WATERR_BUILD_SCOPE.md`.
2. Ask: **"Does this match what you want? Anything to change before I start building?"**
3. Wait for explicit yes. Then — and only then — hand off to the `waterr` skill to implement.

Do not write any production code in this skill. Your only deliverable is the scope document and explicit user sign-off.
