---
title: Budget-Constrained BO as a Dynamic Program
slug: budget-constrained-dp
tags: [cost-aware, non-myopic, lookahead, decision-theoretic, theory]
subtopic: cost-aware
requires: [bo-as-dynamic-program, cost-aware-bo, ei-per-unit-cost]
sources: [astudillo2021, lam2016, lee2021]
summary: "Cost-aware BO under a total-budget cap as a random-horizon dynamic program."
grade: derivation
reviewed: null
---

# Budget-Constrained BO as a Dynamic Program

[[cost-aware-bo|Cost-aware BO]] under a **budget constraint** — total evaluation cost capped,
not iteration count — is again a [[bo-as-dynamic-program|dynamic program]], but with one
structural change that breaks the myopic ratio rules: the budget is spent *stochastically*, so
the **horizon is random**. This note owns that formulation (`astudillo2021`, §3): it adds a cost
coordinate to the DP state, turns the finite horizon $N$ of [[bo-as-dynamic-program]] into a
random budget-depletion time $N_B$, and proves the payoff — [[expected-improvement|EI]] and
[[ei-per-unit-cost|EIpu]], the two standard rules, can be **arbitrarily far** from the optimal
non-myopic policy. The acquisition that approximately solves this DP is
[[multistep-budgeted-bo|budgeted multi-step EI]]; the finite-horizon constrained-MDP cousin is
[[nonmyopic-cost-constrained-bo]]. Symbols follow [[notation]].

> **Notation delta.**
> - $u(\mathcal D_n)=\max_{(x,y)\in\mathcal D_n}y$ — **terminal utility**: best objective value
>   observed (maximization; the incumbent $f^*_n$ of [[notation]] when observations are
>   noise-free). Encodes that *after* evaluation we report the best point regardless of its cost.
> - $s(\mathcal D_n)=\sum_{(x,y,z)\in\mathcal D_n}z$ — **total cost** spent, where $z=c(x)$ is the
>   cost observed alongside $y$. The budget constraint is $s(\mathcal D_n)\le B$.
> - $V^\pi(\mathcal D),\,V^*(\mathcal D)$ — value of policy $\pi$ / optimal value from state
>   $\mathcal D$ (the random-horizon analogue of $V^{\pi,n}/V^n$ in [[bo-as-dynamic-program]]).
> - $r(\mathcal D_{n-1},\mathcal D_n)=u(\mathcal D_n)-u(\mathcal D_{n-1})\ge 0$ — per-stage utility
>   increase (the telescoping stage reward).

## The state needs a cost coordinate

In [[bo-as-dynamic-program]] the state is the posterior $S^n$ (equivalently $\mathcal D_n$) and
the run has a *fixed* length $N$: every evaluation costs one unit, and after $N$ of them we stop.
Under a cost budget that bookkeeping fails. Evaluations cost different amounts $c(x)$, so what
determines whether we may continue is not how many points we have taken but how much budget
remains, $B-s(\mathcal D_n)$. The state must therefore carry the spent cost. Because
$\mathcal D_n$ now records the triple $(x_n,y_n,z_n)$ with $z_n=c(x_n)$ the **observed cost**, it
already contains $s(\mathcal D_n)=\sum_i z_i$ — the posterior-plus-spend is the sufficient
statistic, and no separate budget variable is needed (`astudillo2021`, §3.1).

Two consequences distinguish this DP from the fixed-budget one:

1. **The horizon is random.** Whether step $n+1$ is allowed depends on the *not-yet-observed*
   cost $z_{n+1}=c(x_{n+1})$. The run ends at the **budget-depletion time**
   $$
   N_B=\sup\{k:\ s(\mathcal D_k)\le B\},
   $$
   the last step for which the budget still holds. $N_B$ is a random stopping time, not a
   constant.
2. **Cost is itself uncertain.** $c$ is black-box like $f$ (modeled by a second GP on
   $\log c$, [[cost-models]]). So an evaluation reveals not only $f$-information but
   *cost*-information, and the planner can reason about that — e.g. probe a region of high cost
   *uncertainty* in the hope it is cheaper than feared, opening it up for later exploitation
   (`astudillo2021`, §3.1, item 2).

## The value function and Bellman optimality

Fix a state $\mathcal D$ with budget left, $s(\mathcal D)\le B$. A **policy**
$\pi=\{\pi_k\}$ maps observation sets to points, $x_k=\pi_k(\mathcal D_{k-1})$. Its value is the
expected gain in terminal utility accumulated until the budget runs out:

$$
V^\pi(\mathcal D)=E^\pi\!\big[\,u(\mathcal D_{N_B})-u(\mathcal D_0)\,\big|\,\mathcal D_0=\mathcal D\,\big],
\qquad
V^\pi(\mathcal D)=0\ \text{ if } s(\mathcal D)>B,
$$

the expectation over the random observation/cost sequence $\mathcal D_1,\dots,\mathcal D_{N_B}$
the policy generates. We seek

$$
\boxed{\ V^*(\mathcal D)=\sup_{\pi\in\Pi}V^\pi(\mathcal D)\ }
$$

(`astudillo2021`, eq. 1). This is the budget-constrained optimum: the most expected improvement
any non-anticipating strategy can extract from the remaining budget.

**It is a stochastic shortest-path problem, not a finite-horizon DP.** Because $N_B$ is random,
$V^*$ is *not* the $N$-stage recursion of [[bo-as-dynamic-program]] nor a discounted
infinite-horizon DP; it is a **stochastic shortest path** (`astudillo2021`, citing Bertsekas),
where "termination" is reaching a budget-exhausted state. The formulation is well-posed exactly
when termination is guaranteed, $N_B<\infty$ almost surely. This holds under the natural cost
model: if $\log c$ is a GP with continuous sample paths on the compact domain $A$, then
$\inf_{x\in A}c(x)>0$ a.s., so $N_B\le B/\inf_x c(x)<\infty$ — every evaluation costs at least
some positive minimum, and a finite budget buys only finitely many (`astudillo2021`, §3.1).

### Telescoping to a stage-reward DP

The same identity that linked [[bo-as-dynamic-program|the terminal-utility DP]] to expected
improvement applies here. With the stage reward $r(\mathcal D_{n-1},\mathcal D_n)=u(\mathcal
D_n)-u(\mathcal D_{n-1})\ge 0$, the terminal gain telescopes,
$u(\mathcal D_{N_B})-u(\mathcal D_0)=\sum_{n=1}^{N_B}r(\mathcal D_{n-1},\mathcal D_n)$, so

$$
V^*(\mathcal D)=\sup_{\pi\in\Pi}E^\pi\!\Big[\textstyle\sum_{n=1}^{\infty}
r(\mathcal D_{n-1},\mathcal D_n)\,\mathbf 1\{n\le N_B\}\,\Big|\,\mathcal D_0=\mathcal D\Big]
$$

(`astudillo2021`, eq. 4) — the indicator $\mathbf 1\{n\le N_B\}=\mathbf 1\{s(\mathcal D_n)\le B\}$
is the only new ingredient versus the homogeneous-cost stage-reward DP: it **truncates the reward
stream at the random budget-depletion time**. Restricting the sum to $N$ terms gives the
*truncated* value
$$
V_N(\mathcal D)=\sup_{\pi\in\Pi}E^\pi\!\Big[\textstyle\sum_{n=1}^{N}
r(\mathcal D_{n-1},\mathcal D_n)\,\mathbf 1\{n\le N_B\}\,\Big|\,\mathcal D_0=\mathcal D\Big],
$$
which converges up to the optimum, $\lim_{N\to\infty}V_N(\mathcal D)=V^*(\mathcal D)$, whenever
the per-draw cost is bounded below (`astudillo2021`, §3.3). This truncation is exactly the handle
[[multistep-budgeted-bo]] grips to build a tractable acquisition.

## Why the myopic ratio rules fail — arbitrarily

The cost-aware-BO hub argued *informally* that [[ei-per-unit-cost|EIpu]] "biases toward cheap
points." `astudillo2021` (Thm 1) makes this sharp and turns it into the motivation for the whole
non-myopic family: against the optimal policy $V^*$, both EI and EIpu can be **unboundedly**
suboptimal.

> **Theorem (EI and EIpu have unbounded approximation ratio; `astudillo2021`, Thm 1).** For any
> $\rho>0$ and each $\pi\in\{\mathrm{EI},\mathrm{EIpu}\}$, there is a budgeted-BO instance (a
> prior over $(f,c)$, a budget, and initial data $\mathcal D_0$) with
> $$
> V^*(\mathcal D_0)>\rho\,V^\pi(\mathcal D_0).
> $$

The construction is instructive because it isolates *which* myopic assumption each rule violates.
Work on a discrete domain with an independent prior and **equal posterior means** everywhere, two
kinds of points:

- **EIpu's failure** (`astudillo2021`, proof sketch). High-cost points have *large* variance;
  low-cost points have *small* variance. The cheap points' variance is so low that spending the
  *entire* budget on them earns only a fraction — in expectation — of what a *single* expensive,
  high-variance evaluation yields. EIpu cannot see this: its numerator EI rewards improvement over
  the *current* incumbent, overvaluing the small, near-certain gains of low-variance points, and
  its denominator $c(x)$ then amplifies the preference for cheap. So EIpu pours the budget into
  cheap low-value points and earns almost nothing, while the optimal policy makes the one
  expensive draw. The ratio $V^*/V^{\mathrm{EIpu}}$ is driven past any $\rho$.
- **EI's failure.** Make the cheap points' variance *only slightly* below the expensive points',
  but keep them much cheaper. Now cost-blind EI evaluates a *single* expensive high-variance point
  and immediately exhausts the budget — whereas repeatedly measuring the nearly-as-good cheap
  points is far superior in expectation. EI burns the budget in one shot.

The two failure modes are **complementary**: EIpu over-weights cheap points (cost in the
denominator), EI ignores cost entirely and over-spends. Neither prices the budget as a depletable
resource whose value depends on what improvements lie *ahead*, not on the current incumbent. The
deeper diagnosis (`astudillo2021`, §3.2): EI measures improvement over the status quo, but in a
multi-step context the status quo "will likely be surpassed by other later evaluations" — so the
right bar is not the *current* best but the value one expects to reach by the end of the budget.
Only a policy that looks ahead, like the DP above, uses that bar.

## Relation to other notes

- **[[bo-as-dynamic-program]].** The parent. This note adds a cost coordinate to the state and
  replaces the fixed horizon $N$ with the random budget-depletion time $N_B$, turning the
  finite-horizon DP into a stochastic shortest-path problem; with constant cost $c\equiv 1$ and
  $B=N$, $N_B=N$ and the two coincide.
- **[[ei-per-unit-cost]] / [[expected-improvement]].** The Theorem here is the rigorous backing
  for that note's "failure mode": EIpu's cheap-point bias and EI's cost-blindness are not just
  empirical liabilities but *unbounded* ones against the budgeted optimum.
- **[[multistep-budgeted-bo]].** The acquisition that approximately solves *this* DP — it
  truncates $V_N$ above and applies Bellman recursion to get the budgeted multi-step EI.
- **[[nonmyopic-cost-constrained-bo]].** The alternative formalization: a **finite-horizon**
  constrained MDP (`lee2021`) instead of this **random-horizon** MDP. `astudillo2021` argues the
  random horizon is more natural — the finite-horizon CMDP must bolt on a zero-reward, zero-cost
  "standing still" state to accommodate trajectories that deplete the budget early (see that note).
- **[[cost-models]].** The second GP on $\log c$ supplies the cost distribution that makes $N_B$
  finite a.s. and lets the planner reason about cost uncertainty.
- **[[cost-aware-bo]].** This is the non-myopic, budget-constrained branch the hub forward-links;
  the myopic EIpu/CArBO branch is its cheaper, shallower counterpart.

## Origin and crosswalk

`lam2016` formulated BO with a *finite evaluation budget* (count $N$) as a fixed-horizon DP and
solved it by rollout — the ancestor derived in [[bo-as-dynamic-program]]. `astudillo2021`
generalizes the budget from iteration count to **cumulative cost**, which forces the random
horizon $N_B$ and the stochastic-shortest-path structure, and supplies the unbounded-ratio
theorem. Both maximize a best-observed utility; minor mappings:

| This note (canonical) | `astudillo2021` | `lam2016` (fixed budget) | Note |
|---|---|---|---|
| budget $B$ on cost $\sum_n c(x_n)$ | $B$, constraint $\sum_i c(x_i)\le B$ | budget $N$ on **count** | cost vs. count; $c\equiv1,B=N$ recovers `lam2016` |
| state $\mathcal D_n$ incl. costs $z_i=c(x_i)$ | $\mathcal D_n=\{(x_i,y_i,z_i)\}$ | $\mathcal S_k=\{(x_i,y_i)\}$ | cost coordinate is the new state component |
| terminal utility $u(\mathcal D_n)=\max y$ | $u(\mathcal D_n)=\max_{(x,y,z)}y$ | $f^{\mathcal S_k}_{\min}$ (min conv.) | best-observed value; sign-flipped in `lam2016` |
| random horizon $N_B=\sup\{k:s(\mathcal D_k)\le B\}$ | $N_B$ (same) | fixed $N$ | the structural difference |
| $V^*(\mathcal D)=\sup_\pi E^\pi[u(\mathcal D_{N_B})-u(\mathcal D_0)]$ | eq. 1 | $J_1(z_1)$ | random- vs. fixed-horizon optimum |
| truncation $V_N\to V^*$ | eq. 5, §3.3 | rolling horizon $h$ | both cap lookahead for tractability |
