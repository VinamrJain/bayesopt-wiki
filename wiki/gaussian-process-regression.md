---
title: Gaussian Process Regression
slug: gaussian-process-regression
tags: [surrogate, bayesian-model, foundation]
requires: [problem-setup]
sources: [frazier2018, jones98, srinivas2010]
---

# Gaussian Process Regression

GP regression is the statistical model underneath Bayesian optimization: a Bayesian prior
over the unknown objective $f$ that, conditioned on observations, returns a closed-form
posterior — a normal distribution over $f(x)$ at every candidate $x$. Its posterior mean
$\mu_n(x)$ is the surrogate's point estimate and its posterior variance $\sigma_n^2(x)$ is
the calibrated uncertainty; together they feed every acquisition function (see
[[acquisition-functions]]). This note derives that posterior. Symbols follow [[notation]].

## Prior: a Gaussian over function values

Fix any finite set of points $x_{1:k}$ and collect the function's values into the vector
$f(x_{1:k}) = [f(x_1),\dots,f(x_k)]$. GP regression's modelling assumption is that this
vector is multivariate normal,

$$
f(x_{1:k}) \sim \mathrm{Normal}\!\big(\mu_0(x_{1:k}),\ \Sigma_0(x_{1:k},x_{1:k})\big),
$$

with the mean vector built by evaluating a **mean function** $\mu_0$ at each $x_i$ and the
covariance matrix built by evaluating a **kernel** $\Sigma_0$ at each pair $(x_i,x_j)$. The
kernel is chosen so that inputs close in $A$ are strongly positively correlated — encoding
the belief that nearby points have similar values — and so that $\Sigma_0(x_{1:k},x_{1:k})$
is positive semi-definite for *every* choice of points. That last property is what makes the
prior coherent across all finite subsets simultaneously, and is exactly the condition for a
**Gaussian process** to exist over the whole domain (below).

## Posterior: conditioning on noise-free observations

Suppose we have observed $f(x_{1:n})$ exactly and want the distribution of $f(x)$ at a new
point $x$. Take $k=n+1$ with $x_{k}=x$, so the prior over $[f(x_{1:n}),\,f(x)]$ is the joint
normal above. The conditional distribution of one block of a joint Gaussian given another is
again Gaussian, and applying that standard identity yields the posterior

$$
f(x)\mid f(x_{1:n}) \sim \mathrm{Normal}\!\big(\mu_n(x),\ \sigma_n^2(x)\big),
$$
$$
\mu_n(x) = \mu_0(x) + \Sigma_0(x,x_{1:n})\,\Sigma_0(x_{1:n},x_{1:n})^{-1}\big(f(x_{1:n})-\mu_0(x_{1:n})\big),
$$
$$
\sigma_n^2(x) = \Sigma_0(x,x) - \Sigma_0(x,x_{1:n})\,\Sigma_0(x_{1:n},x_{1:n})^{-1}\,\Sigma_0(x_{1:n},x).
$$

Two readings make these formulas intuitive:

- The **mean** is the prior mean $\mu_0(x)$ corrected by the observed residuals
  $f(x_{1:n})-\mu_0(x_{1:n})$, weighted by how strongly $x$ correlates with the data
  (the row $\Sigma_0(x,x_{1:n})$ filtered through the data's inverse covariance). At an
  observed point it reproduces the observation exactly: $\mu_n(x_i)=f(x_i)$ — the surrogate
  **interpolates** the data.
- The **variance** is the prior variance $\Sigma_0(x,x)$ *minus* the uncertainty removed by
  the observations. It is $0$ at observed points and grows with distance from them. Note it
  does not depend on the observed *values* $f(x_{1:n})$ at all — only on *where* we sampled.

> **Remark (computation).** Do not invert $\Sigma_0(x_{1:n},x_{1:n})$ directly. Factor it
> once by Cholesky and solve triangular systems — faster and more stable. Adding a small
> jitter ($\sim 10^{-6}$) to the diagonal keeps it from becoming numerically singular when
> two sample points are close, perturbing predictions only negligibly.

## From finite vectors to a process over $A$

Everything above used only finitely many points, yet the same object models $f$ over the
whole continuous domain. Formally, a **Gaussian process** with mean function $\mu_0$ and
kernel $\Sigma_0$ is a distribution over functions $f$ such that, for *any* finite collection
$x_{1:k}$, the marginal law of $f(x_{1:k})$ is the joint normal of the prior. The conditioning
argument is unchanged, so the posterior over $f$ given $f(x_{1:n})$ is **again a Gaussian
process**, with mean function $\mu_n$ and a posterior kernel. One may therefore predict at a
single new point or jointly at many; the joint posterior over several unevaluated points is
multivariate normal with the analogous mean vector and covariance matrix — the fact that
acquisition functions over batches (e.g. parallel [[expected-improvement]]) rely on.

## Mean function and kernel

The kernel encodes smoothness beliefs. Two standard choices (`frazier2018`):

$$
\text{power-exponential / Gaussian:}\quad \Sigma_0(x,x') = \alpha_0\exp\!\big(-\textstyle\sum_{i=1}^d \alpha_i (x_i-x_i')^2\big),
$$
$$
\text{Matérn:}\quad \Sigma_0(x,x') = \alpha_0\,\frac{2^{1-\nu}}{\Gamma(\nu)}\big(\sqrt{2\nu}\,\|x-x'\|\big)^\nu K_\nu\!\big(\sqrt{2\nu}\,\|x-x'\|\big),
$$

with $K_\nu$ the modified Bessel function. The length-scale parameters $\alpha_{1:d}$ control
how fast $f$ is believed to vary in each coordinate; $\nu$ controls Matérn sample-path
smoothness. The mean function is most often a constant $\mu_0(x)=\mu$, optionally augmented
with a parametric trend $\mu_0(x)=\mu+\sum_i\beta_i\Psi_i(x)$. Choosing the hyperparameters
$\eta=(\alpha_{0:d},\nu,\mu,\dots)$ — by MLE, MAP, or the fully Bayesian marginalization — is
the subject of [[gp-hyperparameters]]; the kernel's smoothness class also governs the
convergence theory ([[ego-convergence-rates]], [[regret-gp-bandits]]).

## Noisy observations

With i.i.d. Gaussian observation noise $\varepsilon_n\sim\mathrm{Normal}(0,\lambda)$, the model
extends by adding $\lambda I$ to the data covariance: replace
$\Sigma_0(x_{1:n},x_{1:n})$ with $\Sigma_0(x_{1:n},x_{1:n})+\lambda I$ in the posterior
formulas. The posterior variance is then positive even at observed points — observing a noisy
point no longer pins down $f$ there — which is exactly what forces the acquisition redesign in
[[expected-improvement]]'s noisy case and motivates [[knowledge-gradient]]. See
[[noisy-evaluations]] for the modelling details.

## Relation to other notes

- The posterior $(\mu_n,\sigma_n)$ is the *only* interface the surrogate exposes to
  acquisition functions: EI, PI, GP-UCB, KG, and entropy search are all functionals of it.
- `jones98`'s **kriging** is GP regression under another name (origin of the EGO algorithm);
  `srinivas2010` builds the **GP-bandit** regret theory ([[regret-gp-bandits]]) directly on
  the posterior-variance formula above, since its information gain is a function of the
  $\sigma_n^2$ reduction.

## Crosswalk

| This note (canonical) | `jones98` (kriging) | `srinivas2010` | Note |
|---|---|---|---|
| $\mu_n(x)$, posterior mean | $\hat y(x)$, kriging predictor | $\mu_{t}(x)$ | same object |
| $\sigma_n^2(x)$, posterior variance | $s^2(x)$, kriging variance | $\sigma_{t}^2(x)$ | same object |
| $\Sigma_0$, kernel | correlation $R$ + process variance $\sigma^2$ | $k(x,x')$ | `jones98` factors scale out of a correlation matrix |
| maximize $f$ | minimize (EGO) | maximize (regret vs. $\max f$) | sign convention; we maximize |
