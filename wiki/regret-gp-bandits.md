---
title: Regret Bounds for GP Bandits
slug: regret-gp-bandits
summary: "Proof that GP-UCB is no-regret: instantaneous regret ≤ posterior width, summed into the information gain γ_T."
tags: [theory, regret]
subtopic: foundations
requires: [gp-ucb, problem-setup, gaussian-process-regression]
sources: [srinivas2010]
grade: derivation
reviewed: null
---

# Regret Bounds for GP Bandits

This is the proof home for the cumulative-regret guarantee [[gp-ucb]] states. The result
(`srinivas2010`): run GP-UCB with the right confidence schedule $\beta_t$ and its cumulative
regret is, with probability $\ge 1-\delta$ and **uniformly over all $T$**,

$$
\boxed{\ R_T \le \sqrt{C_1\,T\,\beta_T\,\gamma_T}\ } \qquad C_1 = \frac{8}{\log(1+\lambda^{-1})},
$$

i.e. $R_T = \mathcal O^*\!\big(\sqrt{T\,\beta_T\,\gamma_T}\big)$, where $\gamma_T$ is the
**maximum information gain** ([[notation]]) and $\mathcal O^*$ suppresses log factors. Because
$\beta_T$ grows only like $\log T$ and $\gamma_T$ grows sublinearly for the usual kernels,
$R_T$ is sublinear: GP-UCB is **no-regret**, $R_T/T\to 0$. The whole proof is three short
lemmas — a high-probability confidence band, a per-step regret bound, and a sum-of-variances
identity that converts $\sum_t\sigma_{t-1}^2$ into $\gamma_T$ — closed by Cauchy–Schwarz.

Symbols follow [[notation]]; we index by $n$ evaluations there, but the proof is cleaner in
`srinivas2010`'s round index $t$ (with posterior $\mu_{t-1},\sigma_{t-1}$ after $t-1$
observations), so this note uses $t$ throughout. The crosswalk reconciles the two.

> **Notation delta.** $\gamma_T,\ \delta,\ \beta_t,\ I(\cdot\,;\cdot),\ H(\cdot)$ are as in
> [[notation]]. $\lambda$ is the noise variance (`srinivas2010`'s $\sigma^2$). New here:
> $r_t=f(x^*)-f(x_t)$ instantaneous regret, $R_T=\sum_{t\le T} r_t$ cumulative regret (both
> in [[gp-ucb]]); $C_1=8/\log(1+\lambda^{-1})$, a kernel-free constant.

## The three settings

The same bound $R_T\le\sqrt{C_1 T\beta_T\gamma_T}$ (up to an additive constant) holds in three
regimes, differing only in the **assumption on $f$** and hence in the schedule $\beta_t$ needed
to make a confidence band hold simultaneously over all points and rounds.

| Setting | Assumption on $f$ | $\beta_t$ | `srinivas2010` |
|---|---|---|---|
| Finite $A$ | $f\sim\mathrm{GP}(0,\Sigma_0)$, $|A|<\infty$ | $2\log\!\big(\tfrac{\|A\|\,t^2\pi^2}{6\delta}\big)$ | Thm 1 |
| Compact $A\subset[0,r]^d$ | $f\sim\mathrm{GP}$, sample paths smooth (deriv. tail bound) | $2\log\!\big(\tfrac{2t^2\pi^2}{3\delta}\big)+2d\log\!\big(t^2 dbr\sqrt{\log(4da/\delta)}\big)$ | Thm 2 |
| Agnostic RKHS | $f$ fixed, $\|f\|_k^2\le B$; noise a bounded martingale difference | $2B+300\,\gamma_t\log^3(t/\delta)$ | Thm 3 |

All three share $C_1=8/\log(1+\lambda^{-1})$ and the same algebraic spine below. The first is the
cleanest; the second lifts it to a continuum by a per-round discretization; the third replaces
the Gaussian-tail confidence step with a martingale concentration argument. We derive the first
in full, then sketch what changes for the other two.

## Derivation (finite $A$): the spine

**Step 1 — a confidence band holding for all $x$ and all $t$.** Under the GP posterior,
$f(x)\mid\mathcal D_{t-1}\sim\mathrm{Normal}(\mu_{t-1}(x),\sigma_{t-1}^2(x))$
([[gaussian-process-regression]]). The standard Gaussian tail $\Pr\{Z>c\}\le\tfrac12 e^{-c^2/2}$
for $c>0$ gives, for each fixed $x,t$,

$$
\Pr\big\{\,|f(x)-\mu_{t-1}(x)| > \beta_t^{1/2}\,\sigma_{t-1}(x)\,\big\} \le e^{-\beta_t/2}.
$$

Now union-bound over the $|A|$ points and over rounds. Choosing
$\beta_t = 2\log(|A|\,\pi_t/\delta)$ with any $\pi_t>0$ satisfying $\sum_t\pi_t^{-1}=1$ makes the
per-$(x,t)$ failure mass $|A|e^{-\beta_t/2}=\delta/\pi_t$, so the total failure probability is
$\le\delta\sum_t\pi_t^{-1}=\delta$. Taking $\pi_t=\pi^2 t^2/6$ recovers the boxed schedule and
yields, with probability $\ge 1-\delta$,

$$
|f(x)-\mu_{t-1}(x)| \le \beta_t^{1/2}\,\sigma_{t-1}(x)\qquad\forall x\in A,\ \forall t\ge 1.
\tag{C}
$$

This is the engine: the $t^2$ inside the $\log$ is exactly what the $\sum_t t^{-2}=\pi^2/6$
union bound demands, and it is why $\beta_t$ must grow ($\sim\log t$). Condition on event (C)
for the rest of the argument.

**Step 2 — instantaneous regret is at most twice the posterior width.** GP-UCB picks
$x_t\in\operatorname*{arg\,max}_x[\mu_{t-1}(x)+\beta_t^{1/2}\sigma_{t-1}(x)]$, so its index at
$x_t$ dominates the index at $x^*$, which by (C) dominates $f(x^*)$:

$$
\mu_{t-1}(x_t)+\beta_t^{1/2}\sigma_{t-1}(x_t)
\;\ge\; \mu_{t-1}(x^*)+\beta_t^{1/2}\sigma_{t-1}(x^*)
\;\ge\; f(x^*).
$$

The first inequality is **optimism doing its job** — the greedy choice of $x_t$; the second is
(C) applied at $x^*$. Subtract $f(x_t)$ and apply (C) once more, this time at $x_t$, to bound
$\mu_{t-1}(x_t)-f(x_t)\le\beta_t^{1/2}\sigma_{t-1}(x_t)$:

$$
r_t = f(x^*)-f(x_t)
\le \beta_t^{1/2}\sigma_{t-1}(x_t) + \big(\mu_{t-1}(x_t)-f(x_t)\big)
\le 2\,\beta_t^{1/2}\,\sigma_{t-1}(x_t).
\tag{R}
$$

The lost reward at round $t$ is controlled by how *uncertain* GP-UCB still was at the point it
chose. This is the conceptual hinge: regret is paid in posterior standard deviation.

**Step 3 — sum of posterior variances $=$ information gain.** The information gain from the
trajectory $x_{1:T}$ has a telescoping closed form. Since the $x_t$ are deterministic given the
past and the conditional variance $\sigma_{t-1}^2(x_t)$ does not depend on the *values*
$y_{1:t-1}$, the chain rule for Gaussian entropy gives

$$
I(\boldsymbol y_{1:T};\boldsymbol f_{1:T})
= \tfrac12\sum_{t=1}^{T}\log\!\big(1+\lambda^{-1}\sigma_{t-1}^2(x_t)\big).
\tag{I}
$$

Each term is the per-step entropy reduction $\tfrac12\log(1+\lambda^{-1}\sigma_{t-1}^2)$ of one
noisy GP observation. This is the bridge to experimental design: the *same* mutual-information
functional that [[entropy-search]] and [[max-value-entropy-search]] optimize directly appears
here as a byproduct of optimizing reward. By definition $\gamma_T$ maximizes
$I(\boldsymbol y_A;\boldsymbol f_A)$ over all size-$T$ sets, so the GP-UCB trajectory satisfies
$I(\boldsymbol y_{1:T};\boldsymbol f_{1:T})\le\gamma_T$.

**Step 4 — combine, then Cauchy–Schwarz.** Square (R): $r_t^2\le 4\beta_t\sigma_{t-1}^2(x_t)$.
Two facts turn the variances into the log-terms of (I): $\beta_t$ is nondecreasing so
$\beta_t\le\beta_T$, and $s^2\le C_2\log(1+s^2)$ on $s\in[0,\lambda^{-1}]$ with
$C_2=\lambda^{-1}/\log(1+\lambda^{-1})$ — applicable because
$\lambda^{-1}\sigma_{t-1}^2(x_t)\le\lambda^{-1}\Sigma_0(x_t,x_t)\le\lambda^{-1}$ (bounded kernel
variance). Hence

$$
r_t^2 \le 4\beta_T\lambda\,C_2\log\!\big(1+\lambda^{-1}\sigma_{t-1}^2(x_t)\big),
\qquad
\sum_{t=1}^{T} r_t^2 \le \beta_T\,C_1\,I(\boldsymbol y_{1:T};\boldsymbol f_{1:T}) \le C_1\,\beta_T\,\gamma_T,
$$

using $C_1=8\lambda C_2=8/\log(1+\lambda^{-1})$ and (I). Finally Cauchy–Schwarz,
$R_T^2=\big(\sum_t r_t\big)^2\le T\sum_t r_t^2$, gives the boxed bound

$$
R_T \le \sqrt{T\sum_{t=1}^{T} r_t^2}\;\le\;\sqrt{C_1\,T\,\beta_T\,\gamma_T}\qquad\forall T\ge1.
$$

That is Theorem 1. The proof is entirely (C) → (R) → (I) → Cauchy–Schwarz; everything else is
constant-tracking.

## What changes in the continuum and the RKHS

**Compact $A$ (Theorem 2).** Step 1 cannot union-bound over an uncountable $A$. The fix: keep
(C) for the actually-*chosen* points $x_t$ (a countable set, schedule $\beta_t=2\log(\pi_t/\delta)$),
and separately control $x^*$ through a **per-round discretization** $A_t\subset A$ of size
$\tau_t^d$ fine enough that the nearest grid point $[x^*]_t$ satisfies
$|f(x^*)-f([x^*]_t)|\le 1/t^2$. The discretization error needs sample paths to be Lipschitz with
high probability — exactly the derivative-tail assumption
$\Pr\{\sup_x|\partial f/\partial x_j|>L\}\le a e^{-(L/b)^2}$, which holds for stationary kernels
that are four-times differentiable (squared-exponential, Matérn $\nu>2$) and **fails** for
Ornstein–Uhlenbeck (Matérn $\nu=\tfrac12$, nondifferentiable paths). Covering the continuum
costs the extra $2d\log(\cdots)$ term in $\beta_t$ (the explicit $d$-dependence), and Step 2
picks up a $+1/t^2$ slack; summed, $\sum_t t^{-2}=\pi^2/6$ adds a constant, giving
$R_T\le\sqrt{C_1 T\beta_T\gamma_T}+2$.

**Agnostic RKHS (Theorem 3).** Here $f$ is fixed with $\|f\|_k^2\le B$ and the noise is only a
bounded martingale difference — so $f(x)\mid\mathcal D_{t-1}$ is **not** Gaussian and the
Step-1 tail bound is invalid. Replace (C) by an RKHS argument: the error
$Z_T=\|\mu_T-f\|_{k_T}^2$ (norm in the *data-dependent* RKHS of $k_T$) controls the pointwise gap
via $|\mu_t(x)-f(x)|\le\sigma_t(x)\,\|\mu_t-f\|_{k_T}$ (reproducing property + Cauchy–Schwarz),
and $Z_T$ is shown to stay $\le\beta_{T+1}$ by an *inductive* **Freedman martingale**
concentration on $Z_T$'s growth — Hoeffding–Azuma is too weak ($T^{3/4}$); Freedman bounds the
sum of *conditional* variances $V_T\le 9\beta_T\gamma_T$ instead. This forces the
$\beta_t=2B+300\,\gamma_t\log^3(t/\delta)$ schedule, which couples $\beta_t$ to $\gamma_t$
itself. Once a confidence band of the form (C) is re-established, Steps 2–4 carry over verbatim,
giving $R_T=\mathcal O^*(\sqrt T(B\sqrt{\gamma_T}+\gamma_T))$.

> **Remark — where the constants come from, and why to ignore them.** The 300 and $\log^3$ in
> the RKHS schedule, and the $\pi^2/6$ everywhere, are artifacts of making a worst-case,
> all-rounds-simultaneously union/martingale bound close — not tight prescriptions. `srinivas2010`
> scales $\beta_t$ down by 5 in experiments and notes they "did not optimize constants." The
> durable content is the *functional form* of $\beta_t$ ($\sim\log t$ growth, $d$-dependence,
> $\gamma_t$-coupling); see [[gp-ucb]]'s schedule remark.

## Kernel dependence: bounding $\gamma_T$

The regret bound is only as good as the growth of $\gamma_T$, which is **kernel- and
domain-dependent**. `srinivas2010` bounds it in two stages. First, $\gamma_T$ is the max of a
**submodular** set function $A\mapsto I(\boldsymbol y_A;\boldsymbol f_A)$ — diminishing returns,
since each observation shrinks remaining uncertainty — so greedy maximization (the
[[entropy-search|experimental-design]] rule $x_t\in\operatorname*{arg\,max}_x\sigma_{t-1}(x)$,
which ignores observed values) gets within a $(1-1/e)$ factor and **upper-bounds** $\gamma_T$.
Second, relaxing greedy selection to the leading eigenvectors of the kernel matrix bounds
$\gamma_T$ by the **spectral decay** of $k$: the faster the eigenvalues of $\Sigma_0$ decay, the
fewer effective directions to learn, the slower $\gamma_T$ grows. The resulting rates:

| Kernel | spectral decay | $\gamma_T$ | regret $R_T=\mathcal O^*(\sqrt{T\beta_T\gamma_T})$ |
|---|---|---|---|
| linear ($\Sigma_0(x,x')=x^\top x'$) | finite rank $d$ | $\mathcal O(d\log T)$ | $\mathcal O^*(d\sqrt T)$ |
| squared-exponential | exponential | $\mathcal O((\log T)^{d+1})$ | $\mathcal O^*(\sqrt{T}\,(\log T)^{(d+1)/2})$ |
| Matérn, $\nu>1$ | power law | $\mathcal O\!\big(T^{\frac{d(d+1)}{2\nu+d(d+1)}}\log T\big)$ | sublinear for the same exponent |

All are sublinear in $T$, so $R_T/T\to 0$ in every case. The squared-exponential rate is the
headline: $d$ enters $\gamma_T$ only *inside* the $\log$, so the bound has **strikingly weak
dependence on dimension** — its high path-smoothness combats the curse of dimensionality. The
linear rate $\mathcal O^*(d\sqrt T)$ recovers, up to log factors, the stochastic-linear-bandit
bound of Dani–Hayes–Kakade (whose role $d$ plays is exactly $\gamma_T$'s here).

## Relation / Interpretation

- **Proof home for [[gp-ucb]].** That note states $R_T=\mathcal O^*(\sqrt{T\beta_T\gamma_T})$
  and defers here; this note delivers it, in the same notation, with the explicit constant
  $C_1=8/\log(1+\lambda^{-1})$ and the three settings.
- **Upper ↔ lower pairing.** This is the *upper* bound. `srinivas2010` itself matches known
  lower bounds only in the finite-armed and linear special cases (up to log factors); the general
  information-theoretic **lower** bounds on $\sqrt{T\gamma_T}$ — establishing near-tightness — live
  in [[gp-bandit-lower-bounds]]. An upper bound is only as meaningful as its lower companion; read
  them together.
- **$\gamma_T$ is the experimental-design bridge.** The sum-of-variances identity (I) is the
  *same* mutual information that [[entropy-search]] / [[predictive-entropy-search]] /
  [[max-value-entropy-search]] maximize *on purpose*. GP-UCB optimizes reward yet **inherits**
  the information-design quantity in its regret — `srinivas2010`'s central conceptual point,
  and why [[max-value-entropy-search]] can borrow the same $\gamma_T$ machinery.
- **Posterior variance is the currency.** Every step routes through $\sigma_{t-1}$
  ([[gaussian-process-regression]]): the confidence band is $\pm\beta_t^{1/2}\sigma_{t-1}$,
  regret is $\le2\beta_t^{1/2}\sigma_{t-1}$, and the budget on $\sum\sigma_{t-1}^2$ is $\gamma_T$.
- **Related analyses.** [[thompson-sampling-bo]] (randomized optimism) admits a closely parallel
  regret proof, the posterior draw playing the role of the optimistic index in Step 2.

## Crosswalk

`srinivas2010` frames the problem as **maximizing cumulative reward / minimizing regret** over
$f$ with round index $t$; the wiki standing convention is **maximize $f$** — and since both this
note and the paper measure regret *to* the maximum, the sign conventions coincide (no flip
needed for $R_T$ itself; the "minimization" in the title refers to minimizing regret). The
$n$-vs-$t$ indexing is the only systematic relabel.

| This note (canonical, maximize) | `srinivas2010` | Note |
|---|---|---|
| round index $t$; $\mu_{t-1},\sigma_{t-1}$ after $t-1$ obs | same | [[notation]] uses $n$ evaluations, $\mu_n,\sigma_n$; here $t\leftrightarrow n{+}1$ |
| $\lambda$ (noise variance) | $\sigma^2$ | $\sigma$ is noise s.d.; distinct from posterior $\sigma_{t-1}(x)$ |
| $\Sigma_0(x,x')$ (kernel) | $k(x,x')$, with $k(x,x)\le1$ | bounded-variance assumption used in Step 4 |
| $\gamma_T=\max_{S\subseteq A:\,|S|=T} I(\boldsymbol y_S;\boldsymbol f_S)$ | $\gamma_T$ (eq. 7) | same symbol; [[notation]] |
| $r_t=f(x^*)-f(x_t)$, $R_T=\sum_t r_t$ | identical | reward lost; both maximize |
| $C_1=8/\log(1+\lambda^{-1})$ | $C_1=8/\log(1+\sigma^{-2})$ | kernel-free constant, $\ge 8\lambda$ |
| confidence band (C) | Lemmas 5.1 / 5.5–5.7 (Thm 6 in RKHS) | finite / continuum / agnostic |
| regret step (R) | Lemma 5.2 (Lemma 5.8 with $+1/t^2$ slack) | optimism + band |
| variance identity (I) | Lemma 5.3 | Gaussian entropy chain rule |
| $\sum_t r_t^2\le C_1\beta_T\gamma_T$ | Lemma 5.4 | $s^2\le C_2\log(1+s^2)$ + bounded kernel |
| $\beta_t$ schedules | Thms 1–3 | see *Three settings* table |
