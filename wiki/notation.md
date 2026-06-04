---
title: Notation
slug: notation
tags: [reference]
requires: []
sources: [frazier2018, snoek2012]
---

# Notation

Canonical symbol table for the whole wiki. Every note assumes these symbols and restates
none of them; a note that introduces or overrides a symbol carries a short **Notation delta**
header instead (see [[CONVENTIONS]]). The table is anchored on `frazier2018`'s tutorial
notation, extended forward so later notes (UCB, KG, entropy search, cost-aware) share one
convention. Where a source differs, its mapping lives in that note's crosswalk, not here.

**Standing convention: we maximize.** $\max_{x\in A} f(x)$. Sources that minimize (e.g.
`jones98`, `srinivas2010`'s regret) are mapped to this convention in their notes' crosswalks.

## Objective and domain

| Symbol | Meaning |
|---|---|
| $f$ | objective function, $f:A\to\mathbb{R}$, to be maximized; black-box, expensive, derivative-free |
| $A$ | feasible set, $A\subseteq\mathbb{R}^d$ (typically a hyper-rectangle or simplex) |
| $d$ | input dimension (BayesOpt targets $d\lesssim 20$) |
| $x,\,x'$ | points in $A$ |
| $x^*$ | a global maximizer, $x^*\in\operatorname*{arg\,max}_{x\in A} f(x)$ |
| $f^* = f(x^*)$ | global maximum value |

## Data and sampling

| Symbol | Meaning |
|---|---|
| $n$ | number of evaluations performed so far |
| $N$ | total evaluation budget |
| $n_0$ | size of the initial (space-filling) design |
| $x_n$ | point sampled at iteration $n$ |
| $y_n$ | observation at $x_n$: $y_n=f(x_n)$ (noise-free) or $y_n=f(x_n)+\varepsilon_n$ (noisy) |
| $\varepsilon_n$ | observation noise, i.i.d. $\mathrm{Normal}(0,\lambda)$ |
| $\lambda$ | noise variance (often a hyperparameter) |
| $x_{1:n}$ | the sequence $x_1,\dots,x_n$; likewise $y_{1:n}$, $f(x_{1:n})=[f(x_1),\dots,f(x_n)]$ |
| $\mathcal{D}_n$ | history $\{(x_m,y_m)\}_{m=1}^n$ (equivalently $x_{1:n},y_{1:n}$) |
| $E_n[\cdot]$ | posterior expectation $E[\cdot\mid x_{1:n},y_{1:n}]$; likewise $P_n,\ \mathrm{Var}_n$ |

## Gaussian-process model

| Symbol | Meaning |
|---|---|
| $\mu_0$ | prior mean function; $\mu_0(x)$ |
| $\Sigma_0$ | prior covariance function (kernel); $\Sigma_0(x,x')$, positive semi-definite |
| $\mu_0(x_{1:k})$ | prior mean vector $[\mu_0(x_1),\dots,\mu_0(x_k)]$ |
| $\Sigma_0(x_{1:k},x_{1:k})$ | prior covariance matrix, entries $\Sigma_0(x_i,x_j)$ |
| $\mu_n(x)$ | posterior mean at $x$ after $n$ observations |
| $\sigma_n^2(x)$ | posterior variance at $x$; $\sigma_n(x)$ the posterior standard deviation |
| $\eta$ | vector of kernel/mean hyperparameters |
| $\sigma_f^2$ | kernel output scale (signal variance) |
| $\ell_{1:d}$ | per-dimension length-scales (ARD); smaller $\ell_i$ ⇒ faster variation in coordinate $i$ |
| $\nu$ | Matérn smoothness parameter |

## Acquisition functions

| Symbol | Meaning |
|---|---|
| $\alpha_n(x)$ | generic acquisition: value of sampling $x$ given $\mathcal{D}_n$; next point $x_{n+1}\in\operatorname*{arg\,max}_x\alpha_n(x)$ |
| $f^*_n = \max_{m\le n} f(x_m)$ | incumbent — best **observed** value (noise-free) |
| $I_n(x) = [f(x)-f^*_n]^+$ | improvement random variable; $a^+=\max(a,0)$ |
| $\Delta_n(x) = \mu_n(x)-f^*_n$ | improvement margin (expected gap to incumbent) |
| $\mu_n^* = \max_{x\in A}\mu_n(x)$ | best posterior-mean value over the whole domain (used by [[knowledge-gradient]]) |
| $\mu_n^{**} = \max_{i\le n}\mu_n(x_i)$ | best posterior mean among **evaluated** points (used by noisy [[expected-improvement]]) |
| $\mathrm{EI}_n,\ \mathrm{PI}_n,\ \mathrm{UCB}_n,\ \mathrm{KG}_n,\ \mathrm{ES}_n,\ \mathrm{PES}_n,\ \mathrm{MES}_n$ | the specific acquisition functions (see their notes) |
| $\beta_t$ | UCB exploration weight (see [[gp-ucb]]) |
| $p_\star(x\mid\mathcal D_n)$ | posterior probability that $x$ is the global maximizer, $P_n\big(x\in\operatorname*{arg\,max}_{x'\in A}f(x')\big)$ — a **global** functional of the posterior over $f$, not of the marginal at $x$; sampled by [[thompson-sampling-bo]], its entropy targeted by [[entropy-search]] / [[predictive-entropy-search]] |

## Standard normal

| Symbol | Meaning |
|---|---|
| $Z$ | standard normal variable, $Z\sim\mathrm{Normal}(0,1)$ |
| $\varphi$ | standard-normal probability density function |
| $\Phi$ | standard-normal cumulative distribution function |

## Operators and shorthand

| Symbol | Meaning |
|---|---|
| $a^+$ | $\max(a,0)$, positive part |
| $\operatorname*{arg\,max},\ \operatorname*{arg\,min}$ | maximizing / minimizing argument |
| $\mathrm{Normal}(m,\Sigma)$ | (multivariate) normal with mean $m$, covariance $\Sigma$ |
| $H(\cdot)$ | (differential) entropy; $I(\cdot\,;\cdot)$ mutual information (see [[entropy-search]]) |
| $\gamma_T$ | maximum information gain after $T$ evaluations, $\max_{S\subseteq A:\,|S|=T} I(\boldsymbol y_S;\boldsymbol f_S)$; kernel-dependent, controls GP-bandit regret (see [[gp-ucb]], [[regret-gp-bandits]]) |
| $\delta$ | failure probability $\delta\in(0,1)$ in high-probability bounds (see [[gp-ucb]]) |
| $\nabla$ | gradient with respect to $x$ unless stated otherwise |
