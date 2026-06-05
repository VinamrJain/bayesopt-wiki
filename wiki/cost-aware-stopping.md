---
title: Cost-Aware Stopping (PBGI / LogEIPC)
slug: cost-aware-stopping
tags: [cost-aware, acquisition, stopping, decision-theoretic]
requires: [cost-aware-bo, pandoras-box-gittins-index, ei-per-unit-cost, expected-improvement]
sources: [xie2025, xie2024, astudillo2021]
---

# Cost-Aware Stopping (PBGI / LogEIPC)

The budget-constrained family ([[budget-constrained-dp]], [[nonmyopic-cost-constrained-bo]]) answers
*where* to evaluate under a fixed budget. The **cost-per-sample** view of [[cost-aware-bo]] instead
prices each evaluation against the regret it removes and lets the horizon be an adaptive **stopping
time** $T$ — raising the question the budget view suppresses: *when to stop*. `xie2025` answers it
with a single rule shared by two acquisitions from `xie2024` — the
[[pandoras-box-gittins-index|Pandora's-Box Gittins Index (PBGI)]] and **log expected improvement per
cost (LogEIPC)** — and proves the pairing achieves cost-adjusted regret **no worse than never
starting**. This note owns the **stopping rule** and its regret guarantee; the
[[pandoras-box-gittins-index|PBGI]] note owns the acquisition. Symbols follow [[notation]].

> **Notation delta.**
> - $T$ — adaptive stopping time (the cost-per-sample horizon, [[notation]]); $f^*_t=\max_{m\le t}y_m$
>   the incumbent.
> - $\mathrm{EI}(x;g)=E\big[(f(x)-g)^+\mid\mathcal D_t\big]$ — expected improvement of $f$ above an
>   **arbitrary threshold** $g$ (the standard $\mathrm{EI}_t$ is $g=f^*_t$); strictly *decreasing*
>   in $g$.
> - $\alpha^{\mathrm{PBGI}}_t(x),\ \alpha^{\mathrm{LogEIPC}}_t(x)$ — the two acquisitions, below.
> - $\mathcal R_c$ — expected **cost-adjusted simple regret** ([[cost-aware-bo]]).
> - $\lambda$ — cost-scaling factor (objective-to-cost conversion rate).

## The two acquisitions (recap)

The stopping rule pairs with two cost-aware acquisitions, both from `xie2024`; their derivations
live elsewhere — only their *definitions* are needed here.

- **PBGI** — the [[pandoras-box-gittins-index|Pandora's-Box Gittins index]], the **fair value**
  $\alpha^{\mathrm{PBGI}}_t(x)=g$ solving $\mathrm{EI}(x;g)=c(x)$ (with $\mathrm{EI}(x;g)$ strictly
  decreasing in $g$): the break-even objective level at which paying $c(x)$ to evaluate $x$ just
  balances its expected improvement. Sampling maximizes it; $\alpha^{\mathrm{PBGI}}_t(x)=f(x)$ at
  evaluated points. (Pandora's-Box origin, Gittins optimality, and the spatial-DP reading are in
  that note.)
- **LogEIPC** —
  $\alpha^{\mathrm{LogEIPC}}_t(x)=\log\frac{\mathrm{EI}(x;f^*_t)}{c(x)}=\log\mathrm{EI}_t(x)-\log c(x)$,
  the log-domain [[ei-per-unit-cost|EIpu]] (numerically stable, after Ament et al. 2023). As an
  acquisition it ranks exactly as EIpu; here its log form makes the stop threshold a clean $0$.

PBGI (a *threshold*, from Gittins theory) and LogEIPC (a *ratio*, from dividing EI by cost) come from
genuinely different places — yet `xie2025`'s key observation is that they imply the **same** stop
condition.

## The PBGI / LogEIPC stopping rule

**From Pandora's box.** The Gittins policy is Bayesian-optimal only when *bundled* with a stopping
rule — stop when the best unevaluated fair value no longer beats the incumbent
([[pandoras-box-gittins-index]]). In the correlated GP setting (`xie2024`), recompute
$\alpha^{\mathrm{PBGI}}_t$ from the posterior each step and stop when

$$
\max_{x\ \text{unevaluated}}\alpha^{\mathrm{PBGI}}_t(x)\le f^*_t.
$$

A subtlety `xie2025` settles: use the *post*-posterior-update index $\alpha_t$ (not $\alpha_{t-1}$),
which better matches the fair-value intuition and gives empirical gains — stop when the best fair
value is already among the **evaluated** points.

**Three equivalent forms.** Lift the inequality through EI. Since $\mathrm{EI}(x;g)$ is decreasing
in $g$, $\alpha^{\mathrm{PBGI}}_t(x)\le f^*_t\iff\mathrm{EI}(x;f^*_t)\le c(x)$. So the PBGI stop is
identical to

$$
\boxed{\ \mathrm{EI}_t(x)\le c(x)\quad\forall\,x\ \text{unevaluated}\ }
\qquad\Longleftrightarrow\qquad
\max_{x\ \text{unevaluated}}\alpha^{\mathrm{LogEIPC}}_t(x)\le 0,
$$

the last by taking logs of $\mathrm{EI}_t(x)/c(x)\le1$. In words — identical across all three forms —
**stop when no point's expected improvement is worth its evaluation cost** (`xie2025`, §4). When
cost is uniform, $c\equiv c_0$, this collapses to the familiar EI-thresholding stop
$\max_x\mathrm{EI}_t(x)\le c_0$. The rule is naturally **more conservative when cost is high**:
larger $c(x)$ raises the bar an evaluation must clear, so it stops earlier.

This is the cost-per-sample counterpart of the EIpu comparison: where [[ei-per-unit-cost|EIpu]]
*ranks* by EI-vs-cost, this rule uses EI-vs-cost as the *termination* test.

## The guarantee: no worse than immediate stopping

The reason to pair *this* stopping rule with *these* acquisitions is a regret bound — the first of
its kind for cost-adjusted simple regret in correlated BO (`xie2025`, §4.1).

**Lemma (EI exceeds cost before stopping).** Running PBGI or LogEIPC with the rule above, every
selected point clears its own cost: $\mathrm{EI}_t(x_{t+1})\ge c(x_{t+1})$ for all $t<T$. (Immediate
from the stop condition: while we keep going, *some* point has EI $\ge$ cost, and we pick the best.)

**Theorem (no worse than immediate stopping).** Let $U:=E[\max_{x}f(x)]-\mu(x_1)$ be the prior
expected improvement potential and $C:=c(x_1)$ the first evaluation's cost. Then the expected
cost-adjusted simple regret obeys

$$
\mathcal R_c=E\Big[f^*-\!\max_{1\le t\le T}f(x_t)+\!\sum_{t=1}^{T}c(x_t)\Big]
\ \le\ \underbrace{E\big[f^*-f(x_1)+c(x_1)\big]}_{\text{cost-adjusted regret of stopping immediately}}=U+C.
$$

That is, planning-plus-stopping is **never worse in expectation than evaluating once and quitting** —
a guarantee many acquisition/stopping pairs fail in practice, because most stopping rules target
simple regret alone and ignore cost. The bound is **tight**: when costs are large relative to the
achievable improvement, stopping immediately *is* optimal.

**Corollaries.** The same argument bounds total spend, $E[\sum_{t=1}^{T}c(x_t)]\le U+C$, and gives
**finite-time termination**: if costs are bounded below, $c(x)\ge c_0>0$, then for any
$\delta\in(0,1)$ the algorithm stops within $(U+C)/(\delta c_0)$ steps with probability $1-\delta$.
Positive minimum cost guarantees you cannot evaluate forever.

## Using it under a budget, and in practice

**Budget compliance via cost scaling.** The rule extends to an **expected budget**
$E[\sum c(x_t)]\le B$ ([[budget-constrained-dp]]) by rescaling costs by $\lambda$. PBGI's
budget-equivalence ([[pandoras-box-gittins-index]]; `xie2024`, Thm 2) guarantees *some* optimal
$\lambda$ exists, but only implicitly; `xie2025`'s spend bound $U+C$ makes it **explicit** —
$\lambda=U/(B-C)$ (for $B>C$) keeps the *unscaled* expected spend within $B$. If that under-spends,
pair with the decaying-$\lambda$ **PBGI-D** variant, initialized at $\lambda_0=U/(B-C)$ (`xie2025`).
In the cost-per-sample setting, by contrast, $\lambda$ is a *given* unit-conversion constant
(seconds-to-accuracy), not tuned.

**Unknown / stochastic cost.** When $c$ is modeled as a GP on $\log c$ ([[cost-models]], following
`astudillo2021`), the guarantees survive by replacing $c(x)$ with $E[c(x)]=\exp(\mu_{\log
c}(x)+\tfrac12\sigma_{\log c}^2(x))$ — the log-normal mean — everywhere in the acquisitions and stop
test.

**Spurious stops.** Like all adaptive rules it can trip early from (i) GP-hyperparameter churn while
data is scarce — handled by a **stabilization period** of a few forced evaluations — and (ii)
imperfect acquisition optimization in high dimensions — handled by **smoothing** the stop signal
over a moving window before letting it fire (`xie2025`, §4.2).

## Relation to other notes

- **[[pandoras-box-gittins-index]].** Owns the PBGI acquisition and its Pandora's-Box / Gittins
  optimality; this note completes the policy with the **stopping rule** that makes it optimal, and
  adds the cost-adjusted-regret guarantee.
- **[[cost-aware-bo]].** The cost-per-sample / cost-adjusted-regret branch of the hub; the stopping
  time $T$ here is the hub's $T$, distinct from the hard budget $\tau$ ([[notation]]).
- **[[ei-per-unit-cost]].** LogEIPC *is* EIpu in the log domain (same $\arg\max$); this note is where
  the EI-vs-cost comparison becomes a *stop test* rather than a ranking.
- **[[expected-improvement]].** Both the fair-value equation $\mathrm{EI}(x;g)=c(x)$ and the stop
  test reuse EI with a *variable* baseline $g$ (vs. EI's fixed incumbent).
- **[[budget-constrained-dp]] / [[multistep-budgeted-bo]] / [[nonmyopic-cost-constrained-bo]].** The
  budget-constrained siblings; the cost-scaling $\lambda=U/(B-C)$ is the bridge that lets this
  cost-per-sample method honor an expected budget too.
- **[[cost-models]].** Supplies the $\log c$ GP and the log-normal mean used when cost is unknown.

## Origin and crosswalk

PBGI, LogEIPC, the Pandora's-box connection, the budget-equivalence $\lambda$ (Thm 2) and PBGI-D all
originate with `xie2024`; `xie2025` contributes the **unified stopping rule**, the EI-exceeds-cost
lemma, and the cost-adjusted-regret guarantee. Conveniently `xie2024` already works in the wiki's
**maximization** convention, so its PBGI definition transfers verbatim; `xie2025` **minimizes**
($\mathcal R=\min_t f(x_t)-\inf f$), and the table below maps the latter.

| This note (canonical, maximize) | `xie2025` (minimize) | Note |
|---|---|---|
| incumbent $f^*_t=\max_{m\le t}y_m$ | $y^*_{1:t}=\min_{s\le t}y_s$ | sign flip |
| $\mathrm{EI}(x;g)=E[(f(x)-g)^+]$, decreasing in $g$ | $\mathrm{EI}_\psi(x;y)=E[(y-\psi(x))^+]$, increasing in $y$ | improvement above vs. below threshold |
| PBGI stop: $\max_x\alpha^{\mathrm{PBGI}}_t(x)\le f^*_t$ | $\min_x\alpha^{\mathrm{PBGI}}_t(x)\ge y^*_{1:t}$ | max/min mirror |
| $\mathrm{EI}_t(x)\le c(x)\ \forall x$ | $\mathrm{EI}_{f}(x;y^*)\le c(x)$ | identical stop test |
| $\max_x\alpha^{\mathrm{LogEIPC}}_t\le0$ | same | log of EI/c $\le1$ |
| $U=E[\max_x f]-\mu(x_1)$, $C=c(x_1)$ | $U=\mu(x_1)-E[\min_x f]$, $C=c(x_1)$ | improvement potential; sign-flipped |
| budget scaling $\lambda=U/(B-C)$ | same | for expected-budget compliance |
| stopping time $T$ | $\tau$ (their symbol) | renamed to avoid clash with budget $\tau$ ([[notation]]) |
