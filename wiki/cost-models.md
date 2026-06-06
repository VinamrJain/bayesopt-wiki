---
title: Cost Models
slug: cost-models
tags: [cost-aware, surrogate]
subtopic: cost-aware
requires: [gaussian-process-regression, cost-aware-bo]
sources: [lee2020, lee2021, snoek2012]
summary: "Modeling unknown evaluation cost c(x), typically a log-GP, as a second surrogate."
grade: concept
reviewed: null
---

# Cost Models

The cost-aware symbols ($c(x)$, $\log c(x)$) follow [[notation]]; `lee2020`'s log-cost
$\gamma(x)$ is renamed $\log c(x)$ there to avoid collision with $\gamma_T$ (see crosswalk).

Cost-aware BO algorithms — [[ei-per-unit-cost|EIpu]], [[cost-cooling-carbo|cost-cooling]],
and the nonmyopic [[nonmyopic-cost-constrained-bo|cost-constrained]] family — all divide or
weight their acquisition by $c(x)$. The problem: evaluation cost is unknown a priori, varies
across the domain (sometimes by orders of magnitude), and must itself be inferred from
observed durations. A *cost model* is a probabilistic surrogate for $c(x)$ trained jointly
with the objective GP on the same evaluation history $\mathcal{D}_n$. Getting this surrogate
right matters: a high-variance or poorly-extrapolating cost estimate corrupts the acquisition,
potentially steering the optimizer toward or away from cheap regions for the wrong reasons
(`lee2020`, §Cost Surrogates).

## Why a surrogate at all

The cost $c(x_m)$ is observed alongside $y_m = f(x_m)$ at each evaluation, so the sequence
of observed costs $\{(x_m, c(x_m))\}_{m=1}^n$ is available as a second dataset. But $n$ is
small — BO's raison d'être is sample efficiency — and the cost surface is as unknown and
spatially structured as $f$ itself. A naive average or nearest-neighbor estimate ignores
structure and extrapolates poorly. A GP on raw cost is inadmissible: cost is positive, but a
GP prior puts mass on all of $\mathbb{R}$, yielding meaningless negative cost predictions and
a badly calibrated predictive distribution.

## Standard model: warped GP on log-cost

The canonical fix, due to Snelson et al. (2004, warped GPs) and adopted by `snoek2012` for EIpu, is to
model the *log* of the cost with a GP and recover cost via exponentiation (`lee2020`, line
216; `lee2021`, background §Cost-constrained BO):

$$
\log c(x) \;\sim\; \mathrm{GP}\!\big(\mu_0^c,\, \Sigma_0^c\big),
\qquad
c(x) = \exp\!\big(\log c(x)\big).
$$

Positivity is guaranteed by construction: the GP prior over $\log c$ induces a log-normal
prior over $c$, and the posterior predictive of $c$ at any $x$ is also log-normal.
Concretely, if the log-cost posterior at $x$ is

$$
\log c(x) \mid \mathcal{D}_n \;\sim\; \mathrm{Normal}\!\big(\mu_n^c(x),\, (\sigma_n^c)^2(x)\big),
$$

then the cost posterior is log-normal with

$$
E_n[c(x)] = \exp\!\!\left(\mu_n^c(x) + \tfrac{1}{2}(\sigma_n^c)^2(x)\right), \qquad
E_n\!\left[\tfrac{1}{c(x)}\right] = \exp\!\!\left(-\mu_n^c(x) + \tfrac{1}{2}(\sigma_n^c)^2(x)\right).
$$

The **expected inverse duration** $E_n[1/c(x)]$ is the moment that enters `snoek2012`'s
*EI per second* formulation: EIpu in that paper uses $\mathrm{EI}_n(x) \cdot E_n[1/c(x)]$
rather than the plug-in ratio $\mathrm{EI}_n(x)/\mu_n^c(x)$, correctly accounting for the
skewness of the log-normal (`snoek2012`, §3). See [[ei-per-unit-cost]] for the acquisition,
and [[gp-hyperparameters]] for how the log-cost GP's hyperparameters are fit — the same
marginal-likelihood-II (MLII) machinery applies, with a separate hyperparameter vector
$\eta^c$ for the cost kernel.

**Independence assumption.** The objective GP ($f$) and the log-cost GP ($\log c$) are
treated as independent processes sharing only $x$ as input. This is an assumption of
convenience — it decouples inference and keeps the joint model tractable. It is *misspecified*
whenever cost and quality are correlated: e.g. in neural architecture search, larger models
are simultaneously slower (higher $c$) and more accurate (higher $f$). Under such correlation,
the independence model underutilizes a real signal and can produce suboptimal queries. No
standard workaround exists in the sources available; flagging this as an open modeling
assumption.

## lee2020's low-variance / extrapolating cost models

### The problem with the warped GP

Gaussian processes extrapolate poorly in general: posterior variance grows without bound away
from data, and the log-cost posterior inherits this. In the cost-aware setting, high predictive
variance in $c(x)$ directly inflates uncertainty in the cost-normalized acquisition — a
region that is genuinely cheap may appear expensively uncertain, and vice versa. `lee2020`
(§Cost Surrogates) identifies this as a source of degraded BO performance and proposes
structured, low-variance cost models for problem families where cost can be predicted from
first principles.

### Flop-counting linear model

For programs whose runtime is dominated by floating-point operations (flops), cost is a
linear function of a small set of architecture-derived features:

$$
c(x) = \sum_k c_k\, \phi_k(x),
$$

where each $\phi_k(x)$ counts the flops of a specific subroutine (matrix multiply, batch
normalization, convolution layer, pooling, etc.), and the weights $\{c_k\}$ are fit by robust
regression with the Huber loss to handle timing outliers (`lee2020`, §Cost Surrogates). The
model is entirely non-probabilistic as a point predictor, but `lee2020` also considers a GP
*whose mean function is* the linear flop model — a **GP with a structured mean** — which
combines the low-variance extrapolation of the linear predictor with the GP's ability to
absorb residual variation.

**Multi-layer perceptron.** For an MLP with layer sizes $n_1, \dots, n_k$, the features are:

$$
\phi_{\mathrm{quad}} = n_1 n_2 + n_2 n_3 + \cdots + n_{k-1}n_k
\quad\text{(matrix-multiply flops)},
\qquad
\phi_{\mathrm{linear}} = n_1 + n_2 + \cdots + n_k
\quad\text{(activations/BN flops)},
$$

giving the cost model $c(x) = c_1\phi_{\mathrm{quad}} + c_2\phi_{\mathrm{linear}} + c_3$.
Batch size and epoch count are treated as constants (`lee2020`, §MLP).

**Convolutional neural network.** For a CNN with $h$ convolutional layers, kernel size $r$,
channel sizes $m_1,\dots,m_k$, pooling ratios $p_1,\dots,p_k$, and input $I\times I\times c$,
the additional features are:

$$
\phi_{\mathrm{conv}} = I^2 r^2 c m_1 + \sum_{i=1}^{k-1} I^2 r^2 m_i m_{i+1},
\qquad
\phi_{\mathrm{pool}} = \sum_{i=1}^{k} I^2 p_i m_i,
$$

yielding $c(x) = c_1\phi_{\mathrm{conv}} + c_2\phi_{\mathrm{pool}} + c_3\phi_{\mathrm{quad}}
+ c_4\phi_{\mathrm{linear}} + c_5$ (`lee2020`, §CNN).

### Empirical finding

On MLP benchmarks, the linear model and the GP-with-linear-mean both achieve lower RMSE
than the warped GP, especially in the small-data regime (fewer than $\sim$20 training points).
As the dataset grows, the error gap shrinks, suggesting the warped GP catches up once it has
enough observations to learn the cost structure. For CNNs, the flop-counting model is only
better than the warped GP for training sets smaller than $\sim$20; beyond that, the warped GP
is competitive, likely because highly optimized convolution libraries break the flops-to-time
proportionality assumed by the feature set (`lee2020`, Fig. 5 and §CNN).

> **Remark — scope of the low-variance models.** The flop-counting approach requires
> problem-specific feature engineering: one must know the program's computational graph well
> enough to enumerate its dominant subroutines and count their flops. This is feasible for
> neural-network HPO but not for the fully black-box setting that most BO theory assumes.
> `lee2020` frames this as a specialized improvement available when *some* structural knowledge
> of the cost function is in hand, not as a general replacement for the warped GP. The
> fully-black-box default remains the warped GP on log-cost.

### Warm-start requirement

Learning any cost model — warped GP or structured linear — requires at least a few observed
costs. `lee2020` uses five uniform random evaluations as a warm-start before the main BO loop
begins. This is a small but non-negligible cost: five evaluations at unknown (potentially high)
cost. The cost-effective initial design in CArBO is partly designed to make this warm-start as
cheap as possible (see [[cost-cooling-carbo]]).

## Relation to other notes

- **[[ei-per-unit-cost]].** The downstream consumer of the cost model: divides EI by $c(x)$.
  The log-normal predictive makes $E_n[1/c(x)]$ analytically available — the correct way to
  handle the ratio under uncertainty.
- **[[cost-cooling-carbo]].** Uses $c(x)^{\alpha_k}$ with a decaying exponent $\alpha_k$; the
  cost model is the same warped-GP surrogate, and its warm-start is managed by the
  cost-effective initial design. High cost-model variance is a known weak point of this
  approach when extrapolating early in optimization.
- **[[nonmyopic-cost-constrained-bo]].** Lee 2021's CMDP rollout also normalizes its base
  acquisition (EIpu) by $c(x)$, inheriting the same warped-GP cost surrogate. The cost model
  enters the feasibility check (cumulative cost $\leq \tau$) as well as the acquisition ratio.
- **[[gp-hyperparameters]].** The log-cost GP is fit by exactly the same MLII procedure
  (MLE or MAP over the log marginal likelihood) as the objective GP, using a separate
  hyperparameter vector $\eta^c$. All pitfalls discussed there — early-iteration
  overconfidence, multi-modal log marginal likelihood — apply equally to the cost surrogate.

## Origin and crosswalk

The warped-GP approach originates with Snelson et al. (2004) (input-warped GPs) and is applied
to cost modeling in the black-box HPO setting by `snoek2012`. `lee2020` adopts this as the
baseline and proposes the low-variance structured alternatives. `lee2021` treats $c(x)$ as
a *deterministic* quantity in its CMDP theoretical analysis (rollout improving property holds
if cost is deterministic; `lee2021`, §Theoretical Analysis), though in practice it is
estimated by the same warped-GP surrogate.

| This note (canonical) | `lee2020` | `snoek2012` | Note |
|---|---|---|---|
| $\log c(x)$ (GP-modeled log-cost) | $\gamma(x)$ | log-duration (unnamed) | `lee2020` writes $\gamma(x)$; collides with $\gamma_T$ (max info gain) in [[notation]] — rewritten throughout |
| $c(x) = \exp(\log c(x))$ | $c(\mathbf{x}) = \exp(\gamma(\mathbf{x}))$ | $c(\mathbf{x}) = \exp(\cdot)$ | identical transformation |
| $E_n[1/c(x)]$ (expected inverse duration) | not derived explicitly | implicit in "EI per second" ratio | log-normal moment |
| Linear model $c(x) = \sum_k c_k \phi_k(x)$ | same; Huber loss fit | — | MLP and CNN variants in `lee2020` §Cost Surrogates |
| GP with linear mean | unnamed; "GP whose mean is low-variance model" | — | best RMSE of the three models tested |
| Minimize $f$ | minimize (HPO error) | minimize | convention; all acquisition-ratio derivations are sign-invariant |
