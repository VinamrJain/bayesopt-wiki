---
title: GP-UCB and the Optimism Principle
slug: gp-ucb
tags: [acquisition, optimistic, bandit, theory-adjacent]
requires: [problem-setup, gaussian-process-regression]
sources: [srinivas2010, frazier2018]
summary: "Optimism-in-the-face-of-uncertainty: the regret-bearing upper-confidence-bound rule."
grade: derivation
reviewed: null
---

# GP-UCB and the Optimism Principle

GP-UCB is the **optimism-in-the-face-of-uncertainty** acquisition: at each step act as if the
objective were as large as the posterior plausibly allows, then sample where that optimistic
estimate is highest. Unlike improvement-based rules ([[expected-improvement]],
[[probability-of-improvement]]), which weigh mean against uncertainty *implicitly* through a
$\Phi/\varphi$ closed form, GP-UCB makes the tradeoff a single **explicit additive knob**
$\beta_n$ — and it is the one common acquisition that comes with a **high-probability sublinear
regret guarantee** (`srinivas2010`). It recasts Bayesian optimization as a **Gaussian-process
bandit**, where the goal is cumulative reward rather than only the final best point. Symbols
follow [[notation]].

> **Notation delta.** The maximum information gain $\gamma_T$, the failure probability
> $\delta\in(0,1)$, and $I(\cdot\,;\cdot)$, $H(\cdot)$ are as in [[notation]]; $\gamma_T$ is the
> kernel-dependent quantity that controls the regret bound below. `srinivas2010` indexes by round
> $t$ with posterior $\mu_{t-1},\sigma_{t-1}$; we index by $n$ evaluations with $\mu_n,\sigma_n$
> (crosswalk below).

## The acquisition

Two naive rules bracket the problem. Pure exploitation, $x_{n+1}\in\operatorname*{arg\,max}_x
\mu_n(x)$, chases the current posterior mean and gets stuck in shallow optima — it never tests
regions it has not yet seen. Pure exploration, $x_{n+1}\in\operatorname*{arg\,max}_x \sigma_n(x)$
(the [[entropy-search|experimental-design]] rule, which does not even look at the observed
values), shrinks global uncertainty but wastes samples far from any maximum. GP-UCB linearly
combines them:

$$
\boxed{\ \mathrm{UCB}_n(x) := \mu_n(x) + \beta_n^{1/2}\,\sigma_n(x)\ },
\qquad x_{n+1}\in\operatorname*{arg\,max}_{x\in A}\mathrm{UCB}_n(x).
$$

The name is literal: under the GP posterior $f(x)\mid\mathcal D_n\sim
\mathrm{Normal}(\mu_n(x),\sigma_n^2(x))$ ([[gaussian-process-regression]]), the quantity
$\mu_n(x)+\beta_n^{1/2}\sigma_n(x)$ is an **upper quantile** of the marginal posterior at $x$ —
a value that $f(x)$ exceeds with controlled probability. Sampling its maximizer greedily picks
the point whose *plausible best case* is largest, so that $\mathrm{UCB}_n(x)$ is, with high
probability and a correctly chosen $\beta_n$, a valid upper bound on $f(x^*)$. Optimism is thus
not a heuristic flourish: it is exactly what makes the selected index a confidence bound on the
unknown optimum, which is what the regret analysis then exploits.

**The knob.** $\beta_n^{1/2}$ is the explicit weight on uncertainty:

- **Large $\beta_n$ $\Rightarrow$ explore.** The $\sigma_n$ term dominates; GP-UCB favors
  uncertain points (wide credible interval), behaving like the pure-exploration rule.
- **Small $\beta_n$ $\Rightarrow$ exploit.** The $\mu_n$ term dominates; GP-UCB chases the
  posterior mean, behaving like pure exploitation.

This is the same exploration/exploitation tension named in bandits and reinforcement learning
(`frazier2018`), but here it is a turned dial rather than an emergent property of a closed
form. The whole theoretical content of GP-UCB is the **prescription for $\beta_n$** that keeps
the index a legitimate confidence bound at every round simultaneously.

## The $\beta_t$ schedule

A single confidence interval $\mu_n(x)\pm\beta^{1/2}\sigma_n(x)$ holds with some fixed
probability. But GP-UCB needs the bound to hold **for every candidate point and every round at
once** — otherwise a single round where the optimistic index undershoots $f(x^*)$ can derail the
argument. A **union bound** over these many confidence statements forces $\beta_n$ to grow with
the number of statements being controlled, i.e. with the round index and the size of the domain.

For finite $D$, `srinivas2010` (Theorem 1) makes this explicit. With failure probability
$\delta$,

$$
\beta_t = 2\log\!\Big(\frac{|D|\,t^2\pi^2}{6\delta}\Big),
$$

which grows like $\log t$ (plus a $\log|D|$ term): the $t^2$ inside the log absorbs a union
bound over rounds via $\sum_t t^{-2}=\pi^2/6\le$ a finite constant, so the total failure
probability stays below $\delta$ across all $t$. For continuous $D\subset[0,r]^d$ (Theorem 2),
the $\log|D|$ is replaced by a discretization argument and $\beta_t$ picks up an additive
$2d\log(t^2\,dbr\sqrt{\log(4da/\delta)})$ term — same $\log t$ growth, now with an explicit
$d$-dependence from covering the continuum. In the agnostic RKHS setting (Theorem 3),
$\beta_t = 2B + 300\,\gamma_t\log^3(t/\delta)$ couples $\beta_t$ to the information gain itself.

> **Remark — the theoretical $\beta_t$ is badly over-conservative.** The schedules above are
> tuned to make a *worst-case, all-rounds-simultaneously* union bound go through, so they are
> far larger than what good average-case behavior needs. `srinivas2010`'s own experiments scale
> $\beta_t$ **down by a factor of 5** (chosen by cross-validation) for competitive performance,
> and note they "did not optimize constants." In practice the theoretical constant is widely
> ignored: practitioners treat $\beta_n^{1/2}$ as a tunable exploration coefficient (often a
> small fixed constant, e.g. $\sqrt{\beta}\approx 2$–$3$), accepting that the regret theorem no
> longer literally applies. The honest reading: the schedule's *functional form* ($\sim\log t$
> growth, $d$-dependence) is the lasting insight; its *constants* are a proof artifact, not a
> recommendation.

## Regret: what the guarantee says

GP-UCB's distinguishing feature is a performance guarantee phrased in **cumulative regret**.
With instantaneous regret $r_t = f(x^*) - f(x_t)$ (the reward lost at round $t$ by not playing
the optimum) and cumulative regret

$$
R_T = \sum_{t=1}^{T} r_t = \sum_{t=1}^{T}\big(f(x^*)-f(x_t)\big),
$$

an algorithm is **no-regret** if $R_T/T\to 0$, i.e. the time-averaged loss vanishes. This is
strictly a property of the *whole sampling trajectory*, not just the final incumbent — which is
why GP-UCB is naturally a bandit method. Sublinearity also implies convergence of the best point
found: since $\max_{t\le T} f(x_t)$ is at least the average reward, $R_T/T\to0$ forces
$f(x^*)-\max_{t\le T}f(x_t)\to 0$.

The bound (`srinivas2010`, Theorems 1–3, stated here, **not proved** — see
[[regret-gp-bandits]]) is, with probability $\ge 1-\delta$ and uniformly over $T$,

$$
R_T = \mathcal O^*\!\big(\sqrt{T\,\beta_T\,\gamma_T}\big),
$$

where $\mathcal O^*$ suppresses log factors and $\gamma_T$ is the **maximum information gain**
(notation delta). Two factors make this sublinear:

- $\beta_T$ grows only **logarithmically** in $T$ (schedule above).
- $\gamma_T$ grows **sublinearly** in $T$ for the usual kernels, because each added observation
  yields *diminishing* information (the set function $S\mapsto I(\boldsymbol y_S;\boldsymbol f_S)$
  is submodular). `srinivas2010` bounds it via the kernel's spectral decay: $\gamma_T =
  \mathcal O(d\log T)$ (linear kernel), $\mathcal O((\log T)^{d+1})$ (squared-exponential),
  $\mathcal O(T^{d(d+1)/(2\nu+d(d+1))}\log T)$ (Matérn, $\nu>1$).

So $R_T = \mathcal O^*(\sqrt{T\,\gamma_T\beta_T})$ is $\tilde{\mathcal O}(\sqrt T\cdot\text{slow})$
— sublinear, hence no-regret. The conceptual payoff is the **information gain $\leftrightarrow$
regret bridge**: how well GP-UCB optimizes is controlled by how fast the kernel lets one *learn*
$f$, tying optimization (a bandit objective) to experimental design (an information objective).
The smoother the kernel, the slower $\gamma_T$ grows, the tighter the regret — and for the
squared-exponential kernel the dimension $d$ enters $\gamma_T$ only inside a $\log$, so the
bound has strikingly weak dependence on $d$. The full proof — confidence-ellipsoid volume
growth related to $\gamma_T$, the union-bound bookkeeping, and the $\gamma_T$ kernel bounds —
lives in [[regret-gp-bandits]] and is not reproduced here.

## Relation to other acquisitions

GP-UCB is best understood **against** the improvement- and information-based families; all three
trade posterior mean against posterior uncertainty, but encode the tradeoff differently.

- **vs. [[expected-improvement]] / [[probability-of-improvement]].** EI and PI fold the
  mean/uncertainty balance into a closed form: EI rewards both $\Delta_n(x)=\mu_n-f^*_n$ and
  $\sigma_n(x)$ *implicitly* (its iso-curves in the $(\Delta,\sigma)$ plane), with **no tunable
  weight**. GP-UCB instead exposes the weight as the explicit additive knob $\beta_n^{1/2}$.
  The trade: EI/PI need no schedule and are parameter-free, but lack a regret guarantee; GP-UCB
  carries the guarantee at the cost of choosing $\beta_n$ (and the theoretical choice is
  unusable in practice — see Remark). All are **myopic**: like EI, GP-UCB sees the posterior
  only through the marginal at $x$, so it cannot credit a sample for reshaping beliefs elsewhere
  (contrast [[knowledge-gradient]]).
- **vs. [[thompson-sampling-bo]].** Thompson sampling is the **randomized analogue of
  optimism**: rather than acting on a deterministic upper quantile $\mu_n+\beta_n^{1/2}\sigma_n$,
  it draws a function $\tilde f$ from the posterior and maximizes that sample,
  $x_{n+1}\in\operatorname*{arg\,max}_x\tilde f(x)$. A posterior draw is occasionally optimistic
  by chance exactly where uncertainty is high, so TS explores for the same reason GP-UCB does —
  via sampling rather than via an explicit bonus. The two enjoy closely related regret analyses.
- **vs. information-based ([[entropy-search]]).** Pure-exploration / experimental design
  ($\operatorname*{arg\,max}_x\sigma_n$) and entropy search optimize *information about $f$ or
  about $x^*$* directly; GP-UCB optimizes reward but **inherits** an information quantity
  ($\gamma_T$) in its bound. This is the technical bridge `srinivas2010` draws between bandit
  optimization and experimental design.

A unifying read for the [[acquisition-functions]] hub: EI/PI (improvement), GP-UCB (optimism),
Thompson sampling (randomized optimism), and entropy search (information) are four answers to
the *same* exploration/exploitation question, differing in **how** plausible-but-unobserved
high values are credited — as expected improvement, as a deterministic confidence bonus, as a
random posterior draw, or as information gained.

## Crosswalk

`srinivas2010` works in a **minimization-of-regret / maximization-of-reward** bandit framing
with round index $t$ and posterior conditioned on $t-1$ observations; we maximize $f$ and index
by $n$ evaluations. `frazier2018` does not treat GP-UCB directly — it contributes only the
shared exploration/exploitation framing (its §“other acquisition functions” covers EI, KG,
entropy search), so it appears here for intuition, not for a derivation.

| This note (canonical, maximize) | `srinivas2010` | Note |
|---|---|---|
| $\mathrm{UCB}_n(x)=\mu_n(x)+\beta_n^{1/2}\sigma_n(x)$ | $\mu_{t-1}(x)+\beta_t^{1/2}\sigma_{t-1}(x)$ (eq. 6) | round $t$ ↔ $n{+}1$ evaluations; $\mu_{t-1},\sigma_{t-1}$ ↔ $\mu_n,\sigma_n$ |
| $A$ (feasible set) | $D$ (decision set) | same object |
| $\lambda$ (noise variance) | $\sigma^2$ | `srinivas2010`'s $\sigma$ is noise s.d.; distinct from $\sigma_n(x)$ |
| $\sigma_n(x)$ (posterior s.d.) | $\sigma_{t-1}(x)$ | posterior, not noise |
| $f^* = f(x^*)$ (global max value) | $f(x^*)$, $x^*=\operatorname*{arg\,max}_D f$ | identical; they then study regret to it |
| $\gamma_T$ (max information gain) | $\gamma_T$ (eq. 7) | same symbol; see [[notation]] |
| $R_T=\sum_t (f(x^*)-f(x_t))$ | $R_T=\sum_t r_t$, $r_t=f(x^*)-f(x_t)$ | identical (we both maximize reward here) |
| $\beta_n$ (exploration weight) | $\beta_t$ (Thms 1–3) | reconciled to $n$-indexing; schedules above |
