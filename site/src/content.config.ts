// Astro 5 content-layer collection over the wiki notes.
//
// The wiki lives OUTSIDE this Astro project (`../wiki`), so we use the content-layer `glob()` loader
// with an explicit `base`. Each note is one concept; its frontmatter is the structured source of
// truth that also drives the concept graph (see src/lib/graph.ts) and the build_index.py registry.
//
// Exclusions:
//   - map.md          → index page, lacks grade/reviewed → would break the schema.
//   - CONVENTIONS.md  → its frontmatter is a stray copy of another note's (a content bug), not a note.
//   notation.md IS a real note (grade: reference) and stays in.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({
    base: '../wiki',
    pattern: ['**/*.md', '!map.md', '!CONVENTIONS.md'],
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    // Theme tags (free-form). Curated subtopic for graph color is derived separately (subtopics.ts).
    tags: z.array(z.string()).default([]),
    // Prerequisite slugs → directed edges of the concept DAG.
    requires: z.array(z.string()).default([]),
    // Citation keys; first = derivation-primary. Linked to references.md.
    sources: z.array(z.string()).default([]),
    // Coverage grade. `stub` kept for forward-compat though none exist today.
    grade: z.enum(['derivation', 'concept', 'reference', 'stub']),
    // Last critical-review date, or null if never reviewed (all null today). Accept a Date too in
    // case YAML auto-parses an unquoted date.
    reviewed: z.union([z.string(), z.date(), z.null()]).default(null),
  }),
});

export const collections = { notes };
