---
title: Acquisition Functions
slug: acquisition-functions
tags: [acquisition, taxonomy, decision-theoretic, hub]
subtopic: foundations
requires: [problem-setup, gaussian-process-regression]
sources: [frazier2018, shahriari2016]
summary: "The decision rule of the BO loop; taxonomy of acquisition strategies."
grade: concept
reviewed: null
---

# Acquisition Functions

The acquisition function is the **decision rule** of the [[problem-setup|BayesOpt loop]]: given
the GP posterior after $n$ evaluations, it scores each candidate $x$ by the value of sampling
there next, and the loop queries its maximizer,

$$
\alpha_n : A \to \mathbb{R}, \qquad x_{n+1} \in \operatorname*{arg\,max}_{x\in A}\alpha_n(x).
$$

This is the [[problem-setup|surrogate–acquisition decomposition]]: the
[[gaussian-process-regression|surrogate]] summarizes everything known about $f$ as a
posterior; the acquisition turns that posterior into the next action. Every acquisition is
**cheap** — an analytic functional of the posterior statistics $(\mu_n,\sigma_n^2)$, not of the
expensive $f$ — so the hard global problem over $f$ is traded for a sequence of easy problems
over $\alpha_n$. This note frames the design space; each acquisition has its own note. Symbols
follow [[notation]].

## The value-of-information frame

Every acquisition answers the same question — *which single evaluation is worth the most?* —
and differs only in how it assigns that worth. The unifying device is a **utility** $u$ on the
state of knowledge: if the posterior after data $\mathcal D$ has utility $u(\mathcal D)$, the
value of sampling $x$ is the expected one-step gain

$$
\alpha_n(x) = E_n\!\big[\,u(\mathcal D_n \cup \{(x, y)\}) \;-\; u(\mathcal D_n)\,\big],
$$

the expectation taken over the unknown outcome $y\mid x,\mathcal D_n$ under the GP posterior.
This is a **value of information**: the expected improvement in our knowledge-utility from one
more observation. The standard acquisitions are exactly the choices of $u$:

- $u(\mathcal D)=\max_i f(x_i)$ (best **evaluated** value, noise-free) gives
  **[[expected-improvement|expected improvement]]**: $\alpha_n=E_n[(f(x)-f^*_n)^+]$.
- $u(\mathcal D)=\max_{x'\in A}\mu(x')$ (best **posterior-mean** value over the whole domain)
  gives the **[[knowledge-gradient|knowledge gradient]]**: it credits a sample for improving
  the posterior mean *anywhere*, not just at $x$.
- $u(\mathcal D)=-H\big(p_\star(\cdot\mid\mathcal D)\big)$ (negative entropy of the posterior
  over the location $x^*$, or value $f^*$, of the optimum) gives the
  **[[entropy-search|information-theoretic]]** family: sample to learn the most about where —
  or how high — the optimum is.

Two further rules do not fit the expected-one-step-gain template but answer the same question
through the posterior directly:

- **[[gp-ucb|GP-UCB]]** scores $x$ by an *optimistic* upper quantile of its posterior marginal,
  $\mu_n(x)+\beta_n^{1/2}\sigma_n(x)$ — act as if $f$ were as large as the posterior plausibly
  allows. This is the one common acquisition carrying a **regret guarantee**.
- **[[thompson-sampling-bo|Thompson sampling]]** scores by a *random draw* from the posterior:
  sample a function $g$ from the GP posterior and query $\operatorname*{arg\,max}_x g(x)$,
  equivalently draw $x_{n+1}\sim p_\star(x\mid\mathcal D_n)$. It is the randomized counterpart
  of optimism.

## The four families

| Family | Members | Scores $x$ by | Explore/exploit knob | Guarantee |
|---|---|---|---|---|
| **Improvement** | [[expected-improvement\|EI]], [[probability-of-improvement\|PI]] | expected (EI) or probable (PI) gain over the incumbent $f^*_n$ | none (EI); margin $\xi$ (PI) | convergence ([[ego-convergence-rates]]) |
| **Optimistic** | [[gp-ucb\|GP-UCB]] | upper confidence quantile $\mu_n+\beta_n^{1/2}\sigma_n$ | explicit additive $\beta_n$ | sublinear regret ([[regret-gp-bandits]]) |
| **Randomized** | [[thompson-sampling-bo\|Thompson sampling]] | one posterior function draw | none (posterior-driven) | regret (TS analyses) |
| **Information / lookahead** | [[knowledge-gradient\|KG]], [[entropy-search\|ES]], [[predictive-entropy-search\|PES]], [[max-value-entropy-search\|MES]] | expected gain in a global utility ($\mu_n^*$ for KG; entropy of $p_\star$ for ES/MES) | implicit (value-of-information) | — |

The families are four answers to one explore/exploit question, differing in **how a
plausible-but-unobserved high value is credited**: as expected improvement at the sampled point
(EI/PI), as a deterministic confidence bonus (UCB), as a random posterior draw (TS), or as
information gained about the optimum (KG/ES). EI, PI, and GP-UCB read the posterior only through
its **marginal at $x$** and so are *myopic* — they cannot credit a sample for reshaping beliefs
elsewhere; KG and the entropy methods read the **global** posterior and so can.

## Exploration vs. exploitation

Every acquisition must balance sampling where the mean $\mu_n$ is high (**exploitation**)
against where the variance $\sigma_n^2$ is high (**exploration**); the families encode the
balance differently, and this is the sharpest axis for telling them apart.

- **Implicit, parameter-free.** EI's closed form $\Delta_n\Phi(\Delta_n/\sigma_n) +
  \sigma_n\varphi(\Delta_n/\sigma_n)$ is increasing in *both* $\Delta_n=\mu_n-f^*_n$ and
  $\sigma_n$; its iso-curves trade them with no tunable weight. Thompson sampling is likewise
  parameter-free — the posterior supplies the balance.
- **Explicit knob.** GP-UCB exposes the weight as the additive coefficient $\beta_n^{1/2}$
  (large ⇒ explore, small ⇒ exploit); PI exposes it as the margin $\xi$. Both are simple but
  must be set, and the theoretically-motivated GP-UCB schedule is famously over-conservative in
  practice (see [[gp-ucb]]).
- **Degenerate limits.** Pure exploitation $\operatorname*{arg\,max}_x\mu_n(x)$ stalls in
  shallow optima; pure exploration $\operatorname*{arg\,max}_x\sigma_n(x)$ (experimental
  design) ignores the observed values entirely. Every useful acquisition lives between these
  poles — PI at $\xi=0$ collapses toward the first, which is its [[probability-of-improvement|
  characteristic pathology]].

## The inner optimization

Whatever the family, each loop iteration must solve $x_{n+1}\in\operatorname*{arg\,max}_x
\alpha_n(x)$ — itself a global optimization, but a **cheap** one: $\alpha_n$ is fast to
evaluate and (for EI, PI, GP-UCB) analytically differentiable, so a multi-start quasi-Newton
solver (e.g. L-BFGS-B) suffices (`frazier2018`; see `wilson2018` for gradient-based maximization
of Monte-Carlo acquisitions). The information/lookahead acquisitions are harder: KG and the
entropy methods have no closed form and are estimated by simulation, then optimized by
stochastic-gradient ascent or over a discretization of $A$ (`frazier2018`, §KG). The cost of the
inner optimization — not the cost of evaluating $f$ — is what separates "cheap" myopic
acquisitions from "expensive" lookahead ones.

## Myopia and the dynamic-programming parent

All the acquisitions above are **one-step**: they value a single next evaluation. The fully
rational rule maximizes the value of *all* remaining evaluations jointly under the budget $N$ —
a finite-horizon dynamic program ([[bo-as-dynamic-program]]). That DP is intractable, and the
common acquisitions are its tractable approximations: EI is exactly the DP's one-step truncation
under the "report an evaluated point, noise-free" reward, and KG/ES relax that reward while
staying one-step. Non-myopic acquisitions ([[bo-as-dynamic-program]],
[[multistep-budgeted-bo]]) approximate more of the horizon. Reading the myopic acquisitions as
**one-step truncations of a common dynamic program** is the cleanest way to see them as a
family rather than a grab-bag.

## Relation to other notes

- [[expected-improvement]] — the default and the exemplar; the one-step VoI rule under
  noise-free evaluated-point reporting.
- [[probability-of-improvement]] — EI's coarser sibling (indicator utility).
- [[gp-ucb]] — optimism with a regret guarantee; explicit $\beta_n$ knob.
- [[thompson-sampling-bo]] — randomized optimism via posterior sampling.
- [[knowledge-gradient]] — global-utility VoI; credits posterior-mean improvement anywhere.
- [[entropy-search]], [[predictive-entropy-search]], [[max-value-entropy-search]] — information
  about the optimum's location/value as the utility.
- [[bo-as-dynamic-program]] — the multi-step decision problem these one-step rules approximate.
- [[value-of-information]] — the decision-theoretic quantity underlying the whole frame.

## Crosswalk

`frazier2018` (§Acquisition Functions) presents EI, KG, ES, and PES as a progression from the
default to rules that relax EI's "benefit accrues at the sampled point" assumption; it does not
cover PI, GP-UCB, or Thompson sampling. `shahriari2016` (the survey "Taking the Human Out of the
Loop") supplies the complementary taxonomy — improvement-based (PI, EI), optimistic (GP-UCB),
and information-based (TS, ES/PES) — and the randomized/portfolio framing. The two together span
the families tabulated above; per-source notation reconciliations live in each acquisition's own
crosswalk, not here.
