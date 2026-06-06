// Curated subtopic taxonomy — the color basis for the concept graph.
//
// A note's `tags` frontmatter is free-form theme description; it is NOT a clean partition. The
// *color* of a graph node instead comes from the five curated learning tracks in wiki/map.md, which
// DO partition the corpus into readable subtopics. A few notes legitimately belong to two tracks
// (e.g. expected-improvement is the foundations capstone and the first myopic acquisition); this
// table resolves each to a single primary subtopic so coloring is deterministic.
//
// Keep this in sync with wiki/map.md "Learning tracks" when notes are added.

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
];

const FALLBACK: Subtopic = { id: 'other', label: 'Other', color: '#8b949e' }; // grey

// slug → subtopic id. Derived from the map.md learning tracks; dual-track notes assigned their
// primary nature (e.g. EI → myopic, since it is fundamentally a myopic acquisition).
const SLUG_TO_SUBTOPIC: Record<string, string> = {
  // foundations
  'problem-setup': 'foundations',
  'gaussian-process-regression': 'foundations',
  'gp-hyperparameters': 'foundations',
  'acquisition-functions': 'foundations',
  'notation': 'foundations',
  // myopic & improvement-based
  'expected-improvement': 'myopic',
  'probability-of-improvement': 'myopic',
  'gp-ucb': 'myopic',
  'thompson-sampling-bo': 'myopic',
  // decision-theoretic & lookahead
  'value-of-information': 'decision-theoretic',
  'knowledge-gradient': 'decision-theoretic',
  'bo-as-dynamic-program': 'decision-theoretic',
  // information-theoretic
  'entropy-search': 'information-theoretic',
  'predictive-entropy-search': 'information-theoretic',
  'max-value-entropy-search': 'information-theoretic',
  // cost-aware
  'cost-aware-bo': 'cost-aware',
  'cost-models': 'cost-aware',
  'ei-per-unit-cost': 'cost-aware',
  'cost-cooling-carbo': 'cost-aware',
  'budget-constrained-dp': 'cost-aware',
  'multistep-budgeted-bo': 'cost-aware',
  'nonmyopic-cost-constrained-bo': 'cost-aware',
  'pandoras-box-gittins-index': 'cost-aware',
  'cost-aware-stopping': 'cost-aware',
};

const BY_ID = new Map(SUBTOPICS.map((s) => [s.id, s]));

export function subtopicOf(slug: string): Subtopic {
  const id = SLUG_TO_SUBTOPIC[slug];
  return (id && BY_ID.get(id)) || FALLBACK;
}

export function subtopicId(slug: string): string {
  return SLUG_TO_SUBTOPIC[slug] ?? FALLBACK.id;
}

export const SUBTOPICS_WITH_FALLBACK: Subtopic[] = [...SUBTOPICS, FALLBACK];
