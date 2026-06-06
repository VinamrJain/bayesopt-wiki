---
note: ego-convergence-rates
last_reviewed: 2026-06-06
verdict: open-gaps
open_gaps: 2
reviewer: claude-opus-4-8 (reflection reviewer subagent)
scope: note
---

## 2026-06-06 — note (first review, on creation)
sources read: wiki/ego-convergence-rates.md, wiki/notation.md, wiki/CONVENTIONS.md, wiki/expected-improvement.md, wiki/gp-hyperparameters.md, raw/bull2011/bull2011.md (Thms 1-5, Lemmas 3,6,7,8, Cor 1)

The reviewer re-derived the central results and confirmed faithfulness: the minimax floor Θ(n^{-ν/d}) (Thm 1), the fixed-prior EI rate O*(n^{-(ν∧1)/d}) with ν>1 saturation (Thm 2), the ε-greedy recovery to the minimax rate (Thm 5), the RKHS ≃ Sobolev H^{ν+d/2} identity, the EI sandwich + variance-collapse + telescoping spine, and — handled carefully and not overstated — the ML-shrinkage non-convergence result (Thm 3) and its robust-estimator repair (Thm 4). Rendering is stock-KaTeX clean.

- [ego-convergence-rates-1] blocker (accepted-fixed) — The derivation spine defined s = σ_n(x) (full posterior std) but then used it as bull2011's *unit-scale* std, silently injecting a factor-σ error into the EI closed form, the prediction-error bound |μ_n−f| ≤ R s, and the Lemma-8 sandwich — and contradicting the note's own crosswalk (which correctly states σ_n = σ s_n). Redefined s = s_n(x) = σ_n(x)/σ, restoring scale consistency.
- [ego-convergence-rates-2] gap (accepted-fixed) — Self-contradictory regret-conversion identity "a cumulative bound R_N=O(r_N) implies r_N=O(R_N/N)". Replaced with the correct fact: since min_{n≤N} r_n ≤ R_N/N, a cumulative bound R_N=O(g(N)) yields simple regret r_N=O(g(N)/N).
- [ego-convergence-rates-3] nit (open) — r_n (simple regret here) collides with notation.md's canonical per-stage DP reward r_n; a pre-existing overload (problem-setup.md also uses r_n for simple regret), declared in the note's Notation delta. Flagged for an upstream notation cleanup, not a per-note fix.
- [ego-convergence-rates-4] nit (open) — [[gp-hyperparameters]] is linked heavily but is not in requires:; defensible as a "see also" relation per CONVENTIONS (requires lists prerequisites a reader must hold, not every mention). Left as-is.
