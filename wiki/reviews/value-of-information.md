---
note: value-of-information
last_reviewed: 2026-06-06
verdict: open-gaps
open_gaps: 2
reviewer: claude-opus-4-8 (reflection-sweep reviewer subagent)
scope: sweep
---

## 2026-06-06 — sweep (inaugural full-wiki reflection)
sources read: wiki/value-of-information.md, wiki/notation.md, raw/frazier_2018_tutorial_bo/tutorial.tex, raw/frazier2009kg/frazier2009kg.md

- [value-of-information-1] gap (open) — The VoI>=0 / monotonicity claim (line 79) is attributed to 'frazier2009kg, Prop. A.1', which states V^{pi,n}(s) >= V^{pi,n+1}(s) — that a fixed stationary policy benefits on average from MORE remaining opportunities at the same state. The statement the note actually needs, that one extra measurement never decreases expected reported value (E_n[u(D_{n+1})] >= u(D_n), i.e. Q^n(s,x) >= V^{n+1}(s)), is precisely Proposition A.2 (and Corollary A.3), not A.1. The note's intuitive proof ('the reporter can always ignore the new point') is correct, and the inequality direction quoted matches A.1's, so this is a citation-precision issue, not a math error. Re-cite the one-step VoI>=0 result to Proposition A.2 / Corollary A.3 (Q^n(s,x) >= V^{n+1}(s)); keep A.1 only if framing the multi-opportunity monotonicity it actually states, or drop the A.1 reference.
- [value-of-information-2] nit (open) — The note states KG 'needs the full posterior update at x, not just the marginal' but does not point at the one mechanism that makes the KG/noisy-EI expectations computable: frazier2009kg eq(8), mu^{n+1} = mu^n + tilde-sigma(Sigma^n, x^n) Z^{n+1}, the Gaussian-increment reparametrization in Z that turns E_n[max_i mu_i^{n+1}] into a one-dimensional normal integral. This is the bridge between the abstract VoI and the simulated/closed-form computation, and is the load-bearing fact distinguishing why KG has no marginal-only closed form. Optionally add one clause noting that the whole-domain and evaluated-point VoI both reduce to a 1-D expectation over the standardized outcome Z via the posterior-mean increment (frazier2009kg eq(8)), with the actual computation deferred to [[knowledge-gradient]]. Low priority since the note already defers computation.
