---
title: Predictive Entropy Search
slug: predictive-entropy-search
tags: [acquisition, information-theoretic, lookahead]
requires: [problem-setup, gaussian-process-regression, acquisition-functions, entropy-search]
sources: [hernandez2014, hennig2012]
---

# Predictive Entropy Search

Predictive entropy search (PES) is a cheaper reformulation of [[entropy-search|entropy
search]] (ES): it keeps the same objective — learning where the global maximizer $x^*$ is —
but reorders the computation using the **symmetry of mutual information**, trading the
expensive entropy computation over the $d$-dimensional optimum location for two entropy
computations over the 1-dimensional observation $y$. It is the one-step
[[value-of-information|value-of-information]] rule under the utility $u(\mathcal D) =
-H(p_\star(\cdot\mid\mathcal D))$, identical to ES in objective and in interpretation,
differing only in which direction the mutual information is decomposed. Symbols (including
$p_\star$, $H$, $I$) follow [[notation]].

## The MI-symmetry reformulation

[[entropy-search|ES]] writes the acquisition as the expected reduction in entropy of
$p_\star$:

$$
\alpha_{\mathrm{ES},n}(x)
= H\!\big(p_\star(\cdot\mid\mathcal D_n)\big) - E_{y\mid x,\mathcal D_n}\!\Big[\,H\!\big(p_\star(\cdot\mid\mathcal D_n\cup\{(x,y)\})\big)\,\Big].
$$

This equals the mutual information $I(x^*;\,y\mid x,\mathcal D_n)$: the information a single
observation $y$ at $x$ conveys about the optimum location $x^*$. Because mutual information is
**symmetric**, $I(x^*;y\mid x,\mathcal D_n) = I(y;x^*\mid x,\mathcal D_n)$, so the same
quantity admits a second decomposition — one in which the roles of $x^*$ and $y$ are swapped:

$$
\boxed{
\alpha_{\mathrm{PES},n}(x)
= H\!\big(p(y\mid x,\mathcal D_n)\big)
- E_{p_\star(\cdot\mid\mathcal D_n)}\!\Big[\,H\!\big(p(y\mid x,\mathcal D_n,x^*)\big)\,\Big].
}
\tag{PES}
$$

Both terms now involve the **entropy of the scalar observation** $y$, not the entropy of the
$d$-dimensional distribution $p_\star$. This is the structural win: the ES direction requires
computing and updating an entropy over a distribution on $\mathbb{R}^d$, which ES handles with
an expensive discretize-then-EP pipeline; the PES direction requires only entropies of
univariate Gaussians (or Gaussian approximations thereof), which are either analytic or cheap
to approximate. PES and ES are mathematically equal objectives; their inequality is
computational.

The first term in (PES) is the entropy of the predictive distribution for $y$ ignoring any
knowledge of $x^*$: under the Gaussian noise model and Gaussian process posterior,
$p(y\mid x,\mathcal D_n)=\mathrm{Normal}(\mu_n(x),\,\sigma_n^2(x)+\lambda)$, giving

$$
H\!\big(p(y\mid x,\mathcal D_n)\big) = \tfrac{1}{2}\log\!\big[2\pi e\,(\sigma_n^2(x)+\lambda)\big].
$$

This is exact and cheap. The second term averages, over draws $x^{*(i)}\sim p_\star(\cdot\mid\mathcal D_n)$,
the entropy of $p(y\mid x,\mathcal D_n,x^{*(i)})$ — the observation's predictive distribution
**after additionally conditioning on the location of the global maximizer** — which requires
approximation.

## Sampling $x^*$: spectral posterior-function sampling

The expectation over $p_\star$ in (PES) is approximated by Monte Carlo:

$$
E_{p_\star}\!\Big[\,H\!\big(p(y\mid x,\mathcal D_n,x^*)\big)\,\Big]
\;\approx\;
\frac{1}{M}\sum_{i=1}^M H\!\big(p(y\mid x,\mathcal D_n,x^{*(i)})\big),
$$

where each $x^{*(i)}$ is an approximate draw from $p_\star(\cdot\mid\mathcal D_n)$
(`hernandez2014`, §3.2). Drawing directly from $p_\star$ is intractable; PES uses a
**spectral approximation** identical in spirit to [[thompson-sampling-bo|Thompson sampling]]
(`hernandez2014`, §3.2; Rahimi & Recht 2007):

1. For a shift-invariant kernel $k$, Bochner's theorem guarantees a spectral density $s(w)$.
   Draw $m$ frequency–phase pairs $(w_j, b_j)$ from the associated normalized density; form the
   random feature map

   $$
   \phi(x) = \sqrt{2\sigma_f^2/m}\,\cos(W x + b),
   $$

   where $W,b$ stack the $m$ draws and $\sigma_f^2$ is the kernel output scale (signal
   variance; see [[notation]]).

2. Approximate the GP prior by the linear model $f(x) = \phi(x)^\mathsf{T}\theta$,
   $\theta\sim\mathrm{Normal}(0,I)$. Conditioning on $\mathcal D_n$ gives the Gaussian
   posterior $\theta\mid\mathcal D_n\sim\mathrm{Normal}(A^{-1}\Phi^\mathsf{T}y_n,\,\lambda A^{-1})$
   with $A=\Phi^\mathsf{T}\Phi+\lambda I$.

3. Draw $\theta^{(i)}$ from this posterior and maximize $f^{(i)}(x)=\phi(x)^\mathsf{T}\theta^{(i)}$
   to obtain $x^{*(i)} = \operatorname*{arg\,max}_{x\in A} f^{(i)}(x)$.

Because $f^{(i)}$ is an analytic function with a finite parameterization, this maximization is
a standard continuous optimization. PES is thus using Thompson-sampling-style posterior-function
draws not as the acquisition itself but as a tractable device for sampling from $p_\star$.

> **Exact vs. approximate.** The spectral feature expansion is an approximation to the GP; the
> resulting $x^{*(i)}$ are only approximately distributed according to $p_\star$. The
> approximation improves as $m$ grows, at cost $\mathcal O(n^2 m)$ for early iterations
> (`hernandez2014`, §3.2). This source of approximation is separate from the EP approximation
> below.

## Approximating $p(y\mid x,\mathcal D_n,x^*)$: constraints and EP

For each sampled $x^{*(i)}$, PES must evaluate $H[p(y\mid x,\mathcal D_n,x^{*(i)})]$.
Because $y$ is Gaussian given $f(x)$, this entropy equals

$$
H\!\big(p(y\mid x,\mathcal D_n,x^{*(i)})\big) \approx \tfrac{1}{2}\log\!\big[2\pi e\,(v_n(x\mid x^{*(i)})+\lambda)\big],
$$

where $v_n(x\mid x^{*(i)})$ is the **posterior predictive variance of $f(x)$ after additionally
imposing that $x^{*(i)}$ is the global maximizer**. This conditional variance is intractable
because requiring $x^{*(i)}$ to be the global maximizer imposes the infinite family of
constraints $f(x^{*(i)})\ge f(z)$ for all $z\in A$. PES imposes three simplified constraints
and handles their non-Gaussianity via EP (`hernandez2014`, §3.1):

**C1 — $x^{*(i)}$ is a local maximum.** Two sub-constraints:
- C1.1: gradient zero at $x^{*(i)}$: $\nabla f(x^{*(i)})=0$, and off-diagonal Hessian zero:
  $\mathrm{upper}[\nabla^2 f(x^{*(i)})]=0$. These are analytic/linear constraints, incorporated
  exactly by conditioning the GP on derivative observations (Solak et al. 2003).
- C1.2: diagonal Hessian entries negative: $[\nabla^2 f(x^{*(i)})]_{ii}<0$ for each $i$.
  These are non-Gaussian inequality constraints; each is approximated by a Gaussian factor via EP.

**C2 — $f(x^{*(i)})$ exceeds past observations.** The hard constraint
$f(x^{*(i)})\ge f(x_j)$ for all $j\le n$ is replaced by the soft constraint
$f(x^{*(i)}) > y_{\max}+\varepsilon$ with $\varepsilon\sim\mathrm{Normal}(0,\lambda)$,
where $y_{\max}=\max_j y_j$. After marginalizing $\varepsilon$, this yields a Gaussian CDF
factor on $f(x^{*(i)})$, again approximated by EP.

**C3 — $f(x)$ is smaller than $f(x^{*(i)})$.** Only the local constraint $f(x)<f(x^{*(i)})$
is imposed, not the global $f(x^{*(i)})\ge f(z)$ for all $z$. Combined with the EP
approximation from C1–C2, this yields a truncated Gaussian approximation for $f(x)\mid\mathcal
D_n,C1,C2,C3$ with variance

$$
v_n(x\mid x^*)
= [V_f]_{1,1}
- s^{-1}\beta(\beta+\alpha)\{[V_f]_{1,1}-[V_f]_{1,2}\}^2,
$$

where $s=[-1,1]^\mathsf{T}V_f[-1,1]$, $\alpha=\mu/\sqrt{s}$,
$\mu=[-1,1]^\mathsf{T}m_f$, $\beta=\varphi(\alpha)/\Phi(\alpha)$,
and $(m_f,V_f)$ is the joint posterior mean and covariance of $[f(x),f(x^*)]$
(`hernandez2014`, eq. 6).

> **Remark — constraint relaxations are where exactness ends.** C1.1 is exact given the GP
> derivative model. C1.2, C2, and C3 are all relaxations or approximations: the global
> constraint $f(x^*)\ge f(z)\;\forall z$ is replaced by C3's local version; the hard
> ordering is softened in C2; and EP replaces non-Gaussian factors by matched Gaussians.
> Each relaxation introduces error with no known bound. The authors acknowledge numerical
> instability in $v_n(x\mid x^*)$ when $x\approx x^*$ and apply a heuristic regularization
> (scaling $[V_f]_{1,2}$ by the largest $\kappa\in[0,1]$ keeping $s>10^{-10}$), a patch that
> has no principled justification (`hernandez2014`, §3.1).

## The full acquisition: hyperparameter marginalization

PES takes a fully Bayesian treatment of kernel hyperparameters $\psi$ (kernel parameters plus
noise variance $\lambda$). Drawing $M$ samples $\psi^{(i)}\sim p(\psi\mid\mathcal D_n)$ by
slice sampling, and pairing each with one draw $x^{*(i)}\sim p_\star(\cdot\mid\mathcal
D_n,\psi^{(i)})$, the acquisition becomes (`hernandez2014`, eq. 8):

$$
\alpha_{\mathrm{PES},n}(x)
= \frac{1}{M}\sum_{i=1}^M\!
\left\{\,
\tfrac{1}{2}\log\!\big[v_n^{(i)}(x)+\lambda\big]
\;-\;
\tfrac{1}{2}\log\!\big[v_n^{(i)}(x\mid x^{*(i)})+\lambda\big]
\right\},
$$

where $v_n^{(i)}(x)$ and $v_n^{(i)}(x\mid x^{*(i)})$ are the predictive variances under
hyperparameter sample $\psi^{(i)}$. The $\frac{1}{2}\log(2\pi e)$ constants cancel and are
omitted. The precomputations (GP conditioning on C1.1, EP for C1.2 and C2) are independent of
$x$ and are done once per $(i)$ at cost $\mathcal O[M(n+d+d(d-1)/2)^3]$; each subsequent
$\alpha_{\mathrm{PES},n}(x)$ query then costs $\mathcal O[M(n+d+d(d-1)/2)]$.

## Relation to other notes

- **[[entropy-search|ES]] — same target, different direction.** ES and PES maximize the same
  objective $I(x^*;y\mid x,\mathcal D_n)$ and share the $p_\star$ target. ES decomposes as
  $H(p_\star^n) - E_y[H(p_\star^{n+1})]$, requiring an entropy over the $d$-dimensional
  $p_\star$ and a full discretize → EP → innovation pipeline. PES swaps the decomposition to
  entropies over the scalar $y$, replacing the representer-point grid and $p_\star$-EP with
  spectral posterior sampling and a per-$x^*$ EP. PES is cheaper per evaluation and
  tractably marginalizes over hyperparameters; ES computes the same quantity exactly under a fixed
  discretization and fixed hyperparameters.

- **[[max-value-entropy-search|MES]] — switch the target.** MES replaces the location target
  $x^*$ with the max-value target $f^*=f(x^*)$: it computes $I(f^*;y\mid x,\mathcal D_n)$,
  i.e. information about the scalar optimum *value* rather than its $d$-dimensional *location*.
  Because $f^*$ is 1-D, MES avoids the spectral sampling and C1–C3 machinery entirely and
  admits a near-closed-form acquisition. Same VoI template; different random quantity; much
  cheaper.

- **[[thompson-sampling-bo|Thompson sampling]] — PES borrows its sampling strategy.** TS
  draws $x_{n+1}\sim p_\star(\cdot\mid\mathcal D_n)$ by the exact spectral procedure PES uses
  to sample $x^{*(i)}$: draw a random-feature posterior function, maximize it. PES reuses this
  draw not as the next query but as a Monte Carlo estimate of the $E_{p_\star}[\cdot]$ term in
  (PES). The posterior-function sampling is the common algorithmic substrate; PES wraps it in an
  additional EP computation and entropy difference, and therefore returns a deterministic (in
  expectation) acquisition surface rather than a random query.

- **[[knowledge-gradient|KG]] — same template, different utility.** KG uses $u=\mu_n^*$
  (best posterior-mean value) rather than $u=-H(p_\star)$. Both are nonlocal one-step VoI rules
  that credit samples for reshaping beliefs away from the sample site; they differ in *what
  aspect* of the optimum they sharpen.

- **[[expected-improvement|EI]] / [[probability-of-improvement|PI]] — the local foils.** EI
  and PI read only the marginal $\mathrm{Normal}(\mu_n(x),\sigma_n^2(x))$ and cannot credit a
  sample for its nonlocal effect on $p_\star$. PES and ES are built around that nonlocal
  effect — their acquisition values at $x$ depend on how conditioning on $y$ at $x$ reshapes
  the *entire* posterior over $f$.

## Crosswalk

`hernandez2014` (Hernández-Lobato, Hoffman & Ghahramani, NIPS 2014) introduces PES. It
minimizes and works over the minimizer; all sign conventions are flipped to match our maximize
convention. `hennig2012` (Hennig & Schuler, JMLR 2012) is the ES parent; PES inherits its
$p_\star$ target and cites it as the motivation for the information-theoretic objective.

| This note (canonical, maximize) | `hernandez2014` (minimize) | Note |
|---|---|---|
| $x^*\in\operatorname*{arg\,max}f$ | $\mathbf x_{\mathrm{opt}}\in\arg\min f$ | sign flip; ES/PES logic is sign-agnostic |
| $p_\star(x\mid\mathcal D_n)$ | $p(\mathbf x_{\mathrm{opt}}\mid\mathcal D_n)$ | same object, opposite sense |
| $\lambda$ (noise variance) | $\sigma^2$ | see [[notation]] |
| $\mu_n(x),\,\sigma_n^2(x)$ | $m_n(\mathbf x)$, $v_n(\mathbf x)$ | GP posterior mean/variance (eq. gpvar) |
| $v_n(x\mid x^*)$ | $v_n(\mathbf x\mid\mathbf x_{\mathrm{opt}})$ | conditional predictive variance (eq. 6) |
| $\varphi,\,\Phi$ (std-normal pdf/cdf) | $\phi(\cdot),\,\Phi(\cdot)$ | wiki uses $\varphi$ for the pdf (see [[notation]]); $\phi$ is reserved here for the feature map |
| $\alpha_{\mathrm{PES},n}(x)$ | $\alpha_n(\mathbf x)$, eqs. 2 and 8 | marginalized form eq. 8 is the actual implementation |
| spectral features $\phi(x)^\mathsf{T}\theta$ | $\boldsymbol\phi(\mathbf x)^\mathsf{T}\boldsymbol\theta$ | random Fourier features (Rahimi & Recht 2007) |
| EP approximation $q(z)$ | $q(\mathbf z)$ (eqs. 3–4, Appendix A) | Gaussian approximation to $p(z\mid\mathcal D_n,C1,C2)$ |
| $\mathbf{E},\mathbf{V},\mathbf{R}$ (vectors/matrices) | $\mathbf{E},\mathbb{V},\mathbb{R}$ (macros) | paper bold-vectors via `\vE,\vV,\vR`; expand to plain bold |
