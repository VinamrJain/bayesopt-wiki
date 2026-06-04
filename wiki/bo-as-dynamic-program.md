---
title: Bayesian Optimization as a Dynamic Program
slug: bo-as-dynamic-program
tags: [decision-theoretic, lookahead, non-myopic, theory]
requires: [problem-setup, gaussian-process-regression, acquisition-functions, value-of-information, expected-improvement]
sources: [lam2016, frazier2018, frazier2009kg, astudillo2021]
---

# Bayesian Optimization as a Dynamic Program

Run with a finite budget $N$, Bayesian optimization is a **finite-horizon sequential decision
problem under uncertainty**: each evaluation both collects reward and changes what we know,
hence what we should do next. Its exact solution is a **dynamic program** (DP) — the parent
object that every myopic acquisition approximates. This note is the rigorous owner of that
frame. Its single deliverable is to write down the Bellman recursion the one-step rules point
*to*, and to show that [[expected-improvement|EI]], the [[knowledge-gradient|KG]], and the
entropy acquisitions ([[entropy-search]]) are each the **one-step truncation** of this DP under
a different terminal utility. Symbols follow [[notation]].

> **Notation delta.**
> - $S^n$ — the **state of knowledge** after $n$ evaluations: the posterior the data
>   $\mathcal D_n$ induces ([[gaussian-process-regression]]). $S^n$ and $\mathcal D_n$ are
>   interchangeable as the state; the posterior is the [sufficient statistic](#why-the-posterior-is-the-state).
> - $V^n(s)$ — the **optimal value function**: the best achievable expected terminal utility
>   from state $s$ with $N-n$ evaluations left.
> - $\pi=(\pi_{n},\dots,\pi_{N-1})$ — a **policy**, each $\pi_k:S^k\mapsto x_{k+1}\in A$ a rule
>   mapping the current state to the next point; $V^{\pi,n}$ its value.
> - $u(\cdot)$ — the **terminal utility** on the final state (the stopping value of
>   [[value-of-information]]); $r_n$ — a per-stage reward (used in the equivalent telescoped
>   form below).

## The sequential decision problem

Fix the budget $N$. From the loop in [[acquisition-functions]], one optimization run is a
length-$N$ sequence of decisions interleaved with random outcomes:

$$
S^n \;\xrightarrow{\ \text{choose } x_{n+1}\ }\; \big(x_{n+1},\,y_{n+1}\big)
\;\xrightarrow{\ \text{observe } y_{n+1}\ }\; S^{n+1},
\qquad n=n_0,\dots,N-1.
$$

Three ingredients make this a DP (`lam2016`, §3; `frazier2009kg`, §2.2):

1. **State** $S^n$ = the posterior given $\mathcal D_n$. It is all we carry between stages.
2. **Action** $x_{n+1}\in A$ = the next point to evaluate (the control). It is chosen by us.
3. **Stochastic transition.** Before evaluating, $y_{n+1}$ is unknown; under the GP its
   posterior marginal is $y_{n+1}\mid S^n,x_{n+1}\sim\mathrm{Normal}(\mu_n(x_{n+1}),\,
   \sigma_n^2(x_{n+1})+\lambda)$. Drawing $y_{n+1}$ and conditioning yields the next state,
   $$
   S^{n+1}=\mathcal F\big(S^n,\,x_{n+1},\,y_{n+1}\big)
   \;=\;\text{posterior given }\mathcal D_n\cup\{(x_{n+1},y_{n+1})\}.
   $$

The randomness sits entirely in the observations; the map $\mathcal F$ (a Bayes update) is
deterministic given $y_{n+1}$. This is exactly the alternation of **maximization** (we pick
$x$) and **expectation** (nature draws $y$) that defines a stochastic DP.

### Why the posterior is the state

The GP posterior is a *sufficient statistic* for the history: the predictive law of every
future observation depends on $\mathcal D_n$ only through $(\mu_n,\sigma_n^2)$. So nothing prior
to the current posterior is decision-relevant, and a policy may condition on $S^n$ alone — the
defining Markov property that makes the Bellman recursion below valid. The price is that the
state is **infinite-dimensional** (a function-space object), the root of the intractability in
[§ Intractability](#intractability-the-curse-of-dimensionality).

## Objective, policy, and the Bellman recursion

We act through a **policy** $\pi$, and a run earns reward only at the end, through the
**terminal utility** $u(S^N)$ — the value of the solution we report once the budget is spent
(the stopping value of [[value-of-information]]: e.g. the best posterior mean we could report).
The value of a policy from state $s$ at time $n$ is the expected terminal utility,

$$
V^{\pi,n}(s) \;=\; E\big[\,u(S^N)\,\big|\,S^n=s,\ \text{follow }\pi\,\big],
$$

the expectation over all future observations $y_{n+1},\dots,y_N$ drawn under the GP. We seek the
**optimal value** $V^n(s)=\max_\pi V^{\pi,n}(s)$. Bellman's principle of optimality — an optimal
policy continues optimally from whatever state it reaches — collapses this into a one-stage
recursion, computed backward from the horizon:

$$
\boxed{\
V^N(s)=u(s),
\qquad
V^n(s)=\max_{x\in A}\ E\big[\,V^{n+1}(S^{n+1})\,\big|\,S^n=s,\ x_{n+1}=x\,\big]
\ }
$$

for $n=N-1,\dots,n_0$ (`lam2016`, eqs. 9–10; `frazier2009kg`, §2.2, eq. 9 — the exact recursion
the [[value-of-information]] and [[knowledge-gradient]] notes forward-link). The maximizer
defines the **optimal policy**

$$
\pi_n^*(s)\in\operatorname*{arg\,max}_{x\in A}\ E\big[\,V^{n+1}(S^{n+1})\mid S^n=s,\ x_{n+1}=x\,\big],
$$

and $V^{n_0}(S^{n_0})$ is the best expected solution value any non-anticipating strategy can
achieve under budget $N$. The boxed recursion **is** the multi-step optimal acquisition
function — there is nothing more rational to do under the model.

## Myopic acquisitions are one-step truncations

The recursion is exact and intractable (next section). Replace the unknown continuation value
$V^{n+1}$ by the **terminal utility itself** — i.e. pretend the next evaluation is the *last*,
$V^{n+1}\!\approx u$ — and the recursion degenerates to a single max–expectation:

$$
\alpha_n(x)\;=\;E\big[\,u(S^{n+1})\mid S^n,\ x_{n+1}=x\,\big]-u(S^n)
\;=\;\mathrm{VoI}_n(x),
$$

the one-step [[value-of-information]] (subtracting the known $u(S^n)$ changes no maximizer). So
**every one-step acquisition is the $N=n+1$ case of the boxed DP**, and the families differ
*only* in the terminal utility $u$ they truncate (`frazier2018`, §multi-step):

| Acquisition | Terminal utility $u(S^n)$ | Report assumption |
|---|---|---|
| [[expected-improvement\|EI]] | $f^*_n=\max_{m\le n}f(x_m)$ | best **evaluated** point, noise-free |
| noisy [[expected-improvement\|EI]] | $\mu_n^{**}=\max_{i\le n}\mu_n(x_i)$ | best evaluated point, posterior-mean value |
| [[knowledge-gradient\|KG]] | $\mu_n^{*}=\max_{x\in A}\mu_n(x)$ | **any** point, posterior-mean value |
| [[entropy-search\|ES]] / [[predictive-entropy-search\|PES]] | $-H\big(p_\star(\cdot\mid\mathcal D_n)\big)$ | certainty about the **maximizer location** |
| [[max-value-entropy-search\|MES]] | $-H\big(p(f^*\mid\mathcal D_n)\big)$ | certainty about the **maximum value** |

This is the reconciliation the Tier-1 notes were built against: each says it is "the one-step
truncation of this DP under terminal reward $u$," and this table is the single place all those
$u$'s line up. Reading the acquisitions as **one truncated DP under five utilities** — rather
than five unrelated formulas — is the cleanest organizing view of the myopic family
([[acquisition-functions]]).

Truncation is exact at the horizon and approximate before it. When $N=n+1$ the one-step rule
*is* optimal (`frazier2009kg`, Remark 1); for $N>n+1$ it is **myopically optimal but not
generally optimal** — it ignores how this sample sets up later ones. That gap is the entire
motivation for non-myopic methods.

## Equivalent telescoped (stage-reward) form

`lam2016` writes the same DP with reward collected **per stage** rather than only at the end,
which exposes a discount knob and makes the EI connection explicit. Take the incumbent utility
$u(\mathcal D_n)=f^*_n$ and define the stage reward as the improvement banked at step $n$,

$$
r_n \;=\; \big[f(x_{n+1})-f^*_n\big]^+ \;=\; f^*_{n+1}-f^*_n \;=\; u(\mathcal D_{n+1})-u(\mathcal D_n)\ \ge 0 .
$$

Two facts make this the same problem as the terminal-utility DP. First, the rewards
**telescope**: $\sum_{n=n_0}^{N-1} r_n = f^*_N - f^*_{n_0} = u(S^N)-u(S^{n_0})$, so maximizing
expected total stage reward maximizes $E[u(S^N)]$ (the term $u(S^{n_0})$ is fixed). Second, each
stage reward's expectation **is expected improvement**,

$$
E_n[r_n]=E_n\big[\,[f(x_{n+1})-f^*_n]^+\,\big]=\mathrm{EI}_n(x_{n+1})
$$

(`lam2016`, eq. 15) — the bridge from the DP back to the closed form in
[[expected-improvement]]. Inserting a discount $\gamma\in[0,1]$ (`lam2016`, eq. 17) interpolates
the two readings: $\gamma=1$ is the undiscounted terminal-utility DP above, while $\gamma=0$
counts only the immediate stage reward and so reduces the policy to **greedy EI**. The myopic
$\leftrightarrow$ multi-step axis is literally a discount factor.

> **Remark — which form generalizes.** The telescoping identity is special to the *improvement*
> utility, where the terminal value decomposes into nonnegative per-step increments. KG's
> $\mu_n^*$ and the entropy utilities do **not** decompose this way (a sample can lower the
> running utility), so the wiki takes the **terminal-reward** form (boxed above) as canonical
> and treats the stage-reward form as `lam2016`'s improvement-specific specialization.

## Intractability: the curse of dimensionality

The boxed recursion is, in general, uncomputable. Three compounding obstacles (`lam2016`, §5):

- **Nested max–expectation alternation.** Evaluating $V^n$ needs $V^{n+1}$ inside an
  expectation inside a max; unrolling $H=N-n$ stages gives $H$ nested maximizations over $A$
  alternating with $H$ nested integrals over the $y$'s — no closed form past one or two steps.
- **Growing, uncountable state space.** The state $S^n$ is the posterior; concretely
  $\mathcal D_n\in(A\times\mathbb R)^n$ grows by $d+1$ dimensions each stage (`lam2016`, §5:
  $\mathcal Z_k=(\mathcal X\times\mathbb R)^k$). The continuation value must be known over a
  state set that expands with the horizon — Bellman's *curse of dimensionality*.
- **Continuous controls.** Each inner maximization is over the continuum $A$, not a finite
  action set.

Exact multi-step-optimal solutions exist only in narrow settings — two-step lookahead, or
structured problems like one-dimensional level-set determination (`frazier2018`, §multi-step,
citing Osborne–Garnett–Roberts and Cashore–Kumarga–Frazier). Past those, the DP must be
approximated.

## Approximations and the non-myopic family

The standard escape is to keep one real (outer) decision exact and **approximate the
continuation value** $V^{n+1}$, dodging the nested maximizations. `lam2016`'s **rollout** does
this by replacing the optimal continuation with the value $V^{\pi,n+1}$ of a cheap *base policy*
$\pi$ (e.g. greedy EI, then a final posterior-mean report) simulated over the remaining steps:

$$
V^{\pi,n}(s)=E\big[\,r_n+\gamma\,V^{\pi,n+1}(S^{n+1})\mid S^n=s,\ x_{n+1}=\pi_n(s)\big],
\qquad
\alpha_n(x)=E\big[\,r_n+\gamma\,V^{\pi,n+1}(S^{n+1})\mid S^n,\ x_{n+1}=x\,\big].
$$

Because the inner steps follow a *fixed* heuristic rather than a max, $V^{\pi}$ has **no nested
maximizations** and — unlike the backward DP — can be computed **forward** by simulation
(observations rolled out, expectations via Gauss–Hermite quadrature, a rolling horizon
$h$ capping the lookahead). Rollout is a one-step-lookahead policy that provably improves on its
base policy, and empirically beats greedy EI/PI/UCB at finite budget (`lam2016`, §6). It sits
strictly between the myopic rules ($V^{n+1}\!\approx u$, zero lookahead) and the exact DP
($V^{n+1}$ exact, full lookahead): the base policy is a tractable stand-in for the optimal
continuation.

This DP is the parent of the **non-myopic / budget-aware** acquisitions:

- [[multistep-budgeted-bo]] — explicit multi-step lookahead approximations (`astudillo2021`).
- [[budget-constrained-dp]] — the DP under an explicit evaluation-cost budget.
- [[nonmyopic-cost-constrained-bo]] — the cost-constrained closed-loop version.

## Relation to other notes

- [[value-of-information]] — the one-step VoI is this DP truncated to a single stage
  ($V^{n+1}\!\approx u$); that note owns the truncation, this one owns the full recursion they
  share the terminal utility $u$ with.
- [[expected-improvement]] / [[knowledge-gradient]] — the EI and KG one-step rules, recovered
  from the boxed recursion by the utilities $f^*_n$ and $\mu_n^*$ in the truncation table.
- [[entropy-search]], [[predictive-entropy-search]], [[max-value-entropy-search]] — the same
  truncation under information-theoretic utilities; each is "greedy" exactly in the sense of
  this DP.
- [[acquisition-functions]] — the hub; its "myopia and the dynamic-programming parent" section
  is the informal version of this note.
- [[problem-setup]] — the optimization loop this note re-reads as a finite-horizon MDP.

## Origin and crosswalk

The general DP / Bellman machinery is standard (Bertsekas; Powell); its instantiation for BO
with a finite budget is `lam2016`, which derives the recursion and the rollout approximation.
`frazier2009kg` gives the terminal-reward form (eq. 9) the value-of-information notes cite;
`frazier2018` (§multi-step) frames the myopic acquisitions as truncations and surveys the exact
and approximate multi-step landscape. `lam2016` works in the **minimization** convention; the
crosswalk maps it to the wiki's maximize-and-report-terminal-utility convention.

| This note (canonical, maximize, terminal utility) | `lam2016` (minimize, stage rewards) | Note |
|---|---|---|
| state $S^n$ = posterior given $\mathcal D_n$ | $z_k=\mathcal S_k$ (training set) | same object; posterior is the sufficient statistic |
| action $x_{n+1}\in A$ | control $u_k\in\mathcal U_k=\mathcal X$ | next point to evaluate |
| transition $S^{n+1}=\mathcal F(S^n,x_{n+1},y_{n+1})$ | $\mathcal S_{k+1}=\mathcal S_k\cup\{(x_{k+1},f_{k+1})\}$ | Bayes update on the new pair |
| optimal value $V^n$ | reward-to-go $J_k$ | $V^N=u$ vs. $J_{N+1}=r_{N+1}$ |
| terminal utility $u(S^N)$ | per-stage $r_k=\max\{0,f_{\min}^{\mathcal S_k}-f_{k+1}\}$, $r_{N+1}=0$ | telescopes to $u$; sign-flipped (min↔max) |
| (undiscounted, $\gamma=1$) | discount $\gamma\in[0,1]$; $\gamma=0\Rightarrow$ greedy EI | $\gamma$ interpolates myopic↔multi-step |
| $E_n[u(S^{n+1})]-u(S^n)=\mathrm{VoI}_n$ | $E[r_k]=\mathrm{EI}$ (eq. 15) | stage-reward expectation = EI |
