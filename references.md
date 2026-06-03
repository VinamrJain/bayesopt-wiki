# Bibliography

Citation keys for wiki frontmatter (`sources:`) and inline cites. Each key maps to a folder under `raw/`. LaTeX trees are the preferred source where available; some entries are stored as PDF only.

---

## Surveys & tutorials

### `shahriari2016` — Review of Bayesian optimization

**Shahriari, Swersky, Wang, Adams & de Freitas (2016).** *Taking the Human Out of the Loop: A Review of Bayesian Optimization.* Proceedings of the IEEE 104(1):148–175.

Unified survey of BO: GP surrogates, acquisition families (EI, PI, UCB, entropy methods, knowledge gradient), hyperparameter handling, and applications. Standard map of the field rather than a single derivation.

| | |
|---|---|
| Files | `raw/shahriari2016/` (PDF) |
| DOI | [10.1109/JPROC.2015.2494218](https://doi.org/10.1109/JPROC.2015.2494218) |

### `frazier2018` — Tutorial on Bayesian optimization

**Frazier (2018).** *A Tutorial on Bayesian Optimization.* arXiv:1807.02811.

Pedagogical backbone: GP regression, EI/KG/entropy acquisitions, decision-theoretic view of myopic rules, and pointers to multi-step and exotic variants. Primary modern reference for clean EI derivations.

| | |
|---|---|
| Files | `raw/frazier_2018_tutorial_bo/` (LaTeX) |
| PDF | [arxiv.org/pdf/1807.02811](https://arxiv.org/pdf/1807.02811) |

---

## Regret, convergence & lower bounds

### `srinivas2010` — GP-UCB and bandit regret

**Srinivas, Krause, Kakade & Seeger (2010).** *Gaussian Process Optimization in the Bandit Setting: No Regret and Experimental Design.* ICML.

Defines GP-UCB and proves high-probability sublinear regret for optimizing unknown functions under a GP prior—foundational link between BO and GP bandits.

| | |
|---|---|
| Files | `raw/srinivas2010/` (PDF) |
| PDF | [arxiv.org/pdf/0912.3995](https://arxiv.org/pdf/0912.3995) |
| DOI | [10.5555/3104322.3104454](https://doi.org/10.5555/3104322.3104454) |

### `bull2011` — Convergence rates for efficient global optimization

**Bull (2011).** *Convergence Rates of Efficient Global Optimization Algorithms.* Journal of Machine Learning Research 12:2879–2904.

Analyzes convergence rates of EGO-style algorithms under smoothness assumptions on the objective and kernel—complements bandit regret with approximation-theoretic rates.

| | |
|---|---|
| Files | `raw/bull2011/` (PDF) |
| PDF | [jmlr.org/.../bull11a.pdf](https://www.jmlr.org/papers/volume12/bull11a/bull11a.pdf) |

### `scarlett2017` — Lower bounds on GP bandit regret

**Scarlett, Bogunovic & Cevher (2017).** *Lower Bounds on Regret for Gaussian Process Bandit Optimization.* arXiv:1706.03600.

Information-theoretic lower bounds showing fundamental limits for GP bandit algorithms, including regimes where standard UCB-type methods are near-optimal or suboptimal.

| | |
|---|---|
| Files | `raw/scarlett_2017_lower_bounds_gp_bandit/` (LaTeX) |

---

## Expected improvement & classical global optimization

### `mockus1978` — Bayesian approach to global optimization

**Mockus (1978).** *The Application of Bayesian Methods for Seeking the Extremum.* In *Towards Global Optimisation 2.*

Early formulation of sequential Bayesian global search and the improvement-based acquisition idea—conceptual origin of expected improvement. (No local source file; cite externally.)

### `jones98` — Efficient global optimization (EGO)

**Jones, Schonlau & Welch (1998).** *Efficient Global Optimization of Expensive Black-Box Functions.* Journal of Global Optimization 13(4):455–492.

Canonical EGO paper: kriging/GP surrogate plus closed-form expected improvement; defines the exploit–explore balance used in most BO codes.

| | |
|---|---|
| Files | `raw/jones98/` (PDF) |
| DOI | [10.1023/A:1008306431147](https://doi.org/10.1023/A:1008306431147) |

### `snoek2012` — Practical BO for machine learning

**Snoek, Larochelle & Adams (2012).** *Practical Bayesian Optimization of Machine Learning Algorithms.* NeurIPS. arXiv:1206.2944.

Makes BO usable at scale: MCMC over GP hyperparameters, parallel/pending evaluations, and **expected improvement per unit time** (EI divided by predicted log-cost).

| | |
|---|---|
| Files | `raw/snoek_2012_practical_bo/` (LaTeX) |
| PDF | [arxiv.org/pdf/1206.2944](https://arxiv.org/pdf/1206.2944) |

---

## Information-theoretic acquisitions

### `hennig2012` — Entropy search

**Hennig & Schuler (2012).** *Entropy Search for Information-Efficient Global Optimization.* JMLR 13:1809–1837.

Chooses the point that maximally reduces entropy of the **location** of the global minimum—non-myopic information criterion distinct from EI.

| | |
|---|---|
| Files | `raw/hennig_2012_entropy_search/` (LaTeX) |

### `hernandez2014` — Predictive entropy search (PES)

**Hernández-Lobato, Hoffman & Ghahramani (2014).** *Predictive Entropy Search for Efficient Global Optimization of Black-box Functions.* NeurIPS.

Tractable approximation to entropy search via expectations over GP hyperparameters and fantasized observations; strong empirical performance on benchmarks.

| | |
|---|---|
| Files | `raw/hernandez_lobato_2014_pes/` (LaTeX) |

### `wang2017mes` — Max-value entropy search

**Wang & Jegelka (2017).** *Max-value Entropy Search for Efficient Global Optimization.* ICML.

Targets reduction in entropy of the **maximum function value** rather than the argmin—often cheaper than full entropy search with similar exploration benefits.

| | |
|---|---|
| Files | `raw/wang_2017_max_value_entropy_search/` (LaTeX) |

---

## Knowledge gradient & batch / parallel BO

### `frazier2009kg` — Knowledge gradient with correlated beliefs

**Frazier, Powell & Dayanik (2009).** *The Knowledge-Gradient Policy for Correlated Normal Beliefs.* INFORMS Journal on Computing 21(4):599–613.

Sequential ranking-and-selection policy accounting for correlation across alternatives; extends to continuous BO with bounded suboptimality guarantees.

| | |
|---|---|
| Files | `raw/frazier2009kg/` (PDF) |
| PDF | [people.orie.cornell.edu/.../CorrelatedKG.pdf](https://people.orie.cornell.edu/pfrazier/pub/CorrelatedKG.pdf) |
| DOI | [10.1287/ijoc.1080.0314](https://doi.org/10.1287/ijoc.1080.0314) |

### `wang2016qei` — Parallel BO with q-EI

**Wang, Hutter, Zimmer, Hamann & Hoos (2016).** *Parallel Bayesian Global Optimization of Expensive Functions.* arXiv:1602.04701.

Batch acquisition via approximations to **q-EI** for selecting multiple points per iteration under shared GP beliefs.

| | |
|---|---|
| Files | `raw/wang_2016_parallel_qei/` (LaTeX) |

### `wu2019takg` — Parallel knowledge gradient

**Wu & Frazier (2019).** *The Parallel Knowledge Gradient Method for Batch Bayesian Optimization.* UAI.

Extends knowledge-gradient ideas to parallel batches with correlated beliefs across pending evaluations.

| | |
|---|---|
| Files | `raw/wu_2019_multifidelity_takg/` (LaTeX) |

### `wilson2018` — Maximizing acquisition functions

**Wilson et al. (2018).** *Maximizing Acquisition Functions for Bayesian Optimization.* NeurIPS.

Studies optimization of acquisition landscapes (local vs global search, gradients, initialization)—relevant whenever EI/UCB/entropy must be solved numerically each step.

| | |
|---|---|
| Files | `raw/wilson_2018_maximizing_acquisition/` (LaTeX) |

---

## Cost-aware, budgeted & stopping

### `lee2020` — Cost-aware Bayesian optimization

**Lee, Eriksson, Perrone & Seeger (2020).** *Cost-Aware Bayesian Optimization.* arXiv:2003.10870.

Critiques EI-per-second and proposes **cost-cooling**: annealed cost exponent so search favors cheap regions early and pure EI near budget exhaustion.

| | |
|---|---|
| Files | `raw/lee_2020_cost_aware_bo/` (LaTeX) |
| PDF | [arxiv.org/pdf/2003.10870](https://arxiv.org/pdf/2003.10870) |

### `astudillo2021` — Multi-step budgeted BO with unknown costs

**Astudillo, Jiang, Balandat, Bakshy & Frazier (2021).** *Multi-Step Budgeted Bayesian Optimization with Unknown Evaluation Costs.* NeurIPS. arXiv:2111.06537.

Non-myopic rollout under a fixed evaluation budget when per-point costs are unknown—goes beyond one-step EIpu weighting.

| | |
|---|---|
| Files | `raw/astudillo_2021_multi_step_budgeted_bo/` (LaTeX) |
| PDF | [arxiv.org/pdf/2111.06537](https://arxiv.org/pdf/2111.06537) |

### `lee2021` — Non-myopic BO with unknown costs (CMDP)

**Lee, Eriksson, Perrone & Seeger (2021).** *Nonmyopic Bayesian Optimization with Unknown Costs.* UAI.

Formulates cost-constrained BO as a CMDP and derives non-myopic policies when evaluation costs are uncertain.

| | |
|---|---|
| Files | `raw/lee_2021_nonmyopic_cost_constrained_bo/` (LaTeX) |
| Proceedings | [proceedings.mlr.press/v161/lee21a.html](https://proceedings.mlr.press/v161/lee21a.html) |

### `lam2016` — Finite-budget BO via approximate dynamic programming

**Lam, Willcox & Wolpert (2016).** *Bayesian Optimization with a Finite Budget: An Approximate Dynamic Programming Approach.* NeurIPS 29:883–891.

Casts finite-evaluation BO as dynamic programming and uses rollout heuristics to approximate the optimal measurement policy under a hard budget.

| | |
|---|---|
| Files | `raw/lam2016/` (PDF) |
| PDF | [kiwi.oden.utexas.edu/.../Lam-Willcox-Wolpert.pdf](https://kiwi.oden.utexas.edu/papers/Bayesian-optimization-finite-budget-Lam-Willcox-Wolpert.pdf) |
| Proceedings | [papers.nips.cc/paper/6188-...](https://papers.nips.cc/paper/6188-bayesian-optimization-with-a-finite-budget-an-approximate-dynamic-programming-approach) |

### `xie2025` — Cost-aware stopping for BO

**Xie, Cai, Terenin, Frazier & Scully (2025).** *Cost-aware Stopping for Bayesian Optimization.* ICML (submitted).

When to **stop** optimizing under heterogeneous evaluation costs—not just where to sample next—using cost-aware regret and stopping criteria.

| | |
|---|---|
| Files | `raw/2025_cost_aware_stopping_bo/` (LaTeX) |

---

## Multi-fidelity & related

### `kandasamy2017` — Multi-fidelity BO with continuous approximations

**Kandasamy et al. (2017).** *Multi-fidelity Bayesian Optimisation with Continuous Approximations.* ICML.

Models cheap approximations (e.g. low-fidelity simulators) jointly with the target fidelity via continuous fidelity indexing and multi-fidelity acquisition.

| | |
|---|---|
| Files | `raw/kandasamy_2017_boca/` (LaTeX) |
