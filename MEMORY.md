# MEMORY

Project ops and in-progress work. Wiki design: `~/.claude/handoffs/Bayesian-Optimization-2026-06-03-153421-concept-wiki-design.md`.

## Doc roles

| File | Audience | Content |
|------|----------|---------|
| `references.md` | Anyone | Bibliography: keys, authors, links, one-paragraph contribution. **No** agent tiers, parse status, or session jargon. |
| `MEMORY.md` | Agents | Workflow, constraints, source inventory. |
| `CLAUDE.md` | Agents | Repo conventions. |

Writing style: same bar as `~/.claude/memory/feedback_skill-writing-generic.md` (no conversation-specific labels) and concept-wiki pattern in `~/.claude/memory/reference_concept-wiki-synthesis.md` — public docs stay readable cold by a third party.

## Git (local only)

No remote. Atomic commits; prefixes `wiki:` `raw:` `fix:` `chore:`. Undo with `git revert`, not `reset --hard`. Stage paths explicitly. No secrets (`.env`); no remotes/push unless asked.

Tracks: `raw/**/*.tex`, `raw/**/*.bib`, trustworthy `raw/**/*.md`; plus `references.md`, `wiki/`. Ignores figures, styles, scripts, data, PDFs — see `.gitignore`. `git rm --cached` does **not** delete files on disk.

## Sources

Truth: `raw/` — LaTeX via `scripts/fetch_arxiv_sources.py`, else `raw/<key>/<key>.md` from PDF (YAML: `source_type: pdf-derived`, `parser: mathpix`).

PDF → md: Mathpix (Snip or Convert API). **Never pymupdf4llm.** Spot-check key theorems against PDF before committing `.md`. PDFs gitignored under `raw/<key>/`; commit only good `.md`.

`papers/` removed; local PDFs live under `raw/<key>/`.

### PDF-derived (`raw/<key>/<key>.md`)

| Key | Notes |
|-----|-------|
| srinivas2010 | GP-UCB regret |
| bull2011 | EGO convergence rates |
| shahriari2016 | Survey |
| frazier2009kg | Correlated KG |
| lam2016 | Finite-budget DP rollout |

**Optional:** `jones98` — local PDF only (`raw/jones98/jones98.pdf`); no `.md` yet.

## Constraints

No `pip install` in base/miniforge without approval. Ask before project `.venv`. No full marker runs on MacBook.
