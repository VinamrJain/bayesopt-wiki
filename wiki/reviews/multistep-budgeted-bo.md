---
note: multistep-budgeted-bo
last_reviewed: 2026-06-06
verdict: clean
open_gaps: 3
reviewer: claude-opus-4-8 (reflection-sweep reviewer subagent)
scope: sweep
---

## 2026-06-06 — sweep (inaugural full-wiki reflection)
sources read: raw/astudillo_2021_multi_step_budgeted_bo/main_content.tex, raw/astudillo_2021_multi_step_budgeted_bo/supplement_content.tex, raw/lee_2021_nonmyopic_cost_constrained_bo/methods.tex, raw/lee_2021_nonmyopic_cost_constrained_bo/cmdp.tex, raw/lee_2021_nonmyopic_cost_constrained_bo/background.tex, raw/lam2016/lam2016.md (grep-targeted full passages), raw/wilson_2018_maximizing_acquisition/background.tex+main.tex+methods.tex (reparameterization passages), wiki/notation.md, references.md

- [multistep-budgeted-bo-1] nit (open) — Lines 54 and 155 use \arg\max ($x_{n+1}\in\arg\max_{x\in A}Q_N$ and B-MS-EI $=\arg\max_x Q_N$). \arg and \max are both stock KaTeX operators so this renders, but as 'arg max' with the index set to the side rather than below. The canonical form used in notation.md and sibling notes (expected-improvement.md) is \operatorname*{arg\,max}, which places the subscript underneath. This is a house-style/notation drift, not a broken macro. Replace both \arg\max occurrences with \operatorname*{arg\,max} to match notation.md and the rest of the wiki.
- [multistep-budgeted-bo-2] nit (open) — The note asserts 'increasing N approaches the budgeted optimum V* (since V_N→V*)' (line 56) and again in the crosswalk, with no caveat. astudillo2021 (eq. after the V_N definition, main_content.tex line 224) states this limit holds only under a regularity condition: 'when for each c drawn from the prior there exists a lower bound on c(x) over X' (so N_B<∞ and the problem is well-defined). The note states the convergence unconditionally. Add a half-clause noting V_N→V* requires the cost to be bounded below (equivalently N_B<∞ a.s., guaranteed when ln c is a GP) — the same condition the note already cites for finiteness of the horizon elsewhere in the cost-aware tier.
- [multistep-budgeted-bo-3] nit (open) — The 'Relation to other notes' bullet says the budget-scheduling section 'borrows the base-policy idea that the lee2021 rollout uses as its core.' This is an editorial synthesis link, not something astudillo2021 claims: astudillo2021 §4.3 introduces its fantasy-budget rollout (base policy = EI-PUC-CC) as its own heuristic and does NOT attribute it to lee2021 (lee2021 is cited only as concurrent work with a different — finite-horizon, rollout — method). The shared 'rollout of a base policy' frame is real, but 'borrows ... from lee2021' risks implying a citation/derivation dependency that the source does not make. Soften to a parallel rather than a borrowing, e.g. 'echoes the same rollout-of-a-base-policy device that lee2021 uses as its core (here to scale the budget rather than to estimate continuation value)', making clear it is a conceptual parallel, not an attributed dependency.
