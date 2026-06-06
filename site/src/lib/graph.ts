// Concept-graph data model, derived entirely from note frontmatter + body wikilinks.
//
// One source of truth (the wiki notes) feeds both graph placements:
//   - the global homepage hero graph (all nodes), and
//   - per-note local-neighborhood mini-graphs (1-hop in the prerequisite DAG).
// Both call buildGraph() once and slice it; the mini-graph is `localNeighborhood(graph, slug)`.
//
// Edge orientation matches wiki/map.md: an edge points prerequisite → dependent (read the source
// before the target). "Foundational-ness" (node size) is therefore how many notes DEPEND ON a
// concept — i.e. how many list it in their `requires` — not its own prerequisite count.

import type { CollectionEntry } from 'astro:content';
import { subtopicId, subtopicOf } from './subtopics';

export interface GraphNode {
  slug: string;
  title: string;
  summary: string;
  grade: string;
  subtopic: string; // subtopic id (color key)
  color: string;
  dependents: number; // # of notes that require this one → foundational-ness → node size
  requires: string[]; // prerequisite slugs (existing nodes only)
  tags: string[];
  sources: string[]; // citation keys; first = derivation-primary
  reviewed: string | null; // last review date, normalized to a string, or null
}

export interface GraphEdge {
  source: string; // prerequisite slug
  target: string; // dependent slug
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  bySlug: Map<string, GraphNode>;
  // slug → slugs of notes that link to it via a [[wikilink]] in their body (excludes self).
  backlinks: Map<string, string[]>;
}

// Mirrors the wikilink syntax in src/lib/wikilink.mjs.
const WIKILINK = /\[\[([^\]|]+?)(?:\|[^\]]+?)?\]\]/g;

function slugifyTarget(target: string): string {
  return target.split('#')[0].trim().toLowerCase().replace(/\s+/g, '-');
}

// `reviewed` may be a string, a YAML-parsed Date, or null. Normalize to a YYYY-MM-DD string (or null).
function normalizeReviewed(v: string | Date | null | undefined): string | null {
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return v;
}

/** Build the full concept graph from the `notes` collection. */
export function buildGraph(entries: CollectionEntry<'notes'>[]): Graph {
  // Stable read order so layout/coloring are deterministic across builds.
  const sorted = [...entries].sort((a, b) => a.data.slug.localeCompare(b.data.slug));
  const slugSet = new Set(sorted.map((e) => e.data.slug));

  // First pass: bare nodes (dependents filled in second pass).
  const bySlug = new Map<string, GraphNode>();
  for (const e of sorted) {
    const d = e.data;
    bySlug.set(d.slug, {
      slug: d.slug,
      title: d.title,
      summary: d.summary,
      grade: d.grade,
      subtopic: subtopicId(d.slug),
      color: subtopicOf(d.slug).color,
      dependents: 0,
      requires: (d.requires ?? []).filter((r) => slugSet.has(r)),
      tags: d.tags ?? [],
      sources: d.sources ?? [],
      reviewed: normalizeReviewed(d.reviewed),
    });
  }

  // Edges + dependents count. Only edges between existing notes (planned concepts have no node).
  const edges: GraphEdge[] = [];
  for (const node of bySlug.values()) {
    for (const prereq of node.requires) {
      edges.push({ source: prereq, target: node.slug });
      const p = bySlug.get(prereq);
      if (p) p.dependents += 1;
    }
  }

  // Backlinks from a body wikilink scan (existing targets only).
  const backlinks = new Map<string, string[]>();
  for (const slug of slugSet) backlinks.set(slug, []);
  for (const e of sorted) {
    const from = e.data.slug;
    const seen = new Set<string>();
    let m: RegExpExecArray | null;
    WIKILINK.lastIndex = 0;
    while ((m = WIKILINK.exec(e.body ?? '')) !== null) {
      const target = slugifyTarget(m[1]);
      if (target === from || seen.has(target) || !slugSet.has(target)) continue;
      seen.add(target);
      backlinks.get(target)!.push(from);
    }
  }
  for (const list of backlinks.values()) list.sort();

  return { nodes: [...bySlug.values()], edges, bySlug, backlinks };
}

// Slugs that exist as notes but are intentionally hidden from the visual graph. `notation` is the
// canonical symbol table (a reference note); it has no prerequisite edges, so it would otherwise
// float as an unconnected, unclickable orphan.
const GRAPH_HIDDEN = new Set<string>(['notation']);

/** The full graph minus nodes hidden from visualization, with their dangling edges pruned. */
export function visualGraph(graph: Graph): Graph {
  const nodes = graph.nodes.filter((n) => !GRAPH_HIDDEN.has(n.slug));
  const keep = new Set(nodes.map((n) => n.slug));
  const edges = graph.edges.filter((e) => keep.has(e.source) && keep.has(e.target));
  const bySlug = new Map(nodes.map((n) => [n.slug, n]));
  return { nodes, edges, bySlug, backlinks: graph.backlinks };
}

/** Notes that directly require `slug` (its dependents / "read-next" candidates). */
export function dependentsOf(graph: Graph, slug: string): string[] {
  return graph.edges.filter((e) => e.source === slug).map((e) => e.target).sort();
}

/**
 * 1-hop prerequisite-DAG neighborhood around `slug`: the focus node, its direct prerequisites, and
 * its direct dependents, with the induced edges. Used for the per-note mini-graph.
 */
export function localNeighborhood(graph: Graph, slug: string): Graph {
  const focus = graph.bySlug.get(slug);
  if (!focus) return { nodes: [], edges: [], bySlug: new Map(), backlinks: new Map() };

  const keep = new Set<string>([slug, ...focus.requires, ...dependentsOf(graph, slug)]);
  const nodes = graph.nodes.filter((n) => keep.has(n.slug));
  const edges = graph.edges.filter((e) => keep.has(e.source) && keep.has(e.target));
  const bySlug = new Map(nodes.map((n) => [n.slug, n]));
  return { nodes, edges, bySlug, backlinks: graph.backlinks };
}
