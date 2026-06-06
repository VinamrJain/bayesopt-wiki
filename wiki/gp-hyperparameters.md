---
title: GP Hyperparameters
slug: gp-hyperparameters
tags: [surrogate, bayesian-model, inference]
subtopic: foundations
requires: [gaussian-process-regression, problem-setup]
sources: [snoek2012, frazier2018]
summary: "Fitting GP kernel/mean hyperparameters: MLE, MAP, fully-Bayesian marginalization."
grade: derivation
reviewed: 2026-06-06
---

# GP Hyperparameters

Every [[gaussian-process-regression|GP surrogate]] is governed by a vector of
**hyperparameters** $\eta$ — parameters of the prior, not of the objective $f$.
Until $\eta$ is fixed or integrated out, the posterior $(\mu_n, \sigma_n^2)$ is
not fully determined, and hence neither is any acquisition function. This note
covers how $\eta$ is set (MLE/MAP point estimates) and how it is properly removed
(fully-Bayesian marginalization), and derives the **integrated acquisition
function** that results. Symbols follow [[notation]].

**Notation delta.** $\theta$ — hyperparameter vector in `snoek2012`'s notation
(equivalent to $\eta$ in the canonical table; see crosswalk). $p(\eta \mid
\mathcal{D}_n)$ — hyperparameter posterior; $p(\eta)$ — hyperprior.
$\hat\alpha(\cdot)$ — integrated acquisition function.

## What the hyperparameters are

For the ARD Matérn-$5/2$ kernel with constant mean (the practical default
recommended by `snoek2012`), the hyperparameter vector is

$$
\eta = (\sigma_f^2,\; \ell_{1:d},\; \lambda,\; m),
$$

comprising $d+3$ scalars: the output scale $\sigma_f^2$, per-dimension
length-scales $\ell_{1:d}$, noise variance $\lambda$, and constant mean $m$.

Their role is immediate: the posterior mean $\mu_n(x)$ and variance $\sigma_n^2(x)$
from [[gaussian-process-regression]] are computed from
$\Sigma_0(x_{1:n},x_{1:n})$ and $\Sigma_0(x,x_{1:n})$, which are functions of
$(\sigma_f^2, \ell_{1:d})$; the noise term $\lambda I$ enters the data covariance;
and the mean function enters the residual. A misspecified $\eta$ distorts the
entire posterior: over-large length-scales smooth away real variation; under-large
ones overfit; wrong noise $\lambda$ inflates or deflates $\sigma_n^2$. Since every
acquisition function is a functional of $(\mu_n, \sigma_n^2)$, **hyperparameter
errors propagate directly into sampling decisions**.

## Point estimation: MLE and MAP

### Marginal likelihood (evidence)

Given the GP model with hyperparameters $\eta$ and noisy observations
$y_{1:n} = f(x_{1:n}) + \varepsilon_{1:n}$, the observations are jointly normal:

$$
y_{1:n} \mid \eta \sim \mathrm{Normal}\!\big(m\,\mathbf{1},\;
K_\eta + \lambda I\big),
$$

where $K_\eta$ denotes the $n\times n$ kernel matrix with $(i,j)$ entry
$\Sigma_0(x_i, x_j;\,\eta)$. The **log marginal likelihood** is

$$
\log p(y_{1:n} \mid x_{1:n}, \eta)
= -\tfrac{1}{2}(y_{1:n} - m\mathbf{1})^\top (K_\eta+\lambda I)^{-1}(y_{1:n}-m\mathbf{1})
  -\tfrac{1}{2}\log\det(K_\eta+\lambda I)
  -\tfrac{n}{2}\log(2\pi).
$$

The three terms balance data fit, model complexity, and a constant. Maximizing
over $\eta$ gives the **maximum likelihood estimate** (MLE):

$$
\hat\eta_{\mathrm{MLE}} = \operatorname*{arg\,max}_\eta \log p(y_{1:n}\mid x_{1:n},\eta).
$$

### MAP estimate

Place a hyperprior $p(\eta)$ on the hyperparameters. By Bayes' rule,

$$
p(\eta \mid \mathcal{D}_n) \propto p(y_{1:n}\mid x_{1:n},\eta)\,p(\eta),
$$

and the **MAP estimate** maximizes the log-posterior:

$$
\hat\eta_{\mathrm{MAP}}
= \operatorname*{arg\,max}_\eta \bigl[\log p(y_{1:n}\mid x_{1:n},\eta) + \log p(\eta)\bigr].
$$

MLE is the special case $p(\eta) \propto \mathrm{const}$. In practice, log-normal
or log-uniform hyperpriors on $(\sigma_f^2, \ell_{1:d}, \lambda)$ keep estimates
in plausible ranges and prevent the degenerate MLE solutions that arise with few
data (`frazier2018`, §3.2).

Both MLE and MAP are optimized by automatic differentiation through the log
marginal likelihood; the gradient is available in closed form (Rasmussen &
Williams, Ch. 5). The optimization cost is dominated by the $O(n^3)$ Cholesky
factorization of $K_\eta + \lambda I$, identical to the cost of a single GP fit.

### The early-iteration pitfall

With $n \lesssim d$ observations, the log marginal likelihood is flat or
multi-modal in the length-scale directions. MLE can return extremely short
length-scales (nearly interpolating the noise) or extremely long ones (nearly
constant mean). Either extreme collapses $\sigma_n^2$ in a way that makes
$\mathrm{EI}_n$ or $\mathrm{UCB}_n$ **overconfident**: the acquisition is
concentrated near the few data points, exploration stalls, and the loop can
lock onto a suboptimal region. This is the primary motivation for
fully-Bayesian treatment in early iterations.

> **Remark.** `snoek2012` observes this pathology empirically and argues it is
> the reason point-estimate GP EI underperforms MCMC GP EI on the Branin-Hoo
> benchmark at small $n$. The MLE "GP EI Opt" condition is the control; "GP EI
> MCMC" is the treatment.

## Fully-Bayesian marginalization

### The integrated acquisition function

Rather than conditioning on a point estimate $\hat\eta$, we treat $\eta$ as a
latent variable and marginalize. The correct acquisition function is the
**integrated acquisition** (also called the marginal acquisition):

$$
\boxed{
\hat\alpha_n(x)
:= \int \alpha_n(x;\eta)\; p(\eta\mid\mathcal{D}_n)\;\mathrm{d}\eta
}
$$

where $\alpha_n(x;\eta)$ is any per-$\eta$ acquisition (EI, PI, UCB, …) computed
from the GP posterior at fixed $\eta$. The integrand is an expectation of a
non-negative function under the hyperparameter posterior; for EI and PI it is the
**correct Bayesian generalization** that accounts for uncertainty in the
hyperparameters.

This integral is analytically intractable because $p(\eta\mid\mathcal{D}_n)$ has
no closed form. We approximate it by Monte Carlo.

### MCMC approximation via slice sampling

Draw $J$ samples $\{\eta^{(j)}\}_{j=1}^J$ from the hyperparameter posterior
$p(\eta\mid\mathcal{D}_n) \propto p(y_{1:n}\mid x_{1:n},\eta)\,p(\eta)$ using
Markov chain Monte Carlo — specifically **slice sampling** (`snoek2012`; Neal,
2003), which handles the correlated, non-Gaussian posterior over $\eta$ without
requiring gradient information or step-size tuning. Then approximate:

$$
\hat\alpha_n(x) \approx \frac{1}{J}\sum_{j=1}^{J} \alpha_n(x;\,\eta^{(j)}).
$$

For the **integrated EI** (the primary case in `snoek2012`):

$$
\widehat{\mathrm{EI}}_n(x)
= \frac{1}{J}\sum_{j=1}^{J} \mathrm{EI}_n(x;\,\eta^{(j)})
= \frac{1}{J}\sum_{j=1}^{J}
  \Bigl[
    \Delta_n^{(j)}(x)\,\Phi\!\Bigl(\tfrac{\Delta_n^{(j)}(x)}{\sigma_n^{(j)}(x)}\Bigr)
    + \sigma_n^{(j)}(x)\,\varphi\!\Bigl(\tfrac{\Delta_n^{(j)}(x)}{\sigma_n^{(j)}(x)}\Bigr)
  \Bigr],
$$

where $(\mu_n^{(j)}, \sigma_n^{(j)})$ and $\Delta_n^{(j)} = \mu_n^{(j)} - f^*_n$
are computed from the GP posterior at $\eta = \eta^{(j)}$. The per-sample EI is
the same closed form derived in [[expected-improvement]]; only the hyperparameters
vary across the sum.

**Each sample costs one GP posterior evaluation** (one Cholesky solve with
$K_{\eta^{(j)}}+\lambda^{(j)}I$ already factored). The dominant cost is the $J$
Cholesky factorizations — $O(Jn^3)$ — which is the same asymptotic scaling as
optimizing the MLE $J$ times. `snoek2012` argues this cost is negligible relative
to the function evaluations themselves.

### Why fully-Bayesian beats point estimates in early iterations

At small $n$, the hyperparameter posterior $p(\eta\mid\mathcal{D}_n)$ is broad:
several length-scale or amplitude settings are equally consistent with the data.
The integrated acquisition **averages across these plausible worlds**, so even if
one sample produces a near-constant posterior (long length-scale) and another
produces a spiky one (short length-scale), the average $\hat\alpha_n(x)$ is spread
over the domain rather than collapsed. This prevents early overconfidence and
retains exploration. As $n$ grows, the posterior on $\eta$ concentrates and the
integrated acquisition converges to the point-estimate one.

## Relation to other notes

- **[[gaussian-process-regression]].** The posterior $(\mu_n, \sigma_n^2)$ derived
  there implicitly conditions on $\eta$; this note treats that conditioning
  explicitly and marginalizes over it.
- **[[expected-improvement]].** The closed form $\mathrm{EI}_n(x)$ from that note
  is the per-$\eta$ integrand here; the integrated EI is the sum over $J$ such
  evaluations. The EI note's "Integrated & cost-aware EI" remark points here.
- **[[ei-per-unit-cost]].** `snoek2012` couples the integrated EI with an
  evaluation-cost model to form *EI per second*; that note specializes the
  integrated acquisition to a cost-rescaled objective.
- **[[gp-ucb]], [[probability-of-improvement]].** The same MCMC integration applies
  to any acquisition function: replace $\mathrm{EI}_n(x;\eta^{(j)})$ with the
  corresponding per-$\eta$ form.
- **Convergence.** Point-estimate GP EI's convergence guarantees
  ([[ego-convergence-rates]], `bull2011`) condition on fixed $\eta$; extending
  these results to the integrated acquisition is an open problem.

## Origin and crosswalk

`snoek2012` (§3) is the derivation-primary source: it identifies the overconfidence
pathology, proposes the integrated acquisition, and implements MCMC via slice
sampling. `frazier2018` (§3.2, "Choosing Hyperparameters") frames the same three
approaches (MLE, MAP, fully-Bayesian) as a spectrum and notes that MAP is
consistent with a point-mass approximation to the full posterior.

| This note (canonical) | `snoek2012` | `frazier2018` | Note |
|---|---|---|---|
| $\eta$ (hyperparameter vector) | $\theta$ (also $\nu$ for noise) | $\eta$ | `snoek2012` uses $\theta$ for kernel params, $\nu$ for noise; we consolidate |
| $\lambda$ (noise variance) | $\nu$ | $\lambda$ (implicitly) | `snoek2012`'s $\nu$ conflicts with Matérn smoothness; we use $\lambda$ throughout |
| $p(\eta\mid\mathcal{D}_n)$ | $p(\theta\mid\{x_n,y_n\})$ | $P(\eta\mid f(x_{1:n}))$ | same object |
| $\hat\alpha_n(x)$ (integrated acquisition) | $\hat{a}(\mathbf{x};\{x_n,y_n\})$ | — (not named) | `snoek2012` names it; `frazier2018` treats it implicitly via the Monte Carlo approximation |
| MLE: $\operatorname*{arg\,max}_\eta \log p(y_{1:n}\mid\eta)$ | "GP EI Opt" (point estimate via marginal likelihood) | MLE | same procedure, different names |
| MCMC (slice sampling) | "GP EI MCMC" | MCMC / slice sampling | `snoek2012` cites Murray & Adams (2010) for the slice sampler |
| maximize $f$ | minimize $f(\mathbf{x})$ | maximize $f$ | `snoek2012` minimizes; acquisition and marginal likelihood forms are sign-invariant |

> **Remark — notation conflict.** `snoek2012` uses $\nu$ for the observation noise
> variance (their §2: "$y_n \sim \mathrm{Normal}(f(x_n), \nu)$") while the
> canonical table ([[notation]]) uses $\nu$ for the Matérn smoothness parameter.
> These are distinct quantities that collide in any note using both the Matérn
> kernel and noisy observations. We resolve by always writing $\lambda$ for noise
> variance (following [[notation]]) and $\nu$ for Matérn smoothness, never using
> `snoek2012`'s $\nu$ for noise.
