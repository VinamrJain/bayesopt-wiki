# Core References — Central Ideas (EI & Cost-Aware EI)

Concise "what it contributes" for each canonical work. Download links in `references.md`.

## Expected Improvement

**Mockus (1978), *The Application of Bayesian Methods for Seeking the Extremum*.**
Origin of the improvement-based acquisition idea. Frames optimization as a sequential Bayesian decision and proposes maximizing expected improvement over the current best under a Gaussian (Wiener/GP) prior. The conceptual seed; little used directly today but the cited source of EI.

**Jones, Schonlau & Welch (1998), *Efficient Global Optimization of Expensive Black-Box Functions* (EGO).** *J. Global Optim.*
The canonical, most-cited EI paper. Fits a kriging (GP) surrogate to expensive deterministic functions and derives the **closed-form EI** $\Delta\Phi(z)+\sigma\varphi(z)$, showing it balances exploiting low predicted values against exploring high-uncertainty regions. Establishes the surrogate-then-EI loop ("EGO") that essentially defines modern BO. Read for the original derivation and the explore/exploit reading.

**Shahriari, Swersky, Wang, Adams & de Freitas (2016), *Taking the Human Out of the Loop: A Review of Bayesian Optimization*.** *Proc. IEEE.*
The standard survey. Places EI within the broader acquisition family (PI, UCB/GP-UCB, Thompson, entropy search, knowledge gradient), covers GP modeling choices, and gives motivation/context. Best single reference for the landscape rather than a single derivation.

**Frazier (2018), *A Tutorial on Bayesian Optimization*.** arXiv.
Cleanest modern pedagogical derivation. Presents the GP posterior, the EI integral, and the closed form with the maximization convention used in these notes, and explicitly frames EI as the **one-step-optimal (myopic) value-of-information** rule, linking it to Knowledge Gradient. The recommended first read alongside EGO.

## Cost-Aware EI

**Snoek, Larochelle & Adams (2012), *Practical Bayesian Optimization of Machine Learning Algorithms*.** NeurIPS.
Introduces **EI per second (EIpu)**: divide EI by a modeled evaluation cost, $\mathrm{EI}(x)/c(x)$, using a *second GP on $\log$-duration* to predict cost. Motivated by hyperparameter tuning where different configs take vastly different wall-clock time. Also popularized integrating out GP hyperparameters and handling parallel/pending evaluations. The origin of cost-aware acquisition.

**Lee, Eriksson, Perrone & Seeger (2020), *Cost-Aware Bayesian Optimization*.**
Formalizes cost-weighted acquisition and diagnoses EIpu's weaknesses: the fixed $1/c$ penalty over-prefers cheap regions and ignores remaining budget. Proposes **cost-cooling** — an annealed exponent $\mathrm{EI}(x)/c(x)^{\alpha_t}$ with $\alpha_t:1\!\to\!0$ as budget is spent — so the search chases cheap gains early and pure EI late. Read for the principled critique and fix.

**Astudillo, Jiang, Balandat, Bakshy & Frazier (2021), *Multi-Step Budgeted Bayesian Optimization with Unknown Evaluation Costs*.** NeurIPS.
Goes beyond myopic cost weighting: treats heterogeneous, unknown costs under an explicit total budget and plans **multiple steps ahead** (non-myopic, budget-constrained rollout). The reference for why one-step EIpu is suboptimal and what a fully budget-aware objective looks like.
