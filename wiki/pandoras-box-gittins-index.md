---
title: Pandora's Box Gittins Index (PBGI)
slug: pandoras-box-gittins-index
tags: [cost-aware, acquisition, decision-theoretic]
subtopic: cost-aware
requires: [cost-aware-bo, ei-per-unit-cost, expected-improvement, budget-constrained-dp]
sources: [xie2024, astudillo2021]
summary: "Pandora's-box Gittins fair-value acquisition (PBGI); optimal index, small-lambda to UCB limit."
grade: derivation
reviewed: null
---

# Pandora's Box Gittins Index (PBGI)

The myopic cost-aware rules divide an acquisition by cost ([[ei-per-unit-cost|EIpu]]); the
non-myopic ones approximate a multi-step DP ([[multistep-budgeted-bo]], [[nonmyopic-cost-constrained-bo]]).
**PBGI** (`xie2024`) takes a third route: it *exactly* solves a different simplification of the
cost-aware DP — not a temporal one-step truncation (which gives EI) but a **spatial** one, dropping
the posterior's correlations. The resulting acquisition is the **Gittins index** of the classical
**Pandora's Box** problem, reinterpreted for BO. It scores each point by a *threshold* rather than a
ratio, is computed about as cheaply as EI, and supplies the budget-sensitivity EIpu structurally
lacks. The stopping rule it pairs with, and the cost-adjusted-regret theory, live in
[[cost-aware-stopping]]. Symbols follow [[notation]].

> **Notation delta.**
> - $\mathrm{EI}(x;g)=E\big[(f(x)-g)^+\mid\mathcal D_t\big]$ — expected improvement of $f$ above an
>   **arbitrary threshold** $g$ (standard $\mathrm{EI}_t$ is $g=f^*_t$); strictly *decreasing* in $g$.
> - $\alpha^{\mathrm{PBGI}}_t(x)$ — the PBGI acquisition (the Gittins index / **fair value** of $x$).
> - $\lambda>0$ — cost-scaling factor; $f^*_t=\max_{m\le t}y_m$ the incumbent.

## The Pandora's Box problem

Pandora faces $N$ closed boxes $X=\{1,\dots,N\}$. Box $x$ hides a **reward** $f(x)$, drawn from a
*known, independent* distribution, behind an **inspection cost** $c(x)$. At each step she either
opens a box (pay $c(x)$, reveal $f(x)$) or stops and keeps the best reward opened so far. She
maximizes expected net utility (`xie2024`, §3.1)

$$
E\,\max_{1\le t\le T}f(x_t)\;-\;E\sum_{t=1}^{T}c(x_t),
$$

with $T$ the (random) number of boxes opened. Subtracting this from the constant $E\sup_x f(x)$
turns it into **simple regret plus cumulative cost** — i.e. Pandora's Box *is* the **cost-per-sample**
cost-aware BO problem ([[cost-aware-bo]]) restricted to a **discrete** domain with an
**uncorrelated** objective. That restriction is exactly what makes it solvable in closed form.

## The Gittins index is a fair value

Associate with each box a number $\alpha^\star(x)$ — its **Gittins index** — defined as the
threshold at which expected improvement above it equals the inspection cost:

$$
\boxed{\ \alpha^\star(x)=g\quad\text{such that}\quad \mathrm{EI}_f(x;g)=c(x)\ }
$$

Since $\mathrm{EI}_f(x;g)$ is strictly decreasing in $g$, the root is unique (found by bisection).
The derivation is a one-box indifference argument (`xie2024`, App. A.1): with one closed box $x$ and
one open box of value $g$, opening is worth $E[\max(f(x),g)]-c(x)$ and stopping is worth $g$; the two
are equal precisely when

$$
E\big[\max(f(x)-g,\,0)\big]=c(x),
$$

the expected-improvement equation above. So $\alpha^\star(x)$ answers: *how large must an alternative
reward be for stopping to be as good as opening box $x$* — a **fair value** that makes
heterogeneous boxes directly comparable. Weitzman's theorem says ranking by fair value is not just
reasonable but **optimal**:

> **Theorem (Weitzman; `xie2024`, Thm 1).** For the cost-per-sample Pandora's Box problem (finite
> $X$, independent $f(x)$, costs deterministic w.l.o.g.), the policy that **opens the box of maximum
> Gittins index** $\alpha^\star$, with the stopping rule *stop once the incumbent $f^*_t$ exceeds
> every unopened box's index*, is **Bayesian-optimal**.

The Gittins-index trick (Weitzman; Gittins more generally): replace each closed box by an open box
of value $g$ solving the indifference equation, *without changing the optimal policy* — collapsing a
many-box lookahead into per-box scalars.

## From boxes to Bayesian optimization

Two gaps separate Pandora's Box from BO: the domain is continuous, and the GP posterior is
**correlated**. PBGI bridges them in the most direct way (`xie2024`, §3.3) — at step $t$, plug the
**posterior** $f\mid x_{1:t},y_{1:t}$ in for $f$ and recompute the index:

$$
\alpha^{\mathrm{PBGI}}_t(x)=g\quad\text{such that}\quad
\mathrm{EI}_{f\mid x_{1:t},y_{1:t}}(x;g)=\lambda\,c(x),
\qquad x_{t+1}\in\operatorname*{arg\,max}_x\alpha^{\mathrm{PBGI}}_t(x),
$$

with $\alpha^{\mathrm{PBGI}}_t(x)=f(x)$ at evaluated points, and a cost-scaling $\lambda$ (next
section). This is an **approximation** for correlated $f$ — exact only if the posterior factorizes —
but a principled one:

> **Spatial vs. temporal simplification.** [[expected-improvement|EI]] is derived by exactly solving
> a *temporally* simplified DP — pretend only **one step** remains. PBGI is derived by exactly
> solving a *spatially* simplified DP — pretend the posterior has **no correlations** (`xie2024`,
> §3.3). EI truncates the horizon; PBGI truncates the dependence structure. Both then run the exact
> optimum of their simplified problem on the true posterior.

The reading predicts *where* PBGI wins: when correlations are not the decisive factor — high-dimensional
problems, where the search volume is large and most points are far apart, so the posterior looks
locally uncorrelated. `xie2024` confirms this empirically (strongest at moderate-to-high $d$), and —
strikingly — the advantage carries over to **uniform-cost** classical BO, since high dimension alone
pushes the problem toward the uncorrelated Pandora regime.

## The cost-scaling λ: a risk knob and a budget handle

The factor $\lambda$ is where PBGI gains the budget-awareness [[ei-per-unit-cost|EIpu]] cannot
express (EIpu picks the same point whether $c\equiv10^{-4}$ or $10^{6}$). It tunes risk:

- **Large $\lambda$** ⇒ costs loom large ⇒ conservative; $\alpha^{\mathrm{PBGI}}_t$ resembles
  [[expected-improvement|EI]].
- **Small $\lambda$** ⇒ costs negligible ⇒ exploratory. In the $\lambda\to0$ limit (`xie2024`, §3.4),
  $$
  \alpha^{\mathrm{PBGI}}_t(x)\approx\mu_t(x)+\sigma_t(x)\sqrt{2\log\tfrac{\sigma_t(x)}{\lambda\,c(x)}},
  $$
  a [[gp-ucb|UCB]] whose per-point exploration weight is set **automatically** from $\sigma_t$ and
  $c(x)$ — PBGI auto-tunes UCB's confidence parameter, weighting high variance more than EI does.

`xie2024` (Thm 2, via Lagrangian relaxation) ties $\lambda$ to a budget: for an **expected budget**
$E[\sum c(x_t)]\le B$ ([[budget-constrained-dp]]) that is feasible and active
($\min_x c<B<\sum_x c$), there **exists** a $\lambda>0$ for which maximizing
$\alpha^{\mathrm{PBGI}}$ with costs $\lambda c(x)$ is Bayesian-optimal — larger $\lambda$ matching
smaller budgets. The theorem gives only *existence* (the optimal $\lambda$ solves an implicit convex
problem); [[cost-aware-stopping]] turns it into an **explicit** choice $\lambda=U/(B-C)$ via a
spend bound. Three usage modes (`xie2024`, §3.3):

| Mode | Role of $\lambda$ |
|---|---|
| **Budget-constrained** | $\lambda$ tuned (or set by the budget rule) to match $B$ |
| **Cost-per-sample** | $\lambda$ a *fixed* unit-conversion constant (objective↔cost units) |
| **Adaptive decay (PBGI-D)** | $\lambda_t$ decayed by factor $\beta>1$ whenever the [[cost-aware-stopping\|stopping rule]] would trigger; robust to mis-set $\lambda$ |

## Computation and unknown costs

PBGI is cheap. Monotonicity of $g\mapsto\mathrm{EI}(x;g)$ makes the threshold a 1-D **bisection**,
and the gradient $\nabla_x\alpha^{\mathrm{PBGI}}$ has a closed form (no inner optimization), so cost
is comparable to [[expected-improvement|EI]] — far below multi-step lookahead
([[multistep-budgeted-bo]]) (`xie2024`, §3.3, App.). When cost is **unknown**, model $\log c$ as a
GP ([[cost-models]], following `astudillo2021`); the index and theory are unchanged after replacing
$c(x)$ by its log-normal mean $E[c(x)]=\exp(\mu_{\log c}(x)+\tfrac12\sigma_{\log c}^2(x))$ —
stochastic cost affects performance but not the optimal strategy (`xie2024`, Thm 1 extension).

## Relation to other notes

- **[[ei-per-unit-cost]].** The contrast that defines PBGI. EIpu/LogEIPC score by a **ratio**
  $\mathrm{EI}/c$ (a myopic, temporal heuristic); PBGI scores by a **threshold** $g$ solving
  $\mathrm{EI}(x;g)=\lambda c(x)$ (the exact solution of a spatially-simplified DP). On the
  `astudillo2021` counterexample where EIpu is arbitrarily bad ([[budget-constrained-dp]]), PBGI does
  not get stuck.
- **[[expected-improvement]].** EI is the temporal one-step rule, PBGI the spatial uncorrelated-DP
  rule; both reduce to root-finding/closed forms over EI. Large-$\lambda$ PBGI ≈ EI.
- **[[gp-ucb]].** PBGI's $\lambda\to0$ limit is a UCB with a cost-and-variance-driven exploration
  weight — a principled auto-tuning of $\beta_t$.
- **[[cost-aware-stopping]].** Owns the **stopping rule** that completes the Gittins policy (and
  makes it optimal) and the cost-adjusted-regret guarantees; this note owns the **acquisition**.
- **[[budget-constrained-dp]].** Supplies the expected-budget setting $\lambda$ is tuned against;
  PBGI is a cheap myopic-looking surrogate that nonetheless prices the budget through $\lambda$.
- **[[cost-aware-bo]].** PBGI is the cost-per-sample branch's acquisition, alongside LogEIPC.

## Origin and crosswalk

`xie2024` introduces PBGI, the Pandora's-Box↔BO connection, the budget-equivalence theorem, and
PBGI-D; Weitzman (1979) and Gittins are the classical sources for the index and its optimality.
`xie2024` already works in the wiki's **maximization** convention, so definitions transfer verbatim.

| This note (canonical) | `xie2024` | Note |
|---|---|---|
| $\alpha^\star(x)=g$ s.t. $\mathrm{EI}_f(x;g)=c(x)$ | eq. (Gittins index) | fair value; decreasing-in-$g$ root |
| $\alpha^{\mathrm{PBGI}}_t(x)$ with $\mathrm{EI}_{f\mid\mathcal D_t}(x;g)=\lambda c(x)$ | eq. (PBGI) | posterior plugged in; $\lambda$ scales cost |
| stop when $f^*_t\ge\max_x\alpha^{\mathrm{PBGI}}_t(x)$ | Gittins stopping rule | completed in [[cost-aware-stopping]] |
| $\lambda$ risk knob; budget-existence (Thm 2) | $\lambda$, Thm 2 | explicit $\lambda=U/(B-C)$ in [[cost-aware-stopping]] |
| PBGI-D: decay $\lambda_t/\beta$ on stop-trigger | PBGI-D | adaptive-decay variant |
| small-$\lambda$ UCB limit | §3.4 | auto-tuned [[gp-ucb]] |
