---
draft: false
toc: true
title: "Var"
linkTitle: "Var"
---
## actions


- extract prescriptive knowledge

## questions


- how to define and specify AI System and it's behaviour. Real and actual.
- define our goals conceptual hierarchy, like successful delivery, implementing features
- how we understand the AI system state (define current state; past behaviour)

what is explicitly borrowed from grounded theory from what is merely compatible with it, then assess where the adaptation changes the method.

and find main / important differences or improvements

The **starting-dataset procedure and the subsequent error analysis form one integrated, failure-oriented variant of grounded theory**.

The important qualification is that this is **grounded-theory-inspired engineering analysis**, rather than a full grounded theory study. Its intended product is an operational taxonomy and evaluation system, not a social-scientific theory.

## Conceptual Model

## Operating model

### Building the Cycles


10 Iterate Monthly on New Data: Use evals to improve product. Review traces where evals caught issues. Fix underlying problems. Then do error analysis again on new traces. Build new evals as needed. Your eval suite grows with your product. After a few months, you'll have 2-3 code evals.

### Ownership


PMs Must Own Error Analysis: This is not engineering work to delegate. Engineers don't have domain expertise to know if product experience is good. You understand user needs. You have product taste. Teams shipping the best AI products have PMs who've personally reviewed hundreds of traces.

## 2. Fundamental AI-evaluation problems


The original four problems should be expanded into eight. These are derived from the uncertainties that AI engineering has to manage, rather than from the sequence of activities performed by an evaluation platform.

| Fundamental problem                              | AI-engineering condition                                                     | Required result                                                                                              |
| ------------------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1. Quality and decision modeling                 | Product intent is abstract, incomplete, contextual, and multi-objective      | Explicit outcomes, constraints, trade-offs, failure severity, and decision criteria                          |
| 2. Evaluation scope and coverage                 | The operating space is open-ended, uneven, and changing                      | A defined evaluation population, scenario portfolio, sampling model, and coverage claims                     |
| 3. Behavioral evidence                           | Product behavior emerges across executions, components, and external systems | Reconstructable traces, state transitions, outcomes, provenance, and version information                     |
| 4. Judgment operationalization                   | Many behaviors lack a deterministic correctness oracle                       | Validated human, code-based, task-level, and model-based evaluation procedures                               |
| 5. Behavioral characterization and inference     | Individual case judgments do not directly establish product quality          | Scoped metrics, segment analysis, uncertainty estimates, and system-level claims                             |
| 6. Failure discovery and diagnosis               | Failures are emergent and can have several plausible causes                  | Known failure modes, newly discovered failures, and actionable causal hypotheses                             |
| 7. Product decision and change control           | Changes can produce non-local improvements, regressions, and trade-offs      | Prioritization, release decisions, comparison of alternatives, and regression control                        |
| 8. Lifecycle adaptation and evaluation integrity | Products, users, distributions, criteria, and evaluators all change          | Monitoring, refresh, versioning, calibration, drift detection, and protection against evaluation overfitting |

Application evaluation can be understood as eight related engineering problems:

1. Quality and decision modeling
2. Evaluation scope and coverage
3. Behavioral evidence
4. Judgment operationalization
5. Behavioral characterization and inference
6. Failure discovery and diagnosis
7. Product decision and change control
8. Lifecycle adaptation and evaluation integrity

The three-loop lifecycle then follows naturally:

- the **Product Improvement Loop** changes the AI product;
- the **Evaluation Knowledge Loop** changes the team's explicit model of quality, scope, failure, and judgment;
- the **Evaluation Infrastructure Loop** changes the machinery used to capture evidence and execute evaluation.

The existing pyramid, online/offline planes, and data flywheel can remain beneath this framing. The uploaded model already separates these architectural dimensions: loops define what evolves, the pyramid defines how behavior is measured, the planes define where evaluation runs, and the flywheel connects them over time.

## useful phrases and moments to future


phrase: systematic process of improving your product: Maybe you're doing that through dog-fooding or maybe you're doing it through the **systematic process** that we're about to walk you through, but you have to do them.

Note Observability != Data Collection -> we should do what??

how to do application-specific evals?

positioning and problem: Evals, it's about actually improving your product. <- illustrate this by catch; when you're think that you've improve, but not; how it could be: using the wrong metrics so something improved, but not essential..

The most important thing that you're going to want to have is to take notes on your traces

What do we need? Information about

Yes. The process is better represented as an **iterative learning and control cycle**. The initial observability configuration is a provisional hypothesis about what evidence will be useful. Trace review then reveals both behavioral failures and deficiencies in the evidence being captured.

The source already contains the elements of this loop: collect traces, inspect them, discover and categorize failures, build and validate evaluators, improve the application, and repeat on new production data. Its numbered presentation makes the workflow appear more linear than it actually is.

## Steps Remnants

### 01 Start With Observability


Before evals, you need traces. Instrument your code to log every user input, LLM call, tool call, and output. Use Brain Trust, LangSmith, Arize, or build your own. The tool doesn't matter. What matters is capturing traces and being able to take notes on them for error analysis.

### 02 Review 100 Traces Manually


Open your trace viewer. Read user message, check tool calls, read AI response. Note any problems you see. Takes 30 seconds per trace. Do 100 traces in 2-3 hours. Don't try to catch everything. Just write what you see and move on.

### 03 Categorize Errors With Axial Coding


Export your 40-50 notes to CSV. Feed to Claude or ChatGPT. Ask for 5-6 categories. Refine from vague ("temporal issues") to specific ("date formatting errors"). Label every error with a category. Use pivot table to count occurrences. Now you have data to prioritize what to fix.

### 04 Count and Prioritize With Evidence


How many times does each category appear? "Conversational flow issues: 15 occurrences. Human handoff failures: 8." You went from "we have some errors" to "conversational flow is our biggest problem at 15%." Now you can prioritize with evidence instead of guessing.

### Fix Obvious Issues First


Some problems don't need evals. Markdown in text messages? Add "never use markdown" to prompt. Missing a tool? Add it or document limitation. Knock out easy wins first. This builds momentum before you invest time building sophisticated judges.

## Unit of Evaluation: The End-to-End Execution Result


The primary unit of evaluation is the **end-to-end execution result**.

An end-to-end execution begins with a user intent and an initial system state. It includes the product's complete trajectory through retrieval, model reasoning, tool use, and business logic. It ends with both a user-visible response and a resulting external state or outcome.

```text
User intent + Initial state
            ↓
Product execution
            ↓
Response + Final state + Outcome
```


The evaluation question is:

> Did the complete execution produce the correct result under the applicable constraints?

Lower-level checks remain important. A team may inspect a model response, tool call, retrieval result, or individual step. These checks explain and localize behavior, but they support evaluation of the end-to-end result rather than replacing it.

In the rescheduling example, the final response, tool selection, tool arguments, and booking state are all relevant. The execution succeeds only when the original appointment is updated correctly and the assistant accurately communicates that result.

## Adoption Strategy

### Phase 1: Bootstrap


Implement:

- minimal tracing;
- a basic trace viewer or export;
- manual annotation;
- a small representative sample;
- open-ended error notes.

Avoid premature platform complexity.

### Phase 2: Structure


Introduce:

- failure categories;
- annotation guidelines;
- frequency and severity analysis;
- versioned example sets;
- deterministic checks for simple failures.

### Phase 3: Automate


Introduce:

- model-based evaluators for subjective criteria;
- evaluator-validation datasets;
- positive and negative performance measurement;
- regression execution in development and CI;
- scheduled scoring of production samples.

### Phase 4: Operationalize


Introduce:

- cohort-aware sampling;
- quality dashboards;
- release gates;
- drift detection;
- evaluator ownership and versioning;
- evaluation incident review;
- links between production findings and regression cases.

### Phase 5: Continuously refine


Periodically reassess:

- whether traces contain the required evidence;
- whether the taxonomy represents current failures;
- whether evaluation datasets match current traffic;
- whether evaluators remain calibrated;
- whether existing metrics still correspond to product goals.

The source describes periodic review of new traces and expansion of the evaluation suite as the product changes. It also notes that new user cohorts and document types can introduce new data distributions requiring additional analysis.

# other

## The central idea


A useful formulation is:

> We begin with an initial model of the system, its expected behavior, and the evidence required to evaluate it. We instrument the application using a minimal default trace schema. As traces are collected and reviewed, we refine the application, the instrumentation, the evaluation criteria, the datasets, and the evaluators.

This creates several interconnected feedback loops rather than a single trace-to-evaluator pipeline.

```text
Expected behavior and risk hypotheses
                 │
                 ▼
 Initial evaluation requirements
                 │
                 ▼
 Minimal instrumentation and tracing
                 │
                 ▼
 Representative execution data
                 │
                 ▼
 Human review and error analysis
                 │
                 ▼
 Findings and evidence gaps
                 │
       ┌─────────┼──────────┬─────────────┐
       ▼         ▼          ▼             ▼
 Application  Observability  Evaluation   Sampling and
 behavior     instrumentation assets      monitoring
       │         │          │             │
       └─────────┴──────────┴─────────────┘
                 │
                 ▼
       Validation and deployment
                 │
                 └───────────────↺
```

## What changes during each iteration


Trace analysis can reveal several different classes of findings.

### 1. Product behavior problems


The available evidence is sufficient, and the system behaved incorrectly.

Examples:

- the assistant ignored a user constraint
- the wrong tool was selected
- a virtual tour was promised when only in-person tours exist
- the system created a second booking instead of rescheduling
- the response used markdown in an SMS channel

This leads to changes in:

- prompts
- tool definitions
- orchestration
- application logic
- workflow constraints
- user experience
- human-handoff rules

### 2. Observability gaps


The reviewer cannot determine why the system behaved as it did because relevant information was not captured.

Examples:

- the prompt version is missing
- retrieved documents are not recorded
- tool arguments are unavailable
- the system does not record whether a booking succeeded
- there is no link between a model response and its downstream user outcome
- application routing decisions are hidden

This leads to changes in:

- trace structure
- span boundaries
- logged events
- execution metadata
- version identifiers
- business-outcome capture
- correlation and lineage

An inability to evaluate a trace is itself a useful finding: the evidence model is incomplete.

### 3. Evaluation-definition gaps


The team can see what happened but has not yet defined whether it is acceptable.

Examples:

- there is no agreed handoff policy
- "good conversational flow" remains vague
- the expected behavior for unavailable inventory is unclear
- the team disagrees about whether partial completion is acceptable

This leads to changes in:

- quality criteria
- product policies
- failure taxonomies
- annotation guidelines
- evaluation rubrics

### 4. Evaluation coverage gaps


A newly discovered failure is not represented in the evaluation suite.

This leads to changes in:

- regression datasets
- adversarial cases
- positive and negative examples
- deterministic checks
- LLM judges
- human-review queues

### 5. Evaluator-quality problems


The evaluator does not align sufficiently with expert judgment.

Examples:

- it misses true failures
- it produces too many false alarms
- its criteria are ambiguous
- it depends on information absent from the trace
- its results vary excessively

This leads to changes in:

- evaluator prompts
- examples
- output schemas
- judge models
- thresholds
- validation datasets
- TPR and TNR measurement

### 6. Sampling gaps


The reviewed traces do not adequately represent actual usage.

Examples:

- only successful conversations are sampled
- rare but severe failures are missing
- one channel dominates the dataset
- new customer cohorts behave differently
- long-running conversations are underrepresented

This leads to changes in:

- sampling strategy
- cohort definition
- trace selection
- production monitoring
- synthetic-data generation

## The full evaluation cycle


A coherent version of the complete process would be:

### 1. Frame expected behavior


Define:

- target user outcomes
- acceptable and unacceptable behavior
- high-risk failure modes
- system boundaries
- evaluation units

The evaluation unit might be a model call, conversation turn, workflow, complete conversation, or downstream outcome.

### 2. Establish initial evaluation observability


Instrument enough of the system to reconstruct an execution:

- inputs and user context
- governing instructions
- retrieved information
- tool interactions
- decisions and actions
- outputs
- operational metadata
- outcomes

This is the initial evidence contract.

### 3. Collect representative executions


Use:

- production traffic
- internal dogfooding
- design-partner usage
- curated scenarios
- synthetic user simulations

The source itself later acknowledges that traces can be bootstrapped through dogfooding or synthetic inputs when production data does not yet exist.

### 4. Inspect and annotate traces


Domain experts review executions and record:

- observed failures
- unexpected behavior
- successful patterns
- missing evidence
- ambiguous requirements

The review should remain exploratory at first. Prematurely forcing observations into fixed categories can hide unknown failure modes.

### 5. Build and refine the failure taxonomy


Convert open observations into operational categories.

A useful category should be:

- identifiable
- sufficiently specific
- consistently labelable
- connected to a possible intervention
- meaningful for prioritization

### 6. Prioritize interventions


Prioritization should consider more than frequency:

```text
Priority ≈ Frequency × Severity × Exposure × Detectability
```


A rare legal, safety, or financial failure may outrank a frequent formatting problem.

### 7. Decide how each problem should be handled


Each category can produce a different response:

- fix immediately
- instrument more deeply
- clarify product behavior
- add a deterministic check
- build an LLM evaluator
- add human review
- accept and document the limitation
- monitor for further evidence

This preserves Hamel and Shreya's point that every discovered problem does not require an automated evaluator.

### 8. Encode durable failures into evaluation assets


Recurring or high-risk failures become:

- labeled datasets
- regression cases
- code evaluators
- model-based judges
- acceptance criteria
- CI checks
- online quality monitors

### 9. Validate the evaluation mechanism


Validate automated evaluators against expert labels.

For binary evaluators, this includes independently measuring:

- true-positive rate
- true-negative rate
- stability
- cost
- latency
- cohort-specific performance

### 10. Improve, deploy, and collect new evidence


Use evaluation results to change the application, deploy the changes, and collect new traces.

New traces may expose:

- regressions
- new failure modes
- changing user behavior
- missing instrumentation
- outdated evaluation criteria
- distribution shifts

The cycle then begins again.

## Start with the evaluation questions


Before deciding what to trace, ask:

1. **What behavior are we trying to understand?**
2. **What does successful behavior look like?**
3. **What information would let us explain why the system produced a particular result?**
4. **What evidence is needed to judge whether the result was acceptable?**
5. **At what level do we need to make that judgment: response, step, conversation, workflow, or business outcome?**

These questions determine the instrumentation.

For example, suppose an AI leasing assistant fails to book a tour. The final response alone may not explain the failure. We may need to know:

- what the user requested
- the conversation history
- the system instructions
- which property data was retrieved
- which tools were available
- whether a scheduling tool was called
- the arguments passed to that tool
- the tool result
- how the model interpreted that result
- the final response
- whether the user subsequently booked a tour

That is the behavioral evidence. A trace is the structure used to connect it.

## Two distinct information needs


It also helps to separate **explanation evidence** from **evaluation evidence**.

### Evidence for understanding behavior


This helps answer:

- Why did the system produce this result?
- Which component influenced it?
- What information was available?
- Where did the workflow diverge?

Typical evidence includes prompts, retrieval results, tool calls, routing decisions, and intermediate state.

### Evidence for evaluating behavior


This helps answer:

- Was the result correct?
- Did the task succeed?
- Was the answer grounded?
- Did it follow policy?
- Did it produce the intended user or business outcome?

Typical evidence includes reference answers, task expectations, human labels, user feedback, and downstream results.

There is substantial overlap, but they are not identical. A trace can be highly detailed and still lack the information needed to evaluate success. For example, it may show every model call but omit whether the customer ultimately booked the tour.
