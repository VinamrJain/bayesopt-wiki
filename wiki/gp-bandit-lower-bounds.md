---
title: Lower Bounds for GP Bandit Optimization
slug: gp-bandit-lower-bounds
summary: "Algorithm-independent Ω-lower bounds on simple and cumulative regret for noisy RKHS bandits, the converse to GP-UCB's upper bounds."
tags: [theory, regret, lower-bounds]
subtopic: foundations
requires: [regret-gp-bandits, gp-ucb, problem-setup]
sources: [scarlett2017]
grade: derivation
reviewed: null
---

# Lower Bounds for GP Bandit Optimization

The regret guarantees of [[gp-ucb]] are **upper** bounds: GP-UCB *achieves* regret
$\mathcal O^*(\sqrt{T\gamma_T\beta_T})$. They say nothing about whether a cleverer algorithm
could do fundamentally better. This note is the **converse** (`scarlett2017`): an
**algorithm-independent lower bound** showing that *no* method, however designed, can beat a
certain rate on the worst function in a smoothness class. Pairing the two — the upper bound of
[[regret-gp-bandits]] against the matching lower bound here — pins down the order of the optimal
regret, near-tightly for the squared-exponential (SE) kernel and with a remaining gap for the
Matérn kernel. Symbols follow [[notation]].

> **Notation delta.** $\|f\|_k\le B$ — the RKHS norm bound defining the **non-Bayesian**
> (agnostic) function class $\mathcal F_k(B)$ ($f$ fixed but unknown, merely smooth), versus the
> Bayesian draw $f\sim\mathcal{GP}$. $r^{(T)}=f(x^*)-f(x^{(T)})$ — **simple regret** of a final
> reported point $x^{(T)}$, distinct from the per-round $r_t$ of $R_T$ in [[gp-ucb]]. $\epsilon$
> here is a target simple regret, *not* the GP noise $\varepsilon_n$ of [[notation]]; the noise
> standard deviation is written $\sigma$ ($z_t\sim\mathrm{Normal}(0,\sigma^2)$, so $\lambda=\sigma^2$).

## Setting: the non-Bayesian (RKHS) model

`scarlett2017` works in the **agnostic** GP-bandit model: $f$ on $D=[0,1]^d$ is fixed and
unknown, assumed only to have bounded norm $\|f\|_k\le B$ in the RKHS of a kernel $k$ — the class
$\mathcal F_k(B)$. This is the same RKHS regime in which [[gp-ucb]]'s Theorem 3 lives (the
"agnostic" $\beta_t=2B+300\gamma_t\log^3(t/\delta)$ schedule), as opposed to the Bayesian
$f\sim\mathcal{GP}$ prior. At round $t$ one selects $x_t$ and sees $y_t=f(x_t)+z_t$,
$z_t\sim\mathrm{Normal}(0,\sigma^2)$ i.i.d. Two performance metrics:

- **Simple regret** $r^{(T)}=f(x^*)-f(x^{(T)})$, the suboptimality of a single point reported
  *after* $T$ rounds. The question: how large must $T$ be to guarantee $E[r^{(T)}]\le\epsilon$?
- **Cumulative regret** $R_T=\sum_{t=1}^T r_t$, $r_t=f(x^*)-f(x_t)$ — exactly [[gp-ucb]]'s $R_T$.

Both kernels are isotropic with length-scale $l$:

$$
% K_\nu below is the modified Bessel function of the second kind
k_{\mathrm{SE}}(x,x')=\exp\!\Big(-\frac{\|x-x'\|^2}{2l^2}\Big),\qquad
k_{\mathrm{Mat}}(x,x')=\frac{2^{1-\nu}}{\Gamma(\nu)}
\Big(\tfrac{\sqrt{2\nu}\,\|x-x'\|}{l}\Big)^{\nu} K_\nu\!\Big(\tfrac{\sqrt{2\nu}\,\|x-x'\|}{l}\Big),
$$

with $d,l,\nu$ all treated as $\Theta(1)$ while $B$ and $\sigma$ may scale. $\mathcal O^*$
suppresses dimension-independent log factors.

## The theorems

**Theorem (simple regret).** Fix $\epsilon\in(0,\tfrac12)$, $B>0$, $T\in\mathbb Z$. If some
algorithm achieves $E[r^{(T)}]\le\epsilon$ for *every* $f\in\mathcal F_k(B)$, then — provided
$\epsilon/B$ is small enough —

$$
\text{SE:}\quad T=\Omega\!\Big(\frac{\sigma^2}{\epsilon^2}\big(\log\tfrac{B}{\epsilon}\big)^{d/2}\Big),
\qquad
\text{Matérn:}\quad T=\Omega\!\Big(\frac{\sigma^2}{\epsilon^2}\big(\tfrac{B}{\epsilon}\big)^{d/\nu}\Big).
$$

**Theorem (cumulative regret).** Fix $B>0$, $T\in\mathbb Z$. For *any* algorithm, provided
$\sigma/B=O(\sqrt T)$ with a small enough implied constant,

$$
\text{SE:}\quad E[R_T]=\Omega\!\Big(\sqrt{T\sigma^2\big(\log\tfrac{B^2T}{\sigma^2}\big)^{d/2}}\Big),
\qquad
\text{Matérn:}\quad E[R_T]=\Omega\!\Big(B^{\frac{d}{2\nu+d}}\,\sigma^{\frac{2\nu}{2\nu+d}}\,
T^{\frac{\nu+d}{2\nu+d}}\Big).
$$

These bounds are on the **average** regret over a hard ensemble; a high-probability version
(constant probability arbitrarily close to one) follows by the same scaling (see *Remark* at the
end). The mild condition $\sigma/B=O(\sqrt T)$ is trivial when $\sigma,B$ are $\Theta(1)$.

## Proof spine

The whole argument is a single **needle-in-a-haystack hypothesis test**: build a finite family of
functions that any algorithm must *tell apart* to optimize, then show telling them apart is
information-theoretically hard under noise. Four steps.

**1 — A hard ensemble.** Take $f$ uniform over a finite set $\mathcal F'=\{f_1,\dots,f_M\}$. A
lower bound on the regret *averaged* over $m$ forces some individual $f_m$ to incur it, which
suffices since the class $\mathcal F_k(B)$ contains all $f_m$. Each $f_m$ is one bump $g$ —
amplitude $2\epsilon$, peak at the origin, value $<\epsilon$ once $\|x\|_\infty\ge w$ — shifted to
a distinct cell of a width-$w$ grid and cropped to $[0,1]^d$. The grid holds
$M=\lfloor(1/w)^d\rfloor$ functions, and the design guarantees the **separation property**: any
single $x$ is $\epsilon$-optimal for **at most one** $f_m$. So driving simple regret below
$\epsilon$ is *equivalent* to identifying the index $m$ — a hypothesis test over $M$ alternatives.

The bump is specified in frequency: $g$ is a scaled inverse Fourier transform of the smooth
compactly-supported "bump function"
$$
H(\xi)=\exp\!\Big(-\frac{1}{1-\|\xi\|^2}\Big)\ \text{for}\ \|\xi\|_2\le1,\quad 0\ \text{else}.
$$
Frequency-compactness (rather than spatial-compactness, as in the noiseless treatment `bull2011`)
is essential: a spatially-compact bump has **infinite** SE-RKHS norm, so it cannot live in
$\mathcal F_{k_{\mathrm{SE}}}(B)$. The price is that $g$ has unbounded spatial support, so samples
far from the peak are *small but nonzero* — handled by the summability lemma below.

**2 — How small can $w$ be?** Smaller $w$ packs in more functions (bigger $M$, harder test) but
makes $g$ less smooth (larger RKHS norm). Aronszajn's identity gives the RKHS norm via the
Fourier transforms of $f$ and $k$:
$$
\|\tilde f\|_{\mathcal H}^2=\int\frac{|\tilde F(\xi)|^2}{K(\xi)}\,d\xi,
$$
and cropping to $D$ never increases the norm. Plugging in $K_{\mathrm{SE}}$ and $K_{\mathrm{Mat}}$
and imposing $\|g\|_k\le B$ pins the largest admissible $w$, hence

$$
\text{SE:}\quad M=\Theta\!\Big(\big(\log\tfrac{B}{\epsilon}\big)^{d/2}\Big),\qquad
\text{Matérn:}\quad M=\Theta\!\Big(\big(\tfrac{B}{\epsilon}\big)^{d/\nu}\Big).
$$

These $M$ are exactly the kernel-by-kernel content of the theorems: every kernel-specific factor
in the final rates is just $M$ in disguise. As $\epsilon/B\to0$, $w\to0$ and $M\to\infty$.

**3 — Change of measure: distinguishing is hard.** Let $P_m(\mathbf y)$ be the law of the
observations $\mathbf y=(y_1,\dots,y_T)$ when $f=f_m$, and $P_0$ the law under $f\equiv0$. The
test's difficulty is controlled by the KL divergence $D(P_0\|P_m)$, via a hypothesis-testing lemma
(the Auer et al. hypothesis-testing lemma): for any statistic $a(\mathbf y)\in[0,A]$,
$$
E_m[a(\mathbf y)]\le E_0[a(\mathbf y)]+A\sqrt{D(P_0\|P_m)}
$$
(proof: bound the integral over $\{P_m\ge P_0\}$, then Pinsker turns total variation into $\sqrt
D$). The chain rule for divergence, plus the fact that each round's contribution depends on the
history only through the chosen cell $j_t$, yields
$$
D(P_0\|P_m)\le\sum_{j=1}^M E_0[N_j]\,\overline D_m^{\,j},
\qquad \overline D_m^{\,j}=\max_{x\in\mathcal R_j}D\big(P_0(\cdot\mid x)\,\|\,P_m(\cdot\mid x)\big),
$$
where $N_j$ counts visits to cell $\mathcal R_j$. For Gaussian observations with common variance
$\sigma^2$ and means differing by $v(x)$, the per-sample divergence is exactly
$D=\frac{v(x)^2}{2\sigma^2}$ — so the cost of separating $f_m$ from the null is paid in
$f_m$-value$^2/\sigma^2$ per sample. This is where the $\sigma^2/\epsilon^2$ factor enters.

**4 — From distinguishability to regret.** The needle ensemble has a key concentration property
(summability lemma): summing $\overline v_m^{\,j}=\max_{x\in\mathcal R_j}f_m(x)$ over cells is
$O(\epsilon)$ — $\sum_j\overline v_m^{\,j}=O(\epsilon)$, $\sum_m\overline v_m^{\,j}=O(\epsilon)$,
$\sum_m(\overline v_m^{\,j})^2=O(\epsilon^2)$ — because the frequency-bump decays faster than any
polynomial, so the total reward off the peak is dominated by the peak itself. Bounding the
expected reward $E[v^{(T)}]$ of the reported point through the lemma above gives
$$
E[v^{(T)}]\le C\,\epsilon\Big(\frac1M+\frac{\epsilon}{\sigma}\sqrt{\tfrac TM}\Big),
$$
and since the optimum is $f(x^*)=2\epsilon$,
$$
E[r^{(T)}]\ge\epsilon\Big(\tfrac32-\frac{C\epsilon}{\sigma}\sqrt{\tfrac TM}\Big).
$$
Hence $E[r^{(T)}]\ge\epsilon$ whenever $T\le\frac{M\sigma^2}{4C^2\epsilon^2}$. Substituting the two
values of $M$ from step 2 gives the simple-regret theorem.

**Cumulative regret** reuses steps 1–3 verbatim, replacing the single reported point with the
$T$-round visit counts ($a(\mathbf y)=N_j\in[0,T]$). The same algebra gives
$E[R_T]\ge T\epsilon(\tfrac32-\frac{C'\epsilon}{\sigma}\sqrt{T/M})$, so $E[R_T]\ge T\epsilon$
whenever $\epsilon\le\sqrt{M\sigma^2/(4C'^2T)}$. Here $\epsilon$ is **free** (it is not a target,
only a tuning knob): choosing it to saturate this constraint and solving the implicit equation
$M=M(\epsilon)$ for each kernel turns the bound $T\epsilon$ into the stated $\Omega(\cdot)$ in $T$.

## Relation / Interpretation

**The converse to [[regret-gp-bandits]].** [[gp-ucb]] *achieves* $R_T=\mathcal O^*(\sqrt{TB\gamma_T+T\gamma_T^2})$;
this note shows *no algorithm* can do better than the $\Omega(\cdot)$ rates above. The gap between
them is the kernel-by-kernel near-tightness statement:

| | Upper bound (GP-UCB, [[regret-gp-bandits]]) | Lower bound (this note) |
|---|---|---|
| SE, cumulative | $\mathcal O^*\!\big(\sqrt{T(\log T)^{2d}}\big)$ | $\Omega\!\big(\sqrt{T(\log T)^{d/2}}\big)$ |
| SE, time to simple regret $\epsilon$ | $\mathcal O^*\!\big(\tfrac1{\epsilon^2}(\log\tfrac1\epsilon)^{2d}\big)$ | $\Omega\!\big(\tfrac1{\epsilon^2}(\log\tfrac1\epsilon)^{d/2}\big)$ |
| Matérn, cumulative | $\mathcal O^*\!\big(T^{\frac12\cdot\frac{2\nu+3d(d+1)}{2\nu+d(d+1)}}\big)$ | $\Omega\!\big(T^{\frac{\nu+d}{2\nu+d}}\big)$ |
| Matérn, time to simple regret $\epsilon$ | $\mathcal O^*\!\big((\tfrac1\epsilon)^{\frac{2(2\nu+d(d+1))}{2\nu-d(d+1)}}\big)$ (needs $2\nu>d(d+1)$) | $\Omega\!\big((\tfrac1\epsilon)^{2+d/\nu}\big)$ |

For the **SE kernel the bounds match** up to the exponent on $\log$ ($2d$ above vs. $d/2$ below) —
both are $\sqrt T\cdot\text{polylog}$, so the rate in $T$ is essentially settled. For the
**Matérn kernel the gap is real**: the GP-UCB upper bound is sublinear only when
$2\nu>d(d+1)$, whereas the lower bound's exponent $\frac{\nu+d}{2\nu+d}<1$ for all $\nu,d$, so
sublinear regret *should* be possible everywhere — meaning the existing upper bound is likely
loose, not the lower bound. `scarlett2017` traces this to the $\gamma_T^2$ term in
$\sqrt{TB\gamma_T+T\gamma_T^2}$ and **conjectures** it can be removed to give $\mathcal
O^*(\sqrt{TB\gamma_T})$ (as holds in the Bayesian setting), which would make the upper bound
sublinear for all $\nu,d$ and bring it to $\mathcal O^*(T^{(\nu+d(d+1))/(2\nu+d(d+1))})$ — matching the
lower bound up to $d\mapsto d(d+1)$. This is an open problem.

**$\gamma_T$'s role on both sides.** On the upper side, $\gamma_T$ (max information gain,
[[notation]]) is what *enables* learning: GP-UCB's regret is small because $\gamma_T$ grows
slowly. On the lower side the same information budget *limits* learning: each noisy sample buys at
most $v(x)^2/2\sigma^2$ nats of discrimination between hypotheses, and the kernel's smoothness caps
how many distinguishable needles ($M$) can be packed into $\mathcal F_k(B)$. Both directions are
information-theoretic statements about the same kernel — the bridge [[gp-ucb]] draws between
optimization and experimental design, run forwards and backwards.

**Noisy vs. noiseless.** Noise is what makes the converse nontrivial. In the noiseless Bayesian
setting $O(1)$ cumulative regret is achievable (`scarlett2017` cites this); under noise the best
known rates sit between $O(\sqrt T)$ and $o(T)$. The needle construction is *adapted* to noise:
the $\sigma^2/\epsilon^2$ factor in every bound is exactly the per-sample divergence
$v^2/2\sigma^2$ inverted — the number of noisy looks needed to resolve an $\epsilon$-scale needle.

**Simple vs. cumulative.** The two share steps 1–3; they differ only in the final statistic
(reported point vs. visit counts). For simple regret $\epsilon$ is *given* by the problem; for
cumulative regret it is a *free parameter* optimized inside the proof — the one structural
difference between the two derivations.

## Crosswalk

`scarlett2017` minimizes regret to a maximum (we maximize $f$ throughout, [[notation]]); its
round index $t$ and our evaluation index $n$ coincide here since the analysis is over the full
$T$-round trajectory. The paper is in the IEEE/COLT version (Scarlett, Bogunovic & Cevher); the
construction follows the noiseless needle ensemble of Bull (`bull2011`), adapted to noise and to
frequency-compact bumps.

| This note (canonical, maximize) | `scarlett2017` | Note |
|---|---|---|
| $A=[0,1]^d$ (feasible set) | $D=[0,1]^d$ | same object; [[notation]] writes $A$ |
| $\lambda$ (noise variance) | $\sigma^2$, $z_t\sim N(0,\sigma^2)$ | $\sigma$ is noise s.d.; distinct from posterior $\sigma_n(x)$ |
| $\|f\|_k\le B$, class $\mathcal F_k(B)$ | identical | RKHS-norm-bounded agnostic class |
| $r^{(T)}=f(x^*)-f(x^{(T)})$ (simple) | identical | suboptimality of one reported point |
| $R_T=\sum_t(f(x^*)-f(x_t))$ (cumulative) | $R_T=\sum_t r_t$ | identical to [[gp-ucb]]'s $R_T$ |
| $\gamma_T$ (max info gain) | $\gamma_T=\max I(f;\mathbf y_S)$, $f\sim\mathcal{GP}(0,k)$ | same symbol; enters only the upper-bound comparison |
| $\epsilon$ (target / tuning simple regret) | $\epsilon$ | **not** the noise $\varepsilon_n$ of [[notation]] |
| $M,\ w,\ \mathcal R_j,\ N_j,\ \overline v_m^{\,j}$ | identical | ensemble size, grid width, cells, visit counts, in-cell max |
| $P_0$ (null, $f\equiv0$); $P_m$ ($f=f_m$) | identical | change-of-measure reference and alternatives |

## See also

- [[regret-gp-bandits]] — the matching **upper** bounds these converse results bound against.
- [[gp-ucb]] — the optimism principle and the $\gamma_T$ machinery shared by both directions.
- [[problem-setup]] — the noisy black-box optimization model.
