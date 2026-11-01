---
draft: false
toc: true
title: "Deriving an Optimal Architecture"
aliases:
  - "/ai/product/strategic-analysis/in-design-modeling/"
description: "A research note assembles established architecture assessment, experimental design, design-space exploration, and optimization methods into a candidate process for choosing agentic RAG architectures under uncertainty."
linkTitle: "Optimal Architecture"
---

Scope: set aside predictions and macroeconomics for now. Investigate the discovery and decision process for deriving an optimal architecture from given parameters.

Open question: which established approaches and methods, including optimization methods, apply? The design process spans several disciplines: system design, architecture, LLMs and agents, and retrieval.

<a id="ans"></a>

## Established methods and proposed combination


There are established methods for almost every part of this problem, although there isn't yet one standard methodology for "optimize an agentic RAG architecture."

The closest existing discipline is **design space exploration (DSE)** combined with **multidisciplinary design optimization (MDO)**. Aerospace, chip design, and complex industrial systems have similar problems: many interacting subsystems, categorical and continuous choices, expensive experiments, constraints, uncertainty, and several competing objectives. Modern DSE methods explicitly handle hierarchical and categorical architecture choices. ([arXiv](https://arxiv.org/abs/2504.09930 "Multi-objective Bayesian Optimization With Mixed-categorical Design Variables for Expensive-to-evaluate Aeronautical Applications"))

Proposed methodology: combine four established areas:

```text
Architecture analysis
  + design of experiments
  + multi-objective optimization
  + ML/LLM program optimization
```

### 1. First formalize the engineering problem


The standard optimization vocabulary is better than "explicit vs implicit parameters."

Let architecture `a` contain the things we control:

```text
a = (G, M, R, H, routing policy, ...)
```


where `G` is system topology, `M` is model assignments, `R` is retrieval choices, `H` is hyperparameters, and the routing policy controls routing and escalation.

Then distinguish:

- **design variables** -- model, chunk size, top-k, reranker, number of agent steps, verification strategy;
- **exogenous parameters** -- traffic, document corpus, GPU price, API price;
- **uncertain variables** -- query difficulty, retrieval quality, latency, model failure probability;
- **constraints** -- P95 latency < 8 s, privacy requirements, critical error < 0.1%;
- **objectives** -- minimize cost, maximize resolution quality, minimize latency, minimize human escalation.

For a workload sample `x` drawn from distribution `D`:

```text
Y = evaluate(a, x)
```


returns things such as:

```text
Y = (quality, cost, latency, risk, ...)
```


and the architecture problem becomes:

```text
For architecture a, minimize:
  expected cost
  negative expected quality
  P95 latency
  risk
```


subject to constraints.

That is a conventional **constrained multi-objective black-box optimization problem**.

"Black-box" is important: there is no equation that tells us the quality of `Qwen + hybrid retrieval + reranker + verifier`. We have to run it and measure it.

### 2. Architecture discovery already has ATAM/QAW/CBAM


Before optimizing anything, software architecture has established methods for identifying what needs to be optimized.

CMU SEI's Quality Attribute Workshop is designed to identify important quality attributes before an architecture exists. ATAM then evaluates candidate architectures against quality goals and identifies sensitivity points, risks, and tradeoffs. ([Software Engineering Institute](https://www.sei.cmu.edu/library/quality-attribute-workshop-collection/ "Quality Attribute Workshop Collection | CMU Software ..."))

This maps surprisingly well to our problem.

For example, instead of saying:

> Quality must be high.

ATAM-style quality scenarios force something like:

> For a billing question from an authenticated customer, under normal load, the system must return a grounded answer within 5 seconds in 99% of cases, with less than 0.2% unsupported claims.

That's much more useful to an optimizer.

CBAM adds economics: architectural decisions are evaluated in terms of cost, benefit, schedule, risk, and uncertainty. ([Software Engineering Institute](https://www.sei.cmu.edu/library/integrating-the-architecture-tradeoff-analysis-method-atam-with-the-cost-benefit-analysis-method-cbam/ "Integrating the Architecture Tradeoff Analysis Method (ATAM ..."))

Suggested methods for the framing work:

```text
QAW -> ATAM -> CBAM
```


for the **discovery and framing** part.

### 3. Then use Design of Experiments before optimization


This part is easy to overlook.

Suppose we have:

- 8 models;
- 4 embedding models;
- 5 retrieval strategies;
- 6 top-k choices;
- 4 rerankers;
- 5 prompts;
- 4 agent strategies;
- 3 verification strategies.

A naive Cartesian search is already:

```text
8 * 4 * 5 * 6 * 4 * 5 * 4 * 3 = 230,400
```


architectures.

Testing every combination is impractical.

**Design of Experiments (DOE)** exists specifically to determine which factors and interactions influence a system while minimizing the number of experiments. Fractional factorial designs are useful for screening; response-surface methods then characterize promising regions. NIST describes DOE as supporting screening, modeling, and optimization while reducing experimental cost. ([NIST](https://itl.nist.gov/div898/handbook/pmd/section3/pmd31.htm "4.3.1. What is design of experiments (DOE)?"))

This would let us discover things like:

```text
effect(model) = large
effect(top-k) = small
interaction effect(model, reranker) = large
```


The interaction term is important. An excellent reranker might dramatically improve a 27B model and barely affect a frontier model.

So component quality cannot simply be added together.

### 4. Then perform Design Space Exploration


Now we have a reduced but still large design space.

This is where several optimization algorithms become relevant.

|Situation|Good method|
|---|---|
|<10k cheap configurations|exhaustive/grid search|
|Few continuous parameters|response-surface optimization|
|Expensive noisy evaluations|Bayesian optimization|
|Mixed categorical + continuous choices|mixed-variable Bayesian optimization|
|Huge irregular/discrete space|evolutionary optimization|
|Multiple competing goals|Pareto / multi-objective optimization|
|Cheap approximate + costly full eval|multi-fidelity optimization|

For our case, **multi-objective Bayesian optimization (MOBO)** is especially attractive.

Why? Evaluating one architecture might require running 5,000 support conversations. That's expensive. Bayesian optimization builds a surrogate model:

```text
estimated_performance(a) ~= actual_performance(a)
```


and chooses the next architecture that is most informative or promising, rather than blindly testing thousands of combinations. Multi-objective versions search directly for the Pareto frontier. This approach is already used for expensive mixed-variable engineering design problems. ([arXiv](https://arxiv.org/abs/2201.12767 "Bayesian Optimization For Multi-Objective Mixed-Variable Problems"))

### 5. Evolutionary methods are useful when architecture topology changes


Bayesian optimization works especially well when our architecture representation is reasonably structured.

If we're exploring radically different topologies:

```text
RAG → LLM

RAG → LLM → verifier

router → {small model, large model}

planner → retrieval → tools → critic → planner

parallel retrieval → fusion → model
```


the search space becomes much less smooth.

Evolutionary multi-objective algorithms such as **NSGA-II** are a classic solution. They maintain populations of designs and evolve them while preserving different Pareto-optimal tradeoffs. ([CSE UNR](https://www.cse.unr.edu/~sushil/class/gas/papers/nsga2.pdf "182

IEEE TRANSACTIONS ON EVOLUTIONARY COMPUTATION,"))

Hypothesis: the eventual optimizer should be hybrid:

```text
structural search -> configuration optimization
```


For example:

```text
architecture template --evolution/search--> topology G
```


then:

```text
(model, k, prompt, thresholds, ...) --Bayesian optimization--> best configuration
```


We probably shouldn't begin by letting an optimizer invent arbitrary graphs. A constrained architecture grammar will make the search much more tractable.

### 6. Multi-fidelity optimization is particularly relevant to LLM systems


A full production-quality evaluation is expensive.

But we can have several levels:

```text
cheap evaluation -> medium evaluation -> full evaluation
```


For example:

- 100 representative tickets;
- 1,000-ticket eval;
- 20,000-ticket eval;
- production shadow traffic.

Or:

- cheap LLM judge;
- expensive multi-model judging;
- human evaluation.

This is called **multi-fidelity optimization**. Engineering optimization uses cheaper approximations to eliminate weak designs before spending resources evaluating the survivors at high fidelity. ([arXiv](https://arxiv.org/abs/2311.13050 "Multi-fidelity Bayesian Optimization in Engineering Design"))

This seems almost essential for us.

### 7. Then there are LLM-specific inner optimizers


This is a different level of optimization.

DSPy treats an LLM application as a program composed of modules and optimizes prompts/examples against a specified metric. MIPROv2 uses Bayesian optimization to jointly optimize instructions and demonstrations. ([arXiv](https://arxiv.org/abs/2310.03714 "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines"))

So suppose our outer optimizer decides:

```text
Retriever: hybrid
Reranker: bge
Generator: Qwen-27B
Verifier: GPT-x-mini
```


DSPy could optimize the **internal LLM program** for that architecture.

This gives us nested optimization:

```text
architecture optimizer [component optimizers]
```


That's an important distinction.

### 8. Routing is yet another optimization problem


If architecture includes dynamic routing:

```text
request -> local model
        -> cheap API
        -> frontier API
        -> human
```


then we're entering ideas from cascades, classifiers, contextual decision-making and eventually contextual bandits.

FrugalGPT formalized model cascades to trade cost against accuracy. RouteLLM learns a router that chooses between stronger and weaker models based on the request. ([arXiv](https://arxiv.org/abs/2305.05176 "FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance"))

So `routing policy` should itself be a component:

```text
routing_decision(request, policy_parameters)
```


whose parameters can be optimized.

### 9. Finally, uncertainty needs to be part of the optimization


Suppose two architectures look like:

```text
A: 98.3% +/- 0.2%
B: 98.4% +/- 1.8%
```


A may be preferable despite its slightly lower mean.

This leads to **robust optimization** rather than optimizing mean performance alone.

We can optimize quantities such as:

```text
expected quality
probability(quality < minimum quality)
P95 latency
```


or tail-risk measures such as CVaR.

Robust multi-objective Bayesian optimization explicitly addresses uncertainty in engineering design. ([arXiv](https://arxiv.org/abs/2202.12848 "A Robust Multi-Objective Bayesian Optimization Framework Considering Input Uncertainty"))

Sensitivity analysis is also useful:

```text
change in outcome / change in parameter
```


or global methods such as Sobol indices can tell us which uncertain inputs actually drive system behavior. ([arXiv](https://arxiv.org/abs/1710.08072 "Global Sensitivity Analysis via Multi-Fidelity Polynomial Chaos Expansion"))

<a id="what-i-think-our-process-should-look-like"></a>

### Proposed process


Proposed pipeline combining the established methods:

```text
Requirements / workload
        ↓
Quality-attribute scenarios
        ↓
Architecture grammar + candidate components
        ↓
DOE / screening
        ↓
Empirical component + end-to-end evaluation
        ↓
Design-space exploration
        ↓
Multi-objective Bayesian / evolutionary optimization
        ↓
Pareto frontier
        ↓
Robustness + sensitivity analysis
        ↓
Architecture decision
```


And inside an architecture:

```text
Outer optimization
  architecture / topology
        ↓
Middle optimization
  model assignment / retrieval / routing
        ↓
Inner optimization
  prompts / k / thresholds / agent parameters
```


The key conceptual point is that **architecture design, evaluation and optimization are separate problems**. ATAM/CBAM help us formulate and reason about the architecture. DOE helps us learn which variables matter. DSE/MDO provides the overall search model. Bayesian/evolutionary optimization finds good configurations. DSPy and routing methods optimize particular LLM subsystems. ([Software Engineering Institute](https://www.sei.cmu.edu/library/integrating-the-architecture-tradeoff-analysis-method-atam-with-the-cost-benefit-analysis-method-cbam/ "Integrating the Architecture Tradeoff Analysis Method (ATAM ..."))

Working judgment: this provides a stronger foundation than inventing an "LLM architecture optimizer" from scratch. Open next problem: define the **formal design-space representation**: what exactly is a component, parameter, constraint, metric, workload class, architecture graph and conditional dependency. Once that ontology/schema is right, the optimization methods become comparatively straightforward.

## Library sources


- [Kleijnen 2015](/sources/research-methods/modeling-and-simulation/kleijnen-2015-design-and-analysis-of-simulation-experiments.pdf.enc), *Design and Analysis of Simulation Experiments* -- on *3. Then use Design of Experiments before optimization*
- [Kleijnen 2017](/sources/research-methods/modeling-and-simulation/kleijnen-2017-design-analysis-simulation-experiments-tutorial.pdf.enc), *Design and Analysis of Simulation Experiments: Tutorial* -- on *9. Finally, uncertainty needs to be part of the optimization*
- Montgomery 2017, *Design and Analysis of Experiments* -- on *3. Then use Design of Experiments before optimization*
- [Kazman et al. 2000](/sources/software-engineering/architecture/kazman-2000-atam-method-architecture-evaluation.pdf.enc), *ATAM: Method for Architecture Evaluation* -- on *2. Architecture discovery already has ATAM/QAW/CBAM*

Further reading:

- [Bass et al. 2021](/sources/software-engineering/architecture/bass-2021-software-architecture-in-practice.pdf.enc), *Software Architecture in Practice, 4th Edition*
- [Knodel and Naab 2016](/sources/software-engineering/architecture/knodel-2016-pragmatic-evaluation-of-software-architectures.pdf.enc), *Pragmatic Evaluation of Software Architectures*
- [Sobhy et al. 2021](/sources/software-engineering/architecture/sobhy-2021-evaluation-software-architectures-under-uncertainty.pdf.enc), *Evaluation of Software Architectures under Uncertainty* ([doi:10.1145/3464305](https://doi.org/10.1145/3464305))
- [Falessi et al. 2011](/sources/software-engineering/architecture-decisions/falessi-2011-decision-making-techniques-software-architecture.pdf.enc), *Decision-making techniques for software architecture design* ([doi:10.1145/1978802.1978812](https://doi.org/10.1145/1978802.1978812))
