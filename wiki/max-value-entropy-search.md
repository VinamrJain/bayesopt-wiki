---
title: Max-Value Entropy Search
slug: max-value-entropy-search
tags: [acquisition, information-theoretic, lookahead]
subtopic: information-theoretic
requires: [problem-setup, gaussian-process-regression, acquisition-functions, entropy-search]
sources: [wang2017mes]
summary: "Information-theoretic acquisition targeting the max-value, not its location."
grade: derivation
reviewed: null
---

# Max-Value Entropy Search

Max-value entropy search (MES) is an information-theoretic acquisition function that gains
everything from [[entropy-search|ES]] — the principle of sampling where we learn most about
the optimum — but replaces the expensive $d$-dimensional target with a **scalar** one. The
core move is a change of random variable: instead of targeting the location $x^*$ of the
optimum (a point in $\mathbb{R}^d$), MES targets the **maximum value** $f^* = \max_{x\in A}
f(x)$ (a scalar). That single substitution collapses the entropy from a $d$-dimensional
distribution to a 1-D one, gives per-sample closed forms via truncated-Gaussian entropy, and
eliminates the need for representer-point grids or expectation-propagation — the expensive
machinery ES requires. Symbols follow [[notation]].

> **Notation delta.** $f^*$ is used in [[notation]] to denote the global maximum value
> $f(x^*)$; MES targets the **posterior distribution** over this scalar, $p(f^*\mid\mathcal
> D_n)$. When conditioning on a realized sample of the max-value we write $y_* \sim
> p(f^*\mid\mathcal D_n)$ to distinguish the draw from the random variable; $\gamma_{y_*}(x)
> := (y_* - \mu_n(x))/\sigma_n(x)$ is the standardized gap at $x$ given max-value sample
> $y_*$. $\varphi$, $\Phi$ are the standard-normal pdf and cdf per [[notation]].

## The target switch: $x^*$ → $f^*$

[[entropy-search|ES]] and [[predictive-entropy-search|PES]] both aim to learn the **location**
$x^*$ of the optimum, using mutual information $I(x^*;\,y\mid x,\mathcal D_n)$ as the
acquisition. That mutual information involves the posterior over a $d$-dimensional point, which
is analytically intractable and requires either expensive discretization (ES) or sampling from
$p_\star$ via EP-based approximations (PES).

MES (`wang2017mes`, §3) keeps the information-theoretic objective but replaces $x^*$ with
the scalar max-value $f^*$:

$$
\boxed{\ \alpha_{\mathrm{MES},n}(x) = I(f^*;\,y\mid x,\mathcal D_n)\ }
$$

Expanding via the chain rule of mutual information,

$$
\alpha_{\mathrm{MES},n}(x)
= H\!\big(p(y\mid x,\mathcal D_n)\big)
- E_{f^*}\!\Big[\,H\!\big(p(y\mid x,\mathcal D_n,f^*)\big)\,\Big],
$$

where the outer expectation is over the (posterior) distribution of $f^*$. Both entropies are
now over **scalars** — the 1-D observation $y$ and the 1-D max-value $f^*$ — rather than over
the $d$-dimensional $x^*$. The dimensionality reduction is the payoff, and it is unconditional
on $d$.

The acquisition is the **one-step VoI rule under utility = negative entropy of the $f^*$
posterior** — the same template [[acquisition-functions|the hub]] describes, with utility
$u(\mathcal D) = -H(p(f^*\mid\mathcal D))$ replacing ES's $u(\mathcal D) =
-H(p_\star(\cdot\mid\mathcal D))$ (`wang2017mes`, §3).

## Per-sample closed form

Under the GP posterior, $y\mid x,\mathcal D_n \sim \mathrm{Normal}(\mu_n(x),\sigma_n^2(x))$
(noise-free for clarity; the noisy case adds $\lambda$ to the variance). Its differential
entropy is

$$
H\!\big(p(y\mid x,\mathcal D_n)\big) = \tfrac{1}{2}\log(2\pi e\,\sigma_n^2(x)).
$$

**Conditioning on $f^* = y_*$ truncates the predictive.** Given the global max is at most
$y_*$, the function value at any $x$ must satisfy $f(x)\le y_*$, so

$$
p(y\mid x,\mathcal D_n,\,f^*=y_*)
= \mathrm{Normal}(\mu_n(x),\sigma_n^2(x))
\;\text{truncated to }(-\infty,\,y_*].
$$

The entropy of a $\mathrm{Normal}(\mu,\sigma^2)$ truncated to $(-\infty, y_*]$ is a standard
result: writing $\gamma = (y_* - \mu)/\sigma$,

$$
H\!\big(p(y\mid x,\mathcal D_n,y_*)\big)
= \log\!\big(\sigma_n(x)\,\Phi(\gamma_{y_*}(x))\big)
- \frac{\gamma_{y_*}(x)\,\varphi(\gamma_{y_*}(x))}{2\,\Phi(\gamma_{y_*}(x))}
+ \tfrac{1}{2}\log(2\pi e),
$$

where $\gamma_{y_*}(x) = (y_* - \mu_n(x))/\sigma_n(x)$.

The **per-sample** information gain (subtracting and canceling the $\frac{1}{2}\log(2\pi e)$
and $\log\sigma_n$ terms) reduces to

$$
H\!\big(p(y\mid x,\mathcal D_n)\big)
- H\!\big(p(y\mid x,\mathcal D_n,y_*)\big)
= \frac{\gamma_{y_*}(x)\,\varphi\!\big(\gamma_{y_*}(x)\big)}{2\,\Phi\!\big(\gamma_{y_*}(x)\big)}
  - \log\Phi\!\big(\gamma_{y_*}(x)\big).
$$

Averaging over $K$ Monte Carlo samples $\{y_{*(k)}\}_{k=1}^K$ from $p(f^*\mid\mathcal D_n)$
gives the computable acquisition:

$$
\boxed{\ \alpha_{\mathrm{MES},n}(x)
\approx \frac{1}{K}\sum_{k=1}^K
\left[
  \frac{\gamma_{y_{*(k)}}(x)\,\varphi\!\big(\gamma_{y_{*(k)}}(x)\big)}
       {2\,\Phi\!\big(\gamma_{y_{*(k)}}(x)\big)}
  - \log\Phi\!\big(\gamma_{y_{*(k)}}(x)\big)
\right]\ }
$$

(`wang2017mes`, eq. 8). Each summand is positive. Write $g(u) = \tfrac{u\,\varphi(u)}{2\Phi(u)} -
\log\Phi(u)$, so that the integrand is $g(\gamma_{y_*}(x))$; $g$ is monotonically decreasing with
$g(u)\to 0^+$ as $u\to\infty$ (`wang2017mes`, Lemma 1), hence $g>0$ for every finite $\gamma$. The
positivity is structural: conditioning on $f^*=y_*$ truncates the predictive, and truncation can
only *lower* differential entropy, so $H(\text{full}) - H(\text{truncated}) > 0$ — every sample is
a strict information gain (the Mills term $\tfrac{\gamma\varphi}{2\Phi}$ is itself negative when
$\gamma<0$, so the positivity is a property of the sum, not of the two terms separately).

> **Remark — no EP, no representer-point grid.** The per-sample integrand is a two-term
> analytic function of $(\mu_n(x),\sigma_n(x),y_*)$: one log-CDF term and one
> normalized-Mills-ratio term. There is no high-dimensional discretization and no expectation
> propagation. Contrast with ES, which requires an $N$-point grid and an EP pass of cost
> $\mathcal O(N^4)$, and PES, which uses EP to compute $I(x^*;y\mid x,\mathcal D_n)$ via
> the symmetric form; MES avoids both.

> **Remark — source notation.** `wang2017mes` writes $\psi$ for the standard-normal pdf and
> $\Psi$ for its cdf; we use $\varphi$ and $\Phi$ throughout per [[notation]]. The paper also
> writes the standardized gap as $\gamma_{y_*}(x)$ in the same sense as our delta header. The
> formulae are identical.

## Sampling the max-value $f^*$

The acquisition requires samples $y_{*(k)}\sim p(f^*\mid\mathcal D_n)$. The posterior
distribution of $f^* = \max_{x\in A} f(x)$ under a GP is the distribution of the maximum of
a dependent Gaussian process — analytically intractable. `wang2017mes` proposes two routes.

**Route 1 — Gumbel approximation** (`wang2017mes`, §3.1). Replace the continuous domain $A$ by
a dense finite grid $\hat{A}$ and apply a **mean-field** approximation: treat the function
values at grid points as independent. Under this independence assumption the max-value CDF
factors as

$$
\widehat{\Pr}[f^* < z]
= \prod_{x\in\hat{A}}\Phi\!\big(\gamma_z(x)\big),
\qquad \gamma_z(x) = \frac{z - \mu_n(x)}{\sigma_n(x)}.
$$

> **Remark — approximation quality.** The independence assumption is a hand-wave: GP values
> at nearby $x$ are positively correlated, so treating them as independent over-estimates
> $\Pr[f^*<z]$ and therefore produces samples that are stochastically **upper bounds** on the
> true max. Wang & Jegelka note (citing Slepian's lemma) that when $k(x,x')\ge 0$ this is
> provably an over-estimate, and that using over-estimates of $f^*$ still yields vanishing
> regret (`wang2017mes`, §3.1 and Theorem 1). The approximation is exact in the i.i.d. limit
> as grid resolution increases, but the i.i.d. assumption never holds exactly for a correlated
> GP.

To sample efficiently without binary-searching the $|\hat{A}|$-term CDF product for every
sample, the paper fits a **Gumbel distribution** $\mathcal{G}(a,b)$ with CDF
$e^{-e^{-(z-a)/b}}$ to the approximate max-value CDF by percentile matching at the 25th and
75th percentiles. The Gumbel family is motivated by the Fisher–Tippett–Gnedenko theorem: the
maximum of i.i.d. Gaussians converges in distribution to a Gumbel. Once $a,b$ are fit, samples
are drawn in $O(1)$ via the quantile function: $y_* = a - b\log(-\log r)$, $r\sim
\mathrm{Uniform}(0,1)$.

> **Remark — Gumbel extrapolation.** The theorem applies to i.i.d. Gaussians; GP values are
> identically distributed but not independent. The Gumbel fit is a second-layer approximation
> on top of the mean-field one. In practice it works well as a fast surrogate, but it is not
> theoretically guaranteed to converge to the true max-value distribution for a fixed kernel.

**Route 2 — posterior function samples** (`wang2017mes`, §3.2). Approximate the GP posterior
with a random-feature model: write $\tilde{f}(x) = \mathbf{a}^\top \boldsymbol{\phi}(x)$
where $\boldsymbol{\phi}(x)\in\mathbb{R}^D$ are random Fourier features (Bochner's theorem
applied to the kernel) and $\mathbf{a}\sim\mathrm{Normal}(\boldsymbol{\nu}_n,
\boldsymbol{\Sigma}_n)$ is the posterior weight distribution. A sample from this model is a
cheaply evaluable finite-dimensional function; maximize each sampled $\tilde{f}$ over $A$ to
get $y_{*(k)} = \max_{x\in A}\tilde{f}(x)$. This route avoids the mean-field and Gumbel
approximations and produces exact samples from the approximate (finite-feature) posterior; it is
closer to the truth but more expensive per sample (requires optimizing $\tilde{f}$ for each
$k$).

## Regret bound

`wang2017mes` (Theorem 1) shows that with a single $y_*$ sample per iteration, MES achieves a
simple-regret bound of the form

$$
r_{T'} \le \sqrt{\frac{C\,\gamma_T}{T}}\,(\nu_{t^*} + \zeta_T),
$$

where $\gamma_T$ is the **maximum information gain** (the standard GP-bandit quantity from
`srinivas2010`), $C = 2/\log(1+\sigma^{-2})$, $\nu_{t^*}$ a draw-dependent term, and $\zeta_T$
a confidence width (`wang2017mes`, §3.3). The bound relies on the equivalence (Lemma 1 in the
paper): single-sample MES is equivalent to PI with threshold $y_*$ and to GP-UCB with
$\beta^{1/2} = \min_{x}\gamma_{y_*}(x)$, so EST/UCB regret machinery carries over directly.
The bound degrades gracefully when the sampled $y_*$ over-estimates $f^*$, and the
probabilistic argument shows that at least one iteration in any block of $k$ will sample
$y_* > f^*$, yielding a $T'$-iteration convergence result.

> **Remark — $\gamma_T$.** $\gamma_T$ is the **maximum information gain** (see [[notation]],
> [[gp-ucb]], [[regret-gp-bandits]]); `wang2017mes` writes it $\rho_T$ (crosswalk below). It is
> distinct from the standardized gap $\gamma_{y_*}(x)$ — same base symbol, different subscript.
> For common kernels it grows sublinearly in $T$ and $d$. The bound is derived only for the
> single-sample case; no analogous closed-form regret bound is available for the $K>1$ averaged
> acquisition.

## Relation to other notes

- **[[entropy-search]] — the parent.** ES targets $p_\star(x\mid\mathcal D_n)$, the
  $d$-dimensional posterior over the optimizer *location*, with utility $u = -H(p_\star)$.
  MES shifts the target to the scalar max-*value* $f^*$: same VoI template, 1-D target,
  closed-form per-sample integrand. The expensive EP + representer-point machinery of ES is
  entirely replaced by the truncated-Gaussian entropy formula.

- **[[predictive-entropy-search]] — the sibling.** PES uses the symmetric form
  $H(p(y\mid x,\mathcal D_n)) - E_{x^*}[H(p(y\mid x,\mathcal D_n,x^*))]$ to compute the same
  mutual information $I(x^*;y\mid x,\mathcal D_n)$ as ES, and exploits the 1-D *observation*
  entropy on the right to avoid an EP pass over $p_\star$. MES applies the same symmetric
  trick but to a *different* quantity — $I(f^*;y\mid x,\mathcal D_n)$ — giving a cleaner
  closed form because conditioning on the scalar $f^*$ (not the vector $x^*$) produces a
  truncated-Gaussian rather than an EP-structured posterior.

- **[[thompson-sampling-bo]] — the randomized counterpart.** Thompson sampling draws
  $x_{n+1}\sim p_\star(\cdot\mid\mathcal D_n)$ — a *location* sample — and queries it. MES
  samples $f^*$ from its posterior and reasons about its entropy reduction, querying
  $\operatorname*{arg\,max}_x \alpha_{\mathrm{MES},n}(x)$. TS pays no computation per sample;
  MES pays the closed-form evaluation cost over a $K$-sample average. The two share the
  information-theoretic spirit but differ in what they sample and how they act on the sample.

- **[[knowledge-gradient]] — a sibling VoI rule.** KG uses utility $u = \mu_n^*$ (best
  posterior mean value); MES uses $u = -H(p(f^*\mid\mathcal D))$ (negative entropy of the
  max-value posterior). Both are one-step nonlocal VoI rules; both account for how a sample
  reshapes beliefs globally; neither reduces to an expression involving only the marginal at
  $x$. KG targets the value of the optimizer (improving $\mu_n^*$); MES targets
  *certainty about* that value (reducing $H(p(f^*\mid\mathcal D))$).

## Origin and crosswalk

MES is due to Wang & Jegelka (`wang2017mes`, ICML 2017). The paper writes $y_*$ for the
max-value sample where we write $y_*$ or $f^*$ per context; other notation differences are
tabulated below.

| This note (canonical) | `wang2017mes` | Note |
|---|---|---|
| $f^* = \max_{x\in A}f(x)$ | $y_* = f(\mathbf x_*)$ | same object; paper uses $y_*$ as both RV and sample |
| $\gamma_{y_*}(x) = (y_*-\mu_n(x))/\sigma_n(x)$ | $\gamma_{y_*}(\mathbf x) = (y_*-\mu_t(\mathbf x))/\sigma_t(\mathbf x)$ | identical |
| $\varphi$, $\Phi$ (std-normal pdf/cdf) | $\psi$, $\Psi$ | rename per [[notation]] |
| $\mathcal D_n$ | $D_t$ (time-indexed) | same dataset |
| $\mu_n(x),\,\sigma_n(x)$ | $\mu_t(\mathbf x),\,\sigma_t(\mathbf x)$ | GP posterior statistics; same |
| noise variance $\lambda$ | $\sigma^2$ | see [[notation]] |
| $\gamma_T$ (maximum information gain) | $\rho_T$ | Wang writes $\rho_T$; wiki canonical is $\gamma_T$ (see [[notation]], [[regret-gp-bandits]]) |
| random-feature vector $\boldsymbol\phi(x)$ | $\boldsymbol\phi(x)$ | Bochner/Rahimi–Recht features |
