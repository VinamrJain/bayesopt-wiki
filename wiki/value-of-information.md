---
title: Value of Information
slug: value-of-information
tags: [acquisition, decision-theoretic, myopic, lookahead]
subtopic: decision-theoretic
requires: [problem-setup, gaussian-process-regression, expected-improvement, acquisition-functions]
sources: [frazier2018, frazier2009kg]
summary: "The decision-theoretic quantity underneath every acquisition; the VoI frame."
grade: derivation
reviewed: 2026-06-06
---

# Value of Information

The **value of information (VoI)** is the decision-theoretic quantity underneath every
one-step acquisition function: the expected gain in the value of our *eventual reported
solution* from making one more evaluation. [[acquisition-functions]] sketches this frame; this
note is its rigorous owner. Its single deliverable is to show that
[[expected-improvement|expected improvement]] and the [[knowledge-gradient|knowledge gradient]]
are **the same VoI quantity under two different choices of what we are allowed to report** —
not two unrelated formulas. Symbols follow [[notation]].

## A utility on the state of knowledge

Fix a moment in the [[acquisition-functions|BayesOpt loop]]: we hold data $\mathcal D_n$ and the
GP posterior it induces ([[gaussian-process-regression]]). Suppose we were forced to **stop now**
and report a single point of $A$ as our answer to $\max_{x\in A} f(x)$. Two ingredients fix the
value of stopping:

1. a **report set** $\mathcal R(\mathcal D_n)\subseteq A$ — the points we are willing to stake a
   final claim on, and
2. a **valuation** of a candidate report — under risk-neutrality (`frazier2009kg`, §2), the
   posterior expected objective value $E_n[f(x)] = \mu_n(x)$.

A risk-neutral reporter picks the best allowed point, so the **utility of the state of
knowledge** $\mathcal D_n$ is

$$
u(\mathcal D_n) \;:=\; \max_{x\in\mathcal R(\mathcal D_n)} \mu_n(x),
$$

the value we would collect by stopping. This is the only object a one-step acquisition needs to
value the future: a sample is worth exactly how much it raises $u$.

> **Risk-neutrality is an assumption, not a law.** Valuing a random report $f(x)$ by its mean
> $\mu_n(x)$ discards the posterior variance $\sigma_n^2(x)$ at the *reported* point. A
> risk-averse reporter would penalize that variance (e.g. report
> $\operatorname*{arg\,max}_x \mu_n(x)-\kappa\,\sigma_n(x)$), giving a different utility and a
> different acquisition (`frazier2009kg`, §2; `frazier2018`, §KG). Every acquisition below
> inherits risk-neutrality from this step.

## The value of information of a sample

Grant one more evaluation, to be placed at $x$. We will observe $y\mid x,\mathcal D_n$, forming
$\mathcal D_{n+1}=\mathcal D_n\cup\{(x,y)\}$ and a new posterior, hence a new stopping utility
$u(\mathcal D_{n+1})$. The realized gain $u(\mathcal D_{n+1})-u(\mathcal D_n)$ is unknown before
we sample, so — risk-neutral again, now over the *outcome* — we take its posterior expectation.
The **value of information** of sampling $x$ is

$$
\boxed{\ \mathrm{VoI}_n(x) \;:=\; E_n\!\big[\,u(\mathcal D_n\cup\{(x,y)\}) \;-\; u(\mathcal D_n)\,\big]\ },
\qquad y\mid x,\mathcal D_n \sim \mathrm{Normal}\!\big(\mu_n(x),\,\sigma_n^2(x)\big),
$$

the expectation over the one unknown outcome $y$ under the GP posterior marginal at $x$. Since
$u(\mathcal D_n)$ is already known at time $n$ (it is $\mathcal F_n$-measurable), it pulls out of
the expectation:

$$
\mathrm{VoI}_n(x) \;=\; E_n\!\big[\,u(\mathcal D_{n+1})\,\big]\;-\;u(\mathcal D_n).
$$

This is the **expected one-step increment in solution value** — `frazier2009kg`'s "incremental
random value of the measurement," averaged. Maximizing $\mathrm{VoI}_n$ is the one-step
acquisition rule $x_{n+1}\in\operatorname*{arg\,max}_x \mathrm{VoI}_n(x)$.

Two structural facts hold for any report set. First, $\mathrm{VoI}_n(x)\ge 0$: the reporter can
always ignore the new point, so $u$ cannot decrease in expectation (a one-step instance of the
monotonicity $V^{\pi,n}\ge V^{\pi,n+1}$ in `frazier2009kg`, Prop. A.1). Second, $\mathrm{VoI}_n$
depends on $x$ only through how a sample there **reshapes the posterior mean over
$\mathcal R$** — which is exactly the lever the choice of report set pulls.

## The two canonical report sets

Everything specific about EI versus KG is the choice of $\mathcal R(\mathcal D_n)$. This is the
spine of the note.

### Evaluated-points report set $\Rightarrow$ expected improvement

Take $\mathcal R(\mathcal D_n)=\{x_1,\dots,x_n\}$ — we report only a point we have **actually
evaluated** — and assume evaluations are **noise-free**, so $\mu_n(x_i)=f(x_i)$ exactly at every
evaluated point. Then the stopping utility is the incumbent,

$$
u(\mathcal D_n)=\max_{i\le n}\mu_n(x_i)=\max_{i\le n} f(x_i)=f^*_n.
$$

After sampling at $x$, noise-free, the report set gains the point $x$ with known value $f(x)$,
while the other evaluated points are unchanged (noise-free observations do not move
$\mu_{n+1}(x_i)=f(x_i)$). Hence

$$
u(\mathcal D_{n+1})=\max\{f^*_n,\,f(x)\},\qquad
u(\mathcal D_{n+1})-u(\mathcal D_n)=\big[f(x)-f^*_n\big]^+,
$$

and the value of information is exactly expected improvement:

$$
\mathrm{VoI}_n(x)=E_n\big[\,[f(x)-f^*_n]^+\,\big]=\mathrm{EI}_n(x).
$$

The closed form $\Delta_n(x)\Phi(\Delta_n/\sigma_n)+\sigma_n\varphi(\Delta_n/\sigma_n)$ follows in
[[expected-improvement]]. The key restriction is visible here: because the report set is the
evaluated points and observations are noise-free, the only term in $u(\mathcal D_{n+1})$ that can
change is the value *at $x$ itself* — so EI sees the posterior solely through the marginal at
$x$ and credits no improvement elsewhere.

### Whole-domain report set $\Rightarrow$ knowledge gradient

Now allow the reporter to name **any** point in the domain, $\mathcal R(\mathcal D_n)=A$, even one
never evaluated (`frazier2018`, §KG; `frazier2009kg`, §3). The stopping utility becomes the
global posterior-mean maximum,

$$
u(\mathcal D_n)=\max_{x'\in A}\mu_n(x')=\mu_n^*,
$$

and the value of information is the **knowledge gradient**

$$
\mathrm{VoI}_n(x)=E_n\big[\,\mu_{n+1}^*-\mu_n^*\ \big|\ x_{n+1}=x\,\big]=\mathrm{KG}_n(x),
\qquad \mu_{n+1}^*=\max_{x'\in A}\mu_{n+1}(x').
$$

The specialization is exact. The difference from EI is *entirely* in the report set, and it has a
sharp consequence: a sample at $x$ moves $\mu_{n+1}(x')$ for **every** correlated $x'$, so
$\mu_{n+1}^*$ can be attained at a point far from $x$ — KG credits a sample for improving the
posterior mean **anywhere**, which EI structurally cannot. Unlike EI, this needs the full
posterior update at $x$, not just the marginal there, and has no general closed form (it is
simulated; see [[knowledge-gradient]]). The derivation lives in that note.

### The noisy-EI intermediate

The report set is a dial, and noisy EI sits between the two extremes. Keep EI's report set — the
**evaluated points** — but, because noise makes $f^*_n$ ill-defined, value a report by its
posterior mean rather than a noisy observation. The utility becomes

$$
u(\mathcal D_n)=\max_{i\le n}\mu_n(x_i)=\mu_n^{**}
\qquad(\text{report set }\{x_1,\dots,x_n\},\ \text{valued by }\mu_n),
$$

giving $\mathrm{VoI}_n(x)=E_n[\mu_{n+1}^{**}-\mu_n^{**}\mid x_{n+1}=x]=\mathrm{EI}^{\text{noisy}}_n(x)$
(see [[expected-improvement]]). This is the same risk-neutral one-step VoI with the **smallest**
report set valued by posterior mean. The three rules line up by report set:

| Report set $\mathcal R$ | Valuation | Stopping utility $u$ | VoI = |
|---|---|---|---|
| evaluated points (noise-free) | observed value | $f^*_n=\max_{i\le n} f(x_i)$ | $\mathrm{EI}_n$ |
| evaluated points | posterior mean | $\mu_n^{**}=\max_{i\le n}\mu_n(x_i)$ | $\mathrm{EI}^{\text{noisy}}_n$ |
| whole domain $A$ | posterior mean | $\mu_n^*=\max_{x'\in A}\mu_n(x')$ | $\mathrm{KG}_n$ |

Noise-free EI is the special case of noisy EI where the posterior mean at an evaluated point
equals its observation, so $\mu_n^{**}=f^*_n$ — the first two rows coincide.

## Myopia: one-step VoI is a truncated dynamic program

$\mathrm{VoI}_n$ as defined is **one-step**: it values a single next evaluation as if it were the
last, then reports. With $N-n$ evaluations remaining, the genuinely rational object is the
*multi-step* value of information — the gain in eventual solution value from spending the whole
remaining budget optimally. That is a finite-horizon **dynamic program** ([[bo-as-dynamic-program]]):
writing $S^n$ for the posterior state, the optimal value satisfies the Bellman recursion

$$
V^n(s)=\max_{x}\ E\big[V^{n+1}(S^{n+1})\mid S^n=s,\ x_{n+1}=x\big],
\qquad V^N(s)=u(s),
$$

with the terminal reward exactly the stopping utility $u$ (`frazier2009kg`, §2.2, eq. 9). The
one-step VoI is precisely this recursion **truncated at one stage** — the $N=n+1$ case, where the
next evaluation *is* the last and $V^{n+1}=u$:

$$
\mathrm{VoI}_n(x)=E\big[V^{n+1}(S^{n+1})\mid S^n,\,x_{n+1}=x\big]-u(S^n),
\qquad V^{n+1}=u.
$$

Hence the one-step acquisitions are **myopically optimal but not generally optimal**: each is the
Bayes rule for a horizon of one, and is the only stationary policy that is one-step optimal for
its utility (`frazier2009kg`, Remarks 1–2). They are greedy approximations to the intractable DP,
trading the unreachable multi-step optimum for a quantity computable from the current posterior
alone. When this greed harmonizes with long-run progress they perform well; when it does not, a
non-myopic ([[multistep-budgeted-bo|budgeted]]) lookahead is required (`frazier2009kg`, §1).

## Relation to other notes

- [[expected-improvement]] — VoI with the evaluated-point report set; the closed form and the
  noisy-EI utility $\mu_n^{**}$ live there.
- [[knowledge-gradient]] — VoI with the whole-domain report set $A$ (utility $\mu_n^*$); credits
  posterior-mean improvement anywhere. **Must specialize the boxed $\mathrm{VoI}_n$ identically:
  same $u(\mathcal D)=\max_{x'\in\mathcal R}\mu_n(x')$, same risk-neutral outcome expectation,
  with $\mathcal R=A$.**
- [[acquisition-functions]] — the hub; this note is the rigorous owner of its
  "value-of-information frame" section.
- [[bo-as-dynamic-program]] — the multi-step parent; one-step VoI is its one-stage truncation
  with terminal reward $u$.
