---
title: Problem Setup
slug: problem-setup
tags: [foundations, problem-formulation]
subtopic: foundations
requires: []
sources: [frazier2018, jones98]
summary: "Black-box derivative-free global optimization: the problem BO solves."
grade: concept
reviewed: null
---

# Problem Setup

Bayesian optimization (BayesOpt) is a strategy for **black-box derivative-free global
optimization** of expensive functions. Symbols follow [[notation]].

## The optimization problem

The formal target is

$$
x^* \in \operatorname*{arg\,max}_{x \in A}\, f(x),
$$

where the following properties are assumed to hold (`frazier2018`, §1):

| Property | Assumption |
|---|---|
| Domain | $A \subseteq \mathbb{R}^d$, $d \lesssim 20$; typically a hyper-rectangle or simplex |
| Feasible-set membership | Cheap to check |
| Smoothness | $f$ continuous (required for a GP surrogate; see [[gaussian-process-regression]]) |
| Evaluation cost | Each query of $f$ is **expensive** (minutes–hours, or monetary/opportunity cost); total budget $N$ is small, typically $N \lesssim$ a few hundred |
| Structure | No convexity, linearity, or other exploitable structure — $f$ is a **black box** |
| Derivatives | Unavailable; neither $\nabla f$ nor $\nabla^2 f$ can be observed |
| Noise | **Noise-free by default**: $y_n = f(x_n)$. Stochastic noise $y_n = f(x_n)+\varepsilon_n$, $\varepsilon_n \overset{\mathrm{iid}}{\sim} \mathrm{Normal}(0,\lambda)$, is an extension (see [[acquisition-functions]] and [[expected-improvement]]) |
| Scope | We seek a **global** maximum, not a local one |

> **Remark — hidden continuity assumption.** `frazier2018` lists continuity as a property
> of the objective, but it is really an assumption of convenience for the surrogate: a GP
> prior with a stationary kernel concentrates on continuous sample paths and its posterior
> is well-behaved only if nearby function values are correlated. Nothing about the
> problem definition itself requires continuity; it enters through the choice of surrogate.

> **Remark — dimension.** The $d \lesssim 20$ bound is empirical, not theoretical. GP
> posterior inference scales as $O(n^3)$ in observation count and is otherwise
> dimension-independent; the curse of dimensionality enters through **acquisition
> optimization** (finding $\operatorname*{arg\,max}_x \alpha_n(x)$) and through the
> difficulty of building an accurate global surrogate with a fixed budget. Extensions to
> higher $d$ (random embeddings, additive GPs, etc.) are beyond this note.

## The BayesOpt loop

BayesOpt solves the problem with two interleaved components:

1. **Surrogate** — a probabilistic model of $f$, updated after each observation.
   Invariably a Gaussian process: after $n$ evaluations the posterior is
   $f(x) \mid \mathcal{D}_n \sim \mathrm{Normal}(\mu_n(x),\sigma_n^2(x))$
   for every $x$ (see [[gaussian-process-regression]]).

2. **Acquisition function** $\alpha_n : A \to \mathbb{R}$ — a cheap surrogate-derived
   score measuring the value of sampling $x$ next. The next point is
   $x_{n+1} \in \operatorname*{arg\,max}_{x \in A} \alpha_n(x)$.
   See [[acquisition-functions]] for the taxonomy; [[expected-improvement]] for the default.

Algorithm 1 (`frazier2018`, §2):

```
Place a GP prior on f.
Observe f at n₀ space-filling points.  Set n ← n₀.
While n ≤ N:
    Update the GP posterior using D_n = {(x_m, y_m)}_{m=1}^n.
    Set x_{n+1} ← arg max_{x∈A} α_n(x).
    Observe y_{n+1} = f(x_{n+1}).  Set n ← n + 1.
Return: x with largest observed f(x), or x with largest posterior mean μ_n(x).
```

The **surrogate–acquisition decomposition** is the structural core of BayesOpt:

- The surrogate summarizes all past information about $f$ as a distribution; it is updated
  by Bayes' rule and never directly minimized.
- The acquisition function is the decision rule; it is *cheap* to evaluate and optimize,
  because it is an analytic function of the posterior statistics $(\mu_n, \sigma_n^2)$, not
  of $f$ itself.

Any algorithm fitting this template is a BayesOpt algorithm; the choice of surrogate and
acquisition characterizes a particular algorithm.

> **Remark — the initial design.** `frazier2018` specifies a "space-filling" design of
> $n_0$ points; a common choice is a random Latin hypercube. No acquisition is used for
> the first $n_0$ evaluations — the surrogate is too uninformed for its posterior to guide
> search. The size $n_0$ is a practical hyperparameter: `jones98` recommends $n_0 \approx
> 10d$, which is aggressive for larger $d$ within a budget of a few hundred.

## What "solving" means: performance criteria

BayesOpt does not guarantee finding $x^*$; it minimizes *regret* under a fixed budget $N$.

**Simple regret** after $n$ evaluations:

$$
r_n = f^* - \max_{m \le n} f(x_m) = f^* - f^*_n.
$$

The algorithm is successful if $r_n \to 0$ as $n \to \infty$ (or is small for finite $n$).
Convergence-rate results for EGO-style methods are given in [[ego-convergence-rates]]
(`bull2011`). Note that `frazier2018`'s Algorithm 1 allows returning either the
**best-observed** $\operatorname*{arg\,max}_{m \le n} f(x_m)$ or the point of **largest
posterior mean** $\operatorname*{arg\,max}_{x \in A} \mu_n(x)$; these coincide in the
noise-free case asymptotically but can differ early in the run.

> **Remark — simple vs. cumulative regret.** The regret notion above is *simple* regret
> (gap of the best point found). Bandit-literature connections ([[gp-ucb]], `srinivas2010`)
> use **cumulative regret** $R_N = \sum_{n=1}^N r_n$, which penalizes every evaluation,
> not just the final answer. For a sequential algorithm that ultimately reports one best
> point, simple regret is the operationally natural criterion; cumulative regret is
> tighter mathematically and implies simple regret via $r_N \le R_N / N$.

## Relation to other notes

- [[gaussian-process-regression]] — the surrogate model; its posterior $(\mu_n, \sigma_n^2)$
  feeds every acquisition function.
- [[acquisition-functions]] — taxonomy of all acquisition functions; the inner optimization
  $\operatorname*{arg\,max}_x \alpha_n(x)$ common to all of them.
- [[expected-improvement]] — default acquisition; a one-step Bayes-optimal rule that
  specializes the loop above under a specific reporting assumption.
- [[knowledge-gradient]] — non-myopic acquisition that relaxes EI's single-point reporting
  assumption; same loop, different $\alpha_n$.
- [[bo-as-dynamic-program]] — full decision-theoretic framing of the loop as a
  finite-horizon MDP; shows why myopic acquisitions are approximations.
- [[gp-ucb]] — optimistic acquisition derived from bandit theory; satisfies sublinear
  cumulative-regret bounds that simple-regret acquisitions do not.

## Origin and crosswalk

`frazier2018` frames the problem as **maximization** throughout. `jones98` (EGO) frames it
as **minimization** and uses kriging (DACE) as the surrogate in place of the GP language —
the two surrogates are mathematically identical models under different terminologies.

| This note (canonical, maximize) | `jones98` (EGO, minimize) | Note |
|---|---|---|
| $\max_{x \in A} f(x)$ | $\min_{\mathbf{x}} y(\mathbf{x})$ | sign convention flipped throughout |
| $f^*_n = \max_{m \le n} f(x_m)$ | $f_{\min} = \min(y^{(1)},\ldots,y^{(n)})$ | incumbent; same role, opposite sense |
| GP posterior $\mu_n(x),\,\sigma_n^2(x)$ | DACE predictor $\hat{y}(\mathbf{x})$, mean squared error $s^2(\mathbf{x})$ | same model; see [[gaussian-process-regression]] crosswalk |
| $\alpha_n(x)$, acquisition function | "figure of merit" / expected improvement $\mathrm{E}[I(\mathbf{x})]$ | same concept; `jones98` uses only EI |
| Space-filling initial design | Latin hypercube of $\approx 10d$ points | `jones98` recommends $n_0 = 10d$; `frazier2018` leaves $n_0$ open |
| Budget $N$, iterate while $n \le N$ | Stopping rule: stop when $\mathrm{E}[I] < 1\%$ of current best | `jones98` uses a data-driven stopping rule; `frazier2018` uses a fixed budget |
| Return best observed or best $\mu_n$ | Return minimum of DACE surface after convergence | `jones98`'s branch-and-bound maximizes EI exactly; `frazier2018` defers inner optimization to continuous solvers |
