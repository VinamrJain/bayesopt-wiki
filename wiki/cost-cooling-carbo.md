---
title: Cost Cooling and CArBO
slug: cost-cooling-carbo
tags: [cost-aware, acquisition, myopic]
requires: [ei-per-unit-cost, expected-improvement, cost-aware-bo]
sources: [lee2020]
---

# Cost Cooling and CArBO

The cost-aware symbols ($c(x)$, $\tau$, $\tau_{\mathrm{init}}$, $\tau_k$, $\alpha_k$) follow
[[notation]]; this note defines the EI-cool acquisition that uses them.

CArBO (Cost Apportioned BO) is a cost-aware BO algorithm that implements the *early-cheap / late-expensive* strategy described in [[cost-aware-bo]]: dense, cheap evaluations during warm-start build a broad surrogate, and a cooling acquisition function then gradually releases the cost penalty as the budget depletes, ensuring the optimizer reaches expensive regions when necessary. It comprises two coupled building blocks — a **cost-effective initial design** and **cost-cooling (EI-cool)** — and is the primary instantiation of the myopic cost-aware family. Symbols follow [[notation]].

## Cost-cooling (EI-cool)

Fix a GP surrogate for $f$ and a second GP surrogate for $\log c(x)$ (the [[cost-models|log-cost model]]). At the $k$th BO iteration, let $\tau_k$ denote the cumulative cost consumed. The **EI-cool** acquisition is:

$$
\boxed{\ \mathrm{EI\text{-}cool}_k(x) := \frac{\mathrm{EI}_n(x)}{c(x)^{\alpha_k}}\ },
\qquad
\alpha_k := \frac{\tau - \tau_k}{\tau - \tau_{\mathrm{init}}},
$$

where the convention at warm-start completion is $\tau_0 = \tau_{\mathrm{init}}$, so $\alpha_0 = 1$ (`lee2020`, eq. (2) and appendix §Cost Cooling).

**Limit analysis.** Two boundary cases confirm the design intent:

- $\tau_k = \tau_{\mathrm{init}}$ (beginning of the optimization phase): $\alpha_k = 1$ and $\mathrm{EI\text{-}cool}_k = \mathrm{EI}_n(x)/c(x) = \mathrm{EIpu}_n(x)$ — the acquisition is [[ei-per-unit-cost|EI per unit cost]]. At this point the surrogate is still poorly informed and cost-sensitive selection is appropriate.

- $\tau_k \to \tau$ (budget nearly exhausted): $\alpha_k \to 0$ and $c(x)^{\alpha_k} \to 1$, so $\mathrm{EI\text{-}cool}_k \to \mathrm{EI}_n(x)$ — plain [[expected-improvement|EI]], cost-blind. When budget is nearly gone, the optimizer must commit to the best-looking point regardless of cost.

Between these limits, $\alpha_k$ decays continuously as budget is consumed. The cost denominator's exponent shrinks monotonically, gradually lifting the penalty on expensive regions and preventing the compulsive cheap-point bias that afflicts EIpu throughout its run.

**The schedule is a ratio, not a time clock.** Note that $\alpha_k = (\tau - \tau_k)/(\tau - \tau_{\mathrm{init}})$ is a *fraction of remaining budget* relative to the post-warm-start horizon. If evaluations are uniformly cheap, $\tau_k$ grows slowly and $\alpha_k$ stays near 1 for many iterations; if evaluations are expensive, the exponent falls quickly. The cooling is therefore adaptive to actual cost throughput, not to iteration count.

> **Remark — no optimality guarantee.** EI-cool does not guarantee improvement over *both* EIpu and EI. `lee2020` (appendix §Cost Cooling, Fig. §knn-cooling) shows a KNN benchmark where EI-cool beats EIpu but is beaten by EI. The paper's finding is that EI-cool usually outperforms *at least one* of the two — making it more robust than either alone — but not universally both. Users should treat EI-cool as a hedge, not a strict improvement.

### The cost model

The cost $c(x)$ is unknown and modeled by a GP on $\log c(x)$ fitted jointly with the objective GP. The log-cost GP yields a log-normal distribution for $c(x)$, from which a point estimate is extracted (e.g. via the posterior mean of $\log c(x)$, then exponentiated) and plugged directly into the EI-cool denominator. `lee2020` also studies low-variance parametric cost models (linear in FLOPs) as substitutes for the GP surrogate when the cost structure is partially known; see [[cost-models]].

> **Notation remark.** `lee2020` writes the log-cost as $\gamma(x)$, with $c(x) = \exp(\gamma(x))$. We rename it $\log c(x)$ here to avoid collision with $\gamma_T$ (maximum information gain, defined in [[notation]] and used by [[gp-ucb]]). The GP model is otherwise unchanged.

## Cost-effective initial design

Before the BO acquisition loop begins, CArBO fills the domain $A$ with cheap, well-spread points under a warm-start budget $\tau_{\mathrm{init}}$. The objective is to minimize the **fill distance** (minimax covering radius) of the initial design set $X$ subject to a total-cost constraint:

$$
\min_{X \subseteq A}\; \mathrm{fill}(X) := \sup_{x \in A}\,\min_{x_j \in X} \|x_j - x\|_2
\quad \text{subject to} \quad \sum_{x_i \in X} c(x_i) < \tau_{\mathrm{init}}.
$$

$\mathrm{fill}(X)$ is the radius of the largest empty ball that can be inscribed in $A$ given the design $X$ — the classical minimax criterion from design-of-experiments (`lee2020`, §CArBO, eq. (1)). Minimizing it maximizes coverage: a smaller fill means no region of $A$ is far from a design point.

**Why not a standard LHS or low-discrepancy sequence?** Standard space-filling designs (Latin hypercubes, Halton sequences) treat each evaluation as equally costly. Within a fixed iteration budget they achieve uniform coverage; within a fixed cost budget they evaluate only as many points as the budget allows at average cost. The cost-effective design instead trades away uniform spacing in exchange for fitting *more* cheap points into the same $\tau_{\mathrm{init}}$ — and more points means a better surrogate before the acquisition loop starts.

**Greedy approximation.** Exactly minimizing the minimax criterion over a budget constraint is NP-hard (it reduces to weighted vertex cover in the discrete setting). `lee2020` uses a greedy inner loop: discretize $A$ into candidates $\tilde{A}$; repeatedly prune the most expensive remaining candidate and the candidate closest to the current design, until only one remains; add it; repeat until $\tau_{\mathrm{init}}$ is exceeded. The surviving candidate at each inner round is simultaneously cheap and far from existing design points. In the batch setting, $b$ candidates are selected per inner round and evaluated in parallel.

> **Remark — approximation quality.** Greedy approximations to the minimax criterion carry a worst-case factor-2 approximation guarantee (`lee2020`, citing Damblin 2013 and Pronzato 2017). The greedy procedure reduces to the standard cost-blind greedy design when costs are constant.

## CArBO: the combined algorithm

CArBO is the sequential composition of the two building blocks (`lee2020`, Algorithm 1):

1. **Input:** batch size $b$, warm-start budget $\tau_{\mathrm{init}}$, total budget $\tau$.
2. Run the cost-effective initial design (Algorithm above) using budget $\tau_{\mathrm{init}}$; fit objective and cost GPs on the results.
3. **While** cumulative cost $ct < \tau$: select the next batch of $b$ points by maximizing EI-cool (with current $\alpha_k$) using batch fantasizing; evaluate in parallel; update both surrogates and $ct$.
4. **Return** the best observed hyperparameter configuration.

**Default $\tau_{\mathrm{init}} = \tau/8$** (`lee2020`, §CArBO): one-eighth of the total budget is spent on the warm-start. This value is a heuristic — chosen empirically through ablation on the MLP a1a benchmark (§Additional Experiments, Fig. §ratio-study), which showed robustness to choices from $\tau/8$ up to $\tau/2$ and modest degradation only at the extreme $6\tau/8$. Lee et al. explicitly leave a principled selection of $\tau_{\mathrm{init}}$ as future work. Treat this as a tuning choice, not a derived constant.

> **Remark — batch extension.** The batch variant replaces sequential EI-cool maximization with **batch fantasizing**: the first batch point is the EI-cool maximizer; subsequent batch points are found by maximizing the average EI-cool over fantasized GP posteriors conditioned on the previous batch points (`lee2020`, appendix, Algorithm §batch-fantasizing, with $n_f = 10$ fantasy samples by default). This technique is inherited from `wilson2018` and applied to EI-cool without derivation from first principles — `lee2020` asserts linear batch scaling empirically (batch sizes up to 16) but does not prove it. The batch extension is a known gap for formal analysis.

## Relation to other notes

- **[[ei-per-unit-cost]].** EI-cool generalizes EIpu: EIpu is the $\alpha_k = 1$ special case. The failure mode of EIpu — systematic bias toward cheap regions — is exactly what the cooling schedule corrects by letting $\alpha_k$ decay to 0.

- **[[expected-improvement]].** EI-cool generalizes EI in the other direction: EI is the $\alpha_k = 0$ special case. The EI closed form $\mathrm{EI}_n(x) = \Delta_n(x)\,\Phi(\Delta_n(x)/\sigma_n(x)) + \sigma_n(x)\,\varphi(\Delta_n(x)/\sigma_n(x))$ is unchanged inside EI-cool; only the denominator varies.

- **[[cost-aware-bo]].** This note is the concrete instantiation of the *early-cheap / late-expensive* principle described in the hub. The family map there positions CArBO alongside EIpu; the distinction is the cooling schedule, which EIpu lacks.

- **[[cost-models]].** Both EIpu and EI-cool consume a GP surrogate for $c(x)$ (specifically for $\log c(x)$). That surrogate, its fitting procedure, and the low-variance parametric alternatives (linear FLOPs model for MLPs) are documented in [[cost-models]].

- **[[bo-as-dynamic-program]] / [[budget-constrained-dp]].** EI-cool is a one-step ratio heuristic. It does not arise from a finite-horizon DP — there is no DP whose one-step truncation yields $\mathrm{EI}/c^\alpha$. This is the structural divide in [[cost-aware-bo]]'s family map: EIpu and EI-cool are myopic; the DP branch embeds cost inside the DP state and correctly prices the tradeoff between a costly evaluation now and foreclosed cheap evaluations later. The cost is computational: myopic acquisitions (evaluating $\mathrm{EI}_n(x)$ and $c(x)$) are closed-form; DP-based acquisitions require rollouts or backward induction.

## Crosswalk

| This note (canonical, maximize) | `lee2020` (minimize) | Note |
|---|---|---|
| $\mathrm{EI\text{-}cool}_k(x) = \mathrm{EI}_n(x)/c(x)^{\alpha_k}$ | $\text{EI-cool}(\mathbf{x}) = \mathrm{EI}(\mathbf{x})/c(\mathbf{x})^\alpha$ | identical formula; sign convention differs (maximize here, minimize there); $\mathrm{EI}_n$ uses $f^*_n = \max_{m\le n}f(x_m)$ vs. $y^* = \min_n f(x_n)$ |
| $\alpha_k = (\tau - \tau_k)/(\tau - \tau_{\mathrm{init}})$ | $\alpha = (\tau - \tau_k)/(\tau - \tau_{\mathrm{init}})$ | same; we subscript by $k$ to emphasize iteration-dependence |
| $\tau_0 = \tau_{\mathrm{init}}$ (convention at warm-start) | $\tau_k = \tau_{\mathrm{init}}$ at $k=0$ | same |
| $\log c(x)$ (GP surrogate target; log-cost) | $\gamma(\mathbf{x})$, with $c(\mathbf{x}) = \exp(\gamma(\mathbf{x}))$ | renamed to avoid collision with $\gamma_T$ (max info-gain) in [[notation]] |
| $\mathrm{fill}(X) = \sup_{x\in A}\min_{x_j\in X}\|x_j - x\|_2$ | $\mathrm{fill}(\mathbf{X})$ (same) | minimax criterion; no notation change |
| $\tau_{\mathrm{init}} = \tau/8$ (default heuristic) | $\tau_{init} = \tau/8$ | explicitly heuristic in `lee2020` |
