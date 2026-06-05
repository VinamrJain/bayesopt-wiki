---
title: Expected Improvement
slug: expected-improvement
tags: [acquisition, myopic, decision-theoretic]
requires: [gaussian-process-regression, problem-setup]
sources: [frazier2018, jones98, mockus1978, snoek2012]
summary: "The default acquisition: expected gain over the incumbent, closed-form under a GP."
grade: derivation
reviewed: null
---

# Expected Improvement

Expected improvement (EI) is the default acquisition function for Bayesian optimization:
cheap to evaluate, closed-form, and derived from a clean decision-theoretic thought
experiment. It is the **one-step Bayes-optimal** rule under one specific assumption about how
we will report a final answer — making it the natural anchor against which
[[knowledge-gradient]], [[probability-of-improvement]], and the information-theoretic
acquisitions ([[entropy-search]]) are best understood as *changing that assumption*. Symbols
follow [[notation]].

## The thought experiment

Run the [[acquisition-functions|BayesOpt loop]] and suppose two things. First, the final
solution we report must be a point we have **actually evaluated** (we will not stake a claim
on an unevaluated point). Second, evaluations are **noise-free**. Then, if forced to stop
now, the best report is the evaluated point with the largest value, worth

$$
f^*_n = \max_{m\le n} f(x_m) \qquad\text{(the incumbent).}
$$

Now grant one more evaluation, to be placed at $x$. After observing $f(x)$, the best
evaluated value becomes $\max\{f(x),\,f^*_n\}$, so the **improvement** is

$$
I_n(x) = \big[f(x)-f^*_n\big]^+ , \qquad a^+ := \max(a,0).
$$

We cannot maximize $I_n(x)$ directly — $f(x)$ is unknown until sampled — so we maximize its
posterior expectation. That is the expected improvement,

$$
\boxed{\ \mathrm{EI}_n(x) := E_n\big[\,[f(x)-f^*_n]^+\,\big]\ }, \qquad
x_{n+1}\in\operatorname*{arg\,max}_{x\in A}\mathrm{EI}_n(x).
$$

Under the GP posterior ([[gaussian-process-regression]]), $f(x)\mid\mathcal D_n \sim
\mathrm{Normal}(\mu_n(x),\sigma_n^2(x))$ — the *only* facts about the model EI uses. This is the
single most important structural feature of EI: **it sees the posterior only through the
marginal at $x$**, never through how a sample at $x$ would reshape the posterior elsewhere.
That myopia is what later acquisitions relax.

## Closed form

Write $f(x)=\mu_n(x)+\sigma_n(x)Z$ with $Z\sim\mathrm{Normal}(0,1)$, and let

$$
\Delta_n(x) := \mu_n(x)-f^*_n
$$

be the **improvement margin** (expected gap to the incumbent). Then
$f(x)-f^*_n = \Delta_n(x)+\sigma_n(x)Z$, which is positive iff $Z > -\Delta_n(x)/\sigma_n(x)$.
Abbreviate $\Delta=\Delta_n(x)$, $\sigma=\sigma_n(x)$, $u=\Delta/\sigma$, and integrate:

$$
\mathrm{EI}_n(x)
= \int_{-u}^{\infty}(\Delta+\sigma z)\,\varphi(z)\,dz
= \Delta\underbrace{\int_{-u}^{\infty}\varphi(z)\,dz}_{=\,\Phi(u)}
\;+\; \sigma\underbrace{\int_{-u}^{\infty} z\,\varphi(z)\,dz}_{=\,\varphi(u)}.
$$

The first integral is $1-\Phi(-u)=\Phi(u)$; the second uses $\int_a^\infty z\varphi(z)\,dz =
\varphi(a)$ with $a=-u$ and $\varphi(-u)=\varphi(u)$. Hence the closed form, valid for **all**
signs of $\Delta_n(x)$ when $\sigma_n(x)>0$:

$$
\boxed{\ \mathrm{EI}_n(x) = \Delta_n(x)\,\Phi\!\Big(\tfrac{\Delta_n(x)}{\sigma_n(x)}\Big)
+ \sigma_n(x)\,\varphi\!\Big(\tfrac{\Delta_n(x)}{\sigma_n(x)}\Big)\ }
\qquad(\sigma_n(x)>0),
$$

and $\mathrm{EI}_n(x)=0$ when $\sigma_n(x)=0$ (a noise-free observed point yields no improvement). The
two limits sanity-check the formula: as $\Delta\to+\infty$, $\Phi\to1$ and $\varphi\to0$ so
$\mathrm{EI}\to\Delta$ (a near-certain gain of size $\Delta$); as $\Delta\to-\infty$, $\mathrm{EI}\to0$ (the
mean sits far below the incumbent).

> **Remark — the tutorial's compact form has a typo.** `frazier2018` (eq. for `EI-formula`)
> prints the single-expression form
> $\mathrm{EI}_n(x)=[\Delta_n]^+ + \sigma_n\varphi(\Delta_n/\sigma_n) - |\Delta_n|\Phi(\Delta_n/\sigma_n)$.
> As written this is wrong: at $\Delta\to+\infty$ it gives $\Delta+0-\Delta\cdot1=0$, whereas
> EI must grow to $\Delta$. The expression is correct only with the cdf argument
> $-|\Delta_n|/\sigma_n$, i.e. $[\Delta_n]^+ + \sigma_n\varphi(\Delta_n/\sigma_n) -
> |\Delta_n|\Phi(-|\Delta_n|/\sigma_n)$, which one can check equals the boxed two-term form
> for either sign of $\Delta_n$. We use the transparent two-term form throughout and do not
> recommend the compact one.

EI is itself cheap, smooth, and analytically differentiable, so $\operatorname*{arg\,max}_x\mathrm{EI}_n(x)$ is solved
by a standard continuous optimizer (e.g. L-BFGS-B with multi-restart); see
[[acquisition-functions]] for the inner-optimization problem common to all acquisitions, and
`wilson2018` for gradient-based maximization specifically.

## Exploration vs. exploitation

$\mathrm{EI}_n(x)$ is increasing in **both** $\Delta_n(x)$ (expected quality relative to the
incumbent) and $\sigma_n(x)$ (posterior uncertainty). Iso-EI curves in the $(\Delta,\sigma)$
plane therefore trade the two off implicitly: a point can earn a high acquisition either by
looking good in the mean (**exploitation**) or by being uncertain (**exploration**), with no
hand-tuned weight between them. Two consequences:

- At any **already-evaluated** point (noise-free), $\sigma_n=0$ and $\mu_n\le f^*_n$, so
  $\mathrm{EI}_n=0$ — EI never wastes a noise-free re-evaluation.
- The maximizer tends to sit where the posterior mean is high *and* the credible interval is
  wide, i.e. away from existing data but in promising regions.

This exploit/explore balance is the same tension named in bandits and reinforcement learning;
[[probability-of-improvement]] is the close relative that keeps the $\Phi$ term but drops the
uncertainty-rewarding $\sigma\varphi$ term, and so explores less.

## Noisy evaluations

With observation noise the derivation's two premises break: $f(x)$ in $[f(x)-f^*_n]^+$ is no
longer observed, and $f^*_n$ (a max of noisy observations) is no longer well defined. Plugging
heuristic substitutes into the closed form — using $\mu_{n+1}(x)$, or $y_{n+1}$, or a
plug-in for $f^*_n$ — is common but ad hoc, and is one reason [[knowledge-gradient]] can beat
EI under heavy noise.

`frazier2018` argues the principled fix is to re-run the *same* thought experiment honestly:
keep the rule "report a previously evaluated point," but value that report by its **posterior
mean** rather than a noisy observation. If we stopped now we would report
$\mu_n^{**}=\max_{i\le n}\mu_n(x_i)$; after sampling $x$ it would be
$\mu_{n+1}^{**}=\max_{i\le n+1}\mu_{n+1}(x_i)$, giving the acquisition

$$
\mathrm{EI}^{\text{noisy}}_n(x) = E_n\big[\,\mu_{n+1}^{**}-\mu_n^{**}\ \big|\ x_{n+1}=x\,\big].
$$

> **Notation delta.** $\mu_n^{**}:=\max_{i\le n}\mu_n(x_i)$ — best posterior mean *among
> evaluated points* — versus $\mu_n^{*}:=\max_{x\in A}\mu_n(x)$, the max over the whole
> domain used by [[knowledge-gradient]].

Unlike the noise-free case, a new sample can shift $\mu_{n+1}(x_i)$ for earlier points too, so
this needs a small computation (`ScottFrazierPowell2011`, the "KGCP" acquisition), though less
than full KG. The connection is exact and worth stating: **noisy EI restricts KG's report set
from all of $A$ to the evaluated points** — same risk-neutral one-step logic, smaller feasible
report set ($\mu^{**}$ vs. $\mu^*$). It is the most natural generalization of EI to noise.

## Relation to other notes

- **One-step optimality / [[bo-as-dynamic-program]].** EI is exactly the Bayes-optimal policy
  for a horizon of $N=n+1$ under the "report an evaluated point, noise-free" reward. It is
  *not* generally optimal for $N>n+1$; the multi-step optimal rule is a dynamic program whose
  one-step truncation EI is.
- **[[knowledge-gradient]].** KG keeps risk-neutral one-step reasoning but lets the report be
  *any* point in $A$ (value $\mu_n^*$), so it credits samples that improve the posterior mean
  *away* from where we sample — which EI, seeing only the marginal at $x$, structurally
  cannot. Noisy EI is the intermediate case above.
- **[[probability-of-improvement]].** Maximizes $P_n(f(x)>f^*_n)=\Phi(\Delta_n/\sigma_n)$ —
  EI's cdf term alone, *without* the $\Delta_n$ quality weighting or the $\sigma_n\varphi$
  exploration bonus, hence more exploitative.
- **Integrated & cost-aware EI (`snoek2012`).** The closed form above conditions on a point
  estimate of the GP hyperparameters; `snoek2012` instead **marginalizes EI over the
  hyperparameter posterior** by MCMC (see [[gp-hyperparameters]]) and rescales it by
  evaluation cost (*EI per second*) to trade value against expense — see [[ei-per-unit-cost]].
- **[[acquisition-functions]]** places EI in the taxonomy of improvement-, optimistic-, and
  information-based rules; **[[ego-convergence-rates]]** (`bull2011`) gives EI's convergence
  theory; **[[parallel-batch-bo]]** extends EI to a batch via
  $\mathrm{EI}_n(x^{(1:q)})=E_n[(\max_i f(x^{(i)})-f^*_n)^+]$.

## Origin and crosswalk

The improvement criterion originates with Mo\v{c}kus (`mockus1978`); the closed form and its
use inside a GP/kriging surrogate are due to `jones98`, whose **EGO** algorithm popularized
it. `jones98` derives the same formula through kriging algebra in a minimization setting; the
thought-experiment route above (from `frazier2018`) reaches it faster, so we take that as
primary and record the mapping here rather than re-deriving.

| This note (canonical, maximize) | `jones98` (EGO, minimize) | `mockus1978` | Note |
|---|---|---|---|
| $f^*_n=\max_{m\le n}f(x_m)$ | $f_{\min}$, current best | — | sign flip |
| $\Delta_n(x)=\mu_n(x)-f^*_n$ | $f_{\min}-\hat y(x)$ | — | margin, opposite sign |
| $\mathrm{EI}=\Delta\,\Phi(\Delta/\sigma)+\sigma\,\varphi(\Delta/\sigma)$ | $(f_{\min}-\hat y)\Phi(\cdot)+s\,\varphi(\cdot)$ | improvement concept | identical up to sign |
| $\mu_n,\sigma_n$ (GP posterior) | kriging predictor $\hat y$, s.d. $s$ | — | see [[gaussian-process-regression]] crosswalk |
