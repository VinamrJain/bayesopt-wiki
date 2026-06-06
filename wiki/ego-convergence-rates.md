---
title: Convergence Rates of EGO / Expected Improvement
slug: ego-convergence-rates
summary: "EI's simple-regret rate in the fixed-kernel RKHS: near-minimax $n^{-(\\nu\\wedge1)/d}$, optimal $n^{-\\nu/d}$ with an $\\epsilon$-greedy fix; MLE hyperparameters can break it."
tags: [theory, convergence]
subtopic: foundations
requires: [expected-improvement, problem-setup, gaussian-process-regression]
sources: [bull2011]
grade: derivation
reviewed: null
---

# Convergence Rates of EGO / Expected Improvement

[[expected-improvement]] is cheap, principled, and empirically strong — but does it actually
*converge* on the optimum, and how fast? `bull2011` answers this in the cleanest setting:
**fixed kernel, noise-free, and $f$ assumed to live in the kernel's reproducing-kernel Hilbert
space (RKHS).** The headline results: EI's [[problem-setup|simple regret]] decays at the
near-minimax rate $n^{-(\nu\wedge1)/d}$ (up to log factors), a small $\epsilon$-greedy
modification recovers the optimal $n^{-\nu/d}$ for all finite smoothness $\nu$, and — a
cautionary result — running EI with the *usual* maximum-likelihood hyperparameter estimates can
make it **fail to converge at all**. This is why [[gp-hyperparameters]] flags that the
guarantees here condition on fixed $\eta$.

Symbols follow [[notation]]. We **maximize**; `bull2011` minimizes, so signs and "best"/"worst"
flip throughout — see the crosswalk. The note states results in the canonical maximizing
convention and proves the central rate (Theorem 2 below).

> **Notation delta.**
> - $r_n := f^* - f^*_n$ — simple regret (the loss; "$f(x_n^*)-\min f$" in `bull2011`).
> - $\|f\|_{\mathcal H_\theta}$ — RKHS norm of $f$ for the kernel with length-scales $\theta$;
>   $B_R=\{f:\|f\|_{\mathcal H_\theta}\le R\}$ its ball of radius $R$.
> - $L_n(u,R) := \sup_{\|f\|_{\mathcal H_\theta}\le R} E_f^u[r_n]$ — worst-case expected regret
>   over $B_R$ after $n$ steps, for strategy $u$. Here $E_f^u$ averages over a (possibly random)
>   strategy applied to a **fixed** $f$ — not a prior average.
> - $a\wedge b := \min(a,b)$.

## The setting: RKHS, not "draws from the prior"

The convergence question only makes sense relative to a class of target functions. `bull2011`
takes the **RKHS** $\mathcal H_\theta(X)$ of the fixed kernel $K_\theta$ — the "native space" of
functions as smooth as a GP posterior mean — and asks for rates **uniform over an RKHS ball**
$B_R$. This is a *worst-case* (minimax) guarantee on deterministic functions, strictly stronger
and more honest than the Bayesian "average over $f\sim\pi$" guarantee, which can hide pathological
targets inside a null set.

The single fact the analysis needs is the smoothness–dimension correspondence. For a kernel of
smoothness $\nu<\infty$ (the [[notation|Matérn]] smoothness parameter $\nu$; $\nu=\infty$ is the
Gaussian/RBF kernel) on a Lipschitz domain in $\mathbb R^d$,

$$
\mathcal H_\theta(X)\ \simeq\ H^{\nu+d/2}(X)\qquad\text{(Sobolev space of order }\nu+d/2),
$$

with equivalent norms (`bull2011` Lemma 3). So "$f$ in the RKHS" means "$f$ has $\sim\nu$ extra
derivatives beyond half the dimension." The minimax rate for recovering such functions is
classical, and it is what bounds EI from below.

## The minimax floor

No strategy — however clever, however much it adapts to data — can beat a fixed rate determined
by $\nu$ and $d$ alone.

> **Theorem 1 (minimax rate, `bull2011`).** For $\nu<\infty$, any $\theta$, any $R>0$,
> $$
> \inf_u\, L_n(u,R) = \Theta\!\big(n^{-\nu/d}\big),
> $$
> and the rate is attained by a strategy that does **not** know $R$.

The lower bound is an indistinguishability ("fooling") argument. Pack $2n$ disjoint bump
functions $\psi_m$ of height $\sim(2k)^{-\nu}$ into $X$ (with $n\sim(2k)^d/2$, so the bumps tile a
$d$-dimensional grid). Any $n$ observations touch at most $n$ of the $2n$ bumps, so some
$\psi_m$ is **identically zero on every point the algorithm has seen** — its data are
indistinguishable from the flat function $f\equiv0$. The algorithm therefore cannot locate that
bump's optimum, incurring regret $\Omega((2k)^{-\nu})=\Omega(n^{-\nu/d})$. The bump height
$(2k)^{-\nu}$ is exactly what keeps $\|\psi_m\|_{\mathcal H_\theta}\le R$ as the grid refines — the
RKHS norm penalizes sharp features, and that penalty *is* the $n^{-\nu/d}$ rate.

The matching upper bound is the **naive non-adaptive** strategy: ignore the data, place a
quasi-uniform grid with mesh $h_n=O(n^{-1/d})$, fit a radial-basis interpolant $\hat f_n$, and
report its optimizer. The regret is controlled by interpolation error,

$$
r_n \le 2\,\|\hat f_n-f\|_\infty = O(h_n^{\,\nu}) = O(n^{-\nu/d}),
$$

the first inequality being a two-sided sandwich of $f$ by $\hat f_n$ at the reported point and
at $x^*$. This naive optimum is the benchmark EI must approach — and the source of `bull2011`'s
wry caveat: a "sophisticated" method that loses to grid-fill-and-interpolate is at fault, yet
worst-case rates flatter the naive method precisely because the worst case is adversarial, not
average. Rates are a necessary, not sufficient, account of a global optimizer's quality.

## EI's rate, and why it converges

The central result. With a **fixed** prior (fixed $\eta$, i.e. fixed $\sigma$ and $\theta$):

> **Theorem 2 (`bull2011`).** For $\mathrm{EI}$ with a fixed prior, any $R>0$,
> $$
> L_n\big(\mathrm{EI}(\pi),R\big)=
> \begin{cases}
> O\!\big(n^{-\nu/d}(\log n)^{\alpha}\big), & \nu\le 1,\\[2pt]
> O\!\big(n^{-1/d}\big), & \nu>1.
> \end{cases}
> $$

Compactly, $L_n=O^*\big(n^{-(\nu\wedge1)/d}\big)$ ($O^*$ absorbs log factors; $\alpha\ge0$ is a
kernel-dependent log exponent, $0$ for most kernels). **Near-minimax for $\nu\le1$** (matches
Theorem 1's $n^{-\nu/d}$ up to logs); for $\nu>1$ the exponent saturates at $1/d$ and EI no
longer keeps pace with the floor — §"Near-optimal rates" repairs this.

### The derivation spine

Two opposing bounds, sandwiching EI, drive the whole proof. Fix the target $f$ with
$\|f\|_{\mathcal H_\theta}\le R$. Write $\sigma$ for the kernel scale and $s=s_n(x)=\sigma_n(x)/\sigma$
for the *unit-scale* posterior standard deviation (so the full posterior std is $\sigma_n=\sigma\,s$;
`bull2011` works at unit scale, matching the crosswalk below), and $I=[f(x)-f^*_n]^+$ for the *realized* improvement of the true
$f$ at $x$ over the current incumbent. Recall the canonical $\tau(z):=z\,\Phi(z)+\varphi(z)$, so
that the EI closed form ([[expected-improvement]]) reads $\mathrm{EI}_n(x)=\sigma\,s\,\tau(u/\sigma)$
for an appropriate argument $u$.

**(1) EI lower bound — far from optimum, EI is large.** Because the RKHS norm controls
prediction error, $|\,\mu_n(x)-f(x)\,|\le R\,s$ (`bull2011` Lemma 6, Cauchy–Schwarz in the
RKHS). Pushing this through the monotone $\tau$ gives the sandwich (Lemma 8, in canonical signs):

$$
\frac{\tau(-R/\sigma)}{\tau(R/\sigma)}\,I\ \le\ \mathrm{EI}_n(x)\ \le\ I+(R+\sigma)\,s .
$$

The **left** inequality is the engine: EI is bounded *below* by a fixed fraction of the true
improvement $I$. So if the true $f$ still has a point worth $I$ above the incumbent — i.e. the
incumbent regret is large — then $\mathrm{EI}_n(x^*)$ is large there, and EI's maximizer earns at
least as much.

**(2) Posterior variance collapses — exploration is self-limiting.** Cover $X$ by $k$ balls of
radius $O(k^{-1/d})$. Once a ball contains a past design point, every later point in that ball
has small posterior variance, $s_n^2\lesssim k^{-2(\nu\wedge1)/d}(\log k)^{2\beta}$ (Lemma 7,
from the kernel's local Hölder behavior). Since there are only $k$ balls, the variance at the
*next* sampled point can exceed $C\,k^{-(\nu\wedge1)/d}(\log k)^\beta$ for **at most $k$ steps**.
EI cannot keep exploring forever; uncertainty is a depleting resource.

**(3) Improvement is summable — exploitation is self-limiting.** The incumbent's true value
$f^*_n$ is non-decreasing and bounded by $f^*$, so the total realized gain telescopes:
$\sum_n (f^*_{n+1}-f^*_n)\le f^*-f^*_1\le 2R$. Hence the per-step gain
$f(x_{n+1})-f^*_n$ exceeds $2R/k$ for **at most $k$ steps**.

**(4) Combine.** Among any window of $\sim3k$ steps, (2)+(3) force a "good" time $n_k$ where
*both* $s_{n_k}(x_{n_k+1})\le C\,k^{-(\nu\wedge1)/d}(\log k)^\beta$ *and* the realized gain is
$\le 2R/k$. At such a step the upper bound in (1) makes $\mathrm{EI}_{n_k}(x_{n_k+1})$ small. But
EI *maximizes*, so $\mathrm{EI}_{n_k}(x^*)\le \mathrm{EI}_{n_k}(x_{n_k+1})$ is small too; and the
lower bound in (1) at $x^*$ says EI there is a fixed fraction of the *current regret* $r_{n_k}$.
Chaining,

$$
r_{n}\ \le\ r_{n_k}\ \le\ \frac{\tau(R/\sigma)}{\tau(-R/\sigma)}\,\mathrm{EI}_{n_k}(x^*)
\ \le\ \frac{\tau(R/\sigma)}{\tau(-R/\sigma)}
\Big(\tfrac{2R}{k}+C(R+\sigma)\,k^{-(\nu\wedge1)/d}(\log k)^\beta\Big),
$$

uniformly over $B_R$. With $k\asymp n$ the second term dominates (for $\nu\le1$), yielding
$L_n=O^*(n^{-(\nu\wedge1)/d})$. $\;\blacksquare$

The one-line moral: **the upper bound on EI is small only when exploration has saturated, and at
that moment the lower bound forces the incumbent regret to be small** — the explore/exploit
trade-off of [[expected-improvement]] turned into a convergence proof.

### The constant — and where it bites

The dominant term carries a constant proportional to (canonical signs)

$$
(R+\sigma)\,\frac{\tau(R/\sigma)}{\tau(-R/\sigma)} ,
$$

a ratio of the kernel scale $\sigma$ to the function's true RKHS magnitude $R$. It is harmless
when $\sigma\asymp R$ but **blows up exponentially when $\sigma\ll R$** — the model is far more
confident than the function warrants, EI stops exploring, and convergence stalls. This single
expression is the hinge for the hyperparameter results below.

## Near-optimal rates for smoother kernels

For $\nu>1$ Theorem 2 stalls at $n^{-1/d}$ because nothing forces EI's design points to stay
*quasi-uniform* (which Gaussian-interpolation rates require). The fix is a textbook
$\epsilon$-greedy overlay: at each step, with probability $1-\epsilon$ run EI, with probability
$\epsilon$ sample uniformly at random from $X$.

> **Theorem 5 (`bull2011`).** For $0<\epsilon<1$ and any finite $\nu$ (or $\nu=\infty$, holding
> for all finite $\nu$),
> $$
> L_n\big(\mathrm{EI}(\cdot,\epsilon),R\big)=O\!\big((n/\log n)^{-\nu/d}(\log n)^{\alpha}\big),
> $$
> the **minimax rate up to logs**.

The random draws guarantee asymptotic mesh-fill, restoring the interpolation rate that pure EI
could not certify. Notably $\epsilon$ is used only to *upgrade the worst-case rate* — EI is
already globally convergent without it (Vazquez–Bect; `bull2011` Theorem 2). And $\epsilon=1$
(pure random search) does **not** achieve the rate: optimal global optimization needs inference
about $f$ *and* a guaranteed-exploration floor, neither alone.

## Remark — estimated hyperparameters can destroy convergence

Everything above conditions on a **fixed** prior. In practice $\eta=(\sigma,\theta)$ is fit from
data — usually by maximum likelihood (`jones98`; see [[gp-hyperparameters]]). `bull2011` shows
this can be fatal.

> **Theorem 3 (`bull2011`).** With ML-estimated parameters $\mathrm{EI}(\hat\Pi)$, for any
> $\theta,R,\epsilon$ there is an $f\in B_R$ on which, with probability $>1-\epsilon$, the regret
> never drops below a fixed $\delta>0$. EI **never finds the optimum.**

The mechanism is exactly the runaway constant above. The ML scale estimate satisfies
$\hat\sigma_n^2=\hat R_n^2(\theta)/n$ with $\hat R_n\le\|f\|_{\mathcal H_\theta}$ bounded, so
$\hat\sigma_n\to0$ and $R/\hat\sigma_n\gtrsim n^{1/2}\to\infty$: the constant
$\tau(R/\hat\sigma_n)/\tau(-R/\hat\sigma_n)$ grows *exponentially in $n$*. EI becomes
pathologically over-confident, refuses to explore an unobserved region $W$, and a competitor
function $g$ identical to $f$ outside $W$ but with its true optimum hidden inside $W$ is
indistinguishable from $f$ — so EI misses $g$'s optimum with high probability. The counterexamples
are smooth and benign-looking (`bull2011` Fig. 1), yet *atypical as GP draws* — a reminder that
RKHS membership and prior-typicality are different things.

`bull2011`'s repair (Theorem 4): replace the shrinking ML estimate with a non-vanishing scale,
$\hat\sigma_n^2=\hat R_n^2(\hat\theta_n)$ (no $1/n$), keeping $\theta$ bounded in
$[\theta^L,\theta^U]$ and forcing exploration when all observations tie. This robust estimator
recovers the fixed-prior rate of Theorem 2, now in probability ($O_p$) rather than in
worst-case expectation — the price of not knowing $\|f\|_{\mathcal H_\theta}$ in advance. The
take-away for practice: **EI's theoretical guarantees live or die by how the kernel scale is set;
the standard "$\hat\sigma^2=\mathrm{RSS}/n$" choice is the dangerous one.**

## Relation / interpretation

- **This is the convergence theory for [[expected-improvement]].** EI's $(\Delta_n,\sigma_n)$
  explore/exploit balance is precisely what the proof spine converts into a rate: variance
  collapse (exploration saturates) plus telescoping improvement (exploitation saturates) pin a
  step where regret must be small.
- **Simple vs. cumulative regret — name the distinction.** `bull2011` studies *simple* regret
  $r_n=f^*-f^*_n$ (quality of the single reported point) on **noiseless** data. The GP-bandit
  line ([[regret-gp-bandits]], [[gp-ucb]], `srinivas2010`) instead bounds **cumulative** regret
  $R_N=\sum_n r_n$ under **noise**, via the maximum information gain $\gamma_T$. These are
  different objects: since $\min_{n\le N} r_n\le R_N/N$, a cumulative bound $R_N=O(g(N))$ yields
  simple regret $r_N=O(g(N)/N)$ ([[problem-setup]]), but cumulative regret is necessarily increasing, so it can certify
  optimization no faster than $n^{-1}$ — whereas the simple-regret rates here are $n^{-\nu/d}$,
  faster for small $d$. Different criterion, different machinery (RKHS interpolation /
  fooling-bumps here, vs. $\gamma_T$ and confidence intervals for bandits).
- **Fixed-$\eta$ assumption ↔ [[gp-hyperparameters]].** Theorems 1, 2, 5 condition on a fixed
  prior; Theorem 3 is exactly the warning that note carries — extending the guarantees to the
  fully-Bayesian / integrated acquisition is open.
- **Myopia is not fatal.** EI is only one-step Bayes-optimal ([[expected-improvement]],
  [[bo-as-dynamic-program]]), yet still converges near-minimax: short-horizon greed plus the
  RKHS geometry suffices, no multi-step look-ahead required.

## Crosswalk

`bull2011` minimizes; we maximize. Map his loss/objects to the canonical table:

| This note (canonical, maximize) | `bull2011` (minimize) | Note |
|---|---|---|
| $f^*=\max f$, maximizer $x^*$ | $\min f$, minimizer | global sign flip |
| $f^*_n=\max_{m\le n}f(x_m)$ (incumbent) | $z_n^*=\min_{i\le n}z_i$ (best obs.) | "best" flips max↔min |
| $r_n=f^*-f^*_n$ (simple regret / loss) | $f(x_n^*)-\min f$ | identical magnitude |
| $L_n(u,R)=\sup_{B_R}E_f^u[r_n]$ | $L_n(u,\mathcal H_\theta(X),R)$ | worst-case over RKHS ball |
| $\sigma_n(x)$ (posterior std) | $s_n(x;\theta)$ (× scale $\sigma$) | his $s_n$ is the *normalized* std; $\sigma s_n$ is the full posterior std |
| $\eta=(\sigma,\theta)$ | global scale $\sigma$, length-scales $\theta$ | $\theta\leftrightarrow\ell_{1:d}$ |
| $\nu$ (Matérn smoothness) | $\nu$ (+ log exponent $\alpha$) | same; $\mathcal H_\theta\simeq H^{\nu+d/2}$ |
| $\tau(z)=z\Phi(z)+\varphi(z)$ | $\tau(z)=z\Phi(z)+\phi(z)$ | EI written $\sigma s\,\tau(\cdot)$; $\varphi=\phi$ |
| $a\wedge b=\min(a,b)$ | $\wedge$ | rate exponent $(\nu\wedge1)/d$ |
| $\mathrm{EI}_n(x)$ | $EI_n(x;\pi)$ | his $\pi$ = fixed GP prior = our fixed $\eta$ |

> **Remark — `bull2011`'s $s_n$ vs. our $\sigma_n$.** `bull2011` factors the posterior variance
> as $\sigma^2 s_n^2(x;\theta)$, with $\sigma$ the global kernel scale and $s_n$ a *unit-scale*
> conditional std (his eq. 6). The canonical $\sigma_n(x)$ ([[notation]]) is the full posterior
> std, $\sigma_n=\sigma\,s_n$. The convergence constant's $\sigma$ is the kernel scale, not the
> posterior std — the distinction is what makes the ML-shrinkage failure (Theorem 3) precise.
