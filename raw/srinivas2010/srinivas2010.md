---
citation_key: srinivas2010
source_type: pdf-derived
warning: >
  Parsed from PDF (not original LaTeX). Equations may contain parsing artifacts;
  verify against the PDF before citing verbatim in proofs.
original_pdf: srinivas2010.pdf
title: Gaussian Process Optimization in the Bandit Setting: No Regret and Experimental Design
authors: Srinivas, Krause, Kakade & Seeger (2010)
venue: ICML 2010; arXiv:0912.3995
---

# Gaussian Process Optimization in the Bandit Setting: No Regret and Experimental Design

> **PDF-derived source.** Not original tex. Treat equations with caution.

## Gaussian Process Optimization in the Bandit Setting: No Regret and Experimental Design



Niranjan Srinivas
California Institute of Technology
```
       niranjan@caltech.edu

```

Sham M. Kakade
University of Pennsylvania
```
     skakade@wharton.upenn.edu

```

**Abstract**


Many applications require optimizing an unknown, noisy function that is expensive to
evaluate. We formalize this task as a multiarmed bandit problem, where the payoff function
is either sampled from a Gaussian process (GP)
or has low RKHS norm. We resolve the important open problem of deriving regret bounds for
this setting, which imply novel convergence rates
for GP optimization. We analyze GP-UCB, an
intuitive upper-confidence based algorithm, and
bound its cumulative regret in terms of maximal
information gain, establishing a novel connection
between GP optimization and experimental design. Moreover, by bounding the latter in terms
of operator spectra, we obtain explicit sublinear
regret bounds for many commonly used covariance functions. In some important cases, our
bounds have surprisingly weak dependence on
the dimensionality. In our experiments on real
sensor data, GP-UCB compares favorably with
other heuristical GP optimization approaches.


**1. Introduction**


In most stochastic optimization settings, evaluating
the unknown function is expensive, and sampling
is to be minimized. Examples include choosing
advertisements in sponsored search to maximize
profit in a click-through model (Pandey & Olston,
2007) or learning optimal control strategies for robots
(Lizotte et al., 2007). Predominant approaches
to this problem include the multi-armed bandit
paradigm (Robbins, 1952), where the goal is to
maximize cumulative reward by optimally balancing
exploration and exploitation, and experimental design
(Chaloner & Verdinelli, 1995), where the function
is to be explored globally with as few evaluations
as possible, for example by maximizing information


1 This is the longer version of our paper in ICML 2010;
see Srinivas et al. (2010)



Andreas Krause
California Institute of Technology

```
    krausea@caltech.edu

```

Matthias Seeger
Saarland University
```
 mseeger@mmci.uni-saarland.de

```

gain. The challenge in both approaches is twofold: we
have to estimate an unknown function _f_ from noisy
samples, and we must optimize our estimate over some
high-dimensional input space. For the former, much
progress has been made in machine learning through
kernel methods and Gaussian process (GP) models
(Rasmussen & Williams, 2006), where smoothness
assumptions about _f_ are encoded through the choice
of kernel in a flexible nonparametric fashion. Beyond
Euclidean spaces, kernels can be defined on diverse
domains such as spaces of graphs, sets, or lists.


We are concerned with GP optimization in the multiarmed bandit setting, where _f_ is sampled from a GP
distribution or has low “complexity” measured in
terms of its RKHS norm under some kernel. We provide the first sublinear regret bounds in this nonparametric setting, which imply convergence rates for GP
optimization. In particular, we analyze the Gaussian
Process Upper Confidence Bound (GP-UCB) algorithm, a simple and intuitive Bayesian method (Auer
et al., 2002; Auer, 2002; Dani et al., 2008). While
objectives are different in the multi-armed bandit
and experimental design paradigm, our results draw
a close technical connection between them: our regret
bounds come in terms of an _information gain_ quantity,
measuring how fast _f_ can be learned in an information
theoretic sense. The submodularity of this function
allows us to prove sharp regret bounds for particular
covariance functions, which we demonstrate for commonly used Squared Exponential and Mat´ern kernels.


**Related Work.** Our work generalizes stochastic
_linear_ optimization in a bandit setting, where the
unknown function comes from a finite-dimensional
linear space. GPs are nonlinear random functions,
which can be represented in an infinite-dimensional
linear space. For the standard linear setting, Dani
et al. (2008) provide a near-complete characterization
1


(also see Auer 2002; Dani et al. 2007; Abernethy et al.
2008; Rusmevichientong & Tsitsiklis 2008), explicitly
dependent on the dimensionality. In the GP setting,
the challenge is to characterize complexity in a different manner, through properties of the kernel function.
Our technical contributions are twofold: first, we
show how to analyze the nonlinear setting by focusing
on the concept of information gain, and second, we
explicitly bound this information gain measure using
the concept of submodularity (Nemhauser et al.,
1978) and knowledge about kernel operator spectra.


Kleinberg et al. (2008) provide regret bounds under weaker and less configurable assumptions (only
Lipschitz-continuity w.r.t. a metric is assumed;
Bubeck et al. 2008 consider arbitrary topological
spaces), which however degrade rapidly with the di_d_ +1
mensionality of the problem (Ω( _T_ _d_ +2 )). In practice,
linearity w.r.t. a fixed basis is often too stringent
an assumption, while Lipschitz-continuity can be too
coarse-grained, leading to poor rate bounds. Adopting
GP assumptions, we can model levels of smoothness in
a fine-grained way. For example, our rates for the frequently used Squared Exponential kernel, enforcing a
high degree of smoothness, have weak dependence on
the dimensionality: _O_ (� _T_ (log _T_ ) _[d]_ [+1] ) (see Fig. 1).


There is a large literature on GP (response surface)
optimization. Several heuristics for trading off exploration and exploitation in GP optimization have been
proposed (such as Expected Improvement, Mockus
et al. 1978, and Most Probable Improvement, Mockus
1989) and successfully applied in practice ( _c.f._, Lizotte
et al. 2007). Brochu et al. (2009) provide a comprehensive review of and motivation for Bayesian optimization using GPs. The Efficient Global Optimization
(EGO) algorithm for optimizing expensive black-box
functions is proposed by Jones et al. (1998) and extended to GPs by Huang et al. (2006). Little is known
about theoretical performance of GP optimization.
While convergence of EGO is established by Vazquez
& Bect (2007), convergence rates have remained elusive. Gr¨unew¨alder et al. (2010) consider the pure exploration problem for GPs, where the goal is to find the
optimal decision over _T_ rounds, rather than maximize
cumulative reward (with no exploration/exploitation
dilemma). They provide sharp bounds for this exploration problem. Note that this methodology would not
lead to bounds for minimizing the cumulative regret.
Our cumulative regret bounds translate to the first
performance guarantees (rates) for GP optimization.


**Summary.** Our main contributions are:


_•_ We analyze GP-UCB, an intuitive algorithm for
GP optimization, when the function is either sam

|Kernel|Linear|RBF<br>￿|Matérn|
|---|---|---|---|
|_ Regret RT_|_d_<br>_√_<br>_T_|_T_(log_ T_)_d_+1|_T_<br>_ν_+_d_(_d_+1)<br>~~2~~_ν_~~+~~_d_~~(~~_d_~~+1)~~|



_Figure 1._ Our regret bounds (up to polylog factors) for linear, radial basis, and Mat´ern kernels — _d_ is the dimension,
_T_ is the time horizon, and _ν_ is a Mat´ern parameter.


pled from a known GP, or has low RKHS norm.


_•_ We bound the cumulative regret for GP-UCB in
terms of the information gain due to sampling,
establishing a novel connection between experimental design and GP optimization.


_•_ By bounding the information gain for popular
classes of kernels, we establish sublinear regret
bounds for GP optimization for the first time.
Our bounds depend on kernel choice and parameters in a fine-grained fashion.


_•_ We evaluate GP-UCB on sensor network data,
demonstrating that it compares favorably to existing algorithms for GP optimization.


**2. Problem Statement and Background**


Consider the problem of sequentially optimizing an unknown reward function _f_ : _D →_ R: in each round _t_, we
choose a point _**x**_ _t_ _∈_ _D_ and get to see the function value
there, perturbed by noise: _y_ _t_ = _f_ ( _**x**_ _t_ )+ _ϵ_ _t_ . Our goal is
to maximize the sum of rewards [�] _[T]_ _t_ =1 _[f]_ [(] _**[x]**_ _[t]_ [), thus to]
perform essentially as well as _**x**_ _[∗]_ = argmax _**x**_ _∈D_ _f_ ( _**x**_ )
(as rapidly as possible). For example, we might want
to find locations of highest temperature in a building
by sequentially activating sensors in a spatial network
and regressing on their measurements. _D_ consists of
all sensor locations, _f_ ( _**x**_ ) is the temperature at _**x**_, and
sensor accuracy is quantified by the noise variance.
Each activation draws battery power, so we want to
sample from as few sensors as possible.


**Regret.** A natural performance metric in this context is cumulative regret, the loss in reward due to not
knowing _f_ ’s maximum points beforehand. Suppose
the unknown function is _f_, its maximum point [1]

_**x**_ _[∗]_ = argmax _**x**_ _∈D_ _f_ ( _**x**_ ). For our choice _**x**_ _t_ in round
_t_, we incur instantaneous regret _r_ _t_ = _f_ ( _**x**_ _[∗]_ ) _−_ _f_ ( _**x**_ _t_ ).
The _cumulative regret R_ _T_ after _T_ rounds is the sum
of instantaneous regrets: _R_ _T_ = [�] _[T]_ _t_ =1 _[r]_ _[t]_ [. A desirable]
asymptotic property of an algorithm is to be _no-regret_ :
lim _T →∞_ _R_ _T_ _/T_ = 0 _._ Note that neither _r_ _t_ nor _R_ _T_ are
ever revealed to the algorithm. Bounds on the average
regret _R_ _T_ _/T_ translate to convergence rates for GP
optimization: the maximum max _t≤T_ _f_ ( _**x**_ _t_ ) in the first
_T_ rounds is no further from _f_ ( _**x**_ _[∗]_ ) than the average.


1 _∗_ _∗_
_**x**_ need not be unique; only _f_ ( _**x**_ ) occurs in the regret.
















**2.1. Gaussian Processes and RKHS’s**


**Gaussian Processes.** Some assumptions on _f_ are
required to guarantee no-regret. While rigid parametric assumptions such as linearity may not hold in practice, a certain degree of smoothness is often warranted.
In our sensor network, temperature readings at closeby
locations are highly correlated (see Figure 2(a)). We
can enforce implicit properties like smoothness without relying on any parametric assumptions, modeling
_f_ as a sample from a _Gaussian process_ (GP): a collection of dependent random variables, one for each
_**x**_ _∈_ _D_, every finite subset of which is multivariate
Gaussian distributed in an overall consistent way (Rasmussen & Williams, 2006). A _GP_ ( _µ_ ( _**x**_ ) _, k_ ( _**x**_ _,_ _**x**_ _[′]_ )) is
specified by its mean function _µ_ ( _**x**_ ) = E[ _f_ ( _**x**_ )] and
covariance (or kernel) function _k_ ( _**x**_ _,_ _**x**_ _[′]_ ) = E[( _f_ ( _x_ ) _−_
_µ_ ( _**x**_ ))( _f_ ( _x_ _[′]_ ) _−_ _µ_ ( _**x**_ _[′]_ ))]. For GPs not conditioned on
data, we assume [2] that _µ ≡_ 0. Moreover, we restrict
_k_ ( _**x**_ _,_ _**x**_ ) _≤_ 1, _**x**_ _∈_ _D_, i.e., we assume bounded variance.
By fixing the correlation behavior, the covariance function _k_ encodes smoothness properties of sample functions _f_ drawn from the GP. A range of commonly used
kernel functions is given in Section 5.2.


In this work, GPs play multiple roles. First, some of
our results hold when the unknown target function is a
sample from a known GP distribution GP(0 _, k_ ( _**x**_ _,_ _**x**_ _[′]_ )).
Second, the Bayesian algorithm we analyze generally
uses GP(0 _, k_ ( _**x**_ _,_ _**x**_ _[′]_ )) as prior distribution over _f_ . A
major advantage of working with GPs is the existence of simple analytic formulae for mean and covariance of the posterior distribution, which allows
easy implementation of algorithms. For a noisy sample _**y**_ _T_ = [ _y_ 1 _. . . y_ _T_ ] _[T]_ at points _A_ _T_ = _{_ _**x**_ 1 _, . . .,_ _**x**_ _T_ _}_,
_y_ _t_ = _f_ ( _**x**_ _t_ )+ _ϵ_ _t_ with _ϵ_ _t_ _∼_ _N_ (0 _, σ_ [2] ) i.i.d. Gaussian noise,
the posterior over _f_ is a GP distribution again, with
mean _µ_ _T_ ( _**x**_ ), covariance _k_ _T_ ( _**x**_ _,_ _**x**_ _[′]_ ) and variance _σ_ _T_ [2] [(] _**[x]**_ [):]
_µ_ _T_ ( _**x**_ ) = _**k**_ _T_ ( _**x**_ ) _[T]_ ( _**K**_ _T_ + _σ_ [2] _**I**_ ) _[−]_ [1] _**y**_ _T_ _,_ (1)

_k_ _T_ ( _**x**_ _,_ _**x**_ _[′]_ ) = _k_ ( _**x**_ _,_ _**x**_ _[′]_ ) _−_ _**k**_ _T_ ( _**x**_ ) _[T]_ ( _**K**_ _T_ + _σ_ [2] _**I**_ ) _[−]_ [1] _**k**_ _T_ ( _**x**_ _[′]_ ) _,_

_σ_ _T_ [2] [(] _**[x]**_ [) =] _[ k]_ _[T]_ [(] _**[x]**_ _[,]_ _**[ x]**_ [)] _[,]_ (2)


where _**k**_ _T_ ( _**x**_ ) = [ _k_ ( _**x**_ 1 _,_ _**x**_ ) _. . . k_ ( _**x**_ _T_ _,_ _**x**_ )] _[T]_ and _**K**_ _T_ is
the positive definite kernel matrix [ _k_ ( _**x**_ _,_ _**x**_ _[′]_ )] _**x**_ _,_ _**x**_ _′_ _∈A_ _T_ .


**RKHS.** Instead of the Bayes case, where _f_ is sampled from a GP prior, we also consider the more agnostic case where _f_ has low “complexity” as measured
under an RKHS norm (and distribution free assumptions on the noise process). The notion of _reproduc-_
_ing kernel Hilbert spaces_ (RKHS, Wahba 1990) is intimately related to GPs and their covariance functions _k_ ( _**x**_ _,_ _**x**_ _[′]_ ). The RKHS _H_ _k_ ( _D_ ) is a complete subspace of _L_ 2 ( _D_ ) of nicely behaved functions, with an


2 This is w.l.o.g. (Rasmussen & Williams, 2006).



inner product _⟨·, ·⟩_ _k_ obeying the reproducing property:
_⟨f, k_ ( _**x**_ _, ·_ ) _⟩_ _k_ = _f_ ( _**x**_ ) for all _f ∈H_ _k_ ( _D_ ). It is literally
constructed by completing the set of mean functions
_µ_ _T_ for all possible _T_, _{_ _**x**_ _t_ _}_, and _**y**_ _T_ . The induced
RKHS norm _∥f_ _∥_ _k_ = � _⟨f, f_ _⟩_ _k_ measures smoothness of

_f_ w.r.t. _k_ : in much the same way as _k_ 1 would generate
smoother samples than _k_ 2 as GP covariance functions,
_∥·∥_ _k_ 1 assigns larger penalties than _∥·∥_ _k_ 2 . _⟨·, ·⟩_ _k_ can be
extended to all of _L_ 2 ( _D_ ), in which case _∥f_ _∥_ _k_ _< ∞_ iff
_f ∈H_ _k_ ( _D_ ). For most kernels discussed in Section 5.2,
members of _H_ _k_ ( _D_ ) can uniformly approximate any
continuous function on any compact subset of _D_ .


**2.2. Information Gain & Experimental Design**


One approach to maximizing _f_ is to first choose
points _**x**_ _t_ so as to estimate the function globally
well, then play the maximum point of our estimate.
How can we learn about _f_ as rapidly as possible?
This question comes down to Bayesian Experimental
Design (henceforth “ED”; see Chaloner & Verdinelli
1995), where the informativeness of a set of sampling
points _A ⊂_ _D_ about _f_ is measured by the _information_
_gain_ (c.f., Cover & Thomas 1991), which is the mutual
information between _f_ and observations _**y**_ _A_ = _**f**_ _A_ + _ϵ_ _A_
at these points:


I( _**y**_ _A_ ; _f_ ) = H( _**y**_ _A_ ) _−_ H( _**y**_ _A_ _|f_ ) _,_ (3)


quantifying the reduction in uncertainty about _f_
from revealing _**y**_ _A_ . Here, _**f**_ _A_ = [ _f_ ( _**x**_ )] _**x**_ _∈A_ and
_**ε**_ _A_ _∼_ _N_ ( **0** _, σ_ [2] _**I**_ ). For a Gaussian, H( _N_ ( _**µ**_ _,_ **Σ** )) =
12 [log] _[ |]_ [2] _[πe]_ **[Σ]** _[|]_ [,] so that in our setting I( _**y**_ _A_ ; _f_ ) =
I( _**y**_ _A_ ; _**f**_ _A_ ) = 12 [log] _[ |]_ _**[I]**_ [ +] _[ σ]_ _[−]_ [2] _**[K]**_ _[A]_ _[|]_ [,] where _**K**_ _A_ =

[ _k_ ( _**x**_ _,_ _**x**_ _[′]_ )] _**x**_ _,_ _**x**_ _′_ _∈A_ . While finding the information gain
maximizer among _A ⊂_ _D_, _|A| ≤_ _T_ is NP-hard (Ko
et al., 1995), it can be approximated by an efficient
greedy algorithm. If _F_ ( _A_ ) = I( _**y**_ _A_ ; _f_ ), this algorithm
picks _**x**_ _t_ = argmax _**x**_ _∈D_ _F_ ( _A_ _t−_ 1 _∪{_ _**x**_ _}_ ) in round _t_, which
can be shown to be equivalent to


_**x**_ _t_ = argmax _σ_ _t−_ 1 ( _**x**_ ) _,_ (4)
_**x**_ _∈D_

where _A_ _t−_ 1 = _{_ _**x**_ 1 _, . . .,_ _**x**_ _t−_ 1 _}_ . Importantly, this
simple algorithm is guaranteed to find a near-optimal
solution: for the set _A_ _T_ obtained after _T_ rounds, we
have that


_F_ ( _A_ _T_ ) _≥_ (1 _−_ 1 _/e_ ) max (5)
_|A|≤T_ _[F]_ [(] _[A]_ [)] _[,]_

at least a constant fraction of the optimal information gain value. This is because _F_ ( _A_ ) satisfies
a diminishing returns property called _submodularity_
(Krause & Guestrin, 2005), and the greedy approximation guarantee (5) holds for any submodular function
(Nemhauser et al., 1978).


While sequentially optimizing Eq. 4 is a provably good
way to _explore f_ globally, it is not well suited for func

tion optimization. For the latter, we only need to identify points _**x**_ where _f_ ( _**x**_ ) is large, in order to concentrate sampling there as rapidly as possible, thus _exploit_
our knowledge about maxima. In fact, the ED rule
(4) does not even depend on observations _y_ _t_ obtained
along the way. Nevertheless, the maximum information gain after _T_ rounds will play a prominent role
in our regret bounds, forging an important connection
between GP optimization and experimental design.

**3. GP-UCB Algorithm**
For sequential optimization, the ED rule (4) can be
wasteful: it aims at decreasing uncertainty globally,
not just where maxima might be. Another idea is to
pick points as _**x**_ _t_ = argmax _**x**_ _∈D_ _µ_ _t−_ 1 ( _**x**_ ), maximizing
the expected reward based on the posterior so far.
However, this rule is too greedy too soon and tends
to get stuck in shallow local optima. A combined
strategy is to choose


_**x**_ _t_ = argmax _µ_ _t−_ 1 ( _**x**_ ) + _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ ) _,_ (6)
_**x**_ _∈D_


where _β_ _t_ are appropriate constants. This latter objective prefers both points _**x**_ where _f_ is uncertain (large
_σ_ _t−_ 1 ( _·_ )) and such where we expect to achieve high
rewards (large _µ_ _t−_ 1 ( _·_ )): it implicitly negotiates the
exploration–exploitation tradeoff. A natural interpretation of this sampling rule is that it greedily selects
points _**x**_ such that _f_ ( _**x**_ ) should be a reasonable upper
bound on _f_ ( _**x**_ _[∗]_ ), since the argument in (6) is an upper
quantile of the marginal posterior _P_ ( _f_ ( _**x**_ ) _|_ _**y**_ _t−_ 1 ). We
call this choice the _Gaussian process upper confidence_
_bound_ rule (GP-UCB), where _β_ _t_ is specified depending
on the context (see Section 4). Pseudocode for
the GP-UCB algorithm is provided in Algorithm 1.
Figure 2 illustrates two subsequent iterations, where
GP-UCB both explores (Figure 2(b)) by sampling an
input _**x**_ with large _σ_ _t_ [2] _−_ 1 [(] _**[x]**_ [) and exploits (Figure][ 2(c)][)]
by sampling _**x**_ with large _µ_ _t−_ 1 ( _**x**_ ).


The GP-UCB selection rule Eq. 6 is motivated by the
UCB algorithm for the classical multi-armed bandit
problem (Auer et al., 2002; Kocsis & Szepesv´ari,
2006). Among competing criteria for GP optimization
(see Section 1), a variant of the GP-UCB rule has
been demonstrated to be effective for this application
(Dorard et al., 2009). To our knowledge, strong
theoretical results of the kind provided for GP-UCB in
this paper have not been given for any of these search
heuristics. In Section 6, we show that in practice
GP-UCB compares favorably with these alternatives.


If _D_ is infinite, finding _**x**_ _t_ in (6) may be hard: the
upper confidence index is multimodal in general.
However, global search heuristics are very effective in
practice (Brochu et al., 2009). It is generally assumed



**Algorithm 1** The GP-UCB algorithm.

**Input:** Input space _D_ ; GP Prior _µ_ 0 = 0 _, σ_ 0 _, k_
**for** _t_ = 1 _,_ 2 _, . . ._ **do**



Choose _**x**_ _t_ = argmax _µ_ _t−_ 1 ( _**x**_ ) + �
_**x**_ _∈D_



_β_ _t_ _σ_ _t−_ 1 ( _**x**_ )



Sample _y_ _t_ = _f_ ( _**x**_ _t_ ) + _ϵ_ _t_
Perform Bayesian update to obtain _µ_ _t_ and _σ_ _t_
**end for**


that evaluating _f_ is more costly than maximizing the
UCB index.


UCB algorithms (and GP optimization techniques
in general) have been applied to a large number of
problems in practice (Kocsis & Szepesv´ari, 2006;
Pandey & Olston, 2007; Lizotte et al., 2007). Their
performance is well characterized in both the finite
arm setting and the linear optimization setting, but
no convergence rates for GP optimization are known.

**4. Regret Bounds**


We now establish cumulative regret bounds for GP
optimization, treating a number of different settings:
_f ∼_ GP(0 _, k_ ( _**x**_ _,_ _**x**_ _[′]_ )) for finite _D_, _f ∼_ GP(0 _, k_ ( _**x**_ _,_ _**x**_ _[′]_ ))
for general compact _D_, and the agnostic case of arbitrary _f_ with bounded RKHS norm.


GP optimization generalizes stochastic linear optimization, where a function _f_ from a finite-dimensional
linear space is optimized over. For the linear case, Dani
et al. (2008) provide regret bounds that explicitly depend on the dimensionality [3] _d_ . GPs can be seen as
random functions in some infinite-dimensional linear
space, so their results do not apply in this case. This
problem is circumvented in our regret bounds. The
quantity governing them is the _maximum information_
_gain γ_ _T_ after _T_ rounds, defined as:


_γ_ _T_ := max (7)
_A⊂D_ : _|A|_ = _T_ [I(] _**[y]**_ _[A]_ [;] _**[ f]**_ _[ A]_ [)] _[,]_


where I( _**y**_ _A_ ; _**f**_ _A_ ) = I( _**y**_ _A_ ; _f_ ) is defined in (3). Recall
1
that I( _**y**_ _A_ ; _**f**_ _A_ ) = 2 [log] _[ |]_ _**[I]**_ [ +] _[ σ]_ _[−]_ [2] _**[K]**_ _[A]_ _[|]_ [, where] _**[ K]**_ _[A]_ [ =]

[ _k_ ( _**x**_ _,_ _**x**_ _[′]_ )] _**x**_ _,_ _**x**_ _′_ _∈A_ is the covariance matrix of _**f**_ _A_ =

[ _f_ ( _**x**_ )] _**x**_ _∈A_ associated with the samples _A_ . Our regret
bounds are of the form _O_ _[∗]_ ( _[√]_ _Tβ_ _T_ _γ_ _T_ ), where _β_ _T_ is the
confidence parameter in Algorithm 1, while the bounds
of Dani et al. (2008) are of the form _O_ _[∗]_ ( _[√]_ _Tβ_ _T_ _d_ ) ( _d_
the dimensionality of the linear function space). Here
and below, the _O_ _[∗]_ notation is a variant of _O_, where
log factors are suppressed. While our proofs – all provided in the Appendix – use techniques similar to those
of Dani et al. (2008), we face a number of additional


3 In general, _d_ is the dimensionality of the input space
_D_, which in the finite-dimensional linear case coincides
with the feature space.


5


−1


−2


−3


−4


−5 −6 −4 −2 0 2 4 6


(c) _Iteration t_ + 1



25


20



40

15



5


−1


−2


−3


−4


−5 −6 −4 −2 0 2 4 6


(b) _Iteration t_





0













40 0


(a) _Temperature data_



_Figure 2._ (a) Example of temperature data collected by a network of 46 sensors at Intel Research Berkeley. (b,c) Two
iterations of the GP-UCB algorithm. It samples points that are either uncertain (b) or have high posterior mean (c).



significant technical challenges. Besides avoiding the
finite-dimensional analysis, we must handle confidence
issues, which are more delicate for nonlinear random
functions.


Importantly, note that the information gain is a problem dependent quantity — properties of both the kernel and the input space will determine the growth of
regret. In Section 5, we provide general methods for
bounding _γ_ _T_, either by efficient auxiliary computations or by direct expressions for specific kernels of
interest. Our results match known lower bounds (up
to log factors) in both the _K_ -armed bandit and the
_d_ -dimensional linear optimization case.


**Bounds for a GP Prior.** For finite _D_, we obtain
the following bound.



depending on choice and parameterization of _k_ (see
Section 5). In the following theorem, we generalize
our result to any compact and convex _D ⊂_ R _[d]_ under
mild assumptions on the kernel function _k_ .


**Theorem 2** _Let D ⊂_ [0 _, r_ ] _[d]_ _be compact and convex,_
_d ∈_ N _, r >_ 0 _. Suppose that the kernel k_ ( _**x**_ _,_ _**x**_ _[′]_ ) _satisfies_
_the following high probability bound on the derivatives_
_of GP sample paths f_ _: for some constants a, b >_ 0 _,_


Pr _{_ sup _**x**_ _∈D_ _|∂f/∂x_ _j_ _| > L} ≤_ _ae_ _[−]_ [(] _[L/b]_ [)] [2] _,_ _j_ = 1 _, . . ., d._


_Pick δ ∈_ (0 _,_ 1) _, and define_



**Theorem 1** _Let_ _δ_ _∈_ (0 _,_ 1) _and_ _β_ _t_ =
2 log( _|D|t_ [2] _π_ [2] _/_ 6 _δ_ ) _._ _Running GP-UCB with β_ _t_ _for_
_a sample f of a GP with mean function zero and_
_covariance function k_ ( _**x**_ _,_ _**x**_ _[′]_ ) _, we obtain a regret bound_
_of O_ _[∗]_ (� _Tγ_ _T_ log _|D|_ ) _with high probability. Precisely,_



_β_ _t_ = 2 log( _t_ [2] 2 _π_ [2] _/_ (3 _δ_ )) + 2 _d_ log � _t_ [2] _dbr_ ~~�~~ log(4 _da/δ_ )� _._


_Running the GP-UCB with β_ _t_ _for a sample f of a_
_GP with mean function zero and covariance function_
_k_ ( _**x**_ _,_ _**x**_ _[′]_ ) _, we obtain a regret bound of O_ _[∗]_ ( _[√]_ _dTγ_ _T_ ) _with_
_high probability. Precisely, with C_ 1 = 8 _/_ log(1 + _σ_ _[−]_ [2] )
_we have_



Pr � _R_ _T_ _≤_ �



_C_ 1 _Tβ_ _T_ _γ_ _T_ + 2 _∀T ≥_ 1 _≥_ 1 _−_ _δ._
�



Pr � _R_ _T_ _≤_ � _C_ 1 _Tβ_ _T_ _γ_ _T_ _∀T ≥_ 1� _≥_ 1 _−_ _δ._



_where C_ 1 = 8 _/_ log(1 + _σ_ _[−]_ [2] ) _._


The proof methodology follows Dani et al. (2007) in
that we relate the regret to the growth of the log
volume of the confidence ellipsoid — a novelty in our
proof is showing how this growth is characterized by
the information gain.


This theorem shows that, with high probability over
samples from the GP, the cumulative regret is bounded
in terms of the maximum information gain, forging a
novel connection between GP optimization and experimental design. This link is of fundamental technical
importance, allowing us to generalize Theorem 1 to
infinite decision spaces. Moreover, the submodularity
of I( _**y**_ _A_ ; _**f**_ _A_ ) allows us to derive sharp a priori bounds,



The main challenge in our proof (provided in the Appendix) is to lift the regret bound in terms of the
confidence ellipsoid to general _D_ . The smoothness
assumption on _k_ ( _**x**_ _,_ _**x**_ _[′]_ ) disqualifies GPs with highly
erratic sample paths. It holds for stationary kernels
_k_ ( _**x**_ _,_ _**x**_ _[′]_ ) = _k_ ( _**x**_ _−_ _**x**_ _[′]_ ) which are four times differentiable (Theorem 5 of Ghosal & Roy (2006)), such as the
Squared Exponential and Mat´ern kernels with _ν >_ 2
(see Section 5.2), while it is violated for the OrnsteinUhlenbeck kernel (Mat´ern with _ν_ = 1 _/_ 2; a stationary
variant of the Wiener process). For the latter, sample paths _f_ are nondifferentiable almost everywhere
with probability one and come with independent increments. We conjecture that a result of the form of
Theorem 2 does not hold in this case.


**Bounds for Arbitrary** _f_ **in the RKHS.** Thus far,
we have assumed that the target function _f_ is sampled


from a GP prior and that the noise is _N_ (0 _, σ_ [2] ) with
known variance _σ_ [2] . We now analyze GP-UCB in an
agnostic setting, where _f_ is an arbitrary function
from the RKHS corresponding to kernel _k_ ( _**x**_ _,_ _**x**_ _[′]_ ).
Moreover, we allow the noise variables _ε_ _t_ to be an arbitrary martingale difference sequence (meaning that
E[ _ε_ _t_ _|_ _**ε**_ _<t_ ] = 0 for all _t ∈_ N), uniformly bounded by _σ_ .
Note that we still run the same GP-UCB algorithm,
whose prior and noise model are misspecified in this
case. Our following result shows that GP-UCB attains
sublinear regret even in the agnostic setting.


**Theorem 3** _Let δ ∈_ (0 _,_ 1) _._ _Assume that the true_
_underlying f lies in the RKHS H_ _k_ ( _D_ ) _corresponding_
_to the kernel k_ ( _**x**_ _,_ _**x**_ _[′]_ ) _, and that the noise ε_ _t_ _has zero_
_mean conditioned on the history and is bounded by σ_
_almost surely. In particular, assume ∥f_ _∥_ [2] _k_ _[≤]_ _[B][ and]_
_let β_ _t_ = 2 _B_ + 300 _γ_ _t_ log [3] ( _t/δ_ ) _. Running GP-UCB with_
_β_ _t_ _, prior GP_ (0 _, k_ ( _**x**_ _,_ _**x**_ _[′]_ )) _and noise model N_ (0 _, σ_ [2] ) _,_
_we obtain a regret bound of O_ _[∗]_ ( _√T_ ( _B_ _[√]_ ~~_γ_~~ _T_ + _γ_ _T_ )) _with_

_high probability (over the noise). Precisely,_



Pr � _R_ _T_ _≤_ �



_C_ 1 _Tβ_ _T_ _γ_ _T_ _∀T ≥_ 1 _≥_ 1 _−_ _δ,_
�



_where C_ 1 = 8 _/_ log(1 + _σ_ _[−]_ [2] ) _._


Note that while our theorem implicitly assumes that
GP-UCB has knowledge of an upper bound on _∥f_ _∥_ _k_,
standard guess-and-doubling approaches suffice if no
such bound is known a priori. Comparing Theorem 2
and Theorem 3, the latter holds uniformly over all
functions _f_ with _∥f_ _∥_ _k_ _< ∞_, while the former is a probabilistic statement requiring knowledge of the GP that
_f_ is sampled from. In contrast, if _f ∼_ GP(0 _, k_ ( _**x**_ _,_ _**x**_ _[′]_ )),
then _∥f_ _∥_ _k_ = _∞_ almost surely (Wahba, 1990): sample
paths are rougher than RKHS functions. Neither
Theorem 2 nor 3 encompasses the other.


**5. Bounding the Information Gain**


Since the bounds developed in Section 4 depend on the
information gain, the key remaining question is how to
bound the quantity _γ_ _T_ for practical classes of kernels.


**5.1. Submodularity and Greedy Maximization**


In order to bound _γ_ _T_, we have to maximize the information gain _F_ ( _A_ ) = I( _**y**_ _A_ ; _f_ ) over all subsets _A ⊂_ _D_ of
size _T_ : a combinatorial problem in general. However,
as noted in Section 2, _F_ ( _A_ ) is a submodular function,
which implies the performance guarantee (5) for maximizing _F_ sequentially by the greedy ED rule (4). Dividing both sides of (5) by 1 _−_ 1 _/e_, we can upper-bound
_γ_ _T_ by (1 _−_ 1 _/e_ ) _[−]_ [1] I( _**y**_ _A_ _T_ ; _f_ ), where _A_ _T_ is constructed
by the greedy procedure. Thus, somewhat counterintuitively, instead of using submodularity to prove that
_F_ ( _A_ _T_ ) is near-optimal, we use it in order to show that



_γ_ _T_ is “near-greedy”. As noted in Section 2, the ED
rule does not depend on observations _y_ _t_ and can be
run without evaluating _f_ .


The importance of this greedy bound is twofold.
First, it allows us to numerically compute highly
problem-specific bounds on _γ_ _T_, which can be plugged
into our results in Section 4 to obtain high-probability
bounds on _R_ _T_ . This being a laborious procedure, one
would prefer _a priori_ bounds for _γ_ _T_ in practice which
are simple analytical expressions of _T_ and parameters
of _k_ . In this section, we sketch a general procedure
for obtaining such expressions, instantiating them for
a number of commonly used covariance functions,
once more relying crucially on the greedy ED rule
upper bound. Suppose that _D_ is finite for now, and
let _**f**_ = [ _f_ ( _**x**_ )] _**x**_ _∈D_, _**K**_ _D_ = [ _k_ ( _**x**_ _,_ _**x**_ _[′]_ )] _**x**_ _,_ _**x**_ _′_ _∈D_ . Sampling
_f_ at _**x**_ _t_, we obtain _y_ _t_ _∼_ _N_ ( _**v**_ _[T]_ _t_ _**[f]**_ _[, σ]_ [2] [), where] _**[ v]**_ _[t]_ _[∈]_ [R] _[|][D][|]_

is the indicator vector associated with _**x**_ _t_ . We can
upper-bound the greedy maximum once more, by
relaxing this constraint to _∥_ _**v**_ _t_ _∥_ = 1 in round _t_ of the
sequential method. For this relaxed greedy procedure,
all _**v**_ _t_ are leading eigenvectors of _**K**_ _D_, since successive
covariance matrices of _P_ ( _**f**_ _|_ _**y**_ _t−_ 1 ) share their eigenbasis with _**K**_ _D_, while eigenvalues are damped according
to how many times the corresponding eigenvector is
selected. We can upper-bound the information gain
by considering the worst-case allocation of _T_ samples
to the min _{T, |D|}_ leading eigenvectors of _**K**_ _D_ :



1 _/_ 2
_γ_ _T_ _≤_ 1 _−_ _e_ _[−]_ [1] [max] ( _m_ _t_ )



_|D|_
� _t_ =1 [log(1 +] _[ σ]_ _[−]_ [2] _[m]_ _[t]_ _[λ]_ [ˆ] _[t]_ [)] _[,]_ (8)



subject to [�] _t_ _[m]_ _[t]_ [ =] _[ T]_ [, and spec(] _**[K]**_ _[D]_ [) =] _[ {][λ]_ [ˆ] [1] _[ ≥]_ _[λ]_ [ˆ] [2] _[ ≥]_

_. . . }_ . We can split the sum into two parts in order
to obtain a bound to leading order. The following
Theorem captures this intuition:


**Theorem 4** _For any T ∈_ N _and any T_ _∗_ = 1 _, . . ., T_ _:_


_γ_ _T_ _≤O_ � _σ_ _[−]_ [2] [ _B_ ( _T_ _∗_ ) _T_ + _T_ _∗_ (log _n_ _T_ _T_ )]� _,_


_where n_ _T_ = [�] _[|]_ _t_ _[D]_ =1 _[|]_ _[λ]_ [ˆ] _[t]_ _[ and][ B]_ [(] _[T]_ _[∗]_ [) =][ �] _[|]_ _t_ _[D]_ = _[|]_ _T_ _∗_ +1 _[λ]_ [ˆ] _[t]_ _[.]_


Therefore, if for some _T_ _∗_ = _o_ ( _T_ ) the first _T_ _∗_ eigenvalues carry most of the total mass _n_ _T_, the information
gain will be small. The more rapidly the spectrum
of _**K**_ _D_ decays, the slower the growth of _γ_ _T_ . Figure 3
illustrates this intuition.


**5.2. Bounds for Common Kernels**


In this section we bound _γ_ _T_ for a range of commonly
used covariance functions: finite dimensional linear,
Squared Exponential and Mat´ern kernels. Together
with our results in Section 4, these imply sublinear
regret bounds for GP-UCB in all cases.


15


10


5











0

|Linear (d=4)<br>Squared exponential<br>Matern (ν = 2.5)<br>Independent|Col2|Col3|
|---|---|---|
||||

5 10 15 20

Eigenvalue rank



250


200


150


100


50



0
10 20 30 40 50

T



_Figure 3._ Spectral decay (left) and information gain bound (right) for independent (diagonal), linear, squared exponential
and Mat´ern kernels ( _ν_ = 2 _._ 5.) with equal trace.



_Finite dimensional linear_ kernels have the form
_k_ ( _**x**_ _,_ _**x**_ _[′]_ ) = _**x**_ _[T]_ _**x**_ _[′]_ . GPs with this kernel correspond to
random linear functions _f_ ( _**x**_ ) = _**w**_ _[T]_ _**x**_, _**w**_ _∼_ _N_ ( **0** _,_ _**I**_ ).


The _Squared_ _Exponential_ _kernel_ is _k_ ( _**x**_ _,_ _**x**_ _[′]_ ) =
exp( _−_ (2 _l_ [2] ) _[−]_ [1] _∥_ _**x**_ _−_ _**x**_ _[′]_ _∥_ [2] ), _l_ a lengthscale parameter.
Sample functions are differentiable to any order
almost surely (Rasmussen & Williams, 2006).


The _Mat´ern_ _kernel_ is given by _k_ ( _**x**_ _,_ _**x**_ _[′]_ ) =
(2 [1] _[−][ν]_ _/_ Γ( _ν_ )) _r_ _[ν]_ _B_ _ν_ ( _r_ ), _r_ = ( _√_ 2 _ν/l_ ) _∥_ _**x**_ _−_ _**x**_ _[′]_ _∥_, where _ν_

controls the smoothness of sample paths (the smaller,
the rougher) and _B_ _ν_ is a modified Bessel function.
Note that as _ν →∞_, appropriately rescaled Mat´ern
kernels converge to the Squared Exponential kernel.


Figure 4 shows random functions drawn from GP distributions with the above kernels.


**Theorem 5** _Let D ⊂_ R _[d]_ _be compact and convex, d ∈_
N _. Assume the kernel function satisfies k_ ( _**x**_ _,_ _**x**_ _[′]_ ) _≤_ 1 _._


_1._ Finite spectrum. _For the d-dimensional Bayesian_
_linear regression case: γ_ _T_ = _O_ � _d_ log _T_ � _._


_2._ Exponential spectral decay. _For the Squared_
_Exponential kernel: γ_ _T_ = _O_ �(log _T_ ) _[d]_ [+1] [�] _._


_3._ Power law spectral decay. _For Mat´ern kernels_
_with ν >_ 1 _: γ_ _T_ = _O_ � _T_ _[d]_ [(] _[d]_ [+1)] _[/]_ [(2] _[ν]_ [+] _[d]_ [(] _[d]_ [+1))] (log _T_ )� _._


A proof of Theorem 5 is given in the Appendix,, we
only sketch the idea here. _γ_ _T_ is bounded by Theorem 4 in terms the eigendecay of the kernel matrix
_**K**_ _D_ . If _D_ is infinite or very large, we can use the
operator spectrum of _k_ ( _**x**_ _,_ _**x**_ _[′]_ ), which likewise decays
rapidly. For the kernels of interest here, asymptotic
expressions for the operator eigenvalues are given
in Seeger et al. (2008), who derived bounds on the
information gain for fixed and random designs (in
contrast to the worst-case information gain considered
here, which is substantially more challenging to
bound). The main challenge in the proof is to ensure



the existence of discretizations _D_ _T_ _⊂_ _D_, dense in the
limit, for which tail sums _B_ ( _T_ _∗_ ) _/n_ _T_ in Theorem 4 are
close to corresponding operator spectra tail sums.


Together with Theorems 2 and 3, this result guarantees sublinear regret of GP-UCB for any dimension
(see Figure 1). For the Squared Exponential kernel,
the dimension _d_ appears as exponent of log _T_ only, so

_d_ +1

that the regret grows at most as _O_ _[∗]_ ( _√T_ (log _T_ ) 2 )

– the high degree of smoothness of the sample paths
effectively combats the curse of dimensionality.

**6. Experiments**


We compare GP-UCB with heuristics such as the
Expected Improvement (EI) and Most Probable
Improvement (MPI), and with naive methods which
choose points of maximum mean or variance only,
both on synthetic and real sensor network data.


For synthetic data, we sample random functions from a
squared exponential kernel with lengthscale parameter
0 _._ 2. The sampling noise variance _σ_ [2] was set to 0 _._ 025 or
5% of the signal variance. Our decision set _D_ = [0 _,_ 1]
is uniformly discretized into 1000 points. We run
each algorithm for _T_ = 1000 iterations with _δ_ = 0 _._ 1,
averaging over 30 trials (samples from the kernel).
While the choice of _β_ _t_ as recommended by Theorem 1
leads to competitive performance of GP-UCB, we
find (using cross-validation) that the algorithm is
improved by scaling _β_ _t_ down by a factor 5. Note that
we did not optimize constants in our regret bounds.


Next, we use temperature data collected from 46 sensors deployed at Intel Research Berkeley over 5 days at
1 minute intervals, pertaining to the example in Section 2. We take the first two-thirds of the data set to
compute the empirical covariance of the sensor readings, and use it as the kernel matrix. The functions _f_
for optimization consist of one set of observations from
all the sensors taken from the remaining third of the


2


1


0


−1


−2
0 0.2 0.4 0.6 0.8 1


(c) _Mat´ern_



6


4


2


0


−2


−4
0 0.2 0.4 0.6 0.8 1


(a) _Bayesian Linear Regression_



2


1


0


−1


−2
0 0.2 0.4 0.6 0.8 1


(b) _Squared Exponential_



_Figure 4._ Sample functions drawn from a GP with linear, squared exponential and Mat´ern kernels ( _ν_ = 2 _._ 5.)







1


0.8


0.6


0.4


0.2







5


4


3


2


1













35


30


25


20


15


10


5





0
0 100 200 300

Iterations


(c) _Traffic data_





0
0 20 40 60 80 100

Iterations


(a) _Squared exponential_



0
0 10 20 30 40

Iterations


(b) _Temperature data_



_Figure 5._ Comparison of performance: GP-UCB and various heuristics on synthetic (a), and sensor network data (b, c).



data set, and the results (for _T_ = 46 _, σ_ [2] = 0 _._ 5 or 5%
noise, _δ_ = 0 _._ 1) were averaged over 2000 possible
choices of the objective function.


Lastly, we take data from traffic sensors deployed along
the highway I-880 South in California. The goal was to
find the point of minimum speed in order to identify
the most congested portion of the highway; we used
traffic speed data for all working days from 6 AM to
11 AM for one month, from 357 sensors. We again
use the covariance matrix from two-thirds of the data

set as kernel matrix, and test on the other third. The
results (for _T_ = 357 _, σ_ [2] = 4 _._ 78 or 5% noise, _δ_ = 0 _._ 1)
were averaged over 900 runs.


Figure 5 compares the mean average regret incurred
by the different heuristics and the GP-UCB algorithm
on synthetic and real data. For temperature data,
the GP-UCB algorithm and EI heuristic clearly
outperform the others, and do not exhibit significant
difference between each other. On synthetic and traffic data MPI does equally well. In summary, GP-UCB
performs at least on par with the existing approaches
which are not equipped with regret bounds.


**7. Conclusions**


We prove the first sublinear regret bounds for GP
optimization with commonly used kernels (see Figure 1), both for _f_ sampled from a known GP and _f_ of
low RKHS norm. We analyze GP-UCB, an intuitive,



Bayesian upper confidence bound based sampling rule.
Our regret bounds crucially depend on the information
gain due to sampling, establishing a novel connection
between bandit optimization and experimental design.
We bound the information gain in terms of the kernel
spectrum, providing a general methodology for obtaining regret bounds with kernels of interest. Our experiments on real sensor network data indicate that GP
UCB performs at least on par with competing criteria
for GP optimization, for which no regret bounds are
known at present. Our results provide an interesting
step towards understanding exploration–exploitation
tradeoffs with complex utility functions.


**Acknowledgements**


We thank Marcus Hutter for insightful comments on
an earlier version of this paper. This research was
partially supported by ONR grant N00014-09-1-1044,
NSF grant CNS-0932392, a gift from Microsoft Corporation and the Excellence Initiative of the German
research foundation (DFG).

**References**


Abernethy, J., Hazan, E., and Rakhlin, A. An efficient
algorithm for linear bandit optimization, 2008. COLT.


Auer, P. Using confidence bounds for exploitationexploration trade-offs. _JMLR_, 3:397–422, 2002.


Auer, P., Cesa-Bianchi, N., and Fischer, P. Finite-time


analysis of the multiarmed bandit problem. _Mach._
_Learn._, 47(2-3):235–256, 2002.


Brochu, E., Cora, M., and de Freitas, N. A tutorial on
Bayesian optimization of expensive cost functions, with
application to active user modeling and hierarchical reinforcement learning. In _TR-2009-23, UBC_, 2009.


Bubeck, S., Munos, R., Stoltz, G., and Szepesv´ari, C. Online optimization in X-armed bandits. In _NIPS_, 2008.


Chaloner, K. and Verdinelli, I. Bayesian experimental design: A review. _Stat. Sci._, 10(3):273–304, 1995.


Cover, T. M. and Thomas, J. A. _Elements of Information_
_Theory_ . Wiley Interscience, 1991.


Dani, V., Hayes, T. P., and Kakade, S. The price of bandit
information for online optimization. In _NIPS_, 2007.


Dani, V., Hayes, T. P., and Kakade, S. M. Stochastic linear
optimization under bandit feedback. In _COLT_, 2008.


Dorard, L., Glowacka, D., and Shawe-Taylor, J. Gaussian
process modelling of dependencies in multi-armed bandit
problems. In _Int. Symp. Op. Res._, 2009.


Freedman, D. A. On tail probabilities for martingales. _Ann._
_Prob._, 3(1):100–118, 1975.


Ghosal, S. and Roy, A. Posterior consistency of Gaussian
process prior for nonparametric binary regression. _Ann._
_Stat._, 34(5):2413–2429, 2006.


Gr¨unew¨alder, S., Audibert, J-Y., Opper, M., and ShaweTaylor, J. Regret bounds for gaussian process bandit
problems. In _AISTATS_, 2010.


Huang, D., Allen, T. T., Notz, W. I., and Zeng, N. Global
optimization of stochastic black-box systems via sequential kriging meta-models. _J Glob. Opt._, 34:441–466,
2006.


Jones, D. R., Schonlau, M., and Welch, W. J. Efficient
global optimization of expensive black-box functions. _J_
_Glob. Opti._, 13:455–492, 1998.


Kleinberg, R., Slivkins, A., and Upfal, E. Multi-armed
bandits in metric spaces. In _STOC_, pp. 681–690, 2008.


Ko, C., Lee, J., and Queyranne, M. An exact algorithm
for maximum entropy sampling. _Ops Res_, 43(4):684–691,
1995.


Kocsis, L. and Szepesv´ari, C. Bandit based monte-carlo
planning. In _ECML_, 2006.


Krause, A. and Guestrin, C. Near-optimal nonmyopic value
of information in graphical models. In _UAI_, 2005.


Lizotte, D., Wang, T., Bowling, M., and Schuurmans, D.
Automatic gait optimization with Gaussian process regression. In _IJCAI_, pp. 944–949, 2007.


McDiarmid, C. _Concentration. In Probabilistiic Methods_
_for Algorithmic Discrete Mathematics_ . Springer, 1998.


Mockus, J. _Bayesian Approach to Global Optimization_ .
Kluwer Academic Publishers, 1989.



Mockus, J., Tiesis, V., and Zilinskas, A. _Toward Global_
_Optimization_, volume 2, chapter Bayesian Methods for
Seeking the Extremum, pp. 117–128. 1978.


Nemhauser, G., Wolsey, L., and Fisher, M. An analysis
of the approximations for maximizing submodular set
functions. _Math. Prog._, 14:265–294, 1978.


Pandey, S. and Olston, C. Handling advertisements of unknown quality in search advertising. In _NIPS_ . 2007.


Rasmussen, C. E. and Williams, C. K. I. _Gaussian Pro-_
_cesses for Machine Learning_ . MIT Press, 2006.


Robbins, H. Some aspects of the sequential design of experiments. _Bul. Am. Math. Soc._, 58:527–535, 1952.


Rusmevichientong, P. and Tsitsiklis, J. N. Linearly parameterized bandits. abs/0812.3465, 2008.


Seeger, M. W., Kakade, S. M., and Foster, D. P. Information consistency of nonparametric Gaussian process
methods. _IEEE Tr. Inf. Theo._, 54(5):2376–2382, 2008.


Shawe-Taylor, J., Williams, C., Cristianini, N., and Kandola, J. On the eigenspectrum of the Gram matrix and
the generalization error of kernel-PCA. _IEEE Trans. Inf._
_Theo._, 51(7):2510–2522, 2005.


Srinivas, N., Krause, A., Kakade, S., and Seeger, M. Gaussian process optimization in the bandit setting: No regret and experimental design. In _ICML_, 2010.


Stein, M. _Interpolation of Spatial Data: Some Theory for_
_Kriging_ . Springer, 1999.


Vazquez, E. and Bect, J. Convergence properties of the
expected improvement algorithm, 2007.


Wahba, G. _Spline Models for Observational Data_ . SIAM,
1990.


**A. Regret Bounds for Target Function**
**Sampled from GP**


In this section, we provide details for the proofs of
Theorem 1 and Theorem 2. In both cases, the strategy
is to show that _|f_ ( _**x**_ ) _−_ _µ_ _t−_ 1 ( _**x**_ ) _| ≤_ _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ ) for all
_t ∈_ N and all _**x**_ _∈_ _D_, or in the infinite case, all _**x**_ in
a discretization of _D_ which becomes dense as _t_ gets
large.


**A.1. Finite Decision Set**


We begin with the finite case, _|D| < ∞_ .


**Lemma 5.1** _Pick_ _δ_ _∈_ (0 _,_ 1) _and_ _set_ _β_ _t_ =
2 log( _|D|π_ _t_ _/δ_ ) _, where_ [�] _t≥_ 1 _[π]_ _t_ _[−]_ [1] = 1 _, π_ _t_ _>_ 0 _. Then,_


_|f_ ( _**x**_ ) _−_ _µ_ _t−_ 1 ( _**x**_ ) _| ≤_ _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ ) _∀_ _**x**_ _∈_ _D ∀t ≥_ 1


_holds with probability ≥_ 1 _−_ _δ._


**Proof** Fix _t ≥_ 1 and _**x**_ _∈_ _D_ . Conditioned on _**y**_ _t−_ 1 =
( _y_ 1 _, . . ., y_ _t−_ 1 ), _{_ _**x**_ 1 _, . . .,_ _**x**_ _t−_ 1 _}_ are deterministic, and
_f_ ( _**x**_ ) _∼_ _N_ ( _µ_ _t−_ 1 ( _**x**_ ) _, σ_ _t_ [2] _−_ 1 [(] _**[x]**_ [)).] Now, if _r ∼_ _N_ (0 _,_ 1),
then


Pr _{r > c}_ = _e_ _[−][c]_ [2] _[/]_ [2] (2 _π_ ) _[−]_ [1] _[/]_ [2] _e_ _[−]_ [(] _[r][−][c]_ [)] [2] _[/]_ [2] _[−][c]_ [(] _[r][−][c]_ [)] _dr_
�

_≤_ _e_ _[−][c]_ [2] _[/]_ [2] Pr _{r >_ 0 _}_ = (1 _/_ 2) _e_ _[−][c]_ [2] _[/]_ [2]


for _c >_ 0, since _e_ _[−][c]_ [(] _[r][−][c]_ [)] _≤_ 1 for _r ≥_ _c_ . Therefore,
Pr _{|f_ ( _**x**_ ) _−_ _µ_ _t−_ 1 ( _**x**_ ) _| > β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ ) _} ≤_ _e_ _[−][β]_ _[t]_ _[/]_ [2], using
_r_ = ( _f_ ( _**x**_ ) _−µ_ _t−_ 1 ( _**x**_ )) _/σ_ _t−_ 1 ( _**x**_ ) and _c_ = _β_ _t_ [1] _[/]_ [2] . Applying
the union bound,


_|f_ ( _**x**_ ) _−_ _µ_ _t−_ 1 ( _**x**_ ) _| ≤_ _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ ) _∀_ _**x**_ _∈_ _D_


holds with probability _≥_ 1 _−|D|e_ _[−][β]_ _[t]_ _[/]_ [2] . Choosing
_|D|e_ _[−][β]_ _[t]_ _[/]_ [2] = _δ/π_ _t_ and using the union bound for
_t ∈_ N, the statement holds. For example, we can use
_π_ _t_ = _π_ [2] _t_ [2] _/_ 6.


**Lemma 5.2** _Fix t ≥_ 1 _._ _If |f_ ( _**x**_ ) _−_ _µ_ _t−_ 1 ( _**x**_ ) _| ≤_
_β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ ) _for all_ _**x**_ _∈_ _D, then the regret r_ _t_ _is_
_bounded by_ 2 _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ _t_ ) _._


**Proof** By definition of _**x**_ _t_ : _µ_ _t−_ 1 ( _**x**_ _t_ )+ _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ _t_ ) _≥_
_µ_ _t−_ 1 ( _**x**_ _[∗]_ ) + _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ _[∗]_ ) _≥_ _f_ ( _**x**_ _[∗]_ ). Therefore,


_r_ _t_ = _f_ ( _**x**_ _[∗]_ ) _−_ _f_ ( _**x**_ _t_ ) _≤_ _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ _t_ ) + _µ_ _t−_ 1 ( _**x**_ _t_ ) _−_ _f_ ( _**x**_ _t_ )

_≤_ 2 _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ _t_ ) _._


**Lemma 5.3** _The information gain for the points se-_
_lected can be expressed in terms of the predictive vari-_
_ances. If_ _**f**_ _T_ = ( _f_ ( _**x**_ _t_ )) _∈_ R _[T]_ _:_



I( _**y**_ _T_ ; _**f**_ _T_ ) = [1]

2



_T_
� _t_ =1 [log] �1 + _σ_ _[−]_ [2] _σ_ _t_ [2] _−_ 1 [(] _**[x]**_ _[t]_ [)] � _._



**Proof** Recall that I( _**y**_ _T_ ; _**f**_ _T_ ) = H( _**y**_ _T_ ) _−_
(1 _/_ 2) log _|_ 2 _πeσ_ [2] _**I**_ _|_ . Now, H( _**y**_ _T_ ) = H( _**y**_ _T −_ 1 ) +
H( _y_ _T_ _|_ _**y**_ _T −_ 1 ) = H( _**y**_ _T −_ 1 ) + log(2 _πe_ ( _σ_ [2] + _σ_ _t_ [2] _−_ 1 [(] _**[x]**_ _[T]_ [)))] _[/]_ [2.]
Here, we use that _**x**_ 1 _, . . .,_ _**x**_ _T_ are deterministic conditioned on _**y**_ _T −_ 1, and that the conditional variance
_σ_ _T_ [2] _−_ 1 [(] _**[x]**_ _[T]_ [ ) does not depend on] _**[ y]**_ _T −_ 1 [. The result fol-]
lows by induction.


**Lemma 5.4** _Pick δ ∈_ (0 _,_ 1) _and let β_ _t_ _be defined as in_
_Lemma 5.1. Then, the following holds with probability_
_≥_ 1 _−_ _δ:_

_T_
� _t_ =1 _[r]_ _t_ [2] _[≤]_ _[β]_ _[T]_ _[C]_ [1] [I(] _**[y]**_ _T_ [;] _**[ f]**_ _T_ [)] _[ ≤]_ _[C]_ [1] _[β]_ _[T]_ _[γ]_ _[T]_ _∀T ≥_ 1 _,_



_where C_ 1 := 8 _/_ log(1 + _σ_ _[−]_ [2] ) _≥_ 8 _σ_ [2] _._


**Proof** By Lemma 5.1 and Lemma 5.2, we have that
_{r_ _t_ [2] _[≤]_ [4] _[β]_ _[t]_ _[σ]_ _t_ [2] _−_ 1 [(] _**[x]**_ _[t]_ [)] _[ ∀][t][ ≥]_ [1] _[}]_ [ with probability] _[ ≥]_ [1] _[ −]_ _[δ]_ [.]
Now, _β_ _t_ is nondecreasing, so that


4 _β_ _t_ _σ_ _t_ [2] _−_ 1 [(] _**[x]**_ _[t]_ [)] _[ ≤]_ [4] _[β]_ _[T]_ _[σ]_ [2] [(] _[σ]_ _[−]_ [2] _[σ]_ _t_ [2] _−_ 1 [(] _**[x]**_ _[t]_ [))]

_≤_ 4 _β_ _T_ _σ_ [2] _C_ 2 log(1 + _σ_ _[−]_ [2] _σ_ _t_ [2] _−_ 1 [(] _**[x]**_ _[t]_ [))]


with _C_ 2 = _σ_ _[−]_ [2] _/_ log(1 + _σ_ _[−]_ [2] ) _≥_ 1, since
_s_ [2] _≤_ _C_ 2 log(1 + _s_ [2] ) for _s_ _∈_ [0 _, σ_ _[−]_ [2] ], and
_σ_ _[−]_ [2] _σ_ _t_ [2] _−_ 1 [(] _**[x]**_ _[t]_ [)] _[ ≤]_ _[σ]_ _[−]_ [2] _[k]_ [(] _**[x]**_ _[t]_ _[,]_ _**[ x]**_ _[t]_ [)] _[ ≤]_ _[σ]_ _[−]_ [2] [.] Noting that
_C_ 1 = 8 _σ_ [2] _C_ 2, the result follows by plugging in the
representation of Lemma 5.3.


Finally, Theorem 1 is a simple consequence of
Lemma 5.4, since _R_ _T_ [2] _[≤]_ _[T]_ [ �] _[T]_ _t_ =1 _[r]_ _t_ [2] [by the Cauchy-]
Schwarz inequality.


**A.2. General Decision Set**


Theorem 2 extends the statement of Theorem 1 to
the general case of _D ⊂_ R _[d]_ compact. We cannot
expect this generalization to work without any assumptions on the kernel _k_ ( _**x**_ _,_ _**x**_ _[′]_ ). For example, if
_k_ ( _**x**_ _,_ _**x**_ _[′]_ ) = _e_ _[−∥]_ _**[x]**_ _[−]_ _**[x]**_ _[′]_ _[∥]_ (Ornstein-Uhlenbeck), while sample paths _f_ are a.s. continuous, they are still very erratic: _f_ is a.s. nondifferentiable almost everywhere,
and the process comes with independent increments, a
stationary variant of Brownian motion. The additional
assumption on _k_ in Theorem 2 is rather mild and is
satisfied by several common kernels, as discussed in
Section 4.


Recall that the finite case proof is based on Lemma 5.1
paving the way for Lemma 5.2. However, Lemma 5.1
does not hold for infinite _D_ . First, let us observe that
we have confidence on all decisions actually chosen.


**Lemma 5.5** _Pick δ ∈_ (0 _,_ 1) _and set β_ _t_ = 2 log( _π_ _t_ _/δ_ ) _,_
_where_ [�] _t≥_ 1 _[π]_ _t_ _[−]_ [1] = 1 _, π_ _t_ _>_ 0 _. Then,_


_|f_ ( _**x**_ _t_ ) _−_ _µ_ _t−_ 1 ( _**x**_ _t_ ) _| ≤_ _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ _t_ ) _∀t ≥_ 1


_holds with probability ≥_ 1 _−_ _δ._


**Proof** Fix _t ≥_ 1 and _**x**_ _∈_ _D_ . Conditioned on
_**y**_ _t−_ 1 = ( _y_ 1 _, . . ., y_ _t−_ 1 ), _{_ _**x**_ 1 _, . . .,_ _**x**_ _t−_ 1 _}_ are deterministic, and _f_ ( _**x**_ ) _∼_ _N_ ( _µ_ _t−_ 1 ( _**x**_ ) _, σ_ _t_ [2] _−_ 1 [(] _**[x]**_ [)).] As before,
Pr _{|f_ ( _**x**_ _t_ ) _−_ _µ_ _t−_ 1 ( _**x**_ _t_ ) _| > β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ _t_ ) _} ≤_ _e_ _[−][β]_ _[t]_ _[/]_ [2] .
Since _e_ _[−][β]_ _[t]_ _[/]_ [2] = _δ/π_ _t_ and using the union bound for
_t ∈_ N, the statement holds.


Purely for the sake of analysis, we use a set of discretizations _D_ _t_ _⊂_ _D_, where _D_ _t_ will be used at time


_t_ in the analysis. Essentially, we use this to obtain a
valid confidence interval on _**x**_ _[∗]_ . The following lemma
provides a confidence bound for these subsets.


**Lemma 5.6** _Pick_ _δ_ _∈_ (0 _,_ 1) _and_ _set_ _β_ _t_ =
2 log( _|D_ _t_ _|π_ _t_ _/δ_ ) _, where_ [�] _t≥_ 1 _[π]_ _t_ _[−]_ [1] = 1 _, π_ _t_ _>_ 0 _. Then,_


_|f_ ( _**x**_ ) _−_ _µ_ _t−_ 1 ( _**x**_ ) _| ≤_ _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ ) _∀_ _**x**_ _∈_ _D_ _t_ _, ∀t ≥_ 1


_holds with probability ≥_ 1 _−_ _δ._


**Proof** The proof is identical to that in Lemma 5.1,
except now we use _D_ _t_ at each timestep.


Now by assumption and the union bound, we have that


Pr _{∀j, ∀_ _**x**_ _∈_ _D, |∂f/_ ( _∂x_ _j_ ) _| < L} ≥_ 1 _−_ _dae_ _[−][L]_ [2] _[/b]_ [2] _._


which implies that, with probability greater than 1 _−_
_dae_ _[−][L]_ [2] _[/b]_ [2], we have that


_∀_ _**x**_ _∈_ _D, |f_ ( _x_ ) _−_ _f_ ( _x_ _[′]_ ) _| ≤_ _L∥x −_ _x_ _[′]_ _∥_ 1 _._ (9)


This allows us to obtain confidence on _**x**_ _[⋆]_ as follows.


Now let us choose a discretization _D_ _t_ of size ( _τ_ _t_ ) _[d]_ so
that for all _**x**_ _∈_ _D_ _t_


_∥_ _**x**_ _−_ [ _**x**_ ] _t_ _∥_ 1 _≤_ _rd/τ_ _t_


where [ _**x**_ ] _t_ denotes the closest point in _D_ _t_ to _**x**_ . A sufficient discretization has each coordinate with _τ_ _t_ uniformly spaced points.



This implies that _|D_ _t_ _|_ = ( _dt_ [2] _br_ �log(2 _da/δ_ )) _[d]_ . Using

_δ/_ 2 in Lemma 5.6, we can apply the confidence bound
to [ _**x**_ _[∗]_ ] _t_ (as this lives in _D_ _t_ ) to obtain the result.


Now we are able to bound the regret.



**Lemma 5.8** _Pick_ _δ_ _∈_ (0 _,_ 1) _and_ _set_ _β_ _t_ =
2 log(4 _π_ _t_ _/δ_ ) + 4 _d_ log( _dtbr_ �log(4 _da/δ_ )) _,_ _where_



2 log(4 _π_ _t_ _/δ_ ) + 4 _d_ log( _dtbr_ �log(4 _da/δ_ )) _,_ _where_

� _t_ 1 _[π]_ _t_ _[−]_ [1] = 1 _, π_ _t_ _>_ 0 _. Then, with probability greater_



� _t≥_ 1 _[π]_ _t_ _[−]_ [1] = 1 _, π_ _t_ _>_ 0 _. Then, with probability greater_

_than_ 1 _−_ _δ, for all t ∈_ N _, the regret is bounded as_
_follows:_



_r_ _t_ _≤_ 2 _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ _t_ ) + _t_ [1] [2] _[.]_



**Lemma 5.7** _Pick_ _δ_ _∈_ (0 _,_ 1) _and_ _set_ _β_ _t_ =
2 log(2 _π_ _t_ _/δ_ ) + 4 _d_ log( _dtbr_ �log(2 _da/δ_ )) _,_ _where_



2 log(2 _π_ _t_ _/δ_ ) + 4 _d_ log( _dtbr_ �log(2 _da/δ_ )) _,_ _where_

� _t≥_ 1 _[π]_ _t_ _[−]_ [1] = 1 _, π_ _t_ _>_ 0 _. Let τ_ _t_ = _dt_ [2] _br_ �log(2 _da/δ_ )

_Let_ [ _**x**_ _[∗]_ ] _t_ _denotes the closest point in D_ _t_ _to_ _**x**_ _[∗]_ _. Hence,_
_Then,_

_|f_ ( _**x**_ _[∗]_ ) _−_ _µ_ _t−_ 1 ([ _**x**_ _[∗]_ ] _t_ ) _| ≤_ _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ([ _**x**_ _[∗]_ ] _t_ ) + _t_ [1] [2] _∀t ≥_ 1



_t≥_ 1 _[π]_ _t_ _[−]_ [1] = 1 _, π_ _t_ _>_ 0 _. Let τ_ _t_ = _dt_ [2] _br_ �



_|f_ ( _**x**_ _[∗]_ ) _−_ _µ_ _t−_ 1 ([ _**x**_ _[∗]_ ] _t_ ) _| ≤_ _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ([ _**x**_ _[∗]_ ] _t_ ) + [1]



_holds with probability ≥_ 1 _−_ _δ._


**Proof** Using (9), we have that with probability
greater than 1 _−_ _δ/_ 2,


_∀_ _**x**_ _∈_ _D, |f_ ( _x_ ) _−_ _f_ ( _x_ _[′]_ ) _| ≤_ _b_ ~~�~~ log(2 _da/δ_ ) _∥x −_ _x_ _[′]_ _∥_ 1 _._


Hence,



**Proof** We use _δ/_ 2 in both Lemma 5.5 and Lemma 5.7,
so that these events hold with probability greater
than 1 _−_ _δ_ . Note that the specification of _β_ _t_ in the
above lemma is greater than the specification used in
Lemma 5.5 (with _δ/_ 2), so this choice is valid.


By definition of _**x**_ _t_ : _µ_ _t−_ 1 ( _**x**_ _t_ ) + _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ _t_ ) _≥_
_µ_ _t−_ 1 ([ _**x**_ _[∗]_ ] _t_ )+ _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ([ _**x**_ _[∗]_ ] _t_ ). Also, by Lemma 5.7, we
have that _µ_ _t−_ 1 ([ _**x**_ _[∗]_ ] _t_ )+ _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ([ _**x**_ _[∗]_ ] _t_ )+1 _/t_ [2] _≥_ _f_ ( _**x**_ _[∗]_ ),
which implies _µ_ _t−_ 1 ( _**x**_ _t_ )+ _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ _t_ ) _≥_ _f_ ( _**x**_ _[∗]_ ) _−_ 1 _/t_ [2] .
Therefore,


_r_ _t_ = _f_ ( _**x**_ _[∗]_ ) _−_ _f_ ( _**x**_ _t_ )

_≤_ _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ _t_ ) + 1 _/t_ [2] + _µ_ _t−_ 1 ( _**x**_ _t_ ) _−_ _f_ ( _**x**_ _t_ )

_≤_ 2 _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ _t_ ) + 1 _/t_ [2] _._


which completes the proof.


Now we are ready to complete the proof of Theorem 2.
As shown in the proof of Lemma 5.4, we have that with
probability greater than 1 _−_ _δ_,


_T_
� _t_ =1 [4] _[β]_ _[t]_ _[σ]_ _t_ [2] _−_ 1 [(] _**[x]**_ _[t]_ [)] _[ ≤]_ _[C]_ [1] _[β]_ _[T]_ _[γ]_ _[T]_ _∀T ≥_ 1 _,_


so that by Cauchy-Schwarz:



_T_
� _t_ =1 [2] _[β]_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1 ( _**x**_ _t_ ) _≤_ �


Hence,



_C_ 1 _Tβ_ _T_ _γ_ _T_ _∀T ≥_ 1 _,_



_T_
� _t_ =1 _[r]_ _[t]_ _[ ≤]_ �



_C_ 1 _Tβ_ _T_ _γ_ _T_ + _π_ [2] _/_ 6 _∀T ≥_ 1 _,_



_∀_ _**x**_ _∈_ _D_ _t_ _, |f_ ( _x_ ) _−_ _f_ ([ _x_ ] _t_ ) _| ≤_ _rdb_ �



log(2 _da/δ_ ) _/τ_ _t_ _._



Now by choosing _τ_ _t_ = _dt_ [2] _br_ ~~�~~ log(2 _da/δ_ ), we have that


_∀_ _**x**_ _∈_ _D_ _t_ _, |f_ ( _x_ ) _−_ _f_ ([ _x_ ] _t_ ) _| ≤_ [1]

_t_ [2]



(since [�] 1 _/t_ [2] = _π_ [2] _/_ 6). Theorem 2 now follows.


Finally, we now discuss the additional assumption on
_k_ in Theorem 2. For samples _f_ of the GP, consider
partial derivatives _∂f/_ ( _∂x_ _j_ ) of this sample path for
_j_ = 1 _, . . ., d_ . Theorem 5 of Ghosal & Roy (2006)


states that if derivatives up to fourth order exists
for ( _**x**_ _,_ _**x**_ _[′]_ ) _�→_ _k_ ( _**x**_ _,_ _**x**_ _[′]_ ), then _f_ is almost surely continuously differentiable, with _∂f/_ ( _∂x_ _j_ ) distributed as
Gaussian processes again. Moreover, there are constants _a, b_ _j_ _>_ 0 such that


Pr sup _|∂f/_ ( _∂x_ _j_ ) _| > L_ _≤_ _ae_ _[−][b]_ _[j]_ _[L]_ [2] _._ (10)
� _**x**_ _∈D_ �


Picking _L_ = [log( _da_ 2 _/δ_ ) _/_ min _j_ _b_ _j_ ] [1] _[/]_ [2], we have that
_ae_ _[−][b]_ _[j]_ _[L]_ [2] _≤_ _δ/_ (2 _d_ ) for all _j_ = 1 _, . . ., d_, so that for
_K_ 1 = _d_ [1] _[/]_ [2] _L_, by the mean value theorem, we have
Pr _{|f_ ( _**x**_ ) _−f_ ( _**x**_ _[′]_ ) _| ≤_ _K_ 1 _∥_ _**x**_ _−_ _**x**_ _[′]_ _∥∀_ _**x**_ _,_ _**x**_ _[′]_ _∈_ _D} ≥_ 1 _−δ/_ 2.


Also, note that _K_ 1 = _O_ ((log _δ_ _[−]_ [1] ) [1] _[/]_ [2] ).


_·_
This statement is about the joint distribution of _f_ ( )
and its partial derivatives w.r.t. each component. For
a certain event in this sample space, all _∂f/_ ( _∂x_ _j_ ) exist, are continuous, and the complement of (10) holds
for all _j_ . Theorem 5 of Ghosal & Roy (2006), together
with the union bound, implies that this event has probability _≥_ 1 _−_ _δ/_ 2. Derivatives up to fourth order exist
for the Gaussian covariance function, and for Mat´ern
kernels with _ν >_ 2 (Stein, 1999).


**B. Regret Bound for Target Function**
**in RKHS**


In this section, we detail a proof of Theorem 3. Recall
that in this setting, we do not know the generator of
the target function _f_, but only a bound on its RKHS
norm _∥f_ _∥_ _k_ .


Recall the posterior mean function _µ_ _T_ ( _·_ ) and posterior
covariance function _k_ _T_ ( _·, ·_ ) from Section 2, conditioned
on data ( _**x**_ _t_ _, y_ _t_ ), _t_ = 1 _, . . ., T_ . It is easy to see that the
RKHS norm corresponding to _k_ _T_ is given by


_∥f_ _∥_ [2] _k_ _T_ [=] _[ ∥][f]_ _[∥]_ _k_ [2] [+] _[ σ]_ _[−]_ [2] [ �] _[T]_ _t_ =1 _[f]_ [(] _**[x]**_ _[t]_ [)] [2] _[.]_


This implies that _H_ _k_ ( _D_ ) = _H_ _k_ _T_ ( _D_ ) for any _T_, while
the RKHS inner products are different: _∥f_ _∥_ _k_ _T_ _≥∥f_ _∥_ _k_ .
Since _⟨f_ ( _·_ ) _, k_ _T_ ( _·,_ _**x**_ ) _⟩_ _k_ _T_ = _f_ ( _**x**_ ) for any _f ∈H_ _k_ _T_ ( _D_ ) by
the reproducing property, then


_|µ_ _t_ ( _**x**_ ) _−_ _f_ ( _**x**_ ) _| ≤_ _k_ _T_ ( _**x**_ _,_ _**x**_ ) [1] _[/]_ [2] _∥µ_ _t_ _−_ _f_ _∥_ _k_ _T_ (11)
= _σ_ _T_ ( _**x**_ ) _∥µ_ _t_ _−_ _f_ _∥_ _k_ _T_


by the Cauchy-Schwarz inequality.


Compared to our other results, Theorem 3 is an agnostic statement, in that the assumptions the Bayesian
UCB algorithm bases its predictions on differ from
how _f_ and data _y_ _t_ are generated. First, _f_ is not
drawn from a GP, but can be an arbitrary function



from _H_ _k_ ( _D_ ). Second, while the UCB method assumes
that the noise _ε_ _t_ = _y_ _t_ _−_ _f_ ( _**x**_ _t_ ) is drawn independently
from _N_ (0 _, σ_ [2] ), the true sequence of noise variables _ε_ _t_
can be a uniformly bounded martingale difference sequence: _ε_ _t_ _≤_ _σ_ for all _t ∈_ N. All we have to do in order
to lift the proof of Theorem 1 to the agnostic setting
is to establish an analogue to Lemma 5.1, by way of
the following concentration result.


**Theorem 6** _Let δ ∈_ (0 _,_ 1) _. Assume the noise vari-_
_ables ε_ _t_ _are uniformly bounded by σ. Define:_


_β_ _t_ = 2 _∥f_ _∥_ [2] _k_ [+ 300] _[γ]_ _[t]_ [ln] [3] [(] _[t/δ]_ [)] _[,]_


_Then_

Pr � _∀T, ∀x ∈_ _D, |µ_ _T_ ( _**x**_ ) _−_ _f_ ( _**x**_ ) _| ≤_ _β_ _T_ [1] _[/]_ +1 [2] _[σ]_ _[T]_ [ (] _**[x]**_ [)] � _≥_ 1 _−δ._


**B.1. Concentration of Martingales**


In our analysis, we use the following Bernstein-type
concentration inequality for martingale differences,
due to Freedman (1975) (see also Theorem 3.15 of McDiarmid 1998).


**Theorem 7 (Freedman)** _Suppose X_ 1 _, . . ., X_ _T_ _is a_
_martingale difference sequence, and b is an uniform_
_upper bound on the steps X_ _i_ _. Let V denote the sum of_
_conditional variances,_


_n_
_V_ = � _i_ =1 **[Var]** [ (] _[X]_ _[i]_ _[ |][ X]_ [1] _[, . . ., X]_ _[i][−]_ [1] [)] _[.]_


_Then, for every a, v >_ 0 _,_



_−a_ [2]
Pr _X_ _i_ _≥_ _a and V ≤_ _v_ _≤_ exp
�� � � 2 _v_ + 2 _ab/_ 3


**B.2. Proof of Theorem 6**


We will show that:


Pr � _∀T, ∥µ_ _T_ _−_ _f_ _∥_ [2] _k_ _T_ _[≤]_ _[β]_ _[T]_ [ +1] � _≥_ 1 _−_ _δ._



_._
�



Theorem 6 then follows from (11). Recall that _ε_ _t_ =
_y_ _t_ _−_ _f_ ( _**x**_ _t_ ). We will analyze the quantity _Z_ _T_ =
_∥µ_ _T_ _−_ _f_ _∥_ [2] _k_ _T_ [, measuring the error of] _[ µ]_ _[T]_ [ as approxi-]
mation to _f_ under the RKHS norm of _H_ _k_ _T_ ( _D_ ). The
following lemma provides the connection with the information gain. This lemma is important since our
concentration argument is an inductive argument —
roughly speaking, we condition on getting concentration in the past, in order to achieve good concentration
in the future.


**Lemma 7.1** _We have that_

_T_ 2 _α_
� _t_ =1 [min] _[{][σ]_ _[−]_ [2] _[σ]_ _t_ [2] _−_ 1 [(] _**[x]**_ _[t]_ [)] _[, α][} ≤]_ log(1 + _α_ ) _[γ]_ _[T]_ _[,]_ _α >_ 0 _._


**Proof** We have that min _{r, α}_ _≤_ ( _α/_ log(1 +
_α_ )) log(1+ _r_ ). The statement follows from Lemma 5.3.


The next lemma bounds the growth of _Z_ _T_ . It is formulated in terms of normalized quantities:� � _ε_ _t_ = _ε_ _t_ _/σ_,
_f_ = _f/σ_, � _µ_ _t_ = _µ_ _t_ _/σ_, � _σ_ _t_ = _σ_ _t_ _/σ_ . Also, to ease notation, we will use _µ_ _t−_ 1, _σ_ _t−_ 1 as shorthand for _µ_ _t−_ 1 ( _**x**_ _t_ ),
_σ_ _t−_ 1 ( _**x**_ _t_ ).


**Lemma 7.2** _For all T ∈_ N _,_



Pr



Now, since � _ε_ _t_ is a martingale difference sequence with
respect to the histories _H_ _<t_ and _M_ _t_ _/ε_ � _t_ is deterministic given _H_ _<t_, _M_ _t_ is a martingale difference sequence
as well. Next, we show that with high probability,
the associated martingale [�] _[T]_ _t_ =1 _[M]_ _[t]_ [ does not grow too]
large.


**Lemma 7.3** _Given δ ∈_ (0 _,_ 1) _and β_ _t_ _as defined in in_
_Theorem 6, we have that_



�



_∀T,_

�



_T_
�



� _M_ _t_ _≤_ _β_ _T_ +1 _/_ 2


_t_ =1



_≥_ 1 _−_ _δ,_



_T_ _µ_ � _t−_ 1 _−_ _f_ [�] ( _**x**_ _t_ )

_t_ =1 _[ε]_ [�] _[t]_ � [2]



_T_
_Z_ _T_ _≤∥f_ _∥_ [2] _k_ [+ 2] �



1 + � _σ_ _t_ [2] _−_ 1



_T_ _σ_ � _t_ [2] _−_ 1
+ � _t_ =1 _[ε]_ [�] _t_ [2] 1 + � _σ_ _t_ [2] _−_ 1 _._



**Proof** If _**α**_ _t_ = ( _**K**_ _t_ + _σ_ [2] _**I**_ ) _[−]_ [1] _**y**_ _t_, then _µ_ _t_ ( _**x**_ ) =
_**α**_ _[T]_ _t_ _**[k]**_ _[t]_ [(] _**[x]**_ [).] Then, _⟨µ_ _T_ _, f_ _⟩_ _k_ = _**f**_ _[T]_ _T_ _**[α]**_ _[T]_ [,] _∥µ_ _T_ _∥_ [2] _k_ =
_**y**_ _[T]_ _T_ _**[α]**_ _[T]_ _[ −]_ _[σ]_ [2] _[∥]_ _**[α]**_ _[T]_ _[ ∥]_ [2] [.] Moreover, for _t ≤_ _T_, _µ_ _T_ ( _x_ _t_ ) =
_**δ**_ _[T]_ _t_ _**[K]**_ _[T]_ [(] _**[K]**_ _[T]_ [+] _[ σ]_ [2] _**[I]**_ [)] _[−]_ [1] _**[y]**_ _T_ [=] _[ y]_ _[t]_ _[−]_ _[σ]_ [2] _[α]_ _[t]_ [.] Since _Z_ _T_ =
_∥µ_ _T_ _−_ _f_ _∥_ _k_ + _σ_ _[−]_ [2] [ �] _t≤T_ [(] _[µ]_ _[T]_ [ (] _**[x]**_ _[t]_ [)] _[−]_ _[f]_ [(] _**[x]**_ _[t]_ [))] [2] [, we have that]


_Z_ _T_ = _∥f_ _∥_ [2] _k_ _[−]_ [2] _**[f]**_ _[ T]_ _T_ _**[α]**_ _[T]_ [+] _**[ y]**_ _[T]_ _T_ _**[α]**_ _[T]_ _[−]_ _[σ]_ [2] _[∥]_ _**[α]**_ _[T]_ _[∥]_ [2]

+ _σ_ _[−]_ [2] [ �] _[T]_ _k_

_t_ =1 [(] _[ε]_ _[t]_ _[ −]_ _[σ]_ [2] _[α]_ _[t]_ [)] [2] [ =] _[ ∥][f]_ _[∥]_ [2]


_−_
_**y**_ _[T]_ _T_ [(] _**[K]**_ _[T]_ [+] _[ σ]_ [2] _**[I]**_ [)] _[−]_ [1] _**[y]**_ _T_ [+] _[ σ]_ _[−]_ [2] _[∥]_ _**[ε]**_ _[T]_ _[∥]_ [2] _[.]_



The proof is given below in Section B.3. Equipped
with this lemma, we can prove Theorem 6.


**Proof** [of Theorem 6] It suffices to show that the highprobability event described in Lemma 7.3 is contained
in the support of _E_ _T_ for every _T_ . We prove the latter
by induction on _T_ .


By Lemma 7.2 and the definition of _β_ 1, we know that
_Z_ 0 _≤∥f_ _∥_ _k_ _≤_ _β_ 1 . Hence _E_ 0 = 1 always. Now suppose
the high-probability event of Lemma 7.3 holds, in particular [�] _[T]_ _t_ =1 _[M]_ _[t]_ _[ ≤]_ _[β]_ _[T]_ [ +1] _[/]_ [2. For the inductive hypoth-]
esis, assume _E_ _T −_ 1 = 1. Using this and Lemma 7.2:



_T_
�


_t_ =1



_ε_ � [2] _t_ _[σ]_ [�] _t_ [2] _−_ 1
1 + � _σ_ _t_ [2] _−_ 1



_T_
�


_t_ =1



� �
_ε_ _t_ ( _µ_ _t−_ 1 _−_ _f_ [�] ( _**x**_ _t_ ))

+
1 + � _σ_ _t_ [2] _−_ 1



Now, _−_ _**y**_ _[T]_ _T_ [(] _**[K]**_ _[T]_ [ +] _[σ]_ [2] _**[I]**_ [)] _[−]_ [1] _**[y]**_ _T_ = 2 log _._ _P_ ( _**y**_ _T_ ), where “=” _._
means that we drop determinant terms, thus concentrate on quadratic functions. Since log _P_ ( _**y**_ _T_ ) =
� _t_ [log] _[ P]_ [(] _[y]_ _[t]_ _[|]_ _**[y]**_ _<t_ [) =][ �] _t_ [log] _[ N]_ [(] _[y]_ _[t]_ _[|][µ]_ _[t][−]_ [1] [(] _**[x]**_ _[t]_ [)] _[, σ]_ _t_ [2] _−_ 1 [(] _**[x]**_ _[t]_ [) +]



_Z_ _T_ _≤∥f_ _∥_ [2] _k_ [+ 2]



_T_ �

� _σ_ _t_ [2] _−_ 1

� _t_ =1 _ε_ [2] _t_ 1 + � _σ_ _t_ [2] _−_ 1



_T_
�



_T_
� _M_ _t_ +


_t_ =1



_T_
�



� _t_ [log] _[ P]_ [(] _[y]_ _[t]_ _[|]_ _**[y]**_ _<t_ [) =][ �] _t_ [log] _[ N]_ [(] _[y]_ _[t]_ _[|][µ]_ _[t][−]_ [1] [(] _**[x]**_ _[t]_ [)] _[, σ]_ _t_ [2] _−_ 1 [(] _**[x]**_ _[t]_ [) +]

_σ_ [2] ), we have that



=
_∥f_ _∥_ [2] _k_ [+]



_T_
� min _{σ_ � _t_ [2] _−_ 1 _[,]_ [ 1] _[}]_


_t_ =1



_T_
�



_t_ [log] _[ P]_ [(] _[y]_ _[t]_ _[|]_ _**[y]**_ _<t_ [) =][ �]



( _y_ _t_ _−_ _µ_ _t−_ 1 ) [2]
_t_ [2] [2]



_≤∥f_ _∥_ [2] _k_ [+] _[ β]_ _[T]_ [ +1] _[/]_ [2 +]



_−_
_**y**_ _[T]_ _T_ [(] _**[K]**_ _[T]_ [+] _[ σ]_ [2] _**[I]**_ [)] _[−]_ [1] _**[y]**_ _T_ [=] _[ −]_ �



_σ_ [2] + _σ_ _t_ [2] _−_ 1



_µ_ _t−_ 1 _−_ _f_ ( _**x**_ _t_ )
_t_ _[ε]_ _[t]_ [2] [2]



_ε_ [2] _t_ _[σ]_ [�] _t_ [2] _−_ 1 _−_ _R_
_t_ _σ_ [2] + _σ_ _t_ [2] _−_ 1



= 2 �



_−_ 1 _−_ _t_ _−_

_σ_ [2] + _σ_ _t_ [2] _−_ 1 �



with _R_ = � _t_ [(] _[µ]_ _[t][−]_ [1] _[ −]_ _[f]_ [(] _**[x]**_ _[t]_ [))] [2] _[/]_ [(] _[σ]_ [2] [ +] _[ σ]_ _t_ [2] _−_ 1 [)] _≥_ 0.

Dropping _−R_ and changing to normalized quantities
concludes the proof.


We now define a useful martingale difference sequence.
First, it is convenient to define an “escape event” _E_ _T_

as:
_E_ _T_ = I _{Z_ _t_ _≤_ _β_ _t_ +1 for all _t ≤_ _T_ _}_


where I _{·}_ is the indicator function. Define the random
variables _M_ _t_ by


�
� _µ_ _t−_ 1 _−_ _f_ [�] ( _**x**_ _t_ )
_M_ _t_ = 2 _ε_ _t_ _E_ _t−_ 1 1 + � _σ_ _t_ [2] _−_ 1 _._



_≤∥f_ _∥_ [2] _k_ [+] _[ β]_ _[T]_ [ +1] _[/]_ [2 + (2] _[/]_ [ log 2)] _[γ]_ _[T]_ _[≤]_ _[β]_ _[T]_ [ +1] _[.]_


The equality in the second step uses the inductive
hypothesis. Thus we have shown _E_ _T_ = 1, completing
the induction.


**B.3. Concentration**


What remains to be shown is Lemma 7.3. While the
step sizes _|M_ _t_ _|_ are uniformly bounded, a standard application of the Hoeffding-Azuma inequality leads to
a bound of _T_ [3] _[/]_ [4], too large for our purpose. We use
the more specific Theorem 7 instead, which requires
to control the conditional variances rather than the

marginal variances which can be much larger.


**Proof** [of Lemma 7.3] Let us first obtain upper bounds


on the step sizes of our martingale.


�
� _|µ_ _t−_ 1 _−_ _f_ [�] ( _**x**_ _t_ ) _|_
_|M_ _t_ _|_ = 2 _|ε_ _t_ _|E_ _t−_ 1

1 + � _σ_ _t_ [2] _−_ 1


�
� _β_ _t_ [1] _[/]_ [2] _σ_ _t−_ 1
_≤_ 2 _|ε_ _t_ _|E_ _t−_ 1
1 + � _σ_ _t_ [2] _−_ 1


� �
_≤_ 2 _|ε_ _t_ _|E_ _t−_ 1 _β_ _t_ [1] _[/]_ [2] min _{σ_ _t−_ 1 _,_ 1 _/_ 2 _},_ (12)


where the first inequality follows from the definition
of _E_ _t_ . Moreover, _r/_ (1 + _r_ [2] ) _≤_ min _{r,_ 1 _/_ 2 _}_ for _r ≥_ 0.
Therefore, _|M_ _t_ _| ≤_ _β_ _T_ [1] _[/]_ [2], since _|ε_ � _t_ _| ≤_ 1 and _β_ _t_ in nondecreasing. Next, we bound the sum of the conditional
variances of the martingale:


_T_
_V_ _T_ := � _t_ =1 **[Var]** [ (] _[M]_ _[t]_ _[ |][ M]_ [1] _[ . . . M]_ _[t][−]_ [1] [)]


_T_
_≤_ � _t_ =1 [4] _[|][ε]_ [�] _[t]_ _[|]_ [2] _[E]_ _[t][−]_ [1] _[β]_ _[t]_ [ min] _[{][σ]_ [�] _t_ [2] _−_ 1 _[,]_ [ 1] _[/]_ [4] _[}]_

_≤_ 4 _β_ _T_ � _Tt_ =1 _[E]_ _[t][−]_ [1] [ min] _[{][σ]_ [�] _t_ [2] _−_ 1 _[,]_ [ 1] _[/]_ [4] _[}]_ _|ε_ � _t_ _| ≤_ 1


_≤_ 9 _β_ _T_ _γ_ _T_ _._


In the last line, we used Lemma 7.1 with _α_ = 1 _/_ 4, noting that 8 _α/_ log(1 + _α_ ) _≤_ 9. Since we have established
that the sum of conditional variances, _V_ _T_, is always
bounded by 9 _β_ _T_ _γ_ _T_, we can apply Theorem 7 with parameters _a_ = _β_ _T_ +1 _/_ 2, _b_ = _β_ _T_ [1] _[/]_ +1 [2] [and] _[ v]_ [ = 9] _[β]_ _[T]_ _[ γ]_ _[T]_ [ to]
get


_T_
Pr

_t_ =1 _[M]_ _[t]_ _[ ≥]_ _[β]_ _[T]_ [ +1] _[/]_ [2]

�� �



bound:



_T_
Pr

_t_ =1 _[M]_ _[t]_ _[ ≥]_ _[β]_ _[T]_ [ +1] _[/]_ [2 for some] _[ T]_

�� �



_T_
_T ≥_ 1 [Pr] �� _t_



_≤_
�



_T_

_t_ =1 _[M]_ _[t]_ _[ ≥]_ _[β]_ _[T]_ [ +1] _[/]_ [2]
�



_≤_
� _T ≥_ 2 _[δ/T]_ [ 2] _[ ≤]_ _[δ]_ [(] _[π]_ [2] _[/]_ [6] _[ −]_ [1)] _[ ≤]_ _[δ,]_



_T_
= Pr

_t_ =1 _[M]_ _[t]_ _[ ≥]_ _[β]_ _[T]_ [ +1] _[/]_ [2 and] _[ V]_ _[T]_ _[ ≤]_ [9] _[β]_ _[T]_ _[ γ]_ _[T]_

��



�



_≤_ exp


= exp



_−_ ( _β_ _T_ +1 _/_ 2) [2]
� 2(9 _β_ _T_ _γ_ _T_ ) + [2] 3 [(] _[β]_ _[T]_ [ +1]



_−β_ _T_ +1
� 72 _γ_ _T_ + [4] 3 _[β]_ _T_ [1] _[/]_ +1 [2]




[2] 3 [(] _[β]_ _[T]_ [ +1] _[/]_ [2)] _[β]_ _T_ [1] _[/]_ +1 [2]



�



2(9 _β_ _T_ _γ_ _T_ ) + [2]



�



��



_,_ exp
�



_−_ 3 _β_ _T_ [1] _[/]_ + [2] 1

8
�



_≤_ max



�



_−β_ _T_ +1
exp
� 144 _γ_ _T_



144 _γ_ _T_



_._



Note that our choice of _β_ _T_ +1 satisfies:


2 [�]
max �144 _γ_ _T_ log( _T_ [2] _/δ_ ) _,_ �(8 _/_ 3) log( _T_ [2] _/δ_ )� _≤_ _β_ _T_ +1 _._


Therefore, the previous probability is bounded by
_δ/T_ [2], whereas the last inequality follows from the definition of _β_ _T_ +1 . With a final application of the union



completing the proof of Lemma 7.3.


**C. Bounds on Information Gain**


In this section, we show how to bound _γ_ _T_, the maximum information gain after _T_ rounds, for compact
_D ⊂_ R _[d]_ (assumptions of Theorem 2) and several commonly used covariance functions. In this section, we
assume [4] that _k_ ( _**x**_ _,_ _**x**_ ) = 1 for all _**x**_ _∈_ _D_ .


The plan of attack is as follows. First, we note that the
argument of _γ_ _T_, I( _**y**_ _A_ ; _**f**_ _A_ ) is a submodular function,
so _γ_ _T_ can be bounded by the value obtained by greedy
maximization. Next, we use a discretization _D_ _T_ _⊂_ _D_
with _n_ _T_ = _|D_ _T_ _|_ = _T_ _[τ]_ with nearest neighbour distance
_o_ (1), consider the kernel matrix _**K**_ _D_ _T_ _∈_ R _[n]_ _[T]_ _[ ×][n]_ _[T]_, and
bound _γ_ _T_ by an expression involving the eigenvalues
_{λ_ [ˆ] _t_ _}_ of this matrix, which is done by a further relaxation of the greedy procedure. Finally, we bound
this empirical expression in terms of the kernel operator eigenvalues of _k_ w.r.t. the uniform distribution on
_D_ . Asymptotic expressions for the latter are reviewed
in Seeger et al. (2008), which we plug in to obtain
our results. A key step in this argument is to ensure
the existence of a discretization _D_ _T_, for which tails
of the empirical spectrum can be bounded by tails of
the process spectrum. We will invoke the probabilistic
method for that.


**C.1. Greedy Maximization and Discretization**


In this section, we fix _T ∈_ N and assume the existence
of a discretization _D_ _T_ _⊂_ _D_, _n_ _T_ = _|D_ _T_ _|_ on the order
of _T_ _[τ]_, such that:


_∀_ _**x**_ _∈_ _D ∃_ [ _**x**_ ] _T_ _∈_ _D_ _T_ : _∥_ _**x**_ _−_ [ _**x**_ ] _T_ _∥_ = _O_ ( _T_ _[−][τ/d]_ ) _._ (13)


We come back to the choice of _D_ _T_ below. We restrict
the information gain to subsets _A ⊂_ _D_ _T_ :


_γ_ ˜ _T_ = max
_A⊂D_ _T_ _,|A|_ = _T_ [I(] _**[y]**_ _[A]_ [;] _**[ f]**_ _[ A]_ [)] _[.]_


Of course, ˜ _γ_ _T_ _≤_ _γ_ _T_, but we can bound the slack.


4 Without loss in generality. We use this assumption
below to ensure that _n_ _[−]_ _T_ [1] [tr] _**[K]**_ _[D]_ _T_ [=] � _k_ ( _**x**_ _,_ _**x**_ ) _d_ _**x**_ . If _k_ ( _**x**_ _,_ _**x**_ )
is not constant, this is approximately true by the law of
large numbers, and our result below remains valid.


**Lemma 7.4** _Under the assumptions of Theorem 2,_
_the information gain F_ _T_ ( _{_ _**x**_ _t_ _}_ ) = (1 _/_ 2) log _|_ _**I**_ +
_σ_ _[−]_ [2] _**K**_ _{_ _**x**_ _t_ _}_ _| is uniformly Lipschitz-continuous in each_
_component_ _**x**_ _t_ _∈_ _D._


**Proof** The assumptions of Theorem 2 imply that
the kernel _K_ ( _**x**_ _,_ _**x**_ _[′]_ ) is continuously differentiable.
The result follows from the fact that _F_ _T_ ( _{_ _**x**_ _t_ _}_ ) is
continuously differentiable in the kernel matrix _**K**_ _{_ _**x**_ _t_ _}_ .


**Lemma 7.5** _Let D_ _T_ _be a discretization of D such that_
_(13) holds. Under the assumptions of Theorem 2, we_
_have that_


0 _≤_ _γ_ _T_ _−_ _γ_ ˜ _T_ = _O_ ( _T_ [1] _[−][τ/d]_ ) _._


**Proof** Fix _T ∈_ N, and let _A_ = _{_ _**x**_ 1 _, . . .,_ _**x**_ _T_ _}_ be a
maximizer for _γ_ _T_ . Consider neighbours [ _**x**_ _t_ ] _T_ _∈_ _D_ _T_
according to (13), [ _A_ ] _T_ = _{_ [ _**x**_ _t_ ] _T_ _}_ . Then,


˜
0 _≤_ _γ_ _T_ _−γ_ _T_ _≤_ _γ_ _T_ _−_ I( _**y**_ [ _A_ ] _T_ ; _**f**_ [ _A_ ] _T_ ) = _F_ _T_ ( _A_ ) _−F_ _T_ ([ _A_ ] _T_ ) _,_


where _F_ _T_ ( _{_ _**x**_ _t_ _}_ ) = (1 _/_ 2) log _|_ _**I**_ + _σ_ _[−]_ [2] _**K**_ _{_ _**x**_ _t_ _}_ _|_ . By
Lemma 7.4, _F_ _T_ is uniformly Lipschitz-continuous
in each component, so that _|γ_ _T_ _−_ I( _**y**_ [ _A_ ] _T_ ; _**f**_ [ _A_ ] _T_ ) _|_ =
_O_ ( _T_ max _t_ _∥_ _**x**_ _t_ _−_ [ _**x**_ _t_ ] _T_ _∥_ ) = _O_ ( _T_ [1] _[−][τ/d]_ ) by (13) and the
mean value theorem.


We concentrate on ˜ _γ_ _T_ in the sequel. Let _**K**_ _D_ _T_ =

[ _k_ ( _**x**_ _,_ _**x**_ _[′]_ )] _**x**_ _,_ _**x**_ _′_ _∈D_ _T_ be the kernel matrix over the entire _D_ _T_, and _**K**_ _D_ _T_ = _**U**_ **Λ** [ˆ] _**U**_ _[T]_ its eigendecomposition, with _λ_ [ˆ] 1 _≥_ _λ_ [ˆ] 2 _≥· · · ≥_ 0 and _**U**_ = [ _**u**_ 1 _**u**_ 2 _. . ._ ]
orthonormal. Here, if _T > n_ _T_, define _λ_ [ˆ] _t_ = 0 for
_t_ = _n_ _T_ + 1 _, . . ., T_ . Information gain maximization
over a finite _D_ _T_ can be described in terms of a simple linear-Gaussian model over the unknown _**f**_ _∈_ R _[n]_ _[T]_,
with prior _P_ ( _**f**_ ) = _N_ ( **0** _,_ _**K**_ _D_ _T_ ) and likelihood potentials _P_ ( _y_ _t_ _|_ _**f**_ ) = _N_ ( _**v**_ _[T]_ _t_ _**[f]**_ _[, σ]_ [2] [) with unit-norm features,]
_∥_ _**v**_ _t_ _∥_ = 1. With the following lemma, we upper-bound

˜
_γ_ _T_ by way of two relaxations.


**Lemma 7.6** _For any T ≥_ 1 _, we have that_



˜ 1 _/_ 2
_γ_ _T_ _≤_ max
1 _−_ _e_ _[−]_ [1] _m_ 1 _,...,m_ _T_



_T_
� _t_ =1 [log(1 +] _[ σ]_ _[−]_ [2] _[m]_ _[t]_ _[λ]_ [ˆ] _[t]_ [)] _[,]_



_subject to m_ _t_ _∈_ N _,_ [�] _t_ _[m]_ _[T]_ [ =] _[ T]_ _[, where]_ [ ˆ] _[λ]_ [1] _[ ≥]_ _[λ]_ [ˆ] [2] _[ ≥]_ _[. . .]_
_is the spectrum of the kernel matrix_ _**K**_ _D_ _T_ _. Here, if_
_T > n_ _T_ _, then m_ _t_ = 0 _for t > n_ _T_ _._


**Proof** As shown by Krause & Guestrin (2005),
the function _F_ ( _A_ ) = I( _**y**_ _A_ ; _**f**_ ) is submodular. In



the particular case considered here, this can be seen
as follows: _F_ ( _A_ ) = H( _**y**_ _A_ ) _−_ H( _**y**_ _A_ _|_ _**f**_ ), where
the entropy H( _**y**_ _A_ ) is a (not-necessarily monotonic)
submodular function in _A_, and since the noise is
conditionally independent given _**f**_, H( _**y**_ _A_ _|_ _**f**_ ) is
an additive (modular) function in _A_ . Subtracting
a modular function preserves submodularity, thus
_F_ ( _A_ ) is submodular. Furthermore, the information
gain is monotonic in _A_ (i.e., _F_ ( _A_ ) _≤_ _F_ ( _B_ ) whenever
_A ⊆_ _B_ ) (Cover & Thomas, 1991). Thus, we can
apply the result of Nemhauser et al. (1978) [5] which
guarantees that ˜ _γ_ _T_ is upper-bounded by 1 _/_ (1 _−_ 1 _/e_ )
times the value the greedy maximization algorithm
attains. The latter chooses features of the form
_**v**_ _t_ = _**δ**_ _**x**_ _t_ = [I _{_ _**x**_ = _**x**_ _t_ _}_ ] in each round, _**x**_ _t_ _∈_ _D_ _T_ . We
upper-bound the greedy maximum once more by
relaxing these constraints to _∥_ _**v**_ _t_ _∥_ = 1 only. In the
remainder of the proof, we concentrate on this relaxed
greedy procedure. Suppose that up to round _t_, it chose
_**v**_ 1 _, . . .,_ _**v**_ _t−_ 1 . The posterior _P_ ( _**f**_ _|_ _**y**_ _t−_ 1 ) has inverse
covariance matrix **Σ** _[−]_ _t−_ [1] 1 [=] _**[ K]**_ _[−]_ _D_ [1] _T_ [+] _[ σ]_ _[−]_ [2] _**[V]**_ _[ t][−]_ [1] _**[V]**_ _[ T]_ _t−_ 1 [,]
_**V**_ _t−_ 1 = [ _**v**_ 1 _. . ._ _**v**_ _t−_ 1 ], and the greedy procedure
selects _**v**_ so to maximize the variance _**v**_ _[T]_ **Σ** _t−_ 1 _**v**_ : the
eigenvector corresponding to **Σ** _t−_ 1 ’s largest eigenvalue
(by the Rayleigh-Ritz theorem). Since **Σ** 0 = _**K**_ _D_ _T_,
then _**v**_ 1 = _**u**_ 1 . Moreover, if all _**v**_ _t_ _′_, _t_ _[′]_ _< t_, have
been chosen among _**U**_ ’s columns, then by the inverse
covariance expression just given, _**K**_ _D_ _T_ and **Σ** _t−_ 1 have
the same eigenvectors, so that _**v**_ _t_ is a column of _**U**_ as
well. For example, if _**v**_ _t_ = _**u**_ _j_, then comparing **Σ** _t−_ 1
and **Σ** _t_, all eigenvalues other than the _j_ -th remain
the same, while the latter is shrunk. Therefore,
after _T_ rounds of the relaxed greedy procedure:
_**v**_ _t_ _∈{_ _**u**_ 1 _, . . .,_ _**u**_ min _{T,n_ _T_ _}_ _}_, _t_ = 1 _, . . ., T_ : at most the
leading _T_ eigenvectors of _**K**_ _D_ _T_ can have been selected
(possibly multiple times). If _m_ _t_ denotes the number
that the _t_ -th column of _**U**_ has been selected, we obtain the theorem statement by a final bounding step.


**C.2. From Empirical to Process Eigenvalues**


The final step will be to relate the empirical spectrum _{λ_ [ˆ] _t_ _}_ to the kernel operator spectrum. Since
log(1 + _σ_ _[−]_ [2] _m_ _t_ _λ_ [ˆ] _t_ ) _≤_ _σ_ _[−]_ [2] _m_ _t_ _λ_ [ˆ] _t_ in Theorem 7.6, we will
mainly be interested in relating the tail sums of the
spectra. Let _µ_ ( _**x**_ ) = _V_ ( _D_ ) _[−]_ [1] I _{_ _**x**_ _∈D}_ be the uniform
distribution on _D_, _V_ ( _D_ ) = � _**x**_ _∈D_ _[d]_ _**[x]**_ [, and assume that]

_k_ is continuous. Note that � _k_ ( _**x**_ _,_ _**x**_ ) _µ_ ( _**x**_ ) _d_ _**x**_ = 1 by
our assumption _k_ ( _**x**_ _,_ _**x**_ ) = 1, so that _k_ is Hilbert

5 While the result of Nemhauser et al. (1978) is stated
in terms of finite sets, it extends to infinite sets as long as
the greedy selection can be implemented efficiently.


Schmidt on _L_ 2 ( _µ_ ). Then, Mercer’s theorem (Wahba,
1990) states that the corresponding kernel operator
has a discrete eigenspectrum _{_ ( _λ_ _s_ _, φ_ _s_ ( _·_ )) _}_, and


_k_ ( _**x**_ _,_ _**x**_ _[′]_ ) = � _s≥_ 1 _[λ]_ _[s]_ _[φ]_ _[s]_ [(] _**[x]**_ [)] _[φ]_ _[s]_ [(] _**[x]**_ _[′]_ [)] _[,]_



_n_ _T_ = _|D_ _T_ _|. Then, for any T_ _∗_ = 1 _, . . .,_ min _{T, n_ _T_ _}:_



˜ 1 _/_ 2
_γ_ _T_ _≤_ max
1 _−_ _e_ _[−]_ [1] _r_ =1 _,...,T_



_T_ _∗_ log( _rn_ _T_ _/σ_ [2] )
�



where _λ_ 1 _≥_ _λ_ 2 _≥· · · ≥_ 0, and E _µ_ [ _φ_ _s_ ( _**x**_ ) _φ_ _t_ ( _**x**_ )] =
_δ_ _s,t_ . Moreover, [�] _s_ 1 _[λ]_ _s_ [2] _<_ _∞_, and the expan


_δ_ _s,t_ . Moreover, [�] _s≥_ 1 _[λ]_ _s_ [2] _<_ _∞_, and the expan
sion of _k_ converges absolutely and uniformly on _D ×_
_D_ . Note that [�] _s_ 1 _[λ]_ _[s]_ [ =][ �] _s_ 1 _[λ]_ _[s]_ [ E] _[µ]_ [[] _[φ]_ _[s]_ [(] _**[x]**_ [)] [2] [] =]



_D_ . Note that [�] _s≥_ 1 _[λ]_ _[s]_ [ =][ �] _s≥_ 1 _[λ]_ _[s]_ [ E] _[µ]_ [[] _[φ]_ _[s]_ [(] _**[x]**_ [)] [2] [] =]

� _K_ ( _**x**_ _,_ _**x**_ ) _µ_ ( _**x**_ ) _d_ _**x**_ = 1. In order to proceed from Theorem 7.6, we have to pick a discretization _D_ _T_ for which
(13) holds, and for which [�] _t>T_ _[λ]_ [ˆ] _[t]_ [ is not much larger]



_s≥_ 1 _[λ]_ _[s]_ [ =][ �]



(13) holds, and for which [�] _t>T_ _∗_ _[λ]_ [ˆ] _[t]_ [ is not much larger]

than [�]

_t>T_ _∗_ _[λ]_ _[t]_ [. With the following lemma, we deter-]
mine sizes _n_ _T_ for which such discretizations exist.



**Lemma 7.7** _Fix T ∈_ N _, δ >_ 0 _and ε >_ 0 _._ _There_
_exists a discretization D_ _T_ _⊂_ _D of size_



_n_ _T_ = _V_ ( _D_ )( _ε/√d_ ) _[−][d]_ [log(1 _/δ_ )+ _d_ log( _√_



_d/ε_ )+log _V_ ( _D_ )]



+ ( _T −_ _r_ ) _σ_ _[−]_ [2] [ �] _[n]_ _t_ = _[T]_ _T_ _∗_ +1 _λ_ ˆ _t_ � _._


**Proof** We split the right hand side in Lemma 7.6
at _t_ = _T_ _∗_ . Let _r_ = [�] _t≤T_ _∗_ _[m]_ _[t]_ [.] For _t ≤_ _T_ _∗_ :
log(1 + _m_ _t_ _λ_ [ˆ] _t_ _/σ_ [2] ) _≤_ log( _rn_ _T_ _/σ_ [2] ), since _λ_ [ˆ] _t_ _≤_ _n_ _T_ . For
_t > T_ _∗_ : log(1+ _m_ _t_ _λ_ [ˆ] _t_ _/σ_ [2] ) _≤_ _m_ _t_ _λ_ [ˆ] _t_ _/σ_ [2] _≤_ ( _T_ _−r_ ) _λ_ [ˆ] _t_ _/σ_ [2] .


The following theorem describes our “recipe” for obtaining bounds on _γ_ _T_ for a particular kernel _k_, given
that tail bounds on _B_ _k_ ( _T_ _∗_ ) = [�] _s>T_ _∗_ _[λ]_ _[s]_ [ are known.]


**Theorem 8** _Suppose that D ⊂_ R _[d]_ _is compact, and_
_k_ ( _**x**_ _,_ _**x**_ _[′]_ ) _is a covariance function for which the ad-_
_ditional assumption of Theorem 2 holds._ _Moreover,_
_let B_ _k_ ( _T_ _∗_ ) = [�] _s>T_ _∗_ _[λ]_ _[s]_ _[, where][ {][λ]_ _[s]_ _[}][ is the operator]_

_spectrum of k with respect to the uniform distribution_
_over D. Pick τ >_ 0 _, and let n_ _T_ = _C_ 4 _T_ _[τ]_ (log _T_ ) _with_
_C_ 4 = 2 _V_ ( _D_ )(2 _τ_ + 1) _. Then, the following bound holds_

_true:_



_which fulfils the following requirements:_


_• ε-denseness: For any_ _**x**_ _∈_ _D, there exists_ [ _**x**_ ] _T_ _∈_
_D_ _T_ _such that ∥_ _**x**_ _−_ [ _**x**_ ] _T_ _∥≤_ _ε._


_• If_ spec( _**K**_ _D_ _T_ ) = _{λ_ [ˆ] 1 _≥_ _λ_ [ˆ] 2 _≥_ _. . . }, then for any_
_T_ _∗_ = 1 _, . . ., n_ _T_ _:_



+ _C_ 4 _σ_ _[−]_ [2] (1 _−_ _r/T_ )(log _T_ ) � _T_ _[τ]_ [+1] _B_ _k_ ( _T_ _∗_ ) + 1� [�]


+ _O_ ( _T_ [1] _[−][τ/d]_ )


_for any T_ _∗_ _∈{_ 1 _, . . ., n_ _T_ _}._



1 _/_ 2
_γ_ _T_ _≤_ max
1 _−_ _e_ _[−]_ [1] _r_ =1 _,...,T_



_T_ _∗_ log( _rn_ _T_ _/σ_ [2] )
�



_T_ _∗_
_n_ _[−]_ _T_ [1] �



_t_ =1 _[λ]_ _[t]_ _[ −]_ _[δ.]_



_Tt_ =1 _∗_ _λ_ ˆ _t_ _≥_ � _Tt_ _∗_



dependently at random, then **Proof** First, if we draw _n_ _T_ samples ˜ _D_ _T_ = _{_ _**xx**_ ˜ _jj_ _∼}_ is _µ ε_ (-dense _**x**_ ) inwith probability _≥_ 1 _−_ _δ_ . Namely, cover _D_ with
_N_ = _V_ ( _D_ )( _ε/√d_ ) _[−][d]_ hypercubes of sidelength _ε/√d_,

within which the maximum Euclidean distance is _ε_ .

The probability of not hitting at least one cell is upperbounded by _N_ (1 _−_ 1 _/N_ ) _[n]_ _[T]_ . Since log(1 _−_ 1 _/N_ ) _≤_
_−_ 1 _/N_, this is upper-bounded by _δ_ if _n_ _T_ _≥_ _N_ log( _N/δ_ ).


Now, let _S_ = _n_ _[−]_ _T_ [1] � _Tt_ =1 _∗_ _[λ]_ [ˆ] _[t]_ [.] Shawe-Taylor et al.
(2005) show that E[ _S_ ] _≥_ � _Tt_ =1 _∗_ _[λ]_ _[t]_ [.] If _C_ is the
event _{D_ _T_ is _ε−_ dense _}_, then Pr( _C_ ) _≥_ 1 _−_ _δ_ . Since
_S ≤_ _n_ _[−]_ _T_ [1] [tr] _**[K]**_ _[D]_ _T_ = 1 in any case, we have that
E[ _S|C_ ] _≥_ E[ _S_ ] _−_ Pr( _C_ _[c]_ ) _≥_ [�] _[T]_ _t_ =1 _[∗]_ _[λ]_ _[t]_ _[ −]_ _[δ]_ [.] By the
probabilistic method, there must exist some _D_ _T_ for
which _C_ and the latter inequality holds.


The following lemma, the equivalent of Theorem 4 in
the context here, is a direct consequence of Lemma 7.6.


**Lemma 7.8** _Let D_ _T_ _be some discretization of D,_



**Proof** Let _ε_ = _d_ [1] _[/]_ [2] _T_ _[−][τ/d]_ and _δ_ = _T_ _[−]_ [(] _[τ]_ [+1)] .

Lemma 7.7 provides the existence of a discretization _D_ _T_ of size _n_ _T_ which is _ε_ -dense,
and for which _n_ _[−]_ _T_ [1] � _Tt_ =1 _∗_ _[λ]_ [ˆ] _[t]_ _≥_ � _Tt_ =1 _∗_ _[λ]_ _[t]_ _[ −]_ _[δ]_ [.]
Since _n_ _[−]_ _T_ [1] � _nt_ =1 _T_ _[λ]_ [ˆ] _[t]_ = 1 = � _t≥_ 1 _[λ]_ _[t]_ [,] then

� _t>T_ _∗_ _[λ]_ [ˆ] _[t]_ _≤_ _B_ _k_ ( _T_ _∗_ ) + _δ_ . The statement follows

by using Lemma 7.8 with these bounds, and finally
employing Lemma 7.5.


**C.3. Proof of Theorem 5**


In this section, we instantiate Theorem 8 in order to
obtain bounds on _γ_ _T_ for Squared Exponential and
Mat´ern kernels, results which are summarized in Theorem 5.


Squared Exponential Kernel


For the Squared Exponential kernel _k_, _B_ _k_ ( _T_ _∗_ ) is given
by Seeger et al. (2008). While _µ_ ( _**x**_ ) was Gaussian


there, the same decay rate holds for _λ_ _s_ w.r.t. uniform
_µ_ ( _**x**_ ), while constants might change. In hindsight, it
turns out that _τ_ = _d_ is the optimal choice for the
discretization size, rendering the second term in Theorem 5 to be _O_ (1), which is subdominant and will be
neglected in the sequel. We have that _λ_ _s_ _≤_ _cB_ _[s]_ [1] _[/d]_

with _B <_ 1. Following their analysis,


_B_ _k_ ( _T_ _∗_ ) _≤_ _c_ ( _d_ !) _α_ _[−][d]_ _e_ _[−][β]_ [ �] _[d][−]_ [1]

_j_ =0 [(] _[j]_ [!)] _[−]_ [1] _[β]_ _[j]_ _[,]_


where _α_ = _−_ log _B, β_ = _αT_ _∗_ [1] _[/d]_ . Therefore, _B_ _k_ ( _T_ _∗_ ) =
_O_ ( _e_ _[−][β]_ _β_ _[d][−]_ [1] ), _β_ = _αT_ _∗_ [1] _[/d]_ .


We have to pick _T_ _∗_ such that _e_ _[−][β]_ is not much larger
than ( _Tn_ _T_ ) _[−]_ [1] . Suppose that _T_ _∗_ = [log( _Tn_ _T_ ) _/α_ ] _[d]_, so
that _e_ _[−][β]_ = ( _Tn_ _T_ ) _[−]_ [1], _β_ = log( _Tn_ _T_ ). The bound be
comes



max
_r_ =1 _,...,T_



_T_ _∗_ log( _rn_ _T_ _/σ_ [2] )
�


+ _σ_ _[−]_ [2] (1 _−_ _r/T_ )( _C_ 5 _β_ _[d][−]_ [1] + _C_ 4 (log _T_ ))
�



with _n_ _T_ = _C_ 4 _T_ _[d]_ (log _T_ ). The first part dominates,
so that _r_ = _T_ and _γ_ _T_ = _O_ ([log( _T_ _[d]_ [+1] (log _T_ ))] _[d]_ [+1] ) =
_O_ ((log _T_ ) _[d]_ [+1] ). This should be compared with
E[I( _**y**_ _T_ ; _**f**_ _T_ )] = _O_ ((log _T_ ) _[d]_ [+1] ) given by Seeger et al.
(2008), where the _**x**_ _t_ are drawn independently from
a Gaussian base distribution. At least restricted to

a compact set _D_, we obtain the same expression to
leading order for max _{_ _**x**_ _t_ _}_ I( _**y**_ _T_ ; _**f**_ _T_ ).


Mat´ern Kernels


For Mat´ern kernels _k_ with roughness parameter _ν_,
_B_ _k_ ( _T_ _∗_ ) is given by Seeger et al. (2008) for the uniform base distribution _µ_ ( _**x**_ ) on _D_ . Namely, _λ_ _s_ _≤_
_cs_ _[−]_ [(2] _[ν]_ [+] _[d]_ [)] _[/d]_ for almost all _s ∈_ N, and _B_ _k_ ( _T_ _∗_ ) =
_O_ ( _T_ _∗_ [1] _[−]_ [(2] _[ν]_ [+] _[d]_ [)] _[/d]_ ). To match terms in the ˜ _γ_ _T_ bound,
we choose _T_ _∗_ = ( _Tn_ _T_ ) _[d/]_ [(2] _[ν]_ [+] _[d]_ [)] (log( _Tn_ _T_ )) _[κ]_ ( _κ_ chosen
below), so that the bound becomes



UCB algorithm is guaranteed to be no-regret in this
case with arbitrarily high probability.


How does this bound compare to the bound on
E[I( _**y**_ _T_ ; _**f**_ _T_ )] given by Seeger et al. (2008)? Here, _γ_ _T_ =
_O_ ( _T_ _[d]_ [(] _[d]_ [+1)] _[/]_ [(2] _[ν]_ [+] _[d]_ [(] _[d]_ [+1))] (log _T_ )), while E[I( _**y**_ _T_ ; _**f**_ _T_ )] =
_O_ ( _T_ _[d/]_ [(2] _[ν]_ [+] _[d]_ [)] (log _T_ ) [2] _[ν/]_ [(2] _[ν]_ [+] _[d]_ [)] ).


Linear Kernel


For linear kernels _k_ ( _**x**_ _,_ _**x**_ _[′]_ ) = _**x**_ _[T]_ _**x**_ _[′]_, _**x**_ _∈_ R _[d]_ with _∥_ _**x**_ _∥≤_
1, we can bound _γ_ _T_ directly. Let _**X**_ _T_ = [ _**x**_ 1 _. . .,_ _**x**_ _T_ ] _∈_
R _[d][×][T]_ with all _∥_ _**x**_ _t_ _∥≤_ 1. Now,


log _|_ _**I**_ + _σ_ _[−]_ [2] _**X**_ _[T]_ _T_ _**[X]**_ _[T]_ _[|]_ [ = log] _[ |]_ _**[I]**_ [ +] _[ σ]_ _[−]_ [2] _**[X]**_ _[T]_ _**[X]**_ _[T]_ _T_ _[|]_

_≤_ log _|_ _**I**_ + _σ_ _[−]_ [2] _**D**_ _|_


with _**D**_ = diag diag _[−]_ [1] ( _**X**_ _T_ _**X**_ _[T]_ _T_ [), by Hadamard’s in-]
equality. The largest eigenvalue _λ_ [ˆ] 1 of _**X**_ _T_ _**X**_ _[T]_ _T_ [is] _[ O]_ [(] _[T]_ [),]
so that


log _|_ _**I**_ + _σ_ _[−]_ [2] _**X**_ _[T]_ _T_ _**[X]**_ _[T]_ _[| ≤]_ _[d]_ [ log(1 +] _[ σ]_ _[−]_ [2] _[λ]_ [ˆ] [1] [)] _[,]_


and _γ_ _T_ = _O_ ( _d_ log _T_ ).



max
_r_ =1 _,...,T_



_T_ _∗_ log( _rn_ _T_ _/σ_ [2] ) + _σ_ _[−]_ [2] (1 _−_ _r/T_ )
�


_×_ ( _C_ 5 _T_ _∗_ (log( _Tn_ _T_ )) _[−][κ]_ [(2] _[ν]_ [+] _[d]_ [)] _[/d]_ + _C_ 4 (log _T_ ))
�

+ _O_ ( _T_ [1] _[−][τ/d]_ )



with _n_ _T_ = _C_ 4 _T_ _[τ]_ (log _T_ ). For _κ_ = _−d/_ (2 _ν_ + _d_ ), we obtain that the maximum over _r_ is _O_ ( _T_ _∗_ log( _Tn_ _T_ )) =
_O_ ( _T_ [(] _[τ]_ [+1)] _[d/]_ [(2] _[ν]_ [+] _[d]_ [)] (log _T_ )). Finally, we choose _τ_ =
2 _νd/_ (2 _ν_ + _d_ ( _d_ +1)) to match this term with _O_ ( _T_ [1] _[−][τ/d]_ ).
Plugging this in, we have _γ_ _T_ = _O_ ( _T_ [1] _[−]_ [2] _[η]_ (log _T_ )),

_ν_
_η_ = 2 _ν_ + _d_ ( _d_ +1) [. Together with Theorem][ 2][ (for] _[ ν >]_ [ 2),]
we have that _R_ _T_ = _O_ _[∗]_ ( _T_ [1] _[−][η]_ ) (suppressing log factors): for any _ν >_ 2 and any dimension _d_, the GP

