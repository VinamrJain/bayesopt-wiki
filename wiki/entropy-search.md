---
title: Entropy Search
slug: entropy-search
tags: [acquisition, information-theoretic, lookahead]
requires: [problem-setup, gaussian-process-regression, acquisition-functions, value-of-information, thompson-sampling-bo]
sources: [hennig2012, frazier2018]
---

# Entropy Search

Entropy search (ES) is the information-theoretic acquisition function: it samples where it
expects to **learn the most about the location of the optimum**, not where the optimum is
likely to be. Its central object is $p_\star(x\mid\mathcal D_n)$, the posterior probability
that $x$ is the global optimizer — the same distribution [[thompson-sampling-bo|Thompson
sampling]] draws from, but ES reasons about its *entropy* rather than sampling from it. ES is
the parent of [[predictive-entropy-search]] and [[max-value-entropy-search]], and the
[[value-of-information|value-of-information]] rule under one specific utility: the negative
entropy of $p_\star$. It has no closed form; the bulk of the work (and of this note) is the
approximation pipeline. Symbols follow [[notation]].

> **Notation delta.** $p_\star$ (posterior over the optimizer location) and $H(\cdot)$ are as in
> [[notation]]; new here is the **relative entropy** $H(p\,\|\,b)=\int_A p\log(p/b)\,dx$ to a base
> measure $b$. `hennig2012` minimizes, so writes $p_{\min}$ for $p_\star$ over the *minimizer*; we
> maximize (see crosswalk).

## The utility: negative entropy of $p_\star$

The [[acquisition-functions|value-of-information frame]] scores a candidate by the expected
one-step gain in a knowledge-utility $u(\mathcal D)$,

$$
\alpha_n(x) = E_n\!\big[\,u(\mathcal D_n\cup\{(x,y)\}) - u(\mathcal D_n)\,\big],
\qquad y\mid x,\mathcal D_n \sim \mathrm{Normal}\big(\mu_n(x),\sigma_n^2(x)+\lambda\big).
$$

[[expected-improvement|EI]] takes $u=$ best evaluated value; [[knowledge-gradient|KG]] takes
$u=\mu_n^*$, the best posterior mean. **Entropy search takes the utility to be how sharply we
know *where* the optimum is** — the negative entropy of $p_\star$:

$$
u(\mathcal D) = -H\big(p_\star(\cdot\mid\mathcal D)\big).
$$

Substituting gives the acquisition as an **expected reduction in entropy** of $p_\star$, i.e.
the expected information gained about $x^*$ from one evaluation:

$$
\boxed{\
\alpha_{\mathrm{ES},n}(x) = E_{y\mid x,\mathcal D_n}\!\Big[\,H\big(p_\star(\cdot\mid\mathcal D_n)\big)
- H\big(p_\star(\cdot\mid\mathcal D_n\cup\{(x,y)\})\big)\,\Big]\ }
$$

The first term does not depend on $x$, so maximizing $\alpha_{\mathrm{ES}}$ is equivalent to
*minimizing the expected posterior entropy* $E_y[H(p_\star(\cdot\mid\mathcal D_{n+1}))]$. This
is precisely the mutual information $I\big(x^*;\,y\mid x,\mathcal D_n\big)$ between the unknown
optimizer location and the next observation — the quantity [[predictive-entropy-search|PES]]
computes by a cheaper symmetric decomposition.

Why entropy of $p_\star$ and not, say, expected improvement at $x$? Because the goal is to
*infer the minimum*, the optimal strategy evaluates where it expects to **learn** most about
the optimum, not where it currently thinks the optimum sits. These differ: a sharp spike of
$p_\star$ may be less worth probing than a broad plateau whose resolution would move the belief
more. EI/PI, reading only the marginal at $x$, are blind to this nonlocal effect
(`hennig2012`, §1.3); ES is built around it.

> **Remark — relative entropy, not raw entropy.** `hennig2012` does not use $H(p_\star)$
> directly. Differential entropy is ill-defined on a density (its argument carries units), so
> they use the **relative entropy** (negative KL) to a uniform base measure $\mathbb U_I$ on
> the bounded domain $I$ as the loss, $\mathcal L_{\mathrm{KL}}(p;b)=-\int p\log(p/b)\,dx$ (their
> eq. 25). Maximized at $\mathcal L=0$ for a uniform $p_\star$, diverging to $-\infty$ as
> $p_\star\to$ a Dirac. ES thus moves $p_\star$ *away from uniform, toward a point mass* as
> fast as possible. Up to the constant $\log|I|$ this is the same as minimizing $H(p_\star)$;
> we frame it as negative entropy to match the [[acquisition-functions|hub]], and flag the KL
> form here. (Crucially they reject relative entropy to the *current* $p_\star$: that would
> reward *any* change, not change in the right direction — `hennig2012`, §2.5.)

## Why there is no closed form

$p_\star$ is an integral over the infinite-dimensional space of functions:

$$
p_\star(x\mid\mathcal D_n) = \int_{f} p(f\mid\mathcal D_n)\!\!\prod_{\tilde x\ne x}
\theta\big(f(x)-f(\tilde x)\big)\,df ,
$$

the posterior mass on functions whose maximizer is $x$ ($\theta$ the Heaviside step). Even
restricted to finitely many points it is a Gaussian integral over a polyhedral cone — known to
be analytically intractable. So every quantity ES needs — $p_\star$ itself, its entropy, and
the expected change in that entropy under a future observation — must be approximated. The
pipeline has four stages.

## The approximation pipeline

**1. Discretize the domain (representer points).** Replace the continuum $A$ by $N$
**representer points** $\{\tilde x_i\}_{i=1}^N$ drawn from a non-uniform proposal measure $u$,
sampled by MCMC. Choosing $u$ to concentrate where $p_\star$ has mass (e.g. an EI or PI
surface) puts resolution where it matters and **dodges the $\mathcal O(\exp D)$ cost of a
regular grid** — the move that makes ES viable in $d>1$. The representation is asymptotically
exact for any $u$ with full support; a poor $u$ just needs more points (`hennig2012`, §2.2).
On these points the GP posterior is an $N$-variate Gaussian $\mathrm{Normal}(\tilde\mu,
\tilde\Sigma)$, and $p_\star$ collapses to a discrete distribution $\hat p_\star(\tilde x_i)$.

**2. Approximate $p_\star$ on the grid (Expectation Propagation).** $\hat p_\star(\tilde x_i)$
is still the intractable cone integral. ES estimates it by **EP**: treat the Gaussian belief as
a prior message and each pairwise dominance constraint $\theta(f(\tilde x_i)-f(\tilde x_j))$ as
a factor; EP returns an approximate Gaussian marginal whose normalizer approximates $p_\star$ at
$\tilde x_i$ (`hennig2012`, §2.3). Cost is $\mathcal O(N^4)$ — hence $N\lesssim 1000$, default
$N=50$. EP's decisive advantage over Monte Carlo here is that it yields **analytic
derivatives** $\partial \hat p_\star/\partial\tilde\mu$, $\partial \hat p_\star/\partial
\tilde\Sigma$, needed in stage 4.

**3. Predict the innovation (how an observation reshapes the GP).** A GP gives the *change* in
its own posterior from a future observation at $x$ in closed form. Observing $y$ at $x$ shifts
the mean by a **stochastic** innovation and shrinks the covariance by a **deterministic** one:

$$
\Delta\mu_{x,\Omega}(\cdot) = \Sigma_n(\cdot,x)\,\Sigma_n(x,x)^{-1}\sqrt{\Sigma_n(x,x)+\lambda}\;\Omega,
\qquad
\Delta\Sigma_x(\cdot,\cdot') = \Sigma_n(\cdot,x)\,\Sigma_n(x,x)^{-1}\Sigma_n(x,\cdot'),
$$

with $\Omega\sim\mathrm{Normal}(0,1)$ standing in for the not-yet-observed $y$ (`hennig2012`,
eq. 19). The mean update is random because $y$ is; the variance update is not. This is exactly
the GP's "the value at $x$ is unknown, but its *effect* on beliefs everywhere is known up to one
Gaussian draw" structure — the lever that lets ES be nonlocal.

**4. Average the entropy change (first-order expansion + Monte Carlo).** Push the innovations
of stage 3 through the EP-differentiable $\hat p_\star$ of stage 2 to first order (a Taylor
expansion in $\Delta\mu,\Delta\Sigma$; Itô's lemma supplies the second-order term in the
stochastic mean shift), then average over the Gaussian innovation samples $\Omega$ to get the
expected loss change $\langle\Delta\mathcal L\rangle_x$ (`hennig2012`, eq. 21). Drawing the
$\Omega$ once yields a **differentiable** $\alpha_{\mathrm{ES}}(x)$ reusable across the inner
optimization. The next point is its maximizer.

> **Approximate vs. exact.** Exact: the GP posterior and the innovation formulas (stage 3).
> Approximate: the finite discretization (stage 1), EP for $p_\star$ (stage 2), and the
> first-order + Monte-Carlo expected-entropy-change (stage 4). A fully sampled alternative —
> draw $S$ functions, locate each one's optimum, histogram — is asymptotically exact and
> cheaper per call ($\mathcal O(SN^3)$) but gives no derivatives (the step functions are
> discontinuous), so ES prefers the EP route for the reusable differentiable surface
> (`hennig2012`, §2.3.1).

## One-step and greedy

The exact problem optimizes all $H$ remaining evaluations jointly — a dynamic program with cost
exponential in the horizon ([[bo-as-dynamic-program]]). ES is **greedy**: at each step it picks
the single evaluation that most reduces expected loss now. `hennig2012` (§2.7) justifies this
not by submodularity (unproven for learning the *minimizer*, as opposed to `srinivas2010`'s
result for learning the function) but by the observation that inference problems have "no dead
ends" — a redundant probe wastes a step but never forecloses learning the truth later. So ES
is, like EI and KG, a one-step truncation of the same dynamic program, differing only in the
utility it truncates.

## Relation to other notes

- **[[thompson-sampling-bo|Thompson sampling]] — the zero-computation limit.** TS draws one
  point $x_{n+1}\sim p_\star(\cdot\mid\mathcal D_n)$ and queries it. ES instead computes the
  *entropy* of $p_\star$ and the expected information gain — same target distribution, but TS
  spends no computation reasoning about it (no EP, no innovation expansion), at the cost of
  variance from a single draw. ES is the deliberate, expensive end of the family; TS the cheap,
  randomized end.
- **[[predictive-entropy-search|PES]] — same target, cheaper.** PES keeps the $x^*$ target and
  the mutual-information objective $I(x^*;y\mid x,\mathcal D_n)$ but evaluates it by the
  **symmetric** decomposition $H(p(y\mid x,\mathcal D_n)) - E_{x^*}[H(p(y\mid x,\mathcal
  D_n,x^*))]$ — an entropy over the 1-D *observation* given a sampled optimizer, sidestepping
  ES's EP-over-$p_\star$ and representer-point machinery.
- **[[max-value-entropy-search|MES]] — switch the target to the value.** MES replaces $x^*$
  (a $d$-dimensional location) with $f^*$ (a scalar max-*value*), so the entropy is over a 1-D
  distribution and the acquisition is far cheaper. Same VoI template, different random quantity
  whose entropy is reduced.
- **[[knowledge-gradient|KG]] — same template, different utility.** KG uses $u=\mu_n^*$
  (posterior-mean optimum value) rather than $-H(p_\star)$ (optimizer-location entropy). Both
  are nonlocal one-step VoI rules; KG values *improving the estimate of the optimum's value*, ES
  values *sharpening the estimate of its location*.
- **[[expected-improvement|EI]] / [[probability-of-improvement|PI]] — the local foils.**
  `hennig2012` (§1.3) frames its contribution precisely against EI/PI: those turn the *marginal*
  $\mathrm{Normal}(\mu_n(x),\sigma_n^2(x))$ into a local utility and so cannot credit a sample
  for reshaping beliefs elsewhere. ES's $p_\star$ is a global measure. Notably, ES *reuses* EI/PI
  surfaces — but as the proposal measure $u$ for representer points (stage 1), not as the
  acquisition itself.

## Origin and crosswalk

ES is due to `hennig2012` (Hennig & Schuler, JMLR 2012), which introduced the
$p_\star$-entropy objective and the discretize → EP → innovation → first-order pipeline above;
`frazier2018` presents it in tutorial form as the information-theoretic relaxation of EI's
"benefit accrues at the sampled point" assumption. The paper minimizes and works over the
minimizer $x_{\min}$; we maximize.

| This note (canonical, maximize) | `hennig2012` (minimize) | Note |
|---|---|---|
| $f$ to maximize, $x^*=\operatorname*{arg\,max}f$ | $f$ to minimize, $x_{\min}=\arg\min f$ | sign flip; ES logic is sign-agnostic |
| $p_\star(x\mid\mathcal D_n)$ | $p_{\min}(x)$ (eq. 1), discretized $\hat p_{\min}$, EP est. $\hat q_{\min}$ | posterior over optimizer location; same object |
| $u(\mathcal D)=-H(p_\star)$ | loss $\mathcal L_{\mathrm{KL}}(p_{\min};b)=-\!\int p_{\min}\log(p_{\min}/b)$, $b=\mathbb U_I$ (eq. 25) | negative relative entropy to uniform; we frame as $-H$ |
| $\alpha_{\mathrm{ES},n}(x)=E_y[\,H(p_\star^n)-H(p_\star^{n+1})\,]$ | $-\langle\Delta\mathcal L\rangle_{\mathbf X}$ (eq. 21) | expected loss drop = expected info gain |
| representer points $\{\tilde x_i\}\sim u$, count $N$ | same; $u$ = proposal measure (often EI/PI) | non-uniform discretization |
| innovations $\Delta\mu_{x,\Omega},\Delta\Sigma_x$ | eq. 19; $\Omega\sim\mathrm{Normal}(0,1)$ | mean shift stochastic, covariance shrink deterministic |
| noise variance $\lambda$ | $\sigma^2$ | see [[notation]] |
| $\mu_n,\Sigma_n$ (GP posterior) | $\mu,\Sigma$ conditioned on $(\mathbf X_0,\mathbf Y_0)$ | see [[gaussian-process-regression]] |
