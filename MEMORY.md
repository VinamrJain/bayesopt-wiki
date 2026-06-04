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

**Progress:** Tier 0 + Tier 1 + S2 done.
- S0a ✅ `3b7289c` — `CONVENTIONS.md`, `notation.md`, `gaussian-process-regression.md`, `expected-improvement.md` (exemplar).
- S0b ✅ `6f1a60b` — `problem-setup`, `gp-hyperparameters`.
- S1a ✅ `b3513b0` — `acquisition-functions` (hub), `probability-of-improvement`, `gp-ucb`, `thompson-sampling-bo`.
- S1b ✅ `54a8c85` — `value-of-information`, `knowledge-gradient` (coupled; shared VoI frame).
- S1c ✅ `c71077e` — `entropy-search`, `predictive-entropy-search`, `max-value-entropy-search`
  (ES-frame relayed to PES/MES; promoted `p_⋆`, `γ_T`, `δ` to notation.md; trimmed gp-ucb delta).
- S2 ✅ `21cdb5e` — `bo-as-dynamic-program` (lead-authored). Terminal-reward Bellman recursion
  matching the VoI/KG seam; truncation table (EI/noisy-EI/KG/ES/PES/MES ← terminal utilities `u`);
  lam2016 stage-reward form reconciled (telescoping, `E[r_n]=EI`, `γ` = myopic↔multi-step dial).
  No new promotions (S2-local `S^n`/`V^n`/`π` kept as delta; revisit at S6 if shared by ≥3).

Next: **S3a** (cost-aware EI family, 4 Sonnet writers) — `cost-aware-bo`, `ei-per-unit-cost`,
`cost-cooling-carbo`, `cost-models`. Small sources (`lee2020` `main2020.tex`, `snoek2012` `draft.tex`,
`lee2021`, `xie2025`). Then S3b (DP/non-myopic cost family — connects to S2), S4, S5, S6.
Batch handoff: `~/.claude/handoffs/Bayesian-Optimization-2026-06-04-wiki-s2-done.md`.

**Routing corrections found mid-build** (source-routing.md "primary" column was optimistic):
`frazier2018` covers **only** EI / KG / ES / PES — it has **no** PI, GP-UCB, TS, or standalone
VoI section. PI & TS fell back to `shahriari2016` (taxonomy/default owner); VoI was synthesized
from frazier2018's EI+KG sections + `frazier2009kg`. Expect the same for any note routed
"frazier2018 primary" outside {EI, KG, ES, PES}.

**Notation promotions done** (no longer note-local deltas): `μ_n^*` / `μ_n^{**}` (S1a);
`p_⋆`, `γ_T`, `δ` (S1c — promoted mid-pass once shared by ≥3 notes). Precedent updated: promote
shared symbols when they recur, not deferred to S6. S6 queue currently empty.
