---
title: Nonmyopic Cost-Constrained BO (CMDP Rollout)
slug: nonmyopic-cost-constrained-bo
tags: [cost-aware, non-myopic, lookahead, decision-theoretic]
requires: [bo-as-dynamic-program, cost-aware-bo, ei-per-unit-cost, budget-constrained-dp]
sources: [lee2021, lam2016, astudillo2021]
---

# Nonmyopic Cost-Constrained BO (CMDP Rollout)

`lee2021` attacks the same budgeted problem as [[budget-constrained-dp]] but formalizes it as a
**constrained Markov decision process** (CMDP) over a **fixed** horizon $h$, and solves it the way
[[bo-as-dynamic-program]] solves the unconstrained DP — by **rollout** of a base policy, here one
designed around the "cheap-first, expensive-last" intuition: $h-1$ steps of
[[ei-per-unit-cost|EIpu]] capped by a final step of [[expected-improvement|EI]]. The CMDP framing
buys a clean optimality guarantee (rollout never hurts the base policy) but rests on a load-bearing
assumption — **deterministic cost** — that the random-horizon formulation of [[multistep-budgeted-bo]]
avoids. Symbols follow [[notation]].

> **Notation delta.**
> - CMDP $\langle T,\mathbb S,A,P,R,C,\tau\rangle$ — decision epochs $T=\{0,\dots,h-1\}$ (**finite**
>   horizon $h$), states $\mathbb S$ (observation sets $\mathcal D_t$), actions $A$ (points in the
>   domain), transition $P$, reward $R$, **cost** $C$, constraint $\tau$.
> - $h$ — planning horizon (number of look-ahead steps); $\tau$ — cost budget (the constraint), as
>   in [[notation]].
> - $V^\pi_h(\mathcal D_k),\ C^\pi_h(\mathcal D_k)$ — expected reward / expected cost of policy
>   $\pi$ over $h$ steps from $\mathcal D_k$.
> - $\tilde\pi=(\tilde\pi_0,\dots,\tilde\pi_{h-1})$ — **base policy**; $\Lambda_h(x)$ — the
>   **rollout acquisition** (value of starting with $x$ then following $\tilde\pi$).
> - $f^*_t=\max_{m\le t}y_m$ — incumbent (maximization; `lee2021` minimizes — see crosswalk).

## BO as a constrained MDP

Cost-constrained BO is, literally, a constrained set-optimization:
$\max_{\mathbf X\subseteq A}\max_{x\in\mathbf X}f(x)$ subject to
$\sum_{x\in\mathbf X}c(x)\le\tau$ — choose a set of points to evaluate, total cost within budget,
keep the best (`lee2021`, §4). `lee2021` casts $h$ steps of this as a CMDP, an MDP carrying an
extra **cost** channel accumulated alongside reward (`lee2021`, §3):

- **State** $\mathcal D_t$ = observations so far; **action** $x_{t+1}\in A$ = next point.
- **Transition** $P(\mathcal D_{t+1}\mid\mathcal D_t,x_{t+1})$: draw $y_{t+1}$ from the GP
  posterior predictive $\mathrm{Normal}(\mu_t(x_{t+1}),\sigma_t^2(x_{t+1}))$, append
  $(x_{t+1},y_{t+1})$ — the same Bayes-update dynamics as [[bo-as-dynamic-program]].
- **Reward** is the one-step improvement, $R(\mathcal D_t,x_{t+1},\mathcal D_{t+1})=(y_{t+1}-f^*_t)^+$,
  whose expectation is EI ([[expected-improvement]]) — the DP's stage reward again.
- **Cost** $C=c(x)$, assumed **deterministic and state-independent** (depends only on the action).
- **Constraint** $\tau$: a positive scalar cost cap.

A policy earns expected reward and incurs expected cost,
$$
V^\pi_h(\mathcal D_k)=E\Big[\textstyle\sum_{t=k}^{k+h-1}(y^*_t\!\to\!y_{t+1}\text{ improvement})\Big],
\qquad
C^\pi_h(\mathcal D_k)=E\Big[\textstyle\sum_{t=k}^{k+h-1}c(\pi_t(\mathcal D_t))\Big],
$$
and the **CMDP optimum** maximizes reward subject to the cost constraint:
$$
\pi^*=\arg\max_\pi V^\pi_h(\mathcal D_k)\quad\text{subject to}\quad C^\pi_h(\mathcal D_k)\le\tau.
$$
A trajectory is **feasible** if every prefix obeys the budget, $\sum_{t}c(x_t)\le\tau$; the set of
feasible trajectories is $G$.

### Why CMDPs are hard

The constraint wrecks the machinery that made the unconstrained DP tractable in principle. Unlike
an MDP, a CMDP does **not** satisfy Bellman's principle of optimality — an optimal sub-policy of an
optimal policy need not be optimal once the remaining budget is fixed — so backward recursion does
not apply, and an optimal (deterministic) policy may **not even exist** (`lee2021`, §4, citing
Altman). The textbook CMDP solution is a large linear program over the state–action space,
hopeless for BO's exponentially growing, uncountable state set. So `lee2021` does not solve the
CMDP exactly; it **approximates the optimal policy by rollout**, exactly the escape
[[bo-as-dynamic-program]] takes for the unconstrained DP.

## CMDP rollout

Rollout forward-simulates a fixed **base policy** $\tilde\pi$ and scores each first action by the
simulated reward-to-go. The cost-constrained acquisition is the rollout of $\tilde\pi$ to horizon
$h$, started at the candidate $x_{k+1}$:

$$
\boxed{\ \Lambda_h(x_{k+1}):=E\big[\,V^{\tilde\pi}_h(\mathcal D_k\cup\{(x_{k+1},y_{k+1})\})\,\big]\ },
$$

with $y_{k+1}$ the (random) observation at $x_{k+1}$, and the next point chosen as
$\arg\max_x\Lambda_h(x)$. The value $V^{\tilde\pi}_h$ is estimated by Monte-Carlo policy evaluation
— simulate trajectories under $\tilde\pi$, average the summed rewards. **CMDP rollout differs from
MDP rollout in one line:** simulated trajectories that violate the budget are **discarded** (kept
only if in $G$); a rollout terminates either at the horizon $h$ or on constraint violation
(`lee2021`, §5.2, citing Bertsekas). This is the discrete-trajectory counterpart of the budget
indicator $\mathbf 1\{s\le B\}$ in [[multistep-budgeted-bo]].

### The base policy: EIpu, then a final EI

Rollout's quality is its base policy's quality. `lee2021` designs $\tilde\pi$ from two boundary
cases (`lee2021`, §5.2):

- **$h=1$.** If the EI-maximizer is affordable, $c(x_{\mathrm{EI}})\le\tau$, then plain EI *is*
  CMDP-optimal for a single step — so EI must be the **last** action of any sensible base policy.
- **$h>1$.** If the EI-maximizer costs $\tau^*$ and a near-free point of cost $\epsilon$ exists with
  $\tau=\tau^*+\epsilon$, the cheap point should be taken *first* (in the limit, a free point is
  always worth taking before an expensive one). Cheap-first is what [[ei-per-unit-cost|EIpu]] does.

The policy honoring both is **$h-1$ steps of EIpu, then a final step of EI**:

$$
\tilde\pi_t(\mathcal D_t)=
\begin{cases}
\arg\max_{x\in A}\mathrm{EIpu}_t(x), & t<h-1,\\[2pt]
\arg\max_{x\in A}\mathrm{EI}_t(x), & t=h-1.
\end{cases}
$$

This realizes the hub's **"early and cheap, late and expensive"** principle ([[cost-aware-bo]])
*within the lookahead*: EIpu pulls cheap exploratory points early, the terminal EI commits to the
best (likely expensive) exploit. It also degrades gracefully — under uniform cost EIpu $=$ EI and
$\tilde\pi$ becomes plain rollout-of-EI, known to help in standard BO; and at $h=1$ with sufficient
budget it is CMDP-optimal.

## The rollout improving property — and its fine print

The reason to prefer the rollout $\Lambda_h$ over just running its base policy is a guarantee
inherited from MDP theory: rollout **never does worse** than the base policy.

> **Theorem (rollout improvement; `lee2021`, Thm via Bertsekas).** In the CMDP setting, if the base
> policy $\tilde\pi$ is *sequentially consistent*, the rollout policy $\pi_{\text{roll}}$ satisfies
> $V^{\pi_{\text{roll}}}_h(s_0)\ge V^{\tilde\pi}_h(s_0)$.

A policy is **sequentially consistent** if, having generated trajectory
$(s_0,a_0),(s_1,a_1),\dots$ from $s_0$, it generates the *tail* $(s_1,a_1),\dots$ when started from
$s_1$ — i.e. it "stays on its own path" (`lee2021`, Def. 1). For an $\arg\max$ acquisition this
holds once ties are broken **consistently**, which is the only implementation requirement.

> **Caveat — deterministic cost is load-bearing.** The CMDP improvement theorem holds *"if $c(x)$
> is also deterministic"* (`lee2021`, §5.3). The whole CMDP — constraint, feasibility test,
> guarantee — assumes cost depends only on the action and is known when planning. In practice cost
> is unknown and **learned** (a warped GP on $\log c$, [[cost-models]]); `lee2021` plugs the
> estimate in but its theory does **not** cover stochastic cost. This is the exact gap
> [[multistep-budgeted-bo]] closes by modeling $\log c$ as a GP *inside* the formulation and
> treating the horizon as random — see [[cost-models]], which flags this deterministic-cost
> assumption as the dividing line between the two papers.

## Finite horizon vs. random horizon: the contrast with B-MS-EI

`lee2021` (CMDP) and [[multistep-budgeted-bo|astudillo2021]] (B-MS-EI) are concurrent answers to
the *same* budgeted problem and differ in two coupled choices (`astudillo2021`, §2):

| | `lee2021` (this note) | `astudillo2021` ([[multistep-budgeted-bo]]) |
|---|---|---|
| **Horizon** | **fixed** $h$ (a CMDP) | **random** $N_B$ (budget-depletion stopping time) |
| **Budget handling** | hard constraint $\le\tau$; infeasible rollouts discarded | indicator $\mathbf 1\{s\le B\}$ truncates the value |
| **Solution** | one policy-improvement step over a hand-built base policy ($h-1$ EIpu $+$ EI) | direct approximation of the optimal policy via an optimized scenario tree |
| **Cost** | deterministic (theory) | random; $\log c$ a GP, modeled jointly |

`astudillo2021` argues the **random horizon is more natural**: a fixed-horizon CMDP must extend
every feasible trajectory to length $h$ by padding with a **zero-reward, zero-cost "standing still"
state** (`lee2021`, §3) to accommodate runs that deplete the budget in fewer than $h$ steps —
machinery the random-horizon MDP never needs, since $N_B$ simply *is* where the budget runs out.
The flip side: `lee2021`'s base-policy rollout is cheaper and comes with the clean improvement
guarantee, whereas B-MS-EI's tree optimization is heavier but model-consistent under cost
uncertainty. The base-policy idea even crosses over — B-MS-EI uses a base-policy rollout to set its
*fantasy budget* ([[multistep-budgeted-bo]], §budget scheduling).

## Relation to other notes

- **[[bo-as-dynamic-program]].** The unconstrained parent; this note adds a cost channel and a hard
  constraint (MDP → CMDP) and reuses its rollout approximation. $V^{\tilde\pi}_h$ here is the
  budgeted analogue of the rollout value $V^{\pi,n}$ there.
- **[[budget-constrained-dp]] / [[multistep-budgeted-bo]].** The random-horizon formalization of
  the same problem and its acquisition; the table above is the head-to-head.
- **[[ei-per-unit-cost]] / [[expected-improvement]].** The two pieces of the base policy; the
  $h=1$ argument is precisely *why* EI (not EIpu) is the terminal step.
- **[[cost-models]].** Owns the deterministic-vs-stochastic-cost distinction this note leans on; the
  warped-GP cost surrogate is what `lee2021` uses in practice despite the deterministic-cost theory.
- **[[cost-aware-bo]].** The "early and cheap, late and expensive" principle the base policy
  instantiates.

## Origin and crosswalk

`lee2021` introduces the CMDP-rollout acquisition; the rollout machinery and improvement theorem
are from Bertsekas, and the MDP-for-BO framing from `lam2016` ([[bo-as-dynamic-program]]). `lee2021`
**minimizes**; the mapping to the wiki's maximization convention:

| This note (canonical, maximize) | `lee2021` (minimize) | Note |
|---|---|---|
| incumbent $f^*_t=\max_{m\le t}y_m$ | $y^*_t=\min\{y_0,\dots,y_t\}$ | sign flip |
| reward $R=(y_{t+1}-f^*_t)^+$ | $R=(y^*_t-y_{t+1})^+$ | improvement toward max vs. min |
| budget $\tau$, constraint $\sum c\le\tau$ | $\tau$ (same symbol) | no change |
| base policy: $(h-1)\times$EIpu, then EI | $\tilde\pi$: $h-1$ EIpu then EI | identical |
| rollout acquisition $\Lambda_h(x)$ | $\Lambda_h(\mathbf x)$ | same |
| horizon $h$, value $V^\pi_h$, cost $C^\pi_h$ | $h$, $V^\pi_h$, $C^\pi_h$ | same |
