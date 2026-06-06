---
note: cost-aware-stopping
last_reviewed: 2026-06-06
verdict: open-gaps
open_gaps: 4
reviewer: claude-opus-4-8 (reflection-sweep reviewer subagent)
scope: sweep
---

## 2026-06-06 — sweep (inaugural full-wiki reflection)
sources read: raw/2025_cost_aware_stopping_bo/CostAwareStoppingICML.tex, raw/2025_cost_aware_stopping_bo/ICML/method.tex, raw/2025_cost_aware_stopping_bo/ICML/background.tex, raw/2025_cost_aware_stopping_bo/appendices/analysis.tex, raw/xie_2024_pandora_gittins_bo/Pandora-BayesOpt.tex (key sections via grep: PBGI def, Thm equivalence/Thm2, PBGI-D), raw/astudillo_2021_multi_step_budgeted_bo/main_content.tex (log-cost GP modeling, Prop), wiki/notation.md

- [cost-aware-stopping-1] nit (open) — The tightness claim ('when costs are large relative to the achievable improvement, stopping immediately is optimal') summarizes xie2025 Prop. (immediate stopping optimal), whose precise hypothesis is a bounded objective f(x) in [a,b] with c(x) >= b-a everywhere (cost exceeds the entire achievable range). The note states this loosely enough that a reader cannot reconstruct the actual sufficient condition. Optionally add a half-sentence stating the precise condition: tight because if c(x) >= range(f) for all x, immediate stopping is provably optimal (xie2025 Prop., appendix).
- [cost-aware-stopping-2] nit (open) — PBGI-D's decaying-lambda mechanism (halve lambda each time the stop rule fires) is conceptually the cost-per-sample sibling of cost-cooling's lambda/exponent decay, but the note does not cross-link [[cost-cooling-carbo]], which exists and covers the dual decaying-cost-weight idea. Add a [[cost-cooling-carbo]] cross-link where PBGI-D / decaying-lambda is introduced, noting the shared 'decay the cost weight over time' frame.
- [cost-aware-stopping-3] nit (open) — The Theorem states C := c(x_1) as a deterministic constant, while xie2025's proof writes E[c(x_1)] (admitting random/unknown cost) and the note's own 'Unknown/stochastic cost' paragraph relies on replacing c with E[c]. Not an error (they coincide for known cost), but the deterministic C is slightly in tension with the later stochastic-cost extension. Optionally note C = E[c(x_1)] in the random-cost case, matching the proof, so the stochastic-cost paragraph reads consistently with the theorem.
- [xconn-2] gap (open) — [cross-note: cost-aware-stopping, cost-cooling-carbo] Missing cross-link between the two CArBO/cost-cooling-adjacent cost-aware mechanisms. cost-aware-stopping does not link cost-cooling-carbo and cost-cooling-carbo does not link cost-aware-stopping (0 in both directions), yet both sit in the cost-aware family hub and the reviewer suggested the cost-aware-stopping->cost-cooling-carbo edge. Stopping rules and cost-cooling are complementary budget-spending mechanisms. Add a reciprocal pair of links: from cost-aware-stopping to [[cost-cooling-carbo]] (cost-cooling as the acquisition-side budget-spending counterpart to the stopping-side rule) and ideally a back-link from cost-cooling-carbo to [[cost-aware-stopping]].
