---
draft: false
toc: true
title: "Layer 1c Ai System Causal Features"
linkTitle: "Layer 1c Ai System Causal Features"
---
# Layer 1C -- AI-System-Level Causal Features

## Framing principle -- AI systems are empirical systems


That means their behavior cannot be fully trusted, specified, or improved from implementation structure alone. Once an LLM is embedded in a real application, quality has to be discovered, measured, and validated through representative scenarios, repeated runs, traces, and production observation.

Calling AI systems empirical does not mean their behavior is arbitrary, unknowable, or only testable in production. It means that design-time reasoning, static inspection, and ordinary deterministic tests are necessary but insufficient. They must be supplemented by behavioral measurement under representative inputs, contexts, system states, and operational constraints.

This is a cross-cutting Layer 1C framing principle rather than a separate primitive feature.

### Engineering consequences


- development improves systems by experiment, comparison, and measured behavior rather than code inspection alone;
- operation depends on traces, monitoring, regression checks, and slice visibility;
- delivery requires acceptance criteria, evaluation coverage, and release gates tied to observed behavior.

## Feature matrix


| Code    | Feature                                             | Core question it answers                                                                                           |
| ------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **C1**  | Behavioral Outcome Variability                      | Does the system preserve materially equivalent behavior across repeated or varied scenarios?                       |
| **C2**  | Soft Correctness Surface                            | What counts as acceptable output when there is no single exact answer?                                             |
| **C3**  | Compositional Pipeline Structure                    | How does behavior emerge from multiple interacting components?                                                     |
| **C4**  | Agentic State-Action Interface                      | How does the system move from generation to tools, state, decisions, or external action?                           |
| **C5a** | Runtime Context Drift                               | How do hidden execution-context changes alter behavior even when visible input stays the same?                     |
| **C5b** | Recursive Feedback and Data-Action Coupling         | How does the system's own behavior reshape the future data or state it later depends on?                           |
| **C5c** | Change Non-Locality                                 | How do apparently local changes produce behavioral effects outside the directly targeted case, slice, or workflow? |
| **C6**  | Weak Native Observability and Attribution           | Can failures be traced to the responsible component or condition?                                                  |
| **C7**  | Policy and Trust Boundary Mediation                 | How are safety, compliance, authorization, and trust boundaries enforced?                                          |
| **C8**  | Quality-Cost-Latency-Reliability Operating Envelope | What quality is feasible under operational budgets for cost, latency, and reliability?                             |

# C1. Behavioral Outcome Variability

## Core feature


AI systems can produce different acceptable or unacceptable behaviors across repeated runs, semantically similar inputs, changed contexts, or changed runtime conditions.

The important unit is not exact text. The important unit is the **intended outcome**:

- final answer;
- classification;
- escalation decision;
- refusal or compliance behavior;
- tool call;
- citation choice;
- external action;
- state transition;
- user-facing commitment.

Two outputs may be worded differently while preserving the same intended outcome. Conversely, two outputs may look similar while differing in a materially important decision.

> AI-system behavior should be evaluated at the level of materially intended outcomes, not exact surface text; the same or similar scenarios may yield different outcomes because generation, context, tools, retrieval, runtime, or environment conditions vary.

## Why this belongs in Layer 1C


Behavioral variability is not a fault by itself. Some variation is normal and acceptable, especially in open-ended generation. It becomes a fault only when materially relevant behavior changes under conditions where it should remain stable.

This feature captures two related cases.

### True non-determinism


The full visible scenario appears identical, and the system configuration is intended to be identical, but repeated runs produce different behavior.

Possible sources include:

- sampling;
- temperature or random seeds;
- nondeterministic model serving;
- parallelism or numerical nondeterminism;
- retrieval race conditions;
- tool timing;
- backend execution differences;
- uncontrolled orchestration state.

The evaluation question is:

> Does the same scenario preserve materially equivalent behavior across repeated runs?

### Behavioral sensitivity under variation


The input is not identical, but it is semantically similar, operationally equivalent, or different only in ways that should not affect the intended behavior.

Example:

```text
Input A:
  Summarize this issue and say if it should be escalated.

Input B:
  Briefly summarize the customer problem and decide whether escalation is needed.
```


A stable system should preserve the escalation-relevant behavior unless the wording difference changes the task in a meaningful way.

The evaluation question is:

> Does the system preserve intended behavior under reasonable variation?

## What it explains downstream


C1 contributes to fault modes involving:

- unreproducible failures;
- one-run demos that mask instability;
- inconsistent classification or escalation;
- unstable refusal or policy behavior;
- unstable tool use;
- brittle behavior under paraphrase;
- benchmark pass/fail variance across runs;
- difficult debugging because the same scenario does not always fail.

## Common engineering trap


The main trap for people coming from traditional software engineering is assuming that one successful run proves reliability.

A single successful demo only shows that the system worked once. Reliable evaluation requires repeating the same scenario and measuring whether materially correct behavior is preserved across runs.

# C2. Soft Correctness Surface

## Core feature


Many AI-system tasks do not have a single exact correct output. Correctness is often multidimensional, graded, task-specific, and dependent on the intended use.

A response may need to be judged by several criteria at once:

- factuality;
- completeness;
- relevance;
- grounding;
- source fidelity;
- decision accuracy;
- policy compliance;
- tone;
- usefulness;
- action safety;
- formatting correctness;
- downstream usability.

This differs from traditional deterministic unit tests, where expected outputs are often exact, binary, and localized.

## Why this belongs in Layer 1C


Soft correctness is a system-level feature because correctness is defined by the product task, user need, risk level, and downstream workflow, not only by model internals.

For example:

```text
Task:
  Summarize this customer issue and decide whether it should be escalated.
```


There may be many acceptable summaries, but only some preserve the necessary facts, risk signals, policy requirements, and escalation logic.

A good evaluation must define equivalence criteria:

```text
Acceptable variation:
  different wording;
  different sentence order;
  different but equivalent summary phrasing;
  different formatting that preserves all required fields.

Material variation:
  different escalation decision;
  omitted risk signal;
  unsupported claim;
  wrong citation;
  unsafe recommendation;
  different external action.
```

## Important boundary


C2 is related to B4 Plural Valid-Output Space, but broader.

```text
B4:
  The model can generate multiple plausible or valid continuations.

C2:
  The system must define which outputs are acceptable for the task and risk context.
```

# C3. Compositional Pipeline Structure

## Core feature


Most real AI systems are not a single model call. They are pipelines or graphs of interacting components.

A typical system may include:

- user input handling;
- normalization;
- classification or routing;
- retrieval;
- metadata filtering;
- ranking or reranking;
- prompt assembly;
- model generation;
- tool selection;
- tool execution;
- tool-result interpretation;
- post-processing;
- validation;
- policy checks;
- output parsing;
- state updates;
- action execution;
- logging and monitoring.

End-to-end behavior depends on how these components interact.

## Canonical statement


> AI-system behavior is often compositional: final outputs and actions emerge from multiple interacting components rather than from one isolated model invocation.

## What it explains downstream


C3 contributes to fault modes involving:

- hard-to-localize root cause;
- silent degradation in one component;
- retrieval-good-generation-bad cases;
- retrieval-bad-generation-good cases;
- parser and formatting failures;
- prompt assembly regressions;
- tool-schema mismatch;
- brittle handoff between components;
- component-level improvements that do not improve end-to-end behavior.

## Evaluation implications


Evaluation requires traceability across stages so teams can distinguish:

- retrieval failures from generation failures;
- prompt-assembly failures from evidence-use failures;
- parser or schema failures from model failures;
- policy-layer failures from upstream content failures.

Because end-to-end behavior emerges from stage interaction, static inspection of individual components is insufficient; pipeline reliability has to be measured under replay, traces, or representative runtime conditions.

# C4. Agentic Control-Flow and State-Action Interface

## Core feature


Agentic AI systems are compositional AI systems in which the model or orchestration layer has some autonomy over control flow.

They do more than produce answer text. They may select steps, call tools, inspect outputs, update state, recover from errors, decide when to stop, ask for clarification, escalate to a human, or take action in an external system.

The important feature is not that the system contains tools or multiple components. That is already covered by C3 Compositional Pipeline Structure. The additional feature is that some part of the control flow is delegated to model-mediated or AI-mediated decisions.

```text
Non-agentic pipeline:
  The system defines the stages.
  The model performs bounded transformations inside those stages.

Agentic workflow:
  The system may allow the model or orchestration layer to decide which step to take next, which tool to use, what state to update, whether to recover, whether to continue, or whether to stop.
```


This creates a state-action loop:

```text
interpret context
→ choose next step
→ call tool or take action
→ observe result
→ update state
→ decide whether to continue, recover, escalate, or stop
```


Final success depends on the whole behavior chain, not only the final message.

## Canonical statement


> Agentic systems are compositional AI systems with delegated control-flow autonomy: the system may participate in selecting steps, calling tools, interpreting observations, updating state, recovering from failures, deciding when to stop, or taking external action.

## Control-flow autonomy spectrum


Agentic behavior is not a binary category. It exists on a spectrum.

```text
Fixed pipeline: Stages are predetermined. The model performs bounded generation, extraction, classification, or transformation.

Conditional pipeline: The system branches based on rules, classifiers, model outputs, metadata, policy checks, or validation results.

Tool-using workflow: The model or system selects or parameterizes tools inside a bounded orchestration pattern.

Agentic loop: The model or orchestration layer participates in selecting steps, interpreting observations, updating state, recovering from failure, and deciding whether to continue or stop.

Externally acting agent: Model-mediated decisions can change external systems, user-visible state, records, permissions, messages, transactions, code, tickets, calendars, or other operational artifacts.
```


The higher the control-flow autonomy, the more important process evaluation, authorization, observability, recovery behavior, and stopping criteria become.

## What this adds beyond C3


C3 explains that end-to-end behavior emerges from multiple interacting components. C4 explains what changes when the system delegates part of the execution policy to AI-mediated decisions.

```text
C3:
  How does behavior emerge from interacting components?

C4:
  How does the system decide what to do next, what to act on,
  what state to update, how to recover, and when to stop?
```


A retrieval-augmented question-answering system may be compositional without being strongly agentic. It may always retrieve, assemble context, generate, validate, and return an answer.

An agentic support assistant may decide whether to search documents, inspect account state, open a ticket, request clarification, escalate to a human, or draft a customer response. The components may be similar, but the causal surface is different because the control flow is partly dynamic and model-mediated.

## Engineering consequences


Agentic systems usually require explicit control and observability mechanisms around the state-action loop.

The system should define which decisions are delegated to the model, which are controlled by deterministic orchestration, and which require validation, confirmation, or human approval.

For low-risk tasks, broad control-flow autonomy may be acceptable. For high-impact tasks, autonomy should usually be narrowed by schemas, policies, validators, confirmations, and escalation paths.

## Important boundary


C4 is not separate from C3.

Agentic systems are usually implemented as pipelines, graphs, or orchestrated workflows. The distinction is not architectural base. The distinction is degree of control-flow autonomy. C4 is therefore a specialized, higher-autonomy case within compositional AI systems, not a wholly separate kind of architecture.

The central engineering question is how much control-flow autonomy the system has, what actions that autonomy can affect, and what controls make that autonomy safe and reliable.

# C5a. Runtime Context Drift

## Core feature


AI-system behavior is determined by the full runtime context, not only by the visible user input.

A user request may appear identical across two runs while the effective execution context has changed. When this happens, the system is not actually processing the same scenario, even if the user-facing task looks unchanged.

Runtime context drift is the condition where the visible input remains stable, but one or more hidden execution conditions that shape behavior have changed.

```text
Visible input:
  The user-facing request, task, document, or instruction.

Runtime context:
  The hidden execution conditions that shape system behavior.

Effective scenario:
  Visible input + runtime context.
```


This feature explains why "same prompt, different answer" is often an incomplete diagnosis. The visible prompt may be the same, but the effective scenario may not be.

## Why this belongs in Layer 1C


Runtime context drift is not itself a failure.  It means a structural property of deployed AI systems that can become a factor behind failures. It is a structural condition of deployed AI systems that can cause or obscure failures when runtime context is not captured, versioned, controlled, or accounted for during evaluation and incident analysis.

Example:

```text
User request:
  Summarize this support ticket and decide whether it should be escalated.

Run 1:
  model version A;
  prompt template version 12;
  CRM notes from Monday;
  retrieval index version 41;
  escalation policy version 3;
  old account-risk rubric.

Run 2:
  model version B;
  prompt template version 12;
  CRM notes updated on Tuesday;
  retrieval index version 44;
  escalation policy version 4;
  revised account-risk rubric.
```


The visible request is unchanged. The effective runtime scenario is not.

A different escalation decision may be correct. The issue is not automatically inconsistency, randomness, or regression. The issue is that the two outputs cannot be interpreted as behavior under the same conditions unless the runtime context is captured and compared.

## What can drift


Runtime context includes every execution-time condition that can influence system behavior.

```text
Model:
  model provider;
  model family;
  model version;
  fine-tune version;
  serving variant;
  decoding parameters;
  safety layer;
  provider-side defaults.

Prompting:
  system prompt;
  developer prompt;
  task prompt;
  prompt template;
  instruction hierarchy;
  few-shot examples;
  formatting constraints.

Retrieval:
  corpus contents;
  index version;
  embedding model;
  chunking strategy;
  ranking algorithm;
  filters;
  top-k settings;
  source freshness;
  citation and grounding rules.

External data:
  database records;
  CRM notes;
  documents;
  tickets;
  user profile data;
  account state;
  permissions;
  pricing;
  inventory;
  timestamps.

Tools:
  tool definitions;
  API versions;
  tool availability;
  authentication state;
  permissions;
  tool outputs;
  cache state;
  retry behavior;
  timeout behavior.

Policies and rubrics:
  safety policy;
  escalation policy;
  compliance rules;
  business rules;
  refusal criteria;
  risk thresholds;
  evaluation rubrics.

Schemas and parsers:
  input schema;
  output schema;
  JSON contracts;
  validation rules;
  enum definitions;
  downstream parser assumptions.

State:
  conversation history;
  memory;
  session state;
  user state;
  feature flags;
  rollout cohort;
  experiment assignment;
  cache contents.

Runtime environment:
  deployment version;
  orchestration code;
  routing logic;
  dependency versions;
  regional configuration;
  fallback paths;
  infrastructure behavior.
```


Any of these can change while the visible input remains the same.

## What it explains downstream


Runtime context drift contributes to fault modes involving:

```text
apparently inconsistent outputs;
non-reproducible incidents;
evaluation runs that are not comparable;
retrieval-dependent behavior shifts;
policy-dependent behavior shifts;
tool-dependent behavior shifts;
state-dependent behavior shifts;
hidden data-refresh effects;
apparent model flakiness caused by untracked context changes.
```


The common pattern is that the team compares two outputs as if the same scenario was executed twice, when in fact the runtime scenario changed between runs.

## Common engineering trap


The main trap is treating the visible input as the unit of comparison.

```text
Incorrect framing:
  "The same prompt produced a different answer."

Better framing:
  "Did the same effective runtime scenario produce a different answer?"
```


For AI systems, the effective scenario is the relevant unit of comparison.

A prompt alone is usually insufficient. The behavior may also depend on retrieved context, source data, model version, policy rules, tool outputs, memory, state, schema, routing, and deployment configuration.

## Engineering consequences


Runtime context drift means AI delivery systems need explicit scenario capture and version control.

Production traces should capture enough of the runtime context to make behavior explainable, reproducible, and comparable.

At minimum, this usually includes:

```text
visible user input;
assembled prompt;
system and developer instructions;
model name, version, and configuration;
retrieved documents and ranking metadata;
source document versions;
tool calls and tool outputs;
policy and rubric versions;
schema and parser versions;
conversation, memory, and session state;
feature flags and rollout cohort;
runtime environment and orchestration version;
timestamps and external data snapshots where relevant.
```


The goal is not indiscriminate logging. The goal is to preserve the behaviorally relevant context needed for debugging, evaluation, audit, replay, and incident analysis.

## Important boundary


Runtime context drift is not itself a regression.

```text
Runtime context drift:
  The effective execution context changed.

Regression:
  Behavior degraded relative to an acceptance standard.
```


A changed output may be correct if the runtime context changed. For example, a revised escalation policy may require a different decision than the previous policy. A refreshed retrieval index may surface newer evidence. Updated account data may change the correct recommendation.

Runtime context drift becomes a downstream fault when the system fails to control, detect, explain, reproduce, or evaluate the behavioral consequences of changed runtime conditions.

## Boundary with nondeterminism


Runtime context drift is also distinct from model nondeterminism.

```text
Model nondeterminism:
  The same effective runtime scenario can produce different outputs because
  generation or execution is stochastic or unstable.

Runtime context drift:
  The effective runtime scenario was not actually the same.
```


When an output changes across runs, nondeterminism is only one possible explanation. The first diagnostic question should be whether the full runtime scenario was actually unchanged.

# C5b. Recursive Feedback and Data-Action Coupling

## Core feature


AI systems can influence the future data, state, and operating conditions under which they later behave.

A system output may not end when it is shown to a user. It may be stored, copied, edited, approved, rejected, indexed, summarized, logged, rated, used as training data, written into memory, or promoted into an authoritative source. User reactions to the output may also become data. In agentic systems, external actions may change records, tickets, documents, messages, permissions, rankings, workflows, or other state that later becomes part of the system's runtime context.

The result is a recursive feedback loop:

```text
system behavior
→ user reaction or external action
→ data capture or state change
→ memory, retrieval, analytics, evaluation, policy, or training update
→ changed future system behavior
```


This feature is not merely that context changes over time. It is that the AI system participates in producing the future context.

Recursive feedback can be beneficial when governed. It enables adaptation, personalization, continuous improvement, and regression discovery. It becomes dangerous when the system cannot distinguish reliable external signal from its own generated residue, weak user feedback, contaminated state, or automation-shaped data.

## Feedback-loop variants


Recursive feedback loops can be intentional or hidden.

### Intentional feedback loops


Intentional feedback loops are designed into the system. They may be beneficial when the captured signal is reliable, well-scoped, and governed.

Examples include:

```text
User ratings:
  thumbs up/down, star ratings, explicit corrections, satisfaction scores.

Preference learning:
  remembered user preferences, personalization data, ranking feedback.

Human review:
  reviewer approvals, edits, labels, escalations, adjudications.

Product analytics:
  clicks, dwell time, abandonment, conversion, repeated queries.

Evaluation improvement:
  failed production cases added to regression suites.

Fine-tuning:
  approved examples, corrected outputs, labeled conversations, expert demonstrations.

Policy improvement:
  incidents and edge cases used to refine safety, compliance, or escalation rules.
```


Intentional feedback is not inherently bad. It is often necessary for system improvement. The risk is that noisy, biased, synthetic, stale, or weakly interpreted signals can be treated as reliable evidence.

### Hidden or implicit feedback loops


Hidden feedback loops are not designed as learning mechanisms, but still change future behavior.

Examples include:

```text
AI-written notes: assistant-generated summaries are stored in CRM, ticket, medical, legal, or project records and later retrieved as authoritative history.

AI-authored documentation: generated answers are copied into a knowledge base and later used as retrieval evidence.

Memory writes: inferred user preferences or facts are stored without strong validation and later shape personalization.

Workflow side effects: an agent labels, routes, closes, prioritizes, or updates records, causing future systems to treat those changes as ground truth.

Search and ranking exposure: recommendations affect what users see, and user interactions with exposed items reinforce future rankings.

Training contamination: model-generated outputs enter future training, evaluation, or prompt improvement datasets without provenance controls.

Evaluation contamination: production outputs or model-assisted labels leak into benchmark examples, making future evaluation less independent.
```


Hidden feedback loops are especially risky because teams may interpret future behavior as evidence of external reality when it is partly evidence of the system's own prior behavior.

## Data feedback versus action feedback


Feedback loops can operate through data, actions, or both.

### Data feedback


Data feedback occurs when outputs or reactions become future informational inputs.

```text
system answer
→ user copies it into documentation
→ documentation is indexed
→ future answers retrieve it
```


The main risk is that generated or weakly validated content becomes future evidence.

### Action feedback


Action feedback occurs when the system changes external state, and that changed state later affects behavior.

```text
agent triages a ticket as low priority
→ low-priority tickets receive slower handling
→ future analytics show lower urgency
→ the system becomes more likely to classify similar tickets as low priority
```


Common action-feedback surfaces include: - ticket routing; - record updates; - calendar changes; - messages sent; - labels assigned; - permissions changed; - recommendations shown; - accounts flagged; - issues closed; - tasks created; - documents edited; - workflows triggered.

The main risk is that the system's own actions change the data-generating process.

## Evidence laundering


A particularly important feedback-loop failure is evidence laundering.

```text
An unsupported AI output is stored as ordinary data. Later, the system retrieves that stored data as evidence. The same unsupported claim now appears grounded because it has acquired the form of a source.
```


This can happen through documentation, CRM notes, tickets, internal wikis, generated reports, code comments, summaries, or user-visible answers copied into authoritative systems.

Evidence laundering is dangerous because the failure becomes harder to detect over time. The later system may not be hallucinating in the narrow sense; it may be faithfully using a contaminated source.

## State degradation


Recursive feedback can also degrade operational state.

```text
A support assistant omits risk signals from case summaries.
Those summaries become the durable customer history.
Future triage sees fewer risk signals than actually occurred.
Escalation quality degrades over time.
```

```text
An agent repeatedly labels ambiguous requests as low priority.
Low-priority handling reduces follow-up evidence.
Future analytics understate the true severity of similar requests.
The classifier’s decision boundary shifts toward under-escalation.
```

```text
A memory system stores inferred preferences too aggressively.
Future recommendations are shaped by weak assumptions.
User behavior becomes narrower because the system keeps reinforcing
the same inferred profile.
```


State degradation is not simply stale data. It is accumulated distortion caused by system-mediated writes, omissions, labels, summaries, or actions.

## Engineering consequences


Systems with recursive feedback require controls over what is written, remembered, indexed, learned from, or treated as evidence.

A click, rating, edit, acceptance, copied answer, stored summary, or user reaction is not automatically ground truth. It is an observation produced inside a system that may already shape what the user saw, believed, clicked, accepted, or corrected.

# C5c. Change Non-Locality

## Core feature


AI-system changes do not have guaranteed local behavioral effects.

A bounded change to one part of an AI system may alter behavior outside the case, slice, workflow, or component that motivated the change. The change may appear local in implementation terms, but its behavioral effects can propagate through shared prompts, policies, retrieval paths, schemas, tools, memory, routing logic, model behavior, state, and downstream consumers.

This is **change non-locality**: the blast radius of a change cannot be inferred only from the apparent locality of the edit.

```text
Local change:
  A bounded modification to one system element, such as a model version,
  prompt, retrieval index, policy, schema, tool definition, memory behavior,
  routing rule, rubric, or orchestration step.

Expected local effect:
  The change affects only the intended case, slice, workflow, or behavior.

Change non-locality:
  The change also affects other cases, slices, workflows, decisions, outputs,
  tool paths, or downstream behaviors that were not directly targeted.
```


The engineering consequence is simple:

```text
The edit boundary is not the impact boundary.
```


A change that is syntactically small may still have broad behavioral impact if it touches a shared or semantically influential control surface.

## Why this belongs in Layer 1C


Change non-locality is a system-level causal feature of AI applications.

It explains why "we only changed one thing" is often not a safe assumption about impact scope. The implementation change may be local, but the behavioral effect may not be.

Example:

```text
Targeted fix:
  Add a stronger refusal instruction for one risky support workflow.

Intended effect:
  The assistant refuses unsafe account-recovery requests.

Non-local effects:
  benign account-help requests now over-refuse;
  escalation rates change in adjacent support categories;
  retrieved policy evidence is cited less consistently;
  agents receive fewer actionable summaries;
  downstream routing decisions become more conservative.
```


The edit was local. The behavioral effect was not.

This does not mean the change was bad. It means the impact boundary could not be inferred from the edit boundary. The impact scope had to be estimated, tested, and monitored.

## Why change effects become non-local


AI systems are weakly behaviorally local because many of their control surfaces are shared, semantic, probabilistic, and interaction-dependent.

## What it explains downstream


Change non-locality contributes to fault modes involving:

```text
hidden regressions;
prompt fixes that break adjacent tasks;
model upgrades that shift tool-use behavior;
policy updates that increase over-refusal;
retrieval changes that alter grounding outside the target slice;
schema changes that preserve valid format but alter action semantics;
routing updates that change downstream behavior in unexpected workflows;
safety patches that degrade benign completion;
memory changes that affect personalization or authorization behavior;
tool changes that alter planning, recovery, or stopping behavior;
evaluation gains on one slice accompanied by degradation elsewhere.
```


The common pattern is that a change succeeds on the motivating case but causes degradation, drift, or semantic change elsewhere.

## Important boundary


Change non-locality is not itself a regression.

```text
Change non-locality:
  A local change affects behavior outside the directly targeted area.

Regression:
  The changed behavior is worse relative to an acceptance standard.
```


A non-local effect may be positive, negative, or neutral. For example, a better grounding instruction may improve citation behavior across many workflows. That is still non-local, but not a fault.

Change non-locality becomes a downstream fault when the broader effects are harmful, unmeasured, unexplained, or inconsistent with the intended change.

## Boundary with runtime context drift


Change non-locality is distinct from runtime context drift.

```text
Runtime context drift:
  The same visible input runs under different hidden execution conditions.

Change non-locality:
  A local change produces effects outside the directly targeted case, slice,
  workflow, or component.
```


Runtime context drift is about whether two runs are comparable.

Change non-locality is about the impact scope of a change.

A single incident may involve both. For example, a retrieval index update changes the runtime context for many tasks, and that local retrieval change then produces non-local behavioral effects across workflows that were not directly targeted.

## Boundary with ordinary software coupling


Change non-locality is not unique to AI systems. Conventional software can also have coupling, side effects, and regressions.

The AI-specific issue is that behavioral locality is weaker and harder to reason about because the system's behavior is mediated by semantic, learned, probabilistic, and context-sensitive components.

```text
Ordinary software coupling:
  A code change affects another component through explicit dependencies,
  shared state, API contracts, or control flow.

AI-system change non-locality:
  A change affects other behavior through shared prompts, latent model
  generalization, retrieved context, policy interpretation, tool interaction,
  memory, state, runtime context, threshold decisions, and semantic acceptance
  criteria.
```


This makes impact analysis less reducible to static dependency analysis. The dependency graph is not only code-level. It is also semantic, behavioral, and operational.

## Relationship to downstream layers


Change non-locality explains why downstream evaluation and governance must be slice-based, regression-oriented, and change-aware.

```text
Layer 2 evaluation view:
  Detect whether a change affected behavior across versions, slices,
  workflows, and time.

Layer 3 semantic fault view:
  Determine whether the changed behavior preserved meaning, grounding, action
  correctness, safety, policy compliance, and downstream usability.

Layer 3 system-fault view:
  Classify harmful non-local effects as hidden regression, change-management
  failure, evaluation gap, observability gap, or release-governance failure.
```


C5c is therefore not the hidden regression itself. It is the Layer 1C causal feature that explains why hidden regressions can arise from apparently local changes.

# C6. Weak Native Observability and Attribution

## Core feature


AI systems often do not naturally expose a clean causal explanation for their behavior.

When a system produces a wrong, unsafe, unsupported, inconsistent, or unexpected output, the final answer usually does not reveal what the cause was.

As a result, production diagnosis requires explicit instrumentation. Without traces, evidence capture, runtime metadata, and attribution signals, teams are left inferring causes from the final output alone, which is usually insufficient.

AI systems are weakly observable in two related senses:

```text
System-level weak observability:
  The deployed system does not automatically expose which component or
  evidence source shaped the outcome.

Model-level interpretability limits:
  The model's internal computation is not fully transparent, and generated
  explanations are not guaranteed to be faithful accounts of why the model
  produced a particular output.
```


C6 is primarily about the first issue: observability and attribution in deployed AI systems.

The second dimension defines an important boundary: even strong system traces do not fully explain the model's internal decision process.

## Canonical statement


AI systems are weakly observable by default. A final output does not expose the full causal path through the deployed system, and model-generated explanations are not reliable evidence of the model's internal reasoning. Reliable debugging, evaluation, governance, and incident response therefore require explicit instrumentation: traces, prompt and context capture, evidence provenance, tool-call logs, policy decisions, runtime metadata, state transitions, and failure attribution. These mechanisms improve system-level diagnosis while recognizing that model internals remain only partially interpretable.

## Engineering consequences


C6 means observability must be designed into the AI delivery system, not added only after failures occur. The goal is to make enough of the system behavior observable that teams can debug, audit, compare, reproduce, and govern the deployed system responsibly.

## Important boundary


C6 is not the same as poor observability as a system defect.

```text
C6 feature:
  AI systems are not naturally self-explaining or fully traceable.

Layer 3 system fault:
  The product failed to capture prompts, traces, evidence, tool calls,
  policy decisions, intermediate outputs, runtime metadata, or state changes.
```


C6 is also distinct from model interpretability.

```text
Model interpretability:
  Attempts to explain the model's internal computation, representations,
  circuits, learned features, or activation patterns.

System observability:
  Captures externally visible inputs, components, intermediate artifacts,
  runtime conditions, and outputs so failures can be diagnosed at the
  deployed-system level.
```


Even if model internals remain partially opaque, system-level observability can still diagnose many production failures.

Conversely, even strong system-level traces do not fully explain the model's internal decision process.

C6 is therefore the Layer 1C feature that AI systems require explicit observability and attribution mechanisms because neither the deployed pipeline nor the model itself is naturally transparent enough for reliable debugging, governance, and incident analysis.

# C7. Policy and Trust Boundary Mediation

## Core feature


AI systems often operate under safety, compliance, privacy, brand, legal, or operational boundaries. These boundaries are mediated by a combination of learned model behavior, prompts, policy layers, retrieval controls, tool permissions, validators, user experience design, and human oversight.

The system may need to regulate:

- sensitive data exposure;
- legal, medical, financial, or safety advice;
- protected-class or fairness-sensitive content;
- confidential internal context;
- user authentication and authorization;
- tool access;
- external actions;
- irreversible actions;
- brand and tone constraints;
- escalation or refusal behavior;
- audit logging;
- human approval thresholds.

## Canonical statement


> AI-system safety and trust boundaries are not enforced by the base model alone; they are mediated across model behavior, prompts, policy controls, tool authorization, validation, and product design.

## Why this belongs in Layer 1C


The base model does not inherently know the full business, legal, security, or user-trust boundary of a product. The system must encode and enforce those boundaries through multiple layers.

For example, an agent that can send emails, update records, execute code, or trigger business processes requires stronger controls than a passive question-answering assistant.

Policy mediation may include:

- system instructions;
- retrieval filters;
- content classifiers;
- tool permissioning;
- action confirmation;
- schema constraints;
- post-generation validation;
- sensitive-data redaction;
- audit logging;
- human-in-the-loop escalation;
- refusal and safe-completion behavior.

## What it explains downstream


C7 contributes to fault modes involving:

- leaking sensitive data;
- unauthorized recommendations;
- unsafe advice;
- over-refusal;
- under-refusal;
- unsafe tool use;
- irreversible actions taken too easily;
- policy inconsistency;
- exposing internal prompts or confidential context;
- weak escalation behavior;
- brand or compliance violations.

## Important boundary


C7 is not itself a safety failure. It is the causal feature that safety behavior is mediated across multiple model and system layers.

It interacts strongly with:

```text
A5 In-Band Control/Data Representation
B1 Learned Natural-Language Task Induction
C3 Compositional Pipeline Structure
C4 Agentic State-Action Interface
C6 Weak Native Observability and Attribution
```


A safety incident belongs downstream, usually as a Layer 2 fault mode, Layer 3 system fault, or Layer 4 user/business impact.

# C8. Quality-Cost-Latency-Reliability Operating Envelope

## Core feature


AI systems operate inside practical resource and reliability constraints. The quality of system behavior is shaped by the amount of computation, context, retrieval, tool use, validation, monitoring, retry logic, and human review the system is allowed to use for a given task.

Higher-quality behavior may require more resources:

- stronger models;
- longer context windows;
- more retrieval;
- better ranking or reranking;
- more tool calls;
- multiple model passes;
- verifier or critic passes;
- structured validation;
- citation or grounding checks;
- retries and fallbacks;
- human review;
- fuller trace capture;
- stricter policy checks.

These interventions can improve answer quality, grounding, safety, or task completion. But they also consume operational budget and can increase:

- latency;
- token usage;
- cost per task;
- timeout probability;
- infrastructure load;
- tool-call failure exposure;
- orchestration complexity;
- retry amplification;
- user waiting time;
- monitoring and storage cost;
- human-review burden.

The system therefore does not optimize for maximum theoretical quality. It operates within an envelope of acceptable quality, acceptable latency, acceptable cost, acceptable reliability, and acceptable risk.
