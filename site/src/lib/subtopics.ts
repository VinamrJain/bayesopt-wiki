// Curated subtopic taxonomy — the color basis for the concept graph.
//
// A note's `tags` frontmatter is free-form theme description, not a clean partition. The *color* of a
// graph node comes instead from its `subtopic` frontmatter field (validated against the ids below),
// so each note self-declares its color. This file owns only the palette + labels; the slug→subtopic
// assignment lives in the notes. Keep these ids in sync with the `subtopic` enum in content.config.ts
// and the learning tracks in wiki/map.md.

export interface Subtopic {
  id: string;
  label: string;
  color: string; // tuned for a dark background; also legible on light
}

// Ordered: roughly the reading order foundations → acquisitions → cost-aware.
export const SUBTOPICS: Subtopic[] = [
  { id: 'foundations', label: 'Foundations', color: '#4c9be8' }, // blue
  { id: 'myopic', label: 'Myopic & improvement-based', color: '#3fb950' }, // green
  { id: 'decision-theoretic', label: 'Decision-theoretic & lookahead', color: '#bc8cff' }, // purple
  { id: 'information-theoretic', label: 'Information-theoretic', color: '#e3a008' }, // amber
  { id: 'cost-aware', label: 'Cost-aware', color: '#f87171' }, // red
  { id: 'theory', label: 'Regret theory & convergence', color: '#2dd4bf' }, // teal
];

const FALLBACK: Subtopic = { id: 'other', label: 'Other', color: '#8b949e' }; // grey

const BY_ID = new Map(SUBTOPICS.map((s) => [s.id, s]));

/** Resolve a subtopic id (from a note's frontmatter) to its palette entry; FALLBACK if unknown. */
export function subtopicById(id: string | undefined): Subtopic {
  return (id && BY_ID.get(id)) || FALLBACK;
}

export const SUBTOPICS_WITH_FALLBACK: Subtopic[] = [...SUBTOPICS, FALLBACK];
