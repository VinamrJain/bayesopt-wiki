# Git workflow (local only)

This repo is **local git only** — no remote, no push. Use git to undo mistakes and keep a clear history while building the wiki.

## Habits

- **Commit often**, one logical change per commit (atomic).
- **Messages** (conventional-ish prefixes):
  - `wiki:` — concept notes, map, notation
  - `raw:` — LaTeX ingest, parsed markdown under `raw/`
  - `fix:` — corrections to existing tracked content
  - `chore:` — tooling, `.gitignore`, docs like this file

## Before you commit

```bash
git status              # staged vs unstaged vs untracked
git diff                # unstaged edits
git diff --staged       # what will go in the next commit
```

Stage selectively: `git add path/to/file` (avoid `git add -A` unless you mean everything).

## Undo mistakes

| Situation | Safe approach |
|-----------|----------------|
| Bad commit already made | `git log --oneline -20` → `git revert <commit>` (new commit that undoes; history preserved) |
| Uncommitted edits to a file you want to drop | `git checkout -- path/to/file` (or `git restore path/to/file`) — **only** for work not yet committed |
| Experiment gone wrong on `main` | Optional later: `git checkout -b experiment/...` before big changes |

**Avoid** unless the user explicitly asks: `git reset --hard`, force-push (N/A here — no remote).

## Branches

**`main` is fine** for day-to-day work. For risky refactors or throwaway tries: `git checkout -b feature/short-name`, merge or delete when done.

## What git tracks (see `.gitignore`)

| Tracked | Ignored |
|---------|---------|
| `raw/` LaTeX sources and `*.md` parses | `*.pdf`, `papers/` |
| `references.md`, `wiki/` (when present), project docs | `_archive/`, `_poc_parse/`, `_parse_eval/` |
| `fetch_arxiv_sources.py` | OS/editor junk, `.venv`, `__pycache__` |

Agents: do not commit secrets (`.env`); do not add remotes or push unless the user asks.
