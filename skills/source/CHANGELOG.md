# Changelog

All notable changes to the WaterrAI skills are documented here. Versions follow [SemVer](https://semver.org/).

## [2.0.1] — 2026-05-31

### Changed
- Tightened the `description` field opening sentence so the skills.sh auto-generated summary headline reads as one crisp claim ("Build production integrations…") instead of a long trigger-list run-on.
- Added an `## Overview` section to the body, mirroring the structure of top-ranked Anthropic skills (`pdf`, `excel`, etc.). Bulleted, scannable, designed to render cleanly when skills.sh re-summarises.

No behavior change for installed agents.

## [2.0.0] — 2026-05-31

### Changed (breaking)
- Renamed `waterr` skill → **`waterr-api`**. Install command unchanged (`npx skills add waterrai/skills`) but the skill `name` field is new; existing installs must reinstall.
- Demoted `waterr-generate-understanding` from a sibling skill to an internal sub-skill nested at `skills/waterr-api/skills/generate-understanding/SKILL.md`. It is no longer independently installable from the registry — the parent `waterr-api` loads it directly. Users see and install only `waterr-api`.

### Why
- A single user-facing skill (`waterr-api`) with the scoping interview as an implementation detail matches how the workflow actually works: users don't pick "which Waterr skill to use," they ask for a Waterr build and the agent runs the right internal flow.
- Frees up the `waterr-…` namespace on skills.sh for future user-facing skills (e.g. `waterr-mcp`, `waterr-cli`) without name collisions.

## [1.0.0] — 2026-05-31

### Added
- `waterr` skill — canonical WaterrAI developer skill bundling the public API docs (auth, personas, scenarios, meetings, transcripts, recordings, analyses, goals, voices, users, webhooks, SDKs), the resource model, the standard build sequence, and common pitfalls.
- `waterr-generate-understanding` skill — structured 3-round scoping interview that produces `WATERR_BUILD_SCOPE.md` and gates code-writing on explicit user sign-off.
- `codex/waterr/` — `AGENTS.md` + `prompts/generate-understanding.md` for projects driven by OpenAI Codex (cloned manually; not part of the skills.sh registry).
- Repo published to [skills.sh](https://www.skills.sh/) via `npx skills add waterrai/skills`.
