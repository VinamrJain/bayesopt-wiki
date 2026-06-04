# MEMORY

Project ops and in-progress work. Wiki build handoff: `~/.claude/handoffs/Bayesian-Optimization-2026-06-03-wiki-build.md`.

## Doc roles

| File | Audience | Content |
|------|----------|---------|
| `references.md` | Anyone | Bibliography: keys, authors, links, one-paragraph contribution. **No** agent tiers, parse status, or session jargon. |
| `MEMORY.md` | Agents | Project ops: doc roles, git, sources, context-rot. **Not** the build plan. |
| `CLAUDE.md` | Agents | Repo conventions. |
| `wiki/build/source-routing.md` | Agents | **Authoritative** wiki build plan: note map, routing, synthesis mandate, model rules, session batches. |

Writing style: same bar as `~/.claude/memory/feedback_skill-writing-generic.md` and concept-wiki pattern in `~/.claude/memory/reference_concept-wiki-synthesis.md`.

## Git (local only)

No remote. Atomic commits; prefixes `wiki:` `raw:` `fix:` `chore:`. Undo with `git revert`, not `reset --hard`. Stage paths explicitly. No secrets (`.env`); no remotes/push unless asked.

Tracks: `raw/**/*.tex`, `raw/**/*.bib`, trustworthy `raw/**/*.md`; plus `references.md`, `wiki/`. Ignores figures, styles, scripts, data, PDFs — see `.gitignore`.

Background sessions: bg-isolation guard disabled via `.claude/settings.json` (`worktree.bgIsolation: none`) so doc edits land in the main checkout. Read at session start — fresh session honors it, mid-session toggling does not.

## Sources

Truth: `raw/` — LaTeX via `scripts/fetch_arxiv_sources.py`, or `raw/<key>/<key>.md` for pdf-derived papers (YAML: `source_type: pdf-derived`, `parser: mathpix`). `_archive/` drafts are **not** sources.

Local PDFs under `raw/<key>/` are gitignored; commit only good `.md`.

## Context rot

Model quality degrades once a session exceeds ~**120–150k tokens**: notation drifts, concepts get defined twice, proofs merge incorrectly across papers.

**Mitigations:** writer subagents read heavy sources in their own context; the lead session accumulates only finished notes + reconciliation; **≤~90k loaded docs** per session; handoff at batch boundaries; resume from handoff + git, not chat history. Never load all of `raw/` in one session (~590k tokens total corpus).

## Wiki build — status

Plan, routing table, synthesis mandate, model rules, and session batches all live in **`wiki/build/source-routing.md`**.

**Progress:** S0a ✅ (commit `3b7289c`) — `CONVENTIONS.md`, `notation.md`,
`gaussian-process-regression.md`, `expected-improvement.md` (exemplar). Next: **S0b**
(problem-setup, gp-hyperparameters). Batch handoff:
`~/.claude/handoffs/Bayesian-Optimization-2026-06-04-wiki-S0a-done.md`.
