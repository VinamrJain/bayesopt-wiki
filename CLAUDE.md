# Bayesian Optimization — concept-wiki

A concept-deduplicated math wiki for Bayesian optimization: `wiki/` holds self-contained,
rigorous LaTeX-in-markdown notes (one concept each) forming a navigable mind-map for humans
and LLM agents. Pattern: cross-project memory `concept-wiki-synthesis`.

## Sources of truth
- **`raw/`** — paper LaTeX sources. The ONLY content source. Derive notes from these.
- **`papers/`** — removed; PDFs live in `raw/<citation_key>/` (gitignored binaries).
- **`_archive/`** — superseded LLM-generated drafts (`EI*.md`). NOT sources; not authoritative
  voice. Do not anchor content or style on them.
- `references.md` — bibliography (citation keys, contributions, links). `MEMORY.md` — agent workflow & parse queue.

## Conventions (when building/editing the wiki)
- **Concept-based, not paper-based.** Same concept across papers → one note; reconcile differing
  notation via a per-note **crosswalk table**, not duplicate notes.
- **Notation.** `wiki/notation.md` is the canonical symbol table; notes carry only a short delta
  header, never the full block.
- **Filenames.** kebab-case concept slugs, flat in `wiki/`. No number prefixes.
- **Frontmatter.** `title`, `slug`, `summary` (one-line, feeds the index), `tags` (theme),
  `requires:` (prerequisite-slug DAG), `sources:` (citation keys; first = derivation-primary),
  `grade` (derivation | concept), `reviewed` (date | null; stamped by the reflection pass). Inline
  `[[wikilinks]]`; `wiki/map.md` is the index + graph.
- **Review state.** Per-note review logs live at `wiki/reviews/<slug>.md` (written by the reflection
  pass); `wiki/gaps.md` is the generated open-gaps board derived from them. Both are absent until the
  first reflection pass runs.
- **Voice.** Concise, rigorous, no fluff, minimal redundancy, derivation-driven. One idea per
  paragraph; clean equation chains over prose. Each note stands alone (notation.md + note = whole).
- **Detail.** Derivation-grade for core tiers; concept-grade stubs for peripheral topics; never
  derive content with no source — defer instead.

## Tooling
- `scripts/fetch_arxiv_sources.py <id> --name id:folder --out raw/` — scrape arXiv LaTeX into `raw/`.
  Needs network (arXiv may be sandbox-blocked; run with `!` if so).
- `scripts/build_index.py` — regenerate `wiki/map.md` autogen regions (concept registry + prereq
  graph) and `wiki/gaps.md` (open-gaps board, aggregated from `wiki/reviews/`), and lint
  cross-refs. `--check` verifies both are current without writing. The pre-commit hook runs it on
  any `wiki/` or `references.md` commit.

## Site (`site/`)
Interactive Astro static site that publishes the wiki: a D3 force-directed prerequisite graph,
KaTeX-rendered note pages, learning tracks, and a bibliography. `wiki/*.md` stays the single source
of truth — the site reads frontmatter + `[[wikilinks]]` at build, never writes notes. Run with
`cd site && pixi run dev` (pixi-pinned Node 22; `pixi run build` chains Pagefind search). See
`site/README.md` for architecture and the GitHub Pages deploy. The `notation` note is intentionally
hidden from the visual graph (a reference note with no prereq edges) via `visualGraph()` in
`site/src/lib/graph.ts`.

## Ops
`MEMORY.md` — git habits, PDF parse order, env constraints (concise).

## Status
Wiki built (24 notes, reflection logs + gaps board generated). Interactive site built and committed
under `site/`; Pagefind search and GitHub Pages deploy are the remaining site work. Original design +
implementation prompt: `~/.claude/handoffs/Bayesian-Optimization-*-concept-wiki-design.md`.
