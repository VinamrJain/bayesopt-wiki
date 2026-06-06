---
title: Knowledge Gradient
slug: knowledge-gradient
tags: [acquisition, lookahead, decision-theoretic, value-of-information]
subtopic: decision-theoretic
requires: [problem-setup, gaussian-process-regression, expected-improvement, value-of-information]
sources: [frazier2009kg, frazier2018]
summary: "One-step value-of-information on the global max; EI's lookahead cousin."
grade: derivation
reviewed: null
---

# Knowledge Gradient

The knowledge gradient (KG) is the acquisition obtained by taking
[[expected-improvement]]'s decision-theoretic thought experiment and relaxing its single
most restrictive premise: that the final answer we report must be a point we have
**actually evaluated**. Let the report be *any* point in $A$, valued by its posterior mean,
and the one-step [[value-of-information|value-of-information]] rule that results credits a
sample for raising the posterior mean **anywhere** in the domain — not only at the sampled
point. That is the whole idea; everything below is consequence. Symbols follow [[notation]].

## Definition

Run the [[acquisition-functions|BayesOpt loop]] and suppose we are **risk-neutral**: a
random final value is worth its posterior expectation (`frazier2009kg`, §2). If forced to
stop after $n$ evaluations and report a single solution $\widehat{x}^*\in A$, we value the
report by its posterior mean $\mu_n(\widehat{x}^*)$; the best report is therefore the
posterior-mean maximizer, worth

$$
\mu_n^* := \max_{x'\in A}\mu_n(x').
$$

This is the same risk-neutral logic as EI, with **one premise dropped**: $\widehat{x}^*$ may
be any point in $A$, evaluated or not. (EI instead restricts the report to evaluated points,
giving the incumbent $f^*_n$.)

Now grant one more evaluation at $x$. The observation $y_{n+1}$ updates the GP to a new
posterior mean $\mu_{n+1}(\cdot)$, whose maximum
$\mu_{n+1}^* := \max_{x'\in A}\mu_{n+1}(x')$ is the value of the *new* best report. The
incremental gain in report value is $\mu_{n+1}^*-\mu_n^*$. This is unknown before sampling,
so — exactly as with EI — we take its posterior expectation. That is the knowledge gradient
(`frazier2009kg`, eq. 11):

$$
\boxed{\ \mathrm{KG}_n(x) := E_n\big[\,\mu_{n+1}^* - \mu_n^*\ \big|\ x_{n+1}=x\,\big]\ },
\qquad x_{n+1}\in\operatorname*{arg\,max}_{x\in A}\mathrm{KG}_n(x).
$$

The name reads $\mu_{n+1}^*-\mu_n^*$ as the *increment in knowledge* (the rise in the best
attainable posterior-mean value) produced by one measurement, and KG as its expected
gradient. Note $\mu_n^*$ does not depend on $x$, so it shifts $\mathrm{KG}_n$ by a constant
and drops out under $\nabla$ and $\operatorname*{arg\,max}$ — useful for the gradient below.

## As a value of information

KG is one [[value-of-information]] in pure form. The VoI of sampling $x$ under a
knowledge-utility $u$ is $\mathrm{VoI}_n(x)=E_n[\,u(\mathcal D_n\cup\{(x,y)\})-u(\mathcal D_n)\,]$
(see [[value-of-information]], [[acquisition-functions]]). Take the utility to be the **best
attainable posterior-mean value over the whole domain**,

$$
u(\mathcal D) = \max_{x'\in A}\mu(x') \quad(=\mu_n^*\ \text{at}\ \mathcal D_n),
$$

and the VoI is exactly $\mathrm{KG}_n(x)$. Thus KG is the value-of-information acquisition for
the *global posterior-mean-max* utility, just as [[expected-improvement|EI]] is the VoI for
the *best-evaluated-value* utility $u(\mathcal D)=\max_i f(x_i)$. The two acquisitions are the
same risk-neutral one-step machine pointed at two different utilities; the utility is the only
thing that differs.

## Why KG ≠ EI

The contrast is entirely in the utility, and it is structural.

- **EI's utility is the best *evaluated* value.** A sample at $x$ can change that utility only
  through $f(x)$ itself, so EI credits a point solely for the improvement it produces **at
  $x$**. Correspondingly, EI reads the posterior only through the marginal
  $f(x)\sim\mathrm{Normal}(\mu_n(x),\sigma_n^2(x))$ — never through how a sample at $x$ would
  reshape beliefs elsewhere (see [[expected-improvement]]).
- **KG's utility is the global posterior-mean max.** One observation at $x$ shifts the entire
  posterior mean $\mu_{n+1}(\cdot)$ — including at points far from $x$, through the kernel's
  cross-covariance — so it can raise $\mu^*$ even when $\mu_{n+1}(x)$ is unremarkable. KG
  therefore reads the **full-domain** posterior and **how the sample changes it**
  (`frazier2018`: "Unlike expected improvement, which only considers the posterior at the
  point sampled, the KG acquisition considers the posterior over $f$'s full domain, and how
  the sample will change that posterior").

Concretely, KG places positive value on a measurement that lifts the posterior-mean maximum
even if the sampled value is no better than the current best — a credit EI structurally
cannot assign.

## The report-set hierarchy

EI, noisy EI, and KG are the **same one-step risk-neutral rule under three nested choices of
report set** — the cleanest way to see them as one family. All value the report by posterior
mean (noise-free EI by the observed value, which coincides with the mean at a noise-free
point); they differ only in *which points may be reported*.

| Acquisition | Report set | Report valued by | Stop-now value | Permissiveness |
|---|---|---|---|---|
| [[expected-improvement\|EI]] (noise-free) | evaluated points | observed value $f(x_i)$ | $f^*_n=\max_{m\le n}f(x_m)$ | most restrictive |
| noisy EI / KGCP (`ScottFrazierPowell2011`) | evaluated points | posterior mean $\mu_n(x_i)$ | $\mu_n^{**}=\max_{i\le n}\mu_n(x_i)$ | intermediate |
| **KG** | **all of $A$** | posterior mean $\mu_n(x')$ | $\mu_n^*=\max_{x'\in A}\mu_n(x')$ | most permissive |

Reading down the table, the report set grows from the evaluated points to the entire domain,
so $\mu_n^{**}\le\mu_n^*$ always. **Noisy EI is exactly KG with the report set restricted from
$A$ back to the evaluated points** — same risk-neutral one-step logic, smaller feasible report
set ($\mu^{**}$ vs. $\mu^*$); equivalently KG is noisy EI freed to report anywhere. This is the
first-class connection between the two notes; [[expected-improvement]]'s "Noisy evaluations"
section states the same equivalence from EI's side.

> **Notation delta.** $\mu_n^*:=\max_{x'\in A}\mu_n(x')$ — best posterior mean over the
> **whole domain** (this note) — versus $\mu_n^{**}:=\max_{i\le n}\mu_n(x_i)$, the max over
> **evaluated** points used by noisy [[expected-improvement]]. Both are in [[notation]];
> the delta is a reminder, not a new symbol.

## Computation

Unlike EI, KG has **no closed form** in general — $\mu_{n+1}^*$ is itself a maximization over
$A$ of the (random) updated posterior mean, nested inside an expectation. Two routes
(`frazier2018`, §KG):

**Simulation.** Estimate $\mathrm{KG}_n(x)$ by Monte Carlo over the outcome $y_{n+1}$:

1. Compute $\mu_n^*=\max_{x'\in A}\mu_n(x')$ once (e.g. by L-BFGS).
2. For $j=1,\dots,J$: draw $Z^{(j)}\sim\mathrm{Normal}(0,1)$, set
   $y_{n+1}^{(j)}=\mu_n(x)+\sigma_n(x)\,Z^{(j)}$ (the posterior-predictive draw at $x$); form
   the one-step-updated posterior mean $\mu_{n+1}(\cdot\,;x,y_{n+1}^{(j)})$ via the GP update
   ([[gaussian-process-regression]]); compute
   $\mu_{n+1}^{*(j)}=\max_{x'\in A}\mu_{n+1}(x'\,;x,y_{n+1}^{(j)})$ and the increment
   $\Delta^{(j)}=\mu_{n+1}^{*(j)}-\mu_n^*$.
3. Estimate $\mathrm{KG}_n(x)\approx \tfrac1J\sum_{j=1}^J\Delta^{(j)}$ (consistent as
   $J\to\infty$).

Each replication contains an inner optimization over $A$ (for $\mu_{n+1}^{*(j)}$), so KG is
far costlier than EI — by roughly the inner-optimization factor, on top of the $J$ samples and
the outer $\operatorname*{arg\,max}_x$.

**Maximizing $\mathrm{KG}_n(x)$.** Two strategies:

- **Discretize $A$** and evaluate $\mathrm{KG}_n$ exactly using normal-distribution properties
  (`frazier2009kg`): on a finite alternative set the expected-max term reduces to a piecewise-
  linear computation (its $h(a,b)$ below), giving $\mathrm{KG}_n$ in closed form per candidate.
  Clean in low dimension; the discretization blows up in high dimension.
- **Stochastic-gradient ascent** (`frazier2018`, attributing Wu & Frazier 2016). Exchanging gradient and
  expectation, and using that $\mu_n^*$ is constant in $x$,

  $$
  \nabla\mathrm{KG}_n(x) = E_n\big[\nabla\mu_{n+1}^*\ \big|\ x_{n+1}=x\big],
  $$

  an unbiased stochastic gradient is obtained per sample $Z$ by the envelope theorem: find the
  inner maximizer $\widehat{x}^*=\operatorname*{arg\,max}_{x'}\mu_{n+1}(x'\,;x,\mu_n(x)+\sigma_n(x)Z)$,
  then differentiate $\mu_{n+1}(\widehat{x}^*\,;x,\mu_n(x)+\sigma_n(x)Z)$ w.r.t. $x$ holding
  $\widehat{x}^*$ fixed. Feed this into multi-start SGD; this scales to higher dimension where
  discretization fails.

## Myopia — KG is one-step, not multi-step optimal

KG is risk-neutral and **one-step**: it values a *single* next evaluation under the
posterior-mean report. By construction it is the Bayes-optimal rule for a horizon of exactly
one remaining evaluation — when $N=n+1$, KG maximizes the terminal expected report value
$E_n[\max_{x'}\mu_{n+1}(x')]$ and so is optimal (`frazier2009kg`, Remark 1); it is moreover the
*only* stationary policy that is myopically optimal (Remark 2). But for $N>n+1$ it is **not**
generally optimal: greedily maximizing one-step gain ignores how this sample sets up *later*
samples. The fully rational rule is the finite-horizon dynamic program over the whole budget
([[bo-as-dynamic-program]]), whose one-step truncation under the posterior-mean report is
precisely KG — the exact analogue of EI being the DP's one-step truncation under the
evaluated-point report. KG widens the report set; it does **not** lengthen the horizon.

> **Remark.** `frazier2009kg`'s asymptotic-optimality result (its Thm. 4) is *not* a
> contradiction: it says the KG policy's *value* converges to the optimal policy's value as
> $N\to\infty$ (both eventually identify the best alternative), not that the greedy one-step
> decision equals the multi-step-optimal decision at finite $N$. Asymptotic value-optimality,
> not per-step optimality.

## When KG wins

In the **standard noise-free** problem KG buys only a small improvement over EI
(`frazier2009kg`; `frazier2018`): when evaluations are exact, the benefit of a sample is mostly
realized at the sampled point, exactly where EI already looks. KG pays off when the value of a
sample accrues **away from where it is taken** — when one observation reshapes the posterior
mean broadly (`frazier2018`):

- **Noisy evaluations** — the incumbent $f^*_n$ is ill-defined and a sample's information is
  diffuse; KG (and the intermediate noisy EI) handle this natively, where plug-in EI is ad hoc.
- **Derivative / gradient observations** — a gradient at $x$ can lift the posterior-mean max in
  a whole neighborhood even if $f(x)$ is unremarkable.
- **Multi-fidelity, decoupled, or environmental-condition settings** — where a cheap or partial
  observation improves the global posterior mean without directly improving the best evaluated
  point.

In each, "the value of sampling comes not through an improvement in the best solution *at the
sampled point*, but through an improvement in the maximum of the posterior mean across feasible
solutions" (`frazier2018`) — precisely the utility KG, and not EI, optimizes.

## Relation to other notes

- **[[expected-improvement]]** — KG is EI with the report set widened from evaluated points to
  all of $A$ (and the value from observed to posterior mean). The report-set hierarchy above is
  the shared spine of the two notes.
- **[[value-of-information]]** — KG is the VoI for the utility $u(\mathcal D)=\max_{x'\in A}\mu(x')$;
  this note is the canonical instance of that general frame.
- **[[acquisition-functions]]** — KG sits in the information/lookahead family; the hub frames it
  as the VoI rule with the global posterior-mean-max utility.
- **[[bo-as-dynamic-program]]** — KG is the one-step truncation of the budget-$N$ DP under the
  posterior-mean report; non-myopic acquisitions approximate more of the horizon.

## Origin and crosswalk

The knowledge-gradient policy originates in Bayesian ranking & selection (`frazier2009kg`,
building on Frazier–Powell–Dayanik 2008 and Gupta–Miescke 1996), where $A=\{1,\dots,M\}$ is a
finite set of **alternatives** $i$ with independent normal samples and a *correlated*
multivariate-normal prior on the mean vector $\theta$; the same one-step VoI rule is the "Bayes
one-step" policy of Mockus et al. (1978) under a Wiener prior. `frazier2018` ports it to the
GP-over-continuous-$A$ BayesOpt setting used here. We take the continuous BayesOpt statement as
canonical and map the R&S notation below.

| This note (GP / continuous $A$) | `frazier2009kg` (R&S / discrete) | Note |
|---|---|---|
| $\mu_n(x)$, posterior mean at $x\in A$ | $\mu_i^n$, posterior mean of alternative $i$ | superscript $n$ for time; $A$ finite there |
| $\mu_n^*=\max_{x'\in A}\mu_n(x')$ | $\max_i\mu_i^n$ | best posterior-mean value (stop-now report) |
| $\mathrm{KG}_n(x)=E_n[\mu_{n+1}^*-\mu_n^*\mid x_{n+1}=x]$ | $\mathbb E_n[\max_i\mu_i^{n+1}\mid S^n,x^n=x]-\max_i\mu_i^n$ (eq. 11) | identical; $S^n=(\mu^n,\Sigma^n)$ is the belief state |
| posterior-predictive draw $y_{n+1}=\mu_n(x)+\sigma_n(x)Z$ | increment $\mu^{n+1}=\mu^n+\tilde\sigma(\Sigma^n,x)Z^{n+1}$ (eq. 8) | Gaussian-increment update of the mean vector |
| simulation / SGD over continuous $A$ | exact $h(a,b)=\mathbb E[\max_i a_i+b_iZ]-\max_i a_i$ on finite $A$ (eq. 13) | discretized exact form vs. continuous estimate |
| cost: inner $\operatorname*{arg\,max}_{x'}$ per sample | $O(M^2\log M)$ per decision (vs. $O(M)$ independent KG) | both far above EI |
