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
- **Frontmatter.** `title`, `slug`, `tags` (theme), `requires:` (prerequisite-slug DAG),
  `sources:` (citation keys). Inline `[[wikilinks]]`; `wiki/map.md` is the index + graph.
- **Voice.** Concise, rigorous, no fluff, minimal redundancy, derivation-driven. One idea per
  paragraph; clean equation chains over prose. Each note stands alone (notation.md + note = whole).
- **Detail.** Derivation-grade for core tiers; concept-grade stubs for peripheral topics; never
  derive content with no source — defer instead.

## Tooling
- `fetch_arxiv_sources.py <id> --name id:folder --out raw/` — scrape arXiv LaTeX into `raw/`.
  Needs network (arXiv may be sandbox-blocked; run with `!` if so).

## Ops
`MEMORY.md` — git habits, PDF parse order, env constraints (concise).

## Status
Design locked; build pending. Full design + implementation prompt:
`~/.claude/handoffs/Bayesian-Optimization-*-concept-wiki-design.md`.
