---
note: gp-bandit-lower-bounds
last_reviewed: 2026-06-06
verdict: clean
open_gaps: 0
reviewer: claude-opus-4-8 (reflection reviewer subagent)
scope: note
---

## 2026-06-06 — note (first review, on creation)
sources read: wiki/gp-bandit-lower-bounds.md, wiki/notation.md, wiki/CONVENTIONS.md, wiki/regret-gp-bandits.md, raw/scarlett_2017_lower_bounds_gp_bandit/ConverseGP.tex, preamble2.tex

The reviewer re-derived both theorem families (simple- and cumulative-regret lower bounds, SE and Matérn) and the four-step proof spine (needle-in-haystack ensemble → RKHS-norm budget via Aronszajn's Fourier identity → change-of-measure through the Auer testing lemma + KL chain rule with per-sample divergence v²/2σ² → summability lemma), confirming every rate, exponent, and the upper/lower comparison table against the source. Authorship is correct (Scarlett, Bogunovic, Cevher). No leftover preamble macros. The note is mathematically sound; the fixes below are a single mislabeled bound symbol, citation-key hygiene, and a source-typo correction.

- [gp-bandit-lower-bounds-1] gap (accepted-fixed) — The conjectured Matérn bound was written Ω(T^{(ν+d(d+1))/(2ν+d(d+1))}), but it is the GP-UCB *upper* bound that the γ_T²-removal conjecture would yield (an O*), not a lower bound. Changed Ω → O*.
- [gp-bandit-lower-bounds-2] gap (accepted-fixed) — Inline citation key `Bull2011` (×2) did not match references.md's key `bull2011`; corrected casing so it resolves.
- [gp-bandit-lower-bounds-3] gap (accepted-fixed) — Inline `Auer1998` had no corresponding key in references.md; rephrased to plain prose ("the Auer et al. hypothesis-testing lemma"). Optional follow-up: add an auer1998 entry to references.md, since the testing lemma is load-bearing for the proof.
- [gp-bandit-lower-bounds-4] nit (accepted-fixed) — The Matérn kernel was printed with J_ν (ordinary Bessel); the standard Matérn kernel uses K_ν (modified Bessel of the second kind) — the source's own internal typo. Corrected to K_ν per the synthesis mandate (fix a source slip rather than inherit it).
