# MEMORY

Project ops and in-progress work. Wiki design: `~/.claude/handoffs/Bayesian-Optimization-2026-06-03-153421-concept-wiki-design.md`.

## Doc roles

| File | Audience | Content |
|------|----------|---------|
| `references.md` | Anyone | Bibliography: keys, authors, links, one-paragraph contribution. **No** agent tiers, parse status, or session jargon. |
| `MEMORY.md` | Agents | Workflow, constraints, git rules. |
| `CLAUDE.md` | Agents | Repo conventions. |

Writing style: same bar as `~/.claude/memory/feedback_skill-writing-generic.md` (no conversation-specific labels) and concept-wiki pattern in `~/.claude/memory/reference_concept-wiki-synthesis.md` — public docs stay readable cold by a third party.

## Git (local only)

No remote. Atomic commits; prefixes `wiki:` `raw:` `fix:` `chore:`. Undo with `git revert`, not `reset --hard`. Stage paths explicitly. No secrets (`.env`); no remotes/push unless asked.

Tracks: `raw/**/*.tex`, `raw/**/*.bib`, trustworthy `raw/**/*.md`; plus `references.md`, `wiki/`. Ignores figures, styles, scripts, data, PDFs — see `.gitignore`. `git rm --cached` does **not** delete files on disk.

## Sources

Truth: `raw/` — LaTeX via `scripts/fetch_arxiv_sources.py`, or `raw/<key>/<key>.md` for pdf-derived papers (YAML: `source_type: pdf-derived`, `parser: mathpix`).

Local PDFs under `raw/<key>/` are gitignored; commit only good `.md`.
