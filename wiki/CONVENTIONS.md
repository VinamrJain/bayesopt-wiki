# Wiki conventions

House style for the Bayesian-optimization concept-wiki. Every note — lead- or
subagent-authored — conforms to this. Read alongside [[notation]] (the canonical symbol
table) and `wiki/build/source-routing.md` (the binding synthesis mandate and note↔source
routing). This file governs *form*; `source-routing.md` governs *content sourcing*.

## What a note is

One **concept**, not one paper. The same concept appearing in several papers becomes one
note; differing notations are reconciled in that note's **crosswalk table**, never by
spawning a duplicate. A note plus [[notation]] is **self-contained**: a reader who knows
the canonical symbol table can read any note end-to-end without opening another.

Notes are **derivation-grade for core concepts** (the cleanest derivation, carried through),
**concept-grade for peripheral ones** (definition + key formula + pointer). Never derive
content that has no source in `raw/` — defer it instead.

## Frontmatter

Every note opens with YAML frontmatter:

```yaml
---
title: Expected Improvement
slug: expected-improvement
tags: [acquisition, myopic, decision-theoretic]
requires: [gaussian-process-regression, problem-setup]
sources: [frazier2018, jones98, mockus1978]
---
```

- **`title`** — human-readable, title-case.
- **`slug`** — kebab-case, matches the filename (`<slug>.md`), flat in `wiki/`. No number
  prefixes; ordering lives in [[map]], not in filenames.
- **`tags`** — theme labels (e.g. `acquisition`, `theory`, `cost-aware`, `information-theoretic`).
- **`requires`** — prerequisite slugs, forming a DAG. List the concepts a reader must already
  hold, not every concept mentioned. [[map]] renders this graph.
- **`sources`** — citation keys from `references.md`. Derivation-primary first, then
  origin/secondary. Only keys whose material actually appears in the note.

## Notation discipline

[[notation]] is the **single source of truth** for symbols. A note does **not** restate it.
If a note introduces a symbol not in the canonical table, or deliberately overrides one, it
carries a short **Notation delta** block near the top — three or four lines at most:

> **Notation delta.** $\mu_n^{**} := \max_{i\le n}\mu_n(x_i)$ — best posterior mean *among
> evaluated points* (vs. $\mu_n^*$, the max over all $x$).

If a note needs no new symbols, it carries no delta block. Symbols used by three or more
notes should be **promoted into [[notation]]** rather than re-declared as deltas; flag such
promotions for the integration pass.

## Crosswalk tables

When a concept's derivation-primary source uses different notation, sign conventions, or
naming than a secondary source (or than [[notation]]), reconcile with a crosswalk table —
**not** a second derivation:

| This note (canonical) | `jones98` | `mockus1978` | Note |
|----|----|----|----|
| $f^*_n$ (best observed) | $f_{\min}$ (minimization) | — | sign flip; we maximize |
| $\Delta_n(x)=\mu_n(x)-f^*_n$ | $y_{\min}-\hat y(x)$ | — | margin, opposite sign |

The crosswalk is where a secondary source's contribution lives: attribution, an alternative
notation, a variant or proof the primary omits. It never repeats the core derivation.

## Voice

Concise, rigorous, derivation-driven; no fluff, minimal redundancy. **One idea per
paragraph.** Prefer a clean equation chain to prose narration of algebra. State assumptions
explicitly — surface a hidden assumption rather than inherit it. Where a source's derivation
is messier than necessary, construct the shorter path and relegate the original to a remark.

Each note should make its **cross-note connections** explicit (an *Interpretation* or
*Relation* section): "this is X specialized to Y", "this is the one-step case of Z". These
connections are a first-class deliverable, mirrored in [[map]].

## Markup

- **Math.** LaTeX in `$…$` (inline) and `$$…$$` (display). Use the symbols in [[notation]]
  verbatim — e.g. $\varphi$ for the standard-normal pdf, $\Phi$ for its cdf, $a^+=\max(a,0)$.
- **No custom macros.** There is no preamble/style file; notes are rendered by a stock
  KaTeX/MathJax pipeline, so `\newcommand` and source-specific shorthands (`\EI`, `\Normal`,
  `\R`, `\argmax`, `\xstar`, …) **do not exist** and render as raw text. Use stock primitives
  only: `\mathrm{EI}` / `\mathrm{KG}` / `\mathrm{ES}` / `\mathrm{Normal}`, `\mathbb{R}`,
  `\operatorname*{arg\,max}`, `x^*`. When lifting equations from a paper's LaTeX, expand its
  preamble macros to these primitives — do not paste `\EI`-style tokens.
- **Wikilinks.** Reference other notes inline as `[[slug]]` or `[[slug|display text]]`. Link
  liberally; a link to a not-yet-written note is acceptable (it marks intended structure).
- **Citations.** Cite sources by key inline, e.g. "(`frazier2018`)", and list them in
  `sources:`. Page/section pointers when they aid a reader chasing a detail.
- **Remarks.** Flag a hand-wave, a hidden assumption, or an error in a source with an
  explicit *Remark* — this is encouraged, not optional (see EI's treatment of the tutorial's
  compact closed form for the exemplar).

## Synthesis, not transcription (pointer)

The binding mandate lives in `wiki/build/source-routing.md`: find the cleanest/simplest
derivation, interrogate claims, make connections. This conventions file is downstream of it.
When form and synthesis conflict, synthesis wins — but both should rarely conflict.
