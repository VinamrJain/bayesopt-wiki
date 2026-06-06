---
note: regret-gp-bandits
last_reviewed: 2026-06-06
verdict: open-gaps
open_gaps: 1
reviewer: claude-opus-4-8 (reflection reviewer subagent)
scope: note
---

## 2026-06-06 — note (first review, on creation)
sources read: wiki/regret-gp-bandits.md, wiki/notation.md, wiki/CONVENTIONS.md, wiki/gp-ucb.md, raw/srinivas2010/srinivas2010.md (Thms 1-5, Lemmas 5.1-5.8, eqs 1-8)

The reviewer re-derived the full finite-A proof and cross-checked every constant, schedule, and rate against the source: the regret theorem R_T ≤ √(C₁ T β_T γ_T) with C₁ = 8/log(1+λ⁻¹), all three β_t schedules (finite / compact / agnostic RKHS), the four-step spine (confidence band → optimism regret bound → Gaussian-entropy information-gain identity → Cauchy-Schwarz), the Theorem-2 discretization and Theorem-3 Freedman-martingale changes, and the kernel-by-kernel γ_T rates — all sound and faithful to srinivas2010. The maximize-convention sign handling is correct (the paper already measures regret to the maximum, so no flip is needed).

- [regret-gp-bandits-1] gap (accepted-fixed) — Overstated fidelity: the note credited srinivas2010 with a general near-minimax-optimality conclusion ("√(Tγ_T) is essentially unimprovable"), but the paper claims a matching lower bound only in the finite-armed and linear special cases (up to log factors). Softened; the general lower bounds are attributed to [[gp-bandit-lower-bounds]].
- [regret-gp-bandits-2] nit (accepted-fixed) — The γ_T crosswalk row reused A for the selected subset while the note uses A for the (continuous) feasible set; changed to γ_T = max_{S⊆A:|S|=T} I(y_S;f_S) to match notation.md.
- [regret-gp-bandits-3] nit (open) — The crosswalk omits the feasible-set ↔ decision-set (A ↔ D) row that gp-ucb.md's crosswalk carries; srinivas2010 writes D throughout. Low-priority consistency item.
