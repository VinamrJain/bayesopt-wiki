// Remove a note's leading top-level (#) heading before render.
//
// Each wiki note repeats its frontmatter `title` as an H1 at the top of the body, so the raw
// markdown stays portable (Obsidian, GitHub, plain rendering). On the site the title is supplied by
// the layout header, so that body H1 would render as a duplicate title. Strip the first depth-1
// heading; section headings (h2/h3) — and therefore the on-page table of contents — are untouched.
export function remarkStripTitle() {
  return (tree) => {
    const i = tree.children.findIndex((n) => n.type === 'heading' && n.depth === 1);
    if (i !== -1) tree.children.splice(i, 1);
  };
}
