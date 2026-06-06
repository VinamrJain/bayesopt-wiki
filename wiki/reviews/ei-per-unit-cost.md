---
note: ei-per-unit-cost
last_reviewed: 2026-06-06
verdict: open-gaps
open_gaps: 3
reviewer: claude-opus-4-8 (reflection-sweep reviewer subagent)
scope: sweep
---

## 2026-06-06 — sweep (inaugural full-wiki reflection)
sources read: wiki/ei-per-unit-cost.md, wiki/notation.md, wiki/expected-improvement.md (EI closed form), raw/snoek_2012_practical_bo/draft.tex (§Modeling Costs, EI-best convention), raw/lee_2020_cost_aware_bo/main2020.tex (EIpu def, KNN failure, 9/20, adversarial, cost-cooling), raw/xie_2024_pandora_gittins_bo/Pandora-BayesOpt.tex (§EIPC, Gittins index eqn, PBGI, LogEIPC appendix, astudillo2021 result)

- [ei-per-unit-cost-1] gap (open) — The 'failure mode' section gives only lee2020's empirical/adversarial argument, but a cited source (xie2024) states a strictly stronger result it omits: Astudillo et al. (2021), per xie2024 lines 60 and 147, formally show EIpu 'performs arbitrarily worse than the optimal policy in an approximation-ratio sense, due to over-sampling low-value low-cost points.' This is the theoretical capstone of the exact failure the note describes informally, and it is supported by material the note already cites (xie2024). The note's failure-mode case is correct but understates how strong the negative result is. Add one sentence to 'The failure mode' (or the adversarial paragraph): note that xie2024, citing Astudillo et al. (2021), proves EIpu can be arbitrarily worse than the optimal policy in an approximation-ratio sense — promoting the adversarial intuition to a formal guarantee. Optionally surface astudillo2021 as a downstream reference.
- [ei-per-unit-cost-2] nit (open) — Lines 102-105 add a mechanistic narrative not present in lee2020: 'as EI concentrates around the optimum (because the posterior near x* becomes narrower), the cost penalty is the only remaining factor differentiating candidates.' lee2020's actual explanation (line 166) is the simpler static one — the optimum has high cost, so dividing penalizes away from it. The note frames this as 'worth tracing carefully' (i.e. as derived from the source) but the dynamic 'EI collapses so cost dominates over the optimization' story is the note's own embellishment, and is shaky: EI concentrating near x* would tend to keep EIpu's numerator high near x*, not zero it. Risk of presenting an unsourced and partially counterintuitive mechanism as traced. Either tie the dynamic claim to a source or soften it to the static lee2020 mechanism (high-cost optimum => persistent penalty there), and drop the implication that it is being 'traced' from the source. Keep the empirically-grounded part (EIpu over-samples cheap points).
- [ei-per-unit-cost-3] nit (open) — Line 104: grammatical error 'and it steer allocations toward cheap regions' (subject-verb agreement; should be 'steers'). Fix to 'and it steers allocations toward cheap regions'. (Auto-fixable.)
