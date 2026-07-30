---
draft: false
toc: true
title: "Conceptualization"
linkTitle: "Conceptualization"
---

I want to build a conceptual movel--or environment--within which our evaluations (evals) subsystem will be designed and will operate. Currently, we use evals for specific tasks, and these tasks exist within a broader context. We can use this framework to guide and validate the design of our evals.

For example, consider the following system context:

1. **The Product:** Defined by a set of specifications, including Minimum Viable Products (MVPs), system guarantees, invariants, and Jobs-To-Be-Done (JTBDs).
2. **The Stakeholders:** As participants, we have specific goals and tasks, such as introducing new features and assessing the system's current state and behavior.
3. **The AI System:** The underlying architecture that implements the product. This consists of various components, including standard backend infrastructure (APIs, services) as well as AI-specific blocks (LLM-based agents, workflows, RAG pipelines, and tool integrations).
4. **System State and Behavior:** The system possesses a state and exhibits dynamic behavior, which we must rigorously define and specify.
5. **The Role of Evals:** How we utilize evaluations to achieve our operational goals, and how those goals, in turn, influence the design of the evals themselves.

## System Model


At the conceptual level, the frame can be built from several core concepts. Logical model:

```text
PRODUCT INTENT
Users, jobs, outcomes, guarantees, boundaries
        ↓
Expected behaviour
        │
        │
AI SYSTEM
Components, configuration, controls
        +
Environment, input, and initial state
        ↓
Execution
        ↓
Observed behaviour and outcomes
        │
        │
PARTICIPANT
Goal
        ↓
Task or decision
        ↓
Uncertainty
        │
        └──────────────┐
                       ↓
                  EVALUATION
        Expected behaviour
        + observed behaviour
        + decision context
                       ↓
            Evidence and findings
                       ↓
                    Decision
                       ↓
          Product, system, knowledge,
          or infrastructure change
```

## AI Product


The product definition is the **normative model** of the product: what value it should produce, which behaviour it should preserve, and which failures are unacceptable.

**AI Product.** An AI Product is an intended value-producing capability offered to a defined set of actors, together with explicit commitments, boundaries, and success conditions.

```text
AI Product
├── Purpose and intended outcomes
├── Target users and affected actors
├── Jobs to be done
├── Supported capabilities and workflows
├── MVP scope
├── Promises and behavioural guarantees
├── Invariants
├── Non-guarantees and unsupported behaviour
├── Unacceptable or critical failures
```


Product-intent flow defines what should happen.

```
Product purpose
    ↓
Users and affected actors
    ↓
Jobs and intended outcomes
    ↓
Supported capabilities and workflows
    ↓
Guarantees, invariants, and boundaries
    ↓
Expected product behaviour
```

## Participant and decision flow


This defines why evaluation is needed.

```
Participant
    ↓
Goal
    ↓
Task or decision
    ↓
Uncertainty
    ↓
Question that must be answered
```


For example:

```
Product owner
    ↓
Deliver a new feature
    ↓
Decide whether it is ready to release
    ↓
Uncertainty about task success and regressions
    ↓
Does the candidate perform the new workflow
while preserving existing guarantees?
```


The participant's goal does not directly determine an evaluator. It first produces a **decision or knowledge need**.

That distinction matters:

```
Goal
→ task or decision
→ uncertainty
→ evaluation question
```

## Where evaluation connects the flows


Evaluation connects:

- **expected behaviour** from the product definition;
- **observed behaviour** from system executions;
- **the participant's question or decision**.

```
Product definition
    ↓
Expected behaviour ─────────────┐
                                │
AI System + operating context   │
    ↓                           ├→ Evaluation
Execution                       │
    ↓                           │
Observed behaviour ─────────────┤
                                │
Participant goal                │
    ↓                           │
Decision and uncertainty ───────┘
```


Evaluation can then be defined as:

> **A structured process for producing trustworthy and scoped evidence about observed AI System behaviour in relation to product expectations and a defined decision or knowledge need.**

## AI System


An **AI System** is the configured technical and operational implementation through which an AI Product produces behaviour and outcomes. It comprises application, orchestration, model, knowledge, tool, data, control, observability, and runtime components, together with the configurations and relationships that govern their operation.

A **component** can be defined minimally as:

> An identifiable part of the AI System that has a responsibility and interacts with other parts through an interface.

### Application and interaction components


These components expose AI capabilities to users or other systems. They include user interfaces, APIs, backend services, client applications, messaging interfaces, and event consumers.

### Orchestration and control components


These components manage execution flow, state transitions, routing, planning, retries, human approvals, and task coordination. They include workflow engines, agent runtimes, routers, planners, state machines, schedulers, and conversation managers.

### Model and inference components


These components perform learned inference. They include LLMs, embedding models, classifiers, rerankers, multimodal models, speech models, vision models, moderation models, model gateways, and inference services.

### Context, knowledge, and memory components


These components store, retrieve, assemble, and manage information supplied to AI operations. They include search services, retrieval services, vector stores, document stores, knowledge graphs, context builders, conversation stores, session memory, and long-term memory.

### Tool and integration components


These components allow the AI System to observe or affect external environments. They include read tools, write tools, code-execution environments, external APIs, browser automation, database tools, communication tools, and human-interaction tools.

### Data and processing components


These components prepare data for retrieval, inference, evaluation, or training. They include ingestion pipelines, parsers, chunkers, transformation services, labelling systems, feature pipelines, and indexing pipelines.

### Safety, security, and governance components


These components enforce system constraints and organisational controls. They include identity and access management, permission enforcement, policy engines, content filters, guardrails, secrets management, audit systems, approval gates, and privacy controls.

### Observability and evaluation components


These components measure system operation and quality. They include logs, traces, metrics, evaluation frameworks, test suites, monitoring systems, cost controls, quality dashboards, and incident-analysis tools.

### Infrastructure and runtime components


These components provide the execution environment for the system. They include compute platforms, model-serving infrastructure, queues, caches, storage infrastructure, container runtimes, deployment systems, and configuration services.

## Common AI System types

```text
AI System
├── Model-based pipeline
├── RAG system
├── Workflow-based system
├── Tool-calling system
├── Agentic system
├── Multimodal system
└── Hybrid system
```


Most real systems are **hybrid systems**, combining backend services, workflows, agents, models, RAG, tools, state, and controls.

# Goal Tree

## 1. Product-owner goals


The top-level goal is:

> Create, operate, and continuously improve an AI product that produces intended outcomes for its users and the organisation within acceptable behavioural and operational boundaries.

```text
G0. Deliver and sustain a successful AI product
│
├── G1. Produce intended value
│   ├── Help target users accomplish their jobs
│   ├── Produce the intended user and business outcomes
│   └── Support the primary product workflows
│
├── G2. Preserve acceptable behaviour
│   ├── Keep product promises and guarantees
│   ├── Preserve invariants
│   ├── Avoid critical and unacceptable failures
│   └── Respect permissions, policies, and human-control boundaries
│
├── G3. Deliver product capabilities
│   ├── Build the MVP
│   ├── Introduce new features
│   ├── Extend supported workflows
│   └── Make changes to the AI System
│
├── G4. Operate the product
│   ├── Release changes safely
│   ├── Maintain reliability and production readiness
│   ├── Detect incidents and regressions
│   └── Respond to changing users, data, models, and environments
│
└── G5. Improve the product
    ├── Understand the current product state
    ├── Understand actual system behaviour
    ├── Identify important opportunities and problems
    ├── Prioritise what to investigate
    ├── Diagnose product and technical causes
    ├── Select and implement changes
    └── determine whether those changes worked
```


The first two branches describe **what the product should achieve and preserve**. The remaining branches describe the owners' ability to deliver, operate, and improve it.

Product framing defines the jobs, workflows, MVP, promises, guarantees, invariants, critical failures, constraints, success measures, and release criteria.

The Product Improvement Loop then owns prioritisation, diagnosis, change hypotheses, implementation, validation, release, and monitoring.

## 2. Why product owners need evaluation


Several product-owner goals create knowledge requirements.

```text
Product-owner goal
    ↓
Question that must be answered
    ↓
Required evaluation evidence
```


For example:

```text
Introduce a new feature
    ↓
Does the feature perform its intended job?
Does it preserve existing guarantees?
    ↓
Feature evaluation and regression evidence
```

```text
Understand current product state
    ↓
How does the system behave now?
Where does it succeed or fail?
    ↓
Representative executions, traces, labels, and measurements
```

```text
Release a candidate version
    ↓
Is the candidate better or acceptably safe within the evaluated scope?
    ↓
Baseline comparison, critical checks, and release findings
```

```text
Operate the product
    ↓
Is behaviour changing in production?
Are new failures appearing?
    ↓
Online monitoring, production sampling, and failure discovery
```


Evaluation therefore exists because owners cannot directly observe or predict all relevant behaviour of a probabilistic, context-sensitive AI System.

## 3. Evaluation-system top-level goal


The top-level evaluation goal is:

> **Provide trustworthy, scoped, and decision-relevant knowledge about AI Product and AI System behaviour.**

This supports product decisions without taking ownership of those decisions.

```text
E0. Enable informed product decisions
│
├── E1. Define what behaviour matters
├── E2. Observe actual behaviour
├── E3. Judge whether behaviour is acceptable
├── E4. Produce evidence about behaviour
├── E5. Make evaluation knowledge reusable
└── E6. Maintain the reliability of evaluation itself
```


This follows the definition of evaluation as an engineering practice that connects product intent, observed behaviour, judgment, reusable knowledge, and product decisions.

## 4. Evaluation-system goal tree

### E1. Define what behaviour matters


The evaluation system must translate product intent into an evaluable form.

```text
Product definition
    ↓
Expected behaviour
    ↓
Evaluation questions
    ↓
Coverage requirements and criteria
```


Subgoals:

- identify which jobs and workflows require evaluation;
- identify applicable guarantees and invariants;
- identify critical failures and risks;
- define relevant behaviour dimensions and conditions;
- define what evidence would support a judgment;
- expose ambiguities or gaps in the product definition.

Evaluation does not independently invent product intent. Product and domain owners remain responsible for the underlying commitments.

### E2. Observe actual behaviour


The evaluation system must make relevant behaviour visible.

Subgoals:

- construct or sample relevant evaluation cases;
- execute the AI System under defined conditions;
- capture inputs, state, configuration, component interactions, actions, outputs, and outcomes;
- preserve enough evidence to reconstruct what happened;
- represent baseline, difficult, critical, regression, and production conditions.

```text
Cases and samples
    ↓
Executions
    ↓
Complete traces and outcomes
```


The documents treat complete traces as necessary because the final response may conceal earlier failures in retrieval, tool use, permissions, state changes, or intermediate decisions.

### E3. Judge whether behaviour is acceptable


The evaluation system must apply product expectations consistently to observed executions.

Subgoals:

- define explicit behavioural criteria;
- choose suitable evaluation methods;
- apply code, references, model judges, or human judgment;
- distinguish Pass, Fail, Not applicable, and Unknown;
- preserve evidence supporting each judgment;
- validate automated evaluators against trusted labels;
- handle ambiguity and adjudication.

```text
Product expectation
    +
Trace evidence
    ↓
Criterion and evaluator
    ↓
Judgment
```

### E4. Produce evidence about behaviour


Individual judgments must be converted into findings relevant to product decisions.

Subgoals:

- estimate current behaviour on an appropriate sample;
- discover recurring failures and success patterns;
- compare workflows, cohorts, environments, and system versions;
- assess whether a candidate change improved the targeted behaviour;
- detect regressions;
- monitor behaviour over time;
- communicate uncertainty, evidence gaps, and limits.

```text
Labels
    ↓
Counts, rates, comparisons, and patterns
    ↓
Scoped finding
```


The sample determines the meaning of the result. A challenge set, regression set, production sample, and controlled system comparison support different claims.

### E5. Make evaluation knowledge reusable


Evaluation should accumulate reusable knowledge rather than repeatedly start from raw judgment.

Subgoals:

- maintain evaluation cases and datasets;
- preserve representative successes and failures;
- develop failure and quality models;
- maintain criteria and rubrics;
- version evaluators;
- preserve trusted labels;
- build regression suites;
- define thresholds and decision rules where justified.

```text
Observed behaviour
    ↓
Reusable evaluation knowledge
    ├── cases
    ├── examples
    ├── criteria
    ├── labels
    ├── evaluators
    └── decision rules
```


This is the central responsibility of the Evaluation Knowledge Loop.

### E6. Maintain the reliability of evaluation


The evaluation system must evaluate and improve its own ability to produce trustworthy evidence.

Subgoals:

- detect missing trace evidence;
- detect inadequate coverage;
- detect unclear or overlapping criteria;
- detect evaluator errors and drift;
- maintain version and provenance information;
- improve instrumentation and review tooling;
- revise datasets as product behaviour changes;
- relabel traces when definitions change.

Two feedback routes are required:

```text
New or poorly fitting behaviour
    → refine evaluation knowledge
```

```text
Missing or inaccessible evidence
    → improve evaluation infrastructure
```

## 5. Relationship between the two goal trees

```text
PRODUCT-OWNER GOALS

Deliver value
Preserve guarantees
Introduce capabilities
Operate safely
Improve continuously
        │
        │ create knowledge requirements
        ▼
EVALUATION-SYSTEM GOALS

Define relevant behaviour
Observe executions
Judge behaviour
Measure and interpret
Maintain reusable evaluation knowledge
Maintain evidence and evaluator reliability
        │
        │ produce findings
        ▼
PRODUCT-OWNER DECISIONS

Prioritise
Investigate
Change the system
Release
Monitor
Revise product intent
```


A direct mapping is:

| Product-owner goal                 | Evaluation-system contribution                          |
| ---------------------------------- | ------------------------------------------------------- |
| Help users accomplish their jobs   | Evaluate task and workflow behaviour                    |
| Preserve guarantees and invariants | Test guarantees across relevant conditions              |
| Avoid critical failures            | Maintain critical cases, checks, and controls           |
| Understand current behaviour       | Produce representative traces and measurements          |
| Introduce a feature                | Define feature coverage and success criteria            |
| Improve the AI System              | Compare baseline and candidate behaviour                |
| Release safely                     | Produce scoped release evidence                         |
| Operate reliably                   | Monitor production behaviour and drift                  |
| Discover emerging problems         | Review production traces and identify new failure modes |
| Make defensible decisions          | State findings, uncertainty, coverage, and limitations  |

## 6. Ownership boundary


The evaluation subsystem answers questions such as:

```text
What behaviour occurred?
Under which conditions?
Was it acceptable according to the defined criterion?
How frequently did it occur in this sample?
How did two system versions compare?
How reliable is the evidence?
What remains unknown?
```


The product owners decide:

```text
Which outcome matters most?
Which problem should be prioritised?
What caused the problem?
What product or system change should be made?
What trade-offs are acceptable?
Should the product or feature be released?
```
