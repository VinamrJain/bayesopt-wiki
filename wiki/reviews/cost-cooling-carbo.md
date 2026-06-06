---
note: cost-cooling-carbo
last_reviewed: 2026-06-06
verdict: open-gaps
open_gaps: 5
reviewer: claude-opus-4-8 (reflection-sweep reviewer subagent)
scope: sweep
---

## 2026-06-06 — sweep (inaugural full-wiki reflection)
sources read: wiki/cost-cooling-carbo.md, wiki/notation.md, raw/lee_2020_cost_aware_bo/main2020.tex, raw/lee_2020_cost_aware_bo/macros.tex, references.md (grep for lee2020/wilson2018)

- [cost-cooling-carbo-1] gap (open) — Equation-number citations are swapped relative to the source. The note cites EI-cool as 'lee2020, eq. (2)' (body line 30) and the fill criterion as 'lee2020, eq. (1)' (body line 59). In main2020.tex the numbered equations in order are: eq. (1) = EIpu (line 147), eq. (2) = fill/minimax (label eq:fill, line 180), eq. (3) = EI-cool (label ei-cool, line 213). So EI-cool is eq. (3) and fill is eq. (2); both citations are off by one and point to the wrong equation. Change the EI-cool citation to 'eq. (3)' (body line 30) and the fill-criterion citation to 'eq. (2)' (body line 59).
- [cost-cooling-carbo-2] gap (open) — The body relies on wilson2018 for the batch-fantasizing technique ('This technique is inherited from `wilson2018` ...', body line 78) and cites it explicitly, but the frontmatter sources: list contains only [lee2020]. House style requires sources: to list every key whose material appears in the body. Add wilson2018 to the sources: frontmatter list (lee2020 remains derivation-primary first).
- [cost-cooling-carbo-3] nit (open) — Body line 63 and 65 say the constrained min-fill problem 'reduces to weighted vertex cover' / is NP-hard. The source (line 210) states it more precisely: 'In the discrete setting with constant cost, it [is] an instance of the vertex cover problem, known to be NP-complete.' The hardness is asserted for the constant-cost discrete case (plain vertex cover, NP-complete), not 'weighted' vertex cover; the note's 'weighted vertex cover' qualifier is not in the source and the constant-cost precondition is dropped. Align with the source: 'in the discrete, constant-cost setting it is an instance of vertex cover (NP-complete)'; drop the unsourced 'weighted' qualifier.
- [cost-cooling-carbo-4] nit (open) — The cost-model description (body line 46) omits a sourced operational detail: lee2020 (line 216) states the warped-GP cost model is itself warm-started with 'five points drawn from the search space uniformly at random' before cost-cooling begins. This is the cost-side analogue of the objective warm-start and is part of how the algorithm initializes; the note mentions only the cost-effective design (which warm-starts the objective GP). Optionally add one clause noting the cost GP is itself initialized from five uniform-random points per lee2020, or cross-reference [[cost-models]] if that detail lives there.
- [cost-cooling-carbo-5] nit (open) — Out-of-note observation surfaced during source verification: references.md line 22 lists the author set as 'Lee, Eriksson, Perrone & Seeger (2020)', but the paper's author list (main2020.tex lines 74-77) is Lee, Perrone, Archambeau, Seeger — there is no Eriksson, and Archambeau is missing. This affects citation correctness for the source this note derives from, though the error is in references.md, not in the note body. Correct the lee2020 author list in references.md to 'Lee, Perrone, Archambeau & Seeger (2020)'.
