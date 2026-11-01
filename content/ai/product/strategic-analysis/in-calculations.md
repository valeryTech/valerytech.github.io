---
draft: false
toc: true
title: "Frontier-Model Economics and Architecture"
description: "A working architecture-decision model moves from support-agent economics to workload-conditioned evaluation, comparing structures, components, and adaptive routing policies through constrained multi-objective search and Pareto trade-offs."
linkTitle: "Model Economics"
---

<a id="question-about-frontier-models"></a>

## Open question about frontier-model economics


Initial question: how should frontier-model economics shape architecture decisions for a specific use case? The starting assumption was that an API for a 15T-parameter model would be expensive; the caveat below challenges using parameter count directly. Personal use case: I want to build an agentic support system with RAG. Several candidate solutions may have different component-level quality requirements. How can parameter sets, inputs, explicit parameters, and implicit parameters support optimization and the selection of several effective solutions?

## calculation model


Proposed formalization: a multi-objective architecture optimizer. The thing being optimized is an entire solution to a use case, with models as replaceable components.

Correction to the initial assumption: do not use "15T parameters" directly in the economic model without knowing active parameters and inference architecture. For API economics, what we observe and care about is price, token consumption, latency, cache behavior, reasoning expansion, and task quality. A huge mixture-of-experts model can have a very large total parameter count while activating only part of it per token.

For example, OpenAI currently lists GPT-5.6 Sol at \(5/M input and \)30/M output for standard short-context use. ([OpenAI Platform](https://platform.openai.com/pricing?model=contentfilter-alpha-001 "Pricing | OpenAI API")) For an agent this cost can compound because a single user request can cause many model calls, repeated context reads, tool calls, reasoning and verification. Google explicitly says its managed-agent billing includes intermediate reasoning/input generated during agent loops. ([Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing "Gemini Developer API pricing  |  Gemini API  |  Google AI for Developers"))

### 1. Define the problem separately from the architecture


For the support-agent example, the problem specification might be:

|Parameter|Example|
|---|---|
|Tickets/month|1M|
|Languages|EN/ES/etc.|
|Knowledge corpus|500k documents|
|Simple informational questions|55%|
|Complex informational|20%|
|Account actions|15%|
|Unusual/ambiguous|10%|
|Required correct-answer rate|≥ 97%|
|Critical-action error rate|< 0.05%|
|P95 latency|< 8 sec|
|Human support cost|$8/ticket|
|AI budget|< $0.15/ticket|
|Private data|yes|
|Vendor dependency tolerance|medium|

This specification does not say anything about OpenAI, Qwen, RAG implementation, or model size.

That separation is important because the optimizer should discover the architecture.

### 2. Decompose the solution into components


An agentic RAG support system could be represented as:

```text
request
  -> router
  -> query generation
  -> retrieval
  -> reranking
  -> reasoning/answer
  -> tool execution
  -> verification
  -> response or human
```


Now every component has candidates.

For example:

|Component|Candidate choices|
|---|---|
|Router|rules / 3B local / 27B local / cheap API|
|Query generation|8B / 27B / API|
|Embeddings|local / hosted|
|Retrieval|BM25 / vector / hybrid|
|Reranker|none / small local / large|
|Answer|27B local / cheap API / frontier|
|Tool planner|27B local / mid API / frontier|
|Verifier|rules / independent LLM / frontier|
|Fallback|bigger model / human|

So the decision vector becomes something like:

```text
x = (
  model_router,
  model_query,
  embeddings,
  retrieval,
  model_reranker,
  model_answer,
  model_tools,
  model_verifier,
  k,
  context,
  reasoning,
  steps,
  thresholds,
  fallback
)
```


There might easily be millions of combinations.

### 3. Parameters need four different types


Proposed extension of the initial explicit/implicit distinction:

|Type|Meaning|Example|
|---|---|---|
|Explicit|requirement supplied by us|P95 < 8 sec|
|Measured|obtained from experiments|Qwen success = 94%|
|Inferred|estimated from data|ticket difficulty distribution|
|Scenario|assumption about the future|frontier prices −50%/year|

Every parameter should ideally carry metadata:

```text
parameter = (value or distribution, source, confidence, scope, time)
```


For example:

```text
Q(Qwen27B, tool use, difficult) ~ Beta(...)
```


rather than:

```text
Q = 0.81
```


because benchmark/eval measurements have uncertainty.

That will become important when two architectures differ by only 1-2%.

### 4. Quality must be conditional


This is probably the most important part.

Don't store:

```text
Q(Qwen27B) = 0.82
```


Store something closer to:

```text
Q(model, component, request characteristics)
```


where:

- `m` = model;
- `c` = component/task;
- `z` = characteristics of this particular request.

For example:

```text
P(success | Qwen27B, tool planning, easy) = 0.99
```


while:

```text
P(success | Qwen27B, tool planning, hard) = 0.72
```


This makes routing possible.

### 5. Then introduce a latent difficulty variable


For every incoming ticket:

```text
D(z) is between 0 and 1
```


We don't directly know its true difficulty, but we can estimate it from things such as retrieval confidence, ambiguity, number of required tools, customer state, unusual language, previous failed attempts, and confidence from the smaller model.

Then the policy becomes conditional.

For example:

```text
D < 0.3 -> Local27B
```

```text
0.3 <= D < 0.7 -> CheapAPI
```

```text
D >= 0.7 -> Frontier
```


This is where frontier models become economically interesting.

Question to avoid:

> Should we use Sol or Qwen?

Question to use:

> For which 3% of requests does Sol produce enough additional expected value to justify its additional cost?

### 6. Put a dollar value on quality


Suppose model (A) costs $0.005 for a task and succeeds 94%.

Frontier model (B) costs $0.15 and succeeds 99%.

The relevant decision isn't simply 94% versus 99%.

Define failure loss:

```text
L_i = loss caused by failure on task i
```


Then compare:

```text
EC_A = C_A + (1 - Q_A) * L_i
```

```text
EC_B = C_B + (1 - Q_B) * L_i
```


For an FAQ question where a failure costs $0.50:

```text
EC_A = 0.005 + 0.06 * 0.50 = 0.035
```

```text
EC_B = 0.15 + 0.01 * 0.50 = 0.155
```


Use local.

For an automated \(1,000 account operation, failure loss might be \)100:

```text
EC_A = 0.005 + 0.06 * 100 = 6.005
```

```text
EC_B = 0.15 + 0.01 * 100 = 1.15
```


Now frontier inference is cheap.

This creates a clean rule:

```text
quality improvement * failure loss > additional cost

Delta Q * L > Delta C
```


Escalate to a better model when the economic value of its additional quality exceeds its incremental cost.

### 7. Agent cost should be modeled per resolved task


Tokens alone become misleading with agents.

For architecture (a):

```text
C_architecture =
    C_router
  + C_retrieval
  + C_reranker
  + sum(C_model_step for each agent step)
  + C_tools
  + C_verification
  + C_retry
  + C_human
```


Then calculate:

```text
C_resolved = expected architecture cost / P(correct resolution)
```


This gives surprising results.

A cheap model that needs:

```text
8 model calls + 1.4 retries
```


can cost more per successful ticket than an expensive model that solves it in:

```text
2 calls
```


This is exactly where frontier-model economics need to be evaluated experimentally.

### 8. Local models get their own economics


For local inference:

```text
C_local =
  (hardware amortization + electricity + operations + idle capacity)
  / successful tasks
```


The denominator should be successful tasks rather than tokens.

Then hardware utilization becomes an important implicit parameter:

```text
U_GPU = GPU utilization
```


At 10% utilization, local may be expensive.

At 80%, the same infrastructure may be extremely attractive.

And privacy might give local an additional economic benefit:

```text
C_privacy < 0
```


in the sense that avoiding external processing has positive value.

### 9. Optimize the architecture as a Pareto problem


We shouldn't produce a single "best architecture."

For each architecture (a), calculate:

```text
F(architecture) = (
  cost,
  quality,
  critical risk,
  P95 latency,
  human escalation,
  vendor dependency
)
```


Then eliminate dominated solutions.

If architecture A is:

```text
$0.08, 98.2%, 5s
```


and B is:

```text
$0.11, 97.8%, 7s
```


B is useless because A beats it everywhere.

Eventually we'd get something like:

|Architecture|Cost/ticket|Resolution|P95|Local share|Frontier share|
|---|--:|--:|--:|--:|--:|
|Local-heavy|$0.018|96.8%|4s|92%|1%|
|Cost optimal|$0.041|98.1%|5s|73%|5%|
|Quality optimal|$0.094|99.0%|7s|38%|21%|
|Maximum quality|$0.31|99.4%|11s|5%|82%|

All four could be valid Pareto solutions.

Management can then choose where on the curve the product should operate.

### 10. Routing itself is another thing to optimize


A potentially useful extension of the model is to optimize routing.

Instead of architecture:

```text
Qwen -> Sol
```


we optimize a policy:

```text
policy(request characteristics)
  -> (model, reasoning, retrieval, tools, verification)
```


For an easy ticket:

```text
Qwen27B + 5 retrieved chunks + no verifier
```


For a medium ticket:

```text
Qwen27B + reranker + verification
```


For a hard ticket:

```text
Sol + larger retrieval + tool calls + verification
```


For a high-risk ticket:

```text
Sol + deterministic validation + human approval
```


So we are optimizing both the architecture and the runtime policy.

### 11. This also gives us the OpenAI-collapse scenario almost for free


Provider availability becomes another scenario parameter:

```text
availability(model, time, scenario) is either 0 or 1
```


For normal 2026:

```text
availability(OpenAI) = 1
```


For an OpenAI outage/restructuring scenario:

```text
availability(OpenAI) = 0
```


The optimizer simply reruns.

Then calculate **migration cost**:

```text
migration cost(architecture, scenario) =
  cost(new optimum) / cost(current optimum)
```


plus the quality loss:

```text
quality loss = Delta Q(architecture, scenario)
```


Maybe today's optimal architecture is:

```text
$0.041/ticket, 98.1%
```


After OpenAI disappears:

```text
$0.046/ticket, 97.9%
```


That means OpenAI corporate failure barely affects this product.

Another architecture could fall:

```text
99.1% -> 91%
```


because it depends heavily on frontier reasoning.

That distinction is far more useful for our broader scenario analysis.

<a id="the-model-id-build"></a>

### Proposed model


Conceptually it becomes:

```text
problem
  + workload distribution
  + component graph
  + candidate configurations
  + empirical quality surfaces
  + economic parameters
  + scenario parameters
  -> Pareto architectures
```


And then:

```text
Pareto architecture + routing policy -> expected production economics
```


The deepest change from our earlier model is that **"frontier vs local" should not be one global choice**. Every component and every individual request can sit at a different point on the quality/cost curve.

Hypothesis for the support-agent case: the optimizer may discover a structure roughly like **local models for most routing, RAG, summarization and routine generation; stronger models for difficult tool planning; deterministic code for invariants; frontier models for a small difficult/risky tail; humans for the extreme tail**. Whether Qwen3.8-27B takes 40%, 80%, or 95% of the workload is then an empirical result from our eval set.

The next implementation step is quite concrete: define the parameter/schema objects, create 20-30 representative support-task classes, define candidate components, and write a simulator that enumerates/configures architectures and produces the Pareto frontier. That would give us the base engine we can later reuse for coding agents, research agents, sales, document processing, etc.

## Foundations


Proposed foundation: five ideas that define a design model before choosing schemas, optimizers, or implementation details.

### 1. Start from the workload, not from models


The thing being designed is a system for a distribution of tasks.

For a support agent, the workload might contain:

- simple factual questions;
- questions requiring retrieval;
- ambiguous requests;
- actions against backend systems;
- multi-step investigations;
- high-risk cases;
- cases that should go to a human.

So the starting point is:

```text
Workload = {task classes, frequencies, difficulty, risk}
```


The architecture is good only relative to that workload.

A model benchmark by itself tells us very little.

### 2. Describe success as multiple quality attributes


There is no single "quality" number.

For the system we may care about:

```text
Outcome = {
  correctness,
  groundedness,
  task completion,
  cost,
  latency,
  risk,
  privacy,
  operability
}
```


Different tasks put different weights on them.

For example:

- FAQ -> cost and latency may dominate.
- Refund -> correctness and policy compliance dominate.
- Account deletion -> risk dominates.
- Complex troubleshooting -> reasoning quality dominates.

This is why architecture optimization is naturally multi-objective.

### 3. Think in terms of architecture decisions


The architecture is a set of decisions about **how work gets done**.

At a high level:

```text
user request
     ↓
understand / classify
     ↓
retrieve knowledge
     ↓
reason / plan
     ↓
use tools
     ↓
verify
     ↓
answer / act / escalate
```


For each responsibility there are architectural alternatives:

```text
retrieve
  ├─ vector
  ├─ keyword
  └─ hybrid

reason
  ├─ local model
  ├─ cheap API
  └─ frontier model

verify
  ├─ deterministic rules
  ├─ second model
  └─ human

control
  ├─ fixed pipeline
  ├─ router
  └─ iterative agent
```


The important point is:

```text
Architecture = composition of decisions
```


The model choice is just one decision among many.

### 4. Separate architecture from evidence


For every candidate architecture we need evidence about how it behaves.

Some evidence comes from:

- benchmarks;
- vendor claims;
- small experiments;
- offline evals;
- production traces;
- human evaluation;
- load testing.

That gives us:

```text
Architecture + workload -> observed outcomes
```


This is central.

Unsupported design inference:

> Qwen is good at coding, therefore use Qwen.

Evidence-based design inference:

> On this workload, architecture A produced these outcomes with this uncertainty.

The architecture process therefore has two alternating activities:

```text
design candidate
      ↓
evaluate
      ↓
learn
      ↓
change candidate
      ↓
evaluate again
```


This is essentially experimental engineering.

### 5. Search for a frontier, not a winner


Usually there is no universally optimal architecture.

Possible findings:

```text
A
very cheap
good quality

B
moderate cost
higher quality

C
expensive
highest reliability
```


If none of them dominates the others, all three are valid designs.

Conceptually:

```text
quality
  ↑
  |                 C
  |            B
  |       A
  |
  +----------------------→ cost
```


These are the Pareto-efficient architectures.

The engineering decision is then:

> Which point on this frontier matches our product requirements?

That is different from asking an optimizer to produce one answer.

## The overall design process


Proposed core model:

```text
                    PRODUCT / BUSINESS CONTEXT
                              ↓
                         WORKLOAD
                tasks • frequency • risk
                              ↓
                    QUALITY ATTRIBUTES
             quality • cost • latency • safety
                              ↓
                   ARCHITECTURE SPACE
              patterns • components • models
                              ↓
                        CANDIDATES
                              ↓
                   EXPERIMENT / EVALUATE
                              ↓
                    MEASURED BEHAVIOR
                              ↓
                SEARCH / COMPARE / REFINE
                              ↓
                     PARETO FRONTIER
                              ↓
                   ARCHITECTURE DECISION
```


And this process loops.

A production trace might reveal that 70% of requests are trivial, which changes the workload model, which can change the optimal architecture.

## Three levels of design


One additional distinction is useful.

There are really three nested problems.

### System architecture


Questions such as:

> Do we need an agent at all?

> RAG or large context?

> Single agent or workflow?

> Where are deterministic services preferable?

> Where do humans enter?

This is the highest-impact level.

### Component selection


Once the structure exists:

> Which retriever?

> Which reranker?

> Which model?

> Which embedding model?

> Which verifier?

### Configuration


Then:

> top-k = 5 or 20?

> context size?

> reasoning budget?

> escalation threshold?

> number of retries?

Optimization should happen in that order conceptually:

```text
System design -> component selection -> configuration
```


Otherwise it's easy to spend enormous effort optimizing `top_k=12` inside an architecture that shouldn't exist.

## Static architecture vs adaptive architecture


For AI systems this distinction becomes especially important.

A traditional architecture often looks like:

```text
request → fixed pipeline → response
```


An AI architecture can make runtime decisions:

```text
                ┌→ local model
request → router├→ larger model
                ├→ frontier model
                └→ human
```


Therefore architecture consists of both:

```text
Architecture = structure + decision policy
```


The policy decides how much computation and quality a particular request deserves.

That may eventually become one of the most important parts of the design.

## The central conceptual object


Proposed central formulation:

```text
Find architectures that best transform a workload into desired outcomes under constraints.
```


Where:

- **workload** tells us what the real system has to handle;
- **architecture** tells us how it handles it;
- **evaluation** tells us what actually happens;
- **optimization** helps us explore alternatives;
- **Pareto analysis** exposes the meaningful choices;
- **engineering judgment** makes the final decision.

Proposal: use this as the foundation of the methodology. The optimization algorithms should support this model rather than define it.

## Library sources


- [Jansen and Bosch 2005](/sources/software-engineering/architecture-decisions/jansen-2005-software-architecture-as-set-of-design-decisions.pdf.enc), *Software Architecture as a Set of Architectural Design Decisions* -- on *3. Think in terms of architecture decisions*
