---
title: Budgeted Multi-Step Expected Improvement
slug: multistep-budgeted-bo
tags: [cost-aware, non-myopic, lookahead, acquisition]
subtopic: cost-aware
requires: [budget-constrained-dp, expected-improvement, cost-models]
sources: [astudillo2021, lam2016, lee2021, wilson2018]
summary: "Budgeted multi-step EI (B-MS-EI): non-myopic cost-aware lookahead via the budget DP."
grade: derivation
reviewed: 2026-06-06
---

# Budgeted Multi-Step Expected Improvement

[[budget-constrained-dp]] poses cost-aware BO under a budget as a random-horizon DP and shows the
myopic ratio rules are unboundedly suboptimal; it stops at the *formulation*. This note builds the
acquisition that approximately *solves* it — **budgeted multi-step expected improvement** (B-MS-EI,
`astudillo2021`, §4). The recipe is three moves: truncate the DP to $N$ look-ahead steps, apply
Bellman recursion to get a state–action value $Q_N$, and optimize $Q_N$ as a single deterministic
problem over a **scenario tree**. The one-step term $Q_1$ has a clean closed form — classical EI
times the probability the evaluation *fits in budget* — making B-MS-EI a genuine non-myopic
generalization of EI rather than a heuristic. Symbols follow [[notation]].

> **Notation delta.**
> - $Q_n(x\mid\mathcal D)$ — **$n$-step state–action value**: expected gain in terminal utility
>   $u$ from evaluating $x$ first and then acting optimally for $n-1$ more steps, from state
>   $\mathcal D$. The acquisition is $Q_N$.
> - $\mathrm{EI}^f(x\mid\mathcal D)=E[(f(x)-u(\mathcal D))^+\mid\mathcal D]$ — classical
>   [[expected-improvement|EI]] over $f$ against incumbent $u(\mathcal D)$ (the $\mathrm{EI}_n$ of
>   [[notation]], written with the state argument here).
> - $\mu^{\log c}_{\mathcal D}(x),\ \sigma^{\log c}_{\mathcal D}(x)$ — posterior mean / std of
>   $\log c$ at $x$ (the [[cost-models]] GP).
> - $B_n=B-\sum_{i\le n}z_i$ — budget remaining at step $n$.

## Truncate, then Bellman

Start from the truncated budgeted value $V_N$ of [[budget-constrained-dp]]. Define the **one-step
marginal value** of measuring $x$ from an arbitrary state $\mathcal D$ — the expected utility
increase, but only if the evaluation's cost fits in the remaining budget:

$$
Q_1(x\mid\mathcal D)=E_{y,z}\!\big[\,(y-u(\mathcal D))^+\,\mathbf 1\{s(\mathcal D)+z\le B\}\,\big],
$$

with $(y,z)$ the fantasy objective/cost drawn from the joint posterior at $x$. The $n$-step value
follows by **Bellman recursion** — take the one-step value now, then continue optimally:

$$
\boxed{\ Q_n(x\mid\mathcal D)=Q_1(x\mid\mathcal D)
+E_{y,z}\!\Big[\max_{x'\in A}Q_{n-1}\big(x'\mid\mathcal D\cup\{(x,y,z)\}\big)\Big]\ }
$$

(`astudillo2021`, §4.1). **B-MS-EI is $Q_N$**: at each iteration evaluate
$x_{n+1}\in\arg\max_{x\in A}Q_N(x\mid\mathcal D_n)$. The parameter $N$ is the look-ahead depth;
$N=1$ recovers $Q_1$, a *budget-aware one-step EI*, and increasing $N$ approaches the budgeted
optimum $V^*$ (since $V_N\to V^*$).

### The one-step term is constrained EI

The recursion is only useful because its base case is closed-form. Model $f$ and $\log c$ as
**independent** GPs ([[cost-models]]). Then the improvement $(y-u(\mathcal D))^+$ depends only on
$f$, and the budget indicator $\mathbf 1\{s(\mathcal D)+z\le B\}$ only on $z=c(x)$, so the
expectation factors:

$$
Q_1(x\mid\mathcal D)
=\underbrace{E_y\big[(y-u(\mathcal D))^+\big]}_{\mathrm{EI}^f(x\mid\mathcal D)}\cdot
\underbrace{P\big(c(x)\le B-s(\mathcal D)\big)}_{\text{evaluation fits in budget}}\,
\mathbf 1\{s(\mathcal D)\le B\}.
$$

Under the log-normal cost model, $\log c(x)\mid\mathcal D\sim\mathrm{Normal}(\mu^{\log
c}_{\mathcal D}(x),\sigma^{\log c}_{\mathcal D}(x)^2)$, the fit probability is a normal CDF:

$$
P\big(c(x)\le B-s(\mathcal D)\big)
=P\big(\log c(x)\le\log(B-s(\mathcal D))\big)=\Phi(\zeta),
\qquad
\zeta=\frac{\log(B-s(\mathcal D))-\mu^{\log c}_{\mathcal D}(x)}{\sigma^{\log c}_{\mathcal D}(x)}.
$$

Hence (`astudillo2021`, Prop 1)

$$
\boxed{\ Q_1(x\mid\mathcal D)=\mathrm{EI}^f(x\mid\mathcal D)\,\Phi(\zeta)\,\mathbf 1\{s(\mathcal D)\le B\}\ }.
$$

This is exactly the **constrained-EI** form (`astudillo2021` notes the parallel to the constrained
acquisition of Schonlau and of Gardner et al.): expected improvement, *discounted by the
probability the constraint is satisfied* — here the constraint being "the draw does not overrun the
budget." The cost enters through $\Phi(\zeta)$: an expensive point ($\mu^{\log c}$ large) gets a
small fit-probability and is down-weighted, but — unlike [[ei-per-unit-cost|EIpu]] — through a
*budget-relative* factor $\log(B-s(\mathcal D))-\mu^{\log c}$, not an absolute denominator $c(x)$.
As budget depletes, $B-s(\mathcal D)\downarrow$, $\zeta\downarrow$, and the rule turns *more*
cost-averse on its own; with ample budget $\Phi(\zeta)\approx1$ and $Q_1\approx\mathrm{EI}$. This
budget-adaptivity is what the constant-denominator ratio rules lack.

> **Remark — independence is only for the closed form.** The factorization needs $f\perp\log c$.
> The Monte-Carlo optimizer below draws $(y,z)$ from the *joint* posterior, so it accommodates a
> correlated model (e.g. a multi-task GP) without change — useful when objective and cost share
> structure, as training time and accuracy often do (`astudillo2021`, §4.2 footnote).

## Optimizing $Q_N$ via one-shot multi-step trees

Unrolling the recursion exposes the difficulty — nested maximizations alternating with
expectations:

$$
Q_N(x\mid\mathcal D)=Q_1(x\mid\mathcal D)+E_{y,z}\Big[\max_{x_2}\big\{Q_1(x_2\mid\mathcal D_1)
+E_{y,z}\big[\max_{x_3}\{Q_1(x_3\mid\mathcal D_2)+\cdots\}\big]\big\}\Big],
$$

the same nested max–expectation that makes the exact DP intractable in [[bo-as-dynamic-program]].
`astudillo2021` (§4.2) sidesteps it with the **one-shot multi-step tree** of Jiang et al.,
combined with the [[expected-improvement|reparameterization]] trick (`wilson2018`):

1. **Sample-average the expectations.** Replace each inner $E_{y,z}$ by an average over $m_i$
   *fantasy samples* drawn from the posterior, building a **scenario tree** with branching
   $(m_1,\dots,m_{N-1})$. Each node is a fantasy state $\mathcal D_i^{j_1\cdots j_i}$; the budget
   indicator prunes any path whose accumulated cost passes $B$ (truncating that branch early).
2. **One decision variable per scenario.** Give every tree node its own candidate $x_i^{j_1\cdots
   j_{i-1}}$. Because the inner maxima are then over *independent* variables, they pull outside the
   nested sums: the nested stochastic program collapses into a **single deterministic
   maximization** over the high-dimensional vector of all node-decisions, of the sample-average
   $\widehat Q_N$. With reparameterized (hence differentiable) fantasy draws, this is solved by
   gradient ascent with batched linear algebra (BoTorch).

Two ways a tree path ends (`astudillo2021`, Fig. 3): the **budget is exhausted**,
$s(\mathcal D_i)>B$ (the random-horizon truncation, the point of the whole formulation), or the
**look-ahead cap $N$** is hit first (approximation error from truncating $V_N$). Deeper $N$ shrinks
the latter at exponential cost in tree size — `astudillo2021` reports $N=4$ as the practical sweet
spot, at tens of seconds to minutes per acquisition versus seconds for EIpu, justified when each
true evaluation costs hours.

## Setting the acquisition's budget: rollout of a base policy

A subtlety: $Q_N$ is parameterized by the budget $B$, but the *actual* remaining budget $B_n$ may
be far larger than $N$ cheap steps can spend. If $B_n$ dwarfs the cost of $N$ evaluations, the
indicator $\mathbf 1\{s\le B\}$ never bites within the tree and the cost terms stop influencing the
decision — B-MS-EI silently degrades to plain multi-step EI early in the run (`astudillo2021`,
§4.3).

The fix is a **fantasy budget**. Roll out a cheap *base sampling policy* (the paper uses
[[cost-cooling-carbo|EI-PUC-CC]]) for $N$ fantasy steps — draw $(y,z)$ at the policy's chosen
point, update the posterior, repeat — and sum the $N$ fantasy costs. Set the acquisition's budget
to $\min\{\text{fantasy cumulative cost},\,B_n\}$. The intuition: B-MS-EI is asked to make the
*best non-myopic plan that spends roughly what the base policy would over the same look-ahead*, so
it should match or beat the base policy. When that fantasy budget is depleted, recompute it. This
makes the same rollout-of-a-heuristic idea from [[bo-as-dynamic-program]] do double duty — here to
*scale the budget* rather than to estimate the continuation value.

## Relation to other notes

- **[[budget-constrained-dp]].** The DP this note approximately solves: $Q_N$ is the Bellman
  recursion on the truncated value $V_N$, and B-MS-EI $=\arg\max_x Q_N$ is a principled
  approximation of the optimal budgeted policy $V^*$.
- **[[expected-improvement]].** $Q_1$ *is* EI when budget is ample ($\Phi(\zeta)\to1$); B-MS-EI is
  EI's non-myopic, budget-aware generalization. The closed form reuses EI's; the reparameterization
  trick is the same one that defines Monte-Carlo / $q$-EI.
- **[[nonmyopic-cost-constrained-bo]].** The sibling approach. `astudillo2021` plans over a
  **random** horizon (budget depletion) and directly approximates the optimal policy via the tree;
  `lee2021` plans over a **fixed** horizon $h$ and does a single policy-improvement step over a
  hand-chosen base policy. Section *Setting the budget* above borrows the base-policy idea that the
  `lee2021` rollout uses as its core.
- **[[bo-as-dynamic-program]] (rollout).** Both descend from the same finite-budget DP;
  `lam2016`'s rollout approximates the continuation by simulating a base policy, while B-MS-EI
  approximates it by an explicit optimized scenario tree (an open-loop-decision tree solved
  one-shot, vs. closed-loop rollout).
- **[[cost-models]].** Supplies $\mu^{\log c},\sigma^{\log c}$; the $\Phi(\zeta)$ factor is where
  the cost GP enters the acquisition.

## Origin and crosswalk

`astudillo2021` introduces B-MS-EI; the tree-optimization machinery is from Jiang et al. (one-shot
multi-step trees) and the reparameterized fantasy draws from `wilson2018`. `lam2016` is the
homogeneous-cost ancestor (multi-step lookahead by rollout). Both this note and `astudillo2021`
maximize a best-observed utility.

| This note (canonical) | `astudillo2021` | Note |
|---|---|---|
| $Q_n(x\mid\mathcal D)$, B-MS-EI $=Q_N$ | $Q_n(x\mid\mathcal D)$, $\text{B-MS-EI}=Q_N$ | same; $Q$ = state–action value |
| $Q_1=\mathrm{EI}^f(x)\,\Phi(\zeta)\,\mathbf 1\{s(\mathcal D)\le B\}$ | Prop 1 | constrained-EI form |
| $\zeta=(\log(B-s(\mathcal D))-\mu^{\log c}_{\mathcal D})/\sigma^{\log c}_{\mathcal D}$ | $\zeta$ (same) | uses [[cost-models]] log-cost GP |
| fantasy budget $=\min\{\text{base-policy cost},B_n\}$ | §4.3, base policy = EI-PUC-CC | budget scheduling |
| $\mathrm{EI}^f$ over $f$ | $\mathrm{EI}^f$ | the $\mathrm{EI}_n$ of [[notation]] with state arg |
