# Bayesian Optimization — concept-wiki site

An [Astro](https://astro.build) static site that publishes the Bayesian-Optimization concept-wiki as
an interactive, navigable reference: an interactive D3 force-directed graph of the prerequisite DAG,
KaTeX-rendered notes, curated learning tracks, and a bibliography.

The notes in [`../wiki`](../wiki) are the single source of truth. This site **reads** their markdown,
frontmatter, and `[[wikilinks]]` at build time and never writes back to them — content lives in the
wiki; presentation lives here.

## Quickstart

The toolchain is a project-local Node 22 pinned with [pixi](https://pixi.sh) (no system Node needed):

```sh
pixi run install   # install npm dependencies under the pinned Node
pixi run dev       # dev server with hot reload  → http://localhost:4321
pixi run build     # static build + search index → dist/
pixi run preview   # serve the production build locally
```

Plain npm works too if you already have Node 22 (`npm install && npm run dev`).

## How it works

- **Content collection** — an Astro content-layer glob over `../wiki/*.md` (excludes `map.md` and
  `CONVENTIONS.md`). Each note's 8-field frontmatter is validated by a Zod schema in
  `src/content.config.ts`.
- **Graph model** (`src/lib/graph.ts`) — nodes, prerequisite edges, dependents, and backlinks are
  derived from frontmatter `requires:` and body wikilinks. Node **size** = how many notes depend on a
  concept; **color** = its subtopic (`src/lib/subtopics.ts`). Edges point prerequisite → dependent.
- **Rendering** — `remark-math` + `rehype-katex` render LaTeX; a small remark plugin
  (`src/lib/wikilink.mjs`) rewrites `[[slug|alias]]` into base-aware links.
- **References** — `/references` is parsed at build from the repo-root `../references.md` table, so the
  bibliography never drifts from its source.
- **Search** — the production `build` chains [Pagefind](https://pagefind.app) to produce a static,
  client-side search index.

## Project layout

```
src/
  pages/        index, graph, references, notes/[slug], tracks/index, tracks/[track]
  layouts/      BaseLayout, NoteLayout
  components/   ConceptGraph (graph island), Sidebar
  lib/          graph.ts, subtopics.ts, tracks.ts, references.ts,
                concept-graph-client.ts (D3 force graph), wikilink.mjs
  styles/       global.css
  content.config.ts   content collection + frontmatter schema
astro.config.mjs      markdown pipeline, site/base URLs
pixi.toml             pinned Node toolchain + task wrappers
```

## Deployment

The site builds to a static `dist/` and is designed for GitHub Pages. The `site` and `base` URLs in
`astro.config.mjs` are environment-overridable for a non-root project page:

```sh
SITE_URL=https://<user>.github.io BASE_PATH=/<repo>/ pixi run build
```
