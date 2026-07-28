---
draft: false
toc: true
title: "Taxonomy"
linkTitle: "Taxonomy"
---

The trace plays several roles simultaneously: execution boundary, evidence record, causal structure, unit of analysis, provenance mechanism, and bridge between runtime behavior and evaluation.

trace, collecting traces

observability platform

openai terminology: "How would you build a golden set and graders for this workflow, and how would you avoid brittle scoring?"}

Evaluation Cases and Datasets

evaluation ontology. An evaluation ontology is the set of categories used to describe success and failure.

test oracle; LaJ; judge; evaluator;

datapoint;

## Behavioral evidence


The team needs sufficient evidence to reconstruct the execution and its consequences. Evidence is an engineered representation of behavior. Instrumentation determines what the team can later know. Missing appointment identifiers, omitted tool arguments, or absent downstream outcomes can make an observed failure impossible to explain.

## Traces as the Evidence Model for Evaluation


The fundamental starting point in an evaluation process is determining what evidence is required to understand and assess system behavior. The trace format should be derived from those information requirements.

A trace serves several related roles:

- **Execution boundary** -- defines the unit of behavior being examined, such as a request, user turn, agent run, workflow, or multi-turn task.
- **Evidence record** -- captures the inputs, context, information sources, actions, intermediate results, outputs, and runtime conditions associated with that execution.
- **Behavioral structure** -- preserves the temporal and causal relationships between operations, making it possible to reconstruct how the system reached a result.
- **Correlation layer** -- connects model calls, retrieval operations, tool executions, application logic, user interactions, and downstream systems.
- **Unit of analysis** -- provides an object that can be searched, filtered, reviewed, annotated, compared, and grouped into failure modes.
- **Provenance mechanism** -- records the versions, configurations, dependencies, and data that influenced the execution.
- **Evaluation substrate** -- supplies the evidence to which human judgments, automated evaluators, outcomes, and regression analyses can be attached.

A trace can therefore be defined as:

> A trace is a structured record of a bounded AI system execution that connects its inputs, governing context, information sources, decisions, actions, outputs, runtime conditions, and associated outcomes.

The trace boundary should correspond to the behavior being evaluated. For a simple assistant, one trace may represent a single user turn. For an agentic system, it may represent an entire task involving multiple model calls, tools, retries, and user interactions.

## Trace Taxonomy


A mature execution model usually distinguishes the following entities.

### Trace


A **trace** represents one bounded execution of the system.

Its boundary may correspond to:

- an API request
- a conversational turn
- an agent run
- a workflow execution
- a multi-turn task
- a business process initiated by an AI interaction

The trace is the top-level correlation object. It groups the operations and evidence relevant to the behavior being investigated or evaluated.

### Span


A **span** represents one operation within the trace.

Examples include:

- invoking a model
- retrieving documents
- selecting a tool
- executing a tool
- validating an output
- applying deterministic business logic
- generating the final response

Spans usually have start and end times and may form parent-child relationships. This structure describes the execution path and the dependencies between operations.

### Event


An **event** represents a notable point-in-time occurrence within a trace or span.

Examples include:

- a retry
- a timeout
- a guardrail rejection
- a fallback activation
- a cache hit
- a human handoff
- a state transition

Events record occurrences that matter for interpretation without necessarily representing full-duration operations.

### Artifact


An **artifact** is a data object consumed, produced, or referenced during execution.

Examples include:

- a user message
- a system prompt
- conversation history
- retrieved documents
- tool arguments
- tool results
- structured model output
- generated text
- intermediate state
- validation results

Artifacts may be stored directly in the trace or referenced through identifiers when they are large, sensitive, or managed by another system.

### Outcome


An **outcome** is an observed consequence associated with the execution.

Examples include:

- a tour was booked
- a transaction completed
- a user accepted the answer
- a support ticket was resolved
- the user abandoned the workflow
- an appointment was attended
- a downstream system rejected the generated data

Outcomes may occur after the trace has completed and may originate from external business systems. They should remain linked to the trace because they often provide the strongest evidence of task success.

### Evaluation


An **evaluation** is a judgment applied to a trace, span, artifact, or outcome.

Examples include:

- correctness score
- task-completion result
- groundedness assessment
- policy-compliance classification
- tool-selection accuracy
- human quality label
- regression result
- business-success criterion

Evaluations are derived from execution evidence and explicit criteria. They should be modeled separately from the trace data so that multiple evaluators, versions, and judgments can be applied to the same execution.

## Example

```text
Trace: Schedule a property tour
│
├── Trace context
│   ├── User and session identifiers
│   ├── Prompt version
│   ├── Model configuration
│   └── Available tool definitions
│
├── Span: Interpret the request
│   ├── Artifact [input]: User message
│   ├── Artifact [context]: Conversation history
│   ├── Artifact [context]: System instructions
│   └── Artifact [output]: Structured scheduling intent
│
├── Span: Retrieve property availability
│   ├── Artifact [input]: Property and date constraints
│   ├── Artifact [output]: Tool arguments
│   └── Artifact [output]: Available time slots
│
├── Span: Select a time slot
│   ├── Artifact [input]: Available slots
│   └── Artifact [output]: Selected slot
│
├── Span: Create the appointment
│   ├── Artifact [output]: Scheduling API arguments
│   ├── Event: API retry
│   └── Artifact [input]: Appointment confirmation
│
└── Span: Generate the final response
    ├── Artifact [input]: Appointment confirmation
    └── Artifact [output]: Assistant message

Linked outcome:
└── Tour successfully booked

Linked evaluations:
├── Intent classification: Pass
├── Tool arguments valid: Pass
├── Response grounded in tool result: Pass
└── End-to-end task completion: Pass
```

## Trace Boundaries and Conversational Turns


A conversational turn and a trace are separate concepts.

In a simple request-response application, one user turn may correspond to one trace. Other architectures may use different boundaries:

- one turn may initiate several linked traces
- one trace may include several model calls and tool operations
- one trace may span multiple conversational turns
- asynchronous work may continue in child or linked traces
- a business outcome may be attached after the original trace has completed

The appropriate trace boundary depends on the behavior and outcome being evaluated.

## Relationship to AI Observability and Evaluation


AI observability provides the mechanisms for capturing, correlating, storing, searching, and inspecting traces.

The evaluation subsystem uses those traces to:

- identify failure modes
- collect representative examples
- annotate behavior
- construct evaluation datasets
- apply automated and human evaluators
- compare system versions
- monitor production quality
- connect system behavior to user and business outcomes

The trace is therefore the primary evidence record connecting runtime execution with evaluation. Its design should begin with the questions the evaluation system must answer and the evidence required to answer them.

:::

This version also separates **outcome** from **evaluation**: an outcome describes what happened after the execution, while an evaluation expresses a judgment about the execution or its outcome.
