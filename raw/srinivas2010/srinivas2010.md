---
citation_key: srinivas2010
source_type: pdf-derived
parser: mathpix
parsed_at: 2026-06-03
source_pdf: srinivas2010.pdf
---

\title{
Gaussian Process Optimization in the Bandit Setting: No Regret and Experimental Design
}

\author{
Niranjan Srinivas \\ California Institute of Technology \\ niranjan@caltech.edu
}

\author{
Andreas Krause \\ California Institute of Technology \\ krausea@caltech.edu
}

\author{
Sham M. Kakade \\ University of Pennsylvania \\ skakade@wharton.upenn.edu
}

\author{
Matthias Seeger \\ Saarland University \\ mseeger@mmci.uni-saarland.de
}

\begin{abstract}
Many applications require optimizing an unknown, noisy function that is expensive to evaluate. We formalize this task as a multiarmed bandit problem, where the payoff function is either sampled from a Gaussian process (GP) or has low RKHS norm. We resolve the important open problem of deriving regret bounds for this setting, which imply novel convergence rates for GP optimization. We analyze GP-UCB, an intuitive upper-confidence based algorithm, and bound its cumulative regret in terms of maximal information gain, establishing a novel connection between GP optimization and experimental design. Moreover, by bounding the latter in terms of operator spectra, we obtain explicit sublinear regret bounds for many commonly used covariance functions. In some important cases, our bounds have surprisingly weak dependence on the dimensionality. In our experiments on real sensor data, GP-UCB compares favorably with other heuristical GP optimization approaches.
\end{abstract}

\section*{1. Introduction}

In most stochastic optimization settings, evaluating the unknown function is expensive, and sampling is to be minimized. Examples include choosing advertisements in sponsored search to maximize profit in a click-through model (Pandey \& Olston, 2007) or learning optimal control strategies for robots (Lizotte et al., 2007). Predominant approaches to this problem include the multi-armed bandit paradigm (Robbins, 1952), where the goal is to maximize cumulative reward by optimally balancing exploration and exploitation, and experimental design (Chaloner \& Verdinelli, 1995), where the function is to be explored globally with as few evaluations as possible, for example by maximizing information

\footnotetext{
${ }^{1}$ This is the longer version of our paper in ICML 2010; see Srinivas et al. (2010)
}
gain. The challenge in both approaches is twofold: we have to estimate an unknown function $f$ from noisy samples, and we must optimize our estimate over some high-dimensional input space. For the former, much progress has been made in machine learning through kernel methods and Gaussian process (GP) models (Rasmussen \& Williams, 2006), where smoothness assumptions about $f$ are encoded through the choice of kernel in a flexible nonparametric fashion. Beyond Euclidean spaces, kernels can be defined on diverse domains such as spaces of graphs, sets, or lists.

We are concerned with GP optimization in the multiarmed bandit setting, where $f$ is sampled from a GP distribution or has low "complexity" measured in terms of its RKHS norm under some kernel. We provide the first sublinear regret bounds in this nonparametric setting, which imply convergence rates for GP optimization. In particular, we analyze the Gaussian Process Upper Confidence Bound (GP-UCB) algorithm, a simple and intuitive Bayesian method (Auer et al., 2002; Auer, 2002; Dani et al., 2008). While objectives are different in the multi-armed bandit and experimental design paradigm, our results draw a close technical connection between them: our regret bounds come in terms of an information gain quantity, measuring how fast $f$ can be learned in an information theoretic sense. The submodularity of this function allows us to prove sharp regret bounds for particular covariance functions, which we demonstrate for commonly used Squared Exponential and Matérn kernels.

Related Work. Our work generalizes stochastic linear optimization in a bandit setting, where the unknown function comes from a finite-dimensional linear space. GPs are nonlinear random functions, which can be represented in an infinite-dimensional linear space. For the standard linear setting, Dani et al. (2008) provide a near-complete characterization
(also see Auer 2002; Dani et al. 2007; Abernethy et al. 2008; Rusmevichientong \& Tsitsiklis 2008), explicitly dependent on the dimensionality. In the GP setting, the challenge is to characterize complexity in a different manner, through properties of the kernel function. Our technical contributions are twofold: first, we show how to analyze the nonlinear setting by focusing on the concept of information gain, and second, we explicitly bound this information gain measure using the concept of submodularity (Nemhauser et al., 1978) and knowledge about kernel operator spectra.

Kleinberg et al. (2008) provide regret bounds under weaker and less configurable assumptions (only Lipschitz-continuity w.r.t. a metric is assumed; Bubeck et al. 2008 consider arbitrary topological spaces), which however degrade rapidly with the dimensionality of the problem $\left(\Omega\left(T^{\frac{d+1}{d+2}}\right)\right)$. In practice, linearity w.r.t. a fixed basis is often too stringent an assumption, while Lipschitz-continuity can be too coarse-grained, leading to poor rate bounds. Adopting GP assumptions, we can model levels of smoothness in a fine-grained way. For example, our rates for the frequently used Squared Exponential kernel, enforcing a high degree of smoothness, have weak dependence on the dimensionality: $\mathcal{O}\left(\sqrt{T(\log T)^{d+1}}\right)$ (see Fig. 1).

There is a large literature on GP (response surface) optimization. Several heuristics for trading off exploration and exploitation in GP optimization have been proposed (such as Expected Improvement, Mockus et al. 1978, and Most Probable Improvement, Mockus 1989) and successfully applied in practice (c.f., Lizotte et al. 2007). Brochu et al. (2009) provide a comprehensive review of and motivation for Bayesian optimization using GPs. The Efficient Global Optimization (EGO) algorithm for optimizing expensive black-box functions is proposed by Jones et al. (1998) and extended to GPs by Huang et al. (2006). Little is known about theoretical performance of GP optimization. While convergence of EGO is established by Vazquez \& Bect (2007), convergence rates have remained elusive. Grünewälder et al. (2010) consider the pure exploration problem for GPs, where the goal is to find the optimal decision over $T$ rounds, rather than maximize cumulative reward (with no exploration/exploitation dilemma). They provide sharp bounds for this exploration problem. Note that this methodology would not lead to bounds for minimizing the cumulative regret. Our cumulative regret bounds translate to the first performance guarantees (rates) for GP optimization.

Summary. Our main contributions are:
- We analyze GP-UCB, an intuitive algorithm for GP optimization, when the function is either sam-

\begin{table}
\begin{tabular}{|c|c|c|c|}
\hline Kernel & Linear & RBF & Matérn \\
\hline Regret $R_{T}$ & $d \sqrt{T}$ & $\sqrt{T(\log T)^{d+1}}$ & $T^{\frac{\nu+d(d+1)}{2 \nu+d(d+1)}}$ \\
\hline
\end{tabular}
\captionsetup{labelformat=empty}
\caption{Figure 1. Our regret bounds (up to polylog factors) for linear, radial basis, and Matérn kernels - $d$ is the dimension, $T$ is the time horizon, and $\nu$ is a Matérn parameter.}
\end{table}
pled from a known GP, or has low RKHS norm.
- We bound the cumulative regret for GP-UCB in terms of the information gain due to sampling, establishing a novel connection between experimental design and GP optimization.
- By bounding the information gain for popular classes of kernels, we establish sublinear regret bounds for GP optimization for the first time. Our bounds depend on kernel choice and parameters in a fine-grained fashion.
- We evaluate GP-UCB on sensor network data, demonstrating that it compares favorably to existing algorithms for GP optimization.

\section*{2. Problem Statement and Background}

Consider the problem of sequentially optimizing an unknown reward function $f: D \rightarrow \mathbb{R}$ : in each round $t$, we choose a point $\boldsymbol{x}_{t} \in D$ and get to see the function value there, perturbed by noise: $y_{t}=f\left(\boldsymbol{x}_{t}\right)+\epsilon_{t}$. Our goal is to maximize the sum of rewards $\sum_{t=1}^{T} f\left(\boldsymbol{x}_{t}\right)$, thus to perform essentially as well as $\boldsymbol{x}^{*}=\operatorname{argmax}_{\boldsymbol{x} \in D} f(\boldsymbol{x})$ (as rapidly as possible). For example, we might want to find locations of highest temperature in a building by sequentially activating sensors in a spatial network and regressing on their measurements. $D$ consists of all sensor locations, $f(\boldsymbol{x})$ is the temperature at $\boldsymbol{x}$, and sensor accuracy is quantified by the noise variance. Each activation draws battery power, so we want to sample from as few sensors as possible.

Regret. A natural performance metric in this context is cumulative regret, the loss in reward due to not knowing $f$ 's maximum points beforehand. Suppose the unknown function is $f$, its maximum point ${ }^{1} \boldsymbol{x}^{*}=\operatorname{argmax}_{\boldsymbol{x} \in D} f(\boldsymbol{x})$. For our choice $\boldsymbol{x}_{t}$ in round $t$, we incur instantaneous regret $r_{t}=f\left(\boldsymbol{x}^{*}\right)-f\left(\boldsymbol{x}_{t}\right)$. The cumulative regret $R_{T}$ after $T$ rounds is the sum of instantaneous regrets: $R_{T}=\sum_{t=1}^{T} r_{t}$. A desirable asymptotic property of an algorithm is to be no-regret: $\lim _{T \rightarrow \infty} R_{T} / T=0$. Note that neither $r_{t}$ nor $R_{T}$ are ever revealed to the algorithm. Bounds on the average regret $R_{T} / T$ translate to convergence rates for GP optimization: the maximum $\max _{t \leq T} f\left(\boldsymbol{x}_{t}\right)$ in the first $T$ rounds is no further from $f\left(\boldsymbol{x}^{*}\right)$ than the average.
${ }^{1} \boldsymbol{x}^{*}$ need not be unique; only $f\left(\boldsymbol{x}^{*}\right)$ occurs in the regret.

\subsection*{2.1. Gaussian Processes and RKHS's}

Gaussian Processes. Some assumptions on $f$ are required to guarantee no-regret. While rigid parametric assumptions such as linearity may not hold in practice, a certain degree of smoothness is often warranted. In our sensor network, temperature readings at closeby locations are highly correlated (see Figure 2(a)). We can enforce implicit properties like smoothness without relying on any parametric assumptions, modeling $f$ as a sample from a Gaussian process (GP): a collection of dependent random variables, one for each $\boldsymbol{x} \in D$, every finite subset of which is multivariate Gaussian distributed in an overall consistent way (Rasmussen \& Williams, 2006). A $G P\left(\mu(\boldsymbol{x}), k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)\right)$ is specified by its mean function $\mu(\boldsymbol{x})=\mathbb{E}[f(\boldsymbol{x})]$ and covariance (or kernel) function $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)=\mathbb{E}[(f(x)- \left.\mu(\boldsymbol{x}))\left(f\left(x^{\prime}\right)-\mu\left(\boldsymbol{x}^{\prime}\right)\right)\right]$. For GPs not conditioned on data, we assume ${ }^{2}$ that $\mu \equiv 0$. Moreover, we restrict $k(\boldsymbol{x}, \boldsymbol{x}) \leq 1, \boldsymbol{x} \in D$, i.e., we assume bounded variance. By fixing the correlation behavior, the covariance function $k$ encodes smoothness properties of sample functions $f$ drawn from the GP. A range of commonly used kernel functions is given in Section 5.2.

In this work, GPs play multiple roles. First, some of our results hold when the unknown target function is a sample from a known GP distribution $\operatorname{GP}\left(0, k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)\right)$. Second, the Bayesian algorithm we analyze generally uses $\operatorname{GP}\left(0, k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)\right)$ as prior distribution over $f$. A major advantage of working with GPs is the existence of simple analytic formulae for mean and covariance of the posterior distribution, which allows easy implementation of algorithms. For a noisy sample $\boldsymbol{y}_{T}=\left[y_{1} \ldots y_{T}\right]^{T}$ at points $A_{T}=\left\{\boldsymbol{x}_{1}, \ldots, \boldsymbol{x}_{T}\right\}$, $y_{t}=f\left(\boldsymbol{x}_{t}\right)+\epsilon_{t}$ with $\epsilon_{t} \sim N\left(0, \sigma^{2}\right)$ i.i.d. Gaussian noise, the posterior over $f$ is a GP distribution again, with mean $\mu_{T}(\boldsymbol{x})$, covariance $k_{T}\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)$ and variance $\sigma_{T}^{2}(\boldsymbol{x})$ :
$$
\begin{align*}
\mu_{T}(\boldsymbol{x}) & =\boldsymbol{k}_{T}(\boldsymbol{x})^{T}\left(\boldsymbol{K}_{T}+\sigma^{2} \boldsymbol{I}\right)^{-1} \boldsymbol{y}_{T},  \tag{1}\\
k_{T}\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right) & =k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)-\boldsymbol{k}_{T}(\boldsymbol{x})^{T}\left(\boldsymbol{K}_{T}+\sigma^{2} \boldsymbol{I}\right)^{-1} \boldsymbol{k}_{T}\left(\boldsymbol{x}^{\prime}\right) \\
\sigma_{T}^{2}(\boldsymbol{x}) & =k_{T}(\boldsymbol{x}, \boldsymbol{x}), \tag{2}
\end{align*}
$$
where $\boldsymbol{k}_{T}(\boldsymbol{x})=\left[k\left(\boldsymbol{x}_{1}, \boldsymbol{x}\right) \ldots k\left(\boldsymbol{x}_{T}, \boldsymbol{x}\right)\right]^{T}$ and $\boldsymbol{K}_{T}$ is the positive definite kernel matrix $\left[k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)\right]_{\boldsymbol{x}, \boldsymbol{x}^{\prime} \in A_{T}}$.

RKHS. Instead of the Bayes case, where $f$ is sampled from a GP prior, we also consider the more agnostic case where $f$ has low "complexity" as measured under an RKHS norm (and distribution free assumptions on the noise process). The notion of reproducing kernel Hilbert spaces (RKHS, Wahba 1990) is intimately related to GPs and their covariance functions $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)$. The RKHS $\mathcal{H}_{k}(D)$ is a complete subspace of $L_{2}(D)$ of nicely behaved functions, with an

\footnotetext{
${ }^{2}$ This is w.l.o.g. (Rasmussen \& Williams, 2006).
}
inner product $\langle\cdot, \cdot\rangle_{k}$ obeying the reproducing property: $\langle f, k(\boldsymbol{x}, \cdot)\rangle_{k}=f(\boldsymbol{x})$ for all $f \in \mathcal{H}_{k}(D)$. It is literally constructed by completing the set of mean functions $\mu_{T}$ for all possible $T,\left\{\boldsymbol{x}_{t}\right\}$, and $\boldsymbol{y}_{T}$. The induced RKHS norm $\|f\|_{k}=\sqrt{\langle f, f\rangle_{k}}$ measures smoothness of $f$ w.r.t. $k$ : in much the same way as $k_{1}$ would generate smoother samples than $k_{2}$ as GP covariance functions, $\|\cdot\|_{k_{1}}$ assigns larger penalties than $\|\cdot\|_{k_{2}} \cdot\langle\cdot, \cdot\rangle_{k}$ can be extended to all of $L_{2}(D)$, in which case $\|f\|_{k}<\infty$ iff $f \in \mathcal{H}_{k}(D)$. For most kernels discussed in Section 5.2, members of $\mathcal{H}_{k}(D)$ can uniformly approximate any continuous function on any compact subset of $D$.

\subsection*{2.2. Information Gain \& Experimental Design}

One approach to maximizing $f$ is to first choose points $\boldsymbol{x}_{t}$ so as to estimate the function globally well, then play the maximum point of our estimate. How can we learn about $f$ as rapidly as possible? This question comes down to Bayesian Experimental Design (henceforth "ED"; see Chaloner \& Verdinelli 1995), where the informativeness of a set of sampling points $A \subset D$ about $f$ is measured by the information gain (c.f., Cover \& Thomas 1991), which is the mutual information between $f$ and observations $\boldsymbol{y}_{A}=\boldsymbol{f}_{A}+\epsilon_{A}$ at these points:
$$
\begin{equation*}
\mathrm{I}\left(\boldsymbol{y}_{A} ; f\right)=\mathrm{H}\left(\boldsymbol{y}_{A}\right)-\mathrm{H}\left(\boldsymbol{y}_{A} \mid f\right), \tag{3}
\end{equation*}
$$
quantifying the reduction in uncertainty about $f$ from revealing $\boldsymbol{y}_{A}$. Here, $\boldsymbol{f}_{A}=[f(\boldsymbol{x})]_{\boldsymbol{x} \in A}$ and $\boldsymbol{\varepsilon}_{A} \sim N\left(\mathbf{0}, \sigma^{2} \boldsymbol{I}\right)$. For a Gaussian, $\mathrm{H}(N(\boldsymbol{\mu}, \boldsymbol{\Sigma}))= \frac{1}{2} \log |2 \pi e \boldsymbol{\Sigma}|$, so that in our setting $\mathrm{I}\left(\boldsymbol{y}_{A} ; f\right)= \mathrm{I}\left(\boldsymbol{y}_{A} ; \boldsymbol{f}_{A}\right)=\frac{1}{2} \log \left|\boldsymbol{I}+\sigma^{-2} \boldsymbol{K}_{A}\right|$, where $\boldsymbol{K}_{A}= \left[k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)\right]_{\boldsymbol{x}, \boldsymbol{x}^{\prime} \in A}$. While finding the information gain maximizer among $A \subset D,|A| \leq T$ is NP-hard (Ko et al., 1995), it can be approximated by an efficient greedy algorithm. If $F(A)=\mathrm{I}\left(\boldsymbol{y}_{A} ; f\right)$, this algorithm picks $\boldsymbol{x}_{t}=\operatorname{argmax}_{\boldsymbol{x} \in D} F\left(A_{t-1} \cup\{\boldsymbol{x}\}\right)$ in round $t$, which can be shown to be equivalent to
$$
\begin{equation*}
\boldsymbol{x}_{t}=\underset{\boldsymbol{x} \in D}{\operatorname{argmax}} \sigma_{t-1}(\boldsymbol{x}), \tag{4}
\end{equation*}
$$
where $A_{t-1}=\left\{\boldsymbol{x}_{1}, \ldots, \boldsymbol{x}_{t-1}\right\}$. Importantly, this simple algorithm is guaranteed to find a near-optimal solution: for the set $A_{T}$ obtained after $T$ rounds, we have that
$$
\begin{equation*}
F\left(A_{T}\right) \geq(1-1 / e) \max _{|A| \leq T} F(A) \tag{5}
\end{equation*}
$$
at least a constant fraction of the optimal information gain value. This is because $F(A)$ satisfies a diminishing returns property called submodularity (Krause \& Guestrin, 2005), and the greedy approximation guarantee (5) holds for any submodular function (Nemhauser et al., 1978).

While sequentially optimizing Eq. 4 is a provably good way to explore $f$ globally, it is not well suited for func-
tion optimization. For the latter, we only need to identify points $\boldsymbol{x}$ where $f(\boldsymbol{x})$ is large, in order to concentrate sampling there as rapidly as possible, thus exploit our knowledge about maxima. In fact, the ED rule (4) does not even depend on observations $y_{t}$ obtained along the way. Nevertheless, the maximum information gain after $T$ rounds will play a prominent role in our regret bounds, forging an important connection between GP optimization and experimental design.

\section*{3. GP-UCB Algorithm}

For sequential optimization, the ED rule (4) can be wasteful: it aims at decreasing uncertainty globally, not just where maxima might be. Another idea is to pick points as $\boldsymbol{x}_{t}=\operatorname{argmax}_{\boldsymbol{x} \in D} \mu_{t-1}(\boldsymbol{x})$, maximizing the expected reward based on the posterior so far. However, this rule is too greedy too soon and tends to get stuck in shallow local optima. A combined strategy is to choose
$$
\begin{equation*}
\boldsymbol{x}_{t}=\underset{\boldsymbol{x} \in D}{\operatorname{argmax}} \mu_{t-1}(\boldsymbol{x})+\beta_{t}^{1 / 2} \sigma_{t-1}(\boldsymbol{x}), \tag{6}
\end{equation*}
$$
where $\beta_{t}$ are appropriate constants. This latter objective prefers both points $\boldsymbol{x}$ where $f$ is uncertain (large $\sigma_{t-1}(\cdot)$ ) and such where we expect to achieve high rewards (large $\mu_{t-1}(\cdot)$ ): it implicitly negotiates the exploration-exploitation tradeoff. A natural interpretation of this sampling rule is that it greedily selects points $\boldsymbol{x}$ such that $f(\boldsymbol{x})$ should be a reasonable upper bound on $f\left(\boldsymbol{x}^{*}\right)$, since the argument in (6) is an upper quantile of the marginal posterior $P\left(f(\boldsymbol{x}) \mid \boldsymbol{y}_{t-1}\right)$. We call this choice the Gaussian process upper confidence bound rule (GP-UCB), where $\beta_{t}$ is specified depending on the context (see Section 4). Pseudocode for the GP-UCB algorithm is provided in Algorithm 1. Figure 2 illustrates two subsequent iterations, where GP-UCB both explores (Figure 2(b)) by sampling an input $\boldsymbol{x}$ with large $\sigma_{t-1}^{2}(\boldsymbol{x})$ and exploits (Figure 2(c)) by sampling $\boldsymbol{x}$ with large $\mu_{t-1}(\boldsymbol{x})$.

The GP-UCB selection rule Eq. 6 is motivated by the UCB algorithm for the classical multi-armed bandit problem (Auer et al., 2002; Kocsis \& Szepesvári, 2006). Among competing criteria for GP optimization (see Section 1), a variant of the GP-UCB rule has been demonstrated to be effective for this application (Dorard et al., 2009). To our knowledge, strong theoretical results of the kind provided for GP-UCB in this paper have not been given for any of these search heuristics. In Section 6, we show that in practice GP-UCB compares favorably with these alternatives.

If $D$ is infinite, finding $\boldsymbol{x}_{t}$ in (6) may be hard: the upper confidence index is multimodal in general. However, global search heuristics are very effective in practice (Brochu et al., 2009). It is generally assumed
```
Algorithm 1 The GP-UCB algorithm.
    Input: Input space $D$; GP Prior $\mu_{0}=0, \sigma_{0}, k$
    for $t=1,2, \ldots$ do
        Choose $\boldsymbol{x}_{t}=\underset{\boldsymbol{x} \in D}{\operatorname{argmax}} \mu_{t-1}(\boldsymbol{x})+\sqrt{\beta_{t}} \sigma_{t-1}(\boldsymbol{x})$
        Sample $y_{t}=f\left(\boldsymbol{x}_{t}\right)+\epsilon_{t}$
        Perform Bayesian update to obtain $\mu_{t}$ and $\sigma_{t}$
    end for
```


that evaluating $f$ is more costly than maximizing the UCB index.

UCB algorithms (and GP optimization techniques in general) have been applied to a large number of problems in practice (Kocsis \& Szepesvári, 2006; Pandey \& Olston, 2007; Lizotte et al., 2007). Their performance is well characterized in both the finite arm setting and the linear optimization setting, but no convergence rates for GP optimization are known.

\section*{4. Regret Bounds}

We now establish cumulative regret bounds for GP optimization, treating a number of different settings: $f \sim \operatorname{GP}\left(0, k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)\right)$ for finite $D, f \sim \operatorname{GP}\left(0, k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)\right)$ for general compact $D$, and the agnostic case of arbitrary $f$ with bounded RKHS norm.

GP optimization generalizes stochastic linear optimization, where a function $f$ from a finite-dimensional linear space is optimized over. For the linear case, Dani et al. (2008) provide regret bounds that explicitly depend on the dimensionality ${ }^{3} d$. GPs can be seen as random functions in some infinite-dimensional linear space, so their results do not apply in this case. This problem is circumvented in our regret bounds. The quantity governing them is the maximum information gain $\gamma_{T}$ after $T$ rounds, defined as:
$$
\begin{equation*}
\gamma_{T}:=\max _{A \subset D:|A|=T} \mathrm{I}\left(\boldsymbol{y}_{A} ; \boldsymbol{f}_{A}\right), \tag{7}
\end{equation*}
$$
where $\mathrm{I}\left(\boldsymbol{y}_{A} ; \boldsymbol{f}_{A}\right)=\mathrm{I}\left(\boldsymbol{y}_{A} ; f\right)$ is defined in (3). Recall that $\mathrm{I}\left(\boldsymbol{y}_{A} ; \boldsymbol{f}_{A}\right)=\frac{1}{2} \log \left|\boldsymbol{I}+\sigma^{-2} \boldsymbol{K}_{A}\right|$, where $\boldsymbol{K}_{A}= \left[k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)\right]_{\boldsymbol{x}, \boldsymbol{x}^{\prime} \in A}$ is the covariance matrix of $\boldsymbol{f}_{A}= [f(\boldsymbol{x})]_{\boldsymbol{x} \in A}$ associated with the samples $A$. Our regret bounds are of the form $\mathcal{O}^{*}\left(\sqrt{T \beta_{T} \gamma_{T}}\right)$, where $\beta_{T}$ is the confidence parameter in Algorithm 1, while the bounds of Dani et al. (2008) are of the form $\mathcal{O}^{*}\left(\sqrt{T \beta_{T} d}\right)(d$ the dimensionality of the linear function space). Here and below, the $\mathcal{O}^{*}$ notation is a variant of $\mathcal{O}$, where log factors are suppressed. While our proofs - all provided in the Appendix - use techniques similar to those of Dani et al. (2008), we face a number of additional

\footnotetext{
${ }^{3}$ In general, $d$ is the dimensionality of the input space $D$, which in the finite-dimensional linear case coincides with the feature space.
}

\begin{figure}
\includegraphics[alt={},max width=\textwidth]{./images/srinivas2010-fig1.jpg}
\captionsetup{labelformat=empty}
\caption{Figure 2. (a) Example of temperature data collected by a network of 46 sensors at Intel Research Berkeley. (b,c) Two iterations of the GP-UCB algorithm. It samples points that are either uncertain (b) or have high posterior mean (c).}
\end{figure}
significant technical challenges. Besides avoiding the finite-dimensional analysis, we must handle confidence issues, which are more delicate for nonlinear random functions.

Importantly, note that the information gain is a problem dependent quantity - properties of both the kernel and the input space will determine the growth of regret. In Section 5, we provide general methods for bounding $\gamma_{T}$, either by efficient auxiliary computations or by direct expressions for specific kernels of interest. Our results match known lower bounds (up to log factors) in both the $K$-armed bandit and the $d$-dimensional linear optimization case.

Bounds for a GP Prior. For finite $D$, we obtain the following bound.

Theorem 1 Let $\delta \quad \in \quad(0,1)$ and $\beta_{t}= 2 \log \left(|D| t^{2} \pi^{2} / 6 \delta\right)$. Running GP-UCB with $\beta_{t}$ for a sample $f$ of a GP with mean function zero and covariance function $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)$, we obtain a regret bound of $\mathcal{O}^{*}\left(\sqrt{T \gamma_{T} \log |D|}\right)$ with high probability. Precisely,
$$
\operatorname{Pr}\left\{R_{T} \leq \sqrt{C_{1} T \beta_{T} \gamma_{T}} \quad \forall T \geq 1\right\} \geq 1-\delta .
$$
where $C_{1}=8 / \log \left(1+\sigma^{-2}\right)$.
The proof methodology follows Dani et al. (2007) in that we relate the regret to the growth of the log volume of the confidence ellipsoid - a novelty in our proof is showing how this growth is characterized by the information gain.

This theorem shows that, with high probability over samples from the GP, the cumulative regret is bounded in terms of the maximum information gain, forging a novel connection between GP optimization and experimental design. This link is of fundamental technical importance, allowing us to generalize Theorem 1 to infinite decision spaces. Moreover, the submodularity of $\mathrm{I}\left(\boldsymbol{y}_{A} ; \boldsymbol{f}_{A}\right)$ allows us to derive sharp a priori bounds,
depending on choice and parameterization of $k$ (see Section 5). In the following theorem, we generalize our result to any compact and convex $D \subset \mathbb{R}^{d}$ under mild assumptions on the kernel function $k$.

Theorem 2 Let $D \subset[0, r]^{d}$ be compact and convex, $d \in \mathbb{N}, r>0$. Suppose that the kernel $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)$ satisfies the following high probability bound on the derivatives of GP sample paths $f$ : for some constants $a, b>0$,
$\operatorname{Pr}\left\{\sup _{\boldsymbol{x} \in D}\left|\partial f / \partial x_{j}\right|>L\right\} \leq a e^{-(L / b)^{2}}, \quad j=1, \ldots, d$.
Pick $\delta \in(0,1)$, and define
$\beta_{t}=2 \log \left(t^{2} 2 \pi^{2} /(3 \delta)\right)+2 d \log \left(t^{2} d b r \sqrt{\log (4 d a / \delta)}\right)$.
Running the GP-UCB with $\beta_{t}$ for a sample $f$ of a GP with mean function zero and covariance function $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)$, we obtain a regret bound of $\mathcal{O}^{*}\left(\sqrt{d T \gamma_{T}}\right)$ with high probability. Precisely, with $C_{1}=8 / \log \left(1+\sigma^{-2}\right)$ we have
$$
\operatorname{Pr}\left\{R_{T} \leq \sqrt{C_{1} T \beta_{T} \gamma_{T}}+2 \quad \forall T \geq 1\right\} \geq 1-\delta .
$$

The main challenge in our proof (provided in the Appendix) is to lift the regret bound in terms of the confidence ellipsoid to general $D$. The smoothness assumption on $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)$ disqualifies GPs with highly erratic sample paths. It holds for stationary kernels $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)=k\left(\boldsymbol{x}-\boldsymbol{x}^{\prime}\right)$ which are four times differentiable (Theorem 5 of Ghosal \& Roy (2006)), such as the Squared Exponential and Matérn kernels with $\nu>2$ (see Section 5.2), while it is violated for the OrnsteinUhlenbeck kernel (Matérn with $\nu=1 / 2$; a stationary variant of the Wiener process). For the latter, sample paths $f$ are nondifferentiable almost everywhere with probability one and come with independent increments. We conjecture that a result of the form of Theorem 2 does not hold in this case.

Bounds for Arbitrary $f$ in the RKHS. Thus far, we have assumed that the target function $f$ is sampled
from a GP prior and that the noise is $N\left(0, \sigma^{2}\right)$ with known variance $\sigma^{2}$. We now analyze GP-UCB in an agnostic setting, where $f$ is an arbitrary function from the RKHS corresponding to kernel $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)$. Moreover, we allow the noise variables $\varepsilon_{t}$ to be an arbitrary martingale difference sequence (meaning that $\mathbb{E}\left[\varepsilon_{t} \mid \varepsilon_{<t}\right]=0$ for all $t \in \mathbb{N}$ ), uniformly bounded by $\sigma$. Note that we still run the same GP-UCB algorithm, whose prior and noise model are misspecified in this case. Our following result shows that GP-UCB attains sublinear regret even in the agnostic setting.

Theorem 3 Let $\delta \in(0,1)$. Assume that the true underlying $f$ lies in the RKHS $\mathcal{H}_{k}(D)$ corresponding to the kernel $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)$, and that the noise $\varepsilon_{t}$ has zero mean conditioned on the history and is bounded by $\sigma$ almost surely. In particular, assume $\|f\|_{k}^{2} \leq B$ and let $\beta_{t}=2 B+300 \gamma_{t} \log ^{3}(t / \delta)$. Running GP-UCB with $\beta_{t}$, prior $G P\left(0, k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)\right)$ and noise model $N\left(0, \sigma^{2}\right)$, we obtain a regret bound of $\mathcal{O}^{*}\left(\sqrt{T}\left(B \sqrt{\gamma_{T}}+\gamma_{T}\right)\right)$ with high probability (over the noise). Precisely,
$$
\operatorname{Pr}\left\{R_{T} \leq \sqrt{C_{1} T \beta_{T} \gamma_{T}} \quad \forall T \geq 1\right\} \geq 1-\delta
$$
where $C_{1}=8 / \log \left(1+\sigma^{-2}\right)$.
Note that while our theorem implicitly assumes that GP-UCB has knowledge of an upper bound on $\|f\|_{k}$, standard guess-and-doubling approaches suffice if no such bound is known a priori. Comparing Theorem 2 and Theorem 3, the latter holds uniformly over all functions $f$ with $\|f\|_{k}<\infty$, while the former is a probabilistic statement requiring knowledge of the GP that $f$ is sampled from. In contrast, if $f \sim \operatorname{GP}\left(0, k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)\right)$, then $\|f\|_{k}=\infty$ almost surely (Wahba, 1990): sample paths are rougher than RKHS functions. Neither Theorem 2 nor 3 encompasses the other.

\section*{5. Bounding the Information Gain}

Since the bounds developed in Section 4 depend on the information gain, the key remaining question is how to bound the quantity $\gamma_{T}$ for practical classes of kernels.

\subsection*{5.1. Submodularity and Greedy Maximization}

In order to bound $\gamma_{T}$, we have to maximize the information gain $F(A)=\mathrm{I}\left(\boldsymbol{y}_{A} ; f\right)$ over all subsets $A \subset D$ of size $T$ : a combinatorial problem in general. However, as noted in Section 2, $F(A)$ is a submodular function, which implies the performance guarantee (5) for maximizing $F$ sequentially by the greedy ED rule (4). Dividing both sides of (5) by $1-1 / e$, we can upper-bound $\gamma_{T}$ by $(1-1 / e)^{-1} \mathrm{I}\left(\boldsymbol{y}_{A_{T}} ; f\right)$, where $A_{T}$ is constructed by the greedy procedure. Thus, somewhat counterintuitively, instead of using submodularity to prove that $F\left(A_{T}\right)$ is near-optimal, we use it in order to show that
$\gamma_{T}$ is "near-greedy". As noted in Section 2, the ED rule does not depend on observations $y_{t}$ and can be run without evaluating $f$.

The importance of this greedy bound is twofold. First, it allows us to numerically compute highly problem-specific bounds on $\gamma_{T}$, which can be plugged into our results in Section 4 to obtain high-probability bounds on $R_{T}$. This being a laborious procedure, one would prefer a priori bounds for $\gamma_{T}$ in practice which are simple analytical expressions of $T$ and parameters of $k$. In this section, we sketch a general procedure for obtaining such expressions, instantiating them for a number of commonly used covariance functions, once more relying crucially on the greedy ED rule upper bound. Suppose that $D$ is finite for now, and let $\boldsymbol{f}=[f(\boldsymbol{x})]_{\boldsymbol{x} \in D}, \boldsymbol{K}_{D}=\left[k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)\right]_{\boldsymbol{x}, \boldsymbol{x}^{\prime} \in D}$. Sampling $f$ at $\boldsymbol{x}_{t}$, we obtain $y_{t} \sim N\left(\boldsymbol{v}_{t}^{T} \boldsymbol{f}, \sigma^{2}\right)$, where $\boldsymbol{v}_{t} \in \mathbb{R}^{|D|}$ is the indicator vector associated with $\boldsymbol{x}_{t}$. We can upper-bound the greedy maximum once more, by relaxing this constraint to $\left\|\boldsymbol{v}_{t}\right\|=1$ in round $t$ of the sequential method. For this relaxed greedy procedure, all $\boldsymbol{v}_{t}$ are leading eigenvectors of $\boldsymbol{K}_{D}$, since successive covariance matrices of $P\left(\boldsymbol{f} \mid \boldsymbol{y}_{t-1}\right)$ share their eigenbasis with $\boldsymbol{K}_{D}$, while eigenvalues are damped according to how many times the corresponding eigenvector is selected. We can upper-bound the information gain by considering the worst-case allocation of $T$ samples to the $\min \{T,|D|\}$ leading eigenvectors of $\boldsymbol{K}_{D}$ :
$$
\begin{equation*}
\gamma_{T} \leq \frac{1 / 2}{1-e^{-1}} \max _{\left(m_{t}\right)} \sum_{t=1}^{|D|} \log \left(1+\sigma^{-2} m_{t} \hat{\lambda}_{t}\right) \tag{8}
\end{equation*}
$$
subject to $\sum_{t} m_{t}=T$, and $\operatorname{spec}\left(\boldsymbol{K}_{D}\right)=\left\{\hat{\lambda}_{1} \geq \hat{\lambda}_{2} \geq\right. \ldots\}$. We can split the sum into two parts in order to obtain a bound to leading order. The following Theorem captures this intuition:

Theorem 4 For any $T \in \mathbb{N}$ and any $T_{*}=1, \ldots, T$ :
$$
\gamma_{T} \leq \mathcal{O}\left(\sigma^{-2}\left[B\left(T_{*}\right) T+T_{*}\left(\log n_{T} T\right)\right]\right)
$$
where $n_{T}=\sum_{t=1}^{|D|} \hat{\lambda}_{t}$ and $B\left(T_{*}\right)=\sum_{t=T_{*}+1}^{|D|} \hat{\lambda}_{t}$.
Therefore, if for some $T_{*}=o(T)$ the first $T_{*}$ eigenvalues carry most of the total mass $n_{T}$, the information gain will be small. The more rapidly the spectrum of $\boldsymbol{K}_{D}$ decays, the slower the growth of $\gamma_{T}$. Figure 3 illustrates this intuition.

\subsection*{5.2. Bounds for Common Kernels}

In this section we bound $\gamma_{T}$ for a range of commonly used covariance functions: finite dimensional linear, Squared Exponential and Matérn kernels. Together with our results in Section 4, these imply sublinear regret bounds for GP-UCB in all cases.

\begin{figure}
\includegraphics[alt={},max width=\textwidth]{./images/srinivas2010-fig2.jpg}
\captionsetup{labelformat=empty}
\caption{Figure 3. Spectral decay (left) and information gain bound (right) for independent (diagonal), linear, squared exponential and Matérn kernels ( $\nu=2.5$.) with equal trace.}
\end{figure}

Finite dimensional linear kernels have the form $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)=\boldsymbol{x}^{T} \boldsymbol{x}^{\prime}$. GPs with this kernel correspond to random linear functions $f(\boldsymbol{x})=\boldsymbol{w}^{T} \boldsymbol{x}, \boldsymbol{w} \sim N(\mathbf{0}, \boldsymbol{I})$.

The Squared Exponential kernel is $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)= \exp \left(-\left(2 l^{2}\right)^{-1}\left\|\boldsymbol{x}-\boldsymbol{x}^{\prime}\right\|^{2}\right), l$ a lengthscale parameter. Sample functions are differentiable to any order almost surely (Rasmussen \& Williams, 2006).

The Matérn kernel is given by $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)= \left(2^{1-\nu} / \Gamma(\nu)\right) r^{\nu} B_{\nu}(r), r=(\sqrt{2 \nu} / l)\left\|\boldsymbol{x}-\boldsymbol{x}^{\prime}\right\|$, where $\nu$ controls the smoothness of sample paths (the smaller, the rougher) and $B_{\nu}$ is a modified Bessel function. Note that as $\nu \rightarrow \infty$, appropriately rescaled Matérn kernels converge to the Squared Exponential kernel.

Figure 4 shows random functions drawn from GP distributions with the above kernels.

Theorem 5 Let $D \subset \mathbb{R}^{d}$ be compact and convex, $d \in \mathbb{N}$. Assume the kernel function satisfies $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right) \leq 1$.
1. Finite spectrum. For the $d$-dimensional Bayesian linear regression case: $\gamma_{T}=\mathcal{O}(d \log T)$.
2. Exponential spectral decay. For the Squared Exponential kernel: $\gamma_{T}=\mathcal{O}\left((\log T)^{d+1}\right)$.
3. Power law spectral decay. For Matérn kernels with $\nu>1: \gamma_{T}=\mathcal{O}\left(T^{d(d+1) /(2 \nu+d(d+1))}(\log T)\right)$.

A proof of Theorem 5 is given in the Appendix, , we only sketch the idea here. $\gamma_{T}$ is bounded by Theorem 4 in terms the eigendecay of the kernel matrix $\boldsymbol{K}_{D}$. If $D$ is infinite or very large, we can use the operator spectrum of $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)$, which likewise decays rapidly. For the kernels of interest here, asymptotic expressions for the operator eigenvalues are given in Seeger et al. (2008), who derived bounds on the information gain for fixed and random designs (in contrast to the worst-case information gain considered here, which is substantially more challenging to bound). The main challenge in the proof is to ensure
the existence of discretizations $D_{T} \subset D$, dense in the limit, for which tail sums $B\left(T_{*}\right) / n_{T}$ in Theorem 4 are close to corresponding operator spectra tail sums.

Together with Theorems 2 and 3, this result guarantees sublinear regret of GP-UCB for any dimension (see Figure 1). For the Squared Exponential kernel, the dimension $d$ appears as exponent of $\log T$ only, so that the regret grows at most as $\mathcal{O}^{*}\left(\sqrt{T}(\log T)^{\frac{d+1}{2}}\right)$ - the high degree of smoothness of the sample paths effectively combats the curse of dimensionality.

\section*{6. Experiments}

We compare GP-UCB with heuristics such as the Expected Improvement (EI) and Most Probable Improvement (MPI), and with naive methods which choose points of maximum mean or variance only, both on synthetic and real sensor network data.

For synthetic data, we sample random functions from a squared exponential kernel with lengthscale parameter 0.2 . The sampling noise variance $\sigma^{2}$ was set to 0.025 or $5 \%$ of the signal variance. Our decision set $D=[0,1]$ is uniformly discretized into 1000 points. We run each algorithm for $T=1000$ iterations with $\delta=0.1$, averaging over 30 trials (samples from the kernel). While the choice of $\beta_{t}$ as recommended by Theorem 1 leads to competitive performance of GP-UCB, we find (using cross-validation) that the algorithm is improved by scaling $\beta_{t}$ down by a factor 5. Note that we did not optimize constants in our regret bounds.

Next, we use temperature data collected from 46 sensors deployed at Intel Research Berkeley over 5 days at 1 minute intervals, pertaining to the example in Section 2. We take the first two-thirds of the data set to compute the empirical covariance of the sensor readings, and use it as the kernel matrix. The functions $f$ for optimization consist of one set of observations from all the sensors taken from the remaining third of the

\begin{figure}
\includegraphics[alt={},max width=\textwidth]{./images/srinivas2010-fig3.jpg}
\captionsetup{labelformat=empty}
\caption{Figure 4. Sample functions drawn from a GP with linear, squared exponential and Matérn kernels ( $\nu=2.5$.)}
\end{figure}

\begin{figure}
\includegraphics[alt={},max width=\textwidth]{./images/srinivas2010-fig4.jpg}
\captionsetup{labelformat=empty}
\caption{Figure 5. Comparison of performance: GP-UCB and various heuristics on synthetic (a), and sensor network data (b, c).}
\end{figure}
data set, and the results (for $T=46, \sigma^{2}=0.5$ or $5 \%$ noise, $\delta=0.1$ ) were averaged over 2000 possible choices of the objective function.

Lastly, we take data from traffic sensors deployed along the highway I-880 South in California. The goal was to find the point of minimum speed in order to identify the most congested portion of the highway; we used traffic speed data for all working days from 6 AM to 11 AM for one month, from 357 sensors. We again use the covariance matrix from two-thirds of the data set as kernel matrix, and test on the other third. The results (for $T=357, \sigma^{2}=4.78$ or $5 \%$ noise, $\delta=0.1$ ) were averaged over 900 runs.

Figure 5 compares the mean average regret incurred by the different heuristics and the GP-UCB algorithm on synthetic and real data. For temperature data, the GP-UCB algorithm and EI heuristic clearly outperform the others, and do not exhibit significant difference between each other. On synthetic and traffic data MPI does equally well. In summary, GP-UCB performs at least on par with the existing approaches which are not equipped with regret bounds.

\section*{7. Conclusions}

We prove the first sublinear regret bounds for GP optimization with commonly used kernels (see Figure 1 ), both for $f$ sampled from a known GP and $f$ of low RKHS norm. We analyze GP-UCB, an intuitive,

Bayesian upper confidence bound based sampling rule. Our regret bounds crucially depend on the information gain due to sampling, establishing a novel connection between bandit optimization and experimental design. We bound the information gain in terms of the kernel spectrum, providing a general methodology for obtaining regret bounds with kernels of interest. Our experiments on real sensor network data indicate that GPUCB performs at least on par with competing criteria for GP optimization, for which no regret bounds are known at present. Our results provide an interesting step towards understanding exploration-exploitation tradeoffs with complex utility functions.

\section*{Acknowledgements}

We thank Marcus Hutter for insightful comments on an earlier version of this paper. This research was partially supported by ONR grant N00014-09-1-1044, NSF grant CNS-0932392, a gift from Microsoft Corporation and the Excellence Initiative of the German research foundation (DFG).

\section*{References}

Abernethy, J., Hazan, E., and Rakhlin, A. An efficient algorithm for linear bandit optimization, 2008. COLT.

Auer, P. Using confidence bounds for exploitationexploration trade-offs. JMLR, 3:397-422, 2002.

Auer, P., Cesa-Bianchi, N., and Fischer, P. Finite-time
analysis of the multiarmed bandit problem. Mach. Learn., 47(2-3):235-256, 2002.

Brochu, E., Cora, M., and de Freitas, N. A tutorial on Bayesian optimization of expensive cost functions, with application to active user modeling and hierarchical reinforcement learning. In TR-2009-23, UBC, 2009.

Bubeck, S., Munos, R., Stoltz, G., and Szepesvári, C. Online optimization in X -armed bandits. In NIPS, 2008.

Chaloner, K. and Verdinelli, I. Bayesian experimental design: A review. Stat. Sci., 10(3):273-304, 1995.

Cover, T. M. and Thomas, J. A. Elements of Information Theory. Wiley Interscience, 1991.

Dani, V., Hayes, T. P., and Kakade, S. The price of bandit information for online optimization. In NIPS, 2007.

Dani, V., Hayes, T. P., and Kakade, S. M. Stochastic linear optimization under bandit feedback. In COLT, 2008.

Dorard, L., Glowacka, D., and Shawe-Taylor, J. Gaussian process modelling of dependencies in multi-armed bandit problems. In Int. Symp. Op. Res., 2009.

Freedman, D. A. On tail probabilities for martingales. Ann. Prob., 3(1):100-118, 1975.

Ghosal, S. and Roy, A. Posterior consistency of Gaussian process prior for nonparametric binary regression. Ann. Stat., 34(5):2413-2429, 2006.

Grünewälder, S., Audibert, J-Y., Opper, M., and ShaweTaylor, J. Regret bounds for gaussian process bandit problems. In AISTATS, 2010.

Huang, D., Allen, T. T., Notz, W. I., and Zeng, N. Global optimization of stochastic black-box systems via sequential kriging meta-models. J Glob. Opt., 34:441-466, 2006.

Jones, D. R., Schonlau, M., and Welch, W. J. Efficient global optimization of expensive black-box functions. $J$ Glob. Opti., 13:455-492, 1998.

Kleinberg, R., Slivkins, A., and Upfal, E. Multi-armed bandits in metric spaces. In $S T O C$, pp. 681-690, 2008.

Ko, C., Lee, J., and Queyranne, M. An exact algorithm for maximum entropy sampling. Ops Res, 43(4):684-691, 1995.

Kocsis, L. and Szepesvári, C. Bandit based monte-carlo planning. In ECML, 2006.

Krause, A. and Guestrin, C. Near-optimal nonmyopic value of information in graphical models. In UAI, 2005.

Lizotte, D., Wang, T., Bowling, M., and Schuurmans, D. Automatic gait optimization with Gaussian process regression. In IJCAI, pp. 944-949, 2007.

McDiarmid, C. Concentration. In Probabilistiic Methods for Algorithmic Discrete Mathematics. Springer, 1998.

Mockus, J. Bayesian Approach to Global Optimization. Kluwer Academic Publishers, 1989.

Mockus, J., Tiesis, V., and Zilinskas, A. Toward Global Optimization, volume 2, chapter Bayesian Methods for Seeking the Extremum, pp. 117-128. 1978.

Nemhauser, G., Wolsey, L., and Fisher, M. An analysis of the approximations for maximizing submodular set functions. Math. Prog., 14:265-294, 1978.

Pandey, S. and Olston, C. Handling advertisements of unknown quality in search advertising. In NIPS. 2007.

Rasmussen, C. E. and Williams, C. K. I. Gaussian Processes for Machine Learning. MIT Press, 2006.

Robbins, H. Some aspects of the sequential design of experiments. Bul. Am. Math. Soc., 58:527-535, 1952.

Rusmevichientong, P. and Tsitsiklis, J. N. Linearly parameterized bandits. abs/0812.3465, 2008.

Seeger, M. W., Kakade, S. M., and Foster, D. P. Information consistency of nonparametric Gaussian process methods. IEEE Tr. Inf. Theo., 54(5):2376-2382, 2008.

Shawe-Taylor, J., Williams, C., Cristianini, N., and Kandola, J. On the eigenspectrum of the Gram matrix and the generalization error of kernel-PCA. IEEE Trans. Inf. Theo., 51(7):2510-2522, 2005.

Srinivas, N., Krause, A., Kakade, S., and Seeger, M. Gaussian process optimization in the bandit setting: No regret and experimental design. In ICML, 2010.

Stein, M. Interpolation of Spatial Data: Some Theory for Kriging. Springer, 1999.

Vazquez, E. and Bect, J. Convergence properties of the expected improvement algorithm, 2007.

Wahba, G. Spline Models for Observational Data. SIAM, 1990.

\section*{A. Regret Bounds for Target Function Sampled from GP}

In this section, we provide details for the proofs of Theorem 1 and Theorem 2. In both cases, the strategy is to show that $\left|f(\boldsymbol{x})-\mu_{t-1}(\boldsymbol{x})\right| \leq \beta_{t}^{1 / 2} \sigma_{t-1}(\boldsymbol{x})$ for all $t \in \mathbb{N}$ and all $\boldsymbol{x} \in D$, or in the infinite case, all $\boldsymbol{x}$ in a discretization of $D$ which becomes dense as $t$ gets large.

\section*{A.1. Finite Decision Set}

We begin with the finite case, $|D|<\infty$.
Lemma 5.1 Pick $\delta \in(0,1)$ and set $\beta_{t}= 2 \log \left(|D| \pi_{t} / \delta\right)$, where $\sum_{t \geq 1} \pi_{t}^{-1}=1, \pi_{t}>0$. Then,
$$
\left|f(\boldsymbol{x})-\mu_{t-1}(\boldsymbol{x})\right| \leq \beta_{t}^{1 / 2} \sigma_{t-1}(\boldsymbol{x}) \quad \forall \boldsymbol{x} \in D \forall t \geq 1
$$
holds with probability $\geq 1-\delta$.

Proof Fix $t \geq 1$ and $\boldsymbol{x} \in D$. Conditioned on $\boldsymbol{y}_{t-1}= \left(y_{1}, \ldots, y_{t-1}\right),\left\{\boldsymbol{x}_{1}, \ldots, \boldsymbol{x}_{t-1}\right\}$ are deterministic, and $f(\boldsymbol{x}) \sim N\left(\mu_{t-1}(\boldsymbol{x}), \sigma_{t-1}^{2}(\boldsymbol{x})\right)$. Now, if $r \sim N(0,1)$, then
$$
\begin{aligned}
\operatorname{Pr}\{r>c\} & =e^{-c^{2} / 2}(2 \pi)^{-1 / 2} \int e^{-(r-c)^{2} / 2-c(r-c)} d r \\
& \leq e^{-c^{2} / 2} \operatorname{Pr}\{r>0\}=(1 / 2) e^{-c^{2} / 2}
\end{aligned}
$$
for $c>0$, since $e^{-c(r-c)} \leq 1$ for $r \geq c$. Therefore, $\operatorname{Pr}\left\{\left|f(\boldsymbol{x})-\mu_{t-1}(\boldsymbol{x})\right|>\beta_{t}^{1 / 2} \sigma_{t-1}(\boldsymbol{x})\right\} \leq e^{-\beta_{t} / 2}$, using $r=\left(f(\boldsymbol{x})-\mu_{t-1}(\boldsymbol{x})\right) / \sigma_{t-1}(\boldsymbol{x})$ and $c=\beta_{t}^{1 / 2}$. Applying the union bound,
$$
\left|f(\boldsymbol{x})-\mu_{t-1}(\boldsymbol{x})\right| \leq \beta_{t}^{1 / 2} \sigma_{t-1}(\boldsymbol{x}) \quad \forall \boldsymbol{x} \in D
$$
holds with probability $\geq 1-|D| e^{-\beta_{t} / 2}$. Choosing $|D| e^{-\beta_{t} / 2}=\delta / \pi_{t}$ and using the union bound for $t \in \mathbb{N}$, the statement holds. For example, we can use $\pi_{t}=\pi^{2} t^{2} / 6$.

Lemma 5.2 Fix $t \geq 1$. If $\left|f(\boldsymbol{x})-\mu_{t-1}(\boldsymbol{x})\right| \leq \beta_{t}^{1 / 2} \sigma_{t-1}(\boldsymbol{x})$ for all $\boldsymbol{x} \in D$, then the regret $r_{t}$ is bounded by $2 \beta_{t}^{1 / 2} \sigma_{t-1}\left(\boldsymbol{x}_{t}\right)$.

Proof By definition of $\boldsymbol{x}_{t}: \mu_{t-1}\left(\boldsymbol{x}_{t}\right)+\beta_{t}^{1 / 2} \sigma_{t-1}\left(\boldsymbol{x}_{t}\right) \geq \mu_{t-1}\left(\boldsymbol{x}^{*}\right)+\beta_{t}^{1 / 2} \sigma_{t-1}\left(\boldsymbol{x}^{*}\right) \geq f\left(\boldsymbol{x}^{*}\right)$. Therefore,
$$
\begin{aligned}
r_{t} & =f\left(\boldsymbol{x}^{*}\right)-f\left(\boldsymbol{x}_{t}\right) \leq \beta_{t}^{1 / 2} \sigma_{t-1}\left(\boldsymbol{x}_{t}\right)+\mu_{t-1}\left(\boldsymbol{x}_{t}\right)-f\left(\boldsymbol{x}_{t}\right) \\
& \leq 2 \beta_{t}^{1 / 2} \sigma_{t-1}\left(\boldsymbol{x}_{t}\right)
\end{aligned}
$$

Lemma 5.3 The information gain for the points selected can be expressed in terms of the predictive variances. If $\boldsymbol{f}_{T}=\left(f\left(\boldsymbol{x}_{t}\right)\right) \in \mathbb{R}^{T}$ :
$$
\mathrm{I}\left(\boldsymbol{y}_{T} ; \boldsymbol{f}_{T}\right)=\frac{1}{2} \sum_{t=1}^{T} \log \left(1+\sigma^{-2} \sigma_{t-1}^{2}\left(\boldsymbol{x}_{t}\right)\right)
$$

Proof Recall that $\mathrm{I}\left(\boldsymbol{y}_{T} ; \boldsymbol{f}_{T}\right)=\mathrm{H}\left(\boldsymbol{y}_{T}\right)- (1 / 2) \log \left|2 \pi e \sigma^{2} \boldsymbol{I}\right|$. Now, $\mathrm{H}\left(\boldsymbol{y}_{T}\right)=\mathrm{H}\left(\boldsymbol{y}_{T-1}\right)+ \mathrm{H}\left(y_{T} \mid \boldsymbol{y}_{T-1}\right)=\mathrm{H}\left(\boldsymbol{y}_{T-1}\right)+\log \left(2 \pi e\left(\sigma^{2}+\sigma_{t-1}^{2}\left(\boldsymbol{x}_{T}\right)\right)\right) / 2$. Here, we use that $\boldsymbol{x}_{1}, \ldots, \boldsymbol{x}_{T}$ are deterministic conditioned on $\boldsymbol{y}_{T-1}$, and that the conditional variance $\sigma_{T-1}^{2}\left(\boldsymbol{x}_{T}\right)$ does not depend on $\boldsymbol{y}_{T-1}$. The result follows by induction.

Lemma 5.4 Pick $\delta \in(0,1)$ and let $\beta_{t}$ be defined as in Lemma 5.1. Then, the following holds with probability $\geq 1-\delta$ :
$$
\sum_{t=1}^{T} r_{t}^{2} \leq \beta_{T} C_{1} \mathrm{I}\left(\boldsymbol{y}_{T} ; \boldsymbol{f}_{T}\right) \leq C_{1} \beta_{T} \gamma_{T} \quad \forall T \geq 1
$$
where $C_{1}:=8 / \log \left(1+\sigma^{-2}\right) \geq 8 \sigma^{2}$.
Proof By Lemma 5.1 and Lemma 5.2, we have that $\left\{r_{t}^{2} \leq 4 \beta_{t} \sigma_{t-1}^{2}\left(\boldsymbol{x}_{t}\right) \forall t \geq 1\right\}$ with probability $\geq 1-\delta$. Now, $\beta_{t}$ is nondecreasing, so that
$$
\begin{aligned}
4 \beta_{t} \sigma_{t-1}^{2}\left(\boldsymbol{x}_{t}\right) & \leq 4 \beta_{T} \sigma^{2}\left(\sigma^{-2} \sigma_{t-1}^{2}\left(\boldsymbol{x}_{t}\right)\right) \\
& \leq 4 \beta_{T} \sigma^{2} C_{2} \log \left(1+\sigma^{-2} \sigma_{t-1}^{2}\left(\boldsymbol{x}_{t}\right)\right)
\end{aligned}
$$
with $C_{2}=\sigma^{-2} / \log \left(1+\sigma^{-2}\right) \geq 1$, since $s^{2} \leq C_{2} \log \left(1+s^{2}\right)$ for $s \in\left[0, \sigma^{-2}\right]$, and $\sigma^{-2} \sigma_{t-1}^{2}\left(\boldsymbol{x}_{t}\right) \leq \sigma^{-2} k\left(\boldsymbol{x}_{t}, \boldsymbol{x}_{t}\right) \leq \sigma^{-2}$. Noting that $C_{1}=8 \sigma^{2} C_{2}$, the result follows by plugging in the representation of Lemma 5.3.

Finally, Theorem 1 is a simple consequence of Lemma 5.4, since $R_{T}^{2} \leq T \sum_{t=1}^{T} r_{t}^{2}$ by the CauchySchwarz inequality.

\section*{A.2. General Decision Set}

Theorem 2 extends the statement of Theorem 1 to the general case of $D \subset \mathbb{R}^{d}$ compact. We cannot expect this generalization to work without any assumptions on the kernel $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)$. For example, if $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)=e^{-\left\|\boldsymbol{x}-\boldsymbol{x}^{\prime}\right\|}$ (Ornstein-Uhlenbeck), while sample paths $f$ are a.s. continuous, they are still very erratic: $f$ is a.s. nondifferentiable almost everywhere, and the process comes with independent increments, a stationary variant of Brownian motion. The additional assumption on $k$ in Theorem 2 is rather mild and is satisfied by several common kernels, as discussed in Section 4.

Recall that the finite case proof is based on Lemma 5.1 paving the way for Lemma 5.2. However, Lemma 5.1 does not hold for infinite $D$. First, let us observe that we have confidence on all decisions actually chosen.

Lemma 5.5 Pick $\delta \in(0,1)$ and set $\beta_{t}=2 \log \left(\pi_{t} / \delta\right)$, where $\sum_{t \geq 1} \pi_{t}^{-1}=1, \pi_{t}>0$. Then,
$$
\left|f\left(\boldsymbol{x}_{t}\right)-\mu_{t-1}\left(\boldsymbol{x}_{t}\right)\right| \leq \beta_{t}^{1 / 2} \sigma_{t-1}\left(\boldsymbol{x}_{t}\right) \quad \forall t \geq 1
$$
holds with probability $\geq 1-\delta$.
Proof Fix $t \geq 1$ and $\boldsymbol{x} \in D$. Conditioned on $\boldsymbol{y}_{t-1}=\left(y_{1}, \ldots, y_{t-1}\right),\left\{\boldsymbol{x}_{1}, \ldots, \boldsymbol{x}_{t-1}\right\}$ are deterministic, and $f(\boldsymbol{x}) \sim N\left(\mu_{t-1}(\boldsymbol{x}), \sigma_{t-1}^{2}(\boldsymbol{x})\right)$. As before, $\operatorname{Pr}\left\{\left|f\left(\boldsymbol{x}_{t}\right)-\mu_{t-1}\left(\boldsymbol{x}_{t}\right)\right|>\beta_{t}^{1 / 2} \sigma_{t-1}\left(\boldsymbol{x}_{t}\right)\right\} \leq e^{-\beta_{t} / 2}$. Since $e^{-\beta_{t} / 2}=\delta / \pi_{t}$ and using the union bound for $t \in \mathbb{N}$, the statement holds.

Purely for the sake of analysis, we use a set of discretizations $D_{t} \subset D$, where $D_{t}$ will be used at time
$t$ in the analysis. Essentially, we use this to obtain a valid confidence interval on $\boldsymbol{x}^{*}$. The following lemma provides a confidence bound for these subsets.

Lemma 5.6 Pick $\delta \in(0,1)$ and set $\beta_{t}= 2 \log \left(\left|D_{t}\right| \pi_{t} / \delta\right)$, where $\sum_{t \geq 1} \pi_{t}^{-1}=1, \pi_{t}>0$. Then,
$$
\left|f(\boldsymbol{x})-\mu_{t-1}(\boldsymbol{x})\right| \leq \beta_{t}^{1 / 2} \sigma_{t-1}(\boldsymbol{x}) \quad \forall \boldsymbol{x} \in D_{t}, \forall t \geq 1
$$
holds with probability $\geq 1-\delta$.
Proof The proof is identical to that in Lemma 5.1, except now we use $D_{t}$ at each timestep.

Now by assumption and the union bound, we have that
$$
\operatorname{Pr}\left\{\forall j, \forall \boldsymbol{x} \in D,\left|\partial f /\left(\partial x_{j}\right)\right|<L\right\} \geq 1-d a e^{-L^{2} / b^{2}}
$$
which implies that, with probability greater than $1- d a e^{-L^{2} / b^{2}}$, we have that
$$
\begin{equation*}
\forall \boldsymbol{x} \in D,\left|f(x)-f\left(x^{\prime}\right)\right| \leq L\left\|x-x^{\prime}\right\|_{1} \tag{9}
\end{equation*}
$$

This allows us to obtain confidence on $\boldsymbol{x}^{\star}$ as follows.
Now let us choose a discretization $D_{t}$ of size $\left(\tau_{t}\right)^{d}$ so that for all $\boldsymbol{x} \in D_{t}$
$$
\left\|\boldsymbol{x}-[\boldsymbol{x}]_{t}\right\|_{1} \leq r d / \tau_{t}
$$
where $[\boldsymbol{x}]_{t}$ denotes the closest point in $D_{t}$ to $\boldsymbol{x}$. A sufficient discretization has each coordinate with $\tau_{t}$ uniformly spaced points.

Lemma 5.7 Pick $\delta \in(0,1)$ and set $\beta_{t}= 2 \log \left(2 \pi_{t} / \delta\right)+4 d \log (d t b r \sqrt{\log (2 d a / \delta)})$, where $\sum_{t \geq 1} \pi_{t}^{-1}=1, \pi_{t}>0$. Let $\tau_{t}=d t^{2} b r \sqrt{\log (2 d a / \delta)}$ Let $\left[\boldsymbol{x}^{*}\right]_{t}$ denotes the closest point in $D_{t}$ to $\boldsymbol{x}^{*}$. Hence, Then,
$\left|f\left(\boldsymbol{x}^{*}\right)-\mu_{t-1}\left(\left[\boldsymbol{x}^{*}\right]_{t}\right)\right| \leq \beta_{t}^{1 / 2} \sigma_{t-1}\left(\left[\boldsymbol{x}^{*}\right]_{t}\right)+\frac{1}{t^{2}} \quad \forall t \geq 1$
holds with probability $\geq 1-\delta$.
Proof Using (9), we have that with probability greater than $1-\delta / 2$,
$$
\forall \boldsymbol{x} \in D,\left|f(x)-f\left(x^{\prime}\right)\right| \leq b \sqrt{\log (2 d a / \delta)}\left\|x-x^{\prime}\right\|_{1}
$$

Hence,
$$
\forall \boldsymbol{x} \in D_{t},\left|f(x)-f\left([x]_{t}\right)\right| \leq r d b \sqrt{\log (2 d a / \delta)} / \tau_{t}
$$

Now by choosing $\tau_{t}=d t^{2} b r \sqrt{\log (2 d a / \delta)}$, we have that
$$
\forall \boldsymbol{x} \in D_{t},\left|f(x)-f\left([x]_{t}\right)\right| \leq \frac{1}{t^{2}}
$$

This implies that $\left|D_{t}\right|=\left(d t^{2} b r \sqrt{\log (2 d a / \delta)}\right)^{d}$. Using $\delta / 2$ in Lemma 5.6, we can apply the confidence bound to $\left[\boldsymbol{x}^{*}\right]_{t}$ (as this lives in $D_{t}$ ) to obtain the result.

Now we are able to bound the regret.
Lemma 5.8 Pick $\delta \in(0,1)$ and set $\beta_{t}= 2 \log \left(4 \pi_{t} / \delta\right)+4 d \log (d t b r \sqrt{\log (4 d a / \delta)})$, where $\sum_{t \geq 1} \pi_{t}^{-1}=1, \pi_{t}>0$. Then, with probability greater than $1-\delta$, for all $t \in \mathbb{N}$, the regret is bounded as follows:
$$
r_{t} \leq 2 \beta_{t}^{1 / 2} \sigma_{t-1}\left(\boldsymbol{x}_{t}\right)+\frac{1}{t^{2}}
$$

Proof We use $\delta / 2$ in both Lemma 5.5 and Lemma 5.7, so that these events hold with probability greater than $1-\delta$. Note that the specification of $\beta_{t}$ in the above lemma is greater than the specification used in Lemma 5.5 (with $\delta / 2$ ), so this choice is valid.

By definition of $\boldsymbol{x}_{t}: \mu_{t-1}\left(\boldsymbol{x}_{t}\right)+\beta_{t}^{1 / 2} \sigma_{t-1}\left(\boldsymbol{x}_{t}\right) \geq \mu_{t-1}\left(\left[\boldsymbol{x}^{*}\right]_{t}\right)+\beta_{t}^{1 / 2} \sigma_{t-1}\left(\left[\boldsymbol{x}^{*}\right]_{t}\right)$. Also, by Lemma 5.7, we have that $\mu_{t-1}\left(\left[\boldsymbol{x}^{*}\right]_{t}\right)+\beta_{t}^{1 / 2} \sigma_{t-1}\left(\left[\boldsymbol{x}^{*}\right]_{t}\right)+1 / t^{2} \geq f\left(\boldsymbol{x}^{*}\right)$, which implies $\mu_{t-1}\left(\boldsymbol{x}_{t}\right)+\beta_{t}^{1 / 2} \sigma_{t-1}\left(\boldsymbol{x}_{t}\right) \geq f\left(\boldsymbol{x}^{*}\right)-1 / t^{2}$. Therefore,
$$
\begin{aligned}
r_{t} & =f\left(\boldsymbol{x}^{*}\right)-f\left(\boldsymbol{x}_{t}\right) \\
& \leq \beta_{t}^{1 / 2} \sigma_{t-1}\left(\boldsymbol{x}_{t}\right)+1 / t^{2}+\mu_{t-1}\left(\boldsymbol{x}_{t}\right)-f\left(\boldsymbol{x}_{t}\right) \\
& \leq 2 \beta_{t}^{1 / 2} \sigma_{t-1}\left(\boldsymbol{x}_{t}\right)+1 / t^{2}
\end{aligned}
$$
which completes the proof.

Now we are ready to complete the proof of Theorem 2. As shown in the proof of Lemma 5.4, we have that with probability greater than $1-\delta$,
$$
\sum_{t=1}^{T} 4 \beta_{t} \sigma_{t-1}^{2}\left(\boldsymbol{x}_{t}\right) \leq C_{1} \beta_{T} \gamma_{T} \quad \forall T \geq 1
$$
so that by Cauchy-Schwarz:
$$
\sum_{t=1}^{T} 2 \beta_{t}^{1 / 2} \sigma_{t-1}\left(\boldsymbol{x}_{t}\right) \leq \sqrt{C_{1} T \beta_{T} \gamma_{T}} \quad \forall T \geq 1
$$

Hence,
$$
\sum_{t=1}^{T} r_{t} \leq \sqrt{C_{1} T \beta_{T} \gamma_{T}}+\pi^{2} / 6 \quad \forall T \geq 1
$$
(since $\sum 1 / t^{2}=\pi^{2} / 6$ ). Theorem 2 now follows.
Finally, we now discuss the additional assumption on $k$ in Theorem 2. For samples $f$ of the GP, consider partial derivatives $\partial f /\left(\partial x_{j}\right)$ of this sample path for $j=1, \ldots, d$. Theorem 5 of Ghosal \& Roy (2006)
states that if derivatives up to fourth order exists for $\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right) \mapsto k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)$, then $f$ is almost surely continuously differentiable, with $\partial f /\left(\partial x_{j}\right)$ distributed as Gaussian processes again. Moreover, there are constants $a, b_{j}>0$ such that
$$
\begin{equation*}
\operatorname{Pr}\left\{\sup _{\boldsymbol{x} \in D}\left|\partial f /\left(\partial x_{j}\right)\right|>L\right\} \leq a e^{-b_{j} L^{2}} \tag{10}
\end{equation*}
$$

Picking $L=\left[\log (d a 2 / \delta) / \min _{j} b_{j}\right]^{1 / 2}$, we have that $a e^{-b_{j} L^{2}} \leq \delta /(2 d)$ for all $j=1, \ldots, d$, so that for $K_{1}=d^{1 / 2} L$, by the mean value theorem, we have $\operatorname{Pr}\left\{\left|f(\boldsymbol{x})-f\left(\boldsymbol{x}^{\prime}\right)\right| \leq K_{1}\left\|\boldsymbol{x}-\boldsymbol{x}^{\prime}\right\| \forall \boldsymbol{x}, \boldsymbol{x}^{\prime} \in D\right\} \geq 1-\delta / 2$. Also, note that $K_{1}=\mathcal{O}\left(\left(\log \delta^{-1}\right)^{1 / 2}\right)$.
This statement is about the joint distribution of $f(\cdot)$ and its partial derivatives w.r.t. each component. For a certain event in this sample space, all $\partial f /\left(\partial x_{j}\right)$ exist, are continuous, and the complement of (10) holds for all $j$. Theorem 5 of Ghosal \& Roy (2006), together with the union bound, implies that this event has probability $\geq 1-\delta / 2$. Derivatives up to fourth order exist for the Gaussian covariance function, and for Matérn kernels with $\nu>2$ (Stein, 1999).

\section*{B. Regret Bound for Target Function in RKHS}

In this section, we detail a proof of Theorem 3. Recall that in this setting, we do not know the generator of the target function $f$, but only a bound on its RKHS norm $\|f\|_{k}$.

Recall the posterior mean function $\mu_{T}(\cdot)$ and posterior covariance function $k_{T}(\cdot, \cdot)$ from Section 2, conditioned on data $\left(\boldsymbol{x}_{t}, y_{t}\right), t=1, \ldots, T$. It is easy to see that the RKHS norm corresponding to $k_{T}$ is given by
$$
\|f\|_{k_{T}}^{2}=\|f\|_{k}^{2}+\sigma^{-2} \sum_{t=1}^{T} f\left(\boldsymbol{x}_{t}\right)^{2}
$$

This implies that $\mathcal{H}_{k}(D)=\mathcal{H}_{k_{T}}(D)$ for any $T$, while the RKHS inner products are different: $\|f\|_{k_{T}} \geq\|f\|_{k}$. Since $\left\langle f(\cdot), k_{T}(\cdot, \boldsymbol{x})\right\rangle_{k_{T}}=f(\boldsymbol{x})$ for any $f \in \mathcal{H}_{k_{T}}(D)$ by the reproducing property, then
$$
\begin{align*}
\left|\mu_{t}(\boldsymbol{x})-f(\boldsymbol{x})\right| & \leq k_{T}(\boldsymbol{x}, \boldsymbol{x})^{1 / 2}\left\|\mu_{t}-f\right\|_{k_{T}}  \tag{11}\\
& =\sigma_{T}(\boldsymbol{x})\left\|\mu_{t}-f\right\|_{k_{T}}
\end{align*}
$$
by the Cauchy-Schwarz inequality.
Compared to our other results, Theorem 3 is an agnostic statement, in that the assumptions the Bayesian UCB algorithm bases its predictions on differ from how $f$ and data $y_{t}$ are generated. First, $f$ is not drawn from a GP, but can be an arbitrary function
from $\mathcal{H}_{k}(D)$. Second, while the UCB method assumes that the noise $\varepsilon_{t}=y_{t}-f\left(\boldsymbol{x}_{t}\right)$ is drawn independently from $N\left(0, \sigma^{2}\right)$, the true sequence of noise variables $\varepsilon_{t}$ can be a uniformly bounded martingale difference sequence: $\varepsilon_{t} \leq \sigma$ for all $t \in \mathbb{N}$. All we have to do in order to lift the proof of Theorem 1 to the agnostic setting is to establish an analogue to Lemma 5.1, by way of the following concentration result.

Theorem 6 Let $\delta \in(0,1)$. Assume the noise variables $\varepsilon_{t}$ are uniformly bounded by $\sigma$. Define:
$$
\beta_{t}=2\|f\|_{k}^{2}+300 \gamma_{t} \ln ^{3}(t / \delta)
$$

Then
$\operatorname{Pr}\left\{\forall T, \forall x \in D,\left|\mu_{T}(\boldsymbol{x})-f(\boldsymbol{x})\right| \leq \beta_{T+1}^{1 / 2} \sigma_{T}(\boldsymbol{x})\right\} \geq 1-\delta$.

\section*{B.1. Concentration of Martingales}

In our analysis, we use the following Bernstein-type concentration inequality for martingale differences, due to Freedman (1975) (see also Theorem 3.15 of McDiarmid 1998).

Theorem 7 (Freedman) Suppose $X_{1}, \ldots, X_{T}$ is a martingale difference sequence, and $b$ is an uniform upper bound on the steps $X_{i}$. Let $V$ denote the sum of conditional variances,
$$
V=\sum_{i=1}^{n} \operatorname{Var}\left(X_{i} \mid X_{1}, \ldots, X_{i-1}\right)
$$

Then, for every $a, v>0$,
$$
\operatorname{Pr}\left\{\sum X_{i} \geq a \text { and } V \leq v\right\} \leq \exp \left(\frac{-a^{2}}{2 v+2 a b / 3}\right)
$$

\section*{B.2. Proof of Theorem 6}

We will show that:
$$
\operatorname{Pr}\left\{\forall T, \quad\left\|\mu_{T}-f\right\|_{k_{T}}^{2} \leq \beta_{T+1}\right\} \geq 1-\delta
$$

Theorem 6 then follows from (11). Recall that $\varepsilon_{t}= y_{t}-f\left(\boldsymbol{x}_{t}\right)$. We will analyze the quantity $Z_{T}= \left\|\mu_{T}-f\right\|_{k_{T}}^{2}$, measuring the error of $\mu_{T}$ as approximation to $f$ under the RKHS norm of $\mathcal{H}_{k_{T}}(D)$. The following lemma provides the connection with the information gain. This lemma is important since our concentration argument is an inductive argument roughly speaking, we condition on getting concentration in the past, in order to achieve good concentration in the future.

Lemma 7.1 We have that
$\sum_{t=1}^{T} \min \left\{\sigma^{-2} \sigma_{t-1}^{2}\left(\boldsymbol{x}_{t}\right), \alpha\right\} \leq \frac{2 \alpha}{\log (1+\alpha)} \gamma_{T}, \quad \alpha>0$.

Proof We have that $\min \{r, \alpha\} \leq(\alpha / \log (1+ \alpha)) \log (1+r)$. The statement follows from Lemma 5.3. \(\square\)

The next lemma bounds the growth of $Z_{T}$. It is formulated in terms of normalized quantities: $\widetilde{\varepsilon}_{t}=\varepsilon_{t} / \sigma$, $\widetilde{f}=f / \sigma, \widetilde{\mu}_{t}=\mu_{t} / \sigma, \widetilde{\sigma}_{t}=\sigma_{t} / \sigma$. Also, to ease notation, we will use $\mu_{t-1}, \sigma_{t-1}$ as shorthand for $\mu_{t-1}\left(\boldsymbol{x}_{t}\right)$, $\sigma_{t-1}\left(\boldsymbol{x}_{t}\right)$.

Lemma 7.2 For all $T \in \mathbb{N}$,
$$
\begin{gathered}
Z_{T} \leq\|f\|_{k}^{2}+2 \sum_{t=1}^{T} \widetilde{\varepsilon}_{t} \frac{\widetilde{\mu}_{t-1}-\widetilde{f}\left(\boldsymbol{x}_{t}\right)}{1+\widetilde{\sigma}_{t-1}^{2}} \\
+\sum_{t=1}^{T} \widetilde{\varepsilon}_{t}^{2} \frac{\widetilde{\sigma}_{t-1}^{2}}{1+\widetilde{\sigma}_{t-1}^{2}}
\end{gathered}
$$

Proof If $\boldsymbol{\alpha}_{t}=\left(\boldsymbol{K}_{t}+\sigma^{2} \boldsymbol{I}\right)^{-1} \boldsymbol{y}_{t}$, then $\mu_{t}(\boldsymbol{x})= \boldsymbol{\alpha}_{t}^{T} \boldsymbol{k}_{t}(\boldsymbol{x})$. Then, $\left\langle\mu_{T}, f\right\rangle_{k}=\boldsymbol{f}_{T}^{T} \boldsymbol{\alpha}_{T},\left\|\mu_{T}\right\|_{k}^{2}= \boldsymbol{y}_{T}^{T} \boldsymbol{\alpha}_{T}-\sigma^{2}\left\|\boldsymbol{\alpha}_{T}\right\|^{2}$. Moreover, for $t \leq T, \mu_{T}\left(x_{t}\right)= \boldsymbol{\delta}_{t}^{T} \boldsymbol{K}_{T}\left(\boldsymbol{K}_{T}+\sigma^{2} \boldsymbol{I}\right)^{-1} \boldsymbol{y}_{T}=y_{t}-\sigma^{2} \alpha_{t}$. Since $Z_{T}= \left\|\mu_{T}-f\right\|_{k}+\sigma^{-2} \sum_{t \leq T}\left(\mu_{T}\left(\boldsymbol{x}_{t}\right)-f\left(\boldsymbol{x}_{t}\right)\right)^{2}$, we have that
$$
\begin{aligned}
Z_{T} & =\|f\|_{k}^{2}-2 \boldsymbol{f}_{T}^{T} \boldsymbol{\alpha}_{T}+\boldsymbol{y}_{T}^{T} \boldsymbol{\alpha}_{T}-\sigma^{2}\left\|\boldsymbol{\alpha}_{T}\right\|^{2} \\
& +\sigma^{-2} \sum_{t=1}^{T}\left(\varepsilon_{t}-\sigma^{2} \alpha_{t}\right)^{2}=\|f\|_{k}^{2} \\
& -\boldsymbol{y}_{T}^{T}\left(\boldsymbol{K}_{T}+\sigma^{2} \boldsymbol{I}\right)^{-1} \boldsymbol{y}_{T}+\sigma^{-2}\left\|\boldsymbol{\varepsilon}_{T}\right\|^{2}
\end{aligned}
$$

Now, $-\boldsymbol{y}_{T}^{T}\left(\boldsymbol{K}_{T}+\sigma^{2} \boldsymbol{I}\right)^{-1} \boldsymbol{y}_{T} \doteq 2 \log P\left(\boldsymbol{y}_{T}\right)$, where " " means that we drop determinant terms, thus concentrate on quadratic functions. Since $\log P\left(\boldsymbol{y}_{T}\right)= \sum_{t} \log P\left(y_{t} \mid \boldsymbol{y}_{<t}\right)=\sum_{t} \log N\left(y_{t} \mid \mu_{t-1}\left(\boldsymbol{x}_{t}\right), \sigma_{t-1}^{2}\left(\boldsymbol{x}_{t}\right)+\right. \sigma^{2}$ ), we have that
$$
\begin{aligned}
& -\boldsymbol{y}_{T}^{T}\left(\boldsymbol{K}_{T}+\sigma^{2} \boldsymbol{I}\right)^{-1} \boldsymbol{y}_{T}=-\sum_{t} \frac{\left(y_{t}-\mu_{t-1}\right)^{2}}{\sigma^{2}+\sigma_{t-1}^{2}} \\
& =2 \sum_{t} \varepsilon_{t} \frac{\mu_{t-1}-f\left(\boldsymbol{x}_{t}\right)}{\sigma^{2}+\sigma_{t-1}^{2}}-\sum_{t} \frac{\varepsilon_{t}^{2} \widetilde{\sigma}_{t-1}^{2}}{\sigma^{2}+\sigma_{t-1}^{2}}-R
\end{aligned}
$$
with $R=\sum_{t}\left(\mu_{t-1}-f\left(\boldsymbol{x}_{t}\right)\right)^{2} /\left(\sigma^{2}+\sigma_{t-1}^{2}\right) \geq 0$. Dropping $-R$ and changing to normalized quantities concludes the proof. \(\square\)

We now define a useful martingale difference sequence. First, it is convenient to define an "escape event" $E_{T}$ as:
$$
E_{T}=\mathrm{I}\left\{Z_{t} \leq \beta_{t+1} \text { for all } t \leq T\right\}
$$
where $\mathrm{I}\{\cdot\}$ is the indicator function. Define the random variables $M_{t}$ by
$$
M_{t}=2 \widetilde{\varepsilon}_{t} E_{t-1} \frac{\widetilde{\mu}_{t-1}-\widetilde{f}\left(\boldsymbol{x}_{t}\right)}{1+\widetilde{\sigma}_{t-1}^{2}} .
$$

Now, since $\widetilde{\varepsilon}_{t}$ is a martingale difference sequence with respect to the histories $\mathcal{H}_{<t}$ and $M_{t} / \widetilde{\varepsilon}_{t}$ is deterministic given $\mathcal{H}_{<t}, M_{t}$ is a martingale difference sequence as well. Next, we show that with high probability, the associated martingale $\sum_{t=1}^{T} M_{t}$ does not grow too large.

Lemma 7.3 Given $\delta \in(0,1)$ and $\beta_{t}$ as defined in in Theorem 6, we have that
$$
\operatorname{Pr}\left\{\forall T, \quad \sum_{t=1}^{T} M_{t} \leq \beta_{T+1} / 2\right\} \geq 1-\delta,
$$

The proof is given below in Section B.3. Equipped with this lemma, we can prove Theorem 6.
Proof [of Theorem 6] It suffices to show that the highprobability event described in Lemma 7.3 is contained in the support of $E_{T}$ for every $T$. We prove the latter by induction on $T$.

By Lemma 7.2 and the definition of $\beta_{1}$, we know that $Z_{0} \leq\|f\|_{k} \leq \beta_{1}$. Hence $E_{0}=1$ always. Now suppose the high-probability event of Lemma 7.3 holds, in particular $\sum_{t=1}^{T} M_{t} \leq \beta_{T+1} / 2$. For the inductive hypothesis, assume $E_{T-1}=1$. Using this and Lemma 7.2:
$$
\begin{aligned}
Z_{T} & \leq\|f\|_{k}^{2}+2 \sum_{t=1}^{T} \frac{\widetilde{\varepsilon}_{t}\left(\widetilde{\mu}_{t-1}-\widetilde{f}\left(\boldsymbol{x}_{t}\right)\right)}{1+\widetilde{\sigma}_{t-1}^{2}}+\sum_{t=1}^{T} \frac{\widetilde{\varepsilon}_{t}^{2} \widetilde{\sigma}_{t-1}^{2}}{1+\widetilde{\sigma}_{t-1}^{2}} \\
& =\|f\|_{k}^{2}+\sum_{t=1}^{T} M_{t}+\sum_{t=1}^{T} \widetilde{\varepsilon}_{t}^{2} \frac{\widetilde{\sigma}_{t-1}^{2}}{1+\widetilde{\sigma}_{t-1}^{2}} \\
& \leq\|f\|_{k}^{2}+\beta_{T+1} / 2+\sum_{t=1}^{T} \min \left\{\widetilde{\sigma}_{t-1}^{2}, 1\right\} \\
& \leq\|f\|_{k}^{2}+\beta_{T+1} / 2+(2 / \log 2) \gamma_{T} \leq \beta_{T+1}
\end{aligned}
$$

The equality in the second step uses the inductive hypothesis. Thus we have shown $E_{T}=1$, completing the induction. \(\square\)

\section*{B.3. Concentration}

What remains to be shown is Lemma 7.3. While the step sizes $\left|M_{t}\right|$ are uniformly bounded, a standard application of the Hoeffding-Azuma inequality leads to a bound of $T^{3 / 4}$, too large for our purpose. We use the more specific Theorem 7 instead, which requires to control the conditional variances rather than the marginal variances which can be much larger.

Proof [of Lemma 7.3] Let us first obtain upper bounds
on the step sizes of our martingale.
$$
\begin{align*}
\left|M_{t}\right| & =2\left|\widetilde{\varepsilon}_{t}\right| E_{t-1} \frac{\left|\widetilde{\mu}_{t-1}-\widetilde{f}\left(\boldsymbol{x}_{t}\right)\right|}{1+\widetilde{\sigma}_{t-1}^{2}} \\
& \leq 2\left|\widetilde{\varepsilon}_{t}\right| E_{t-1} \frac{\beta_{t}^{1 / 2} \widetilde{\sigma}_{t-1}}{1+\widetilde{\sigma}_{t-1}^{2}} \\
& \leq 2\left|\widetilde{\varepsilon}_{t}\right| E_{t-1} \beta_{t}^{1 / 2} \min \left\{\widetilde{\sigma}_{t-1}, 1 / 2\right\} \tag{12}
\end{align*}
$$
where the first inequality follows from the definition of $E_{t}$. Moreover, $r /\left(1+r^{2}\right) \leq \min \{r, 1 / 2\}$ for $r \geq 0$. Therefore, $\left|M_{t}\right| \leq \beta_{T}^{1 / 2}$, since $\left|\widetilde{\varepsilon}_{t}\right| \leq 1$ and $\beta_{t}$ in nondecreasing. Next, we bound the sum of the conditional variances of the martingale:
$$
\begin{aligned}
V_{T} & :=\sum_{t=1}^{T} \operatorname{Var}\left(M_{t} \mid M_{1} \ldots M_{t-1}\right) \\
& \leq \sum_{t=1}^{T} 4\left|\widetilde{\varepsilon}_{t}\right|^{2} E_{t-1} \beta_{t} \min \left\{\widetilde{\sigma}_{t-1}^{2}, 1 / 4\right\} \\
& \leq 4 \beta_{T} \sum_{t=1}^{T} E_{t-1} \min \left\{\widetilde{\sigma}_{t-1}^{2}, 1 / 4\right\} \quad\left|\widetilde{\varepsilon}_{t}\right| \leq 1 \\
& \leq 9 \beta_{T} \gamma_{T}
\end{aligned}
$$

In the last line, we used Lemma 7.1 with $\alpha=1 / 4$, noting that $8 \alpha / \log (1+\alpha) \leq 9$. Since we have established that the sum of conditional variances, $V_{T}$, is always bounded by $9 \beta_{T} \gamma_{T}$, we can apply Theorem 7 with parameters $a=\beta_{T+1} / 2, b=\beta_{T+1}^{1 / 2}$ and $v=9 \beta_{T} \gamma_{T}$ to get
$$
\begin{aligned}
& \operatorname{Pr}\left\{\sum_{t=1}^{T} M_{t} \geq \beta_{T+1} / 2\right\} \\
& =\operatorname{Pr}\left\{\sum_{t=1}^{T} M_{t} \geq \beta_{T+1} / 2 \text { and } V_{T} \leq 9 \beta_{T} \gamma_{T}\right\} \\
& \leq \exp \left(\frac{-\left(\beta_{T+1} / 2\right)^{2}}{2\left(9 \beta_{T} \gamma_{T}\right)+\frac{2}{3}\left(\beta_{T+1} / 2\right) \beta_{T+1}^{1 / 2}}\right) \\
& =\exp \left(\frac{-\beta_{T+1}}{72 \gamma_{T}+\frac{4}{3} \beta_{T+1}^{1 / 2}}\right) \\
& \leq \max \left\{\exp \left(\frac{-\beta_{T+1}}{144 \gamma_{T}}\right), \exp \left(\frac{-3 \beta_{T+1}^{1 / 2}}{8}\right)\right\}
\end{aligned}
$$

Note that our choice of $\beta_{T+1}$ satisfies:
$$
\max \left\{144 \gamma_{T} \log \left(T^{2} / \delta\right),\left((8 / 3) \log \left(T^{2} / \delta\right)\right)^{2}\right\} \leq \beta_{T+1}
$$

Therefore, the previous probability is bounded by $\delta / T^{2}$, whereas the last inequality follows from the definition of $\beta_{T+1}$. With a final application of the union
bound:
$$
\begin{aligned}
& \operatorname{Pr}\left\{\sum_{t=1}^{T} M_{t} \geq \beta_{T+1} / 2 \text { for some } T\right\} \\
& \leq \sum_{T \geq 1} \operatorname{Pr}\left\{\sum_{t=1}^{T} M_{t} \geq \beta_{T+1} / 2\right\} \\
& \leq \sum_{T \geq 2} \delta / T^{2} \leq \delta\left(\pi^{2} / 6-1\right) \leq \delta
\end{aligned}
$$
completing the proof of Lemma 7.3.

\section*{C. Bounds on Information Gain}

In this section, we show how to bound $\gamma_{T}$, the maximum information gain after $T$ rounds, for compact $D \subset \mathbb{R}^{d}$ (assumptions of Theorem 2) and several commonly used covariance functions. In this section, we assume ${ }^{4}$ that $k(\boldsymbol{x}, \boldsymbol{x})=1$ for all $\boldsymbol{x} \in D$.

The plan of attack is as follows. First, we note that the argument of $\gamma_{T}, \mathrm{I}\left(\boldsymbol{y}_{A} ; \boldsymbol{f}_{A}\right)$ is a submodular function, so $\gamma_{T}$ can be bounded by the value obtained by greedy maximization. Next, we use a discretization $D_{T} \subset D$ with $n_{T}=\left|D_{T}\right|=T^{\tau}$ with nearest neighbour distance $o(1)$, consider the kernel matrix $\boldsymbol{K}_{D_{T}} \in \mathbb{R}^{n_{T} \times n_{T}}$, and bound $\gamma_{T}$ by an expression involving the eigenvalues $\left\{\hat{\lambda}_{t}\right\}$ of this matrix, which is done by a further relaxation of the greedy procedure. Finally, we bound this empirical expression in terms of the kernel operator eigenvalues of $k$ w.r.t. the uniform distribution on D. Asymptotic expressions for the latter are reviewed in Seeger et al. (2008), which we plug in to obtain our results. A key step in this argument is to ensure the existence of a discretization $D_{T}$, for which tails of the empirical spectrum can be bounded by tails of the process spectrum. We will invoke the probabilistic method for that.

\section*{C.1. Greedy Maximization and Discretization}

In this section, we fix $T \in \mathbb{N}$ and assume the existence of a discretization $D_{T} \subset D, n_{T}=\left|D_{T}\right|$ on the order of $T^{\tau}$, such that:
$$
\begin{equation*}
\forall \boldsymbol{x} \in D \exists[\boldsymbol{x}]_{T} \in D_{T}:\left\|\boldsymbol{x}-[\boldsymbol{x}]_{T}\right\|=\mathcal{O}\left(T^{-\tau / d}\right) \tag{13}
\end{equation*}
$$

We come back to the choice of $D_{T}$ below. We restrict the information gain to subsets $A \subset D_{T}$ :
$$
\tilde{\gamma}_{T}=\max _{A \subset D_{T},|A|=T} \mathrm{I}\left(\boldsymbol{y}_{A} ; \boldsymbol{f}_{A}\right)
$$

Of course, $\tilde{\gamma}_{T} \leq \gamma_{T}$, but we can bound the slack.

\footnotetext{
${ }^{4}$ Without loss in generality. We use this assumption below to ensure that $n_{T}^{-1} \operatorname{tr} \boldsymbol{K}_{D_{T}}=\int k(\boldsymbol{x}, \boldsymbol{x}) d \boldsymbol{x}$. If $k(\boldsymbol{x}, \boldsymbol{x})$ is not constant, this is approximately true by the law of large numbers, and our result below remains valid.
}

Lemma 7.4 Under the assumptions of Theorem 2, the information gain $F_{T}\left(\left\{\boldsymbol{x}_{t}\right\}\right)=(1 / 2) \log \mid \boldsymbol{I}+ \sigma^{-2} \boldsymbol{K}_{\left\{\boldsymbol{x}_{t}\right\}} \mid$ is uniformly Lipschitz-continuous in each component $\boldsymbol{x}_{t} \in D$.

Proof The assumptions of Theorem 2 imply that the kernel $K\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)$ is continuously differentiable. The result follows from the fact that $F_{T}\left(\left\{\boldsymbol{x}_{t}\right\}\right)$ is continuously differentiable in the kernel matrix $\boldsymbol{K}_{\left\{\boldsymbol{x}_{t}\right\}}$.

Lemma 7.5 Let $D_{T}$ be a discretization of $D$ such that (13) holds. Under the assumptions of Theorem 2, we have that
$$
0 \leq \gamma_{T}-\tilde{\gamma}_{T}=\mathcal{O}\left(T^{1-\tau / d}\right)
$$

Proof Fix $T \in \mathbb{N}$, and let $A=\left\{\boldsymbol{x}_{1}, \ldots, \boldsymbol{x}_{T}\right\}$ be a maximizer for $\gamma_{T}$. Consider neighbours $\left[\boldsymbol{x}_{t}\right]_{T} \in D_{T}$ according to (13), $[A]_{T}=\left\{\left[\boldsymbol{x}_{t}\right]_{T}\right\}$. Then,
$$
0 \leq \gamma_{T}-\tilde{\gamma}_{T} \leq \gamma_{T}-\mathrm{I}\left(\boldsymbol{y}_{[A]_{T}} ; \boldsymbol{f}_{[A]_{T}}\right)=F_{T}(A)-F_{T}\left([A]_{T}\right)
$$
where $F_{T}\left(\left\{\boldsymbol{x}_{t}\right\}\right)=(1 / 2) \log \left|\boldsymbol{I}+\sigma^{-2} \boldsymbol{K}_{\left\{\boldsymbol{x}_{t}\right\}}\right|$. By Lemma 7.4, $F_{T}$ is uniformly Lipschitz-continuous in each component, so that $\left|\gamma_{T}-\mathrm{I}\left(\boldsymbol{y}_{[A]_{T}} ; \boldsymbol{f}_{[A]_{T}}\right)\right|= \mathcal{O}\left(T \max _{t}\left\|\boldsymbol{x}_{t}-\left[\boldsymbol{x}_{t}\right]_{T}\right\|\right)=\mathcal{O}\left(T^{1-\tau / d}\right)$ by (13) and the mean value theorem.

We concentrate on $\tilde{\gamma}_{T}$ in the sequel. Let $\boldsymbol{K}_{D_{T}}= \left[k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)\right]_{\boldsymbol{x}, \boldsymbol{x}^{\prime} \in D_{T}}$ be the kernel matrix over the entire $D_{T}$, and $\boldsymbol{K}_{D_{T}}=\boldsymbol{U} \hat{\boldsymbol{\Lambda}} \boldsymbol{U}^{T}$ its eigendecomposition, with $\hat{\lambda}_{1} \geq \hat{\lambda}_{2} \geq \cdots \geq 0$ and $\boldsymbol{U}=\left[\boldsymbol{u}_{1} \boldsymbol{u}_{2} \ldots\right]$ orthonormal. Here, if $T>n_{T}$, define $\hat{\lambda}_{t}=0$ for $t=n_{T}+1, \ldots, T$. Information gain maximization over a finite $D_{T}$ can be described in terms of a simple linear-Gaussian model over the unknown $\boldsymbol{f} \in \mathbb{R}^{n_{T}}$, with prior $P(\boldsymbol{f})=N\left(\mathbf{0}, \boldsymbol{K}_{D_{T}}\right)$ and likelihood potentials $P\left(y_{t} \mid \boldsymbol{f}\right)=N\left(\boldsymbol{v}_{t}^{T} \boldsymbol{f}, \sigma^{2}\right)$ with unit-norm features, $\left\|\boldsymbol{v}_{t}\right\|=1$. With the following lemma, we upper-bound $\tilde{\gamma}_{T}$ by way of two relaxations.

Lemma 7.6 For any $T \geq 1$, we have that
$$
\tilde{\gamma}_{T} \leq \frac{1 / 2}{1-e^{-1}} \max _{m_{1}, \ldots, m_{T}} \sum_{t=1}^{T} \log \left(1+\sigma^{-2} m_{t} \hat{\lambda}_{t}\right)
$$
subject to $m_{t} \in \mathbb{N}, \sum_{t} m_{T}=T$, where $\hat{\lambda}_{1} \geq \hat{\lambda}_{2} \geq \ldots$ is the spectrum of the kernel matrix $\boldsymbol{K}_{D_{T}}$. Here, if $T>n_{T}$, then $m_{t}=0$ for $t>n_{T}$.

Proof As shown by Krause \& Guestrin (2005), the function $F(A)=\mathrm{I}\left(\boldsymbol{y}_{A} ; \boldsymbol{f}\right)$ is submodular. In
the particular case considered here, this can be seen as follows: $F(A)=\mathrm{H}\left(\boldsymbol{y}_{A}\right)-\mathrm{H}\left(\boldsymbol{y}_{A} \mid \boldsymbol{f}\right)$, where the entropy $\mathrm{H}\left(\boldsymbol{y}_{A}\right)$ is a (not-necessarily monotonic) submodular function in $A$, and since the noise is conditionally independent given $\boldsymbol{f}, \mathrm{H}\left(\boldsymbol{y}_{A} \mid \boldsymbol{f}\right)$ is an additive (modular) function in $A$. Subtracting a modular function preserves submodularity, thus $F(A)$ is submodular. Furthermore, the information gain is monotonic in $A$ (i.e., $F(A) \leq F(B)$ whenever $A \subseteq B$ ) (Cover \& Thomas, 1991). Thus, we can apply the result of Nemhauser et al. $(1978)^{5}$ which guarantees that $\tilde{\gamma}_{T}$ is upper-bounded by $1 /(1-1 / e)$ times the value the greedy maximization algorithm attains. The latter chooses features of the form $\boldsymbol{v}_{t}=\boldsymbol{\delta}_{\boldsymbol{x}_{t}}=\left[\mathrm{I}_{\left\{\boldsymbol{x}=\boldsymbol{x}_{t}\right\}}\right]$ in each round, $\boldsymbol{x}_{t} \in D_{T}$. We upper-bound the greedy maximum once more by relaxing these constraints to $\left\|\boldsymbol{v}_{t}\right\|=1$ only. In the remainder of the proof, we concentrate on this relaxed greedy procedure. Suppose that up to round $t$, it chose $\boldsymbol{v}_{1}, \ldots, \boldsymbol{v}_{t-1}$. The posterior $P\left(\boldsymbol{f} \mid \boldsymbol{y}_{t-1}\right)$ has inverse covariance matrix $\boldsymbol{\Sigma}_{t-1}^{-1}=\boldsymbol{K}_{D_{T}}^{-1}+\sigma^{-2} \boldsymbol{V}_{t-1} \boldsymbol{V}_{t-1}^{T}$, $\boldsymbol{V}_{t-1}=\left[\boldsymbol{v}_{1} \ldots \boldsymbol{v}_{t-1}\right]$, and the greedy procedure selects $\boldsymbol{v}$ so to maximize the variance $\boldsymbol{v}^{T} \boldsymbol{\Sigma}_{t-1} \boldsymbol{v}$ : the eigenvector corresponding to $\boldsymbol{\Sigma}_{t-1}$ 's largest eigenvalue (by the Rayleigh-Ritz theorem). Since $\boldsymbol{\Sigma}_{0}=\boldsymbol{K}_{D_{T}}$, then $\boldsymbol{v}_{1}=\boldsymbol{u}_{1}$. Moreover, if all $\boldsymbol{v}_{t^{\prime}}, t^{\prime}<t$, have been chosen among $\boldsymbol{U}$ 's columns, then by the inverse covariance expression just given, $\boldsymbol{K}_{D_{T}}$ and $\boldsymbol{\Sigma}_{t-1}$ have the same eigenvectors, so that $\boldsymbol{v}_{t}$ is a column of $\boldsymbol{U}$ as well. For example, if $\boldsymbol{v}_{t}=\boldsymbol{u}_{j}$, then comparing $\boldsymbol{\Sigma}_{t-1}$ and $\boldsymbol{\Sigma}_{t}$, all eigenvalues other than the $j$-th remain the same, while the latter is shrunk. Therefore, after $T$ rounds of the relaxed greedy procedure: $\boldsymbol{v}_{t} \in\left\{\boldsymbol{u}_{1}, \ldots, \boldsymbol{u}_{\min \left\{T, n_{T}\right\}}\right\}, t=1, \ldots, T$ : at most the leading $T$ eigenvectors of $\boldsymbol{K}_{D_{T}}$ can have been selected (possibly multiple times). If $m_{t}$ denotes the number that the $t$-th column of $\boldsymbol{U}$ has been selected, we obtain the theorem statement by a final bounding step.

\section*{C.2. From Empirical to Process Eigenvalues}

The final step will be to relate the empirical spectrum $\left\{\hat{\lambda}_{t}\right\}$ to the kernel operator spectrum. Since $\log \left(1+\sigma^{-2} m_{t} \hat{\lambda}_{t}\right) \leq \sigma^{-2} m_{t} \hat{\lambda}_{t}$ in Theorem 7.6, we will mainly be interested in relating the tail sums of the spectra. Let $\mu(\boldsymbol{x})=\mathcal{V}(D)^{-1} \mathrm{I}_{\{\boldsymbol{x} \in D\}}$ be the uniform distribution on $D, \mathcal{V}(D)=\int_{\boldsymbol{x} \in D} d \boldsymbol{x}$, and assume that $k$ is continuous. Note that $\int k(\boldsymbol{x}, \boldsymbol{x}) \mu(\boldsymbol{x}) d \boldsymbol{x}=1$ by our assumption $k(\boldsymbol{x}, \boldsymbol{x})=1$, so that $k$ is Hilbert-

\footnotetext{
${ }^{5}$ While the result of Nemhauser et al. (1978) is stated in terms of finite sets, it extends to infinite sets as long as the greedy selection can be implemented efficiently.
}

Schmidt on $L_{2}(\mu)$. Then, Mercer's theorem (Wahba, 1990) states that the corresponding kernel operator has a discrete eigenspectrum $\left\{\left(\lambda_{s}, \phi_{s}(\cdot)\right)\right\}$, and
$$
k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)=\sum_{s \geq 1} \lambda_{s} \phi_{s}(\boldsymbol{x}) \phi_{s}\left(\boldsymbol{x}^{\prime}\right)
$$
where $\lambda_{1} \geq \lambda_{2} \geq \cdots \geq 0$, and $\mathbb{E}_{\mu}\left[\phi_{s}(\boldsymbol{x}) \phi_{t}(\boldsymbol{x})\right]= \delta_{s, t}$. Moreover, $\sum_{s \geq 1} \lambda_{s}^{2}<\infty$, and the expansion of $k$ converges absolutely and uniformly on $D \times D$. Note that $\sum_{s \geq 1} \lambda_{s}=\sum_{s \geq 1} \lambda_{s} \mathbb{E}_{\mu}\left[\phi_{s}(\boldsymbol{x})^{2}\right]= \int K(\boldsymbol{x}, \boldsymbol{x}) \mu(\boldsymbol{x}) d \boldsymbol{x}=1$. In order to proceed from Theorem 7.6, we have to pick a discretization $D_{T}$ for which (13) holds, and for which $\sum_{t>T_{*}} \hat{\lambda}_{t}$ is not much larger than $\sum_{t>T_{*}} \lambda_{t}$. With the following lemma, we determine sizes $n_{T}$ for which such discretizations exist.

Lemma 7.7 Fix $T \in \mathbb{N}, \delta>0$ and $\varepsilon>0$. There exists a discretization $D_{T} \subset D$ of size
$n_{T}=\mathcal{V}(D)(\varepsilon / \sqrt{d})^{-d}[\log (1 / \delta)+d \log (\sqrt{d} / \varepsilon)+\log \mathcal{V}(D)]$
which fulfils the following requirements:
- $\varepsilon$-denseness: For any $\boldsymbol{x} \in D$, there exists $[\boldsymbol{x}]_{T} \in D_{T}$ such that $\left\|\boldsymbol{x}-[\boldsymbol{x}]_{T}\right\| \leq \varepsilon$.
- If $\operatorname{spec}\left(\boldsymbol{K}_{D_{T}}\right)=\left\{\hat{\lambda}_{1} \geq \hat{\lambda}_{2} \geq \ldots\right\}$, then for any $T_{*}=1, \ldots, n_{T}$ :
$$
n_{T}^{-1} \sum_{t=1}^{T_{*}} \hat{\lambda}_{t} \geq \sum_{t=1}^{T_{*}} \lambda_{t}-\delta
$$

Proof First, if we draw $n_{T}$ samples $\tilde{\boldsymbol{x}}_{j} \sim \mu(\boldsymbol{x})$ independently at random, then $D_{T}=\left\{\tilde{\boldsymbol{x}}_{j}\right\}$ is $\varepsilon$-dense with probability $\geq 1-\delta$. Namely, cover $D$ with $N=\mathcal{V}(D)(\varepsilon / \sqrt{d})^{-d}$ hypercubes of sidelength $\varepsilon / \sqrt{d}$, within which the maximum Euclidean distance is $\varepsilon$. The probability of not hitting at least one cell is upperbounded by $N(1-1 / N)^{n_{T}}$. Since $\log (1-1 / N) \leq -1 / N$, this is upper-bounded by $\delta$ if $n_{T} \geq N \log (N / \delta)$.
Now, let $S=n_{T}^{-1} \sum_{t=1}^{T_{*}} \hat{\lambda}_{t}$. Shawe-Taylor et al. (2005) show that $\mathbb{E}[S] \geq \sum_{t=1}^{T_{*}} \lambda_{t}$. If $\mathcal{C}$ is the event $\left\{D_{T}\right.$ is $\varepsilon-$ dense $\}$, then $\operatorname{Pr}(\mathcal{C}) \geq 1-\delta$. Since $S \leq n_{T}^{-1} \operatorname{tr} \boldsymbol{K}_{D_{T}}=1$ in any case, we have that $\mathbb{E}[S \mid \mathcal{C}] \geq \mathbb{E}[S]-\operatorname{Pr}\left(\mathcal{C}^{c}\right) \geq \sum_{t=1}^{T_{*}} \lambda_{t}-\delta$. By the probabilistic method, there must exist some $D_{T}$ for which $\mathcal{C}$ and the latter inequality holds.

The following lemma, the equivalent of Theorem 4 in the context here, is a direct consequence of Lemma 7.6.

Lemma 7.8 Let $D_{T}$ be some discretization of $D$,
$n_{T}=\left|D_{T}\right|$. Then, for any $T_{*}=1, \ldots, \min \left\{T, n_{T}\right\}:$
$$
\begin{aligned}
\tilde{\gamma}_{T} \leq \frac{1 / 2}{1-e^{-1}} & \max _{r=1, \ldots, T}\left(T_{*} \log \left(r n_{T} / \sigma^{2}\right)\right. \\
& \left.+(T-r) \sigma^{-2} \sum_{t=T_{*}+1}^{n_{T}} \hat{\lambda}_{t}\right)
\end{aligned}
$$

Proof We split the right hand side in Lemma 7.6 at $t=T_{*}$. Let $r=\sum_{t \leq T_{*}} m_{t}$. For $t \leq T_{*}$ : $\log \left(1+m_{t} \hat{\lambda}_{t} / \sigma^{2}\right) \leq \log \left(r n_{T} / \sigma^{2}\right)$, since $\hat{\lambda}_{t} \leq n_{T}$. For $t>T_{*}: \log \left(1+m_{t} \hat{\lambda}_{t} / \sigma^{2}\right) \leq m_{t} \hat{\lambda}_{t} / \sigma^{2} \leq(T-r) \hat{\lambda}_{t} / \sigma^{2}$.

The following theorem describes our "recipe" for obtaining bounds on $\gamma_{T}$ for a particular kernel $k$, given that tail bounds on $B_{k}\left(T_{*}\right)=\sum_{s>T_{*}} \lambda_{s}$ are known.

Theorem 8 Suppose that $D \subset \mathbb{R}^{d}$ is compact, and $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)$ is a covariance function for which the additional assumption of Theorem 2 holds. Moreover, let $B_{k}\left(T_{*}\right)=\sum_{s>T_{*}} \lambda_{s}$, where $\left\{\lambda_{s}\right\}$ is the operator spectrum of $k$ with respect to the uniform distribution over $D$. Pick $\tau>0$, and let $n_{T}=C_{4} T^{\tau}(\log T)$ with $C_{4}=2 \mathcal{V}(D)(2 \tau+1)$. Then, the following bound holds true:
$$
\begin{aligned}
\gamma_{T} \leq & \frac{1 / 2}{1-e^{-1}} \max _{r=1, \ldots, T}\left(T_{*} \log \left(r n_{T} / \sigma^{2}\right)\right. \\
& \left.+C_{4} \sigma^{-2}(1-r / T)(\log T)\left(T^{\tau+1} B_{k}\left(T_{*}\right)+1\right)\right) \\
& +\mathcal{O}\left(T^{1-\tau / d}\right)
\end{aligned}
$$
for any $T_{*} \in\left\{1, \ldots, n_{T}\right\}$.
Proof Let $\varepsilon=d^{1 / 2} T^{-\tau / d}$ and $\delta=T^{-(\tau+1)}$. Lemma 7.7 provides the existence of a discretization $D_{T}$ of size $n_{T}$ which is $\varepsilon$-dense, and for which $n_{T}^{-1} \sum_{t=1}^{T_{*}} \hat{\lambda}_{t} \geq \sum_{t=1}^{T_{*}} \lambda_{t}-\delta$. Since $n_{T}^{-1} \sum_{t=1}^{n_{T}} \hat{\lambda}_{t}=1=\sum_{t \geq 1} \lambda_{t}$, then $\sum_{t>T_{*}} \hat{\lambda}_{t} \leq B_{k}\left(T_{*}\right)+\delta$. The statement follows by using Lemma 7.8 with these bounds, and finally employing Lemma 7.5.

\section*{C.3. Proof of Theorem 5}

In this section, we instantiate Theorem 8 in order to obtain bounds on $\gamma_{T}$ for Squared Exponential and Matérn kernels, results which are summarized in Theorem 5.

\section*{Squared Exponential Kernel}

For the Squared Exponential kernel $k, B_{k}\left(T_{*}\right)$ is given by Seeger et al. (2008). While $\mu(\boldsymbol{x})$ was Gaussian
there, the same decay rate holds for $\lambda_{s}$ w.r.t. uniform $\mu(\boldsymbol{x})$, while constants might change. In hindsight, it turns out that $\tau=d$ is the optimal choice for the discretization size, rendering the second term in Theorem 5 to be $\mathcal{O}(1)$, which is subdominant and will be neglected in the sequel. We have that $\lambda_{s} \leq c B^{s^{1 / d}}$ with $B<1$. Following their analysis,
$$
B_{k}\left(T_{*}\right) \leq c(d!) \alpha^{-d} e^{-\beta} \sum_{j=0}^{d-1}(j!)^{-1} \beta^{j}
$$
where $\alpha=-\log B, \beta=\alpha T_{*}^{1 / d}$. Therefore, $B_{k}\left(T_{*}\right)= \mathcal{O}\left(e^{-\beta} \beta^{d-1}\right), \beta=\alpha T_{*}^{1 / d}$ 。
We have to pick $T_{*}$ such that $e^{-\beta}$ is not much larger than $\left(T n_{T}\right)^{-1}$. Suppose that $T_{*}=\left[\log \left(T n_{T}\right) / \alpha\right]^{d}$, so that $e^{-\beta}=\left(T n_{T}\right)^{-1}, \beta=\log \left(T n_{T}\right)$. The bound becomes
$$
\begin{aligned}
\max _{r=1, \ldots, T}( & T_{*} \log \left(r n_{T} / \sigma^{2}\right) \\
& \left.+\sigma^{-2}(1-r / T)\left(C_{5} \beta^{d-1}+C_{4}(\log T)\right)\right)
\end{aligned}
$$
with $n_{T}=C_{4} T^{d}(\log T)$. The first part dominates, so that $r=T$ and $\gamma_{T}=\mathcal{O}\left(\left[\log \left(T^{d+1}(\log T)\right)\right]^{d+1}\right)= \mathcal{O}\left((\log T)^{d+1}\right)$. This should be compared with $\mathbb{E}\left[\mathrm{I}\left(\boldsymbol{y}_{T} ; \boldsymbol{f}_{T}\right)\right]=\mathcal{O}\left((\log T)^{d+1}\right)$ given by Seeger et al. (2008), where the $\boldsymbol{x}_{t}$ are drawn independently from a Gaussian base distribution. At least restricted to a compact set $D$, we obtain the same expression to leading order for $\max _{\left\{\boldsymbol{x}_{t}\right\}} \mathrm{I}\left(\boldsymbol{y}_{T} ; \boldsymbol{f}_{T}\right)$.

\section*{Matérn Kernels}

For Matérn kernels $k$ with roughness parameter $\nu$, $B_{k}\left(T_{*}\right)$ is given by Seeger et al. (2008) for the uniform base distribution $\mu(\boldsymbol{x})$ on $D$. Namely, $\lambda_{s} \leq c s^{-(2 \nu+d) / d}$ for almost all $s \in \mathbb{N}$, and $B_{k}\left(T_{*}\right)= \mathcal{O}\left(T_{*}^{1-(2 \nu+d) / d}\right)$. To match terms in the $\tilde{\gamma}_{T}$ bound, we choose $T_{*}=\left(T n_{T}\right)^{d /(2 \nu+d)}\left(\log \left(T n_{T}\right)\right)^{\kappa}(\kappa$ chosen below), so that the bound becomes
$$
\begin{aligned}
\max _{r=1, \ldots, T} & \left(T_{*} \log \left(r n_{T} / \sigma^{2}\right)+\sigma^{-2}(1-r / T)\right. \\
& \left.\times\left(C_{5} T_{*}\left(\log \left(T n_{T}\right)\right)^{-\kappa(2 \nu+d) / d}+C_{4}(\log T)\right)\right) \\
& +\mathcal{O}\left(T^{1-\tau / d}\right)
\end{aligned}
$$
with $n_{T}=C_{4} T^{\tau}(\log T)$. For $\kappa=-d /(2 \nu+d)$, we obtain that the maximum over $r$ is $\mathcal{O}\left(T_{*} \log \left(T n_{T}\right)\right)= \mathcal{O}\left(T^{(\tau+1) d /(2 \nu+d)}(\log T)\right)$. Finally, we choose $\tau= 2 \nu d /(2 \nu+d(d+1))$ to match this term with $\mathcal{O}\left(T^{1-\tau / d}\right)$. Plugging this in, we have $\gamma_{T}=\mathcal{O}\left(T^{1-2 \eta}(\log T)\right)$, $\eta=\frac{\nu}{2 \nu+d(d+1)}$. Together with Theorem 2 (for $\nu>2$ ), we have that $R_{T}=\mathcal{O}^{*}\left(T^{1-\eta}\right)$ (suppressing log factors): for any $\nu>2$ and any dimension $d$, the GP-

UCB algorithm is guaranteed to be no-regret in this case with arbitrarily high probability.

How does this bound compare to the bound on $\mathbb{E}\left[\mathrm{I}\left(\boldsymbol{y}_{T} ; \boldsymbol{f}_{T}\right)\right]$ given by Seeger et al. (2008)? Here, $\gamma_{T}= \mathcal{O}\left(T^{d(d+1) /(2 \nu+d(d+1))}(\log T)\right)$, while $\mathbb{E}\left[\mathrm{I}\left(\boldsymbol{y}_{T} ; \boldsymbol{f}_{T}\right)\right]= \mathcal{O}\left(T^{d /(2 \nu+d)}(\log T)^{2 \nu /(2 \nu+d)}\right)$.

\section*{Linear Kernel}

For linear kernels $k\left(\boldsymbol{x}, \boldsymbol{x}^{\prime}\right)=\boldsymbol{x}^{T} \boldsymbol{x}^{\prime}, \boldsymbol{x} \in \mathbb{R}^{d}$ with $\|\boldsymbol{x}\| \leq$ 1 , we can bound $\gamma_{T}$ directly. Let $\boldsymbol{X}_{T}=\left[\boldsymbol{x}_{1} \ldots, \boldsymbol{x}_{T}\right] \in \mathbb{R}^{d \times T}$ with all $\left\|\boldsymbol{x}_{t}\right\| \leq 1$. Now,
$$
\begin{aligned}
\log \left|\boldsymbol{I}+\sigma^{-2} \boldsymbol{X}_{T}^{T} \boldsymbol{X}_{T}\right| & =\log \left|\boldsymbol{I}+\sigma^{-2} \boldsymbol{X}_{T} \boldsymbol{X}_{T}^{T}\right| \\
& \leq \log \left|\boldsymbol{I}+\sigma^{-2} \boldsymbol{D}\right|
\end{aligned}
$$
with $\boldsymbol{D}=\operatorname{diag} \operatorname{diag}^{-1}\left(\boldsymbol{X}_{T} \boldsymbol{X}_{T}^{T}\right)$, by Hadamard's inequality. The largest eigenvalue $\hat{\lambda}_{1}$ of $\boldsymbol{X}_{T} \boldsymbol{X}_{T}^{T}$ is $\mathcal{O}(T)$, so that
$$
\log \left|\boldsymbol{I}+\sigma^{-2} \boldsymbol{X}_{T}^{T} \boldsymbol{X}_{T}\right| \leq d \log \left(1+\sigma^{-2} \hat{\lambda}_{1}\right)
$$
and $\gamma_{T}=\mathcal{O}(d \log T)$.
