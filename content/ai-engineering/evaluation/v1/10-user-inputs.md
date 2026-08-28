---
draft: false
toc: true
title: "10 User Inputs"
linkTitle: "10 User Inputs"
---
# Building a Starting Set of User Inputs for AI Evaluation


This guide addresses building a representative set of **user inputs**. These inputs form one component of the evaluation dataset and define the portion of the query space that should cover the important ways users may interact with the application.

The goal is to provide evidence about the product behaviours that matter without over-representing one common workflow or leaving important guarantees, failures, and operating conditions untested.

At this stage, the primary objective is **product-derived query-space representation**.

A starting set of approximately 100 executed cases is a practical heuristic. It can provide enough coverage to surface a range of failure modes and move towards _theoretical saturation_--the point at which analyzing additional traces is increasingly unlikely to reveal substantially new error categories because the existing categories are already well developed (Morse 1995). The required product coverage should determine the final number and distribution of cases.

When suitable real user inputs are available, they should be the primary source. They can form the candidate pool for the initial set, subject to coverage review. If substantially more are available, sample across their variation. Real inputs provide evidence about actual usage, but their frequency does not define the evaluation scope by itself. The resulting traces should exercise product-important behaviours rather than repeatedly follow the most common feature path.

In early-stage applications, real user inputs and traces are often sparse. Synthetic inputs may then be used to fill important gaps, but they should be generated systematically. Simply asking an LLM to produce a list of user queries commonly results in generic, repetitive examples that do not reflect realistic usage patterns.

We therefore need a structured process for building a representative set of user inputs. The process should produce evaluation cases that are diverse, realistic, grounded in the system, and allocated according to product importance and risk.

## Steps


**Agree on the product definition.** Begin by recording or agreeing on the product-specific inputs that govern coverage:

- **Product guarantees:** behaviours or properties the application is expected to preserve.
- **Main jobs to be done:** outcomes users principally rely on the product to achieve.
- **Critical failures:** consequential outcomes that the evaluation should guard against.
- **Architecture and operating constraints:** routes, models, prompts, policies, tools, data sources, permissions, action boundaries, and environmental limits that can change system behaviour.

Use product requirements, system documentation, architecture knowledge, policy and safety requirements, domain expertise, and observed product behaviour as evidence. Available user inputs can reveal missing or misunderstood product behaviour, but they should not be the sole source of the product definition.

Optionally extract or formulate coverage requirements:

- a main job or core intent that needs baseline coverage;
- a guarantee that must be exercised across several contexts;
- a critical failure that warrants deliberate additional coverage;
- a route, tool, permission state, or system condition that must be tested;
- an important interaction between several dimension values;
- a known difficult or regression case that must be preserved.

**Select dimensions**

A **dimension** is a way to categorize different parts of a user query. Each dimension represents one axis of variation. For example, for an e-commerce support agent, useful dimensions might include:

- **Feature:** what task the customer wants to complete, such as tracking an order, requesting a return, cancelling an order, or resolving a payment issue;
- **Customer persona:** the type of customer being supported, such as a first-time buyer, frequent shopper, or business customer;
- **Scenario type:** how clearly the customer expresses the issue, such as well-specified, ambiguous, incomplete, or involving multiple requests.

An application may have many potentially useful dimensions. As a practical starting point, begin with at least three candidate dimensions, while avoiding unnecessary dimensions that do not represent a distinct failure surface or meaningful behavioural difference. The final set should be small enough to review and combine effectively, but sufficient to represent the important ways the application may fail.

Do not choose dimensions arbitrarily. Select dimensions that describe where the AI application is likely to fail. Use the product-derived coverage requirements, failure hypotheses, observed user behaviour, qualitative research, domain knowledge, and previously observed traces to identify these failure surfaces.

For example, usage data or qualitative research might indicate that business customers experience problems when tracking orders. In that case, **Customer persona** and **Feature** are useful dimensions because their interaction represents an observed or plausible area of failure.

When direct evidence about likely failures is limited, begin with distinctions implied by the product's main jobs, guarantees, critical failures, routes, tools, permissions, and operating conditions. Treat these initial dimensions as provisional and revise them as real inputs and executed traces provide better evidence.

> Rule: A candidate dimension must describe something identifiable from the user's input itself.

You could use prompt from [Prompts 03 Dimensions Set]({{< ref "ai-engineering/evaluation/v1/prompts-03-dimensions-set" >}})

### 2. Construct and review tuples


Once we've defined our dimensions, we create structured combinations of them.

Tuples provide a structured description of the intended interaction before a specific user input or executable evaluation case is created. They are a representation mechanism, not an independent source of coverage obligations. Manual construction and LLM-assisted expansion help explore the query space, while human review determines which tuples are approved.

Here are two example queries sketched from different tuples:

- **Tuple:** (Feature: 'Order Issues', Persona: 'First-Time Customer', Scenario: 'Specific Query'). Query: _My order was marked as delivered yesterday, but I haven't received it. Can you check order #48291 and tell me what to do next?_
- **Tuple:** (Feature: 'Returns', Persona: 'Frequent Shopper', Scenario: 'Vague Query'). Query: _I need help returning a few items from my latest order._

#### 2.1 Create initial tuples manually


The following tuple represents a search request from a new customer in which several valid results exist:

```text
Intent: Search
User type: New customer
Scenario: Several valid results
```


The following tuple represents an ambiguous scheduling request when the requested time is unavailable:

```text
Intent: Scheduling
Input quality: Ambiguous
System state: Requested time unavailable
```


Do not try to generate every possible tuple. Select tuples that cover:

- baseline conditions for the main jobs;
- contexts in which product guarantees could hold or fail;
- critical failures and their associated failure hypotheses;
- important routes, tools, permissions, and system conditions;
- unusual but plausible interactions that require different system behaviour.

Write approximately 20 initial tuples manually. Allocate them according to the importance, risk, behavioural variation, and uncertainty represented by the coverage requirements rather than distributing them equally across dimension values. This helps validate whether the selected dimensions produce coherent and useful tuples before asking an LLM to create more.

#### 2.2 Expand tuple coverage with an LLM


Once the initial tuples have been reviewed, use an LLM to expand coverage across the selected dimensions.

Give the model:

- the relevant coverage requirements;
- the dimensions;
- the possible values;
- examples of good tuples;
- a request to avoid duplicates;
- a request to vary values across the dimensions;
- a requirement to identify which coverage requirement each tuple supports.

Generate tuples first, without generating user inputs. Keeping tuple generation separate from input generation makes coverage easier to inspect and reduces superficial variation.

**Tuple-generation prompt** is in [Prompts 04 Tuples]({{< ref "ai-engineering/evaluation/v1/prompts-04-tuples" >}})

### 3. Source inputs and construct evaluation cases


Real and synthetic inputs follow separate paths and converge when evaluation cases are assembled.

```text
Real input
    → Classification using dimensions
    → Observed tuple
    → Coverage-aware sampling ─────────────────────┐
                                                   ├→ Evaluation cases
Unsatisfied coverage requirement                   │
    → Target tuple                                 │
    → Synthetic user input ────────────────────────┘
```


Suitable real inputs are the preferred source because they preserve naturally occurring goals, assumptions, phrasing, and omissions. Synthetic inputs supplement them by filling gaps in the product-derived coverage requirements, targeting provisional failure hypotheses, and representing important conditions that have not yet appeared in available data. The two sources serve different purposes and should not be treated as interchangeable.

#### 3.1 Source and sample real inputs


Begin with the existing input pool when suitable real inputs are available. Real inputs should be:

- classified retrospectively using the core intents and dimensions;
- grouped or clustered when useful;
- sampled across meaningful variation;
- compared with the product-derived coverage requirements.

The resulting observed tuple describes the part of the query space represented by that input. Reviewers can then determine which coverage point it occupies.

```text
Real input
    → Classification using dimensions
    → Observed tuple
```

#### 3.2 Generate realistic user inputs from approved tuples


After the combinations have been reviewed and approved, generate the actual message a user might send for each one.

You could use LLM for it cause they especially good at it. An LLM prompt should explain:

- what the system does;
- the approved tuple;
- any relevant system context;
- which aspects should remain ambiguous, incomplete, difficult, or unusual.

> Generate user inputs rather than ideal assistant outputs. The purpose is to **create realistic requests for the system to handle**, not to define the response in advance.

Vary the language naturally. Real users may:

- omit details;
- use shorthand;
- refer to earlier context;
- make spelling mistakes;
- combine several requests;
- change direction;
- use domain-specific language;
- describe a goal rather than a precise action.

Variation should come from realistic behaviour rather than mechanically paraphrasing the same input.

**User-input generation prompt**

```text
We are generating an evaluation input for [application].

The application helps users to:
[brief capability description]

Approved tuple:
- Intent: [value]
- User type: [value]
- Scenario: [value]
- Input quality: [value]
- System state: [value]
- Complexity: [value]

Relevant system context:
[fixture or environment information]

Write 10 realistic messages that this user might submit.

Requirements:
- Write only the user message.
- Do not explain the approved tuple.
- Do not describe the expected assistant response.
- Preserve the intended ambiguity, missing information, or difficulty.
- Use language appropriate for the stated user type.
- Avoid test-case terminology.
```


The prompt may omit dimensions that are not relevant to the tuple.

#### 3.4 Assemble evaluation cases


Real and synthetic paths converge during evaluation-case assembly:

```text
Real input + classified tuple ──────────────┐
                                            ├→ Evaluation case
Target tuple + generated input + fixtures ──┘
```

### 4. Assemble and execute the starting evaluation set


This phase operates at the dataset level. It combines approved evaluation cases, reviews their collective coverage, and executes the resulting starting set to produce traces.

#### 4.1 Combine input sources


Merge approved cases from:

- real user inputs;
- generated inputs;
- manually written inputs.

#### 4.2 Balance and approve the starting set


Review the combined evaluation cases at the dataset level against the product-derived coverage requirements. The governing question is:

> Does the set provide sufficient evidence about the product's main jobs, guarantees, critical failures, and materially distinct execution conditions?

For the fuller balancing method, see [Building a balanced starting evaluation set]({{< ref "ai-engineering/evaluation/v1/11-building-balanced-set" >}}). Grouping and sampling techniques can support the balancing process.

Adjust the set until (for example):

- every main job has appropriate baseline coverage;
- straightforward baseline cases and difficult cases are included;
- product guarantees are represented across relevant contexts;
- critical failures and likely failure conditions receive coverage proportionate to their importance, risk, and uncertainty;
- no workflow or dimension value dominates without a product-derived reason;
- duplicate and near-duplicate cases have been removed;

Continue sampling, generating, and reviewing cases until the dataset satisfies the intended coverage and quality thresholds. Remove or revise inputs that are unrealistic, off-target, redundant, or inconsistent with their assigned tuple and execution context. Approximately 100 executed cases may serve as a practical starting point, but the number and distribution of cases should follow from the required product coverage.

> Because the resulting traces form the basis of downstream evaluation, each case should be realistic, representative, and capable of exercising materially distinct system behaviour.

Once these checks are satisfied, approve the resulting starting set for execution.

#### 4.3 Execute cases and collect traces


Execute the coverage-reviewed starting set against the intended system configuration and record the resulting traces.

### Workflow summary

```text
Phase 1 — Evaluation design

Product definition
    ├→ Product guarantees
    ├→ Main jobs to be done
    ├→ Critical failures
    └→ Architecture and operating constraints
                    ↓
            Evaluation boundary
                    ↓
        Coverage requirements
            ├→ Core intents
            ├→ Failure hypotheses
            ├→ Product routes and tools
            └→ Important system conditions
                    ↓
                Dimensions

Phase 2 — Tuple construction

Coverage requirements + Dimensions
    → Initial tuples
    → Expanded tuple set
    → Human review
    → Approved tuples

Phase 3 — Evaluation-case construction

Real inputs
    → Classification into observed tuples
    → Coverage-aware sampling ────────────────────┐
                                                  ├→ Evaluation cases
Unsatisfied coverage requirements                 │
    → Target tuples                               │
    → Fixtures and system context                 │
    → Synthetic user inputs ──────────────────────┘

Phase 4 — Starting-set construction

Evaluation cases
    → Coverage balancing
    → Starting evaluation set
    → Execution
    → Traces
```

## Cross-Cutting practices

### Generate inputs, not ideal outputs


Synthetic generation should produce realistic user requests rather than model answers. Generating expected outputs at the same time can transfer the generating model's assumptions, preferences, and limitations into the evaluation dataset. Expected system conditions may be recorded separately, but they should describe the condition the application encounters rather than prescribe one exact answer.

### Ground inputs in the system

### Preserve realistic user behaviour


Inputs should reflect how users actually communicate. Realistic inputs may be incomplete, indirect, conversational, inconsistent, or error-filled. They should not reveal the hidden tuple or expected condition, or read like instructions written for an evaluator.

Variation should come from meaningful behavioural differences rather than repeated paraphrasing.

### Start with straightforward cases


Start with clear and feasible requests to establish baseline behaviour. Then add more complex cases involving ambiguity, missing information, conflicting requirements, unavailable resources, multiple intents, conversational context, and unusual workflows. This makes it easier to separate basic capability problems from failures caused by added complexity.

### Build in domain-expert review and feedback loops


Add clear review points throughout the design process so product and domain experts can apply their knowledge when defining the product and coverage requirements, selecting dimensions, creating tuples, preparing inputs, checking fixtures, and analysing traces. Keep these stages human-led rather than relying on LLM generation, which reduces the risk of hallucinated, unrealistic, or misleading cases. Use findings from each review and execution cycle to update earlier decisions, refine the coverage model and dataset structure, and improve later cases.

## Design principles


The construction of an evaluation input set should begin with the product definition.

The product definition describes what the application is intended to help users accomplish, which behaviours it is expected to preserve, which actions and conditions it supports, and which failures would have significant consequences.

### Derive coverage from the product


Coverage requirements should be derived from the product's guarantees, main jobs to be done, supported workflows, critical failures, tools, permissions, and operating constraints.

### Allocate coverage according to importance and risk


Case allocation should reflect the importance of the user job, the scope of the product guarantee, the likelihood and severity of failure, uncertainty about current performance, and the number of materially distinct execution paths. Common, low-risk workflows may need enough cases to establish baseline performance, while rare but consequential conditions may require deliberate additional coverage.

Production frequency should inform the dataset, but it should not be the only basis for case allocation.

### Loop Related:

#### Treat the initial coverage model as provisional


The product definition provides the initial direction for the evaluation set, but the resulting coverage model should be revised as evidence accumulates.

Real user inputs may reveal jobs, assumptions, or operating conditions that were not represented in the original product model. Executed traces may expose failure modes that were not anticipated by the initial failure hypotheses. These findings should trigger reviewed updates to the evaluation boundary, jobs and intents, guarantees and failure assumptions, dimensions, tuples, fixtures, and case allocation.

The product definition should guide the evaluation design without preventing the design from adapting to observed user behaviour and system evidence. For a detailed method for deriving coverage requirements and allocating cases, see [Building a balanced starting evaluation set]({{< ref "ai-engineering/evaluation/v1/11-building-balanced-set" >}}).

#### Revise the coverage model as evidence accumulates


Use the product definition and failure hypotheses to guide the first dataset design, but revise the coverage model as evidence accumulates. Real inputs and traces may justify changes to the evaluation boundary, jobs and intents, failure hypotheses, dimensions, tuples, fixtures, or case allocation. Revisions to product guarantees and critical failures should be reviewed with the relevant product and domain owners.

## Key terms

### Product and coverage terms


**Product definition**

The description of the outcomes the application supports, the guarantees it should preserve, the failures that matter, and the architecture and operating constraints that shape its behaviour.

**Product guarantee**

A behaviour or property the application is expected to preserve across relevant interactions.

**Main job to be done**

A primary outcome that users rely on the product to achieve. A job may contain several user intents.

**Critical failure**

An outcome that could cause substantial harm to a user, the business, another affected party, or the integrity of the system. Critical failures determine which areas require priority.

### Dataset artefacts


**Dimension**

An axis of meaningful variation in the query space, such as intent, user type, input quality, complexity, or system state. A dimension contains a set of possible values.

Example:

```text
Dimension: Input quality

Values:
- Clear
- Ambiguous
- Incomplete
- Contradictory
```


**Tuple**

A selected combination containing one value from each relevant dimension. Example:

```text
Tuple:
- Intent: Scheduling
- User type: New customer
- Input quality: Ambiguous
```


A tuple may omit a dimension when that dimension is not relevant to the intended behaviour. It does not need to contain one value from every dimension defined for the entire dataset.

**User input**

A message or sequence of messages submitted to the AI application.

A user input may be real, manually written, generated, known difficult, or derived from a regression case.

**Fixture**

Test data, permissions, tools, documents, schedules, account configuration, or system state required to make an evaluation case executable.

Fixtures should create the conditions represented by the tuple.

**Expected condition**

A description of the relevant state or behaviour that should be present when the evaluation case is executed.

The expected condition confirms that the intended scenario has been activated. It should not prescribe one exact assistant response.

Example:

```text
Expected condition:
- The search returns zero records.
- The user has read permission but no update permission.
- Two interpretations of the requested date are plausible.
```


**Trace**

The recorded sequence of inputs, outputs, intermediate actions, tool results, and system behaviour produced when an evaluation case is executed.

A trace is an execution result. It is not part of the tuple or the original user input.
