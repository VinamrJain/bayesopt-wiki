// Client-side renderer for the concept graph (vanilla TS + modular d3, no framework).
//
// One module drives every graph instance on a page: it scans for `[data-concept-graph]` containers,
// reads the JSON config embedded by ConceptGraph.astro, and builds a force-directed layout with
// directed arrowheads, hover-highlight-neighbors, click-to-navigate, and (for the hero) subtopic /
// grade filters + search-to-highlight.
//
// LAYOUT IS ISOLATED in `runForceLayout()` so a future Sugiyama/layered-DAG toggle can be added as
// a sibling strategy without touching rendering or interaction code.

import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
} from 'd3-force';
import { select, type Selection } from 'd3-selection';
import { drag } from 'd3-drag';
import { zoom, zoomIdentity } from 'd3-zoom';
import { scaleSqrt } from 'd3-scale';

interface RawNode {
  slug: string;
  title: string;
  summary: string;
  subtopic: string;
  color: string;
  dependents: number;
}
interface RawEdge {
  source: string;
  target: string;
}
interface Subtopic {
  id: string;
  label: string;
  color: string;
}
interface Config {
  nodes: RawNode[];
  edges: RawEdge[];
  subtopics: Subtopic[];
  focusSlug: string | null;
  controls: boolean;
  height: number;
}

// d3-force mutates nodes with x/y/vx/vy; links get source/target rebound to node objects.
type SimNode = RawNode & { x?: number; y?: number; fx?: number | null; fy?: number | null };
type SimLink = { source: SimNode | string; target: SimNode | string };

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const noteHref = (slug: string) => `${BASE}/notes/${slug}`;

export function initConceptGraphs(): void {
  const containers = document.querySelectorAll<HTMLElement>('[data-concept-graph]');
  containers.forEach((el) => {
    const json = el.querySelector<HTMLScriptElement>('script.cg-config')?.textContent;
    if (!json) return;
    try {
      renderGraph(el, JSON.parse(json) as Config);
    } catch (err) {
      console.error('[concept-graph] failed to render', err);
    }
  });
}

/** Force-layout strategy. Swap-point for a future layered/Sugiyama layout. */
function runForceLayout(
  nodes: SimNode[],
  links: SimLink[],
  width: number,
  height: number,
  focusSlug: string | null,
): Simulation<SimNode, undefined> {
  const sim = forceSimulation<SimNode>(nodes)
    .force(
      'link',
      forceLink<SimNode, SimLink>(links)
        .id((d) => (d as SimNode).slug)
        .distance(focusSlug ? 70 : 90)
        .strength(0.45),
    )
    .force('charge', forceManyBody().strength(focusSlug ? -240 : -520))
    .force('center', forceCenter(width / 2, height / 2))
    .force('collide', forceCollide<SimNode>().radius((d) => radius(d) + 6))
    .force('x', forceX(width / 2).strength(0.04))
    .force('y', forceY(height / 2).strength(0.06));

  // Pin the focus node (mini-graph) at center for a stable local view.
  if (focusSlug) {
    const f = nodes.find((n) => n.slug === focusSlug);
    if (f) {
      f.fx = width / 2;
      f.fy = height / 2;
    }
  }
  return sim;
}

// Declutter: in the full graph, persistently label only the foundational hub nodes (those at least
// this many notes depend on); every other label appears on hover. Tune this cutoff to taste. Mini-
// graphs (focusSlug set) are small, so they always show all labels.
const LABEL_HUB_MIN_DEPENDENTS = 4;

let radiusScale: (n: number) => number = () => 8;
function radius(d: RawNode): number {
  return radiusScale(d.dependents);
}

function renderGraph(root: HTMLElement, cfg: Config): void {
  const focusSlug = cfg.focusSlug;
  const width = root.clientWidth || 800;
  const height = cfg.height;

  const maxDep = Math.max(1, ...cfg.nodes.map((n) => n.dependents));
  radiusScale = scaleSqrt()
    .domain([0, maxDep])
    .range(focusSlug ? [6, 16] : [7, 26]) as unknown as (n: number) => number;

  const nodes: SimNode[] = cfg.nodes.map((n) => ({ ...n }));
  const links: SimLink[] = cfg.edges.map((e) => ({ source: e.source, target: e.target }));

  // Adjacency for hover-highlight-neighbors.
  const neighbors = new Map<string, Set<string>>();
  cfg.nodes.forEach((n) => neighbors.set(n.slug, new Set([n.slug])));
  cfg.edges.forEach((e) => {
    neighbors.get(e.source)?.add(e.target);
    neighbors.get(e.target)?.add(e.source);
  });

  const svg = select(root)
    .append('svg')
    .attr('class', 'cg-svg')
    .attr('width', '100%')
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'Concept prerequisite graph');

  // Arrowhead marker (prerequisite → dependent).
  const defs = svg.append('defs');
  defs
    .append('marker')
    .attr('id', `cg-arrow-${uid()}`)
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 9)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-4L9,0L0,4')
    .attr('class', 'cg-arrowhead');
  const markerId = defs.select('marker').attr('id');

  // Zoomable viewport group.
  const viewport = svg.append('g').attr('class', 'cg-viewport');
  const zoomBehavior = zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.3, 4])
    .on('zoom', (ev) => viewport.attr('transform', ev.transform.toString()));
  svg.call(zoomBehavior as any);

  const linkSel = viewport
    .append('g')
    .attr('class', 'cg-links')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('class', 'cg-link')
    .attr('marker-end', `url(#${markerId})`);

  const nodeG = viewport
    .append('g')
    .attr('class', 'cg-nodes')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .attr('class', 'cg-node')
    .classed('cg-focus', (d) => d.slug === focusSlug)
    .style('cursor', 'pointer')
    .on('click', (_e, d) => {
      window.location.href = noteHref(d.slug);
    });

  nodeG
    .append('circle')
    .attr('r', (d) => radius(d))
    .attr('fill', (d) => d.color)
    .attr('class', 'cg-circle');

  // Hubs (or every node in a mini-graph) keep a persistent label; the rest reveal theirs on hover.
  const isHub = (d: RawNode) => !!focusSlug || d.dependents >= LABEL_HUB_MIN_DEPENDENTS;
  nodeG.classed('cg-hub', (d) => isHub(d));
  nodeG
    .append('text')
    .attr('class', 'cg-label')
    .attr('x', (d) => radius(d) + 4)
    .attr('y', 4)
    .text((d) => d.title);

  // Tooltip (one per page is fine; reuse a singleton).
  const tip = getTooltip();

  nodeG
    .on('mouseenter', (ev, d) => {
      const nbrs = neighbors.get(d.slug) ?? new Set([d.slug]);
      highlight(nbrs);
      tip.innerHTML = `<strong>${escapeHtml(d.title)}</strong><span>${escapeHtml(d.summary)}</span>`;
      tip.style.opacity = '1';
      moveTip(tip, ev as MouseEvent);
    })
    .on('mousemove', (ev) => moveTip(tip, ev as MouseEvent))
    .on('mouseleave', () => {
      clearHighlight();
      tip.style.opacity = '0';
    });

  function highlight(active: Set<string>) {
    nodeG.classed('cg-dim', (d) => !active.has(d.slug));
    // Reveal labels for the hovered neighborhood (even non-hub nodes).
    nodeG.classed('cg-label-show', (d) => active.has(d.slug));
    linkSel.classed('cg-dim', (l) => {
      const s = (l.source as SimNode).slug ?? (l.source as string);
      const t = (l.target as SimNode).slug ?? (l.target as string);
      return !(active.has(s) && active.has(t));
    });
  }
  function clearHighlight() {
    nodeG.classed('cg-dim', false);
    nodeG.classed('cg-label-show', false);
    linkSel.classed('cg-dim', false);
  }

  // Drag.
  nodeG.call(
    drag<SVGGElement, SimNode>()
      .on('start', (ev, d) => {
        if (!ev.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (ev, d) => {
        d.fx = ev.x;
        d.fy = ev.y;
      })
      .on('end', (ev, d) => {
        if (!ev.active) sim.alphaTarget(0);
        // keep focus node pinned; release others
        if (d.slug !== focusSlug) {
          d.fx = null;
          d.fy = null;
        }
      }) as any,
  );

  const sim = runForceLayout(nodes, links, width, height, focusSlug);
  sim.on('tick', () => {
    // Shorten links to the target node boundary so the arrowhead sits at the rim.
    linkSel
      .attr('x1', (l) => (l.source as SimNode).x ?? 0)
      .attr('y1', (l) => (l.source as SimNode).y ?? 0)
      .attr('x2', (l) => endpoint(l, 'x'))
      .attr('y2', (l) => endpoint(l, 'y'));
    nodeG.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
  });

  function endpoint(l: SimLink, axis: 'x' | 'y'): number {
    const s = l.source as SimNode;
    const t = l.target as SimNode;
    const dx = (t.x ?? 0) - (s.x ?? 0);
    const dy = (t.y ?? 0) - (s.y ?? 0);
    const dist = Math.hypot(dx, dy) || 1;
    const gap = radius(t) + 7; // node radius + arrow length
    const ratio = Math.max(0, (dist - gap) / dist);
    return axis === 'x' ? (s.x ?? 0) + dx * ratio : (s.y ?? 0) + dy * ratio;
  }

  if (cfg.controls) buildControls(root, svg, nodeG, linkSel, cfg, neighbors, zoomBehavior);
}

// ── Controls: subtopic legend toggle + search-to-highlight ────────────────────────────────────
function buildControls(
  root: HTMLElement,
  svg: Selection<SVGSVGElement, unknown, null, undefined>,
  nodeG: Selection<SVGGElement, SimNode, SVGGElement, unknown>,
  linkSel: Selection<SVGLineElement, SimLink, SVGGElement, unknown>,
  cfg: Config,
  _neighbors: Map<string, Set<string>>,
  zoomBehavior: any,
): void {
  const panel = document.createElement('div');
  panel.className = 'cg-controls';

  // Search.
  const search = document.createElement('input');
  search.type = 'search';
  search.placeholder = 'Search concepts…';
  search.className = 'cg-search';
  search.setAttribute('aria-label', 'Search concepts');
  panel.appendChild(search);

  // Subtopic legend (click to toggle).
  const activeSubtopics = new Set(cfg.subtopics.map((s) => s.id));

  const legend = document.createElement('div');
  legend.className = 'cg-legend';
  cfg.subtopics.forEach((s) => {
    const present = cfg.nodes.some((n) => n.subtopic === s.id);
    if (!present) return;
    const chip = document.createElement('button');
    chip.className = 'cg-chip';
    chip.dataset.subtopic = s.id;
    chip.innerHTML = `<span class="cg-swatch" style="background:${s.color}"></span>${escapeHtml(s.label)}`;
    chip.addEventListener('click', () => {
      if (activeSubtopics.has(s.id)) {
        activeSubtopics.delete(s.id);
        chip.classList.add('cg-off');
      } else {
        activeSubtopics.add(s.id);
        chip.classList.remove('cg-off');
      }
      applyFilter();
    });
    legend.appendChild(chip);
  });
  panel.appendChild(legend);

  // Reset zoom.
  const reset = document.createElement('button');
  reset.className = 'cg-reset';
  reset.textContent = 'Reset view';
  reset.addEventListener('click', () => {
    svg.transition().duration(400).call(zoomBehavior.transform, zoomIdentity);
  });
  panel.appendChild(reset);

  root.insertBefore(panel, root.firstChild);

  function visible(d: SimNode): boolean {
    return activeSubtopics.has(d.subtopic);
  }
  function applyFilter() {
    nodeG.style('display', (d) => (visible(d) ? null : 'none'));
    linkSel.style('display', (l) => {
      const s = l.source as SimNode;
      const t = l.target as SimNode;
      return visible(s) && visible(t) ? null : 'none';
    });
    runSearch();
  }
  function runSearch() {
    const q = search.value.trim().toLowerCase();
    if (!q) {
      nodeG.classed('cg-match', false).classed('cg-nomatch', false);
      return;
    }
    nodeG
      .classed('cg-match', (d) => visible(d) && d.title.toLowerCase().includes(q))
      .classed('cg-nomatch', (d) => !(visible(d) && d.title.toLowerCase().includes(q)));
  }
  search.addEventListener('input', runSearch);
}

// ── helpers ───────────────────────────────────────────────────────────────────────────────────
let _uid = 0;
function uid(): string {
  return String(_uid++);
}

let _tip: HTMLDivElement | null = null;
function getTooltip(): HTMLDivElement {
  if (_tip) return _tip;
  const d = document.createElement('div');
  d.className = 'cg-tooltip';
  d.style.opacity = '0';
  document.body.appendChild(d);
  _tip = d;
  return d;
}
function moveTip(tip: HTMLDivElement, ev: MouseEvent): void {
  const pad = 14;
  let x = ev.clientX + pad;
  let y = ev.clientY + pad;
  const r = tip.getBoundingClientRect();
  if (x + r.width > window.innerWidth) x = ev.clientX - r.width - pad;
  if (y + r.height > window.innerHeight) y = ev.clientY - r.height - pad;
  tip.style.left = `${x}px`;
  tip.style.top = `${y}px`;
}
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!;
  });
}
