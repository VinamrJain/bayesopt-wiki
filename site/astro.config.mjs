import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkWikilink } from './src/lib/wikilink.mjs';
import { remarkStripTitle } from './src/lib/strip-title.mjs';

// GitHub Pages: override these via env once the repo is named (Phase 6 / D-ops1).
const site = process.env.SITE_URL || 'https://example.github.io';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  markdown: {
    remarkPlugins: [remarkMath, remarkWikilink, remarkStripTitle],
    rehypePlugins: [[rehypeKatex, { throwOnError: false }]],
    shikiConfig: { theme: 'github-dark' },
  },
});
