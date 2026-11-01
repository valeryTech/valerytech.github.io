---
draft: false
toc: true
title: "Graph Learning and a World Model for Code"
description: "Research directions beyond deterministic retrieval, with graph machine learning as a probabilistic overlay and a world model that simulates what-if scenarios."
linkTitle: "Graph Learning"
---

The deterministic graph in [software knowledge graph]({{< ref "projects/code-intelligence/software-knowledge-graph" >}}) answers questions about facts: who calls X, which commit changed Y. Two research directions go further. Graph machine learning adds pattern recognition over the graph, and a world model adds dynamics, so that the system can predict and run counterfactuals.

## Graph learning as a neuro-symbolic overlay


The compiler supplies the symbolic truth (structure); graph ML supplies probabilistic intuition (patterns, similarity, inference).

- **Symbolic layer (the hard graph).** The CPG, import graph and call graph are deterministic ground truth.
- **Neural layer (the soft overlay).** Graph neural networks and graph embeddings learn latent representations of nodes. They answer questions the deterministic graph cannot: "Which other service is architecturally similar to this one?", "Is this new call pattern anomalous compared with history?"

The most interesting part is graph embeddings.

### Techniques


- **Graph embeddings for structural retrieval.** Instead of embedding only a function's text (as CodeBERT does), embed its structural role with Node2Vec, GraphSAGE or GAT. Two functions with different names but the same call-graph and data-flow shape end up close together. In incident debugging, the system can search for subgraphs with the same shape as the failing transaction ("past traces where a DB write was followed by an async callback timeout"), and find incidents with the same structural cause even when the error text differs.
- **Link prediction for missing traceability.** The SDLC graph is always incomplete; someone forgets to link a ticket to a PR. Link prediction (R-GCNs, knowledge-graph embeddings such as TransE or DistMult) estimates the probability of a missing edge: "this unlinked commit modifies `PaymentService` and uses terms from Ticket-123; link probability 89%." Suggested links can fill gaps in the graph, stored as inferred edges with their score ([edge provenance]({{< ref "projects/code-intelligence/software-knowledge-graph" >}}#edge-provenance)), so the model does not have to guess them. The 89% is an illustration, not a measured result.
- **Node classification for root-cause scoring.** Train a GNN on past incident subgraphs where the root-cause node is labeled. For a new incident, it propagates error signals through the dependency graph and scores each function or service as a likely culprit, so the LLM starts from the top three nodes instead of reading fifty files.
- **Soft pruning and adaptive context.** Precomputed slices can be redundant. A GNN scorer can drop nodes that are technically in the slice but structurally irrelevant (logging utilities, standard library). It can also learn which edge types (data flow, control flow) helped with similar past tickets and filter the graph accordingly for the current query.

| | Deterministic graph | Graph ML overlay |
| --- | --- | --- |
| Role | Fact database (ground truth) | Pattern recognition (intuition) |
| Query type | "Who calls function X?" | "What usually breaks when X changes?" |
| Retrieval | Exact match, traversal | Semantic and structural similarity |
| Missing data | Fails or returns nothing | Infers likely links |

If these techniques work, the graph becomes more than a lookup table: it can suggest likely links and likely causes. Each needs data this project does not have yet: labeled incidents for root-cause scoring, enough linked history for link prediction, and a way to measure structural similarity for embeddings. They are research bets, not planned features. The cheapest first test is the embedding one: compare structural and text embeddings for "find similar functions" on one repository.

## World model and simulation engine


A knowledge graph is a static snapshot. A world model adds **transition functions**, so the system can answer "what if?" as well as "what is?".

- Static graph: `Service A` calls `Service B`.
- World model: `Service A` calls `Service B` with \(P(\text{fail}) = f(\text{load}, \text{config})\).

The graph provides the state; the modeling engine provides the dynamics. This is a move from descriptive answers ("here is the trace") to predictive and counterfactual ones ("if I retry this request, will it fail again?").

### Causal simulation


The engine is a causal inference engine, not a physics engine. Its primitive is a structural causal model: each variable is a function of its parents, for example latency \(= f(\text{CPU}, \text{network}, \text{code version})\), with the functions learned from observability data (traces, metrics).

Simulation loop:

1. **Initialize** with the current state (graph and configuration).
2. **Perturb** with a mutation ("change `TIMEOUT` from 5 s to 2 s").
3. **Propagate** the effect through the causal functions downstream.
4. **Report**: "predicted 500-error rate increases by 12%."

### Use cases


- **Counterfactual debugging.** Replay the crash state while toggling variables: original input crashes, input under 1 MB succeeds, so the failure is caused by input size. This is a causal explanation, not a correlation.
- **Impact prediction.** Clone the live graph into a sandbox, apply a config change, replay historical load profiles: "this change deadlocks `Service C` when `UserType=Premium`."
- **Architecture verification.** Scale the load variable tenfold and see which services hit the capacity limits recorded in the environmental layer ([implicit knowledge]({{< ref "projects/code-intelligence/implicit-knowledge" >}})).

### Staged build


1. **Static rules.** The engine is a rule checker with constraints taken from IaC: if an edge's timeout is shorter than the callee's processing time, predict failure.
2. **Statistical replay.** Sample real requests (for example a thousand from last week's logs), route them through the changed graph logic, and estimate the effect ("latency +10 ms").
3. **Learned causal models.** Train a GNN or Bayesian network on traces to learn the latent transition functions ("when A's CPU exceeds 80%, B's latency spikes"), which allows simulation of non-linear failure modes.

| Layer | Function | World-model equivalent |
| --- | --- | --- |
| Code graph | Structure | The map, the geometry |
| Observability | State | Weather and traffic |
| Simulation engine | Dynamics | The engine (physics and logic) |

Related open idea: a library of typical incident evolution schemes that the simulation or root-cause scorer could match against.

## References


- Cited for GNN root-cause scoring: [arXiv:2404.04496](https://arxiv.org/abs/2404.04496)
- Cited for structural subgraph retrieval and pruning: [arXiv:2405.16506](https://arxiv.org/abs/2405.16506)
- CIRCA, causal inference for root-cause analysis (KDD 2022): <https://netman.aiops.org/wp-content/uploads/2022/08/KDD22-CIRCA.pdf>
- World models: <https://worldmodels.github.io>
- A gentle introduction to graph neural networks: <https://distill.pub/2021/gnn-intro>

## Library sources


- [Hogan et al. 2021](/sources/retrieval-and-knowledge/knowledge-graphs/hogan-2021-knowledge-graphs.pdf.enc), *Knowledge Graphs* ([doi:10.1145/3447772](https://doi.org/10.1145/3447772)) -- on *Link prediction for missing traceability*
- [Negro et al. 2026](/sources/retrieval-and-knowledge/knowledge-graphs/negro-2026-knowledge-graphs-and-llms-in-action.pdf.enc), *Knowledge Graphs and LLMs in Action* -- on *Node classification for root-cause scoring*
- [OREN et al. 2018](/sources/research-methods/modeling-and-simulation/oren-2018-shift-model-based-simulation-based-paradigm.pdf.enc), *A Shift from Model-Based to Simulation-Based Paradigm* ([doi:10.15344/2456-4451/2018/126](https://doi.org/10.15344/2456-4451/2018/126)) -- on *World model and simulation engine*

Further reading:

- [Hu et al. 2025](/sources/retrieval-and-knowledge/knowledge-graphs/hu-2025-grag-graph-retrieval-augmented-generation.pdf.enc), *GRAG: Graph Retrieval-Augmented Generation*
- [Law 2015](/sources/research-methods/modeling-and-simulation/law-2015-simulation-modeling-and-analysis.pdf.enc), *Simulation Modeling and Analysis*
- [OREN et al. 2023](/sources/research-methods/modeling-and-simulation/oren-2023-body-of-knowledge-modeling-and-simulation.pdf.enc), *Body of Knowledge for Modeling and Simulation* ([doi:10.1007/978-3-031-11085-6](https://doi.org/10.1007/978-3-031-11085-6))
- [Sargent 2017](/sources/research-methods/modeling-and-simulation/sargent-2017-evolution-of-scientific-respect-for-simulation.pdf.enc), *A Perspective on Fifty-five Years of the Evolution of Scientific Respect for Simulation*
- [Smith and Sturrock 2024](/sources/research-methods/modeling-and-simulation/smith-2024-simio-and-simulation.pdf.enc), *Simio and Simulation: Modeling, Analysis, Applications*
- [Sokolowski and Banks 2009](/sources/research-methods/modeling-and-simulation/sokolowski-2009-principles-of-modeling-and-simulation.pdf.enc), *Principles of Modeling and Simulation: A Multidisciplinary Approach*
- [Zeigler et al. 2019](/sources/research-methods/modeling-and-simulation/zeigler-2019-theory-of-modeling-and-simulation.pdf.enc), *Theory of Modeling and Simulation*
