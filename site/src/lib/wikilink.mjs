// Remark plugin: rewrite `[[slug]]` / `[[slug|alias]]` wikilinks into real links.
//
// The wiki notes are authored in renderer-agnostic markdown where cross-references are
// `[[concept-slug]]` or `[[concept-slug|display text]]`. Those are not markdown syntax, so they
// survive parsing as literal text inside mdast `text` nodes. This plugin
// walks every text node, splits it on the wikilink pattern, and replaces each match with a proper
// `link` node pointing at `/notes/<slug>` (base-path aware, to match astro.config's `base`).
//
// remark-math runs *before* this in the plugin array, so `$...$` is already a `math` node and its
// contents are never exposed to the regex below.

import { visit } from 'unist-util-visit';

// `[[ target ]]` or `[[ target | display text ]]`. Target may contain a `#anchor`.
const WIKILINK = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

// Mirror astro.config.mjs: BASE_PATH defaults to '/'. Normalize to exactly one trailing slash so
// `${base}notes/${slug}` is always well-formed regardless of how the env var is written.
function basePath() {
  const raw = process.env.BASE_PATH || '/';
  return raw.endsWith('/') ? raw : raw + '/';
}

// Canonicalize a wikilink target to a note slug: lowercase, trim, kebab spaces. Notes are already
// kebab-case slugs, but this tolerates `[[Expected Improvement]]`-style authoring too. An optional
// `#anchor` is preserved and appended to the href, not slugified.
function targetToHref(target) {
  const [rawSlug, anchor] = target.split('#');
  const slug = rawSlug.trim().toLowerCase().replace(/\s+/g, '-');
  const hash = anchor ? `#${anchor.trim()}` : '';
  return `${basePath()}notes/${slug}${hash}`;
}

export function remarkWikilink() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === null) return;
      const value = node.value;
      if (!value.includes('[[')) return;

      const children = [];
      let lastIndex = 0;
      let match;
      WIKILINK.lastIndex = 0;
      while ((match = WIKILINK.exec(value)) !== null) {
        const [full, target, alias] = match;
        if (match.index > lastIndex) {
          children.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }
        const label = (alias ?? target).trim();
        children.push({
          type: 'link',
          url: targetToHref(target),
          data: { hProperties: { className: 'wikilink' } },
          children: [{ type: 'text', value: label }],
        });
        lastIndex = match.index + full.length;
      }
      if (lastIndex === 0) return; // no matches actually consumed
      if (lastIndex < value.length) {
        children.push({ type: 'text', value: value.slice(lastIndex) });
      }

      // Splice the generated nodes in place of the original text node.
      parent.children.splice(index, 1, ...children);
      // Resume traversal after the inserted nodes (skip re-visiting them).
      return index + children.length;
    });
  };
}

export default remarkWikilink;
