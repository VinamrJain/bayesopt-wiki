# MEMORY

Project ops and in-progress work. Wiki design: `~/.claude/handoffs/Bayesian-Optimization-2026-06-03-153421-concept-wiki-design.md`.

## Doc roles

| File | Audience | Content |
|------|----------|---------|
| `references.md` | Anyone | Bibliography: keys, authors, links, one-paragraph contribution. **No** agent tiers, parse status, or session jargon. |
| `MEMORY.md` | Agents | Workflow, constraints, **parse queue**, git rules. |
| `CLAUDE.md` | Agents | Repo conventions. |

Writing style: same bar as `~/.claude/memory/feedback_skill-writing-generic.md` (no conversation-specific labels) and concept-wiki pattern in `~/.claude/memory/reference_concept-wiki-synthesis.md` — public docs stay readable cold by a third party.

## Git (local only)

No remote. Atomic commits; prefixes `wiki:` `raw:` `fix:` `chore:`. Undo with `git revert`, not `reset --hard`. Stage paths explicitly. No secrets (`.env`); no remotes/push unless asked.

Tracks: `raw/**/*.tex`, `raw/**/*.bib`, trustworthy `raw/**/*.md`; plus `references.md`, `wiki/`. Ignores figures, styles, scripts, data, PDFs — see `.gitignore`. `git rm --cached` does **not** delete files on disk.

## Sources

Truth: `raw/` — LaTeX via `fetch_arxiv_sources.py`, else `raw/<key>/<key>.md` from PDF (YAML: `source_type: pdf-derived`, `parser: mathpix|marker-pdf`).

Parse order: (1) LaTeX fetch (2) **Mathpix** for theory/proofs (3) marker-pdf fallback (4) Read PDF for spot-check. **Never pymupdf4llm.**

Mathpix: keys in `.env`. Ask before `.venv` / pip. PDFs gitignored under `raw/<key>/`; commit only good `.md`.

`papers/` removed; all PDFs under `raw/<key>/`.

## Parse queue

Target path: `raw/<key>/<key>.md`. Update this table when done; do not mirror status in `references.md`.

| Priority | Key | Input | Parser | Notes |
|----------|-----|-------|--------|-------|
| 1 | srinivas2010 | PDF | Mathpix | Regret / GP-UCB theory |
| 1 | bull2011 | PDF | Mathpix | Convergence rates |
| 2 | shahriari2016 | PDF | Mathpix or defer | Survey; lower math density |
| 2 | frazier2009kg | PDF | Mathpix | KG correlated beliefs |
| 3 | lam2016 | PDF | Mathpix | Finite-budget DP rollout |

LaTeX-only keys need no PDF parse. `jones98` is PDF reference only (EGO origin); parse optional.

## Constraints

No `pip install` in base/miniforge without approval. No full marker runs on MacBook; Mathpix preferred for theory PDFs.
