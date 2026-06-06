---
title: EI Per Unit Cost
slug: ei-per-unit-cost
tags: [cost-aware, acquisition, myopic]
subtopic: cost-aware
requires: [expected-improvement, cost-aware-bo]
sources: [snoek2012, lee2020, xie2024]
summary: "The simplest cost-aware acquisition: expected improvement divided by cost."
grade: derivation
reviewed: 2026-06-06
---

# EI Per Unit Cost

EI per unit cost (EIpu) is the simplest [[cost-aware-bo|cost-aware]] acquisition function: it
converts EI's expected improvement-*per-evaluation* into expected improvement-*per-unit-cost*,
so a cheap informative point can outbid an expensive marginally-better one. It is a myopic,
ratio-based rule with a clean derivation and an equally clean failure mode. Symbols follow
[[notation]].

## Definition

Fix $n$ evaluations with data $\mathcal{D}_n$. The standard [[expected-improvement|expected
improvement]] is

$$
\mathrm{EI}_n(x) = E_n\!\big[\,[f(x) - f^*_n]^+\,\big]
= \Delta_n(x)\,\Phi\!\Big(\tfrac{\Delta_n(x)}{\sigma_n(x)}\Big)
+ \sigma_n(x)\,\varphi\!\Big(\tfrac{\Delta_n(x)}{\sigma_n(x)}\Big),
$$

where $\Delta_n(x) = \mu_n(x) - f^*_n$ and the closed form holds for $\sigma_n(x) > 0$.
EIpu simply rescales by cost:

$$
\boxed{\ \mathrm{EIpu}_n(x) := \frac{\mathrm{EI}_n(x)}{c(x)}\ }, \qquad
x_{n+1} \in \operatorname*{arg\,max}_{x \in A}\,\mathrm{EIpu}_n(x).
$$

The interpretation is a rate: expected gain per unit of resource consumed. When $c \equiv
\mathrm{const}$ the cost cancels and EIpu reduces to plain EI, so EI is the special (constant
cost) case.

## The cost is unknown — so the denominator must be modeled

`snoek2012` (§Modeling Costs) motivates EIpu in the HPO setting where evaluation duration
varies across the hyperparameter space (fast vs. slow model configurations). The duration
function $c : A \to \mathbb{R}^+$ is unknown a priori, exactly like the objective $f$. The
snoek2012 proposal is to maintain a **second GP surrogate** for the log-duration,

$$
\log c(x) \;\sim\; \mathrm{GP},
$$

fitted alongside the objective GP on the observed pairs $(x_m, \log c(x_m))$. Under this
model the duration $c(x)$ is log-normally distributed given $\mathcal{D}_n$, and its expected
inverse (the reciprocal of a log-normal) is available in closed form. The acquisition becomes

$$
\mathrm{EIpu}_n(x) = \mathrm{EI}_n(x)\cdot E_n\!\left[\frac{1}{c(x)}\right],
$$

where $E_n[1/c(x)]$ is the posterior expected reciprocal duration at $x$. The two factors are
independent under snoek2012's assumption that $f$ and $\log c$ are *a priori* independent GPs;
that independence is an assumption of convenience (snoek2012 notes it can be relaxed via
multi-task GP variants).

> **Remark — the formula snoek2012 states.** The §Modeling Costs text describes the rule
> verbally ("compute the predicted expected inverse duration and use it to compute the expected
> improvement per second") without displaying an equation. The formula above is the natural
> reading: $\mathrm{EI}\times E[1/c]$. This is algebraically equivalent to $\mathrm{EI}/c$
> only when $c(x)$ is treated as known; when $c$ is itself random, $E[1/c(x)] \ne 1/E[c(x)]$
> (Jensen's inequality). `lee2020` writes the cleaner $\mathrm{EIpu}(x) = \mathrm{EI}(x)/c(x)$,
> implicitly treating $c(x)$ as the *realized* cost at $x$ (e.g. evaluated or replaced by a
> point estimate from the cost surrogate). Both sources agree on the ratio idea; the distinction
> collapses to notation when $c(x)$ is plugged in as a scalar.

## Exploration–exploitation reading

Rewrite the ratio as a prioritization rule: among two candidates $x_1, x_2$ with
$\mathrm{EI}_n(x_1) > \mathrm{EI}_n(x_2)$, EIpu prefers $x_2$ if

$$
\frac{\mathrm{EI}_n(x_2)}{c(x_2)} > \frac{\mathrm{EI}_n(x_1)}{c(x_1)},
\quad\text{i.e.}\quad
\frac{c(x_1)}{c(x_2)} > \frac{\mathrm{EI}_n(x_1)}{\mathrm{EI}_n(x_2)}.
$$

That is: a cheaper point beats a nominally-better point whenever the *cost ratio* exceeds the
*EI ratio*. This is exactly the cost–quality trade-off the rule encodes. It requires no
hyperparameter — the cost model supplies the weight automatically.

## The failure mode

The failure mode is structural and worth tracing carefully, because it is the primary
motivation for [[cost-cooling-carbo]] and other cost-aware refinements.

**The bias mechanism.** Dividing by $c(x)$ imposes a monotone penalty on expensive regions of
$A$. If the global optimum $x^*$ happens to be expensive — a situation that is *unknown* in
the black-box setting — then $c(x^*)$ is large, $\mathrm{EIpu}_n(x^*)$ is correspondingly
depressed, and the acquisition systematically biases sampling away from the optimum. The
penalization grows over the optimization: as EI concentrates around the optimum (because the
posterior near $x^*$ becomes narrower), the cost penalty is the only remaining factor
differentiating candidates, and it steer allocations toward cheap regions rather than toward
the true $x^*$.

**The empirical verdict.** `lee2020` ran EIpu and plain EI on 20 real-world HPO problems
(KNN, MLP, SVM, Decision Tree, Random Forest on four datasets each). EIpu was *worse* than
EI on 9 of the 20 problems — close to half the benchmark set. On the KNN problem the failure
is acute: EIpu evaluates far more very cheap configurations than EI, while the empirical
optimum is one of the most expensive configurations. Dividing by cost shrinks EIpu's signal
near the optimum to near zero, and EI recovers it faster.

**Adversarial argument.** `lee2020` notes that the cost of the global optimum is unknown a
priori. This means one can construct adversarial problems where the optimum is placed at the
most expensive point in $A$; EIpu will be maximally penalized there and will fail. There is no
mechanism in EIpu to detect or correct this: the cost denominator is applied rigidly regardless
of how the optimization is progressing. EIpu is likely to outperform EI *only* when the optima
are *relatively cheap* — a condition that cannot be verified without knowing $x^*$.

**Why the constant-cost limit does not help.** When cost is nearly constant the penalty cancels
and EIpu $\approx$ EI, so EIpu is not harmful but also not useful. Gains from EIpu are confined
to the regime where costs vary significantly *and* the optimum is in a cheap region — both
conditions must hold simultaneously.

## Relation to other notes

- **[[expected-improvement]].** EIpu = EI $\div$ cost; EI is the $c \equiv \mathrm{const}$
  special case. The closed form for $\mathrm{EI}_n(x)$ is unchanged; EIpu wraps it with a
  cost denominator and a second GP surrogate for $\log c$.
- **[[cost-aware-bo]].** EIpu is the canonical baseline in the black-box cost-aware BO
  literature; every subsequent method (`lee2020`'s CArBO, cost-cooling, multi-fidelity
  variants) benchmarks against it.
- **[[cost-cooling-carbo]].** CArBO's cost-cooling directly fixes EIpu's bias: the acquisition
  is $\mathrm{EI}(x)/c(x)^{\alpha_k}$ with $\alpha_k$ decaying from 1 (EIpu) to 0 (EI) as the
  budget is spent. This deprecates the cost penalty as the optimization matures and the model
  needs to sample expensive regions to find the optimum. EIpu is the $\alpha_k = 1$ limiting case.
- **[[bo-as-dynamic-program]].** EIpu is a one-step ratio heuristic. It does not arise from
  the dynamic-programming parent — there is no finite-horizon DP whose one-step truncation
  yields EIpu. This distinguishes it from EI (which is the DP's one-step truncation under the
  "report an evaluated point" reward) and from non-myopic cost-aware methods that embed cost
  inside the DP objective directly.
- **[[cost-aware-stopping]] (LogEIPC, PBGI).** The modern practical form of EIpu is
  **LogEIPC** $=\log(\mathrm{EI}_n(x)/c(x))$ — the same ratio in the log domain, where EI's
  numerical underflow far from the incumbent is far less damaging (`xie2024`, applying the
  log-EI reparameterization of Ament et al. (2023) to EIpu). The order of
  $\operatorname*{arg\,max}$ is unchanged ($\log$ is monotone), so LogEIPC selects exactly where
  EIpu does; it is a numerical, not a decision-theoretic, refinement. A genuinely different
  cost-aware rule is the [[pandoras-box-gittins-index|Pandora's-box Gittins index (PBGI)]]
  (`xie2024`), which scores $x$ by the threshold $g$ solving $\mathrm{EI}_n(x;g)=c(x)$ rather than
  by a ratio — exact solution of a *spatially* simplified DP, where EIpu/EI are temporal one-step
  rules; both pair with [[cost-aware-stopping|cost-aware stopping]], where the EIpu-style comparison
  "expected improvement vs. cost" *becomes* the stop condition.

## Crosswalk

| This note (canonical) | `snoek2012` | `lee2020` | Note |
|---|---|---|---|
| $\mathrm{EIpu}_n(x) = \mathrm{EI}_n(x)/c(x)$ | "EI per second" = EI $\times$ $E[1/c(x)]$ | $\mathrm{EIpu}(x) := \mathrm{EI}(x)/c(x)$ | same ratio; snoek2012 makes the cost random and takes expectation of reciprocal; lee2020 uses $c(x)$ as a scalar (point-estimate or realized cost) |
| $c(x) > 0$, evaluation cost | "duration function" $c(\mathbf{x}): \mathcal{X}\to\mathbb{R}^+$, wall-clock time | $c(\mathbf{x})$, generic cost (time, energy, money) | naming differs; math is identical |
| $\log c(x) \sim \mathrm{GP}$ (cost surrogate) | GP on $\ln c(\mathbf{x})$ alongside $f$ | GP cost model (implied) | snoek2012 is explicit about log-normal cost GP; lee2020 inherits this convention |
| We maximize | snoek2012 minimizes ($\mathbf{x}_\text{best} = \operatorname*{arg\,min}$) | lee2020 minimizes ($y^* = f(\mathbf{x}_\text{min})$) | sign convention flipped; EIpu formula is symmetric under this change |
| $f^*_n = \max_{m \le n} f(x_m)$ | $f(\mathbf{x}_\text{best}) = \min_{n} f(\mathbf{x}_n)$ | $y^* = f(\mathbf{x}_\text{min})$ | incumbent, maximization vs. minimization |
