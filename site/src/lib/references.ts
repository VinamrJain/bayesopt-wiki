// Bibliography loader. Parses the repo-root references.md markdown table at build time so the site's
// /references page and the per-note source links stay in sync with the single bibliography (no
// duplicated citation data to drift).
//
// references.md schema (one row per citation key):
//   | Key | Topic | Authors | Title | Venue | Source | Summary | Links |
// The Links cell holds markdown links separated by " · ", e.g. "[PDF](url) · [DOI](url)".

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface RefLink {
  label: string;
  url: string;
}
export interface Reference {
  key: string;
  topic: string;
  authors: string;
  title: string;
  venue: string;
  summary: string;
  links: RefLink[];
}

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function parseLinks(cell: string): RefLink[] {
  const links: RefLink[] = [];
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(cell)) !== null) links.push({ label: m[1].trim(), url: m[2].trim() });
  return links;
}

// Split a markdown table row into trimmed cells (drops the leading/trailing empty edges).
function cells(row: string): string[] {
  return row
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}

let cache: Reference[] | null = null;

export function loadReferences(): Reference[] {
  if (cache) return cache;
  const path = fileURLToPath(new URL('../../../references.md', import.meta.url));
  const text = readFileSync(path, 'utf8');

  const refs: Reference[] = [];
  for (const line of text.split('\n')) {
    if (!line.trimStart().startsWith('|')) continue;
    const c = cells(line);
    if (c.length < 8) continue;
    const rawKey = c[0];
    // Skip the header row and the |---|---| separator row.
    if (rawKey === 'Key' || /^-+$/.test(rawKey.replace(/[:\s]/g, ''))) continue;
    const key = rawKey.replace(/`/g, '');
    if (!key) continue;
    refs.push({
      key,
      topic: c[1],
      authors: c[2],
      title: c[3],
      venue: c[4],
      summary: c[6],
      links: parseLinks(c[7]),
    });
  }
  cache = refs;
  return refs;
}

export function referenceMap(): Map<string, Reference> {
  return new Map(loadReferences().map((r) => [r.key, r]));
}
