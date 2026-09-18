---
draft: false
toc: true
title: "Conceptualization"
linkTitle: "Conceptualization"
---
# Conceptual Model for AI Evaluation

## Purpose and scope


This document explains the wider system in which AI evaluation works. It connects product intent, behavior produced by an AI system, a question that needs evidence, and the evaluation work used to address that question.

It is the source model for the more detailed evaluation documents. It helps check whether the evaluation framework and evaluation subsystem have the right goals, boundaries, and capabilities. It is not a required sequence of project stages.

The model contains five connected parts:

1. **Product context:** the users, jobs, intended changes, supported behavior, limits, and obligations that give behavior meaning.
2. **AI system:** the configured technical and operational system through which the product produces behavior.
3. **Execution and evidence:** what happens when that system runs and what evidence is captured about it.
4. **Decision need:** the question or uncertainty that makes evidence useful.
5. **Evaluation:** the work that interprets the evidence for that question and states what it supports.

## The whole model

~~~text
PRODUCT CONTEXT
Current condition, intended change, users, jobs,
provisional claims, rules, and production commitments
        ↓
Current expectation or other stated evaluation basis ┐
                                                       │
AI SYSTEM + OPERATING CONTEXT                          │
Components, configuration, input, environment,        │
and initial state                                      │
        ↓                                              │
Execution                                              │
        ↓                                              │
Behavior and state changes                             │
        ↓ capture                                      │
Captured evidence ─────────────────────────────────────┤
                                                       ├→ EVALUATION
PERSON OR TEAM USING THE EVIDENCE                      │
Goal                                                   │
        ↓                                              │
Decision or knowledge need                             │
        ↓                                              │
Uncertainty                                            │
        ↓                                              │
Question ──────────────────────────────────────────────┘
                                                       ↓
                               Finding, evidence limits,
                               and remaining uncertainty
                                                       ↓
                                        Decision or next action
~~~


The next action may change:

- the product intent or production commitment;
- the solution or its implementation;
- the way the product is operated;
- the evaluation knowledge;
- the evaluation infrastructure;
- the question or the evidence being gathered.

The result may also support making no change. The diagram shows relationships between the parts. It is not a one-way delivery process. New evidence can change any earlier part of the model.

## Product intent and expected behavior


An **AI product** provides behavior to defined users or systems. That behavior is intended to help them complete work or contribute to a desired change.

The product context may include:

~~~text
AI product
├── Purpose and intended changes
├── Target users and other affected people or systems
├── Jobs to be done
├── Supported capabilities and workflows
├── Current scope, including an MVP when that term is useful
├── Provisional behavior claims
├── Proposed or active production commitments
├── Product rules and invariants
├── Supported and unsupported behavior
└── Unacceptable or critical failures
~~~


These parts do not all have the same status.

- A **provisional claim** describes behavior being considered or examined during discovery.
- A **proposed production commitment** describes behavior and obligations that the team is considering accepting.
- An **active production commitment** states what people may rely on, within which limits, and what the responsible people have accepted responsibility for.

A production commitment contains more than expected behavior. It also records supported and unsupported scope, required operating conditions, remaining assumptions, accepted uncertainty, observation, recovery, and maintenance.

Product intent is not proof that the intended value or result will occur. Keep these questions separate:

1. Does the product provide the behavior currently claimed or promised?
2. Can the intended users understand it and complete the relevant work?
3. Do people choose and continue using it instead of the available alternatives?
4. Does its use change the user or operating condition it was meant to change?
5. Does that change contribute to the wider result that motivated the work?

Evidence for one question does not answer the others.

A useful dependency is:

~~~text
Purpose and current condition
        ↓
Users and other affected actors
        ↓
Jobs and intended changes
        ↓
Candidate or supported capabilities and workflows
        ↓
Current claim, rule, or production commitment
        ↓
Expected product behavior
~~~


Evidence may cause any part of this description to be revised.

Product intent, rules, and commitments describe what should happen. Captured evidence describes what happened in an execution, within the limits of what was recorded.

## The AI system and its execution


An **AI system** is the configured technical and operational implementation through which an AI product produces behavior.

It may contain ordinary application services as well as models, retrieval, workflows, agents, tools, state, controls, and infrastructure. Its behavior depends on the relationships among these parts and on the input, initial state, environment, data, and configuration used in an execution.

~~~text
AI system
        +
Input, environment, and initial state
        ↓
Execution
        ↓
Behavior and state changes
~~~


The product may contribute to user or business results, but the AI system does not usually cause those results by itself. Other product, human, organizational, and environmental conditions also matter.

The system being evaluated and the evaluation subsystem are conceptually different. They may share logs, instrumentation, or runtime controls, but evaluation also includes cases, samples, criteria, reviewers, datasets, and tools outside the evaluated system.

The main AI-system component groups and common architectural patterns are listed in the appendix.

## Decision and knowledge needs


Evaluation starts from a question that matters to a person or team.

~~~text
Person or team using the evidence
        ↓
Goal
        ↓
Task, decision, or knowledge need
        ↓
Uncertainty
        ↓
Question to address
~~~


For example:

~~~text
Product team
        ↓
Decide whether to support a candidate behavior
in a limited production scope
        ↓
Uncertainty about task completion,
important failures, and regressions
        ↓
Does the candidate provide the proposed behavior
in the relevant situations while preserving
the existing production commitments?
~~~


A goal does not directly determine an evaluator. The question first determines what evidence is needed. Only then can the team choose cases or samples, observations, criteria, and judgment methods.

~~~text
Goal
→ decision or knowledge need
→ uncertainty
→ question
→ evidence need
→ evaluation design
~~~


The person or team using the evidence may also have authority to make the decision. This role is different from a **participant** in an evaluation case, who is the person or simulated actor interacting with the product.

## What evaluation connects


Evaluation connects:

- the current expectation or other evaluation basis;
- captured evidence about behavior;
- the question or decision being considered.

~~~text
Product context or another stated source
        ↓
Evaluation basis ────────────────────────────────┐
                                                  │
Execution                                         │
        ↓                                         ├→ Evaluation
Captured evidence about behavior ─────────────────┤
                                                  │
Question or decision need ────────────────────────┘
                                                  ↓
                               Finding and remaining uncertainty
~~~


> **Evaluation uses captured evidence about product behavior to address a named question. When judgment is required, it applies a stated evaluation basis. It reports what the evidence supports, where that support applies, and what remains unknown.**

An observation alone is not a complete evaluation. It becomes part of an evaluation when it is interpreted for a named question. Exploratory review can begin before a stable claim or criterion exists. A judgment that behavior is acceptable or unacceptable requires a stated basis.

The evaluation framework and evaluation subsystem have different roles:

| Part | Role |
| --- | --- |
| **Evaluation framework** | Defines how the question, evaluation basis, evidence, judgment, finding, decision, and remaining uncertainty relate |
| **Evaluation subsystem** | Uses people, practices, cases, samples, data, and software to produce, inspect, judge, compare, and preserve the required evidence |

The framework guides the design of the subsystem. The subsystem makes the evidence available. Neither part owns product intent, accepted risk, production commitments, or product decisions.

## Why product work needs evaluation

### Goals of product work


The top-level product goal is:

> Develop, operate, and improve an AI product that provides supported behavior, helps its intended users, and stays within accepted product and operating boundaries.

~~~text
G0. Develop and sustain an AI product
│
├── G1. Help intended users and contribute to the intended change
│   ├── Help target users accomplish relevant jobs
│   ├── Support the intended change in a user or operating condition
│   ├── Contribute to the intended wider result
│   └── Support the main product workflows
│
├── G2. Provide acceptable and dependable behavior
│   ├── Meet active production commitments
│   ├── Preserve product rules and invariants
│   ├── Avoid critical and unacceptable failures
│   └── Respect permissions, policies, and human-control boundaries
│
├── G3. Change or extend the product
│   ├── Establish an initial supported scope
│   ├── Introduce or change supported behavior
│   ├── Extend supported workflows
│   └── Change the AI system
│
├── G4. Operate the product
│   ├── Release changes with suitable controls
│   ├── Maintain reliability and production readiness
│   ├── Detect incidents and regressions
│   └── Respond to changing users, data, models, and environments
│
└── G5. Learn and improve
    ├── Understand current product behavior
    ├── Identify important opportunities and problems
    ├── Prioritize what to investigate
    ├── Investigate product and technical causes
    ├── Select and make changes
    └── Determine whether those changes had the intended effect
~~~


The first two branches describe what the product is intended to help achieve and what behavior it must provide or protect. The remaining branches describe work needed to change, operate, and improve it.

The product team can be responsible for its decisions, the behavior it promises, and the work within its authority. Wider user and business results may also depend on pricing, distribution, service, other systems, and human behavior. Evaluation should not hide those dependencies.

Product framing records the current condition, intended change, users, jobs, candidate scope, and important assumptions. A production commitment defines the behavior and conditions for which responsibility has been accepted. Product improvement work uses evidence to prioritize investigations, make changes, release them, and observe what happens.

### Questions created by product work


Product goals create knowledge needs:

~~~text
Product goal
        ↓
Question to address
        ↓
Required evidence
~~~


Examples include:

| Product work | Questions | Evaluation evidence |
| --- | --- | --- |
| Examine a candidate solution | Can it provide the proposed behavior? Where does it fail? | Relevant executions, captured evidence, exploratory review, and candidate comparisons |
| Introduce or change supported behavior | Does it perform the intended job? Does it preserve current commitments? | Behavior evaluation and regression evidence |
| Understand the current product | How does it behave now? Where does it succeed or fail? | Designed cases or production samples, traces, labels, patterns, and measurements |
| Consider a production commitment | Is the evidence sufficient for the behavior, scope, and responsibility being considered? | Evidence about behavior, important failures, operating conditions, limits, and remaining uncertainty |
| Release a candidate version | Is the candidate better or acceptably safe within the evaluated scope? | Baseline comparison, critical checks, regression evidence, and stated limits |
| Operate the product | Is live behavior changing? Are important new failures appearing? | Production sampling, monitoring, incident review, and failure discovery |

Evaluation is needed because relevant AI product behavior cannot be inferred from the specification or implementation alone. It may vary across inputs, state, models, prompts, tools, data, configurations, and operating conditions.

## Evaluation goals


The top-level evaluation goal is:

> **Use scoped evidence to state what it supports about AI product behavior for a named question, with its source and limits made clear.**

~~~text
E0. Support informed decisions with scoped evidence
│
├── E1. Make relevant behavior and the evaluation basis explicit
├── E2. Observe behavior and capture the required evidence
├── E3. Judge behavior when a basis for judgment exists
├── E4. Interpret evidence and produce findings
├── E5. Preserve reusable evaluation knowledge
└── E6. Keep the evaluation work reliable
~~~


These are goals of the evaluation framework and subsystem. They are not project phases. Exploratory work may move among them, and evidence may cause an earlier definition or question to change.

This section preserves the goal taxonomy and the scope of each goal. The operational documents explain the working methods in more detail.

### E1. Make relevant behavior and the evaluation basis explicit


Evaluation must connect product intent or another valid basis to a question that can be examined.

~~~text
Product context or another stated source
        ↓
Evaluation basis
        ↓
Evaluation question
        ↓
Evidence and coverage needs
~~~


This includes:

- identifying the jobs, workflows, and behavior relevant to the question;
- identifying applicable production commitments, product rules, and invariants;
- identifying important failures, harm, and operating conditions;
- defining relevant behavior dimensions and situations;
- stating what evidence would support a judgment;
- exposing gaps, conflicts, or ambiguity in the product definition.

Evaluation does not silently invent product intent. Product, domain, safety, legal, or other responsible roles supply the underlying basis. Evaluation work may show that the basis is missing, unclear, or inconsistent.

### E2. Observe behavior and capture the required evidence


The evaluation subsystem must capture the evidence needed to inspect behavior relevant to the question.

This includes:

- constructing designed cases or defining production samples;
- executing the AI system under identified conditions;
- capturing relevant inputs, state observations, configurations, actions, outputs, and linked outcomes;
- preserving enough source and version information to understand what produced the evidence;
- representing normal, boundary, difficult, critical, regression, and production situations when they matter.

~~~text
Designed cases or production sample
        ↓
Executions
        ↓
Captured traces and linked outcome evidence
~~~


A trace is captured evidence about an execution. It is not a complete account of everything that happened. A **capture contract** states which records are required for the current evaluation. Meeting that contract does not automatically make every judgment possible.

### E3. Judge behavior when a basis for judgment exists


Judgment applies an evaluation basis to the available evidence.

This includes:

- defining explicit criteria;
- choosing suitable deterministic, reference-based, model-based, or human methods;
- preserving the evidence behind each judgment;
- validating automated evaluators against independently produced reference labels;
- recording disagreement and adjudication;
- recording when a criterion does not apply or the evidence cannot support a judgment.

~~~text
Evaluation basis
        +
Captured evidence
        ↓
Criterion and evaluator
        ↓
Judgment
~~~


The result terms depend on the judgment:

| Criterion type | Main results |
| --- | --- |
| Success or conformance criterion | `PASS`, `FAIL`, and `NOT JUDGEABLE`; a criterion may also be `NOT APPLICABLE` |
| Operational failure mode | `PRESENT`, `ABSENT`, `NOT APPLICABLE`, and `NOT JUDGEABLE` |

`NOT JUDGEABLE` means that the criterion applies but the available evidence cannot support the required judgment. It is not a kind of product behavior. A missing or unclear criterion is a definition problem and must not be hidden as `NOT JUDGEABLE`.

### E4. Interpret evidence and produce findings


Individual observations and judgments must be interpreted for the original question.

This includes:

- describing concrete successes and failures;
- estimating current behavior when the sample supports an estimate;
- finding recurring success and failure patterns;
- comparing important situations, groups, environments, and system versions;
- checking whether a candidate change improved the target behavior;
- detecting regressions and changes in production behavior;
- reporting coverage gaps, evaluator limits, evidence limits, and remaining uncertainty.

~~~text
Observations and labels
        ↓
Patterns, measurements, and comparisons
        ↓
Scoped finding
~~~


The cases or sample determine what the finding can mean. A challenge set, regression set, production sample, and controlled comparison support different claims.

### E5. Preserve reusable evaluation knowledge


Evaluation should retain useful knowledge instead of starting from raw judgment each time.

This may include:

- evaluation cases and production-sample definitions;
- representative successes and failures;
- observations and failure incidents;
- behavior, quality, and failure categories;
- operational failure modes selected for repeated assessment;
- criteria and rubrics;
- reference labels and their sources;
- evaluator versions and validation evidence;
- regression sets;
- baselines and approved decision rules.

~~~text
Captured evidence, observations, judgments, and findings
        ↓
Reusable evaluation knowledge
        ├── cases and samples
        ├── observations and examples
        ├── categories and operational modes
        ├── criteria and labels
        ├── evaluators
        └── decision rules
~~~


This knowledge is not fixed. It should change when product intent, supported scope, users, behavior, or operating conditions change.

### E6. Keep the evaluation work reliable


The subsystem must detect and correct problems in its own evidence path.

This includes:

- detecting missing or inaccessible trace evidence;
- detecting inadequate or outdated coverage;
- detecting unclear, conflicting, or overlapping criteria;
- detecting evaluator errors, instability, and changes over time;
- preserving source, version, and provenance information;
- improving instrumentation and review tools;
- revising datasets and samples when the product changes;
- relabeling affected evidence under a new definition while preserving earlier labels and version history;
- keeping the work timely and affordable enough for the decision.

Problems found here may require a change to evaluation knowledge or evaluation infrastructure. The feedback routes are defined in the next section.

## Three feedback routes


Findings can change three different parts of the wider system:

| Feedback route | What changes |
| --- | --- |
| **Product improvement** | Product intent, a candidate solution, implementation, operation, supported scope, or production commitment |
| **Evaluation knowledge** | Claims, cases, samples, categories, failure modes, criteria, labels, evaluators, or decision rules |
| **Evaluation infrastructure** | Execution tools, evidence capture, storage, version links, review tools, or monitoring |

This document calls these routes the **Product Improvement Loop**, **Evaluation Knowledge Loop**, and **Evaluation Infrastructure Loop**. They describe different objects of change. They do not require three separate teams.

~~~text
Finding
   ├── behavior does not match the intent,
   │   or the evidence challenges the intent
   │       → product improvement
   │
   ├── current evaluation concepts do not fit
   │       → evaluation knowledge
   │
   └── required evidence cannot be obtained or used
           → evaluation infrastructure
~~~


One finding may use more than one route. A production incident, for example, may require an immediate product response, a new regression case, and better evidence capture.

## How product and evaluation goals connect

~~~text
PRODUCT GOALS

Help users complete work
Contribute to intended changes
Provide dependable behavior
Change and operate the product
Learn and improve
        │
        │ create knowledge needs
        ▼
EVALUATION GOALS

Make the relevant behavior explicit
Capture evidence about executions
Judge behavior when a basis exists
Interpret results
Preserve reusable knowledge
Keep evaluation reliable
        │
        │ produce findings
        ▼
PRODUCT DECISIONS AND ACTIONS

Prioritize
Investigate
Change the solution or system
Change the commitment
Release, limit, or stop exposure
Observe and reconsider
~~~


A direct mapping is:

| Product goal or need | Evaluation contribution |
| --- | --- |
| Help users accomplish their jobs | Examine task and workflow behavior |
| Support an intended change | Provide behavior evidence and preserve links to outcome evidence without claiming causation |
| Meet production commitments | Examine promised behavior and required conditions in relevant situations |
| Preserve rules and invariants | Apply suitable checks across relevant conditions |
| Avoid critical failures | Maintain critical cases and, where repeated assessment is needed, operational failure modes and checks |
| Understand current behavior | Produce inspectable traces, judgments, patterns, and suitable measurements |
| Introduce or change supported behavior | Define coverage and criteria for the proposed change |
| Improve the AI system | Compare baseline and candidate behavior |
| Release with suitable controls | Produce scoped release evidence |
| Operate reliably | Examine production behavior and changes over time |
| Discover emerging problems | Review production evidence and identify new observations, incidents, and possible patterns |
| Make decisions with visible evidence and limits | State findings, uncertainty, coverage, and limits |

## Responsibilities and limits

### What evaluation can establish


Evaluation can help answer questions such as:

~~~text
What behavior does the captured evidence show?
Under which conditions?
Which expectation or evaluation basis applied?
Was the behavior acceptable under that basis?
How often did a label occur in this defined set or sample?
How did two systems, versions, groups, or periods compare?
How reliable is the available evidence, and what evidence is missing?
What remains unknown?
~~~


The strength of each answer depends on the cases or sample, capture, criterion, evaluator, and analysis used.

### What diagnosis must investigate


An evaluation finding does not by itself establish why behavior occurred.

Diagnosis may ask:

~~~text
Which mechanism or condition produced the behavior?
Which product, model, prompt, tool, data, state,
or operating factor contributed to it?
Can the behavior be reproduced?
What evidence would distinguish competing explanations?
~~~


Diagnosis may involve product, domain, engineering, operations, safety, security, and evaluation roles.

### What responsible people decide


The roles responsible for the product decide:

~~~text
Which current condition deserves attention?
Which intended change matters?
Which problem or opportunity should be prioritized?
What trade-offs and remaining uncertainty are acceptable?
What product or system change should be made?
What production commitment should be proposed, changed, or withdrawn?
Should a release or rollout proceed, pause, narrow, or stop?
~~~


The person or group with decision authority depends on the organization and the consequence of the decision. Evaluation provides findings. It does not take responsibility for product intent, accepted risk, production commitments, or release decisions.

## Appendix: AI system components and architectural patterns

### Component


A **component** is an identifiable part of the AI system that has a responsibility and interacts with other parts through an interface.

The useful system boundary depends on the question. A product evaluation may treat a model, tool, and backend as one configured system. A technical investigation may examine them separately.

### Application and interaction components


These expose AI-supported behavior to users or other systems. They include user interfaces, APIs, backend services, client applications, messaging interfaces, and event consumers.

### Orchestration and control components


These manage execution flow, state transitions, routing, planning, retries, human approvals, and task coordination. They include workflow engines, agent runtimes, routers, planners, state machines, schedulers, and conversation managers.

### Model and inference components


These perform learned inference. They include language models, embedding models, classifiers, rerankers, multimodal models, speech models, vision models, moderation models, model gateways, and inference services.

### Context, knowledge, and memory components


These store, retrieve, assemble, and manage information supplied to AI operations. They include search services, retrieval services, vector stores, document stores, knowledge graphs, context builders, conversation stores, session memory, and long-term memory.

### Tool and integration components


These allow the AI system to observe or affect external environments. They include read tools, write tools, code-execution environments, external APIs, browser automation, database tools, communication tools, and human-interaction tools.

### Data and processing components


These prepare data for retrieval, inference, evaluation, or training. They include ingestion pipelines, parsers, chunkers, transformation services, labeling systems, feature pipelines, and indexing pipelines.

### Safety, security, and governance components


These enforce system constraints and organizational controls. They include identity and access management, permission enforcement, policy engines, content filters, guardrails, secrets management, audit systems, approval gates, and privacy controls.

### Observability and embedded measurement components


These record or measure system operation. They include logs, traces, metrics, instrumentation, monitoring, cost controls, and runtime quality checks.

Some evaluation code may run within or alongside the AI system. The wider evaluation subsystem also includes external cases, samples, datasets, evaluators, reviewers, analysis, and decision records. It should not be reduced to embedded instrumentation.

### Infrastructure and runtime components


These provide the execution environment. They include compute platforms, model-serving infrastructure, queues, caches, storage, container runtimes, deployment systems, and configuration services.

### Common architectural patterns


An AI system may use several of these patterns at once:

~~~text
AI system
├── Model-based pipeline
├── Retrieval-augmented generation system
├── Workflow-based system
├── Tool-calling system
├── Agentic system
├── Multimodal system
└── Hybrid system
~~~


These are architectural patterns, not exclusive project types. A real system is often hybrid and may combine backend services, workflows, agents, models, retrieval, tools, state, and controls.

## Related documents


- [AI Evaluation]({{< ref "ai-engineering/evaluation/v1/ai-evaluation" >}}) gives the short overview.
- [Goals of AI Evaluation]({{< ref "ai-engineering/evaluation/v1/ai-evaluation-goals" >}}) turns this source model into framework and subsystem goals.
- [Evidence Model]({{< ref "ai-engineering/evaluation/v1/evidence-model" >}}) defines cases, executions, traces, observations, judgments, findings, and related artifacts.
- [Evaluation Subsystem]({{< ref "ai-engineering/evaluation/v1/evaluation-subsystem" >}}) describes the people, practices, data, and software used to produce evaluation evidence.
- [Judgment and Findings]({{< ref "ai-engineering/evaluation/v1/30-judgment-and-findings" >}}) defines criteria, evaluators, labels, measurements, findings, and decision rules.
- [Failure Analysis]({{< ref "ai-engineering/evaluation/v1/20-error-analysis" >}}) explains exploratory failure analysis and operational failure modes.
- [Production Learning]({{< ref "ai-engineering/evaluation/v1/production-learning" >}}) explains how evidence from real use returns to product and evaluation work.
- [Operating Model]({{< ref "ai/operating-model/operating-model" >}}) supplies the wider product decision logic.
- [Production Commitment]({{< ref "ai/operating-model/production-commitment" >}}) defines the behavior and conditions for which responsibility is accepted.
