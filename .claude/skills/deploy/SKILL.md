---
name: deploy
description: Deploy the docs-site to production. Commits ALL pending changes in this repo and pushes to master — Mintlify auto-deploys from there.
---

# Deploy docs-site

When the user says "deploy" (or "deploy this", "ship the docs", "push the docs") inside `docs-site/`, run the full repo-wide deploy — do not narrow scope to "just the recent edit."

## Steps

1. **Snapshot the working tree** so you know what's about to ship:
   ```bash
   git status
   git diff --stat
   ```
   Skim the file list for anything that obviously shouldn't ship (e.g. `.env*`, `*.pem`, `credentials*`, `secrets*`, files matching `*token*` / `*secret*`). If you find one, STOP and surface it to the user before continuing.

2. **Make sure you're on `master`** — the deploy branch.
   - If on `master`: nothing to do.
   - If on another branch (e.g. `development`): merge or rebase your local work onto `master`, or `git checkout master && git merge <branch> --ff-only` if it's a clean fast-forward. If there's divergence you can't fast-forward, ask the user how to reconcile rather than guessing.

3. **Stage everything and commit:**
   ```bash
   git add -A
   git commit -m "$(cat <<'EOF'
   <one-line summary of the most prominent change, e.g. "fix: crop docs logo so it renders at the correct size">

   Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
   EOF
   )"
   ```
   If there's nothing to commit, skip — but still push (step 4) in case there are unpushed local commits.

4. **Push to `master`:**
   ```bash
   git push origin master
   ```

5. **Confirm deploy.** docs-site is a Mintlify project — Mintlify watches the connected git branch and rebuilds automatically (no CI in this repo). Tell the user the push succeeded and mention that Mintlify typically takes ~30–60 seconds to rebuild. The live URL is https://docs.waterr.ai (or whatever the user's Mintlify project resolves to).

## Notes

- This skill is the standing authorization for pushing to `master` from this repo — don't re-ask the user for confirmation on the push.
- This repo has **no `main` branch**; the primary branch is `master`.
- The monorepo at `..` has many other in-progress edits across submodules. Those are out of scope — only touch `docs-site/`.
- If `git push` rejects on remote-ahead, `git pull --rebase origin master` first, then push.
