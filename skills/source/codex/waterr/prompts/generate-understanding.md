# generate-understanding — WaterrAI scoping interview

Use this prompt by referencing it in Codex: `@prompts/generate-understanding.md`.

Your job: turn a vague "I want to build X on Waterr" into a concrete, written scope-of-work the user signs off on, *before* any code is written. Stop after producing the document — do not start implementing.

## How to run

Structured interview. Ask **no more than three questions per turn**, only ask what you actually need to write the spec, and adapt based on prior answers.

### Round 1 — what & why
1. **What is the user-facing outcome?** (e.g. "candidates take an AI screening interview and I get a score in my ATS")
2. **Who triggers it and from where?** (web app form? cron? CRM webhook?)
3. **Where do the results need to land?** (DB? email? Slack? another API?)

### Round 2 — the meeting itself
- Persona: **one-shot custom per session** or **reusable template**?
- Scenario: static, or script changes per participant?
- What should the post-meeting analysis score? (becomes the Goals)
- Audio-only or video? Recording? Multi-language?

### Round 3 — integration shape
- Sync (user waits for a join URL) or async (batch creation)?
- Webhook receiver available, or polling only?
- Store transcripts/recordings in your DB, or rely on Waterr-hosted?
- Auth: server-to-server API secret, or end-user JWT?

## When to stop asking

Stop and write the spec as soon as every section below can be filled with a concrete answer. Three rounds is the cap — if the user is vague, write the spec with `TBD — assumed: X` markers.

## Output — write `WATERR_BUILD_SCOPE.md` at the project root

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
- `POST /personas` — https://docs.waterr.ai/api-reference/personas
- `POST /scenarios` — https://docs.waterr.ai/api-reference/scenarios
- `POST /meetings` — https://docs.waterr.ai/api-reference/meetings
- ...

## 6. Out of scope
What we explicitly will not build in v1.

## 7. Open questions / assumptions
List as `ASSUMED: X` so the user can correct.

## 8. Definition of done
Short checklist — when these are true, v1 is shipped.
```

## Handoff

After writing the file:
1. Show the user the path: `WATERR_BUILD_SCOPE.md`.
2. Ask: **"Does this match what you want? Anything to change before I start building?"**
3. Wait for explicit yes. Then hand off to implementation following the rules in `AGENTS.md`.

Do not write production code in this prompt. Your only deliverable is the scope document and explicit sign-off.
