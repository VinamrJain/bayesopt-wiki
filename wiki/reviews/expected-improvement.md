---
note: expected-improvement
last_reviewed: 2026-06-06
verdict: open-gaps
open_gaps: 5
reviewer: claude-opus-4-8 (reflection-sweep reviewer subagent)
scope: sweep
---

## 2026-06-06 — sweep (inaugural full-wiki reflection)
sources read: wiki/expected-improvement.md, wiki/notation.md, raw/frazier_2018_tutorial_bo/tutorial.tex, raw/jones98/jones98.md (EI sections 303-394, 655), raw/snoek_2012_practical_bo/draft.tex, references.md

- [expected-improvement-1] blocker (accepted-fixed) — Broken wikilink [[ego-convergence-rates]] (line 168). No such note exists in wiki/; the convergence-theory note bull2011 supports is not present at all. The link renders dead. Either create the convergence-rates note or drop the [[...]] and keep the prose reference to bull2011 as a plain inline citation until that note exists.
- [expected-improvement-2] blocker (open) — Broken wikilink [[parallel-batch-bo]] (lines 168-169). No parallel-batch-bo.md (nor any batch/parallel note) exists in wiki/. The parallel-EI formula it points to is correct (matches frazier2018 eq. parallel-EI) but the target note is absent. Create a parallel/batch-BO note or convert the link to a plain inline reference until one exists.
- [expected-improvement-3] gap (open) — Inline citation `ScottFrazierPowell2011` (lines 144, 146) is not present in references.md (grep returns 0 hits). It is the load-bearing source for the noisy-EI/KGCP construction, so the unknown key is a real dangling reference, not cosmetic. Add a ScottFrazierPowell2011 row to references.md (Scott, Frazier & Powell 2011, 'The Correlated Knowledge Gradient...', the KGCP paper) so the inline key resolves.
- [expected-improvement-4] nit (open) — The note credits the closed form solely to jones98 (line 175 and the typo remark). frazier2018 attributes the integration-by-parts closed form to BOTH JoScWe98 and clark1961 (Clark 1961, 'The greatest of a finite set of random variables'). Minor attribution completeness, not an error. Optionally note Clark (1961) as the prior closed-form source alongside jones98; low priority since jones98 is the canonical BO attribution.
- [expected-improvement-5] nit (open) — The 'typo' remark (lines 89-97) is mathematically correct and a genuine catch (frazier2018 eq.(15) as printed gives EI->0 as Delta->+inf, verified by re-derivation; the Phi(-|Delta|/sigma) correction is verified to reproduce the two-term form for both signs). But it phrases the source key as 'frazier2018 (eq. for `EI-formula`)' — `EI-formula` is the LaTeX \label, an internal artifact, not a reader-facing equation number. Replace the internal label reference with a reader-facing pointer, e.g. 'the single-expression form in frazier2018 (eq. 4 / the boxed EI formula)'.
