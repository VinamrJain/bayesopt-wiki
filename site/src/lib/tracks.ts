// Curated learning tracks — guided reading orders, transcribed from wiki/map.md "Learning tracks".
//
// These are the pedagogical backbone: ordered paths through the concept DAG by subtopic. The track
// pages render the ordered notes and highlight the track's subpath on the graph. Each track id
// matches a subtopic id in subtopics.ts where they correspond, so colors line up.
//
// Keep in sync with wiki/map.md when tracks change.

export interface Track {
  id: string;
  label: string;
  description: string;
  slugs: string[]; // reading order
}

export const TRACKS: Track[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    description: 'The problem BO solves, the GP surrogate underneath it, and the acquisition idea.',
    slugs: [
      'problem-setup',
      'gaussian-process-regression',
      'gp-hyperparameters',
      'acquisition-functions',
      'expected-improvement',
    ],
  },
  {
    id: 'myopic',
    label: 'Myopic & improvement-based acquisitions',
    description: 'The one-step acquisition functions, anchored on expected improvement.',
    slugs: ['expected-improvement', 'probability-of-improvement', 'gp-ucb', 'thompson-sampling-bo'],
  },
  {
    id: 'decision-theoretic',
    label: 'Decision-theoretic & lookahead',
    description: 'Acquisitions as value of information, and BO as a sequential decision process.',
    slugs: ['value-of-information', 'knowledge-gradient', 'bo-as-dynamic-program'],
  },
  {
    id: 'information-theoretic',
    label: 'Information-theoretic acquisitions',
    description: 'Sampling to reduce entropy of the optimizer location or its value.',
    slugs: ['entropy-search', 'predictive-entropy-search', 'max-value-entropy-search'],
  },
  {
    id: 'cost-aware',
    label: 'Cost-aware BO',
    description:
      'Budgeting real evaluation cost: per-cost acquisitions, budgeted lookahead, and stopping.',
    slugs: [
      'cost-aware-bo',
      'cost-models',
      'ei-per-unit-cost',
      'cost-cooling-carbo',
      'budget-constrained-dp',
      'multistep-budgeted-bo',
      'nonmyopic-cost-constrained-bo',
      'pandoras-box-gittins-index',
      'cost-aware-stopping',
    ],
  },
];

export const trackById = (id: string): Track | undefined => TRACKS.find((t) => t.id === id);
