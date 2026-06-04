# Source routing (wiki build) — LOCKED

Authoritative note ↔ source assignment and the agentic build plan. Locked in the
Opus planning session (2026-06-04). Supersedes all prior draft markers.

Agent reference: which `raw/<key>/` owns each note.
- **Derivation-primary** = the source whose derivation is *cleanest*, not necessarily the
  origin paper. Writers derive the core chain from it.
- **Origin / secondary** = attribution + crosswalk rows + **non-redundant** additions
  (insights, proofs, variants) the derivation-primary omits. Never a duplicate core chain.

**Session cap:** load CONVENTIONS + notation + EI exemplar + this note's primary files ≤ ~90k tokens.
The cap is slack for single notes (anchors ~11k + one primary ≤30k); the real risk is
*accumulation across many notes in one session* — see Session batches.

## Synthesis mandate (binding — read first)

The team does **not transcribe** papers. For every note:
- **Find the cleanest / simplest / most intuitive derivation.** Where sources disagree in
  approach, pick (or construct) the path that is shortest-to-insight, and relegate the
  messier original to a crosswalk remark. (Canonical example: derive EI from `frazier2018`'s
  improvement-function chain, not `jones98`'s kriging algebra.)
- **Critically interrogate claims.** Flag hand-waves, hidden assumptions, and notation that
  obscures the idea; state the assumption explicitly rather than inheriting fog.
- **Make connections.** Surface cross-note structure (EI = one-step KG; UCB/EI/ES as different
  value-of-information surrogates; DP as the parent of all myopic acquisitions; regret upper
  ↔ lower bounds). These connections are a first-class deliverable, captured in `map.md` and in
  each note's interpretation/relation section — not an afterthought.

## Post-writing review & refine (binding)

Writing a note is **not** the last step. After a note (or batch) is drafted, the lead runs an
explicit **critical-review and refinement pass** before committing — treating the fresh draft
as a source to interrogate, not a finished artifact. This pass is mandatory, agent-driven, and
may surface findings for **human feedback** before refinement.

Checklist:
- **Correctness.** Re-derive key results independently; sanity-check closed forms at
  limits/edge cases; if claiming a source errs, verify against the exact line and cite it.
  (The S0a EI exemplar caught a sign error in `frazier2018`'s compact EI formula this way.)
- **Self-containment & rendering.** Note + [[notation]] must stand alone; math uses stock
  KaTeX/MathJax primitives only — no `\newcommand` / paper-preamble macros (see `CONVENTIONS.md`).
- **Notation hygiene.** No symbol collisions. Resolve a clash in a *shared* symbol (e.g. a
  kernel parameter vs. the acquisition symbol) **upstream in `notation.md` before dependent
  notes are written**, not per-note. `sources:` lists only keys actually used in the body.
- **Connections.** Cross-note relations present and accurate; crosswalks reconcile, never duplicate.

Prioritize findings: correctness / open decisions > derivation strength > wording. Fold
accepted fixes back in, then commit. Record notable refinements in the batch handoff so later
writers inherit the raised standard.

## Topology — star with lead as cross-talk router

Writer subagents **cannot peer-chat** in this harness. The **Opus lead is the integration point
and the cross-talk relay**: when writer A needs writer B's result (e.g. KG needs the VoI frame,
PES/MES need the ES information-theoretic frame), the lead relays the finished fragment between
them and reconciles notation. Integration is **first-class Opus work, not cleanup** — the lead
actively engineers connections and may bounce a note back for a "find the cleaner derivation" pass.

## Paper roles

| Role | Keys |
|------|------|
| Spine (clean derivations) | `frazier2018`, `jones98` |
| Map / taxonomy (default) | `shahriari2016` — structure + Tier-4 stub owner; derive only if not elsewhere |
| Derivation-primary owners | see table below |
| Stub sources (Tier 4) | `wang2016qei`, `wu2019takg`, `wilson2018`, `kandasamy2017` |
| Citation-only | `mockus1978` |

## Note routing

| Slug | Tier | Model | Derivation-primary | Primary files | Origin / secondary (crosswalk + gap-fill) |
|------|------|-------|---------|---------------|-------------------|
| `notation` | 0 | Opus | frazier2018 | `tutorial.tex` (GP notation) | snoek2012 |
| `problem-setup` | 0 | Sonnet | frazier2018 | tutorial §problem | jones98 intro |
| `gaussian-process-regression` | 0 | Opus | frazier2018 | tutorial GP sections | jones98 §2, srinivas2010 §2 |
| `gp-hyperparameters` | 0 | Sonnet | snoek2012 | `draft.tex` | frazier2018 |
| `acquisition-functions` | 1 | Opus | frazier2018 | tutorial overview | shahriari2016 (taxonomy) |
| `expected-improvement` | 1 | Opus | frazier2018 | tutorial EI | jones98 (EGO origin), mockus1978 (concept origin), snoek2012, bull2011 |
| `probability-of-improvement` | 1 | Sonnet | frazier2018 | tutorial PI | jones98 |
| `gp-ucb` | 1 | Opus | srinivas2010 | `srinivas2010.md` §3–5 | frazier2018 |
| `thompson-sampling-bo` | 1 | Sonnet | frazier2018 | tutorial TS | shahriari2016 |
| `knowledge-gradient` | 1 | Opus | frazier2009kg | `frazier2009kg.md` | frazier2018 |
| `value-of-information` | 2 | Opus | frazier2018 | tutorial VoI | frazier2009kg |
| `entropy-search` | 1 | Opus | hennig2012 | `EntropySearch.tex` | frazier2018 |
| `predictive-entropy-search` | 1 | Sonnet | hernandez2014 | `sections/predictiveEntropy.tex`, `method.tex` | hennig2012 |
| `max-value-entropy-search` | 1 | Sonnet | wang2017mes | `method.tex`, `model.tex`, `math_definition.tex` | hennig2012 |
| `bo-as-dynamic-program` | 2 | Opus | frazier2018, lam2016 | tutorial multi-step, `lam2016.md` | astudillo2021 |
| `cost-aware-bo` | 3 | Sonnet | lee2020 | `main2020.tex` | shahriari2016 |
| `ei-per-unit-cost` | 3 | Sonnet | snoek2012, lee2020 | `draft.tex`, `main2020.tex` | — |
| `cost-cooling-carbo` | 3 | Sonnet | lee2020 | `main2020.tex` | — |
| `cost-models` | 3 | Sonnet | lee2020, lee2021 | cost sections | xie2025 |
| `budget-constrained-dp` | 3 | Opus | lam2016, astudillo2021 | `lam2016.md`, `main_content.tex` | frazier2018 |
| `multistep-budgeted-bo` | 3 | Opus | astudillo2021 | `main_content.tex` | lam2016 |
| `nonmyopic-cost-constrained-bo` | 3 | Opus | lee2021 | `cost_constrained_bo.tex`, `methods.tex`, `cmdp.tex` | — |
| `cost-aware-stopping` | 3 | Sonnet | xie2025 | `ICML/method.tex`, `background.tex` | lee2020 |
| `regret-gp-bandits` | 5 | Opus | srinivas2010 | `srinivas2010.md` §4–5, appendix | scarlett2017 |
| `ego-convergence-rates` | 5 | Opus | bull2011 | `bull2011.md` §2–3 | jones98 |
| `gp-bandit-lower-bounds` | 5 | Opus | scarlett2017 | `ConverseGP.tex` | srinivas2010 |
| `parallel-batch-bo` | 4 | Sonnet | wang2016qei | `MOE.tex` (intro) | wu2019takg |
| `multi-fidelity-bo` | 4 | Sonnet | kandasamy2017 | `boca.tex`, `prelims.tex` | skip `archive/` |
| `noisy-evaluations` | 4 | Sonnet | snoek2012, frazier2018 | pointers | — |
| `constraints` | 4 | Sonnet | frazier2018, shahriari2016 | pointers | — |
| `derivative-observations` | 4 | Sonnet | shahriari2016, frazier2018 | pointers | — |
| `initial-design` | 4 | Sonnet | shahriari2016, frazier2018 | pointers | — |
| `environmental-multitask-bo` | 4 | Sonnet | shahriari2016 | pointers | — |
| `map` | 0 | Opus | shahriari2016 + wiki slugs | survey outline + DAG | — |

## Session batches (one Opus lead session per row)

Each batch: lead spawns one writer subagent per note (writer reads heavy sources in its **own**
context, returns note + notation conflicts + suggested crosswalk rows + cross-note connections);
lead integrates, reconciles notation/DAG/wikilinks, engineers connections, **runs the
post-writing review & refine pass (above)**, commits, writes handoff.
Foundations (S0a) are **lead-authored** (not subagent) to set the voice/notation standard.

| Batch | Notes | Synthesis / cross-talk |
|-------|-------|------------------------|
| **S0a** | CONVENTIONS, notation, gaussian-process-regression, expected-improvement *(exemplar)* | Lead-authored. EI = the cleanest-derivation reference all later writers anchor on. |
| **S0b** | problem-setup, gp-hyperparameters | Sonnet writers. |
| **S1a** | acquisition-functions (hub), probability-of-improvement, gp-ucb, thompson-sampling-bo | Hub note frames the tier; lead seeds it from the other three's results. |
| **S1b** | knowledge-gradient, value-of-information | Paired — KG is one-step VoI; lead relays the VoI frame into KG. |
| **S1c** | entropy-search, predictive-entropy-search, max-value-entropy-search | ES derived first; lead relays its info-theoretic frame to PES/MES (no re-derivation). |
| **S2** | bo-as-dynamic-program | Parent frame for all myopic acquisitions; lead connects back to EI/KG/VoI. |
| **S3a** | cost-aware-bo, ei-per-unit-cost, cost-cooling-carbo, cost-models | EI-cost family; small sources; Sonnet writers. |
| **S3b** | budget-constrained-dp, multistep-budgeted-bo, nonmyopic-cost-constrained-bo, cost-aware-stopping | DP / non-myopic family; Opus-heavy; connect to S2. |
| **S4** | regret-gp-bandits, ego-convergence-rates, gp-bandit-lower-bounds | Connect Srinivas upper ↔ Scarlett lower ↔ Bull EGO rates. |
| **S5** | Tier 4 stubs (7) | All Sonnet; concept-grade (defn + key formula + pointer). |
| **S6** | map.md + global integration | Notation audit, crosswalk reconciliation, wikilink/DAG resolution, cross-note connection pass. |

## Writer subagent prompt (copy per note)

```
Read: wiki/CONVENTIONS.md, wiki/notation.md, wiki/expected-improvement.md (exemplar).
Read: raw/<derivation-primary>/ (files listed in source-routing.md only).
Write: wiki/<slug>.md.

Synthesis mandate — do NOT transcribe:
- Derive the core chain in the CLEANEST / simplest / most intuitive form. If the source's
  derivation is messy, construct the shorter path and note the original in the crosswalk.
- Interrogate claims: state hidden assumptions explicitly; flag hand-waves.
- Note cross-note connections you see (e.g. "this is X specialized to Y") for the lead.

Do not read other raw/ keys unless this is an explicit gap-fill for a listed secondary.
If secondary material is needed and absent from the primary, add it with cite + crosswalk
(no duplicate derivation), or flag it for a gap-fill pass.

Before returning, self-check: math uses stock KaTeX/MathJax primitives only (no \newcommand or
paper-preamble macros like \EI, \Normal, \R — expand them); note + notation.md stands alone;
sources: lists only keys you actually used. If you suspect a source errs, flag it with the
exact line — do not silently "fix" it.
Return to lead: the note, notation conflicts, suggested crosswalk rows, cross-note connections.
```

## Build order

S0a → S0b → S1a → S1b → S1c → S2 → S3a → S3b → S4 → S5 → S6.
Commit per batch (`wiki:`); handoff at every batch boundary; never load all `wiki/*.md` + all
`raw/` in one session. Optional gap-fill session per secondary key after its tier.
