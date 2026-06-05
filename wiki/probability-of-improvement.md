---
title: Probability of Improvement
slug: probability-of-improvement
tags: [acquisition, myopic, decision-theoretic]
requires: [problem-setup, gaussian-process-regression, expected-improvement]
sources: [shahriari2016, frazier2018, jones98]
summary: "The oldest improvement acquisition: probability of beating the incumbent."
grade: derivation
reviewed: null
---

# Probability of Improvement

Probability of improvement (PI) is the oldest improvement-based acquisition function
for Bayesian optimization, originating with Kushner (1964) (`shahriari2016`, §VII; cited
key `Kushner64` in `frazier2018`). It is EI's closest relative: both measure improvement
over the incumbent $f^*_n$, but PI discards the *amount* of improvement and retains only
its *probability*. That one omission makes PI simpler and cheaper — and also makes it
structurally biased toward exploitation. Symbols follow [[notation]].

## Definition with exploration margin

Fix a margin $\xi\ge0$ and define improvement as exceeding the incumbent by at least $\xi$:

$$
\mathrm{PI}_n(x;\xi) := P_n\!\big(f(x) > f^*_n + \xi\big).
$$

Under the GP posterior ([[gaussian-process-regression]]),
$f(x)\mid\mathcal{D}_n\sim\mathrm{Normal}(\mu_n(x),\sigma_n^2(x))$, so this is a tail
probability of a normal. Writing $f(x)=\mu_n(x)+\sigma_n(x)Z$ with
$Z\sim\mathrm{Normal}(0,1)$ and $\Delta_n(x):=\mu_n(x)-f^*_n$ (the improvement margin,
[[notation]]):

$$
f(x) > f^*_n+\xi
\;\iff\;
Z > \frac{f^*_n+\xi-\mu_n(x)}{\sigma_n(x)}
\;=\; -\frac{\Delta_n(x)-\xi}{\sigma_n(x)}.
$$

Therefore, for $\sigma_n(x)>0$,

$$
\boxed{\ \mathrm{PI}_n(x;\xi)
   = \Phi\!\left(\frac{\Delta_n(x)-\xi}{\sigma_n(x)}\right)\ },
$$

and $\mathrm{PI}_n(x;\xi)=0$ when $\sigma_n(x)=0$ (evaluated points cannot improve). The
formula is valid for all signs of $\Delta_n(x)-\xi$: when the incumbent is far above the
posterior mean, $\Phi(\cdot)\to0$; when the mean far exceeds the threshold, $\Phi(\cdot)\to1$.

## The exploration parameter ξ

Setting $\xi=0$ recovers plain probability of improvement,
$\mathrm{PI}_n(x) = \Phi(\Delta_n(x)/\sigma_n(x))$, which is maximized by the point most
likely to beat the current best — regardless of by how much or how uncertain it is. This is
**pure exploitation**: the maximizer of $\Phi(\Delta_n/\sigma_n)$ tends to sit just above the
incumbent, not in unexplored regions.

Raising $\xi>0$ shifts the threshold upward, forcing PI to credit only points that improve
by a substantial margin. This discounts nearby points and pushes the acquisition toward
regions where $\mu_n(x)$ is meaningfully larger than $f^*_n+\xi$, buying exploration at
the cost of optimism about how large the improvement will be.

> **Pathology.** Even with $\xi>0$, PI has no analogue of EI's $\sigma_n\varphi(\cdot)$
> term, so posterior uncertainty earns no direct reward: a point with $\Delta_n=0.1$ and
> $\sigma_n=100$ scores the same as one with $\Delta_n=0.1$ and $\sigma_n=0.11$. In
> practice, setting $\tau=f^*_n$ (i.e. $\xi=0$) causes PI to cluster evaluations near the
> current best and stall (`shahriari2016`, §V-A, citing [81]). The exploitation bias is
> noted even by Kushner himself, who introduced a separate global/local tradeoff parameter
> in his 1-D setting (`shahriari2016`, §VII).

## Relation to EI

EI and PI share the same GP posterior machinery. Write the EI closed form:

$$
\mathrm{EI}_n(x) = \Delta_n(x)\,\Phi\!\left(\tfrac{\Delta_n(x)}{\sigma_n(x)}\right)
   + \sigma_n(x)\,\varphi\!\left(\tfrac{\Delta_n(x)}{\sigma_n(x)}\right).
$$

PI (at $\xi=0$) is the first factor of the first term:

$$
\mathrm{PI}_n(x) = \Phi\!\left(\tfrac{\Delta_n(x)}{\sigma_n(x)}\right).
$$

The contrast is sharp:

| | PI | EI |
|---|---|---|
| Measures | probability that $f(x)$ exceeds $f^*_n$ | expected amount by which $f(x)$ exceeds $f^*_n$ |
| Weights small vs. large improvements | equally (indicator utility) | proportionally to size (linear utility) |
| Uncertainty reward | none beyond shifting $\Phi$ argument | explicit $\sigma_n\varphi$ bonus |
| Exploit/explore balance | must be tuned manually via $\xi$ | implicit via $(\Delta_n,\sigma_n)$ iso-EI curves |
| Pathology | over-exploits at $\xi=0$; brittle to $\xi$ choice | slightly over-exploits but self-corrects via $\sigma_n\varphi$ |

The utility-function view ([[acquisition-functions]]) makes this exact: PI maximizes
$E_n[\mathbf{1}_{f(x)>f^*_n+\xi}]$, an *indicator* utility; EI maximizes
$E_n[[f(x)-f^*_n]^+]$, a *linear* utility. EI strictly dominates PI as a measure of
decision value under a risk-neutral criterion — PI discards the information about how
much better a sample might be.

## Relation to other notes

- **[[expected-improvement]].** PI is the $\Phi$-only term in EI's closed form; see the
  derivation link above. EI's superiority is not merely empirical but follows from the
  decision-theoretic setup: PI uses a coarser utility.
- **[[acquisition-functions]].** Both PI and EI belong to the *improvement-based* class;
  PI is the simplest member, EI the most principled. The hub note places them together
  against optimistic ([[gp-ucb]]) and information-theoretic ([[entropy-search]],
  [[knowledge-gradient]]) methods.
- **[[gp-ucb]].** UCB $=\mu_n(x)+\beta_t\sigma_n(x)$ also lacks an improvement threshold
  but rewards uncertainty linearly and explicitly. It shares PI's single-parameter
  trade-off structure ($\xi$ for PI, $\beta_t$ for UCB) but rewards uncertainty directly
  rather than ignoring it.
- **[[knowledge-gradient]].** KG generalizes EI by allowing the final report to be any
  point in $A$. PI is, in a sense, an even more restricted relative: it uses less
  information per evaluation than EI, and both are dominated by KG in noisy settings.
- **PI as degenerate value-of-information.** In the decision-theoretic framing where EI
  is the one-step Bayes-optimal rule under a noise-free, "report-an-evaluated-point"
  assumption ([[expected-improvement]], §Thought experiment), PI is a degradation of that
  rule that discards magnitude information. It is not the one-step optimal rule under any
  standard utility unless the decision-maker literally cares only whether an improvement
  happened, not how large it was.

## Origin and crosswalk

Kushner (1964) introduced probability of improvement for unconstrained 1-D optimization
using Wiener processes, with a parameter controlling global vs. local search —
the conceptual precursor of $\xi$ (`shahriari2016`, §VII). `frazier2018` cites Kushner
as the origin of BayesOpt but does not present a PI section; the derivation above follows
the same GP-posterior route `frazier2018` uses for EI. `jones98` (EGO) does not discuss
PI, covering only EI.

| This note (canonical, maximize) | `shahriari2016` (general $\tau$) | `jones98` / `frazier2018` | Note |
|---|---|---|---|
| $f^*_n = \max_{m\le n}f(x_m)$ | $\tau$ (incumbent target, general) | $f^*_n$ (`frazier2018`); $f_{\min}$ (`jones98`, minimize) | we set $\tau=f^*_n+\xi$ |
| $\Delta_n(x)=\mu_n(x)-f^*_n$ | $\mu_n(\mathbf{x})-\tau$ (with $\tau=f^*_n$, $\xi=0$) | same via `frazier2018` | margin identical |
| $\xi\ge0$ (exploration margin) | implicit in $\tau$; discussed as heuristic | not discussed | $\tau = f^*_n+\xi$ |
| $\mathrm{PI}_n(x)=\Phi((\Delta_n-\xi)/\sigma_n)$ | $\Phi((\mu_n(\mathbf{x})-\tau)/\sigma_n(\mathbf{x}))$ (eq. 42) | not present | identical at $\xi=0$ |
| maximize | minimize convention in `jones98` | maximize (`frazier2018`) | sign flip vs. `jones98` |
