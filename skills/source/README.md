# WaterrAI Skills

[![skills.sh](https://img.shields.io/badge/skills.sh-waterrai%2Fskills-2563EB)](https://www.skills.sh/waterrai/skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

Agent skills that teach AI coding agents — [Claude Code](https://docs.claude.com/en/docs/claude-code), Cursor, Windsurf, GitHub Copilot, [OpenAI Codex](https://openai.com/index/introducing-codex/) — how to build on the [WaterrAI](https://waterr.ai) platform: personas, scenarios, meetings, transcripts, analyses.

The skill bundles the canonical [WaterrAI developer docs](https://docs.waterr.ai/api-reference/quickstart) as reference material and includes an internal scope-of-work gate that forces a written spec **before** any code is written.

## Install

### Any SKILL.md-compatible agent (Claude Code, Cursor, Windsurf, Copilot…)

```bash
npx skills add waterrai/skills
```

That's it — one skill installed:

| Skill | What it does |
|---|---|
| **`waterr-api`** | Loads on any "build/integrate/automate on WaterrAI" request. Knows the full API surface, the resource model, and the standard build sequence. Cites docs URLs beside every endpoint it uses. Internally invokes a `generate-understanding` sub-skill that runs a 3-round scoping interview and writes `WATERR_BUILD_SCOPE.md` to your project root, then **stops, waiting for sign-off**, before any code is written. |

### Codex (manual install — not in the SKILL.md registry)

From the root of the project where you'll run Codex:

```bash
git clone https://github.com/waterrai/skills.git .waterr-skill
cp -r .waterr-skill/codex/waterr/* ./
```

If you already have an `AGENTS.md`, append rather than overwrite.

Full instructions: https://docs.waterr.ai/skills/codex

## Try it

After installing, ask your agent something like:

```
> Build a candidate screening flow on Waterr — applicants take an AI
> interview when they apply, and the score lands in our ATS.
```

You'll get a 3-round interview, then `WATERR_BUILD_SCOPE.md`, then — only after you approve — working code with every endpoint cited.

For one-off questions, skip the scoping:

```
> Skip scoping. Give me the curl to create a meeting from scenario abc-123.
```

## Repo layout

```
skills/
└── waterr-api/
    ├── SKILL.md                                  # The user-facing skill
    └── skills/
        └── generate-understanding/
            └── SKILL.md                          # Internal scoping sub-skill (not listed separately)
codex/waterr/
├── AGENTS.md                                     # Codex equivalent of waterr-api
└── prompts/generate-understanding.md             # Codex equivalent of the scoping gate
```

## What the skill knows

The full WaterrAI API surface — fetched live from the docs at use time rather than duplicated here:

- [Authentication](https://docs.waterr.ai/api-reference/authentication), [session lifecycle](https://docs.waterr.ai/api-reference/session-lifecycle), [errors](https://docs.waterr.ai/api-reference/errors), [rate limits](https://docs.waterr.ai/api-reference/rate-limits)
- [Personas](https://docs.waterr.ai/api-reference/personas), [Scenarios](https://docs.waterr.ai/api-reference/scenarios), [Meetings](https://docs.waterr.ai/api-reference/meetings), [Transcripts](https://docs.waterr.ai/api-reference/transcripts), [Recordings](https://docs.waterr.ai/api-reference/recordings), [Analyses](https://docs.waterr.ai/api-reference/analysis), [Goals](https://docs.waterr.ai/api-reference/goals), [Voices](https://docs.waterr.ai/api-reference/voices), [Users](https://docs.waterr.ai/api-reference/users)
- [Webhooks](https://docs.waterr.ai/api-reference/webhooks), [SDKs](https://docs.waterr.ai/api-reference/sdks), [Prompting guide](https://docs.waterr.ai/api-reference/prompting-guide), [Examples](https://docs.waterr.ai/api-reference/examples)

Plus the common pitfalls: `membership_id` ≠ user ID, voice IDs must come from `/voices`, analyses are async (use webhooks not tight polling), scenarios are workspace-scoped.

## Contributing

PRs welcome. Two ground rules:

1. Keep `SKILL.md` files terse — link to https://docs.waterr.ai, don't duplicate. Docs are the source of truth.
2. Bump `metadata.version` in the frontmatter and add a [CHANGELOG](./CHANGELOG.md) entry on any behavior change.

## License

[MIT](./LICENSE)
