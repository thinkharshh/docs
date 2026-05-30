# Changelog

All notable changes to the WaterrAI skills are documented here. Versions follow [SemVer](https://semver.org/).

## [1.0.0] — 2026-05-31

### Added
- `waterr` skill — canonical WaterrAI developer skill bundling the public API docs (auth, personas, scenarios, meetings, transcripts, recordings, analyses, goals, voices, users, webhooks, SDKs), the resource model, the standard build sequence, and common pitfalls.
- `waterr-generate-understanding` skill — structured 3-round scoping interview that produces `WATERR_BUILD_SCOPE.md` and gates code-writing on explicit user sign-off.
- `codex/waterr/` — `AGENTS.md` + `prompts/generate-understanding.md` for projects driven by OpenAI Codex (cloned manually; not part of the skills.sh registry).
- Repo published to [skills.sh](https://www.skills.sh/) via `npx skills add waterrai/skills`.
