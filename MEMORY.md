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

**Progress:** Tier 0 + Tier 1 + S2 + S3a done.
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

- S3a ✅ `13310c0` — `cost-aware-bo` (hub), `ei-per-unit-cost`, `cost-cooling-carbo`, `cost-models`.
  Promoted cost symbols (`c`,`log c`,`τ`,`τ_init`,`τ_k`,`α_k`,`EIpu`,`EI-cool`) to notation.md;
  `α_k` disambiguated from generic `α_n(x)`. Hub reconciles **two** cost-aware problem
  formulations: budget-constrained (lee2020) vs cost-per-sample/cost-adjusted-regret (xie2025);
  family map covers EIpu / cost-cooling / PBGI-LogEIPC-stopping. EI-cool schedule re-derived
  against lee2020 source line.

Next: **S3b** (DP/non-myopic cost family — connects to S2) — `budget-constrained-dp`,
`multistep-budgeted-bo`, `nonmyopic-cost-constrained-bo`, `cost-aware-stopping`. Opus-heavy.
Sources: `lam2016`, `astudillo2021` (`main_content.tex`), `lee2021`
(`cost_constrained_bo.tex`/`methods.tex`/`cmdp.tex`), **`xie2025`** (`cost-aware-stopping` primary;
present at `raw/2025_cost_aware_stopping_bo/`, Pandora's-box Gittins-index stopping). Then S4, S5, S6.
Batch handoff: `~/.claude/handoffs/Bayesian-Optimization-2026-06-04-wiki-s3a-done.md`.

**Routing corrections found mid-build** (source-routing.md "primary" column was optimistic):
`frazier2018` covers **only** EI / KG / ES / PES — it has **no** PI, GP-UCB, TS, or standalone
VoI section. PI & TS fell back to `shahriari2016` (taxonomy/default owner); VoI was synthesized
from frazier2018's EI+KG sections + `frazier2009kg`. Expect the same for any note routed
"frazier2018 primary" outside {EI, KG, ES, PES}.
- **S3a:** `xie2025` was routed as `cost-models` secondary but has **no** cost-model content
  (it takes `c(x)` as given) — it is really the `cost-aware-stopping` primary (Pandora's-box/
  PBGI, LogEIPC). Folder is `raw/2025_cost_aware_stopping_bo/` (topic-named, not author —
  `grep -i xie` misses it). Reading it surfaced a 2nd cost-aware *problem formulation*
  (cost-per-sample/cost-adjusted-regret) + LogEIPC/PBGI that the drafted hub+EIpu notes had
  missed → backported. **Lesson saved as auto-memory `feedback_browse-all-sources-before-writing`:
  read (don't grep) all relevant sources before finalizing; do an end-of-build references.md audit.**

**Notation promotions done** (no longer note-local deltas): `μ_n^*` / `μ_n^{**}` (S1a);
`p_⋆`, `γ_T`, `δ` (S1c — promoted mid-pass once shared by ≥3 notes); **cost symbols `c(x)`,
`log c(x)`, `τ`, `τ_init`, `τ_k`, `α_k`, `EIpu`, `EI-cool` (S3a)** — new "Cost-aware BO"
subsection in notation.md; `α_k` flagged as distinct from generic acquisition `α_n(x)`.
Precedent: promote shared symbols when they recur, not deferred to S6. S6 queue currently empty.
