---
title: Cost-Aware Bayesian Optimization
slug: cost-aware-bo
tags: [cost-aware, acquisition, taxonomy]
requires: [acquisition-functions, expected-improvement]
sources: [lee2020, shahriari2016, snoek2012, xie2025, xie2024]
summary: "Budgeting real evaluation cost, not iteration count; the cost-aware formulations and family map."
grade: concept
reviewed: null
---

# Cost-Aware Bayesian Optimization

Standard BO measures its budget in **iteration count** — each call to $f$ consumes one unit regardless of what it costs in wall-clock time, energy, or money. This is a clean abstraction but a leaky one: when evaluation cost varies across the domain (neural-network training time grows quadratically with layer size; SVM runtime scales with iteration count), counting iterations conflates cheap and expensive evaluations and the convergence picture becomes misleading. Cost-aware BO breaks that abstraction by tracking cumulative **real cost** and asks for the best $f$-value achievable within a total cost budget $\tau$ (`lee2020`, `shahriari2016`). The cost-aware symbols ($c(x)$, $\tau$, $\tau_{\mathrm{init}}$, $\tau_k$, $\alpha_k$) follow [[notation]].

## The problem — two formulations

Let $c: A \to \mathbb{R}_{>0}$ be a cost function (possibly known, more often black-box and modeled by a second GP). The field frames "best $f$ per unit cost" in two distinct ways (`lee2020`, `xie2025`), and the distinction matters because they motivate different methods.

**Budget-constrained.** Maximize $f$ subject to a cap on cumulative cost — the formulation `lee2020`'s CArBO targets:

$$
\text{find } x^* \in \operatorname*{arg\,max}_{x\in A} f(x)
\quad\text{subject to}\quad
\sum_{n} c(x_n) \le \tau
$$

(or, when costs are random, the *expected*-budget version $E[\sum_n c(x_n)] \le B$, `xie2025`). The feasibility constraint is on **cumulative cost**, not iteration count; when $c$ is constant the two coincide and cost-aware methods reduce to their standard counterparts.

**Cost-per-sample (cost-adjusted regret).** Alternatively, fold cost into the objective additively and let the horizon be an adaptive *stopping time* $T$ (distinct from the budget $\tau$ — see [[notation]]). In the maximization convention, minimize the expected **cost-adjusted simple regret** (`xie2025`)

$$
\mathcal{R}_c = E\Big[\underbrace{f^* - \max_{1\le n\le T} f(x_n)}_{\text{simple regret}} \;+\; \underbrace{\textstyle\sum_{n=1}^{T} c(x_n)}_{\text{cumulative cost}}\Big],
$$

which prices an evaluation directly against the regret it is expected to remove. Because $T$ is not fixed, this formulation raises a question the budget-constrained view suppresses — **when to stop** — and is the natural setting for cost-aware stopping rules and Pandora's-box acquisitions ([[cost-aware-stopping]]).

The two views agree in the constant-cost limit but diverge on how cost enters: a hard constraint (budget-constrained) versus a Lagrangian-style additive penalty (cost-per-sample). The myopic EI÷cost family below is most naturally read in the budget-constrained view; the stopping/Pandora's-box family lives in the cost-adjusted-regret view.

The cost $c(x)$ is typically **not** observed before evaluating $x$ (otherwise the problem would be a constrained program over the known cost landscape). When unknown it must be **learned** alongside $f$, requiring a second surrogate — a GP on $\log c(x)$ — which introduces its own estimation noise (`lee2020`, §3; see [[cost-models]]).

> **Remark — the minimization convention.** `lee2020` works in a minimization setting throughout ($f_{\min}$, $y^*$, etc.). This wiki maximizes; in the crosswalk at the end of this note the mapping is recorded. All statements here use the canonical maximization convention.

## Why vanilla BO fails and naive fixes are insufficient

A vanilla acquisition like $\mathrm{EI}_n$ treats each candidate $x$ identically regardless of $c(x)$. Given a fixed budget $\tau$, spending it on expensive evaluations leaves fewer iterations than spending it on cheap ones — but EI cannot see this: it measures benefit at $x$ against the next single evaluation, not against the remaining *cost* pool. If the optimum happens to be expensive, EI may stumble upon it; if it is cheap, EI wastes budget on costly evaluations that get there no faster.

The most obvious fix — normalizing the acquisition by cost — is **EI per unit cost (EIpu)**:

$$
\mathrm{EIpu}_n(x) := \frac{\mathrm{EI}_n(x)}{c(x)}.
$$

EIpu was introduced in `snoek2012` as a practical heuristic ("EI per second") and is the de facto baseline in the black-box cost-aware setting. It is intuitive: preferring a point whose EI is twice as high but cost is the same yields strictly more expected improvement per dollar.

The critical flaw, identified clearly in `lee2020`: EIpu systematically **biases toward cheap points** regardless of where the optimum lies. If the global maximum has high cost, dividing by $c(x)$ penalizes the optimum-neighborhood, and EIpu will compulsively explore the cheap (and often uninteresting) corners of $A$. In `lee2020`'s KNN benchmark, EIpu evaluates far more cheap points than EI and converges *slower* on nine of twenty HPO problems — worse than the cost-unaware baseline. The failure mode is not a corner case; it is the default whenever the optimum is not among the cheapest points, which in a black-box setting is unknown a priori.

The lesson: dividing by cost is a **local, myopic adjustment** that cannot plan for an expensive optimum. A better strategy must eventually reach expensive regions, even if it exploits cheap regions early.

## The organizing principle: "early and cheap, late and expensive"

Multi-fidelity and multi-task methods (grey-box) discovered this principle independently: evaluate cheap proxies or cheap points before carefully selecting expensive evaluations (`lee2020`, §2). In those settings, "cheap" and "expensive" are defined by a known fidelity parameter or task hierarchy; the insight is that early budget should be spent broadly and cheaply, leaving room for expensive, targeted queries near the end.

Cost-aware **black-box** BO imports this principle without the grey-box scaffolding. The challenge is that neither "cheap" nor "close to the optimum" is known in advance — both must be inferred from data. The "early and cheap, late and expensive" strategy then decomposes into two coupled sub-problems:

1. **Initial design.** Use a cost-constrained space-filling design (budget $\tau_{\mathrm{init}}$) to build a useful surrogate *cheaply*. More evaluations within $\tau_{\mathrm{init}}$ → better surrogate than a standard equally-spaced design would yield.
2. **Optimization phase.** After warm-start, acquire with a rule that starts cost-sensitive (like EIpu) and gradually depreciates the cost model as the budget is spent — transitioning toward plain EI by the time $\tau$ is nearly exhausted, when the optimum must be found regardless of cost.

This decomposition is the skeleton of [[cost-cooling-carbo]] (CArBO). The cost model that both phases rely on is a separate concern — see [[cost-models]].

## Family map: two design axes

The cost-aware acquisition family splits along two axes:

| Axis | Approach | Child note | Core idea |
|---|---|---|---|
| **Acquisition ÷ cost** | Divide $\mathrm{EI}$ by $c(x)$ | [[ei-per-unit-cost\|EI per unit cost (EIpu)]] | Myopic cost-benefit ratio; degrades when optimum is expensive |
| **Cost-cooling + cost-effective design** | Interpolate between EIpu and EI as budget depletes; space-fill cheaply | [[cost-cooling-carbo\|CArBO]] | Implements "early and cheap, late and expensive" in the black-box setting |

The shared dependency of both: **[[cost-models]]** — the GP surrogate for $c(x)$, which both EIpu and cost-cooling consume and which must itself be learned from evaluations.

A third strand belongs to the **cost-adjusted-regret** formulation above rather than the budget-constrained one: acquisitions built on the **Pandora's-box / Gittins-index** principle ([[pandoras-box-gittins-index|PBGI]]), which sets the score at $x$ to the value $g$ solving $\mathrm{EI}(x;g)=c(x)$, and the log-domain variant **LogEIPC** $=\log(\mathrm{EI}/c)$ (`xie2024`; LogEIPC the numerically-stable log form of EIpu, after Ament et al. 2023). These pair naturally with cost-aware **stopping** rules — when the per-sample cost exceeds the expected improvement it buys, stop — and are developed in [[pandoras-box-gittins-index]] (acquisition) and [[cost-aware-stopping]] (stopping). The present note's EI÷cost family is the myopic, budget-constrained branch; PBGI/LogEIPC and stopping are its cost-per-sample counterpart.

### EI per unit cost

$\mathrm{EIpu}$ is the simplest cost-aware acquisition and appears already in `snoek2012` (as "EI per second"). It retains EI's closed form and requires only one additional scalar per candidate (the cost prediction). Its bias and failure mode are described above; the [[ei-per-unit-cost]] note carries the full derivation, the critique, and the regime analysis (when EIpu helps vs. hurts).

### Cost-cooling (CArBO)

[[cost-cooling-carbo]] introduces a budget-aware exponent $\alpha_k$ that interpolates between EIpu ($\alpha_k=1$) and plain EI ($\alpha_k=0$) as the fraction of budget remaining shrinks:

$$
\mathrm{EI\text{-}cool}_k(x) := \frac{\mathrm{EI}_n(x)}{c(x)^{\,\alpha_k}},
\qquad
\alpha_k = \frac{\tau - \tau_k}{\tau - \tau_{\mathrm{init}}},
$$

where $\tau_k$ is cumulative cost spent at iteration $k$. When $\tau_k = \tau_{\mathrm{init}}$ (just after warm-start), $\alpha_k=1$ and EI-cool is EIpu. When $\tau_k \to \tau$ (budget nearly exhausted), $\alpha_k\to 0$ and EI-cool collapses to plain EI. The [[cost-cooling-carbo]] note derives this and the cost-effective initial design algorithm in full.

## The other branch: non-myopic, budget-constrained DP

The family above is **myopic**: each acquisition scores one next evaluation without explicitly reasoning about how remaining budget will be allocated after that step. A structurally different family embeds cost directly inside a **finite-horizon dynamic program**:

- [[bo-as-dynamic-program]] — the general DP framework for finite-horizon BO.
- [[budget-constrained-dp]] — DP with a hard cost budget as a state variable.
- [[multistep-budgeted-bo]] — multi-step rollout approximations under a cost budget.
- [[nonmyopic-cost-constrained-bo]] — non-myopic acquisitions that price in future cost explicitly.

These methods correctly account for the fact that an expensive evaluation now forecloses cheap evaluations later — which EIpu and even cost-cooling only approximate. The price is computational: solving or approximating the DP is far more expensive than evaluating a myopic acquisition. The myopic family (EIpu, CArBO) is preferable when the DP cost is prohibitive; the non-myopic family is preferable when the horizon is short and the budget constraint is tight.

## Relation to other notes

- **[[acquisition-functions]]** — this note slots under the acquisition taxonomy as a sub-family. Cost-aware acquisitions modify the standard loop by adding a cost constraint to the budget, not by changing the GP surrogate.
- **[[expected-improvement]]** — EIpu is EI rescaled; cost-cooling interpolates between EIpu and EI. Both inherit EI's closed form and myopia.
- **[[gp-hyperparameters]]** — the cost model is a second GP whose hyperparameters are fit by marginal-likelihood maximization alongside the objective GP.
- **[[bo-as-dynamic-program]]** — the non-myopic branch mentioned above; the myopic family here is a one-step truncation of that DP where cost enters only through the feasibility constraint.

## Crosswalk

`lee2020` minimizes throughout. The mapping to this wiki's maximization convention:

| This note (canonical, maximize) | `lee2020` (minimize) | Note |
|---|---|---|
| $f^*_n = \max_{m\le n} f(x_m)$ | $y^* = f(x_{\min})$, current minimum | sign flip |
| $\mathrm{EI}_n(x) = E_n[(f(x)-f^*_n)^+]$ | $\mathrm{EI}(x) = E[\max(y^*-f(x),0)]$ | improvement toward max vs. min |
| $\tau$ (total cost budget) | $\tau$ (same symbol, same meaning) | no change |
| $\tau_{\mathrm{init}}$ (initial-design budget) | $\tau_{\mathrm{init}}$ (same) | no change |
| $\alpha_k$ (cost-cooling exponent) | $\alpha = (\tau-\tau_k)/(\tau-\tau_{\mathrm{init}})$ | same formula; subscripted by iteration $k$ here |
| $\log c(x)$ (log-cost, GP surrogate target) | $\gamma(x)$ in `lee2020` | renamed here to avoid collision with $\gamma_T$ (max info-gain) in [[notation]] |

`snoek2012` introduces EIpu as "EI per second" with cost modeled via a warped GP on $\log c(x)$; the notation matches the canonical convention here already.
